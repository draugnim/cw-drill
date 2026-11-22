import {MORSE} from './data.js?v=5';

/* Simulated band conditions, all generated in the browser:
   noise  – receiver hiss in a ~500 Hz passband around the tone
   qsb    – the wanted signal slowly fading in and out
   qrn    – random static crashes
   qrm    – a second CW station on a nearby pitch sending random text
   Levels are 0–100 (0 = off). "when": 'send' = only around each sending, 'always' = while the drill runs. */
export function createBand(){
  let ctx=null,n=null,running=false,until=0,qrnT=null,qrmT=null,qOff=250;
  const o={noise:0,qsb:0,qrn:0,qrm:0,hz:600,vol:50,when:'send'};
  const amp=()=>o.vol/100*0.6;
  const on=()=>running||(ctx&&ctx.currentTime<until);

  function build(c){
    ctx=c;
    const lim=ctx.createDynamicsCompressor();   /* keeps tone + noise from clipping */
    lim.threshold.value=-6;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=0.003;lim.release.value=0.1;lim.connect(ctx.destination);
    /* wanted signal goes through a gain modulated by a slow LFO (fading) */
    const fade=ctx.createGain();fade.connect(lim);
    const lfo=ctx.createOscillator();lfo.frequency.value=0.07+Math.random()*0.12;
    const lfoAmt=ctx.createGain();lfoAmt.gain.value=0;lfo.connect(lfoAmt).connect(fade.gain);lfo.start();
    /* everything else goes through one background bus that is opened and closed */
    const bg=ctx.createGain();bg.gain.value=0;bg.connect(lim);
    const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    const noiseSrc=()=>{const s=ctx.createBufferSource();s.buffer=buf;s.loop=true;s.start(0,Math.random()*2);return s};
    const hiss=ctx.createBiquadFilter();hiss.type='bandpass';const hissG=ctx.createGain();hissG.gain.value=0;
    noiseSrc().connect(hiss).connect(hissG).connect(bg);
    const crashF=ctx.createBiquadFilter();crashF.type='lowpass';crashF.frequency.value=2500;const crashG=ctx.createGain();crashG.gain.value=0;
    noiseSrc().connect(crashF).connect(crashG).connect(bg);
    const qOsc=ctx.createOscillator();const qKey=ctx.createGain();qKey.gain.value=0;qOsc.connect(qKey).connect(bg);qOsc.start();
    n={lim,fade,lfoAmt,bg,hiss,hissG,crashG,qOsc,qKey};
    apply();
  }
  function setBg(v,at){if(!n)return;const t=Math.max(ctx.currentTime,at||0);n.bg.gain.cancelScheduledValues(t);n.bg.gain.setTargetAtTime(v,t,0.06)}
  function apply(){
    if(!n)return;const t=ctx.currentTime,depth=o.qsb/100*0.45;
    n.fade.gain.setValueAtTime(1-depth,t);n.lfoAmt.gain.setValueAtTime(depth,t);
    n.hiss.frequency.setValueAtTime(o.hz,t);n.hiss.Q.setValueAtTime(o.hz/500,t);
    n.hissG.gain.setTargetAtTime(o.noise/100*amp()*4,t,0.05);
    n.qOsc.frequency.setValueAtTime(o.hz+qOff,t);
    if(o.when==='always')setBg(running?1:0);
    loops();
  }
  function loops(){if(!n)return;if(!qrnT&&o.qrn&&on())qrnTick();if(!qrmT&&o.qrm&&on())qrmTick()}

  /* static crashes: short bursts of wideband noise with a fast decay, now and then a long one */
  function qrnTick(){
    qrnT=null;if(!n||!o.qrn||!on())return;
    if(Math.random()<0.03+o.qrn/100*0.16){
      const t=ctx.currentTime+0.01,g=n.crashG.gain,pk=amp()*o.qrn/100*(1.5+Math.random()*3),len=Math.random()<0.15?0.25+Math.random()*0.5:0.02+Math.random()*0.1;
      g.cancelScheduledValues(t);g.setValueAtTime(pk,t);g.exponentialRampToValueAtTime(0.0005,t+len);g.setValueAtTime(0,t+len+0.01);
    }
    qrnT=setTimeout(qrnTick,90);
  }
  /* interfering station: random words or groups at its own speed and pitch */
  const QRM_WORDS=['CQ','TEST','5NN','TU','QRZ','DE','73','UR','RST','K','BK','QSL','GM','FB','OM'];
  const QRM_LET='ETAOINSHRDLUCMWFGYPBVKJXQZ0123456789';
  function qrmTick(){
    qrmT=null;if(!n||!o.qrm||!on())return;
    if(Math.random()<0.1){qOff=(Math.random()<0.5?-1:1)*(180+Math.random()*240);n.qOsc.frequency.setTargetAtTime(o.hz+qOff,ctx.currentTime,0.3)}
    let txt='';if(Math.random()<0.5)txt=QRM_WORDS[Math.floor(Math.random()*QRM_WORDS.length)];
    else{const k=2+Math.floor(Math.random()*3);for(let i=0;i<k;i++)txt+=QRM_LET[Math.floor(Math.random()*QRM_LET.length)]}
    const u=1.2/(16+Math.random()*14),a=amp()*o.qrm/100*0.7,g=n.qKey.gain,r=0.005;let t=ctx.currentTime+0.05;
    for(const ch of txt){const code=MORSE[ch];if(!code)continue;
      for(let i=0;i<code.length;i++){const d=code[i]==='.'?u:3*u;
        g.setValueAtTime(0,t);g.linearRampToValueAtTime(a,t+r);g.setValueAtTime(a,t+d-r);g.linearRampToValueAtTime(0,t+d);t+=d+(i<code.length-1?u:0)}
      t+=3*u}
    qrmT=setTimeout(qrmTick,((t-ctx.currentTime)+0.4+Math.random()*1.6)*1000);
  }

  return {
    /* called by the player once the AudioContext exists; returns the node the tone should connect to */
    attach(c){if(!n)build(c);return n.fade},
    config(c){Object.assign(o,{noise:c.noise,qsb:c.qsb,qrn:c.qrn,qrm:c.qrm,hz:c.hz,vol:c.vol,when:c.bandWhen});
      if(n&&o.when==='send'&&!(ctx.currentTime<until))setBg(0);apply()},
    /* drill started / paused */
    run(v){running=v;if(!n)return;if(o.when==='always')setBg(v?1:0);
      if(!v){const t=ctx.currentTime;n.qKey.gain.cancelScheduledValues(t);n.qKey.gain.setValueAtTime(0,t);n.crashG.gain.cancelScheduledValues(t);n.crashG.gain.setValueAtTime(0,t)}
      loops()},
    /* one sending from t0 to t1 (AudioContext time): in 'send' mode the background is heard around it */
    window(t0,t1){if(!n)return;until=Math.max(until,t1+0.3);
      if(o.when==='send'&&(o.noise||o.qrn||o.qrm)){setBg(1,t0-0.35);n.bg.gain.setTargetAtTime(0,t1+0.15,0.08)}
      loops()},
    /* sending stopped early (answered before it finished) */
    cut(){if(!n)return;until=0;if(o.when==='send')setBg(0)}
  };
}
