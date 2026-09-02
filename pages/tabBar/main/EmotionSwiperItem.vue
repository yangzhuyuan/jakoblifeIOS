<template>
	<view>
		<view class="emotion-top-section">
			<view class="hs-header">
				<view class="emotion-header">
					<text class="emotion-title">{{ $t('心理健康趋势') }}</text>
					<text class="emotion-subtitle">{{ $t('近期情绪与健康趋势') }}</text>
				</view>
				<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			</view>
			<view class="emotion-main-card">
				<view class="emotion-track-row" hover-class="emotion-track-row-hover"
					:class="{ 'emotion-track-disabled': sleep_alertdisabled }"
					@click="!sleep_alertdisabled && $emit('setting')">
					<view class="emotion-track-icon">
						<uni-icons type="heart-filled" size="20" color="#ffffff"></uni-icons>
					</view>
					<view class="emotion-track-info">
						<text class="emotion-track-title">{{ $t('自动情绪追踪') }}</text>
						<text class="emotion-track-desc">{{ $t('使用可用的HRV测量数据') }}</text>
					</view>
					<view class="emotion-track-btn">{{ $t('去开启') }}</view>
				</view>

				<button class="emotion-check-btn" @click="$emit('sleep-alert')"
					:disabled="sleep_alertdisabled">{{ $t('立即检测') }}</button>
			</view>
			<view class="emotion-tip-card">
				<uni-icons type="info" size="18" color="#3298F7"></uni-icons>
				<text class="emotion-tip-text">{{ $t('重要提示本报告结果由算法生成') }}</text>
			</view>
		</view>
		<view class="data_bg_ppg_set">
			<!-- 今日健康摘要 / 心情 -->
			<view v-show="ppgnewpoint" class="summary-card">
				<text class="summary-card-title">{{ $t('今日健康摘要') }}</text>
				<view class="summary-row">
					<view class="summary-icon summary-icon-green">😊</view>
					<view class="summary-info">
						<text class="summary-row-title">{{ $t('心情状态评估') }}</text>
						<text class="summary-row-desc">{{ mood_Description }}</text>
					</view>
				</view>
				<view class="summary-divider"></view>
				<view class="summary-row">
					<view class="summary-icon summary-icon-blue">📊</view>
					<view class="summary-info">
						<text class="summary-row-title">{{ $t('心情指数') }}</text>
						<text class="summary-row-value">{{ ppgnewpoint }}</text>
					</view>
					<!-- <uni-icons type="right" size="14" color="#C0C8D4"></uni-icons> -->
				</view>
				<view class="summary-divider"></view>
				<view class="summary-row">
					<view class="summary-icon summary-icon-yellow">●</view>
					<view class="summary-info">
						<text class="summary-row-title">{{ $t('近期变化') }}</text>
						<text class="summary-row-desc">{{ mood_level }}</text>
					</view>
					<!-- <uni-icons type="right" size="14" color="#C0C8D4"></uni-icons> -->
				</view>
			</view>

			<!-- 心理健康评估 -->
			<view v-show="depression_risk_score" class="summary-card">
				<text class="summary-card-title">{{ $t('心理健康评估') }}</text>
				<view class="summary-row">
					<view class="summary-icon summary-icon-blue">🧠</view>
					<view class="summary-info">
						<text class="summary-row-title">{{ $t('抑郁风险评分') }}</text>
						<text class="summary-row-value">{{ depression_risk_score }}</text>
					</view>
				</view>
				<view class="summary-divider"></view>
				<view class="summary-row">
					<view class="summary-icon summary-icon-purple">📋</view>
					<view class="summary-info">
						<text class="summary-row-title">{{ $t('抑郁风险等级') }}</text>
						<text class="summary-row-desc">{{ depression_risk_level }}</text>
					</view>
					<button class="summary-link-btn" @click="$emit('xiangxibaogo')"
						:disabled="baoggaodisabled">{{ $t('详细报告') }}</button>
				</view>
				<view v-if="!finalResult" class="summary-hint">
					({{ $t('需要两周以上测试数据进行评估') }})
				</view>
				<button v-else class="summary-primary-btn" @click="$emit('pingfentiaozhuan')">
					{{ $t('进行进一步风险评估') }}
				</button>
			</view>

			<!-- 综合健康指标 -->
			<view v-show="stress_Index||fatigue_index||recovery_index" class="summary-card">
				<view class="summary-card-title-row">
					<text class="summary-card-title">{{ $t('综合健康指标') }}</text>
					<view class="summary-help" @click="$emit('health-explanation')">
						<uni-icons type="help" size="18" color="#8a94a6"></uni-icons>
					</view>
				</view>
				<view class="summary-row">
					<view class="summary-icon summary-icon-red">🔥</view>
					<view class="summary-info">
						<text class="summary-row-title">{{ $t('压力指数') }}</text>
						<text class="summary-row-value">{{ stress_Index }}/10</text>
						<text v-show="stress_Index>=5&&sleep_point<70 && sleep_point!=='--/--'"
							class="summary-row-tip">{{ $t('高压力睡眠碎片化') }}</text>
					</view>
				</view>
				<view class="summary-divider"></view>
				<view class="summary-row">
					<view class="summary-icon summary-icon-orange">😴</view>
					<view class="summary-info">
						<text class="summary-row-title">{{ $t('疲劳指数') }}</text>
						<text class="summary-row-value">{{ fatigue_index }}/10</text>
						<text v-if="fatigue_index>=5&&sleep_point<60&&sleep_point!=='--/--'"
							class="summary-row-tip">{{ $t('高疲劳睡眠时长不足') }}</text>
						<text v-else-if="fatigue_index>=5&&(sleep_point<80&&sleep_point>60)&&sleep_point!=='--/--'"
							class="summary-row-tip">{{ $t('高疲劳深睡比例异常') }}</text>
					</view>
				</view>
				<view class="summary-divider"></view>
				<view class="summary-row">
					<view class="summary-icon summary-icon-teal">💪</view>
					<view class="summary-info">
						<text class="summary-row-title">{{ $t('恢复指数') }}</text>
						<text class="summary-row-value">{{ recovery_index }}</text>
					</view>
				</view>
			</view>

			<!-- AI 健康趋势分析 + 紧急提示 -->
			<view class="ai-insight-card">
				<view class="ai-insight-header">
					<view class="ai-insight-avatar">
						<image src="/static/page_icon/app_icon_all.jpg" class="steps-icon-img" mode="aspectFit"></image>
					</view>
					<view class="ai-insight-header-text">
						<text class="ai-insight-title">{{ $t('AI健康趋势分析') }}</text>
						<text class="ai-insight-text">{{ aiInsightText }}</text>
					</view>
				</view>
				<view class="ai-detail-btn" @click="goTrendDetail">
					<text class="ai-detail-btn-text">{{ $t('查看详细趋势') }}</text>
					<text class="ai-detail-btn-arrow">›</text>
				</view>
			</view>

			<view class="emergency-card">
				<view class="emergency-icon">⚠️
					<!-- <image src="/static/icons/add.png" class="emergency-plus" mode="aspectFit"></image> -->
				</view>
				<text class="emergency-text">{{ $t('紧急帮助提示') }}</text>
			</view>

			<!-- <view class="chart-wrap-card">
				<view class="pagedsismj_4">
					<picker style="flex: 2;" @change="$emit('types-change', $event)" :value="types_index"
						:range="types_array">
						<view style="font-size: 14px;color: white;">
							{{types_array[types_index]}}
						</view>
					</picker>
					<picker @change="$emit('types-change', $event)" :value="types_index" :range="types_array">
						<uni-icons style="flex: 1;" type="bottom" size="18" color="white"></uni-icons>
					</picker>
				</view>
				<view
					style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
					{{$t('当天')}}：
				</view>
				<view class="charts-box-ppg">
					<qiun-data-charts type="line" :opts="optsPPG" :chartData="chartDataPPG" />
				</view>
				<view
					style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
					{{$t('两周')}}：{{$t('平均')}}
				</view>
				<view class="charts-box-ppg">
					<qiun-data-charts type="line" :opts="optsPPG2" :chartData="chartDataPPG2" />
				</view>
				<view style="margin-top: 20px; width: 100%;height: 1px; background: gray;">
				</view>
				<view class="page-transparent">
					<view style="font-size: 17px; font-weight: 600;display: flex;justify-content: center;">
						{{$t("指标阈值表")}}
					</view>
					<view class="table-box">
						<view class="thead">
							<text class="th">{{$t("指标名称")}}</text>
							<text class="th">{{$t("阈值")}}</text>
							<text class="th">{{$t("对应描述")}}</text>
						</view>
						<view class="tbody" v-for="(row, i) in Indicatorlist" :key="i">
							<text class="td">{{ row.zh }}</text>
							<text class="td">
								<text :class="row.red ? 'red' : ''">{{ row.val }}</text>
							</text>
							<text class="td">
								<text :class="row.red ? 'red' : ''">{{ row.desc }}</text>
							</text>
						</view>
					</view>
				</view>
			</view>
		 -->
		</view>
	</view>
