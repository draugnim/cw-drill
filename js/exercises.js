import {KOCH,LET,DIG,FULL,PREFIXES,DIGITS} from './data.js?v=21';
import {WORDS,ABBR} from './words.js?v=21';

/* ---------- per-character progress ---------- */
const ALNUM=LET.concat(DIG);
export function sequence(cfg){return cfg.order==='koch'?KOCH:cfg.order==='letters'?LET:cfg.order==='alnum'?ALNUM:FULL}
export function getProg(cfg){
  let p=cfg.prog[cfg.order];
  if(!p){const o=sequence(cfg);p={active:cfg.order==='koch'?o.slice(0,2):o.slice(),S:{}};cfg.prog[cfg.order]=p}
  FULL.forEach(c=>{if(!p.S[c])p.S[c]={s:0.3,a:0,ok:0}});
  return p;
}
const weight=(p,c)=>Math.pow(1-(p.S[c]?p.S[c].s:0.3),2)+0.04;
function pickWeighted(items,wf){const w=items.map(wf),tot=w.reduce((a,b)=>a+b,0);let r=Math.random()*tot;
  for(let i=0;i<items.length;i++){r-=w[i];if(r<=0)return items[i]}return items[items.length-1]}
const randInt=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function lengthRange(cfg){const a=Math.max(1,Math.min(cfg.lenMin,cfg.lenMax)),b=Math.max(cfg.lenMin,cfg.lenMax);return [a,b]}
function maxRepeat(s){const n={};let m=0;for(const c of s){n[c]=(n[c]||0)+1;m=Math.max(m,n[c])}return m}

/* ---------- generators: each returns {text, note?} — note is an i18n key ---------- */
function chars(cfg,p,last){
  const a=p.active;let c=pickWeighted(a,x=>weight(p,x));
  if(c===last&&a.length>2)c=pickWeighted(a,x=>weight(p,x));
  return {text:c};
}
function group(cfg,p,pool){
  pool=pool||p.active;const [a,b]=lengthRange(cfg),n=randInt(a,b),cnt={};let s='';
  const cap=Math.max(1,cfg.maxSame);
  for(let i=0;i<n;i++){
    let options=pool.filter(c=>(cnt[c]||0)<cap);if(!options.length)options=pool;
    const c=pickWeighted(options,x=>weight(p,x));cnt[c]=(cnt[c]||0)+1;s+=c}
  return {text:s};
}
/* words and abbreviations: filter the list, skip recently sent ones, prefer weak characters */
const recent={words:[],abbr:[]};
function fromList(cfg,p,last,src,kind){
  const [a,b]=lengthRange(cfg),act=new Set(p.active),cap=Math.max(1,cfg.maxSame);
  const list=[...new Set(src)].filter(w=>w.length>=a&&w.length<=b&&maxRepeat(w)<=cap&&(!cfg.limit||[...w].every(c=>act.has(c)))&&w!==last);
  if(list.length<8){const g=group(cfg,p);g.note='noteWords';return g}
  /* don't repeat any of the last few (up to 30, never more than half the pool) */
  const R=recent[kind],keep=Math.min(30,Math.floor(list.length/2)),skip=new Set(R.slice(-keep));
  const pool=list.filter(w=>!skip.has(w));
  /* sample a few, keep the one with the most weak characters */
  const cand=Array.from({length:4},()=>pool[Math.floor(Math.random()*pool.length)]);
  const w=pickWeighted(cand,w=>[...w].reduce((s,c)=>s+weight(p,c),0)/w.length);
  R.push(w);if(R.length>40)R.shift();
  return {text:w};
}
function callsign(cfg,p){
  const act=new Set(p.active),lim=cfg.limit;
  const letters=lim?LET.filter(c=>act.has(c)):LET,digits=lim?DIG.filter(c=>act.has(c)):DIG;
  if(lim&&(letters.length<2||digits.length<1)){const c=callsign(Object.assign({},cfg,{limit:false}),p);c.note='noteCalls';return c}
  /* prefix (as allocated) + one call-area digit; skip prefixes whose characters or digits aren't available */
  const usable=x=>(!lim||[...x].every(c=>act.has(c)))&&(DIGITS[x]||DIG.join('')).split('').some(d=>digits.includes(d));
  const pre=PREFIXES.filter(usable);
  let prefix=pre.length?pre[Math.floor(Math.random()*pre.length)]:pickWeighted(letters,x=>weight(p,x));
  const ds=(DIGITS[prefix]||DIG.join('')).split('').filter(d=>digits.includes(d));
  prefix+=pickWeighted(ds.length?ds:digits,x=>weight(p,x));
  const n=randInt(1,3),cnt={};let suf='';const cap=Math.max(1,cfg.maxSame);
  for(let i=0;i<n;i++){let o=letters.filter(c=>(cnt[c]||0)<cap);if(!o.length)o=letters;const c=pickWeighted(o,x=>weight(p,x));cnt[c]=(cnt[c]||0)+1;suf+=c}
  let s=prefix+suf;
  /* occasionally portable or mobile */
  if(Math.random()<0.1){const tails=['P','M'].filter(t=>!lim||act.has(t));if(tails.length&&(!lim||act.has('/')))s+='/'+tails[Math.floor(Math.random()*tails.length)]}
  return {text:s};
}
export function nextItem(cfg,last){
  const p=getProg(cfg);
  switch(cfg.mode){
    case 'groups':return group(cfg,p);
    case 'words':return fromList(cfg,p,last,WORDS,'words');
    case 'abbr':return fromList(cfg,p,last,ABBR,'abbr');
    case 'calls':return callsign(cfg,p);
    default:return chars(cfg,p,last);
  }
}

/* ---------- scoring ---------- */
/* given: string the user spelled, or 'NOPE'. Updates per-character mastery. */
export function score(cfg,target,given,fast){
  const p=getProg(cfg),single=target.length===1;
  [...target].forEach((ch,i)=>{
    const st=p.S[ch];if(!st)return;st.a++;
    if(given!=='NOPE'&&given[i]===ch){st.ok++;st.s+=(1-st.s)*(single?(fast?0.32:0.1):(fast?0.2:0.08))}
    else st.s*=single?0.45:(given==='NOPE'?0.6:0.5);
    st.s=Math.min(1,Math.max(0,st.s));
  });
}
export function maybeUnlock(cfg){
  const p=getProg(cfg),o=sequence(cfg);if(p.active.length>=o.length)return null;const th=cfg.unlock/100;
  if(p.active.every(c=>p.S[c].s>=th&&p.S[c].a>=4)){const nc=o[p.active.length];p.active.push(nc);p.S[nc].s=0.15;return nc}
  return null;
}
