import { createMedicationReminderStore } from './medicationReminder.js'
import { normalizeBloodPressureSettings, activeBloodPressureReminders } from './bloodPressureReminder.js'

export const HEALTH_REMINDERS_CHANGED = 'HEALTH_REMINDERS_CHANGED'
// 每种设置/记录使用独立 dataType，绝不写入 QX_DATA 或其他测量配置。
export const HEALTH_REMINDER_TYPES = {
	bp: 'BloodPressureReminder', analysis: 'MedicationEffectAnalysis',
	bpChecks: 'BloodPressureReminderChecks', medicationChecks: 'MedicationReminderChecks',
	bpHistory: 'BloodPressureReminderHistory', medicationHistory: 'MedicationReminderHistory'
}

export function localReminderDate(date) {
	return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

export function reminderOccurrences(reminders, kind, now = Date.now(), days = 8) {
	const groups = new Map()
	for (let offset = 0; offset < days; offset++) {
		const date = new Date(now)
		date.setHours(0, 0, 0, 0)
		date.setDate(date.getDate() + offset)
		for (const item of reminders) {
			if (!item.enabled || !Array.isArray(item.weekdays) || !item.weekdays.includes(date.getDay() || 7)) continue
			for (const time of item.times || []) {
				if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) continue
				const at = new Date(date)
				at.setHours(...time.split(':').map(Number), 0, 0)
				const key = localReminderDate(at) + '|' + time
				if (!groups.has(key)) groups.set(key, { kind, date: localReminderDate(at), time, at: at.getTime(), items: [] })
				groups.get(key).items.push(item)
			}
		}
	}
	return [...groups.values()].map(slot => ({ ...slot,
		id: slot.date + '|' + slot.time + '|' + slot.items.map(item => item.id).sort().join('|'),
		label: slot.items.map(item => item.name).filter(Boolean).join('、')
	})).sort((a, b) => a.at - b.at)
}

export function currentReminderOccurrence(slots, now = Date.now(), isChecked = () => false) {
	const today = localReminderDate(new Date(now))
	const currentDay = slots.filter(slot => slot.date === today).sort((a, b) => a.at - b.at)
	if (!currentDay.length) return slots.find(slot => slot.at > now) || null
	let index = 0
	while (index + 1 < currentDay.length && currentDay[index + 1].at <= now) index++
	// 未到时间的提醒即使提前确认，也保留在首页，等到点后再推进。
	while (index + 1 < currentDay.length && currentDay[index].at <= now && isChecked(currentDay[index])) index++
	return currentDay[index]
}

export function flattenReminderChecks(checks) {
	return Object.fromEntries(['bp','medication'].map(kind => {
		const result={}
		Object.entries(checks[kind] || {}).sort((a,b)=>(a[1].updatedAt||0)-(b[1].updatedAt||0)).forEach(([key,value])=>{
			const parts=key.split('|')
			if(parts[0]!=='day')parts.slice(2).forEach(id=>{result[parts[0]+'|'+parts[1]+'|'+id]=value})
		})
		return [kind,result]
	}))
}

