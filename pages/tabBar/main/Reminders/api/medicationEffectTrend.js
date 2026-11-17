import { localReminderDate, reminderOccurrences } from './healthReminders.js'

export function measurementTime(row, detail) {
	const value = detail.time == null ? detail.dateTime : detail.time
	if (typeof value === 'number' || /^\d{10}(?:\d{3})?$/.test(String(value))) {
		const at = Number(value)
		return at > 0 ? (at < 1e12 ? at * 1000 : at) : NaN
	}
	const text = String(value || '').trim().replace(/\//g, '-')
	if (/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:?\d{2})$/.test(text)) return Date.parse(text)
	const clock = text.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/)
	const date = String(row.dateTime || row.date || row.dateStr || row.createTime || '').slice(0, 10).replace(/\//g, '-')
	const stamp = (clock ? date + ' ' + text : text).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/)
	if (!stamp || Number(stamp[4]) > 23) return NaN
	const [, year, month, day, hour, minute, second = '0'] = stamp
	const at = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))
	return at.getFullYear() === Number(year) && at.getMonth() === Number(month) - 1 && at.getDate() === Number(day) ? at.getTime() : NaN
}

// 按提醒时间选取明细：当天保留实测值，近7天计算每日均值；全天 summary 不参与分析。
export function medicationEffectTrend(rows, days = 1, now = Date.now(), schedules = {}) {
	days = days === 7 ? 7 : 1
	const byDay = new Map(), seen = new Set(), points = []
	const bp = schedules.bp || [], medication = schedules.medication || []
	const useBP = bp.some(item => item.enabled)
	const positive = value => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value)) && Number(value) > 0
	for (const row of Array.isArray(rows) ? rows : []) {
		if (!row || typeof row !== 'object') continue
		let object = row.object
		try { if (typeof object === 'string') object = JSON.parse(object) } catch (e) { continue }
		for (const detail of object && Array.isArray(object.details) ? object.details : []) {
			if (!detail || !positive(detail.highPressure) || !positive(detail.lowPressure)) continue
			const at = measurementTime(row, detail)
			if (!Number.isFinite(at) || at > now) continue
			const high = Number(detail.highPressure), low = Number(detail.lowPressure)
			const id = [detail.deviceSn || row.deviceSn || '', at, high, low].join('|')
			if (seen.has(id)) continue
			seen.add(id)
			const date = localReminderDate(new Date(at))
			if (!byDay.has(date)) byDay.set(date, [])
			byDay.get(date).push({ id, at, high, low })
		}
	}
	const round = value => Math.round(value * 10) / 10
	for (let i = days - 1; i >= 0; i--) {
		const day = new Date(now); day.setDate(day.getDate() - i); day.setHours(0, 0, 0, 0)
		const date = localReminderDate(day), readings = (byDay.get(date) || []).sort((a, b) => a.at - b.at)
		const selected = new Map()
		const select = (start, end, latest) => {
			const candidates = readings.filter(reading => reading.at >= start && reading.at <= end)
			const reading = latest ? candidates[candidates.length - 1] : candidates[0]
			if (reading) selected.set(reading.id, reading)
		}
		if (useBP) {
			for (const slot of reminderOccurrences(bp, 'bp', day.getTime(), 1)) select(slot.at - 30 * 60000, slot.at + 30 * 60000, true)
		} else {
			for (const slot of reminderOccurrences(medication, 'medication', day.getTime(), 1)) select(slot.at - 60 * 60000, slot.at, false)
			for (const [startHour, endHour] of [[11, 13], [20, 22]]) {
				const start = new Date(day), end = new Date(day)
				start.setHours(startHour); end.setHours(endHour)
				select(start.getTime(), end.getTime(), true)
			}
		}
		const values = [...selected.values()].sort((a, b) => a.at - b.at)
		if (days === 1) {
			for (const value of values) {
				const measuredAt = new Date(value.at)
				const time = [measuredAt.getHours(), measuredAt.getMinutes(), measuredAt.getSeconds()].map(part => String(part).padStart(2, '0')).join(':')
				points.push({ ...value, date, time })
			}
			continue
		}
		points.push({ date, count: values.length,
			high: values.length ? round(values.reduce((sum, value) => sum + value.high, 0) / values.length) : null,
			low: values.length ? round(values.reduce((sum, value) => sum + value.low, 0) / values.length) : null })
	}
	const valid = points.filter(point => point.high !== null), comparable = days === 7 && valid.length >= 2
	return { points, enough: valid.length > 0, comparable,
		highAverage: days === 7 && valid.length ? round(valid.reduce((sum, point) => sum + point.high, 0) / valid.length) : null,
		lowAverage: days === 7 && valid.length ? round(valid.reduce((sum, point) => sum + point.low, 0) / valid.length) : null,
		highChange: comparable ? round(valid[valid.length - 1].high - valid[0].high) : null,
		lowChange: comparable ? round(valid[valid.length - 1].low - valid[0].low) : null }
}
