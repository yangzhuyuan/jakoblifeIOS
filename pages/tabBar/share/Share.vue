<template>
	<view class="paginds">
		<view class="page-body">
			<view class="page-content">
				<view v-if="shareShow" class="shared-content">
					<view class="switch-bar">
						<SwitchComponent :show1="show1" :show2="show2" @click1="clicked1" @click2="clicked2" />
					</view>
					<scroll-view scroll-y="true" class="empty-scroll">
						<view v-if="show1" class="no-data-container">
							<view class="no-data-text">{{$t('暂无用户与您共享健康数据')}}</view>
							<view class="shared-title">{{$t('健康共享')}}</view>
							<view class="shared-details">
								<view class="textstyles">{{$t('掌握权在您手中')}}</view>
								<view class="textstyles_1">{{$t('安全共享您的健康数据')}}</view>
								<view class="textstyles">{{$t('图标汇总和通知')}}</view>
								<view class="textstyles_1">{{$t('您共享的数据将在其')}}</view>
								<view class="textstyles">{{$t('私密且安全')}}</view>
								<view class="textstyles_1">{{$t('仅分享每个主题的摘要')}}</view>
								<view class="shared-warning">
									<image src="../../../static/icons/warning.png" class="warning-icon"
										mode="aspectFit" />
									<view class="textstyles_1">{{$t('共享对象')}}</view>
								</view>
							</view>
							<button @tap="Share_with_others" class="buttonstyle">{{$t('共享')}}</button>
						</view>
						<view v-else class="no-data-container-empty">
							<image class="imgas" mode="aspectFit" src="../../../static/icons/60x60.png" />
							<view class="empty-text">-</view>
							<view class="empty-text">-</view>
							<view class="textstyles">{{$t('暂无用户与您共享健康数据')}}</view>
						</view>
					</scroll-view>
				</view>
				<view v-else class="shared-content-active">
					<view class="switch-bar">
						<SwitchComponent :show1="show1" :show2="show2" @click1="clicked1" @click2="clicked2" />
					</view>
					<view class="mid-wrap">
						<swiper v-if="show1" class="swiper" :indicator-dots="false"
							:duration="300" :autoplay="autoplay"
							@change="swipeIndex1" @animationfinish="onSwipeFinish"
							:current="currentIndex1">
							<swiper-item v-for="(item, index) in swiperlist" :key="item.id || index">
								<view class="mid-scroll">
									<view class="mid-inner">
										<UserInfo :show1="true" :item="item" />
										<SharedData :show1="true" :item="item"
											:dataPoints="item.dataPoints" />
									</view>
								</view>
							</swiper-item>
						</swiper>
						<swiper v-else class="swiper" :indicator-dots="false"
							:duration="300" :autoplay="autoplay"
							@change="swipeIndex2" @animationfinish="onSwipeFinish"
							:current="currentIndex2">
							<swiper-item v-for="(item, index) in swiperlist" :key="item.id || index">
								<view class="mid-scroll">
									<view class="mid-inner">
										<UserInfo :item="item" />
										<SharedData :item="item" :dataPoints="item.dataPoints" />
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
					<view class="footer-bar" v-if="currentShareItem">
						<view v-if="swiperlist.length > 0" class="swiper-dots">
							<view v-for="(dotItem, dotIndex) in swiperlist" :key="'dot-' + dotIndex" class="swiper-dot"
								:class="{ active: (show1 ? currentIndex1 : currentIndex2) === dotIndex }"></view>
						</view>
						<button v-if="show1" class="buttonstylesss"
							@click="EDITOR(currentShareItem.id, currentShareItem.shareAvatar, currentShareItem.receiverName, currentShareItem.receiverPhone)">
							{{$t('编辑')}}
						</button>
						<button v-else class="buttonstylesss_1" @click="CANEDITOR(currentShareItem.id)">
							{{$t('停止共享')}}
						</button>
					</view>
				</view>
			</view>
			<view class="header">
				<view class="header-btn" @click="zengjia">
					<uni-icons type="plusempty" size="24" color="#007AFF"></uni-icons>
				</view>
				<view class="header-title">{{$t('共享')}}</view>
				<view class="header-btn" @click="caidan">
					<uni-icons type="bars" size="22" color="#007AFF"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import SwitchComponent from "../../../components/sharevue/SwitchComponent.vue";
	import UserInfo from "../../../components/sharevue/UserInfo.vue";
	import SharedData from "../../../components/sharevue/SharedData.vue";
	import {
		mapMutations
	} from 'vuex'
	export default {
		components: {
			SwitchComponent,
			UserInfo,
			SharedData
		},
		data() {
			return {
				show1: true,
				show2: false,
				shareListData: [],
				receiverListData: [],
				indicatorDots: true,
				autoplay: false,
				lettimer: null,
				currentIndex1: 0,
				currentIndex2: 0,
				isSwiping: false,
				pendingList: null,
			}
		},

		computed: {
			swiperlist() {
				return this.show1 ? this.shareListData : this.receiverListData
			},
			shareShow() {
				const list = this.swiperlist
				return !list || list.length === 0
			},
			currentShareItem() {
				const list = this.swiperlist || []
				if (!list.length) return null
				const idx = this.show1 ? this.currentIndex1 : this.currentIndex2
				return list[idx] || list[0]
			}
		},

		onHide() {
			this.clearTimer();
		},

		onShow() {
			this.startTimer();
		},

		methods: {
			...mapMutations(['sethuilian']),
			clearTimer() {
				if (this.lettimer) {
					clearInterval(this.lettimer);
					this.lettimer = null;
				}
			},
			startTimer() {
				const timerLogic = () => {
					if (this.show1) {
						this.shareList();
					} else if (this.show2) {
						this.receiverList();
					}
				};
				// 两边各拉一次，切换 Tab 时已有缓存可立刻显示
				this.shareList();
				this.receiverList();
				this.lettimer = setInterval(timerLogic, 300);
			},
			listSignature(list) {
				if (!list || !list.length) return ''
				return list.map(item => {
					const points = item.dataPoints || []
					const pointSig = points.map(p => `${p.register}:${p.registerVal}`).join(',')
					return `${item.id}|${item.receiverName || ''}|${item.shareName || ''}|${pointSig}`
				}).join(';')
			},
			applyShareList(data) {
				const next = data || []
				if (this.isSwiping && this.show1) {
					this.pendingList = { type: 'share', data: next }
					return
				}
				if (this.listSignature(this.shareListData) === this.listSignature(next)) {
					return
				}
				this.shareListData = next
			},
			applyReceiverList(data) {
				const next = data || []
				if (this.isSwiping && this.show2) {
					this.pendingList = { type: 'receiver', data: next }
					return
				}
				if (this.listSignature(this.receiverListData) === this.listSignature(next)) {
					return
				}
				this.receiverListData = next
			},
			swipeIndex1(e) {
				this.isSwiping = true
				this.currentIndex1 = e.detail.current;
			},
			swipeIndex2(e) {
				this.isSwiping = true
				this.currentIndex2 = e.detail.current;
			},
			onSwipeFinish() {
				this.isSwiping = false
				if (!this.pendingList) return
				const { type, data } = this.pendingList
				this.pendingList = null
				if (type === 'share') {
					this.applyShareList(data)
				} else {
					this.applyReceiverList(data)
				}
			},
			shareList() {
				const data = {
					shareId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_APP_IP + this.$url_share_list, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(pending => {
					if (pending.code === 200) {
						this.applyShareList(pending.data || [])
					}
				})
			},
			receiverList() {
				const data = {
					receiverId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_APP_IP + this.$url_receiver_list, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded;'
				}).then(pending => {
					if (pending.code === 200) {
						this.applyReceiverList(pending.data || [])
					}
				})
			},
			clicked1() {
				this.show1 = true;
				this.show2 = false;
				this.shareList();
			},
			clicked2() {
				this.show1 = false;
				this.show2 = true;
				this.receiverList();
			},
			Share_with_others() {
				uni.navigateTo({
					url: "./Share_with_3"
				});
			},
			zengjia() {
				this.Share_with_others();
			},
			caidan() {
				uni.navigateTo({
					url: '../share/Shared_list'
				});
			},
			EDITOR(id, avatar, name, phone) {
				uni.navigateTo({
					url: `./Share_with_2?AVATAR=${avatar}&NAME=${name}&PHONE=${phone}&ID=${id}`
				});
			},
			CANEDITOR(id) {
				console.log("cancelSharing", id)
				uni.showModal({
					content: this.$t("是否取消此数据的共享"),
					confirmText: this.$t("是"),
					cancelText: this.$t("否"),
					success: (modalres) => {
						if (modalres.confirm) {
							uni.request({
								url: `${this.$url_APP_IP}/prod-api/share/data/${id}`,
								method: 'DELETE',
								header: {
									'Authorization': `Bearer ${uni.getStorageSync("token")}`,
									'content-type': 'application/json'
								},
								success: (res) => {
									console.log("res", res)
									if (res.data.code === 200) {
										uni.showToast({
											title: this.$t("成功"),
											icon: "none",
											duration: 1500,
										})
									}
								},
							});
						} else {
							uni.hideLoading();
						}
					}
				});
			},
		}
	};
