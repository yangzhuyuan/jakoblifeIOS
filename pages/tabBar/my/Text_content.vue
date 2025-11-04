<template>
	<view style="padding: 10px; display: flex;background: #EFEFF4;color: black;height: 100vh;flex-direction: column;">
		<view class="title_bg">{{title}}</view>
		<view style="padding: 10px 10px 60px 10px">
			<rich-text :nodes="content"></rich-text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				titles: "关于&更新",
				title: '',
				content: ''
			}
		},


		onLoad(res) {
			if (res.id == "1134") {
				this.titles = this.$t('给JakobLife好评')
				this.article(1134)
			} else if (res.id == "1131") {
				this.titles = this.$t('JakobLife软件移动客户端用户使用规范1')
				this.article(1131)
			} else if (res.id == "1130") {
				this.titles = this.$t('JakobLife隐私政策1')
				const lan = uni.getLocale();
				if (lan == 'zh-Hans'|| lan == 'zh-Hant') {
					this.article(1150)
				} else {
					this.article(1130)
				}
			} else if (res.id == "1") {
				this.titles = this.$t('JakobLife软件移动客户端用户使用规范1')
				const lan = uni.getLocale();
				if (lan == 'zh-Hans'|| lan == 'zh-Hant') {
					this.article(1149)
				} else {
					this.article(1)
				}
			} else if (res.id == "1135") {
				this.titles = this.$t('敏感个人信息处理情况说明1')
				this.article(1135)
			} else if (res.id == "1111") {
				this.titles = this.$t('向第三方提供个人信息情况的说明1')
				this.article(1111)
			} else if (res.id == "1136") {
				this.titles = this.$t('已收集个人信息清单1')
				this.article(1136)
			} else if (res.id == "1137") {
				this.titles = this.$t('第三方共享个人清单1')
				this.article(1137)
			} else if (res.id == "1138") {
				this.titles = this.$t('医疗器械使用安全提示1')
				this.article(1138)
			} else if (res.id == "1151") {
				this.titles = this.$t('血压手表使用指南')
				const lan = uni.getLocale();
				if (lan == 'zh-Hans'|| lan == 'zh-Hant') {
					this.article(1151)
				} else {
					this.article(1155)
				}
			} else if (res.id == "1156") {
				this.titles = this.$t('血压手表问题解答')
				const lan = uni.getLocale();
				if (lan == 'zh-Hans'|| lan == 'zh-Hant') {
					this.article(1156)
				} else {
					this.article(1157)
				}
			} else if (res.id == "1158") {
				this.titles = this.$t('血压手表问题解答')
				const lan = uni.getLocale();
				if (lan == 'zh-Hans'|| lan == 'zh-Hant') {
					this.article(1158)
				} else {
					this.article(1159)
				}
			} else if (res.id == "1160") {
				this.titles = this.$t('体脂秤问题解答')
				const lan = uni.getLocale();
				if (lan == 'zh-Hans'|| lan == 'zh-Hant') {
					this.article(1160)
				} else {
					this.article(1161)
				}
			} else {
				this.titles = this.$t('关于更新')
			}
			uni.setNavigationBarTitle({
				title: this.titles
			})
		},




		methods: {
			article(id) {
				let that = this
				uni.request({
					url: that.$url_article,
					method: 'GET',
					data: {
						articleId: id
					},
					header: {
						'content-type': 'application/json' //自定义请求头信息
					},
					success(res) {
						that.title = res.data.data.title
						that.content = res.data.data.content
					}
				})
			},
		}
	}
</script>

<style>
	.title_bg {
		display: flex;
		justify-content: center;
		font-size: 16px;
		font-weight: bold;
		padding-top: 20px;
		padding-bottom: 20px;
	}
</style>