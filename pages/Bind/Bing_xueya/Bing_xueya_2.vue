<template>
	<view style="color: #000000;width: 100vw;height: 100vh;">
		<!-- <view class="bp-log-panel">
			<view class="bp-log-header">
				<text class="bp-log-title">调试日志(历史/实时/qxBle)</text>
				<view class="bp-log-header-actions">
					<text class="bp-log-copy-btn" @click.stop="copyBpLogs">一键复制</text>
					<text class="bp-log-clear-btn" @click.stop="clearBpLogs">一键清除</text>
				</view>
			</view>
			<scroll-view scroll-y class="bp-log-content" :scroll-top="logScrollTop" @click="copyBpLogs">
				<text class="bp-log-text" :key="logTick">{{ bpLogText || '暂无日志' }}</text>
			</scroll-view>
		</view> -->
		<view style="display: flex; flex-direction: column;">
			<view style="margin: 20px 0 0 20px; font-size: 12px; color: #969799">{{$t('请勿连接名称前有5G的WIFI')}}</view>
			<view style="margin: 8px 20px 0 20px; font-size: 12px; color: #EE0A24">{{$t('只支持24GWiFi请连接24GWiFi')}}</view>
			<view class="shebeistyle">
				<image style="padding: 20px;" :src="SELECT_TYPE === '0' ? imagess:imagess1"></image>
			</view>
			<view style="margin: 20px 20px 0 20px;">
				<view style="font-size: 12px; color: #969799; margin-bottom: 8px;">{{$t('如果需要可更换连接其他账号和密码')}}</view>
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

		computed: {
			bpLogText() {
				return this.bpDebugLogs.map(log => `[${log.time}] ${log.text}`).join('\n');
			},
		},


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
				bleNotifyTimer: null,
				bleNotifyRetried: false,
				bleValueListening: false,
				bleNotifySubscribed: false,
				blePendingWifiText: '',
				bleValueHandled: false,
				fromManage: false,
				preferredWriteType: 'write',
				bleWriteTimer: null,
				bleNotifyResumeTimer: null,
				wlanDisconnectWaitTimer: null,
				wifiRetryAfterFail: false,
				ignoreStaStopDisconnect: false,
				wifiAttemptId: 0,
				wifiAtSent: false,


				bpDebugLogs: [], //日志
				logTick: 0,
				logScrollTop: 0,

			}
		},

		onLoad(res) {
			this.sn = res.sn ? decodeURIComponent(res.sn) : ''
			this.SELECT_TYPE = res.SELECT_TYPE
			this.deviceId = res.deviceId ? decodeURIComponent(res.deviceId) : ''
			this.notifyuuid = res.notifyuuid ? decodeURIComponent(res.notifyuuid) : ''
			this.serviceId = res.serviceId ? decodeURIComponent(res.serviceId) : ''
			this.uuid = res.uuid ? decodeURIComponent(res.uuid) : ''
			this.modelId = res.modelId ? decodeURIComponent(res.modelId) : ''
			this.fromManage = res.fromManage === '1' || res.fromManage === 1 || res.fromManage === true
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('为设备连接WiFi')
			})
			// 关闭上一页可能残留的 loading（如“搜索中...”）
			uni.hideLoading()
			this.fetchDeviceConnectedWifi()
		},
		onUnload() {
			try {
				if (this.bleValueHandler && typeof uni.offBLECharacteristicValueChange === 'function') {
					uni.offBLECharacteristicValueChange(this.bleValueHandler)
				}
			} catch (e) {}
			this.bleValueListening = false
			this.bleNotifySubscribed = false
			this.clearBleNotifyTimer()
			this.clearBleWriteTimer()
			this.clearBleNotifyResumeTimer()
			this.clearWlanDisconnectWaitTimer()
			if (this._staStopTimer) {
				clearTimeout(this._staStopTimer)
				this._staStopTimer = null
			}
		},

		methods: {
			formatLogMsg(value) {
				if (value === undefined) return '';
				if (value === null) return 'null';
				if (typeof value === 'object') {
					try {
						return JSON.stringify(value);
					} catch (e) {
						return String(value);
					}
				}
				return String(value);
			},
			addlog(...args) {
				const text = args.map(p => this.formatLogMsg(p)).join(' ');
				const time = new Date().toLocaleTimeString();
				const next = this.bpDebugLogs.concat([{
					time,
					text
				}]);
				const maxLogs = 300;
				this.bpDebugLogs = next.length > maxLogs ? next.slice(next.length - maxLogs) : next;
				this.logTick += 1;
				this.logScrollTop = this.logTick * 1000;
				console.log(...args);
			},

			copyBpLogs() {
				const text = this.bpLogText;
				if (!text) {
					uni.showToast({
						title: '暂无日志',
						icon: 'none'
					});
					return;
				}
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						});
					},
					fail: () => {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						});
					}
				});
			},
			clearBpLogs() {
				if (!this.bpDebugLogs.length) {
					uni.showToast({
						title: '暂无日志',
						icon: 'none'
					});
					return;
				}
				this.bpDebugLogs = [];
				uni.showToast({
					title: '已清除',
					icon: 'success'
				});
			},
			clearBleNotifyTimer() {
				if (this.bleNotifyTimer) {
					clearTimeout(this.bleNotifyTimer)
					this.bleNotifyTimer = null
				}
			},
			clearWlanDisconnectWaitTimer() {
				if (this.wlanDisconnectWaitTimer) {
					clearTimeout(this.wlanDisconnectWaitTimer)
					this.wlanDisconnectWaitTimer = null
				}
			},
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
			buildWifiAtCommand() {
				const ssid = this.normalizeSSID(this.wifi_name)
				const pwd = String(this.wifi_password || '')

				if (!pwd) {
					// Quectel AT 行必须以 CR/LF 结束，否则模块会一直等命令结束符，密码看起来像没写进去
					return 'AT+QSTAAPINFODEF=' + ssid.trim()
				} else {
					// Quectel AT 行必须以 CR/LF 结束，否则模块会一直等命令结束符，密码看起来像没写进去
					return 'AT+QSTAAPINFODEF=' + ssid.trim() + ',' + pwd.trim()
				}
			},
			clearBleWriteTimer() {
				if (this.bleWriteTimer) {
					clearTimeout(this.bleWriteTimer)
					this.bleWriteTimer = null
				}
			},
			armBleWriteTimer(onTimeout) {
				this.clearBleWriteTimer()
				this.bleWriteTimer = setTimeout(() => {
					this.bleWriteTimer = null
					this.addlog('发送AT命令超时')
					if (typeof onTimeout === 'function') onTimeout()
				}, 15000)
			},
			// 第一遍整包；回包超时后的第二遍也整包
			sendATCommand(deviceId, serviceId, uuid, senddata, notifyuuid) {
				let that = this
				that.blePendingWifiText = ''
				that.onBLEValue(deviceId, serviceId, uuid, notifyuuid)
				that.addlog('发送AT命令所有服务值和数据:', deviceId, serviceId, uuid, senddata, notifyuuid)
				let buffer = new ArrayBuffer(senddata.length)
				let dataView = new DataView(buffer)
				for (var i = 0; i < senddata.length; i++) {
					dataView.setUint8(i, senddata.charAt(i).charCodeAt())
				}
				that.addlog('发送AT命令16进制:', that.ab2hex(buffer))
				const finishWriteFail = () => {
					that.clearBleWriteTimer()
					if (that.bleValueHandled || that.WIFITYPE) return
					that.handleWifiSetFail()
				}
				const afterWriteOk = (res) => {
					that.clearBleWriteTimer()
					that.addlog('1发送AT命令成功：', res)
					that.addlog('2发送AT命令成功：' + senddata)
					that.wifiAtSent = true
					const pendingWifiText = that.blePendingWifiText
					that.blePendingWifiText = ''
					if (pendingWifiText) {
						that.addlog('补处理写入前缓存的回包', pendingWifiText)
						that.applyWifiNotifyText(pendingWifiText, deviceId, serviceId, uuid, that.wifiAttemptId)
					}
					if (that.bleValueHandled || that.WIFITYPE) return
					uni.showLoading({
						title: that.$t('连接中'),
						mask: true
					})
					// 只有这次连接里已经订过通知才跳过。只注册 JS 监听不算已订阅，否则设备回包到不了 App
					if (that.bleNotifySubscribed) {
						that.armBleNotifyTimer(deviceId, serviceId, uuid, notifyuuid)
						return
					}
					that.notifyBLECharacteristicValueChange(deviceId, serviceId, uuid, notifyuuid)
				}
				that.armBleWriteTimer(finishWriteFail)
				that.addlog(that.bleNotifyRetried ? '第二遍整包写入' : '第一遍整包写入', 'len=' + buffer.byteLength)
				const types = ['write', 'write', '']
				const maxWriteTimes = 3
				let typeIndex = 0
				const tryWrite = () => {
					if (typeIndex >= maxWriteTimes) {
						finishWriteFail()
						return
					}
					const writeType = types[typeIndex++]
					const options = {
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: uuid,
						value: buffer,
						success(res) {
							afterWriteOk(res)
						},
						fail: function(errrore) {
							that.addlog('1发送AT命令失败', errrore, 'writeType=' + (writeType || '(auto)'))
							if (typeIndex < maxWriteTimes) {
								that.addlog('写入失败，更换写入方式重试', typeIndex + '/' + maxWriteTimes, writeType ||
									'(auto)')
								tryWrite()
								return
							}
							finishWriteFail()
						}
					}
					if (writeType) {
						options.writeType = writeType
					}
					uni.writeBLECharacteristicValue(options)
				}
				tryWrite()
			},
			/** 第二遍：把同一条 AT 按 20 字节顺序写完 */
			writeIosSequential(deviceId, serviceId, uuid, buffer, onSuccess, onFail) {
				const that = this
				const bytes = new Uint8Array(buffer)
				const chunks = []
				for (let i = 0; i < bytes.length; i += 20) {
					const slice = bytes.subarray(i, Math.min(i + 20, bytes.length))
					const buf = new ArrayBuffer(slice.length)
					new Uint8Array(buf).set(slice)
					chunks.push(buf)
				}
				let index = 0
				let typeIndex = 0
				const types = ['write', 'write', '']
				const tryChunk = () => {
					if (index >= chunks.length) {
						onSuccess({
							errMsg: 'writeBLECharacteristicValue:ok'
						})
						return
					}
					const writeType = types[typeIndex]
					const options = {
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: uuid,
						value: chunks[index],
						success() {
							that.addlog('分包写入', (index + 1) + '/' + chunks.length,
								'writeType=' + (writeType || '(auto)'),
								'hex=' + that.ab2hex(chunks[index]))
							index += 1
							typeIndex = 0
							if (index >= chunks.length) {
								onSuccess({
									errMsg: 'writeBLECharacteristicValue:ok'
								})
								return
							}
							setTimeout(tryChunk, 40)
						},
						fail(err) {
							that.addlog('分包写入失败', writeType || '(auto)', (index + 1) + '/' + chunks.length, err)
							if (typeIndex + 1 < types.length) {
								typeIndex += 1
								tryChunk()
								return
							}
							onFail(err)
						}
					}
					if (writeType) {
						options.writeType = writeType
					}
					uni.writeBLECharacteristicValue(options)
				}
				tryChunk()
			},
			normalizeBleId(id) {
				return String(id || '').trim().toUpperCase()
			},
			isVendorWifiService(uuid) {
				return this.normalizeBleId(uuid).indexOf('0000FFFF') === 0
			},
			/** 与 Android / 绑定页一致：最后一个可写特征、最后一个通知特征 */
			pickCharsFromList(characteristics) {
				let uuid = ''
				let notifyuuid = ''
				let canWrite = false
				let canWriteNoResponse = false
				const list = characteristics || []
				for (let i = 0; i < list.length; i++) {
					const c = list[i]
					const props = c.properties || {}
					this.addlog('ble char', c.uuid, 'write', !!props.write, 'write', !!props
						.writeNoResponse, 'notify', !!props.notify, 'indicate', !!props.indicate)
					if (props.write || props.writeNoResponse) {
						uuid = c.uuid
						canWrite = !!props.write
						canWriteNoResponse = !!props.writeNoResponse
					}
					if (props.notify || props.indicate) {
						notifyuuid = c.uuid
					}
				}
				return {
					uuid,
					notifyuuid,
					writeTypeHint: canWriteNoResponse && !canWrite ? 'write' : 'write'
				}
			},
			ensureBleSession(deviceId) {
				return new Promise((resolve) => {
					uni.createBLEConnection({
						deviceId,
						timeout: 8000,
						complete: () => resolve()
					})
				})
			},
			openBluetoothAdapterAsync() {
				return new Promise((resolve) => {
					uni.openBluetoothAdapter({
						success: () => resolve(true),
						fail: () => resolve(false)
					})
				})
			},
			bleIdLoose(id) {
				return this.normalizeBleId(id).replace(/[:\-]/g, '')
			},
			isSameManageBleId(a, b) {
				const na = this.normalizeBleId(a)
				const nb = this.normalizeBleId(b)
				if (na && nb && na === nb) return true
				const la = this.bleIdLoose(a)
				const lb = this.bleIdLoose(b)
				return !!(la && lb && la === lb)
			},
			getWifiManageNameAliases() {
				const map = {
					'10001': ['JL-BP68W'],
					'10002': ['JL-BP67W'],
					'10005': ['ZK-B872B', 'ZK-B872', 'ZK-872', 'ZK872']
				}
				return map[String(this.modelId)] || ['JL-BP68W', 'JL-BP67W', 'ZK-B872B', 'ZK-B872']
			},
			matchBleDeviceIdFromList(devices, mac) {
				const list = devices || []
				for (let i = 0; i < list.length; i++) {
					const id = list[i] && list[i].deviceId
					if (id && this.isSameManageBleId(id, mac)) return id
				}
				return ''
			},
			matchBleDeviceIdByName(devices, names) {
				const list = devices || []
				const nameList = names || []
				const hits = []
				for (let i = 0; i < list.length; i++) {
					const d = list[i]
					if (!d) continue
					const name = String(d.name || d.localName || '')
					for (let j = 0; j < nameList.length; j++) {
						if (name && name.indexOf(nameList[j]) >= 0) {
							hits.push(d.deviceId)
							break
						}
					}
				}
				const uniq = hits.filter((id, idx) => id && hits.indexOf(id) === idx)
				return uniq.length === 1 ? uniq[0] : ''
			},
			getBluetoothDevicesAsync() {
				return new Promise((resolve) => {
					uni.getBluetoothDevices({
						success: (res) => resolve((res && res.devices) || []),
						fail: () => resolve([])
					})
				})
			},
			getConnectedBleDevicesAsync() {
				return new Promise((resolve) => {
					uni.getConnectedBluetoothDevices({
						success: (res) => resolve((res && res.devices) || []),
						fail: () => resolve([])
					})
				})
			},
			findListdadsaBleDeviceId(mac) {
				let list = []
				try {
					list = uni.getStorageSync('listdadsa') || []
				} catch (e) {
					list = []
				}
				if (!Array.isArray(list)) list = []
				const byMac = this.matchBleDeviceIdFromList(list, mac)
				if (byMac) return byMac
				return this.matchBleDeviceIdByName(list, this.getWifiManageNameAliases())
			},
			pollScanManageBleDeviceId(mac, names, timeoutMs) {
				const that = this
				return new Promise((resolve) => {
					let settled = false
					const finish = (id) => {
						if (settled) return
						settled = true
						try {
							uni.stopBluetoothDevicesDiscovery()
						} catch (e) {}
						resolve(id || '')
					}
					const tick = () => {
						if (settled) return
						that.getBluetoothDevicesAsync().then((devices) => {
							const byMac = that.matchBleDeviceIdFromList(devices, mac)
							if (byMac) {
								finish(byMac)
								return
							}
							const byName = that.matchBleDeviceIdByName(devices, names)
							if (byName) finish(byName)
						})
					}
					uni.startBluetoothDevicesDiscovery({
						allowDuplicatesKey: true,
						success: () => {
							tick()
							const timer = setInterval(() => {
								if (settled) {
									clearInterval(timer)
									return
								}
								tick()
							}, 500)
							setTimeout(() => {
								clearInterval(timer)
								finish('')
							}, timeoutMs)
						},
						fail: () => finish('')
					})
				})
			},
			async resolveManageBleDeviceId(mac) {
				const names = this.getWifiManageNameAliases()
				const connected = await this.getConnectedBleDevicesAsync()
				let id = this.matchBleDeviceIdFromList(connected, mac) || this.matchBleDeviceIdByName(connected, names)
				if (id) {
					this.addlog('fromManage 用已连接蓝牙', id)
					return id
				}
				const stored = this.findListdadsaBleDeviceId(mac)
				if (stored) {
					this.addlog('fromManage 用历史蓝牙deviceId', stored)
					return stored
				}
				const cached = await this.getBluetoothDevicesAsync()
				id = this.matchBleDeviceIdFromList(cached, mac) || this.matchBleDeviceIdByName(cached, names)
				if (id) {
					this.addlog('fromManage 用缓存扫描设备', id)
					return id
				}
				id = await this.pollScanManageBleDeviceId(mac, names, 8000)
				if (id) {
					this.addlog('fromManage 扫描到蓝牙deviceId', id)
					return id
				}
				this.addlog('fromManage 回退使用传入deviceId', mac)
				return mac || ''
			},
			ensureManageBleSession(deviceId) {
				const that = this
				return new Promise((resolve, reject) => {
					if (!deviceId) {
						reject(new Error('no deviceId'))
						return
					}
					uni.createBLEConnection({
						deviceId,
						timeout: 15000,
						success: () => {
							that.bleNotifySubscribed = false
							that.addlog('fromManage 蓝牙连接成功', deviceId)
							uni.setBLEMTU({
								deviceId,
								mtu: 512,
								complete: () => {}
							})
							setTimeout(() => resolve(deviceId), 2000)
						},
						fail: (err) => {
							const msg = String((err && err.errMsg) || '')
							const code = err && err.errCode
							if (code === -1 || /already|connected/i.test(msg)) {
								that.addlog('fromManage 蓝牙已连接', deviceId, err)
								setTimeout(() => resolve(deviceId), 300)
								return
							}
							that.addlog('fromManage 蓝牙连接失败', deviceId, err)
							reject(err)
						}
					})
				})
			},
			getCharacteristicsAsync(deviceId, serviceId) {
				return new Promise((resolve) => {
					uni.getBLEDeviceCharacteristics({
						deviceId,
						serviceId,
						success: (res) => resolve((res && res.characteristics) || []),
						fail: () => resolve([])
					})
				})
			},
			getServicesAsync(deviceId) {
				return new Promise((resolve) => {
					uni.getBLEDeviceServices({
						deviceId,
						success: (res) => resolve((res && res.services) || []),
						fail: () => resolve([])
					})
				})
			},
			/**
			 * 只写厂商服务 0000FFFF。
			 * 00001801 等标准 GATT 特征不能用来发 AT。
			 */
			async resolveBleWriteTarget(deviceId) {
				const services = await this.getServicesAsync(deviceId)
				let serviceId = ''
				for (let i = 0; i < services.length; i++) {
					const uuid = services[i] && services[i].uuid
					if (this.isVendorWifiService(uuid)) {
						serviceId = uuid
						break
					}
				}
				if (!serviceId && services[2] && services[2].uuid && !this.normalizeBleId(services[2].uuid)
					.startsWith('000018')) {
					serviceId = services[2].uuid
				}
				if (!serviceId) {
					this.addlog('resolveBleWriteTarget 未找到厂商服务', services.map(s => s && s.uuid))
					return null
				}
				const chars = await this.getCharacteristicsAsync(deviceId, serviceId)
				const picked = this.pickCharsFromList(chars)
				this.addlog('resolveBleWriteTarget', serviceId, picked)
				if (!picked.uuid) return null
				return {
					serviceId,
					uuid: picked.uuid,
					notifyuuid: picked.notifyuuid || picked.uuid,
					writeTypeHint: picked.writeTypeHint || 'write'
				}
			},
			handleWifiSetFail() {
				if (this.WIFITYPE) return
				this.WIFITYPE = true
				this.clearBleWriteTimer()
				this.clearBleNotifyTimer()
				this.clearWlanDisconnectWaitTimer()
				uni.hideLoading()
				if (this._wifiFailNavTimer) {
					clearTimeout(this._wifiFailNavTimer)
					this._wifiFailNavTimer = null
				}
				if (this.fromManage) {
					// 更换 Wi-Fi 失败留在本页：不断开蓝牙、不跳失败页。下次点「开始连接」会先停 STA 再重发
					this.wifiRetryAfterFail = true
					uni.showToast({
						title: this.$t('更换wifi账号密码失败请重试'),
						icon: 'none',
						duration: 2500
					})
					return
				}
				// 首次绑定失败：先停 STA，设备才会重新广播，否则重新绑定扫不到
				this.releaseFirstBindBleAfterStaStop()
			},
			releaseFirstBindBleAfterStaStop() {
				const that = this
				let left = false
				const finish = () => {
					if (left) return
					left = true
					if (that._staStopTimer) {
						clearTimeout(that._staStopTimer)
						that._staStopTimer = null
					}
					that.dropFirstBindBleLink()
					that.getunbind(that.sn)
					that._wifiFailNavTimer = setTimeout(() => {
						that._wifiFailNavTimer = null
						uni.navigateTo({
							url: "../Bing_page/Bind_fail?bindcode=0"
						})
					}, 1000)
				}
				const arm = (delay) => {
					if (that._staStopTimer) clearTimeout(that._staStopTimer)
					that._staStopTimer = setTimeout(() => {
						that._staStopTimer = null
						finish()
					}, delay)
				}
				const deviceId = that.deviceId
				const serviceId = that.serviceId
				const uuid = that.uuid
				if (!deviceId || !serviceId || !uuid) {
					finish()
					return
				}
				that.addlog('首次绑定WiFi失败，先停止STA再断开蓝牙')
				arm(2000)
				that.writeBleCommand(deviceId, serviceId, uuid, 'AT+QSTASTOP', () => {
					arm(500)
				})
			},
			dropFirstBindBleLink() {
				const deviceId = this.deviceId
				try {
					if (this.bleValueHandler && typeof uni.offBLECharacteristicValueChange === 'function') {
						uni.offBLECharacteristicValueChange(this.bleValueHandler)
					}
				} catch (e) {}
				this.bleValueListening = false
				this.bleNotifySubscribed = false
				const closeLink = () => {
					if (!deviceId) return
					uni.closeBLEConnection({
						deviceId: deviceId,
						complete: () => {}
					})
				}
				if (!(deviceId && this.serviceId && this.notifyuuid)) {
					closeLink()
					return
				}
				let closed = false
				const once = () => {
					if (closed) return
					closed = true
					closeLink()
				}
				setTimeout(once, 300)
				try {
					uni.notifyBLECharacteristicValueChange({
						state: false,
						deviceId: deviceId,
						serviceId: this.serviceId,
						characteristicId: this.notifyuuid,
						complete: once
					})
				} catch (e) {
					once()
				}
			},
			handleWifiSetSuccess(deviceId) {
				if (this.WIFITYPE) return
				this.WIFITYPE = true
				this.clearBleWriteTimer()
				this.clearBleNotifyTimer()
				this.clearWlanDisconnectWaitTimer()
				uni.hideLoading()
				if (this.fromManage) {
					uni.showToast({
						title: this.$t('设置成功'),
						icon: 'none'
					})
					setTimeout(() => {
						const pages = getCurrentPages()
						if (pages && pages.length > 2) {
							uni.navigateBack({
								delta: 2
							})
							return
						}
						uni.switchTab({
							url: '/pages/tabBar/device/Equipment_management'
						})
					}, 800)
					return
				}
				this.bind_device(this.sn, deviceId, this.modelId)
			},
			armBleNotifyTimer(deviceId, serviceId, uuid, notifyuuid) {
				const that = this
				if (that.bleValueHandled || that.WIFITYPE) return
				that.clearBleNotifyTimer()
				// WiFi 关联通常超过 10s；超时重发一次后再失败
				that.bleNotifyTimer = setTimeout(() => {
					that.bleNotifyTimer = null
					if (that.bleValueHandled || that.WIFITYPE) return
					if (!that.bleNotifyRetried) {
						that.bleNotifyRetried = true
						that.addlog('蓝牙回包超时，第二遍整包重发AT命令')
						that.sendATCommand(deviceId, serviceId, uuid, that.buildWifiAtCommand(), notifyuuid)
						return
					}
					that.addlog('蓝牙回包二次超时，WiFi设置失败')
					that.handleWifiSetFail()
				}, 20000)
			},
			notifyBLECharacteristicValueChange(deviceId, serviceId, uuid, notifyuuid) {
				let that = this
				uni.notifyBLECharacteristicValueChange({
					state: true,
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: notifyuuid,
					success: (notifyres) => {
						that.bleNotifySubscribed = true
						that.addlog('notifyBLECharacteristicValueChange success', notifyres)
						that.armBleNotifyTimer(deviceId, serviceId, uuid, notifyuuid)
						that.onBLEValue(deviceId, serviceId, uuid, notifyuuid)
					},
					fail: (notifyerr) => {
						that.bleNotifySubscribed = true
						that.addlog('notifyBLECharacteristicValueChange notifyerr', notifyerr)
						that.clearBleNotifyTimer()
						// 写前已开过 notify 时，这里失败仍继续等回包
						that.armBleNotifyTimer(deviceId, serviceId, uuid, notifyuuid)
						that.onBLEValue(deviceId, serviceId, uuid, notifyuuid)
					}
				})
			},
			clearBleNotifyResumeTimer() {
				if (this.bleNotifyResumeTimer) {
					clearTimeout(this.bleNotifyResumeTimer)
					this.bleNotifyResumeTimer = null
				}
			},
			isWaitingForWifi(attemptId) {
				return attemptId === this.wifiAttemptId && !this.WIFITYPE && !this.bleValueHandled
			},
			isWifiAttemptActive(attemptId) {
				return attemptId === this.wifiAttemptId && !this.WIFITYPE
			},
			clearWifiTimers() {
				this.clearBleWriteTimer()
				this.clearBleNotifyTimer()
				this.clearBleNotifyResumeTimer()
				this.clearWlanDisconnectWaitTimer()
				if (this._wifiFailNavTimer) {
					clearTimeout(this._wifiFailNavTimer)
					this._wifiFailNavTimer = null
				}
			},
			armBleDisconnectTimer() {
				const that = this
				const attemptId = that.wifiAttemptId
				if (that.wlanDisconnectWaitTimer || that.bleValueHandled || that.WIFITYPE) return
				that.clearBleNotifyTimer()
				that.addlog('等待GOT_IP')
				that.wlanDisconnectWaitTimer = setTimeout(() => {
					that.wlanDisconnectWaitTimer = null
					if (!that.isWaitingForWifi(attemptId)) return
					that.addlog('30秒未收到GOT_IP，WiFi设置失败')
					that.handleWifiSetFail()
				}, 30000)
			},
			sendTimeThenFinish(deviceId, serviceId, uuid) {
				const that = this
				const buffertime = that.toArrayBuffer("74696d6540" + that.getTimeAllJSON().YMDHMSWIFI)
				that.addlog('4发送的时间数据:', "74696d6540" + that.getTimeAllJSON().YMDHMSWIFI)
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffertime,
					writeType: "write",
					success(res) {
						that.addlog('5发送的时间数据成功:', res)
						that.handleWifiSetSuccess(deviceId)
					},
					fail(errrore) {
						that.addlog('6发送的时间数据失败:', errrore)
						that.handleWifiSetFail()
					}
				})
			},
			onBLEValue(deviceId, serviceId, uuid, notifyuuid) {
				let that = this
				if (that.bleValueListening) {
					return
				}
				that.bleValueListening = true
				that.bleValueHandler = (res) => {
					const attemptId = that.wifiAttemptId
					that.addlog('蓝牙特征值变化事件:', that.ab2hex(res.value))
					if (that.normalizeBleId(res.deviceId) !== that.normalizeBleId(deviceId) ||
						that.normalizeBleId(res.characteristicId) !== that.normalizeBleId(notifyuuid) ||
						(res.serviceId && that.normalizeBleId(res.serviceId) !== that.normalizeBleId(serviceId)))
						return
					let hexData = that.ab2hex(res.value)
					let asciiString = that.hexToAscii(hexData)
					that.addlog('接收到蓝牙数据:', asciiString)
					if (!that.wifiAtSent) {
						if (/GOT_IP|WLAN_|OK|ERROR|SCAN_NO_AP/i.test(asciiString)) {
							that.blePendingWifiText = asciiString
							that.addlog('写入完成前先缓存回包', asciiString)
						}
						return
					}
					if (!that.isWaitingForWifi(attemptId)) return
					that.applyWifiNotifyText(asciiString, deviceId, serviceId, uuid, attemptId)
				}
				uni.onBLECharacteristicValueChange(that.bleValueHandler)
				that.addlog('蓝牙回包监听已注册')
			},
			applyWifiNotifyText(asciiString, deviceId, serviceId, uuid, attemptId) {
				const that = this
				if (!that.isWaitingForWifi(attemptId)) return
					const isTimeEcho = /time@/i.test(asciiString)
					const hasGotIp = asciiString.includes('GOT_IP')
					const hasConnected = asciiString.includes('WLAN_CONNECTED')
					const hasDisconnected = asciiString.includes('WLAN_DISCONNECTED') && !hasConnected
					if (hasGotIp) {
						that.bleValueHandled = true
						that.clearWifiTimers()
						uni.hideLoading()
						that.addlog('3接收到蓝牙数据:', asciiString)
						that.addlog('已获得IP，立即关闭连接加载提示')
						that.bleNotifyResumeTimer = setTimeout(() => {
							that.bleNotifyResumeTimer = null
							if (that.isWifiAttemptActive(attemptId)) that.sendTimeThenFinish(deviceId,
								serviceId, uuid)
						}, 500)
						return
					}
					if (asciiString.includes('SCAN_NO_AP') ||
						(/\bERROR\b/i.test(asciiString) && !isTimeEcho && !hasGotIp && !hasConnected)) {
						that.addlog('2接收到蓝牙数据:', asciiString)
						that.handleWifiSetFail()
						return
					}
					if (hasDisconnected) {
						that.armBleDisconnectTimer()
						return
					}
					if (hasConnected && !hasGotIp) {
						that.addlog('收到WLAN_CONNECTED，等待GOT_IP')
						that.armBleDisconnectTimer()
						return
					}
					if (/\bOK\b/i.test(asciiString)) {
						that.addlog('收到OK，继续等待GOT_IP')
					}
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
			bufferToHex(buffer) {
				let bytes = null
				if (!buffer) {
					return ''
				}
				if (buffer instanceof ArrayBuffer) {
					bytes = new Uint8Array(buffer)
				} else if (ArrayBuffer.isView(buffer)) {
					bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
				} else if (typeof buffer === 'string' && typeof uni.base64ToArrayBuffer === 'function') {
					try {
						bytes = new Uint8Array(uni.base64ToArrayBuffer(buffer))
					} catch (e) {
						bytes = null
					}
				}
				if (!bytes) {
					return ''
				}
				return Array.prototype.map.call(bytes, function(bit) {
					return ('00' + bit.toString(16)).slice(-2)
				}).join('')
			},
			ab2hex(buffer) {
				return this.bufferToHex(buffer)
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
				const lower = name.toLowerCase()
				if (!name || lower === '<unknown ssid>' || name === 'Wi-Fi' || name === 'WLAN') {
					return
				}
				// 系统无法读取 WiFi 密码，仅回填当前已连接的 WiFi 名；密码由用户正常输入
				// 输入框已有内容时不覆盖，避免影响用户手动修改
				if (!this.wifi_name) {
					this.wifi_name = name
				}
			},
			fetchDeviceConnectedWifi() {
				const that = this
				// uni-wifi 已内部处理定位权限与 NEHotspotNetwork，无需再 getLocation（会很慢并弹出“搜索中...”）
				const fetchConnectedWifi = (retryCount) => {
					uni.getConnectedWifi({
						partialInfo: true,
						success(resd) {
							const ssid = resd.wifi && resd.wifi.SSID
							if (ssid) {
								that.applyConnectedWifi(ssid)
								return
							}
							if (retryCount < 1) {
								setTimeout(() => fetchConnectedWifi(retryCount + 1), 300)
								return
							}
							that.applyConnectedWifi(that.getConnectedSSIDNative())
						},
						fail(err) {
							console.log('getConnectedWifi fail', err)
							if (retryCount < 1) {
								setTimeout(() => fetchConnectedWifi(retryCount + 1), 300)
								return
							}
							that.applyConnectedWifi(that.getConnectedSSIDNative())
						}
					})
				}
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
			},
			prepareIOSWifiAccess(callback) {
				// 保留方法兼容，已不再阻塞获取 WiFi 名
				callback && callback()
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
							callback && callback()
						}
					},
					() => {
						uni.showToast({
							title: this.$t('您的手机定位服务未开启'),
							icon: 'none'
						})
						callback && callback()
					}
				)
			},
			writeBleCommand(deviceId, serviceId, uuid, text, done) {
				const buffer = new ArrayBuffer(text.length)
				const dataView = new DataView(buffer)
				for (let i = 0; i < text.length; i++) {
					dataView.setUint8(i, text.charCodeAt(i))
				}
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					writeType: 'write',
					complete: () => {
						if (typeof done === 'function') done()
					}
				})
			},
			sendWifiAfterFailedAttempt(senddata) {
				const that = this
				const sendWifi = () => {
					that.sendATCommand(that.deviceId, that.serviceId, that.uuid, senddata, that.notifyuuid)
				}
				if (!that.wifiRetryAfterFail) {
					sendWifi()
					return
				}
				that.wifiRetryAfterFail = false
				that.ignoreStaStopDisconnect = true
				that.addlog('上次WiFi设置失败，先停止STA再重新设置')
				that.writeBleCommand(that.deviceId, that.serviceId, that.uuid, 'AT+QSTASTOP', () => {
					setTimeout(sendWifi, 500)
				})
			},
			btn_start() {
				let that = this
				if (that.wifi_name == that.$t("请选择wifi") || !that.wifi_name) {
					uni.showToast({
						title: that.$t("请选择或者输入一个wifi"),
						icon: 'none'
					})
					return
					// } else if (!that.wifi_password) {
					// 	uni.showToast({
					// 		title: that.$t("请输入wifi密码"),
					// 		icon: 'none'
					// 	})
					// 	return
				} else {
					that.WIFITYPE = false
					that.bleNotifyRetried = false
					that.bleValueHandled = false
					that.wifiAtSent = false
					that.blePendingWifiText = ''
					that.wifiAttemptId = (that.wifiAttemptId || 0) + 1
					that.clearBleWriteTimer()
					that.clearBleNotifyTimer()
					that.clearBleNotifyResumeTimer()
					that.clearWlanDisconnectWaitTimer()
					const senddata = that.buildWifiAtCommand()
					const doSend = () => {
						that.sendATCommand(that.deviceId, that.serviceId, that.uuid, senddata, that.notifyuuid)
					}
					if (that.fromManage) {
						uni.showLoading({
							title: that.$t('连接中'),
							mask: true
						})
						const run = async () => {
							const opened = await that.openBluetoothAdapterAsync()
							if (!opened) throw new Error('openBluetoothAdapter fail')
							const bleId = await that.resolveManageBleDeviceId(that.deviceId)
							if (!bleId) throw new Error('no ble deviceId')
							that.deviceId = bleId
							await that.ensureManageBleSession(bleId)
							const target = await that.resolveBleWriteTarget(bleId)
							if (!target || !target.uuid || !target.serviceId) {
								throw new Error('resolveBleWriteTarget empty')
							}
							that.serviceId = target.serviceId
							that.uuid = target.uuid
							that.notifyuuid = target.notifyuuid || that.notifyuuid || ''
							that.preferredWriteType = target.writeTypeHint || 'write'
							uni.hideLoading()
							that.sendWifiAfterFailedAttempt(senddata)
						}
						run().catch((err) => {
							that.addlog('fromManage 连接或发现失败', err)
							uni.hideLoading()
							that.handleWifiSetFail()
						})
						return
					}
					doSend()
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




	.bp-log-panel {
		margin: 10px 10px 20px;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 8px;
		overflow: hidden;
	}

	.bp-log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		border-bottom: 1px solid #eee;
	}

	.bp-log-title {
		font-size: 12px;
		color: #333;
		font-weight: 500;
	}

	.bp-log-header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.bp-log-copy-btn {
		font-size: 12px;
		color: #3298F7;
	}

	.bp-log-clear-btn {
		font-size: 12px;
		color: #F55A5A;
	}

	.bp-log-content {
		max-height: 280px;
	}

	.bp-log-text {
		font-size: 10px;
		color: #666;
		line-height: 2.0;
		word-break: break-all;
		white-space: pre-wrap;
	}
</style>