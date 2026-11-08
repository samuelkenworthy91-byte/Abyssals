import {DOSSIER_CONFIG as C,PHANTOM_FALCHION_ID} from './dossier-config.js?v=0.90.60';
import {canonicalMoveId} from './teamcraft-data.js?v=0.90.60';

export const DOSSIER_SPECIES=C.species;
export const DOSSIER_EVOLUTIONS=C.evolutions;
export const DOSSIER_IDS=C.ids;
export const NECTARBANE_ID=810;
export const THUNDER_SHARD={id:'ITEM_DOSSIER_THUNDER_SHARD',name:'Thunder Shard',category:'evolution',buy_price:3500,currency:'STANDARD',stack_limit:99,effect_text:'Voltisl → Thunderaze at Lv. 30+.',effect:{operation:'evolve',from_species_id:C.ids.Voltisl,to_species_id:C.ids.Thunderaze,minimum_level:30,consumed:true},guaranteed_source:'Stormglass Bluffs traveller; one guaranteed gift',renewable_source:'Marasen department store'};
export const DOSSIER_ABILITIES=[
 ['Ancestral Aid','After a damaging special move hits, gains one Special Attack stage. Grants up to three stages before switching out or using Phantom Falchion. Phantom Falchion itself grants no stage.'],
 ['Floodplain','If rain begins while active or is present on entry, raises Defence one stage, once per switch-in.'],
 ['Palimpsest','After taking direct damage from a move, further hits from the same move ID deal 25% less damage until switching out.'],
 ['Symbiotic Bloom','Doubles move-based recovery on its active side, capped at 75% of each recipient’s maximum HP per selected move. Opposing damaging statuses gain 10%; multiple bearers do not stack.'],
 ['Canopy Blessing','After successfully using a status move, restores 1/16 max HP at turn end, or 1/10 on Grassy Terrain.'],
 ['Bramble Furnace','A chosen damaging Grass move primes the next physical Fire move for 20% extra damage. Fuel expires after two subsequent actions or switching.'],
 ['Cinderweave','Opposing voluntary switches have an 80% chance to fail. Incoming attacks gain one critical stage. Forced switches, escape abilities and scripted transitions bypass the web.'],
 ['Royal Temper','Once per battle, surviving an enemy move that crosses from above half HP to half or below raises Attack and Speed by one stage.'],
 ['Ancient Counsel','After its first completed round following entry, gains one Special Defence stage and heals 1/16 max HP, or 1/12 in unsuppressed weather.'],
 ['Molten Carapace','Contact attackers lose 1/12 max HP, or 1/8 if the bearer’s previous chosen move was Steel. Does not stack with Reprisal Helm.'],
 ['Pitfall Crown','Each opposing attacker that damages the bearer with contact loses one Speed stage, once per attacker per battle.'],
 ['Lantern Thirst','Bug/Ghost direct damage restores 20% of damage dealt, capped at 1/8 max HP per round across all targets and hits.'],
 ['Snowshroud','During unsuppressed hail or snow, gains one effective evasion stage, respecting the usual cap and never storing stages.'],
 ['Third Eye','The first status move after entry gains +1 priority and ignores the bearer’s accuracy reductions. It does not ignore the target’s evasion.'],
 ['Assassin’s Cadence','Consecutive successful uses of the same damaging move gain 10 percentage points of critical chance per repeat, up to 30; total ordinary chance caps at 50%. Failure, a different action or switching resets the chain.'],
 ['Flying Buttress','Once per battle, the first real damaging hit is reduced by 20%; surviving it raises Defence one stage.'],
 ['Devil Orchard','Every third completed active round raises one random combat stat by one stage. Switching resets the timer.'],
 ['Rainwake','Summons five rounds of rain on entry; uses the shared weather system.'],
 ['Whiteout Pelt','For three rounds after entry, contact attackers have a 30% chance to lose one Speed stage. In unsuppressed snow/hail, restores 1/16 HP at round end while the veil lasts.'],
 ['Thundercoil','Two successful selected Electric attacks charge the next physical Electric move for 20% extra damage. The boosted action cannot recharge itself; switching clears charge.'],
 ['Heartwood Vigil','Once per battle, surviving enemy move damage crossing half HP restores 1/12 HP and raises Defence one stage.'],
 ['Bedrock Engine','Entry prevents forced switching for three rounds and empowers the first selected Ground attack by 20%.'],
 ['Carrion Thirst','When an opponent actually loses HP to poison, restores 1/16 max HP, once per completed round.'],
 ['Stormbed','Summons Electric Terrain for five rounds on entry unless World Anchor prevents the change. No automatic Speed boost.'],
 ['Overclock Dynamo','A successful chosen contact attack charges the next Electric attack for 25% extra damage within three rounds. A boosted action cannot recharge itself.']
].map(([name,text])=>({id:'ABILITY_'+name.toUpperCase().replace(/[^A-Z0-9]+/g,'_'),name,text,effect_text:text,dossierAbility:true}));

