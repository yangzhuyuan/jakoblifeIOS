<template>
	<view class="pagestyle">
		<view class="title-card">
			<view class="wave"></view>
			<image class="title-hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			<view class="title_text">{{$t('相关信息')}}</view>
		</view>
		<view class="form-card">
			<view class="bt_BG">
				<view class="text">{{$t('报告日期')}}</view>
				<view class="uni-list-cell-db cell-right">
					<picker fields="day" mode="date" :value="profDate" @change="bindDateChange">
						<view class="picker-row">
							<view class="date_bg" :style="getStatusColor(profDate)">{{profDate}}</view>
							<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view class="bt_BG">
				<view class="text">{{$t('监测时间')}}</view>
				<view class="uni-list-cell-db cell-right">
					<picker :value="index1" @change="Monitoring" :range="array1">
						<view class="picker-row">
							<view class="date_bg" :style="getStatusColor1(index1)">{{array1[index1]}}</view>
							<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view class="bt_BG">
				<view class="text">{{$t('起床时间')}}</view>
				<view class="uni-list-cell-db cell-right">
					<picker fields="month" mode="time" :value="time" @change="bindTimeChange">
						<view class="picker-row">
							<view class="date_bg" :style="getStatusColor(time)">{{time}}</view>
							<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view class="bt_BG">
				<view class="text">{{$t('就寝时间')}}</view>
				<view class="uni-list-cell-db cell-right">
					<picker fields="month" mode="time" :value="time1" @change="bindTimeChange_1">
						<view class="picker-row">
							<view class="date_bg" :style="getStatusColor(time1)">{{time1}}</view>
							<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view class="bt_BG">
				<view class="text">{{$t('是否午休')}}</view>
				<view class="cell-right">
					<view class="select_bg" :style="getStatusColor(select)" @click="select_click(0)">
						{{select}}
					</view>
					<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8"
						@click="select_click(0)"></uni-icons>
				</view>
			</view>
			<view class="bt_BG">
				<view class="text">{{$t('午休时长')}}</view>
				<view class="uni-list-cell-db cell-right">
					<picker :value="index" @change="bindTimeChange_2" :range="array">
						<view class="picker-row">
							<view class="date_bg" :style="getStatusColor1(index)">{{array[index]}}</view>
							<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view class="bt_BG">
				<view class="text_1">{{$t('是否服用药物')}}</view>
				<view class="cell-right cell-right-sm">
					<view class="select_bg" :style="getStatusColor(select2)" @click="select_click(2)">
						{{select2}}
					</view>
					<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8"
						@click="select_click(2)"></uni-icons>
				</view>
			</view>
			<!-- <view class="bt_BG">
				<view class="text">{{$t('当前用药')}}</view>
				<view class="cell-right">
					<view class="select_bg" :style="getStatusColor(select3)" @click="select_click(3)">
						{{select3}}
					</view>
					<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8" @click="select_click(3)"></uni-icons>
				</view>
			</view> -->
			<view class="bt_BG">
				<view class="text_1">{{$t('工作是否倒班')}}</view>
				<view class="cell-right cell-right-sm">
					<view class="select_bg" :style="getStatusColor(select4)" @click="select_click(4)">
						{{select4}}
					</view>
					<uni-icons class="chevron" type="bottom" size="16" color="#C5CDD8"
						@click="select_click(4)"></uni-icons>
				</view>
			</view>
		</view>
		<view class="butoonstyles">
			<button class="buttonstyle_1" @click="skilp()">{{$t('跳过')}}</button>
			<button class="buttonstyle_2" @click="btn_tuesss()">{{$t('确认')}}</button>
		</view>

		<view class="popup-wrap">
			<uni-popup ref="popup" type="center" border-radius="16px" :mask-click="false">
				<view class="popup_bg">
					<view class="select_text" @click="sex_yes()">{{$t('是')}}</view>
					<view class="popup-line"></view>
					<view class="select_text" @click="sex_no()">{{$t('否')}}</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		getLocalTimeAllJSON,
		localSelectedYmdToChinaYmd
	} from '@/pages/api/unitls/timezone.js'
	export default {
		data() {
			return {
				profDate: this.getCurrentTime(),
				time: uni.getStorageSync("bindTimeChange") !== '' ? uni.getStorageSync("bindTimeChange") : this.$t(
					'请选择'),
				time1: uni.getStorageSync("bindTimeChange_1") !== '' ? uni.getStorageSync("bindTimeChange_1") : this.$t(
					'请选择'),
				array: [this.$t('请选择'), this.$t('分钟30'), this.$t('分钟60'), this.$t('分钟90'),
					this.$t('分钟120'), this.$t('小时以上2')
				],
				index: uni.getStorageSync("bindTimeChange_2") !== "" ? uni.getStorageSync("bindTimeChange_2") : 0,
				array1: [this.$t('请选择'), this.$t('监测时间在1天之内'), this.$t('监测时间在2天之内'), this.$t('监测时间在3天之内'), this.$t(
					'监测时间在4天之内'), this.$t('监测时间在5天之内'), this.$t('监测时间在6天之内'), this.$t('监测时间在当周之内'), this.$t(
					'监测时间在前2周之内'), this.$t('监测时间在前3周之内'), this.$t('监测时间在当月之内'), this.$t('监测时间在前2月之内'), this.$t(
					'监测时间在前3月之内')],
				index1: uni.getStorageSync("Monitoring") !== "" ? uni.getStorageSync("Monitoring") : 0,
				selectID: '',
				select: this.getSelectValue("select"),
				select2: this.getSelectValue("select2"),
				select3: this.getSelectValue("select3"),
				select4: this.getSelectValue("select4"),
			}
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('信息补充')
			})
		},
		methods: {
			getSelectValue(key, defaultText = '请选择') {
				const value = uni.getStorageSync(key);
				if (!value || value === "") {
					return this.$t(defaultText);
				}
				// 判断是否为"是/Yes"
				const isYes = value === "是" || value === "Yes";
				// 返回对应的翻译
				const translateKey = isYes ? "是" : "否";
				return this.$t(translateKey);
			},

			/** 界面展示：手机本地日期 */
			getCurrentTime() {
				return getLocalTimeAllJSON().YMD
			},
			getStatusColor(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === this.$t('请选择') ? 'gray' : 'black'
				};
			},
			getStatusColor1(status) {
				// 根据状态值返回不同的样式对象
				return {
					color: status === 0 ? 'gray' : 'black'
				};
			},
			bindDateChange(e) {
				this.profDate = e.detail.value
			},
			bindTimeChange(e) {
				this.time = e.detail.value
				uni.setStorageSync("bindTimeChange", this.time)
			},
			bindTimeChange_1(e) {
				this.time1 = e.detail.value
				uni.setStorageSync("bindTimeChange_1", this.time1)
			},
			bindTimeChange_2(e) {
				this.index = e.detail.value
				uni.setStorageSync("bindTimeChange_2", this.index)
			},
			Monitoring(e) {
				this.index1 = e.detail.value
				uni.setStorageSync("Monitoring", this.index1)
			},


			select_click(id) {
				this.$refs.popup.open("center")
				this.selectID = id
			},

			sex_yes() {
				this.$refs.popup.close()
				if (this.selectID === 0) {
					this.select = this.$t("是")
					uni.setStorageSync("select", this.select)
				} else if (this.selectID === 2) {
					this.select2 = this.$t("是")
					uni.setStorageSync("select2", this.select2)
				} else if (this.selectID === 3) {
					this.select3 = this.$t("是")
					uni.setStorageSync("select3", this.select3)
				} else if (this.selectID === 4) {
					this.select4 = this.$t("是")
					uni.setStorageSync("select4", this.select4)
				}
			},
			sex_no() {
				this.$refs.popup.close()
				if (this.selectID === 0) {
					this.select = this.$t("否")
					uni.setStorageSync("select", this.select)
				} else if (this.selectID === 2) {
					this.select2 = this.$t("否")
					uni.setStorageSync("select2", this.select2)
				} else if (this.selectID === 3) {
					this.select3 = this.$t("否")
					uni.setStorageSync("select2", this.select3)
				} else if (this.selectID === 4) {
					this.select4 = this.$t("否")
					uni.setStorageSync("select4", this.select4)
				}
			},

			skilp() {
				// uni.navigateTo({
				// 	url: "/pages/tabBar/tendency/Report"
				// })
				uni.navigateBack()
			},
			btn_tuesss() {
				if (this.profDate === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择报告日期'),
						icon: 'none'
					})
					return
				} else if (this.index1 === 0) {
					uni.showToast({
						title: this.$t('请选择监测时间'),
						icon: 'none'
					})
					return
				} else if (this.time === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择起床时间'),
						icon: 'none'
					})
					return
				} else if (this.time1 === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择就寝时间'),
						icon: 'none'
					})
					return
				} else if (this.select === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择是否午休'),
						icon: 'none'
					})
					return
				} else if (this.index === 0) {
					uni.showToast({
						title: this.$t('请选择午休时长'),
						icon: 'none'
					})
					return
				} else if (this.select2 === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择是否服用药物'),
						icon: 'none'
					})
					return
					// } else if (this.select3 === this.$t('请选择')) {
					// 	uni.showToast({
					// 		title: this.$t('请选择当前用药'),
					// 		icon: 'none'
					// 	})
					// 	return
				} else if (this.select4 === this.$t('请选择')) {
					uni.showToast({
						title: this.$t('请选择工作是否倒班'),
						icon: 'none'
					})
					return
				} else {
					// 选 D：中国已过 (D+1) 01:00 → 传 D+1，否则传 D（只换算一次）
					const chinaProfDate = localSelectedYmdToChinaYmd(this.profDate)
					uni.navigateTo({
						url: '../../tabBar/tendency/Report?profDate=' + chinaProfDate + "&time=" + this.time +
							"&time1=" +
							this.time1 + "&select=" + this.select + "&index=" + this.index + "&select2=" + this
							.select2 + "&select4=" + this.select4 + "&index1=" + this.index1
						// + "&select3=" + this.select3
					})
				}
			}
		}
	}
