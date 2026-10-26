import {BROAD_HELD_ITEMS} from './broad-held-data.js?v=0.90.40';
import {TYPE_COLORS} from './type-rules.js?v=0.90.40';
const ROOT='assets/items/';
const basic={bread:'bread',heartyFood:'hearty-ration',winterPreserves:'winter-preserve',riverBait:'river-bait',poultices:'poultice',lifeEmbers:'life-ember',emergencyEvacs:'emergency-evac',armedEscorts:'armed-escort',binoculars:'binoculars',smoke:'smoke-bomb',rod:'fishing-rod',note:'trade-note',trainingTonics:'training-tonic',awakeningSigils:'awakening-sigil',bell:'pilgrim-bell',prayers:'two-prayers',familySeal:'family-seal',heirloomCharm:'heirloom-charm',prodigyFeed:'prodigy-feed',inheritanceThread:'inheritance-thread',broodingWarmer:'brooding-warmer',focused:'focused-growth',balanced:'balanced-growth',endurance:'endurance-tonic'};
const held={HELD_IRON_MANTLE:'iron-mantle',HELD_VEIL_CHARM:'veil-charm',HELD_COURIERS_SPUR:'couriers-spur',HELD_VOTIVE_THREAD:'votive-thread',HELD_PILGRIM_CUP:'pilgrim-cup',HELD_FIELDGLASS:'fieldglass',HELD_QUEST_COUNTERWEIGHT:'counterweight-band',HELD_QUEST_FURNACE:'furnace-bracer',HELD_QUEST_TIDEGLASS:'tideglass-charm',HELD_QUEST_MOURNING:'mourning-veil',HELD_QUEST_BOATWRIGHT:'boatwright-brace',HELD_QUEST_DEFENDER:'defender-pennant',HELD_QUEST_MERCY:'mercy-chalice'};
const coreTypes={VIGIL:'GHOST',FURNACE:'FIRE',STORM:'ELECTRIC',RIME:'ICE',DUSK:'DARK',CHITIN:'BUG'};
const hues={NORMAL:35,FIRE:0,WATER:205,ELECTRIC:50,GRASS:110,ICE:175,FIGHTING:20,POISON:280,GROUND:30,FLYING:230,PSYCHIC:325,BUG:75,ROCK:40,GHOST:265,DRAGON:250,DARK:290,STEEL:195,FAIRY:335};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function itemArt(key){
 const broad=BROAD_HELD_ITEMS.find(i=>i.id===key);if(broad)return {src:broad.icon};
 if(key.startsWith('ITEM_BRANCH_'))return {src:ROOT+key.slice(12).toLowerCase().replaceAll('_','-')+'.webp'};
 if(basic[key])return {src:ROOT+basic[key]+'.webp'};
 if(held[key])return {src:ROOT+held[key]+'.webp'};
 if(key.startsWith('HELD_TYPE_SIGIL_'))return {src:ROOT+'type-sigil.webp',type:key.slice(16)};
 if(key.startsWith('ITEM_RELIC_')){const t=key.slice(11);return {src:ROOT+'relic-core.webp',type:coreTypes[t]||t};}
 const ev={ITEM_EVOLUTION_TIDE_PEARL:'tide-pearl',ITEM_EVOLUTION_MOURNING_BRIAR:'mourning-briar',ITEM_EVOLUTION_SUNSCAR_GLASS:'sunscar-glass'};
 return ev[key]?{src:ROOT+ev[key]+'.webp'}:null;
}
export function itemIcon(key){const a=itemArt(key);if(!a)return '';return `<span class="item-art${a.type?' typed-item-art':''}"${a.type?` style="--item-type:${TYPE_COLORS[a.type]||'#b9b4a0'}" title="${esc(a.type)}"`:''}><img src="${a.src}" alt=""${a.type?` style="filter:hue-rotate(${(hues[a.type]||0)-205}deg)"`:''}></span>`;}
export function codexIcon(move){const type=move?.type_id||'NORMAL';return `<span class="item-art typed-item-art" style="--item-type:${TYPE_COLORS[type]||'#b9b4a0'}" title="${esc(type)} move codex"><img src="${ROOT}codex.webp" alt="" style="filter:hue-rotate(${(hues[type]||0)-205}deg)"></span>`;}
