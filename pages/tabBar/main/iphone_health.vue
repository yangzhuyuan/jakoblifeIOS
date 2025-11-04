<template>
	<view class="health-container">
		<!-- 顶部状态栏 -->
		<view class="status-bar">
			<text class="app-title">JakobLife - 健康数据</text>
			<view class="auth-status">
				<text :class="['status-dot', isAuthorized ? 'authorized' : 'unauthorized']"></text>
				<text class="status-text">{{ isAuthorized ? '已授权' : '未授权' }}</text>
			</view>
		</view>

		<!-- 授权区域 -->
		<view class="auth-section" v-if="!isAuthorized">
			<view class="auth-card">
				<image src="/static/health-icon.png" class="health-icon" mode="aspectFit"></image>
				<text class="auth-title">健康数据访问权限</text>
				<text class="auth-desc">为了给您提供准确的健康数据分析，我们需要访问您的健康数据</text>

				<button class="auth-button" @click="handleAuthorization" :disabled="loading"
					:class="{ 'loading': loading }">
					<text v-if="!loading">授权 HealthKit</text>
					<text v-else>授权中...</text>
				</button>

				<view v-if="authResult" class="auth-result">
					<text :class="['result-message', authResult.success ? 'success' : 'error']">
						{{ authResult.message }}
					</text>
				</view>
			</view>
		</view>

		<!-- 数据展示区域 -->
		<view class="data-section" v-else>
			<!-- 数据概览 -->
			<view class="overview-cards">
				<view class="overview-card steps">
					<text class="card-value">{{ overviewData.steps || 0 }}</text>
					<text class="card-label">今日步数</text>
					<text class="card-unit">步</text>
				</view>

				<view class="overview-card distance">
					<text class="card-value">{{ (overviewData.distance / 1000).toFixed(1) }}</text>
					<text class="card-label">行走距离</text>
					<text class="card-unit">公里</text>
				</view>

				<view class="overview-card calories">
					<text class="card-value">{{ overviewData.calories || 0 }}</text>
					<text class="card-label">消耗卡路里</text>
					<text class="card-unit">千卡</text>
				</view>
			</view>

			<!-- 详细数据 -->
			<view class="detail-cards">
				<view class="detail-card">
					<view class="card-header">
						<text class="card-title">心率</text>
						<text class="card-time">最近测量</text>
					</view>
					<view class="card-content">
						<text class="detail-value">{{ overviewData.heartRate || '--' }}</text>
						<text class="detail-unit">BPM</text>
					</view>
				</view>

				<view class="detail-card">
					<view class="card-header">
						<text class="card-title">体重</text>
						<text class="card-time">最近记录</text>
					</view>
					<view class="card-content">
						<text class="detail-value">{{ overviewData.bodyMass || '--' }}</text>
						<text class="detail-unit">kg</text>
					</view>
				</view>

				<view class="detail-card">
					<view class="card-header">
						<text class="card-title">身高</text>
						<text class="card-time">最近记录</text>
					</view>
					<view class="card-content">
						<text class="detail-value">{{ overviewData.height || '--' }}</text>
						<text class="detail-unit">cm</text>
					</view>
				</view>

				<view class="detail-card">
					<view class="card-header">
						<text class="card-title">睡眠</text>
						<text class="card-time">昨晚</text>
					</view>
					<view class="card-content">
						<text class="detail-value">{{ overviewData.sleep || '--' }}</text>
						<text class="detail-unit">小时</text>
					</view>
				</view>
			</view>

			<!-- 步数趋势 -->
			<view class="trend-section" v-if="stepTrends.length > 0">
				<view class="section-header">
					<text class="section-title">最近7天步数趋势</text>
					<button class="refresh-btn" @click="refreshData" :disabled="refreshing">
						<text>{{ refreshing ? '更新中...' : '更新数据' }}</text>
					</button>
				</view>

				<view class="trend-chart">
					<view v-for="(day, index) in stepTrends" :key="index" class="chart-bar">
						<view class="bar-fill" :style="{ height: calculateBarHeight(day.steps) + '%' }"
							:class="{ 'error-bar': day.error }"></view>
						<text class="bar-label">{{ day.steps }}</text>
						<text class="bar-date">{{ day.formattedDate }}</text>
					</view>
				</view>
			</view>

			<!-- 操作按钮 -->
			<view class="action-buttons">
				<button class="action-btn secondary" @click="reauthorize">
					<text>重新授权</text>
				</button>
				<button class="action-btn primary" @click="refreshAllData">
					<text>同步最新数据</text>
				</button>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-if="globalLoading" class="loading-overlay">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载健康数据中...</text>
		</view>
	</view>
</template>

