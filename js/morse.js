import {MORSE} from './data.js?v=2';

/* Sidetone player. Timing in "dits" at the character speed:
   dit 1, dah 3, gap inside a character 1, between characters charGap (standard 3),
   between words wordGap (standard 7). Larger gaps = Farnsworth-style spacing. */
export function createPlayer(led){
  let ctx=null,osc=null,timers=[];
  function audio(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx}
  function stop(){try{osc&&osc.stop()}catch(e){}osc=null;timers.forEach(clearTimeout);timers=[];led&&led.classList.remove('on')}
  /* returns performance.now() timestamps: end of the first sending and end of the last repeat */
  function play(text,o){
    stop();const c=audio(),u=1.2/o.wpm,r=0.005,amp=o.vol/100*0.6;
    osc=c.createOscillator();const g=c.createGain();osc.frequency.value=o.hz;g.gain.value=0;osc.connect(g).connect(c.destination);
    const t0=c.currentTime+0.08;let t=t0,firstEnd=t0;
    const words=String(text).split(' ').filter(Boolean);
    const reps=Math.max(1,o.repeats||1);
    for(let rep=0;rep<reps;rep++){
      words.forEach((w,wi)=>{
        [...w].forEach((ch,ci)=>{
          const code=MORSE[ch];if(!code)return;
          [...code].forEach((e,ei)=>{
            const d=e==='.'?u:3*u;
            g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(amp,t+r);g.gain.setValueAtTime(amp,t+d-r);g.gain.linearRampToValueAtTime(0,t+d);
            if(led){const on=(t-c.currentTime)*1000,off=(t+d-c.currentTime)*1000;timers.push(setTimeout(()=>led.classList.add('on'),on),setTimeout(()=>led.classList.remove('on'),off))}
            t+=d;if(ei<code.length-1)t+=u;
          });
          if(ci<w.length-1)t+=o.charGap*u;
        });
        if(wi<words.length-1)t+=o.wordGap*u;
      });
      if(rep===0)firstEnd=t;
      if(rep<reps-1)t+=Math.max(o.repeatGap||1,o.wordGap*u);
    }
    osc.start(t0-0.01);osc.stop(t+0.05);
    const now=performance.now(),base=c.currentTime;
    return {firstEnd:now+(firstEnd-base)*1000,end:now+(t-base)*1000};
  }
  return {audio,play,stop};
}
