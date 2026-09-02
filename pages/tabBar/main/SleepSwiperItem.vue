<template>
	<view class="sleep-page">
		<view class="sleep-header">
			<view class="sleep-header-left">
				<text class="sleep-title">{{ $t('睡眠摘要') }}</text>
				<text class="sleep-subtitle">{{ $t('基于最近一次记录的睡眠数据') }}</text>
			</view>
			<view class="sleep-date-badge">
				<uni-icons type="calendar" size="16" color="#3298F7"></uni-icons>
				<text class="sleep-date-text">{{ dateLabel }}</text>
			</view>
		</view>

		<view class="sleep-card main-card">
			<view class="main-top-row">
				<image src="/static/page_icon/shuimian_1.png" class="main-moon-img" mode="aspectFit"></image>
				<view class="main-stages">
					<text class="main-stages-title">{{ mainTitle }}</text>
					<view class="stage-row">
						<text class="stage-label">{{ $t('浅睡') }}</text>
						<text class="stage-value">{{ displayLight }}</text>
					</view>
					<view class="stage-divider"></view>
					<view class="stage-row">
						<text class="stage-label">{{ $t('深睡') }}</text>
						<text class="stage-value">{{ displayDeep }}</text>
					</view>
					<view class="stage-divider"></view>
					<view class="stage-row">
						<text class="stage-label">{{ $t('快速眼动') }}</text>
						<text class="stage-value">{{ displayRem }}</text>
					</view>
				</view>
			</view>
			<view class="main-divider"></view>
			<view class="main-foot-row">
				<image src="/static/page_icon/shuimian_2.png" class="main-foot-icon" mode="aspectFit"></image>
				<text class="main-foot-text">{{ $t('请在睡眠期间佩戴设备并于早晨同步') }}</text>
			</view>
		</view>

		<view class="sleep-card score-card">
			<view class="score-ring-box">
				<view class="score-ring-track"></view>
				<view v-if="hasScore" class="score-ring-fill" :style="scoreRingStyle"></view>
				<view class="score-ring-inner">
					<uni-icons type="star-filled" size="18" :color="scoreIconColor"></uni-icons>
				</view>
			</view>
			<view class="score-info">
				<text class="score-label">{{ $t('睡眠评分') }}</text>
				<view class="score-value-row">
					<text class="score-value" :class="scoreColorClass">{{ displayScore }}</text>
					<text class="score-max">/ 100</text>
				</view>
				<text class="score-desc">{{ $t('记录睡眠数据后将显示评分') }}</text>
			</view>
		</view>

		<view class="sleep-card med-card">
			<image src="/static/page_icon/shuimian_3.png" class="med-icon" mode="aspectFit"></image>
			<view class="med-info">
				<text class="med-title">{{ $t('服药记录') }}</text>
				<text class="med-desc">{{ $t('可选信息有助于完善趋势分析') }}</text>
			</view>
			<view class="med-switch-wrap">
				<switch @change="$emit('medication-change', $event)" style="transform:scale(0.85);" :checked="medication"
					color="#3298F7" />
				<!-- <text class="med-switch-label">{{ medication ? $t('打开') : $t('关闭') }}</text> -->
			</view>
		</view>

		<view v-show="sleep_point!=='--/--'" class="sleep-card tip-card tip-analysis">
			<image src="/static/page_icon/shuimian_5.png" class="tip-icon" mode="aspectFit"></image>
			<view class="tip-body">
				<template v-if="sleepTip && sleep_point<85">
					<text class="tip-title">{{ $t('睡眠血压交叉分析') }}</text>
					<text v-for="(line, idx) in sleepTip" :key="idx" class="tip-line">{{ $t(line) }}</text>
				</template>
				<template v-else>
					<text class="tip-title">{{ $t('睡眠良好') }}</text>
				</template>
			</view>
		</view>

		<view v-show="sleep_point==='--/--'" class="sleep-card tip-card tip-suggest">
			<image src="/static/page_icon/shuimian_5.png" class="tip-icon" mode="aspectFit"></image>
			<view class="tip-body">
				<text class="tip-title tip-title-blue">{{ $t('睡眠建议') }}</text>
				<text class="tip-line">{{ $t('为了获得更连贯的趋势请尽量每天在相近时间佩戴设备入睡') }}</text>
			</view>
		</view>

		<view class="sleep-bottom-spacer"></view>
	</view>
