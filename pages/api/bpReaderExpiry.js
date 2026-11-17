import { getLocalTimeAllJSON } from './unitls/timezone.js'

export const BP_READER_FIRST_SCAN_DATA_TYPE = 'BPReaderFirstScan'
const TIME_KEYS = ['time', 'scanTime', 'firstScanTime', 'timestamp', 'firstScanAt', 'startTime', 'BPReaderFirstScan']

function parseDataObject(data) {
	let value = data
	if (typeof value === 'string') {
		value = JSON.parse(value.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":'))
	}
	if (Array.isArray(value)) value = value[0]
	return value || {}
}

// 到期提示、提前 3 天提示共用：10 位左右按秒，13 位按毫秒。
function asMillis(value) {
	const time = Number(value)
	if (!Number.isFinite(time) || time <= 0) return null
	return time < 1e11 ? time * 1000 : time
}

function normalizeYmd(value) {
	const text = String(value == null ? '' : value).trim()
	let match = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
	if (!match) match = text.match(/^(\d{4})(\d{2})(\d{2})$/)
	if (!match) return ''
	const year = Number(match[1])
	const month = Number(match[2])
	const day = Number(match[3])
	const date = new Date(Date.UTC(year, month - 1, day))
	if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return ''
	return `${match[1]}-${match[2]}-${match[3]}`
}

function scanStartYmd(data) {
	if (data == null || data === '') return ''
	if (typeof data === 'number' || (typeof data === 'string' && /^\d{10,13}$/.test(String(data).trim()))) {
		const ms = asMillis(data)
		return ms == null ? '' : localYmd(ms)
	}
	if (typeof data === 'string') {
		const text = data.trim()
		if (/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?$/.test(text) || /^\d{8}$/.test(text)) {
			return normalizeYmd(text)
		}
		try {
			return scanStartYmd(parseDataObject(text))
		} catch (error) {
			return ''
		}
	}
	if (typeof data !== 'object') return ''
	const day = normalizeYmd(data.firstScanDay)
	if (day) return day
	for (const key of TIME_KEYS) {
		if (data[key] == null || data[key] === '') continue
		const ymd = scanStartYmd(data[key])
		if (ymd) return ymd
	}
	return ''
}

function earliestScanYmd(rows) {
	let earliest = ''
	for (const row of rows || []) {
		const ymd = scanStartYmd(row && row.data)
		if (ymd && (!earliest || ymd < earliest)) earliest = ymd
	}
	return earliest
}

function cacheKeyFor(storage, baseUrl) {
	const token = storage.getStorageSync('token')
	const userId = storage.getStorageSync('userid')
	let hash = 2166136261
	for (const char of String(token || '')) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
	return 'bp_reader_first_scan:' + baseUrl + ':' + (userId || 'session-' + (hash >>> 0).toString(16))
}

function localYmd(time) {
	return getLocalTimeAllJSON(new Date(time)).YMD
}

export function createBPReaderExpiry({ baseUrl, get, post, storage }) {
	const token = storage.getStorageSync('token')
	const userId = storage.getStorageSync('userid')
	const headers = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' }
	const cacheKey = cacheKeyFor(storage, baseUrl)

	function assertAccount() {
		if (!token || token !== storage.getStorageSync('token') || userId !== storage.getStorageSync('userid')) {
			throw new Error('BP reader account changed')
		}
	}

	async function listRows() {
		const response = await get(baseUrl + '/prod-api/device/data/list', {
			dataType: BP_READER_FIRST_SCAN_DATA_TYPE
		}, headers)
		assertAccount()
		if (!response || response.code !== 200 || !Array.isArray(response.rows)) {
			throw new Error('Unable to load BP reader first scan')
		}
		return response.rows
	}

	function remember(time) {
		storage.setStorageSync(cacheKey, { time })
	}

	async function saveTime(time) {
		remember(time)
		const data = typeof time === 'number' ? `{time:${time}}` : `{time:"${String(time).replace(/"/g, '')}"}`
		const response = await post(baseUrl + '/prod-api/device/data/editData', {
			dataType: BP_READER_FIRST_SCAN_DATA_TYPE,
			data
		}, headers)
		if (!response || response.code !== 200) throw new Error('Unable to save BP reader first scan')
	}

	return {
		async loadFirstScanDate() {
			assertAccount()
			const rows = await listRows()
			if (!rows.length) return ''
			const ymd = earliestScanYmd(rows)
			if (!ymd) throw new Error('Invalid BP reader first scan')
			remember(ymd)
			return ymd
		},
		async recordFirstScan(date) {
			assertAccount()
			const rows = await listRows()
			if (rows.length) {
				const ymd = earliestScanYmd(rows)
				if (!ymd) throw new Error('Invalid BP reader first scan')
				remember(ymd)
				return
			}
			const startedAt = date instanceof Date ? date : new Date()
			await saveTime(getLocalTimeAllJSON(startedAt).YMDHMS)
		}
	}
}

// 按历史记录的日历日期计算六个月有效期，不按固定 180 天计算。
export function getBPReaderExpiryState(startYmd, now = new Date()) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(startYmd || ''))
	if (!match) throw new Error('Invalid BP reader start date')
	const year = Number(match[1])
	const month = Number(match[2]) - 1
	const day = Number(match[3])
	const start = new Date(Date.UTC(year, month, day))
	if (start.getUTCFullYear() !== year || start.getUTCMonth() !== month || start.getUTCDate() !== day) {
		throw new Error('Invalid BP reader start date')
	}
	// 月末在目标月份不存在时取该月最后一天，例如 8 月 31 日 → 次年 2 月 28 日。
	const lastDay = new Date(Date.UTC(year, month + 7, 0)).getUTCDate()
	const expires = Date.UTC(year, month + 6, Math.min(day, lastDay))
	// 取设备本地日期；使用 UTC 日历运算，避免夏令时造成天数误差。
	const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
	const warningStart = expires - 3 * 24 * 60 * 60 * 1000
	return {
		status: today >= expires ? 'expired' : today >= warningStart ? 'expiring' : 'active',
		expiresOn: new Date(expires).toISOString().slice(0, 10)
	}
}

