<template>
	<view class="user-card">
		<view class="avatar-wrap">
			<image class="imgas" mode="aspectFit"
				:src="show1?(item.receiverAvatar || '../../../static/icons/60x60.png'):(item.shareAvatar || '../../../static/icons/60x60.png')" />
		</view>
		<view class="user-name">
			{{show1? (item.receiverName || 'NA'):(item.shareName || 'NA') }}
		</view>
		<view class="user-status">
			{{ show1 ? $t('您正在与') + " "+(item.receiverName || 'NA') + " "+ $t('共享') : " "+(item.shareName || 'NA') + " "+ $t('正在与您共享以下健康数据') }}
		</view>
		<view class="user-note">
			{{$t('注本页面显示均为最近测量数据')}}
		</view>
		<!-- <view style="margin-top: 10px; font-size: 16px; color: #999999; font-weight: 400;">
			{{show1? (item.receiverPhone || 'NA'):(item.sharePhone || 'NA') }}
		</view> -->
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			show1: Boolean
		}
	}
</script>

<style scoped>
	.user-card {
		display: flex;
		align-items: center;
		flex-direction: column;
		background: #FFFFFF;
		border-radius: 16px;
		padding: 24px 16px 18px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.avatar-wrap {
		display: inline-block;
	}

	.imgas {
		object-fit: contain;
		display: block;
		width: 88px;
		height: 88px;
		border-radius: 44px;
		border: 1px solid #E8ECF1;
		background: #F5F8FC;
	}

	.user-name {
		font-weight: 700;
		font-size: 18px;
		margin-top: 12px;
		color: #1A2B4A;
	}

	.user-status {
		margin-top: 8px;
		font-size: 14px;
		font-weight: 400;
		color: #3A4656;
		text-align: center;
		line-height: 1.4;
		padding: 0 8px;
	}

	.user-note {
		margin-top: 6px;
		font-size: 12px;
		color: #8A94A6;
		text-align: center;
	}
</style>