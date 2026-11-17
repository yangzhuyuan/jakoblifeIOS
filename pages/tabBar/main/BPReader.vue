<template>
	<view class="reader-page">
		<view class="hero">
			<view class="hero-copy">
				<view class="hero-title">{{ $t("扫描您的血压读数") }}</view>
				<view class="hero-desc">{{ $t("自动采集血压计屏幕上的收缩压、舒张压和脉搏。") }}</view>
			</view>
			<view class="hero-art">
				<image class="hero-photo" src="/static/page_icon/bp_scan_hero.jpg" mode="aspectFill"></image>
			</view>
		</view>

		<view class="photo-card">
			<view class="steps">
				<view class="step" :class="{ active: !imagePath }"><text class="step-number">1</text>{{ $t("采集") }}
				</view>
				<view class="step-line"></view>
				<view class="step" :class="{ active: imagePath && !hasReadings }"><text
						class="step-number">2</text>{{ $t("识别") }}
				</view>
				<view class="step-line"></view>
				<view class="step" :class="{ active: hasReadings }"><text class="step-number">3</text>{{ $t("步骤核对") }}
				</view>
			</view>

			<view v-if="imagePath" class="photo-preview" @click="previewPhoto">
				<image :src="imagePath" class="selected-photo" mode="aspectFit"></image>
				<view v-if="recognizing" class="recognizing-overlay">
					<view class="spinner"></view>
					<text>{{ $t("正在识别照片…") }}</text>
				</view>
			</view>
			<view v-if="imagePath" class="photo-zoom-hint">{{ $t("点击照片可放大") }}</view>
			<view v-else class="guide-panel">
				<view class="guide-main">
					<view class="scan-frame">
						<view class="corner top-left"></view>
						<view class="corner top-right"></view>
						<view class="corner bottom-left"></view>
						<view class="corner bottom-right"></view>
						<image class="monitor-photo" src="/static/image/saomiao.jpg" mode="aspectFit"></image>
					</view>
					<view class="guide-copy">
						<view class="guide-title">{{ $t("扫描您的血压计") }}</view>
						<view class="guide-desc">{{ $t("将血压计屏幕对准框内并保持稳定。") }}</view>
						<view class="hint-row">
							<view class="hint">
								<view class="hint-icon">
									<view class="sun-core"></view>
								</view>
								<text class="hint-label">{{ $t("光线充足") }}</text>
							</view>
							<view class="hint-split"></view>
							<view class="hint">
								<view class="hint-icon">
									<image class="hint-glyph" src="/static/page_icon/bp_hint_no_glare.png"
										mode="aspectFit"></image>
								</view>
								<text class="hint-label">{{ $t("避免反光") }}</text>
							</view>
							<view class="hint-split"></view>
							<view class="hint">
								<view class="hint-icon display">
									<view class="display-screen"></view>
									<view class="display-stand"></view>
								</view>
								<text class="hint-label">{{ $t("完整屏幕") }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<button class="action-button primary scan-now" :disabled="busy || awaitingReport" @click="openLiveScan">
				<uni-icons type="scan" size="18" color="#FFFFFF"></uni-icons>
				<text>{{ $t("立即扫描") }}</text>
			</button>
			<view class="source-actions">
				<button class="action-button secondary" :disabled="busy || awaitingReport"
					@click="choosePhoto('camera')">
					<uni-icons type="camera-filled" size="18" color="#2F7CF6"></uni-icons>
					<text>{{ imagePath ? $t("重新拍照") : $t("拍照") }}</text>
				</button>
				<button class="action-button secondary" :disabled="busy || awaitingReport"
					@click="choosePhoto('album')">
					<uni-icons type="image" size="18" color="#2F7CF6"></uni-icons>
					<text>{{ $t("选择照片") }}</text>
				</button>
			</view>
			<view class="photo-requirements">{{ $t("仅支持 JPEG / PNG，不超过 30MB、2400 万像素") }}</view>
		</view>

		<view v-if="availabilityMessage || errorMessage" class="message-panel">
			<uni-icons type="info" size="20" color="#BD7628"></uni-icons>
			<view class="message-text">{{ availabilityMessage || errorMessage }}</view>
			<button v-if="imagePath && !availabilityMessage" class="text-button" :disabled="busy"
				@click="recognizePhoto">{{ $t("重试") }}</button>
		</view>

		<view v-if="hasReadings" class="result-card">
			<view class="card-heading">
				<view class="result-heading">
					<text class="section-title">{{ $t("本次结果") }}</text>
					<text class="result-badge" :class="{ confirmed }">{{ reported ? $t("已上报") : $t("待核对") }}</text>
				</view>
				<button v-if="!reported" class="text-button" :disabled="submitting"
					@click="openEditor">{{ $t("修改") }}</button>
			</view>
			<view class="reading-grid">
				<view class="reading-item">
					<text class="reading-label">{{ $t("收缩压") }}</text>
					<text class="reading-value">{{ displayedReadings.systolic || '—' }}</text>
					<text class="reading-unit">{{ displayedReadings.unit || 'mmHg' }}</text>
				</view>
				<view class="reading-item">
					<text class="reading-label">{{ $t("舒张压") }}</text>
					<text class="reading-value">{{ displayedReadings.diastolic || '—' }}</text>
					<text class="reading-unit">{{ displayedReadings.unit || 'mmHg' }}</text>
				</view>
				<view class="reading-item">
					<text class="reading-label">{{ $t("脉搏") }}</text>
					<text class="reading-value">{{ displayedReadings.pulse || '—' }}</text>
					<text class="reading-unit">{{ $t("次/分") }}</text>
				</view>
			</view>
			<view v-if="liveReview && !reported" class="result-note result-note-warn">{{ unitRecognitionHint }}</view>
			<view class="result-note">
				{{ reported ? $t("本次结果已按 mmHg 上报。") : (liveReview ? $t("请对照血压计核对数值和单位，确认后统一按 mmHg 上报。") : $t("请对照原图核对数值和单位，确认后统一按 mmHg 上报。")) }}
			</view>
			<view v-if="!liveReview && photoStatusMessage" class="photo-status">{{ photoStatusMessage }}</view>
			<button v-if="!reported" class="confirm-button primary" :disabled="submitting"
				@click="onReviewClick">{{ reportButtonText }}</button>
		</view>

		<view class="tips-card">
			<view class="tips-head">
				<text class="tips-bulb">💡</text>
				<text class="tips-title">{{ $t("准确扫描小贴士") }}</text>
			</view>
			<view class="tip-line">
				<view class="tip-check"><uni-icons type="checkmarkempty" size="12" color="#FFFFFF"></uni-icons></view>
				<text class="tip-text">{{ $t("将镜头正对血压计屏幕。") }}</text>
			</view>
			<view class="tip-line">
				<view class="tip-check"><uni-icons type="checkmarkempty" size="12" color="#FFFFFF"></uni-icons></view>
				<text class="tip-text">{{ $t("保持设备平稳，避免画面模糊。") }}</text>
			</view>
			<view class="tip-line">
				<view class="tip-check"><uni-icons type="checkmarkempty" size="12" color="#FFFFFF"></uni-icons></view>
				<text class="tip-text">{{ $t("确保收缩压、舒张压和脉搏（SYS、DIA、PUL）清晰可见。") }}</text>
			</view>
			<view class="tip-line">
				<view class="tip-check"><uni-icons type="checkmarkempty" size="12" color="#FFFFFF"></uni-icons></view>
				<text class="tip-text">{{ $t("保存前，请核对并确认识别到的数值和单位。") }}</text>
			</view>
		</view>
		<view class="page-footer">
			<uni-icons type="locked" size="14" color="#8D9AAD"></uni-icons>
			<text>{{ $t("照片在手机本地识别") }}</text>
		</view>

		<uni-popup ref="editor" type="center" :is-mask-click="false" @change="onEditorChange">
			<view class="editor">
				<view class="editor-heading">
					<view>
						<view class="section-title">{{ $t("核对识别结果") }}</view>
						<view class="editor-subtitle">{{ liveReview ? $t("对照血压计，可直接修改下方数值") : $t("对照照片，可直接修改下方数值") }}
						</view>
					</view>
					<button class="close-button" :disabled="submitting" :aria-label="$t('关闭识别弹窗')"
						@click="closeEditor"><uni-icons type="closeempty" size="24"
							color="#78889C"></uni-icons></button>
				</view>
				<scroll-view scroll-y class="editor-scroll">
					<view v-if="!liveReview && imagePath" class="editor-photo" @click="previewPhoto">
						<image :src="imagePath" mode="aspectFit"></image>
						<text>{{ $t("点击查看大图") }}</text>
					</view>
					<view v-if="!liveReview && photoStatusMessage" class="photo-status editor-photo-status">
						{{ photoStatusMessage }}
					</view>
					<!-- 先隐藏照片原始单位确认
					<view v-if="!form.unit">
						<view class="unit-heading">{{ $t("请先确认照片中的原始单位") }}</view>
						<view class="unit-options">
							<button v-for="unit in units" :key="unit" class="unit-option" :disabled="submitting"
								@click="confirmSourceUnit(unit)">{{ $t("照片为 {unit}", { unit }) }}</button>
						</view>
					</view>
					-->
					<view class="unit-heading">{{ $t("血压显示与编辑单位") }}</view>
					<view class="unit-options">
						<button v-for="unit in units" :key="unit" class="unit-option"
							:class="{ selected: form.unit === unit }" :disabled="submitting || !form.unit"
							@click="setUnit(unit)">{{ unit }}</button>
					</view>
					<view class="unit-hint unit-hint-warn">{{ unitRecognitionHint }}</view>
					<view class="unit-hint">{{ $t("确认照片原始单位后，切换显示单位会换算数值，上传统一使用 mmHg。") }}</view>
					<view class="field-row">
						<text class="field-label">{{ $t("收缩压") }} <text class="field-code">SYS</text></text>
						<input v-model="form.systolic" :disabled="submitting" type="digit" maxlength="6"
							:placeholder="$t('填写数值')" class="reading-input" :adjust-position="true" />
						<text class="field-unit">{{ form.unit || $t("血压识别单位") }}</text>
					</view>
					<view class="field-row">
						<text class="field-label">{{ $t("舒张压") }} <text class="field-code">DIA</text></text>
						<input v-model="form.diastolic" :disabled="submitting" type="digit" maxlength="6"
							:placeholder="$t('填写数值')" class="reading-input" :adjust-position="true" />
						<text class="field-unit">{{ form.unit || $t("血压识别单位") }}</text>
					</view>
					<view class="field-row">
						<text class="field-label">{{ $t("脉搏") }} <text class="field-code">PUL</text></text>
						<input v-model="form.pulse" :disabled="submitting" type="number" maxlength="3"
							:placeholder="$t('填写数值')" class="reading-input" :adjust-position="true" />
						<text class="field-unit">{{ $t("次/分") }}</text>
					</view>
					<view class="unit-hint" v-if="uploadPreview">{{ uploadPreview }}</view>
					<view v-if="formError" class="form-error">{{ formError }}</view>
					<view class="editor-actions">
						<button class="cancel-button" :disabled="submitting"
							@click="closeEditor">{{ $t("暂不确认") }}</button>
						<button class="save-button primary" :disabled="submitting || reported" :loading="submitting"
							@click="confirmReadings">{{ submitting ? $t("正在上报") : $t("确认并上报") }}</button>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getLocalTimeAllJSON,
	} from '../../api/unitls/timezone.js';
	import {
		createBPReaderUsage
	} from '../../api/bpReaderUsage.js';
	import {
		createBPReaderExpiry
	} from '../../api/bpReaderExpiry.js';
	import {
		ensureReaderDevice
	} from '../../api/bpReaderDevice.js';
	import {
		takePendingLiveResult
	} from './bp-live-handoff.js';
	import {
		createBPReader as createNativeBPReader
	} from './bp-reader.js';
	import {
		createLiveController
	} from './bp-live-controller.js';

	const MAX_IMAGE_BYTES = 30 * 1024 * 1024
	const MAX_IMAGE_PIXELS = 24000000
	// NIST: 1 mmHg = 0.1333224 kPa。
	const KPA_PER_MMHG = 0.1333224
	const HEIC_MESSAGE = '请先将 HEIC/HEIF 照片转换为 JPEG/PNG，或使用拍照识别重新拍摄。'

	const emptyReadings = () => ({
		systolic: '',
		diastolic: '',
		pulse: '',
		unit: ''
	})

	export default {
		data() {
			return {
				imagePath: '',
				choosing: false,
				checkingUsage: false,
				recognizing: false,
				pluginVersionInfo: null,
				photoStatus: '',
				photoPath: '',
				recordPath: '',
				hasReadings: false,
				confirmed: false,
				submitting: false,
				reported: false,
				editorVisible: false,
				availabilityMessage: '',
				errorMessage: '',
				formError: '',
				units: ['mmHg', 'kPa'],
				unitStatus: 'unknown',
				unitSource: null,
				readings: emptyReadings(),
				form: emptyReadings(),
				convertedPressure: null,
				confirmedReadings: null,
				reportCountdown: 0,
				readingSource: ''
			}
		},
		computed: {
			busy() {
				return this.checkingUsage || this.choosing || this.recognizing || this.photoStatus === 'pending' || this
					.submitting
			},
			awaitingReport() {
				return this.hasReadings && !this.reported
			},
			displayedReadings() {
				return this.confirmedReadings || this.readings
			},
			liveReview() {
				return this.readingSource === 'live'
			},
			unitRecognitionHint() {
				const unit = this.form.unit || this.readings.unit || 'mmHg'
				if (this.liveReview && this.unitStatus !== 'recognized') {
					return this.$t('未识别到单位，已按读数判断为 {unit}，倒计时结束后按 mmHg 上报。', {
						unit
					})
				}
				if (!this.liveReview && this.unitStatus !== 'recognized' && unit === 'mmHg' && this.unitSource !==
					'value_threshold') {
					return this.$t('未识别到单位，已按读数默认选择 mmHg，请核对。')
				}
				if (this.unitSource === 'value_threshold' && this.readings.unit === 'kPa') return this.$t(
					"收缩压或舒张压小于 35，已按 kPa 处理，请对照照片核对。")
				if (this.unitStatus === 'recognized' && this.readings.unit === 'mmHg') return this.$t(
					"已识别到照片单位 mmHg，请对照照片核对。")
				return this.form.unit ? this.$t("照片原始单位已确认，可切换显示单位。") : this.$t("未识别到单位，请先对照照片确认原始单位。")
			},
			uploadPreview() {
				const result = this.buildReportReadings()
				if (result.error) return ''
				return this.$t('将上报：{systolic} / {diastolic} mmHg，脉搏 {pulse} 次/分。{note}', {
					...result.upload,
					note: result.note
				})
			},
			reportButtonText() {
				if (this.submitting) return this.$t('正在上报')
				if (this.reportCountdown > 0) return this.$t('核对并上报结果') + ' ' + this.reportCountdown + 's'
				return this.$t('核对并上报结果')
			},
			photoStatusMessage() {
				const messages = {
					pending: this.$t("数值已识别，原图正在保存，可先核对结果。"),
					saved: this.$t("原图和识别记录已保存在手机本地。"),
					failed: this.$t("数值已识别，但原图保存失败，本次结果仍可核对。"),
					unknown: this.$t("数值已识别，照片保存状态未确认，本次结果仍可核对。"),
					not_requested: this.$t("本次照片未保存。"),
					not_attempted: this.$t("本次照片未保存。")
				}
				return messages[this.photoStatus] || ''
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: this.$t("血压拍照识别")
			})
			this._disposed = false
			this._requestSequence = 0
			this._activeRequestId = ''
			this._recognitionTimer = null
			this._reportTimer = null
			this._bpPlugin = null
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
			this.initializePlugin()
			const pending = takePendingLiveResult()
			if (pending) this.applyLiveResult(pending)
			if (options && options.scan === '1') this.beginNativeScan(true)
		},
		onHide() {
			// 原生扫描界面打开也会触发 onHide，不能在这里取消。
		},
		onUnload() {
			this.clearNativeScanDelay()
			this.restoreScanChrome()
			this._disposed = true
			this._activeRequestId = ''
			this.clearRecognitionTimer()
			this.clearReportCountdown()
			this._bpPlugin = null
			if (this._live) this._live.dispose()
		},
		onBackPress() {
			if (this.submitting) return true
			if (this.editorVisible) {
				this.closeEditor()
				return true
			}
		},
		methods: {
			showPurchasePrompt() {
				if (this._disposed || this._purchasePromptVisible) return
				this._purchasePromptVisible = true
				uni.hideToast()
				uni.showModal({
					title: this.$t('温馨提示'),
					content: this.$t('请购买设备，可以精确使用AI功能，进行数据分析'),
					showCancel: false,
					confirmText: this.$t('确定'),
					complete: () => {
						this._purchasePromptVisible = false
					}
				})
			},
			async checkReaderAccess() {
				this.checkingUsage = true
				try {
					const access = await this._readerUsage.check()
					if (this._disposed) return null
					// 暂时关闭 15 次免费识别限制，达到次数仍可继续扫码。
					// if (!access.allowed) {
					// 	this.showPurchasePrompt()
					// 	return null
					// }
					return access
				} catch (error) {
					console.warn('[BPReader] usage check failed', error)
					if (!this._disposed) uni.showToast({
						title: this.$t('无法检查设备绑定或识别次数，请检查网络后重试。'),
						icon: 'none'
					})
					return null
				} finally {
					this.checkingUsage = false
				}
			},
			initializePlugin() {
				// this.availabilityMessage = this.$t("照片识别请在 Android App 中使用。")
				// #ifdef APP-PLUS
				// if (uni.getSystemInfoSync().platform !== 'android') return
				try {
					const bp = uni.requireNativePlugin('Jakob-BPReader')
					if (!bp || typeof bp.recognize !== 'function' || typeof bp.getVersion !== 'function') {
						this.availabilityMessage = this.$t("当前安装包未包含照片识别功能，请使用包含识别插件的安装包。")
						return
					}
					this._bpPlugin = bp
					this.availabilityMessage = ''
					bp.getVersion({}, version => {
						if (this._disposed) return
						this.pluginVersionInfo = version
						console.log(this.$t("血压计版本号:"), version)
					})
				} catch (error) {
					this._bpPlugin = null
					this.availabilityMessage = this.$t("照片识别功能暂时不可用，请重新打开页面。")
				}
				// #endif
			},
			openLiveScan() {
				if (this.submitting || this.recognizing || this.awaitingReport) return
				this.beginNativeScan(false)
			},
			beginNativeScan(waitForPush) {
				if (this._disposed || this.submitting || this.recognizing || this.awaitingReport) return
				if (this._live && this._live.busy) return
				// 页面右滑还没结束就打开相机时，状态栏会停在上一页蓝条和本页浅底之间，露出一条白。
				this.applyScanChrome()
				this.clearNativeScanDelay()
				this._scanDelay = setTimeout(() => {
					this._scanDelay = null
					if (this._disposed) return
					if (!this.startNativeScan()) this.restoreScanChrome()
				}, waitForPush ? 360 : 0)
			},
			clearNativeScanDelay() {
				if (this._scanDelay) clearTimeout(this._scanDelay)
				this._scanDelay = null
			},
			applyScanChrome() {
				if (this._scanChromeActive) return
				this._scanChromeActive = true
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#000000',
					animation: {
						duration: 0,
						timingFunc: 'linear'
					}
				})
				// #ifdef APP-PLUS
				try {
					const webview = this.$scope && this.$scope.$getAppWebview && this.$scope.$getAppWebview()
					if (webview) webview.setStyle({
						background: '#000000'
					})
				} catch (error) {}
				// #endif
			},
			restoreScanChrome() {
				if (!this._scanChromeActive) return
				this._scanChromeActive = false
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#C0E3FF',
					animation: {
						duration: 0,
						timingFunc: 'linear'
					}
				})
				// #ifdef APP-PLUS
				try {
					const webview = this.$scope && this.$scope.$getAppWebview && this.$scope.$getAppWebview()
					if (webview) webview.setStyle({
						background: '#C0E3FF'
					})
				} catch (error) {}
				// #endif
			},
			startNativeScan() {
				if (this._disposed || this.submitting || this.recognizing) return false
				if (this._live && this._live.busy) return false
				if (!this._liveReader) this._liveReader = createNativeBPReader()
				if (!this._live) {
					this._live = createLiveController(this._liveReader, (state) => {
						if (this._disposed) return
						if (state.type === 'opening') {
							this.applyScanChrome()
							this.recordLiveFirstScan()
							return
						}
						this.restoreScanChrome()
						if (state.type === 'recognized') {
							this.applyLiveResult(state.result)
							return
						}
						if (state.type === 'cancelled') return
						uni.showToast({
							title: this.scanErrorText(state),
							icon: 'none'
						})
					})
				}
				const started = this._live.start(null, {
					scanTimeoutMs: 30000,
					prompts: this.scanPrompts()
				})
				if (started === false) return false
				this.checkReaderAccess().then(access => {
					if (this._disposed || access) return
					if (this._live) this._live.cancel()
				})
				return true
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
			scanErrorText(state) {
				const code = state.result && state.result.errorCode
				if (code === 'E_SCAN_TIMEOUT') return this.$t('扫描超时，未找到可靠读数')
				if (code === 'E_CANCELLED') return this.$t('扫描已取消')
				const message = state.message || (state.result && state.result.errorMessage) || ''
				if (message.indexOf('不支持原生实时扫描') >= 0) return this.$t('当前基座不支持原生实时扫描')
				return message || this.$t('扫描失败，请重试')
			},
			recordLiveFirstScan() {
				if (this._firstScanSyncPromise || !this._readerExpiry) return
				this._firstScanSyncPromise = this._readerExpiry.recordFirstScan(new Date()).catch(error => {
					console.warn('[BPReader] first scan sync pending', error)
				})
			},
			applyLiveResult(result) {
				if (this._disposed || this.submitting || !result || result.recognitionStatus !== 'recognized') return
				const source = result.readings || {}
				const asText = value => typeof value === 'number' || typeof value === 'string' ? String(value) : ''
				const systolic = Number(source.systolic)
				const diastolic = Number(source.diastolic)
				const bothLow = [systolic, diastolic].every(value => Number.isFinite(value) && value > 0 && value < 30)
				const bothHigh = [systolic, diastolic].every(value => Number.isFinite(value) && value > 30)
				let unit = 'mmHg'
				let unitStatus = 'unknown'
				let unitSource = null
				if (result.unitStatus === 'recognized' && (result.unit === 'mmHg' || result.unit === 'kPa')) {
					unit = result.unit
					unitStatus = 'recognized'
					unitSource = result.unitSource === 'image_text' ? 'image_text' : null
				} else if (bothLow) {
					unit = 'kPa'
					unitStatus = 'inferred'
					unitSource = 'value_threshold'
				} else if (bothHigh) {
					unit = 'mmHg'
					unitStatus = 'inferred'
					unitSource = 'value_threshold'
				}
				this.clearReportCountdown()
				this.reported = false
				this.errorMessage = ''
				this.formError = ''
				this.confirmed = false
				this.confirmedReadings = null
				this.convertedPressure = null
				this.unitStatus = unitStatus
				this.unitSource = unitSource
				this.photoStatus = 'not_requested'
				this.readingSource = 'live'
				this.imagePath = ''
				this.readings = {
					systolic: asText(source.systolic),
					diastolic: asText(source.diastolic),
					pulse: asText(source.pulse),
					unit
				}
				this.form = {
					...this.readings
				}
				this.hasReadings = true
				this.startReportCountdown()
			},
			async choosePhoto(sourceType) {
				if (this.busy || this.awaitingReport) return
				this.clearReportCountdown()
				if (!await this.checkReaderAccess()) return
				if (!this._bpPlugin) {
					uni.showToast({
						title: this.availabilityMessage,
						icon: 'none'
					})
					return
				}
				this.choosing = true
				try {
					const options = {
						count: 1,
						sizeType: ['original'],
						sourceType: [sourceType],
						success: res => {
							if (this._disposed) return
							const path = res.tempFilePaths && res.tempFilePaths[0]
							if (!path) {
								this.errorMessage = this.$t("未获取到照片，请重新选择。")
								return
							}
							const file = res.tempFiles && res.tempFiles[0]
							if (file && file.size > MAX_IMAGE_BYTES) {
								this.errorMessage = this.$t("照片超过 30MB，请选择较小的照片。")
								return
							}
							this.choosing = false
							this.imagePath = path
							this.recognizePhoto()
						},
						fail: error => {
							if (this._disposed || /cancel|取消/i.test(error.errMsg || error.message || ''))
								return
							this.errorMessage = sourceType === 'camera' ?
								this.$t("无法打开相机，请检查相机权限后重试。") :
								this.$t("无法读取照片，请检查相册权限后重试。")
						},
						complete: () => {
							if (!this._disposed) this.choosing = false
						}
					}
					if (sourceType === 'camera') {
						// uni.chooseImage 不提供格式选项，原生拍照明确指定 JPEG。
						plus.camera.getCamera().captureImage(
							path => {
								options.success({
									tempFilePaths: [path]
								})
								options.complete()
							},
							error => {
								options.fail(error)
								options.complete()
							}, {
								format: 'jpg',
								filename: '_doc/bp-capture-' + Date.now() + '-' +
									Math.random().toString(36).slice(2) + '.jpg'
							}
						)
					} else {
						uni.chooseImage(options)
					}
				} catch (error) {
					this.choosing = false
					this.errorMessage = this.$t("无法选择照片，请重试。")
				}
			},
			validatePhoto(path, onSuccess, onError) {
				// 先限制本地路径，避免 getImageInfo 对网络地址发起下载。
				if (typeof path !== 'string' || !path.trim() ||
					!/^(?:_[a-z]+\/|\/(?!\/)|file:\/\/\/|content:\/\/)/i.test(path)) {
					onError(this.$t("请选择本地 JPEG/PNG 照片。"))
					return
				}
				const looksLikeHeic = /\.(heic|heif)(?:[?#]|$)/i.test(path)
				try {
					// 不只依赖相册返回的 size；拍照及重试也必须检查实际文件。
					uni.getFileInfo({
						filePath: path,
						success: file => {
							if (this._disposed) return
							if (!Number.isFinite(file.size) || file.size <= 0) {
								onError(this.$t("无法读取照片大小，请重新选择照片。"))
								return
							}
							if (file.size > MAX_IMAGE_BYTES) {
								onError(this.$t("照片超过 30MB，请选择较小的照片。"))
								return
							}
							uni.getImageInfo({
								src: path,
								success: info => {
									if (this._disposed) return
									// 检查解码后的实际格式，不能只根据扩展名判断。
									const type = String(info.type || '').toLowerCase().replace(
										/^image\//, '')
									if (['jpg', 'jpeg', 'png'].indexOf(type) < 0) {
										onError(type === 'heic' || type === 'heif' ||
											looksLikeHeic ?
											this.$t(HEIC_MESSAGE) : this.$t(
												"仅支持 JPEG/PNG，请转换照片格式后再选择。"))
										return
									}
									if (!Number.isInteger(info.width) || !Number.isInteger(info
											.height) ||
										info.width <= 0 || info.height <= 0) {
										onError(this.$t("无法读取照片尺寸，请重新选择照片。"))
										return
									}
									if (info.width * info.height > MAX_IMAGE_PIXELS) {
										onError(this.$t("照片超过 2400 万像素，请降低分辨率后重试。"))
										return
									}
									onSuccess(type)
								},
								fail: () => onError(looksLikeHeic ? this.$t(HEIC_MESSAGE) :
									this.$t("无法读取照片，请选择有效的 JPEG/PNG；HEIC/HEIF 请先转换格式。"))
							})
						},
						fail: () => onError(this.$t("无法读取本地照片，请重新拍照或从相册选择。"))
					})
				} catch (error) {
					onError(this.$t("无法检查照片，请重新选择本地 JPEG/PNG。"))
				}
			},
			preparePhoto(path, requestId, onSuccess, onError) {
				const isActive = () => !this._disposed && this._activeRequestId === requestId
				this.validatePhoto(path, type => {
					if (!isActive()) return
					if (type === 'png' || !/\.jpg(?:[?#]|$)/i.test(path)) {
						onSuccess(path)
						return
					}
					const targetPath = '_doc/bp-recognition-' + requestId + '-' +
						Math.random().toString(36).slice(2) + '.jpeg'
					try {
						// 5+ 的 JPEG 编码参数名为 jpg，生成的实际文件使用 .jpeg 扩展名。
						plus.zip.compressImage({
							src: path,
							dst: targetPath,
							format: 'jpg',
							quality: 100,
							overwrite: false
						}, () => {
							if (!isActive()) return
							// 转换可能改变文件大小，必须重新检查生成的文件。
							this.validatePhoto(targetPath, () => {
								if (isActive()) onSuccess(targetPath)
							}, onError)
						}, () => {
							if (isActive()) onError(this.$t("照片转换为 JPEG 失败，请重新拍照或选择其他照片。"))
						})
					} catch (error) {
						if (isActive()) onError(this.$t("照片转换为 JPEG 失败，请重新拍照或选择其他照片。"))
					}
				}, onError)
			},
			async recognizePhoto() {
				if (this.busy || !this.imagePath || !this._bpPlugin) return
				this.clearReportCountdown()
				if (!await this.checkReaderAccess()) return
				this.errorMessage = ''
				this.formError = ''
				this.hasReadings = false
				this.confirmed = false
				this.reported = false
				this.confirmedReadings = null
				this.readings = emptyReadings()
				this.form = emptyReadings()
				this.readingSource = 'photo'
				this.unitStatus = 'unknown'
				this.unitSource = null
				this.convertedPressure = null
				this.photoStatus = ''
				this.photoPath = ''
				this.recordPath = ''
				this.recognizing = true
				const requestId = 'bp-' + Date.now() + '-' + (++this._requestSequence)
				this._activeRequestId = requestId
				this.startRecognitionTimer(requestId)
				this.preparePhoto(this.imagePath, requestId, tempFilePath => {
					if (this._disposed || this._activeRequestId !== requestId) return
					this.imagePath = tempFilePath
					try {
						// content URI 已获相册授权时直接传入；uni 临时路径转换为绝对路径。
						const imagePath = /^content:\/\//i.test(tempFilePath) ?
							tempFilePath : plus.io.convertLocalFileSystemURL(tempFilePath)
						const bp = this._bpPlugin
						console.log('[BPReader] recognize start requestId=' + requestId, imagePath)
						const scanStartedAt = new Date()
						bp.recognize({
							imagePath,
							requestId,
							savePhoto: true
						}, result => this.handleRecognition(result, requestId))
						this._firstScanSyncPromise = this._readerExpiry.recordFirstScan(scanStartedAt).catch(
							error => {
								console.warn('[BPReader] first scan sync pending', error)
							})
					} catch (error) {
						if (this.hasReadings) this.photoStatus = 'unknown'
						this.finishRecognition()
						this.errorMessage = this.$t("无法识别这张照片，请重新拍摄或选择照片。")
					}
				}, message => {
					if (this._disposed || this._activeRequestId !== requestId) return
					this.finishRecognition()
					this.errorMessage = message
				})
			},
			handleRecognition(response, requestId) {
				if (this._disposed || this._activeRequestId !== requestId) return
				let result
				try {
					result = typeof response === 'string' ? JSON.parse(response) : response
					if (!result || typeof result !== 'object') throw new Error('Invalid result')
				} catch (error) {
					this.finishRecognition()
					this.errorMessage = this.$t("识别结果读取失败，请重试。")
					return
				}
				if (result.requestId && result.requestId !== requestId) return
				// 先过滤已结束或过期请求，再记录本次回调的阶段和数据快照。
				console.log('[BPReader] recognize callback phase=' + (result.phase || 'unknown') +
					' requestId=' + requestId + ' photoStatus=' + (result.photoStatus || 'unknown') +
					' unitStatus=' + (result.unitStatus || 'unknown'), result)
				if (result.recognitionStatus === 'recognized') {
					this.recognizing = false
					if (result.phase === 'recognized') {
						this.photoStatus = 'pending'
						// 保存原图单独计时，用户此时已可编辑或放大照片。
						this.startRecognitionTimer(requestId)
					} else if (result.phase === 'complete') {
						this.photoStatus = ['saved', 'failed', 'not_requested', 'not_attempted'].indexOf(result
								.photoStatus) >= 0 ?
							result.photoStatus : 'unknown'
						this.photoPath = result.photoPath || ''
						this.recordPath = result.recordPath || ''
					}
					// 只检查识别得到的原始数值，避免使用已编辑或换算后的表单重复判定。
					const values = this.hasReadings ? this.readings : (result.readings || {})
					const isKpaByValue = [values.systolic, values.diastolic].some(value => {
						if (typeof value !== 'number' && typeof value !== 'string') return false
						const pressure = Number(value)
						return Number.isFinite(pressure) && pressure > 0 && pressure < 35
					})
					// 任一有效血压原值小于 35 时优先按 kPa；其余保留插件单位或由用户确认。
					const recognizedUnit = isKpaByValue ? 'kPa' :
						(result.unitStatus === 'recognized' && result.unit === 'mmHg' ? 'mmHg' : '')
					if (recognizedUnit) {
						this.unitStatus = isKpaByValue ? 'inferred' : 'recognized'
						this.unitSource = isKpaByValue ? 'value_threshold' :
							(result.unitSource === 'image_text' ? 'image_text' : null)
					}
					// 首次回调填入表单，后续 complete 回调不得覆盖用户已编辑的内容。
					if (!this.hasReadings) {
						const asText = value => typeof value === 'number' || typeof value === 'string' ? String(value) : ''
						this.readings = {
							systolic: asText(values.systolic),
							diastolic: asText(values.diastolic),
							pulse: asText(values.pulse),
							unit: recognizedUnit || 'mmHg'
						}
						this.hasReadings = true
						this.startReportCountdown()
					} else if (recognizedUnit) {
						if (!this.readings.unit) this.readings.unit = recognizedUnit
						// 若 complete 才返回单位，只补充尚未选择的单位，不重开弹框或重填数值。
						if (!this.form.unit && !this.submitting && !this.reported) this.form.unit = recognizedUnit
					}
				} else {
					if (this.hasReadings) this.photoStatus = 'unknown'
					this.errorMessage = result.errorCode === 'E_BUSY' ?
						this.$t("正在处理另一张照片，请稍后重试。") :
						this.$t("未能识别清晰的血压数值，请正对屏幕重新拍摄。")
				}
				if (result.phase !== 'recognized' || result.recognitionStatus !== 'recognized') this.finishRecognition()
			},
			startRecognitionTimer(requestId) {
				this.clearRecognitionTimer()
				this._recognitionTimer = setTimeout(() => {
					if (this._disposed || this._activeRequestId !== requestId) return
					if (this.hasReadings) {
						this.photoStatus = 'unknown'
					} else {
						this.errorMessage = this.$t("识别超时，请重新尝试。")
					}
					this.finishRecognition()
				}, 45000)
			},
			finishRecognition() {
				this.clearRecognitionTimer()
				this._activeRequestId = ''
				this.recognizing = false
				if (this.photoStatus === 'pending') this.photoStatus = 'unknown'
			},
			clearRecognitionTimer() {
				if (this._recognitionTimer) clearTimeout(this._recognitionTimer)
				this._recognitionTimer = null
			},
			clearReportCountdown() {
				if (this._reportTimer) clearInterval(this._reportTimer)
				this._reportTimer = null
				this.reportCountdown = 0
			},
			pauseReportCountdown() {
				if (this._reportTimer) clearInterval(this._reportTimer)
				this._reportTimer = null
			},
			resumeReportCountdown() {
				if (this._reportTimer || this.reportCountdown <= 0) return
				if (this._disposed || this.reported || this.submitting || this.editorVisible) return
				this._reportTimer = setInterval(() => this.tickReportCountdown(), 1000)
			},
			tickReportCountdown() {
				if (this._disposed || this.reported || this.submitting) {
					this.clearReportCountdown()
					return
				}
				if (this.editorVisible) {
					this.pauseReportCountdown()
					return
				}
				if (this.reportCountdown <= 1) {
					this.clearReportCountdown()
					this.reportCurrentReadings()
					return
				}
				this.reportCountdown -= 1
			},
			startReportCountdown() {
				this.clearReportCountdown()
				if (this._disposed || this.reported || this.submitting || this.editorVisible) return
				this.reportCountdown = 10
				this._reportTimer = setInterval(() => this.tickReportCountdown(), 1000)
			},
			reportCurrentReadings() {
				this.clearReportCountdown()
				if (this.submitting || this.reported || this.editorVisible) return
				this.form = {
					...(this.confirmedReadings || this.readings)
				}
				if (!this.form.unit) {
					this.form.unit = 'mmHg'
					this.readings.unit = 'mmHg'
				}
				this.convertedPressure = null
				this.formError = ''
				this.confirmReadings()
			},
			previewPhoto() {
				if (this.imagePath && !this.recognizing) {
					uni.previewImage({
						urls: [this.imagePath],
						current: this.imagePath
					})
				}
			},
			unitNotRecognized() {
				return this.unitStatus !== 'recognized' && this.unitStatus !== 'inferred'
			},
			applyUnrecognizedDefaultUnit() {
				if (!this.unitNotRecognized()) return
				const systolic = Number(this.form.systolic)
				const diastolic = Number(this.form.diastolic)
				if (!Number.isFinite(systolic) || !Number.isFinite(diastolic) || systolic <= 0 || diastolic <= 0) return
				if (systolic < 30 && diastolic < 30) {
					this.form.unit = 'kPa'
					this.readings.unit = 'kPa'
				}
			},
			onReviewClick() {
				if (this.submitting || this.reported) return
				this.openEditor()
			},
			openEditor() {
				if (this.submitting || this.reported) return
				this.pauseReportCountdown()
				this.form = {
					...(this.confirmedReadings || this.readings)
				}
				this.applyUnrecognizedDefaultUnit()
				this.convertedPressure = null
				this.formError = ''
				this.$nextTick(() => {
					if (!this._disposed) this.$refs.editor.open('center')
				})
			},
			closeEditor() {
				if (this.submitting) return
				uni.hideKeyboard()
				this.$refs.editor.close()
			},
			onEditorChange(event) {
				this.editorVisible = event.show
				if (!event.show && !this.reported && !this.submitting) this.resumeReportCountdown()
			},
			confirmSourceUnit(unit) {
				if (this.submitting || this.reported || this.form.unit || this.units.indexOf(unit) < 0) return
				// 用户确认照片原始单位时保留原数值，之后才能切换显示单位。
				this.readings.unit = unit
				this.form.unit = unit
				this.convertedPressure = null
				this.formError = ''
			},
			setUnit(unit) {
				if (this.submitting || this.form.unit === unit || this.units.indexOf(unit) < 0) return
				if (this.units.indexOf(this.form.unit) < 0) {
					this.formError = this.$t("请先确认照片中的原始单位，再切换显示单位。")
					return
				}
				const sys = Number(this.form.systolic)
				const dia = Number(this.form.diastolic)
				const validPressure = Number.isFinite(sys) && Number.isFinite(dia) && sys > dia && dia > 0
				// 仅在原始单位已识别或由用户确认后进行显示换算。
				if (unit === 'kPa' && this.form.unit === 'mmHg' && validPressure) {
					const source = {
						systolic: Number(this.form.systolic),
						diastolic: Number(this.form.diastolic)
					}
					this.form.systolic = (Number(this.form.systolic) * KPA_PER_MMHG).toFixed(2)
					this.form.diastolic = (Number(this.form.diastolic) * KPA_PER_MMHG).toFixed(2)
					this.convertedPressure = {
						source,
						systolic: Number(this.form.systolic),
						diastolic: Number(this.form.diastolic)
					}
				} else if (unit === 'mmHg' && this.form.unit === 'kPa' && this.hasConvertedPressure(this.form)) {
					this.form.systolic = String(this.convertedPressure.source.systolic)
					this.form.diastolic = String(this.convertedPressure.source.diastolic)
					this.convertedPressure = null
				} else if (unit === 'mmHg' && this.form.unit === 'kPa' && validPressure) {
					this.form.systolic = String(Math.round(Number(this.form.systolic) / KPA_PER_MMHG))
					this.form.diastolic = String(Math.round(Number(this.form.diastolic) / KPA_PER_MMHG))
					this.convertedPressure = null
				}
				this.form.unit = unit
				this.formError = ''
			},
			hasConvertedPressure(values) {
				return this.convertedPressure && Number(values.systolic) === this.convertedPressure.systolic &&
					Number(values.diastolic) === this.convertedPressure.diastolic
			},
			buildReportReadings() {
				if (this.units.indexOf(this.form.unit) < 0) {
					return {
						error: this.$t("请先选择血压单位。")
					}
				}
				const pressurePattern = this.form.unit === 'kPa' ? /^\d{1,3}(\.\d{1,2})?$/ : /^\d{1,3}$/
				const fields = [
					['systolic', this.$t("收缩压"), pressurePattern],
					['diastolic', this.$t("舒张压"), pressurePattern],
					['pulse', this.$t("脉搏"), /^\d{1,3}$/]
				]
				const values = {
					unit: this.form.unit
				}
				for (const [key, label, pattern] of fields) {
					const text = String(this.form[key]).trim()
					if (!pattern.test(text) || Number(text) <= 0) {
						return {
							error: key === 'pulse' || this.form.unit === 'mmHg' ?
								this.$t('请填写有效的{label}整数。', {
									label
								}) : this.$t('请填写有效的{label}数值。', {
									label
								})
						}
					}
					values[key] = Number(text)
				}
				if (values.systolic <= values.diastolic) {
					return {
						error: this.$t("收缩压应大于舒张压，请对照照片核对。")
					}
				}
				const upload = {
					...values,
					unit: 'mmHg'
				}
				let note = ''
				if (values.unit === 'kPa' && this.hasConvertedPressure(values)) {
					// 本页面换算过且未修改的数值使用原始 mmHg，避免舍入损失。
					upload.systolic = this.convertedPressure.source.systolic
					upload.diastolic = this.convertedPressure.source.diastolic
					note = this.$t("kPa 已换算为 mmHg。")
				} else if (values.unit === 'kPa') {
					// 尊重用户明确选择的 kPa，不因数值大小改判为 mmHg。
					upload.systolic = Math.round(values.systolic / KPA_PER_MMHG)
					upload.diastolic = Math.round(values.diastolic / KPA_PER_MMHG)
					note = this.$t("kPa 已换算为 mmHg。")
				}
				if (upload.diastolic <= 0 || upload.systolic <= upload.diastolic) {
					return {
						error: this.$t("换算后的血压数值无效，请对照照片核对。")
					}
				}
				return {
					values,
					upload,
					note
				}
			},
			async confirmReadings() {
				if (this.checkingUsage) return
				console.log('[BPReader] confirmReadings click', JSON.stringify({
					form: this.form,
					submitting: this.submitting,
					reported: this.reported
				}))
				if (this.submitting || this.reported) {
					console.log('[BPReader] confirmReadings blocked', this.submitting ? this.$t("正在上报，请勿重复提交") : this
						.$t("本次结果已经上报"))
					return
				}
				this.formError = ''
				const result = this.buildReportReadings()
				if (result.error) {
					this.formError = result.error
					console.log('[BPReader] confirmReadings blocked', result.error)
					uni.showToast({
						title: result.error,
						icon: 'none',
						duration: 3000
					})
					return
				}
				const parsedData = {
					sys: String(result.upload.systolic),
					dia: String(result.upload.diastolic),
					pul: String(result.upload.pulse)
				}
				// 打印换算后的值，和 click 日志中的表单原值区分。
				console.log('[BPReader] upload mmHg', JSON.stringify({
					selectedUnit: this.form.unit,
					unit: 'mmHg',
					slaveData: {
						lowPressure: parsedData.dia,
						highPressure: parsedData.sys,
						heartrate: parsedData.pul
					},
					unitCheck: result.note || this.$t("当前数值按 mmHg 原值上报。")
				}))
				this.submitting = true
				const access = await this.checkReaderAccess()
				if (!access) {
					this.submitting = false
					return
				}
				let data
				try {
					data = await this.pressure_data(parsedData)
					console.log('pressure_data result', data)
				} catch (error) {
					console.error('pressure_data error', error && (error.message || error.errMsg) || error,
						error)
					if (!this._disposed) {
						this.formError = this.$t("上报失败，请检查网络后重试。")
						uni.showToast({
							title: this.formError,
							icon: 'none',
							duration: 3000
						})
					}
					this.submitting = false
					return
				}
				// 网络提交成功后，刷新界面的异常不能将本次结果变成可重复上报。
				this.reported = true
				this.confirmed = true
				this.confirmedReadings = result.values
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
					const channel = this.getOpenerEventChannel()
					channel.emit('bpReaderReported', data)
				} catch (error) {
					console.warn(this.$t("血压已上报，首页刷新失败:"), error)
				}
				if (this._disposed) return
				this.closeEditor()
				// 暂时关闭满 15 次后的购买提示，上报成功后提示并回到首页。
				// if (usageResult.limitReached) {
				// 	this.showPurchasePrompt()
				// 	return
				// }
				const syncFailed = !!(usageResult && usageResult.syncFailed)
				uni.showToast({
					title: syncFailed ? this.$t('上报成功，识别次数待同步，请联网后重试。') : this.$t("上报成功"),
					icon: 'none'
				})
				uni.switchTab({
					url: '/pages/tabBar/main/Main'
				})
			},
			// UTC 时间戳，秒和毫秒取自同一时刻。
			UTCdatatime() {
				const timestampMs = Date.now()
				return {
					timestampMs,
					timestampSec: Math.floor(timestampMs / 1000)
				}
			},
			getTimeAllJSON(date = new Date()) {
				return getLocalTimeAllJSON(date)
			},
			async pressure_data(parsedData) {
				const device = await ensureReaderDevice(this)
				const measurement = this.UTCdatatime()
				const data = {
					deviceSn: device.deviceSn,
					slaveSn: '0',
					deviceModel: "ZK-B872",
					deviceTypeId: '1',
					slaveData: {
						lowPressure: parsedData.dia.trim(),
						highPressure: parsedData.sys.trim(),
						heartrate: parsedData.pul.trim()
					},
					time: measurement.timestampSec,
					measurementTs: measurement.timestampSec,
					measurementTimezone: this.getTimeAllJSON(new Date(measurement.timestampMs)).YMDHMS
				}
				console.log('pressure_data data', data, this.$url_APP_IP)
				const response = await this.$post(this.$url_APP_IP + this.$url_pressure_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				})
				console.log('pressure_data response', response)
				if (!response || response.code !== 200) throw new Error(this.$t("血压上报失败"))
				return data
			}
		}
	}
</script>

<style scoped>
	.reader-page {
		min-height: 100vh;
		box-sizing: border-box;
		padding: 0 28rpx 48rpx;
		background-color: #F4F8FC;
		color: #102A43;
	}

	.hero {
		display: flex;
		align-items: center;
		margin: 0 -28rpx 20rpx;
		padding: 12rpx 0 12rpx 36rpx;
		background-color: #C0E3FF;
	}

	.hero-copy {
		flex: 1;
		min-width: 0;
		padding-right: 12rpx;
	}

	.hero-title {
		font-size: 46rpx;
		font-weight: 800;
		line-height: 1.18;
		color: #0B2340;
		white-space: pre-line;
	}

	.hero-desc {
		margin-top: 16rpx;
		color: #6A7C90;
		font-size: 24rpx;
		line-height: 1.45;
	}

	.hero-art {
		width: 360rpx;
		height: 248rpx;
		flex-shrink: 0;
		overflow: hidden;
		background-color: #C0E3FF;
	}

	.hero-photo {
		width: 360rpx;
		height: 248rpx;
		display: block;
	}

	.steps {
		display: flex;
		align-items: center;
		margin: 4rpx 8rpx 26rpx;
	}

	.step {
		display: flex;
		align-items: center;
		color: #8FA0B3;
		font-size: 24rpx;
		white-space: nowrap;
	}

	.step-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36rpx;
		height: 36rpx;
		margin-right: 10rpx;
		border-radius: 50%;
		background: #E6EDF5;
		color: #8FA0B3;
		font-size: 20rpx;
		font-weight: 700;
	}

	.step.active {
		color: #2F7CF6;
		font-weight: 700;
	}

	.active .step-number {
		background: #2F7CF6;
		color: #FFF;
	}

	.step-line {
		flex: 1;
		height: 2rpx;
		margin: 0 16rpx;
		background: #E1E8F0;
	}

	.photo-card,
	.result-card,
	.tips-card {
		padding: 28rpx 24rpx 22rpx;
		border-radius: 36rpx;
		background: #FFF;
		box-shadow: 0 12rpx 40rpx rgba(36, 92, 150, .08);
	}

	.card-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-title {
		font-size: 29rpx;
		font-weight: 600;
	}

	.subtle-label {
		font-size: 20rpx;
		color: #93A0B1;
	}

	.guide-panel {
		padding: 20rpx 16rpx 16rpx;
		border-radius: 28rpx;
		background: #F4F7FB;
	}

	.guide-main {
		display: flex;
		align-items: flex-end;
	}

	.guide-copy {
		flex: 1;
		min-width: 0;
		padding-left: 8rpx;
	}

	.guide-title {
		font-size: 34rpx;
		font-weight: 800;
		line-height: 1.2;
		color: #102A43;
	}

	.guide-desc {
		margin-top: 10rpx;
		color: #6E8094;
		font-size: 24rpx;
		line-height: 1.4;
	}

	.photo-preview {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 360rpx;
		overflow: hidden;
		border-radius: 24rpx;
		background: #F6F8FB;
	}

	.photo-zoom-hint {
		margin-top: 10rpx;
		color: #8B9BB0;
		font-size: 22rpx;
		text-align: center;
	}

	.scan-frame {
		position: relative;
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		margin-right: 12rpx;
		padding-right: 14rpx;
		padding-left: 14rpx;
	}

	.corner {
		position: absolute;
		width: 28rpx;
		height: 28rpx;
		border-color: #2F7CF6;
		border-style: solid;
	}

	.top-left {
		top: 0;
		left: 0;
		border-width: 5rpx 0 0 5rpx;
		border-radius: 8rpx 0 0 0;
	}

	.top-right {
		top: 0;
		right: 0;
		border-width: 5rpx 5rpx 0 0;
		border-radius: 0 8rpx 0 0;
	}

	.bottom-left {
		bottom: 0;
		left: 0;
		border-width: 0 0 5rpx 5rpx;
		border-radius: 0 0 0 8rpx;
	}

	.bottom-right {
		bottom: 0;
		right: 0;
		border-width: 0 5rpx 5rpx 0;
		border-radius: 0 0 8rpx 0;
	}

	.monitor-photo {
		display: block;
		flex-shrink: 0;
		width: 200rpx;
		height: 251rpx;
	}

	.hint-row {
		display: flex;
		align-items: flex-start;
		margin-top: 16rpx;
	}

	.hint {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		min-width: 0;
	}

	.hint-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48rpx;
		height: 48rpx;
		flex-shrink: 0;
	}

	.hint-icon.display {
		flex-direction: column;
	}

	.hint-label {
		display: block;
		width: 100%;
		margin-top: 8rpx;
		min-height: 52rpx;
		color: #8B9BB0;
		font-size: 20rpx;
		line-height: 26rpx;
		text-align: center;
	}

	.hint-split {
		width: 1rpx;
		height: 72rpx;
		margin-top: 6rpx;
		background: #E3E9F0;
		flex-shrink: 0;
	}

	.sun-core {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background: #2F7CF6;
		box-shadow: 0 -12rpx 0 -4rpx #2F7CF6, 0 12rpx 0 -4rpx #2F7CF6, -12rpx 0 0 -4rpx #2F7CF6, 12rpx 0 0 -4rpx #2F7CF6, -9rpx -9rpx 0 -4rpx #2F7CF6, 9rpx -9rpx 0 -4rpx #2F7CF6, -9rpx 9rpx 0 -4rpx #2F7CF6, 9rpx 9rpx 0 -4rpx #2F7CF6;
	}

	.hint-glyph {
		width: 40rpx;
		height: 40rpx;
	}

	.hint-display {
		flex-direction: column;
	}

	.display-screen {
		width: 28rpx;
		height: 18rpx;
		border: 3rpx solid #2F7CF6;
		border-radius: 4rpx;
	}

	.display-stand {
		width: 14rpx;
		height: 3rpx;
		margin-top: 3rpx;
		border-radius: 2rpx;
		background: #2F7CF6;
		box-shadow: 0 5rpx 0 #2F7CF6;
	}

	.selected-photo {
		width: 100%;
		height: 100%;
	}

	.action-button.scan-now {
		width: 100%;
		flex: none;
		height: 96rpx;
		margin-top: 22rpx;
		border-radius: 18rpx;
		font-size: 32rpx;
		font-weight: 700;
	}

	.source-actions {
		display: flex;
		margin-top: 16rpx;
	}

	.source-actions .action-button+.action-button {
		margin-left: 16rpx;
	}

	.photo-requirements {
		margin-top: 16rpx;
		color: #A0AEC0;
		font-size: 22rpx;
		line-height: 1.5;
		text-align: center;
	}

	button {
		margin: 0;
		padding: 0;
		font-size: 28rpx;
		font-weight: 600;
	}

	button::after {
		border: 0;
	}

	.action-button {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		height: 88rpx;
		border-radius: 18rpx;
		line-height: normal;
	}

	.action-button text {
		margin-left: 12rpx;
	}

	.primary {
		background: #2F7CF6;
		color: #FFF;
	}

	.secondary {
		background: #F2F6FB;
		color: #2F7CF6;
	}

	.action-button[disabled] {
		opacity: .5;
	}

	.recognizing-overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: rgba(245, 249, 254, .88);
		color: #2F7CF6;
		font-size: 27rpx;
	}

	.spinner {
		width: 44rpx;
		height: 44rpx;
		margin-bottom: 24rpx;
		border: 5rpx solid #D3E6FB;
		border-top-color: #2F7CF6;
		border-radius: 50%;
		animation: spin .8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.message-panel {
		display: flex;
		align-items: center;
		margin-top: 24rpx;
		padding: 24rpx;
		border-radius: 16rpx;
		background: #FFF5E8;
	}

	.message-text {
		flex: 1;
		margin: 0 14rpx;
		font-size: 24rpx;
		line-height: 1.7;
		color: #9A6C32;
	}

	.text-button {
		background: transparent;
		color: #2F7CF6;
		font-size: 25rpx;
		line-height: 1.8;
	}

	.result-card,
	.tips-card {
		margin-top: 26rpx;
	}

	.result-heading {
		display: flex;
		align-items: center;
	}

	.result-badge {
		margin-left: 16rpx;
		padding: 5rpx 12rpx;
		border-radius: 8rpx;
		background: #FFF4E4;
		color: #B5833A;
		font-size: 20rpx;
	}

	.result-badge.confirmed {
		background: #EAF7F2;
		color: #369474;
	}

	.reading-grid {
		display: flex;
		margin: 34rpx 0 26rpx;
	}

	.reading-item {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		border-right: 1rpx solid #EBF0F6;
	}

	.reading-item:last-child {
		border-right: 0;
	}

	.reading-label {
		color: #7C8B9D;
		font-size: 24rpx;
	}

	.reading-value {
		margin: 14rpx 0 8rpx;
		font-size: 48rpx;
		font-weight: 700;
	}

	.reading-unit {
		font-size: 20rpx;
		color: #9AA6B5;
	}

	.result-note {
		padding-top: 22rpx;
		border-top: 1rpx solid #EDF1F6;
		font-size: 22rpx;
		line-height: 1.8;
		color: #8997A9;
	}

	.result-note-warn {
		border-top: none;
		color: #8A5A12;
	}

	.photo-status {
		margin-top: 16rpx;
		color: #7C8B9D;
		font-size: 22rpx;
		line-height: 1.7;
	}

	.editor-photo-status {
		margin: 0 30rpx 24rpx;
	}

	.confirm-button {
		margin-top: 24rpx;
		border-radius: 16rpx;
		line-height: 84rpx;
	}

	.tips-head {
		display: flex;
		align-items: center;
	}

	.tips-bulb {
		font-size: 34rpx;
		line-height: 1;
	}

	.tips-title {
		margin-left: 12rpx;
		color: #102A43;
		font-size: 32rpx;
		font-weight: 800;
	}

	.tip-line {
		display: flex;
		align-items: flex-start;
		margin-top: 22rpx;
	}

	.tip-check {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		width: 32rpx;
		height: 32rpx;
		margin-top: 2rpx;
		margin-right: 14rpx;
		border-radius: 50%;
		background: #34C759;
	}

	.tip-text {
		flex: 1;
		color: #3E5168;
		font-size: 26rpx;
		line-height: 1.45;
	}

	.page-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 28rpx;
		color: #8D9AAD;
		font-size: 22rpx;
	}

	.page-footer text {
		margin-left: 8rpx;
	}

	.editor {
		box-sizing: border-box;
		width: 660rpx;
		max-width: 92vw;
		overflow: hidden;
		border-radius: 28rpx;
		background: #FFF;
	}

	.editor-heading {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 30rpx 30rpx 20rpx;
	}

	.editor-subtitle {
		margin-top: 10rpx;
		font-size: 23rpx;
		color: #91A0B2;
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44rpx;
		height: 44rpx;
		background: transparent;
		line-height: normal;
	}

	.editor-scroll {
		height: 850rpx;
		max-height: 65vh;
	}

	.editor-photo {
		position: relative;
		height: 200rpx;
		margin: 0 30rpx 24rpx;
		overflow: hidden;
		border-radius: 14rpx;
		background: #F4F7FB;
	}

	.editor-photo image {
		width: 100%;
		height: 100%;
	}

	.editor-photo text {
		position: absolute;
		right: 12rpx;
		bottom: 12rpx;
		padding: 5rpx 12rpx;
		border-radius: 8rpx;
		background: rgba(38, 55, 75, .6);
		color: #FFF;
		font-size: 20rpx;
	}

	.unit-heading {
		margin: 0 30rpx 18rpx;
		font-size: 25rpx;
		font-weight: 500;
	}

	.unit-options {
		display: flex;
		margin: 0 30rpx;
	}

	.unit-option {
		flex: 1;
		border: 2rpx solid #E7EDF5;
		border-radius: 12rpx;
		background: #FAFBFD;
		color: #7F8EA0;
		line-height: 64rpx;
	}

	.unit-option+.unit-option {
		margin-left: 18rpx;
	}

	.unit-option.selected {
		border-color: #2F7CF6;
		background: #EDF5FF;
		color: #2F7CF6;
	}

	.unit-hint {
		margin: 14rpx 30rpx 10rpx;
		font-size: 21rpx;
		color: #9AA6B5;
		line-height: 1.6;
	}

	.unit-hint-warn {
		padding: 16rpx 18rpx;
		border-radius: 12rpx;
		background: #FFF6E8;
		color: #8A5A12;
	}

	.field-row {
		display: flex;
		align-items: center;
		margin: 0 30rpx;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #EDF1F6;
	}

	.field-label {
		width: 230rpx;
		font-size: 26rpx;
	}

	.field-code {
		margin-left: 8rpx;
		color: #9AA6B5;
		font-size: 19rpx;
	}

	.reading-input {
		flex: 1;
		width: 0;
		height: 60rpx;
		text-align: right;
		font-size: 32rpx;
		font-weight: 600;
		color: #25364A;
	}

	.field-unit {
		width: 90rpx;
		margin-left: 16rpx;
		color: #91A0B2;
		font-size: 23rpx;
		text-align: right;
	}

	.form-error {
		margin: 18rpx 30rpx 0;
		color: #C36748;
		font-size: 23rpx;
		line-height: 1.6;
	}

	.editor-actions {
		display: flex;
		padding: 26rpx 30rpx 30rpx;
	}

	.cancel-button,
	.save-button {
		flex: 1;
		border-radius: 14rpx;
		line-height: 82rpx;
	}

	.cancel-button {
		margin-right: 18rpx;
		background: #F1F4F8;
		color: #7F8EA0;
	}
</style>