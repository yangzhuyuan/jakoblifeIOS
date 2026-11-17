<template>
	<view class="bp-reminder-settings">
		<image class="bp-hero-art" :src="bpHeroImage" mode="widthFix" />
		<view class="bp-settings-content">
			<text class="bp-intro">{{ hrt('bpHelp') }}</text>
			<view v-if="loading || failed" class="bp-state" @click="failed && load()">
				{{ hrt(failed ? 'loadFailed' : 'loading') }}
			</view>
			<template v-else>
				<view class="bp-enable"><text>{{ hrt('bpEnable') }}</text>
					<switch :checked="settings.enabled" :disabled="saving" color="#22c344"
						@change="settings.enabled = $event.detail.value" />
				</view>
				<view v-if="settings.enabled && warning" class="bp-warning"><text>{{ hrt(warning) }}</text><text
						v-if="notification.available && notification.healthActions" class="open-settings"
						@click="openPermissions">{{ hrt('settings') }} ›</text></view>
				<view class="bp-times-heading">
					<view><text class="times-title">{{ hrt('bpTimes') }}</text><text
							class="multiple">（{{ hrt('multiple') }}）</text></view>
					<view v-if="settings.reminders.length < maxRows" class="add-reminder" @click="add"><text
							class="plus-circle">+</text>{{ hrt('addReminder') }}</view>
				</view>
				<view class="bp-times">
					<view v-for="(item, index) in settings.reminders" :key="item.id" class="bp-time-group">
						<view class="bp-time-row">
							<view class="bp-checkbox-hit" @click="!saving && (item.enabled = !item.enabled)">
								<view class="bp-checkbox" :class="{checked:item.enabled}"><text
										v-if="item.enabled">✓</text>
								</view>
							</view>
							<picker mode="multiSelector" :range="timeRanges"
								:value="item.times[0].split(':').map(Number)" :disabled="saving"
								@change="setTime(index, $event)"><text
									class="bp-time">{{ displayTime(item.times[0]) }}</text></picker>
							<view class="bp-repeat" @click="!saving && (expanded = expanded === index ? -1 : index)">
								<text>{{ repeat(item) }}</text>
								<view class="bp-chevron"></view>
							</view>
						</view>
						<view class="bp-sound-row">
							<text class="bp-sound-label">{{ $t('吃药提醒提示音') }}</text>
							<picker class="bp-sound-picker" :range="soundLabels" :value="soundIndex(item.sound)"
								:disabled="saving" @change="setSound(index, $event)">
								<view class="bp-sound-value"><text>{{ soundLabels[soundIndex(item.sound)] }}</text><text
										class="bp-sound-chevron">›</text></view>
							</picker>
							<button v-if="item.sound !== 'silent'" class="bp-sound-action" :disabled="saving"
								@click="previewSound(item)">{{ $t('吃药提醒试听') }}</button>
						</view>
						<view v-if="item.sound === 'alarm'" class="bp-sound-row">
							<text class="bp-sound-label">{{ $t('吃药提醒铃声时长') }}</text>
							<picker class="bp-sound-picker" :range="soundDurationLabels"
								:value="soundDurationIndex(item)" :disabled="saving"
								@change="setSoundDuration(index, $event)">
								<view class="bp-sound-value">
									<text>{{ soundDurationLabels[soundDurationIndex(item)] }}</text><text
										class="bp-sound-chevron">›</text></view>
							</picker>
						</view>
						<button class="bp-sound-settings" :disabled="saving"
							@click="openSoundSettings(item.sound)">{{ $t('吃药提醒系统声音设置') }}</button>
						<view v-if="expanded === index" class="bp-repeat-editor">
							<view class="bp-days"><button v-for="day in weekdays" :key="day.value"
									:class="{selected:item.weekdays.includes(day.value)}" :disabled="saving"
									@click="toggleDay(item, day.value)">{{ $t(day.label) }}</button></view>
							<view class="bp-edit-actions"><text
									@click="!saving && (item.weekdays = [1,2,3,4,5,6,7])">{{ hrt('every') }}</text><text
									@click="remove(index)">{{ hrt('removeTime') }}</text></view>
						</view>
					</view>
					<view v-if="!settings.reminders.length" class="bp-state">{{ hrt('unset') }}</view>
				</view>
				<view class="bp-recommend">
					<view class="recommend-heading">
						<ReminderIcon kind="bulb" /><text>{{ hrt('recommended') }}</text>
					</view><text>• {{ hrt('recMorning') }}</text><text>• {{ hrt('recLunch') }}</text><text>•
						{{ hrt('recEvening') }}</text>
				</view>
				<button class="bp-save" :disabled="saving" :loading="saving"
					@click="save">{{ hrt(saving ? 'saving' : 'save') }}</button>
				<text v-if="settings.enabled && notification.ios && notification.bpScheduledThrough"
					class="ios-schedule">{{ hrt('iosUntil') }} {{ scheduledThrough }}。{{ hrt('iosRefill') }}</text>
			</template>
		</view>
	</view>
