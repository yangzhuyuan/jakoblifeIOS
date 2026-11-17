<template>
	<view class="shop-page">
		<view class="offer-banner">
			<view class="banner-copy">
				<view class="brand-row">
					<text class="brand-name">Jakoblife</text><text class="brand-mark">®</text>
				</view>
				<text class="banner-title">{{ $t('商城专属优惠') }}</text>
				<text class="banner-subtitle">{{ $t('商城优惠副标题') }}</text>
			</view>
			<view class="gift-art" aria-hidden="true">
				<view class="gift-shadow"></view>
				<view class="gift-loop gift-loop-left"></view>
				<view class="gift-loop gift-loop-right"></view>
				<view class="gift-box">
					<view class="gift-ribbon"></view>
				</view>
				<view class="gift-lid">
					<view class="gift-ribbon"></view>
				</view>
				<view class="gift-knot"></view>
				<view class="gift-tag"><text>%</text></view>
			</view>
		</view>

		<view class="coupon-card">
			<view class="coupon-heading">
				<view class="coupon-heading-icon">
					<view class="tag-outline"></view>
				</view>
				<view class="coupon-heading-copy">
					<text class="section-title">{{ $t('商城优惠码标题') }}</text>
					<text class="section-subtitle">{{ $t('商城优惠码说明') }}</text>
				</view>
			</view>
			<view v-for="offer in visibleOffers" :key="offer.id" class="coupon-row">
				<view class="platform-icon" :class="'platform-' + offer.id" aria-hidden="true">
					<text class="platform-letter">{{ offer.logo }}</text>
					<view v-if="offer.id === 'amazon'" class="amazon-smile"></view>
				</view>
				<view class="offer-copy">
					<text class="offer-title">
						<text class="platform-name">{{ offer.nameKey ? $t(offer.nameKey) : offer.name }}{{ offer.discount ? ':' : '' }}</text>
						<text v-if="offer.discount">{{ $t(offer.prefixKey) }}</text>
						<text v-if="offer.discount" class="discount-value"> {{ offer.discount }} </text>
						<text v-if="offer.discount">{{ $t(offer.suffixKey) }}</text>
					</text>
					<view v-if="offer.id === 'jd'" class="offer-subtitle">
						<text class="jd-line">{{ $t('商城京东联系客服') }}</text>
						<text class="jd-line">"{{ jdRecommendText }}"</text>
					</view>
					<text v-else class="offer-subtitle">{{ $t(offer.descriptionKey) }}</text>
				</view>
				<view class="coupon-button" hover-class="coupon-button-hover" @click="copyCoupon(offer)">
					<text class="coupon-label">{{ $t('商城优惠码') }}</text>
					<text class="coupon-code">****</text>
				</view>
			</view>
		</view>

		<view class="store-list">
			<view v-for="offer in visibleOffers" :key="offer.id" class="store-card" hover-class="store-card-hover"
				@click="openStoreUrl(offer)">
				<view class="platform-icon store-icon" :class="'platform-' + offer.id" aria-hidden="true">
					<text class="platform-letter">{{ offer.logo }}</text>
					<view v-if="offer.id === 'amazon'" class="amazon-smile"></view>
				</view>
				<view class="store-copy">
					<text class="store-title">{{ $t(offer.shopTitleKey) }}</text>
					<text class="store-subtitle">{{ $t(offer.shopSubtitleKey) }}</text>
				</view>
				<uni-icons type="right" size="21" color="#7C879D"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		isInChinaByIP
	} from '../../api/isInChinaByIP.js';

	// 推荐话术保持中文，不进入多语言。联系客服这一句走翻译。复制时仍只复制推荐原文。
	const JD_RECOMMEND_TEXT = 'Jakoblife APP推荐，推荐码：JAKOBLIFEAPP';

	export default {
		data() {
			return {
				inChina: false,
				jdRecommendText: JD_RECOMMEND_TEXT,
				// 购买链接确定后填入各平台的 url；优惠码和优惠展示集中在此维护。
				offers: [{
					id: 'jakoblife',
					name: 'Jakoblife.com',
					logo: 'J',
					discount: '15%',
					code: 'JAKOBLIFEAPP',
					url: 'https://jakoblife.com',
					prefixKey: '商城优惠前缀',
					suffixKey: '商城优惠后缀',
					descriptionKey: '商城官网优惠说明',
					shopTitleKey: '商城官网购买',
					shopSubtitleKey: '商城官网购买说明'
				}, {
					id: 'amazon',
					name: 'Amazon',
					logo: 'a',
					discount: '10%',
					code: 'JAKOBLIFEAPP',
					url: 'https://www.amazon.com/stores/SmartAIHealthManagement/page/4FB4DB1F-FC86-45D0-AEB1-DC4B0FE67F86?lp_asin=B0H72VX9H9&ref_=ast_bln&store_ref=bl_ast_dp_brandlogo_sto',
					prefixKey: '商城优惠前缀',
					suffixKey: '商城优惠后缀',
					descriptionKey: '商城Amazon优惠说明',
					shopTitleKey: '商城Amazon购买',
					shopSubtitleKey: '商城Amazon购买说明'
				}, {
					id: 'jd',
					nameKey: '商城京东',
					logo: 'JD',
					code: 'JAKOBLIFEAPP',
					url: 'https://mall.jd.com/index-16441152.html?from=pc',
					shopTitleKey: '商城京东购买',
					shopSubtitleKey: '商城京东购买说明'
				}]
			};
		},
		computed: {
			visibleOffers() {
				return this.offers.filter(offer => offer.id !== 'jd' || this.inChina);
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('商城页面标题')
			});
			this.refreshChinaVisibility();
		},
		methods: {
			refreshChinaVisibility() {
				isInChinaByIP().then(isInChina => {
					this.inChina = !!isInChina;
				});
			},
			copyCoupon(offer) {
				const data = offer.id === 'jd' ? JD_RECOMMEND_TEXT : offer.code;
				uni.setClipboardData({
					data,
					showToast: false,
					success: () => uni.showToast({
						title: this.$t('商城优惠码复制成功'),
						icon: 'none'
					}),
					fail: () => uni.showToast({
						title: this.$t('商城优惠码复制失败'),
						icon: 'none'
					})
				});
			},
			openStoreUrl(offer) {
				if (!offer.url) {
					uni.showToast({
						title: this.$t('商城链接即将上线'),
						icon: 'none'
					});
					return;
				}
				// #ifdef APP-PLUS
				plus.runtime.openURL(offer.url, () => {
					uni.showToast({
						title: this.$t('打开失败'),
						icon: 'none'
					});
				});
				// #endif
				// #ifdef H5
				window.location.href = offer.url;
				// #endif
				// #ifndef APP-PLUS
				// #ifndef H5
				uni.setClipboardData({
					data: offer.url,
					showToast: false,
					success: () => uni.showToast({
						title: this.$t('商城链接已复制'),
						icon: 'none'
					})
				});
				// #endif
				// #endif
			}
		}
	};
