export const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..','/':'-..-.','=':'-...-'};

export const NATO={A:'Alfa',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliett',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu',
  '0':'Zero','1':'One','2':'Two','3':'Three','4':'Four','5':'Five','6':'Six','7':'Seven','8':'Eight','9':'Nine','.':'Stop',',':'Comma','?':'Question','/':'Slash','=':'Break'};

/* extra spellings speech recognisers often produce */
const ALIAS={ALPHA:'A',ALFA:'A',JULIET:'J',XRAY:'X',EXRAY:'X',WHISKY:'W',NINER:'9',OH:'0',PERIOD:'.',DOT:'.',FULLSTOP:'.',QUESTIONMARK:'?',STROKE:'/',EQUALS:'=',EQUAL:'=',BT:'=',
  TOO:'2',TO:'2',FOR:'4',FORE:'4',ATE:'8',WON:'1',MIC:'M',MIKES:'M',KEELO:'K',KILLO:'K',KIRO:'K',CHARLY:'C',GOLFE:'G',PAPPA:'P',ROMIO:'R',VICTER:'V',ZOOLOO:'Z',SIERA:'S',CIERA:'S',LEEMA:'L',HOTELS:'H',QUEBECK:'Q',KEBEC:'Q',YANKY:'Y',ECCO:'E',ECHOES:'E'};
const NUMW={ZERO:'0',ONE:'1',TWO:'2',THREE:'3',FOUR:'4',FIVE:'5',SIX:'6',SEVEN:'7',EIGHT:'8',NINE:'9'};

export const NOPE=new Set(['NOPE','NO','PASS','SKIP','DUNNO','NEXT','NOPES']);
/* spoken commands while spelling a word or callsign */
export const CMD={OVER:'OVER',DONE:'OVER',BACK:'BACK',CORRECTION:'BACK',DELETE:'BACK'};

export const LOOKUP={};
for(const k in NATO)LOOKUP[NATO[k].toUpperCase().replace(/[^A-Z]/g,'')]=k;
Object.assign(LOOKUP,ALIAS,NUMW);

export const KOCH='KMURESNAPTLWI.JZ=FOY,VG5/Q92H38B?47C1D60X'.split('');
export const LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const DIG='0123456789'.split('');
export const FULL=LET.concat(DIG,'.,?/='.split(''));

/* words for the Words exercise: common English plus ham-radio abbreviations */
export const WORDS=(`THE AND FOR ARE BUT NOT YOU ALL ANY CAN HAD HER WAS ONE OUR OUT DAY GET HAS HIM HIS HOW MAN NEW NOW OLD SEE TWO WAY WHO BOY DID ITS LET PUT SAY SHE TOO USE
TIME YEAR PEOPLE WORK LIFE HAND PART PLACE WEEK CASE POINT HOME WATER ROOM AREA MONEY STORY FACT MONTH LOT RIGHT STUDY BOOK EYE JOB WORD SIDE KIND HEAD HOUSE FRIEND HOUR GAME LINE END
MEMBER CAR CITY NAME TEAM MINUTE IDEA BODY BACK PARENT FACE OTHERS LEVEL OFFICE DOOR HEALTH PERSON ART WAR HISTORY PARTY RESULT CHANGE MORNING REASON GIRL EARLY GUY FOOD MOMENT AIR TEACHER
GOOD FIRST LAST LONG GREAT LITTLE OWN OTHER RIGHT BIG HIGH SMALL LARGE NEXT YOUNG IMPORTANT FEW PUBLIC BAD SAME ABLE FREE TRUE WHOLE CLEAR SURE REAL BEST LATE HARD MAJOR STRONG
MAKE KNOW TAKE COME THINK LOOK WANT GIVE FIND TELL ASK SEEM FEEL TRY LEAVE CALL KEEP BEGIN HELP TALK TURN START SHOW HEAR PLAY RUN MOVE LIKE LIVE BELIEVE HOLD BRING WRITE STAND
LOSE PAY MEET INCLUDE SET LEARN LEAD UNDERSTAND WATCH FOLLOW STOP CREATE SPEAK READ SPEND GROW OPEN WALK WIN OFFER REMEMBER LOVE WAIT SERVE DIE SEND EXPECT BUILD STAY FALL REACH
RADIO ANTENNA SIGNAL BAND POWER TOWER WIRE CABLE TUNER KEY PADDLE MORSE CODE COPY SPEED TONE NOISE FADE STATION OPERATOR CONTEST LOG CARD REPORT WEATHER RAIN SUN WIND COLD WARM
CQ DE RST QTH QSL QRZ QRM QRN QSB QRP QRO QSY QRT QRL TNX TKS FB OM YL XYL UR HR WX ES 73 88 TU AGN PSE BK KN SK ANT RIG PWR GM GA GE GN HW CPY SOLID DX TEST RPRT NR`).split(/\s+/).filter(Boolean);

/* Callsign = ITU prefix + call-area digit + suffix (1–3 letters, ends in a letter).
   Prefixes are listed without the digit, e.g. E7 → E71ABC, S5 → S57DX, HB → HB9ABC.
   Mostly Europe plus common DX. DIGITS restricts the digit where only some are used. */
export const PREFIXES=['E7','9A','S5','YU','4O','Z3','LZ','YO','HA','OE','OK','OM','SP','DL','DK','DJ','DM','PA','ON','F','G','M','EI','GI','EA','CT','I','IK','IZ','HB','SM','LA','OH','OZ','ES','YL','LY','UR','UA','SV','TA','4X','W','K','N','AA','VE','JA','VK','ZL','PY','LU','ZS','VU','BY','HL'];
export const DIGITS={HB:'9',OE:'123456789',VK:'12345678',ZL:'1234',VE:'1234567',JA:'1234567890'};
