<template>
	<view class="page">
		<view class="notice">{{ notice }}</view>
		<view v-if="pluginVersion" class="version">{{ $t('插件') }} {{ pluginVersion.pluginVersion || '?' }} / {{ $t('算法') }} {{ pluginVersion.sdkVersion || '?' }}</view>
		<view v-if="failureResult" class="failure">
			<view>{{ $t('本次扫描未成功，未生成健康记录') }}</view>
			<view>{{ failureNote }}</view>
			<image v-if="failurePhotoSrc" :src="failurePhotoSrc" mode="widthFix" class="failure-photo" />
			<button @click="copyDiagnostic">{{ $t('复制诊断JSON') }}</button>
		</view>
		<view v-if="candidate" class="confirmation">
			<view class="title">{{ $t('请核对血压计读数') }}</view>
			<label>{{ $t('收缩压') }}<input type="digit" v-model="editing.systolic" :disabled="submitting" /></label>
			<label>{{ $t('舒张压') }}<input type="digit" v-model="editing.diastolic" :disabled="submitting" /></label>
			<label>{{ $t('脉搏') }}<input type="number" v-model="editing.pulse" :disabled="submitting" /></label>
			<picker :range="units" :disabled="submitting" @change="onUnitChange">
				<view class="unit">{{ $t('压力单位') }}：{{ editing.unit || $t('请选择') }}</view>
			</picker>
			<view class="warning">{{ unitNote }}</view>
			<view class="actions">
				<button type="primary" :disabled="submitting" @click="confirm">{{ confirmButtonText }}</button>
				<button :disabled="submitting || opening" @click="rescan">{{ $t('重新扫描') }}</button>
			</view>
		</view>
		<view class="actions">
			<button :disabled="opening || submitting" @click="rescan">{{ opening ? $t('正在扫描') : $t('打开扫描') }}</button>
			<button :disabled="opening || submitting" @click="choosePhoto">{{ $t('从相册识别') }}</button>
		</view>
	</view>
</template>

