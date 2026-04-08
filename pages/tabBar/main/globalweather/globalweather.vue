<template>
	<view class="global-weather">
		<!-- 搜索栏 -->
		<view class="search-box">
			<input v-model="searchQuery" placeholder="搜索全球城市 (中文/英文/拼音)" @confirm="handleSearch" />
			<button @click="handleSearch">搜索</button>
			<button @click="getLocalWeather">定位</button>
		</view>

		<!-- 搜索结果列表 -->
		<view v-if="searchResults.length" class="search-results">
			<view v-for="(city, index) in searchResults" :key="index" class="city-item" @click="selectCity(city)">
				<view class="city-main">
					<text class="city-name">{{ city.name }}</text>
					<text class="city-country">{{ city.country }}</text>
				</view>
				<text class="city-path">{{ city.adm1 }} {{ city.adm2 }}</text>
			</view>
		</view>

		<!-- 当前天气 -->
		<view v-if="weatherData" class="weather-card">
			<view class="location-header">
				<text class="flag">{{ getCountryFlag(weatherData.location.country) }}</text>
				<view class="location-info">
					<text class="city">{{ weatherData.location.name }}</text>
					<text class="region">{{ weatherData.location.adm1 }}</text>
				</view>
				<text class="timezone">{{ weatherData.location.timezone }}</text>
			</view>

			<view class="current-weather">
				<image :src="weatherIconUrl(weatherData.current.icon)" class="weather-icon" mode="aspectFit" />
				<text class="temperature">{{ weatherData.current.temp }}°</text>
				<text class="weather-text">{{ weatherData.current.weather }}</text>

				<!-- 分钟级降水 -->
				<view v-if="minutelyRain" class="minutely-rain">
					<text>🌧️ 未来2小时降水: {{ minutelyRain.summary || '数据获取中' }}</text>
				</view>
			</view>

			<view class="details-grid">
				<view class="detail-item">
					<text class="label">体感</text>
					<text class="value">{{ weatherData.current.feelsLike }}°</text>
				</view>
				<view class="detail-item">
					<text class="label">湿度</text>
					<text class="value">{{ weatherData.current.humidity }}%</text>
				</view>
				<view class="detail-item">
					<text class="label">风速</text>
					<text class="value">{{ weatherData.current.windScale }}级</text>
				</view>
				<view class="detail-item">
					<text class="label">气压</text>
					<text class="value">{{ weatherData.current.pressure }}hPa</text>
				</view>
			</view>
		</view>

		<!-- 7天预报 -->
		<view v-if="weatherData && weatherData.forecast" class="forecast-section">
			<text class="section-title">7天预报</text>
			<view class="forecast-list">
				<view v-for="(day, index) in weatherData.forecast" :key="index" class="forecast-day">
					<text class="date">{{ formatDate(day.date) }}</text>
					<image :src="weatherIconUrl(day.iconDay)" class="forecast-icon" mode="aspectFit" />
					<view class="temp-range">
						<text class="max">{{ day.tempMax }}°</text>
						<text class="min">{{ day.tempMin }}°</text>
					</view>
					<text class="weather-day">{{ day.weatherDay }}</text>
					<text class="uv">UV{{ day.uvIndex }}</text>
				</view>
			</view>
		</view>

		<!-- 状态提示 -->
		<view v-if="loading" class="loading">正在获取天气...</view>
		<view v-if="error" class="error">{{ error }}</view>
		<view v-if="fromCache" class="cache-tag">缓存数据</view>
	</view>
</template>

