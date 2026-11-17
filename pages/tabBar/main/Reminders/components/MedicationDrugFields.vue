<template>
	<view class="drug-fields">
		<text class="drug-hint">{{ $t('药单未知允许') }}</text>
		<view class="drug-field"><text>{{ $t('药单市场') }}</text><picker :disabled="disabled" :range="[$t('药单中国'),$t('药单美国')]" :value="value.market==='US'?1:0" @change="set('market',Number($event.detail.value)?'US':'CN')"><view class="drug-select">{{ $t(value.market==='US'?'药单美国':'药单中国') }} ›</view></picker></view>
		<view class="drug-field"><text>{{ $t('药单药品类别') }}</text><picker :disabled="disabled" :range="classLabels" :value="classIndex" @change="set('classCode',Number($event.detail.value)?classes[Number($event.detail.value)-1].code:'')"><view class="drug-select">{{ classLabels[classIndex] }} ›</view></picker></view>
		<view class="drug-field"><text>{{ $t('药单药名') }}</text><input :value="value.drugName" :disabled="disabled" maxlength="60" :placeholder="$t('药单药名占位')" @input="nameChanged($event.detail.value)" /></view>
		<view v-if="suggestions.length" class="drug-suggestions"><text class="drug-hint">{{ $t('药单候选说明') }}</text><view v-for="term in suggestions" :key="term.id" class="drug-term" @click="select(term)">{{ term.name }}</view></view>
		<view class="drug-field"><text>{{ $t('药单每次剂量') }}</text><view class="drug-dose"><input type="digit" :disabled="disabled" :value="value.doseValue" @input="set('doseValue',$event.detail.value)" :placeholder="$t('药单数量')" /><input :disabled="disabled" :value="value.doseUnit" @input="set('doseUnit',$event.detail.value)" :placeholder="$t('药单单位')" /></view></view>
		<view class="drug-field"><text>{{ $t('药单开始日期') }}</text><picker mode="date" :disabled="disabled" :value="value.startAt" @change="set('startAt',$event.detail.value)"><view class="drug-select">{{ value.startAt || $t('药单未填写') }} ›</view></picker></view>
		<view class="drug-field"><text>{{ $t('药单结束日期') }}</text><picker mode="date" :disabled="disabled" :value="value.endAt" @change="set('endAt',$event.detail.value)"><view class="drug-select">{{ value.endAt || $t('药单持续用药') }} ›</view></picker><text v-if="value.endAt" @click="set('endAt','')">×</text></view>
		<view v-if="value.classCode==='COMBINATION'||ingredients.length" class="drug-ingredients"><text>{{ $t('药单有效成分') }}</text><view v-for="(ingredient,index) in ingredients" :key="index" class="ingredient-row"><input :disabled="disabled" :value="ingredient.name" :placeholder="$t('药单成分名称')" @input="ingredientChanged(index,'name',$event.detail.value)" /><input :disabled="disabled" :value="ingredient.amount" :placeholder="$t('药单含量')" @input="ingredientChanged(index,'amount',$event.detail.value)" /><input :disabled="disabled" :value="ingredient.unit" :placeholder="$t('药单单位')" @input="ingredientChanged(index,'unit',$event.detail.value)" /><text @click="removeIngredient(index)">×</text></view></view>
		<button v-if="ingredients.length<10" class="ingredient-add" :disabled="disabled" @click="addIngredient">+ {{ $t('药单添加成分') }}</button>
		<view class="drug-confirm"><checkbox :checked="value.confirmed===true" :disabled="disabled" @click="set('confirmed',!value.confirmed)" /><text>{{ $t('药单本人核对') }}</text></view>
		<text class="drug-hint">{{ $t('药单待核验说明') }}</text>
	</view>
</template>
<script>
import { MEDICATION_CLASSES, suggestMedicationTerms } from '../api/medicationCatalog.js'
export default {
	props:{value:{type:Object,default:()=>({})},disabled:Boolean},
	data(){return {classes:MEDICATION_CLASSES,suggestions:[]}},
	computed:{
		classLabels(){return [this.$t('药单未知类别'),...this.classes.map(row=>this.$t('药单类别'+row.code))]},
		classIndex(){return this.classes.findIndex(row=>row.code===this.value.classCode)+1},
		ingredients(){return this.value.ingredients||[]}
	},
	beforeDestroy(){clearTimeout(this._searchTimer)},
	methods:{
		set(key,value){if(!this.disabled){if(key==='market'||key==='classCode'){clearTimeout(this._searchTimer);this.suggestions=[]}this.$emit('input',{...this.value,confirmed:false,[key]:value,reviewStatus:'unverified'})}},
		nameChanged(value){this.set('drugName',value);clearTimeout(this._searchTimer);this._searchTimer=setTimeout(()=>{this.suggestions=suggestMedicationTerms(value,this.value.market||'CN',this.value.classCode)},300)},
		select(term){if(this.disabled)return;clearTimeout(this._searchTimer);this.$emit('input',{...this.value,drugName:term.name,classCode:term.classCode,market:term.market,confirmed:false,reviewStatus:'unverified'});this.suggestions=[]},
		ingredientChanged(index,key,value){this.set('ingredients',this.ingredients.map((row,i)=>i===index?{...row,[key]:value}:row))},
		addIngredient(){this.set('ingredients',[...this.ingredients,{name:'',amount:'',unit:''}])},
		removeIngredient(index){this.set('ingredients',this.ingredients.filter((_,i)=>i!==index))}
	}
}
</script>
<style scoped>
.drug-fields{padding:12px 4px;border-bottom:1px solid #e2eaf2}.drug-field{display:flex;align-items:center;gap:10px;margin:12px 0;font-size:14px}.drug-field>text:first-child{width:90px;flex-shrink:0}.drug-field input,.drug-field picker{flex:1;min-width:0}.drug-field input,.drug-select{background:#f3f7fb;border-radius:6px;padding:8px;font-size:14px;height:auto;min-height:22px}.drug-dose{display:flex;gap:8px;flex:1;min-width:0}.drug-dose input{width:0}.drug-hint{display:block;color:#6a7b8c;font-size:12px;line-height:1.6;margin:6px 0}.drug-suggestions{border:1px solid #dbe8f1;border-radius:8px;padding:8px}.drug-term{padding:10px 0;border-bottom:1px solid #eef3f8;font-size:14px}.drug-confirm{display:flex;align-items:center;gap:6px;font-size:13px;line-height:1.5;margin:12px 0}.ingredient-row{display:flex;gap:6px;margin:8px 0}.ingredient-row input{width:0;flex:1;min-width:0;font-size:12px;background:#f3f7fb;padding:6px;height:30px}.ingredient-row input:first-child{flex:2}.drug-ingredients>text{font-size:14px}.ingredient-add{font-size:12px;background:#edf7ff;color:#1479bb;margin:8px 0}
</style>
