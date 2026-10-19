import {BIRD_ART} from './bird-art.js?v=0.87.0';
import {clippedAtlasPanel} from './atlas-clip.js?v=0.87.0';
// Approved creature panels are drawn from untouched transparent imagegen atlases.
export const RELIC_ART={
 "376":{"file": "shark.png", "folder": "approved-aquatic", "rect": [0, 0, 960, 724]},
 "377":{"file": "shark.png", "folder": "approved-aquatic", "rect": [960, 0, 1212, 724]},
 "378":{"file": "narwhal.png", "folder": "approved-aquatic", "rect": [0, 0, 550, 724]},
 "379":{"file": "narwhal.png", "folder": "approved-aquatic", "rect": [550, 0, 700, 724]},
 "380":{"file": "narwhal.png", "folder": "approved-aquatic", "rect": [1250, 0, 922, 724]},
 "381":{"file": "sunfish.png", "folder": "approved-aquatic", "rect": [0, 0, 887, 887]},
 "381-wrath":{"file": "sunfish.png", "folder": "approved-aquatic", "rect": [887, 0, 887, 887]},
 "382":{"file": "manta.png", "folder": "approved-aquatic", "rect": [0, 0, 724, 724]},
 "383":{"file": "manta.png", "folder": "approved-aquatic", "rect": [724, 0, 724, 724]},
 "384":{"file": "manta.png", "folder": "approved-aquatic", "rect": [1448, 0, 724, 724]},
 "385":{"file": "mantis.png", "folder": "approved-aquatic", "rect": [0, 0, 830, 887]},
 "386":{"file": "mantis.png", "folder": "approved-aquatic", "rect": [830, 0, 944, 887]},
 '365':{file:'rivet.png',rect:null},
 '366':{file:'ghost.png',rect:[0,0,887,887]},'367':{file:'ghost.png',rect:[887,0,887,887]},
 '368':{file:'fire.png',rect:[0,0,805,887]},'369':{file:'fire.png',rect:[805,0,969,887]},
 '370':{file:'electric.png',rect:[0,0,887,887]},'371':{file:'electric.png',rect:[887,0,887,887]},
 '372':{file:'ice.png',rect:[0,0,800,887]},'373':{file:'ice.png',rect:[800,0,974,887]},
 '374':{file:'dark.png',rect:[0,0,800,887]},'375':{file:'dark.png',rect:[800,0,974,887]}
};
Object.assign(RELIC_ART,BIRD_ART);
export function relicArtPath(id){const s=RELIC_ART[id];return s?'assets/'+(s.folder||'relic-family')+'/'+s.file:null;}
export function drawRelicPanel(ctx,im,id,x,y,size){if(RELIC_ART[id]?.clipRows){const panel=clippedAtlasPanel(im,RELIC_ART[id]);const scale=size/Math.max(panel.width,panel.height),w=panel.width*scale,h=panel.height*scale;ctx.drawImage(panel,x+(size-w)/2,y+(size-h)/2,w,h);return;}const r=RELIC_ART[id]?.rect||[0,0,im.naturalWidth,im.naturalHeight],scale=size/Math.max(r[2],r[3]),w=r[2]*scale,h=r[3]*scale;ctx.drawImage(im,...r,x+(size-w)/2,y+(size-h)/2,w,h);}
