// 引入原生插件
const keepAliveModule = uni.requireNativePlugin('KeepAliveModule');

/**
 * 初始化插件
 * @returns {Promise}
 */
export function initKeepAlive() {
	return new Promise((resolve, reject) => {
		keepAliveModule.init({}, (res) => {
			console.log('初始化结果:', res);
			if (res.code === 0) {
				resolve(res);
			} else {
				reject(res);
			}
		});
	});
}

/**
 * 开始后台任务
 * @param {number} timeout - 超时时间（秒），默认600秒（10分钟）
 * @returns {Promise}
 */
export function startBackgroundTask(timeout = 600) {
	return new Promise((resolve, reject) => {
		keepAliveModule.startBackgroundTask({
			timeout: timeout
		}, (res) => {
			console.log('开始后台任务:', res);
			if (res.code === 0) {
				resolve(res);
			} else {
				reject(res);
			}
		});
	});
}

/**
 * 结束后台任务
 * @returns {Promise}
 */
export function endBackgroundTask() {
	return new Promise((resolve, reject) => {
		keepAliveModule.endBackgroundTask((res) => {
			console.log('结束后台任务:', res);
			if (res.code === 0) {
				resolve(res);
			} else {
				reject(res);
			}
		});
	});
}

/**
 * 设置后台刷新
 * @param {number} interval - 刷新间隔（秒），默认900秒（15分钟）
 * @returns {Promise}
 */
export function scheduleBackgroundRefresh(interval = 900) {
	return new Promise((resolve, reject) => {
		keepAliveModule.scheduleBackgroundRefresh({
			interval: interval
		}, (res) => {
			console.log('设置后台刷新:', res);
			if (res.code === 0) {
				resolve(res);
			} else {
				reject(res);
			}
		});
	});
}

/**
 * 启用/禁用音频保活
 * @param {boolean} enable - 是否启用
 */
export function enableAudioKeepAlive(enable = true) {
	keepAliveModule.enableAudioKeepAlive({
		enable: enable
	});
}

/**
 * 启用/禁用定位保活
 * @param {boolean} enable - 是否启用
 */
export function enableLocationKeepAlive(enable = true) {
	keepAliveModule.enableLocationKeepAlive({
		enable: enable
	});
}

/**
 * 检查后台刷新状态
 * @returns {Promise}
 */
export function checkBackgroundRefreshStatus() {
	return new Promise((resolve, reject) => {
		keepAliveModule.isBackgroundRefreshStatus((res) => {
			console.log('后台刷新状态:', res);
			if (res.code === 0) {
				resolve(res.data);
			} else {
				reject(res);
			}
		});
	});
}

/**
 * 监听后台任务过期事件
 * @param {Function} callback - 回调函数
 */
export function onBackgroundTaskExpired(callback) {
	// 使用 uni.onNativeEventListen 或全局事件
	uni.onNativeEventListen('KeepAliveModule', 'onBackgroundTaskExpired', (data) => {
		console.log('后台任务即将过期:', data);
		callback(data);
	});
}

/**
 * 停止监听后台任务过期事件
 */
export function offBackgroundTaskExpired() {
	uni.offNativeEventListen('KeepAliveModule', 'onBackgroundTaskExpired');
}

// 默认导出所有方法
export default {
	init: initKeepAlive,
	startBackgroundTask,
	endBackgroundTask,
	scheduleBackgroundRefresh,
	enableAudioKeepAlive,
	enableLocationKeepAlive,
	checkBackgroundRefreshStatus,
	onBackgroundTaskExpired,
	offBackgroundTaskExpired
};