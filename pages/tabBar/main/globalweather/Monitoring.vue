<template>
	<view class="monitor-page">
		<view class="wave"></view>
		<view class="hs-header">
			<view class="monitor-header">
				<text class="monitor-title">{{ $t('监测与定时设置') }}</text>
				<text class="monitor-subtitle">{{ $t('管理自动测量及相关报告') }}</text>
			</view>
			<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
		</view>
		<view class="monitor-card" @click="goToReport">
			<view class="monitor-icon-wrap">
				<image src="/static/page_icon/jiance_2.png" class="monitor-icon" mode="aspectFit"></image>
			</view>
			<view class="monitor-info">
				<text class="monitor-card-title">{{ $t('小时监测报告724') }}</text>
				<text class="monitor-card-desc">{{ $t('查看定时监测生成的报告') }}</text>
			</view>
			<view class="monitor-right">
				<text class="monitor-status status-view">{{ $t('查看') }}</text>
				<uni-icons type="right" size="14" color="#C0C8D4"></uni-icons>
			</view>
		</view>

		<view class="monitor-card" @click="goToTest">
			<view class="monitor-icon-wrap">
				<image src="/static/page_icon/jiance_1.png" class="monitor-icon" mode="aspectFit"></image>
			</view>
			<view class="monitor-info">
				<text class="monitor-card-title">{{ $t('无压血压测试') }}</text>
				<text class="monitor-card-desc">{{ $t('配置夜间无气囊充气测量估算') }}</text>
			</view>
			<view class="monitor-right">
				<text class="monitor-status">{{ $t('关闭') }}</text>
				<uni-icons type="right" size="14" color="#C0C8D4"></uni-icons>
			</view>
		</view>

		<view v-if="isZh" class="monitor-card" @click="goToPulseDiagnosis">
			<view class="monitor-icon-wrap">
				<image src="/static/page_icon/jiance_6.png" class="monitor-icon" mode="aspectFit"></image>
			</view>
			<view class="monitor-info">
				<text class="monitor-card-title">中医脉诊健康管理（仅支持U19M模型）</text>
			</view>
			<view class="monitor-right">
				<text class="monitor-status status-view">{{ $t('查看') }}</text>
				<uni-icons type="right" size="14" color="#C0C8D4"></uni-icons>
			</view>
		</view>

		<view v-show="!bpTimerDisabled" class="monitor-card" @click="goToTimer">
			<view class="monitor-icon-wrap">
				<image src="/static/page_icon/jiance_3.png" class="monitor-icon" mode="aspectFit"></image>
			</view>
			<view class="monitor-info">
				<text class="monitor-card-title">{{ $t('血压定时测量开关') }}</text>
				<text class="monitor-card-desc">{{ $t('选择设备自动测量血压的时间') }}</text>
			</view>
			<view class="monitor-right">
				<text class="monitor-status">{{ $t('未设置') }}</text>
				<uni-icons type="right" size="14" color="#C0C8D4"></uni-icons>
			</view>
		</view>

		<view class="monitor-tip">
			<view class="monitor-tip-left">
				<view class="monitor-tip-header">
					<uni-icons type="info" size="16" color="#3298F7"></uni-icons>
					<text class="monitor-tip-title">{{ $t('开始前请注意') }}</text>
				</view>
				<text class="monitor-tip-text">{{ $t('请正确佩戴设备并确保电量充足以便定时监测') }}</text>
			</view>
			<image src="/static/page_icon/jiance_4.png" class="monitor-tip-img" mode="aspectFit"></image>
		</view>

		<view class="manage-btn" hover-class="manage-btn-hover" @click="goToDevices">
			<view class="manage-btn-center">
				<view class="manage-btn-icon">
					<view class="manage-btn-phone"></view>
					<view class="manage-btn-watch"></view>
				</view>
				<text class="manage-btn-text">{{ $t('管理设备') }}</text>
			</view>
			<text class="manage-btn-arrow">›</text>
		</view>
	</view>
</template>

