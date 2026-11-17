<template>
	<view class="effect-report">
		<view class="effect-heading"><text class="effect-title">{{ hrt('report') }}</text>
			<picker :range="[hrt('days1'), hrt('days7')]" :value="days === 7 ? 1 : 0"
				@change="$emit('days-change', Number($event.detail.value) ? 7 : 1)">
				<view class="range-pill"><text>{{ hrt(days === 7 ? 'days7' : 'days1') }}</text>
					<view class="range-chevron"></view>
				</view>
			</picker>
		</view>
		<view v-if="!enabled || loading || failed || !trend.enough" class="effect-empty" @click="failed && loadTrend()">
			<ReminderIcon kind="analysis" /><text
				class="effect-empty-title">{{ hrt(!enabled ? 'analysisOff' : loading ? 'loading' : failed ? 'loadFailed' : 'noData') }}</text><text>{{ hrt('noDataIntro') }}</text>
		</view>
		<view v-else>
			<view class="effect-summary">
				<view class="summary-icon" :class="{ neutral: !bothDown }">{{ !trend.comparable ? '•' : bothDown ? '✓' : '↕' }}</view>
				<view class="summary-copy"><text
						class="effect-summary-title">{{ hrt(days !== 7 ? 'measuredBP' : !trend.comparable ? 'average' : bothDown ? 'bpDecreased' : bothUp ? 'bpIncreased' : 'trend') }}</text><text
						v-for="item in deltas" :key="item.key" class="summary-change">{{ hrt(item.key) }}
						{{ trend.comparable ? hrt(item.value < 0 ? 'down' : item.value > 0 ? 'up' : 'unchanged') : '' }}
						{{ item.value ? Math.abs(item.value) + ' mmHg' : '' }}</text></view>
			</view>
			<view class="effect-chart"><qiun-data-charts type="area" canvas-id="medicationEffectTrend" :canvas2d="false"
					:inScrollView="true" :animation="false" :opts="chartOptions" :chartData="chartData" /></view>
			<view v-if="days !== 7" class="effect-readings">
				<view class="reading-row reading-heading"><text>{{ hrt('measuredTime') }}</text><text>{{ hrt('systolic') }} (mmHg)</text><text>{{ hrt('diastolic') }} (mmHg)</text></view>
				<view v-for="point in trend.points" :key="point.id" class="reading-row"><text>{{ point.time }}</text><text>{{ point.high }}</text><text>{{ point.low }}</text></view>
			</view>
			<text v-if="days === 7" class="delta-caption">{{ hrt(trend.comparable ? 'changed' : 'average') }}</text>
			<view v-if="days === 7" class="effect-deltas">
				<view v-for="item in deltas" :key="item.key"><text v-if="trend.comparable"
						class="delta-arrow">{{ item.value < 0 ? '↓' : item.value > 0 ? '↑' : '—' }}</text>
					<view><text>{{ hrt(item.key) }}</text><text
							class="delta-value">{{ trend.comparable && item.value > 0 ? '+' : '' }}{{ item.value }} mmHg</text></view>
				</view>
			</view>
			<text class="trend-note">{{ hrt('trendNote') }}</text>
		</view>
	</view>
