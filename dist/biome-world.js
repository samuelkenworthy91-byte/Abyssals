import {MARASEN_ASSETS} from './marasen-art.js?v=0.90.52';
import {ORCHARD_PIXEL_ASSETS} from './cossenne-art.js?v=0.90.52';
import {MOUNTAIN_PIXEL_ASSETS} from './mountain-art.js?v=0.90.52';
// Visual profiles change materials, not movement or gate geometry.
const ROOMS={relicGrove:'forest',relicGrove2:'forest',relicGrove3:'ruins',cybressa:'coast',rivercause:'wetland',rivercause2:'coast',philomereBackwaters:'wetland',smugglersWeir:'coast',saltFlats:'desert',cybressaWarehouse:'sewer',town:'snow',march:'snow',march2:'snow',marchMeadow:'snow',anglersReach:'snow',scrub:'desert',scrub2:'desert',dorelem:'desert',northRoad:'desert',northRoad2:'desert',northRoad3:'desert',burrowHollow:'cave',orchardCanopy:'forest',hospiceRoad:'forest',hospiceRoad2:'forest',philomere:'forest',rescueGlade:'forest',tunnels:'sewer',tunnels2:'sewer',glassSluice:'grotto',emberQuarry:'quarry',stormBluffs:'grotto',reedSanctuary:'wetland',medicinePath:'wetland',medicinePath2:'wetland',coralGrotto:'coast',moonlitDepths:'coast',relicCrags:'ruins'};
export function registerBiome(room,biome){ROOMS[room]=biome;}
export function registerCampaignBiome(room,base){ROOMS[room]=ROOMS[base]||'forest';}
export const biomeFor=room=>ROOMS[room]??null;
export const BIOME_ASSETS=Object.fromEntries([
 ...['snow','desert','cave','forest'].flatMap(b=>['ground','path','grass','wall'].map(k=>['biome'+b+k,'biome-'+b+'-'+k+'-v041.webp'])),
 ...['wetland','coast','quarry','sewer','grotto'].flatMap(b=>['ground','path','grass',b==='wetland'||b==='coast'?'water':'wall'].map(k=>['biome'+b+k,'biome-'+b+'-'+k+'-v041.webp'])),
 ...['wetland-reeds','coast-mangrove','quarry-rock','grotto-cliff','sewer-pipe','camp-true','camp-bloom','coast-mouth','snow-pine','snow-house','cave-crystals','cave-mouth','desert-rock','desert-palm','forest-tree','forest-ferns'].map(n=>['biome'+n.replaceAll('-',''),'biome-'+n+'-v041.webp'])
]);
Object.assign(BIOME_ASSETS,MOUNTAIN_PIXEL_ASSETS,ORCHARD_PIXEL_ASSETS,MARASEN_ASSETS);
BIOME_ASSETS.biomecoastground='biome-coast-ground-v071.webp';BIOME_ASSETS.biomecoastpath='biome-coast-path-v071.webp';
const MATERIALS={snow:{grass:'biomesnowground',path:'biomesnowpath',tallgrass:'biomesnowgrass',tree:'biomesnowpine',ridge:'biomesnowwall',bramble:'biomesnowgrass',house:'biomesnowhouse',shop:'biomesnowhouse'},desert:{grass:'biomedesertground',path:'biomedesertpath',tallgrass:'biomedesertgrass',tree:'biomedesertpalm',ridge:'biomedesertrock',bramble:'biomedesertgrass'},cave:{grass:'biomecaveground',path:'biomecavepath',tallgrass:'biomecavegrass',tree:'biomecavecrystals',ridge:'biomecavecrystals'},forest:{grass:'biomeforestground',path:'biomeforestpath',tallgrass:'biomeforestgrass',tree:'biomeforesttree',ridge:'biomeforestferns',bramble:'biomeforestferns'}};
Object.assign(MATERIALS,{
 mountain:{grass:'biomequarryground',path:'biomequarrypath',tallgrass:'biomedesertgrass',tree:'biomequarryrock',ridge:'biomegrottocliff'},
 highland:{grass:'biomequarryground',path:'biomegrottopath',tallgrass:'biomesnowgrass',tree:'biomesnowpine',ridge:'biomegrottocliff'},
 limestone:{grass:'biomecaveground',path:'biomequarrypath',tallgrass:'biomecavegrass',tree:'biomequarryrock',ridge:'biomegrottocliff'},
 wetland:{grass:'biomewetlandground',path:'biomewetlandpath',tallgrass:'biomewetlandgrass',tree:'biomecoastmangrove',ridge:'biomewetlandreeds',bramble:'biomewetlandreeds',water:'biomewetlandwater'},
 coast:{grass:'biomecoastground',path:'biomecoastpath',tallgrass:'biomecoastgrass',tree:'biomecoastmangrove',ridge:'biomecoastmouth',bramble:'biomewetlandreeds',water:'biomecoastwater'},
 quarry:{grass:'biomequarryground',path:'biomequarrypath',tallgrass:'biomequarrygrass',tree:'biomequarryrock',ridge:'biomequarryrock',bramble:'biomequarrygrass',pipe:'biomesewerpipe'},
 sewer:{sewerFloor:'biomesewerground',sewerWall:'biomesewerwall',sewage:'biomesewergrass',pipe:'biomesewerpipe',grass:'biomesewerground',path:'biomesewerpath'},
 grotto:{grass:'biomegrottoground',path:'biomegrottopath',tallgrass:'biomegrottograss',tree:'biomesnowpine',ridge:'biomegrottocliff',bramble:'biomegrottograss',water:'biomecoastwater'},
 ruins:{grass:'biomecaveground',path:'biomecavepath',tallgrass:'biomecavegrass',tree:'biomecavecrystals',ridge:'biomecavecrystals'}
});
export function biomeAsset(room,key,bloom=false){if(/^orchard(?:Verge|Bend|Firebreak|Emberwood|AshSlope|Renewal)$/.test(room)||room.startsWith('pilgrimGrove')||room.startsWith('sunkenShrine')||room==='cossenne'){const tile={grass:'biomeorchardground',path:'biomeorchardpath',tallgrass:'biomeorchardgrass'}[key];if(tile)return tile;}return key==='tent'&&biomeFor(room)?bloom?'biomecampbloom':'biomecamptrue':MATERIALS[biomeFor(room)]?.[key]??null;}
export function installBiomeWorld(maps){for(const [room,m]of Object.entries(maps)){m.biome=biomeFor(room);if(room==='burrowHollow')m.terrain='cave';}}
export function drawBiomeDetails(c,room,drawAsset,walkable){
 const biome=biomeFor(room);if(/^orchard(?:Verge|Bend|Firebreak|Emberwood|AshSlope|Renewal)$/.test(room)||room.startsWith('pilgrimGrove')||room.startsWith('sunkenShrine')||room==='cossenne')return;if(!biome||typeof c.save!=='function')return;c.save();
 if(biome==='snow'){
  // Small drifts stay at the field edge. Windows and route markings remain readable.
  c.fillStyle='#f0f7fc';c.globalAlpha=.55;for(let n=0;n<55;n++){const x=(n*137+29)%768,y=(n*79+11)%512;c.fillRect(x,y,n%3?1:2,1);}c.globalAlpha=1;
  if(room==='town')for(const [x,y,w]of [[28,5,5],[34,5,7],[41,7,5]]){c.fillStyle='#dcebf7';c.fillRect(x*16,y*16,w*16,3);c.fillStyle='#ffffff';c.fillRect(x*16+4,y*16,w*16-8,2);}
 }
 if(biome==='cave'){
  // The outer cavern is dark; playable paths are intentionally kept visible.
  c.fillStyle='#040610';c.globalAlpha=.42;for(let y=0;y<32;y++)for(let x=0;x<48;x++)if(!walkable(x,y))c.fillRect(x*16,y*16,16,16);c.globalAlpha=1;
  for(const [x,y]of [[6,6],[28,6],[29,25]]){c.fillStyle='#b491e8';c.globalAlpha=.22;const glow=c.createRadialGradient(x*16,y*16,0,x*16,y*16,32);glow.addColorStop(0,'#bc93ff');glow.addColorStop(1,'transparent');c.fillStyle=glow;c.fillRect(x*16-32,y*16-32,64,64);}c.globalAlpha=1;
 }
 if(biome==='forest'){for(let x=1;x<46;x+=3){drawAsset(c,'biomeforesttree',x,0,3,3);drawAsset(c,'biomeforesttree',x,29,3,3);}c.fillStyle='#172c24';c.globalAlpha=.10;for(let n=0;n<10;n++){const x=(n*97+31)%768,y=(n*73+18)%512;c.beginPath();c.ellipse(x,y,24,9,-.3,0,Math.PI*2);c.fill();}c.globalAlpha=1;}
 c.restore();
}
export function drawBiomeEntrances(c,m,asset){for(const g of m.gates||[])if(g.to==='burrowHollow')asset(c,'biomecavemouth',g.x-1.5,g.y-3,3,3);}

export function biomeEncounterHint(room){const biome=biomeFor(room);return ['mountain','limestone','highland'].includes(biome)?'Wild encounters occur in rough gravel and alpine scrub. The worn pale paths are safe.':biome==='cave'?'Wild encounters occur in the crystal gravel; worn stone paths are safe.':biome==='snow'?'Wild encounters occur in icy grass; packed snow paths are safe.':biome==='desert'?'Wild encounters occur in dry scrub; caravan paths are safe.':biome==='forest'?'Wild encounters occur in broadleaf undergrowth; cleared paths are safe.':'Wild encounters occur in the long grass; trainers watch the road.';}
