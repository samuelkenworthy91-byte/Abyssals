import {moveArtReady} from './move-scene-renderer.js?v=0.87.0';
// Every signature has an explicit authored sequence, artwork cell and impact cue.
const rows=[
 [378,'spirit-bastion',1850,0.64,'d',0,'#8ee8da','#f2eacb','Spirit orb gathers → spectral bastion closes → ghost pulse strikes'],
 [379,'surge-skitter',1500,0.58,'d',1,'#ffdf50','#78ecf2','Lightning zigzags → quick skitter strike → speed spark returns'],
 [380,'lace-lullaby',1950,0.68,'d',2,'#f6abc9','#fff1c3','Lace ribbons orbit → silken chime strikes → quiet motes settle'],
 [381,'brineglass',1900,0.65,'d',3,'#a1e6ff','#a492ef','Frozen brine gathers → crystal shower strikes → violet venom spreads'],
 [382,'wyvern-shear',1550,0.57,'d',4,'#74cf99','#edc16a','Wings brace → crossed scythes slash → critical blade glints'],
 [383,'tollwave',2050,0.66,'d',5,'#d5b76c','#cde3ed','Bell charges → three bronze rings expand → resonant impact'],
 [384,'bower-bash',1500,0.53,'d',6,'#ffc2d5','#ede0ff','Woolly fist draws back → crystal knuckle hits → petals scatter'],
 [385,'emberbloom',2050,0.64,'d',7,'#ff9457','#a8d584','Rooted ember opens → fire blossom strikes → green warmth returns'],
 [36,'drowned-ember',1800,.66,'a',0,'#ff934b','#6487ff','Ember falls → spectral water smothers → ghost fire reignites'],
 [37,'infernal-prowl',1600,.64,'a',1,'#ff663e','#ffce6c','Four footprints accelerate → prowling claw erupts'],
 [38,'little-conqueror',1550,.57,'a',2,'#ff733e','#ffdc78','Compact flame banner unfurls → sprint → banner folds into youthful flare'],
 [39,'red-banner-rush',1950,.69,'a',3,'#ec335c','#ffd679','Long crimson banner streams → whipping charge → red-gold detonation'],
 [59,'jaffa-breaker',1850,.65,'a',4,'#ffb452','#63dfff','Segmented water sun spins → splits into crescents → crescents collide'],
 [76,'alien-circuit',1850,.70,'a',5,'#6dcfff','#fff27c','Alien paths trace → circuit nodes charge → branching discharge'],
 [77,'storm-of-youth',1500,.68,'a',6,'#ffe970','#9c8bff','Lightning ricochets twice → thunder burst → backward recoil spark'],
 [97,'kindness-gathers',1750,.64,'a',7,'#a9ea87','#ffbcbb','Green and peach motes gather from all directions → warm healing settles'],
 [98,'oathkeepers-edge',1600,.60,'a',8,'#70e6af','#d5ffc9','Vines braid into jade crescent → disciplined diagonal cut → leaf fragments'],
 [99,'rooted-pride',1850,.64,'a',9,'#9ade76','#e4ffa5','Roots anchor caster → crest rises → concentrated green surge'],
 [115,'acre-grudge',1900,.69,'b',0,'#a5e5ff','#f0feff','Ground frost races forward → fossil ridges erupt → ridges collapse'],
 [116,'celestial-rime',2100,.72,'b',1,'#c6edff','#dcbaff','Star crystals gather overhead → descending spiral → celestial frost bloom'],
 [150,'emperors-scheme',1850,.67,'b',2,'#bd68ea','#82eab0','Three toxic threads form triangle → trap tightens → seal and fumes'],
 [151,'venom-cairn',2000,.66,'b',3,'#b868ed','#9adc65','Three venom stones stack → cairn topples → poisonous shards splash'],
 [172,'island-crown',2000,.65,'b',4,'#d7b276','#ffe0a1','Stone plate crown rises → central pillar thrusts → island ring fractures'],
 [189,'pilgrim-echo',1700,.62,'b',5,'#a8e3ff','#d8fbff','Wind ribbon arcs forward → receding echo rings → soft aerial impact'],
 [209,'long-game',1950,.73,'b',6,'#e27ee0','#f7b7ef','Future-step markers appear apart → deliberate convergence → quiet glint'],
 [210,'sultans-measure',2050,.72,'b',7,'#bba2ff','#f2d5ff','Three balance rings align symmetrically → crown-like halo settles'],
 [246,'ancient-nodule',1700,.61,'b',8,'#d8ba8c','#ffe5b7','Nodule rotates slowly → fossil seams split → dense stone fragments launch'],
 [247,'glacier-fossil',2000,.68,'b',9,'#92d6e8','#eee8d1','Ice-enclosed fossil tumbles forward → stone and frost shatter together'],
 [248,'sickle-talon',1550,.57,'c',0,'#d6b38d','#fff0cd','Opposing hooked fossil talons carve diagonally → X impact → chips scatter'],
 [268,'uncrowned-quills',2050,.69,'c',1,'#b0a1ff','#dbc9ff','Spectral quill fan appears → staggered feather launches → hollow broken crown'],
 [288,'silent-ambition',1850,.68,'c',2,'#9979d5','#ea526f','Silent dark coils tighten → crimson core compresses → three upward streaks'],
 [308,'broken-alliance',1750,.65,'c',3,'#b67de7','#f0afff','Linked dark strands stretch → bond snaps → opposing jagged slashes'],
 [309,'devilish-encore',2200,.72,'c',4,'#a47cde','#efb0ff','Actual foe afterimage replays backwards → mocking echo → second shadow strike'],
 [310,'rebellious-jab',1000,.28,'c',5,'#e56375','#ffd295','Tiny straight punch spark → oversized cheeky starburst'],
 [330,'blade-tail-oath',1800,.58,'c',6,'#b6ecd9','#f3fff3','Sweeping silver-green tail blade → contact → thin oath crescent locks the cut'],
 [352,'benevolent-bloom',2100,.68,'c',7,'#ffb5da','#bbefb4','Pink-gold blossom opens below → layered petals rise → green healing closes'],
 [353,'concord-pact',2050,.68,'c',8,'#ffb8e1','#ffe4a1','Separate fairy ribbons orbit → luminous knot → starry outward pulse'],
 [354,'oathwall',1900,.65,'c',9,'#ffbbdc','#ffdb89','Interlocking shield panels rise → luminous threads join → steady protective wall']
];
export const SIGNATURE_EFFECTS=Object.fromEntries(rows.map(([id,key,duration,impact,atlas,cell,color,accent,sequence])=>[id,{id,key,style:key,duration,impact,atlas,cell,color,accent,sequence,signature:true}]));
const layer=(cls,body='',vars='')=>`<span class="sig-layer ${cls}"${vars?` style="${vars}"`:''}>${body}</span>`;
const art=cls=>`<i class="sig-art ${cls||''}"></i>`;
const ring=(cls='',i=0)=>`<i class="sig-ring ${cls}" style="--i:${i}"></i>`;
const rays=(cls,n=5)=>Array.from({length:n},(_,i)=>`<i class="sig-ray ${cls}" style="--i:${i};--spin:${i*360/n}deg"></i>`).join('');
const pieces=(cls,n=6)=>Array.from({length:n},(_,i)=>layer(cls,art(),`--i:${i};--spin:${i*360/n}deg;--tx:${Math.cos(i*2*Math.PI/n)*105}px;--ty:${Math.sin(i*2*Math.PI/n)*95}px`)).join('');
const image=src=>src?`<img class="sig-echo-body" src="${src.replaceAll('&','&amp;').replaceAll('"','&quot;')}" alt="" aria-hidden="true">`:art();
const circuit=`<svg class="sig-circuit" viewBox="-130 -110 260 220" aria-hidden="true"><path d="M-110 -70H-40V-20H20V-80H100V-10H55V45H110V90H5V40H-80V90H-115V10H-60V-70M-60 10H55M20 -20V40"/><path d="M-110 50H-90V-40H75V70H-35V-90" class="circuit-branch"/></svg>`;
const triangle=`<svg class="sig-triangle" viewBox="-120 -120 240 240" aria-hidden="true"><path d="M0 -100 98 72 -98 72Z"/><path d="M0 -60 60 46 -60 46Z"/></svg>`;
const factories={
 378:()=>layer('bastion-orb',art())+layer('bastion-shield',art())+ring('bastion-pulse'),
 379:()=>layer('skitter-zig',art())+layer('skitter-hit',art())+layer('skitter-return',art()),
 380:()=>layer('lace-left',art('left-half'))+layer('lace-right',art('right-half'))+ring('lace-chime')+rays('lace-motes',6),
 381:()=>pieces('brine-crystal',5)+layer('brine-venom',art())+ring('brine-spread'),
 382:()=>layer('wyvern-brace',art())+layer('wyvern-left',art())+layer('wyvern-right',art())+rays('wyvern-glints',3),
 383:()=>layer('toll-charge',art())+[0,1,2].map(i=>ring('toll-ring',i)).join('')+layer('toll-hit',art()),
 384:()=>layer('bower-fist',art())+layer('bower-hit',art())+pieces('bower-petal',5),
 385:()=>layer('ember-root',art())+layer('ember-flower',art())+layer('ember-return',art())+ring('ember-warmth'),

 36:()=>layer('drowning-ember',art())+layer('spectral-water',ring()+ring('',1))+layer('reignition',art())+rays('ghost-fire',4),
 37:()=>Array.from({length:4},(_,i)=>layer('prowl-print',art(),`--i:${i}`)).join('')+layer('prowl-claw',art())+rays('claw-sparks',3),
 38:()=>layer('youth-banner',art())+layer('banner-sprint',art())+rays('young-speed',4)+layer('young-flare',art())+rays('young-rays',7),
 39:()=>layer('war-banner',art())+rays('war-stream',6)+layer('banner-whip',art())+layer('war-detonation',art())+ring('war-shock'),
 59:()=>layer('water-sun',art())+ring('sun-segments')+layer('crescent-left',art('left-half'))+layer('crescent-right',art('right-half'))+ring('foam-collision'),
 76:()=>layer('circuit-trace',circuit)+rays('circuit-nodes',6)+layer('circuit-discharge',art())+layer('circuit-flash',circuit),
 77:()=>layer('reckless-zigzag',art())+layer('lightning-ricochet',art())+layer('youth-thunder',art())+layer('backward-spark',art()),
 97:()=>pieces('kindness-mote',9)+layer('gathered-kindness',art())+ring('warm-settle'),
 98:()=>layer('braided-edge',art())+layer('disciplined-cut',art())+pieces('leaf-fragment',5),
 99:()=>layer('root-anchor',art())+ring('root-ground')+layer('proud-crest',art())+layer('rooted-surge',art()),
 115:()=>Array.from({length:6},(_,i)=>layer('frost-ridge',art(),`--i:${i}`)).join('')+layer('frost-collapse',art())+pieces('fossil-frost',7),
 116:()=>pieces('stellar-crystal',8)+layer('celestial-spiral',art())+layer('celestial-bloom',art())+ring('star-halo'),
 150:()=>layer('scheme-triangle',triangle)+layer('scheme-tightens',triangle)+layer('toxic-seal',art())+pieces('toxic-fume',3),
 151:()=>[0,1,2].map(i=>layer('cairn-stack',art(),`--i:${i}`)).join('')+layer('cairn-topple',art())+pieces('toxic-shard',7),
 172:()=>[0,1,2,3,4].map(i=>layer('crown-plate',art(),`--i:${i};--tx:${(i-2)*43}px`)).join('')+layer('island-pillar',art())+ring('island-fracture')+pieces('ochre-chip',5),
 189:()=>layer('pilgrim-ribbon',art())+[0,1,2,3].map(i=>layer('pilgrim-footstep',ring(),`--i:${i}`)).join('')+layer('pilgrim-breeze',art()),
 209:()=>[0,1,2,3,4].map(i=>layer('future-marker',ring(),`--i:${i};--tx:${(i-2)*52}px;--ty:${i%2?-55:35}px`)).join('')+layer('planned-glint',art()),
 210:()=>[0,1,2].map(i=>layer('balance-ring',ring(),`--i:${i};--tx:${(i-1)*70}px;--ty:${i===1?-65:20}px`)).join('')+layer('measured-halo',art()),
 246:()=>layer('prehistoric-nodule',art())+rays('fossil-seams',4)+pieces('dense-stone',8),
 247:()=>layer('glacier-tumble',art())+ring('glacier-crack')+pieces('glacier-stone',5)+pieces('glacier-ice',7),
 248:()=>layer('hook-left',art('left-half'))+layer('hook-right',art('right-half'))+rays('talon-cross',4)+pieces('talon-chip',4),
 268:()=>layer('spectral-fan',art())+[0,1,2,3,4,5].map(i=>layer('quill-launch',art(),`--i:${i};--tx:${(i-2.5)*25}px;--ty:${(i%2)*25-30}px`)).join('')+layer('uncrowned-shock',art())+ring('hollow-crown'),
 288:()=>layer('silent-coils',art())+layer('crimson-compression',art())+[0,1,2].map(i=>`<i class="sig-ray ambition-rise" style="--i:${i}"></i>`).join(''),
 308:()=>layer('linked-strands',art())+layer('broken-bond',ring())+layer('alliance-left',art('left-half'))+layer('alliance-right',art('right-half')),
 309:r=>layer('mocking-replay',image(r.targetArt))+layer('mocking-echo',image(r.targetArt))+layer('encore-shadow',art())+layer('encore-cut',art()),
 310:()=>layer('needle-jab',art())+layer('cheeky-starburst',art())+rays('cheeky-ray',8),
 330:()=>layer('tail-sweep',art())+layer('oath-lock',art())+ring('oath-line'),
 352:()=>layer('blossom-ground',art())+[0,1,2,3].map(i=>layer('rising-petal',art(),`--i:${i};--tx:${(i-1.5)*45}px`)).join('')+layer('green-healing',art()),
 353:()=>layer('pact-ribbon-left',art('left-half'))+layer('pact-ribbon-right',art('right-half'))+layer('pact-knot',art())+rays('pact-stars',8),
 354:()=>[0,1,2,3,4].map(i=>layer('oath-panel',art(),`--i:${i};--tx:${(i-2)*43}px`)).join('')+rays('oath-thread',4)+layer('settled-oathwall',art())
};
export function signatureHTML(move,result={}){const s=SIGNATURE_EFFECTS[move.id];if(!s)return '';return `<div class="signature-fx sig-${s.key} ${result.critical?'sig-critical':''}" data-fx-move="${s.id}" data-signature="${s.key}" style="--fx-duration:${s.duration}ms;--fx-color:${s.color};--sig-accent:${s.accent};--atlas-url:url('assets/vfx/signature-${s.atlas}.webp?v=0.87.0');--atlas-x:${s.cell%3*50}%;--atlas-y:${Math.floor(s.cell/3)*100/3}%;--impact-delay:${s.duration*s.impact}ms">${factories[s.id](result)}</div>`;}
const loaded=new Map();
export function signatureArtReady(move){const s=SIGNATURE_EFFECTS[move?.id];if(!s)return moveArtReady(move);if(typeof Image==='undefined')return Promise.resolve(true);const url=`assets/vfx/signature-${s.atlas}.webp?v=0.87.0`;if(!loaded.has(url))loaded.set(url,new Promise(resolve=>{const img=new Image();let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);if(!ok)loaded.delete(url);resolve(ok);};const timer=setTimeout(()=>finish(false),5000);img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=url;}));return loaded.get(url);}
