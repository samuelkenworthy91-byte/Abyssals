// Approved Triskit branches, with save-stable species and item IDs.
// All eight Triskit forms evolve by their matching item alone, with no minimum level.
const FORMS = [
  {
    "id": "575",
    "name": "Coldsmith",
    "types": [
      "ICE",
      "STEEL"
    ],
    "role": "Physical bulwark",
    "base": {
      "hp": 100,
      "attack": 95,
      "defence": 125,
      "sp_attack": 55,
      "sp_defence": 95,
      "speed": 45
    },
    "growth": {
      "hp": 65,
      "attack": 45,
      "defence": 90,
      "sp_attack": 10,
      "sp_defence": 70,
      "speed": 20
    },
    "abilities": [
      "Lamellar Frost",
      "Stoneplate",
      "Firm Stance"
    ],
    "item": "Winter Key",
    "itemId": "ITEM_EVOLUTION_WINTER_KEY",
    "icon": "winter-key",
    "learn": [
      105,
      319,
      321,
      104,
      369,
      325,
      329,
      323
    ]
  },
  {
    "id": "576",
    "name": "Ampish",
    "types": [
      "ELECTRIC",
      "FAIRY"
    ],
    "role": "Fast physical disruptor",
    "base": {
      "hp": 90,
      "attack": 105,
      "defence": 70,
      "sp_attack": 60,
      "sp_defence": 75,
      "speed": 115
    },
    "growth": {
      "hp": 45,
      "attack": 80,
      "defence": 30,
      "sp_attack": 15,
      "sp_defence": 40,
      "speed": 90
    },
    "abilities": [
      "Wink Ward",
      "Ambush",
      "Battle Rush"
    ],
    "item": "Winkbell",
    "itemId": "ITEM_EVOLUTION_WINKBELL",
    "icon": "winkbell",
    "learn": [
      64,
      346,
      700,
      75,
      337,
      65,
      550,
      73
    ]
  },
  {
    "id": "577",
    "name": "Grubstake",
    "types": [
      "ROCK",
      "BUG"
    ],
    "role": "Contact-punishing breaker",
    "base": {
      "hp": 90,
      "attack": 120,
      "defence": 115,
      "sp_attack": 45,
      "sp_defence": 85,
      "speed": 60
    },
    "growth": {
      "hp": 60,
      "attack": 95,
      "defence": 75,
      "sp_attack": 10,
      "sp_defence": 45,
      "speed": 15
    },
    "abilities": [
      "Quarry Spill",
      "Thornhide",
      "Stoneplate"
    ],
    "item": "Quarry Husk",
    "itemId": "ITEM_EVOLUTION_QUARRY_HUSK",
    "icon": "quarry-husk",
    "learn": [
      239,
      213,
      243,
      228,
      365,
      229,
      214,
      211
    ]
  },
  {
    "id": "578",
    "name": "Toxiturn",
    "types": [
      "POISON",
      "DARK"
    ],
    "role": "Fast poison disruptor",
    "base": {
      "hp": 80,
      "attack": 100,
      "defence": 70,
      "sp_attack": 85,
      "sp_defence": 75,
      "speed": 105
    },
    "growth": {
      "hp": 45,
      "attack": 75,
      "defence": 30,
      "sp_attack": 40,
      "sp_defence": 35,
      "speed": 75
    },
    "abilities": [
      "Etching Venom",
      "Wayfarer",
      "Ambush"
    ],
    "item": "Nightstill Vial",
    "itemId": "ITEM_EVOLUTION_NIGHTSTILL_VIAL",
    "icon": "nightstill-vial",
    "learn": [
      144,
      292,
      294,
      521,
      368,
      298,
      138,
      304
    ]
  },
  {
    "id": "579",
    "name": "Kipnotic",
    "types": [
      "PSYCHIC",
      "DRAGON"
    ],
    "role": "Special setup caster",
    "base": {
      "hp": 85,
      "attack": 55,
      "defence": 75,
      "sp_attack": 115,
      "sp_defence": 100,
      "speed": 85
    },
    "growth": {
      "hp": 45,
      "attack": 10,
      "defence": 35,
      "sp_attack": 85,
      "sp_defence": 75,
      "speed": 50
    },
    "abilities": [
      "Dream Rebound",
      "Foresight",
      "Screenmender"
    ],
    "item": "Reverie Fan",
    "itemId": "ITEM_EVOLUTION_REVERIE_FAN",
    "icon": "reverie-fan",
    "learn": [
      200,
      271,
      198,
      277,
      376,
      197,
      750,
      281
    ]
  }
];

