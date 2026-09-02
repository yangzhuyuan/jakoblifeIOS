<template>
	<view class="pagestyle">
		<view class="pagestyle_1">
			<view class="viewstyle">
				<view class="titlestyle">{{$t("收缩压")}}:</view>
				<view class="titlestyle_1">
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="shousuoya1" />
					<view class="linestyle1"></view>
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="shousuoya2" />
				</view>
			</view>
			<view class="linestyle"></view>
			<view class="viewstyle">
				<view class="titlestyle">{{$t("舒张压")}}:</view>
				<view class="titlestyle_1">
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="shuzhangya1" />
					<view class="linestyle1"></view>
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="shuzhangya2" />
				</view>
			</view>
			<view class="linestyle"></view>
			<view class="viewstyle">
				<view class="titlestyle">{{$t("脉搏")}}:</view>
				<view class="titlestyle_1">
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="maibo1" />
					<view class="linestyle1"></view>
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="maibo2" />
				</view>
			</view>
			<view class="linestyle"></view>
			<view class="viewstyle">
				<view class="titlestyle">{{$t("血氧")}}:</view>
				<view class="titlestyle_1">
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="xeuyang1" />
					<view class="linestyle1"></view>
					<input class="inputstyles" type="number" :placeholder="$t('请输入')" v-model="xeuyang2" />
				</view>
			</view>
		</view>
		<button class="buttonstyle" @click="clickset()">{{$t("设置新的正常范围")}}</button>
		<view class="tip-card">
			<image class="tip-hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			<view class="tip-content">
				<view class="tip-text tip-text-first">{{$t("警报使用提示1")}}</view>
				<view class="tip-text">{{$t("警报使用提示2")}}</view>
			</view>
		</view>
		<view class="section-line"></view>
		<view class="user-card">
			<view class="user-row">
				<image :src="avatar" class="user-avatar">
				</image>
				<view class="user-name-wrap">
					<view class="user-name">
						{{$t("用户1")+'：'+ name}}
					</view>
				</view>
				<switch @change="switch1Change1" class="user-switch" :checked="swicth" color="#0686CC" />
			</view>
			<view class="container" v-show="jingbaoshow2">
				<view class="alert-label">{{$t("收缩压")}}{{$t("警报")}}:</view>
				<view class="alert-value">{{jingbao2}}</view>
			</view>
			<view class="container" v-show="jingbaoshow1">
				<view class="alert-label">{{$t("舒张压")}}{{$t("警报")}}:</view>
				<view class="alert-value">{{jingbao1}}</view>
			</view>
			<view class="container" v-show="jingbaoshow3">
				<view class="alert-label">{{$t("脉搏")}}{{$t("警报")}}:</view>
				<view class="alert-value">{{jingbao3}}</view>
			</view>
			<view class="container" v-show="jingbaoshow4">
				<view class="alert-label">{{$t("血氧")}}{{$t("警报")}}:</view>
				<view class="alert-value">{{jingbao4}}</view>
			</view>
			<view class="card-divider"></view>
		</view>
		<view class="list-wrap">
			<view class="user-card" v-for="(item,index) in filterList" :key="item.id">
				<view class="user-row">
					<image
						:src="item.shareAvatar==='' || item.shareAvatar===null? '/static/icons/80x80.png':item.shareAvatar"
						class="user-avatar">
					</image>
					<view class="user-name-wrap">
						<view class="user-name">
							{{$t("用户")+'：'+ item.shareName}}
						</view>
					</view>
					<switch @change="switch1Change(item.swicth,index)" class="user-switch" :checked="item.swicth"
						color="#0686CC" />
				</view>
				<view class="container" v-show="item.jingbaoshow2">
					<view class="alert-label">{{$t("收缩压")}}{{$t("警报")}}:</view>
					<view class="alert-value">{{item.jingbao2}}</view>
				</view>
				<view class="container" v-show="item.jingbaoshow1">
					<view class="alert-label">{{$t("舒张压")}}{{$t("警报")}}:</view>
					<view class="alert-value">{{item.jingbao1}}</view>
				</view>
				<view class="container" v-show="item.jingbaoshow3">
					<view class="alert-label">{{$t("脉搏")}}{{$t("警报")}}:</view>
					<view class="alert-value">{{item.jingbao3}}</view>
				</view>
				<view class="container" v-show="item.jingbaoshow4">
					<view class="alert-label">{{$t("血氧")}}{{$t("警报")}}:</view>
					<view class="alert-value">{{item.jingbao4}}</view>
				</view>
				<view class="card-divider"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: {
			...mapState(['info'])
		},
		data() {
			return {
				//舒张压
				shuzhangya1: '',
				shuzhangya2: '',
				//收缩压
				shousuoya1: '',
				shousuoya2: '',
				//脉搏
				maibo1: '',
				maibo2: '',
				//血氧
				xeuyang1: '',
				xeuyang2: '',
				filterList: [],
				avatar: '',
				name: '',
				jingbao1: '',
				jingbao2: '',
				jingbao3: '',
				jingbao4: '',
				jingbaoshow1: false,
				jingbaoshow2: false,
				jingbaoshow3: false,
				jingbaoshow4: false,
				swicth: false,
				letnewtimers: null,
				listletnewtimers: null,
			}
		},

		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t("警报")
			})
			// 设置用户头像和名称
			that.avatar = that.info.avatar || '/static/icons/80x80.png';
			that.name = that.info.nickName || that.info.userName;
			// 定义存储键和对应的变量名
			const storageKeys = [{
					key: "shuzhangyaId1",
					variable: "shuzhangya1"
				},
				{
					key: "shuzhangyaId2",
					variable: "shuzhangya2"
				},
				{
					key: "shousuoyaId1",
					variable: "shousuoya1"
				},
				{
					key: "shousuoyaId2",
					variable: "shousuoya2"
				},
				{
					key: "maiboId1",
					variable: "maibo1"
				},
				{
					key: "maiboId2",
					variable: "maibo2"
				},
				{
					key: "xeuyang1",
					variable: "xeuyang1"
				},
				{
					key: "xeuyang2",
					variable: "xeuyang2"
				},
				{
					key: "xueyang",
					variable: "xueyang"
				},
				{
					key: "swichs",
					variable: "swicth"
				}
			];
			// 获取存储信息
			uni.getStorageInfo({
				success(res) {
					res.keys.forEach(key => {
						const item = storageKeys.find(item => item.key === key);
						if (item) {
							that[item.variable] = uni.getStorageSync(key);
						}
					});
					if (that.swicth === true) {
						that.startIntervalTimer();
					}
					that.listletnewtimers = setInterval(() => {
						that.receiver_list();
					}, 1000);
				}
			});
		},

		onUnload() {
			this.clearIntervalTimer()
			if (this.listletnewtimers) {
				clearInterval(this.listletnewtimers);
				this.listletnewtimers = null;
			}
		},

		methods: {
			// 定义一个函数来获取最新的血压和心率数据
			getLatestPressureAndHeartRate(data, slaveSn) {
				const filteredData = data.filter(item => item.slaveSn === slaveSn);
				return {
					lowPressure: this.getRegisterVal(filteredData, 'register', 'lowPressure'),
					highPressure: this.getRegisterVal(filteredData, 'register', 'highPressure'),
					pulse: this.getRegisterVal(filteredData, 'register', 'heartrate'),
					lowPressureTime: this.findValue(filteredData, "register", "lowPressure").updateTime,
					highPressureTime: this.findValue(filteredData, "register", "highPressure").updateTime,
					heartRateTime: this.findValue(filteredData, "register", "heartrate").updateTime
				};
			},
			// 定义一个通用的警报判断函数
			checkAlert(value, minThreshold, maxThreshold, alertProperty, alertShowProperty) {
				if (minThreshold !== "" && maxThreshold !== "") {
					if (parseInt(value) <= parseInt(minThreshold) || parseInt(maxThreshold) <= parseInt(value)) {
						this[alertProperty] = value;
						this[alertShowProperty] = true;
					} else {
						this[alertShowProperty] = false;
					}
				} else {
					this[alertShowProperty] = false;
				}
			},
			getRegisterVal(data, type, key) {
				const value = this.findValue(data, type, key);
				return value.registerVal !== null ? value.registerVal : "-/-";
			},
			findValue(arr, key, value) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i][key] == value) {
						return arr[i]
					}
				}
				return null
			},
			//自己的警报开关
			switch1Change1(e) {
				if (e.detail.value === false) {
					this.swicth = false;
					this.resetAlarms();
					this.clearIntervalTimer();
				} else if (e.detail.value === true) {
					this.swicth = true;
					this.startIntervalTimer();
				}
				uni.setStorageSync("swichs", this.swicth);
			},
			// 别人共享的警报开关
			switch1Change(swicth, id) {
				const item = this.filterList[id];
				if (swicth === true) {
					item.swicth = false;
					item.jingbaoshow1 = false;
					item.jingbaoshow2 = false;
					item.jingbaoshow3 = false;
					item.jingbaoshow4 = false;
				} else {
					item.swicth = true;
					// 定义检查报警显示的通用函数
					const checkAlarmShow = (jingbao, min, max, jingbaoshow) => {
						return jingbao !== "" && min !== "" && max !== "";
					};
					item.jingbaoshow1 = checkAlarmShow(item.jingbao1, this.shuzhangya1, this.shuzhangya2);
					item.jingbaoshow2 = checkAlarmShow(item.jingbao2, this.shousuoya1, this.shousuoya2);
					item.jingbaoshow3 = checkAlarmShow(item.jingbao3, this.maibo1, this.maibo2);
					item.jingbaoshow4 = checkAlarmShow(item.jingbao4, this.xeuyang1, this.xeuyang2);
				}
				// 保存到本地存储
				uni.setStorageSync("switchList", this.filterList);
			},
			// 重置所有报警显示
			resetAlarms() {
				this.jingbaoshow1 = false;
				this.jingbaoshow2 = false;
				this.jingbaoshow3 = false;
				this.jingbaoshow4 = false;
			},
			// 清除定时器
			clearIntervalTimer() {
				if (this.letnewtimers) {
					clearInterval(this.letnewtimers);
					this.letnewtimers = null;
				}
			},
			// 启动定时器
			startIntervalTimer() {
				this.letnewtimers = setInterval(() => {
					this.list_recipe();
				}, 1000);
			},
			// 根据状态值返回不同的样式对象
			getStatusColor1(status) {
				return {
					color: status === 0 ? 'gray' : 'black'
				};
			},
			bindTimeChange(e) {
				this.index = e.detail.value
			},
			// 定义验证函数
			// 重新定义：同时完成
			// 1. 成对互斥
			// 2. value1 ≥ key1
			// 3. value2 ≤ key2
			// 4. value1 ≤ value2
			validateInput(value1, value2, messageKey, key1, key2, eroomsg) {
				// 空值互斥
				const empty1 = value1 === '' || value1 == null;
				const empty2 = value2 === '' || value2 == null;
				if ((empty1 && !empty2) || (!empty1 && empty2)) {
					uni.showToast({
						title: this.$t(messageKey) + '/' + this.$t(eroomsg),
						icon: 'none'
					});
					return false;
				}
				// 都空——认为这组跳过，返回 true（后面可改）
				if (empty1 && empty2) return true;

				// 数值校验
				const v1 = Number(value1);
				const v2 = Number(value2);
				if (v1 < key1) {
					uni.showToast({
						title: this.$t(eroomsg) + "：" + this.$t("最小") + "：" + key1,
						icon: 'none'
					});
					return false;
				} else if (v2 > key2) {
					uni.showToast({
						title: this.$t(eroomsg) + "：" + this.$t("最大") + "：" + key2,
						icon: 'none'
					});
					return false;
				} else if (v1 > v2) {
					uni.showToast({
						title: this.$t(eroomsg) + "：" + this.$t("需要小于"),
						icon: 'none'
					});
					return false;
				}
				return true;
			},
			//点击确认设置
			clickset() {
				let that = this;
				// 验证输入
				if (!that.validateInput(that.shuzhangya1, that.shuzhangya2, "舒张压有未录入", 30, 195, "舒张压输入值超出范围")) return;
				if (!that.validateInput(that.shousuoya1, that.shousuoya2, "收缩压有未录入", 60, 255, "收缩压输入值超出范围")) return;
				if (!that.validateInput(that.maibo1, that.maibo2, "脉搏有未录入", 30, 200, "脉搏输入值超出范围")) return;
				if (!that.validateInput(that.xeuyang1, that.xeuyang2, "血氧有未录入")) return;
				// 验证血氧值是否超过100
				if (that.xeuyang1 > 100 || that.xeuyang2 > 100) {
					uni.showToast({
						title: that.$t("血氧最大值不能超过"),
						icon: 'none'
					});
					return;
				}
				// 保存到本地存储
				const storageKeys = [{
						key: "shuzhangyaId1",
						value: that.shuzhangya1
					},
					{
						key: "shuzhangyaId2",
						value: that.shuzhangya2
					},
					{
						key: "shousuoyaId1",
						value: that.shousuoya1
					},
					{
						key: "shousuoyaId2",
						value: that.shousuoya2
					},
					{
						key: "maiboId1",
						value: that.maibo1
					},
					{
						key: "maiboId2",
						value: that.maibo2
					},
					{
						key: "xeuyang1",
						value: that.xeuyang1
					},
					{
						key: "xeuyang2",
						value: that.xeuyang2
					}
				];
				storageKeys.forEach(item => {
					uni.setStorageSync(item.key, item.value);
				});
				// 重新从本地存储获取数据
				storageKeys.forEach(item => {
					that[item.key] = uni.getStorageSync(item.key);
				});
				// 提示设定成功
				uni.showToast({
					title: that.$t("设定成功"),
					icon: 'none'
				});
			},
			list_recipe() {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_list_recipe,
					method: 'POST',
					data: {
						userId: uni.getStorageSync("userid")
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						if (res.data.code == 200) {
							// 获取氧含量
							let oxygen = that.getRegisterVal(res.data.data, "register", "oxygen");
							// 获取两个设备的血压和心率数据
							const pressureData1 = that.getLatestPressureAndHeartRate(res.data.data, "2");
							const pressureData2 = that.getLatestPressureAndHeartRate(res.data.data, "3");
							// 初始化最终结果
							let lowPressure = "";
							let highPressure = "";
							let heartrate = "";
							// 根据时间戳选择最新的血压和心率数据
							if (pressureData1.lowPressureTime > pressureData2.lowPressureTime) {
								lowPressure = pressureData1.lowPressure;
								highPressure = pressureData1.highPressure;
							} else if (pressureData1.lowPressureTime < pressureData2.lowPressureTime) {
								lowPressure = pressureData2.lowPressure;
								highPressure = pressureData2.highPressure;
							}
							if (pressureData1.heartRateTime > pressureData2.heartRateTime) {
								heartrate = pressureData1.pulse;
							} else if (pressureData1.heartRateTime < pressureData2.heartRateTime) {
								heartrate = pressureData2.pulse;
							}
							if (that.swicth === true) {
								// 检查舒张压警报
								that.checkAlert(lowPressure, that.shuzhangya1, that.shuzhangya2, "jingbao1",
									"jingbaoshow1");
								if (that.jingbaoshow1) {
									that.jingbao1 += "mmHg"; // 如果有警报，添加百分号
								}
								// 检查收缩压警报
								that.checkAlert(highPressure, that.shousuoya1, that.shousuoya2, "jingbao2",
									"jingbaoshow2");
								if (that.jingbaoshow2) {
									that.jingbao2 += "mmHg"; // 如果有警报，添加百分号
								}
								// 检查心率警报
								that.checkAlert(heartrate, that.maibo1, that.maibo2, "jingbao3", "jingbaoshow3");
								if (that.jingbaoshow3) {
									that.jingbao3 += "BPM"; // 如果有警报，添加百分号
								}
								// 检查血氧警报
								that.checkAlert(oxygen, that.xeuyang1, that.xeuyang2, "jingbao4", "jingbaoshow4");
								if (that.jingbaoshow4) {
									that.jingbao4 += "%"; // 如果有警报，添加百分号
								}
							} else {
								that.clearIntervalTimer()
							}
						}
					}
				})
			},
			//查看别人分享给我的数据点列表
			receiver_list() {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_receiver_list,
					method: 'POST',
					data: {
						receiverId: uni.getStorageSync("userid")
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(pending) {
						// console.log("别人分享的警报", pending)
						if (pending.data.code === 200 && pending.data.data && pending.data.data.length > 0) {
							that.filterList = []
							const pendingdata = pending.data.data
							uni.getStorageInfo({
								success(res) {
									if (res.keys.includes("switchList")) {
										if (uni.getStorageSync("switchList").length === pendingdata
											.length) {
											let switchList = uni.getStorageSync("switchList");
											let updatedList = [];
											// 遍历 switchList
											switchList.forEach(item => {
												item.dataPoints.forEach(dataPoint => {
													let value = parseInt(dataPoint
														.registerVal);
													switch (dataPoint.register) {
														case "lowPressure":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.shuzhangya1, that
																.shuzhangya2,
																"jingbaoshow1",
																"jingbao1", "mmHg");
															break;
														case "highPressure":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.shousuoya1, that
																.shousuoya2,
																"jingbaoshow2",
																"jingbao2", "mmHg");
															break;
														case "heartrate":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.maibo1, that.maibo2,
																"jingbaoshow3",
																"jingbao3", "BPM");
															break;
														case "oxygen":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.xeuyang1, that
																.xeuyang2,
																"jingbaoshow4",
																"jingbao4", "%");
															break;
													}
												});
												updatedList.push(item);
											});
											// 保存更新后的列表
											uni.setStorageSync("switchList", updatedList);
											// 更新 filterList
											that.filterList = uni.getStorageSync("switchList");
										} else {
											let array1 = uni.getStorageSync("switchList");
											let array2 = [];
											// 遍历 pendingdata
											pendingdata.forEach(item => {
												item.swicth = false;
												item.jingbaoshow1 = false;
												item.jingbao1 = "";
												item.jingbaoshow2 = false;
												item.jingbao2 = "";
												item.jingbaoshow3 = false;
												item.jingbao3 = "";
												item.dataPoints.forEach(dataPoint => {
													let value = parseInt(dataPoint
														.registerVal);
													switch (dataPoint.register) {
														case "lowPressure":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.shuzhangya1, that
																.shuzhangya2,
																"jingbaoshow1",
																"jingbao1", "mmHg");
															break;
														case "highPressure":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.shousuoya1, that
																.shousuoya2,
																"jingbaoshow2",
																"jingbao2", "mmHg");
															break;
														case "heartrate":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.maibo1, that.maibo2,
																"jingbaoshow3",
																"jingbao3", "BPM");
															break;
														case "oxygen":
															that.checkAlarm(item, dataPoint
																.register, value, that
																.xeuyang1, that
																.xeuyang2,
																"jingbaoshow4",
																"jingbao4", "%");
															break;
													}
												});
												array2.push(item);
											});
											let combinedArray = array2.concat(
												array1.filter(item => !array2.some(
													longItem => longItem.id === item.id))
											);
											// 保存更新后的列表
											uni.setStorageSync("switchList", combinedArray);
											// 更新 filterList
											that.filterList = uni.getStorageSync("switchList");
										}
									} else {
										// 遍历 pendingdata
										for (const item of pendingdata) {
											item.swicth = false;
											item.jingbaoshow1 = false;
											item.jingbao1 = "";
											item.jingbaoshow2 = false;
											item.jingbao2 = "";
											item.jingbaoshow3 = false;
											item.jingbao3 = "";
											item.jingbaoshow4 = false;
											item.jingbao4 = "";
											// 遍历 dataPoints
											for (const dataPoint of item.dataPoints) {
												let value = parseInt(dataPoint.registerVal);
												switch (dataPoint.register) {
													case "lowPressure":
														({
															jingbaoshow1: item.jingbaoshow1,
															jingbao1: item.jingbao1
														} = that.checkValue(
															value,
															that.shuzhangya1,
															that.shuzhangya2,
															item.swicth,
															item.jingbaoshow1,
															item.jingbao1
														));
														// 在 jingbao4 的值后面加上 %
														if (item.jingbao1 !== null && item.jingbao1 !==
															undefined) {
															item.jingbao1 = `${item.jingbao1}mmHg`;
														}
														break;
													case "highPressure":
														({
															jingbaoshow2: item.jingbaoshow2,
															jingbao2: item.jingbao2
														} = that.checkValue(
															value,
															that.shousuoya1,
															that.shousuoya2,
															item.swicth,
															item.jingbaoshow2,
															item.jingbao2
														));
														// 在 jingbao4 的值后面加上 %
														if (item.jingbao2 !== null && item.jingbao2 !==
															undefined) {
															item.jingbao2 = `${item.jingbao2}mmHg`;
														}
														break;
													case "heartrate":
														({
															jingbaoshow3: item.jingbaoshow3,
															jingbao3: item.jingbao3
														} = that.checkValue(
															value,
															that.maibo1,
															that.maibo2,
															item.swicth,
															item.jingbaoshow3,
															item.jingbao3
														));
														// 在 jingbao3 的值后面加上 BPM
														if (item.jingbao3 !== null && item.jingbao3 !==
															undefined) {
															item.jingbao3 = `${item.jingbao3}BPM`;
														}
														break;
													case "oxygen":
														({
															jingbaoshow4: item.jingbaoshow4,
															jingbao4: item.jingbao4
														} = that.checkValue(
															value,
															that.xeuyang1,
															that.xeuyang2,
															item.swicth,
															item.jingbaoshow4,
															item.jingbao4
														));
														// 在 jingbao4 的值后面加上 %
														if (item.jingbao4 !== null && item.jingbao4 !==
															undefined) {
															item.jingbao4 = `${item.jingbao4}%`;
														}
														break;
												}
											}
											that.filterList.push(item);
										}
									}
								}
							})
						} else {
							that.filterList = []
						}
					},
				})
			},
			// 定义一个通用的检查函数
			checkValue(value, min, max, switchFlag, showFlag, result) {
				if (min >= 0 && max >= 0 && min !== "" && max !== "") {
					if (value <= max && value >= min) {
						showFlag = false;
						result = "";
					} else {
						if (switchFlag) {
							showFlag = true;
							result = value;
						} else {
							showFlag = false;
							result = "";
						}
					}
				}
				return {
					showFlag,
					result
				};
			},
			// 定义报警逻辑的通用函数
			checkAlarm(item, register, value, min, max, showKey, alarmKey, unit) {
				if (min !== "" && max !== "" && value !== "") {
					if ((value >= min && value <= max) || value <= min && value >= max) {
						item[showKey] = false;
						item[alarmKey] = "";
					} else {
						if (item.swicth === false) {
							item[showKey] = false;
							item[alarmKey] = "";
						} else {
							item[showKey] = true;
							item[alarmKey] = value + unit;
						}
					}
				} else {
					item[showKey] = false;
					item[alarmKey] = "";
				}
				// console.log(min, item[showKey])
				// console.log(max, value)
				// console.log(item.swicth)
			},
		}
	}