<script>
	import healthKitManager from '../../api/unitls/healthKit.js';

	export default {
		data() {
			return {
				loading: false,
				refreshing: false,
				globalLoading: false,
				isAuthorized: false,
				authResult: null,
				overviewData: {
					steps: 0,
					distance: 0,
					calories: 0,
					heartRate: null,
					bodyMass: null,
					height: null,
					sleep: null
				},
				stepTrends: []
			};
		},

		onLoad() {
			this.initHealthData();
		},

		onShow() {
			// 页面显示时检查授权状态
			this.checkAuthStatus();
		},

		methods: {
			/**
			 * 初始化健康数据
			 */
			async initHealthData() {
				this.globalLoading = true;

				try {
					// 检查 HealthKit 可用性
					if (!healthKitManager.checkAvailability()) {
						this.showError('当前设备不支持 HealthKit 功能');
						return;
					}

					// 检查授权状态
					await this.checkAuthStatus();

				} catch (error) {
					console.error('初始化健康数据失败:', error);
					this.showError('初始化失败: ' + error.message);
				} finally {
					this.globalLoading = false;
				}
			},

			/**
			 * 检查授权状态
			 */
			async checkAuthStatus() {
				try {
					// 这里可以根据实际需求添加更详细的授权状态检查
					this.isAuthorized = healthKitManager.getAuthorizationStatus();

					if (this.isAuthorized) {
						await this.loadHealthData();
					}
				} catch (error) {
					console.error('检查授权状态失败:', error);
				}
			},

			/**
			 * 处理授权请求
			 */
			async handleAuthorization() {
				this.loading = true;
				this.authResult = null;

				try {
					const result = await healthKitManager.safeRequestAuthorization();

					this.authResult = {
						success: true,
						message: 'HealthKit 授权成功！现在可以访问您的健康数据了。'
					};

					this.isAuthorized = true;

					// 授权成功后加载数据
					await this.loadHealthData();

					uni.showToast({
						title: '授权成功',
						icon: 'success',
						duration: 2000
					});

				} catch (error) {
					this.authResult = {
						success: false,
						message: error.message
					};

					uni.showToast({
						title: '授权失败',
						icon: 'none',
						duration: 3000
					});
				} finally {
					this.loading = false;
				}
			},

			/**
			 * 加载健康数据
			 */
			async loadHealthData() {
				this.globalLoading = true;

				try {
					// 获取今日数据
					const todayData = await healthKitManager.getAllHealthData();
					this.updateOverviewData(todayData);

					// 获取步数趋势
					const trends = await healthKitManager.getLast7DaysStepCount();
					this.stepTrends = trends;

				} catch (error) {
					console.error('加载健康数据失败:', error);
					this.showError('加载数据失败: ' + error.message);
				} finally {
					this.globalLoading = false;
				}
			},

			/**
			 * 更新概览数据
			 */
			updateOverviewData(data) {
				this.overviewData = {
					steps: data.steps?.value || 0,
					distance: data.distance?.value || 0,
					calories: data.calories?.value || 0,
					heartRate: data.heartRate?.value || null,
					bodyMass: data.bodyMass?.value || null,
					height: data.height?.value || null,
					sleep: data.sleep?.value || null
				};
			},

			/**
			 * 计算柱状图高度
			 */
			calculateBarHeight(steps) {
				if (!steps || steps === 0) return 5;

				const maxSteps = Math.max(...this.stepTrends.map(day => day.steps).filter(s => s > 0));
				if (maxSteps === 0) return 5;

				return Math.max(5, (steps / maxSteps) * 90);
			},

			/**
			 * 刷新数据
			 */
			async refreshData() {
				this.refreshing = true;

				try {
					const trends = await healthKitManager.getLast7DaysStepCount();
					this.stepTrends = trends;

					uni.showToast({
						title: '数据已更新',
						icon: 'success'
					});
				} catch (error) {
					console.error('刷新数据失败:', error);
					this.showError('更新失败: ' + error.message);
				} finally {
					this.refreshing = false;
				}
			},

			/**
			 * 刷新所有数据
			 */
			async refreshAllData() {
				this.globalLoading = true;

				try {
					await this.loadHealthData();
					uni.showToast({
						title: '数据同步完成',
						icon: 'success'
					});
				} catch (error) {
					console.error('刷新所有数据失败:', error);
					this.showError('同步失败: ' + error.message);
				} finally {
					this.globalLoading = false;
				}
			},

			/**
			 * 重新授权
			 */
			reauthorize() {
				this.isAuthorized = false;
				this.authResult = null;
				this.overviewData = {
					steps: 0,
					distance: 0,
					calories: 0,
					heartRate: null,
					bodyMass: null,
					height: null,
					sleep: null
				};
				this.stepTrends = [];
			},

			/**
			 * 显示错误信息
			 */
			showError(message) {
				uni.showModal({
					title: '提示',
					content: message,
					showCancel: false
				});
			}
		}
	};
</script>

