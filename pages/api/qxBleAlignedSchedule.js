/**
 * 定时测量：按云端/本地 QX_DATA 调度 PPG。
 * 支持两套时段（无感 + 情绪）：各自开关/起止/间隔；槽位按「时钟整点」对齐；
 * 多套时段在同一时刻重合时只下发一次 PPG。
 * 例 8:34–18:52、间隔 30 → 9:00、9:30…；8:00–18:00、间隔 60 → 整点。
 * BPW1 / BPW6 分别下发对应测量命令。
 * 本槽连续下发失败 3 次后：若距下一槽仍 ≥5 分钟可补发 1 次；不足 5 分钟则跳过本槽，排下一新槽。
 */

import Vue from 'vue'
import {
	getRequest
} from './request.js'
import {
	u16proBLE
} from './protocol/u16pro-ble-manager.js'
import {
	APP_IP_CN,
	getActiveAppBaseUrl
} from './appBaseHosts.js'
import keepAliveManager from '@/nativeplugins/KeepAlivesdkplugin/keepAliveManager.js'
const INTERVAL_MINUTES = [10, 30, 60, 120]
const DAY_MIN = 1440
const POLL_OUTSIDE_MS = 60 * 1000
const QX_REMOTE_REFRESH_MIN_MS = 3 * 60 * 1000
const QX_REMOTE_REFRESH_MISSING_MS = 12 * 1000
const FALLBACK_BASE_URL = APP_IP_CN

const OTA_DATA_RES_WATCH_CMD_IDS = new Set([
	'6986AF9F0656352E382E350741423536313043',
	'69C0EB890656352E382E370741423536313043',
	'69D616630656352E382E380741423536313043',
	'69E5814C0656352E382E390741423536313043',
	'69E587830656352E382E380741423536313043'
])

const DEFAULT_SERVICE_ID = '81EEA001-E735-49EC-8A11-7E32CAE1E14E'
const DEFAULT_CHAR_ID = '81EEA003-E735-49EC-8A11-7E32CAE1E14E'

const QX_BLE_NEXT_FIRE_AT_KEY = 'qx_ble_next_fire_at'
const QX_BLE_SCHEDULED_MEASURE_KEY = 'qx_ble_scheduled_measure'
export const QX_MAIN_SLEEP_ALERT_DISABLED_KEY = 'sleep_alertdisabled'
export const QX_BPW6_EMOTION_MEASURE_KEY = 'qx_bpw6_emotion_measure'
const QX_BLE_MEASURE_SLOT_AT_KEY = 'qx_ble_measure_slot_at'
const BPW6_PPG_SCHEDULE_DURATION_SEC = 60
/** 情绪定时：原生保活闹钟固定每 15 秒唤醒一次，检查是否到达对齐槽位（参考 keepAliveManager） */
export const QX_BLE_SLOT_ALARM_POLL_SEC = 15

const QX_SCHEDULE_HEARTBEAT_MS = 5 * 1000
const QX_MEASURE_SESSION_MAX_MS = 5 * 60 * 1000
const QX_BPW6_MEASURE_SESSION_MAX_MS = 10 * 60 * 1000
const QX_MEASURE_SESSION_ORPHAN_MS = 3 * 60 * 1000
const QX_DEFERRED_PLAN_MAX_RETRY = 4
const QX_RECONCILE_FLAGS_GRACE_MS = 35 * 1000
const QX_SLOT_CLAIM_ACTIVE_MS = 45 * 1000
const QX_SLOT_CLAIM_ORPHAN_MS = 40 * 1000

let qxBleTimer = null
let qxMeasureWatchdogTimer = null
let qxHeartbeatTimer = null
let deferredPlanNextTimer = null
/** 后台补发看守定时器（不依赖回前台） */
let qxBgCatchupTimers = []
/** BPW6 定时测量：采集时长结束后兜底拉取 PPG（防 0x58 丢失导致不上报） */
let qxBpw6PpgPullFallbackTimer = null
/** 当前已挂载补发看守的槽位，避免重复 clear 冲掉即将到点的 timer */
let qxBgCatchupArmedSlotAt = 0
let lastBgLightCatchupAt = 0
/** 当前 JS 定时器对应的槽位时间戳，避免心跳重复挂载刷日志 */
let qxArmedFireAt = 0
let lastQxRemoteFetchAt = 0
let planNextInFlight = false
let qxMeasureInFlight = false
let qxScheduleSessionFirstRun = false
let qxAppInForeground = true
let qxWakeTickInFlight = false
let qxSlotExecuteLockAt = 0
let qxSlotClaimedAt = 0
let qxMeasureSessionStartedAt = 0
let deferredPlanNextRetry = 0
/** 最近一次 BLE 命令下发成功的槽位时间戳；用于保证「每个新槽位必须发一次」 */
let qxLastDispatchedSlotAt = 0

/** 同一槽位 BLE 下发最多尝试次数（含首次）；用尽后按「距下一槽是否≥5分钟」决定是否补发一次 */
const QX_DISPATCH_MAX_ATTEMPTS = 3
const QX_DISPATCH_RETRY_DELAY_MS = 2500
/** 距下一对齐槽位仍 ≥ 此值时，允许本槽补发；不足则跳过到新槽 */
const QX_SLOT_MAKEUP_REMAIN_MS = 5 * 60 * 1000
/** 已对本槽做过「3 次失败后补发一次」的槽位时间戳 */
let qxSlotMakeupUsedAt = 0

function delayMs(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

function markSlotDispatched(slotAt) {
	if (slotAt > 0) qxLastDispatchedSlotAt = slotAt
}

function hasDispatchedCurrentSlot(slotAt) {
	return slotAt > 0 && qxLastDispatchedSlotAt === slotAt
}

/** 该槽位已到点、仍在本间隔内、且尚未成功下发过 → 必须发送 */
function isNewSlotDueNeedingDispatch(slotAt) {
	if (!slotAt || slotAt <= 0) return false
	if (Date.now() < slotAt - 500) return false
	if (shouldSkipQxSlotCatchup(slotAt)) return false
	return !hasDispatchedCurrentSlot(slotAt)
}

function isBleNoDeviceError(err) {
	const code = err && (err.errCode != null ? err.errCode : err.code)
	const msg = String((err && (err.errMsg || err.message)) || err || '')
	return code === 10002 || code === '10002' || msg.includes('no device') || msg.includes('10002')
}

function isQxBleDeviceConnected(deviceId) {
	return new Promise((resolve) => {
		if (!deviceId) {
			resolve(false)
			return
		}
		uni.getConnectedBluetoothDevices({
			success: (res) => {
				const list = res.devices || []
				resolve(list.some((d) => d && d.deviceId === deviceId))
			},
			fail: () => resolve(false)
		})
	})
}

function openQxBluetoothAdapter() {
	return new Promise((resolve) => {
		uni.openBluetoothAdapter({
			complete: () => resolve()
		})
	})
}

/**
 * 下发前确保 BLE 已连接；10002 no device 时先重连再写命令。
 */
async function ensureQxBleDeviceConnected(deviceId) {
	if (!deviceId) return false
	if (await isQxBleDeviceConnected(deviceId)) {
		return true
	}
	logQx('设备未连接，尝试重连', deviceId)
	try {
		uni.$emit('qxBle:needReconnect', {
			deviceId
		})
	} catch (e) {}
	await openQxBluetoothAdapter()
	const linked = await new Promise((resolve) => {
		uni.createBLEConnection({
			deviceId,
			timeout: 12000,
			success: () => {
				logQx('重连成功', deviceId)
				resolve(true)
			},
			fail: (err) => {
				const code = err && (err.errCode != null ? err.errCode : err.code)
				const msg = String((err && err.errMsg) || '')
				if (code === -1 || msg.includes('already') || msg.includes('已连接')) {
					logQx('重连：设备已处于连接中', deviceId)
					resolve(true)
				} else {
					logQx('重连失败', err)
					resolve(false)
				}
			}
		})
	})
	if (!linked) return false
	await delayMs(2000)
	await new Promise((resolve) => {
		uni.getBLEDeviceServices({
			deviceId,
			complete: () => resolve()
		})
	})
	await delayMs(800)
	const ok = await isQxBleDeviceConnected(deviceId)
	logQx(ok ? '重连后连接确认成功' : '重连后仍未连接', deviceId)
	return ok
}

function isBpw6EmotionMeasure() {
	const bpw6 = uni.getStorageSync('BPW6devicemac')
	const bpw1 = uni.getStorageSync('deviceIdwatch')
	// 仅绑 BPW6：自动走 BPW6（解绑 BPW1 再绑 BPW6 无需重进设置页）
	if (bpw6 && !bpw1) return true
	// 双绑 / 仅 BPW1：仍以设置页写入的标记为准，行为不变
	const v = uni.getStorageSync(QX_BPW6_EMOTION_MEASURE_KEY)
	return v === true || v === 'true' || v === 1 || v === '1'
}

function getQxEmotionDeviceId() {
	if (isBpw6EmotionMeasure()) {
		return uni.getStorageSync('BPW6devicemac') || ''
	}
	return uni.getStorageSync('deviceIdwatch') || ''
}

function formatLocalDateTime(date = new Date()) {
	const pad = (n, len = 2) => String(n).padStart(len, '0')
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
		`${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`
}

function formatQxLogDetail(value) {
	if (value === undefined) return ''
	if (value === null) return 'null'
	if (typeof value === 'object') {
		try {
			return JSON.stringify(value)
		} catch (e) {
			return String(value)
		}
	}
	return String(value)
}

/** 控制台 + 首页调试面板（Main 监听 uni.$on('qxBleLog')） */
function logQx(tag, ...details) {
	const ts = formatLocalDateTime()
	if (details.length === 0) {
		// console.log(`[qxBle][${ts}] ${tag}`)
	} else {
		// console.log(`[qxBle][${ts}] ${tag}`, ...details)
	}
	try {
		const detailStr = details.map(formatQxLogDetail).filter(Boolean).join(' ')
		const text = detailStr ? `[qxBle] ${tag} ${detailStr}` : `[qxBle] ${tag}`
		uni.$emit('qxBleLog', text)
	} catch (e) {}
}

function formatSlotTime(ts) {
	if (!ts || !Number.isFinite(ts)) return '-'
	return new Date(ts).toLocaleString('zh-CN', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	})
}

function hasOngoingQxWork() {
	return qxMeasureInFlight || planNextInFlight
}

export function isMainSleepAlertMeasureBusy() {
	const v = uni.getStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY)
	if (v === false || v === 'false' || v === 0 || v === '0') return false
	return v === true || v === 'true' || v === 1 || v === '1'
}

function isQxInternalDispatchBusy() {
	return qxMeasureInFlight || isQxSlotClaimActive()
}

function isQxSlotClaimActive() {
	if (qxSlotClaimedAt <= 0) return false
	return Date.now() - qxSlotClaimedAt < QX_SLOT_CLAIM_ACTIVE_MS
}

function isQxScheduleMeasureBusy() {
	if (qxMeasureInFlight || isQxSlotClaimActive()) return true
	if (!isBpw6EmotionMeasure()) return isMainSleepAlertMeasureBusy()
	// BPW6 定时测量：云端上传/分析不应占用调度槽位，仅 inFlight 阶段阻塞
	return isQxScheduledMeasureStorageOn() && isMainSleepAlertMeasureBusy()
}

/** 已成功下发、正在等手表回传的真实采集会话（与「假忙/占槽残留」区分） */
function hasQxRealMeasureSession() {
	if (qxMeasureInFlight) return true
	if (isQxScheduledMeasureStorageOn()) return true
	const sendwatch = uni.getStorageSync('sendwatch')
	return sendwatch === 1 || sendwatch === '1'
}

