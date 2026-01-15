<template>
	<view class="box">
		<!-- <button type="primary" @tap="watcahupdate">{{$t("检测手表固件")}}</button> -->
		<button type="primary" @tap="scan">{{$t("扫描设备")}}</button>
		<button type="primary" @tap="handleConnectTap" :disabled="!dev">{{$t("连接设备")}}</button>
		<!-- <button type="primary" @tap="startOta" :disabled="!connected">{{$t("开始OTA升级")}}</button> -->
		<view class="progress_all" v-if="percent>=0&&percent!==100">
			<view style="color: red;">{{$t("手表更新提示")}}</view>
			<view class="progress">
				<view>{{$t("总进度")}}{{percent}}%</view>
			</view>
			<view class="progress">
				<progress :percent="percent" stroke-width="10" :show-info="false" activeColor="#10AEFF"
					style="width: 100%;" />
			</view>
			<!-- 滚动条显示区域 -->
			<view class="progress-bars">
				<view v-for="(bar, index) in bars" :key="index" class="progress-bar-item">
					<view class="partition-name">{{ getPartitionName(index) }}</view>
					<view class="progress-container">
						<progress :percent="bar.progress" stroke-width="6" activeColor="#10AEFF"
							backgroundColor="#EEEEEE" style="width: 100%;" />
						<view class="progress-text">
							<text>{{ bar.current }}/{{ bar.total }}</text>
							<text class="progress-percent">{{ bar.progress }}%</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else-if="percent===100">
			<button type="primary" @tap="endOta">{{$t("OTA升级已完成")}}</button>
		</view>

		<!-- <scroll-view class="log" scroll-y>
			<text v-for="(l,i) in logs" :key="i">log：{{l}}\n</text>
		</scroll-view> -->


	</view>
