<template>
	<view class="unit-page">
		<view class="unit-content">
			<view class="hs-header">
				<view class="emotion-header">
					<text class="emotion-title">{{ $t('设置') }}</text>
					<view class="hint-row">
						<uni-icons type="info" size="16" color="#3298F7"></uni-icons>
						<text class="hint-text">{{ $t('您可以随时更改这些设置') }}</text>
					</view>
				</view>
				<image class="hero-img" src="/static/page_icon/app_icon_all.jpg" mode="aspectFit"></image>
			</view>
			<text class="section-title">{{ $t('测量单位') }}</text>
			<view class="unit-card">
				<unit-row v-for="(item, index) in rows" :key="index" :title="$t(item.title)" :array="item.array"
					:storage-key="item.key" :current-index="indexMap[item.key] || 0" :icon="item.icon"
					:hide-line="index === rows.length - 1" @unit-change="collectUnit" />
			</view>
			<text class="section-title">{{ $t('测量偏好') }}</text>
			<view class="pref-card">
				<image src="/static/page_icon/danwei_1.png" class="pref-icon" mode="aspectFit"></image>
				<view class="pref-info">
					<text class="pref-title">{{ $t('压力指数') }}</text>
					<text class="pref-desc">{{ $t('每次测量血压后自动计算压力指数') }}</text>
					<text class="pref-desc pref-desc-alert">{{ $t('这个功能必须打开才能使用无感血压测量它用于AI模型训练') }}</text>
				</view>
				<switch :checked="switchHER" @change="switch1ChangeHER" color="#4CD964" style="transform:scale(0.9);" />
			</view>
		</view>

		<view class="unit-footer">
			<button class="save-btn" @tap="saveUnit">{{ $t('保存更改') }}</button>
			<text class="cancel-btn" @tap="goBack">{{ $t('取消') }}</text>
		</view>
	</view>
</template>
<script>
	import unitRow from '@/components/unit-row.vue'
	export default {
		components: {
			unitRow
		},
		data() {
			return {
				rows: [{
						title: '血压',
						key: 'Blood',
						array: ['mmHg', 'kPa'],
						icon: '/static/page_icon/danwei_2.png'
					},
					{
						title: '身高',
						key: 'danwei1',
						array: [this.$t("英寸"), this.$t("厘米")],
						icon: '/static/page_icon/danwei_3.png'
					},
					{
						title: '体重',
						key: 'danwei2',
						array: [this.$t("千克"), this.$t("英镑")],
						icon: '/static/page_icon/danwei_4.png'
					}
				],
				unitMap: {}, // 保存单位值
				indexMap: {}, // 保存索引
				switchHER: uni.getStorageSync("yaliswitchHER") || true,
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$t('单位设置')
			})
			this.cardlist()
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			switch1ChangeHER(e) {
				let that = this
				that.switchHER = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					console.log("1that.switchHER", that.switchHER)
					// 关键点：添加下一行确保视图更新
					that.$nextTick(() => that.$forceUpdate())
				} else if (e.detail.value === true) {
					console.log("2that.switchHER", that.switchHER)

				}
			},

			// 接口获取单位配置
			cardlist() {
				const data = {
					dataType: 'Unitdata'
				};
				this.$get(this.$url_APP_IP + '/prod-api/device/data/list', data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					// console.log("获取单位配置", res)
					if (res.code === 200 && res.rows.length > 0 && res.rows[0].data) {
						const parsed = this.robustParseData(res.rows[0].data);
						if (!parsed.length) return;
						const unitData = parsed[0];
						/* ① 字段映射：key ↔ 接口返回字段 */
						const keyMap = {
							Blood: 'bloodUnit',
							danwei1: 'heightUnit',
							danwei2: 'weightUnit',
							yaliswitchHER: 'switchHER'
						};
						/* ② 统一循环：值 → 索引 → 缓存 */
						Object.keys(keyMap).forEach(key => {
							// 处理开关
							if (key === 'yaliswitchHER') {
								const switchVal = unitData[keyMap[key]];
								if (switchVal !== undefined) {
									this.switchHER = switchVal === true || switchVal === 'true';
									uni.setStorageSync("yaliswitchHER", this.switchHER);
								}
								return;
							}
							const value = unitData[keyMap[key]];
							const row = this.rows.find(r => r.key === key);
							if (!row) return;
							// 单位中英文映射
							const unitAlias = {
								'cm': '厘米',
								'inch': '英寸'
							};
							// 尝试查找原始值，如果找不到且存在别名，则用别名查找
							let idx = row.array.indexOf(value);
							if (idx === -1 && unitAlias[value]) {
								idx = row.array.indexOf(unitAlias[value]);
							}
							const safe = idx !== -1 ? idx : 0;
							this.$set(this.unitMap, key, value);
							this.$set(this.indexMap, key, safe);
							uni.setStorageSync(key, safe);
						});
						uni.$emit('unit-settings-changed');
					}
				});
			},
			// 子组件变更
			collectUnit(e) {
				this.unitMap[e.key] = e.value
				this.$set(this.indexMap, e.key, e.index)
			},
			// 保存单位
			saveUnit() {
				const postData = {
					bloodUnit: this.unitMap.Blood,
					heightUnit: this.unitMap.danwei1,
					weightUnit: this.unitMap.danwei2,
					switchHER: this.switchHER
				}
				const editData = {
					dataType: 'Unitdata',
					data: this.formatDatacard([postData])
				}
				console.log("editData", editData)
				this.$post(this.$url_APP_IP + '/prod-api/device/data/editData', editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						Object.keys(this.indexMap).forEach(key => {
							uni.setStorageSync(key, this.indexMap[key])
						})
						uni.showToast({
							title: this.$t('保存成功'),
							icon: 'none'
						})
						this.cardlist()
						uni.$emit('unit-settings-changed')
					}
				})
			},
			// 格式化数据为接口格式
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(',')
			},
			// 解析接口返回的字符串
			robustParseData(dataStr) {
				try {
					const objects = dataStr.split('},{')
					const result = []
					for (let i = 0; i < objects.length; i++) {
						let objStr = objects[i]
						if (i === 0) objStr += '}'
						else if (i === objects.length - 1) objStr = '{' + objStr
						else objStr = '{' + objStr + '}'
						objStr = objStr.replace(/^{{/, '{').replace(/}}$/, '}')
						const fixed = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (m, k, v) => {
							v = v.trim()
							if (v === 'true' || v === 'false') return `"${k}":${v}`
							if (!isNaN(v) && v !== '' && !v.includes('/')) return `"${k}":${v}`
							return `"${k}":"${v}"`
						})
						result.push(JSON.parse(fixed))
					}
					return result
				} catch (e) {
					console.error('解析失败:', e)
					return []
				}
			}
		}
	}
