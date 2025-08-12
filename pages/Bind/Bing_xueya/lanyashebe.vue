<template>
	<view class="tablebody">
		<view class="tablebody_1">
			<view class="pagestylkes_1">{{$t("如果出现超时")}}</view>
			<view class="pagestylkes_3">{{$t("已连接过的设备")}}</view>
			<view class="tableitem" v-for="(item, index) in bluetoothList1" :key="index" @click="selectBluetooth(item)">
				<view class="listback">
					<view class="listbackitem">
						<image :src="getDeviceImage(item.name)" class="imagestyii" mode="aspectFit" />
						<view class="liststylesd">
							<view class="ellipsis-container">name:{{item.name}}</view>
							<view style="text-align: left">deviceId:{{item.deviceId}}</view>
						</view>
						<image :src="getRSSIIcon(item.RSSI)" class="imagestyii_1" mode="aspectFit" />
					</view>
				</view>
			</view>
		</view>
		<view style="padding-bottom: 50px;">
			<view class="pagestylkes_2">
				<view>{{$t("未连接过的设备")}}</view>
				<switch :disabled="false" :checked="checked" @change="switch1Change" style="transform: scale(0.7)" />
			</view>
			<view class="tableitem" v-for="(item, index) in bluetoothList" :key="index" @click="selectBluetooth1(item)">
				<view class="listback">
					<view class="listbackitem">
						<image :src="getDeviceImage(item.name)" class="imagestyii" mode="aspectFit" />
						<view class="liststylesd">
							<view class="ellipsis-container">name:{{item.name}}</view>
							<view style="text-align: left">deviceId:{{item.deviceId}}</view>
							<view style="text-align: left" v-if="Adverti(item.advertisData) === '无数据'">mac:NA</view>
							<view v-else style="text-align: left">mac:{{Adverti(item.advertisData)}}</view>
						</view>
						<image :src="getRSSIIcon(item.RSSI)" class="imagestyii_1" mode="aspectFit" />
					</view>
				</view>
			</view>
		</view>
		<view class="titlesdsdsa">
			<view class="titlestyle">
				<uni-icons style="margin-top: 30px;" @click="back()" type="left" size="24" color="black"></uni-icons>
				<view class="lanysty">{{$t('蓝牙搜索页面')}}</view>
				<view @click="batch_del()" class="shauxins">{{$t('刷新')}}</view>
			</view>
		</view>
		<view>
			<uni-popup ref="popup" :mask-click="false">
				<view class="popupstusdsd">
					<view style="padding: 30px 0 40px 0">
						<view class="popupstusdsditem">{{$t("正在配对")}}</view>
						<yi-loading center></yi-loading>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view class="popupstusdsd_2">
					<view style="padding: 10px 0 40px 0">
						<view class="popupstusdsditem">{{$t("配对成功")}}</view>
						<view class="popupstusdsditem_1">{{$t("蓝牙已连接成功")}}</view>
						<!-- <view v-show="deviceNamexueya === true">{{$t("标准蓝牙提示1")}}</view> -->
						<view v-show="deviceNameshoubiao === true">{{$t("标准蓝牙提示")}}</view>
					</view>
					<button @tap="turesss()" class="butonstsd">{{$t("确定")}}</button>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="popup_fail" :mask-click="false">
				<view class="popupstusdsd_2">
					<view style="padding: 10px 0 40px 0">
						<view class="popupstusdsditem">{{$t("连接超时")}}</view>
						<view class="popupstusdsditem_1">{{$t("连接失败")}}</view>
					</view>
					<button @tap="turesss_faile()" class="butonstsd">{{$t("确定")}}</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>
