// One geometry source for authored props and their collision. Coordinates are tiles.
export const GLASS_CRATERS=[{x:2,y:2,w:6,h:4},{x:28,y:3,w:11,h:7},{x:3,y:21,w:9,h:6},{x:27,y:11,w:7,h:4},{x:36,y:22,w:10,h:7}];
export const MOUNTAIN_FLIGHTS=[{x:9.5,y:17,w:4,h:8},{x:22.5,y:17,w:4,h:8},{x:35.5,y:10,w:4,h:8}];
export const MOUNTAIN_ENTRY={x:22.5,y:1,w:4,h:8};
export function glassCraterBlocked(x,y){return GLASS_CRATERS.some(p=>((x+.5-p.x-p.w/2)/(p.w*.43))**2+((y+.5-p.y-p.h/2)/(p.h*.4))**2<=1);}