</script>

<style scoped>
	.shop-page {
		min-height: calc(100vh - var(--window-top, 0px));
		padding: 26px 16px calc(64rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;
		background: #f4f7fc;
		color: #101d4d;
	}

	.offer-banner,
	.coupon-card,
	.store-card {
		border-radius: 32rpx;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		background: #ffffff;
	}

	.offer-banner {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 218rpx;
		padding: 30rpx 32rpx;
		overflow: hidden;
		background: linear-gradient(115deg, #deedff 0%, #ffffff 65%, #edf6ff 100%);
	}

	.offer-banner::after {
		content: '';
		position: absolute;
		right: -48rpx;
		bottom: -100rpx;
		width: 420rpx;
		height: 170rpx;
		border-radius: 50%;
		transform: rotate(-18deg);
		background: #ddecff;
	}

	.banner-copy {
		position: relative;
		z-index: 1;
		flex: 1;
		min-width: 0;
	}

	.brand-row {
		display: flex;
		align-items: flex-start;
		color: #007aff;
	}

	.brand-name {
		font-size: 43rpx;
		line-height: 1.15;
		font-style: italic;
		font-weight: 800;
	}

	.brand-mark {
		font-size: 16rpx;
		margin-left: 3rpx;
	}

	.banner-title {
		display: block;
		margin-top: 12rpx;
		font-size: 36rpx;
		line-height: 1.22;
		font-weight: 700;
	}

	.banner-subtitle {
		display: block;
		margin-top: 12rpx;
		color: #748096;
		font-size: 24rpx;
		line-height: 1.4;
	}

	.gift-art {
		position: relative;
		flex-shrink: 0;
		width: 184rpx;
		height: 192rpx;
		margin-left: 14rpx;
		z-index: 1;
		transform: rotate(-7deg);
	}

	.gift-shadow {
		position: absolute;
		bottom: 0;
		left: 5rpx;
		width: 176rpx;
		height: 25rpx;
		border-radius: 50%;
		background: rgba(38, 123, 225, 0.18);
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.gift-box {
		position: absolute;
		left: 18rpx;
		bottom: 8rpx;
		width: 148rpx;
		height: 112rpx;
		border-radius: 6rpx 6rpx 14rpx 14rpx;
		background: linear-gradient(105deg, #f9fcff, #b1d8ff 70%, #78b4f3);
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.gift-lid {
		position: absolute;
		left: 8rpx;
		top: 61rpx;
		width: 166rpx;
		height: 32rpx;
		border-radius: 5rpx;
		background: linear-gradient(180deg, #f0f8ff, #aad2ff);
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.gift-ribbon {
		position: absolute;
		left: 60rpx;
		top: 0;
		width: 30rpx;
		height: 100%;
		background: linear-gradient(90deg, #168cfb, #0362e6 65%, #349dff);
	}

	.gift-box .gift-ribbon {
		left: 50rpx;
	}

	.gift-loop {
		position: absolute;
		top: 16rpx;
		width: 66rpx;
		height: 48rpx;
		box-sizing: border-box;
		border: 13rpx solid #168cfb;
		background: #e4f2ff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.gift-loop-left {
		left: 22rpx;
		border-radius: 65% 65% 10% 65%;
		transform: rotate(22deg);
	}

	.gift-loop-right {
		right: 16rpx;
		border-radius: 65% 65% 65% 10%;
		transform: rotate(-25deg);
	}

	.gift-knot {
		position: absolute;
		left: 74rpx;
		top: 46rpx;
		width: 34rpx;
		height: 27rpx;
		border-radius: 9rpx;
		background: linear-gradient(120deg, #52b8ff, #0064ee);
	}

	.gift-tag {
		position: absolute;
		top: 85rpx;
		right: 0;
		width: 55rpx;
		height: 68rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
		transform: rotate(-17deg);
		background: linear-gradient(120deg, #ffe48a, #ffbf36);
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		color: #8a6726;
		font-size: 39rpx;
		font-weight: 700;
	}

	.gift-tag::before {
		content: '';
		position: absolute;
		top: 5rpx;
		left: 25rpx;
		width: 7rpx;
		height: 7rpx;
		border-radius: 50%;
		background: #d59e31;
	}

	.coupon-card {
		margin-top: 34rpx;
		padding: 28rpx 28rpx 8rpx;
	}

	.coupon-heading {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}

	.coupon-heading-icon {
		width: 58rpx;
		height: 58rpx;
		flex-shrink: 0;
		border-radius: 15rpx;
		background: #e4f0ff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 22rpx;
	}

	.tag-outline {
		position: relative;
		width: 25rpx;
		height: 32rpx;
		border: 3rpx solid #0088ff;
		border-radius: 9rpx 9rpx 4rpx 4rpx;
		transform: rotate(42deg);
	}

	.tag-outline::after {
		content: '';
		position: absolute;
		top: 4rpx;
		left: 9rpx;
		width: 6rpx;
		height: 6rpx;
		border-radius: 50%;
		background: #0088ff;
	}

	.coupon-heading-copy {
		flex: 1;
		min-width: 0;
	}

	.section-title {
		display: block;
		font-size: 29rpx;
		font-weight: 700;
		line-height: 1.35;
	}

	.section-subtitle {
		display: block;
		margin-top: 6rpx;
		font-size: 23rpx;
		line-height: 1.4;
		color: #768195;
	}

	.coupon-row {
		display: flex;
		align-items: center;
		padding: 24rpx 0;
		min-height: 84rpx;
		border-bottom: 1rpx solid #e8eef7;
	}

	.coupon-row:last-child {
		border-bottom: none;
	}

	.platform-icon {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 84rpx;
		height: 84rpx;
		flex-shrink: 0;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.platform-letter {
		font-weight: 700;
		line-height: 1;
	}

	.platform-amazon {
		background: #fff4e4;
		color: #161616;
	}

	.platform-amazon .platform-letter {
		font-family: Georgia, serif;
		font-size: 84rpx;
		transform: translateY(-9rpx);
	}

	.amazon-smile {
		position: absolute;
		left: 12rpx;
		bottom: 12rpx;
		width: 59rpx;
		height: 19rpx;
		border-bottom: 5rpx solid #ff9900;
		border-radius: 0 0 60% 60%;
		transform: rotate(5deg);
	}

	.amazon-smile::after {
		content: '';
		position: absolute;
		right: -1rpx;
		bottom: -2rpx;
		width: 9rpx;
		height: 9rpx;
		border-top: 4rpx solid #ff9900;
		border-right: 4rpx solid #ff9900;
		transform: rotate(-12deg);
	}

	.platform-jd {
		background: linear-gradient(140deg, #ff3925, #e50912);
		color: #ffffff;
	}

	.platform-jd .platform-letter {
		font-size: 38rpx;
		letter-spacing: -2rpx;
	}

	.platform-jakoblife {
		background: linear-gradient(135deg, #20b7ff, #0071f5);
		color: #ffffff;
	}

	.platform-jakoblife .platform-letter {
		font-size: 68rpx;
	}

	.offer-copy {
		flex: 1;
		min-width: 0;
		margin-left: 20rpx;
		margin-right: 12rpx;
	}

	.offer-title {
		display: block;
		font-size: 26rpx;
		font-weight: 700;
		line-height: 1.4;
	}

	.platform-name {
		margin-right: 8rpx;
	}

	.discount-value {
		color: #087eff;
		font-size: 37rpx;
		line-height: 1.2;
		margin: 0 4rpx;
	}

	.offer-subtitle {
		display: block;
		color: #768195;
		font-size: 23rpx;
		line-height: 1.35;
		margin-top: 4rpx;
		overflow-wrap: break-word;
	}

	.jd-line {
		display: block;
	}

	.coupon-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 174rpx;
		min-height: 78rpx;
		padding: 8rpx 4rpx;
		margin: 0;
		border: 1rpx solid #c2ddff;
		border-radius: 44rpx;
		box-sizing: border-box;
		background: linear-gradient(110deg, #e4f0ff, #f2f8ff);
		line-height: 1.25;
		color: #122c63;
	}

	.coupon-button::after {
		border: none;
	}

	.coupon-button-hover {
		background: #cee4ff;
	}

	.coupon-label {
		font-size: 21rpx;
	}

	.coupon-code {
		font-size: 29rpx;
		font-weight: 700;
		color: #0062d5;
		margin-top: 2rpx;
		letter-spacing: 1rpx;
	}

	.store-list {
		margin-top: 36rpx;
	}

	.store-card {
		display: flex;
		align-items: center;
		padding: 25rpx 30rpx;
		margin-bottom: 22rpx;
		min-height: 130rpx;
		box-sizing: border-box;
	}

	.store-card-hover {
		background: #eaf3ff;
	}

	.store-icon.platform-amazon {
		background: transparent;
	}

	.store-copy {
		flex: 1;
		min-width: 0;
		margin: 0 18rpx 0 24rpx;
		padding-left: 24rpx;
		border-left: 2rpx solid #d0def4;
	}

	.store-title {
		display: block;
		font-size: 29rpx;
		line-height: 1.35;
		font-weight: 700;
	}

	.store-subtitle {
		display: block;
		margin-top: 5rpx;
		font-size: 23rpx;
		line-height: 1.35;
		color: #768195;
	}
</style>