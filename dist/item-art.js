import {TRISKIT_ITEM_ART} from './triskit-branches.js?v=0.90.62';
import {BROAD_HELD_ITEMS} from './broad-held-data.js?v=0.90.62';
import {TYPE_COLORS} from './type-rules.js?v=0.90.62';
const ROOT='assets/items/';
const basic={bread:'bread',heartyFood:'hearty-ration',winterPreserves:'winter-preserve',riverBait:'river-bait',poultices:'poultice',lifeEmbers:'life-ember',emergencyEvacs:'emergency-evac',armedEscorts:'armed-escort',binoculars:'binoculars',smoke:'smoke-bomb',rod:'fishing-rod',note:'trade-note',trainingTonics:'training-tonic',awakeningSigils:'awakening-sigil',bell:'pilgrim-bell',prayers:'two-prayers',familySeal:'family-seal',heirloomCharm:'heirloom-charm',prodigyFeed:'prodigy-feed',inheritanceThread:'inheritance-thread',broodingWarmer:'brooding-warmer',focused:'focused-growth',balanced:'balanced-growth',endurance:'endurance-tonic'};
const held={HELD_IRON_MANTLE:'iron-mantle',HELD_VEIL_CHARM:'veil-charm',HELD_COURIERS_SPUR:'couriers-spur',HELD_VOTIVE_THREAD:'votive-thread',HELD_PILGRIM_CUP:'pilgrim-cup',HELD_FIELDGLASS:'fieldglass',HELD_QUEST_COUNTERWEIGHT:'counterweight-band',HELD_QUEST_FURNACE:'furnace-bracer',HELD_QUEST_TIDEGLASS:'tideglass-charm',HELD_QUEST_MOURNING:'mourning-veil',HELD_QUEST_BOATWRIGHT:'boatwright-brace',HELD_QUEST_DEFENDER:'defender-pennant',HELD_QUEST_MERCY:'mercy-chalice'};
const coreTypes={VIGIL:'GHOST',FURNACE:'FIRE',STORM:'ELECTRIC',RIME:'ICE',DUSK:'DARK',CHITIN:'BUG'};
const hues={NORMAL:35,FIRE:0,WATER:205,ELECTRIC:50,GRASS:110,ICE:175,FIGHTING:20,POISON:280,GROUND:30,FLYING:230,PSYCHIC:325,BUG:75,ROCK:40,GHOST:265,DRAGON:250,DARK:290,STEEL:195,FAIRY:335};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function itemArt(key){
 if(key==='ITEM_DOSSIER_THUNDER_SHARD')return {src:ROOT+'relic-core.webp',type:'ELECTRIC'};
 const broad=BROAD_HELD_ITEMS.find(i=>i.id===key);if(broad)return {src:broad.icon};
 if(key.startsWith('ITEM_BRANCH_'))return {src:ROOT+key.slice(12).toLowerCase().replaceAll('_','-')+'.webp'};
 if(basic[key])return {src:ROOT+basic[key]+'.webp'};
 if(held[key])return {src:ROOT+held[key]+'.webp'};
 if(key.startsWith('HELD_TYPE_SIGIL_'))return {src:ROOT+'type-sigil.webp',type:key.slice(16)};
 if(key.startsWith('ITEM_RELIC_')){const t=key.slice(11);return {src:ROOT+'relic-core.webp',type:coreTypes[t]||t};}
 const ev={ITEM_EVOLUTION_TIDE_PEARL:'tide-pearl',ITEM_EVOLUTION_MOURNING_BRIAR:'mourning-briar',ITEM_EVOLUTION_SUNSCAR_GLASS:'sunscar-glass'};
 const item = ev[key] || TRISKIT_ITEM_ART[key];
 return item?{src:ROOT+item+'.webp'}:null;
}
export function itemIcon(key){
 if(key==='confluenceSpindle')return '<span class="item-art confluence-spindle-icon" title="Confluence Spindle — one roll per Prodigy stat"><svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="crispEdges"><rect x="14" y="1" width="4" height="30" fill="#efcd82"/><rect x="13" y="4" width="6" height="5" fill="#4b8799"/><rect x="12" y="10" width="8" height="3" fill="#f7e0a1"/><rect x="7" y="14" width="18" height="4" fill="#295666"/><rect x="8" y="15" width="16" height="2" fill="#82e6da"/><rect x="4" y="18" width="6" height="4" fill="#d8aa61"/><rect x="22" y="11" width="6" height="4" fill="#d8aa61"/><rect x="8" y="20" width="4" height="4" fill="#53b5bc"/><rect x="20" y="8" width="4" height="4" fill="#53b5bc"/><rect x="12" y="26" width="8" height="3" fill="#e7c47b"/><rect x="14" y="29" width="4" height="2" fill="#eef8e0"/></svg></span>';
 const a=itemArt(key);if(!a)return '';return `<span class="item-art${a.type?' typed-item-art':''}"${a.type?` style="--item-type:${TYPE_COLORS[a.type]||'#b9b4a0'}" title="${esc(a.type)}"`:''}><img src="${a.src}" alt=""${a.type?` style="filter:hue-rotate(${(hues[a.type]||0)-205}deg)"`:''}></span>`;}
export function codexIcon(move){const type=move?.type_id||'NORMAL';return `<span class="item-art typed-item-art" style="--item-type:${TYPE_COLORS[type]||'#b9b4a0'}" title="${esc(type)} move codex"><img src="${ROOT}codex.webp" alt="" style="filter:hue-rotate(${(hues[type]||0)-205}deg)"></span>`;}
