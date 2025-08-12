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
						<view style="text-align: center;margin-bottom: 10px;margin-top: 10px;">{{item.name}}</view>
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
					console.log("0-扫码  1-蓝牙 2-WiFi设备类型：" + this.modelConnectType)
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
				const lan = uni.getLocale();
				if (lan == 'zh-Hans') {
					uni.navigateTo({
						url: "../../Bind/Bing_page/helpcenterss?id=1153"
					})
				} else {
					uni.navigateTo({
						url: "../../Bind/Bing_page/helpcenterss?id=1154"
					})
				}
			},

			//获取设备型号列表
			getlist() {
				let that = this
				// console.log(that.tokens)
				uni.request({
					url: that.$url_list,
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
									if (res.data.rows[i] && res.data.rows[i].modelPicturePath && res.data.rows[i]
										.modelPicturePath.includes(that.$url_APP_IP)) {
										const lan = uni.getLocale();
										if (lan == 'zh-Hans') {
											res.data.rows[i].modelPicturePath = res.data.rows[i].modelPicturePath
										} else {
											if (res.data.rows[i].modelId === 30000) { //手表
												res.data.rows[i].modelPicturePath = "/static/image/shoubiao1.png"
											} else if (res.data.rows[i].modelId === 30001) { //手表
												res.data.rows[i].modelPicturePath = "/static/image/shoubiao1.png"
											} else if (res.data.rows[i].modelId === 20000) { //体脂秤
												res.data.rows[i].modelPicturePath = '/static/image/tizhi1.jpg'
											} else if (res.data.rows[i].modelId === 20001) { //体脂秤
												res.data.rows[i].modelPicturePath = '/static/image/tizhi1.jpg'
											} else if (res.data.rows[i].modelId === 10000) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10001) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10002) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10003) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10004) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10005) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											}
										}
									} else {
										const lan = uni.getLocale();
										if (lan == 'zh-Hans') {
											res.data.rows[i].modelPicturePath = that.$url_APP_IP + res.data.rows[i]
												.modelPicturePath
										} else {
											if (res.data.rows[i].modelId === 30000) { //手表
												res.data.rows[i].modelPicturePath = "/static/image/shoubiao1.png"
											} else if (res.data.rows[i].modelId === 30001) { //手表
												res.data.rows[i].modelPicturePath = "/static/image/shoubiao1.png"
											} else if (res.data.rows[i].modelId === 20000) { //体脂秤
												res.data.rows[i].modelPicturePath = '/static/image/tizhi1.jpg'
											} else if (res.data.rows[i].modelId === 20001) { //体脂秤
												res.data.rows[i].modelPicturePath = '/static/image/tizhi1.jpg'
											} else if (res.data.rows[i].modelId === 10000) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10001) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10002) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10003) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10004) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											} else if (res.data.rows[i].modelId === 10005) { //血压计
												res.data.rows[i].modelPicturePath = "/static/image/xueya1.png"
											}
										}
									}
								}
							}
							for (let i = 0; res.data.rows.length > i; i++) {

								that.list.push(res.data.rows[i])
								const index = that.list.findIndex(item => item.name === "BPW6");
								if (index !== -1) that.list.splice(index, 1);
								// const lan = uni.getLocale();
								// if (lan == 'zh-Hans') {
								// that.list.push(res.data.rows[i])
								// const index = that.list.findIndex(item => item.name === "ZK-B872B");
								// if (index !== -1) that.list.splice(index, 1);
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
		padding: 0 10px 160px 10px;
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