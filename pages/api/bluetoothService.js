// BluetoothService.js
export default class BluetoothService {
	constructor(deviceId) {
		this.deviceId = deviceId;
		this.connected = false;
		this.services = [];
		this.characteristics = {};
	}


	// 初始化蓝牙适配器
	async initBluetooth() {
		return new Promise((resolve, reject) => {
			uni.openBluetoothAdapter({
				success: () => {
					console.log("蓝牙适配器初始化成功");
					resolve();
				},
				fail: (err) => {
					console.error("蓝牙适配器初始化失败", err);
					reject(err);
				},
			});
		});
	}

	// 连接设备
	async connect() {
		return new Promise((resolve, reject) => {
			uni.createBLEConnection({
				deviceId: this.deviceId,
				success: (res) => {
					console.log("连接成功", this.deviceId);
					this.connected = true;
					resolve(res);
				},
				fail: (err) => {
					console.log("连接失败", err);
					if (err.errCode === -1) {
						this.connected = true; // 已连接
						resolve("设备已连接");
					} else {
						reject(err);
					}
				},
			});
		});
	}

	// 获取设备服务
	async getServices() {
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceServices({
				deviceId: this.deviceId,
				success: (res) => {
					this.services = res.services;
					resolve(res.services);
				},
				fail: (err) => {
					console.log("获取设备服务失败", err)
					reject(err);
				},
			});
		});
	}

	async checkConnection() {
		return new Promise((resolve) => {
			uni.getConnectedBluetoothDevices({
				services: [this.serviceUUID],
				success: (res) => {
					resolve(res.devices.some(d => d.deviceId === this.deviceId));
				},
				fail: () => resolve(false)
			});
		});
	}

	// 获取特征值
	async getCharacteristics1(serviceId) {
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceCharacteristics({
				deviceId: this.deviceId,
				serviceId: serviceId,
				success: (res) => {
					this.characteristics[serviceId] = res.characteristics;
					resolve(res.characteristics);
				},
				fail: (err) => {
					console.error("获取特征值失败", err);
					reject(err);
				},
			});
		});
	}
	// 获取特征值
	async getCharacteristics3(serviceId) {
		return new Promise((resolve, reject) => {
			uni.getBLEDeviceCharacteristics({
				deviceId: this.deviceId,
				serviceId: serviceId,
				success: (res) => {
					this.characteristics[serviceId] = res.characteristics;
					resolve(res.characteristics);
				},
				fail: (err) => {
					console.error("3获取特征值失败", err);
					this.disconnect()
					reject(err);
				},
			});
		});
	}

	// 启用通知
	async notifyCharacteristic(serviceId, characteristicId) {
		return new Promise((resolve, reject) => {
			uni.notifyBLECharacteristicValueChange({
				deviceId: this.deviceId,
				serviceId: serviceId,
				characteristicId: characteristicId,
				state: true,
				success: () => {
					console.log("通知开启成功");
					resolve();
				},
				fail: (err) => {
					console.error("通知开启失败", err);
					reject(err);
				},
			});
		});
	}

	// 断开连接
	async disconnect() {
		return new Promise((resolve, reject) => {
			uni.closeBLEConnection({
				deviceId: this.deviceId,
				success: () => {
					console.log("断开连接成功");
					this.connected = false;
					resolve();
				},
				fail: (err) => {
					console.error("断开连接失败", err);
					reject(err);
				},
			});
		});
	}

	// 延迟函数
	async delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}