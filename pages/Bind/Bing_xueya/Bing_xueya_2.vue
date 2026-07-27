<template>
	<view style="color: #000000;width: 100vw;height: 100vh;">
		<view style="display: flex; flex-direction: column;">
			<view style="margin: 20px 0 0 20px; font-size: 12px; color: #969799">{{$t('请勿连接名称前有5G的WIFI')}}</view>
			<view class="shebeistyle">
				<image style="padding: 20px;" :src="SELECT_TYPE === '0' ? imagess:imagess1"></image>
			</view>
			<view style="margin: 20px 20px 0 20px;">
				<view class="input_style">
					<view style="font-weight: 400;font-size: 16px;color: #000000;">WIFI:</view>
					<input class="wifi-input" v-model="wifi_name" :placeholder="$t('请输入wifi')" />
				</view>
			</view>
			<view style="margin: 20px 20px 0 20px;">
				<view class="input_style">
					<view style="font-weight: 400;font-size: 16px; color: #000000;">{{$t('WIFI密码')}}</view>
					<input type="password" style="margin-left: 10px;" v-model="wifi_password"
						:placeholder="$t('请输入wifi密码')" />
				</view>
			</view>
			<button class="btn" @click="btn_start()">{{$t('开始连接')}}</button>
		</view>
	</view>
</template>

