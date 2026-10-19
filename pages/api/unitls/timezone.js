export function formatGMTOffset(offsetMinutes) {
	const sign = offsetMinutes >= 0 ? '+' : '-';
	const absMinutes = Math.abs(offsetMinutes);
	const hoursStr = String(Math.floor(absMinutes / 60)).padStart(2, '0');
	const minutesStr = String(absMinutes % 60).padStart(2, '0');
	return `GMT${sign}${hoursStr}:${minutesStr}`;
}

/** 获取手机 GMT 偏移，如 GMT+08:00、GMT+05:30 */
export function getGMTTimezoneStrict() {
	// #ifdef APP-PLUS
	try {
		if (plus.os.name === 'Android') {
			const TimeZone = plus.android.importClass('java.util.TimeZone');
			const tz = TimeZone.getDefault();
			const offsetMs = tz.getRawOffset() + tz.getDSTSavings();
			return formatGMTOffset(Math.round(offsetMs / 60000));
		}
		if (plus.os.name === 'iOS') {
			const NSTimeZone = plus.ios.importClass('NSTimeZone');
			const localTz = NSTimeZone.localTimeZone();
			const secondsFromGMT = plus.ios.invoke(localTz, 'secondsFromGMT') || 0;
			plus.ios.deleteObject(localTz);
			return formatGMTOffset(Math.round(secondsFromGMT / 60));
		}
	} catch (e) {}
	// #endif
	return formatGMTOffset(-new Date().getTimezoneOffset());
}

/** 获取 IANA 时区 ID，如 Asia/Shanghai */
export function getDeviceTimeZone() {
	// #ifdef APP-PLUS
	try {
		if (plus.os.name === 'Android') {
			const TimeZone = plus.android.importClass('java.util.TimeZone');
			return TimeZone.getDefault().getID() || '';
		}
		if (plus.os.name === 'iOS') {
			const NSTimeZone = plus.ios.importClass('NSTimeZone');
			const localTz = NSTimeZone.localTimeZone();
			const timeZoneId = plus.ios.invoke(localTz, 'name') || '';
			plus.ios.deleteObject(localTz);
			return timeZoneId;
		}
	} catch (e) {}
	// #endif
	try {
		if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
			return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
		}
	} catch (e) {}
	return '';
}

/** 中国时区 UTC+8（无夏令时） */
const CHINA_OFFSET_MINUTES = 8 * 60

let cachedTimezoneSignature = ''
let timezoneWatchTimer = null

function pad2(value) {
	return String(value).padStart(2, '0')
}

/** 获取设备当前时区偏移（分钟，东为正），优先读原生 API，时区变更后可即时生效 */
export function getDeviceTimezoneOffsetMinutes(date = new Date()) {
	// #ifdef APP-PLUS
	try {
		if (plus.os.name === 'Android') {
			const TimeZone = plus.android.importClass('java.util.TimeZone')
			const tz = TimeZone.getDefault()
			return Math.round(tz.getOffset(date.getTime()) / 60000)
		}
		if (plus.os.name === 'iOS') {
			const NSTimeZone = plus.ios.importClass('NSTimeZone')
			const localTz = NSTimeZone.localTimeZone()
			const secondsFromGMT = plus.ios.invoke(localTz, 'secondsFromGMT') || 0
			plus.ios.deleteObject(localTz)
			return Math.round(secondsFromGMT / 60)
		}
	} catch (e) {}
	// #endif
	return -date.getTimezoneOffset()
}

/** 时区签名，用于检测系统时区是否变更 */
export function getTimezoneSignature() {
	return [
		getDeviceTimeZone(),
		getDeviceTimezoneOffsetMinutes(),
		getGMTTimezoneStrict()
	].join('|')
}

/** 同步并返回当前时区签名（首次或手动刷新） */
export function syncTimezoneSignature() {
	cachedTimezoneSignature = getTimezoneSignature()
	return cachedTimezoneSignature
}

