<template>
	<view class="page">
		<view class="filter-tabs">
			<text :class="['tab', currentTab === 'all' ? 'active' : '']" @click="switchTab('all')">
				{{$t('全部')}}({{dataList.length}})
			</text>
			<text :class="['tab', currentTab === 'day' ? 'active' : '']" @click="switchTab('day')">
				{{$t('白天')}}({{dayCount}})
			</text>
			<text :class="['tab', currentTab === 'night' ? 'active' : '']" @click="switchTab('night')">
				{{$t('夜间')}}({{nightCount}})
			</text>
		</view>
		<view class="table-tip">{{tableTipText}}</view>
		<view v-show="modeltips" class="model-tip">{{$t('无感血压AI模型建立中提示')}}</view>
		<view class="table-header">
			<text class="col-time">{{$t('测量时间')}}</text>
			<text class="col-period">{{$t('时段')}}</text>
			<text class="col-value">{{$t('收缩压')}}</text>
			<text class="col-value">{{$t('舒张压')}}</text>
			<text class="col-value">{{$t('心率')}}</text>
			<text class="col-status">{{$t('状态')}}</text>
		</view>

		<scroll-view scroll-y class="list-scroll">
			<view v-if="loading" class="empty-tip">{{$t('加载中')}}</view>
			<view v-else-if="filteredList.length === 0" class="empty-tip">{{$t('暂无数据')}}</view>
			<view v-for="(item, index) in filteredList" :key="index"
				:class="['table-row', item.period === 'night' ? 'night-row' : '']">
				<view class="col-time">
					<text class="time-date">{{item.datePart}}</text>
					<text class="time-clock">{{item.clockPart}}</text>
				</view>
				<text class="col-period">
					<text :class="['period-tag', item.period]">{{item.periodText}}</text>
				</text>
				<text class="col-value">{{item.systolic}}</text>
				<text class="col-value">{{item.diastolic}}</text>
				<text class="col-value">{{item.heartRate}}</text>
				<text class="col-status">
					<text :class="['status-tag', item.status]">{{item.statusText}}</text>
				</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getChinaTimeAllJSON,
		getLocalTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'
	export default {
		data() {
			return {
				loading: false,
				dataList: [],
				currentTab: 'all',
				bloodUnit: uni.getStorageSync('Blood') === 0 || uni.getStorageSync('Blood') === '' ? 'mmHg' : 'kPa',
				// 与 7 天监测报告同一套查询，保证同一天（如 16 号）无感明细一致
				pacitime: getChinaTimeAllJSON().YMD + ' 07:00:00',
				filterVarList: "JLvFLGvJL01v1W",
				period: "1W",
				modeltips: true,
			}
		},
		computed: {
			filteredList() {
				if (this.currentTab === 'all') return this.dataList
				return this.dataList.filter(item => item.period === this.currentTab)
			},
			dayCount() {
				return this.dataList.filter(item => item.period === 'day').length
			},
			nightCount() {
				return this.dataList.filter(item => item.period === 'night').length
			},
			/** 提示截止日期：手机本地昨天（与列表展示的最新日一致） */
			tableTipText() {
				const localYmd = getLocalTimeAllJSON().YMD
				const today = new Date(String(localYmd).replace(/-/g, '/'))
				const yesterday = new Date(today.getTime())
				yesterday.setDate(yesterday.getDate() - 1)
				const month = yesterday.getMonth() + 1
				const day = yesterday.getDate()
				const locale = (this.$i18n && this.$i18n.locale) || 'zh-CN'
				const isEn = String(locale).toLowerCase().startsWith('en')
				const monthNames = [
					'January', 'February', 'March', 'April', 'May', 'June',
					'July', 'August', 'September', 'October', 'November', 'December'
				]
				const dateText = isEn ?
					`${monthNames[month - 1]} ${day}` :
					`${month}月${day}日`
				return this.$t('当天数据云端计算中需明天查询', {
					date: dateText
				})
			}
		},
		onShow() {
			const modeltipsbool = uni.getStorageSync("temperature")
			uni.setNavigationBarTitle({
				title: this.$t('无感血压报告')
			})
			this.get_retVarList()
			if (modeltipsbool && modeltipsbool !== '-/-' && Number(modeltipsbool) >= 100) this.modeltips = false

		},
		methods: {
			switchTab(tab) {
				this.currentTab = tab
			},
			isInvalidValue(value) {
				const v = String(value == null ? '' : value).trim()
				return !v || v >= '999999990.00' || v === 'NA'
			},

			getPeriod(timeStr) {
				const parsed = this.parseMeasureDateTime(timeStr)
				const clock = parsed.clock || ''
				const hour = clock ? Number(clock.split(':')[0]) : 0
				const minute = clock ? Number(clock.split(':')[1]) : 0
				const timeInMinutes = hour * 60 + minute
				const dayStart = 6 * 60
				const dayEnd = 21 * 60 + 30
				if (timeInMinutes >= dayStart && timeInMinutes < dayEnd) {
					return {
						period: 'day',
						periodText: this.$t('白天')
					}
				}
				return {
					period: 'night',
					periodText: this.$t('夜间')
				}
			},

			/** 统一解析测量时间：兼容空格/T，避免把年份当成小时 */
			parseMeasureDateTime(raw) {
				const pad = (n) => String(Number(n) || 0).padStart(2, '0')
				const empty = {
					date: '',
					clock: '',
					clockSec: -1,
					sortKey: '',
					ts: 0,
					display: ''
				}
				const fromParts = (y, mo, d, hh, mm, ss) => {
					const date = (y != null && mo != null && d != null) ? `${y}-${pad(mo)}-${pad(d)}` : ''
					const h = Number.isFinite(hh) ? hh : 0
					const m = Number.isFinite(mm) ? mm : 0
					const s = Number.isFinite(ss) ? ss : 0
					const clock = `${pad(h)}:${pad(m)}`
					const clockSec = h * 3600 + m * 60 + s
					const sortKey = `${date || '0000-00-00'} ${clock}:${pad(s)}`
					let ts = 0
					if (date) {
						ts = new Date(`${date.replace(/-/g, '/')} ${clock}:${pad(s)}`).getTime()
						if (!Number.isFinite(ts)) ts = 0
					}
					return {
						date,
						clock,
						clockSec,
						sortKey,
						ts,
						display: date ? `${date} ${clock}` : clock
					}
				}
				let s = String(raw == null ? '' : raw).trim()
				if (!s) return empty
				if (/^\d{10}$/.test(s)) {
					const d = new Date(Number(s) * 1000)
					return fromParts(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d
						.getSeconds())
				}
				if (/^\d{13}$/.test(s)) {
					const d = new Date(Number(s))
					return fromParts(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d
						.getSeconds())
				}
				s = s.replace(/\//g, '-').replace(/\.\d+/g, '').replace(/[Zz]$/, '').replace(/[+-]\d{2}:?\d{2}$/, '')
					.trim()
				const dm = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
				const tm = s.match(/(?:[T\s]|^)(\d{1,2}):(\d{2})(?::(\d{2}))?/)
				if (dm || tm) {
					return fromParts(
						dm ? Number(dm[1]) : null,
						dm ? Number(dm[2]) : null,
						dm ? Number(dm[3]) : null,
						tm ? Number(tm[1]) : 0,
						tm ? Number(tm[2]) : 0,
						tm && tm[3] != null ? Number(tm[3]) : 0
					)
				}
				return empty
			},

			convertPressure(value) {
				if (this.isInvalidValue(value)) return '-'
				if (this.bloodUnit === 'mmHg') return value
				return (Number(value) * 0.133).toFixed(1)
			},

			formatHeartRate(value) {
				if (this.isInvalidValue(value)) return '-'
				return value
			},

			getStatus(sys, dia) {
				const systolic = Number(sys)
				const diastolic = Number(dia)
				if (!sys || !dia || Number.isNaN(systolic) || Number.isNaN(diastolic)) {
					return {
						code: '',
						text: '/'
					}
				}
				if (systolic >= 140 || diastolic >= 90) {
					return {
						code: 'high',
						text: this.$t('偏高')
					}
				}
				if (systolic <= 90 || diastolic <= 60) {
					return {
						code: 'low',
						text: this.$t('偏低')
					}
				}
				if (systolic >= 120 || diastolic >= 80) {
					return {
						code: 'warning',
						text: this.$t('正常高值')
					}
				}
				return {
					code: 'normal',
					text: this.$t('正常')
				}
			},

			processRetVarList(retVarListStr) {
				if (!retVarListStr) return []
				const rows = retVarListStr.split(';').filter(Boolean)
				const list = []
				for (const row of rows) {
					const parts = row.split(',').map(item => item.trim())
					if (parts.length < 4) continue
					const fullTime = parts[0]
					if (this.isInvalidValue(parts[1]) || this.isInvalidValue(parts[2])) continue
					const parsed = this.parseMeasureDateTime(fullTime)
					const periodInfo = this.getPeriod(parsed.clock || fullTime)
					const status = this.getStatus(parts[1], parts[2])
					list.push({
						time: parsed.display || (fullTime.length >= 16 ? fullTime.substring(0, 16) : fullTime),
						datePart: parsed.date,
						clockPart: parsed.clock,
						clockSec: parsed.clockSec,
						sortKey: parsed.sortKey,
						systolic: this.convertPressure(parts[1]),
						diastolic: this.convertPressure(parts[2]),
						heartRate: this.formatHeartRate(parts[3]),
						period: periodInfo.period,
						periodText: periodInfo.periodText,
						status: status.code,
						statusText: status.text,
						timestamp: parsed.ts || new Date(String(fullTime).replace(/T/i, ' ').replace(/-/g, '/'))
							.getTime()
					})
				}
				const cmp = (a, b) => {
					const da = a.datePart || ''
					const db = b.datePart || ''
					if (da !== db) return da < db ? 1 : -1
					const ca = Number.isFinite(a.clockSec) ? a.clockSec : -1
					const cb = Number.isFinite(b.clockSec) ? b.clockSec : -1
					if (ca !== cb) return cb - ca
					return 0
				}
				const sorted = list.sort(cmp)
				const seen = new Set()
				// 按测量时间（精确到分钟）去重，同分钟只保留一条
				const unique = sorted.filter(item => {
					const key = (item.datePart && item.clockPart) ?
						`${item.datePart} ${item.clockPart}` :
						item.time
					if (!key || seen.has(key)) return false
					seen.add(key)
					return true
				})
				// 按手机本地日期只展示「昨天 + 前天」
				const filtered = this.filterByLocalRecentTwoDays(unique)
				return filtered.sort(cmp)
			},
			/** 手机本地日历：昨天、前天的 YMD 集合 */
			getLocalRecentTwoDayKeys() {
				const pad = (n) => String(n).padStart(2, '0')
				const localYmd = getLocalTimeAllJSON().YMD
				const today = new Date(String(localYmd).replace(/-/g, '/'))
				const keys = []
				for (let i = 1; i <= 2; i++) {
					const d = new Date(today.getTime())
					d.setDate(d.getDate() - i)
					keys.push(
						`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
					)
				}
				return new Set(keys)
			},
			filterByLocalRecentTwoDays(list) {
				const dayKeys = this.getLocalRecentTwoDayKeys()
				return (list || []).filter(item => {
					const ymd = String(item.datePart || item.time || '')
						.slice(0, 10)
						.replace(/\//g, '-')
					return dayKeys.has(ymd)
				})
			},
			get_retVarList() {
				const that = this
				const token = uni.getStorageSync('token')
				if (!token) {
					that.dataList = []
					return
				}
				that.loading = true
				const data = {
					userId: uni.getStorageSync("userid"),
					// 永远中国时间
					profDate: getChinaTimeAllJSON().YMD + ' 07:00:00',
					filterVarList: that.filterVarList,
					retVarList: 'TIME_MEASURE,JLvOPRvJL01vSBP,JLvOPRvJL01vDBP,JLvOPRvJL01vHR'
				}
				console.log('get_retVarLisdata参数：', data)
				that.$post(that.$url_APP_IP + '/prod-api/device_app/get_retVarList', data, {
					'Authorization': 'Bearer ' + token,
					'content-type': 'application/x-www-form-urlencoded'
				}).then((res) => {
					console.log('get_retVarLis：', res)
					if (res.code === 200 && res.data && res.data.retVarList) {
						that.dataList = that.processRetVarList(res.data.retVarList)
					} else {
						that.dataList = []
					}
				}).catch((e) => {
					console.warn('[Smooth_BP_Data] get_retVarList failed', e)
					that.dataList = []
				}).finally(() => {
					that.loading = false
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		padding: 10px;
		height: 100vh;
		box-sizing: border-box;
		background: #f5f5f5;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.filter-tabs {
		position: sticky;
		top: 0;
		z-index: 20;
		flex-shrink: 0;
		display: flex;
		background: #EB1508;
		padding: 20rpx;
		border-bottom: 1px solid #c41008;
	}

	.tab {
		flex: 1;
		text-align: center;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.85);
		padding: 16rpx 0;
		border-radius: 8rpx;
	}

	.tab.active {
		color: #EB1508;
		background: #ffffff;
		font-weight: 600;
	}

	.table-header,
	.table-row {
		display: flex;
		align-items: flex-start;
		padding: 20rpx 16rpx;
	}

	.table-header {
		align-items: center;
		flex-shrink: 0;
		background: #FF6B00;
		border-bottom: 1px solid #e55a00;
		font-size: 26rpx;
		font-weight: 600;
		color: #ffffff;
	}

	.table-row {
		background: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		font-size: 26rpx;
		color: #333;
	}

	.table-row:nth-child(even) {
		background: #fafafa;
	}

	.table-row.night-row {
		background: #f3f6fb;
	}

	.col-time {
		flex: 0.85;
		min-width: 0;
		display: flex;
		flex-direction: column;
		line-height: 1.3;
	}

	.time-date {
		font-size: 22rpx;
		color: #666;
		word-break: break-all;
	}

	.time-clock {
		font-size: 24rpx;
		color: #333;
		margin-top: 4rpx;
	}

	.col-period {
		flex: 0.75;
		text-align: center;
		padding-top: 2rpx;
	}

	.col-value {
		flex: 0.65;
		text-align: center;
		padding-top: 2rpx;
	}

	.col-status {
		flex: 0.85;
		text-align: center;
		padding-top: 2rpx;
	}

	.period-tag {
		display: inline-block;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-size: 22rpx;
	}

	.period-tag.day {
		color: #007aff;
		background: rgba(0, 122, 255, 0.1);
	}

	.period-tag.night {
		color: #5856d6;
		background: rgba(88, 86, 214, 0.1);
	}

	.status-tag {
		display: inline-block;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		font-size: 22rpx;
	}

	.status-tag.normal {
		background: #e8f5e9;
		color: #4caf50;
	}

	.status-tag.warning {
		background: #fff3e0;
		color: #ff9800;
	}

	.status-tag.high {
		background: #ffebee;
		color: #f44336;
	}

	.status-tag.low {
		background: #e3f2fd;
		color: #2196f3;
	}

	.list-scroll {
		flex: 1;
		height: 0;
		padding-bottom: 60rpx;
		box-sizing: border-box;
	}

	.empty-tip {
		padding: 80rpx 20rpx;
		text-align: center;
		color: #999;
		font-size: 28rpx;
	}

	.table-tip {
		flex-shrink: 0;
		padding: 16rpx 20rpx;
		font-size: 24rpx;
		line-height: 1.5;
		color: red;
		text-align: center;
		background: #fff8e8;
		border-bottom: 1px solid #f0e6c8;
	}

	.model-tip {
		margin-top: 16rpx;
		padding: 16rpx 20rpx;
		font-size: 22rpx;
		line-height: 1.55;
		color: #fff8e8;
		text-align: left;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 12rpx;
	}
</style>