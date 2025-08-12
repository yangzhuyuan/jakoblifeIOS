<template>
	<view style="padding: 20px; background: #F7F7F7; color: black;height: 100vh;background: #EFEFF4;">
		<view style="display: flex;align-items: center; flex-direction: column; margin-top: 40px;">
			<image src="../../../static/icons/96x96.png" style="width: 80px; height: 80px;"></image>
			<text style="margin-top: 20px;font-size: 18px; font-weight: bold;">JakobLife</text>
			<text style="margin-top: 10px;font-size: 12px; color: gray;">{{version}}</text>
			<text style="font-size: 12px; color: gray;" @click="beiandianji()">{{Record_number}}</text>
		</view>
		<view class="bg">

			<!-- <view class="bt_BG" @click="Text_content1()">
				<view class="text">{{$t('给JakobLife好评')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view> -->
			<!-- <view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			 -->
			<view class="bt_BG" @click="Text_content2()">
				<view class="text">{{$t('JakobLife软件移动客户端用户使用规范1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content3()">
				<view class="text">{{$t('JakobLife隐私政策1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<!-- <view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content4()">
				<view class="text">{{$t('敏感个人信息处理情况说明1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content5()">
				<view class="text">{{$t('向第三方提供个人信息情况的说明1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content6()">
				<view class="text">{{$t('已收集个人信息清单1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content7()">
				<view class="text">{{$t('第三方共享个人清单1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content8()">
				<view class="text">{{$t('医疗器械使用安全提示1')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view> -->
			<view style="background: gainsboro; width: 90%; height: 1px; margin: 10px 15px 0 15px;"></view>
			<view class="bt_BG" @click="Text_content9()">
				<view class="text">{{$t('软件更新')}}</view>
				<view style="width: 10%; display: flex;flex-direction: row; align-items: center;">
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
		</view>

		<view>
			<uni-popup ref="down_popup" :mask-click="false">
				<view style="width: 80vw; background:#fff; padding: 10px;align-items: center;">
					<view style="text-align: center;">{{$t("当前下载进度")}}</view>
					<view class="progress-box">
						<progress :percent="pgList" show-info="true" activeColor="#10AEFF" stroke-width="3" />
					</view>
					<view style="display: flex;justify-content: space-between;align-items: center;margin-top: 20px;">
						<view>{{downloaded}}</view>
						<view>{{downloaded1}}</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	const systemInfo = uni.getSystemInfoSync()
	export default {
		data() {
			return {
				version: this.$t('当前版本') + systemInfo.appVersion,
				Record_number: this.$t('备案号'),
				pgList: '0',
				downloaded: '0',
				downloaded1: "0",
			}
		},

		onLoad() {
			uni.setNavigationBarTitle({
				title: this.$t('关于更新')
			})
		},

		methods: {

			beiandianji() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Webview"
				})
			},

			Text_content1() {
				uni.navigateTo({
					url: "../my/Text_content?id=1134"
				})
			},
			Text_content2() {
				uni.navigateTo({
					url: "../my/Text_content?id=1"
				})
			},
			Text_content3() {
				uni.navigateTo({
					url: "../my/Text_content?id=1130"
				})
			},
			Text_content4() {
				uni.navigateTo({
					url: "../my/Text_content?id=1135"
				})
			},
			Text_content5() {
				uni.navigateTo({
					url: "../my/Text_content?id=1111"
				})
			},
			Text_content6() {
				uni.navigateTo({
					url: "../my/Text_content?id=1136"
				})
			},
			Text_content7() {
				uni.navigateTo({
					url: "../my/Text_content?id=1137"
				})
			},
			Text_content8() {
				uni.navigateTo({
					url: "../my/Text_content?id=1138"
				})
			},
			Text_content9() { //软件更新
				if (uni.getSystemInfoSync().platform === 'android') {
					this.check_new_version("com.work.jakob", "0")
				} else {
					this.check_new_version("io.dcloud.jakob", "1")
				}
			},

			//获取app最新版本
			check_new_version(pkgName, type) {
				let that = this
				uni.request({
					url: "https://jakoblife.jakob-techs.com/prod-api/system/version/check_new_version",
					method: 'POST',
					data: {
						pkgName: pkgName,
						type: type,
						versionName: systemInfo.appVersion,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
					},
					success(version) {
						if (version.data.code === 4003) {
							console.log("ssdsad", version)
							uni.showModal({
								// title: that.$t("提示"),
								content: that.$t('已经是最新版本1') + systemInfo.appVersion + "\n" + that.$t(
									'已经是最新版本2'),
								success: function(res) {
									if (res.confirm) {} else if (res.cancel) {}
								}
							});
						} else {
							console.log(version)
							uni.showModal({
								// title: that.$t("提示"),
								content: that.$t('版本更新1') + version.data.data.versionName + that.$t(
									'版本更新2'),
								success: function(res) {
									if (res.confirm) {
										if (uni.getSystemInfoSync().platform === 'android') {
											that.$refs.down_popup.open("center")
											that.checkUpdate(version.data.data.path)
										} else {
											// iOS 无法直接下载安装包，只能引导用户跳转 App Store 更新：
											const appleId = "6737795065"; // 替换为你的 App Store ID
											plus.runtime.launchApplication({
												action: `itms-apps://itunes.apple.com/app/id${appleId}?mt=8`
											});
										}
									} else if (res.cancel) {

									}
								}
							});
						}
					}
				})
			},

			checkUpdate(path) {

				// 下载APK
				const downloadTask = uni.downloadFile({
					url: path,
					success: res => {
						if (res.statusCode !== 200) {
							console.error('下载安装包失败', err);
							return;
						}
						// 下载好直接安装，下次启动生效
						plus.runtime.install(res.tempFilePath, {
							force: false
						}, () => {
							if (is_mandatory) {
								//更新完重启app
								plus.runtime.restart();
								return;
							}
							uni.showModal({
								title: '安装成功是否重启？',
								success: res => {
									if (res.confirm) {
										//更新完重启app
										plus.runtime.restart();
									}
								}
							});
						}, err => {
							uni.showModal({
								title: '更新失败',
								content: err
									.message,
								showCancel: false
							});
						});
					}
				});
				downloadTask.onProgressUpdate((res) => {
					this.pgList = res.progress
					this.downloaded = res.totalBytesWritten
					this.downloaded1 = res.totalBytesExpectedToWrite
					console.log('下载进度' + res.progress);
					console.log('已经下载的数据长度' + res.totalBytesWritten);
					console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
					// 满足测试条件，取消下载任务。
					if (res.progress >= 100) {
						// downloadTask.abort();
						this.$refs.down_popup.close()
					}
				});
			}
		},
	}
</script>

<style>
	.bg {
		display: flex;
		flex-direction: column;
		margin-top: 40px;
		background: white;
		border-radius: 10px;
		padding-bottom: 10px;
		margin-bottom: 50px;
	}

	.bt_BG {
		display: flex;
		flex-direction: row;
		padding-top: 15px;
		padding-bottom: 5px;
		padding-left: 10px;
		align-items: center;

	}

	.text {
		width: 90%;
		font-size: 14px;
		margin-left: 10px;
	}

	.progress-box {
		margin-top: 20px;
		display: flex;
		height: 20px;
	}
</style>