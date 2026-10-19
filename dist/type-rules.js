// Standard 18-type matchups, checked against Pokémon Showdown data/typechart.ts.
// Each row is a defending type; unspecified attacking types deal normal damage.
export const TYPES=['NORMAL','FIRE','WATER','ELECTRIC','GRASS','ICE','FIGHTING','POISON','GROUND','FLYING','PSYCHIC','BUG','ROCK','GHOST','DRAGON','DARK','STEEL','FAIRY'];
export const TYPE_COLORS={NORMAL:'#b6b6a0',FIRE:'#ff9568',WATER:'#82b8ff',ELECTRIC:'#f2d45c',GRASS:'#92cf72',ICE:'#8cdedc',FIGHTING:'#ec8077',POISON:'#d29bdb',GROUND:'#d9bd7d',FLYING:'#bdacf1',PSYCHIC:'#ff93b6',BUG:'#bccd67',ROCK:'#c9bb80',GHOST:'#b4a2d9',DRAGON:'#a89bff',DARK:'#b1a69d',STEEL:'#bac8db',FAIRY:'#efb0d4'};
const DEFENSE={
 NORMAL:[['FIGHTING'],[],['GHOST']],
 FIRE:[['GROUND','ROCK','WATER'],['BUG','FIRE','GRASS','ICE','STEEL','FAIRY'],[]],
 WATER:[['ELECTRIC','GRASS'],['FIRE','WATER','ICE','STEEL'],[]],
 ELECTRIC:[['GROUND'],['ELECTRIC','FLYING','STEEL'],[]],
 GRASS:[['BUG','FIRE','FLYING','ICE','POISON'],['ELECTRIC','GRASS','GROUND','WATER'],[]],
 ICE:[['FIGHTING','FIRE','ROCK','STEEL'],['ICE'],[]],
 FIGHTING:[['FAIRY','FLYING','PSYCHIC'],['BUG','DARK','ROCK'],[]],
 POISON:[['GROUND','PSYCHIC'],['BUG','FAIRY','FIGHTING','GRASS','POISON'],[]],
 GROUND:[['GRASS','ICE','WATER'],['POISON','ROCK'],['ELECTRIC']],
 FLYING:[['ELECTRIC','ICE','ROCK'],['BUG','FIGHTING','GRASS'],['GROUND']],
 PSYCHIC:[['BUG','DARK','GHOST'],['FIGHTING','PSYCHIC'],[]],
 BUG:[['FIRE','FLYING','ROCK'],['FIGHTING','GRASS','GROUND'],[]],
 ROCK:[['FIGHTING','GRASS','GROUND','STEEL','WATER'],['FIRE','FLYING','NORMAL','POISON'],[]],
 GHOST:[['DARK','GHOST'],['BUG','POISON'],['FIGHTING','NORMAL']],
 DRAGON:[['DRAGON','FAIRY','ICE'],['ELECTRIC','FIRE','GRASS','WATER'],[]],
 DARK:[['BUG','FAIRY','FIGHTING'],['DARK','GHOST'],['PSYCHIC']],
 STEEL:[['FIGHTING','FIRE','GROUND'],['BUG','DRAGON','FAIRY','FLYING','GRASS','ICE','NORMAL','PSYCHIC','ROCK','STEEL'],['POISON']],
 FAIRY:[['POISON','STEEL'],['BUG','DARK','FIGHTING'],['DRAGON']]
};
export function typeEffectiveness(attack,defenders){return [...new Set(defenders)].reduce((factor,type)=>{const [weak,resist,immune]=DEFENSE[type]||[[],[],[]];return factor*(immune.includes(attack)?0:weak.includes(attack)?2:resist.includes(attack)?.5:1);},1);}
export function effectivenessLabel(value){return value===0?'Immune · 0×':value>1?`Super effective · ${value}×`:value<1?`Resisted · ${value}×`:'Normal damage · 1×';}
export function effectivenessClass(value){return value===0?'immune':value>1?'weak':value<1?'resist':'neutral';}
export function categorySymbol(category){return category==='PHYSICAL'?'✦':category==='SPECIAL'?'◎':'◇';}
export function categoryLabel(category){return category==='PHYSICAL'?'Physical':category==='SPECIAL'?'Special':'Status';}
