<template>
	<view class="v3-report">
		<view class="v3-heading"><text>{{ $t('报告V3标题') }}</text><picker :range="ranges.map(day=>$t('报告范围'+day))" :value="ranges.indexOf(days)" @change="$emit('days-change',ranges[Number($event.detail.value)])"><view class="v3-range">{{ $t('报告范围'+days) }} ▾</view></picker></view>
		<view v-if="!enabled||loading||failed" class="v3-empty" @click="failed && loadReport()">{{ $t(!enabled?'健康提醒分析已关闭':loading?'健康提醒加载中':'健康提醒加载失败') }}</view>
		<template v-else-if="report">
			<view class="v3-tier"><text>{{ $t('报告等级'+report.tier) }}</text><text>{{ report.window.start }} — {{ report.window.end }}</text></view>
			<text class="v3-description">{{ $t('报告摘要'+report.tier) }}</text>
			<view class="v3-quality"><view>{{ $t('报告有效天数') }}<text>{{ report.quality.validDays }} / {{ report.window.days }}</text></view><view>{{ $t('报告晨间天数') }}<text>{{ report.quality.morningDays }}</text></view><view>{{ $t('报告晚间天数') }}<text>{{ report.quality.eveningDays }}</text></view></view>
			<view class="v3-means"><view>{{ $t('报告晨间均值') }}<text>{{ formatMean(report.metrics.morning) }}</text></view><view>{{ $t('报告晚间均值') }}<text>{{ formatMean(report.metrics.evening) }}</text></view></view>
			<text class="v3-note">{{ $t('报告均值口径') }}</text>
			<view v-if="report.readings.length" class="v3-chart"><qiun-data-charts type="line" canvas-id="medicationReportV3" :canvas2d="false" :inScrollView="true" :animation="false" :opts="chartOptions" :chartData="chartData" /></view>
			<view v-else class="v3-empty">{{ $t('报告原因NO_BP') }}</view>
			<view v-if="sources.length" class="v3-section"><text class="v3-section-title">{{ $t('报告设备来源') }}</text><text v-for="source in sources" :key="source.id" class="v3-note">{{ source.label }} · {{ source.count }} {{ $t('报告条') }}</text></view>
			<view v-if="noAnalysisData" class="v3-section"><text class="v3-reason">{{ $t('报告原因NO_BP') }}</text></view>
			<view v-else class="v3-section"><text class="v3-section-title">{{ $t('报告缺项及说明') }}</text><text v-for="reason in report.reason_codes" :key="reason" class="v3-reason">• {{ $t('报告原因'+reason) }}</text></view>
			<view v-if="report.regimen" class="v3-section"><text class="v3-section-title">{{ $t('报告服药记录') }}</text><view class="v3-counts"><text>{{ $t('报告计划次数') }} {{ report.regimen.doses.planned }}</text><text>{{ $t('报告确认次数') }} {{ report.regimen.doses.confirmed }}</text><text>{{ $t('报告未知次数') }} {{ report.regimen.doses.unknown }}</text><text>{{ $t('报告明确未服') }} {{ report.regimen.doses.explicitlyMissed }}</text></view><text class="v3-note">{{ $t('报告未知说明') }}</text>
				<text class="v3-section-title">{{ $t('报告登记药单') }}</text><view v-for="item in report.regimen.items" :key="item.id" class="v3-drug"><text>{{ item.clinical && item.clinical.drugName || $t('药单暂不提供药名') }}</text><text class="v3-note">{{ item.clinical && item.clinical.formulation || $t('药单未填写') }} · {{ item.dose || $t('药单未填写') }} · {{ (item.times||[]).join(' / ') }}</text><text v-for="(ingredient,index) in item.clinical && item.clinical.ingredients || []" :key="index" class="v3-note">{{ ingredient.name }} {{ ingredient.amount }} {{ ingredient.unit }}</text></view>
				<text class="v3-section-title">{{ $t('报告方案时间线') }}</text><view v-for="version in report.regimen.versions" :key="version.id" class="v3-version"><text>{{ version.startedAt ? version.startedAt.slice(0,10) : $t('药单未填写') }} — {{ version.endedAt ? version.endedAt.slice(0,10) : $t('药单持续用药') }}</text><text class="v3-note">{{ versionLabel(version) }}</text></view>
			</view>
			<view v-if="report.comparison" class="v3-section"><text class="v3-section-title">{{ $t('报告阶段比较') }}</text><text class="v3-note">{{ report.comparison.before.start }} — {{ report.comparison.before.end }} ({{ report.comparison.before.validDays }}) → {{ report.comparison.after.start }} — {{ report.comparison.after.end }} ({{ report.comparison.after.validDays }})</text><text>{{ $t('报告晨间差值') }} {{ formatMean(report.comparison.morning) }}; {{ $t('报告晚间差值') }} {{ formatMean(report.comparison.evening) }}</text></view>
			<view v-if="report.metrics.target" class="v3-section">{{ $t('报告医生目标') }} {{ report.metrics.target.sbp }}/{{ report.metrics.target.dbp }} mmHg</view>
			<view class="v3-section"><text class="v3-section-title">{{ $t('报告原始读数') }} ({{ report.readings.length }})</text><text class="v3-note">{{ $t('报告原始说明') }}</text><view v-for="reading in report.readings.slice(0,visibleCount)" :key="reading.id" class="v3-reading"><text>{{ reading.date }} {{ reading.time }}</text><text>{{ reading.sbp }}/{{ reading.dbp }} mmHg</text><text class="v3-note">{{ reading.period ? $t(reading.period==='morning'?'报告晨间':'报告晚间') : $t('报告补充读数') }} · {{ reading.qualified ? $t('报告质量通过') : $t('报告质量未确认') }}</text></view><button v-if="visibleCount<report.readings.length" class="v3-more" @click="visibleCount+=20">{{ $t('报告查看更多') }}</button></view>
			<text v-for="reason in report.limitations" :key="reason" class="v3-note">{{ $t(reason) }}</text><text class="v3-note">{{ $t('报告规则版本') }} {{ report.rules_version }}</text>
			<button class="v3-export" @click="exportReport">{{ $t('报告复制数据') }}</button>
		</template>
	</view>
