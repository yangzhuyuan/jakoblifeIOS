import { createMedicationReminderStore, normalizeMedicationReminders } from './medicationReminder.js'
import { createIOSMedicationPlugin } from './medicationNotificationsIOS.js'
import { setMedicationReminderKeepAlive } from './reminderKeepAliveState.js'
// #ifdef APP-PLUS
import { invokeMedicationIOS } from '@/uni_modules/jakob-medication-ios'
// #endif

// JS 只同步账号/服务器设置，服药时刻由平台原生通知调度。
export function createMedicationNotifications({ storage, plugin, getBaseUrl, get, post, title, reminderName, onRemindersChanged = () => {} }) {
	let session = '', generation = 0, revision = 0, loading = null
	let lastReminders = null, lastText = ''
	const notificationText = () => ({ title: title(), name: reminderName ? reminderName() : null })
	function account() {
		const token = storage.getStorageSync('token'), userId = storage.getStorageSync('userid'), baseUrl = getBaseUrl()
		return { token, userId, baseUrl, scope: token && userId ? baseUrl + ':' + userId : '' }
	}
	function call(method, args) {
		return new Promise((resolve, reject) => {
			if (!plugin || typeof plugin[method] !== 'function') {
				const error = new Error('Medication notification plugin unavailable')
				error.code = 'NATIVE_METHOD_UNAVAILABLE'; error.method = method
				return reject(error)
			}
			// iOS 使用桥接的 120 秒等待时间；不要给 replaceBP 单独缩短到 20 秒。
			const timeoutMs = plugin.timeoutMs || 5000
			const timer = setTimeout(() => {
				const error = new Error('Medication notification timeout')
				error.code = 'NATIVE_TIMEOUT'; error.method = method; error.timeoutMs = timeoutMs
				reject(error)
			}, timeoutMs)
			try {
				plugin[method](args, result => {
					clearTimeout(timer)
					if (result && result.ok) resolve(result)
					else {
						const error = new Error(result && (result.message || result.error) || 'Medication notification operation failed')
						error.code = result && result.code
						error.method = method
						for (const key of ['nativeDomain', 'nativeCode', 'stage', 'plannedCount', 'pendingCount']) error[key] = result && result[key]
						reject(error)
					}
				})
			} catch (error) { clearTimeout(timer); reject(error) }
		})
	}
	function same(left, right) { return left.scope === right.scope && left.token === right.token }
	function syncSession() {
		const current = account(), signature = current.scope + ':' + current.token
		if (signature === session) return current
		session = signature
		generation++
		revision++
		loading = null
		lastReminders = null
		lastText = ''
		onRemindersChanged([], null)
		// 此方法在原生主线程顺序执行，旧账号迟到的 replace 也会被原生 scope 拒绝。
		call('setSession', { scope: current.scope }).catch(() => { if (session === signature) session = '' })
		return current
	}
	async function apply(reminders, expected = account()) {
		const current = syncSession()
		if (!same(current, expected) || !current.scope) return
		const appliedRevision = ++revision, text = notificationText()
		const normalized = normalizeMedicationReminders(reminders).map(item => ({
			...item, name: text.name === null ? item.name : text.name
		}))
		onRemindersChanged(normalized, current)
		await call('replace', { scope: current.scope, reminders: JSON.stringify(remindersForNative(normalized)), title: text.title })
		if (appliedRevision === revision && same(account(), current)) {
			lastReminders = normalized
			lastText = JSON.stringify(text)
		}
	}
	function refresh() {
		const current = syncSession()
		if (!current.scope || !plugin) return Promise.resolve()
		if (loading) return loading
		const capturedGeneration = generation, capturedRevision = revision
		const store = createMedicationReminderStore({ baseUrl: current.baseUrl, storage, get, post })
		const pending = store.load().then(reminders => {
			if (generation === capturedGeneration && revision === capturedRevision && same(account(), current)) return apply(reminders, current)
		}).finally(() => { if (loading === pending) loading = null })
		loading = pending
		return pending
	}
	return {
		available: !!plugin,
		account, apply, refresh,
		checkAccount() {
			const before = session
			syncSession()
			if (session !== before) return refresh()
			// 语言改变时复用已保存的计划更新通知文案，不依赖网络，也不写服务器。
			if (lastReminders && lastText !== JSON.stringify(notificationText())) return apply(lastReminders)
			return Promise.resolve()
		},
		logout() {
			generation++; revision++; session = ''; loading = null
			lastReminders = null; lastText = ''
			onRemindersChanged([], null)
			return call('setSession', { scope: '' })
		},
		status: () => call('status', {}),
		health: (method, args = {}) => {
			const current = syncSession()
			if (!current.scope) return Promise.reject(new Error('Not signed in'))

			return call(method, { ...args, scope: current.scope })
		},
		openSettings: (kind, sound) => call('openSettings', { kind, sound }),
		preview: (sound, seconds) => call('preview', seconds == null ? { sound } : { sound, seconds }),
		stopPreview() {
			if (!plugin || typeof plugin.stopPreview !== 'function') return Promise.resolve()
			return call('stopPreview', {}).catch(() => {})
		}
	}
}

