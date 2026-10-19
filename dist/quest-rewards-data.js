// Permanent expedition prizes; item multipliers affect battle values, not growth.
export const QUEST_HELD_ITEMS=[
 ['COUNTERWEIGHT','Counterweight Band','Defence ×1.20; Speed ×0.90.',{operation:'quest_stats',stats:{defence:1.2,speed:.9}}],
 ['FURNACE','Furnace Bracer','Physical Fire and Steel attacks deal ×1.15 damage.',{operation:'quest_damage',types:['FIRE','STEEL'],category:'PHYSICAL',multiplier:1.15}],
 ['TIDEGLASS','Tideglass Charm','Living Water-type holders recover 1/16 max HP each turn.',{operation:'end_turn_heal',max_hp_fraction:[1,16],holderType:'WATER'}],
 ['MOURNING','Mourning Veil','The first super-effective hit each battle deals 25% less damage.',{operation:'quest_ward',condition:'super',multiplier:.75}],
 ['BOATWRIGHT','Boatwright’s Brace','The first physical hit each battle deals 30% less damage.',{operation:'quest_ward',condition:'physical',multiplier:.7}],
 ['DEFENDER','Defender’s Pennant','After a voluntary switch, your next hit received deals 25% less damage, once per battle.',{operation:'quest_ward',condition:'switch',multiplier:.75}],
 ['MERCY','Mercy Chalice','All HP recovery received is doubled, including medicine, healing moves and drain. Caps at max HP; cannot revive.',{operation:'healing_received',multiplier:2}]
].map(([key,name,effect_text,effect])=>({id:'HELD_QUEST_'+key,name,effect_text,effect,category:'held',stack_limit:99,buy_price:0,held_role:'QUEST',provenance:{authoring:'Approved expedition reward, October 2026'}}));
const move=(id,name,type,category,power,pp,effects,types,description,action)=>({id,name,type_id:type,category,power,pp,accuracy:100,priority:0,target:category==='STATUS'?'SELF':'SINGLE_FOE',effects,questTutor:true,tutorTypes:types,effect_text:description,authored_visual_action:action,contact:false,provenance:{authoring:'Approved repeatable expedition tutor, October 2026'}});
export const SECRET_MOVES=[
 move(471,'Prism Ward','WATER','STATUS',null,15,[{effect_id:'stat_stage',stat:'sp_defence',stages:2,target:'SELF',chance_percent:100}],['WATER','PSYCHIC'],'Raise Special Defence by two stages.','Three glass sluice prisms gather waterlight into a transparent guardian shell.'),
 {...move(472,'Beacon Bolt','ELECTRIC','SPECIAL',70,10,[],['ELECTRIC','FLYING'],'Ignores accuracy and evasion changes. Type and ability immunities still apply.','An old beacon ignites and guides a golden lightning lance precisely to the foe.'),accuracy:'ALWAYS'},
 move(473,'Quiet Passage','DARK','STATUS',null,5,[{effect_id:'next_hit_damage_multiplier',uses:1,multiplier:.6,target:'SELF',chance_percent:100}],['DARK','GHOST'],'The next damaging hit received is reduced by 40%. Reusing it does not stack.','A hooded ferry lantern draws a dark veil around the partner; its next impact breaks the veil.'),
 move(474,'Tide Turn','WATER','SPECIAL',75,10,[{effect_id:'stat_stage',stat:'attack',stages:-1,target:'FOE',chance_percent:100}],['WATER'],'Damage the foe and lower its Attack by one stage.','A wooden jetty guides a rolling silver-blue current that unbalances the foe.')
];
export const QUEST_REWARDS={
 marchMeadow:{kind:'gift',title:'Nursery companion',text:'Choose one of three juveniles with normal growth rolls.'},
 burrowHollow:{kind:'held',items:['COUNTERWEIGHT'],title:'Counterweight Band'},
 glassSluice:{kind:'tutor',move:471,title:'Prism Ward · permanent tutor'},
 emberQuarry:{kind:'held',items:['FURNACE'],title:'Furnace Bracer'},
 stormBluffs:{kind:'tutor',move:472,title:'Beacon Bolt · permanent tutor'},
 orchardCanopy:{kind:'recipe',title:'Winter Preserve ×4 and recipe'},
 reedSanctuary:{kind:'attunement',title:'Attunement Manual · ability selection'},
 coralGrotto:{kind:'held',items:['TIDEGLASS'],title:'Tideglass Charm'},
 moonlitDepths:{kind:'held',items:['MOURNING','MERCY'],title:'Mourning Veil and Mercy Chalice'},
 relicCrags:{kind:'core',title:'Choose one Rivet evolution core'},
 philomereBackwaters:{kind:'held',items:['BOATWRIGHT'],title:'Boatwright’s Brace'},
 smugglersWeir:{kind:'tutor',move:473,title:'Quiet Passage · permanent tutor'},
 saltFlats:{kind:'awakening',title:'Awakening Sigil ×1'},
 rescueGlade:{kind:'held',items:['DEFENDER'],title:'Defender’s Pennant'},
 anglersReach:{kind:'tutor',move:474,title:'Tide Turn · permanent tutor'}
};
export const WINTER_PRESERVE={key:'winterPreserves',id:'winter-preserve',name:'Winter Preserve',price:650,text:'3× Trail Bread strength for Grass/Bug Abyssals; 2× for others. Recipe unlocked by Roots for the Hungry.'};
export const preserveStrength=u=>u?.species?.types?.some(t=>['GRASS','BUG'].includes(t))?3:2;

export const QUEST_HIDDEN_ABILITIES=[
 {name:'Forge Balance',class:'Hidden',text:'After a damaging move connects, the next damaging move of the other category deals 20% more damage. Alternating physical and special attacks maintains the bonus.'},
 {name:'Reef Sentinel',class:'Hidden',text:'The first super-effective hit received each battle deals 20% less damage.'},
 {name:'Lunar Wisdom',class:'Hidden',text:'A successful damaging Psychic attack restores 1/16 maximum HP to its living user.'},
 {name:'Warm Current',class:'Hidden',text:'While sunlight is active, recover 1/16 maximum HP at the end of each turn.'},
 {name:'Tidal Footwork',class:'Hidden',text:'Your first voluntary switch into battle raises Speed one stage.'}
];
export function installQuestAbilityAlternatives(data){for(const [ids,name]of [[['361','362','363'],'Forge Balance'],[['376','377'],'Reef Sentinel'],[['378','379','380'],'Lunar Wisdom'],[['381'],'Warm Current'],[['382','383','384'],'Tidal Footwork']])for(const id of ids){const s=data.species.find(s=>s.id===id);if(s){s.ability_names.hidden=name;s.abilities.hidden='ABILITY_QUEST_'+name.toUpperCase().replaceAll(' ','_');}}}
