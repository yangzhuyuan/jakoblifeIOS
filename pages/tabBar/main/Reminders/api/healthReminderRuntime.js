import { createHealthReminderStore, HEALTH_REMINDERS_CHANGED, flattenReminderChecks } from './healthReminders.js'
import { activeBloodPressureReminders } from './bloodPressureReminder.js'
import { healthNotificationCall, medicationNotificationAccount, medicationNotificationStatus, remindersForNative } from './medicationNotifications.js'
import { healthReminderText } from './healthReminderText.js'
import { setBloodPressureReminderKeepAlive } from './reminderKeepAliveState.js'
import { createBPReminderPrompts } from './bpReminderMeasurement.js'

let runtime = null
export function createHealthReminderRuntime(vm) {
	let jobs = Promise.resolve(), signature = '', timer = null, active = true, supported = false
	const account = () => medicationNotificationAccount(vm)
	const identity = value => [value.baseUrl, value.userId, value.token].join('|')
	const store = () => createHealthReminderStore({ baseUrl: vm.$url_APP_IP, get: (...a) => vm.$get(...a), post: (...a) => vm.$post(...a), storage: uni })
	const serial = fn => { const task = jobs.catch(() => {}).then(fn); jobs = task; return task }
	const native = (method, args) => healthNotificationCall(vm, method, args)
	const prompts = createBPReminderPrompts(vm, { account, store, isActive: () => active,
		markCompleted: slot => getRuntime(vm).perform(slot, 'completed') })
	async function flush() {
		if (!supported) return
		const captured = identity(account()), data = await native('healthEvents'), saved = store()
		const events = typeof data.events === 'string' ? JSON.parse(data.events) : data.events || []
		if (captured !== identity(account())) return
		prompts.receive(events)
		let changed = false
		try {
			for (const event of events) {
				if (identity(account()) !== captured || !saved.isCurrent()) return
				// 点击通知只是打开测量确认，不是已完成，也不写进健康记录。
				if (event.action !== 'openBP') await saved.recordEvent(event)
				if (identity(account()) !== captured) return
				await native('ackHealthEvents', { ids: JSON.stringify([event.id]) })
				if (event.action !== 'openBP') changed = true
			}
		} finally { if (changed) uni.$emit(HEALTH_REMINDERS_CHANGED) }
	}
	function reportRefreshError(tag, stage, error) {
		// 仅记录错误，不打印请求参数、账号、令牌或健康记录。
		console.log(tag + ' ' + JSON.stringify({ stage,
			code: error && error.code, method: error && error.method,
			message: error && error.message, nativeDomain: error && error.nativeDomain,
			nativeCode: error && error.nativeCode, nativeStage: error && error.stage,
			timeoutMs: error && error.timeoutMs, stack: error && error.stack }))
	}
	async function refreshNow() {
		const owner = account(), captured = identity(owner)
		if (!owner.token || !owner.userId) { setBloodPressureReminderKeepAlive(null, null); return }
		let stage = 'status'
		try {
			const status = await medicationNotificationStatus(vm)
			supported = status.healthActions === true
			if (!supported) return
			// 保留 Mac 版本的隔离：旧记录上传失败不阻止本次计划。
			try { await flush() } catch (error) { reportRefreshError('[BP_SYNC_WARNING]', 'history', error) }
			stage = 'load-bp'
			const saved = store(), settings = await saved.loadBloodPressure()
			if (captured !== identity(account()) || !saved.isCurrent()) return
			stage = 'decorate-bp'
			const reminders = await prompts.decorate(activeBloodPressureReminders(settings, healthReminderText(vm, 'measure')))
			if (captured !== identity(account())) return
			stage = 'build-payload'
			const title = healthReminderText(vm, 'bp')
			const channelLabels = Object.fromEntries(['system', 'alarm', 'silent'].map((sound, index) =>
				[sound, title + ' · ' + vm.$t(['吃药提醒系统提示音', '吃药提醒闹钟提示音', '吃药提醒静音'][index])]))
			const payload = { reminders: JSON.stringify(remindersForNative(reminders)), title, channelLabels: JSON.stringify(channelLabels) }
			stage = 'replaceBP'
			// JS 超时不会取消原生任务；同一轮保存只提交一次，避免自动重试积压。
			const result = await native('replaceBP', payload)
			console.log('[BP_NATIVE_RESULT] ' + JSON.stringify({ method: 'replaceBP', ok: result && result.ok,
				bpScheduledThrough: result && result.bpScheduledThrough }))
			setBloodPressureReminderKeepAlive(settings, owner)
			stage = 'load-checks'
			try {
				const dashboard = await saved.dashboard()
				if (captured !== identity(account())) return
				stage = 'syncHealthChecks'
				await native('syncHealthChecks', { checks: JSON.stringify(flattenReminderChecks(dashboard.checks)) })
			} catch (error) { reportRefreshError('[BP_SYNC_WARNING]', stage, error) }
		} catch (error) {
			if (error && typeof error === 'object') error.reminderStage = stage
			reportRefreshError('[BP_SAVE_ERROR]', stage, error)
			throw error
		}
	}
	const service = {
		refresh: () => serial(refreshNow),
		flush: () => serial(flush),
		async perform(slot, action) {
			const captured = identity(account()), saved = store()
			const assertCurrent = () => {
				if (identity(account()) !== captured || !saved.isCurrent()) throw new Error('Reminder account changed')
			}
			const manual = action === 'completed' || action === 'undone'
			return serial(async () => {
				assertCurrent()
				const at = Date.now(), event = { id: 'manual-' + at.toString(36) + '-' + Math.random().toString(36).slice(2),
					at, kind: slot.kind, action, date: slot.date, time: slot.time, scheduledAt: slot.at,
					itemIds: slot.items.map(item => item.id), label: slot.kind === 'bp' ? healthReminderText(vm, 'measure') : slot.label || healthReminderText(vm, 'take') }
				let status = {}, nativeAccepted = false
				try { status = await medicationNotificationStatus(vm) }
				catch (error) { if (!manual) throw error }
				assertCurrent()
				supported = status.healthActions === true
				if (supported) {
					try { await native('healthAction', { event: JSON.stringify(event) }); nativeAccepted = true }
					catch (error) { if (!manual) throw error }
				} else if (!manual) throw new Error('Health reminder native update required')
				assertCurrent()
				if (nativeAccepted) {
					// 原生已接收的事件仍走原有队列，云端失败时保留重试，不重复生成手动记录。
					await flush()
					return
				}
				// 勾选是独立的服务器记录；旧基座、模块缺失或本地计划未就绪都不能阻止保存。
				await saved.recordEvent(event)
				assertCurrent()
				uni.$emit(HEALTH_REMINDERS_CHANGED)
				if (supported) service.refresh().catch(() => {})
			})
		},
		beginMedicationCheck(slot) { if (slot && slot.kind === 'medication') prompts.beginMedicationCheck(slot) },
		finishMedicationCheck(slot, saved) {
			if (!slot || slot.kind !== 'medication') return Promise.resolve()
			return prompts.finishMedicationCheck(slot, saved)
		},
		start() {
			if (timer) return
			uni.$on('APP_SCREEN_AWAKE', awake => { active = awake; if (awake) service.refresh().catch(() => {}) })
			uni.$on('HEALTH_REMINDER_DEVICES_CHANGED', () => service.refresh().catch(() => {}))
			const logout = () => { prompts.reset(); signature = ''; supported = false; setBloodPressureReminderKeepAlive(null, null) }
			uni.$on('MEDICATION_REMINDER_LOGOUT', logout)
			uni.$on('APP_LOGOUT', logout)
			timer = setInterval(() => {
				if (!active) return
				const owner = account(), next = identity(owner)
				if (next !== signature) { prompts.reset(); signature = next; service.refresh().catch(() => {}) }
				else if (owner.token) service.flush().catch(() => {})
			}, 10000)
			signature = identity(account()); service.refresh().catch(() => {})
		}
	}
	return service
}
function getRuntime(vm) { if (!runtime) runtime = createHealthReminderRuntime(vm); return runtime }
export function startHealthReminderRuntime(vm) { getRuntime(vm).start() }
export function refreshHealthReminderRuntime(vm) { return getRuntime(vm).refresh() }
export function performHealthReminderAction(vm, slot, action) { return getRuntime(vm).perform(slot, action) }
export function beginMedicationCheck(vm, slot) { return getRuntime(vm).beginMedicationCheck(slot) }
export function finishMedicationCheck(vm, slot, saved) { return getRuntime(vm).finishMedicationCheck(slot, saved) }
