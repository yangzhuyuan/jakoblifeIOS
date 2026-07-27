/**
 * iOS 保活管理 —— 严格按 ios/keepAlive.js 导出的 API 调用：
 * initKeepAlive / startBackgroundTask / enableAudioKeepAlive / enableLocationKeepAlive
 * （定位才是有效保活：开关开启后保持连续定位，勿前后台反复开关）
 */
import {
	initKeepAlive,
	startBackgroundTask,
	enableAudioKeepAlive,
	enableLocationKeepAlive
} from './ios/keepAlive.js'

export const QX_BLE_SLOT_ALARM_POLL_SEC = 15
export const QX_BLE_BG_LOCATION_POLL_SEC = 5

let wakeHandler = null
let heartbeatHandler = null
let measuringCheck = null
let keepAliveInited = false
let initPromise = null
let audioEnabled = false
let locationEnabled = false
let backgroundKeepAliveMode = false
let lastWakeAt = 0
let lastHeartbeatAt = 0

function ensureInit() {
	if (keepAliveInited) return Promise.resolve()
	if (initPromise) return initPromise
	initPromise = initKeepAlive().then(() => {
		keepAliveInited = true
	}).catch((e) => {
		console.warn('[keepAliveManager] init', e)
		initPromise = null
	})
	return initPromise
}

function ensureAudio(force = false) {
	if (!force && audioEnabled) return
	try {
		enableAudioKeepAlive(true)
		audioEnabled = true
	} catch (e) {}
}

function ensureLocation(force = false) {
	if (!force && locationEnabled) return
	try {
		enableLocationKeepAlive(true)
		locationEnabled = true
	} catch (e) {}
}

function runAfterInit(fn) {
	if (keepAliveInited) {
		try {
			fn()
		} catch (e) {
			console.warn('[keepAliveManager] run', e)
		}
		return
	}
	ensureInit().then(() => {
		try {
			fn()
		} catch (e) {
			console.warn('[keepAliveManager] run after init', e)
		}
	}).catch(() => {})
}

/** 按 keepAlive.js：音频 + 连续定位 + 后台任务 */
function applyKeepAliveFromJsApi(withBgTask = false) {
	ensureAudio(true)
	ensureLocation(true)
	if (withBgTask) {
		startBackgroundTask(600).catch((e) => console.warn('[keepAliveManager] startBackgroundTask', e))
	}
	const now = Date.now()
	if (typeof heartbeatHandler === 'function' && now - lastHeartbeatAt >= 10000) {
		lastHeartbeatAt = now
		try {
			heartbeatHandler()
		} catch (e) {}
	}
	if (typeof wakeHandler === 'function' && now - lastWakeAt >= 2000) {
		lastWakeAt = now
		try {
			const ret = wakeHandler()
			if (ret && typeof ret.then === 'function') {
				ret.catch((err) => console.warn('[keepAliveManager] wake', err))
			}
		} catch (e) {}
	}
}

export function registerQxBleWakeHandler(fn) {
	wakeHandler = typeof fn === 'function' ? fn : null
}

export function registerQxBleHeartbeat(fn) {
	heartbeatHandler = typeof fn === 'function' ? fn : null
}

export function registerQxBleMeasuringCheck(fn) {
	measuringCheck = typeof fn === 'function' ? fn : null
}

export function updateNotification() {}

export function setBackgroundKeepAliveMode(enabled) {
	backgroundKeepAliveMode = !!enabled
}

export function ensureRunningForAppTimers() {
	runAfterInit(() => {
		applyKeepAliveFromJsApi(false)
	})
}

export function setAlarmForQxNextSlot(nextAt) {
	runAfterInit(() => {
		applyKeepAliveFromJsApi(false)
	})
}

export function forceRestartKeepAlive(nextAt) {
	backgroundKeepAliveMode = true
	runAfterInit(() => {
		audioEnabled = false
		locationEnabled = false
		applyKeepAliveFromJsApi(true)
	})
}

export function stopQxLocationAlarm() {
	locationEnabled = false
	audioEnabled = false
	backgroundKeepAliveMode = false
	try {
		enableLocationKeepAlive(false)
	} catch (e) {}
	try {
		enableAudioKeepAlive(false)
	} catch (e) {}
}

export function markAppContinuousLocationActive() {
	locationEnabled = true
}

export default {
	registerQxBleWakeHandler,
	registerQxBleHeartbeat,
	registerQxBleMeasuringCheck,
	updateNotification,
	ensureRunningForAppTimers,
	setAlarmForQxNextSlot,
	forceRestartKeepAlive,
	stopQxLocationAlarm,
	setBackgroundKeepAliveMode,
	markAppContinuousLocationActive,
	QX_BLE_SLOT_ALARM_POLL_SEC,
	QX_BLE_BG_LOCATION_POLL_SEC
}
