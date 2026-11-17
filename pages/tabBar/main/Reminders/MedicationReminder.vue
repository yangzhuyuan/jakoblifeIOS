<template>
	<view class="medication-page" :class="{ 'overview-page': viewMode === 'overview', 'bp-page': viewMode === 'bp' }">
		<view v-if="viewMode === 'overview'" class="profile-toolbar"><button class="profile-entry" @click="$refs.healthProfile.open()">{{ $t('健康档案按钮') }}</button></view>
		<HealthProfileDialog ref="healthProfile" @saved="reportRefresh++" />
		<template v-if="viewMode === 'overview'">
			<view class="health-hero">
				<view class="hero-calendar">
					<ReminderIcon kind="health" :size="64" />
				</view>
				<view><text class="health-title">{{ hrt('health') }}</text><text
						class="health-intro">{{ hrt('intro') }}</text></view>
			</view>
			<view class="health-entry" @click="openBloodPressureReminder">
				<ReminderIcon kind="bp" />
				<view><text class="entry-title">{{ hrt('bp') }}</text><text
						class="entry-description">{{ hrt('bpIntro') }}</text></view><text class="chevron">›</text>
			</view>
			<view class="health-entry" @click="openMedicationEditor">
				<ReminderIcon kind="medication" />
				<view><text class="entry-title">{{ hrt('medication') }}</text><text
						class="entry-description">{{ hrt('medEntry') }}</text></view><text class="chevron">›</text>
			</view>
			<view class="health-plan">
				<view class="plan-heading"><text
						class="plan-title">{{ hrt(showHistory ? 'history' : 'plan') }}</text><text class="history-link"
						@click="showHistory = !showHistory">{{ hrt(showHistory ? 'plan' : 'history') }} ›</text></view>
				<HealthReminderHistory v-if="showHistory" />
				<view v-else class="plan-list">
					<view v-if="healthLoadError" class="plan-empty" @click="loadHealthDashboard">{{ hrt('loadFailed') }}
					</view>
					<view v-else-if="!healthUpcoming.length" class="plan-empty">
						{{ hrt(healthLoading ? 'loading' : 'noPlan') }}
					</view>
					<view v-for="slot in healthUpcoming" :key="slot.kind + slot.id" class="plan-row"
						@click="openHealthActions(slot)">
						<ReminderIcon :kind="slot.kind === 'bp' ? 'bp-plan' : 'pill'" />
						<view class="plan-time"><text>{{ healthTime(slot.time) }}</text></view>
						<view class="plan-label">
							<text>{{ healthLabel(slot) }}</text>
						</view>
						<view class="check-hit" role="checkbox" :aria-checked="healthIsChecked(slot)"
							:aria-label="hrt(healthIsChecked(slot) ? 'done' : 'unchecked')"
							@click.stop="toggleHealthCheck(slot)">
							<view class="reminder-check"
								:class="{ checked: healthIsChecked(slot), busy: healthIsChecking(slot) }"><text
									v-if="healthIsChecked(slot)">✓</text></view>
						</view>
					</view>
				</view>
			</view>
		</template>
		<BloodPressureReminderSettings v-else-if="viewMode === 'bp'" ref="bpSettings" />
		<template v-else>
			<view v-if="loading" class="state-card">{{ hrt('loading') }}</view>
			<view v-else-if="loadError" class="state-card" @click="loadReminders">{{ hrt('loadFailed') }}</view>
			<template v-else-if="loaded">
				<view class="regimen-status"><text>{{ $t('药单当前服药状态') }}</text><picker :range="[$t('药单尚未确认'),$t('药单正在服药'),$t('药单未服药')]" :value="['unknown','taking','not_taking'].indexOf(medicationStatus)" :disabled="saving" @change="medicationStatus=['unknown','taking','not_taking'][Number($event.detail.value)]"><view>{{ $t(medicationStatus==='taking'?'药单正在服药':medicationStatus==='not_taking'?'药单未服药':'药单尚未确认') }} ›</view></picker><text class="regimen-note">{{ $t('药单状态说明') }}</text></view>
				<view v-if="notificationHint" class="notification-status"><text>{{ $t(notificationHint) }}</text><button
						v-if="notificationState.available"
						@click="openNotificationIssueSettings">{{ $t(notificationState.soundDisabled ? '吃药提醒系统声音设置' : '吃药提醒开启通知') }}</button>
				</view>
				<view v-for="(item, index) in reminders" :key="item.id" class="medication-group">
					<view class="medicine-heading">
						<ReminderIcon kind="medication" />
						<view class="medicine-title">
							<text>{{ hrt('medication') }}{{ reminders.length > 1 ? ' ' + (index + 1) : '' }}</text><text
								class="medicine-description">{{ hrt('medIntro') }}</text>
						</view>
						<switch :checked="item.enabled" :disabled="saving" color="#26b80b"
							@change="setEnabled(index, $event)" />
					</view>
					<view class="medicine-fields">
						<MedicationDrugFields v-model="item.clinical" :disabled="saving" />
						<!-- 名称入口暂不开放，默认使用“服用降压药”。
						<view class="medicine-row"><uni-icons type="compose" size="25" color="#0097ff" /><text
							class="row-label">{{ hrt('name') }}</text><input v-model="item.name" class="row-input"
							:disabled="saving" maxlength="60" :placeholder="$t('吃药提醒药名占位')" /></view>
						-->
						<picker v-for="(time, timeIndex) in item.times" :key="timeIndex" class="medicine-time-picker"
							mode="multiSelector" :range="timeRanges" :value="timePickerValue(time)"
							:disabled="saving" @change="setTime(index, timeIndex, $event)">
							<view class="medicine-row">
								<ReminderIcon kind="clock" class="field-symbol" /><text
									class="row-label">{{ hrt('time') }}</text><text
									class="row-value">{{ healthTime(time) }}</text><text
									class="chevron row-chevron"></text>
							</view>
						</picker>
						<view class="regimen-time-actions"><text>{{ $t('药单每日次数') }}：{{ item.times.length }}</text><button :disabled="saving || item.times.length >= maxTimes" @click="addTime(index)">+ {{ hrt('addTime') }}</button><button v-if="item.times.length>1" :disabled="saving" @click="removeTime(index,item.times.length-1)">{{ hrt('removeTime') }}</button></view>
						<!-- 原展开编辑区域与多时间入口暂不开放，保留供后续恢复。
						<view v-if="expandedField === index + ':time'" class="field-detail time-list">
							<view v-for="(time, timeIndex) in item.times" :key="timeIndex" class="time-chip">
								<picker mode="multiSelector" :range="timeRanges" :value="timePickerValue(time)"
									:disabled="saving" @change="setTime(index, timeIndex, $event)">
									<view class="time-value">{{ healthTime(time) }}</view>
								</picker>
								<button v-if="item.times.length > 1" class="remove-time" :disabled="saving"
									@click="removeTime(index, timeIndex)">×</button>
							</view>
							<button v-if="item.times.length < maxTimes" class="add-time" :disabled="saving"
								@click="addTime(index)">+ {{ hrt('addTime') }}</button>
						</view>
						-->
						<view class="medicine-row" @click="toggleEditor(index, 'repeat')">
							<ReminderIcon kind="repeat" class="field-symbol" /><text
								class="row-label">{{ hrt('repeat') }}</text><text
								class="row-value">{{ repeatLabel(item) }}</text><text class="chevron row-chevron"></text>
						</view>
						<view v-if="expandedField === index + ':repeat'" class="field-detail"><button
								class="everyday-button" :disabled="saving"
								@click="setEveryday(index)">{{ hrt('every') }}</button>
							<view class="weekday-list"><button v-for="day in weekdays" :key="day.value"
									class="weekday-button" :class="{ selected: item.weekdays.includes(day.value) }"
									:disabled="saving" @click="toggleDay(index, day.value)">{{ $t(day.label) }}</button>
							</view>
						</view>
					</view>
					<view class="extra-toggle" @click="toggleEditor(index, 'more')"><text>{{ hrt('more') }}</text><text class="row-chevron down-chevron"></text></view>
					<view v-if="expandedField === index + ':more'" class="medicine-fields extra-fields">
						<view class="sound-row"><text class="sound-label">{{ $t('吃药提醒提示音') }}</text>
							<picker class="sound-picker" :range="soundLabels" :value="soundIndex(item.sound)"
								:disabled="saving" @change="setSound(index, $event)">
								<view class="sound-value"><text>{{ soundLabels[soundIndex(item.sound)] }}</text><text
										class="sound-chevron">›</text></view>
							</picker><button v-if="item.sound !== 'silent'" class="sound-action"
								@click="previewSound(item)">{{ $t('吃药提醒试听') }}</button>
						</view>
						<view v-if="item.sound === 'alarm'" class="sound-row"><text
								class="sound-label">{{ $t('吃药提醒铃声时长') }}</text>
							<picker class="sound-picker" :range="soundDurationLabels" :value="soundDurationIndex(item)"
								:disabled="saving" @change="setSoundDuration(index, $event)">
								<view class="sound-value"><text>{{ soundDurationLabels[soundDurationIndex(item)] }}</text><text
										class="sound-chevron">›</text></view>
							</picker>
						</view><button class="sound-settings"
							@click="openNotificationSettings('sound', item.sound)">{{ $t('吃药提醒系统声音设置') }}</button><textarea
							v-model="item.note" :disabled="saving" maxlength="200" auto-height
							:placeholder="$t('吃药提醒备注占位')" />
						<button class="delete-button" :disabled="saving" @click="removeReminder(index)">{{ hrt('remove') }}</button>
					</view>
				</view>
				<view v-if="!reminders.length" class="state-card">{{ hrt('unset') }}</view>
				<view v-if="medicationStatus==='taking'" class="regimen-confirm"><checkbox :checked="confirmedAllDrugs" :disabled="saving" @click="!saving && (confirmedAllDrugs = !confirmedAllDrugs)" /><text>{{ $t('药单全部确认') }}</text></view>
				<button class="add-button" :disabled="saving || reminders.length >= maxReminders" @click="addReminder">+ {{ hrt('add') }}</button>
				<view class="analysis-card">
					<view class="analysis-heading">
						<ReminderIcon kind="analysis" class="field-symbol" /><text
							class="analysis-title">{{ hrt('analysis') }}</text><uni-icons type="info" size="18"
							color="#596478" @click="showAnalysisHelp" />
						<switch :checked="analysisSettings.enabled" :disabled="saving || analysisLoadError"
							color="#26b80b" @change="analysisSettings.enabled = $event.detail.value" />
					</view><text class="analysis-description">{{ hrt('analysisIntro') }}</text><text
						v-if="analysisLoadError" class="analysis-error"
						@click="loadAnalysisSettings">{{ hrt('loadFailed') }}</text>
				</view>
				<button class="save-button" :disabled="saving" :loading="saving"
					@click="saveHealthSettings">{{ hrt(saving ? 'saving' : 'save') }}</button>
				<MedicationEffectReport :enabled="savedAnalysisEnabled" :days="analysisSettings.days"
					:refreshKey="reportRefresh" @days-change="analysisSettings.days = $event" />
			</template>
		</template>
	</view>
