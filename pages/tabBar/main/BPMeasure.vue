<template>
	<view class="measure-page">
		<view class="bp-reader-entry" @click="openPhotoScan">
			<view class="entry-icon-wrap">
				<uni-icons type="camera-filled" size="22" color="#FFFFFF"></uni-icons>
			</view>
			<view class="bp-reader-entry-text">
				<text class="bp-reader-entry-title">{{ $t('拍照扫描') }}</text>
				<text class="bp-reader-entry-caption">{{ $t('使用手机摄像头扫描传统血压计屏幕自动识别血压和心率') }}</text>
			</view>
			<uni-icons class="bp-reader-entry-arrow" type="right" size="18" color="#91A2B6"></uni-icons>
		</view>
		<view v-if="expiryNotice" class="expiry-notice">
			<text class="expiry-notice-text">{{ expiryNotice }}</text>
		</view>
		<view class="bp-reader-entry" @click="openManualInput">
			<view class="entry-icon-wrap">
				<uni-icons type="compose" size="22" color="#FFFFFF"></uni-icons>
			</view>
			<view class="bp-reader-entry-text">
				<text class="bp-reader-entry-title">{{ $t('手动输入') }}</text>
				<text class="bp-reader-entry-caption">{{ $t('手动输入您的血压和心率数据') }}</text>
			</view>
			<uni-icons class="bp-reader-entry-arrow" type="right" size="18" color="#91A2B6"></uni-icons>
		</view>
		<image class="bp-brand-banner" :src="brandBannerSrc" mode="widthFix" @click="openShop"></image>
		<uni-popup ref="qs_popup" :mask-click="true">
			<view style="border-radius: 20px;background:#fff; padding-bottom: 10px;align-items: center;">
				<view style="display: flex;justify-content: center; padding: 10px;">
					<picker fields="day" mode="date" :value="birthday1111" @change="bindDateChange" :end="endtimesss">
						<view style="display: flex;flex-direction: row;">
							<view style="font-size: 16px;color: black;">{{ birthday1111 }}</view>
							<uni-icons type="bottom" size="18" style="margin-left: 5px;"></uni-icons>
						</view>
					</picker>
				</view>
				<view style="padding: 10px;width: 80vw;">
					<view
						style="margin:0 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
						<input type="number" v-model="shousuoya" :placeholder="$t('请输入收缩压')"
							style="text-align: center;" />
						<text style="margin-left: 5px;">{{ Blood }}</text>
					</view>
					<view
						style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
						<input type="number" v-model="shuzhangya" :placeholder="$t('请输入舒张压')"
							style="text-align: center;" />
						<text style="margin-left: 5px;">{{ Blood }}</text>
					</view>
					<view
						style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
						<input type="number" v-model="maibo" :placeholder="$t('请输入脉搏')" style="text-align: center;" />
						<text style="margin-left: 5px;">BPM</text>
					</view>
				</view>
				<button class="buttonstylesds" @tap="truesss()">{{ $t('确认') }}</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		createBPReaderExpiry,
		getBPReaderExpiryState
	} from '@/pages/api/bpReaderExpiry.js'
	import {
		ensureReaderDevice
	} from '@/pages/api/bpReaderDevice.js'
	import {
		getLocalTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'

	const KPA_PER_MMHG = 0.1333224

	export default {
		data() {
			const now = new Date()
			return {
				Blood: uni.getStorageSync('Blood') === 0 || uni.getStorageSync('Blood') === '' ? 'mmHg' : 'kPa',
				endtimesss: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
				shousuoya: '',
				shuzhangya: '',
				maibo: '',
				birthday1111: this.$t('今天'),
				expiryNotice: ''
			}
		},
		onLoad() {
			this.setTitle()
		},
		onShow() {
			this.setTitle()
			this.Blood = uni.getStorageSync('Blood') === 0 || uni.getStorageSync('Blood') === '' ? 'mmHg' : 'kPa'
			this.loadExpiryNotice()
			this.prepareReaderDevice()
		},
		computed: {
			brandBannerSrc() {
				const locale = (this.$i18n && this.$i18n.locale) || uni.getLocale() || 'zh-CN'
				if (String(locale).toLowerCase().startsWith('en')) {
					return '/static/page_icon/bp_monitors_en.jpg'
				}
				return '/static/page_icon/bp_monitors_zh.png'
			}
		},
		methods: {
			setTitle() {
				uni.setNavigationBarTitle({
					title: this.$t('测量血压')
				})
			},
			prepareReaderDevice() {
				ensureReaderDevice(this).catch(() => {})
			},
			openManualInput() {
				this.$refs.qs_popup.open('center')
			},
			openShop() {
				uni.navigateTo({
					url: '/pages/tabBar/my/JakoblifeShop'
				})
			},
			async loadExpiryNotice() {
				const userid = uni.getStorageSync('userid')
				const token = uni.getStorageSync('token')
				const baseUrl = this.$url_APP_IP
				const isCurrent = () => userid === uni.getStorageSync('userid') &&
					token === uni.getStorageSync('token') && baseUrl === this.$url_APP_IP
				try {
					if (!userid || !token) return
					const firstDate = await this.loadStoredFirstScanDate()
					if (!isCurrent()) return
					this.expiryNotice = this.expiryNoticeText(firstDate)
				} catch (error) {
					if (isCurrent()) this.expiryNotice = ''
				}
			},
			expiryNoticeText(firstDate) {
				if (!firstDate) return ''
				const state = getBPReaderExpiryState(firstDate)
				if (state.status === 'expired') return this.$t('已到期，该功能无法使用，请及时续费')
				if (state.status === 'expiring') return this.$t('即将到期，请及时续费')
				return ''
			},
			async loadStoredFirstScanDate() {
				const stored = await createBPReaderExpiry({
					baseUrl: this.$url_APP_IP,
					get: (...args) => this.$get(...args),
					post: (...args) => this.$post(...args),
					storage: uni
				}).loadFirstScanDate()
				if (stored) getBPReaderExpiryState(stored)
				return stored
			},
			bindDateChange(e) {
				this.birthday1111 = e.detail.value
			},
			truesss() {
				if (this.shuzhangya === '' || this.shuzhangya === undefined) {
					uni.showToast({
						title: this.$t('请输入收缩压'),
						icon: 'none'
					})
					return
				} else if (this.shousuoya === '' || this.shousuoya === undefined) {
					uni.showToast({
						title: this.$t('请输入舒张压'),
						icon: 'none'
					})
					return
				} else if (this.maibo === '' || this.maibo === undefined) {
					uni.showToast({
						title: this.$t('请输入脉搏'),
						icon: 'none'
					})
					return
				} else {
					this.pressure_data()
				}
			},
			async pressure_data() {
				let device
				try {
					device = await ensureReaderDevice(this)
				} catch (error) {
					uni.showToast({
						title: this.$t('失败'),
						icon: 'none',
						duration: 1500
					})
					return
				}
				const now = new Date()
				const localDate =
					`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
				const localTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
				const formattedTime = this.birthday1111 === this.$t('今天') ?
					`${localDate} ${localTime}` :
					`${this.birthday1111} ${localTime}`
				const timestamp = Math.floor(new Date(formattedTime).getTime() / 1000)
				const measurementTs = Math.floor(Date.now() / 1000)
				const toMmhg = (value) => this.Blood === 'kPa' ?
					String(Math.round(Number(value) / KPA_PER_MMHG)) : String(value)
				const data = {
					deviceSn: device.deviceSn,
					slaveSn: '0',
					deviceModel: "ZK-B872",
					deviceTypeId: '1',
					slaveData: {
						lowPressure: toMmhg(this.shuzhangya),
						highPressure: toMmhg(this.shousuoya),
						heartrate: this.maibo
					},
					time: timestamp,
					measurementTs: measurementTs,
					measurementTimezone: getLocalTimeAllJSON().YMDHMS
				}
				this.$post(this.$url_APP_IP + this.$url_pressure_data, data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then((res) => {
					if (res.code === 200) {
						this.$refs.qs_popup.close()
						this.birthday1111 = this.$t('今天')
						this.shousuoya = ''
						this.shuzhangya = ''
						this.maibo = ''
						uni.showToast({
							title: this.$t('成功'),
							icon: 'none',
							duration: 1500
						})
						const main = getApp() && getApp().globalData && getApp().globalData.mainPageVm
						if (main && typeof main.list_recipe === 'function') {
							main.list_recipe()
						}
					} else if (res.code === 500) {
						return
					} else {
						uni.showToast({
							title: this.$t('失败'),
							icon: 'none',
							duration: 1500
						})
					}
				})
			},
			async openPhotoScan() {
				if (this._bpReaderOpening) return
				this._bpReaderOpening = true
				const userid = uni.getStorageSync('userid')
				const token = uni.getStorageSync('token')
				const baseUrl = this.$url_APP_IP
				const isCurrent = () => userid === uni.getStorageSync('userid') &&
					token === uni.getStorageSync('token') && baseUrl === this.$url_APP_IP
				try {
					if (!userid || !token) throw new Error('Missing BP reader account')
					const firstDate = await this.loadStoredFirstScanDate()
					if (!isCurrent()) return
					if (firstDate) {
						const state = getBPReaderExpiryState(firstDate)
						// 提前 3 天只显示页面提示，扫描按钮不弹窗。到期当天起改到期提示并拦住扫描。
						if (state.status === 'expired') {
							await this.showBPReaderExpiryPrompt('expired')
							return
						}
					}
					await new Promise((resolve, reject) => {
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/tabBar/main/BPReader?scan=1',
								animationType: 'slide-in-right',
								animationDuration: 300,
								success: resolve,
								fail: reject
							})
						}, 50)
					})
				} catch (error) {
					console.warn('[BPReader] expiry check failed', error)
					if (isCurrent()) uni.showToast({
						title: this.$t('无法检查设备绑定或识别次数，请检查网络后重试。'),
						icon: 'none'
					})
				} finally {
					this._bpReaderOpening = false
				}
			},
			showBPReaderExpiryPrompt(status) {
				return new Promise(resolve => {
					uni.showModal({
						title: this.$t('温馨提示'),
						content: status === 'expired' ? this.$t('已到期，该功能无法使用，请及时续费') : this.$t(
							'即将到期，请及时续费'),
						showCancel: false,
						confirmText: this.$t('确定'),
						success: result => resolve(result.confirm === true),
						fail: () => resolve(false)
					})
				})
			},
		}
	}
</script>

<style scoped>
	.measure-page {
		min-height: 100vh;
		background: #F5F7FA;
		padding: 16px;
		box-sizing: border-box;
	}

	.bp-reader-entry {
		display: flex;
		flex-direction: row;
		align-items: center;
		min-height: 76px;
		margin-bottom: 12px;
		padding: 14px;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 16px;
		box-shadow: 0 2px 8px rgba(16, 24, 40, 0.06);
	}

	.entry-icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #3298F7;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.bp-reader-entry-text {
		flex: 1;
		min-width: 0;
		margin: 0 12px;
		display: flex;
		flex-direction: column;
	}

	.bp-reader-entry-title {
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		color: #1A1C1E;
	}

	.bp-reader-entry-caption {
		margin-top: 4px;
		font-size: 12px;
		line-height: 18px;
		color: #8E8E93;
	}

	.bp-reader-entry-arrow {
		flex-shrink: 0;
	}

	.expiry-notice {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin: -4px 0 12px;
		box-sizing: border-box;
	}

	.expiry-notice-text {
		font-size: 13px;
		line-height: 18px;
		font-weight: 600;
		color: #E02020;
		text-align: center;
	}

	.bp-brand-banner {
		display: block;
		width: 100%;
		margin: 0 0 12px;
		border-radius: 16px;
	}

	.buttonstylesds {
		margin: 20px 50px 20px 50px;
		border-radius: 30px;
		background: #3298F7;
		color: white;
	}
</style>