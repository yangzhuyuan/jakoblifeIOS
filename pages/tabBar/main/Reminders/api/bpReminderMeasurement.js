import {
	excludeBPReaderDevices
} from '../../../../api/bpReaderDevice.js'
import {
	getDeviceBindingContext
} from '../../../../api/deviceBindingState.js'
import {
	localReminderDate
} from './healthReminders.js'
import {
	healthNotificationCall,
	stopMedicationSoundPreview
} from './medicationNotifications.js'
import {
	beginReminderCheck,
	settleReminderCheck
} from './healthReminderPending.js'

let measurementHost = null
export function setBPReminderMeasurementHost(host) {
	measurementHost = host
}
export function clearBPReminderMeasurementHost(host) {
	if (measurementHost === host) measurementHost = null
}

const watchModels = ['30000', '30001']
const cuffModels = ['10000', '10001', '100010', '10002', '10003', '10004', '10005', '10006']
const normalizedId = value => String(value || '').trim().toUpperCase()
const sameWatch = (a, b) => a && b && String(a.deviceSn) === String(b.deviceSn) && String(a.deviceModelId) === String(b
	.deviceModelId)
const bindingStamp = () => {
	const value = getDeviceBindingContext();
	return value.scope + '|' + value.revision
}
const accountStamp = value => [value.baseUrl, value.userId, value.token].join('|')

function limited(promise, ms = 8000) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error('Reminder operation timed out')), ms)
		Promise.resolve(promise).then(value => {
			clearTimeout(timer);
			resolve(value)
		}, error => {
			clearTimeout(timer);
			reject(error)
		})
	})
}

// Binding rows are authoritative. A photo/manual-entry virtual device is never a physical cuff.
export function selectBPReminderDevice(rows, host = liveHost()) {
	const devices = excludeBPReaderDevices(rows) || []
	const watches = devices.filter(row => watchModels.includes(String(row.deviceModelId)))
	const watch = watches.find(row => connectedWatchId(row, host)) || watches[0]
	if (watch) return {
		kind: 'watch',
		watch
	}
	return {
		kind: devices.some(row => cuffModels.includes(String(row.deviceModelId))) ? 'cuff' : 'none'
	}
}

function liveHost() {
	if (measurementHost) return measurementHost
	try {
		const app = typeof getApp === 'function' ? getApp() : null
		return (app && app.globalData && app.globalData.mainPageVm) || null
	} catch (error) {
		return null
	}
}

function connectedWatchId(watch, host) {
	if (!host || !watch || !watch.deviceSn) return ''
	const six = String(watch.deviceModelId) === '30001'
	if (!watchModels.includes(String(watch.deviceModelId)) || Number(six ? host.acktypes6 : host.acktypes) !== 1)
		return ''
	// Same id Main uses to start a measurement. Do not require BPW6deviceSn: that key is never stored.
	const id = six ? host.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac') : host.deviceIdwatch || uni
		.getStorageSync('deviceIdwatch')
	if (!id) return ''
	// The bound ID is a MAC on Android and a peripheral UUID on iOS (same rule as Main's reconnect).
	if (watch.mac && normalizedId(id) !== normalizedId(watch.mac)) return ''
	return id
}

// Separate reminder entry: never changes Main's selected device or the existing card commands.
function writeReminderMeasure(host, six, deviceId) {
	const serviceId = six ? '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E' : '81EEA001-E735-49EC-8A11-7E32CAE1E14E'
	const characteristicId = six ? '6E400002-B5A3-F393-E0A9-E50E24DCCA9E' : '81EEA003-E735-49EC-8A11-7E32CAE1E14E'
	const value = host.toArrayBuffer(six ? '32000000000000000000000000000032' : 'e00006f4060105000101')
	return new Promise((resolve, reject) => {
		const payload = {
			deviceId,
			serviceId,
			characteristicId,
			writeType: 'write',
			value
		}
		// Match Main.BPW6_BPW1_sendWrite: BPW6 uses success/fail; BPW1 treats complete code 10007 as sent.
		if (six) {
			payload.success = resolve
			payload.fail = reject
		} else {
			payload.complete = result => {
				if (result && result.code === 10007) resolve(result)
				else reject(result || new Error('write failed'))
			}
		}
		uni.writeBLECharacteristicValue(payload)
	})
}

