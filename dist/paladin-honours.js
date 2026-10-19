// Original lore: a Mark of Honour is a duty of care, never ownership of a type.
export const PALADIN_HONOURS=[
 {id:'412',name:'Karolion',type:'STEEL',mark:'The Tempered Crown',duty:'Led the thirteen as first among stewards. Sheltered Steel Abyssals and restrained the taking of ore: a crown was an obligation, not a claim upon every creature beneath it.'},
 {id:'413',name:'Rholant',type:'FIGHTING',mark:'The Open Gauntlet',duty:'Protected Fighting Abyssals from forced contests and taught that strength must make room for the weak. Settled challenges before pride turned them into slaughter.'},
 {id:'414',name:'Olivynx',type:'GRASS',mark:'The Living Bough',duty:'Kept nesting groves for Grass Abyssals. Drew hungry roots away from homes, leaving enough wild growth to renew the forest.'},
 {id:'415',name:'Turpurr',type:'FAIRY',mark:'The Hearthlight',duty:'Sheltered Fairy Abyssals and travellers lost beneath enchantments. Kept the forest’s gifts from becoming snares or cruel bargains.'},
 {id:'416',name:'Ogyon',type:'ICE',mark:'The Thawing Shield',duty:'Guarded Ice Abyssals and their cold refuges. Held winter within its season so the river could thaw and other lives could return.'},
 {id:'417',name:'Renaclaw',type:'GROUND',mark:'The Unbroken Furrow',duty:'Protected Ground Abyssals beneath the roads. Held the banks against collapse without sealing their burrows or stealing the farmers’ soil.'},
 {id:'418',name:'Astalcar',type:'FLYING',mark:'The Returning Feather',duty:'Kept nesting cliffs and migration lanes for Flying Abyssals. Turned destructive gales aside without stilling the winds their journeys needed.'},
 {id:'419',name:'Fieraguar',type:'FIRE',mark:'The Banked Ember',duty:'Sheltered Fire Abyssals and tended the burns that renewed the forest. Banked the flames before renewal became a consuming wildfire.'},
 {id:'420',name:'Maugrise',type:'PSYCHIC',mark:'The Unclouded Eye',duty:'Protected Psychic Abyssals from coercion. Quieted spreading panic while refusing to silence another creature’s will.'},
 {id:'421',name:'Huonquet',type:'WATER',mark:'The Shared Spring',duty:'Kept clean pools for Water Abyssals and guided floods back to their channels. No grove was watered by leaving another habitat dry.'},
 {id:'422',name:'Florimara',type:'DRAGON',mark:'The Kept Oath',duty:'Sheltered young Dragon Abyssals and their breeding grounds. Bound overwhelming might to restraint, so their power did not become everyone else’s ruin.'},
 {id:'423',name:'Naimspark',type:'ELECTRIC',mark:'The Grounded Bolt',duty:'Protected Electric Abyssals and discharged gathering storms into empty stone. Never sent a bolt through a living nest to save a palace roof.'},
 {id:'424',name:'Ganelurk',type:'DARK',mark:'The Unbarred Night',duty:'Kept refuge for Dark Abyssals hunted out of fear. Checked terror and predation without treating darkness itself as a fault.'}
];
export const honourFor=id=>PALADIN_HONOURS.find(h=>h.id===id);
