import { getDeviceTimeZone } from '@/pages/api/unitls/timezone.js'

// 与扫描共用通用数据接口，仅使用独立的数据类型，不读写扫描记录或旧闹钟缓存。
export const MEDICATION_REMINDER_DATA_TYPE = 'MedicationReminder'
export const MAX_MEDICATION_REMINDERS = 20
export const MAX_MEDICATION_TIMES = 8
// iOS 通知铃不能循环，也不能超过 30 秒。用同一段闹钟音重复成这三档。
export const ALARM_SOUND_SECONDS = [2, 12, 24]
export const DEFAULT_ALARM_SOUND_SECONDS = 24

export function alarmSoundSeconds(item) {
	if (!item || item.sound !== 'alarm') return undefined
	const value = Number(item.soundSeconds)
	return ALARM_SOUND_SECONDS.includes(value) ? value : DEFAULT_ALARM_SOUND_SECONDS
}

export function normalizeMedicationClinical(value) {
	if (!value || typeof value !== 'object' || Array.isArray(value)) invalid('clinical')
	const text = (field, max = 120) => {
		const result = String(value[field] == null ? '' : value[field]).trim()
		if (result.length > max) invalid('clinical')
		return result
	}
	const clinical = {
		drugName: text('drugName'), classCode: text('classCode', 30), market: value.market === 'US' ? 'US' : 'CN',
		formulation: text('formulation'), strength: text('strength'), doseValue: text('doseValue', 30), doseUnit: text('doseUnit', 30),
		startAt: text('startAt', 10), endAt: text('endAt', 10), confirmed: value.confirmed === true,
		// 无后端审核药库时，本地录入一律待核验；不借用户确认冒充药师审核。
		reviewStatus: 'unverified', ingredients: []
	}
	for (const field of ['startAt', 'endAt']) if (clinical[field]) {
		const date = new Date(clinical[field] + 'T00:00:00Z')
		if (!/^\d{4}-\d{2}-\d{2}$/.test(clinical[field]) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== clinical[field]) invalid('clinical')
	}
	if (clinical.startAt && clinical.endAt && clinical.endAt < clinical.startAt) invalid('clinical')
	if (clinical.doseValue && (!Number.isFinite(Number(clinical.doseValue)) || Number(clinical.doseValue) <= 0)) invalid('clinical')
	if (value.ingredients !== undefined && (!Array.isArray(value.ingredients) || value.ingredients.length > 10)) invalid('clinical')
	clinical.ingredients = (value.ingredients || []).map(item => {
		if (!item || typeof item.name !== 'string' || item.name.length > 100) invalid('clinical')
		return { name: item.name.trim(), amount: String(item.amount || '').slice(0, 30), unit: String(item.unit || '').slice(0, 20) }
	})
	return clinical
}

function invalid(field) {
	const error = new Error('Invalid medication reminder: ' + field)
	error.field = field
	throw error
}

export function normalizeMedicationReminders(reminders) {
	if (!Array.isArray(reminders) || reminders.length > MAX_MEDICATION_REMINDERS) invalid('reminders')
	const ids = new Set()
	return reminders.map(item => {
		if (!item || typeof item.id !== 'string' || !item.id || item.id.length > 80 || ids.has(item.id)) invalid('id')
		ids.add(item.id)
		if (typeof item.name !== 'string' || !item.name.trim() || item.name.trim().length > 60) invalid('name')
		if (typeof item.dose !== 'string' || item.dose.length > 80) invalid('dose')
		if (typeof item.note !== 'string' || item.note.length > 200) invalid('note')
		if (typeof item.enabled !== 'boolean') invalid('enabled')
		const sound = item.sound === undefined ? 'system' : item.sound
		if (!['system', 'alarm', 'silent'].includes(sound)) invalid('sound')
		const soundSeconds = alarmSoundSeconds({ sound, soundSeconds: item.soundSeconds })
		if (!Array.isArray(item.times) || !item.times.length || item.times.length > MAX_MEDICATION_TIMES ||
			item.times.some(time => typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) ||
			new Set(item.times).size !== item.times.length) invalid('times')
		if (!Array.isArray(item.weekdays) || !item.weekdays.length || item.weekdays.length > 7 ||
			item.weekdays.some(day => !Number.isInteger(day) || day < 1 || day > 7) ||
			new Set(item.weekdays).size !== item.weekdays.length) invalid('weekdays')
		return {
			id: item.id, name: item.name.trim(), dose: item.dose.trim(), note: item.note.trim(),
			enabled: item.enabled, sound, ...(sound === 'alarm' ? { soundSeconds } : {}),
			times: item.times.slice().sort(), weekdays: item.weekdays.slice().sort((a, b) => a - b),
			...(item.clinical === undefined ? {} : { clinical: normalizeMedicationClinical(item.clinical) })
		}
	})
}