/** 检测时区是否相对上次签名发生变化 */
export function checkTimezoneChanged() {
	const current = getTimezoneSignature()
	if (!cachedTimezoneSignature) {
		cachedTimezoneSignature = current
		return false
	}
	if (cachedTimezoneSignature === current) {
		return false
	}
	cachedTimezoneSignature = current
	return true
}

/**
 * 监听系统时区变更（App 前台运行期间）
 * @param {Function} callback 时区变更时回调
 * @param {number} intervalMs 轮询间隔，默认 30 秒
 */
export function startTimezoneWatch(callback, intervalMs = 30000) {
	stopTimezoneWatch()
	syncTimezoneSignature()
	timezoneWatchTimer = setInterval(() => {
		if (checkTimezoneChanged() && typeof callback === 'function') {
			callback(getTimezoneSignature())
		}
	}, intervalMs)
}

export function stopTimezoneWatch() {
	if (timezoneWatchTimer) {
		clearInterval(timezoneWatchTimer)
		timezoneWatchTimer = null
	}
}

/**
 * 解析指定时刻在中国时区（Asia/Shanghai / UTC+8）下的年月日时分秒
 * 不依赖 Intl，兼容旧版 Android WebView
 */
export function getChinaDateParts(date = new Date()) {
	// 绝对时间 + 8 小时后用 UTC 组件读取，即为中国墙钟时间
	const china = new Date(date.getTime() + CHINA_OFFSET_MINUTES * 60000)
	return {
		year: String(china.getUTCFullYear()),
		month: pad2(china.getUTCMonth() + 1),
		day: pad2(china.getUTCDate()),
		hours: pad2(china.getUTCHours()),
		minutes: pad2(china.getUTCMinutes()),
		seconds: pad2(china.getUTCSeconds())
	}
}

/** 中国时区日期，如 2026/07/07 */
export function getChinaDateString(date = new Date()) {
	const {
		year,
		month,
		day
	} = getChinaDateParts(date)
	return `${year}/${month}/${day}`
}

/**
 * 设备本地时区常用时间格式（与 Main.vue getTimeAllJSON 结构一致）
 * 优先用 Date 本地组件（与手机状态栏日期一致）；原生偏移仅作兜底
 */
export function getLocalTimeAllJSON(date = new Date()) {
	const d = date instanceof Date ? date : new Date(date)
	if (!Number.isFinite(d.getTime())) {
		return getLocalTimeAllJSON(new Date())
	}
	// 与系统「当前显示时间」对齐，避免原生时区 API 异常时落到中国时区
	const year = String(d.getFullYear())
	const month = pad2(d.getMonth() + 1)
	const day = pad2(d.getDate())
	const hours = pad2(d.getHours())
	const minutes = pad2(d.getMinutes())
	const seconds = pad2(d.getSeconds())

	return {
		YMDHMS: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
		YMD: `${year}-${month}-${day}`,
		MD: `${month}/${day}`,
		YMD000000: `${year}-${month}-${day} 00:00:00`,
		YMDHMSWIFI: `${year}${month}${day}${hours}${minutes}${seconds}`
	}
}

/**
 * 中国时区常用时间格式（与 Main.vue getTimeAllJSON 结构一致）
 */
export function getChinaTimeAllJSON(date = new Date()) {
	const {
		year,
		month,
		day,
		hours,
		minutes,
		seconds
	} = getChinaDateParts(date)

	return {
		YMDHMS: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
		YMD: `${year}-${month}-${day}`,
		MD: `${month}/${day}`,
		YMD000000: `${year}-${month}-${day} 00:00:00`,
		chinaDate: `${year}/${month}/${day}`
	}
}

/**
 * 解析墙钟字符串（无时区）为 {y,m,d,h,mi,s}
 * 支持：yyyy-mm-dd / yyyy-mm-dd HH:mm[:ss] / 仅 HH:mm[:ss]（需另传 dateYmd）
 */