</template>

<script>
	export default {
		name: 'EmotionSwiperItem',
		props: {
			sleep_alertdisabled: {
				type: Boolean,
				default: false
			},
			ppgnewpoint: {
				type: [String, Number],
				default: ''
			},
			mood_Description: {
				type: String,
				default: ''
			},
			mood_level: {
				type: String,
				default: ''
			},
			depression_risk_score: {
				type: [String, Number],
				default: ''
			},
			baoggaodisabled: {
				type: Boolean,
				default: true
			},
			depression_risk_level: {
				type: String,
				default: ''
			},
			finalResult: {
				type: Boolean,
				default: false
			},
			stress_Index: {
				type: [String, Number],
				default: ''
			},
			fatigue_index: {
				type: [String, Number],
				default: ''
			},
			recovery_index: {
				type: [String, Number],
				default: ''
			},
			sleep_point: {
				type: [String, Number],
				default: '--/--'
			},
			fenxi: {
				type: String,
				default: ''
			},
			types_index: {
				type: Number,
				default: 0
			},
			types_array: {
				type: Array,
				default: () => []
			},
			chartDataPPG: {
				type: Object,
				default: () => ({})
			},
			optsPPG: {
				type: Object,
				default: () => ({})
			},
			chartDataPPG2: {
				type: Object,
				default: () => ({})
			},
			optsPPG2: {
				type: Object,
				default: () => ({})
			},
			Indicatorlist: {
				type: Array,
				default: () => []
			}
		},
		computed: {
			aiInsightText() {
				if (this.hasOutOfRangeIndicator) {
					return this.fenxi || this.$t('AI健康趋势分析默认文案')
				}
				if (this.hasValidIndicator) {
					return this.$t('当前相关测量数据都很稳定')
				}
				return this.fenxi || this.$t('AI健康趋势分析默认文案')
			},
			hasValidIndicator() {
				return this.parseScore(this.ppgnewpoint) !== null ||
					this.parseScore(this.depression_risk_score) !== null ||
					this.parseScore(this.stress_Index) !== null ||
					this.parseScore(this.fatigue_index) !== null ||
					this.parseScore(this.recovery_index) !== null
			},
			hasOutOfRangeIndicator() {
				const mood = this.parseScore(this.ppgnewpoint)
				const depression = this.parseScore(this.depression_risk_score)
				const stress = this.parseScore(this.stress_Index)
				const fatigue = this.parseScore(this.fatigue_index)
				const recovery = this.parseScore(this.recovery_index)
				// 与指标阈值表 red 行一致：心情<4、心理健康>=8、压力>=5、疲劳>=5、恢复<5
				if (mood !== null && mood < 4) return true
				if (depression !== null && depression >= 8) return true
				if (stress !== null && stress >= 5) return true
				if (fatigue !== null && fatigue >= 5) return true
				if (recovery !== null && recovery < 5) return true
				return false
			}
		},
		methods: {
			parseScore(val) {
				if (val === '' || val === null || val === undefined || val === '--/--') return null
				const n = parseFloat(String(val).split('/')[0])
				return isNaN(n) ? null : n
			},
			goTrendDetail() {
				try {
					uni.setStorageSync('emotion_trend_detail', {
						types_index: this.types_index,
						types_array: this.types_array,
						chartDataPPG: JSON.parse(JSON.stringify(this.chartDataPPG || {})),
						optsPPG: JSON.parse(JSON.stringify(this.optsPPG || {})),
						chartDataPPG2: JSON.parse(JSON.stringify(this.chartDataPPG2 || {})),
						optsPPG2: JSON.parse(JSON.stringify(this.optsPPG2 || {})),
						Indicatorlist: JSON.parse(JSON.stringify(this.Indicatorlist || []))
					})
				} catch (e) {
					console.error('emotion_trend_detail storage failed', e)
				}
				uni.navigateTo({
					url: '/pages/tabBar/main/emotion_trend_detail'
				})
			}
		}
	}