<style scoped>
	.health-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20rpx;
	}

	/* 状态栏 */
	.status-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.app-title {
		font-size: 36rpx;
		font-weight: bold;
		color: white;
	}

	.auth-status {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.2);
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
	}

	.status-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.status-dot.authorized {
		background: #4CAF50;
	}

	.status-dot.unauthorized {
		background: #FF9800;
	}

	.status-text {
		font-size: 24rpx;
		color: white;
	}

	/* 授权区域 */
	.auth-section {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 70vh;
	}

	.auth-card {
		background: white;
		border-radius: 24rpx;
		padding: 60rpx 40rpx;
		text-align: center;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
		max-width: 600rpx;
	}

	.health-icon {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 30rpx;
	}

	.auth-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 20rpx;
	}

	.auth-desc {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
		display: block;
		margin-bottom: 50rpx;
	}

	.auth-button {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 16rpx;
		padding: 24rpx 48rpx;
		font-size: 32rpx;
		font-weight: 500;
		margin-bottom: 30rpx;
	}

	.auth-button.loading {
		opacity: 0.7;
	}

	.auth-button:disabled {
		background: #ccc;
	}

	.auth-result {
		margin-top: 20rpx;
		padding: 20rpx;
		border-radius: 12rpx;
		background: #f8f9fa;
	}

	.result-message.success {
		color: #4CAF50;
		font-size: 26rpx;
	}

	.result-message.error {
		color: #F44336;
		font-size: 26rpx;
	}

	/* 数据展示区域 */
	.data-section {
		background: white;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-top: 20rpx;
	}

	/* 概览卡片 */
	.overview-cards {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
		gap: 20rpx;
	}

	.overview-card {
		flex: 1;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 16rpx;
		padding: 30rpx 20rpx;
		text-align: center;
		color: white;
		position: relative;
		overflow: hidden;
	}

	.overview-card::before {
		content: '';
		position: absolute;
		top: -50%;
		right: -50%;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.1);
		transform: rotate(45deg);
	}

	.overview-card.steps {
		background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
	}

	.overview-card.distance {
		background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
	}

	.overview-card.calories {
		background: linear-gradient(135deg, #FFD93D 0%, #FF9C3D 100%);
	}

	.card-value {
		font-size: 48rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 8rpx;
	}

	.card-label {
		font-size: 24rpx;
		opacity: 0.9;
		display: block;
		margin-bottom: 4rpx;
	}

	.card-unit {
		font-size: 20rpx;
		opacity: 0.7;
	}

	/* 详细数据卡片 */
	.detail-cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20rpx;
		margin-bottom: 40rpx;
	}

	.detail-card {
		background: #f8f9fa;
		border-radius: 16rpx;
		padding: 30rpx;
		border-left: 6rpx solid #667eea;
	}

	.detail-card:nth-child(2) {
		border-left-color: #4CAF50;
	}

	.detail-card:nth-child(3) {
		border-left-color: #FF9800;
	}

	.detail-card:nth-child(4) {
		border-left-color: #9C27B0;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.card-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	.card-time {
		font-size: 22rpx;
		color: #999;
	}

	.card-content {
		display: flex;
		align-items: baseline;
	}

	.detail-value {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-right: 10rpx;
	}

	.detail-unit {
		font-size: 24rpx;
		color: #666;
	}

	/* 趋势区域 */
	.trend-section {
		margin-bottom: 40rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.refresh-btn {
		background: #667eea;
		color: white;
		border: none;
		border-radius: 12rpx;
		padding: 16rpx 24rpx;
		font-size: 24rpx;
	}

	.refresh-btn:disabled {
		background: #ccc;
	}

	.trend-chart {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		height: 200rpx;
		padding: 20rpx 0;
	}

	.chart-bar {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		margin: 0 8rpx;
	}

	.bar-fill {
		width: 80%;
		background: linear-gradient(to top, #667eea, #764ba2);
		border-radius: 8rpx 8rpx 0 0;
		min-height: 10rpx;
		transition: height 0.3s ease;
	}

	.bar-fill.error-bar {
		background: #FF6B6B;
	}

	.bar-label {
		font-size: 20rpx;
		color: #666;
		margin-top: 10rpx;
	}

	.bar-date {
		font-size: 18rpx;
		color: #999;
		margin-top: 5rpx;
	}

	/* 操作按钮 */
	.action-buttons {
		display: flex;
		gap: 20rpx;
	}

	.action-btn {
		flex: 1;
		border: none;
		border-radius: 16rpx;
		padding: 24rpx;
		font-size: 28rpx;
		font-weight: 500;
	}

	.action-btn.primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.action-btn.secondary {
		background: #f8f9fa;
		color: #667eea;
		border: 2rpx solid #667eea;
	}

	/* 加载状态 */
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.loading-spinner {
		width: 80rpx;
		height: 80rpx;
		border: 6rpx solid #f3f3f3;
		border-top: 6rpx solid #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 30rpx;
	}

	.loading-text {
		color: white;
		font-size: 28rpx;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* 响应式设计 */
	@media (max-width: 750rpx) {
		.overview-cards {
			flex-direction: column;
		}

		.detail-cards {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			flex-direction: column;
		}
	}
</style>