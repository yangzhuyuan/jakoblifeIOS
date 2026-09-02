<template>
	<view class="health_page">
		<view class="health_avatr">
			<view class="context_btn" @click="btn_avatar()">
				<view class="context_title">{{$t('头像')}}</view>
				<view class="row-right">
					<image :src="avatar" class="avatar-img"></image>
					<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
				</view>
			</view>
			<!-- <view style="width: 80vw; height: 1px; background: gainsboro; margin-left:25px;"></view> -->
			<!-- <view class="context_btn" @click="member()">
				<view class="context_title">{{$t('会员名')}}</view>
				<view style="width: 35vw; display: flex;justify-content: flex-end;">{{username}}</view>
				<uni-icons style="margin-left: 5px;" type="forward" size="20"></uni-icons>
			</view> -->
		</view>

		<view class="section-title">{{$t('身体基础信息')}}：</view>

		<view class="health_avatr">
			<view class="bt_BG">
				<view class="text">{{$t('性别')}}</view>
				<view class="row-right">
					<view class="color_bg" :style="getcolor(select)" @click="select_click()">
						{{select}}
					</view>
					<uni-icons type="right" size="14" color="#C5CDD8" @click="select_click()"></uni-icons>
				</view>
			</view>
			<view class="row-line"></view>
			<view class="bt_BG">
				<view class="text">{{$t('出生日期')}}</view>
				<view class="row-right">
					<picker fields="day" mode="date" :value="date" @change="bindDateChange">
						<view class="picker-row">
							<view class="color_bg_1" :style="getcolor(date)">{{date}}</view>
							<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view class="row-line"></view>
			<view class="bt_BG">
				<view class="text">{{$t('身高')}}</view>
				<view class="row-right">
					<input type="number" :placeholder="$t('请输入')" v-model="height"
						class="value-input" maxlength="5" />
					<picker @change="bindPickerChange_Height" :value="Height_index" :range="Height_array">
						<view class="unit-pill">{{Height_array[Height_index]}}</view>
					</picker>
				</view>
			</view>
			<view class="row-line"></view>
			<view class="bt_BG">
				<view class="text">{{$t('体重')}}</view>
				<view class="row-right">
					<input type="number" :placeholder="$t('请输入')" v-model="width"
						class="value-input" maxlength="5" />
					<picker @change="bindPickerChange_Width" :value="Width_index" :range="Width_array">
						<view class="unit-pill">{{Width_array[Width_index]}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0" :mask-click="true">
				<view class="popup_bg">
					<view class="select_text" @click="sex_nan()">{{$t('男')}}</view>
					<view class="popup-line"></view>
					<view class="select_text" @click="sex_nv()">{{$t('女')}}</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import WeightConverter from '../../api/unitls/weightConverter.js';
	export default {
		data() {
			return {
				avatar: "../../../static/icons/40x40.png",
				username: this.$t('未登录'),
				select: this.$t('请选择'),
				height: '',
				width: '',
				date: this.$t('请选择'),
				phone: '',
				Height_array: [this.$t("英寸"), this.$t("厘米")],
				Height_index: uni.getStorageSync("danwei1") !== "" ? uni.getStorageSync("danwei1") : 0,
				Width_array: [this.$t("千克"), this.$t("英镑")],
				Width_index: uni.getStorageSync("danwei2") !== "" ? uni.getStorageSync("danwei2") : 0,
			}
		},

		onBackPress(options) {
			if (options.from === 'backbutton') {
				this.update_info()
			}
		},

		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('健康档案')
			})
			//头像返回的数据
			uni.$once('uploadFileRes', function(data) {
				that.avatar = data
			})
			that.$get(that.$url_APP_IP + that.$url_getInfo, {}, {
				'Authorization': 'Bearer ' + uni.getStorageSync("token"),
				'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
			}).then(getInfo => {
				console.log("getInfo：", getInfo)
				if (getInfo.code === 200) {
					if (getInfo.data.avatar === "" || getInfo.data.avatar === undefined) {
						that.avatar = "../../../static/icons/40x40.png"
					} else {
						that.avatar = getInfo.data.avatar
					}
					that.username = getInfo.data.nickName === null ? getInfo.data.userName : getInfo.data.nickName
					that.select = getInfo.data.sex === '0' ? that.$t('男') : that.$t('女')
					that.date = getInfo.data.birthTime
					that.height = that.Height_index === 0 ? WeightConverter.cmToInch(getInfo.data
						.height) : getInfo.data.height
					that.width = that.Width_index === 0 ? getInfo.data.weight : WeightConverter
						.kgToLb(getInfo.data.weight)
					that.phone = getInfo.data.phonenumber
				} else {
					uni.showToast({
						title: getInfo.msg,
						icon: 'none'
					})
				}
			})
		},

		methods: {

			bindPickerChange_Height: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				let that = this
				that.Height_index = e.detail.value
				uni.request({
					url: that.$url_APP_IP + that.$url_getInfo,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: function(res) {
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.data.avatar === "" || res.data.data.avatar === undefined) {
									that.avatar = "../../../static/icons/40x40.png"
								} else {
									that.avatar = res.data.data.avatar
								}
								that.username = res.data.data.nickName === null ? res.data.data.userName :
									res.data
									.data.nickName
								that.select = res.data.data.sex === '0' ? that.$t('男') : that.$t('女')
								that.date = res.data.data.birthTime
								that.height = that.Height_index === 0 ? WeightConverter.cmToInch(res.data
									.data.height) : res.data.data.height
								that.width = that.Width_index === 0 ? res.data.data.weight :
									WeightConverter.kgToLb(res.data.data.weight)
								that.phone = res.data.data.phonenumber
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						} else {
							console.log("获取数据错误")
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			bindPickerChange_Width: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				let that = this
				that.Width_index = e.detail.value
				uni.request({
					url: that.$url_APP_IP + that.$url_getInfo,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: function(res) {
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								if (res.data.data.avatar === "" || res.data.data.avatar === undefined) {
									that.avatar = "../../../static/icons/40x40.png"
								} else {
									that.avatar = res.data.data.avatar
								}
								that.username = res.data.data.nickName === null ? res.data.data.userName :
									res.data
									.data.nickName
								that.select = res.data.data.sex === '0' ? that.$t('男') : that.$t('女')
								that.date = res.data.data.birthTime
								that.height = that.Height_index === 0 ? WeightConverter.cmToInch(res.data
									.data.height) : res.data.data.height
								that.width = that.Width_index === 0 ? res.data.data.weight :
									WeightConverter
									.kgToLb(res.data.data.weight)
								that.phone = res.data.data.phonenumber
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						} else {
							console.log("获取数据错误")
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},

			//更新个人信息
			update_info() {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_update_info,
					method: 'POST',
					data: {
						nickName: that.username,
						sex: that.select === that.$t('男') ? "0" : "1",
						birthTime: that.date,
						height: that.Height_index === 0 ? WeightConverter.inchToCm(that.height) : that.height,
						weight: that.Width_index === 0 ? that.width : WeightConverter.lbToKg(that.width)
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},

					success(res) {
						console.log("更新个人信息", res)
						if (res.statusCode == 200) {
							if (res.data.code == 200) {
								that.saveUnit(that.Height_index, that.Width_index)
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}

					},
					fail(err) {
						console.log(err)
					}
				})
			},

			// 保存单位
			saveUnit(Height_index, Width_index) {
				const postData = {
					bloodUnit: uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" :
						"kPa",
					heightUnit: Height_index === 0 || Height_index === "" ? this.$t("英寸") : this.$t("厘米"),
					weightUnit: Width_index === 0 || Width_index === "" ? this.$t("千克"): this.$t("英镑"),
					switchHER: uni.getStorageSync("yaliswitchHER") || true,
				}
				const editData = {
					dataType: 'Unitdata',
					data: this.formatDatacard([postData])
				}
				console.log(editData)
				this.$post(this.$url_APP_IP + '/prod-api/device/data/editData', editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						console.log(res)
						uni.setStorageSync("danwei1", Height_index)
						uni.setStorageSync("danwei2", Width_index)
					}
				})
			},
			// 格式化数据为接口格式
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(',')
			},
			select_click() {
				this.$refs.popup.open("bottom")
			},
			sex_nan() {
				this.select = this.$t('男')
				this.$refs.popup.close()
			},
			sex_nv() {

				this.select = this.$t('女')
				this.$refs.popup.close()
			},
			bindDateChange(e) {
				this.date = e.detail.value
			},

			//更换头像
			btn_avatar() {
				uni.navigateTo({
					url: '/pages/tabBar/my/avatar_set'
				})
			},
			member() {
				uni.navigateTo({
					url: '../../tabBar/my/Member_name_modification?PHONE=' + this.phone
				})
			},
			getcolor(id) {
				return {
					color: id == this.$t('请输入') ? "gray" : "black"
				}
			},

		}
	}
