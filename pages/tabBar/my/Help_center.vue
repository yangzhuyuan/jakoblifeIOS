<template>
	<view class="help-page">
		<view v-for="(device, idx) in deviceList" :key="idx" class="device-card">
			<view class="device-image-wrap">
				<image class="device-image" :src="device.image" mode="aspectFit"></image>
			</view>
			<view class="device-content">
				<text class="device-title">{{ device.title }}</text>
				<text class="device-desc">{{ device.desc }}</text>
				<view v-for="(action, actionIdx) in device.actions" :key="actionIdx" class="action-row"
					hover-class="action-hover" @click="goPage(action.url)">
					<uni-icons :type="actionIdx === 0 ? 'list' : 'help'" size="16" color="#3298F7"></uni-icons>
					<text class="action-text">{{ action.label }}</text>
					<uni-icons type="right" size="14" color="#3298F7"></uni-icons>
				</view>
			</view>
		</view>
		<view class="support-card" @click="goContactUs">
			<view class="support-icon-wrap">
				<image class="device-image-2" src="/static/page_icon/bangzhu_4.png" mode="aspectFit"></image>
			</view>
			<view class="support-info">
				<text class="support-title">{{ $t('仍需要帮助') }}</text>
				<text class="support-desc">{{ $t('客服团队随时帮助') }}</text>
			</view>
			<view class="support-btn">
				<text class="support-btn-text">{{ $t('联系客服') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				deviceList: [{
						title: this.$t('血压手表'),
						desc: this.$t('帮助设备描述'),
						image: '/static/page_icon/bangzhu_1.png',
						actions: [{
								label: this.$t('使用指南'),
								url: '/pages/tabBar/my/vidohelp/vidohelp'
							},
							{
								label: this.$t('常见问题'),
								url: '../my/Text_content?id=1156'
							}
						]
					},
					{
						title: this.$t('臂式电子血压计'),
						desc: this.$t('帮助设备描述'),
						image: '/static/page_icon/bangzhu_2.png',
						actions: [{
								label: this.$t('使用指南'),
								url: '/pages/tabBar/my/vidohelp/vidohelp2'
							},
							{
								label: this.$t('常见问题'),
								url: '../my/Text_content?id=1158'
							}
						]
					},
					{
						title: this.$t('体脂秤'),
						desc: this.$t('帮助设备描述'),
						image: '/static/page_icon/bangzhu_3.png',
						actions: [{
								label: this.$t('使用指南'),
								url: '/pages/tabBar/my/vidohelp/vidohelp3'
							},
							{
								label: this.$t('常见问题'),
								url: '../my/Text_content?id=1160'
							}
						]
					}
				]
			};
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('帮助中心')
			});
		},

		methods: {
			goPage(url) {
				uni.navigateTo({
					url
				});
			},
			goContactUs() {
				uni.navigateTo({
					url: '/pages/tabBar/my/Webview1'
				});
			}
		}
	};
</script>

<style scoped>
	.help-page {
		position: relative;
		min-height: 100vh;
		padding: 40px 16px calc(58px + env(safe-area-inset-bottom));
		box-sizing: border-box;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 30%, #f4f7fb 100%);
	}

	.hero-robot {
		position: fixed;
		top: 0;
		right: 8px;
		width: 88px;
		height: 96px;
		z-index: 2;
		pointer-events: none;
	}

	.section-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
		margin: 8px 4px 12px;
	}

	.device-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		border-radius: 16px;
		padding: 16px;
		margin-bottom: 20px;
		box-sizing: border-box;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.device-image-wrap {
		width: 88px;
		flex-shrink: 0;
		margin-right: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		align-self: center;
	}

	.device-image {
		width: 88px;
		height: 88px;
		display: block;
	}

	.device-image-2 {
		width: 40px;
		height: 40px;
		display: block;
		border-radius: 50%;
	}


	.device-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.device-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.device-desc {
		display: block;
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.action-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 10px;
		padding: 10px 12px;
		background: #f0f7ff;
		border-radius: 10px;
		box-sizing: border-box;
	}

	.action-text {
		flex: 1;
		margin: 0 8px;
		font-size: 14px;
		font-weight: 600;
		color: #3298F7;
	}

	.action-hover {
		background: #e3efff;
	}

	.support-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #eaf4ff;
		border-radius: 14px;
		padding: 14px;
		margin-top: 8px;
		box-sizing: border-box;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.support-icon-wrap {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.support-info {
		flex: 1;
		min-width: 0;
		margin: 0 10px;
	}

	.support-title {
		display: block;
		font-size: 14px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.support-desc {
		display: block;
		margin-top: 4px;
		font-size: 11px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.support-btn {
		flex-shrink: 0;
		padding: 8px 12px;
		background: #ffffff;
		border: 1px solid #3298F7;
		border-radius: 8px;
	}

	.support-btn-text {
		font-size: 12px;
		font-weight: 600;
		color: #3298F7;
		white-space: nowrap;
	}
</style>