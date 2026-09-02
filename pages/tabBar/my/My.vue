<template>
	<view class="my-page">
		<view class="my_title_all">
			<view class="nav-placeholder">
				<image src="/static/page_icon/app_icon_all.jpg" mode="aspectFit" class="msg-icon-left" />
			</view>
			<view class="title">{{$t('我的')}}</view>
			<image :src="msg ? '../../../static/icons/19.png' : '../../../static/icons/20.png'" mode="aspectFit"
				class="msg-icon" @click="Historical_record()">
			</image>
		</view>
		<view class="header-wrap">
			<view class="nav-bar-spacer"></view>
			<view class="profile-section">
				<view @click="touxiang" class="avatar-container">
					<image :src="avatar" class="avatar-image" mode="aspectFit"></image>
				</view>
				<view class="username">{{username}}</view>
				<view class="view-profile" @click="touxiang">
					<text class="view-profile-text">{{$t('个人信息')}}</text>
					<uni-icons type="right" size="12" color="#ffffff"></uni-icons>
				</view>
			</view>
			<view class="header-arc">
				<view class="header-arc-inner"></view>
			</view>
		</view>

		<view class="content-section">
			<view class="menu-card health-card" @click="Health_record()">
				<view class="icon-box">
					<image class="menu-icon-img" src="/static/page_icon/baogao_1.png" mode="aspectFit"></image>
				</view>
				<view class="row-main">
					<text class="row-label">{{$t('我的健康档案')}}</text>
				</view>
				<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
			</view>

			<view class="menu-card">
				<view v-for="(item, index) in menuItems.slice(0, menuItems.length - 3)" :key="'main-' + index">
					<view class="menu-row" @click="onMenuItemClick(item)">
						<view class="icon-box">
							<image v-if="item.title === '生成健康报告'" class="menu-icon-img menu-icon-ai"
								src="/static/page_icon/aipbg.jpg" mode="aspectFit"></image>
							<uni-icons v-else-if="item.title === '设置'" type="gear-filled" size="20"
								color="#3298F7"></uni-icons>
							<image v-else-if="item.title === '设备管理'" class="menu-icon-img"
								src="/static/page_icon/shoubiao.png" mode="aspectFit"></image>
							<uni-icons v-else-if="item.title === '同步数据'" type="loop" size="20"
								color="#3298F7"></uni-icons>
							<uni-icons v-else-if="item.title === '警报'" type="notification-filled" size="20"
								color="#3298F7"></uni-icons>
							<uni-icons v-else type="heart-filled" size="20" color="#3298F7"></uni-icons>
						</view>
						<view class="row-main">
							<text class="row-label">{{$t(item.title)}}</text>
							<text v-if="item.title === '生成健康报告'" class="row-sub">{{$t('AI健康报告')}}</text>
						</view>
						<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
					</view>
					<view v-if="index !== menuItems.length - 4" class="row-line"></view>
				</view>
			</view>

			<view class="menu-card">
				<view v-for="(item, index) in menuItems.slice(-3)" :key="'help-' + index">
					<view class="menu-row" @click="navigateToPage(item.url)">
						<view class="icon-box">
							<uni-icons v-if="item.title === '帮助中心'" type="help-filled" size="20"
								color="#3298F7"></uni-icons>
							<uni-icons v-else-if="item.title === '安全中心'" type="locked-filled" size="20"
								color="#3298F7"></uni-icons>
							<uni-icons v-else type="info-filled" size="20" color="#3298F7"></uni-icons>
						</view>
						<text class="row-label">{{$t(item.title)}}</text>
						<uni-icons type="right" size="14" color="#C5CDD8"></uni-icons>
					</view>
					<view v-if="index !== 2" class="row-line"></view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		error
	} from 'pdf-lib';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: {
			...mapState(['getpendinglenth'])
		},
		data() {
			const lan = uni.getLocale();
			const isZh = lan === 'zh-Hans' || lan === 'zh-Hant';
			return {
				timsdpad: null,
				avatar: '',
				msg: true,
				username: this.$t('未登录'),
				switchsdss: uni.getStorageSync("myswics") || false,
				historySyncing: false,
				historySyncTimer: null,
				// 菜单项数组
				menuItems: [{
						title: '设置',
						url: '/pages/tabBar/my/Unit_setting'
					},
					{
						title: '设备管理',
						url: '/pages/tabBar/my/Equipment_management1'
					},
					{
						title: '同步数据',
						action: 'syncHistory'
					},
					{
						title: '警报',
						url: '/pages/tabBar/my/Alarms'
					},
					{
						title: '生成健康报告',
						url: '/pages/tabBar/tendency/supplement'
					},
					...(isZh ? [{
						title: '脉诊健康管理',
						url: '/pages/tabBar/main/Pulsediagnosis'
					}] : []),
					// {
					// 	title: '手表设置',
					// 	url: "/pages/tabBar/main/WatctOTA/WatctOTA"
					// },
					// {
					// 	title: '自动血压监测设置',
					// 	url: '/pages/tabBar/my/Watch_measurement'
					// },
					// {
					// 	title: '提醒设置',
					// 	url: '/pages/tabBar/my/Reminder_setting'
					// },
					{
						title: '帮助中心',
						url: '/pages/tabBar/my/Help_center'
					},
					{
						title: '安全中心',
						url: '/pages/tabBar/my/Safety_center'
					},
					{
						title: '关于更新',
						url: '/pages/tabBar/my/About_Update'
					}
				]
			}
		},
		onHide() {
			if (this.timsdpad) {
				clearInterval(this.timsdpad);
				this.timsdpad = null;
			}
			uni.$off('DEVICE_HISTORY_SYNC_DONE', this.onHistorySyncDone)
			if (this.historySyncing) {
				clearTimeout(this.historySyncTimer)
				this.historySyncTimer = null
				this.historySyncing = false
				try {
					uni.hideLoading()
				} catch (e) {}
			}
		},
		onShow() {
			this.getInfoUser()
			uni.$off('DEVICE_HISTORY_SYNC_DONE', this.onHistorySyncDone)
			uni.$on('DEVICE_HISTORY_SYNC_DONE', this.onHistorySyncDone)
		},
		methods: {
			...mapMutations(['getInfo']),
			// 发起请求获取用户信息
			getInfoUser() {
				this.$get(this.$url_APP_IP + this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					switch (res.code) {
						case 200:
							this.handleUserInfo(res.data);
							break
						case 401:
							uni.redirectTo({
								url: "/pages/login/login_land"
							});
							break
						case 500:
							uni.showToast({
								title: this.$t("获取数据失败"),
								icon: 'none'
							});
							break
						default:
							return;
							break
					}
				}).catch(error => {
					uni.showToast({
						title: this.$t("网络连接异常"),
						icon: 'none'
					});
				})
			},
			// 处理用户信息
			handleUserInfo(data) {
				this.avatar = data.avatar || "/static/page_icon/app_icon_all.jpg";
				this.username = data.nickName || data.userName || "未登录";
				this.getInfo(data);
				this.pending(data);
				this.timsdpad = setInterval(res => {
					this.pending(data);
				}, 8000)
			},
			//获取待处理分享请求列表
			pending(datainfo) {
				const data = {
					receiverId: datainfo.userId
				}
				this.$post(this.$url_APP_IP + this.$url_pending, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;' //自定义请求头信息
				}).then(pending => {
					switch (pending.code) {
						case 200:
							if (pending.data.length === 0) {
								this.msg = true;
							} else {
								this.msg = this.getpendinglenth >= pending.data.length;
							}
							break
					}
				})
			},
			//消息
			Historical_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/message"
				})
			},
			//点击头像
			touxiang() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Health_record"
				})
			},
			onMenuItemClick(item) {
				if (item && item.action === 'syncHistory') {
					this.syncDeviceHistory()
					return
				}
				this.navigateToPage(item.url)
			},
			// 统一的页面跳转方法
			navigateToPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			syncDeviceHistory() {
				const hasBpw1 = !!uni.getStorageSync('deviceIdwatch')
				const hasBpw6 = !!uni.getStorageSync('BPW6devicemac')
				let boundBpw1 = hasBpw1
				let boundBpw6 = hasBpw6
				try {
					const list = uni.getStorageSync('lixianlist')
					const rows = Array.isArray(list) ? list : ((list && list.rows) || [])
					if (Array.isArray(rows) && rows.length) {
						boundBpw1 = boundBpw1 || rows.some(row => String(row && row.deviceModelId) === '30000')
						boundBpw6 = boundBpw6 || rows.some(row => String(row && row.deviceModelId) === '30001')
					}
				} catch (e) {}
				if (!boundBpw1 && !boundBpw6) {
					uni.showToast({
						title: this.$t('当前未绑定任何设备'),
						icon: 'none'
					})
					return
				}
				if (this.historySyncing) {
					uni.showToast({
						title: this.$t('数据同步中请稍后'),
						icon: 'none'
					})
					return
				}
				this.historySyncing = true
				uni.showLoading({
					title: this.$t('数据同步中请稍后'),
					mask: true
				})
				uni.$emit('REQUEST_DEVICE_HISTORY_SYNC')
				clearTimeout(this.historySyncTimer)
				this.historySyncTimer = setTimeout(() => {
					this.onHistorySyncDone({
						ok: false,
						message: this.$t('数据同步失败')
					})
				}, 20000)
			},
			onHistorySyncDone(payload) {
				if (!this.historySyncing) {
					return
				}
				clearTimeout(this.historySyncTimer)
				this.historySyncTimer = null
				this.historySyncing = false
				try {
					uni.hideLoading()
				} catch (e) {}
				const ok = payload && payload.ok
				uni.showToast({
					title: (payload && payload.message) || this.$t(ok ? '已发送同步命令' : '数据同步失败'),
					icon: 'none'
				})
			},

			//我的健康档案
			Health_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Health_record"
				})
			},
			//反馈
			Feedback() {
				uni.navigateTo({
					url: "/pages/tabBar/my/fankui"
				})
			},
			//推送开关
			switch1Change(e) {
				let that = this
				that.switchsdss = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					uni.showModal({
						title: that.$t("提示"),
						content: that.$t("推送结果"),
						success: function(res) {
							if (res.confirm) {
								that.switchsdss = false
								uni.setStorageSync("myswics", false)
								uni.removeStorageSync("swichs")
								uni.removeStorageSync("switchList")
							} else if (res.cancel) {
								that.switchsdss = true
								uni.setStorageSync("myswics", true)
							}
							// 关键点：添加下一行确保视图更新
							that.$nextTick(() => that.$forceUpdate())
						}
					})
				} else if (e.detail.value === true) {
					that.switchsdss = true
					uni.setStorageSync("myswics", true)
					uni.navigateTo({
						url: "/pages/tabBar/my/Alarms"
					})
				}
			},
		}
	}