function parseWallClockParts(wall, dateYmd = '') {
	const raw = String(wall || '').trim().replace(/\//g, '-')
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/)
	if (m) {
		return {
			year: Number(m[1]),
			month: Number(m[2]),
			day: Number(m[3]),
			hours: Number(m[4] || 0),
			minutes: Number(m[5] || 0),
			seconds: Number(m[6] || 0)
		}
	}
	m = raw.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/)
	if (m && dateYmd) {
		const d = String(dateYmd).trim().replace(/\//g, '-').match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
		if (!d) return null
		return {
			year: Number(d[1]),
			month: Number(d[2]),
			day: Number(d[3]),
			hours: Number(m[1]),
			minutes: Number(m[2]),
			seconds: Number(m[3] || 0)
		}
	}
	return null
}

/**
 * 墙钟 → 毫秒：按指定偏移（东为正）解释，不依赖 Date 字符串解析
 * @param {string} wall
 * @param {number} offsetMinutes
 * @param {string} [dateYmd] 仅时间时的日期
 */
export function wallClockToMs(wall, offsetMinutes, dateYmd = '') {
	const parts = parseWallClockParts(wall, dateYmd)
	if (!parts) return NaN
	const utcGuess = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hours, parts.minutes, parts.seconds)
	return utcGuess - Number(offsetMinutes) * 60000
}

/** 中国墙钟（手表/接口常用 +08:00）→ 毫秒 */
export function chinaWallClockToMs(wall, dateYmd = '') {
	return wallClockToMs(wall, CHINA_OFFSET_MINUTES, dateYmd)
}

/** 手机本地墙钟 → 毫秒 */
export function localWallClockToMs(wall, dateYmd = '') {
	const parts = parseWallClockParts(wall, dateYmd)
	if (!parts) return NaN
	const probe = Date.UTC(parts.year, parts.month - 1, parts.day, 12, 0, 0)
	const offset = getDeviceTimezoneOffsetMinutes(new Date(probe - CHINA_OFFSET_MINUTES * 60000))
	return wallClockToMs(wall, offset, dateYmd)
}

/**
 * 手机本地查询窗 → 接口中国墙钟查询窗（服务端按 +08 墙钟存）
 * @param {string} localStart 如 2026-07-21 00:00:00
 * @param {string} localEnd 如 2026-07-21 23:59:59
 */
export function localRangeToChinaQueryRange(localStart, localEnd) {
	const startMs = localWallClockToMs(localStart)
	const endMs = localWallClockToMs(localEnd)
	if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
		return {
			start: localStart,
			end: localEnd
		}
	}
	return {
		start: getChinaTimeAllJSON(new Date(startMs)).YMDHMS,
		end: getChinaTimeAllJSON(new Date(endMs)).YMDHMS
	}
}

/**
 * 接口中国墙钟明细 → 手机本地墙钟
 * @param {string} chinaDateYmd 如 2026-07-21
 * @param {string} chinaTime 如 08:00:00 / 08:00
 */
export function chinaDetailToLocalWall(chinaDateYmd, chinaTime) {
	const ms = chinaWallClockToMs(chinaTime, chinaDateYmd)
	if (!Number.isFinite(ms)) {
		return {
			ymd: chinaDateYmd,
			hms: chinaTime,
			ymdhms: `${chinaDateYmd} ${chinaTime || '00:00:00'}`,
			ms: NaN
		}
	}
	const local = getLocalTimeAllJSON(new Date(ms))
	const hms = local.YMDHMS.slice(11)
	return {
		ymd: local.YMD,
		hms,
		ymdhms: local.YMDHMS,
		ms
	}
}

/** 是否与中国墙钟同一时区（UTC+8；港澳同属 +8，保持国内规则） */
export function isChinaTimezoneAligned(date = new Date()) {
	return getDeviceTimezoneOffsetMinutes(date) === CHINA_OFFSET_MINUTES
}