</template>
<script>
	import {
		medicationEffectTrend
	} from '@/pages/tabBar/main/Reminders/api/medicationEffectTrend.js'
	import {
		localReminderDate, createHealthReminderStore
	} from '@/pages/tabBar/main/Reminders/api/healthReminders.js'
	import {
		healthReminderText
	} from '@/pages/tabBar/main/Reminders/api/healthReminderText.js'
	import ReminderIcon from './ReminderIcon.vue'
	export default {
		components: {
			ReminderIcon
		},
		props: {
			enabled: Boolean,
			days: {
				type: Number,
				default: 1
			},
			refreshKey: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				rows: [],
				schedules: { bp: [], medication: [] },
				loading: false,
				failed: false
			}
		},
		computed: {
			trend() {
				return medicationEffectTrend(this.rows, this.days, Date.now(), this.schedules)
			},
			bothDown() {
				return this.trend.highChange < 0 && this.trend.lowChange < 0
			},
			bothUp() {
				return this.trend.highChange > 0 && this.trend.lowChange > 0
			},
			deltas() {
				if (this.days !== 7) return []
				return [{
					key: 'systolic',
					value: this.trend.comparable ? this.trend.highChange : this.trend.highAverage
				}, {
					key: 'diastolic',
					value: this.trend.comparable ? this.trend.lowChange : this.trend.lowAverage
				}]
			},
			chartData() {
				return {
					categories: this.trend.points.map(p => this.days === 7 ? p.date.slice(5) : p.time),
					series: [{
							name: this.hrt('systolic') + ' (mmHg)',
							legendShape: 'circle',
							data: this.trend.points.map(p => p.high),
							connectNulls: false
						},
						{
							name: this.hrt('diastolic') + ' (mmHg)',
							legendShape: 'circle',
							data: this.trend.points.map(p => p.low),
							connectNulls: false
						}
					]
				}
			},
			chartBounds() {
				const values = this.trend.points.flatMap(p => [p.high, p.low]).filter(value => value !== null);
				return values.length ? {
					min: Math.max(0, Math.floor(Math.min(...values) / 20) * 20 - 20),
					max: Math.ceil(Math.max(...values) / 20) * 20
				} : {}
			},
			chartOptions() {
				return {
					color: ['#008cff', '#24c436'],
					padding: [20, 8, 0, 0],
					dataLabel: false,
					enableScroll: false,
					legend: {
						position: 'top',
						fontSize: 10
					},
					xAxis: {
						disableGrid: true,
						labelCount: this.days === 7 ? 7 : Math.max(1, Math.min(4, this.trend.points.length))
					},
					yAxis: {
						gridType: 'solid',
						gridColor: '#dcecff',
						data: [this.chartBounds]
					},
					extra: {
						area: {
							type: 'straight',
							width: 2,
							addLine: true,
							gradient: true,
							opacity: 0.16,
							activeType: 'hollow'
						}
					}
				}
			}
		},
		mounted() {
			this.loadTrend()
		},
		beforeDestroy() {
			this._disposed = true
		},
		watch: {
			enabled() {
				this.loadTrend()
			},
			days() {
				this.loadTrend()
			},
			refreshKey() {
				this.loadTrend()
			}
		},
		methods: {
			hrt(key) {
				return healthReminderText(this, key)
			},
			async loadTrend() {
				const generation = this._generation = (this._generation || 0) + 1
				this.rows = []
				this.schedules = { bp: [], medication: [] }
				this.failed = false
				this.loading = false
				if (!this.enabled) {
					this.rows = [];
					this.loading = false;
					return
				}
				const token = uni.getStorageSync('token'),
					userId = uni.getStorageSync('userid'),
					base = this.$url_APP_IP
				if (!token || !userId) return
				const current = () => !this._disposed && generation === this._generation && token === uni
					.getStorageSync('token') && userId === uni.getStorageSync('userid') && base === this.$url_APP_IP
				const start = new Date();
				start.setDate(start.getDate() - (this.days === 7 ? 7 : 1) + 1)
				const store = createHealthReminderStore({ baseUrl: base, storage: uni,
					get: (...args) => this.$get(...args), post: (...args) => this.$post(...args) })
				this.loading = true;
				this.failed = false
				try {
					const [result, schedules] = await Promise.all([this.$post(base + this.$url_query_log_v2, {
						deviceSn: [userId],
						dataType: 'pressure',
						slaveList: [{
							slaveSn: '0',
							register: 'highPressure'
						}, {
							slaveSn: '0',
							register: 'lowPressure'
						}],
						startTime: localReminderDate(start) + ' 00:00:00',
						endTime: localReminderDate(new Date()) + ' 23:59:59'
					}, {
						Authorization: 'Bearer ' + token,
						'content-type': 'application/json;charset=UTF-8'
					}), store.loadAnalysisReminders()])
					if (!current()) return
					if (!result || result.code !== 200) throw new Error('BP read failed')
					this.schedules = schedules
					this.rows = Array.isArray(result.data) ? result.data : Array.isArray(result.rows) ? result.rows :
					[]
				} catch (e) {
					if (current()) this.failed = true
				} finally {
					if (current()) this.loading = false
				}
			}
		}
	}