export async function startBPReminderWatch(watch, isCurrent) {
	const host = liveHost()
	const emotionBusy = () => (typeof host.isEmotionMeasureBusySession === 'function' && host
		.isEmotionMeasureBusySession()) || (typeof host.shouldDeferBleReconnectForPpg === 'function' && host
		.shouldDeferBleReconnectForPpg())
	const requireReady = () => {
		if (!isCurrent()) throw new Error('健康提醒绑定已变化')
		if (!host || liveHost() !== host || !connectedWatchId(watch, host)) throw new Error('健康提醒请连接手表')
		if (emotionBusy() || host._bpReminderSending ||
			(host._bpReminderWatchSn === String(watch.deviceSn) && Date.now() - host._bpReminderStartedAt <
				60000)) throw new Error('健康提醒手表正在测量')
	}
	requireReady()
	const deviceId = connectedWatchId(watch, host),
		six = String(watch.deviceModelId) === '30001'
	requireReady()
	host._bpReminderSending = true
	const hasBpFlags = !six && Object.prototype.hasOwnProperty.call(host, 'bpw1CardHrOnly')
	const previous = hasBpFlags ? {
		bpw1CardHrOnly: host.bpw1CardHrOnly,
		bpw1AwaitingBpHrPair: host.bpw1AwaitingBpHrPair,
		xueya_xinlv: host.xueya_xinlv
	} : null
	if (hasBpFlags) {
		host.bpw1CardHrOnly = false;
		host.bpw1AwaitingBpHrPair = true;
		host.xueya_xinlv = true
	}
	if (!six && typeof host.clearBPW1PureHrMeasure === 'function') host.clearBPW1PureHrMeasure()
	try {
		await writeReminderMeasure(host, six, deviceId)
		if (!six && isCurrent() && typeof host.markBpw1LiveBpMeasureStarted === 'function') host
			.markBpw1LiveBpMeasureStarted()
		if (isCurrent()) {
			host._bpReminderWatchSn = String(watch.deviceSn);
			host._bpReminderStartedAt = Date.now()
		}
	} catch (error) {
		if (previous && isCurrent()) Object.assign(host, previous)
		throw new Error('测量发送失败请检查设备')
	} finally {
		host._bpReminderSending = false
	}
}

