<template>
	<!-- 历史 label 保存的是当时的语言；固定提醒名称在展示时按类型翻译。 -->
	<view class="reminder-history">
		<view v-if="loading || failed || !records.length" class="history-empty" @click="failed && load()">
			{{ hrt(failed?'loadFailed':loading?'loading':'emptyHistory') }}
		</view>
		<view v-for="item in records" :key="item.id" class="history-row">
			<ReminderIcon :kind="item.kind==='bp'?'bp':'pill'" />
			<view class="history-copy"><text
					class="history-action">{{ actionLabel(item) }}</text><text>{{ hrt(item.kind==='bp'?'measure':'take') }}</text><text
					class="history-date">{{ timestamp(item.at) }}</text><text v-if="item.snoozeAt"
					class="history-date">{{ healthTime(item.snoozeAt) }}</text></view>
		</view>
	</view>
</template>

<script>
	import ReminderIcon from './ReminderIcon.vue'
	import {
		createHealthReminderStore,
		HEALTH_REMINDERS_CHANGED,
		localReminderDate
	} from '@/pages/tabBar/main/Reminders/api/healthReminders.js'
	import {
		healthReminderText,
		reminderDisplayTime
	} from '@/pages/tabBar/main/Reminders/api/healthReminderText.js'
	export default {
		components: {
			ReminderIcon
		},
		data() {
			return {
				records: [],
				loading: true,
				failed: false
			}
		},
		mounted() {
			this._changed = () => this.load();
			uni.$on(HEALTH_REMINDERS_CHANGED, this._changed);
			this.load()
		},
		beforeDestroy() {
			this._disposed = true;
			uni.$off(HEALTH_REMINDERS_CHANGED, this._changed)
		},
		methods: {
			hrt(key) {
				return healthReminderText(this, key)
			},
			actionLabel(item) {
				return this.hrt(item.action === 'completed' ? (item.kind === 'bp' ? 'measured' : 'taken') : item.action)
			},
			healthTime(at) {
				const date = new Date(at);
				return reminderDisplayTime(this, String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes())
					.padStart(2, '0'))
			},
			timestamp(at) {
				return localReminderDate(new Date(at)) + ' ' + this.healthTime(at)
			},
			async load() {
				const generation = this._generation = (this._generation || 0) + 1,
					base = this.$url_APP_IP;
				const store = createHealthReminderStore({
					baseUrl: base,
					get: (...a) => this.$get(...a),
					post: (...a) => this.$post(...a),
					storage: uni
				});
				this.loading = true
				try {
					const records = await store.loadHistory();
					if (!this._disposed && generation === this._generation && base === this.$url_APP_IP && store
						.isCurrent()) {
						this.records = records;
						this.failed = false
					}
				} catch (e) {
					if (!this._disposed) this.failed = true
				} finally {
					if (!this._disposed && generation === this._generation) this.loading = false
				}
			}
		}
	}
</script>
<style scoped>
	.reminder-history {
		background: #fffffff0;
		border-radius: 18px;
		padding: 0 14px
	}

	.history-empty {
		padding: 36px 12px;
		text-align: center;
		color: #8a9aaa
	}

	.history-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 0;
		border-bottom: 1px solid #e5edf4
	}

	.history-row:last-child {
		border: 0
	}

	.history-row .reminder-symbol {
		width: 31px;
		height: 31px
	}

	.history-copy {
		flex: 1;
		min-width: 0;
		font-size: 13px;
		color: #47566a;
		line-height: 1.5
	}

	.history-copy>text {
		display: block
	}

	.history-action {
		font-size: 16px;
		color: #12334d;
		font-weight: 700
	}

	.history-date {
		color: #8495a6;
		font-size: 11px
	}
</style>