function clearQxScheduledEmotionBusyFlags(opts = {}) {
	uni.removeStorageSync('sendwatch')
	// BPW6：云端分析期间仍需锁住立即测量按钮，由 Main.recover 再清
	if (opts.keepSleepAlertDisabled === true) {
		return
	}
	uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, false)
	try {
		uni.$emit('qxBle:sleepAlertDisabled', false)
	} catch (e) {}
}

function getQxMeasureSessionMaxMs() {
	return isBpw6EmotionMeasure() ? QX_BPW6_MEASURE_SESSION_MAX_MS : QX_MEASURE_SESSION_MAX_MS
}

function advanceToNextScheduleSlotAfterMeasure(completedSlotAt = 0) {
	const slot = completedSlotAt > 0 ? completedSlotAt : readNextFireAt()
	if (slot > 0) {
		const nextAt = syncNextAlignedFireAt(new Date(slot + 1))
		// logQx('采集后推进槽位', `完成槽位${formatSlotTime(slot)}`, `下一${formatSlotTime(nextAt)}`)
		return nextAt
	}
	return syncNextAlignedFireAt(new Date())
}

function schedulePlanNextAfterMeasureEnd(reason) {
	if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) return
	planNext({
		lifecycle: true
	}).catch((e) => console.warn(`[qxBle] planNext after ${reason}`, e))
}

function shouldPreserveCurrentMeasureSlot() {
	if (isQxScheduleMeasureBusy()) return true
	const measureSlot = readMeasureSlotAt()
	if (measureSlot <= 0) return false
	return Date.now() - measureSlot < readMinEnabledIntervalMinute() * 60 * 1000
}

function markQxScheduledMeasureStorage() {
	uni.setStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY, 1)
}

function clearQxScheduledMeasureStorage() {
	uni.removeStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
}

function cancelDeferredPlanNext() {
	if (deferredPlanNextTimer != null) {
		clearTimeout(deferredPlanNextTimer)
		deferredPlanNextTimer = null
	}
}

function clearStaleQxScheduledMeasureState() {
	if (isQxScheduleMeasureBusy() || isQxInternalDispatchBusy()) return
	const scheduled = uni.getStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	if (scheduled !== 1 && scheduled !== '1') return
	const sendwatch = uni.getStorageSync('sendwatch')
	if (sendwatch === 1 || sendwatch === '1') return
	clearQxScheduledMeasureStorage()
	cancelDeferredPlanNext()
	// logQx('清理残留调度采集标记')
}

function isQxScheduledMeasureStorageOn() {
	const scheduled = uni.getStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	return scheduled === 1 || scheduled === '1'
}

function resetQxScheduleBusyState(reason, opts = {}) {
	const advanceSlot = opts.advanceSlot === true
	const completedSlotAt = readMeasureSlotAt() || readNextFireAt()
	const wasInFlight = qxMeasureInFlight
	clearQxMeasureWatchdog()
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	deferredPlanNextRetry = 0
	releaseQxSlotExecuteLock()
	qxScheduleSessionFirstRun = false
	clearQxScheduledMeasureStorage()
	clearMeasureSlotAt()
	if (opts.clearSendwatch !== false && (wasInFlight || advanceSlot)) {
		clearQxScheduledEmotionBusyFlags({
			keepSleepAlertDisabled: opts.keepSleepAlertDisabled === true
		})
	}
	if (wasInFlight || reason) {
		// logQx('采集结束恢复待命', reason || '-')
	}
	if (advanceSlot && isSwitchOn() && isCurrentlyInScheduleWindow()) {
		advanceToNextScheduleSlotAfterMeasure(completedSlotAt)
		schedulePlanNextAfterMeasureEnd(reason || '采集结束')
	}
}

function clearQxMeasureWatchdog() {
	if (qxMeasureWatchdogTimer != null) {
		clearTimeout(qxMeasureWatchdogTimer)
		qxMeasureWatchdogTimer = null
	}
}

function startQxMeasureWatchdog() {
	clearQxMeasureWatchdog()
	const maxMs = getQxMeasureSessionMaxMs()
	qxMeasureWatchdogTimer = setTimeout(() => {
		qxMeasureWatchdogTimer = null
		if (!qxMeasureInFlight) return
		// logQx('采集超时', `${maxMs / 60000}分钟无结束信号`)
		finishQxBleMeasurementSession('采集超时')
	}, maxMs)
}

function abortQxBleMeasurementForNewSlot(reason) {
	if (!qxMeasureInFlight && uni.getStorageSync('sendwatch') !== 1) {
		clearQxScheduledMeasureStorage()
		return false
	}
	clearQxMeasureWatchdog()
	cancelDeferredPlanNext()
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	deferredPlanNextRetry = 0
	releaseQxSlotExecuteLock()
	qxScheduleSessionFirstRun = false
	clearQxScheduledMeasureStorage()
	clearMeasureSlotAt()
	// logQx('终止上一轮', reason, `原槽位${formatSlotTime(readNextFireAt())}`)
	return true
}

function reconcileQxMeasureInFlightState() {
	if (!qxMeasureInFlight) return false
	const sendwatch = uni.getStorageSync('sendwatch')
	const scheduled = uni.getStorageSync(QX_BLE_SCHEDULED_MEASURE_KEY)
	const hasSend = sendwatch === 1 || sendwatch === '1'
	const hasSched = scheduled === 1 || scheduled === '1'
	if (!hasSend && !hasSched) {
		const refAt = qxMeasureSessionStartedAt || qxSlotClaimedAt
		if (refAt <= 0 || Date.now() - refAt < QX_RECONCILE_FLAGS_GRACE_MS) return false
		// logQx('状态纠偏', 'sendwatch/调度标记已清，结束滞留会话')
		finishQxBleMeasurementSession('状态纠偏-标记已清')
		return true
	}
	const started = qxMeasureSessionStartedAt
	if (started > 0 && Date.now() - started > QX_MEASURE_SESSION_ORPHAN_MS) {
		// logQx('状态纠偏', `下发后${Math.round((Date.now() - started) / 1000)}秒无结束回调`)
		finishQxBleMeasurementSession('状态纠偏-会话超时')
		return true
	}
	return false
}

function reconcileQxScheduleBusyState() {
	if (reconcileQxMeasureInFlightState()) return true
	const now = Date.now()
	const hasSched = isQxScheduledMeasureStorageOn()
	const sendwatch = uni.getStorageSync('sendwatch')
	const hasSend = sendwatch === 1 || sendwatch === '1'
	const mainMeasuring = isMainSleepAlertMeasureBusy()

	if (!mainMeasuring && (hasSched || hasSend) && !qxMeasureInFlight && !isQxSlotClaimActive()) {
		// 仍有 sendwatch/调度标记：视为手表传输中，勿清（BPW1 Status01 后也可能短暂未置 sleep_alertdisabled）
		return false
	}
	if (!mainMeasuring && qxSlotClaimedAt > 0 && qxMeasureSessionStartedAt <= 0) {
		const claimAge = now - qxSlotClaimedAt
		if (claimAge >= QX_SLOT_CLAIM_ORPHAN_MS) {
			// logQx('状态纠偏', `抢占${Math.round(claimAge / 1000)}秒仍无采集下发`)
			resetQxScheduleBusyState('纠偏-抢占无采集', {
				advanceSlot: true,
				clearSendwatch: hasSched
			})
			return true
		}
	}
	if (!mainMeasuring && qxMeasureInFlight) {
		// 已下发成功（有标记）时交给 watchdog / 采集结束回调，禁止按 35s 误杀
		if (hasSend || hasSched) return false
		const refAt = qxMeasureSessionStartedAt || qxSlotClaimedAt
		if (refAt > 0 && now - refAt >= QX_RECONCILE_FLAGS_GRACE_MS) {
			// logQx('状态纠偏', 'Main未测量但调度inFlight')
			resetQxScheduleBusyState('纠偏-inFlight无采集', {
				advanceSlot: true
			})
			return true
		}
	}
	return false
}

function finishQxBleMeasurementSession(reason) {
	if (!qxMeasureInFlight && !isQxScheduledMeasureStorageOn() && !isQxSlotClaimActive()) return
	resetQxScheduleBusyState(reason, {
		advanceSlot: true,
		clearSendwatch: true
	})
}

export function onQxBleWatchCollectionEnded(reason = '设备采集结束') {
	clearBpw6ScheduledPpgPullFallback()
	const wasInFlight = qxMeasureInFlight
	const wasScheduled = wasInFlight || isQxScheduledMeasureStorageOn() ||
		uni.getStorageSync('sendwatch') === 1 || uni.getStorageSync('sendwatch') === '1'
	if (wasScheduled && isBpw6EmotionMeasure()) {
		// PPG 读完即可解除调度忙碌（sendwatch）；云端分析仍由 Main 锁住立即测量按钮
		clearQxScheduledEmotionBusyFlags({
			keepSleepAlertDisabled: true
		})
		uni.$emit('qxBle:scheduledMeasureEnded', {
			reason
		})
	}
	if (wasInFlight || wasScheduled) {
		// 强制推进下一对齐槽位（避免 finish 因标记已清而提前 return）
		resetQxScheduleBusyState(reason, {
			advanceSlot: true,
			clearSendwatch: true,
			keepSleepAlertDisabled: isBpw6EmotionMeasure()
		})
		return
	}
	clearQxScheduledMeasureStorage()
	resetQxScheduleBusyState(reason, {
		advanceSlot: false,
		clearSendwatch: false
	})
}

function scheduleDeferredPlanNext(reason) {
	if (deferredPlanNextTimer != null) return
	// logQx('延后排程', reason)
	deferredPlanNextTimer = setTimeout(() => {
		deferredPlanNextTimer = null
		if (qxMeasureInFlight) {
			reconcileQxScheduleBusyState()
			if (qxMeasureInFlight) {
				deferredPlanNextRetry += 1
				if (deferredPlanNextRetry >= QX_DEFERRED_PLAN_MAX_RETRY) {
					// logQx('延后排程', '多次等待仍忙，强制结束滞留会话')
					finishQxBleMeasurementSession('延后排程强制结束')
				} else {
					scheduleDeferredPlanNext('测量仍未结束')
				}
			}
			if (qxMeasureInFlight) return
		}
		deferredPlanNextRetry = 0
		clearStaleQxScheduledMeasureState()
		planNext({
			lifecycle: true
		}).catch((e) => console.warn('[qxBle] deferred planNext', e))
	}, 8500)
}

export function setQxBleAppForegroundState(foreground) {
	qxAppInForeground = !!foreground
	try {
		if (typeof keepAliveManager.setBackgroundKeepAliveMode === 'function') {
			keepAliveManager.setBackgroundKeepAliveMode(!foreground)
		}
	} catch (e) {}
}

function getScheduleSnapshot() {
	const profiles = readScheduleProfiles()
	const enabled = readEnabledSchedules()
	const now = new Date()
	const nextById = {}
	enabled.forEach((p) => {
		const next = getNextAlignedSlotDate(now, p.t1, p.t2, p.intervalMin, null)
		nextById[p.id] = formatSlotTime(next ? next.getTime() : 0)
	})
	return {
		开关: isSwitchOn(),
		无感: profiles[0] ? `${profiles[0].on ? '开' : '关'} ${profiles[0].t1}-${profiles[0].t2}/${profiles[0].intervalMin}分下一${nextById.sensorless || '-'}` : '-',
		情绪: profiles[1] ? `${profiles[1].on ? '开' : '关'} ${profiles[1].t1}-${profiles[1].t2}/${profiles[1].intervalMin}分下一${nextById.emotion || '-'}` : '-',
		启用时段数: enabled.length,
		时段内: isCurrentlyInScheduleWindow(),
		设备: getQxEmotionDeviceId() || '无',
		BPW6情绪: isBpw6EmotionMeasure(),
		合并下一槽位: formatSlotTime(readNextFireAt()),
		sleep_alertdisabled: isMainSleepAlertMeasureBusy()
	}
}

