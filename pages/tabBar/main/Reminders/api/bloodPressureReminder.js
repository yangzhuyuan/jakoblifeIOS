import { alarmSoundSeconds } from './medicationReminder.js'

export const MAX_BP_REMINDERS = 8
export const BP_REMINDER_SOUNDS = ['system', 'alarm', 'silent']

export function normalizeBloodPressureSettings(value = {}) {
	const enabled = value.enabled === true
	if (!Array.isArray(value.reminders) || value.reminders.length > MAX_BP_REMINDERS) throw new Error('Invalid BP reminder list')
	const ids = new Set()
	const reminders = value.reminders.map(item => {
		if (!item || typeof item.id !== 'string' || !item.id || item.id.length > 80 || ids.has(item.id)) throw new Error('Invalid BP reminder id')
		ids.add(item.id)
		if (!Array.isArray(item.times) || item.times.length !== 1 || !/^([01]\d|2[0-3]):[0-5]\d$/.test(item.times[0])) throw new Error('Invalid BP reminder time')
		if (!Array.isArray(item.weekdays) || !item.weekdays.length || item.weekdays.some(day => !Number.isInteger(day) || day < 1 || day > 7)) throw new Error('Invalid BP reminder repeat')
		const sound = item.sound === undefined ? 'system' : item.sound
		if (!BP_REMINDER_SOUNDS.includes(sound)) throw new Error('Invalid BP reminder sound')
		const soundSeconds = alarmSoundSeconds({ sound, soundSeconds: item.soundSeconds })
		const linked = item.origin === 'medication' || String(item.id).startsWith('bp-med-')
		return { id: item.id, enabled: item.enabled === true, times: item.times.slice(), weekdays: [...new Set(item.weekdays)].sort(), sound, ...(sound === 'alarm' ? { soundSeconds } : {}), ...(linked ? { origin: 'medication' } : {}) }
	})
	if (enabled && !reminders.some(item => item.enabled)) throw new Error('Enable at least one BP reminder')
	const slots = new Set()
	for (const item of reminders.filter(item => item.enabled)) for (const day of item.weekdays) {
		const key = day + '|' + item.times[0]
		if (slots.has(key)) throw new Error('Duplicate BP reminder time')
		slots.add(key)
	}
	return { version: 1, enabled, reminders, ...(value.origin === 'medication' ? { origin: 'medication' } : {}) }
}

export function activeBloodPressureReminders(settings, name = 'Measure blood pressure') {
	return settings.reminders.map(item => ({ ...item, enabled: settings.enabled && item.enabled, name, dose: '', note: '', sound: item.sound || 'system' }))
}
