export function readingsKey(result) {
 const r=result?.readings;
 if(result?.recognitionStatus!=='recognized'||!r)return null;
 if(![r.systolic,r.diastolic,r.pulse].every(Number.isInteger))return null;
 return `${r.systolic}/${r.diastolic}/${r.pulse}`;
}

export function createReadingStabilizer({requiredMatches=3,maxGapMs=5000}={}) {
 let key=null,count=0,lastAt=0,latest=null;
 return {
  push(result,at=Date.now()) {
   const next=readingsKey(result);
   if(!next){key=null;count=0;latest=null;return {stable:false,count:0,key:null,result:null};}
   if(next===key&&at-lastAt<=maxGapMs)count+=1;else {key=next;count=1;}
   lastAt=at;latest=result;
   return {stable:count>=requiredMatches,count,key,result:latest};
  },
  reset(){key=null;count=0;lastAt=0;latest=null;}
 };
}
