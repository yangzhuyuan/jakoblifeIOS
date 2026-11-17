// Plain-JS session ownership prevents late callbacks from restoring a closed page.
function liveLog(step, detail) {
	console.log('[BPLiveScan] ' + step + (detail ? ' ' + detail : ''))
}

export function createLiveController(reader, onState) {
	let epoch = 0,
		disposed = false,
		requestId = null,
		busy = false
	return {
		start(defaultPressureUnit = null, scanOptions = {}) {
			if (disposed || busy) {
				liveLog('start skipped', 'disposed=' + disposed + ' busy=' + busy + ' requestId=' + requestId)
				return false
			}
			const token = ++epoch
			requestId = `live-${Date.now()}-${token}`
			busy = true
			liveLog('start', 'requestId=' + requestId + ' scanTimeoutMs=' + (scanOptions.scanTimeoutMs || ''))
			onState({
				type: 'opening'
			})
			const scanArgs = {
				requestId,
				defaultPressureUnit
			}
			if (scanOptions.scanTimeoutMs !== undefined) scanArgs.scanTimeoutMs = scanOptions.scanTimeoutMs
			if (scanOptions.prompts && typeof scanOptions.prompts === 'object') scanArgs.prompts = scanOptions.prompts
			try {
				reader.startLiveScan(scanArgs, result => {
					if (disposed || token !== epoch || !busy) {
						liveLog('callback ignored', 'requestId=' + requestId + ' disposed=' + disposed + ' token=' + token + ' epoch=' + epoch + ' busy=' + busy)
						return
					}
					busy = false
					const finishedId = requestId
					requestId = null
					const type = result.errorCode === 'E_CANCELLED' ? 'cancelled' : result.recognitionStatus === 'recognized' ? 'recognized' : 'error'
					liveLog('callback', 'requestId=' + finishedId + ' type=' + type + ' errorCode=' + (result.errorCode || '') + ' recognitionStatus=' + (result.recognitionStatus || ''))
					try {
						onState({
							type,
							result
						})
					} catch (error) {
						console.error('[BPLiveScan] onState failed', error && (error.stack || error.message) || error)
					}
				})
			} catch (error) {
				busy = false
				requestId = null
				console.error('[BPLiveScan] startLiveScan throw', error && (error.stack || error.message) || error)
				onState({
					type: 'error',
					message: error.message
				})
			}
			return true
		},
		cancel() {
			const id = requestId
			++epoch
			requestId = null
			busy = false
			if (!id) return
			liveLog('cancel', 'requestId=' + id)
			try {
				reader.cancelLiveScan(id)
			} catch (error) {
				console.error('[BPLiveScan] cancelLiveScan throw', 'requestId=' + id, error && (error.stack || error.message) || error)
			}
		},
		dispose() {
			liveLog('dispose', 'requestId=' + requestId + ' busy=' + busy)
			disposed = true
			this.cancel()
		},
		get busy() {
			return busy
		}
	}
}
