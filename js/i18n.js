/* Interface text. English, Serbian ijekavian in Latin script, and Cyrillic generated from the Latin.
   In Serbian strings, [[...]] marks text that must stay as is (phonetic words, button names, units). */
const EN={
  sub:'Hear it, say it. Weak characters come back more often.',
  device:'this device',saved:'saved',notSaved:'not saved',
  stReady:'ready',stListening:'listening',stPaused:'paused',
  intro:'Press <b>Start</b>, then answer with phonetic names, or say <b>next</b> to skip.',
  start:'Start',pause:'Pause',replay:'Replay',next:'Next',nextTitle:'Skip — counts as a miss and tells you the answer',
  phSingle:'Or type the character',phMulti:'Or type the characters',
  accuracy:'Accuracy',streak:'Streak',learned:'Learned',answers:'Answers',
  mastery:'Mastery',characters:'Characters',inRotation:'{a} of {b} in rotation',drilling:'Drilling most: ',
  settings:'Settings',gExercise:'Exercise',gSending:'Sending',gAnswering:'Answering',
  type:'Type',mChars:'Single characters',mGroups:'Random groups',mWords:'Words',mAbbr:'Abbreviations',mCalls:'Callsigns',
  charset:'Character set',oKoch:'Koch order (starts with K M)',oLetters:'All letters',oAlnum:'Letters and numbers',oFull:'Letters, numbers, punctuation',
  shortest:'Shortest',longest:'Longest',maxSame:'Same char max',learnedOnly:'Learned only',onlyRotation:'Only characters in rotation',
  speed:'Speed',charGap:'Character gap',wordGap:'Word gap',sendTimes:'Send times',repeatPause:'Repeat pause',tone:'Tone',volume:'Volume',
  slowAfter:'Slow after',okPause:'Pause after correct',unlockAt:'Unlock at',recogniser:'Recogniser',eBrowser:'Phone’s speech service',eOffline:'Offline, choose mic (40 MB)',
  micInput:'Mic input',micAuto:'Auto (earbuds if found)',micN:'Microphone {n}',
  resetProg:'Reset progress for this character set',confirmReset:'Tap again to confirm reset',
  history:'History (last 100)',hSent:'Sent',hYou:'You said',hResult:'Result',hTime:'Time',
  clearHist:'Clear history',confirmClear:'Tap again to clear',noAnswers:'No answers yet.',
  histSum:'{n} {w} · {p}% correct',histSumW:['answer','answers'],mostMissed:' · most missed: {x}',slowWord:'slow',nopeWord:'next',nextBtn:'Next button',
  help:'Spelling words: say each letter, then it checks when the length is complete. “Over” checks early, “correction” removes the last letter.<br>Keys (outside the text box): <kbd>Space</kbd> start/pause · <kbd>R</kbd> replay · <kbd>N</kbd> next · <kbd>M</kbd> mic',
  spellIt:'Spell it: <b>{n}</b> {w}',spellItW:['character','characters'],whatWas:'What was that?',
  correct:'<b>{x}</b> — correct',correctSlow:'<b>{x}</b> — correct, but slow ({s} s)',
  itWas:'It was <b>{x}</b>',notX:'Not {g}. It was <b>{x}</b>',youSpelled:'You spelled <b>{g}</b>. It was <b>{x}</b>',
  newChar:'New character: <b>{c}</b> {n}',pausedMsg:'Paused. Press <b>Start</b> to continue.',
  pressStart:'Press Start first.',notRecognised:'Didn’t recognise that. Try Kilo, Two, Stop, plain letters, or next.',
  micOpen:'Open mic',micListening:'Mic open — listening',micRequesting:'Requesting mic…',micLoadingRec:'Loading recogniser…',micLoadingModel:'Loading speech model…',micOpening:'Opening mic…',
  modelDownload:'First time only: downloading the 40 MB speech model. Later visits load it from this device.',listeningOn:'Listening on: {x}',defaultMic:'default mic',
  errBlockedReload:'Microphone blocked. Allow it for this site in the browser’s Site settings → Microphone, then reload.',
  errBlocked:'Microphone blocked. Allow it for this site in the browser’s Site settings → Microphone.',
  errNoMic:'No microphone found, or another app is using it.',errNetwork:'Speech recognition needs an internet connection. Retrying…',
  errClosing:'The mic keeps closing. Tap Open mic to try again.',errDisconnected:'The mic was disconnected.',
  errMicUnavailable:'That mic isn’t available. Pick another in Settings → Mic input.',errOffline:'Couldn’t start the offline recogniser ({x}).',
  recChanged:'Recogniser changed. Tap Open mic again.',switchInputs:'Turn the mic off and on again to switch inputs.',
  noteOffline:'Offline recogniser: listens only for the characters you’re practising and the commands “next”, “replay”, “pause”, “continue”, “over” and “correction”. Unclear words are ignored so you can repeat them. Choose the mic in Settings → Mic input.',
  noteOfflineChars:'Offline recogniser: listens only for the characters you’re practising and the commands “next”, “replay”, “pause” and “continue”. Unclear words are ignored so you can repeat them. Choose the mic in Settings → Mic input.',
  noteHttps:'The mic needs this page served over https://.',noteNoSpeech:'This browser has no speech service. Switch Settings → Recogniser to Offline.',
  noteBrowser:'Tap <b>Open mic</b> once and keep talking — it reopens by itself after pauses. Headphones help, so the mic doesn’t hear the tone.',
  noteWords:'Not enough words or abbreviations use only your learned characters and length, so this is a random group. Learn more characters, widen the length, or turn off “Only characters in rotation”.',
  noteCalls:'Callsigns need letters and at least one digit, so this one uses all characters. Turn off “Only characters in rotation” to hide this note.',
  sayAgain:'Didn’t catch that clearly — say it again.',
  gBand:'Band conditions',noise:'Noise',qsb:'Fading (QSB)',qrn:'Static (QRN)',qrm:'Interference (QRM)',bwLbl:'Receiver filter',bw250:'Narrow CW · 250 Hz',bw500:'CW · 500 Hz',bw2400:'SSB · 2.4 kHz',bandWhen:'Play',bwSend:'While sending',bwAlways:'All the time',
  bandWarn:'⚠ Without earbuds or headphones the mic also hears this background sound, which makes voice recognition worse (especially offline). Use headphones, or set Play to “While sending”.',
  language:'Language',toDark:'Switch to dark theme',toLight:'Switch to light theme',
  howTo:'How to use',
  guide:'<h3>Basics</h3><p>Press <b>Start</b>. The app sends Morse; answer by saying the phonetic name (Kilo, Mike, Two, Stop…). If you can’t copy it, say <b>next</b> (or skip, pass) or tap <b>Next</b>: it counts as a miss, the answer is read out and the next one is sent. <b>Replay</b> sends the current item again.</p>'+
    '<p>Voice commands: <b>replay</b> (or repeat) sends it again, <b>pause</b> pauses the drill, <b>continue</b> (or resume) starts it again.</p>'+
    '<p>Tap <b>Open mic</b> once and it stays open. You can also type the character itself in the box instead of speaking; the box clears after each answer.</p>'+
    '<h3>Exercise types</h3><ul><li><b>Single characters</b> — one character at a time, answered with one word.</li><li><b>Random groups</b> — random groups made from your characters.</li><li><b>Words</b> — about 2000 of the most common English words.</li><li><b>Abbreviations</b> — CW abbreviations, Q-codes and prosigns used in real QSOs ([[TNX, FB, QTH, 5NN, 73]]…).</li><li><b>Callsigns</b> — realistic calls: a real ITU prefix, call-area digit and 1–3 letter suffix, sometimes /P or /M.</li></ul>'+
    '<p>For groups, words, abbreviations and callsigns, spell the answer letter by letter. It is checked once you have given as many characters as were sent. Say <b>over</b> (or done) to check early, <b>correction</b> (or back, delete) to remove the last letter. When typing, just type the characters (e.g. KM): it checks once you have typed enough, or press Enter to check early.</p>'+
    '<h3>How it adapts</h3><p>Every character has a mastery score. Misses lower it, correct answers raise it, fast ones more than slow ones. Weak characters are picked more often. In <b>Koch order</b> you start with K and M; the next character unlocks when every character in rotation reaches the <b>Unlock at</b> level (with at least 4 attempts each). The <b>Mastery</b> panel shows the scores: red weak, amber improving, green solid. It is closed by default so it doesn’t give answers away. Tap a character there to hear it (this pauses the drill).</p>'+
    '<h3>Settings</h3><dl>'+
    '<dt>Character set</dt><dd>Koch order (unlocks gradually), all letters, letters and numbers, or letters, numbers and punctuation (all at once).</dd>'+
    '<dt>Shortest / Longest</dt><dd>Length range for groups and words.</dd>'+
    '<dt>Same char max</dt><dd>How many times one character may appear in a group, word or callsign.</dd>'+
    '<dt>Learned only</dt><dd>Groups, words, abbreviations and callsigns use only characters in rotation. If too few words or abbreviations fit, you get a random group instead.</dd>'+
    '<dt>Speed</dt><dd>Character speed in WPM.</dd>'+
    '<dt>Character gap / Word gap</dt><dd>Spacing in dit lengths. Standard is 3 and 7; larger values give more thinking time without slowing the characters themselves (Farnsworth).</dd>'+
    '<dt>Send times / Repeat pause</dt><dd>Send each item several times, with this pause between sendings.</dd>'+
    '<dt>Tone / Volume</dt><dd>Sidetone pitch and loudness.</dd>'+
    '<dt>Noise / Fading / Static / Interference / Receiver filter</dt><dd>Simulated band conditions: receiver hiss, the signal slowly fading in and out, random static crashes, and a second CW station sending nearby. 0 turns each one off. <b>Receiver filter</b> shapes everything you hear, like the filter on a real rig: a narrow CW filter (250 Hz) cuts most of the hiss and can drop the interfering station, 500 Hz is a normal CW filter, and SSB (2.4 kHz) lets everything in. <b>Play</b> chooses whether they sound only while a character is being sent or all the time. Without headphones the mic hears them too, which makes recognition worse.</dd>'+
    '<dt>Slow after</dt><dd>An answer slower than this (counted from the end of sending) is correct but slow, and raises mastery less.</dd>'+
    '<dt>Pause after correct</dt><dd>How long the correct answer stays on screen before the next character or word is sent.</dd>'+
    '<dt>Unlock at</dt><dd>Mastery needed before Koch adds the next character.</dd>'+
    '<dt>Recogniser</dt><dd><b>Offline</b> (default): downloads a 40 MB model once, then works without internet, listens only for the characters you’re practising, ignores unclear words (so you can repeat them) and lets you choose the mic. <b>Phone’s speech service</b>: the browser’s speech recognition; needs internet and uses the phone’s default mic.</dd>'+
    '<dt>Reset progress</dt><dd>Clears mastery for the current character set.</dd></dl>'+
    '<h3>History</h3><p>The last 100 answers: what was sent, what you said (with the recognised text), the result and response time, plus the most-missed characters.</p>'+
    '<h3>Tips and keys</h3><p>Use headphones so the mic doesn’t hear the tone. Settings and progress are saved in this browser only.<br>Keys (outside the text box): <kbd>Space</kbd> start/pause · <kbd>R</kbd> replay · <kbd>N</kbd> next · <kbd>M</kbd> mic</p>'
};
const SR={
  sub:'Čuj, izgovori. Slabiji znakovi se češće ponavljaju.',
  device:'ovaj uređaj',saved:'sačuvano',notSaved:'nije sačuvano',
  stReady:'spremno',stListening:'slušam',stPaused:'pauza',
  intro:'Pritisni <b>Start</b>, pa odgovaraj fonetskim imenima ([[Kilo, Mike, Two]]…) ili reci <b>[[next]]</b> za preskakanje.',
  start:'Start',pause:'Pauza',replay:'Ponovi',next:'Dalje',nextTitle:'Preskoči — računa se kao promašaj i kaže tačan odgovor',
  phSingle:'Ili ukucaj znak',phMulti:'Ili ukucaj znakove',
  accuracy:'Tačnost',streak:'Niz',learned:'Naučeno',answers:'Odgovori',
  mastery:'Savladanost',characters:'Znakovi',inRotation:'{a} od {b} u vježbi',drilling:'Najviše se vježba: ',
  settings:'Podešavanja',gExercise:'Vježba',gSending:'Slanje',gAnswering:'Odgovaranje',
  type:'Tip',mChars:'Pojedinačni znakovi',mGroups:'Nasumične grupe',mWords:'Riječi',mAbbr:'Skraćenice',mCalls:'Pozivni znakovi',
  charset:'Skup znakova',oKoch:'[[Koch]] redoslijed (počinje sa [[K M]])',oLetters:'Sva slova',oAlnum:'Slova i brojevi',oFull:'Slova, brojevi, interpunkcija',
  shortest:'Najkraće',longest:'Najduže',maxSame:'Isti znak najviše',learnedOnly:'Samo naučeni',onlyRotation:'Samo znakovi u vježbi',
  speed:'Brzina',charGap:'Razmak znakova',wordGap:'Razmak riječi',sendTimes:'Broj slanja',repeatPause:'Pauza ponavljanja',tone:'Ton',volume:'Jačina',
  slowAfter:'Sporo nakon',okPause:'Pauza nakon tačnog',unlockAt:'Otključaj na',recogniser:'Prepoznavanje',eBrowser:'Govorni servis telefona',eOffline:'Oflajn, izbor mikrofona ([[40 MB]])',
  micInput:'Mikrofon',micAuto:'Automatski (slušalice ako postoje)',micN:'Mikrofon {n}',
  resetProg:'Poništi napredak za ovaj skup znakova',confirmReset:'Dodirni ponovo za potvrdu',
  history:'Istorija (posljednjih 100)',hSent:'Poslato',hYou:'Odgovor',hResult:'Rezultat',hTime:'Vrijeme',
  clearHist:'Obriši istoriju',confirmClear:'Dodirni ponovo za brisanje',noAnswers:'Još nema odgovora.',
  histSum:'{n} {w} · {p}% tačno',histSumW:['odgovor','odgovora','odgovora'],mostMissed:' · najčešće promašeni: {x}',slowWord:'sporo',nopeWord:'[[next]]',nextBtn:'dugme Dalje',
  help:'Riječi se speluju: izgovori svako slovo, provjera ide kad se popuni dužina. „[[Over]]“ provjerava ranije, „[[correction]]“ briše posljednje slovo.<br>Tasteri (van polja za unos): <kbd>[[Space]]</kbd> start/pauza · <kbd>[[R]]</kbd> ponovi · <kbd>[[N]]</kbd> dalje · <kbd>[[M]]</kbd> mikrofon',
  spellIt:'Speluj: <b>{n}</b> {w}',spellItW:['znak','znaka','znakova'],whatWas:'Šta je bilo?',
  correct:'<b>{x}</b> — tačno',correctSlow:'<b>{x}</b> — tačno, ali sporo ({s} s)',
  itWas:'Bilo je <b>{x}</b>',notX:'Nije {g}. Bilo je <b>{x}</b>',youSpelled:'Odgovor <b>{g}</b> nije tačan. Bilo je <b>{x}</b>',
  newChar:'Novi znak: <b>{c}</b> {n}',pausedMsg:'Pauza. Pritisni <b>Start</b> za nastavak.',
  pressStart:'Prvo pritisni Start.',notRecognised:'Nije prepoznato. Probaj [[Kilo, Two, Stop]], obična slova ili [[next]].',
  micOpen:'Uključi mikrofon',micListening:'Mikrofon uključen — slušam',micRequesting:'Tražim mikrofon…',micLoadingRec:'Učitavam prepoznavanje…',micLoadingModel:'Učitavam govorni model…',micOpening:'Uključujem mikrofon…',
  modelDownload:'Samo prvi put: preuzima se govorni model od [[40 MB]]. Sljedeći put se učitava sa ovog uređaja.',listeningOn:'Slušam na: {x}',defaultMic:'podrazumijevani mikrofon',
  errBlockedReload:'Mikrofon je blokiran. Dozvoli ga za ovaj sajt u podešavanjima pretraživača → Mikrofon, pa osvježi stranicu.',
  errBlocked:'Mikrofon je blokiran. Dozvoli ga za ovaj sajt u podešavanjima pretraživača → Mikrofon.',
  errNoMic:'Mikrofon nije pronađen ili ga koristi druga aplikacija.',errNetwork:'Prepoznavanje govora traži internet vezu. Pokušavam ponovo…',
  errClosing:'Mikrofon se stalno zatvara. Dodirni Uključi mikrofon da pokušaš ponovo.',errDisconnected:'Mikrofon je isključen.',
  errMicUnavailable:'Taj mikrofon nije dostupan. Izaberi drugi u Podešavanja → Mikrofon.',errOffline:'Oflajn prepoznavanje nije pokrenuto ({x}).',
  recChanged:'Prepoznavanje je promijenjeno. Ponovo dodirni Uključi mikrofon.',switchInputs:'Isključi i ponovo uključi mikrofon da promijeniš ulaz.',
  noteOffline:'Oflajn prepoznavanje sluša samo znakove koje vježbaš i komande „[[next]]“, „[[replay]]“, „[[pause]]“, „[[continue]]“, „[[over]]“ i „[[correction]]“. Nejasne riječi se zanemaruju pa ih možeš ponoviti. Mikrofon biraš u Podešavanja → Mikrofon.',
  noteOfflineChars:'Oflajn prepoznavanje sluša samo znakove koje vježbaš i komande „[[next]]“, „[[replay]]“, „[[pause]]“ i „[[continue]]“. Nejasne riječi se zanemaruju pa ih možeš ponoviti. Mikrofon biraš u Podešavanja → Mikrofon.',
  noteHttps:'Mikrofon radi samo kad je stranica na [[https://]].',noteNoSpeech:'Ovaj pretraživač nema govorni servis. Prebaci Podešavanja → Prepoznavanje na Oflajn.',
  noteBrowser:'Dodirni <b>Uključi mikrofon</b> jednom i samo pričaj — sam se ponovo uključuje nakon pauza. Odgovori su na engleskom ([[Kilo, Mike, Two]]…). Slušalice pomažu da mikrofon ne čuje ton.',
  noteWords:'Nema dovoljno riječi ili skraćenica samo od naučenih znakova i zadate dužine, pa je ovo nasumična grupa. Nauči još znakova, proširi dužinu ili isključi „Samo znakovi u vježbi“.',
  noteCalls:'Pozivnom znaku trebaju slova i bar jedna cifra, pa ovaj koristi sve znakove. Isključi „Samo znakovi u vježbi“ da sakriješ ovu napomenu.',
  sayAgain:'Nije razumljivo — ponovi.',
  gBand:'Uslovi na opsegu',noise:'Šum',qsb:'Feding ([[QSB]])',qrn:'Pucketanje ([[QRN]])',qrm:'Smetnje ([[QRM]])',bwLbl:'Filter prijemnika',bw250:'Uski [[CW · 250 Hz]]',bw500:'[[CW · 500 Hz]]',bw2400:'[[SSB · 2,4 kHz]]',bandWhen:'Pusti',bwSend:'Dok se šalje',bwAlways:'Stalno',
  bandWarn:'⚠ Bez slušalica mikrofon čuje i ovaj zvuk u pozadini, pa prepoznavanje govora radi lošije (naročito oflajn). Koristi slušalice ili za „Pusti“ izaberi „Dok se šalje“.',
  language:'Jezik',toDark:'Prebaci na tamnu temu',toLight:'Prebaci na svijetlu temu',
  howTo:'Uputstvo',
  guide:'<h3>Osnove</h3><p>Pritisni <b>Start</b>. Aplikacija šalje Morzeov kod, a ti odgovaraš izgovarajući fonetsko ime ([[Kilo, Mike, Two, Stop]]…). Ako nisi primio znak, reci <b>[[next]]</b> (ili [[skip, pass]]) ili dodirni <b>Dalje</b>: računa se kao promašaj, odgovor se pročita naglas i šalje se sljedeći. <b>Ponovi</b> ponovo šalje trenutnu stavku.</p>'+
    '<p>Glasovne komande: <b>[[replay]]</b> (ili [[repeat]]) ponovo šalje stavku, <b>[[pause]]</b> pauzira vježbu, <b>[[continue]]</b> (ili [[resume]]) je nastavlja.</p>'+
    '<p>Dodirni <b>Uključi mikrofon</b> jednom i ostaje uključen. Umjesto govora možeš i ukucati sam znak u polje; polje se prazni nakon svakog odgovora.</p>'+
    '<h3>Tipovi vježbe</h3><ul><li><b>Pojedinačni znakovi</b> — jedan po jedan znak, odgovor je jedna riječ.</li><li><b>Nasumične grupe</b> — nasumične grupe od tvojih znakova.</li><li><b>Riječi</b> — oko 2000 najčešćih engleskih riječi.</li><li><b>Skraćenice</b> — [[CW]] skraćenice, Q-kodovi i prosigni iz pravih veza ([[TNX, FB, QTH, 5NN, 73]]…).</li><li><b>Pozivni znakovi</b> — realni pozivni znakovi: stvarni [[ITU]] prefiks, cifra područja i sufiks od 1–3 slova, ponekad [[/P]] ili [[/M]].</li></ul>'+
    '<p>Kod grupa, riječi, skraćenica i pozivnih znakova odgovor speluješ slovo po slovo. Provjera ide kad izgovoriš onoliko znakova koliko je poslato. Reci <b>[[over]]</b> (ili [[done]]) za raniju provjeru, <b>[[correction]]</b> (ili [[back, delete]]) da obrišeš posljednje slovo. Kad kucaš, samo ukucaj znakove (npr. [[KM]]): provjera ide kad ukucaš dovoljno, ili pritisni [[Enter]] za raniju provjeru.</p>'+
    '<h3>Kako se prilagođava</h3><p>Svaki znak ima ocjenu savladanosti. Promašaji je spuštaju, tačni odgovori podižu, brzi više od sporih. Slabiji znakovi se biraju češće. U <b>[[Koch]]</b> redoslijedu počinješ sa [[K]] i [[M]]; sljedeći znak se otključava kad svi znakovi u vježbi dostignu nivo <b>Otključaj na</b> (uz bar 4 pokušaja po znaku). Panel <b>Savladanost</b> pokazuje ocjene: crveno slabo, narandžasto napreduje, zeleno sigurno. Podrazumijevano je zatvoren da ne otkriva odgovore. Dodirni znak u njemu da ga čuješ (to pauzira vježbu).</p>'+
    '<h3>Podešavanja</h3><dl>'+
    '<dt>Skup znakova</dt><dd>[[Koch]] redoslijed (postepeno otključavanje), sva slova, slova i brojevi, ili slova, brojevi i interpunkcija (sve odjednom).</dd>'+
    '<dt>Najkraće / Najduže</dt><dd>Raspon dužine za grupe i riječi.</dd>'+
    '<dt>Isti znak najviše</dt><dd>Koliko puta se isti znak smije pojaviti u grupi, riječi ili pozivnom znaku.</dd>'+
    '<dt>Samo naučeni</dt><dd>Grupe, riječi, skraćenice i pozivni znakovi koriste samo znakove u vježbi. Ako nema dovoljno takvih riječi ili skraćenica, dobiješ nasumičnu grupu.</dd>'+
    '<dt>Brzina</dt><dd>Brzina znakova u [[WPM]].</dd>'+
    '<dt>Razmak znakova / Razmak riječi</dt><dd>Razmak u dužinama tačke. Standard je 3 i 7; veće vrijednosti daju više vremena za razmišljanje bez usporavanja samih znakova ([[Farnsworth]]).</dd>'+
    '<dt>Broj slanja / Pauza ponavljanja</dt><dd>Svaka stavka se šalje više puta, sa ovom pauzom između.</dd>'+
    '<dt>Ton / Jačina</dt><dd>Visina i glasnoća tona.</dd>'+
    '<dt>Šum / Feding / Pucketanje / Smetnje / Filter prijemnika</dt><dd>Simulirani uslovi na opsegu: šum prijemnika, signal koji polako slabi i jača, nasumično pucketanje i druga [[CW]] stanica koja šalje u blizini. 0 isključuje svaki od njih. <b>Filter prijemnika</b> oblikuje sve što čuješ, kao filter na pravom uređaju: uski [[CW]] filter ([[250 Hz]]) odsijeca veći dio šuma i može ukloniti stanicu koja smeta, [[500 Hz]] je uobičajen [[CW]] filter, a [[SSB]] ([[2,4 kHz]]) pušta sve. <b>Pusti</b> bira da li se čuju samo dok se znak šalje ili stalno. Bez slušalica ih čuje i mikrofon, pa prepoznavanje radi lošije.</dd>'+
    '<dt>Sporo nakon</dt><dd>Odgovor sporiji od ovoga (računa se od kraja slanja) je tačan, ali spor, i manje podiže savladanost.</dd>'+
    '<dt>Pauza nakon tačnog</dt><dd>Koliko dugo tačan odgovor ostaje na ekranu prije slanja sljedećeg znaka ili riječi.</dd>'+
    '<dt>Otključaj na</dt><dd>Savladanost potrebna da [[Koch]] doda sljedeći znak.</dd>'+
    '<dt>Prepoznavanje</dt><dd><b>Oflajn</b> (podrazumijevano): jednom preuzme model od [[40 MB]], zatim radi bez interneta, sluša samo znakove koje vježbaš, zanemaruje nejasne riječi (pa ih možeš ponoviti) i dozvoljava izbor mikrofona. <b>Govorni servis telefona</b>: prepoznavanje govora u pretraživaču; traži internet i koristi podrazumijevani mikrofon telefona.</dd>'+
    '<dt>Poništi napredak</dt><dd>Briše savladanost za trenutni skup znakova.</dd></dl>'+
    '<h3>Istorija</h3><p>Posljednjih 100 odgovora: šta je poslato, šta si rekao (uz prepoznati tekst), rezultat i vrijeme odgovora, te najčešće promašeni znakovi.</p>'+
    '<h3>Savjeti i tasteri</h3><p>Koristi slušalice da mikrofon ne čuje ton. Podešavanja i napredak se čuvaju samo u ovom pretraživaču.<br>Tasteri (van polja za unos): <kbd>[[Space]]</kbd> start/pauza · <kbd>[[R]]</kbd> ponovi · <kbd>[[N]]</kbd> dalje · <kbd>[[M]]</kbd> mikrofon</p>'
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
