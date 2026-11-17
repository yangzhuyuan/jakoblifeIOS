<template>
	<view v-if="visible" class="profile-mask" @touchmove.stop.prevent>
		<view class="profile-dialog" @click.stop>
			<text class="profile-title">{{ $t(required ? '健康档案先建档' : '健康档案标题') }}</text>
			<text class="profile-note">{{ $t('健康档案填写说明') }}</text>
			<view v-for="field in fields" :key="field.key" class="profile-row">
				<text>{{ $t(field.label) }}{{ field.key === 'height' ? (units.height ? ' (in)' : ' (cm)') : field.key === 'weight' ? (units.weight ? ' (lb)' : ' (kg)') : '' }}</text>
				<input v-model="form[field.key]" :type="field.key === 'name' ? 'text' : field.key === 'age' ? 'number' : 'digit'" :disabled="saving" :maxlength="field.key === 'name' ? 60 : 8" :placeholder="$t(field.placeholder)" />
			</view>
			<text v-if="error" class="profile-error">{{ $t(error) }}</text>
			<view class="profile-buttons"><button :disabled="saving" @click="finish(false)">{{ $t('取消') }}</button><button class="profile-save" :loading="saving" :disabled="saving" @click="save">{{ $t('健康提醒保存') }}</button></view>
		</view>
	</view>
</template>
<script>
import { createHealthProfileStore, profileForm, missingProfileFields } from '../api/healthProfile.js'
export default {
	data() { return { visible:false, required:false, saving:false, form:{name:'',age:'',height:'',weight:''}, units:{}, original:{}, error:'', fields:[
		{key:'name',label:'姓名',placeholder:'请输入姓名'}, {key:'age',label:'年龄',placeholder:'请输入年龄'},
		{key:'height',label:'身高',placeholder:'请输入身高'}, {key:'weight',label:'体重',placeholder:'请输入体重'}] } },
	beforeDestroy() { this._disposed = true; this.finish(false) },
	methods: {
		async open({ required = false } = {}) {
			if (this._opening || this.visible) return false
			this._opening = true
			try {
				this._store = createHealthProfileStore(this)
				this.original = await this._store.load()
				if (this._disposed || !this._store.isCurrent()) return false
				this.units = {height:String(uni.getStorageSync('danwei1')) === '0',weight:String(uni.getStorageSync('danwei2')) === '1'}
				this.form = profileForm(this.original,this.units)
				if (required && !missingProfileFields(this.form).length) return true
				this.required = required; this.error = ''; this.visible = true
				return await new Promise(resolve => { this._resolve = resolve })
			} catch (error) { if (!this._disposed) uni.showToast({title:this.$t('健康档案读取失败'),icon:'none'}); return false }
			finally { this._opening = false }
		},
		finish(result) { this.visible = false; if (this._resolve) { const resolve=this._resolve;this._resolve=null;resolve(result) } },
		async save() {
			if (this.saving) return
			if (missingProfileFields(this.form).length) { this.error = '健康档案请完整填写';return }
			this.saving = true;this.error = ''
			try {
				await this._store.save(this.form,this.original,this.units)
				if (!this._disposed) { this.finish(true);this.$emit('saved') }
			} catch (error) { if (!this._disposed) this.error = this._store.isCurrent() ? '健康档案保存失败' : '健康档案账号已变化' }
			finally { this.saving=false }
		}
	}
}
</script>
<style scoped>
.profile-mask{position:fixed;inset:0;z-index:9999;background:rgba(15,30,50,.45);display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}.profile-dialog{width:100%;max-width:400px;background:white;border-radius:18px;padding:22px;box-sizing:border-box;max-height:85vh;overflow:auto}.profile-title{display:block;font-size:20px;font-weight:bold;color:#10213c}.profile-note{display:block;font-size:13px;color:#65758a;margin:10px 0 16px;line-height:1.5}.profile-row{margin-bottom:14px}.profile-row>text{font-size:14px;color:#20344d;display:block;margin-bottom:6px}.profile-row input{height:40px;padding:0 10px;background:#f1f7fc;border-radius:8px;font-size:16px}.profile-error{color:#bd3535;font-size:13px;display:block;margin:8px 0}.profile-buttons{display:flex;gap:12px;margin-top:18px}.profile-buttons button{flex:1;margin:0;font-size:15px}.profile-buttons .profile-save{background:#139aff;color:white}
</style>
