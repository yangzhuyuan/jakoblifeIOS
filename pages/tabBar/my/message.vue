<template>
	<view style="color: black;height: 100vh; background: #EFEFF4;">

		<view v-if="lisdata_show" style="padding-bottom: 80px;padding-top: 100px;">
			<view v-for="(item,index) in list" :key="index" style="padding-top: 20px;">
				<view style="background: white;margin: 0 20px 0 20px;padding: 15px;border-radius: 10px"
					@click="listclick(item.shareName,item.shareAvatar,item.sharePhone,item.id)">
					<view style="display: flex;flex-direction: row; justify-content: space-between; ">
						<view style="font-weight: bold;margin:0 0 5px 10px;">{{$t("邀请")}}</view>
						<view style="margin-right: 10px;">{{item.shareTime}}</view>
					</view>
					<view style="width: 78vw; background: gainsboro;height: 1px; margin-left: 10px;"></view>
					<view style="margin: 10px 0 0 10px; display: flex;flex-direction: row; align-items: center;">
						<image :src="item.shareAvatar===''?'/static/icons/40x40.png':item.shareAvatar"
							style="width: 45px; height: 45px;border-radius: 50px;">
						</image>
						<view style="margin-left: 20px; width: 55vw;">
							<view style="font-size: 16px;font-weight: bold;">
								{{item.shareName === null ? item.sharePhone:item.shareName}}
							</view>
							<view
								style="width: 50vw; color: gray;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
								{{$t("想与您共享健康数据")}}
							</view>
						</view>
						<uni-icons style="margin-left: 5px;" type="forward" size="20"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="aa">
			<text>-</text>
			<text>{{$t('暂无消息')}}</text>
		</view>
		<view style="position: fixed;top: 0;left: 0; right: 0;">
			<view class="titlestyle">
				<uni-icons @click="back()" type="left" size="24" color="black"></uni-icons>
				<view style="font-size: 16px; font-weight: 600;">{{$t('消息')}}</view>
				<view @click="batch_del()" style="display: flex;flex-direction: row;">{{$t('清除')}}</view>
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
				lisdata_show: false,
				list: [],
			}
		},

		onShow() {
			this.pending()
		},
		methods: {
			...mapMutations(['setpendinglenth']),

			back() {
				uni.navigateBack()
			},

			listclick(name, avatar, sharePhone, id) {
				uni.navigateTo({
					url: "../my/Invite?NAME=" + name + "&AVATAR=" + avatar + "&sharePhone=" + sharePhone + "&ID=" +
						id
				})
			},
			//获取待处理分享请求列表
			pending() {
				let that = this
				console.log(that.info.userId)
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/share/data/pending",
					method: 'POST',
					data: {
						receiverId: that.info.userId
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(pending) {
						console.log("获取待处理分享请求列表", pending)
						if (pending.data.code == 200) {
							if (pending.data.data == "" || pending.data.data == undefined) {
								that.lisdata_show = false
								that.setpendinglenth("0")
							} else {
								that.lisdata_show = true
								that.list = pending.data.data
								that.setpendinglenth(pending.data.data.length)
							}
						}
					},
					fail(erro) {
						console.log("获取待处理分享请求列表失败", erro)
					}
				})
			},
			//批量删除待处理请求
			batch_del() {
				let that = this
				console.log(that.info.userId)
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/share/data/batch_del",
					method: 'POST',
					data: {
						receiverId: that.info.userId
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(pending) {
						console.log("获取待处理分享请求列表", pending)
						if (pending.data.code == 200) {
							that.pending()
						}
					},
					fail(erro) {
						console.log("获取待处理分享请求列表失败", erro)
					}
				})
			}

		}
	}
</script>

<style>
	.aa {
		display: flex;
		align-items: center;
		padding-top: 100px;
		flex-direction: column;
	}

	.titlestyle {
		background: #EFEFF4;
		width: auto;
		height: 88px;
		display: flex;
		margin-top: 20px;
		justify-content: space-between;
		align-items: center;
		margin-left: 20px;
		margin-right: 20px;
	}
</style>