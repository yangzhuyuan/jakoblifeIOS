<template>
	<view class="weight-page">
		<view class="bodyfat-header">
			<view class="bodyfat-header-left">
				<text class="bodyfat-title">{{ $t('体重摘要') }}</text>
				<text class="bodyfat-subtitle">{{ $t('记录体重随时间的变化') }}</text>
			</view>
			<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			<!-- <view class="bodyfat-date-badge">
				<uni-icons type="calendar" size="16" color="#3298F7"></uni-icons>
				<text class="bodyfat-date-text">{{ dateLabel }}</text>
			</view> -->
		</view>

		<view class="weight-cards-row">
			<view class="weight-card current-card" @click="$emit('new-latest')">
				<view class="current-icon-wrap">
					<image src="../../../static/icons/6.png" class="current-icon-img" mode="aspectFit"></image>
				</view>
				<text class="current-label">{{ $t('当前体重') }}</text>
				<view class="current-value-row">
					<text class="current-value">{{ Latest_weight }}</text>
					<text class="current-unit">{{ newweightKG }}</text>
				</view>
				<view class="current-divider"></view>
				<text class="current-foot">{{ measuredFootText }}</text>
			</view>

			<view class="weight-card goals-card">
				<view class="goal-section" @click="$emit('initial')">
					<view class="goal-icon-wrap goal-icon-flag">
						<image src="/static/page_icon/chushitizhong.png" class="scale-icon2" mode="aspectFit" />
					</view>
					<view class="goal-text-col">
						<text class="goal-row-label">{{ $t('初始体重') }}</text>
						<view class="goal-row-value">
							<text class="goal-num">{{ Initial_weight }}</text>
							<text class="goal-unit">{{ chuhsikg }}</text>
						</view>
					</view>
				</view>
				<view class="goals-divider"></view>
				<view class="goal-section" @click="$emit('target')">
					<view class="goal-icon-wrap goal-icon-target">
						<image src="/static/page_icon/mubiao.png" class="scale-icon2" mode="aspectFit" />
					</view>
					<view class="goal-text-col">
						<text class="goal-row-label">{{ $t('目标体重') }}</text>
						<view class="goal-row-value">
							<text class="goal-num">{{ Target_weight }}</text>
							<text class="goal-unit">{{ chuhsikg }}</text>
						</view>
					</view>
				</view>
				<view class="goals-divider"></view>
				<view class="edit-goals-wrap" @click="$emit('target')">
					<text class="edit-goals-link">{{ $t('编辑目标') }}</text>
				</view>
			</view>
		</view>

		<view class="sync-tip-banner">
			<uni-icons type="info-filled" size="18" color="#3298F7"></uni-icons>
			<text class="sync-tip-text">{{ $t('体脂秤注意事项') }}</text>
		</view>
		<!-- <button class="measure-btn" @click="$emit('new-latest')">
			<image src="../../../static/icons/6.png" class="measure-btn-icon" mode="aspectFit"></image>
			<text class="measure-btn-text">{{ $t('测量体重') }}</text>
		</button> -->
		<view class="bodyfat-card measure-card" @click="$emit('body-measure-click')">
			<view class="measure-card-header">
				<text class="measure-card-title">{{ $t('身体围度') }}</text>
				<view class="measure-unit-row">
					<text class="measure-unit-label">{{ $t('单位') }}</text>
				</view>
			</view>
			<view class="measure-grid">
				<view class="measure-grid-item">
					<text class="measure-grid-label">{{ $t('胸围') }}</text>
					<view class="measure-grid-value-box">
						<text class="measure-grid-value">{{ displayMeasure(Chest_circumference) }}</text>
					</view>
				</view>
				<view class="measure-grid-item">
					<text class="measure-grid-label">{{ $t('腰围') }}</text>
					<view class="measure-grid-value-box">
						<text class="measure-grid-value">{{ displayMeasure(waistline) }}</text>
					</view>
				</view>
				<view class="measure-grid-item">
					<text class="measure-grid-label">{{ $t('臀围') }}</text>
					<view class="measure-grid-value-box">
						<text class="measure-grid-value">{{ displayMeasure(Hip_circumference) }}</text>
					</view>
				</view>
				<view class="measure-grid-item">
					<text class="measure-grid-label">{{ $t('上臂围') }}</text>
					<view class="measure-grid-value-box">
						<text class="measure-grid-value">{{ displayMeasure(Upper_Chest_circumference) }}</text>
					</view>
				</view>
				<view class="measure-grid-item">
					<text class="measure-grid-label">{{ $t('大腿围') }}</text>
					<view class="measure-grid-value-box">
						<text class="measure-grid-value">{{ displayMeasure(Thigh_circumference) }}</text>
					</view>
				</view>
				<view class="measure-grid-item">
					<text class="measure-grid-label">{{ $t('小腿围') }}</text>
					<view class="measure-grid-value-box">
						<text class="measure-grid-value">{{ displayMeasure(Calf_circumference) }}</text>
					</view>
				</view>
			</view>
			<view class="add-measure-btn">
				<uni-icons type="plusempty" size="18" color="#3298F7"></uni-icons>
				<text class="add-measure-text">{{ $t('添加围度数据') }}</text>
			</view>
		</view>

		<view class="bodyfat-card trend-card">
			<view class="trend-header">
				<uni-icons type="bars" size="18" color="#3298F7"></uni-icons>
				<text class="trend-title">{{ $t('体重趋势') }}</text>
			</view>
			<view class="trend-chart-wrap">
				<view v-if="hasTrendData" class="charts-box-2">
					<qiun-data-charts :canvas2d="true" type="line" canvas-id="bodyfatTrendToday" :opts="tizhonngopts"
						:chartData="chartData2" />
				</view>
				<view v-else class="trend-empty">
					<view class="trend-empty-grid">
						<view class="trend-empty-icon-wrap">
							<uni-icons type="bars" size="20" color="#3298F7"></uni-icons>
						</view>
					</view>
					<text class="trend-empty-text">{{ $t('需要更多测量数据才能显示趋势') }}</text>
				</view>
			</view>
		</view>
		<view class="data_bg_A">
			<view class="tzkpsx" v-show="binaji2" @click="$emit('tiaozhen2')">{{ $t("编辑数据卡片") }}</view>
			<view class="drag-containersss">
				<basic-drag v-model="list2Model" :disabled="disabledsaaa2" itemKey="title" :column="2"
					itemHeight="130px" @update:disabled="$emit('update:disabled', $event)">
					<template #item="{element}">
						<view class="data_item_bgsss" :class="'animation2-' + animation2">
							<view class="icon_bgsss">
								<image :src="element.image" class="img_style" mode="aspectFit" />
								<text class="icon_text_bgsss">{{ element.title }}</text>
							</view>
							<view style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">
								<view v-if="element.bmi_show">
									<view style="display: flex; flex-direction: row;align-items: center;">
										<text
											style="margin-left: 5px; color: black;font-size: 10px;white-space: nowrap;text-overflow: ellipsis;overflow: auto;width: 45px;text-align: right;">{{ element.BMI_ys }}</text>
										<uni-icons type="help" size="15"
											@tap="$emit('bmi-tap', element.title)"></uni-icons>
									</view>
								</view>
								<view
									style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end;">
									<view v-if="element.bmi_show">
										<view v-if="element.BMI_TF == 0">
											<view
												style="width: 10px; height:10px;background: #FCCD41;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==1"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==2"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #FC7F41;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==3"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #F55A5A;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==4"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #7A0101;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==10"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
											</view>
										</view>
										<view v-else
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #333333;border-radius: 50px;">
											</view>
										</view>
									</view>
									<text
										style="text-align: right;font-size: 16px;margin-left: 10px;">{{ element.Step_number }}</text>
								</view>
								<text
									style="text-align: right;color: gray;font-size: 10px;">{{ element.type_LX }}</text>
								<text style="text-align: right;font-size: 13px;">{{ element.Step_count }}</text>
							</view>
							<view v-show="delate_icon2" class="delete-button"
								@touchstart.stop.prevent="$emit('delete-card', element.title, element)">
								<image src="/static/icons/minus_filled.png" class="delete-icon" mode="aspectFit" />
							</view>
						</view>
					</template>
				</basic-drag>
			</view>
			<view v-show="button_show2" style="display: flex;flex-direction: column;">
				<view style="display: flex;justify-content: center;color: gray;">{{ $t('长按拖动可调整数据卡片位置') }}
				</view>
				<view
					style="display: flex;flex-direction: row;justify-content: space-between; align-items: center; margin-top: 20px;">
					<view @click="$emit('confirm-cards')" class="cardstyle_1">{{ $t('确认') }}
					</view>
					<view @click="$emit('add-card')" class="cardstyle_2">
						{{ $t('添加数据卡片') }}
					</view>
				</view>
			</view>
		</view>

		<view class="bodyfat-bottom-spacer"></view>
	</view>