export function createBPReminderPrompts(vm, {
	account,
	store,
	isActive,
	markCompleted
}) {
	let jobs = Promise.resolve(),
		generation = 0,
		cached = null
	const pending = new Set()
	const text = key => vm.$t(key)
	async function devices() {
		const owner = account(),
			captured = accountStamp(owner),
			binding = bindingStamp()
		const result = await limited(vm.$post(owner.baseUrl + vm.$url_queryDevices, {}, {
			Authorization: 'Bearer ' + owner.token,
			'content-type': 'application/json'
		}))
		if (captured !== accountStamp(account()) || binding !== bindingStamp()) throw new Error('健康提醒绑定已变化')
		if (Number(result.code) !== 200 || !Array.isArray(result.rows)) throw new Error('Device list unavailable')
		cached = {
			rows: excludeBPReaderDevices(result.rows),
			captured,
			binding
		}
		return cached.rows
	}

	function cachedRows() {
		return cached && cached.captured === accountStamp(account()) && cached.binding === bindingStamp() ? cached
			.rows : []
	}

	function notificationBody(rows) {
		const kind = selectBPReminderDevice(rows).kind
		return text(kind === 'watch' ? '健康提醒手表通知' : kind === 'cuff' ? '健康提醒血压计通知' : '健康提醒血压到点提示')
	}
	async function eligible(event, saved) {
		if (event.date !== localReminderDate(new Date())) return false
		const dashboard = await limited(saved.dashboard())
		const kind = event.kind === 'medication' ? 'medication' : 'bp'
		const checks = dashboard.checks[kind] || {},
			flat = Object.keys(checks)
		const weekday = (new Date().getDay() + 6) % 7 + 1
		return event.itemIds.some(id => (dashboard[kind] || []).some(row => row.enabled && row.id === id && row.times
				.includes(event.time) && row.weekdays.includes(weekday)) &&
			!flat.some(key => key.startsWith(event.date + '|' + event.time + '|') && key.split('|').slice(2)
				.includes(id) && checks[key].completed))
	}
	function claimPrompt(storageKey, event) {
		const seen = uni.getStorageSync(storageKey) || {}
		const scope = getDeviceBindingContext().scope
		const key = event.action === 'openBP' ? event.id : event.date + '|' + event.time + '|' + Math.floor(Number(
			event.at) / 60000)
		if (seen.scope === scope && (seen.ids || []).includes(key)) return false
		uni.setStorageSync(storageKey, {
			scope,
			ids: [...(seen.scope === scope ? seen.ids || [] : []), key].slice(-100)
		})
		return true
	}
	async function completeReminder(event) {
		if (typeof markCompleted !== 'function') return false
		let ids = [...new Set(event.itemIds || [])].filter(Boolean)
		try {
			const dashboard = await limited(store().dashboard())
			const weekday = (new Date().getDay() + 6) % 7 + 1
			const rows = (dashboard[event.kind] || []).filter(row => row.enabled && (row.times || []).includes(event
				.time) && (row.weekdays || []).includes(weekday))
			if (rows.length) ids = rows.map(row => row.id)
		} catch (error) {}
		if (!ids.length) return false
		const slot = {
			kind: event.kind,
			date: event.date,
			time: event.time,
			at: Number(event.scheduledAt) || Number(event.at) || Date.now(),
			items: ids.map(id => ({ id })),
			id: event.date + '|' + event.time + '|' + ids.slice().sort().join('|'),
			label: event.label || ''
		}
		const operation = beginReminderCheck(vm, slot, true)
		try {
			await markCompleted(slot)
			if (operation) settleReminderCheck(operation, true)
			return true
		} catch (error) {
			if (operation) settleReminderCheck(operation, false)
			if (isActive()) uni.showToast({
				title: text('健康提醒记录失败'),
				icon: 'none'
			})
			return false
		}
	}
	const followDelay = 30 * 60 * 1000
	const followLimit = 3
	function followKey(event) {
		const ids = [...new Set(event.itemIds || [])].filter(Boolean).sort()
		return [event.date, event.time, ids.join('|')].join('|')
	}
	function readFollow() {
		const scope = getDeviceBindingContext().scope
		const saved = uni.getStorageSync('medication_dose_followup') || {}
		if (!scope || saved.scope !== scope || !saved.items) return { scope, items: {} }
		return { scope, items: saved.items }
	}
	function writeFollow(state) {
		const items = state.items || {}
		const keys = Object.keys(items)
		keys.slice(0, Math.max(0, keys.length - 40)).forEach(key => delete items[key])
		uni.setStorageSync('medication_dose_followup', { scope: state.scope, items })
	}
	function followPayload(event) {
		const row = readFollow().items[followKey(event)] || {}
		return {
			event: JSON.stringify({
				kind: 'medication',
				itemIds: [...new Set(event.itemIds || [])].filter(Boolean),
				date: event.date,
				time: event.time,
				scheduledAt: Number(event.scheduledAt) || Number(event.at) || Date.now(),
				label: event.label || '',
				title: text('健康提醒用药标题'),
				body: text('健康提醒用药半小时确认'),
				followUp: true,
				followCount: row.count || 1
			})
		}
	}
	async function nativeFollow(method, event, at) {
		const payload = followPayload(event)
		if (at != null) payload.at = at
		await healthNotificationCall(vm, method, payload)
	}
	async function scheduleMedicationFollowUp(event) {
		const state = readFollow()
		const key = followKey(event)
		const row = state.items[key] || { count: 0, stopped: false }
		if (row.stopped || row.count >= followLimit || doseStopped(event)) {
			state.items[key] = { count: row.count || 0, stopped: true }
			writeFollow(state)
			try { await nativeFollow('cancelMedFollowUp', event) } catch (error) {}
			return
		}
		state.items[key] = { count: row.count + 1, stopped: false }
		writeFollow(state)
		try { await nativeFollow('scheduleMedFollowUp', event, Date.now() + followDelay) } catch (error) {}
	}
	function doseStopped(event) {
		const items = readFollow().items
		return Object.keys(items).some(key => {
			const parts = key.split('|')
			return parts[0] === event.date && parts[1] === event.time && items[key] && items[key].stopped
		})
	}
	const medicationCheckHolds = new Map()
	const heldMedicationPrompts = []
	function doseKey(event) { return event.date + '|' + event.time }
	function medicationCheckPending(event) {
		const hold = medicationCheckHolds.get(doseKey(event))
		return !!(hold && hold.depth > 0 && !hold.priorStopped)
	}
	function holdMedicationPrompt(event) {
		if (heldMedicationPrompts.some(item => item.id === event.id && !!item.followUp === !!event.followUp)) return
		heldMedicationPrompts.push(event)
	}
	function dropHeldMedicationPrompts(slot) {
		for (let i = heldMedicationPrompts.length - 1; i >= 0; i--) {
			if (heldMedicationPrompts[i].date === slot.date && heldMedicationPrompts[i].time === slot.time) heldMedicationPrompts.splice(i, 1)
		}
	}
	async function replayHeldMedicationPrompts(slot) {
		const batch = []
		for (let i = heldMedicationPrompts.length - 1; i >= 0; i--) {
			if (heldMedicationPrompts[i].date === slot.date && heldMedicationPrompts[i].time === slot.time) batch.unshift(heldMedicationPrompts.splice(i, 1)[0])
		}
		for (const event of batch) {
			if (event.followUp) await showMedicationFollowUp(event)
			else await showMedication(event)
		}
	}
	function beginMedicationCheck(slot) {
		const key = doseKey(slot)
		const hold = medicationCheckHolds.get(key) || { priorStopped: doseStopped(slot), depth: 0 }
		if (!medicationCheckHolds.has(key)) hold.priorStopped = doseStopped(slot)
		hold.depth += 1
		medicationCheckHolds.set(key, hold)
	}
	function clearDoseStopped(slot) {
		const state = readFollow()
		let changed = false
		Object.keys(state.items).forEach(key => {
			const parts = key.split('|')
			if (parts[0] === slot.date && parts[1] === slot.time && state.items[key] && state.items[key].stopped) {
				state.items[key] = { count: state.items[key].count || 0, stopped: false }
				changed = true
			}
		})
		if (changed) writeFollow(state)
	}
	async function finishMedicationCheck(slot, saved) {
		const key = doseKey(slot)
		const hold = medicationCheckHolds.get(key)
		if (hold) {
			hold.depth -= 1
			if (hold.depth <= 0) medicationCheckHolds.delete(key)
		}
		if (saved) {
			dropHeldMedicationPrompts(slot)
			if (!hold || !hold.priorStopped) await stopMedicationFollowUp({ kind: 'medication', date: slot.date, time: slot.time, itemIds: (slot.items || []).map(item => item.id), scheduledAt: slot.at })
			return
		}
		if (hold && hold.priorStopped) {
			dropHeldMedicationPrompts(slot)
			return
		}
		clearDoseStopped(slot)
		await replayHeldMedicationPrompts(slot)
	}
	async function stopMedicationFollowUp(event) {
		const state = readFollow()
		const keys = Object.keys(state.items).filter(key => {
			const parts = key.split('|')
			return parts[0] === event.date && parts[1] === event.time
		})
		const exact = followKey(event)
		if (!keys.includes(exact)) keys.push(exact)
		keys.forEach(key => {
			const row = state.items[key] || { count: 0 }
			state.items[key] = { count: row.count, stopped: true }
		})
		writeFollow(state)
		try { await nativeFollow('cancelMedFollowUp', event) } catch (error) {}
	}
	async function show(event) {
		const owner = account(),
			captured = accountStamp(owner),
			version = generation,
			saved = store()
		const current = () => isActive() && version === generation && captured === accountStamp(account()) && saved
			.isCurrent()
		if (!owner.token || !current()) return
		// A notification tap may arrive after its schedule was disabled or this occurrence was completed.
		let canPrompt = true
		try {
			canPrompt = await eligible(event, saved)
		} catch (error) {
			/* Native reminder still alerts offline; commands require fresh verification below. */ }
		if (!canPrompt || !current()) return
		let rows
		try {
			rows = await devices()
		} catch (error) {
			rows = cachedRows()
		}
		if (!current()) return
		const selected = selectBPReminderDevice(rows),
			binding = bindingStamp(),
			watch = selected.watch
		if (!claimPrompt('bp_reminder_prompt_seen', event)) return
		const watchPrompt = selected.kind === 'watch'
		const content = watchPrompt ? text('健康提醒手表测量确认') + '\n' + text('测量时请保持安静手表与心脏同高五指张开不要压迫胸口') :
			notificationBody(rows)
		const answer = await new Promise(resolve => uni.showModal({
			title: text('健康提醒血压页面标题'),
			content,
			showCancel: true,
			confirmText: text(watchPrompt ? '健康提醒立即测量' : '确认'),
			cancelText: text(watchPrompt ? '取消' : '健康提醒忽略'),
			success: resolve,
			fail: () => resolve({})
		}))
		stopMedicationSoundPreview(vm)
		if (!watchPrompt) {
			if (answer.confirm && current()) await completeReminder(event)
			return
		}
		if (!answer.confirm || !watch || !current()) return
		try {
			if (binding !== bindingStamp()) throw new Error('健康提醒绑定已变化')
			const latest = await devices()
			if (current()) {
				const target = latest.find(row => sameWatch(row, watch))
				if (!target || binding !== bindingStamp()) throw new Error('健康提醒绑定已变化')
				if (await eligible(event, saved) && current()) {
					await startBPReminderWatch(target, () => current() && binding === bindingStamp())
					if (current()) uni.showToast({
						title: text('开始测量'),
						icon: 'none'
					})
				}
			}
		} catch (error) {
			if (current()) uni.showToast({
				title: text(['健康提醒绑定已变化', '健康提醒请连接手表', '健康提醒手表正在测量', '测量发送失败请检查设备'].includes(error
					.message) ? error.message : '健康提醒设备核对失败'),
				icon: 'none',
				duration: 2500
			})
		}
		if (current()) await completeReminder(event)
	}
	async function showMedication(event) {
		const owner = account(),
			captured = accountStamp(owner),
			version = generation,
			saved = store()
		const current = () => isActive() && version === generation && captured === accountStamp(account()) && saved
			.isCurrent()
		if (!owner.token || !current()) return
		if (medicationCheckPending(event)) {
			holdMedicationPrompt(event)
			return
		}
		if (doseStopped(event)) return
		let canPrompt = true
		try {
			canPrompt = await eligible(event, saved)
		} catch (error) {}
		if (!current()) return
		if (!canPrompt) {
			if (medicationCheckPending(event)) holdMedicationPrompt(event)
			else await stopMedicationFollowUp(event)
			return
		}
		if (!claimPrompt('medication_reminder_prompt_seen', event)) return
		const answer = await new Promise(resolve => uni.showModal({
			title: text('健康提醒用药标题'),
			content: text('健康提醒用药到点确认'),
			showCancel: true,
			confirmText: text('确认'),
			cancelText: text('健康提醒忽略'),
			success: resolve,
			fail: () => resolve({})
		}))
		stopMedicationSoundPreview(vm)
		if (!current()) return
		if (answer.confirm) {
			await stopMedicationFollowUp(event)
			await completeReminder(event)
			return
		}
		if (answer.cancel && current()) {
			let open = true
			try { open = await eligible(event, saved) } catch (error) {}
			if (open && current() && !doseStopped(event)) await scheduleMedicationFollowUp(event)
		}
	}
	async function showMedicationFollowUp(event) {
		const owner = account(),
			captured = accountStamp(owner),
			version = generation,
			saved = store()
		const current = () => isActive() && version === generation && captured === accountStamp(account()) && saved
			.isCurrent()
		if (!owner.token || !current()) return
		if (medicationCheckPending(event)) {
			holdMedicationPrompt(event)
			return
		}
		if (doseStopped(event)) return
		let canPrompt = true
		try {
			canPrompt = await eligible(event, saved)
		} catch (error) {}
		if (!current()) return
		if (!canPrompt) {
			if (medicationCheckPending(event)) holdMedicationPrompt(event)
			else await stopMedicationFollowUp(event)
			return
		}
		if (!claimPrompt('medication_followup_prompt_seen', event)) return
		const answer = await new Promise(resolve => uni.showModal({
			title: text('健康提醒用药标题'),
			content: text('健康提醒用药半小时确认'),
			showCancel: true,
			confirmText: text('健康提醒已用药'),
			cancelText: text('健康提醒暂不提示'),
			success: resolve,
			fail: () => resolve({})
		}))
		stopMedicationSoundPreview(vm)
		if (!current()) return
		if (answer.confirm) {
			await stopMedicationFollowUp(event)
			await completeReminder(event)
			return
		}
		if (!answer.cancel) return
		const again = await new Promise(resolve => uni.showModal({
			title: text('健康提醒用药标题'),
			content: text('健康提醒是否永不提示'),
			showCancel: true,
			confirmText: text('健康提醒仅本次'),
			cancelText: text('健康提醒永不提示'),
			success: resolve,
			fail: () => resolve({})
		}))
		stopMedicationSoundPreview(vm)
		if (!current()) return
		if (again.confirm) await scheduleMedicationFollowUp(event)
		else if (again.cancel) await stopMedicationFollowUp(event)
	}
	return {
		async decorate(rows) {
			let bound
			try {
				bound = rows.some(row => row.enabled) ? await devices() : []
			} catch (error) {
				bound = cachedRows()
			}
			return rows.map(row => ({
				...row,
				notificationBody: notificationBody(bound)
			}))
		},
		receive(events) {
			if (!isActive()) return
			const opened = new Set(events.filter(e => e.action === 'openBP').map(e => e.date + '|' + e.time))
			for (const event of events) {
				if (event.kind === 'medication' && event.action === 'completed' && !medicationCheckPending(event)) stopMedicationFollowUp(event).catch(() => {})
				const bpPrompt = event.kind === 'bp' && ['reminded', 'openBP'].includes(event.action)
				const medicationPrompt = event.kind === 'medication' && event.action === 'reminded'
				if ((!bpPrompt && !medicationPrompt) || !Array.isArray(event.itemIds) || pending.has(event.id))
					continue
				if (events.some(e => e.action === 'completed' && e.kind === event.kind && e.date === event.date && e
						.time === event.time && event.itemIds.every(id => (e.itemIds || []).includes(id)))) continue
				if (event.action === 'reminded' && !event.followUp && ((event.kind === 'bp' && opened.has(event.date + '|' + event
						.time)) || Date.now() - Number(event.at) > 120000 || Number(event.at) > Date.now())) continue
				pending.add(event.id)
				const version = generation
				const present = medicationPrompt && event.followUp ? showMedicationFollowUp : medicationPrompt ? showMedication : show
				jobs = jobs.catch(() => {}).then(() => version === generation && present(event)).catch(() => {})
					.finally(() => pending.delete(event.id))
			}
			return jobs
		},
		reset() {
			generation++;
			cached = null;
			pending.clear()
		},
		cancelMedicationDose(event) { return stopMedicationFollowUp(event) },
		beginMedicationCheck,
		finishMedicationCheck
	}
}