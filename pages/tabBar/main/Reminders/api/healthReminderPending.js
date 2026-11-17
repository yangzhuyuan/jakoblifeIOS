// Shared optimistic checks let the home card and list agree while the server write is pending.
// Persisted records remain authoritative; an unsuccessful save removes only its own overlay.
export const HEALTH_REMINDER_CHECKS_UPDATED = 'HEALTH_REMINDER_CHECKS_UPDATED'
let checkScope = '', checkSequence = 0, checkOverlay = {}
function checkAccount(vm) { return [vm.$url_APP_IP, uni.getStorageSync('userid'), uni.getStorageSync('token')].join('|') }
function checkState(vm) {
	const scope = checkAccount(vm)
	if (scope !== checkScope) { checkScope = scope; checkOverlay = {} }
	return checkOverlay
}
export function reminderCheckKey(slot) { return slot.kind + '|' + slot.id }
export function readReminderCheckOverlay(vm) { return { ...checkState(vm) } }
export function beginReminderCheck(vm, slot, completed) {
	const state = checkState(vm), key = reminderCheckKey(slot)
	if (state[key] && state[key].pending) return null
	const operation = { key, scope: checkScope, sequence: ++checkSequence, kind: slot.kind,
		date: slot.date, time: slot.time, itemIds: slot.items.map(item => item.id), completed, at: slot.at, updatedAt: Date.now(), pending: true }
	state[key] = operation
	uni.$emit(HEALTH_REMINDER_CHECKS_UPDATED)
	return operation
}
export function settleReminderCheck(operation, success) {
	if (operation.scope !== checkScope || checkOverlay[operation.key] !== operation) return
	if (success) checkOverlay[operation.key] = { ...operation, pending: false }
	else delete checkOverlay[operation.key]
	uni.$emit(HEALTH_REMINDER_CHECKS_UPDATED)
}
export function reconcileReminderCheckOverlay(vm, dashboard) {
	const state = checkState(vm)
	for (const [key, operation] of Object.entries(state)) {
		if (operation.pending) continue
		const records = dashboard.checks[operation.kind] || {}
		if (operation.itemIds.every(id => {
			const record = records[operation.date + '|' + operation.time + '|' + id]
			return record && (record.updatedAt > operation.updatedAt ||
				(record.updatedAt === operation.updatedAt && !!record.completed === operation.completed))
		})) delete state[key]
	}
	return { ...state }
}