<script>
	import { createBPReader } from './bp-reader.js'
	import { createLiveController } from './bp-live-controller.js'
	import { setPendingLiveResult } from './bp-live-handoff.js'
	import { createBPReaderUsage } from '../../api/bpReaderUsage.js'
	import { createBPReaderExpiry } from '../../api/bpReaderExpiry.js'
	import { ensureReaderDevice } from '../../api/bpReaderDevice.js'
	import { getLocalTimeAllJSON } from '../../api/unitls/timezone.js'

	const KPA_PER_MMHG = 0.1333224
	const TRACE_KEY = 'bp_live_scan_traces'

	export default {
		data() {
			return {
				opening: false,
				submitting: false,
				notice: '',
				candidate: null,
				editing: {
					systolic: '',
					diastolic: '',
					pulse: '',
					unit: ''
				},
				units: ['mmHg', 'kPa'],
				pluginVersion: null,
				failureResult: null,
				confirmCountdown: 0
			}
		},
		computed: {
			failureNote() {
				const result = this.failureResult || {}
				if (result.photoStatus === 'saved') return this.$t('已在本机保存一张失败诊断帧')
				if (result.photoStatus === 'failed') return this.$t('失败图保存失败：') + (result.failurePhotoError || this.$t('请检查存储空间'))
				if (result.photoStatus === 'not_available') return this.$t('尚未取得有效帧，未保存照片')
				return this.$t('未保存照片')
			},
			failurePhotoSrc() {
				const result = this.failureResult || {}
				if (result.photoStatus !== 'saved' || !result.photoPath) return ''
				return result.photoPath.indexOf('file:') === 0 ? result.photoPath : 'file://' + result.photoPath
			},
			unitNote() {
				if (this.candidate && this.candidate.unitStatus === 'recognized') {
					return this.$t('单位由画面识别，仍请核对全部读数')
				}
				return this.$t('单位未可靠识别，请核对血压计上的单位后选择')
			},
			confirmButtonText() {
				if (this.submitting) return this.$t('正在上报')
				if (this.confirmCountdown > 0) return this.$t('确认') + ' ' + this.confirmCountdown + 's'
				return this.$t('确认')
			}
		},
		onLoad(options) {
			this._fromReader = options && options.from === 'reader'
			this.pageAlive = true
			this._disposed = false
			this._accessReady = false
			this._pageReady = false
			this.photoEpoch = 0
			this._firstScanSyncPromise = null
			this._liveScanSupported = this.nativeLiveScanSupported()
			this.notice = this._liveScanSupported ?
				this.$t('请在完成测量后对准血压计屏幕') :
				this.$t('当前基座不支持原生实时扫描')
			uni.setNavigationBarTitle({
				title: this.$t('血压实时扫描')
			})
			this.reader = createBPReader()
			this.live = createLiveController(this.reader, (state) => {
				console.log('[BPLiveScan] state', state && state.type, 'pageAlive=' + this.pageAlive)
				if (!this.pageAlive) return
				try {
					this.opening = state.type === 'opening'
					if (state.type === 'opening') {
						this.notice = this.$t('请在完成测量后对准血压计屏幕')
						this.ensureFirstScan()
						return
					}
					if (state.type === 'recognized') {
						this.failureResult = null
						this.clearConfirmCountdown()
						this.finishRecognized(state.result)
						return
					}
					if (state.type === 'cancelled') {
						this.failureResult = null
						this.clearConfirmCountdown()
						uni.navigateBack({
							delta: 1
						})
						return
					}
					this.failureResult = state.result || null
					this.notice = this.liveErrorText(state)
				} catch (error) {
					console.error('[BPLiveScan] state handler failed', error && (error.stack || error.message) || error)
				}
			})
			this._readerUsage = createBPReaderUsage({
				baseUrl: this.$url_APP_IP,
				get: (...args) => this.$get(...args),
				post: (...args) => this.$post(...args),
				storage: uni
			})
			this._readerExpiry = createBPReaderExpiry({
				baseUrl: this.$url_APP_IP,
				get: (...args) => this.$get(...args),
				post: (...args) => this.$post(...args),
				storage: uni
			})
			try {
				this.reader.getVersion(version => {
					if (this.pageAlive) this.pluginVersion = version
				})
			} catch (error) {}
			this.prepareAccess()
		},
		onReady() {
			// 原生扫描界面打开也会触发 onHide，不能在 onHide 里取消。
			console.log('[BPLiveScan] onReady')
			this._pageReady = true
			this.maybeStart()
		},
		onShow() {
			console.log('[BPLiveScan] onShow opening=' + this.opening)
		},
		onHide() {
			console.log('[BPLiveScan] onHide opening=' + this.opening + '，原生界面打开导致的隐藏不取消扫描')
		},
		onUnload() {
			console.log('[BPLiveScan] onUnload opening=' + this.opening)
			this.pageAlive = false
			this._disposed = true
			this.photoEpoch++
			this.clearConfirmCountdown()
			if (this.live) this.live.dispose()
		},
		onBackPress() {
			if (this.submitting) return true
		},
		methods: {
			async prepareAccess() {
				try {
					await this._readerUsage.check()
					if (!this.pageAlive) return
					this._accessReady = true
					this.maybeStart()
				} catch (error) {
					console.warn('[BPLiveScan] usage check failed', error)
					if (!this.pageAlive) return
					this.opening = false
					this.notice = this.$t('无法检查设备绑定或识别次数，请检查网络后重试。')
					uni.showToast({
						title: this.notice,
						icon: 'none'
					})
				}
			},
			nativeLiveScanSupported() {
				try {
					const plugin = uni.requireNativePlugin('Jakob-BPReader')
					return !!(plugin && typeof plugin.startLiveScan === 'function')
				} catch (error) {
					return false
				}
			},
			maybeStart() {
				if (!this._liveScanSupported || !this._accessReady || !this._pageReady || !this.pageAlive || this.candidate || this.opening) return
				this.rescan()
			},
			ensureFirstScan() {
				if (this._firstScanSyncPromise || !this._readerExpiry) return
				this._firstScanSyncPromise = this._readerExpiry.recordFirstScan(new Date()).catch(error => {
					console.warn('[BPLiveScan] first scan sync pending', error)
				})
			},
			liveErrorText(state) {
				const code = state.result && state.result.errorCode
				if (code === 'E_SCAN_TIMEOUT') return this.$t('扫描超时，未找到可靠读数')
				const message = state.message || (state.result && state.result.errorMessage) || ''
				if (message.indexOf('不支持原生实时扫描') >= 0) return this.$t('当前基座不支持原生实时扫描')
				if (state.type === 'cancelled') return this.$t('扫描已取消')
				return message || this.$t('扫描失败，请重试')
			},
			scanPrompts() {
				return {
					placeInFrame: this.$t('请将血压计屏幕完整放入绿色框内'),
					focusing: this.$t('正在对焦…'),
					tooDark: this.$t('光线偏暗，请补充光线'),
					holdSteady: this.$t('请对准屏幕并保持稳定'),
					aimAgain: this.$t('请重新对准血压计屏幕'),
					searching: this.$t('正在寻找清晰、稳定的读数…'),
					readValue: this.$t('已读取：%@'),
					reviewing: this.$t('请保持稳定，正在复核：%@'),
					timeout: this.$t('扫描超时，未找到可靠读数'),
					paused: this.$t('扫描已暂停'),
					holdStill: this.$t('请保持稳定'),
					cameraInterrupted: this.$t('相机暂被系统占用，等待恢复'),
					savingFailure: this.$t('正在后台保存一张失败诊断图…'),
					scanFailed: this.$t('扫描失败，请重试'),
					cancelled: this.$t('扫描已取消'),
					pause: this.$t('暂停扫描'),
					resume: this.$t('继续扫描'),
					manualFailure: this.$t('无法识别，保存失败图'),
					manualFailureMessage: this.$t('本次扫描未成功，已结束识别'),
					cameraPermission: this.$t('需要相机权限才能实时扫描')
				}
			},
			accept(result) {
				this.failureResult = null
				this.candidate = result
				const readings = result.readings || {}
				this.editing = {
					systolic: readings.systolic == null ? '' : String(readings.systolic),
					diastolic: readings.diastolic == null ? '' : String(readings.diastolic),
					pulse: readings.pulse == null ? '' : String(readings.pulse),
					unit: result.unit || ''
				}
				this.notice = this.$t('请逐项核对确认后才提交')
				this.startConfirmCountdown()
			},
			finishRecognized(result) {
				if (this._fromReader) {
					const channel = this.getOpenerEventChannel && this.getOpenerEventChannel()
					if (channel && channel.emit) channel.emit('liveRecognized', result)
					uni.navigateBack({
						delta: 1
					})
					return
				}
				setPendingLiveResult(result)
				uni.redirectTo({
					url: '/pages/tabBar/main/BPReader',
					fail: () => {
						uni.navigateTo({
							url: '/pages/tabBar/main/BPReader'
						})
					}
				})
			},
			clearConfirmCountdown() {
				if (this._confirmTimer) clearInterval(this._confirmTimer)
				this._confirmTimer = null
				this.confirmCountdown = 0
			},
			startConfirmCountdown() {
				this.clearConfirmCountdown()
				const candidate = this.candidate || {}
				const recognizedKpa = candidate.unitStatus === 'recognized' && candidate.unit === 'kPa'
				const unrecognized = candidate.unitStatus !== 'recognized'
				if ((!recognizedKpa && !unrecognized) || this.submitting || !this.pageAlive) return
				this.confirmCountdown = 10
				this._confirmTimer = setInterval(() => {
					if (!this.pageAlive || this.submitting || !this.candidate) {
						this.clearConfirmCountdown()
						return
					}
					if (this.confirmCountdown <= 1) {
						this.clearConfirmCountdown()
						this.confirm()
						return
					}
					this.confirmCountdown -= 1
				}, 1000)
			},
			rescan() {
				this.clearConfirmCountdown()
				if (this.opening || this.submitting || !this.live) return
				if (!this._liveScanSupported) {
					this.notice = this.$t('当前基座不支持原生实时扫描')
					uni.showToast({
						title: this.notice,
						icon: 'none',
						duration: 3000
					})
					return
				}
				if (!this._accessReady) {
					this.prepareAccess()
					return
				}
				this.photoEpoch++
				this.candidate = null
				this.failureResult = null
				this.live.start(null, {
					scanTimeoutMs: 30000,
					prompts: this.scanPrompts()
				})
			},
			copyDiagnostic() {
				uni.setClipboardData({
					data: JSON.stringify({
						version: this.pluginVersion,
						result: this.failureResult
					}, null, 2)
				})
			},
			choosePhoto() {
				this.clearConfirmCountdown()
				if (this.opening || this.submitting) return
				if (!this._accessReady) {
					this.prepareAccess()
					return
				}
				const token = ++this.photoEpoch
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album'],
					success: (photos) => {
						if (!this.pageAlive || token !== this.photoEpoch) return
						const path = photos.tempFilePaths && photos.tempFilePaths[0]
						if (!path) return
						this.opening = true
						this.candidate = null
						this.failureResult = null
						this.notice = this.$t('正在识别照片')
						this.ensureFirstScan()
						try {
							this.reader.recognize({
								imagePath: path,
								savePhoto: false
							}, (result) => {
								if (!this.pageAlive || token !== this.photoEpoch || result.phase !== 'complete') return
								this.opening = false
								if (result.recognitionStatus === 'recognized') this.accept(result)
								else this.notice = result.errorMessage || this.$t('未识别到完整读数，请重试')
							})
						} catch (error) {
							this.opening = false
							this.notice = error.message
						}
					}
				})
			},
			onUnitChange(event) {
				if (this.submitting) return
				const unit = this.units[Number(event.detail.value)]
				if (unit) this.editing.unit = unit
			},
			parsePressure(value, unit) {
				const text = String(value == null ? '' : value).trim()
				const pattern = unit === 'kPa' ? /^\d{1,3}(\.\d{1,2})?$/ : /^\d{1,3}$/
				if (!pattern.test(text) || Number(text) <= 0) return null
				return Number(text)
			},
			shouldUploadAsKpa(systolic, diastolic) {
				const candidate = this.candidate || {}
				if (candidate.unitStatus === 'recognized' && candidate.unit === 'mmHg') return false
				if (candidate.unitStatus === 'recognized' && candidate.unit === 'kPa') return true
				if (Number.isFinite(systolic) && Number.isFinite(diastolic)) {
					if (systolic < 30 && diastolic < 30) return true
					if (systolic > 30 && diastolic > 30) return false
				}
				return null
			},
			buildUpload() {
				const systolicText = String(this.editing.systolic == null ? '' : this.editing.systolic).trim()
				const diastolicText = String(this.editing.diastolic == null ? '' : this.editing.diastolic).trim()
				const systolicGuess = Number(systolicText)
				const diastolicGuess = Number(diastolicText)
				const asKpa = this.shouldUploadAsKpa(systolicGuess, diastolicGuess)
				const unit = asKpa === null ? this.editing.unit : (asKpa ? 'kPa' : 'mmHg')
				if (this.units.indexOf(unit) < 0) return { error: this.$t('请先选择血压单位。') }
				const systolic = this.parsePressure(this.editing.systolic, unit)
				const diastolic = this.parsePressure(this.editing.diastolic, unit)
				const pulseText = String(this.editing.pulse == null ? '' : this.editing.pulse).trim()
				if (systolic == null || diastolic == null || !/^\d{1,3}$/.test(pulseText) || Number(pulseText) <= 0) {
					return { error: this.$t('请检查读数和单位') }
				}
				const pulse = Number(pulseText)
				if (systolic <= diastolic) return { error: this.$t('收缩压应大于舒张压，请对照照片核对。') }
				const upload = {
					systolic,
					diastolic,
					pulse,
					unit: 'mmHg'
				}
				if (asKpa === true || (asKpa === null && unit === 'kPa')) {
					upload.systolic = Math.round(systolic / KPA_PER_MMHG)
					upload.diastolic = Math.round(diastolic / KPA_PER_MMHG)
				}
				if (upload.diastolic <= 0 || upload.systolic <= upload.diastolic) {
					return { error: this.$t('换算后的血压数值无效，请对照照片核对。') }
				}
				return {
					systolic,
					diastolic,
					pulse,
					unit,
					upload
				}
			},
			async confirm() {
				this.clearConfirmCountdown()
				if (this.submitting || !this.candidate) return
				const parsed = this.buildUpload()
				if (parsed.error) {
					uni.showToast({
						title: parsed.error,
						icon: 'none',
						duration: 3000
					})
					return
				}
				const original = this.candidate.readings || {}
				const corrected = Number(original.systolic) !== parsed.systolic ||
					Number(original.diastolic) !== parsed.diastolic ||
					Number(original.pulse) !== parsed.pulse ||
					(this.candidate.unit || '') !== parsed.unit
				this.submitting = true
				try {
					await this._readerUsage.check()
				} catch (error) {
					this.submitting = false
					uni.showToast({
						title: this.$t('无法检查设备绑定或识别次数，请检查网络后重试。'),
						icon: 'none'
					})
					return
				}
				if (this._disposed) return
				let data
				try {
					data = await this.pressureData({
						sys: String(parsed.upload.systolic),
						dia: String(parsed.upload.diastolic),
						pul: String(parsed.upload.pulse)
					})
				} catch (error) {
					console.error('[BPLiveScan] pressure_data error', error)
					if (!this._disposed) {
						uni.showToast({
							title: this.$t('上报失败，请检查网络后重试。'),
							icon: 'none',
							duration: 3000
						})
					}
					this.submitting = false
					return
				}
				const trace = {
					corrected,
					candidate: {
						readings: {
							systolic: original.systolic,
							diastolic: original.diastolic,
							pulse: original.pulse
						},
						unit: this.candidate.unit || null,
						unitStatus: this.candidate.unitStatus || null,
						unitSource: this.candidate.unitSource || null,
						captureId: this.candidate.captureId || null
					},
					final: {
						systolic: parsed.systolic,
						diastolic: parsed.diastolic,
						pulse: parsed.pulse,
						unit: parsed.unit
					},
					upload: parsed.upload,
					unitStatus: this.candidate.unitStatus || null,
					unitSource: this.candidate.unitSource || null,
					pluginVersion: this.pluginVersion,
					savedAt: Date.now()
				}
				console.log('[BPLiveScan] confirmed', trace)
				this.saveTrace(trace)
				let usageResult
				try {
					usageResult = await this._readerUsage.recordSuccess()
				} finally {
					this.submitting = false
				}
				try {
					uni.setStorageSync('lowPressure', data.slaveData.lowPressure)
					uni.setStorageSync('highPressure', data.slaveData.highPressure)
					uni.setStorageSync('pulse', data.slaveData.heartrate)
					this.$store.commit('setbanhua', 1)
					const channel = this.getOpenerEventChannel && this.getOpenerEventChannel()
					if (channel && channel.emit) channel.emit('bpReaderReported', data)
				} catch (error) {
					console.warn(this.$t('血压已上报，首页刷新失败:'), error)
				}
				if (this._disposed) return
				this.candidate = null
				uni.showToast({
					title: usageResult && usageResult.syncFailed ?
						this.$t('上报成功，识别次数待同步，请联网后重试。') : this.$t('上报成功'),
					icon: 'none'
				})
				setTimeout(() => {
					if (!this._disposed) uni.navigateBack({ delta: 1 })
				}, 400)
			},
			saveTrace(trace) {
				try {
					const current = uni.getStorageSync(TRACE_KEY)
					const list = Array.isArray(current) ? current : []
					list.push(trace)
					uni.setStorageSync(TRACE_KEY, list.slice(-20))
				} catch (error) {
					console.warn('[BPLiveScan] trace save failed', error)
				}
			},
			UTCdatatime() {
				const timestampMs = Date.now()
				return {
					timestampMs,
					timestampSec: Math.floor(timestampMs / 1000)
				}
			},
			async pressureData(parsedData) {
				const device = await ensureReaderDevice(this)
				const measurement = this.UTCdatatime()
				const data = {
					deviceSn: device.deviceSn,
					slaveSn: '0',
					slaveData: {
						lowPressure: parsedData.dia.trim(),
						highPressure: parsedData.sys.trim(),
						heartrate: parsedData.pul.trim()
					},
					time: measurement.timestampSec,
					measurementTs: measurement.timestampSec,
					measurementTimezone: getLocalTimeAllJSON(new Date(measurement.timestampMs)).YMDHMS
				}
				const response = await this.$post(this.$url_APP_IP + this.$url_pressure_data, data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				})
				if (!response || response.code !== 200) throw new Error(this.$t('血压上报失败'))
				return data
			}
		}
	}
</script>

<style scoped>
	.page {
		padding: 24rpx;
		background: #f6f7f8;
		min-height: 100vh;
		box-sizing: border-box;
		color: #222222;
	}

	.notice {
		padding: 24rpx 0;
		line-height: 1.6;
		word-break: break-word;
	}

	.confirmation {
		background: #ffffff;
		padding: 24rpx;
		border: 1px solid #dddddd;
		border-radius: 8rpx;
	}

	.title {
		font-size: 34rpx;
		font-weight: 600;
		margin-bottom: 24rpx;
	}

	.version {
		font-size: 24rpx;
		color: #666666;
	}

	.failure {
		background: #fff4e5;
		padding: 20rpx;
		margin-bottom: 20rpx;
		line-height: 1.7;
	}

	.failure-photo {
		width: 100%;
	}

	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1px solid #eeeeee;
	}

	input {
		width: 200rpx;
		text-align: right;
		font-size: 36rpx;
		height: 60rpx;
	}

	.unit {
		padding: 24rpx 0;
	}

	.warning {
		color: #8a4800;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 24rpx;
	}

	.actions button {
		flex: 1;
		min-width: 220rpx;
		font-size: 28rpx;
	}
</style>