</script>
<style scoped>
	.effect-heading picker {
		flex-shrink: 0
	}

	.range-pill {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		line-height: 20px
	}

	.range-chevron {
		width: 6px;
		height: 6px;
		flex-shrink: 0;
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		transform: translateY(-2px) rotate(45deg)
	}

	.effect-summary {
		display: flex;
		align-items: flex-start;
		gap: 11px
	}

	.summary-icon {
		width: 31px;
		height: 31px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: linear-gradient(135deg, #9cdd72, #50c03a);
		color: white;
		font-size: 25px;
		flex-shrink: 0
	}

	.summary-icon.neutral {
		background: #85b8de
	}

	.summary-copy {
		flex: 1;
		min-width: 0
	}

	.summary-change {
		display: block
	}

	.delta-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		width: 31px;
		height: 31px;
		background: #f1faeb;
		flex-shrink: 0
	}

	.trend-note {
		display: block;
		text-align: center;
		font-size: 10px;
		color: #8492a4;
		line-height: 1.5;
		margin-top: 11px
	}

	.effect-empty .reminder-symbol {
		opacity: .4
	}

	.effect-report {
		margin-top: 16px;
		border: 1px solid #d8eaf8;
		border-radius: 21px;
		background: linear-gradient(#e8f4ff, #fff 45%);
		padding: 13px 11px;
		box-shadow: 0 3px 9px #dbe9f4
	}

	.effect-heading {
		display: flex;
		align-items: center;
		gap: 7px;
		font-weight: 700;
		font-size: 16px;
		color: #101d39
	}

	.effect-title {
		flex: 1;
		min-width: 0
	}

	.range-pill {
		white-space: nowrap;
		border: 1px solid #c0dfff;
		border-radius: 16px;
		padding: 5px 9px;
		font-size: 12px;
		background: #ddebff
	}

	.effect-summary {
		background: #eef9ef;
		border-radius: 13px;
		padding: 12px;
		margin-top: 12px;
		font-size: 12px;
		color: #33583b;
		line-height: 1.5
	}

	.effect-summary-title {
		display: block;
		color: #217a30;
		font-size: 17px;
		font-weight: 700;
		margin-bottom: 3px
	}

	.effect-chart {
		height: 220px;
		margin-top: 10px
	}

	.effect-empty {
		min-height: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		gap: 10px;
		color: #7a8c9f;
		padding: 18px;
		font-size: 13px;
		line-height: 1.6
	}

	.effect-empty-title {
		font-weight: 700;
		font-size: 16px
	}

	.effect-deltas {
		display: flex;
		gap: 9px;
		margin-top: 8px
	}

	.effect-deltas>view {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 6px;
		border: 1px solid #e1ebf0;
		border-radius: 12px;
		font-size: 12px
	}

	.delta-arrow {
		color: #198642;
		font-size: 30px
	}

	.delta-value {
		display: block;
		font-weight: 700;
		color: #1c2a3c;
		font-size: 15px;
		margin-top: 4px
	}

	.delta-caption {
		display: block;
		text-align: center;
		color: #8b98a7;
		font-size: 11px
	}

	.effect-readings {
		margin-top: 8px;
		border: 1px solid #e1ebf0;
		border-radius: 12px;
		overflow: hidden
	}

	.reading-row {
		display: flex;
		padding: 9px 4px;
		text-align: center;
		font-size: 12px;
		color: #1c2a3c
	}

	.reading-row + .reading-row {
		border-top: 1px solid #e1ebf0
	}

	.reading-row text {
		flex: 1;
		min-width: 0
	}

	.reading-heading {
		font-size: 10px;
		color: #8492a4
	}
</style>