</template>


<script>
	import healthReminderDashboard from '@/pages/tabBar/main/Reminders/api/healthReminderDashboard.js'
	import {
		HEALTH_REMINDERS_CHANGED
	} from '@/pages/tabBar/main/Reminders/api/healthReminders.js'
	import ReminderIcon from './components/ReminderIcon.vue'
	import BloodPressureReminderSettings from './components/BloodPressureReminderSettings.vue'
	import HealthReminderHistory from './components/HealthReminderHistory.vue'
	import MedicationEffectReport from './components/MedicationReportV3.vue'
	import HealthProfileDialog from './components/HealthProfileDialog.vue'
	import MedicationDrugFields from './components/MedicationDrugFields.vue'
	import {
		createMedicationReminderStore,
		MAX_MEDICATION_REMINDERS,
		MAX_MEDICATION_TIMES,
		ALARM_SOUND_SECONDS,
		DEFAULT_ALARM_SOUND_SECONDS
	} from '@/pages/tabBar/main/Reminders/api/medicationReminder.js'
	import {
		applyMedicationNotifications,
		medicationNotificationAccount,
		medicationNotificationStatus,
		openMedicationNotificationSettings,
		previewMedicationSound,
		stopMedicationSoundPreview
	} from '@/pages/tabBar/main/Reminders/api/medicationNotifications.js'
	import {
		MAX_BP_REMINDERS
	} from '@/pages/tabBar/main/Reminders/api/bloodPressureReminder.js'
	import {
		selectBPReminderDevice
	} from '@/pages/tabBar/main/Reminders/api/bpReminderMeasurement.js'
	import {
		refreshHealthReminderRuntime
	} from '@/pages/tabBar/main/Reminders/api/healthReminderRuntime.js'

	function shiftClock(time, delta) {
		const [hour, minute] = time.split(':').map(Number)
		const total = hour * 60 + minute + delta
		const minutes = ((total % 1440) + 1440) % 1440
		return {
			time: String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0'),
			dayShift: Math.floor(total / 1440)
		}
	}

	function shiftWeekday(day, shift) {
		return ((Number(day) - 1 + shift) % 7 + 7) % 7 + 1
	}

	function isAutoBloodPressureReminder(item) {
		return !!item && (item.origin === 'medication' || String(item.id || '').startsWith('bp-med-'))
	}

	function medicationBloodPressureRows(reminders) {
		const slots = new Map()
		const add = (time, weekdays) => {
			if (!slots.has(time)) slots.set(time, new Set())
			weekdays.forEach(day => slots.get(time).add(day))
		}
		for (const offset of [-30, 120]) {
			for (const item of reminders) {
				for (const time of item.times || []) {
					if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) continue
					const shifted = shiftClock(time, offset)
					const days = (item.weekdays || []).map(day => shiftWeekday(day, shifted.dayShift)).filter(day => day >= 1 && day <= 7)
					if (days.length) add(shifted.time, days)
				}
			}
		}
		return [...slots.entries()].map(([time, days], index) => ({
			id: 'bp-med-' + Date.now().toString(36) + '-' + index + '-' + time.replace(':', ''),
			enabled: true,
			origin: 'medication',
			sound: 'system',
			times: [time],
			weekdays: [...days].sort((a, b) => a - b)
		}))
	}

	function mergeMedicationBloodPressure(existing, reminders) {
		const manual = (existing && existing.reminders || []).filter(item => !isAutoBloodPressureReminder(item))
		const occupied = new Set()
		for (const item of manual.filter(item => item.enabled)) for (const day of item.weekdays || []) occupied.add(day + '|' + item.times[0])
		const auto = []
		for (const item of medicationBloodPressureRows(reminders)) {
			if (manual.length + auto.length >= MAX_BP_REMINDERS) break
			const weekdays = item.weekdays.filter(day => !occupied.has(day + '|' + item.times[0]))
			if (!weekdays.length) continue
			weekdays.forEach(day => occupied.add(day + '|' + item.times[0]))
			auto.push({ ...item, weekdays })
		}
		if (!auto.length) return null
		const rows = [...manual, ...auto]
		const enabled = (existing && existing.enabled === true || auto.length > 0) && rows.some(item => item.enabled)
		return { version: 1, enabled, reminders: rows }
	}

	function appendMissingMedicationBloodPressure(existing, reminders) {
		const current = (existing && existing.reminders || []).slice()
		const occupied = new Set()
		for (const item of current.filter(item => item.enabled)) for (const day of item.weekdays || []) occupied.add(day + '|' + item.times[0])
		const auto = []
		for (const item of medicationBloodPressureRows(reminders)) {
			if (current.length + auto.length >= MAX_BP_REMINDERS) break
			const weekdays = item.weekdays.filter(day => !occupied.has(day + '|' + item.times[0]))
			if (!weekdays.length) continue
			weekdays.forEach(day => occupied.add(day + '|' + item.times[0]))
			auto.push({ ...item, weekdays })
		}
		if (!auto.length) return null
		const rows = [...current, ...auto]
		return { version: 1, enabled: rows.some(item => item.enabled), reminders: rows }
	}

	function withoutAutoBloodPressure(existing) {
		const reminders = (existing && existing.reminders || []).filter(item => !isAutoBloodPressureReminder(item))
		if (reminders.length === (existing && existing.reminders || []).length) return null
		const enabled = existing.enabled === true && reminders.some(item => item.enabled)
		return { version: 1, enabled, reminders }
	}

	function bloodPressureMatchesMedication(bpReminders, medication) {
		const enabled = (bpReminders || []).filter(item => item.enabled && item.times && item.times[0])
		return medication.every(item => (item.times || []).every(time => {
			if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return true
			const shifted = shiftClock(time, -30)
			return (item.weekdays || []).every(day => enabled.some(bp => bp.times[0] === shifted.time && (bp.weekdays || []).includes(shiftWeekday(day, shifted.dayShift))))
		}))
	}

	export default {
		components: {
			MedicationDrugFields,
			HealthProfileDialog,
			ReminderIcon,
			MedicationEffectReport,
			BloodPressureReminderSettings,
			HealthReminderHistory
		},
		mixins: [healthReminderDashboard],
		data() {
			return {
				viewMode: 'overview',
				showHistory: false,
				expandedField: '',
				analysisSettings: {
					enabled: false,
					days: 1
				},
				analysisLoadError: false,
				analysisLoaded: false,
				savedAnalysisEnabled: false,
				reportRefresh: 0,
				reminders: [],
				medicationStatus: 'unknown',
				confirmedAllDrugs: false,
				loading: false,
				saving: false,
				loaded: false,
				loadError: false,
				notificationState: {
					available: false
				},
				notificationSyncFailed: false,
				soundValues: ['system', 'alarm', 'silent'],
				timeRanges: [
					Array.from({
						length: 24
					}, (_, index) => String(index).padStart(2, '0')),
					Array.from({
						length: 60
					}, (_, index) => String(index).padStart(2, '0'))
				],
				maxReminders: MAX_MEDICATION_REMINDERS,
				maxTimes: MAX_MEDICATION_TIMES,
				weekdays: [{
						value: 1,
						label: '周一'
					}, {
						value: 2,
						label: '周二'
					}, {
						value: 3,
						label: '周三'
					},
					{
						value: 4,
						label: '周四'
					}, {
						value: 5,
						label: '周五'
					}, {
						value: 6,
						label: '周六'
					}, {
						value: 7,
						label: '周日'
					}
				]
			}
		},
		computed: {
			soundLabels() {
				return ['吃药提醒系统提示音', '吃药提醒闹钟提示音', '吃药提醒静音'].map(key => this.$t(key))
			},
			soundDurationLabels() {
				return ['吃药提醒铃声短', '吃药提醒铃声12秒', '吃药提醒铃声24秒'].map(key => this.$t(key))
			},
			notificationHint() {
				if (!this.reminders.some(item => item.enabled)) return ''
				if (!this.notificationState.available) return '吃药提醒通知不可用'
				if (!this.notificationState.notifications) return '吃药提醒通知权限提示'
				if (!this.notificationState.exact) return '吃药提醒闹钟权限提示'
				if (this.notificationState.blockedSound) return '吃药提醒通道关闭提示'
				if (this.notificationState.limitExceeded) return '吃药提醒iOS数量提示'
				if (this.notificationState.soundDisabled) return this.notificationState.ios ? '吃药提醒iOS声音提示' : '健康提醒Android声音提示'
				if (this.notificationSyncFailed || this.notificationState.schedulingFailed) return '吃药提醒通知安排失败'
				return ''
			}
		},
		onLoad(options = {}) {
			if (!uni.getStorageSync('token') || !uni.getStorageSync('userid')) {
				uni.redirectTo({
					url: '/pages/login/login_land'
				})
				return
			}
			this.viewMode = ['overview', 'bp'].includes(options.view) ? options.view : 'medication'
			if (this.viewMode === 'bp') uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#F0FAFF'
			})
			uni.setNavigationBarTitle({
				title: this.hrt(this.viewMode === 'overview' ? 'health' : this.viewMode === 'bp' ? 'bpTitle' :
					'medication')
			})
			this._disposed = false
			if (this.viewMode === 'medication') {
				this.loadReminders()
				this.loadAnalysisSettings()
			}
		},
		onUnload() {
			this._disposed = true
			this.stopHealthDashboard()
			stopMedicationSoundPreview(this)
		},
		onHide() {
			if (this.viewMode === 'overview') this.stopHealthDashboard()
			stopMedicationSoundPreview(this)
		},
		onShow() {
			if (this.viewMode === 'overview') {
				this.startHealthDashboard();
				return
			}
			if (this.viewMode === 'bp') {
				if (this.$refs.bpSettings) this.$refs.bpSettings.refreshNotificationStatus();
				return
			}
			this.updateNotificationStatus()
			this.reportRefresh++
			// 从系统权限设置返回后，重新安排已经保存的记录，不使用未保存草稿。
			if (this._savedReminders && this.isCurrent()) this.scheduleNotifications(this._savedReminders, this
				._savedNotificationAccount)
		},
		methods: {
			openBloodPressureReminder() {
				uni.navigateTo({
					url: '/pages/tabBar/main/Reminders/MedicationReminder?view=bp'
				})
			},
			openMedicationEditor() {
				uni.navigateTo({
					url: '/pages/tabBar/main/Reminders/MedicationReminder?view=medication'
				})
			},
			toggleEditor(index, field) {
				if (!this.saving) this.expandedField = this.expandedField === index + ':' + field ? '' : index + ':' +
					field
			},
			repeatLabel(item) {
				return item.weekdays.length === 7 ? this.hrt('every') : this.weekdays.filter(day => item.weekdays.includes(
					day.value)).map(day => this.$t(day.label)).join(' ')
			},
			showAnalysisHelp() {
				uni.showModal({
					title: this.hrt('analysis'),
					content: this.hrt('analysisHelp'),
					showCancel: false
				})
			},
			async loadAnalysisSettings() {
				const store = this.createHealthStore(),
					base = this.$url_APP_IP
				this.analysisLoaded = false;
				this.analysisLoadError = false
				try {
					const settings = await store.loadAnalysis()
					if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return
					this.analysisSettings = {
						enabled: settings.enabled === true,
						days: [1, 3, 7, 30].includes(settings.days) ? settings.days : 1
					}
					this.savedAnalysisEnabled = this.analysisSettings.enabled
					this.analysisLoaded = true
				} catch (e) {
					if (!this._disposed) this.analysisLoadError = true
				}
			},
			async saveHealthSettings() {
				if (this.saving || this._healthSaving) return
				if (!this.analysisLoaded) {
					uni.showToast({
						title: this.hrt('loadFailed'),
						icon: 'none'
					});
					return
				}
				this._healthSaving = true
				const store = this.createHealthStore(),
					base = this.$url_APP_IP
				const analysis = {
					...this.analysisSettings
				}
				try {
					const saved = await this.saveReminders(true)
					if (!saved || !store.isCurrent() || base !== this.$url_APP_IP) return
					if (!this._disposed) this.saving = true
					await store.saveAnalysis(analysis)
					if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return
					this.savedAnalysisEnabled = analysis.enabled
					this.reportRefresh++
					const advised = await this.showBloodPressureSuggestion(saved, store, base)
					if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return
					if (!advised) uni.showToast({
						title: this.$t(this.notificationHint ? '吃药提醒已保存待开启' : '保存成功'),
						icon: 'none'
					})
				} catch (e) {
					if (!this._disposed) uni.showToast({
						title: this.hrt('analysisFailed'),
						icon: 'none'
					})
				} finally {
					this._healthSaving = false;
					if (!this._disposed) this.saving = false
				}
			},
			async showBloodPressureSuggestion(reminders, store, base) {
				if (!reminders.some(item => item.enabled)) {
					try {
						await this.disableMedicationLinkedBloodPressure(store, base)
					} catch (error) {}
					return false
				}
				const active = reminders.filter(item => item.enabled && Array.isArray(item.times) && item.times.length && Array.isArray(item.weekdays) && item.weekdays.length)
				try {
					const settings = await store.loadBloodPressure()
					if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return false
					if (settings.enabled && settings.reminders.some(item => item.enabled)) {
						if (!active.length || bloodPressureMatchesMedication(settings.reminders, active)) {
							if (active.length) {
								try {
									await this.appendMissingMedicationBloodPressureTimes(store, base, active)
								} catch (error) {}
							}
							return false
						}
						const reset = await this.askReminderModal({
							title: this.hrt('notice'),
							content: this.$t('健康提醒血压时间偏差'),
							confirmText: this.$t('确定'),
							cancelText: this.$t('健康提醒忽略')
						})
						if (!reset || this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return false
						try {
							await this.applyMedicationBloodPressureTimes(store, base, active)
						} catch (error) {}
						if (!this._disposed && store.isCurrent() && base === this.$url_APP_IP) this.openBloodPressureReminder()
						return true
					}
					let scheduled = false
					if (active.length) {
						try {
							scheduled = await this.applyMedicationBloodPressureTimes(store, base, active)
						} catch (error) {
							scheduled = false
						}
					}
					if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return false
					const kind = await this.boundReminderDeviceKind()
					uni.showModal({
						title: this.hrt('notice'),
						content: this.$t(scheduled && kind === 'watch' ? '健康提醒用药配合手表测量建议' : '健康提醒用药配合测量建议'),
						showCancel: false
					})
					return true
				} catch (error) {
					// 建议弹窗不影响已经保存的提醒；读取失败时不误判为未设置血压提醒。
					return false
				}
			},
			askReminderModal(options) {
				return new Promise(resolve => {
					uni.showModal({
						...options,
						success: result => resolve(!!(result && result.confirm)),
						fail: () => resolve(false)
					})
				})
			},
			async boundReminderDeviceKind() {
				try {
					const result = await this.$post(this.$url_APP_IP + this.$url_queryDevices, {}, {
						Authorization: 'Bearer ' + uni.getStorageSync('token'),
						'content-type': 'application/json'
					})
					if (!result || Number(result.code) !== 200 || !Array.isArray(result.rows)) return 'none'
					return selectBPReminderDevice(result.rows).kind
				} catch (error) {
					return 'none'
				}
			},
			async disableMedicationLinkedBloodPressure(store, base) {
				const settings = await store.loadBloodPressure()
				if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return
				const next = withoutAutoBloodPressure(settings)
				if (!next) return
				await store.saveBloodPressure(next)
				if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return
				uni.$emit(HEALTH_REMINDERS_CHANGED)
				try {
					await refreshHealthReminderRuntime(this)
				} catch (error) {}
			},
			async appendMissingMedicationBloodPressureTimes(store, base, reminders) {
				const existing = await store.loadBloodPressure()
				if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return false
				const settings = appendMissingMedicationBloodPressure(existing, reminders)
				if (!settings) return false
				await store.saveBloodPressure(settings)
				if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return false
				uni.$emit(HEALTH_REMINDERS_CHANGED)
				try {
					await refreshHealthReminderRuntime(this)
				} catch (error) {}
				return true
			},
			async applyMedicationBloodPressureTimes(store, base, reminders) {
				const existing = await store.loadBloodPressure()
				if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return false
				const settings = mergeMedicationBloodPressure(existing, reminders)
				if (!settings) return false
				await store.saveBloodPressure(settings)
				if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return false
				uni.$emit(HEALTH_REMINDERS_CHANGED)
				try {
					await refreshHealthReminderRuntime(this)
				} catch (error) {}
				return true
			},
			soundIndex(sound) {
				return Math.max(0, this.soundValues.indexOf(sound || 'system'))
			},
			setSound(index, event) {
				if (this.saving) return
				const sound = this.soundValues[Number(event.detail.value)]
				if (!sound) return
				this.$set(this.reminders[index], 'sound', sound)
				if (sound === 'alarm' && !ALARM_SOUND_SECONDS.includes(Number(this.reminders[index].soundSeconds))) {
					this.$set(this.reminders[index], 'soundSeconds', DEFAULT_ALARM_SOUND_SECONDS)
				}
			},
			soundDurationIndex(item) {
				const index = ALARM_SOUND_SECONDS.indexOf(Number(item && item.soundSeconds))
				return index < 0 ? ALARM_SOUND_SECONDS.indexOf(DEFAULT_ALARM_SOUND_SECONDS) : index
			},
			setSoundDuration(index, event) {
				const seconds = ALARM_SOUND_SECONDS[Number(event.detail.value)]
				if (!this.saving && seconds) this.$set(this.reminders[index], 'soundSeconds', seconds)
			},
			async updateNotificationStatus() {
				try {
					const state = await medicationNotificationStatus(this)
					if (!this._disposed) this.notificationState = state
				} catch (error) {
					if (!this._disposed) this.notificationState = {
						available: false
					}
				}
			},
			async scheduleNotifications(reminders, account) {
				try {
					await applyMedicationNotifications(this, reminders, account)
					if (!this._disposed) this.notificationSyncFailed = false
				} catch (error) {
					if (!this._disposed && error.code !== 'SUPERSEDED') this.notificationSyncFailed = true
				}
				await this.updateNotificationStatus()
			},
			openNotificationIssueSettings() {
				const state = this.notificationState
				if (!state.notifications) return this.openNotificationSettings('notifications')
				if (!state.exact) return this.openNotificationSettings('exact')
				if (state.blockedSound) return this.openNotificationSettings('sound', state.blockedSound)
				if (state.soundDisabled) return this.openNotificationSettings(state.soundSettingsKind || 'notifications', state.soundDisabledSound)
				return this.openNotificationSettings('notifications')
			},
			async openNotificationSettings(kind, sound) {
				try {
					await openMedicationNotificationSettings(this, kind, sound || 'system')
				} catch (error) {
					uni.showToast({
						title: this.$t('吃药提醒通知不可用'),
						icon: 'none'
					})
				}
			},
			async previewSound(item) {
				try {
					const sound = item && item.sound || 'system'
					await previewMedicationSound(this, sound, sound === 'alarm' ? item.soundSeconds || DEFAULT_ALARM_SOUND_SECONDS : undefined)
				} catch (error) {
					await this.updateNotificationStatus()
					uni.showToast({
						title: this.$t(error.code === 'PERMISSION' ? '吃药提醒通知权限提示' : '吃药提醒通知不可用'),
						icon: 'none'
					})
				}
			},
			isCurrent() {
				return !this._disposed && this._reminderStore && this._reminderStore.isCurrent() &&
					this._reminderBaseUrl === this.$url_APP_IP
			},
			async loadReminders() {
				if (this.loading || this.saving) return
				if (!uni.getStorageSync('token') || !uni.getStorageSync('userid')) {
					uni.redirectTo({
						url: '/pages/login/login_land'
					})
					return
				}
				this.loading = true
				this.loaded = false
				this.loadError = false
				this._reminderBaseUrl = this.$url_APP_IP
				const notificationAccount = medicationNotificationAccount(this)
				this._reminderStore = createMedicationReminderStore({
					baseUrl: this._reminderBaseUrl,
					get: this.$get,
					post: this.$post,
					storage: uni
				})
				try {
					const plan = await this._reminderStore.loadPlan(), reminders = plan.reminders
					if (!this.isCurrent()) return
					this.medicationStatus = plan.medicationStatus
					this.confirmedAllDrugs = plan.confirmedAllDrugs
					this.reminders = reminders.map(item => ({ ...item, clinical: item.clinical || { drugName: '', market: 'CN', ingredients: [] } }))
					this._savedReminders = JSON.parse(JSON.stringify(reminders))
					this._savedNotificationAccount = notificationAccount
					this.loaded = true
					if (!this.reminders.length) {
						this.addReminder()
						this.reminders[0].enabled = false
					}
					await this.scheduleNotifications(reminders, notificationAccount)
				} catch (error) {
					if (!this._disposed) this.loadError = true
				} finally {
					if (!this._disposed) this.loading = false
				}
			},
			addReminder() {
				if (!this.loaded || this.saving || this.reminders.length >= this.maxReminders) return
				this._nextReminderId = (this._nextReminderId || 0) + 1
				this.reminders.push({
					id: 'med-' + Date.now() + '-' + this._nextReminderId,
					name: this.hrt('take'),
					clinical: { drugName: '', market: 'CN', ingredients: [] },
					dose: '',
					note: '',
					enabled: true,
					sound: 'system',
					times: ['08:00'],
					weekdays: [1, 2, 3, 4, 5, 6, 7]
				})
			},
			setEnabled(index, event) {
				if (!this.saving) this.reminders[index].enabled = event.detail.value
			},
			timePickerValue(time) {
				return time.split(':').map(Number)
			},
			setTime(index, timeIndex, event) {
				if (this.saving || !this.reminders[index] || timeIndex < 0 || timeIndex >= this.reminders[index].times.length) return
				const value = event && event.detail && event.detail.value
				if (!Array.isArray(value) || value.length !== 2 || value.some((part, column) =>
						!Number.isInteger(part) || part < 0 || part >= this.timeRanges[column].length)) {
					uni.showToast({
						title: this.$t('吃药提醒检查时间'),
						icon: 'none'
					})
					return
				}
				this.$set(this.reminders[index].times, timeIndex, value.map((part, column) => this.timeRanges[column][
					part
				]).join(':'))
			},
			addTime(index) {
				const times = this.reminders[index].times
				if (this.saving || times.length >= this.maxTimes) return
				const hour = Array.from({
						length: 24
					}, (_, i) => String((i + 8) % 24).padStart(2, '0') + ':00')
					.find(time => !times.includes(time))
				times.push(hour)
			},
			removeTime(index, timeIndex) {
				if (!this.saving && this.reminders[index].times.length > 1) this.reminders[index].times.splice(timeIndex,
					1)
			},
			toggleDay(index, day) {
				if (this.saving) return
				const days = this.reminders[index].weekdays
				const position = days.indexOf(day)
				if (position === -1) days.push(day)
				else days.splice(position, 1)
			},
			setEveryday(index) {
				if (!this.saving) this.reminders[index].weekdays = [1, 2, 3, 4, 5, 6, 7]
			},
			removeReminder(index) {
				if (this.saving) return
				const id = this.reminders[index].id
				uni.showModal({
					title: this.$t('吃药提醒删除'),
					content: this.$t('吃药提醒删除确认'),
					success: result => {
						if (result.confirm && !this.saving && !this._disposed) this.reminders = this.reminders
							.filter(item => item.id !== id)
					}
				})
			},
			async saveReminders(silent = false) {
				if (!this.loaded || this.loading || this.saving) return
				if (!this.isCurrent()) {
					uni.showToast({
						title: this.$t('吃药提醒账号变化'),
						icon: 'none'
					})
					return
				}
				this.saving = true
				const notificationAccount = medicationNotificationAccount(this)
				try {
					const plan = await this._reminderStore.savePlan(this.reminders.map(item => ({
						...item,
						name: (item.clinical && item.clinical.drugName || '').trim() || this.hrt('take'),
						dose: item.clinical && item.clinical.doseValue ? item.clinical.doseValue + ' ' + (item.clinical.doseUnit || '') : item.dose
					})), { medicationStatus: this.medicationStatus, confirmedAllDrugs: this.confirmedAllDrugs })
					const reminders = plan.reminders
					// 保存请求成功后即安排通知，离开设置页也不丢失此次安排。
					await this.scheduleNotifications(reminders, notificationAccount)
					if (this._reminderStore.isCurrent() && this._reminderBaseUrl === this.$url_APP_IP) uni.$emit(
						HEALTH_REMINDERS_CHANGED)
					if (!this.isCurrent()) return silent ? reminders : undefined
					this.reminders = reminders
					this._savedReminders = JSON.parse(JSON.stringify(reminders))
					this._savedNotificationAccount = notificationAccount
					if (!silent) uni.showToast({
						title: this.$t(this.notificationHint ? '吃药提醒已保存待开启' : '保存成功'),
						icon: 'none'
					})
					return reminders
				} catch (error) {
					if (!this.isCurrent()) return
					const messages = {
						clinical: '药单检查信息',
						name: '吃药提醒填写药名',
						reminders: '吃药提醒数量上限',
						times: '吃药提醒检查时间',
						weekdays: '吃药提醒选择星期'
					}
					uni.showToast({
						title: this.$t(messages[error.field] || '吃药提醒保存失败'),
						icon: 'none'
					})
				} finally {
					if (!this._disposed) this.saving = false
				}
			}
		}
	}
