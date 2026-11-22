import {MORSE,NATO,LOOKUP,NOPE,CMD,FULL} from './data.js?v=5';
import {createPlayer} from './morse.js?v=5';
import {load,save as store} from './storage.js?v=14';
import {sequence,getProg,nextItem,score,maybeUnlock} from './exercises.js?v=5';
import {createMic,hasWebSpeech,canCapture,GRAMMAR} from './recognizer.js?v=13';
import {t,setLang,getLang,pickDefault,applyStatic} from './i18n.js?v=14';

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cfg=load();
const player=createPlayer($('led'));
setLang(cfg.lang||pickDefault());

let cur=null,last=null,buf=[],rawWords=[],busy=false,running=false,times={firstEnd:0,end:0},timer=null;
let sess={ok:0,n:0,streak:0},speaking=false,ignoreUntil=0;
const multi=()=>cfg.mode!=='chars';

/* ---------- parsing what was said or typed ---------- */
function parseTok(t){
  t=String(t).toUpperCase().trim();if(t.length>1)t=t.replace(/[.,?!]+$/,'');t=t.replace(/[^A-Z0-9.,?/=]/g,'');
  if(!t)return null;if(t.length===1&&MORSE[t])return t;if(NOPE.has(t))return 'NOPE';if(CMD[t])return CMD[t];return LOOKUP[t]||'BAD';
}
const tokens=s=>String(s).match(/\S+/g)||[];

/* ---------- display ---------- */
function bigSize(n){return n<=1?'':`font-size:${Math.max(26,Math.min(64,Math.floor(300/n)))}px`}
function setBig(html,cls,n){const b=$('big');b.innerHTML=html;b.className='big '+(cls||'')+(n>1?' multi':'');b.setAttribute('style',bigSize(n||1))}
const patOf=s=>s.length>1?'':MORSE[s].split('').map(x=>x==='.'?'•':'—').join(' ');
function showSlots(){const t=cur.text;setBig([...t].map((c,i)=>i<buf.length?esc(buf[i]):'<span class="u">_</span>').join(''),'',t.length)}
const spell=s=>[...s].map(c=>NATO[c]||c).join(', ');

/* ---------- flow ---------- */
function schedule(fn,ms){clearTimeout(timer);timer=setTimeout(fn,ms)}
function sendCurrent(){times=player.play(cur.text,cfg)}
function next(){
  if(!running)return;
  cur=nextItem(cfg,last&&last.text);last=cur;buf=[];rawWords=[];busy=false;
  $('pat').textContent='';setState('stListening');$('itemNote').textContent=cur.note?t(cur.note):'';
  if(multi()){showSlots();$('msg').innerHTML=t('spellIt',{n:cur.text.length})}
  else{setBig('?','wait',1);$('msg').innerHTML=t('whatWas')}
  mic.setVocab(vocabFor());sendCurrent();render();
}
/* offline recogniser: only the characters this item can contain, plus next (and over/correction when spelling) */
function vocabFor(){
  const all=(cur&&cur.note)||(!cfg.limit&&(cfg.mode==='words'||cfg.mode==='calls'));
  const set=new Set(all?FULL:getProg(cfg).active);
  return GRAMMAR.filter(w=>{const g=parseTok(w.split(' ')[0]);return g==='NOPE'||(multi()&&(g==='OVER'||g==='BACK'))||set.has(g)});
}
function pickVoice(){try{const v=speechSynthesis.getVoices();return v.find(x=>/^en[-_]US/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null}catch(e){return null}}
function say(text,cb){
  if(!('speechSynthesis' in window)){schedule(cb,2000);return}
  let done=false;const fin=()=>{if(done)return;done=true;speaking=false;ignoreUntil=performance.now()+1300;if(running)cb()};
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';const v=pickVoice();if(v)u.voice=v;u.rate=1;u.onend=fin;u.onerror=fin;
    speaking=true;speechSynthesis.speak(u);setTimeout(fin,1500+text.length*120)}catch(e){speaking=false;schedule(cb,2000)}
}
function introNew(nc,cb){if(!running)return;setBig(esc(nc),'',1);$('pat').textContent=patOf(nc);player.play(nc,Object.assign({},cfg,{repeats:1}));schedule(cb,2600)}