<script>
	// 导入所有需要的函数
	import {
		getGlobalLocalWeather,
		searchCityWeather,
		getMinutelyRain,
		searchCity // 新增：导入城市搜索函数
	} from "../../../api/unitls/qweather.js";
	import protocolHelper from '../../../api/unitls/protocolHelper.js';
	import {
		WeatherForecastEncoder,
		WeatherForecastDecoder
	} from '../../../api/unitls/weatherProtocol.js';

	export default {
		data() {
			return {
				searchQuery: '',
				searchResults: [],
				weatherData: null,
				minutelyRain: null,
				loading: false,
				error: null,
				fromCache: false
			};
		},

		onShow() {
			this.getLocalWeather()
		},

		methods: {
			// 天气图标URL
			weatherIconUrl(iconCode) {
				return 'https://a.hecdn.net/img/common/icon/202106d/' + iconCode + '.png';
			},

			// 搜索城市
			async handleSearch() {
				if (!this.searchQuery.trim()) {
					uni.showToast({
						title: '请输入城市名称',
						icon: 'none'
					});
					return;
				}

				this.loading = true;
				this.error = null;
				this.searchResults = [];

				try {
					console.log('开始搜索城市:', this.searchQuery);

					// 调用导入的 searchCity 函数，而不是 this.searchCity
					const result = await searchCity(this.searchQuery);

					console.log('搜索结果:', result);

					if (result.success) {
						if (result.data && result.data.length > 0) {
							this.searchResults = result.data;
						} else {
							this.error = '未找到该城市';
						}
					} else {
						this.error = result.error || '搜索失败';
					}
				} catch (e) {
					console.error('搜索错误:', e);
					this.error = '搜索失败: ' + e.message;
				}

				this.loading = false;
			},

			// 选择城市
			async selectCity(city) {
				console.log('选择城市:', city);
				this.searchResults = [];
				this.loading = true;
				this.error = null;

				try {
					uni.showLoading({
						title: '获取天气中...'
					});

					const result = await searchCityWeather(city.name, city.adm1);
					console.log("获取天气", result)
					if (result.success) {
						this.weatherData = result.data;
						console.log("2获取天气", this.weatherData)
						this.fromCache = result.fromCache || false;

						// 如果是中国地区，尝试获取分钟级降水
						if (city.country === '中国' && city.lat && city.lon) {
							try {
								const rainData = await getMinutelyRain(city.lat, city.lon);
								this.minutelyRain = rainData;
							} catch (rainError) {
								console.log('分钟级降水获取失败:', rainError);
								// 不影响主天气显示
							}
						}
						console.log('开始测试生成命令');
						const buffer = protocolHelper.buildCurrentWeatherCommand(
							this.weatherData,
							this.weatherData.location
						);

						if (buffer) {
							const bytes = new Uint8Array(buffer);
							console.log('✅ 测试生成的命令:', protocolHelper.bytesToHex(bytes));
							// 预期输出: e0 00 15 4b 05 01 00 00 10 34 65 01 01 49 4b 44 03 f9 4a e6 b5 a6 e5 8f a3
						} else {
							console.error('❌ 测试生成失败');
						}
						uni.showToast({
							title: '获取成功',
							icon: 'success'
						});
					} else {
						this.error = result.error || '获取天气失败';
						uni.showToast({
							title: this.error,
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('选择城市错误:', e);
					this.error = '获取天气失败';
					uni.showToast({
						title: '获取失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
					this.loading = false;
				}
			},

			// 获取本地天气
			async getLocalWeather() {
				this.loading = true;
				this.error = null;

				try {
					uni.showLoading({
						title: '定位中...'
					});
					const result = await getGlobalLocalWeather();
					// console.log('开始获取本地天气', result);
					if (result.success) {
						this.weatherData = result.data;
						this.fromCache = result.fromCache || false;
						// console.log('开始获取本地天气', this.weatherData);
						// 尝试获取分钟级降水
						if (this.weatherData && this.weatherData.location) {
							const {
								lat,
								lon
							} = this.weatherData.location;
							try {
								const rainData = await getMinutelyRain(lat, lon);
								this.minutelyRain = rainData;
							} catch (rainError) {
								console.log('分钟级降水获取失败:', rainError);
							}
						}
						uni.showToast({
							title: '获取成功',
							icon: 'success'
						});
						console.log('开始测试生成命令');

						const encoder = new WeatherForecastEncoder();
						const protocolData = encoder.encodeFromWeatherData(this.weatherData, {
							cmd: 0x05,
							version: 0x01,
							key: 0x01
						});
						console.log('7this.weatherDataID:', encoder.getHexString());
						const buffer = protocolHelper.buildCurrentWeatherCommand(
							this.weatherData,
							this.weatherData.location
						);

						if (buffer) {
							const bytes = new Uint8Array(buffer);
							console.log('✅ this.weatherDataID:', protocolHelper.bytesToHex(bytes));
							// 预期输出: e0 00 15 4b 05 01 00 00 10 34 65 01 01 49 4b 44 03 f9 4a e6 b5 a6 e5 8f a3
						} else {
							console.error('❌ 测试生成失败');
						}
					} else {
						this.error = result.error || '获取位置失败';
						uni.showToast({
							title: this.error,
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('本地天气错误:', e);
					this.error = '获取天气失败';
					uni.showToast({
						title: '获取失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
					this.loading = false;
				}
			},

			// 获取国旗
			getCountryFlag(country) {
				const flags = {
					'中国': '🇨🇳',
					'美国': '🇺🇸',
					'英国': '🇬🇧',
					'日本': '🇯🇵',
					'法国': '🇫🇷',
					'德国': '🇩🇪',
					'韩国': '🇰🇷',
					'俄罗斯': '🇷🇺',
					'澳大利亚': '🇦🇺',
					'加拿大': '🇨🇦',
					'意大利': '🇮🇹',
					'西班牙': '🇪🇸'
				};
				return flags[country] || '🌍';
			},

			// 格式化日期
			formatDate(dateStr) {
				if (!dateStr) return '';

				try {
					const date = new Date(dateStr);
					const today = new Date();

					if (date.toDateString() === today.toDateString()) {
						return '今天';
					}

					const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
					const month = date.getMonth() + 1;
					const day = date.getDate();
					const weekDay = weekDays[date.getDay()];

					return month + '/' + day + ' ' + weekDay;
				} catch (e) {
					console.error('日期格式化错误:', e);
					return dateStr;
				}
			}
		}
	};
</script>

<style>
	/* 样式保持不变 */
	.global-weather {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 30rpx;
	}

	.search-box {
		display: flex;
		gap: 15rpx;
		margin-bottom: 30rpx;
	}

	.search-box input {
		flex: 1;
		background: rgba(255, 255, 255, 0.95);
		padding: 25rpx;
		border-radius: 50rpx;
		font-size: 28rpx;
	}

	.search-box button {
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		background: #ff6b6b;
		color: white;
		font-size: 32rpx;
		line-height: 90rpx;
		padding: 0;
		margin: 0;
	}

	.search-results {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		max-height: 600rpx;
		overflow-y: auto;
	}

	.city-item {
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.city-item:active {
		background: #f5f5f5;
	}

	.city-main {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.city-name {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
	}

	.city-country {
		font-size: 26rpx;
		color: #666;
		background: #f0f0f0;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}

	.city-path {
		font-size: 26rpx;
		color: #999;
		margin-top: 8rpx;
		display: block;
	}

	.weather-card {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 30rpx;
		padding: 40rpx;
		margin-bottom: 30rpx;
		backdrop-filter: blur(10px);
	}

	.location-header {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.flag {
		font-size: 60rpx;
		margin-right: 20rpx;
	}

	.location-info {
		flex: 1;
	}

	.city {
		font-size: 48rpx;
		font-weight: bold;
		color: white;
		display: block;
	}

	.region {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.7);
	}

	.timezone {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.6);
		background: rgba(255, 255, 255, 0.1);
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
	}

	.current-weather {
		text-align: center;
		margin: 40rpx 0;
	}

	.weather-icon {
		width: 180rpx;
		height: 180rpx;
	}

	.temperature {
		font-size: 140rpx;
		color: white;
		font-weight: 200;
		display: block;
		line-height: 1;
	}

	.weather-text {
		font-size: 40rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-top: 10rpx;
		display: block;
	}

	.minutely-rain {
		margin-top: 20rpx;
		padding: 20rpx;
		background: rgba(100, 149, 237, 0.3);
		border-radius: 15rpx;
		color: white;
		font-size: 28rpx;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20rpx;
		margin-top: 40rpx;
		padding-top: 30rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.2);
	}

	.detail-item {
		text-align: center;
	}

	.label {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.6);
		display: block;
		margin-bottom: 8rpx;
	}

	.value {
		font-size: 32rpx;
		color: white;
		font-weight: bold;
	}

	.forecast-section {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
		padding: 30rpx;
	}

	.section-title {
		color: white;
		font-size: 32rpx;
		margin-bottom: 20rpx;
		display: block;
	}

	.forecast-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.forecast-day {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.1);
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.date {
		color: rgba(255, 255, 255, 0.8);
		font-size: 28rpx;
		width: 150rpx;
	}

	.forecast-icon {
		width: 60rpx;
		height: 60rpx;
		margin: 0 20rpx;
	}

	.temp-range {
		width: 120rpx;
		text-align: center;
	}

	.max {
		color: white;
		font-size: 32rpx;
		font-weight: bold;
		margin-right: 10rpx;
	}

	.min {
		color: rgba(255, 255, 255, 0.6);
		font-size: 28rpx;
	}

	.weather-day {
		flex: 1;
		color: rgba(255, 255, 255, 0.9);
		font-size: 28rpx;
		text-align: center;
	}

	.uv {
		color: #ffc107;
		font-size: 24rpx;
		background: rgba(255, 193, 7, 0.2);
		padding: 4rpx 12rpx;
		border-radius: 10rpx;
	}

	.loading,
	.error,
	.cache-tag {
		text-align: center;
		padding: 40rpx;
		color: white;
		font-size: 28rpx;
	}

	.error {
		color: #ff6b6b;
	}

	.cache-tag {
		color: #ffc107;
		font-size: 24rpx;
	}
</style>