/** 中国 YMD 加减天（按日历日，不依赖本地时区） */
export function addChinaYmdDays(ymd, days) {
	const m = String(ymd || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
	if (!m) return String(ymd || '')
	const base = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
	if (!Number.isFinite(base)) return String(ymd || '')
	const out = new Date(base + Number(days || 0) * 86400000)
	return `${out.getUTCFullYear()}-${pad2(out.getUTCMonth() + 1)}-${pad2(out.getUTCDate())}`
}

/**
 * 报告查询用中国日期 YMD（24h / 7 天 / 无感国外 profDate 同一套）
 * - 国内 UTC+8：凌晨 1 点前用前一天，过了用当天（不变）
 * - 国外：按中国日历。例：手机 5 号、中国已是 6 号
 *   已过 6 号凌晨 1 点 → 传 6 号
 *   6 号 00:00–00:59 → 先传 5 号，无数据再回退 4 号（见 shouldOverseasMidnightFallback）
 */
export function getReportProfChinaYmd(date = new Date()) {
	const chinaNow = getChinaTimeAllJSON(date)
	const chinaHour = Number(chinaNow.YMDHMS.slice(11, 13))
	if (!(chinaHour < 1)) {
		return chinaNow.YMD
	}
	return addChinaYmdDays(chinaNow.YMD, -1)
}

/** 国外且中国时间 00:00–00:59：允许 5 号无数据时回退到 4 号 */
export function shouldOverseasMidnightFallback(date = new Date()) {
	if (isChinaTimezoneAligned(date)) return false
	return Number(getChinaTimeAllJSON(date).YMDHMS.slice(11, 13)) < 1
}

/**
 * 手机本地所选报告日 → 中国报告日（供接口 / 下页传参）
 * 选 D，对照中国时间是否已过 (D+1) 日 01:00：
 * - 已过 → 传 D+1（例：选 22，中国已过 23 号 01:00 → 传 23）
 * - 未过 → 仍传 D（例：选 25，中国未过 26 号 01:00 → 传 25）
 *
 * 注意：只应在「本地所选日」上调用一次，不要对已换算结果再次调用。
 */
export function localSelectedYmdToChinaYmd(selectedYmd) {
	const pad = pad2
	const toUtcDay = (ymd) => {
		const m = String(ymd || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
		if (!m) return NaN
		return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
	}
	const normalize = (ymd) => {
		const m = String(ymd || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
		if (!m) return ''
		return `${m[1]}-${pad(m[2])}-${pad(m[3])}`
	}
	const addDays = (ymd, n) => {
		const base = toUtcDay(ymd)
		if (!Number.isFinite(base)) return ymd
		const out = new Date(base + n * 86400000)
		return `${out.getUTCFullYear()}-${pad(out.getUTCMonth() + 1)}-${pad(out.getUTCDate())}`
	}

	const selected = normalize(String(selectedYmd || '').slice(0, 10))
	const chinaToday = getChinaTimeAllJSON().YMD
	if (!selected) return chinaToday

	// 选 D → 对照中国 (D+1) 01:00（中国 / 海外同一规则）
	const chinaNextDay = addDays(selected, 1)
	const gateMs = chinaWallClockToMs(`${chinaNextDay} 01:00:00`)
	if (!Number.isFinite(gateMs)) return selected
	return Date.now() >= gateMs ? chinaNextDay : selected
}

/**
 * 国外 24h 报告「监测时间」展示结束日（手机本地日历）
 * 例：手机已是 6 号
 * - 未过 7 号中国 01:00 → 结束日 5 号（窗口 4–5）
 * - 已过 → 结束日 6 号（窗口 5–6）
 * 接口 profDate 仍用 getReportProfChinaYmd，不在这里改。
 */
export function getOverseas24hDisplayEndYmd(date = new Date()) {
	const localYmd = getLocalTimeAllJSON(date).YMD
	return addChinaYmdDays(localSelectedYmdToChinaYmd(localYmd), -1)
}