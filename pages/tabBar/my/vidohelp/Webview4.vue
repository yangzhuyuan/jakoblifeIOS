<template>
	<view class="container">
		<!-- 链接无效 -->
		<view v-if="!WebViewId" class="tip">
			<text>{{$t("链接无效")}}</text>
		</view>

		<!-- 正常加载 -->
		<web-view v-else :src="WebViewId" @load="onLoadSuccess" @error="onLoadFail" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				WebViewId: '', // 要打开的网址
				loaded: false, // 是否已加载成功
				loadTimer: null, // 超时计时器
			}
		},

		onLoad(opt) {
			// 1. 基本校验
			if (!opt || !opt.url) {
				uni.showToast({
					title: this.$t("链接无效"),
					icon: 'none'
				});
				return;
			}

			// 2. 赋值并设置标题
			this.WebViewId = decodeURIComponent(opt.url); // 防止 url 被 encode 两次
			uni.setNavigationBarTitle({
				title: opt.title || this.$t("加载中")
			});

			uni.showLoading({
				title: this.$t("加载中")
			});

			// 3. 超时兜底：10 秒没触发 load 就算超时
			this.loadTimer = setTimeout(() => {
				if (!this.loaded) {
					uni.hideLoading()
					uni.showToast({
						title: this.$t("加载超时请检查链接"),
						icon: 'none',
						duration: 3000
					});
				}
			}, 10000);
		},

		methods: {
			onLoadSuccess() {
				this.loaded = true;
				clearTimeout(this.loadTimer);
				uni.hideLoading()
				console.log('[WebView] 加载成功');
			},
			onLoadFail() {
				clearTimeout(this.loadTimer);
				uni.hideLoading()
				uni.showToast({
					title: this.$t("网页加载失败"),
					icon: 'none'
				});
				console.error('[WebView] 加载失败');
			}
		},

		onUnload() {
			uni.hideLoading()
			// 清理计时器，防止内存泄漏
			clearTimeout(this.loadTimer);
		}
	}
</script>

<style scoped>
	.container {
		height: 100vh;
	}

	.tip {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 32rpx;
		color: #999;
	}
</style>