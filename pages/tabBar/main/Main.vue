<template>
	<view class="all">
		<swiper class="scroll-view-height" :style="{height: screenHeight + 'px'}" @change="swipeIndex"
			:current="currentIndex" acceleration="true" skip-hidden-item-layout="true"
			disable-programmatic-animation="true" :disable-touch="disabletouch">
			<!-- 血压计 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view scroll-view-bp"
					:enable-back-to-top="false" :scroll-with-animation="false" :show-scrollbar="false">
					<view class="bp-home-scroll-inner">
						<!-- <view class="bp-log-panel">
							<view class="bp-log-header">
								<text class="bp-log-title">调试日志(历史/实时/qxBle)</text>
								<view class="bp-log-header-actions">
									<text class="bp-log-copy-btn" @click.stop="copyBpLogs">一键复制</text>
									<text class="bp-log-clear-btn" @click.stop="clearBpLogs">一键清除</text>
								</view>
							</view>
							<scroll-view scroll-y class="bp-log-content" @click="copyBpLogs">
								<text class="bp-log-text">{{ bpLogText || '暂无日志' }}</text>
							</scroll-view>
						</view> -->
						<view class="title_zs_1"></view>
						<BloodPressureSwiperItem :Languageceliang="Languageceliang" :xueya="xueya"
							:title_name="title_name" :Blood="Blood" :highPressure="highPressure"
							:lowPressure="lowPressure" :pulse="pulse" :binaji="binaji" :list="list"
							@update:list="list = $event" :disabledsaaa="disabledsaaa" :animation="animation"
							:delate_icon="delate_icon" :button_show="button_show" @bp-measure-link="xueyaclicklink"
							@xueya-tap="xueya_tap" @xueya-click="xueyaclick" @tiaozhen="tiaozhen"
							@update:disabled="handleUpdateDisabled1" @list-click="listclisck" @bmi-tap="BMI_tap"
							@delete-card="delate_icon_cl" @confirm-cards="ture_bt" @add-card="add_bt_xy" />
					</view>
				</scroll-view>
			</swiper-item>
			<!-- ECG start-->
			<!-- <swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view"
					:scroll-anchoring="true" enhanced bounces>
					<view style="background: white;">
						<view class="title_zs_ECG">{{$t("本页面显示均为最近测量数据")}}</view>
						<EcgSwiperItem
							ref="ecgSwiperItem"
							:statsVisible="statsVisible"
							:baseFeaturesExtracted="baseFeaturesExtracted"
							:derivedFeaturesExtracted="derivedFeaturesExtracted"
							:qualityScore="qualityScore"
							:modelScore="modelScore"
							:ecgdatarows="ecgdatarows"
							@start-measure="startbtn"
							@ecg-item-click="ecgbtn"
						/>
					</view>
				</scroll-view>
			</swiper-item> -->
			<!-- ECG end -->
			<!-- 情绪 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background:#f4f7fb;">
						<view class="title_zs_yundong"></view>
						<EmotionSwiperItem :sleep_alertdisabled="sleep_alertdisabled" :ppgnewpoint="ppgnewpoint"
							:mood_Description="mood_Description" :mood_level="mood_level"
							:depression_risk_score="depression_risk_score" :baoggaodisabled="baoggaodisabled"
							:depression_risk_level="depression_risk_level" :finalResult="finalResult"
							:stress_Index="stress_Index" :fatigue_index="fatigue_index" :recovery_index="recovery_index"
							:sleep_point="sleep_point" :fenxi="fenxi" :types_index="types_index"
							:types_array="types_array" :chartDataPPG="chartDataPPG" :optsPPG="optsPPG"
							:chartDataPPG2="chartDataPPG2" :optsPPG2="optsPPG2" :Indicatorlist="Indicatorlist"
							@setting="setting" @sleep-alert="sleep_alert" @xiangxibaogo="xiangxibaogo"
							@pingfentiaozhuan="pingfentiaozhuan" @health-explanation="health_Explanation"
							@types-change="types_change" />
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 体脂秤 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background:#f4f7fb;">
						<view class="title_zs_yundong"></view>
						<BodyFatSwiperItem :Latest_weight="Latest_weight" :newweightKG="newweightKG"
							:Latest_date="Latest_date" :Initial_weight="Initial_weight" :chuhsikg="chuhsikg"
							:Target_weight="Target_weight" :list2="list2" @update:list2="list2 = $event"
							:binaji2="binaji2" :disabledsaaa2="disabledsaaa2" :animation2="animation2"
							:delate_icon2="delate_icon2" :button_show2="button_show2"
							:Chest_circumference="Chest_circumference" :waistline="waistline"
							:Hip_circumference="Hip_circumference"
							:Upper_Chest_circumference="Upper_Chest_circumference"
							:Thigh_circumference="Thigh_circumference" :Calf_circumference="Calf_circumference"
							@new-latest="new_latest" @initial="Initial" @target="Target" @tiaozhen2="tiaozhen2"
							@update:disabled="handleUpdateDisabled" @bmi-tap="BMI_tap" @delete-card="delate_icon_cl_2"
							@confirm-cards="ture_bt2" @add-card="add_bt2" @body-measure-click="tizhiclick" />
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 睡眠 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #dceefc;">
						<view class="title_zs_yundong"></view>
						<SleepSwiperItem :sleep="sleep" :sleep_time="sleep_time" :totalLight="totalLight"
							:totalDeep="totalDeep" :totalRem="totalRem" :sleep_point="sleep_point"
							:medication="medication" :sleepTip="sleepTip" @medication-change="switch1Change" />
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 步数 -->
			<swiper-item>
				<scroll-view scroll-y="true" :style="{height: screenHeight + 'px'}" class="scroll-view">
					<view style="background: #dceefc;">
						<view class="title_zs_yundong"></view>
						<StepsSwiperItem :bushu="bushu" :bushu_time="bushu_time" :today_Daily_Goal="today_Daily_Goal"
							:dailyGoal="Daily_Goal" @update:dailyGoal="Daily_Goal = $event" :chartData="chartData"
							:opts="opts" :xueya="xueya" @daily-goal-set="Daily_Goal_set"
							@sync-steps="syncStepsFromDevice" />
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
					<view class="show-close-top" @click="closess()">
						<view class="show-close-btn">
							<uni-icons size="28" type="closeempty" color="#FFFFFF"></uni-icons>
						</view>
					</view>
					<view class="show-body">
						<view class="show-date">{{showTotal_date}}</view>
						<view class="show-tip">
							<view class="show-tip-bar"></view>
							<view class="show-tip-text">{{$t('确保每天摄入足够的水')}}</view>
						</view>
						<view class="show-cards">
							<view class="show-card" @click="Keep()">
								<image src="../../../static/icons/6.png" class="show-card-icon"></image>
								<text class="show-card-label">{{$t('记体重')}}</text>
							</view>
							<view class="show-card" @click="Body_circumference()">
								<image src="../../../static/icons/7.png" class="show-card-icon"></image>
								<text class="show-card-label">{{$t('记体围')}}</text>
							</view>
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
							<text>{{$t("千克")}}</text>
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
					<view style="padding: 20px;width: 75vw;box-sizing: border-box;">
						<view
							style="display: flex;flex-direction: row;align-items: center;background: #F7F7F7;padding: 15px;border-radius: 10px;box-sizing: border-box;">
							<input type="number" v-model="mubiao" :placeholder="$t('请输入目标体重')"
								style="flex: 1;min-width: 0;text-align: center;font-size: 16px;" />
							<text
								style="flex-shrink: 0;margin-left: 8px;font-size: 14px;color: #8a94a6;">{{chuhsikg}}</text>
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
	import StepsSwiperItem from './StepsSwiperItem.vue'; //运动页面
	import SleepSwiperItem from './SleepSwiperItem.vue'; //睡眠页面
	import BodyFatSwiperItem from './BodyFatSwiperItem.vue'; //体脂秤页面
	import EmotionSwiperItem from './EmotionSwiperItem.vue'; //情绪页面
	import BloodPressureSwiperItem from './BloodPressureSwiperItem.vue'; //血压计页面
	import EcgSwiperItem from './EcgSwiperItem.vue'; //ECG页面
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
	import {
		u16proBLE
	} from '../../api/protocol/u16pro-ble-manager.js'
	import {
		U16ProProtocol
	} from '../../api/protocol/u16pro-protocol.js'
	import {
		BC_BLE_UUID,
		BC_PACKET,
		DATA_TYPE
	} from '../../api/protocol/u16pro-constants.js'
	//BPW1手表对应蓝牙参数值
	const BPW1serviceId = "81EEA001-E735-49EC-8A11-7E32CAE1E14E"; //服务值
	const BPW1write = "81EEA003-E735-49EC-8A11-7E32CAE1E14E"; //写入值
	const BPW1notify = "81EEA002-E735-49EC-8A11-7E32CAE1E14E"; //通知值
	//优瑞恩手表对应蓝牙参数值
	const BPW6SERVICE = '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E'; //服务值
	const BPW6WRITE = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'; //写入值
	const BPW6NOTIFY = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'; //通知值
	// ECG start
	const SERVICE_ID = '0000FF00-0000-1000-8000-00805F9B34FB'
	const WRITE_UUID = '0000FF02-0000-1000-8000-00805F9B34FB'
	const NOTIFY_UUID = '0000FF01-0000-1000-8000-00805F9B34FB'
	const CMD_ECG_START = [0xA5, 0x12, 0x01, 0x13, 0x0A]
	const CMD_ECG_STOP = [0xA6, 0x15, 0x01, 0x17, 0x0A]
	// ECG end
	import {
		onQxBleWatchCollectionEnded
	} from '@/pages/api/qxBleAlignedSchedule.js'
	/** BPW1手表 OTA 写入 otadatares 后，情绪测量需使用新命令的固件标识值 */
	const OTA_DATA_RES_EMOTION_CMD_IDS = [
		'6986AF9F0656352E382E350741423536313043',
		'69C0EB890656352E382E370741423536313043',
		'69D616630656352E382E380741423536313043',
		'69E5814C0656352E382E390741423536313043',
		'69E587830656352E382E380741423536313043',
	];
	/** 读 BPW1 固件标识（otadatares 可能被 OTA 比对清掉，回退 otaBP） */
	function readBpw1OtaFirmwareId() {
		const a = String(uni.getStorageSync('otadatares') || '').toUpperCase()
		const b = String(uni.getStorageSync('otaBP') || '').toUpperCase()
		return a || b
	}

	function isBpw1NewEmotionFirmware() {
		const id = readBpw1OtaFirmwareId()
		return !!(id && OTA_DATA_RES_EMOTION_CMD_IDS.includes(id))
	}
	import {
		getLocalTimeAllJSON,
		getChinaTimeAllJSON,
		chinaWallClockToMs,
		checkTimezoneChanged,
		getGMTTimezoneStrict,
		getDeviceTimeZone,
	} from '../../api/unitls/timezone.js';
	export default {
		components: {
			BasicDrag,
			FloatButton,
			PpgWaveform,
			StepsSwiperItem,
			SleepSwiperItem,
			BodyFatSwiperItem,
			EmotionSwiperItem,
			BloodPressureSwiperItem,
			EcgSwiperItem,
		},
		computed: {
			...mapState(['info', 'getpendinglenth', 'acktypes', 'acktypes6', 'xueyehuilian', 'xueyjitypesd']),
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
			},
			tabs() {
				return [this.$t('心血管'), this.$t('情绪'), this.$t('体重'), this.$t('睡眠'), this.$t('运动')]
			},
			buttonPattern() {
				const menuItems = [{
						icon: '/static/page_icon/aipbg.jpg',
						text: this.$t("报告"),
						handler: () => {
							uni.navigateTo({
								url: '/pages/tabBar/main/report_all_type/report_all_type'
							})
						}
					},
					{
						icon: '/static/page_icon/jinggaotishijingbaoyujing.png',
						text: this.$t("警报"),
						handler: () => {
							uni.navigateTo({
								url: "/pages/tabBar/my/Alarms"
							})
						}
					},
					{
						icon: '/static/page_icon/dingshiBP.png',
						text: this.$t("监测"),
						handler: () => {
							const hasBpw1 = (this.devicetypelist || []).includes(30000) ? 1 : 0
							uni.navigateTo({
								url: "/pages/tabBar/main/globalweather/Monitoring?devicetype=" + this
									.devicetype + "&devicetypelist=" + this.devicetypelist.length +
									"&hasBpw1=" + hasBpw1
							})
						}
					},
				]
				return {
					theme: 'primary',
					icon: '/static/page_icon/aipbg.jpg',
					menuItems
				}
			},
			bpLogText() {
				return this.bpDebugLogs
					.map(log => `[${log.time}] ${log.text}`)
					.join('\n');
			},
		},
		data() {
			// 获取本地时间
			const now = new Date();
			const year = now.getFullYear();
			const month = (now.getMonth() + 1).toString().padStart(2, '0');
			const day = now.getDate().toString().padStart(2, '0');
			const boolhistoday = `${year}-${month}-${day}`; // 本地日期，不是 UTC
			const yali_time = `${month}/${day}`; // 02/27 (洛杉矶) 或 02/28 (北京)
			return {
				Languageceliang: uni.getLocale(),
				sleep_alertdisabled: false,
				sleep_alertid: 0,
				immediateEmotionMeasure: false,
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
				types_index: Number(uni.getStorageSync("types_index") || 0),
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
				Blood: uni.getStorageSync("Blood") === 0 || uni.getStorageSync("Blood") === "" ? "mmHg" : "kPa",
				bluetoothManager: null,
				stepsData: {}, // 用于存储每天步数的对象
				_stepsWeekFetching: false,
				_bpw6DailyWeekReading: false,
				timer: null, // 定时器变量
				timertwslist: null,
				screenHeight: windowHeight,
				// swiper索引
				currentIndex: 0,
				scrollLeft: 0,
				disabletouch: false,
				msg: true,
				connectedDevices: {}, // 存储已连接设备的信息
				deviceList: [], // 存储搜索到的设备列表
				endtimesss: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,
				//心血管初始卡片
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
					type_LX: "BPM",
					Step_count: "-"
				}, ],
				//体重初始卡片
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
							data: [],
							textOffset: -18,
							textColor: "#000000"
						},
						{
							legendShape: "none",
							name: "",
							data: [],
							textOffset: -18,
							textColor: "#000000"
						}, {
							legendShape: "none",
							name: "",
							data: [],
							textOffset: -18,
							textColor: "#000000"
						}, {
							legendShape: "none",
							name: "",
							data: [],
							textOffset: -18,
							textColor: "#000000"
						}, {
							legendShape: "none",
							name: "",
							data: [],
							textOffset: -18,
							textColor: "#000000"
						}
					]
				},
				optsPPG: {
					color: ["#3298F7", "#3298F7", "#3298F7", "#3298F7", "#3298F7"],
					padding: [28, 15, 0, 5],
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
						data: [],
						textOffset: -18,
						textColor: "#000000"
					}, {
						legendShape: "none",
						name: "",
						data: [],
						textOffset: -18,
						textColor: "#000000"
					}, {
						legendShape: "none",
						name: "",
						data: [],
						textOffset: -18,
						textColor: "#000000"
					}, {
						legendShape: "none",
						name: "",
						data: [],
						textOffset: -18,
						textColor: "#000000"
					}, {
						legendShape: "none",
						name: "",
						data: [],
						textOffset: -18,
						textColor: "#000000"
					}]
				},
				optsPPG2: {
					color: ["#3298F7", "#3298F7", "#3298F7", "#3298F7", "#3298F7"],
					padding: [28, 15, 0, 5],
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
					color: ["#3298F7"],
					padding: [15, 10, 0, 5],
					enableScroll: false,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						fontSize: 10,
						itemCount: 7
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
							width: 18,
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
				deviceIdwatch6: '',
				deviceIdwatch6_SN: '',
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
				// 本地刚写入血氧卡片时，避免 list_recipe 用服务端旧 updateTime 覆盖时间
				oxygenbiaoshi: "",
				lixianlist: [],
				PPGdataarray: 0x05,
				bufferPPG: [],
				depression_risk_level: "", //心理健康评估抑郁风险评分
				depression_risk_score: '', //心理健康评估抑郁风险等级
				depression_recommendation: '', //心理健康评估专业建议
				stress_Index: '',
				fatigue_index: '',
				recovery_index: '',
				hasSynced: false, // 本进程 BPW1 是否已做过连接后历史同步（杀进程重开需再同步）
				hasSynced6: true,
				// BPW1：进入睡眠页时额外同步历史一次（睡眠数据在历史同步命令中）
				bpw1SleepHistorySyncedOnce: false,
				MoodDays: "",
				StressFatigueDays: "",
				blewatch_id: "1",
				blewatch_id2: "1",
				// 当天天气
				weatherData: null,
				weatherDataID: "",
				weatherDataID7: "",
				finlretVarList1: 'BPvSBPvCNTv3DvCNTv0002,BPvSBPvCNTv3DvCNTv0003,BPvSBPvCNTv3DvCNTv0004,BPvSBPvCNTv3DvCNTv0001,JLvRULEv3DvDATACHECKv0001,JLvRULEv3DvDATACHECKv0002,JLvRULEv3DvDATACHECKv0003,BPvSBPvAVGv3DvAVGv0002,BPvDBPvAVGv3DvAVGv0002,BPvHRvAVGv3DvAVGv0002,BPvSBPvAVGv3DvAVGv0003,BPvDBPvAVGv3DvAVGv0003,BPvHRvAVGv3DvAVGv0003,BPvSBPvAVGv3DvAVGv0004,BPvDBPvAVGv3DvAVGv0004,BPvHRvAVGv3DvAVGv0004,BPvSBPvAVGv3DvAVGv0001,BPvDBPvAVGv3DvAVGv0001,BPvHRvAVGv3DvAVGv0001,JLvRULEv3DvBPCHECKv0004,JLvRULEv3DvBPCHECKv0005,JLvRULEv3DvBPCHECKv0007,JLvRULEv3DvBPCHECKv0008,JLvRULEv3DvBPCHECKv0010,JLvRULEv3DvBPCHECKv0011,JLvRULEv3DvBPCHECKv0001,JLvRULEv3DvBPCHECKv0002,BPvSBPvSTDv3DvSTDv0002,BPvDBPvSTDv3DvSTDv0002,BPvHRvSTDv3DvSTDv0002,BPvSBPvSTDv3DvSTDv0003,BPvDBPvSTDv3DvSTDv0003,BPvHRvSTDv3DvSTDv0003,BPvSBPvSTDv3DvSTDv0004,BPvDBPvSTDv3DvSTDv0004,BPvHRvSTDv3DvSTDv0004,BPvSBPvSTDv3DvSTDv0001,BPvDBPvSTDv3DvSTDv0001,BPvHRvSTDv3DvSTDv0001,BPvSBPvMAXv3DvMAXv0002,BPvDBPvMAXv3DvMAXv0002,BPvHRvMAXv3DvMAXv0002,BPvSBPvMAXv3DvMAXv0003,BPvDBPvMAXv3DvMAXv0003,BPvHRvMAXv3DvMAXv0003,BPvSBPvMAXv3DvMAXv0004,BPvDBPvMAXv3DvMAXv0004,BPvHRvMAXv3DvMAXv0004,BPvSBPvMAXv3DvMAXv0001,BPvDBPvMAXv3DvMAXv0001,BPvHRvMAXv3DvMAXv0001,BPvSBPvMEDv3DvMEDv0002,BPvDBPvMEDv3DvMEDv0002,BPvHRvMEDv3DvMEDv0002,BPvSBPvMEDv3DvMEDv0003,BPvDBPvMEDv3DvMEDv0003,BPvHRvMEDv3DvMEDv0003,BPvSBPvMEDv3DvMEDv0004,BPvDBPvMEDv3DvMEDv0004,BPvHRvMEDv3DvMEDv0004,BPvSBPvMEDv3DvMEDv0001,BPvDBPvMEDv3DvMEDv0001,BPvHRvMEDv3DvMEDv0001,BPvSBPvMINv3DvMINv0002,BPvDBPvMINv3DvMINv0002,BPvHRvMINv3DvMINv0002,BPvSBPvMINv3DvMINv0003,BPvDBPvMINv3DvMINv0003,BPvHRvMINv3DvMINv0003,BPvSBPvMINv3DvMINv0004,BPvDBPvMINv3DvMINv0004,BPvHRvMINv3DvMINv0004,BPvSBPvMINv3DvMINv0001,BPvDBPvMINv3DvMINv0001,BPvHRvMINv3DvMINv0001,BPvSBPvLOADv3DvRATIOv0002,BPvDBPvLOADv3DvRATIOv0002,BPvSBPvLOADv3DvRATIOv0003,BPvDBPvLOADv3DvRATIOv0003,BPvSBPvLOADv3DvRATIOv0004,BPvDBPvLOADv3DvRATIOv0004,BPvSBPvLOADv3DvRATIOv0001,BPvDBPvLOADv3DvRATIOv0001,JLvRULEv3DvBPCHECKv0022,JLvRULEv3DvBPCHECKv0027,JLvRULEv3DvBPCHECKv0023,JLvRULEv3DvBPCHECKv0028,JLvRULEv3DvBPCHECKv0024,JLvRULEv3DvBPCHECKv0029,JLvRULEv3DvBPCHECKv0021,JLvRULEv3DvBPCHECKv0026,BPvSBPvNBRv3DvRATIOv0001,BPvDBPvNBRv3DvRATIOv0001,JLvRULEv3DvBPCHECKv0013,JLvRULEv3DvBPCHECKv0014,JLvRULEv3DvBPCHECKv0015,JLvRULEv3DvBPCHECKv0016,JLvRULEv3DvBPCHECKv0017,JLvRULEv3DvBPCHECKv0018, JLvRULEv3DvBPCHECKv0019, JLvRULEv3DvBPCHECKv0020,BPvSBPvMBSv3DvMINUSv0001,BPvDBPvMBSv3DvMINUSv0001,JLvRULEv3DvBPCHECKv0031,BPvSBPvCVv3DvRATIO2v0002,BPvDBPvCVv3DvRATIO2v0002,BPvHRvCVv3DvRATIO2v0002,BPvSBPvCVv3DvRATIO2v0003,BPvDBPvCVv3DvRATIO2v0003,BPvHRvCVv3DvRATIO2v0003,BPvSBPvCVv3DvRATIO2v0004,BPvDBPvCVv3DvRATIO2v0004,BPvHRvCVv3DvRATIO2v0004,BPvSBPvCVv3DvRATIO2v0001,BPvDBPvCVv3DvRATIO2v0001,BPvHRvCVv3DvRATIO2v0001,BPvAASIv3D,JLvRULEv3DvBPCHECKv0032',
				yalixueyatype: false,
				hrResult: [],
				bpResult: [],
				deviceSnuserID: [],
				currentDatehis: boolhistoday,
				boolserverData: null,
				boolserverOxygenData: null,
				bpw6BpBuffer: [],
				bpw6HrBuffer: [],
				bpw6SpO2Buffer: [],
				bpw6PpgCloudLoadingActive: false,
				bpw6ManualEmotionUiPhase: 'idle', // idle | measuring | cloud — 仅手动立即测量
				bpw6PpgSilentAfterBp: false, // 血压测完自动启 PPG：不弹 loading/toast
				bpw6AwaitingPpgAfterBp: false, // 血压后等 20s 启 PPG：仅此期间挡调度误恢复
				bpw6BpHistorySyncing: false,
				bpw6RealtimeBpPending: false, // 手表实时测完血压后置 true，仅此时启 PPG
				bpw6RealtimeSpO2Pending: false, // 手表实时测完血氧后置 true，上报用手机本地时间
				bpw6RealtimeUploadKey: '', // 实时路径占位的最新血压键，历史批量跳过该条
				bpw6BpHistoryUploading: false, // 防止多次 BP_history_empty 并发批量上报
				bpw6UploadedBpKeySet: null, // BPW6 本会话已上报血压键（兼容 unix/墙钟，防实时+历史重复）
				bpw6UploadedSpO2Map: null, // BPW6 本会话已上报血氧：Map(key→value)，含 unix/墙钟多键，防切时区重复
				bpw1HistorySyncing: false, // BPW1 历史同步中：期间禁止自动启 PPG（勿依赖 blewatch_id，睡眠包会提前清零）
				bpw1HistorySyncTimer: null,
				bpw1PendingManualPpg: false, // 同步中点了情绪立即测量：同步结束后再启 PPG
				bpw1PendingBpAfterPpg: false, // 同步中完成实时血压：同步结束后再启血压后 PPG
				bpw1PpgUploadDone: false, // 本轮 PPG Status02 只上传一次，防重复 notify 连发
				bpw1PpgStatus02Handled: false, // 本轮 Status02 业务只处理一次（设备常连发）
				bpw1PpgSessionActive: false, // 仅立即测量/定时情绪/血压后自动 PPG 为 true；纯心率不启 PPG
				bpw1PureHrMeasureActive: false, // 卡片遥控纯心率：强制不进 PPG/情绪会话
				// 历史同步结束后短时静默：挡住尾包再写首页脉搏/卡片
				bpw1HistoryUiMuteUntil: 0,
				bpw1LocalHrCardProtectUntil: 0, // 刚测心率后短时保护，防夜间历史包/概览闪跳
				bpw1UploadedBpTimeSet: null, // 本会话已上报血压的测量时间戳，防改时区/重连重复上报
				bpw1UploadedHrTimeSet: null, // 本会话已上报心率：Map(time→value)，同槽位数值变化允许覆盖上报
				bpw1UploadedSpO2TimeSet: null, // 本会话已上报血氧：Map(time→value)，同槽位数值变化允许覆盖上报
				bpw1PendingHrHistory: [], // 历史同步期间缓存心率，同步结束后补报未随血压上报的
				bpw1PendingHrDevice: null,
				bpw1PendingBpHistory: [], // 历史同步：血压先到时暂存，等心率到齐后合并同报
				bpw1PendingBpDevice: null,
				// 历史同步/宽限期内先入队，安静后正序串行上报（跨包汇总后旧→新）
				bpw1DeferredHistoryUploads: [],
				bpw1DeferredFlushTimer: null,
				// 本轮同步收到的全部心率（墙钟键）。flush 清 pending 后仍保留，供血压尾包/异步 merge 配对
				bpw1SyncSessionHrMap: null,
				bpw1HistoryGraceUntil: 0, // 同步结束后宽限期：尾包仍按历史全量处理
				bpw1HistoryFlushTimer: null, // 延迟丢弃未配血压，给尾包/异步 merge 时间
				bpw1RecentRealtimeHr: [], // 实时心率短缓存：供血压包按设备墙钟合并上报
				bpw1RealtimeHrConsumedKeys: null, // 已被血压合并消费的心率墙钟 key
				bpw1RecentRealtimeBpWallKeys: null, // 刚上报/挂起的实时血压设备墙钟，挡住迟到心率单独报
				bpw1PendingBpHrUpload: null, // 实时血压挂起：等同秒心率到齐后一次上报 {wallKey,systolic,...}
				bpw1NotifyQueue: [], // BPW1 E0 串行：回 ACK 后再解析下一条
				bpw1NotifyProcessing: false,
				bpw1RecentAckKeys: null, // 同包去重，避免入口 ACK 与业务 ACK 重复写入
				BPW1deviceId: "",
				isProcessed: uni.getStorageSync("isProcessed") || false, // 标志位
				Taking_pulse: [],
				QX_FAIL: false,
				QX_HIDE: true,
				devicetype: 30000,
				devicetypelist: [],
				//ECG start
				connected: false,
				connecting: false,
				tip: '点击"连接血压计"开始',
				dataCount: 0,
				fullDataCount: 0,
				statsVisible: true,
				dataSource: '未连接',
				queueLength: 0,
				deviceId: '',
				notifyCharacteristicId: '',
				writeCharacteristicId: '',
				buffer: '',
				sendCnt: 0,
				measurementStatus: '', // 测量状态
				deviceIdECG: '',
				deviceIdECG_SN: '',
				serviceIdECG: '',
				uuidECG: '',
				ecgdatarows: [],
				baseFeaturesExtracted: '',
				derivedFeaturesExtracted: '',
				qualityScore: '',
				modelScore: '',
				ecgtimsdpad: null,
				//ECG end
				bpDebugLogs: [],
			}
		},

		mounted() {
			// 初始化时加载本地存储的数据
			this.loadStepsFromStorage();
			// 每天检查并保存步数数据
			this.timer = setInterval(this.saveDailySteps, 24 * 60 * 60 * 1000); // 每24小时触发一次
			// BPW1：手机蓝牙关开后补拉历史（不影响切页不重复同步）
			this.ensureBPW1AdapterHistoryResyncListener()
			// qxBleAlignedSchedule.logQx → 首页调试面板
			this._onQxBleLog = (text) => {
				// if (text) this.addlog(text)
			}
			uni.$on('qxBleLog', this._onQxBleLog)
			// 定时测量遇 10002 时请求重连 BPW1/BPW6
			this._onQxBleNeedReconnect = (payload) => {
				this.onQxBleNeedReconnect(payload)
			}
			uni.$on('qxBle:needReconnect', this._onQxBleNeedReconnect)
			// BPW6 定时测量：0x58 丢失时由调度兜底通知拉取上报（不影响立即测量）
			this._onQxBpw6PpgPullNeeded = (payload) => {
				this.onQxBpw6PpgPullNeeded(payload)
			}
			uni.$on('qxBle:bpw6PpgPullNeeded', this._onQxBpw6PpgPullNeeded)
			// 定时调度侧只写 storage，同步到 Vue 以便立即测量按钮置灰
			this._onQxSleepAlertDisabled = (val) => {
				const busy = val === true || val === 'true' || val === 1 || val === '1'
				// 手动立即测量进行中：忽略调度侧解锁，避免前后台切换把按钮提前恢复
				if (!busy && this.isBpw6ManualEmotionSession()) {
					this.sleep_alertdisabled = true
					uni.setStorageSync('sleep_alertdisabled', true)
					return
				}
				// 血压后等 20s 启 PPG：禁止调度侧提前恢复立即测量按钮
				if (!busy && this.bpw6AwaitingPpgAfterBp) {
					this.sleep_alertdisabled = true
					uni.setStorageSync('sleep_alertdisabled', true)
					return
				}
				// BPW1 PPG 会话中：忽略调度侧解锁
				if (!busy && this.shouldBlockBpw1PpgButtonRecover()) {
					this.sleep_alertdisabled = true
					uni.setStorageSync('sleep_alertdisabled', true)
					return
				}
				this.sleep_alertdisabled = busy
				uni.setStorageSync('sleep_alertdisabled', busy)
				if (busy && this.shouldUseBpw6PpgForEmotion() && !this.immediateEmotionMeasure) {
					// 定时测量：无弹窗，仅锁按钮
					this.bpw6PpgSilentAfterBp = true
					if (!this._bpw6EmotionMeasureStartedAt) {
						this._bpw6EmotionMeasureStartedAt = Date.now()
					}
					this.armBPW6EmotionButtonWatchdog(120)
					return
				}
				// 调度启动失败等：未进入读取/云端时解除静默（不含血压后等 20s）
				if (!busy && !this.immediateEmotionMeasure && !this.bpw6PpgReading && !this
					.bpw6PpgCloudLoadingActive && !this.bpw6AwaitingPpgAfterBp) {
					this.bpw6PpgSilentAfterBp = false
					this.clearBpw6EmotionWatchdog()
					this._bpw6EmotionMeasureStartedAt = 0
				}
			}
			uni.$on('qxBle:sleepAlertDisabled', this._onQxSleepAlertDisabled)
			this._onUnitSettingsChanged = () => {
				this.Blood = uni.getStorageSync('Blood') === 0 || uni.getStorageSync('Blood') === '' ? 'mmHg' :
					'kPa'
				this.lastWeightbishi = ''
				this.syncWeightUnitsFromStorage()
				this.hydrateBpFromStorage()
			}
			uni.$on('unit-settings-changed', this._onUnitSettingsChanged)
			try {
				const app = getApp()
				if (app) {
					if (!app.globalData) app.globalData = {}
					app.globalData.mainPageVm = this
				}
			} catch (e) {}
			this._onManualSyncHistory = () => {
				this.manualSyncBoundDeviceHistory()
			}
			uni.$on('REQUEST_DEVICE_HISTORY_SYNC', this._onManualSyncHistory)
		},

		beforeDestroy() {
			// 清除定时器，避免内存泄漏
			clearInterval(this.timer);
			if (this._onQxBleLog) {
				uni.$off('qxBleLog', this._onQxBleLog)
				this._onQxBleLog = null
			}
			if (this._onQxBleNeedReconnect) {
				uni.$off('qxBle:needReconnect', this._onQxBleNeedReconnect)
				this._onQxBleNeedReconnect = null
			}
			if (this._onQxBpw6PpgPullNeeded) {
				uni.$off('qxBle:bpw6PpgPullNeeded', this._onQxBpw6PpgPullNeeded)
				this._onQxBpw6PpgPullNeeded = null
			}
			if (this._onQxSleepAlertDisabled) {
				uni.$off('qxBle:sleepAlertDisabled', this._onQxSleepAlertDisabled)
				this._onQxSleepAlertDisabled = null
			}
			if (this._onUnitSettingsChanged) {
				uni.$off('unit-settings-changed', this._onUnitSettingsChanged)
				this._onUnitSettingsChanged = null
			}
			if (this._onManualSyncHistory) {
				uni.$off('REQUEST_DEVICE_HISTORY_SYNC', this._onManualSyncHistory)
				this._onManualSyncHistory = null
			}
			try {
				const app = getApp()
				if (app && app.globalData && app.globalData.mainPageVm === this) {
					app.globalData.mainPageVm = null
				}
			} catch (e) {}
		},

		onHide() {
			this.sethuilian(false);
			this.QX_HIDE = false
			// 退后台后系统会收掉 loading；清去重标记，回前台可再显示一次（不重复刷）
			this._bpw6LastLoadingPhase = ''
			if (this.timsdpad) {
				clearInterval(this.timsdpad);
				this.timsdpad = null;
			}
		},

		onShow() {
			let that = this
			that.sethuilian(true)
			that.syncBloodCardListFromStorage()
			uni.removeStorageSync("jiance")
			uni.setStorageSync("last_app_version", systemInfo.appVersion)
			that.initPage();
			clearDailyGoalData(); // 在数据操作前检查清除步数数据
			that.today_Daily_Goal = uni.getStorageSync("today_Daily_Goal") || "0"
			if (that.acktypes === "0") {
				// 未连接：允许下次连上后同步一次历史（含杀进程重开）
				that.hasSynced = false;
				that.bpw1SleepHistorySyncedOnce = false;
			} else {
				// 已连接时重进页面不再触发历史同步（仅首次握手/杀进程重开后同步）
			}
			if (that.acktypes6 === "0") {
				that.hasSynced6 = true;
			} else {
				that.hasSynced6 = false;
			}
			that.QX_HIDE = true
			// 调度侧可能已写 storage：回前台同步按钮置灰态
			that.syncBpw6EmotionButtonBusyFromStorage()
			// 手动立即测量中：强制锁按钮，再按态恢复 loading（不重复弹）
			if (that.isBpw6ManualEmotionSession()) {
				that.sleep_alertdisabled = true
				uni.setStorageSync('sleep_alertdisabled', true)
			}
			that.resumeBpw6EmotionMeasureOnShow()
			uni.getNetworkType({ //判断是否有网络连接
				success: function(res) {
					if (res.networkType === 'none') {
						that.Offline_mode()
					} else {
						that.Network_available()
					}
				},
			});
		},

		methods: {

			...mapMutations(['getInfo', 'setacktypes', 'setacktypes6', 'setbanhua', 'sethuilian', 'setxueyjitypesd']),

			// <--------------------------------------数据解析相关工具类start-------------------------------------->
			//时间工具类1
			formatTimestampKey(timestamp) {
				const date = new Date(timestamp * 1000);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			//时间工具类2
			normalizeDateTimeKey(dateTimeKey) {
				if (!dateTimeKey) {
					return '';
				}
				const trimmed = String(dateTimeKey).trim().replace(/\//g, '-');
				const spaceIdx = trimmed.indexOf(' ');
				if (spaceIdx === -1) {
					return trimmed;
				}
				const datePart = trimmed.slice(0, spaceIdx);
				const timePart = trimmed.slice(spaceIdx + 1);
				const segments = timePart.split(':');
				const h = (segments[0] || '00').padStart(2, '0');
				const m = (segments[1] || '00').padStart(2, '0');
				const s = (segments[2] || '00').padStart(2, '0');
				return `${datePart} ${h}:${m}:${s}`;
			},
			//时间工具类3
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
			//时间工具类4：墙钟字符串按手机本地时区解析为秒级时间戳
			datatime(dateStr) {
				const ms = this.parseWallClockToLocalMs(dateStr)
				if (!Number.isFinite(ms) || ms <= 0) {
					return 0
				}
				return Math.floor(ms / 1000)
			},
			/**
			 * 解析上报用的「手机本地墙钟」字符串（YYYY-MM-DD HH:mm:ss）
			 * - 秒/毫秒戳：按该瞬间的手机本地墙钟
			 * - 无时区墙钟：视为手机本地墙钟数字（手表已按手机校时）
			 * - 无效：当前手机本地墙钟
			 */
			resolveUploadLocalWall(measureTime) {
				if (measureTime !== '' && measureTime != null) {
					const raw = measureTime
					const asNum = Number(raw)
					if (Number.isFinite(asNum) && asNum > 0) {
						let sec = asNum
						if (asNum >= 1e12) sec = Math.floor(asNum / 1000)
						else if (asNum > 1e9 && asNum < 1e12) sec = Math.floor(asNum)
						else sec = 0
						if (sec > 1e9) {
							const wall = getLocalTimeAllJSON(new Date(sec * 1000)).YMDHMS
							if (wall) return wall
						}
					}
					const text = String(raw).trim().replace(/\//g, '-')
					const m = text.match(
						/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
					)
					if (m) {
						const y = m[1]
						const mo = String(m[2]).padStart(2, '0')
						const d = String(m[3]).padStart(2, '0')
						const h = String(m[4] || 0).padStart(2, '0')
						const mi = String(m[5] || 0).padStart(2, '0')
						const s = String(m[6] || 0).padStart(2, '0')
						return `${y}-${mo}-${d} ${h}:${mi}:${s}`
					}
					const fromWall = this.datatime(text)
					if (fromWall > 0) {
						const wall = getLocalTimeAllJSON(new Date(fromWall * 1000)).YMDHMS
						if (wall) return wall
					}
				}
				return getLocalTimeAllJSON().YMDHMS
			},
			/**
			 * 上报接口 time 字段：
			 * 服务端按中国时区(+8)展示 unix。为使展示日期/时刻与手机本地墙钟一致，
			 * 将「手机本地墙钟数字」按 +8 编码成 time（中国用户无差异；海外用户不再被显示成中国日期）。
			 */
			resolveUploadTimeSec(measureTime) {
				const localWall = this.resolveUploadLocalWall(measureTime)
				const ms = chinaWallClockToMs(localWall)
				if (Number.isFinite(ms) && ms > 0) {
					return Math.floor(ms / 1000)
				}
				return this.datatime(getLocalTimeAllJSON().YMDHMS)
			},
			/**
			 * 上报 time + measurementTimezone
			 * - time：供服务端 +8 展示时等于手机本地墙钟
			 * - measurementTimezone：手机本地墙钟字符串
			 */
			buildUploadTimeFields(measureTime) {
				const measurementTimezone = this.resolveUploadLocalWall(measureTime)
				const ms = chinaWallClockToMs(measurementTimezone)
				const time = (Number.isFinite(ms) && ms > 0) ?
					Math.floor(ms / 1000) :
					this.datatime(measurementTimezone)
				return {
					time,
					measurementTimezone
				}
			},
			/** 实时测量：手机本地当前瞬间的真实 unix（首页卡片用）；上报时再经 buildUploadTimeFields 编码 */
			resolveRealtimeUploadTimeSec() {
				return this.datatime(getLocalTimeAllJSON().YMDHMS)
			},
			/**
			 * 无时区墙钟（YYYY-MM-DD HH:mm:ss）→ 手机本地时区毫秒时间戳
			 * 不强制 +08:00，避免凌晨跨日卡片/上报偏一天
			 */
			parseWallClockToLocalMs(dateStr) {
				if (dateStr == null || dateStr === '') {
					return NaN
				}
				const raw = String(dateStr).trim()
				if (!raw) {
					return NaN
				}
				if (/^\d+$/.test(raw)) {
					let n = Number(raw)
					if (!Number.isFinite(n) || n <= 0) {
						return NaN
					}
					if (n < 1e12) {
						n = n * 1000
					}
					return n
				}
				const m = raw.match(
					/(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
				)
				if (m) {
					const d = new Date(
						Number(m[1]),
						Number(m[2]) - 1,
						Number(m[3]),
						Number(m[4] || 0),
						Number(m[5] || 0),
						Number(m[6] || 0),
						0
					)
					const t = d.getTime()
					return Number.isFinite(t) ? t : NaN
				}
				// 已带时区的 ISO：交给 Date 解析
				const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T')
				const parsed = new Date(normalized).getTime()
				return Number.isFinite(parsed) ? parsed : NaN
			},
			//时间工具类5，UTC时间戳
			UTCdatatime() {
				// 获取当前时间的 UTC 时间戳（毫秒级）
				const timestampMs = Date.now();
				// 如果需要秒级时间戳，除以1000并取整
				const timestampSec = Math.floor(Date.now() / 1000);
				return {
					timestampMs: timestampMs,
					timestampSec: timestampSec
				}
			},

			// 读取设备唯一码文件
			async readFileWithBase64(filePath) {
				return new Promise((resolve, reject) => {
					plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
							entry.file((file) => {
									const reader = new plus.io.FileReader();
									reader.onloadend = (e) => {
										try {
											// 读取为 Base64
											const base64 = e.target.result;
											const text = this.decodeBase64(base64);
											resolve(text.trim());
										} catch (error) {
											reject(error);
										}
									};
									reader.onerror = (e) => {
										console.error('读取错误:', e.target.error);
										reject(e.target.error);
									};
									// 关键：使用 readAsDataURL 获取 Base64
									reader.readAsDataURL(file);
								},
								reject
							);
						},
						reject
					);
				});
			},
			// 正确的 Base64 解码方法
			decodeBase64(base64String) {
				// 1. 移除 data:text/plain;base64, 前缀
				const base64Data = base64String.replace(/^data:text\/plain;base64,/, '');
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
							result += `[${byte.toString(16)}${byte2.toString(16)}]`;
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
			//卡片相关解析
			formatDatacard(dataArray) {
				return dataArray.map(obj => JSON.stringify(obj).replace(/"/g, '')).join(','); // 多条之间用换行分隔（可改 | 或 ,）
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
			//通用时间（跟随设备时区，改时区后实时生效）
			getTimeAllJSON() {
				return getLocalTimeAllJSON()
			},
			// 辅助方法：计算分包数量
			calculateQuotient(totalLength, packetSize) {
				return Math.ceil(totalLength / packetSize);
			},
			// ArrayBuffer转十六进制字符串
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function(bit) {
					return ('00' + bit.toString(16)).slice(-2)
				})
				return hexArr.join('');
			},
			ab2str(buffer) {
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

			intToHex(num, prefix = false, padLength = 0) {
				let hex = num.toString(16).toUpperCase();
				if (padLength > 0) {
					hex = hex.padStart(padLength, '');
				}
				return prefix ? hex : hex;
			},
			compressFloatArray(arr) {
				// 1. 转 4 字节小端浮点
				const bytes = new ArrayBuffer(arr.length * 4);
				const view = new DataView(bytes);
				arr.forEach((v, i) => view.setFloat32(i * 4, v, true)); // true=小端
				// 2. gzip 压缩
				const compressed = pako.gzip(new Uint8Array(bytes));
				// 3. 转 base64（方便 JSON 传输）
				return uni.arrayBufferToBase64(compressed);
			},

			computeEcgVoltageRange(arr) {
				if (!arr || arr.length === 0) return 500;
				const signalMin = Math.min(...arr);
				const signalMax = Math.max(...arr);
				return Math.max(Math.abs(signalMin), Math.abs(signalMax)) * 1.2;
			},
			// 根据数据实际范围动态计算 voltageRange
			ECGpackInt16(arr) {
				const n = arr.length;
				const ab = new ArrayBuffer(n * 2);
				const view = new DataView(ab);
				// 找到数据实际范围
				let maxVal = Math.max(...arr);
				let minVal = Math.min(...arr);
				// 加一些余量
				let range = Math.max(Math.abs(maxVal), Math.abs(minVal)) * 1.2;
				// 至少为 1，避免除零
				const voltageRange = Math.max(range, 1);
				const scale = 32767 / voltageRange;
				for (let i = 0; i < n; i++) {
					let v = Math.max(-voltageRange, Math.min(voltageRange, arr[i]));
					let int16 = Math.round(v * scale);
					view.setInt16(i * 2, int16, true);
				}
				return {
					buffer: ab,
					voltageRange: voltageRange
				};
			},
			ECGunpackInt16(ab, voltageRange = 500) {
				if (!ab || !(ab instanceof ArrayBuffer)) {
					console.error('Invalid input: Expected ArrayBuffer, got:', ab);
					return [];
				}
				const n = ab.byteLength / 2;
				const view = new DataView(ab);
				const arr = new Array(n);
				const scale = 32767 / voltageRange;
				for (let i = 0; i < n; i++) {
					const int16 = view.getInt16(i * 2, true);
					arr[i] = parseFloat((int16 / scale).toFixed(6));
				}
				return arr;
			},
			//PPG数据处理之后转换成base64
			packInt16(arr) {
				let signalMin = Math.min(...arr);
				let signalMax = Math.max(...arr);
				let voltageRange = Math.max(Math.abs(signalMin), Math.abs(
					signalMax)) * 1.2;
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
			//BPW1蓝牙数据分包
			calculateQuotient(bufferSize, chunkSize) {
				return Math.ceil(bufferSize / chunkSize);
			},
			// 提取数据格式化函数
			formatData(dataArray) {
				return dataArray.map(item => item.replace(/[""]/g, "")).join("");
			},

			// <--------------------------------------数据解析相关工具类end-------------------------------------->

			// <--------------------------------------日志相关start----------- --------------------------->
			formatLogMsg(value) {
				if (value === undefined) return '';
				if (value === null) return 'null';
				if (typeof value === 'object') {
					try {
						return JSON.stringify(value);
					} catch (e) {
						return String(value);
					}
				}
				return String(value);
			},
			addlog(...args) {
				const text = args.map(p => this.formatLogMsg(p)).join(' ');
				const time = new Date().toLocaleTimeString();
				this.bpDebugLogs.push({
					time,
					text
				});
				const maxLogs = 300;
				if (this.bpDebugLogs.length > maxLogs) {
					this.bpDebugLogs.splice(0, this.bpDebugLogs.length - maxLogs);
				}
				console.log(...args);
			},
			/** 定时测量下发遇断连：走首页蓝牙管理器重连 */
			onQxBleNeedReconnect(payload) {
				const deviceId = (payload && payload.deviceId) || this.deviceIdwatch || uni.getStorageSync(
					'deviceIdwatch')
				if (!deviceId) {
					return
				}
				try {
					if (!this.bluetoothManager) {
						this.bluetoothManager = new BluetoothManager()
					}
					this.bluetoothManager.connectDevice(deviceId).then(() => {}).catch((e) => {})
				} catch (e) {}
			},
			copyBpLogs() {
				const text = this.bpLogText;
				if (!text) {
					uni.showToast({
						title: '暂无日志',
						icon: 'none'
					});
					return;
				}
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						});
					},
					fail: () => {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						});
					}
				});
			},
			clearBpLogs() {
				if (!this.bpDebugLogs.length) {
					uni.showToast({
						title: '暂无日志',
						icon: 'none'
					});
					return;
				}
				this.bpDebugLogs = [];
				uni.showToast({
					title: '已清除',
					icon: 'success'
				});
			},
			// <---------------------------------------日志相关end---------------------------------->
			/**
			 * 从本地缓存立即回填首页血压，避免等云端/蓝牙同步才显示
			 */
			hydrateBpFromStorage() {
				const low = uni.getStorageSync("lowPressure")
				const high = uni.getStorageSync("highPressure")
				const pulse = uni.getStorageSync("pulse")
				const hasLow = low !== '' && low != null
				const hasHigh = high !== '' && high != null
				const hasPulse = pulse !== '' && pulse != null
				if (!hasLow && !hasHigh && !hasPulse) return
				if (hasLow) {
					this.lowPressure = this.Blood === "mmHg" ? low : (Number(low) * 0.133).toFixed(1)
				}
				if (hasHigh) {
					this.highPressure = this.Blood === "mmHg" ? high : (Number(high) * 0.133).toFixed(1)
				}
				if (hasPulse) {
					this.pulse = pulse
				}
				if (hasLow || hasHigh) {
					this.updateBloodPressureStatus(hasLow ? low : '', hasHigh ? high : '')
				}
			},
			isKgWeightUnit(unitLabel) {
				const u = String(unitLabel || '').trim()
				return u === 'KG' || u === 'kg' || u === '千克' || u === this.$t('千克') || u === this.$t('千克1')
			},
			isValidWeightDisplay(val) {
				if (val == null || val === '') return false
				const s = String(val).trim()
				return s && s !== '-' && s !== '--/--' && s !== '--' && s !== '-/-'
			},
			reconvertWeightField(field, fromKg, toKg) {
				if (fromKg === toKg) return
				const val = this[field]
				if (!this.isValidWeightDisplay(val)) return
				const num = Number(val)
				if (!Number.isFinite(num)) return
				this[field] = toKg ? WeightConverter.lbToKg(num) : WeightConverter.kgToLb(num)
			},
			syncWeightUnitsFromStorage() {
				const prevIsKg = this.isKgWeightUnit(this.chuhsikg)
				const isKg = uni.getStorageSync('danwei2') !== 1
				this.chuhsikg = isKg ? this.$t('千克') : this.$t('英镑')
				this.newweightKG = isKg ? this.$t('千克1') : this.$t('英镑')
				const weightKg = uni.getStorageSync('weightkg')
				const weightLb = uni.getStorageSync('weightlb')
				if (weightKg !== '' && weightKg != null) {
					this.Latest_weight = isKg ? weightKg : (weightLb || WeightConverter.kgToLb(weightKg))
				} else if (weightLb !== '' && weightLb != null) {
					this.Latest_weight = isKg ? WeightConverter.lbToKg(weightLb) : weightLb
				} else {
					this.reconvertWeightField('Latest_weight', prevIsKg, isKg)
				}
				const goalKg = uni.getStorageSync('goalWeightKg')
				if (goalKg !== '' && goalKg != null) {
					this.Target_weight = isKg ? goalKg : WeightConverter.kgToLb(goalKg)
				} else {
					this.reconvertWeightField('Target_weight', prevIsKg, isKg)
				}
				const initialKg = uni.getStorageSync('initialWeightKg')
				if (initialKg !== '' && initialKg != null) {
					this.Initial_weight = isKg ? initialKg : WeightConverter.kgToLb(initialKg)
				} else {
					this.reconvertWeightField('Initial_weight', prevIsKg, isKg)
				}
			},
			/**
			 * 当app没有任何网络的情况下
			 */
			Offline_mode() {
				let that = this
				that.Latest_weight = that.isKgWeightUnit(that.newweightKG) ? uni.getStorageSync(
					"weightkg") : uni.getStorageSync("weightlb")
				that.hydrateBpFromStorage()
				that.sethuilian(true)
				that.aaaa(uni.getStorageSync("lixianlist").rows)
			},
			/**
			 * 当app有网络的情况下
			 */
			Network_available() {
				let that = this
				that.hydrateBpFromStorage()
				let datapar = uni.getStorageSync("xueyadata")
				let xueyadatatypepar = uni.getStorageSync("xueyadatatype")
				let tizhidatapar = uni.getStorageSync("tizhidata")
				if (xueyadatatypepar && datapar) {
					if (xueyadatatypepar === "1") {
						that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, datapar, {
							'content-type': 'application/json;charset=UTF-8'
						}).then(res => {
							console.log("上报数据手表成功", res)
							if (res.code === 200) {
								that.setbanhua(1)
								let deviceSnlixin = datapar.deviceSn
								let slaveDatalixian = datapar.slaveData
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
					} else if (xueyadatatypepar === "0") {
						that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, datapar, {
							'content-type': 'application/json;charset=UTF-8'
						}).then(resaa => {
							console.log("血压计", resaa)
							if (resaa.code === 200) {
								that.setbanhua(1)
								let deviceSnlixin = datapar.deviceSn
								let slaveDatalixian = datapar.slaveData
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
				if (tizhidatapar) {
					that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, tizhidatapar, {
						'content-type': 'application/json;charset=UTF-8'
					}).then(res => {
						if (res.code === 500) {
							return
						} else if (res.code === 200) {
							that.setbanhua(1)
							let deviceSntzlx = tizhidatapar.deviceSn
							uni.removeStorageSync("tizhidata")
							setTimeout(() => {
								that.get_device_info(deviceSntzlx)
								that.get_device_data(deviceSntzlx)
							}, 1000)
						}
					})
				}
			},

			initPage() {
				let that = this
				that.Unitlist()
				that.syncWeightUnitsFromStorage()
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
					// 有本地测量时保留保护标记，避免切页后被历史上报的旧心率盖掉
					if (!uni.getStorageSync('pulse_measure_ts')) {
						that.xeuyabiaoshi = ""
					}
					if (!uni.getStorageSync('oxygen_measure_ts')) {
						that.oxygenbiaoshi = ""
					}
					that.deviceList = undefined;
					that.deviceLists = []
					that.getUserInfo();
				});
			},
			getUserInfo() {
				this.$get(this.$url_APP_IP + this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(UserInfo => {
					if (UserInfo.code == 200) {
						if (UserInfo.data && UserInfo.data.weight != null && UserInfo.data.weight !== '') {
							uni.setStorageSync('initialWeightKg', UserInfo.data.weight)
							this.Initial_weight = this.isKgWeightUnit(this.chuhsikg) ? UserInfo.data.weight :
								WeightConverter.kgToLb(UserInfo.data.weight)
						}
						this.handleUserInformation(UserInfo.data);
					} else if (UserInfo.code == 401) { //401错误为登陆失效，需要重新登陆
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
				this.pending(userData.userId);
				this.questionnairelist();
				this.queryDevices();
				// 切页会反复走这里，必须先清旧定时器，否则 list_recipe 叠多重导致脉搏闪跳
				if (this.timsdpad) {
					clearInterval(this.timsdpad);
					this.timsdpad = null;
				}
				this.timsdpad = setInterval(res => {
					this.pending(userData.userId);
					if (this.currentIndex === 0) {
						this.list_recipe()
					}
				}, 8000)
			},
			//调用js，初始化蓝牙并搜索蓝牙
			async initBluetooth() {
				let that = this
				that.bluetoothManager = new BluetoothManager();
				uni.openBluetoothAdapter({
					success(openBluetoothAdapter) {
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
			/**
			 * 搜索已经绑定的蓝牙设备
			 */
			onBluetoothDeviceFound() {
				let that = this
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							// 检查 deviceList 是否为数组
							const deviceList = uni.getStorageSync("deviceList");
							let uniqueArr = Array.isArray(deviceList) ? deviceList.filter((item, index) =>
								deviceList.indexOf(item) === index) : [];
							// 检查 devicdsdmac 是否为数组
							const devicdsdmac = uni.getStorageSync("devicdsdmac");
							let uniqueArr1 = Array.isArray(devicdsdmac) ? devicdsdmac.filter((item, index) =>
								devicdsdmac.indexOf(item) === index) : [];
							// 检查 devicdsdmac1 是否为数组
							const devicdsdmac1 = uni.getStorageSync("devicdsdmac1");
							let uniqueArr2 = Array.isArray(devicdsdmac1) ? devicdsdmac1.filter((item, index) =>
								devicdsdmac1.indexOf(item) === index) : [];
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
								uniqueArr = that.deviceList.filter((item, index) => that.deviceList.indexOf(
									item) === index);
							}
							if (that.devicdsdmac === undefined) {
								uniqueArr1 = uni.getStorageSync("devicdsdmac").filter((item, index) => uni
									.getStorageSync("devicdsdmac").indexOf(item) === index);
							} else {
								uniqueArr1 = that.devicdsdmac.filter((item, index) => that.devicdsdmac.indexOf(
									item) === index);
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
			/**
			 * 回连多台BLE设备
			 * @param {Object} uniqueArr 设备mac数组
			 */
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
				let that = this
				that.$post(that.$url_APP_IP + that.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then(res => {
					if (res.code === 200) {
						// 解绑后服务端列表已无 BPW1 时，清掉内存中的旧 SN，避免后续上传回退到 BPW1
						const hasBpw1 = (res.rows || []).some(r => String(r.deviceModelId) === '30000')
						if (!hasBpw1) {
							that.shoubiaosn = '0'
							that.shoubiaomac = '0'
						}
						for (let rowIndex = 0; rowIndex < res.rows.length; rowIndex++) {
							const row = res.rows[rowIndex];
							for (let deviceIndex = 0; deviceIndex < devicesArray.length; deviceIndex++) {
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
									that.xeuyejisn = row.deviceSn
									that.xeuyejimac = device.deviceId
								}
								if (row.deviceModelId === "10006") {
									that.deviceIdECG = device.deviceId
									that.deviceIdECG_SN = row.deviceSn
								}
								if (row.deviceModelId === "30000") {
									that.shoubiaosn = row.deviceSn
									that.shoubiaomac = device.deviceId
								}
								if (row.deviceModelId === "30001") {
									that.deviceIdwatch6 = device.deviceId
									that.deviceIdwatch6_SN = row.deviceSn
									uni.setStorageSync("BPW6devicemac", device.deviceId)
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
												device.services[0].uuid, row.deviceSn);
											this.xeuyejisn = row.deviceSn
											this.xeuyejimac = device.deviceId
										}
										if (row.deviceModelId === "10006") {
											uni.setStorageSync("ECGdeviceSn", row.deviceSn)
											this.deviceIdECG = device.deviceId
											this.getBLEDeviceCharacteristicsECG(device.deviceId, SERVICE_ID, row
												.deviceSn)
										}
										break;
									case 2:
										if (row.deviceModelId === "10006") {
											uni.setStorageSync("ECGdeviceSn", row.deviceSn)
											this.deviceIdECG = device.deviceId
											this.getBLEDeviceCharacteristicsECG(device.deviceId, SERVICE_ID, row
												.deviceSn)
										}
										// this.getBLEDeviceCharacteristics2(device.deviceId, device
										// 	.services[1].uuid, row.deviceSn);
										break;
									case 3:
										this.getBLEDeviceCharacteristics3(device.deviceId, device
											.services[1].uuid, row.deviceSn);
										break;
									case 4:
										if (device.services[0].uuid === BPW6SERVICE) {
											that.deviceIdwatch6 = device.deviceId
											that.deviceIdwatch6_SN = row.deviceSn
											uni.setStorageSync("BPW6devicemac", device.deviceId)
											that.getBLEDeviceCharacteristics6(device.deviceId, BPW6SERVICE, row
												.deviceSn);
										} else {
											that.getBLEDeviceCharacteristics2(device.deviceId, device.services[3]
												.uuid, row.deviceSn);
										}
										break;
									default:
										console.log(device.services.length)
								}
								break;
							}
						}
					}
				}).catch(err => {
					const res = uni.getStorageSync("lixianlist");
					const offlineRows = (res && res.rows) ? res.rows : []
					const hasBpw1Offline = offlineRows.some(r => String(r.deviceModelId) === '30000')
					if (!hasBpw1Offline) {
						that.shoubiaosn = '0'
						that.shoubiaomac = '0'
					}
					for (let rowIndex = 0; rowIndex < offlineRows.length; rowIndex++) {
						const row = offlineRows[rowIndex];
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
								that.xeuyejisn = row.deviceSn
								that.xeuyejimac = device.deviceId
							}
							if (row.deviceModelId === "10006") {
								that.deviceIdECG = device.deviceId
								that.deviceIdECG_SN = row.deviceSn
							}
							if (row.deviceModelId === "30000") {
								that.shoubiaosn = row.deviceSn
								that.shoubiaomac = device.deviceId
							}
							if (row.deviceModelId === "30001") {
								that.deviceIdwatch6 = device.deviceId
								that.deviceIdwatch6_SN = row.deviceSn
								uni.setStorageSync("BPW6devicemac", device.deviceId)
							}
							// 根据服务数量选择不同的处理方式
							switch (device.services.length) {
								case 1:
									if (that.xueyehuilian == true) {
										uni.setBLEMTU({
											deviceId: device.deviceId,
											mtu: 512,
										});
										that.getBLEDeviceCharacteristics1(device.deviceId, device.services[0].uuid,
											row.deviceSn);
										that.xeuyejisn = row.deviceSn
										that.xeuyejimac = device.deviceId
									}
									if (row.deviceModelId === "10006") {
										uni.setStorageSync("ECGdeviceSn", row.deviceSn)
										that.deviceIdECG = device.deviceId
										that.getBLEDeviceCharacteristicsECG(device.deviceId, SERVICE_ID, row
											.deviceSn)
									}
									break;
								case 2:
									if (row.deviceModelId === "10006") {
										uni.setStorageSync("ECGdeviceSn", row.deviceSn)
										that.deviceIdECG = device.deviceId
										that.getBLEDeviceCharacteristicsECG(device.deviceId, SERVICE_ID, row
											.deviceSn)
									}
									// that.getBLEDeviceCharacteristics2(device.deviceId, device
									// 	.services[1].uuid, row.deviceSn);
									break;
								case 3:
									that.getBLEDeviceCharacteristics3(device.deviceId, BPW1serviceId, row
										.deviceSn);
									break;
								case 4:
									if (device.services[0].uuid === BPW6SERVICE) {
										that.deviceIdwatch6 = device.deviceId
										that.deviceIdwatch6_SN = row.deviceSn
										uni.setStorageSync("BPW6devicemac", device.deviceId)
										that.getBLEDeviceCharacteristics6(device.deviceId, BPW6SERVICE, row
											.deviceSn);
									} else {
										that.getBLEDeviceCharacteristics2(device.deviceId, device.services[3].uuid,
											row.deviceSn);
									}
									break;
							}
							break;
						}
					}
					uni.getNetworkType({
						success: function(res) {
							if (res.networkType === 'none') {
								that.sethuilian(true)
							} else {
								that.sethuilian(true)
								that.Blood = uni.getStorageSync("Blood") === 0 || uni.getStorageSync(
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
									if (!uni.getStorageSync('pulse_measure_ts')) {
										that.xeuyabiaoshi = ""
									}
									if (!uni.getStorageSync('oxygen_measure_ts')) {
										that.oxygenbiaoshi = ""
									}
									that.deviceList = undefined;
									that.deviceLists = []
									that.getUserInfo();
								});
								// 在数据操作前检查清除
								clearDailyGoalData();
								that.today_Daily_Goal = uni.getStorageSync("today_Daily_Goal") || "0"
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
						const parsed = JSON.parse(storedData);
						const normalized = {}
						Object.keys(parsed || {}).forEach(key => {
							const md = this.normalizeStepsMd(key)
							if (!md) return
							const val = parsed[key]
							if (!this.isValidStepsValue(val)) return
							const prev = normalized[md]
							const n = parseInt(val, 10)
							const p = parseInt(prev, 10)
							if (!Number.isFinite(p) || (Number.isFinite(n) && n >= p)) {
								normalized[md] = val
							}
						})
						this.stepsData = normalized;
						uni.setStorageSync("weeklySteps", JSON.stringify(this.stepsData));
					}
				} catch (e) {}
				this.refreshWeeklyStepsChart()
				this.fetchWeekStepsFromApi()
			},
			getLastSevenLocalMdKeys() {
				const keys = []
				const now = new Date()
				for (let i = 6; i >= 0; i--) {
					const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
					keys.push(`${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`)
				}
				return keys
			},
			normalizeStepsMd(md) {
				const raw = String(md || '').trim()
				if (!raw || raw === '--/--' || raw === '-/-') return ''
				const parts = raw.split(/[\/\-.]/)
				if (parts.length >= 2) {
					const month = parseInt(parts.length >= 3 ? parts[1] : parts[0], 10)
					const day = parseInt(parts.length >= 3 ? parts[2] : parts[1], 10)
					if (Number.isFinite(month) && Number.isFinite(day) && month >= 1 && month <= 12 && day >= 1 &&
						day <= 31) {
						return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
					}
				}
				return ''
			},
			lookupStepsByMd(md) {
				if (!this.stepsData) return 0
				const key = this.normalizeStepsMd(md)
				if (!key) return 0
				if (this.stepsData[key] != null && this.stepsData[key] !== '') {
					return this.stepsData[key]
				}
				const loose = `${parseInt(key.split('/')[0], 10)}/${parseInt(key.split('/')[1], 10)}`
				if (this.stepsData[loose] != null && this.stepsData[loose] !== '') {
					return this.stepsData[loose]
				}
				const keys = Object.keys(this.stepsData)
				for (let i = 0; i < keys.length; i++) {
					if (this.normalizeStepsMd(keys[i]) === key) {
						return this.stepsData[keys[i]]
					}
				}
				return 0
			},
			formatStepsChartLabel(md) {
				const key = this.normalizeStepsMd(md)
				return key || md
			},
			isValidStepsValue(val) {
				if (val === undefined || val === null || val === '') return false
				if (val === '-/-' || val === '--/--') return false
				const n = parseInt(val, 10)
				return Number.isFinite(n) && n >= 0
			},
			refreshWeeklyStepsChart() {
				const mdKeys = this.getLastSevenLocalMdKeys()
				const categories = []
				const seriesData = []
				mdKeys.forEach(md => {
					const n = parseInt(this.lookupStepsByMd(md), 10)
					const steps = Number.isFinite(n) ? n : 0
					categories.push(this.formatStepsChartLabel(md))
					seriesData.push(steps)
				})
				this.chartData = {
					categories,
					series: [{
						name: this.$t('步数'),
						data: seriesData
					}]
				}
			},
			saveDailySteps(bushu, bushu_time, skipChart, overwrite) {
				const currentDate = this.normalizeStepsMd(bushu_time);
				if (!currentDate) {
					return
				}
				const next = parseInt(bushu, 10)
				if (!Number.isFinite(next) || next < 0) {
					return
				}
				const prev = parseInt(this.lookupStepsByMd(currentDate), 10)
				// 设备同步：取较大值，且历史空天 0 不覆盖已有步数；服务端接口以返回值为准
				let merged = next
				if (!overwrite) {
					if (next === 0 && Number.isFinite(prev) && prev > 0) {
						merged = prev
					} else {
						merged = Number.isFinite(prev) ? Math.max(prev, next) : next
					}
				}
				if (Number.isFinite(prev) && merged === prev) {
					if (!skipChart) {
						this.refreshWeeklyStepsChart()
					}
					return
				}
				this.$set(this.stepsData, currentDate, merged);
				const dates = Object.keys(this.stepsData);
				if (dates.length > 14) {
					const sorted = dates.slice().sort((a, b) => {
						const na = this.normalizeStepsMd(a)
						const nb = this.normalizeStepsMd(b)
						return na < nb ? -1 : (na > nb ? 1 : 0)
					});
					this.$delete(this.stepsData, sorted[0]);
				}
				try {
					uni.setStorageSync("weeklySteps", JSON.stringify(this.stepsData));
					if (!skipChart) {
						this.refreshWeeklyStepsChart()
					}
				} catch (e) {}
			},
			saveStepsRowsFromApi(dataList, skipChart) {
				if (!Array.isArray(dataList) || !dataList.length) return
				dataList.forEach(row => {
					if (!row || row.register !== 'steps') return
					if (!this.isValidStepsValue(row.registerVal)) return
					const md = row.updateTime ? this.formatDate(row.updateTime) : ''
					if (!md || md === '-/-') return
					this.saveDailySteps(row.registerVal, md, true, true)
				})
				if (!skipChart) {
					this.refreshWeeklyStepsChart()
				}
			},
			/** 趋势/概览接口有当天步数时，同步运动页「今日」展示 */
			syncTodayStepsDisplayFromApi(stepsValue) {
				if (this.currentIndex !== 4) return
				const todayMd = this.normalizeStepsMd(this.getPhoneLocalCardMD())
				if (!todayMd || !this.isValidStepsValue(stepsValue)) return
				this.bushu = stepsValue
				this.bushu_time = todayMd
			},
			/** 从服务端拉近 7 天步数趋势（get_trend_data，aggregateType=max） */
			fetchWeekStepsFromApi() {
				const userid = uni.getStorageSync('userid')
				if (!userid || this._stepsWeekFetching) {
					return
				}
				this._stepsWeekFetching = true
				const pad = (n) => String(n).padStart(2, '0')
				const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
				const now = new Date()
				const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
				const header = {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				}
				const post = (sn) => {
					return this.$post(this.$url_APP_IP + this.$url_get_trend_data, {
						deviceSn: userid,
						timeLevel: 0,
						slaveList: [{
							slaveSn: "3",
							register: 'steps'
						}],
						startTime: ymd(start) + ' 00:00:00',
						endTime: ymd(now) + ' 23:59:59',
						aggregateType: 'max'
					}, header)
				}
				const applyRes = (res) => {
					let data = res && res.data
					if (typeof data === 'string') {
						try {
							data = JSON.parse(data)
						} catch (e) {
							data = null
						}
					}
					if (!res || res.code != 200 || !data) return false
					const list = data.steps || data.Steps || []
					if (!Array.isArray(list) || !list.length) return false
					let changed = false
					const todayMd = this.normalizeStepsMd(this.getPhoneLocalCardMD())
					let todayApiSteps = null
					list.forEach((item) => {
						let dateStr = ''
						let value = null
						if (Array.isArray(item)) {
							dateStr = this.formatDate(item[1])
							value = parseInt(item[0], 10)
							if ((!dateStr || dateStr === '-/-') && this.formatDate(item[0]) !== '-/-') {
								dateStr = this.formatDate(item[0])
								value = parseInt(item[1], 10)
							}
						} else if (item && typeof item === 'object') {
							dateStr = this.formatDate(item.time || item.timestamp || item.dateTime || item
								.date)
							value = parseInt(item.value != null ? item.value : item.avg, 10)
						}
						const key = this.normalizeStepsMd(dateStr)
						if (!key || !Number.isFinite(value) || value < 0) return
						const prev = parseInt(this.lookupStepsByMd(key), 10)
						if (!Number.isFinite(prev) || value !== prev) {
							this.saveDailySteps(value, key, true, true)
							changed = true
						}
						if (todayMd && key === todayMd) {
							todayApiSteps = value
						}
					})
					if (todayApiSteps != null) {
						this.syncTodayStepsDisplayFromApi(todayApiSteps)
					}
					if (changed) {
						this.refreshWeeklyStepsChart()
					}
					return true
				}
				post('0').then((res) => {
					if (applyRes(res)) return
					return post('3').then(applyRes)
				}).catch(() => {}).then(() => {
					this.refreshWeeklyStepsChart()
					this._stepsWeekFetching = false
				})
			},
			delayMs(ms) {
				return new Promise(resolve => setTimeout(resolve, ms))
			},
			async readBpw6DailyInfoWeek(deviceId) {
				const targetDeviceId = deviceId || this.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
				if (!targetDeviceId || this._bpw6DailyWeekReading) {
					return
				}
				this._bpw6DailyWeekReading = true
				try {
					for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
						try {
							await u16proBLE.readDailyInfo(daysAgo, targetDeviceId)
						} catch (err) {
							console.error('【BPW6】读取运动/睡眠信息失败', daysAgo, err)
						}
						if (daysAgo < 6) {
							await this.delayMs(350)
						}
					}
				} finally {
					this._bpw6DailyWeekReading = false
				}
			},
			activityDateToMd(data) {
				if (data && data.date) {
					const md = this.formatDate(data.date)
					if (md && md !== '-/-') return md
				}
				const daysAgo = Number(data && data.daysAgo)
				if (Number.isFinite(daysAgo) && daysAgo > 0) {
					const d = new Date()
					d.setDate(d.getDate() - daysAgo)
					return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
				}
				return this.getPhoneLocalCardMD()
			},

			toggleExpand2() {
				this.isExpanded2 = !this.isExpanded2;
			},
			// 情绪定时测量跳转按钮（只显示情绪定时设置）
			setting() {
				const isBpw6Watch = this.shouldUseBpw6PpgForEmotion()
				uni.navigateTo({
					url: '/pages/tabBar/main/sleep_report/Reports_Alerts_new?scheduleMode=emotion&devicetype=' +
						isBpw6Watch
				})
			},
			//情绪详细报告按钮
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
			//情绪评分问题跳转
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
			setSleepAlertDisabled(val) {
				// 手动立即测量未收尾前禁止恢复按钮（前后台/queryDevices/调度解锁都挡掉）
				if (!val && this.shouldBlockBpw6ManualButtonRecover()) {
					console.log('【BPW6】手动立即测量未结束，忽略恢复按钮')
					this.sleep_alertdisabled = true
					uni.setStorageSync('sleep_alertdisabled', true)
					return
				}
				// 血压后/24h·7d 动态血压后静默 PPG：未清会话前禁止误恢复
				if (!val && this.bpw6PpgSilentAfterBp) {
					console.log('【BPW6】血压后PPG未结束，忽略恢复按钮')
					this.sleep_alertdisabled = true
					uni.setStorageSync('sleep_alertdisabled', true)
					return
				}
				// BPW1 PPG 会话中：禁止 queryDevices/调度误恢复（业务收尾会先清会话标记）
				if (!val && this.shouldBlockBpw1PpgButtonRecover()) {
					console.log('【BPW1】PPG未结束，忽略恢复按钮')
					this.sleep_alertdisabled = true
					uni.setStorageSync('sleep_alertdisabled', true)
					return
				}
				this.sleep_alertdisabled = val
				uni.setStorageSync("sleep_alertdisabled", val)
				// 按钮已恢复时清掉 BPW6 手动测量兜底计时
				if (!val) {
					this.clearBpw6EmotionWatchdog()
					this._bpw6EmotionMeasureStartedAt = 0
					this._bpw6EmotionPullOnShowTried = false
					this._bpw6LastLoadingPhase = ''
				}
			},
			/** 血压后自动测情绪开关（与 BPW1 判定一致，兼容 true/'true'/1） */
			isYaliSwitchHerOn() {
				const yaliSw = uni.getStorageSync('yaliswitchHER')
				return yaliSw === true || yaliSw === 'true' || yaliSw === 1 || yaliSw === '1'
			},
			/** 实时/24h·7d 动态血压后准备启 PPG：等 20s 期间先置灰立即测量，失败/成功/中断再恢复 */
			prepareBpw6PpgAfterBpButtonLock() {
				this.bpw6PpgSilentAfterBp = true
				this.bpw6AwaitingPpgAfterBp = true
				if (!this._bpw6EmotionMeasureStartedAt) {
					this._bpw6EmotionMeasureStartedAt = Date.now()
				}
				this.setSleepAlertDisabled(true)
				this.armBPW6EmotionButtonWatchdog(120)
			},
			/** BPW1 PPG 进行中：仅用于挡 queryDevices/调度误恢复，不拦截业务主动收尾 */
			shouldBlockBpw1PpgButtonRecover() {
				if (this.shouldUseBpw6PpgForEmotion()) {
					return false
				}
				const sendwatch = uni.getStorageSync('sendwatch')
				return !!(
					this.bpw1PpgSessionActive ||
					this.sleep_alertid === 1 ||
					this.immediateEmotionMeasure ||
					sendwatch === 1 || sendwatch === '1'
				)
			},
			clearBpw6EmotionWatchdog() {
				if (this._bpw6EmotionBtnWatchdog) {
					clearTimeout(this._bpw6EmotionBtnWatchdog)
					this._bpw6EmotionBtnWatchdog = null
				}
				if (this._bpw6EmotionBtnWatchdogIv) {
					clearInterval(this._bpw6EmotionBtnWatchdogIv)
					this._bpw6EmotionBtnWatchdogIv = null
				}
			},
			/** 手动立即测量进行中：禁止提前恢复按钮 */
			shouldBlockBpw6ManualButtonRecover() {
				if (!this.shouldUseBpw6PpgForEmotion() || this.bpw6PpgSilentAfterBp) {
					return false
				}
				const sendwatch = uni.getStorageSync('sendwatch')
				if (sendwatch === 1 || sendwatch === '1') {
					return false
				}
				return !!(this.immediateEmotionMeasure || this.bpw6ManualEmotionUiPhase === 'measuring' ||
					this.bpw6ManualEmotionUiPhase === 'cloud')
			},
			/**
			 * 手动立即测量 loading：同 phase 不重复弹；退后台清标记后回前台可再显示一次
			 * @param {'measuring'|'cloud'} phase
			 */
			showBpw6ManualEmotionLoading(phase) {
				if (this.isBpw6PpgUiSilent()) {
					this.setSleepAlertDisabled(true)
					return
				}
				if (phase !== 'measuring' && phase !== 'cloud') {
					phase = 'measuring'
				}
				this.bpw6ManualEmotionUiPhase = phase
				this.setSleepAlertDisabled(true)
				if (!this.QX_HIDE) {
					return
				}
				if (this._bpw6LastLoadingPhase === phase) {
					return
				}
				this._bpw6LastLoadingPhase = phase
				uni.showLoading({
					title: phase === 'cloud' ? this.$t('云端数据计算中') : this.$t('测量中'),
					mask: true,
				})
			},
			/** storage 忙碌标记 → Vue（定时调度只写 storage） */
			syncBpw6EmotionButtonBusyFromStorage() {
				const v = uni.getStorageSync('sleep_alertdisabled')
				const busy = v === true || v === 'true' || v === 1 || v === '1'
				if (busy || this.isBpw6ManualEmotionSession()) {
					this.sleep_alertdisabled = true
					const sendwatch = uni.getStorageSync('sendwatch')
					if ((sendwatch === 1 || sendwatch === '1') && !this.immediateEmotionMeasure) {
						this.bpw6PpgSilentAfterBp = true
					}
				}
			},
			/** BPW6 PPG 会话进行中：按钮应保持置灰（含定时/血压后静默） */
			isBpw6PpgButtonBusy() {
				if (!this.shouldUseBpw6PpgForEmotion()) {
					return false
				}
				if (this.immediateEmotionMeasure || this.sleep_alertid === 1) {
					return true
				}
				if (this.bpw6PpgSilentAfterBp || this.bpw6PpgReading || this.bpw6PpgCloudLoadingActive) {
					return true
				}
				if (this.bpw6ManualEmotionUiPhase === 'measuring' || this.bpw6ManualEmotionUiPhase ===
					'cloud') {
					return true
				}
				const sendwatch = uni.getStorageSync('sendwatch')
				if (sendwatch === 1 || sendwatch === '1') {
					return true
				}
				return false
			},
			/** 定时 / 血压后 PPG：不弹 loading/toast，仅锁按钮 */
			isBpw6PpgUiSilent() {
				if (this.bpw6PpgSilentAfterBp) {
					return true
				}
				const sendwatch = uni.getStorageSync('sendwatch')
				if (sendwatch === 1 || sendwatch === '1') {
					return true
				}
				// 定时会话 sendwatch 已清但仍在云端分析：非手动则静默
				if (!this.immediateEmotionMeasure && this.bpw6ManualEmotionUiPhase === 'idle' && (this
						.bpw6PpgCloudLoadingActive || this.bpw6PpgReading)) {
					return true
				}
				return false
			},
			/** 是否 BPW6 手动「立即测量」会话（排除定时 sendwatch、血压后静默 PPG） */
			isBpw6ManualEmotionSession() {
				if (this.bpw6PpgSilentAfterBp) {
					return false
				}
				const sendwatch = uni.getStorageSync('sendwatch')
				if (sendwatch === 1 || sendwatch === '1') {
					return false
				}
				if (!this.shouldUseBpw6PpgForEmotion()) {
					return false
				}
				if (this.immediateEmotionMeasure) {
					return true
				}
				// phase 仍在测量/云端：即使 flag 短暂异常也视为手动会话（保证按钮与提示）
				return this.bpw6ManualEmotionUiPhase === 'measuring' || this.bpw6ManualEmotionUiPhase ===
					'cloud'
			},
			/** 收尾前判断：本轮是否 BPW6 手动立即测量（含 phase，供失败提示） */
			shouldToastBpw6ManualFail() {
				if (this.bpw6PpgSilentAfterBp) {
					return false
				}
				const sendwatch = uni.getStorageSync('sendwatch')
				if (sendwatch === 1 || sendwatch === '1') {
					return false
				}
				const inManualUi = this.immediateEmotionMeasure || this.bpw6ManualEmotionUiPhase ===
					'measuring' || this.bpw6ManualEmotionUiPhase === 'cloud'
				return !!(inManualUi && this.shouldUseBpw6PpgForEmotion())
			},
			/** 仅主页前台 + 手动立即测量：提示数据传输失败 */
			toastBpw6ManualTransferFail() {
				if (!this.QX_HIDE) {
					return
				}
				// uni.showToast({
				// 	title: this.$t('数据传输失败'),
				// 	icon: 'none',
				// 	duration: 2000
				// })
			},
			/** 仅主页前台：请检查设备连接 */
			toastBpw6CheckDeviceConnection() {
				if (!this.QX_HIDE) {
					return
				}
				uni.showToast({
					title: this.$t('请检查设备连接'),
					icon: 'none',
					duration: 2000
				})
			},
			/**
			 * 手动立即测量：关 loading + 恢复按钮
			 * opts.connectionToast → 请检查设备连接
			 * opts.failToast → 数据传输失败
			 */
			finishBpw6ManualEmotionUi(reason, opts = {}) {
				const connectionToast = !!(opts && opts.connectionToast)
				const failToast = !!(opts && opts.failToast)
				console.log('【BPW6】结束手动情绪测量UI', reason)
				this.clearBpw6EmotionWatchdog()
				this.bpw6ManualEmotionUiPhase = 'idle'
				this.bpw6PpgCloudLoadingActive = false
				this.immediateEmotionMeasure = false
				this.sleep_alertid = 0
				this._bpw6EmotionMeasureStartedAt = 0
				this._bpw6EmotionPullOnShowTried = false
				this._bpw6LastLoadingPhase = ''
				try {
					uni.hideLoading()
				} catch (e) {}
				this.setSleepAlertDisabled(false)
				if (this.QX_HIDE) {
					if (connectionToast) {
						this.toastBpw6CheckDeviceConnection()
					} else if (failToast) {
						this.toastBpw6ManualTransferFail()
					}
				}
			},
			/** 强制结束手动情绪测量 loading（超时/断连）；静默/定时只恢复按钮 */
			forceRecoverBpw6EmotionMeasure(reason) {
				console.warn('【BPW6】强制恢复情绪测量UI', reason)
				if (this.bpw6PpgSilentAfterBp) {
					this.clearBpw6EmotionWatchdog()
					this.bpw6PpgReading = false
					this.bpw6PpgCloudLoadingActive = false
					this.bpw6PpgSilentAfterBp = false
					this._bpw6EmotionMeasureStartedAt = 0
					this.setSleepAlertDisabled(false)
					return
				}
				if (!this.isBpw6ManualEmotionSession()) {
					this.clearBpw6EmotionWatchdog()
					this.sleep_alertid = 0
					this.setSleepAlertDisabled(false)
					return
				}
				this.bpw6PpgReading = false
				this.finishBpw6ManualEmotionUi(reason, {
					failToast: true
				})
			},
			/**
			 * 回前台：仅手动立即测量恢复 loading（同 phase 不重复弹）
			 * - 已失败/超时/断连 → 关弹窗、恢复按钮
			 * - 传输/云端中 → 显示「云端数据计算中」
			 * - 仍在采集 → 显示「测量中」
			 * 定时测量、血压后 PPG 不进入
			 */
			resumeBpw6EmotionMeasureOnShow() {
				// 后台完成成功/失败后 flag 已清，但 hideLoading 可能未生效 → 清残留
				if (!this.isBpw6ManualEmotionSession()) {
					if (this.bpw6ManualEmotionUiPhase === 'measuring' || this.bpw6ManualEmotionUiPhase ===
						'cloud') {
						this.bpw6ManualEmotionUiPhase = 'idle'
						this._bpw6LastLoadingPhase = ''
						try {
							uni.hideLoading()
						} catch (e) {}
					}
					return
				}
				const startedAt = Number(this._bpw6EmotionMeasureStartedAt) || 0
				if (!startedAt) {
					this.finishBpw6ManualEmotionUi('onShow missing startAt', {
						failToast: true
					})
					return
				}
				const elapsed = Date.now() - startedAt
				const HARD_MS = 3 * 60 * 1000
				const PULL_AFTER_MS = 70 * 1000
				if (elapsed >= HARD_MS) {
					this.finishBpw6ManualEmotionUi('onShow hard timeout', {
						failToast: true
					})
					return
				}
				if (this.acktypes6 === '0') {
					this.finishBpw6ManualEmotionUi('onShow disconnected', {
						connectionToast: true
					})
					return
				}
				// 会话未结束：强制锁按钮
				this.sleep_alertdisabled = true
				uni.setStorageSync('sleep_alertdisabled', true)
				const inCloud = this.bpw6ManualEmotionUiPhase === 'cloud' || this.bpw6PpgReading || this
					.bpw6PpgCloudLoadingActive
				this.showBpw6ManualEmotionLoading(inCloud ? 'cloud' : 'measuring')
				const remainSec = Math.max(15, Math.ceil((HARD_MS - elapsed) / 1000))
				this.armBPW6EmotionButtonWatchdog(remainSec)
				if (elapsed >= PULL_AFTER_MS && !this.bpw6PpgReading && !this.bpw6PpgCloudLoadingActive &&
					!this._bpw6EmotionPullOnShowTried) {
					this._bpw6EmotionPullOnShowTried = true
					const deviceId = this.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
					const deviceSn = this.deviceIdwatch6_SN || ''
					if (deviceId) {
						console.log('【BPW6】回前台兜底拉取PPG', {
							elapsed,
							deviceId
						})
						this.fetchBPW6PPGRawData(deviceSn, deviceId)
					}
				}
			},
			/**
			 * BPW1 情绪测量超时兜底：写成功或收到 ACK 后启动；超时且无传输进度则恢复按钮
			 * （ACK 再次到达会重置本计时器）
			 */
			armBPW1EmotionButtonWatchdog() {
				const that = this
				if (!(that.sleep_alertid === 1 || that.immediateEmotionMeasure || uni.getStorageSync(
						"sendwatch") === 1)) {
					return
				}
				const showCloudComputingLoading = that.QX_HIDE && that.immediateEmotionMeasure
				if (that.watchtimer) {
					clearInterval(that.watchtimer)
					that.watchtimer = null
				}
				// 立即测量：手表采集+PPG 传输常超过 35s
				let watchtime = (that.immediateEmotionMeasure && !that.yalixueyatype) ? 90 : 35
				let ppgWaitExtendCount = 0
				that.watchtimer = setInterval(() => {
					watchtime--
					if (watchtime < 1) {
						if (that.isBPW1PpgTransferInProgress() && ppgWaitExtendCount < 4) {
							ppgWaitExtendCount++
							watchtime = 30
							// 仅立即测量续弹「测量中」；定时(sendwatch)/血压后静默
							if (!that.yalixueyatype && (that.immediateEmotionMeasure || that
									.sleep_alertid === 1)) {
								uni.showLoading({
									title: that.$t("测量中"),
									mask: true,
								})
							}
							return
						}
						clearInterval(that.watchtimer)
						that.watchtimer = null
						uni.hideLoading()
						// 先清会话标记，再恢复按钮（否则 shouldBlockBpw1PpgButtonRecover 会挡住）
						that.bpw1PpgSessionActive = false
						that.yalixueyatype = false
						that.immediateEmotionMeasure = false
						that.sleep_alertid = 0
						that.setSleepAlertDisabled(false)
						if (showCloudComputingLoading) {
							uni.showModal({
								content: that.$t("这个功能需要手表软件版本在"),
								confirmText: that.$t('确定'),
								showCancel: false,
							})
						}
					}
				}, 1000)
			},
			/** BPW6：启动成功后若长时间无结果，兜底恢复（按墙钟；手动/静默/定时分支不同） */
			armBPW6EmotionButtonWatchdog(timeoutSec = 120) {
				const that = this
				that.clearBpw6EmotionWatchdog()
				const softMs = Math.max(30, Number(timeoutSec) || 120) * 1000
				that._bpw6EmotionWatchdogDeadline = Date.now() + softMs
				that._bpw6EmotionBtnWatchdogIv = setInterval(() => {
					const busy = that.sleep_alertdisabled || that.immediateEmotionMeasure || that
						.sleep_alertid === 1 || that.bpw6PpgSilentAfterBp
					if (!busy) {
						that.clearBpw6EmotionWatchdog()
						return
					}
					const now = Date.now()
					const startedAt = Number(that._bpw6EmotionMeasureStartedAt) || now
					const hardDeadline = startedAt + 3 * 60 * 1000
					const softDeadline = Number(that._bpw6EmotionWatchdogDeadline) || hardDeadline
					if (now < softDeadline && now < hardDeadline) {
						return
					}
					if (now < hardDeadline && (that.bpw6PpgReading || that.bpw6PpgCloudLoadingActive)) {
						that._bpw6EmotionWatchdogDeadline = hardDeadline
						return
					}
					that.forceRecoverBpw6EmotionMeasure('watchdog')
				}, 2000)
			},
			/**
			 * BPW1 情绪测量 ACC/PPG 解析失败：关弹窗、恢复按钮、回到测前状态（仅情绪会话）
			 */
			recoverBPW1EmotionMeasureOnParseFail(errorMsg) {
				const that = this
				if (that.QX_FAIL) {
					return
				}
				that.QX_FAIL = true
				console.error('解析失败:', errorMsg)
				if (!that.isBPW1PpgSessionAllowed()) {
					return
				}
				if (that.watchtimer) {
					clearInterval(that.watchtimer)
					that.watchtimer = null
				}
				if (that.watchtimer2) {
					clearInterval(that.watchtimer2)
					that.watchtimer2 = null
				}
				uni.hideLoading()
				const wasScheduled = uni.getStorageSync('sendwatch') === 1
				// 仅「立即测量」弹提示；定时 / 血压后自动 PPG 只恢复状态
				const showParseFailModal = !!(that.immediateEmotionMeasure && !that.yalixueyatype &&
					!wasScheduled)
				that.immediateEmotionMeasure = false
				that.yalixueyatype = false
				that.sleep_alertid = 0
				that.bpw1PpgSessionActive = false
				that.bpw1PpgUploadDone = true
				that.bpw1PpgStatus02Handled = true
				that.bufferPPG = []
				that.bpw1PendingManualPpg = false
				uni.removeStorageSync('sendwatch')
				that.setSleepAlertDisabled(false)
				if (wasScheduled) {
					onQxBleWatchCollectionEnded('PPG解析失败')
				}
				if (showParseFailModal) {
					uni.showModal({
						content: that.$t('测量数据有误请重新测量'),
						confirmText: that.$t('确定'),
						showCancel: false,
					})
				}
			},
			/** 情绪立即测量是否走 BPW6 PPG（绑定 BPW6 时） */
			shouldUseBpw6PpgForEmotion() {
				if (this.devicetype === 30001) {
					return true
				}
				const list = this.devicetypelist || []
				return list.includes(30001)
			},
			/**
			 * 情绪页面立即测量按钮
			 */
			sleep_alert() {
				let that = this
				that.immediateEmotionMeasure = true
				that.yalixueyatype = false
				// BPW6：走 u16pro PPG 测量通道
				if (that.shouldUseBpw6PpgForEmotion()) {
					that.startBpw6ManualEmotionMeasure()
					return
				}
				// BPW1：同步中/忙/未连接 → 等到可测再启动（避免只弹同步后一直不发 PPG）
				if (that.isBPW1HistorySyncing() || that.blewatch_id === "1" || that.acktypes === "0") {
					that.startBPW1ManualPpgAfterSyncReady()
					return
				}
				that.sendstartheartwatch(BPW1write, 1)
				uni.showLoading({
					title: that.$t("请稍后"),
					mask: true,
				})
				that.sleep_alertid = 1
			},
			/**
			 * BPW1 手动立即测量：等待历史同步结束后再发 PPG
			 */
			startBPW1ManualPpgAfterSyncReady() {
				const that = this
				that.bpw1PendingManualPpg = true
				that.sleep_alertid = 1
				uni.showLoading({
					title: that.$t("数据同步中请稍后"),
					mask: true,
				})
				if (that.watchtimer3) {
					clearInterval(that.watchtimer3)
					that.watchtimer3 = null
				}
				let waitSec = 0
				that.watchtimer3 = setInterval(() => {
					waitSec++
					const connected = that.acktypes === "1"
					const syncing = that.isBPW1HistorySyncing()
					const busy = that.blewatch_id === "1"
					// 同步标记结束即可启动（勿死等 blewatch_id，超时清同步后它可能仍为 1）
					if (connected && !syncing && !busy) {
						that.finishBPW1PendingManualPpg()
						return
					}
					if (connected && !syncing && waitSec >= 3) {
						// 同步已结束但 blewatch_id 未清：直接启动
						that.blewatch_id = "0"
						that.finishBPW1PendingManualPpg()
						return
					}
					if (waitSec >= 90) {
						if (connected) {
							// 同步过久仍卡住：强制结束同步态并启动 PPG，避免一直不通信
							that.blewatch_id = "0"
							that.setBPW1HistorySyncing(false)
							that.finishBPW1PendingManualPpg()
						} else {
							that.bpw1PendingManualPpg = false
							that.immediateEmotionMeasure = false
							that.sleep_alertid = 0
							if (that.watchtimer3) {
								clearInterval(that.watchtimer3)
								that.watchtimer3 = null
							}
							uni.hideLoading()
							uni.showToast({
								title: that.$t("请检查设备连接"),
								icon: 'none',
								duration: 2000
							})
						}
					}
				}, 1000)
			},
			/**
			 * 待启动的手动 PPG：去重后真正下发
			 */
			finishBPW1PendingManualPpg() {
				const that = this
				if (that.watchtimer3) {
					clearInterval(that.watchtimer3)
					that.watchtimer3 = null
				}
				if (that._bpw1ManualPpgStarting || !that.bpw1PendingManualPpg) {
					return
				}
				that._bpw1ManualPpgStarting = true
				that.bpw1PendingManualPpg = false
				uni.hideLoading()
				setTimeout(() => {
					that._bpw1ManualPpgStarting = false
					if (that.isBPW1HistorySyncing()) {
						that.startBPW1ManualPpgAfterSyncReady()
						return
					}
					uni.showLoading({
						title: that.$t("请稍后"),
						mask: true,
					})
					that.sendstartheartwatch(BPW1write, 1)
					that.sleep_alertid = 1
				}, 800)
			},
			/** BPW6 情绪页手动立即测量（PPG） */
			async startBpw6ManualEmotionMeasure() {
				const that = this
				const targetDeviceId = that.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
				if (!targetDeviceId || that.acktypes6 === "0") {
					that.finishBpw6ManualEmotionUi('not connected', {
						connectionToast: true
					})
					return
				}
				if (that.bpw6BpHistorySyncing) {
					that.showBpw6ManualEmotionLoading('measuring')
					if (that.watchtimer3) {
						clearInterval(that.watchtimer3)
						that.watchtimer3 = null
					}
					let waitSec = 0
					that.watchtimer3 = setInterval(async () => {
						waitSec++
						if (!that.bpw6BpHistorySyncing) {
							clearInterval(that.watchtimer3)
							that.watchtimer3 = null
							await that.doStartBpw6ManualEmotionPpg(targetDeviceId)
						} else if (waitSec >= 25) {
							clearInterval(that.watchtimer3)
							that.watchtimer3 = null
							that.finishBpw6ManualEmotionUi('sync wait timeout', {
								connectionToast: true
							})
						}
					}, 1000)
					return
				}
				await that.doStartBpw6ManualEmotionPpg(targetDeviceId)
			},
			async doStartBpw6ManualEmotionPpg(deviceId) {
				const that = this
				const targetDeviceId = deviceId || that.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
				that.sleep_alertid = 1
				that.bpw6PpgSilentAfterBp = false
				that._bpw6EmotionMeasureStartedAt = Date.now()
				that._bpw6EmotionPullOnShowTried = false
				that._bpw6LastLoadingPhase = ''
				that.showBpw6ManualEmotionLoading('measuring')
				try {
					// 首次绑定后主通道可能已通，但 BC(PPG) 通道尚未订阅：先就绪再启测
					try {
						await u16proBLE.ensureBcServiceReady(targetDeviceId, {
							force: true
						})
						// 给 CCCD/notify 一点稳定时间，降低首次写入无应答概率
						await new Promise((resolve) => setTimeout(resolve, 400))
					} catch (prepErr) {
						console.warn('【BPW6】PPG通道预就绪失败，继续尝试启动', prepErr)
					}
					const result = await u16proBLE.startPPGMeasurementWithDuration(60, targetDeviceId)
					if (!result || !result.success) {
						that.finishBpw6ManualEmotionUi('start failed', {
							connectionToast: true
						})
						return
					}
					that.armBPW6EmotionButtonWatchdog(120)
					// 仍为测量中：同 phase 不重复弹 loading
					that.showBpw6ManualEmotionLoading('measuring')
				} catch (err) {
					console.error('【BPW6】情绪立即测量启动失败', err)
					that.finishBpw6ManualEmotionUi('start exception', {
						connectionToast: true
					})
				}
			},
			// 情绪页面立即测量发送命令
			isBPW1HistorySyncing() {
				// 只看显式历史同步标记；勿用 blewatch_id（默认即为 "1"，会误判并长时间挡住首页血压）
				return !!this.bpw1HistorySyncing
			},
			/** BPW1 写特征是否成功（兼容旧 code===10007 与标准 :ok） */
			isBPW1BleWriteOk(complete) {
				if (!complete) return false
				if (complete.code === 10007) return true
				if (complete.errCode === 0 || complete.errCode === -1) return true
				const msg = String(complete.errMsg || '')
				return msg.indexOf(':ok') !== -1
			},
			/** 同步中，或结束后宽限期内（设备常在 end 包后再推最后一天血压） */
			isBPW1HistorySyncingOrGrace() {
				return this.isBPW1HistorySyncing() || Date.now() < Number(this.bpw1HistoryGraceUntil || 0)
			},
			/** 本轮同步会话心率表：不因 pending flush 清空 */
			ensureBPW1SyncSessionHrMap() {
				if (!this.bpw1SyncSessionHrMap || typeof this.bpw1SyncSessionHrMap.set !== 'function') {
					this.bpw1SyncSessionHrMap = new Map()
				}
				return this.bpw1SyncSessionHrMap
			},
			rememberBPW1SyncSessionHr(hrRecords) {
				const map = this.ensureBPW1SyncSessionHrMap();
				(hrRecords || []).forEach(hr => {
					const key = this.normalizeDateTimeKey(`${hr.date} ${hr.time}`)
					if (key) {
						map.set(key, hr)
					}
				})
			},
			getBPW1SyncSessionHrList() {
				const map = this.bpw1SyncSessionHrMap
				if (!map || typeof map.values !== 'function') {
					return []
				}
				return Array.from(map.values())
			},
			/** 合并包内心率快照 + 会话心率表，避免异步 merge 时 pending 已被 flush 清空 */
			collectBPW1HistoryHrForMerge(localHrRecords) {
				const map = new Map()
				this.getBPW1SyncSessionHrList().forEach(hr => {
					map.set(this.normalizeDateTimeKey(`${hr.date} ${hr.time}`), hr)
				});
				(this.bpw1PendingHrHistory || []).forEach(hr => {
					map.set(this.normalizeDateTimeKey(`${hr.date} ${hr.time}`), hr)
				});
				(localHrRecords || []).forEach(hr => {
					map.set(this.normalizeDateTimeKey(`${hr.date} ${hr.time}`), hr)
				})
				return Array.from(map.values())
			},
			/** 历史同步中或结束后静默期内：禁止 BLE 历史尾包改首页 */
			shouldMuteBPW1BleHomeUi() {
				return this.isBPW1HistorySyncing() || Date.now() < Number(this.bpw1HistoryUiMuteUntil || 0)
			},
			/**
			 * 夜间跨日时设备常推历史包；若一律用包头日期刷卡片，会闪到前一日或其他槽位数据。
			 * 仅近实时/手动测量刷新；且必须不早于当前首页已展示的最新时间（接口/历史取新）。
			 */
			shouldApplyBPW1HrToHomeCard(deviceTsSec, opts = {}) {
				if (this.shouldMuteBPW1BleHomeUi()) return false
				const now = Math.floor(Date.now() / 1000)
				const ts = this.toUnixSeconds(deviceTsSec) || 0
				if (opts.forceRealtime) {
					// 强制实时也要比已展示时间新，避免历史尾包带 forceRealtime 盖掉接口新值
					return this.canUpdateHomeHrByNewestTime(ts || now)
				}
				if (!ts) return !this.isBPW1HistorySyncing() && this.canUpdateHomeHrByNewestTime(now)
				// 超过 15 分钟视为历史推送，不盖首页
				if (now - ts > 15 * 60) return false
				if (ts - now > 10 * 60) return false
				return this.canUpdateHomeHrByNewestTime(ts)
			},
			/**
			 * 首页心率已展示权威时间：接口 updateTime 与本地/历史测量取较大者
			 */
			getHomeHrNewestTs() {
				const serverTs = this.toUnixSeconds(uni.getStorageSync('pulse_server_ts') || 0)
				const localTs = this.toUnixSeconds(uni.getStorageSync('pulse_measure_ts') || 0)
				return Math.max(serverTs || 0, localTs || 0)
			},
			/**
			 * 候选时间是否可更新首页心率：与当前展示比，谁新用谁（允许 30s 时钟误差）
			 * @param {number|string} candidateTsSec
			 * @param {{ allowBpw6SameSlot?: boolean }} [opts] BPW6 同5分钟槽位允许覆盖
			 */
			canUpdateHomeHrByNewestTime(candidateTsSec, opts = {}) {
				const candidate = this.toUnixSeconds(candidateTsSec)
				if (!candidate) return true
				const newest = this.getHomeHrNewestTs()
				if (!newest) return true
				if (candidate + 30 >= newest) return true
				// BPW6 槽位重测：时间戳同槽但数值更新，仍允许刷首页
				if (opts.allowBpw6SameSlot && this.isBpw6HrSlotDevice() && this.isSameBpw6HrSlot(candidate, newest)) {
					return true
				}
				return false
			},
			/** 是否 BPW6 心率槽位设备（5 分钟槽，同槽 updateTime 可能不变） */
			isBpw6HrSlotDevice() {
				const a6 = this.acktypes6
				if (a6 === '1' || a6 === 1 || a6 === true) return true
				return !!(this.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac'))
			},
			floorUnixToFiveMin(ts) {
				const sec = this.toUnixSeconds(ts)
				return sec > 0 ? Math.floor(sec / 300) * 300 : 0
			},
			isSameBpw6HrSlot(tsA, tsB) {
				const a = this.floorUnixToFiveMin(tsA)
				const b = this.floorUnixToFiveMin(tsB)
				return a > 0 && a === b
			},
			/**
			 * 首页是否保护本地心率（不跟接口）：
			 * - 无网：保护本地
			 * - 本地/同步时间明确新于接口：保护本地
			 * - BPW6 同槽：接口数值已变则跟接口（槽位时间不变不能挡）
			 */
			shouldProtectLocalHrAgainstRecipe(localPulseTs, serverPulseTs, localPulse, nextPulse, opts = {}) {
				const nowSec = Math.floor(Date.now() / 1000)
				const localTs = this.toUnixSeconds(localPulseTs)
				const serverTs = this.toUnixSeconds(serverPulseTs)
				const offline = opts.offline === true
				if (offline) return !!(localTs || (localPulse !== undefined && localPulse !== null && localPulse !== ''))
				if (!serverTs) return true
				if (!localTs) return false
				const valueMismatch = nextPulse !== undefined && nextPulse !== null && nextPulse !== '-/-' &&
					this.isRecipeDisplayMismatch(localPulse != null && localPulse !== '' ? localPulse : this.pulse,
						nextPulse)
				// BPW6：同槽接口值已更新 → 优先接口
				if (this.isBpw6HrSlotDevice() && valueMismatch && this.isSameBpw6HrSlot(localTs, serverTs)) {
					return false
				}
				// BPW6：本地用手机 now 写入、接口仍是槽位戳时，差值常 <5 分钟，不能据此压接口新值
				if (this.isBpw6HrSlotDevice() && valueMismatch && localTs > serverTs &&
					localTs - serverTs <= 5 * 60 + 30) {
					// 仅真正刚测且本地值已是新值时短暂保护；本地仍是旧值则跟接口
					const justMeasured = this.xeuyabiaoshi === '1' && nowSec - localTs <= 90
					const localAlreadyNew = justMeasured && !this.isRecipeDisplayMismatch(localPulse, nextPulse)
					return !!localAlreadyNew
				}
				const timeNewer = localTs > serverTs + 30
				if (!timeNewer) return false
				// 非 BPW6：保持原 90 秒实时保护，避免扩大本地压接口范围
				return this.shouldPreferLocalVitalCardTime(localTs, serverTs, this.xeuyabiaoshi === '1') ||
					this.shouldPreferLocalVitalCardTime(localTs, serverTs, this.isBPW1LocalHrCardProtected())
			},
			/**
			 * 首页心率卡片日期 MM/DD：按手机本地时区（BLE/本地测量用）
			 * 接口 updateTime 请走 syncPulseTimeFromServer → formatDateServer（中国时区）
			 */
			resolveHomeHrCardDateLabel(tsSec, opts = {}) {
				const nowSec = Math.floor(Date.now() / 1000)
				const ts = this.toUnixSeconds(tsSec)
				const nearNow = opts.forcePhoneLocal || !ts || Math.abs(nowSec - ts) <= 15 * 60
				if (nearNow) {
					return this.getPhoneLocalCardMD() ||
						this.formatDate(nowSec) ||
						'-/-'
				}
				return this.formatDate(ts) || '-/-'
			},
			/**
			 * 把心率卡片 Step_count / pulsetimes 写成权威日期
			 */
			applyHomeHrCardDate(label, cardItem) {
				if (!label || label === '-/-') return
				this.$set(this, 'pulsetime', label)
				uni.setStorageSync('pulsetimes', label)
				if (cardItem) {
					this.$set(cardItem, 'Step_count', label)
				} else {
					const titleKeys = [this.$t('心率'), '心率', 'Heart']
					for (let i = 0; i < titleKeys.length; i++) {
						const item = this.findValue(this.list, 'title', titleKeys[i])
						if (item) {
							this.$set(item, 'Step_count', label)
							break
						}
					}
				}
			},
			/** 首页血压权威时间：接口与本地测量取较大者 */
			getHomeBpNewestTs() {
				const serverTs = this.toUnixSeconds(uni.getStorageSync('bp_server_ts') || 0)
				const localTs = this.toUnixSeconds(uni.getStorageSync('bp_measure_ts') || 0)
				return Math.max(serverTs || 0, localTs || 0)
			},
			canUpdateHomeBpByNewestTime(candidateTsSec) {
				const candidate = this.toUnixSeconds(candidateTsSec)
				if (!candidate) return true
				const newest = this.getHomeBpNewestTs()
				if (!newest) return true
				return candidate + 30 >= newest
			},
			/** 首页血氧权威时间：接口与本地测量取较大者 */
			getHomeOxygenNewestTs() {
				const serverTs = this.toUnixSeconds(uni.getStorageSync('oxygen_server_ts') || 0)
				const localTs = this.toUnixSeconds(uni.getStorageSync('oxygen_measure_ts') || 0)
				return Math.max(serverTs || 0, localTs || 0)
			},
			canUpdateHomeOxygenByNewestTime(candidateTsSec) {
				const candidate = this.toUnixSeconds(candidateTsSec)
				if (!candidate) return true
				const newest = this.getHomeOxygenNewestTs()
				if (!newest) return true
				return candidate + 30 >= newest
			},
			/** 血氧卡片日期（规则同心率） */
			resolveHomeOxygenCardDateLabel(tsSec, opts = {}) {
				return this.resolveHomeHrCardDateLabel(tsSec, opts)
			},
			applyHomeOxygenCardDate(label, cardItem) {
				if (!label || label === '-/-') return
				uni.setStorageSync('xueyangtimes', label)
				if (cardItem) {
					this.$set(cardItem, 'Step_count', label)
				} else {
					const titleKeys = [this.$t('血氧'), '血氧', 'SpO₂']
					for (let i = 0; i < titleKeys.length; i++) {
						const item = this.findValue(this.list, 'title', titleKeys[i])
						if (item) {
							this.$set(item, 'Step_count', label)
							break
						}
					}
				}
			},
			/** 写入首页血压（仅调用方已通过新旧判断后） */
			applyHomeBloodPressure(diastolic, systolic, measureTsSec, opts = {}) {
				const nowSec = Math.floor(Date.now() / 1000)
				const ts = this.toUnixSeconds(measureTsSec) || nowSec
				this.lowPressure = this.Blood === "mmHg" ? diastolic : (Number(diastolic) * 0.133).toFixed(1)
				this.highPressure = this.Blood === "mmHg" ? systolic : (Number(systolic) * 0.133).toFixed(1)
				uni.setStorageSync("lowPressure", diastolic)
				uni.setStorageSync("highPressure", systolic)
				uni.setStorageSync('bp_measure_ts', ts)
				if (opts.fromServer && ts > 0) {
					uni.setStorageSync('bp_server_ts', ts)
				}
				this.updateBloodPressureStatus(diastolic, systolic)
			},
			/**
			 * BPW1 血压是否允许写首页：历史静默期不写；过旧包不写；须不早于当前展示
			 */
			shouldApplyBPW1BpToHomeCard(deviceTsSec) {
				if (this.shouldMuteBPW1BleHomeUi()) return false
				const now = Math.floor(Date.now() / 1000)
				const ts = this.toUnixSeconds(deviceTsSec) || 0
				if (!ts) return this.canUpdateHomeBpByNewestTime(now)
				if (now - ts > 15 * 60) return false
				if (ts - now > 10 * 60) return false
				return this.canUpdateHomeBpByNewestTime(ts)
			},
			/**
			 * 首页心率卡片展示时间：近实时用手机本地 unix，避免包头日期在凌晨偏一天。
			 * 上报仍用设备墙钟→本地解析的 deviceTs。
			 */
			resolveBPW1HrHomeCardTs(deviceTsSec) {
				const now = Math.floor(Date.now() / 1000)
				const ts = Number(deviceTsSec) || 0
				if (!ts) return now
				if (Math.abs(now - ts) <= 15 * 60) return now
				return ts
			},
			markBPW1LocalHrCardProtect() {
				this.bpw1LocalHrCardProtectUntil = Date.now() + 90 * 1000
			},
			isBPW1LocalHrCardProtected() {
				return Date.now() < Number(this.bpw1LocalHrCardProtectUntil || 0)
			},
			setBPW1HistorySyncing(syncing) {
				const wasSyncing = !!this.bpw1HistorySyncing
				this.bpw1HistorySyncing = !!syncing
				if (this.bpw1HistorySyncTimer) {
					clearTimeout(this.bpw1HistorySyncTimer)
					this.bpw1HistorySyncTimer = null
				}
				if (this.bpw1HistoryFlushTimer) {
					clearTimeout(this.bpw1HistoryFlushTimer)
					this.bpw1HistoryFlushTimer = null
				}
				if (this.bpw1DeferredFlushTimer) {
					clearTimeout(this.bpw1DeferredFlushTimer)
					this.bpw1DeferredFlushTimer = null
				}
				// 同步结束包偶发丢失时，避免长期卡住无法自动测 PPG
				if (syncing) {
					this.bpw1PendingHrHistory = []
					this.bpw1PendingHrDevice = null
					this.bpw1PendingBpHistory = []
					this.bpw1PendingBpDevice = null
					this.bpw1DeferredHistoryUploads = []
					this._bpw1DeferredBpTimeSet = null
					this._bpw1DeferredHrTimeSet = null
					this._bpw1DeferredSpO2TimeSet = null
					this.bpw1PendingBpAfterPpg = false
					this.bpw1SyncSessionHrMap = new Map()
					this.bpw1HistoryGraceUntil = 0
					this.bpw1RecentRealtimeHr = []
					this.bpw1RealtimeHrConsumedKeys = null
					this.bpw1RecentRealtimeBpWallKeys = null
					this._bpw1ProcessedHistoryPacketFps = null
					this._bpw1HistoryBatchKeySet = null
					this._bpw1HrHistoryBatchKeySet = null
					this._bpw1SpO2HistoryBatchKeySet = null
					// 睡眠去重指纹跨同步保留，避免短包/分包内容相同被重复解析上报
					this.bpw1HistorySyncTimer = setTimeout(() => {
						this.bpw1HistorySyncTimer = null
						this.setBPW1HistorySyncing(false)
					}, 60000)
				} else if (wasSyncing) {
					// 宽限期：end 包后设备仍可能再推最后一天血压；尾包按历史全量处理
					this.bpw1HistoryGraceUntil = Date.now() + 15000
					this.bpw1HistoryUiMuteUntil = Date.now() + 15000
					// 先立即合并一次；再延迟最终 flush，避免与血压尾包/异步 query+merge 竞态丢掉未配血压
					this.flushBPW1PendingHistoryMergeAndHr({
						finalDiscard: false
					})
					// 同步刚结束：已入队的历史尽快正序上报，不等 15s 宽限结束
					this.scheduleBPW1DeferredHistoryFlush(800)
					if (this.bpw1HistoryFlushTimer) {
						clearTimeout(this.bpw1HistoryFlushTimer)
					}
					this.bpw1HistoryFlushTimer = setTimeout(() => {
						this.bpw1HistoryFlushTimer = null
						this.flushBPW1PendingHistoryMergeAndHr({
							finalDiscard: true
						})
						this.bpw1SyncSessionHrMap = null
						this.bpw1HistoryGraceUntil = 0
					}, 15000)
					// 同步中点过情绪立即测量：结束后补启 PPG
					if (this.bpw1PendingManualPpg) {
						this.finishBPW1PendingManualPpg()
					}
					// 同步中刚完成「实时血压」才补启 PPG；历史上报不会置该标记
					if (this.bpw1PendingBpAfterPpg) {
						this.bpw1PendingBpAfterPpg = false
						const yaliSw = uni.getStorageSync('yaliswitchHER')
						const yaliOn = yaliSw === true || yaliSw === 'true' || yaliSw === 1 || yaliSw === '1'
						if (yaliOn) {
							this.yalixueyatype = true
							this.sleep_alertid = 1
							this.sendstartheartwatch(BPW1write, 1)
						}
					}
				}
			},
			flushBPW1PendingHrHistory() {
				const list = this.bpw1PendingHrHistory || []
				const deviceInfo = this.bpw1PendingHrDevice || this.bpw1PendingBpDevice || {}
				this.bpw1PendingHrHistory = []
				this.bpw1PendingHrDevice = null
				if (!list.length) {
					return
				}
				const that = this
				// 同步期间同一心率包可能入队多次：按时间点去重后再补报
				const uniqueMap = new Map()
				list.forEach(hr => {
					const key = that.normalizeDateTimeKey(`${hr.date} ${hr.time}`)
					uniqueMap.set(key, hr)
				})
				const uniqueList = Array.from(uniqueMap.values())
				uni.getNetworkType({
					success: async function(res) {
						if (res.networkType === 'none') {
							return
						}
						await that.queryBloodPressureDataAsync(that.deviceSnuserID)
						const existingHrMap = that.getExistingHeartRateMap()
						const pending = uniqueList.filter(hr => {
							const key = that.normalizeDateTimeKey(`${hr.date} ${hr.time}`)
							const timeTs = String(that.datatime(key))
							const hrVal = hr.heartRate != null ? hr.heartRate : hr.diastolic
							// 已随血压同报的心率由 markSessionHrUploadedNear 标记；
							// 勿用宽窗口 BP 时间误杀邻近独立/PPG 心率（服务器没有的也要能补报）
							if (that.hasSessionHrUploadedNear(timeTs, hrVal, 3)) {
								return false
							}
							// 服务端该时刻已有血压：心率应随血压存在，勿再单独补报
							if (that.hasServerBloodPressureAt(key)) {
								return false
							}
							// 服务端该时刻已有同值心率
							const serverHr = existingHrMap.get(key)
							if (serverHr !== undefined && String(serverHr) === String(hrVal)) {
								return false
							}
							return true
						})
						console.log('BPW1同步结束，补报未匹配血压的心率', pending.length)
						that.uploadBPW1HrHistoryWithDeduplication(
							pending,
							deviceInfo.deviceId,
							deviceInfo.deviceSn
						)
					}
				})
			},
			/**
			 * 同步结束合并血压历史：测血压必有伴随心率，尽量配齐再上报；不碰 PPG/实时路径
			 * @param {{ finalDiscard?: boolean }} [opts]
			 */
			flushBPW1PendingHistoryMergeAndHr(opts) {
				const finalDiscard = !!(opts && opts.finalDiscard)
				const deviceInfo = this.bpw1PendingBpDevice || this.bpw1PendingHrDevice || {}
				const deviceId = deviceInfo.deviceId
				const deviceSn = deviceInfo.deviceSn
				const resolveUploadDevice = () => {
					const uploadMac = deviceId || (this.bpw1PendingBpDevice && this.bpw1PendingBpDevice
						.deviceId) || (this.bpw1PendingHrDevice && this.bpw1PendingHrDevice.deviceId)
					const uploadSn = deviceSn || (this.bpw1PendingBpDevice && this.bpw1PendingBpDevice
						.deviceSn) || (this.bpw1PendingHrDevice && this.bpw1PendingHrDevice.deviceSn)
					return {
						uploadMac,
						uploadSn
					}
				}
				const pruneUploadedPendingBp = () => {
					this.bpw1PendingBpHistory = (this.bpw1PendingBpHistory || []).filter(bp => {
						const key = this.normalizeDateTimeKey(`${bp.date} ${bp.time}`)
						const timeTs = String(this.datatime(key))
						if (this.bpw1UploadedBpTimeSet && this.bpw1UploadedBpTimeSet.has(timeTs)) {
							return false
						}
						if (this._bpw1DeferredBpTimeSet && this._bpw1DeferredBpTimeSet.has(timeTs)) {
							return false
						}
						return true
					})
				}
				const mergePendingBpWithTol = (tolSec, tag) => {
					const remainBp = this.bpw1PendingBpHistory || []
					const remainHr = this.collectBPW1HistoryHrForMerge(this.bpw1PendingHrHistory)
					if (!remainBp.length || !remainHr.length) {
						return
					}
					const {
						uploadMac,
						uploadSn
					} = resolveUploadDevice()
					console.log(tag, {
						bp: remainBp.length,
						hr: remainHr.length,
						tolSec,
						finalDiscard
					})
					this.mergeAndUploadWithDeduplication(remainHr, remainBp, uploadMac, uploadSn, {
						bypassBatchDedupe: true,
						hrMatchBpPairTol: tolSec
					})
					pruneUploadedPendingBp()
				}
				this.tryMergeBPW1PendingHistory(deviceId, deviceSn)
				// 同步结束兜底：用会话心率表再配（pending 心率可能已被提前清空）
				mergePendingBpWithTol(90, 'BPW1血压历史同步结束兜底合并')
				if (!finalDiscard) {
					return
				}
				// 测血压必有心率：最后再放宽一次同日配对，尽量不丢血压历史
				if ((this.bpw1PendingBpHistory || []).length) {
					mergePendingBpWithTol(180, 'BPW1血压历史最终放宽合并')
				}
				if ((this.bpw1PendingBpHistory || []).length) {
					console.log('BPW1血压历史仍无匹配心率，丢弃', this.bpw1PendingBpHistory.length,
						this.bpw1PendingBpHistory.map(bp => `${bp.date} ${bp.time}`))
				}
				this.bpw1PendingBpHistory = []
				this.bpw1PendingBpDevice = null
				// 先正序串行上报本轮汇总的历史，再补报未配血压的独立心率
				const that = this
				this.flushBPW1DeferredHistoryUploads().then(() => {
					that.flushBPW1PendingHrHistory()
				}).catch(e => {
					console.error('BPW1历史正序上报失败', e)
					that.flushBPW1PendingHrHistory()
				})
			},
			/** 历史同步：心率缓存按时间点合并，避免同一包重复入队 */
			appendBPW1PendingHrHistory(hrRecords, deviceId, deviceSn) {
				if (!this.bpw1PendingHrHistory) {
					this.bpw1PendingHrHistory = []
				}
				this.rememberBPW1SyncSessionHr(hrRecords)
				const map = new Map()
				this.bpw1PendingHrHistory.forEach(hr => {
					map.set(this.normalizeDateTimeKey(`${hr.date} ${hr.time}`), hr)
				});
				(hrRecords || []).forEach(hr => {
					map.set(this.normalizeDateTimeKey(`${hr.date} ${hr.time}`), hr)
				})
				this.bpw1PendingHrHistory = Array.from(map.values())
				this.bpw1PendingHrDevice = {
					deviceId,
					deviceSn
				}
				// 心率后到：立刻尝试与暂存血压合并同报
				this.tryMergeBPW1PendingHistory(deviceId, deviceSn)
			},
			/** 历史同步：血压先到时暂存，等心率后到再合并 */
			appendBPW1PendingBpHistory(bpRecords, deviceId, deviceSn) {
				if (!this.bpw1PendingBpHistory) {
					this.bpw1PendingBpHistory = []
				}
				const map = new Map();
				(this.bpw1PendingBpHistory || []).forEach(bp => {
					map.set(this.normalizeDateTimeKey(`${bp.date} ${bp.time}`), bp)
				});
				(bpRecords || []).forEach(bp => {
					map.set(this.normalizeDateTimeKey(`${bp.date} ${bp.time}`), bp)
				})
				this.bpw1PendingBpHistory = Array.from(map.values())
				this.bpw1PendingBpDevice = {
					deviceId,
					deviceSn
				}
			},
			/** 历史暂存血压墙钟附近是否有未配心率的血压（供实时伴随心率并入） */
			hasBPW1PendingHistoryBpNear(hrWallKey, tolSec = 90) {
				const list = this.bpw1PendingBpHistory || []
				if (!list.length) {
					return false
				}
				const hrKey = this.normalizeDateTimeKey(hrWallKey)
				const hrTs = this.datatime(hrKey)
				if (!hrKey || !hrTs) {
					return false
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				for (let i = 0; i < list.length; i++) {
					const bp = list[i]
					const bpKey = this.normalizeDateTimeKey(`${bp.date} ${bp.time}`)
					if (!bpKey) {
						continue
					}
					if (bpKey === hrKey) {
						return true
					}
					const bpTs = this.datatime(bpKey)
					if (bpTs && Math.abs(bpTs - hrTs) <= tol) {
						return true
					}
				}
				return false
			},
			/**
			 * 实时/尾包心率并入历史暂存血压后同报。
			 * 解决：血压先走历史上报暂存，伴随心率后到走实时路径，同秒却互相看不见。
			 * @returns {boolean} 已接手（并入/同报），调用方勿再单独报心率
			 */
			mergeRealtimeHrIntoBPW1PendingHistoryBp(wallKey, hrVal, deviceId, deviceSn, hrMeta) {
				const key = this.normalizeDateTimeKey(wallKey)
				const hrNum = this.normalizeBPW1Heartrate(hrVal)
				if (!key || hrNum === '') {
					return false
				}
				if (!this.hasBPW1PendingHistoryBpNear(key, 90)) {
					return false
				}
				const parts = String(key).split(' ')
				const fromMeta = hrMeta && typeof hrMeta === 'object' ? hrMeta : null
				const hrRec = {
					date: (fromMeta && fromMeta.date) || parts[0],
					time: (fromMeta && fromMeta.time) || parts[1],
					heartRate: hrNum,
					isAuto: !!(fromMeta && fromMeta.isAuto === true)
				}
				if (fromMeta && fromMeta.hrType != null) {
					hrRec.hrType = fromMeta.hrType
				}
				console.log('BPW1实时心率并入历史暂存血压:', key, hrNum)
				this.appendBPW1PendingHrHistory([hrRec], deviceId, deviceSn)
				return true
			},
			/**
			 * 历史分包顺序无关：用暂存血压+心率合并同报，已成功上报的从暂存移除
			 */
			tryMergeBPW1PendingHistory(deviceId, deviceSn) {
				const bps = this.bpw1PendingBpHistory || []
				const hrs = this.collectBPW1HistoryHrForMerge(this.bpw1PendingHrHistory)
				if (!bps.length || !hrs.length) {
					return
				}
				const uploadMac = deviceId || (this.bpw1PendingBpDevice && this.bpw1PendingBpDevice.deviceId) ||
					(this.bpw1PendingHrDevice && this.bpw1PendingHrDevice.deviceId)
				const uploadSn = deviceSn || (this.bpw1PendingBpDevice && this.bpw1PendingBpDevice.deviceSn) ||
					(this.bpw1PendingHrDevice && this.bpw1PendingHrDevice.deviceSn)
				console.log('BPW1历史暂存合并', {
					bp: bps.length,
					hr: hrs.length
				})
				// bypass：同一天密集体征重试时勿被首轮 batchKey 挡住
				this.mergeAndUploadWithDeduplication(hrs, bps, uploadMac, uploadSn, {
					bypassBatchDedupe: true,
					hrMatchBpPairTol: 90
				})
				// 已上报 / 服务端已有：从暂存剔除，避免反复占心率
				this.bpw1PendingBpHistory = (this.bpw1PendingBpHistory || []).filter(bp => {
					const key = this.normalizeDateTimeKey(`${bp.date} ${bp.time}`)
					const timeTs = String(this.datatime(key))
					if (this.bpw1UploadedBpTimeSet && this.bpw1UploadedBpTimeSet.has(timeTs)) {
						return false
					}
					if (this._bpw1DeferredBpTimeSet && this._bpw1DeferredBpTimeSet.has(timeTs)) {
						return false
					}
					if (this.hasServerBloodPressureAt(key)) {
						return false
					}
					return true
				})
			},
			/** 同步/宽限期内历史上报入队（跨包汇总后正序串行） */
			enqueueBPW1DeferredHistoryUpload(item) {
				if (!item || item.timess === '' || item.timess == null) {
					return
				}
				if (!this.bpw1DeferredHistoryUploads) {
					this.bpw1DeferredHistoryUploads = []
				}
				const kind = item.kind || 'bp'
				const tsKey = String(item.timess)
				if (kind === 'bp') {
					if (!this._bpw1DeferredBpTimeSet) {
						this._bpw1DeferredBpTimeSet = new Set()
					}
					if (this._bpw1DeferredBpTimeSet.has(tsKey)) {
						return
					}
					this._bpw1DeferredBpTimeSet.add(tsKey)
				} else if (kind === 'hr') {
					if (!this._bpw1DeferredHrTimeSet) {
						this._bpw1DeferredHrTimeSet = new Set()
					}
					const hrKey = `${tsKey}|${item.hr}`
					if (this._bpw1DeferredHrTimeSet.has(hrKey)) {
						return
					}
					this._bpw1DeferredHrTimeSet.add(hrKey)
				} else if (kind === 'spo2') {
					if (!this._bpw1DeferredSpO2TimeSet) {
						this._bpw1DeferredSpO2TimeSet = new Set()
					}
					const o2Key = `${tsKey}|${item.spo2}`
					if (this._bpw1DeferredSpO2TimeSet.has(o2Key)) {
						return
					}
					this._bpw1DeferredSpO2TimeSet.add(o2Key)
				}
				this.bpw1DeferredHistoryUploads.push(item)
				// 入队后防抖上报：跨包汇一小会儿再正序串行，避免一直等到宽限结束才报
				this.scheduleBPW1DeferredHistoryFlush(2000)
			},
			scheduleBPW1DeferredHistoryFlush(delayMs = 2000) {
				if (this.bpw1DeferredFlushTimer) {
					clearTimeout(this.bpw1DeferredFlushTimer)
					this.bpw1DeferredFlushTimer = null
				}
				const wait = Math.max(0, Number(delayMs) || 0)
				this.bpw1DeferredFlushTimer = setTimeout(() => {
					this.bpw1DeferredFlushTimer = null
					this.flushBPW1DeferredHistoryUploads().catch(e => {
						console.error('BPW1历史防抖上报失败', e)
					})
				}, wait)
			},
			/** 历史上报正序串行：旧→新；每条间隔 10ms */
			async flushBPW1HistoryUploadList(list) {
				const uploads = Array.isArray(list) ? list.slice() : []
				if (!uploads.length) {
					return
				}
				uploads.sort((a, b) => Number(a.timess) - Number(b.timess))
				for (let i = 0; i < uploads.length; i++) {
					if (i > 0) {
						await new Promise(resolve => setTimeout(resolve, 10))
					}
					const item = uploads[i]
					const kind = item.kind || 'bp'
					try {
						if (kind === 'spo2') {
							await this.jakoblife_fat_scale3(item.deviceId, item.spo2, item.deviceSn, '血氧', item
								.timess)
						} else {
							await this.Watch_Historical_data(
								item.deviceId,
								item.high || '',
								item.low || '',
								item.hr || '',
								item.deviceSn,
								item.timess,
								item.opts || {}
							)
						}
					} catch (e) {
						console.error('BPW1历史上报失败', kind, item.timess, e)
					}
				}
			},
			async flushBPW1DeferredHistoryUploads() {
				if (this.bpw1DeferredFlushTimer) {
					clearTimeout(this.bpw1DeferredFlushTimer)
					this.bpw1DeferredFlushTimer = null
				}
				const list = this.bpw1DeferredHistoryUploads || []
				this.bpw1DeferredHistoryUploads = []
				// 仅清本批已取出的去重键；flush 期间新入队的键仍保留在新 Set
				const flushingBp = new Set()
				const flushingHr = new Set()
				const flushingSpO2 = new Set()
				list.forEach(item => {
					const tsKey = String(item.timess)
					const kind = item.kind || 'bp'
					if (kind === 'bp') {
						flushingBp.add(tsKey)
					} else if (kind === 'hr') {
						flushingHr.add(`${tsKey}|${item.hr}`)
					} else if (kind === 'spo2') {
						flushingSpO2.add(`${tsKey}|${item.spo2}`)
					}
				})
				if (this._bpw1DeferredBpTimeSet && flushingBp.size) {
					flushingBp.forEach(k => this._bpw1DeferredBpTimeSet.delete(k))
				}
				if (this._bpw1DeferredHrTimeSet && flushingHr.size) {
					flushingHr.forEach(k => this._bpw1DeferredHrTimeSet.delete(k))
				}
				if (this._bpw1DeferredSpO2TimeSet && flushingSpO2.size) {
					flushingSpO2.forEach(k => this._bpw1DeferredSpO2TimeSet.delete(k))
				}
				if (!list.length) {
					return
				}
				console.log('BPW1历史正序串行上报', list.length, '条')
				await this.flushBPW1HistoryUploadList(list)
			},
			/** 墙钟 key ±N 秒的归一化集合（血压/心率分包差 1 秒时合并用） */
			addNearDateTimeKeys(targetSet, dateTimeKey, tolSec = 1) {
				const key = this.normalizeDateTimeKey(dateTimeKey)
				if (!key || !targetSet) {
					return
				}
				targetSet.add(key)
				const ts = this.datatime(key)
				if (!ts) {
					return
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				for (let d = -tol; d <= tol; d++) {
					if (d === 0) {
						continue
					}
					targetSet.add(this.normalizeDateTimeKey(this.formatTimestampKey(ts + d)))
				}
			},
			/** 墙钟 key 是否落在集合内（含±N 秒） */
			isDateTimeKeyNearSet(dateTimeKey, keySet, tolSec = 1) {
				if (!keySet) {
					return false
				}
				const key = this.normalizeDateTimeKey(dateTimeKey)
				if (!key) {
					return false
				}
				if (keySet.has(key)) {
					return true
				}
				const ts = this.datatime(key)
				if (!ts) {
					return false
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				for (let d = -tol; d <= tol; d++) {
					if (d === 0) {
						continue
					}
					if (keySet.has(this.normalizeDateTimeKey(this.formatTimestampKey(ts + d)))) {
						return true
					}
				}
				return false
			},
			/** 本会话血压上报 unix 是否在 ±N 秒内已有 */
			hasBPW1BpUploadedNearTs(timeTs, tolSec = 1) {
				const ts = Number(timeTs)
				const store = this.bpw1UploadedBpTimeSet
				if (!Number.isFinite(ts) || !store) {
					return false
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				for (let d = -tol; d <= tol; d++) {
					if (store.has(String(ts + d))) {
						return true
					}
				}
				return false
			},
			/**
			 * 在心率 Map 中按血压墙钟匹配（先精确，再 ±tolSec）
			 * @param {object} [opts]
			 * @param {boolean} [opts.preferManual] 放宽窗口时优先手测心率（血压测量伴随包）
			 * @param {boolean} [opts.manualOnly] 仅手测心率，不回落自动心率（避免宽窗误配定时/独立自动心率）
			 * @returns {{ key: string, hr: object }|null}
			 */
			findMatchedHrInMap(hrMap, bpDateTimeKey, tolSec = 1, opts) {
				if (!hrMap || typeof hrMap.get !== 'function') {
					return null
				}
				const bpKey = this.normalizeDateTimeKey(bpDateTimeKey)
				if (!bpKey) {
					return null
				}
				const preferManual = !!(opts && opts.preferManual)
				const manualOnly = !!(opts && opts.manualOnly)
				const sameDateOnly = !!(opts && opts.sameDateOnly)
				const excludeKeys = opts && opts.excludeKeys
				const bpDate = bpKey.split(' ')[0] || ''
				const isExcludedHrKey = (hrKey) => {
					if (!excludeKeys || typeof excludeKeys.has !== 'function') {
						return false
					}
					// 允许匹配自己的墙钟；禁止挪用同包其它血压点的心率
					return hrKey !== bpKey && excludeKeys.has(hrKey)
				}
				const sameDateOk = (hrKey) => {
					if (!sameDateOnly || !bpDate) {
						return true
					}
					return String(hrKey).startsWith(bpDate + ' ')
				}
				if (hrMap.has(bpKey) && !isExcludedHrKey(bpKey) && sameDateOk(bpKey)) {
					const exactHr = hrMap.get(bpKey)
					const exactIsAuto = !!(exactHr && exactHr.isAuto === true)
					// manualOnly：同秒自动心率不当伴随；preferManual：同秒自动先跳过，交给下方找手测
					if (!(manualOnly && exactIsAuto) && !(preferManual && !manualOnly && exactIsAuto)) {
						return {
							key: bpKey,
							hr: exactHr
						}
					}
				}
				const bpTs = this.datatime(bpKey)
				if (!bpTs) {
					return null
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				const pickBest = (onlyManual) => {
					let best = null
					let bestDiff = Infinity
					hrMap.forEach((hr, key) => {
						if (onlyManual && hr && hr.isAuto === true) {
							return
						}
						if (isExcludedHrKey(key) || !sameDateOk(key)) {
							return
						}
						const hrTs = this.datatime(key)
						if (!hrTs) {
							return
						}
						const diff = Math.abs(hrTs - bpTs)
						if (diff <= tol && diff < bestDiff) {
							best = {
								key,
								hr
							}
							bestDiff = diff
						}
					})
					return best
				}
				if (manualOnly) {
					return pickBest(true)
				}
				if (preferManual) {
					return pickBest(true) || pickBest(false)
				}
				return pickBest(false)
			},
			/**
			 * 血压-心率历史全局唯一配对：按时间差从小到大认领，避免密集测量互相抢邻点
			 * 仅供 mergeAndUploadWithDeduplication 使用，不影响实时路径
			 */
			assignBPW1HistoryBpHrMatches(bpItems, hrMap, tolSec, opts) {
				if (!bpItems || !bpItems.length || !hrMap || typeof hrMap.forEach !== 'function') {
					return
				}
				const that = this
				const preferManual = !!(opts && opts.preferManual)
				const manualOnly = !!(opts && opts.manualOnly)
				const sameDateOnly = !!(opts && opts.sameDateOnly)
				const excludeKeys = opts && opts.excludeKeys
				const tol = Math.max(0, Number(tolSec) || 0)
				const candidates = []
				bpItems.forEach((item, bpIdx) => {
					if (item.matchedNear || item.skipExisting || !item.normalizedKey) {
						return
					}
					const bpKey = item.normalizedKey
					const bpDate = bpKey.split(' ')[0] || ''
					const bpTs = that.datatime(bpKey)
					if (!bpTs) {
						return
					}
					hrMap.forEach((hr, hrKey) => {
						if (manualOnly && hr && hr.isAuto === true) {
							return
						}
						if (excludeKeys && typeof excludeKeys.has === 'function' &&
							hrKey !== bpKey && excludeKeys.has(hrKey)) {
							return
						}
						if (sameDateOnly && bpDate && !String(hrKey).startsWith(bpDate + ' ')) {
							return
						}
						const hrTs = that.datatime(hrKey)
						if (!hrTs) {
							return
						}
						const diff = Math.abs(hrTs - bpTs)
						if (diff > tol) {
							return
						}
						const isManual = !(hr && hr.isAuto === true)
						candidates.push({
							bpIdx,
							hrKey,
							diff,
							manualRank: isManual ? 0 : 1
						})
					})
				})
				candidates.sort((a, b) => {
					if (preferManual || manualOnly) {
						if (a.manualRank !== b.manualRank) {
							return a.manualRank - b.manualRank
						}
					}
					if (a.diff !== b.diff) {
						return a.diff - b.diff
					}
					return a.bpIdx - b.bpIdx
				})
				const usedBp = new Set()
				candidates.forEach(c => {
					if (usedBp.has(c.bpIdx) || !hrMap.has(c.hrKey)) {
						return
					}
					const item = bpItems[c.bpIdx]
					if (!item || item.matchedNear) {
						return
					}
					item.matchedNear = {
						key: c.hrKey,
						hr: hrMap.get(c.hrKey)
					}
					hrMap.delete(c.hrKey)
					usedBp.add(c.bpIdx)
				})
			},
			/** 实时心率短缓存，供随后到达的血压包合并 */
			rememberBPW1RealtimeHr(wallKey, hrVal) {
				const key = this.normalizeDateTimeKey(wallKey)
				if (!key || hrVal === '' || hrVal == null) {
					return
				}
				if (!this.bpw1RecentRealtimeHr) {
					this.bpw1RecentRealtimeHr = []
				}
				const now = Date.now()
				this.bpw1RecentRealtimeHr = this.bpw1RecentRealtimeHr.filter(item => now - (item.at || 0) < 30000)
				const ts = this.datatime(key)
				const existIdx = this.bpw1RecentRealtimeHr.findIndex(item => item.key === key)
				const row = {
					key,
					hrVal,
					ts,
					at: now
				}
				if (existIdx >= 0) {
					this.bpw1RecentRealtimeHr.splice(existIdx, 1, row)
				} else {
					this.bpw1RecentRealtimeHr.push(row)
				}
				if (this.bpw1RecentRealtimeHr.length > 30) {
					this.bpw1RecentRealtimeHr = this.bpw1RecentRealtimeHr.slice(-30)
				}
			},
			markBPW1RealtimeHrConsumed(wallKey, tolSec = 1) {
				if (!this.bpw1RealtimeHrConsumedKeys) {
					this.bpw1RealtimeHrConsumedKeys = new Set()
				}
				this.addNearDateTimeKeys(this.bpw1RealtimeHrConsumedKeys, wallKey, tolSec)
			},
			isBPW1RealtimeHrConsumed(wallKey) {
				const key = this.normalizeDateTimeKey(wallKey)
				return !!(key && this.bpw1RealtimeHrConsumedKeys && this.bpw1RealtimeHrConsumedKeys.has(key))
			},
			/** 取血压设备墙钟±tol秒内的实时心率并标记已消费，避免再单独上报 */
			takeBPW1RealtimeHrNear(bpWallKey, tolSec = 3) {
				const bpKey = this.normalizeDateTimeKey(bpWallKey)
				const bpTs = this.datatime(bpKey)
				if (!bpTs || !this.bpw1RecentRealtimeHr || !this.bpw1RecentRealtimeHr.length) {
					return ''
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				let bestIdx = -1
				let bestDiff = Infinity
				this.bpw1RecentRealtimeHr.forEach((item, idx) => {
					const hrTs = item.ts || this.datatime(item.key)
					if (!hrTs) {
						return
					}
					const diff = Math.abs(hrTs - bpTs)
					if (diff <= tol && diff < bestDiff) {
						bestDiff = diff
						bestIdx = idx
					}
				})
				if (bestIdx < 0) {
					return ''
				}
				const matched = this.bpw1RecentRealtimeHr.splice(bestIdx, 1)[0]
				this.markBPW1RealtimeHrConsumed(matched.key, tolSec)
				this.markBPW1RealtimeHrConsumed(bpKey, tolSec)
				return matched.hrVal
			},
			/**
			 * 血压测量兜底：取最近短时间内缓存的心率（墙钟对不齐时仍合并同报）
			 * @param {number} maxAgeMs 收包时间窗口
			 */
			takeBPW1MostRecentRealtimeHr(maxAgeMs = 15000) {
				if (!this.bpw1RecentRealtimeHr || !this.bpw1RecentRealtimeHr.length) {
					return ''
				}
				const now = Date.now()
				const maxAge = Math.max(1000, Number(maxAgeMs) || 15000)
				let bestIdx = -1
				let bestAt = -1
				this.bpw1RecentRealtimeHr.forEach((item, idx) => {
					const at = Number(item.at) || 0
					if (now - at > maxAge) {
						return
					}
					if (at >= bestAt) {
						bestAt = at
						bestIdx = idx
					}
				})
				if (bestIdx < 0) {
					return ''
				}
				const matched = this.bpw1RecentRealtimeHr.splice(bestIdx, 1)[0]
				if (matched && matched.key) {
					this.markBPW1RealtimeHrConsumed(matched.key, 3)
				}
				return matched ? matched.hrVal : ''
			},
			/** 记录刚上报的实时血压设备墙钟，供迟到心率判断勿再单独报（短时有效） */
			markBPW1RealtimeBpWall(bpWallKey, tolSec = 3) {
				if (!this.bpw1RecentRealtimeBpWallKeys) {
					this.bpw1RecentRealtimeBpWallKeys = new Set()
				}
				this.addNearDateTimeKeys(this.bpw1RecentRealtimeBpWallKeys, bpWallKey, tolSec)
				this._bpw1RealtimeBpWallUntil = Date.now() + 8000
			},
			isBPW1RealtimeBpNearWall(hrWallKey) {
				if (!this._bpw1RealtimeBpWallUntil || Date.now() > this._bpw1RealtimeBpWallUntil) {
					this.bpw1RecentRealtimeBpWallKeys = null
					return false
				}
				return this.isDateTimeKeyNearSet(hrWallKey, this.bpw1RecentRealtimeBpWallKeys, 3)
			},
			hasBPW1PendingBpHrNear(hrWallKey) {
				const pending = this.bpw1PendingBpHrUpload
				if (!pending || !pending.wallKey || pending.uploading) {
					return false
				}
				const hrKey = this.normalizeDateTimeKey(hrWallKey)
				const bpKey = this.normalizeDateTimeKey(pending.wallKey)
				if (!hrKey || !bpKey) {
					return false
				}
				if (hrKey === bpKey) {
					return true
				}
				const hrTs = this.datatime(hrKey)
				const bpTs = this.datatime(bpKey)
				return !!(hrTs && bpTs && Math.abs(hrTs - bpTs) <= 3)
			},
			clearBPW1PendingBpHrUploadTimer() {
				const pending = this.bpw1PendingBpHrUpload
				if (pending && pending.timer) {
					clearTimeout(pending.timer)
					pending.timer = null
				}
			},
			/** 解析有效心率（>0 数字），供血压同报；无效返回 '' */
			normalizeBPW1Heartrate(val) {
				if (val === '' || val == null || val === '-') {
					return ''
				}
				const n = Number(val)
				return Number.isFinite(n) && n > 0 ? n : ''
			},
			/**
			 * 挂起实时血压，等伴随心率到齐后只调用一次上报接口
			 * 上报格式固定含 lowPressure/highPressure/heartrate，心率必有
			 */
			queueBPW1BpHrCombinedUpload(opts) {
				const that = this
				that.clearBPW1PendingBpHrUploadTimer()
				const wallKey = that.normalizeDateTimeKey(opts.wallKey)
				let matchedHr = that.normalizeBPW1Heartrate(opts.matchedHr)
				if (matchedHr === '') {
					matchedHr = that.normalizeBPW1Heartrate(that.takeBPW1RealtimeHrNear(wallKey, 3))
				}
				that.markBPW1RealtimeBpWall(wallKey, 3)
				that.bpw1PendingBpHrUpload = {
					wallKey,
					systolic: Number(opts.systolic),
					diastolic: Number(opts.diastolic),
					uploadTime: opts.uploadTime,
					deviceId: opts.deviceId,
					deviceSn: opts.deviceSn,
					matchedHr,
					onDone: opts.onDone || null,
					timer: null,
					uploading: false,
					waitRound: 0
				}
				if (that.bpw1PendingBpHrUpload.matchedHr !== '') {
					that.flushBPW1PendingBpHrUpload('hr-ready')
					return
				}
				console.log('BPW1血压已挂起，等待伴随心率同报:', wallKey)
				that.bpw1PendingBpHrUpload.timer = setTimeout(() => {
					that.flushBPW1PendingBpHrUpload('timeout')
				}, 2500)
			},
			/**
			 * 心率到达时尝试并入挂起的血压，成功则已触发同一次上报
			 */
			tryMergeHrIntoPendingBpUpload(wallKey, hrVal) {
				const pending = this.bpw1PendingBpHrUpload
				if (!pending || pending.uploading) {
					return false
				}
				if (!this.hasBPW1PendingBpHrNear(wallKey)) {
					return false
				}
				const normalizedHr = this.normalizeBPW1Heartrate(hrVal)
				if (normalizedHr === '') {
					return false
				}
				pending.matchedHr = normalizedHr
				this.markBPW1RealtimeHrConsumed(wallKey, 3)
				this.markBPW1RealtimeHrConsumed(pending.wallKey, 3)
				this.flushBPW1PendingBpHrUpload('hr-merged')
				return true
			},
			flushBPW1PendingBpHrUpload(reason) {
				const that = this
				const pending = that.bpw1PendingBpHrUpload
				if (!pending || pending.uploading) {
					return
				}
				pending.uploading = true
				that.clearBPW1PendingBpHrUploadTimer()
				let matchedHr = that.normalizeBPW1Heartrate(pending.matchedHr)
				if (matchedHr === '') {
					matchedHr = that.normalizeBPW1Heartrate(that.takeBPW1RealtimeHrNear(pending.wallKey, 3))
				}
				if (matchedHr === '') {
					matchedHr = that.normalizeBPW1Heartrate(that.takeBPW1MostRecentRealtimeHr(20000))
				}
				// 仍无心率：继续等（最多再等 2 轮），绝不发缺心率的血压包
				if (matchedHr === '') {
					pending.waitRound = (pending.waitRound || 0) + 1
					if (pending.waitRound <= 2) {
						pending.uploading = false
						console.log('BPW1血压仍缺心率，继续等待同报', reason, pending.waitRound)
						pending.timer = setTimeout(() => {
							that.flushBPW1PendingBpHrUpload('timeout-retry')
						}, 2500)
						return
					}
					// 最后兜底：首页刚刷过的有效脉搏（同一次测量通常已写入）
					matchedHr = that.normalizeBPW1Heartrate(that.pulse)
				}
				if (matchedHr === '') {
					console.log('BPW1血压无有效心率，取消本次上报（保证格式含 heartrate）', reason)
					that.bpw1PendingBpHrUpload = null
					// 无完整数据时不启 PPG，避免后续再拆报
					return
				}
				const onDone = pending.onDone
				const payload = {
					deviceId: pending.deviceId,
					deviceSn: pending.deviceSn,
					systolic: Number(pending.systolic),
					diastolic: Number(pending.diastolic),
					uploadTime: pending.uploadTime,
					wallKey: pending.wallKey,
					matchedHr
				}
				that.bpw1PendingBpHrUpload = null
				that.markBPW1RealtimeBpWall(payload.wallKey, 3)
				// 血压+伴随心率已齐：先启 PPG，不依赖后续上报/查重是否成功
				if (typeof onDone === 'function') {
					try {
						onDone()
					} catch (e) {
						console.error('BPW1血压后PPG回调异常', e)
					}
				}
				uni.getNetworkType({
					success: async function(res) {
						if (res.networkType === 'none') {
							return
						}
						if (that.isBPW1HistorySyncing()) {
							console.log('BPW1历史同步中，跳过挂起血压上报')
							return
						}
						try {
							await that.queryBloodPressureDataAsync(that.deviceSnuserID)
							if (that.hasServerBloodPressureAt(payload.wallKey)) {
								console.log('BPW1血压服务端已存在，跳过挂起上报:', payload.wallKey)
								return
							}
							console.log('BPW1血压+心率同一次上报', reason, {
								bp: `${payload.systolic}/${payload.diastolic}`,
								hr: payload.matchedHr,
								time: payload.uploadTime
							})
							that.jakoblife_fat_scale22(
								payload.deviceId,
								payload.systolic,
								payload.diastolic,
								payload.matchedHr,
								payload.deviceSn,
								payload.uploadTime, {
									requireBpWithHr: true
								}
							)
							that.markSessionHrUploadedNear(String(payload.uploadTime), payload.matchedHr, 3)
							that.markSessionHrUploadedNear(String(that.datatime(payload.wallKey)), payload
								.matchedHr, 3)
						} catch (e) {
							console.error('BPW1挂起血压上报失败', e)
						}
					},
					fail: function(err) {
						console.error('获取网络类型失败：', err)
					}
				})
			},
			/** 血压后启 PPG / 新测量前：清掉血压认领标记，避免误拦随后测到的心率 */
			clearBPW1BpHrMergeGuards() {
				this.clearBPW1PendingBpHrUploadTimer()
				this.bpw1PendingBpHrUpload = null
				this.bpw1RecentRealtimeBpWallKeys = null
				this.bpw1RealtimeHrConsumedKeys = null
				this._bpw1RealtimeBpWallUntil = 0
			},
			/** 历史 pending 中移除已随血压合并的心率（含±1秒） */
			removeBPW1PendingHrNearKeys(dateTimeKeys, tolSec = 1) {
				if (!this.bpw1PendingHrHistory || !this.bpw1PendingHrHistory.length) {
					return
				}
				const drop = new Set();
				(dateTimeKeys || []).forEach(k => this.addNearDateTimeKeys(drop, k, tolSec))
				if (!drop.size) {
					return
				}
				this.bpw1PendingHrHistory = this.bpw1PendingHrHistory.filter(hr => {
					const key = this.normalizeDateTimeKey(`${hr.date} ${hr.time}`)
					return !drop.has(key)
				})
			},
			sendstartheartwatch(writeuuid, type) {
				let that = this
				// 情绪/血压后 PPG：退出纯心率模式
				that.clearBPW1PureHrMeasure()
				// 新一轮 PPG/情绪测量：清掉血压合并认领，避免误拦本轮心率上报
				that.clearBPW1BpHrMergeGuards()
				// 同步历史数据期间不启动 PPG；记待启动，同步结束后再发
				if (that.isBPW1HistorySyncing()) {
					if (that.immediateEmotionMeasure && !that.yalixueyatype) {
						that.bpw1PendingManualPpg = true
						console.log('BPW1同步历史中，手动PPG待同步结束后启动')
					} else if (that.yalixueyatype) {
						that.bpw1PendingBpAfterPpg = true
						console.log('BPW1同步历史中，血压后PPG待同步结束后启动')
					} else {
						console.log('BPW1同步历史中，跳过PPG启动')
					}
					return
				}
				let deviceIdwatchBPW1 = uni.getStorageSync("deviceIdwatch")
				that.OTAdata(that.deviceIdwatch ? that.deviceIdwatch : deviceIdwatchBPW1, BPW1serviceId, BPW1write)
				// 血压后 PPG：外层已等 20s，短延迟下发；情绪立即测量仍 5s
				const writeDelayMs = that.yalixueyatype ? 800 : 5000
				setTimeout(() => {
					// 延迟发送前再次确认，避免同步期间预约的启动在同步结束后误触发
					if (that.isBPW1HistorySyncing()) {
						if (that.immediateEmotionMeasure && !that.yalixueyatype) {
							that.bpw1PendingManualPpg = true
							console.log('BPW1同步历史中，手动PPG待同步结束后启动')
						} else if (that.yalixueyatype) {
							that.bpw1PendingBpAfterPpg = true
							console.log('BPW1同步历史中，血压后PPG改待同步结束后启动')
						} else {
							console.log('BPW1同步历史中，取消延迟PPG启动')
						}
						return
					}
					let buffer2 = that.toArrayBuffer("e00006f3060104000101")
					if (isBpw1NewEmotionFirmware()) {
						buffer2 = that.toArrayBuffer("e0000611030125000101") //5.8.5||5.8.7的版本情绪测量命令
					} else {
						buffer2 = that.toArrayBuffer("e00006f3060104000101")
					}
					// 标记本轮为允许的 PPG 会话（立即测量 / 血压后）；定时由 sendwatch 标记
					that.bpw1PpgSessionActive = true
					that.bpw1PpgUploadDone = false
					that.bpw1PpgStatus02Handled = false
					that.QX_FAIL = false
					// 启动 PPG 即置灰，仅写失败/成功收尾/中断恢复再解开
					that.setSleepAlertDisabled(true)
					console.log('BPW1下发PPG测量命令', that.yalixueyatype ? '血压后' : '情绪/其它')
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceIdwatch ? that.deviceIdwatch : deviceIdwatchBPW1,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							if (that.isBPW1BleWriteOk(complete)) {
								uni.hideLoading()
								that.setSleepAlertDisabled(true)
								// 仅立即测量弹「测量中」；定时(sendwatch)/血压后静默
								const sendwatchOn = uni.getStorageSync('sendwatch') === 1 ||
									uni.getStorageSync('sendwatch') === '1'
								if (!that.yalixueyatype && !sendwatchOn) {
									uni.showLoading({
										title: that.$t("测量中"),
										mask: true,
									})
								}
								// 写成功后即启动超时兜底：设备若不回 ACK，仍能恢复按钮
								that.armBPW1EmotionButtonWatchdog()
							} else {
								uni.hideLoading()
								that.bpw1PpgSessionActive = false
								that.yalixueyatype = false
								that.immediateEmotionMeasure = false
								that.sleep_alertid = 0
								that.setSleepAlertDisabled(false)
								uni.showToast({
									title: that.$t("请检查设备连接"),
									icon: 'none',
									duration: 2000
								})
							}
						},
					})
				}, writeDelayMs)
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
			/** BPW6 情绪/运动相关通道是否已连接 */
			isBpw6EmotionDeviceConnected() {
				const a6 = this.acktypes6
				return a6 === '1' || a6 === 1 || a6 === true
			},
			/** 解析当前是否绑定 BPW1(30000) / BPW6(30001)，优先服务端绑定列表 */
			resolveBoundWatchTypes() {
				let boundBpw1 = false
				let boundBpw6 = false
				try {
					const list = uni.getStorageSync('lixianlist')
					const rows = Array.isArray(list) ? list : ((list && list.rows) || [])
					if (Array.isArray(rows) && rows.length) {
						boundBpw1 = rows.some(row => String(row && row.deviceModelId) === '30000')
						boundBpw6 = rows.some(row => String(row && row.deviceModelId) === '30001')
					}
				} catch (e) {}
				const types = this.devicetypelist || []
				if (types.includes(30000) || types.includes('30000')) boundBpw1 = true
				if (types.includes(30001) || types.includes('30001')) boundBpw6 = true
				// 绑定列表为空时，再回退本地 mac（避免未拉到列表时完全不能同步）
				if (!boundBpw1 && !boundBpw6) {
					boundBpw1 = !!(this.deviceIdwatch || uni.getStorageSync('deviceIdwatch'))
					boundBpw6 = !!(this.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac'))
				}
				return {
					boundBpw1,
					boundBpw6
				}
			},
			/** 步数页：按绑定设备同步步数（BPW1→getsetp，BPW6→readDailyInfo，不混发） */
			async syncStepsFromDevice() {
				const that = this
				if (that.currentIndex !== 4) {
					return
				}
				const {
					boundBpw1,
					boundBpw6
				} = that.resolveBoundWatchTypes()
				const bpw6Connected = that.isBpw6EmotionDeviceConnected()
				const bpw1Connected = that.acktypes === '1' || that.acktypes === 1
				const toastSyncing = () => {
					uni.showToast({
						title: that.$t('数据同步中请稍后'),
						icon: 'none',
						duration: 1500
					})
				}
				const toastDisconnected = () => {
					uni.showToast({
						title: that.$t('设备未连接'),
						icon: 'none',
						duration: 1500
					})
				}
				if (!boundBpw1 && !boundBpw6) {
					toastDisconnected()
					return
				}
				// 两者都绑定时：谁连着走谁；都连着优先 BPW6（运动/睡眠日数据）
				if (boundBpw6 && bpw6Connected) {
					const deviceId = that.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac') ||
						(u16proBLE && u16proBLE.deviceId)
					if (!deviceId) {
						toastDisconnected()
						return
					}
					toastSyncing()
					try {
						await that.readBpw6DailyInfoWeek(deviceId)
						that.fetchWeekStepsFromApi()
					} catch (err) {
						console.error('【BPW6】读取运动/睡眠信息失败', err)
					}
					return
				}
				if (boundBpw1 && bpw1Connected) {
					const deviceId = that.deviceIdwatch || uni.getStorageSync('deviceIdwatch')
					if (!deviceId) {
						toastDisconnected()
						return
					}
					that.getsetp(deviceId, BPW1serviceId, BPW1write, 0x01)
					toastSyncing()
					return
				}
				toastDisconnected()
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
				if (index === 1 && this.$refs.pulseDiagnosisRef) {
					this.$refs.pulseDiagnosisRef.loadRealData()
				}
				// BPW1：点击「睡眠」发送一次历史同步，拉取睡眠数据
				if (index === 3 && this.acktypes === "1" && this.deviceIdwatch && !this.isBPW1HistorySyncing()) {
					this.bpw1SleepHistorySyncedOnce = true
					this.Sync_historical_data(this.deviceIdwatch)
				}
			},
			swipeIndex(index) {
				let that = this
				// 获得swiper切换后的current索引
				that.currentIndex = index.detail.current;
				that.resetStates();
				that.getUserInfo();
				// 在数据操作前检查清除
				clearDailyGoalData();
				if (index === 1 && that.$refs.pulseDiagnosisRef) {
					that.$refs.pulseDiagnosisRef.loadRealData()
				}
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							console.log('无网络连接');
						} else {
							let BPtype = uni.getStorageSync("xueyadatatype")
							let BPdata = uni.getStorageSync("xueyadata")
							let TZdata = uni.getStorageSync("tizhidata")
							if (BPtype && BPdata) {
								if (BPtype === "1") {
									that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, BPdata, {
										'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
									}).then(res => {
										if (res.code === 200) {
											that.setbanhua(1)
											let deviceSnlixin = BPdata.deviceSn
											let slaveDatalixian = BPdata.slaveData
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
								} else if (BPtype === "0") {
									that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, BPdata, {
										'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
									}).then(resaa => {
										console.log("血压计", resaa)
										if (resaa.code === 200) {
											that.setbanhua(1)
											let deviceSnlixin = BPdata.deviceSn
											let slaveDatalixian = BPdata.slaveData
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
							if (TZdata) {
								that.$post(that.$url_APP_IP + that.$url_jakoblife_fat_scale, TZdata, {
									'content-type': 'application/json;charset=UTF-8'
								}).then(res => {
									if (res.code === 500) {
										uni.showToast({
											title: that.$t("失败"),
											icon: 'none'
										})
										return
									} else if (res.code === 200) {
										that.setbanhua(1)
										let deviceSntzlx = TZdata.deviceSn
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
				if (that.acktypes === "1" && that.currentIndex === 0) {
					let hexString = uni.getStorageSync("BPW1hexData")
					that.calculateChecksumsss2(hexString, that.deviceIdwatch, BPW1serviceId, BPW1write)
				} else if (that.acktypes === "1" && that.currentIndex === 3) {
					// 睡眠数据在历史同步命令中：进入睡眠页时同步一次
					if (!that.bpw1SleepHistorySyncedOnce && that.deviceIdwatch && !that
						.isBPW1HistorySyncing()) {
						that.bpw1SleepHistorySyncedOnce = true
						that.Sync_historical_data(that.deviceIdwatch)
					}
				}
				if (that.currentIndex === 4) {
					that.fetchWeekStepsFromApi()
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
					// console.log(res)
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
										const matchRules = {
											Blood: (v) => v === "mmHg",
											danwei1: (v) => v === "inch" || v === "英寸",
											danwei2: (v) => v === "kg" || v === "千克"
										};
										const idx = matchRules[key](value) ? 0 : 1;
										uni.setStorageSync(key, idx);
									}
									break;
							}
						});
						this.syncWeightUnitsFromStorage()
						this.hydrateBpFromStorage()
					}
				});
			},
			//帮助按钮
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
			/**
			 * 跳转至手机蓝牙设置
			 */
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
			/**
			 * 臂式血压计获取蓝牙设备的特征值
			 * @param {Object} deviceId 设备MAC
			 * @param {Object} serviceId 设备服务值
			 * @param {Object} deviceSn 设备SN
			 */
			getBLEDeviceCharacteristics1(deviceId, serviceId, deviceSn) {
				let that = this
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: serviceId,
					success: (res) => {
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							//蓝牙消息通知notify
							if (item.properties.notify) {
								that.notifyUuid = res.characteristics[i].uuid
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid,
									success: (notifyres) => {
										that.onBLECharacteristicValueChange1(deviceId, serviceId,
											deviceSn);
									},
									fail: (notifyerr) => {}
								})
							}
						}
					},
					fail(Failerror) {
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
									let Offline_list = uni.getStorageSync("lixianlist");
									that.aaaa(Offline_list.rows)
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
			getBLEDeviceCharacteristicsECG(deviceId, serviceId, deviceSn) {
				let that = this
				that.deviceLists = []
				// 检查是否已经获取过该设备的特征值
				if (that.characteristicsCacheECG.has(deviceId)) {
					uni.openBluetoothAdapter({
						success: () => {
							uni.onBLEConnectionStateChange(function(change) {
								if (!change.connected) {
									console.log('蓝牙设备已断开');
									if (that.characteristicsCacheECG.has(deviceId)) {
										console.log(`清除设备 ${deviceId} 的特征值缓存`);
										that.characteristicsCacheECG.delete(deviceId);
									}
									that.deviceList = [];
									that.queryDevices()
									// 在这里处理设备断开后的逻辑，例如尝试重新连接等
								}
							});
						},
						fail: (err) => {
							console.error('蓝牙适配器初始化失败', err);
							if (that.characteristicsCacheECG.has(deviceId)) {
								console.log(`清除设备 ${deviceId} 的特征值缓存`);
								that.characteristicsCacheECG.delete(deviceId);
							}
							that.deviceList = [];
							that.queryDevices()
						}
					});
					return;
				}
				uni.getBLEDeviceCharacteristics({
					deviceId: deviceId,
					serviceId: SERVICE_ID,
					success: (res) => {
						that.characteristicsCacheECG.add(deviceId); // 缓存设备ID，
						for (let i = 0; res.characteristics.length > i; i++) {
							let item = res.characteristics[i]
							//蓝牙消息通知
							if (item.properties.write) {
								that.deviceIdECG = deviceId
								that.serviceIdECG = SERVICE_ID
								that.uuidECG = WRITE_UUID
							}
							if (item.properties.notify) {
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: SERVICE_ID,
									characteristicId: item.uuid,
									success: (notifyres) => {
										that.resetDataState();
										that.installBleForwardHandler(deviceSn);
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
							that.deviceList = []
							that.disconnectAll(deviceId)
							that.setacktypes("0")
							that.hasSynced = false
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
			getBLEDeviceCharacteristics3(deviceId, serviceId, deviceSn) {
				let that = this
				that.deviceLists = []
				// 检查是否已经获取过该设备的特征值
				if (that.characteristicsCache.has(deviceId)) {
					uni.openBluetoothAdapter({
						success: () => {
							that.ensureBPW1ConnectionStateListener(deviceId)
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
					serviceId: BPW1serviceId,
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
										serviceId: BPW1serviceId,
										characteristicId: BPW1write,
										writeType: "write",
										value: buffer,
										complete(complete) {
											// console.log("发送命令：", "e00006e8000000000101");
											that.deviceIdwatch = deviceId
											that.serviceIdwatch = BPW1serviceId
											that.writeuuid = BPW1write
											uni.setStorageSync("deviceIdwatch", deviceId)
											uni.setStorageSync("serviceIdwatch", BPW1serviceId)
											uni.setStorageSync("writeuuid", BPW1write)
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
								uni.setStorageSync("deviceIdwatch", deviceId)
								uni.setStorageSync("serviceIdwatch", BPW1serviceId)
								uni.setStorageSync("landcharacteristicId", BPW1notify)
								that.notifyUuid = BPW1notify
								uni.notifyBLECharacteristicValueChange({
									state: true, // 启用 notify 功能
									deviceId: deviceId,
									serviceId: BPW1serviceId,
									characteristicId: BPW1notify,
									success: (notifyres) => {
										that.registerBLECharacteristicValueChange(deviceId,
											BPW1serviceId, deviceSn);
										// 首次连接也挂上断线监听，确保手机蓝牙关开能走到回连补同步
										that.ensureBPW1ConnectionStateListener(deviceId)
										// 杀进程重开后保活可能不再推 CMD00：notify 就绪后本会话同步一次历史
										if (that._bpw1PendingBtHistoryResync) {
											that.forceBPW1HistoryResyncAfterReconnect(deviceId)
										} else {
											that.scheduleBPW1SessionHistorySync(deviceId)
										}
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
							that.hasSynced = false
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
			/**
			 * BLE数据解析，兼容多设备数据解析（臂式血压计）
			 */
			onBLECharacteristicValueChange1(deviceId, serviceId, deviceSn) {
				let that = this
				that.resetDataState("261");
				that.installBleForwardHandler(deviceSn);
			},
			/**
			 * 统一 BLE notify 转发（BPW6/PPG 由 u16proBLE 解析后回调，BPW1 等仍在本页处理）
			 */
			installBleForwardHandler(deviceSn) {
				const that = this
				u16proBLE.setForwardNotifyHandler(async (res, bytes, parsedResult) => {
					try {
						if (res.serviceId === SERVICE_ID) {
							that.buffer += that.ab2hex(res.value)
							that.tryParse()
							return
						}
						const isBcService = res.serviceId && res.serviceId.toUpperCase() === BC_BLE_UUID
							.SERVICE.toUpperCase()
						if (parsedResult && (res.serviceId === BPW6SERVICE || isBcService)) {
							// 优先内存/本地当前 SN，避免解绑 BPW1 后仍回退到旧 handler 闭包 SN
							const BPW6SN = that.deviceIdwatch6_SN || uni.getStorageSync("deviceSn") || deviceSn
							const BPW6MAC = res.deviceId
							that.deviceIdwatch6 = BPW6MAC
							uni.setStorageSync("BPW6devicemac", BPW6MAC)
							if (parsedResult) {
								that.BPW6paredata(parsedResult, BPW6MAC, BPW6SN)
							}
							return
						}
						if (res.serviceId === BPW1serviceId) {
							await that.processBPW1BleNotify(res)
							return
						}
						await that.processOtherBleNotify(res, deviceSn)
					} catch (err) {
						console.error('BLE forward handler error', err)
					}
				})
			},
			async processBPW1BleNotify(res) {
				const that = this
				if (res && res.serviceId === BPW1serviceId) {
					if (!that.bpw1NotifyQueue) {
						that.bpw1NotifyQueue = []
					}
					that.bpw1NotifyQueue.push(res)
				} else if (res && res.serviceId !== BPW1serviceId) {
					return
				}
				if (that.bpw1NotifyProcessing) {
					return
				}
				that.bpw1NotifyProcessing = true
				try {
					while (that.bpw1NotifyQueue && that.bpw1NotifyQueue.length) {
						const item = that.bpw1NotifyQueue.shift()
						await that.processBPW1BleNotifyOne(item)
						// 让出事件循环，避免长同步占满主线程导致 qxBle 心跳从 05 直接跳到 17
						await new Promise((resolve) => setTimeout(resolve, 0))
					}
				} finally {
					that.bpw1NotifyProcessing = false
				}
				// 处理期间又入队的包，继续串行消费
				if (that.bpw1NotifyQueue && that.bpw1NotifyQueue.length) {
					that.processBPW1BleNotify(null)
				}
			},
			/**
			 * 单条 BPW1 notify：E0 先回 ACK，再解析；0E 不回 ACK；串行处理下一条
			 */
			async processBPW1BleNotifyOne(res) {
				const that = this
				let BPW1DeviceId = res.deviceId
				let BPW1SN = that.shoubiaosn
				let hexData = that.ab2hex(res.value);
				that.dataBuffer.push(hexData);
				const protocolId = hexData.slice(0, 2);
				const protocolIdppg = hexData.slice(0, 4);
				const cmd = hexData.slice(8, 10);
				if (protocolId === "e0") {
					// 所有 E0 先回 ACK，写成功后再进入业务解析（同包后续 sendack 会去重）
					await that.sendack2(hexData, BPW1DeviceId, BPW1serviceId, BPW1write);
					switch (cmd) {
						case "00":
							await that.sendack(hexData, BPW1DeviceId, BPW1serviceId, BPW1write);
							await that.handleCMD00(hexData, BPW1DeviceId, BPW1serviceId)
							break;
						case "04":
							switch (hexData.slice(12, 14)) {
								case "01":
									that.blewatch_id = "0"
									that.blewatch_id2 = "0"
									await that.handleCMD0401(hexData, BPW1DeviceId, BPW1serviceId, BPW1SN);
									break
								case "00":
									await that.handleCMD04(hexData, BPW1DeviceId, BPW1serviceId, BPW1SN);
									break
								case "10":
									await that.handleCMD0410(hexData, BPW1DeviceId, BPW1serviceId, BPW1write,
										BPW1SN);
									break
								default:
									console.log("default其他数据", hexData)
									that.resetDataState("24")
									break
							}
							break;
						case "03":
							that.blewatch_id2 = "0"
							await that.handleCMD03(hexData, BPW1DeviceId, BPW1serviceId, BPW1write, BPW1SN);
							break;
						case "01":
							that.blewatch_id2 = "0"
							switch (hexData.slice(12, 14)) {
								case "00":
								case "01":
								case "02":
									await that.sendack2(hexData, BPW1DeviceId, BPW1serviceId, BPW1write);
									that.resetDataState("23");
									break
								case "03":
									// 仍用 2s 结束同步标记，避免拖慢 PPG；血压历史尾包靠 grace 窗口承接
									setTimeout(() => {
										that.blewatch_id = "0"
										that.blewatch_id2 = "1"
										that.setBPW1HistorySyncing(false)
										that.sendack2(hexData, BPW1DeviceId, BPW1serviceId, BPW1write);
										that.resetDataState("22");
									}, 2000)
									break
							}
							break
						case "02":
						case "11":
							await that.sendack2(hexData, BPW1DeviceId, BPW1serviceId, BPW1write);
							that.resetDataState("21");
							break;
						case "20":
							console.log("手表升级", hexData)
							await that.Watch_update(hexData, BPW1DeviceId, BPW1serviceId, BPW1write)
							break;
						default:
							break
					}
				} else if (protocolId === "0e") {
					// 0E 为设备 ACK / 情绪相关回包，不回复 ACK
					that.handleProtocol0eEmotion(hexData, cmd, protocolIdppg);
				}
				await that.processCompleteDataSets(BPW1DeviceId, BPW1SN, BPW1serviceId, BPW1write);
			},
			async processOtherBleNotify(res, deviceSn) {
				const that = this
				let BPMAC = res.deviceId
				let BPSN = that.xeuyejisn
				let hexDataBP = that.ab2hex(res.value);
				let asciiString = that.hexToAscii(hexDataBP)
				let BPlixianlist = uni.getStorageSync("lixianlist")
				if (asciiString === "error") {
					that.handleDisconnectRequest(BPMAC);
					uni.getNetworkType({
						success: function(res) {
							if (res.networkType === 'none') {
								console.log('无网络连接');
								that.aaaa(BPlixianlist.rows)
							}
						},
						fail: function(err) {
							console.error('获取网络类型失败：', err);
						}
					});
					return;
				}
				if (hexDataBP.length === 10) {
					uni.closeBLEConnection({
						deviceId: BPMAC,
						success() {},
						fail() {}
					})
					that.disconnectAll(BPMAC)
					that.queryDevices()
					return;
				}
				if (hexDataBP.length === 388 && !hexDataBP.startsWith("0e") && !hexDataBP.startsWith("e0") &&
					that.xueyehuilian && that.xeuyejisn !== "0" && that.xeuyejimac !== "0") {
					await that.handleHuiLianDeviceData(res.value, that.xeuyejisn, that.xeuyejimac);
					uni.getNetworkType({
						success: function(res) {
							if (res.networkType === 'none') {
								console.log('无网络连接');
								that.aaaa(BPlixianlist.rows)
							}
						},
						fail: function(err) {
							console.error('获取网络类型失败：', err);
						}
					});
					return;
				}
				if (hexDataBP.length > 200) {
					let parsedData = that.parseQueryString(asciiString);
					that.jakoblife_fat_scale(BPMAC, parsedData, BPSN)
					return;
				}
				const restype = hexDataBP.slice(14, 16);
				const hexBytes = [];
				const otherData = hexDataBP.slice(16, hexDataBP.length - 2);
				for (let i = 0; i < otherData.length; i += 2) {
					hexBytes.push(otherData.substring(i, i + 2));
				}
				const decimalArray = hexBytes.map(hexByte => parseInt(hexByte, 16));
				switch (restype) {
					case "01":
						that.jakoblife_fat_scale2(BPMAC, "", "", decimalArray[0], BPSN)
						break
					case "02":
						that.jakoblife_fat_scale2(BPMAC, decimalArray[0], decimalArray[1], decimalArray[
							decimalArray.length - 2], BPSN)
						break
					case "03":
						that.storeOxygenData({
							diastolic: decimalArray[0]
						}, Math.floor(Date.now() / 1000))
						that.list_recipe()
						break
					default:
						break
				}
			},
			/**
			 * BLE数据解析，兼容多设备数据解析
			 */
			registerBLECharacteristicValueChange(deviceId, serviceId, deviceSn) {
				let that = this;
				that.resetDataState("26");
				that.installBleForwardHandler(deviceSn);
			},


			// <--------------------------------------------睡眠数据处理start------------------------------------->
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
				if (d < 20) structScore -= Math.ceil((20 - d) / 5) * 10;
				else if (d > 25) structScore -= Math.ceil((d - 25) / 5) * 10;
				// REM 20-25%
				if (r < 20) structScore -= Math.ceil((20 - r) / 5) * 10;
				else if (r > 25) structScore -= Math.ceil((r - 25) / 5) * 10;
				// 浅睡 <55%
				if (l > 55) structScore -= Math.ceil((l - 55) / 5) * 5;
				structScore = Math.max(0, structScore);
				const efficiencyScore = 80; // TODO：睡眠连续性
				const latencyScore = 80; // TODO：睡眠效率
				/* 3. 加权求和（其余 35% 可先留空或继续扩展） */
				const finalScore = durationScore * 0.30 + structScore * 0.35 + efficiencyScore * 0.20 + latencyScore *
					0.15;
				return Math.round(finalScore);
			},
			//BPW1睡眠数据处理
			async handleCMD0410(hexData, deviceId, serviceId, writeUuid, deviceSn) {
				uni.setStorageSync("jiance", true)
				if (hexData.length < 160) {
					await this.handleShortSleepPacket(hexData, deviceId, serviceId, writeUuid);
				} else {
					await this.handleCMD01(hexData, deviceId, serviceId, deviceSn);
				}
			},
			async handleShortSleepPacket(hexData, deviceId, serviceId, writeUuid) {
				let that = this
				if (that.isBPW1DuplicateSleepPayload('hex:' + hexData)) {
					await that.sendack2(hexData, deviceId, serviceId, writeUuid);
					that.resetDataState("25")
					that.blewatch_id = "0"
					that.blewatch_id2 = "1"
					return
				}
				const bytes = hexStringToBytes(hexData.slice(18, hexData.length));
				const sleepObj = receive5610SleepData(bytes);
				const stats = that.applySleepStats(sleepObj);
				// if (stats) {
				// 	console.log('解析睡眠数据：', stats);
				// }
				await that.sendack2(hexData, deviceId, serviceId, writeUuid);
				that.resetDataState("25")
				that.blewatch_id = "0"
				that.blewatch_id2 = "1"
			},
			/** 同一睡眠原始包/相同睡眠内容本会话只解析/上报一次 */
			isBPW1DuplicateSleepPayload(payloadKey) {
				if (!payloadKey) {
					return false
				}
				if (!this._bpw1SleepPayloadKeySet) {
					this._bpw1SleepPayloadKeySet = new Set()
				}
				if (this._bpw1SleepPayloadKeySet.has(payloadKey)) {
					return true
				}
				this._bpw1SleepPayloadKeySet.add(payloadKey)
				if (this._bpw1SleepPayloadKeySet.size > 40) {
					const first = this._bpw1SleepPayloadKeySet.values().next().value
					this._bpw1SleepPayloadKeySet.delete(first)
				}
				return false
			},
			//解析睡眠数据并上报；重复内容返回 null（已处理过）
			applySleepStats(sleepObj) {
				let that = this
				const stats = that.calcSleepMinutes(sleepObj);
				const contentKey =
					`stats:${sleepObj && sleepObj.date}|${stats.formalMinutes}|${stats.Light}|${stats.Deep}|${stats.Rem}|${stats.napMinutes}`
				if (that.isBPW1DuplicateSleepPayload(contentKey)) {
					return null
				}
				that.sleeepalldata = stats
				uni.setStorageSync("totalLight", stats.totalLight)
				uni.setStorageSync("totalDeep", stats.totalDeep)
				uni.setStorageSync("totalRem", stats.totalRem)
				uni.setStorageSync("sleep", stats.formalReadable)
				uni.setStorageSync("sleep_time", sleepObj.date.slice(5, sleepObj.date.length).replace("-", "/"))
				that.sleep = stats.formalReadable
				that.totalLight = stats.totalLight
				that.totalDeep = stats.totalDeep
				that.totalRem = stats.totalRem
				const totalAll = that.timeStrToMinutes(that.sleep);
				const totalH = (totalAll / 60).toFixed(1)
				const deepMin = (that.timeStrToMinutes(that.totalDeep) / 60).toFixed(1);
				const remMin = (that.timeStrToMinutes(that.totalRem) / 60).toFixed(1);
				const lightMin = (that.timeStrToMinutes(that.totalLight) / 60).toFixed(1)
				that.sleep_point = that.overallSleepScore(totalAll, totalH, deepMin, remMin, lightMin)
				if (totalAll === uni.getStorageSync("totalAll2") &&
					totalH === uni.getStorageSync("totalH2") &&
					deepMin === uni.getStorageSync("deepMin2") &&
					remMin === uni.getStorageSync("remMin2") &&
					lightMin === uni.getStorageSync("lightMin2")) {
					if (uni.getStorageSync("sleep_time") === "00/00" &&
						that.getTimeAllJSON().MD !== that.sleep_time) {
						that.jakoblife_fat_scale3(that.shoubiaomac, stats.formalReadable, that.shoubiaosn, "睡眠", "");
					}
				} else {
					uni.setStorageSync("totalAll2", totalAll)
					uni.setStorageSync("totalH2", totalH)
					uni.setStorageSync("deepMin2", deepMin)
					uni.setStorageSync("remMin2", remMin)
					uni.setStorageSync("lightMin2", lightMin)
					that.jakoblife_fat_scale3(that.shoubiaomac, stats.formalReadable, that.shoubiaosn, "睡眠", "");
				}
				return stats
			},
			//计算BLE传过来的睡眠数据
			calcSleepMinutes(sleepObj) {
				// 正式睡眠：浅睡 + 深睡 + 眼动
				const formalMinutes = sleepObj.totalLight + sleepObj.totalDeep + sleepObj.totalRem;
				const Light = sleepObj.totalLight
				const Deep = sleepObj.totalDeep
				const Rem = sleepObj.totalRem
				// 小睡总时长（把 type=10000 的段累加即可）
				const napMinutes = sleepObj.partList.filter(p => p.type === 10000).reduce((sum, p) => sum + p.time,
					0);
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
			// <----------------------------------------------睡眠数据处理end------------------------------------->

			/**
			 * BPW1手表数据返回的ack解析和处理
			 * @param {Object} hexData
			 * @param {Object} cmd
			 * @param {Object} protocolIdppg
			 */
			handleProtocol0eEmotion(hexData, cmd, protocolIdppg) {
				let that = this
				const qingxukey = hexData.slice(12, 14)
				console.log("qingxukey：" + qingxukey, "hexData：" + hexData)
				// 卡片纯心率遥控：设备可能仍回 06 ACK，但不走情绪/PPG loading
				if (that.bpw1PureHrMeasureActive && (cmd === "06" || (cmd === "03" && qingxukey === "25"))) {
					console.log('BPW1纯心率测量，忽略情绪/PPG ACK流程')
					return
				}
				if (cmd === "06" || (cmd === "03" && qingxukey === "25")) {
					that.setSleepAlertDisabled(true)
					// 收到 ACK：重置超时兜底（与写成功时启动的同一套逻辑）
					that.armBPW1EmotionButtonWatchdog()
				}
				if (protocolIdppg === "0e00" && hexData.length < 40) {
					// ACC/PPG 分包未收齐时勿清，短 0E 容易误伤正在传输的数据
					const accBusy = that.quotientACC > 0 && that.dataBuffer && that.dataBuffer.length < that.quotientACC
					const ppgBusy = that.quotientPPG > 0 && that.dataBuffer && that.dataBuffer.length < that.quotientPPG
					if (!accBusy && !ppgBusy) {
						that.resetDataState("16");
					}
				}
			},
			/** BPW1 是否允许本轮 PPG（立即测量 / 定时情绪 / 血压后自动）；纯心率测量不启 */
			isBPW1PpgSessionAllowed() {
				// 卡片「测量心率」：即使设备回了 ACC/PPG Status，也不进入 PPG 业务
				if (this.bpw1PureHrMeasureActive) {
					return false
				}
				return !!(
					this.bpw1PpgSessionActive ||
					this.immediateEmotionMeasure ||
					this.yalixueyatype ||
					this.sleep_alertid === 1 ||
					uni.getStorageSync('sendwatch') === 1
				)
			},
			/** 进入卡片遥控纯心率：清掉情绪/PPG 会话标记，避免误启 PPG */
			enterBPW1PureHrMeasure() {
				this.bpw1PureHrMeasureActive = true
				this.bpw1PpgSessionActive = false
				this.bpw1PpgUploadDone = true
				this.bpw1PpgStatus02Handled = true
				this.yalixueyatype = false
				this.immediateEmotionMeasure = false
				this.sleep_alertid = 0
				this.bpw1PendingManualPpg = false
				this.bufferPPG = []
				uni.removeStorageSync('sendwatch')
				this.clearBPW1BpHrMergeGuards()
			},
			clearBPW1PureHrMeasure() {
				this.bpw1PureHrMeasureActive = false
			},
			/** BPW1 PPG 是否仍在测量/分包传输（未完成） */
			isBPW1PpgTransferInProgress() {
				const that = this
				if (!that.isBPW1PpgSessionAllowed()) {
					return false
				}
				// 分包未收齐
				if (that.quotientPPG > 0 && that.dataBuffer && that.dataBuffer.length < that.quotientPPG) {
					return true
				}
				if (that.quotientACC > 0 && that.dataBuffer && that.dataBuffer.length < that.quotientACC) {
					return true
				}
				// 已有 PPG 缓冲但尚未 Status02 收尾
				if (that.bufferPPG && that.bufferPPG.length > 0) {
					return true
				}
				// 立即测量已下发、手表仍在采集（尚未进入/完成传输）
				if (that.immediateEmotionMeasure && !that.yalixueyatype) {
					return true
				}
				if (that.sleep_alertid === 1 || uni.getStorageSync("sendwatch") === 1) {
					return true
				}
				return false
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
				const nowSec = Math.floor(Date.now() / 1000)
				if (that.canUpdateHomeBpByNewestTime(nowSec)) {
					that.applyHomeBloodPressure(parsedData.dia.trim(), parsedData.sys.trim(), nowSec)
				}
				that.pulse = parsedData.pul.trim();
				uni.setStorageSync("pulse", parsedData.pul.trim())
				that.updateHeartRateCardLocal(parsedData.pul.trim(), nowSec)
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType === 'none') {
							if (that.QX_HIDE) {
								that.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
							}
						} else {
							if (that.QX_HIDE) {
								that.bgaaa(parsedData.dia.trim(), parsedData.sys.trim())
							}
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
			async processCompleteDataSets(deviceId, deviceSn, serviceId, writeuuid) {
				let that = this
				if (that.quotient2 > 0 && that.dataBuffer.length === that.quotient2) {
					const allSleepData = that.formatData(that.dataBuffer)
					if (that.isBPW1DuplicateSleepPayload('hex:' + allSleepData)) {
						await that.sendack2(allSleepData, deviceId, BPW1serviceId, BPW1write);
						that.resetDataState("12")
						that.blewatch_id = "0"
						that.blewatch_id2 = "1"
						return
					}
					const bytes = hexStringToBytes(allSleepData.slice(18, allSleepData.length));
					const sleepObj = receive5610SleepData(bytes);
					const stats = that.applySleepStats(sleepObj);
					if (stats) {
						console.log('解析睡眠数据：', stats);
					}
					await that.sendack2(allSleepData, deviceId, BPW1serviceId, BPW1write);
					that.resetDataState("12")
					that.blewatch_id = "0"
					that.blewatch_id2 = "1"
				} else if (that.sleeppack > 0 && that.dataBuffer.length === that.sleeppack) {
					// 04/01 睡眠分包收齐后需解析（原先只 ACK 未解析，导致无打印/不上报）
					const allSleepData01 = that.formatData(that.dataBuffer)
					if (that.isBPW1DuplicateSleepPayload('hex:' + allSleepData01)) {
						await that.sendack2(allSleepData01, deviceId, BPW1serviceId, BPW1write);
						that.resetDataState("11")
						that.blewatch_id = "0"
						that.blewatch_id2 = "1"
						return
					}
					const bytes01 = hexStringToBytes(allSleepData01.slice(18, allSleepData01.length));
					const sleepObj01 = receive5610SleepData(bytes01);
					const stats01 = that.applySleepStats(sleepObj01);
					if (stats01) {
						console.log('解析睡眠数据：', stats01);
					}
					await that.sendack2(allSleepData01, deviceId, BPW1serviceId, BPW1write);
					that.resetDataState("11")
					that.blewatch_id = "0"
					that.blewatch_id2 = "1"
				} else if (that.xeuyapack > 0 && that.xeuyapack === that.dataBuffer.length) {
					//处理血压数据
					await that.processSingleDataType(deviceId, deviceSn, serviceId, writeuuid);
				} else if (that.xinlvpack > 0 && that.dataBuffer.length === that.xinlvpack) {
					//处理心率数据
					await that.processSingleDataType(deviceId, deviceSn, serviceId, writeuuid);
				} else if (that.xueyangpack > 0 && that.dataBuffer.length === that.xueyangpack) {
					// 处理血氧数据
					await that.processSingleDataType(deviceId, deviceSn, serviceId, writeuuid);
				} else if (that.quotientACC > 0 && that.dataBuffer.length === that.quotientACC) {
					const allDataACC = that.formatData(that.dataBuffer);
					const ACCdata = allDataACC.slice(18, allDataACC.length)
					// console.log("acc蓝牙数据包：" + allDataACC)
					const result = AccDataParser.debugParseExample(ACCdata);
					if (result.success) {
						// 获取所有X轴数据（ACC 仅本地解析，不上传）
						const xData = result.data.map(item => item.x);
						const yData = result.data.map(item => item.y);
						const zData = result.data.map(item => item.z);
					} else {
						// ACC 不参与上报：解析失败只打日志，勿中断整轮 PPG
						// console.warn('BPW1 ACC解析失败(不影响PPG继续):', result.error)
					}
					that.resetDataState("10");
					await that.sendack(allDataACC, deviceId, serviceId, writeuuid);
				} else if (that.quotientPPG > 0 && that.dataBuffer.length === that.quotientPPG) {
					const allDataPPG = that.formatData(that.dataBuffer);
					// 非允许会话（如纯心率）：只 ACK，不累积/上传 PPG
					if (!that.isBPW1PpgSessionAllowed()) {
						that.resetDataState("9");
						await that.sendack(allDataPPG, deviceId, BPW1serviceId, BPW1write);
						return
					}
					const PPGdata = allDataPPG.slice(18, allDataPPG.length)
					const result = PPGParser.parsePPGData(PPGdata, `0x${that.PPGdataarray}`);
					if (result.success) {
						for (let i = 0; i < result.data.length; i++) {
							let jsonppglist = {
								greenValue: result.data[i].greenValue,
								irValue: result.data[i].irValue,
							}
							that.bufferPPG.push(result.data[i].greenValue)
						}
					} else {
						that.recoverBPW1EmotionMeasureOnParseFail(result.error);
					}
					that.resetDataState("9");
					await that.sendack(allDataPPG, deviceId, BPW1serviceId, BPW1write);
				}
			},

			// PPG原始波形数据存储 
			ppgdata(rawData, deviceSn, deviceId) {
				if (!this.isBPW1PpgSessionAllowed()) {
					console.log('BPW1非情绪PPG会话，跳过上传')
					return
				}
				if (this._bpw1PpgPosting) {
					return
				}
				if (!rawData || (typeof rawData === 'string' && rawData.length === 0)) {
					console.warn('BPW1 PPG 上传跳过：rawData 为空')
					this.immediateEmotionMeasure = false
					this.yalixueyatype = false
					this.bpw1PpgSessionActive = false
					this.sleep_alertid = 0
					this.setSleepAlertDisabled(false)
					uni.hideLoading()
					return
				}
				this._bpw1PpgPosting = true
				let data = {
					patientId: uni.getStorageSync("userid"), //患者id
					deviceSn: deviceSn, //设备sn
					deviceModel: "BPW1", //设备型号
					samplingRate: 100, //采样率(Hz) 5.8.5版本改成100Hz
					startTime: this.getTimeAllJSON().YMDHMS, // payload.duration, 采集开始时间(微秒精度)
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
					processingStatus: "RAW",
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				console.log("data", data)
				this.$post(this.$url_APP_IP + "/prod-api/device/ppgdata", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((ppgdatares) => {
					console.log("ppgdatares", ppgdatares)
					if (ppgdatares.code === 200) {
						const showCloudComputingLoading = this.QX_HIDE && this.immediateEmotionMeasure
						this.immediateEmotionMeasure = false
						if (showCloudComputingLoading) {
							uni.showLoading({
								title: this.$t("云端数据计算中"),
								mask: true,
							})
							setTimeout(() => {
								uni.hideLoading()
								this.yalixueyatype = false
								this.bpw1PpgSessionActive = false
								this.sleep_alertid = 0
								this.setSleepAlertDisabled(false)
							}, 60 * 1000)
						}
						// keepCloudUi：上传时已清 immediateEmotionMeasure，轮询结果仍需能弹 LOW_QUALITY 等
						this.deviceppgdatalist(deviceSn, deviceId, 0, showCloudComputingLoading)
					} else {
						this.immediateEmotionMeasure = false
						this.yalixueyatype = false
						this.bpw1PpgSessionActive = false
						this.sleep_alertid = 0
						uni.hideLoading()
						this.setSleepAlertDisabled(false)
					}
				}).catch((err) => {
					console.error('BPW1 PPG上传失败', err)
					this.immediateEmotionMeasure = false
					this.yalixueyatype = false
					this.bpw1PpgSessionActive = false
					this.sleep_alertid = 0
					uni.hideLoading()
					this.setSleepAlertDisabled(false)
				}).finally(() => {
					this._bpw1PpgPosting = false
				})
			},
			//查询PPG原始波形数据存储列表
			// keepCloudUi：BPW1 手动立即测量上传成功后已清 immediateEmotionMeasure，需透传以保留结果弹窗
			deviceppgdatalist(deviceSn, deviceId, pollCount = 0, keepCloudUi = false) {
				let that = this
				let dataparin = {
					patientId: uni.getStorageSync("userid"), //患者id
					startTime: that.getTimeAllJSON().YMD + " 00:00:00",
					endTime: that.getTimeAllJSON().YMD + " 23:59:59",
				}
				const MAX_POLLS = 90 // 最长轮询约 90s，避免息屏后永久「测量中/云端计算中」
				that.$get(that.$url_APP_IP + "/prod-api/device/ppgdata/list", dataparin, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((deviceppgdatalist) => {
					console.log("deviceppgdatalist", deviceppgdatalist)
					const showCloudComputingLoading = that.QX_HIDE && (that.immediateEmotionMeasure ||
						that.bpw6PpgCloudLoadingActive || keepCloudUi)
					if (deviceppgdatalist.code === 200 && deviceppgdatalist.rows.length > 0) {
						switch (deviceppgdatalist.rows[deviceppgdatalist.total - 1].processingStatus) {
							case "ANALYZED":
								// 收尾前记下是否手动立即测量，供上传成功后提示「成功」
								that._bpw6ShowManualUploadSuccessToast = that.shouldToastBpw6ManualFail()
								that.recoverBpw6PpgSessionUi('analyzed')
								that.ppgdatalist(deviceSn, deviceId)
								break;
							case "LOW_QUALITY": {
								// 立即测量：无论黑屏都弹窗；仅定时(sendwatch)/血压后静默不弹
								const sendwatchOn = uni.getStorageSync('sendwatch') === 1 ||
									uni.getStorageSync('sendwatch') === '1'
								const inManualUi = !!(that.immediateEmotionMeasure ||
									that.bpw6ManualEmotionUiPhase === 'measuring' ||
									that.bpw6ManualEmotionUiPhase === 'cloud')
								const wasSilentPpg = sendwatchOn || (that.bpw6PpgSilentAfterBp && !inManualUi)
								that.recoverBpw6PpgSessionUi('low_quality', {
									failToast: false
								})
								if (!wasSilentPpg && (inManualUi || showCloudComputingLoading)) {
									uni.showModal({
										content: that.$t("波形质量不足峰值无法可靠分析"),
										confirmText: that.$t('确定'),
										showCancel: false,
										success(modal) {
											if (modal.confirm) {}
										}
									})
								}
								console.log("PPG 波形质量不足、峰值/RR 间期不足，无法可靠分析")
							}
							break;
							case "INVALID_DATA": {
								const sendwatchOn = uni.getStorageSync('sendwatch') === 1 ||
									uni.getStorageSync('sendwatch') === '1'
								const inManualUi = !!(that.immediateEmotionMeasure ||
									that.bpw6ManualEmotionUiPhase === 'measuring' ||
									that.bpw6ManualEmotionUiPhase === 'cloud')
								const wasSilentPpg = sendwatchOn || (that.bpw6PpgSilentAfterBp && !inManualUi)
								that.recoverBpw6PpgSessionUi('invalid_data', {
									failToast: false
								})
								if (!wasSilentPpg && (inManualUi || showCloudComputingLoading)) {
									uni.showModal({
										content: that.$t("原始为空或解析失败"),
										confirmText: that.$t('确定'),
										showCancel: false,
										success(modal) {
											if (modal.confirm) {}
										}
									})
								}
								console.log("PPG 波形质量不足、峰值/RR 间期不足，无法可靠分析")
							}
							break;
							case "ERROR": {
								const sendwatchOn = uni.getStorageSync('sendwatch') === 1 ||
									uni.getStorageSync('sendwatch') === '1'
								const inManualUi = !!(that.immediateEmotionMeasure ||
									that.bpw6ManualEmotionUiPhase === 'measuring' ||
									that.bpw6ManualEmotionUiPhase === 'cloud')
								const wasSilentPpg = sendwatchOn || (that.bpw6PpgSilentAfterBp && !inManualUi)
								that.recoverBpw6PpgSessionUi('error', {
									failToast: false
								})
								if (!wasSilentPpg && (inManualUi || showCloudComputingLoading)) {
									uni.showModal({
										content: that.$t("测试质量不够好"),
										confirmText: that.$t('确定'),
										showCancel: false,
										success(modal) {
											if (modal.confirm) {}
										}
									})
									console.log("数据处理有误")
								}
							}
							break;
							default:
								if (pollCount >= MAX_POLLS) {
									console.warn('【BPW6】PPG云端分析轮询超时')
									const bpw6ManualFail = that.shouldToastBpw6ManualFail()
									that.recoverBpw6PpgSessionUi('poll timeout', {
										failToast: bpw6ManualFail
									})
									if (!bpw6ManualFail && showCloudComputingLoading) {
										uni.showToast({
											title: that.$t("测量数据有误请重新测量"),
											icon: 'none',
											duration: 2000
										})
									}
									return
								}
								setTimeout(() => {
									that.deviceppgdatalist(deviceSn, deviceId, pollCount + 1, keepCloudUi)
								}, 1000)
								console.log("PPG 波形正在分析中，请稍后...")
								break
						}
					} else {
						if (pollCount >= MAX_POLLS) {
							console.warn('【BPW6】PPG列表轮询超时')
							that.recoverBpw6PpgSessionUi('list poll timeout', {
								failToast: that.shouldToastBpw6ManualFail()
							})
							return
						}
						setTimeout(() => {
							that.deviceppgdatalist(deviceSn, deviceId, pollCount + 1, keepCloudUi)
						}, 1000)
					}
				}).catch((err) => {
					console.error('【BPW6】PPG列表查询失败', err)
					if (pollCount >= MAX_POLLS) {
						that.recoverBpw6PpgSessionUi('list poll exception', {
							failToast: that.shouldToastBpw6ManualFail()
						})
						return
					}
					setTimeout(() => {
						that.deviceppgdatalist(deviceSn, deviceId, pollCount + 1, keepCloudUi)
					}, 1000)
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
						that.hideBPW6PpgCloudLoading();
						that.immediateEmotionMeasure = false
						that.yalixueyatype = false
						that.bpw1PpgSessionActive = false
						that.sleep_alertid = 0
						that.setSleepAlertDisabled(false)
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
						this.share_data_fat_scale(deviceSn, deviceId, this.resolveRealtimeUploadTimeSec(), aaa)
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
						that.hideBPW6PpgCloudLoading();
					}
				})
			},
			//情绪数据上报
			share_data_fat_scale(deviceSn, deviceId, fattimes, aaa) {
				const timeFields = this.buildUploadTimeFields(fattimes)
				let data = {
					deviceSn: !deviceSn ? uni.getStorageSync("deviceSn") : deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: timeFields.time,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				console.log("上报手表情绪数据参数", data)
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(sharedatafatscaleres => {
					console.log("上报手表情绪数据", sharedatafatscaleres)
					if (sharedatafatscaleres.code === 200 && this._bpw6ShowManualUploadSuccessToast && this
						.QX_HIDE) {
						this._bpw6ShowManualUploadSuccessToast = false
					} else {
						this._bpw6ShowManualUploadSuccessToast = false
					}
				}).catch(sharedatafatscaleerrro => {
					console.log("sharedatafatscaleerrro", sharedatafatscaleerrro)
					this._bpw6ShowManualUploadSuccessToast = false
				})
			},

			ppgresultslist(recordId) {
				recordId = Number(recordId)
				let ppgdata = {
					patientId: uni.getStorageSync("userid"),
					startTime: this.getTimeAllJSON().YMD + " 00:00:00",
					endTime: this.getTimeAllJSON().YMD + " 23:59:59",
				}
				// console.log("情绪页面图表传参数", ppgdata)
				this.$get(this.$url_APP_IP + "/prod-api/device/ppgresults/get_result_list_by_patient_id", ppgdata, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((ppgresultslist) => {
					// console.log("情绪页面图表返回的值", ppgresultslist)
					if (ppgresultslist.code === 200 && ppgresultslist.data.length > 0) {
						this.chartDataPPG.categories = []
						this.chartDataPPG.series = [{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							}
						]
						for (let p = ppgresultslist.data.length - 1; p >= 0; p--) {
							this.chartDataPPG.categories.push(ppgresultslist.data.length - p);
							if (recordId === 1) {
								this.chartDataPPG.series[1].data.push(Number(ppgresultslist.data[p]
									.depressionRiskScore));
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
								this.chartDataPPG.series[2].data.push(Number(ppgresultslist.data[p]
									.stressIndex));
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
								this.chartDataPPG.series[3].data.push(Number(ppgresultslist.data[p]
									.fatigueIndex));
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
								this.chartDataPPG.series[4].data.push(Number(ppgresultslist.data[p]
									.recoveryIndex));
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
							} else {
								this.chartDataPPG.series[0].data.push(Number(ppgresultslist.data[p].moodIndex));
								this.optsPPG.extra.markLine.data[0].value = 8
								this.optsPPG.extra.markLine.data[0].lineColor = "#41EB08"
								this.optsPPG.extra.markLine.data[0].showLabel = true
								this.optsPPG.extra.markLine.data[0].labelText = this.$t("积极愉悦2")
								this.optsPPG.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG.extra.markLine.data[0].labelOffsetX = Language === 'zh-Hans' ||
									Language === 'zh-Hant' ? 60 : 145
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
								this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 115
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
								this.optsPPG.extra.markLine.data[2].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 83
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
								this.optsPPG.extra.markLine.data[3].labelOffsetX = Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 122
								this.optsPPG.extra.markLine.data[3].labelFontColor = "#D8D8D6"
								this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG.extra.markLine.data[3].borderWidth = 0
								this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
								this.optsPPG.extra.markLine.data[3].borderRadius = 4
								this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
							}
						}
						// 只保留当前指标 series，避免空系列干扰坐标
						const activeIdx = [0, 1, 2, 3, 4].includes(recordId) ? recordId : 0
						this.chartDataPPG.series = [this.chartDataPPG.series[activeIdx]]
					} else {
						// 无数据：重置为空图（与有数据后裁成单 series 结构一致，避免越界）
						this.chartDataPPG.categories = []
						this.chartDataPPG.series = [{
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7',
							textOffset: -18,
							textColor: "#000000"
						}]
						if (recordId === 0) {
							this.optsPPG.extra.markLine.data[0].value = 8
							this.optsPPG.extra.markLine.data[0].lineColor = "#41EB08"
							this.optsPPG.extra.markLine.data[0].showLabel = true
							this.optsPPG.extra.markLine.data[0].labelText = this.$t("积极愉悦2")
							this.optsPPG.extra.markLine.data[0].labelAlign = "left"
							this.optsPPG.extra.markLine.data[0].labelOffsetX = Language ==
								'zh-Hans' || Language ==
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
							this.optsPPG.extra.markLine.data[1].labelOffsetX = Language ==
								'zh-Hans' || Language ==
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
							this.optsPPG.extra.markLine.data[2].labelOffsetX = Language ==
								'zh-Hans' || Language ==
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
							this.optsPPG.extra.markLine.data[3].labelOffsetX = Language ==
								'zh-Hans' || Language ==
								'zh-Hant' ? 60 : 122
							this.optsPPG.extra.markLine.data[3].labelFontColor = "#D8D8D6"
							this.optsPPG.extra.markLine.data[3].labelOffsetY = -15
							this.optsPPG.extra.markLine.data[3].labelBgOpacity = -0.8
							this.optsPPG.extra.markLine.data[3].borderWidth = 0
							this.optsPPG.extra.markLine.data[3].borderColor = "transparent"
							this.optsPPG.extra.markLine.data[3].borderRadius = 4
							this.optsPPG.extra.markLine.data[3].padding = [4, 8, 4, 8]
						} else if (recordId === 1) {
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
				recordId = Number(recordId)
				let endTime = this.getTimeAllJSON().YMD + " 23:59:59"
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
					if (ppgresultslist.code === 200 && ppgresultslist.data.length > 0) {
						// 1. 按日期分组计算每日平均分
						const dailyData = {};
						ppgresultslist.data.forEach(item => {
							const date = item.analysisTime.split(' ')[
								0]; // 获取日期部分，如 "2026-01-08"
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
							dailyData[date].sumDepressionRisk += item
								.depressionRiskScore || 0;
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
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							},
							{
								legendShape: "none",
								name: "",
								data: [],
								color: '#3298F7',
								textOffset: -18,
								textColor: "#000000"
							}
						]
						// 5. 填充图表数据
						let dayCount = 1;
						dailyAverages.forEach(item => {
							// 可以选择显示日期或简单的序号
							const datesfd = item.date.slice(8);
							this.chartDataPPG2.categories.push(
								datesfd); // 或使用 item.date.slice(5) 显示月日
							if (recordId === 0) {
								// 心情指数数据
								const avgMoodScore = Number(item.averageMoodIndex.toFixed(1));
								this.chartDataPPG2.series[0].data.push(avgMoodScore);
								this.optsPPG2.extra.markLine.data[0].value = 8
								this.optsPPG2.extra.markLine.data[0].lineColor = "#41EB08"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t(
									"积极愉悦2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 145
								this.optsPPG2.extra.markLine.data[0].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 6
								this.optsPPG2.extra.markLine.data[1].lineColor = "#3298F7"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t(
									"平静稳定2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 115
								this.optsPPG2.extra.markLine.data[1].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[1].borderRadius = 4
								this.optsPPG2.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[2].value = 4
								this.optsPPG2.extra.markLine.data[2].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[2].showLabel = true
								this.optsPPG2.extra.markLine.data[2].labelText = this.$t(
									"轻微压力2")
								this.optsPPG2.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[2].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 83
								this.optsPPG2.extra.markLine.data[2].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[2].borderWidth = 0
								this.optsPPG2.extra.markLine.data[2].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[2].borderRadius = 4
								this.optsPPG2.extra.markLine.data[2].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[3].value = 0
								this.optsPPG2.extra.markLine.data[3].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[3].showLabel = true
								this.optsPPG2.extra.markLine.data[3].labelText = this.$t(
									"明显压力2")
								this.optsPPG2.extra.markLine.data[3].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[3].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 122
								this.optsPPG2.extra.markLine.data[3].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[3].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[3].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[3].borderWidth = 0
								this.optsPPG2.extra.markLine.data[3].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 1) {
								// 抑郁风险数据
								const avgRiskScore = Number(item.averageDepressionRisk.toFixed(1));
								this.chartDataPPG2.series[1].data.push(avgRiskScore);
								this.optsPPG2.extra.markLine.data[0].value = 8
								this.optsPPG2.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t(
									"较高风险2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 70
								this.optsPPG2.extra.markLine.data[0].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 5
								this.optsPPG2.extra.markLine.data[1].lineColor = "#3298F7"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t(
									"中等风险2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 90
								this.optsPPG2.extra.markLine.data[1].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[1].borderRadius = 4
								this.optsPPG2.extra.markLine.data[1].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[2].value = 0
								this.optsPPG2.extra.markLine.data[2].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].showLabel = true
								this.optsPPG2.extra.markLine.data[2].labelText = this.$t(
									"较低风险2")
								this.optsPPG2.extra.markLine.data[2].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[2].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 70
								this.optsPPG2.extra.markLine.data[2].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[2].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[2].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[2].borderWidth = 0
								this.optsPPG2.extra.markLine.data[2].borderColor =
									"transparent"
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
								this.optsPPG2.extra.markLine.data[3].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 2) {
								// 压力指数
								const avgRiskScore = Number(item.averagestressIndex.toFixed(1));
								this.chartDataPPG2.series[2].data.push(avgRiskScore);
								this.optsPPG2.extra.markLine.data[0].value = 5
								this.optsPPG2.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t(
									"压力大2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 85
								this.optsPPG2.extra.markLine.data[0].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 0
								this.optsPPG2.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t(
									"压力小2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 85
								this.optsPPG2.extra.markLine.data[1].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor =
									"transparent"
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
								this.optsPPG2.extra.markLine.data[2].borderColor =
									"transparent"
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
								this.optsPPG2.extra.markLine.data[3].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]
							} else if (recordId === 3) {
								// 疲劳指数
								const avgRiskScore = Number(item.averagesumfatigueIndex.toFixed(
									1));
								this.chartDataPPG2.series[3].data.push(avgRiskScore);
								this.optsPPG2.extra.markLine.data[0].value = 5
								this.optsPPG2.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t(
									"疲劳度高2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 125
								this.optsPPG2.extra.markLine.data[0].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 0
								this.optsPPG2.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t(
									"疲劳度低2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 120
								this.optsPPG2.extra.markLine.data[1].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor =
									"transparent"
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
								this.optsPPG2.extra.markLine.data[2].borderColor =
									"transparent"
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
								this.optsPPG2.extra.markLine.data[3].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]

							} else if (recordId === 4) {
								// 恢复指数
								const avgRiskScore = Number(item.averagesumrecoveryIndex.toFixed(
									1));
								this.chartDataPPG2.series[4].data.push(avgRiskScore);
								this.optsPPG2.extra.markLine.data[0].value = 5
								this.optsPPG2.extra.markLine.data[0].lineColor = "#FF6B6B"
								this.optsPPG2.extra.markLine.data[0].showLabel = true
								this.optsPPG2.extra.markLine.data[0].labelText = this.$t(
									"恢复快2")
								this.optsPPG2.extra.markLine.data[0].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[0].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 100
								this.optsPPG2.extra.markLine.data[0].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[0].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[0].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[0].borderWidth = 0
								this.optsPPG2.extra.markLine.data[0].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[0].borderRadius = 4
								this.optsPPG2.extra.markLine.data[0].padding = [4, 8, 4, 8]
								this.optsPPG2.extra.markLine.data[1].value = 0
								this.optsPPG2.extra.markLine.data[1].lineColor = "#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].showLabel = true
								this.optsPPG2.extra.markLine.data[1].labelText = this.$t(
									"恢复慢2")
								this.optsPPG2.extra.markLine.data[1].labelAlign = "left"
								this.optsPPG2.extra.markLine.data[1].labelOffsetX =
									Language ==
									'zh-Hans' || Language == 'zh-Hant' ? 60 : 100
								this.optsPPG2.extra.markLine.data[1].labelFontColor =
									"#D8D8D6"
								this.optsPPG2.extra.markLine.data[1].labelOffsetY = -15
								this.optsPPG2.extra.markLine.data[1].labelBgOpacity = -0.8
								this.optsPPG2.extra.markLine.data[1].borderWidth = 0
								this.optsPPG2.extra.markLine.data[1].borderColor =
									"transparent"
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
								this.optsPPG2.extra.markLine.data[2].borderColor =
									"transparent"
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
								this.optsPPG2.extra.markLine.data[3].borderColor =
									"transparent"
								this.optsPPG2.extra.markLine.data[3].borderRadius = 4
								this.optsPPG2.extra.markLine.data[3].padding = [4, 8, 4, 8]
							}
							dayCount++;
						});
						// 只保留当前指标 series，避免空系列干扰坐标
						const activeIdx2 = [0, 1, 2, 3, 4].includes(recordId) ? recordId : 0
						this.chartDataPPG2.series = [this.chartDataPPG2.series[activeIdx2]]
						// 6. 处理最新一条记录的详细信息
						const latestRecord = ppgresultslist.data[0];
						// 可选：输出每日平均分用于调试
						// console.log("每日平均数据:", dailyAverages);
						let calculateDailyStatsvalue = this.calculateDailyStats(dailyAverages)
						this.MoodDays = calculateDailyStatsvalue.lowMoodDays
						this.StressFatigueDays = calculateDailyStatsvalue.highStressFatigueDays
						const isMoodLowFrequently = dailyAverages.filter(d => d.averageMoodIndex <
							6).length >= 10;
						// console.log(isMoodLowFrequently); // true 或 false
						// 先找出 mood < 6 的所有日期
						const lowMoodDays = dailyAverages.filter(d => d.averageMoodIndex < 6);
						// 在这些日期里，检查是否至少有一天同时满足 fatigue > 0.5 或 stress > 0.5
						const hasHighFatigueOrStressInLowMoodDays = lowMoodDays.some(
							d => d.averagesumfatigueIndex > 0.5 || d.averagestressIndex > 0.5
						);
						// console.log(hasHighFatigueOrStressInLowMoodDays); // true 或 false
						// 3. 最终同时满足两个条件
						this.finalResult = isMoodLowFrequently &&
							hasHighFatigueOrStressInLowMoodDays;
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
					} else {
						// 两周无数据：重置为空图，避免裁剪后残留旧点
						this.chartDataPPG2.categories = []
						this.chartDataPPG2.series = [{
							legendShape: "none",
							name: "",
							data: [],
							color: '#3298F7',
							textOffset: -18,
							textColor: "#000000"
						}]
					}
				})
			},

			ppgresultslist3(recordId) {
				recordId = Number(recordId)
				let endTime = this.getTimeAllJSON().YMD + " 23:59:59"
				let initialDate = new Date(endTime)
				let minusOneWeek = new Date(initialDate)
				minusOneWeek.setDate(minusOneWeek.getDate() - 13)
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
					if (ppgresultslist.code === 200 && ppgresultslist.data.length > 0) {
						for (let p = ppgresultslist.data.length - 1; p >= 0; p--) {
							this.signal_quality_score = ppgresultslist.data[p].analysisConfidence
							this.ppgnewpoint = ppgresultslist.data[p].moodIndex + "/10";
							this.depression_risk_score = ppgresultslist.data[p]
								.depressionRiskScore + "/10";
							//综合指数
							this.stress_Index = ppgresultslist.data[p].stressIndex; //压力指数
							this.fatigue_index = ppgresultslist.data[p].fatigueIndex; //疲劳指数
							this.recovery_index = ppgresultslist.data[p].recoveryIndex + "/10"; //恢复指数
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
					startTime: this.getTimeAllJSON().YMD + " 00:00:00",
					endTime: this.getTimeAllJSON().YMD + " 23:59:59",
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
				const lowMoodDays = dailyAverages.filter(item => item.averageMoodIndex < 5).length;
				// 2. 计算同时满足averagestressIndex≥5和averagesumfatigueIndex≥5的天数
				const highStressFatigueDays = dailyAverages.filter(item => item.averagestressIndex >= 5 || item
					.averagesumfatigueIndex >= 5).length;
				return {
					lowMoodDays,
					highStressFatigueDays
				};
			},
			//情绪页面数据类型选择按钮
			types_change(e) {
				this.types_index = Number(e.detail.value)
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
			async processSingleDataType(deviceId, deviceSn, serviceId, writeuuid) {
				let that = this;
				const allData = that.formatData(that.dataBuffer);
				// 历史同步中同一完整包只处理一次（设备重传 / 监听残留）
				if (that.isBPW1HistorySyncing()) {
					if (!that._bpw1ProcessedHistoryPacketFps) {
						that._bpw1ProcessedHistoryPacketFps = new Set()
					}
					if (that._bpw1ProcessedHistoryPacketFps.has(allData)) {
						await that.sendack2(allData, deviceId, serviceId, writeuuid);
						that.resetDataState("8");
						return
					}
					that._bpw1ProcessedHistoryPacketFps.add(allData)
				}
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
					case "00": { // 心率
						// 心率/PPG 路径保持原逻辑；仅在历史同步中把心率记入会话表，供血压历史配对
						const isHrHistorySync = that.isBPW1HistorySyncing()
						that.hrResult = []
						const hrResultdata = Healthparser.parseProtocolData(protocolData);
						const hrRecords = (hrResultdata.data && hrResultdata.data.records) ? hrResultdata.data
							.records : []
						const hrHistoryEnd = isHrHistorySync ? hrRecords.length : Math.max(hrRecords.length - 1, 0)
						for (let i = 0; i < hrHistoryEnd; i++) {
							that.hrResult.push(hrRecords[i])
						}
						const hrResultSnapshot = that.hrResult.slice()
						if (isHrHistorySync) {
							that.rememberBPW1SyncSessionHr(hrResultSnapshot)
						}
						// console.log("心率历史数据", hrResultSnapshot)
						// that.addlog("心率历史数据", hrResultSnapshot)
						const heartRateValue = that.parseHeartRateData(protocolData.Covmamlueand);
						const latestHrRec = hrRecords.length ? hrRecords[hrRecords.length - 1] : null
						const hrWallForTs = latestHrRec && latestHrRec.date && latestHrRec.time ?
							`${latestHrRec.date} ${latestHrRec.time}` :
							`${datealltime} ${heartRateValue.time}`
						let heartRateValuetime = that.datatime(hrWallForTs)
						const hrDisplayVal = (latestHrRec && latestHrRec.heartRate != null) ?
							latestHrRec.heartRate : heartRateValue.diastolic
						// console.log("心率数据：", heartRateValue, hrWallForTs, heartRateValuetime)
						// 卡片纯心率：收到本轮心率后结束标记，避免长期挡住后续情绪 PPG
						const wasPureHrMeasure = !!that.bpw1PureHrMeasureActive
						if (that.bpw1PureHrMeasureActive && !isHrHistorySync) {
							that.clearBPW1PureHrMeasure()
						}
						// 自动心率可单独报；手动心率默认先按血压伴随处理，无邻近血压时再单独报
						const isAutoHr = !!(latestHrRec ?
							latestHrRec.isAuto :
							(Number(heartRateValue && heartRateValue.reserved) === 1))
						// 手动测量或单条近实时：允许刷首页；多条自动历史包不盖卡片（夜间跨日闪跳）
						const forceRealtimeHr = !isHrHistorySync && (
							hrRecords.length <= 1 ||
							(latestHrRec && latestHrRec.isAuto === false)
						)
						if (that.shouldApplyBPW1HrToHomeCard(heartRateValuetime, {
								forceRealtime: forceRealtimeHr
							})) {
							const homeCardTs = that.resolveBPW1HrHomeCardTs(heartRateValuetime)
							that.pulse = hrDisplayVal
							that.xeuyabiaoshi = "1"
							uni.setStorageSync("pulse", hrDisplayVal)
							that.markBPW1LocalHrCardProtect()
							that.updateHeartRateCardLocal(hrDisplayVal, homeCardTs)
							setTimeout(() => {
								that.cardeditData(that.list, "bloodData")
							}, 500)
						}
						// 血压伴随手动心率：无论先后到、即使误标 PPG，也要入缓存等血压同报
						const isPpgSessionHrEarly = !!(that.yalixueyatype || that.bpw1PpgSessionActive ||
							that.immediateEmotionMeasure)
						const isBpAccompanyingHr = !wasPureHrMeasure && !isAutoHr
						const hrNearBpMerge = that.isBPW1RealtimeBpNearWall(hrWallForTs) ||
							that.hasBPW1PendingBpHrNear(hrWallForTs)
						if (!isHrHistorySync && !that.isBPW1HistorySyncing() && (!isPpgSessionHrEarly ||
								hrNearBpMerge || isBpAccompanyingHr)) {
							that.rememberBPW1RealtimeHr(hrWallForTs, hrDisplayVal)
						}
						// 血压已挂起：心率直接并入，只上报一次（优先于 PPG/单独心率）
						if (!isHrHistorySync && !that.isBPW1HistorySyncing() &&
							that.tryMergeHrIntoPendingBpUpload(hrWallForTs, hrDisplayVal)) {
							await that.sendack2(allData, deviceId, serviceId, writeuuid);
							that.resetDataState("心率");
							break;
						}
						// 历史血压已暂存等心率：实时/尾包伴随心率并入同报（勿再单独报）
						if (!isHrHistorySync && !that.isBPW1HistorySyncing() &&
							that.mergeRealtimeHrIntoBPW1PendingHistoryBp(
								hrWallForTs, hrDisplayVal, deviceId, deviceSn, latestHrRec)) {
							await that.sendack2(allData, deviceId, serviceId, writeuuid);
							that.resetDataState("心率");
							break;
						}
						uni.getNetworkType({
							success: async function(res) {
								// 历史同步：无网也写入 pending/会话表，供后续血压历史配对（不影响实时/PPG）
								if (isHrHistorySync || that.isBPW1HistorySyncing()) {
									that.appendBPW1PendingHrHistory(hrResultSnapshot, deviceId, deviceSn)
									return
								}
								if (res.networkType === 'none') {
									return
								}
								const hrDelayWallKey = that.normalizeDateTimeKey(hrWallForTs)
								const hrDelayVal = hrDisplayVal
								const hrDelayTime = heartRateValuetime
								// 血压后 PPG / 情绪测量产生的心率：立即上报，不走血压合并延迟
								const isPpgSessionHr = !!(that.yalixueyatype || that
									.bpw1PpgSessionActive ||
									that.immediateEmotionMeasure)
								// 历史暂存血压邻近：并入同报，禁止单独报
								if (that.mergeRealtimeHrIntoBPW1PendingHistoryBp(
										hrDelayWallKey, hrDelayVal, deviceId, deviceSn, latestHrRec)) {
									return
								}
								// 只要邻近挂起/刚测血压，一律禁止单独报（含被误标成 PPG 的血压伴随心率）
								if (that.isBPW1RealtimeBpNearWall(hrDelayWallKey) ||
									that.hasBPW1PendingBpHrNear(hrDelayWallKey) ||
									that.hasBPW1PendingHistoryBpNear(hrDelayWallKey, 90) ||
									that.hasBPW1BpUploadedNearTs(String(hrDelayTime), 3)) {
									that.rememberBPW1RealtimeHr(hrWallForTs, hrDisplayVal)
									if (that.tryMergeHrIntoPendingBpUpload(hrWallForTs, hrDisplayVal)) {
										return
									}
									if (that.mergeRealtimeHrIntoBPW1PendingHistoryBp(
											hrDelayWallKey, hrDelayVal, deviceId, deviceSn, latestHrRec)) {
										return
									}
									console.log('BPW1邻近血压测量，心率不单独上报:', hrDelayWallKey)
									return
								}
								const uploadHrOnly = async () => {
									if (that.isBPW1HistorySyncing()) {
										return
									}
									if (that.mergeRealtimeHrIntoBPW1PendingHistoryBp(
											hrDelayWallKey, hrDelayVal, deviceId, deviceSn,
											latestHrRec
										)) {
										return
									}
									if (that.isBPW1RealtimeHrConsumed(hrDelayWallKey) ||
										that.isBPW1RealtimeBpNearWall(hrDelayWallKey) ||
										that.hasBPW1PendingBpHrNear(hrDelayWallKey) ||
										that.hasBPW1PendingHistoryBpNear(hrDelayWallKey, 90) ||
										that.hasBPW1BpUploadedNearTs(String(hrDelayTime), 3)) {
										console.log('BPW1心率已随血压合并，跳过单独上报:', hrDelayWallKey)
										return
									}
									await that.queryBloodPressureDataAsync(that.deviceSnuserID)
									const normalizedHrKey = that.normalizeDateTimeKey(
										hrDelayWallKey)
									const serverHr = that.getExistingHeartRateMap().get(
										normalizedHrKey)
									const hrTimeKey = String(hrDelayTime)
									if (serverHr !== undefined && String(serverHr) === String(
											hrDelayVal)) {
										// that.addlog('BPW1心率服务端已存在，跳过实时上报:', normalizedHrKey)
										that.markSessionHrUploaded(hrTimeKey, hrDelayVal)
										return
									}
									if (that.hasSessionHrUploadedNear(hrTimeKey, hrDelayVal, 3)) {
										// that.addlog('BPW1心率本会话已上报，跳过实时上报:', hrTimeKey, hrDelayVal)
										return
									}
									// 服务端该时刻已有血压：心率应随血压存在，勿再单独报
									if (that.hasServerBloodPressureAt(normalizedHrKey)) {
										console.log('BPW1该时刻已有血压，跳过心率单独上报:', normalizedHrKey)
										// that.addlog('BPW1该时刻已有血压，跳过心率单独上报:', normalizedHrKey)
										return
									}
									that.jakoblife_fat_scale22(
										deviceId,
										"",
										"",
										hrDelayVal,
										deviceSn,
										hrDelayTime
									)
									if (!isPpgSessionHr) {
										that.markBPW1RealtimeHrConsumed(hrDelayWallKey, 0)
										if (that.bpw1RecentRealtimeHr && that.bpw1RecentRealtimeHr
											.length) {
											that.bpw1RecentRealtimeHr = that.bpw1RecentRealtimeHr
												.filter(
													item => item.key !== hrDelayWallKey)
										}
									}
								}
								// 血压伴随心率（手动）：优先等血压包合并；若无邻近/挂起血压，则视为单独测心率并上报
								if (isBpAccompanyingHr) {
									that.rememberBPW1RealtimeHr(hrWallForTs, hrDisplayVal)
									if (that.mergeRealtimeHrIntoBPW1PendingHistoryBp(
											hrDelayWallKey, hrDelayVal, deviceId, deviceSn, latestHrRec)) {
										return
									}
									if (that.isBPW1RealtimeBpNearWall(hrDelayWallKey) ||
										that.hasBPW1PendingBpHrNear(hrDelayWallKey) ||
										that.hasBPW1PendingHistoryBpNear(hrDelayWallKey, 90) ||
										that.hasBPW1BpUploadedNearTs(String(hrDelayTime), 3)) {
										console.log('BPW1血压伴随心率，仅缓存待与血压同报:', hrDelayWallKey)
										return
									}
									// 手表端单独测心率（未走 App 纯心率标记）也需上报；延迟给血压包合并窗口
									setTimeout(() => {
										uni.getNetworkType({
											success: async function(netRes) {
												if (netRes.networkType === 'none') {
													return
												}
												await uploadHrOnly()
											},
											fail: function(err) {
												console.error('获取网络类型失败：', err)
											}
										})
									}, 3000)
									return
								}
								if (isPpgSessionHr) {
									await uploadHrOnly()
									return
								}
								// 纯心率：短延迟单独报；自动心率：长延迟兜底，若已被血压合并则跳过
								if (wasPureHrMeasure) {
									setTimeout(() => {
										uni.getNetworkType({
											success: async function(netRes) {
												if (netRes.networkType === 'none') {
													return
												}
												await uploadHrOnly()
											},
											fail: function(err) {
												console.error('获取网络类型失败：', err)
											}
										})
									}, 1500)
									return
								}
								if (isAutoHr) {
									console.log('BPW1自动心率，延迟兜底单独报（若血压已合并则跳过）:', hrDelayWallKey)
									setTimeout(() => {
										uni.getNetworkType({
											success: async function(netRes) {
												if (netRes.networkType === 'none') {
													return
												}
												await uploadHrOnly()
											},
											fail: function(err) {
												console.error('获取网络类型失败：', err)
											}
										})
									}, 4000)
									return
								}
								console.log('BPW1血压伴随心率，仅缓存待与血压同报:', hrDelayWallKey)
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err)
							}
						})
						await that.sendack2(allData, deviceId, serviceId, writeuuid);
						that.resetDataState("心率");
						break;
					}
					case "01": { // 血压
						// PPG 启动场景仅三者：①定时测量 ②实时测血压后 ③点击立即测量
						// 历史血压同步/上报：只入库，绝不启 PPG
						const syncingNow = that.isBPW1HistorySyncing()
						const inHistoryGrace = !syncingNow && Date.now() < Number(that.bpw1HistoryGraceUntil || 0)
						// 同步中 + 结束后宽限尾包：一律历史上报路径
						const isHistoryBpPath = syncingNow || inHistoryGrace
						that.bpResult = []
						const bpResultdata = Healthparser.parseProtocolData(protocolData);
						const bpRecords = (bpResultdata.data && bpResultdata.data.records) ? bpResultdata.data
							.records : []
						// 历史路径全量；实时路径：最新一条走实时，其余进历史队列
						const bpHistoryEnd = isHistoryBpPath ? bpRecords.length : Math.max(bpRecords.length - 1, 0)
						for (let i = 0; i < bpHistoryEnd; i++) {
							that.bpResult.push(bpRecords[i])
						}
						// 多日分包会连续到达并清空 bpResult，异步上报前先快照本包数据
						const bpResultSnapshot = that.bpResult.slice()
						// 会话心率表 + pending：即使 flush 已清 pending，尾包仍能配到同秒心率
						const bpHrResultSnapshot = that.collectBPW1HistoryHrForMerge(that.bpw1PendingHrHistory)
						// console.log("=== 血压历史数据 ===", bpResultSnapshot)
						// that.addlog("血压历史数据", bpResultSnapshot)
						const parseBloodData = that.parseHeartRateData(protocolData.Covmamlueand);
						// 设备墙钟→本地时间戳；血压+心率统一用血压设备时间上报，避免手机 now 差 1~2 秒
						let parseBloodValuetime = that.datatime(datealltime + " " + parseBloodData.time)
						const bpUploadTime = parseBloodValuetime
						console.log("血压数据", parseBloodData, '上报time', bpUploadTime, '设备解析',
							parseBloodValuetime)
						// 实时：挂起血压，等伴随心率到齐后只上报一次（勿先单独报心率）
						const bpDeviceWallKeyEarly = that.normalizeDateTimeKey(
							datealltime + " " + parseBloodData.time
						)
						let bpMatchedRealtimeHr = ''
						if (!isHistoryBpPath) {
							bpMatchedRealtimeHr = that.takeBPW1RealtimeHrNear(bpDeviceWallKeyEarly, 3)
							that.markBPW1RealtimeBpWall(bpDeviceWallKeyEarly, 3)
						}
						// 历史只同步上报；同步中/静默期内不写首页血压；更旧数据不盖接口新值
						if (that.shouldApplyBPW1BpToHomeCard(parseBloodValuetime)) {
							const bpCardTs = Math.abs(Math.floor(Date.now() / 1000) - (Number(parseBloodValuetime) ||
								0)) <= 15 * 60 ? Math.floor(Date.now() / 1000) : (parseBloodValuetime || Math
								.floor(Date.now() / 1000))
							that.applyHomeBloodPressure(parseBloodData.diastolic, parseBloodData.systolic, bpCardTs)
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										if (that.QX_HIDE) {
											that.bgaaa(parseBloodData.diastolic, parseBloodData
												.systolic)
										}
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							that.xeuyabiaoshi = "1"
						}
						// 仅实时测血压后启 PPG（历史路径不挂 onDone）
						const tryStartPpgAfterRealtimeBp = () => {
							if (isHistoryBpPath || that.isBPW1HistorySyncing() ||
								Date.now() < Number(that.bpw1HistoryGraceUntil || 0)) {
								console.log('BPW1历史血压路径，跳过血压后PPG')
								return
							}
							const yaliSw = uni.getStorageSync("yaliswitchHER")
							const yaliOn = yaliSw === true || yaliSw === 'true' || yaliSw === 1 || yaliSw === '1'
							if (!yaliOn) {
								console.log('BPW1血压后PPG未开（yaliswitchHER）', yaliSw)
								return
							}
							console.log('BPW1实时血压后准备启动PPG')
							// 等 20s 期间先置灰立即测量（其它流程不变）；会话标记挡住调度误恢复
							that.yalixueyatype = true
							that.sleep_alertid = 1
							that.setSleepAlertDisabled(true)
							setTimeout(() => {
								if (that.isBPW1HistorySyncing() ||
									Date.now() < Number(that.bpw1HistoryGraceUntil || 0)) {
									console.log('BPW1延迟启PPG时处于历史路径，取消')
									that.yalixueyatype = false
									that.sleep_alertid = 0
									that.setSleepAlertDisabled(false)
									return
								}
								that.sendstartheartwatch(BPW1write, 1)
							}, 20000)
						}
						if (!isHistoryBpPath) {
							that.queueBPW1BpHrCombinedUpload({
								wallKey: bpDeviceWallKeyEarly,
								systolic: parseBloodData.systolic,
								diastolic: parseBloodData.diastolic,
								uploadTime: bpUploadTime,
								deviceId,
								deviceSn,
								matchedHr: bpMatchedRealtimeHr,
								onDone: tryStartPpgAfterRealtimeBp
							})
						}
						// 历史上报：
						// - 历史路径：可 await（不启 PPG）
						// - 实时测量：必须 fire-and-forget，避免卡住伴随心率与血压后 PPG
						if (isHistoryBpPath) {
							try {
								const netRes = await new Promise((resolve) => {
									uni.getNetworkType({
										success: resolve,
										fail: (err) => {
											console.error('获取网络类型失败：', err)
											resolve({
												networkType: 'none'
											})
										}
									})
								})
								if (netRes && netRes.networkType !== 'none') {
									await that.queryBloodPressureDataAsync(that.deviceSnuserID)
									that.mergeAndUploadWithDeduplication(
										bpHrResultSnapshot,
										bpResultSnapshot,
										deviceId,
										deviceSn
									)
									that.tryMergeBPW1PendingHistory(deviceId, deviceSn)
								} else if (bpResultSnapshot.length) {
									that.appendBPW1PendingBpHistory(bpResultSnapshot, deviceId, deviceSn)
								}
							} catch (e) {
								console.error('BPW1历史上报合并失败', e)
								if (bpResultSnapshot.length) {
									that.appendBPW1PendingBpHistory(bpResultSnapshot, deviceId, deviceSn)
								}
							}
						} else {
							uni.getNetworkType({
								success: async function(res) {
									if (res.networkType === 'none') {
										return
									}
									if (that.isBPW1HistorySyncing() || String(that.blewatch_id) === "1") {
										await that.queryBloodPressureDataAsync(that.deviceSnuserID)
										that.mergeAndUploadWithDeduplication(
											bpHrResultSnapshot,
											bpResultSnapshot,
											deviceId,
											deviceSn
										)
										that.tryMergeBPW1PendingHistory(deviceId, deviceSn)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
						}
						await that.sendack2(that.formatData(that.dataBuffer), deviceId, BPW1serviceId, BPW1write);
						that.resetDataState("血压")
						break;
					}
					case "02": { // 血氧
						const isO2HistorySync = that.isBPW1HistorySyncing()
						const oxygenValue = that.parseOxygenData(protocolData.Covmamlueand);
						let oxygenValuetime = that.datatime(datealltime + " " + oxygenValue.time)
						// 血氧记录与心率同结构，历史同步解析全部记录
						let o2HistoryRecords = []
						try {
							const o2Parsed = Healthparser.parseKeyValue(protocolData.Covmamlueand, 'heartRate')
							o2HistoryRecords = (o2Parsed.records || []).map(r => ({
								date: r.date,
								time: r.time,
								spO2: r.heartRate,
								dateTimeKey: that.normalizeDateTimeKey(`${r.date} ${r.time}`)
							}))
						} catch (e) {
							o2HistoryRecords = []
						}
						if (!o2HistoryRecords.length) {
							o2HistoryRecords = [{
								date: datealltime,
								time: oxygenValue.time,
								spO2: oxygenValue.diastolic,
								dateTimeKey: that.normalizeDateTimeKey(datealltime + " " + oxygenValue.time)
							}]
						}
						const o2ResultSnapshot = isO2HistorySync ? o2HistoryRecords.slice() : []
						// 历史只同步上报；同步中/静默期内不写首页血氧；更旧不盖接口
						if (!that.shouldMuteBPW1BleHomeUi()) {
							const o2CompareTs = that.toUnixSeconds(oxygenValuetime) || Math.floor(Date.now() / 1000)
							if (that.canUpdateHomeOxygenByNewestTime(o2CompareTs)) {
								const nearNow = Math.abs(Math.floor(Date.now() / 1000) - o2CompareTs) <= 15 * 60
								that.storeOxygenData(oxygenValue, nearNow ? Math.floor(Date.now() / 1000) :
									o2CompareTs);
								setTimeout(() => {
									that.cardeditData(that.list, "bloodData")
								}, 500)
							}
						}
						uni.getNetworkType({
							success: async function(res) {
								if (res.networkType === 'none') {
									return
								}
								// 历史同步：按服务端去重批量上报
								if (isO2HistorySync || that.isBPW1HistorySyncing()) {
									await that.queryOxygenData(that.deviceSnuserID)
									that.uploadBPW1SpO2HistoryWithDeduplication(
										o2ResultSnapshot,
										deviceId,
										deviceSn
									)
									return
								}
								await that.queryOxygenData(that.deviceSnuserID)
								const oxygenItem = {
									dateTimeKey: that.normalizeDateTimeKey(
										datealltime + " " + oxygenValue.time
									),
									spO2: oxygenValue.diastolic
								}
								if (that.shouldSkipOxygenUpload(oxygenItem, that.getExistingOxygenMap())) {
									console.log('BPW1血氧服务端已存在，跳过实时上报:', oxygenItem.dateTimeKey)
									return
								}
								that.jakoblife_fat_scale3(deviceId, oxygenValue.diastolic, deviceSn, "血氧",
									oxygenValuetime)
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err)
							}
						})
						await that.sendack2(allData, deviceId, serviceId, writeuuid);
						that.resetDataState("血氧");
						break;
					}
					case "19": {
						const pulValue19 = that.parseHeartRateData(protocolData.Covmamlueand);
						let pulValue19time = that.datatime(datealltime + " " + pulValue19.time)
						console.log("血压和心率数据", pulValue19)
						console.log("血压和心率数据未转时间戳", datealltime + " " + pulValue19.time)
						console.log("血压和心率数据", pulValue19time)
						// 历史只同步上报；同步中/静默期内不写首页；更旧血压不盖接口
						if (that.shouldApplyBPW1BpToHomeCard(pulValue19time)) {
							const bpCardTs = Math.abs(Math.floor(Date.now() / 1000) - (Number(pulValue19time) || 0)) <=
								15 * 60 ? Math.floor(Date.now() / 1000) : (pulValue19time || Math.floor(Date.now() /
									1000))
							that.applyHomeBloodPressure(pulValue19.diastolic, pulValue19.systolic, bpCardTs)
							that.xeuyabiaoshi = "1"
							// 脉搏/心率卡片：仅近实时写入，避免夜间历史血压包把心率闪到别日
							if (that.shouldApplyBPW1HrToHomeCard(pulValue19time)) {
								that.pulse = pulValue19.bloodPressureType;
								uni.setStorageSync("pulse", pulValue19.bloodPressureType)
								const homeCardTs = that.resolveBPW1HrHomeCardTs(pulValue19time)
								that.markBPW1LocalHrCardProtect()
								that.updateHeartRateCardLocal(pulValue19.bloodPressureType, homeCardTs)
							}
							setTimeout(() => {
								that.cardeditData(that.list, "bloodData")
							}, 500)
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										if (uni.getStorageSync("hearttime") !== pulValue19.time) {
											if (that.QX_HIDE) {
												that.bgaaa(pulValue19.diastolic, pulValue19.systolic)
											}
										}
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
						}
						uni.getNetworkType({
							success: async function(res) {
								if (res.networkType === 'none') {
									return
								}
								if (that.isBPW1HistorySyncing()) {
									console.log('BPW1历史同步中，跳过血压实时上报')
									return
								}
								await that.queryBloodPressureDataAsync(that.deviceSnuserID)
								const normalizedBpKey = that.normalizeDateTimeKey(
									datealltime + " " + pulValue19.time
								)
								if (that.hasServerBloodPressureAt(normalizedBpKey)) {
									console.log('BPW1血压服务端已存在，跳过实时上报:', normalizedBpKey)
									return
								}
								that.jakoblife_fat_scale22(
									deviceId,
									pulValue19.systolic,
									pulValue19.diastolic,
									pulValue19.bloodPressureType,
									deviceSn,
									pulValue19time, {
										requireBpWithHr: true
									}
								)
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err)
							}
						})
						await that.sendack2(allData, deviceId, serviceId, writeuuid);
						that.resetDataState("血压和心率");
						break;
					}
				}
				// 重置状态
				that.blewatch_id2 = "1"
				that.resetDataState("8");
			},
			// BPW1 血压历史上报专用：按墙钟给血压配伴随心率后同报
			// 不处理纯心率/PPG；实时血压走 queueBPW1BpHrCombinedUpload，不受影响
			mergeAndUploadWithDeduplication(localHrRecords, localBpRecords, deviceId, deviceSn, opts) {
				const that = this;
				const HR_MATCH_TOL = 3
				const HR_MATCH_FALLBACK_TOL = 15
				// 测血压时高压/低压与心率分包，墙钟常差一次测量时长，放宽到 90 秒并优先手测心率
				const HR_MATCH_BP_PAIR_TOL = Math.max(HR_MATCH_FALLBACK_TOL, Number(opts && opts
					.hrMatchBpPairTol) || 90)
				const bypassBatchDedupe = !!(opts && opts.bypassBatchDedupe)
				// 并入本轮会话心率，防止调用方快照在 flush 后变空
				const mergedHrRecords = that.collectBPW1HistoryHrForMerge(localHrRecords)
				// 本会话相同批次只处理一次（设备可能隔几秒重发同一天历史）
				const batchKey = JSON.stringify({
					bp: (localBpRecords || []).map(bp =>
						`${bp.date} ${bp.time} ${bp.highPressure}/${bp.lowPressure}`),
					hr: (mergedHrRecords || []).map(hr => `${hr.date} ${hr.time} ${hr.heartRate}`)
				})
				if (!that._bpw1HistoryBatchKeySet) {
					that._bpw1HistoryBatchKeySet = new Set()
				}
				if (!bypassBatchDedupe && that._bpw1HistoryBatchKeySet.has(batchKey)) {
					return
				}
				if (!bypassBatchDedupe) {
					that._bpw1HistoryBatchKeySet.add(batchKey)
				}
				const uploadMac = (that.shoubiaomac && that.shoubiaomac !== '0') ? that.shoubiaomac : deviceId
				const uploadSn = (that.shoubiaosn && that.shoubiaosn !== '0') ? that.shoubiaosn : deviceSn
				const existingTimes = that.getExistingBloodPressureTimeSet();
				const localBpKeySet = new Set();
				(localBpRecords || []).forEach(bp => {
					localBpKeySet.add(that.normalizeDateTimeKey(`${bp.date} ${bp.time}`));
				});
				// 创建心率映射（统一用 normalize key，避免匹配失败导致重复上报）
				const hrMap = new Map();
				(mergedHrRecords || []).forEach(hr => {
					const key = that.normalizeDateTimeKey(`${hr.date} ${hr.time}`);
					hrMap.set(key, hr);
				});
				const matchedHrKeysToRemove = []
				let skippedBp = 0
				// 同日密集血压：先全员精确配对，再宽配；全局唯一认领，避免抢邻点心率
				const bpItems = (localBpRecords || []).map(bp => {
					const key = `${bp.date} ${bp.time}`
					const normalizedKey = that.normalizeDateTimeKey(key)
					const timeTs = String(that.datatime(normalizedKey))
					const skipExisting = !!(existingTimes.has(normalizedKey) || existingTimes.has(key) ||
						that.hasServerBloodPressureAt(normalizedKey) ||
						(that.bpw1UploadedBpTimeSet && that.bpw1UploadedBpTimeSet.has(timeTs)) ||
						(that._bpw1DeferredBpTimeSet && that._bpw1DeferredBpTimeSet.has(timeTs)))
					return {
						bp,
						key,
						normalizedKey,
						timeTs,
						matchedNear: null,
						skipExisting
					}
				})
				// 服务端已有的血压不参与配对，避免抢走未上报血压的伴随心率
				// Pass1：同日精确/±3s，先占住每条血压自己的心率
				that.assignBPW1HistoryBpHrMatches(bpItems, hrMap, HR_MATCH_TOL, {
					sameDateOnly: true
				})
				// Pass2：仍未配上的再 ±15；优先手测，禁止挪用同包其它血压墙钟上的心率
				that.assignBPW1HistoryBpHrMatches(bpItems, hrMap, HR_MATCH_FALLBACK_TOL, {
					preferManual: true,
					sameDateOnly: true,
					excludeKeys: localBpKeySet
				})
				// Pass3：±tol 仅手测伴随心率（不回落自动心率，独立/定时心率留给补报）
				that.assignBPW1HistoryBpHrMatches(bpItems, hrMap, HR_MATCH_BP_PAIR_TOL, {
					preferManual: true,
					manualOnly: true,
					sameDateOnly: true,
					excludeKeys: localBpKeySet
				})
				// 历史上报正序：旧→新；配对完成后再排，不影响匹配
				bpItems.sort((a, b) => Number(a.timeTs) - Number(b.timeTs))
				const readyUploads = []
				// Pass4：上报 / 跳过 / 暂存（只处理血压历史，不单独上报心率）
				bpItems.forEach(item => {
					const {
						bp,
						key,
						normalizedKey,
						timeTs,
						matchedNear,
						skipExisting
					} = item
					if (skipExisting) {
						skippedBp++
						return;
					}
					if (matchedNear) {
						const hrVal = that.normalizeBPW1Heartrate(matchedNear.hr.heartRate)
						if (hrVal === '') {
							// 匹配到无效心率：不丢血压，回 pending；移除无效心率避免反复误配
							matchedHrKeysToRemove.push(matchedNear.key)
							that.appendBPW1PendingBpHistory([bp], uploadMac, uploadSn)
							console.log('历史血压匹配心率无效，回暂存:', key)
							return
						}
						matchedHrKeysToRemove.push(matchedNear.key)
						const bpUploadTs = that.datatime(normalizedKey)
						readyUploads.push({
							kind: 'bp',
							deviceId: uploadMac,
							deviceSn: uploadSn,
							high: bp.highPressure,
							low: bp.lowPressure,
							hr: hrVal,
							timess: bpUploadTs,
							opts: {
								requireBpWithHr: true
							}
						})
						// 仅标记已配对的血压/心率墙钟附近，避免宽窗误杀邻近独立心率补报
						that.markSessionHrUploadedNear(String(bpUploadTs), hrVal, HR_MATCH_TOL)
						if (matchedNear.key !== normalizedKey) {
							that.markSessionHrUploadedNear(String(that.datatime(matchedNear.key)),
								hrVal, HR_MATCH_TOL)
						}
					} else {
						that.appendBPW1PendingBpHistory([bp], uploadMac, uploadSn)
						console.log('历史血压暂存，等待心率同报:', key);
					}
				});

				if (matchedHrKeysToRemove.length) {
					that.removeBPW1PendingHrNearKeys(matchedHrKeysToRemove, HR_MATCH_TOL)
				}
				if (skippedBp) {
					console.log(`BPW1血压历史上报去重：跳过血压${skippedBp}条`)
				}
				// 同步中也先入队再防抖正序串行，跨包汇齐后旧→新上报；非同步则本包立即正序串行
				if (readyUploads.length) {
					if (that.isBPW1HistorySyncingOrGrace()) {
						readyUploads.forEach(item => that.enqueueBPW1DeferredHistoryUpload(item))
					} else {
						that.flushBPW1HistoryUploadList(readyUploads)
					}
				} else if (that.isBPW1HistorySyncingOrGrace() && (that.bpw1DeferredHistoryUploads || [])
					.length) {
					// 本包全是重发去重跳过，但队列里还有待报，催促 flush
					that.scheduleBPW1DeferredHistoryFlush(800)
				}
			},
			/**血压和心率历史数据查询
			 * @param {Object} deviceSn 这里需要用设备的SN查询，不能用user_id
			 */
			/** YMD 加减天数（按日历日，避免 toISOString/本地时区偏移） */
			shiftYmd(ymd, deltaDays) {
				const parts = String(ymd || '').split('-').map(Number)
				if (parts.length < 3 || parts.some(n => !Number.isFinite(n))) {
					return ymd
				}
				const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + deltaDays))
				const y = dt.getUTCFullYear()
				const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
				const d = String(dt.getUTCDate()).padStart(2, '0')
				return `${y}-${m}-${d}`
			},
			/**
			 * 查询时间窗：覆盖手机本地日（必要时并入中国日，兼容旧数据）
			 * @param {number} lookbackDays 回溯天数
			 */
			buildDeviceDataQueryRange(lookbackDays = 30) {
				const localYmd = this.getTimeAllJSON().YMD
				const chinaYmd = getChinaTimeAllJSON().YMD
				const endYmd = localYmd >= chinaYmd ? localYmd : chinaYmd
				const startBaseYmd = localYmd <= chinaYmd ? localYmd : chinaYmd
				return {
					startTime: this.shiftYmd(startBaseYmd, -Math.abs(lookbackDays)) + " 00:00:00",
					endTime: this.shiftYmd(endYmd, 1) + " 23:59:59"
				}
			},
			queryBloodPressureDataAsync(deviceSn) {
				const {
					startTime,
					endTime
				} = this.buildDeviceDataQueryRange(30)
				let data = {
					deviceSn: deviceSn,
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
					startTime: startTime,
					endTime: endTime,
				};
				// console.log("Bloodressucces参数", data)
				return this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((Bloodressucces) => {
					// console.log("Bloodressucces", Bloodressucces)
					if (Bloodressucces.code === 200) {
						this.boolserverData = Bloodressucces
					}
					return this.boolserverData
				}).catch(() => null)
			},
			// 处理CMD00命令(同步时间，配对经典蓝牙)
			async handleCMD00(hexData, deviceId, serviceId) {
				let that = this
				uni.setStorageSync("BPW1hexData", hexData)
				setTimeout(() => {
					that.calculateChecksumsss(hexData, deviceId, BPW1serviceId, BPW1write);
				}, 3000)
				that.resetDataState("1");
			},
			// 处理CMD04命令（步数）
			async handleCMD04(hexData, deviceId, serviceId, deviceSn) {
				let that = this
				await that.sendack2(hexData, deviceId, BPW1serviceId, BPW1write);
				const step = hexData.slice(18, 26); // 步数数据位置
				const stepCount = parseInt(step, 16);
				uni.setStorageSync("settept1", stepCount);
				await that.jakoblife_fat_scale3(deviceId, stepCount, deviceSn, "步数", "");
				that.resetDataState("7");
			},
			/**
			 * 睡眠数据分包处理解析
			 * @param {Object} hexData
			 * @param {Object} deviceId
			 * @param {Object} serviceId
			 * @param {Object} deviceSn
			 */
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
						console.log('BPW1睡眠分包10：总长度', dataLength, '包数', that.quotient2, '当前缓冲', that
							.dataBuffer.length);
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
						that.xinlvpack = that.calculateQuotient(fullPacketLength,
							80);
						break;
					case "01": // 血压
						that.xeuyapack = that.calculateQuotient(fullPacketLength,
							80);
						break;
					case "02": // 血氧
						that.xueyangpack = that.calculateQuotient(fullPacketLength,
							80);
						break;
					case "1d": { //ACC和PPG数据处理
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
						const parsePPGConfigdata = that.parsePPGConfigDescOrder(
							that.PPGdataarray)
						const dataall = {
							hexData: 'hexData' + hexData,
							ACCPPG: 'ACCPPG' + ACCPPG,
							date: "日期" + `${year}年${month}月${day}日`,
							PPGdataarray: 'PPG数据项定义:' + that.PPGdataarray,
							ACCdataarrayall: 'ACC数据总组数:' + ACCdataarrayall,
							PPGdataarrayall: 'PPG数据总组数:' + PPGdataarrayall,
							Status: '传输状态:' + Status,
							parsePPGConfigdata: '解析PPG数据配置字节:' + JSON
								.stringify(parsePPGConfigdata)
						}
						// console.log("dataall：" + JSON.stringify(dataall))
						switch (Status) {
							case "01":
								// 传输开始：勿清 sendwatch，否则调度会误判会话结束并打断后续数据
								that.bufferPPG = []
								that.bpw1PpgUploadDone = false
								that.bpw1PpgStatus02Handled = false
								// 新一轮 ACC/PPG：清血压心率合并认领，保证 PPG 过程心率可上报
								that.clearBPW1BpHrMergeGuards()
								clearInterval(that.watchtimer);
								that.watchtimer = null
								if (that.watchtimer2) {
									clearInterval(that.watchtimer2);
									that.watchtimer2 = null;
								}
								let watchtime2 = 50
								let ppgTransferExtendCount = 0
								that.watchtimer2 = setInterval(() => {
									watchtime2--;
									if (watchtime2 <= 0) {
										// PPG 分包未传完：有限次延长，避免 loading 提前结束
										if (that.quotientPPG > 0 && that.dataBuffer && that.dataBuffer.length <
											that.quotientPPG && ppgTransferExtendCount < 6) {
											ppgTransferExtendCount++
											watchtime2 = 30
											// 仅立即测量续弹「测量中」；定时(sendwatch)/血压后静默
											if (!that.yalixueyatype && (that.immediateEmotionMeasure || that
													.sleep_alertid === 1)) {
												uni.showLoading({
													title: that.$t("测量中"),
													mask: true,
												})
											}
											return
										}
										clearInterval(that.watchtimer2);
										that.watchtimer2 = null;
										// 传输超时中断：先清会话再恢复按钮
										that.bpw1PpgSessionActive = false
										that.yalixueyatype = false
										that.immediateEmotionMeasure = false
										that.sleep_alertid = 0
										that.setSleepAlertDisabled(false)
										uni.hideLoading();
										that.resetDataState("6");
									}
								}, 1000)
								if (!that.isBPW1PpgSessionAllowed()) {
									console.log('BPW1非情绪PPG会话 Status01，忽略')
									setTimeout(() => {
										// 只回 ACK，勿 sendack 清缓冲（随后可能紧接 ACC/PPG 分包）
										that.sendack2(hexData, deviceId, BPW1serviceId, BPW1write);
									}, 500)
									that.resetDataState("5");
									break
								}
								// 仅立即测量保持「测量中」；定时(sendwatch)/血压后静默，按钮仍置灰
								if (!that.yalixueyatype && (that.sleep_alertid === 1 || that
										.immediateEmotionMeasure)) {
									uni.showLoading({
										title: that.$t("测量中"),
										mask: true,
									})
								}
								if (that.sleep_alertid === 1 || uni.getStorageSync("sendwatch") === 1) {
									setTimeout(() => {
										// 只回 ACK，禁止 sendack 清空正在到达的 ACC/PPG 分包
										that.sendack2(hexData, deviceId, BPW1serviceId, BPW1write);
									}, 500)
								}
								that.sleep_alertid = 0
								// 传输中仍保持置灰（sleep_alertid 已清，靠 bpw1PpgSessionActive）
								that.setSleepAlertDisabled(true)
								that.resetDataState("5");
								break
							case "02":
								// 设备常因 ACK 去重/延迟重发多条 Status02：业务只处理一次，重复包强制再 ACK
								if (that.bpw1PpgStatus02Handled) {
									that.writeBPW1AckFromE0(hexData, deviceId, {
										force: true
									})
									that.resetDataState("4");
									break
								}
								that.bpw1PpgStatus02Handled = true
								uni.hideLoading()
								that.QX_FAIL = false
								clearInterval(that.watchtimer);
								that.watchtimer = null
								clearInterval(that.watchtimer2);
								that.watchtimer2 = null;
								that.sleep_alertid = 0
								const allowPpgUpload = that.isBPW1PpgSessionAllowed()
								// Status02 只上传一次，避免空 rawData / 重复 notify
								if (allowPpgUpload && !that.bpw1PpgUploadDone && that.bufferPPG && that.bufferPPG
									.length > 0) {
									that.bpw1PpgUploadDone = true
									const binary = that.packInt16(that.bufferPPG)
									that.ppgdata(binary, deviceSn)
									// 上传/云端分析期间保持置灰与会话锁
									that.setSleepAlertDisabled(true)
								} else if (!that.bpw1PpgUploadDone) {
									if (!allowPpgUpload) {
										console.log('BPW1非情绪PPG会话 Status02，跳过上传')
										that.bpw1PpgSessionActive = false
									} else {
										console.warn('BPW1 PPG Status02：buffer 为空，跳过上传')
										// 空数据无法上传：立刻恢复情绪按钮，避免 Status02 清掉计时器后按钮一直灰
										that.immediateEmotionMeasure = false
										that.yalixueyatype = false
										that.bpw1PpgSessionActive = false
										that.setSleepAlertDisabled(false)
									}
									that.bpw1PpgUploadDone = true
								}
								that.bufferPPG = []
								// 有上传时保留 bpw1PpgSessionActive，等 ppgdata/结果收尾再清
								if (!(allowPpgUpload && that._bpw1PpgPosting)) {
									that.bpw1PpgSessionActive = false
								}
								if (allowPpgUpload) {
									uni.removeStorageSync("sendwatch")
									onQxBleWatchCollectionEnded('手表采集结束')
								}
								// 立即强制 ACK，避免 500ms 延迟导致设备连发 Status02
								that.writeBPW1AckFromE0(hexData, deviceId, {
									force: true
								})
								that.resetDataState("4");
								break
						}
						break
					}
					case "1e":
						that.quotientACC = that.calculateQuotient(fullPacketLength, 80);
						break
					case "1f":
						that.quotientPPG = that.calculateQuotient(fullPacketLength, 80);
						break
				}
			},

			// 根据包头分离数据包
			splitPacketsByHeader() {
				const bpPackets = []; // 血压数据包
				const hrPackets = []; // 心率数据包
				let currentTarget = bpPackets;
				this.dataBuffer.forEach(packet => {
					// 遇到新的e0包头，切换到另一个数据集
					if (packet.startsWith('e0') && (bpPackets.length > 0 || hrPackets.length > 0)) {
						currentTarget = currentTarget === bpPackets ? hrPackets : bpPackets;
					}
					currentTarget.push(packet);
				});
				return [bpPackets, hrPackets];
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
			/**
			 * 标记已回复 ACK 的 E0 包，避免入口 ACK 与业务 ACK 重复写入
			 */
			markBPW1AckKey(hexString) {
				if (!hexString) return
				if (!this.bpw1RecentAckKeys) {
					this.bpw1RecentAckKeys = new Set()
				}
				const key = `${hexString.slice(0, 20)}:${hexString.length}`
				this.bpw1RecentAckKeys.add(key)
				setTimeout(() => {
					if (this.bpw1RecentAckKeys) {
						this.bpw1RecentAckKeys.delete(key)
					}
				}, 5000)
			},
			hasBPW1AckKey(hexString) {
				if (!hexString || !this.bpw1RecentAckKeys) return false
				const key = `${hexString.slice(0, 20)}:${hexString.length}`
				return this.bpw1RecentAckKeys.has(key)
			},
			/**
			 * 根据 E0 数据构造并写入 ACK（0E）；0E 开头不回复
			 * @returns {Promise<boolean>}
			 */
			writeBPW1AckFromE0(dataList, deviceId, opts) {
				const that = this
				const force = !!(opts && opts.force)
				const hexString = (dataList || '').toLowerCase()
				if (!hexString || hexString.slice(0, 2) !== 'e0') {
					return Promise.resolve(false)
				}
				const ackKey = `${hexString.slice(0, 20)}:${hexString.length}`
				if (force && that.bpw1RecentAckKeys) {
					that.bpw1RecentAckKeys.delete(ackKey)
				}
				if (!force && that.hasBPW1AckKey(hexString)) {
					return Promise.resolve(true)
				}
				const bytes = []
				for (let i = 0; i < hexString.length; i += 2) {
					bytes.push(parseInt(hexString.substring(i, i + 2), 16))
				}
				if (bytes.length < 9) {
					return Promise.resolve(false)
				}
				const protocolChecksum = bytes[3]
				const protocolCommand = bytes[4]
				const protocolVersion = bytes[5]
				const protocolSubcommand = bytes[6]
				let sumBytes = 0
				for (let i = 0; i < bytes.length; i++) {
					if (i !== 3) {
						sumBytes += bytes[i]
					}
				}
				const calculatedChecksum = sumBytes % 256
				if (calculatedChecksum !== protocolChecksum) {
					return Promise.resolve(false)
				}
				const ACK_RESPONSE_HEADER = 0x0E
				const commandId = `0x${protocolCommand.toString(16).padStart(2, '0')}`
				const commandKey = `0x${protocolSubcommand.toString(16).padStart(2, '0')}`
				const protocolVer = `0x${protocolVersion.toString(16).padStart(2, '0')}`
				const code = 0x00
				const ackConfigByte = new Uint8Array(9)
				ackConfigByte[0] = ACK_RESPONSE_HEADER
				ackConfigByte[1] = 0x00
				ackConfigByte[2] = 0x06
				ackConfigByte[3] = commandId
				ackConfigByte[4] = protocolVer
				ackConfigByte[5] = commandKey
				ackConfigByte[6] = 0x00
				ackConfigByte[7] = 0x01
				ackConfigByte[8] = code
				let ackConfigBytesum = 0
				for (let i = 0; i < ackConfigByte.length - 1; i++) {
					ackConfigBytesum += ackConfigByte[i]
				}
				ackConfigBytesum = ackConfigBytesum % 256
				const modifiedCommand = new Uint8Array(ackConfigByte.length + 1)
				modifiedCommand.set(ackConfigByte.subarray(0, 3), 0)
				modifiedCommand[3] = ackConfigBytesum
				modifiedCommand.set(ackConfigByte.subarray(3), 4)
				const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(16).padStart(2, '0'))
					.join('')
				const buffer = that.toArrayBuffer(hexCommand)
				return new Promise((resolve) => {
					let settled = false
					const finish = (ok) => {
						if (settled) return
						settled = true
						clearTimeout(ackTimer)
						if (ok) {
							that.markBPW1AckKey(hexString)
						}
						resolve(ok)
					}
					// 防止 write 无回调导致 E0 串行队列卡死（表现为同步极慢、点测量后不再通信）
					const ackTimer = setTimeout(() => {
						finish(true)
					}, 1500)
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						value: buffer,
						success() {
							finish(true)
						},
						fail() {
							finish(false)
						},
						complete() {
							if (!settled) {
								finish(true)
							}
						}
					})
				})
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
				return that.writeBPW1AckFromE0(dataList, deviceId)
			},
			async sendack2(dataList, deviceId, serviceId, writeuuid) {
				return this.writeBPW1AckFromE0(dataList, deviceId)
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
				const data = stringdata.slice(stringdata.length - 16, stringdata.length);
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
				const hexData = stringdata.slice(stringdata.length - 16, stringdata.length);
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
				const Covmamlueand = alltypearray.slice(18, alltypearray.length); // 命令指令值 1~503Byte
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
			calculateChecksumsss(hexString, deviceId, serviceId,
				writeuuid) {
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
				const hexCommand1 = Array.from(command).map(byte => byte.toString(16).padStart(2, '0')).join('');
				// 将字符串转换为字节数组
				const bytesnew = new Uint8Array(hexCommand1.match(/../g).map(byte => parseInt(byte, 16)));
				// 将每个字节转换为 0x00 格式的字符串
				const formattedBytes = Array.from(bytesnew).map(byte => `0x${byte.toString(16).padStart(2, '0')}`);
				// 将十六进制字符串转换为十进制数值
				const bytes333 = formattedBytes.map(byte => parseInt(byte, 16));
				// 计算累加和
				let sum = 0;
				for (let i = 0; i < bytes333.length; i++) {
					sum += bytes333[i];
				}
				// 取模 256，得到低 8 位的和
				sum = sum % 256;
				const modifiedCommand = new Uint8Array(command.length + 1); // 第四个字节的插入，数组长度加1
				modifiedCommand.set(command.subarray(0, 3), 0);
				modifiedCommand[3] = sum;
				modifiedCommand.set(command.subarray(3), 4);
				// 将整个命令数组转换为16进制字符串
				const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const buffer = that.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: BPW1serviceId,
					characteristicId: BPW1write,
					writeType: "write",
					value: buffer,
					complete(complete) {
						if (complete.code === 10007) {
							// console.log("时间发送命令成功", hexCommand)
						} else {
							console.log("时间发送命令失败", hexCommand)
						}
						that.dataBuffer = []
						that.getsetp(deviceId, serviceId, writeuuid, BleDeviceConfig.PROTOCOL_VERSION)
					}
				})
				// 与 notify 就绪路径共用 hasSynced，避免 CMD00 + 连接 重复拉历史
				that.scheduleBPW1SessionHistorySync(deviceId)
			},
			/**
			 * BPW1 本会话仅同步一次历史（杀进程重开/首次连接）；切页重进不重复
			 */
			scheduleBPW1SessionHistorySync(deviceId) {
				const that = this
				if (!deviceId || that.hasSynced) {
					return
				}
				that.hasSynced = true
				setTimeout(() => {
					if (that.acktypes !== "1") {
						that.hasSynced = false
						return
					}
					that.Sync_historical_data(deviceId)
				}, 5000)
			},
			/**
			 * BPW1 断线/回连监听：仅用于手机蓝牙关开后标记并补拉历史，不改变切页同步语义
			 */
			ensureBPW1ConnectionStateListener(fallbackDeviceId) {
				const that = this
				if (that._bpw1ConnectionStateListenerInstalled) {
					return
				}
				that._bpw1ConnectionStateListenerInstalled = true
				uni.onBLEConnectionStateChange(function(change) {
					const eventId = change.deviceId || fallbackDeviceId
					const bpw1Id = that.deviceIdwatch || uni.getStorageSync("deviceIdwatch") ||
						fallbackDeviceId
					const isBpw1 = !bpw1Id || !eventId || eventId === bpw1Id
					if (!change.connected) {
						console.log('蓝牙设备已断开', eventId);
						if (that.characteristicsCache.has(eventId)) {
							console.log(`清除设备 ${eventId} 的特征值缓存`);
							that.characteristicsCache.delete(eventId);
						}
						that.deviceLists = that.deviceList.filter(deviceIds => deviceIds !== eventId);
						if (isBpw1) {
							// 立即放开门闩，避免 1s 内回连时 hasSynced 仍为 true
							that._bpw1PendingBtHistoryResync = true
							that.hasSynced = false
						}
						setTimeout(() => {
							that.deviceList = [];
							that.setacktypes("0")
							that.hasSynced = false
							that.bpw1SleepHistorySyncedOnce = false
							that.queryDevices()
						}, 1000)
						const plugin = uni.requireNativePlugin("CBConnectPlugin-CBCModule");
						plugin.connectPeripheral({
							identifier: eventId
						}, (result, keepAlive) => {});
					} else if (isBpw1) {
						if (that._bpw1PendingBtHistoryResync) {
							that.forceBPW1HistoryResyncAfterReconnect(eventId)
						} else {
							that.scheduleBPW1SessionHistorySync(eventId)
						}
					}
				});
			},
			/**
			 * 手机蓝牙关开后强制补拉 BPW1 历史：先重建 GATT 再写同步命令。
			 * 绕过 hasSynced/acktypes 竞态；不影响切页不重复同步。
			 */
			forceBPW1HistoryResyncAfterReconnect(deviceId, attempt) {
				const that = this
				const retry = typeof attempt === "number" ? attempt : 0
				if (!deviceId) {
					return
				}
				if (that._bpw1ForceHistoryResyncRunning && retry === 0) {
					return
				}
				that._bpw1ForceHistoryResyncRunning = true
				that.hasSynced = false
				that._bpw1PendingBtHistoryResync = true
				// 蓝牙关开后旧特征值缓存不可用，必须重建后再写
				if (that.characteristicsCache.has(deviceId)) {
					that.characteristicsCache.delete(deviceId)
				}
				const delay = retry === 0 ? 4000 : 3500
				const finishRetryOrStop = function(ok) {
					that._bpw1ForceHistoryResyncRunning = false
					if (ok) {
						that._bpw1PendingBtHistoryResync = false
						that.hasSynced = true
						return
					}
					that.hasSynced = false
					if (retry < 2) {
						that.forceBPW1HistoryResyncAfterReconnect(deviceId, retry + 1)
					}
				}
				const writeHistorySync = function() {
					that.deviceIdwatch = deviceId
					uni.setStorageSync("deviceIdwatch", deviceId)
					uni.setStorageSync("serviceIdwatch", BPW1serviceId)
					uni.setStorageSync("writeuuid", BPW1write)
					uni.setStorageSync("landcharacteristicId", BPW1notify)
					if (that.acktypes !== "1") {
						that.setacktypes("1")
					}
					that.hasSynced = true
					that.characteristicsCache.add(deviceId)
					that.Sync_historical_data(deviceId)
					setTimeout(function() {
						finishRetryOrStop(that.isBPW1HistorySyncing())
					}, 3000)
				}
				const enableNotifyAndSync = function() {
					uni.notifyBLECharacteristicValueChange({
						state: true,
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1notify,
						success() {
							that.registerBLECharacteristicValueChange(deviceId, BPW1serviceId, that
								.shoubiaosn || '')
							that.ensureBPW1ConnectionStateListener(deviceId)
							setTimeout(writeHistorySync, 1500)
						},
						fail() {
							// notify 失败仍尝试写同步（部分机型可写）
							setTimeout(writeHistorySync, 1500)
						}
					})
				}
				setTimeout(function() {
					uni.createBLEConnection({
						deviceId: deviceId,
						timeout: 15000,
						complete(connRes) {
							const msg = String((connRes && connRes.errMsg) || '')
							const code = connRes && (connRes.errCode != null ? connRes.errCode :
								connRes.code)
							const already = code === -1 || msg.indexOf('already') !== -1 || msg
								.indexOf(':ok') !== -1 || code === 0 || code == null
							if (!already && code) {
								finishRetryOrStop(false)
								return
							}
							setTimeout(function() {
								uni.getBLEDeviceServices({
									deviceId: deviceId,
									success() {
										uni.getBLEDeviceCharacteristics({
											deviceId: deviceId,
											serviceId: BPW1serviceId,
											success() {
												enableNotifyAndSync()
											},
											fail() {
												finishRetryOrStop(false)
											}
										})
									},
									fail() {
										// 服务枚举失败时仍尝试按已知 UUID 开 notify
										enableNotifyAndSync()
									}
								})
							}, 1500)
						}
					})
				}, delay)
			},
			/**
			 * 仅处理「手机蓝牙关闭再打开」：标记待补同步，并在适配器恢复后兜底强制拉历史。
			 * 不改动切页/首次连接/睡眠页等既有同步门闩逻辑。
			 */
			ensureBPW1AdapterHistoryResyncListener() {
				const that = this
				if (that._bpw1AdapterHistoryResyncListenerInstalled) {
					return
				}
				that._bpw1AdapterHistoryResyncListenerInstalled = true
				that._bpw1AdapterWasUnavailable = false
				uni.onBluetoothAdapterStateChange(function(res) {
					if (!res.available) {
						that._bpw1AdapterWasUnavailable = true
						that._bpw1PendingBtHistoryResync = true
						that.hasSynced = false
						return
					}
					if (!that._bpw1AdapterWasUnavailable) {
						return
					}
					that._bpw1AdapterWasUnavailable = false
					that._bpw1PendingBtHistoryResync = true
					that.hasSynced = false
					const deviceId = that.deviceIdwatch || uni.getStorageSync("deviceIdwatch")
					if (!deviceId) {
						return
					}
					// 适配器恢复后兜底：不等待 acktypes，避免 keep-alive 回连跳过握手导致不同步
					setTimeout(function() {
						if (!that._bpw1PendingBtHistoryResync) {
							return
						}
						that.forceBPW1HistoryResyncAfterReconnect(deviceId)
					}, 6000)
				})
			},
			calculateChecksumsss2(hexString, deviceId, serviceId, writeuuid) {
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
				const hexCommand1 = Array.from(command).map(byte => byte.toString(16).padStart(2, '0')).join('');
				// 将字符串转换为字节数组
				const bytesnew = new Uint8Array(hexCommand1.match(/../g).map(byte => parseInt(byte, 16)));
				// 将每个字节转换为 0x00 格式的字符串
				const formattedBytes = Array.from(bytesnew).map(byte => `0x${byte.toString(16).padStart(2, '0')}`);
				// 将十六进制字符串转换为十进制数值
				const bytes333 = formattedBytes.map(byte => parseInt(byte, 16));
				// 计算累加和
				let sum = 0;
				for (let i = 0; i < bytes333.length; i++) {
					sum += bytes333[i];
				}
				// 取模 256，得到低 8 位的和
				sum = sum % 256;
				const modifiedCommand = new Uint8Array(command.length + 1); // 第四个字节的插入，数组长度加1
				modifiedCommand.set(command.subarray(0, 3), 0);
				modifiedCommand[3] = sum;
				modifiedCommand.set(command.subarray(3), 4);
				// 将整个命令数组转换为16进制字符串
				const hexCommand = Array.from(modifiedCommand).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const buffer = that.toArrayBuffer(hexCommand); // 转换为 ArrayBuffer获取设备信息
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: BPW1serviceId,
					characteristicId: BPW1write,
					writeType: "write",
					value: buffer,
					complete(complete) {}
				})
			},

			/** 「我的」页手动同步：绑定 BPW1 发 BPW1 历史命令，否则发 BPW6 */
			manualSyncBoundDeviceHistory() {
				const that = this
				const emitDone = (ok, message) => {
					uni.$emit('DEVICE_HISTORY_SYNC_DONE', {
						ok: !!ok,
						message: message || that.$t(ok ? '已发送同步命令' : '数据同步失败')
					})
				}
				const hasBpw1 = !!(that.deviceIdwatch || uni.getStorageSync('deviceIdwatch'))
				const hasBpw6 = !!(that.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac'))
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
				if (boundBpw1) {
					const deviceId = that.deviceIdwatch || uni.getStorageSync('deviceIdwatch')
					if (!deviceId || that.acktypes !== '1') {
						emitDone(false, that.$t('设备未连接'))
						return
					}
					that._manualHistorySyncCb = (writeOk) => {
						emitDone(writeOk, that.$t(writeOk ? '已发送同步命令' : '数据同步失败'))
					}
					that.Sync_historical_data(deviceId)
					return
				}
				if (!boundBpw6) {
					emitDone(false, that.$t('当前未绑定任何设备'))
					return
				}
				const deviceId6 = that.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
				if (!deviceId6 || that.acktypes6 !== '1') {
					emitDone(false, that.$t('设备未连接'))
					return
				}
				that.Sync_historical_data_BPW6(deviceId6).then((ok) => {
					emitDone(ok !== false, that.$t(ok !== false ? '已发送同步命令' : '数据同步失败'))
				}).catch(() => {
					emitDone(false, that.$t('数据同步失败'))
				})
			},
			/** BPW6 同步历史：运动睡眠 + 血压 + 心率（与首页连接后命令一致） */
			async Sync_historical_data_BPW6(deviceId) {
				const that = this
				const targetDeviceId = deviceId || that.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
				if (!targetDeviceId) {
					return false
				}
				that.bpw6BpBuffer = []
				that.bpw6HrBuffer = []
				that.bpw6SpO2Buffer = []
				that.bpw6RealtimeUploadKey = ''
				that.bpw6BpHistorySyncing = true
				try {
					await that.readBpw6DailyInfoWeek(targetDeviceId)
					await u16proBLE.readLatestBPHistory(50, targetDeviceId)
					await u16proBLE.readLatestHRHistory(targetDeviceId)
					return true
				} catch (err) {
					that.bpw6BpHistorySyncing = false
					console.error('BPW6历史同步失败:', err)
					return false
				}
			},
			/** BPW1同步历史数据并发送天气命令
			 * @param {Object} deviceId
			 * 请求同步所有数据：e00006ea010100000101
			 * 请求同步当天所有数据命令：e00006eb010101000101
			 */
			Sync_historical_data(deviceId) {
				let that = this
				// 发起同步即标记，避免睡眠等分包把 blewatch_id 提前置 0 后误启 PPG
				that.setBPW1HistorySyncing(true)
				uni.writeBLECharacteristicValue({
					deviceId: deviceId,
					serviceId: BPW1serviceId,
					characteristicId: BPW1write,
					writeType: 'write',
					value: that.toArrayBuffer('e00006ea010100000101'),
					complete(complete) {
						const writeOk = that.isBPW1BleWriteOk(complete)
						if (typeof that._manualHistorySyncCb === 'function') {
							const cb = that._manualHistorySyncCb
							that._manualHistorySyncCb = null
							cb(writeOk)
						}
						// 兼容旧约定 code===10007，以及标准 writeBLECharacteristicValue:ok
						if (writeOk) {
							that.blewatch_id = "1"
							that.blewatch_id2 = "0"
							that._bpw1PendingBtHistoryResync = false
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log("当前无可用网络，无法同步实时天气")
									} else {
										that.getLocalWeather(
											deviceId,
											BPW1serviceId,
											BPW1write
										)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
						} else {
							that.blewatch_id = "0"
							that.setBPW1HistorySyncing(false)
							// 写失败放开门闩，便于蓝牙关开回连后的强制补同步重试
							that.hasSynced = false
							console.log("请求同步所有数据失败：e00006ea010100000101", complete)
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										console.log("当前无可用网络，无法同步实时天气")
									} else {
										that.getLocalWeather(deviceId, BPW1serviceId, BPW1write)
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
						}
					}
				})
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
						const buffer = protocolHelper
							.buildCurrentWeatherCommand(
								this.weatherData,
								this.weatherData.location
							);
						if (buffer) {
							const bytes = new Uint8Array(buffer);
							this.weatherDataID = protocolHelper
								.bytesToHex(bytes)
							console.log('✅ this.weatherDataID:', this
								.weatherDataID);
							setTimeout(() => {
								this.weather(deviceId,
									serviceId, writeuuid)
							}, 1000)
						} else {
							console.error('❌ 测试生成失败');
						}
					}
				} catch (e) {
					console.error('本地天气错误:', e);
				}
			},
			//当天天气
			weather(deviceId, serviceId, writeuuid) {
				let that = this
				const buffer2 = that.toArrayBuffer(that.weatherDataID); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							if (complete.code ===
								10007) {
								that.weather7(deviceId, serviceId, writeuuid)
								// console.log("天气命令：", that.weatherDataID)
							} else {
								that.weather7(deviceId,
									serviceId,
									writeuuid)
								console.log("天气命令失败：",
									that
									.weatherDataID)
							}
						}
					})
				}, 3000)
			},
			//一周天气
			weather7(deviceId, serviceId, writeuuid) {
				let that = this
				const buffer2 = that.toArrayBuffer(that.weatherDataID7); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'write',
						value: buffer2,
						complete(complete) {}
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
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'write',
						value: buffer2,
						complete(complete) {}
					})
				}, 3000)
			},
			/**
			 * BPW1发送获取运动数据命令
			 * @param {Object} deviceId
			 * @param {Object} serviceId
			 * @param {Object} writeuuid
			 * @param {Object} PROTOCOL_VERSION
			 */
			getsetp(deviceId, serviceId, writeuuid, PROTOCOL_VERSION) {
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
				for (let i = 0; i < ackConfigByteset.length; i++) { // 遍历 command 数组的前 command.length - 1 个元素
					ackConfigBytesum2 += ackConfigByteset[i]; // 累加每个元素的值
				}
				ackConfigBytesum2 = ackConfigBytesum2 % 256; // 取模 256，得到低 8 位的和
				// 创建新的数组，将校验和插入到第四个字节中
				const modifiedCommand2 = new Uint8Array(ackConfigByteset.length + 1); // 第四个字节的插入，数组长度加1
				modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
				modifiedCommand2[3] = ackConfigBytesum2;
				modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
				const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte.toString(16).padStart(2, '0')).join('');
				const buffer2 = that.toArrayBuffer(hexCommand2); // 转换为 ArrayBuffer获取设备信息
				setTimeout(() => {
					uni.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							if (complete.code === 10007) {
								// console.log("运动数据命令：", hexCommand2)
							} else {
								console.log("运动数据命令失败：", hexCommand2)
							}
							that.dataBuffer = []
						}
					})
				}, 2000)
			},
			//获取蓝牙外围设备的特征值
			getBLEDeviceCharacteristics2(deviceId, serviceId,
				deviceSn) {
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
								uni.setStorageSync("landcharacteristicId", item.uuid)
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
											deviceSn
										);
									},
									fail: (
										notifyerr) => {}
								})
							}
							setTimeout(() => {
								if (item.properties.write) {
									// 当前时间
									const now =
										new Date();
									const year =
										now
										.getFullYear()
										.toString();
									const month =
										now
										.getMonth() +
										1; // 月份从0开始
									const day = now
										.getDate();
									const hour =
										now
										.getHours();
									const minute =
										now
										.getMinutes();
									const second =
										now
										.getSeconds();
									that.sendLargeData(
										deviceId,
										serviceId,
										item
										.uuid,
										year,
										month,
										day,
										hour,
										minute,
										second);
								}
							}, 1000)
						}
					},
					fail(res) {}
				})
			},


			/**
			 * 优先与BPW6（U19M）手表BLE数据解析
			 * @param {Object} deviceId
			 * @param {Object} serviceId
			 * @param {Object} deviceSn
			 */
			async getBLEDeviceCharacteristics6(deviceId, serviceId, deviceSn) {
				let that = this;
				try {
					if (that.characteristicsCache.has(deviceId)) {
						// 缓存命中时仍刷新 SN/handler，避免换绑后沿用旧闭包 SN
						if (deviceSn) {
							that.deviceIdwatch6_SN = deviceSn
							that.installBleForwardHandler(deviceSn)
						}
						uni.openBluetoothAdapter({
							success: () => {
								uni.onBLEConnectionStateChange(
									function(change) {
										if (!change.connected && deviceId === change.deviceId) {
											console.log('蓝牙设备已断开');
											if (that.characteristicsCache.has(deviceId)) {
												console.log(`清除设备 ${deviceId} 的特征值缓存`);
												that.characteristicsCache.delete(deviceId);
											}
											that.deviceList = that.deviceList.filter(item => item
												.mac !== deviceId
											);
											that.setacktypes6("0")
											that.queryDevices()
											// 在这里处理设备断开后的逻辑，例如尝试重新连接等
										}
									});
								if (!that.hasSynced6) { // 确保只执行一次
									that.hasSynced6 = true; // 标记已同步
									if (that.acktypes === "1" && that.blewatch_id2 === "1") {
										that.Sync_historical_data(deviceId)
									}
								}
							},
							fail: (err) => {
								console.error('6蓝牙适配器初始化失败', err);
								if (that.characteristicsCache.has(deviceId)) {
									console.log(`清除设备 ${deviceId} 的特征值缓存`);
									that.characteristicsCache.delete(deviceId);
								}
								that.deviceList = that.deviceList.filter(item => item.mac !== deviceId);
								that.setacktypes6("0")
								that.queryDevices()
							}
						});
						return;
					}
					const res = await that._getBLEDeviceCharacteristics(deviceId, serviceId);
					that.characteristicsCache.add(deviceId); // 缓存设备ID，
					for (let i = 0; i < res.characteristics.length; i++) {
						const item = res.characteristics[i];
						if (that.acktypes6 === "0") {
							// 处理可写入的特征值（只执行一次）
							if (item.properties.write) {
								try {
									if (!that.hasWriten) {
										that.hasWriten = true;
										// 连接成功后同步时间
										u16proBLE.setTime(new Date(), 0, deviceId) // 同步时间0=中文
										// setTimeout(async () => {
										// 	await u16proBLE.readBattery(deviceId);//读取手表电量
										// }, 1000);
										setTimeout(() => {
											u16proBLE.setHRAuto(false, deviceId) //开关心率自动测量
										}, 500);
										setTimeout(() => {
											u16proBLE.setSpO2Auto(false, deviceId) //开关血氧自动测量
										}, 1000);
									}
									setTimeout(async () => {
										that.bpw6BpBuffer = []
										that.bpw6HrBuffer = []
										that.bpw6SpO2Buffer = []
										that.bpw6RealtimeUploadKey = ''
										that.bpw6BpHistorySyncing = true
										try {
											await that.readBpw6DailyInfoWeek(deviceId) //读取近7天运动&睡眠数据
											await u16proBLE.readLatestBPHistory(50, deviceId) //读取血压历史记录
											await u16proBLE.readLatestHRHistory(deviceId) //读取心率历史记录
											// await u16proBLE.readLatestSpO2History(deviceId)//读取血氧历史记录
										} catch (err) {
											that.bpw6BpHistorySyncing = false
											console.error('BPW6历史同步失败:', err)
										}
									}, 2000);
								} catch (err) {
									console.error('同步失败:', err);
								}
							}
							that.setacktypes6("1")
						}
						if ((that.devicetype === 30001 && that.devicetypelist.length === 1)) {
							const bpTimerConfig = uni.getStorageSync('blood_pressure_timer_config') || {}
							const activeMode = bpTimerConfig.currentMode || 'custom'
							const now = new Date()
							const todayKey =
								`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
							const currentHour = now.getHours()
							const targetHour = activeMode === '7d' ? 8 : 6
							const lastSend = uni.getStorageSync('bpw6_bp_dynamic_params_daily_send') || {}
							const alreadySentToday = lastSend.date === todayKey && lastSend.hour === targetHour
							if (currentHour === targetHour && !alreadySentToday) {
								if (activeMode === '24h') {
									await u16proBLE.setBPDynamicParams({
										enabled: 1,
										startHour: 6,
										dayInterval: 30,
										nightInterval: 60
									}, deviceId)
								} else if (activeMode === '7d') {
									await u16proBLE.setBPDynamicParams({
										enabled: 1,
										startHour: 8,
										dayInterval: 60,
										nightInterval: 80
									}, deviceId)
								} else {
									await u16proBLE.setBPDynamicParams({
										enabled: 0,
										startHour: 6,
										dayInterval: 30 || 60,
										nightInterval: 60 || 80
									}, deviceId)
								}
								uni.setStorageSync('bpw6_bp_dynamic_params_daily_send', {
									date: todayKey,
									hour: targetHour
								})
							}
						}
						// 蓝牙消息通知
						if (item.properties.notify) {
							try {
								await that._notifyBLECharacteristicValueChange({
									state: true,
									deviceId: deviceId,
									serviceId: serviceId,
									characteristicId: item.uuid
								});
								setTimeout(async () => {
									that.registerBLECharacteristicValueChange(
										deviceId,
										serviceId,
										deviceSn);
								}, 1000);
								// 预启用 PPG 自定义 BC 服务 notify，避免首次立即测量无应答
								setTimeout(() => {
									u16proBLE.ensureBcServiceReady(deviceId, {
										force: true
									}).catch((err) => {
										console.warn('【BPW6】预启用PPG通道失败', err)
										// 再试一次，覆盖首次绑定连接抖动
										setTimeout(() => {
											u16proBLE.ensureBcServiceReady(deviceId, {
												force: true
											}).catch((err2) => {
												console.warn('【BPW6】预启用PPG通道重试失败',
													err2)
											})
										}, 1200)
									})
								}, 1500);
							} catch (notifyerr) {
								console.error('notify 启用失败:', notifyerr);
							}
						}
					}
				} catch (res) {
					console.error('getBLEDeviceCharacteristics 失败:', res);
					if (Vue.prototype.$globalTimers.heartbeatInterval) {
						clearInterval(Vue.prototype.$globalTimers.heartbeatInterval);
						Vue.prototype.$globalTimers.heartbeatInterval = null;
					}
					that.disconnectAll(deviceId)
					that.setacktypes6("0")
					that.deviceList = that.deviceList.filter(item => item.mac !== deviceId);
					that.getUserInfo()
					uni.getNetworkType({
						success: function(
							getNetworkTyperes) {
							if (getNetworkTyperes.networkType === 'none') {
								console.log('无网络连接');
								that.aaaa(uni.getStorageSync("lixianlist"))
							}
						},
						fail: function(err) {
							console.error('获取网络类型失败：', err);
						}
					});
				}
			},
			// 封装 Promise 版本的 API
			_getBLEDeviceCharacteristics(deviceId, serviceId) {
				return new Promise((resolve, reject) => {
					uni.getBLEDeviceCharacteristics({
						deviceId: deviceId,
						serviceId: serviceId,
						success: resolve,
						fail: reject
					});
				});
			},

			_notifyBLECharacteristicValueChange(options) {
				return new Promise((resolve, reject) => {
					uni.notifyBLECharacteristicValueChange({
						...options,
						success: resolve,
						fail: reject
					});
				});
			},
			/** 服务端该时刻是否已有血压（高压/低压），纯心率记录不算 */
			/** 服务端血压是否已存在：兼容墙钟键与 unix timestamp（BPW6 上报 time 用设备 timestamp） */
			hasServerBloodPressureAt(timeKeyOrTs) {
				if (timeKeyOrTs == null || timeKeyOrTs === '') {
					return false;
				}
				const existing = this.getExistingBloodPressureTimeSet();
				return this.buildBpw6BpDedupeKeys(timeKeyOrTs).some(k => existing.has(k));
			},
			/**
			 * 查服务端该时刻血压记录（高压/低压/脉搏）
			 * 供 BPW6：无此点则上报；有且同值才跳过；同点值变则更新上报
			 */
			lookupBpw6ServerBloodPressure(timeKeyOrTs) {
				if (timeKeyOrTs == null || timeKeyOrTs === '') {
					return null
				}
				const wantKeys = new Set(this.buildBpw6BpDedupeKeys(timeKeyOrTs))
				const serverData = this.boolserverData
				if (!serverData || !serverData.data || !serverData.data.length) {
					return null
				}
				for (let i = 0; i < serverData.data.length; i++) {
					const item = serverData.data[i]
					const details = item && item.object && item.object.details
					if (!details) {
						continue
					}
					for (let j = 0; j < details.length; j++) {
						const detail = details[j]
						const hp = detail.highPressure
						const lp = detail.lowPressure
						const hasHp = hp != null && hp !== '' && Number(hp) > 0
						const hasLp = lp != null && lp !== '' && Number(lp) > 0
						if (!(hasHp || hasLp)) {
							continue
						}
						const detailKeys = []
						if (item.dateTime && detail.time) {
							detailKeys.push(...this.buildBpw6BpDedupeKeys(
								this.normalizeDateTimeKey(`${item.dateTime} ${detail.time}`)))
						}
						if (detail.timestamp != null && detail.timestamp !== '') {
							detailKeys.push(...this.buildBpw6BpDedupeKeys(detail.timestamp))
						}
						const hit = detailKeys.some(k => wantKeys.has(k))
						if (hit) {
							return {
								highPressure: hp,
								lowPressure: lp,
								heartRate: detail.heartrate
							}
						}
					}
				}
				return null
			},
			/**
			 * BPW6 血压：先查服务端
			 * - 无此点 → 上报
			 * - 有且高压/低压/脉搏同值 → 跳过
			 * - 同点值变了 → 更新上报
			 */
			shouldSkipBpw6BpUpload(timeKeyOrTs, highPressure, lowPressure, heartRate) {
				const serverBp = this.lookupBpw6ServerBloodPressure(timeKeyOrTs)
				if (!serverBp) {
					return false
				}
				const sameHp = String(serverBp.highPressure) === String(highPressure)
				const sameLp = String(serverBp.lowPressure) === String(lowPressure)
				const localHr = heartRate == null || heartRate === '' ? '' : String(heartRate)
				const serverHr = serverBp.heartRate == null || serverBp.heartRate === '' ? '' : String(serverBp
					.heartRate)
				const sameHr = !localHr || !serverHr || localHr === serverHr
				return sameHp && sameLp && sameHr
			},
			getExistingBloodPressureTimeSet() {
				const existingTimes = new Set();
				const serverData = this.boolserverData;
				const addBpKeys = (timeKeyOrTs) => {
					this.buildBpw6BpDedupeKeys(timeKeyOrTs).forEach(k => existingTimes.add(k));
				};
				if (serverData && serverData.data && serverData.data.length > 0) {
					serverData.data.forEach(item => {
						if (item.object && item.object.details) {
							item.object.details.forEach(detail => {
								// 仅统计真正含血压的记录；同秒先上报的纯心率不能挡住血压实时上报
								const hp = detail.highPressure;
								const lp = detail.lowPressure;
								const hasHp = hp != null && hp !== '' && Number(hp) > 0;
								const hasLp = lp != null && lp !== '' && Number(lp) > 0;
								if (!(hasHp || hasLp)) {
									return;
								}
								if (item.dateTime && detail.time) {
									const wallKey = this.normalizeDateTimeKey(
										`${item.dateTime} ${detail.time}`);
									addBpKeys(wallKey);
								}
								if (detail.timestamp != null && detail.timestamp !== '') {
									addBpKeys(detail.timestamp);
								}
							});
						}
					});
				}
				return existingTimes;
			},
			getExistingHeartRateMap() {
				const existingHrMap = new Map();
				const serverData = this.boolserverData;
				if (serverData && serverData.data && serverData.data.length > 0) {
					serverData.data.forEach(item => {
						if (item.object && item.object.details) {
							item.object.details.forEach(detail => {
								if (detail.heartrate != null && detail.heartrate !== '') {
									if (item.dateTime && detail.time) {
										existingHrMap.set(this.normalizeDateTimeKey(
											`${item.dateTime} ${detail.time}`), detail.heartrate);
									}
									if (detail.timestamp != null && detail.timestamp !== '') {
										const sec = this.normalizeUnixSeconds(detail.timestamp)
										if (sec) {
											existingHrMap.set(String(sec), detail.heartrate)
											const slot = this.floorUnixToFiveMin(sec)
											if (slot) {
												existingHrMap.set(String(slot), detail.heartrate)
												existingHrMap.set(`hr5:${slot}`, detail.heartrate)
											}
										}
									}
								}
							});
						}
					});
				}
				return existingHrMap;
			},
			/**
			 * BPW6 槽位墙钟/unix → 秒：服务端按中国墙钟存，优先中国解析
			 */
			parseBpw6WallToUnixSec(wallOrTs) {
				if (wallOrTs == null || wallOrTs === '') {
					return 0
				}
				const n = Number(wallOrTs)
				if (Number.isFinite(n) && n > 1e9) {
					return this.normalizeUnixSeconds(n)
				}
				const wall = this.normalizeDateTimeKey(String(wallOrTs))
				if (!wall) {
					return 0
				}
				const chinaMs = chinaWallClockToMs(wall)
				if (Number.isFinite(chinaMs) && chinaMs > 0) {
					return Math.floor(chinaMs / 1000)
				}
				const localMs = this.parseWallClockToLocalMs(wall)
				if (Number.isFinite(localMs) && localMs > 0) {
					return Math.floor(localMs / 1000)
				}
				return 0
			},
			/** BPW6 心率 5 分钟槽去重键：unix / 中国墙钟 / 本地墙钟 */
			buildBpw6HrSlotDedupeKeys(timeKeyOrTs) {
				const keys = []
				const raw = timeKeyOrTs == null ? '' : String(timeKeyOrTs)
				if (raw) {
					keys.push(raw)
					const normalized = this.normalizeDateTimeKey(raw)
					if (normalized) {
						keys.push(normalized)
					}
				}
				const sec = this.parseBpw6WallToUnixSec(timeKeyOrTs)
				const slot = this.floorUnixToFiveMin(sec)
				if (slot) {
					keys.push(String(slot))
					keys.push(`hr5:${slot}`)
					const china = getChinaTimeAllJSON(new Date(slot * 1000))
					if (china && china.YMDHMS) {
						keys.push(this.normalizeDateTimeKey(china.YMDHMS))
					}
					const local = getLocalTimeAllJSON(new Date(slot * 1000))
					if (local && local.YMDHMS) {
						keys.push(this.normalizeDateTimeKey(local.YMDHMS))
					}
				}
				return [...new Set(keys.filter(Boolean))]
			},
			/** 查服务端是否已有该 BPW6 心率槽位数据 */
			lookupBpw6ServerHeartRate(timeKeyOrTs) {
				const map = this.getExistingHeartRateMap()
				const keys = this.buildBpw6HrSlotDedupeKeys(timeKeyOrTs)
				for (let i = 0; i < keys.length; i++) {
					if (map.has(keys[i])) {
						return map.get(keys[i])
					}
				}
				const slot = this.floorUnixToFiveMin(this.parseBpw6WallToUnixSec(timeKeyOrTs))
				if (!slot) {
					return undefined
				}
				for (const [k, v] of map.entries()) {
					const ks = this.floorUnixToFiveMin(this.parseBpw6WallToUnixSec(k))
					if (ks === slot) {
						return v
					}
				}
				const serverData = this.boolserverData
				if (serverData && serverData.data && serverData.data.length > 0) {
					for (let i = 0; i < serverData.data.length; i++) {
						const item = serverData.data[i]
						const details = item && item.object && item.object.details
						if (!details) {
							continue
						}
						for (let j = 0; j < details.length; j++) {
							const detail = details[j]
							if (detail.heartrate == null || detail.heartrate === '') {
								continue
							}
							let detailSlot = 0
							if (detail.timestamp != null && detail.timestamp !== '') {
								detailSlot = this.floorUnixToFiveMin(detail.timestamp)
							}
							if (!detailSlot && item.dateTime && detail.time) {
								detailSlot = this.floorUnixToFiveMin(this.parseBpw6WallToUnixSec(
									`${item.dateTime} ${detail.time}`))
							}
							if (detailSlot === slot) {
								return detail.heartrate
							}
						}
					}
				}
				return undefined
			},
			/**
			 * BPW6 心率：仅当服务端该 5 分钟槽已有「同值」才跳过；
			 * 服务端无此点 / 无该数据必须上报（不看本会话本地标记）
			 */
			shouldSkipBpw6HrUpload(timeKeyOrTs, hrValue) {
				const serverHr = this.lookupBpw6ServerHeartRate(timeKeyOrTs)
				if (serverHr === undefined) {
					return false
				}
				return String(serverHr) === String(hrValue)
			},
			buildOxygenTimeKey(timestamp) {
				const ts = Number(timestamp);
				if (Number.isNaN(ts) || ts <= 0) {
					return '';
				}
				return this.normalizeDateTimeKey(this.formatTimestampKey(ts));
			},
			/** 统一为秒级 unix；毫秒则 /1000 */
			normalizeUnixSeconds(ts) {
				const n = Number(ts)
				if (!Number.isFinite(n) || n <= 0) {
					return 0
				}
				return n > 1e12 ? Math.floor(n / 1000) : Math.floor(n)
			},
			/** BPW6 血氧按小时槽位对齐 */
			floorUnixToHour(ts) {
				const sec = this.normalizeUnixSeconds(ts)
				return sec > 0 ? Math.floor(sec / 3600) * 3600 : 0
			},
			/**
			 * BPW6 血氧小时槽键（手机本地墙钟 YYYY-MM-DD HH）
			 * 查询结果可能因上报 +8 编码「比现在新」：对超前 unix 按中国墙钟还原上报时的本地数字再取整点
			 */
			buildBpw6SpO2HourSlotKey(timeKeyOrTs) {
				if (timeKeyOrTs == null || timeKeyOrTs === '') {
					return ''
				}
				const raw = String(timeKeyOrTs).trim()
				// 已是小时槽键：YYYY-MM-DD HH
				const hourSlotMatch = raw.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{1,2})$/)
				if (hourSlotMatch) {
					return `${hourSlotMatch[1]} ${String(hourSlotMatch[2]).padStart(2, '0')}`
				}
				let wall = ''
				if (raw.includes('-') && (raw.includes(':') || /^\d{4}-\d{2}-\d{2}$/.test(raw))) {
					wall = this.normalizeDateTimeKey(raw.length <= 10 ? `${raw} 00:00:00` : raw)
				} else {
					const sec = this.normalizeUnixSeconds(timeKeyOrTs)
					if (!sec) {
						return ''
					}
					const nowSec = Math.floor(Date.now() / 1000)
					if (sec > nowSec + 120) {
						const china = getChinaTimeAllJSON(new Date(sec * 1000))
						wall = china && china.YMDHMS ? china.YMDHMS : ''
					} else {
						const local = getLocalTimeAllJSON(new Date(sec * 1000))
						wall = local && local.YMDHMS ? local.YMDHMS : ''
					}
				}
				if (!wall) {
					return ''
				}
				const m = String(wall).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{1,2})/)
				if (!m) {
					return ''
				}
				return `${m[1]} ${String(m[2]).padStart(2, '0')}`
			},
			/** 组装 BPW6 血氧会话去重键：含小时槽，同槽异值可覆盖 */
			collectBpw6SpO2SessionKeys(timeKeyOrTs) {
				const slot = this.buildBpw6SpO2HourSlotKey(timeKeyOrTs)
				const keys = [
					...this.collectOxygenDedupeKeys(timeKeyOrTs),
					slot
				]
				const raw = timeKeyOrTs == null ? '' : String(timeKeyOrTs).trim()
				if (raw && /^\d{4}-\d{2}-\d{2}[ T]\d{1,2}$/.test(raw)) {
					keys.push(slot || raw)
				}
				return [...new Set(keys.filter(Boolean))]
			},
			/** 查服务端同小时槽血氧值（兼容回查时间偏新于槽位） */
			lookupBpw6ServerSpO2(timeKeyOrTs) {
				const target = this.buildBpw6SpO2HourSlotKey(timeKeyOrTs)
				if (!target) {
					return undefined
				}
				const serverData = this.boolserverOxygenData
				if (!serverData || !serverData.data || !serverData.data.length) {
					return undefined
				}
				let found
				for (let i = 0; i < serverData.data.length; i++) {
					const item = serverData.data[i]
					const details = item && item.object && item.object.details
					if (!details) {
						continue
					}
					for (let j = 0; j < details.length; j++) {
						const detail = details[j]
						if (detail.oxygen == null || detail.oxygen === '') {
							continue
						}
						let slot = ''
						if (item.dateTime && detail.time) {
							slot = this.buildBpw6SpO2HourSlotKey(`${item.dateTime} ${detail.time}`)
						}
						if (!slot && detail.timestamp != null && detail.timestamp !== '') {
							slot = this.buildBpw6SpO2HourSlotKey(detail.timestamp)
						}
						if (!slot && detail.updateTime != null && detail.updateTime !== '') {
							slot = this.buildBpw6SpO2HourSlotKey(detail.updateTime)
						}
						if (slot && slot === target) {
							found = detail.oxygen
						}
					}
				}
				return found
			},
			/**
			 * BPW6 血氧：同小时槽且同值才跳过；同槽值变 / 新槽必须上报
			 * （不影响 BPW1 的 shouldSkipOxygenUpload）
			 */
			shouldSkipBpw6SpO2Upload(timeKeyOrTs, spo2Value) {
				const hourSlot = this.buildBpw6SpO2HourSlotKey(timeKeyOrTs)
				if (!hourSlot) {
					return false
				}
				const serverO2 = this.lookupBpw6ServerSpO2(hourSlot)
				if (serverO2 !== undefined && String(serverO2) === String(spo2Value)) {
					return true
				}
				return this.hasBpw6SpO2Uploaded(hourSlot, spo2Value)
			},
			/** 血氧去重键：unix/墙钟/小时槽/datatime(本地) 多形态，兼容切时区与重开 App */
			collectOxygenDedupeKeys(timeKeyOrTs) {
				const keys = this.buildBpw6BpDedupeKeys(timeKeyOrTs)
				const hour = this.floorUnixToHour(timeKeyOrTs)
				if (hour) {
					keys.push(String(hour))
					keys.push(`h:${hour}`)
				}
				const raw = timeKeyOrTs == null ? '' : String(timeKeyOrTs)
				if (raw.includes('-') && raw.includes(':')) {
					const wall = this.normalizeDateTimeKey(raw)
					const t = this.datatime(wall)
					if (t) {
						keys.push(String(t))
						const h = this.floorUnixToHour(t)
						if (h) {
							keys.push(String(h))
							keys.push(`h:${h}`)
						}
					}
				} else {
					const sec = this.normalizeUnixSeconds(timeKeyOrTs)
					if (sec) {
						keys.push(String(sec))
						const wall = this.buildOxygenTimeKey(sec)
						if (wall) {
							keys.push(wall)
							const t = this.datatime(wall)
							if (t) {
								keys.push(String(t))
							}
						}
					}
				}
				return [...new Set(keys.filter(Boolean))]
			},
			getExistingOxygenMap() {
				const existingOxygenMap = new Map();
				const setOxygen = (mapKey, oxygenVal) => {
					if (!mapKey || oxygenVal == null || oxygenVal === '') {
						return;
					}
					existingOxygenMap.set(String(mapKey), oxygenVal);
				};
				const addOxygenKeys = (timeKeyOrTs, oxygenVal) => {
					this.collectOxygenDedupeKeys(timeKeyOrTs).forEach(k => setOxygen(k, oxygenVal));
				};
				const serverData = this.boolserverOxygenData;
				if (serverData && serverData.data && serverData.data.length > 0) {
					serverData.data.forEach(item => {
						if (item.object && item.object.details) {
							item.object.details.forEach(detail => {
								// 不能用 !detail.oxygen：需保留数值 0 以外的有效血氧（如 97）
								if (detail.oxygen == null || detail.oxygen === '') {
									return;
								}
								const oxygenVal = detail.oxygen;
								if (detail.timestamp != null && detail.timestamp !== '') {
									addOxygenKeys(detail.timestamp, oxygenVal);
								}
								if (item.dateTime && detail.time) {
									const wall = this.normalizeDateTimeKey(
										`${item.dateTime} ${detail.time}`);
									addOxygenKeys(wall, oxygenVal);
									addOxygenKeys(this.datatime(wall), oxygenVal);
								}
							});
						}
					});
				}
				return existingOxygenMap;
			},
			shouldSkipOxygenUpload(item, existingOxygenMap) {
				if (!existingOxygenMap || !item) {
					return false;
				}
				const keys = [];
				if (item.dateTimeKey) {
					keys.push(...this.collectOxygenDedupeKeys(item.dateTimeKey));
				}
				if (item.timestamp != null && item.timestamp !== '') {
					keys.push(...this.collectOxygenDedupeKeys(item.timestamp));
				}
				const uniq = [...new Set(keys.filter(Boolean))];
				for (let i = 0; i < uniq.length; i++) {
					const serverO2 = existingOxygenMap.get(uniq[i]);
					if (serverO2 !== undefined && String(serverO2) === String(item.spO2)) {
						return true;
					}
				}
				// 小时槽模糊匹配：设备 unix 与服务端 time/墙钟不一致时，同小时同血氧值视为已上报
				const localHours = new Set();
				uniq.forEach(k => {
					const ks = String(k);
					if (ks.startsWith('h:')) {
						localHours.add(ks.slice(2));
						return;
					}
					const h = this.floorUnixToHour(k);
					if (h) {
						localHours.add(String(h));
					}
				});
				if (localHours.size > 0) {
					for (const [sk, sv] of existingOxygenMap.entries()) {
						if (String(sv) !== String(item.spO2)) {
							continue;
						}
						const sks = String(sk);
						const sh = sks.startsWith('h:') ? sks.slice(2) : String(this.floorUnixToHour(sk) || '');
						if (sh && localHours.has(sh)) {
							return true;
						}
					}
				}
				return false;
			},
			/** 会话心率：测量时间 ±N 秒内是否已报过同值 */
			hasSessionHrUploadedNear(timeKey, value, tolSec = 2) {
				const ts = Number(timeKey)
				if (!Number.isFinite(ts)) {
					return this.hasSessionHrUploaded(timeKey, value)
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				for (let d = -tol; d <= tol; d++) {
					if (this.hasSessionHrUploaded(String(ts + d), value)) {
						return true
					}
				}
				return false
			},
			/** 会话心率：把同值标记到测量时间 ±N 秒，避免血压时间与心率时间差 1 秒时重复报 */
			markSessionHrUploadedNear(timeKey, value, tolSec = 2) {
				const ts = Number(timeKey)
				if (!Number.isFinite(ts)) {
					this.markSessionHrUploaded(timeKey, value)
					return
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				for (let d = -tol; d <= tol; d++) {
					this.markSessionHrUploaded(String(ts + d), value)
				}
			},
			/** 会话心率去重：同测量时间且同数值才跳过（5分钟槽位内数值变化需覆盖上报） */
			hasSessionHrUploaded(timeKey, value) {
				const key = String(timeKey)
				const store = this.bpw1UploadedHrTimeSet
				if (!store) {
					return false
				}
				if (store instanceof Set) {
					return store.has(key)
				}
				if (typeof store.get !== 'function') {
					return false
				}
				const prev = store.get(key)
				return prev !== undefined && String(prev) === String(value)
			},
			markSessionHrUploaded(timeKey, value) {
				const key = String(timeKey)
				if (!this.bpw1UploadedHrTimeSet || this.bpw1UploadedHrTimeSet instanceof Set ||
					typeof this.bpw1UploadedHrTimeSet.set !== 'function') {
					this.bpw1UploadedHrTimeSet = new Map()
				}
				this.bpw1UploadedHrTimeSet.set(key, value)
			},
			unmarkSessionHrUploaded(timeKey) {
				const key = String(timeKey)
				const store = this.bpw1UploadedHrTimeSet
				if (!store) {
					return
				}
				if (store instanceof Set || typeof store.delete === 'function') {
					store.delete(key)
				}
			},
			unmarkSessionHrUploadedNear(timeKey, tolSec = 2) {
				const ts = Number(timeKey)
				if (!Number.isFinite(ts)) {
					this.unmarkSessionHrUploaded(timeKey)
					return
				}
				const tol = Math.max(0, Number(tolSec) || 0)
				for (let d = -tol; d <= tol; d++) {
					this.unmarkSessionHrUploaded(String(ts + d))
				}
			},
			/** 会话血氧去重：同测量时间且同数值才跳过（60分钟槽位内数值变化需覆盖上报） */
			hasSessionSpO2Uploaded(timeKey, value) {
				const key = String(timeKey)
				const store = this.bpw1UploadedSpO2TimeSet
				if (!store) {
					return false
				}
				if (store instanceof Set) {
					return store.has(key)
				}
				if (typeof store.get !== 'function') {
					return false
				}
				const prev = store.get(key)
				return prev !== undefined && String(prev) === String(value)
			},
			markSessionSpO2Uploaded(timeKey, value) {
				const key = String(timeKey)
				if (!this.bpw1UploadedSpO2TimeSet || this.bpw1UploadedSpO2TimeSet instanceof Set ||
					typeof this.bpw1UploadedSpO2TimeSet.set !== 'function') {
					this.bpw1UploadedSpO2TimeSet = new Map()
				}
				this.bpw1UploadedSpO2TimeSet.set(key, value)
			},
			unmarkSessionSpO2Uploaded(timeKey) {
				const key = String(timeKey)
				const store = this.bpw1UploadedSpO2TimeSet
				if (!store) {
					return
				}
				if (store instanceof Set || typeof store.delete === 'function') {
					store.delete(key)
				}
			},
			getExistingOxygenTimeSet() {
				return new Set(this.getExistingOxygenMap().keys());
			},
			/** BPW6 血压去重键：同时收录 unix 秒与墙钟字符串，避免实时/历史两条路径键不一致 */
			buildBpw6BpDedupeKeys(timeKeyOrTs) {
				const keys = []
				if (timeKeyOrTs == null || timeKeyOrTs === '') {
					return keys
				}
				const raw = String(timeKeyOrTs)
				keys.push(raw)
				const num = Number(timeKeyOrTs)
				if (Number.isFinite(num) && num > 1000000000) {
					keys.push(String(Math.floor(num)))
					const formatted = this.formatTimestampKey(num)
					if (formatted) {
						const normalized = this.normalizeDateTimeKey(formatted)
						keys.push(normalized)
						keys.push(String(this.datatime(normalized)))
					}
				} else {
					const normalized = this.normalizeDateTimeKey(raw)
					if (normalized) {
						keys.push(normalized)
						keys.push(String(this.datatime(normalized)))
					}
				}
				return [...new Set(keys.filter(Boolean))]
			},
			hasBpw6BpUploaded(timeKeyOrTs) {
				if (!this.bpw6UploadedBpKeySet) {
					return false
				}
				return this.buildBpw6BpDedupeKeys(timeKeyOrTs).some(k => this.bpw6UploadedBpKeySet.has(k))
			},
			markBpw6BpUploaded(...timeKeyOrTsList) {
				if (!this.bpw6UploadedBpKeySet) {
					this.bpw6UploadedBpKeySet = new Set()
				}
				timeKeyOrTsList.forEach(item => {
					this.buildBpw6BpDedupeKeys(item).forEach(k => this.bpw6UploadedBpKeySet.add(k))
				})
			},
			unmarkBpw6BpUploaded(...timeKeyOrTsList) {
				if (!this.bpw6UploadedBpKeySet) {
					return
				}
				timeKeyOrTsList.forEach(item => {
					this.buildBpw6BpDedupeKeys(item).forEach(k => this.bpw6UploadedBpKeySet.delete(k))
				})
			},
			/** BPW6 血氧会话去重：同测量(unix/墙钟/小时槽多键)且同数值才跳过；持久化防重开 App 重复上报 */
			ensureBpw6SpO2Map() {
				if (this.bpw6UploadedSpO2Map) {
					return this.bpw6UploadedSpO2Map
				}
				const map = new Map()
				try {
					const raw = uni.getStorageSync('bpw6_uploaded_spo2_map')
					if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
						Object.keys(raw).forEach(k => {
							map.set(k, raw[k])
						})
					}
				} catch (e) {}
				this.bpw6UploadedSpO2Map = map
				return map
			},
			persistBpw6SpO2Map() {
				const map = this.bpw6UploadedSpO2Map
				if (!map) {
					return
				}
				const entries = Array.from(map.entries())
				const sliced = entries.length > 800 ? entries.slice(entries.length - 800) : entries
				const obj = {}
				sliced.forEach(([k, v]) => {
					obj[k] = v
				})
				try {
					uni.setStorageSync('bpw6_uploaded_spo2_map', obj)
				} catch (e) {}
			},
			hasBpw6SpO2Uploaded(timeKeyOrTs, value) {
				const map = this.ensureBpw6SpO2Map()
				const uniq = this.collectBpw6SpO2SessionKeys(timeKeyOrTs)
				for (let i = 0; i < uniq.length; i++) {
					const prev = map.get(uniq[i])
					if (prev !== undefined && String(prev) === String(value)) {
						return true
					}
				}
				return false
			},
			markBpw6SpO2Uploaded(value, ...timeKeyOrTsList) {
				const map = this.ensureBpw6SpO2Map()
				timeKeyOrTsList.forEach(item => {
					this.collectBpw6SpO2SessionKeys(item).forEach(k => map.set(k, value))
				})
				this.persistBpw6SpO2Map()
			},
			async uploadBPW6BpHistoryWithDeduplication(deviceId, deviceSn) {
				const that = this;
				if (that.bpw6BpHistoryUploading) {
					console.log('BPW6血压历史上报进行中，跳过重复触发');
					return;
				}
				that.bpw6BpHistoryUploading = true;
				try {
					await that.queryBloodPressureDataAsync(that.deviceSnuserID);
					const existingTimes = that.getExistingBloodPressureTimeSet();
					// 历史上报正序：旧→新
					const localBpRecords = [...that.bpw6BpBuffer].sort((a, b) => that.datatime(a.dateTimeKey) - that
						.datatime(b.dateTimeKey)
					);
					const uploadedKeys = new Set();
					let uploadedCount = 0
					let skippedCount = 0
					for (let i = 0; i < localBpRecords.length; i++) {
						const bp = localBpRecords[i];
						const key = that.normalizeDateTimeKey(bp.dateTimeKey);
						const recordTs = Number(bp.recordTs);
						const hasRecordTs = Number.isFinite(recordTs) && recordTs > 0 && recordTs !== 0xFFFFFFFF;
						// 历史上报同样优先用设备血压 timestamp
						const timeTs = hasRecordTs ? recordTs : that.datatime(key);
						const sessionTsKey = String(timeTs);
						// 本会话已实时上报/占位：跳过，避免实时(手机时间)与历史(设备时间)双报
						const realtimeKey = that.bpw6RealtimeUploadKey ?
							that.normalizeDateTimeKey(that.bpw6RealtimeUploadKey) : ''
						if (that.hasBpw6BpUploaded(key) || that.hasBpw6BpUploaded(timeTs) ||
							(hasRecordTs && that.hasBpw6BpUploaded(recordTs)) ||
							(realtimeKey && (realtimeKey === key ||
								that.buildBpw6BpDedupeKeys(that.bpw6RealtimeUploadKey).some(k =>
									k === key || k === sessionTsKey)))) {
							that.markBpw6BpUploaded(key, timeTs, hasRecordTs ? recordTs : '');
							skippedCount++
							continue;
						}
						// 以服务端为准：查询没有则必须上报
						const onServer = existingTimes.has(key) || existingTimes.has(sessionTsKey) ||
							that.hasServerBloodPressureAt(key) ||
							that.hasServerBloodPressureAt(timeTs) ||
							(hasRecordTs && that.hasServerBloodPressureAt(recordTs));
						if (onServer) {
							that.markBpw6BpUploaded(key, timeTs, hasRecordTs ? recordTs : '');
							skippedCount++
							continue;
						}
						// 仅防本批循环内重复
						if (uploadedKeys.has(key) || uploadedKeys.has(sessionTsKey)) {
							skippedCount++
							continue;
						}
						uploadedKeys.add(key);
						uploadedKeys.add(sessionTsKey);
						if (uploadedCount > 0) {
							await new Promise(resolve => setTimeout(resolve, 10))
						}
						await that.Watch_Historical_data(
							deviceId,
							bp.highPressure,
							bp.lowPressure,
							bp.heartRate,
							deviceSn,
							timeTs, {
								bypassSessionDedupe: true,
								// 与实时一致：time 原样用设备 timestamp
								rawDeviceTimestamp: true
							}
						);
						that.markBpw6BpUploaded(key, timeTs, hasRecordTs ? recordTs : '');
						uploadedCount++
					}
					that.bpw6BpBuffer = [];
				} finally {
					that.bpw6BpHistoryUploading = false;
				}
			},
			// BPW6 心率：同5分钟槽位（相同 timestamp）保留最新测量值
			normalizeBPW6HeartRateList(allList) {
				if (!allList || !allList.length) {
					return [];
				}
				const hrByTimestamp = new Map();
				for (const item of allList) {
					const prev = hrByTimestamp.get(item.timestamp);
					if (!prev) {
						hrByTimestamp.set(item.timestamp, item);
						continue;
					}
					const prevUpdate = prev.updateTime || 0;
					const itemUpdate = item.updateTime || 0;
					if (itemUpdate >= prevUpdate) {
						hrByTimestamp.set(item.timestamp, item);
					}
				}
				return Array.from(hrByTimestamp.values()).sort((a, b) => a.timestamp - b.timestamp);
			},
			// BPW6 血氧：同60分钟槽位（相同 timestamp）保留最新测量值
			normalizeBPW6SpO2List(allList) {
				if (!allList || !allList.length) {
					return [];
				}
				const spO2ByTimestamp = new Map();
				for (const item of allList) {
					const prev = spO2ByTimestamp.get(item.timestamp);
					if (!prev) {
						spO2ByTimestamp.set(item.timestamp, item);
						continue;
					}
					const prevUpdate = prev.updateTime || 0;
					const itemUpdate = item.updateTime || 0;
					if (itemUpdate >= prevUpdate) {
						spO2ByTimestamp.set(item.timestamp, item);
					}
				}
				return Array.from(spO2ByTimestamp.values()).sort((a, b) => a.timestamp - b.timestamp);
			},
			/**
			 * 取当天（本地）且不超过当前小时的最新整点血氧
			 * 避免 00:00 后仍落到昨日 23 点槽位，把卡片日期留在前一天
			 */
			pickLatestBPW6SpO2(list) {
				if (!list || !list.length) {
					return null;
				}
				const now = new Date();
				const currentHour = now.getHours();
				const todayStart = Math.floor(new Date(
					now.getFullYear(), now.getMonth(), now.getDate()
				).getTime() / 1000);
				const todayEnd = todayStart + 24 * 3600;
				const todayItems = list.filter(item => {
					const ts = Number(item && item.timestamp) || 0;
					return ts >= todayStart && ts < todayEnd;
				});
				const base = todayItems.length ? todayItems : list;
				const notFuture = base.filter(item => {
					if (item == null || item.hour == null || item.hour === '') {
						return true;
					}
					return Number(item.hour) <= currentHour;
				});
				const pool = notFuture.length ? notFuture : base;
				return pool.reduce((best, item) => {
					if (!best) {
						return item;
					}
					const bestTs = Number(best.timestamp) || 0;
					const itemTs = Number(item.timestamp) || 0;
					if (itemTs > bestTs) {
						return item;
					}
					if (itemTs === bestTs && Number(item.hour) > Number(best.hour || -1)) {
						return item;
					}
					return best;
				}, null);
			},
			// BPW6 心率历史去重上传（旧→新串行，最新一条由 jakoblife_fat_scale22 单独上报）；每条间隔 10ms
			async uploadBPW6HrHistoryWithDeduplication(deviceId, deviceSn) {
				const that = this;
				await that.queryBloodPressureDataAsync(that.deviceSnuserID);
				// 历史上报正序：旧→新
				const localHrRecords = [...that.bpw6HrBuffer].sort((a, b) => that.datatime(a.dateTimeKey) - that
					.datatime(b.dateTimeKey)
				);
				const uploadedKeys = new Set();
				let uploadedCount = 0
				for (const hr of localHrRecords) {
					const key = that.normalizeDateTimeKey(hr.dateTimeKey);
					if (uploadedKeys.has(key)) {
						continue;
					}
					const slotTs = that.floorUnixToFiveMin(that.parseBpw6WallToUnixSec(key)) ||
						that.datatime(key)
					// 仅服务端同槽同值才跳过；无此点必须上报（忽略本会话标记）
					if (that.shouldSkipBpw6HrUpload(slotTs, hr.heartRate) ||
						that.shouldSkipBpw6HrUpload(key, hr.heartRate)) {
						console.log('BPW6心率服务端已存在，跳过:', key, {
							slotTs,
							localHr: hr.heartRate
						});
						continue;
					}
					uploadedKeys.add(key);
					console.log('上传BPW6心率:', key, {
						hr: hr.heartRate,
						slotTs
					});
					if (uploadedCount > 0) {
						await new Promise(resolve => setTimeout(resolve, 10))
					}
					await that.Watch_Historical_data(
						deviceId,
						'',
						'',
						hr.heartRate,
						deviceSn,
						slotTs || that.datatime(key), {
							bypassSessionDedupe: true
						}
					);
					uploadedCount++
				}
				that.bpw6HrBuffer = [];
			},
			// 血氧数据查询，历史上报都需要根据device_sn查询数据
			queryOxygenData(deviceSn) {
				const {
					startTime,
					endTime
				} = this.buildDeviceDataQueryRange(30)
				let data = {
					deviceSn: deviceSn || this.deviceSnuserID,
					dataType: "pressure",
					slaveList: [{
						slaveSn: "0",
						register: "oxygen"
					}],
					startTime: startTime,
					endTime: endTime,
				};
				// console.log("血氧数据历史记录参数", data)
				return this.$post(this.$url_APP_IP + this.$url_query_log_v2, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((queryOxygenDatares) => {
					if (queryOxygenDatares.code === 200) {
						// console.log("血氧数据历史记录接口返回的查询数据", queryOxygenDatares)
						this.boolserverOxygenData = queryOxygenDatares
					}
					return queryOxygenDatares
				})
			},
			/** BPW1 历史心率：对照服务端去重上报 */
			uploadBPW1HrHistoryWithDeduplication(localHrRecords, deviceId, deviceSn) {
				const that = this
				// 先按时间点去重，避免 pending 里重复条目刷屏
				const uniqueMap = new Map();
				(localHrRecords || []).forEach(hr => {
					const key = that.normalizeDateTimeKey(`${hr.date} ${hr.time}`)
					uniqueMap.set(key, hr)
				})
				const uniqueRecords = Array.from(uniqueMap.values())
				const batchKey = JSON.stringify(uniqueRecords.map(hr =>
					`${hr.date} ${hr.time} ${hr.heartRate != null ? hr.heartRate : hr.diastolic}`))
				if (!that._bpw1HrHistoryBatchKeySet) {
					that._bpw1HrHistoryBatchKeySet = new Set()
				}
				if (that._bpw1HrHistoryBatchKeySet.has(batchKey)) {
					return
				}
				that._bpw1HrHistoryBatchKeySet.add(batchKey)
				const uploadMac = (that.shoubiaomac && that.shoubiaomac !== '0') ? that.shoubiaomac : deviceId
				const uploadSn = (that.shoubiaosn && that.shoubiaosn !== '0') ? that.shoubiaosn : deviceSn
				const existingHrMap = that.getExistingHeartRateMap()
				const existingBpTimes = that.getExistingBloodPressureTimeSet();
				let skipped = 0
				// 历史上报正序：旧→新
				uniqueRecords.sort((a, b) => that.datatime(`${a.date} ${a.time}`) - that.datatime(
					`${b.date} ${b.time}`))
				const deferUpload = that.isBPW1HistorySyncingOrGrace()
				const readyUploads = []
				uniqueRecords.forEach(hr => {
					const key = that.normalizeDateTimeKey(`${hr.date} ${hr.time}`)
					const timeTs = String(that.datatime(key))
					const hrVal = hr.heartRate != null ? hr.heartRate : hr.diastolic
					const serverHr = existingHrMap.get(key)
					if (serverHr !== undefined && String(serverHr) === String(hrVal)) {
						skipped++
						return
					}
					// 服务端该时刻已有血压记录时，心率一般已一并存在，避免重复（含±3秒）
					if (existingBpTimes.has(key) || that.hasServerBloodPressureAt(key) ||
						that.isDateTimeKeyNearSet(key, existingBpTimes, 3)) {
						skipped++
						return
					}
					if (that.hasSessionHrUploadedNear(timeTs, hrVal, 3) ||
						that.hasBPW1BpUploadedNearTs(timeTs, 3) ||
						(that._bpw1DeferredBpTimeSet && that._bpw1DeferredBpTimeSet.has(timeTs))) {
						skipped++
						return
					}
					console.log('上传BPW1历史心率:', key, hrVal)
					const uploadItem = {
						kind: 'hr',
						deviceId: uploadMac,
						deviceSn: uploadSn,
						high: '',
						low: '',
						hr: hrVal,
						timess: that.datatime(key),
						opts: {}
					}
					if (deferUpload) {
						that.enqueueBPW1DeferredHistoryUpload(uploadItem)
					} else {
						readyUploads.push(uploadItem)
					}
				})
				if (skipped) {
					console.log(`BPW1历史心率去重：跳过${skipped}条`)
				}
				if (!deferUpload && readyUploads.length) {
					that.flushBPW1HistoryUploadList(readyUploads)
				}
			},
			/** BPW1 历史血氧：对照服务端去重上报 */
			uploadBPW1SpO2HistoryWithDeduplication(localSpO2Records, deviceId, deviceSn) {
				const that = this
				const batchKey = JSON.stringify((localSpO2Records || []).map(item =>
					`${item.dateTimeKey || (item.date + ' ' + item.time)} ${item.spO2}`))
				if (!that._bpw1SpO2HistoryBatchKeySet) {
					that._bpw1SpO2HistoryBatchKeySet = new Set()
				}
				if (that._bpw1SpO2HistoryBatchKeySet.has(batchKey)) {
					return
				}
				that._bpw1SpO2HistoryBatchKeySet.add(batchKey)
				const uploadMac = (that.shoubiaomac && that.shoubiaomac !== '0') ? that.shoubiaomac : deviceId
				const uploadSn = (that.shoubiaosn && that.shoubiaosn !== '0') ? that.shoubiaosn : deviceSn
				const existingOxygenMap = that.getExistingOxygenMap();
				let skipped = 0;
				// 历史上报正序：旧→新
				const spo2Records = [...(localSpO2Records || [])].sort((a, b) => {
					const keyA = that.normalizeDateTimeKey(a.dateTimeKey || `${a.date} ${a.time}`)
					const keyB = that.normalizeDateTimeKey(b.dateTimeKey || `${b.date} ${b.time}`)
					return that.datatime(keyA) - that.datatime(keyB)
				})
				const deferUpload = that.isBPW1HistorySyncingOrGrace()
				const readyUploads = []
				spo2Records.forEach(item => {
					const key = that.normalizeDateTimeKey(item.dateTimeKey || `${item.date} ${item.time}`)
					const timeTs = String(that.datatime(key))
					const oxygenItem = {
						dateTimeKey: key,
						spO2: item.spO2,
						timestamp: timeTs
					}
					if (that.shouldSkipOxygenUpload(oxygenItem, existingOxygenMap)) {
						skipped++
						return
					}
					if (that.hasSessionSpO2Uploaded(timeTs, item.spO2)) {
						skipped++
						return
					}
					console.log('上传BPW1历史血氧:', key, item.spO2)
					const uploadItem = {
						kind: 'spo2',
						deviceId: uploadMac,
						deviceSn: uploadSn,
						spo2: item.spO2,
						timess: that.datatime(key)
					}
					if (deferUpload) {
						that.enqueueBPW1DeferredHistoryUpload(uploadItem)
					} else {
						readyUploads.push(uploadItem)
					}
				})
				if (skipped) {
					console.log(`BPW1历史血氧去重：跳过${skipped}条`)
				}
				if (!deferUpload && readyUploads.length) {
					that.flushBPW1HistoryUploadList(readyUploads)
				}
			},
			// BPW6 血氧不上报历史：仅 DATA_CHANGED 实时最新整点；保留方法避免旧调用报错
			async uploadBPW6SpO2HistoryWithDeduplication() {
				console.log('BPW6血氧跳过历史上报');
				this.bpw6SpO2Buffer = [];
			},
			BPW6paredata(data, deviceId, deviceSn) {
				let that = this
				if (Array.isArray(data)) {
					const hasMeasurementComplete = data.some(
						item => item?.type === 'ppg_measurement_complete' && item.success
					)
					data.forEach(item => {
						if (!item) return
						// 定时测量结束：BC 58 + BC 4B 同包到达，只由 0x58 触发拉取
						if (hasMeasurementComplete &&
							item.type === 'ppg_command' &&
							item.cmd === 0x4B &&
							item.success) {
							console.log('【BPW6】跳过同包内 0x4B 通知，已由 0x58 触发拉取')
							return
						}
						that.BPW6paredata(item, deviceId, deviceSn)
					})
					return
				}
				if (!data || !data.type) {
					return;
				}
				uni.setStorageSync("BPW6devicemac", deviceId)
				// console.log("[BPW6设备数据]", data)
				switch (data.type) {
					case 'heartRate': {
						if (!data.allList || data.allList.length === 0) {
							break;
						}
						const dedupedHrList = that.normalizeBPW6HeartRateList(data.allList);
						const latestHr = dedupedHrList[dedupedHrList.length - 1];
						const latestHrTimeKey = that.formatTimestampKey(latestHr.timestamp);
						that.bpw6HrBuffer = dedupedHrList.map(item => ({
							dateTimeKey: that.formatTimestampKey(
								item.timestamp
							),
							heartRate: item.value
						})).filter(hr => {
							if (hr.dateTimeKey === latestHrTimeKey) {
								return false;
							}
							return true;
						});
						let heartRateDatatime = that.datatime(latestHrTimeKey)
						console.log('心率数据时间:', latestHrTimeKey);
						console.log('心率数据时间:', heartRateDatatime);
						// 血压历史同步期间只上报，不刷首页卡片（避免切表绑定时来回跳）
						if (!that.bpw6BpHistorySyncing) {
							// 用设备时间戳与接口比新旧；同槽允许覆盖（值可能更新）
							const deviceHrTs = that.toUnixSeconds(latestHr.timestamp) || heartRateDatatime
							const homeHrCandidate = deviceHrTs || Math.floor(Date.now() / 1000)
							const serverHrTs = that.toUnixSeconds(uni.getStorageSync('pulse_server_ts') || 0)
							const storedPulse = uni.getStorageSync('pulse')
							let allowHomeHr = that.canUpdateHomeHrByNewestTime(homeHrCandidate, {
								allowBpw6SameSlot: true
							})
							// 同槽接口已刷成新值且非刚测：勿用历史旧值盖掉首页
							if (allowHomeHr && serverHrTs > 0 && that.xeuyabiaoshi !== '1' &&
								that.isSameBpw6HrSlot(homeHrCandidate, serverHrTs) &&
								that.isRecipeDisplayMismatch(latestHr.value, storedPulse)) {
								allowHomeHr = false
							}
							if (allowHomeHr) {
								that.pulse = latestHr.value
								that.xeuyabiaoshi = "1"
								uni.setStorageSync("pulse", latestHr.value)
								that.updateHeartRateCardLocal(latestHr.value, homeHrCandidate);
								setTimeout(() => {
									that.cardeditData(that.list, "bloodData")
								}, 500)
							}
						}
						// 5分钟槽位：仅服务端同槽同值才跳过；无此点必须实时上报
						uni.getNetworkType({
							success: async function(res) {
								if (res.networkType !== 'none') {
									await that.queryBloodPressureDataAsync(that.deviceSnuserID);
									const slotTs = that.floorUnixToFiveMin(latestHr.timestamp) ||
										that.toUnixSeconds(latestHr.timestamp) || heartRateDatatime
									if (that.shouldSkipBpw6HrUpload(slotTs, latestHr.value)) {
										console.log('BPW6心率服务端同槽同值已存在，跳过实时上报:', slotTs,
											latestHr.value);
									} else {
										console.log('BPW6心率实时上报(服务端无此点或值已变):', slotTs, {
											hr: latestHr.value
										});
										await that.jakoblife_fat_scale22(
											deviceId,
											"",
											"",
											latestHr.value,
											deviceSn,
											slotTs, {
												bypassSessionDedupe: true
											}
										);
									}
									await that.uploadBPW6HrHistoryWithDeduplication(deviceId, deviceSn);
									// 不上报后立刻 get_device_info：由 jakoblife_fat_scale22 延迟刷新，
									// 且 xeuyabiaoshi 会保护本地 pulsetime，避免卡片时间被旧 updateTime 盖掉
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
						break;
					}
					case 'BP_MEASUREMENT':
						console.log('手动点击测量血压/心率/血氧');
						break;
					case 'BP_SUCCES':
						// 手表完成实时血压测量，清空缓冲以便下一条作为最新数据
						that.bpw6BpBuffer = []
						that.bpw6RealtimeUploadKey = ''
						that.bpw6RealtimeBpPending = true
						console.log('【BPW6】手环完成血压测量，等待实时数据');
						break;
					case 'dataupdate':
						// 实时血压更新通知（非连接历史同步）
						if (data.dataType === DATA_TYPE.BLOOD_PRESSURE && !that.bpw6BpHistorySyncing) {
							// 已在实时测量窗口内：勿再清空缓冲/占位，否则同一次测量会二次走实时上报
							if (!that.bpw6RealtimeBpPending && !that.bpw6RealtimeUploadKey) {
								that.bpw6BpBuffer = []
								that.bpw6RealtimeUploadKey = ''
							}
							that.bpw6RealtimeBpPending = true
						}
						// 实时血氧更新通知：标记后最新一条按手机本地时间上报
						if (data.dataType === DATA_TYPE.BLOOD_OXYGEN) {
							that.bpw6RealtimeSpO2Pending = true
						}
						break;
					case 'SpO2_MEASUREMENT':
						that.bpw6RealtimeSpO2Pending = true
						break;
					case 'HR_history_empty':
						break;
					case 'HR_history_index':
					case 'heartRate1':
						// 心率历史索引包，等待数据包
						break;
					case 'bp_dynamic_params':
						that.handleBPDynamicParams(data, 'read')
						break;
					case 'bp_dynamic_params_changed':
						that.handleBPDynamicParams(data, 'notify')
						break;
					case 'ppg_command':
						that.handleBPW6PPGData(data, deviceId, deviceSn, 'command')
						break;
					case 'ppg_measurement_complete':
						that.handleBPW6PPGData(data, deviceId, deviceSn, 'measurement_complete')
						break;
					case 'ppg_size':
						that.handleBPW6PPGData(data, deviceId, deviceSn, 'size')
						break;
					case 'ppg_chunk':
					case 'ppg_data_chunk':
						that.handleBPW6PPGData(data, deviceId, deviceSn, 'chunk')
						break;
					case 'ppg_chunk_error':
						that.handleBPW6PPGData(data, deviceId, deviceSn, 'chunk_error')
						break;
					case 'ppg_data':
					case 'ppg_data_complete':
						that.handleBPW6PPGData(data, deviceId, deviceSn, 'complete')
						break;
					case 'BPdata': {
						const recordTs = Number(data.timestamp)
						const hasRecordTs = Number.isFinite(recordTs) && recordTs > 0 && recordTs !== 0xFFFFFFFF
						const recordTimeKey = hasRecordTs ? that.formatTimestampKey(recordTs) : ((data.date && data.date
							.formatted) ? data.date.formatted : that.getTimeAllJSON().YMDHMS)
						const normalizedKey = that.normalizeDateTimeKey(recordTimeKey)
						// 实时/历史血压：上报 time 均用设备返回的测量时间（无则墙钟）
						const uploadTs = hasRecordTs ? recordTs : that.datatime(normalizedKey)
						const isNewestRecord = that.bpw6BpBuffer.length === 0;
						const isRealtimeMeasure = that.bpw6RealtimeBpPending && !that.bpw6BpHistorySyncing
						that.bpw6BpBuffer.push({
							dateTimeKey: recordTimeKey,
							recordTs: hasRecordTs ? recordTs : null,
							highPressure: data.systolic,
							lowPressure: data.diastolic,
							heartRate: data.pulse
						});
						// 历史/重连读数只缓存上报；首页血压与卡片仅实时测量或接口刷新
						if (!isRealtimeMeasure) {
							break;
						}
						// 同一次测量已占位/上报过：只入缓冲，不再二次实时上报
						if (that.hasBpw6BpUploaded(normalizedKey) ||
							(hasRecordTs && that.hasBpw6BpUploaded(recordTs)) ||
							(that.bpw6RealtimeUploadKey && that.buildBpw6BpDedupeKeys(that.bpw6RealtimeUploadKey)
								.some(k => k === normalizedKey || (hasRecordTs && k === String(recordTs))))) {
							break;
						}
						// 设备按新→旧推送，实时测量时首页只展示最新一条（且须不早于接口）
						if (isNewestRecord) {
							const bpTs = uploadTs
							if (that.canUpdateHomeBpByNewestTime(bpTs)) {
								that.applyHomeBloodPressure(data.diastolic, data.systolic, bpTs)
							}
							that.pulse = data.pulse
							uni.setStorageSync("pulse", data.pulse)
							// 血压结果带脉搏：刷新心率卡片；BPW6 存 5 分钟槽位戳，避免 now 压过接口同槽 updateTime
							that.xeuyabiaoshi = "1"
							const hrCardTs = that.isBpw6HrSlotDevice() ?
								(that.floorUnixToFiveMin(hasRecordTs ? recordTs : uploadTs) || uploadTs) :
								uploadTs
							that.updateHeartRateCardLocal(data.pulse, hrCardTs)
							setTimeout(() => {
								that.cardeditData(that.list, "bloodData")
							}, 500)
							uni.getNetworkType({
								success: function(res) {
									if (res.networkType === 'none') {
										if (that.QX_HIDE) {
											that.bgaaa(data.diastolic, data.systolic)
										}
										that.updateBloodPressureStatus(
											data.diastolic,
											data.systolic
										);
									}
								},
								fail: function(err) {
									console.error('获取网络类型失败：', err);
								}
							});
							// 同步占位：历史批量跳过本条，避免与实时异步上报竞态双报
							that.bpw6RealtimeUploadKey = normalizedKey
							that.markBpw6BpUploaded(normalizedKey, uploadTs, hasRecordTs ? recordTs : '')
							// 实时：查重后上报；仅实时测量启动 PPG
							uni.getNetworkType({
								success: async function(res) {
									if (res.networkType === 'none') {
										that.unmarkBpw6BpUploaded(normalizedKey, uploadTs, hasRecordTs ?
											recordTs : '')
										that.bpw6RealtimeUploadKey = ''
										that.bpw6RealtimeBpPending = false
										return;
									}
									try {
										await that.queryBloodPressureDataAsync(that.deviceSnuserID);
										// 以服务端为准：查询没有则必须上报
										const alreadyUploaded =
											that.hasServerBloodPressureAt(normalizedKey) ||
											that.hasServerBloodPressureAt(uploadTs)
										if (alreadyUploaded) {
											console.log('BPW6血压服务端已存在，跳过实时上报:', normalizedKey,
												uploadTs);
											that.markBpw6BpUploaded(normalizedKey, uploadTs, hasRecordTs ?
												recordTs : '')
										} else {
											await that.jakoblife_fat_scale22(
												deviceId,
												data.systolic,
												data.diastolic,
												data.pulse,
												deviceSn,
												uploadTs, {
													bypassSessionDedupe: true,
													// BPW6 实时血压：time 原样用设备 timestamp，不再经 china 墙钟重编码
													rawDeviceTimestamp: true
												}
											);
											that.markBpw6BpUploaded(normalizedKey, uploadTs, hasRecordTs ?
												recordTs : '')
										}
										// 实时血压 / 24h·7d 动态血压：拿到数据后延时 20s 再发 PPG，按钮置灰与恢复一致
										if (that.isYaliSwitchHerOn()) {
											that.prepareBpw6PpgAfterBpButtonLock()
											setTimeout(() => {
												that.startBpw6PpgAfterBpMeasurement(deviceId)
											}, 20000)
										}
									} catch (err) {
										that.unmarkBpw6BpUploaded(normalizedKey, uploadTs, hasRecordTs ?
											recordTs : '')
										that.bpw6RealtimeUploadKey = ''
										console.error('BPW6血压实时上报失败：', err);
									} finally {
										that.bpw6RealtimeBpPending = false
									}
								},
								fail: function(err) {
									that.unmarkBpw6BpUploaded(normalizedKey, uploadTs, hasRecordTs ? recordTs :
										'')
									that.bpw6RealtimeUploadKey = ''
									that.bpw6RealtimeBpPending = false
									console.error('获取网络类型失败：', err);
								}
							});
						}
						break;
					}
					case 'BP_history_empty':
						that.bpw6BpHistorySyncing = false
						uni.getNetworkType({
							success: function(res) {
								if (res.networkType !== 'none') {
									that.uploadBPW6BpHistoryWithDeduplication(deviceId, deviceSn);
								}
							},
							fail: function(err) {
								console.error('获取网络类型失败：', err);
							}
						});
						break;
					case 'oxygen': {
						if (!data.dataarray || !Array.isArray(data.dataarray) || data.dataarray.length === 0) {
							break;
						}
						const dedupedSpO2List = that.normalizeBPW6SpO2List(data.dataarray);
						// DATA_CHANGED 拉全日槽位仅取最新整点实时上报；不上报历史槽位
						that.bpw6RealtimeSpO2Pending = false
						const latestSpO2 = that.pickLatestBPW6SpO2(dedupedSpO2List);
						if (!latestSpO2) {
							break;
						}
						const latestSpO2TimeKey = that.buildOxygenTimeKey(latestSpO2.timestamp);
						const oxygenDatatime = that.datatime(latestSpO2TimeKey);
						that.bpw6SpO2Buffer = []
						const xueyang = latestSpO2.spO2;
						that.oxygenbiaoshi = "1"
						// 上报用手机本地时间；每次测量上报最新整点，历史上报不上
						const uploadTs = that.resolveRealtimeUploadTimeSec()
						const cardTs = Math.floor(Date.now() / 1000)
						// 强制刷新首页：不被接口偏新时间挡住
						that.storeOxygenData({
							diastolic: xueyang
						}, cardTs, {
							force: true
						});
						const cardLabel = that.resolveHomeOxygenCardDateLabel(cardTs, {
							forcePhoneLocal: true
						})
						that.applyHomeOxygenCardDate(cardLabel)
						that.list = that.list.slice()
						uni.setStorageSync('kapianlist', that.list)
						setTimeout(() => {
							that.cardeditData(that.list, "bloodData")
						}, 500)
						uni.getNetworkType({
							success: async (res) => {
								if (res.networkType !== 'none') {
									const hourSlot = this.buildBpw6SpO2HourSlotKey(latestSpO2
										.timestamp) || this.buildBpw6SpO2HourSlotKey(
										latestSpO2TimeKey)
									// 每次测量都上报最新整点；历史上报已禁用；不按同槽同值跳过
									console.log('BPW6血氧实时上报最新:', uploadTs, {
										spO2: latestSpO2.spO2,
										hour: latestSpO2.hour,
										hourSlot,
										timestamp: latestSpO2.timestamp,
										cardLabel
									});
									await this.jakoblife_fat_scale3(
										deviceId,
										latestSpO2.spO2,
										deviceSn,
										'血氧',
										uploadTs, {
											bypassSessionDedupe: true
										}
									);
									this.markBpw6SpO2Uploaded(
										latestSpO2.spO2,
										latestSpO2.timestamp,
										latestSpO2TimeKey,
										oxygenDatatime,
										hourSlot
									);
								}
							},
							fail: (err) => {
								console.error('获取网络类型失败：', err);
							}
						});
						break;
					}
					case 'SpO2_history_empty':
						that.bpw6SpO2Buffer = []
						break;
					case 'activity': {
						const activityMd = that.activityDateToMd(data)
						const todayMd = that.normalizeStepsMd(that.getPhoneLocalCardMD())
						const daysAgoNum = Number(data.daysAgo)
						const isTodayActivity = Number.isFinite(daysAgoNum) ? daysAgoNum === 0 : (that
							.normalizeStepsMd(activityMd) === todayMd)
						const stepsNum = parseInt(data.steps, 10)
						// 历史天：仅写入有效步数，避免空包把已有数据（如 27 号 13 步）覆盖成 0
						if (activityMd && activityMd !== '-/-' && (isTodayActivity || (Number.isFinite(
								stepsNum) && stepsNum > 0))) {
							that.saveDailySteps(data.steps, activityMd)
						}
						if (isTodayActivity) {
							that.bushu = data.steps
							that.bushu_time = todayMd
							that.jakoblife_fat_scale3(deviceId, data.steps, deviceSn, "步数", "");
						}
						break;
					}
					case 'pulse_data':
						console.log('3BPW6paredata接收到数据:', data || "数据统计中");
						break;
					case 'pulse_data_his':
						that.Taking_pulse.push(data)
						if (that.Taking_pulse.length === 1000) {
							uni.setStorageSync("Taking_pulse", uni.getStorageSync("Taking_pulse"))
							setTimeout(() => {
								console.log('已经有1000条脉诊数据:', that.Taking_pulse);
								that.Taking_pulse = []
								if (that.$refs.pulseDiagnosisRef) {
									that.$refs.pulseDiagnosisRef.loadRealData()
								}
							}, 1000)
						}
						break;
					case 'pulse_empty':
						uni.setStorageSync("Taking_pulse", that.Taking_pulse)
						setTimeout(() => {
							console.log('无脉诊数据或完毕:', uni.getStorageSync("Taking_pulse"));
							that.Taking_pulse = []
							if (that.$refs.pulseDiagnosisRef) {
								that.$refs.pulseDiagnosisRef.loadRealData()
							}
						}, 1000)
						break;
					case 'sleep': {
						if (data.daysAgo != null && Number(data.daysAgo) !== 0) {
							break
						}
						const BPW6totalAll = `${Math.floor(data.sleepTotal / 60)}${"H"}${data.sleepTotal % 60}${"M"}`
						const BPW6sleepLight = `${Math.floor(data.sleepLight / 60)}${"H"}${data.sleepLight % 60}${"M"}`
						const BPW6sleepDeep = `${Math.floor(data.sleepDeep / 60)}${"H"}${data.sleepDeep % 60}${"M"}`
						// REM = 总睡眠 - 浅睡 - 深睡
						const BPW6remMinutes = Math.max(0, (data.sleepTotal || 0) - (data.sleepLight || 0) - (data
							.sleepDeep || 0))
						const BPW6sportTime = `${Math.floor(BPW6remMinutes / 60)}${"H"}${BPW6remMinutes % 60}${"M"}`
						uni.setStorageSync("sleep", BPW6totalAll)
						uni.setStorageSync("totalLight", BPW6sleepLight)
						uni.setStorageSync("totalDeep", BPW6sleepDeep)
						uni.setStorageSync("totalRem", BPW6sportTime)
						uni.setStorageSync("sleep_time", data.date)
						that.sleep = BPW6totalAll //总睡眠
						that.totalLight = BPW6sleepLight //浅睡眠
						that.totalDeep = BPW6sleepDeep //深度睡眠
						that.totalRem = BPW6sportTime //REM睡眠
						const BPW6totalH = (that.timeStrToMinutes(BPW6totalAll) / 60).toFixed(1)
						const BPW6deepMin = (that.timeStrToMinutes(BPW6sleepDeep) / 60).toFixed(1);
						const BPW6remMin = (that.timeStrToMinutes(BPW6sportTime) / 60).toFixed(1);;
						const BPW6lightMin = (that.timeStrToMinutes(BPW6sleepLight) / 60).toFixed(1)
						that.sleep_point = that.overallSleepScore(BPW6totalAll, BPW6totalH, BPW6deepMin, BPW6remMin,
							BPW6lightMin)
						if (BPW6totalAll === uni.getStorageSync("BPW6totalAll") &&
							BPW6totalH === uni.getStorageSync("BPW6totalH") &&
							BPW6deepMin === uni.getStorageSync("BPW6deepMin") &&
							BPW6remMin === uni.getStorageSync("BPW6remMin") &&
							BPW6lightMin === uni.getStorageSync("BPW6lightMin")) {
							if (uni.getStorageSync("sleep_time") && that.getTimeAllJSON().MD !== that.sleep_time) {
								that.jakoblife_fat_scale3(deviceId, BPW6totalAll, deviceSn, "睡眠", "");
							}
						} else {
							uni.setStorageSync("BPW6totalAll", BPW6totalAll)
							uni.setStorageSync("BPW6totalH", BPW6totalH)
							uni.setStorageSync("BPW6deepMin", BPW6deepMin)
							uni.setStorageSync("BPW6remMin", BPW6remMin)
							uni.setStorageSync("BPW6lightMin", BPW6lightMin)
							that.jakoblife_fat_scale3(deviceId, BPW6totalAll, deviceSn, "睡眠", "");
						}
						break;
					}
					case 'battery':
						console.log('手表电量:', data.value);
						break;
					case 'hrAutoInfo':
						console.log('手表心率自动测量开关:', data.hrAutoEnabled);
						break;
					case 'spO2AutoInfo':
						console.log('手表血氧自动测量开关:', data.spO2AutoEnabled);
						break;
					default:
						console.log('【未知数据类型:】', data);
						break;
				}
			},
			handleBPDynamicParams(data, source = 'read') {
				const params = {
					enabled: !!data.enabled,
					startHour: data.startHour ?? 0,
					startTime: data.startTime || `${String(data.startHour ?? 0).padStart(2, '0')}:00`,
					dayInterval: data.dayInterval ?? 0,
					nightInterval: data.nightInterval ?? 0,
					rawStartHour: data.rawStartHour,
					updatedAt: Date.now(),
					source
				}
				this.bpDynamicParams = params
				uni.setStorageSync('bpw6_bp_dynamic_params', params)
				uni.$emit('BPW6_BP_DYNAMIC_PARAMS', params)
				console.log(`【BPW6】血压动态测量参数(${source}):`, params)
			},
			showBPW6PpgCloudLoading() {
				// 始终标记云端中（按钮置灰依赖）；定时/血压后静默不弹窗
				this.bpw6PpgCloudLoadingActive = true
				if (this.isBpw6PpgUiSilent()) {
					this.setSleepAlertDisabled(true)
					return
				}
				// 手动立即测量：切到云端提示（同 phase 不重复弹）
				if (this.immediateEmotionMeasure || this.bpw6ManualEmotionUiPhase === 'measuring' || this
					.bpw6ManualEmotionUiPhase === 'cloud') {
					this.showBpw6ManualEmotionLoading('cloud')
					return
				}
				this.setSleepAlertDisabled(true)
				if (!this.QX_HIDE) {
					return
				}
				uni.showLoading({
					title: this.$t("云端数据计算中"),
					mask: true,
				})
			},
			hideBPW6PpgCloudLoading() {
				this.bpw6PpgCloudLoadingActive = false
				this.bpw6PpgSilentAfterBp = false
				this.bpw6AwaitingPpgAfterBp = false
				if (this.bpw6ManualEmotionUiPhase === 'measuring' || this.bpw6ManualEmotionUiPhase ===
					'cloud') {
					this.bpw6ManualEmotionUiPhase = 'idle'
				}
				this._bpw6LastLoadingPhase = ''
				try {
					uni.hideLoading()
				} catch (e) {}
			},
			/** PPG 成功/失败后统一收尾：关弹窗 + 恢复立即测量按钮；手动失败仅当前页 toast */
			recoverBpw6PpgSessionUi(reason, opts = {}) {
				const failToast = !!(opts && opts.failToast)
				const canToast = failToast && this.QX_HIDE && this.shouldToastBpw6ManualFail()
				// 先清会话标记，再恢复按钮（BPW1/BPW6 共用 deviceppgdatalist 收尾）
				this.immediateEmotionMeasure = false
				this.sleep_alertid = 0
				this.bpw1PpgSessionActive = false
				this.yalixueyatype = false
				this._bpw6EmotionMeasureStartedAt = 0
				this._bpw6EmotionPullOnShowTried = false
				this.hideBPW6PpgCloudLoading()
				this.setSleepAlertDisabled(false)
				if (canToast) {
					this.toastBpw6ManualTransferFail()
				}
			},
			async startBpw6PpgAfterBpMeasurement(deviceId) {
				const targetDeviceId = deviceId || this.deviceIdwatch6 || uni.getStorageSync('BPW6devicemac')
				// 20s 等待结束，进入真正启测；失败再清静默并恢复按钮
				this.bpw6AwaitingPpgAfterBp = false
				if (!targetDeviceId) {
					console.warn('【BPW6】无设备，跳过PPG测量')
					this.bpw6PpgSilentAfterBp = false
					this._bpw6EmotionMeasureStartedAt = 0
					this.setSleepAlertDisabled(false)
					return
				}
				try {
					// 血压后自动测 PPG：静默，不弹提示、不进入手动测量 phase；按钮置灰至结束
					this.prepareBpw6PpgAfterBpButtonLock()
					this.bpw6AwaitingPpgAfterBp = false
					const result = await u16proBLE.startPPGMeasurementWithDuration(60, targetDeviceId)
					if (!result || !result.success) {
						this.bpw6PpgSilentAfterBp = false
						this.bpw6AwaitingPpgAfterBp = false
						this._bpw6EmotionMeasureStartedAt = 0
						this.setSleepAlertDisabled(false)
						console.warn('【BPW6】PPG启动失败', u16proBLE.getPpgStartHint(result))
					} else {
						this.armBPW6EmotionButtonWatchdog(120)
					}
				} catch (err) {
					this.bpw6PpgSilentAfterBp = false
					this.bpw6AwaitingPpgAfterBp = false
					this._bpw6EmotionMeasureStartedAt = 0
					this.setSleepAlertDisabled(false)
					console.error('【BPW6】PPG启动失败', err)
				}
			},
			handleBPW6PPGData(data, deviceId, deviceSn, source = 'chunk') {
				if (!this.bpw6PpgRawBuffer) {
					this.bpw6PpgRawBuffer = []
				}
				switch (source) {
					case 'command':
						console.log(`【BPW6】PPG命令(0x${(data.cmd || 0).toString(16)}):`, data.success ? '成功' : '失败')
						if ((data.cmd === 0x49 || data.cmd === 0x4A) && data.success) {
							this.bpw6PpgRawBuffer = []
							this.bpw6PpgTotalSize = 0
							// 动态血压/手表侧启 PPG：启动成功即置灰（与实时血压后一致）
							if (!this.immediateEmotionMeasure) {
								this.prepareBpw6PpgAfterBpButtonLock()
							}
						}
						// 启动失败：startPPG 内部重试/降级期间勿提前收尾（含 0x49→0x4A 间隙）
						if ((data.cmd === 0x49 || data.cmd === 0x4A || data.cmd === 0x4B) && data.success === false) {
							const startInFlight = (data.cmd === 0x49 || data.cmd === 0x4A) && (
								u16proBLE.isPpgOperationInProgress() ||
								this.immediateEmotionMeasure ||
								this.bpw6PpgSilentAfterBp
							)
							if (startInFlight) {
								console.log('【BPW6】PPG启动中间失败，等待降级/重试')
								break
							}
							this.recoverBpw6PpgSessionUi('command fail', {
								failToast: this.shouldToastBpw6ManualFail()
							})
						}
						if (data.cmd === 0x4B && data.success) {
							this.fetchBPW6PPGRawData(deviceSn, deviceId)
						}
						break
					case 'measurement_complete':
						console.log('【BPW6】PPG测量结束通知(0x58):', data.success ? '成功' : '失败')
						if (data.success) {
							// 定时/血压后：无弹窗，按钮置灰至云端结束
							if (!this.immediateEmotionMeasure) {
								this.bpw6PpgSilentAfterBp = true
								this.setSleepAlertDisabled(true)
								if (!this._bpw6EmotionMeasureStartedAt) {
									this._bpw6EmotionMeasureStartedAt = Date.now()
								}
								this.armBPW6EmotionButtonWatchdog(120)
							}
							this.fetchBPW6PPGRawData(deviceSn, deviceId)
						} else {
							// 测量被打断：恢复立即测量按钮
							this.recoverBpw6PpgSessionUi('measurement_complete fail', {
								failToast: this.shouldToastBpw6ManualFail()
							})
						}
						break
					case 'size':
						this.bpw6PpgTotalSize = data.size || 0
						console.log('【BPW6】PPG数据大小:', this.bpw6PpgTotalSize, 'bytes')
						break
					case 'chunk':
						if (data.ppgData && data.ppgData.length > 0) {
							this.bpw6PpgRawBuffer.push(...data.ppgData)
						}
						break
					case 'chunk_error':
						// PPG 分块传输中断：恢复立即测量按钮
						console.error('【BPW6】PPG分块传输中断', data && data.error)
						this.bpw6PpgReading = false
						this.recoverBpw6PpgSessionUi('chunk_error', {
							failToast: this.shouldToastBpw6ManualFail()
						})
						break
					case 'complete':
						if (data.ppgData && data.ppgData.length > 0) {
							this.bpw6PpgRawBuffer = [...data.ppgData]
							this.bpw6PpgTotalSize = data.size || data.ppgData.length
						}
						this.showBPW6PpgCloudLoading()
						this.uploadBPW6PPGRawData(deviceSn, deviceId)
						break
				}
			},
			async fetchBPW6PPGRawData(deviceSn, deviceId) {
				if (this.bpw6PpgReading) {
					return
				}
				this.bpw6PpgReading = true
				this.bpw6PpgRawBuffer = []
				this.bpw6PpgTotalSize = 0
				// 定时测量：无弹窗，仅锁按钮直到云端结束
				const sendwatch = uni.getStorageSync('sendwatch')
				const isScheduled = sendwatch === 1 || sendwatch === '1'
				if (isScheduled && !this.immediateEmotionMeasure) {
					this.bpw6PpgSilentAfterBp = true
					if (!this._bpw6EmotionMeasureStartedAt) {
						this._bpw6EmotionMeasureStartedAt = Date.now()
					}
					this.armBPW6EmotionButtonWatchdog(120)
				}
				this.setSleepAlertDisabled(true)
				this.showBPW6PpgCloudLoading()
				try {
					const result = await u16proBLE.readAllPPGData(deviceId)
					if (result && result.ppgData && result.ppgData.length > 0) {
						this.bpw6PpgRawBuffer = [...result.ppgData]
						this.bpw6PpgTotalSize = result.size || result.ppgData.length
						this.uploadBPW6PPGRawData(deviceSn, deviceId)
					} else {
						console.warn('【BPW6】PPG数据为空，跳过上传')
						this.recoverBpw6PpgSessionUi('empty ppg', {
							failToast: this.shouldToastBpw6ManualFail()
						})
					}
				} catch (err) {
					console.error('【BPW6】PPG数据读取失败', err)
					this.recoverBpw6PpgSessionUi('read fail', {
						failToast: this.shouldToastBpw6ManualFail()
					})
				} finally {
					this.bpw6PpgReading = false
					const sw = uni.getStorageSync('sendwatch')
					if (sw === 1 || sw === '1') {
						// 结束调度会话；按钮保持置灰直到云端成功/失败/中断
						onQxBleWatchCollectionEnded('BPW6 PPG数据传输结束')
					}
				}
			},
			/**
			 * BPW6 PPG：设备侧已是小端 32 位 ADC 字节流，按 INT32 原样打包为 base64（不做 Int16 缩放）
			 * @param {number[]} bytesOrSamples - 原始字节(0~255)或已解析的 Int32 采样点
			 */
			packBpw6PpgInt32(bytesOrSamples) {
				const list = Array.isArray(bytesOrSamples) ? bytesOrSamples : []
				if (!list.length) {
					return uni.arrayBufferToBase64(new ArrayBuffer(0))
				}
				// 输入已是原始字节流：对齐到 4 字节后原样上传
				const looksLikeBytes = list.every((v) => Number.isInteger(v) && v >= 0 && v <= 255)
				if (looksLikeBytes) {
					const usable = list.length - (list.length % 4)
					const ab = new ArrayBuffer(usable)
					const view = new Uint8Array(ab)
					for (let i = 0; i < usable; i++) {
						view[i] = list[i] & 0xFF
					}
					return uni.arrayBufferToBase64(ab)
				}
				// 输入已是 Int32 采样点：小端写入
				const n = list.length
				const ab = new ArrayBuffer(n * 4)
				const view = new DataView(ab)
				for (let i = 0; i < n; i++) {
					view.setInt32(i * 4, list[i] | 0, true)
				}
				return uni.arrayBufferToBase64(ab)
			},
			/**
			 * BPW6 定时测量兜底：调度在时长结束后仍未收到 0x58 时主动拉取并上报
			 * （立即测量不走此路径；已在读则跳过，避免与 0x58 双触发冲突）
			 */
			onQxBpw6PpgPullNeeded(payload = {}) {
				const sendwatch = uni.getStorageSync('sendwatch')
				if (sendwatch !== 1 && sendwatch !== '1') {
					return
				}
				if (this.bpw6PpgReading) {
					console.log('【BPW6】兜底拉取跳过：正在读取中')
					return
				}
				const deviceId = (payload && payload.deviceId) || this.deviceIdwatch6 || uni
					.getStorageSync('BPW6devicemac') || ''
				const deviceSn = this.deviceIdwatch6_SN || ''
				if (!deviceId) {
					console.warn('【BPW6】兜底拉取失败：无设备MAC')
					return
				}
				try {
					this.installBleForwardHandler(deviceSn)
				} catch (e) {}
				// 定时：无弹窗，按钮置灰
				this.bpw6PpgSilentAfterBp = true
				this.setSleepAlertDisabled(true)
				if (!this._bpw6EmotionMeasureStartedAt) {
					this._bpw6EmotionMeasureStartedAt = Date.now()
				}
				this.armBPW6EmotionButtonWatchdog(120)
				console.log('【BPW6】定时测量兜底拉取并上报', payload && payload.reason, deviceId)
				this.fetchBPW6PPGRawData(deviceSn, deviceId)
			},
			uploadBPW6PPGRawData(deviceSn, deviceId) {
				const rawBytes = this.bpw6PpgRawBuffer || []
				if (!rawBytes.length) {
					this.recoverBpw6PpgSessionUi('upload empty', {
						failToast: this.shouldToastBpw6ManualFail()
					})
					return
				}
				// 长包协议：PPG 为小端 32 位 ADC（200Hz）；仍按 INT16 上传以兼容现有云端接口
				const samples = U16ProProtocol.parsePPGInt32Samples(rawBytes)
				if (!samples.length) {
					console.warn('【BPW6】PPG字节无法组成Int32采样，跳过上传', rawBytes.length)
					this.recoverBpw6PpgSessionUi('upload empty', {
						failToast: this.shouldToastBpw6ManualFail()
					})
					return
				}
				const binary = this.packInt16(rawBytes)
				// const binary = this.packBpw6PpgInt32(rawBytes)
				console.log('【BPW6】上传PPG原始数据, bytes:', rawBytes.length, 'samples:', samples.length,
					'rate:', BC_PACKET.PPG_SAMPLING_RATE)
				this.bpw6PpgRawData(binary, deviceSn, deviceId)
				this.bpw6PpgRawBuffer = []
				this.bpw6PpgTotalSize = 0
			},
			bpw6PpgRawData(rawData, deviceSn, deviceId) {
				const data = {
					patientId: uni.getStorageSync("userid"),
					deviceSn: deviceSn,
					deviceModel: "U19M",
					// 协议：PPG 采样频率 200Hz（32位ADC）；payload 仍为 INT16 以兼容分析服务
					samplingRate: 200,
					startTime: this.getTimeAllJSON().YMDHMS,
					dataFormat: "INT32",
					signalRange: 0,
					rawData: rawData,
					dataLength: "",
					signalType: "GREEN",
					ledCurrent: 0,
					ambientLight: 0,
					motionLevel: 0,
					qualityScore: 0,
					qualityVersion: 0,
					processingStatus: "RAW",
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				console.log("【BPW6】PPG上传", data)
				this.$post(this.$url_APP_IP + "/prod-api/device/ppgdata", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((ppgdatares) => {
					console.log("【BPW6】PPG上传结果", ppgdatares)
					if (ppgdatares.code === 200) {
						this.deviceppgdatalist(deviceSn, deviceId)
					} else {
						this.recoverBpw6PpgSessionUi('upload code fail', {
							failToast: this.shouldToastBpw6ManualFail()
						})
					}
				}).catch((err) => {
					console.error("【BPW6】PPG上传失败", err)
					this.recoverBpw6PpgSessionUi('upload exception', {
						failToast: this.shouldToastBpw6ManualFail()
					})
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
			Notificationss(name) {
				const payload = {
					url: '/pages/tabBar/my/Alarms'
				};
				uni.createPushMessage({
					title: this.$t("通知标题"),
					content: name,
					payload: payload,
					options: {
						cover: false, // 是否覆盖上次通知
						when: new Date(), // 通知时间
					}
				});
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
						const otherDatatiwen2 = dataList.slice(20, dataList.length - 2);
						const otherData1 = dataList.slice(16, 24);
						const otherData2 = dataList.slice(24, 28);
						const otherData3 = dataList.slice(28, dataList.length - 2);
						const otherall = dataList.slice(dataList.length - 2, dataList.length);
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
								that.jakoblife_fat_scale2(deviceId, "", "", xinlv, deviceSn)
								break
							case "02":
								const shousuoye = decimalArray[0]
								const shuzhangya = decimalArray[1]
								const length = decimalArray.length - 2
								const maibo = decimalArray[length]
								that.jakoblife_fat_scale2(deviceId, shousuoye, shuzhangya, maibo, deviceSn)
								break
							case "03":
								that.storeOxygenData({
									diastolic: decimalArray[0]
								}, Math.floor(Date.now() / 1000))
								that.list_recipe()
								break
							case "05":
								const settept1 = decimalArray[1]
								uni.setStorageSync("settept1", settept1)
								that.list_recipe()
								break
							case "07":
								let tiwen = parseInt(otherDatatiwen1, 16) / 10 // 第二个参数16表示输入是16进制
								let parts = otherDatatiwen2.match(/.{1,2}/g);
								let tiwentimes = parts.map(p => parseInt(p, 16))[2] + "/" + parts.map(p =>
									parseInt(p, 16))[3]
								uni.setStorageSync("tiwen", tiwen)
								uni.setStorageSync("tiwentimes", tiwentimes)
								that.list_recipe()
								break
							case "08":

								break
							case "22":
								const sum =
									decimalArray
									.reduce((
											acc,
											curr
										) =>
										acc +
										curr, 0
									);
								that.isSumZero =
									sum === 0;
								if (that
									.isSumZero ===
									false) {
									const
										shousuoye =
										decimalArray[
											1]
									const
										shuzhangya =
										decimalArray[
											2]
									const
										length =
										decimalArray
										.length -
										1
									const
										maibo =
										decimalArray[
											3]
									const
										year =
										that
										.hexToDecimal(
											otherData2
										)
									that.jakoblife_fat_scale2(
										deviceId,
										shousuoye,
										shuzhangya,
										maibo,
										deviceSn
									)
								}
								break
							default:
								// console.log("血压手表其他数据类型", restype)
						}
					}
				})
			},

			bgaaa(lowPressure, highPressure) {
				const inRange = (val, min, max) =>
					val >= min && val <= max;
				const isElevated =
					inRange(lowPressure, 81, 90) ||
					inRange(highPressure, 121, 140) ||
					inRange(lowPressure, 91, 100) ||
					inRange(highPressure, 141, 160) ||
					inRange(lowPressure, 101, 110) ||
					inRange(highPressure, 161, 180);
				if (!isElevated) return;

				uni.showModal({
					title: this.$t("提示"),
					content: this.$t("显示结果弹窗"),
					showCancel: !(inRange(
							lowPressure,
							81, 90) ||
						inRange(
							highPressure,
							121, 140)),
				});
			},
			//上报血压计血压数据
			jakoblife_fat_scale(deviceId, parsedData,
				deviceSn) {
				let aaa = {
					lowPressure: parsedData.dia.trim(),
					highPressure: parsedData.sys.trim(),
					heartrate: parsedData.pul.trim(),
				}
				// 血压计实时测量：优先设备测量时间，无则手机本地；measurementTimezone 同步为本地墙钟
				const measureTime = parsedData.createTime || parsedData.Time || parsedData.time ||
					parsedData.measureTime
				const timeFields = this.buildUploadTimeFields(measureTime)
				const data = {
					deviceSn: deviceSn,
					deviceTypeId: "1",
					mac: deviceId,
					slaveData: aaa,
					time: timeFields.time,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
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
			//上报体脂秤数据
			jakoblife_fat_scale1(deviceSn, deviceId, parsedData) {
				const timeFields = this.buildUploadTimeFields(parsedData.createTime)
				let data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "0",
					slaveData: {
						weight: parsedData.weightUnit === 2 || parsedData.weightUnit === 4 ? WeightConverter
							.parseStoneString(parsedData.weight).toFixed(2) : (parsedData.weightUnit === 6 ?
								WeightConverter.lbToKg(parsedData.weight) : parsedData.weight),
						adc: parsedData.adc
					},
					time: timeFields.time,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
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
				let aaa = {
					heartrate: maibo,
				};
				if (shousuoye && shuzhangya) {
					aaa.lowPressure = shuzhangya;
					aaa.highPressure = shousuoye;
				}
				const timeFields = this.buildUploadTimeFields()
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "1",
					slaveData: aaa,
					time: timeFields.time,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(reslk => {
					if (reslk.code === 200) {
						this.setbanhua(1)
						if (this.QX_HIDE) {
							this.bgaaa(aaa.lowPressure, aaa.highPressure)
						}
						this.get_device_info(deviceSn)
						setTimeout(() => {
							this.get_device_info(deviceSn)
							this.list_recipe()
							this.StorageInfo(aaa)
						}, 1000)
					}
				})
			},
			// 设备获取到数据之后，上报手表血压/心率数据
			jakoblife_fat_scale22(deviceId, shousuoye, shuzhangya, maibo, deviceSn, timess, opts) {
				let aaa = {};
				const bypassSession = !!(opts && opts.bypassSessionDedupe)
				const requireBpWithHr = !!(opts && opts.requireBpWithHr)
				const isBpUpload = !!(shousuoye && shuzhangya)
				const hrNum = this.normalizeBPW1Heartrate ? this.normalizeBPW1Heartrate(maibo) : (
					(maibo !== '' && maibo != null && Number(maibo) > 0) ? Number(maibo) : ''
				)
				const hasHr = hrNum !== ''
				const isHrOnlyUpload = !isBpUpload && hasHr && timess !== '' && timess != null
				if (isBpUpload) {
					aaa.lowPressure = Number(shuzhangya)
					aaa.highPressure = Number(shousuoye)
					// BPW1 血压测量：slaveData 必须同时含 heartrate，且不为空
					if (requireBpWithHr && !hasHr) {
						console.log('BPW1拒绝无心率的血压上报', {
							shousuoye,
							shuzhangya,
							maibo
						})
						return Promise.resolve({
							code: 200,
							msg: 'bp-hr-required'
						})
					}
					if (hasHr) {
						aaa.heartrate = hrNum
					}
				} else if (hasHr) {
					aaa.heartrate = hrNum
				}
				// 血压/心率按测量时间戳做会话去重（改时区/同步重入时 time 仍稳定，避免重复上报）
				// BPW6 槽位：调用方已查服务端无此点时传 bypassSessionDedupe，避免本地会话挡住必报
				const bpTimeKey = isBpUpload ? String(timess) : ''
				const hrTimeKey = isHrOnlyUpload ? String(timess) : ''
				if (isBpUpload) {
					if (!this.bpw1UploadedBpTimeSet) {
						this.bpw1UploadedBpTimeSet = new Set()
					}
					if (!bypassSession && this.bpw1UploadedBpTimeSet.has(bpTimeKey)) {
						console.log('BPW1血压本会话已上报，跳过重复:', bpTimeKey)
						return Promise.resolve({
							code: 200,
							msg: 'duplicate-skipped'
						})
					}
					this.bpw1UploadedBpTimeSet.add(bpTimeKey)
					if (hasHr) {
						this.markSessionHrUploadedNear(bpTimeKey, hrNum, 3)
					}
				} else if (isHrOnlyUpload) {
					if (!bypassSession && this.hasSessionHrUploadedNear(hrTimeKey, hrNum, 3)) {
						console.log('心率本会话已上报，跳过重复:', hrTimeKey, hrNum)
						return Promise.resolve({
							code: 200,
							msg: 'duplicate-skipped'
						})
					}
					this.markSessionHrUploadedNear(hrTimeKey, hrNum, 3)
				}
				// rawDeviceTimestamp：BPW6 实时血压 time 原样用设备 timestamp，不做 china 墙钟重编码
				const timeFields = (opts && opts.rawDeviceTimestamp && timess !== '' && timess != null &&
						Number(timess) > 1e9) ? {
						time: Math.floor(Number(timess)),
						measurementTimezone: this.formatTimestampKey(Math.floor(Number(timess)))
					} :
					this.buildUploadTimeFields(timess)
				let data = {
					deviceSn: !deviceSn ? uni.getStorageSync("deviceSn") : deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: timeFields.time,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				uni.setStorageSync("xueyadatatype", "1")
				uni.setStorageSync("xueyadata", data)
				// this.addlog("jakoblife_fat_scale22", data)
				return this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					// this.addlog("上报数据手表", res)
					if (res.code === 200) {
						uni.removeStorageSync("xueyadatatype")
						uni.removeStorageSync("xueyadata")
						this.setbanhua(1)
						setTimeout(() => {
							if (this.QX_HIDE) {
								this.bgaaa(aaa.lowPressure, aaa.highPressure)
							}
							this.StorageInfo(aaa)
							this.get_device_info(deviceSn)
						}, 1000)
					} else if (isBpUpload && this.bpw1UploadedBpTimeSet) {
						this.bpw1UploadedBpTimeSet.delete(bpTimeKey)
						if (hasHr) {
							this.unmarkSessionHrUploadedNear(bpTimeKey, 3)
						}
					} else if (isHrOnlyUpload) {
						this.unmarkSessionHrUploadedNear(hrTimeKey, 3)
					}
					return res
				}).catch(errro => {
					if (isBpUpload && this.bpw1UploadedBpTimeSet) {
						this.bpw1UploadedBpTimeSet.delete(bpTimeKey)
						if (hasHr) {
							this.unmarkSessionHrUploadedNear(bpTimeKey, 3)
						}
					} else if (isHrOnlyUpload) {
						this.unmarkSessionHrUploadedNear(hrTimeKey, 3)
					}
					console.log("errro", errro)
					throw errro
				})
			},
			/**获取设备历史数据之后，上报手表历史数据
			 * @param {Object} deviceId 设备mac
			 * @param {Object} shousuoye 收缩压
			 * @param {Object} shuzhangya 舒张压
			 * @param {Object} maibo 心率
			 * @param {Object} deviceSn 设备sn
			 * @param {Object} timess 设备传过来的数据时间
			 */
			Watch_Historical_data(deviceId, shousuoye, shuzhangya, maibo, deviceSn, timess, opts) {
				let aaa = {};
				const bypassSession = !!(opts && opts.bypassSessionDedupe)
				const requireBpWithHr = !!(opts && opts.requireBpWithHr)
				const isBpUpload = !!(shousuoye && shuzhangya)
				const hrNum = this.normalizeBPW1Heartrate ? this.normalizeBPW1Heartrate(maibo) : (
					(maibo !== '' && maibo != null && Number(maibo) > 0) ? Number(maibo) : ''
				)
				const hasHr = hrNum !== ''
				const isHrOnlyUpload = !isBpUpload && hasHr && timess !== '' && timess != null
				if (isBpUpload) {
					aaa.lowPressure = Number(shuzhangya);
					aaa.highPressure = Number(shousuoye);
					if (requireBpWithHr && !hasHr) {
						console.log('BPW1历史拒绝无心率的血压上报', {
							shousuoye,
							shuzhangya,
							maibo
						})
						return Promise.resolve({
							code: 200,
							msg: 'bp-hr-required'
						})
					}
					if (hasHr) {
						aaa.heartrate = hrNum
					}
				} else if (hasHr) {
					aaa.heartrate = hrNum
				}
				// 与实时上报共用会话去重，避免历史批量与实时路径重复
				// BPW6：服务端已确认无此点时 bypass，防止会话标记挡住必报
				const bpTimeKey = isBpUpload ? String(timess) : ''
				const hrTimeKey = isHrOnlyUpload ? String(timess) : ''
				if (isBpUpload) {
					if (!this.bpw1UploadedBpTimeSet) {
						this.bpw1UploadedBpTimeSet = new Set()
					}
					if (!bypassSession && this.bpw1UploadedBpTimeSet.has(bpTimeKey)) {
						console.log('BPW1历史血压本会话已上报，跳过重复:', bpTimeKey)
						return Promise.resolve({
							code: 200,
							msg: 'duplicate-skipped'
						})
					}
					this.bpw1UploadedBpTimeSet.add(bpTimeKey)
					// 血压必须与心率同报：即使会话已单独报过心率，也不再从历史 payload 剔除 heartrate
					if (hasHr) {
						this.markSessionHrUploadedNear(bpTimeKey, hrNum, 3)
					}
				} else if (isHrOnlyUpload) {
					if (!bypassSession && this.hasSessionHrUploadedNear(hrTimeKey, hrNum, 3)) {
						console.log('历史心率本会话已上报，跳过重复:', hrTimeKey, hrNum)
						return Promise.resolve({
							code: 200,
							msg: 'duplicate-skipped'
						})
					}
					this.markSessionHrUploadedNear(hrTimeKey, hrNum, 3)
				}
				// rawDeviceTimestamp：与实时一致，time 原样用设备 timestamp
				const timeFields = (opts && opts.rawDeviceTimestamp && timess !== '' && timess != null &&
						Number(timess) > 1e9) ? {
						time: Math.floor(Number(timess)),
						measurementTimezone: this.formatTimestampKey(Math.floor(Number(timess)))
					} :
					this.buildUploadTimeFields(timess)
				let data = {
					deviceSn: !deviceSn ? uni.getStorageSync("deviceSn") : deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					time: timeFields.time,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				return this.$post(this.$url_APP_IP + this.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then(res => {
					console.log("Watch_Historical_data上报手表历史数据成功", data)
					if (res && res.code === 200) {
						// 历史上报成功后立刻拉概览，避免仅依赖 8s 轮询导致首页血压偏慢
						this.list_recipe()
					} else if (res && res.code !== 200) {
						if (isBpUpload && this.bpw1UploadedBpTimeSet) {
							this.bpw1UploadedBpTimeSet.delete(bpTimeKey)
							if (hasHr) {
								this.unmarkSessionHrUploadedNear(bpTimeKey, 3)
							}
						} else if (isHrOnlyUpload) {
							this.unmarkSessionHrUploadedNear(hrTimeKey, 3)
						}
					}
					return res
				}).catch(errro => {
					if (isBpUpload && this.bpw1UploadedBpTimeSet) {
						this.bpw1UploadedBpTimeSet.delete(bpTimeKey)
						if (hasHr) {
							this.unmarkSessionHrUploadedNear(bpTimeKey, 3)
						}
					} else if (isHrOnlyUpload) {
						this.unmarkSessionHrUploadedNear(hrTimeKey, 3)
					}
					console.log("errro", errro)
					throw errro
				})
			},
			// 上报金亿帝手表单独测量数据
			jakoblife_fat_scale3(deviceId, datapar,
				deviceSn, type, timess, opts) {
				const self = this
				const bypassSession = !!(opts && opts.bypassSessionDedupe)
				const isSpO2Upload = type === "血氧" && timess !== '' && timess != null
				const spo2TimeKey = isSpO2Upload ? String(timess) : ''
				if (isSpO2Upload) {
					if (!bypassSession && self.hasSessionSpO2Uploaded(spo2TimeKey, datapar)) {
						console.log('血氧本会话已上报，跳过重复:', spo2TimeKey, datapar)
						return Promise.resolve({
							code: 200,
							msg: 'duplicate-skipped'
						})
					}
					self.markSessionSpO2Uploaded(spo2TimeKey, datapar)
				}
				const aaa = self.buildReportData(type, datapar);
				const timeFields = self.buildUploadTimeFields(timess)
				const data = {
					deviceSn: deviceSn,
					mac: deviceId,
					deviceTypeId: "2",
					slaveData: aaa,
					// 有测量时间用测量时间；血氧/步数/睡眠等统一走同一规则（本地墙钟）
					time: timeFields.time,
					measurementTs: self.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				console.log("jakoblife_fat_scale3" + type, data)
				return self.$post(self.$url_APP_IP + self.$url_jakoblife_fat_scale, data, {
					'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
				}).then((resdb) => {
					console.log("上报手表数据" + type + "：" + deviceId, resdb)
					if (resdb && resdb.code === 200) {
						try {
							self.setbanhua(1)
						} catch (e) {
							console.warn('setbanhua', e)
						}
						setTimeout(() => {
							try {
								if (type !== "血氧") {
									self.get_device_info(deviceSn)
								}
								self.getStorageInfooy(aaa)
							} catch (e) {
								console.warn('fat_scale3 after-success', e)
							}
						}, 1000)
					} else if (isSpO2Upload) {
						self.unmarkSessionSpO2Uploaded(spo2TimeKey)
					}
					return resdb
				}).catch((errro) => {
					if (isSpO2Upload) {
						self.unmarkSessionSpO2Uploaded(spo2TimeKey)
					}
					throw errro
				})
			},
			//本地警报
			StorageInfo(aaa) {
				let that = this
				if (uni.getStorageSync("swichs")) {
					// 检查舒张压
					if (uni.getStorageSync("shuzhangyaId1") || uni.getStorageSync("shuzhangyaId2")) {
						that.checkAndNotify("shuzhangyaId1", "shuzhangyaId2", aaa.lowPressure, "舒张压");
					}
					// 检查收缩压
					if (uni.getStorageSync("shousuoyaId1") || uni.getStorageSync("shousuoyaId2")) {
						that.checkAndNotify("shousuoyaId1", "shousuoyaId2", aaa.highPressure, "收缩压");
					}
					// 检查脉搏
					if (uni.getStorageSync("maiboId1") || uni.getStorageSync("maiboId2")) {
						that.checkAndNotify("maiboId1", "maiboId2", aaa.heartrate, "脉搏");
					}
				}
			},
			getStorageInfooy(aaa) {
				let that = this
				if (uni.getStorageSync("swichs")) {
					if (uni.getStorageSync("xeuyang1") || uni.getStorageSync("xeuyang2")) {
						that.checkAndNotify("xeuyang1", "xeuyang2", aaa.oxygen, "血氧");
					}
				}
			},
			// 封装检查和通知的逻辑
			checkAndNotify(key1, key2, value,
				messageKey) {
				const storedValue1 = uni
					.getStorageSync(key1);
				const storedValue2 = uni
					.getStorageSync(key2);
				if ((storedValue1 && value <
						storedValue1) ||
					(storedValue2 && value >
						storedValue2)) {
					// 如果已经触发了通知，则不再重复触发
					if (!uni.getStorageSync(
							"isProcessed")) {
						this.Notificationss(this.$t(
							"测量通知"));
						uni.setStorageSync(
							"isProcessed", true
						) // 标记已触发通知
						setTimeout(() => {
							uni.removeStorageSync(
								"isProcessed"
							)
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




			sendLargeData(deviceId, serviceId, uuid,
				year, month, day, hour, minute,
				second) {
				let that = this
				const timeSyncData = that
					.createTimeSyncData(year, month,
						day, hour,
						minute,
						second); // 构造时间同步数据
				const buffer = that.toArrayBuffer(
					timeSyncData); // 转换为 ArrayBuffer
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
				for (let i = 0; i < data.length; i +=
					2) {
					sum += parseInt(data.substr(i, 2),
						16);
				}
				return (sum & 0xFF).toString(16)
					.padStart(2, '0');
			},

			toArrayBuffer(data) {
				const buffer = new ArrayBuffer(data
					.length / 2);
				const dataView = new DataView(buffer);
				for (let i = 0; i < data.length; i +=
					2) {
					dataView.setUint8(i / 2, parseInt(
						data.substr(i, 2), 16));
				}
				return buffer;
			},

			decimalToHex(decimal, length = 2) {
				// 转换为十六进制字符串
				const hex = decimal.toString(16)
					.toUpperCase();
				// 使用 padStart 补齐零，确保固定长度
				return hex.padStart(length, '0');
			},
			//同步手表时间命令
			createTimeSyncData(year, month, day, hour,
				minute, second) {
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
				const finalData =
					`${rawData}${checksum}`; // 添加和校验
				return finalData;
			},



			//情绪页面报告按钮显示判断
			questionnairelist() {
				let data = {
					patientId: uni.getStorageSync("userid"), //患者唯一标识
				}
				this.$get(this.$url_APP_IP + "/prod-api/device/questionnaire/list", data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((
					questionnairelist) => {
					// console.log("questionnairelist", questionnairelist)
					if (questionnairelist.code === 200 &&
						questionnairelist.total > 0) {
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
				if (this.shuzhangya === "" || this
					.shuzhangya === undefined) {
					uni.showToast({
						title: this.$t(
							'请输入收缩压'),
						icon: "none"
					})
					return
				} else if (this.shousuoya === "" ||
					this.shousuoya === undefined) {
					uni.showToast({
						title: this.$t(
							'请输入舒张压'),
						icon: "none"
					})
					return
				} else if (this.maibo === "" || this
					.maibo === undefined) {
					uni.showToast({
						title: this.$t(
							'请输入脉搏'),
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
				const localTime =
					`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
				let formattedTime = this
					.birthday1111 === this.$t('今天') ?
					`${localDate} ${localTime}` :
					`${this.birthday1111} ${localTime}`;
				let timestamp = Math.floor(new Date(
						formattedTime).getTime() /
					1000); // 转换成时间戳（秒）
				let data = {
					deviceSn: uni.getStorageSync(
						'deviceSn'),
					slaveSn: "0",
					slaveData: {
						lowPressure: this
							.shuzhangya,
						highPressure: this
							.shousuoya,
						heartrate: this.maibo
					},
					time: timestamp
				}
				this.$post(this.$url_APP_IP + this
					.$url_pressure_data, data, {
						'Authorization': 'Bearer ' +
							uni.getStorageSync(
								"token"),
						'content-type': 'application/json'
					}).then((res) => {
					console.log(
						"pressure_data",
						res)
					if (res.code === 200) {
						this.$refs.qs_popup
							.close()
						this.birthday1111 =
							this.$t('今天')
						this.shousuoya = ''
						this.shuzhangya = ''
						this.maibo = ''
						uni.showToast({
							title: this
								.$t(
									"成功"),
							icon: 'none',
							duration: 1500
						})
						this.list_recipe()
					} else if (res.code ===
						500) {
						return
					} else {
						uni.showToast({
							title: this
								.$t(
									"失败"),
							icon: 'none',
							duration: 1500
						})
					}
				})
			},

			delate_icon_cl(name, item) {
				for (let i = 0; this.list.length >
					i; i++) {
					if (this.list[i].title == name) {
						this.list.splice(i, 1)
						let kapianlist = []
						kapianlist = this.list
						this.cardeditData(kapianlist, "bloodData")
					}
				}
			},

			delate_icon_cl_2(name, item) {
				for (let i = 0; this.list2.length >
					i; i++) {
					if (this.list2[i].title == name) {
						this.list2.splice(i, 1)
						let kapianlist2 = []
						kapianlist2 = this.list2
						this.cardeditData(kapianlist2, "WeightData")
					}
				}
			},

			syncBloodCardListFromStorage() {
				const kapianlist = uni.getStorageSync(
					"kapianlist");
				if (Array.isArray(kapianlist) &&
					kapianlist.length > 0) {
					this.list = kapianlist;
					// 无网/尚未拉概览时先用缓存；有网后 list_recipe 会按接口覆盖
					this.patchVitalCardsFromStorage();
					this.restoreVitalCardTimesFromLocal();
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
						const local = uni.getStorageSync("kapianlist");
						if (listres.total === 0) {
							if (Array.isArray(local) && local.length > 0) {
								this.list = local;
							} else {
								uni.setStorageSync("kapianlist", this.list)
							}
						} else {
							let dataArray = this.robustParseData(listres.rows[0].data);
							if (Array.isArray(local) &&
								local.length > (dataArray?.length || 0)) {
								this.list = local;
							} else {
								this.list = dataArray
								uni.setStorageSync("kapianlist", this.list)
							}
						}
						// 布局接口可能带回旧 Step_count（如 07/19）；用 storage/概览权威日期盖回
						this.patchVitalCardsFromStorage()
					} else {
						uni.setStorageSync("kapianlist", this.list)
						this.patchVitalCardsFromStorage()
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
			//保存最新数据到数据库
			cardeditData(list, cardeditData) {
				let editData = {
					dataType: cardeditData,
					data: this.formatDatacard(list) === "" ? cardeditData : this.formatDatacard(list)
				}
				// console.log("editData", editData)
				this.$post(this.$url_APP_IP + "/prod-api/device/data/editData", editData, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json'
				}).then((reseditData) => {
					// console.log("cardeditData", reseditData)
					if (reseditData.code === 200) {
						if (cardeditData === "WeightData") {
							uni.setStorageSync("kapianlist2", list)
							// this.cardlist2("WeightData")
						} else {
							uni.setStorageSync("kapianlist", list)
							// this.cardlist1("bloodData")
						}
					}

				})
			},

			// 查询用户的绑定设备
			queryDevices() {
				let that = this
				that.$post(that.$url_APP_IP + that.$url_queryDevices, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((res) => {
					if (res.code == 200) {
						that.devicetypelist = [];
						if (res.rows.length === 0) {
							switch (that.currentIndex) {
								case 0:
									that.cardlist1("bloodData")
									break
								case 2:
									that.cardlist2("WeightData")
									break
							}
							that.devicetype = 30000
							that.devicetypelist.push(that.devicetype)
							that.list_recipe()
							that.setSleepAlertDisabled(true)
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
							const allElementsNot3001 = res.rows.every((item) => item.deviceModelId !== "30001");
							const allElementsNot10001 = res.rows.every((item) => item.deviceModelId !== "10001");
							// BPW1(30000) 或 BPW6(30001) 绑定后均可点击情绪立即测量
							if (allElementsNot3000 && allElementsNot3001) {
								that.setSleepAlertDisabled(true)
							} else if (!that.isBpw6PpgButtonBusy() && !that.shouldBlockBpw1PpgButtonRecover()) {
								// 测量会话中勿重置，避免 onShow→queryDevices 冲掉置灰（含 BPW1 PPG）
								that.setSleepAlertDisabled(false)
							}
							if (!allElementsNot3000) {
								that.devicetype = 30000
								that.devicetypelist.push(that.devicetype)
							}
							if (!allElementsNot3001) {
								that.devicetype = 30001
								that.devicetypelist.push(that.devicetype)
							}
							if (!allElementsNot10001) {
								that.devicetype = 10001
								that.devicetypelist.push(that.devicetype)
							}
							that.devicetypelist.push(that.devicetype)
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
							const newList = that.devicetypelist.filter(item => item !== that.devicetype);
							newList.push(that.devicetype);
							that.devicetypelist = newList;
							that.deviceSnuserID = [];
							for (let i = 0; res.rows.length > i; i++) {
								that.deviceSnuserID.push(res.rows[i].deviceSn) ////deviceSn查询
							}
							that.queryBloodPressureDataAsync(that.deviceSnuserID)
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
				that.devicdsdmac = []
				that.devicdsdmac1 = []
				for (let i = 0; rows.length > i; i++) {
					if (rows[i].deviceTypeId === "10") {
						if (that.xueyehuilian === true) {
							if (that.deviceList || uni.getStorageSync("deviceList")) {
								that.initBluetooth()
							}
							if (that.currentIndex === 0) {
								uni.setStorageSync("deviceSn", rows[i].deviceSn)
							}
						}
						that.devicdsdmac.push(rows[i].mac)
						uni.setStorageSync("devicdsdmac", that.devicdsdmac)
						if (rows[i].deviceModelId === "10006") {
							uni.setStorageSync("deviceModelName", rows[i].deviceModelName)
							uni.setStorageSync("ECGdeviceSn", rows[i].deviceSn)
						}
					} else if (rows[i].deviceTypeId === "13") {
						if (that.deviceList || uni.getStorageSync("deviceList")) {
							that.initBluetooth()
						}
						if (that.currentIndex === 0) {
							uni.setStorageSync("deviceSn", rows[i].deviceSn)
						}
						that.devicdsdmac1.push(rows[i].mac)
						uni.setStorageSync("devicdsdmac1", that.devicdsdmac1)
						that.BPW1deviceId = rows[i].mac
					} else if (rows[i].deviceTypeId === "11") {
						const TestUniPlugin = uni.requireNativePlugin("DCTestUniPlugin-TestModule");
						TestUniPlugin.startScan("options", (callback) => {
							const parsedData = JSON.parse(callback.data);
							if (rows[i].mac === parsedData.mac) {
								if (parsedData.testStatus === 255) {
									// console.log("parsedData", parsedData)
									if (parsedData.weight !== "0.00") {
										// 检查 weight 是否存在且发生变化
										if (parsedData?.adc && parsedData?.weight && parsedData?.weight !== that
											.lastWeight || (parsedData?.createTime !== that.lastcreateTime && that
												.isTimeDifferenceLessThan(parsedData.createTime, that
													.lastcreateTime, 8))) {
											if (parsedData.weightUnit === 6 && that.newweightKG === "lb") {
												that.Latest_weight = parsedData.weight
												that.lastWeightbishi = "0"
												uni.setStorageSync("weightlb", parsedData.weight)
												uni.setStorageSync("weightkg", WeightConverter.lbToKg(parsedData
													.weight
												))
											} else if (parsedData.weightUnit === 4) {
												that.Latest_weight = (that.newweightKG === "lb" || that
													.newweightKG === "英镑") ? WeightConverter.parseStoneString(
													parsedData.weight).toFixed(2) : WeightConverter.lbToKg(
													WeightConverter.parseStoneString(parsedData.weight)
													.toFixed(2)
												)
												that.lastWeightbishi = ""
												uni.setStorageSync("weightlb", WeightConverter.parseStoneString(
													parsedData.weight).toFixed(2))
												uni.setStorageSync("weightkg", WeightConverter.lbToKg(
													WeightConverter.parseStoneString(parsedData.weight)
													.toFixed(2)
												))
											} else {
												if (that.isKgWeightUnit(that.newweightKG)) {
													if (parsedData.weightUnit === 0) {
														that.Latest_weight = parsedData.weight
														that.lastWeightbishi = ""
														uni.setStorageSync("weightlb", WeightConverter.kgToLb(
															parsedData.weight
														))
														uni.setStorageSync("weightkg", parsedData.weight)
													} else if (parsedData.weightUnit === 4) {
														that.Latest_weight = WeightConverter.lbToKg(WeightConverter
															.parseStoneString(parsedData.weight).toFixed(2))
														that.lastWeightbishi = ""
														uni.setStorageSync("weightlb", WeightConverter
															.parseStoneString(parsedData.weight)
															.toFixed(2))
														uni.setStorageSync("weightkg", WeightConverter.lbToKg(
															WeightConverter.parseStoneString(parsedData
																.weight).toFixed(2)
														))
													} else {
														that.Latest_weight =
															WeightConverter
															.lbToKg(
																parsedData
																.weight
															)
														that.lastWeightbishi =
															""
														uni.setStorageSync(
															"weightlb",
															parsedData
															.weight
														)
														uni.setStorageSync(
															"weightkg",
															WeightConverter
															.lbToKg(
																parsedData
																.weight
															)
														)
													}
												} else {
													if (parsedData
														.weightUnit ===
														0
													) {
														that.Latest_weight =
															WeightConverter
															.kgToLb(
																parsedData
																.weight
															)
														that.lastWeightbishi =
															""
														uni.setStorageSync(
															"weightlb",
															WeightConverter
															.kgToLb(
																parsedData
																.weight
															)
														)
														uni.setStorageSync(
															"weightkg",
															parsedData
															.weight
														)
													} else if (
														parsedData
														.weightUnit ===
														4
													) {
														that.Latest_weight =
															WeightConverter
															.parseStoneString(
																parsedData
																.weight
															)
															.toFixed(
																2
															)
														that.lastWeightbishi =
															""
														uni.setStorageSync(
															"weightlb",
															WeightConverter
															.parseStoneString(
																parsedData
																.weight
															)
															.toFixed(
																2
															)
														)
														uni.setStorageSync(
															"weightkg",
															WeightConverter
															.lbToKg(
																WeightConverter
																.parseStoneString(
																	parsedData
																	.weight
																)
																.toFixed(
																	2
																)
															)
														)
													} else {
														that.Latest_weight =
															parsedData
															.weight
														that.lastWeightbishi =
															""
														uni.setStorageSync(
															"weightlb",
															parsedData
															.weight
														)
														uni.setStorageSync(
															"weightkg",
															WeightConverter
															.lbToKg(
																parsedData
																.weight
															)
														)
													}
												}
											}
											// 执行上传操作
											that.jakoblife_fat_scale1(
												rows[
													i
												]
												.deviceSn,
												rows[
													i
												]
												.mac,
												parsedData
											)
											// 更新上一次的值
											that.lastWeight =
												parsedData
												.weight;
											that.lastcreateTime =
												parsedData
												.createTime;
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
			isTimeDifferenceLessThan(time1, time2,
				seconds) {
				const diff = Math.abs(time2 -
					time1); // 直接相减就是秒数差
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
								this.msg = this.getpendinglenth >= pending.data.length;
							}
							break
					}
				})
			},
			/**
			 * 解析为毫秒时间戳；墙钟字符串无时区时按手机本地时区解析
			 */
			parseTimeToMs(value, _wallAsBeijing = false) {
				if (value == null || value === '') {
					return NaN;
				}
				let ts = Number(value);
				if (!Number.isFinite(ts)) {
					const raw = String(value).trim();
					if (/^\d{1,2}\/\d{1,2}$/.test(raw)) {
						return NaN;
					}
					// 已带时区：直接解析；否则按本地墙钟
					if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) {
						const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
						return new Date(normalized).getTime();
					}
					return this.parseWallClockToLocalMs(raw);
				}
				if (ts > 0 && ts < 1e12) {
					ts = ts * 1000;
				}
				return ts;
			},
			/** 设备 unix / 墙钟 / 当前时刻 → 手机本地时区 MM/DD */
			formatDate(value) {
				if (value == null || value === '') {
					return '-/-';
				}
				const raw = String(value).trim();
				if (/^\d{1,2}\/\d{1,2}$/.test(raw)) {
					const [m, d] = raw.split('/');
					return `${m.padStart(2, '0')}/${d.padStart(2, '0')}`;
				}
				// 本地墙钟字符串直接取月/日（与手机日历日一致）
				const wallMatch = raw.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
				if (wallMatch && !Number.isFinite(Number(value)) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) {
					return `${wallMatch[2].padStart(2, '0')}/${wallMatch[3].padStart(2, '0')}`;
				}
				const ts = this.parseTimeToMs(value, false);
				if (!Number.isFinite(ts) || ts <= 0) {
					return '-/-';
				}
				// 用原生时区偏移算 MD，避免部分 WebView Date.getDate() 落在 UTC 日
				const localMd = getLocalTimeAllJSON(new Date(ts)).MD;
				if (localMd && localMd !== '-/-') {
					return localMd;
				}
				const d = new Date(ts);
				const month = String(d.getMonth() + 1).padStart(2, '0');
				const day = String(d.getDate()).padStart(2, '0');
				return `${month}/${day}`;
			},
			/**
			 * 服务端 updateTime → MM/DD。
			 * 接口毫秒戳按中国时区日历日（与业务「解析是 20 号」一致），
			 * 避免 UTC/错时区 getDate 把凌晨数据落到前一天（如 1784484041000 → UTC19 / 中国20）。
			 */
			formatDateServer(value) {
				if (value == null || value === '') {
					return '-/-';
				}
				const raw = String(value).trim();
				if (/^\d{1,2}\/\d{1,2}$/.test(raw)) {
					const [m, d] = raw.split('/');
					return `${m.padStart(2, '0')}/${d.padStart(2, '0')}`;
				}
				const wallMatch = raw.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
				if (wallMatch && !Number.isFinite(Number(value)) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) {
					return `${wallMatch[2].padStart(2, '0')}/${wallMatch[3].padStart(2, '0')}`;
				}
				const ts = this.parseTimeToMs(value, false);
				if (!Number.isFinite(ts) || ts <= 0) {
					return '-/-';
				}
				const chinaMd = getChinaTimeAllJSON(new Date(ts)).MD;
				if (chinaMd && chinaMd !== '-/-') {
					return chinaMd;
				}
				return this.formatDate(value);
			},
			/**
			 * 仅「实时刚测」短窗保护本地卡片（手机本地时间）。
			 * 有网 list_recipe 成功后以接口 updateTime 为准，不再长期用本地缓存盖住日期。
			 */
			shouldPreferLocalVitalCardTime(localTsSec, serverTsSec, flagOn) {
				if (!flagOn) return false
				const localSec = this.toUnixSeconds(localTsSec)
				if (!localSec) return false
				const nowSec = Math.floor(Date.now() / 1000)
				// 仅实时测量约 90 秒内保护，超时一律跟接口
				if (nowSec - localSec > 90) return false
				if (localSec - nowSec > 60) return false
				return true
			},
			/** 手机本地当前 MM/DD（实时测量卡片日期） */
			getPhoneLocalCardMD() {
				const md = this.getTimeAllJSON && this.getTimeAllJSON().MD
				if (md && md !== '-/-') return md
				const d = new Date()
				return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
			},
			/** 用 storage 里权威的心率/血氧值与日期回写卡片（防 cardlist1 旧布局盖掉 list_recipe） */
			patchVitalCardsFromStorage() {
				const hrLabel = uni.getStorageSync('pulsetimes')
				const hrVal = uni.getStorageSync('pulse')
				const hrTitles = [this.$t('心率'), '心率', 'Heart']
				for (let i = 0; i < hrTitles.length; i++) {
					const item = this.findValue(this.list, 'title', hrTitles[i])
					if (!item) continue
					if (hrVal !== undefined && hrVal !== null && hrVal !== '') {
						this.$set(item, 'Step_number', String(hrVal))
					}
					if (hrLabel && hrLabel !== '-/-' && hrLabel !== '--/--') {
						this.$set(item, 'Step_count', hrLabel)
					}
					break
				}
				const spo2Label = uni.getStorageSync('xueyangtimes')
				const spo2Val = uni.getStorageSync('xueyang')
				const spo2Titles = [this.$t('血氧'), '血氧', 'SpO₂']
				for (let i = 0; i < spo2Titles.length; i++) {
					const item = this.findValue(this.list, 'title', spo2Titles[i])
					if (!item) continue
					if (spo2Val !== undefined && spo2Val !== null && spo2Val !== '') {
						this.$set(item, 'Step_number', String(spo2Val))
						const spo2 = parseInt(spo2Val, 10)
						if (!isNaN(spo2)) {
							if (spo2 <= 95) {
								this.$set(item, 'BMI_ys', this.$t('偏低'))
								this.$set(item, 'BMI_TF', 0)
							} else if (spo2 < 98) {
								this.$set(item, 'BMI_ys', this.$t('正常'))
								this.$set(item, 'BMI_TF', 1)
							} else {
								this.$set(item, 'BMI_ys', this.$t('偏高'))
								this.$set(item, 'BMI_TF', 10)
							}
						}
					}
					if (spo2Label && spo2Label !== '-/-' && spo2Label !== '--/--') {
						this.$set(item, 'Step_count', spo2Label)
					}
					break
				}
				if (Array.isArray(this.list) && this.list.length) {
					this.list = this.list.slice()
					uni.setStorageSync('kapianlist', this.list)
				}
			},
			/** 统一成秒级时间戳，墙钟按手机本地时区解析 */
			toUnixSeconds(value) {
				if (value == null || value === '') {
					return 0;
				}
				let ts = Number(value);
				if (!Number.isFinite(ts)) {
					const ms = this.parseWallClockToLocalMs(value);
					return Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1000) : 0;
				}
				if (ts > 1e12) {
					return Math.floor(ts / 1000);
				}
				return Math.floor(ts);
			},
			/** 同步本地心率卡片时间：仅接口 updateTime 按中国时区日历日解析 */
			syncPulseTimeFromServer(serverUpdateTime) {
				if (!serverUpdateTime && serverUpdateTime !== 0) {
					return '';
				}
				const serverSec = this.toUnixSeconds(serverUpdateTime);
				const label = this.formatDateServer(serverUpdateTime);
				if (!label || label === '-/-') {
					return '';
				}
				if (serverSec > 0) {
					uni.setStorageSync('pulse_server_ts', serverSec);
				}
				this.applyHomeHrCardDate(label);
				return label;
			},
			/** 同步本地血氧卡片时间：仅接口 updateTime 按中国时区日历日解析 */
			syncOxygenTimeFromServer(serverUpdateTime) {
				if (!serverUpdateTime && serverUpdateTime !== 0) {
					return '';
				}
				const serverSec = this.toUnixSeconds(serverUpdateTime);
				const label = this.formatDateServer(serverUpdateTime);
				if (!label || label === '-/-') {
					return '';
				}
				if (serverSec > 0) {
					uni.setStorageSync('oxygen_server_ts', serverSec);
				}
				this.applyHomeOxygenCardDate(label);
				return label;
			},
			/** 有设备测量 unix 时保留本地卡片日期（上报 time 按手机本地解析） */
			shouldKeepLocalCardTime(localTs, serverUpdateTime) {
				const localSec = this.toUnixSeconds(localTs);
				if (!localSec) {
					return false;
				}
				const serverSec = this.toUnixSeconds(serverUpdateTime);
				if (!serverSec) {
					return true;
				}
				// 同一次测量：本地与服务端偏差通常 ≤22h；更大则视为新数据，改用服务端
				return Math.abs(serverSec - localSec) <= 22 * 3600;
			},
			/** 用本地测量 unix 按当前设备时区刷新心率/血氧卡片日期（仅 BLE 实时刚测时） */
			restoreVitalCardTimesFromLocal() {
				const nowSec = Math.floor(Date.now() / 1000)
				if (this.xeuyabiaoshi === "1") {
					const pulseTs = this.toUnixSeconds(uni.getStorageSync('pulse_measure_ts'));
					// 仅实时刚测 90 秒内恢复本地日期
					if (pulseTs && nowSec - pulseTs <= 90) {
						const label = this.resolveHomeHrCardDateLabel(pulseTs, {
							forcePhoneLocal: true
						});
						this.applyHomeHrCardDate(label);
					} else if (pulseTs && nowSec - pulseTs > 90) {
						this.xeuyabiaoshi = ""
						// 超时后若有接口时间，用接口日纠正卡片日期
						const serverTs = this.toUnixSeconds(uni.getStorageSync('pulse_server_ts') || 0)
						if (serverTs > 0 && serverTs >= pulseTs) {
							this.applyHomeHrCardDate(this.formatDateServer(serverTs))
						}
					}
				}
				if (this.oxygenbiaoshi === "1") {
					const oxygenTs = this.toUnixSeconds(uni.getStorageSync('oxygen_measure_ts'));
					if (oxygenTs && nowSec - oxygenTs <= 90) {
						const label = this.resolveHomeOxygenCardDateLabel(oxygenTs, {
							forcePhoneLocal: true
						});
						this.applyHomeOxygenCardDate(label);
					} else if (oxygenTs && nowSec - oxygenTs > 90) {
						this.oxygenbiaoshi = ""
						const serverTs = this.toUnixSeconds(uni.getStorageSync('oxygen_server_ts') || 0)
						if (serverTs > 0 && serverTs >= oxygenTs) {
							this.applyHomeOxygenCardDate(this.formatDateServer(serverTs))
						}
					}
				}
			},


			getRegisterVal(data, type, key) {
				const value = this.findValue(data, type, key);
				return value.registerVal !== null ? value.registerVal : "-/-";
			},

			getUpdateTime(data, type, key) {
				const value = this.findValue(data, type, key);
				return value ? this.formatDateServer(value.updateTime) : "-/-";
			},
			/** 运动页「今日」步数：接口不是当天则今日显示 0，但按接口日期保留数据；接口变为当天后按接口显示 */
			applyTodayStepsFromApi(dataList) {
				const todayMd = this.normalizeStepsMd(this.getPhoneLocalCardMD())
				this.saveStepsRowsFromApi(dataList, true)
				const latest = this.pickLatestRecipeByRegister(dataList, 'steps')
				const apiMd = latest && latest.time ? this.normalizeStepsMd(this.formatDate(latest.time)) : ''
				const rawVal = latest && latest.value
				const hasVal = this.isValidStepsValue(rawVal)
				const isToday = !!apiMd && apiMd === todayMd
				if (hasVal && apiMd) {
					this.saveDailySteps(rawVal, apiMd, true, true)
				}
				this.refreshWeeklyStepsChart()
				this.fetchWeekStepsFromApi()
				if (isToday && hasVal) {
					this.bushu = rawVal
					this.bushu_time = todayMd
					return
				}
				this.bushu = 0
				this.bushu_time = todayMd
			},

			// 封装获取存储信息的通用函数
			getStorageInfo(keys, callback) {
				uni.getStorageInfo({
					success: (res) => {
						const hasAllKeys = keys.every(key => res.keys.includes(key));
						callback(hasAllKeys, res);
					}
				});
			},

			// 处理步数卡片
			processSteps(item, name) {
				this.applyTodayStepsFromApi(item)
				const stepItem = this.findValue(this.list, 'title', name);
				if (stepItem) {
					stepItem.Step_number = this.bushu
					stepItem.Step_count = this.bushu_time
					stepItem.title = this.$t("步数");
					stepItem.type_LX = this.$t("计步");
				}
			},
			// 封装处理步数的逻辑
			processSteps2(item, name) {
				this.applyTodayStepsFromApi(item)
				const stepItem = this.findValue(this.list2, 'title', name);
				if (stepItem) {
					stepItem.Step_number = this.bushu
					stepItem.Step_count = this.bushu_time
					stepItem.title = this.$t("步数");
					stepItem.type_LX = this.$t("计步");
				}
			},

			// 封装处理身高、体重等通用逻辑
			async processCommonData(itemdata, titleKey, dataKey, typeKey, unitKey) {
				let that = this
				const item = that.findValue(that.list2, 'title', titleKey);
				const data = that.findValue(itemdata, 'register', dataKey);
				const unit = uni.getStorageSync(unitKey) === 0 ? that.$t("英寸") : that.$t("厘米");
				item.type_LX = unit;
				item.Step_number = data?.registerVal || '--';
				item.Step_count = that.formatDateServer(data?.updateTime);
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
				item.Step_count = that.formatDateServer(data?.updateTime);
				item.title = that.$t(titleKey)
			},

			// 处理身高卡片
			async processHeight(item, name) {
				let that = this
				const heightItem = that.findValue(that.list, 'title', name);
				const height = that.findValue(item, 'register', 'height')?.registerVal;
				const unit = uni.getStorageSync("danwei1") === 0 ? that.$t("英寸") : that.$t("厘米");
				heightItem.type_LX = unit;
				heightItem.title = that.$t("身高")
				heightItem.Step_number = height !== null ? ((unit === "inch" || unit === "英寸") ? WeightConverter
					.cmToInch(height) : height) : '-/-';
				heightItem.Step_count = that.formatDateServer(that.findValue(item, 'register', 'height')?.updateTime);
			},

			// 处理体温卡片
			async processTemperature(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				temperatureItem.title = that.$t("体温")
				temperatureItem.Step_number = uni.getStorageSync("tiwen") || "0";
				temperatureItem.Step_count = uni.getStorageSync("tiwentimes") || "--/--";
			},
			// 处理压力卡片
			async processyali(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				temperatureItem.title = that.$t("压力");
				temperatureItem.Step_number = uni.getStorageSync("yali") || "0";
				temperatureItem.Step_count = uni.getStorageSync("yalitimes") || "--/--";
			},

			// 处理心率卡片：默认跟接口；仅本地/同步更新或无网时用本地（BPW6 同槽跟接口新值）
			async processxiblv(item, name) {
				let that = this
				const temperatureItem = that.findValue(that.list, 'title', name);
				if (!temperatureItem) return;
				temperatureItem.title = that.$t("心率");
				const hrLatest = that.pickLatestRecipeByRegister(item, 'heartrate');
				const serverUpdateTime = hrLatest.time;
				const localPulseTs = that.toUnixSeconds(uni.getStorageSync('pulse_measure_ts') || 0);
				const serverPulseSec = that.toUnixSeconds(serverUpdateTime);
				const localPulse = uni.getStorageSync('pulse');
				const hasLocalPulse = localPulse !== undefined && localPulse !== null && localPulse !== '';
				const nowSec = Math.floor(Date.now() / 1000)
				const preferLocalNewer = hasLocalPulse && that.shouldProtectLocalHrAgainstRecipe(
					localPulseTs, serverPulseSec, localPulse, hrLatest.value, {
						offline: false
					}
				)

				if (preferLocalNewer) {
					const localLabel = that.resolveHomeHrCardDateLabel(localPulseTs) || that.pulsetime;
					that.$set(that, 'pulse', localPulse);
					that.$set(temperatureItem, 'Step_number', String(localPulse));
					that.applyHomeHrCardDate(localLabel, temperatureItem);
					if (serverPulseSec > 0) {
						uni.setStorageSync('pulse_server_ts', serverPulseSec);
					}
					that.list = that.list.slice();
					uni.setStorageSync('kapianlist', that.list);
					return;
				}

				if (serverUpdateTime) {
					if (hrLatest.value !== undefined && hrLatest.value !== null && hrLatest.value !== '-/-') {
						that.$set(that, 'pulse', hrLatest.value);
						that.$set(temperatureItem, 'Step_number', String(hrLatest.value));
						uni.setStorageSync('pulse', hrLatest.value);
					} else {
						that.$set(temperatureItem, 'Step_number', that.pulse);
					}
					// BPW6 同槽：用接口槽位时间，避免本地 now 再次压过接口
					uni.setStorageSync('pulse_measure_ts', serverPulseSec || localPulseTs)
					uni.setStorageSync('pulse_server_ts', serverPulseSec || 0)
					that.xeuyabiaoshi = ""
					const label = that.syncPulseTimeFromServer(serverUpdateTime);
					that.applyHomeHrCardDate(label || '-/-', temperatureItem);
					that.list = that.list.slice();
					uni.setStorageSync('kapianlist', that.list);
					return;
				}
				const preferLocalHrTime = that.shouldPreferLocalVitalCardTime(
					localPulseTs, serverUpdateTime, that.xeuyabiaoshi === "1"
				) || that.shouldPreferLocalVitalCardTime(
					localPulseTs, serverUpdateTime, that.isBPW1LocalHrCardProtected()
				)
				if (preferLocalHrTime) {
					const localLabel = that.resolveHomeHrCardDateLabel(localPulseTs) || that.pulsetime;
					if (localLabel && localLabel !== '-/-') {
						that.applyHomeHrCardDate(localLabel, temperatureItem);
						if (hasLocalPulse) {
							that.$set(temperatureItem, 'Step_number', String(localPulse));
						} else {
							that.$set(temperatureItem, 'Step_number', that.pulse);
						}
						that.list = that.list.slice();
						uni.setStorageSync('kapianlist', that.list);
						return;
					}
				}
				// 无接口字段：本地缓存日期也按权威时间重算，避免卡在昨日
				if (localPulseTs > 0) {
					const cachedLabel = that.resolveHomeHrCardDateLabel(localPulseTs)
					that.applyHomeHrCardDate(cachedLabel, temperatureItem)
				} else {
					that.$set(temperatureItem, 'Step_count', uni.getStorageSync('pulsetimes') || '-/-');
				}
				that.$set(temperatureItem, 'Step_number', that.pulse);
				that.list = that.list.slice();
			},

			// BLE接收到心率数据并更新心率卡片（仅当时间不早于当前展示时写入；日期跟测量时间）
			updateHeartRateCardLocal(heartRate, heartRateValuetime) {
				const that = this;
				const nowSec = Math.floor(Date.now() / 1000)
				const cardTs = heartRateValuetime ? that.toUnixSeconds(heartRateValuetime) : nowSec
				const compareTs = cardTs || nowSec
				const bpw6Slot = that.isBpw6HrSlotDevice() && !!cardTs
				// 比接口/已展示更旧则不刷首页；BPW6 同槽重测允许覆盖
				if (!that.canUpdateHomeHrByNewestTime(compareTs, {
						allowBpw6SameSlot: bpw6Slot
					})) {
					console.log('updateHeartRateCardLocal跳过更旧数据', compareTs, that.getHomeHrNewestTs(), heartRate)
					return;
				}
				const usePhoneLocal = !cardTs || Math.abs(nowSec - cardTs) <= 15 * 60
				// BPW6：权威时间存设备槽位戳，勿用 nowSec（否则同槽接口 updateTime 会被当成更旧）
				const storeTs = (bpw6Slot && cardTs) ? cardTs : (usePhoneLocal ? nowSec : cardTs)
				const timeLabel = that.resolveHomeHrCardDateLabel(storeTs, {
					forcePhoneLocal: usePhoneLocal
				})
				that.$set(that, 'pulse', heartRate);
				uni.setStorageSync('pulse_measure_ts', storeTs);
				uni.setStorageSync('pulse', heartRate);
				const titleKeys = [that.$t('心率'), '心率', 'Heart'];
				let heartRateItem = null;
				for (let i = 0; i < titleKeys.length; i++) {
					heartRateItem = that.findValue(that.list, 'title', titleKeys[i]);
					if (heartRateItem) break;
				}
				if (!heartRateItem) {
					that.applyHomeHrCardDate(timeLabel);
					return;
				}
				that.$set(heartRateItem, 'title', that.$t('心率'));
				that.$set(heartRateItem, 'Step_number', String(heartRate));
				that.applyHomeHrCardDate(timeLabel, heartRateItem);
				// BasicDrag 内部是浅拷贝，需换数组引用触发卡片时间刷新
				that.list = that.list.slice();
				uni.setStorageSync('kapianlist', that.list);
			},

			// 存储血氧数据（仅当时间不早于当前展示；近实时用手机本地日）
			// opts.force：BPW6 实时测量强制刷新（接口时间偏新时不挡）
			storeOxygenData(value, oxygenValuetime, opts) {
				const force = !!(opts && opts.force)
				const nowSec = Math.floor(Date.now() / 1000)
				const cardTs = oxygenValuetime ? this.toUnixSeconds(oxygenValuetime) : nowSec
				const compareTs = cardTs || nowSec
				if (!force && !this.canUpdateHomeOxygenByNewestTime(compareTs)) {
					console.log('storeOxygenData跳过更旧数据', compareTs, this.getHomeOxygenNewestTs())
					return
				}
				this.oxygenbiaoshi = "1"
				const usePhoneLocal = force || !cardTs || Math.abs(nowSec - cardTs) <= 15 * 60
				const storeTs = usePhoneLocal ? nowSec : cardTs
				uni.setStorageSync('oxygen_measure_ts', storeTs);
				uni.setStorageSync("xueyang", value && value.diastolic != null ? value.diastolic : value);
				this.updateOxygenCardLocal(value, storeTs, opts);
			},
			//BLE接收到血氧数据并处理血氧卡片
			updateOxygenCardLocal(oxygenValue, oxygenValuetime, opts) {
				const that = this;
				const force = !!(opts && opts.force)
				const nowSec = Math.floor(Date.now() / 1000)
				const cardTs = oxygenValuetime ? that.toUnixSeconds(oxygenValuetime) : nowSec
				const compareTs = cardTs || nowSec
				if (!force && !that.canUpdateHomeOxygenByNewestTime(compareTs)) {
					console.log('updateOxygenCardLocal跳过更旧数据', compareTs, that.getHomeOxygenNewestTs())
					return;
				}
				const usePhoneLocal = force || !cardTs || Math.abs(nowSec - cardTs) <= 15 * 60
				const storeTs = usePhoneLocal ? nowSec : cardTs
				const timeLabel = that.resolveHomeOxygenCardDateLabel(storeTs, {
					forcePhoneLocal: usePhoneLocal
				})
				uni.setStorageSync('oxygen_measure_ts', storeTs);
				const xueyang = String(oxygenValue.diastolic != null ? oxygenValue.diastolic : oxygenValue);
				uni.setStorageSync("xueyang", xueyang);
				const titleKeys = [that.$t('血氧'), '血氧', 'SpO₂'];
				let bloodOxygenItem = null;
				for (let i = 0; i < titleKeys.length; i++) {
					bloodOxygenItem = that.findValue(that.list, 'title', titleKeys[i]);
					if (bloodOxygenItem) break;
				}
				if (!bloodOxygenItem) {
					that.applyHomeOxygenCardDate(timeLabel);
					return;
				}
				that.$set(bloodOxygenItem, 'title', that.$t('血氧'));
				that.$set(bloodOxygenItem, 'Step_number', xueyang);
				const spo2 = parseInt(xueyang, 10);
				if (isNaN(spo2)) {
					that.$set(bloodOxygenItem, 'BMI_ys', '-/-');
					that.$set(bloodOxygenItem, 'BMI_TF', 0);
				} else if (spo2 <= 95) {
					that.$set(bloodOxygenItem, 'BMI_ys', that.$t('偏低'));
					that.$set(bloodOxygenItem, 'BMI_TF', 0);
				} else if (spo2 < 98) {
					that.$set(bloodOxygenItem, 'BMI_ys', that.$t('正常'));
					that.$set(bloodOxygenItem, 'BMI_TF', 1);
				} else {
					that.$set(bloodOxygenItem, 'BMI_ys', that.$t('偏高'));
					that.$set(bloodOxygenItem, 'BMI_TF', 10);
				}
				that.applyHomeOxygenCardDate(timeLabel, bloodOxygenItem);
				that.list = that.list.slice();
				uni.setStorageSync('kapianlist', that.list);
			},
			// 设备概览返回血氧数据并处理血氧卡片（本地与接口比时间，显示最新）
			async processBloodOxygen(item, name) {
				let that = this
				const bloodOxygenItem = that.findValue(that.list, 'title', name);
				if (!bloodOxygenItem) return;
				const serverOxygen = that.pickLatestRecipeByRegister(item, 'oxygen');
				const serverUpdateTime = serverOxygen.time;
				const xueyang = serverOxygen.value === '-/-' ? null : serverOxygen.value;
				bloodOxygenItem.title = that.$t("血氧");
				const localOxygen = uni.getStorageSync('xueyang');
				const localOxygenTs = that.toUnixSeconds(uni.getStorageSync('oxygen_measure_ts') || 0)
				const serverOxygenSec = that.toUnixSeconds(serverUpdateTime)
				const hasLocalOxygen = localOxygen !== undefined && localOxygen !== null && localOxygen !== '';
				const nowSec = Math.floor(Date.now() / 1000)
				const preferLocalNewer = serverOxygenSec > 0 && localOxygenTs > 0 &&
					localOxygenTs > serverOxygenSec + 30 && hasLocalOxygen &&
					(that.oxygenbiaoshi === "1" || (nowSec - localOxygenTs <= 15 * 60));

				const applySpo2Status = (val) => {
					const spo2Num = parseInt(val, 10)
					if (isNaN(spo2Num)) {
						that.$set(bloodOxygenItem, 'BMI_ys', '-/-');
						that.$set(bloodOxygenItem, 'BMI_TF', 0);
					} else if (spo2Num <= 95) {
						that.$set(bloodOxygenItem, 'BMI_ys', that.$t('偏低'));
						that.$set(bloodOxygenItem, 'BMI_TF', 0);
					} else if (spo2Num < 98) {
						that.$set(bloodOxygenItem, 'BMI_ys', that.$t('正常'));
						that.$set(bloodOxygenItem, 'BMI_TF', 1);
					} else {
						that.$set(bloodOxygenItem, 'BMI_ys', that.$t('偏高'));
						that.$set(bloodOxygenItem, 'BMI_TF', 10);
					}
				}

				if (preferLocalNewer) {
					that.$set(bloodOxygenItem, 'Step_number', String(localOxygen));
					applySpo2Status(localOxygen);
					const localLabel = that.resolveHomeOxygenCardDateLabel(localOxygenTs) ||
						uni.getStorageSync('xueyangtimes');
					that.applyHomeOxygenCardDate(localLabel, bloodOxygenItem);
					if (serverOxygenSec > 0) {
						uni.setStorageSync('oxygen_server_ts', serverOxygenSec);
					}
					that.list = that.list.slice();
					uni.setStorageSync('kapianlist', that.list);
					return;
				}

				if (serverUpdateTime) {
					if (xueyang !== undefined && xueyang !== null && xueyang !== '') {
						that.$set(bloodOxygenItem, 'Step_number', String(xueyang));
						uni.setStorageSync('xueyang', xueyang);
						applySpo2Status(xueyang);
					}
					uni.setStorageSync('oxygen_measure_ts', serverOxygenSec || localOxygenTs)
					uni.setStorageSync('oxygen_server_ts', serverOxygenSec || 0)
					that.oxygenbiaoshi = ""
					const label = that.syncOxygenTimeFromServer(serverUpdateTime);
					that.applyHomeOxygenCardDate(label || '-/-', bloodOxygenItem);
					that.list = that.list.slice();
					uni.setStorageSync('kapianlist', that.list);
					return;
				}
				const preferLocalOxygenTime = that.shouldPreferLocalVitalCardTime(
					localOxygenTs, serverUpdateTime, that.oxygenbiaoshi === "1"
				)
				if (preferLocalOxygenTime) {
					const localLabel = that.resolveHomeOxygenCardDateLabel(localOxygenTs) ||
						uni.getStorageSync('xueyangtimes');
					if (hasLocalOxygen) {
						that.$set(bloodOxygenItem, 'Step_number', String(localOxygen));
						applySpo2Status(localOxygen);
					}
					if (localLabel && localLabel !== '-/-') {
						that.applyHomeOxygenCardDate(localLabel, bloodOxygenItem);
						that.list = that.list.slice();
						uni.setStorageSync('kapianlist', that.list);
						return;
					}
				}
				if (localOxygenTs > 0) {
					const cachedLabel = that.resolveHomeOxygenCardDateLabel(localOxygenTs)
					that.applyHomeOxygenCardDate(cachedLabel, bloodOxygenItem)
				} else {
					that.$set(bloodOxygenItem, 'Step_count', uni.getStorageSync('xueyangtimes') || '-/-');
				}
				if (hasLocalOxygen) {
					that.$set(bloodOxygenItem, 'Step_number', String(localOxygen));
					applySpo2Status(localOxygen);
				}
				that.list = that.list.slice();
			},

			/** list_recipe 返回值与当前展示是否不一致 */
			isRecipeDisplayMismatch(displayed, recipeVal) {
				const a = displayed == null || displayed === '' ? '' : String(displayed).trim()
				const b = recipeVal == null || recipeVal === '' ? '' : String(recipeVal).trim()
				if ((a === '-/-' || a === '--/--' || a === '') &&
					(b === '-/-' || b === '--/--' || b === '' || b === 'null' || b === 'undefined')) {
					return false
				}
				const na = Number(a)
				const nb = Number(b)
				if (Number.isFinite(na) && Number.isFinite(nb)) {
					return Math.abs(na - nb) > 0.05
				}
				return a !== b
			},
			/** 展示与接口不一致时强制刷新视图 */
			forceRefreshRecipeDisplay() {
				this.$forceUpdate()
				this.$nextTick(() => {
					this.$forceUpdate()
				})
			},
			//设备数据概览
			list_recipe() {
				const data = {
					userId: uni.getStorageSync("userid")
				}
				this.$post(this.$url_APP_IP + this.$url_list_recipe, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code === 200) {
						// console.log(res)
						uni.setStorageSync("temperature", this.getRegisterVal(res.data, 'register',
							'temperature')); //根据体温判断是否显示无感报告的提示，超过500则显示
						this.sleep_time = this.getUpdateTime(res.data, 'register', 'sleep')
						// 历史同步 thrash 已在 BLE 分包侧跳过首页写入；此处仍拉取云端，避免首页血压长时间空白
						if (this.currentIndex === 0) {
							// 心率/舒张压/收缩压概览里常有两条，按 updateTime 取最新
							const lowPressureData = this.pickLatestRecipeByRegister(res.data, 'lowPressure');
							const highPressureData = this.pickLatestRecipeByRegister(res.data, 'highPressure');
							const pulseData = this.pickLatestRecipeByRegister(res.data, 'heartrate');
							const nextLow = this.Blood === "mmHg" ? lowPressureData.value :
								(Number(lowPressureData.value) * 0.133).toFixed(1);
							const nextHigh = this.Blood === "mmHg" ? highPressureData.value :
								(Number(highPressureData.value) * 0.133).toFixed(1);
							const nextPulse = pulseData.value;
							const hasPendingOfflineBp = !!uni.getStorageSync('xueyadata');
							const localPulseTs = this.toUnixSeconds(uni.getStorageSync('pulse_measure_ts') || 0)
							const serverPulseTs = this.toUnixSeconds(pulseData.time)
							const localBpTs = this.toUnixSeconds(uni.getStorageSync('bp_measure_ts') || 0)
							const serverBpTs = Math.max(
								this.toUnixSeconds(lowPressureData.time) || 0,
								this.toUnixSeconds(highPressureData.time) || 0
							)
							const nowSec = Math.floor(Date.now() / 1000)
							const localPulseVal = uni.getStorageSync('pulse')
							// 本地比接口新才保护；BPW6 同槽接口值更新则跟接口
							const protectLocalHrCard = this.shouldProtectLocalHrAgainstRecipe(
								localPulseTs, serverPulseTs, localPulseVal, nextPulse, {
									offline: false
								}
							)
							const protectLocalBp = serverBpTs > 0 && localBpTs > serverBpTs + 30 && (
								this.xeuyabiaoshi === "1" || (nowSec - localBpTs <= 15 * 60)
							)
							const protectPulse = protectLocalHrCard || this.shouldMuteBPW1BleHomeUi()
							const pulseValueMismatch = !protectPulse && this.isRecipeDisplayMismatch(this.pulse,
								nextPulse)
							// BPW6 同槽：时间戳不变但接口值变了，仍必须刷首页
							const bpw6PulseNeedApply = this.isBpw6HrSlotDevice() && pulseValueMismatch
							const bpMismatch = !hasPendingOfflineBp && (
								(!protectLocalBp && (
									this.isRecipeDisplayMismatch(this.lowPressure, nextLow) ||
									this.isRecipeDisplayMismatch(this.highPressure, nextHigh)
								)) ||
								pulseValueMismatch
							);
							const keepLocalPulseTime = protectPulse;
							if ((this.xeuyabiaoshi === "" && !hasPendingOfflineBp && !protectLocalHrCard &&
									!protectLocalBp) || bpMismatch || bpw6PulseNeedApply) {
								if (bpMismatch || bpw6PulseNeedApply) {
									if (!protectPulse) {
										this.xeuyabiaoshi = ""
									}
									if (!this.shouldPreferLocalVitalCardTime(
											this.toUnixSeconds(uni.getStorageSync('oxygen_measure_ts') || 0),
											null,
											this.oxygenbiaoshi === "1"
										)) {
										this.oxygenbiaoshi = ""
									}
								}
								if (!protectLocalBp && !hasPendingOfflineBp) {
									this.applyHomeBloodPressure(
										lowPressureData.value,
										highPressureData.value,
										serverBpTs || nowSec, {
											fromServer: true
										}
									)
								}
								if (!protectPulse) {
									this.$set(this, 'pulse', nextPulse);
									if (nextPulse !== undefined && nextPulse !== null && nextPulse !== '-/-') {
										uni.setStorageSync('pulse', nextPulse)
									}
									if (serverPulseTs > 0) {
										const storePulseTs = this.isBpw6HrSlotDevice() ?
											(this.floorUnixToFiveMin(serverPulseTs) || serverPulseTs) :
											serverPulseTs
										uni.setStorageSync('pulse_measure_ts', storePulseTs)
										uni.setStorageSync('pulse_server_ts', serverPulseTs)
									}
								}
								if (!keepLocalPulseTime && pulseData.time) {
									this.syncPulseTimeFromServer(pulseData.time);
								}
								if (bpMismatch || bpw6PulseNeedApply) {
									this.forceRefreshRecipeDisplay()
								}
							} else if (!keepLocalPulseTime && pulseData.time) {
								this.syncPulseTimeFromServer(pulseData.time);
							}
							if (serverBpTs > 0) {
								uni.setStorageSync('bp_server_ts', serverBpTs)
							}
							// 主逻辑：遍历当前卡片列表（勿用旧 kapianlist 回写）
							const sourceList = (Array.isArray(this.list) && this.list.length > 0) ?
								this.list : (uni.getStorageSync("kapianlist") || []);
							for (let i = 0; i < sourceList.length; i++) {
								const item = sourceList[i];
								if (item.title === "身高" || item.title === "Height") {
									this.processHeight(res.data, item.title);
								} else if (item.title === "血氧" || item.title === "SpO₂") {
									this.processBloodOxygen(res.data, item.title);
								} else if (item.title === "心率" || item.title === "Heart") {
									this.processxiblv(res.data, item.title);
								} else if (item.title === "步数" || item.title === "Steps" || item.title === this.$t(
										'步数')) {
									// 步数卡片日期跟服务端 updateTime（本地日），勿用旧缓存
									const stepItem = this.findValue(this.list, 'title', item.title)
									const stepsLatest = this.pickLatestRecipeByRegister(res.data, 'steps')
									if (stepItem && stepsLatest.time) {
										const label = this.formatDate(stepsLatest.time)
										if (stepsLatest.value !== '-/-') {
											this.$set(stepItem, 'Step_number', stepsLatest.value)
										}
										this.$set(stepItem, 'Step_count', label || '-/-')
										this.bushu_time = label
									}
								}
							}
							this.list = this.list.slice()
							uni.setStorageSync('kapianlist', this.list)
							// 再补丁一次，防止并行 cardlist1 旧布局盖掉刚写入的接口日期
							this.patchVitalCardsFromStorage()
							// 不每 8 秒 slice 换数组引用，避免拖拽卡片整表重建导致图片闪烁
							this.cardeditData(this.list, "bloodData")
							if (bpMismatch) {
								this.$nextTick(() => {
									this.forceRefreshRecipeDisplay()
								})
							}
						} else if (this.currentIndex === 1) {
							this.ppgresultslist(this.types_index)
							this.ppgresultslist2(this.types_index)
							this.ppgresultslist3(this.types_index)
						} else if (this.currentIndex === 2) {
							const rawKg = this.getRegisterVal(res.data, 'register', 'weight');
							const recipeWeight = this.isKgWeightUnit(this.newweightKG) ?
								rawKg : WeightConverter.kgToLb(rawKg);
							if (rawKg && rawKg !== '-/-' && rawKg !== '--') {
								uni.setStorageSync('weightkg', rawKg);
								uni.setStorageSync('weightlb', WeightConverter.kgToLb(rawKg));
							}
							const hasPendingOfflineWeight = !!uni.getStorageSync("tizhidata");
							const weightMismatch = !hasPendingOfflineWeight &&
								this.isRecipeDisplayMismatch(this.Latest_weight, recipeWeight);
							// 获取体重值：正常条件，或展示与接口不一致时强制刷新
							if ((this.lastWeightbishi === "" && !hasPendingOfflineWeight) || weightMismatch) {
								if (weightMismatch) {
									this.lastWeightbishi = ""
								}
								this.Latest_weight = recipeWeight;
								if (weightMismatch) {
									this.forceRefreshRecipeDisplay()
								}
							}
							this.Latest_date = this.getUpdateTime(res.data, 'register', 'weight')
							const rawGoalKg = this.getRegisterVal(res.data, 'register', 'goal_weight');
							if (rawGoalKg && rawGoalKg !== '-/-' && rawGoalKg !== '--') {
								uni.setStorageSync('goalWeightKg', rawGoalKg);
							}
							this.Target_weight = this.isKgWeightUnit(this.chuhsikg) ?
								rawGoalKg : WeightConverter.kgToLb(rawGoalKg);
							this.Chest_circumference = this.getRegisterVal(res.data, 'register',
								'chest_circumference');
							this.waistline = this.getRegisterVal(res.data, 'register', 'waistline');
							this.Hip_circumference = this.getRegisterVal(res.data, 'register', 'hipline');
							this.Upper_Chest_circumference = this.getRegisterVal(res.data, 'register',
								'biceps_circumference'
							);
							this.Thigh_circumference = this.getRegisterVal(res.data, 'register',
								'thigh_circumference'
							);
							this.Calf_circumference = this.getRegisterVal(res.data, 'register',
								'calf_circumference'
							);
							// 主逻辑：遍历卡片列表并处理
							const kapianlist2 = uni.getStorageSync("kapianlist2") || [];
							for (let i = 0; i < kapianlist2.length; i++) {
								const item = kapianlist2[i];
								if (item.title === "BMI") {
									this.processGenericData(res.data, "BMI", "weight");
								} else if (item.title === "骨含量" || item.title === "Bone Mass") {
									this.processGenericData(res.data, item.title, "weight");
								} else if (
									item.title === "肌肉量" || item.title === "Muscle Mass"
								) {
									this.processGenericData(res.data, item.title, "weight");
								} else if (
									item
									.title ===
									"蛋白率" ||
									item
									.title ===
									"Protein%"
								) {
									this.processGenericData(
										res
										.data,
										item
										.title,
										"weight"
									);
								} else if (
									item
									.title ===
									"水分" ||
									item
									.title ===
									"Water%"
								) {
									this.processGenericData(
										res
										.data,
										item
										.title,
										"weight"
									);
								} else if (
									item
									.title ===
									"内脏脂肪指数" ||
									item
									.title ===
									"VFI"
								) {
									this.processGenericData(
										res
										.data,
										item
										.title,
										"weight"
									);
								} else if (
									item
									.title ===
									"脂肪率" ||
									item
									.title ===
									"Fat%"
								) {
									this.processGenericData(
										res
										.data,
										item
										.title,
										"weight"
									);
								} else if (
									item
									.title ===
									"基础代谢率" ||
									item
									.title ===
									"BMR"
								) {
									this.processGenericData(
										res
										.data,
										item
										.title,
										"weight"
									);
								} else if (
									item
									.title ===
									"皮下脂肪率" ||
									item
									.title ===
									"SubQ Fat%"
								) {
									this.processGenericData(
										res
										.data,
										item
										.title,
										"weight"
									);
								} else if (
									item
									.title ===
									"身体年龄" ||
									item
									.title ===
									"Body Age"
								) {
									this.processGenericData(
										res
										.data,
										item
										.title,
										"weight"
									);
								}
							}
							if (weightMismatch) {
								this.$nextTick(() => {
									this.list2 = [...(this.list2 || [])]
									this.forceRefreshRecipeDisplay()
								})
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
							this.sleep =
								this
								.getRegisterVal(
									res
									.data,
									'register',
									'sleep'
								);
							this.sleep_time =
								this
								.getUpdateTime(
									res
									.data,
									'register',
									'sleep'
								)
							if (this
								.getRegisterVal(
									res
									.data,
									'register',
									'sleep'
								) ===
								null ||
								this
								.getRegisterVal(
									res
									.data,
									'register',
									'sleep'
								) ===
								"-/-"
							) {
								this.totalLight =
									"--/--"
								this.totalDeep =
									"--/--"
								this.totalRem =
									"--/--"
								this.sleep_point =
									"--/--"
								this.sleep =
									"--/--"
								this.sleep_time =
									"--/--"
							} else if (
								this
								.getRegisterVal(
									res
									.data,
									'register',
									'sleep'
								) ===
								'0H0M'
							) {
								this.totalLight =
									"0H0M"
								this.totalDeep =
									"0H0M"
								this.totalRem =
									"0H0M"
								this.sleep_point =
									"--/--"
								this.sleep =
									"0H0M"
								this.sleep_time =
									this
									.getUpdateTime(
										res
										.data,
										'register',
										'sleep'
									)
							} else {
								this.totalLight =
									uni
									.getStorageSync(
										"totalLight"
									)
								this.totalDeep =
									uni
									.getStorageSync(
										"totalDeep"
									)
								this.totalRem =
									uni
									.getStorageSync(
										"totalRem"
									)
								// 1. 总睡眠小时数（ 保留 1 位小数）
								const
									totalAll =
									this
									.timeStrToMinutes(
										this
										.sleep
									); // 436
								const
									totalH =
									(totalAll /
										60
									)
									.toFixed(
										1
									)
								const
									deepMin =
									(this
										.timeStrToMinutes(
											this
											.totalDeep
										) /
										60
									)
									.toFixed(
										1
									);
								const
									remMin =
									(this
										.timeStrToMinutes(
											this
											.totalRem
										) /
										60
									)
									.toFixed(
										1
									);
								const
									lightMin =
									(this
										.timeStrToMinutes(
											this
											.totalLight
										) /
										60
									)
									.toFixed(
										1
									)
								this.sleep_point =
									this
									.overallSleepScore(
										totalAll,
										totalH,
										deepMin,
										remMin,
										lightMin
									)
								uni.setStorageSync(
									"sleep_point",
									this
									.sleep_point
								)
							}
						} else if (this.currentIndex === 4) {
							this.applyTodayStepsFromApi(res.data)
						}
					}
				})
			},
			/** 概览同 register 常有多条（如 slaveSn 2/3），按 updateTime 取最新 */
			pickLatestRecipeByRegister(dataList, registerKey) {
				if (!Array.isArray(dataList) || !dataList.length) {
					return {
						value: '-/-',
						time: null,
						item: null
					};
				}
				let best = null;
				let bestSec = -1;
				for (let i = 0; i < dataList.length; i++) {
					const row = dataList[i];
					if (!row || row.register !== registerKey) {
						continue;
					}
					const sec = this.toUnixSeconds(row.updateTime);
					if (!best || sec > bestSec) {
						best = row;
						bestSec = sec;
					}
				}
				if (!best) {
					return {
						value: '-/-',
						time: null,
						item: null
					};
				}
				const val = (best.registerVal !== null && best.registerVal !== undefined &&
					best.registerVal !== '') ? best.registerVal : '-/-';
				return {
					value: val,
					time: best.updateTime,
					item: best
				};
			},
			findValue(
				arr,
				key,
				value
			) {
				for (
					let i =
						0; i <
					arr
					.length; i++
				) {
					if (arr[
							i]
						[
							key
						] ==
						value
					) {
						return arr[
							i
						]
					}
				}
				return null
			},
			robustParseData(
				dataStr
			) {
				if (dataStr ===
					"bloodData"
				) {
					uni.setStorageSync(
						"kapianlist",
						""
					)
					return
				}
				if (dataStr ===
					"WeightData"
				) {
					uni.setStorageSync(
						"kapianlist2",
						""
					)
					return
				}
				try {
					// 分割每个对象
					const
						objects =
						dataStr
						.split(
							'},{'
						);
					const
						result = [];
					for (
						let i =
							0; i <
						objects
						.length; i++
					) {
						let objStr =
							objects[
								i
							];
						// 修复首尾对象的花括号
						if (i ===
							0
						)
							objStr =
							objStr +
							'}';
						else if (
							i ===
							objects
							.length -
							1
						)
							objStr =
							'{' +
							objStr;
						else objStr =
							'{' +
							objStr +
							'}';
						// 移除可能的多余花括号
						objStr
							=
							objStr
							.replace(
								/^{{/,
								'{'
							)
							.replace(
								/}}$/,
								'}'
							);
						// 修复键值对
						const
							fixedObjStr =
							objStr
							.replace(
								/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g,
								(match,
									key,
									value
								) => {
									value
										=
										value
										.trim();
									// 处理布尔值
									if (value ===
										'true' ||
										value ===
										'false'
									) {
										return `"${key}":${value}`;
									}
									// 处理数字
									if (!
										isNaN(
											value
										) &&
										value !==
										'' &&
										!
										value
										.includes(
											'/'
										)
									) {
										return `"${key}":${value}`;
									}
									// 处理字符串
									return `"${key}":"${value}"`;
								}
							);
						try {
							const
								obj =
								JSON
								.parse(
									fixedObjStr
								);
							result
								.push(
									obj
								);
						} catch (
							e
						) {
							console
								.warn(
									'解析单个对象失败:',
									fixedObjStr,
									e
								);
						}
					}
					return result;
				} catch (
					error
				) {
					console
						.error(
							'解析失败:',
							error
						);
					return [];
				}
			},



			// 定义一个函数来封装血压等级判断逻辑
			updateBloodPressureStatus(lowPressure, highPressure) {
				this.xueya = -1; // 初始化为未知状态
				this.title_name = this.$t("未知");
				const pressureRanges = [{
						lowMin: 61,
						lowMax: 80,
						highMin: 91,
						highMax: 120,
						level: 0,
						name: this.$t("正常血压")
					}, // 正常血压
					{
						lowMin: 81,
						lowMax: 90,
						highMin: 121,
						highMax: 140,
						level: 1,
						name: this.$t("正常高血压值")
					}, // 正常高血压值
					{
						lowMin: 91,
						lowMax: 100,
						highMin: 141,
						highMax: 160,
						level: 2,
						name: this.$t("一级高血压")
					}, // 一级高血压
					{
						lowMin: 101,
						lowMax: 110,
						highMin: 161,
						highMax: 180,
						level: 3,
						name: this.$t("二级高血压")
					} // 二级高血压
				];
				for (
					const
						range of
						pressureRanges
				) {
					if ((lowPressure >=
							range
							.lowMin &&
							lowPressure <=
							range
							.lowMax
						) ||
						(highPressure >=
							range
							.highMin &&
							highPressure <=
							range
							.highMax
						)
					) {
						this.xueya =
							range
							.level;
						this.title_name =
							range
							.name;
						break;
					}
				}
			},

			//获取体脂秤身体指数数据，并更新到卡片上
			get_device_data(deviceSn) {
				const data = {
					deviceSn: deviceSn
				}
				this.$post(this.$url_APP_IP + this.$url_get_device_data, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/x-www-form-urlencoded'
				}).then(res => {
					if (res.code === 200) {
						const kapianlist2 = uni.getStorageSync("kapianlist2") || [];
						let itelistasd2 = []
						const data = res.data;
						for (let i = 0; i < kapianlist2.length; i++) {
							const item = kapianlist2[i];
							if (item.title === "BMI") {
								this.updateBMI(data);
							} else if (item.title === "骨含量" || item.title === "Bone Mass") {
								this.updateCard(data, item.title, "BM", this.$t("骨含量"));
							} else if (item.title === "肌肉量" || item.title === "Muscle Mass") {
								this.updateCard(data, item.title, "ROM", this.$t("肌肉量"));
							} else if (item.title === "蛋白率" || item.title === "Protein%") {
								this.updateCard(data, item.title, "PP", this.$t("蛋白率"));
							} else if (item.title === "水分" || item.title === "Water%") {
								this.updateCard(data, item.title, "MOI", this.$t("水分"));
							} else if (item.title === "内脏脂肪指数" || item.title === "VFI") {
								this.updateCard(data, item.title, "UVI", this.$t("内脏脂肪指数"));
							} else if (item.title === "脂肪率" || item.title === "Fat%") {
								this.updateCard(data, item.title, "BFR", this.$t("脂肪率"));
							} else if (
								item
								.title ===
								"基础代谢率" ||
								item
								.title ===
								"BMR"
							) {
								this.updateCard(
									data,
									item
									.title,
									"BMR",
									this
									.$t(
										"基础代谢率")
								);
							} else if (
								item
								.title ===
								"皮下脂肪率" ||
								item
								.title ===
								"SubQ Fat%"
							) {
								this.updateCard(
									data,
									item
									.title,
									"SFR",
									this
									.$t(
										"皮下脂肪率")
								);
							} else if (
								item
								.title ===
								"身体年龄" ||
								item
								.title ===
								"Body Age"
							) {
								this.updateCard(
									data,
									item
									.title,
									"PA",
									this
									.$t(
										"身体年龄")
								);
							}
							itelistasd2
								.push(
									item
								)
						}
						this.cardeditData(
							itelistasd2,
							"WeightData"
						)
					}
				})
			},

			tiaozhen() {
				this.binaji =
					false
				this.animation =
					'shake';
				this.button_show =
					true
				this.delate_icon =
					true
				this.disabledsaaa =
					true
				this.disabletouch =
					true
			},
			tiaozhen2() {
				this.binaji2 =
					false
				this.animation2 =
					'shake';
				this.button_show2 =
					true
				this.delate_icon2 =
					true
				this.disabledsaaa2 =
					true
				this.disabletouch =
					true
			},

			add_bt_xy() {
				uni.navigateTo({
					url: "../main/card1"
				})
				this.cardeditData(
					this
					.list,
					"bloodData"
				)
			},

			add_bt2() {
				uni.navigateTo({
					url: '../main/card'
				})
				this.cardeditData(
					this
					.list2,
					"WeightData"
				)
			},

			ture_bt() {
				this.binaji =
					true
				this.animation =
					'';
				this.button_show =
					false
				this.delate_icon =
					false
				this.disabledsaaa =
					true
				this.disabletouch =
					false
				this.cardeditData(
					this
					.list,
					"bloodData"
				)
			},

			ture_bt2() {
				this.binaji2 =
					true
				this.animation2 =
					'';
				this.button_show2 =
					false
				this.delate_icon2 =
					false
				this.disabledsaaa2 =
					true
				this.disabletouch =
					false
				this.cardeditData(
					this
					.list2,
					"WeightData"
				)
			},

			xw_handleChange(
				e) {
				this.xw_value =
					e;
			},
			yw_handleChange(
				e) {
				this.yw_value =
					e;
			},
			tw_handleChange(
				e) {
				this.tw_value =
					e;
			},
			stw_handleChange(
				e) {
				this.stw_value =
					e;
			},
			dtw_handleChange(
				e) {
				this.dtw_value =
					e;
			},
			xtw_handleChange(
				e) {
				this.xtw_value =
					e;
			},
			xueya_tap() {
				this.$refs
					.popup
					.open(
						"center"
					)
			},
			BMI_tap(
				id) {
				if (id ==
					this
					.$t(
						"血氧")
				) {
					this.$refs
						.popup2
						.open(
							"center"
						)
				} else {
					this.$refs
						.popup1
						.open(
							"center"
						)
				}
			},
			knowe() {
				this.$refs
					.popup
					.close()
			},
			knowe1() {
				this.$refs
					.popup1
					.close()
			},
			knowe2() {
				this.$refs
					.popup2
					.close()
			},
			jitizhong_tc() {
				if (this
					.tizhong ===
					"" ||
					this
					.tizhong ===
					undefined
				) {
					uni.showToast({
						title: this
							.$t(
								'请输入体重'),
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
				if (this
					.xiongwei ===
					"" ||
					this
					.xiongwei ===
					undefined
				) {
					uni.showToast({
						title: this
							.$t(
								'请输入胸围'),
						icon: 'none'
					})
					return
				} else if (
					this
					.yaowei ===
					"" ||
					this
					.yaowei ===
					undefined
				) {
					uni.showToast({
						title: this
							.$t(
								'请输入腰围'),
						icon: 'none'
					})
					return
				} else if (
					this
					.tunwei ===
					"" ||
					this
					.tunwei ===
					undefined
				) {
					uni.showToast({
						title: this
							.$t(
								'请输入臀围'),
						icon: 'none'
					})
					return
				} else if (
					this
					.shangtunwei ===
					"" ||
					this
					.shangtunwei ===
					undefined
				) {
					uni.showToast({
						title: this
							.$t(
								'请输入上臂围'),
						icon: 'none'
					})
					return
				} else if (
					this
					.datuiwei ===
					"" ||
					this
					.datuiwei ===
					undefined
				) {
					uni.showToast({
						title: this
							.$t(
								'请输入大腿围'),
						icon: 'none'
					})
					return
				} else if (
					this
					.xiaotuiwei ===
					"" ||
					this
					.xiaotuiwei ===
					undefined
				) {
					uni.showToast({
						title: this
							.$t(
								'请输入小腿围'),
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
			isVitalCardIcon(title) {
				if (!title)
					return false
				const
					t =
					String(
						title
					)
				return t ===
					this
					.$t(
						'心率') ||
					t ===
					this
					.$t(
						'血氧') ||
					t ===
					'Heart' ||
					t ===
					'SpO₂'
			},

			//心血管页面，卡片点击按钮
			listclisck(item) {
				if (!this.binaji || !item) {
					return;
				}
				if (item.title === "心率" || item.title === "Heart") {
					this.xueyaclicklink(0);
				} else if (item.title === "血氧" || item.title === "SpO₂") {
					console.log("点击了列表血氧数据");
					this.xueyaclicklink(2);
				}
			},

			/**
			 * 心血管页面根据点击的type类型发送对应的测量命令
			 * @param {Object} type
			 */
			xueyaclicklink(type) {
				let that = this
				if (that.devicetype === 10001 && that.devicetypelist.length <= 1) {
					uni.showToast({
						title: that.$t('遥控测试功能只支持在手表上使用请确认手表和已连接'),
						icon: 'none',
						duration: 2000,
					})
					return
				}
				let buffer2 = that.devicetype === 30001 ?
					that.toArrayBuffer("32000000000000000000000000000032") :
					that.toArrayBuffer("e00006f4060105000101") //血压
				if (type === 0) {
					// BPW1：心血管页「心率」下发 F3（新固件=纯心率；旧固件手表可能走情绪流程，App 侧不启 PPG 会话）
					// 勿仅凭 otadatares 白名单拦截：OTA 比对常清掉 otadatares，会导致新固件也无法测心率
					if (that.devicetype === 30001) {
						buffer2 = that.toArrayBuffer("38000000000000000000000000000038")
					} else {
						buffer2 = that.toArrayBuffer("e00006f3060104000101")
					}
				} else if (type === 1) {
					buffer2 = that.devicetype === 30001 ?
						that.toArrayBuffer("32000000000000000000000000000032") :
						that.toArrayBuffer("e00006f4060105000101") //血压
				} else if (type === 2) {
					buffer2 = that.devicetype === 30001 ?
						that.toArrayBuffer("39000000000000000000000000000039") :
						that.toArrayBuffer("e00006f5060106000101") //血氧
				}
				uni.showModal({
					content: type === 1 ? that.$t("测量时请保持安静手表与心脏同高五指张开不要压迫胸口") : that.$t("开始测量"),
					confirmText: that.$t('确定'),
					cancelText: that.$t('取消'),
					success(modal) {
						if (modal.confirm) {
							if (type === 0) {
								// 卡片测心率：只测心率，强制不进入 PPG/情绪会话
								that.enterBPW1PureHrMeasure()
								console.log('BPW1遥控心率', readBpw1OtaFirmwareId() || '固件标识未知',
									isBpw1NewEmotionFirmware() ? '新固件F3纯心率' : 'F3下发(App不启PPG)')
							} else {
								that.clearBPW1PureHrMeasure()
							}
							that.BPW6_BPW1_sendWrite(buffer2)
						}
					}
				})
			},

			BPW6_BPW1_sendWrite(buffer2) {
				const that = this
				if (that.devicetype === 30001) {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceIdwatch6 ? that.deviceIdwatch6 : uni.getStorageSync("BPW6devicemac"),
						serviceId: BPW6SERVICE,
						characteristicId: BPW6WRITE,
						writeType: 'write',
						value: buffer2,
						success(BPW6success) {
							uni.showToast({
								title: that.$t('开始测量'),
								icon: 'none',
								duration: 2000,
							})
						},
						fail(BPW6fail) {
							uni.showToast({
								title: that.$t('测量发送失败请检查设备'),
								icon: 'none',
								duration: 2000,
							})
							console.log("血压指令发送失败", BPW6fail)
						}
					})
				} else {
					uni.writeBLECharacteristicValue({
						deviceId: that.deviceIdwatch ? that.deviceIdwatch : uni.getStorageSync("deviceIdwatch"),
						serviceId: BPW1serviceId,
						characteristicId: BPW1write,
						writeType: 'write',
						value: buffer2,
						complete(complete) {
							if (complete.code === 10007) {
								uni.showToast({
									title: that.$t('开始测量'),
									icon: 'none',
									duration: 2000,
								})
							} else {
								uni.showToast({
									title: that.$t('测量发送失败请检查设备'),
									icon: 'none',
									duration: 2000,
								})
								console.log("血压指令发送失败", complete)
							}
						}
					})
				}
			},
			xueyaclick() {
				this.$refs.qs_popup.open("center")
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
				this.birthday = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
			},
			dataclick1() {
				this.$refs.myPicker1.show();
			},
			handleSubmit1(e) {
				this.birthday1 = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
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
			fat_scale_tz1() {
				let timestamp = new Date(new Date().toISOString().slice(0, 10) + " " + new Date().getHours() + ":" +
					new Date().getMinutes()).getTime() / 1000; // 将时间转换成时间戳（以秒为单位）
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
				let timestamp = Math.floor(new Date(that.birthday == that.$t('今天') ?
					`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}` :
					that.birthday).getTime() / 1000);
				let data = {
					slaveSn: "1",
					slaveData: {
						start_weight: '', //初始体重
						goal_weight: '', //目标体重 
						chest_circumference: that.xiongwei, //胸围  
						waistline: that.yaowei, //腰围   
						hipline: that.tunwei, //臀围   
						biceps_circumference: that.shangtunwei, //上臂围 
						thigh_circumference: that.datuiwei, //大腿围  
						calf_circumference: that.xiaotuiwei, //小腿围   
					},
					time: timestamp,
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				};
				that.$post(that.$url_APP_IP + that.$url_fat_scale, data, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json' //自定义请求头信息
				}).then((res) => {
					if (res.code === 200) {
						that.birthday = that.$t('今天')
						that.xiongwei = '' //腰围   
						that.yaowei = '' //臀围   
						that.tunwei = '' //上臂围   
						that.shangtunwei = '' //大腿围 
						that.datuiwei = '' //小腿围   
						that.xiaotuiwei = ''
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						that.list_recipe()
						that.$refs.tihzi_popup_sd.close()
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
			onMenuOpen() {},
			/** OTA获取手表信息数据解析
			 * @param {Object} hexData
			 * @param {Object} BWP1DeviceId
			 * @param {Object} BPW1serviceId
			 * @param {Object} BPW1write
			 */
			async Watch_update(hexData, BWP1DeviceId, BPW1serviceId, BPW1write) {
				let that = this
				if (hexData.length === 20) {
					switch (hexData.slice(18, hexData.length)) {
						case "01":
							console.log("手表电量不足")
							uni.showModal({
								content: that.$t("手表电量不足"),
								confirmText: that.$t('确定'),
								showCancel: false,
								success() {}
							});
							await that.sendack(hexData, BWP1DeviceId, BPW1serviceId, BPW1write);
							that.resetDataState("20")
							return
							break
						case "02":
							await that.sendack(hexData, BWP1DeviceId, BPW1serviceId, BPW1write);
							that.resetDataState("17")
							break
						case "03":
							await that.sendack(hexData, BWP1DeviceId, BPW1serviceId, BPW1write);
							that.resetDataState("18")
							break
						case "04":
							await that.sendack(hexData, BWP1DeviceId, BPW1serviceId, BPW1write);
							that.resetDataState("19")
							break
					}
				}
				if (hexData.length > 20 && hexData.length < 160) {
					const bytes = hexData.slice(18, hexData.length);
					console.log("手环信息更新", bytes)
					uni.setStorageSync("otadatares", bytes.toUpperCase())
					uni.setStorageSync("otaBP", bytes.toUpperCase())
					if (that.sleep_alertid === 1 || uni.getStorageSync("sendwatch") === 1) {
						that.resetDataState("情绪测量")
						return
					}
					await that.sendack(hexData, BWP1DeviceId, BPW1serviceId, BPW1write);
					that.loadFiles(bytes.toUpperCase(), BWP1DeviceId, BPW1serviceId)
				}
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
						rawText = [].map.call(new Uint8Array(buf), b => String.fromCharCode(b)).join(''); // App 环境
					}
					// 3. 提取唯一码 - 改进正则表达式
					const uniqueCode = rawText.match(/unique_code\s*[=:]\s*([0-9A-Fa-f]+)/)?.[1] || rawText.match(
						/unique_code\s*([0-9A-Fa-f]+)/)?.[1] || rawText.match(/([0-9A-Fa-f]{16,})/)?.[1];
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
							ackConfigByteset[8] = 0x01; //0x01是OTA升级，0x02是升级狗
							let ackConfigBytesum2 = 0;
							for (let i = 0; i < ackConfigByteset.length; i++) {
								ackConfigBytesum2 += ackConfigByteset[i];
							}
							ackConfigBytesum2 = ackConfigBytesum2 % 256;
							const modifiedCommand2 = new Uint8Array(ackConfigByteset.length + 1);
							modifiedCommand2.set(ackConfigByteset.subarray(0, 3), 0);
							modifiedCommand2[3] = ackConfigBytesum2;
							modifiedCommand2.set(ackConfigByteset.subarray(3), 4);
							const hexCommand2 = Array.from(modifiedCommand2).map(byte => byte.toString(16).padStart(2,
								'0')).join('');
							const buffer2 = that.toArrayBuffer(hexCommand2);
							setTimeout(() => {
								uni.removeStorageSync("arguments00")
								uni.$emit('updateIdChanged', 1)
								uni.writeBLECharacteristicValue({
									deviceId: deviceId,
									serviceId: BPW1serviceId,
									characteristicId: BPW1write,
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
			// 综合健康指数说明按钮，点击打开弹窗
			health_Explanation() {
				this.$refs.health_Explanationpopu.open("center")
			},
			// 综合健康指数说明按钮，点击关闭弹窗
			health_Explanationpopuclose() {
				this.$refs.health_Explanationpopu.close()
			},
			/************************新增ECG功能start************/
			getEcgWaveRef() {
				const item = this.$refs.ecgSwiperItem
				return item && item.$refs && item.$refs.wave
			},
			// 清空波形数据
			clearWave() {
				const wave = this.getEcgWaveRef()
				if (!wave) return
				wave.clear();
				this.dataCount = 0;
				this.fullDataCount = 0;
				this.queueLength = 0;
				this.measurementStatus = '';
				this.tip = '数据已清空';
			},
			//ECG测量按钮
			startbtn() {
				console.log('开始测量前状态:', {
					isMeasuring: this.getEcgWaveRef().isMeasuring,
					showFullWave: this.getEcgWaveRef().showFullWaveMode,
					dataLength: this.getEcgWaveRef().dataList.length
				});
				this.clearWave();
				this.sendCnt = 0;
				// 先重置波形组件状态，确保在实时测量模式
				this.getEcgWaveRef().clear();
				this.getEcgWaveRef().stopMeasurement();
				this.getEcgWaveRef().hideFullWave();
				// 延迟一小段时间确保状态重置完成
				setTimeout(() => {
					// 再次确认状态
					if (this.getEcgWaveRef().showFullWaveMode) {
						console.warn('警告：开始测量时仍处于完整波形模式，强制重置');
						this.getEcgWaveRef().showFullWaveMode = false;
						this.getEcgWaveRef().showFullWaveControls = false;
					}
					this.getEcgWaveRef().startMeasurement();
					this.send(this.deviceIdECG, this.serviceIdECG, this.uuidECG);
					console.log('开始测量后状态:', {
						isMeasuring: this.getEcgWaveRef().isMeasuring,
						showFullWave: this.getEcgWaveRef().showFullWaveMode
					});
				}, 50);
			},
			send(deviceId, serviceId, writeCharId) {
				const hex = 'A51201130A';
				if (this.sendCnt >= 3) {
					this.sendCnt = 0; // 重置，方便下次再发
					return;
				}
				this.sendCnt++;
				uni.writeBLECharacteristicValue({
					deviceId,
					serviceId: SERVICE_ID,
					characteristicId: WRITE_UUID,
					writeType: 'write',
					value: this.toArrayBuffer(hex),
					success: () => {
						console.log(`第${this.sendCnt}次写入成功`);
						setTimeout(() => this.send(deviceId, SERVICE_ID, WRITE_UUID), 50);
						if (this.sendCnt === 3) {
							uni.showToast({
								title: this.$t("请开始测量"),
								icon: 'none',
								duration: 1500
							})
						}
					},
					fail: e => {
						console.error(`第${this.sendCnt}次写入失败`, e)
						uni.showToast({
							title: this.$t("ECG设备连接中"),
							icon: 'none',
							duration: 1500
						})
						this.getEcgWaveRef().hideFullWave();
					}
				});
			},
			/* ==================== 协议层 ==================== */
			/* 分包拼接解析 */
			tryParse() {
				while (true) {
					const idx = this.buffer.indexOf('0a')
					if (idx === -1) break
					const frameHex = this.buffer.slice(0, idx + 2)
					this.buffer = this.buffer.slice(idx + 2)
					const frame = new Uint8Array(frameHex.match(/.{2}/g).map(b => parseInt(b, 16)))
					if (frame.length < 5) continue
					const head = frame[0]
					if (head === 0x23) this.parseWave(frame)
					else if (head === 0xA6) this.parseCmd(frame)
				}
			},
			parseWave(buf) {
				if (buf[buf.length - 1] !== 0x0A) return;
				const sumRx = buf[buf.length - 2];
				const sumCalc = buf.slice(1, -2).reduce((s, b) => s + b, 0) & 0xFF;
				if (sumRx !== sumCalc) return;
				const str = String.fromCharCode(...buf.slice(1, -2));
				const val = parseFloat(str);
				if (Number.isNaN(val)) return;
				this.getEcgWaveRef().pushData([val]);
				this.dataCount++;
				this.fullDataCount = this.getEcgWaveRef().getFullDataCount();
				this.queueLength = this.getEcgWaveRef().getQueueLength();
			},
			// 获取心电图波形引用
			getWaveRef() {
				return this.$refs.ecgSwiperItem && this.$refs.ecgSwiperItem.$refs.wave;
			},
			parseCmd(buf) {
				if (buf[1] !== 0x15) return;
				const map = {
					0x00: '采集结束',
					0x01: '采集开始',
					0x02: '采集错误（未按键/提前结束）'
				};
				this.measurementStatus = map[buf[2]] || '未知状态';
				this.tip = this.measurementStatus;
				if (buf[2] === 0x00) {
					// 测量结束，提示用户可以查看完整波形
					setTimeout(() => {
						this.getWaveRef().showFullWave();
						this.baseFeaturesExtracted = this.$t("未完成")
						this.derivedFeaturesExtracted = this.$t("未完成")
						this.qualityScore = this.$t("云端数据计算中")
						this.modelScore = this.$t("云端数据计算中")
					}, 500);
					// ✅ 采集结束，获取最终数据
					const finalData = this.getEcgWaveRef().getFullDataList(); // ✅ 拿到子组件数据
					const duration = finalData.length / this.getEcgWaveRef().getsampleRate();
					const minVal = Math.min(...finalData);
					const maxVal = Math.max(...finalData);
					const diff = maxVal - minVal; // 就是 max-min
					const avgVal = finalData.reduce((a, b) => a + b, 0) / finalData.length;
					console.log('✅ 采集结束，最终数据:', {
						totalPoints: finalData.length,
						duration: duration.toFixed(2) + 's',
						min: minVal.toFixed(3),
						max: maxVal.toFixed(3),
						avg: avgVal.toFixed(3),
						data: finalData // 你可以在这里上传或保存
					});
					// ✅ 可选：上传或保存
					this.saveFinalData(finalData, diff);
				} else if (buf[2] === 0x02) {
					uni.showToast({
						title: this.$t("用户未按开始键或已暂停"),
						icon: 'none'
					});
				}
			},

			// 使用
			saveFinalData(data, diff) {
				console.log("数据", data)
				const packed = this.packInt16ECG(data);
				const payload = {
					deviceId: this.deviceId,
					sampleRate: this.getEcgWaveRef().getsampleRate(),
					duration: data.length / this.getEcgWaveRef().getsampleRate(),
					data: this.ab2hex(packed.buffer),
					voltageRange: packed.voltageRange,
				}
				console.log("payload", payload)
				let ecgdata = {
					patientId: uni.getStorageSync("userid"), //患者id
					deviceSn: uni.getStorageSync("ECGdeviceSn"), //设备sn
					deviceModel: uni.getStorageSync("deviceModelName"), //设备型号
					samplingRate: payload.sampleRate, //采样率(Hz)
					startTime: this.getCurrentTime(), // payload.duration, 采集开始时间(微秒精度)
					dataFormat: 'INT16', //数据编码格式
					voltageRange: payload.voltageRange, //电压范围(mV)
					rawData: payload.data, //二进制波形数据
					dataLength: this.fullDataCount, //自动计算采样点数
					baseFeaturesExtracted: '',
					derivedFeaturesExtracted: '',
					qualityScore: '',
					modelScore: '',
					measurementTs: this.UTCdatatime().timestampSec,
					measurementTimezone: this.getTimeAllJSON().YMDHMS,
				}
				console.log("ecgdata", ecgdata)
				this.$post(this.$url_APP_IP + '/prod-api/device/ecgdata', ecgdata, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((ecgdatares) => {
					if (ecgdatares.code === 200) {
						console.log('✅ 数据上传成功', ecgdatares);
						uni.showLoading({
							title: this.$t("正在云端计算中请稍后"),
							mask: false
						})
						this.ecgdatalist()
					} else {
						console.error('❌ 数据上传失败', ecgdatares);
					}
				})
			},
			ecgbtn(createTime, startTime, id, rawData) {
				uni.navigateTo({
					url: '/pages/tabBar/main/ecgFull',
					success: (res) => {
						console.log("ecgbtn", res)
						const mvArr = this.ECGunpackInt16(this.toArrayBuffer(rawData));
						res.eventChannel.emit('sendData', mvArr);
						res.eventChannel.emit('startTime', startTime);
						res.eventChannel.emit('createTime', createTime);
						uni.setStorageSync('sendData', mvArr);
					}
				});
			},

			ecgdatalist() {
				let ecgdata = {
					patientId: uni.getStorageSync("userid"),
					startTime: this.getCurrentTime()
				}
				console.log("ecgdata", ecgdata)
				this.$get(this.$url_APP_IP + '/prod-api/device/ecgdata/list', ecgdata, {
					'Authorization': 'Bearer ' + uni.getStorageSync("token"),
					'content-type': 'application/json;charset=UTF-8'
				}).then((ecgdatares) => {
					if (ecgdatares.code === 200 && ecgdatares.total > 0) {
						if (ecgdatares.rows[ecgdatares.total - 1].baseFeaturesExtracted !== 1) {
							setTimeout(() => {
								this.ecgdatalist()
							}, 5000)
						} else {
							uni.hideLoading();
						}
						this.ecgdatarows = []
						this.ecgdatarows = ecgdatares.rows.slice().reverse()
						const latestRow = ecgdatares.rows[ecgdatares.total - 1];
						const newData = this.unpackInt16ECG(this.toArrayBuffer(latestRow.rawData), latestRow
							.voltageRange || 500
						);
						this.getEcgWaveRef().generateApiData(newData, latestRow.voltageRangek);
						this.baseFeaturesExtracted = ecgdatares.rows[ecgdatares.total - 1]
							.baseFeaturesExtracted === 1 ? this.$t("完成") : this.$t("未完成")
						this.derivedFeaturesExtracted = ecgdatares.rows[ecgdatares.total - 1]
							.derivedFeaturesExtracted === 1 ? this.$t("完成") : this.$t("未完成")
						this.qualityScore = ecgdatares.rows[ecgdatares.total - 1].baseFeaturesExtracted === 1 ?
							ecgdatares.rows[ecgdatares.total - 1].qualityScore : this.$t("云端数据计算中")
						this.modelScore = ecgdatares.rows[ecgdatares.total - 1].baseFeaturesExtracted === 1 ?
							ecgdatares.rows[ecgdatares.total - 1].modelScore : this.$t("云端数据计算中")
					} else {
						uni.hideLoading();
						this.baseFeaturesExtracted = "-/-"
						this.derivedFeaturesExtracted = "-/-"
						this.qualityScore = "-/-"
						this.modelScore = "-/-"
						let newdatanull = [0]
						this.getEcgWaveRef().generateApiData(newdatanull);
					}
				})
			},

			/* ==================== UI ==================== */
			toggleStats() {
				this.statsVisible = !this.statsVisible
			},

			disConnect() {
				if (!this.deviceId) return
				uni.closeBLEConnection({
					deviceId: this.deviceId
				})
				uni.closeBluetoothAdapter()
				this.connected = false
				this.deviceId = ''
				this.notifyCharacteristicId = ''
				this.writeCharacteristicId = ''
				this.dataSource = '未连接'
				this.tip = '已断开'
			},

			/* ==================== 新增ECG方法 end ==================== */

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
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 10050;

		.show {
			width: 100vw;
			height: 100vh;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			padding: 0 48rpx;
			box-sizing: border-box;
			margin: auto;
			z-index: 2;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.over {
			width: 100%;
			height: 100%;
			background-color: rgba(220, 238, 252, 0.96);
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1;
		}

		.show-close-top {
			position: absolute;
			top: 120px;
			right: 48rpx;
			display: flex;
			justify-content: flex-end;
			z-index: 1;
		}

		.show-close-btn {
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;
			background: #3298F7;
			box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.show-body {
			width: 100%;
		}

		.show-date {
			color: #000000;
			font-size: 80rpx;
			font-weight: bold;
			line-height: 1.1;
		}

		.show-tip {
			display: flex;
			flex-direction: row;
			align-items: stretch;
			margin-top: 28rpx;
		}

		.show-tip-bar {
			width: 8rpx;
			background: #1A4A73;
			border-radius: 8rpx;
			flex-shrink: 0;
		}

		.show-tip-text {
			color: #1A4A73;
			font-size: 28rpx;
			line-height: 1.55;
			margin-left: 20rpx;
			flex: 1;
		}

		.show-cards {
			display: flex;
			flex-direction: row;
			margin-top: 80rpx;
		}

		.show-card {
			flex: 1;
			background: #FFFFFF;
			border-radius: 40rpx;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.4);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 56rpx 16rpx 48rpx;
		}

		.show-card+.show-card {
			margin-left: 24rpx;
		}

		.show-card-icon {
			width: 112rpx;
			height: 112rpx;
			border-radius: 56rpx;
			box-shadow: 0 8rpx 28rpx rgba(37, 149, 211, 0.28);
		}

		.show-card-label {
			margin-top: 24rpx;
			font-weight: bold;
			text-align: center;
			color: #000000;
			font-size: 30rpx;
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
		-webkit-overflow-scrolling: touch;
	}

	.scroll-view-bp {
		margin-top: 8px;
	}

	.bp-home-scroll-inner {
		background: #F8F9FB;
		padding-bottom: calc(20px + constant(safe-area-inset-bottom));
		padding-bottom: calc(20px + env(safe-area-inset-bottom));
		transform: translateZ(0);
		padding-bottom: 180px;
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
		padding-top: 80px;
		color: #8E8E93;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.title_zs_yundong {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 50px;
		color: white;
		padding-bottom: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.bp-log-panel {
		margin: 10px 10px 20px;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 8px;
		overflow: hidden;
	}

	.bp-log-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		border-bottom: 1px solid #eee;
	}

	.bp-log-title {
		font-size: 12px;
		color: #333;
		font-weight: 500;
	}

	.bp-log-header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.bp-log-copy-btn {
		font-size: 12px;
		color: #3298F7;
	}

	.bp-log-clear-btn {
		font-size: 12px;
		color: #F55A5A;
	}

	.bp-log-content {
		max-height: 280px;
		padding: 8px 12px;
	}

	.bp-log-text {
		font-size: 10px;
		color: #666;
		line-height: 1.5;
		word-break: break-all;
		white-space: pre-wrap;
	}

	.title_zs_ZM {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 60px;
		color: #667eea;
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




	.pulse-diagnosis-tab {
		background: linear-gradient(135deg, #e0f2e9 0%, #b9dfcc 100%);
		padding-bottom: 80px;
		min-height: 100%;
	}

	.scroll-view-pulse {
		background: linear-gradient(135deg, #e0f2e9 0%, #b9dfcc 100%);
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

	.bp-measure-icon-anim {
		animation: bpMeasurePulse 1.4s ease-in-out infinite;
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

	.card-vital-icon-halo {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		border: 2px solid rgba(50, 152, 247, 0.4);
		box-shadow: 0 0 8px rgba(50, 152, 247, 0.45);
		animation: cardVitalHaloPulse 1.6s ease-in-out infinite;
	}

	.card-vital-icon-img {
		position: relative;
		z-index: 1;
		width: 44px;
		height: 44px;
		object-fit: contain;
	}

	@keyframes cardVitalHaloPulse {

		0%,
		100% {
			opacity: 0.75;
		}

		50% {
			opacity: 1;
		}
	}

	.bp-measure-btn {
		padding: 6px 0;
		min-width: 56px;
	}

	@keyframes bpMeasurePulse {

		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}

		25% {
			transform: scale(1.12);
			opacity: 0.92;
		}

		50% {
			transform: scale(1);
			opacity: 1;
		}

		75% {
			transform: scale(1.06);
			opacity: 0.96;
		}
	}

	.img_style_celiang {
		width: 48px;
		height: 48px;
		border-radius: 50px;
		object-fit: contain;
	}




	/* ECG核心样式*/
	.title_zs_ECG {
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
		margin-left: 20px;
		text-align: right;
		padding-top: 60px;
		color: red;
		padding-bottom: 5px;
		margin-top: 5px;
		font-weight: 400;
		font-size: 12px;
	}

	.ecg_page {
		display: flex;
		flex-direction: column;
		/* height: 100vh; */
		padding-bottom: 100px;
		background: white;
	}

	.ecg-container {
		padding: 10px;
		overflow: visible;
		/* 减去左右 margin */
		box-sizing: border-box;

	}


	.control-panel {
		// background: #fff;
		// border-radius: 16rpx;
		padding: 24px;
		margin-top: 240px;
		// margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		// box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, .1);
	}

	.status-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		gap: 16rpx;
	}

	.status-indicator {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		background: #e0e0e0;
	}

	.status-indicator.connected {
		background: #07c160;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1
		}

		50% {
			opacity: .6
		}

		100% {
			opacity: 1
		}
	}

	.button-row {
		display: flex;
		gap: 12rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.btn {
		flex: 1;
		min-width: 160rpx;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
		border: none;
	}

	.btn.primary {
		background: #007aff;
		color: #fff;
	}

	.btn.warn {
		background: #ff3b30;
		color: #fff;
	}

	.btn.secondary {
		background: #f0f0f0;
		color: #333;
	}

	.tip {
		font-size: 24rpx;
		color: #666;
		text-align: center;
	}

	.stats-panel {
		background: #fff;
		border-radius: 16rpx;
		padding: 24px;
		margin-left: 10px;
		margin-right: 10px;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, .1);
	}

	.ecgdatarows_sty {
		margin: 20px 20px 0 20px;
	}

	.ecgdatarows_sty_item {
		display: flex;
		flex-direction: column;
		background: wheat;
		padding: 15px;
		border-radius: 20px;
		color: black;
		font-weight: bold;
	}

	.ecgdatarows_sty_item_1 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: black;
		font-weight: bold;
	}

	.ecgdatarows_sty_item_bt {
		border: 1px solid #07c160;
		padding: 5px 20px;
		border-radius: 100px;
	}

	.stats-row {
		display: flex;
		justify-content: space-between;
		padding: 8rpx 0;
	}

	.stats-label {
		font-size: 26rpx;
		color: #666;
	}

	.stats-value {
		font-size: 26rpx;
		color: #333;
		font-family: monospace;
		margin-left: 10px;
	}
</style>