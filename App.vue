<script>
	const systemInfo = uni.getSystemInfoSync()
	import {
		isInChinaByIP,
		ISgetUserInfoUS,
		ISgetUserInfoChina,
	} from './pages/api/isInChinaByIP.js'; //获取定位
	import {
		initKeepAlive,
		startBackgroundTask,
		endBackgroundTask,
		scheduleBackgroundRefresh,
		enableAudioKeepAlive,
		enableLocationKeepAlive,
		checkBackgroundRefreshStatus,
		onBackgroundTaskExpired,
		offBackgroundTaskExpired
	} from 'nativeplugins/KeepAlivesdkplugin/ios/keepAlive.js'; // 严格按 keepAlive.js 导出 API

	import {
		resumeQxBleScheduleIfEnabled,
		onQxBleAppBackground,
		onQxBleAppForeground
	} from '@/pages/api/qxBleAlignedSchedule.js'
	import keepAliveManager from 'nativeplugins/KeepAlivesdkplugin/keepAliveManager.js'
	import Vue from 'vue'
	import {
		refreshActiveAppBaseUrl
	} from '@/pages/api/appBaseHosts.js';
	export default {
		data() {
			return {
				timer: null, //定时器名称
				lastx: 0, // 上次x轴加速
				lasty: 0, // 上次r釉加速度
				lastz: 0, // 上次z釉细速度
				lastTime: 0,
				stepCount: 0, //步数
				notifyTriggered: false, // 初始化通知标志
				sendnotifyTriggered: false, // 初始化通知标志
				intervalId: null, // 用于存储定时器的 ID
				isMandatory: false,
				initStatus: false,
				taskRunning: false,
				audioEnabled: false,
				locationEnabled: false,
				keepAliveInited: false,
				backgroundRefreshScheduled: false,
				bgRefreshPromptShowing: false,
				qxAppHidden: false,
				_lastBgTaskRenewAt: 0,
				_bgTaskExpiredBound: false,
			}
		},

	
		onLaunch: function() {
			const that = this
			// 情绪定时开关保存后立刻启/停
			uni.$on('qx:keepalive:start', function() {
				that.activateQxPpgKeepAlive('schedule-start')
			})
			uni.$on('qx:keepalive:stop', function() {
				that.deactivateQxPpgKeepAlive('schedule-stop')
			})
			uni.$on('qx:keepalive:renew', function() {
				if (!that.isQxKeepAliveEnabled()) return
				that.applyKeepAliveFromPlugin(true)
			})
			that.bindBackgroundTaskExpired()
			if (typeof uni.onAppHide === 'function') {
				uni.onAppHide(function() {
					that.qxAppHidden = true
					if (!that.isQxKeepAliveEnabled()) return
					if (typeof onQxBleAppBackground === 'function') {
						onQxBleAppBackground()
					}
					// 开关开启时：音频 + 连续定位（定位才是有效保活，勿在前后台反复开关）
					that.applyKeepAliveFromPlugin(true)
				})
			}
			if (typeof uni.onAppShow === 'function') {
				uni.onAppShow(function() {
					that.qxAppHidden = false
					if (!that.isQxKeepAliveEnabled()) return
					// 回前台仍保持定位保活，避免反复 enable/disable 被系统杀掉
					that.applyKeepAliveFromPlugin(false)
					if (typeof onQxBleAppForeground === 'function') {
						onQxBleAppForeground()
					} else {
						resumeQxBleScheduleIfEnabled({
							fromForeground: true
						}).catch((e) => {
							console.warn('resumeQxBleScheduleIfEnabled app-show', e)
						})
					}
				})
			}
			setTimeout(() => {
				plus.navigator.closeSplashscreen()
			}, 1000)
			const lan = uni.getLocale();
			if (lan == 'zh-Hans' || lan == 'zh-Hant') {
				this._i18n.locale = "zh-CN";
			} else {
				this._i18n.locale = "en-US";
			}
			refreshActiveAppBaseUrl(Vue)
		},

		onHide() {
			this.qxAppHidden = true
			const qxOn = this.isQxKeepAliveEnabled()
			this.stopInterval();
			setTimeout(() => {
				this.startInterval();
			}, 1000)
			if (qxOn) {
				this.handleInit()
				this.applyKeepAliveFromPlugin(true)
			}
			if (typeof onQxBleAppBackground === 'function') {
				onQxBleAppBackground()
			}
		},

		mounted() {
			this.notifyTriggered = false
		},

		onShow() {
			let that = this
			that.qxAppHidden = false
			that.getBaseUrl();
			plus.runtime.setBadgeNumber(0)
			that.setTabBarItems()
			that.stopInterval();
			setTimeout(() => {
				that.startInterval();
			}, 1000)
			if (uni.getStorageSync('token') && that.isQxKeepAliveEnabled()) {
				that.handleInit()
			}
			let timesder = setInterval(res => {
				if (uni.getStorageSync("token")) {
					clearInterval(timesder)
					if (that.isQxKeepAliveEnabled()) {
						that.handleInit()
						if (typeof onQxBleAppForeground === 'function') {
							onQxBleAppForeground()
						}
					}
				}
			}, 2000)
		},

		methods: {
			/** 定时测量任一开关开启即保活/恢复（无感 switchHER + 情绪 switchEmotionHER，与 qxBleAlignedSchedule.isSwitchOn 一致） */
			isQxKeepAliveEnabled() {
				const isOn = (v) => v === true || v === 'true' || v === 1 || v === '1'
				return isOn(uni.getStorageSync('switchHER')) || isOn(uni.getStorageSync('switchEmotionHER'))
			},
			/**
			 * 严格按 keepAlive.js：开关开启时始终
			 * enableAudioKeepAlive(true) + enableLocationKeepAlive(true)
			 * 定位才是有效保活，前后台都保持开启，禁止反复开关导致进程被杀
			 * @param {boolean} [renewBgTask] 进后台/到期时续申后台任务
			 */
			applyKeepAliveFromPlugin(renewBgTask = false) {
				try {
					enableAudioKeepAlive(true)
					this.audioEnabled = true
				} catch (e) {
					console.warn('enableAudioKeepAlive', e)
				}
				try {
					enableLocationKeepAlive(true)
					this.locationEnabled = true
				} catch (e) {
					console.warn('enableLocationKeepAlive', e)
				}
				if (renewBgTask) {
					this.renewBackgroundTaskForQx('applyKeepAlive')
				}
				try {
					keepAliveManager.ensureRunningForAppTimers()
				} catch (e) {}
			},
			bindBackgroundTaskExpired() {
				if (this._bgTaskExpiredBound) return
				const that = this
				const doBind = () => {
					if (that._bgTaskExpiredBound) return
					that._bgTaskExpiredBound = true
					try {
						that._bgTaskExpiredHandler = function(data) {
							console.log('后台任务即将过期', data)
							if (!that.isQxKeepAliveEnabled()) return
							that.taskRunning = false
							that.applyKeepAliveFromPlugin(true)
						}
						onBackgroundTaskExpired(that._bgTaskExpiredHandler)
					} catch (e) {
						that._bgTaskExpiredBound = false
						console.warn('onBackgroundTaskExpired', e)
					}
				}
				if (typeof plus !== 'undefined' && plus.globalEvent) {
					doBind()
					return
				}
				if (typeof document !== 'undefined' && document.addEventListener) {
					document.addEventListener('plusready', doBind, {
						once: true
					})
				} else {
					setTimeout(doBind, 500)
				}
			},
			async renewBackgroundTaskForQx(reason = '') {
				if (!this.isQxKeepAliveEnabled()) return
				const now = Date.now()
				if (this._lastBgTaskRenewAt && now - this._lastBgTaskRenewAt < 3000) return
				this._lastBgTaskRenewAt = now
				try {
					await startBackgroundTask(600)
					this.taskRunning = true
					// console.log('[keepAlive] startBackgroundTask(600)', reason || '-')
				} catch (e) {
					console.warn('startBackgroundTask', reason, e)
				}
			},
			compareVersion(v1, v2) {
				const arr1 = v1.split('.').map(Number)
				const arr2 = v2.split('.').map(Number)
				const maxLen = Math.max(arr1.length, arr2.length)

				for (let i = 0; i < maxLen; i++) {
					const num1 = arr1[i] || 0
					const num2 = arr2[i] || 0
					if (num1 > num2) return 1
					if (num1 < num2) return -1
				}
				return 0
			},
			async checkVersionAndLogout() {
				try {
					const currentVersion = systemInfo.appVersion
					const lastVersion = uni.getStorageSync('last_app_version') || '3.2.0'
					if (this.compareVersion(currentVersion, lastVersion) !== 0) {
						uni.removeStorageSync("token")
						uni.setStorageSync('last_app_version', currentVersion)
					}
				} catch (e) {
					console.error('版本检测失败', e)
				}
			},

			getBaseUrl() {
				this.checkVersionAndLogout()
				refreshActiveAppBaseUrl(Vue)
				this.check_new_version("io.dcloud.jakob", "1")
			},
			/** initKeepAlive → startBackgroundTask → 音频+定位 */
			async handleInit() {
				if (this.keepAliveInited) {
					if (this.isQxKeepAliveEnabled()) {
						this.applyKeepAliveFromPlugin(!!this.qxAppHidden)
					}
					return
				}
				try {
					await initKeepAlive()
					this.initStatus = true
					this.keepAliveInited = true
					this.bindBackgroundTaskExpired()
					await this.handleStartTask()
				} catch (error) {
					console.log(`初始化失败: ${error.msg || error.message}`, 'error');
				} finally {
					uni.hideLoading();
				}
			},

			async handleStartTask() {
				try {
					if (this.taskRunning) {
						await this.handleScheduleRefresh()
						return
					}
					await this.renewBackgroundTaskForQx('handleStartTask')
					this.taskRunning = true
					await this.handleScheduleRefresh()
				} catch (error) {
				} finally {
					uni.hideLoading();
				}
			},

			async handleEndTask() {
				try {
					try {
						await endBackgroundTask()
					} catch (e) {}
					this.taskRunning = false;
				} catch (error) {
				} finally {
					uni.hideLoading();
				}
			},

			async handleScheduleRefresh() {
				try {
					if (this.isQxKeepAliveEnabled()) {
						await this.activateQxPpgKeepAlive('handleScheduleRefresh')
						return
					}
					this.applyKeepAliveFromPlugin(false)
				} catch (error) {
				} finally {
					uni.hideLoading();
				}
			},

			async activateQxPpgKeepAlive(reason = '') {
				if (!this.isQxKeepAliveEnabled()) return
				try {
					if (!this.keepAliveInited) {
						await initKeepAlive()
						this.keepAliveInited = true
						this.initStatus = true
						this.bindBackgroundTaskExpired()
					}
				} catch (e) {
					console.warn('activateQxPpgKeepAlive init', reason, e)
				}
				this.applyKeepAliveFromPlugin(true)
				// 可选：后台刷新（keepAlive.js scheduleBackgroundRefresh）
				try {
					if (!this.backgroundRefreshScheduled) {
						await scheduleBackgroundRefresh(900)
						this.backgroundRefreshScheduled = true
					}
				} catch (e) {
					console.warn('scheduleBackgroundRefresh', e)
				}
				this.taskRunning = true
				// console.log('QX PPG保活已激活(连续定位+音频)', reason || '-')
			},
			deactivateQxPpgKeepAlive(reason = '') {
				try {
					enableAudioKeepAlive(false)
				} catch (e) {}
				try {
					enableLocationKeepAlive(false)
				} catch (e) {}
				try {
					endBackgroundTask()
				} catch (e) {}
				try {
					keepAliveManager.stopQxLocationAlarm()
				} catch (e) {}
				this.audioEnabled = false
				this.locationEnabled = false
				this.taskRunning = false
				console.log('QX PPG保活已关闭', reason || '-')
			},

			ensureAudioKeepAlive() {
				try {
					enableAudioKeepAlive(true)
					this.audioEnabled = true
				} catch (e) {}
			},

			ensureLocationKeepAlive() {
				try {
					enableLocationKeepAlive(true)
					this.locationEnabled = true
				} catch (e) {}
			},

			forceQxBackgroundKeepAlive(forceLocation = true) {
				this.applyKeepAliveFromPlugin(!!this.qxAppHidden)
			},

			handleToggleAudio() {
				this.audioEnabled = !this.audioEnabled;
				enableAudioKeepAlive(this.audioEnabled);
				console.log(`音频保活已${this.audioEnabled ? '开启' : '关闭'}`, this.audioEnabled ? 'success' : 'warning');
			},

			handleToggleLocation() {
				this.locationEnabled = !this.locationEnabled;
				enableLocationKeepAlive(this.locationEnabled);
				console.log(`定位保活已${this.locationEnabled ? '开启' : '关闭'}`, this.locationEnabled ? 'success' : 'warning');
			},

			async handleCheckStatus() {
				try {
					const st = await checkBackgroundRefreshStatus()
					this.refreshStatus = JSON.stringify(st)
				} catch (e) {
					this.refreshStatus = '未知'
				}
			},

			// 发送推送消息
			sendPushMessage(pushClientId) {
				const now = new Date(); // 获取当前时间
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const houres = now.getHours() < 10 ? "0" + now.getHours() : now.getHours()
				const Minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()
				const Seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()
				const timestamp = year + "/" + month + "/" + day + " " + houres + ":" + Minutes + ":" + Seconds;
				uniCloud.callFunction({
						name: "testUniPush", // 云函数名称
						data: {
							cids: pushClientId, // 使用存储的设备 CID（接收者cid）
							title: "jakobLife",
							content: `${this.$t("测量通知")} ${timestamp}`, // 使用方括号而不是括号,
							request_id: "",
							timestamp: timestamp
						}
					})
					.then((dataRes) => {
						this.notifyTriggered = false; // 标记已触发通知
						this.sendnotifyTriggered = false
						console.log("云函数返回的参数", dataRes)
					})
					.catch((err) => {
						console.log("云函数报错", err)
						this.notifyTriggered = false; // 标记已触发通知
						this.sendnotifyTriggered = false
						uni.showToast({
							title: err.errMsg,
							icon: "none"
						})
					})
			},
			//获取app最新版本
			check_new_version(pkgName, type) {
				let that = this
				uni.request({
					url: that.$url_APP_IP + "/prod-api/system/version/check_new_version",
					method: 'POST',
					data: {
						pkgName: pkgName,
						type: type,
						versionName: systemInfo.appVersion,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(version) {
						if (version.data.code === 4003) {
							return
						} else {
							that.isMandatory = version.data.data.updateForce === 0 ? false : true;
							let remarkParts = version.data.data.remark === null ? "" : version.data
								.data.remark.split("&&&");
							// 初始化中英文变量
							let englishPart = '';
							let chinesePart = '';
							// 安全地获取分割后的部分
							if (remarkParts.length > 0) {
								englishPart = remarkParts[0];
							}
							if (remarkParts.length > 1) {
								chinesePart = remarkParts[1];
							}
							let lan = uni.getLocale();
							// let today = new Date().toISOString().slice(0, 10);
							let today = version.data.data.versionName;
							if (version.data.data.updateForce === 0) {
								if (uni.getStorageSync("aboutupdate") === today) {
									// console.log("不需要强制更新，按钮取消")
									return
								}
								// console.log("不需要强制更新")
								uni.showModal({
									content: `${that.$t('版本更新1')}${version.data.data.versionName}${that.$t('版本更新2')}\n${lan == 'zh-Hans' || lan == 'zh-Hant' ? chinesePart : englishPart}`,
									confirmText: that.$t('安装'),
									cancelText: that.$t("稍后安装"),
									success(modal) {
										if (modal.confirm) {
											// iOS 无法直接下载安装包，只能引导用户跳转 App Store 更新：
											const appleId = "6737795065"; // 替换为你的 App Store ID
											plus.runtime.launchApplication({
												action: `itms-apps://itunes.apple.com/app/id${appleId}?mt=8`
											});
										} else if (modal.cancel) {
											uni.setStorageSync("aboutupdate", today)
										}
									}
								});
							} else {
								// console.log("需要强制更新")
								uni.showModal({
									content: `${that.$t('版本更新1')}${version.data.data.versionName}${that.$t('版本更新2')}\n${(lan == 'zh-Hans' || lan == 'zh-Hant') ? chinesePart : englishPart}`,
									confirmText: that.$t('安装'),
									showCancel: false,
									success(modal) {
										if (modal.confirm) {
											// iOS 无法直接下载安装包，只能引导用户跳转 App Store 更新：
											const appleId = "6737795065"; // 替换为你的 App Store ID
											plus.runtime.launchApplication({
												action: `itms-apps://itunes.apple.com/app/id${appleId}?mt=8`
											});
										} else if (modal.cancel) {

										}
									}
								});
							}
						}
					}
				})
			},

			naozhog() {
				let week = that.week(new Date().toDateString())
				this.timer = setInterval(function() {
					let houres = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date()
						.getHours()
					let minutes = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date()
						.getMinutes()
					let time = houres + ":" + minutes
					// 放入你自己的业务逻辑代码
					uni.getStorageInfo({
						success(resssd) {
							if (resssd.keys.includes("tixing")) {
								let autiolist = uni.getStorageSync("tixing")
								for (let i = 0; autiolist.length > i; i++) {
									if (autiolist[i].switch === true && autiolist[i].weekly
										.includes(
											week) && autiolist[i].times === time) {
										if (autiolist[i].Audios == "雷达(默认)") {
											if (uni.getSystemInfoSync().platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/lieda.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src = '/static/autio/lieda.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											}
										} else if (autiolist[i].Audios == "波浪") {
											if (uni.getSystemInfoSync().platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/bolang.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src = '/static/autio/bolang.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											}
										} else if (autiolist[i].Audios == "倒影") {
											if (uni.getSystemInfoSync().platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/daoying.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'/static/autio/daoying.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											}
										} else if (autiolist[i].Audios == "灯塔") {
											if (uni.getSystemInfoSync().platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/dengta.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src = '/static/autio/dengta.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											}
										} else if (autiolist[i].Audios == "山顶") {
											if (uni.getSystemInfoSync().platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/shanding.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'/static/autio/shanding.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											}
										} else if (autiolist[i].Audios == "水晶") {
											if (uni.getSystemInfoSync().platform === "android") {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'http://localhost:8080/static/autio/shuijing.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											} else {
												const innerAudioContext = uni
													.createInnerAudioContext();
												innerAudioContext.autoplay = true;
												innerAudioContext.src =
													'/static/autio/shuijing.mp3';
												innerAudioContext.onPlay(() => {});
												innerAudioContext.onError((res) => {});
											}
										}
									}
								}
							}
						}
					})
				}, 3000);
			},
			startInterval() {
				// 启动定时器（仅分享列表轮询，PPG 后台到点靠定位保活脉冲，不写在这里）
				this.intervalId = setInterval(() => {
					this.receiver_list()
				}, 2000);
			},
			stopInterval() {
				// 停止定时器
				if (this.intervalId) {
					clearInterval(this.intervalId);
					this.intervalId = null; // 清空定时器 ID
				}
			},

			//查看别人分享给我的数据点列表
			receiver_list() {
				let that = this
				const data = {
					receiverId: uni.getStorageSync("userid")
				}
				that.$post(that.$url_APP_IP + that.$url_receiver_list, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(pending => {
					// console.log("receiver_list", pending)
					if (pending.code === 200 && pending.data && pending.data.length > 0) {
						let pendingDevices = pending.data;
						that.notifyTriggered = false
						if (uni.getStorageSync("switchList")) {
							if (uni.getStorageSync("switchList").length === pending.data
								.length) {
								const shuzhangya1 = uni.getStorageSync("shuzhangyaId1")
								const shuzhangya2 = uni.getStorageSync("shuzhangyaId2")
								const shousuoya1 = uni.getStorageSync("shousuoyaId1")
								const shousuoya2 = uni.getStorageSync("shousuoyaId2")
								const maibo1 = uni.getStorageSync("maiboId1")
								const maibo2 = uni.getStorageSync("maiboId2")
								const xeuyang1 = uni.getStorageSync("xeuyang1")
								const xeuyang2 = uni.getStorageSync("xeuyang2")
								// 判断设备数量是否一致
								const storedDevices = uni.getStorageSync("switchList") || [];
								if (storedDevices.length === pendingDevices.length) {
									// 创建快速查找映射
									const pendingMap = new Map(pendingDevices.map(d => [d
										.sharerId,
										d
									]));
									// 更新 storedDevices 中的 registerVal 值
									const updatedDevices = storedDevices.map(
										storedDevice => {
											const pendingDevice = pendingMap.get(
												storedDevice
												.sharerId);
											if (!pendingDevice) return storedDevice;
											const updatedDataPoints = storedDevice
												.dataPoints
												.flatMap(dp => {
													const pendingDataPoints =
														pendingDevice
														.dataPoints.filter(pdp =>
															pdp
															.register === dp
															.register);
													if (pendingDataPoints.length >
														0) {
														// 为每个匹配的 pendingDataPoint 创建一个新的 dp 对象
														return pendingDataPoints
															.map(
																pendingDataPoint =>
																({
																	...dp,
																	registerVal: pendingDataPoint
																		.registerVal
																}));
													} else {
														// 如果没有匹配项，保留原始的 dp 对象
														return dp;
													}
												});
											return {
												...storedDevice,
												dataPoints: updatedDataPoints
											};
										});
									// 如果数据发生变化，保存更新后的数据到本地存储
									uni.setStorageSync("switchList", updatedDevices);
									// 保存原始副本
									const originalData = JSON.parse(JSON.stringify(
										storedDevices));
									// 检查数据是否发生变化
									let hasDataChanged = false;
									for (let i = 0; i < updatedDevices.length; i++) {
										if (updatedDevices[i].swicth === true) {
											// 找到原始数据中对应的设备
											const originalDevice = originalData.find(
												device =>
												device.sharerId === updatedDevices[i]
												.sharerId);
											if (!originalDevice) {
												// 如果原始数据中没有找到对应的设备，说明数据发生了变化
												hasDataChanged = true;
												break;
											}
											// 比较 dataPoints 是否发生变化
											const originalDataPoints = originalDevice
												.dataPoints;
											const updatedDataPoints = updatedDevices[i]
												.dataPoints;

											if (originalDataPoints.length !==
												updatedDataPoints
												.length) {
												// 如果 dataPoints 数组长度不同，说明数据发生了变化
												hasDataChanged = true;
												break;
											}
											for (let j = 0; j < originalDataPoints
												.length; j++) {
												const originalPoint = originalDataPoints[
													j];
												const updatedPoint = updatedDataPoints
													.find(
														point => point.register ===
														originalPoint.register);

												if (!updatedPoint) {
													// 如果更新后的 dataPoints 中没有找到对应的字段，说明数据发生了变化
													hasDataChanged = true;
													break;
												}

												if (originalPoint.registerVal !==
													updatedPoint
													.registerVal) {
													// 如果字段值发生变化，说明数据发生了变化
													hasDataChanged = true;
													break;
												}
											}
											if (hasDataChanged) {
												break; // 如果发现变化，退出循环
											}
										}
									}
									if (hasDataChanged) {
										let aaa = uni.getStorageSync("switchList")
										let bbb = []
										// 保存更新后的数据到本地存储
										for (let i = 0; aaa.length > i; i++) {
											for (let aa = 0; aaa[i].dataPoints.length >
												aa; aa++) {
												if (aaa[i].dataPoints[aa].register ===
													"lowPressure") {
													const lowPressure = parseInt(aaa[i]
														.dataPoints[aa].registerVal);
													if (shuzhangya1 <= lowPressure &&
														shuzhangya2 >= lowPressure) {
														aaa[i].jingbaoshow1 = false
														aaa[i].jingbao1 = lowPressure +
															"mmHg"
													} else {
														aaa[i].jingbaoshow1 = true
														aaa[i].jingbao1 = lowPressure +
															"mmHg"
														that.notifyTriggered = true
													}
												}
												if (aaa[i].dataPoints[aa].register ===
													"highPressure") {
													const highPressure = parseInt(aaa[i]
														.dataPoints[aa].registerVal);
													if (shousuoya1 <= highPressure &&
														shousuoya2 >= highPressure) {
														aaa[i].jingbaoshow2 = false
														aaa[i].jingbao2 = highPressure +
															"mmHg"
													} else {
														aaa[i].jingbaoshow2 = true
														aaa[i].jingbao2 = highPressure +
															"mmHg"
														that.notifyTriggered = true
													}
												}
												if (aaa[i].dataPoints[aa].register ===
													"heartrate") {
													const heartrate = parseInt(aaa[i]
														.dataPoints[aa].registerVal);
													if (maibo1 <= heartrate && maibo2 >=
														heartrate) {
														aaa[i].jingbaoshow3 = false
														aaa[i].jingbao3 = heartrate + "BPM"
													} else {
														aaa[i].jingbaoshow3 = true
														aaa[i].jingbao3 = heartrate + "BPM"
														that.notifyTriggered = true
													}
												}
												if (aaa[i].dataPoints[aa].register ===
													"oxygen") {
													const oxygen = parseInt(aaa[i]
														.dataPoints[
															aa].registerVal);
													if (xeuyang1 <= oxygen && xeuyang2 >=
														oxygen) {
														aaa[i].jingbaoshow4 = false
														aaa[i].jingbao4 = oxygen + "%"
													} else {
														aaa[i].jingbaoshow4 = true
														aaa[i].jingbao4 = oxygen + "%"
														that.notifyTriggered = true
													}
												}
											}
											bbb.push(aaa[i])
											uni.setStorageSync("switchList", bbb)
										}
										that.checkAndNotify()
									}
								}
							} else {
								let array1 = uni.getStorageSync("switchList");
								let array2 = [];
								// 遍历 pendingDevices
								pendingDevices.forEach(item => {
									item.swicth = false;
									item.jingbaoshow1 = false;
									item.jingbao1 = "";
									item.jingbaoshow2 = false;
									item.jingbao2 = "";
									item.jingbaoshow3 = false;
									item.jingbao3 = "";
									item.dataPoints.forEach(dataPoint => {
										let value = parseInt(dataPoint
											.registerVal);
										switch (dataPoint.register) {
											case "lowPressure":
												that.checkAlarm(item,
													dataPoint
													.register, value,
													that
													.shuzhangya1, that
													.shuzhangya2,
													"jingbaoshow1",
													"jingbao1", "mmHg");
												break;
											case "highPressure":
												that.checkAlarm(item,
													dataPoint
													.register, value,
													that
													.shousuoya1, that
													.shousuoya2,
													"jingbaoshow2",
													"jingbao2", "mmHg");
												break;
											case "heartrate":
												that.checkAlarm(item,
													dataPoint
													.register, value,
													that
													.maibo1, that
													.maibo2,
													"jingbaoshow3",
													"jingbao3", "BPM");
												break;
											case "oxygen":
												that.checkAlarm(item,
													dataPoint
													.register, value,
													that
													.xeuyang1, that
													.xeuyang2,
													"jingbaoshow4",
													"jingbao4", "%");
												break;
										}
									});
									array2.push(item);
								});
								let combinedArray = array2.concat(
									array1.filter(item => !array2.some(
										longItem => longItem.id === item.id))
								);
								uni.setStorageSync("switchList", combinedArray)
							}
						}
					}
				})
			},
			// 封装检查和通知的逻辑
			checkAndNotify() {
				let that = this
				console.log("hahhahah", that.notifyTriggered)
				if (that.notifyTriggered === true && !that.sendnotifyTriggered) {
					uni.getPushClientId({
						success(res) {
							console.log('获取到的推送客户端标识:', res.cid);
							that.sendPushMessage(res.cid);
							that.notifyTriggered = false
							that.sendnotifyTriggered = true
							setTimeout(() => {
								that.sendnotifyTriggered = false
							}, 5000)
						},
						fail(err) {
							console.log("获取到的推送客户端标识失败", err)
							that.notifyTriggered = false;
							that.sendnotifyTriggered = true
							setTimeout(() => {
								that.sendnotifyTriggered = false
							}, 5000)
						}
					});
				}
			},
			// 定义报警逻辑的通用函数
			checkAlarm(item, register, value, min, max, showKey, alarmKey, unit) {
				if (min !== "" && max !== "") {
					if (value >= min && value <= max) {
						item[showKey] = false;
						item[alarmKey] = "";
					} else {
						if (item.swicth === false) {
							item[showKey] = false;
							item[alarmKey] = "";
						} else {
							item[showKey] = true;
							item[alarmKey] = value + unit;
						}
					}
				} else {
					item[showKey] = false;
					item[alarmKey] = "";
				}
			},
			// 获取当前星期几
			week(e) {
				let week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
				let date = new Date(e);
				let getday = date.getDay();
				return week[getday];
			},
			// 启动加速度计
			accelerometerStart() {
				const that = this;
				uni.onAccelerometerChange((res) => {
					that.handleAccelerometerChange(res);
				});
			},
			// 处理加速度计变化
			handleAccelerometerChange(res) {
				const {
					x,
					y,
					z
				} = res;
				const xxx = x - this.lastx;
				const yyy = y - this.lasty;
				const zzz = z - this.lastz;
				this.lastx = x;
				this.lasty = y;
				this.lastz = z;
				const dele = Math.sqrt(xxx * xxx + yyy * yyy + zzz * zzz);
				if (dele > 1.5) {
					this.handleStepCount();
				}
			},
			// 处理步数计数
			handleStepCount() {
				const currentTime = new Date().getTime();
				if (currentTime - this.lastTime > 1000) {
					this.stepCount++;
					this.lastTime = currentTime;
				}
				this.saveStepCount();
				this.checkDailyReset();
			},
			// 保存步数到本地存储
			saveStepCount() {
				uni.setStorageSync("settept", this.stepCount);
			},
			// 检查是否需要重置每日步数
			checkDailyReset() {
				const currentTime = new Date().getTime();
				const formattedTime = this.formatDate(currentTime);
				if (formattedTime === "23:59:59" || formattedTime === "0:0:0") {
					uni.removeStorageSync("settept");
					uni.removeStorageSync("settept1");
				}
			},
			//时间戳转时间
			formatDate(value) {
				const data = new Date(value);
				const month = data.getMonth();
				const day = data.getDate();
				const year = data.getFullYear();
				const hours = data.getHours();
				const minutes = data.getMinutes();
				const seconds = data.getSeconds();
				return `${hours}:${minutes}:${seconds}`;
			},

			// 修改底部导航
			setTabBarItems() {
				// 修改底部导航
				uni.setTabBarItem({
					index: 0,
					text: this.$t('首页')
				});
				uni.setTabBarItem({
					index: 1,
					text: this.$t('趋势')
				});
				uni.setTabBarItem({
					index: 2,
					text: this.$t('设备'),
				});
				uni.setTabBarItem({
					index: 3,
					text: this.$t('共享')
				});
				uni.setTabBarItem({
					index: 4,
					text: this.$t('我的')
				});

			}
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	@import '@/static/customicons.css';



	.uni-tabbar {
		// tab 样式
		// 背景色
		// background-color: rgba(57, 181, 74, 0.1) !important;

		// tabBar 样式
		// 上边框
		// .uni-tabbar-border {
		// 	background-color: #e54d42 !important; // tabBar 上边框的颜色
		// }

		.uni-tabbar__item {

			// tabBar 单项样式
			// height: 100rpx !important;

			// &:not(:last-child) {
			// 	border-right: 4rpx solid #eee;
			// }

			// .uni-tabbar__icon {
			// 	// tabBar 图标样式
			// 	width: 40rpx !important;
			// 	height: 40rpx !important;
			// }

			.uni-tabbar__label {
				// tabBar 文字样式
				// color:yellow !important
				font-size: 16px !important
			}
		}
	}


	//设置圆角
	checkbox.round .wx-checkbox-input,
	checkbox.round .uni-checkbox-input {
		border-radius: 20px;
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}


	checkbox.round1 .wx-checkbox-input,
	checkbox.round1 .uni-checkbox-input {
		border-radius: 50px;
		width: 20px;
		height: 20px;
	}

	//设置背景色(例如我这里是黄色的checkbox,我就设置一个checkbox.yellow)
	checkbox.yellow[checked] .wx-checkbox-input,
	checkbox.yellow.checked .uni-checkbox-input {
		background-color: #ffca28 !important;
		border-color: #ffca28 !important;
		color: #ffffff !important;
	}

	//设置背景色
	checkbox.red[checked] .wx-checkbox-input,
	checkbox.red.checked .uni-checkbox-input {
		background-color: #e54d42 !important;
		border-color: #e54d42 !important;
		color: #ffffff !important;
	}

	//元素使用的时候就是使用 round 和 red
	/* H5 兼容 pc 所需 */
	/* #ifdef H5 */
	@media screen and (min-width: 768px) {
		body {
			overflow-y: scroll;
		}
	}

	uni-page-body {
		background-color: #F5F5F5 !important;
		min-height: 100% !important;
		height: auto !important;
	}

	.uni-top-window uni-tabbar .uni-tabbar {
		background-color: #fff !important;
	}

	.uni-app--showleftwindow .hideOnPc {
		display: none !important;
	}



	/* #endif */

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #efeff4;
		height: 100%;
		font-size: 28rpx;
		/* line-height: 1.8; */
	}

	.fix-pc-padding {
		padding: 0 50px;
	}

	.uni-header-logo {
		padding: 30rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}

	.uni-header-image {
		width: 100px;
		height: 100px;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300rpx;
		background: #FFF;
		padding: 50rpx;
		margin-top: 10px;
		font-size: 38rpx;
		color: #808080;
	}

	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popup-content {
		background: white;
		padding: 20px;
		border-radius: 10px;
		text-align: center;
	}

	/* #endif*/
</style>