// 与“个人信息”共用服务器档案；身高/体重在服务器始终是 cm/kg。
const blank = value => value === null || value === undefined || String(value).trim() === ''
export function parseProfileBirth(value) {
	const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
	if (!match) return null
	const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
	return date.getFullYear() === Number(match[1]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[3]) ? date : null
}
export function profileAge(value, today = new Date()) {
	const birth = parseProfileBirth(value)
	if (!birth || birth > today) return ''
	return today.getFullYear() - birth.getFullYear() - (today.getMonth() < birth.getMonth() || today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate() ? 1 : 0)
}
export function birthForProfileAge(age, original, today = new Date()) {
	const format = date => [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-')
	const birth = parseProfileBirth(original)
	if (birth && profileAge(original, today) === age) return format(birth)
	const basis = birth && birth <= today ? birth : today
	for (const year of [today.getFullYear()-age,today.getFullYear()-age-1]) {
		const date = new Date(year,basis.getMonth(),Math.min(basis.getDate(),new Date(year,basis.getMonth()+1,0).getDate()))
		if (profileAge(format(date),today) === age) return format(date)
	}
	return format(new Date(today.getFullYear()-age,today.getMonth(),today.getDate()))
}
export function profileForm(profile, units = {}) {
	const form = { name: String(profile.nickName || profile.userName || '').trim(), age: profileAge(profile.birthTime), height: '', weight: '' }
	for (const field of ['height','weight']) {
		const value = Number(profile[field])
		if (value > 0 && Number.isFinite(value)) form[field] = units[field] ? Math.round(value * (field === 'height' ? 1/2.54 : 2.20462262185)*100)/100 : value
	}
	return form
}
export function missingProfileFields(form) {
	return ['name','age','height','weight'].filter(field => blank(form[field]) || (field !== 'name' && (!Number.isFinite(Number(form[field])) ||
		(field === 'age' ? !Number.isInteger(Number(form[field])) || Number(form[field]) < 0 || Number(form[field]) > 150 : Number(form[field]) <= 0))))
}
export function createHealthProfileStore(vm) {
	const base = vm.$url_APP_IP, token = uni.getStorageSync('token'), userId = uni.getStorageSync('userid'), server = uni.getStorageSync('URL_APP_IP')
	const current = () => !!token && !!userId && token === uni.getStorageSync('token') && userId === uni.getStorageSync('userid') && base === vm.$url_APP_IP && server === uni.getStorageSync('URL_APP_IP')
	const assertCurrent = () => { if (!current()) throw new Error('健康档案账号已变化') }
	const headers = { Authorization: 'Bearer '+token, 'content-type': 'application/json;charset=UTF-8' }
	return {
		isCurrent: current,
		async load() {
			assertCurrent()
			const result = await vm.$get(base+(vm.$url_getInfo || '/prod-api/app/user/profile/getInfo'), {}, headers)
			assertCurrent()
			if (!result || result.code !== 200 || !result.data) throw new Error('健康档案读取失败')
			return result.data
		},
		async save(form, original, units = {}) {
			assertCurrent()
			if (missingProfileFields(form).length) throw new Error('健康档案请完整填写')
			const displayed = profileForm(original, units), payload = { nickName: String(form.name).trim(), birthTime: birthForProfileAge(Number(form.age), original.birthTime) }
			for (const field of ['height','weight']) payload[field] = String(form[field]) === String(displayed[field]) && Number(original[field]) > 0 ? Number(original[field]) :
				Number(form[field]) * (units[field] ? field === 'height' ? 2.54 : 0.45359237 : 1)
			const result = await vm.$post(base+(vm.$url_update_info || '/prod-api/app/user/profile/update_info'), payload, headers)
			assertCurrent()
			if (!result || result.code !== 200) throw new Error('健康档案保存失败')
			return { ...original, ...payload }
		}
	}
}
