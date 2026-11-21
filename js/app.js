import {MORSE,NATO,LOOKUP,NOPE,CMD} from './data.js?v=2';
import {createPlayer} from './morse.js?v=2';
import {load,save as store} from './storage.js?v=2';
import {sequence,getProg,nextItem,score,maybeUnlock} from './exercises.js?v=2';
import {createMic,hasWebSpeech,canCapture} from './recognizer.js?v=2';

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cfg=load();
const player=createPlayer($('led'));

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
  $('pat').textContent='';$('state').textContent='listening';$('itemNote').textContent=cur.note||'';
  if(multi()){showSlots();$('msg').innerHTML=`Spell it: <b>${cur.text.length}</b> characters`}
  else{setBig('?','wait',1);$('msg').innerHTML='What was that?'}
  sendCurrent();render();
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
    $('msg').innerHTML=ok?(fast?`<b>${NATO[target]}</b> — correct`:`<b>${NATO[target]}</b> — correct, but slow (${dt.toFixed(1)} s)`)
      :(given==='NOPE'?'It was ':`Not ${esc(NATO[given]||given)}. It was `)+`<b>${NATO[target]}</b>`;
  }else{
    setBig([...target].map((c,i)=>`<span class="${given!=='NOPE'&&given[i]===c?'g':'b'}">${esc(c)}</span>`).join(''),'',target.length);
    $('msg').innerHTML=ok?(fast?`<b>${esc(target)}</b> — correct`:`<b>${esc(target)}</b> — correct, but slow (${dt.toFixed(1)} s)`)
      :(given==='NOPE'?'It was ':`You spelled <b>${esc(given)}</b>. It was `)+`<b>${esc(target)}</b>`;
  }
  const nc=maybeUnlock(cfg);if(nc)$('msg').innerHTML+=` · <span style="color:var(--amber)">New character: <b>${esc(nc)}</b> ${NATO[nc]}</span>`;
  $('state').textContent='';render();renderHist();persist();
  const after=()=>nc?introNew(nc,next):schedule(next,ok?0:600);
  if(!ok)say(spell(target),after);else schedule(after,target.length>1?1400:1000);
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
let ph={id:-1,n:0};
function onPhrase({id,text,alts,final}){
  $('live').textContent=text?'“'+text.trim()+'”':'';
  if(id!==ph.id)ph={id,n:0};
  const toks=tokens(text);
  if(speaking||performance.now()<ignoreUntil||!running||busy||!cur){ph.n=Math.max(ph.n,toks.length);return}
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
  onState:(on,label)=>{$('mic').classList.toggle('on',on);$('micL').textContent=label||(on?'Mic open — listening':'Open mic');if(!on)$('live').textContent=''},
  onError:m=>{$('err').textContent=m},
  onSource:t=>{$('micSrc').textContent=t}
});

/* ---------- typed answers ---------- */
let proc=0;
function typedToString(v){let s='';for(const t of tokens(v)){const g=parseTok(t);
    if(g==='NOPE')return 'NOPE';if(g&&g.length===1){s+=g;continue}
    const u=t.toUpperCase();if(/^[A-Z0-9.,?/=]+$/.test(u))s+=u}return s}
$('ans').addEventListener('input',()=>{$('err').textContent='';if(multi())return;
  const v=$('ans').value;if(v.length<proc)proc=v.length;const t=tokens(v.slice(proc));
  for(let i=t.length-1;i>=0;i--){const g=parseTok(t[i]);if(g&&(g.length===1||g==='NOPE')){const raw=v.slice(proc);proc=v.length;if(!finish(g,raw)&&!running)$('err').textContent='Press Start first.';return}}});
$('ans').addEventListener('keydown',e=>{if(e.key!=='Enter')return;
  const v=multi()?$('ans').value:$('ans').value.slice(proc);$('ans').value='';proc=0;
  if(!running){$('err').textContent='Press Start first.';return}
  const s=typedToString(v);
  if(!s){$('err').textContent='Didn’t recognise that. Try Kilo, Two, Stop, plain letters, or nope.';return}
  if(s!=='NOPE'&&!multi())finish(s[s.length-1],v);else finish(s,v)});

/* ---------- controls ---------- */
function start(){player.audio();running=true;$('startL').textContent='Pause';$('start').querySelector('svg').innerHTML='<path d="M8 5v14M16 5v14"/>';next()}
function pause(){running=false;clearTimeout(timer);try{speechSynthesis.cancel()}catch(e){}speaking=false;player.stop();busy=false;
  $('startL').textContent='Start';$('start').querySelector('svg').innerHTML='<path d="M7 4v16l13-8z"/>';$('state').textContent='paused';$('msg').innerHTML='Paused. Press <b>Start</b> to continue.';render()}
