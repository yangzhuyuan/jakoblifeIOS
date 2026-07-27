<template>
	<view style="padding-top: 20px;padding-bottom: 80px;">
		<view v-if="isSensorlessMode" class="path-tip">{{$t('动态监测报告填写路径提示')}}</view>
		<!-- 无感测量：仅从无感入口进入时显示 -->
		<view v-if="isSensorlessMode" class="bt_BG">
			<view class="context_btn2">
				<view class="context_title1">{{$t('无感测量开关')}}
					<view v-if="sending" class="sending-status">
						<text class="sending-text">{{$t("配置中")}}</text>
						<text class="sending-icon-animate">⏳</text>
					</view>
				</view>
				<switch style="display: flex;flex: 1;justify-content: flex-end;" :checked="switchHER"
					@change="switch1ChangeHER" color="#4CD964" />
			</view>
			<view class="timer-item">
				<view class="context_btn1">
					<view class="text">{{$t('开始时间')}}：</view>
					<view class="picker-wrap">
						<picker fields="month" mode="time" :value="time1" @change="bindTimeChange_1">
							<view class="date_bg" :style="getStatusColor(time1)">{{time1}}</view>
						</picker>
					</view>
				</view>
				<view class="context_btn1">
					<view class="text">{{$t('结束时间')}}：</view>
					<view class="picker-wrap">
						<picker fields="month" mode="time" :value="time2" @change="bindTimeChange_2">
							<view class="date_bg" :style="getStatusColor(time2)">{{time2}}</view>
						</picker>
					</view>
				</view>
				<view class="context_btn1">
					<view class="text">{{$t('间隔时间')}}：</view>
					<view class="picker-wrap">
						<picker :value="index1" @change="Interval_time" :range="array1">
							<view class="date_bg">{{array1[index1]}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<!-- 情绪测量：仅从情绪入口进入时显示 -->
		<view v-if="isEmotionMode" class="bt_BG">
			<view class="context_btn2">
				<view class="context_title1">{{$t('情绪测量开关')}}
					<view v-if="sending" class="sending-status">
						<text class="sending-text">{{$t("配置中")}}</text>
						<text class="sending-icon-animate">⏳</text>
					</view>
				</view>
				<switch style="display: flex;flex: 1;justify-content: flex-end;" :checked="switchEmotion"
					@change="switchEmotionChange" color="#4CD964" />
			</view>
			<view class="timer-item">
				<view class="context_btn1">
					<view class="text">{{$t('开始时间')}}：</view>
					<view class="picker-wrap">
						<picker fields="month" mode="time" :value="timeEmotion1" @change="bindEmotionTimeChange_1">
							<view class="date_bg" :style="getStatusColor(timeEmotion1)">{{timeEmotion1}}</view>
						</picker>
					</view>
				</view>
				<view class="context_btn1">
					<view class="text">{{$t('结束时间')}}：</view>
					<view class="picker-wrap">
						<picker fields="month" mode="time" :value="timeEmotion2" @change="bindEmotionTimeChange_2">
							<view class="date_bg" :style="getStatusColor(timeEmotion2)">{{timeEmotion2}}</view>
						</picker>
					</view>
				</view>
				<view class="context_btn1">
					<view class="text">{{$t('间隔时间')}}：</view>
					<view class="picker-wrap">
						<picker :value="indexEmotion" @change="Interval_time_emotion" :range="array1">
							<view class="date_bg">{{array1[indexEmotion]}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<button class="buttonstyle" @click="clickset()">{{sending?$t("配置中"):$t("保存")}}</button>
		<view class="battery-hint">
			<text>{{$t('打开该功能手表和手机电池消耗会明显增加')}}</text>
		</view>
	</view>
</template>

<script>
	import {
		startGlobalQxBleAlignedSchedule,
		stopGlobalQxBleAlignedSchedule,
		QX_BPW6_EMOTION_MEASURE_KEY,
		ensureQxEmotionBindingReady
	} from '@/pages/api/qxBleAlignedSchedule.js'
	import {
		initKeepAlive,
		startBackgroundTask,
		scheduleBackgroundRefresh,
		enableAudioKeepAlive,
		enableLocationKeepAlive
	} from '@/nativeplugins/KeepAlivesdkplugin/ios/keepAlive.js'; // 严格按 keepAlive.js API

	/** 间隔选项（分钟），与云端 QX_DATA、全局调度模块一致 */
	const INTERVAL_MINUTES = [10, 30, 60, 120]

	function readBoolStorage(key) {
		const v = uni.getStorageSync(key)
		return v === true || v === 'true' || v === 1 || v === '1'
	}

	function defaultHM(offsetMin = 0) {
		const now = new Date()
		now.setMinutes(now.getMinutes() + offsetMin)
		const hours = now.getHours().toString().padStart(2, '0')
		const minutes = now.getMinutes().toString().padStart(2, '0')
		return `${hours}:${minutes}`
	}

	function readTimeStorage(key, offsetMin = 0) {
		const v = uni.getStorageSync(key)
		return v !== '' && v != null ? v : defaultHM(offsetMin)
	}

	function readIntervalStorage(key) {
		const v = uni.getStorageSync(key)
		return v !== '' && v != null ? v : 0
	}

	export default {
		data() {
			return {
				sending: false,
				// 无感测量（原定时测量，storage 键保持不变）
				switchHER: readBoolStorage('switchHER'),
				time1: readTimeStorage('starttime', 0),
				time2: readTimeStorage('endtime', 60),
				index1: readIntervalStorage('Interval_time'),
				// 情绪测量（独立时段）
				switchEmotion: readBoolStorage('switchEmotionHER'),
				timeEmotion1: readTimeStorage('starttime_emotion', 0),
				timeEmotion2: readTimeStorage('endtime_emotion', 60),
				indexEmotion: readIntervalStorage('Interval_time_emotion'),
				array1: [this.$t('分钟10'), this.$t('分钟30'), this.$t('分钟60'), this.$t('分钟120')],
				deviceId: uni.getStorageSync('deviceIdwatch'), //BPW1蓝牙mac
				serviceId: '81EEA001-E735-49EC-8A11-7E32CAE1E14E', //BPW1蓝牙设备服务值
				characteristicId: '81EEA003-E735-49EC-8A11-7E32CAE1E14E', //BPW1蓝牙设备服务写入特征值
				devicetype: false,
				/** sensorless=无感入口；emotion=情绪入口（默认情绪，兼容旧链接） */
				scheduleMode: 'emotion',
			}
		},
		computed: {
			isSensorlessMode() {
				return this.scheduleMode === 'sensorless'
			},
			isEmotionMode() {
				return this.scheduleMode === 'emotion'
			},
			pageTitle() {
				return this.isSensorlessMode ? this.$t('无感测量开关') : this.$t('情绪测量开关')
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.pageTitle
			})
			this.QX_DATA()
		},
		onLoad(options) {
			this.devicetype = options.devicetype
			const mode = String(options.scheduleMode || options.mode || '').toLowerCase()
			if (mode === 'sensorless' || mode === 'wugan' || mode === '无感') {
				this.scheduleMode = 'sensorless'
			} else {
				// 情绪页 / 未传参：只显示情绪定时
				this.scheduleMode = 'emotion'
			}
			console.log('devicetype', this.devicetype, 'scheduleMode', this.scheduleMode)
			this.persistBpw6EmotionMeasureFlag()
		},
		methods: {
			/** 任一开关打开即视为定时测量开启（两套配置仍合并调度） */
			isAnyScheduleOn() {
				return !!(this.switchHER || this.switchEmotion)
			},
			/** devicetype === "true" 时走 BPW6 PPG 情绪测量，否则走 BPW1 */
			persistBpw6EmotionMeasureFlag() {
				const isBpw6 = String(this.devicetype) === 'true'
				uni.setStorageSync(QX_BPW6_EMOTION_MEASURE_KEY, isBpw6)
				console.log('情绪定时测量设备类型', isBpw6 ? 'BPW6' : 'BPW1')
			},
			// 接口获取定时测量配置（QX_DATA）
			QX_DATA() {
				const data = {
					dataType: 'QX_DATA'
				}
				this.$get(this.$url_APP_IP + '/prod-api/device/data/list', data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					console.log('获取情绪定时测量配置', res)
					if (res.code !== 200 || !res.rows || !res.rows.length || !res.rows[0].data) return
					const row = this.parseQxDataRow(res.rows[0].data)
					if (!row) return
					if (row.starttime != null && row.starttime !== '') {
						this.time1 = this.normalizeTimePicker(String(row.starttime))
						uni.setStorageSync('starttime', this.time1)
					}
					if (row.endtime != null && row.endtime !== '') {
						this.time2 = this.normalizeTimePicker(String(row.endtime))
						uni.setStorageSync('endtime', this.time2)
					}
					if (row.intervalMinute != null && row.intervalMinute !== '') {
						const n = Number(row.intervalMinute)
						let ix = INTERVAL_MINUTES.indexOf(n)
						if (ix < 0) ix = 0
						this.index1 = ix
						uni.setStorageSync('Interval_time', this.index1)
					}
					if (row.SWITCH_QX !== undefined) {
						this.switchHER = row.SWITCH_QX === true || row.SWITCH_QX === 'true'
						uni.setStorageSync('switchHER', this.switchHER)
					}
					// 第二套：情绪测量
					if (row.emotionStarttime != null && row.emotionStarttime !== '') {
						this.timeEmotion1 = this.normalizeTimePicker(String(row.emotionStarttime))
						uni.setStorageSync('starttime_emotion', this.timeEmotion1)
					}
					if (row.emotionEndtime != null && row.emotionEndtime !== '') {
						this.timeEmotion2 = this.normalizeTimePicker(String(row.emotionEndtime))
						uni.setStorageSync('endtime_emotion', this.timeEmotion2)
					}
					if (row.emotionIntervalMinute != null && row.emotionIntervalMinute !== '') {
						const n = Number(row.emotionIntervalMinute)
						let ix = INTERVAL_MINUTES.indexOf(n)
						if (ix < 0) ix = 0
						this.indexEmotion = ix
						uni.setStorageSync('Interval_time_emotion', this.indexEmotion)
					}
					if (row.SWITCH_EMOTION !== undefined) {
						this.switchEmotion = row.SWITCH_EMOTION === true || row.SWITCH_EMOTION === 'true'
						uni.setStorageSync('switchEmotionHER', this.switchEmotion)
					}
					this.$forceUpdate()
				})
			},
			/** 解析云端 QX_DATA 的 data 串（无引号 JSON 风格，与 formatDatacard 一致） */
			parseQxDataRow(dataStr) {
				if (!dataStr || typeof dataStr !== 'string') return null
				try {
					let objStr = dataStr.trim()
					if (!objStr.startsWith('{')) objStr = '{' + objStr
					if (!objStr.endsWith('}')) objStr = objStr + '}'
					const fixed = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (m, k, v) => {
						v = v.trim()
						if (v === 'true' || v === 'false') return `"${k}":${v}`
						if (!isNaN(v) && v !== '' && !v.includes('/') && !v.includes(':')) return `"${k}":${v}`
						return `"${k}":"${v}"`
					})
					return JSON.parse(fixed)
				} catch (e) {
					console.error('parseQxDataRow', e)
					return null
				}
			},
			/** 转为 HH:mm，供 picker mode="time" */
			normalizeTimePicker(t) {
				const parts = String(t).split(':')
				if (parts.length < 2) return this.getCurrentTime()
				const h = parseInt(parts[0], 10)
				const m = parseInt(parts[1], 10)
				if (Number.isNaN(h) || Number.isNaN(m)) return this.getCurrentTime()
				const hh = String(Math.min(23, Math.max(0, h))).padStart(2, '0')
				const mm = String(Math.min(59, Math.max(0, m))).padStart(2, '0')
				return `${hh}:${mm}`
			},

			// 获取当前时间（格式：HH:mm）
			getCurrentTime() {
				const now = new Date()
				const hours = now.getHours().toString().padStart(2, '0')
				const minutes = now.getMinutes().toString().padStart(2, '0')
				return `${hours}:${minutes}`
			},

			// 获取当前时间加60分钟
			getCurrentTimePlusHour() {
				const now = new Date()
				now.setMinutes(now.getMinutes() + 60)
				const hours = now.getHours().toString().padStart(2, '0')
				const minutes = now.getMinutes().toString().padStart(2, '0')
				return `${hours}:${minutes}`
			},
			timeToMinutes(timeStr) {
				if (!timeStr || typeof timeStr !== 'string') return NaN
				const parts = timeStr.split(':')
				if (parts.length < 2) return NaN
				const h = parseInt(parts[0], 10)
				const m = parseInt(parts[1], 10)
				if (Number.isNaN(h) || Number.isNaN(m)) return NaN
				if (h < 0 || h > 23 || m < 0 || m > 59) return NaN
				return h * 60 + m
			},
			validateScheduleWindow(t1, t2) {
				const DAY = 24 * 60
				const s = this.timeToMinutes(t1)
				const e = this.timeToMinutes(t2)
				if (Number.isNaN(s) || Number.isNaN(e)) {
					return {
						ok: false,
						msg: this.$t('结束须晚于开始')
					}
				}
				if (e === s) {
					return {
						ok: false,
						msg: this.$t('结束须晚于开始')
					}
				}
				const spanMin = e > s ? (e - s) : (DAY - s + e)
				if (spanMin > DAY || spanMin <= 0) {
					return {
						ok: false,
						msg: this.$t('时段不超过24小时')
					}
				}
				return {
					ok: true
				}
			},
			/** 保存前校验：只校验当前入口正在编辑的开关 */
			validateBeforeSave() {
				if (this.isSensorlessMode && this.switchHER) {
					const w = this.validateScheduleWindow(this.time1, this.time2)
					if (!w.ok) {
						return {
							ok: false,
							msg: this.$t('无感测量开关') + ': ' + w.msg
						}
					}
				}
				if (this.isEmotionMode && this.switchEmotion) {
					const w = this.validateScheduleWindow(this.timeEmotion1, this.timeEmotion2)
					if (!w.ok) {
						return {
							ok: false,
							msg: this.$t('情绪测量开关') + ': ' + w.msg
						}
					}
				}
				return {
					ok: true
				}
			},
			/** 保存成功后：任一开关打开则启动全局槽位调度（重合槽位只发一次） */
			async afterQxSavedStartBleSchedule() {
				stopGlobalQxBleAlignedSchedule()
				if (!this.isAnyScheduleOn()) return
				// 调度前确认两套已开启时段均合法（另一套用本地已存值）
				if (this.switchHER) {
					const w = this.validateScheduleWindow(this.time1, this.time2)
					if (!w.ok) return
				}
				if (this.switchEmotion) {
					const w = this.validateScheduleWindow(this.timeEmotion1, this.timeEmotion2)
					if (!w.ok) return
				}
				const deviceId = await ensureQxEmotionBindingReady(true)
				if (!deviceId) {
					uni.showToast({
						title: this.$t('请检查设备连接'),
						icon: 'none'
					})
					return
				}
				startGlobalQxBleAlignedSchedule()
			},

			bindTimeChange_1(e) {
				const next = e.detail.value
				const v = this.validateScheduleWindow(next, this.time2)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
				this.time1 = next
				uni.setStorageSync('starttime', this.time1)
			},
			bindTimeChange_2(e) {
				const next = e.detail.value
				const v = this.validateScheduleWindow(this.time1, next)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
				this.time2 = next
				uni.setStorageSync('endtime', this.time2)
			},
			Interval_time(e) {
				this.index1 = e.detail.value
				uni.setStorageSync('Interval_time', this.index1)
				const v = this.validateScheduleWindow(this.time1, this.time2)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
				}
			},
			bindEmotionTimeChange_1(e) {
				const next = e.detail.value
				const v = this.validateScheduleWindow(next, this.timeEmotion2)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
				this.timeEmotion1 = next
				uni.setStorageSync('starttime_emotion', this.timeEmotion1)
			},
			bindEmotionTimeChange_2(e) {
				const next = e.detail.value
				const v = this.validateScheduleWindow(this.timeEmotion1, next)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
					return
				}
				this.timeEmotion2 = next
				uni.setStorageSync('endtime_emotion', this.timeEmotion2)
			},
			Interval_time_emotion(e) {
				this.indexEmotion = e.detail.value
				uni.setStorageSync('Interval_time_emotion', this.indexEmotion)
				const v = this.validateScheduleWindow(this.timeEmotion1, this.timeEmotion2)
				if (!v.ok) {
					uni.showToast({
						title: v.msg,
						icon: 'none'
					})
				}
			},

			getStatusColor(status) {
				return {
					color: status === this.$t('请选择') ? 'gray' : 'black'
				};
			},

			switch1ChangeHER(e) {
				this.switchHER = e.detail.value
				uni.setStorageSync('switchHER', this.switchHER)
				this.$forceUpdate()
			},
			switchEmotionChange(e) {
				this.switchEmotion = e.detail.value
				uni.setStorageSync('switchEmotionHER', this.switchEmotion)
				this.$forceUpdate()
			},

			clickset() {
				const that = this
				const anyOn = that.isAnyScheduleOn()
				console.log('clickset', {
					scheduleMode: that.scheduleMode,
					switchHER: that.switchHER,
					switchEmotion: that.switchEmotion
				})
				if (anyOn) {
					try {
						enableAudioKeepAlive(true)
					} catch (e) {}
					try {
						enableLocationKeepAlive(true)
					} catch (e) {}
					try {
						uni.$emit('qx:keepalive:start')
					} catch (e) {}
					const w = that.validateBeforeSave()
					if (!w.ok) {
						uni.showToast({
							title: w.msg,
							icon: 'none'
						})
						return
					}
					that.saveQXData()
				} else {
					try {
						enableAudioKeepAlive(false)
					} catch (e) {}
					try {
						enableLocationKeepAlive(false)
					} catch (e) {}
					try {
						uni.$emit('qx:keepalive:stop')
					} catch (e) {}
					that.saveQXData()
				}
			},

			// 定时测量配置同步云端（始终带上两套字段，避免分开保存时覆盖另一套）
			saveQXData() {
				const postData = {
					starttime: this.time1,
					endtime: this.time2,
					intervalMinute: INTERVAL_MINUTES[this.index1] ?? 10,
					SWITCH_QX: this.switchHER,
					emotionStarttime: this.timeEmotion1,
					emotionEndtime: this.timeEmotion2,
					emotionIntervalMinute: INTERVAL_MINUTES[this.indexEmotion] ?? 10,
					SWITCH_EMOTION: this.switchEmotion
				}
				const editData = {
					dataType: 'QX_DATA',
					data: this.formatDatacard([postData])
				}
				console.log('editData', editData)
				this.$post(this.$url_APP_IP + '/prod-api/device/data/editData', editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: this.$t('保存成功'),
							icon: 'none'
						})
						if (!this.isAnyScheduleOn()) {
							uni.removeStorageSync('sendwatch')
						}
						this.afterQxSavedStartBleSchedule()
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/main/Main'
							})
						}, 1000)
					} else {
						uni.showToast({
							title: this.$t('失败'),
							icon: 'none'
						})
					}
				})
			},
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(',')
			},

		}
	}
