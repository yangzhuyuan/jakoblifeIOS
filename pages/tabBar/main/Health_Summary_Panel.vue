<template>
	<view class="health-page" :class="{ 'is-embedded': embedded }">
		<view class="page-header">
			<view class="header-text">
				<text class="page-title">{{ $t('健康摘要') }}</text>
				<text class="page-subtitle">{{ $t('基于您近期的心脏健康测量数据和趋势') }}</text>
			</view>
			<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
		</view>
		<!-- <view class="emotion-tip-card" @click="onAiNote">
			<uni-icons type="info" size="18" color="#3298F7"></uni-icons>
			<text class="emotion-tip-text">{{ $t('血压计注意事项') }}</text>
		</view> -->
		<view class="status-card">
			<view class="status-main">
				<view class="status-icon-wrap" :class="toneToStatusClass(overall.tone)">
					<uni-icons type="checkmarkempty" size="28"
						:color="overall.tone === 'warn' ? '#FF9500' : '#34C759'"></uni-icons>
				</view>
				<view class="status-info">
					<text class="status-label">{{ $t('总体状态') }}</text>
					<text class="status-value" :class="toneToStatusClass(overall.tone)">{{ overall.title }}</text>
					<text class="status-desc">{{ overall.desc }}</text>
				</view>
			</view>
			<text class="status-updated">{{ $t('今日更新') }}</text>
		</view>

		<view class="metric-grid">
			<view class="metric-card" v-for="(m, i) in metrics" :key="i">
				<view class="metric-left" @click="onMetricTap(m)">
					<view class="metric-icon-wrap">
						<image lazy-load class="metric-icon" :src="m.icon" mode="aspectFit" />
					</view>
					<text v-if="m.measurable" class="metric-measure">{{ $t('测量') }}</text>
				</view>
				<view class="metric-body">
					<text class="metric-name">{{ m.name }}</text>
					<text class="metric-value-num">{{ m.value }}</text>
					<text v-if="m.unit" class="metric-value-unit">{{ m.unit }}</text>
					<text v-if="m.date" class="metric-date">{{ m.date }}</text>
					<view class="metric-status-row" v-if="m.status">
						<view class="status-dot" :class="toneToDotClass(m.tone)"
							:style="m.statusColor ? { background: m.statusColor } : null"></view>
						<text class="metric-status" :class="toneToDotClass(m.tone)"
							:style="m.statusColor ? { color: m.statusColor } : null">{{ m.status }}</text>
						<uni-icons v-if="m.help" type="help" size="15" class="metric-help"
							@click="onStatusHelp(m)"></uni-icons>
					</view>
				</view>
			</view>
		</view>

		<view class="trends-card">
			<text class="trends-title">{{ $t('天趋势7') }}</text>
			<view class="trend-row" v-for="(t, i) in trends" :key="i" @click="onTrendTap(t)">
				<view class="trend-icon-wrap">
					<image lazy-load class="trend-icon" :src="t.icon" mode="aspectFit" />
				</view>
				<text class="trend-label">{{ t.name }}</text>
				<view class="sparkline" :class="t.tone">
					<qiun-data-charts :canvas2d="true" type="line" :canvas-id="'hsSpark' + t.key" :opts="t.opts"
						:chartData="t.chartData" :ontouch="false" :inScrollView="true" :reshow="sparkReshow" />
				</view>
				<text class="trend-status" :class="toneToDotClass(t.tone)">{{ t.status }}</text>
			</view>
		</view>
		<view class="ai-insight-card">
			<view class="ai-insight-header">
				<view class="ai-insight-avatar">
					<image src="/static/page_icon/app_icon_all.jpg" class="ai-avatar-img" mode="aspectFit"></image>
				</view>
				<view class="ai-insight-header-text">
					<text class="ai-insight-title">{{ $t('AI健康趋势分析') }}</text>
					<text class="ai-insight-text">{{ insightText }}</text>
				</view>
			</view>
			<view class="ai-detail-btn" @click="onViewReport">
				<text class="ai-detail-btn-text">{{ $t('查看详细报告') }}</text>
				<text class="ai-detail-btn-arrow">›</text>
			</view>
		</view>

		<text class="footer-note">{{ $t('健康摘要免责声明') }}</text>
	</view>
</template>