export function createMedicationReminderStore({ baseUrl, get, post, storage }) {
	const token = storage.getStorageSync('token')
	const userId = storage.getStorageSync('userid')
	const server = storage.getStorageSync('URL_APP_IP')
	const headers = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' }
	const isCurrent = () => !!token && !!userId && token === storage.getStorageSync('token') &&
		userId === storage.getStorageSync('userid') && server === storage.getStorageSync('URL_APP_IP')
	function assertAccount() {
		if (!isCurrent()) throw new Error('Medication reminder account changed')
	}
	async function readPlan() {
		assertAccount()
		const result = await get(baseUrl + '/prod-api/device/data/list', { dataType: MEDICATION_REMINDER_DATA_TYPE }, headers)
		assertAccount()
		if (!result || result.code !== 200 || !Array.isArray(result.rows)) throw new Error('Unable to load medication plan')
		if (!result.rows.length) return { version: 1, reminders: [], medicationStatus: 'unknown', confirmedAllDrugs: false, versions: [] }
		const row = result.rows[0]
		if (!row || row.dataType && row.dataType !== MEDICATION_REMINDER_DATA_TYPE) invalid('dataType')
		const plan = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
		if (!plan || plan.version !== 1) invalid('version')
		return {
			...plan, reminders: normalizeMedicationReminders(plan.reminders),
			medicationStatus: ['taking', 'not_taking'].includes(plan.medicationStatus) ? plan.medicationStatus : 'unknown',
			confirmedAllDrugs: plan.confirmedAllDrugs === true, versions: Array.isArray(plan.versions) ? plan.versions : []
		}
	}
	return {
		isCurrent,
		loadPlan: readPlan,
		async savePlan(reminders, details) {
			assertAccount()
			const normalized = normalizeMedicationReminders(reminders), old = await readPlan()
			const medicationStatus = ['taking', 'not_taking'].includes(details.medicationStatus) ? details.medicationStatus : 'unknown'
			const confirmedAllDrugs = medicationStatus === 'taking' && details.confirmedAllDrugs === true
			const clinicalItems = items => items.map(({ id, name, dose, times, weekdays, clinical }) => ({ id, name, dose, times, weekdays, clinical })).sort((a, b) => a.id.localeCompare(b.id))
			const signature = JSON.stringify({ medicationStatus, confirmedAllDrugs, items: clinicalItems(normalized) })
			const versions = old.versions.map(version => ({ ...version }))
			if (!versions.length || versions[versions.length - 1].signature !== signature) {
				const now = Date.now(), stamp = new Date(now).toISOString()
				// 保留旧方案快照；变更只追加版本，通知仍使用原提醒 id 和本地计划时间。
				if (!versions.length && old.reminders.length) versions.push({ id: 'legacy-' + now, recordedAt: stamp, startedAt: null, endedAt: stamp, legacy: true, items: old.reminders, medicationStatus: old.medicationStatus, confirmedAllDrugs: false })
				if (versions.length) versions[versions.length - 1] = { ...versions[versions.length - 1], endedAt: stamp }
				versions.push({
					id: 'regimen-' + now + '-' + Math.random().toString(36).slice(2), recordedAt: stamp, startedAt: stamp, endedAt: null,
					timezone: getDeviceTimeZone(), signature, items: normalized, medicationStatus, confirmedAllDrugs
				})
			}
			const plan = { ...old, version: 1, reminders: normalized, medicationStatus, confirmedAllDrugs, versions }
			assertAccount()
			const result = await post(baseUrl + '/prod-api/device/data/editData', { dataType: MEDICATION_REMINDER_DATA_TYPE, data: JSON.stringify(plan) }, headers)
			assertAccount()
			if (!result || result.code !== 200) throw new Error('Unable to save medication plan')
			return plan
		},
		async load() {
			assertAccount()
			const response = await get(baseUrl + '/prod-api/device/data/list', {
				dataType: MEDICATION_REMINDER_DATA_TYPE
			}, headers)
			assertAccount()
			if (!response || response.code !== 200 || !Array.isArray(response.rows)) {
				throw new Error('Unable to load medication reminders')
			}
			if (!response.rows.length) return []
			const row = response.rows[0]
			if (!row || (row.dataType && row.dataType !== MEDICATION_REMINDER_DATA_TYPE)) invalid('dataType')
			const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
			if (!data || data.version !== 1) invalid('version')
			return normalizeMedicationReminders(data.reminders)
		},
		async save(reminders) {
			const current = await readPlan()
			const plan = await this.savePlan(reminders, { medicationStatus: current.medicationStatus, confirmedAllDrugs: current.confirmedAllDrugs })
			return plan.reminders
		}
	}
}
