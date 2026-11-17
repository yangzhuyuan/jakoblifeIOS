const KEY_PREFIX = 'bp_reader_virtual_device:'
const inflight = new Map()

function readerDeviceKey(baseUrl, userId) {
	return KEY_PREFIX + baseUrl + ':' + userId
}

function randomDigits(length) {
	let text = ''
	for (let i = 0; i < length; i++) text += Math.floor(Math.random() * 10)
	return text
}

function randomMac() {
	const parts = []
	for (let i = 0; i < 6; i++) {
		parts.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase())
	}
	return parts.join(':')
}

function localDateTime() {
	const date = new Date()
	const pad = (value) => String(value).padStart(2, '0')
	return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
		pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
}

function toSeconds(dateStr) {
	return Math.floor(new Date(String(dateStr).replace(/-/g, '/')).getTime() / 1000)
}

export function isThirdPartyReaderSn(deviceSn) {
	const sn = String(deviceSn || '').replace(/[^0-9A-Za-z]/g, '').toUpperCase()
	return sn.startsWith('10005') && sn.endsWith('CARM')
}

export function createReaderDeviceIdentity() {
	return {
		deviceSn: '10005' + randomDigits(8) + 'CARM',
		mac: randomMac(),
		registered: false,
		bound: false
	}
}

export function readReaderDevice(storage, baseUrl, userId) {
	if (!userId) return null
	const raw = storage.getStorageSync(readerDeviceKey(baseUrl, userId))
	if (!raw || typeof raw !== 'object') return null
	const deviceSn = String(raw.deviceSn || '')
	const mac = String(raw.mac || '')
	if (!isThirdPartyReaderSn(deviceSn) || !mac) return null
	return {
		deviceSn,
		mac,
		registered: !!raw.registered,
		bound: !!raw.bound
	}
}

export function saveReaderDevice(storage, baseUrl, userId, device) {
	storage.setStorageSync(readerDeviceKey(baseUrl, userId), {
		deviceSn: device.deviceSn,
		mac: device.mac,
		registered: !!device.registered,
		bound: !!device.bound
	})
}

export function clearReaderDeviceBound(storage, baseUrl, userId) {
	const device = readReaderDevice(storage, baseUrl, userId)
	if (!device) return
	device.bound = false
	saveReaderDevice(storage, baseUrl, userId, device)
}

function authHeader(contentType) {
	return {
		Authorization: 'Bearer ' + uni.getStorageSync('token'),
		'content-type': contentType
	}
}

function registerDevice(vm, device) {
	const data = {
		deviceSn: device.deviceSn,
		mac: device.mac,
		deviceTypeId: '1',
		deviceModel: 'ZK-B872',
		slaveData: {},
		time: toSeconds(localDateTime())
	}
	console.log(data)
	return vm.$post(vm.$url_APP_IP + vm.$url_jakoblife_fat_scale, data, {
		'content-type': 'application/json;charset=UTF-8'
	}).then((res) => {
		console.log('上报数据手表', res)
		if (!res || res.code !== 200) throw new Error('register failed')
		return res
	})
}

function queryBoundDevices(vm) {
	return vm.$post(vm.$url_APP_IP + vm.$url_queryDevices, {}, authHeader('application/json;charset=UTF-8'))
		.then((res) => {
			if (!res || res.code !== 200 || !Array.isArray(res.rows)) throw new Error('device list failed')
			return res.rows
		})
}

function accountReaderDevice(rows) {
	const matches = rows
		.filter((row) => isThirdPartyReaderSn(row && row.deviceSn))
		.sort((left, right) => String(left.deviceSn).localeCompare(String(right.deviceSn)))
	const row = matches[0]
	if (!row) return null
	return {
		deviceSn: String(row.deviceSn),
		mac: String(row.mac || ''),
		registered: true,
		bound: true
	}
}

function deviceAlreadyBound(vm, deviceSn) {
	return queryBoundDevices(vm)
		.then((rows) => rows.some((row) => String(row.deviceSn || '') === deviceSn))
		.catch(() => false)
}

async function bindDevice(vm, device) {
	const res = await vm.$post(vm.$url_APP_IP + vm.$url_bind_device, {
		deviceSn: device.deviceSn,
		mac: device.mac
	}, authHeader('application/x-www-form-urlencoded'))
	if (res && res.code == 200) return
	if (await deviceAlreadyBound(vm, device.deviceSn)) return
	throw new Error('bind failed')
}

async function prepareReaderDevice(vm, storage, baseUrl, userId) {
	const boundRows = await queryBoundDevices(vm)
	const remote = accountReaderDevice(boundRows)
	let device = readReaderDevice(storage, baseUrl, userId)
	if (remote) {
		if (!remote.mac && device && device.deviceSn === remote.deviceSn) remote.mac = device.mac
		if (!remote.mac) remote.mac = randomMac()
		device = remote
		saveReaderDevice(storage, baseUrl, userId, device)
	} else if (!device) {
		device = createReaderDeviceIdentity()
		saveReaderDevice(storage, baseUrl, userId, device)
	}
	if (!device.registered) {
		await registerDevice(vm, device)
		device.registered = true
		saveReaderDevice(storage, baseUrl, userId, device)
	}
	if (!device.bound) {
		await bindDevice(vm, device)
		device.bound = true
		saveReaderDevice(storage, baseUrl, userId, device)
	}
	return {
		deviceSn: device.deviceSn,
		mac: device.mac
	}
}

export function ensureReaderDevice(vm) {
	const storage = uni
	const baseUrl = vm.$url_APP_IP
	const userId = storage.getStorageSync('userid')
	if (!userId) return Promise.reject(new Error('missing user'))
	const key = readerDeviceKey(baseUrl, userId)
	if (inflight.has(key)) return inflight.get(key)
	const task = prepareReaderDevice(vm, storage, baseUrl, userId).finally(() => {
		inflight.delete(key)
	})
	inflight.set(key, task)
	return task
}
// 血压照片识别/手动输入的虚拟设备不能作为真实血压计或手表。
export function excludeBPReaderDevices(rows) {
	return Array.isArray(rows) ?
		rows.filter(row => row && !/^10005[0-9]+CARM$/.test(String(row.deviceSn || ''))) :
		rows
}