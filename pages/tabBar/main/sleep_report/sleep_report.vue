<template>
	<view style="padding: 20px;">
		<button class="btnstyle" @click="setting()">{{$t("定时测量")}}</button>
		<button class="btnstyle" @click="sleep_alert()">{{$t("立即测量")}}</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceId: uni.getStorageSync("landeviceId"),
				serviceId: uni.getStorageSync("lanserviceId"),
				characteristicId: uni.getStorageSync("landcharacteristicId"),
			}
		},
		onShow() {
			let that = this;
			uni.setNavigationBarTitle({
				title: that.$t('情绪检测')
			})
		},
		methods: {
			setting() {
				uni.navigateTo({
					url: "/pages/tabBar/main/sleep_report/Reports_Alerts"
				})
			},
			sleep_alert() {
				this.startheart(1)
				uni.showLoading({
					title: this.$t("请稍后")
				})
				uni.setStorageSync("sleep_alert", 1)
			},
			startheart(type) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceId,
					serviceId: that.serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								that.sendstartheartwatch(item.uuid, type)
							}
						}
					},
					fail(res) {
						uni.showToast({
							title: that.$t("请检查设备连接"),
							icon: 'none'
						})
					}
				})
			},
			sendstartheartwatch(writeuuid, type) {
				let that = this
				let buffer2
				if (type === 1) {
					buffer2 = that.toArrayBuffer("e00006F3060104000101") //心率
				} else if (type === 2) {
					buffer2 = that.toArrayBuffer("e00006F5060106000101") //血氧
				} else {
					buffer2 = that.toArrayBuffer("e00006F4060105000101") //血压
				}
				console.log(that.deviceId)
				console.log(that.serviceId)
				console.log(writeuuid)
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceId,
						serviceId: that.serviceId,
						characteristicId: writeuuid,
						writeType: 'write',
						value: buffer2,
						complete() {
							if (type === 1 || type === 2) {
								console.log("1开始心率/血氧测量：" + (type === 1 ? "e00006F3060104000101" :
									"e00006F5060106000101"))
							} else {
								console.log("1开始血压测量：" + "e00006F4060105000101")
							}
							uni.showToast({
								title: that.$t("成功"),
								icon: 'none'
							})
							uni.showLoading({
								title: that.$t("测量中")
							})
						},
					})
				}, 3000)
			},
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
		}
	}
</script>

<style>
	.btnstyle {
		margin-top: 20px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}
</style>