$('start').onclick=()=>running?pause():start();
$('rep').onclick=()=>{if(!cur){$('err').textContent='Press Start first.';return}sendCurrent()};
$('nope').onclick=()=>{if(!running){$('err').textContent='Press Start first.';return}finish('NOPE','Nope button')};
$('mic').onclick=()=>{$('err').textContent='';player.audio();if(mic.on){mic.stop();return}mic.start({engine:cfg.engine,micId:cfg.micId})};
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.metaKey||e.ctrlKey)return;const k=e.key.toLowerCase();
  if(k===' '){e.preventDefault();running?pause():start()}else if(k==='r')$('rep').click();else if(k==='n')$('nope').click();else if(k==='m'&&!$('mic').hidden)$('mic').click()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)pause()});

/* ---------- mastery, stats, history ---------- */
function render(){const p=getProg(cfg),o=sequence(cfg);
  $('grid').innerHTML=o.map(c=>{const on=p.active.includes(c),st=p.S[c],s=st.s,pct=st.a?Math.round(s*100):0;
    const col=s<0.4?'var(--red)':s<0.7?'var(--amber)':'var(--green)';
    return `<div class="cell${on?'':' locked'}${cur&&running&&cur.text.includes(c)?' cur':''}" title="${NATO[c]}: ${st.ok}/${st.a} correct"><div class="c">${esc(c)}</div><div class="p">${on?(st.a?pct+'%':'new'):'–'}</div>${on?`<div class="bar" style="width:${Math.max(6,s*100)}%;background:${col}"></div>`:''}</div>`}).join('');
  const learned=p.active.filter(c=>p.S[c].s>=cfg.unlock/100&&p.S[c].a>=4).length;
  $('sAcc').textContent=sess.n?Math.round(100*sess.ok/sess.n)+'%':'–';$('sStr').textContent=sess.streak;$('sLrn').textContent=learned+'/'+o.length;$('sN').textContent=sess.n;
  $('setInfo').textContent=`${p.active.length} of ${o.length} in rotation`;
  const weak=p.active.filter(c=>p.S[c].a>0&&p.S[c].s<0.6).sort((a,b)=>p.S[a].s-p.S[b].s).slice(0,5);
  $('weak').innerHTML=weak.length?'Drilling most: '+weak.map(c=>`<b>${esc(c)}</b> ${NATO[c]}`).join(' · '):''}
function renderHist(){const H=cfg.hist||[];
  if(!H.length){$('histBody').innerHTML='<tr><td colspan="4" class="empty">No answers yet.</td></tr>';$('histSum').textContent='';return}
  $('histBody').innerHTML=H.slice().reverse().map(x=>{
    const cls=x.ok?(x.slow?'slow':'ok'):'bad',single=x.c.length===1;
    const sent=single?`${esc(x.c)} <span class="w">${esc(NATO[x.c]||'')}</span>`:esc(x.c);
    const you=x.g==='NOPE'?'nope':single?esc(NATO[x.g]||x.g):[...x.g].map((c,i)=>c===x.c[i]?esc(c):`<span class="x">${esc(c)}</span>`).join('');
    return `<tr class="${cls}"><td class="c">${sent}</td><td>${you}${x.raw?`<span class="raw">“${esc(x.raw)}”</span>`:''}</td><td class="res">${x.ok?(x.slow?'slow':'✓'):'✗'}</td><td class="r">${x.dt}s</td></tr>`}).join('');
  const ok=H.filter(x=>x.ok).length,miss={};
  H.forEach(x=>{if(x.ok)return;[...x.c].forEach((c,i)=>{if(x.g==='NOPE'||x.g[i]!==c)miss[c]=(miss[c]||0)+1})});
  const top=Object.entries(miss).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([c,n])=>c+' ×'+n).join(', ');
  $('histSum').textContent=`${H.length} answers · ${Math.round(100*ok/H.length)}% correct`+(top?` · most missed: ${top}`:'')}
function armButton(id,label,confirm,action){let t;$(id).onclick=()=>{const b=$(id);
  if(!b.classList.contains('arm')){b.classList.add('arm');b.textContent=confirm;t=setTimeout(()=>{b.classList.remove('arm');b.textContent=label},3000);return}
  clearTimeout(t);b.classList.remove('arm');b.textContent=label;action()}}