</script>

<style>
	.paginds {
		color: #1A2B4A;
		height: 100vh;
		background: #F8F9FB;
		overflow: hidden;
	}

	.page-body {
		height: 100vh;
		color: #1A2B4A;
		background: #F8F9FB;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		/* 仅预留系统 tabBar 高度，避免按钮下方多出一大块空白 */
		padding-bottom: var(--window-bottom);
	}

	.page-content {
		flex: 1;
		min-height: 0;
		padding-top: 88px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.switch-bar {
		flex-shrink: 0;
		background: #F8F9FB;
		padding: 16px 0 14px;
		z-index: 20;
	}

	.shared-content {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: transparent;
		margin: 10px;
		padding: 0 8px;
		border-radius: 0;
		box-shadow: none;
	}

	.empty-scroll {
		flex: 1;
		height: 0;
		min-height: 0;
		background: #FFFFFF;
		border-radius: 16px;
		margin-top: 1px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		padding: 12px 10px;
		box-sizing: border-box;
		margin-bottom: 8px;
	}

	.shared-content-active {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: transparent;
		margin: 0;
		padding: 0 8px;
		border-radius: 0;
		box-sizing: border-box;
	}

	.mid-wrap {
		flex: 1;
		min-height: 0;
		height: 0;
		background: transparent;
		border-radius: 0;
		box-shadow: none;
		overflow: hidden;
	}

	.swiper {
		height: 100%;
		width: 100%;
	}

	.mid-scroll {
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
	}

	.mid-inner {
		padding: 8px 6px 16px;
		box-sizing: border-box;
	}

	.footer-bar {
		flex-shrink: 0;
		padding: 8px 0 10px;
		background: #F8F9FB;
		z-index: 20;
	}

	.swiper-dots {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 4px 0 12px;
		gap: 8px;
	}

	.swiper-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #C5CCD6;
	}

	.swiper-dot.active {
		background: #007AFF;
		width: 16px;
		border-radius: 4px;
	}

	.imgas {
		object-fit: contain;
		display: flex;
		width: 85px;
		height: 85px;
		border-radius: 100px;
		border: 1px solid #E8ECF1;
	}

	.scroll-view {
		margin-top: 20px;
		height: 300px;
	}

	.textstyles {
		margin-top: 20px;
		font-weight: 600;
		font-size: 14px;
		color: #1A2B4A;
	}

	.textstyles_1 {
		font-size: 12px;
		font-weight: 400;
		color: #8A94A6;
	}

	.buttonstyle {
		background: #007AFF;
		width: 154px;
		color: white;
		height: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		font-weight: 600;
		border-radius: 14px;
		margin-top: 40px;
		margin-bottom: 20px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.buttonstylesss,
	.buttonstylesss_1 {
		font-size: 16px;
		font-weight: 600;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #007AFF;
		color: white;
		width: 100%;
		border-radius: 14px;
		margin: 0;
		height: 48px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		border: none;
	}

	.no-data-container {
		margin-top: 20px;
		padding: 0 8px;
	}

	.no-data-container-empty {
		min-height: 50vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.no-data-text {
		text-align: center;
		color: #8A94A6;
		margin-top: 20px;
		font-weight: 600;
		font-size: 15px;
	}

	.shared-title {
		text-align: center;
		color: #1A2B4A;
		margin-top: 24px;
		font-weight: 700;
		font-size: 17px;
	}

	.shared-details {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		padding-left: 8px;
		margin-top: 10px;
	}

	.shared-warning {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
		align-items: center;
	}

	.warning-icon {
		width: 20px;
		height: 20px;
		object-fit: contain;
		margin-right: 10px;
	}

	.empty-text {
		margin-top: 20px;
	}

	.header {
		background: #FFFFFF;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 50px 16px 12px;
		width: 100%;
		box-sizing: border-box;
		z-index: 100;
		box-shadow: 0 1px 0 rgba(26, 43, 74, 0.04);
	}

	.header-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.header-title {
		font-size: 18px;
		font-weight: 700;
		color: #1A2B4A;
		flex: 1;
		text-align: center;
	}
</style>