<script>
	import {
		getLocalTimeAllJSON
	} from '@/pages/api/unitls/timezone.js'
	export default {
		data() {
			return {
				sn: '',
				SELECT_TYPE: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png',
				wifi_name: '',
				wifi_password: '',
				deviceId: '',
				serviceId: '',
				notifyuuid: '',
				uuid: '',
				modelId: '',
				WIFITYPE: false,

			}
		},

		onLoad(res) {
			this.sn = res.sn
			this.SELECT_TYPE = res.SELECT_TYPE
			this.deviceId = res.deviceId
			this.notifyuuid = res.notifyuuid
			this.serviceId = res.serviceId
			this.uuid = res.uuid
			this.modelId = res.modelId
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('为设备连接WiFi')
			})
			this.fetchDeviceConnectedWifi()
		},

		methods: {
			isAndroidPlatform() {
				const platform = uni.getSystemInfoSync().platform
				return platform === 'android' || (typeof plus !== 'undefined' && plus.os.name === 'Android')
			},
			isIOSPlatform() {
				const platform = uni.getSystemInfoSync().platform
				return platform === 'ios' || (typeof plus !== 'undefined' && plus.os.name === 'iOS')
			},
			normalizeSSID(ssid) {
				return String(ssid || '').replace(/(^\"*)|(\"*$)/g, '').trim()
			},
			sendATCommand(deviceId, serviceId, uuid, senddata, notifyuuid) {
				console.log("senddata：" + senddata)
				let that = this
				let buffer = new ArrayBuffer(senddata.length)
				let dataView = new DataView(buffer)
				for (var i = 0; i < senddata.length; i++) {
					dataView.setUint8(i, senddata.charAt(i).charCodeAt())
				}
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					writeType: "write",
					success(res) {
						setTimeout(() => {
							that.notifyBLECharacteristicValueChange(deviceId, serviceId, uuid, notifyuuid)
						}, 1000)
					},
					fail: function(errrore) {
						if (!that.WIFITYPE) {
							that.getunbind(that.sn)
							that.WIFITYPE = true
							console.log('失败', errrore)
							setTimeout(() => {
								uni.navigateTo({
									url: "../Bing_page/Bind_fail?bindcode=0"
								})
							}, 1000)
						}
					}
				})
			},
			notifyBLECharacteristicValueChange(deviceId, serviceId, uuid, notifyuuid) {
				let that = this
				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: notifyuuid,
					success: (notifyres) => {
						that.onBLEValue(deviceId, serviceId, uuid, notifyuuid)
					},
					fail: (notifyerr) => {}
				})
			},
			onBLEValue(deviceId, serviceId, uuid, notifyuuid) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					let hexData = that.ab2hex(res.value)
					let asciiString = that.hexToAscii(hexData)
					if (asciiString === "+QSTASTAT:WLAN_DISCONNECTED\r\n" || asciiString.includes(
							"WLAN_DISCONNECTED")) {
						if (!that.WIFITYPE) {
							that.getunbind(that.sn)
							that.WIFITYPE = true
							console.log('失败', errrore)
							setTimeout(() => {
								uni.navigateTo({
									url: "../Bing_page/Bind_fail?bindcode=0"
								})
							}, 1000)
						}
					} else if (asciiString === "+QSTASTAT:WLAN_CONNECTED\r\n" || asciiString.includes(
							"WLAN_CONNECTED")) {
						let buffertime = that.toArrayBuffer("74696d6540" + that.getTimeAllJSON().YMDHMSWIFI)
						uni.writeBLECharacteristicValue({
							deviceId: deviceId,
							serviceId: serviceId,
							characteristicId: uuid,
							value: buffertime,
							writeType: "write",
							success(res) {
								that.bind_device(that.sn, deviceId, that.modelId)
							},
							fail: function(errrore) {
								if (!that.WIFITYPE) {
									that.getunbind(that.sn)
									that.WIFITYPE = true
									console.log('失败', errrore)
									setTimeout(() => {
										uni.navigateTo({
											url: "../Bing_page/Bind_fail?bindcode=0"
										})
									}, 1000)
								}
							}
						})
					}
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
			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},
			//通用时间（跟随设备时区）
			getTimeAllJSON() {
				return getLocalTimeAllJSON()
			},
			bind_device(sn, MACdeviceID, modelId) {
				const data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				}
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(bind_device => {
					if (bind_device.code == 200) {
						uni.setStorageSync("deviceSn", sn)
						uni.navigateTo({
							url: "../Bing_page/Bind_success?modelId=" + modelId
						})
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail?bindcode=" + bind_device.code
						})
					}
				})
			},
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},
			hexToAscii(hexString) {
				let str = '';
				for (let i = 0; i < hexString.length; i += 2) {
					let hex = hexString.substr(i, 2);
					str += String.fromCharCode(parseInt(hex, 16));
				}
				return str;
			},
			applyConnectedWifi(ssid) {
				const name = this.normalizeSSID(ssid)
				if (name) {
					this.wifi_name = name
				}
			},
			fetchDeviceConnectedWifi() {
				const that = this
				const fetchConnectedWifi = (retryCount) => {
					uni.getConnectedWifi({
						partialInfo: true,
						success(resd) {
							console.log('获取已连接的Wi-Fi信息', resd)
							const ssid = resd.wifi && resd.wifi.SSID
							if (ssid) {
								that.applyConnectedWifi(ssid)
								return
							}
							if (retryCount < 2) {
								setTimeout(() => fetchConnectedWifi(retryCount + 1), 800)
								return
							}
							that.applyConnectedWifi(that.getConnectedSSIDNative())
						},
						fail(err) {
							// console.log('getConnectedWifi fail', err)
							if (retryCount < 2) {
								setTimeout(() => fetchConnectedWifi(retryCount + 1), 800)
								return
							}
							that.applyConnectedWifi(that.getConnectedSSIDNative())
						}
					})
				}
				const startFetch = () => {
					uni.startWifi({
						success() {
							if (that.isAndroidPlatform()) {
								that.requestLocationPermission(() => fetchConnectedWifi(0))
							} else {
								fetchConnectedWifi(0)
							}
						},
						fail(err) {
							console.log('startWifi fail', err)
							that.applyConnectedWifi(that.getConnectedSSIDNative())
						}
					})
				}
				if (that.isIOSPlatform()) {
					that.prepareIOSWifiAccess(startFetch)
				} else {
					startFetch()
				}
			},
			prepareIOSWifiAccess(callback) {
				if (!this.isIOSPlatform()) {
					callback && callback()
					return
				}
				const done = () => {
					setTimeout(() => {
						callback && callback()
					}, 200)
				}
				try {
					const CLLocationManager = plus.ios.importClass('CLLocationManager')
					let authStatus = CLLocationManager.authorizationStatus()
					const locationManager = plus.ios.newObject('CLLocationManager')
					const startLocationUpdates = () => {
						try {
							locationManager.startUpdatingLocation()
						} catch (e) {
							console.log('startUpdatingLocation error', e)
						}
						uni.getLocation({
							type: 'wgs84',
							isHighAccuracy: true,
							highAccuracyExpireTime: 5000,
							success: () => {},
							fail: (err) => {
								console.log('getLocation fail', err)
							},
							complete: () => {
								setTimeout(() => {
									try {
										locationManager.stopUpdatingLocation()
									} catch (e) {}
									plus.ios.deleteObject(locationManager)
									done()
								}, 2500)
							}
						})
					}
					if (authStatus === 0) {
						locationManager.requestWhenInUseAuthorization()
						setTimeout(() => {
							authStatus = CLLocationManager.authorizationStatus()
							if (authStatus === 2 || authStatus === 1) {
								plus.ios.deleteObject(locationManager)
								done()
								return
							}
							startLocationUpdates()
						}, 1500)
						return
					}
					if (authStatus === 2 || authStatus === 1) {
						plus.ios.deleteObject(locationManager)
						done()
						return
					}
					startLocationUpdates()
				} catch (e) {
					console.log('prepareIOSWifiAccess error', e)
					done()
				}
			},
			getConnectedSSIDNative() {
				if (this.isIOSPlatform()) {
					return this.getIOSConnectedSSIDNative()
				}
				return this.getAndroidConnectedSSIDNative()
			},
			getAndroidConnectedSSIDNative() {
				try {
					var MainActivity = plus.android.runtimeMainActivity()
					var Context = plus.android.importClass('android.content.Context')
					plus.android.importClass('android.net.wifi.WifiManager')
					var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE)
					if (!wifiManager || !wifiManager.isWifiEnabled()) {
						return ''
					}
					var wifiInfo = wifiManager.getConnectionInfo()
					if (!wifiInfo) {
						return ''
					}
					return this.normalizeSSID(wifiInfo.getSSID())
				} catch (e) {
					console.log('getAndroidConnectedSSIDNative error', e)
					return ''
				}
			},
			getIOSConnectedSSIDNative() {
				if (!this.isIOSPlatform()) {
					return ''
				}
				const readSSIDFromInfo = (info) => {
					if (!info) {
						return ''
					}
					try {
						const NSString = plus.ios.importClass('NSString')
						const ssidKey = NSString.stringWithString('SSID')
						const ssidObj = plus.ios.invoke(info, 'objectForKey:', ssidKey)
						if (!ssidObj) {
							return ''
						}
						let ssid = ''
						try {
							ssid = plus.ios.invoke(ssidObj, 'UTF8String')
						} catch (e) {
							ssid = plus.ios.invoke(ssidObj, 'description')
						}
						return this.normalizeSSID(ssid)
					} catch (e) {
						return ''
					}
				}
				const readSSIDFromInterface = (ifname) => {
					try {
						const NSString = plus.ios.importClass('NSString')
						const iface = NSString.stringWithString(ifname)
						const info = plus.ios.invoke('CNCopyCurrentNetworkInfo', iface)
						const ssid = readSSIDFromInfo(info)
						if (info) {
							plus.ios.deleteObject(info)
						}
						return ssid
					} catch (e) {
						return ''
					}
				}
				try {
					let interfaces = null
					try {
						interfaces = plus.ios.invoke('CNCopySupportedInterfaces')
					} catch (e) {
						console.log('CNCopySupportedInterfaces error', e)
					}
					if (interfaces) {
						const count = plus.ios.invoke(interfaces, 'count')
						for (let i = 0; i < count; i++) {
							const ifnameObj = plus.ios.invoke(interfaces, 'objectAtIndex:', i)
							let ifname = ''
							try {
								ifname = plus.ios.invoke(ifnameObj, 'UTF8String')
							} catch (e) {
								ifname = plus.ios.invoke(ifnameObj, 'description')
							}
							const ssid = readSSIDFromInterface(this.normalizeSSID(ifname))
							if (ssid) {
								plus.ios.deleteObject(interfaces)
								return ssid
							}
						}
						plus.ios.deleteObject(interfaces)
					}
					const fallbackInterfaces = ['en0', 'en1', 'awdl0']
					for (let i = 0; i < fallbackInterfaces.length; i++) {
						const ssid = readSSIDFromInterface(fallbackInterfaces[i])
						if (ssid) {
							return ssid
						}
					}
				} catch (e) {
					console.log('getIOSConnectedSSIDNative error', e)
				}
				return ''
			},
			requestLocationPermission(callback) {
				if (!this.isAndroidPlatform()) {
					callback && callback()
					return
				}
				plus.android.requestPermissions(
					['android.permission.ACCESS_FINE_LOCATION', 'android.permission.ACCESS_COARSE_LOCATION'],
					(e) => {
						if (e.granted && e.granted.length > 0) {
							callback && callback()
						} else {
							uni.showToast({
								title: this.$t('您的手机定位服务未开启'),
								icon: 'none'
							})
						}
					},
					() => {
						uni.showToast({
							title: this.$t('您的手机定位服务未开启'),
							icon: 'none'
						})
					}
				)
			},
			btn_start() {
				let that = this
				if (that.wifi_name == that.$t("请选择wifi") || that.wifi_name == "") {
					uni.showToast({
						title: that.$t("请选择或者输入一个wifi"),
						icon: 'none'
					})
					return
				} else if (that.wifi_password == "") {
					uni.showToast({
						title: that.$t("请输入wifi密码"),
						icon: 'none'
					})
					return
				} else {
					that.sendATCommand(that.deviceId, that.serviceId, that.uuid,
						'AT+QSTAAPINFODEF=' + that.wifi_name + ',' + that.wifi_password, that.notifyuuid)
				}
			}
		}
	}
</script>

<style>
	.shebeistyle {
		display: flex;
		width: auto;
		margin: 40px 20px 20px 20px;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 20px;
	}

	.input_style {
		padding: 10px;
		border-bottom: 1px solid gainsboro;
		margin-right: 20px;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.wifi-input {
		flex: 1;
		margin-left: 10px;
		font-size: 16px;
		color: #000;
	}

	.btn {
		width: auto;
		margin: 40px 20px 88px 20px;
		border-radius: 100px;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #3298F7;
		color: white;
	}
</style>