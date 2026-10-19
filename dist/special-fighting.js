// Shared special Fighting options; approved separately from the proposed new creatures.
const provenance={authoring:'User requested five special Fighting moves and existing compatible learnsets, 2026-10-13'};
const move=(id,name,power,accuracy,pp,effects,action)=>({id,name,type_id:'FIGHTING',category:'SPECIAL',target:'SINGLE_FOE',power,accuracy,pp,priority:0,effects,effect_text:id===464?'Restores HP equal to 25% of damage dealt.':id===465?'Always hits, ignoring accuracy and evasion stages.':'Deals special Fighting damage.',signature_owner_family:null,signature_owner_name:null,authored_visual_action:action,sceneAction:({461:'pulse',462:'ripple',463:'rake',464:'coil',465:'pierce'})[id],approvedSpecialFighting:true,unresolved_fields:[],provenance});
export const SPECIAL_FIGHTING_MOVES=[
 move(461,'Wake Palm',40,100,25,[],'A small palm-shaped pressure wave snaps forward, then splinters into five sparks.'),
 move(462,'Undertow Pulse',70,100,15,[],'Three orange pressure rings draw inward before a concentrated outward pulse.'),
 move(463,'Breaker Aura',100,95,10,[],'A towering martial aura compresses into a broad crescent and detonates on impact.'),
 move(464,'Sapping Spiral',75,100,10,[{effect_id:'drain',actual_hp_damage_fraction:[1,4]}],'A spiral of aura strikes, then four restorative wisps curl back to the caster.'),
 move(465,'Focus Lance',80,'ALWAYS',15,[],'A narrow focused aura lance aligns, pierces its target and leaves a clean radiant trail.')
];
export const SPECIAL_FIGHTING_FAMILIES={
 'FAMILY-240':[[1,461],[16,462],[34,463]],
 'FAMILY-307':[[1,461],[14,462],[24,464],[40,465]],
 'FAMILY-311':[[1,461],[22,464],[36,463]],
 'FAMILY-315':[[1,461],[18,462],[38,465]]
};
export function installSpecialFighting(data){if(data.specialFightingVersion===1)return;data.moves.push(...SPECIAL_FIGHTING_MOVES.filter(m=>!data.moves.some(old=>old.id===m.id)));for(const s of data.species){const rows=SPECIAL_FIGHTING_FAMILIES[s.family_id];if(!rows)continue;s.specialFightingToolkit=true;s.moveset_identity.plan+=' Special Fighting aura attacks provide an alternative using its equally strong Special Attack.';for(const [level,move_id]of rows){if(data.learnsets.some(l=>l.species_id===s.id&&l.move_id===move_id))continue;const row={species_id:s.id,move_id,name:SPECIAL_FIGHTING_MOVES.find(m=>m.id===move_id).name,level,method:'LEVEL_UP',expansion:true,identity:true,identity_core:true,approvedSpecialFighting:true,provenance};data.learnsets.push(row);data.authoredLearnsets?.push({...row});}}data.learnsets.sort((a,b)=>a.species_id.localeCompare(b.species_id)||a.level-b.level||a.move_id-b.move_id);data.specialFightingVersion=1;}