/* given: the spelled string, or 'NOPE' */
function finish(given,raw){
  if(!running||busy||!cur)return false;
  busy=true;$('err').textContent='';
  const now=performance.now();if(now<times.end)player.stop();
  const target=cur.text,dt=Math.max(0,(now-times.end)/1000),ok=given===target,fast=dt<=cfg.slow;
  score(cfg,target,given,fast);
  sess.n++;if(ok){sess.ok++;sess.streak++}else sess.streak=0;
  cfg.hist.push({c:target,g:given,ok,slow:ok&&!fast,dt:Math.round(dt*10)/10,raw:String(raw||'').trim().slice(0,60),at:Date.now(),m:cfg.mode});
  if(cfg.hist.length>100)cfg.hist=cfg.hist.slice(-100);
  if(target.length===1){
    setBig(esc(target),ok?'ok':'bad',1);$('pat').textContent=patOf(target);
    $('msg').innerHTML=ok?(fast?t('correct',{x:NATO[target]}):t('correctSlow',{x:NATO[target],s:dt.toFixed(1)}))
      :given==='NOPE'?t('itWas',{x:NATO[target]}):t('notX',{g:esc(NATO[given]||given),x:NATO[target]});
  }else{
    setBig([...target].map((c,i)=>`<span class="${given!=='NOPE'&&given[i]===c?'g':'b'}">${esc(c)}</span>`).join(''),'',target.length);
    $('msg').innerHTML=ok?(fast?t('correct',{x:esc(target)}):t('correctSlow',{x:esc(target),s:dt.toFixed(1)}))
      :given==='NOPE'?t('itWas',{x:esc(target)}):t('youSpelled',{g:esc(given),x:esc(target)});
  }
  const nc=maybeUnlock(cfg);if(nc)$('msg').innerHTML+=` · <span style="color:var(--amber)">${t('newChar',{c:esc(nc),n:NATO[nc]})}</span>`;
  setState('');render();renderHist();persist();
  const after=()=>nc?introNew(nc,next):schedule(next,ok?0:600);
  if(!ok)say(spell(target),after);else schedule(after,cfg.okPause*1000);
  return true;
}
/* one spelled token while answering a word or callsign */
function spellToken(tok){
  const g=parseTok(tok);if(!g||g==='BAD')return;
  rawWords.push(tok);
  if(g==='NOPE'){finish('NOPE',rawWords.join(' '));return}
  if(g==='OVER'){if(buf.length)finish(buf.join(''),rawWords.join(' '));return}
  if(g==='BACK'){buf.pop();showSlots();return}
  buf.push(g);showSlots();
  if(buf.length>=cur.text.length)finish(buf.join(''),rawWords.join(' '));
}

/* ---------- speech ---------- */
let ph={id:-1,n:0},micState={on:false,label:''},micSrc={k:'',p:null};
function micLabel(){$('mic').classList.toggle('on',micState.on);$('micL').textContent=t(micState.label||(micState.on?'micListening':'micOpen'))}
function micSrcText(){const {k,p}=micSrc;$('micSrc').textContent=!k?'':k==='listeningOn'?t(k,{x:(p&&p.x)||t('defaultMic')}):t(k,p)}
function onPhrase({id,text,alts,final,act,unsure}){
  $('live').textContent=text?'“'+text.trim()+'”':'';
  if(act===false)return;
  if(id!==ph.id)ph={id,n:0};
  const toks=tokens(text);
  if(speaking||performance.now()<ignoreUntil||!running||busy||!cur){ph.n=Math.max(ph.n,toks.length);return}
  if(final){const e=$('err');if(unsure)e.textContent=t('sayAgain');else if(e.textContent===t('sayAgain'))e.textContent=''}
  if(!multi()){
    if(toks.length<=ph.n)return;
    for(const a of alts){const t=tokens(a).slice(ph.n);
      for(let i=t.length-1;i>=0;i--){const g=parseTok(t[i]);if(g&&(g.length===1||g==='NOPE')){ph.n=Math.max(toks.length,ph.n+1);finish(g,t.slice(0,i+1).join(' '));return}}}
    return;
  }
  /* spelling: commit settled words; the last word of a partial result may still change */
  const upto=final?toks.length:toks.length-1;
  for(let i=ph.n;i<upto;i++){ph.n=i+1;spellToken(toks[i]);if(busy){ph.n=toks.length;return}}
}
const mic=createMic({
  audio:()=>player.audio(),
  onPhrase,
  onState:(on,label)=>{micState={on,label};micLabel();if(!on)$('live').textContent=''},
  onError:(k,p)=>{$('err').textContent=t(k,p)},
  onSource:(k,p)=>{micSrc={k,p};micSrcText()}
});