</script>

<style>
	.popup_bg {
		padding: 20px;
		width: 50vw;
		margin-left: 20px;
		margin-right: 20px;
		background: white;
		border-radius: 20px;
	}

	.select_text {
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
	}

	.context_btn1 {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		height: 56px;
		padding: 0 20px;

	}

	.picker-wrap {
		display: flex;
		justify-content: center;
		border: 1rpx solid #ddd;
		border-radius: 12rpx;
		padding: 12rpx 24rpx;
		min-width: 180rpx;
		align-items: center;
		background: white;
	}

	.context_btn2 {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 56px;
		padding: 0 20px;

	}

	.context_title1 {
		display: flex;
		flex: 1;
		font-size: 16px;
		color: black;
	}

	.timer-item {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		margin-left: 10px;
		margin-right: 10px;
		border: 1rpx solid #eee;
		border-radius: 16rpx;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: #fafafa;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.sending-status {
		display: flex;
		align-items: center;
		margin-left: 16rpx;
		padding: 4rpx 16rpx;
		background: linear-gradient(135deg, #fff3e0 0%, #ffe6cc 100%);
		border-radius: 24rpx;
	}

	.sending-text {
		color: #ff6600;
		font-size: 24rpx;
		font-weight: 500;
		margin-right: 8rpx;
	}

	.sending-icon-animate {
		color: #ff6600;
		font-size: 28rpx;
		display: inline-block;
		animation: rotate 1s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.bt_BG {
		width: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-left: 20px;
		margin-right: 20px;
		margin-top: 20px;
		padding: 20px;
		background: white;
		border-radius: 20px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.text {
		font-size: 16px;
		font-weight: 400;
	}

	.date_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 16px;
	}

	.buttonstyle {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin-top: 40px;
		margin-left: 20px;
		margin-right: 20px;
		background: #3298F7;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border-radius: 50px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.buttonstyle_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 48px;
		margin-top: 40px;
		margin-left: 20px;
		margin-right: 20px;
		background: red;
		color: white;
		font-size: 16px;
		font-weight: 600;
		border-radius: 50px;
	}

	.path-tip {
		margin: 20px;
		color: #3298F7;
		font-size: 14px;
		line-height: 1.6;
		background: white;
		padding: 15px;
		border-radius: 15px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		text-decoration: underline;
		text-decoration-color: #3298F7;
		font-style: italic;
		white-space: pre-line;
	}

	.battery-hint {
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
		padding: 24rpx 32rpx;
		z-index: 1;
	}

	.battery-hint text {
		font-size: 26rpx;
		line-height: 1.6;
		color: red;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		text-decoration: underline;
		text-decoration-color: red;
		font-style: italic;
	}
</style>
