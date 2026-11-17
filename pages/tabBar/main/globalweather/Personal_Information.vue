<template>
	<view class="container">
		<view class="header">
			<text class="title">{{$t("个人基本资料报告")}}</text>
			<text class="subtitle">{{$t("请如实填写以下信息")}}</text>
		</view>

		<!-- 基本信息 -->
		<view class="section">
			<view class="section-title">{{$t("基本信息")}}</view>
			<view class="form-item">
				<text class="label">{{$t("姓名")}}：</text>
				<input class="input" v-model="form.name" :placeholder="$t('请输入姓名')" />
			</view>
			<view class="form-item">
				<text class="label">{{$t("性别")}}：</text>
				<radio-group class="radio-group" @change="handleGenderChange">
					<label class="radio-item">
						<radio :value="$t('男')" :checked="getsex(form.gender) === $t('男')" color="#007AFF" />
						<text>{{$t("男")}}</text>
					</label>
					<label class="radio-item">
						<radio :value="$t('女')" :checked="getsex(form.gender) === $t('女')" color="#007AFF" />
						<text>{{$t("女")}}</text>
					</label>
				</radio-group>
			</view>
			<view class="form-item">
				<text class="label">{{$t("年龄")}}：</text>
				<input class="input" type="number" v-model="form.age" :placeholder="$t('请输入年龄')" />
				<text class="unit">{{$t('岁')}}</text>
			</view>
		</view>

		<!-- 身体数据 -->
		<view class="section">
			<view class="section-title">{{$t('身体数据')}}</view>
			<view class="form-item">
				<text class="label">{{$t('身高')}}：</text>
				<input class="input" type="digit" v-model="form.height" @blur="calculateMetrics"
					:placeholder="$t('请输入身高')" />
				<text class="unit">{{heightunit}}</text>
			</view>
			<view class="form-item">
				<text class="label">{{$t('体重')}}：</text>
				<input class="input" type="digit" v-model="form.weight" @blur="calculateMetrics"
					:placeholder="$t('请输入体重')" />
				<text class="unit">{{weightunit}}</text>
			</view>
			<view class="form-item">
				<text class="label">{{$t('腰围')}}：</text>
				<input class="input" type="digit" v-model="form.waist" @blur="calculateMetrics"
					:placeholder="$t('请输入腰围')" />
				<text class="unit">{{heightunit}}</text>
			</view>
		</view>

		<!-- 计算指标 -->
		<view class="section" v-if="showMetrics">
			<view class="section-title">{{$t('健康指标自动计算')}}</view>
			<view class="metrics-box">
				<view class="metric-item">
					<text class="metric-label">{{$t('BMI指数')}}</text>
					<text class="metric-value" :class="getBmiClass">{{ bmi }}</text>
					<text class="metric-status">{{ bmiStatus }}</text>
				</view>
				<view class="metric-item">
					<text class="metric-label">{{$t('腰围身高比')}}</text>
					<text class="metric-value" :class="getWhtrClass">{{ whtr }}</text>
					<text class="metric-status">{{ whtrStatus }}</text>
				</view>
			</view>
		</view>

		<!-- 睡眠数据 -->
		<view class="section">
			<view class="section-title">{{$t('睡眠数据')}}</view>
			<block v-if="hasSleepData">
				<view class="form-item">
					<text class="label">{{$t('睡眠时长')}}：</text>
					<text class="duration-text">{{ sleepData.sleep }}</text>
				</view>
				<view class="form-item" v-if="sleepData.sleep_time">
					<text class="label">{{$t('测量日期')}}：</text>
					<text class="duration-text">{{ sleepData.sleep_time }}</text>
				</view>
				<view class="form-item" v-if="sleepData.totalLight">
					<text class="label">{{$t('浅睡')}}：</text>
					<text class="duration-text">{{ sleepData.totalLight }}</text>
				</view>
				<view class="form-item" v-if="sleepData.totalDeep">
					<text class="label">{{$t('深睡')}}：</text>
					<text class="duration-text">{{ sleepData.totalDeep }}</text>
				</view>
				<view class="form-item" v-if="sleepData.totalRem">
					<text class="label">{{$t('眼动')}}：</text>
					<text class="duration-text">{{ sleepData.totalRem }}</text>
				</view>
			</block>
			<view v-else class="sleep-empty">
				<text class="sleep-empty-text">{{$t('用户未佩戴手表测量睡眠')}}</text>
			</view>
		</view>

		<!-- 高血压信息 -->
		<view class="section">
			<view class="section-title">{{$t('高血压用药情况')}}</view>
			<view class="form-item">
				<text class="label_1">{{$t('是否服用高血压药物')}}：</text>
				<switch :checked="form.takingMedicine" @change="handleMedicineChange" color="#007AFF" />
			</view>

			<block v-if="form.takingMedicine">
				<view class="form-item">
					<text class="label">{{$t('服药种类')}}：</text>
					<textarea class="textarea" v-model="form.medicineType" :placeholder="$t('请填写药物名称如氨氯地平缬沙坦等')"
						auto-height />
				</view>
				<view class="form-item">
					<text class="label">{{$t('每天服药时间')}}：</text>
					<picker fields="month" mode="time" :value="form.medicineTime" @change="handleTimeChange">
						<view class="picker">
							{{ form.medicineTime || $t('请选择服药时间') }}
						</view>
					</picker>
				</view>
			</block>
		</view>

		<!-- 确诊时间 -->
		<view class="section">
			<view class="section-title">{{$t('高血压确诊时间')}}</view>
			<view class="form-item">
				<text class="label">{{$t('确诊日期')}}：</text>
				<picker fields="day" mode="date" :value="form.diagnosisDate" @change="handleDateChange">
					<view class="picker">
						{{ form.diagnosisDate || $t('请选择确诊日期') }}
					</view>
				</picker>
			</view>
			<view class="form-item" v-if="form.diagnosisDate">
				<text class="label">{{$t('确诊时长')}}：</text>
				<text class="duration-text">{{ diagnosisDuration }}</text>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="button-group">
			<button class="btn-submit" @click="submitForm">{{$t('提交并保存')}}</button>
			<button class="btn-reset" @click="resetForm">{{$t('重置')}}</button>
		</view>

		<!-- 数据预览 -->
		<view class="preview-section" v-if="showPreview">
			<view class="section-title">{{$t('报告预览')}}</view>
			<view class="preview-content">
				<text class="preview-text">{{ previewContent }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import WeightConverter from '../../../api/unitls/weightConverter.js';
	export default {
		data() {
			return {
				form: {
					name: '',
					gender: '',
					age: '',
					height: '',
					weight: '',
					waist: '',
					takingMedicine: false,
					medicineType: '',
					medicineTime: '',
					diagnosisDate: '',
					heightunit: '',
					weightunit: '',
				},
				heightunit: '',
				weightunit: '',
				_heightImperial: null,
				_weightImperial: null,
				_savedWaistUnit: '',
				bmi: 0,
				whtr: 0,
				bmiStatus: '',
				whtrStatus: '',
				showMetrics: false,
				showPreview: false,
				storageKey: 'userHealthReport', // 本地存储的key
				_birthTime: '',
				_apiAge: null,
				_apiHeightCm: null,
				_apiWeightKg: null,
				_heightDisplay: null,
				_weightDisplay: null,
				_saving: false,
				type: "",
				sleepData: {
					sleep: '',
					sleep_time: '',
					totalLight: '',
					totalDeep: '',
					totalRem: '',
				},
			}
		},
		onLoad(option) {
			this.type = option.type
			this.loadLocalOnly()
			this.loadSleepData()
		},
		onShow() {
			let that = this
			that.loadSleepData()
			uni.setNavigationBarTitle({
				title: that.$t("个人信息")
			})
			that.fetchUnits().then(() => that.fetchProfile())
		},
	computed: {
			hasSleepData() {
				const sleep = this.sleepData.sleep
				return !!(sleep && sleep !== '--/--' && sleep !== 'NA' && sleep !== '0H0M')
			},
			getBmiClass() {
				if (this.bmi < 18.5) return 'underweight'
				if (this.bmi < 24) return 'normal'
				if (this.bmi < 28) return 'overweight'
				return 'obese'
			},
			getWhtrClass() {
				const threshold = this.form.gender === this.$t('女') ? 0.5 : 0.5
				return this.whtr < threshold ? 'normal' : 'risk'
			},
			diagnosisDuration() {
				if (!this.form.diagnosisDate) return ''
				const diagnosis = new Date(this.form.diagnosisDate)
				const now = new Date()
				const diffTime = Math.abs(now - diagnosis)
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
				const years = Math.floor(diffDays / 365)
				const months = Math.floor((diffDays % 365) / 30)

				if (years > 0) {
					return `${years}${this.$t('年')}${months}${this.$t('个月')}`
				} else if (months > 0) {
					return `${months}${this.$t('个月')}`
				} else {
					return `${diffDays}${this.$t('天')}`
				}
			},
			previewContent() {
				let content = `${this.$t('个人健康报告')}\n\n`
				content += `${this.$t('姓名')}：${this.form.name || this.$t('未填写')}\n`
				content +=
					`${this.$t('性别')}：${this.form.gender || this.$t('未填写')}  ${this.$t('年龄')}：${this.form.age || this.$t('未填写')}${this.$t('岁')}\n\n`
				content +=
					`${this.$t('身高')}：${this.form.height || this.$t('未填写')}${this.heightunit}  ${this.$t('体重')}：${this.form.weight || this.$t('未填写')}${this.weightunit}\n`
				content += `${this.$t('腰围')}：${this.form.waist || this.$t('未填写')}${this.heightunit}\n\n`

				if (this.showMetrics) {
					content += `BMI：${this.bmi}（${this.bmiStatus}）\n`
					content += `${this.$t('腰围身高比')}：${this.whtr}（${this.whtrStatus}）\n\n`
				}

				content += `${this.$t('高血压用药')}：${this.form.takingMedicine ? this.$t('是') : this.$t('否')}\n`
				if (this.form.takingMedicine) {
					content += `${this.$t('药物种类')}：${this.form.medicineType || this.$t('未填写')}\n`
					content += `${this.$t('服药时间')}：${this.form.medicineTime || this.$t('未填写')}\n`
				}
				content += `\n${this.$t("确诊时间")}：${this.form.diagnosisDate || this.$t('未填写')}`
				if (this.form.diagnosisDate) {
					content += `（${this.diagnosisDuration}）`
				}

				return content
			}
		},
		methods: {

			getsex(sex) {
				if (sex === "男" || sex === "Male") {
					return this.$t("男")
				} else if (sex === "女" || sex === "Female") {
					return this.$t("女")
				}
			},

			isImperialHeight() {
				return this._heightImperial === true
			},
			isImperialWeight() {
				return this._weightImperial === true
			},
			refreshUnits() {
				this.heightunit = this._heightImperial === null ? '' : (this._heightImperial ? this.$t("英寸") : this.$t("厘米"))
				this.weightunit = this._weightImperial === null ? '' : (this._weightImperial ? this.$t("英镑") : this.$t("千克"))
			},
			isImperialHeightUnit(unit) {
				return unit === this.$t("英寸") || unit === "inch" || unit === "英寸"
			},
			isImperialWeightUnit(unit) {
				return unit === this.$t("英镑") || unit === "lb" || unit === "lbs" || unit === "英镑"
			},
			toMetricHeight(value) {
				const num = parseFloat(value)
				if (!num || Number.isNaN(num)) return 0
				return this.isImperialHeight() ? WeightConverter.inchToCm(num) : num
			},
			toMetricWeight(value) {
				const num = parseFloat(value)
				if (!num || Number.isNaN(num)) return 0
				return this.isImperialWeight() ? WeightConverter.lbToKg(num) : num
			},
			convertBodyValueIfNeeded(value, wasImperial, isImperial, toMetric, toDisplay) {
				if (!value || wasImperial === isImperial) return value
				return wasImperial ? toMetric(value) : toDisplay(value)
			},
			hasMetric(value) {
				if (value === null || value === undefined || value === '') return false
				const num = Number(value)
				return !Number.isNaN(num) && num > 0
			},
			calcAge(birthTime) {
				const birth = this.parseBirth(birthTime)
				if (!birth) return ''
				const today = new Date()
				let age = today.getFullYear() - birth.getFullYear()
				const monthDiff = today.getMonth() - birth.getMonth()
				if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
					age--
				}
				return age < 0 ? '' : age
			},
			parseBirth(value) {
				if (value === null || value === undefined || value === '') return null
				if (typeof value === 'number') {
					const date = new Date(value)
					return Number.isNaN(date.getTime()) ? null : date
				}
				const text = String(value).trim()
				const matched = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
				if (matched) {
					const date = new Date(Number(matched[1]), Number(matched[2]) - 1, Number(matched[3]))
					return Number.isNaN(date.getTime()) ? null : date
				}
				const date = new Date(text.replace(/-/g, '/'))
				return Number.isNaN(date.getTime()) ? null : date
			},
			normalizeBirth(value) {
				const date = this.parseBirth(value)
				if (!date) return value ? String(value) : ''
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				return `${date.getFullYear()}-${month}-${day}`
			},
			fetchUnits() {
				return this.$get(this.$url_APP_IP + '/prod-api/device/data/list', {
					dataType: 'Unitdata'
				}, {
					Authorization: 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json'
				}).then(res => {
					this._heightImperial = null
					this._weightImperial = null
					if (res.code === 200 && res.rows && res.rows.length && res.rows[0].data) {
						const unitData = this.parseUnitData(res.rows[0].data)
						if (unitData && unitData.heightUnit) {
							this._heightImperial = this.isImperialHeightUnit(unitData.heightUnit)
						}
						if (unitData && unitData.weightUnit) {
							this._weightImperial = this.isImperialWeightUnit(unitData.weightUnit)
						}
					}
					this.refreshUnits()
				}).catch(() => {
					this._heightImperial = null
					this._weightImperial = null
					this.refreshUnits()
				})
			},
			parseUnitData(dataStr) {
				try {
					let objStr = String(dataStr).split('},{')[0]
					if (!objStr.endsWith('}')) objStr += '}'
					objStr = objStr.replace(/^{{/, '{').replace(/}}$/, '}')
					const fixed = objStr.replace(/([a-zA-Z_][a-zA-Z0-9_]*):([^,}]+)/g, (m, k, v) => {
						v = v.trim()
						if (v === 'true' || v === 'false') return `"${k}":${v}`
						if (!isNaN(v) && v !== '' && !v.includes('/')) return `"${k}":${v}`
						return `"${k}":"${v}"`
					})
					return JSON.parse(fixed)
				} catch (e) {
					return null
				}
			},
			fetchProfile() {
				return this.$get(this.$url_APP_IP + this.$url_getInfo, {}, {
					'Authorization': 'Bearer ' + uni.getStorageSync('token'),
					'content-type': 'application/json;charset=UTF-8'
				}).then(getInfo => {
					if (getInfo.code === 200) {
						this.applyApiProfile(getInfo.data || {})
						return
					}
					uni.showToast({
						title: getInfo.msg,
						icon: 'none'
					})
				})
			},
			// 姓名、性别、年龄、身高、体重、单位只使用接口。没有就留空。
			applyApiProfile(data) {
				const apiName = (data.nickName === null || data.nickName === undefined || data.nickName === '') ?
					(data.userName || '') : data.nickName
				this.form.name = apiName || ''
				if (data.sex === '0' || data.sex === '1' || data.sex === 0 || data.sex === 1) {
					this.form.gender = String(data.sex) === '0' ?
						this.getsex(this.$t('男')) : this.getsex(this.$t('女'))
				} else {
					this.form.gender = ''
				}
				this._birthTime = data.birthTime || ''
				this._apiHeightCm = this.hasMetric(data.height) ? data.height : null
				this._apiWeightKg = this.hasMetric(data.weight) ? data.weight : null
				if (this._apiHeightCm != null) {
					this.form.height = this.isImperialHeight() ?
						WeightConverter.cmToInch(data.height) : data.height
					this._heightDisplay = this.form.height
				} else {
					this.form.height = ''
					this._heightDisplay = null
				}
				if (this._apiWeightKg != null) {
					this.form.weight = this.isImperialWeight() ?
						WeightConverter.kgToLb(data.weight) : data.weight
					this._weightDisplay = this.form.weight
				} else {
					this.form.weight = ''
					this._weightDisplay = null
				}
				if (this.form.waist && this._savedWaistUnit && this.heightunit) {
					this.form.waist = this.convertBodyValueIfNeeded(
						this.form.waist,
						this.isImperialHeightUnit(this._savedWaistUnit),
						this.isImperialHeight(),
						(v) => WeightConverter.inchToCm(v),
						(v) => WeightConverter.cmToInch(v)
					)
				}
				this.form.heightunit = this.heightunit
				this.form.weightunit = this.weightunit
				const age = data.birthTime ? this.calcAge(data.birthTime) : ''
				if (age !== '' && age >= 0) {
					this.form.age = String(age)
					this._apiAge = Number(age)
				} else {
					this.form.age = ''
					this._apiAge = null
				}
				this.calculateMetrics()
			},
			isMaleGender(gender) {
				return gender === '男' || gender === 'Male' || gender === this.$t('男')
			},
			metricHeightForSave() {
				const num = parseFloat(this.form.height)
				if (!(num > 0)) return ''
				if (this._heightDisplay != null && Number(this._heightDisplay) === num) return this._apiHeightCm
				return this.isImperialHeight() ? WeightConverter.inchToCm(num) : num
			},
			metricWeightForSave() {
				const num = parseFloat(this.form.weight)
				if (!(num > 0)) return ''
				if (this._weightDisplay != null && Number(this._weightDisplay) === num) return this._apiWeightKg
				return this.isImperialWeight() ? WeightConverter.lbToKg(num) : num
			},
			birthTimeForSave() {
				const age = parseInt(this.form.age, 10)
				if (!age || Number.isNaN(age)) return ''
				// 年龄没改：沿用原来的出生日期，只收成档案页现在的 YYYY-MM-DD
				if (this._birthTime && this._apiAge === age) return this.normalizeBirth(this._birthTime)
				const origin = this.parseBirth(this._birthTime)
				const today = new Date()
				// 没有原生日时，用今天的月和日，得到档案页同样的年月日
				const month = origin ? origin.getMonth() : today.getMonth()
				const day = origin ? origin.getDate() : today.getDate()
				const birthdayNotYet = today.getMonth() < month || (today.getMonth() === month && today.getDate() < day)
				const year = today.getFullYear() - age - (birthdayNotYet ? 1 : 0)
				const mm = String(month + 1).padStart(2, '0')
				const dd = String(day).padStart(2, '0')
				return `${year}-${mm}-${dd}`
			},
			syncProfileToServer() {
				const that = this
				return new Promise((resolve) => {
					uni.request({
						url: that.$url_APP_IP + that.$url_update_info,
						method: 'POST',
						data: {
							nickName: that.form.name,
							sex: that.isMaleGender(that.form.gender) ? '0' : '1',
							birthTime: that.birthTimeForSave(),
							height: that.metricHeightForSave(),
							weight: that.metricWeightForSave()
						},
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync('token'),
							'content-type': 'application/json;charset=UTF-8'
						},
						success(res) {
							if (res.statusCode == 200 && res.data && res.data.code == 200) {
								resolve(true)
								return
							}
							uni.showToast({
								title: (res.data && res.data.msg) || that.$t('保存失败'),
								icon: 'none'
							})
							resolve(false)
						},
						fail() {
							uni.showToast({
								title: that.$t('保存失败'),
								icon: 'none'
							})
							resolve(false)
						}
					})
				})
			},
			openReport(request, formPayload) {
				switch (this.type) {
					case "7":
						uni.navigateTo({
							url: `../../main/globalweather/day_monitoring_report_7?request=${JSON.stringify(request)}&form=${JSON.stringify(formPayload)}`
						})
						break
					case "24":
						uni.navigateTo({
							url: `../../main/globalweather/hour_monitoring_report_24?request=${JSON.stringify(request)}&form=${JSON.stringify(formPayload)}`
						})
						break
				}
			},

			// 只读取接口没有的字段。姓名、年龄、身高、体重、单位不读本地。
			loadLocalOnly() {
				try {
					const savedData = uni.getStorageSync(this.storageKey)
					if (!savedData) return
					this.form.waist = savedData.waist || ''
					this.form.takingMedicine = !!savedData.takingMedicine
					this.form.medicineType = savedData.medicineType || ''
					this.form.medicineTime = savedData.medicineTime || ''
					this.form.diagnosisDate = savedData.diagnosisDate || ''
					this._savedWaistUnit = savedData.waistUnit || ''
				} catch (e) {
					console.error('读取本地数据失败：', e)
				}
			},

			// 从本地存储加载手表睡眠数据
			loadSleepData() {
				const normalize = (val) => {
					if (val === undefined || val === null || val === 'NA' || val === '--/--') return ''
					return String(val)
				}
				this.sleepData = {
					sleep: normalize(uni.getStorageSync('sleep')),
					sleep_time: normalize(uni.getStorageSync('sleep_time')),
					totalLight: normalize(uni.getStorageSync('totalLight')),
					totalDeep: normalize(uni.getStorageSync('totalDeep')),
					totalRem: normalize(uni.getStorageSync('totalRem')),
				}
			},

			// 腰围、用药、确诊时间接口没有对应字段，只存这些
			saveToStorage() {
				try {
					uni.setStorageSync(this.storageKey, {
						waist: this.form.waist,
						waistUnit: this.heightunit,
						takingMedicine: this.form.takingMedicine,
						medicineType: this.form.medicineType,
						medicineTime: this.form.medicineTime,
						diagnosisDate: this.form.diagnosisDate
					})
					this._savedWaistUnit = this.heightunit
					return true
				} catch (e) {
					console.error('保存到本地失败：', e)
					uni.showToast({
						title: this.$t('保存失败'),
						icon: 'none'
					})
					return false
				}
			},

			// 清除本地存储
			clearStorage() {
				try {
					uni.removeStorageSync(this.storageKey)
					console.log('本地数据已清除')
				} catch (e) {
					console.error('清除本地数据失败：', e)
				}
			},

			handleGenderChange(e) {
				this.form.gender = e.detail.value
				this.calculateMetrics()
			},
			handleMedicineChange(e) {
				this.form.takingMedicine = e.detail.value
			},
			handleTimeChange(e) {
				this.form.medicineTime = e.detail.value
			},
			handleDateChange(e) {
				this.form.diagnosisDate = e.detail.value
			},

			calculateMetrics() {
				const height = this.toMetricHeight(this.form.height)
				const weight = this.toMetricWeight(this.form.weight)
				const waist = this.toMetricHeight(this.form.waist)

				if (!(height > 0) || !(weight > 0)) {
					this.bmi = 0
					this.bmiStatus = ''
					this.showMetrics = false
				}
				if (!(waist > 0) || !(height > 0)) {
					this.whtr = 0
					this.whtrStatus = ''
				}
				if (height > 0 && weight > 0) {
					// BMI = 体重(kg) / 身高(m)²
					const heightInM = height / 100
					this.bmi = (weight / (heightInM * heightInM)).toFixed(1)

					// 判断BMI状态（中国标准）
					if (this.bmi < 18.5) {
						this.bmiStatus = this.$t('体重过轻')
					} else if (this.bmi < 24) {
						this.bmiStatus = this.$t('正常范围')
					} else if (this.bmi < 28) {
						this.bmiStatus = this.$t('超重')
					} else {
						this.bmiStatus = this.$t('肥胖')
					}

					this.showMetrics = true
				}

				if (waist > 0 && height > 0) {
					// 腰围身高比 = 腰围(cm) / 身高(cm)
					this.whtr = (waist / height).toFixed(2)

					// 判断腰围身高比状态（亚洲标准：0.5为界限）
					if (this.whtr < 0.5) {
						this.whtrStatus = this.$t('正常范围')
					} else {
						this.whtrStatus = this.$t('代谢风险')
					}
				}
			},

			submitForm() {
				if (this._saving) return
				// 表单验证
				if (!this.form.name) {
					uni.showToast({
						title: this.$t('请输入姓名'),
						icon: 'none'
					})
					return
				}
				if (!this.form.gender) {
					uni.showToast({
						title: this.$t('请选择性别'),
						icon: 'none'
					})
					return
				}
				if (!this.form.age) {
					uni.showToast({
						title: this.$t('请输入年龄'),
						icon: 'none'
					})
					return
				}
				this.form.heightunit = this.heightunit
				this.form.weightunit = this.weightunit
				// 腰围、用药、确诊时间等接口没有的字段仍只存本地
				if (!this.saveToStorage()) return
				const request = {
					type: this.type,
					bmi: this.bmi,
					whtr: this.whtr
				}
				const formPayload = Object.assign({}, this.form, {
					sleep: this.hasSleepData ? this.sleepData.sleep : '',
					sleep_time: this.hasSleepData ? (this.sleepData.sleep_time || '') : '',
					totalLight: this.hasSleepData ? (this.sleepData.totalLight || '') : '',
					totalDeep: this.hasSleepData ? (this.sleepData.totalDeep || '') : '',
					totalRem: this.hasSleepData ? (this.sleepData.totalRem || '') : '',
				})
				this._saving = true
				uni.showLoading({
					title: this.$t('健康提醒保存中'),
					mask: true
				})
				this.syncProfileToServer().then((ok) => {
					this._saving = false
					uni.hideLoading()
					if (!ok) return
					uni.showToast({
						title: this.$t('保存成功'),
						icon: 'none'
					})
					this.openReport(request, formPayload)
				})
			},

			resetForm() {
				uni.showModal({
					title: this.$t('确认重置'),
					content: this.$t('确定要清空所有数据吗这将同时删除本地保存的数据'),
					success: (res) => {
						if (res.confirm) {
							// 清除本地存储
							this.clearStorage()
							// 重置表单数据
							this.form = {
								name: '',
								gender: '',
								age: '',
								height: '',
								weight: '',
								waist: '',
								takingMedicine: false,
								medicineType: '',
								medicineTime: '',
								diagnosisDate: '',
								heightunit: "",
								weightunit: "",
							}
							this.bmi = 0
							this.whtr = 0
							this.showMetrics = false
							this.showPreview = false
							uni.showToast({
								title: this.$t('已重置'),
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>
<style>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		padding: 40rpx 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.title {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
		display: block;
	}

	.subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-top: 10rpx;
		display: block;
	}

	.section {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
		padding-left: 20rpx;
		border-left: 8rpx solid #007AFF;
	}

	.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		flex-wrap: wrap;
	}

	.form-item:last-child {
		margin-bottom: 0;
	}

	.label {
		font-size: 30rpx;
		color: #555;
		font-weight: 500;
	}

	.label_1 {
		width: 70vw;
		font-size: 30rpx;
		color: #555;
		font-weight: 500;
	}

	.input {
		flex: 1;
		height: 80rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 30rpx;
		margin-left: 10px;
		background-color: #fafafa;
		min-width: 200rpx;
	}

	.unit {
		margin-left: 15rpx;
		font-size: 28rpx;
		color: #666;
		width: 80rpx;
	}

	.radio-group {
		display: flex;
		flex: 1;
	}

	.radio-item {
		display: flex;
		align-items: center;
		margin-right: 40rpx;
		font-size: 30rpx;
		color: #333;
	}

	.radio-item radio {
		transform: scale(0.8);
		margin-right: 10rpx;
	}

	.textarea {
		flex: 1;
		min-height: 120rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 12rpx;
		padding: 20rpx;
		font-size: 30rpx;
		background-color: #fafafa;
		width: 100%;
		margin-top: 15rpx;
	}

	.picker {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 30rpx;
		color: #333;
		background-color: #fafafa;
	}

	.duration-text {
		flex: 1;
		margin-left: 20px;
		font-size: 30rpx;
		color: #007AFF;
		font-weight: bold;
	}

	.sleep-empty {
		padding: 20rpx 0;
	}

	.sleep-empty-text {
		font-size: 28rpx;
		color: #999;
		line-height: 1.6;
	}

	.metrics-box {
		display: flex;
		justify-content: space-between;
		gap: 20rpx;
	}

	.metric-item {
		flex: 1;
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 30rpx;
		text-align: center;
		border: 2rpx solid #e9ecef;
	}

	.metric-label {
		font-size: 28rpx;
		color: #666;
		display: block;
		margin-bottom: 15rpx;
	}

	.metric-value {
		font-size: 48rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 10rpx;
	}

	.metric-status {
		font-size: 26rpx;
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
		display: inline-block;
	}

	/* BMI状态颜色 */
	.underweight {
		color: #3498db;
	}

	.normal {
		color: #27ae60;
	}

	.overweight {
		color: #f39c12;
	}

	.obese {
		color: #e74c3c;
	}

	.risk {
		color: #e74c3c;
	}

	.underweight+.metric-status {
		background-color: #ebf5fb;
		color: #3498db;
	}

	.normal+.metric-status {
		background-color: #eafaf1;
		color: #27ae60;
	}

	.overweight+.metric-status {
		background-color: #fef5e7;
		color: #f39c12;
	}

	.obese+.metric-status {
		background-color: #fdedec;
		color: #e74c3c;
	}

	.risk+.metric-status {
		background-color: #fdedec;
		color: #e74c3c;
	}

	.button-group {
		display: flex;
		gap: 20rpx;
		margin-bottom: 30rpx;
	}

	.btn-submit {
		flex: 2;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 12rpx;
		font-size: 32rpx;
		height: 90rpx;
		line-height: 90rpx;
		border: none;
	}

	.btn-reset {
		flex: 1;
		background-color: #95a5a6;
		color: white;
		border-radius: 12rpx;
		font-size: 32rpx;
		height: 90rpx;
		line-height: 90rpx;
		border: none;
	}

	.preview-section {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 50rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.preview-content {
		background-color: #f8f9fa;
		border-radius: 12rpx;
		padding: 30rpx;
		border: 2rpx dashed #dee2e6;
	}

	.preview-text {
		font-size: 28rpx;
		color: #495057;
		line-height: 1.8;
		white-space: pre-wrap;
		font-family: monospace;
	}

	/* 响应式调整 */
	@media (max-width: 375px) {
		.label {
			width: 180rpx;
			font-size: 28rpx;
		}

		.input,
		.picker {
			height: 70rpx;
			font-size: 28rpx;
		}
	}
</style>