<script>
	import WeightConverter from '@/pages/api/unitls/weightConverter.js'
	import {
		getChinaTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'

	export default {
		name: 'HealthSummaryPanel',
		props: {
			embedded: {
				type: Boolean,
				default: false
			},
			autoLoad: {
				type: Boolean,
				default: true
			},
			syncHighPressure: {
				type: [String, Number],
				default: ''
			},
			syncLowPressure: {
				type: [String, Number],
				default: ''
			},
			syncPulse: {
				type: [String, Number],
				default: ''
			},
			syncHrDate: {
				type: String,
				default: ''
			},
			syncSpo2: {
				type: [String, Number],
				default: ''
			},
			syncSpo2Date: {
				type: String,
				default: ''
			},
			syncBpDate: {
				type: String,
				default: ''
			},
			syncHeight: {
				type: [String, Number],
				default: ''
			},
			syncHeightDate: {
				type: String,
				default: ''
			}
		},
		data() {
			const sparkBase = {
				padding: [6, 4, 6, 4],
				legend: {
					show: false
				},
				dataLabel: false,
				dataPointShape: true,
				enableScroll: false,
				xAxis: {
					disabled: true,
					disableGrid: true,
					axisLine: false,
					fontSize: 1
				},
				yAxis: {
					disabled: true,
					disableGrid: true,
					disableLine: true,
					data: [{
						min: 0,
						max: 200,
						axisLine: false
					}]
				},
				extra: {
					line: {
						type: 'straight',
						width: 2,
						activeType: 'hollow'
					}
				}
			};
			const sparkCats = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
			const emptyWeek = [null, null, null, null, null, null, null];
			return {
				rangeIndex: 0,
				spo2: '--',
				heightVal: '-',
				highPressure: '-',
				lowPressure: '-',
				pulse: '-',
				bpDate: '',
				hrDate: '',
				spo2Date: '',
				heightDate: '',
				dayAvgHigh: null,
				dayAvgLow: null,
				dayAvgHr: null,
				weekAvgHigh: null,
				weekAvgLow: null,
				weekAvgHr: null,
				sparkReshow: false,
				sparkYBp: {
					min: 0,
					max: 200
				},
				sparkYHr: {
					min: 40,
					max: 120
				},
				sparkOptsBp: Object.assign({}, sparkBase, {
					color: ['#FC7F41', '#7AE545']
				}),
				sparkOptsByTone: {
					ok: Object.assign({}, sparkBase, {
						color: ['#007AFF'],
						yAxis: {
							disabled: true,
							disableGrid: true,
							disableLine: true,
							data: [{
								min: 40,
								max: 120,
								axisLine: false
							}]
						}
					}),
					warn: Object.assign({}, sparkBase, {
						color: ['#FF9500'],
						yAxis: {
							disabled: true,
							disableGrid: true,
							disableLine: true,
							data: [{
								min: 40,
								max: 120,
								axisLine: false
							}]
						}
					}),
					mute: Object.assign({}, sparkBase, {
						color: ['#C7C7CC'],
						yAxis: {
							disabled: true,
							disableGrid: true,
							disableLine: true,
							data: [{
								min: 40,
								max: 120,
								axisLine: false
							}]
						}
					})
				},
				sparkChartBp: {
					categories: sparkCats.slice(),
					series: [{
						name: '',
						data: emptyWeek.slice(),
						connectNulls: true
					}, {
						name: '',
						data: emptyWeek.slice(),
						connectNulls: true
					}]
				},
				sparkChartHr: {
					categories: sparkCats.slice(),
					series: [{
						name: '',
						data: emptyWeek.slice(),
						connectNulls: true
					}]
				},
				bloodUnitIndex: (() => {
					const blood = uni.getStorageSync('Blood');
					return blood === 0 || blood === '' ? 0 : 1;
				})(),
				heightUnitIndex: uni.getStorageSync('danwei1') === 0 ? 0 : 1
			};
		},
		computed: {
			bloodUnit() {
				return this.bloodUnitIndex === 0 ? 'mmHg' : 'kPa';
			},
			heightUnit() {
				return this.heightUnitIndex === 0 ? this.$t('英寸') : this.$t('厘米');
			},
			bpValue() {
				const s = this.highPressure;
				const d = this.lowPressure;
				if (!this.isValidMetric(s) || !this.isValidMetric(d)) return '--/--';
				if (this.bloodUnit === 'kPa') {
					return `${(Number(s) * 0.133).toFixed(1)}/${(Number(d) * 0.133).toFixed(1)}`;
				}
				return `${s}/${d}`;
			},
			hrValue() {
				if (!this.isValidMetric(this.pulse)) return '--';
				return String(this.pulse);
			},
			spo2Value() {
				if (!this.isValidMetric(this.spo2)) return '--';
				return String(this.spo2);
			},
			heightValue() {
				if (!this.isValidMetric(this.heightVal)) return '--';
				const val = this.heightUnitIndex === 0 ?
					WeightConverter.cmToInch(this.heightVal) : this.heightVal;
				if (val == null || val === '') return '--';
				return String(val);
			},
			bpStatus() {
				if (!this.isValidMetric(this.highPressure) || !this.isValidMetric(this.lowPressure)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute',
						color: ''
					};
				}
				const highPressure = Number(this.highPressure);
				const lowPressure = Number(this.lowPressure);
				// 颜色与「？」血压分类弹窗一致
				// 血压偏低优先：收缩压<90 或 舒张压<60；正常血压需两者都满足；其余等级优先收缩压
				const levels = [{
						level: -1,
						color: '#FFF176',
						name: this.$t('血压偏低')
					},
					{
						level: 0,
						color: '#A6CE39',
						name: this.$t('正常血压')
					},
					{
						level: 1,
						color: '#FFEC01',
						name: this.$t('正常高值')
					},
					{
						level: 2,
						color: '#FFB602',
						name: this.$t('一级高血压')
					},
					{
						level: 3,
						color: '#BB3A01',
						name: this.$t('二级高血压')
					}
				];
				const toStatus = (idx) => ({
					text: levels[idx].name,
					tone: levels[idx].level === 0 ? 'ok' : 'warn',
					color: levels[idx].color
				});
				if (highPressure < 91 || lowPressure < 61) {
					return toStatus(0);
				}
				if (highPressure >= 91 && highPressure <= 120 && lowPressure >= 61 && lowPressure <= 80) {
					return toStatus(1);
				}
				if (highPressure >= 121 && highPressure <= 140) return toStatus(2);
				if (highPressure >= 141 && highPressure <= 160) return toStatus(3);
				if (highPressure >= 161 && highPressure <= 180) return toStatus(4);
				if (lowPressure >= 81 && lowPressure <= 90) return toStatus(2);
				if (lowPressure >= 91 && lowPressure <= 100) return toStatus(3);
				if (lowPressure >= 101 && lowPressure <= 110) return toStatus(4);
				return {
					text: this.$t('未知'),
					tone: 'mute',
					color: ''
				};
			},
			hrStatus() {
				if (!this.isValidMetric(this.pulse)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute',
						color: ''
					};
				}
				const hr = Number(this.pulse);
				if (hr < 60) {
					return {
						text: this.$t('过慢'),
						tone: 'warn',
						color: ''
					};
				}
				if (hr > 100) {
					return {
						text: this.$t('过快'),
						tone: 'warn',
						color: ''
					};
				}
				return {
					text: this.$t('正常'),
					tone: 'ok',
					color: ''
				};
			},
			spo2Status() {
				if (!this.isValidMetric(this.spo2)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute',
						color: ''
					};
				}
				const val = parseInt(this.spo2, 10);
				if (isNaN(val)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute',
						color: ''
					};
				}
				// 颜色与「？」血氧分类弹窗一致：≤92 偏低(橙)，>92 正常(绿)
				if (val <= 92) {
					return {
						text: this.$t('偏低'),
						tone: 'warn',
						color: '#FCCD41'
					};
				}
				return {
					text: this.$t('正常'),
					tone: 'ok',
					color: '#7AE545'
				};
			},
			metrics() {
				return [{
						name: this.$t('血压'),
						icon: '/static/icons/3.png',
						measurable: true,
						measureType: 1,
						help: 'bp',
						value: this.bpValue,
						unit: this.bloodUnit,
						date: this.bpDate,
						status: this.bpStatus.text,
						tone: this.bpStatus.tone,
						statusColor: this.bpStatus.color
					},
					{
						name: this.$t('心率'),
						icon: '/static/icons/5.png',
						measurable: true,
						measureType: 0,
						value: this.hrValue,
						unit: this.isValidMetric(this.pulse) ? 'BPM' : 'BPM',
						date: this.hrDate,
						status: this.hrStatus.text,
						tone: this.hrStatus.tone,
						statusColor: this.hrStatus.color
					},
					{
						name: this.$t('血氧'),
						icon: '/static/page_icon/10.png',
						measurable: true,
						measureType: 2,
						help: 'spo2',
						value: this.spo2Value,
						unit: '%',
						date: this.spo2Date,
						status: this.spo2Status.text,
						tone: this.spo2Status.tone,
						statusColor: this.spo2Status.color
					},
					{
						name: this.$t('身高'),
						icon: '/static/icons/2.png',
						measurable: false,
						value: this.heightValue,
						unit: this.isValidMetric(this.heightVal) ? this.heightUnit : '',
						date: this.heightDate,
						status: '',
						tone: 'ok',
						statusColor: ''
					}
				];
			},
			bpTrendStatus() {
				if (!this.isValidMetric(this.dayAvgHigh) || !this.isValidMetric(this.dayAvgLow) ||
					!this.isValidMetric(this.weekAvgHigh) || !this.isValidMetric(this.weekAvgLow)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute'
					};
				}
				const deltaHigh = Math.abs(Number(this.dayAvgHigh) - Number(this.weekAvgHigh));
				const deltaLow = Math.abs(Number(this.dayAvgLow) - Number(this.weekAvgLow));
				const unstable = deltaHigh >= 14 && deltaLow >= 14;
				return {
					text: this.$t(unstable ? '不稳定' : '稳定'),
					tone: unstable ? 'warn' : 'ok'
				};
			},
			hrTrendStatus() {
				if (!this.isValidMetric(this.dayAvgHr) || !this.isValidMetric(this.weekAvgHr)) {
					return {
						text: this.$t('暂无数据'),
						tone: 'mute'
					};
				}
				const unstable = Math.abs(Number(this.dayAvgHr) - Number(this.weekAvgHr)) >= 11;
				return {
					text: this.$t(unstable ? '不稳定' : '稳定'),
					tone: unstable ? 'warn' : 'ok'
				};
			},
			trends() {
				const bp = this.bpTrendStatus;
				const hr = this.hrTrendStatus;
				return [{
						key: 'bp',
						name: this.$t('血压'),
						icon: '/static/icons/3.png',
						opts: this.withSparkYAxis(this.sparkOptsBp, this.sparkYBp),
						chartData: this.sparkChartBp,
						status: bp.text,
						tone: bp.tone
					},
					{
						key: 'hr',
						name: this.$t('心率'),
						icon: '/static/icons/5.png',
						opts: this.withSparkYAxis(this.sparkOptsByTone[hr.tone] || this.sparkOptsByTone.mute, this.sparkYHr),
						chartData: this.sparkChartHr,
						status: hr.text,
						tone: hr.tone
					}
				];
			},
			overall() {
				const bp = this.bpTrendStatus;
				const hr = this.hrTrendStatus;
				const unstable = bp.tone === 'warn' || hr.tone === 'warn';
				if (unstable) {
					return {
						title: this.$t('趋势需关注'),
						desc: this.$t('健康摘要状态需关注描述'),
						tone: 'warn'
					};
				}
				return {
					title: this.$t('趋势稳定'),
					desc: this.$t('健康摘要状态稳定描述'),
					tone: 'ok'
				};
			},
			insightText() {
				if (this.overall.tone === 'warn') {
					return this.$t('健康摘要AI洞察波动文案');
				}
				return this.$t('健康摘要AI洞察文案');
			}
		},
		mounted() {
			this.syncUnitSettings();
			uni.$on('unit-settings-changed', this.syncUnitSettings);
			if (this.autoLoad) this.refreshData();
		},
		beforeDestroy() {
			uni.$off('unit-settings-changed', this.syncUnitSettings);
			if (this._homeSyncTimer) clearTimeout(this._homeSyncTimer);
			if (this._sparkNudgeTimer) clearTimeout(this._sparkNudgeTimer);
		},
		watch: {
			syncHighPressure() {
				this.scheduleHomeSync();
			},
			syncLowPressure() {
				this.scheduleHomeSync();
			},
			syncPulse() {
				this.scheduleHomeSync();
			},
			syncHrDate() {
				this.scheduleHomeSync();
			},
			syncSpo2() {
				this.scheduleHomeSync();
			},
			syncSpo2Date() {
				this.scheduleHomeSync();
			},
			syncBpDate() {
				this.scheduleHomeSync();
			},
			syncHeight() {
				this.scheduleHomeSync();
			},
			syncHeightDate() {
				this.scheduleHomeSync();
			}
		},
		methods: {
			syncUnitSettings() {
				const blood = uni.getStorageSync('Blood');
				this.bloodUnitIndex = blood === 0 || blood === '' ? 0 : 1;
				this.heightUnitIndex = uni.getStorageSync('danwei1') === 0 ? 0 : 1;
			},
			toneToStatusClass(tone) {
				return tone === 'warn' ? 'status-warn' : 'status-good';
			},
			toneToDotClass(tone) {
				if (tone === 'warn') return 'warn';
				if (tone === 'mute') return 'mute';
				return 'good';
			},
			onMetricTap(m) {
				if (!m || !m.measurable || m.measureType == null) return;
				this.$emit('measure-link', m.measureType);
			},
			onStatusHelp(m) {
				if (!m || !m.help) return;
				if (m.help === 'spo2') {
					this.$emit('bmi-tap', this.$t('血氧'));
					return;
				}
				this.$emit('xueya-tap');
			},
			onAiNote() {
				this.$emit('AI-note');
			},
			refreshData() {
				this.syncUnitSettings();
				if (!this.embedded) {
					uni.setNavigationBarTitle({
						title: this.$t('健康摘要')
					});
				}
				this.applyLocalHomeCache();
				if (this.embedded) {
					this.applyHomeSync();
					setTimeout(() => {
						this.loadHomeMetrics();
						this.loadTrendStability();
						this.loadWeekTrendChart();
						this.nudgeSparkCharts();
					}, 250);
					return;
				}
				this.loadHomeMetrics();
				this.loadTrendStability();
				this.loadWeekTrendChart();
				this.nudgeSparkCharts();
			},
			scheduleHomeSync() {
				if (this._homeSyncTimer) clearTimeout(this._homeSyncTimer);
				this._homeSyncTimer = setTimeout(() => {
					this.applyHomeSync();
				}, 150);
			},
			localYmd() {
				return getChinaTimeAllJSON().YMD;
			},
			shiftYmd(daysBack) {
				const d = new Date();
				d.setDate(d.getDate() - daysBack);
				return getChinaTimeAllJSON(d).YMD;
			},
			buildWeekDates() {
				const list = [];
				for (let i = 6; i >= 0; i--) {
					const dateStr = this.shiftYmd(i);
					const parts = dateStr.split('-');
					list.push({
						dateStr: dateStr,
						month: Number(parts[1]),
						day: Number(parts[2])
					});
				}
				return list;
			},
			toYmd(value) {
				if (value == null || value === '') return '';
				const raw = String(value).trim();
				if (!raw) return '';
				const wallMatch = raw.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
				if (wallMatch && !/^\d+$/.test(raw) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) {
					return wallMatch[1] + '-' + wallMatch[2].padStart(2, '0') + '-' + wallMatch[3].padStart(2, '0');
				}
				const ts = this.parseTimeToMs(value);
				if (!Number.isFinite(ts) || ts <= 0) return '';
				return getChinaTimeAllJSON(new Date(ts)).YMD || '';
			},
			toFiniteNumber(value) {
				if (!this.isValidMetric(value)) return null;
				const n = Number(value);
				return Number.isFinite(n) ? n : null;
			},
			parseTrendPoint(item) {
				if (item == null) return {
					value: null,
					dateStr: ''
				};
				if (Array.isArray(item)) {
					let value = this.toFiniteNumber(item[0]);
					let dateStr = this.toYmd(item[1]);
					if (!dateStr) {
						dateStr = this.toYmd(item[0]);
						value = this.toFiniteNumber(item[1]);
					}
					return {
						value,
						dateStr
					};
				}
				if (typeof item === 'object') {
					return {
						value: this.toFiniteNumber(item.value != null ? item.value : item.avg),
						dateStr: this.toYmd(item.time || item.timestamp || item.dateTime || item.date)
					};
				}
				return {
					value: null,
					dateStr: ''
				};
			},
			timestampToDateStr(timestamp) {
				return this.toYmd(timestamp);
			},
			sparkYRange(values, fallbackMin, fallbackMax) {
				const nums = [];
				(values || []).forEach((v) => {
					const n = this.toFiniteNumber(v);
					if (n != null) nums.push(n);
				});
				if (!nums.length) {
					return {
						min: fallbackMin,
						max: fallbackMax
					};
				}
				let min = Math.min.apply(null, nums);
				let max = Math.max.apply(null, nums);
				if (min === max) {
					min = Math.max(0, min - 10);
					max = max + 10;
				} else {
					const pad = Math.max(4, (max - min) * 0.18);
					min = Math.max(0, min - pad);
					max = max + pad;
				}
				return {
					min,
					max
				};
			},
			withSparkYAxis(opts, range) {
				const y = range || {};
				return Object.assign({}, opts, {
					yAxis: {
						disabled: true,
						disableGrid: true,
						disableLine: true,
						data: [{
							min: y.min,
							max: y.max,
							axisLine: false
						}]
					}
				});
			},
			nudgeSparkCharts() {
				if (this._sparkNudgeTimer) clearTimeout(this._sparkNudgeTimer);
				this.sparkReshow = false;
				this._sparkNudgeTimer = setTimeout(() => {
					this._sparkNudgeTimer = null;
					this.$nextTick(() => {
						this.sparkReshow = true;
					});
				}, 400);
			},
			weekBpMapHasValues(dateList, bpMap) {
				if (!bpMap || !dateList) return false;
				for (let i = 0; i < dateList.length; i++) {
					const dayData = bpMap.get(dateList[i].dateStr);
					if (dayData && (dayData.high != null || dayData.low != null)) return true;
				}
				return false;
			},
			weekHrMapHasValues(dateList, hrMap) {
				if (!hrMap || !dateList) return false;
				for (let i = 0; i < dateList.length; i++) {
					if (hrMap.has(dateList[i].dateStr) && hrMap.get(dateList[i].dateStr) != null) return true;
				}
				return false;
			},
			applyBpWeekChart(dateList, bpMap) {
				const cats = dateList.map(function() {
					return ' ';
				});
				const highs = [];
				const lows = [];
				for (let i = 0; i < dateList.length; i++) {
					const dayData = bpMap.get(dateList[i].dateStr);
					highs.push(dayData && dayData.high != null ? dayData.high : null);
					lows.push(dayData && dayData.low != null ? dayData.low : null);
				}
				this.sparkYBp = this.sparkYRange(highs.concat(lows), 0, 200);
				this.sparkChartBp = {
					categories: cats,
					series: [{
						name: '',
						data: highs,
						connectNulls: true
					}, {
						name: '',
						data: lows,
						connectNulls: true
					}]
				};
				this.nudgeSparkCharts();
			},
			applyHrWeekChart(dateList, hrMap) {
				const data = [];
				for (let i = 0; i < dateList.length; i++) {
					data.push(hrMap.has(dateList[i].dateStr) ? hrMap.get(dateList[i].dateStr) : null);
				}
				this.sparkYHr = this.sparkYRange(data, 40, 120);
				this.sparkChartHr = {
					categories: dateList.map(function() {
						return ' ';
					}),
					series: [{
						name: '',
						data: data,
						connectNulls: true
					}]
				};
				this.nudgeSparkCharts();
			},
			fillWeekSparkFromLogs(list) {
				const dateList = this.buildWeekDates();
				const hrMap = new Map();
				const bpMap = new Map();
				if (Array.isArray(list)) {
					for (let i = 0; i < list.length; i++) {
						const d = this.itemYmd(list[i]);
						const s = this.getLogSummary(list[i]);
						if (!d || !s) continue;
						if (this.isValidMetric(s.heartrateAvg)) {
							hrMap.set(d, Number(s.heartrateAvg));
						}
						const high = this.toFiniteNumber(s.highPressureAvg);
						const low = this.toFiniteNumber(s.lowPressureAvg);
						if (high != null || low != null) {
							const prev = bpMap.get(d) || {
								high: null,
								low: null
							};
							bpMap.set(d, {
								high: high != null ? high : prev.high,
								low: low != null ? low : prev.low
							});
						}
					}
				}
				if (hrMap.size) this.applyHrWeekChart(dateList, hrMap);
				if (this.weekBpMapHasValues(dateList, bpMap)) this.applyBpWeekChart(dateList, bpMap);
			},
			loadWeekTrendChart() {
				const userid = uni.getStorageSync('userid');
				if (!userid || !uni.getStorageSync('token')) return;
				const ymd = this.localYmd();
				const todayEnd = ymd + ' 23:59:59';
				const weekStart = this.shiftYmd(6) + ' 00:00:00';
				const typesIndex = Number(uni.getStorageSync('types_index') || 0);
				const slaveSn = typesIndex == 1 ? '2' : '3';
				const dateList = this.buildWeekDates();
				const header = this.trendHeader();
				const postTrend = (sn) => {
					return this.$post(this.$url_APP_IP + this.$url_get_trend_data, {
						deviceSn: userid,
						timeLevel: 0,
						slaveList: [{
								slaveSn: sn,
								register: 'highPressure'
							},
							{
								slaveSn: sn,
								register: 'lowPressure'
							},
							{
								slaveSn: sn,
								register: 'heartrate'
							},
							{
								slaveSn: '0',
								register: 'weight'
							}
						],
						startTime: weekStart,
						endTime: todayEnd,
						aggregateType: 'average'
					}, header);
				};
				const parseBpMap = (res) => {
					const bpMap = new Map();
					if (!res || res.code != 200 || !res.data) return bpMap;
					const setVal = (list, field) => {
						if (!list) return;
						list.forEach(item => {
							const point = this.parseTrendPoint(item);
							if (!point.dateStr || point.value == null) return;
							if (!bpMap.has(point.dateStr)) {
								bpMap.set(point.dateStr, {
									high: null,
									low: null
								});
							}
							bpMap.get(point.dateStr)[field] = point.value;
						});
					};
					setVal(res.data.highPressure, 'high');
					setVal(res.data.lowPressure, 'low');
					return bpMap;
				};
				const parseHrMap = (res) => {
					const hrMap = new Map();
					if (!res || res.code != 200 || !res.data || !res.data.heartrate) return hrMap;
					res.data.heartrate.forEach(item => {
						const point = this.parseTrendPoint(item);
						if (!point.dateStr || point.value == null) return;
						hrMap.set(point.dateStr, point.value);
					});
					return hrMap;
				};
				postTrend(slaveSn).then(res => {
					const bpMap = parseBpMap(res);
					const hrMap = parseHrMap(res);
					const hasBp = this.weekBpMapHasValues(dateList, bpMap);
					const hasHr = this.weekHrMapHasValues(dateList, hrMap);
					if (hasBp) this.applyBpWeekChart(dateList, bpMap);
					if (hasHr) this.applyHrWeekChart(dateList, hrMap);
					if (hasBp && hasHr) return;
					const otherSn = slaveSn === '2' ? '3' : '2';
					return postTrend(otherSn).then(res2 => {
						if (!hasBp) {
							const otherBp = parseBpMap(res2);
							if (this.weekBpMapHasValues(dateList, otherBp)) {
								this.applyBpWeekChart(dateList, otherBp);
							}
						}
						if (!hasHr) {
							const otherHr = parseHrMap(res2);
							if (this.weekHrMapHasValues(dateList, otherHr)) {
								this.applyHrWeekChart(dateList, otherHr);
							}
						}
					});
				}).catch(() => {});
			},
			getLogObject(item) {
				if (!item) return null;
				let obj = item.object;
				if (typeof obj === 'string') {
					try {
						obj = JSON.parse(obj);
					} catch (e) {
						return null;
					}
				}
				return obj || null;
			},
			avgDetails(details, key) {
				if (!Array.isArray(details) || !details.length) return null;
				let sum = 0;
				let n = 0;
				for (let i = 0; i < details.length; i++) {
					const v = details[i] && details[i][key];
					if (this.isValidMetric(v)) {
						sum += Number(v);
						n++;
					}
				}
				return n ? (sum / n) : null;
			},
			getLogSummary(item) {
				const obj = this.getLogObject(item);
				if (!obj) return null;
				const summary = obj.summary || {};
				const details = obj.details || [];
				const high = this.isValidMetric(summary.highPressureAvg) ? summary.highPressureAvg : this.avgDetails(
					details, 'highPressure');
				const low = this.isValidMetric(summary.lowPressureAvg) ? summary.lowPressureAvg : this.avgDetails(
					details, 'lowPressure');
				const hr = this.isValidMetric(summary.heartrateAvg) ? summary.heartrateAvg : this.avgDetails(details,
					'heartrate');
				return {
					highPressureAvg: high,
					lowPressureAvg: low,
					heartrateAvg: hr
				};
			},
			meanSummaries(list, field) {
				if (!Array.isArray(list) || !list.length) return null;
				let sum = 0;
				let n = 0;
				for (let i = 0; i < list.length; i++) {
					const s = this.getLogSummary(list[i]);
					if (s && this.isValidMetric(s[field])) {
						sum += Number(s[field]);
						n++;
					}
				}
				return n ? (sum / n) : null;
			},
			itemYmd(item) {
				const dt = (item && (item.dateTime || item.date || item.time || item.timestamp)) || '';
				return this.toYmd(dt);
			},
			pickTodayItem(list, ymd) {
				if (!Array.isArray(list) || !list.length) return null;
				for (let i = 0; i < list.length; i++) {
					if (this.itemYmd(list[i]) === ymd) return list[i];
				}
				let latest = list[0];
				for (let i = 1; i < list.length; i++) {
					if (this.itemYmd(list[i]) > this.itemYmd(latest)) latest = list[i];
				}
				return latest;
			},
			applyDaySummary(summary) {
				if (!summary) return;
				if (this.isValidMetric(summary.highPressureAvg)) this.dayAvgHigh = summary.highPressureAvg;
				if (this.isValidMetric(summary.lowPressureAvg)) this.dayAvgLow = summary.lowPressureAvg;
				if (this.isValidMetric(summary.heartrateAvg)) this.dayAvgHr = summary.heartrateAvg;
			},
			applyDayFromHome() {
				if (!this.isValidMetric(this.dayAvgHigh) && this.isValidMetric(this.highPressure)) {
					this.dayAvgHigh = this.highPressure;
				}
				if (!this.isValidMetric(this.dayAvgLow) && this.isValidMetric(this.lowPressure)) {
					this.dayAvgLow = this.lowPressure;
				}
				if (!this.isValidMetric(this.dayAvgHr) && this.isValidMetric(this.pulse)) {
					this.dayAvgHr = this.pulse;
				}
			},
			applyWeekAvg(avg) {
				if (!avg) return false;
				let ok = false;
				if (this.isValidMetric(avg.highPressure)) {
					this.weekAvgHigh = avg.highPressure;
					ok = true;
				}
				if (this.isValidMetric(avg.lowPressure)) {
					this.weekAvgLow = avg.lowPressure;
					ok = true;
				}
				if (this.isValidMetric(avg.heartrate)) {
					this.weekAvgHr = avg.heartrate;
					ok = true;
				}
				return ok;
			},
			trendHeader() {
				return {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				};
			},
			fetchWeekMinmax(userid, slaveSn, weekStart, todayEnd, header, onSettled) {
				const finish = (avg) => {
					if (typeof onSettled === 'function') {
						onSettled(avg || null);
						return;
					}
					if (avg) this.applyWeekAvg(avg);
				};
				this.$post(this.$url_APP_IP + this.$url_query_minmax, {
					deviceSn: userid,
					dataType: 'min',
					slaveList: [{
							slaveSn: slaveSn,
							register: 'highPressure'
						},
						{
							slaveSn: slaveSn,
							register: 'lowPressure'
						},
						{
							slaveSn: slaveSn,
							register: 'heartrate'
						}
					],
					startTime: weekStart,
					endTime: todayEnd
				}, header).then(res => {
					if (res && (res.code == 200) && res.data && res.data.avg && this.weekAvgHasValue(res.data.avg)) {
						finish(res.data.avg);
						return;
					}
					const otherSn = slaveSn === '2' ? '3' : '2';
					if (otherSn === slaveSn) {
						finish(null);
						return;
					}
					this.$post(this.$url_APP_IP + this.$url_query_minmax, {
						deviceSn: userid,
						dataType: 'min',
						slaveList: [{
							slaveSn: otherSn,
							register: 'highPressure'
						}],
						startTime: weekStart,
						endTime: todayEnd
					}, header).then(res2 => {
						if (res2 && res2.code == 200 && res2.data && res2.data.avg && this.weekAvgHasValue(res2.data
								.avg)) {
							finish(res2.data.avg);
							return;
						}
						finish(null);
					}).catch(() => {
						finish(null);
					});
				}).catch(() => {
					finish(null);
				});
			},
			weekAvgHasValue(avg) {
				return !!(avg && (this.isValidMetric(avg.highPressure) || this.isValidMetric(avg.lowPressure) || this
					.isValidMetric(avg.heartrate)));
			},
			publishTrendStability(seq, daySummary, weekAvg) {
				if (seq !== this._trendSeq) return;
				if (daySummary) this.applyDaySummary(daySummary);
				this.applyDayFromHome();
				if (weekAvg) this.applyWeekAvg(weekAvg);
			},
			loadTrendStability() {
				const userid = uni.getStorageSync('userid');
				if (!userid || !uni.getStorageSync('token')) return;
				const seq = (this._trendSeq || 0) + 1;
				this._trendSeq = seq;
				const ymd = this.localYmd();
				const todayEnd = ymd + ' 23:59:59';
				const weekStart = this.shiftYmd(6) + ' 00:00:00';
				const typesIndex = Number(uni.getStorageSync('types_index') || 0);
				const slaveSn = typesIndex == 1 ? '2' : '3';
				const header = this.trendHeader();
				this.$post(this.$url_APP_IP + this.$url_query_log_v2, {
					deviceSn: [userid],
					dataType: 'pressure',
					slaveList: [{
							slaveSn: '0',
							register: 'highPressure'
						},
						{
							slaveSn: '0',
							register: 'lowPressure'
						},
						{
							slaveSn: '0',
							register: 'heartrate'
						}
					],
					startTime: weekStart,
					endTime: todayEnd
				}, header).then(res => {
					if (seq !== this._trendSeq) return;
					const list = res && (Array.isArray(res.data) ? res.data : (Array.isArray(res.rows) ? res.rows :
						[]));
					let daySummary = null;
					let weekFallback = null;
					if (res && res.code == 200 && list.length) {
						daySummary = this.getLogSummary(this.pickTodayItem(list, ymd));
						this.fillWeekSparkFromLogs(list);
						weekFallback = {
							highPressure: this.meanSummaries(list, 'highPressureAvg'),
							lowPressure: this.meanSummaries(list, 'lowPressureAvg'),
							heartrate: this.meanSummaries(list, 'heartrateAvg')
						};
					}
					this.fetchWeekMinmax(userid, slaveSn, weekStart, todayEnd, header, (avg) => {
						this.publishTrendStability(seq, daySummary, this.weekAvgHasValue(avg) ? avg :
							weekFallback);
					});
				}).catch(() => {
					if (seq !== this._trendSeq) return;
					this.fetchWeekMinmax(userid, slaveSn, weekStart, todayEnd, header, (avg) => {
						this.publishTrendStability(seq, null, avg);
					});
				});
			},
			isValidMetric(val) {
				if (val == null || val === '') return false;
				const s = String(val).trim();
				if (!s || s === '-' || s === '--' || s === '--/--' || s === '-/-' || s === 'NA') return false;
				const n = Number(s);
				if (Number.isFinite(n) && n >= 999999990) return false;
				return true;
			},
			normalizeDateLabel(val) {
				const raw = String(val == null ? '' : val).trim();
				if (!raw || raw === '-' || raw === '--' || raw === '--/--' || raw === '-/-') return '';
				if (/^\d{1,2}\/\d{1,2}$/.test(raw)) {
					const parts = raw.split('/');
					return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
				}
				return raw;
			},
			parseTimeToMs(value) {
				if (value == null || value === '') return NaN;
				if (typeof value === 'number') {
					return value < 10000000000 ? value * 1000 : value;
				}
				const raw = String(value).trim();
				if (!raw) return NaN;
				if (/^\d+$/.test(raw)) {
					const n = Number(raw);
					return n < 10000000000 ? n * 1000 : n;
				}
				const normalized = raw.replace(/T/i, ' ').replace(/-/g, '/');
				const ms = new Date(normalized).getTime();
				return Number.isFinite(ms) ? ms : NaN;
			},
			formatDateServer(value) {
				if (value == null || value === '') return '';
				const raw = String(value).trim();
				const md = this.normalizeDateLabel(raw);
				if (md && /^\d{2}\/\d{2}$/.test(md)) return md;
				const wallMatch = raw.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
				if (wallMatch && !Number.isFinite(Number(value)) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) {
					return `${wallMatch[2].padStart(2, '0')}/${wallMatch[3].padStart(2, '0')}`;
				}
				const ts = this.parseTimeToMs(value);
				if (!Number.isFinite(ts) || ts <= 0) return '';
				const chinaMd = getChinaTimeAllJSON(new Date(ts)).MD;
				return this.normalizeDateLabel(chinaMd);
			},
			isValidRegisterVal(val) {
				return val != null && val !== '' && val !== '-/-';
			},
			getLatestRegisterFromList(list, register) {
				if (!list || !list.length) return null;
				let best = null;
				for (let i = 0; i < list.length; i++) {
					const row = list[i];
					if (!row || row.register !== register) continue;
					if (!this.isValidRegisterVal(row.registerVal) && !(row.updateTime > 0)) continue;
					if (!best) {
						best = row;
						continue;
					}
					const tNew = Number(row.updateTime) || 0;
					const tOld = Number(best.updateTime) || 0;
					if (tNew > tOld) {
						best = row;
					} else if (tNew === tOld && this.isValidRegisterVal(row.registerVal) &&
						!this.isValidRegisterVal(best.registerVal)) {
						best = row;
					}
				}
				return best;
			},
			getLatestRegisterEntry(data1, data2, type) {
				const merged = [];
				if (data1 && data1.length) merged.push(...data1);
				if (data2 && data2.length) merged.push(...data2);
				const best = this.getLatestRegisterFromList(merged, type);
				if (!best) {
					return {
						value: '-/-',
						time: 0
					};
				}
				return {
					value: this.isValidRegisterVal(best.registerVal) ? best.registerVal : '-/-',
					time: Number(best.updateTime) || 0
				};
			},
			getLatestBloodPressurePair(data1, data2) {
				const pickSide = (sideData) => {
					const high = this.getLatestRegisterFromList(sideData, 'highPressure');
					const low = this.getLatestRegisterFromList(sideData, 'lowPressure');
					const time = Math.max(Number(high && high.updateTime) || 0, Number(low && low.updateTime) || 0);
					const hasVal = this.isValidRegisterVal(high && high.registerVal) ||
						this.isValidRegisterVal(low && low.registerVal);
					return {
						high: high && high.registerVal,
						low: low && low.registerVal,
						time,
						hasVal
					};
				};
				const a = pickSide(data1 || []);
				const b = pickSide(data2 || []);
				if (a.hasVal && b.hasVal) return a.time >= b.time ? a : b;
				if (a.hasVal) return a;
				if (b.hasVal) return b;
				return a.time >= b.time ? a : b;
			},
			applyLocalHomeCache() {
				const high = uni.getStorageSync('highPressure');
				const low = uni.getStorageSync('lowPressure');
				const pulse = uni.getStorageSync('pulse');
				const spo2 = uni.getStorageSync('xueyang');
				const height = uni.getStorageSync('home_height_cm');
				if (this.isValidMetric(high)) this.highPressure = high;
				if (this.isValidMetric(low)) this.lowPressure = low;
				if (this.isValidMetric(pulse)) this.pulse = pulse;
				if (this.isValidMetric(spo2)) this.spo2 = spo2;
				if (this.isValidMetric(height)) this.heightVal = height;
				const hrLabel = this.normalizeDateLabel(uni.getStorageSync('pulsetimes'));
				const spo2Label = this.normalizeDateLabel(uni.getStorageSync('xueyangtimes'));
				const bpLabel = this.normalizeDateLabel(uni.getStorageSync('xueyatimes'));
				const heightLabel = this.normalizeDateLabel(uni.getStorageSync('home_height_times'));
				if (hrLabel) this.hrDate = hrLabel;
				if (spo2Label) this.spo2Date = spo2Label;
				if (bpLabel) this.bpDate = bpLabel;
				if (heightLabel) this.heightDate = heightLabel;
				this.applyHomeSync();
			},
			applyHomeSync(options = {}) {
				let changed = false;
				const skip = (options && options.skip) || {};
				const applyOne = (field, syncVal) => {
					if (!this.isValidMetric(syncVal)) return;
					const next = String(syncVal);
					if (String(this[field]) !== next) {
						this[field] = syncVal;
						changed = true;
					}
				};
				const applyDate = (field, syncVal) => {
					const label = this.normalizeDateLabel(syncVal);
					if (!label) return;
					if (String(this[field] || '') !== label) {
						this[field] = label;
						changed = true;
					}
				};
				if (!skip.bp) {
					applyOne('highPressure', this.syncHighPressure);
					applyOne('lowPressure', this.syncLowPressure);
					applyDate('bpDate', this.syncBpDate);
				}
				if (!skip.hr) {
					applyOne('pulse', this.syncPulse);
					applyDate('hrDate', this.syncHrDate);
				}
				if (!skip.spo2) {
					applyOne('spo2', this.syncSpo2);
					applyDate('spo2Date', this.syncSpo2Date);
				}
				if (!skip.height) {
					applyOne('heightVal', this.syncHeight);
					applyDate('heightDate', this.syncHeightDate);
				}
				if (changed && this.embedded) {
					this.applyDayFromHome();
				}
			},
			loadHomeMetrics() {
				const userid = uni.getStorageSync('userid');
				if (!userid || !uni.getStorageSync('token')) return;
				this.$post(this.$url_APP_IP + this.$url_list_recipe, {
					userId: userid
				}, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(res => {
					if (res.code != 200 || !Array.isArray(res.data)) return;
					const data = res.data;
					const sn2 = data.filter(item => item.slaveSn === '2');
					const sn3 = data.filter(item => item.slaveSn === '3');
					const latestBp = this.getLatestBloodPressurePair(sn2, sn3);
					const latestHr = this.getLatestRegisterEntry(sn2, sn3, 'heartrate');
					// 血氧与 Main.pickLatestRecipeByRegister 一致：扫全部 slaveSn，避免非 2/3 时摘要空白
					const latestO2Row = this.getLatestRegisterFromList(data, 'oxygen');
					const latestO2 = latestO2Row ? {
						value: this.isValidRegisterVal(latestO2Row.registerVal) ? latestO2Row.registerVal : '-/-',
						time: Number(latestO2Row.updateTime) || 0
					} : {
						value: '-/-',
						time: 0
					};
					const nowSec = Math.floor(Date.now() / 1000);
					const toSec = (t) => {
						const n = Number(t) || 0;
						return n > 1e12 ? Math.floor(n / 1000) : Math.floor(n);
					};
					let preferLocalBp = false;
					let preferLocalHr = false;
					let preferLocalO2 = false;
					if (this.isValidRegisterVal(latestBp.high) && this.isValidRegisterVal(latestBp.low)) {
						const bpLabel = this.formatDateServer(latestBp.time);
						const localBpTs = toSec(uni.getStorageSync('bp_measure_ts'));
						const serverBpSec = toSec(latestBp.time);
						const bpProtectUntil = Number(uni.getStorageSync('bp_local_protect_until')) || 0;
						const bpProtectActive = bpProtectUntil > Date.now();
						const lastKnownServerBpTs = toSec(uni.getStorageSync('bp_server_ts'));
						const serverBpNewerThanKnown = serverBpSec > 0 && serverBpSec > lastKnownServerBpTs + 30;
						// 无刚测保护窗，或接口比已同步 server ts 更新 → 跟接口
						preferLocalBp = !serverBpNewerThanKnown && bpProtectActive && localBpTs > 0 &&
							(nowSec - localBpTs <= 90) && localBpTs + 30 > serverBpSec;
						if (!preferLocalBp) {
							this.highPressure = latestBp.high;
							this.lowPressure = latestBp.low;
						}
						if (preferLocalBp) {
							const localLabel = this.normalizeDateLabel(uni.getStorageSync('xueyatimes'));
							if (localLabel) this.bpDate = localLabel;
							else if (bpLabel) this.bpDate = bpLabel;
						} else if (bpLabel) {
							this.bpDate = bpLabel;
							uni.setStorageSync('xueyatimes', bpLabel);
						}
					}
					if (this.isValidRegisterVal(latestHr.value)) {
						const localHrTs = toSec(uni.getStorageSync('pulse_measure_ts'));
						const serverHrSec = toSec(latestHr.time);
						preferLocalHr = localHrTs > 0 && (nowSec - localHrTs <= 90) &&
							localHrTs + 30 > serverHrSec;
						if (!preferLocalHr) {
							this.pulse = latestHr.value;
							const hrLabel = this.formatDateServer(latestHr.time) ||
								this.normalizeDateLabel(uni.getStorageSync('pulsetimes'));
							if (hrLabel) this.hrDate = hrLabel;
						} else {
							const hrLabel = this.normalizeDateLabel(uni.getStorageSync('pulsetimes')) ||
								this.formatDateServer(latestHr.time);
							if (hrLabel) this.hrDate = hrLabel;
						}
					}
					if (this.isValidRegisterVal(latestO2.value)) {
						const localO2Ts = toSec(uni.getStorageSync('oxygen_measure_ts'));
						const serverO2Sec = toSec(latestO2.time);
						preferLocalO2 = localO2Ts > 0 && (nowSec - localO2Ts <= 90) &&
							localO2Ts + 30 > serverO2Sec;
						if (!preferLocalO2) {
							this.spo2 = latestO2.value;
							const spo2Label = this.formatDateServer(latestO2.time) ||
								this.normalizeDateLabel(uni.getStorageSync('xueyangtimes'));
							if (spo2Label) this.spo2Date = spo2Label;
						}
					} else if (this.isValidMetric(uni.getStorageSync('xueyang'))) {
						this.spo2 = uni.getStorageSync('xueyang');
						const spo2Label = this.normalizeDateLabel(uni.getStorageSync('xueyangtimes'));
						if (spo2Label) this.spo2Date = spo2Label;
					}
					const heightRow = this.getLatestRegisterFromList(data, 'height');
					let preferLocalHeight = false;
					if (heightRow && this.isValidRegisterVal(heightRow.registerVal)) {
						this.heightVal = heightRow.registerVal;
						const heightLabel = this.formatDateServer(heightRow.updateTime);
						if (heightLabel) this.heightDate = heightLabel;
						preferLocalHeight = false;
					} else {
						preferLocalHeight = true;
					}
					// 仅把「本地刚测优先」的字段从 Main sync 盖回；接口已刷新的字段不要被旧 props 打回
					this.applyHomeSync({
						skip: {
							bp: !preferLocalBp,
							hr: !preferLocalHr,
							spo2: !preferLocalO2,
							height: !preferLocalHeight
						}
					});
				}).catch(() => {});
			},
			onTrendTap() {},
			onViewReport() {
				uni.navigateTo({
					url: '/pages/tabBar/main/report_all_type/report_all_type'
				});
			}
		}
	};
