/* Two speech engines with one interface:
   onPhrase({id, text, alts, final}) — text so far for the current phrase (replaces the last one with the same id)
   onState(on, labelKey) · onError(key, params) · onSource(key, params) — keys are looked up in i18n.js */

const VOSK_JS='https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/dist/vosk.js';
const MODEL_URL='https://raw.githubusercontent.com/ccoreilly/vosk-browser/gh-pages/models/vosk-model-small-en-us-0.15.tar.gz';
export const GRAMMAR=['alpha','alfa','bravo','charlie','delta','echo','foxtrot','golf','hotel','india','juliet','kilo','lima','mike','november','oscar','papa','quebec','romeo','sierra','tango','uniform','victor','whiskey','x ray','yankee','zulu',
  'zero','one','two','three','four','five','six','seven','eight','nine','niner','stop','comma','question','slash','break',
  'next','nope','pass','skip','over','done','correction','back'];
const MIN_CONF=0.6;   /* offline: words heard with lower confidence are dropped and the user is asked to repeat */
const BT=/bluetooth|buds|airpods|hands-?free|\bsco\b/i;

export const hasWebSpeech=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
export const canCapture=!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.isSecureContext);

export function createMic({onPhrase,onState,onError,onSource,audio}){
  let on=false,engine='browser',micId='',phraseId=0,vocab=GRAMMAR,rate=48000;

  /* ----- engine 1: the phone's own speech service ----- */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  let rec=null,lastIdx=-1,restarts=0,lastStart=0;
  function srStart(){
    rec=new SR();rec.lang='en-US';rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=5;
    lastIdx=-1;lastStart=Date.now();phraseId++;
    rec.onstart=()=>onState(true);
    rec.onresult=e=>{const i=e.results.length-1,r=e.results[i];if(i!==lastIdx){lastIdx=i;phraseId++}
      onPhrase({id:phraseId,text:r[0].transcript,alts:Array.from(r).map(x=>x.transcript),final:r.isFinal});restarts=0};
    rec.onerror=ev=>{const c=ev.error;
      if(c==='not-allowed'||c==='service-not-allowed'){on=false;onState(false);onError('errBlockedReload')}
      else if(c==='audio-capture'){on=false;onState(false);onError('errNoMic')}
      else if(c==='network')onError('errNetwork')};
    rec.onend=()=>{if(!on){onState(false);return}
      if(Date.now()-lastStart<1000)restarts++;
      if(restarts>5){on=false;onState(false);onError('errClosing');return}
      setTimeout(()=>{if(on&&engine==='browser')try{srStart()}catch(e){on=false;onState(false)}},restarts?600:100)};
    try{rec.start()}catch(e){}
  }
  function srStop(){try{rec&&rec.stop()}catch(e){}}

  /* ----- engine 2: offline Vosk on a mic the page picks ----- */
  let model=null,loading=null,stream=null,src=null,proc=null,mute=null,vrec=null;
  function loadScript(s){return new Promise((res,rej)=>{if(window.Vosk)return res();const el=document.createElement('script');el.src=s;el.onload=res;el.onerror=()=>rej(new Error('could not load the recogniser'));document.head.appendChild(el)})}
  function getModel(){
    if(model)return Promise.resolve(model);
    if(!loading)loading=(async()=>{
      onState(true,'micLoadingRec');await loadScript(VOSK_JS);
      onState(true,'micLoadingModel');onSource('modelDownload');
      model=await window.Vosk.createModel(MODEL_URL);return model})().catch(e=>{loading=null;throw e});
    return loading;
  }
  async function listMics(){
    try{return (await navigator.mediaDevices.enumerateDevices()).filter(x=>x.kind==='audioinput')}catch(e){return []}
  }
  const openStream=id=>navigator.mediaDevices.getUserMedia({audio:Object.assign({echoCancellation:true,noiseSuppression:true,autoGainControl:true,channelCount:1},id?{deviceId:{exact:id}}:{})});
  async function voskStart(){
    const m=await getModel();if(!on)return;
    onState(true,'micOpening');
    let s=null;
    if(micId){try{s=await openStream(micId)}catch(e){s=null}}
    if(!s){s=await openStream(null);
      if(!micId){const d=await listMics(),bt=d.find(x=>BT.test(x.label)),cur=(s.getAudioTracks()[0]||{}).label||'';
        if(bt&&!BT.test(cur)){try{const s2=await openStream(bt.deviceId);s.getTracks().forEach(t=>t.stop());s=s2}catch(e){}}}}
    if(!on){s.getTracks().forEach(t=>t.stop());return}
    stream=s;const ac=audio();rate=ac.sampleRate;
    vrec=makeRec(m);
    src=ac.createMediaStreamSource(s);proc=ac.createScriptProcessor(4096,1,1);mute=ac.createGain();mute.gain.value=0;
    proc.onaudioprocess=e=>{if(on&&vrec)try{vrec.acceptWaveform(e.inputBuffer)}catch(err){}};
    src.connect(proc);proc.connect(mute);mute.connect(ac.destination);
    onState(true);onSource('listeningOn',{x:((s.getAudioTracks()[0]||{}).label)||''});
    s.getAudioTracks()[0].onended=()=>{if(on){on=false;voskStop();onState(false);onError('errDisconnected')}};
  }
  /* recogniser limited to the current word list; partial results are only shown, final ones carry confidence */
  function makeRec(m){
    const r=new m.KaldiRecognizer(rate,JSON.stringify(vocab.concat('[unk]')));
    try{r.setWords(true)}catch(e){}
    phraseId++;
    r.on('partialresult',msg=>{const t=(msg.result&&msg.result.partial)||'';if(t)onPhrase({id:phraseId,text:t,alts:[t],final:false,act:false})});
    r.on('result',msg=>{const res=msg.result||{},ws=res.result||[];let text=res.text||'',unsure=false;
      if(ws.length){const good=ws.filter(w=>w.word!=='[unk]'&&!(w.conf<MIN_CONF));unsure=good.length<ws.length;text=good.map(w=>w.word).join(' ')}
      else if(text.includes('[unk]')){unsure=true;text=text.replace(/\[unk\]/g,' ').trim()}
      if(text||unsure)onPhrase({id:phraseId,text,alts:[text],final:true,unsure});phraseId++});
    return r;
  }
  function voskStop(){
    try{proc&&(proc.onaudioprocess=null);src&&src.disconnect();proc&&proc.disconnect();mute&&mute.disconnect()}catch(e){}
    try{vrec&&vrec.remove()}catch(e){}
    if(stream)stream.getTracks().forEach(t=>t.stop());stream=src=proc=mute=vrec=null;onSource('');
  }

  return {
    get on(){return on},
    listMics,
    /* words the offline recogniser may hear; rebuilt on the fly when the list changes */
    setVocab(list){const v=list&&list.length?list:GRAMMAR;if(v.join('|')===vocab.join('|'))return;vocab=v;
      if(vrec&&model){try{vrec.remove()}catch(e){}vrec=makeRec(model)}},
    async start(opts){
      engine=opts.engine;micId=opts.micId||'';on=true;restarts=0;onState(true,'micRequesting');
      if(engine==='offline'){
        try{await voskStart()}catch(e){const was=on;this.stop();
          if(was){if(e&&e.name==='NotAllowedError')onError('errBlocked');
            else if(e&&(e.name==='OverconstrainedError'||e.name==='NotFoundError'))onError('errMicUnavailable');
            else onError('errOffline',{x:String((e&&(e.message||e.name))||e)})}}
      }else srStart();
    },
    stop(){on=false;srStop();voskStop();onState(false)}
  };
}