function getAppBaseUrl() {
	try {
		return getActiveAppBaseUrl(Vue)
	} catch (e) {
		const proto = Vue.prototype.$url_APP_IP
		if (proto && typeof proto === 'string') return proto
		return FALLBACK_BASE_URL
	}
}

function parseQxDataRow(dataStr) {
	if (!dataStr || typeof dataStr !== 'string') return null
	try {
		let objStr = dataStr.trim()
		if (!objStr.startsWith('{')) objStr = '{' + objStr
		if (!objStr.endsWith('}')) objStr = objStr + '}'
		const fixed = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (m, k, v) => {
			v = v.trim()
			if (v === 'true' || v === 'false') return `"${k}":${v}`
			if (!isNaN(v) && v !== '' && !v.includes('/') && !v.includes(':')) return `"${k}":${v}`
			return `"${k}":"${v}"`
		})
		return JSON.parse(fixed)
	} catch (e) {
		console.error('[qxBle] parseQxDataRow', e)
		return null
	}
}

function normalizeTimePicker(t) {
	const parts = String(t).split(':')
	if (parts.length < 2) return null
	const h = parseInt(parts[0], 10)
	const m = parseInt(parts[1], 10)
	if (Number.isNaN(h) || Number.isNaN(m)) return null
	const hh = String(Math.min(23, Math.max(0, h))).padStart(2, '0')
	const mm = String(Math.min(59, Math.max(0, m))).padStart(2, '0')
	return `${hh}:${mm}`
}

function needsQxStorageRefresh() {
	const t1 = uni.getStorageSync('starttime')
	const t2 = uni.getStorageSync('endtime')
	const ix = uni.getStorageSync('Interval_time')
	if (t1 === '' || t1 === undefined || t1 === null) return true
	if (t2 === '' || t2 === undefined || t2 === null) return true
	if (ix === '' || ix === undefined || ix === null) return true
	return false
}

export async function fetchQxDataAndApplyStorage() {
	const token = uni.getStorageSync('token')
	if (!token) return false
	const base = getAppBaseUrl()
	const res = await getRequest(base + '/prod-api/device/data/list', {
		dataType: 'QX_DATA'
	}, {
		Authorization: 'Bearer ' + token,
		'content-type': 'application/json'
	})
	if (res.code !== 200 || !res.rows || !res.rows.length || !res.rows[0].data) {
		console.warn('[qxBle] QX_DATA list empty or error', res && res.code)
		return false
	}
	const row = parseQxDataRow(res.rows[0].data)
	if (!row) return false
	if (row.starttime != null && row.starttime !== '') {
		const t = normalizeTimePicker(String(row.starttime))
		if (t) uni.setStorageSync('starttime', t)
	}
	if (row.endtime != null && row.endtime !== '') {
		const t = normalizeTimePicker(String(row.endtime))
		if (t) uni.setStorageSync('endtime', t)
	}
	if (row.intervalMinute != null && row.intervalMinute !== '') {
		const n = Number(row.intervalMinute)
		let ix = INTERVAL_MINUTES.indexOf(n)
		if (ix < 0) ix = 0
		uni.setStorageSync('Interval_time', ix)
	}
	if (row.SWITCH_QX !== undefined) {
		const on = row.SWITCH_QX === true || row.SWITCH_QX === 'true'
		uni.setStorageSync('switchHER', on)
	}
	// 第二套：情绪测量时段（可选，兼容旧云端无此字段）
	if (row.emotionStarttime != null && row.emotionStarttime !== '') {
		const t = normalizeTimePicker(String(row.emotionStarttime))
		if (t) uni.setStorageSync('starttime_emotion', t)
	}
	if (row.emotionEndtime != null && row.emotionEndtime !== '') {
		const t = normalizeTimePicker(String(row.emotionEndtime))
		if (t) uni.setStorageSync('endtime_emotion', t)
	}
	if (row.emotionIntervalMinute != null && row.emotionIntervalMinute !== '') {
		const n = Number(row.emotionIntervalMinute)
		let ix = INTERVAL_MINUTES.indexOf(n)
		if (ix < 0) ix = 0
		uni.setStorageSync('Interval_time_emotion', ix)
	}
	if (row.SWITCH_EMOTION !== undefined) {
		const on = row.SWITCH_EMOTION === true || row.SWITCH_EMOTION === 'true'
		uni.setStorageSync('switchEmotionHER', on)
	}
	// logQx('QX_DATA已同步', getScheduleSnapshot())
	return true
}

export async function maybeRefreshQxFromServer() {
	const token = uni.getStorageSync('token')
	if (!token) return
	const now = Date.now()
	const missing = needsQxStorageRefresh()
	const gap = missing ? QX_REMOTE_REFRESH_MISSING_MS : QX_REMOTE_REFRESH_MIN_MS
	if (now - lastQxRemoteFetchAt < gap) return
	lastQxRemoteFetchAt = now
	try {
		await fetchQxDataAndApplyStorage()
	} catch (e) {
		console.warn('[qxBle] QX_DATA 拉取失败', e)
	}
}

function hexToArrayBuffer(hex) {
	const buffer = new ArrayBuffer(hex.length / 2)
	const dataView = new DataView(buffer)
	for (let i = 0; i < hex.length; i += 2) {
		dataView.setUint8(i / 2, parseInt(hex.substr(i, 2), 16))
	}
	return buffer
}

function parseHM(timeStr) {
	if (!timeStr || typeof timeStr !== 'string') return NaN
	const parts = timeStr.split(':')
	if (parts.length < 2) return NaN
	const h = parseInt(parts[0], 10)
	const m = parseInt(parts[1], 10)
	if (Number.isNaN(h) || Number.isNaN(m)) return NaN
	if (h < 0 || h > 23 || m < 0 || m > 59) return NaN
	return h * 60 + m
}

function windowSpanMin(s, e) {
	if (e > s) return e - s
	if (e < s) return DAY_MIN - s + e
	return 0
}

function scheduleWindowOk(s, e) {
	if (Number.isNaN(s) || Number.isNaN(e) || s === e) return false
	const span = windowSpanMin(s, e)
	return span > 0 && span <= DAY_MIN
}

function isFlagOn(v) {
	return v === true || v === 'true' || v === 1 || v === '1'
}

function readIntervalIndex(storageKey, fallback = 0) {
	const ix = parseInt(uni.getStorageSync(storageKey), 10)
	const idx = Number.isNaN(ix) ? fallback : ix
	return INTERVAL_MINUTES[idx] != null ? idx : fallback
}

/** 两套定时配置：无感(switchHER) + 情绪(switchEmotionHER) */
function readScheduleProfiles() {
	return [{
		id: 'sensorless',
		on: isFlagOn(uni.getStorageSync('switchHER')),
		t1: uni.getStorageSync('starttime') || '08:00',
		t2: uni.getStorageSync('endtime') || '18:00',
		intervalMin: INTERVAL_MINUTES[readIntervalIndex('Interval_time')] ?? 10
	}, {
		id: 'emotion',
		on: isFlagOn(uni.getStorageSync('switchEmotionHER')),
		t1: uni.getStorageSync('starttime_emotion') || '08:00',
		t2: uni.getStorageSync('endtime_emotion') || '18:00',
		intervalMin: INTERVAL_MINUTES[readIntervalIndex('Interval_time_emotion')] ?? 10
	}]
}

/** 已开启且时段合法的配置（用于排槽；重合槽位自然取同一时间戳） */
function readEnabledSchedules() {
	return readScheduleProfiles().filter((p) => {
		if (!p.on) return false
		const s = parseHM(p.t1)
		const e = parseHM(p.t2)
		return scheduleWindowOk(s, e) && p.intervalMin > 0
	})
}

function isSwitchOn() {
	return readScheduleProfiles().some((p) => p.on)
}

function isWithinWindowMinute(nowM, s, e) {
	if (Number.isNaN(nowM) || Number.isNaN(s) || Number.isNaN(e) || s === e) return false
	if (e > s) return nowM >= s && nowM <= e
	if (e < s) return nowM >= s || nowM <= e
	return false
}

function readIntervalMinute() {
	return INTERVAL_MINUTES[readIntervalIndex('Interval_time')] ?? 10
}

/** 启用时段中的最小间隔（用于保留槽位等时长估算） */
function readMinEnabledIntervalMinute() {
	const list = readEnabledSchedules()
	if (!list.length) return readIntervalMinute()
	return Math.min(...list.map((p) => p.intervalMin))
}

function readScheduleTimes() {
	const enabled = readEnabledSchedules()
	if (enabled.length === 1) {
		return {
			t1: enabled[0].t1,
			t2: enabled[0].t2
		}
	}
	if (enabled.length > 1) {
		return {
			t1: enabled.map((p) => p.t1).join('/'),
			t2: enabled.map((p) => p.t2).join('/')
		}
	}
	return {
		t1: uni.getStorageSync('starttime') || '08:00',
		t2: uni.getStorageSync('endtime') || '18:00'
	}
}

/**
 * 下一个时钟对齐槽位：从当天 00:00 起每隔 I 分钟（30→:00/:30，60→整点），
 * 且落在 [starttime, endtime] 内（含跨夜时段）。
 * @param {Date} [earliest] 槽位时刻须 >= earliest（上次发送后取下一格）
 */
function getNextAlignedSlotDate(now, t1, t2, intervalMin, earliest = null) {
	const s = parseHM(t1)
	const e = parseHM(t2)
	const I = intervalMin
	if (!scheduleWindowOk(s, e) || I <= 0) return null
	const tol = 800
	const nowTs = earliest instanceof Date ? earliest.getTime() : now.getTime() - tol

	// 时钟整点对齐：不从开始时间步进，避免 8:34 起变成 8:34/9:04…
	for (let dAdd = -1; dAdd <= 3; dAdd++) {
		const mid = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dAdd, 0, 0, 0, 0)
		for (let m = 0; m < DAY_MIN; m += I) {
			if (!isWithinWindowMinute(m, s, e)) continue
			const cand = new Date(mid.getTime() + m * 60000)
			if (cand.getTime() >= nowTs) return cand
		}
	}
	return null
}

/** 多套时段取最早下一槽（不写 storage）；重合时刻只会得到同一时间戳 */
function peekNextAlignedSlotDate(earliest = null) {
	const schedules = readEnabledSchedules()
	if (!schedules.length) return null
	let best = null
	const now = new Date()
	for (let i = 0; i < schedules.length; i++) {
		const p = schedules[i]
		const slot = getNextAlignedSlotDate(now, p.t1, p.t2, p.intervalMin, earliest)
		if (!slot) continue
		if (!best || slot.getTime() < best.getTime()) best = slot
	}
	return best
}

function syncNextAlignedFireAt(earliest = null) {
	const slot = peekNextAlignedSlotDate(earliest)
	if (!slot) {
		clearNextFireAt()
		// logQx('无可用槽位', getScheduleSnapshot())
		return 0
	}
	persistNextFireAt(slot.getTime())
	// logQx('下一槽位', formatSlotTime(slot.getTime()), getScheduleSnapshot())
	return slot.getTime()
}

