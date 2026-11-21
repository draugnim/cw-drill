/* Two speech engines with one interface:
   onPhrase({id, text, alts, final}) — text so far for the current phrase (replaces the last one with the same id)
   onState(on, label) · onError(message) · onSource(label) */

const VOSK_JS='https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/dist/vosk.js';
const MODEL_URL='https://raw.githubusercontent.com/ccoreilly/vosk-browser/gh-pages/models/vosk-model-small-en-us-0.15.tar.gz';
const GRAMMAR=['alpha','alfa','bravo','charlie','delta','echo','foxtrot','golf','hotel','india','juliet','kilo','lima','mike','november','oscar','papa','quebec','romeo','sierra','tango','uniform','victor','whiskey','x ray','yankee','zulu',
  'zero','one','two','three','four','five','six','seven','eight','nine','niner','stop','comma','question','slash','break',
  'nope','no','pass','skip','over','done','correction','back','[unk]'];
const BT=/bluetooth|buds|airpods|hands-?free|\bsco\b/i;

export const hasWebSpeech=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
export const canCapture=!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.isSecureContext);

export function createMic({onPhrase,onState,onError,onSource,audio}){
  let on=false,engine='browser',micId='',phraseId=0;

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
      if(c==='not-allowed'||c==='service-not-allowed'){on=false;onState(false);onError('Microphone blocked. Allow it for this site in the browser’s Site settings → Microphone, then reload.')}
      else if(c==='audio-capture'){on=false;onState(false);onError('No microphone found, or another app is using it.')}
      else if(c==='network')onError('Speech recognition needs an internet connection. Retrying…')};
    rec.onend=()=>{if(!on){onState(false);return}
      if(Date.now()-lastStart<1000)restarts++;
      if(restarts>5){on=false;onState(false);onError('The mic keeps closing. Tap Open mic to try again.');return}
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
      onState(true,'Loading recogniser…');await loadScript(VOSK_JS);
      onState(true,'Loading speech model…');onSource('First time only: downloading the 40 MB speech model. Later visits load it from this device.');
      model=await window.Vosk.createModel(MODEL_URL);return model})().catch(e=>{loading=null;throw e});
    return loading;
  }
  async function listMics(){
    try{return (await navigator.mediaDevices.enumerateDevices()).filter(x=>x.kind==='audioinput')}catch(e){return []}
  }
  const openStream=id=>navigator.mediaDevices.getUserMedia({audio:Object.assign({echoCancellation:true,noiseSuppression:true,autoGainControl:true,channelCount:1},id?{deviceId:{exact:id}}:{})});
  async function voskStart(){
    const m=await getModel();if(!on)return;
    onState(true,'Opening mic…');
    let s=null;
    if(micId){try{s=await openStream(micId)}catch(e){s=null}}
    if(!s){s=await openStream(null);
      if(!micId){const d=await listMics(),bt=d.find(x=>BT.test(x.label)),cur=(s.getAudioTracks()[0]||{}).label||'';
        if(bt&&!BT.test(cur)){try{const s2=await openStream(bt.deviceId);s.getTracks().forEach(t=>t.stop());s=s2}catch(e){}}}}
    if(!on){s.getTracks().forEach(t=>t.stop());return}
    stream=s;const ac=audio();
    vrec=new m.KaldiRecognizer(ac.sampleRate,JSON.stringify(GRAMMAR));phraseId++;
    vrec.on('partialresult',msg=>{const t=(msg.result&&msg.result.partial)||'';if(t)onPhrase({id:phraseId,text:t,alts:[t],final:false})});
    vrec.on('result',msg=>{const t=(msg.result&&msg.result.text)||'';onPhrase({id:phraseId,text:t,alts:[t],final:true});phraseId++});
    src=ac.createMediaStreamSource(s);proc=ac.createScriptProcessor(4096,1,1);mute=ac.createGain();mute.gain.value=0;
    proc.onaudioprocess=e=>{if(on&&vrec)try{vrec.acceptWaveform(e.inputBuffer)}catch(err){}};
    src.connect(proc);proc.connect(mute);mute.connect(ac.destination);
    onState(true);onSource('Listening on: '+(((s.getAudioTracks()[0]||{}).label)||'default mic'));
    s.getAudioTracks()[0].onended=()=>{if(on){on=false;voskStop();onState(false);onError('The mic was disconnected.')}};
  }
  function voskStop(){
    try{proc&&(proc.onaudioprocess=null);src&&src.disconnect();proc&&proc.disconnect();mute&&mute.disconnect()}catch(e){}
    try{vrec&&vrec.remove()}catch(e){}
    if(stream)stream.getTracks().forEach(t=>t.stop());stream=src=proc=mute=vrec=null;onSource('');
  }

  return {
    get on(){return on},
    listMics,
    async start(opts){
      engine=opts.engine;micId=opts.micId||'';on=true;restarts=0;onState(true,'Requesting mic…');
      if(engine==='offline'){
        try{await voskStart()}catch(e){const was=on;this.stop();
          if(was)onError(e&&e.name==='NotAllowedError'?'Microphone blocked. Allow it for this site in the browser’s Site settings → Microphone.':
            (e&&(e.name==='OverconstrainedError'||e.name==='NotFoundError'))?'That mic isn’t available. Pick another in Settings → Mic input.':
            'Couldn’t start the offline recogniser ('+((e&&(e.message||e.name))||e)+').')}
      }else srStart();
    },
    stop(){on=false;srStop();voskStop();onState(false)}
  };
}
