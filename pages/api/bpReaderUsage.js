// 仅用于血压照片识别，按账号累计，不受其他设备绑定状态影响。
export const BP_READER_USAGE_DATA_TYPE = 'BPReaderUsage'
export const BP_READER_FREE_LIMIT = 15

function parseCount(data) {
	let value = data
	if (typeof value === 'string') {
		// 同时兼容标准 JSON 和 editData 使用的 {successCount:15} 格式。
		value = JSON.parse(value.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":'))
	}
	if (Array.isArray(value)) value = value[0]
	const raw = value && value.successCount
	if ((typeof raw !== 'number' && typeof raw !== 'string') || String(raw).trim() === '') {
		throw new Error('Invalid BP reader usage count')
	}
	const count = Number(raw)
	if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid BP reader usage count')
	return Math.min(count, BP_READER_FREE_LIMIT)
}

export function createBPReaderUsage({ baseUrl, get, post, storage }) {
	const token = storage.getStorageSync('token')
	const userId = storage.getStorageSync('userid')
	// 无用户 ID 时用登录凭据的哈希隔离缓存，不把原始 token 写入 key。
	let hash = 2166136261
	for (const char of String(token || '')) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
	const cacheKey = 'bp_reader_usage:' + baseUrl + ':' + (userId || 'session-' + (hash >>> 0).toString(16))
	const headers = { Authorization: 'Bearer ' + token, 'content-type': 'application/json' }
	let successCount = 0

	function assertAccount() {
		if (!token || token !== storage.getStorageSync('token') || userId !== storage.getStorageSync('userid')) {
			throw new Error('BP reader account changed')
		}
	}

	function cachedCount() {
		try {
			const cached = storage.getStorageSync(cacheKey)
			return cached ? parseCount(cached) : 0
		} catch (error) {
			console.warn('[BPReader] invalid usage cache', error)
			return 0
		}
	}

	async function saveCount() {
		const response = await post(baseUrl + '/prod-api/device/data/editData', {
			dataType: BP_READER_USAGE_DATA_TYPE,
			data: JSON.stringify({ successCount }).replace(/"/g, '')
		}, headers)
		if (!response || response.code !== 200) throw new Error('Unable to save BP reader usage')
	}

	return {
		async check() {
			assertAccount()
			const response = await get(baseUrl + '/prod-api/device/data/list', {
				dataType: BP_READER_USAGE_DATA_TYPE
			}, headers)
			assertAccount()
			if (!response || response.code !== 200 || !Array.isArray(response.rows)) {
				throw new Error('Unable to load BP reader usage')
			}
			const remoteCount = response.rows.reduce((count, row) => Math.max(count, parseCount(row.data)), 0)
			successCount = Math.max(successCount, remoteCount, cachedCount())
			if (successCount > remoteCount) {
				try {
					await saveCount()
				} catch (error) {
					// 已满额仍显示购买提示；未满额须先同步，避免持续漏记次数。
					if (successCount < BP_READER_FREE_LIMIT) throw error
				}
			}
			assertAccount()
			return { allowed: successCount < BP_READER_FREE_LIMIT }
		},
		async recordSuccess() {
			// 只有血压接口明确成功后才调用。先记本地，接口失败后下次校验补存。
			successCount = Math.min(Math.max(successCount, cachedCount()) + 1, BP_READER_FREE_LIMIT)
			let syncFailed = false
			try {
				storage.setStorageSync(cacheKey, { successCount })
			} catch (error) {
				console.warn('[BPReader] usage cache failed', error)
			}
			try {
				await saveCount()
			} catch (error) {
				syncFailed = true
				console.warn('[BPReader] usage sync pending', error)
			}
			return { limitReached: successCount >= BP_READER_FREE_LIMIT, syncFailed }
		}
	}
}
