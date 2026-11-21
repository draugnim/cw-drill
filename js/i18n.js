/* Interface text. English, Serbian ijekavian in Latin script, and Cyrillic generated from the Latin.
   In Serbian strings, [[...]] marks text that must stay as is (phonetic words, button names, units). */
const EN={
  sub:'Hear it, say it. Weak characters come back more often.',
  device:'this device',saved:'saved',notSaved:'not saved',
  stReady:'ready',stListening:'listening',stPaused:'paused',
  intro:'Press <b>Start</b>, then answer with phonetic names, or say <b>nope</b>.',
  start:'Start',pause:'Pause',replay:'Replay',next:'Next',nextTitle:'Skip — counts as a miss and tells you the answer',
  phSingle:'Or type: kilo, two, stop…',phMulti:'Type KMRS or kilo mike, then Enter',
  accuracy:'Accuracy',streak:'Streak',learned:'Learned',answers:'Answers',
  mastery:'Mastery',characters:'Characters',inRotation:'{a} of {b} in rotation',drilling:'Drilling most: ',
  settings:'Settings',gExercise:'Exercise',gSending:'Sending',gAnswering:'Answering',
  type:'Type',mChars:'Single characters',mGroups:'Random groups',mWords:'Words',mCalls:'Callsigns',
  charset:'Character set',oKoch:'Koch order (starts with K M)',oLetters:'All letters',oFull:'Letters, numbers, punctuation',
  shortest:'Shortest',longest:'Longest',maxSame:'Same char max',learnedOnly:'Learned only',onlyRotation:'Only characters in rotation',
  speed:'Speed',charGap:'Character gap',wordGap:'Word gap',sendTimes:'Send times',repeatPause:'Repeat pause',tone:'Tone',volume:'Volume',
  slowAfter:'Slow after',unlockAt:'Unlock at',recogniser:'Recogniser',eBrowser:'Phone’s speech service',eOffline:'Offline, choose mic (40 MB)',
  micInput:'Mic input',micAuto:'Auto (earbuds if found)',micN:'Microphone {n}',
  resetProg:'Reset progress for this character set',confirmReset:'Tap again to confirm reset',
  history:'History (last 100)',hSent:'Sent',hYou:'You said',hResult:'Result',hTime:'Time',
  clearHist:'Clear history',confirmClear:'Tap again to clear',noAnswers:'No answers yet.',
  histSum:'{n} {w} · {p}% correct',histSumW:['answer','answers'],mostMissed:' · most missed: {x}',slowWord:'slow',nopeWord:'nope',nextBtn:'Next button',
  help:'Spelling words: say each letter, then it checks when the length is complete. “Over” checks early, “correction” removes the last letter.<br>Keys (outside the text box): <kbd>Space</kbd> start/pause · <kbd>R</kbd> replay · <kbd>N</kbd> next · <kbd>M</kbd> mic',
  spellIt:'Spell it: <b>{n}</b> {w}',spellItW:['character','characters'],whatWas:'What was that?',
  correct:'<b>{x}</b> — correct',correctSlow:'<b>{x}</b> — correct, but slow ({s} s)',
  itWas:'It was <b>{x}</b>',notX:'Not {g}. It was <b>{x}</b>',youSpelled:'You spelled <b>{g}</b>. It was <b>{x}</b>',
  newChar:'New character: <b>{c}</b> {n}',pausedMsg:'Paused. Press <b>Start</b> to continue.',
  pressStart:'Press Start first.',notRecognised:'Didn’t recognise that. Try Kilo, Two, Stop, plain letters, or nope.',
  micOpen:'Open mic',micListening:'Mic open — listening',micRequesting:'Requesting mic…',micLoadingRec:'Loading recogniser…',micLoadingModel:'Loading speech model…',micOpening:'Opening mic…',
  modelDownload:'First time only: downloading the 40 MB speech model. Later visits load it from this device.',listeningOn:'Listening on: {x}',defaultMic:'default mic',
  errBlockedReload:'Microphone blocked. Allow it for this site in the browser’s Site settings → Microphone, then reload.',
  errBlocked:'Microphone blocked. Allow it for this site in the browser’s Site settings → Microphone.',
  errNoMic:'No microphone found, or another app is using it.',errNetwork:'Speech recognition needs an internet connection. Retrying…',
  errClosing:'The mic keeps closing. Tap Open mic to try again.',errDisconnected:'The mic was disconnected.',
  errMicUnavailable:'That mic isn’t available. Pick another in Settings → Mic input.',errOffline:'Couldn’t start the offline recogniser ({x}).',
  recChanged:'Recogniser changed. Tap Open mic again.',switchInputs:'Turn the mic off and on again to switch inputs.',
  noteOffline:'Offline recogniser: listens only for phonetic words, numbers, “nope”, “over” and “correction”. Choose the mic in Settings → Mic input.',
  noteHttps:'The mic needs this page served over https://.',noteNoSpeech:'This browser has no speech service. Switch Settings → Recogniser to Offline.',
  noteBrowser:'Tap <b>Open mic</b> once and keep talking — it reopens by itself after pauses. Headphones help, so the mic doesn’t hear the tone.',
  noteWords:'Not enough words use only your learned characters and length, so this is a random group. Learn more characters, widen the length, or turn off “Only characters in rotation”.',
  noteCalls:'Callsigns need letters and at least one digit, so this one uses all characters. Turn off “Only characters in rotation” to hide this note.',
  language:'Language'
};
const SR={
  sub:'Čuj, izgovori. Slabiji znakovi se češće ponavljaju.',
  device:'ovaj uređaj',saved:'sačuvano',notSaved:'nije sačuvano',
  stReady:'spremno',stListening:'slušam',stPaused:'pauza',
  intro:'Pritisni <b>Start</b>, pa odgovaraj fonetskim imenima ([[Kilo, Mike, Two]]…) ili reci <b>[[nope]]</b>.',
  start:'Start',pause:'Pauza',replay:'Ponovi',next:'Dalje',nextTitle:'Preskoči — računa se kao promašaj i kaže tačan odgovor',
  phSingle:'Ili ukucaj: [[kilo, two, stop]]…',phMulti:'Ukucaj [[KMRS]] ili [[kilo mike]], pa [[Enter]]',
  accuracy:'Tačnost',streak:'Niz',learned:'Naučeno',answers:'Odgovori',
  mastery:'Savladanost',characters:'Znakovi',inRotation:'{a} od {b} u vježbi',drilling:'Najviše se vježba: ',
  settings:'Podešavanja',gExercise:'Vježba',gSending:'Slanje',gAnswering:'Odgovaranje',
  type:'Tip',mChars:'Pojedinačni znakovi',mGroups:'Nasumične grupe',mWords:'Riječi',mCalls:'Pozivni znakovi',
  charset:'Skup znakova',oKoch:'[[Koch]] redoslijed (počinje sa [[K M]])',oLetters:'Sva slova',oFull:'Slova, brojevi, interpunkcija',
  shortest:'Najkraće',longest:'Najduže',maxSame:'Isti znak najviše',learnedOnly:'Samo naučeni',onlyRotation:'Samo znakovi u vježbi',
  speed:'Brzina',charGap:'Razmak znakova',wordGap:'Razmak riječi',sendTimes:'Broj slanja',repeatPause:'Pauza ponavljanja',tone:'Ton',volume:'Jačina',
  slowAfter:'Sporo nakon',unlockAt:'Otključaj na',recogniser:'Prepoznavanje',eBrowser:'Govorni servis telefona',eOffline:'Oflajn, izbor mikrofona ([[40 MB]])',
  micInput:'Mikrofon',micAuto:'Automatski (slušalice ako postoje)',micN:'Mikrofon {n}',
  resetProg:'Poništi napredak za ovaj skup znakova',confirmReset:'Dodirni ponovo za potvrdu',
  history:'Istorija (posljednjih 100)',hSent:'Poslato',hYou:'Odgovor',hResult:'Rezultat',hTime:'Vrijeme',
  clearHist:'Obriši istoriju',confirmClear:'Dodirni ponovo za brisanje',noAnswers:'Još nema odgovora.',
  histSum:'{n} {w} · {p}% tačno',histSumW:['odgovor','odgovora','odgovora'],mostMissed:' · najčešće promašeni: {x}',slowWord:'sporo',nopeWord:'[[nope]]',nextBtn:'dugme Dalje',
  help:'Riječi se speluju: izgovori svako slovo, provjera ide kad se popuni dužina. „[[Over]]“ provjerava ranije, „[[correction]]“ briše posljednje slovo.<br>Tasteri (van polja za unos): <kbd>[[Space]]</kbd> start/pauza · <kbd>[[R]]</kbd> ponovi · <kbd>[[N]]</kbd> dalje · <kbd>[[M]]</kbd> mikrofon',
  spellIt:'Speluj: <b>{n}</b> {w}',spellItW:['znak','znaka','znakova'],whatWas:'Šta je bilo?',
  correct:'<b>{x}</b> — tačno',correctSlow:'<b>{x}</b> — tačno, ali sporo ({s} s)',
  itWas:'Bilo je <b>{x}</b>',notX:'Nije {g}. Bilo je <b>{x}</b>',youSpelled:'Odgovor <b>{g}</b> nije tačan. Bilo je <b>{x}</b>',
  newChar:'Novi znak: <b>{c}</b> {n}',pausedMsg:'Pauza. Pritisni <b>Start</b> za nastavak.',
  pressStart:'Prvo pritisni Start.',notRecognised:'Nije prepoznato. Probaj [[Kilo, Two, Stop]], obična slova ili [[nope]].',
  micOpen:'Otvori mikrofon',micListening:'Mikrofon otvoren — slušam',micRequesting:'Tražim mikrofon…',micLoadingRec:'Učitavam prepoznavanje…',micLoadingModel:'Učitavam govorni model…',micOpening:'Otvaram mikrofon…',
  modelDownload:'Samo prvi put: preuzima se govorni model od [[40 MB]]. Sljedeći put se učitava sa ovog uređaja.',listeningOn:'Slušam na: {x}',defaultMic:'podrazumijevani mikrofon',
  errBlockedReload:'Mikrofon je blokiran. Dozvoli ga za ovaj sajt u podešavanjima pretraživača → Mikrofon, pa osvježi stranicu.',
  errBlocked:'Mikrofon je blokiran. Dozvoli ga za ovaj sajt u podešavanjima pretraživača → Mikrofon.',
  errNoMic:'Mikrofon nije pronađen ili ga koristi druga aplikacija.',errNetwork:'Prepoznavanje govora traži internet vezu. Pokušavam ponovo…',
  errClosing:'Mikrofon se stalno zatvara. Dodirni Otvori mikrofon da pokušaš ponovo.',errDisconnected:'Mikrofon je isključen.',
  errMicUnavailable:'Taj mikrofon nije dostupan. Izaberi drugi u Podešavanja → Mikrofon.',errOffline:'Oflajn prepoznavanje nije pokrenuto ({x}).',
  recChanged:'Prepoznavanje je promijenjeno. Ponovo dodirni Otvori mikrofon.',switchInputs:'Isključi i ponovo uključi mikrofon da promijeniš ulaz.',
  noteOffline:'Oflajn prepoznavanje sluša samo fonetska imena, brojeve, „[[nope]]“, „[[over]]“ i „[[correction]]“. Mikrofon biraš u Podešavanja → Mikrofon.',
  noteHttps:'Mikrofon radi samo kad je stranica na [[https://]].',noteNoSpeech:'Ovaj pretraživač nema govorni servis. Prebaci Podešavanja → Prepoznavanje na Oflajn.',
  noteBrowser:'Dodirni <b>Otvori mikrofon</b> jednom i samo pričaj — sam se ponovo otvara nakon pauza. Odgovori su na engleskom ([[Kilo, Mike, Two]]…). Slušalice pomažu da mikrofon ne čuje ton.',
  noteWords:'Nema dovoljno riječi samo od naučenih znakova i zadate dužine, pa je ovo nasumična grupa. Nauči još znakova, proširi dužinu ili isključi „Samo znakovi u vježbi“.',
  noteCalls:'Pozivnom znaku trebaju slova i bar jedna cifra, pa ovaj koristi sve znakove. Isključi „Samo znakovi u vježbi“ da sakriješ ovu napomenu.',
  language:'Jezik'
};

