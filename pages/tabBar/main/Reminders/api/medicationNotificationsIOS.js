import { alarmSoundSeconds, normalizeMedicationReminders } from './medicationReminder.js'

// 同一时刻、同一声音的药品合并为一条通知；每天重复只占一个系统名额。
// weekday 使用 Apple Calendar 的星期编号：周日 1，周一 2。
export function buildIOSMedicationPlan(reminders, includeActions = false) {
	const groups = new Map()
	for (const item of normalizeMedicationReminders(reminders).sort((a, b) => a.id.localeCompare(b.id))) {
		if (!item.enabled) continue
		for (const time of item.times) {
			const key = time + '.' + item.sound + (item.sound === 'alarm' ? '.' + item.soundSeconds : '')
			if (!groups.has(key)) groups.set(key, { time, sound: item.sound, soundSeconds: alarmSoundSeconds(item), days: Array.from({ length: 7 }, () => []), ids: Array.from({ length: 7 }, () => []) })
			const group = groups.get(key)
			const line = [item.name, item.dose, item.note].filter(Boolean).join(' · ')
			for (const day of item.weekdays) { group.days[day - 1].push(line); group.ids[day - 1].push(item.id) }
		}
	}
	const plan = []
	for (const [key, group] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
		const bodies = group.days.map(lines => lines.join('\n'))
		const [hour, minute] = group.time.split(':').map(Number)
		const daily = bodies[0] && bodies.every(body => body === bodies[0]) && (!includeActions || group.ids.every(ids => JSON.stringify(ids) === JSON.stringify(group.ids[0])))
		const soundSeconds = group.sound === 'alarm' ? { soundSeconds: group.soundSeconds } : {}
		if (daily) plan.push({ id: 'daily.' + key, hour, minute, weekday: 0, sound: group.sound, ...soundSeconds, body: bodies[0] })
		else bodies.forEach((body, index) => {
			if (body) plan.push({ id: 'day' + (index + 1) + '.' + key, hour, minute,
				weekday: (index + 1) % 7 + 1, sound: group.sound, ...soundSeconds, body })
		})
	}
	if (!includeActions) return plan
	const normalized=normalizeMedicationReminders(reminders)
	return plan.map(row=>({ ...row, items:normalized.filter(item=>item.enabled && item.sound===row.sound && (row.sound!=='alarm' || item.soundSeconds===row.soundSeconds) && item.times.includes(String(row.hour).padStart(2,'0')+':'+String(row.minute).padStart(2,'0')) && (!row.weekday || item.weekdays.includes((row.weekday+5)%7+1))).sort((a,b)=>a.id.localeCompare(b.id)).map(item=>({id:item.id,name:item.name,dose:item.dose,note:item.note})) }))
}

// UTS 用字符串边界桥接 Swift，避免修改 Android 原生插件协议。
export function createIOSMedicationPlugin(invoke) {
	if (typeof invoke !== 'function') return null
	const plugin = { timeoutMs: 120000 } // 首次授权弹窗需要留出用户操作时间。
	for (const method of ['setSession', 'replace', 'status', 'openSettings', 'preview', 'stopPreview', 'replaceBP', 'healthAction', 'healthEvents', 'ackHealthEvents', 'syncHealthChecks', 'dismissHealthReminder', 'scheduleMedFollowUp', 'cancelMedFollowUp']) {
		plugin[method] = (args, callback) => {
			const payload = method === 'replace'
				? { scope: args.scope, title: args.title, plan: buildIOSMedicationPlan(JSON.parse(args.reminders), true) }
				: args
			invoke(method, JSON.stringify(payload), result => {
				let response
				try { response = JSON.parse(result) }
				catch (error) { response = { ok: false, code: 'INVALID_RESPONSE' } }
				if (method === 'replaceBP' || method === 'syncHealthChecks') {
					const detail = { method }
					for (const key of ['ok', 'code', 'stage', 'nativeDomain', 'nativeCode', 'message', 'plannedCount', 'pendingCount', 'bpScheduledThrough']) {
						if (response && response[key] !== undefined) detail[key] = response[key]
					}
					console.log('[BP_NATIVE_RESULT] ' + JSON.stringify(detail))
				}
				callback(response)
			})
		}
	}
	return plugin
}