let runtime = null, accountTimer = null
function getRuntime(vm) {
	if (runtime) return runtime
	let plugin = null
	// #ifdef APP-PLUS
	try {
		if (uni.getSystemInfoSync().platform === 'android') plugin = uni.requireNativePlugin('Jakob-MedicationReminder')
		else if (uni.getSystemInfoSync().platform === 'ios') plugin = createIOSMedicationPlugin(invokeMedicationIOS)
	} catch (error) {}
	// #endif
	// 未包含插件的旧基座只显示不可用，不影响服务器保存。
	if (plugin && typeof plugin.replace !== 'function') plugin = null
	runtime = createMedicationNotifications({ storage: uni, plugin, getBaseUrl: () => vm.$url_APP_IP,
		get: (...args) => vm.$get(...args), post: (...args) => vm.$post(...args), title: () => vm.$t('吃药提醒'),
		reminderName: () => vm.$t('健康提醒服用药物'),
		onRemindersChanged: setMedicationReminderKeepAlive })
	return runtime
}
export function startMedicationNotifications(vm) {
	const service = getRuntime(vm)
	if (accountTimer || !service.available) return
	uni.$on('APP_LOGOUT', () => service.logout().catch(() => {}))
	uni.$on('MEDICATION_REMINDER_LOGOUT', () => service.logout().catch(() => {}))
	// 只检测登录态变化；后台提醒不依赖此轮询。
	accountTimer = setInterval(() => service.checkAccount().catch(() => {}), 1500)
	service.refresh().catch(() => {})
}
export function refreshMedicationNotifications(vm) { return getRuntime(vm).refresh().catch(() => {}) }
export function applyMedicationNotifications(vm, reminders, expected) { return getRuntime(vm).apply(reminders, expected) }
export function medicationNotificationAccount(vm) { return getRuntime(vm).account() }
export function medicationNotificationStatus(vm) { return getRuntime(vm).status() }
export function openMedicationNotificationSettings(vm, kind, sound) { return getRuntime(vm).openSettings(kind, sound) }
let previewLimitTimer = null
export function previewMedicationSound(vm, sound, seconds) {
	if (previewLimitTimer) {
		clearTimeout(previewLimitTimer)
		previewLimitTimer = null
	}
	return getRuntime(vm).preview(sound, seconds).then((result) => {
		previewLimitTimer = setTimeout(() => {
			previewLimitTimer = null
			stopMedicationSoundPreview(vm)
		}, 3000)
		return result
	})
}
export function stopMedicationSoundPreview(vm) {
	const service = getRuntime(vm)
	return service.available && service.stopPreview ? service.stopPreview() : Promise.resolve()
}

// 时长只给 iOS 选铃声文件。Android 保持原来的 sound 协议。
export function remindersForNative(reminders) {
	try {
		if (uni.getSystemInfoSync().platform !== 'android') return reminders
	} catch (error) { return reminders }
	return reminders.map(item => {
		const copy = { ...item }
		delete copy.soundSeconds
		return copy
	})
}
export function healthNotificationCall(vm, method, args) { return getRuntime(vm).health(method, args) }