export function createHealthReminderStore({ baseUrl, get, post, storage }) {
	const token = storage.getStorageSync('token'), userId = storage.getStorageSync('userid')
	const server = storage.getStorageSync('URL_APP_IP')
	const headers = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' }
	const isCurrent = () => !!token && !!userId && token === storage.getStorageSync('token') && userId === storage.getStorageSync('userid') && server === storage.getStorageSync('URL_APP_IP')
	const assertCurrent = () => { if (!isCurrent()) throw new Error('Reminder account changed') }
	const allowed = new Set(Object.values(HEALTH_REMINDER_TYPES))
	async function load(dataType, fallback) {
		assertCurrent()
		if (!allowed.has(dataType)) throw new Error('Invalid reminder dataType')
		const res = await get(baseUrl + '/prod-api/device/data/list', { dataType }, headers)
		assertCurrent()
		if (!res || res.code !== 200 || !Array.isArray(res.rows)) throw new Error('Reminder read failed')
		if (!res.rows.length) return fallback
		const row = res.rows[0]
		if (row.dataType && row.dataType !== dataType) throw new Error('Unexpected reminder dataType')
		const value = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
		if (!value || value.version !== 1) throw new Error('Invalid reminder data')
		return value
	}
	async function save(dataType, value) {
		assertCurrent()
		if (!allowed.has(dataType)) throw new Error('Invalid reminder dataType')
		const res = await post(baseUrl + '/prod-api/device/data/editData', { dataType, data: JSON.stringify(value) }, headers)
		assertCurrent()
		if (!res || res.code !== 200) throw new Error('Reminder save failed')
		return value
	}
	const medication = createMedicationReminderStore({ baseUrl, get, post, storage })
	return {
		isCurrent,
		async loadBloodPressure() {
			return normalizeBloodPressureSettings(await load(HEALTH_REMINDER_TYPES.bp, { version: 1, enabled: false, reminders: [] }))
		},
		saveBloodPressure: settings => save(HEALTH_REMINDER_TYPES.bp, normalizeBloodPressureSettings(settings)),
		async loadHistory() {
			const values = await Promise.all(['bp', 'medication'].map(kind => load(HEALTH_REMINDER_TYPES[kind + 'History'], { version: 1, records: {} })))
			return values.flatMap(value => Object.values(value.records || {})).sort((a, b) => b.at - a.at)
		},
		async loadMedicationReportHistory() {
			const [history, checks] = await Promise.all([
				load(HEALTH_REMINDER_TYPES.medicationHistory, { version: 1, records: {} }),
				load(HEALTH_REMINDER_TYPES.medicationChecks, { version: 1, records: {} })
			])
			const events = Object.values(history.records || {})
			// 勾选写入成功、历史写入待重试时，报告仍以该时段的最新勾选状态为准。
			for (const [key, value] of Object.entries(checks.records || {})) {
				const [date, time, ...itemIds] = key.split('|')
				if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !itemIds.length || !Number.isFinite(value.updatedAt)) continue
				events.push({ id: 'check-' + key, kind: 'medication', date, time, itemIds, at: value.updatedAt, action: value.completed ? 'completed' : 'undone' })
			}
			return events
		},
		async recordEvent(event) {
			if (!event || !['bp', 'medication'].includes(event.kind) || !event.id || !Number.isFinite(event.at) ||
				!['completed', 'undone', 'measured', 'snoozed', 'reminded'].includes(event.action) || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) throw new Error('Invalid reminder event')
			const checksType = HEALTH_REMINDER_TYPES[event.kind + 'Checks']
			if (['completed', 'undone'].includes(event.action)) {
				const value = await load(checksType, { version: 1, records: {} })
				const records = Object.fromEntries(Object.entries(value.records || {}).filter(([, row]) => row && row.at >= Date.now() - 90 * 86400000))
				for (const id of event.itemIds || []) {
					const key = event.date + '|' + event.time + '|' + id
					if (records[key] && records[key].updatedAt > event.at) continue
					records[key] = {
					at: event.scheduledAt || event.at, completed: event.action !== 'undone', updatedAt: event.at,
					date: event.date, time: event.time, itemIds: [id]
				}
				}
				await save(checksType, { version: 1, records })
			}
			const type = HEALTH_REMINDER_TYPES[event.kind + 'History'], value = await load(type, { version: 1, records: {} })
			const records = { ...value.records, [event.id]: event }
			const recent = Object.values(records).filter(row => row.at >= Date.now() - 90 * 86400000).sort((a, b) => b.at - a.at).slice(0, 1000)
			await save(type, { version: 1, records: Object.fromEntries(recent.map(row => [row.id, row])) })
		},
		async dashboard() {
			const [medications, bp, medChecks, bpChecks] = await Promise.all([
				medication.load(), load(HEALTH_REMINDER_TYPES.bp, { version: 1, reminders: [] }),
				load(HEALTH_REMINDER_TYPES.medicationChecks, { version: 1, records: {} }),
				load(HEALTH_REMINDER_TYPES.bpChecks, { version: 1, records: {} })
			])
			if (!Array.isArray(bp.reminders) || !medChecks.records || !bpChecks.records) throw new Error('Invalid reminder data')
			return { medication: medications, bp: bp.enabled === undefined ? bp.reminders : activeBloodPressureReminders(normalizeBloodPressureSettings(bp)), checks: { medication: medChecks.records, bp: bpChecks.records } }
		},
		async loadAnalysisReminders() {
			const [medications, bp] = await Promise.all([
				medication.load(), load(HEALTH_REMINDER_TYPES.bp, { version: 1, enabled: false, reminders: [] })
			])
			return { medication: medications, bp: activeBloodPressureReminders(normalizeBloodPressureSettings(bp)) }
		},
		loadAnalysis: () => load(HEALTH_REMINDER_TYPES.analysis, { version: 1, enabled: false, days: 1 }),
		saveAnalysis: settings => save(HEALTH_REMINDER_TYPES.analysis, { version: 1, enabled: !!settings.enabled, days: [1, 3, 7, 30].includes(settings.days) ? settings.days : 1 }),
		async check(slot, completed) {
			if (!slot || !['bp', 'medication'].includes(slot.kind)) throw new Error('Invalid reminder occurrence')
			const type = HEALTH_REMINDER_TYPES[slot.kind + 'Checks']
			// 先合并服务器已有记录，避免勾选一项覆盖同类其他时刻的记录。
			const existing = await load(type, { version: 1, records: {} })
			const cutoff = Date.now() - 90 * 86400000
			const records = Object.fromEntries(Object.entries(existing.records || {}).filter(([, record]) => record && record.at >= cutoff))
			records[slot.id] = { at: slot.at, completed: !!completed, updatedAt: Date.now() }
			await save(type, { version: 1, records })
			return records
		}
	}
}
