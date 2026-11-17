import { measurementTime } from './medicationEffectTrend.js'
import { localReminderDate } from './healthReminders.js'
import { getDeviceTimeZone } from '@/pages/api/unitls/timezone.js'

export const MEDICATION_REPORT_RULES = 'V3-local-2026-11-16'
const round = n => Math.round(n*10)/10
const average = rows => rows.length ? {sbp:rows.reduce((sum,r)=>sum+r.sbp,0)/rows.length,dbp:rows.reduce((sum,r)=>sum+r.dbp,0)/rows.length,count:rows.length,unit:'mmHg'} : null
const displayMean = value => value ? {...value,sbp:round(value.sbp),dbp:round(value.dbp)} : null
const positive = n => n!==null&&n!==undefined&&n!==''&&Number.isFinite(Number(n))&&Number(n)>0
function localParts(at, value) {
	const timezone=value.timezone||value.timeZone
	if(timezone)try {
		const parts=new Intl.DateTimeFormat('en-GB',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(at))
		const part=key=>parts.find(p=>p.type===key).value
		return {date:[part('year'),part('month'),part('day')].join('-'),time:[part('hour'),part('minute'),part('second')].join(':'),timezone}
	} catch(error) { /* 保留原始读数；未知时区不能用于专业阶段比较。 */ }
	const local=String(value.local_time||value.localTime||'')
	if(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(local))return {date:local.slice(0,10),time:local.slice(11,19),timezone:'',originalTimezone:timezone||''}
	const date=new Date(at)
	return {date:localReminderDate(date),time:[date.getHours(),date.getMinutes(),date.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':'),timezone:'',originalTimezone:timezone||''}
}
export function normalizeAnalysisReadings(rows, now = Date.now()) {
	const readings=[],seen=new Map();let rejected=0
	for(const row of Array.isArray(rows)?rows:[]) {
		if(!row||typeof row!=='object')continue
		let object=row.object
		try { if(typeof object==='string')object=JSON.parse(object) } catch(error) { rejected++;continue }
		const details=object&&Array.isArray(object.details)?object.details:[row]
		for(const detail of details) {
			if(!detail)continue
			const value={...row,...detail},sbp=value.sbp===undefined?value.highPressure:value.sbp,dbp=value.dbp===undefined?value.lowPressure:value.dbp
			const at=measurementTime(row,{...detail,time:value.measured_at_utc||value.measuredAt||detail.time||detail.dateTime})
			if(!positive(sbp)||!positive(dbp)||!Number.isFinite(at)||at>now){rejected++;continue}
			const device=String(value.device_id||value.deviceId||value.deviceSn||''),nativeId=value.device_measurement_id||value.measurementId||value.reading_id
			const id=nativeId?[device,nativeId].join('|'):[device,at,sbp,dbp].join('|')
			const previous=seen.get(id)
			if(previous){if(previous.sbp!==Number(sbp)||previous.dbp!==Number(dbp)||previous.at!==at){previous.qualified=false;previous.reason='CONFLICTING_DUPLICATE'}continue}
			const quality=String(value.quality_flag||value.qualityFlag||'').toLowerCase(),mode=String(value.mode||value.measurementMode||'').toLowerCase()
			const source=String(value.source||value.device_type||value.deviceType||'unknown'),ocr=/ocr|photo|scan/i.test(source)
			const rawType=value.plan_type||value.task_type||value.taskType||value.period||''
			const period=['BASE_MORNING','morning'].includes(rawType)?'morning':['BASE_EVENING','evening'].includes(rawType)?'evening':''
			const active=['manual','active','cuff_manual'].includes(mode),validQuality=['good','valid','ok','pass'].includes(quality)
			const qualified=active&&validQuality&&(!ocr||value.confirmed===true)&&!value.device_error&&!value.motion_error&&value.posture!=='invalid'
			const session=String(value.session_id||value.sessionId||value.measurement_session_id||value.task_id||'')
			const reading={id,at,...localParts(at,value),sbp:Number(sbp),dbp:Number(dbp),device,source,mode,period,session,qualified,
				taskType:rawType||'UNCLASSIFIED',reason:!qualified?'QUALITY_EXCLUDED':!period||!session?'SESSION_METADATA_MISSING':!device?'DEVICE_UNKNOWN':'',
				actualDoseAt:value.confirmed_dose_actual_at||null,symptoms:value.symptoms||'',taskId:value.task_id||null}
			seen.set(id,reading);readings.push(reading)
		}
	}
	return {readings:readings.sort((a,b)=>a.at-b.at),rejected}
}
function statistics(readings,start,end) {
	const visible=readings.filter(r=>r.date>=start&&r.date<=end),groups=new Map()
	for(const r of visible) {
		if(!r.qualified||!r.period||!r.session||!r.device)continue
		const key=[r.date,r.period,r.device,r.session].join('|')
		if(!groups.has(key))groups.set(key,[])
		groups.get(key).push(r)
	}
	const sessions=[]
	for(const [id,values] of groups)if(values.length>=2)sessions.push({id,date:values[0].date,period:values[0].period,device:values[0].device,source:values[0].source,timezone:values[0].timezone,...average(values),readingIds:values.map(r=>r.id)})
	const dayGroups=new Map()
	for(const s of sessions){const key=s.date+'|'+s.period;if(!dayGroups.has(key))dayGroups.set(key,[]);dayGroups.get(key).push(s)}
	const daily=[...dayGroups].map(([key,values])=>({date:key.split('|')[0],period:key.split('|')[1],...average(values)}))
	const morning=daily.filter(d=>d.period==='morning'),evening=daily.filter(d=>d.period==='evening')
	const validDates=morning.filter(m=>evening.some(e=>e.date===m.date)).map(d=>d.date)
	return {visible,sessions,daily,morning:average(morning),evening:average(evening),morningDays:morning.length,eveningDays:evening.length,validDates,
		incompleteSessions:[...groups.values()].filter(values=>values.length<2).length,devices:[...new Set(sessions.map(s=>s.device+'|'+s.source))].sort()}
}
export function regimenMissing(plan, now = Date.now()) {
	const reasons=[]
	if(plan.medicationStatus!=='taking')return reasons
	if(!plan.confirmedAllDrugs)reasons.push('ALL_DRUGS_NOT_CONFIRMED')
	const items=(plan.reminders||[]).filter(item=>!item.clinical||!item.clinical.endAt||item.clinical.endAt>=localReminderDate(new Date(now)))
	if(!items.length)reasons.push('REGIMEN_INCOMPLETE')
	for(const item of items){
		const c=item.clinical||{}
		if(!c.drugName)reasons.push('DRUG_NAME_UNKNOWN')
		if(c.reviewStatus!=='verified')reasons.push('DRUG_UNVERIFIED')
		if(!c.confirmed||!c.classCode||!positive(c.doseValue)||!c.doseUnit||!c.startAt||c.startAt>localReminderDate(new Date(now))||!item.times||!item.times.length||
			!Array.isArray(c.ingredients)||!c.ingredients.length||c.ingredients.some(i=>!i.name||!positive(i.amount)||!i.unit)||c.classCode==='COMBINATION'&&c.ingredients.length<2)reasons.push('REGIMEN_INCOMPLETE')
	}
	return [...new Set(reasons)]
}
function doseSummary(plan,history,start,end,now) {
	const events=new Map(),expected=[],seen=new Set()
	for(const event of history||[])for(const id of event.kind==='medication'&&event.itemIds||[]){
		const key=[event.date,event.time,id].join('|'),previous=events.get(key)
		if(['completed','undone','snoozed','explicitly_missed'].includes(event.action)&&(!previous||previous.at<event.at))events.set(key,event)
	}
	const date=new Date(start+'T00:00:00'),versions=plan.versions||[]
	for(let offset=0;offset<31;offset++) {
		const day=new Date(date);day.setDate(day.getDate()+offset);const label=localReminderDate(day)
		if(label>end)break
		const dayEnd=new Date(day);dayEnd.setHours(23,59,59,999)
		// 一天可以经过多个方案版本；每个时点只归属当时生效的版本。
		const dayVersions=versions.filter(v=>v.medicationStatus==='taking'&&v.startedAt&&Date.parse(v.startedAt)<=dayEnd.getTime()&&(!v.endedAt||Date.parse(v.endedAt)>day.getTime()))
		for(const version of dayVersions)for(const item of version.items||[])for(const time of item.times||[]) {
			const at=new Date(day);at.setHours(...time.split(':').map(Number),0,0)
			if(at.getTime()>now||at<Date.parse(version.startedAt)||version.endedAt&&at>=Date.parse(version.endedAt)||!(item.weekdays||[]).includes(day.getDay()||7))continue
			const c=item.clinical||{}
			if(c.startAt&&label<c.startAt||c.endAt&&label>c.endAt)continue
			const key=[label,time,item.id].join('|'),event=events.get(key)
			if(seen.has(key))continue
			seen.add(key)
			const state=event&&event.action==='completed'?'confirmed':event&&event.action==='explicitly_missed'?'explicitly_missed':event&&event.action==='snoozed'?'snoozed':'unknown'
			const actual=event&&(typeof event.actualAt==='number'?event.actualAt:Date.parse(event.actualAt))
			expected.push({id:item.id,date:label,time,state,actualAt:state==='confirmed'&&Number.isFinite(actual)&&actual>0&&actual<=now?actual:null})
		}
	}
	return {planned:expected.length,confirmed:expected.filter(e=>e.state==='confirmed').length,actualTimeConfirmed:expected.filter(e=>e.actualAt!==null).length,unknown:expected.filter(e=>e.state==='unknown'||e.state==='snoozed').length,explicitlyMissed:expected.filter(e=>e.state==='explicitly_missed').length,events:expected}
}
export function buildMedicationReport({rows=[],days=7,now=Date.now(),plan={},history=[],rules={}}={}) {
	days=[1,3,7,30].includes(days)?days:7
	const end=localReminderDate(new Date(now)),first=new Date(now);first.setDate(first.getDate()-days+1)
	const start=localReminderDate(first),normalized=normalizeAnalysisReadings(rows,now),stats=statistics(normalized.readings,start,end)
	const reasonCodes=regimenMissing(plan,now),lastWeek=new Date(now);lastWeek.setDate(lastWeek.getDate()-6)
	const week=statistics(normalized.readings,localReminderDate(lastWeek),end)
	const enough=days===3?Math.max(stats.morningDays,stats.eveningDays)>=3:days>=7&&week.validDates.length>=5
	if(!stats.visible.length)reasonCodes.push('NO_BP')
	if(!enough)reasonCodes.push('INSUFFICIENT_VALID_DAYS')
	if(stats.incompleteSessions||stats.visible.some(r=>r.reason==='SESSION_METADATA_MISSING'))reasonCodes.push('SESSION_METADATA_MISSING')
	if(stats.visible.some(r=>!r.device))reasonCodes.push('DEVICE_NOT_COMPARABLE')
	if(normalized.rejected||stats.visible.some(r=>!r.qualified))reasonCodes.push('QUALITY_EXCLUDED')
	if(stats.visible.some(r=>!r.timezone))reasonCodes.push('TIMEZONE_UNKNOWN')
	const versions=plan.versions||[],current=versions[versions.length-1],taking=plan.medicationStatus==='taking'
	if(!['taking','not_taking'].includes(plan.medicationStatus))reasonCodes.push('MEDICATION_STATUS_UNKNOWN')
	let tier=taking?'L1':'L0'
	const currentStart=current&&current.startedAt&&Date.parse(current.startedAt)
	// 已登记的开始/结束日期也界定观察阶段，不把尚未开始服药的读数归到新方案。
	let effectiveStart=currentStart
	for(const item of plan.reminders||[]) {
		const c=item.clinical||{},started=c.startAt&&new Date(c.startAt+'T00:00:00').getTime()
		if(started&&started>effectiveStart&&started<=now)effectiveStart=started
		if(c.endAt){const ended=new Date(c.endAt+'T00:00:00');ended.setDate(ended.getDate()+1);if(ended>effectiveStart&&ended<=now)effectiveStart=ended.getTime()}
	}
	const regimenWeek=statistics(normalized.readings.filter(r=>effectiveStart&&r.at>=effectiveStart),localReminderDate(lastWeek),end)
	if(taking&&enough&&!regimenMissing(plan,now).length&&regimenWeek.validDates.length>=5)tier='L2'
	if(taking&&effectiveStart&&now-effectiveStart<7*86400000)reasonCodes.push('REGIMEN_CHANGED')
	const doses=taking?doseSummary(plan,history,start,end,now):null
	if(doses&&(!doses.planned||doses.unknown))reasonCodes.push('DOSE_STATUS_UNKNOWN')
	let comparison=null
	if(tier==='L2'&&versions.length>1&&currentStart&&effectiveStart===currentStart){
		const beforeEnd=new Date(currentStart);beforeEnd.setDate(beforeEnd.getDate()-1)
		const beforeStart=new Date(beforeEnd);beforeStart.setDate(beforeStart.getDate()-6)
		const afterEnd=new Date(currentStart);afterEnd.setDate(afterEnd.getDate()+6)
		const before=statistics(normalized.readings.filter(r=>r.at<currentStart),localReminderDate(beforeStart),localReminderDate(beforeEnd)),after=statistics(normalized.readings.filter(r=>r.at>=currentStart),localReminderDate(new Date(currentStart)),localReminderDate(afterEnd))
		const previous=versions[versions.length-2],coverage=rules.minDoseConfirmCoverage
		const beforeDoses=doseSummary(plan,history,localReminderDate(beforeStart),localReminderDate(beforeEnd),now),afterDoses=doseSummary(plan,history,localReminderDate(new Date(currentStart)),localReminderDate(afterEnd),now)
		beforeStart.setHours(0,0,0,0);afterEnd.setHours(23,59,59,999)
		if(before.validDates.length<5||after.validDates.length<5||now<afterEnd.getTime()||!previous.startedAt||Date.parse(previous.startedAt)>beforeStart.getTime()||Date.parse(previous.endedAt)!==currentStart||previous.medicationStatus!=='taking'||!previous.confirmedAllDrugs||regimenMissing({medicationStatus:previous.medicationStatus,confirmedAllDrugs:previous.confirmedAllDrugs,reminders:previous.items},beforeEnd.getTime()).length)reasonCodes.push('NO_BASELINE')
		else if(!before.devices.length||JSON.stringify(before.devices)!==JSON.stringify(after.devices)||[...before.sessions,...after.sessions].some(s=>!s.timezone)||new Set([...before.sessions,...after.sessions].map(s=>s.timezone)).size!==1||previous.timezone!==current.timezone||!current.timezone||current.timezone!==getDeviceTimeZone())reasonCodes.push('DEVICE_NOT_COMPARABLE')
		else if(!rules.approved||!Number.isFinite(coverage)||coverage<=0||coverage>1||[beforeDoses,afterDoses].some(d=>!d.planned||d.actualTimeConfirmed/d.planned<coverage))reasonCodes.push('DOSE_STATUS_UNKNOWN')
		else comparison={before:{start:localReminderDate(beforeStart),end:localReminderDate(beforeEnd),validDays:before.validDates.length},after:{start:localReminderDate(new Date(currentStart)),end:localReminderDate(afterEnd),validDays:after.validDates.length},
			morning:{sbp:round(after.morning.sbp-before.morning.sbp),dbp:round(after.morning.dbp-before.morning.dbp)},evening:{sbp:round(after.evening.sbp-before.evening.sbp),dbp:round(after.evening.dbp-before.evening.dbp)}}
	}else if(taking)reasonCodes.push('NO_BASELINE')
	const target=plan.target&&plan.target.source==='doctor'&&plan.target.confirmed===true&&positive(plan.target.sbp)&&positive(plan.target.dbp)?plan.target:null
	if(!target)reasonCodes.push('TARGET_NOT_PROVIDED')
	return {report_type:tier==='L0'?'BP_TREND':tier==='L1'?'ON_MEDICATION':'REGIMEN_OBSERVATION',tier,generated_at:new Date(now).toISOString(),window:{start,end,days},
		quality:{validDays:stats.validDates.length,missingDays:days-stats.validDates.length,morningDays:stats.morningDays,eveningDays:stats.eveningDays,enough,excluded:normalized.rejected+stats.visible.filter(r=>!r.qualified).length,devices:stats.devices},
		metrics:{morning:displayMean(stats.morning),evening:displayMean(stats.evening),target:enough?target:null},regimen:taking?{versions,items:plan.reminders||[],doses}:null,
		comparison,reason_codes:[...new Set(reasonCodes)],readings:stats.visible,sessions:stats.sessions,
		additional_measurements:stats.visible.filter(r=>!r.period),rules_version:rules.version||MEDICATION_REPORT_RULES,template_id:'V3-fixed-local',
		limitations:['报告非诊断','报告不可自行调药',...(taking?['报告不作单药归因']:[])]}
}
