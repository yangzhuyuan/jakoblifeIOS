<template>
	<view class="switch-wrap">
		<view class="swich_bg_0">
			<view class="switch-item" @click="emitClick1">
				<view v-if="show1" class="swich_bg">{{$t('与他人共享')}}</view>
				<view v-else class="swich_bg_1">{{$t('与他人共享')}}</view>
			</view>
			<view class="switch-item" @click="emitClick2">
				<view v-if="show2" class="swich_bg">{{$t('他人与我共享')}}</view>
				<view v-else class="swich_bg_1">{{$t('他人与我共享')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show1: Boolean,
			show2: Boolean
		},
		methods: {
			emitClick1() {
				this.$emit('click1');
			},
			emitClick2() {
				this.$emit('click2');
			}
		}
	}
</script>

<style scoped>
	.switch-wrap {
		display: flex;
		justify-content: center;
		margin: 8px 0 4px;
		padding: 0 16px;
	}

	.swich_bg_0 {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 40px;
		padding: 3px;
		width: 100%;
		max-width: 320px;
		background: #FFFFFF;
		border-radius: 100px;
		border: 1.5px solid #007AFF;
		box-sizing: border-box;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.switch-item {
		flex: 1;
		min-width: 0;
	}

	.swich_bg {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		color: #FFFFFF;
		width: 100%;
		line-height: 1.2;
		height: 34px;
		font-size: 14px;
		font-weight: 600;
		background: #007AFF;
		border-radius: 100px;
		padding: 0 6px;
		box-sizing: border-box;
	}

	.swich_bg_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #007AFF;
		line-height: 1.2;
		text-align: center;
		width: 100%;
		height: 34px;
		font-size: 14px;
		font-weight: 600;
		background: transparent;
		border-radius: 100px;
		padding: 0 6px;
		box-sizing: border-box;
	}
</style>