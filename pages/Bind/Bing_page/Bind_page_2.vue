<template>
	<view class="backpage">
		<view v-if="img_scan" class="img_scansty">
			<app-scan ref="appScan" @getCode="getCode" />
		</view>
		<view v-else class="img_scansty_1">
			<view class="imgss">
				<image lazy-load class="imgss1" mode="aspectFit" :src="scan_img" />
			</view>
			<view class="Model_number">{{ xinghao }}</view>
			<view v-if="img_scan===false" class="Message1">{{ context_msg }}</view>
		</view>
		<view v-if="img_scan" class="Message">{{modelname ==="BPW1"?$t("扫描手表里边的二维码"):$t("扫描设备背面的二维码")}}</view>
		<button class="button_style1" @click="ButtonTap()">{{$t("输入设备码")}}</button>
		<view v-if="modelname==='BPW1'"
			style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_shoubiao_1.jpg" />
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_shoubiao_2.jpg" />
		</view>
		<view v-else-if="modelname==='JL-S260'||modelname==='JL-S100'"
			style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_tz.jpg" />
		</view>
		<view v-else style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_xy.jpg" />
		</view>
		<view class="Messageback">
			<button class="button_style" @click="True_Bind()">{{$t("确认绑定")}}</button>
			<button class="button_style1" @click="unbind()">{{$t("暂不绑定")}}</button>
		</view>
		<!-- 手动输入弹窗 -->
		<uni-popup ref="qiehuanpopup" type="center" :mask-click="true">
			<view class="popup-content">
				<view style="font-size:16px;color:black;text-align: center;font-weight: 600;">
					{{ $t('手动输入') }}
				</view>
				<input v-model="inputcontext" :placeholder="$t('输入设备码')"
					style="border:1px solid gray;margin:10px;height:48px;text-align:center;">
				<button style="background: #3298F7;margin:20px;color: white;"
					@click="shoudongbtn()">{{$t("确定")}}</button>
				<button style="background: red;margin:20px;color: white;"
					@click="shoudongbtncancle()">{{$t("取消")}}</button>
			</view>
		</uni-popup>

		<view>
			<uni-popup ref="popup1" :mask-click="true">
				<view class="popupstusdsd_2">
					<view style="padding: 10px 0 40px 0">
						<view class="popupstusdsditem">{{$t("配对成功")}}</view>
						<view class="popupstusdsditem_1">{{$t("蓝牙已连接成功")}}</view>
						<view>{{$t("标准蓝牙提示")}}</view>
					</view>
					<button @tap="turesss()" class="butonstsd">{{$t("确定")}}</button>
				</view>
			</uni-popup>
		</view>

		<view>
			<uni-popup ref="popupblequanixan" :mask-click="true">
				<view class="popupstusdsd_2">
					<view style="padding: 10px 0 40px 0">
						<view class="popupstusdsditem">{{$t("当前蓝牙未开启是否去设置打开")}}</view>
					</view>
					<button @tap="blequanxian()" class="butonstsd">{{$t("确定")}}</button>
				</view>
			</uni-popup>
		</view>

	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	import permision from "@/js_sdk/wa-permission/permission.js"
	const platform = uni.getSystemInfoSync().platform;
	import appScan from "../../../uni_modules/simbalkj-scan/components/simbalkj-scan/appScan.vue"
	const lan = uni.getLocale();
	const modelIdToImagePathzh = {
		30000: "/static/image/BPW1.png", // 手表
		30001: "/static/image/BPW1.png", // 手表
		20000: "/static/image/tizhi1.jpg", // 体脂秤
		20001: "/static/image/tizhi1.jpg", // 体脂秤
		10000: "/static/image/xueya1.png", // 血压计
		10001: "/static/image/xueya1.png", // 血压计
		10002: "/static/image/xueya1.png", // 血压计
		10003: "/static/image/xueya1.png", // 血压计
		10004: "/static/image/xueya1.png", // 血压计
		10005: "/static/image/xueya1.png", // 血压计
		10006: "/static/image/xueya1.png", // 血压计
	};
	const modelIdToImagePath = {
		30000: "/static/image/shoubiao1.png", // 手表
		30001: "/static/image/shoubiao1.png", // 手表
		20000: "/static/image/tizhi1.jpg", // 体脂秤
		20001: "/static/image/tizhi1.jpg", // 体脂秤
		10000: "/static/image/xueya1.png", // 血压计
		10001: "/static/image/xueya1.png", // 血压计
		10002: "/static/image/xueya1.png", // 血压计
		10003: "/static/image/xueya1.png", // 血压计
		10004: "/static/image/xueya1.png", // 血压计
		10005: "/static/image/xueya1.png", // 血压计
		10006: "/static/image/xueya1.png", // 血压计
	};
	export default {
		components: {
			appScan
		},
		data() {
			return {
				img_scan: false,
				scan_img: "../../../static/image-active.png",
				xinghao: '',
				context_msg: this.$t('请将条码放入扫码框内即可自动扫描'),
				modelConnectType: '',
				SELECT_TYPE: '',
				modelname: '',
				context_msg1: "",
				modelId: '',
				inputcontext: '',
				BPW1deviceId: "",
				BPW1model: '30000',
				stoponble: false,
				BPW1UUID: "",

			};
		},

		onLoad(res) {
			console.log(res)
			this.SELECT_TYPE = res.SELECT_TYPE
			this.modelConnectType = res.modelConnectType
			this.modelname = res.name
			uni.setNavigationBarTitle({
				title: this.$t("绑定设备")
			})
		},

		onHide() {
			console.log("onHide")
			uni.setStorageSync("openBluebloen", false)
		},

		onShow() {
			let that = this
			uni.openBluetoothAdapter({
				success: res => {
					console.log("初始化低功耗蓝牙成功")
					that.resetState();
					that.$refs.popupblequanixan.close()
				},
				fail: function(err) {
					console.log('蓝牙模块初始化失败', uni.getStorageSync("openBluebloen"));
					// 处理蓝牙模块初始化失败的情况，例如提示用户打开蓝牙
					that.img_scan = false
					uni.hideLoading()
					if (err.errCode === 10001 && uni.getStorageSync("openBluebloen") === false) {
						that.$refs.popupblequanixan.open("center")
					}
				}
			});

		},

		mounted() {
			// 手动监听弹窗关闭
			this.$refs.qiehuanpopup.$on('change', (e) => {
				if (e.show === false) {
					this.onClosePopup();
				}
			});
		},

		methods: {
			...mapMutations(['setlanyaId', 'setacktypes']),


			blequanxian() {
				this.openBLE()
				this.$refs.popupblequanixan.close()
			},

			ButtonTap() {
				this.img_scan = false
				this.$refs.qiehuanpopup.open("center")
			},
			resetState() {
				this.img_scan = true;
				this.scan_img = "../../../static/image-active.png";
				this.xinghao = '';
				this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
				this.context_msg1 = "";
				this.modelId = '';
			},

			onClosePopup() {
				this.resetState()
			},

			formatMacAddress(mac) {
				// 移除可能存在的分隔符
				mac = mac.replace(/[^a-fA-F0-9]/g, '');
				// 每2个字符添加冒号
				return mac.match(/.{1,2}/g).join(':').toUpperCase();
			},

			shoudongbtn() {
				if (!this.inputcontext) {
					uni.showToast({
						title: this.$t("输入设备码"),
						icon: "none"
					})
					return
				} else {
					if (this.modelname === "BPW1") {
						// const resultStr = this.inputcontext.replace(/:/g, '');
						const resultStr1 = this.inputcontext.slice(0, 4)
						if (resultStr1 === "4142") {
							this.context_msg = "300000" + this.inputcontext
							this.BPW1deviceId = this.formatMacAddress(this.inputcontext)
							this.get_device_info()
							this.$refs.qiehuanpopup.close()
						} else {
							uni.showToast({
								title: this.$t("选中的设备与扫码设备不匹配"),
								icon: "none"
							})
						}
					} else {
						this.context_msg = this.inputcontext
						this.get_device_info()
						this.$refs.qiehuanpopup.close()
					}
				}
			},

			shoudongbtncancle() {
				this.$refs.qiehuanpopup.close()
				this.resetState()
			},

			getCode(barNumber) {
				if (this.modelname === "BPW1") {
					const regex = /para=([^&]+)/;
					const match = barNumber.match(regex);
					if (match && match[1]) {
						this.BPW1deviceId = match[1]
						const resultStr = match[1].replace(/:/g, '');
						const resultStr1 = resultStr.slice(0, 4)
						if (resultStr1 === "4142") {
							this.context_msg = "300000" + resultStr
							// this.jakoblife_fat_scale("300000" + resultStr, match[1])
						} else {
							this.context_msg = match[1]
						}
						this.img_scan = false
						this.get_device_info()
					} else {
						this.context_msg = barNumber
						this.img_scan = false
						this.get_device_info()
						console.log('para 的值未找到', barNumber.slice(6, barNumber.length));
					}
				} else {
					this.context_msg = barNumber
					this.img_scan = false
					this.get_device_info()
				}
			},
			dundatetime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now
					.getMonth() + 1;
				const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
				const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
				const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
				const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
				const timesssaa = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
				return timesssaa
			},
			datatime(dateStr) {
				let date = new Date(dateStr);
				let timestamp = date.getTime();
				let timestampInSeconds = Math.floor(timestamp / 1000);
				return timestampInSeconds
			},
			//上报
			jakoblife_fat_scale(deviceSn, mac) {
				const data = {
					deviceSn: deviceSn,
					mac: mac,
					deviceTypeId: "2",
					slaveData: {},
					time: this.datatime(this.dundatetime())
				}
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					console.log("上报数据手表", res)
					this.context_msg = deviceSn
					this.img_scan = false
					this.get_device_info()
				}).catch(errro => {
					console.log("errro", errro)
				})
			},


			True_Bind() {
				if (this.context_msg === this.$t('请将条码放入扫码框内即可自动扫描')) {
					uni.showToast({
						title: this.$t('请扫描设备的设备码'),
						icon: 'none'
					})
					return
				}
				this.queryDevices()
			},
			unbind() {
				uni.switchTab({
					url: "/pages/tabBar/main/Main"
				})
			},
			//获取设备基础信息
			get_device_info() {
				const data = {
					deviceSn: this.context_msg
				}
				this.$post(this.$url_APP_IP + this.$url_get_device_info, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code == 200) {
						if (res.data.model === this.modelname) {
							if (res.data.model === "BPW1" && res.data.deviceSn) {
								const resultmac = data.deviceSn.slice(6, data.deviceSn.length);
								if (resultmac === res.data.deviceSn.slice(6, res.data.deviceSn.length)) {
									this.img_scan = false;
									this.xinghao = this.$t("型号") + res.data.model;
									this.context_msg = "SN:" + res.data.deviceSn;
									this.context_msg1 = res.data.deviceSn;
									this.modelId = res.data.modelId;
									this.updateScanImagePath(res.data.picturePath);
								} else {
									this.img_scan = true;
									uni.showToast({
										title: this.$t("选中的设备与扫码设备不匹配"),
										icon: "none"
									});
									this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
								}
							} else {
								this.img_scan = false;
								this.xinghao = this.$t("型号") + res.data.model;
								this.context_msg = "SN:" + res.data.deviceSn;
								this.context_msg1 = res.data.deviceSn;
								this.modelId = res.data.modelId;
								this.updateScanImagePath(res.data.picturePath);
							}
						} else {
							this.img_scan = true;
							uni.showToast({
								title: this.$t("选中的设备与扫码设备不匹配"),
								icon: "none"
							});
							this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
						}
					} else {
						this.img_scan = true;
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');

					}
				})
			},
			updateScanImagePath(picturePath) {
				if (picturePath) {
					if (lan === 'zh-Hans' || lan == 'zh-Hant') {
						// this.scan_img = this.$url_APP_IP + picturePath;
						this.scan_img = modelIdToImagePathzh[this.modelId];
					} else {
						this.scan_img = modelIdToImagePath[this.modelId];
					}
				} else {
					this.scan_img = modelIdToImagePath[this.modelId];
				}
			},

			queryDevices() {
				this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code == 200) {
						if (res.rows.length === 0) {
							this.navigateTo(this.modelId);
						} else {
							const deviceExists = res.rows.some(item => item.deviceSn === this.context_msg1);
							if (deviceExists) {
								uni.showToast({
									title: this.$t("当前主页面已绑定该设备"),
									icon: 'none'
								});
								uni.setStorageSync("deviceSn", this.context_msg1);
								uni.switchTab({
									url: '/pages/tabBar/main/Main'
								});
							} else {
								this.navigateTo(this.modelId);
							}
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				})
			},

			navigateTo(modelId) {
				if (this.modelConnectType == 0) {
					this.bind_device(this.context_msg1, "", modelId);
				} else if (this.modelConnectType == 1) {
					if (this.modelname === "BPW1") {
						console.log("手表连接修改")
						this.BPW1model = modelId
						this.stoponble = true
						this.initBluetooth()
					} else {
						uni.navigateTo({
							url: "../../Bind/Bing_xueya/Bing_xueya_LY?SELECT_TYPE=" + this.SELECT_TYPE + "&sn=" +
								this.context_msg1 + "&modelname=" + this.modelname + "&modelId=" + modelId
						})
					}
				} else if (this.modelConnectType == 2) {
					uni.navigateTo({
						url: "../../Bind/Bing_xueya/Bing_xueya?SELECT_TYPE=" + this.SELECT_TYPE + "&sn=" + this
							.context_msg1 + "&modelname=" + this.modelname + "&modelId=" + modelId
					})
				}
			},
			//确认按钮
			turesss() {
				uni.hideLoading()
				let that = this
				that.$refs.popup1.close();
				that.setacktypes("0")
				uni.reLaunch({
					url: "../../Bind/Bing_page/Bind_success?modelId=" + that
						.BPW1model
				})
			},

			getunbind(deviceSn) {
				uni.request({
					url: this.$url_APP_IP + this.$url_getunbind,
					method: 'POST',
					data: {
						deviceSn
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token'),
						'content-type': 'application/x-www-form-urlencoded'
					},
				});
			},

			openBLE() {
				const platform = uni.getSystemInfoSync().platform;
				if (platform === "android") {
					var main = plus.android.runtimeMainActivity();
					var Intent = plus.android.importClass("android.content.Intent");
					var mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
					main.startActivity(mIntent);
				} else if (platform === "ios") {
					plus.runtime.launchApplication({
						action: 'App-Prefs:root=BLE'
					}, function(e) {
						console.log(JSON.stringify(e));
					});
				}
			},
			// 绑定BPW1手表初始化低功耗蓝牙
			initBluetooth() {
				let that = this;
				uni.openBluetoothAdapter({
					success: res => {
						console.log("初始化低功耗蓝牙成功")
						that.connectBluetooth()
					},
					fail: function(err) {
						this.stoponble = false
						console.log('蓝牙模块初始化失败', err);
						uni.hideLoading()
						// 处理蓝牙模块初始化失败的情况，例如提示用户打开蓝牙
						if (err.errCode === 10001) {
							uni.showModal({
								content: that.$t("当前蓝牙未开启是否去设置打开"),
								showCancel: false,
								success: modalres => {
									if (modalres.confirm) {
										that.openBLE()
									}
								}
							});
						}
					}
				});
			},
			//搜索手表蓝牙转换mac
			connectBluetooth() {
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: true,
					success: (startBluetoothDevicesDiscovery) => {
						console.log("开始搜索低功耗蓝牙手表")
						this.onBluetoothDeviceFound();
					}
				});
			},
			onBluetoothDeviceFound() {
				let BPW1timeer = null
				let BPW1time = 0
				uni.showLoading({
					title: this.$t("搜索中"),
					mask: true
				})
				uni.onBluetoothDeviceFound((res) => {
					const deviceArray = res.devices;
					for (const item of deviceArray) {
						if (item.name === "BPW1") {
							if (this.Adverti(item.advertisData) === this.BPW1deviceId) {
								this.stoponble = false
								uni.hideLoading()
								uni.stopBluetoothDevicesDiscovery();
								this.BPW1UUID = item.deviceId
								this.BPW1binddevice(this.context_msg1, item.deviceId, this.BPW1model);
							}
						}
					}
				});
				BPW1timeer = setInterval(() => {
					BPW1time++
					if (!this.stoponble) {
						uni.stopBluetoothDevicesDiscovery()
						clearInterval(BPW1timeer)
						BPW1timeer = null
					} else {
						console.log("2搜索到的低功耗蓝牙", BPW1time)
						if (BPW1time === 15) {
							uni.hideLoading()
							uni.stopBluetoothDevicesDiscovery()
							clearInterval(BPW1timeer)
							BPW1timeer = null
							uni.showModal({
								title: this.$t("提示"),
								content: this.$t("未检测到附近蓝牙手表设备"),
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										this.stoponble = false
									}
								}
							});
						}
					}
				}, 1000)
			},

			// ArrayBuffer转16进度字符串示例
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},

			//获取蓝牙广播解析mac
			Adverti(advertisData) {
				if (advertisData === "" || advertisData === undefined) {
					return '无数据'
				} else {
					const str = this.ab2hex(advertisData).slice(4, this.ab2hex(advertisData).length - 4)
					const formattedStr = str.replace(/(.{2})(?=.)/g, '$1:').toUpperCase().slice(0, 20)
					return formattedStr;
				}
			},
			// BPW1手表设备绑定
			BPW1binddevice(sn, MACdeviceID, modelId) {
				let data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				};
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					console.log(res)
					if (res.code === 200) {
						uni.setStorageSync("appQX", "1")
						uni.setStorageSync("deviceSn", sn);
						uni.showLoading({
							title: this.$t("连接中"),
							mask: true
						})
						this.createBLEConnection(MACdeviceID, sn)
						this.setacktypes("0")
					} else if (res.code === 401) {
						uni.showToast({
							title: this.$t("此设备已被其他账号绑定"),
							icon: 'none'
						})
						return
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail"
						});
					}
				}).catch(erro => {
					console.error(erro)
					uni.reLaunch({
						url: "../Bing_page/Bind_fail"
					});
				})
			},
			createBLEConnection(deviceId, sn) {
				let that = this;
				uni.createBLEConnection({
					deviceId: deviceId,
					timeout: 8000,
					success(res) {
						console.log("BLE连接成功：", JSON.stringify(res));
						uni.hideLoading()
						that.$refs.popup1.open("center");
					},
					fail(erro) {
						console.log("BLE连接失败：", JSON.stringify(erro));
						if (erro.errCode === 10002) {
							that.getunbind(sn)
							uni.closeBLEConnection({
								deviceId: deviceId
							})
							uni.hideLoading()
							return
						} else {
							setTimeout(() => {
								uni.createBLEConnection({
									deviceId: deviceId,
									timeout: 4000,
									success(createBLEConnectionres) {
										console.log(createBLEConnectionres)
										uni.hideLoading()
										that.$refs.popup1.open("center");
									},
									fail(createBLEConnectionerro) {
										that.getunbind(sn)
										that.disconnectAll(deviceId);
										uni.closeBLEConnection({
											deviceId: deviceId
										})
										uni.hideLoading()
									}
								});
							}, 1000)
						}
					}
				});
			},

			bind_device(sn, MACdeviceID, modelId) {
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				}
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(bind_device => {
					if (bind_device.code == 200) {
						uni.setStorageSync("deviceSn", sn);
						uni.navigateTo({
							url: `../Bing_page/Bind_success?modelId=${modelId}`
						});
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail?bindcode=" + bind_device.code
						});
					}
				})
			},
		}
	};