</template>

<script>
	import BasicDrag from '@/components/basic-drag/index.vue';
	import WeightConverter from '../../api/unitls/weightConverter.js';

	export default {
		name: 'BodyFatSwiperItem',
		components: {
			BasicDrag
		},
		props: {
			Latest_weight: {
				type: [String, Number],
				default: '--/--'
			},
			newweightKG: {
				type: String,
				default: ''
			},
			Latest_date: {
				type: String,
				default: '--/--'
			},
			Initial_weight: {
				type: [String, Number],
				default: '--/--'
			},
			chuhsikg: {
				type: String,
				default: ''
			},
			Target_weight: {
				type: [String, Number],
				default: '--/--'
			},
			list2: {
				type: Array,
				default: () => []
			},
			binaji2: {
				type: Boolean,
				default: true
			},
			disabledsaaa2: {
				type: Boolean,
				default: true
			},
			animation2: {
				type: String,
				default: ''
			},
			delate_icon2: {
				type: Boolean,
				default: false
			},
			button_show2: {
				type: Boolean,
				default: false
			},
			Chest_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			waistline: {
				type: [String, Number],
				default: '--/--'
			},
			Hip_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Upper_Chest_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Thigh_circumference: {
				type: [String, Number],
				default: '--/--'
			},
			Calf_circumference: {
				type: [String, Number],
				default: '--/--'
			}
		},
		data() {
			return {
				chartData2: {
					categories: [],
					series: [{
						name: this.$t('体重'),
						data: []
					}]
				},
				tizhonngopts: {
					color: ['#3298F7'],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true,
						gridType: 'dash',
						fontSize: 10,
						calibration: false,
						axisLine: false
					},
					yAxis: {
						splitNumber: 5,
						gridType: 'dash',
						data: [{
							min: 5,
							max: 150,
							position: 'left',
							fontSize: 10,
							textAlign: 'left',
							calibration: false,
							axisLine: true
						}]
					},
					extra: {
						line: {
							type: 'straight',
							width: 2,
							activeType: 'hollow'
						}
					}
				},
				trendLoading: false,
				rawTrendDetails: []
			}
		},
		computed: {
			list2Model: {
				get() {
					return this.list2
				},
				set(val) {
					this.$emit('update:list2', val)
				}
			},
			dateLabel() {
				return this.formatDateFromParts(new Date())
			},
			measuredFootText() {
				const raw = String(this.Latest_date || '').trim()
				if (!raw || raw === '--/--' || raw === '-/-' || raw === '--') {
					return ''
				}
				return `${this.$t('测量于')}${raw}`
			},
			hasTrendData() {
				const series = (this.chartData2 && this.chartData2.series) || []
				const data = (series[0] && series[0].data) || []
				return data.some(item => item !== null && item !== '' && !Number.isNaN(Number(item)))
			}
		},
		watch: {
			Latest_weight() {
				this.fetchTodayWeightTrend()
			},
			newweightKG() {
				this.applyTrendChart()
			}
		},
		mounted() {
			uni.$on('unit-settings-changed', this.applyTrendChart)
			this.fetchTodayWeightTrend()
		},
		beforeDestroy() {
			uni.$off('unit-settings-changed', this.applyTrendChart)
		},
		methods: {
			displayMeasure(value) {
				const raw = String(value == null ? '' : value).trim()
				if (!raw || raw === '--/--' || raw === '-/-' || raw === '--') {
					return '—'
				}
				return raw
			},
			formatDateFromParts(date) {
				return this.formatDateLabel(date.getMonth() + 1, date.getDate())
			},
			formatDateLabel(month, day) {
				const locale = uni.getLocale()
				if (locale === 'zh-Hans' || locale === 'zh-Hant') {
					return `${month}月${day}日`
				}
				const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				return `${monthNames[month - 1]} ${day}`
			},
			getTodayRange() {
				const now = new Date()
				const localDate =
					`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
				return {
					start: `${localDate} 00:00:00`,
					end: `${localDate} 23:59:59`
				}
			},
			isKgUnit() {
				const u = String(this.newweightKG || '').trim()
				return u === 'KG' || u === 'kg' || u === '千克' || u === this.$t('千克') || u === this.$t('千克1')
			},
			isLbUnit() {
				return !this.isKgUnit()
			},
			convertWeight(kgValue) {
				const num = Number(kgValue)
				if (!Number.isFinite(num)) return null
				if (this.isLbUnit()) {
					return Number(WeightConverter.kgToLb(num))
				}
				return Number(num.toFixed(1))
			},
			updateChartYAxis(values) {
				const nums = values.filter(v => Number.isFinite(v))
				if (!nums.length) return
				const minVal = Math.min(...nums)
				const maxVal = Math.max(...nums)
				const padding = Math.max(2, (maxVal - minVal) * 0.2 || 5)
				this.tizhonngopts.yAxis.data[0].min = Math.max(0, Math.floor(minVal - padding))
				this.tizhonngopts.yAxis.data[0].max = Math.ceil(maxVal + padding)
			},
			applyTrendChart() {
				const categories = []
				const data = []
				this.rawTrendDetails.forEach(detail => {
					const weight = this.convertWeight(detail.weightKg)
					if (weight == null) return
					categories.push(detail.time || '')
					data.push(weight)
				})
				this.chartData2 = {
					categories,
					series: [{
						name: this.$t('体重'),
						data
					}]
				}
				if (data.length) {
					this.updateChartYAxis(data)
				}
			},
			async fetchTodayWeightTrend() {
				if (this.trendLoading) return
				this.trendLoading = true
				const {
					start,
					end
				} = this.getTodayRange()
				const deviceSn = uni.getStorageSync('userid')
				if (!deviceSn) {
					this.rawTrendDetails = []
					this.chartData2 = {
						categories: [],
						series: [{
							name: this.$t('体重'),
							data: []
						}]
					}
					this.trendLoading = false
					return
				}
				try {
					const res = await this.$post(this.$url_APP_IP + this.$url_query_log_v2, {
						deviceSn,
						dataType: 'weight',
						slaveList: [{
							slaveSn: '0',
							register: 'weight'
						}],
						startTime: start,
						endTime: end
					}, {
						Authorization: 'Bearer ' + uni.getStorageSync('token'),
						'content-type': 'application/json;charset=UTF-8'
					})
					const details = []
					if (res.code === 200 && Array.isArray(res.data)) {
						res.data.forEach(item => {
							const list = (item.object && item.object.details) || []
							list.forEach(detail => {
								if (detail && detail.weight != null && detail.weight !== '') {
									details.push(detail)
								}
							})
						})
					}
					details.sort((a, b) => {
						const ta = parseInt(a.timestamp, 10) || 0
						const tb = parseInt(b.timestamp, 10) || 0
						return ta - tb
					})
					this.rawTrendDetails = details.map(detail => {
						const weightKg = Number(detail.weight)
						return {
							time: detail.time || '',
							weightKg: Number.isFinite(weightKg) ? weightKg : null
						}
					}).filter(item => item.weightKg != null)
					this.applyTrendChart()
				} catch (error) {
					console.error('fetchTodayWeightTrend failed:', error)
					this.rawTrendDetails = []
					this.chartData2 = {
						categories: [],
						series: [{
							name: this.$t('体重'),
							data: []
						}]
					}
				} finally {
					this.trendLoading = false
					this.$nextTick(() => this.$forceUpdate())
				}
			}
		}
	}
</script>

<style scoped>
	.weight-page {
		background: #f4f7fb;
		padding: 16px 16px 0;
		min-height: 100%;
		box-sizing: border-box;
	}

	.bodyfat-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.bodyfat-header-left {
		margin-top: 20px;
		flex: 1;
		min-width: 0;
		padding-right: 10px;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.bodyfat-title {
		display: block;
		font-size: 22px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.2;
	}

	.bodyfat-subtitle {
		display: block;
		margin-top: 4px;
		font-size: 13px;
		color: #8a94a6;
		line-height: 1.3;
	}

	.bodyfat-date-badge {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #eaf4ff;
		border-radius: 18px;
		padding: 6px 12px;
		flex-shrink: 0;
	}

	.bodyfat-date-text {
		margin-left: 4px;
		font-size: 13px;
		font-weight: 600;
		color: #3298F7;
		line-height: 1;
	}

	.weight-cards-row {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		margin-bottom: 20px;
		gap: 10px;
	}

	.weight-card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		padding: 14px 12px;
		box-sizing: border-box;
	}

	.current-card {
		flex: 1.05;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 16px 14px 14px;
	}

	.goals-card {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 12px 14px;
	}

	.current-icon-wrap {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: #3298F7;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.current-icon-img {
		width: 40px;
		height: 40px;
		object-fit: contain;
	}

	.current-label {
		margin-top: 10px;
		font-size: 14px;
		font-weight: 600;
		color: #1a2b4a;
		text-align: center;
		line-height: 1.2;
	}

	.current-value-row {
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		justify-content: center;
	}

	.current-value {
		font-size: 38px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1;
	}

	.current-unit {
		margin-left: 4px;
		font-size: 14px;
		font-weight: 500;
		color: #1a2b4a;
		line-height: 1;
	}

	.current-divider {
		width: 100%;
		margin: 12px 0 10px;
		height: 1px;
		background: #e8ecf2;
	}

	.current-foot {
		display: block;
		width: 100%;
		text-align: center;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.3;
		min-height: 16px;
	}

	.goal-section {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 4px 0;
	}

	.goal-icon-wrap {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.goal-icon-flag {
		background: #eaf4ff;
	}

	.goal-icon-target {
		background: #e8f8ee;
	}

	.goal-text-col {
		margin-left: 12px;
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
	}

	.scale-icon-wrap2 {
		width: 22px;
		height: 22px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.scale-icon2 {
		width: 22px;
		height: 22px;
		border-radius: 12px;
		object-fit: contain;
	}

	.goal-row-label {
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.2;
	}

	.goal-row-value {
		margin-top: 2px;
		display: flex;
		flex-direction: row;
		align-items: baseline;
	}

	.goal-num {
		font-size: 20px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.15;
	}

	.goal-unit {
		margin-left: 4px;
		font-size: 12px;
		color: #8a94a6;
	}

	.goals-divider {
		height: 1px;
		background: #eef1f6;
		margin: 6px 0;
	}

	.edit-goals-wrap {
		padding: 4px 0 2px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.edit-goals-link {
		font-size: 13px;
		font-weight: 600;
		color: #3298F7;
		text-align: center;
	}

	.sync-tip-banner {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background: #eaf4ff;
		border-radius: 14px;
		padding: 12px 14px;
		margin-bottom: 20px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.sync-tip-text {
		flex: 1;
		margin-left: 8px;
		font-size: 12px;
		color: #3298F7;
		line-height: 1.5;
	}

	.measure-btn {
		width: 100%;
		height: 48px;
		margin: 0 0 16px;
		padding: 0;
		background: #3298F7;
		border-radius: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		line-height: 48px;
		box-shadow: 0 2px 8px rgba(50, 152, 247, 0.35);
	}

	.measure-btn::after {
		border: none;
	}

	.measure-btn-text {
		margin-left: 8px;
		font-size: 15px;
		font-weight: 600;
		color: #ffffff;
	}

	.measure-btn-icon {
		width: 20px;
		height: 20px;
	}

	.data_bg_A {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		margin-top: 0;
		margin-left: -16px;
		margin-right: -16px;
		padding: 20px 0 24px 0;
	}

	.tzkpsx {
		height: 38px;
		width: auto;
		display: flex;
		justify-content: center;
		background: white;
		align-items: center;
		margin: 0 20px 20px 20px;
		padding: 10px;
		font-size: 13px;
		font-weight: 400;
		border-radius: 10px;
		color: #3298F7;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.drag-containersss {
		display: flex;
		justify-content: center;
		padding-left: 20px;
	}

	.data_item_bgsss {
		height: 90px;
		line-height: 20px;
		width: 36vw;
		display: flex;
		flex-direction: row;
		background: white;
		justify-content: space-between;
		align-items: center;
		border-radius: 20px;
		padding: 10px;
		margin-left: 1px;
		margin-top: 1px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.icon_bgsss {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		width: 60px;
		font-size: 13px;
		text-align: center;
		font-weight: 600;
	}

	.img_style {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.animation2-shake {
		animation: shake 1s infinite;
	}

	@keyframes shake {
		0% {
			transform: translateX(0) rotate(-2deg)
		}

		50% {
			transform: translateX(5px) rotate(2deg)
		}

		100% {
			transform: translateX(0) rotate(-2deg)
		}
	}

	.delete-button {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.01);
		z-index: 10;
	}

	.delete-icon {
		width: 25px;
		height: 25px;
		pointer-events: none;
	}

	.cardstyle_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		color: #3298F7;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin-right: 10px;
		margin-left: 10vw;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.cardstyle_2 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		color: #3298F7;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin-left: 10px;
		margin-right: 10vw;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.bodyfat-card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
		padding: 16px;
		margin-bottom: 20px;
		box-sizing: border-box;
	}

	.measure-card-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 14px;
	}

	.measure-card-title {
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
	}

	.measure-unit-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.measure-unit-label {
		font-size: 12px;
		color: #8a94a6;
	}

	.measure-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		margin-bottom: 14px;
	}

	.measure-grid-item {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.measure-grid-label {
		font-size: 11px;
		color: #8a94a6;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.measure-grid-value-box {
		margin-top: 8px;
		width: 100%;
		max-width: 46px;
		height: 34px;
		background: #f4f7fb;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.measure-grid-value {
		font-size: 13px;
		font-weight: 600;
		color: #1a2b4a;
	}

	.add-measure-btn {
		height: 44px;
		border: 1.5px solid #3298F7;
		border-radius: 22px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background: #ffffff;
	}

	.add-measure-text {
		margin-left: 6px;
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
	}

	.trend-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 12px;
	}

	.trend-title {
		margin-left: 6px;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
	}

	.trend-chart-wrap {
		min-height: 220px;
	}

	.charts-box-2 {
		height: 220px;
	}

	.trend-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 220px;
	}

	.trend-empty-grid {
		width: 100%;
		height: 160px;
		border: 1px dashed #d8dee8;
		border-radius: 12px;
		background-image:
			linear-gradient(to right, #eef1f6 1px, transparent 1px),
			linear-gradient(to bottom, #eef1f6 1px, transparent 1px);
		background-size: 24px 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.trend-empty-icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #eaf4ff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.trend-empty-text {
		margin-top: 12px;
		font-size: 12px;
		color: #8a94a6;
		text-align: center;
		line-height: 1.4;
		padding: 0 12px;
	}

	.bodyfat-bottom-spacer {
		height: 160px;
	}
</style>