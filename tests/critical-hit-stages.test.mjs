import assert from 'node:assert/strict';
import {DATA} from '../dist/data.js';
import {instance,applyMove} from '../dist/engine.js';
import {beginAbilities,critChance} from '../dist/abilities.js';

const highCrit=DATA.moves.find(m=>m.id===9);
assert(highCrit?.effects.some(e=>e.effect_id==='high_critical_ratio'));
const close=(actual,expected)=>assert(Math.abs(actual-expected)<1e-10,`expected ${expected}, got ${actual}`);
const unit=id=>{
 const species=structuredClone(DATA.species.find(s=>s.id===id));
 species.ability_names={primary:'Unfazed',secondary:'Unfazed',hidden:'Unfazed'};
 const u=instance(species,40,[]);
 u.stats={hp:10000,attack:100,defence:100,sp_attack:100,sp_defence:100,speed:100};
 u.hp=u.maxHp=10000;
 return u;
};
const pair=(weather=null)=>{
 const a=unit('001'),b=unit('014');
 beginAbilities(a,[b],[a],weather?{weather}:{});
 return [a,b];
};
{
 const [a,b]=pair();
 a.stats.speed=65;b.stats.speed=35;
 close(critChance(a,highCrit,b),1/8+(65/35-1)/16);
 a.stages.speed=2;
 close(critChance(a,highCrit,b),1/8+(130/35-1)/16);
 a.stages.speed=6;
 close(critChance(a,highCrit,b),.5);
 a.stages.speed=2;b.stages.speed=6;
 close(critChance(a,highCrit,b),.125);
 b.stages.speed=0;a.status='PARALYSIS';
 close(critChance(a,highCrit,b),1/8+(65/35-1)/16);
 close(critChance(a,{...highCrit,guaranteedCritical:true},b),1);
}
function criticalDamage({attack=0,defence=0,special=false,weather=null,status=null,type='NORMAL'}={}){
 const [a,b]=pair(weather);
 a.stages[special?'sp_attack':'attack']=attack;
 b.stages[special?'sp_defence':'defence']=defence;
 if(status)a.status=status;
 const m={...highCrit,category:special?'SPECIAL':'PHYSICAL',type_id:type,left:highCrit.pp};
 const result=applyMove(a,b,m,()=>.01,{floor:0});
 assert(result.critical,`expected critical damage, got ${JSON.stringify(result)}`);
 return result.damage;
}
for(const special of [false,true]){
 const normal=criticalDamage({special});
 assert.equal(criticalDamage({special,defence:6}),normal,'crit must ignore +6 target defensive stage');
 assert(criticalDamage({special,defence:-2})>normal,'crit must preserve target negative defence');
 assert(criticalDamage({special,attack:2})>normal,'crit must preserve attacker positive offence');
 assert(criticalDamage({special,attack:-2})<normal,'crit must preserve attacker negative offence');
}
assert(criticalDamage({special:true,status:'FROSTBITE'})<criticalDamage({special:true}),'Frostbite must still reduce special critical damage');
assert(criticalDamage({special:true,type:'WATER',weather:'SUN'})<criticalDamage({special:true,type:'WATER'}),'sun must still weaken Water critical damage');
console.log('PASS Criticals: boosted battle Speed, 50% cap, attacker stages, defensive debuffs, weather and Frostbite.');
