/**
 * HealthKit 管理器
 * 用于处理 iOS HealthKit 数据获取和授权
 */
class HealthKitManager {
	constructor() {
		this.isAvailable = false;
		this.isAuthorized = false;
		this.init();
	}

	/**
	 * 初始化 HealthKit 管理器
	 */
	init() {
		console.log('初始化 HealthKit 管理器...');

		// 方式1: 使用 uni.requireNativePlugin (推荐)
		try {
			const health = uni.requireNativePlugin("HealthKitPlugin-HealthKitModule");
			if (health) {
				this.isAvailable = true;
				console.log('✅ HealthKit 插件可用 - 通过 uni.requireNativePlugin');
			}
		} catch (error) {
			console.warn('uni.requireNativePlugin 方式失败:', error);
		}

		// 方式2: 使用 plus.health (备用)
		if (!this.isAvailable && typeof plus !== 'undefined' && plus.health) {
			this.isAvailable = true;
			console.log('✅ HealthKit 插件可用 - 通过 plus.health');
		}

		if (!this.isAvailable) {
			console.warn('❌ HealthKit 插件不可用');
		}
	}

	/**
	 * 检查 HealthKit 是否可用
	 * @returns {boolean} 是否可用
	 */
	checkAvailability() {
		return this.isAvailable;
	}

	/**
	 * 请求 HealthKit 授权
	 * @returns {Promise} 授权结果
	 */
	async requestAuthorization() {
		if (!this.isAvailable) {
			throw new Error('HealthKit 不可用，请确保在 iOS 设备上运行且已正确配置');
		}

		try {
			const result = await this._requestAuth();
			this.isAuthorized = result.granted;
			return result;
		} catch (error) {
			this.isAuthorized = false;
			throw error;
		}
	}

	/**
	 * 执行授权请求
	 * @private
	 */
	_requestAuth() {
		return new Promise((resolve, reject) => {
			// 优先使用 uni.requireNativePlugin 方式
			try {
				const health = uni.requireNativePlugin("HealthKitPlugin-HealthKitModule");
				health.requestAuthorization({
					readTypes: [
						'stepCount', // 步数
						'heartRate', // 心率
						'distance', // 距离
						'activeEnergy', // 活动能量
						'sleepAnalysis', // 睡眠分析
						'bodyMass', // 体重
						'height' // 身高
					],
					writeTypes: [
						'stepCount' // 可以写入步数数据
					]
				}, (result) => {
					console.log('HealthKit 授权原始结果:', result);
					if (result.success) {
						resolve(result);
					} else {
						reject(new Error(result.error || 'HealthKit 授权失败'));
					}
				});
			} catch (error) {
				// 备用方案：使用 plus.health
				if (plus.health && plus.health.requestAuthorization) {
					plus.health.requestAuthorization({
						readTypes: [
							'stepCount', 'heartRate', 'distance',
							'activeEnergy', 'sleepAnalysis', 'bodyMass', 'height'
						],
						writeTypes: ['stepCount']
					}, (result) => {
						console.log('HealthKit 授权原始结果 (plus.health):', result);

						if (result.success) {
							resolve(result);
						} else {
							reject(new Error(result.error || 'HealthKit 授权失败'));
						}
					});
				} else {
					reject(new Error('HealthKit 授权方法不可用'));
				}
			}
		});
	}

	/**
	 * 获取步数数据
	 * @param {Date} startDate 开始时间
	 * @param {Date} endDate 结束时间
	 * @returns {Promise} 步数数据
	 */
	async getStepCount(startDate, endDate) {
		await this._checkAuthorization();

		return new Promise((resolve, reject) => {
			// 优先使用 uni.requireNativePlugin 方式
			try {
				const health = uni.requireNativePlugin("HealthKitPlugin-HealthKitModule");
				health.getStepCount({
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString()
				}, (result) => {
					if (result.success) {
						resolve({
							value: result.value || 0,
							unit: 'count',
							startDate: startDate,
							endDate: endDate
						});
					} else {
						reject(new Error(result.error || '获取步数失败'));
					}
				});
			} catch (error) {
				// 备用方案
				if (plus.health && plus.health.getStepCount) {
					plus.health.getStepCount({
						startDate: startDate.toISOString(),
						endDate: endDate.toISOString()
					}, (result) => {
						if (result.success) {
							resolve({
								value: result.value || 0,
								unit: 'count',
								startDate: startDate,
								endDate: endDate
							});
						} else {
							reject(new Error(result.error || '获取步数失败'));
						}
					});
				} else {
					reject(new Error('获取步数方法不可用'));
				}
			}
		});
	}

	// ... 其他数据获取方法也按照相同模式修改

	/**
	 * 检查授权状态
	 * @returns {boolean} 是否已授权
	 */
	getAuthorizationStatus() {
		return this.isAuthorized;
	}

	/**
	 * 检查授权状态
	 * @private
	 */
	async _checkAuthorization() {
		if (!this.isAuthorized) {
			throw new Error('请先授权 HealthKit 权限');
		}
	}

	/**
	 * 安全请求授权（包含错误处理）
	 * @returns {Promise} 授权结果
	 */
	async safeRequestAuthorization() {
		try {
			if (!this.isAvailable) {
				throw new Error('HealthKit 功能不可用，请确保在 iOS 设备上运行');
			}

			const result = await this.requestAuthorization();
			return result;
		} catch (error) {
			console.error('HealthKit 授权错误:', error);

			let userMessage = '健康数据授权失败';
			if (error.message.includes('entitlement')) {
				userMessage = '应用缺少健康数据权限配置';
			} else if (error.message.includes('不支持')) {
				userMessage = '您的设备不支持健康数据功能';
			} else if (error.message.includes('不可用')) {
				userMessage = '健康数据功能不可用';
			}

			throw new Error(userMessage);
		}
	}
}

// 创建单例实例
const healthKitManager = new HealthKitManager();

export default healthKitManager;