</script>

<style>
	.unit-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #dceefc 0%, #f4f7fb 42%, #f4f7fb 100%);
		box-sizing: border-box;
	}

	.unit-content {
		padding: 20px 16px calc(180px + env(safe-area-inset-bottom));
		box-sizing: border-box;
	}

	.hs-header {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-bottom: 28rpx;
	}

	.hero-img {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		flex-shrink: 0;
		object-fit: contain;
	}

	.emotion-header {
		flex: 1;
		min-width: 0;
		margin-top: 20px;
		padding-right: 10px;
	}

	.emotion-title {
		display: block;
		font-size: 22px;
		font-weight: 700;
		color: #1A1C1E;
		line-height: 1.25;
		margin-bottom: 5px;
	}

	.section-title {
		display: block;
		font-size: 16px;
		font-weight: 700;
		color: #1a2b4a;
		margin: 20px 4px 12px;
	}

	.unit-card,
	.pref-card {
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
		overflow: hidden;
	}

	.unit-card {
		padding: 4px 16px;
		margin-bottom: 24px;
	}

	.pref-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16px;
		margin-bottom: 20px;
	}

	.pref-icon {
		width: 44px;
		height: 44px;
		border-radius: 22px;
		flex-shrink: 0;
	}

	.pref-info {
		flex: 1;
		margin: 0 12px;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.pref-title {
		font-size: 15px;
		font-weight: 700;
		color: #1a2b4a;
		line-height: 1.3;
	}

	.pref-desc {
		margin-top: 4px;
		font-size: 12px;
		color: #8a94a6;
		line-height: 1.4;
	}

	.pref-desc-alert {
		color: #e54d42;
		font-weight: 700;
	}

	.unit-footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		padding: 12px 16px calc(20px + env(safe-area-inset-bottom));
		background: linear-gradient(180deg, rgba(244, 247, 251, 0) 0%, #f4f7fb 28%, #f4f7fb 100%);
	}

	.hint-row {
		display: block;
		font-size: 12px;
		color: #8E8E93;
		line-height: 1.45;
	}

	.hint-text {
		margin-left: 6px;
		font-size: 13px;
		color: #8a94a6;
	}

	.save-btn {
		margin: 0;
		height: 48px;
		line-height: 48px;
		background: #3298F7;
		color: #ffffff;
		font-size: 16px;
		font-weight: 600;
		border-radius: 24px;
		border: none;
	}

	.save-btn::after {
		border: none;
	}

	.cancel-btn {
		display: block;
		text-align: center;
		margin-top: 12px;
		font-size: 15px;
		font-weight: 600;
		color: #3298F7;
		padding: 8px;
	}
</style>