/* ---------- typed answers ---------- */
let proc=0;
function typedToString(v){let s='';for(const t of tokens(v)){const g=parseTok(t);
    if(g==='NOPE')return 'NOPE';if(g&&g.length===1){s+=g;continue}
    const u=t.toUpperCase();if(/^[A-Z0-9.,?/=]+$/.test(u))s+=u}return s}
$('ans').addEventListener('input',()=>{$('err').textContent='';if(multi())return;
  const v=$('ans').value;if(v.length<proc)proc=v.length;const tk=tokens(v.slice(proc));
  for(let i=tk.length-1;i>=0;i--){const g=parseTok(tk[i]);if(g&&(g.length===1||g==='NOPE')){const raw=v.slice(proc);proc=v.length;if(!finish(g,raw)&&!running)$('err').textContent=t('pressStart');return}}});
$('ans').addEventListener('keydown',e=>{if(e.key!=='Enter')return;
  const v=multi()?$('ans').value:$('ans').value.slice(proc);$('ans').value='';proc=0;
  if(!running){$('err').textContent=t('pressStart');return}
  const s=typedToString(v);
  if(!s){$('err').textContent=t('notRecognised');return}
  if(s!=='NOPE'&&!multi())finish(s[s.length-1],v);else finish(s,v)});

/* ---------- controls ---------- */
let paused=false,stateKey='stReady';
function setState(k){stateKey=k;$('state').textContent=k?t(k):''}
function startLabel(){$('startL').textContent=t(running?'pause':'start')}
function start(){player.audio();running=true;paused=false;startLabel();$('start').querySelector('svg').innerHTML='<path d="M8 5v14M16 5v14"/>';next()}
function pause(){running=false;paused=true;clearTimeout(timer);try{speechSynthesis.cancel()}catch(e){}speaking=false;player.stop();busy=false;
  startLabel();$('start').querySelector('svg').innerHTML='<path d="M7 4v16l13-8z"/>';setState('stPaused');$('msg').innerHTML=t('pausedMsg');render()}
$('start').onclick=()=>running?pause():start();
$('rep').onclick=()=>{if(!cur){$('err').textContent=t('pressStart');return}sendCurrent()};
$('nope').onclick=()=>{if(!running){$('err').textContent=t('pressStart');return}finish('NOPE',t('nextBtn'))};
$('mic').onclick=()=>{$('err').textContent='';player.audio();if(mic.on){mic.stop();return}mic.setVocab(vocabFor());mic.start({engine:cfg.engine,micId:cfg.micId})};
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.metaKey||e.ctrlKey)return;const k=e.key.toLowerCase();
  if(k===' '){e.preventDefault();running?pause():start()}else if(k==='r')$('rep').click();else if(k==='n')$('nope').click();else if(k==='m'&&!$('mic').hidden)$('mic').click()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)pause()});

/* ---------- mastery, stats, history ---------- */
function render(){const p=getProg(cfg),o=sequence(cfg);
  $('grid').innerHTML=o.map(c=>{const on=p.active.includes(c),st=p.S[c],s=st.s,pct=st.a?Math.round(s*100):0;
    const col=s<0.4?'var(--red)':s<0.7?'var(--amber)':'var(--green)';
    return `<div class="cell${on?'':' locked'}" title="${NATO[c]}: ${st.ok}/${st.a} correct"><div class="c">${esc(c)}</div><div class="p">${on?(st.a?pct+'%':'new'):'–'}</div>${on?`<div class="bar" style="width:${Math.max(6,s*100)}%;background:${col}"></div>`:''}</div>`}).join('');
  const learned=p.active.filter(c=>p.S[c].s>=cfg.unlock/100&&p.S[c].a>=4).length;
  $('sAcc').textContent=sess.n?Math.round(100*sess.ok/sess.n)+'%':'–';$('sStr').textContent=sess.streak;$('sLrn').textContent=learned+'/'+o.length;$('sN').textContent=sess.n;
  $('setInfo').textContent=$('mSum').textContent=t('inRotation',{a:p.active.length,b:o.length});
  const weak=p.active.filter(c=>p.S[c].a>0&&p.S[c].s<0.6).sort((a,b)=>p.S[a].s-p.S[b].s).slice(0,5);
  $('weak').innerHTML=weak.length?t('drilling')+weak.map(c=>`<b>${esc(c)}</b> ${NATO[c]}`).join(' · '):''}