</script>

<style scoped>
	.profile-toolbar { display:flex;justify-content:flex-end;margin-bottom:8px }
	.profile-entry { margin:0;padding:0 15px;font-size:14px;line-height:32px;color:#1479bb;background:#fff;border-radius:16px }
	.regimen-status { padding:16px;background:#fff;border-radius:14px;margin-bottom:14px;font-size:15px }
	.regimen-status picker { color:#087ec8;margin:10px 0 }
	.regimen-note { display:block;color:#6b7d90;font-size:12px;line-height:1.6 }
	.regimen-time-actions { display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:12px;margin:10px 0 }
	.regimen-time-actions button { margin:0;font-size:12px;background:#edf7ff;color:#1479bb;padding:0 8px }
	.regimen-confirm { display:flex;align-items:center;gap:8px;padding:14px;background:#fff;border-radius:12px;font-size:13px;line-height:1.6 }
	.medication-page {
		min-height: 100vh;
		box-sizing: border-box;
		padding: 12px 12px 32px;
		padding-bottom: calc(32px + env(safe-area-inset-bottom));
		background: linear-gradient(125deg, #f7fcff, #e8f4ff);
		color: #101b35
	}

	.overview-page {
		padding: 20px 16px 40px
	}

	.bp-page {
		padding-top: 0;
		padding-left: 0;
		padding-right: 0
	}

	.health-hero {
		display: flex;
		align-items: center;
		gap: 17px;
		padding: 9px 9px 32px
	}

	.hero-calendar {
		position: relative;
		flex-shrink: 0;
		width: 80px;
		height: 90px;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.hero-calendar .reminder-symbol {
		width: 80px;
		height: 80px
	}

	.hero-bell {
		position: absolute;
		left: -4px;
		bottom: 12px
	}

	.health-title {
		display: block;
		font-size: 25px;
		font-weight: 750;
		line-height: 1.3
	}

	.health-intro {
		display: block;
		margin-top: 7px;
		font-size: 14px;
		line-height: 1.55;
		color: #263348
	}

	.health-entry {
		display: flex;
		align-items: center;
		gap: 13px;
		margin-bottom: 14px;
		padding: 18px 14px;
		border: 1px solid #e1eaf2;
		border-radius: 19px;
		background: #ffffffd9;
		box-shadow: 0 3px 6px #d3e0eb;
		min-height: 61px
	}

	.health-entry>.reminder-symbol {
		width: 55px;
		height: 55px
	}

	.health-entry>view:nth-child(2) {
		flex: 1
	}

	.entry-title {
		display: block;
		font-size: 18px;
		font-weight: 700;
		line-height: 1.3
	}

	.entry-description {
		display: block;
		font-size: 13px;
		line-height: 1.4;
		color: #465166;
		margin-top: 5px
	}

	.chevron {
		font-size: 27px;
		color: #707988;
		line-height: 1;
		flex-shrink: 0
	}

	.health-plan {
		margin-top: 30px;
		border-radius: 22px;
		background: linear-gradient(120deg, #dcefff, #cfe7fb);
		padding-top: 14px;
		overflow: hidden
	}

	.plan-title {
		font-size: 21px;
		font-weight: 700;
		display: block;
		margin: 0 17px 14px
	}

	.plan-list {
		border-radius: 17px;
		background: #ffffffed;
		padding: 0 12px;
		box-shadow: 0 3px 7px #cbd9e5
	}

	.plan-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 0;
		border-bottom: 1px solid #e9edf2
	}

	.plan-row:last-child {
		border-bottom: 0
	}

	.plan-row .reminder-symbol {
		width: 35px;
		height: 35px;
		transform: scale(.8);
		margin: -4px
	}

	.plan-time {
		font-weight: 700;
		font-size: 15px;
		min-width: 87px
	}

	.plan-date {
		display: block;
		color: #91a0ae;
		font-weight: 400;
		font-size: 10px;
		margin-top: 3px
	}

	.plan-label {
		font-size: 13px;
		line-height: 1.4;
		flex: 1;
		word-break: break-word
	}

	.check-hit {
		width: 35px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.reminder-check {
		width: 23px;
		height: 23px;
		border: 2px solid #a4adb9;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		color: white;
		font-size: 16px
	}

	.reminder-check.checked {
		background: #43c719;
		border-color: #43c719
	}

	.reminder-check.busy {
		opacity: .45
	}

	.plan-empty {
		padding: 35px 12px;
		color: #8393a5;
		text-align: center;
		font-size: 14px
	}

	.medicine-heading {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 15px 10px;
		background: #ffffffea;
		border: 1px solid #e0edf7;
		border-radius: 21px;
		box-shadow: 0 2px 4px #dceaf5;
		margin-bottom: 10px
	}

	.medicine-title {
		flex: 1;
		min-width: 0;
		font-weight: 700;
		font-size: 19px;
		line-height: 1.25
	}

	.medicine-description {
		display: block;
		font-size: 12px;
		line-height: 1.4;
		color: #586377;
		font-weight: 400;
		margin-top: 5px
	}

	switch {
		transform: scale(.82);
		transform-origin: right center;
		flex-shrink: 0
	}

	.medicine-fields {
		background: #ffffffea;
		border: 1px solid #dbeaf7;
		border-radius: 18px;
		box-shadow: 0 2px 4px #dceaf5;
		padding: 0 12px
	}

	.medicine-row {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 48px;
		border-bottom: 1px solid #e6ecf2;
		padding: 3px 0
	}

	.medicine-row:last-child {
		border-bottom: 0
	}

	.medicine-time-picker {
		display: block;
		border-bottom: 1px solid #e6ecf2
	}

	.row-label {
		font-size: 15px;
		font-weight: 600;
		flex-shrink: 0
	}

	.row-value {
		flex: 1;
		text-align: right;
		min-width: 0;
		color: #252d3a;
		font-size: 13px;
		line-height: 1.5
	}

	.row-input {
		flex: 1;
		min-width: 0;
		text-align: right;
		font-size: 13px;
		height: 40px;
		padding: 0;
		margin: 0
	}

	.row-chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 12px;
		height: 22px;
		flex-shrink: 0
	}

	.row-chevron::after {
		content: '';
		width: 7px;
		height: 7px;
		border-top: 2px solid #707988;
		border-right: 2px solid #707988;
		transform: rotate(45deg)
	}

	.down-chevron::after {
		transform: translateY(-2px) rotate(135deg)
	}

	.medicine-row .dose-symbol {
		width: 25px;
		height: 25px;
		transform: scale(.65);
		background: transparent;
		margin: 0 0 0 1px
	}

	.extra-toggle {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
		padding: 8px 13px;
		color: #678ba7;
		font-size: 12px
	}

	.extra-fields {
		padding: 12px;
		margin-bottom: 14px
	}

	.extra-fields textarea {
		width: 100%;
		font-size: 14px;
		box-sizing: border-box;
		padding: 12px 0
	}

	.field-detail {
		padding: 12px 0
	}

	.time-list {
		display: flex;
		gap: 8px;
		flex-wrap: wrap
	}

	.time-chip {
		display: flex;
		align-items: center;
		background: #edf6ff;
		border: 1px solid #cae4ff;
		border-radius: 9px;
		overflow: hidden
	}

	.time-value {
		padding: 10px;
		font-size: 14px;
		color: #087fdf
	}

	.remove-time {
		background: transparent;
		padding: 0 9px;
		color: #8a9aaa;
		font-size: 22px;
		line-height: 32px
	}

	.add-time,
	.everyday-button {
		font-size: 12px;
		line-height: 34px;
		color: #0089ef;
		background: #edf7ff;
		margin: 0
	}

	.weekday-list {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		margin-top: 10px
	}

	.weekday-button {
		padding: 0 9px;
		font-size: 12px;
		line-height: 33px;
		background: #f4f7fb;
		color: #8391a2;
		border-radius: 9px;
		margin: 0
	}

	.weekday-button.selected {
		background: #e0f1ff;
		color: #008aef;
		border: 1px solid #70bfff
	}

	.analysis-card {
		margin-top: 12px;
		background: #fff;
		border: 1px solid #dbeaf7;
		border-radius: 18px;
		padding: 12px 14px;
		box-shadow: 0 2px 4px #dceaf5
	}

	.analysis-heading {
		display: flex;
		gap: 7px;
		align-items: center;
		font-weight: 700;
		font-size: 17px
	}

	.analysis-title {
		flex: 1;
		min-width: 0
	}

	.field-symbol {
		width: 26px;
		height: 26px
	}

	.analysis-description {
		display: block;
		font-size: 12px;
		line-height: 1.5;
		margin-top: 4px;
		color: #657285
	}

	.analysis-error {
		display: block;
		font-size: 12px;
		color: #be5936;
		margin-top: 7px
	}

	.save-button {
		margin-top: 18px;
		width: 100%;
		background: linear-gradient(110deg, #00a1ff, #0074ff);
		border-radius: 26px;
		color: white;
		font-size: 21px;
		font-weight: 600;
		line-height: 46px
	}

	.add-button {
		margin-top: 18px;
		color: #187fc8;
		background: #e2f1ff;
		font-size: 14px;
		line-height: 42px;
		border-radius: 20px
	}

	.delete-button {
		font-size: 12px;
		color: #ca606a;
		background: #fff4f4;
		line-height: 36px;
		margin-top: 10px
	}

	.state-card {
		padding: 35px 20px;
		border-radius: 17px;
		background: white;
		color: #8191a2;
		text-align: center
	}

	.notification-status {
		border: 1px solid #ffe4b2;
		background: #fff8e8;
		color: #8a713e;
		padding: 12px;
		border-radius: 14px;
		font-size: 12px;
		line-height: 1.5;
		margin-bottom: 12px
	}

	.notification-status button {
		font-size: 12px;
		line-height: 30px;
		background: white;
		color: #087fdf;
		margin-top: 8px
	}

	.sound-row {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		font-size: 13px
	}

	.sound-label {
		flex-shrink: 0;
		width: 68px;
		margin-right: 12px
	}

	.sound-picker {
		flex: 1;
		min-width: 0;
		margin-right: 8px;
		background: #edf7ff;
		border-radius: 8px
	}

	.sound-value {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px
	}

	.sound-chevron {
		margin-left: 12px;
		color: #7aa0bd
	}

	.sound-action,
	.sound-settings {
		background: transparent;
		font-size: 12px;
		color: #0083df;
		line-height: 30px;
		padding: 0
	}

	.sound-settings {
		text-align: left;
		margin-top: 7px
	}

	button::after {
		border: 0
	}

	.plan-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px 12px;
		gap: 8px
	}

	.plan-heading .plan-title {
		margin: 0
	}

	.history-link {
		font-size: 12px;
		color: #087edc;
		white-space: nowrap
	}

	.plan-time {
		font-size: 17px;
		min-width: 94px;
		white-space: nowrap
	}

	.plan-label {
		font-size: 16px
	}

	.plan-row .reminder-symbol {
		transform: none;
		width: 30px;
		height: 30px;
		margin: 0
	}

	.plan-row {
		gap: 9px;
		padding: 10px 0
	}

	.plan-row.cancelled {
		color: #8c9aaa
	}

	.cancelled-note {
		display: block;
		font-size: 10px;
		color: #8b9bab;
		line-height: 1.5
	}

	.medicine-heading .reminder-symbol {
		width: 54px;
		height: 54px
	}

	.medicine-row .field-symbol {
		width: 25px;
		height: 25px
	}

	.analysis-heading .field-symbol {
		width: 26px;
		height: 26px
	}

	@media(max-width:360px) {
		.plan-time {
			font-size: 15px;
			min-width: 83px
		}

		.plan-label {
			font-size: 14px
		}
	}
</style>
