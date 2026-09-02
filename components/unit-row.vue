<template>
	<view>
		<view class="row">
			<image v-if="icon" :src="icon" class="row-icon" mode="aspectFit"></image>
			<text class="title">{{ title }}</text>
			<view class="right">
				<text class="text">{{ array[index] }}</text>
				<uni-icons type="right" size="14" color="#A8C8E8" />
				<picker :range="array" :value="index" @change="onChange" class="picker-mask" />
			</view>
		</view>
		<view v-if="!hideLine" class="line" />
	</view>
</template>

<script>
	export default {
		name: 'unit-row',
		props: {
			title: String,
			array: Array,
			storageKey: String,
			currentIndex: Number,
			icon: {
				type: String,
				default: ''
			},
			hideLine: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				index: this.currentIndex || 0
			}
		},
		watch: {
			currentIndex(newVal) {
				this.index = newVal
			}
		},
		methods: {
			onChange(e) {
				this.index = e.detail.value
				this.$emit('unit-change', {
					key: this.storageKey,
					value: this.array[this.index],
					index: this.index
				})
			}
		}
	}
</script>

<style scoped>
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 0;
	}

	.row-icon {
		width: 36px;
		height: 36px;
		border-radius: 18px;
		flex-shrink: 0;
		margin-right: 12px;
	}

	.title {
		flex: 1;
		font-weight: 600;
		font-size: 15px;
		color: #1a2b4a;
		min-width: 0;
	}

	.right {
		position: relative;
		display: flex;
		align-items: center;
		flex-shrink: 0;
		padding: 4px 0;
	}

	.text {
		margin-right: 6px;
		font-size: 15px;
		font-weight: 600;
		color: #3298F7;
	}

	.picker-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.line {
		height: 1px;
		background: #eef1f5;
		margin-left: 48px;
	}
</style>
