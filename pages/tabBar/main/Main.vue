<template>
	<view class="all">
		<swiper class="scroll-view-height" :style="{height: screenHeight + 'px'}" @change="swipeIndex"
			:current="currentIndex" :disable-touch="disabletouch">
			<!-- 血压计 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs_1">{{$t("本页面显示均为最近测量数据")}}</view>
						<view class="data_bg">
							<view class="icon_bg" @click="xueyaclick()">
								<image src="../../../static/icons/3.png" class="img_style" mode="aspectFit"></image>
								<text class="icon_text_bg">{{$t('血压')}}</text>
							</view>
							<view
								style="display: flex;flex-direction: column; margin-left: 10px; margin-right: 20px; flex: 4;">
								<view v-if="xueya == 0" style="display: flex;flex-direction: row; align-items: center;">
									<view class="xueya_bg"></view>
									<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
									</view>
									<uni-icons type="help" size="15" style="margin-left: 5px;"
										@tap="xueya_tap"></uni-icons>
								</view>
								<view v-else-if="xueya == 1"
									style="display: flex;flex-direction: row;align-items: center;">
									<view style="width: 14px; height:14px;background: #FFEC01;border-radius: 50px;">
									</view>
									<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
									</view>
									<uni-icons type="help" size="15" style="margin-left: 5px;"
										@tap="xueya_tap"></uni-icons>
								</view>
								<view v-else-if="xueya == 2"
									style="display: flex;flex-direction: row;align-items: center;">
									<view style="width: 14px; height:14px;background: #FCCD41;border-radius: 50px;">
									</view>
									<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
									</view>
									<uni-icons type="help" size="15" style="margin-left: 5px;"
										@tap="xueya_tap"></uni-icons>
								</view>
								<view v-else-if="xueya == 3"
									style="display: flex;flex-direction: row;align-items: center;">
									<view style="width: 14px; height:14px;background: #F55A5A;border-radius: 50px;">
									</view>
									<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
									</view>
									<uni-icons type="help" size="15" style="margin-left: 5px;"
										@tap="xueya_tap"></uni-icons>
								</view>
								<view v-else-if="xueya == 4"
									style="display: flex;flex-direction: row;align-items: center;">
									<view style="width: 14px; height:14px;background: #FFFFFF;border-radius: 50px;">
									</view>
									<view style="margin-left: 5px;font-size: 14px;font-weight: 400;">{{title_name}}
									</view>
									<uni-icons type="help" size="15" style="margin-left: 5px;"
										@tap="xueya_tap"></uni-icons>
								</view>
								<view style="width: auto; background:#CCCCCC;height:1px;margin-top: 5px;"></view>
								<view @click="xueyaclick()"
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
							<view v-show="binaji" class="tzkpsx" @click="tiaozhen()">{{$t("编辑数据卡片")}}</view>
							<view class="drag-containersss">
								<basic-drag v-model="list" :disabled="disabledsaaa" itemKey="title" :column="2"
									itemHeight="130px" @update:disabled="handleUpdateDisabled1">
									<template #item="{element}">
										<view class="data_item_bgsss" :class="'animation-' + animation">
											<view class="icon_bgsss">
												<image :src="element.image" class="img_style" mode="aspectFit" />
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
															@tap="BMI_tap(element.title)"></uni-icons>
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
												@touchstart.stop.prevent="delate_icon_cl(element.title, element)"
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
									<view @click="ture_bt()" class="cardstyle_1">
										{{$t('确认')}}
									</view>
									<view @click="add_bt_xy()" class="cardstyle_2">
										{{$t('添加数据卡片')}}
									</view>
								</view>
							</view>
							<view>
								<image src="/static/image/yundomng2.png"
									style="width: 88vw;height: 220px; margin: 0 20px 120px 20px;border-radius: 20px;">
								</image>
								<!-- 	<scroll-view class="log" scroll-y :scroll-top="scrollTop">
									<view v-for="(l,i) in logs" :key="i" class="log-item">
										log：{{l}}
									</view>
								</scroll-view> -->
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- PPG -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: white;">
						<view class="title_zs_ppg">{{$t("本页面显示均为最近测量数据")}}</view>
						<!-- <view class="title_zs_ppg_2">{{$t("分析置信度")}}:{{signal_quality_score}}/1</view> -->
						<view style="padding: 0 20px 20px 20px;">
							<button class="btnstyle" @click="setting()"
								:disabled="sleep_alertdisabled">{{$t("定时测量")}}</button>
							<button class="btnstyle" @click="sleep_alert()"
								:disabled="sleep_alertdisabled">{{$t("立即测量")}}</button>
							<view style="margin-top: 20px; display: flex;justify-content: center;color: red;">
								{{$t("重要提示本报告结果由算法生成")}}
							</view>
						</view>
						<view class="data_bg_ppg_set">
							<view
								style="margin:20px 20px 180px 20px;background: white;border-radius: 20px; padding: 20px;">
								<view v-show="ppgnewpoint" style="font-size: 14px;font-weight: 600;color: black;">
									😊 {{$t("心情状态评估")}}：<text
										style="font-size: 14px; font-weight: 600;color: black;">{{mood_Description}}</text>
									<view
										style="padding: 0 20px 0 30px; color: #040000;display: flex;flex-direction: row;align-items: center;">
										{{$t("心情指数")}}：
									</view>
									<view
										style=" font-size: 16px;padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
										{{ppgnewpoint}}
									</view>
									<view
										style="padding: 0 20px 0 30px; color: #040000;display: flex;flex-direction: row;align-items: center;">
										{{$t("心情等级")}}：
									</view>
									<view
										style="font-size: 16px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
										{{mood_level}}
									</view>
								</view>
								<view v-show="depression_risk_score"
									style="font-size: 14px;font-weight: 600;color: black;">
									🧠 {{$t("心理健康评估")}}：
									<view
										style="padding: 0 20px 0 30px; color: #040000;display: flex;flex-direction: row;align-items: center;">
										{{$t("抑郁风险评分")}}：
									</view>
									<view
										style="font-size: 18px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
										{{depression_risk_score}}
									</view>
									<view
										style="padding: 0 20px 0 30px; color: #040000;display: flex;flex-direction: row;align-items: center;">
										{{$t("抑郁风险等级")}}：<button @click="xiangxibaogo()" class="btnstyle"
											style="margin: 0;  width: 120px; height: 30px; font-size: 10px; display: flex; justify-content: center;align-items: center;"
											:disabled="baoggaodisabled">{{$t("详细报告")}}</button>
									</view>
									<view
										style="font-size: 16px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
										{{depression_risk_level}}.
									</view>
									<view v-if="!finalResult" style=" font-size: 16px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items:
										center;">
										({{$t("需要两周以上测试数据进行评估")}})
									</view>
									<view v-else
										style="font-size: 16px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
										<button @click="pingfentiaozhuan()"
											style="margin: 0; width: 100%; background: #3298F7; color: white;  height: 30px; font-size: 10px; display: flex; justify-content: center;align-items: center;">{{$t("进行进一步风险评估")}}</button>
									</view>
								</view>
								<view v-show="stress_Index||fatigue_index||recovery_index"
									style="font-size: 14px;font-weight: 600;color: black;">
									<view style="display: flex;flex-direction: row;align-items: center;">🏥
										{{$t("综合健康指标")}}：<view @click="health_Explanation()"><uni-icons type="help"
												size="18"></uni-icons></view>
									</view>
									<view
										style="padding: 0 20px 0 30px; color: #e60012;display: flex;flex-direction: row;align-items: center;">
										{{$t("压力指数")}}：
									</view>
									<view
										style="font-size: 18px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
										{{stress_Index}}/10
									</view>
									<view v-show="stress_Index>=5&&sleep_point<70 && sleep_point!=='--/--'"
										style="font-size: 14px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
										<text>{{$t("高压力睡眠碎片化")}}</text>
									</view>
									<view
										style="padding: 0 20px 0 30px; color: #e60012;display: flex;flex-direction: row;align-items: center;">
										{{$t("疲劳指数")}}：
									</view>
									<view
										style="font-size: 16px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
										{{fatigue_index}}/10
									</view>
									<view v-if="fatigue_index>=5&&sleep_point<60&&sleep_point!=='--/--'"
										style="font-size: 14px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
										<text>{{$t("高疲劳睡眠时长不足")}}</text>
									</view>
									<view
										v-else-if="fatigue_index>=5&&(sleep_point<80&&sleep_point>60)&&sleep_point!=='--/--'"
										style="font-size: 14px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
										<text>{{$t("高疲劳深睡比例异常")}}</text>
									</view>
									<view v-else
										style="font-size: 14px; padding: 0 20px 0 40px; color: black;display: flex;flex-direction: row;align-items: center;">
									</view>
									<view
										style="padding: 0 20px 0 30px; color: #e60012;display: flex;flex-direction: row;align-items: center;">
										{{$t("恢复指数")}}：
									</view>
									<view
										style="font-size: 16px; padding: 0 20px 0 40px; color: #3298F7;display: flex;flex-direction: row;align-items: center;">
										{{recovery_index}}
									</view>
								</view>
								<view v-show="fenxi" style="font-size: 14px;font-weight: 600;color: #3298F7;">
									{{$t("建议")}}
									<view
										style="padding: 0 20px 20px 20px; color: #040000;display: flex;flex-direction: row;align-items: center;">
										{{fenxi}}
									</view>
								</view>
								<view v-show="fenxi||ppgnewpoint" style="width: 100%;height: 1px; background: gray;">
								</view>
								<view class="pagedsismj_4">
									<picker style="flex: 2;" @change="types_change" :value="types_index"
										:range="types_array">
										<view style="font-size: 14px;color: white;">
											{{types_array[types_index]}}
										</view>
									</picker>
									<picker @change="types_change" :value="types_index" :range="types_array">
										<uni-icons style="flex: 1;" type="bottom" size="18" color="white"></uni-icons>
									</picker>
								</view>
								<view
									style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
									{{$t('当天')}}：
								</view>
								<view class="charts-box-ppg">
									<qiun-data-charts type="line" :opts="optsPPG" :chartData="chartDataPPG" />
								</view>
								<view
									style="margin: 20px 0;font-size: 20px; font-weight: 600; display: flex;justify-content: flex-start;">
									{{$t('两周')}}：{{$t('平均')}}
								</view>
								<view class="charts-box-ppg">
									<qiun-data-charts type="line" :opts="optsPPG2" :chartData="chartDataPPG2" />
								</view>
								<view style="margin-top: 20px; width: 100%;height: 1px; background: gray;">
								</view>
								<view class="page-transparent">
									<view
										style="font-size: 17px; font-weight: 600;display: flex;justify-content: center;">
										{{$t("指标阈值表")}}
									</view>
									<view class="table-box">
										<!-- 表头 -->
										<view class="thead">
											<text class="th">{{$t("指标名称")}}</text>
											<text class="th">{{$t("阈值")}}</text>
											<text class="th">{{$t("对应描述")}}</text>
										</view>
										<!-- 表格体 -->
										<view class="tbody" v-for="(row, i) in Indicatorlist" :key="i">
											<text class="td">{{ row.zh }}</text>
											<text class="td">
												<text :class="row.red ? 'red' : ''">{{ row.val }}</text>
											</text>
											<text class="td">
												<text :class="row.red ? 'red' : ''">{{ row.desc }}</text>
											</text>
										</view>
									</view>
								</view>
							</view>
							<!-- <scroll-view class="log" scroll-y :scroll-top="scrollTop">
								<view v-for="(l,i) in logs" :key="i" class="log-item">
									log：{{l}}
								</view>
							</scroll-view> -->
						</view>
						<!-- PPG波形组件 -->
						<!-- <view class="container">
							<PpgWaveform @draw-complete="onDrawComplete" ref="ppgWaveformRef" />
						</view> -->
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 体脂秤 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs_1">{{$t("本页面显示均为最近测量数据")}}</view>
						<view style="display: flex;flex-direction: row;margin-top: 5px;">
							<!-- 最新体重 -->
							<view @click="new_latest()"
								style="background: white; border-radius: 20px;padding: 10px; width: 45vw;margin-left: 20px;box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);">
								<view style="display: flex;align-items: center;">
									<image src="../../../static/icons/6.png" style="width: 25px; height: 25px;"></image>
									<text style="font-size: 18px;margin-left: 10px;">{{$t('最新体重')}}</text>
								</view>
								<view
									style="margin-top: 30px; display: flex;flex-direction: row;justify-content: center; align-items: center;">
									<text style="font-size: 44px;font-weight: bold;">{{Latest_weight}}</text>
									<text style="margin-top: 15px; margin-left: 10px;">{{newweightKG}}</text>
								</view>
								<view style="text-align: right;margin-top: 20px; font-size: 18px;">{{Latest_date}}
								</view>
							</view>
							<view
								style=" margin-left: 20px; margin-right: 20px; width: 40vw;background: white; border-radius: 20px;box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);">
								<!-- 初始体重 -->
								<view @click="Initial()">
									<view style="display: flex;align-items: center;padding: 10px;">
										<image src="../../../static/icons/6.png" style="width: 20px; height: 20px;">
										</image>
										<text style="margin-left: 5px;">{{$t('初始体重')}}</text>
									</view>
									<view class="tizhong_item_2">
										<text
											style="font-size: 18px;font-weight: bold;color: black;">{{Initial_weight}}</text>
										<text style="margin-left: 5px; color: gray;">{{chuhsikg}}</text>
									</view>
								</view>
								<view style="margin:5px 0 5px 8px; background: gainsboro; width: 33vw; height: 1px;">
								</view>
								<!-- 目标体重 -->
								<view @click="Target()">
									<view style="display: flex;align-items: center;padding: 10px;">
										<image src="../../../static/icons/6.png" style="width: 20px; height: 20px;">
										</image>
										<text style="margin-left: 5px;">{{$t('目标体重')}}</text>
									</view>
									<view class="tizhong_item_2">
										<text style="font-size: 18px;font-weight: bold;">{{Target_weight}}</text>
										<text style="margin-left: 5px;color: gray;">{{chuhsikg}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="data_bg_A">
							<view class="title_zs1">{{$t('体脂秤注意事项')}}</view>
							<view class="tzkpsx" v-show="binaji2" @click="tiaozhen2()">{{$t("编辑数据卡片")}}</view>
							<view class="drag-containersss">
								<basic-drag v-model="list2" :disabled="disabledsaaa2" itemKey="title" :column="2"
									itemHeight="130px" @update:disabled="handleUpdateDisabled">
									<template #item="{element}">
										<view class="data_item_bgsss" :class="'animation2-' + animation2">
											<view class="icon_bgsss">
												<image :src="element.image" class="img_style" mode="aspectFit" />
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
															@tap="BMI_tap(element.title)"></uni-icons>
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
													style="text-align: right;font-size: 13px;">{{element.Step_count}}</text>
											</view>
											<view v-show="delate_icon2" class="delete-button"
												@touchstart.stop.prevent="delate_icon_cl_2(element.title,element)">
												<image src="/static/icons/minus_filled.png" class="delete-icon"
													mode="aspectFit" />
											</view>
										</view>
									</template>
								</basic-drag>
							</view>
							<view v-show="button_show2" style="display: flex;flex-direction: column;">
								<view style="display: flex;justify-content: center;color: gray;">{{$t('长按拖动可调整数据卡片位置')}}
								</view>
								<view
									style="display: flex;flex-direction: row;justify-content: space-between; align-items: center; margin-top: 20px;">
									<view @click="ture_bt2()" class="cardstyle_1">{{$t('确认')}}
									</view>
									<view @click="add_bt2()" class="cardstyle_2">
										{{$t('添加数据卡片')}}
									</view>
								</view>
							</view>
							<view style="padding: 20px 20px 220px 20px;" @click="tizhiclick()">
								<view
									style="background: white; border-radius: 20px;padding: 10px;box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);">
									<view class="tiwei_bg">
										<view style="font-weight: bold;">{{$t('体围数据')}}</view>
										<view style="color: gray;">{{$t('单位')}}</view>
									</view>
									<view class="tiwei_bg">
										<view class="tiwei_item_bg">
											<text class="text_title_bg">{{$t('胸围')}}</text>
											<text class="tiwei_item_item_bg">{{Chest_circumference}}</text>
										</view>
										<view class="tiwei_item_bg">
											<text class="text_title_bg">{{$t('腰围')}}</text>
											<text class="tiwei_item_item_bg">{{waistline}}</text>
										</view>
										<view class="tiwei_item_bg">
											<text class="text_title_bg">{{$t('臀围')}}</text>
											<text class="tiwei_item_item_bg">{{Hip_circumference}}</text>
										</view>
										<view class="tiwei_item_bg">
											<text class="text_title_bg">{{$t('上臂围')}}</text>
											<text class="tiwei_item_item_bg">{{Upper_Chest_circumference}}</text>
										</view>
										<view class="tiwei_item_bg">
											<text class="text_title_bg">{{$t('大腿围')}}</text>
											<text class="tiwei_item_item_bg">{{Thigh_circumference}}</text>
										</view>
										<view class="tiwei_item_bg">
											<text class="text_title_bg">{{$t('小腿围')}}</text>
											<text class="tiwei_item_item_bg">{{Calf_circumference}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 睡眠 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs_1">{{$t("本页面显示均为最近测量数据")}}</view>
						<!-- 	<view class="data_bg">
							<view class="icon_bg">
								<image src="../../../static/icons/3.png" class="img_style" mode="aspectFit"></image>
								<text class="icon_text_bg">{{$t('压力')}}</text>
							</view>
							<view
								style="flex: 2;display: flex;flex-direction: column;align-items: center;justify-content: center;">
								<view style="font-weight: bold;font-size: 16px;">{{yali}}</view>
								<view style="color: #999999;font-size: 10px;font-weight: 400;">kPa</view>
								<view style="text-align: right;font-size: 13px;">{{yali_time}}</view>
							</view>
						</view> -->
						<view class="data_bg">
							<view class="icon_bg">
								<image src="../../../static/icons/3.png" class="img_style" mode="aspectFit"></image>
								<text class="icon_text_bg">{{$t('睡眠')}}</text>
							</view>
							<view
								style="flex: 1;display: flex;flex-direction: column;align-items: center;justify-content: center;">
								<view style="font-weight: bold;font-size: 16px;">{{sleep}}</view>
								<view style="color: #999999;font-size: 10px;font-weight: 400;">Time</view>
								<view style="text-align: right;font-size: 13px;">{{sleep_time}}</view>
							</view>
							<view class="yalistyds">
								<view class="yalistyd_2">Light:{{totalLight}}</view>
								<view class="yalistyd_2">Deep:{{totalDeep}}</view>
								<view class="yalistyd_2">REM:{{totalRem}}</view>
							</view>
						</view>
						<view class="data_bg_A" style="padding: 20px;font-size: 16px; font-weight: 400; color: black;">
							<view
								style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
								<view
									style="margin-right: 5px; flex: 1; display: flex;justify-content: center; align-items: center; background: white;color: white;padding: 15px;font-weight: bold;font-size: 14px;border-radius: 100px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4); color: #222328;">
									{{$t("评分")}}：<text v-if="sleep_point>=80 "
										style="font-size: 22px;color: #58BF78;">{{sleep_point}}</text>
									<text v-else-if="sleep_point<80&&sleep_point>=60 "
										style="font-size: 22px;color: #FFEC01;">{{sleep_point}}</text>
									<text v-else-if="sleep_point<60 "
										style="font-size: 22px;color:  #F55A5A;">{{sleep_point}}</text>
									<text v-else style="font-size: 22px;color:  #3298F7;">{{sleep_point}}</text>
								</view>
								<view class="context_btn2">
									<view class="context_title1">{{$t('是否服用药物')}}</view>
									<switch @change="switch1Change" style="transform:scale(0.8);" :checked="medication"
										color="#3298F7" />
								</view>
							</view>
							<view v-show="sleep_point!=='--/--'"
								style="padding: 15px; background: white;margin-top: 20px;border-radius: 20px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);">
								<view v-if="sleepTip && sleep_point<85" class="sleep-card">
									<view class="sleep-title">{{ $t('睡眠血压交叉分析') }}:</view>
									<view v-for="(line, idx) in sleepTip" :key="idx" class="sleep-line">
										<text>{{ $t(line) }}</text>
									</view>
								</view>
								<view v-else class="icon_item_bg_toast">{{$t("睡眠良好")}}</view>
							</view>
							<!-- <view style="display: flex;justify-content: space-between;">
								<view>0～25:</view>
								<view>{{$t("容易")}}</view>
							</view>
							<view
								style="background: gainsboro;width: auto;height: 1px;margin-top: 10px;margin-bottom: 5px;">
							</view>
							<view style="display: flex;justify-content: space-between;">
								<view>26～50:</view>
								<view>{{$t("低压")}}</view>
							</view>
							<view
								style="background: gainsboro;width: auto;height: 1px;margin-top: 10px;margin-bottom: 5px;">
							</view>
							<view style="display: flex;justify-content: space-between;">
								<view>51～75:</view>
								<view>{{$t("适度的压力")}}</view>
							</view>
							<view
								style="background: gainsboro;width: auto;height: 1px;margin-top: 10px;margin-bottom: 5px;">
							</view>
							<view style="display: flex;justify-content: space-between;">
								<view>76～100:</view>
								<view>{{$t("高度的压力")}}</view>
							</view> -->
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 步数 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #3298F7;">
						<view class="title_zs_1">{{$t("本页面显示均为最近测量数据")}}</view>
						<view class="data_bg">
							<view class="icon_bg">
								<image src="../../../static/icons/1.png" class="img_style" mode="aspectFit"></image>
								<text class="icon_text_bg">{{$t('步数')}}</text>
							</view>
							<view
								style="flex: 1;display: flex;flex-direction: column;align-items: center;justify-content: center;">
								<view style="font-weight: bold;font-size: 16px;">{{bushu}}</view>
								<view style="color: #999999;font-size: 10px;font-weight: 400;">{{$t('计步')}}</view>
								<view style="text-align: right;font-size: 13px;">{{bushu_time}}</view>
							</view>
							<view
								style="flex: 1;display: flex;flex-direction: column;align-items: center;justify-content: center;">
								<view style="font-weight: bold;font-size: 20px;color: green;">{{today_Daily_Goal}}
								</view>
								<view style="color: #999999;font-size: 10px;font-weight: 400;">{{$t('每天目标')}}</view>
							</view>
						</view>
						<view class="data_bg_A">
							<view class="charts-box-2">
								<qiun-data-charts type="column" :opts="opts" :chartData="chartData" />
							</view>
							<view style="margin-bottom: 160px;">
								<view
									style="margin: 20px;display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
									<input type="number" v-model="Daily_Goal" :placeholder="$t('每天目标')"
										style="flex: 2; text-align: center;background: white;padding: 15px;border-radius: 10px;margin-right: 5px;" />
									<button @click="Daily_Goal_set()"
										style="flex: 1;margin-left: 5px;background: #3298F7; color: white;font-weight: bold;">设置</button>
								</view>
								<!-- <view style="margin: 20px;font-size: 16px;display: flex;align-items: center;">
									{{$t('已设置的目标')}}:<text
										style="font-size: 28px;font-weight: bold;color: green;margin-left: 10px;">{{today_Daily_Goal}}</text>
								</view> -->
								<view v-if="parseInt(bushu)  >= parseInt(today_Daily_Goal)" class="icon_item_bg_toast">
									{{$t("今天达标了明天在加油")}}
									<uni-icons type="hand-up-filled" size="28" color="#3298F7"></uni-icons>
								</view>
								<view v-else-if="parseInt(bushu) < 5000 && xueya !== 0" class="icon_item_bg_toast">
									{{$t("你的血压有点高")}}<uni-icons type="fire-filled" size="28" color="red"></uni-icons>
								</view>
								<view v-else-if="parseInt(bushu) < parseInt(today_Daily_Goal)"
									class="icon_item_bg_toast">
									{{$t("今天没达标明天要多运动")}}
								</view>
								<view v-else class="icon_item_bg_toast">
									<!-- 其他情况 -->
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!--标题 -->
		<view class="title_all">
			<view class="title_all_1">
				<image :src="msg ? '../../../static/icons/19.png' : '../../../static/icons/20.png'" mode="aspectFit"
					style="width: 25px; height: 25px; padding-left: 20px;object-fit: contain;"
					@click="Historical_record()">
				</image>
				<view class="title">{{$t('首页')}}</view>
				<view style="padding-right: 20px;color: white;font-size: 16px;" @click="helperclick()">{{$t("帮助")}}
				</view>
			</view>
			<scroll-view scroll-x class="navscroll" :scroll-left="scrollLeft">
				<view class="nav-container">
					<view class="item" v-for="(item, index) in tabs" :key="index">
						<view @click="swtichSwiper(index)" class="tab-text" :class="{ active: currentIndex === index }">
							{{ item }}
						</view>
						<view class="underline" v-if="currentIndex === index"></view>
					</view>
				</view>
			</scroll-view>
		</view>




		<!-- 悬浮弹窗 -->
		<view class="showTotal" v-show="fillOut">
			<view class="over">
				<view class="show">
					<view style="display: flex;justify-content: flex-end;margin-right: 40px;" @click="closess()">
						<uni-icons size="30" type="closeempty"></uni-icons>
					</view>
					<view style="margin-top: 220px;">
						<view style="color: black;font-size: 38px; font-weight: bold;">{{showTotal_date}}</view>
						<view style="background: black; width: 50%; height: 1px;margin-top: 20px;"></view>
						<view style="color: #2595D3;margin-top: 5px;">{{$t('确保每天摄入足够的水')}}</view>
					</view>
					<view style="display: flex; flex-direction: row;  margin-top: 60px;margin-left: 10px;">
						<view style="display: flex;flex-direction: column; align-items: center;" @click="Keep()">
							<image src="../../../static/icons/6.png"
								style="width: 50px; height: 50px;border-radius: 40px;">
							</image>
							<text
								style="margin-top: 5px;font-weight: bold;text-align:center;width: 80px;">{{$t('记体重')}}</text>
						</view>
						<view style="display: flex;flex-direction: column;  align-items: center;margin-left: 10px;"
							@click="Body_circumference()">
							<image src="../../../static/icons/7.png"
								style="width: 50px; height: 50px;border-radius: 40px;">
							</image>
							<text
								style="margin-top: 5px;font-weight: bold;text-align:center;width: 80px;">{{$t('记体围')}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 悬浮按钮 -->
		<float-button ref="floatButton" :visible="buttonVisible" :pattern="buttonPattern"
			@subButtonClick="onSubButtonClick" @menuOpen="onMenuOpen" />


		<!-- 血压普通弹窗 -->
		<view>
			<uni-popup ref="popup" :mask-click="false">
				<view class="xueyastyle">
					<view style="font-size: 17px; font-weight: 600;">{{$t("血压分类")}}</view>
					<view style="font-size: 14px; font-weight: 400;margin-top: 10px;color: #999999;">
						{{$t("根据WHOISH的血压分类2020年修订版")}}
					</view>
					<view
						style="background:#222328; color: white;padding: 10px; margin:10px 10px 0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("血压类别")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("收缩压")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("和或")}}</view>
						<view style="flex: 1;text-align: center;">{{$t("舒张压")}}</view>
					</view>
					<view
						style="background:#A6CE39; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("正常血压")}}</view>
						<view style="flex: 1;text-align: center;">91-120</view>
						<view style="flex: 1;text-align: center;">{{$t("和")}}</view>
						<view style="flex: 1;text-align: center;">61-80</view>
					</view>
					<view
						style="background:#FFEC01; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("正常高血压值")}}</view>
						<view style="flex: 1;text-align: center;">121-140</view>
						<view style="flex: 1;text-align: center;">{{$t("或")}}</view>
						<view style="flex: 1;text-align: center;">81-90</view>
					</view>
					<view
						style="background:#FFB602; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("一级高血压")}}</view>
						<view style="flex: 1;text-align: center;">141-160</view>
						<view style="flex: 1;text-align: center;">{{$t("或")}}</view>
						<view style="flex: 1;text-align: center;">91-100</view>
					</view>
					<view
						style="background:#BB3A01; color: black;padding: 10px; margin:0 10px; display: flex;justify-content: center; align-items: center;width: 90%;">
						<view style="flex: 1;text-align: center;">{{$t("二级高血压")}}</view>
						<view style="flex: 1;text-align: center;">161-180</view>
						<view style="flex: 1;text-align: center;">{{$t("或")}}</view>
						<view style="flex: 1;text-align: center;">101-110</view>
					</view>
					<button @tap="knowe()"
						style="width: 120px; height: 48px;  border-radius: 20px;background: #3298F7;color: white;margin-top: 20px">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- BMI普通弹窗 -->
		<view>
			<uni-popup ref="popup1" :mask-click="false">
				<view
					style="background: #FFFFFF; border-radius: 24px; width: 90vw; padding-bottom: 20px;  margin: 0 10vw 0 10vw;">
					<view style="padding: 20px; ">
						<view style="font-weight: 600;text-align: center; font-size: 16px;">{{$t('BMI分类')}}</view>
						<view style="color: #999999;font-size: 10px;margin-top: 20px;text-align: center;">
							{{$t('根据世界卫生组织的最新BMI分类')}}
						</view>
						<view
							style="display: flex; flex-direction: row; padding: 5px; align-items: center;margin-top: 20px; margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;">{{$t('BMI范围')}}</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;">{{$t('分类')}}</view>
						</view>
						<view
							style="padding: 5px;background: #FCCD41; width: 88%;margin-top: 10px; display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">&lt;18.5</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('体重过轻')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #58BF78; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">18.5-24.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('正常体重')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #FC7F41; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('超重')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #F55A5A; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('一级肥胖')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #7A0101; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">{{$t('二级肥胖')}}
							</view>
						</view>
						<view
							style="padding: 5px;background: #333333; width: 88%;display: flex; flex-direction: row; align-items: center;margin-left: 10px;">
							<view style="font-weight: 600;width: 20vw;font-size: 8px;color: white;">25.0-29.9</view>
							<view style="font-weight: 600;width: 40vw;font-size: 8px;color: white;">
								{{$t('三级肥胖或病态肥胖')}}
							</view>
						</view>
					</view>
					<button @tap="knowe1()"
						style="width: 120px; height: 48px; border-radius: 100px;background: #3298F7;color: white;display: flex;justify-content: center;align-items: center;">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- 血氧 -->
		<view>
			<uni-popup ref="popup2" :mask-click="false">
				<view
					style="background: #FFFFFF; border-radius: 24px; width: 90vw; padding-bottom: 20px;  margin: 0 10vw 0 10vw;">
					<view style="padding: 20px; ">
						<view style="font-weight: bold;padding-top: 20px;font-size: 16px; text-align: center;">
							{{$t('血氧分类')}}
						</view>
						<view
							style="color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							<view style="width: 90px;display: flex;justify-content: flex-end;">95%</view>
							<view style="width: 60px;"></view>
							<view style="width: 90px;display: flex;justify-content: flex-start;">98%</view>
						</view>
						<view
							style="color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							<view style="background: #FCCD41; width: 80px;height: 10px;"></view>
							<view style="background: #7AE545;width: 80px;height: 10px;"></view>
							<view style="background: #58BF78;width: 80px;height: 10px;"></view>
						</view>
						<view
							style="color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							<view style="width: 80px;height: 10px;">{{$t('偏低')}}</view>
							<view style="width: 80px;height: 10px;">{{$t('正常')}}</view>
							<view style="width: 80px;height: 10px;">{{$t('偏高')}}</view>
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧1')}}
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧2')}}
						</view>
						<view
							style="padding: 10px; color: gray;font-size: 12px;margin-top: 10px;display: flex; justify-content: center; align-items: center;flex-direction: row;">
							{{$t('血氧3')}}
						</view>
					</view>
					<button @tap="knowe2()"
						style="width: 120px; height:48px; display: flex;justify-content: center;align-items: center; border-radius: 100px;background: #3298F7;color: white;">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>
		<!--体脂秤首页滑动-->
		<view>
			<uni-popup ref="tihzi_popup_hd" :mask-click="false">
				<view class="uni_popup_bg">
					<view style="display: flex;justify-content: space-between;align-items: center; padding:15px;">
						<view @click="hd_closess()">✖</view>
						<view style=" margin-left: 50px;">
							<text @click="dataclick1()">{{birthday1}}</text>
							<uni-icons type="bottom" size="16"></uni-icons>
						</view>
						<view style="color: #3298F7;" @click="sdsr()">{{$t('手动输入')}}</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view>
							<view style="display: flex;justify-content: space-between;margin-top: 10px;">
								<view class="title_select_ruler">{{$t('胸围')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{xw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;margin-top: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="xw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('腰围')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{yw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="yw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('臀围')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{tw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="tw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('上臂围')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{stw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="stw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('大腿围')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{dtw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="dtw_handleChange"></select-ruler>
							</view>
							<view style="display: flex;justify-content: space-between;margin-top: 20px;">
								<view class="title_select_ruler">{{$t('小腿围')}}</view>
								<view style="display: flex;justify-content: center; flex-direction: row;">
									<view style="font-weight: bold;font-size: 18px;">{{xtw_value}}</view>
									<text style="margin-left: 5px;">cm</text>
								</view>
								<text></text>
							</view>
							<view style="width: 90vw;padding: 10px;">
								<select-ruler :min="0" :max="1500" :disable="false" :multiple="10" :point="1"
									:defaultValue="1000" @change="xtw_handleChange"></select-ruler>
							</view>
						</view>
						<button @tap="select_ruler()"
							style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
					</scroll-view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="qs_popup" :mask-click="true">
				<view style="border-radius: 20px;background:#fff; padding-bottom: 10px;align-items: center;">
					<view style="display: flex;justify-content: center; padding: 10px;">
						<picker fields="day" mode="date" :value="birthday1111" @change="bindDateChange"
							:end='endtimesss'>
							<view style="display: flex;flex-direction: row;">
								<view style="font-size: 16px;color: black;">{{birthday1111}}</view>
								<uni-icons type="bottom" size="18" style="margin-left: 5px;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="padding: 10px;width: 80vw;">
						<view
							style="margin:0 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shousuoya" :placeholder="$t('请输入收缩压')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">{{Blood}}</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="shuzhangya" :placeholder="$t('请输入舒张压')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">{{Blood}}</text>
						</view>
						<view
							style="margin:20px 20px 0 20px; display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="maibo" :placeholder="$t('请输入脉搏')"
								style="text-align: center;" />
							<text style="margin-left: 5px;">BPM</text>
						</view>

					</view>
					<button class="buttonstylesds" @tap="truesss()">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- 体脂秤首页手动 -->
		<view>
			<uni-popup ref="tihzi_popup_sd" :mask-click="false">
				<view class="uni_popup_bg">
					<view style="display: flex;justify-content: space-between; padding: 10px;">
						<text @click="sd_closess()">✖</text>
						<view style="display: flex; flex-direction: row; margin-left: 50px;">
							<text @click="dataclick()">{{birthday}}</text>
							<uni-icons type="bottom" size="16"></uni-icons>
						</view>
						<view style="color: #3298F7;" @click="hdsr()">{{$t('滑动输入')}}</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y">
						<view style="padding-bottom: 10px;align-items: center;">
							<view style="padding: 10px;">
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
									<input type="number" v-model="xiongwei" :placeholder="$t('请输入胸围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="yaowei" :placeholder="$t('请输入腰围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="tunwei" :placeholder="$t('请输入臀围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="shangtunwei" :placeholder="$t('请输入上臂围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="datuiwei" :placeholder="$t('请输入大腿围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
								<view
									style="display: flex;flex-direction: row;background: #F7F7F7;margin-top: 20px; padding: 15px;border-radius: 10px;">
									<input type="number" v-model="xiaotuiwei" :placeholder="$t('请输入小腿围')"
										style="text-align: center;width: 80vw;" />
									<text>cm</text>
								</view>
							</view>
							<button @tap="popup_sd()"
								style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
						</view>
					</scroll-view>
				</view>
			</uni-popup>
		</view>
		<!-- 记体重popup -->
		<view>
			<uni-popup ref="tizhong_popup" :mask-click="false">
				<view
					style="border-radius: 20px;background:#fff; margin-top: 60px; padding-bottom: 10px;align-items: center;">
					<view style="display: flex; justify-content: space-between; padding: 15px;">
						<text @click="tz_closess()" style="font-size: 22px;">✖</text>
						<view style="display: flex; flex-direction: row; ">
							<view style="display: flex;justify-content: center;">
								<picker fields="day" mode="date" :value="birthday2" @change="bindDateChange2"
									:end='endtimesss'>
									<view style="display: flex;flex-direction: row;">
										<view style="font-size: 16px;color: black;">{{birthday2}}</view>
										<uni-icons type="bottom" size="18" style="margin-left: 5px;"></uni-icons>
									</view>
								</picker>
							</view>
						</view>
						<view style="color: #3298F7;"></view>
					</view>
					<view style="padding: 20px;width: 75vw;">
						<view
							style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="tizhong" :placeholder="$t('请输入体重')"
								style="text-align: center;width: 80vw;" />
							<text>kg</text>
						</view>
					</view>
					<button @tap="jitizhong_tc()"
						style="margin: 40px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
		<!-- 目标体重弹窗 -->
		<view>
			<uni-popup ref="mubiao_popup" :mask-click="false">
				<view style="border-radius: 20px;background:#fff; padding-bottom: 10px;align-items: center;">
					<view style="display: flex;justify-content: space-between; padding: 20px;">
						<text @click="mb_closess()" style="font-size: 22px;">✖</text>
					</view>
					<view style="padding: 20px;width: 75vw;">
						<view
							style="display: flex;flex-direction: row;background: #F7F7F7;padding: 15px;border-radius: 10px;">
							<input type="number" v-model="mubiao" :placeholder="$t('请输入目标体重')"
								style="text-align: center;width: 80vw;" />
							<text>kg</text>
						</view>
					</view>
					<button @tap="mubiao_weight()"
						style="margin: 20px 50px 20px 50px; border-radius: 30px;background: #3298F7;color: white;">{{$t('确认')}}</button>
				</view>
			</uni-popup>
		</view>
		<view>
			<yt-dateTimePicker ref="myPicker" @submit="handleSubmit" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('年'), $t('月'), $t('日'), $t('时'), $t('分'), $t('周')]" />
		</view>
		<view>
			<yt-dateTimePicker ref="myPicker1" @submit="handleSubmit1" :start-year="2000" :end-year="2099"
				:time-init="datass" :time-hide="[true, true, true, true, true, false]"
				:time-label="[$t('年'), $t('月'), $t('日'), $t('时'), $t('分'), $t('周')]" />
		</view>

		<view>
			<uni-popup ref="health_Explanationpopu" :mask-click="false">
				<view class="xueyastyle">
					<view style="font-size: 17px; font-weight: 600;display: flex;justify-content: center;">
						{{$t("综合健康指数说明")}}
					</view>
					<!-- 表格 -->
					<view class="table">
						<!-- 表头 -->
						<view class="tr head">
							<view class="th">{{$t("健康指数")}}</view>
							<view class="th">{{$t("它主要衡量什么")}}</view>
							<view class="th">{{$t("指数越大")}}</view>
						</view>

						<!-- 数据行 -->
						<view class="tr" v-for="(row, i) in healthlist" :key="i">
							<view class="td">{{ row.name }}</view>
							<view class="td">{{ row.desc }}</view>
							<view class="td">{{ row.mean }}</view>
						</view>
					</view>

					<button @tap="health_Explanationpopuclose()"
						style="width: 120px; height: 48px;  border-radius: 20px;background: #3298F7;color: white;margin-top: 20px">{{$t('知道了')}}</button>
				</view>
			</uni-popup>
		</view>


	</view>
</template>
<script setup>
	const Language = uni.getLocale();
	const systemInfo = uni.getSystemInfoSync();
	const windowHeight = systemInfo.windowHeight;
	import BasicDrag from '@/components/basic-drag/index.vue';
	import BluetoothManager from '../../api/BluetoothManager.js';
	import {
		clearDailyGoalData
	} from '../../api/unitls/dailyClear.js';
	import {
		isInChinaByIP,
		ISgetUserInfoUS,
		ISgetUserInfoChina,
	} from '../../api/isInChinaByIP.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		hexStringToBytes
	} from '../../api/unitls/bleUtils.js';
	import {
		receive5610SleepData
	} from '../../api/unitls/sleepParser.js';
	import WeightConverter from '../../api/unitls/weightConverter.js';
	import logManager from '../../api/unitls/logManager.js';
	import FloatButton from '../../components/float-button.vue';

	import AccDataParser from '../../api/unitls/accDataParser.js';
	import PPGParser from '../../api/unitls/PPGParser.js'
	import PpgDataService from "../../api/servicesppg/PpgDataService.js";
	import PpgWaveform from "../../../components/ACC_PPG/PpgWaveform.vue";
	// 导入天气所需要的函数
	import {
		getGlobalLocalWeather,
		searchCityWeather,
		getMinutelyRain,
		searchCity // 新增：导入城市搜索函数
	} from "../../api/unitls/qweather.js";
	import protocolHelper from '../../api/unitls/protocolHelper.js';
	import {
		WeatherForecastEncoder,
		WeatherForecastDecoder
	} from '../../api/unitls/weatherProtocol.js';
	import {
		HealthDataParser
	} from '../../api/unitls/HealthDataParser.js';
	const Healthparser = new HealthDataParser();
	// 获取本地时间
	const now = new Date();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');

	// 格式：mm/dd
	const yali_time = `${month}/${day}`; // 02/27 (洛杉矶) 或 02/28 (北京)

	// 本地日期时间 ISO 格式（但使用本地时间）
	const localISO =
		`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}.${String(now.getMilliseconds()).padStart(3,'0')}`;


	export default {
		components: {
			BasicDrag,
			FloatButton,
			PpgWaveform
		},
		computed: {
			...mapState(['info', 'getpendinglenth', 'acktypes', 'xueyehuilian', 'xueyjitypesd']),
			sleepTip() {
				// 1. 先拼出 key 后缀
				const idx = this.xueya; // 0-3
				const med = this.medication === true ? 1 : 2; // 1=用药 2=未用药
				const idsd = [1, 2, 3, 4, 5, 6, 7, 8][idx * 2 + (med - 1)]; // 0-7 → 1-8
				// 2. 返回固定顺序的 key 数组
				if (idsd === undefined) {
					return [
						'睡眠质量',
						`用药情况${med}`
					];
				} else {
					return [
						'睡眠质量',
						`用药情况${med}`,
						`健康建议${idsd}`, // 0-3 → 1-8
						`原因${idsd}`,
						`药物与睡眠解释${idsd}`,
						`生活方式建议${idsd}`
					];
				}
			}
		},
		data() {
			// 获取本地时间
			const now = new Date();
			const year = now.getFullYear();
			const month = (now.getMonth() + 1).toString().padStart(2, '0');
			const day = now.getDate().toString().padStart(2, '0');

			const boolhistoday = `${year}-${month}-${day}`; // 本地日期，不是 UTC



			// 格式：mm/dd
			const yali_time = `${month}/${day}`; // 02/27 (洛杉矶) 或 02/28 (北京)
			return {
				logs: [],
				scrollTop: 0,
				sleep_alertdisabled: false,
				sleep_alertid: 0,
				healthlist: [{
						name: this.$t("压力指数"),
						desc: this.$t("神经系统"),
						mean: this.$t("身体正处于更强烈的应激状态中")
					},
					{
						name: this.$t("疲劳指数"),
						desc: this.$t("身体和心理的消耗程度"),
						mean: this.$t("身体和精神的疲劳感更重")
					},
					{
						name: this.$t("恢复指数"),
						desc: this.$t("身体从应激和疲劳状态中恢复过来的能力和速度"),
						mean: this.$t("身体的恢复能力更强")
					}
				],

				Indicatorlist: [{
						zh: this.$t("心情状态"),
						val: '>=8',
						desc: this.$t("积极愉悦2"),
						red: false
					},
					{
						zh: '',
						val: '>=6',
						desc: this.$t("平静稳定2"),
						red: false
					},
					{
						zh: '',
						val: '>=4',
						desc: this.$t("轻微压力2"),
						red: false
					},
					{
						zh: '',
						val: '<4',
						desc: this.$t("明显压力2"),
						red: true
					},
					{
						zh: this.$t("心理健康"),
						val: '>=8',
						desc: this.$t("较高风险2"),
						red: true
					},
					{
						zh: '',
						val: '>=5',
						desc: this.$t("中等风险2"),
						red: false
					},
					{
						zh: '',
						val: '<5',
						desc: this.$t("较低风险2"),
						red: false
					},
					{
						zh: this.$t("压力指数"),
						val: '>=5',
						desc: this.$t("压力大2"),
						red: true
					},
					{
						zh: '',
						val: '<5',
						desc: this.$t("压力小2"),
						red: false
					},
					{
						zh: this.$t("疲劳指数"),
						val: '>=5',
						desc: this.$t("疲劳度高2"),
						red: true
					},
					{
						zh: '',
						val: '<5',
						desc: this.$t("疲劳度低2"),
						red: false
					},
					{
						zh: this.$t("恢复指数"),
						val: '>=5',
						desc: this.$t("恢复快2"),
						red: false
					},
					{
						zh: "",
						val: '<5',
						desc: this.$t("恢复慢2"),
						red: true
					}
				],

				types_index: uni.getStorageSync("types_index") || 0,
				types_array: [this.$t("心情指数"), this.$t("抑郁风险评分"), this.$t("压力指数"), this.$t("疲劳指数"), this.$t("恢复指数")],
				ppgnewpoint: "",
				mood_Description: '',
				signal_quality_score: '-', //信号质量评分(0-1)
				fenxi: '',
				signal_quality_level: '',
				mood_level: '',
				depression_risk_level: '',
				baoggaodisabled: true, //报告按钮
				finalResult: false, //最终同时满足两个条件
				finalResultids: false, //最终同时满足两个条件
				data_sufficiency: '',
				watchtimer: null,
				watchtimer2: null,
				watchtimer3: null,
				isExpanded2: false, // 控制是否展开
				Daily_Goal: '',
				today_Daily_Goal: uni.getStorageSync("today_Daily_Goal") || "0",
				medication: uni.getStorageSync("medication") || false,
				buttonVisible: true,
				buttonPattern: {
					theme: 'primary',
					icon: '/static/page_icon/aipbg.jpg',
					menuItems: [{
							icon: '/static/page_icon/aipbg.jpg',
							text: this.$t("报告"),
							handler: () => {
								console.log('AI按钮被点击')
								uni.navigateTo({
									url: "/pages/tabBar/tendency/supplement"
								})
							}
						},
						{
							icon: '/static/page_icon/jinggaotishijingbaoyujing.png',
							text: this.$t("警报"),
							handler: () => {
								console.log('警报按钮被点击')
								uni.navigateTo({
									url: "/pages/tabBar/my/Alarms"
								})
							}
						},
						{
							icon: '/static/page_icon/dingshiBP.png',
							text: this.$t("监测"),
							handler: () => {
								//定时血压测量
								uni.navigateTo({
									url: "/pages/tabBar/main/globalweather/bloodpressuretimer"
								})
							}
						},
					],
				},
				Blood: uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa",
				bluetoothManager: null,
				stepsData: {}, // 用于存储每天步数的对象
				timer: null, // 定时器变量
				timertwslist: null,
				screenHeight: windowHeight,
				tabs: [this.$t("心血管"), this.$t("情绪"), this.$t("体重"), this.$t("睡眠"), this.$t("运动")],
				// swiper索引
				currentIndex: 0,
				scrollLeft: 0,
				disabletouch: false,
				msg: true,
				connectedDevices: {}, // 存储已连接设备的信息
				deviceList: [], // 存储搜索到的设备列表
				endtimesss: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,
				list: [{
						bmi_show: false,
						image: "../../../static/icons/2.png",
						Step_number: "-",
						title: this.$t('身高'),
						type_LX: "cm",
						Step_count: "-"
					}, {
						BMI_TF: 0,
						BMI_ys: "-",
						bmi_show: true,
						image: "../../../static/page_icon/10.png",
						Step_number: "-",
						title: this.$t('血氧'),
						type_LX: "%",
						Step_count: "-",
						checkbox: false,
					}, {
						bmi_show: false,
						image: "../../../static/icons/5.png",
						Step_number: "-",
						title: this.$t('心率'),
						type_LX: "BMP",
						Step_count: "-"
					},
					// {
					// 	bmi_show: false,
					// 	image: "../../../static/page_icon/9.png",
					// 	Step_number: "-",
					// 	title: this.$t("压力"),
					// 	type_LX: "kPa",
					// 	Step_count: "-",
					// 	checkbox: false,
					// }, 
					// {
					// 	bmi_show: false,
					// 	image: "../../../static/page_icon/9.png",
					// 	Step_number: "-",
					// 	title: this.$t("体温"),
					// 	type_LX: "℃",
					// 	Step_count: "-",
					// 	checkbox: false,
					// }
				],
				list2: [{
					BMI_TF: 0,
					BMI_ys: "-",
					bmi_show: true,
					image: "../../../static/icons/4.png",
					Step_number: "-",
					title: 'BMI',
					type_LX: "kg/m²",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/3.png",
					Step_number: "-",
					title: this.$t("骨含量"),
					type_LX: "kg",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/7.png",
					Step_number: "-",
					title: this.$t("肌肉量"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/4.png",
					Step_number: "-",
					title: this.$t("蛋白率"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/5.jpg",
					Step_number: "-",
					title: this.$t("水分"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/8.png",
					Step_number: "-",
					title: this.$t("内脏脂肪指数"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/6.png",
					Step_number: "-",
					title: this.$t("脂肪率"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/1.png",
					Step_number: "-",
					title: this.$t("基础代谢率"),
					type_LX: "KCAL",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/2.png",
					Step_number: "-",
					title: this.$t("皮下脂肪率"),
					type_LX: "%",
					Step_count: "-",
					checkbox: false,
				}, {
					bmi_show: false,
					image: "../../../static/page_icon/9.png",
					Step_number: "-",
					title: this.$t("身体年龄"),
					type_LX: this.$t("岁"),
					Step_count: "-",
					checkbox: false,
				}],
				show: true,
				fillOut: false,
				Latest_weight: "-",
				newweightKG: "KG",
				Latest_date: "-",
				Initial_weight: "--",
				Target_weight: "-",
				chuhsikg: "kg",
				Step_number_1: "-",
				Step_count_1: "-",
				Chest_circumference: "-",
				waistline: "-",
				Hip_circumference: "-",
				Upper_Chest_circumference: "-",
				Thigh_circumference: "-",
				Calf_circumference: "-",
				xueya: 0,
				title_name: "-",
				lowPressure: "-",
				highPressure: "-",
				pulse: "-",
				pulsetime: '-/-',
				Step_number: "20000",
				Step_count: "06/23",
				bmi_show: true,
				BMI_ys: "-",
				BMI: "19.6",
				BMI_TF: 0,
				showTotal_date: `${month}/${day}`,
				yali_time: `${month}/${day}`, // "02/27"
				birthday: this.$t('今天'),
				birthday1: this.$t('今天'),
				birthday2: this.$t('今天'),
				datass: localISO,
				xw_value: "",
				yw_value: "",
				tw_value: "",
				stw_value: "",
				dtw_value: "",
				xtw_value: "",
				tizhong: "",
				mubiao: '',
				xiongwei: "",
				yaowei: "",
				tunwei: "",
				shangtunwei: "",
				datuiwei: "",
				xiaotuiwei: "",
				disabledsaaa: true,
				disabledsaaa2: true,
				binaji: true,
				binaji2: true,
				animation: '', // 动画样式
				animation2: '', // 动画样式
				button_show: false,
				button_show2: false,
				delate_icon: false,
				delate_icon2: false,
				shousuoya: "",
				shuzhangya: "",
				maibo: "",
				birthday1111: this.$t('今天'),
				localData: uni.getStorageSync("settept"),
				loact: '',
				yali: '0',

				bushu: '--/--',
				bushu_time: '--/--',
				sleep: '--/--',
				sleep_time: '--/--',
				totalLight: 'NA',
				totalDeep: 'NA',
				totalRem: 'NA',
				sleep_point: '--/--',
				chartDataPPG: {
					categories: [],
					series: [{
							legendShape: "none",
							name: "",
							data: []
						},
						{
							legendShape: "none",
							name: "",
							data: []
						}, {
							legendShape: "none",
							name: "",
							data: [],
						}, {
							legendShape: "none",
							name: "",
							data: [],
						}, {
							legendShape: "none",
							name: "",
							data: [],
						}
					]
				},
				optsPPG: {
					color: ["#3298F7", "#3298F7", "#3298F7", "#3298F7", "#3298F7"],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					xAxis: {
						disableGrid: true,
						gridType: "solid"
					},
					yAxis: {
						splitNumber: 10,
						data: [{
							min: 0,
							max: 10,
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						},
						markLine: {
							type: "dash",
							data: [{
									value: 8,
									lineColor: "#FF6B6B",
									showLabel: true,
									labelText: this.$t("积极愉悦2"),
									labelAlign: "left",
									labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 145,
									labelFontColor: "#D8D8D6",
									labelOffsetY: -15,
									labelBgOpacity: -0.8,
									borderWidth: 0,
									borderColor: "transparent",
									borderRadius: 4,
									padding: [4, 8, 4, 8]

								},
								{
									value: 6,
									lineColor: "#3298F7",
									showLabel: true,
									labelText: this.$t("平静稳定2"),
									labelAlign: "left",
									labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 115,
									labelFontColor: "#D8D8D6",
									labelOffsetY: -15,
									labelBgOpacity: -0.8,
								},
								{
									value: 4,
									lineColor: "#EE6666",
									showLabel: true,
									labelText: this.$t("轻微压力2"),
									labelAlign: "left",
									labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 83,
									labelFontColor: "#D8D8D6",
									labelOffsetY: -15,
									labelBgOpacity: -0.8,
								},
								{
									value: 0,
									lineColor: "#D8D8D6",
									showLabel: true,
									labelText: this.$t("明显压力2"),
									labelAlign: "left",
									labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 122,
									labelFontColor: "#D8D8D6",
									labelOffsetY: -15,
									labelBgOpacity: -0.8,
								}
							]
						}

					}
				},

				chartDataPPG2: {
					categories: [],
					series: [{
						legendShape: "none",
						name: "",
						data: []
					}, {
						legendShape: "none",
						name: "",
						data: []
					}, {
						legendShape: "none",
						name: "",
						data: [],
					}, {
						legendShape: "none",
						name: "",
						data: [],
					}, {
						legendShape: "none",
						name: "",
						data: [],
					}]
				},


				optsPPG2: {
					color: ["#3298F7", "#3298F7", "#3298F7", "#3298F7", "#3298F7"],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						splitNumber: 10,
						data: [{
							min: 0,
							max: 10,
						}]
					},

					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						},
						markLine: {
							type: "dash",
							data: [{
									value: 8,
									lineColor: "#FF6B6B",
									showLabel: true,
									labelText: this.$t("积极愉悦2"),
									labelAlign: "left",
									labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 145,
									labelFontColor: "#D8D8D6",
									labelOffsetY: -15,
									labelBgOpacity: -0.8,
									borderWidth: 0,
									borderColor: "transparent",
									borderRadius: 4,
									padding: [4, 8, 4, 8]

								},
								{
									value: 6,
									lineColor: "#3298F7",
									showLabel: true,
									labelText: this.$t("平静稳定2"),
									labelAlign: "left",
									labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 115,
									labelFontColor: "#D8D8D6",
									labelOffsetY: -15,
									labelBgOpacity: -0.8,
								},
								{
									value: 4,
									lineColor: "#EE6666",
									showLabel: true,
									labelText: this.$t("轻微压力2"),
									labelAlign: "left",
									labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 83,
									labelFontColor: "#D8D8D6",
									labelOffsetY: -15,
									labelBgOpacity: -0.8,
								},
								{
									value: 0,
									lineColor: "#D8D8D6",
									showLabel: true,
									labelText: this.$t("明显压力2"),
									labelAlign: "left",
									labelOffsetX: Language == 'zh-Hans' || Language == 'zh-Hant' ? 60 : 122,
									labelFontColor: "#D8D8D6",
									labelOffsetY: -15,
									labelBgOpacity: -0.8,
								}
							]
						}
					}
				},


				chartData: {
					categories: [0],
					series: [{
						name: this.$t("步数"),
						data: [0]
					}, ]
				},
				opts: {
					color: ["#EE6666"],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						splitNumber: 5,
						data: [{
							min: 0,
							max: 10000,
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					}
				},

				tempBuffer: 0,
				xeuyapack: 0,
				xinlvpack: 0,
				xueyangpack: 0,
				quotient2: 0,
				sleeppack: 0,
				quotientACC: 0,
				quotientPPG: 0,
				dataBuffer: [],
				Protocolsubcommand: '',
				writeuuid: '',
				deviceIdwatch: '',
				serviceIdwatch: '',
				xeuyejisn: '0',
				xeuyejimac: '0',
				shoubiaosn: '0',
				shoubiaomac: '0',
				timsdpad: null,
				characteristicsCache: new Set(), // 用于记录已获取特征值的设备ID
				connectedDevices: {}, // 用于记录已连接的设备
				devicdsdmac: [],
				devicdsdmac1: [],
				sleeepalldata: "",
				lastWeight: '',
				lastcreateTime: '',
				lastWeightbishi: "",
				xeuyabiaoshi: "",
				lixianlist: [],
				PPGdataarray: 0x05,
				bufferPPG: [],


				depression_risk_level: "", //心理健康评估抑郁风险评分
				depression_risk_score: '', //心理健康评估抑郁风险等级
				depression_recommendation: '', //心理健康评估专业建议
				stress_Index: '',
				fatigue_index: '',
				recovery_index: '',
				hasSynced: true,
				MoodDays: "",
				StressFatigueDays: "",
				blewatch_id: "1",
				blewatch_id2: "1",
				// 当天天气
				weatherData: null,
				weatherDataID: "",
				weatherDataID7: "",
				// 三天内白天均值
				junzhi_SZY_b: 'NA',
				junzhi_SSY_b: 'NA',
				junzhi_pulse_b: 'NA',
				finlretVarList1: 'BPvSBPvCNTv3DvCNTv0002,BPvSBPvCNTv3DvCNTv0003,BPvSBPvCNTv3DvCNTv0004,BPvSBPvCNTv3DvCNTv0001,JLvRULEv3DvDATACHECKv0001,JLvRULEv3DvDATACHECKv0002,JLvRULEv3DvDATACHECKv0003,BPvSBPvAVGv3DvAVGv0002,BPvDBPvAVGv3DvAVGv0002,BPvHRvAVGv3DvAVGv0002,BPvSBPvAVGv3DvAVGv0003,BPvDBPvAVGv3DvAVGv0003,BPvHRvAVGv3DvAVGv0003,BPvSBPvAVGv3DvAVGv0004,BPvDBPvAVGv3DvAVGv0004,BPvHRvAVGv3DvAVGv0004,BPvSBPvAVGv3DvAVGv0001,BPvDBPvAVGv3DvAVGv0001,BPvHRvAVGv3DvAVGv0001,JLvRULEv3DvBPCHECKv0004,JLvRULEv3DvBPCHECKv0005,JLvRULEv3DvBPCHECKv0007,JLvRULEv3DvBPCHECKv0008,JLvRULEv3DvBPCHECKv0010,JLvRULEv3DvBPCHECKv0011,JLvRULEv3DvBPCHECKv0001,JLvRULEv3DvBPCHECKv0002,BPvSBPvSTDv3DvSTDv0002,BPvDBPvSTDv3DvSTDv0002,BPvHRvSTDv3DvSTDv0002,BPvSBPvSTDv3DvSTDv0003,BPvDBPvSTDv3DvSTDv0003,BPvHRvSTDv3DvSTDv0003,BPvSBPvSTDv3DvSTDv0004,BPvDBPvSTDv3DvSTDv0004,BPvHRvSTDv3DvSTDv0004,BPvSBPvSTDv3DvSTDv0001,BPvDBPvSTDv3DvSTDv0001,BPvHRvSTDv3DvSTDv0001,BPvSBPvMAXv3DvMAXv0002,BPvDBPvMAXv3DvMAXv0002,BPvHRvMAXv3DvMAXv0002,BPvSBPvMAXv3DvMAXv0003,BPvDBPvMAXv3DvMAXv0003,BPvHRvMAXv3DvMAXv0003,BPvSBPvMAXv3DvMAXv0004,BPvDBPvMAXv3DvMAXv0004,BPvHRvMAXv3DvMAXv0004,BPvSBPvMAXv3DvMAXv0001,BPvDBPvMAXv3DvMAXv0001,BPvHRvMAXv3DvMAXv0001,BPvSBPvMEDv3DvMEDv0002,BPvDBPvMEDv3DvMEDv0002,BPvHRvMEDv3DvMEDv0002,BPvSBPvMEDv3DvMEDv0003,BPvDBPvMEDv3DvMEDv0003,BPvHRvMEDv3DvMEDv0003,BPvSBPvMEDv3DvMEDv0004,BPvDBPvMEDv3DvMEDv0004,BPvHRvMEDv3DvMEDv0004,BPvSBPvMEDv3DvMEDv0001,BPvDBPvMEDv3DvMEDv0001,BPvHRvMEDv3DvMEDv0001,BPvSBPvMINv3DvMINv0002,BPvDBPvMINv3DvMINv0002,BPvHRvMINv3DvMINv0002,BPvSBPvMINv3DvMINv0003,BPvDBPvMINv3DvMINv0003,BPvHRvMINv3DvMINv0003,BPvSBPvMINv3DvMINv0004,BPvDBPvMINv3DvMINv0004,BPvHRvMINv3DvMINv0004,BPvSBPvMINv3DvMINv0001,BPvDBPvMINv3DvMINv0001,BPvHRvMINv3DvMINv0001,BPvSBPvLOADv3DvRATIOv0002,BPvDBPvLOADv3DvRATIOv0002,BPvSBPvLOADv3DvRATIOv0003,BPvDBPvLOADv3DvRATIOv0003,BPvSBPvLOADv3DvRATIOv0004,BPvDBPvLOADv3DvRATIOv0004,BPvSBPvLOADv3DvRATIOv0001,BPvDBPvLOADv3DvRATIOv0001,JLvRULEv3DvBPCHECKv0022,JLvRULEv3DvBPCHECKv0027,JLvRULEv3DvBPCHECKv0023,JLvRULEv3DvBPCHECKv0028,JLvRULEv3DvBPCHECKv0024,JLvRULEv3DvBPCHECKv0029,JLvRULEv3DvBPCHECKv0021,JLvRULEv3DvBPCHECKv0026,BPvSBPvNBRv3DvRATIOv0001,BPvDBPvNBRv3DvRATIOv0001,JLvRULEv3DvBPCHECKv0013,JLvRULEv3DvBPCHECKv0014,JLvRULEv3DvBPCHECKv0015,JLvRULEv3DvBPCHECKv0016,JLvRULEv3DvBPCHECKv0017,JLvRULEv3DvBPCHECKv0018, JLvRULEv3DvBPCHECKv0019, JLvRULEv3DvBPCHECKv0020,BPvSBPvMBSv3DvMINUSv0001,BPvDBPvMBSv3DvMINUSv0001,JLvRULEv3DvBPCHECKv0031,BPvSBPvCVv3DvRATIO2v0002,BPvDBPvCVv3DvRATIO2v0002,BPvHRvCVv3DvRATIO2v0002,BPvSBPvCVv3DvRATIO2v0003,BPvDBPvCVv3DvRATIO2v0003,BPvHRvCVv3DvRATIO2v0003,BPvSBPvCVv3DvRATIO2v0004,BPvDBPvCVv3DvRATIO2v0004,BPvHRvCVv3DvRATIO2v0004,BPvSBPvCVv3DvRATIO2v0001,BPvDBPvCVv3DvRATIO2v0001,BPvHRvCVv3DvRATIO2v0001,BPvAASIv3D,JLvRULEv3DvBPCHECKv0032',
				yalixueyatype: false,
				hrResult: [],
				bpResult: [],
				deviceSnuserID: [],
				currentDatehis: boolhistoday,
				boolserverData: null,
				BPW1deviceId: "",
				isProcessed: uni.getStorageSync("isProcessed") || false, // 标志位
			}
		},


		mounted() {
			// 初始化时加载本地存储的数据
			this.loadStepsFromStorage();
			// 每天检查并保存步数数据
			this.timer = setInterval(this.saveDailySteps, 24 * 60 * 60 * 1000); // 每24小时触发一次
		},

		beforeDestroy() {
			// 清除定时器，避免内存泄漏
			clearInterval(this.timer);
		},

		onHide() {
			this.sethuilian(false);
			if (this.timsdpad) {
				clearInterval(this.timsdpad);
				this.timsdpad = null;
			}
		},


		onShow: async function() { // ✅ 添加 async
			let that = this
			that.sethuilian(true)
			uni.removeStorageSync("jiance")
			uni.setStorageSync("last_app_version", systemInfo.appVersion)
			console.log('last_app_version', uni.getStorageSync("last_app_version"));
			// const ISUserInfoChina = await ISgetUserInfoChina(that.$APP_IP1);
			// const isUserInfoUS = await ISgetUserInfoUS(that.$APP_IP2);
			// console.log('ISUserInfoChina', ISUserInfoChina);
			// console.log('isUserInfoUS', isUserInfoUS);
			// if (!isUserInfoUS && !ISUserInfoChina) {
			// 	Vue.prototype.$url_APP_IP = that.$APP_IP1;
			// } else if (isUserInfoUS && !ISUserInfoChina) {
			// 	Vue.prototype.$url_APP_IP = that.$APP_IP2;
			// } else if (!isUserInfoUS && ISUserInfoChina) {
			// 	Vue.prototype.$url_APP_IP = that.$APP_IP1;
			// } else if (isUserInfoUS && ISUserInfoChina) {
			// 	Vue.prototype.$url_APP_IP = that.$APP_IP2;
			// }
			console.log("首页：", that.$url_APP_IP)
			that.initPage();
			// 在数据操作前检查清除
			clearDailyGoalData();
			that.today_Daily_Goal = uni.getStorageSync("today_Daily_Goal") || "0"
			if (that.acktypes === "0") {
				that.hasSynced = true;
			} else {
				that.hasSynced = false;
			}
			uni.getNetworkType({
				success: function(res) {
					if (res.networkType === 'none') {
						that.Latest_weight = that.newweightKG === "KG" ? uni.getStorageSync(
								"weightkg") : uni
							.getStorageSync("weightlb")
						that.lowPressure = that.Blood === "mmHg" ? uni.getStorageSync("lowPressure") :
							(Number(
								uni.getStorageSync("lowPressure")) * 0.133).toFixed(1);
						that.highPressure = that.Blood === "mmHg" ? uni.getStorageSync(
							"highPressure") : (
							Number(uni.getStorageSync("lowPressure")) * 0.133).toFixed(1);
						that.pulse = uni.getStorageSync("pulse")
						that.updateBloodPressureStatus(uni.getStorageSync("lowPressure"), uni
							.getStorageSync(
								"highPressure"));
						that.sethuilian(true)
						that.aaaa(uni.getStorageSync("lixianlist").rows)
					} else {
						if (uni.getStorageSync("xueyadatatype") && uni.getStorageSync("xueyadata")) {
							if (uni.getStorageSync("xueyadatatype") === "1") {
								that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, uni
									.getStorageSync(
										"xueyadata"), {
										'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
									}).then(res => {
									console.log("上报数据手表成功", res)
									if (res.code === 200) {
										that.setbanhua(1)
										let deviceSnlixin = uni.getStorageSync("xueyadata")
											.deviceSn
										let slaveDatalixian = uni.getStorageSync("xueyadata")
											.slaveData
										uni.removeStorageSync("xueyadatatype")
										uni.removeStorageSync("xueyadata")
										setTimeout(() => {
											that.get_device_info(deviceSnlixin)
											that.StorageInfo(slaveDatalixian)
										}, 1000)
									}
								}).catch(errro => {
									console.log("errro", errro)
								})
							} else if (uni.getStorageSync("xueyadatatype") === "0") {
								that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, uni
									.getStorageSync(
										"xueyadata"), {
										'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
									}).then(resaa => {
									console.log("血压计", resaa)
									if (resaa.code === 200) {
										that.setbanhua(1)
										let deviceSnlixin = uni.getStorageSync("xueyadata")
											.deviceSn
										let slaveDatalixian = uni.getStorageSync("xueyadata")
											.slaveData
										uni.removeStorageSync("xueyadatatype")
										uni.removeStorageSync("xueyadata")
										setTimeout(() => {
											that.get_device_info(deviceSnlixin)
											that.StorageInfo(slaveDatalixian)
										}, 1000)
									}
								})
							}
						}
						if (uni.getStorageSync("tizhidata")) {
							that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, uni
								.getStorageSync(
									"tizhidata"), {
									'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
								}).then(res => {
								if (res.code === 500) {
									uni.showToast({
										title: that.$t("失败"),
										icon: 'none'
									})
									return
								} else if (res.code === 200) {
									that.setbanhua(1)
									let deviceSntzlx = uni.getStorageSync("tizhidata").deviceSn
									uni.removeStorageSync("tizhidata")
									setTimeout(() => {
										that.get_device_info(deviceSntzlx)
										that.get_device_data(deviceSntzlx)
									}, 1000)
								}
							})
						}
					}
				},
				fail: function(err) {
					console.error('获取网络类型失败：', err);
				}
			});
		},


		methods: {
			...mapMutations(['getInfo', 'setacktypes', 'setbanhua', 'sethuilian', 'setxueyjitypesd']),
			//日志
			log(...a) {
				this.logs.unshift(
					`[${new Date().toLocaleTimeString()}] ${a.map(v => JSON.stringify(v)).join(' ')}`);
			},

			initPage() {
				let that = this
				that.Unitlist()
				that.chuhsikg = uni.getStorageSync("danwei2") === 1 ? "lb" : "kg";
				that.newweightKG = uni.getStorageSync("danwei2") === 1 ? "lb" : "KG";
				that.Blood = uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa"
				isInChinaByIP().then(isInChina => {
					that.loact = isInChina ? "境内" : "境外";
					const token = uni.getStorageSync("token");
					if (!token) {
						uni.redirectTo({
							url: "/pages/login/login_land"
						});
						return;
					}
					that.lastWeightbishi = ""
					that.xeuyabiaoshi = ""
					that.deviceList = undefined;
					that.deviceLists = []
					that.getUserInfo();
				});
			},

			//获取蓝牙广播解析mac
			Adverti(advertisData) {
				if (advertisData === "" || advertisData === undefined) {
					return '无数据'
				} else {
					const str = this.ab2hex(advertisData).slice(4, this.ab2hex(advertisData).length - 4)
					const formattedStr = str.replace(/(.{2})(?=.)/g, '$1:').toUpperCase().slice(0, 20)
					return formattedStr;
				}
			},

			//调用js初始化蓝牙
			async initBluetooth() {
				this.bluetoothManager = new BluetoothManager();
				this.openBluetoothAdapter()
			},


			// createBLEConnectionall(deviceId) {
			// 	let that = this
			// 	that.log("2直接拿保存的uuid连接开始调用官方连接低功耗api", deviceId)
			// 	console.log("2直接拿保存的uuid连接开始调用官方连接低功耗api", deviceId)
			// 	uni.createBLEConnection({
			// 		deviceId: deviceId,
			// 		timeout: 8000,
			// 		success(res) {
			// 			that.log("直接拿保存的uuid连接开始调用官方连接低功耗api——success：" + deviceId, res)
			// 			console.log("直接拿保存的uuid连接开始调用官方连接低功耗api——success：" + deviceId, res)
			// 		},
			// 		fail(err) {
			// 			if (err.errCode === 10012) {
			// 				uni.showToast({
			// 					title: that.$t("回连超时"),
			// 					icon: "none",
			// 					duration: 5000
			// 				})
			// 				that.log("10012直接拿保存的uuid连接开始调用官方连接低功耗api——fail：" + deviceId, err)
			// 				console.log("10012直接拿保存的uuid连接开始调用官方连接低功耗api——fail：" + deviceId, err)
			// 			} else {
			// 				that.log("直接拿保存的uuid连接开始调用官方连接低功耗api——fail：" + deviceId, err)
			// 				console.log("直接拿保存的uuid连接开始调用官方连接低功耗api——fail：" + deviceId, err)
			// 			}
			// 		}
			// 	})
			// },


			// onBluetoothDeviceFoundlist() {
			// 	let that = this
			// 	uni.onBluetoothDeviceFound((res) => {
			// 		that.log("搜索到的附近的蓝牙设备信息：", res)
			// 		that.log("第一次绑定保存的UUID：", that.BPW1deviceId)
			// 		console.log("搜索到的附近的蓝牙设备信息：", res)
			// 		console.log("第一次绑定保存的UUID：", that.BPW1deviceId)
			// 		const deviceArray = res.devices;
			// 		for (const item of deviceArray) {
			// 			if (item.name === "BPW1") {
			// 				that.log("搜索到的BPW1设备：", item.deviceId + "｜" + that.Adverti(item.advertisData))
			// 				console.log("搜索到的BPW1设备：", item.deviceId + "｜" + that.Adverti(item.advertisData))
			// 				if (that.Adverti(item.advertisData) === "41:42:71:F1:D0:46") {
			// 					console.log("搜索到的BPW1设备UUID和第一次绑定保存的UUID一样：", that.Adverti(item.advertisData))
			// 					uni.stopBluetoothDevicesDiscovery({
			// 						complete(stopBluetoothDevicesDiscovery) {
			// 							console.log("停止蓝牙搜索" + that.Adverti(item.advertisData) + "|" +
			// 								item.deviceId, stopBluetoothDevicesDiscovery)
			// 							that.log("停止蓝牙搜索" + that.Adverti(item.advertisData) + "|" +
			// 								item.deviceId, stopBluetoothDevicesDiscovery)
			// 							clearInterval(that.aatimer)
			// 							that.aatimer = null
			// 							if (Vue.prototype.$globalTimers.heartbeatInterval) {
			// 								clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
			// 								Vue.prototype.$globalTimers.heartbeatInterval = null;
			// 							}
			// 							Vue.prototype.$globalTimers.heartbeatInterval = setInterval(() => {
			// 								that.onBluetoothDeviceFound()
			// 							}, 500);
			// 						}
			// 					})

			// 				} else if (that.Adverti(item.advertisData) === "41:42:C8:77:08:9F") {
			// 					uni.stopBluetoothDevicesDiscovery({
			// 						complete(stopBluetoothDevicesDiscovery) {
			// 							console.log("停止搜索" + that.Adverti(item.advertisData) + "|" +
			// 								item
			// 								.deviceId, stopBluetoothDevicesDiscovery)
			// 							that.log("停止搜索" + that.Adverti(item.advertisData) + "|" + item
			// 								.deviceId, stopBluetoothDevicesDiscovery)
			// 							clearInterval(that.aatimer)
			// 							that.aatimer = null
			// 							if (Vue.prototype.$globalTimers.heartbeatInterval) {
			// 								clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
			// 								Vue.prototype.$globalTimers.heartbeatInterval = null;
			// 							}
			// 							Vue.prototype.$globalTimers.heartbeatInterval = setInterval(() => {
			// 								that.onBluetoothDeviceFound()
			// 							}, 500);
			// 						}
			// 					})
			// 				}
			// 			}
			// 		}
			// 	});
			// },



			// startBluetoothDevicesDiscoveryall() {
			// 	let that = this
			// 	uni.startBluetoothDevicesDiscovery({
			// 		allowDuplicatesKey: true,
			// 		success: (startres) => {
			// 			console.log("开始搜索附近蓝牙设备，触发搜索之后30秒自动停止搜索", startres)
			// 			that.log("开始搜索附近蓝牙设备，触发搜索之后30秒自动停止搜索", startres)
			// 			that.onBluetoothDeviceFoundlist();
			// 			let aaa = 0
			// 			clearInterval(that.aatimer)
			// 			that.aatimer = null
			// 			that.aatimer = setInterval(() => {
			// 				aaa++;
			// 				console.log("30秒自动停止搜索", aaa)
			// 				if (aaa >= 15) {
			// 					clearInterval(that.aatimer)
			// 					that.aatimer = null
			// 					uni.stopBluetoothDevicesDiscovery({
			// 						complete(stopres) {
			// 							console.log("30秒自动停止搜索", stopres)
			// 							that.log("30秒自动停止搜索", stopres)
			// 							that.createBLEConnectionall(that.BPW1deviceId)
			// 						}
			// 					})
			// 				}
			// 			}, 1000)
			// 		},
			// 		fail: (err) => {
			// 			console.error('搜索附近蓝牙设备失败：', err);
			// 			that.log('搜索附近蓝牙设备失败：', err)
			// 		}
			// 	});
			// },

			//初始化并搜索蓝牙
			openBluetoothAdapter() {
				let that = this
				uni.openBluetoothAdapter({
					success(openBluetoothAdapter) {
						// that.startBluetoothDevicesDiscoveryall()
						// 修改后的定时器代码
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						Vue.prototype.$globalTimers.heartbeatInterval = setInterval(() => {
							that.onBluetoothDeviceFound()
						}, 500);
					},
					fail: function(err) {
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						Vue.prototype.$globalTimers.heartbeatInterval = setInterval(() => {
							that.onBluetoothDeviceFound()
						}, 500);
					}
				})
			},


			onBluetoothDeviceFound() {
				let that = this
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							// 检查 deviceList 是否为数组
							const deviceList = uni.getStorageSync("deviceList");
							let uniqueArr = Array.isArray(deviceList) ?
								deviceList.filter((item, index) => deviceList.indexOf(item) === index) : [];
							// 检查 devicdsdmac 是否为数组
							const devicdsdmac = uni.getStorageSync("devicdsdmac");
							let uniqueArr1 = Array.isArray(devicdsdmac) ?
								devicdsdmac.filter((item, index) => devicdsdmac.indexOf(item) === index) : [];
							// 检查 devicdsdmac1 是否为数组
							const devicdsdmac1 = uni.getStorageSync("devicdsdmac1");
							let uniqueArr2 = Array.isArray(devicdsdmac1) ?
								devicdsdmac1.filter((item, index) => devicdsdmac1.indexOf(item) ===
									index) : [];
							if (uniqueArr1) {
								that.connectMultipleDevices(uniqueArr1)
							}
							setTimeout(() => {
								if (uniqueArr2) {
									that.connectMultipleDevices(uniqueArr2)
								}
							}, 2000)
						} else {
							let uniqueArr
							let uniqueArr1
							let uniqueArr2
							if (that.deviceList === undefined) {
								uniqueArr = uni.getStorageSync("deviceList").filter((item, index) => uni
									.getStorageSync("deviceList").indexOf(item) === index);
							} else {
								uniqueArr = that.deviceList.filter((item, index) => that.deviceList
									.indexOf(item) === index);
							}
							if (that.devicdsdmac === undefined) {
								uniqueArr1 = uni.getStorageSync("devicdsdmac").filter((item, index) => uni
									.getStorageSync("devicdsdmac").indexOf(item) === index);
							} else {
								uniqueArr1 = that.devicdsdmac.filter((item, index) => that.devicdsdmac
									.indexOf(item) === index);
							}
							if (that.devicdsdmac1 === undefined) {
								uniqueArr2 = uni.getStorageSync("devicdsdmac1").filter((item, index) => uni
									.getStorageSync("devicdsdmac1").indexOf(item) === index);
							} else {
								uniqueArr2 = that.devicdsdmac1.filter((item, index) => that.devicdsdmac1
									.indexOf(item) === index);
							}
							if (uniqueArr1) {
								that.connectMultipleDevices(uniqueArr1)
							}
							setTimeout(() => {
								if (uniqueArr2) {
									that.connectMultipleDevices(uniqueArr2)
								}
							}, 2000)
						}
					},
					fail: function(err) {
						console.error('获取网络类型失败：', err);
					}
				});
			},
			async connectMultipleDevices(uniqueArr) {
				let that = this
				for (const deviceId of uniqueArr) {
					try {
						that.bluetoothManager.connectDevice(deviceId);
					} catch (error) {
						continue
					}
				}
				that.connectedDevices = that.bluetoothManager.connectedDevices;
				// 解析 JSON 数据为数组
				const devicesArray = Object.values(that.connectedDevices);
				that.geturl_queryDevices(devicesArray)
			},

			geturl_queryDevices(devicesArray) {
				this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						for (let rowIndex = 0; rowIndex < res.rows.length; rowIndex++) {
							const row = res.rows[rowIndex];
							for (let deviceIndex = 0; deviceIndex < devicesArray
								.length; deviceIndex++) {
								const device = devicesArray[deviceIndex];
								// 只有当设备ID匹配时才继续处理
								if (device.deviceId !== row.mac) continue;
								// 设置MTU的条件可以合并
								if (device.services.length === 1) {
									uni.setBLEMTU({
										deviceId: device.deviceId,
										mtu: 512,
									});
								}
								if (row.deviceModelId === "10005") {
									this.xeuyejisn = row.deviceSn
									this.xeuyejimac = device.deviceId
								}
								if (row.deviceModelId === "30000") {
									this.shoubiaosn = row.deviceSn
									this.shoubiaomac = device.deviceId
								}
								// 根据服务数量选择不同的处理方式
								switch (device.services.length) {
									case 1:
										if (this.xueyehuilian == true) {
											uni.setBLEMTU({
												deviceId: device.deviceId,
												mtu: 512,
											});
											this.getBLEDeviceCharacteristics1(device.deviceId,
												device
												.services[0].uuid, row.deviceSn);
											this.xeuyejisn = row.deviceSn
											this.xeuyejimac = device.deviceId
										}
										break;
									case 2:
										this.getBLEDeviceCharacteristics2(device.deviceId, device
											.services[
												1].uuid, row.deviceSn);
										break;
									case 3:
										this.getBLEDeviceCharacteristics3(device.deviceId, device
											.services[1].uuid, row.deviceSn);
										break;
									case 4:
										this.getBLEDeviceCharacteristics2(device.deviceId, device
											.services[
												3].uuid, row.deviceSn);
										break;
								}
								break;
							}
						}
					}
				}).catch(err => {
					const res = uni.getStorageSync("lixianlist");
					for (let rowIndex = 0; rowIndex < res.rows.length; rowIndex++) {
						const row = res.rows[rowIndex];
						for (let deviceIndex = 0; deviceIndex < devicesArray
							.length; deviceIndex++) {
							const device = devicesArray[deviceIndex];
							// 只有当设备ID匹配时才继续处理
							if (device.deviceId !== row.mac) continue;
							// 设置MTU的条件可以合并
							if (device.services.length === 1) {
								uni.setBLEMTU({
									deviceId: device.deviceId,
									mtu: 512,
								});
							}
							if (row.deviceModelId === "10005") {
								this.xeuyejisn = row.deviceSn
								this.xeuyejimac = device.deviceId
							}
							if (row.deviceModelId === "30000") {
								this.shoubiaosn = row.deviceSn
								this.shoubiaomac = device.deviceId
							}
							// 根据服务数量选择不同的处理方式
							switch (device.services.length) {
								case 1:
									if (this.xueyehuilian == true) {
										uni.setBLEMTU({
											deviceId: device.deviceId,
											mtu: 512,
										});
										this.getBLEDeviceCharacteristics1(device.deviceId,
											device
											.services[0].uuid, row.deviceSn);
										this.xeuyejisn = row.deviceSn
										this.xeuyejimac = device.deviceId
									}
									break;
								case 2:
									this.getBLEDeviceCharacteristics2(device.deviceId, device
										.services[
											1].uuid, row.deviceSn);
									break;
								case 3:
									this.getBLEDeviceCharacteristics3(device.deviceId, device
										.services[1].uuid, row.deviceSn);
									break;
								case 4:
									this.getBLEDeviceCharacteristics2(device.deviceId, device
										.services[
											3].uuid, row.deviceSn);
									break;
							}
							break;
						}
					}
					let that = this
					uni.getNetworkType({
						success: function(res) {
							if (res.networkType === 'none') {
								that.sethuilian(true)
							} else {
								that.sethuilian(true)
								that.Blood = uni.getStorageSync("Blood") === 0 || uni
									.getStorageSync(
										"Blood") === "" ? "mmHg" : "kPa"
								isInChinaByIP().then(isInChina => {
									that.loact = isInChina ? "境内" : "境外";
									const token = uni.getStorageSync("token");
									if (!token) {
										uni.redirectTo({
											url: "/pages/login/login_land"
										});
										return;
									}
									that.lastWeightbishi = ""
									that.xeuyabiaoshi = ""
									that.deviceList = undefined;
									that.deviceLists = []
									that.getUserInfo();
								});
								// 在数据操作前检查清除
								clearDailyGoalData();
								that.today_Daily_Goal = uni.getStorageSync(
									"today_Daily_Goal") || "0"
							}
						},
						fail: function(err) {
							console.error('获取网络类型失败：', err);
						}
					});

				})
			},



			//调用js断开蓝牙
			async disconnectAll(mac) {
				this.bluetoothManager = new BluetoothManager();
				this.bluetoothManager.disconnectDevice(mac)
			},
			// 加载本地存储的步数数据
			loadStepsFromStorage() {
				try {
					const storedData = uni.getStorageSync("weeklySteps");
					if (storedData) {
						this.stepsData = JSON.parse(storedData);
					}
				} catch (e) {}
			},
			// 保存当天的步数数据到本地存储
			saveDailySteps(bushu, bushu_time) {
				const currentDate = bushu_time; // 当前日期，格式为 YYYY-MM-DD
				const steps = bushu; // 获取当天步数
				// 更新步数数据
				this.stepsData[currentDate] = steps;
				// 如果超过一周的数据，删除最早的一天数据
				const dates = Object.keys(this.stepsData);
				if (dates.length > 7) {
					const earliestDate = dates.sort()[0];
					delete this.stepsData[earliestDate];
				}
				// 保存到本地存储
				try {
					uni.setStorageSync("weeklySteps", JSON.stringify(this.stepsData));
					// 按日期排序
					const sortedDates = Object.keys(this.stepsData).sort();
					const categories = sortedDates; // 日期数组
					const seriesData = sortedDates.map(date => this.stepsData[date]); // 步数数组
					this.chartData = {
						categories: categories,
						series: [{
							name: this.$t("步数"),
							data: seriesData
						}]
					};
				} catch (e) {}
			},

			toggleExpand2() {
				this.isExpanded2 = !this.isExpanded2;
			},
			// 定时测量
			setting() {
				uni.navigateTo({
					url: "/pages/tabBar/main/sleep_report/Reports_Alerts"
				})
			},
			//详细报告
			xiangxibaogo() {
				if (!this.finalResult && this.baoggaodisabled) {
					uni.showModal({
						content: this.$t("需要两周以上测试数据进行评估"),
						confirmText: this.$t('确定'),
						showCancel: false,
						success(modal) {
							if (modal.confirm) {}
						}
					})
				} else {
					uni.navigateTo({
						url: "/pages/tabBar/main/score/qingxubaogao?MoodDays=" + this.MoodDays +
							"&StressFatigueDays=" + this.StressFatigueDays
					})
				}
			},
			pingfentiaozhuan() {
				uni.showModal({
					content: this.$t("为了更准确地了解您的情绪状态"),
					confirmText: this.$t('确定'),
					cancelText: this.$t('取消'),
					success(modal) {
						if (modal.confirm) {
							uni.navigateTo({
								url: '/pages/tabBar/main/score/score'
							})
						}
					}
				})
			},
			//立即测量
			sleep_alert() {
				let that = this
				// uni.showModal({
				// 	content: that.$t("测量情绪前"),
				// 	confirmText: that.$t('确定'),
				// 	cancelText: that.$t('取消'),
				// 	success(modal) {
				// 		if (modal.confirm) {
				that.qingxucel()
				// 		}
				// 	}
				// })
			},
			qingxucel() {
				let that = this
				that.yalixueyatype = false
				if (that.blewatch_id === "1" || that.acktypes === "0") {
					uni.showLoading({
						title: that.$t("数据同步中请稍后"),
						mask: true,
					})
					if (that.watchtimer3) {
						clearInterval(that.watchtimer3);
						that.watchtimer3 = null;
					}
					setTimeout(() => {
						let aaawatchetime = 0
						that.watchtimer3 = setInterval(() => {
							aaawatchetime++
							if (that.blewatch_id === "0") {
								uni.hideLoading()
								clearInterval(that.watchtimer3)
								that.watchtimer3 = null
								setTimeout(() => {
									uni.showLoading({
										title: that.$t("请稍后"),
										mask: true,
									})
									that.sendstartheartwatch(that.writeuuid, 1)
									that.sleep_alertid = 1
								}, 1000)
							} else {
								if (aaawatchetime === 25) {
									uni.hideLoading()
									clearInterval(that.watchtimer3)
									that.watchtimer3 = null
									that.blewatch_id = "0"
									uni.showToast({
										title: that.$t("请检查设备连接"),
										icon: 'none',
										duration: 2000
									})
								}
							}
						}, 1000)
					}, 2000)
				} else {
					that.sendstartheartwatch(that.writeuuid, 1)
					uni.showLoading({
						title: that.$t("请稍后"),
						mask: true,
					})
					that.sleep_alertid = 1
				}
			},



			// 情绪立即测量命令
			sendstartheartwatch(writeuuid, type) {
				let that = this
				that.OTAdata(that.deviceIdwatch ? that.deviceIdwatch : uni.getStorageSync(
					"deviceIdwatch"), that.serviceIdwatch ? that.serviceIdwatch : uni.getStorageSync(
					"serviceIdwatch"), writeuuid ? writeuuid : uni.getStorageSync("writeuuid"))
				setTimeout(() => {
					let buffer2 = that.toArrayBuffer("e00006f3060104000101")
					if (uni.getStorageSync("otadatares") === "6986AF9F0656352E382E350741423536313043" ||
						uni.getStorageSync("otadatares") === "69C0EB890656352E382E370741423536313043" ||
						uni.getStorageSync("otadatares") === "69D616630656352E382E380741423536313043" ||
						uni.getStorageSync("otadatares") === "69E5814C0656352E382E390741423536313043" ||
						uni.getStorageSync("otadatares") === "69E587830656352E382E380741423536313043") {
						buffer2 = that.toArrayBuffer("e0000611030125000101") //5.8.5||5.8.7的版本情绪测量命令
					} else {
						buffer2 = that.toArrayBuffer("e00006f3060104000101")
					}
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceIdwatch ? that.deviceIdwatch : uni.getStorageSync(
							"deviceIdwatch"),
						serviceId: that.serviceIdwatch ? that.serviceIdwatch : uni.getStorageSync(
							"serviceIdwatch"),
						characteristicId: writeuuid ? writeuuid : uni.getStorageSync("writeuuid"),
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							if (complete.code === 10007) {
								uni.hideLoading()
								that.sleep_alertdisabled = true
								if (that.yalixueyatype) {} else {
									uni.showLoading({
										title: that.$t("测量中"),
										mask: true,
									})
								}
							} else {
								uni.hideLoading()
								that.sleep_alertdisabled = false
								uni.showToast({
									title: that.$t("请检查设备连接"),
									icon: 'none',
									duration: 2000
								})
							}
						},
					})
				}, 5000)
			},
			// 步数目标值
			Daily_Goal_set() {
				if (!this.Daily_Goal) {
					uni.showToast({
						title: this.$t("设置的目标值不能为空"),
						icon: 'none',
						duration: 1500
					})
					return
				} else {
					uni.showToast({
						title: this.$t("设定成功"),
						icon: 'none',
						duration: 1500
					})
					this.today_Daily_Goal = this.Daily_Goal
					uni.setStorageSync("today_Daily_Goal", this.today_Daily_Goal)
					setTimeout(() => {
						this.Daily_Goal = ""
					}, 500)
				}
			},
			//用药开关
			switch1Change(e) {
				let that = this
				that.medication = e.detail.value
				that.$forceUpdate()
				if (e.detail.value === false) {
					that.medication = false
					uni.setStorageSync("medication", false)
					// 关键点：添加下一行确保视图更新
					that.$nextTick(() => that.$forceUpdate())
				} else if (e.detail.value === true) {
					that.medication = true
					uni.setStorageSync("medication", true)
				}
			},
			// 点击顶部tab切换
			swtichSwiper(index) {
				this.currentIndex = index
			},
			swipeIndex(index) {
				let that = this
				// 获得swiper切换后的current索引
				that.currentIndex = index.detail.current;
				that.resetStates();
				that.getUserInfo();
				// 在数据操作前检查清除
				clearDailyGoalData();
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							console.log('无网络连接');
						} else {
							if (uni.getStorageSync("xueyadatatype") && uni.getStorageSync(
									"xueyadata")) {
								if (uni.getStorageSync("xueyadatatype") === "1") {
									that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, uni
										.getStorageSync("xueyadata"), {
											'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
										}).then(res => {
										console.log("上报数据手表", res)
										if (res.code === 200) {
											that.setbanhua(1)
											let deviceSnlixin = uni.getStorageSync("xueyadata")
												.deviceSn
											let slaveDatalixian = uni.getStorageSync("xueyadata")
												.slaveData
											uni.removeStorageSync("xueyadatatype")
											uni.removeStorageSync("xueyadata")
											setTimeout(() => {
												that.get_device_info(deviceSnlixin)
												that.StorageInfo(slaveDatalixian)
											}, 1000)
										}
									}).catch(errro => {
										console.log("errro", errro)
									})
								} else if (uni.getStorageSync("xueyadatatype") === "0") {
									that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, uni
										.getStorageSync(
											"xueyadata"), {
											'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
										}).then(resaa => {
										console.log("血压计", resaa)
										if (resaa.code === 200) {
											that.setbanhua(1)
											let deviceSnlixin = uni.getStorageSync("xueyadata")
												.deviceSn
											let slaveDatalixian = uni.getStorageSync("xueyadata")
												.slaveData
											uni.removeStorageSync("xueyadatatype")
											uni.removeStorageSync("xueyadata")
											setTimeout(() => {
												that.get_device_info(deviceSnlixin)
												that.StorageInfo(slaveDatalixian)
											}, 1000)
										}
									})
								}
							}
							if (uni.getStorageSync("tizhidata")) {
								that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, uni
									.getStorageSync(
										"tizhidata"), {
										'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
									}).then(res => {
									if (res.code === 500) {
										uni.showToast({
											title: that.$t("失败"),
											icon: 'none'
										})
										return
									} else if (res.code === 200) {
										that.setbanhua(1)
										let deviceSntzlx = uni.getStorageSync("tizhidata")
											.deviceSn
										uni.removeStorageSync("tizhidata")
										setTimeout(() => {
											that.get_device_info(deviceSntzlx)
											that.get_device_data(deviceSntzlx)

										}, 1000)
									}
								})
							}
						}
					},
					fail: function(err) {
						console.error('获取网络类型失败：', err);
					}
				});
				if (that.currentIndex === 1) {
					that.finalResultids = false
				}
				const BleDeviceConfig = {
					PROTOCOL_VERSION: 0x01 // 协议版本号
				};
				if (that.acktypes === "1" && that.currentIndex === 4) {
					that.getsetp(that.deviceIdwatch, that.serviceIdwatch, that.writeuuid, BleDeviceConfig
						.PROTOCOL_VERSION)
				}
				const token = uni.getStorageSync("token");
				if (!token) {
					uni.redirectTo({
						url: "/pages/login/login_land"
					});
					return false;
				}
				return true;
			},
			// 卡片数据重制
			resetStates() {
				this.deviceList = [];
				this.deviceLists = [];
				this.binaji = true;
				this.animation = '';
				this.button_show = false;
				this.delate_icon = false;
				this.disabledsaaa = true;
				this.binaji2 = true;
				this.animation2 = '';
				this.button_show2 = false;
				this.delate_icon2 = false;
				this.disabledsaaa2 = true;
			},
			// 蓝牙数据重置数据状态
			resetDataState(id) {
				// console.log("resetDataState", id)
				this.dataBuffer = [];
				this.xeuyapack = 0;
				this.xinlvpack = 0;
				this.xueyangpack = 0;
				this.quotient2 = 0;
				this.sleeppack = 0;
				this.quotientACC = 0;
				this.quotientPPG = 0;
			},
			//单位设置
			Unitlist() {
				const data = {
					dataType: 'Unitdata'
				};
				this.$get(this.$url_APP_IP + '/prod-api/device/data/list', data, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200 && res.rows.length > 0 && res.rows[0].data) {
						const parsed = this.robustParseData(res.rows[0].data);
						if (!parsed.length) return;
						const unitData = parsed[0];
						const keyMap = {
							Blood: 'bloodUnit',
							danwei1: 'heightUnit',
							danwei2: 'weightUnit',
							yaliswitchHER: 'switchHER'
						};
						/* ② 统一循环：值 → 索引 → 缓存 */
						Object.keys(keyMap).forEach(key => {
							const value = unitData[keyMap[key]];
							switch (key) {
								case 'yaliswitchHER':
									if (value) {
										uni.setStorageSync(key, value);
									}
									break;
								case 'Blood':
								case 'danwei1':
								case 'danwei2':
									if (value) {
										const matchMap = {
											Blood: "mmHg",
											danwei1: "inch",
											danwei2: "kg"
										};
										const idx = value === matchMap[key] ? 0 : 1;
										uni.setStorageSync(key, idx);
									}
									break;
							}
						});
					}
				});
			},
			// 解析单位数据
			robustParseData(dataStr) {
				try {
					// 分割每个对象
					const objects = dataStr.split('},{');
					const result = [];
					for (let i = 0; i < objects.length; i++) {
						let objStr = objects[i];
						// 修复首尾对象的花括号
						if (i === 0) objStr = objStr + '}';
						else if (i === objects.length - 1) objStr = '{' + objStr;
						else objStr = '{' + objStr + '}';
						// 移除可能的多余花括号
						objStr = objStr.replace(/^{{/, '{').replace(/}}$/, '}');
						// 修复键值对
						const fixedObjStr = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (match, key, value) => {
							value = value.trim();
							// 处理布尔值
							if (value === 'true' || value === 'false') {
								return `"${key}":${value}`;
							}
							// 处理数字
							if (!isNaN(value) && value !== '' && !value.includes('/')) {
								return `"${key}":${value}`;
							}
							// 处理字符串
							return `"${key}":"${value}"`;
						});
						try {
							const obj = JSON.parse(fixedObjStr);
							result.push(obj);
						} catch (e) {
							console.warn('解析单个对象失败:', fixedObjStr, e);
						}
					}
					return result;
				} catch (error) {
					console.error('解析失败:', error);
					return [];
				}
			},
			//帮助
			helperclick() {
				uni.navigateTo({
					url: "/pages/tabBar/my/Help_center"
				})
			},


			handleUpdateDisabled(val) {
				if (this.delate_icon2 === true) {
					this.disabledsaaa2 = val;
				}
			},

			handleUpdateDisabled1(val) {
				if (this.delate_icon === true) {
					this.disabledsaaa = val;
				}
			},

			openBLE() {
				if (systemInfo.platform === "android") {
					var main = plus.android.runtimeMainActivity();
					var Intent = plus.android.importClass("android.content.Intent");
					var mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS');
					main.startActivity(mIntent);
				} else if (systemInfo.platform === "ios") {
					plus.runtime.launchApplication({
						action: 'App-Prefs:root=BLE'
					}, function(e) {});
				}
			},



			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics1(deviceId, serviceId, deviceSn) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						console.log("获取蓝牙设备某个服务中所有特征值(characteristic)1", res)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							//蓝牙消息通知
							if (item.properties.notify) {
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										that.onBLECharacteristicValueChange1(
											deviceId,
											serviceId, deviceSn);
									},
									fail: (notifyerr) => {}
								})
							}
						}
					},
					fail(erroe) {
						console.log("获取蓝牙设备某个服务中所有特征值失败111", erroe)
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						that.deviceLists = undefined
						that.disconnectAll(deviceId)
						that.deviceList = []
						that.getUserInfo()
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType === 'none') {
									console.log('无网络连接');
									that.aaaa(uni.getStorageSync("lixianlist").rows)
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
					}
				})
			},
			// 获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics3(deviceId, serviceId, deviceSn) {
				let that = this
				that.deviceLists = []
				// 检查是否已经获取过该设备的特征值
				if (that.characteristicsCache.has(deviceId)) {
					uni.openBluetoothAdapter({
						success: () => {
							uni.onBLEConnectionStateChange(function(change) {
								if (!change.connected) {
									console.log('蓝牙设备已断开', deviceId);
									if (that.characteristicsCache.has(deviceId)) {
										console.log(`清除设备 ${deviceId} 的特征值缓存`);
										that.characteristicsCache.delete(deviceId);
									}
									that.deviceLists = that.deviceList.filter(
										deviceIds => deviceIds !== deviceId);
									setTimeout(() => {
										that.deviceList = [];
										that.setacktypes("0")
										that.queryDevices()
									}, 1000)
									const plugin = uni.requireNativePlugin(
										"CBConnectPlugin-CBCModule");
									plugin.connectPeripheral({
										identifier: deviceId
									}, (result, keepAlive) => {
										// console.log(result)
									});
									// 在这里处理设备断开后的逻辑，例如尝试重新连接等
								} else {
									if (!that.hasSynced) { // 确保只执行一次
										that.hasSynced = true
										if (that.acktypes === "1" && that.blewatch_id2 === "1") {
											uni.writeBLECharacteristicValue({
												deviceId: deviceId,
												serviceId: serviceId,
												characteristicId: that.writeuuid,
												writeType: 'write',
												value: that.toArrayBuffer(
													'e00006eb010101000101'),
												complete(complete) {
													if (complete.code === 10007) {
														that.blewatch_id = "1"
														that.blewatch_id2 = "0"
														console.log(
															"发送同步所有数据命令：e00006eb010101000101"
														)
														uni.getNetworkType({
															success: function(res) {
																if (res
																	.networkType ===
																	'none'
																) {} else {
																	that.getLocalWeather(
																		deviceId,
																		serviceId,
																		that
																		.writeuuid
																	)
																}
															},
															fail: function(err) {
																console.error(
																	'获取网络类型失败：',
																	err);
															}
														});
													} else {
														that.blewatch_id = "0"
														uni.getNetworkType({
															success: function(res) {
																if (res
																	.networkType ===
																	'none'
																) {} else {
																	that.getLocalWeather(
																		deviceId,
																		serviceId,
																		that
																		.writeuuid
																	)
																}
															},
															fail: function(err) {
																console.error(
																	'获取网络类型失败：',
																	err);
															}
														});
													}
												}
											})
										}
									}
								}
							});
						},
						fail: (err) => {
							console.error('蓝牙适配器初始化失败', err);
							if (that.characteristicsCache.has(deviceId)) {
								console.log(`清除设备 ${deviceId} 的特征值缓存`);
								that.characteristicsCache.delete(deviceId);
							}
							const plugin = uni.requireNativePlugin(
								"CBConnectPlugin-CBCModule");
							plugin.connectPeripheral({
								identifier: deviceId
							}, (result, keepAlive) => {
								console.log(result)
							});
						}
					});
					return;
				}
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						const plugin = uni.requireNativePlugin("CBConnectPlugin-CBCModule");
						plugin.connectPeripheral({
							identifier: deviceId
						}, (result, keepAlive) => {});
						that.characteristicsCache.add(deviceId); // 缓存设备ID，
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (that.acktypes === "0") {
								if (item.properties.write) {
									const buffer = that.toArrayBuffer("e00006e8000000000101");
									uni.writeBLECharacteristicValue({
										deviceId: deviceId,
										serviceId: serviceId,
										characteristicId: item.uuid,
										writeType: "write",
										value: buffer,
										complete(complete) {
											console.log("发送命令：", "e00006e8000000000101");
											that.deviceIdwatch = deviceId
											that.serviceIdwatch = serviceId
											that.writeuuid = item.uuid
											uni.setStorageSync("deviceIdwatch", deviceId)
											uni.setStorageSync("serviceIdwatch", serviceId)
											uni.setStorageSync("writeuuid", item.uuid)
											const plugin = uni.requireNativePlugin(
												"CBConnectPlugin-CBCModule");
											plugin.connectPeripheral({
												identifier: deviceId
											}, (result, keepAlive) => {
												// console.log(result)
											});
										}
									});
									that.setacktypes("1")
								}
							}

							if (item.properties.notify) {
								uni.setStorageSync("landeviceId", deviceId)
								uni.setStorageSync("lanserviceId", serviceId)
								uni.setStorageSync("landcharacteristicId", item.uuid)
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										that.writeuuid = item.uuid
										that.onBLECharacteristicValueChange3(
											deviceId, serviceId, deviceSn);
									},
									fail: (notifyerr) => {}
								})
							}
						}
					},
					fail(res) {
						console.error('获取蓝牙设备某个服务中所有特征值失败222', res)
						if (Vue.prototype.$globalTimers.heartbeatInterval) {
							clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
							Vue.prototype.$globalTimers.heartbeatInterval = null;
						}
						that.deviceLists = that.deviceList.filter(deviceIds =>
							deviceIds !== deviceId);
						setTimeout(() => {
							uni.hideLoading()
							that.deviceList = []
							that.disconnectAll(deviceId)
							that.setacktypes("0")
							that.getUserInfo()
						}, 1000)
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType === 'none') {
									console.log('无网络连接');
									that.aaaa(uni.getStorageSync("lixianlist").rows)
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
					}
				})
			},

			// 16进制转2进制
			hexToBinary(hexString) {
				let binaryString = '';
				for (let i = 0; i < hexString.length; i++) {
					// 将每个16进制字符转换为4位二进制
					const binaryChar = parseInt(hexString[i], 16).toString(2).padStart(4, '0');
					binaryString += binaryChar;
				}
				return binaryString;
			},

			onBLECharacteristicValueChange1(deviceId, serviceId, deviceSn) {
				let that = this
				uni.onBLECharacteristicValueChange(async (res) => {
					try {
						let hexData = that.ab2hex(res.value)
						let asciiString = that.hexToAscii(hexData)
						if (asciiString === "error") {
							uni.closeBLEConnection({
								deviceId: deviceId,
								success() {},
								fail() {}
							})
							that.disconnectAll(deviceId)
							that.deviceList = []
							that.getUserInfo()
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log('无网络连接');
										that.aaaa(uni.getStorageSync("lixianlist").rows)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							return
						} else if (hexData.length === 388 &&
							!hexData.startsWith("0e") &&
							!hexData.startsWith("e0") &&
							that.xueyehuilian &&
							that.xeuyejisn !== "0" &&
							that.xeuyejimac !== "0") {
							let parsedData = that.parseQueryString(asciiString);
							that.lowPressure = that.Blood === "mmHg" ? parsedData.dia.trim() : (Number(
								parsedData.dia.trim()) * 0.133).toFixed(1);
							that.highPressure = that.Blood === "mmHg" ? parsedData.sys.trim() : (
								Number(parsedData.sys.trim()) * 0.133).toFixed(1);
							that.pulse = parsedData.pul.trim();
							uni.setStorageSync("lowPressure", parsedData.dia.trim())
							uni.setStorageSync("highPressure", parsedData.sys.trim())
							uni.setStorageSync("pulse", parsedData.pul.trim())
							that.xeuyabiaoshi = "1"
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										that.bgaaa(parsedData.dia.trim(), parsedData.sys
											.trim())
										that.updateBloodPressureStatus(parsedData.dia
											.trim(),
											parsedData.sys.trim());
									} else {
										that.bgaaa(parsedData.dia.trim(), parsedData.sys
											.trim())
										that.updateBloodPressureStatus(parsedData.dia
											.trim(),
											parsedData.sys.trim());
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							that.jakoblife_fat_scale(deviceId, parsedData, deviceSn)
							that.resetDataState("30");
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log('无网络连接');
										that.aaaa(uni.getStorageSync("lixianlist").rows)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							return
						} else {
							// 添加到数据缓冲区
							that.dataBuffer.push(hexData);
							// 解析协议头和命令
							const protocolId = hexData.slice(0, 2);
							const cmd = hexData.slice(8, 10);
							// 根据协议类型处理
							if (protocolId === "e0") {
								switch (cmd) {
									case "00":
										await that.handleCMD00(hexData, that.shoubiaomac,
											"81EEA001-E735-49EC-8A11-7E32CAE1E14E");
										break;
									case "04":
										await that.handleCMD04(hexData, that.shoubiaomac,
											"81EEA001-E735-49EC-8A11-7E32CAE1E14E", that
											.shoubiaosn);
										break;
									case "03":
										that.handleCMD03(hexData, that.shoubiaomac,
											"81EEA001-E735-49EC-8A11-7E32CAE1E14E", that.writeuuid,
											deviceSn);
										break;
									case "11":
										that.resetDataState("29");
										break;
									default:
										console.log("未知CMD:", cmd);
								}
							} else if (protocolId === "0e") {
								that.resetDataState("28");
							}
							// 检查并处理完整数据集
							that.processCompleteDataSets(that.shoubiaomac, that.shoubiaosn,
								"81EEA001-E735-49EC-8A11-7E32CAE1E14E", that.writeuuid)
						}
					} catch (error) {
						that.resetDataState("27");
					}
				})
			},


			onBLECharacteristicValueChange3(deviceId, serviceId, deviceSn) {
				let that = this;
				that.resetDataState("26");
				// 监听蓝牙特征值变化
				uni.onBLECharacteristicValueChange(async (res) => {
					try {
						// 转换数据为十六进制字符串
						let hexData = that.ab2hex(res.value);
						// console.log("蓝牙接收到的数据", hexData)
						let asciiString = that.hexToAscii(hexData)
						// 处理特殊断开请求包
						if (asciiString === "error") {
							that.handleDisconnectRequest(deviceId);
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log('无网络连接');
										that.aaaa(uni.getStorageSync("lixianlist").rows)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							return;
						}
						// 处理慧联设备数据
						if (hexData.length === 388 &&
							!hexData.startsWith("0e") &&
							!hexData.startsWith("e0") &&
							that.xueyehuilian &&
							that.xeuyejisn !== "0" &&
							that.xeuyejimac !== "0") {
							await that.handleHuiLianDeviceData(res.value, that.xeuyejisn, that
								.xeuyejimac);
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log('无网络连接');
										that.aaaa(uni.getStorageSync("lixianlist").rows)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							return;
						}
						// 添加到数据缓冲区
						that.dataBuffer.push(hexData);
						// 解析协议头和命令
						const protocolId = hexData.slice(0, 2);
						const protocolIdppg = hexData.slice(0, 4);
						const cmd = hexData.slice(8, 10);
						// 根据协议类型处理
						if (protocolId === "e0") {
							switch (cmd) {
								case "00":
									await that.sendack(hexData, deviceId, serviceId, that.writeuuid);
									await that.handleCMD00(hexData, deviceId, serviceId)
									break;
								case "04":
									switch (hexData.slice(12, 14)) {
										case "01":
											that.blewatch_id = "0"
											that.blewatch_id2 = "0"
											await that.handleCMD0401(hexData, deviceId, serviceId, deviceSn);
											break
										case "00":
											await that.handleCMD04(hexData, deviceId, serviceId, deviceSn);
											break
										case "10":
											uni.setStorageSync("jiance", true)
											if (hexData.length < 160) {
												const bytes = hexStringToBytes(hexData.slice(18, hexData
													.length));
												const sleepObj = receive5610SleepData(bytes);
												const stats = that.calcSleepMinutes(sleepObj);
												console.log('解析睡眠数据：', stats);
												that.sleeepalldata = stats
												uni.setStorageSync("totalLight", stats.totalLight)
												uni.setStorageSync("totalDeep", stats.totalDeep)
												uni.setStorageSync("totalRem", stats.totalRem)
												uni.setStorageSync("sleep", stats.formalReadable)
												uni.setStorageSync("sleep_time", sleepObj.date.slice(5,
													sleepObj.date.length).replace("-", "/"))
												that.sleep = stats.formalReadable
												that.totalLight = stats.totalLight
												that.totalDeep = stats.totalDeep
												that.totalRem = stats.totalRem
												// 1. 总睡眠小时数（ 保留 1 位小数）
												const totalAll = that.timeStrToMinutes(that
													.sleep); // 436
												const totalH = (totalAll / 60).toFixed(1)
												const deepMin = (that.timeStrToMinutes(that.totalDeep) / 60)
													.toFixed(1);
												const remMin = (that.timeStrToMinutes(that.totalRem) / 60)
													.toFixed(1);
												const lightMin = (that.timeStrToMinutes(that
														.totalLight) / 60)
													.toFixed(1)
												that.sleep_point = that.overallSleepScore(totalAll,
													totalH,
													deepMin,
													remMin, lightMin)
												if (totalAll === uni.getStorageSync("totalAll2") &&
													totalH === uni.getStorageSync("totalH2") &&
													deepMin === uni.getStorageSync("deepMin2") &&
													remMin === uni.getStorageSync("remMin2") &&
													lightMin === uni.getStorageSync("lightMin2")) {
													if (uni.getStorageSync("sleep_time") === "00/00" && that
														.getCurrentTimesleep() !== that.sleep_time) {
														that.jakoblife_fat_scale3(that.shoubiaomac, stats
															.formalReadable, that.shoubiaosn, "睡眠", "");
													}
													// console.log("2当天手表上相同的睡眠数据已经上传过")
												} else {
													uni.setStorageSync("totalAll2", totalAll)
													uni.setStorageSync("totalH2", totalH)
													uni.setStorageSync("deepMin2", deepMin)
													uni.setStorageSync("remMin2", remMin)
													uni.setStorageSync("lightMin2", lightMin)
													that.jakoblife_fat_scale3(that.shoubiaomac, stats
														.formalReadable, that.shoubiaosn, "睡眠", "");
												}
												that.sendack2(hexData, deviceId, serviceId, that.writeuuid);
												that.resetDataState("25")
												that.blewatch_id = "0"
												that.blewatch_id2 = "1"
											} else {
												await that.handleCMD01(hexData, deviceId,
													serviceId, deviceSn);
											}
											break
										default:
											console.log("default其他数据", hexData)
											that.resetDataState("24")
											break
									}
									break;
								case "03":
									that.blewatch_id2 = "0"
									await that.handleCMD03(hexData, deviceId, serviceId, that.writeuuid,
										deviceSn);
									break;
								case "01":
									that.blewatch_id2 = "0"
									switch (hexData.slice(12, 14)) {
										case "00":
										case "01":
										case "02":
											that.sendack2(hexData, deviceId, serviceId, that.writeuuid);
											that.resetDataState("23");
											break
										case "03":
											setTimeout(() => {
												that.blewatch_id = "0"
												that.blewatch_id2 = "1"
												that.sendack2(hexData, deviceId, serviceId, that
													.writeuuid);
												that.resetDataState("22");
											}, 2000)
											break
									}
									break
								case "02":
								case "11":
									that.sendack2(hexData, deviceId, serviceId, that.writeuuid);
									that.resetDataState("21");
									break;
								case "20":
									console.log("手表升级", hexData)
									if (hexData.length === 20) {
										switch (hexData.slice(18, hexData.length)) {
											case "01":
												console.log("手表电量不足")
												uni.showModal({
													content: that.$t("手表电量不足"),
													confirmText: that.$t('确定'),
													showCancel: false,
													success(modal) {
														if (modal.confirm) {}
													}
												});
												that.sendack(hexData, deviceId, serviceId, that.writeuuid);
												that.resetDataState("20")
												return
												break
											case "02":
												that.sendack(hexData, deviceId, serviceId, that.writeuuid);
												that.resetDataState("17")
												break
											case "03":
												that.sendack(hexData, deviceId, serviceId, that.writeuuid);
												that.resetDataState("18")
												break
											case "04":
												that.sendack(hexData, deviceId, serviceId, that.writeuuid);
												that.resetDataState("19")
												break
										}
									}
									if (hexData.length > 20 && hexData.length < 160) {
										const bytes = hexData.slice(18, hexData.length);
										console.log("手环信息更新", bytes)
										uni.setStorageSync("otadatares", bytes.toUpperCase())
										uni.setStorageSync("otaBP", bytes.toUpperCase())
										console.log("手环信息更新", that.sleep_alertid)
										if (that.sleep_alertid === 1) {
											that.resetDataState("情绪测量")
											return
										}
										that.sendack(hexData, deviceId, serviceId, that.writeuuid);
										that.loadFiles(bytes.toUpperCase(), deviceId, serviceId)
									}
									break;
								default:
									// console.log("未知CMD:", cmd);
									break
							}
						} else if (protocolId === "0e") {
							let qingxukey = hexData.slice(12, 14)
							console.log("qingxukey：" + qingxukey, "hexData：" + hexData)
							if (cmd === "06" || (cmd === "03" && qingxukey === "25")) {
								if (that.sleep_alertid === 1 || uni.getStorageSync("sendwatch") === 1) {
									if (that.watchtimer) {
										clearInterval(that.watchtimer);
										that.watchtimer = null;
									}
									let watchtime = 35
									that.watchtimer = setInterval(() => {
										watchtime--;
										if (watchtime < 1) {
											clearInterval(that.watchtimer);
											that.watchtimer = null
											uni.hideLoading()
											that.sleep_alertdisabled = false
											if (that.yalixueyatype) {
												that.sleep_alertid = 0
												that.sleep_alertdisabled = false
											} else {
												uni.showModal({
													content: that.$t("这个功能需要手表软件版本在"),
													confirmText: that.$t('确定'),
													showCancel: false,
													success(modal) {
														if (modal.confirm) {
															that.sleep_alertid = 0
															that.sleep_alertdisabled = false
														}
													}
												})
											}
										}
									}, 1000)
								}
							}
							if (protocolIdppg === "0e00") {
								that.resetDataState("16");
							}
						}
						// 检查并处理完整数据集
						that.processCompleteDataSets(deviceId, deviceSn, serviceId, that
							.writeuuid);
					} catch (error) {
						that.resetDataState("15");
					}
				});
			},

			getCurrentTimesleep() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				return `${month}/${day}`;
			},
			calcSleepMinutes(sleepObj) {
				// 正式睡眠：浅睡 + 深睡 + 眼动
				const formalMinutes = sleepObj.totalLight + sleepObj.totalDeep + sleepObj.totalRem;
				const Light = sleepObj.totalLight
				const Deep = sleepObj.totalDeep
				const Rem = sleepObj.totalRem
				// 小睡总时长（把 type=10000 的段累加即可）
				const napMinutes = sleepObj.partList
					.filter(p => p.type === 10000)
					.reduce((sum, p) => sum + p.time, 0);
				// 含小睡
				const totalWithNap = formalMinutes + napMinutes;
				return {
					formalMinutes, // 301
					formalReadable: `${Math.floor(formalMinutes / 60)}${"H"}${formalMinutes % 60}${"M"}`,
					napMinutes, // 77
					napReadable: `${Math.floor(napMinutes / 60)}${"H"}${napMinutes % 60}${"M"}`,
					totalWithNap, // 378
					totalReadable: `${Math.floor(totalWithNap / 60)}${"H"}${totalWithNap % 60}${"M"}`,
					Light,
					totalLight: `${Math.floor(Light / 60)}${"H"}${Light % 60}${"M"}`,
					Deep,
					totalDeep: `${Math.floor(Deep / 60)}${"H"}${Deep % 60}${"M"}`,
					Rem,
					totalRem: `${Math.floor(Rem / 60)}${"H"}${Rem % 60}${"M"}`,
				};
			},

			// 处理断开连接请求
			handleDisconnectRequest(deviceId) {
				uni.closeBLEConnection({
					deviceId
				});
				this.disconnectAll(deviceId);
				this.queryDevices();
				this.resetDataState("14");
			},

			// 处理慧联设备数据
			async handleHuiLianDeviceData(arrayBuffer, deviceSn, deviceMAC) {
				let that = this
				const asciiString = that.hexToAscii(that.ab2hex(arrayBuffer));
				const parsedData = that.parseQueryString(asciiString);
				that.lowPressure = that.Blood === "mmHg" ? parsedData.dia.trim() : (Number(parsedData.dia
					.trim()) * 0.133).toFixed(1);
				that.highPressure = that.Blood === "mmHg" ? parsedData.sys.trim() : (Number(parsedData.sys
					.trim()) * 0.133).toFixed(1);
				that.pulse = parsedData.pul.trim();
				uni.setStorageSync("lowPressure", parsedData.dia.trim())
				uni.setStorageSync("highPressure", parsedData.sys.trim())
				uni.setStorageSync("pulse", parsedData.pul.trim())
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							that.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
							that.updateBloodPressureStatus(parsedData.dia.trim(), parsedData.sys
								.trim());
						} else {
							that.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
							that.updateBloodPressureStatus(parsedData.dia.trim(), parsedData.sys
								.trim());
						}
					},
					fail: function(err) {
						console.error('获取网络类型失败：', err);
					}
				});
				that.xeuyabiaoshi = "1"
				await that.jakoblife_fat_scale(deviceSn, parsedData, deviceSn);
				that.resetDataState("13");
			},
			// 处理完整的数据集
			processCompleteDataSets(deviceId, deviceSn, serviceId, writeuuid) {
				let that = this
				if (that.quotient2 > 0 && that.dataBuffer.length === that.quotient2) {
					const bytes = hexStringToBytes(that.formatData(that.dataBuffer).slice(18, that.formatData(that
						.dataBuffer).length));
					const sleepObj = receive5610SleepData(bytes);
					const stats = that.calcSleepMinutes(sleepObj);
					that.sleeepalldata = stats
					console.log('解析睡眠数据：', stats);
					uni.setStorageSync("totalLight", stats.totalLight)
					uni.setStorageSync("totalDeep", stats.totalDeep)
					uni.setStorageSync("totalRem", stats.totalRem)
					uni.setStorageSync("sleep", stats.formalReadable)
					that.sleep = stats.formalReadable
					that.totalLight = stats.totalLight
					that.totalDeep = stats.totalDeep
					that.totalRem = stats.totalRem
					// 1. 总睡眠小时数（ 保留 1 位小数）
					const totalAll = that.timeStrToMinutes(that.sleep); // 436
					const totalH = (totalAll / 60).toFixed(1)
					const deepMin = (that.timeStrToMinutes(that.totalDeep) / 60).toFixed(1);
					const remMin = (that.timeStrToMinutes(that.totalRem) / 60).toFixed(1);
					const lightMin = (that.timeStrToMinutes(that.totalLight) / 60).toFixed(1)
					that.sleep_point = that.overallSleepScore(totalAll, totalH, deepMin,
						remMin, lightMin)
					uni.setStorageSync("sleep_time", sleepObj.date.slice(5, sleepObj.date
						.length).replace("-", "/"))
					if (totalAll === uni.getStorageSync("totalAll2") &&
						totalH === uni.getStorageSync("totalH2") &&
						deepMin === uni.getStorageSync("deepMin2") &&
						remMin === uni.getStorageSync("remMin2") &&
						lightMin === uni.getStorageSync("lightMin2")) {
						if (uni.getStorageSync("sleep_time") === "00/00" && that
							.getCurrentTimesleep() !== that.sleep_time) {
							that.jakoblife_fat_scale3(that.shoubiaomac, stats
								.formalReadable, that.shoubiaosn, "睡眠", "");
						}
						// console.log("2当天手表上相同的睡眠数据已经上传过")
					} else {
						uni.setStorageSync("totalAll2", totalAll)
						uni.setStorageSync("totalH2", totalH)
						uni.setStorageSync("deepMin2", deepMin)
						uni.setStorageSync("remMin2", remMin)
						uni.setStorageSync("lightMin2", lightMin)
						that.jakoblife_fat_scale3(that.shoubiaomac, stats.formalReadable, that
							.shoubiaosn, "睡眠", "");
					}
					that.sendack2(that.formatData(that.dataBuffer), deviceId, serviceId, that.writeuuid);
					that.resetDataState("12")
					that.blewatch_id = "0"
					that.blewatch_id2 = "1"
				} else if (that.sleeppack > 0 && that.dataBuffer.length === that.sleeppack) {
					that.sendack2(that.formatData(that.dataBuffer), deviceId, serviceId, that.writeuuid);
					that.resetDataState("11")
				} else if (that.xeuyapack > 0 && that.xeuyapack === that.dataBuffer.length) {
					//处理血压数据
					that.processSingleDataType(deviceId, deviceSn, serviceId, writeuuid);
				} else if (that.xinlvpack > 0 && that.dataBuffer.length === that.xinlvpack) {
					//处理心率数据
					that.processSingleDataType(deviceId, deviceSn, serviceId, writeuuid);
				} else if (that.xueyangpack > 0 && that.dataBuffer.length === that.xueyangpack) {
					// 处理血氧数据
					that.processSingleDataType(deviceId, deviceSn, serviceId, writeuuid);
				} else if (that.quotientACC > 0 && that.dataBuffer.length === that.quotientACC) {
					const allDataACC = that.formatData(that.dataBuffer);
					const ACCdata = allDataACC.slice(18, allDataACC.length)
					const result = AccDataParser.debugParseExample(ACCdata);
					if (result.success) {
						// 获取所有X轴数据
						const xData = result.data.map(item => item.x);
						const yData = result.data.map(item => item.y);
						const zData = result.data.map(item => item.z);
					} else {
						console.error('解析失败:', result.error);
					}
					setTimeout(() => {
						that.resetDataState("10");
						that.sendack(allDataACC, deviceId, serviceId, writeuuid);
					}, 10)
				} else if (that.quotientPPG > 0 && that.dataBuffer.length === that.quotientPPG) {
					const allDataPPG = that.formatData(that.dataBuffer);
					// console.log("PPG蓝牙数据包：" + allDataPPG)
					const PPGdata = allDataPPG.slice(18, allDataPPG.length)
					const result = PPGParser.parsePPGData(PPGdata, `0x${that.PPGdataarray}`);
					// console.log("PPG解析之后的数据包：" + JSON.stringify(result))
					for (let i = 0; i < result.data.length; i++) {
						let jsonppglist = {
							// heartRate: that.pulse,
							// seqNumber: result.seqNumber,
							// seconds: result.data[i].seconds,
							// time: result.data[i].time,
							greenValue: result.data[i].greenValue,
							irValue: result.data[i].irValue,
							// greenValueirValue: that.toHex(result.data[i].greenValue, result.data[i]
							// 	.irValue)
							// greenValueirValue: `${that.intToHex(result.data[i].greenValue, true, 4)}${that.intToHex(result.data[i].irValue, true, 4)}`,
							// greenValue16: that.intToHex(result.data[i].greenValue, true, 4) //负数自动使用补码
							// index: result.data[i].index
						}
						// console.log("PPG解析之后的数据：", JSON.stringify(result.data[i].greenValue))
						that.bufferPPG.push(result.data[i].greenValue)
					}
					setTimeout(() => {
						that.resetDataState("9");
						that.sendack(allDataPPG, deviceId, serviceId, that.writeuuid);
					}, 10)
				}
			},

			getCurrentTime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			getCurrentTimePPG() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			// PPG原始波形数据存储 
			ppgdata(rawData, deviceSn, deviceId) {
				let data = {
					patientId: uni.getStorageSync("userid"), //患者id
					deviceSn: deviceSn, //设备sn
					deviceModel: "BPW1", //设备型号
					samplingRate: 100, //采样率(Hz) 5.8.5版本改成100Hz
					startTime: this.getCurrentTime(), // payload.duration, 采集开始时间(微秒精度)
					dataFormat: "INT16", //数据编码格式
					signalRange: 0, //信号强度范围
					rawData: rawData, //二进制PPG波形数据
					dataLength: "", //自动计算采样点数
					signalType: "GREEN", //PPG信号类型
					ledCurrent: 0, //LED驱动电流(mA)
					ambientLight: 0, //环境光强度
					motionLevel: 0,
					qualityScore: 0,
					qualityVersion: 0,
					processingStatus: "RAW"
				}
				console.log("data", data)
				this.$post(this.$url_APP_IP + "/prod-api/device/ppgdata", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((ppgdatares) => {
					console.log("ppgdatares", ppgdatares)
					if (ppgdatares.code === 200) {
						uni.showLoading({
							title: this.$t("云端数据计算中"),
							mask: true,
						})
						this.deviceppgdatalist(deviceSn, deviceId)
					}
				})
			},
			//查询PPG原始波形数据存储列表
			deviceppgdatalist(deviceSn, deviceId) {
				let that = this
				let dataparin = {
					patientId: uni.getStorageSync("userid"), //患者id
				}
				that.$get(that.$url_APP_IP + "/prod-api/device/ppgdata/list", dataparin, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((deviceppgdatalist) => {
					console.log("deviceppgdatalist", deviceppgdatalist)
					if (deviceppgdatalist.code === 200 && deviceppgdatalist.rows.length > 0) {
						if (deviceppgdatalist.rows[deviceppgdatalist.total - 1].processingStatus ===
							"ANALYZED") {
							that.sleep_alertdisabled = false
							uni.hideLoading();
							that.ppgdatalist(deviceSn, deviceId)
						} else if (deviceppgdatalist.rows[deviceppgdatalist.total - 1].processingStatus ===
							"ERROR") {
							that.sleep_alertdisabled = false
							uni.hideLoading();
							uni.showModal({
								content: that.$t("测试质量不够好"),
								confirmText: that.$t('确定'),
								showCancel: false,
								success(modal) {
									if (modal.confirm) {

									}
								}
							})
							console.log("数据处理有误")
						} else {
							setTimeout(() => {
								that.deviceppgdatalist(deviceSn, deviceId)
							}, 1000)
						}
					} else {
						setTimeout(() => {
							that.deviceppgdatalist(deviceSn, deviceId)
						}, 1000)
					}
				})
			},
			//根据患者id查询PPG信号最新分析结果
			ppgdatalist(deviceSn, deviceId) {
				let that = this
				let ppgdata = {
					patientId: uni.getStorageSync("userid"),
				}
				that.$get(that.$url_APP_IP + "/prod-api/device/ppgresults/get_result_by_patient_id", ppgdata, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((ppgdatalist) => {
					console.log("ppgdatalist", ppgdatalist)
					if (ppgdatalist.code === 200) {
						uni.hideLoading();
						let aaa = {
							mood_index: ppgdatalist.data.moodIndex, //心情指数
							depression_risk_score: ppgdatalist.data.depressionRiskScore, //抑郁风险评分
							stress_index: ppgdatalist.data.stressIndex, //压力指数
							fatigue_index: ppgdatalist.data.fatigueIndex, //疲劳指数
							recovery_index: ppgdatalist.data.recoveryIndex, //恢复指数
						}
						this.ppgresultslist(this.types_index)
						this.ppgresultslist2(this.types_index)
						this.ppgresultslist3(this.types_index)
						this.ppgresultslist4()
						this.share_data_fat_scale(deviceSn, deviceId, ppgdatalist.data.analysisTime, aaa)
						// 计算信号质量
						switch (ppgdatalist.data.signalQualityLevel) {
							case "EXCELLENT":
								that.signal_quality_level = that.$t("信号质量极佳")
								break
							case "GOOD":
								that.signal_quality_level = that.$t("信号质量良好")
								break
							case "FAIR":
								that.signal_quality_level = that.$t("信号质量一般")
								break
							case "POOR":
								that.signal_quality_level = that.$t("信号质量较差")
								break
						}
					} else {
						console.log("哈哈哈哈哈哈哈")
						uni.hideLoading();
					}
				})
			},
			//情绪数据上报
			share_data_fat_scale(deviceSn, deviceId, fattimes, aaa) {
				let data = {
					deviceSn: deviceSn === "undefined" || deviceSn === undefined ? uni
						.getStorageSync("deviceSn") : deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: this.datatime(fattimes)
				}
				console.log("上报手表情绪数据参数", data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(sharedatafatscaleres => {
					console.log("上报手表情绪数据", sharedatafatscaleres)
					if (sharedatafatscaleres.code === 200) {

					}
				}).catch(sharedatafatscaleerrro => {
					console.log("sharedatafatscaleerrro", sharedatafatscaleerrro)
				})
			},

			ppgresultslist(recordId) {
				let ppgdata = {
					patientId: uni.getStorageSync("userid"),
					startTime: this.getCurrentTimePPG() + " 00:00:00",
					endTime: this.getCurrentTimePPG() + " 23:59:59",
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/ppgresults/get_result_list_by_patient_id",
					ppgdata, {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgresultslist) => {
					// console.log("ppgresultslist", ppgresultslist)
					if (ppgresultslist.code === 200 && ppgresultslist.data.length > 0) {
						this.chartDataPPG.categories = []
						this.chartDataPPG.series = [{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7'
							},
							{
								legendShape: "none",
								name: "",
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7'
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7'
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7'
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7'
							}
						]
						for (let p = ppgresultslist.data.length - 1; p >= 0; p--) {
							this.chartDataPPG.categories.push(ppgresultslist.data.length - p);
							if (recordId === 0) {
								this.chartDataPPG.series[0].data.push(ppgresultslist.data[p].moodIndex);
								this.optsPPG.extra.markLine.data[0].value = 8
								this.optsPPG.extra.markLine.data[0].lineColor = "#41EB08"
								this.optsPPG.extra.markLine.data[0].showLabel = true
								this.optsPPG.extra.markLine.data[0].labelText = this.$t("积极愉悦2")
								this.optsPPG.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG.extra.markLine.data[0].labelOffsetX = Language == 'zh-Hans' ||
									Language == 'zh-Hant' ? 60 : 145
								this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[0].borderWidth = 0
								this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[0].borderRadius = 4
								this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[1].value = 6
								this.optsPPG.extra.markLine.data[1].lineColor = "#3298F7"
								this.optsPPG.extra.markLine.data[1].showLabel = true
								this.optsPPG.extra.markLine.data[1].labelText = this.$t("平静稳定2")
								this.optsPPG.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG.extra.markLine.data[1].labelOffsetX = Language == 'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 115
								this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[1].borderWidth = 0
								this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[1].borderRadius = 4
								this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[2].value = 4
								this.optsPPG.extra.markLine.data[2].lineColor = "#FF6B6B"
								this.optsPPG.extra.markLine.data[2].showLabel = true
								this.optsPPG.extra.markLine.data[2].labelText = this.$t("轻微压力2")
								this.optsPPG.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG.extra.markLine.data[2].labelOffsetX = Language == 'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 83
								this.optsPPG.extra.markLine.data[2].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[2].borderWidth = 0
								this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[2].borderRadius = 4
								this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[3].value = 0
								this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[3].showLabel = true
								this.optsPPG.extra.markLine.data[3].labelText = this.$t("明显压力2")
								this.optsPPG.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG.extra.markLine.data[3].labelOffsetX = Language == 'zh-Hans' ||
									Language ==
									'zh-Hant' ? 60 : 122
								this.optsPPG.extra.markLine.data[3].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[3].borderWidth = 0
								this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[3].borderRadius = 4
								this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 1) {
								this.chartDataPPG.series[1].data.push(ppgresultslist.data[p].depressionRiskScore);
								this.optsPPG.extra.markLine.data[0].value = 8
								this.optsPPG.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG.extra.markLine.data[0].showLabel = true
								this.optsPPG.extra.markLine.data[0].labelText = this.$t("较高风险2")
								this.optsPPG.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 70
								this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[0].borderWidth = 0
								this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[0].borderRadius = 4
								this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[1].value = 5
								this.optsPPG.extra.markLine.data[1].lineColor = "#3298F7"
								this.optsPPG.extra.markLine.data[1].showLabel = true
								this.optsPPG.extra.markLine.data[1].labelText = this.$t("中等风险2")
								this.optsPPG.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 90
								this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[1].borderWidth = 0
								this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[1].borderRadius = 4
								this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[2].value = 0
								this.optsPPG.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[2].showLabel = true
								this.optsPPG.extra.markLine.data[2].labelText = this.$t("较低风险2")
								this.optsPPG.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG.extra.markLine.data[2].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 70
								this.optsPPG.extra.markLine.data[2].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[2].borderWidth = 0
								this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[2].borderRadius = 4
								this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[3].value = 0
								this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[3].showLabel = false
								this.optsPPG.extra.markLine.data[3].labelText = ""
								this.optsPPG.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG.extra.markLine.data[3].labelOffsetX = 60
								this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[3].borderWidth = 0
								this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[3].borderRadius = 4
								this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 2) {
								this.chartDataPPG.series[2].data.push(ppgresultslist.data[p].stressIndex);
								this.optsPPG.extra.markLine.data[0].value = 5
								this.optsPPG.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG.extra.markLine.data[0].showLabel = true
								this.optsPPG.extra.markLine.data[0].labelText = this.$t("压力大2")
								this.optsPPG.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 85
								this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[0].borderWidth = 0
								this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[0].borderRadius = 4
								this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[1].value = 0
								this.optsPPG.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[1].showLabel = true
								this.optsPPG.extra.markLine.data[1].labelText = this.$t("压力小2")
								this.optsPPG.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 85
								this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[1].borderWidth = 0
								this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[1].borderRadius = 4
								this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[2].value = 0
								this.optsPPG.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[2].showLabel = false
								this.optsPPG.extra.markLine.data[2].labelText = ""
								this.optsPPG.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG.extra.markLine.data[2].labelOffsetX = 60
								this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[2].borderWidth = 0
								this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[2].borderRadius = 4
								this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[3].value = 0
								this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[3].showLabel = false
								this.optsPPG.extra.markLine.data[3].labelText = ""
								this.optsPPG.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG.extra.markLine.data[3].labelOffsetX = 60
								this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[3].borderWidth = 0
								this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[3].borderRadius = 4
								this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 3) {
								this.chartDataPPG.series[3].data.push(ppgresultslist.data[p].fatigueIndex);
								this.optsPPG.extra.markLine.data[0].value = 5
								this.optsPPG.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG.extra.markLine.data[0].showLabel = true
								this.optsPPG.extra.markLine.data[0].labelText = this.$t("疲劳度高2")
								this.optsPPG.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 125
								this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[0].borderWidth = 0
								this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[0].borderRadius = 4
								this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[1].value = 0
								this.optsPPG.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[1].showLabel = true
								this.optsPPG.extra.markLine.data[1].labelText = this.$t("疲劳度低2")
								this.optsPPG.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 120
								this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[1].borderWidth = 0
								this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[1].borderRadius = 4
								this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[2].value = 0
								this.optsPPG.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[2].showLabel = false
								this.optsPPG.extra.markLine.data[2].labelText = ""
								this.optsPPG.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG.extra.markLine.data[2].labelOffsetX = 60
								this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[2].borderWidth = 0
								this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[2].borderRadius = 4
								this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[3].value = 0
								this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[3].showLabel = false
								this.optsPPG.extra.markLine.data[3].labelText = ""
								this.optsPPG.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG.extra.markLine.data[3].labelOffsetX = 60
								this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[3].borderWidth = 0
								this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[3].borderRadius = 4
								this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 4) {
								this.chartDataPPG.series[4].data.push(ppgresultslist.data[p].recoveryIndex);
								this.optsPPG.extra.markLine.data[0].value = 5
								this.optsPPG.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG.extra.markLine.data[0].showLabel = true
								this.optsPPG.extra.markLine.data[0].labelText = this.$t("恢复快2")
								this.optsPPG.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 100
								this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[0].borderWidth = 0
								this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[0].borderRadius = 4
								this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[1].value = 0
								this.optsPPG.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[1].showLabel = true
								this.optsPPG.extra.markLine.data[1].labelText = this.$t("恢复慢2")
								this.optsPPG.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 100
								this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[1].borderWidth = 0
								this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[1].borderRadius = 4
								this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[2].value = 0
								this.optsPPG.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[2].showLabel = false
								this.optsPPG.extra.markLine.data[2].labelText = ""
								this.optsPPG.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG.extra.markLine.data[2].labelOffsetX = 60
								this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[2].borderWidth = 0
								this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[2].borderRadius = 4
								this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG.extra.markLine.data[3].value = 0
								this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[3].showLabel = false
								this.optsPPG.extra.markLine.data[3].labelText = ""
								this.optsPPG.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG.extra.markLine.data[3].labelOffsetX = 60
								this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[3].borderWidth = 0
								this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[3].borderRadius = 4
								this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
							}
						}
					} else {
						if (recordId === 0) {
							this.chartDataPPG.series[0].data = [];
							this.optsPPG.extra.markLine.data[0].value = 8
							this.optsPPG.extra.markLine.data[0].lineColor = "#41EB08"
							this.optsPPG.extra.markLine.data[0].showLabel = true
							this.optsPPG.extra.markLine.data[0].labelText = this.$t("积极愉悦2")
							this.optsPPG.extra.markLine.data[0].labelAlign = "left"
							this.optsPPG.extra.markLine.data[0].labelOffsetX = Language == 'zh-Hans' || Language ==
								'zh-Hant' ? 60 : 145
							this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[0].borderWidth = 0
							this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[0].borderRadius = 4
							this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[1].value = 6
							this.optsPPG.extra.markLine.data[1].lineColor = "#3298F7"
							this.optsPPG.extra.markLine.data[1].showLabel = true
							this.optsPPG.extra.markLine.data[1].labelText = this.$t("平静稳定2")
							this.optsPPG.extra.markLine.data[1].labelAlign = "left"
							this.optsPPG.extra.markLine.data[1].labelOffsetX = Language == 'zh-Hans' || Language ==
								'zh-Hant' ? 60 : 115
							this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[1].borderWidth = 0
							this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[1].borderRadius = 4
							this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[2].value = 4
							this.optsPPG.extra.markLine.data[2].lineColor = "#FF6B6B"
							this.optsPPG.extra.markLine.data[2].showLabel = true
							this.optsPPG.extra.markLine.data[2].labelText = this.$t("轻微压力2")
							this.optsPPG.extra.markLine.data[2].labelAlign = "left"
							this.optsPPG.extra.markLine.data[2].labelOffsetX = Language == 'zh-Hans' || Language ==
								'zh-Hant' ? 60 : 83
							this.optsPPG.extra.markLine.data[2].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[2].borderWidth = 0
							this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[2].borderRadius = 4
							this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[3].value = 0
							this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[3].showLabel = true
							this.optsPPG.extra.markLine.data[3].labelText = this.$t("明显压力2")
							this.optsPPG.extra.markLine.data[3].labelAlign = "left"
							this.optsPPG.extra.markLine.data[3].labelOffsetX = Language == 'zh-Hans' || Language ==
								'zh-Hant' ? 60 : 122
							this.optsPPG.extra.markLine.data[3].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[3].borderWidth = 0
							this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[3].borderRadius = 4
							this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
						} else if (recordId === 1) {
							this.chartDataPPG.series[1].data = [];
							this.optsPPG.extra.markLine.data[0].value = 8
							this.optsPPG.extra.markLine.data[0].lineColor = "#FF6B6B"
							this.optsPPG.extra.markLine.data[0].showLabel = true
							this.optsPPG.extra.markLine.data[0].labelText = this.$t("较高风险2")
							this.optsPPG.extra.markLine.data[0].labelAlign = "left"
							this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 70
							this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[0].borderWidth = 0
							this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[0].borderRadius = 4
							this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[1].value = 5
							this.optsPPG.extra.markLine.data[1].lineColor = "#3298F7"
							this.optsPPG.extra.markLine.data[1].showLabel = true
							this.optsPPG.extra.markLine.data[1].labelText = this.$t("中等风险2")
							this.optsPPG.extra.markLine.data[1].labelAlign = "left"
							this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 90
							this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[1].borderWidth = 0
							this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[1].borderRadius = 4
							this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[2].value = 0
							this.optsPPG.extra.markLine.data[2].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[2].showLabel = true
							this.optsPPG.extra.markLine.data[2].labelText = this.$t("较低风险2")
							this.optsPPG.extra.markLine.data[2].labelAlign = "left"
							this.optsPPG.extra.markLine.data[2].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 70
							this.optsPPG.extra.markLine.data[2].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[2].borderWidth = 0
							this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[2].borderRadius = 4
							this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[3].value = 0
							this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[3].showLabel = false
							this.optsPPG.extra.markLine.data[3].labelText = ""
							this.optsPPG.extra.markLine.data[3].labelAlign = "left"
							this.optsPPG.extra.markLine.data[3].labelOffsetX = 60
							this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[3].borderWidth = 0
							this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[3].borderRadius = 4
							this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
						} else if (recordId === 2) {
							this.chartDataPPG.series[2].data = [];
							this.optsPPG.extra.markLine.data[0].value = 5
							this.optsPPG.extra.markLine.data[0].lineColor = "#FF6B6B"
							this.optsPPG.extra.markLine.data[0].showLabel = true
							this.optsPPG.extra.markLine.data[0].labelText = this.$t("压力大2")
							this.optsPPG.extra.markLine.data[0].labelAlign = "left"
							this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 85
							this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[0].borderWidth = 0
							this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[0].borderRadius = 4
							this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[1].value = 0
							this.optsPPG.extra.markLine.data[1].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[1].showLabel = true
							this.optsPPG.extra.markLine.data[1].labelText = this.$t("压力小2")
							this.optsPPG.extra.markLine.data[1].labelAlign = "left"
							this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 85
							this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[1].borderWidth = 0
							this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[1].borderRadius = 4
							this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[2].value = 0
							this.optsPPG.extra.markLine.data[2].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[2].showLabel = false
							this.optsPPG.extra.markLine.data[2].labelText = ""
							this.optsPPG.extra.markLine.data[2].labelAlign = "left"
							this.optsPPG.extra.markLine.data[2].labelOffsetX = 60
							this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[2].borderWidth = 0
							this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[2].borderRadius = 4
							this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[3].value = 0
							this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[3].showLabel = false
							this.optsPPG.extra.markLine.data[3].labelText = ""
							this.optsPPG.extra.markLine.data[3].labelAlign = "left"
							this.optsPPG.extra.markLine.data[3].labelOffsetX = 60
							this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[3].borderWidth = 0
							this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[3].borderRadius = 4
							this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
						} else if (recordId === 3) {
							this.chartDataPPG.series[3].data = [];
							this.optsPPG.extra.markLine.data[0].value = 5
							this.optsPPG.extra.markLine.data[0].lineColor = "#FF6B6B"
							this.optsPPG.extra.markLine.data[0].showLabel = true
							this.optsPPG.extra.markLine.data[0].labelText = this.$t("疲劳度高2")
							this.optsPPG.extra.markLine.data[0].labelAlign = "left"
							this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 125
							this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[0].borderWidth = 0
							this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[0].borderRadius = 4
							this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[1].value = 0
							this.optsPPG.extra.markLine.data[1].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[1].showLabel = true
							this.optsPPG.extra.markLine.data[1].labelText = this.$t("疲劳度低2")
							this.optsPPG.extra.markLine.data[1].labelAlign = "left"
							this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 120
							this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[1].borderWidth = 0
							this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[1].borderRadius = 4
							this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[2].value = 0
							this.optsPPG.extra.markLine.data[2].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[2].showLabel = false
							this.optsPPG.extra.markLine.data[2].labelText = ""
							this.optsPPG.extra.markLine.data[2].labelAlign = "left"
							this.optsPPG.extra.markLine.data[2].labelOffsetX = 60
							this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[2].borderWidth = 0
							this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[2].borderRadius = 4
							this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[3].value = 0
							this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[3].showLabel = false
							this.optsPPG.extra.markLine.data[3].labelText = ""
							this.optsPPG.extra.markLine.data[3].labelAlign = "left"
							this.optsPPG.extra.markLine.data[3].labelOffsetX = 60
							this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[3].borderWidth = 0
							this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[3].borderRadius = 4
							this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
						} else if (recordId === 4) {
							this.chartDataPPG.series[4].data = [];
							this.optsPPG.extra.markLine.data[0].value = 5
							this.optsPPG.extra.markLine.data[0].lineColor = "#FF6B6B"
							this.optsPPG.extra.markLine.data[0].showLabel = true
							this.optsPPG.extra.markLine.data[0].labelText = this.$t("恢复快2")
							this.optsPPG.extra.markLine.data[0].labelAlign = "left"
							this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 100
							this.optsPPG.extra.markLine.data[0].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[0].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[0].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[0].borderWidth = 0
							this.optsPPG.extra.markLine.data[0].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[0].borderRadius = 4
							this.optsPPG.extra.markLine.data[0].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[1].value = 0
							this.optsPPG.extra.markLine.data[1].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[1].showLabel = true
							this.optsPPG.extra.markLine.data[1].labelText = this.$t("恢复慢2")
							this.optsPPG.extra.markLine.data[1].labelAlign = "left"
							this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
								'zh-Hans' || Language == 'zh-Hant' ? 60 : 100
							this.optsPPG.extra.markLine.data[1].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[1].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[1].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[1].borderWidth = 0
							this.optsPPG.extra.markLine.data[1].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[1].borderRadius = 4
							this.optsPPG.extra.markLine.data[1].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[2].value = 0
							this.optsPPG.extra.markLine.data[2].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[2].showLabel = false
							this.optsPPG.extra.markLine.data[2].labelText = ""
							this.optsPPG.extra.markLine.data[2].labelAlign = "left"
							this.optsPPG.extra.markLine.data[2].labelOffsetX = 60
							this.optsPPG.extra.markLine.data[2].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[2].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[2].borderWidth = 0
							this.optsPPG.extra.markLine.data[2].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[2].borderRadius = 4
							this.optsPPG.extra.markLine.data[2].padding = [4, 8, 4, 8]
							this.optsPPG.extra.markLine.data[3].value = 0
							this.optsPPG.extra.markLine.data[3].lineColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[3].showLabel = false
							this.optsPPG.extra.markLine.data[3].labelText = ""
							this.optsPPG.extra.markLine.data[3].labelAlign = "left"
							this.optsPPG.extra.markLine.data[3].labelOffsetX = 60
							this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[3].borderWidth = 0
							this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[3].borderRadius = 4
							this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
						}

					}
				})
			},
			//两周平均分
			ppgresultslist2(recordId) {
				let endTime = this.getCurrentTimePPG() + " 23:59:59"
				let initialDate = new Date(endTime)
				let minusOneWeek = new Date(initialDate)
				minusOneWeek.setDate(minusOneWeek.getDate() - 13) // 两周
				let startTime = minusOneWeek.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				let ppgdata = {
					patientId: uni.getStorageSync("userid"),
					startTime: startTime,
					endTime: endTime,
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/ppgresults/get_result_list_by_patient_id",
					ppgdata, {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgresultslist) => {
					// console.log("ppgresultslist", ppgresultslist)
					if (ppgresultslist.code === 200 && ppgresultslist.data.length > 0) {
						// 1. 按日期分组计算每日平均分
						const dailyData = {};
						ppgresultslist.data.forEach(item => {
							const date = item.analysisTime.split(' ')[0]; // 获取日期部分，如 "2026-01-08"
							if (!dailyData[date]) {
								dailyData[date] = {
									sumMoodIndex: 0, //心情评估
									sumDepressionRisk: 0, //心理指数
									sumstressIndex: 0, //压力指数
									sumfatigueIndex: 0, //疲劳指数
									sumrecoveryIndex: 0, //恢复指数
									count: 0,
									date: date
								};
							}
							dailyData[date].sumMoodIndex += item.moodIndex;
							// 假设后端返回的抑郁风险分数字段名为 depressionRiskScore
							// 如果字段名不同，请修改为实际的字段名
							dailyData[date].sumDepressionRisk += item.depressionRiskScore || 0;
							dailyData[date].sumstressIndex += item.stressIndex || 0;
							dailyData[date].sumfatigueIndex += item.fatigueIndex || 0;
							dailyData[date].sumrecoveryIndex += item.recoveryIndex || 0;
							dailyData[date].count++;
						});

						// 2. 计算每日平均值并转换为数组
						const dailyAverages = Object.values(dailyData).map(item => {
							return {
								date: item.date,
								averageMoodIndex: item.sumMoodIndex / item.count,
								averageDepressionRisk: item.sumDepressionRisk / item.count,
								averagestressIndex: item.sumstressIndex / item.count,
								averagesumfatigueIndex: item.sumfatigueIndex / item.count,
								averagesumrecoveryIndex: item.sumrecoveryIndex / item.count
							};
						});

						// 3. 按日期排序（从早到晚）
						dailyAverages.sort((a, b) => new Date(a.date) - new Date(b.date));

						// 4. 初始化图表数据
						this.chartDataPPG2.categories = []
						this.chartDataPPG2.series = [{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7' // 蓝色表示心情指数
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7' // 红色表示抑郁风险
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7' // 红色表示抑郁风险
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7' // 红色表示抑郁风险
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7' // 红色表示抑郁风险
							}
						]
						// 5. 填充图表数据
						let dayCount = 1;
						dailyAverages.forEach(item => {
							// 可以选择显示日期或简单的序号
							const datesfd = item.date.slice(8);
							this.chartDataPPG2.categories.push(datesfd); // 或使用 item.date.slice(5) 显示月日
							if (recordId === 0) {
								// 心情指数数据
								const avgMoodScore = item.averageMoodIndex.toFixed(1);
								this.chartDataPPG2.series[0].data.push(avgMoodScore);
								this.optsPPG2.extra.markLine.data[0].value = 8
								this.optsPPG2.extra.markLine.data[0].lineColor = "#41EB08"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t("积极愉悦2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 145
								this.optsPPG2.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 6
								this.optsPPG2.extra.markLine.data[1].lineColor = "#3298F7"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t("平静稳定2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 115
								this.optsPPG2.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[1].borderRadius = 4
								this.optsPPG2.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[2].value = 4
								this.optsPPG2.extra.markLine.data[2].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[2].showLabel = true
								this.optsPPG2.extra.markLine.data[2].labelText = this.$t("轻微压力2")
								this.optsPPG2.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[2].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 83
								this.optsPPG2.extra.markLine.data[2].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[2].borderWidth = 0
								this.optsPPG2.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[2].borderRadius = 4
								this.optsPPG2.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[3].value = 0
								this.optsPPG2.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[3].showLabel = true
								this.optsPPG2.extra.markLine.data[3].labelText = this.$t("明显压力2")
								this.optsPPG2.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[3].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 122
								this.optsPPG2.extra.markLine.data[3].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[3].borderWidth = 0
								this.optsPPG2.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 1) {
								// 抑郁风险数据
								const avgRiskScore = item.averageDepressionRisk.toFixed(1);
								this.chartDataPPG2.series[1].data.push(avgRiskScore);
								this.optsPPG2.extra.markLine.data[0].value = 8
								this.optsPPG2.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t("较高风险2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 70
								this.optsPPG2.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 5
								this.optsPPG2.extra.markLine.data[1].lineColor = "#3298F7"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t("中等风险2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 90
								this.optsPPG2.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[1].borderRadius = 4
								this.optsPPG2.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[2].value = 0
								this.optsPPG2.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].showLabel = true
								this.optsPPG2.extra.markLine.data[2].labelText = this.$t("较低风险2")
								this.optsPPG2.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[2].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 70
								this.optsPPG2.extra.markLine.data[2].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[2].borderWidth = 0
								this.optsPPG2.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[2].borderRadius = 4
								this.optsPPG2.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[3].value = 0
								this.optsPPG2.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[3].showLabel = false
								this.optsPPG2.extra.markLine.data[3].labelText = ""
								this.optsPPG2.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[3].labelOffsetX = 60
								this.optsPPG2.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[3].borderWidth = 0
								this.optsPPG2.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 2) {
								// 压力指数
								const avgRiskScore = item.averagestressIndex.toFixed(1);
								this.chartDataPPG2.series[2].data.push(avgRiskScore);
								this.optsPPG2.extra.markLine.data[0].value = 5
								this.optsPPG2.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t("压力大2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 85
								this.optsPPG2.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 0
								this.optsPPG2.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t("压力小2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 85
								this.optsPPG2.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[1].borderRadius = 4
								this.optsPPG2.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[2].value = 0
								this.optsPPG2.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].showLabel = false
								this.optsPPG2.extra.markLine.data[2].labelText = ""
								this.optsPPG2.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[2].labelOffsetX = 60
								this.optsPPG2.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[2].borderWidth = 0
								this.optsPPG2.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[2].borderRadius = 4
								this.optsPPG2.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[3].value = 0
								this.optsPPG2.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[3].showLabel = false
								this.optsPPG2.extra.markLine.data[3].labelText = ""
								this.optsPPG2.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[3].labelOffsetX = 60
								this.optsPPG2.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[3].borderWidth = 0
								this.optsPPG2.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 3) {
								// 疲劳指数
								const avgRiskScore = item.averagesumfatigueIndex.toFixed(1);
								this.chartDataPPG2.series[3].data.push(avgRiskScore);
								this.optsPPG2.extra.markLine.data[0].value = 5
								this.optsPPG2.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t("疲劳度高2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 125
								this.optsPPG2.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 0
								this.optsPPG2.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t("疲劳度低2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 120
								this.optsPPG2.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[1].borderRadius = 4
								this.optsPPG2.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[2].value = 0
								this.optsPPG2.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].showLabel = false
								this.optsPPG2.extra.markLine.data[2].labelText = ""
								this.optsPPG2.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[2].labelOffsetX = 60
								this.optsPPG2.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[2].borderWidth = 0
								this.optsPPG2.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[2].borderRadius = 4
								this.optsPPG2.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[3].value = 0
								this.optsPPG2.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[3].showLabel = false
								this.optsPPG2.extra.markLine.data[3].labelText = ""
								this.optsPPG2.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[3].labelOffsetX = 60
								this.optsPPG2.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[3].borderWidth = 0
								this.optsPPG2.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]

							} else if (recordId === 4) {
								// 恢复指数
								const avgRiskScore = item.averagesumrecoveryIndex.toFixed(1);
								this.chartDataPPG2.series[4].data.push(avgRiskScore);
								this.optsPPG2.extra.markLine.data[0].value = 5
								this.optsPPG2.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t("恢复快2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 100
								this.optsPPG2.extra.markLine.data[0].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 0
								this.optsPPG2.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t("恢复慢2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 100
								this.optsPPG2.extra.markLine.data[1].labelFontColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[1].borderRadius = 4
								this.optsPPG2.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[2].value = 0
								this.optsPPG2.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].showLabel = false
								this.optsPPG2.extra.markLine.data[2].labelText = ""
								this.optsPPG2.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[2].labelOffsetX = 60
								this.optsPPG2.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[2].borderWidth = 0
								this.optsPPG2.extra.markLine.data[2].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[2].borderRadius = 4
								this.optsPPG2.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[3].value = 0
								this.optsPPG2.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[3].showLabel = false
								this.optsPPG2.extra.markLine.data[3].labelText = ""
								this.optsPPG2.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[3].labelOffsetX = 60
								this.optsPPG2.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[3].borderWidth = 0
								this.optsPPG2.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]
							}
							dayCount++;
						});
						// 6. 处理最新一条记录的详细信息
						const latestRecord = ppgresultslist.data[0];
						// 可选：输出每日平均分用于调试
						// console.log("每日平均数据:", dailyAverages);
						let calculateDailyStatsvalue = this.calculateDailyStats(dailyAverages)
						this.MoodDays = calculateDailyStatsvalue.lowMoodDays
						this.StressFatigueDays = calculateDailyStatsvalue.highStressFatigueDays
						const isMoodLowFrequently = dailyAverages.filter(d => d.averageMoodIndex < 6).length >= 10;
						// console.log(isMoodLowFrequently); // true 或 false
						// 先找出 mood < 6 的所有日期
						const lowMoodDays = dailyAverages.filter(d => d.averageMoodIndex < 6);
						// 在这些日期里，检查是否至少有一天同时满足 fatigue > 0.5 或 stress > 0.5
						const hasHighFatigueOrStressInLowMoodDays = lowMoodDays.some(
							d => d.averagesumfatigueIndex > 0.5 || d.averagestressIndex > 0.5
						);
						// console.log(hasHighFatigueOrStressInLowMoodDays); // true 或 false
						// 3. 最终同时满足两个条件
						this.finalResult = isMoodLowFrequently && hasHighFatigueOrStressInLowMoodDays;
						// console.log("最终同时满足两个条件:", this.finalResult); // true / false
						if (this.finalResult && this.baoggaodisabled && !this.finalResultids) {
							this.finalResultids = true
							uni.showModal({
								content: this.$t("为了更准确地了解您的情绪状态"),
								confirmText: this.$t('确定'),
								cancelText: this.$t('取消'),
								success(modal) {
									if (modal.confirm) {
										uni.navigateTo({
											url: '/pages/tabBar/main/score/score'
										})
									}
								}
							})
						}
					}
				})
			},

			ppgresultslist3(recordId) {
				let endTime = this.getCurrentTimePPG() + " 23:59:59"
				let initialDate = new Date(endTime)
				let minusOneWeek = new Date(initialDate)
				minusOneWeek.setDate(minusOneWeek.getDate() - 13)
				let startTime = minusOneWeek.toISOString().replace('T', ' ').substring(0, 10) + " 00:00:00"
				let ppgdata = {
					patientId: uni.getStorageSync("userid"),
					startTime: startTime,
					endTime: endTime,
				}
				// console.log("onshowppgdata", ppgdata)
				this.$get(this.$url_APP_IP + "/prod-api/device/ppgresults/get_result_list_by_patient_id",
					ppgdata, {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgresultslist) => {
					// console.log("ppgresultslist", ppgresultslist)
					if (ppgresultslist.code === 200 && ppgresultslist.data.length > 0) {
						for (let p = ppgresultslist.data.length - 1; p >= 0; p--) {
							this.signal_quality_score = ppgresultslist.data[p].analysisConfidence
							this.ppgnewpoint = ppgresultslist.data[p].moodIndex + "/10";
							this.depression_risk_score = ppgresultslist.data[p].depressionRiskScore +
								"/10";
							//综合指数
							this.stress_Index = ppgresultslist.data[p].stressIndex; //压力指数
							this.fatigue_index = ppgresultslist.data[p].fatigueIndex; //疲劳指数
							this.recovery_index = ppgresultslist.data[p].recoveryIndex +
								"/10"; //恢复指数
						}
						// 计算信号质量
						switch (ppgresultslist.data[0].signalQualityLevel) {
							case "EXCELLENT":
								this.signal_quality_level = this.$t("信号质量极佳")
								break
							case "GOOD":
								this.signal_quality_level = this.$t("信号质量良好")
								break
							case "FAIR":
								this.signal_quality_level = this.$t("信号质量一般")
								break
							case "POOR":
								this.signal_quality_level = this.$t("信号质量较差")
								break
						}
						switch (ppgresultslist.data[0].moodDescription) {
							case "积极愉悦":
								this.mood_Description = this.$t("积极愉悦1")
								break
							case "平静稳定":
								this.mood_Description = this.$t("平静稳定1")
								break
							case "轻微压力":
								this.mood_Description = this.$t("轻微压力1")
								break
							case "明显压力":
								this.mood_Description = this.$t("明显压力1")
								break
						}
						//心情等级
						switch (ppgresultslist.data[0].moodLevel) {
							case "VERY_POSITIVE":
								this.mood_level = this.$t("非常积极")
								break
							case "POSITIVE":
								this.mood_level = this.$t("积极")
								break
							case "NEUTRAL":
								this.mood_level = this.$t("平静稳定")
								break
							case "NEGATIVE":
								this.mood_level = this.$t("负面")
								break
							case "VERY_NEGATIVE":
								this.mood_level = this.$t("非常负面")
								break
						}

						switch (ppgresultslist.data[0].depressionRecommendation) {
							case "🟢 **低风险**: 保持健康生活方式，定期监测":
								this.depression_recommendation = this.$t("保持良好的生活习惯")
								break
							case "🟡 **中风险**: 建议定期监测并考虑专业咨询。可尝试心理自助方法和压力管理":
								this.depression_recommendation = this.$t("建议增加放松活动")
								break
							case "🔴 **高风险**: 强烈建议尽快咨询精神科医生或心理医生。建议进行专业心理评估和临床访谈":
								this.depression_recommendation = this.$t("强烈建议咨询心理健康专业人士进行详细评估")
								break
							case "保持良好的生活习惯，定期监测心率变异性":
								this.depression_recommendation = this.$t("保持良好的生活习惯")
								break
							case "建议增加放松活动，如冥想、深呼吸练习，考虑咨询专业人士":
								this.depression_recommendation = this.$t("建议增加放松活动")
								break
							case "🔴 **高风险**: 强烈建议尽快咨询精神科医生或心理医生。建议进行专业心理评估和临床访谈":
								this.depression_recommendation = this.$t("强烈建议咨询心理健康专业人士进行详细评估")
								break
						}
						//抑郁风险等级
						switch (ppgresultslist.data[0].depressionRiskLevel) {
							case "LOW_RISK":
								this.depression_risk_level = this.$t("较低风险")
								break
							case "MEDIUM_RISK":
								this.depression_risk_level = this.$t("中等风险")
								break
							case "HIGH_RISK":
								this.depression_risk_level = this.$t("较高风险")
								break
						}
						//数据充足性
						switch (ppgresultslist.data[0].dataSufficiency) {
							case "SUFFICIENT":
								this.data_sufficiency = this.$t("充足")
								break
							case "MODERATE":
								this.data_sufficiency = this.$t("适中")
								break
							case "INSUFFICIENT":
								this.data_sufficiency = this.$t("不足")
								break
						}
					}
				})
			},

			ppgresultslist4() {
				let ppgdata = {
					patientId: uni.getStorageSync("userid"),
					startTime: this.getCurrentTimePPG() + " 00:00:00",
					endTime: this.getCurrentTimePPG() + " 23:59:59",
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/ppgresults/get_result_list_by_patient_id",
					ppgdata, {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json;charset=UTF-8'
					}).then((ppgresultslist) => {
					if (ppgresultslist.code === 200 && ppgresultslist.data.length > 0) {
						let stress_Indexone
						for (let p = ppgresultslist.data.length - 1; p >= 0; p--) {
							stress_Indexone = ppgresultslist.data[p].stressIndex; //压力指数
						}
						if (stress_Indexone >= 5 && this.yalixueyatype) {
							uni.showModal({
								title: this.$t("提示"),
								content: this.$t("您的血压比平时高但您的心情指数显示拿您可能有点紧张"),
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										this.yalixueyatype = false
									}
								}
							});
						}
					}
				})
			},

			// 在你的方法中计算统计数据
			calculateDailyStats(dailyAverages) {
				// 1. 计算averageMoodIndex低于5的天数
				const lowMoodDays = dailyAverages.filter(item =>
					item.averageMoodIndex < 5
				).length;
				// 2. 计算同时满足averagestressIndex≥5和averagesumfatigueIndex≥5的天数
				const highStressFatigueDays = dailyAverages.filter(item =>
					item.averagestressIndex >= 5 || item.averagesumfatigueIndex >= 5
				).length;
				return {
					lowMoodDays,
					highStressFatigueDays
				};
			},

			types_change(e) {
				this.types_index = e.detail.value
				this.ppgresultslist(this.types_index)
				this.ppgresultslist2(this.types_index)
				this.ppgresultslist3(this.types_index)
				uni.setStorageSync("types_index", this.types_index)
			},

			toggleDebug() {
				this.showDebug = !this.showDebug;
			},
			onDrawComplete(info) {
				// 每100帧显示一次
				if (this.packetCount % 100 === 0) {
					console.log('🎨 绘制完成:', info);
				}
			},

			// 处理BPW1手表返回的血压，心率，血氧数据
			processSingleDataType(deviceId, deviceSn, serviceId, writeuuid) {
				let that = this;
				const allData = that.formatData(that.dataBuffer);
				const protocolData = that.parseProtocolData(allData);
				const heart = protocolData.Covmamlueand.slice(0, 8); // 头部4个字节
				const heartTime = heart.slice(0, 4); // 时间部分（2个字节）
				const {
					year,
					month,
					day,
					datealltime
				} = that.parseBinaryTime(heartTime);
				switch (protocolData.Protocolsubcommand) {
					case "00": // 心率
						that.hrResult = []
						// 执行解析
						const hrResultdata = Healthparser.parseProtocolData(protocolData);
						for (let i = 0; i < hrResultdata.data.records.length - 1; i++) {
							that.hrResult.push(hrResultdata.data.records[i])
						}
						console.log("心率历史数据", that.hrResult)
						const heartRateValue = that.parseHeartRateData(protocolData.Covmamlueand);
						let heartRateValuetime = that.datatime(datealltime + " " + heartRateValue.time)
						console.log("心率数据：", heartRateValue)
						console.log("心率数据未转时间戳", datealltime + " " + heartRateValue.time)
						console.log("心率数据", heartRateValuetime)
						if (heartRateValuetime !== uni.getStorageSync("heartRateDatatime") &&
							heartRateValuetime > uni.getStorageSync("heartRateDatatime")) {
							that.pulse = heartRateValue.diastolic
							that.xeuyabiaoshi = "1"
							uni.setStorageSync("heartRateDatatime", heartRateValuetime)
							uni.setStorageSync("pulse", heartRateValue.diastolic)
							that.jakoblife_fat_scale22(deviceId, "", "", heartRateValue.diastolic,
								deviceSn, heartRateValuetime);
						}
						that.sendack2(allData, deviceId, serviceId, writeuuid);
						that.resetDataState("心率");
						break;
					case "01": // 血压
						// 执行解析
						const bpResultdata = Healthparser.parseProtocolData(protocolData);
						that.bpResult = []
						for (let i = 0; i < bpResultdata.data.records.length - 1; i++) {
							that.bpResult.push(bpResultdata.data.records[i])
						}
						console.log("1=== 血压协议解析结果 ===", that.bpResult)
						that.get_finalRetVarList(deviceSn)
						const parseBloodData = that.parseHeartRateData(protocolData.Covmamlueand);
						let parseBloodValuetime = that.datatime(datealltime + " " + parseBloodData.time)
						console.log("血压数据", parseBloodData)
						console.log("血压数据未转时间戳", datealltime + " " + parseBloodData.time)
						console.log("血压数据", parseBloodValuetime)
						if (parseBloodValuetime !== uni.getStorageSync("parseBloodDatatime") &&
							parseBloodValuetime > uni.getStorageSync("parseBloodDatatime")) {
							uni.setStorageSync("parseBloodDatatime", parseBloodValuetime)
							that.lowPressure = that.Blood === "mmHg" ? parseBloodData.diastolic : (Number(parseBloodData
								.diastolic) * 0.133).toFixed(1);
							that.highPressure = that.Blood === "mmHg" ? parseBloodData.systolic : (Number(parseBloodData
								.systolic) * 0.133).toFixed(1);
							uni.setStorageSync("lowPressure", parseBloodData.diastolic)
							uni.setStorageSync("highPressure", parseBloodData.systolic)
							that.updateBloodPressureStatus(parseBloodData.diastolic, parseBloodData.systolic);
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										that.bgaaa(parseBloodData.diastolic, parseBloodData.systolic)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							that.xeuyabiaoshi = "1"
							setTimeout(() => {
								that.jakoblife_fat_scale22(
									deviceId,
									parseBloodData.systolic,
									parseBloodData.diastolic,
									that.pulse,
									deviceSn,
									parseBloodValuetime
								);
								const current1 = parseBloodData?.systolic;
								const average1 = that?.junzhi_SSY_b;
								const current2 = parseBloodData?.diastolic;
								const average2 = that?.junzhi_SZY_b;
								console.log("current1", current1)
								console.log("average1", average1)
								console.log("current2", current2)
								console.log("average2", average2)
								if (current1 != null && average1 != "NA" && current2 != null && average2 != "NA") {
									const diff1 = current1 - average1;
									const diff2 = current2 - average2;
									if (diff1 > 10 || diff2 > 10) { // 改为大于10
										// 收缩压偏离平均值超过10mmHg
										console.log(`血压异常波动：${diff1 > 0 ? '+' : ''}${diff1}`);
										console.log(`血压异常波动：${diff2 > 0 ? '+' : ''}${diff2}`);
										if (uni.getStorageSync("yaliswitchHER") === true) {
											that.sleep_alertdisabled = true
											//血压测完等待5秒立即测心率情绪
											setTimeout(() => {
												that.yalixueyatype = true
												that.sendstartheartwatch(that.writeuuid, 1)
												that.sleep_alertid = 1
											}, 3000)
										}
									} else {
										console.log(`2血压异常波动：${diff1 > 0 ? '+' : ''}${diff1}`);
										console.log(`2血压异常波动：${diff2 > 0 ? '+' : ''}${diff2}`);
										that.yalixueyatype = false
									}
								}
							}, 1000)
						}
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType === 'none') {} else {
									that.mergeAndUploadWithDeduplication(deviceId, deviceSn, that.hrResult,
										that.bpResult)
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
						that.sendack2(that.formatData(that.dataBuffer), deviceId, serviceId, that.writeuuid);
						that.resetDataState("血压")
						break
					case "02": // 血氧
						const oxygenValue = that.parseOxygenData(protocolData.Covmamlueand);
						let oxygenValuetime = that.datatime(datealltime + " " + oxygenValue.time)
						console.log("血氧数据：", oxygenValue)
						console.log("血氧数据未转时间戳", datealltime + " " + oxygenValue.time)
						console.log("血氧数据", oxygenValuetime)
						if (oxygenValuetime !== uni.getStorageSync("oxygenDatatime") &&
							oxygenValuetime > uni.getStorageSync("oxygenDatatime")) {
							uni.setStorageSync("oxygenDatatime", oxygenValuetime)
							that.storeOxygenData(oxygenValue);
							that.jakoblife_fat_scale3(deviceId, oxygenValue.diastolic, deviceSn, "血氧", oxygenValuetime);
						}
						that.sendack2(allData, deviceId, serviceId, writeuuid);
						that.resetDataState("血氧");
						break;
					case "19":
						const pulValue19 = that.parseHeartRateData(protocolData.Covmamlueand);
						let pulValue19time = that.datatime(datealltime + " " + pulValue19.time)
						console.log("血压和心率数据", pulValue19)
						console.log("血压和心率数据未转时间戳", datealltime + " " + pulValue19.time)
						console.log("血压和心率数据", pulValue19time)
						that.lowPressure = that.Blood === "mmHg" ? pulValue19.diastolic : (Number(pulValue19
							.diastolic) * 0.133).toFixed(1);
						that.highPressure = that.Blood === "mmHg" ? pulValue19.systolic : (Number(pulValue19
								.systolic) * 0.133)
							.toFixed(1);
						that.pulse = pulValue19.bloodPressureType;
						uni.setStorageSync("lowPressure", pulValue19.diastolic)
						uni.setStorageSync("highPressure", pulValue19.systolic)
						uni.setStorageSync("pulse", pulValue19.bloodPressureType)
						that.updateBloodPressureStatus(pulValue19.diastolic, pulValue19.systolic);
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType === 'none') {
									if (uni.getStorageSync("hearttime") !== pulValue19.time) {
										that.bgaaa(pulValue19.diastolic, pulValue19.systolic)
									}
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
						that.xeuyabiaoshi = "1"
						if (pulValue19time !== uni.getStorageSync("parseBloodDatatime") &&
							pulValue19time > uni.getStorageSync("parseBloodDatatime")) {
							uni.setStorageSync("parseBloodDatatime", pulValue19time)
							that.jakoblife_fat_scale22(
								deviceId,
								pulValue19.systolic,
								pulValue19.diastolic,
								pulValue19.bloodPressureType,
								deviceSn,
								pulValue19time
							);
						}
						that.sendack2(allData, deviceId, serviceId, writeuuid);
						that.resetDataState("血压和心率");
						break
				}
				// 重置状态
				that.blewatch_id2 = "1"
				that.resetDataState("8");
			},
			// 数据去重上传方法
			mergeAndUploadWithDeduplication(deviceId, deviceSn, localHrRecords, localBpRecords) {
				const that = this;
				console.log(" that.boolserverData", that.boolserverData)
				const serverData = that.boolserverData
				console.log(serverData)
				// 从服务端数据中提取已有的时间集合
				const existingTimes = new Set();
				if (serverData && serverData.data && serverData.data.length > 0) {
					serverData.data.forEach(item => {
						if (item.object && item.object.details) {
							item.object.details.forEach(detail => {
								// 使用 date + time 作为唯一标识
								const key = `${item.dateTime} ${detail.time}`;
								existingTimes.add(key);
							});
						}
					});
				}
				console.log('服务端已有时间:', existingTimes);
				// 创建心率映射
				const hrMap = new Map();
				localHrRecords.forEach(hr => {
					const key = `${hr.date} ${hr.time}`;
					hrMap.set(key, hr);
				});

				// 记录已匹配的心率
				const matchedHrKeys = new Set();

				// 遍历血压记录，匹配心率并去重
				localBpRecords.forEach(bp => {
					const key = `${bp.date} ${bp.time}`;

					// 检查是否已存在
					if (existingTimes.has(key)) {
						// console.log('血压已存在，跳过:', key);
						return; // 跳过已存在的数据
					}

					const matchedHr = hrMap.get(key);
					if (matchedHr) {
						matchedHrKeys.add(key);
						console.log('上传血压+心率:', key, {
							bp: `${bp.highPressure}/${bp.lowPressure}`,
							hr: matchedHr.heartRate
						});
						that.jakoblife_fat_scale22list(
							deviceId,
							bp.highPressure,
							bp.lowPressure,
							matchedHr.heartRate, // 匹配的心率
							deviceSn,
							that.datatime(key)
						);
					} else {
						console.log('上传血压（无匹配心率）:', key);
						that.jakoblife_fat_scale22list(
							deviceId,
							bp.highPressure,
							bp.lowPressure,
							that.pulse, // 无匹配心率
							deviceSn,
							that.datatime(key)
						);
					}
				});

				// 处理多余的心率数据（未匹配血压且服务端不存在的）
				localHrRecords.forEach(hr => {
					const key = `${hr.date} ${hr.time}`;
					// 未匹配血压 且 服务端不存在
					if (!matchedHrKeys.has(key) && !existingTimes.has(key)) {
						console.log('上传多余心率:', key, hr.heartRate);
						that.jakoblife_fat_scale22list(
							deviceId,
							'', // 无高压
							'', // 无低压
							hr.heartRate, // 只有心率
							deviceSn,
							that.datatime(key)
						);
					} else if (existingTimes.has(key)) {
						// console.log('心率已存在，跳过:', key);
					}
				});
			},
			// 血压数据查询
			queryBloodPressureData(deviceSn) {
				let data = {
					deviceSn,
					dataType: "pressure",
					slaveList: [{
							slaveSn: "0",
							register: "highPressure"
						},
						{
							slaveSn: "0",
							register: "lowPressure"
						},
						{
							slaveSn: "0",
							register: "heartrate"
						}
					],
					startTime: this.currentDatehis + " 00:00:00",
					endTime: this.currentDatehis + " 23:59:59",
				};
				// console.log("res.data血压数据查询传参：", data)
				this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((queryBloodPressureDatares) => {
					// console.log("queryBloodPressureDatares：", queryBloodPressureDatares)
					if (queryBloodPressureDatares.code === 200) {
						this.boolserverData = queryBloodPressureDatares
					}
				})
			},
			getCurrentTimebool() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} 00:00:00`;
			},
			//血压指标最终表查询
			get_finalRetVarList(deviceSn) {
				let that = this
				let data = {
					deviceSn: deviceSn,
					profDate: that.getCurrentTimebool(),
					period: "3D",
					retVarList: that.finlretVarList1.toLowerCase()
				}
				console.log("1血压指标最终表查询", data)
				that.$post(that.$url_APP_IP + "/prod-api/device_app/get_finalRetVarList", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then((get_finalRetVarList) => {
					console.log("2血压指标最终表查询", get_finalRetVarList)
					if (get_finalRetVarList.code === 200) {
						if (get_finalRetVarList.data.retVarList !== "") {
							let resultArray = get_finalRetVarList.data.retVarList.split(";");
							const checkAndAssign = (value) => {
								return value === "999999998.00" || value === "999999999.00" ? "NA" : value;
							};
							for (let i = 0; i < resultArray.length; i++) {
								let resultArray1 = resultArray[i].split(",");
								// 均值
								that.junzhi_SSY_b = checkAndAssign(resultArray1[7]);
								that.junzhi_SZY_b = checkAndAssign(resultArray1[8]);
								that.junzhi_pulse_b = checkAndAssign(resultArray1[9]);
							}
						}
					}
				})
			},
			// 处理CMD00命令
			async handleCMD00(hexData, deviceId, serviceId) {
				let that = this
				setTimeout(() => {
					that.calculateChecksumsss(hexData, deviceId, serviceId, that.writeuuid);
				}, 3000)
				that.resetDataState("1");
			},
			// 处理CMD04命令（步数）
			async handleCMD04(hexData, deviceId, serviceId, deviceSn) {
				let that = this
				await that.sendack2(hexData, deviceId, serviceId, that.writeuuid);
				const step = hexData.slice(18, 26); // 步数数据位置
				const stepCount = parseInt(step, 16);
				uni.setStorageSync("settept1", stepCount);
				await that.jakoblife_fat_scale3(deviceId, stepCount, deviceSn, "步数", "");
				that.resetDataState("7");
			},

			async handleCMD0401(hexData, deviceId, serviceId, deviceSn) {
				let that = this
				const key = hexData.slice(12, 14);
				const lengthHex = hexData.slice(2, 6);
				const dataLength = parseInt(lengthHex, 16) + 4;
				// 根据子命令类型计算分包数量
				switch (key) {
					case "01": // 睡眠01数据
						that.sleeppack = that.calculateQuotient(dataLength, 80);
						break;
				}
			},
			// 处理CMD01命令
			async handleCMD01(hexData, deviceId, serviceId, deviceSn) {
				let that = this
				const key = hexData.slice(12, 14);
				const lengthHex = hexData.slice(2, 6);
				const dataLength = parseInt(lengthHex, 16) + 4;
				// 根据子命令类型计算分包数量
				switch (key) {
					case "10": // 睡眠
						that.quotient2 = that.calculateQuotient(dataLength, 80);
						break;
				}
			},
			// 处理CMD03命令
			async handleCMD03(hexData, deviceId, serviceId, writeuuid, deviceSn) {
				const that = this
				const subCmd = hexData.slice(12, 14);
				const lengthHex = hexData.slice(2, 6);
				const dataLength = parseInt(lengthHex, 16);
				const fullPacketLength = dataLength + 4;
				// 根据子命令类型计算分包数量
				switch (subCmd) {
					case "19": // 血压
					case "00": // 心率
						that.xinlvpack = that.calculateQuotient(fullPacketLength, 80);
						break;
					case "01": // 血压
						that.xeuyapack = that.calculateQuotient(fullPacketLength, 80);
						break;
					case "02": // 血氧
						that.xueyangpack = that.calculateQuotient(fullPacketLength, 80);
						break;
					case "1d": //ACC和PPG数据处理5.8.2版本
						// case "25"://ACC和PPG数据处理5.8.5版本
						clearInterval(that.watchtimer);
						that.watchtimer = null
						const ACCPPG = hexData.slice(hexData.length - 12, hexData.length)
						const heartTime = ACCPPG.slice(0, 4); // 时间部分（2个字节）
						const {
							year,
							month,
							day
						} = that.parseBinaryTime(heartTime);
						that.PPGdataarray = ACCPPG.slice(4, 6)
						const ACCdataarrayall = ACCPPG.slice(6, 8)
						const PPGdataarrayall = ACCPPG.slice(8, 10)
						const Status = ACCPPG.slice(10, ACCPPG.length)
						const parsePPGConfigdata = that.parsePPGConfigDescOrder(that.PPGdataarray)
						const dataall = {
							hexData: 'hexData' + hexData,
							ACCPPG: 'ACCPPG' + ACCPPG,
							date: "日期" + `${year}年${month}月${day}日`,
							PPGdataarray: 'PPG数据项定义:' + that.PPGdataarray,
							ACCdataarrayall: 'ACC数据总组数:' + ACCdataarrayall,
							PPGdataarrayall: 'PPG数据总组数:' + PPGdataarrayall,
							Status: '传输状态:' + Status,
							parsePPGConfigdata: '解析PPG数据配置字节:' + JSON.stringify(parsePPGConfigdata)
						}
						console.log("dataall", dataall)
						if (that.watchtimer2) {
							clearInterval(that.watchtimer2);
							that.watchtimer2 = null;
						}
						let watchtime2 = 50
						that.watchtimer2 = setInterval(() => {
							watchtime2--;
							if (watchtime2 <= 0) {
								clearInterval(that.watchtimer2);
								that.watchtimer2 = null;
								that.sleep_alertdisabled = false
								uni.hideLoading();
								that.resetDataState("6");
							}
						}, 1000)
						switch (Status) {
							case "01":
								that.bufferPPG = []
								clearInterval(that.watchtimer);
								that.watchtimer = null
								if (that.sleep_alertid === 1 || uni.getStorageSync("sendwatch") === 1) {
									setTimeout(() => {
										that.sendack(hexData, deviceId, serviceId, writeuuid);
									}, 500)
								}
								that.sleep_alertid = 0
								that.resetDataState("5");
								break
							case "02":
								uni.hideLoading()
								clearInterval(that.watchtimer);
								that.watchtimer = null
								clearInterval(that.watchtimer2);
								that.watchtimer2 = null;
								that.sleep_alertid = 0
								const binary = that.packInt16(that.bufferPPG)
								that.ppgdata(binary, deviceSn)
								that.bufferPPG = []
								setTimeout(() => {
									that.sendack(hexData, deviceId, serviceId, writeuuid);
								}, 500)
								that.resetDataState("4");
								break
						}
						break
					case "1e":
						that.quotientACC = that.calculateQuotient(fullPacketLength, 80);
						break
					case "1f":
						that.quotientPPG = that.calculateQuotient(fullPacketLength, 80);
						break

				}
			},

			arrayBufferToHex(buffer) {
				const uint8Array = new Uint8Array(buffer)
				return Array.from(uint8Array)
					.map(b => b.toString(16).padStart(2, '0'))
					.join('')
			},

			bufferToHex(buffer) {
				const uint8 = new Uint8Array(buffer);
				let hex = '';
				for (let i = 0; i < uint8.length; i++) {
					const h = uint8[i].toString(16).padStart(2, '0');
					hex += h;
				}
				return hex;
			},

			intToHex(num, prefix = false, padLength = 0) {
				let hex = num.toString(16).toUpperCase();
				if (padLength > 0) {
					hex = hex.padStart(padLength, '');
				}
				return prefix ? hex : hex;
			},

			packInt16(arr) {
				let signalMin = Math.min(...arr);
				let signalMax = Math.max(...arr);
				let voltageRange = Math.max(Math.abs(signalMin), Math.abs(signalMax)) * 1.2;
				// 动态缩放比例
				const scale = 32767 / voltageRange;
				const n = arr.length;
				const ab = new ArrayBuffer(n * 2);
				const view = new DataView(ab);
				let int_data = [];
				let conversionLog = [];
				for (let i = 0; i < n; i++) {
					let original = arr[i];
					let scaled = original * scale;
					let int16 = Math.round(scaled);
					// 记录前20个点的转换过程
					if (i < 20) {
						conversionLog.push({
							index: i,
							original: original,
							scaled: scaled,
							int16: int16
						});
					}
					view.setInt16(i * 2, int16, true);
					int_data.push(int16);
					// 检查溢出（应该不会发生，因为有20%余量）
					if (int16 < -32768 || int16 > 32767) {
						console.warn("   索引", i, "溢出! 值:", int16);
					}
				}
				let resultMin = Math.min(...int_data);
				let resultMax = Math.max(...int_data);
				// 检查原始数据中的极值点
				let maxIndex = arr.indexOf(signalMax);
				let minIndex = arr.indexOf(signalMin);
				// 随机抽取5个点验证反向计算
				for (let j = 0; j < 5; j++) {
					let randomIndex = Math.floor(Math.random() * n);
					let originalVal = arr[randomIndex];
					let convertedVal = int_data[randomIndex];
					let reconstructed = convertedVal / scale;
					let error = Math.abs(originalVal - reconstructed);
				}
				let base64 = uni.arrayBufferToBase64(ab);
				return base64;
			},

			parseHexToInt16(hexStr) {
				const bytes = hexStr.split(' ').map(h => parseInt(h, 16));
				const results = [];

				for (let i = 0; i < bytes.length; i += 2) {
					if (i + 1 < bytes.length) {
						// 小端序：低位字节在前
						const int16 = (bytes[i + 1] << 8) | bytes[i];
						// 转换为有符号int16
						const signedInt16 = int16 > 32767 ? int16 - 65536 : int16;
						results.push(signedInt16);
					}
				}

				return results;
			},




			parsePPGConfigDescOrder(configByte) {
				const byte = Number(configByte);
				// 二进制字符串
				const binaryStr = byte.toString(2).padStart(8, '0');
				const bits = binaryStr.split('').map(b => parseInt(b));
				return {
					reservedBits: binaryStr.slice(0, 4),
					// 环境光线强度值 - bit3（二进制第5位）
					hasAmbientLight: bits[4],
					// 红外光值 - bit2（二进制第6位）
					hasInfraredLight: bits[5],
					// 红光值 - bit1（二进制第7位）
					hasRedLight: bits[6],
					// 绿光值 - bit0（二进制第8位）
					hasGreenLight: bits[7],
					// 原始信息
					rawByte: byte,
					hexString: '0x' + byte.toString(16).padStart(2, '0').toUpperCase(),
					binaryString: binaryStr,
					bitArray: bits
				};
			},

			// 根据包头分离数据包
			splitPacketsByHeader() {
				const bpPackets = []; // 血压数据包
				const hrPackets = []; // 心率数据包
				let currentTarget = bpPackets;
				this.dataBuffer.forEach(packet => {
					// 遇到新的e0包头，切换到另一个数据集
					if (packet.startsWith('e0') &&
						(bpPackets.length > 0 || hrPackets.length > 0)) {
						currentTarget = currentTarget === bpPackets ? hrPackets :
							bpPackets;
					}
					currentTarget.push(packet);
				});
				return [bpPackets, hrPackets];
			},
			// 存储血氧数据
			storeOxygenData(value) {
				const now = new Date();
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const day = String(now.getDate()).padStart(2, '0');
				uni.setStorageSync("xueyang", value);
				uni.setStorageSync("xueyangtimes", `${month}/${day}`);
				this.list_recipe();
			},
			// 解析血氧数据
			parseOxygenData(stringdata) {
				const that = this
				const hexData = stringdata.slice(stringdata.length - 16, stringdata.length); // 最后8个字节
				const secondsHex = hexData.substring(0, 8); // 秒（4 字节）
				const bloodPressureTypeHex = hexData.substring(8, 10); // 心率值类型（1 字节）
				const reservedHex = hexData.substring(10, 12); // 预留（1 字节）
				const systolicHex = hexData.substring(12, 14); // 预留（1 字节）
				const diastolicHex = hexData.substring(14, 16); // 心率值（1 字节）
				const seconds = parseInt(secondsHex, 16);
				const bloodPressureType = parseInt(bloodPressureTypeHex, 16);
				const reserved = parseInt(reservedHex, 16);
				const systolic = parseInt(systolicHex, 16);
				const diastolic = parseInt(diastolicHex, 16);
				return {
					time: that.formatTime(seconds),
					bloodPressureType,
					reserved,
					systolic,
					diastolic
				};
			},
			// 辅助方法：计算分包数量
			calculateQuotient(totalLength, packetSize) {
				return Math.ceil(totalLength / packetSize);
			},
			// ArrayBuffer转十六进制字符串
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},
			ab2str(buf) {
				return String.fromCharCode.apply(null, new Uint8Array(buf));
			},
			// 十六进制转ASCII
			hexToAscii(hex) {
				let str = '';
				for (let i = 0; i < hex.length; i += 2) {
					str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
				}
				return str;
			},
			async sendack(dataList, deviceId, serviceId, writeuuid) {
				let that = this
				that.dataBuffer = [];
				that.xeuyapack = 0;
				that.xinlvpack = 0;
				that.xueyangpack = 0;
				that.quotient2 = 0;
				that.sleeppack = 0;
				that.quotientACC = 0;
				that.quotientPPG = 0;
				const hexString = dataList
				// 将十六进制字符串转换为字节数组
				const bytes = [];
				for (let i = 0; i < hexString.length; i += 2) {
					bytes.push(parseInt(hexString.substring(i, i + 2), 16));
				}
				// 协议格式解析
				const protocolMarker = bytes[0]; // 协议标识位
				const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
				const protocolChecksum = bytes[3]; // 协议校准位
				const protocolCommand = bytes[4]; // 协议命令
				const protocolVersion = bytes[5]; // 协议版本号
				const protocolSubcommand = bytes[6]; // 协议子命令
				const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
				const commandValue = bytes.slice(9); // 命令指令值
				// 计算字节和（除去协议校准位）
				let sumBytes = 0;
				for (let i = 0; i < bytes.length; i++) {
					if (i !== 3) { // 跳过校准位
						sumBytes += bytes[i];
					}
				}
				const calculatedChecksum = sumBytes % 256; // 取低8位	
				if (calculatedChecksum === protocolChecksum) {
					// 假设以下变量已经定义
					const ACK_RESPONSE_HEADER = 0x0E; // 示例值
					const commandId =
						`0x${protocolCommand.toString(16).padStart(2, '0')}`; // 示例值
					const commandKey =
						`0x${protocolSubcommand.toString(16).padStart(2, '0')}`; // 示例值
					const BleDeviceConfig = {
						PROTOCOL_VERSION: `0x${protocolVersion.toString(16).padStart(2, '0')}` // 示例协议版本
					};
					const code = 0x00; // 示例 code 值
					const ackConfigByte = new Uint8Array(9);
					ackConfigByte[0] = ACK_RESPONSE_HEADER;
					ackConfigByte[1] = 0x00;
					ackConfigByte[2] = 0x06;
					ackConfigByte[3] = commandId;
					ackConfigByte[4] = BleDeviceConfig.PROTOCOL_VERSION;
					ackConfigByte[5] = commandKey;
					ackConfigByte[6] = 0x00;
					ackConfigByte[7] = 0x01;
					ackConfigByte[8] = code;
					let ackConfigBytesum = 0;
					for (let i = 0; i < ackConfigByte.length -
						1; i++) { // 遍历 command 数组的前 command.length - 1 个元素
						ackConfigBytesum += ackConfigByte[i]; // 累加每个元素的值
					}
					ackConfigBytesum = ackConfigBytesum % 256; // 取模 256，得到低 8 位的和
					// 创建新的数组，将校验和插入到第四个字节中
					const modifiedCommand = new Uint8Array(ackConfigByte.length +
						1); // 第四个字节的插入，数组长度加1
					modifiedCommand.set(ackConfigByte.subarray(0, 3), 0);
					modifiedCommand[3] = ackConfigBytesum;
					modifiedCommand.set(ackConfigByte.subarray(3), 4);
					const hexCommand = Array.from(modifiedCommand).map(byte => byte
						.toString(16).padStart(2, '0')).join('');
					const buffer = that.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						value: buffer,
						complete(complete) {
							// console.log("回复ack", hexCommand)
						},
					})
				}
			},
			async sendack2(dataList, deviceId, serviceId, writeuuid) {
				let that = this
				const hexString = dataList
				// 将十六进制字符串转换为字节数组
				const bytes = [];
				for (let i = 0; i < hexString.length; i += 2) {
					bytes.push(parseInt(hexString.substring(i, i + 2), 16));
				}
				// 协议格式解析
				const protocolMarker = bytes[0]; // 协议标识位
				const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
				const protocolChecksum = bytes[3]; // 协议校准位
				const protocolCommand = bytes[4]; // 协议命令
				const protocolVersion = bytes[5]; // 协议版本号
				const protocolSubcommand = bytes[6]; // 协议子命令
				const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
				const commandValue = bytes.slice(9); // 命令指令值
				// 计算字节和（除去协议校准位）
				let sumBytes = 0;
				for (let i = 0; i < bytes.length; i++) {
					if (i !== 3) { // 跳过校准位
						sumBytes += bytes[i];
					}
				}
				const calculatedChecksum = sumBytes % 256; // 取低8位	
				if (calculatedChecksum === protocolChecksum) {
					// 假设以下变量已经定义
					const ACK_RESPONSE_HEADER = 0x0E; // 示例值
					const commandId =
						`0x${protocolCommand.toString(16).padStart(2, '0')}`; // 示例值
					const commandKey =
						`0x${protocolSubcommand.toString(16).padStart(2, '0')}`; // 示例值
					const BleDeviceConfig = {
						PROTOCOL_VERSION: `0x${protocolVersion.toString(16).padStart(2, '0')}` // 示例协议版本
					};
					const code = 0x00; // 示例 code 值
					const ackConfigByte = new Uint8Array(9);
					ackConfigByte[0] = ACK_RESPONSE_HEADER;
					ackConfigByte[1] = 0x00;
					ackConfigByte[2] = 0x06;
					ackConfigByte[3] = commandId;
					ackConfigByte[4] = BleDeviceConfig.PROTOCOL_VERSION;
					ackConfigByte[5] = commandKey;
					ackConfigByte[6] = 0x00;
					ackConfigByte[7] = 0x01;
					ackConfigByte[8] = code;
					let ackConfigBytesum = 0;
					for (let i = 0; i < ackConfigByte.length -
						1; i++) { // 遍历 command 数组的前 command.length - 1 个元素
						ackConfigBytesum += ackConfigByte[i]; // 累加每个元素的值
					}
					ackConfigBytesum = ackConfigBytesum % 256; // 取模 256，得到低 8 位的和
					// 创建新的数组，将校验和插入到第四个字节中
					const modifiedCommand = new Uint8Array(ackConfigByte.length +
						1); // 第四个字节的插入，数组长度加1
					modifiedCommand.set(ackConfigByte.subarray(0, 3), 0);
					modifiedCommand[3] = ackConfigBytesum;
					modifiedCommand.set(ackConfigByte.subarray(3), 4);
					const hexCommand = Array.from(modifiedCommand).map(byte => byte
						.toString(16).padStart(2, '0')).join('');
					const buffer = that.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						value: buffer,
						complete(complete) {
							// console.log("2回复ack：" + complete.code + "｜" + JSON.stringify(complete), hexCommand)
						},
					})
				}
			},

			calculateQuotient(bufferSize, chunkSize) {
				return Math.ceil(bufferSize / chunkSize);
			},
			// 提取数据格式化函数
			formatData(dataArray) {
				return dataArray.map(item => item.replace(/[""]/g, "")).join("");
			},

			// 提取二进制时间解析函数
			parseBinaryTime(hexTime) {
				const binaryTime = this.hexToBinary(hexTime);
				const year = parseInt(binaryTime.slice(1, 7), 2) + 2000;
				const month = String(parseInt(binaryTime.slice(7, 11), 2)).padStart(2, '0');
				const day = String(parseInt(binaryTime.slice(11), 2)).padStart(2, '0');
				const datealltime = `${year}-${month}-${day}`
				return {
					year,
					month,
					day,
					datealltime
				};
			},
			// 提取时间格式化函数
			formatTime(seconds) {
				const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
				const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
				const secs = String(seconds % 60).padStart(2, '0');
				return `${hours}:${minutes}:${secs}`;
			},
			// 提取血压数据解析函数
			parseBloodPressureData(stringdata) {
				let that = this
				const Covmamlueand = stringdata.slice(18, stringdata.length);
				const data = stringdata.slice(stringdata.length - 16, stringdata
					.length);
				const secondsHex = data.substring(0, 8); // 秒（4 字节）
				const bloodPressureTypeHex = data.substring(8, 10); // 血压类型（1 字节）
				const reservedHex = data.substring(10, 12); // 预留（1 字节）
				const systolicHex = data.substring(12, 14); // 高压值（1 字节）
				const diastolicHex = data.substring(14, 16); // 低压值（1 字节）
				const seconds = parseInt(secondsHex, 16);
				const bloodPressureType = parseInt(bloodPressureTypeHex, 16);
				const reserved = parseInt(reservedHex, 16);
				const systolic = parseInt(systolicHex, 16);
				const diastolic = parseInt(diastolicHex, 16);
				const time = that.formatTime(seconds);
				return {
					systolic,
					diastolic
				};
				that.resetDataState("37");
			},

			// 提取心率数据解析函数
			parseHeartRateData(stringdata) {
				let that = this
				const Covmamlueand = stringdata.slice(18, stringdata.length);
				const hexData = stringdata.slice(stringdata.length - 16, stringdata
					.length);
				const secondsHex = hexData.substring(0, 8); // 秒（4 字节）
				const bloodPressureTypeHex = hexData.substring(8, 10); // 心率值类型（1 字节）
				const reservedHex = hexData.substring(10, 12); // 预留（1 字节）
				const systolicHex = hexData.substring(12, 14); // 预留（1 字节）
				const diastolicHex = hexData.substring(14, 16); // 心率值（1 字节）
				const seconds = parseInt(secondsHex, 16);
				const bloodPressureType = parseInt(bloodPressureTypeHex, 16);
				const reserved = parseInt(reservedHex, 16);
				const systolic = parseInt(systolicHex, 16);
				const diastolic = parseInt(diastolicHex, 16);
				return {
					time: that.formatTime(seconds),
					bloodPressureType,
					reserved,
					systolic,
					diastolic
				};
				that.resetDataState("36");
			},

			// 辅助函数：解析数值
			parseValue(hexValue) {
				return parseInt(hexValue, 16);
			},
			// 提取协议解析函数
			parseProtocolData(alltypearray) {
				const Protocollength = alltypearray.slice(2, 6); // 协议长度 2个byte
				const Protocolcalibrationposition = alltypearray.slice(6, 8);
				const Protocolcommand = alltypearray.slice(8, 10); // 协议命令 1个byte
				const Versionprotocol = alltypearray.slice(10, 12); // 协议版本号 1个byte
				const Protocolsubcommand = alltypearray.slice(12, 14); // 协议子命令 1个byte
				const Commandlinelength = alltypearray.slice(14, 18); // 命令指令长度 2个byte
				const Covmamlueand = alltypearray.slice(18, alltypearray
					.length); // 命令指令值 1~503Byte
				return {
					Protocollength,
					Protocolcalibrationposition,
					Protocolcommand,
					Versionprotocol,
					Protocolsubcommand,
					Commandlinelength,
					Covmamlueand
				};
			},

			// 定义一个函数来计算校验和
			calculateChecksumsss(hexString, deviceId, serviceId, writeuuid) {
				let that = this
				// 将十六进制字符串转换为字节数组
				const bytes = [];
				for (let i = 0; i < hexString.length; i += 2) {
					bytes.push(parseInt(hexString.substring(i, i + 2), 16));
				}
				// 协议格式解析
				const protocolMarker = bytes[0]; // 协议标识位
				const protocolLength = bytes[1] * 256 + bytes[2]; // 协议长度（2字节）
				const protocolChecksum = bytes[3]; // 协议校准位
				const protocolCommand = bytes[4]; // 协议命令
				const protocolVersion = bytes[5]; // 协议版本号
				const protocolSubcommand = bytes[6]; // 协议子命令
				const commandLength = bytes[7] * 256 + bytes[8]; // 命令指令长度（2字节）
				const commandValue = bytes.slice(9); // 命令指令值
				// 计算字节和（除去协议校准位）
				let sumBytes = 0;
				for (let i = 0; i < bytes.length; i++) {
					if (i !== 3) { // 跳过校准位
						sumBytes += bytes[i];
					}
				}
				const calculatedChecksum = sumBytes % 256; // 取低8位
				const ACK_HEADER = 0xe0 // 示例值
				const commandId = 0x02 // 示例值
				const commandKey = 0x08 // 示例值
				const BleDeviceConfig = {
					PROTOCOL_VERSION: 0x01 // 示例协议版本
				};
				// 获取当前时间
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth() + 1; // getMonth() 返回的是 0-11，需要加 1
				const day = now.getDate();
				const hour = now.getHours();
				const minutes = now.getMinutes();
				const seconds = now.getSeconds();
				// 创建一个 4 字节的数组
				const bytes1 = new Uint8Array(4);
				// 按照 Java 代码中的逻辑进行位运算
				bytes1[0] = (((year - 2000) << 2) + ((month & 0xFF) >> 2)) & 0xFF;
				bytes1[1] = (((month & 0x03) << 6) + (day << 1) + (hour >> 4)) & 0xFF;
				bytes1[2] = (((hour & 0x0F) << 4) + (minutes >> 2)) & 0xFF;
				bytes1[3] = (((minutes & 0x03) << 6) + seconds) & 0xFF;
				const dataLen = bytes1.length;
				// 创建一个 dataLen + 8 字节的数组
				const command = new Uint8Array(dataLen + 8);
				// 按照 Java 代码中的逻辑填充数组
				command[0] = ACK_HEADER;
				command[1] = ((5 + dataLen) >> 8) & 0xFF;
				command[2] = (5 + dataLen) & 0xFF;
				command[3] = commandId;
				command[4] = BleDeviceConfig.PROTOCOL_VERSION;
				command[5] = commandKey;
				command[6] = (dataLen >> 8) & 0xFF;
				command[7] = dataLen & 0xFF;
				command.set(bytes1, 8);
				const hexCommand1 = Array.from(command).map(byte => byte.toString(16)
					.padStart(
						2, '0')).join(
					'');
				// 将字符串转换为字节数组
				const bytesnew = new Uint8Array(hexCommand1.match(/../g).map(byte =>
					parseInt(
						byte, 16)));
				// 将每个字节转换为 0x00 格式的字符串
				const formattedBytes = Array.from(bytesnew).map(byte =>
					`0x${byte.toString(16).padStart(2, '0')}`);
				// 将十六进制字符串转换为十进制数值
				const bytes333 = formattedBytes.map(byte => parseInt(byte, 16));
				// 计算累加和
				let sum = 0;
				for (let i = 0; i < bytes333.length; i++) {
					sum += bytes333[i];
				}
				// 取模 256，得到低 8 位的和
				sum = sum % 256;
				const modifiedCommand = new Uint8Array(command.length +
					1); // 第四个字节的插入，数组长度加1
				modifiedCommand.set(command.subarray(0, 3), 0);
				modifiedCommand[3] = sum;
				modifiedCommand.set(command.subarray(3), 4);
				// 将整个命令数组转换为16进制字符串
				const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(
							16)
						.padStart(2, '0'))
					.join('');
				const buffer = that.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: writeuuid,
					writeType: "write",
					value: buffer,
					complete(res) {
						console.log("时间发送命令", hexCommand)
						that.dataBuffer = []
						that.getsetp(deviceId, serviceId, writeuuid,
							BleDeviceConfig.PROTOCOL_VERSION)
					}
				})
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						writeType: 'write',
						value: that.toArrayBuffer('e00006eb010101000101'),
						complete(complete) {
							if (complete.code === 10007) {
								that.blewatch_id = "1"
								that.blewatch_id2 = "0"
								console.log(
									"发送同步所有数据命令：e00006eb010101000101"
								)
								uni.getNetworkType({
									success: function(res) {
										if (res.networkType === 'none') {} else {
											that.getLocalWeather(deviceId, serviceId,
												writeuuid)
										}
									},
									fail: function(err) {
										console.error('获取网络类型失败：', err);
									}
								});

							} else {
								uni.getNetworkType({
									success: function(res) {
										if (res.networkType === 'none') {} else {
											that.getLocalWeather(deviceId, serviceId,
												writeuuid)
										}
									},
									fail: function(err) {
										console.error('获取网络类型失败：', err);
									}
								});
								that.blewatch_id = "0"
							}
						}
					})
				}, 5000)
			},


			// 获取本地天气
			async getLocalWeather(deviceId, serviceId, writeuuid) {
				try {
					const result = await getGlobalLocalWeather();
					// console.log('开始获取本地天气', result);
					if (result.success) {
						this.weatherData = result.data;
						this.fromCache = result.fromCache || false;
						// console.log('开始获取本地天气', this.weatherData);
						// 尝试获取分钟级降水
						if (this.weatherData && this.weatherData.location) {
							const {
								lat,
								lon
							} = this.weatherData.location;
							try {
								const rainData = await getMinutelyRain(lat, lon);
								this.minutelyRain = rainData;
							} catch (rainError) {
								console.log('分钟级降水获取失败:', rainError);
							}
						}
						// console.log('开始测试生成命令');
						//7天天气命令
						const encoder = new WeatherForecastEncoder();
						const protocolData = encoder.encodeFromWeatherData(this.weatherData, {
							cmd: 0x05,
							version: 0x01,
							key: 0x01
						});
						this.weatherDataID7 = encoder.getHexString()
						console.log('this.weatherDataID7:', this.weatherDataID7);
						// 当天天气命令
						const buffer = protocolHelper.buildCurrentWeatherCommand(
							this.weatherData,
							this.weatherData.location
						);
						if (buffer) {
							const bytes = new Uint8Array(buffer);
							this.weatherDataID = protocolHelper.bytesToHex(bytes)
							console.log('✅ this.weatherDataID:', this.weatherDataID);
							setTimeout(() => {
								this.weather(deviceId, serviceId, writeuuid)
							}, 1000)
						} else {
							console.error('❌ 测试生成失败');
						}
					} else {
						// uni.showToast({
						// 	title: this.$t("失败"),
						// 	icon: 'none'
						// });
					}
				} catch (e) {
					console.error('本地天气错误:', e);
					// uni.showToast({
					// 	title: this.$t("失败"),
					// 	icon: 'none'
					// });
				} finally {}
			},

			weather(deviceId, serviceId, writeuuid) {
				let that = this
				const buffer2 = that.toArrayBuffer(that.weatherDataID); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							if (complete.code === 10007) {
								that.weather7(deviceId, serviceId, writeuuid)
								console.log("天气命令：", that.weatherDataID)
							} else {
								that.weather7(deviceId, serviceId, writeuuid)
								console.log("天气命令失败：", that.weatherDataID)
							}
						}
					})
				}, 3000)
			},
			weather7(deviceId, serviceId, writeuuid) {
				let that = this
				const buffer2 = that.toArrayBuffer(that.weatherDataID7); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							if (complete.code === 10007) {
								console.log("7天气命令：", that.weatherDataID7)
							} else {
								console.log("7天气命令失败：", that.weatherDataID7)
							}
						}
					})
				}, 3000)
			},
			//获取手表版本unicode
			OTAdata(deviceId, serviceId, writeuuid) {
				let that = this
				const buffer2 = that.toArrayBuffer("e0000609200101000100"); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							if (complete.code === 10007) {
								console.log("ota：", "e0000609200101000100")
							} else {
								console.log("ota失败：", "e0000609200101000100")
							}
						}
					})
				}, 3000)
			},
			getsetp(deviceId, serviceId, writeuuid, PROTOCOL_VERSION) {
				// 运动命令
				let that = this
				const ackConfigByteset = new Uint8Array(9);
				ackConfigByteset[0] = 0xE0;
				ackConfigByteset[1] = 0x00;
				ackConfigByteset[2] = 0x06;
				ackConfigByteset[3] = 0x02;
				ackConfigByteset[4] = 0x01;
				ackConfigByteset[5] = 0x02;
				ackConfigByteset[6] = 0x00;
				ackConfigByteset[7] = 0x01;
				ackConfigByteset[8] = 0x01;
				let ackConfigBytesum2 = 0;
				for (let i = 0; i < ackConfigByteset
					.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
					ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
				}
				ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
				// 创建新的数组，将校验和插入到第四个字节中
				const modifiedCommand2 = new Uint8Array(ackConfigByteset.length +
					1); // 第四个字节的插入，数组长度加1
				modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
				modifiedCommand2[3] = ackConfigBytesum2;
				modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
				const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte
					.toString(16).padStart(2, '0')).join('');
				const buffer2 = that.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: writeuuid,
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							console.log("运动数据命令：", hexCommand2)
							that.dataBuffer = []
						}
					})
				}, 2000)
			},

			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics2(deviceId, serviceId, deviceSn) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						// console.log('获取蓝牙设备某个服务中所有特征值(characteristic)2', res.characteristics)
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							if (item.properties.notify) {
								uni.setStorageSync("landeviceId", deviceId)
								uni.setStorageSync("lanserviceId", serviceId)
								uni.setStorageSync("landcharacteristicId", item
									.uuid)
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										that.onBLECharacteristicValueChange2(
											deviceId,
											serviceId,
											deviceSn);
									},
									fail: (notifyerr) => {}
								})
							}
							setTimeout(() => {
								if (item.properties.write) {
									// 当前时间
									const now = new Date();
									const year = now.getFullYear()
										.toString();
									const month = now.getMonth() +
										1; // 月份从0开始
									const day = now.getDate();
									const hour = now.getHours();
									const minute = now.getMinutes();
									const second = now.getSeconds();
									that.sendLargeData(deviceId,
										serviceId,
										item.uuid, year, month,
										day,
										hour, minute,
										second);
								}
							}, 1000)
						}
					},
					fail(res) {}
				})
			},




			parseQueryString(queryString) {
				let params = queryString.split('&');
				let result = {};
				params.forEach(param => {
					let [key, value] = param.split('=');
					result[key] = value;
				});
				return result;
			},

			// 创建通知
			createNotification(title, content, url) {
				const payload = {
					url: url
				};
				uni.createPushMessage({
					title: title,
					content: content,
					payload: payload,
					options: {
						cover: false, // 是否覆盖上次通知
						when: new Date(), // 通知时间
					}
				});
			},

			Notificationss(name) {
				this.createNotification(this.$t("通知标题"), name,
					'/pages/tabBar/my/Alarms')
			},


			onBLECharacteristicValueChange2(deviceId, serviceId, deviceSn) {
				let that = this
				uni.onBLECharacteristicValueChange((res) => {
					const dataList = that.ab2hex(res.value)
					if (dataList.length === 10) {
						uni.closeBLEConnection({
							deviceId: deviceId,
							success() {},
							fail() {}
						})
						that.disconnectAll(deviceId)
						that.queryDevices()
					} else if (dataList.length > 200) {
						let aaa = that.ab2str(res.value)
						let hexString = that.ab2hex(res.value)
						let asciiString = that.hexToAscii(hexString)
						let parsedData = that.parseQueryString(asciiString);
						that.jakoblife_fat_scale(deviceId, parsedData, deviceSn)
					} else {
						const resheart = dataList.slice(0, 4);
						const reslength = dataList.slice(4, 6);
						const respackage = dataList.slice(6, 10);
						const respackage1 = dataList.slice(10, 14);
						const restype = dataList.slice(14, 16);
						const otherData = dataList.slice(16, dataList.length - 2);
						const otherDatatiwen1 = dataList.slice(16, 20);
						const otherDatatiwen2 = dataList.slice(20, dataList
							.length - 2);
						const otherData1 = dataList.slice(16, 24);
						const otherData2 = dataList.slice(24, 28);
						const otherData3 = dataList.slice(28, dataList.length - 2);
						const otherall = dataList.slice(dataList.length - 2,
							dataList
							.length);
						const hexBytes = [];
						for (let i = 0; i < otherData.length; i += 2) {
							hexBytes.push(otherData.substring(i, i + 2));
						}
						const decimalArray = hexBytes.map(hexByte => {
							return parseInt(hexByte, 16);
						});
						//01表示心率数据，02表示血压数据，03表示血氧数据,04表示步数和千卡数据，07表示体温 08表示压力
						switch (restype) {
							case "01":
								const xinlv = decimalArray[0]
								that.jakoblife_fat_scale2(deviceId, "", "", xinlv,
									deviceSn)
								break
							case "02":
								const shousuoye = decimalArray[0]
								const shuzhangya = decimalArray[1]
								const length = decimalArray.length - 2
								const maibo = decimalArray[length]
								that.jakoblife_fat_scale2(deviceId, shousuoye,
									shuzhangya, maibo,
									deviceSn)
								break
							case "03":
								const xueyang = decimalArray[0]
								const xueyangtimes = decimalArray[3] + "/" +
									decimalArray[4]
								uni.setStorageSync("xueyang", xueyang)
								uni.setStorageSync("xueyangtimes", xueyangtimes)
								that.list_recipe()
								break
							case "05":
								const settept1 = decimalArray[1]
								uni.setStorageSync("settept1", settept1)
								that.list_recipe()
								break
							case "07":
								let tiwen = parseInt(otherDatatiwen1, 16) /
									10 // 第二个参数16表示输入是16进制
								let parts = otherDatatiwen2.match(/.{1,2}/g);
								let tiwentimes = parts.map(p => parseInt(p, 16))[
										2] +
									"/" + parts.map(
										p =>
										parseInt(p, 16))[3]
								uni.setStorageSync("tiwen", tiwen)
								uni.setStorageSync("tiwentimes", tiwentimes)
								that.list_recipe()
								break
							case "08":

								break
							case "22":
								const sum = decimalArray.reduce((acc, curr) =>
									acc +
									curr, 0);
								that.isSumZero = sum === 0;
								if (that.isSumZero === false) {
									const shousuoye = decimalArray[1]
									const shuzhangya = decimalArray[2]
									const length = decimalArray.length - 1
									const maibo = decimalArray[3]
									const year = that.hexToDecimal(otherData2)
									that.jakoblife_fat_scale2(deviceId, shousuoye,
										shuzhangya, maibo,
										deviceSn)
								}
								break
							default:
								// console.log("血压手表其他数据类型", restype)
						}
					}
				})
			},

			bgaaa(lowPressure, highPressure) {
				let that = this;
				if ((lowPressure >= 81 && lowPressure <= 90) || (highPressure >= 121 &&
						highPressure <= 140)) {
					uni.showModal({
						title: that.$t("提示"),
						content: that.$t("显示结果弹窗"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				} else if ((lowPressure >= 91 && lowPressure <= 100) || (highPressure >=
						141 && highPressure <= 160)) {
					uni.showModal({
						title: that.$t("提示"),
						content: that.$t("显示结果弹窗"),
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				} else if ((lowPressure >= 101 && lowPressure <= 110) || (highPressure >=
						161 &&
						highPressure <= 180)) {
					uni.showModal({
						title: that.$t("提示"),
						content: that.$t("显示结果弹窗"),
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			},
			//上报血压计血压数据
			jakoblife_fat_scale(deviceId, parsedData, deviceSn) {
				console.log("deviceId", deviceId)
				console.log("parsedData", parsedData)
				console.log("deviceSn", deviceSn)
				let aaa = {
					lowPressure: parsedData.dia.trim(),
					highPressure: parsedData.sys.trim(),
					heartrate: parsedData.pul.trim(),
				}
				let timess = this.datatime(this.dundatetime())
				const data = {
					deviceSn: deviceSn,
					deviceTypeId: "1",
					mac: deviceId,
					slaveData: aaa,
					time: timess
				}
				uni.setStorageSync("xueyadatatype", "0")
				uni.setStorageSync("xueyadata", data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(resaa => {
					if (resaa.code === 200) {
						console.log("上报血压计成功", resaa)
						uni.removeStorageSync("xueyadatatype")
						uni.removeStorageSync("xueyadata")
						this.setbanhua(1)
						this.get_device_info(deviceSn)
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.list_recipe()
							this.StorageInfo(aaa)
						}, 1000)
					}
				})
			},

			// // 上报体脂秤数据
			jakoblife_fat_scale1(deviceSn, deviceId, parsedData) {
				let data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "0",
					slaveData: {
						weight: parsedData.weightUnit === 2 || parsedData.weightUnit === 4 ?
							WeightConverter
							.parseStoneString(parsedData.weight).toFixed(2) : (parsedData.weightUnit ===
								6 ?
								WeightConverter.lbToKg(parsedData.weight) : parsedData.weight),
						adc: parsedData.adc
					},
					time: parsedData.createTime
				}
				uni.setStorageSync("tizhidata", data)
				console.log("上报体脂秤数据", data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						uni.removeStorageSync("tizhidata")
						this.setbanhua(1)
						this.get_device_info(deviceSn)
						this.get_device_data(deviceSn)
						this.list_recipe()
					}
				})
			},
			//上报mC手表血压计数据
			jakoblife_fat_scale2(deviceId, shousuoye, shuzhangya, maibo, deviceSn) {
				let timess = this.datatime(this.dundatetime())
				let aaa = {
					heartrate: maibo,
				};
				if (shousuoye !== "" && shuzhangya !== "") {
					aaa.lowPressure = shuzhangya;
					aaa.highPressure = shousuoye;
				}
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "1",
					slaveData: aaa,
					time: timess
				}
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(reslk => {
					if (reslk.code === 200) {
						this.setbanhua(1)
						this.bgaaa(aaa.lowPressure, aaa.highPressure)
						this.get_device_info(deviceSn)
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.list_recipe()
							this.StorageInfo(aaa)
						}, 1000)
					}
				})
			},
			// 上报金亿帝手表血压数据
			jakoblife_fat_scale22(deviceId, shousuoye, shuzhangya, maibo, deviceSn, timess) {
				let aaa = {
					heartrate: maibo,
				};
				if (shousuoye !== "" && shuzhangya !== "") {
					aaa.lowPressure = shuzhangya;
					aaa.highPressure = shousuoye;
				}
				let data = {
					deviceSn: deviceSn === "undefined" || deviceSn === undefined ? uni
						.getStorageSync("deviceSn") : deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: timess
				}
				uni.setStorageSync("xueyadatatype", "1")
				uni.setStorageSync("xueyadata", data)
				console.log("jakoblife_fat_scale22", data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					console.log("上报数据手表", res)
					if (res.code === 200) {
						uni.removeStorageSync("xueyadatatype")
						uni.removeStorageSync("xueyadata")
						this.setbanhua(1)
						setTimeout(() => {
							this.bgaaa(aaa.lowPressure, aaa.highPressure)
							this.StorageInfo(aaa)
							this.get_device_info(deviceSn)
						}, 1000)
					}
				}).catch(errro => {
					console.log("errro", errro)
				})
			},

			// 上报金亿帝手表血压数据
			jakoblife_fat_scale22list(deviceId, shousuoye, shuzhangya, maibo, deviceSn, timess) {
				let aaa = {
					heartrate: maibo,
				};
				if (shousuoye !== "" && shuzhangya !== "") {
					aaa.lowPressure = shuzhangya;
					aaa.highPressure = shousuoye;
				}
				let data = {
					deviceSn: deviceSn === "undefined" || deviceSn === undefined ? uni
						.getStorageSync("deviceSn") : deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: timess
				}
				console.log("jakoblife_fat_scale22list", data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					console.log("上报数据手表", res)
					if (res.code === 200) {}
				}).catch(errro => {
					console.log("errro", errro)
				})
			},


			// 上报金亿帝手表单独测量数据
			jakoblife_fat_scale3(deviceId, datapar, deviceSn, type, timess) {
				const aaa = this.buildReportData(type, datapar);
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: type === "血氧" ? timess : this.datatime(this.dundatetime())
				}
				console.log(type, data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(resdb => {
					console.log("jakoblife_fat_scale3", resdb)
					if (resdb.code === 200) {
						this.setbanhua(1)
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.getStorageInfooy(aaa)
						}, 1000)
					}
				})
			},
			//本地警报
			StorageInfo(aaa) {
				let that = this
				uni.getStorageInfo({
					success(res) {
						// 检查是否开启了通知开关
						if (res.keys.includes("swichs") && uni.getStorageSync("swichs") === true) {
							// 检查舒张压
							if (res.keys.includes("shuzhangyaId1") || res.keys.includes("shuzhangyaId2")) {
								that.checkAndNotify("shuzhangyaId1", "shuzhangyaId2", aaa.lowPressure, "舒张压");
							}
							// 检查收缩压
							if (res.keys.includes("shousuoyaId1") || res.keys.includes("shousuoyaId2")) {
								that.checkAndNotify("shousuoyaId1", "shousuoyaId2", aaa.highPressure, "收缩压");
							}
							// 检查脉搏
							if (res.keys.includes("maiboId1") || res.keys.includes("maiboId2")) {
								that.checkAndNotify("maiboId1", "maiboId2", aaa.heartrate, "脉搏");
							}
						} else {
							console.log("警报开关没有设置")
						}
					},
					fail(err) {
						console.log("1警报开关没有设置")
					}
				})
			},
			getStorageInfooy(aaa) {
				let that = this
				uni.getStorageInfo({
					success(res) {
						if (res.keys.includes("swichs") && uni.getStorageSync("swichs") === true) {
							if (res.keys.includes("xeuyang1") || res.keys.includes("xeuyang2")) {
								that.checkAndNotify("xeuyang1", "xeuyang2", aaa.oxygen, "血氧");
							}
						}
					},
				})
			},

			// 封装检查和通知的逻辑

			checkAndNotify(key1, key2, value, messageKey) {
				const storedValue1 = uni.getStorageSync(key1);
				const storedValue2 = uni.getStorageSync(key2);
				if ((storedValue1 && value < storedValue1) ||
					(storedValue2 && value > storedValue2)) {
					// 如果已经触发了通知，则不再重复触发
					if (!uni.getStorageSync("isProcessed")) {
						this.Notificationss(this.$t("测量通知"));
						uni.setStorageSync("isProcessed", true) // 标记已触发通知
						setTimeout(() => {
							uni.removeStorageSync("isProcessed")
						}, 5000)
					}
				}
			},

			buildReportData(type, data) {
				const reportData = {};
				switch (type) {
					case "血氧":
						reportData.oxygen = data;
						break;
					case "步数":
						reportData.steps = data;
						break;
					case "压力":
						reportData.pressure = data;
						break;
					case "体温":
						reportData.temperature = data;
						break;
					case "睡眠":
						reportData.sleep = data;
						break;
					default:
						console.warn("未知类型:", type);
				}
				return reportData;
			},


			dundatetime() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now
					.getMonth() + 1;
				const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
				const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
				const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now
					.getMinutes();
				const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now
					.getSeconds();
				const timesssaa = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
				return timesssaa
			},

			dundatetime1() {
				const now = new Date();
				const year = now.getFullYear();
				const month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now
					.getMonth() + 1;
				const day = now.getDate();
				const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
				const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now
					.getMinutes();
				const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now
					.getSeconds();
				const timesssaa = `${month}/${day} `
				return timesssaa
			},

			datatime(dateStr) {
				// 这样 Date 对象就知道这是北京时间，无论手机在哪个国家，都会转成正确的时间戳
				let isoStr = dateStr.replace(' ', 'T') + '+08:00';
				let timestamp = new Date(isoStr).getTime();
				// 如果需要秒级时间戳，可以除以1000
				let timestampInSeconds = Math.floor(timestamp / 1000);
				return timestampInSeconds
			},


			sendLargeData(deviceId, serviceId, uuid, year, month, day, hour, minute,
				second) {
				let that = this
				const timeSyncData = that.createTimeSyncData(year, month, day, hour,
					minute,
					second); // 构造时间同步数据
				const buffer = that.toArrayBuffer(timeSyncData); // 转换为 ArrayBuffer
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: serviceId,
					characteristicId: uuid,
					value: buffer,
					success: (res) => {},
					fail: (err) => {}
				});
			},

			//消息
			Historical_record() {
				uni.navigateTo({
					url: "/pages/tabBar/my/message"
				})
			},

			calculateChecksum(data) {
				let sum = 0;
				for (let i = 0; i < data.length; i += 2) {
					sum += parseInt(data.substr(i, 2), 16);
				}
				return (sum & 0xFF).toString(16).padStart(2, '0');
			},

			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i += 2) {
					dataView.setUint8(i / 2, parseInt(data.substr(i, 2), 16));
				}
				return buffer;
			},

			decimalToHex(decimal, length = 2) {
				// 转换为十六进制字符串
				const hex = decimal.toString(16).toUpperCase();
				// 使用 padStart 补齐零，确保固定长度
				return hex.padStart(length, '0');
			},
			//同步手表时间命令
			createTimeSyncData(year, month, day, hour, minute, second) {
				let that = this
				const timeData =
					`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}${second.toString().padStart(2, '0')}`;
				const header = "4259"; // 协议头
				const length = "01"; // 数据长度
				const totalPackets = "0001"; // 总包数
				const currentPacket = "0001"; // 当前分包序号
				const flag = "09"; // 标志
				const rawData =
					`${header}${length}${totalPackets}${currentPacket}${flag}${timeData}`;
				// const checksum = that.calculateChecksum(rawData); // 计算和校验
				const checksum = "0f"; // 计算和校验
				const finalData = `${rawData}${checksum}`; // 添加和校验
				return finalData;
			},
			getUserInfo() {
				this.$get(this.$url_APP_IP + this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(UserInfo => {
					if (UserInfo.code == 200) {
						if (this.currentIndex === 2) {
							this.chuhsikg = uni.getStorageSync("danwei2") === 1 ?
								"lb" : "kg";
							this.newweightKG = uni.getStorageSync("danwei2") === 1 ?
								"lb" : "KG";
							this.Initial_weight = this.chuhsikg === "kg" ? UserInfo.data.weight :
								WeightConverter
								.kgToLb(UserInfo.data.weight);
						}
						this.handleUserInformation(UserInfo.data);
					} else if (UserInfo.code == 401) {
						uni.redirectTo({
							url: "/pages/login/login_land"
						});
						return
					}
				}).catch(err => {
					console.error("获取用户信息失败:", err);
					uni.showToast({
						title: this.$t("网络连接异常"),
						icon: 'none'
					})
				})
			},
			handleUserInformation(userData) {
				if (this.loact === "境内") {
					this.handleUserInfoForChina(userData);
				} else if (this.loact === "境外") {
					this.handleUserInfoForOverseas(userData);
				}
			},
			handleUserInfoForChina(userData) {
				if (!userData.phonenumber && !userData.email) {
					uni.navigateTo({
						url: '../../login/Force_binding_phone'
					});
				} else {
					this.processUserInfo(userData);
				}
			},
			handleUserInfoForOverseas(userData) {
				if (!userData.email && !userData.phonenumber) {
					uni.navigateTo({
						url: '../../login/bind_youxiang'
					});
				} else {
					this.processUserInfo(userData);
				}
			},
			processUserInfo(userData) {
				this.getInfo(userData);
				uni.setStorageSync("userid", userData.userId);
				this.deviceSnuserID = [];
				this.deviceSnuserID.push(uni.getStorageSync("userid"))
				this.queryBloodPressureData(this.deviceSnuserID)
				this.pending(userData.userId);
				this.questionnairelist();
				this.queryDevices();
				this.timsdpad = setInterval(res => {
					this.pending(userData.userId);
				}, 8000)

			},
			questionnairelist() {
				let data = {
					patientId: uni.getStorageSync("userid"), //患者唯一标识
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/questionnaire/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((questionnairelist) => {
					// console.log("questionnairelist", questionnairelist)
					if (questionnairelist.code === 200 && questionnairelist.total > 0) {
						this.baoggaodisabled = false //报告按钮
					} else {
						this.baoggaodisabled = true //报告按钮
					}
				})
			},
			//最新体重点击事件
			new_latest() {
				uni.navigateTo({
					url: '../tendency/Historical_record'
				})
			},
			//初始体重点击事件
			Initial() {
				uni.navigateTo({
					url: '../my/Health_record'
				})
			},
			//目标体重点击事件
			Target() {
				this.$refs.mubiao_popup.open("center")
			},
			//目标体重弹窗关闭按钮点击事件
			mb_closess() {
				this.$refs.mubiao_popup.close()
			},
			//目标体重弹窗确定按钮点击事件
			mubiao_weight() {
				let that = this
				if (that.mubiao === "") {
					uni.showToast({
						title: that.$t("请输入目标体重"),
						icon: 'none'
					})
					return
				} else {
					that.fat_scale_tz1()
				}
			},

			bindDateChange(e) {
				this.birthday1111 = e.detail.value
			},

			bindDateChange2(e) {
				this.birthday2 = e.detail.value
			},

			truesss() {
				if (this.shuzhangya === "" || this.shuzhangya === undefined) {
					uni.showToast({
						title: this.$t('请输入收缩压'),
						icon: "none"
					})
					return
				} else if (this.shousuoya === "" || this.shousuoya === undefined) {
					uni.showToast({
						title: this.$t('请输入舒张压'),
						icon: "none"
					})
					return
				} else if (this.maibo === "" || this.maibo === undefined) {
					uni.showToast({
						title: this.$t('请输入脉搏'),
						icon: "none"
					})
					return
				} else {
					this.pressure_data()
				}
			},
			//用户在app手动上报血压数据
			pressure_data() {
				let now = new Date();
				// 本地日期 yyyy-mm-dd
				const localDate =
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
				// 本地时间 hh:mm
				const localTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
				let formattedTime = this.birthday1111 === this.$t('今天') ?
					`${localDate} ${localTime}` :
					`${this.birthday1111} ${localTime}`;
				let timestamp = Math.floor(new Date(formattedTime).getTime() / 1000); // 转换成时间戳（秒）
				let data = {
					deviceSn: uni.getStorageSync('deviceSn'),
					slaveSn: "0",
					slaveData: {
						lowPressure: this.shuzhangya,
						highPressure: this.shousuoya,
						heartrate: this.maibo
					},
					time: timestamp
				}
				this.$post(this.$url_APP_IP + this.$url_pressure_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((res) => {
					console.log("pressure_data", res)
					if (res.code === 200) {
						this.$refs.qs_popup.close()
						this.birthday1111 = this.$t('今天')
						this.shousuoya = ''
						this.shuzhangya = ''
						this.maibo = ''
						uni.showToast({
							title: this.$t("成功"),
							icon: 'none',
							duration: 1500
						})
						this.list_recipe()
					} else if (res.code === 500) {
						return
					} else {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none',
							duration: 1500
						})
					}
				})
			},

			delate_icon_cl(name, item) {
				for (let i = 0; this.list.length > i; i++) {
					if (this.list[i].title == name) {
						this.list.splice(i, 1)
						let kapianlist = []
						kapianlist = this.list
						this.cardeditData(kapianlist, "bloodData")
					}
				}
			},

			delate_icon_cl_2(name, item) {
				for (let i = 0; this.list2.length > i; i++) {
					if (this.list2[i].title == name) {
						this.list2.splice(i, 1)
						let kapianlist2 = []
						kapianlist2 = this.list2
						this.cardeditData(kapianlist2, "WeightData")
					}
				}
			},
			// 查询用户缓存数据列表
			cardlist1(bloodData) {
				let data = {
					dataType: bloodData,
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/data/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((listres) => {
					if (listres.code === 200) {
						if (listres.total === 0) {
							uni.setStorageSync("kapianlist", this.list)
						} else {
							let dataArray = this.robustParseData(listres.rows[0].data);
							this.list = dataArray
							uni.setStorageSync("kapianlist", this.list)
						}
					} else {
						uni.setStorageSync("kapianlist", this.list)
					}
				})
			},
			cardlist2(WeightData) {
				let data = {
					dataType: WeightData,
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/data/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((listres) => {
					if (listres.code === 200) {
						if (listres.total === 0) {
							uni.setStorageSync("kapianlist2", this.list2)
						} else {
							let dataArray = this.robustParseData(listres.rows[0].data);
							this.list2 = dataArray
							uni.setStorageSync("kapianlist2", this.list2)
						}
					} else {
						uni.setStorageSync("kapianlist2", this.list2)
					}
				})
			},

			cardeditData(list, cardeditData) {
				let editData = {
					dataType: cardeditData,
					data: this.formatDatacard(list) === "" ? cardeditData : this.formatDatacard(list)
				}
				this.$post(this.$url_APP_IP + "/prod-api/device/data/editData", editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((reseditData) => {
					if (reseditData.code === 200) {
						if (cardeditData === "WeightData") {
							uni.setStorageSync("kapianlist2", list)
						} else {
							uni.setStorageSync("kapianlist", list)
						}
					}
				})
			},
			//卡片相关
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(
					','); // 多条之间用换行分隔（可改 | 或 ,）
			},
			// 查询用户的绑定设备
			queryDevices() {
				let that = this
				that.$post(that.$url_APP_IP + that.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((res) => {
					if (res.code == 200) {
						if (res.rows === "") {
							switch (that.currentIndex) {
								case 0:
									that.cardlist1("bloodData")
									break
								case 2:
									that.cardlist2("WeightData")
									break
							}
							that.list_recipe()
							that.sleep_alertdisabled = true
						} else {
							switch (that.currentIndex) {
								case 0:
									that.cardlist1("bloodData")
									break
								case 2:
									that.cardlist2("WeightData")
									break
							}
							that.list_recipe()
							let deviceslist1 = []
							const allElementsNot3000 = res.rows.every((item) => item.deviceModelId !== "30000");
							if (allElementsNot3000) {
								that.sleep_alertdisabled = true
							}
							for (let i = 0; res.rows.length > i; i++) {
								if (res.rows[i].mac !== null) {
									if (res.rows[i].deviceTypeId !== "11") {
										deviceslist1.push(res.rows[i].mac)
									}
								}
							}
							that.deviceList = deviceslist1
							uni.setStorageSync("deviceList", deviceslist1)
							uni.setStorageSync("lixianlist", res)
							that.aaaa(res.rows)
						}
					}
				}).catch((error) => {
					uni.showToast({
						title: that.$t("网络连接异常"),
						icon: 'none'
					})
				})
			},
			aaaa(rows) {
				let that = this
				for (let i = 0; rows.length > i; i++) {
					if (rows[i].deviceTypeId === "10") {
						if (that.xueyehuilian === true) {
							if (that.deviceList != null || uni.getStorageSync("deviceList") != null) {
								that.initBluetooth()
							}
							if (that.currentIndex === 0) {
								uni.setStorageSync("deviceSn", rows[i].deviceSn)
							}
						}
						that.devicdsdmac = []
						that.devicdsdmac.push(rows[i].mac)
						uni.setStorageSync("devicdsdmac", that.devicdsdmac)
					} else if (rows[i].deviceTypeId === "13") {
						if (that.deviceList != null || uni.getStorageSync("deviceList") != null) {
							that.initBluetooth()
						}
						if (that.currentIndex === 0) {
							uni.setStorageSync("deviceSn", rows[i].deviceSn)
						}
						that.devicdsdmac1 = []
						that.devicdsdmac1.push(rows[i].mac)
						uni.setStorageSync("devicdsdmac1", that.devicdsdmac1)
						that.BPW1deviceId = rows[i].mac

					} else if (rows[i].deviceTypeId === "11") {
						const TestUniPlugin = uni.requireNativePlugin(
							"DCTestUniPlugin-TestModule");
						TestUniPlugin.startScan("options", (callback) => {
							const parsedData = JSON.parse(callback.data);
							if (rows[i].mac === parsedData.mac) {
								if (parsedData.testStatus === 255) {
									// console.log("parsedData", parsedData)
									if (parsedData.weight !== "0.00") {
										// 检查 weight 是否存在且发生变化
										if (parsedData.adc !== "" && parsedData
											.weight !== undefined && parsedData.weight !== that
											.lastWeight || (parsedData.createTime !== that
												.lastcreateTime && that
												.isTimeDifferenceLessThan(parsedData.createTime, that
													.lastcreateTime, 8))) {
											// console.log('weight 发生变化，上传数据', parsedData.weight + "时间" +
											// 	that
											// 	.isTimeDifferenceLessThan(parsedData.createTime,
											// 		that
											// 		.lastcreateTime, 8));

											if (parsedData.weightUnit === 6 && that.newweightKG ===
												"lb") {
												that.Latest_weight = parsedData.weight
												that.lastWeightbishi = "0"
												uni.setStorageSync("weightlb", parsedData.weight)
												uni.setStorageSync("weightkg", WeightConverter.lbToKg(
													parsedData
													.weight))
											} else if (parsedData.weightUnit === 4) {
												that.Latest_weight = that.newweightKG === "lb" ?
													WeightConverter
													.parseStoneString(parsedData.weight).toFixed(2) :
													WeightConverter.lbToKg(WeightConverter
														.parseStoneString(
															parsedData.weight).toFixed(2))
												that.lastWeightbishi = ""
												uni.setStorageSync("weightlb", WeightConverter
													.parseStoneString(
														parsedData.weight).toFixed(2))
												uni.setStorageSync("weightkg", WeightConverter.lbToKg(
													WeightConverter.parseStoneString(parsedData
														.weight)
													.toFixed(2)))
											} else {
												if (that.newweightKG === "KG") {
													if (parsedData.weightUnit === 0) {
														that.Latest_weight = parsedData.weight
														that.lastWeightbishi = ""
														uni.setStorageSync("weightlb", WeightConverter
															.kgToLb(
																parsedData
																.weight))
														uni.setStorageSync("weightkg", parsedData
															.weight)
													} else if (parsedData.weightUnit === 4) {
														that.Latest_weight = WeightConverter.lbToKg(
															WeightConverter
															.parseStoneString(parsedData.weight)
															.toFixed(2))
														that.lastWeightbishi = ""
														uni.setStorageSync("weightlb", WeightConverter
															.parseStoneString(parsedData.weight)
															.toFixed(2))
														uni.setStorageSync("weightkg", WeightConverter
															.lbToKg(
																WeightConverter
																.parseStoneString(parsedData
																	.weight).toFixed(2)
															))
													} else {
														that.Latest_weight = WeightConverter.lbToKg(
															parsedData
															.weight)
														that.lastWeightbishi = ""
														uni.setStorageSync("weightlb", parsedData
															.weight)
														uni.setStorageSync("weightkg", WeightConverter
															.lbToKg(
																parsedData
																.weight))
													}
												} else {
													if (parsedData.weightUnit === 0) {
														that.Latest_weight = WeightConverter.kgToLb(
															parsedData
															.weight)
														that.lastWeightbishi = ""
														uni.setStorageSync("weightlb", WeightConverter
															.kgToLb(
																parsedData
																.weight))
														uni.setStorageSync("weightkg", parsedData
															.weight)
													} else if (parsedData.weightUnit === 4) {
														that.Latest_weight = WeightConverter
															.parseStoneString(
																parsedData.weight).toFixed(2)
														that.lastWeightbishi = ""
														uni.setStorageSync("weightlb", WeightConverter
															.parseStoneString(
																parsedData.weight).toFixed(2))
														uni.setStorageSync("weightkg", WeightConverter
															.lbToKg(
																WeightConverter.parseStoneString(
																	parsedData
																	.weight).toFixed(2)
															))
													} else {
														that.Latest_weight = parsedData.weight
														that.lastWeightbishi = ""
														uni.setStorageSync("weightlb", parsedData
															.weight)
														uni.setStorageSync("weightkg", WeightConverter
															.lbToKg(
																parsedData
																.weight))
													}
												}
											}
											// 执行上传操作
											that.jakoblife_fat_scale1(rows[i].deviceSn,
												rows[i].mac, parsedData)
											// 更新上一次的值
											that.lastWeight = parsedData.weight;
											that.lastcreateTime = parsedData.createTime;
										}
									}
								}
							}
						});
						if (that.currentIndex === 2) {
							uni.setStorageSync("deviceSn", rows[i].deviceSn)
							that.get_device_data(rows[i].deviceSn)
						}
					}
				}
				if (that.currentIndex === 4) {
					that.list_recipe()
				}
			},
			// 判断两个秒级时间戳差值是否小于指定秒数
			isTimeDifferenceLessThan(time1, time2, seconds) {
				const diff = Math.abs(time2 - time1); // 直接相减就是秒数差
				return diff > seconds;
			},

			//获取设备基础信息
			get_device_info(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_APP_IP + this.$url_get_device_info, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code == 200) {
						switch (this.currentIndex) {
							case 0:
								if (res.data.deviceTypeId === "10") {
									uni.setStorageSync("deviceSn", deviceSn)
								}
								this.cardlist1("bloodData")
								break
							case 2:
								if (res.data.deviceTypeId === "11") {
									uni.setStorageSync("deviceSn", deviceSn)
								}
								break
						}
						this.list_recipe()
					} else {
						switch (this.currentIndex) {
							case 0:
								this.cardlist1("bloodData")
								break
							case 2:
								this.cardlist2("WeightData")
								break
						}
					}
				})
			},

			pending(datainfo) {
				const data = {
					receiverId: datainfo
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
								this.msg = this.getpendinglenth >= pending.data
									.length;
							}
							break
					}
				})
			},
			//时间戳转时间
			formatDate(value) {
				const data = new Date(value);
				const month = String(data.getMonth() + 1).padStart(2, '0');
				const day = String(data.getDate()).padStart(2, '0');
				const year = data.getFullYear();
				const hours = data.getHours();
				const minutes = data.getMinutes();
				const seconds = data.getSeconds();
				const formattedTime = `${month}/${day}`;
				return formattedTime;
			},


			getRegisterVal(data, type, key) {
				const value = this.findValue(data, type, key);
				return value.registerVal !== null ? value.registerVal : "-/-";
			},

			getUpdateTime(data, type, key) {
				const value = this.findValue(data, type, key);
				return value ? this.formatDate(value.updateTime) : "-/-";
			},

			// 封装获取存储信息的通用函数
			getStorageInfo(keys, callback) {
				uni.getStorageInfo({
					success: (res) => {
						const hasAllKeys = keys.every(key => res.keys.includes(
							key));
						callback(hasAllKeys, res);
					}
				});
			},

			// 处理步数卡片
			processSteps(item, name) {
				let that = this
				const now = new Date().getTime();
				const stepItem = that.findValue(that.list, 'title', name);
				stepItem.Step_number = that.getRegisterVal(item, 'register', "steps")
				stepItem.Step_count = that.formatDate(now);
				stepItem.title = that.$t("步数");
				stepItem.type_LX = that.$t("计步");
				that.bushu = stepItem.Step_number;
				that.bushu_time = stepItem.Step_count;
				that.saveDailySteps(that.bushu, that.bushu_time);
			},
			// 封装处理步数的逻辑
			processSteps2(item, name) {
				let that = this
				// const stepKey = 'settept';
				// const stepCacheKey = 'settept1';
				const now = new Date().getTime();
				// this.getStorageInfo([stepKey, stepCacheKey], (hasAllKeys, res) => {
				// 	const currentStep = uni.getStorageSync(stepKey);
				// 	const cachedStep = uni.getStorageSync(stepCacheKey);
				const stepItem = that.findValue(that.list2, 'title', name);
				// if (hasAllKeys) {
				// 	const stepDiff = currentStep - cachedStep;
				// 	if (stepDiff > 0) {
				// 		uni.setStorageSync(stepCacheKey, cachedStep +
				// 			stepDiff);
				// 	}
				// } else {
				// 	uni.setStorageSync(stepCacheKey, currentStep);
				// }
				// stepItem.Step_number = uni.getStorageSync(stepCacheKey);
				stepItem.Step_number = that.getRegisterVal(item, 'register', "steps")
				stepItem.Step_count = that.formatDate(now);
				stepItem.title = that.$t("步数");
				stepItem.type_LX = that.$t("计步");
				that.bushu = stepItem.Step_number;
				that.bushu_time = stepItem.Step_count;
				that.saveDailySteps(that.bushu, that.bushu_time);
				// });
			},

			// 封装处理身高、体重等通用逻辑
			async processCommonData(itemdata, titleKey, dataKey, typeKey, unitKey) {
				let that = this
				const item = that.findValue(that.list2, 'title', titleKey);
				const data = that.findValue(itemdata, 'register', dataKey);
				const unit = uni.getStorageSync(unitKey) === 0 ? "inch" : "cm";
				item.type_LX = unit;
				item.Step_number = data?.registerVal || '--';
				item.Step_count = that.formatDate(data?.updateTime);
				item.title = that.$t("身高")
			},

			// 定义一个通用的处理函数
			updateCard(data, titleKey, dataKey, name) {
				let that = this
				const item = that.findValue(that.list2, 'title', titleKey);
				item.title = name
				item.Step_number = data[dataKey] || '-/-';
			},

			// 定义BMI分类逻辑
			async updateBMI(data) {
				let that = this
				const bmiItem = that.findValue(that.list2, 'title', "BMI");
				const bmiValue = data.BMI || 0;
				bmiItem.Step_number = bmiValue;
				if (bmiValue < 18.5) {
					bmiItem.BMI_TF = 0;
					bmiItem.BMI_ys = that.$t("体重过轻");
				} else if (bmiValue <= 24.9) {
					bmiItem.BMI_TF = 1;
					bmiItem.BMI_ys = that.$t("正常体重");
				} else if (bmiValue <= 29.9) {
					bmiItem.BMI_TF = 2;
					bmiItem.BMI_ys = that.$t("超重");
				} else if (bmiValue <= 34.9) {
					bmiItem.BMI_TF = 3;
					bmiItem.BMI_ys = that.$t("一级肥胖");
				} else if (bmiValue <= 39.9) {
					bmiItem.BMI_TF = 4;
					bmiItem.BMI_ys = that.$t("二级肥胖");
				} else {
					bmiItem.BMI_TF = 5;
					bmiItem.BMI_ys = that.$t("三级肥胖或病态肥胖");
				}
			},

			// 封装处理BMI和其他通用逻辑
			async processGenericData(itemdata, titleKey, dataKey) {
				let that = this
				const item = that.findValue(that.list2, 'title', titleKey);
				const data = that.findValue(itemdata, 'register', dataKey);
				item.Step_count = that.formatDate(data?.updateTime);
				item.title = that.$t(titleKey)
			},

			// 处理身高卡片
			async processHeight(item, name) {
				let that = this
				const heightItem = that.findValue(that.list, 'title', name);
				const height = that.findValue(item, 'register', 'height')?.registerVal;
				const unit = uni.getStorageSync("danwei1") === 0 ? "inch" : "cm";
				heightItem.type_LX = unit;
				heightItem.title = that.$t("身高")
				heightItem.Step_number = height !== null ? (unit === "inch" ? WeightConverter
					.cmToInch(height) :
					height) : '-/-';
				heightItem.Step_count = that.formatDate(that.findValue(item, 'register',
					'height')?.updateTime);
			},

			// 处理体温卡片
			async processTemperature(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				temperatureItem.title = that.$t("体温")
				temperatureItem.Step_number = uni.getStorageSync("tiwen") || "0";
				temperatureItem.Step_count = uni.getStorageSync("tiwentimes") || "--/--";
			},
			async processxiblv(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				temperatureItem.title = that.$t("心率");
				temperatureItem.Step_number = that.pulse;
				temperatureItem.Step_count = that.pulsetime
			},

			// 处理血氧卡片
			async processBloodOxygen(item, name) {
				let that = this
				const bloodOxygenItem = that.findValue(that.list, 'title', name);
				const xueyang = that.findValue(item, 'register', 'oxygen')
					?.registerVal;
				bloodOxygenItem.title = that.$t("血氧");
				bloodOxygenItem.Step_number = xueyang
				if (parseInt(xueyang) <= 95) {
					bloodOxygenItem.BMI_ys = that.$t('偏低');
					bloodOxygenItem.BMI_TF = 0;
				} else if (parseInt(xueyang) < 98) {
					bloodOxygenItem.BMI_ys = that.$t('正常');
					bloodOxygenItem.BMI_TF = 1;
				} else if (parseInt(xueyang) >= 98) {
					bloodOxygenItem.BMI_ys = that.$t('偏高');
					bloodOxygenItem.BMI_TF = 10;
				}
				const xueyangtime = that.formatDate(that.findValue(item, 'register', 'oxygen')?.updateTime);
				bloodOxygenItem.Step_count = !xueyangtime ? "-/-" : xueyangtime;
			},

			// 处理压力卡片
			async processyali(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				temperatureItem.title = that.$t("压力");
				temperatureItem.Step_number = uni.getStorageSync("yali") || "0";
				temperatureItem.Step_count = uni.getStorageSync("yalitimes") || "--/--";
			},


			//设备数据概览
			list_recipe() {
				const data = {
					userId: this.info.userId
				}
				this.$post(this.$url_APP_IP + this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni
						.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					// console.log("list_recipe", res)
					if (res.code === 200) {
						this.sleep_time = this.getUpdateTime(res.data, 'register', 'sleep')
						if (this.currentIndex === 0) {
							const slaveSn2Data = res.data.filter(item => item.slaveSn === "2");
							const slaveSn3Data = res.data.filter(item => item.slaveSn === "3");
							uni.setStorageSync("parseBloodDatatime", (this.findValue(slaveSn3Data, "register",
								"lowPressure")?.updateTime) / 1000)
							uni.setStorageSync("oxygenDatatime", (this.findValue(slaveSn3Data, "register",
								"oxygen")?.updateTime) / 1000)
							uni.setStorageSync("heartRateDatatime", (this.findValue(slaveSn3Data, "register",
								"heartrate")?.updateTime) / 1000)
							const getLatestData = (data1, data2, type) => {
								const time1 = this.findValue(data1, "register", type)?.updateTime || 0;
								const time2 = this.findValue(data2, "register", type)?.updateTime || 0;
								const val1 = this.getRegisterVal(data1, 'register', type);
								const val2 = this.getRegisterVal(data2, 'register', type);
								return time1 > time2 ? {
									value: val1,
									time: time1
								} : {
									value: val2,
									time: time2
								};
							}
							if (this.xeuyabiaoshi === "" && !uni
								.getStorageSync('xueyadata')) {
								// 血压数据
								const lowPressureData = getLatestData(slaveSn2Data, slaveSn3Data, "lowPressure");
								const highPressureData = getLatestData(slaveSn2Data, slaveSn3Data, "highPressure");
								const pulseData = getLatestData(slaveSn2Data, slaveSn3Data, "heartrate");
								this.$set(this, 'lowPressure', this.Blood === "mmHg" ? lowPressureData.value : (
									Number(lowPressureData.value) * 0.133).toFixed(1));
								this.$set(this, 'highPressure', this.Blood === "mmHg" ? highPressureData.value : (
									Number(highPressureData.value) * 0.133).toFixed(1));
								this.$set(this, 'pulse', pulseData.value);
								this.$set(this, 'pulsetime', this.formatDate(pulseData.time));
								this.updateBloodPressureStatus(lowPressureData.value, highPressureData.value);
							}
							const pulseData = getLatestData(
								slaveSn2Data, slaveSn3Data,
								"heartrate");
							this.$set(this, 'pulsetime', this
								.formatDate(pulseData.time));
							// 主逻辑：遍历卡片列表并处理
							const kapianlist = uni.getStorageSync(
								"kapianlist") || [];
							let itelistasd = []
							for (let i = 0; i < kapianlist
								.length; i++) {
								const item = kapianlist[i];
								if (item.title === "步数" || item
									.title === "Steps") {
									this.processSteps(res.data, item
										.title);
								} else if (item.title === "身高" || item
									.title === "Height") {
									this.processHeight(res.data, item
										.title);
								} else if (item.title === "体温" || item
									.title === "Body Temperature") {
									this.processTemperature(res.data,
										item.title);
								} else if (item.title === "血氧" || item
									.title === "SpO₂") {
									this.processBloodOxygen(res.data,
										item.title);
								} else if (item.title === "压力" || item
									.title === "Stress") {
									this.processyali(res.data, item
										.title);
								} else if (item.title === "心率" || item
									.title === "Heart") {
									this.processxiblv(res.data, item
										.title);
								}
								itelistasd.push(item)
							}
							this.cardeditData(itelistasd,
								"bloodData")

						} else if (this.currentIndex === 1) {
							this.ppgresultslist(this.types_index)
							this.ppgresultslist2(this.types_index)
							this.ppgresultslist3(this.types_index)
						} else if (this.currentIndex === 2) {
							// 获取体重值
							if (this.lastWeightbishi === "" && !uni
								.getStorageSync("tizhidata")) {
								this.Latest_weight = this
									.newweightKG === "KG" ? this
									.getRegisterVal(res.data,
										'register', 'weight') :
									WeightConverter.kgToLb(this
										.getRegisterVal(res
											.data, 'register', 'weight'
										));
							}
							this.Latest_date = this.getUpdateTime(res
								.data, 'register', 'weight')
							this.Target_weight = this.chuhsikg ===
								"kg" ? this.getRegisterVal(res.data,
									'register',
									'goal_weight') : WeightConverter
								.kgToLb(this.getRegisterVal(res.data,
									'register', 'goal_weight'));
							this.Chest_circumference = this
								.getRegisterVal(res.data, 'register',
									'chest_circumference');
							this.waistline = this.getRegisterVal(res
								.data, 'register', 'waistline');
							this.Hip_circumference =
								this.getRegisterVal(res
									.data, 'register',
									'hipline');
							this.Upper_Chest_circumference =
								this.getRegisterVal(res
									.data, 'register',
									'biceps_circumference'
								);
							this.Thigh_circumference =
								this.getRegisterVal(res
									.data, 'register',
									'thigh_circumference'
								);
							this.Calf_circumference =
								this.getRegisterVal(res
									.data, 'register',
									'calf_circumference'
								);
							// 主逻辑：遍历卡片列表并处理
							const kapianlist2 = uni.getStorageSync(
								"kapianlist2") || [];
							for (let i = 0; i < kapianlist2
								.length; i++) {
								const item = kapianlist2[i];
								if (item.title === "步数" || item
									.title === "Steps") {
									// this.processSteps2(res.data, item.title);
								} else if (item.title === "身高" || item
									.title === "Height") {
									// this.processCommonData(res.data, item.title, 'height', 'danwei1',
									// 	"cm");
								} else if (item.title === "BMI") {
									this.processGenericData(res.data,
										"BMI", "weight");
								} else if (item.title === "骨含量" || item
									.title === "Bone Mass") {
									this.processGenericData(res.data,
										item.title, "weight");
								} else if (item.title === "肌肉量" || item
									.title === "Muscle Mass") {
									this.processGenericData(res.data,
										item.title, "weight");
								} else if (item.title === "蛋白率" || item
									.title === "Protein%") {
									this.processGenericData(res.data,
										item.title, "weight");
								} else if (item.title === "水分" || item
									.title === "Water%") {
									this.processGenericData(res.data,
										item.title, "weight");
								} else if (item.title === "内脏脂肪指数" ||
									item.title === "VFI") {
									this.processGenericData(res.data,
										item.title, "weight");
								} else if (item.title === "脂肪率" || item
									.title === "Fat%") {
									this.processGenericData(res.data,
										item.title, "weight");
								} else if (item.title === "基础代谢率" ||
									item.title === "BMR") {
									this.processGenericData(res.data,
										item.title, "weight");
								} else if (item.title === "皮下脂肪率" ||
									item.title === "SubQ Fat%") {
									this.processGenericData(res.data,
										item.title, "weight");
								} else if (item.title === "身体年龄" ||
									item.title === "Body Age") {
									this.processGenericData(res.data,
										item.title, "weight");
								}
							}
						} else if (this.currentIndex === 3) {
							// uni.getStorageInfo({
							// 	success: (ress) => {
							// 		this.yali = uni.getStorageSync("yali") || "0";
							// 		this.yali_time = uni.getStorageSync(
							// 				"yalitimes") ||
							// 			"--/--";
							// 	},
							// });
							this.sleep = this.getRegisterVal(res.data,
								'register', 'sleep');
							this.sleep_time = this.getUpdateTime(res
								.data, 'register', 'sleep')
							if (this.getRegisterVal(res.data,
									'register', 'sleep') === null ||
								this.getRegisterVal(
									res.data, 'register', 'sleep') ===
								"-/-") {
								this.totalLight = "--/--"
								this.totalDeep = "--/--"
								this.totalRem = "--/--"
								this.sleep_point = "--/--"
								this.sleep = "--/--"
								this.sleep_time = "--/--"
							} else if (this.getRegisterVal(res.data,
									'register', 'sleep') === '0H0M') {
								this.totalLight = "0H0M"
								this.totalDeep = "0H0M"
								this.totalRem = "0H0M"
								this.sleep_point = "--/--"
								this.sleep = "0H0M"
								this.sleep_time = this.getUpdateTime(
									res.data, 'register', 'sleep')
							} else {
								this.totalLight = uni.getStorageSync(
									"totalLight")
								this.totalDeep = uni.getStorageSync(
									"totalDeep")
								this.totalRem = uni.getStorageSync(
									"totalRem")
								// 1. 总睡眠小时数（ 保留 1 位小数）
								const totalAll = this.timeStrToMinutes(
									this.sleep); // 436
								const totalH = (totalAll / 60).toFixed(
									1)
								const deepMin = (this.timeStrToMinutes(
									this.totalDeep) / 60).toFixed(
									1);
								const remMin = (this.timeStrToMinutes(
									this.totalRem) / 60).toFixed(1);
								const lightMin = (this
									.timeStrToMinutes(this
										.totalLight) / 60).toFixed(
									1)
								this.sleep_point = this
									.overallSleepScore(totalAll,
										totalH, deepMin, remMin,
										lightMin)
								uni.setStorageSync("sleep_point", this
									.sleep_point)
							}
						} else if (this.currentIndex === 4) {
							this.bushu = this.getRegisterVal(
								res.data, 'register',
								'steps');
							this.bushu_time = this
								.getUpdateTime(res.data,
									'register', 'steps')
							this.saveDailySteps(this.bushu,
								this.bushu_time);
						}
					}
				})
			},
			findValue(arr, key, value) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i][key] == value) {
						return arr[i]
					}
				}
				return null
			},
			robustParseData(dataStr) {
				if (dataStr === "bloodData") {
					uni.setStorageSync("kapianlist", "")
					return
				}
				if (dataStr === "WeightData") {
					uni.setStorageSync("kapianlist2", "")
					return
				}
				try {
					// 分割每个对象
					const objects = dataStr.split('},{');
					const result = [];
					for (let i = 0; i < objects.length; i++) {
						let objStr = objects[i];
						// 修复首尾对象的花括号
						if (i === 0) objStr = objStr + '}';
						else if (i === objects.length - 1) objStr = '{' +
							objStr;
						else objStr = '{' + objStr + '}';
						// 移除可能的多余花括号
						objStr = objStr.replace(/^{{/, '{').replace(/}}$/,
							'}');
						// 修复键值对
						const fixedObjStr = objStr.replace(
							/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (match,
								key, value) => {
								value = value.trim();

								// 处理布尔值
								if (value === 'true' || value ===
									'false') {
									return `"${key}":${value}`;
								}
								// 处理数字
								if (!isNaN(value) && value !== '' && !value
									.includes('/')) {
									return `"${key}":${value}`;
								}
								// 处理字符串
								return `"${key}":"${value}"`;
							});
						try {
							const obj = JSON.parse(fixedObjStr);
							result.push(obj);
						} catch (e) {
							console.warn('解析单个对象失败:', fixedObjStr, e);
						}
					}
					return result;
				} catch (error) {
					console.error('解析失败:', error);
					return [];
				}
			},

			timeStrToMinutes(str) {
				const upper = str.toUpperCase();
				let h = 0,
					m = 0;
				// 匹配 7H 或 7 H
				const hMatch = upper.match(/(\d+)\s*H/);
				if (hMatch) h = Number(hMatch[1]);
				// 匹配 16M 或 16 M
				const mMatch = upper.match(/(\d+)\s*M/);
				if (mMatch) m = Number(mMatch[1]);
				return h * 60 + m;
			},
			/**
			 * 综合睡眠评分
			 * @param {number} totalH   总睡眠时长（小时，已保留 1 位小数）
			 * @param {number} deepMin  深睡分钟
			 * @param {number} remMin   REM 分钟
			 * @param {number} lightMin 浅睡分钟
			 * @returns {number} 0~100 分
			 */
			overallSleepScore(totalAll, totalH, deepMin, remMin, lightMin) {
				if (totalAll === 0) return "--/--"
				/* 1. 睡眠时长得分 0~100（权重 30%） */
				let durationScore;
				if (totalH >= 7) durationScore = 100;
				else if (totalH >= 6) durationScore = 80;
				else if (totalH >= 5) durationScore = 60;
				else durationScore = 30;
				/* 2. 睡眠结构得分 0~100（权重 35%） */
				const pct = (min) => (min / totalAll) * 100;
				const d = pct(deepMin);
				const r = pct(remMin);
				const l = pct(lightMin);
				let structScore = 100;
				// 深睡 20-25%
				if (d < 20) structScore -= Math.ceil((20 - d) / 5) *
					10;
				else if (d > 25) structScore -= Math.ceil((d - 25) /
					5) * 10;
				// REM 20-25%
				if (r < 20) structScore -= Math.ceil((20 - r) / 5) *
					10;
				else if (r > 25) structScore -= Math.ceil((r - 25) /
					5) * 10;
				// 浅睡 <55%
				if (l > 55) structScore -= Math.ceil((l - 55) / 5) * 5;
				structScore = Math.max(0, structScore);

				const efficiencyScore = 80; // TODO：睡眠连续性
				const latencyScore = 80; // TODO：睡眠效率
				/* 3. 加权求和（其余 35% 可先留空或继续扩展） */
				const finalScore =
					durationScore * 0.30 +
					structScore * 0.35 +
					efficiencyScore * 0.20 +
					latencyScore * 0.15;
				return Math.round(finalScore);
			},

			// 定义一个函数来封装血压等级判断逻辑
			updateBloodPressureStatus(lowPressure, highPressure) {
				this.xueya = -1; // 初始化为未知状态
				this.title_name = this.$t("未知");
				const pressureRanges = [
					// 正常血压
					{
						lowMin: 61,
						lowMax: 80,
						highMin: 91,
						highMax: 120,
						level: 0,
						name: this.$t("正常血压")
					},
					// 正常高血压值
					{
						lowMin: 81,
						lowMax: 90,
						highMin: 121,
						highMax: 140,
						level: 1,
						name: this.$t("正常高血压值")
					},
					// 一级高血压
					{
						lowMin: 91,
						lowMax: 100,
						highMin: 141,
						highMax: 160,
						level: 2,
						name: this.$t("一级高血压")
					},
					// 二级高血压
					{
						lowMin: 101,
						lowMax: 110,
						highMin: 161,
						highMax: 180,
						level: 3,
						name: this.$t("二级高血压")
					}
				];
				for (const range of pressureRanges) {
					if ((lowPressure >= range.lowMin &&
							lowPressure <= range.lowMax) ||
						(highPressure >= range.highMin &&
							highPressure <= range.highMax)) {
						this.xueya = range.level;
						this.title_name = range.name;
						break;
					}
				}
			},

			//获取体脂秤身体指数
			get_device_data(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_APP_IP + this.$url_get_device_data,
					data, {
						'Authorization': 'Bearer ' + uni.getStorageSync(
							"token"),
						'content-type': 'application/x-www-form-urlencoded'
					}).then(res => {
					if (res.code === 200) {
						const kapianlist2 = uni
							.getStorageSync(
								"kapianlist2") || [];
						let itelistasd2 = []
						const data = res.data;
						for (let i = 0; i <
							kapianlist2
							.length; i++) {
							const item =
								kapianlist2[i];
							if (item.title ===
								"BMI") {
								this.updateBMI(
									data);
							} else if (item
								.title ===
								"骨含量" || item
								.title ===
								"Bone Mass") {
								this.updateCard(
									data, item
									.title,
									"BM", this
									.$t("骨含量"));
							} else if (item
								.title ===
								"肌肉量" || item
								.title ===
								"Muscle Mass") {
								this.updateCard(
									data, item
									.title,
									"ROM", this
									.$t("肌肉量"));
							} else if (item
								.title ===
								"蛋白率" || item
								.title ===
								"Protein%") {
								this.updateCard(
									data, item
									.title,
									"PP", this
									.$t("蛋白率"));
							} else if (item
								.title ===
								"水分" || item
								.title ===
								"Water%") {
								this.updateCard(
									data, item
									.title,
									"MOI", this
									.$t("水分"));
							} else if (item
								.title ===
								"内脏脂肪指数" || item
								.title ===
								"VFI") {
								this.updateCard(
									data, item
									.title, "UVI",
									this.$t(
										"内脏脂肪指数")
								);
							} else if (item
								.title ===
								"脂肪率" || item
								.title ===
								"Fat%") {
								this.updateCard(
									data, item
									.title,
									"BFR", this
									.$t("脂肪率"));
							} else if (item
								.title ===
								"基础代谢率" || item
								.title ===
								"BMR") {
								this.updateCard(
									data, item
									.title,
									"BMR", this
									.$t(
										"基础代谢率")
								);
							} else if (item
								.title ===
								"皮下脂肪率" || item
								.title ===
								"SubQ Fat%") {
								this.updateCard(
									data, item
									.title,
									"SFR", this
									.$t(
										"皮下脂肪率")
								);
							} else if (item
								.title ===
								"身体年龄" || item
								.title ===
								"Body Age") {
								this.updateCard(
									data, item
									.title,
									"PA", this
									.$t("身体年龄")
								);
							}
							itelistasd2.push(item)
						}
						this.cardeditData(itelistasd2, "WeightData")
					}
				})
			},

			tiaozhen() {
				this.binaji = false
				this.animation = 'shake';
				this.button_show = true
				this.delate_icon = true
				this.disabledsaaa = true
				this.disabletouch = true
			},
			tiaozhen2() {
				this.binaji2 = false
				this.animation2 = 'shake';
				this.button_show2 = true
				this.delate_icon2 = true
				this.disabledsaaa2 = true
				this.disabletouch = true
			},

			add_bt_xy() {
				uni.navigateTo({
					url: "../main/card1"
				})
				this.cardeditData(this.list, "bloodData")
			},

			add_bt2() {
				uni.navigateTo({
					url: '../main/card'
				})
				this.cardeditData(this.list2, "WeightData")
			},

			ture_bt() {
				this.binaji = true
				this.animation = '';
				this.button_show = false
				this.delate_icon = false
				this.disabledsaaa = true
				this.disabletouch = false
				this.cardeditData(this.list, "bloodData")
			},

			ture_bt2() {
				this.binaji2 = true
				this.animation2 = '';
				this.button_show2 = false
				this.delate_icon2 = false
				this.disabledsaaa2 = true
				this.disabletouch = false
				this.cardeditData(this.list2, "WeightData")
			},

			xw_handleChange(e) {
				this.xw_value = e;
			},
			yw_handleChange(e) {
				this.yw_value = e;
			},
			tw_handleChange(e) {
				this.tw_value = e;
			},
			stw_handleChange(e) {
				this.stw_value = e;
			},
			dtw_handleChange(e) {
				this.dtw_value = e;
			},
			xtw_handleChange(e) {
				this.xtw_value = e;
			},
			xueya_tap() {
				this.$refs.popup.open("center")
			},
			BMI_tap(id) {
				if (id == this.$t("血氧")) {
					this.$refs.popup2.open("center")
				} else {
					this.$refs.popup1.open("center")
				}
			},
			knowe() {
				this.$refs.popup.close()
			},
			knowe1() {
				this.$refs.popup1.close()
			},
			knowe2() {
				this.$refs.popup2.close()
			},
			jitizhong_tc() {
				if (this.tizhong === "" || this.tizhong ===
					undefined) {
					uni.showToast({
						title: this.$t('请输入体重'),
						icon: 'none'
					})
					return
				} else {
					this.fat_scale_tz()
				}
			},
			select_ruler() {
				this.fat_scale_1()
			},
			popup_sd() {
				if (this.xiongwei === "" || this
					.xiongwei ===
					undefined) {
					uni.showToast({
						title: this.$t('请输入胸围'),
						icon: 'none'
					})
					return
				} else if (this.yaowei === "" || this
					.yaowei ===
					undefined) {
					uni.showToast({
						title: this.$t('请输入腰围'),
						icon: 'none'
					})
					return
				} else if (this.tunwei === "" || this
					.tunwei ===
					undefined) {
					uni.showToast({
						title: this.$t('请输入臀围'),
						icon: 'none'
					})
					return
				} else if (this.shangtunwei === "" || this
					.shangtunwei === undefined) {
					uni.showToast({
						title: this.$t('请输入上臂围'),
						icon: 'none'
					})
					return
				} else if (this.datuiwei === "" || this
					.datuiwei === undefined) {
					uni.showToast({
						title: this.$t('请输入大腿围'),
						icon: 'none'
					})
					return
				} else if (this.xiaotuiwei === "" || this
					.xiaotuiwei === undefined) {
					uni.showToast({
						title: this.$t('请输入小腿围'),
						icon: 'none'
					})
					return
				} else {
					this.fat_scale()
				}
			},

			knowe3() {
				this.$refs.popup3.close()
			},

			xueyaclick() {
				this.$refs.qs_popup.open("center")
				console.log("kkkkk")
				// uni.navigateTo({
				// 	url: "/pages/tabBar/main/globalweather/globalweather"
				// })
			},

			tizhiclick() {
				this.fillOut = true
			},
			closess() {
				this.fillOut = false
			},

			sd_closess() {
				this.fillOut = false
				this.$refs.tihzi_popup_sd.close()
			},

			tz_closess() {
				this.fillOut = false
				this.$refs.tizhong_popup.close()
			},

			hd_closess() {
				this.fillOut = false
				this.$refs.tihzi_popup_hd.close()
			},

			Keep() {
				this.fillOut = false
				this.$refs.tizhong_popup.open("center")
			},
			dataclick() {
				this.$refs.myPicker.show();
			},
			handleSubmit(e) {
				this.birthday =
					`${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},
			dataclick1() {
				this.$refs.myPicker1.show();
			},
			handleSubmit1(e) {
				this.birthday1 =
					`${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},
			sdsr() {
				this.$refs.tihzi_popup_hd.close()
				this.$refs.tihzi_popup_sd.open("center")
			},
			hdsr() {
				this.$refs.tihzi_popup_sd.close()
				this.$refs.tihzi_popup_hd.open("center")
			},

			Body_circumference() {
				this.fillOut = false
				this.$refs.tihzi_popup_hd.open("center")
			},

			//用户在app手动上报重量数据
			fat_scale_tz() {
				let that = this
				const now = new Date();
				// 构建本地日期时间字符串
				const dateStr = that.birthday2 == that.$t('今天') ?
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}` :
					that.birthday2;
				let timestamp = Math.floor(new Date(dateStr).getTime() / 1000);
				uni.request({
					url: that.$url_APP_IP + that.$url_fat_scale,
					method: 'POST',
					data: {
						deviceSn: uni.getStorageSync("deviceSn"),
						slaveSn: "0",
						slaveData: {
							weight: that.tizhong
						},
						time: timestamp
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success: function(res) {
						if (res.data.code == 200) {
							that.tizhong = ''
							that.birthday2 = that.$t('今天')
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							that.list_recipe()
							that.$refs.tizhong_popup.close()
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			//用户在app手动上报重量数据
			fat_scale_tz1() {
				let timestamp = new Date(new Date().toISOString().slice(0, 10) + " " + new Date()
					.getHours() + ":" + new Date().getMinutes()).getTime() / 1000; // 将时间转换成时间戳（以秒为单位）
				const data = {
					deviceSn: uni.getStorageSync("deviceSn"),
					slaveSn: "1",
					slaveData: {
						goal_weight: this.mubiao,
					},
					time: timestamp
				}
				this.$post(this.$url_APP_IP + this.$url_fat_scale, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						this.mubiao = ""
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.$refs.mubiao_popup.close()
						this.list_recipe()
					} else {
						uni.showToast({
							title: this.$t("失败"),
							icon: 'none'
						})
					}
				})
			},

			//用户在app手动上报六围数据
			fat_scale() {
				let that = this
				const now = new Date();
				let timestamp = Math.floor(new Date(
					that.birthday == that.$t('今天') ?
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}` :
					that.birthday
				).getTime() / 1000);
				uni.request({
					url: that.$url_APP_IP + that.$url_fat_scale,
					method: 'POST',
					data: {
						slaveSn: "1",
						slaveData: {
							//初始体重
							start_weight: '',
							//目标体重 
							goal_weight: '',
							//胸围    
							chest_circumference: that.xiongwei,
							//腰围   
							waistline: that.yaowei,
							//臀围   
							hipline: that.tunwei,
							//上臂围   
							biceps_circumference: that.shangtunwei,
							//大腿围  
							thigh_circumference: that.datuiwei,
							//小腿围   
							calf_circumference: that.xiaotuiwei,
						},
						time: timestamp
					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync("token"),
						'content-type': 'application/json' //自定义请求头信息
					},
					success: function(res) {
						if (res.data.code === 200) {
							that.birthday = that.$t('今天')
							that.xiongwei = ''
							//腰围   
							that.yaowei = ''
							//臀围   
							that.tunwei = ''
							//上臂围   
							that.shangtunwei = ''
							//大腿围 
							that.datuiwei = ''
							//小腿围   
							that.xiaotuiwei = ''
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							that.list_recipe()
							that.$refs.tihzi_popup_sd.close()
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},

			//用户在app手动上报六围数据
			fat_scale_1() {
				const now = new Date();
				let timestamp = Math.floor(new Date(this.birthday1 == this.$t('今天') ?
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}` :
					this.birthday1).getTime() / 1000);
				let data = {
					slaveSn: "1",
					slaveData: {
						//初始体重
						start_weight: '',
						//目标体重 
						goal_weight: '',
						//胸围    
						chest_circumference: this.xw_value,
						//腰围   
						waistline: this.yw_value,
						//臀围   
						hipline: this.tw_value,
						//上臂围   
						biceps_circumference: this
							.stw_value,
						//大腿围  
						thigh_circumference: this
							.dtw_value,
						//小腿围   
						calf_circumference: this.xtw_value,
					},
					time: timestamp
				}
				this.$post(this.$url_APP_IP + this.$url_fat_scale, data, {
					'Authorization': 'Bearer ' + uni
						.getStorageSync("token"),
					'content-type': 'application/json'
				}).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						this.$refs.tihzi_popup_hd
							.close()
						this.list_recipe()
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},

			// 子按钮点击事件处理
			onSubButtonClick(item) {},

			// 菜单打开事件
			onMenuOpen() {
				// uni.navigateTo({
				// 	url: "/pages/tabBar/main/iphone_health"
				// })
			},
			//读取ota配置文件 uni-app 读取本地文件内容
			async loadFiles(bytes, deviceId, serviceId) {
				let that = this
				try {
					const filePath = '_www/static/OTA/unique_code.txt';
					const buf = await that.readFileWithBase64(filePath);
					// 2. 统一成字符串
					let rawText;
					if (typeof buf === 'string') {
						rawText = buf; // H5 环境
					} else {
						rawText = [].map.call(new Uint8Array(buf), b =>
							String.fromCharCode(b)).join(''); // App 环境
					}
					// 3. 提取唯一码 - 改进正则表达式
					const uniqueCode = rawText.match(
							/unique_code\s*[=:]\s*([0-9A-Fa-f]+)/)?.[1] ||
						rawText.match(/unique_code\s*([0-9A-Fa-f]+)/)?.[
							1
						] ||
						rawText.match(/([0-9A-Fa-f]{16,})/)?.[
							1
						];
					if (uniqueCode) {
						if (bytes === uniqueCode.trim()) {
							uni.hideLoading()
							that.resetDataState("35")
							if (uni.getStorageSync("arguments00") !== 1) return
							uni.showModal({
								content: that.$t("手表固件已经是最新版本"),
								confirmText: that.$t('确定'),
								showCancel: false,
								success(modal) {
									if (modal.confirm) {
										uni.removeStorageSync("arguments00")
									}
								}
							});
							return
						} else {
							uni.removeStorageSync("otadatares")
							if (uni.getStorageSync("arguments00") !== 1) return
							uni.showLoading({
								title: that.$t("正在请求升级"),
								mask: true,
							})
							const ackConfigByteset = new Uint8Array(9);
							ackConfigByteset[0] = 0xE0;
							ackConfigByteset[1] = 0x00;
							ackConfigByteset[2] = 0x06;
							ackConfigByteset[3] = 0x20;
							ackConfigByteset[4] = 0x01;
							ackConfigByteset[5] = 0x02;
							ackConfigByteset[6] = 0x00;
							ackConfigByteset[7] = 0x01;
							ackConfigByteset[8] =
								0x01; //0x01是OTA升级，0x02是升级狗
							let ackConfigBytesum2 = 0;
							for (let i = 0; i < ackConfigByteset
								.length; i++) {
								ackConfigBytesum2 += ackConfigByteset[i];
							}
							ackConfigBytesum2 = ackConfigBytesum2 % 256;
							const modifiedCommand2 = new Uint8Array(
								ackConfigByteset.length + 1);
							modifiedCommand2.set(ackConfigByteset.subarray(
								0, 3), 0);
							modifiedCommand2[3] = ackConfigBytesum2;
							modifiedCommand2.set(ackConfigByteset.subarray(
								3), 4);
							const hexCommand2 = Array.from(
								modifiedCommand2).map(byte => byte
								.toString(
									16).padStart(2, '0')).join('');
							const buffer2 = that.toArrayBuffer(
								hexCommand2);
							console.log("hexCommand2", hexCommand2)
							console.log("deviceId", deviceId)
							console.log("serviceId", serviceId)
							console.log("that.writeuuid", that.writeuuid)
							setTimeout(() => {
								uni.removeStorageSync("arguments00")
								uni.$emit('updateIdChanged', 1)
								uni.writeBLECharacteristicValue({
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: that.writeuuid,
									writeType: 'write',
									value: buffer2,
									complete(complete) {
										if (complete.code === 10007) {
											uni.hideLoading()
											uni.$emit('updateIdChanged', 1)
											that.resetDataState("34")
										} else {
											uni.hideLoading()
											uni.showToast({
												title: that.$t("下发升级指令失败"),
												icon: 'none'
											})
											that.resetDataState("32")
										}
									}
								})
							}, 3000)
						}
					} else {
						uni.hideLoading()
						that.resetDataState("31")
						console.log("设备唯一码文件为空")
					}
				} catch (e) {
					uni.hideLoading()
					that.resetDataState("33")
					if (e.message && e.message.includes('不存在')) {
						console.log("设备唯一码文件不存在")
					} else {
						console.log("读取设备唯一码文件失败", e)
					}
				}
			},
			// 读取设备唯一码文件
			async readFileWithBase64(filePath) {
				return new Promise((resolve, reject) => {
					plus.io.resolveLocalFileSystemURL(filePath,
						(entry) => {
							entry.file((file) => {
								const reader =
									new plus.io
									.FileReader();

								reader.onloadend =
									(e) => {
										try {
											// 读取为 Base64
											const
												base64 =
												e
												.target
												.result;
											const
												text =
												this
												.decodeBase64(
													base64
												);
											resolve
												(text
													.trim()
												);
										} catch (
											error
										) {
											reject(
												error);
										}
									};

								reader.onerror = (
									e) => {
									console
										.error(
											'读取错误:',
											e
											.target
											.error
										);
									reject(e.target
										.error
									);
								};

								// 关键：使用 readAsDataURL 获取 Base64
								reader
									.readAsDataURL(
										file);
							}, reject);
						}, reject);
				});
			},

			// 正确的 Base64 解码方法
			decodeBase64(base64String) {
				// 1. 移除 data:text/plain;base64, 前缀
				const base64Data = base64String.replace(
					/^data:text\/plain;base64,/, '');

				// 2. 使用 atob 解码（浏览器环境）
				try {
					// 方法1：使用 atob（适用于简单文本）
					const binaryString = atob(base64Data);

					// 将二进制字符串转换为 UTF-8
					const bytes = new Uint8Array(binaryString.length);
					for (let i = 0; i < binaryString.length; i++) {
						bytes[i] = binaryString.charCodeAt(i);
					}

					// 尝试不同的编码
					const decoders = [{
							name: 'gbk',
							test: this.decodeGBK
						},
						{
							name: 'utf-8',
							test: this.decodeUTF8
						},
						{
							name: 'gb2312',
							test: this.decodeGB2312
						}
					];

					for (const decoder of decoders) {
						try {
							const result = decoder.test(bytes);
							// console.log(`${decoder.name} 解码成功:`, result);
							return result;
						} catch (e) {
							console.warn(`${decoder.name} 解码失败`);
						}
					}

					// 如果都不行，使用原始字节
					return binaryString;

				} catch (error) {
					console.error('Base64 解码失败:', error);
					throw error;
				}
			},

			// GBK 解码
			decodeGBK(bytes) {
				// 由于浏览器不支持直接 GBK 解码，可以使用以下方法
				// 方法1：使用 TextDecoder（如果浏览器支持）
				try {
					const decoder = new TextDecoder('gbk');
					return decoder.decode(bytes);
				} catch (e) {
					// 方法2：手动处理常见中文字符
					return this.manualDecodeGBK(bytes);
				}
			},

			// 手动 GBK 解码
			manualDecodeGBK(bytes) {
				let result = '';
				let i = 0;

				while (i < bytes.length) {
					const byte = bytes[i];

					// 如果是 ASCII 字符
					if (byte < 128) {
						result += String.fromCharCode(byte);
						i++;
					} else {
						// 可能是 GBK 双字节字符
						if (i + 1 < bytes.length) {
							const byte2 = bytes[i + 1];
							// 这里可以添加 GBK 到 Unicode 的映射表
							// 对于简单情况，直接跳过或转换为占位符
							result +=
								`[${byte.toString(16)}${byte2.toString(16)}]`;
							i += 2;
						} else {
							i++;
						}
					}
				}

				return result;
			},

			// UTF-8 解码
			decodeUTF8(bytes) {
				const decoder = new TextDecoder('utf-8');
				return decoder.decode(bytes);
			},

			// GB2312 解码
			decodeGB2312(bytes) {
				try {
					const decoder = new TextDecoder('gb2312');
					return decoder.decode(bytes);
				} catch (e) {
					return this.decodeGBK(bytes); // 回退到 GBK
				}
			},

			// 综合健康指数说明
			health_Explanation() {
				this.$refs.health_Explanationpopu.open("center")
			},
			health_Explanationpopuclose() {
				this.$refs.health_Explanationpopu.close()
			}








		},
	}
</script>

<style scoped lang="scss">
	.title_zs {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		color: white;
		padding-top: 70px;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_zs_is {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		color: #3298F7;
		padding-top: 70px;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
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

	.showTotal {
		.show {
			width: 100vw;
			height: 100vh;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			padding-top: 120px;
			padding-left: 10px;
			margin: auto;
			z-index: 10000;
		}

		.over {
			width: 100%;
			height: 100%;
			background-color: #FFFFFF;
			opacity: 0.9; //属性指定了一个元素的不透明度。换言之，opacity 属性指定了一个元素后面的背景的被覆盖程度。
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999; //这一步很重要
		}
	}

	.title_all {
		background: #3298F7;
		border-bottom: 1px solid white;
		width: 100%;
		padding-top: 60px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.title_all_1 {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
	}

	.title {
		color: white;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
	}

	.title1 {
		color: white;
		display: flex;
		width: 100%;
		justify-content: flex-start;
		align-items: left;
		text-align: left;
		flex-direction: column;
		font-weight: 400;
		font-size: 13px;
	}

	.xueya_bg {
		width: 14px;
		height: 14px;
		background: #58BF78;
		border-radius: 15px;
	}

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

	.yalistyds {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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

	.data_item_bg {
		display: flex;
		flex-direction: row;
		background: white;
		width: 45vw;
		margin-left: 10px;
		margin-right: 5px;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		padding: 10px;
	}

	.icon_bg {
		flex: 1;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon_text_bg {
		margin-top: 10px;
		width: 26px;
		height: 18px;
		font-size: 13px;
		text-align: center;
		font-weight: bold;
	}

	.buttonstylesds {
		margin: 20px 50px 20px 50px;
		border-radius: 30px;
		background: #3298F7;
		color: white;
	}

	.uni_popup_bg {
		width: 85vw;
		height: 80vh;
		padding: 10px;
		margin: 15px;
		border-radius: 20px;
		background: white;
	}

	.scroll-Y {
		height: 70vh;
	}

	.title_select_ruler {
		padding-left: 10px;
		font-weight: bold;
		width: 50px;
		white-space: nowrap;
		overflow: auto;
	}

	.img_style {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}

	.tiwei_item_bg {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tiwei_item_item_bg {
		font-size: 16px;
		font-weight: bold;
		margin-top: 10px;
	}

	.text_title_bg {
		margin-top: 10px;
		width: 45px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: auto;
		color: gray;
		text-align: center;
	}

	.tiwei_bg {
		padding: 5px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.tizhong_item_2 {
		margin: 5px 0 10px 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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

	.icon_text_bgsss {
		margin-top: 10px;
		line-height: 15px;
		width: 60px;
		font-size: 13px;
		text-align: center;
		font-weight: 600;
	}

	.icon_bgsss {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.drag-containersss {
		display: flex;
		justify-content: center;
		padding-left: 20px;
	}

	.all {
		background: #EFEFF4;

		.animation-shake {
			animation: shake 1s infinite;
		}

		.animation2-shake {
			animation: shake 1s infinite;
		}
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

	.xueyastyle {
		background: #FFFFFF;
		width: 85vw;
		margin-left: 8vw;
		margin-right: 8vw;
		border-radius: 24px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 20px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 40px;
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


	/* 横向滚动容器 */
	.navscroll {
		width: 100%;
		white-space: nowrap;
		padding: 10px 5px;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		text-align: center;

		::-webkit-scrollbar {
			width: 4px !important;
			height: 1px !important;
			overflow: auto !important;
			background: transparent !important;
			-webkit-appearance: auto !important;
			display: block;
		}
	}

	/* 导航项容器 - 用于水平排列 */
	.nav-container {
		display: inline-flex;

	}

	/* 每个导航项 */
	.item {
		width: 100%;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: 0 20px;
		position: relative;
	}

	/* 导航文字 */
	.tab-text {
		color: white;
		font-size: 16px;
		padding: 5px 0;
		font-weight: 400;
		transition: color 0.3s;
	}

	/* 选中状态的文字 */
	.tab-text.active {
		color: greenyellow;
		font-size: 16px;
		font-weight: 400;
	}

	/* 下划线 */
	.underline {
		width: 100%;
		height: 2px;
		background-color: greenyellow;
		border-radius: 10px;
	}

	/* 内容区域 */
	.content {
		padding: 20px;
		text-align: center;
		font-size: 18px;
	}

	.scroll-view-height {
		// background: #3298F7;
		padding-top: 80px;
	}

	.title_btn_bg {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 56px;
		padding-left: 20px;
		padding-right: 20px;
		align-items: center;
	}

	.textstyles {
		font-size: 16px;
		color: #1A1A1A;
		font-weight: 400;
	}

	.scroll-view {
		margin-top: 20px;
	}

	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box-2 {
		margin-top: 20px;
		padding: 5px;
		background: white;
		border-radius: 20px;
		margin-left: 20px;
		margin-right: 20px;
		height: auto;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.charts-box-ppg {
		padding: 5px;
		background: white;
		border-radius: 20px;
		height: auto;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
	}

	.delete-button {
		position: absolute;
		top: 0;
		left: 0;
		/* 关键：扩大点击区域 */
		background: rgba(0, 0, 0, 0.01);
		/* iOS 必须有点东西才能响应 */
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

	.title_zs_ai {
		display: flex;
		justify-content: center;
		text-align: center;
		color: white;
		padding-top: 60px;
		padding-bottom: 15px;
		align-items: center;
		font-weight: 600;
		font-size: 14px;
		background: #58BF78;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}

	.title_zs_1 {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 60px;
		color: white;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_zs_ppg {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 60px;
		color: black;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_zs_ppg_2 {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		color: black;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.header {
		text-align: center;
		margin-bottom: 50rpx;
	}

	.context_btn2 {
		display: flex;
		margin-left: 5px;
		flex-direction: row;
		background: white;
		align-items: center;
		border-radius: 100px;
		padding: 15px;
	}

	.context_title1 {
		width: 90%;
		font-size: 16px;
		color: black;
	}

	.sleep-card {
		font-size: 14px;
		font-weight: 600;
		color: #3298f7;
	}

	.sleep-title {
		margin-bottom: 6px;
		font-size: 16px;
	}

	.sleep-line {
		color: #040000;
		font-weight: 600;
		font-size: 14px;
		margin-top: 4px;
	}

	.icon_item_bg_toast {
		background: white;
		text-align: center;
		color: #3298F7;
		display: flex;
		padding: 10px;
		justify-content: center;
		align-items: center;
	}


	.toggle-button1 {
		font-size: 10px;
		color: #007aff;
		margin-left: 5px;
		text-align: left;
	}

	.text-content {
		font-size: 10px;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		/* 默认显示3行 */
		-webkit-box-orient: vertical;
	}

	.text-content.expanded {
		-webkit-line-clamp: unset;
		padding: 0 20px 80px 20px;
		/* 展开时显示全部内容 */
	}

	.data_bg_ppg_set {
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: #EFEFF4;
		padding: 20px 0 20px 0;
	}

	.log {
		height: 500px;
		background: #f5f5f5;
		font-size: 24rpx;
		padding: 20px;
		box-sizing: border-box;
	}

	.log-item {
		line-height: 1.5;
		margin-bottom: 10rpx;
		word-break: break-all;
		white-space: pre-wrap;
	}

	.btnstyle {
		margin-top: 20px;
		border-radius: 20px;
		background: #3298F7;
		color: white;
	}

	.pagedsismj_4 {
		background: #3298F7;
		margin: 20px 0;
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
		padding: 15px;
		border-radius: 20px;
	}

	.page {
		background-color: #ffffff;
		min-height: 100vh;
	}



	.table {
		display: table;
		width: 100%;
		border-collapse: collapse;
		border: 2rpx solid #e0e0e0;
	}

	.tr {
		display: table-row;
	}

	.head {
		background-color: #f5f5f5;
	}

	.th,
	.td {
		display: table-cell;
		padding: 16rpx 12rpx;
		border: 2rpx solid #e0e0e0;
		font-size: 28rpx;
		line-height: 1.4;
		vertical-align: middle;
	}

	.th {
		font-weight: bold;
		text-align: center;
	}

	.td:first-child {
		text-align: center;
		font-weight: 500;
	}


	/* 整个页面透明 */
	.page-transparent {
		background: transparent;
		padding: 20rpx;
	}

	/* 表格容器 */
	.table-box {
		display: flex;
		flex-direction: column;
		border: 1rpx solid rgba(0, 0, 0, 0.15);
		border-radius: 8rpx;
		overflow: hidden;
	}

	/* 表头 */
	.thead {
		display: flex;
		background: rgba(0, 0, 0, 0.03);
	}

	.th {
		flex: 1;
		padding: 14rpx 10rpx;
		font-size: 26rpx;
		color: #333;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.th:last-child {
		border-right: 0;
	}

	/* 行 */
	.tbody {
		display: flex;
		border-top: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td {
		flex: 1;
		padding: 12rpx 10rpx;
		font-size: 26rpx;
		color: #444;
		text-align: center;
		border-right: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.td:last-child {
		border-right: 0;
	}

	/* 红色高亮 */
	.red {
		color: #e60012;
		font-weight: 500;
	}
</style>