</script>

<style>
	.my-page {
		min-height: 100vh;
		background: #f4f7fb;
		color: #1a2b4a;
	}

	.header-wrap {
		background: #3298F7;
		padding-bottom: 0;
		position: relative;
		z-index: 1;
	}

	.header-arc {
		position: relative;
		height: 72px;
		overflow: hidden;
		background: #f4f7fb;
		z-index: 2;
	}

	.header-arc-inner {
		position: absolute;
		left: 50%;
		top: -42px;
		width: 130%;
		height: 100px;
		transform: translateX(-50%);
		background: #3298F7;
		border-radius: 50%;
	}

	.my_title_all {
		height: 50px;
		padding: calc(env(safe-area-inset-top) + 8px) 16px 8px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		box-sizing: content-box;
		background: #3298F7;
	}

	.nav-bar-spacer {
		height: calc(env(safe-area-inset-top) + 60px);
		flex-shrink: 0;
	}

	.nav-placeholder {
		width: 55px;
		flex-shrink: 0;
	}

	.title {
		color: #ffffff;
		text-align: center;
		flex: 1;
		font-weight: 600;
		font-size: 17px;
	}

	.msg-icon {
		width: 25px;
		height: 25px;
		object-fit: contain;
	}

	.msg-icon-left {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: contain;
	}

	.profile-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px 20px 0;
	}

	.avatar-container {
		background: #ffffff;
		border-radius: 50%;
		display: flex;
		padding: 3px;
		align-items: center;
		justify-content: center;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.avatar-image {
		border-radius: 50%;
		width: 96px;
		height: 96px;
		object-fit: cover;
	}

	.username {
		margin-top: 14px;
		color: #ffffff;
		font-size: 20px;
		font-weight: 700;
		line-height: 1.3;
	}

	.view-profile {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 8px;
		padding: 4px 0 8px;
	}

	.view-profile-text {
		color: rgba(255, 255, 255, 0.92);
		font-size: 14px;
		margin-right: 2px;
	}

	.content-section {
		position: relative;
		z-index: 2;
		margin-top: 0;
		padding: 40px 16px calc(80px + env(safe-area-inset-bottom));
		background: #f4f7fb;
		box-sizing: border-box;
	}

	.menu-card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
		padding: 10px 16px;
		margin-bottom: 25px;
		overflow: hidden;
	}

	.health-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16px;
		min-height: 72px;
		box-sizing: border-box;
	}

	.menu-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 14px 0;
		min-height: 56px;
		box-sizing: border-box;
	}

	.row-line {
		height: 1px;
		background: #eef1f5;
		margin-left: 52px;
	}

	.icon-box {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: #e8f0fe;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-right: 12px;
	}

	.menu-icon-img {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

	.menu-icon-ai {
		width: 28px;
		height: 28px;
		border-radius: 50%;
	}

	.row-main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.row-label {
		flex: 1;
		font-size: 15px;
		font-weight: 600;
		color: #1a2b4a;
		min-width: 0;
	}

	.health-card .row-label {
		flex: none;
		font-size: 16px;
	}

	.row-main .row-label {
		flex: none;
	}

	.row-sub {
		margin-top: 4px;
		font-size: 12px;
		color: #9ba3af;
		line-height: 1.4;
	}
</style>