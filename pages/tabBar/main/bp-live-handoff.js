let pendingLiveResult = null

export function setPendingLiveResult(result) {
	pendingLiveResult = result || null
}

export function takePendingLiveResult() {
	const result = pendingLiveResult
	pendingLiveResult = null
	return result
}
