import { isThirdPartyReaderSn } from './bpReaderDevice.js'
import {
	enableAudioKeepAlive,
	enableLocationKeepAlive
} from '@/nativeplugins/KeepAlivesdkplugin/ios/keepAlive.js'

// 仅用于实体设备的后台保活资格判断；最后一块手表主动解绑后暂停，重新绑定手表恢复。
// 保活本身走现有 iOS：enableAudioKeepAlive / enableLocationKeepAlive，以及 qx:keepalive。
export const DEVICE_BINDING_STATE_CHANGED = 'DEVICE_BINDING_STATE_CHANGED'
export const LAST_WATCH_UNBOUND = 'LAST_WATCH_UNBOUND'
const STORAGE_KEY = 'app_bound_device_state'
let revision = 0

function currentScope() {
	const token = uni.getStorageSync('token')
	if (!token) return ''
	// 缓存按登录凭据及环境隔离，不额外保存原始 token。
	const value = String(uni.getStorageSync('URL_APP_IP') || '') + '|' + token
	let hash = 2166136261
	for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619)
	return (hash >>> 0).toString(16)
}

export function getDeviceBindingContext() {
	return { scope: currentScope(), revision }
}

export function hasAnyBoundDevice() {
	const scope = currentScope()
	const state = uni.getStorageSync(STORAGE_KEY)
	return !!(scope && state && state.scope === scope && state.hasDevices === true && !state.watchKeepAliveStopped)
}

export function isWatchKeepAliveStopped() {
	const scope = currentScope()
	const state = uni.getStorageSync(STORAGE_KEY)
	return !!(scope && state && state.scope === scope && state.watchKeepAliveStopped)
}

function isWatchModel(modelId) {
	return String(modelId) === '30000' || String(modelId) === '30001'
}

function physicalDevices(rows) {
	return rows.filter((item) => !isThirdPartyReaderSn(item && item.deviceSn))
}

function scheduleKeepAliveOn() {
	const isOn = (v) => v === true || v === 'true' || v === 1 || v === '1'
	return isOn(uni.getStorageSync('switchHER')) || isOn(uni.getStorageSync('switchEmotionHER'))
}

function applyIosWatchKeepAlive(stopped) {
	if (stopped) {
		try { enableAudioKeepAlive(false) } catch (e) {}
		try { enableLocationKeepAlive(false) } catch (e) {}
		try { uni.$emit('qx:keepalive:stop') } catch (e) {}
		return
	}
	if (!scheduleKeepAliveOn()) return
	try { enableAudioKeepAlive(true) } catch (e) {}
	try { enableLocationKeepAlive(true) } catch (e) {}
	try { uni.$emit('qx:keepalive:start') } catch (e) {}
}

function saveState(hasDevices, watchKeepAliveStopped = isWatchKeepAliveStopped()) {
	const scope = currentScope()
	if (!scope) return
	const previous = uni.getStorageSync(STORAGE_KEY)
	uni.setStorageSync(STORAGE_KEY, { scope, hasDevices, watchKeepAliveStopped })
	const flagChanged = !previous || previous.scope !== scope ?
		!!watchKeepAliveStopped :
		!!previous.watchKeepAliveStopped !== !!watchKeepAliveStopped
	if (!previous || previous.scope !== scope || previous.hasDevices !== hasDevices ||
		!!previous.watchKeepAliveStopped !== watchKeepAliveStopped) {
		uni.$emit(DEVICE_BINDING_STATE_CHANGED, hasAnyBoundDevice())
	}
	if (flagChanged) applyIosWatchKeepAlive(!!watchKeepAliveStopped)
}

// 失败/非列表响应不覆盖缓存；绑定、解绑或切换账号之前发出的旧请求不能覆盖新状态。
export function recordBoundDevices(rows, context = getDeviceBindingContext()) {
	if (!Array.isArray(rows) || context.scope !== currentScope() || context.revision !== revision) return
	const devices = physicalDevices(rows)
	saveState(devices.length > 0, devices.some(item => isWatchModel(item.deviceModelId)) ? false : isWatchKeepAliveStopped())
}

export function markDeviceBound(modelId) {
	revision++
	saveState(true, isWatchModel(modelId) ? false : isWatchKeepAliveStopped())
	uni.$emit('HEALTH_REMINDER_DEVICES_CHANGED')
}

export function recordDeviceUnbound(deviceSn, rows, context = getDeviceBindingContext()) {
	if (!deviceSn || !Array.isArray(rows) || context.scope !== currentScope()) return
	const devices = physicalDevices(rows)
	const remaining = devices.filter(item => String(item.deviceSn) !== String(deviceSn))
	const lastWatch = devices.some(item => String(item.deviceSn) === String(deviceSn) && isWatchModel(item.deviceModelId)) &&
		!remaining.some(item => isWatchModel(item.deviceModelId))
	revision++
	saveState(remaining.length > 0, lastWatch || isWatchKeepAliveStopped())
	if (lastWatch) uni.$emit(LAST_WATCH_UNBOUND)
	uni.$emit('HEALTH_REMINDER_DEVICES_CHANGED')
}

// APP_LOGOUT 在清空 storage 前发出，先通知现有后台任务停止。
uni.$on('APP_LOGOUT', () => {
	revision++
	uni.removeStorageSync(STORAGE_KEY)
	uni.$emit(DEVICE_BINDING_STATE_CHANGED, false)
})
