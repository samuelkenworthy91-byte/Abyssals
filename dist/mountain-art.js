// Finished raster artwork uses the existing field grid and collision geometry.
export const MOUNTAIN_ART_ROOMS=['passFoothills','passLowerTunnel','passUpperTunnel','passRidge','passEastSlope','passCrystalPocket','passSummit'];
export const MOUNTAIN_NPC_IDS=['pass-stonecutter','pass-guiding-cord','pass-summit-porter','mq-scholar'];
export const TRAIL_ART_KEYS=['marchMeadow','burrowHollow','glassSluice','emberQuarry','stormBluffs','orchardCanopy','reedSanctuary','coralGrotto','moonlitDepths','relicCrags','philomereBackwaters','smugglersWeir','saltFlats','rescueGlade','anglersReach'];
export const MOUNTAIN_PIXEL_ASSETS=Object.fromEntries([
 ...MOUNTAIN_ART_ROOMS.flatMap(room=>['ground','path','encounter','wall'].map(kind=>['biome'+room+(kind==='encounter'?'grass':kind),'mountain-'+room+'-'+kind+'-v070.webp'])),
 ...MOUNTAIN_ART_ROOMS.map(room=>['mountainProps'+room,'../mountain/'+room+'-props-v070.webp']),
 ...TRAIL_ART_KEYS.map(key=>['trailProps'+key,'../trail-art/'+key+'-v070.webp'])
]);
export const mountainTileName=(room,kind)=>'biome'+room+(kind==='encounter'?'grass':kind);
export function atlasCell(index){return {x:(index%4)*64,y:Math.floor(index/4)*64,w:64,h:64};}
export function environmentPlacements(m,walkable){
 // Anchor solid scenery to the land edge, never to isolated water or distant valleys.
 const placed=[];
 for(const [tx,ty]of [[5,5],[18,14],[31,4],[43,26]]){
  const candidates=[];
  for(let y=3;y<=27;y++)for(let x=3;x<=44;x++)if([0,1].every(dx=>[0,1].every(dy=>!walkable(x+dx,y+dy)))&&walkable(x,y+2)&&walkable(x+1,y+2)&&[...(m.spots||[]),...(m.gates||[])].every(p=>Math.abs(p.x-x)+Math.abs(p.y-y)>5)&&placed.every(([px,py])=>Math.abs(px-x)+Math.abs(py-y)>8))candidates.push([x,y]);
  candidates.sort((a,b)=>(Math.abs(a[0]-tx)+Math.abs(a[1]-ty))-(Math.abs(b[0]-tx)+Math.abs(b[1]-ty)));
  if(candidates.length)placed.push(candidates[0]);
 }
 return placed;
}
export function drawEnvironmentArtwork(c,m,asset,walkable){
 const room=MOUNTAIN_ART_ROOMS.find(room=>room===m.area),key=m.campaign?.key;if(!room&&!key)return;
 const name=room?'mountainProps'+room:'trailProps'+key,stage=m.campaign?.stage||0;
 for(const [i,[x,y]]of environmentPlacements(m,walkable).entries()){const slot=room?i:((i+stage)%4)+(stage===1?4:0),ground=room?mountainTileName(room,'ground'):'biome'+(m.biome==='ruins'?'cave':m.biome||'forest')+'ground';for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)asset(c,ground,x+dx,y+dy);asset(c,name,x-.25,y-.75,2.5,2.5,atlasCell(slot));}
 if(room&&['lower','upper'].includes(m.passKind))for(const [x,y]of [[10,17],[25,10]])if(walkable(x,y))asset(c,name,x-.5,y-.5,2,2,atlasCell(6));
 if(room&&m.passKind==='foothill')asset(c,name,43,14,3,3,atlasCell(7));
 if(room&&m.passKind==='ridge')asset(c,name,1,14,3,3,atlasCell(7));
}
const questImages=new Map();
export function mountainQuestImage(kind){if(typeof Image==='undefined')return null;let image=questImages.get(kind);if(!image){image=new Image();image.src='assets/mountain/quest-'+kind+'-v070.webp';questImages.set(kind,image);}return image.complete&&image.naturalWidth?image:null;}
export function drawMountainQuestArtwork(c,spot,done){const kind=spot.kind==='fossil'?spot.id.split('-').at(-1):spot.kind;const im=mountainQuestImage(kind);if(!im)return false;const column=kind==='cairn'&&done?1:0;c.save();c.imageSmoothingEnabled=false;if(spot.kind==='fossil'&&done)c.globalAlpha=.65;c.drawImage(im,column*64,0,64,64,spot.x*16-16,spot.y*16-25,48,48);c.restore();return true;}
