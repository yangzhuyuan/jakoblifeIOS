export const PLUGIN_ID='Jakob-BPReader';
export function normalizeResult(raw={},defaultPressureUnit=null) {
 const detected=raw.recognitionStatus==='recognized'&&raw.unit==='mmHg'&&raw.unitStatus==='recognized'&&raw.unitSource==='image_text';
 const inferred=!detected&&raw.recognitionStatus==='recognized'&&raw.unitStatus!=='recognized'&&['mmHg','kPa'].includes(defaultPressureUnit);
 return {...raw,captureId:raw.captureId??null,requestId:raw.requestId??null,
  phase:raw.phase??'complete',recognitionStatus:raw.recognitionStatus??'error',
  readings:{systolic:raw.readings?.systolic??null,diastolic:raw.readings?.diastolic??null,pulse:raw.readings?.pulse??null},
  requiresConfirmation:true,unit:detected?'mmHg':inferred?defaultPressureUnit:null,unitStatus:detected?'recognized':inferred?'inferred':'unknown',unitSource:detected?'image_text':inferred?'configured_default':null,photoStatus:raw.photoStatus??'not_attempted',
  photoPath:raw.photoPath??null,recordPath:raw.recordPath??null,errorCode:raw.errorCode??null,errorMessage:raw.errorMessage??null};
}
export function createBPReader({loadPlugin=()=>uni.requireNativePlugin(PLUGIN_ID),convertPath=path=>{
 if(path.startsWith('_')){if(typeof plus==='undefined')throw new Error('本地路径转换需要App运行环境');return plus.io.convertLocalFileSystemURL(path);}return path;
}}={}) {
 let plugin;
 function get(){if(!plugin)plugin=loadPlugin();if(!plugin||typeof plugin.recognize!=='function')throw new Error('未加载Jakob-BPReader，请重新制作包含插件的自定义基座');return plugin;}
 return {
  getVersion(callback){get().getVersion({},callback);},
  startLiveScan(options={},onComplete){
   if(typeof onComplete!=='function')throw new Error('结果回调不能为空');
   if(options.requestId!==undefined&&(typeof options.requestId!=='string'||options.requestId.length>128))throw new Error('requestId须为128字符以内字符串');
   if(options.defaultPressureUnit!==undefined&&!['mmHg','kPa',null].includes(options.defaultPressureUnit))throw new Error('defaultPressureUnit须为mmHg、kPa或null');
   if(options.scanTimeoutMs!==undefined&&(!Number.isInteger(options.scanTimeoutMs)||options.scanTimeoutMs<5000||options.scanTimeoutMs>120000))throw new Error('scanTimeoutMs须为5000..120000的整数');
   const native=get();
   if(typeof native.startLiveScan!=='function')throw new Error('当前基座不支持原生实时扫描，请安装包含1.2.0插件的新基座');
   const args={requestId:options.requestId};
   if(options.scanTimeoutMs!==undefined)args.scanTimeoutMs=options.scanTimeoutMs;
   if(options.prompts&&typeof options.prompts==='object')args.prompts=options.prompts;
   console.log('[BPLiveScan] native.startLiveScan requestId=' + (options.requestId || '') + ' scanTimeoutMs=' + (args.scanTimeoutMs || ''));
   native.startLiveScan(args,raw=>{
    console.log('[BPLiveScan] native callback raw', raw && raw.errorCode, raw && raw.recognitionStatus, raw && raw.phase);
    try{onComplete(normalizeResult(raw,options.defaultPressureUnit??null));}
    catch(error){console.error('[BPLiveScan] native callback failed', error && (error.stack || error.message) || error);}
   });
  },
  cancelLiveScan(requestId,callback=()=>{}){
   const native=get();
   console.log('[BPLiveScan] native.cancelLiveScan requestId=' + (requestId || '') + ' supported=' + (typeof native.cancelLiveScan));
   if(typeof native.cancelLiveScan==='function')native.cancelLiveScan({requestId},callback);
   else callback({cancelled:false});
  },
  recognize(options,onUpdate){
   if(!options||typeof options.imagePath!=='string'||!options.imagePath)throw new Error('imagePath不能为空');
   if(typeof onUpdate!=='function')throw new Error('结果回调不能为空');
   if(options.savePhoto!==undefined&&typeof options.savePhoto!=='boolean')throw new Error('savePhoto须为布尔值');
   if(options.rotationClockwise!==undefined&&![0,90,180,270].includes(options.rotationClockwise))throw new Error('rotationClockwise须为0/90/180/270');
   if(options.mirrored!==undefined&&typeof options.mirrored!=='boolean')throw new Error('mirrored须为布尔值');
   if(options.requestId!==undefined&&(typeof options.requestId!=='string'||options.requestId.length>128))throw new Error('requestId须为128字符以内字符串');
   if(options.defaultPressureUnit!==undefined&&!['mmHg','kPa',null].includes(options.defaultPressureUnit))throw new Error('defaultPressureUnit须为mmHg、kPa或null');
   const defaultPressureUnit=options.defaultPressureUnit??null;
   const args={...options,imagePath:convertPath(options.imagePath),savePhoto:options.savePhoto!==false};
   delete args.defaultPressureUnit;
   if(/^(https?:|data:|blob:)/i.test(args.imagePath))throw new Error('只接受本地照片，不接受网络或Base64图片');
   get().recognize(args,value=>onUpdate(normalizeResult(value,defaultPressureUnit)));
  }
 };
}
