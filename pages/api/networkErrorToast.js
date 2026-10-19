/**
 * 仅用于「网络连接异常」这一条提示。
 * 亮屏：立刻 uni.showToast，参数与原来一致。
 * 黑屏/后台：原生 toast 不会显示，先记下，回前台再弹一次。
 */
let appHidden = false
let pendingTitle = ''
let flushTimer = null
let bound = false

function syncHiddenFromApp() {
	try {
		const app = getApp()
		if (app && app.qxAppHidden === true) {
			appHidden = true
		}
	} catch (e) {}
}

function present(title) {
	uni.showToast({
		title: title,
		icon: 'none'
	})
}

export function ensureNetworkErrorToastBound() {
	if (bound) {
		return
	}
	bound = true
	syncHiddenFromApp()
	if (typeof uni.onAppHide === 'function') {
		uni.onAppHide(() => {
			appHidden = true
		})
	}
	if (typeof uni.onAppShow === 'function') {
		uni.onAppShow(() => {
			appHidden = false
			flushPendingNetworkErrorToast()
		})
	}
}

export function flushPendingNetworkErrorToast() {
	appHidden = false
	if (!pendingTitle) {
		return
	}
	const title = pendingTitle
	pendingTitle = ''
	if (flushTimer) {
		clearTimeout(flushTimer)
		flushTimer = null
	}
	// 回前台瞬间界面可能尚未恢复，立刻 showToast 仍会被吞
	flushTimer = setTimeout(() => {
		flushTimer = null
		syncHiddenFromApp()
		if (appHidden) {
			pendingTitle = title
			return
		}
		present(title)
	}, 300)
}

export function showNetworkErrorToast(title) {
	ensureNetworkErrorToastBound()
	syncHiddenFromApp()
	const text = title || ''
	if (!text) {
		return
	}
	if (appHidden) {
		pendingTitle = text
		return
	}
	if (flushTimer) {
		clearTimeout(flushTimer)
		flushTimer = null
	}
	pendingTitle = ''
	present(text)
}
