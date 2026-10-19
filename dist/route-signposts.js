export const isRouteSign=s=>s.routeSign===true;
export function signContains(s,x,y){return isRouteSign(s)&&x>=s.x-1&&x<=s.x+2&&y>=s.y-3&&y<=s.y;}
export function installRouteSignposts(maps){for(const m of Object.values(maps)){
 if(m.hub||m.leaderFort)continue;
 const old=m.spots.filter(s=>s.id.includes('sign')||s.wallSign);
 const board=old.find(s=>s.id==='area-sign')||old[0];if(!board)continue;
 m.routeNotices=old.filter(s=>s!==board).map(s=>({id:s.id,label:s.label}));
 // Preserve cleared ground around the former signs, keeping encounter geometry intact.
 m.signClearings=old.filter(s=>s!==board).map(s=>({x:s.x,y:s.y}));
 m.spots=m.spots.filter(s=>!old.includes(s)||s===board);
 board.routeSign=true;board.wallSign=false;board.label='Read route noticeboard';
 // Keep the sewer mechanism and its reset control on the sole route board.
 if(m.base==='tunnels'&&m.name==='Dorelem Service Tunnels'){m.signClearings.push({x:board.x,y:board.y});board.x=32;board.y=14;}
}}