<script>
	import {
		u16proBLE
	} from '../../../api/protocol/u16pro-ble-manager.js'
	export default {
		data() {
			const lan = uni.getLocale();
			return {
				devicetype: true,
				// 绑定设备不包含 BPW1(30000) 时禁止血压定时测量
				bpTimerDisabled: true,
				BPW6deviceId: uni.getStorageSync("BPW6devicemac"),
				isZh: lan === 'zh-Hans' || lan === 'zh-Hant',
			}
		},
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("定时监测")
			})
		},
		onLoad(options) {
			// console.log("onLoad", options)
			// 原有逻辑：仅 BPW6 单设备时，子页面走 BPW6 通道
			if (options.devicetype === "30001" && options.devicetypelist === "1") {
				this.devicetype = true
			} else {
				this.devicetype = false
			}
			// 不包含 BPW1 时禁止「血压定时测量开关」及相关提示
			if (options.hasBpw1 !== undefined) {
				this.bpTimerDisabled = String(options.hasBpw1) !== '1'
			} else {
				this.bpTimerDisabled = String(options.devicetype) !== '30000'
			}
		},

		methods: {
			// 跳转到监测报告页面
			goToReport() {
				uni.navigateTo({
					url: '../../main/globalweather/quick_index?devicetype=' + this.devicetype
				})
			},
			// 跳转到定时测量开关页面
			goToTimer() {
				uni.navigateTo({
					url: '../../main/globalweather/custom_index'
				})
			},
			// 跳转到无感定时测量设置（只显示无感）
			goToTest() {
				uni.navigateTo({
					url: '../../main/sleep_report/Reports_Alerts_new?scheduleMode=sensorless&devicetype=' + this
						.devicetype
				})
			},
			// 跳转到脉诊健康管理
			goToPulseDiagnosis() {
				uni.navigateTo({
					url: '/pages/tabBar/main/Pulsediagnosis'
				})
			},
			goToDevices() {
				uni.navigateTo({
					url: '/pages/tabBar/my/Equipment_management1'
				})
			},
			async PPGliji() {
				await new Promise(resolve => setTimeout(resolve, 300))
				try {
					const result = await u16proBLE.startPPGMeasurement(this.BPW6deviceId)
					console.log('【BPW6】PPG测量启动结果', result)
					if (!result || !result.success) {
						uni.showToast({
							title: u16proBLE.getPpgStartHint(result),
							icon: 'none',
							duration: 3000
						})
					} else {
						uni.showToast({
							title: this.$t('PPG测量已开启'),
							icon: 'success'
						})
					}
				} catch (ppgErr) {
					console.error('【BPW6】PPG测量启动失败', ppgErr)
					uni.showToast({
						title: ppgErr.message || this.$t('PPG通信失败'),
						icon: 'none'
					})
				}
			},
			async PPGlijitime() {
				await new Promise(resolve => setTimeout(resolve, 300))
				try {
					const result = await u16proBLE.startPPGMeasurementWithDuration(30, this.BPW6deviceId)
					console.log('【BPW6】PPG测量启动结果', result)
					if (!result || !result.success) {
						uni.showToast({
							title: u16proBLE.getPpgStartHint(result),
							icon: 'none',
							duration: 3000
						})
					} else {
						uni.showToast({
							title: this.$t('PPG测量已开启'),
							icon: 'success'
						})
					}
				} catch (ppgErr) {
					console.error('【BPW6】PPG测量启动失败', ppgErr)
					uni.showToast({
						title: ppgErr.message || this.$t('PPG通信失败'),
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style scoped>
	.monitor-page {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		padding: 16px 16px 40px;
		box-sizing: border-box;
	}

	.wave {
		position: absolute;
		top: -180rpx;
		left: -120rpx;
		width: 560rpx;
		height: 420rpx;
		background: radial-gradient(ellipse at center, #FFFFFF 0%, rgba(255, 255, 255, 0.55) 46%, rgba(244, 248, 252, 0) 72%);
		pointer-events: none;
		z-index: 0;
	}

	.monitor-header {
		margin-top: 8px;
		margin-bottom: 18px;
		padding: 0 2px;
	}

	.hs-header {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 28rpx;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.monitor-title {
		display: block;
		font-size: 24px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.monitor-subtitle {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.monitor-card {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		border-radius: 18px;
		padding: 16px;
		margin-bottom: 20px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.monitor-icon-wrap {
		width: 58px;
		height: 58px;
		border-radius: 20%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border: 1px solid #eaf4ff;
		overflow: hidden;
	}

	.monitor-icon {
		width: 58px;
		height: 58px;
	}

	.monitor-icon-wrap-2 {
		width: 38px;
		height: 38px;
		border-radius: 20%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}

	.monitor-icon_2 {
		width: 38px;
		height: 38px;
	}

	.monitor-info {
		flex: 1;
		min-width: 0;
		margin: 0 12px;
		display: flex;
		flex-direction: column;
	}

	.monitor-card-title {
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.monitor-card-desc {
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.monitor-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-shrink: 0;
	}

	.monitor-status {
		font-size: 12px;
		color: #8a94a6;
		margin-right: 4px;
		padding: 4px 10px;
		border-radius: 12px;
		background: #f0f2f5;
		line-height: 1.2;
	}

	.status-view {
		color: #3298F7;
		background: #eaf4ff;
	}

	.monitor-tip {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #eaf4ff;
		border-radius: 16px;
		padding: 14px 16px;
		margin-top: 8px;
		margin-bottom: 20px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.monitor-tip-left {
		flex: 1;
		min-width: 0;
		padding-right: 10px;
	}

	.monitor-tip-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 6px;
	}

	.monitor-tip-title {
		margin-left: 6px;
		font-size: 14px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.2;
	}

	.monitor-tip-text {
		display: block;
		font-size: 12px;
		color: #5c677a;
		line-height: 1.5;
	}

	.monitor-tip-img {
		width: 56px;
		height: 56px;
		flex-shrink: 0;
		border-radius: 50%;
		border: 1px solid #eaf4ff;
	}

	.manage-btn {
		position: relative;
		width: 100%;
		height: 58px;
		margin: 0;
		padding: 0 18px;
		background: #3298F7;
		border-radius: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.manage-btn::after {
		border: none;
	}

	.manage-btn-center {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.manage-btn-icon {
		width: 40rpx;
		height: 40rpx;
		position: relative;
		margin-right: 16rpx;
		flex-shrink: 0;
	}

	.manage-btn-phone {
		position: absolute;
		left: 0;
		top: 4rpx;
		width: 22rpx;
		height: 32rpx;
		border: 3rpx solid #FFFFFF;
		border-radius: 6rpx;
		box-sizing: border-box;
	}

	.manage-btn-watch {
		position: absolute;
		right: 0;
		bottom: 2rpx;
		width: 20rpx;
		height: 20rpx;
		border: 3rpx solid #FFFFFF;
		border-radius: 6rpx;
		background: #2F6BFF;
		box-sizing: border-box;
	}

	.manage-btn-text {
		font-size: 30rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 1.2;
	}

	.manage-btn-arrow {
		position: absolute;
		right: 18px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 30px;
		color: #FFFFFF;
		font-weight: 300;
		line-height: 1;
	}
</style>