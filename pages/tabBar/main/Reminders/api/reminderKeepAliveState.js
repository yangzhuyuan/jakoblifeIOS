export const MEDICATION_KEEPALIVE_CHANGED = 'MEDICATION_KEEPALIVE_CHANGED'
const KEY = 'medication_reminder_keepalive'
const BP_KEY = 'blood_pressure_reminder_keepalive'

function scope(token, userId, baseUrl) {
	let hash = 2166136261
	const value = [token, userId, baseUrl].join('|')
	for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619)
	return (hash >>> 0).toString(16)
}

export function hasMedicationReminderKeepAlive() {
	return [KEY, BP_KEY].some(key => {
		const state = uni.getStorageSync(key)
		return !!(state && state.enabled && uni.getStorageSync('token') && state.scope ===
			scope(uni.getStorageSync('token'), uni.getStorageSync('userid'), uni.getStorageSync('URL_APP_IP')))
	})
}

export function setBloodPressureReminderKeepAlive(settings, account) {
	// 血压提醒走系统本地通知，开启时不再写保活标记。
	// if (account && (account.token !== uni.getStorageSync('token') || account.userId !== uni.getStorageSync('userid') || account.baseUrl !== uni.getStorageSync('URL_APP_IP'))) return
	// const enabled = !!(account && settings && settings.enabled && settings.reminders.some(item => item.enabled))
	// if (enabled) uni.setStorageSync(BP_KEY, { enabled, scope: scope(account.token, account.userId, account.baseUrl) })
	// else uni.removeStorageSync(BP_KEY)
	// uni.$emit(MEDICATION_KEEPALIVE_CHANGED)
}

export function setMedicationReminderKeepAlive(reminders, account) {
	// 用药提醒走系统本地通知，开启时不再写保活标记。
	// if (account && (account.token !== uni.getStorageSync('token') || account.userId !== uni.getStorageSync('userid') || account.baseUrl !== uni.getStorageSync('URL_APP_IP'))) return
	// const enabled = !!(account && reminders.some(item => item.enabled && item.times.length && item.weekdays.length))
	// if (enabled) uni.setStorageSync(KEY, { enabled, scope: scope(account.token, account.userId, account.baseUrl) })
	// else uni.removeStorageSync(KEY)
	// uni.$emit(MEDICATION_KEEPALIVE_CHANGED)
}
