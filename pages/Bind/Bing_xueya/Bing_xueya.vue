<template>
	<view style="display: flex; color: black;height: 100vh;">
		<view style="display: flex; justify-self: center;flex-direction: column;">
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
			<view class="shebeistyle">
				<image style="width: 280px;" :src="SELECT_TYPE === '0' ? imagess:imagess1" />
			</view>
			<view style="margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">
				{{SELECT_TYPE === '0' ? $t('将血压计开机'):$t('将体脂秤开机')}}
			</view>
			<view style="width: auto; margin: 20px 20px 0 20px; font-size: 16px; font-weight: 400;">{{$t('在待机状态下')}}
			</view>
			<view style="flex-direction: row; display: flex; margin-top: 100rpx; justify-content: center;">
				<checkbox style="font-size: 28rpx; margin-right:10px;" color="#ffffff" class="round"
					activeBackgroundColor="#3298F7" active-border-color="#D5D5D5" :checked="cb" @click="checked">
					{{$t('准备就绪')}}
				</checkbox>
			</view>
			<button class="btn" plain="true" :style="getback(cb)" :disabled="zkConnecting"
				@click="btn_next()">{{$t(zkConnecting ? '连接中' : '下一步')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cb: false,
				SELECT_TYPE: '',
				sn: '',
				imagess: '../../../static/image/2.png',
				imagess1: '../../../static/image/5.png',
				modelId: '',
				modelname: '',
				fromManage: false,
				deviceId: '',
				bleSession: 0,
				bleAttempt: 0,
				blePhase: 'idle',
				bleScanTimer: null,
				zkConnecting: false,


				bpDebugLogs: [], //日志
				logTick: 0,
				logScrollTop: 0,

			}
		},

		computed: {
			bpLogText() {
				return this.bpDebugLogs.map(log => `[${log.time}] ${log.text}`).join('\n');
			},
		},

		onLoad(opt) {
			this.sn = opt.sn || ''
			this.modelId = opt.modelId || ''
			try {
				this.modelname = opt.modelname ? decodeURIComponent(opt.modelname) : ''
			} catch (e) {
				this.modelname = opt.modelname || ''
			}
			this.SELECT_TYPE = opt.SELECT_TYPE || '0'
			this.fromManage = opt.fromManage === '1' || opt.fromManage === 1
			this.deviceId = opt.deviceId ? decodeURIComponent(opt.deviceId) : (opt.mac || '')
		},

		onUnload() {
			this.stopZk872Ble()
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.fromManage ? this.$t('为设备连接WiFi') : this.$t('绑定设备')
			})
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


			getback(id) {
				return {
					background: id === false ? "#DBDBDB" : "#3298F7"
				}
			},


			checked() {
				if (this.cb == true) {
					this.cb = false
				} else {
					this.cb = true
				}
			},

			btn_next() {
				if (this.zkConnecting) return
				if (this.cb == false) {
					uni.showToast({
						title: this.$t("是否准备就绪"),
						icon: 'none'
					})
					return
				}
				this.addlog("准备开始连接")
				if (this.isZk872WifiModel()) {
					this.zkConnecting = true
					this.startZk872AutoConnect()
					return
				}
				if (this.fromManage) {
					this.goWifiSettingFromManage()
					return
				}
				uni.navigateTo({
					url: '../Bing_xueya/lanya_wifi?sn=' + this.sn + "&SELECT_TYPE=" + this.SELECT_TYPE +
						"&modelId=" + this.modelId
				})
			},
			isZk872WifiModel() {
				const id = String(this.modelId || '').trim()
				if (id === '10005' || id === '10006') return true
				const name = String(this.modelname || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
				return name.indexOf('ZKB872') >= 0 || name.indexOf('ZK872') >= 0
			},
			looseBleId(id) {
				return String(id || '').trim().toUpperCase().replace(/[:\-]/g, '')
			},
			isZk872BleName(name) {
				const n = String(name || '').trim().toUpperCase()
				if (!n) return false
				const aliases = ['ZK-B872B', 'ZK-B872', 'ZK-872', 'ZK872B', 'ZK872']
				for (let i = 0; i < aliases.length; i++) {
					if (n.indexOf(aliases[i]) >= 0) return true
				}
				return false
			},
			startZk872AutoConnect() {
				this.stopZk872Ble()
				this.zkConnecting = true
				this.bleAttempt = 0
				this.runZk872Attempt(this.bleSession)
			},
			stopZk872Ble() {
				this.zkConnecting = false
				this.bleSession += 1
				this.blePhase = 'idle'
				if (this.bleScanTimer) {
					clearTimeout(this.bleScanTimer)
					this.bleScanTimer = null
				}
				try {
					uni.stopBluetoothDevicesDiscovery()
				} catch (e) {}
				try {
					uni.offBluetoothDeviceFound()
				} catch (e) {}
				uni.hideLoading()
			},
			runZk872Attempt(session) {
				const that = this
				if (session !== that.bleSession) return
				that.bleAttempt += 1
				that.blePhase = 'scan'
				that.zkConnecting = true
				uni.showLoading({
					title: that.$t(that.bleAttempt === 1 ? '连接中' : 'ZK872正在重试连接'),
					mask: true
				})
				uni.openBluetoothAdapter({
					success: () => {
						if (session !== that.bleSession) return
						// 手机已经连着时设备不再广播。每次尝试都先复用系统连接，再搜索。
						that.useConnectedZk872(session, (used) => {
							if (session !== that.bleSession || used) return
							that.scanZk872(session)
						})
					},
					fail: (err) => {
						if (session !== that.bleSession) return
						uni.hideLoading()
						that.blePhase = 'idle'
						that.zkConnecting = false
						if (err && err.errCode === 10001) {
							uni.showModal({
								content: that.$t('当前蓝牙未开启是否去设置打开'),
								showCancel: false,
								success: (modalres) => {
									if (modalres.confirm) {
										that.openPhoneBluetooth()
									}
								}
							})
							return
						}
						that.failZk872Attempt(session)
					}
				})
			},
			useConnectedZk872(session, done) {
				const that = this
				const ids = []
				const names = {}
				const systemConnected = {}
				const push = (id, name) => {
					const value = String(id || '').trim()
					if (!value || ids.indexOf(value) >= 0) return
					if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(value)) return
					ids.push(value)
					if (name) names[value] = name
				}
				that.zk872LinkIds().forEach((id) => push(id, ''))
				try {
					const list = uni.getStorageSync('listdadsa') || []
					if (Array.isArray(list)) {
						list.forEach((item) => {
							if (!item || !item.deviceId) return
							if (that.isZk872BleName(item.name || item.localName)) {
								push(item.deviceId, item.name || item.localName)
							}
						})
					}
				} catch (e) {}
				const markSystemConnected = (id) => {
					const key = String(id || '').toUpperCase()
					if (key) systemConnected[key] = true
				}
				const acceptConnected = (devices, serviceOnly) => {
					;(devices || []).forEach((item) => {
						if (!item || !item.deviceId) return
						const name = item.name || item.localName || ''
						const known = ids.indexOf(item.deviceId) >= 0
						if (serviceOnly || known || that.isZk872BleName(name)) {
							push(item.deviceId, name)
							markSystemConnected(item.deviceId)
						}
					})
				}
				const useExistingLink = (deviceId) => {
					if (session !== that.bleSession) return
					// 手机已连上：不要再 createBLEConnection，避免超时后又把现有链路关掉
					that.addlog('手机已连接，直接使用', deviceId, names[deviceId] || '')
					that.blePhase = 'connect'
					that.afterZk872Connected({
						deviceId: deviceId,
						name: names[deviceId] || 'ZK-B872'
					}, session)
					done(true)
				}
				const probe = (index) => {
					if (session !== that.bleSession) return
					if (index >= ids.length) {
						that.addlog('系统未返回可复用的已连接设备')
						done(false)
						return
					}
					const deviceId = ids[index]
					const phoneAlreadyConnected = !!systemConnected[String(deviceId).toUpperCase()]
					uni.getBLEDeviceServices({
						deviceId: deviceId,
						success: (res) => {
							if (session !== that.bleSession) return
							if (res && res.services && res.services.length) {
								useExistingLink(deviceId)
								return
							}
							if (phoneAlreadyConnected) {
								that.connectZk872({
									deviceId: deviceId,
									name: names[deviceId] || 'ZK-B872'
								}, session)
								done(true)
								return
							}
							probe(index + 1)
						},
						fail: () => {
							if (session !== that.bleSession) return
							if (phoneAlreadyConnected) {
								that.connectZk872({
									deviceId: deviceId,
									name: names[deviceId] || 'ZK-B872'
								}, session)
								done(true)
								return
							}
							probe(index + 1)
						}
					})
				}
				let pending = 3
				const stepDone = () => {
					pending -= 1
					if (pending <= 0) probe(0)
				}
				uni.getConnectedBluetoothDevices({
					services: ['0000FFFF-0000-1000-8000-00805F9B34FB'],
					success: (res) => {
						const devices = (res && res.devices) || []
						that.addlog('系统已连接蓝牙', devices.map((item) => ({
							deviceId: item && item.deviceId,
							name: (item && (item.name || item.localName)) || ''
						})))
						acceptConnected(devices, true)
					},
					complete: stepDone
				})
				uni.getConnectedBluetoothDevices({
					success: (res) => {
						const devices = (res && res.devices) || []
						that.addlog('系统已连接蓝牙(不限服务)', devices.map((item) => ({
							deviceId: item && item.deviceId,
							name: (item && (item.name || item.localName)) || ''
						})))
						acceptConnected(devices, false)
					},
					complete: stepDone
				})
				uni.getBluetoothDevices({
					success: (res) => {
						const hit = that.pickZk872Device((res && res.devices) || [])
						if (hit) {
							that.addlog('缓存中有目标设备', hit.deviceId, hit.name || hit.localName || '')
							push(hit.deviceId, hit.name || hit.localName || '')
							markSystemConnected(hit.deviceId)
						}
					},
					complete: stepDone
				})
			},
			pickZk872Device(devices) {
				const known = {}
				this.zk872LinkIds().forEach((id) => {
					known[this.looseBleId(id)] = true
				})
				const list = devices || []
				let best = null
				for (let i = 0; i < list.length; i++) {
					const item = list[i]
					if (!item || !item.deviceId) continue
					const name = (item.name || item.localName) || ''
					const byName = this.isZk872BleName(name)
					const byId = !!known[this.looseBleId(item.deviceId)]
					if (!byName && !byId) continue
					const hit = (byName || name) ? item : Object.assign({}, item, {
						name: 'ZK-B872',
						localName: 'ZK-B872'
					})
					if (!best || Number(hit.RSSI || -999) > Number(best.RSSI || -999)) {
						best = hit
					}
				}
				return best
			},
			scanZk872(session) {
				const that = this
				const seen = {}
				const tryPick = () => {
					if (session !== that.bleSession || that.blePhase !== 'scan') return
					const fresh = []
					for (const id in seen) fresh.push(seen[id])
					const hit = that.pickZk872Device(fresh)
					if (hit) that.connectZk872(hit, session)
				}
				uni.onBluetoothDeviceFound((res) => {
					that.addlog("发现蓝牙设备", res)
					const list = (res && res.devices) || []
					for (let i = 0; i < list.length; i++) {
						const item = list[i]
						if (!item || !item.deviceId) continue
						const prev = seen[item.deviceId]
						if (prev && !(item.name || item.localName) && (prev.name || prev.localName)) {
							seen[item.deviceId] = Object.assign({}, item, {
								name: prev.name,
								localName: prev.localName
							})
						} else {
							seen[item.deviceId] = item
						}
					}
					tryPick()
				})
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: true,
					success: () => {
						if (session !== that.bleSession) return
						let elapsed = 0
						const tick = () => {
							if (session !== that.bleSession || that.blePhase !== 'scan') return
							elapsed += 1000
							if (elapsed >= 15000) {
								that.bleScanTimer = null
								that.failZk872Attempt(session)
								return
							}
							that.pollZk872Connected(session)
							that.bleScanTimer = setTimeout(tick, 1000)
						}
						that.pollZk872Connected(session)
						that.bleScanTimer = setTimeout(tick, 1000)
					},
					fail: () => {
						if (session !== that.bleSession) return
						that.failZk872Attempt(session)
					}
				})
			},
			pollZk872Connected(session) {
				const that = this
				if (session !== that.bleSession || that.blePhase !== 'scan') return
				const take = (devices, serviceOnly) => {
					const list = devices || []
					for (let i = 0; i < list.length; i++) {
						const item = list[i]
						if (!item || !item.deviceId) continue
						const name = item.name || item.localName || ''
						if (serviceOnly || that.isZk872BleName(name)) return item
					}
					return null
				}
				uni.getConnectedBluetoothDevices({
					services: ['0000FFFF-0000-1000-8000-00805F9B34FB'],
					success: (res) => {
						if (session !== that.bleSession || that.blePhase !== 'scan') return
						const item = take((res && res.devices) || [], true)
						if (!item) return
						that.addlog('扫描中发现手机已连接', item.deviceId, item.name || item.localName || '')
						that.attachConnectedZk872(item, session)
					}
				})
			},
			attachConnectedZk872(item, session) {
				const that = this
				if (session !== that.bleSession || that.blePhase !== 'scan' || !item || !item.deviceId) return
				that.blePhase = 'connect'
				if (that.bleScanTimer) {
					clearTimeout(that.bleScanTimer)
					that.bleScanTimer = null
				}
				try {
					uni.stopBluetoothDevicesDiscovery()
				} catch (e) {}
				try {
					uni.offBluetoothDeviceFound()
				} catch (e) {}
				that.addlog('手机已连接，直接使用', item.deviceId, item.name || item.localName || '')
				that.afterZk872Connected({
					deviceId: item.deviceId,
					name: item.name || item.localName || 'ZK-B872'
				}, session)
			},
			connectZk872(item, session) {
				const that = this
				if (session !== that.bleSession || that.blePhase !== 'scan') return
				that.blePhase = 'connect'
				if (that.bleScanTimer) {
					clearTimeout(that.bleScanTimer)
					that.bleScanTimer = null
				}
				try {
					uni.stopBluetoothDevicesDiscovery()
				} catch (e) {}
				try {
					uni.offBluetoothDeviceFound()
				} catch (e) {}
				const deviceId = item.deviceId
				uni.showLoading({
					title: that.$t('连接中'),
					mask: true
				})
				that.addlog("连接中", that.blePhase)
				uni.createBLEConnection({
					deviceId: deviceId,
					timeout: 10000,
					success: (suc) => {
						that.addlog('createBLEConnection success', suc)
						if (session !== that.bleSession) return
						that.afterZk872Connected(item, session)
					},
					fail: (err) => {
						that.addlog('createBLEConnection fail', err)
						if (session !== that.bleSession) return
						const msg = String((err && err.errMsg) || '')
						const code = err && err.errCode
						if (code === -1 || /already|connected/i.test(msg)) {
							that.afterZk872Connected(item, session)
							return
						}
						try {
							uni.closeBLEConnection({
								deviceId: deviceId
							})
						} catch (e) {}
						that.failZk872Attempt(session)
					}
				})
			},
			afterZk872Connected(item, session) {
				const that = this
				that.rememberZk872Device(item)
				setTimeout(() => {
					if (session !== that.bleSession) return
					uni.setBLEMTU({
						deviceId: item.deviceId,
						mtu: 512,
						complete: () => {}
					})
					that.discoverZk872Channels(item.deviceId, (ok, info) => {
						if (session !== that.bleSession) return
						if (!ok || !info || !info.uuid || !info.serviceId) {
							that.failZk872Attempt(session)
							return
						}
						that.goZk872WifiPage(info, session)
					})
				}, 2000)
			},
			discoverZk872Channels(deviceId, callback) {
				const that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						const services = (res && res.services) || []
						const serviceId = services[0] && services[0].uuid
						if (!serviceId) {
							callback && callback(false)
							return
						}
						uni.getBLEDeviceCharacteristics({
							deviceId: deviceId,
							serviceId: serviceId,
							success: (charRes) => {
								const list = (charRes && charRes.characteristics) || []
								let uuid = ''
								let notifyuuid = ''
								for (let i = 0; i < list.length; i++) {
									const item = list[i]
									const props = item.properties || {}
									if (props.write || props.writeNoResponse) uuid = item.uuid
									if (props.notify || props.indicate) notifyuuid = item.uuid
								}
								if (uuid) {
									callback && callback(true, {
										deviceId: deviceId,
										serviceId: serviceId,
										uuid: uuid,
										notifyuuid: notifyuuid || uuid
									})
									return
								}
								that.resolveWifiBleChannels(deviceId, callback)
							},
							fail: () => {
								that.resolveWifiBleChannels(deviceId, callback)
							}
						})
					},
					fail: () => {
						callback && callback(false)
					}
				})
			},
			rememberZk872Device(item) {
				try {
					if (item && item.deviceId) {
						uni.setStorageSync('zk872LastBleDeviceId', item.deviceId)
					}
					let list = uni.getStorageSync('listdadsa') || []
					if (!Array.isArray(list)) list = []
					list.push(item)
					const unique = list.filter((it, index, self) => {
						return self.findIndex(t => t && it && t.deviceId === it.deviceId) === index
					})
					uni.setStorageSync('listdadsa', unique)
				} catch (e) {}
			},
			goZk872WifiPage(info, session) {
				if (session !== this.bleSession) return
				this.blePhase = 'done'
				this.zkConnecting = false
				uni.hideLoading()
				let url = '../../Bind/Bing_xueya/Bing_xueya_2?deviceId=' + encodeURIComponent(info.deviceId) +
					'&serviceId=' + encodeURIComponent(info.serviceId || '') +
					'&uuid=' + encodeURIComponent(info.uuid || '') +
					'&sn=' + encodeURIComponent(this.sn || '') +
					'&SELECT_TYPE=' + encodeURIComponent(this.SELECT_TYPE || '0') +
					'&modelId=' + encodeURIComponent(this.modelId || '') +
					'&notifyuuid=' + encodeURIComponent(info.notifyuuid || '')
				if (this.fromManage) {
					url += '&fromManage=1'
				}
				uni.navigateTo({
					url: url
				})
			},
			zk872LinkIds() {
				const ids = []
				const push = (id) => {
					const value = String(id || '').trim()
					if (!value || ids.indexOf(value) >= 0) return
					if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(value)) return
					ids.push(value)
				}
				try {
					push(uni.getStorageSync('zk872LastBleDeviceId'))
				} catch (e) {}
				push(this.deviceId)
				try {
					const list = uni.getStorageSync('listdadsa') || []
					if (Array.isArray(list)) {
						list.forEach((item) => {
							if (!item || !item.deviceId) return
							if (this.isZk872BleName(item.name || item.localName)) push(item.deviceId)
						})
					}
				} catch (e) {}
				return ids
			},
			disconnectZk872Links(done) {
				const that = this
				let finished = false
				let closed = false
				const finish = () => {
					if (finished) return
					finished = true
					if (done) done()
				}
				const ids = that.zk872LinkIds()
				const closeAll = () => {
					if (closed) return
					closed = true
					that.addlog('重试前断开蓝牙', ids)
					if (!ids.length) {
						finish()
						return
					}
					let left = ids.length
					const one = () => {
						left -= 1
						if (left <= 0) finish()
					}
					ids.forEach((deviceId) => {
						try {
							uni.closeBLEConnection({
								deviceId: deviceId,
								complete: one
							})
						} catch (e) {
							one()
						}
					})
				}
				setTimeout(closeAll, 1500)
				uni.getConnectedBluetoothDevices({
					services: ['0000FFFF-0000-1000-8000-00805F9B34FB'],
					success: (res) => {
						const devices = (res && res.devices) || []
						that.addlog('重试前系统已连接', devices.map((item) => ({
							deviceId: item && item.deviceId,
							name: (item && (item.name || item.localName)) || ''
						})))
						devices.forEach((item) => {
							if (!item || !item.deviceId) return
							const name = item.name || item.localName || ''
							if (name && !that.isZk872BleName(name)) return
							const value = String(item.deviceId).trim()
							if (value && ids.indexOf(value) < 0) ids.push(value)
						})
					},
					complete: closeAll
				})
			},
			failZk872Attempt(session) {
				const that = this
				if (session !== that.bleSession) return
				if (that.blePhase === 'done' || that.blePhase === 'retrying') return
				that.blePhase = 'retrying'
				if (that.bleScanTimer) {
					clearTimeout(that.bleScanTimer)
					that.bleScanTimer = null
				}
				try {
					uni.stopBluetoothDevicesDiscovery()
				} catch (e) {}
				try {
					uni.offBluetoothDeviceFound()
				} catch (e) {}
				if (that.bleAttempt < 2) {
					that.disconnectZk872Links(() => {
						setTimeout(() => {
							if (session !== that.bleSession) return
							that.runZk872Attempt(session)
						}, 600)
					})
					return
				}
				that.blePhase = 'idle'
				that.zkConnecting = false
				uni.hideLoading()
				uni.showModal({
					title: that.$t('提示'),
					content: that.$t('ZK872蓝牙连接失败提示'),
					showCancel: false
				})
			},
			openPhoneBluetooth() {
				const platform = uni.getSystemInfoSync().platform
				if (platform === 'android') {
					const main = plus.android.runtimeMainActivity()
					const Intent = plus.android.importClass('android.content.Intent')
					const mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS')
					main.startActivity(mIntent)
				} else if (platform === 'ios') {
					plus.runtime.launchApplication({
						action: 'App-Prefs:root=BLE'
					}, function() {})
				}
			},
			goWifiSettingFromManage() {
				const mac = this.deviceId || ''
				const sn = this.sn || ''
				const modelId = this.modelId || ''
				let bleId = mac
				try {
					const list = uni.getStorageSync('listdadsa') || []
					const loose = (id) => String(id || '').trim().toUpperCase().replace(/[:\-]/g, '')
					const macLoose = loose(mac)
					if (Array.isArray(list) && macLoose) {
						for (let i = 0; i < list.length; i++) {
							const id = list[i] && list[i].deviceId
							if (id && loose(id) === macLoose) {
								bleId = id
								break
							}
						}
					}
					if (bleId === mac && Array.isArray(list)) {
						const nameMap = {
							'10001': ['JL-BP68W'],
							'10002': ['JL-BP67W'],
							'10005': ['ZK-B872B', 'ZK-B872', 'ZK-872']
						}
						const names = nameMap[String(modelId)] || []
						const hits = []
						for (let i = 0; i < list.length; i++) {
							const item = list[i]
							const name = String((item && item.name) || '')
							for (let j = 0; j < names.length; j++) {
								if (name.indexOf(names[j]) >= 0) {
									hits.push(item.deviceId)
									break
								}
							}
						}
						const uniq = hits.filter((id, idx) => id && hits.indexOf(id) === idx)
						if (uniq.length === 1) bleId = uniq[0]
					}
				} catch (e) {}
				uni.navigateTo({
					url: './Bing_xueya_2?deviceId=' + encodeURIComponent(bleId || mac) +
						'&serviceId=' +
						'&uuid=' +
						'&notifyuuid=' +
						'&sn=' + encodeURIComponent(sn) +
						'&modelId=' + encodeURIComponent(modelId) +
						'&SELECT_TYPE=' + encodeURIComponent(this.SELECT_TYPE || '0') +
						'&fromManage=1'
				})
			},
			resolveWifiBleChannels(deviceId, callback) {
				const that = this
				uni.getBLEDeviceServices({
					deviceId: deviceId,
					success: (res) => {
						const services = (res && res.services) || []
						if (!services.length) {
							callback && callback(false)
							return
						}
						that.findWifiBleCharacteristics(deviceId, services, 0, callback)
					},
					fail: () => {
						callback && callback(false)
					}
				})
			},
			findWifiBleCharacteristics(deviceId, services, index, callback) {
				const that = this
				if (!services || index >= services.length) {
					callback && callback(false)
					return
				}
				const serviceId = services[index].uuid
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						const list = (res && res.characteristics) || []
						let writeUuid = ''
						let notifyUuid = ''
						for (let i = 0; i < list.length; i++) {
							const item = list[i]
							const props = item.properties || {}
							if (props.write || props.writeNoResponse) {
								writeUuid = item.uuid
							}
							if (props.notify || props.indicate) {
								notifyUuid = item.uuid
							}
						}
						if (writeUuid && notifyUuid) {
							callback && callback(true, {
								deviceId: deviceId,
								serviceId: serviceId,
								uuid: writeUuid,
								notifyuuid: notifyUuid
							})
							return
						}
						that.findWifiBleCharacteristics(deviceId, services, index + 1, callback)
					},
					fail: () => {
						that.findWifiBleCharacteristics(deviceId, services, index + 1, callback)
					}
				})
			},
		}
	}
</script>

<style>
	.shebeistyle {
		display: flex;
		width: auto;
		height: 301px;
		margin: 20px 20px 20px 20px;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 20px;
	}

	.btn {
		width: auto;
		height: 48px;
		font-size: 16px;
		font-weight: 400;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20px 20px 0 20px;
		border-radius: 30px;
		background: #3298F7;
		color: white !important;
		border: none !important;
	}

	.text {
		text-align: center;
		margin-top: 40rpx;
		color: #3298F7;
		font-size: 28rpx;
	}

	.popup_bg {
		background: white;
		margin: 30rpx;
		border-radius: 50rpx;
		padding: 40rpx;
	}

	.pupup_title {
		font-weight: bold;
		font-size: 38rpx;
		text-align: center;
		margin-top: 10rpx;
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