export const TRISKIT_ABILITIES = [
  {
    "name": "Lamellar Frost",
    "class": "Standard",
    "text": "Opposing Special-category attacks deal 20% less direct damage to the bearer. The reduction applies while the bearer is active and leaves physical, fixed and residual damage at their normal values."
  },
  {
    "name": "Wink Ward",
    "class": "Standard",
    "text": "Once per battle, while the bearer is active, block the first opposing single-target damaging move with effective priority above zero that would hit the bearer or its active partner. A miss or an already protected or immune target leaves the ward intact."
  },
  {
    "name": "Quarry Spill",
    "class": "Signature",
    "text": "Once per battle, after surviving an opposing physical contact move that deals HP damage, scatter one pile of rubble on the opposing side. The next grounded opponent to enter takes 1/8 of its maximum HP in entry damage, to a minimum of 1 HP and consumes the pile. Airborne entrants leave it in place. Clearcut Breeze can remove it."
  },
  {
    "name": "Etching Venom",
    "class": "Standard",
    "text": "the bearer can use a directly targeted, non-damaging poison move such as Venom Mark to poison or badly poison a Steel or Poison target. The bypass applies to type-based status immunity. Toxinproof, Sanctuary Air, existing major status and Poison attack damage immunities still apply."
  },
  {
    "name": "Dream Rebound",
    "class": "Signature",
    "text": "Once per battle, reflect the first opposing single-target non-damaging move that would inflict a major status on the bearer. The original status is stopped and the same status is attempted on the attacker. The attacker’s usual immunities and protections apply. A reflected effect cannot trigger another reflection."
  },
  {
    "name": "Slow Read",
    "class": "Standard",
    "text": "Damaging moves deal 20% more direct damage against an opponent that has already acted this round."
  },
  {
    "name": "Curtain Fall",
    "class": "Standard",
    "text": "On its first entry each battle, clear the damage screens on both sides."
  }
];
const LEVELS = [0, 0, 34, 38, 42, 46, 50, 54];

export const TRISKIT_EVOLUTIONS = FORMS.map(form => ({
  id: 'EVOLUTION-TRISKIT-' + form.id,
  from_species_id: '115',
  to_species_id: form.id,
  condition: {method:'ITEM', item_id:form.itemId, consumed:true},
  approvedExpansion:true,
}));

export const TRISKIT_ITEMS = FORMS.map(form => ({
  id:form.itemId, name:form.item, category:'evolution', buy_price:4500,
  currency:'STANDARD', stack_limit:99, effect_text:'Triskit → ' + form.name,
  effect:{operation:'evolve', from_species_id:'115', to_species_id:form.id, consumed:true},
  guaranteed_source:'Marasen Evolution Atelier',
}));

export const TRISKIT_ITEM_ART = Object.fromEntries(FORMS.map(form => [form.itemId, form.icon]));

export function installTriskitBranches(data) {
  for (const form of FORMS) {
    const [primary,secondary,hidden] = form.abilities;
    const ability_names = {primary,secondary,hidden};
    data.species.push({
      id:form.id, dex_number:Number(form.id), name:form.name, family_id:'FAMILY-115',
      types:form.types, role:form.role, stage:'Final', power_class:'Standard Final',
      base_stats:form.base, bst:515, growth_percent:form.growth, growth_balance_version:1,
      ability_names, abilities:Object.fromEntries(Object.entries(ability_names).map(([slot,name])=>[slot,'ABILITY_'+name.toUpperCase().replaceAll(' ','_')])),
      companion_motion:'walk',
      moveset_identity:{style:form.role, category:form.name==='Kipnotic'?'SPECIAL':'PHYSICAL'},
    });
    form.learn.forEach((move_id,index)=>{
      const move=data.moves.find(row=>row.id===move_id);
      data.learnsets.push({species_id:form.id, move_id, name:move.name, level:LEVELS[index], method:'LEVEL_UP'});
    });
  }
}