</template>
<script>
import { buildMedicationReport } from '../api/medicationAnalysisV3.js'
import { createMedicationReminderStore } from '../api/medicationReminder.js'
import { createHealthReminderStore, localReminderDate } from '../api/healthReminders.js'
export default {
	props:{enabled:Boolean,days:{type:Number,default:1},refreshKey:{type:Number,default:0}},
	data(){return {ranges:[1,3,7,30],loading:false,failed:false,report:null,visibleCount:20}},
	computed:{
		chartData(){const rows=this.report?this.report.readings:[];return {categories:rows.map(r=>(this.days===1?'':r.date.slice(5)+' ')+r.time.slice(0,5)),series:[{name:this.$t('健康提醒收缩压')+' (mmHg)',data:rows.map(r=>r.sbp)},{name:this.$t('健康提醒舒张压')+' (mmHg)',data:rows.map(r=>r.dbp)}]}},
		chartOptions(){return {color:['#008cff','#24b436'],padding:[15,8,0,0],dataLabel:false,legend:{fontSize:10},xAxis:{disableGrid:true,labelCount:4},yAxis:{data:[{title:'mmHg'}]},extra:{line:{type:'straight',width:2}}}},
		sources(){const values=new Map();for(const r of this.report?this.report.readings:[]){const id=r.device+'|'+r.source;if(!values.has(id))values.set(id,{id,label:(r.device||this.$t('报告设备未知'))+' / '+(r.source==='unknown'?this.$t('报告来源未知'):r.source),count:0});values.get(id).count++}return [...values.values()]},
		noAnalysisData(){const quality=this.report&&this.report.quality;return !quality||(!quality.validDays&&!quality.morningDays&&!quality.eveningDays)}
	},
	mounted(){this.loadReport()},
	beforeDestroy(){this._disposed=true},
	watch:{enabled(){this.loadReport()},days(){this.loadReport()},refreshKey(){this.loadReport()}},
	methods:{
		formatMean(value){return value?value.sbp+'/'+value.dbp+' mmHg':'—'},
		versionLabel(version){return (version.items||[]).map(item=>item.clinical&&item.clinical.drugName||this.$t('药单暂不提供药名')).join(' / ')},
		async loadReport(){
			const generation=this._generation=(this._generation||0)+1
			this.report=null;this.failed=false;this.loading=false;this.visibleCount=20
			if(!this.enabled)return
			const base=this.$url_APP_IP,token=uni.getStorageSync('token'),user=uni.getStorageSync('userid')
			if(!token||!user)return
			const current=()=>!this._disposed&&generation===this._generation&&base===this.$url_APP_IP&&token===uni.getStorageSync('token')&&user===uni.getStorageSync('userid')
			const options={baseUrl:base,get:(...args)=>this.$get(...args),post:(...args)=>this.$post(...args),storage:uni}
			this.loading=true
			try {
				const [plan,history]=await Promise.all([createMedicationReminderStore(options).loadPlan(),createHealthReminderStore(options).loadMedicationReportHistory()])
				if(!current())return
				const now=Date.now(),start=new Date(now);start.setDate(start.getDate()-Math.max(14,this.days)+1)
				const latest=(plan.versions||[]).slice(-1)[0]
				if(latest&&latest.startedAt){const baseline=new Date(latest.startedAt);baseline.setDate(baseline.getDate()-7);if(baseline<start&&now-baseline.getTime()<=90*86400000)start.setTime(baseline.getTime())}
				const result=await this.$post(base+this.$url_query_log_v2,{deviceSn:[user],dataType:'pressure',slaveList:[{slaveSn:'0',register:'highPressure'},{slaveSn:'0',register:'lowPressure'}],startTime:localReminderDate(start)+' 00:00:00',endTime:localReminderDate(new Date(now))+' 23:59:59'},{Authorization:'Bearer '+token,'content-type':'application/json;charset=UTF-8'})
				if(!current())return
				if(!result||result.code!==200)throw new Error('BP read failed')
				const rows=Array.isArray(result.data)?result.data:Array.isArray(result.rows)?result.rows:[]
				this.report=buildMedicationReport({rows,days:this.days,now,plan,history})
				this._exportData={report:this.report,input:{rows,plan,history}}
			} catch(error){if(current())this.failed=true}
			finally {if(current())this.loading=false}
		},
		exportReport(){if(this.report)uni.setClipboardData({data:JSON.stringify(this._exportData,null,2),success:()=>uni.showToast({title:this.$t('报告已复制'),icon:'none'})})}
	}
}
</script>
<style scoped>
.v3-report{background:#fff;border-radius:16px;padding:16px;margin-top:18px;color:#19324e}.v3-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:bold;font-size:17px}.v3-range{font-size:13px;font-weight:normal;color:#1783ce;padding:8px;background:#edf7ff;border-radius:8px}.v3-tier{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;color:#167cbe;margin:20px 0 10px;font-size:13px}.v3-description{display:block;line-height:1.7;font-size:14px;white-space:pre-line}.v3-quality,.v3-means{display:flex;gap:8px;margin-top:15px}.v3-quality>view,.v3-means>view{flex:1;background:#f1f7fc;border-radius:9px;padding:10px;text-align:center;font-size:12px}.v3-quality text,.v3-means text{display:block;font-size:17px;font-weight:bold;margin-top:7px}.v3-note{display:block;color:#687b90;font-size:12px;line-height:1.6;margin:6px 0;word-break:break-all}.v3-chart{height:230px;margin-top:15px}.v3-section{border-top:1px solid #e5edf5;padding-top:15px;margin-top:18px}.v3-section-title{display:block;font-weight:bold;font-size:15px;margin-bottom:8px}.v3-reason{display:block;font-size:13px;line-height:1.7;color:#78602e;margin:6px 0}.v3-counts{display:flex;flex-wrap:wrap;gap:12px;font-size:13px}.v3-drug,.v3-version{padding:8px 0;font-size:14px}.v3-reading{display:flex;flex-wrap:wrap;justify-content:space-between;gap:5px;font-size:12px;padding:10px 0;border-bottom:1px solid #edf2f7}.v3-reading .v3-note{width:100%;margin:0}.v3-empty{text-align:center;color:#647e96;padding:30px 10px;font-size:14px;white-space:pre-line}.v3-export,.v3-more{background:#eef8ff;font-size:13px;color:#167cbe;margin-top:14px}
</style>
