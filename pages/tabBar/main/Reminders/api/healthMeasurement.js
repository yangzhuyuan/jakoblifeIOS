// A read-only success observer: does not change upload payloads, responses, or control flow.
export function healthPressureRequestScope(url) {
	const endpoint = ['/prod-api/device_app/pressure_data', '/prod-api/jakoblife/fat_scale'].find(path => url.endsWith(path))
	if (!endpoint) return null
	return { baseUrl: url.slice(0, -endpoint.length), token: uni.getStorageSync('token'), userId: uni.getStorageSync('userid') }
}
export function observeHealthPressureSuccess(scope, data, response) {
	if (!scope || !response || response.code !== 200 || scope.token !== uni.getStorageSync('token') || scope.userId !== uni.getStorageSync('userid')) return
	const pressure = data && data.slaveData
	if (!pressure || !(Number(pressure.highPressure) > 0) || !(Number(pressure.lowPressure) > 0)) return
	const at = Number(data.time) * 1000
	if (!Number.isFinite(at) || at <= 0 || new Date(at).toDateString() !== new Date().toDateString()) return
	uni.$emit('HEALTH_BP_REPORTED', { ...scope, at })
}
