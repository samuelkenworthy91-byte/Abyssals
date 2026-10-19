// Constant-speed tile travel; logical arrival, collision and doors stay on the grid.
export function beginStep(player,x,y,duration){
 player.step={x,y,fromX:player.px,fromY:player.py,toX:x*16+8,toY:y*16+8,elapsed:0,duration};
 player.moving=true;
}
export function advanceStep(player,dt){
 const step=player.step;if(!step)return {arrived:false,remaining:dt};
 const used=Math.min(dt,step.duration-step.elapsed);step.elapsed+=used;
 const progress=Math.min(1,step.elapsed/step.duration);
 player.px=step.fromX+(step.toX-step.fromX)*progress;player.py=step.fromY+(step.toY-step.fromY)*progress;
 if(progress<1-1e-9)return {arrived:false,remaining:0};
 player.x=step.x;player.y=step.y;player.px=step.toX;player.py=step.toY;
 player.stride=((player.stride||0)+1)%2;player.step=null;player.moving=false;
 return {arrived:true,remaining:Math.max(0,dt-used)};
}
export function walkFrame(player){
 const rows={down:0,left:1,up:2,right:3};
 const progress=player.step&&player.step.duration>0?Math.max(0,Math.min(1,player.step.elapsed/player.step.duration)):0;
 const stride=Number.isFinite(player.stride)?Math.abs(Math.trunc(player.stride))%2:0;
 const phase=Number.isFinite(progress)?stride+progress:0;
 return {row:rows[player.facing]??0,frame:player.step?[0,1,0,2][Math.floor(phase*2)%4]:0};
}

export function travelDuration(running=false){return running?.1:.2;}
