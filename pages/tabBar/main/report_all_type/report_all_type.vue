<template>
	<view class="report-page">
		<view class="wave"></view>
		<view class="hs-header">
			<view class="report-header">
				<text class="report-title">{{ $t('监测报告') }}</text>
				<text class="report-subtitle">{{ $t('查看不同时间范围内的测量数据与趋势') }}</text>
			</view>
			<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
		</view>
		<view class="report-card" @click="clickset(24)">
			<image src="/static/page_icon/baogao_1.png" class="report-icon" mode="aspectFit"></image>
			<view class="report-info">
				<text class="report-card-title">{{ $t('小时监测报告24') }}</text>
				<text class="report-card-desc">{{ $t('查看白天及夜间记录的测量数据') }}</text>
			</view>
			<uni-icons type="right" size="16" color="#C0C8D4"></uni-icons>
		</view>

		<view class="report-card" @click="clickset(7)">
			<image src="/static/page_icon/baogao_2.png" class="report-icon" mode="aspectFit"></image>
			<view class="report-info">
				<text class="report-card-title">{{ $t('天监测报告7') }}</text>
				<text class="report-card-desc">{{ $t('查看过去7天的数据变化与趋势') }}</text>
			</view>
			<uni-icons type="right" size="16" color="#C0C8D4"></uni-icons>
		</view>

		<view class="report-card" @click="goToSupplement">
			<image src="/static/page_icon/baogao_3.png" class="report-icon" mode="aspectFit"></image>
			<view class="report-info">
				<text class="report-card-title">{{ $t('连续血压监控详细风险报告') }}</text>
				<text class="report-card-desc">{{ $t('查看连续血压监测的详细数据趋势') }}</text>
			</view>
			<uni-icons type="right" size="16" color="#C0C8D4"></uni-icons>
		</view>

		<view class="report-card" @click="goToSupplementdata">
			<image src="/static/page_icon/baogao_4.png" class="report-icon" mode="aspectFit"></image>
			<view class="report-info">
				<text class="report-card-title">{{ $t('无感血压报告') }}</text>
				<text class="report-card-desc">{{ $t('查看可用的夜间无气囊充气血压估算与趋势') }}</text>
			</view>
			<uni-icons type="right" size="16" color="#C0C8D4"></uni-icons>
		</view>

		<view class="report-tip">
			<uni-icons type="info" size="16" color="#3298F7"></uni-icons>
			<text class="report-tip-text">{{ $t('报告仅用于查看测量数据和趋势分析') }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("报告")
			})
		},
		methods: {
			clickset(type) {
				uni.navigateTo({
					url: '../../main/globalweather/Personal_Information?type=' + type
				})
			},
			goToSupplement() {
				uni.navigateTo({
					url: '/pages/tabBar/tendency/supplement'
				})
			},
			goToSupplementdata() {
				uni.navigateTo({
					url: '/pages/tabBar/main/report_all_type/Smooth_BP_Data'
				})
			}
		}
	}
</script>

<style scoped>
	.report-page {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		padding: 20px 16px 40px;
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

	.report-header {
		margin-top: 20px;
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

	.report-title {
		display: block;
		font-size: 24px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.report-subtitle {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.report-card {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		border-radius: 16px;
		padding: 16px;
		margin-bottom: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.report-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		flex-shrink: 0;
	}

	.report-info {
		flex: 1;
		margin: 0 12px;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.report-card-title {
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.35;
	}

	.report-card-desc {
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.report-tip {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #eaf4ff;
		border: 1px solid #d6e9ff;
		border-radius: 14px;
		padding: 12px 14px;
		margin-top: 8px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.report-tip-text {
		flex: 1;
		margin-left: 8px;
		font-size: 13px;
		color: #3298F7;
		line-height: 1.4;
	}
</style>