function persistNextFireAt(ts) {
	uni.setStorageSync(QX_BLE_NEXT_FIRE_AT_KEY, ts)
}

function readNextFireAt() {
	const n = Number(uni.getStorageSync(QX_BLE_NEXT_FIRE_AT_KEY))
	return Number.isFinite(n) && n > 0 ? n : 0
}

function readIntervalMs() {
	return readMinEnabledIntervalMinute() * 60 * 1000
}

/** 距「多时段合并后」下一槽的剩余毫秒 */
function msRemainUntilNextAlignedSlot(slotAt) {
	if (!slotAt || slotAt <= 0) return 0
	const next = peekNextAlignedSlotDate(new Date(slotAt + 1))
	if (!next) return 0
	return next.getTime() - Date.now()
}

/** 距下一槽仍 ≥5 分钟：可重试/补发本槽 */
function canMakeupOrRetryCurrentSlot(slotAt) {
	return msRemainUntilNextAlignedSlot(slotAt) >= QX_SLOT_MAKEUP_REMAIN_MS
}

/**
 * 是否应放弃本槽、改排下一新槽：
 * - 已进入下一合并对齐槽时间，或
 * - 距下一槽不足 5 分钟（不再补本槽）
 */
function shouldSkipQxSlotCatchup(slotAt) {
	if (!slotAt || slotAt <= 0) return false
	const now = Date.now()
	const next = peekNextAlignedSlotDate(new Date(slotAt + 1))
	if (next && now >= next.getTime() - 500) return true
	if (!next && now > slotAt + 500) return true
	return !canMakeupOrRetryCurrentSlot(slotAt)
}

/** 挂上下一槽 JS 定时器（采集中也要挂，否则只靠心跳，后台易错过） */
function armJsTimerForNextFireAt(reason = '') {
	const nextAt = readNextFireAt()
	if (nextAt <= 0) return false
	if (qxBleTimer != null && qxArmedFireAt === nextAt) {
		return true
	}
	const delay = Math.max(1000, nextAt - Date.now())
	qxArmedFireAt = nextAt
	schedulePlanNext(delay)
	return true
}

function skipQxOverdueSlotToCurrentAligned(reason = '') {
	const oldAt = readNextFireAt()
	if (!shouldSkipQxSlotCatchup(oldAt)) return oldAt
	// logQx('跳过已过槽位', reason || '-', `原槽位${formatSlotTime(oldAt)}`)
	if (isMainSleepAlertMeasureBusy() || isQxInternalDispatchBusy()) {
		resetQxScheduleBusyState('跳过已过槽位', {
			advanceSlot: false,
			clearSendwatch: true
		})
	} else {
		clearMeasureSlotAt()
		releaseQxSlotExecuteLock()
		clearQxScheduledMeasureStorage()
	}
	const now = Date.now()
	const newAt = syncNextAlignedFireAt(new Date(Math.max(now, oldAt + 1)))
	// logQx('跳过已过槽位', '新槽位', formatSlotTime(newAt))
	return newAt
}

function clearNextFireAt() {
	uni.removeStorageSync(QX_BLE_NEXT_FIRE_AT_KEY)
}

function persistMeasureSlotAt(ts) {
	if (Number.isFinite(ts) && ts > 0) {
		uni.setStorageSync(QX_BLE_MEASURE_SLOT_AT_KEY, ts)
	}
}

function readMeasureSlotAt() {
	const n = Number(uni.getStorageSync(QX_BLE_MEASURE_SLOT_AT_KEY))
	return Number.isFinite(n) && n > 0 ? n : 0
}

function clearMeasureSlotAt() {
	uni.removeStorageSync(QX_BLE_MEASURE_SLOT_AT_KEY)
}

function isSameQxSlotAlreadyClaimed(slotAt) {
	if (!slotAt || slotAt <= 0) return false
	const claimed = readMeasureSlotAt()
	if (claimed !== slotAt) return false
	if (!isQxScheduleMeasureBusy()) {
		if (claimed === slotAt) clearMeasureSlotAt()
		return false
	}
	return true
}

function tryBeginQxSlotExecute(slotAt) {
	if (!slotAt || slotAt <= 0) return false
	if (isSameQxSlotAlreadyClaimed(slotAt)) return false
	if (qxSlotExecuteLockAt === slotAt) return false
	qxSlotExecuteLockAt = slotAt
	qxSlotClaimedAt = Date.now()
	persistMeasureSlotAt(slotAt)
	qxMeasureInFlight = true
	return true
}

function releaseQxSlotExecuteLock() {
	qxSlotExecuteLockAt = 0
}

/** 下发失败后清占槽，保留 nextFireAt，便于同槽重试 */
function prepareSlotForDispatchRetry(slotAt = 0) {
	clearQxMeasureWatchdog()
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	qxSlotExecuteLockAt = 0
	clearMeasureSlotAt()
	clearQxScheduledMeasureStorage()
	clearQxScheduledEmotionBusyFlags()
	if (slotAt > 0) persistNextFireAt(slotAt)
}

/**
 * 单槽下发失败且重试用尽后：清光本槽占用状态，并推进到下一对齐槽位。
 */
function recoverAfterSlotDispatchFailure(failedSlotAt = 0, reason = '下发失败') {
	const baseSlot = failedSlotAt > 0 ? failedSlotAt : (readMeasureSlotAt() || readNextFireAt())
	logQx('槽位下发失败，清理并推进', reason, `失败槽位${formatSlotTime(baseSlot)}`)
	clearQxMeasureWatchdog()
	cancelDeferredPlanNext()
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	deferredPlanNextRetry = 0
	qxSlotExecuteLockAt = 0
	qxScheduleSessionFirstRun = false
	qxSlotMakeupUsedAt = 0
	clearQxScheduledMeasureStorage()
	clearMeasureSlotAt()
	// 失败必须清 sendwatch / sleep_alertdisabled，否则下一槽会被判「测量进行中」
	clearQxScheduledEmotionBusyFlags()
	const anchor = baseSlot > 0 ? baseSlot + 1 : Date.now()
	const newAt = syncNextAlignedFireAt(new Date(anchor))
	if (newAt <= 0) {
		schedulePlanNext(POLL_OUTSIDE_MS)
		return 0
	}
	const delay = Math.max(1000, newAt - Date.now())
	logQx('失败后下一槽位可正常发送', formatSlotTime(newAt), `${Math.round(delay / 1000)}秒后`)
	schedulePlanNext(delay)
	return newAt
}

/**
 * 连续失败 3 次后：距下一槽 ≥5 分钟则允许再试 1 次（补发）；否则跳过本槽。
 * @returns {'makeup'|'skip'}
 */
function decideAfterThreeDispatchFailures(slotAt) {
	const remainMs = msRemainUntilNextAlignedSlot(slotAt)
	const remainMin = Math.round(remainMs / 60000)
	if (qxSlotMakeupUsedAt === slotAt) {
		logQx('本槽已补发过仍失败，跳过到新槽', formatSlotTime(slotAt), `距下一槽约${remainMin}分钟`)
		return 'skip'
	}
	if (canMakeupOrRetryCurrentSlot(slotAt)) {
		qxSlotMakeupUsedAt = slotAt
		logQx('连续失败3次，距下一槽≥5分钟，补发一次', formatSlotTime(slotAt), `距下一槽约${remainMin}分钟`)
		return 'makeup'
	}
	logQx('连续失败3次，距下一槽不足5分钟，跳过本槽', formatSlotTime(slotAt), `距下一槽约${remainMin}分钟`)
	return 'skip'
}

function shouldPreemptMeasureForSlot(dueSlotAt) {
	// 新槽位尚未下发：必须抢占上一轮，保证每个槽位都发一次
	if (!isNewSlotDueNeedingDispatch(dueSlotAt)) return false
	return isQxScheduleMeasureBusy() || isQxInternalDispatchBusy() || hasQxRealMeasureSession()
}

function rescheduleQxToNextAlignedSlot(reason = '') {
	const oldAt = readNextFireAt()
	// 下发失败时必须强制推进；宽限期内 skipQxOverdue 会原样返回旧槽位导致空转
	let newAt = 0
	if (oldAt > 0 && !shouldSkipQxSlotCatchup(oldAt)) {
		newAt = syncNextAlignedFireAt(new Date(oldAt + 1))
	} else {
		newAt = skipQxOverdueSlotToCurrentAligned(reason)
	}
	if (newAt <= 0) {
		schedulePlanNext(POLL_OUTSIDE_MS)
		return
	}
	const delay = Math.max(0, newAt - Date.now())
	const oldLabel = oldAt > 0 && oldAt !== newAt ? `原${formatSlotTime(oldAt)}` : ''
	logQx('重排下一槽位', reason || '-', oldLabel, `下一${formatSlotTime(newAt)}`, `${Math.round(delay / 1000)}秒后`)
	schedulePlanNext(delay > 0 ? delay : 1000)
}

function runOneQxBpw1Measurement(deviceId, serviceId, characteristicId) {
	return new Promise((resolve, reject) => {
		logQx('开始发送BLE测量命令(BPW1)', deviceId)
		const bufferProbe = hexToArrayBuffer('e0000609200101000100')
		setTimeout(() => {
			uni.writeBLECharacteristicValue({
				deviceId,
				serviceId,
				characteristicId,
				writeType: 'write',
				value: bufferProbe,
				complete(complete) {
					if (complete.code === 10007) {
						logQx('探测帧写入成功')
						setTimeout(() => {
							const otaBP = uni.getStorageSync('otaBP')
							let bufferPpg = hexToArrayBuffer('e00006f3060104000101')
							if (OTA_DATA_RES_WATCH_CMD_IDS.has(otaBP)) {
								bufferPpg = hexToArrayBuffer('e0000611030125000101')
							}
							uni.writeBLECharacteristicValue({
								deviceId,
								serviceId,
								characteristicId,
								writeType: 'write',
								value: bufferPpg,
								complete(complete) {
									if (complete.code === 10007) {
										uni.setStorageSync('sendwatch', 1)
										markQxScheduledMeasureStorage()
										qxMeasureSessionStartedAt = Date.now()
										uni.removeStorageSync('otaBP')
										logQx('开始采集ACC/PPG数据')
										resolve()
									} else {
										uni.removeStorageSync('otaBP')
										uni.removeStorageSync('sendwatch')
										clearQxScheduledMeasureStorage()
										logQx('PPG命令写入失败', complete)
										if (qxAppInForeground) {
											uni.showToast({
												title: '请检查设备连接',
												icon: 'none',
												duration: 2000
											})
										}
										reject(complete)
									}
								}
							})
						}, 3000)
					} else {
						uni.removeStorageSync('sendwatch')
						clearQxScheduledMeasureStorage()
						logQx('探测帧写入失败', complete)
						reject(complete)
					}
				}
			})
		}, 3000)
	})
}