</template>

<script>
	export default {
		name: 'SleepSwiperItem',
		props: {
			sleep: {
				type: [String, Number],
				default: '--/--'
			},
			sleep_time: {
				type: String,
				default: '--/--'
			},
			totalLight: {
				type: [String, Number],
				default: '--/--'
			},
			totalDeep: {
				type: [String, Number],
				default: '--/--'
			},
			totalRem: {
				type: [String, Number],
				default: '--/--'
			},
			sleep_point: {
				type: [String, Number],
				default: '--/--'
			},
			medication: {
				type: Boolean,
				default: false
			},
			sleepTip: {
				type: Array,
				default: () => []
			}
		},
		computed: {
			hasSleepData() {
				const raw = String(this.sleep == null ? '' : this.sleep).trim()
				if (!raw || raw === '--/--' || raw === '-/-' || raw === '--' || raw === 'NA') return false
				return true
			},
			mainTitle() {
				return this.hasSleepData ? String(this.sleep) : this.$t('暂无睡眠数据')
			},
			displayLight() {
				return this.formatStage(this.totalLight)
			},
			displayDeep() {
				return this.formatStage(this.totalDeep)
			},
			displayRem() {
				return this.formatStage(this.totalRem)
			},
			displayScore() {
				return this.hasScore ? String(this.scoreNum) : '—'
			},
			hasScore() {
				const raw = String(this.sleep_point == null ? '' : this.sleep_point).trim()
				return raw && raw !== '--/--' && raw !== '-/-' && !isNaN(parseInt(raw, 10))
			},
			scoreNum() {
				const n = parseInt(this.sleep_point, 10)
				return isNaN(n) ? 0 : n
			},
			scoreColorClass() {
				if (!this.hasScore) return ''
				if (this.scoreNum >= 80) return 'score-good'
				if (this.scoreNum >= 60) return 'score-warn'
				return 'score-bad'
			},
			scoreIconColor() {
				if (!this.hasScore) return '#c5ced8'
				if (this.scoreNum >= 80) return '#58BF78'
				if (this.scoreNum >= 60) return '#FFEC01'
				return '#F55A5A'
			},
			scoreRingStyle() {
				const p = this.hasScore ? Math.min(100, Math.max(0, this.scoreNum)) : 0
				const deg = p * 3.6
				const color = this.scoreNum >= 80 ? '#58BF78' : (this.scoreNum >= 60 ? '#FFEC01' : '#F55A5A')
				return {
					background: `conic-gradient(${color} 0deg, ${color} ${deg}deg, #e8ecf2 ${deg}deg, #e8ecf2 360deg)`
				}
			},
			dateLabel() {
				const raw = String(this.sleep_time || '').trim()
				if (!raw || raw === '--/--' || raw === '-/-') {
					return this.formatDateFromParts(new Date())
				}
				const md = raw.match(/^(\d{1,2})\/(\d{1,2})$/)
				if (md) {
					return this.formatDateLabel(parseInt(md[1], 10), parseInt(md[2], 10))
				}
				const ymd = raw.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
				if (ymd) {
					return this.formatDateLabel(parseInt(ymd[2], 10), parseInt(ymd[3], 10))
				}
				const parts = raw.split(/[\/\-.]/)
				if (parts.length >= 2) {
					const month = parseInt(parts[0], 10)
					const day = parseInt(parts[1], 10)
					if (!isNaN(month) && !isNaN(day)) {
						return this.formatDateLabel(month, day)
					}
				}
				return raw
			}
		},
		methods: {
			formatStage(val) {
				const raw = String(val == null ? '' : val).trim()
				if (!raw || raw === '--/--' || raw === '-/-' || raw === '--' || raw === 'NA') {
					return '—'
				}
				return raw
			},
			formatDateFromParts(date) {
				return this.formatDateLabel(date.getMonth() + 1, date.getDate())
			},
			formatDateLabel(month, day) {
				const locale = (this.$i18n && this.$i18n.locale) || uni.getLocale() || ''
				if (locale.indexOf('zh') === 0) {
					return `${month}${this.$t('月')}${day}${this.$t('日')}`
				}
				const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				return `${months[month - 1] || month} ${day}`
			}
		}
	}