/* Serbian Latin → Cyrillic. Skips HTML tags, {placeholders} and [[kept]] text. */
const L2C={A:'А',B:'Б',C:'Ц',Č:'Ч',Ć:'Ћ',D:'Д',Đ:'Ђ',E:'Е',F:'Ф',G:'Г',H:'Х',I:'И',J:'Ј',K:'К',L:'Л',M:'М',N:'Н',O:'О',P:'П',R:'Р',S:'С',Š:'Ш',T:'Т',U:'У',V:'В',Z:'З',Ž:'Ж'};
function cyr(s){
  return s.split(/(<[^>]*>|\{[^}]*\}|\[\[.*?\]\])/).map(part=>{
    if(/^(<|\{|\[\[)/.test(part))return part;
    return part.replace(/Lj|LJ|lj|Nj|NJ|nj|Dž|DŽ|dž|[A-Za-zČĆĐŠŽčćđšž]/g,m=>{
      const low=m===m.toLowerCase();
      const up={LJ:'Љ',NJ:'Њ','DŽ':'Џ'}[m.toUpperCase()]||L2C[m.toUpperCase()];
      if(!up)return m;return low?up.toLowerCase():up;
    });
  }).join('');
}
const unmark=s=>s.replace(/\[\[(.*?)\]\]/g,'$1');

export const LANGS=[['en','English'],['sr','Srpski'],['sr-Cyrl','Српски']];
let lang='en';
export function pickDefault(){const n=(navigator.language||'').toLowerCase();return /^(sr|bs|hr|me|cnr)/.test(n)?(n.includes('cyrl')?'sr-Cyrl':'sr'):'en'}
export function setLang(l){lang=LANGS.some(x=>x[0]===l)?l:'en';document.documentElement.lang=lang==='en'?'en':lang==='sr'?'sr-Latn':'sr-Cyrl';applyStatic()}
export function getLang(){return lang}
/* plural: English one/other; Serbian one (1, 21…), few (2–4, 22–24…), many */
function pick(forms,n){if(lang==='en')return n===1?forms[0]:forms[1];
  const a=n%10,b=n%100;return a===1&&b!==11?forms[0]:a>=2&&a<=4&&(b<12||b>14)?forms[1]:forms[2]}
export function t(key,p){
  let s=lang==='en'?EN[key]:SR[key];if(s===undefined)s=EN[key]!==undefined?EN[key]:key;
  if(lang==='sr-Cyrl')s=cyr(s);
  s=unmark(s);
  if(p&&p.n!==undefined&&s.includes('{w}')){const forms=(lang==='en'?EN:SR)[key+'W']||EN[key+'W'];p=Object.assign({w:pick(forms,+p.n)},p);if(lang==='sr-Cyrl')p.w=cyr(p.w)}
  if(p)s=s.replace(/\{(\w+)\}/g,(m,k)=>p[k]!==undefined?p[k]:m);
  return s;
}
/* elements: data-i18n (text), data-i18n-html (markup), data-i18n-ph (placeholder), data-i18n-title (tooltip) */
export function applyStatic(root=document){
  root.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  root.querySelectorAll('[data-i18n-html]').forEach(el=>el.innerHTML=t(el.dataset.i18nHtml));
  root.querySelectorAll('[data-i18n-title]').forEach(el=>el.title=t(el.dataset.i18nTitle));
}