function renderHist(){const H=cfg.hist||[];
  if(!H.length){$('histBody').innerHTML=`<tr><td colspan="4" class="empty">${t('noAnswers')}</td></tr>`;$('histSum').textContent='';return}
  $('histBody').innerHTML=H.slice().reverse().map(x=>{
    const cls=x.ok?(x.slow?'slow':'ok'):'bad',single=x.c.length===1;
    const sent=single?`${esc(x.c)} <span class="w">${esc(NATO[x.c]||'')}</span>`:esc(x.c);
    const you=x.g==='NOPE'?t('nopeWord'):single?esc(NATO[x.g]||x.g):[...x.g].map((c,i)=>c===x.c[i]?esc(c):`<span class="x">${esc(c)}</span>`).join('');
    return `<tr class="${cls}"><td class="c">${sent}</td><td>${you}${x.raw?`<span class="raw">“${esc(x.raw)}”</span>`:''}</td><td class="res">${x.ok?(x.slow?t('slowWord'):'✓'):'✗'}</td><td class="r">${x.dt}s</td></tr>`}).join('');
  const ok=H.filter(x=>x.ok).length,miss={};
  H.forEach(x=>{if(x.ok)return;[...x.c].forEach((c,i)=>{if(x.g==='NOPE'||x.g[i]!==c)miss[c]=(miss[c]||0)+1})});
  const top=Object.entries(miss).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([c,n])=>c+' ×'+n).join(', ');
  $('histSum').textContent=t('histSum',{n:H.length,p:Math.round(100*ok/H.length)})+(top?t('mostMissed',{x:top}):'')}
function armButton(id,label,confirm,action){let tm;$(id).textContent=t(label);$(id).dataset.label=label;$(id).onclick=()=>{const b=$(id);
  if(!b.classList.contains('arm')){b.classList.add('arm');b.textContent=t(confirm);tm=setTimeout(()=>{b.classList.remove('arm');b.textContent=t(label)},3000);return}
  clearTimeout(tm);b.classList.remove('arm');b.textContent=t(label);action()}}
armButton('histClear','clearHist','confirmClear',()=>{cfg.hist=[];renderHist();persist()});
armButton('resetB','resetProg','confirmReset',()=>{delete cfg.prog[cfg.order];sess={ok:0,n:0,streak:0};cur=null;if(running)pause();render();persist()});

/* ---------- settings ---------- */
let syncKey='device';
function persist(){syncKey=store(cfg)?'saved':'notSaved';$('sync').textContent=t(syncKey)}
const FMT={wpm:v=>v+' wpm',charGap:v=>v===3?'3 (std)':v+'',wordGap:v=>v===7?'7 (std)':v+'',repeats:v=>v===1?'once':v+'×',repeatGap:v=>v+' s',
  hz:v=>v+' Hz',vol:v=>v+'%',slow:v=>v+' s',okPause:v=>v+' s',unlock:v=>v+'%',lenMin:v=>v+'',lenMax:v=>v+'',maxSame:v=>v+'×'};
for(const id in FMT){const el=$(id);el.value=cfg[id];$(id+'O').textContent=FMT[id](cfg[id]);
  el.addEventListener('input',()=>{cfg[id]=+el.value;
    if(id==='lenMin'&&cfg.lenMin>cfg.lenMax){cfg.lenMax=cfg.lenMin;$('lenMax').value=cfg.lenMax;$('lenMaxO').textContent=cfg.lenMax}
    if(id==='lenMax'&&cfg.lenMax<cfg.lenMin){cfg.lenMin=cfg.lenMax;$('lenMin').value=cfg.lenMin;$('lenMinO').textContent=cfg.lenMin}
    $(id+'O').textContent=FMT[id](cfg[id]);persist()})}
