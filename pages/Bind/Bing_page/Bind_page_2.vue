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
		<view v-if="img_scan" class="Message">
			{{(modelname ==="BPW1"||modelname==="BPW6")?$t("扫描手表里边的二维码"):$t("扫描设备背面的二维码")}}
		</view>
		<button class="button_style1" @click="ButtonTap()">{{$t("输入设备码")}}</button>
		<view v-if="modelname==='BPW1'"
			style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_shoubiao_1.jpg" />
			<image class="imgss_sc" mode="aspectFit" src="/static/image/sc_shoubiao_2.jpg" />
		</view>
		<view v-else-if="modelname==='BPW6'"
			style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
			<image class="imgss_sc" mode="aspectFit" :src="(language === 'zh-Hans' || language == 'zh-Hant')?'/static/image/U19M_zh_1.jpg':'/static/image/U19M_en_1.png'" />
			<image class="imgss_sc" mode="aspectFit" :src="(language === 'zh-Hans' || language == 'zh-Hant')?'/static/image/U19M_zh_2.jpg':'/static/image/U19M_en_2.jpg'" />
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
						<view>{{modelname === 'BPW6' ? $t("标准蓝牙提示BPW6") : $t("标准蓝牙提示")}}</view>
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
		30000: '/static/image/BPW1.png',
		30001: '/static/image/BPW6.jpg',
		20000: '/static/image/jls260.png',
		20001: '/static/image/jls260.png',
		10000: '/static/image/617.png',
		10001: '/static/image/BP68.png',
		10002: '/static/image/BP67.png',
		10003: '/static/image/68G.png',
		10004: '/static/image/BP67.png',
		10005: '/static/image/68G.png',
		10006: '/static/image/xueya1.png'
	};
	const modelIdToImagePath = {
		30000: "/static/image/shoubiao1.png", // 手表
		30001: "/static/image/BPW6.jpg", // 手表
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
				BPW6deviceId: "",
				BPW6model: '30001',
				stoponble: false,
				BPW1UUID: "",
				BPW6UUID: "",
				language: uni.getLocale(),

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
						icon: "none",
						duration: 2000
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
								icon: "none",
								duration: 2000
							})
						}
					} else if (this.modelname === "BPW6") {
						if (!this.applyBPW6DeviceCode(this.inputcontext)) {
							uni.showToast({
								title: this.$t("选中的设备与扫码设备不匹配"),
								icon: "none",
								duration: 2000
							})
							return
						}
						this.get_device_info()
						this.$refs.qiehuanpopup.close()
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
				switch (this.modelname) {
					case "BPW1":
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
						break;
					case "BPW6":
						this.handleBPW6Code(barNumber)
						break;
					default:
						this.context_msg = barNumber
						this.img_scan = false
						this.get_device_info()
				}
			},

			/** 从 SN(300001 + 12位MAC) 提取广播比对用 MAC，如 300001CBBF535F078A → CB:BF:53:5F:07:8A */
			formatMacCustom(sn) {
				const hex = String(sn || '').replace(/[^a-fA-F0-9]/g, '').toUpperCase()
				if (!hex) return ''
				let body = hex
				if (hex.startsWith('300001')) {
					body = hex.slice(6)
				}
				if (!body) return ''
				if (body.length < 12) body = body.padStart(12, '0')
				return this.formatMacAddress(body.slice(-12))
			},

			normalizeBPW6Mac(macOrCode) {
				const raw = String(macOrCode || '').trim()
				if (!raw) return ''
				return this.formatMacAddress(raw.replace(/[^a-fA-F0-9]/g, ''))
			},

			/**
			 * 解析 BPW6 设备码/二维码
			 * 扫码样例：300001CBBF535F078A
			 * → SN: 300001CBBF535F078A
			 * → MAC: CB:BF:53:5F:07:8A
			 * 注意：malink 短链（如 https://m.malink.cn/s/xxx）不含设备码，不能当 SN 解析
			 */
			applyBPW6DeviceCode(code) {
				console.log('applyBPW6DeviceCode', code)
				const raw = String(code || '').trim()
				if (!raw) return false
				const paraMatch = raw.match(/para=([^&]+)/i)
				const payload = (paraMatch && paraMatch[1] ? paraMatch[1] : raw).trim()
				// 纯下载/短链 URL 且无 para= 时直接拒绝，避免从 URL 里抠出假 hex
				if (!paraMatch && /^https?:\/\//i.test(payload) && !/300001[0-9a-fA-F]{12}/i.test(payload) &&
					!/[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){5}/i.test(payload)) {
					console.warn('BPW6扫码为短链/下载链接，无设备码', payload)
					return false
				}
				const hex = String(payload).replace(/[^a-fA-F0-9]/g, '').toUpperCase()

				// 标准格式：300001 + 12位MAC
				const snMatch = hex.match(/300001([0-9A-F]{12})/)
				if (snMatch) {
					this.context_msg = `300001${snMatch[1]}`
					this.BPW6deviceId = this.formatMacAddress(snMatch[1])
				} else if (/^[0-9A-F]{12}$/.test(hex)) {
					this.BPW6deviceId = this.formatMacAddress(hex)
					this.context_msg = `300001${hex}`
				} else if (payload.includes(':') && /[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){5}/.test(payload)) {
					this.BPW6deviceId = this.normalizeBPW6Mac(payload)
					const cleanMac = this.BPW6deviceId.replace(/:/g, '')
					if (cleanMac.length !== 12) {
						console.warn('BPW6扫码MAC长度无效', payload)
						return false
					}
					this.context_msg = `300001${cleanMac}`
				} else {
					console.warn('BPW6扫码格式无法识别', payload)
					return false
				}
				console.log('BPW6扫码解析', {
					sn: this.context_msg,
					mac: this.BPW6deviceId
				})
				return !!this.BPW6deviceId
			},

			handleBPW6Code(barCode) {
				const ok = this.applyBPW6DeviceCode(barCode)
				this.img_scan = false
				if (!ok) {
					uni.showToast({
						title: this.$t('选中的设备与扫码设备不匹配'),
						icon: 'none',
						duration: 2000
					})
					this.img_scan = true
					return
				}
				this.get_device_info()
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
						icon: 'none',
						duration: 2000

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
					console.log("获取设备基础信息", res)
					if (res.code == 200) {
						const serverModel = String(res.data.model || '')
						const modelMatched = serverModel === this.modelname ||
							(this.modelname === 'BPW6' && (serverModel === 'BPW6' || serverModel === 'U19M')) ||
							(this.modelname === 'BPW1' && serverModel === 'BPW1')
						const isWatchModel = serverModel === 'BPW1' || serverModel === 'BPW6' ||
							serverModel === 'U19M' || this.modelname === 'BPW1' || this.modelname === 'BPW6'
						if (modelMatched) {
							if (isWatchModel && res.data.deviceSn) {
								const scanSn = String(data.deviceSn || '').replace(/[^a-fA-F0-9]/g, '')
									.toUpperCase()
								const serverSn = String(res.data.deviceSn || '').replace(/[^a-fA-F0-9]/g, '')
									.toUpperCase()
								const resultmac = scanSn.startsWith('300001') || scanSn.startsWith('300000') ?
									scanSn.slice(6) : scanSn
								const serverMac = serverSn.startsWith('300001') || serverSn.startsWith('300000') ?
									serverSn.slice(6) : serverSn
								if (resultmac && resultmac === serverMac) {
									this.img_scan = false;
									this.xinghao = this.$t("型号") + ((serverModel === "BPW6" || serverModel ===
										"U19M" || this.modelname === "BPW6") ? "U19M" : res.data.model);
									this.context_msg = "SN:" + res.data.deviceSn;
									this.context_msg1 = res.data.deviceSn;
									this.modelId = res.data.modelId;
									if (this.modelname === "BPW6" || serverModel === "BPW6" || serverModel ===
										"U19M") {
										this.BPW6deviceId = this.formatMacCustom(res.data.deviceSn || scanSn)
										this.BPW6model = res.data.modelId || this.BPW6model
									}
									this.updateScanImagePath(res.data.picturePath);
								} else {
									this.img_scan = true;
									uni.showToast({
										title: this.$t("选中的设备与扫码设备不匹配"),
										icon: "none",
										duration: 2000
									});
									this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
								}
							} else {
								this.img_scan = false;
								this.xinghao = this.$t("型号") + ((serverModel === "BPW6" || serverModel ===
									"U19M") ? "U19M" : res.data.model);
								this.context_msg = "SN:" + res.data.deviceSn;
								this.context_msg1 = res.data.deviceSn;
								this.modelId = res.data.modelId;
								this.updateScanImagePath(res.data.picturePath);
							}
						} else {
							this.img_scan = true;
							uni.showToast({
								title: this.$t("选中的设备与扫码设备不匹配"),
								icon: "none",
								duration: 2000
							});
							this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');
						}
					} else {
						this.img_scan = true;
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						});
						this.context_msg = this.$t('请将条码放入扫码框内即可自动扫描');

					}
				})
			},
			updateScanImagePath(picturePath) {
				if (picturePath) {
					if (lan === 'zh-Hans' || lan == 'zh-Hant') {
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
					console.log("查询设备", res)
					if (res.code == 200) {
						if (res.rows.length === 0) {
							this.navigateTo(this.modelId);
						} else {
							const deviceExists = res.rows.some(item => item.deviceSn === this.context_msg1);
							if (deviceExists) {
								uni.showToast({
									title: this.$t("当前主页面已绑定该设备"),
									icon: 'none',
									duration: 2000
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
							title: this.$t("失败"),
							icon: 'none',
							duration: 2000

						});
					}
				}).catch((errr) => {
					console.error("errr", errr)
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
					} else if (this.modelname === "BPW6") {
						console.log("BPW6手表连接修改")
						this.BPW6model = modelId
						this.stoponble = true
						this.initBluetooth6()
					} else {
						uni.navigateTo({
							url: "../../Bind/Bing_xueya/Bing_xueya_LY?SELECT_TYPE=" + this.SELECT_TYPE +
								"&sn=" +
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
				const successModelId = that.modelname === "BPW6" ? that.BPW6model : that.BPW1model
				uni.reLaunch({
					url: "../../Bind/Bing_page/Bind_success?modelId=" + successModelId
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
						that.stoponble = false
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
			// 绑定BPW6手表初始化低功耗蓝牙
			initBluetooth6() {
				let that = this;
				uni.openBluetoothAdapter({
					success: res => {
						console.log("初始化BPW6低功耗蓝牙成功")
						that.connectBluetooth6()
					},
					fail: function(err) {
						that.stoponble = false
						console.log('BPW6蓝牙模块初始化失败', err);
						uni.hideLoading()
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
			connectBluetooth6() {
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: true,
					success: () => {
						console.log("开始搜索低功耗蓝牙BPW6手表")
						this.onBluetoothDeviceFound6();
					}
				});
			},
			isBPW6BleName(name) {
				const n = String(name || '').trim().toUpperCase()
				return n.includes('U19M') || n.includes('BPW6') || n.includes('U16H') || n.includes('U16')
			},
			/** 扫码 MAC 后 4 位，如 CA:BF:51:4F:14:0B → 140B */
			getBPW6MacSuffix(mac) {
				const hex = String(mac || '').replace(/[^a-fA-F0-9]/g, '').toUpperCase()
				return hex.length >= 4 ? hex.slice(-4) : ''
			},
			/** 蓝牙名末尾 4 位十六进制，如 U16H_ZX_140B / U19M_ZX_078A → 140B / 078A */
			getBPW6NameSuffix(name) {
				const m = String(name || '').trim().toUpperCase().match(/([0-9A-F]{4})\s*$/)
				return m ? m[1] : ''
			},
			/** 经典蓝牙与 BLE MAC 常差首字节最低位（CA ↔ CB） */
			getBPW6MacCandidates(mac) {
				const n = this.normalizeBPW6Mac(mac)
				if (!n) return []
				const parts = n.split(':')
				const list = [n]
				if (parts.length === 6) {
					const b0 = parseInt(parts[0], 16)
					if (!isNaN(b0)) {
						const alt = (b0 ^ 0x01).toString(16).padStart(2, '0').toUpperCase()
						list.push([alt, ...parts.slice(1)].join(':'))
					}
				}
				return list
			},
			/**
			 * 从 BPW6 广播 advertisData 解析 MAC
			 * 例：3412fee7cbbf535f078a → 取后12位 cbbf535f078a → CB:BF:53:5F:07:8A
			 */
			parseBPW6AdvMac(advertisData) {
				if (!advertisData) return ''
				try {
					const hex = this.ab2hex(advertisData).replace(/[^a-fA-F0-9]/g, '').toUpperCase()
					if (hex.length < 12) return ''
					return this.formatMacAddress(hex.slice(-12))
				} catch (e) {
					return ''
				}
			},
			/** Android 上 deviceId 常为 MAC；iOS 为 UUID，解析失败则返回空 */
			parseBPW6DeviceIdMac(deviceId) {
				const hex = String(deviceId || '').replace(/[^a-fA-F0-9]/g, '').toUpperCase()
				if (hex.length < 12 || hex.length > 12 && hex.includes('-')) return ''
				// 纯 12 位 hex 或带冒号的 MAC
				if (/^[0-9A-F]{12}$/.test(hex)) return this.formatMacAddress(hex)
				const raw = String(deviceId || '').trim().toUpperCase()
				if (/^[0-9A-F]{2}(:[0-9A-F]{2}){5}$/.test(raw)) return raw
				return ''
			},
			/**
			 * BPW6 目标设备判定（兼容 U16H / U19M）
			 * 1) 蓝牙名最后 4 位 == MAC 后 4 位
			 * 2) 广播 MAC / deviceId MAC 全等（含 CA↔CB）
			 * 3) 广播原始字节包含完整 MAC
			 * 注意：name 为空时仍可用广播 MAC 匹配（iOS 常见）
			 */
			isBPW6TargetDevice(item, targetMac) {
				const mac = this.normalizeBPW6Mac(targetMac)
				if (!mac) return false
				const macs = this.getBPW6MacCandidates(mac)
				const targetSuffix = this.getBPW6MacSuffix(mac)
				const bleName = item.name || item.localName || ''
				const nameSuffix = this.getBPW6NameSuffix(bleName)
				if (targetSuffix && nameSuffix && nameSuffix === targetSuffix) return true

				const advMac = this.parseBPW6AdvMac(item.advertisData)
				if (advMac && macs.indexOf(advMac) !== -1) return true

				const idMac = this.parseBPW6DeviceIdMac(item.deviceId)
				if (idMac && macs.indexOf(idMac) !== -1) return true

				if (item.advertisData) {
					try {
						const hex = this.ab2hex(item.advertisData).replace(/[^a-fA-F0-9]/g, '').toUpperCase()
						for (let i = 0; i < macs.length; i++) {
							const compact = macs[i].replace(/:/g, '')
							if (compact && hex.indexOf(compact) !== -1) return true
						}
					} catch (e) {}
				}
				return false
			},
			/** 尝试匹配并绑定一只候选；命中返回 true */
			tryBindBPW6Candidate(item, targetMac, targetSuffix, seenIds) {
				if (!this.stoponble) return false
				const did = String(item.deviceId || '')
				if (did && seenIds && seenIds[did]) return false
				const bleName = item.name || item.localName || ''
				const advHex = item.advertisData ? this.ab2hex(item.advertisData) : ''
				const advMac = this.parseBPW6AdvMac(item.advertisData)
				const idMac = this.parseBPW6DeviceIdMac(item.deviceId)
				const nameSuffix = this.getBPW6NameSuffix(bleName)
				const matched = this.isBPW6TargetDevice(item, targetMac)
				// 有名字但不像手表、且未命中时跳过，避免刷屏
				if (!matched && bleName && !this.isBPW6BleName(bleName)) return false
				// 无名且无广播时跳过
				if (!matched && !bleName && !advMac && !idMac) return false
				if (did && seenIds) seenIds[did] = true
				// console.log('搜索到BPW6候选', bleName || '(空名)', nameSuffix, targetSuffix, advHex || idMac,
				// 	advMac || idMac, targetMac, matched ? '匹配' : '不匹配')
				if (!matched) return false
				this.stoponble = false
				uni.hideLoading()
				uni.stopBluetoothDevicesDiscovery()
				this.BPW6UUID = item.deviceId
				this.BPW6binddevice(this.context_msg1, item.deviceId, this.BPW6model)
				return true
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
							const that = this
							uni.showModal({
								title: this.$t("提示"),
								content: this.$t("未检测到附近蓝牙手表设备"),
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										that.stoponble = false
									}
								}
							});
						}
					}
				}, 1000)
			},
			onBluetoothDeviceFound6() {
				let BPW6timeer = null
				let BPW6time = 0
				const targetMac = this.normalizeBPW6Mac(this.BPW6deviceId)
				const targetSuffix = this.getBPW6MacSuffix(targetMac)
				const seenIds = {}
				uni.showLoading({
					title: this.$t("搜索中"),
					mask: true
				})
				uni.onBluetoothDeviceFound((res) => {
					if (!this.stoponble) return
					const deviceArray = res.devices || []
					for (const item of deviceArray) {
						if (this.tryBindBPW6Candidate(item, targetMac, targetSuffix, seenIds)) break
					}
				});
				const pollFoundDevices = () => {
					if (!this.stoponble) return
					uni.getBluetoothDevices({
						success: (res) => {
							if (!this.stoponble) return
							const list = res.devices || []
							for (const item of list) {
								if (this.tryBindBPW6Candidate(item, targetMac, targetSuffix, seenIds)) break
							}
						}
					})
				}
				BPW6timeer = setInterval(() => {
					BPW6time++
					if (!this.stoponble) {
						uni.stopBluetoothDevicesDiscovery()
						clearInterval(BPW6timeer)
						BPW6timeer = null
					} else {
						console.log("BPW6搜索低功耗蓝牙", BPW6time, "目标后缀", targetSuffix, targetMac)
						pollFoundDevices()
						if (BPW6time === 20) {
							uni.hideLoading()
							uni.stopBluetoothDevicesDiscovery()
							clearInterval(BPW6timeer)
							BPW6timeer = null
							const that = this
							uni.showModal({
								title: this.$t("提示"),
								content: this.$t("未检测到附近蓝牙手表设备"),
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										that.stoponble = false
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
							icon: 'none',
							duration: 2000
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
			// BPW6手表设备绑定
			BPW6binddevice(sn, MACdeviceID, modelId) {
				let data = {
					deviceSn: sn,
					mac: MACdeviceID.trim()
				};
				this.$post(this.$url_APP_IP + this.$url_bind_device, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					console.log("BPW6绑定结果", res)
					if (res.code === 200) {
						uni.setStorageSync("appQX", "1")
						uni.setStorageSync("deviceSn", sn);
						uni.setStorageSync("BPW6devicemac", MACdeviceID.trim())
						uni.showLoading({
							title: this.$t("连接中"),
							mask: true
						})
						this.createBLEConnection(MACdeviceID, sn)
						this.setacktypes("0")
					} else if (res.code === 401) {
						uni.showToast({
							title: this.$t("此设备已被其他账号绑定"),
							icon: 'none',
							duration: 2000
						})
						return
					} else {
						uni.reLaunch({
							url: "../Bing_page/Bind_fail"
						});
					}
				}).catch(erro => {
					console.error("BPW6绑定失败", erro)
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
						if (that.modelname === "BPW6") {
							uni.setStorageSync("BPW6devicemac", deviceId)
						}
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
										if (that.modelname === "BPW6") {
											uni.setStorageSync("BPW6devicemac", deviceId)
										}
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