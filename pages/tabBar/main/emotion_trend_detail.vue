<template>
	<view class="trend-page">
		<view class="chart-wrap-card">
			<view class="pagedsismj_4">
				<picker style="flex: 2;" @change="onTypesChange" :value="types_index" :range="types_array">
					<view style="font-size: 14px;color: white;">
						{{ types_array[types_index] }}
					</view>
				</picker>
				<picker @change="onTypesChange" :value="types_index" :range="types_array">
					<uni-icons style="flex: 1;" type="bottom" size="18" color="white"></uni-icons>
				</picker>
			</view>
			<view class="chart-section-title">
				{{ $t('当天') }}：
			</view>
			<view class="charts-box-ppg">
				<qiun-data-charts type="line" :opts="optsPPG" :chartData="chartDataPPG" />
			</view>
			<view class="chart-section-title">
				{{ $t('两周') }}：{{ $t('平均') }}
			</view>
			<view class="charts-box-ppg">
				<qiun-data-charts type="line" :opts="optsPPG2" :chartData="chartDataPPG2" />
			</view>
			<view class="divider-line"></view>
			<view class="page-transparent">
				<view class="table-title">
					{{ $t('指标阈值表') }}
				</view>
				<view class="table-box">
					<view class="thead">
						<text class="th">{{ $t('指标名称') }}</text>
						<text class="th">{{ $t('阈值') }}</text>
						<text class="th">{{ $t('对应描述') }}</text>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				types_index: 0,
				types_array: [],
				chartDataPPG: {},
				optsPPG: {},
				chartDataPPG2: {},
				optsPPG2: {},
				Indicatorlist: [],
				_syncTimer: null
			}
		},
		onLoad() {
			this.loadFromStorage()
		},
		onUnload() {
			if (this._syncTimer) {
				clearTimeout(this._syncTimer)
				this._syncTimer = null
			}
		},
		methods: {
			loadFromStorage() {
				try {
					const cached = uni.getStorageSync('emotion_trend_detail') || {}
					this.types_index = Number(cached.types_index || 0)
					this.types_array = cached.types_array || []
					this.chartDataPPG = cached.chartDataPPG || {}
					this.optsPPG = cached.optsPPG || {}
					this.chartDataPPG2 = cached.chartDataPPG2 || {}
					this.optsPPG2 = cached.optsPPG2 || {}
					this.Indicatorlist = cached.Indicatorlist || []
				} catch (e) {
					console.error('emotion_trend_detail load failed', e)
				}
			},
			getMainVm() {
				const pages = getCurrentPages() || []
				for (let i = pages.length - 1; i >= 0; i--) {
					const page = pages[i]
					const route = (page && (page.route || page.$page && page.$page.fullPath)) || ''
					if (String(route).indexOf('pages/tabBar/main/Main') !== -1) {
						return page.$vm || page
					}
				}
				return null
			},
			syncFromMain() {
				const main = this.getMainVm()
				if (!main) return
				try {
					this.types_index = Number(main.types_index || 0)
					this.types_array = main.types_array || this.types_array
					this.chartDataPPG = JSON.parse(JSON.stringify(main.chartDataPPG || {}))
					this.optsPPG = JSON.parse(JSON.stringify(main.optsPPG || {}))
					this.chartDataPPG2 = JSON.parse(JSON.stringify(main.chartDataPPG2 || {}))
					this.optsPPG2 = JSON.parse(JSON.stringify(main.optsPPG2 || {}))
					this.Indicatorlist = JSON.parse(JSON.stringify(main.Indicatorlist || []))
					uni.setStorageSync('emotion_trend_detail', {
						types_index: this.types_index,
						types_array: this.types_array,
						chartDataPPG: this.chartDataPPG,
						optsPPG: this.optsPPG,
						chartDataPPG2: this.chartDataPPG2,
						optsPPG2: this.optsPPG2,
						Indicatorlist: this.Indicatorlist
					})
				} catch (e) {
					console.error('emotion_trend_detail sync failed', e)
				}
			},
			onTypesChange(e) {
				this.types_index = Number(e.detail.value)
				const main = this.getMainVm()
				if (main && typeof main.types_change === 'function') {
					main.types_change(e)
					if (this._syncTimer) clearTimeout(this._syncTimer)
					// 图表异步加载，延迟同步几次
					this._syncTimer = setTimeout(() => this.syncFromMain(), 600)
					setTimeout(() => this.syncFromMain(), 1500)
					setTimeout(() => this.syncFromMain(), 3000)
				}
			}
		}
	}
</script>

<style scoped>
	.trend-page {
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		min-height: 100vh;
		padding: 16px;
		box-sizing: border-box;
	}

	.chart-wrap-card {
		padding: 16px;
		margin-bottom: 20px;
		box-sizing: border-box;
	}

	.pagedsismj_4 {
		background: #3298F7;
		margin: 0 0 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		padding: 15px;
		border-radius: 20px;
	}

	.chart-section-title {
		margin: 20px 0;
		font-size: 20px;
		font-weight: 600;
		display: flex;
		justify-content: flex-start;
	}

	.charts-box-ppg {
		padding: 5px;
		background: white;
		border-radius: 20px;
		width: 100%;
		height: 300px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		box-sizing: border-box;
	}

	.divider-line {
		margin-top: 20px;
		width: 100%;
		height: 1px;
		background: gray;
	}

	.page-transparent {
		background: transparent;
		padding: 20rpx;
	}

	.table-title {
		font-size: 17px;
		font-weight: 600;
		display: flex;
		justify-content: center;
	}

	.table-box {
		display: flex;
		flex-direction: column;
		border: 1rpx solid rgba(0, 0, 0, 0.15);
		border-radius: 8rpx;
		overflow: hidden;
		margin-top: 12rpx;
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