<template>
	<view style="color: black;height: 100vh;background: #EFEFF4;">
		<view>
			<view style="padding:20px;color: black;font-weight: 400;font-size: 16px;">
				{{SELECT_TYPE==="0" ? $t('请选择血压计型号') : $t('请选择体脂秤型号')}}
			</view>
			<view class="list-container" v-if="listshow">
				<view class="list-item" :class="index == active ? 'active' : ''" v-for="(item, index) in list"
					:key="index">
					<view class="list_item_bg" @click="check_click(index,item.modelConnectType,item.name)">
						<image style="width: 100%;object-fit: contain;margin-top: 10px;" mode="aspectFit"
							:src="item.modelPicturePath" />
						<view style="text-align: center;margin-bottom: 10px;margin-top: 10px;">{{item.name === "BPW6" ? "U19M" : item.name}}</view>
					</view>
				</view>
			</view>
			<view style="text-align: center;" v-else>
				<view style="margin-top: 100px;font-weight: bold;">{{$t("暂无设备型号数据")}}</view>
			</view>
		</view>
		<view v-if="SHEBEI==='0'" class="button_bg_view">
			<button class="button_bg" plain="true" :style="getbutton(active)" @tap="True()">{{$t('确定')}}</button>
			<button class="button_bg_1" plain="true" style="margin-top: 10px;" @tap="Unbind()">{{$t('暂不绑定')}}</button>
		</view>
		<view v-else class="button_bg_view">
			<button class="button_bg" plain="true" :style="getbutton(active)" @tap="True()">{{$t('下一步')}}</button>
			<view class="viewstylesss" @click="NOclick()">{{$t("不知道设备型号")}}</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';



	// 设备图片映射
	const DEVICE_IMAGES = {
		zh: {
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
		},
		default: {
			30000: '/static/image/shoubiao1.png',
			30001: '/static/image/BPW6.jpg',
			20000: '/static/image/tizhi1.jpg',
			20001: '/static/image/tizhi1.jpg',
			10000: '/static/image/xueya1.png',
			10001: '/static/image/xueya1.png',
			10002: '/static/image/xueya1.png',
			10003: '/static/image/xueya1.png',
			10004: '/static/image/xueya1.png',
			10005: '/static/image/xueya1.png',
			10006: '/static/image/xueya1.png'
		}
	}

	export default {

		computed: {
			...mapState(['tokens'])
		},

		data() {
			return {
				per: 0,
				listshow: true,
				PageSize: '0',
				list: [],
				picture: '../../../static/image.png',
				active: this.$t("未选"),
				modelConnectType: '',
				SELECT_TYPE: '',
				name: '',
				SHEBEI: '',
			}
		},


		onShow() {
			let that = this
			uni.setNavigationBarTitle({
				title: that.$t('绑定设备')
			})
			that.per = 1
			that.getlist()
		},

		/*下拉刷新*/
		onPullDownRefresh() {
			this.per = 1
			this.getlist()
		},
		/*上拉刷新*/
		onReachBottom() {
			this.per++
			this.getlist()
		},

		onLoad(opt) {
			// console.log("当前页面Bind_page:", "上个页面带过来的数据----------" + JSON.stringify(opt))
			this.SELECT_TYPE = opt.SELECT_TYPE
			this.SHEBEI = opt.SHEBEI
		},

		methods: {
			check_click(index, modelConnectType, name) {
				this.active = index;
				this.modelConnectType = modelConnectType
				this.name = name
			},

			getbutton(bg) {
				return {
					background: bg == this.$t("未选") ? "#DBDBDB" : "#3298F7"
				}
			},

			True() {
				if (this.active == this.$t("未选")) {
					uni.showToast({
						title: this.SELECT_TYPE === "0" ? this.$t('请选择血压计型号') : this.$t(
							'请选择体脂秤型号'),
						icon: "none"
					})
					return
				} else {
					// console.log("0-扫码  1-蓝牙 2-WiFi设备类型：" + this.modelConnectType)
					uni.navigateTo({
						url: "../Bing_page/Bind_page_2?modelConnectType=" + this.modelConnectType +
							"&SELECT_TYPE=" + this.SELECT_TYPE + "&name=" + this.name
						// url: '../../Bind/Bing_page/Bing_page_1?SELECT_TYPE=' + this.SELECT_TYPE +
						// 	"&modelConnectType=" + this.modelConnectType
					})
				}
			},
			Unbind() {
				uni.switchTab({
					url: "/pages/tabBar/main/Main"
				})
			},


			NOclick() {
				// const lan = uni.getLocale();
				// if (lan == 'zh-Hans' || lan == 'zh-Hant') {
				// 	uni.navigateTo({
				// 		url: "../../Bind/Bing_page/helpcenterss?id=1153"
				// 	})
				// } else {
				// 	uni.navigateTo({
				// 		url: "../../Bind/Bing_page/helpcenterss?id=1154"
				// 	})
				// }
				uni.navigateTo({
					url: "/pages/tabBar/my/Help_center"
				})
			},
			// 封装图片路径处理逻辑
			updateModelPicturePath(row, lan) {
				if (lan === 'zh-Hans' || lan === 'zh-Hant') {
					return DEVICE_IMAGES.zh[row.modelId]
				} else {
					return DEVICE_IMAGES.default[row.modelId]
				}
			},
			//获取设备型号列表
			getlist() {
				let that = this
				uni.request({
					url: that.$url_APP_IP + that.$url_list,
					method: 'GET',
					data: {
						pageNum: that.per,
						pageSize: 10,
						reasonable: false,
						modelType: that.SELECT_TYPE
					},
					header: {
						'Authorization': 'Bearer ' + (that.tokens === '0' ? uni.getStorageSync("token") : that
							.tokens),
						'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
					},
					success(res) {
						// console.log("获取设备型号列表", res)
						uni.stopPullDownRefresh()
						if (res.data.code == 200) {
							if (that.per == 1) {
								that.list = []
								for (let i = 0; res.data.rows.length > i; i++) {
									const lan = uni.getLocale();
									res.data.rows[i].modelPicturePath = that.updateModelPicturePath(res.data.rows[
										i], lan)
								}
							}
							for (let i = 0; res.data.rows.length > i; i++) {
								that.list.push(res.data.rows[i])
								// const index = that.list.findIndex(item => item.name === "BPW6");
								// if (index !== -1) that.list.splice(index, 1);
								// const lan = uni.getLocale();
								// if (lan === 'zh-Hans' || lan === 'zh-Hant') {
								// 	that.list.push(res.data.rows[i])
								// 	const index = that.list.findIndex(item => item.name === "ZK-B872B");
								// 	if (index !== -1) that.list.splice(index, 1);
								// } else {
								// 	that.list.push(res.data.rows[i])
								// 	const index = that.list.findIndex(item => item.name === "TSB-617B-T");
								// 	if (index !== -1) that.list.splice(index, 1);
								// }
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.list-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding: 0 10px 200px 10px;
		justify-content: space-between;
	}

	.list-item {
		background-color: #f3f3f3;
		background: white;
		border-radius: 20px;
		margin: 5px 5px 10px 5px;
		padding: 5px;
		box-sizing: border-box;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}


	.list_item_bg {
		display: flex;
		flex-direction: column;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 180px;
	}

	.active {
		border: 2px solid #3298F7;
		color: #3298F7;
	}

	.button_bg_view {
		background: #EFEFF4;
		width: 100vw;
		display: flex;
		position: fixed;
		bottom: 0;
		flex-direction: column;
		padding-top: 20px;
	}

	.button_bg {
		width: auto;
		height: 48px;
		font-size: 16px;
		margin-left: 20px;
		margin-bottom: 10px;
		margin-right: 20px;
		display: flex;
		font-weight: 600;
		justify-content: center;
		align-items: center;
		color: white !important;
		border: none !important;
		background: #DBDBDB;
		border-radius: 30px;
	}

	.button_bg_1 {
		border: none !important;
		width: auto;
		height: 48px;
		font-size: 16px;
		margin: 20px 20px 48px 20px;
		display: flex;
		font-weight: 600;
		justify-content: center;
		align-items: center;
		color: white !important;
		background: #DBDBDB !important;
		border-radius: 30px;
	}

	.viewstylesss {
		text-align: center;
		margin-bottom: 20px;
		color: #3298F7;
		margin-top: 10px;
		font-size: 12px;
		font-weight: 400;
	}
</style>