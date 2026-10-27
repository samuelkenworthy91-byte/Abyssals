import {ORCHARD_ABILITIES} from './tide-orchard-data.js?v=0.90.47';
import {BRANCH_ABILITIES} from './branch-families.js?v=0.90.41';
import {RENEWAL_ABILITIES} from './evolution-renewal-data.js?v=0.90.41';
import {ABILITY_PATCHES} from './teamcraft-data.js?v=0.90.41';
import {BIRD_ABILITIES} from './bird-abilities.js?v=0.90.41';
import {PALADIN_ABILITIES} from './paladin-data.js?v=0.90.41';
import {MENAGERIE_ABILITIES} from './menagerie-family.js?v=0.87.0';
import {MIASMA_ABILITY} from './miasma-family.js?v=0.87.0';
import {QUEST_HIDDEN_ABILITIES} from './quest-rewards-data.js?v=0.90.41';
import {AQUATIC_ABILITIES} from './approved-aquatic.js?v=0.87.0';
import {WARBOND_ABILITY} from './relic-family.js?v=0.87.0';
import {EXPEDITION_ABILITIES} from './expedition-ability-data.js?v=0.90.41';
// Authored Ability Glossary, Regional_Dex_Stats_and_Abilities_COMPLETE_v2.xlsx.
export const ABILITIES=[
  {
    "name": "Adaptable Hide",
    "class": "Standard",
    "text": "After it is hit by a damaging move, further damage from that move's type is reduced by 20% until this monster switches out."
  },
  {
    "name": "Alternator",
    "class": "Standard",
    "text": "A damaging move deals 10% more damage if it is a different type from this monster's previous damaging move."
  },
  {
    "name": "Ambush",
    "class": "Standard",
    "text": "The first damaging move used after entering battle deals 10% more damage."
  },
  {
    "name": "Battle Nerve",
    "class": "Standard",
    "text": "Opponents cannot lower this monster's Attack."
  },
  {
    "name": "Battle Rush",
    "class": "Standard",
    "text": "After this monster knocks out a foe, its Speed rises by 1 stage. Can trigger once per switch-in."
  },
  {
    "name": "Berry Hoard",
    "class": "Standard",
    "text": "Once per battle, a Berry consumed by this monster regrows two turns later if it is still active and has no held item."
  },
  {
    "name": "Bindproof",
    "class": "Standard",
    "text": "This monster cannot be trapped, and residual damage from binding moves is halved."
  },
  {
    "name": "Bulwark",
    "class": "Standard",
    "text": "Damage from contact moves is reduced by 20%."
  },
  {
    "name": "Calm Guard",
    "class": "Standard",
    "text": "Opponents cannot lower this monster's Sp. Def."
  },
  {
    "name": "Camouflage",
    "class": "Standard",
    "text": "The first damaging hit taken after entering battle is reduced by 15% if the move is not super effective."
  },
  {
    "name": "Capacitor",
    "class": "Rare",
    "text": "Electric-type moves deal no damage to this monster and instead raise its Sp. Atk by 1 stage."
  },
  {
    "name": "Celestial Tempest",
    "class": "Signature",
    "text": "On entry, creates Tempest for 5 turns. Electric moves deal 20% more damage and Dragon moves 10% more; other weather is replaced."
  },
  {
    "name": "Chorus",
    "class": "Standard",
    "text": "Sound-based moves used by this monster deal 20% more damage."
  },
  {
    "name": "Cinderhide",
    "class": "Standard",
    "text": "A foe making contact has a 15% chance to be burned."
  },
  {
    "name": "Clear Judgment",
    "class": "Signature",
    "text": "On entry, removes this monster's negative stat stages. While it is active, opponents cannot raise evasion."
  },
  {
    "name": "Coldproof",
    "class": "Standard",
    "text": "This monster cannot be frozen."
  },
  {
    "name": "Conqueror's Spark",
    "class": "Signature",
    "text": "The first time this monster scores a knockout each battle, its Speed rises by 1 stage and its next Fire- or Electric-type move deals 20% more damage."
  },
  {
    "name": "Countercharge",
    "class": "Standard",
    "text": "After taking damage from a contact move, Attack rises by 1 stage. Can trigger once per switch-in."
  },
  {
    "name": "Covetous Mirror",
    "class": "Rare",
    "text": "The first time an opponent raises one or more stats after this monster enters, this monster copies one of those positive stat stages."
  },
  {
    "name": "Earthroot",
    "class": "Standard",
    "text": "Restores 1/16 of maximum HP at the end of each turn while Grassy or Ground terrain is active."
  },
  {
    "name": "Feast",
    "class": "Standard",
    "text": "Healing received from held Berries is increased by 50%."
  },
  {
    "name": "Feintstep",
    "class": "Standard",
    "text": "After successfully using a non-damaging move, Speed rises by 1 stage. Can trigger once per switch-in."
  },
  {
    "name": "Firm Stance",
    "class": "Standard",
    "text": "Opponents cannot force this monster to switch out."
  },
  {
    "name": "First Strike",
    "class": "Standard",
    "text": "Damaging moves deal 10% more damage when this monster acts before its target."
  },
  {
    "name": "Floodplain",
    "class": "Rare",
    "text": "If rain is active when this monster enters, or rain begins while it is active, Defense rises by 1 stage. Can trigger once per switch-in."
  },
  {
    "name": "Focus Edge",
    "class": "Standard",
    "text": "Moves with an increased critical-hit ratio gain one additional critical-hit stage."
  },
  {
    "name": "Forager",
    "class": "Standard",
    "text": "Whenever this monster consumes a Berry, it also restores 1/16 of its maximum HP."
  },
  {
    "name": "Foresight",
    "class": "Standard",
    "text": "The first super-effective hit taken after entering battle is reduced by 20%."
  },
  {
    "name": "Gatekeeper",
    "class": "Rare",
    "text": "If this monster enters as the last conscious member of its party, Defense and Sp. Def each rise by 1 stage."
  },
  {
    "name": "Ghost Hull",
    "class": "Rare",
    "text": "Once per battle, if at full HP, a hit that would knock this monster out leaves it at 1 HP instead."
  },
  {
    "name": "Hard Head",
    "class": "Standard",
    "text": "This monster takes no recoil damage from its own attacks."
  },
  {
    "name": "Heartwood Core",
    "class": "Rare",
    "text": "Once per battle, when HP falls to one-third or less, this monster restores 25% of its maximum HP."
  },
  {
    "name": "Hovercore",
    "class": "Rare",
    "text": "Ground-type moves do not affect this monster."
  },
  {
    "name": "Improviser",
    "class": "Signature",
    "text": "A damaging move deals 15% more damage when it is a different type from this monster's previous damaging move."
  },
  {
    "name": "Keen Sense",
    "class": "Standard",
    "text": "Opponents cannot lower this monster's accuracy."
  },
  {
    "name": "Last Stand",
    "class": "Rare",
    "text": "If this monster enters as the last conscious party member, Attack and Speed each rise by 1 stage."
  },
  {
    "name": "Many Banners",
    "class": "Signature",
    "text": "At battle start, if the party contains at least four different primary types among conscious members, this monster's Sp. Def rises by 1 stage."
  },
  {
    "name": "Marked Quarry",
    "class": "Standard",
    "text": "The first foe damaged by this monster after entry becomes marked. This monster deals 10% more damage to it until that foe switches out or faints."
  },
  {
    "name": "Medicinal Sap",
    "class": "Standard",
    "text": "HP restored by this monster's healing moves is increased by 15%."
  },
  {
    "name": "Mimic Ear",
    "class": "Rare",
    "text": "After this monster is hit by a sound-based move, its next sound-based move deals 50% more damage."
  },
  {
    "name": "Oath Roar",
    "class": "Signature",
    "text": "Sound-based moves deal 20% more damage; the first sound move used after entry also raises this monster's Attack by 1 stage."
  },
  {
    "name": "Oathkeeper",
    "class": "Signature",
    "text": "When this monster enters immediately after an ally faints, Defense and Sp. Def each rise by 1 stage."
  },
  {
    "name": "Opportunist",
    "class": "Standard",
    "text": "Damaging moves deal 15% more damage to targets at half HP or less."
  },
  {
    "name": "Pack Guard",
    "class": "Standard",
    "text": "Damage taken is reduced by 10% while at least one other conscious party member remains."
  },
  {
    "name": "Palimpsest",
    "class": "Rare",
    "text": "After being hit by a damaging move, further hits from that same named move deal 25% less damage until this monster switches out."
  },
  {
    "name": "Patience",
    "class": "Standard",
    "text": "After a turn in which this monster deals no damage, its next damaging move deals 20% more damage."
  },
  {
    "name": "Poison Barbs",
    "class": "Standard",
    "text": "A foe making contact has a 20% chance to be poisoned."
  },
  {
    "name": "Proof by Cut",
    "class": "Signature",
    "text": "After two consecutive damaging moves hit, this monster's next damaging move gains one extra critical-hit stage. Missing or switching resets the count."
  },
  {
    "name": "Protector",
    "class": "Standard",
    "text": "When this monster enters immediately after an ally faints, Defense rises by 1 stage."
  },
  {
    "name": "Pursuit Instinct",
    "class": "Standard",
    "text": "If the target attempts to switch out that turn, this monster's damaging move against it deals 30% more damage."
  },
  {
    "name": "Rainrunner",
    "class": "Standard",
    "text": "Speed is increased by 50% while rain is active."
  },
  {
    "name": "Rallying Cry",
    "class": "Standard",
    "text": "Opponents cannot lower this monster's Attack; in multi-mon battles, active allies receive the same protection."
  },
  {
    "name": "Renewal",
    "class": "Standard",
    "text": "This monster's non-volatile status condition is cured when it switches out."
  },
  {
    "name": "Reservoir",
    "class": "Rare",
    "text": "Water-type moves deal no damage to this monster and instead restore 25% of its maximum HP."
  },
  {
    "name": "Revenge Mark",
    "class": "Standard",
    "text": "After this monster is damaged, its next damaging move against that attacker deals 20% more damage."
  },
  {
    "name": "Royal Glare",
    "class": "Signature",
    "text": "When this monster enters battle, the opposing active monster's Speed falls by 1 stage."
  },
  {
    "name": "Safekeep",
    "class": "Standard",
    "text": "This monster's held item cannot be removed, stolen or swapped by an opponent."
  },
  {
    "name": "Sandcoat",
    "class": "Standard",
    "text": "This monster takes no damage from sandstorm weather."
  },
  {
    "name": "Scavenger",
    "class": "Standard",
    "text": "Once per battle, after an opposing monster faints, this monster restores a Berry it previously consumed if it is holding no item."
  },
  {
    "name": "Screenmender",
    "class": "Rare",
    "text": "Reflect and Light Screen created by this monster last two additional turns."
  },
  {
    "name": "Septic Hunger",
    "class": "Signature",
    "text": "Damaging moves deal 20% more damage to poisoned or badly poisoned targets."
  },
  {
    "name": "Siege Breaker",
    "class": "Standard",
    "text": "After this monster deals direct damage, it removes Reflect and Light Screen from the opposing side."
  },
  {
    "name": "Sinmark",
    "class": "Signature",
    "text": "The first foe damaged after entry is marked. This monster's attacks ignore that marked foe's positive Defense and Sp. Def stat stages."
  },
  {
    "name": "Snowfoot",
    "class": "Standard",
    "text": "Speed is increased by 50% while hail or snow is active."
  },
  {
    "name": "Soundproof",
    "class": "Standard",
    "text": "Sound-based moves do not affect this monster."
  },
  {
    "name": "Sovereign Decree",
    "class": "Signature",
    "text": "On entry, creates Decree for 5 turns: opponents cannot raise evasion or lower this monster's side's stats."
  },
  {
    "name": "Stable Core",
    "class": "Rare",
    "text": "Opponents cannot lower any of this monster's stats."
  },
  {
    "name": "Static Hide",
    "class": "Standard",
    "text": "A foe making contact has a 20% chance to be paralyzed."
  },
  {
    "name": "Steamheart",
    "class": "Rare",
    "text": "Damage from Water-type moves is halved. After being hit by one, Sp. Atk rises by 1 stage once per switch-in."
  },
  {
    "name": "Stoneplate",
    "class": "Standard",
    "text": "Damage received from critical hits is reduced by 25%."
  },
  {
    "name": "Stored Charge",
    "class": "Signature",
    "text": "Contact hits give one Charge, up to 2. The next Electric- or Fighting-type damaging move consumes all Charges for +15% damage per Charge."
  },
  {
    "name": "Stormsense",
    "class": "Standard",
    "text": "When the weather changes while this monster is active, Speed rises by 1 stage. Can trigger once per switch-in."
  },
  {
    "name": "Strategem",
    "class": "Signature",
    "text": "If a foe uses the same move on consecutive turns, this monster deals 15% more damage to that foe until it changes move or switches."
  },
  {
    "name": "Sunstride",
    "class": "Standard",
    "text": "Speed is increased by 50% while harsh sunlight is active."
  },
  {
    "name": "Surefoot",
    "class": "Standard",
    "text": "Opponents cannot lower this monster's Speed."
  },
  {
    "name": "Thick Pelt",
    "class": "Standard",
    "text": "Damage from Fire- and Ice-type moves is reduced by 25%."
  },
  {
    "name": "Thornhide",
    "class": "Standard",
    "text": "A foe making contact loses 1/16 of its maximum HP."
  },
  {
    "name": "Tithe Charge",
    "class": "Signature",
    "text": "Whenever any party member consumes a held item, this monster gains one Tithe Charge, up to 3. Its next Electric-type damaging move consumes them for +10% damage per Charge."
  },
  {
    "name": "Toxinproof",
    "class": "Standard",
    "text": "This monster cannot be poisoned or badly poisoned."
  },
  {
    "name": "Trailblazer",
    "class": "Standard",
    "text": "Damage this monster takes from entry hazards is reduced by 50%."
  },
  {
    "name": "Truce",
    "class": "Standard",
    "text": "After a turn in which this monster deals no damage, Sp. Def rises by 1 stage. Can trigger once per switch-in."
  },
  {
    "name": "Unfazed",
    "class": "Standard",
    "text": "This monster cannot flinch."
  },
  {
    "name": "Wayfarer",
    "class": "Standard",
    "text": "This monster cannot be trapped and may always switch out normally."
  },
  {
    "name": "Waystone Master",
    "class": "Signature",
    "text": "Entry-hazard damage is halved; when this monster enters, it removes one layer of entry hazards from its own side."
  },
  {
    "name": "Weakpoint Hunter",
    "class": "Standard",
    "text": "Super-effective damaging moves deal 10% more damage."
  },
  {
    "name": "Weather Calm",
    "class": "Rare",
    "text": "While this monster is active, weather remains in place but its residual damage and stat-modifying effects are suppressed."
  },
  {
    "name": "World Anchor",
    "class": "Signature",
    "text": "Opponents cannot change the active terrain or force this monster out. It restores 1/16 HP each turn on Grassy or Ground terrain."
  }
];

