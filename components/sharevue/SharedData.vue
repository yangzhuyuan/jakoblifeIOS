<template>
	<view class="shared-data-root">
		<view class="data-card">
			<view class="data-list">
				<view class="data-row" v-for="(dataPoint, index) in dataPoints" :key="index">
					<view class="data-row-inner">
						<view class="data-icon-wrap">
							<image class="data-icon" mode="aspectFit" :src="getRegisterIcon(dataPoint.register)">
							</image>
						</view>
						<view class="data-label">
							{{ getRegisterName(dataPoint.register) }}
						</view>
						<view class="data-value">
							{{ getRegisterValue(dataPoint.register, dataPoint.registerVal) }}
						</view>
						<view v-if="show1" class="data-arrow">
							<uni-icons type="right" size="16" color="#C0C7D1"></uni-icons>
						</view>
						<view v-else class="data-arrow">
							<view v-if="getRegisterValueICON(dataPoint.register, dataPoint.registerVal)">
								<image @click="viewHistory(getRegisterName(dataPoint.register),item.sharerId)"
									mode="aspectFit" class="history-icon"
									:src="getRegisterValueICON(dataPoint.register, dataPoint.registerVal)"></image>
							</view>
							<view v-else>
								<uni-icons type="right" size="16" color="#C0C7D1"></uni-icons>
							</view>
						</view>
					</view>
					<view v-if="index < dataPoints.length - 1" class="data-divider"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			dataPoints: Array,
			show1: Boolean
		},
		methods: {
			getRegisterName(register) {
				const names = {
					lowPressure: this.$t('舒张压'),
					highPressure: this.$t('收缩压'),
					heartrate: this.$t('脉搏'),
					oxygen: this.$t('血氧'),
					mood_index: this.$t("心情指数"),
					depression_risk_score: this.$t("抑郁风险评分"),
					stress_index: this.$t("压力指数"),
					fatigue_index: this.$t("疲劳指数"),
					recovery_index: this.$t("恢复指数"),
					temperature: this.$t('体温'),
					pressure: this.$t('压力'),
					start_weight: this.$t('初始体重'),
					goal_weight: this.$t('目标体重'),
					weight: this.$t('体重'),
					height: this.$t('身高'),
					chest_circumference: this.$t('胸围'),
					waistline: this.$t('腰围'),
					hipline: this.$t('臀围'),
					biceps_circumference: this.$t('上臂围'),
					thigh_circumference: this.$t('大腿围'),
					calf_circumference: this.$t('小腿围'),
					bmi: 'BMI'
				};
				return names[register] || register;
			},
			getRegisterValue(register, value) {
				const units = {
					heartrate: 'BPM',
					lowPressure: 'mmHg',
					highPressure: 'mmHg',
					start_weight: 'kg',
					goal_weight: 'kg',
					weight: 'kg',
					bmi: 'kg/m²',
					oxygen: '%',
					temperature: '℃',
					pressure: 'kPa',
					mood_index: "/10",
					depression_risk_score: "/10",
					stress_index: "/10",
					fatigue_index: "/10",
					recovery_index: "/10",
				};
				return `${value}${units[register] || ''}`;
			},
			getRegisterValueICON(register, value) {
				const imageicon = {
					lowPressure: "/static/page_icon/share_chakan.png",
					highPressure: "/static/page_icon/share_chakan.png",
					heartrate: "/static/page_icon/share_chakan.png",
					mood_index: "/static/page_icon/share_chakan.png",
					depression_risk_score: "/static/page_icon/share_chakan.png",
					stress_index: "/static/page_icon/share_chakan.png",
					fatigue_index: "/static/page_icon/share_chakan.png",
					recovery_index: "/static/page_icon/share_chakan.png",
				};
				return `${imageicon[register] || ''}`;
			},
			getRegisterIcon(register) {
				// 与首页 Health_Summary / Main 卡片图标一致
				const icons = {
					lowPressure: "/static/icons/3.png",
					highPressure: "/static/icons/3.png",
					pressure: "/static/icons/3.png",
					heartrate: "/static/icons/5.png",
					oxygen: "/static/page_icon/10.png",
					mood_index: "/static/icons/5.png",
					depression_risk_score: "/static/icons/5.png",
					stress_index: "/static/icons/5.png",
					fatigue_index: "/static/icons/5.png",
					recovery_index: "/static/icons/5.png",
					height: "/static/icons/2.png",
					weight: "/static/icons/6.png",
					start_weight: "/static/icons/6.png",
					goal_weight: "/static/icons/6.png",
					bmi: "/static/icons/6.png",
					temperature: "/static/icons/4.png",
				};
				return icons[register] || "/static/icons/3.png";
			},
			// 新增：查看历史
			viewHistory(register, shareid) {
				// console.log("register", register)
				// console.log("shareid", shareid)
				if (this.show1) return
				// 跳转到历史数据页面
				if (register === this.$t('舒张压') || register === this.$t('收缩压') || register === this.$t('脉搏')) {
					// 跳转到历史数据页面
					uni.navigateTo({
						url: `../share/share_history_BOOL?register=${register}&shareid=${shareid}`
					})
				} else {
					uni.navigateTo({
						url: `../share/share_history?register=${register}&shareid=${shareid}`
					})
				}
			},
		}
	}
</script>

<style scoped>
	.shared-data-root {
		display: flex;
		flex-direction: column;
		margin-top: 12px;
		box-sizing: border-box;
	}

	.data-card {
		background: #FFFFFF;
		border-radius: 16px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		overflow: hidden;
		padding: 4px 0;
		box-sizing: border-box;
	}

	.data-list {
		width: 100%;
	}

	.data-row {
		padding: 0 16px;
	}

	.data-row-inner {
		display: flex;
		flex-direction: row;
		padding: 18px 0;
		align-items: center;
		min-height: 56px;
	}

	.data-icon-wrap {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-right: 12px;
	}

	.data-icon {
		width: 28px;
		height: 28px;
	}

	.data-label {
		font-weight: 600;
		flex: 1;
		min-width: 0;
		font-size: 17px;
		color: #1A2B4A;
	}

	.data-value {
		color: #1A2B4A;
		font-weight: 600;
		font-size: 16px;
		text-align: right;
		margin-right: 8px;
		flex-shrink: 0;
	}

	.data-arrow {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.history-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

	.data-divider {
		background: #E8ECF1;
		height: 1px;
		width: 100%;
		margin-left: 52px;
	}
</style>