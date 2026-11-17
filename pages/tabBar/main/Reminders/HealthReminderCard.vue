<template>
	<view class="today-card">
		<view class="today-heading" @click="openHealthReminders">
			<ReminderIcon kind="calendar" :size="29" /><text class="today-title">{{ hrt('today') }}</text>
			<text class="today-more">{{ hrt('all') }} ›</text>
		</view>
		<view v-if="healthLoadError" class="today-empty" @click="loadHealthDashboard">{{ hrt('loadFailed') }}</view>
		<view v-else-if="!healthHomeSlots.length" class="today-empty" @click="openHealthReminders">
			{{ hrt(healthLoading ? 'loading' : 'unset') }}
		</view>
		<view v-else class="today-items">
			<view v-for="slot in healthHomeSlots" :key="slot.kind" class="today-item" @click="openHealthReminders">
				<ReminderIcon :kind="slot.kind" />
				<view class="today-copy"><text class="today-time">{{ healthTime(slot.time) }}</text><text
						class="today-label">{{ healthLabel(slot) }}</text></view>
				<view class="check-hit" role="checkbox" :aria-checked="healthIsChecked(slot)"
					:aria-label="hrt(healthIsChecked(slot) ? 'done' : 'unchecked')"
					@click.stop="toggleHealthCheck(slot)">
					<view class="reminder-check"
						:class="{ checked: healthIsChecked(slot), busy: healthIsChecking(slot) }"><text
							v-if="healthIsChecked(slot)">✓</text></view>
				</view>
			</view>
		</view>
		<HealthProfileDialog ref="healthProfile" />
	</view>
</template>
<script>
	import healthReminderDashboard from '@/pages/tabBar/main/Reminders/api/healthReminderDashboard.js'
	import ReminderIcon from './components/ReminderIcon.vue'
	import HealthProfileDialog from './components/HealthProfileDialog.vue'
	export default {
		components: {
			HealthProfileDialog,
			ReminderIcon
		},
		mixins: [healthReminderDashboard],
		props: {
			active: {
				type: Boolean,
				default: true
			}
		},
		mounted() {
			if (this.active) this.startHealthDashboard()
		},
		watch: {
			active(value) {
				if (value) this.startHealthDashboard();
				else this.stopHealthDashboard()
			}
		},
		beforeDestroy() {
			this.stopHealthDashboard()
		}
	}
</script>
<style scoped>
	.today-card {
		margin: 0 0 14px;
		padding: 6px 9px 10px;
		border: 1.5px solid #159bff;
		border-radius: 21px;
		background: linear-gradient(115deg, #effaff, #dcefff);
		box-shadow: 0 3px 7px #c8dfef;
		color: #10213c
	}

	.today-heading {
		display: flex;
		align-items: center;
		min-height: 42px
	}

	.today-heading .reminder-symbol {
		width: 36px;
		height: 36px
	}

	.today-title {
		font-weight: 700;
		font-size: 18px;
		flex: 1
	}

	.today-more {
		color: #0081f5;
		font-size: 13px;
		padding: 8px 2px 8px 6px;
		white-space: nowrap
	}

	.today-items {
		display: flex;
		gap: 7px
	}

	.today-item {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, .92);
		border-radius: 13px;
		box-shadow: 0 2px 5px #cddfeb;
		padding: 7px 3px 7px 6px
	}

	.today-item .reminder-symbol {
		width: 34px;
		height: 34px;
		transform: scale(.82);
		margin: -3px
	}

	.today-copy {
		flex: 1;
		min-width: 0;
		padding-left: 5px
	}

	.today-time,
	.today-label {
		display: block;
		font-size: 12px;
		line-height: 1.4
	}

	.today-time {
		font-weight: 700
	}

	.today-label {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis
	}

	.check-hit {
		min-width: 30px;
		min-height: 42px;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.reminder-check {
		width: 19px;
		height: 19px;
		border: 2px solid #aab4c0;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		color: white;
		font-size: 13px
	}

	.reminder-check.checked {
		background: #43c719;
		border-color: #43c719
	}

	.reminder-check.busy {
		opacity: .45
	}

	.today-empty {
		padding: 16px 10px;
		text-align: center;
		color: #7b8b9c;
		background: #ffffffa8;
		border-radius: 13px;
		font-size: 14px
	}

	@media screen and (max-width:360px) {
		.today-title {
			font-size: 16px
		}

		.today-more {
			font-size: 11px
		}

		.today-item {
			display: grid;
			grid-template-columns: 25px minmax(0, 1fr) 24px;
			column-gap: 3px;
			row-gap: 2px;
			padding: 7px 5px
		}

		.today-item .reminder-symbol {
			grid-row: 1;
			grid-column: 1;
			width: 27px;
			height: 27px;
			transform: scale(.7);
			margin: 0
		}

		.today-copy {
			display: contents
		}

		.today-time {
			grid-row: 1;
			grid-column: 2/4;
			white-space: nowrap;
			font-size: 11px
		}

		.today-label {
			grid-row: 2;
			grid-column: 1/3;
			font-size: 11px
		}

		.check-hit {
			grid-row: 2;
			grid-column: 3;
			min-width: 24px;
			min-height: 25px
		}
	}
</style>