</script>

<style scoped>
	.health-page {
		min-height: 100vh;
		background: #F8F9FB;
		padding: 16px 16px 28px;
		box-sizing: border-box;
	}

	.health-page.is-embedded {
		min-height: auto;
		padding: 4px 12px 4px;
		transform: translateZ(0);
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.health-page.is-embedded .status-card,
	.health-page.is-embedded .metric-card,
	.health-page.is-embedded .trends-card,
	.health-page.is-embedded .ai-insight-card {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.health-page.is-embedded .ai-insight-avatar {
		background: #007AFF;
	}

	.page-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 14px;
	}

	.hs-header {
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

	.emotion-tip-card {
		margin-top: 14px;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background: #eaf4ff;
		border-radius: 14px;
		padding: 14px;
		margin-bottom: 20px;
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

	.health-page.is-embedded .emotion-tip-card {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
	}

	.header-text {
		flex: 1;
		min-width: 0;
		margin-top: 20px;
		padding-right: 10px;
	}

	.page-title {
		display: block;
		font-size: 22px;
		font-weight: 700;
		color: #1A1C1E;
		line-height: 1.25;
		margin-bottom: 5px;
	}

	.page-subtitle {
		display: block;
		font-size: 12px;
		color: #8E8E93;
		line-height: 1.45;
	}

	.status-card {
		background: #FFFFFF;
		border-radius: 20px;
		padding: 16px;
		margin-bottom: 12px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(16, 24, 40, 0.03);
		display: flex;
		flex-direction: column;
	}

	.status-main {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.status-icon-wrap {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-right: 14px;
		box-sizing: border-box;
	}

	.status-icon-wrap.status-good {
		border: 5px solid #34C759;
		background: rgba(52, 199, 89, 0.08);
		color: #34C759;
	}

	.status-icon-wrap.status-warn {
		border: 5px solid #FF9500;
		background: rgba(255, 149, 0, 0.08);
		color: #FF9500;
	}

	.status-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.status-label {
		font-size: 12px;
		color: #8E8E93;
		margin-bottom: 4px;
	}

	.status-value {
		display: block;
		font-size: 20px;
		font-weight: 700;
		line-height: 1.2;
		margin-bottom: 5px;
	}

	.status-value.status-good {
		color: #34C759;
	}

	.status-value.status-warn {
		color: #FF9500;
	}

	.status-desc {
		display: block;
		font-size: 13px;
		color: #3A3A3C;
		line-height: 1.5;
	}

	.status-updated {
		display: block;
		text-align: center;
		font-size: 11px;
		color: #AEAEB2;
		margin-top: 12px;
	}

	.metric-grid {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.metric-card {
		width: 48.4%;
		background: #FFFFFF;
		border-radius: 16px;
		padding: 10px;
		margin-bottom: 20px;
		box-sizing: border-box;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(16, 24, 40, 0.03);
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.metric-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 44px;
		margin-right: 8px;
	}

	.metric-icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}

	.metric-icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
	}

	.metric-measure {
		margin-top: 6px;
		font-size: 11px;
		line-height: 1.2;
		color: #3298F7;
		font-weight: 500;
		text-align: center;
	}

	.metric-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.metric-name {
		font-size: 14px;
		font-weight: 600;
		color: #8E8E93;
		margin-bottom: 2px;
		line-height: 1.3;
		text-align: left;
	}

	.metric-value-num {
		font-size: 21px;
		font-weight: 700;
		color: #007AFF;
		line-height: 1.25;
		word-break: break-all;
	}

	.metric-value-unit {
		margin-top: 1px;
		font-size: 13px;
		font-weight: 400;
		color: #8E8E93;
		line-height: 1.2;
	}

	.metric-date {
		margin-top: 2px;
		font-size: 11px;
		font-weight: 700;
		color: #1A1C1E;
		line-height: 1.2;
	}

	.metric-status-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 4px;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		margin-right: 4px;
		flex-shrink: 0;
	}

	.status-dot.good {
		background: #34C759;
	}

	.status-dot.warn {
		background: #FF9500;
	}

	.status-dot.mute {
		background: #C7C7CC;
	}

	.metric-status {
		font-size: 12px;
		line-height: 1.3;
		color: #8E8E93;
		font-weight: 400;
	}

	.metric-status.warn {
		color: #FF9500;
	}

	.metric-status.mute {
		color: #AEAEB2;
	}

	.metric-help {
		margin-left: 4px;
		flex-shrink: 0;
	}

	.trends-card {
		background: #FFFFFF;
		border-radius: 20px;
		padding: 16px;
		margin-bottom: 12px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(16, 24, 40, 0.03);
		padding-bottom: 20px;
		margin-bottom: 20px;
	}

	.trends-title {
		font-size: 16px;
		font-weight: 700;
		color: #1A1C1E;
		margin-bottom: 2px;
		display: block;
	}

	.trend-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 12px 0;
		border-bottom: 1px solid #F2F2F7;
	}

	.trend-row:last-child {
		border-bottom: none;
		padding-bottom: 4px;
	}

	.trend-icon-wrap {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
		margin-right: 6px;
	}

	.trend-icon {
		width: 24px;
		height: 24px;
	}

	.trend-label {
		width: 60px;
		font-size: 13px;
		font-weight: 600;
		color: #1A1C1E;
		flex-shrink: 0;
	}

	.sparkline {
		flex: 1;
		height: 44px;
		min-width: 80px;
		width: auto;
	}

	.trend-status {
		font-size: 11px;
		font-weight: 600;
		flex-shrink: 0;
		margin-left: 4px;
		white-space: nowrap;
	}

	.trend-status.good {
		color: #34C759;
	}

	.trend-status.warn {
		color: #FF9500;
	}

	.trend-status.mute {
		color: #AEAEB2;
	}

	.ai-insight-card {
		background: #EBF5FF;
		border: 1px solid #D6EBFF;
		border-radius: 20px;
		padding: 14px;
		margin-bottom: 16px;
		box-sizing: border-box;
	}

	.ai-insight-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		margin-bottom: 12px;
	}

	.ai-insight-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(160deg, #5AC8FA 0%, #007AFF 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}

	.ai-avatar-img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: contain;
	}

	.ai-insight-header-text {
		flex: 1;
		min-width: 0;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
	}

	.ai-insight-title {
		font-size: 15px;
		font-weight: 700;
		color: #007AFF;
		line-height: 1.3;
		margin-bottom: 5px;
	}

	.ai-insight-text {
		font-size: 13px;
		color: #3A3A3C;
		line-height: 1.55;
	}

	.ai-detail-btn {
		height: 44px;
		border-radius: 12px;
		background: #007AFF;
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
		color: #FFFFFF;
	}

	.ai-detail-btn-arrow {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 18px;
		color: #FFFFFF;
		line-height: 1;
	}

	.footer-note {
		display: block;
		text-align: center;
		font-size: 11px;
		color: #AEAEB2;
		line-height: 1.6;
		padding: 0 16px;
	}
</style>