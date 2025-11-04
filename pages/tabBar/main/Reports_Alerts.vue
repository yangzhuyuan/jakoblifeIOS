<template>
	<view style="color: black;height: 100vh;">
		<view style="padding-top: 60px">
			<view class="context_btn1">
				<view v-for="(item, index) in menuItems" :key="index">
					<view class="context_btn2" @click="navigateToPage(item.url)">
						<view class="context_btn3">
							<image class="imagessai" v-show="item.title === '生成健康报告'" src="/static/page_icon/aipbg.jpg"
								mode="aspectFit">
							</image>
							<view class="context_title1">{{$t(item.title)}}</view>
						</view>
						<uni-icons type="forward" size="20"></uni-icons>
					</view>
					<view v-if="index !== menuItems.length - 1" class="divider"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 菜单项数组
				menuItems: [{
					title: '生成健康报告',
					url: '/pages/tabBar/tendency/supplement'
				}, {
					title: '警报',
					url: '/pages/tabBar/my/Alarms'
				}]
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t("AI健康报告")
			})
		},
		methods: {
			// 统一的页面跳转方法
			navigateToPage(url) {
				uni.navigateTo({
					url: url
				});
			},
		}
	}
</script>

<style>
	.context_btn1 {
		width: auto;
		display: flex;
		flex-direction: column;
		background: white;
		padding: 10px;
		margin-left: 20px;
		margin-right: 20px;
		border-radius: 15px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.context_btn2 {
		display: flex;
		flex-direction: row;
		background: white;
		align-items: center;
		height: 56px;
		padding-left: 10px;
	}

	.context_btn3 {
		flex-direction: row;
		display: flex;
		justify-content: space-between;
		width: 90%;
		align-items: center;
	}

	.imagessai {
		width: 25px;
		height: 25px;
		object-fit: contain;
		margin-bottom: 20px;
		border-radius: 25px;
		margin-right: 5px;
	}

	.context_title1 {
		width: 90%;
		font-size: 16px;
		color: black;
	}

	.divider {
		width: 92%;
		height: 1px;
		background: gainsboro;
		margin-left: 10px;
	}
</style>