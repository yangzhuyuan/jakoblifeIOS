import { MEDICATION_CLASSES, MEDICATION_SEEDS } from './medicationCatalogSeeds.js'
export { MEDICATION_CLASSES }
const spelling = {
	硝苯地平:'xiao ben di ping',氨氯地平:'an lv di ping',左氨氯地平:'zuo an lv di ping',非洛地平:'fei luo di ping',拉西地平:'la xi di ping',尼卡地平:'ni ka di ping',尼群地平:'ni qun di ping',贝尼地平:'bei ni di ping',乐卡地平:'le ka di ping',马尼地平:'ma ni di ping',西尼地平:'xi ni di ping',巴尼地平:'ba ni di ping',维拉帕米:'wei la pa mi',地尔硫䓬:'di er liu zhuo',卡托普利:'ka tuo pu li',依那普利:'yi na pu li',贝那普利:'bei na pu li',赖诺普利:'lai nuo pu li',雷米普利:'lei mi pu li',福辛普利:'fu xin pu li',西拉普利:'xi la pu li',培哚普利:'pei duo pu li',咪哒普利:'mi da pu li',氯沙坦钾:'lv sha tan jia',缬沙坦:'xie sha tan',厄贝沙坦:'e bei sha tan',替米沙坦:'ti mi sha tan',坎地沙坦酯:'kan di sha tan zhi',奥美沙坦酯:'ao mei sha tan zhi',阿利沙坦酯:'a li sha tan zhi',美阿沙坦钾:'mei a sha tan jia',阿齐沙坦:'a qi sha tan',氢氯噻嗪:'qing lv sai qin',氯噻酮:'lv sai tong',吲达帕胺:'yin da pa an',呋塞米:'fu sai mi',托拉塞米:'tuo la sai mi',阿米洛利:'a mi luo li',氨苯蝶啶:'an ben die ding',普萘洛尔:'pu nai luo er',美托洛尔:'mei tuo luo er',比索洛尔:'bi suo luo er',阿替洛尔:'a ti luo er',倍他洛尔:'bei ta luo er',拉贝洛尔:'la bei luo er',卡维地洛:'ka wei di luo',阿罗洛尔:'a luo luo er',贝凡洛尔:'bei fan luo er',沙库巴曲缬沙坦钠:'sha ku ba qu xie sha tan na',沙库巴曲阿利沙坦钙:'sha ku ba qu a li sha tan gai',多沙唑嗪:'duo sha zuo qin',哌唑嗪:'pai zuo qin',特拉唑嗪:'te la zuo qin',螺内酯:'luo nei zhi',依普利酮:'yi pu li tong',非奈利酮:'fei nai li tong',阿利吉仑:'a li ji lun',利血平:'li xue ping',可乐定:'ke le ding',甲基多巴:'jia ji duo ba',米诺地尔:'mi nuo di er',肼屈嗪:'jing qu qin'
}
const forms = {'缓释胶囊':'huan shi jiao nang','缓释片':'huan shi pian','控释片':'kong shi pian','平片':'ping pian','贴片':'tie pian','片':'pian'}
const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[\s·/\\-]/g,'')
// 附录 C 的复方名称也只作识别词，不填入未经核对的剂量或产品编号。
const combinations = [
	['CN','氯沙坦钾/氢氯噻嗪'],['CN','缬沙坦/氢氯噻嗪'],['CN','厄贝沙坦/氢氯噻嗪'],['CN','培哚普利/氨氯地平'],
	['US','Losartan/HCTZ'],['US','Valsartan/HCTZ'],['US','Olmesartan/amlodipine'],['US','Olmesartan/amlodipine/HCTZ']
].map(([market,name],index)=>({id:'seed-combination-'+index,name,market,classCode:'COMBINATION',reviewStatus:'unverified'}))
function pinyin(name) {
	const base = Object.keys(spelling).sort((a,b)=>b.length-a.length).find(key=>name.startsWith(key))
	if (!base) return ''
	return spelling[base]+(name===base?'':' '+(forms[name.slice(base.length)] || ''))
}
// 本地候选只能作为自由文本待核验录入；没有 product_id、批准文号或“已审核”标记。
export function suggestMedicationTerms(query, market = 'CN', classCode = '', limit = 10) {
	const q = normalize(query)
	if (!q || q.length>40) return []
	return [...MEDICATION_SEEDS,...combinations].filter(row=>row.market===market && (!classCode || row.classCode===classCode)).map(row=>{
		const name=normalize(row.name), words=pinyin(row.name).split(' '), full=words.join(''), initials=words.map(word=>word[0]||'').join('')
		const rank=name===q?0:name.startsWith(q)?1:full.startsWith(q)||initials.startsWith(q)?2:name.includes(q)?3:99
		return {...row,rank}
	}).filter(row=>row.rank<99).sort((a,b)=>a.rank-b.rank||a.name.localeCompare(b.name)).slice(0,Math.min(10,Math.max(1,limit)))
}