</script>

<style scoped lang="scss">
	.backpage {
		color: black;
		background: #F7F7F7;
		height: 100vh;
		width: 100vw;
	}

	.img_scansty {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300px;
		z-index: 500;
		/* 确保低于弹窗的 z-index */
	}

	.img_scansty_1 {
		padding: 20px 20px 0 20px;
	}

	.imgss {
		padding-top: 10px;
		padding-bottom: 30px;
		width: 90vw;
		height: 260px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		background: white;
	}

	.imgss1 {
		padding-top: 20px;
		width: 80vw;
		display: flex;
		justify-content: center;
		align-items: center;
		object-fit: contain;
	}

	.imgss_sc {
		padding-top: 20px;
		width: 120px;
		height: 120px;
		display: flex;
		justify-content: center;
		align-items: center;
		object-fit: contain;
	}

	.Model_number {
		text-align: center;
		margin: 20px 0;
		font-size: 16px;
		font-weight: bold;
	}

	.Message {
		height: 22px;
		margin-top: 60px;
		text-align: center;
		font-size: 16px;
		font-weight: 400;
		color: red;
	}

	.Message1 {
		height: 22px;
		text-align: center;
		font-size: 16px;
		font-weight: 400;
		color: black;
	}

	.Messageback {
		position: fixed;
		bottom: 0;
		width: 100vw;
		background: #F7F7F7;
	}

	.button_style {
		width: auto;
		height: 48px;
		margin-left: 20px;
		margin-right: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		border-radius: 30px;
		background: #3298F7;
		color: white;
	}

	.button_style1 {
		width: auto;
		height: 48px;
		margin: 20px 20px 0 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		border-radius: 30px;
		color: #FFFFFF;
		background: #3298F7;
	}

	/* 弹窗内容样式 */
	.popup-content {
		width: 80vw;
		background: #fff;
		border-radius: 20px;
		padding: 20px;
		box-sizing: border-box;
	}

	/* 弹窗内容样式 */
	.popup-content111 {
		background: #fff;
		border-radius: 20px;
		padding: 20px;
		margin: 20px 20px 80px 20px;
		text-align: center;
		box-sizing: border-box;
	}




	// BPW1绑定弹窗样式
	.popupstusdsd_2 {
		border-radius: 20px;
		background: #fff;
		text-align: center;
		padding: 20px;
		margin: 60px 20px 60px 20px;
		z-index: 999999;
	}

	.popupstusdsditem {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 20px;
	}

	.popupstusdsditem_1 {
		font-size: 18px;
		font-weight: bold;
	}

	.butonstsd {
		margin: 10px 50px 20px 50px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}
</style>