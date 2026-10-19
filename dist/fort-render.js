// Authored stone textures and architectural sprites share the existing collision grid.
export const fortCoastTile=(m,x,y)=>!!m.fortExterior&&x>=16&&x<=47&&y>=26;
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
function water(c,x,y,depth=0){rect(c,['#337d91','#2b687c','#25556c','#204657','#193a4c'][depth],x,y,16,16);rect(c,'#528e9b',x+2,y+5,6,1);rect(c,'#376c7b',x+9,y+11,5,1);}
function tile(c,asset,name,x,y){if(asset)asset(c,name,x,y,1,1,{x:(x%2)*16,y:(y%2)*16,w:16,h:16});}
export function drawFortTile(c,m,x,y,walk,encounter,asset,channel=true){const px=x*16,py=y*16,i=m.caveFloor;
 if(!walk){const edge=x<2||x>45||y<3||y>28,flooded=!m.leaderFort&&!edge&&(i===4||i===3&&(y>10||x>26)||i===2&&(y>19||x>32)||i===1&&y>22||i===0&&x>31&&y>22);if(flooded){water(c,px,py,i);if((x*3+y)%11===0)rect(c,'#37676a',px+2,py+12,7,1);}else{rect(c,'#15222d',px,py,16,16);if(channel){tile(c,asset,'fortWall',x,y);rect(c,'#111f2b44',px,py,16,16);rect(c,'#b6a783',px,py,16,1);}if(edge)rect(c,'#101a2380',px,py,16,16);}return;}
 rect(c,i>=3?'#6c7b79':'#969a87',px,py,16,16);tile(c,asset,'fortFloor',x,y);
 if(encounter){rect(c,i<2?'#386d7155':'#204e6577',px,py,16,16);if((x+y)%3===0){rect(c,'#8bc1b3',px+2,py+6,6,1);rect(c,'#568d91',px+9,py+12,4,1);}if((x*3+y)%7===0){rect(c,'#38564d',px+4,py+9,2,5);rect(c,'#59776a',px+8,py+10,2,4);}}
 else if(i>1)rect(c,'#23455322',px,py,16,16);
}
export function drawFortCoast(c,m,walkable,asset){for(let y=26;y<32;y++)for(let x=16;x<=47;x++){if(walkable(x,y)){rect(c,'#a59b7d',x*16,y*16,16,16);tile(c,asset,'fortFloor',x,y);}else water(c,x*16,y*16,1);} }
export function drawFortExterior(c,asset){
 if(asset)asset(c,'fortBastion',32,19,14,8);
 // Bright paved causeway stays south of the building and clear of the main road.
 for(let x=21;x<=40;x++){rect(c,'#d7c8a2',x*16,27*16,16,2);rect(c,'#514b44',x*16,30*16-2,16,2);}
 for(const x of [22,27,32,37]){if(asset)asset(c,'fortPier',x-.3,26.6,.6,1.4);}
 rect(c,'#172630',39*16-7,25*16,30,24);rect(c,'#e0cda2',39*16-7,26*16+8,30,3);
 c.fillStyle='#ebd9ab';c.font='bold 9px sans-serif';c.textAlign='center';c.fillText('FORT',39*16+8,26*16-3);
}

export function drawFortArchitecture(c,m,walkable,asset){const i=m.caveFloor;c.save();
 // Continuous top wall with inset pointed bays; all freestanding piers remain on blocked tiles.
 for(let x=2;x<46;x++){rect(c,'#181f2b',x*16,2*16,16,48);if(asset)asset(c,'fortWall',x,2,1,3);rect(c,'#d8c9a1',x*16,2*16,16,2);rect(c,'#19242e88',x*16,5*16-3,16,4);}
 for(const x of [5,17,29,41]){if(asset)asset(c,'fortArch',x,2.2,2,2.8);rect(c,'#426f7c',x*16+12,2*16+25,9,13);rect(c,'#a6c4ad',x*16+15,2*16+25,1,13);rect(c,'#9ea886',x*16+12,2*16+29,9,1);}
 for(const [x,y]of [[5,10],[17,6],[29,6],[41,10],[5,25],[18,26],[30,27],[43,25]]){if(walkable(x,y)||walkable(x+1,y))continue;if(asset){asset(c,'fortFloor',x-.25,y+.35,1.5,.65);rect(c,'#162e3c55',x*16-4,y*16+6,24,10);asset(c,'fortPier',x-.25,y-2,1.5,3);}}
 for(const [x,y]of (m.leaderFort?[]:[[15,8],[20,26],[31,7]])){if(walkable(x,y)||!asset)continue;asset(c,'fortFloor',x-.25,y-.25,2.5,2);rect(c,'#172c3d55',x*16-4,y*16-4,40,32);asset(c,i===0?'table':i===1?'bed':i===2?'shelf':i===3?'memorial':'fortWall',x,y,i===1?2:2,i===1?2.5:1.5);if(i>1)rect(c,'#15495644',x*16,y*16,32,24);}
 for(const g of m.gates){if(asset)asset(c,'fortArch',g.x-.5,g.y-2,2,3);if(!m.leaderFort){const back=g.id.endsWith('-back');rect(c,'#e2cda0',g.x*16,g.y*16+11,16,3);c.fillStyle='#ebd9ab';c.font='bold 9px sans-serif';c.textAlign='left';c.fillText(back?(i===0?'EXIT ←':'UP ←'):'↓ DOWN',back?2*16:43*16,g.y*16-3);}}
 if(i===4){if(asset)asset(c,'fortWall',42,15,1.5,5);rect(c,'#244f6577',42*16,17*16,24,48);rect(c,'#78aaa0',42*16+2,17*16,20,2);}
 c.restore();}