</template>
<script>
	import ReminderIcon from './ReminderIcon.vue'
	import {
		createHealthReminderStore,
		HEALTH_REMINDERS_CHANGED
	} from '@/pages/tabBar/main/Reminders/api/healthReminders.js'
	import {
		MAX_BP_REMINDERS,
		BP_REMINDER_SOUNDS,
		normalizeBloodPressureSettings
	} from '@/pages/tabBar/main/Reminders/api/bloodPressureReminder.js'
	import {
		ALARM_SOUND_SECONDS,
		DEFAULT_ALARM_SOUND_SECONDS
	} from '@/pages/tabBar/main/Reminders/api/medicationReminder.js'
	import {
		healthReminderText,
		reminderDisplayTime
	} from '@/pages/tabBar/main/Reminders/api/healthReminderText.js'
	import {
		refreshHealthReminderRuntime
	} from '@/pages/tabBar/main/Reminders/api/healthReminderRuntime.js'
	import {
		medicationNotificationStatus,
		medicationNotificationAccount,
		openMedicationNotificationSettings,
		previewMedicationSound,
		stopMedicationSoundPreview
	} from '@/pages/tabBar/main/Reminders/api/medicationNotifications.js'
	import {
		setBloodPressureReminderKeepAlive
	} from '@/pages/tabBar/main/Reminders/api/reminderKeepAliveState.js'
	export default {
		components: {
			ReminderIcon
		},
		data() {
			return {
				loading: true,
				failed: false,
				saving: false,
				settings: {
					enabled: false,
					reminders: []
				},
				expanded: -1,
				notification: {},
				soundValues: BP_REMINDER_SOUNDS,
				maxRows: MAX_BP_REMINDERS,
				timeRanges: [Array.from({
					length: 24
				}, (_, i) => String(i).padStart(2, '0')), Array.from({
					length: 60
				}, (_, i) => String(i).padStart(2, '0'))],
				weekdays: [1, 2, 3, 4, 5, 6, 7].map((value, i) => ({
					value,
					label: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i]
				}))
			}
		},
		computed: {
			bpHeroImage() {
				const image = require('../assets/bp-hero.jpg')
				return image.default || image
			},
			soundLabels() {
				return ['吃药提醒系统提示音', '吃药提醒闹钟提示音', '吃药提醒静音'].map(key => this.$t(key))
			},
			soundDurationLabels() {
				return ['吃药提醒铃声短', '吃药提醒铃声12秒', '吃药提醒铃声24秒'].map(key => this.$t(key))
			},
			warning() {
				if (!this.notification.healthActions || (!this.notification.bpSounds && this.settings.reminders.some(
						item =>
						item.enabled && item.sound && item.sound !== 'system'))) return 'nativeUpdate'
				if (!this.notification.notifications || !this.notification.exact || this.notification.bpBlocked)
					return 'reminderPermission'
				return this.notification.bpSoundDisabled ? 'bpSoundDisabled' : ''
			},
			scheduledThrough() {
				const date = new Date(this.notification.bpScheduledThrough);
				return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date
					.getDate()).padStart(2, '0') + ' ' + String(date.getHours()).padStart(2, '0') + ':' + String(date
					.getMinutes()).padStart(2, '0')
			}
		},
		mounted() {
			this.load();
			this.refreshNotificationStatus()
		},
		beforeDestroy() {
			this._disposed = true
			stopMedicationSoundPreview(this)
		},
		methods: {
			hrt(key) {
				return healthReminderText(this, key)
			},
			displayTime(time) {
				return String(this.$i18n.locale).startsWith('en') ? reminderDisplayTime(this, time) : time
			},
			repeat(item) {
				return item.weekdays.length === 7 ? this.hrt('every') : this.weekdays.filter(day => item.weekdays.includes(
					day.value)).map(day => this.$t(day.label)).join(' ')
			},
			store() {
				return createHealthReminderStore({
					baseUrl: this.$url_APP_IP,
					get: (...a) => this.$get(...a),
					post: (...a) => this.$post(...a),
					storage: uni
				})
			},
			async load() {
				if (this.saving) return;
				this.loading = true;
				this.failed = false;
				const store = this.store(),
					base = this.$url_APP_IP
				try {
					const settings = await store.loadBloodPressure();
					if (this._disposed || !store.isCurrent() || base !== this.$url_APP_IP) return
					this.settings = settings;
					this._store = store;
					this._base = base
					this._linkedBloodPressure = settings.origin === 'medication'
					this._linkedBloodPressureEnabled = settings.enabled === true
					if (!settings.reminders.length) {
						this.add('08:00');
						this.add('20:00')
					}
				} catch (e) {
					if (!this._disposed) this.failed = true
				} finally {
					if (!this._disposed) this.loading = false
				}
			},
			async refreshNotificationStatus() {
				try {
					const status = await medicationNotificationStatus(this);
					if (!this._disposed) this.notification = status
				} catch (e) {
					if (!this._disposed) this.notification = {}
				}
			},
			openPermissions() {
				if (this.notification.bpBlocked) return this.openSoundSettings(this.notification.bpBlockedSound)
				openMedicationNotificationSettings(this, this.notification.notifications && !this.notification.exact ?
						'exact' : 'notifications')
					.catch(() => {})
			},
			soundIndex(sound) {
				return Math.max(0, this.soundValues.indexOf(sound || 'system'))
			},
			setSound(index, event) {
				const selected = Number(event.detail.value)
				const sound = this.soundValues[selected]
				if (!this.saving && sound) {
					this.$set(this.settings.reminders[index], 'sound', sound)
					if (sound === 'alarm' && !ALARM_SOUND_SECONDS.includes(Number(this.settings.reminders[index]
							.soundSeconds))) {
						this.$set(this.settings.reminders[index], 'soundSeconds', DEFAULT_ALARM_SOUND_SECONDS)
					}
				}
			},
			soundDurationIndex(item) {
				const index = ALARM_SOUND_SECONDS.indexOf(Number(item && item.soundSeconds))
				return index < 0 ? ALARM_SOUND_SECONDS.indexOf(DEFAULT_ALARM_SOUND_SECONDS) : index
			},
			setSoundDuration(index, event) {
				const seconds = ALARM_SOUND_SECONDS[Number(event.detail.value)]
				if (!this.saving && seconds) this.$set(this.settings.reminders[index], 'soundSeconds', seconds)
			},
			async previewSound(item) {
				try {
					const sound = item && item.sound || 'system'
					await previewMedicationSound(this, sound, sound === 'alarm' ? item.soundSeconds ||
						DEFAULT_ALARM_SOUND_SECONDS : undefined)
				} catch (error) {
					if (!this._disposed) uni.showToast({
						title: this.hrt(error.code === 'PERMISSION' ? 'reminderPermission' : 'nativeUpdate'),
						icon: 'none'
					})
				}
			},
			async openSoundSettings(sound) {
				try {
					await openMedicationNotificationSettings(this, 'bpSound', sound || 'system')
				} catch (error) {
					if (!this._disposed) uni.showToast({
						title: this.hrt('nativeUpdate'),
						icon: 'none'
					})
				}
			},
			add(time) {
				if (this.saving || this.settings.reminders.length >= this.maxRows) return;
				const used = new Set(this.settings.reminders.flatMap(item => item.times))
				const nextTime = Array.from({
					length: 24
				}, (_, i) => String((i + 8) % 24).padStart(2, '0') + ':00').find(value => !used.has(value))
				this.settings.reminders.push({
					id: 'bp-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
					enabled: true,
					sound: 'system',
					times: [typeof time === 'string' ? time : nextTime],
					weekdays: [1, 2, 3, 4, 5, 6, 7]
				})
			},
			setTime(index, event) {
				const value = event.detail.value;
				if (this.saving || !Array.isArray(value) || value.length !== 2 || value.some((n, i) => !Number.isInteger(
						n) || n < 0 || n >= this.timeRanges[i].length)) return;
				this.$set(this.settings.reminders[index], 'times', [value.map((n, i) => this.timeRanges[i][n]).join(':')])
			},
			toggleDay(item, day) {
				if (this.saving) return;
				const at = item.weekdays.indexOf(day);
				if (at < 0) item.weekdays.push(day);
				else item.weekdays.splice(at, 1)
			},
			remove(index) {
				if (!this.saving) {
					this.settings.reminders.splice(index, 1);
					this.expanded = -1
				}
			},
			async save() {
				if (this.saving || !this._store || !this._store.isCurrent() || this._base !== this.$url_APP_IP) return
				let value;
				try {
					value = normalizeBloodPressureSettings(this.settings)
					if (!(this._linkedBloodPressure && this._linkedBloodPressureEnabled && value.enabled)) delete value.origin
				} catch (e) {
					uni.showToast({
						title: this.hrt('bpInvalid'),
						icon: 'none'
					});
					return
				}
				this.saving = true;
				const account = medicationNotificationAccount(this)
				try {
					await this._store.saveBloodPressure(value);
					this._linkedBloodPressure = value.origin === 'medication'
					this._linkedBloodPressureEnabled = value.enabled === true
					setBloodPressureReminderKeepAlive(value, account);
					uni.$emit(HEALTH_REMINDERS_CHANGED)
					let scheduleFailed = false
					try {
						await refreshHealthReminderRuntime(this);
					} catch (e) {
						console.error('[BP_SAVE_ERROR] ' + JSON.stringify({
							code: e && e.code,
							method: e && e.method,
							message: e && e.message,
							stage: e && e.stage,
							nativeDomain: e && e.nativeDomain,
							nativeCode: e && e.nativeCode,
							stack: e && e.stack
						}))
						scheduleFailed = !e || e.code !== 'SUPERSEDED'
					}
					await this.refreshNotificationStatus()
					if (!this._disposed) uni.showToast({
						title: this.warning ? this.hrt(this.warning) : this.$t(scheduleFailed ? '吃药提醒通知安排失败' :
							'保存成功'),
						icon: 'none'
					})
				} catch (e) {
					if (!this._disposed) uni.showToast({
						title: this.hrt('failed'),
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
	.bp-sound-row {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		font-size: 13px;
		padding: 0 0 0 5px;
	}

	.bp-sound-label {
		flex-shrink: 0;
		width: 68px;
		margin-right: 12px;
	}

	.bp-sound-picker {
		flex: 1;
		min-width: 0;
		margin-right: 8px;
		background: #edf7ff;
		border-radius: 8px;
	}

	.bp-sound-value {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px;
	}

	.bp-sound-chevron {
		margin-left: 12px;
		color: #7aa0bd;
	}

	.bp-sound-action {
		flex-shrink: 0;
	}

	.bp-sound-action,
	.bp-sound-settings {
		background: transparent;
		font-size: 12px;
		color: #0083df;
		line-height: 30px;
		padding: 0;
		margin: 0;
	}

	.bp-sound-settings {
		text-align: left;
		margin: 5px 5px 8px;
	}

	.bp-sound-action::after,
	.bp-sound-settings::after {
		border: 0;
	}

	.ios-schedule {
		display: block;
		font-size: 11px;
		line-height: 1.6;
		color: #8396a8;
		margin: 14px 9px 0
	}

	.bp-reminder-settings {
		padding: 0;
		color: #111820
	}

	.bp-settings-content {
		padding: 0 19px 20px
	}

	.bp-hero-art {
		display: block;
		width: 100%;
		height: auto;
		margin: 0;
		padding: 0
	}

	.bp-intro {
		display: block;
		text-align: center;
		line-height: 1.5;
		font-size: 17px;
		margin: 20px 13px 19px
	}

	.bp-enable {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
		padding: 12px 15px;
		border-radius: 14px;
		box-shadow: 0 4px 8px #d7e8ec;
		font-size: 20px;
		font-weight: 700
	}

	.bp-enable switch {
		transform: scale(.9);
		transform-origin: right center
	}

	.bp-times-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 7px;
		margin: 27px 4px 12px
	}

	.times-title {
		font-weight: 700;
		font-size: 19px
	}

	.multiple {
		font-size: 12px
	}

	.add-reminder {
		font-size: 13px;
		font-weight: 700;
		color: #0064c8;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 5px
	}

	.plus-circle {
		background: linear-gradient(#299cf1, #0052b9);
		border-radius: 50%;
		width: 19px;
		height: 19px;
		line-height: 18px;
		text-align: center;
		color: white;
		font-size: 20px
	}

	.bp-times {
		border-radius: 15px;
		background: white;
		box-shadow: 0 4px 9px #dbe9ed;
		padding: 0 11px
	}

	.bp-time-group {
		border-bottom: 1px solid #d9e1e6
	}

	.bp-time-group:last-child {
		border: 0
	}

	.bp-time-row {
		display: flex;
		align-items: center;
		min-height: 52px;
		gap: 12px
	}

	.bp-checkbox-hit {
		padding: 13px 6px;
		flex-shrink: 0
	}

	.bp-checkbox {
		width: 23px;
		height: 23px;
		border: 1px solid #8b9298;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 21px;
		line-height: 1
	}

	.bp-checkbox.checked {
		background: linear-gradient(#2297f3, #0055b7);
		border-color: #0067c8;
		box-shadow: 0 1px 2px #96b7d6
	}

	.bp-time {
		font-size: 20px;
		font-weight: 700;
		white-space: nowrap
	}

	.bp-repeat {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 18px;
		min-height: 46px;
		font-size: 16px;
		text-align: right
	}

	.bp-chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 12px;
		height: 24px;
		flex-shrink: 0
	}

	.bp-chevron::after {
		content: '';
		width: 7px;
		height: 7px;
		border-top: 2px solid currentColor;
		border-right: 2px solid currentColor;
		transform: rotate(45deg)
	}

	.bp-repeat-editor {
		padding: 0 4px 14px
	}

	.bp-days {
		display: flex;
		flex-wrap: wrap;
		gap: 6px
	}

	.bp-days button {
		font-size: 12px;
		padding: 0 8px;
		line-height: 30px;
		margin: 0;
		background: #f0f4f8;
		color: #7a8798
	}

	.bp-days .selected {
		background: #dceeff;
		color: #0076d4
	}

	.bp-edit-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 12px;
		color: #087ac6;
		font-size: 13px
	}

	.bp-recommend {
		background: #e6f1fd;
		border-radius: 17px;
		padding: 13px 15px 15px;
		margin-top: 20px;
		box-shadow: 0 3px 9px #dcebf2;
		font-size: 15px;
		line-height: 1.65
	}

	.recommend-heading {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
		font-size: 18px;
		color: #083d7e;
		font-weight: 700
	}

	.recommend-heading .reminder-symbol {
		width: 29px;
		height: 29px
	}

	.bp-recommend>text {
		display: block;
		margin-left: 30px
	}

	.bp-save {
		margin-top: 28px;
		background: linear-gradient(110deg, #1689e7, #004fc0);
		border-radius: 28px;
		color: white;
		font-size: 22px;
		font-weight: 700;
		line-height: 49px
	}

	.bp-save::after,
	.bp-days button::after {
		border: 0
	}

	.bp-state {
		text-align: center;
		padding: 35px 12px;
		color: #8495a5
	}

	.bp-warning {
		font-size: 12px;
		padding: 12px;
		color: #94763a;
		line-height: 1.5;
		background: #fff8e7;
		border-radius: 12px;
		margin-top: 10px
	}

	.open-settings {
		display: block;
		color: #0784dd;
		margin-top: 5px
	}

	@media(max-width:360px) {
		.times-title {
			font-size: 17px
		}

		.multiple {
			font-size: 10px
		}

		.add-reminder {
			font-size: 11px
		}

		.bp-time {
			font-size: 18px
		}

		.bp-enable {
			font-size: 18px
		}
	}
</style>