// Retired move IDs are mapped through the existing save-compatible alias registry.
const corrections={0:8};
const overrides={
 [C.ids.Pomantler]:[[1,79],[1,94],[8,78],[15,760],[23,206],[31,84],[39,96],[47,702],[55,89],[64,85]],
 [C.ids.Pebbloyle]:[[1,240],[1,1],[9,239],[16,223],[22,237]],
 [C.ids.Slateryx]:[[1,240],[1,1],[9,239],[16,223],[22,237],[23,228],[30,230],[37,229],[43,232]],
 [C.ids.Cathedralyx]:[[1,240],[1,1],[9,239],[16,223],[22,237],[23,228],[30,230],[37,229],[43,232],[45,231],[52,224],[58,228],[64,176],[71,234]],
 [C.ids.Terraforge]:[[1,153],[1,315],[10,239],[18,155],[26,319],[34,152],[41,170],[48,164],[55,326],[63,165]]
};
export function installDossiers(data){
 if(data.dossierVersion===1)return;
 for(const s of C.species){if(data.species.some(x=>x.id===s.id||x.name===s.name))throw Error('Dossier species collision: '+s.name);data.species.push({...s,base_stats:{...s.base_stats},growth_percent:{...s.growth_percent},abilities:Object.fromEntries(Object.entries(s.ability_names).map(([k,n])=>[k,'ABILITY_'+n.toUpperCase().replace(/[^A-Z0-9]+/g,'_')])),growth_balance_version:1});}
 if(data.moves.some(m=>m.id===NECTARBANE_ID))throw Error('Nectarbane ID collision');
 data.moves.push({id:NECTARBANE_ID,name:'Nectarbane',type_id:'POISON',category:'STATUS',power:null,accuracy:90,pp:10,priority:0,target:'SINGLE_FOE',effects:[{effect_id:'nectarbane'}],effect_text:'Inflict ordinary poison on one foe. Only a newly inflicted poison restores 1/8 max HP; Symbiotic Bloom doubles this to 1/4.',signature_owner_family:'FAMILY-520',dossierMove:true});
 if(data.moves.some(m=>m.id===PHANTOM_FALCHION_ID))throw Error('Phantom Falchion ID collision');
 data.moves.push({
  id:PHANTOM_FALCHION_ID, name:'Phantom Falchion', type_id:'GHOST', category:'SPECIAL',
  power:70, accuracy:100, pp:10, priority:0, target:'SINGLE_FOE', effects:[],
  effect_text:'Gains 10 power per positive stat stage. After execution, clears positive stages and resets Ancestral Aid, even on a miss, block or immunity.',
  signature_owner_family:'FAMILY-574', dossierMove:true,
  authored_visual_action:'Ancestral shades gather in the falchion, then a hooked crescent flies to the chosen foe and shatters.'
 });
 for(const s of C.species){
  const rows=overrides[s.id]||C.learnsets[s.id];const seen=new Set();
  for(const [level,oldId]of rows){let move_id=oldId===0&&s.family_id==='FAMILY-520'?NECTARBANE_ID:canonicalMoveId(corrections[oldId]??oldId);
   // Fix mistaken Ground/Poison catalogue references without changing existing moves.
   if(s.family_id==='FAMILY-536'&&oldId===151)move_id=170;
   move_id=({97:549,209:206,116:107,76:74})[move_id]??move_id;
   const m=data.moves.find(m=>m.id===move_id);if(!m)throw Error('Missing dossier move '+s.name+' '+move_id);
   if(m.signature_owner_family&&m.signature_owner_family!==s.family_id)throw Error('Exclusive move in dossier '+s.name+' '+m.name);
   if(seen.has(move_id))continue;seen.add(move_id);data.learnsets.push({species_id:s.id,move_id,name:m.name,level,method:'LEVEL_UP',dossierSpecies:true});
  }
 }
 const field=data.moves.find(m=>m.id===71);field.effects=field.effects.filter(e=>e.effect_id!=='terrain').concat({effect_id:'terrain',terrain:'ELECTRIC',turns:5});field.effect_text='Sets Electric Terrain for five rounds. Also tests opposing paralysis at 25% each round for three rounds.';
 data.dossierVersion=1;
}
