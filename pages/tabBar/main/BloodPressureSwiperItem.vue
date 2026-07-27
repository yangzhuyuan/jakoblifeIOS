<template>
	<view>
		<view class="data_bg">
			<view class="icon_bg bp-measure-btn" @click="$emit('bp-measure-link', 1)">
				<view class="card-vital-icon-wrap">
					<image lazy-load
						:src="Languageceliang == 'zh-Hans' || Languageceliang == 'zh-Hant' ? '../../../static/icons/3.png' : '../../../static/icons/3.png'"
						class="img_style_celiang" mode="aspectFit" />
				</view>
				<text class="bp-measure-action">{{$t('测量')}}</text>
				<text class="bp-measure-label">{{$t('血压')}}</text>
			</view>
			<view
				style="display: flex;flex-direction: column; margin-left: 10px; margin-right: 20px; flex: 4;">
				<view v-if="xueya == 0" style="display: flex;flex-direction: row; align-items: center;">
					<view class="xueya_bg"></view>
					<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
					</view>
					<uni-icons type="help" size="15" style="margin-left: 5px;"
						@tap="$emit('xueya-tap')"></uni-icons>
				</view>
				<view v-else-if="xueya == 1"
					style="display: flex;flex-direction: row;align-items: center;">
					<view style="width: 14px; height:14px;background: #FFEC01;border-radius: 50px;">
					</view>
					<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
					</view>
					<uni-icons type="help" size="15" style="margin-left: 5px;"
						@tap="$emit('xueya-tap')"></uni-icons>
				</view>
				<view v-else-if="xueya == 2"
					style="display: flex;flex-direction: row;align-items: center;">
					<view style="width: 14px; height:14px;background: #FCCD41;border-radius: 50px;">
					</view>
					<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
					</view>
					<uni-icons type="help" size="15" style="margin-left: 5px;"
						@tap="$emit('xueya-tap')"></uni-icons>
				</view>
				<view v-else-if="xueya == 3"
					style="display: flex;flex-direction: row;align-items: center;">
					<view style="width: 14px; height:14px;background: #F55A5A;border-radius: 50px;">
					</view>
					<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
					</view>
					<uni-icons type="help" size="15" style="margin-left: 5px;"
						@tap="$emit('xueya-tap')"></uni-icons>
				</view>
				<view v-else-if="xueya == 4"
					style="display: flex;flex-direction: row;align-items: center;">
					<view style="width: 14px; height:14px;background: #FFFFFF;border-radius: 50px;">
					</view>
					<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
					</view>
					<uni-icons type="help" size="15" style="margin-left: 5px;"
						@tap="$emit('xueya-tap')"></uni-icons>
				</view>
				<view style="width: auto; background:#CCCCCC;height:1px;margin-top: 5px;"></view>
				<view @click="$emit('xueya-click')"
					style="display: flex;flex-direction: row; margin-top: 5px;align-items: center; justify-content: space-between;">
					<view>
						<view style="color: #999999;font-size: 10px;font-weight: 400;">
							{{$t('收缩压')}}/{{Blood}}
						</view>
						<view style="font-weight: bold;margin-top: 10px;font-size: 16px;">
							{{highPressure}}
						</view>
					</view>
					<view>
						<view style="color: #999999;font-size: 10px;font-weight: 400;">
							{{$t('舒张压')}}/{{Blood}}
						</view>
						<view style="font-weight: bold;margin-top: 10px;font-size: 16px;">
							{{lowPressure}}
						</view>
					</view>
					<view style="margin-left: 10px;">
						<view style="color: #999999;font-size: 10px;font-weight: 400;">{{$t('脉搏')}}/BPM
						</view>
						<view style="font-weight: bold;margin-top: 10px;font-size: 16px;">{{pulse}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="data_bg_A">
			<view class="title_zs1">{{$t('血压计注意事项')}}</view>
			<view v-show="binaji" class="tzkpsx" @click="$emit('tiaozhen')">{{$t("编辑数据卡片")}}</view>
			<view class="drag-containersss">
				<basic-drag v-model="listModel" :disabled="disabledsaaa" itemKey="title" :column="2"
					itemHeight="130px" @update:disabled="$emit('update:disabled', $event)">
					<template #item="{element}">
						<view class="data_item_bgsss" :class="'animation-' + animation"
							@click="$emit('list-click', element)">
							<view class="icon_bgsss">
								<view v-if="isVitalCardIcon(element.title)"
									class="card-vital-icon-wrap">
									<image lazy-load :src="element.image" class="img_style_celiang"
										mode="aspectFit" />
								</view>
								<image v-else :src="element.image" class="img_style" mode="aspectFit" />
								<text v-if="isVitalCardIcon(element.title)"
									class="bp-measure-action">{{$t('测量')}}</text>
								<text class="icon_text_bgsss">{{element.title}}</text>
							</view>
							<view
								style="display: flex; flex-direction: column;font-weight: bold;margin-right: 5px;">
								<view v-if="element.bmi_show">
									<view
										style="display: flex; flex-direction: row;align-items: center;">
										<text
											style="margin-left: 5px; color: black;font-size: 10px;white-space: nowrap;text-overflow: ellipsis;overflow: auto;width: 45px;text-align: right;">{{element.BMI_ys}}</text>
										<uni-icons type="help" size="15"
											@tap="$emit('bmi-tap', element.title)"></uni-icons>
									</view>
								</view>
								<view
									style="display: flex; flex-direction: row; align-items: center; justify-content: flex-end;">
									<view v-if="element.bmi_show">
										<view v-if="element.BMI_TF == 0">
											<view
												style="width: 10px; height:10px;background: #FCCD41;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==1"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==2"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #FC7F41;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==3"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #F55A5A;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==4"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #7A0101;border-radius: 50px;">
											</view>
										</view>
										<view v-else-if="element.BMI_TF ==10"
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #58BF78;border-radius: 50px;">
											</view>
										</view>
										<view v-else
											style="display: flex; flex-direction: row;align-items: center;justify-content: flex-end;">
											<view
												style="width: 10px; height:10px;background: #333333;border-radius: 50px;">
											</view>
										</view>
									</view>
									<text
										style="text-align: right;font-size: 16px;margin-left: 10px;">{{element.Step_number}}</text>
								</view>
								<text
									style="text-align: right;color: gray;font-size: 10px;">{{element.type_LX}}</text>
								<text
									style="text-align: right;font-size: 14px;font-size: 13px;font-weight: 400px;">{{element.Step_count}}</text>
							</view>
							<view v-show="delate_icon" class="delete-button"
								@touchstart.stop.prevent="$emit('delete-card', element.title, element)"
								hover-class="del-hover">
								<image src="/static/icons/minus_filled.png" class="delete-icon"
									mode="aspectFit" />
							</view>
						</view>
					</template>
				</basic-drag>
			</view>
			<view v-show="button_show" style="display: flex;flex-direction: column;margin: 20px 0;">
				<view style="display: flex;justify-content: center;color: gray;">{{$t('长按拖动可调整数据卡片位置')}}
				</view>
				<view
					style="display: flex;flex-direction: row;justify-content: space-between; align-items: center; margin-top: 20px;">
					<view @click="$emit('confirm-cards')" class="cardstyle_1">
						{{$t('确认')}}
					</view>
					<view @click="$emit('add-card')" class="cardstyle_2">
						{{$t('添加数据卡片')}}
					</view>
				</view>
			</view>
			<view>
				<image src="/static/image/yundomng2.png" mode="aspectFit"
					style="width: 88vw; height: 220px; margin: 0 20px 120px 20px;border-radius: 20px;object-fit: contain;">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	import BasicDrag from '@/components/basic-drag/index.vue';

	export default {
		name: 'BloodPressureSwiperItem',
		components: {
			BasicDrag
		},
		props: {
			Languageceliang: {
				type: String,
				default: ''
			},
			xueya: {
				type: Number,
				default: 0
			},
			title_name: {
				type: String,
				default: ''
			},
			Blood: {
				type: String,
				default: ''
			},
			highPressure: {
				type: [String, Number],
				default: '--/--'
			},
			lowPressure: {
				type: [String, Number],
				default: '--/--'
			},
			pulse: {
				type: [String, Number],
				default: '--/--'
			},
			binaji: {
				type: Boolean,
				default: true
			},
			list: {
				type: Array,
				default: () => []
			},
			disabledsaaa: {
				type: Boolean,
				default: true
			},
			animation: {
				type: String,
				default: ''
			},
			delate_icon: {
				type: Boolean,
				default: false
			},
			button_show: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			listModel: {
				get() {
					return this.list
				},
				set(val) {
					this.$emit('update:list', val)
				}
			}
		},
		methods: {
			isVitalCardIcon(title) {
				if (!title) return false
				const t = String(title)
				return t === this.$t('心率') || t === this.$t('血氧') || t === 'Heart' || t === 'SpO₂'
			}
		}
	}
</script>

<style scoped>
	.data_bg {
		height: 116px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 5px 20px 0 20px;
		background: white;
		border-radius: 20px;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
	}

	.data_bg_A {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		margin-top: 20px;
		padding: 20px 0 40px 0;
	}

	.icon_bg {
		flex: 1;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.xueya_bg {
		width: 14px;
		height: 14px;
		background: #58BF78;
		border-radius: 15px;
	}

	.title_zs1 {
		display: flex;
		margin-right: 20px;
		margin-left: 20px;
		margin-bottom: 20px;
		color: black;
		font-weight: 600;
		font-size: 12px;
	}

	.tzkpsx {
		height: 38px;
		width: auto;
		display: flex;
		justify-content: center;
		background: white;
		align-items: center;
		margin: 10px 20px 20px 20px;
		padding: 10px;
		font-size: 13px;
		font-weight: 400;
		border-radius: 10px;
		color: #3298F7;
	}

	.drag-containersss {
		display: flex;
		justify-content: center;
		padding-left: 20px;
	}

	.data_item_bgsss {
		height: 90px;
		line-height: 20px;
		width: 36vw;
		display: flex;
		flex-direction: row;
		background: white;
		justify-content: space-between;
		align-items: center;
		border-radius: 20px;
		padding: 10px;
	}

	.icon_bgsss {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		width: 60px;
		font-size: 13px;
		text-align: center;
		font-weight: 600;
	}

	.img_style {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.img_style_celiang {
		width: 48px;
		height: 48px;
		border-radius: 50px;
		object-fit: contain;
	}

	.bp-measure-action {
		margin-top: 6px;
		font-size: 11px;
		line-height: 14px;
		color: #3298F7;
		font-weight: 500;
		text-align: center;
	}

	.bp-measure-label {
		margin-top: 2px;
		font-size: 13px;
		line-height: 18px;
		font-weight: bold;
		color: #222328;
		text-align: center;
	}

	.bp-measure-btn {
		padding: 6px 0;
		min-width: 56px;
	}

	.card-vital-icon-wrap {
		position: relative;
		width: 52px;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.animation-shake {
		animation: shake 1s infinite;
	}

	@keyframes shake {
		0% {
			transform: translateX(0) rotate(-2deg)
		}

		50% {
			transform: translateX(5px) rotate(2deg)
		}

		100% {
			transform: translateX(0) rotate(-2deg)
		}
	}

	.delete-button {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.01);
		z-index: 10;
	}

	.delete-icon {
		width: 25px;
		height: 25px;
		pointer-events: none;
	}

	.del-hover {
		opacity: 0.7;
		transform: scale(0.95);
		transition: all 0.1s;
	}

	.cardstyle_1 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		color: #3298F7;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin-right: 10px;
		margin-left: 10vw;
	}

	.cardstyle_2 {
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		color: #3298F7;
		width: 120px;
		height: 38px;
		font-size: 13px;
		border-radius: 10px;
		padding: 10px;
		text-align: center;
		margin-left: 10px;
		margin-right: 10vw;
	}
</style>