async function runOneQxBpw6PpgMeasurement(deviceId) {
	const targetDeviceId = deviceId || uni.getStorageSync('BPW6devicemac')
	if (!targetDeviceId) {
		throw new Error('无BPW6设备')
	}
	// logQx('开始BPW6 PPG情绪测量', targetDeviceId, `时长${BPW6_PPG_SCHEDULE_DURATION_SEC}秒`)
	uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, true)
	try {
		uni.$emit('qxBle:sleepAlertDisabled', true)
	} catch (e) {}
	try {
		const result = await u16proBLE.startPPGMeasurementWithDuration(
			BPW6_PPG_SCHEDULE_DURATION_SEC,
			targetDeviceId
		)
		if (!result || !result.success) {
			uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, false)
			try {
				uni.$emit('qxBle:sleepAlertDisabled', false)
			} catch (e) {}
			const hint = u16proBLE.getPpgStartHint(result)
			if (qxAppInForeground) {
				uni.showToast({
					title: hint,
					icon: 'none',
					duration: 2000
				})
			}
			throw new Error(hint || 'BPW6 PPG启动失败')
		}
		uni.setStorageSync('sendwatch', 1)
		markQxScheduledMeasureStorage()
		qxMeasureSessionStartedAt = Date.now()
		armBpw6ScheduledPpgPullFallback(targetDeviceId)
		logQx('BPW6 PPG测量已启动，等待设备采集结束')
	} catch (e) {
		uni.setStorageSync(QX_MAIN_SLEEP_ALERT_DISABLED_KEY, false)
		try {
			uni.$emit('qxBle:sleepAlertDisabled', false)
		} catch (err) {}
		uni.removeStorageSync('sendwatch')
		clearQxScheduledMeasureStorage()
		clearBpw6ScheduledPpgPullFallback()
		throw e
	}
}

/** 定时测量启动成功后：时长+缓冲后若仍未上报，通知 Main 主动拉取上传 */
function armBpw6ScheduledPpgPullFallback(deviceId) {
	clearBpw6ScheduledPpgPullFallback()
	const waitMs = (BPW6_PPG_SCHEDULE_DURATION_SEC + 8) * 1000
	qxBpw6PpgPullFallbackTimer = setTimeout(() => {
		qxBpw6PpgPullFallbackTimer = null
		if (!isBpw6EmotionMeasure()) return
		const sendwatch = uni.getStorageSync('sendwatch')
		if (sendwatch !== 1 && sendwatch !== '1') return
		const targetDeviceId = deviceId || uni.getStorageSync('BPW6devicemac') || ''
		try {
			uni.$emit('qx:keepalive:renew')
		} catch (e) {}
		try {
			uni.$emit('qxBle:bpw6PpgPullNeeded', {
				deviceId: targetDeviceId,
				reason: 'schedule-fallback'
			})
		} catch (e) {
			console.warn('[qxBle] bpw6PpgPullNeeded emit', e)
		}
	}, waitMs)
}

function clearBpw6ScheduledPpgPullFallback() {
	if (qxBpw6PpgPullFallbackTimer != null) {
		clearTimeout(qxBpw6PpgPullFallbackTimer)
		qxBpw6PpgPullFallbackTimer = null
	}
}

function runOneQxMeasurement(deviceId, serviceId, characteristicId) {
	if (isBpw6EmotionMeasure()) {
		return runOneQxBpw6PpgMeasurement(deviceId)
	}
	return runOneQxBpw1Measurement(deviceId, serviceId, characteristicId)
}

function clearTimer() {
	if (qxBleTimer != null) {
		clearTimeout(qxBleTimer)
		qxBleTimer = null
	}
}

function stopScheduleHeartbeat() {
	if (qxHeartbeatTimer != null) {
		clearInterval(qxHeartbeatTimer)
		qxHeartbeatTimer = null
	}
}

function formatScheduleLabel(id) {
	return id === 'emotion' ? '情绪' : '无感'
}

/** 心跳日志：分别列出各启用时段及其下一槽（合并触发仍只用最早槽） */
function formatDualScheduleHeartbeatParts() {
	const enabled = readEnabledSchedules()
	if (!enabled.length) {
		const {
			t1,
			t2
		} = readScheduleTimes()
		return `时段${t1}-${t2}/间隔${readIntervalMinute()}分钟`
	}
	const now = new Date()
	return enabled.map((p) => {
		const next = getNextAlignedSlotDate(now, p.t1, p.t2, p.intervalMin, null)
		return `${formatScheduleLabel(p.id)}${p.t1}-${p.t2}/间隔${p.intervalMin}分钟｜下一槽点${formatSlotTime(next ? next.getTime() : 0)}`
	}).join('｜')
}

function tickScheduleHeartbeat(tag = '') {
	if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) {
		stopScheduleHeartbeat()
		return
	}
	const nextAt = readNextFireAt()
	const remainSec = nextAt > 0 ? Math.max(0, Math.ceil((nextAt - Date.now()) / 1000)) : 0
	const status = isQxScheduleMeasureBusy() ? '测量进行中' : (qxScheduleSessionFirstRun && isQxInternalDispatchBusy() ? (
		qxAppInForeground ? '前台' : '后台') : '待命')
	const dualParts = formatDualScheduleHeartbeatParts()
	logQx('时段内心跳', status + "｜" + dualParts + "｜共同的下一槽位" + formatSlotTime(nextAt) +
		"｜距槽位" + remainSec + "秒｜" + (isBpw6EmotionMeasure() ? 'BPW6' : 'BPW1'))
	reconcileQxScheduleBusyState()
	if (nextAt > 0 && remainSec <= 0) {
		// 新槽位到点且未下发过：必须唤醒执行（可打断上一轮采集）
		if (isNewSlotDueNeedingDispatch(nextAt)) {
			const hbTag = tag ? `心跳-${tag}` : '心跳-新槽必发'
			runQxBleScheduleWakeTick(hbTag).then((r) => {
				if (r === 'slot-skipped') {
					armJsTimerForNextFireAt('心跳-已跳槽')
				} else if (r === 'dispatch-skipped') {
					const stuckAt = readNextFireAt()
					if (stuckAt > 0 && isNewSlotDueNeedingDispatch(stuckAt)) {
						// 仍未发出：短后再由心跳/定时器重试，不直接跳槽
						logQx('时段内心跳', '新槽尚未下发成功，稍后重试', formatSlotTime(stuckAt))
						armJsTimerForNextFireAt('心跳-待重试')
					} else if (stuckAt > 0 && Date.now() >= stuckAt - 500 && !qxMeasureInFlight) {
						recoverAfterSlotDispatchFailure(stuckAt, '心跳-下发失败补推进')
					}
				} else if (r === 'executed' || r === 'restarted') {
					armJsTimerForNextFireAt('心跳-已下发')
				} else if (r === 'needs-plan') {
					planNext({
						lifecycle: true
					}).catch((e) => console.warn('[qxBle] heartbeat planNext', e))
				}
			}).catch((e) => console.warn('[qxBle] heartbeat wake', e))
			return
		}
		if (isQxScheduleMeasureBusy() || isQxInternalDispatchBusy()) {
			// 本槽已下发、采集中：等待结束
			if (hasQxRealMeasureSession() || hasDispatchedCurrentSlot(readMeasureSlotAt() || nextAt)) {
				logQx('时段内心跳', tag || '-', '采集进行中，等待结束', formatSlotTime(readMeasureSlotAt() || nextAt))
				return
			}
			logQx('时段内心跳', tag || '-', '测量进行中，保留当前槽位', formatSlotTime(nextAt))
			if (shouldSkipQxSlotCatchup(nextAt)) {
				logQx('时段内心跳', '假忙已过宽限，清理并推进', formatSlotTime(nextAt))
				recoverAfterSlotDispatchFailure(nextAt, tag || '心跳-假忙超时')
			}
			return
		}
		const hbTag = tag ? `心跳-${tag}` : '心跳-已过槽位'
		runQxBleScheduleWakeTick(hbTag).then((r) => {
			if (r === 'slot-skipped') {
				armJsTimerForNextFireAt('心跳-已跳槽')
			} else if (r === 'dispatch-skipped') {
				const stuckAt = readNextFireAt()
				if (stuckAt > 0 && Date.now() >= stuckAt - 500 && !qxMeasureInFlight) {
					recoverAfterSlotDispatchFailure(stuckAt, '心跳-下发失败补推进')
				} else {
					logQx('时段内心跳', '本槽失败已清理，等待下一槽正常发送')
				}
			} else if (r === 'executed' || r === 'restarted') {
				armJsTimerForNextFireAt('心跳-已下发')
			} else if (r === 'needs-plan') {
				planNext({
					lifecycle: true
				}).catch((e) => console.warn('[qxBle] heartbeat planNext', e))
			} else if (r === 'wake-busy' || r === 'already-running') {
				if (hasQxRealMeasureSession()) return
				if (shouldSkipQxSlotCatchup(readNextFireAt())) {
					recoverAfterSlotDispatchFailure(readNextFireAt(), `${hbTag}-${r}`)
				}
			}
		}).catch((e) => console.warn('[qxBle] heartbeat wake', e))
	}
}

function startScheduleHeartbeat() {
	stopScheduleHeartbeat()
	if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) return
	tickScheduleHeartbeat()
	qxHeartbeatTimer = setInterval(tickScheduleHeartbeat, QX_SCHEDULE_HEARTBEAT_MS)
}

/** 已在跑则不重启，避免后台脉冲反复 stop+start 打断心跳 */
function ensureScheduleHeartbeatRunning() {
	if (qxHeartbeatTimer != null) return
	startScheduleHeartbeat()
}


function schedulePlanNext(ms) {
	clearTimer()
	// logQx('设置JS定时器', `delayMs=${ms}`, `约${formatSlotTime(Date.now() + ms)}`)
	qxBleTimer = setTimeout(() => {
		qxBleTimer = null
		runQxBleScheduleWakeTick('js-timer')
			.then((r) => {
				if (r === 'slot-skipped') {
					// wakeTick 内已推进，只挂定时器
					armJsTimerForNextFireAt('js-timer-已跳槽')
					return
				}
				if (r === 'dispatch-skipped') {
					return
				}
				if (r === 'needs-plan') {
					return planNext({
						lifecycle: true
					})
				}
				if (r === 'executed' || r === 'restarted') {
					// 采集中也要挂下一槽定时器，不能 shouldPreserve 后直接 return
					if (!armJsTimerForNextFireAt('js-timer-已下发')) {
						return planNext({
							lifecycle: true
						})
					}
				}
			})
			.catch((e) => console.warn('[qxBle] wakeTick', e))
	}, ms)
}

