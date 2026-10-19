// Small, biome-led pools. A road's stretches share species; only levels rise.
export const ROAD_POOLS={
 march:{name:'Civeton March',biome:'alpine',DAY:['010','210','121','222','190'],NIGHT:['010','210','121','231','188']},
 scrub:{name:'Dorelem Scrub',biome:'desert',DAY:['014','035','025','010','107'],NIGHT:['014','035','025','027','099']},
 tunnels:{name:'Dorelem Service Tunnels',biome:'sewer',DAY:['014','016','107','110','325'],NIGHT:['014','016','107','099','069']},
 northRoad:{name:'North Scrub Road',biome:'desert',DAY:['014','035','025','141','036'],NIGHT:['014','035','025','027','099']},
 hospiceRoad:{name:'Hospice Road',biome:'subtropical',DAY:['042','060','152','141','090'],NIGHT:['042','060','152','099','160']},
 medicinePath:{name:'Flooded Medicine Path',biome:'floodplain',DAY:['051','079','139','133','110'],NIGHT:['051','079','139','053','267']}
};
// Four familiar or biome-appropriate residents plus one 5% local find.
export const SIDE_POOLS={
 marchMeadow:{biome:'alpine',min:8,max:10,DAY:['010','210','121','222','361'],NIGHT:['010','210','121','231','361']},
 burrowHollow:{biome:'dark-cave',min:14,max:16,DAY:['025','107','027','099','335'],NIGHT:['025','107','027','231','335']},
 glassSluice:{biome:'mineral-pools',min:18,max:20,DAY:['051','139','016','107','301'],NIGHT:['051','139','016','107','301']},
 emberQuarry:{biome:'forge',min:20,max:22,DAY:['249','361','025','107','315'],NIGHT:['249','361','025','107','315']},
 stormBluffs:{biome:'cold-cliffs',min:23,max:25,DAY:['025','107','099','012','299'],NIGHT:['025','107','099','012','299']},
 orchardCanopy:{biome:'subtropical',min:26,max:28,DAY:['042','060','152','141','337'],NIGHT:['042','060','152','099','337']},
 reedSanctuary:{biome:'reeds',min:28,max:30,DAY:['051','079','139','133','261'],NIGHT:['051','079','139','053','261']},
 coralGrotto:{biome:'coral',min:33,max:35,DAY:['051','079','139','133','270'],NIGHT:['051','079','139','053','270']},
 moonlitDepths:{biome:'tide-pools',min:36,max:38,DAY:['051','079','139','133','255'],NIGHT:['051','079','139','053','255']},
 relicCrags:{biome:'ruins',min:31,max:33,DAY:['025','107','014','077','349'],NIGHT:['025','107','014','077','351']}
};
export const FORT_POOLS=[['021','255','349','351'],['255','022','301','321'],['022','268','321','351'],['022','257','377','380'],['269','326','350','384','272']];
export const POOL_WEIGHTS=[35,25,20,15,5];
