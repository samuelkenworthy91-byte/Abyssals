import assert from 'node:assert/strict';
import {instance} from '../dist/engine.js';
import {DATA} from '../dist/data.js';
import {doubleRound,doubleLivingTargets,refillDoubleFoes} from '../dist/relic-double.js';
const hit={id:99901,name:'Test strike',type:'NORMAL',type_id:'NORMAL',category:'PHYSICAL',power:50,accuracy:'ALWAYS',pp:20,left:20,target:'ONE_FOE',priority:0,effects:[]};
const make=(uid)=>{const u=instance(DATA.species.find(s=>s.id==='004'),80,[hit]);u.uid=uid;u.hp=u.maxHp=1000;u.stats.attack=20;u.stats.defence=100;u.stats.speed=50;return u;};
let b={finaleDouble:true,player:make('p'),alliedRivet:make('ally'),enemies:Array.from({length:6},(_,i)=>make('e'+i)),activeEnemyIndices:[0,1],reserveCursor:2,targetIndex:0,random:()=>.9};b.alliedRivet.combatFloor=1;
let events=doubleRound(b,b.player.moves[0],0);assert.equal(events.filter(e=>e.side==='enemy'&&e.move).length,2);assert.equal(b.enemies[2].hp,1000);assert.equal(b.enemies[2].moves[0].left,20);
b.enemies[0].hp=0;refillDoubleFoes(b);assert.deepEqual(b.activeEnemyIndices,[2,1]);assert.equal(b.reserveCursor,3);assert.equal(doubleLivingTargets(b).length,2);
b.enemies[1].hp=0;refillDoubleFoes(b);assert.deepEqual(b.activeEnemyIndices,[2,3]);
// A spread action hits only the active pair and spends one PP.
b.player.moves[0].target='ALL_FOES';const pp=b.player.moves[0].left;events=doubleRound(b,b.player.moves[0],2);assert.equal(b.player.moves[0].left,pp-1);assert.equal(events.filter(e=>e.actor===b.player&&e.move).length,2);assert.equal(b.enemies[4].hp,1000);
// Cruxwyrm withdraws at one HP; the same individual can be freed later.
b.player.stats.attack=10000;b.player.stats.speed=10000;b.player.moves[0].power=500;b.enemies[2].boundSovereign=true;b.enemies[2].combatFloor=1;events=doubleRound(b,b.player.moves[0],2);assert.equal(b.enemies[2].hp,1);assert(b.enemies[2].withdrawn);assert(!b.enemies[2].dead);refillDoubleFoes(b);assert.deepEqual(b.activeEnemyIndices,[4,5]);
for(const u of b.enemies)if(!u.withdrawn)u.hp=0;refillDoubleFoes(b);assert.equal(doubleLivingTargets(b).length,0);
// No protection is applied to the player's ordinary partner.
b={player:make('mortal'),alliedRivet:make('ally'),enemies:[make('foe-a'),make('foe-b')],random:()=>.9};b.player.hp=1;b.enemies.forEach(u=>{u.stats.attack=10000;u.stats.speed=10000;u.moves[0].power=500;});doubleRound(b,null,0);assert.equal(b.player.hp,0);assert.equal(b.alliedRivet.hp,1);
console.log('PASS: genuine four-actor rounds, reserve isolation and replacement, spread moves/one PP, living sovereign withdrawal, lethal player damage');
