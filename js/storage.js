/* Settings, progress and history, kept in this browser only (localStorage). */
const LS='cw-drill-v1';
export const DEF={
  mode:'chars',order:'koch',
  wpm:22,charGap:3,wordGap:7,repeats:1,repeatGap:1,hz:600,vol:50,
  lenMin:3,lenMax:5,maxSame:2,limit:true,
  slow:3,unlock:80,engine:'browser',micId:'',
  hist:[],prog:{}
};
const KEYS=Object.keys(DEF).filter(k=>k!=='hist'&&k!=='prog');

export function load(){
  const cfg=JSON.parse(JSON.stringify(DEF));
  try{const o=JSON.parse(localStorage.getItem(LS)||'null');
    if(o&&typeof o==='object'){
      for(const k of KEYS)if(o[k]!==undefined&&typeof o[k]===typeof DEF[k])cfg[k]=o[k];
      if(Array.isArray(o.hist))cfg.hist=o.hist.slice(-100);
      if(o.prog&&typeof o.prog==='object')cfg.prog=o.prog;
    }}catch(e){}
  return cfg;
}
export function save(cfg){
  try{const o={};for(const k of KEYS)o[k]=cfg[k];o.hist=cfg.hist;o.prog=cfg.prog;o.ts=Date.now();
    localStorage.setItem(LS,JSON.stringify(o));return true}catch(e){return false}
}