<script>
	import {
		mapMutations
	} from 'vuex'
	const platform = uni.getSystemInfoSync().platform;
	import BluetoothManager from '../../api/BluetoothManager.js';
	export default {
		onLoad(opt) {
			this.sn = opt.sn
			this.modelId = opt.modelId
			this.SELECT_TYPE = opt.SELECT_TYPE === "0" ? "1" : "0"
		},
		onShow() {
			uni.getStorageInfo({
				success: (res) => {
					if (res.keys.includes("listdadsa")) {
						this.bluetoothList1 = uni.getStorageSync("listdadsa").filter((item, index, self) => {
							return self.findIndex(t => t.name === item.name) === index;
						});
					} else {
						this.bluetoothList1 = [];
					}
				}
			});
			this.clearHeartbeatInterval();
			uni.closeBluetoothAdapter()
			uni.openBluetoothAdapter()
		},
		data() {
			return {
				checked: false,
				show: false,
				msg: '',
				pendingShow: false,
				successShow: false,
				timer: null,
				bluetoothList: [],
				bluetoothList1: [],
				idList: [],
				rssiTimer: '',
				serviceId: '',
				uuid: '',
				notifyUuid: '',
				sn: '',
				heartbeatInterval: null,
				heartbeatTimeout: 1000,
				isSumZero: false,
				MACdeviceID: '',
				arrrylist: [],
				modelId: '',
				tempBuffer: 0,
				quotient: 0,
				quotient1: 0,
				dataBuffer: [],
				Protocolsubcommand: '',
				writeuuid: '',
				deviceNameshoubiao: false,
				deviceNamexueya: false,
				bluetoothManager: new BluetoothManager(),
			};
		},

		methods: {
			...mapMutations(['setlanyaId', 'setacktypes']),
			//返回按钮
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			async disconnectAll(mac) {
				this.bluetoothManager = new BluetoothManager();
				this.bluetoothManager.disconnectDevice(mac);
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
			//获取蓝牙设备设置图标
			getDeviceImage(deviceName) {
				if (deviceName === 'BPW1') return '/static/page_icon/shoubiao.png';
				if (deviceName === 'EL2') return '/static/page_icon/lanya.png';
				return '/static/page_icon/lanya.png';
			},
			//获取蓝牙设备设置信号图标
			getRSSIIcon(RSSI) {
				if (RSSI <= -80) return '../../../static/page_icon/lanya_iocn_1.png';
				if (RSSI < -60 && RSSI > -80) return '../../../static/page_icon/lanya_iocn_2.png';
				return '../../../static/page_icon/lanya_iocn_3.png';
			},
			//确认按钮
			turesss() {
				uni.reLaunch({
					url: "../../Bind/Bing_page/Bind_success?modelId=" + this.modelId
				})
			},

			clearHeartbeatInterval() {
				if (Vue.prototype.$globalTimers.heartbeatInterval) {
					clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
					Vue.prototype.$globalTimers.heartbeatInterval = null;
				}
			},
			batch_del() {
				uni.showLoading({
					title: this.$t('刷新中'),
					mask: true,
				});
				// 清空列表
				this.bluetoothList = [];
				// 关闭弹窗
				this.$refs.popup1.close();
				this.$refs.popup.close();
				// 关闭蓝牙适配器
				uni.closeBluetoothAdapter({
					success: () => {
						// 如果开关是打开的，重新初始化蓝牙
						if (this.checked) {
							this.initBluetooth();
						}
						uni.hideLoading();
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: this.$t('刷新失败'),
							icon: 'none'
						});
					}
				});
			},
			//蓝牙搜索开关
			switch1Change(e) {
				if (e.target.value) {
					this.checked = true;
					this.initBluetooth();
				} else {
					this.checked = false;
					this.bluetoothList = [];
				}
			},
			//已经连接过的蓝牙点击蓝牙
			selectBluetooth(item) {
				if (this.SELECT_TYPE === "0") {
					this.handleIOSBluetoothConnection(item, true);
				} else if (this.SELECT_TYPE === "1") {
					this.handleBLEConnection(item.deviceId, item);
				}
			},
			/*选中蓝牙*/
			selectBluetooth1(item) {
				if (this.SELECT_TYPE === "0") {
					this.handleIOSBluetoothConnection(item, false);
				} else if (this.SELECT_TYPE === "1") {
					this.handleBLEConnection(item.deviceId, item);
				}
			},
			handleAndroidBluetoothConnection(item, isConnected) {
				this.$refs.popup.open("bottom");
				const TestUniPlugin = uni.requireNativePlugin("DCTestUniPlugin-TestModule");
				let codetime = 10;
				let timer = setInterval(() => {
					codetime--;
					if (codetime < 1) {
						uni.showToast({
							title: this.$t("连接超时"),
							icon: "none"
						});
						this.$refs.popup.close();
						clearInterval(timer);
					} else {
						TestUniPlugin.startScan("", (callback) => {
							if (isConnected ? item.deviceId === callback.data.mac : item.name === "EL2") {
								this.MACdeviceID = callback.data.mac;
								clearInterval(timer);
								this.$nextTick(() => {
									if (this.$refs.popup && this.$refs.popup.close) {
										this.$refs.popup.close();
										this.$refs.popup1.open("bottom");
									}
								});
								this.updateBluetoothList(item);
								if (callback.data.weightStatus === 1) {
									this.handleWeightData(callback.data);
								}
							}
						});
						this.bind_devicetz(this.sn, this.MACdeviceID)
					}
				}, 1000);
			},
			handleIOSBluetoothConnection(item, isConnected) {
				this.$refs.popup.open("bottom");
				const TestUniPlugin = uni.requireNativePlugin("DCTestUniPlugin-TestModule");
				let codetime = 10;
				let timer = setInterval(() => {
					codetime--;
					if (codetime < 1) {
						uni.showToast({
							title: this.$t("连接超时"),
							icon: "none"
						});
						this.$refs.popup.close();
						clearInterval(timer);
					} else {
						TestUniPlugin.startScan("options", (callback) => {
							if (isConnected ? item.deviceId === callback.data.mac : item.name === "EL2") {
								this.$nextTick(() => {
									if (this.$refs.popup && this.$refs.popup.close) {
										this.$refs.popup.close();
										this.$refs.popup1.open("bottom");
									}
								})
								const parsedData = JSON.parse(callback.data);
								this.MACdeviceID = parsedData.mac;
								clearInterval(timer);
								this.updateBluetoothList(item);
								if (parsedData.testStatus === 255) {
									this.handleIOSWeightData(parsedData);
								}
							}
						});
						this.bind_devicetz(this.sn, this.MACdeviceID)
					}
				}, 1000);
			},
			updateBluetoothList(item) {
				this.bluetoothList1.push(item);
				this.bluetoothList1 = this.bluetoothList1.filter((item, index, self) => {
					return self.findIndex(t => t.name === item.name) === index;
				});
				uni.setStorageSync("listdadsa", this.bluetoothList1);
			},
			handleWeightData(data) {
				if (data.weightUnit === 0) {
					uni.setStorageSync("newweight", "KG");
				} else {
					uni.setStorageSync("newweight", "lb");
				}
				if (data.weight !== "0.00") {
					this.jakoblife_fat_scale1(this.MACdeviceID, data, "");
				}
			},
			handleIOSWeightData(data) {
				this.arrrylist.push(data);
				if (data.weightUnit === 0) {
					uni.setStorageSync("newweight", "KG");
				} else {
					uni.setStorageSync("newweight", "lb");
				}
				if (data.weight !== "0.00") {
					this.jakoblife_fat_scale1(this.MACdeviceID, data, this.arrrylist.length);
				}
			},
			handleBLEConnection(deviceId, item) {
				uni.openBluetoothAdapter({
					success: (res) => {
						this.bind_device(this.sn, deviceId, this.modelId, item);
					},
					fail: (err) => {
						if (err.errCode === 10001) {
							uni.showModal({
								content: this.$t("当前蓝牙未开启是否去设置打开"),
								showCancel: false,
								success: (modalres) => {
									if (modalres.confirm) {
										this.openBLE();
									}
								}
							});
						}
					}
				});
			},
			openBLE() {
				this.checked = false
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

			/*蓝牙初始化*/
			initBluetooth() {
				let that = this;
				uni.openBluetoothAdapter({
					success: res => {
						that.connectBluetooth()
					},
					fail: function(err) {
						console.log('蓝牙模块初始化失败', err);
						// 处理蓝牙模块初始化失败的情况，例如提示用户打开蓝牙
						if (err.errCode === 10001) {
							uni.showModal({
								content: that.$t("当前蓝牙未开启是否去设置打开"),
								showCancel: true,
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
			turesss_faile() {
				this.$refs.popup_fail.close()
			},
			createBLEConnection(deviceId, item) {
				let that = this;
				that.$refs.popup.open("bottom");
				uni.createBLEConnection({
					deviceId: deviceId,
					timeout: 5000,
					success(res) {
						console.log(res)
						that.$refs.popup.close();
						that.$refs.popup1.open("bottom");
						that.MACdeviceID = deviceId;
						that.updateBluetoothList(item);
						setTimeout(() => {
							that.getBLEDeviceServices(deviceId);
						}, 2000);
						const plugin = uni.requireNativePlugin("CBConnectPlugin-CBCModule");
						plugin.connectPeripheral({
							identifier: deviceId
						}, (result, keepAlive) => {});
					},
					fail(erro) {
						console.log("BLE连接失败：", JSON.stringify(erro));
						if (erro.errCode === 10002) {
							that.$nextTick(() => {
								if (that.$refs.popup && that.$refs.popup.close) {
									that.$refs.popup.close();
									that.$refs.popup_fail.open("bottom")
								}
							});
							that.getunbind(that.sn)
							uni.closeBLEConnection({
								deviceId: deviceId
							})
							// uni.closeBluetoothAdapter()
							// uni.openBluetoothAdapter()
							return
						} else {
							setTimeout(() => {
								uni.createBLEConnection({
									deviceId: deviceId,
									timeout: 4000,
									success(res) {
										console.log(res)
										that.$refs.popup.close();
										that.$refs.popup1.open("bottom");
										that.MACdeviceID = deviceId;
										that.updateBluetoothList(item);
										setTimeout(() => {
											that.getBLEDeviceServices(deviceId);
										}, 2000);
										const plugin = uni.requireNativePlugin(
											"CBConnectPlugin-CBCModule");
										plugin.connectPeripheral({
											identifier: deviceId
										}, (result, keepAlive) => {});
									},
									fail(erro) {
										that.$nextTick(() => {
											if (that.$refs.popup && that.$refs.popup
												.close) {
												that.$refs.popup.close();
												that.$refs.popup_fail.open("bottom")
											}
										});
										that.getunbind(that.sn)
										that.disconnectAll(mac);
										uni.closeBLEConnection({
											deviceId: deviceId
										})
										// uni.closeBluetoothAdapter()
										// uni.openBluetoothAdapter()
									}
								});
							}, 1000)
						}
					}
				});
			},
			getunbind(deviceSn) {
				uni.request({
					url: this.$url_getunbind,
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
			//获取蓝牙外围设备的服务
			getBLEDeviceServices(deviceId) {
				let that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						console.log("获取蓝牙外围设备的服务成功", res)
						if (res.services.length == 3) {
							that.getBLEDeviceCharacteristics3(deviceId, res.services[1].uuid)
						} else if (res.services.length == 4) {
							that.getBLEDeviceCharacteristics2(deviceId, res.services[3].uuid)
						} else if (res.services.length == 2) {
							that.getBLEDeviceCharacteristics2(deviceId, res.services[1].uuid)
						} else if (res.services.length == 1) {
							uni.setBLEMTU({
								deviceId: deviceId,
								mtu: 512,
							})
							that.getBLEDeviceCharacteristics1(deviceId, res.services[0].uuid)
						}
					},
					fail(foorres) {
						console.log("获取蓝牙外围设备的服务失败", foorres)
					}
				})
			},

			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics1(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						clearInterval(that.timesdsdf)
						console.log('获取蓝牙设备某个服务中所有特征值(characteristic)1', res.characteristics)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							//蓝牙消息通知
							if (item.properties.notify) {
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										that.setlanyaId("0")
										// that.onBLECharacteristicValueChange(deviceId,
										// 	serviceId);
									},
									fail: (notifyerr) => {},
								})
							}
						}
					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics2(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						console.log('获取蓝牙设备某个服务中所有特征值(characteristic)2', res.characteristics)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.notify) {
								uni.setStorageSync("landeviceId", deviceId)
								uni.setStorageSync("lanserviceId", serviceId)
								uni.setStorageSync("landcharacteristicId", item.uuid)
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {},
									fail: (notifyerr) => {}
								})
							}
							if (item.properties.write) {
								// 启动心跳机制
								that.heartbeatInterval = setInterval(() => {
									// 当前时间
									const now = new Date();
									const year = now.getFullYear().toString();
									const month = now.getMonth() + 1; // 月份从0开始
									const day = now.getDate();
									const hour = now.getHours();
									const minute = now.getMinutes();
									const second = now.getSeconds();
									that.sendLargeData(deviceId, serviceId, item.uuid,
										year, month,
										day, hour, minute, second);
								}, that.heartbeatTimeout);
							}
						}
					},
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败222', res)
					}
				})
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics3(deviceId, serviceId) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						console.log('获取蓝牙设备某个服务中所有特征值(characteristic)3', res.characteristics)
						let platformres = uni.getSystemInfoSync();
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								const buffer = that.toArrayBuffer("e00006e8000000000101");
								uni.writeBLECharacteristicValue({
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									writeType: 'write',
									value: buffer,
									complete(complete) {
										console.log("complete", complete)
										that.writeuuid = item.uuid
										const plugin = uni.requireNativePlugin(
											"CBConnectPlugin-CBCModule");
										plugin.connectPeripheral({
											identifier: deviceId
										}, (result, keepAlive) => {
											console.log(
												'Result from connectPeripheral:',
												result);
										});
									}
								});
								that.setacktypes("0")
							}
							if (platformres.platform === "android") {
								setTimeout(() => {
									if (item.properties.notify) {
										uni.setStorageSync("landeviceId", deviceId)
										uni.setStorageSync("lanserviceId", serviceId)
										uni.setStorageSync("landcharacteristicId", item
											.uuid)
										that.notifyUuid = res.characteristics[i].uuid
										uni.notifyBLECharacteristicValueChange({
											state: true, // 启用 notify 功能
											deviceId: deviceId,
											serviceId: serviceId,
											characteristicId: item.uuid,
											success: (notifyres) => {
												that.onBLECharacteristicValueChange3(
													deviceId,
													serviceId);

											},
											fail: (notifyerr) => {}
										})
									}
								}, 500)
							} else {
								if (item.properties.notify) {
									uni.setStorageSync("landeviceId", deviceId)
									uni.setStorageSync("lanserviceId", serviceId)
									uni.setStorageSync("landcharacteristicId", item.uuid)
									that.notifyUuid = res.characteristics[i].uuid
									uni.notifyBLECharacteristicValueChange({
										state: true, // 启用 notify 功能
										deviceId: deviceId,
										serviceId: serviceId,
										characteristicId: item.uuid,
										success: (notifyres) => {
											that.onBLECharacteristicValueChange3(
												deviceId,
												serviceId);
										},
										fail: (notifyerr) => {}
									})
								}
							}
						}
					},
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败222', res)
					}
				})
			},

			// 16进制转2进制
			hexToBinary(hexString) {
				let binaryString = '';
				for (let i = 0; i < hexString.length; i++) {
					// 将每个16进制字符转换为4位二进制
					const binaryChar = parseInt(hexString[i], 16).toString(2).padStart(4, '0');
					binaryString += binaryChar;
				}
				return binaryString;
			},

			// 定义一个函数来计算校验和
			calculateChecksumsss(hexString, deviceId, serviceId, writeuuid) {
				// 将十六进制字符串转换为字节数组
				const bytes = [];
				for (let i = 0; i < hexString.length; i += 2) {
					bytes.push(parseInt(hexString.substring(i, i + 2), 16));
				}
				// 协议格式解析
				const protocolMarker = bytes[0]; // 协议标识位
				const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
				const protocolChecksum = bytes[3]; // 协议校准位
				const protocolCommand = bytes[4]; // 协议命令
				const protocolVersion = bytes[5]; // 协议版本号
				const protocolSubcommand = bytes[6]; // 协议子命令
				const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
				const commandValue = bytes.slice(9); // 命令指令值
				// 计算字节和（除去协议校准位）
				let sumBytes = 0;
				for (let i = 0; i < bytes.length; i++) {
					if (i !== 3) { // 跳过校准位
						sumBytes += bytes[i];
					}
				}
				const calculatedChecksum = sumBytes % 256; // 取低8位
				const ACK_HEADER = 0xe0 // 常量-头部
				const bindcommandId = 0x08 // CMD-协议命令
				const bindcommandKey = 0x00 // key-协议子命令
				const BleDeviceConfig = {
					PROTOCOL_VERSION: `0x${protocolVersion.toString(16).padStart(2, '0')}` // 协议版本号
				};
				// 绑定设备
				// 创建一个8字节长度的绑定码
				const bindbtys = new Uint8Array(8);
				//以sn为例设置绑定码：30 00 00 20 00 00 00 11
				// 按照 Java 代码中的逻辑进行位运算
				bindbtys[0] = 0x30;
				bindbtys[1] = 0x00;
				bindbtys[2] = 0x00;
				bindbtys[3] = 0x20;
				bindbtys[4] = 0x00;
				bindbtys[5] = 0x00;
				bindbtys[6] = 0x00;
				bindbtys[7] = 0x11;

				const binddataLen = bindbtys.length;
				// console.log("自定义8字节长度的设备码：", binddataLen)
				// 创建一个 dataLen + 8 字节的数组
				const bindcommand = new Uint8Array(binddataLen + 8);
				// 按照 Java 代码中的逻辑填充数组
				bindcommand[0] = ACK_HEADER;
				bindcommand[1] = ((5 + binddataLen) >> 8) & 0xFF;
				bindcommand[2] = (5 + binddataLen) & 0xFF;
				bindcommand[3] = bindcommandId;
				bindcommand[4] = BleDeviceConfig.PROTOCOL_VERSION;
				bindcommand[5] = bindcommandKey;
				bindcommand[6] = (binddataLen >> 8) & 0xFF;
				bindcommand[7] = binddataLen & 0xFF;
				bindcommand.set(bindbtys, 8);

				const hexCommand1 = Array.from(bindcommand).map(byte => byte.toString(16).padStart(2, '0'))
					.join(
						'');
				// 将字符串转换为字节数组
				const bytesnew = new Uint8Array(hexCommand1.match(/../g).map(byte => parseInt(byte, 16)));
				// 将每个字节转换为 0x00 格式的字符串
				const formattedBytes = Array.from(bytesnew).map(byte =>
					`0x${byte.toString(16).padStart(2, '0')}`);
				// 将十六进制字符串转换为十进制数值
				const bytes333 = formattedBytes.map(byte => parseInt(byte, 16));
				// 计算累加和
				let sum = 0;
				for (let i = 0; i < bytes333.length; i++) {
					sum += bytes333[i];
				}
				// 取模 256，得到低 8 位的和
				sum = sum % 256;
				const modifiedCommand = new Uint8Array(bindcommand.length + 1); // 第四个字节的插入，数组长度加1
				modifiedCommand.set(bindcommand.subarray(0, 3), 0);
				modifiedCommand[3] = sum;
				modifiedCommand.set(bindcommand.subarray(3), 4);
				// 将整个命令数组转换为16进制字符串
				const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(16).padStart(2,
						'0'))
					.join(
						'');
				console.log("绑定设备", hexCommand)
				const bindbuffer = this.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: this.writeuuid,
					value: bindbuffer,
					success(res) {
						console.log("0绑定设备：", res)
					},
					fail(err) {
						console.log("1绑定设备：", err)
					}
				})

				const commandId = 0x02 // CMD-协议命令
				const commandKey = 0x08 // key-协议子命令
				// 获取当前时间
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth() + 1; // getMonth() 返回的是 0-11，需要加 1
				const day = now.getDate();
				const hour = now.getHours();
				const minutes = now.getMinutes();
				const seconds = now.getSeconds();

				// 创建一个 4 字节的数组
				const bytes1 = new Uint8Array(4);

				// 按照 Java 代码中的逻辑进行位运算
				bytes1[0] = (((year - 2000) << 2) + ((month & 0xFF) >> 2)) & 0xFF;
				bytes1[1] = (((month & 0x03) << 6) + (day << 1) + (hour >> 4)) & 0xFF;
				bytes1[2] = (((hour & 0x0F) << 4) + (minutes >> 2)) & 0xFF;
				bytes1[3] = (((minutes & 0x03) << 6) + seconds) & 0xFF;
				const dataLen = bytes1.length;
				// 创建一个 dataLen + 8 字节的数组
				const command = new Uint8Array(dataLen + 8);
				// 按照 Java 代码中的逻辑填充数组
				command[0] = ACK_HEADER;
				command[1] = ((5 + dataLen) >> 8) & 0xFF;
				command[2] = (5 + dataLen) & 0xFF;
				command[3] = commandId;
				command[4] = BleDeviceConfig.PROTOCOL_VERSION;
				command[5] = commandKey;
				command[6] = (dataLen >> 8) & 0xFF;
				command[7] = dataLen & 0xFF;
				command.set(bytes1, 8);
				const hexCommand2 = Array.from(command).map(byte => byte.toString(16).padStart(2, '0'))
					.join(
						'');
				// console.log("原始hexCommand1:", hexCommand1);
				// 将字符串转换为字节数组
				const bytesnew2 = new Uint8Array(hexCommand2.match(/../g).map(byte => parseInt(byte, 16)));
				// 将每个字节转换为 0x00 格式的字符串
				const formattedBytes2 = Array.from(bytesnew2).map(byte =>
					`0x${byte.toString(16).padStart(2, '0')}`);

				console.log(formattedBytes2);
				// 将十六进制字符串转换为十进制数值
				const bytes3332 = formattedBytes2.map(byte => parseInt(byte, 16));
				// 计算累加和
				let sum2 = 0;
				for (let i = 0; i < bytes3332.length; i++) {
					sum2 += bytes3332[i];
				}
				// 取模 256，得到低 8 位的和
				sum2 = sum2 % 256;
				const modifiedCommand2 = new Uint8Array(command.length + 1); // 第四个字节的插入，数组长度加1
				modifiedCommand2.set(command.subarray(0, 3), 0);
				modifiedCommand2[3] = sum2;
				modifiedCommand2.set(command.subarray(3), 4);
				// console.log("原始command:", command);
				// console.log("修改后的command:", modifiedCommand);
				// 将整个命令数组转换为16进制字符串
				const hexCommand22 = Array.from(modifiedCommand2).map(byte => byte.toString(16).padStart(2,
					'0')).join(
					'');
				const buffer = this.toArrayBuffer(hexCommand22); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: this.writeuuid,
					value: buffer,
					success(res) {
						console.log("时间命令数据回复成功：", res)
					},
					fail(err) {
						console.log("时间命令数据回复失败：", err)
					}
				})
			},

			onBLECharacteristicValueChange3(deviceId, serviceId) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					const dataList = that.ab2hex(res.value) //将蓝牙发送过来的数据转16进制
					console.log("dataList", dataList)
					that.dataBuffer.push(dataList) //组合16进制数据包
					//第一次绑定发送写入绑定命令返回的数据
					if (that.dataBuffer.length === 2 && that.dataBuffer[1].slice(0, 2) === "0e") {
						const hexString = that.dataBuffer[0]
						// 将十六进制字符串转换为字节数组
						const bytes = [];
						for (let i = 0; i < hexString.length; i += 2) {
							bytes.push(parseInt(hexString.substring(i, i + 2), 16));
						}
						// 协议格式解析
						const protocolMarker = bytes[0]; // 协议标识位
						const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
						const protocolChecksum = bytes[3]; // 协议校准位
						const protocolCommand = bytes[4]; // 协议命令
						const protocolVersion = bytes[5]; // 协议版本号
						const protocolSubcommand = bytes[6]; // 协议子命令
						const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
						const commandValue = bytes.slice(9); // 命令指令值
						// 计算字节和（除去协议校准位）
						let sumBytes = 0;
						for (let i = 0; i < bytes.length; i++) {
							if (i !== 3) { // 跳过校准位
								sumBytes += bytes[i];
							}
						}
						const calculatedChecksum = sumBytes % 256; // 取低8位	
						if (calculatedChecksum === protocolChecksum) {
							// 假设以下变量已经定义
							const ACK_RESPONSE_HEADER = 0x0E; // 示例值
							const commandId =
								`0x${protocolCommand.toString(16).padStart(2, '0')}`; // 示例值
							const commandKey =
								`0x${protocolSubcommand.toString(16).padStart(2, '0')}`; // 示例值
							const BleDeviceConfig = {
								PROTOCOL_VERSION: `0x${protocolVersion.toString(16).padStart(2, '0')}` // 示例协议版本
							};
							const code = 0x00; // 示例 code 值
							const ackConfigByte = new Uint8Array(9);
							ackConfigByte[0] = ACK_RESPONSE_HEADER;
							ackConfigByte[1] = 0x00;
							ackConfigByte[2] = 0x06;
							ackConfigByte[3] = commandId;
							ackConfigByte[4] = BleDeviceConfig.PROTOCOL_VERSION;
							ackConfigByte[5] = commandKey;
							ackConfigByte[6] = 0x00;
							ackConfigByte[7] = 0x01;
							ackConfigByte[8] = code;
							let ackConfigBytesum = 0;
							for (let i = 0; i < ackConfigByte.length -
								1; i++) { // 遍历 command 数组的前 command.length - 1 个元素
								ackConfigBytesum += ackConfigByte[i]; // 累加每个元素的值
							}
							ackConfigBytesum = ackConfigBytesum % 256; // 取模 256，得到低 8 位的和
							// console.log("ackConfigBytesum:", ackConfigBytesum); // 输出求和结果
							// 创建新的数组，将校验和插入到第四个字节中
							const modifiedCommand = new Uint8Array(ackConfigByte.length +
								1); // 第四个字节的插入，数组长度加1
							modifiedCommand.set(ackConfigByte.subarray(0, 3), 0);
							modifiedCommand[3] = ackConfigBytesum;
							modifiedCommand.set(ackConfigByte.subarray(3), 4);
							const hexCommand = Array.from(modifiedCommand).map(byte => byte
								.toString(16)
								.padStart(2, '0')).join('');
							console.log(hexCommand);
							const buffer = this.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
							uni.writeBLECharacteristicValue({
								deviceId: deviceId,
								serviceId: serviceId,
								characteristicId: that.writeuuid,
								value: buffer,
								success(res) {
									console.log("ack数据回复成功：", res)
								},
								fail(err) {
									console.log("ack数据回复失败：", err)
									that.dataBuffer = []
									that.calculateChecksumsss(hexString, deviceId,
										serviceId, that
										.writeuuid)
								},
							})
						}
					}
				})
			},

			sendLargeData(deviceId, serviceId, uuid, year, month, day, hour, minute, second) {
				let that = this
				const timeSyncData = that.createTimeSyncData(year, month, day, hour, minute,
					second); // 构造时间同步数据
				console.log(timeSyncData)
				const buffer = that.toArrayBuffer(timeSyncData); // 转换为 ArrayBuffer
				console.log(buffer)
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					success: () => {
						console.log("时间同步时间发送成功");
						clearInterval(that.heartbeatInterval)
						// that.heartbeatInterval = setInterval(() => {
						// setTimeout(() => {
						// 	const buffer1 = that.toArrayBuffer("4259010001000118020f"); // 同步血压历史数据命令，转换为 ArrayBuffer
						// 	uni.writeBLECharacteristicValue({
						// 		deviceId: deviceId,
						// 		serviceId: serviceId,
						// 		characteristicId: uuid,
						// 		value: buffer1,
						// 		success: () => {
						// 			console.log("血压历史数据发送成功");
						// 			// clearInterval(that.heartbeatInterval)
						// 		},
						// 		fail: (err) => {
						// 			console.log("血压历史数据发送失败");
						// 		}
						// 	});
						// }, 1000)

						// }, that.heartbeatTimeout);
					},
					fail: (err) => {
						clearInterval(that.heartbeatInterval)
						console.error("时间同步数据发送失败", err);
					}
				});
			},

			calculateChecksum(data) {
				let sum = 0;
				for (let i = 0; i < data.length; i += 2) {
					sum += parseInt(data.substr(i, 2), 16);
				}
				return (sum & 0xFF).toString(16).padStart(2, '0');
			},

			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},

			createTimeSyncData(year, month, day, hour, minute, second) {
				let that = this
				const timeData =
					`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}${second.toString().padStart(2, '0')}`;
				const header = "4259"; // 协议头
				const length = "01"; // 数据长度
				const totalPackets = "0001"; // 总包数
				const currentPacket = "0001"; // 当前分包序号
				const flag = "09"; // 标志
				const rawData = `${header}${length}${totalPackets}${currentPacket}${flag}${timeData}`;
				// const checksum = that.calculateChecksum(rawData); // 计算和校验
				const checksum = "0f"; // 计算和校验
				const finalData = `${rawData}${checksum}`; // 添加和校验
				return finalData;
			},

			onBLECharacteristicValueChange(deviceId, serviceId) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					console.log("监听特征值变化", res)
					let aaa = that.ab2str(res.value)
					console.log(that.ab2hex(res.value))
					let hexString = that.ab2hex(res.value)
					let asciiString = that.hexToAscii(hexString)
					console.log("dsajkhadha", asciiString)
					let parsedData = that.parseQueryString(asciiString);
					console.log(parsedData) // 输出转换后的ASCII字符串
					that.jakoblife_fat_scale(deviceId, parsedData)
				})
			},

			decimalToHex(decimal, length = 2) {
				// 转换为十六进制字符串
				const hex = decimal.toString(16).toUpperCase();
				// 使用 padStart 补齐零，确保固定长度
				return hex.padStart(length, '0');
			},
			hexToDecimal(hex) {
				return parseInt(hex, 16);
			},


			//时间戳转时间
			dundatetime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
				const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
				const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
				const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
				const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
				const timesssaa = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
				return timesssaa
			},

			ab2str(buf) {
				return String.fromCharCode.apply(null, new Uint8Array(buf));
			},

			//上报体脂秤或血压计数据
			jakoblife_fat_scale(deviceId, parsedData) {
				let _this = this
				let aaa = {}
				let timess
				if (_this.SELECT_TYPE === "0") {
					uni.setStorageSync("SELECT_TYPE", "0")
					aaa = parsedData.slaveData
					timess = parsedData.Time
				} else if (_this.SELECT_TYPE === "1") {
					uni.setStorageSync("SELECT_TYPE", "1")
					aaa = {
						lowPressure: parsedData.dia.trim(),
						highPressure: parsedData.sys.trim(),
						heartrate: parsedData.pul.trim(),
					}
					timess = _this.datatime(_this.dundatetime())
					console.log(timess)
				}
				uni.request({
					url: _this.$url_jakoblife_fat_scale,
					method: 'POST',
					data: {
						deviceSn: _this.sn,
						mac: deviceId,
						deviceTypeId: _this.SELECT_TYPE,
						slaveData: aaa,
						time: timess
					},
					header: {
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("上报体脂秤或血压计数据", res)
					},
				})
			},
			jakoblife_fat_scale1(deviceId, parsedData, listleng) {
				let _this = this
				uni.request({
					url: _this.$url_jakoblife_fat_scale,
					method: 'POST',
					data: {
						deviceSn: _this.sn,
						mac: deviceId,
						deviceTypeId: _this.SELECT_TYPE,
						slaveData: {
							weight: parsedData.weight,
							adc: parsedData.adc
						},
						time: parsedData.createTime
					},
					header: {
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("上报体脂秤或血压计数据", res)
						const platform = uni.getSystemInfoSync().platform;
						if (platform === "ios") {
							if (listleng === 150) {
								setTimeout(() => {
									_this.arrrylist = []
								}, 10000)
							}
						}
					},
				})
			},
			//上报体蓝牙血压计手表数据
			jakoblife_fat_scale2(deviceId, shousuoye, shuzhangya, maibo) {
				let _this = this
				let aaa = {}
				let timess
				aaa = {
					lowPressure: shuzhangya,
					highPressure: shousuoye,
					heartrate: maibo,
				}
				timess = _this.datatime(_this.dundatetime())
				console.log(timess)
				uni.request({
					url: _this.$url_jakoblife_fat_scale,
					method: 'POST',
					data: {
						deviceSn: _this.sn,
						mac: deviceId,
						deviceTypeId: _this.SELECT_TYPE,
						slaveData: aaa,
						time: timess
					},
					header: {
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						console.log("上报体脂秤或血压计数据", res)
					},
				})
			},

			datatime(dateStr) {
				// 将日期字符串转换为Date对象
				let date = new Date(dateStr);
				// 获取时间戳（毫秒）
				let timestamp = date.getTime();
				// 如果需要秒级时间戳，可以除以1000
				let timestampInSeconds = Math.floor(timestamp / 1000);
				return timestampInSeconds
			},

			hexToAscii(hexString) {
				let str = '';
				for (let i = 0; i < hexString.length; i += 2) {
					let hex = hexString.substr(i, 2);
					str += String.fromCharCode(parseInt(hex, 16));
				}
				return str;
			},

			parseQueryString(queryString) {
				let params = queryString.split('&');
				let result = {};
				params.forEach(param => {
					let [key, value] = param.split('=');
					result[key] = value;
				});
				return result;
			},
			// 获取请求头
			getRequestHeader() {
				return {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;' // 自定义请求头信息
				};
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
			// 设备绑定
			bind_devicetz(sn, MACdeviceID) {
				const url = this.$url_bind_device;
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				};
				const header = this.getRequestHeader();
				this.$post(url, data, header).then(res => {
					console.log(res)
					if (res.code === 200) {
						uni.setStorageSync("deviceSn", this.sn);
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
					uni.reLaunch({
						url: "../Bing_page/Bind_fail"
					});
				})
			},
			bind_device(sn, MACdeviceID, modelId, item) {
				let that = this
				const url = that.$url_bind_device;
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				};
				const header = that.getRequestHeader();
				that.$post(url, data, header).then(res => {
					if (res.code === 200) {
						uni.setStorageSync("deviceSn", that.sn);
						if (item.name === "BPW1") {
							that.deviceNameshoubiao = true
							// that.deviceNamexueya = false
						} else {
							that.deviceNameshoubiao = false
							// that.deviceNamexueya = true
						}
						that.createBLEConnection(MACdeviceID, item);
					} else if (res.code === 401) {
						uni.showToast({
							title: that.$t("此设备已被其他账号绑定"),
							icon: 'none'
						})
						return
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail"
						});
					}
				}).catch(erro => {
					uni.reLaunch({
						url: "../Bing_page/Bind_fail"
					});
				})
			},
			//连接低功耗蓝牙
			connectBluetooth() {
				this.idList = [];
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: false,
					success: (startBluetoothDevicesDiscovery) => {
						this.onBluetoothDeviceFound();
					}
				});
			},
			//搜索低功耗蓝牙
			onBluetoothDeviceFound() {
				uni.onBluetoothDeviceFound((res) => {
					const deviceArray = res.devices;
					for (const item of deviceArray) {
						this.idList.push(item);
						this.bluetoothList = this.idList.filter((item, index, self) => {
							return item.name && self.findIndex(t => t.deviceId === item
									.deviceId) ===
								index;
						});
					}
					if (this.checked) {
						setTimeout(() => {
							uni.stopBluetoothDevicesDiscovery();
						}, 5000);
					} else {
						uni.stopBluetoothDevicesDiscovery({
							success: (res) => {
								this.bluetoothList = [];
							}
						});
					}
				});
			},
		},
	}