async function executeQxMeasurementOnce() {
	if (!isSwitchOn()) return false
	const dev = getQxEmotionDeviceId()
	if (!dev || !isCurrentlyInScheduleWindow()) {
		logQx('跳过执行', !dev ? '无设备' : '不在时段内')
		return false
	}
	// 下发前加强保活，保证后台能写 BLE / 收数
	await ensureQxBleBackgroundRuntime('下发测量前')
	// 先纠偏残留 busy，避免上一槽失败后本槽仍被「测量进行中」挡住
	reconcileQxScheduleBusyState()
	if (isQxScheduleMeasureBusy()) {
		logQx('跳过执行', '测量进行中')
		return false
	}
	if (isQxInternalDispatchBusy()) {
		logQx('跳过执行', '调度下发窗口内')
		return false
	}
	// 到点下发时不要先 skipQxOverdue：宽限后会直接跳到下一槽，导致本槽从未发命令
	const slotAt = readNextFireAt()
	if (slotAt <= 0) {
		logQx('跳过执行', '无可用槽位')
		return false
	}
	const now = Date.now()
	if (now < slotAt - 500) {
		logQx('跳过执行', '未到点', formatSlotTime(slotAt))
		return false
	}
	if (shouldSkipQxSlotCatchup(slotAt)) {
		logQx('跳过执行', '距下一槽不足5分钟，跳到新槽', formatSlotTime(slotAt))
		recoverAfterSlotDispatchFailure(slotAt, '距下一槽不足5分钟')
		return false
	}
	if (isSameQxSlotAlreadyClaimed(slotAt)) {
		logQx('跳过执行', '本轮槽位已下发', formatSlotTime(slotAt))
		return false
	}

	const intervalMin = readIntervalMinute()
	let maxAttempts = QX_DISPATCH_MAX_ATTEMPTS
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		const isMakeupAttempt = attempt > QX_DISPATCH_MAX_ATTEMPTS
		if (attempt > 1) {
			prepareSlotForDispatchRetry(slotAt)
			if (isMakeupAttempt) {
				logQx('补发一次测量命令', formatSlotTime(slotAt), isBpw6EmotionMeasure() ? 'BPW6' : 'BPW1')
			} else {
				logQx('启动失败，准备重试', `第${attempt}/${QX_DISPATCH_MAX_ATTEMPTS}次`, formatSlotTime(slotAt))
			}
			await delayMs(QX_DISPATCH_RETRY_DELAY_MS)
			if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) {
				logQx('重试中止', '开关关闭或不在时段内')
				recoverAfterSlotDispatchFailure(slotAt, '重试时离开时段')
				return false
			}
			if (shouldSkipQxSlotCatchup(slotAt)) {
				logQx('重试中止', '距下一槽不足5分钟或已到新槽')
				recoverAfterSlotDispatchFailure(slotAt, '重试时槽位过期')
				return false
			}
			reconcileQxScheduleBusyState()
			if (isQxScheduleMeasureBusy() && !hasQxRealMeasureSession()) {
				prepareSlotForDispatchRetry(slotAt)
			}
		}

		// 每次尝试前先确保蓝牙已连接（避免 10002 no device 空转重试）
		const linked = await ensureQxBleDeviceConnected(dev)
		if (!linked) {
			logQx('下发前设备未连接', isMakeupAttempt ? '补发' : `第${attempt}/${QX_DISPATCH_MAX_ATTEMPTS}次`,
				formatSlotTime(slotAt))
			if (attempt >= maxAttempts) {
				const decision = decideAfterThreeDispatchFailures(slotAt)
				if (decision === 'makeup' && !isMakeupAttempt) {
					maxAttempts = attempt + 1
					continue
				}
				logQx('启动连续失败，跳过本槽', formatSlotTime(slotAt), '无法连接设备')
				recoverAfterSlotDispatchFailure(slotAt, '设备未连接已重试用尽')
				return false
			}
			continue
		}

		if (!tryBeginQxSlotExecute(slotAt)) {
			logQx('跳过执行', '同槽抢占失败', formatSlotTime(slotAt),
				isMakeupAttempt ? '补发' : `第${attempt}次`)
			if (qxSlotExecuteLockAt === slotAt && !qxMeasureInFlight) {
				qxSlotExecuteLockAt = 0
				clearMeasureSlotAt()
			}
			if (attempt >= maxAttempts) {
				const decision = decideAfterThreeDispatchFailures(slotAt)
				if (decision === 'makeup' && !isMakeupAttempt) {
					maxAttempts = attempt + 1
					continue
				}
				recoverAfterSlotDispatchFailure(slotAt, '抢占失败已重试用尽')
				return false
			}
			continue
		}

		// 下发前即标记会话开始，避免 BPW1 探测延迟期间被纠偏成「抢占无采集」
		qxMeasureSessionStartedAt = Date.now()
		logQx('到达槽位触发测量', `槽位${formatSlotTime(slotAt)}`, `间隔${intervalMin}分钟`,
			isMakeupAttempt ? '补发' : `尝试${attempt}/${QX_DISPATCH_MAX_ATTEMPTS}`,
			isBpw6EmotionMeasure() ? 'BPW6' : 'BPW1',
			dev)
		try {
			await runOneQxMeasurement(dev, DEFAULT_SERVICE_ID, DEFAULT_CHAR_ID)
			const activeSlot = readMeasureSlotAt() || slotAt
			markSlotDispatched(activeSlot)
			qxSlotMakeupUsedAt = 0
			// 下发成功后立刻预排下一槽并挂 JS 定时器，避免只靠心跳、后台错过下一槽
			if (activeSlot > 0) {
				const nextSlotAt = syncNextAlignedFireAt(new Date(activeSlot + 1))
				logQx('BLE命令已下发，等待设备采集结束', `槽位${formatSlotTime(activeSlot)}`,
					`预排下一${formatSlotTime(nextSlotAt)}`)
				armJsTimerForNextFireAt('下发成功')
			} else {
				logQx('BLE命令已下发，等待设备采集结束', `槽位${formatSlotTime(activeSlot)}`)
			}
			startQxMeasureWatchdog()
			return true
		} catch (e) {
			logQx('本次测量失败', e && (e.errMsg || e.message || e.code) || e,
				isMakeupAttempt ? '补发' : `第${attempt}/${QX_DISPATCH_MAX_ATTEMPTS}次`)
			prepareSlotForDispatchRetry(slotAt)
			if (isBleNoDeviceError(e) && attempt < maxAttempts) {
				logQx('因设备断开，重试前将再次重连')
				await ensureQxBleDeviceConnected(dev)
			}
			if (attempt >= maxAttempts) {
				const decision = decideAfterThreeDispatchFailures(slotAt)
				if (decision === 'makeup' && !isMakeupAttempt) {
					maxAttempts = attempt + 1
					continue
				}
				logQx('启动连续失败，跳过本槽', formatSlotTime(slotAt))
				recoverAfterSlotDispatchFailure(slotAt, isMakeupAttempt ? '补发仍失败' : 'BLE下发失败已重试用尽')
				return false
			}
		} finally {
			if (!qxMeasureInFlight) releaseQxSlotExecuteLock()
		}
	}
	return false
}

export async function runQxBleScheduleWakeTick(source = 'wake') {
	if (qxWakeTickInFlight) return 'wake-busy'
	qxWakeTickInFlight = true
	try {
		return await runQxBleScheduleWakeTickInner(source)
	} finally {
		qxWakeTickInFlight = false
	}
}

async function runQxBleScheduleWakeTickInner(source = 'wake') {
	reconcileQxScheduleBusyState()
	if (!isSwitchOn()) {
		logQx('唤醒跳过', '开关关闭')
		return 'off'
	}
	const deviceId = getQxEmotionDeviceId()
	if (!deviceId) {
		logQx('唤醒跳过', isBpw6EmotionMeasure() ? '无BPW6devicemac' : '无deviceIdwatch')
		return 'no-device'
	}
	if (!readEnabledSchedules().length) {
		logQx('唤醒跳过', '无有效启用时段')
		return 'invalid-window'
	}
	if (!isCurrentlyInScheduleWindow()) {
		clearNextFireAt()
		logQx('唤醒跳过', '当前不在任一启用时段内', getScheduleSnapshot())
		return 'outside-window'
	}
	const now = Date.now()
	// 先读当前槽位；仅当已过宽限才跳槽，避免到点瞬间被 skip 掉从未下发
	let nextAt = readNextFireAt()
	if (nextAt <= 0) {
		logQx('唤醒转排程', '未设置下一槽位')
		await planNext({
			lifecycle: true
		})
		return 'needs-plan'
	}
	if (now < nextAt - 500) {
		return 'not-due'
	}
	if (shouldSkipQxSlotCatchup(nextAt)) {
		rescheduleQxToNextAlignedSlot(source)
		const freshAt = readNextFireAt()
		// 跳过过期槽后，若当前对齐槽已到点且未下发，必须立刻发一次
		if (isNewSlotDueNeedingDispatch(freshAt)) {
			if (hasQxRealMeasureSession() || isQxScheduleMeasureBusy() || isQxInternalDispatchBusy()) {
				abortQxBleMeasurementForNewSlot('跳槽后新槽强制下发')
				clearQxScheduledEmotionBusyFlags()
			}
			const executed = await executeQxMeasurementOnce()
			logQx('跳槽后下发结果', executed ? 'executed' : 'dispatch-skipped')
			return executed ? 'executed' : 'dispatch-skipped'
		}
		return 'slot-skipped'
	}
	// 本槽已成功下发过：不重复发
	if (hasDispatchedCurrentSlot(nextAt)) {
		return 'already-running'
	}
	if (isQxScheduleMeasureBusy() || isSameQxSlotAlreadyClaimed(nextAt) || hasQxRealMeasureSession()) {
		if (!shouldPreemptMeasureForSlot(nextAt) && !isNewSlotDueNeedingDispatch(nextAt)) {
			const busyLabel = isMainSleepAlertMeasureBusy() ? 'Main测量中' : '调度忙'
			const hasRealSession = hasQxRealMeasureSession()
			if (!hasRealSession) {
				qxSlotExecuteLockAt = 0
				qxSlotClaimedAt = 0
				qxMeasureInFlight = false
				qxMeasureSessionStartedAt = 0
				clearMeasureSlotAt()
				clearQxScheduledMeasureStorage()
				clearQxScheduledEmotionBusyFlags()
				const retried = await executeQxMeasurementOnce()
				return retried ? 'executed' : 'dispatch-skipped'
			}
			return 'already-running'
		}
		abortQxBleMeasurementForNewSlot('新槽位必须下发')
		clearQxScheduledEmotionBusyFlags()
		const restarted = await executeQxMeasurementOnce()
		return restarted ? 'restarted' : 'dispatch-skipped'
	}
	const executed = await executeQxMeasurementOnce()
	return executed ? 'executed' : 'dispatch-skipped'
}

function isCurrentlyInScheduleWindow() {
	const enabled = readEnabledSchedules()
	if (!enabled.length) return false
	const nowM = new Date().getHours() * 60 + new Date().getMinutes()
	return enabled.some((p) => {
		const s = parseHM(p.t1)
		const e = parseHM(p.t2)
		return isWithinWindowMinute(nowM, s, e)
	})
}