</script>

<style>
	.pagestyle {
		padding-top: 16px;
		min-height: 100vh;
		background-color: #dceefc;
		background-image: linear-gradient(180deg, #dceefc 0%, #dceefc 220px, #f4f7fb 480px, #f4f7fb 100%);
		box-sizing: border-box;
		padding-bottom: calc(24px + env(safe-area-inset-bottom));
	}

	.title-card {
		position: relative;
		overflow: hidden;
		margin: 0 16px 12px;
		padding: 12px 12px 12px 16px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #eef1f4;
		border-radius: 16px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		border: 1px solid #d8dee6;
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

	.title_text {
		position: relative;
		z-index: 1;
		flex: 1;
		margin-left: 10px;
		min-width: 0;
		color: #5b6b7a;
		font-size: 14px;
		font-weight: 700;
		line-height: 1.5;
	}

	.title-hero-img {
		position: relative;
		z-index: 1;
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.form-card {
		margin: 20px 16px;
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		overflow: hidden;
		padding: 4px 16px;
	}

	.bt_BG {
		width: auto;
		min-height: 54px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		background: transparent;
		border-bottom: 1px solid #eef1f5;
		box-sizing: border-box;
	}

	.bt_BG:last-child {
		border-bottom: none;
	}

	.text {
		flex: 1;
		min-width: 0;
		font-size: 15px;
		font-weight: 600;
		color: #1a2b4a;
		padding-right: 12px;
	}

	.text_1 {
		flex: 1;
		min-width: 0;
		font-size: 15px;
		font-weight: 600;
		color: #1a2b4a;
		padding-right: 12px;
	}

	.cell-right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-direction: row;
		flex-shrink: 0;
		max-width: 58%;
		min-width: 0;
	}

	.cell-right-sm {
		max-width: 42%;
	}

	.picker-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		min-width: 0;
	}

	.select_bg {
		text-align: right;
		margin-right: 4px;
		font-size: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.date_bg {
		text-align: right;
		font-size: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 46vw;
	}

	.chevron {
		margin-left: 6px;
		flex-shrink: 0;
	}

	.select_text {
		text-align: center;
		padding: 16px;
		font-size: 16px;
		font-weight: 600;
		color: #1a2b4a;
	}

	.popup-wrap {
		width: 100%;
	}

	.popup_bg {
		width: 72vw;
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 12px 40px rgba(26, 43, 74, 0.16);
	}

	.popup-line {
		height: 1px;
		background: #eef1f5;
		margin: 0 20px;
	}

	.butoonstyles {
		margin-top: 28px;
		margin-left: 16px;
		margin-right: 16px;
		padding-bottom: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.buttonstyle_1,
	.buttonstyle_2 {
		flex: 1;
		height: 48px;
		line-height: 48px;
		border-radius: 24px;
		font-size: 16px;
		font-weight: 600;
		margin: 0;
	}

	.buttonstyle_1 {
		margin-right: 12px;
		color: #3298F7;
		background: #ffffff;
		border: 1.5px solid #3298F7;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.buttonstyle_2 {
		color: #ffffff;
		background: #3298F7;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.buttonstyle_1::after,
	.buttonstyle_2::after {
		border: none;
	}
</style>