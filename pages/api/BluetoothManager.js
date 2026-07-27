// BluetoothManager.js
import Bluetooth from './bluetoothService.js';



export default class BluetoothManager {
	constructor() {
		this.connectedDevices = {}; // 存储已连接设备的信息
	}

	async isDeviceConnected(deviceId) {
		return new Promise((resolve, reject) => {
			uni.getConnectedBluetoothDevices({
				success: (res) => {
					const isConnected = res.devices.some((device) => device.deviceId ===
						deviceId);
					resolve(isConnected);
				},
				fail: (err) => {
					console.error("检查设备连接状态失败", err);
					uni.openBluetoothAdapter()
					reject(err);
				},
			});
		});
	}

	async connectDevice(deviceId) {
		// 如果设备已连接，直接返回
		if (this.connectedDevices[deviceId]) {
			// console.log(`0设备 ${deviceId} 已连接，无需重复连接`);
			return this.connectedDevices[deviceId];
		}
		const bluetooth = new Bluetooth(deviceId);
		const isAlreadyConnected = await this.isDeviceConnected(deviceId);
		if (isAlreadyConnected) {
			// 系统层已连接：勿再 createBLEConnection（会反复打「连接成功」并干扰 notify）
			bluetooth.connected = true;
			await bluetooth.getServices();
			// 根据服务数量处理不同的逻辑
			switch (bluetooth.services.length) {
				case 1:
					uni.setBLEMTU({
						deviceId: deviceId,
						mtu: 512,
					});
					await bluetooth.getCharacteristics1(bluetooth.services[0].uuid);
					break;
				case 2:
					await bluetooth.getCharacteristics1(bluetooth.services[1].uuid);
					break;
				case 3:
					await bluetooth.getCharacteristics3(bluetooth.services[1].uuid);
					break;
				case 4:
					if (bluetooth.services[0].uuid === "6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E") {
						await bluetooth.getCharacteristics6(bluetooth.services[0].uuid);
					} else {
						await bluetooth.getCharacteristics1(bluetooth.services[3].uuid);
					}
					break;
				default:
					// console.warn(`设备 ${deviceId} 的服务数量不符合预期：`, bluetooth.services.length);
					break;
			}
			// 将设备实例存储到已连接设备列表中
			this.connectedDevices[deviceId] = bluetooth;
			return this.connectedDevices[deviceId];
		}
		await bluetooth.connect();
		await bluetooth.delay(3000);
		await bluetooth.getServices();
		// console.log(`设备 ${deviceId} 的服务数量：`, bluetooth.services);
		// 根据服务数量处理不同的逻辑
		switch (bluetooth.services.length) {
			case 1:
				uni.setBLEMTU({
					deviceId,
					mtu: 512,
				});
				await bluetooth.getCharacteristics1(bluetooth.services[0].uuid);
				break;
			case 2:
				await bluetooth.getCharacteristics1(bluetooth.services[1].uuid);
				break;
			case 3:
				await bluetooth.getCharacteristics3(bluetooth.services[1].uuid);
				break;
			case 4:
				if (bluetooth.services[0].uuid === "6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E") {
					await bluetooth.getCharacteristics6(bluetooth.services[0].uuid);
				} else {
					await bluetooth.getCharacteristics1(bluetooth.services[3].uuid);
				}
				break;
			default:
				// console.warn(`设备 ${deviceId} 的服务数量不符合预期：`, bluetooth.services.length);
				break;
		}
		// 将设备实例存储到已连接设备列表中
		this.connectedDevices[deviceId] = bluetooth;
		return this.connectedDevices[deviceId];
		// console.log(`设备 ${deviceId} 已成功连接并存储`, this.connectedDevices[deviceId]);
	}


	// 断开单个设备连接
	async disconnectDevice(deviceId) {
		if (!this.connectedDevices[deviceId]) {
			console.log(`设备 ${deviceId} 未连接`);
			return;
		}
		try {
			await this.connectedDevices[deviceId].disconnect();
			delete this.connectedDevices[deviceId];
			console.log(`设备 ${deviceId} 断开连接`);
		} catch (err) {
			console.error(`断开设备 ${deviceId} 连接失败`, err);
		}
	}



	// 断开所有设备连接
	async disconnectAll() {
		for (const deviceId in this.connectedDevices) {
			await this.disconnectDevice(deviceId);
		}
		this.connectedDevices = {};
		console.log('所有设备已断开连接');
	}
}