// Furniture footprints are shared by rendering and collision. The doorway stays at 24,27.
export const SAFE_INTERIOR={floor:'#a89165',wall:'#715564',rug:[21,20,6,3],props:[]};
export const INTERIORS={
 cossenneHome:{floor:'#c0a674',wall:'#715564',rug:[21,19,6,4],props:[['bed',16,8,4,6],['bed',29,8,4,6],['table',22,10,4,3],['sack',30,23,1,1]]},
 cossenneShop:{floor:'#bca579',wall:'#6d5068',rug:[21,21,6,3],props:[['shelf',16,8,4,3],['shelf',29,8,4,3],['desk',21,10,6,3],['sack',17,20,2,2],['chest',30,23,2,1]]},
 cossenneConservatory:{floor:'#8da781',wall:'#426c5c',rug:[21,20,6,4],props:[['orchardScenery',16,14,3,4,{x:0,y:0,w:64,h:64}],['orchardScenery',30,14,3,4,{x:0,y:0,w:64,h:64}],['shelf',16,8,4,3],['shelf',29,8,4,3],['table',21,10,6,3],['sack',16,21,2,2],['sack',31,21,2,2]]},
 cossenneApothecary:{floor:'#b5ab8d',wall:'#675175',rug:[21,20,6,4],props:[['bed',16,8,4,6],['shelf',29,8,4,3],['desk',21,10,6,3],['shelf',16,22,3,3],['chest',30,22,2,1]]},
 cossenneFirewatch:{floor:'#a29581',wall:'#5c615d',rug:[21,21,6,3],props:[['table',21,10,6,3],['chest',16,8,3,2],['chest',29,8,3,2],['sack',16,22,2,2],['sack',30,22,2,2]]},
 pate:{floor:'#8b633c',wall:'#59392d',rug:[21,18,5,4],props:[['bed',16,8,4,6],['table',21,11,6,3],['shelf',29,8,4,3],['sack',31,24,1,1]]},
 trade:{floor:'#596c79',wall:'#30495c',rug:[25,18,5,5],props:[['bed',29,8,4,6],['desk',21,11,5,3],['shelf',16,8,4,3],['chest',16,23,2,1]]},
 shop:{floor:'#77705d',wall:'#4e5148',rug:null,props:[['shelf',16,8,4,4],['shelf',29,8,4,4],['table',21,10,6,3],['sack',17,22,2,2],['chest',30,22,2,1]]},
 dorelemHome:{floor:'#a78859',wall:'#674761',rug:[26,19,5,4],props:[['bed',16,8,4,6],['table',21,11,5,3],['sack',30,9,2,2],['sack',30,12,2,2],['chest',16,24,2,1]]},
 dorelemShop:{floor:'#a89165',wall:'#513d60',rug:[21,19,6,4],props:[['shelf',16,8,4,3],['desk',21,10,6,3],['chest',30,9,2,1],['sack',30,12,2,2],['shelf',16,22,3,3]]},
 philomereHome:{floor:'#b7a27d',wall:'#6f5578',rug:[21,19,6,4],props:[['bed',16,8,4,6],['bed',29,8,4,6],['table',21,10,5,3],['sack',30,23,1,1]]},
 hospice:{floor:'#b5ab8d',wall:'#69516a',rug:[22,20,4,3],props:[['bed',16,8,4,5],['bed',29,8,4,5],['bed',16,20,4,5],['bed',29,20,4,5],['desk',22,9,4,3]]},
 cybressaHome:{floor:'#bdab80',wall:'#6d5264',rug:[21,19,6,4],props:[['bed',16,8,4,6],['bed',29,8,4,6],['table',22,10,4,3],['sack',30,23,1,1]]},
 cybressaShop:{floor:'#c4b28b',wall:'#715564',rug:[21,21,6,3],props:[['shelf',16,8,4,3],['shelf',29,8,4,3],['desk',22,9,4,3],['sack',17,22,2,2],['chest',29,22,2,1]]},
 philomereShop:{floor:'#bdad84',wall:'#715564',rug:[21,21,6,3],props:[['shelf',16,8,4,3],['shelf',29,8,4,3],['desk',22,9,4,3],['sack',17,22,2,2],['chest',29,22,2,1]]}
};
export function interiorBlocked(room,x,y){const m=INTERIORS[room]||SAFE_INTERIOR;if(x<14||x>34||y<7||y>27||y===27&&x!==24)return true;return m.props.some(([,a,b,w,h])=>x>=a&&x<a+w&&y>=b&&y<b+h);}
export function drawInterior(c,room,asset){const m=INTERIORS[room]||SAFE_INTERIOR;c.fillStyle='#101622';c.fillRect(0,0,768,512);
 for(let y=7;y<=27;y++)for(let x=14;x<=34;x++)asset(c,['pate','trade','shop'].includes(room)?'floor':'bloomPath',x,y);
 c.save();c.globalAlpha=.28;c.fillStyle=m.floor;c.fillRect(14*16,7*16,21*16,21*16);c.restore();
 for(let x=14;x<=34;x++)asset(c,'wall',x,6,1,2);
 c.save();c.globalAlpha=.4;c.fillStyle=m.wall;c.fillRect(14*16,6*16,21*16,2*16);c.restore();
 if(m.rug)asset(c,['pate','trade','shop'].includes(room)?'mat':'rug',...m.rug);for(const prop of m.props)asset(c,...prop);asset(c,'mat',23,26,3,2);
}

for(const [room,base]of [["marasenMarket","cossenneShop"],["marasenApothecary","cossenneApothecary"],["marasenArchive","cossenneFirewatch"],["marasenMill","cossenneHome"]])INTERIORS[room]=structuredClone(INTERIORS[base]);

Object.assign(INTERIORS.marasenMarket,{floor:'#b6b78a',wall:'#5b7b64',rug:[21,21,5,3]});
Object.assign(INTERIORS.marasenApothecary,{floor:'#bac6a1',wall:'#467367',rug:[23,20,4,3]});
Object.assign(INTERIORS.marasenArchive,{floor:'#bdba9e',wall:'#597080',rug:[21,19,7,3]});
Object.assign(INTERIORS.marasenMill,{floor:'#b4ab81',wall:'#6b795e',rug:[21,21,6,3]});

INTERIORS.marasenArena=structuredClone(INTERIORS.cossenneFirewatch);

for(const [room,base]of [['botruneShop','cossenneShop'],['botruneClinic','hospice'],['botruneInn','cossenneHome'],['botruneRecords','cossenneFirewatch']]){INTERIORS[room]=structuredClone(INTERIORS[base]);INTERIORS[room].floor='#727584';INTERIORS[room].wall='#393c50';}