</script>

<style scoped>
	.sleep-page {
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		padding: 16px 16px 0;
		min-height: 100%;
		box-sizing: border-box;
	}

	.sleep-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.sleep-header-left {
		flex: 1;
		padding-right: 12px;
	}

	.sleep-title {
		display: block;
		font-size: 22px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.sleep-subtitle {
		display: block;
		margin-top: 6px;
		font-size: 13px;
		color: #7a8699;
		line-height: 1.4;
	}

	.sleep-date-badge {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #eaf4ff;
		border-radius: 20px;
		padding: 8px 12px;
		flex-shrink: 0;
	}

	.sleep-date-text {
		margin-left: 6px;
		font-size: 13px;
		font-weight: 600;
		color: #3298F7;
	}

	.sleep-card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		margin-bottom: 14px;
		overflow: hidden;
	}

	.main-card {
		padding: 16px;
	}

	.main-top-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.main-moon-img {
		width: 88px;
		height: 88px;
		border-radius: 44px;
		flex-shrink: 0;
	}

	.main-stages {
		flex: 1;
		margin-left: 14px;
		min-width: 0;
	}

	.main-stages-title {
		display: block;
		font-size: 17px;
		font-weight: 700;
		color: #1a2b4a;
		margin-bottom: 8px;
		line-height: 1.3;
	}

	.stage-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
	}

	.stage-label {
		font-size: 14px;
		color: #1a2b4a;
	}

	.stage-value {
		font-size: 14px;
		color: #8a94a6;
		font-weight: 500;
	}

	.stage-divider {
		height: 1px;
		background: #eef1f5;
	}

	.main-divider {
		height: 1px;
		background: #eef1f5;
		margin: 12px 0;
	}

	.main-foot-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.main-foot-icon {
		width: 28px;
		height: 28px;
		flex-shrink: 0;
		margin-right: 10px;
	}

	.main-foot-text {
		flex: 1;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.45;
	}

	.score-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16px;
	}

	.score-ring-box {
		position: relative;
		width: 68px;
		height: 68px;
		flex-shrink: 0;
	}

	.score-ring-track {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 6px solid #e8ecf2;
		box-sizing: border-box;
	}

	.score-ring-fill {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		padding: 6px;
		box-sizing: border-box;
	}

	.score-ring-inner {
		position: absolute;
		top: 6px;
		left: 6px;
		right: 6px;
		bottom: 6px;
		border-radius: 50%;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.score-info {
		flex: 1;
		margin-left: 14px;
		min-width: 0;
	}

	.score-label {
		display: block;
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.score-value-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 4px;
	}

	.score-value {
		font-size: 28px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.1;
	}

	.score-good {
		color: #58BF78;
	}

	.score-warn {
		color: #FFEC01;
	}

	.score-bad {
		color: #F55A5A;
	}

	.score-max {
		margin-left: 4px;
		font-size: 16px;
		color: #8a94a6;
	}

	.score-desc {
		display: block;
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.med-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 14px 16px;
	}

	.med-icon {
		width: 44px;
		height: 44px;
		border-radius: 22px;
		flex-shrink: 0;
	}

	.med-info {
		flex: 1;
		margin-left: 12px;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.med-title {
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.med-desc {
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.med-switch-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		margin-left: 8px;
	}

	.med-switch-label {
		margin-top: 2px;
		font-size: 11px;
		color: #8a94a6;
	}

	.tip-card {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 14px 16px;
	}

	.tip-suggest {
		background: #eaf4ff;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.tip-icon {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		flex-shrink: 0;
	}

	.tip-body {
		flex: 1;
		margin-left: 12px;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.tip-title {
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
		margin-bottom: 4px;
	}

	.tip-title-blue {
		color: #3298F7;
	}

	.tip-line {
		font-size: 13px;
		color: #5a6a80;
		line-height: 1.5;
		margin-top: 2px;
	}

	.sleep-bottom-spacer {
		height: 160px;
	}
</style>