</script>

<style>
	.tablebody {
		height: 100vh;
		color: black;
	}

	.tablebody_1 {
		padding-bottom: 50px;
		padding-top: 108px;
	}

	.pagestylkes_1 {
		margin: 20px 20px 10px 20px;
		color: gray;
		font-size: 12px;
		font-weight: 400;
	}

	.pagestylkes_3 {
		padding: 15px;
		font-size: 16px;
		font-weight: bold;
	}

	.pagestylkes_2 {
		padding: 15px;
		font-size: 16px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tableitem {
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.listback {
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		text-align: center;
		margin-left: 20px;
		margin-right: 20px;
		line-height: 25px;
		background: white;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.listbackitem {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.imagestyii {
		height: 60px;
		width: 60px;
		object-fit: contain;
	}

	.imagestyii_1 {
		height: 30px;
		width: 30px;
		object-fit: contain;
	}

	.ellipsis-container {
		width: 200px;
		/* 设置容器宽度 */
		overflow: hidden;
		/* 隐藏超出部分 */
		white-space: nowrap;
		/* 文字不换行 */
		text-overflow: ellipsis;
		/* 超出部分显示省略号 */
		text-align: left
	}


	.liststylesd {
		width: 60vw;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		margin-left: 10px;
	}

	.liststitletylesd {
		width: 150px;
		text-align: left;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: auto;
	}

	.titlesdsdsa {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.titlestyle {
		background: #F5F5F5;
		width: auto;
		height: 108px;
		padding-left: 20px;
		padding-right: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.lanysty {
		font-size: 16px;
		font-weight: 600;
		margin-top: 30px;
	}

	.shauxins {
		margin-top: 30px;
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
	}

	.popupstusdsd_2 {
		border-radius: 20px;
		background: #fff;
		text-align: center;
		padding: 20px;
		margin: 60px 20px 60px 20px;
		z-index: 999999;
	}

	.popupstusdsd {
		border-radius: 20px;
		background: #fff;
		width: 80vw;
		text-align: center;
		margin: 0 40px 60px 40px;
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