</script>

<style scoped>
	.emotion-top-section {
		padding: 8px 16px 20px;
		box-sizing: border-box;
	}

	.hs-header {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-bottom: 28rpx;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.emotion-header {
		flex: 1;
		min-width: 0;
		margin-top: 20px;
		padding-right: 10px;
	}

	.emotion-title {
		display: block;
		font-size: 22px;
		font-weight: 700;
		color: #1A1C1E;
		line-height: 1.25;
		margin-bottom: 5px;
	}

	.emotion-subtitle {
		display: block;
		font-size: 12px;
		color: #8E8E93;
		line-height: 1.45;
	}

	.emotion-main-card {
		background: #ffffff;
		border-radius: 20px;
		padding: 16px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		box-sizing: border-box;
	}

	.emotion-track-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 4px 0 14px;
	}

	.emotion-track-row-hover {
		opacity: 0.85;
	}

	.emotion-track-disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.emotion-track-icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #3298F7;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.emotion-track-info {
		flex: 1;
		min-width: 0;
		margin: 0 12px;
		display: flex;
		flex-direction: column;
	}

	.emotion-track-title {
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.emotion-track-desc {
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.emotion-track-btn {
		flex-shrink: 0;
		min-width: 64px;
		height: 30px;
		padding: 0 12px;
		border-radius: 15px;
		background: #34c759;
		color: #ffffff;
		font-size: 13px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		white-space: nowrap;
	}

	.emotion-check-btn {
		margin: 0;
		height: 48px;
		line-height: 48px;
		background: #3298F7;
		color: #ffffff;
		font-size: 16px;
		font-weight: 600;
		border-radius: 14px;
		border: none;
	}

	.emotion-check-btn::after {
		border: none;
	}

	.emotion-check-btn[disabled] {
		background: #c0c0c0 !important;
		color: #ffffff !important;
	}

	.emotion-tip-card {
		margin-top: 14px;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background: #eaf4ff;
		border-radius: 14px;
		padding: 14px;
		box-sizing: border-box;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.emotion-tip-text {
		flex: 1;
		margin-left: 8px;
		font-size: 12px;
		color: #5c677a;
		line-height: 1.5;
	}

	.btnstyle {
		margin-top: 20px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}

	.btnstyle[disabled] {
		background: #c0c0c0 !important;
		color: #ffffff !important;
	}

	.data_bg_ppg_set {
		padding: 0 16px 180px;
		box-sizing: border-box;
	}

	.summary-card {
		background: #ffffff;
		border-radius: 18px;
		padding: 16px;
		margin-bottom: 14px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		box-sizing: border-box;
	}

	.summary-card-title-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 4px;
	}

	.summary-card-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
		margin-bottom: 8px;
		line-height: 1.3;
	}

	.summary-card-title-row .summary-card-title {
		margin-bottom: 8px;
		flex: 1;
	}

	.summary-help {
		padding: 4px;
		margin-bottom: 8px;
	}

	.summary-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 12px 0;
	}

	.summary-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		font-size: 18px;
		line-height: 1;
	}

	.summary-icon-green {
		background: #e8f8ee;
	}

	.summary-icon-blue {
		background: #eaf4ff;
	}

	.summary-icon-yellow {
		background: #fff6e0;
		color: #f5a623;
		font-size: 14px;
	}

	.summary-icon-purple {
		background: #f3eefc;
	}

	.summary-icon-red {
		background: #ffebee;
	}

	.summary-icon-orange {
		background: #fff3e8;
	}

	.summary-icon-teal {
		background: #e6f7f5;
	}

	.summary-info {
		flex: 1;
		min-width: 0;
		margin: 0 12px;
		display: flex;
		flex-direction: column;
	}

	.summary-row-title {
		font-size: 14px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.summary-row-desc {
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.summary-row-value {
		margin-top: 4px;
		font-size: 22px;
		font-weight: 700;
		color: #3298F7;
		line-height: 1.2;
	}

	.summary-row-tip {
		margin-top: 4px;
		font-size: 12px;
		color: #5c677a;
		line-height: 1.4;
	}

	.summary-divider {
		height: 1px;
		background: #eef1f6;
	}

	.summary-link-btn {
		margin: 0;
		padding: 0 12px;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		font-weight: 600;
		color: #3298F7;
		background: #eaf4ff;
		border-radius: 15px;
		border: none;
		flex-shrink: 0;
	}

	.summary-link-btn::after {
		border: none;
	}

	.summary-link-btn[disabled] {
		background: #f0f2f5 !important;
		color: #a0a8b4 !important;
	}

	.summary-hint {
		margin-top: 8px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.summary-primary-btn {
		margin: 12px 0 0;
		width: 100%;
		height: 40px;
		line-height: 40px;
		background: #3298F7;
		color: #ffffff;
		font-size: 13px;
		font-weight: 600;
		border-radius: 12px;
		border: none;
	}

	.summary-primary-btn::after {
		border: none;
	}

	.ai-insight-card {
		background: #eaf4ff;
		border-radius: 18px;
		padding: 16px;
		margin-bottom: 12px;
		box-sizing: border-box;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.ai-insight-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		margin-bottom: 14px;
	}

	.ai-insight-avatar {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
		flex-shrink: 0;
	}

	.steps-icon-img {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		object-fit: contain;
	}

	.ai-insight-header-text {
		flex: 1;
		min-width: 0;
		margin-left: 12px;
		display: flex;
		flex-direction: column;
	}

	.ai-insight-title {
		font-size: 15px;
		font-weight: 700;
		color: #3298F7;
		line-height: 1.3;
	}

	.ai-insight-text {
		margin-top: 6px;
		font-size: 13px;
		color: #1a2b4a;
		line-height: 1.55;
	}

	.ai-detail-btn {
		height: 44px;
		border-radius: 12px;
		background: #ffffff;
		border: 1.5px solid #3298F7;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
	}

	.ai-detail-btn-text {
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
	}

	.ai-detail-btn-arrow {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 22px;
		color: #3298F7;
		font-weight: 300;
		line-height: 1;
	}

	.emergency-card {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background: #eaf4ff;
		border-radius: 16px;
		padding: 14px 16px;
		margin-bottom: 14px;
		box-sizing: border-box;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.emergency-icon {
		font-size: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.emergency-plus {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		object-fit: contain;
	}

	.emergency-text {
		flex: 1;
		margin-left: 12px;
		font-size: 12px;
		color: red;
		line-height: 1.5;
	}

	.chart-wrap-card {
		background: #ffffff;
		border-radius: 18px;
		padding: 16px;
		margin-bottom: 14px;
		box-shadow: 0 2px 10px rgba(26, 43, 74, 0.06);
		box-sizing: border-box;
	}

	.pagedsismj_4 {
		background: #3298F7;
		margin: 20px 0;
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		padding: 15px;
		border-radius: 20px;
	}

	.charts-box-ppg {
		padding: 5px;
		background: white;
		border-radius: 20px;
		width: 100%;
		height: 300px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.page-transparent {
		background: transparent;
		padding: 20rpx;
	}

	.table-box {
		display: flex;
		flex-direction: column;
		border: 1rpx solid rgba(0, 0, 0, 0.15);
		border-radius: 8rpx;
		overflow: hidden;
	}

	.thead {
		display: flex;
		background: rgba(0, 0, 0, 0.03);
	}

	.th {
		flex: 1;
		padding: 14rpx 10rpx;
		font-size: 26rpx;
		color: #333;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.th:last-child {
		border-right: 0;
	}

	.tbody {
		display: flex;
		border-top: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td {
		flex: 1;
		padding: 12rpx 10rpx;
		font-size: 26rpx;
		color: #444;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td:last-child {
		border-right: 0;
	}

	.red {
		color: #e60012;
	}
</style>