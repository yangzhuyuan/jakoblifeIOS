import {
	createHealthReminderStore,
	reminderOccurrences,
	currentReminderOccurrence,
	HEALTH_REMINDERS_CHANGED
} from './healthReminders.js'
import {
	healthReminderText,
	reminderDisplayTime
} from './healthReminderText.js'
import {
	setMedicationReminderKeepAlive
} from './reminderKeepAliveState.js'
import {
	performHealthReminderAction,
	beginMedicationCheck,
	finishMedicationCheck
} from './healthReminderRuntime.js'
import { HEALTH_REMINDER_CHECKS_UPDATED, reminderCheckKey, readReminderCheckOverlay,
	beginReminderCheck, settleReminderCheck, reconcileReminderCheckOverlay } from './healthReminderPending.js'

export default {
	data() {
		return {
			healthDashboard: {
				medication: [],
				bp: [],
				checks: {
					medication: {},
					bp: {}
				}
			},
			healthNow: Date.now(),
			healthLoading: false,
			healthLoadError: false,
			healthChecking: '',
			healthCheckOverlay: {}
		}
	},
	computed: {
		healthSlots() {
			return ['bp', 'medication'].flatMap(kind => reminderOccurrences(this.healthDashboard[kind], kind, this
				.healthNow)).map(slot => slot.kind === 'medication' ? { ...slot, label: this.hrt('take') } : slot)
		},
		healthHomeSlots() {
			return ['bp', 'medication'].map(kind => currentReminderOccurrence(this.healthSlots.filter(slot => slot
				.kind === kind), this.healthNow, slot => this.healthIsChecked(slot))).filter(Boolean)
		},
		healthUpcoming() {
			const slots = this.healthSlots.slice().sort((a, b) => a.at - b.at)
			return slots.length ? slots.filter(slot => slot.date === slots[0].date) : []
		}
	},
	methods: {
		hrt(key) {
			return healthReminderText(this, key)
		},
		healthTime(time) {
			return reminderDisplayTime(this, time)
		},
		healthLabel(slot) {
			if (this.healthIsChecked(slot)) return this.hrt(slot.kind === 'bp' ? 'measured' : 'taken')
			if (this.healthNow >= slot.at) return this.hrt(slot.kind === 'bp' ? 'notMeasured' : 'notTaken')
			return this.hrt(slot.kind === 'bp' ? 'measure' : 'take')
		},
		healthIsChecked(slot) {
			const optimistic = this.healthCheckOverlay[reminderCheckKey(slot)]
			if (optimistic) return optimistic.completed
			const records = this.healthDashboard.checks[slot.kind],
				record = records[slot.id]
			return slot.items.every(item => {
					const single = records[slot.date + '|' + slot.time + '|' + item.id];
					const value = single && (!record || single.updatedAt >= record.updatedAt) ? single : record;
					return value && value.completed
				})
		},
		healthIsChecking(slot) {
			const optimistic = this.healthCheckOverlay[reminderCheckKey(slot)]
			return !!(optimistic && optimistic.pending) || this.healthChecking === slot.id
		},
		openHealthActions(slot) {
			if (this.healthIsChecking(slot)) return
			const checked = this.healthIsChecked(slot),
				items = [this.hrt(checked ? 'undone' : slot.kind === 'bp' ? 'measured' : 'taken')]
			if (!checked) items.push(this.hrt('snoozed'))
			uni.showActionSheet({
				itemList: items,
				success: result => result.tapIndex === 0 ? this.toggleHealthCheck(slot) : this
					.snoozeHealthReminder(slot)
			})
		},
		async snoozeHealthReminder(slot) {
			if (this.healthChecking) return;
			this.healthChecking = slot.id;
			try {
				await performHealthReminderAction(this, slot, 'snoozed');
				uni.showToast({
					title: this.hrt('snoozed'),
					icon: 'none'
				})
			} catch (e) {
				uni.showToast({
					title: this.hrt('actionFailed'),
					icon: 'none'
				})
			} finally {
				this.healthChecking = ''
			}
		},
		createHealthStore() {
			return createHealthReminderStore({
				baseUrl: this.$url_APP_IP,
				get: (...args) => this.$get(...args),
				post: (...args) => this.$post(...args),
				storage: uni
			})
		},
		startHealthDashboard() {
			this._healthDisposed = false
			this.healthCheckOverlay = readReminderCheckOverlay(this)
			if (!this._healthChanged) {
				this._healthChanged = () => this.loadHealthDashboard()
				this._healthChecksUpdated = () => { this.healthCheckOverlay = readReminderCheckOverlay(this); this.healthNow = Date.now() }
				this._healthAwake = awake => {
					if (awake) {
						this.tickHealthClock();
						this.loadHealthDashboard()
					} else clearTimeout(this._healthClock)
				}
				uni.$on(HEALTH_REMINDERS_CHANGED, this._healthChanged)
				uni.$on(HEALTH_REMINDER_CHECKS_UPDATED, this._healthChecksUpdated)
				uni.$on('APP_SCREEN_AWAKE', this._healthAwake)
			}
			this.tickHealthClock()
			return this.loadHealthDashboard()
		},
		stopHealthDashboard() {
			this._healthDisposed = true
			clearTimeout(this._healthClock)
			if (this._healthChanged) uni.$off(HEALTH_REMINDERS_CHANGED, this._healthChanged)
			if (this._healthChecksUpdated) uni.$off(HEALTH_REMINDER_CHECKS_UPDATED, this._healthChecksUpdated)
			if (this._healthAwake) uni.$off('APP_SCREEN_AWAKE', this._healthAwake)
			this._healthChanged = this._healthAwake = this._healthChecksUpdated = null
		},
		tickHealthClock() {
			clearTimeout(this._healthClock)
			this.healthNow = Date.now()
			if (!this._healthDisposed) this._healthClock = setTimeout(() => this.tickHealthClock(), 60000 - this
				.healthNow % 60000 + 20)
		},
		async loadHealthDashboard() {
			if (this._healthDisposed) return
			const store = this.createHealthStore(),
				baseUrl = this.$url_APP_IP
			const account = [uni.getStorageSync('token'), uni.getStorageSync('userid'), baseUrl].join('|')
			if (this._healthAccount !== account) {
				this._healthAccount = account
				this.healthCheckOverlay = readReminderCheckOverlay(this)
				this.healthDashboard = {
					medication: [],
					bp: [],
					checks: {
						medication: {},
						bp: {}
					}
				}
				this.healthLoadError = false
			}
			if (!store.isCurrent()) {
				this.healthDashboard = {
					medication: [],
					bp: [],
					checks: {
						medication: {},
						bp: {}
					}
				};
				return
			}
			const generation = this._healthLoadGeneration = (this._healthLoadGeneration || 0) + 1
			this.healthLoading = true
			try {
				const data = await store.dashboard()
				if (this._healthDisposed || !store.isCurrent() || baseUrl !== this.$url_APP_IP || generation !==
					this._healthLoadGeneration) return
				this.healthDashboard = data
				this.healthCheckOverlay = reconcileReminderCheckOverlay(this, data)
				this.healthLoadError = false
				setMedicationReminderKeepAlive(data.medication, {
					token: uni.getStorageSync('token'),
					userId: uni.getStorageSync('userid'),
					baseUrl
				})
				this.tickHealthClock()
			} catch (e) {
				if (!this._healthDisposed && store.isCurrent() && generation === this._healthLoadGeneration) this
					.healthLoadError = true
			} finally {
				if (generation === this._healthLoadGeneration) this.healthLoading = false
			}
		},
		async toggleHealthCheck(slot) {
			if (this.healthIsChecking(slot) || this.healthLoadError || this._healthConfirming) return
			const store = this.createHealthStore(),
				baseUrl = this.$url_APP_IP
			if (!store.isCurrent()) return
			const completed = !this.healthIsChecked(slot)
			if (completed && Date.now() < slot.at) {
				this._healthConfirming = true
				let confirmed = false
				try {
					confirmed = await new Promise(resolve => uni.showModal({
						title: this.hrt('notice'),
						content: this.hrt(slot.kind === 'bp' ? 'earlyBPConfirm' : 'earlyMedicationConfirm'),
						success: result => resolve(result.confirm === true),
						fail: () => resolve(false)
					}))
				} finally { this._healthConfirming = false }
				if (!confirmed || this._healthDisposed || !store.isCurrent() || baseUrl !== this.$url_APP_IP ||
					this.healthIsChecked(slot) || this.healthIsChecking(slot)) return
			}
			const operation = beginReminderCheck(this, slot, completed)
			if (!operation) return
			if (completed && slot.kind === 'medication') beginMedicationCheck(this, slot)
			this.healthCheckOverlay = readReminderCheckOverlay(this)
			this.healthNow = Date.now()
			try {
				await performHealthReminderAction(this, slot, completed ? 'completed' : 'undone')
				settleReminderCheck(operation, true)
				if (completed && slot.kind === 'medication') await finishMedicationCheck(this, slot, true)
			} catch (e) {
				settleReminderCheck(operation, false)
				if (completed && slot.kind === 'medication') await finishMedicationCheck(this, slot, false)
				if (!this._healthDisposed && store.isCurrent() && baseUrl === this.$url_APP_IP) uni.showToast({
					title: this.hrt('checkFailed'),
					icon: 'none'
				})
			} finally {
				if (!this._healthDisposed && store.isCurrent()) this.healthCheckOverlay = readReminderCheckOverlay(this)
			}
		},
		async openHealthReminders() {
			if (this._openingHealthReminders || !this.$refs || !this.$refs.healthProfile) return
			this._openingHealthReminders = true
			try {
				if (await this.$refs.healthProfile.open({ required: true })) uni.navigateTo({
					url: '/pages/tabBar/main/Reminders/MedicationReminder?view=overview'
				})
			} finally {
				this._openingHealthReminders = false
			}
		}
	}
}
