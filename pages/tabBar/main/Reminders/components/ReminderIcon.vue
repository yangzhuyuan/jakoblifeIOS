<template>
	<view class="reminder-symbol" :class="kind">
		<image class="reminder-vector" :src="icon" mode="aspectFit" />
	</view>
</template>
<script>
	const icons = {
		'analysis': require('../assets/analysis.jpg'),
		'bp-hero': require('../assets/bp-hero.jpg'),
		'bp-plan': require('../assets/bp-plan.jpg'),
		'bp': require('../assets/bp.jpg'),
		'bulb': require('../assets/bulb.jpg'),
		'calendar': require('../assets/calendar.jpg'),
		'clock': require('../assets/clock.jpg'),
		'dose': require('../assets/dose.jpg'),
		'health': require('../assets/health.jpg'),
		'medication': require('../assets/medication.jpg'),
		'pill': require('../assets/pill.jpg'),
		'repeat': require('../assets/repeat.jpg')
	}
	export default {
		computed: { icon() { const image = icons[this.kind] || icons.calendar; return image.default || image } },
		props: {
			kind: {
				type: String,
				default: 'calendar'
			},
			size: {
				type: Number,
				default: 34
			}
		}
	}
</script>
<style scoped>
	.reminder-symbol {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.reminder-vector {
		display: block;
		width: 100%;
		height: 100%
	}
</style>