</script>

<style scoped>
	.pagestyle {
		min-height: 100vh;
		padding: 18px 16px calc(28px + env(safe-area-inset-bottom));
		box-sizing: border-box;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
	}

	.pagestyle_1 {
		display: flex;
		justify-content: center;
		flex-direction: column;
		background: #ffffff;
		border-radius: 22px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		overflow: hidden;
	}

	.viewstyle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 18px;
	}

	.titlestyle {
		font-size: 16px;
		font-weight: 500;
		color: #222222;
	}

	.titlestyle_1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
	}

	.inputstyles {
		width: 78px;
		height: 36px;
		line-height: 36px;
		text-align: center;
		font-size: 14px;
		font-weight: 400;
		color: #222222;
		background-color: #f5f7fa;
		border-radius: 8px;
		padding: 0 6px;
	}

	.linestyle1 {
		background: #3298F7;
		height: 3px;
		width: 12px;
		margin: 0 8px;
		border-radius: 2px;
	}

	.linestyle {
		background: #eef1f5;
		height: 1px;
		margin: 0 18px;
	}

	.buttonstyle {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		font-weight: 600;
		height: 48px;
		line-height: 48px;
		width: 100%;
		margin: 28px 0 0;
		border-radius: 24px;
		background: #3298F7;
		color: #ffffff;
		border: none;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.buttonstyle::after {
		border: none;
	}

	.tip-card {
		margin-top: 20px;
		background: #e8f3ff;
		border-radius: 16px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		overflow: hidden;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 12px 12px 12px 16px;
	}

	.tip-content {
		flex: 1;
		min-width: 0;
		padding-left: 10px;
	}

	.tip-hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.tip-text {
		font-size: 13px;
		font-weight: 400;
		color: #3298F7;
		line-height: 1.55;
	}

	.tip-text-first {
		padding-bottom: 6px;
	}

	.section-line {
		height: 0;
		background: transparent;
		margin: 0 0 16px;
	}

	.user-card {
		background: #ffffff;
		border-radius: 22px;
		box-shadow: 0 6px 18px rgba(80, 120, 170, 0.08);
		margin-bottom: 12px;
		overflow: hidden;
	}

	.user-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 16px;
	}

	.user-avatar {
		border-radius: 50%;
		width: 40px;
		height: 40px;
		border: none;
		flex-shrink: 0;
		background: #f4f7fb;
	}

	.user-name-wrap {
		flex: 2;
		margin-left: 12px;
		min-width: 0;
	}

	.user-name {
		font-weight: 500;
		font-size: 16px;
		color: #222222;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-switch {
		transform: scale(0.85);
		flex-shrink: 0;
	}

	.container {
		color: #e54d42;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
		gap: 8px;
		margin: 0 16px 12px 16px;
		padding: 10px 12px;
		background: #fef2f2;
		border-radius: 10px;
	}

	.alert-label {
		font-size: 14px;
		font-weight: 600;
	}

	.alert-value {
		font-size: 14px;
		font-weight: 500;
	}

	.card-divider {
		height: 0;
		background: transparent;
	}

	.list-wrap {
		padding-bottom: 80px;
	}
</style>