armButton('histClear','Clear history','Tap again to clear',()=>{cfg.hist=[];renderHist();persist()});
armButton('resetB','Reset progress for this character set','Tap again to confirm reset',()=>{delete cfg.prog[cfg.order];sess={ok:0,n:0,streak:0};cur=null;if(running)pause();render();persist()});

/* ---------- settings ---------- */
function persist(){$('sync').textContent=store(cfg)?'saved':'not saved'}
const FMT={wpm:v=>v+' wpm',charGap:v=>v===3?'3 (std)':v+'',wordGap:v=>v===7?'7 (std)':v+'',repeats:v=>v===1?'once':v+'×',repeatGap:v=>v+' s',
  hz:v=>v+' Hz',vol:v=>v+'%',slow:v=>v+' s',unlock:v=>v+'%',lenMin:v=>v+'',lenMax:v=>v+'',maxSame:v=>v+'×'};
for(const id in FMT){const el=$(id);el.value=cfg[id];$(id+'O').textContent=FMT[id](cfg[id]);
  el.addEventListener('input',()=>{cfg[id]=+el.value;
    if(id==='lenMin'&&cfg.lenMin>cfg.lenMax){cfg.lenMax=cfg.lenMin;$('lenMax').value=cfg.lenMax;$('lenMaxO').textContent=cfg.lenMax}
    if(id==='lenMax'&&cfg.lenMax<cfg.lenMin){cfg.lenMin=cfg.lenMax;$('lenMin').value=cfg.lenMin;$('lenMinO').textContent=cfg.lenMin}
    $(id+'O').textContent=FMT[id](cfg[id]);persist()})}
$('limit').checked=cfg.limit;$('limit').addEventListener('change',()=>{cfg.limit=$('limit').checked;persist()});
function modeUI(){document.querySelectorAll('[data-multi]').forEach(el=>el.hidden=!multi());
  $('ans').placeholder=multi()?'Type KMRS or kilo mike, then Enter':'Or type: kilo, two, stop…';$('ans').enterKeyHint='done'}
$('mode').value=cfg.mode;$('mode').addEventListener('change',()=>{cfg.mode=$('mode').value;$('ans').value='';proc=0;if(running)pause();cur=null;$('itemNote').textContent='';modeUI();persist()});
$('order').value=cfg.order;$('order').addEventListener('change',()=>{cfg.order=$('order').value;cur=null;if(running)pause();render();persist()});

async function listMics(){const d=await mic.listMics(),sel=$('micDev');
  sel.innerHTML='<option value="">Auto (earbuds if found)</option>'+d.map((x,i)=>`<option value="${esc(x.deviceId)}">${esc(x.label||'Microphone '+(i+1))}</option>`).join('');
  sel.value=d.some(x=>x.deviceId===cfg.micId)?cfg.micId:''}
function micNote(){
  const off=cfg.engine==='offline';$('micDevRow').hidden=!off;
  if(off){$('mic').hidden=!canCapture;$('micNote').innerHTML=canCapture?'Offline recogniser: listens only for phonetic words, numbers, “nope”, “over” and “correction”. Choose the mic in Settings → Mic input.':'The mic needs this page served over https://.';return}
  if(!hasWebSpeech){$('mic').hidden=true;$('micNote').textContent='This browser has no speech service. Switch Settings → Recogniser to Offline.';return}
  if(!window.isSecureContext){$('mic').hidden=true;$('micNote').textContent='The mic needs this page served over https://.';return}
  $('mic').hidden=false;$('micNote').innerHTML='Tap <b>Open mic</b> once and keep talking — it reopens by itself after pauses. Headphones help, so the mic doesn’t hear the tone.'}
$('engine').value=cfg.engine;$('engine').addEventListener('change',()=>{const was=mic.on;if(was)mic.stop();cfg.engine=$('engine').value;persist();micNote();if(cfg.engine==='offline')listMics();if(was)$('err').textContent='Recogniser changed. Tap Open mic again.'});
$('micDev').addEventListener('change',()=>{cfg.micId=$('micDev').value;persist();if(mic.on&&cfg.engine==='offline')$('err').textContent='Turn the mic off and on again to switch inputs.'});
if(navigator.mediaDevices&&navigator.mediaDevices.addEventListener)navigator.mediaDevices.addEventListener('devicechange',()=>{if(cfg.engine==='offline')listMics()});

modeUI();micNote();if(cfg.engine==='offline')listMics();render();renderHist();