$('masteryBox').open=cfg.showMastery;$('masteryBox').addEventListener('toggle',()=>{cfg.showMastery=$('masteryBox').open;persist()});
$('limit').checked=cfg.limit;$('limit').addEventListener('change',()=>{cfg.limit=$('limit').checked;persist()});
function modeUI(){document.querySelectorAll('[data-multi]').forEach(el=>el.hidden=!multi());
  $('ans').placeholder=t(multi()?'phMulti':'phSingle');$('ans').enterKeyHint='done'}
$('mode').value=cfg.mode;$('mode').addEventListener('change',()=>{cfg.mode=$('mode').value;$('ans').value='';proc=0;if(running)pause();cur=null;$('itemNote').textContent='';modeUI();micNote();mic.setVocab(vocabFor());persist()});
$('order').value=cfg.order;$('order').addEventListener('change',()=>{cfg.order=$('order').value;cur=null;if(running)pause();render();persist()});

async function listMics(){const d=await mic.listMics(),sel=$('micDev');
  sel.innerHTML=`<option value="">${esc(t('micAuto'))}</option>`+d.map((x,i)=>`<option value="${esc(x.deviceId)}">${esc(x.label||t('micN',{n:i+1}))}</option>`).join('');
  sel.value=d.some(x=>x.deviceId===cfg.micId)?cfg.micId:''}
function micNote(){
  const off=cfg.engine==='offline';$('micDevRow').hidden=!off;
  if(off){$('mic').hidden=!canCapture;$('micNote').innerHTML=t(canCapture?(multi()?'noteOffline':'noteOfflineChars'):'noteHttps');return}
  if(!hasWebSpeech){$('mic').hidden=true;$('micNote').textContent=t('noteNoSpeech');return}
  if(!window.isSecureContext){$('mic').hidden=true;$('micNote').textContent=t('noteHttps');return}
  $('mic').hidden=false;$('micNote').innerHTML=t('noteBrowser')}
$('engine').value=cfg.engine;$('engine').addEventListener('change',()=>{const was=mic.on;if(was)mic.stop();cfg.engine=$('engine').value;cfg.engineChosen=true;persist();micNote();if(cfg.engine==='offline')listMics();if(was)$('err').textContent=t('recChanged')});
$('micDev').addEventListener('change',()=>{cfg.micId=$('micDev').value;persist();if(mic.on&&cfg.engine==='offline')$('err').textContent=t('switchInputs')});
if(navigator.mediaDevices&&navigator.mediaDevices.addEventListener)navigator.mediaDevices.addEventListener('devicechange',()=>{if(cfg.engine==='offline')listMics()});

/* ---------- language ---------- */
function relabel(){
  applyStatic();startLabel();setState(stateKey);micLabel();micSrcText();modeUI();micNote();render();renderHist();
  $('sync').textContent=t(syncKey);['histClear','resetB'].forEach(id=>{if(!$(id).classList.contains('arm'))$(id).textContent=t($(id).dataset.label)});
  if(!running)$('msg').innerHTML=t(paused?'pausedMsg':'intro');else if(cur&&!busy)$('itemNote').textContent=cur.note?t(cur.note):'';
  if(cfg.engine==='offline')listMics();
  langUI();themeUI();
}
function langUI(){document.querySelectorAll('#langs button').forEach(b=>b.classList.toggle('on',b.dataset.lang===getLang()))}
document.querySelectorAll('#langs button').forEach(b=>b.onclick=()=>{cfg.lang=b.dataset.lang;setLang(cfg.lang);persist();relabel()});

$('helpBtn').onclick=()=>{$('helpBox').open=true;$('helpBox').scrollIntoView({behavior:'smooth',block:'start'})};

/* ---------- theme ---------- */
const SUN='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
const MOON='<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
function themeUI(){document.documentElement.dataset.theme=cfg.theme;const dark=cfg.theme==='dark';
  $('themeIcon').innerHTML=dark?SUN:MOON;$('themeBtn').title=$('themeBtn').ariaLabel=t(dark?'toLight':'toDark')}
$('themeBtn').onclick=()=>{cfg.theme=cfg.theme==='dark'?'light':'dark';persist();themeUI()};

relabel();
