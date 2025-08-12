<template>
	<view style="color: black;height: 100vh;background: #F7F7F7;">
		<view style="display: flex; justify-content: center;">
			<image class="img" src="../../../static/icons/success.png"></image>
		</view>
		<view style="margin: 40px 20px 0 20px; text-align: center; font-size: 16px; font-weight: 600;">
			{{$t('设备绑定成功')}}
		</view>
		<view v-if="modelIdtype === '体脂秤'"
			style="color: black; margin: 10px 20px 0 20px;font-size: 14px; font-weight: 600;">
			{{$t('体脂秤注意事项')}}
		</view>
		<view v-else-if="modelIdtype === ''"
			style="color: black; margin: 10px 20px 0 20px;font-size: 14px; font-weight: 600;">
			{{$t('血压计注意事项')}}
			<button style="margin-left: 20px; margin-right: 20px;margin-top: 40px;"
				@click="gotosetting()">{{$t("去设置")}}</button>
		</view>
		<!-- <view v-else-if="modelIdtype === '手表'"
			style="color: black; margin: 10px 20px 0 20px;font-size: 14px; font-weight: 600;">
			{{$t('手表注意事项')}}
			<button style="margin-left: 20px; margin-right: 20px;margin-top: 40px;"
				@click="gotosetting()">{{$t("去设置")}}</button>
		</view> -->
		<view v-else></view>
		<view class="btn">
			<button class="btn_BG" @click="btn_click()">{{$t('确定')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				modelIdtype: ""
			}
		},

		onLoad(opt) {
			if (opt.modelId === "20000") { //体脂秤
				this.modelIdtype = "体脂秤"
			} else if (opt.modelId === "20001") { //体脂秤
				this.modelIdtype = "体脂秤"
			} else if (opt.modelId === "30000") { //体脂秤
				this.modelIdtype = "手表"
			} else if (opt.modelId === "30001") { //体脂秤
				this.modelIdtype = "手表"
			} else { //其他设备
				this.modelIdtype = ""
			}
		},

		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t('绑定设备')
			})
		},

		methods: {
			...mapMutations(['register_unername', 'sethuilian']),
			btn_click() {
				this.user()
			},

			gotosetting() {
				this.openBluetoothSettings()
			},
			openBluetoothSettings() {
				// APP 端
				// #ifdef APP-PLUS
				if (plus.os.name === 'Android') {
					// Android 代码
					const main = plus.android.runtimeMainActivity();
					const Intent = plus.android.importClass("android.content.Intent");
					const Settings = plus.android.importClass("android.provider.Settings");
					const intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
					main.startActivity(intent);
				} else {
					plus.runtime.launchApplication({
						action: 'APP-Prefs:root=BLE'
					}, function(e) {
						console.log(e)
					})
				}
				// #endif
			},

			user() {
				let that = this
				uni.request({
					url: that.$url_getInfo,
					method: 'GET',
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success: function(res) {
						console.log("获取用户信息成功:", res)
						if (res.data.code == 200) {
							if (res.data.data.weight === '' || res.data.data.weight == null) {
								that.register_unername(res.data.data.nickName)
								uni.reLaunch({
									url: '../../login/Register_success2'
								})
							} else {
								that.sethuilian(true)
								uni.switchTab({
									url: '../../tabBar/main/Main'
								})
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style>
	.img {
		margin-top: 138px;
		width: 68px;
		height: 68px;
	}

	.btn {
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.btn_BG {
		width: auto;
		margin: 20px 20px 48px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
	}
</style>