async function planNext(opts = {}) {
	const lifecycle = !!opts.lifecycle
	reconcileQxScheduleBusyState()
	clearStaleQxScheduledMeasureState()
	if (planNextInFlight) {
		// logQx('planNext跳过', '排程进行中')
		return
	}
	planNextInFlight = true
	try {
		// logQx('planNext开始', lifecycle ? 'lifecycle' : 'normal', getScheduleSnapshot())
		if (!lifecycle || !hasOngoingQxWork()) {
			clearTimer()
		} else {
			// logQx('planNext', '进行中任务保留，不清理JS定时器')
		}
		await maybeRefreshQxFromServer()
		if (!isSwitchOn()) {
			stopScheduleHeartbeat()
			clearNextFireAt()
			// logQx('planNext结束', '开关关闭')
			return
		}
		const deviceId = getQxEmotionDeviceId()
		if (!deviceId) {
			// logQx('planNext', '无设备，60秒后重试')
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		if (!readEnabledSchedules().length) {
			clearNextFireAt()
			// logQx('planNext', '无有效启用时段，60秒后重试')
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		if (!isCurrentlyInScheduleWindow()) {
			stopScheduleHeartbeat()
			clearNextFireAt()
			// logQx('planNext', '时段外60秒后重试', getScheduleSnapshot())
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		const now = Date.now()
		let nextAt = skipQxOverdueSlotToCurrentAligned('planNext')
		const measureSlot = readMeasureSlotAt()
		if (shouldPreserveCurrentMeasureSlot() && measureSlot > 0 &&
			!shouldSkipQxSlotCatchup(measureSlot)) {
			persistNextFireAt(measureSlot)
			nextAt = measureSlot
			// logQx('保留进行中槽位', formatSlotTime(measureSlot))
		} else if (nextAt > 0 && !shouldSkipQxSlotCatchup(nextAt) && (
			// 回前台/生命周期：距下一槽仍≥5分钟时保留本槽以便补发，勿 sync 成下一槽
			lifecycle || nextAt > now - 1000 || isWithinQxSlotCatchupWindow(nextAt)
		)) {
			if (isWithinQxSlotCatchupWindow(nextAt)) {
				logQx('planNext保留补发槽位', formatSlotTime(nextAt),
					`晚${Math.round((now - nextAt) / 1000)}s`, '宽限8分钟')
			}
			// logQx('保留既有下一槽位', formatSlotTime(nextAt))
		} else {
			nextAt = syncNextAlignedFireAt(null)
		}
		if (nextAt <= 0) {
			// logQx('planNext', '无下一槽位，60秒后重试')
			schedulePlanNext(POLL_OUTSIDE_MS)
			return
		}
		// logQx('时段内对齐槽位排程', t1, t2, `间隔${readIntervalMinute()}分钟`, `下一槽位${formatSlotTime(nextAt)}`)
		if (now >= nextAt - 500) {
			// 新槽未下发过：即使忙也要抢占下发
			if (!isQxScheduleMeasureBusy() || shouldPreemptMeasureForSlot(nextAt) ||
				isNewSlotDueNeedingDispatch(nextAt)) {
				const dueResult = await runQxBleScheduleWakeTick('planNext-due')
				if (dueResult === 'dispatch-skipped') {
					const stuckAt = readNextFireAt()
					if (stuckAt > 0 && !isNewSlotDueNeedingDispatch(stuckAt) &&
						Date.now() >= stuckAt - 500 && !qxMeasureInFlight) {
						recoverAfterSlotDispatchFailure(stuckAt, 'planNext-due补推进')
					}
				}
				nextAt = readNextFireAt()
				if (nextAt <= 0) {
					nextAt = syncNextAlignedFireAt(new Date(Date.now() + 800))
				}
			} else {
				// logQx('planNext', '到点但本轮已下发，不重复触发', `槽位${formatSlotTime(nextAt)}`)
			}
		}
		const delay = Math.max(0, nextAt - Date.now())
		// logQx('已排程', `delayMs=${delay}`, `触发约${formatSlotTime(nextAt)}`)
		if (!lifecycle || !isQxScheduleMeasureBusy() || isNewSlotDueNeedingDispatch(nextAt)) {
			schedulePlanNext(delay > 0 ? delay : 1000)
		} else if (delay <= 0 && hasDispatchedCurrentSlot(nextAt)) {
			// 本槽已发过且仍忙：挂到下一间隔
			rescheduleQxToNextAlignedSlot('planNext-到点但本槽已下发')
		}
		startScheduleHeartbeat()
	} finally {
		planNextInFlight = false
	}
}

/** 恢复/重启前排程：仅停定时器，不重置进行中的采集会话 */
function stopQxBleScheduleTimersBeforeResume() {
	clearTimer()
	stopScheduleHeartbeat()
	cancelDeferredPlanNext()
	planNextInFlight = false
	releaseQxSlotExecuteLock()
	// logQx('恢复前停止排程定时器', getScheduleSnapshot())
}

export function stopGlobalQxBleAlignedSchedule() {
	clearTimer()
	stopScheduleHeartbeat()
	clearQxMeasureWatchdog()
	clearBpw6ScheduledPpgPullFallback()
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	deferredPlanNextRetry = 0
	releaseQxSlotExecuteLock()
	qxScheduleSessionFirstRun = false
	clearQxScheduledMeasureStorage()
	cancelDeferredPlanNext()
	clearNextFireAt()
	clearMeasureSlotAt()
	// logQx('停止调度', getScheduleSnapshot())
}

export function startGlobalQxBleAlignedSchedule() {
	if (isMainSleepAlertMeasureBusy() || qxMeasureInFlight) {
		// logQx('启动调度', '采集进行中，仅补排程不重置')
		return planNext({
			lifecycle: true
		}).catch((e) => console.warn('[qxBle] planNext', e))
	}
	clearTimer()
	clearNextFireAt()
	clearQxMeasureWatchdog()
	qxMeasureInFlight = false
	qxMeasureSessionStartedAt = 0
	qxSlotClaimedAt = 0
	deferredPlanNextRetry = 0
	clearStaleQxScheduledMeasureState()
	qxScheduleSessionFirstRun = true
	// logQx('启动调度', getScheduleSnapshot())
	return planNext().catch((e) => console.warn('[qxBle] planNext', e))
}

async function runQxBleAppForegroundWake() {
	setQxBleAppForegroundState(true)
	if (!isSwitchOn()) return
	// logQx('应用回前台', getScheduleSnapshot())
	reconcileQxScheduleBusyState()
	if (isQxScheduleMeasureBusy()) {
		// logQx('前台', '测量进行中，等待采集结束')
		armJsTimerForNextFireAt('前台-采集中')
		return 'measuring'
	}
	const r = await runQxBleScheduleWakeTick('app-foreground')
	if (r === 'slot-skipped') {
		// wakeTick 内已推进
		armJsTimerForNextFireAt('前台-已跳槽')
		return r
	}
	if (r === 'dispatch-skipped') {
		const stuckAt = readNextFireAt()
		if (stuckAt > 0 && Date.now() >= stuckAt - 500 && !qxMeasureInFlight) {
			recoverAfterSlotDispatchFailure(stuckAt, '前台-下发失败补推进')
		}
		return r
	}
	if (r === 'executed' || r === 'restarted') {
		armJsTimerForNextFireAt('前台-已下发')
	} else if (r === 'needs-plan' || r === 'not-due') {
		await planNext({
			lifecycle: true
		}).catch((e) => console.warn('[qxBle] planNext foreground', e))
	}
	return r
}

let lastQxAppBackgroundAt = 0

/**
 * App 进入后台/熄屏 —— 对齐最早可工作版本：
 * 只标记后台 + 临近槽位补检；不清定时器、不 forceRestart 定位。
 * 保活由 App.vue 连续定位(无 interval)+无声音频承担。
 */
export function onQxBleAppBackground() {
	if (!isSwitchOn()) return
	setQxBleAppForegroundState(false)
	logQx('应用进入后台', getScheduleSnapshot())

	const nextAt = readNextFireAt()
	const remainSec = nextAt > 0 ? Math.ceil((nextAt - Date.now()) / 1000) : 999
	if (nextAt > 0 && remainSec <= 90) {
		runQxBleScheduleWakeTick('app-background-near-slot').catch((e) =>
			console.warn('[qxBle] bg near slot', e))
	}
}

/** App 回前台：不清定时任务，只补检到点 */
export function onQxBleAppForeground() {
	clearQxBackgroundCatchupGuards()
	setQxBleAppForegroundState(true)
	if (!isSwitchOn()) return Promise.resolve()
	reconcileQxScheduleBusyState()
	if (isQxScheduleMeasureBusy()) {
		armJsTimerForNextFireAt('前台-采集中')
		ensureScheduleHeartbeatRunning()
		return Promise.resolve('measuring')
	}
	return runQxBleAppForegroundWake().catch((e) => console.warn('[qxBle] app foreground wake', e))
}

/**
 * @param {{ fromForeground?: boolean }} [options]
 */
export async function resumeQxBleScheduleIfEnabled(options = {}) {
	if (options.fromForeground) {
		return onQxBleAppForeground()
	}
	stopQxBleScheduleTimersBeforeResume()
	await maybeRefreshQxFromServer().catch(() => {})
	if (!isSwitchOn()) {
		return
	}
	if (isMainSleepAlertMeasureBusy() || qxMeasureInFlight) {
		await planNext({
			lifecycle: true
		}).catch((e) => console.warn('[qxBle] planNext lifecycle', e))
	} else {
		startGlobalQxBleAlignedSchedule()
	}
}


const BPW1_MODEL_ID = '30000'
const BPW6_MODEL_ID = '30001'

function normalizeBleDeviceId(id) {
	return String(id || '').replace(/[^a-fA-F0-9]/g, '').toUpperCase()
}

function ensureJsTimerForNextFireAt(reason = '') {
	const nextAt = readNextFireAt()
	if (nextAt <= 0) return false
	if (qxBleTimer != null && qxArmedFireAt === nextAt) {
		return true
	}
	return armJsTimerForNextFireAt(reason || '保活')
}

function isWithinQxSlotCatchupWindow(slotAt) {
	if (!slotAt || slotAt <= 0) return false
	const now = Date.now()
	if (now < slotAt - 500) return false
	if (shouldSkipQxSlotCatchup(slotAt)) return false
	return now > slotAt + 500
}

/** 假下发标记：宽限内无真实采集会话时清掉，允许补发 */
function clearFalseQxSlotDispatchedMark(slotAt, reason = '') {
	if (!slotAt || slotAt <= 0) return false
	if (!hasDispatchedCurrentSlot(slotAt)) return false
	if (hasQxRealMeasureSession()) return false
	qxLastDispatchedSlotAt = 0
	qxSlotClaimedAt = 0
	qxSlotExecuteLockAt = 0
	if (typeof clearMeasureSlotAt === 'function') clearMeasureSlotAt()
	if (reason) {
		logQx('清理假下发标记以便补发', reason, formatSlotTime(slotAt))
	}
	return true
}

function clearQxBackgroundCatchupGuards() {
	if (!qxBgCatchupTimers || !qxBgCatchupTimers.length) {
		qxBgCatchupArmedSlotAt = 0
		return
	}
	qxBgCatchupTimers.forEach((tid) => {
		try {
			clearTimeout(tid)
		} catch (e) {}
	})
	qxBgCatchupTimers = []
	qxBgCatchupArmedSlotAt = 0
}

/**
 * 进入后台后挂补发看守：同一槽位已挂则不重复 clear，避免冲掉即将到点的 timer
 */
function armQxBackgroundCatchupGuards(slotAt) {
	if (!slotAt || slotAt <= 0 || !isSwitchOn()) return
	if (qxBgCatchupArmedSlotAt === slotAt && qxBgCatchupTimers && qxBgCatchupTimers.length) {
		return
	}
	clearQxBackgroundCatchupGuards()
	qxBgCatchupArmedSlotAt = slotAt
	const now = Date.now()
	// 补发窗口截止：距下一合并槽还剩 5 分钟之前
	const nextAfter = peekNextAlignedSlotDate(new Date(slotAt + 1))
	const nextTs = nextAfter ? nextAfter.getTime() : (slotAt + readIntervalMs())
	const catchupEnd = nextTs - QX_SLOT_MAKEUP_REMAIN_MS - 1000
	const firePoints = [slotAt, slotAt + 2 * 60 * 1000, slotAt + 4 * 60 * 1000]
	firePoints.forEach((fireAt) => {
		if (fireAt > catchupEnd) return
		const delay = Math.max(1200, fireAt - now)
		const tid = setTimeout(() => {
			tryTriggerBackgroundCatchupWake(slotAt, 'bg-catchup')
		}, delay)
		qxBgCatchupTimers.push(tid)
	})
	if (now >= slotAt - 500 && !shouldSkipQxSlotCatchup(slotAt)) {
		const tid = setTimeout(() => {
			tryTriggerBackgroundCatchupWake(slotAt, 'bg-catchup-now')
		}, 1500)
		qxBgCatchupTimers.push(tid)
	}
	logQx('后台补发看守已挂载', formatSlotTime(slotAt), '距下一槽≥5分钟内可补本槽')
}

function tryTriggerBackgroundCatchupWake(slotAt, source) {
	if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) return
	const cur = readNextFireAt()
	const target = (cur > 0 ? cur : slotAt)
	if (shouldSkipQxSlotCatchup(target) && shouldSkipQxSlotCatchup(slotAt)) {
		clearQxBackgroundCatchupGuards()
		return
	}
	if (target !== slotAt && !shouldSkipQxSlotCatchup(slotAt) &&
		(isWithinQxSlotCatchupWindow(slotAt) || Date.now() >= slotAt - 500)) {
		if (typeof persistNextFireAt === 'function') persistNextFireAt(slotAt)
	}
	const nextAt = readNextFireAt()
	if (nextAt <= 0 || shouldSkipQxSlotCatchup(nextAt)) return
	if (hasDispatchedCurrentSlot(nextAt) && hasQxRealMeasureSession()) {
		clearQxBackgroundCatchupGuards()
		return
	}
	if (qxWakeTickInFlight || qxMeasureInFlight) return
	clearFalseQxSlotDispatchedMark(nextAt, source)
	if (typeof isNewSlotDueNeedingDispatch === 'function') {
		if (!isNewSlotDueNeedingDispatch(nextAt) && Date.now() < nextAt - 500) return
	} else if (Date.now() < nextAt - 500) {
		return
	}
	const lateSec = Math.max(0, Math.round((Date.now() - nextAt) / 1000))
	if (lateSec > 0) {
		logQx('后台补发触发', source, formatSlotTime(nextAt), `晚${lateSec}s`)
	}
	runQxBleScheduleWakeTick(source).then((r) => {
		logQx('后台补发结果', r || '-', formatSlotTime(readNextFireAt()))
		if (r === 'executed' || r === 'restarted' || r === 'slot-skipped') {
			clearQxBackgroundCatchupGuards()
		} else if (r === 'dispatch-skipped' && typeof isNewSlotDueNeedingDispatch === 'function' &&
			isNewSlotDueNeedingDispatch(readNextFireAt())) {
			const tid = setTimeout(() => {
				tryTriggerBackgroundCatchupWake(readNextFireAt(), source + '-retry')
			}, 2500)
			qxBgCatchupTimers.push(tid)
		}
	}).catch((e) => console.warn('[qxBle] bg catchup', e))
}

/**
 * 后台轻量补检（可选；定位脉冲为主路径）
 */
export function tickQxBleBackgroundCatchup() {
	if (qxAppInForeground) return
	if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) return
	const now = Date.now()
	if (now - lastBgLightCatchupAt < 20000) return
	lastBgLightCatchupAt = now
	const nextAt = readNextFireAt()
	if (nextAt <= 0) return
	if (now < nextAt - 500) {
		ensureJsTimerForNextFireAt('后台轻检保活')
		return
	}
	if (shouldSkipQxSlotCatchup(nextAt)) return
	if (hasDispatchedCurrentSlot(nextAt) && hasQxRealMeasureSession()) return
	if (qxWakeTickInFlight || qxMeasureInFlight) return
	if (typeof isQxScheduleMeasureBusy === 'function' && isQxScheduleMeasureBusy()) return
	tryTriggerBackgroundCatchupWake(nextAt, 'bg-light-tick')
}

/**
 * 原生保活脉冲（定位更新）：JS 定时器在后台/熄屏常被冻住，靠此唤醒到点下发
 * 熄屏必须与前台一致：到点立刻 runQxBleScheduleWakeTick，禁止干等回前台补发
 */
export function onQxBleNativeKeepAlivePulse(source = 'native-keepalive') {
	if (!isSwitchOn() || !isCurrentlyInScheduleWindow()) return
	reconcileQxScheduleBusyState()
	const nextAt = readNextFireAt()
	if (nextAt <= 0) {
		planNext({
			lifecycle: true
		}).catch((e) => console.warn('[qxBle] keepalive planNext', e))
		return
	}
	const now = Date.now()
	const due = now >= nextAt - 500
	const needNewSlot = isNewSlotDueNeedingDispatch(nextAt)
	// 本槽已下发且真实采集中：只续保活；新槽到点则必须继续走下发（可抢占）
	if (!needNewSlot && (qxWakeTickInFlight || qxMeasureInFlight || hasQxRealMeasureSession())) {
		scheduleQxBleNativeAlarm()
		try {
			uni.$emit('qx:keepalive:renew')
		} catch (e) {}
		return
	}
	ensureJsTimerForNextFireAt(source)
	scheduleQxBleNativeAlarm()
	if (!due) {
		try {
			uni.$emit('qx:keepalive:renew')
		} catch (e) {}
		return
	}
	// 后台冻醒过晚：仍要推进，禁止干等回前台
	if (shouldSkipQxSlotCatchup(nextAt)) {
		logQx('保活脉冲过期推进', source, formatSlotTime(nextAt))
		runQxBleScheduleWakeTick(source + '-late-advance').catch((e) =>
			console.warn('[qxBle] keepalive late-advance', e))
		return
	}
	if (hasDispatchedCurrentSlot(nextAt) && hasQxRealMeasureSession()) {
		try {
			uni.$emit('qx:keepalive:renew')
		} catch (e) {}
		return
	}
	const throttleMs = qxAppInForeground ? 8000 : 500
	if (now - lastBgLightCatchupAt < throttleMs) {
		try {
			uni.$emit('qx:keepalive:renew')
		} catch (e) {}
		return
	}
	lastBgLightCatchupAt = now
	try {
		uni.$emit('qx:keepalive:renew')
	} catch (e) {}
	// 与前台 js-timer 同一路径：到点立刻下发，不走「等补发」
	logQx('保活脉冲到点下发', source, formatSlotTime(nextAt), qxAppInForeground ? '前台' : '熄屏/后台')
	runQxBleScheduleWakeTick(source).then((r) => {
		logQx('保活脉冲下发结果', r || '-', formatSlotTime(readNextFireAt()))
		if (r === 'executed' || r === 'restarted' || r === 'slot-skipped') {
			clearQxBackgroundCatchupGuards()
			armJsTimerForNextFireAt('保活脉冲-' + (r || 'ok'))
		} else if (r === 'dispatch-skipped' && isNewSlotDueNeedingDispatch(readNextFireAt())) {
			const tid = setTimeout(() => {
				runQxBleScheduleWakeTick(source + '-retry').catch((e) =>
					console.warn('[qxBle] pulse retry', e))
			}, 2000)
			qxBgCatchupTimers.push(tid)
		} else if (r === 'not-due' || r === 'needs-plan') {
			armJsTimerForNextFireAt('保活脉冲-' + (r || 'plan'))
		}
	}).catch((e) => console.warn('[qxBle] keepalive pulse wake', e))
}

/**
 * 熄屏/后台：只续音频，禁止 forceRestart 把连续定位改成 5s 周期（会掐死后台）
 * 定位保活由 App.vue 连续定位(无 interval) 负责
 */
export function ensureQxBleBackgroundRuntime(reason = '', forceRestart = false) {
	if (!isSwitchOn()) return Promise.resolve(false)
	try {
		try {
			uni.$emit('qx:keepalive:renew')
		} catch (e) {}
		if (reason) {
			logQx('加强后台运行', reason, '连续定位+音频')
		}
	} catch (e) {
		console.warn('[qxBle] ensureQxBleBackgroundRuntime', e)
	}
	return Promise.resolve(true)
}

/** 保活闹钟：只续音频+桥接，禁止按槽位变频定位（变频会打断连续定位） */
export function scheduleQxBleNativeAlarm() {
	if (!isSwitchOn()) return
	try {
		if (typeof keepAliveManager.ensureRunningForAppTimers === 'function') {
			keepAliveManager.ensureRunningForAppTimers()
		}
	} catch (e) {
		console.warn('[qxBle] scheduleQxBleNativeAlarm', e)
	}
}

/** 保活闹钟触发：到点发测量（与前台 js-timer 同路径；勿每次重置定位） */
export async function handleQxBleKeepAliveWake() {
	if (!isSwitchOn()) return
	reconcileQxScheduleBusyState()
	// 只轻量续闹钟周期（不变则无原生调用），禁止 ensureQxBleBackgroundRuntime 重开定位
	scheduleQxBleNativeAlarm()
	ensureJsTimerForNextFireAt('keepAlive-alarm')
	const wakeResult = await runQxBleScheduleWakeTick('keepAlive-alarm')
	if (!isSwitchOn()) return
	if (wakeResult === 'executed' || wakeResult === 'restarted' || wakeResult === 'needs-plan') {
		if (!hasQxRealMeasureSession()) {
			await planNext({
				lifecycle: true
			}).catch((e) => console.warn('[qxBle] planNext after alarm', e))
		} else {
			scheduleQxBleNativeAlarm()
			armJsTimerForNextFireAt('alarm-采集中')
		}
	} else if (wakeResult === 'slot-skipped' || wakeResult === 'dispatch-skipped') {
		scheduleQxBleNativeAlarm()
		ensureJsTimerForNextFireAt('alarm-' + wakeResult)
		// 下发失败且本槽仍需发：短后再试（熄屏下不等回前台）
		if (wakeResult === 'dispatch-skipped' && isNewSlotDueNeedingDispatch(readNextFireAt())) {
			setTimeout(() => {
				runQxBleScheduleWakeTick('keepAlive-alarm-retry').catch((e) =>
					console.warn('[qxBle] alarm retry', e))
			}, 2000)
		}
	} else {
		scheduleQxBleNativeAlarm()
		ensureJsTimerForNextFireAt('alarm-' + (wakeResult || 'idle'))
	}
}

function logQxBleScheduleHeartbeatFromKeepAlive() {
	try {
		tickScheduleHeartbeat('keepalive-alarm')
	} catch (e) {}
}

function isQxBleMeasureSessionActiveForKeepAlive() {
	return hasQxRealMeasureSession() || !!qxMeasureInFlight
}


export function invalidateQxEmotionBindingCache(deviceModelId, mac = '') {
	const modelId = String(deviceModelId || '')
	const storedBpw6 = uni.getStorageSync('BPW6devicemac')
	const storedBpw1 = uni.getStorageSync('deviceIdwatch')
	const normMac = normalizeBleDeviceId(mac)

	if (modelId === BPW6_MODEL_ID) {
		if (!normMac || !storedBpw6 || normalizeBleDeviceId(storedBpw6) === normMac) {
			uni.removeStorageSync('BPW6devicemac')
		}
		if (isBpw6EmotionMeasure()) {
			uni.setStorageSync(QX_BPW6_EMOTION_MEASURE_KEY, false)
		}
	} else if (modelId === BPW1_MODEL_ID) {
		if (!normMac || !storedBpw1 || normalizeBleDeviceId(storedBpw1) === normMac) {
			uni.removeStorageSync('deviceIdwatch')
		}
	}

	const cached = uni.getStorageSync('lixianlist')
	if (cached && Array.isArray(cached.rows)) {
		cached.rows = cached.rows.filter((row) => {
			if (String(row.deviceModelId) !== modelId) return true
			if (!normMac) return false
			return normalizeBleDeviceId(row.mac) !== normMac
		})
		uni.setStorageSync('lixianlist', cached)
	}

	const stillHasTarget = getQxEmotionDeviceId()
	if (!stillHasTarget && isSwitchOn()) {
		logQx('解绑后清理调度缓存', modelId, mac || '-')
		stopGlobalQxBleAlignedSchedule()
	}
}

/** 保存/启动调度前确认设备已绑定 */
export async function ensureQxEmotionBindingReady() {
	await maybeRefreshQxFromServer().catch(() => {})
	const deviceId = getQxEmotionDeviceId()
	if (deviceId) return deviceId
	return ''
}


try {
	keepAliveManager.registerQxBleWakeHandler(handleQxBleKeepAliveWake)
	keepAliveManager.registerQxBleHeartbeat(logQxBleScheduleHeartbeatFromKeepAlive)
	keepAliveManager.registerQxBleMeasuringCheck(isQxBleMeasureSessionActiveForKeepAlive)
} catch (e) {
	console.warn('[qxBle] registerQxBleWakeHandler', e)
}