</script>

<style>
	page {
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
	}

	.health_page {
		min-height: 100vh;
		padding: 16px 16px calc(28px + env(safe-area-inset-bottom));
		box-sizing: border-box;
		color: #1a2b4a;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
	}

	.health_avatr {
		background: #ffffff;
		border-radius: 20px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		overflow: hidden;
		padding: 4px 16px;
	}

	.section-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
		margin: 24px 4px 12px;
	}

	.context_btn {
		min-height: 72px;
		display: flex;
		flex-direction: row;
		background: #ffffff;
		align-items: center;
		padding: 8px 0;
	}

	.context_title {
		flex: 1;
		font-size: 16px;
		color: #1a2b4a;
		font-weight: 400;
	}

	.avatar-img {
		width: 48px;
		height: 48px;
		border-radius: 24px;
		margin-right: 8px;
		background: #f3f6fa;
	}

	.row-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		flex-shrink: 0;
		margin-left: 8px;
	}

	.picker-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.row-line {
		height: 1px;
		background: #eef1f5;
		margin: 0 4px;
	}

	.color_bg {
		color: #1a2b4a;
		text-align: right;
		font-size: 15px;
		margin-right: 6px;
	}

	.color_bg_1 {
		color: #8a94a6;
		text-align: right;
		font-size: 15px;
		margin-right: 6px;
	}

	.value-input {
		color: #1a2b4a;
		text-align: right;
		font-size: 15px;
		width: 140rpx;
		margin-right: 10px;
	}

	.unit-pill {
		background: #e8f3ff;
		color: #3298f7;
		font-size: 12px;
		line-height: 1.2;
		padding: 6px 14px;
		border-radius: 20px;
		text-align: center;
	}

	.popup_bg {
		background: #ffffff;
		border-radius: 20px;
		margin-left: 20px;
		margin-right: 20px;
		margin-bottom: 10px;
		overflow: hidden;
	}

	.popup-line {
		height: 1px;
		background: #eef1f5;
	}

	.select_text {
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 10px;
		font-size: 16px;
		font-weight: bold;
		color: #1a2b4a;
	}

	.bt_BG {
		display: flex;
		min-height: 56px;
		flex-direction: row;
		align-items: center;
		padding: 8px 0;
	}

	.text {
		flex: 1;
		font-size: 16px;
		color: #1a2b4a;
	}
</style>