</template>
<script>
	const JUMP_SIZE = 40 * 1024; // 40K偏移量
	const HEAD_REQ = 0xD5;
	const HEAD_ACK = 0xD6;
	const VER = 0x01;
	const FUNC = {
		GET_DEVICE_INFO: 0x01,
		BLOCK_CHECK: 0x02,
		PARTITION: 0x03,
		CODE: 0x04,
		AUDIO: 0x05,
		FONT: 0x06,
		IMG: 0x07,
		PARAM: 0x08,
		DIAL: 0x09,
		TOTAL_CHECK: 0x0A,
		GET_MTU: 0x0B,
		SET_PACKET_SIZE: 0x0C,
		GET_FRAME_COUNT: 0x0D,
		REBOOT: 0x0E,
		GET_OTA_VER: 0x0F,
	};
	const BLOCK_SIZE = 4096;
	const OTA_SERVICE_UUID = '000018A8-0000-1000-8000-00805F9B34FB';
	const WRITE_CHAR_UUID = '00002AA9-0000-1000-8000-00805F9B34FB';
	const NOTIFY_CHAR_UUID = '00002AA8-0000-1000-8000-00805F9B34FB';

	export default {
		data() {
			return {

				logs: [],

				// 修改为包含更多信息的滚动条对象数组
				bars: [{
						name: this.$t("代码区"),
						total: 0,
						current: 0,
						progress: 0,
						active: false
					},
					{
						name: this.$t('音频文件区'),
						total: 0,
						current: 0,
						progress: 0,
						active: false
					},
					{
						name: this.$t('字库区'),
						total: 0,
						current: 0,
						progress: 0,
						active: false
					},
					{
						name: this.$t('图片区'),
						total: 0,
						current: 0,
						progress: 0,
						active: false
					},
					{
						name: this.$t('默认参数区'),
						total: 0,
						current: 0,
						progress: 0,
						active: false
					},
					{
						name: this.$t('表盘区'),
						total: 0,
						current: 0,
						progress: 0,
						active: false
					}
				],
				// 分区类型到滚动条索引的映射
				partitionTypeToBarIndex: {
					0x04: 0, // 代码区
					0x05: 1, // 音频文件区
					0x06: 2, // 字库区
					0x07: 3, // 图片区
					0x08: 4, // 默认参数区
					0x09: 5 // 表盘区
				},

				scanTimer: null, // 扫描超时计时器
				targetDeviceId: '',
				targetDeviceName: '',


				dev: null,
				connected: false,
				percent: -1,
				deviceId: '',
				serviceId: '',
				writeId: '',
				notifyId: '',
				otaVer: 'V1.0',
				mtu: 256,
				packetSize: 256,
				partition: [],
				fwData: {},
				ackResolvers: {},
				foundDevice: false,
				// OTA状态管理
				otaState: 'IDLE', // IDLE, CONNECTING, GETTING_INFO, UPGRADING, COMPLETE, ERROR
				currentPartitionIndex: 0,
				totalBytesToSend: 0,
				totalBytesSent: 0,
				// 设备信息存储
				deviceInfo: {
					timestamp: 0,
					version: '',
					projectName: ''
				},
				dataBuffer: null, // 用于缓存不完整的数据包
				bufferTimer: null, // 缓冲超时定时器
				// 新增：失败块管理
				failedBlocks: [],
				skip4KChecks: false,
				currentPartition: null,
				deviceIdss: uni.getStorageSync("landeviceId"),
				serviceIdss: uni.getStorageSync("lanserviceId"),
				characteristicIdss: uni.getStorageSync("landcharacteristicId"),
				updateIdChangedtimer: null,
				processedIds: new Set() // 使用Set存储已处理的ID
			};
		},


		onShow() {
			const plugin = uni.requireNativePlugin(
				"CBConnectPlugin-CBCModule");
			console.log("plugin", plugin)
			// 屏幕常亮
			plugin.setKeepScreenOn({
				on: true
			}, res => console.log("禁止熄屏", res)) // 禁止熄屏
		},
		onUnload() {
			const plugin = uni.requireNativePlugin(
				"CBConnectPlugin-CBCModule");
			console.log("plugin", plugin)
			plugin.setKeepScreenOn({
				on: false
			}, res => console.log("恢复熄屏", res)) // 恢复熄屏
		},
		methods: {
			// log(...a) {
			// 	this.logs.unshift(`[${new Date().toLocaleTimeString()}] ${a.map(v => JSON.stringify(v)).join(' ')}`);
			// },

			watcahupdate() {
				let that = this
				uni.showLoading({
					title: that.$t("正在请求升级")
				})
				uni.getBLEDeviceCharacteristics({
					deviceId: that.deviceIdss,
					serviceId: that.serviceIdss,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.write) {
								const ackConfigByteset = new Uint8Array(9);
								ackConfigByteset[0] = 0xE0;
								ackConfigByteset[1] = 0x00;
								ackConfigByteset[2] = 0x06;
								ackConfigByteset[3] = 0x20;
								ackConfigByteset[4] = 0x01;
								ackConfigByteset[5] = 0x01;
								ackConfigByteset[6] = 0x00;
								ackConfigByteset[7] = 0x01;
								ackConfigByteset[8] = 0x00;
								let ackConfigBytesum2 = 0;
								for (let i = 0; i < ackConfigByteset.length; i++) {
									ackConfigBytesum2 += ackConfigByteset[i];
								}
								ackConfigBytesum2 = ackConfigBytesum2 % 256;
								const modifiedCommand2 = new Uint8Array(ackConfigByteset.length + 1);
								modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
								modifiedCommand2[3] = ackConfigBytesum2;
								modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
								const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte.toString(16)
									.padStart(2, '0')).join('');
								const buffer2 = that.toArrayBuffer(hexCommand2);
								console.log(hexCommand2)
								console.log(that.deviceIdss)
								console.log(that.serviceIdss)
								console.log(item.uuid)
								setTimeout(() => {
									uni.writeBLECharacteristicValue({
										deviceId: that.deviceIdss,
										serviceId: that.serviceIdss,
										characteristicId: item.uuid,
										writeType: 'write',
										value: buffer2,
										complete(complete) {
											uni.showToast({
												title: that.$t("正在请求升级"),
												icon: 'none'
											})
										}
									})
								}, 3000)
							}
						}
					},
					fail(res) {
						uni.hideLoading()
						uni.showToast({
							title: that.$t("请检查设备连接"),
							icon: 'none'
						})
					}
				})

			},

			/* ------------ 滚动条相关方法 ------------ */
			getPartitionName(index) {
				return this.bars[index].name;
			},
			// 初始化滚动条
			initProgressBars() {
				this.bars.forEach(bar => {
					bar.total = 0;
					bar.current = 0;
					bar.progress = 0;
					bar.active = false;
				});
			},
			// 设置分区滚动条的总块数
			setPartitionTotalBlocks(partitionType, totalBlocks) {
				const barIndex = this.partitionTypeToBarIndex[partitionType];
				if (barIndex !== undefined && barIndex < this.bars.length) {
					this.bars[barIndex].total = totalBlocks;
					this.bars[barIndex].active = true;
					// 强制更新视图
					this.$forceUpdate();
				}
			},
			// 更新分区滚动条进度
			updatePartitionProgress(partitionType, currentBlock) {
				const barIndex = this.partitionTypeToBarIndex[partitionType];
				if (barIndex !== undefined && barIndex < this.bars.length) {
					const bar = this.bars[barIndex];
					bar.current = currentBlock + 1; // 转换为1-based
					// 计算进度百分比
					if (bar.total > 0) {
						bar.progress = Math.min(Math.round((bar.current / bar.total) * 100), 100);
					}
					// 强制更新视图
					this.$forceUpdate();
				}
			},
			// 标记分区完成
			markPartitionComplete(partitionType) {
				const barIndex = this.partitionTypeToBarIndex[partitionType];
				if (barIndex !== undefined && barIndex < this.bars.length) {
					const bar = this.bars[barIndex];
					bar.current = bar.total;
					bar.progress = 100;
					// 可以添加完成标记
					bar.completed = true;
					this.$forceUpdate();
				}
			},
			// 标记分区失败
			markPartitionFailed(partitionType) {
				const barIndex = this.partitionTypeToBarIndex[partitionType];
				if (barIndex !== undefined && barIndex < this.bars.length) {
					this.bars[barIndex].failed = true;
					this.$forceUpdate();
				}
			},
			/* ------------ BLE ------------ */
			scan() {
				let that = this
				// 开始扫描前重置状态
				that.foundDevice = false;
				that.dev = null;
				uni.openBluetoothAdapter({
					success: () => {
						uni.startBluetoothDevicesDiscovery({
							success: () => {
								uni.showLoading({
									title: that.$t("连接中")
								});
								// 设置20秒超时
								that.scanTimer = setTimeout(() => {
									if (!that.foundDevice) {
										that.stopScan();
										uni.hideLoading();
										uni.showToast({
											title: that.$t("未找到设备"),
											icon: 'none',
											duration: 2000
										});
										console.log('扫描超时，未找到设备');
									}
								}, 20000); // 20秒
								uni.onBluetoothDeviceFound(that.onDeviceFound);
							},
							fail: e => console.log("开始扫描失败", e),
						});
					},
					fail: e => {
						if (e.errCode === 10001) {
							uni.showToast({
								title: that.$t("请打开手机蓝牙"),
								icon: 'none'
							});
						}
					},
				});
			},
			onDeviceFound(res) {
				// 在iOS中，设备列表可能在 res.devices 或直接是数组
				let deviceList = res.devices || res;
				if (!deviceList || deviceList.length === 0) return;
				const device = deviceList.find(d => {
					// iOS上设备名称可能在不同属性中
					const deviceName = d.name || d.localName || d.advertisement.localName;
					return deviceName && deviceName.includes('BPW1');
				});
				if (device && !this.foundDevice) {
					// 1. 清除超时计时器
					clearTimeout(this.scanTimer);
					this.scanTimer = null;
					// 1. 保存设备信息
					this.foundDevice = true;
					this.dev = device;
					uni.hideLoading();
					this.targetDeviceId = device.deviceId;
					this.targetDeviceName = device.name || device.localName || 'BPW1设备';
					// 2. 停止扫描
					this.stopScan();
					setTimeout(() => {
						console.log("设置自动连接设备")
						this.handleConnectTap();
					}, 1500)


				}
			},
			//停止扫描
			stopScan() {
				// 清除超时计时器
				if (this.scanTimer) {
					clearTimeout(this.scanTimer);
					this.scanTimer = null;
				}
				uni.stopBluetoothDevicesDiscovery();
			},
			connect(deviceId) {
				uni.showLoading({
					title: '连接中...'
				});
				uni.createBLEConnection({
					deviceId: deviceId,
					success: () => {
						this.deviceId = deviceId;
						setTimeout(() => {
							this.getBLEDeviceServices();
						}, 2000);
					},
					fail: (e) => {
						uni.hideLoading();
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						});
					},
				});
			},
			disconnect() {
				if (this.deviceId) {
					uni.closeBLEConnection({
						deviceId: this.deviceId
					});
					this.connected = false;
					this.otaState = 'IDLE';
				}
			},
			getBLEDeviceServices() {
				uni.getBLEDeviceServices({
					deviceId: this.deviceId,
					success: (res) => {
						// 修复：遍历所有服务，查找OTA服务
						const otaService = res.services.find(s => {
							const uuid = s.uuid.toUpperCase();
							return uuid === OTA_SERVICE_UUID ||
								uuid.includes('18A8') ||
								uuid.includes('18A8');
						});
						if (otaService) {
							this.serviceId = otaService.uuid;
							this.getCharacteristics();
						} else {
							uni.showToast({
								title: this.$t("设备不支持OTA或服务未找到"),
								icon: 'none'
							});
							// 尝试使用第一个服务（兼容旧代码）
							if (res.services.length > 0) {
								this.serviceId = res.services[0].uuid;
								this.getCharacteristics();
							}
						}
					},
					fail: (e) => {
						console.log('获取服务失败', e);
					},
				});
			},
			getCharacteristics() {
				uni.getBLEDeviceCharacteristics({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					success: (res) => {
						// 修复：精确查找特征值
						let writeChar = res.characteristics.find(c => {
							const uuid = c.uuid.toUpperCase();
							return uuid === WRITE_CHAR_UUID;
						});
						let notifyChar = res.characteristics.find(c => {
							const uuid = c.uuid.toUpperCase();
							return uuid === NOTIFY_CHAR_UUID;
						});
						// 如果没找到精确匹配，尝试找属性匹配的
						if (!writeChar) {
							writeChar = res.characteristics.find(c =>
								c.properties && (c.properties.write || c.properties.writeWithoutResponse)
							);
						}
						if (!notifyChar) {
							notifyChar = res.characteristics.find(c =>
								c.properties && c.properties.notify
							);
						}
						if (writeChar && notifyChar) {
							this.writeId = writeChar.uuid;
							this.notifyId = notifyChar.uuid;
							this.startNotify();
						} else {
							console.log('错误：未找到需要的特征值');
						}
					},
					fail: (e) => {
						console.log('获取特征值失败', e);
					},
				});
			},
			startNotify() {
				uni.notifyBLECharacteristicValueChange({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.notifyId,
					state: true,
					success: () => {
						uni.hideLoading();
						this.connected = true;
						// 监听数据
						uni.onBLECharacteristicValueChange((res) => {
							if (res.deviceId !== this.deviceId ||
								res.serviceId !== this.serviceId ||
								res.characteristicId !== this.notifyId) {
								return;
							}
							const hexStr = this.ab2hex(res.value);
							const byteLength = res.value.byteLength;
							console.log(`收到数据: 长度=${byteLength}字节, 数据=${hexStr}`);
							// 处理数据包（带缓冲）
							this.handleDataWithBuffer(new Uint8Array(res.value));
						});
						// 连接成功后等待用户点击开始OTA
						console.log('设备已连接，可以开始OTA');
						setTimeout(() => {
							console.log('1111设备已连接，可以开始OTA');
							this.startOta()
						}, 2000)
					},
					fail: (e) => {
						console.log('开启通知失败', e);
					},
				});
			},
			// 带缓冲的数据处理函数
			// 带缓冲的数据处理函数 - 修复版本
			handleDataWithBuffer(newData) {
				// 如果有缓存的旧数据，先合并
				let combinedData = newData;
				if (this.dataBuffer && this.dataBuffer.length > 0) {
					combinedData = new Uint8Array(this.dataBuffer.length + newData.length);
					combinedData.set(this.dataBuffer);
					combinedData.set(newData, this.dataBuffer.length);
				}
				// 清空缓冲区和定时器
				this.clearBuffer();
				// 尝试解析完整帧
				const result = this.tryParseFrame(combinedData);
				if (result.success) {
					// 解析成功，处理帧
					if (result.frameType === 'ACK') {
						this.handleAck(result.frame);
					} else if (result.frameType === 'CMD') {
						console.log(`📤 收到命令帧，暂不处理`);
					}

					// 如果还有剩余数据，递归处理
					if (result.remainingData && result.remainingData.length > 0) {
						console.log(`↪️ 还有 ${result.remainingData.length} 字节剩余数据，继续处理`);
						this.handleDataWithBuffer(result.remainingData);
					}
				} else {
					// 数据不完整，存入缓冲区
					// console.log(`⏳ 数据不完整，存入缓冲区: ${combinedData.length} 字节`);
					this.dataBuffer = combinedData;
					// 设置超时：如果100ms内没有收到后续数据，强制处理
					this.bufferTimer = setTimeout(() => {
						console.log(`⏰ 缓冲区超时，强制处理 ${this.dataBuffer.length} 字节数据`);
						// 尝试解析并处理
						try {
							const forceResult = this.tryParseFrame(this.dataBuffer);
							if (forceResult.success) {
								this.handleAck(forceResult.frame);
							} else {
								// 即使不完整也尝试处理
								this.handleAck(this.dataBuffer);
							}
						} catch (e) {
							console.error(`强制处理失败: ${e.message}`);
						}
						this.clearBuffer();
					}, 500); // 减少超时时间到100ms
				}
			},


			// 尝试解析数据帧
			tryParseFrame(data) {
				if (!data || data.length === 0) {
					return {
						success: false
					};
				}
				const startByte = data[0];
				// 处理ACK帧 (0xD6开头)
				if (startByte === 0xD6) {
					// ACK帧最小长度检查: 1+1+1+1+1+2+2 = 9字节
					if (data.length < 9) {
						return {
							success: false
						};
					}
					// 读取数据长度 (第7-8字节，大端序)
					const dataLength = (data[7] << 8) | data[8];
					// 计算完整ACK帧长度: 9字节头部 + 数据长度
					const fullFrameLength = 9 + dataLength;
					if (data.length >= fullFrameLength) {
						// 有足够数据，提取完整帧
						const frame = data.slice(0, fullFrameLength);
						const remainingData = data.slice(fullFrameLength);

						return {
							success: true,
							frame: frame,
							remainingData: remainingData,
							frameType: 'ACK'
						};
					} else {
						// 数据不够完整
						return {
							success: false
						};
					}
				}
				// 处理命令帧 (0xD5开头)
				else if (startByte === 0xD5) {
					// 命令帧最小长度检查: 1+1+1+1+2+1+2+2 = 11字节
					if (data.length < 11) {
						return {
							success: false
						};
					}
					// 读取数据长度 (第9-10字节，大端序)
					const dataLength = (data[9] << 8) | data[10];
					// 计算完整命令帧长度: 11字节头部 + 数据长度
					const fullFrameLength = 11 + dataLength;
					if (data.length >= fullFrameLength) {
						const frame = data.slice(0, fullFrameLength);
						const remainingData = data.slice(fullFrameLength);

						return {
							success: true,
							frame: frame,
							remainingData: remainingData,
							frameType: 'CMD'
						};
					} else {
						return {
							success: false
						};
					}
				}
				// 未知帧类型
				return {
					success: false
				};
			}, // 清空缓冲区
			clearBuffer() {
				if (this.bufferTimer) {
					clearTimeout(this.bufferTimer);
					this.bufferTimer = null;
				}
				this.dataBuffer = null;
			},
			async write(buf, retryCount = 5) { // 增加默认重试次数到5
				const hexStr = this.ab2hex(buf);
				const u8Array = new Uint8Array(buf);

				for (let i = 0; i < retryCount; i++) {
					try {
						await new Promise((resolve, reject) => {
							uni.writeBLECharacteristicValue({
								deviceId: this.deviceId,
								serviceId: this.serviceId,
								characteristicId: this.writeId,
								value: buf,
								complete(e) {
									// 检查是否是蓝牙断开错误
									if (e.errCode === 10012 || e.errMsg.includes('not connected')) {
										this.connected = false;
										reject(new Error('蓝牙连接已断开'));
									} else {
										setTimeout(() => {
											resolve();
										}, 20);
									}
								}
							});
						});
						return; // 成功则返回
					} catch (error) {
						if (i === retryCount - 1) throw error;
						await this.delay(1000); // 等待1秒后重试
					}
				}
			},
			delay(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			},
			// 构建命令帧
			buildFrame(func, idCode, pkgIdx, segIdx, data = new Uint8Array()) {
				// 协议帧结构: 起始符 + 功能 + 版本号 + 标识码 + 包序号 + 帧序号 + 校验位(占位) + 数据长度 + 数据
				const frame = new Uint8Array(11 + data.length);
				let offset = 0;
				// 前11个字节
				frame[offset++] = HEAD_REQ; // 起始符
				frame[offset++] = func; // 功能码
				frame[offset++] = VER; // 版本号
				frame[offset++] = idCode; // 标识码
				// 包序号（大端）：2字节
				frame[offset++] = (pkgIdx >> 8) & 0xFF; // 高字节
				frame[offset++] = pkgIdx & 0xFF; // 低字节
				frame[offset++] = segIdx; // 帧序号
				// 校验位占位（先填0，后面计算）
				frame[offset++] = 0x00; // 校验和高字节
				frame[offset++] = 0x00; // 校验和低字节
				// 数据长度（大端）：2字节
				frame[offset++] = (data.length >> 8) & 0xFF; // 高字节
				frame[offset++] = data.length & 0xFF; // 低字节
				// 拷贝数据
				if (data.length > 0) {
					frame.set(data, offset);
				}
				// 计算校验和（除了校验位字节之外的所有字节）
				let checksum = 0;
				for (let i = 0; i < frame.length; i++) {
					// 跳过校验位字节（索引7和8）
					if (i !== 7 && i !== 8) {
						checksum += frame[i];
					}
				}
				// 填充校验位（大端）
				frame[7] = (checksum >> 8) & 0xFF; // 高字节
				frame[8] = checksum & 0xFF; // 低字节
				return frame.buffer;
			},
			parseAckFrame(buffer) {
				if (!buffer || buffer.length < 9) { // ACK最小长度
					return null;
				}
				// 创建DataView以便处理大端序
				const dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
				let offset = 0;
				// 1. 检查起始符
				const startByte = dataView.getUint8(offset);
				offset += 1;
				if (startByte !== 0xD6) {
					console.log(`错误: 非ACK帧起始符 (收到: 0x${startByte.toString(16).toUpperCase()})`);
					return null;
				}
				// 2. 读取基础字段
				const funcCode = dataView.getUint8(offset);
				offset += 1;
				const version = dataView.getUint8(offset);
				offset += 1;
				const identifier = dataView.getUint8(offset);
				offset += 1;
				// 3. 帧序号 (1字节)
				const frameSeq = dataView.getUint8(offset);
				offset += 1;
				// 4. 校验和 (大端序，2字节)
				const checksum = dataView.getUint16(offset, false); // false = 大端序
				offset += 2;
				// 5. 数据长度 (大端序，2字节)
				const dataLength = dataView.getUint16(offset, false); // false = 大端序
				offset += 2;
				// 6. 验证数据长度
				if (offset + dataLength > buffer.byteLength) {
					console.log(`错误: 数据长度超过缓冲区 (需要: ${dataLength}, 实际: ${buffer.byteLength - offset})`);
					return null;
				}
				// 7. 提取数据部分
				const data = buffer.slice(offset, offset + dataLength);
				// 构建ACK对象
				const ack = {
					startByte,
					funcCode,
					version,
					identifier,
					frameSeq,
					checksum,
					dataLength,
					data,
					rawData: buffer
				};
				return ack;
			},
			handleConnectTap() {
				let that = this

				console.log(that.targetDeviceId)

				if (!that.targetDeviceId) {
					uni.showToast({
						title: '未找到设备ID',
						icon: 'none'
					});
					return;
				}
				// setTimeout(() => {
				// 此时才真正发起连接
				uni.createBLEConnection({
					deviceId: that.targetDeviceId,
					success: (successres) => {
						uni.hideLoading();
						uni.showToast({
							title: that.$t("成功"),
							icon: 'none'
						})
						that.deviceId = that.targetDeviceId; // 保存到正确的变量
						that.connected = true; // 更新连接状态
						// 连接成功后的后续操作，如获取服务
						setTimeout(() => {
							that.getBLEDeviceServices();
						}, 1000);
					},
					fail: (failerro) => {
						uni.hideLoading();
						console.error('连接失败回调:', failerro);
						uni.showToast({
							title: `连接失败: ${failerro.errCode || '未知错误'}`,
							icon: 'none'
						});
					}
				});
				// }, 3000)
			},
			/* ------------ OTA 业务逻辑 ------------ */
			async startOta() {
				try {
					uni.setStorageSync("BPWundate", 1)
					this.otaState = 'GETTING_INFO';
					this.percent = 0;
					// 初始化滚动条
					this.initProgressBars();
					// 2. 获取当前OTA系统版本
					await this.getOtaVersion();
					// 3. 获取设备信息
					await this.getDeviceInfo();
					// 4. 获取MTU
					await this.getMtu();
					// 5. 加载分区文件和固件数据
					await this.loadFiles();
					if (this.partition.length === 0) {
						throw new Error('没有找到分区信息');
					}
					// 6. 计算总数据量
					this.calculateTotalBytes();
					// 7. 下发分区表
					await this.sendPartitionTable();
					// 8. 按分区升级（只升级分区表中存在的分区）
					this.otaState = 'UPGRADING';
					for (let i = 0; i < this.partition.length; i++) {
						this.currentPartitionIndex = i;
						await this.upgradePartition(this.partition[i]);
					}
					// 9. 发送重启指令
					await this.sendRebootCommand();
					this.otaState = 'COMPLETE';
					this.percent = 100;
					console.log('OTA 升级完成!');
				} catch (error) {
					this.otaState = 'ERROR';
					console.log('OTA 流程出错:', error);
					uni.showToast({
						title: `OTA失败: ${error.message}`,
						icon: 'none'
					});
				}
			},
			endOta() {
				uni.switchTab({
					url: "/pages/tabBar/main/Main"
				})
			},
			calculateTotalBytes() {
				this.totalBytesToSend = 0;
				this.totalBytesSent = 0;
				for (const partition of this.partition) {
					this.totalBytesToSend += partition.len;
				}
				console.log(`总需发送数据: ${this.totalBytesToSend} 字节`);
			},
			/* ------------ 进度更新 ------------ */
			updateProgress(bytesSent) {
				this.totalBytesSent += bytesSent;
				if (this.totalBytesToSend > 0) {
					this.percent = Math.floor((this.totalBytesSent / this.totalBytesToSend) * 100);
				}
			},
			ab2hex(buffer) {
				const hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2);
					}
				);
				return hexArr.join(' ').toUpperCase();
			},
			async getDeviceInfo() {
				// 修复：使用正确的命令构建
				const frame = this.buildFrame(FUNC.GET_DEVICE_INFO, 0x01, 0, 0);
				console.log("获取设备信息", this.ab2hex(frame))
				// 发送前清空可能存在的旧解析器
				const key = `${FUNC.GET_DEVICE_INFO}-${0x01}`;
				if (this.ackResolvers[key]) {
					delete this.ackResolvers[key];
					console.log(`清理旧的设备信息解析器`);
				}
				await this.write(frame);
				return new Promise((resolve, reject) => {
					const timeout = setTimeout(() => {
						reject(new Error('获取设备信息超时'));
					}, 5000);
					this.waitForAck(FUNC.GET_DEVICE_INFO, 0x01)
						.then(ackData => {
							clearTimeout(timeout);
							if (ackData && ackData.data) {
								try {
									const deviceInfo = this.parseDeviceInfoAck(ackData);
									if (deviceInfo) {
										this.deviceInfo = deviceInfo;
									} else {
										console.log('设备信息解析失败，但ACK已收到');
									}
								} catch (error) {
									console.log(`设备信息解析异常: ${error.message}`);
								}
							}
							resolve();
						})
						.catch(error => {
							clearTimeout(timeout);
							console.log(`等待设备信息ACK失败: ${error.message}`);
							reject(error);
						});
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


			// async getOtaVersion() {
			//     const frame = this.buildFrame(FUNC.GET_OTA_VER, 0x01, 0, 0);
			//     console.log("获取OTA小系统版本", this.ab2hex(frame));
			//     this.log("获取OTA小系统版本", this.ab2hex(frame));

			//     await this.write(frame);

			//     return new Promise((resolve) => {
			//         const timeout = setTimeout(() => {
			//             console.log('系统两秒内没有回应，是 V1.0 版本');
			//             this.log('系统两秒内没有回应，是 V1.0 版本');
			//             this.otaVer = 'V1.0';
			//             resolve('V1.0');
			//         }, 2000);

			//         this.waitForAck(FUNC.GET_OTA_VER, 0x01).then(ackData => {
			//             clearTimeout(timeout);
			//             if (ackData && ackData.data && ackData.data.length > 0) {
			//                 const version = String.fromCharCode(...ackData.data);
			//                 this.otaVer = version;
			//                 console.log(`OTA版本: ${version}`);

			//                 // 如果有回应，判断是否是V1.1
			//                 // 这里需要根据实际响应内容来判断版本
			//                 // 假设响应中包含版本信息，我们可以这样处理：
			//                 if (version.includes('1.1') || version === '1.1') {
			//                     this.otaVer = 'V1.1';
			//                     console.log('检测到 V1.1 版本');
			//                 }
			//                 resolve(this.otaVer);
			//             } else {
			//                 // 有回应但没有数据，按V1.1处理
			//                 console.log('系统有回应但没有版本数据，按 V1.1 版本处理');
			//                 this.otaVer = 'V1.1';
			//                 resolve('V1.1');
			//             }
			//         }).catch(() => {
			//             clearTimeout(timeout);
			//             console.log('等待ACK出错，按 V1.0 版本处理');
			//             this.otaVer = 'V1.0';
			//             resolve('V1.0');
			//         });
			//     });
			// },

			async getOtaVersion() {
				const frame = this.buildFrame(FUNC.GET_OTA_VER, 0x01, 0, 0);
				console.log("获取OTA小系统版本", this.ab2hex(frame))
				await this.write(frame);
				return new Promise((resolve) => {
					const timeout = setTimeout(() => {
						console.log('如果系统两秒内没有回应就是 V1.0 版本');
						this.otaVer = 'V1.0';
						resolve();
					}, 2000);
					this.waitForAck(FUNC.GET_OTA_VER, 0x01).then(ackData => {
						clearTimeout(timeout);
						console.log("ackData", ackData)
						// if (ackData && ackData.data && ackData.data.length > 0) {
						// const version = String.fromCharCode(...ackData.data);
						this.otaVer = 'V1.1';
						console.log(`OTA版本: ${this.otaVer}`);
						// }
						resolve();
					}).catch(() => {
						clearTimeout(timeout);
						this.otaVer = 'V1.0';
						resolve();
					});
				});
			},

			async getMtu() {
				const frame = this.buildFrame(FUNC.GET_MTU, 0x01, 0, 0);
				await this.write(frame);
				return new Promise((resolve) => {
					this.waitForAck(FUNC.GET_MTU, 0x01).then(ackData => {
						if (ackData && ackData.data && ackData.data.length >= 2) {
							// 修复：大端解析
							this.mtu = (ackData.data[0] << 8) | ackData.data[1];
							// 设置包大小为MTU减去协议头长度(11字节)
							this.packetSize = Math.min(this.mtu - 11, BLOCK_SIZE);
							// 确保是512的倍数
							this.packetSize = Math.floor(this.packetSize / 512) * 512;
							if (this.packetSize < 512) this.packetSize = 256;
							console.log(`MTU: ${this.mtu}, 包大小: ${this.packetSize}`);
						}
						resolve();
					}).catch(() => {
						console.log('获取MTU失败，使用默认值512');
						this.mtu = 256;
						this.packetSize = 256;
						resolve();
					});
				});
			},
			async loadFiles() {
				this.partition = [];
				this.fwData = {};
				try {
					// 定义分区类型映射
					const partitionMap = {
						0x04: {
							name: '代码区',
							func: FUNC.CODE
						},
						0x05: {
							name: '音频文件区',
							func: FUNC.AUDIO
						},
						0x06: {
							name: '字库区',
							func: FUNC.FONT
						},
						0x07: {
							name: '图片区',
							func: FUNC.IMG
						},
						0x08: {
							name: '默认参数区',
							func: FUNC.PARAM
						},
						0x09: {
							name: '表盘区',
							func: FUNC.DIAL
						}
					};
					// 检查每个分区的txt文件
					const partitionTypes = [0x04, 0x05, 0x06, 0x07, 0x08, 0x09];
					for (const type of partitionTypes) {
						const hexType = type.toString(16).padStart(2, '0');
						const txtFileName = `static/OTA/0x${hexType}.txt`;
						try {
							// 尝试读取分区txt文件
							const configContent = await this.readFileContent(txtFileName);
							if (configContent) {
								// 解析配置文件（键值对格式）
								const config = this.parseConfigFile(configContent);
								if (config.part_id && config.part_addr && config.part_len) {
									const partId = this.parseHexValue(config.part_id);
									const addr = this.parseHexValue(config.part_addr);
									const len = this.parseHexValue(config.part_len);
									if (partId === type) { // 验证分区ID匹配
										const partitionInfo = {
											type: type,
											addr: addr,
											len: len,
											name: config.name || partitionMap[type]?.name || `分区0x${hexType}`,
											func: partitionMap[type]?.func || type,
											binFileName: config.bin_file || `0x${hexType}.bin`
										};
										this.partition.push(partitionInfo);
										// 尝试加载对应的bin文件
										await this.loadFirmwareFile(partitionInfo);
									}
								} else {
									console.log(`分区文件 ${txtFileName} 格式不正确，缺少必要字段`);
								}
							}
						} catch (e) {
							// 文件不存在，这个分区不需要升级
							console.log(`分区文件 ${txtFileName} 不存在或读取失败: ${e.message}`);
							continue;
						}
					}
				} catch (error) {
					console.log('加载固件文件失败:', error);
				}
				console.log(`分区加载完成，共 ${this.partition.length} 个分区`);
				// 打印分区详情
				if (this.partition.length > 0) {
					this.partition.forEach((p, i) => {
						const data = this.fwData[p.type];
					});
				}
			},
			// 解析配置文件（键值对格式）
			parseConfigFile(content) {
				const config = {};
				const lines = content.split('\n');
				for (const line of lines) {
					const trimmedLine = line.trim();
					// 跳过空行、注释行和纯注释行
					if (!trimmedLine ||
						trimmedLine.startsWith('#') ||
						trimmedLine.startsWith('//') ||
						trimmedLine.startsWith('name:') || // 跳过中文键名行
						trimmedLine.startsWith('unique_code:')) { // 跳过unique_code
						continue;
					}
					// 查找第一个冒号的位置
					const colonIndex = trimmedLine.indexOf(':');
					if (colonIndex === -1) {
						// 尝试查找等号
						const equalIndex = trimmedLine.indexOf('=');
						if (equalIndex === -1) continue;
						const key = trimmedLine.substring(0, equalIndex).trim();
						const value = trimmedLine.substring(equalIndex + 1).trim();
						if (key && value) {
							config[key] = value;
						}
					} else {
						const key = trimmedLine.substring(0, colonIndex).trim();
						const value = trimmedLine.substring(colonIndex + 1).trim();
						if (['part_id', 'part_addr', 'part_len', 'bin_file'].includes(key) && value) {
							config[key] = value;
						}
					}
				}
				// 如果没有bin_file，根据part_id生成默认文件名
				if (config.part_id && !config.bin_file) {
					config.bin_file = `${config.part_id}.bin`;
				}
				return config;
			},
			// 修改 readFileContent 方法，在返回前使用正则表达式提取正确值
			async readFileContent(filePath) {
				return new Promise((resolve, reject) => {
					// 构建完整路径
					const fullPath = filePath.startsWith('static/') ? filePath : `static/OTA/${filePath}`;
					// 如果是 App 环境
					if (typeof plus !== 'undefined') {
						const localPath = `_www/${fullPath}`;
						plus.io.resolveLocalFileSystemURL(localPath, (entry) => {
							entry.file((file) => {
								const reader = new plus.io.FileReader();

								reader.onload = (e) => {
									try {
										// 获取Base64数据
										const base64Data = e.target.result;
										// 提取Base64部分（移除 data: 前缀）
										const base64Match = base64Data.match(
											/base64,(.*)$/);
										if (base64Match && base64Match[1]) {
											const pureBase64 = base64Match[1];
											// 解码Base64
											const binaryString = atob(pureBase64);
											// 尝试不同编码解码
											let content = null;
											// 先尝试UTF-8
											try {
												const utf8Array = new Uint8Array(
													binaryString.length);
												for (let i = 0; i < binaryString
													.length; i++) {
													utf8Array[i] = binaryString.charCodeAt(
														i);
												}
												const decoder = new TextDecoder('utf-8');
												content = decoder.decode(utf8Array);
												console.log(`✅ UTF-8解码成功: ${fullPath}`);
											} catch (e) {
												// console.log('UTF-8解码失败，尝试GBK');
											}
											// 如果UTF-8失败，尝试GBK
											if (!content) {
												try {
													content = this.decodeGBK(binaryString);
													// console.log(`✅ GBK解码成功: ${fullPath}`);
												} catch (e) {
													console.log('GBK解码失败，使用原始字符串');
													content = binaryString;
												}
											}
											resolve(content);
										} else {
											reject(new Error('Base64格式错误'));
										}
									} catch (error) {
										console.error(`解码失败: ${error.message}`);
										reject(new Error(`解码失败: ${error.message}`));
									}
								};
								reader.onerror = (e) => {
									console.error(`文件读取错误: ${fullPath}`, e.target.error);
									try {
										const reader2 = new plus.io.FileReader();
										reader2.onload = (e2) => {
											console.log(`✅ 第二种方法读取成功: ${fullPath}`);
											resolve(e2.target.result);
										};
										reader2.onerror = (e2) => {
											console.error(`第二种方法也失败: ${fullPath}`);
											reject(new Error(`读取文件失败: ${fullPath}`));
										};
										// 尝试GBK编码
										reader2.readAsText(file, 'GBK');
									} catch (error) {
										reject(new Error(`所有读取方法都失败: ${fullPath}`));
									}
								};
								// 方法1：读取为DataURL（Base64）
								reader.readAsDataURL(file);
							}, (error) => {
								console.error(`文件对象获取失败: ${fullPath}`, error);
								reject(new Error(`文件不存在: ${fullPath}`));
							});
						}, (error) => {
							console.error(`文件系统访问失败: ${fullPath}`, error);
							reject(new Error(`文件系统错误: ${fullPath}`));
						});
					} else {
						// H5 环境
						console.log(`H5 环境读取文件: ${fullPath}`);
						uni.request({
							url: fullPath,
							method: 'GET',
							success: (res) => {
								if (typeof res.data === 'string') {
									console.log(`✅ H5字符串读取成功: ${fullPath}`);
									resolve(res.data);
								} else if (res.data instanceof ArrayBuffer) {
									// 尝试不同编码解码
									try {
										// 先尝试UTF-8
										const decoder = new TextDecoder('utf-8');
										const text = decoder.decode(res.data);
										console.log(`✅ H5 UTF-8解码成功: ${fullPath}`);
										resolve(text);
									} catch (e) {
										// 尝试GBK
										try {
											const text = this.decodeGBK(new Uint8Array(res.data));
											console.log(`✅ H5 GBK解码成功: ${fullPath}`);
											resolve(text);
										} catch (e2) {
											// 最后尝试原始字符串
											const text = String.fromCharCode.apply(null,
												new Uint8Array(res.data));
											console.log(`✅ H5原始字符串解码: ${fullPath}`);
											resolve(text);
										}
									}
								} else {
									reject(new Error('文件内容格式不支持'));
								}
							},
							fail: (err) => {
								console.error(`请求文件失败: ${fullPath}`, err);
								reject(new Error(`请求失败: ${err.errMsg}`));
							}
						});
					}
				});
			},
			decodeGBK(buffer) {
				// 如果是字符串，转换为字节数组
				let bytes;
				if (typeof buffer === 'string') {
					const arr = new Uint8Array(buffer.length);
					for (let i = 0; i < buffer.length; i++) {
						arr[i] = buffer.charCodeAt(i) & 0xFF;
					}
					bytes = arr;
				} else {
					bytes = buffer;
				}
				// 简单的GBK解码，处理常见中文字符
				let result = '';
				let i = 0;
				while (i < bytes.length) {
					const byte = bytes[i];
					// ASCII字符
					if (byte < 128) {
						result += String.fromCharCode(byte);
						i++;
					}
					// 可能是GBK双字节字符
					else if (byte >= 0xA1 && byte <= 0xFE && i + 1 < bytes.length) {
						const byte2 = bytes[i + 1];
						// 简单的GBK到Unicode映射（常见字符）
						const unicode = this.gbkToUnicode(byte, byte2);
						if (unicode) {
							result += String.fromCharCode(unicode);
						} else {
							// 无法映射，使用占位符
							result += `[${byte.toString(16)}${byte2.toString(16)}]`;
						}
						i += 2;
					} else {
						// 非标准字符，跳过
						i++;
					}
				}
				return result;
			},
			// 简单的GBK到Unicode映射表（常见字符）
			gbkToUnicode(byte1, byte2) {
				// 这里可以添加常见的GBK字符映射
				// 由于字符集很大，这里只添加几个示例
				// 示例：中文字符
				if (byte1 === 0xD6 && byte2 === 0xD0) return 0x4E2D; // 中
				if (byte1 === 0xCE && byte2 === 0xC4) return 0x6587; // 文
				// 默认返回null，表示无法映射
				return null;
			},
			// 解析16进制值（支持 0x 前缀和纯16进制）
			parseHexValue(str) {
				if (!str) return 0;
				let cleanStr = str.toString();
				const hexMatch = cleanStr.match(/0x([0-9A-Fa-f]+)/);
				if (hexMatch) {
					return parseInt(hexMatch[1], 16);
				}
				return parseInt(cleanStr, 16);
			},
			// 加载固件文件 - 修复版本
			async loadFirmwareFile(partitionInfo) {
				try {
					const binFileName = partitionInfo.binFileName;
					const data = await this.readBinaryFile(binFileName);
					if (!data || data.length === 0) {
						throw new Error(`固件文件为空: ${binFileName}`);
					}
					this.fwData[partitionInfo.type] = data;
				} catch (e) {
					console.log(`❌ 加载失败: ${e.message}`);
					throw e;
				}
			},
			// 新的二进制文件读取方法
			readBinaryFile(filePath) {
				return new Promise((resolve, reject) => {
					const path = filePath.startsWith('static/') ? filePath : 'static/OTA/' + filePath;
					// #ifdef APP-PLUS
					plus.io.resolveLocalFileSystemURL('_www/' + path, entry => {
						entry.file(file => {
							const reader = new plus.io.FileReader();
							reader.onload = e => {
								const base64 = e.target.result.split(',')[1];
								const binary = atob(base64);
								const bytes = new Uint8Array(binary.length);
								for (let i = 0; i < binary.length; i++) bytes[i] = binary
									.charCodeAt(i);
								resolve(bytes);
							};
							reader.readAsDataURL(file);
						}, reject);
					}, reject);
					// #endif
					// #ifndef APP-PLUS
					uni.request({
						url: path,
						method: 'GET',
						responseType: 'arraybuffer',
						success: res => resolve(new Uint8Array(res.data)),
						fail: err => reject(new Error('请求失败: ' + err.errMsg))
					});
					// #endif
				});
			},
			async sendPartitionTable() {
				if (this.partition.length === 0) {
					throw new Error('没有分区信息');
				}
				const partitionData = this.buildPartitionData();
				// 1. 先创建ACK等待Promise
				const ackPromise = this.waitForAck(FUNC.PARTITION, 0x01, 10000);
				// 2. 然后发送数据
				const frame = this.buildFrame(FUNC.PARTITION, 0x01, 0, 0, partitionData);
				console.log('下发分区表...');
				await this.write(frame);
				// 3. 等待ACK
				await ackPromise;
				console.log('分区表下发成功');
			},
			buildPartitionData() {
				const data = new Uint8Array(this.partition.length * 9);
				for (let i = 0; i < this.partition.length; i++) {
					const p = this.partition[i];
					const offset = i * 9;
					data[offset] = p.type;
					// 分区地址 (4字节，大端)
					data[offset + 1] = (p.addr >> 24) & 0xFF;
					data[offset + 2] = (p.addr >> 16) & 0xFF;
					data[offset + 3] = (p.addr >> 8) & 0xFF;
					data[offset + 4] = p.addr & 0xFF;
					// 分区长度 (4字节，大端)
					data[offset + 5] = (p.len >> 24) & 0xFF;
					data[offset + 6] = (p.len >> 16) & 0xFF;
					data[offset + 7] = (p.len >> 8) & 0xFF;
					data[offset + 8] = p.len & 0xFF;
				}
				return data;
			},
			/* ------------ OTA升级核心逻辑 ------------ */
			async upgradePartition(partition) {
				console.log(`开始升级分区: ${partition.name}`);
				try {
					// 重置状态
					this.skip4KChecks = false;
					this.currentPartition = partition;

					// 设置滚动条
					const totalBlocks = Math.ceil(partition.len / 4096);
					this.setPartitionTotalBlocks(partition.type, totalBlocks);

					// 准备分区数据
					const partitionData = this.preparePartitionData(partition);

					// 发送4K块校验值
					await this.send4KChecksums(partition, partitionData);

					// 检查是否需要发送数据
					const partitionFailedBlocks = this.failedBlocks.filter(
						fb => fb.partition === partition.type
					);

					if (partitionFailedBlocks.length > 0 || this.skip4KChecks) {
						await this.sendPartitionData(partition, partitionData);
					} else {
						console.log(`✅ 所有4K块校验通过，跳过数据发送`);
						this.updateProgress(partition.len);
						this.markPartitionComplete(partition.type);
					}
					// 发送分区总校验
					await this.sendPartitionTotalChecksum(partition, partitionData);
					console.log(`分区 ${partition.name} 升级成功完成`);
					return true;

				} catch (error) {
					console.log(`分区 ${partition.name} 升级失败: ${error.message}`);
					this.markPartitionFailed(partition.type);
					throw error;
				}
			},
			/* ------------ 4K校验逻辑 ------------ */
			async send4KChecksums(partition, partitionData) {
				const BLOCK_SIZE = 4096;
				const INITIAL_BLOCK_COUNT = 10;
				const JUMP_SIZE = 40 * 1024;

				console.log(`发送前 ${INITIAL_BLOCK_COUNT} 个4K块的校验值...`);
				// 计算总共能有多少个完整的4K块
				const totalBlocks = Math.ceil(partitionData.length / BLOCK_SIZE);
				const blocksToCheck = Math.min(INITIAL_BLOCK_COUNT, totalBlocks);

				if (blocksToCheck === 0) {
					console.log('没有数据需要校验');
					return;
				}

				// 构建校验数据
				const checkDataSize = blocksToCheck * (this.otaVer === 'V1.1' ? 8 : 4);
				const checkData = new Uint8Array(checkDataSize);

				for (let blockIndex = 0; blockIndex < blocksToCheck; blockIndex++) {
					const blockOffset = blockIndex * BLOCK_SIZE;
					const endOffset = Math.min(blockOffset + BLOCK_SIZE, partitionData.length);
					const blockData = partitionData.slice(blockOffset, endOffset);

					// 计算校验值
					let blockChecksum;
					if (this.otaVer === 'V1.1') {
						blockChecksum = this.calcBlockCheckV11(blockData);
					} else {
						blockChecksum = this.calcBlockCheckV10(blockData);
					}

					// 复制到校验数据数组
					const dataOffset = blockIndex * blockChecksum.length;
					checkData.set(blockChecksum, dataOffset);
				}

				try {
					// 1. 先创建ACK等待Promise
					const ackPromise = this.waitForAck(FUNC.BLOCK_CHECK, 0x01, 10000);

					// 2. 然后发送数据
					const frame = this.buildFrame(FUNC.BLOCK_CHECK, 0x01, 0, 0, checkData);
					console.log("发送前10个块的校验值", this.ab2hex(frame));
					await this.write(frame);
					// 3. 等待设备响应
					const ack = await ackPromise;

					if (ack.data && ack.data.length > 0) {
						const result = ack.data[0];
						if (result === 0xFF) {
							console.log('✅ 前10个4K块校验正确，继续偏移40K后的校验');
							// 如果前10个校验正确，往后面偏移40K位置再发校验值
							await this.sendSubsequentChecksums(partition, partitionData, JUMP_SIZE);
						} else if (result >= 0x00 && result <= 0x09) {
							// result 是失败块的相对索引（0-9）
							const failedBlockIndex = result;
							console.log(`❌ 第 ${failedBlockIndex} 个4K块校验出错，从该区域开始发送文件，后续不再4K校验`);
							this.skip4KChecks = true;

							// 清除该分区的旧失败记录
							this.failedBlocks = this.failedBlocks.filter(
								fb => fb.partition !== partition.type
							);

							// 记录从失败块开始的所有块都需要发送
							for (let i = failedBlockIndex; i < totalBlocks; i++) {
								this.failedBlocks.push({
									partition: partition.type,
									blockIndex: i,
									offset: i * BLOCK_SIZE,
									reason: 'failed_in_4k_check'
								});
							}
						} else {
							console.log(`❌ 未知响应: 0x${result.toString(16)}，当作校验失败`);
							this.markAllBlocksAsFailed(partition.type, totalBlocks);
						}
					} else {
						// 没有响应数据，当作全部失败
						console.log('❌ 校验响应无效，当作全部失败');
						this.markAllBlocksAsFailed(partition.type, totalBlocks);
					}
				} catch (error) {
					console.log(`❌ 4K校验响应失败: ${error.message}，当作全部失败`);
					this.markAllBlocksAsFailed(partition.type, totalBlocks);
				}
			},
			// 辅助方法：标记所有块为失败
			markAllBlocksAsFailed(partitionType, totalBlocks) {
				this.skip4KChecks = true;
				this.failedBlocks = this.failedBlocks.filter(fb => fb.partition !== partitionType);
				for (let i = 0; i < totalBlocks; i++) {
					this.failedBlocks.push({
						partition: partitionType,
						blockIndex: i,
						offset: i * 4096,
						reason: 'unknown_error_or_timeout'
					});
				}
				console.log(`[记录] 标记了所有 ${totalBlocks} 个块为失败状态`);
			},
			// 发送后续校验值（偏移40K）
			async sendSubsequentChecksums(partition, partitionData, startOffset) {
				const BLOCK_SIZE = 4096;
				const BLOCK_COUNT = 10;

				console.log(`✅ 开始偏移40K后的校验，起始偏移: ${startOffset}字节`);
				let currentOffset = startOffset;
				const totalLength = partitionData.length;
				const totalBlocks = Math.ceil(totalLength / BLOCK_SIZE);

				while (currentOffset < totalLength && !this.skip4KChecks) {
					// 检查连接状态
					if (!this.connected) {
						throw new Error('蓝牙连接已断开');
					}

					// 计算这次要校验的块数
					const remainingBlocks = Math.ceil((totalLength - currentOffset) / BLOCK_SIZE);
					const blocksToCheck = Math.min(BLOCK_COUNT, remainingBlocks);

					if (blocksToCheck === 0) break;

					// 计算起始块索引
					const startBlockIndex = Math.floor(currentOffset / BLOCK_SIZE);
					console.log(`开始校验块 ${startBlockIndex} 到 ${startBlockIndex+blocksToCheck-1}`);

					// 构建校验数据
					const checkData = new Uint8Array(blocksToCheck * (this.otaVer === 'V1.1' ? 8 : 4));

					// 计算校验值
					for (let i = 0; i < blocksToCheck; i++) {
						const blockOffset = currentOffset + (i * BLOCK_SIZE);
						if (blockOffset >= partitionData.length) {
							break;
						}
						const endOffset = Math.min(blockOffset + BLOCK_SIZE, partitionData.length);
						const blockData = partitionData.slice(blockOffset, endOffset);

						// 计算校验值
						let blockChecksum;
						if (this.otaVer === 'V1.1') {
							blockChecksum = this.calcBlockCheckV11(blockData);
						} else {
							blockChecksum = this.calcBlockCheckV10(blockData);
						}

						// 复制到校验数据数组
						const dataOffset = i * blockChecksum.length;
						checkData.set(blockChecksum, dataOffset);
					}

					try {
						// 1. 先创建ACK等待Promise（这会注册解析器）
						const ackPromise = this.waitForAck(FUNC.BLOCK_CHECK, 0x01, 10000);

						// 2. 然后发送数据（确保解析器已经注册）
						const frame = this.buildFrame(FUNC.BLOCK_CHECK, 0x01, startBlockIndex, 0, checkData);
						console.log(`发送块 ${startBlockIndex} 到 ${startBlockIndex+blocksToCheck-1} 的校验值`);
						await this.write(frame);

						// 3. 等待ACK
						const ack = await ackPromise;

						if (ack.data && ack.data.length > 0) {
							const result = ack.data[0];
							if (result === 0xFF) {
								console.log(`✅ 块 ${startBlockIndex} 到 ${startBlockIndex+blocksToCheck-1} 校验全部正确`);
								currentOffset += 40 * 1024;
							} else if (result >= 0x00 && result <= 0x09) {
								// result 是失败块的相对索引（相对于当前批次）
								const failedRelativeIndex = result;
								const failedBlockIndex = startBlockIndex + failedRelativeIndex;
								console.log(`❌ 第 ${failedRelativeIndex} 个4K块校验出错（全局块索引: ${failedBlockIndex}）`);
								console.log(`📋 从块 ${failedBlockIndex} 开始发送文件，后续不再4K校验`);

								this.skip4KChecks = true;

								// 清除该分区的旧失败记录
								this.failedBlocks = this.failedBlocks.filter(
									fb => fb.partition !== partition.type
								);

								// 记录从失败块开始的所有块都需要发送
								for (let i = failedBlockIndex; i < totalBlocks; i++) {
									this.failedBlocks.push({
										partition: partition.type,
										blockIndex: i,
										offset: i * BLOCK_SIZE,
										reason: 'failed_in_40k_offset_check'
									});
								}
								break;
							} else {
								console.log(`❌ 未知响应: 0x${result.toString(16)}，当作校验失败`);
								this.skip4KChecks = true;
								this.markAllBlocksAsFailed(partition.type, totalBlocks);
								break;
							}
						} else {
							console.log('❌ 校验响应无效，当作校验失败');
							this.skip4KChecks = true;
							this.markAllBlocksAsFailed(partition.type, totalBlocks);
							break;
						}
					} catch (error) {
						console.log(`❌ 校验响应失败: ${error.message}，当作校验失败`);
						this.skip4KChecks = true;
						this.markAllBlocksAsFailed(partition.type, totalBlocks);
						break;
					}

					// 每次校验后稍微延时，避免设备处理不过来
					await this.delay(50);
				}

				// 检查是否所有校验都通过
				if (!this.skip4KChecks && currentOffset >= totalLength) {
					console.log(`✅ 所有4K块校验完成，所有校验都正确，无需发送数据`);
					// 清除该分区的所有失败记录
					this.failedBlocks = this.failedBlocks.filter(
						fb => fb.partition !== partition.type
					);
					console.log(`已清除分区 ${partition.name} 的所有失败块记录`);
				}
			},
			/* ------------ 总校验 ------------ */
			async sendPartitionTotalChecksum(partition, partitionData) {
				console.log(`开始 ${partition.name} 总校验...`);

				// 1. 计算总校验值
				let totalSum = 0;
				for (let i = 0; i < partitionData.length; i++) {
					totalSum += partitionData[i];
				}

				const checkData = new Uint8Array(4);
				checkData[0] = (totalSum >> 24) & 0xFF;
				checkData[1] = (totalSum >> 16) & 0xFF;
				checkData[2] = (totalSum >> 8) & 0xFF;
				checkData[3] = totalSum & 0xFF;
				try {
					// 2. 先创建ACK等待Promise（注册解析器）
					const ackPromise = this.waitForAck(FUNC.TOTAL_CHECK, 0x01, 15000);
					// 3. 然后发送总校验帧
					const frame = this.buildFrame(FUNC.TOTAL_CHECK, 0x01, 0, 0, checkData);
					const frameHex = this.ab2hex(new Uint8Array(frame));
					console.log(`发送总校验帧: ${frameHex}`);
					await this.write(frame);
					// 4. 等待ACK响应
					const ack = await ackPromise;
					// 检查标识码
					if (ack.identifier === 0x01) {
						console.log(`✅ ${partition.name} 总校验成功`);
						return true;
					} else {
						const errorMsg = this.getIdentifierName(ack.identifier);
						console.log(`❌ ${partition.name} 总校验失败: ${errorMsg}`);
						throw new Error(`总校验失败: ${errorMsg}`);
					}

				} catch (error) {
					console.log(`总校验过程出错: ${error.message}`);
					throw error;
				}
			},
			preparePartitionData(partition) {
				const rawData = this.fwData[partition.type] || new Uint8Array(0);
				if (rawData.length === 0) {
					throw new Error(`分区 ${partition.name} 没有数据`);
				}
				if (rawData.length < partition.len) {
					const result = new Uint8Array(partition.len);
					result.set(rawData);
					return result;
				} else if (rawData.length > partition.len) {
					return rawData.slice(0, partition.len);
				}
				return rawData;
			},
			concatUint8Arrays(array1, array2) {
				const result = new Uint8Array(array1.length + array2.length);
				result.set(array1);
				result.set(array2, array1.length);
				return result;
			},
			/* ------------ 数据发送 ------------ */
			async sendPartitionData(partition, partitionData) {
				const BLOCK_SIZE = 4096;
				const totalBlocks = Math.ceil(partition.len / BLOCK_SIZE);

				// 检查连接状态
				if (!this.connected) {
					throw new Error('蓝牙连接已断开，请重新连接设备');
				}

				// 获取该分区的失败块列表并排序
				const partitionFailedBlocks = this.failedBlocks
					.filter(fb => fb.partition === partition.type)
					.sort((a, b) => a.blockIndex - b.blockIndex);

				console.log(
					`[DEBUG] 总块数: ${totalBlocks}, 失败块数: ${partitionFailedBlocks.length}, skip4KChecks: ${this.skip4KChecks}`
				);
				if (partitionFailedBlocks.length === 0) {
					console.log(`✅ 没有失败块需要发送，直接跳过所有块`);
					// 更新进度
					this.updateProgress(partition.len);
					this.markPartitionComplete(partition.type);
					return;
				}

				// 统计需要发送的块数
				let sendCount = 0;
				let skipCount = 0;

				// 创建失败块的索引集合，方便快速查找
				const failedBlockSet = new Set(partitionFailedBlocks.map(fb => fb.blockIndex));

				// 计算第一个失败块的索引，用于优化跳过逻辑
				const firstFailedBlock = Math.min(...partitionFailedBlocks.map(fb => fb.blockIndex));

				console.log(`📊 发送统计: 第一个失败块=${firstFailedBlock}, 总共${partitionFailedBlocks.length}个失败块`);
				// 优化：批量跳过前面的成功块
				if (firstFailedBlock > 0) {
					console.log(`⏭️ 批量跳过前 ${firstFailedBlock} 个成功块`);
					skipCount += firstFailedBlock;
					this.updateProgress(firstFailedBlock * BLOCK_SIZE);
					// 更新滚动条进度
					for (let i = 0; i < firstFailedBlock; i++) {
						this.updatePartitionProgress(partition.type, i);
					}
				}

				// 只处理失败块
				for (let i = firstFailedBlock; i < totalBlocks; i++) {
					// 检查连接状态
					if (!this.connected) {
						throw new Error('蓝牙连接已断开，停止发送');
					}

					// 检查是否应该发送该块
					if (failedBlockSet.has(i)) {
						sendCount++;
						console.log(`✅ [${sendCount}] 发送块 ${i}`);
						await this.sendSingleDataBlock(partition, partitionData, i);
					} else {
						skipCount++;
						// 跳过时只更新进度，不打印太多日志
						if (skipCount % 20 === 0) {
							console.log(`⏭️ 跳过块 ${i} (校验正确)`);
						}

						// 即使跳过也要更新进度
						this.updateProgress(BLOCK_SIZE);
						// 更新滚动条进度
						this.updatePartitionProgress(partition.type, i);
					}

					// 块间延时，避免发送过快
					if (i < totalBlocks - 1) {
						await this.delay(30); // 适当缩短延时
					}

					// 每20个块打印一次统计信息
					if ((i + 1) % 20 === 0) {
						console.log(`[进度] 已处理 ${i + 1}/${totalBlocks} 个块 (发送:${sendCount}, 跳过:${skipCount})`);
					}
				}

				console.log(`[完成] 分区 ${partition.name} 数据发送完成`);
				console.log(`[统计] 总块数: ${totalBlocks}, 发送: ${sendCount}, 跳过: ${skipCount}`);

				// 标记该分区完成
				this.markPartitionComplete(partition.type);
			},
			// 判断块是否需要发送
			shouldSendBlock(partitionType, blockIndex) {
				const partitionFailedBlocks = this.failedBlocks.filter(
					fb => fb.partition === partitionType
				);
				if (this.skip4KChecks) {
					if (partitionFailedBlocks.length > 0) {
						return partitionFailedBlocks.some(fb => fb.blockIndex === blockIndex);
					}
					return true;
				}
				return partitionFailedBlocks.some(fb => fb.blockIndex === blockIndex);
			},
			// 发送单个4K数据块
			async sendSingleDataBlock(partition, partitionData, blockIndex) {
				const BLOCK_SIZE = 4096;
				const MAX_RETRIES = 3;

				const blockOffset = blockIndex * BLOCK_SIZE;
				if (blockOffset >= partitionData.length) {
					return;
				}

				const endOffset = Math.min(blockOffset + BLOCK_SIZE, partitionData.length);
				let blockData = partitionData.slice(blockOffset, endOffset);

				// 数据不足时补零
				if (blockData.length < BLOCK_SIZE) {
					const zeros = new Uint8Array(BLOCK_SIZE - blockData.length);
					blockData = this.concatUint8Arrays(blockData, zeros);
				}

				// 计算4K块的校验值
				let blockChecksum;
				if (this.otaVer === 'V1.1') {
					blockChecksum = this.calcBlockCheckV11(blockData);
				} else {
					blockChecksum = this.calcBlockCheckV10(blockData);
				}

				// 重试逻辑
				for (let retryCount = 0; retryCount < MAX_RETRIES; retryCount++) {
					try {
						// 检查连接状态
						if (!this.connected) {
							throw new Error('蓝牙连接已断开');
						}
						// 优化：计算本次发送的数据大小
						const actualDataSize = endOffset - blockOffset;
						// 将4K数据分成多个包发送
						const packetsPerBlock = Math.ceil(BLOCK_SIZE / this.packetSize);

						// 发送数据包
						for (let packetIndex = 0; packetIndex < packetsPerBlock; packetIndex++) {
							// 检查连接状态
							if (!this.connected) {
								throw new Error('蓝牙连接已断开');
							}

							const dataOffset = packetIndex * this.packetSize;
							const packetSize = Math.min(this.packetSize, blockData.length - dataOffset);
							if (packetSize <= 0) break;

							const packetData = blockData.slice(dataOffset, dataOffset + packetSize);

							// 发送数据包
							const frame = this.buildFrame(
								partition.func,
								0x01,
								blockIndex,
								packetIndex,
								packetData
							);

							await this.write(frame);

							// 包间延时，根据是否iOS调整
							if (packetIndex < packetsPerBlock - 1) {
								await this.delay(this.isIOS ? 15 : 10);
							}
						}

						// 1. 先创建ACK等待Promise
						const ackPromise = this.waitForAck(FUNC.BLOCK_CHECK, 0x01, 8000);

						// 2. 然后发送校验值
						const checkFrame = this.buildFrame(
							FUNC.BLOCK_CHECK,
							0x01,
							blockIndex,
							0,
							blockChecksum
						);
						console.log(`发送块 ${blockIndex} 的校验值`, this.ab2hex(checkFrame));
						await this.write(checkFrame);
						// 3. 等待ACK
						const ack = await ackPromise;
						// 检查标识码
						if (ack.identifier !== 0x01) {
							const errorMsg = this.getIdentifierName(ack.identifier);
							console.log(`❌ 块 ${blockIndex} 校验失败: ${errorMsg}`);
							throw new Error(`块 ${blockIndex} 校验失败: ${errorMsg}`);
						}

						// 根据协议，响应应该包含数据
						if (ack.data && ack.data.length > 0) {
							const result = ack.data[0];
							if (result === 0xFF) {
								console.log(`✅ 块 ${blockIndex} 校验通过 (尝试 ${retryCount+1}/${MAX_RETRIES})`);
								this.updateProgress(BLOCK_SIZE);
								this.updatePartitionProgress(partition.type, blockIndex);
								return true;
							} else if (result >= 0x00 && result <= 0x09) {
								console.log(`❌ 块 ${blockIndex} 校验失败，错误码: 0x${result.toString(16)}`);
								throw new Error(`块 ${blockIndex} 校验失败，错误码: 0x${result.toString(16)}`);
							} else {
								// 未知响应，当作成功
								console.log(`⚠️ 块 ${blockIndex} 未知响应: 0x${result.toString(16)}，当作成功`);
								this.updateProgress(BLOCK_SIZE);
								this.updatePartitionProgress(partition.type, blockIndex);
								return true;
							}
						} else {
							// 没有数据响应也当作成功
							console.log(`✅ 块 ${blockIndex} 校验通过`);
							this.updateProgress(BLOCK_SIZE);
							this.updatePartitionProgress(partition.type, blockIndex);
							return true;
						}

					} catch (error) {
						console.log(`块 ${blockIndex} 发送失败 (尝试 ${retryCount+1}/${MAX_RETRIES}): ${error.message}`);

						if (retryCount === MAX_RETRIES - 1) {
							// 最后一次尝试也失败了
							console.log(`❌ 块 ${blockIndex} 重试 ${MAX_RETRIES} 次后仍然失败`);

							// 添加到失败列表
							this.failedBlocks.push({
								partition: partition.type,
								blockIndex: blockIndex,
								offset: blockIndex * BLOCK_SIZE,
								error: error.message,
								retryCount: retryCount + 1,
								timestamp: Date.now()
							});

							throw error;
						}

						// 等待一段时间后重试，重试间隔逐渐增加
						const delayTime = 1000 * (retryCount + 1);
						console.log(`等待${delayTime/1000}秒后重试块 ${blockIndex}...`);
						await this.delay(delayTime);
					}
				}
			},
			// 根据标识码获取错误描述
			getIdentifierName(identifier) {
				const identifierNames = {
					0x00: "无效命令",
					0x01: "成功",
					0x02: "校验失败",
					0x03: "和校验错误",
					0x04: "地址错误",
					0x05: "长度错误",
					0x06: "分区错误",
					0x07: "数据包错误",
					0x08: "忙碌",
					0x09: "超时",
					0x0A: "内存不足",
					0x0B: "不支持的功能",
					0x0C: "未初始化",
					0x0D: "参数错误"
				};
				return identifierNames[identifier] || `未知错误 (0x${identifier.toString(16)})`;
			},
			calcBlockCheckV10(blockData) {
				// V1.0: 4字节和校验
				let sum = 0;
				for (let i = 0; i < blockData.length; i++) {
					sum += blockData[i];
				}
				const result = new Uint8Array(4);
				result[0] = (sum >> 24) & 0xFF;
				result[1] = (sum >> 16) & 0xFF;
				result[2] = (sum >> 8) & 0xFF;
				result[3] = sum & 0xFF;
				return result;
			},

			calcBlockCheckV11(blockData) {
				// V1.1: 8字节奇偶校验
				let evenSum = 0; // 偶数下标和
				let oddSum = 0; // 奇数下标和
				for (let i = 0; i < blockData.length; i++) {
					if (i % 2 === 0) {
						evenSum += blockData[i];
					} else {
						oddSum += blockData[i];
					}
				}
				const result = new Uint8Array(8);
				// 偶数校验值 (4字节，大端)
				result[0] = (evenSum >> 24) & 0xFF;
				result[1] = (evenSum >> 16) & 0xFF;
				result[2] = (evenSum >> 8) & 0xFF;
				result[3] = evenSum & 0xFF;
				// 奇数校验值 (4字节，大端)
				result[4] = (oddSum >> 24) & 0xFF;
				result[5] = (oddSum >> 16) & 0xFF;
				result[6] = (oddSum >> 8) & 0xFF;
				result[7] = oddSum & 0xFF;
				return result;
			},

			async sendRebootCommand() {
				console.log('发送重启指令...');
				const frame = this.buildFrame(FUNC.REBOOT, 0x01, 0, 0);
				await this.write(frame);
				setTimeout(() => {
					this.disconnect();
					uni.switchTab({
						url: "/pages/tabBar/main/Main"
					})
				}, 3000)
				uni.removeStorageSync("BPWundate")
			},

			handleAck(data) {
				try {
					const ack = this.parseAckFrame(data);
					if (!ack) {
						console.log('❌ 无法解析为有效的ACK帧');
						return;
					}
					const funcHex = `0x${ack.funcCode.toString(16).padStart(2, '0')}`;
					const idHex = `0x${ack.identifier.toString(16).padStart(2, '0')}`;
					// 构建所有可能的键值
					const exactKey = `${ack.funcCode}-${ack.identifier}`;
					const funcKey = `${ack.funcCode}`;
					// 记录当前的解析器状态（调试用）
					const resolverKeys = Object.keys(this.ackResolvers);
					// 优先使用精确匹配
					if (this.ackResolvers[exactKey]) {
						const resolver = this.ackResolvers[exactKey];
						// 在调用前就删除，避免回调中再次触发
						delete this.ackResolvers[exactKey];
						// 也删除功能码匹配的解析器
						if (this.ackResolvers[funcKey]) {
							delete this.ackResolvers[funcKey];
						}
						resolver(ack);
						return;
					}

					// 其次尝试功能码匹配（对于某些特定功能）
					if (this.ackResolvers[funcKey]) {
						console.log(`✅ 找到功能码匹配的解析器: ${funcKey}`);
						const resolver = this.ackResolvers[funcKey];
						delete this.ackResolvers[funcKey];
						resolver(ack);
						return;
					}

					// 对于块校验（0x02），可能有多个包序号，我们接受任何包序号的响应
					if (ack.funcCode === FUNC.BLOCK_CHECK) {
						// 查找所有以 "2-" 开头的解析器
						for (const key in this.ackResolvers) {
							if (key.startsWith('2-')) {
								console.log(`🔧 找到块校验的通用解析器: ${key}`);
								const resolver = this.ackResolvers[key];
								// 清理所有相关的解析器
								this.cleanResolversForFunc(FUNC.BLOCK_CHECK);
								resolver(ack);
								return;
							}
						}
					}
					const recentFuncs = [FUNC.BLOCK_CHECK, FUNC.TOTAL_CHECK, FUNC.PARTITION];
					if (recentFuncs.includes(ack.funcCode)) {
						console.log(`⚠️ 收到迟到的 ${funcHex} ACK，可能已经处理过，忽略`);
						return;
					}

					// 如果还是没有找到，可能是迟到的ACK或错误的ACK
					console.log(`⚠️ 未找到匹配的ACK解析器，ACK被忽略`);
					console.log(`ACK详情:`, {
						funcCode: funcHex,
						identifier: idHex,
						frameSeq: ack.frameSeq,
						dataLength: ack.dataLength,
						data: ack.data ? this.ab2hex(ack.data) : '无数据'
					});

				} catch (error) {
					console.log(`⚠️ 处理ACK时出错: ${error.message}`);
				}
			},

			// 新增：清理特定功能的所有解析器
			cleanResolversForFunc(funcCode) {
				const funcStr = funcCode.toString();
				for (const key in this.ackResolvers) {
					if (key === funcStr || key.startsWith(`${funcStr}-`)) {
						delete this.ackResolvers[key];
					}
				}
			},

			// 解析功能0x01的响应（获取手环升级信息）
			parseDeviceInfoAck(ack) {
				if (ack.funcCode !== 0x01) {
					return null;
				}
				if (ack.identifier !== 0x01) {
					console.log(`警告: 标识码非正常响应 (0x${ack.identifier.toString(16)})`);
				}
				const data = ack.data;
				if (!data || data.length < 6) {
					console.log('错误: 设备信息数据过短');
					return null;
				}
				let offset = 0;
				// 1. 时间戳 (4字节，大端序)
				const timestamp = (data[offset] << 24) | (data[offset + 1] << 16) |
					(data[offset + 2] << 8) | data[offset + 3];
				offset += 4;
				// 2. 版本号长度
				const versionLen = data[offset];
				offset += 1;
				// 检查长度是否足够
				if (offset + versionLen > data.length) {
					return null;
				}
				// 3. 版本号 (ASCII字符串)
				const versionBytes = data.slice(offset, offset + versionLen);
				const version = String.fromCharCode.apply(null, versionBytes);
				offset += versionLen;
				// 4. 项目名长度
				if (offset >= data.length) {
					return {
						timestamp,
						version,
						projectName: ''
					};
				}
				const projectNameLen = data[offset];
				offset += 1;
				// 5. 项目名 (ASCII字符串)
				let projectName = '';
				if (projectNameLen > 0 && offset + projectNameLen <= data.length) {
					const projectNameBytes = data.slice(offset, offset + projectNameLen);
					projectName = String.fromCharCode.apply(null, projectNameBytes);
				}
				console.log(
					`解析成功: 时间戳=${timestamp},版本号长度=${versionLen}, 版本=${version}, 项目名长度=${projectNameLen}, 项目名=${projectName}`
				);
				return {
					timestamp,
					version,
					projectName,
					rawAck: ack,
					versionLen: versionLen,
					projectNameLen: projectNameLen,
				};
			},
			// 修改 waitForAck 方法，解决超时逻辑问题
			waitForAck(func, idCode, timeout = 10000) {
				return new Promise((resolve, reject) => {
					const exactKey = `${func}-${idCode}`;
					const funcKey = `${func}`;
					const funcHex = `0x${func.toString(16).padStart(2, '0')}`;
					const idCodeHex = `0x${idCode.toString(16).padStart(2, '0')}`;
					// 清理可能冲突的旧解析器
					this.cleanResolversForFunc(func);
					let hasResolved = false;
					let isTimeout = false;
					const timer = setTimeout(() => {
						if (!hasResolved) {
							isTimeout = true;
							console.log(`⏰ ACK等待超时: func=${funcHex}, idCode=${idCodeHex}`);
							// 清理相关解析器
							this.cleanResolversForFunc(func);
							hasResolved = true;
							reject(new Error(`等待ACK超时: func=${funcHex}, idCode=${idCodeHex}`));
						}
					}, timeout);

					// 创建解析器回调
					const resolverCallback = (ack) => {
						if (hasResolved) {
							console.log(`⚠️ 解析器已被调用过，忽略重复ACK`);
							return;
						}
						clearTimeout(timer);
						hasResolved = true;
						// 立即清理所有相关解析器
						this.cleanResolversForFunc(func);
						resolve(ack);
					};

					// 注册解析器
					this.ackResolvers[exactKey] = resolverCallback;

					// 对于某些功能，也注册功能码匹配
					if ([FUNC.BLOCK_CHECK, FUNC.TOTAL_CHECK, FUNC.PARTITION].includes(func)) {
						this.ackResolvers[funcKey] = resolverCallback;
					}

					// 保存清理函数，用于Promise结束后的清理
					const cleanup = () => {
						if (!hasResolved && !isTimeout) {
							console.log(`🧹 主动清理未完成的解析器: ${exactKey}`);
							this.cleanResolversForFunc(func);
						}
					};

					// 确保Promise结束时清理
					const originalResolve = resolve;
					resolve = (value) => {
						cleanup();
						originalResolve(value);
					};

					const originalReject = reject;
					reject = (reason) => {
						cleanup();
						originalReject(reason);
					};
				});
			},
		},

		beforeDestroy() {
			this.disconnect();
			this.stopScan();
		},
	};
</script>

<style>
	.box {
		padding: 20rpx;
	}

	/* 滚动条容器样式 */
	.progress-bars {
		margin-top: 30rpx;
		padding: 20rpx;
		border-radius: 10rpx;
	}

	.progress-bar-item {
		margin-bottom: 30rpx;
	}

	.partition-name {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.progress-container {
		position: relative;
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		font-size: 22rpx;
		color: #666;
		margin-top: 5rpx;
	}

	.progress-percent {
		color: #10AEFF;
		font-weight: bold;
	}

	.log {
		height: 100%;
		background: #f5f5f5;
		margin-top: 20rpx;
		font-size: 24rpx;
		padding: 10rpx;
		overflow-y: auto;
		white-space: pre-wrap;
		word-break: break-all;
	}

	.progress_all {
		display: flex;
		flex-direction: column;
		margin: 10px;
		padding: 10px;
		background-color: #f9f9f9;
	}

	.progress {
		margin-top: 20px;
		display: flex;
		align-items: center;
		gap: 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	button {
		margin-bottom: 20rpx;
	}


	.log {
		height: 300rpx;
		background: #f5f5f5;
		margin-top: 20rpx;
		font-size: 24rpx;
		padding: 20px;
	}
</style>