ABILITIES.push(...EXPEDITION_ABILITIES,WARBOND_ABILITY);

ABILITIES.push(...AQUATIC_ABILITIES);

ABILITIES.push(...QUEST_HIDDEN_ABILITIES);

ABILITIES.push(MIASMA_ABILITY);

ABILITIES.push(...MENAGERIE_ABILITIES);

ABILITIES.push(...PALADIN_ABILITIES);

ABILITIES.push(...BIRD_ABILITIES);

for(const a of ABILITIES)if(ABILITY_PATCHES[a.name])Object.assign(a,ABILITY_PATCHES[a.name]);

Object.assign(ABILITIES.find(a=>a.name==='Whiteout Sovereign'),{text:'Sets five turns of hail on entry. First entry each battle raises Speed one stage; no Evasion boost.'});


ABILITIES.push(...RENEWAL_ABILITIES.map(a=>({...a,text:a.effect_text})));
Object.assign(ABILITIES.find(a=>a.name==='Countercharge'),{text:'The first damaging contact hit received after entry grants +2 Attack. Each damaging super-effective move also grants +1 Attack, once per move. Both bonuses stack; +6 battle-stage limit.'});

ABILITIES.push(...BRANCH_ABILITIES);

ABILITIES.push(...ORCHARD_ABILITIES);
