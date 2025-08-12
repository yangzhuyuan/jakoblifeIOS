<template>
	<view style="padding-top: 20px;color: black;height: 100vh;background: #F7F7F7;">
		<view class="titless">{{$t('选择管理1')}}</view>
		<view class="title_1">{{$t('选择管理2')}}</view>
		<view class="context_btn" @click="xueya_click()">
			<image class="img" src="../../static/icons/3.png" />
			<view class="context_title">{{$t('血压管理')}}</view>
			<uni-icons type="forward" size="20"></uni-icons>
		</view>
		<view class="context_btn" @click="tizhi_click()">
			<image class="img" src="../../static/icons/6.png" />
			<view class="context_title">{{$t('体脂管理')}}</view>
			<uni-icons type="forward" size="20"></uni-icons>
		</view>
		<view style="width:100vw;position: fixed;bottom: 0;left: 0;">
			<button class="btn_bg" @tap="skile">{{$t('暂不选择')}}</button>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				SHEBEI: '',
			}
		},

		onLoad(RES) {
			this.SHEBEI = RES.SHEBEI
			// console.log(this.SHEBEI)
		},

		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('选择管理类型')
			})
		},

		methods: {
			xueya_click() {
				uni.navigateTo({
					url: "../Bind/Bing_page/Bing_page?SELECT_TYPE=0&SHEBEI=" + this.SHEBEI
				})
			},
			tizhi_click() {
				uni.navigateTo({
					url: "../Bind/Bing_page/Bing_page?SELECT_TYPE=1&SHEBEI=" + this.SHEBEI
				})
			},
			skile() {
				uni.switchTab({
					url: "../tabBar/main/Main"
				})
			},
		}
	}
</script>

<style>
	.titless {
		width: auto;
		margin: 20px 20px 0 20px;
		font-size: 16px;
		font-weight: 400;
		color: #1A1A1A;
	}

	.title_1 {
		width: auto;
		margin: 5px 20px 0 20px;
		font-size: 12px;
		font-weight: 400;
		color: #999999;
	}

	.img {
		width: 36px;
		height: 36px;
		margin-left: 15px;

	}

	.context_btn {
		width: auto;
		height: 60px;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: white;
		padding: 10px;
		margin: 24px 20px 0 20px;
		border-radius: 50px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);

	}

	.context_title {
		width: 55vw;
		font-size: 16px;
		color: black;
		font-weight: 400;
		margin-left: 15px;
	}

	.btn {
		margin-top: 20px;
		margin-bottom: 20px;
		display: flex;
		flex-direction: row;

	}

	.btn_bg {
		width: auto;
		margin: 20px 20px 48px 20px;
		background: #3298F7;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100px;
		font-size: 16px;
		font-weight: 600;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}
</style>