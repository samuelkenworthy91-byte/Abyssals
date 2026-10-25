const f=(at,x,y,sx,sy,turn=0,opacity=1,px=0)=>({at,x,y,sx,sy,turn,opacity,px});
export function installRenewalScenes(scenes){
 const defs=[
 [714,'flowing-palm','FIGHTING','water',11,'coil','wave',1450,.62,'Aqua chi gathers at an open palm → tidal rings close → a precise pressure ripple',[
  {role:'open-palm-chi',size:125,frames:[f(0,1,0,.03,.03,0,0),f(20,1,-30,.4,.4,0),f(48,.4,-16,.8,.3,130),f(62,0,0,1,.55,210),f(100,0,20,1.6,.1,280,0)]},
  {role:'tidal-ring',size:155,frames:[f(0,1,0,.03,.03,0,0),f(32,.8,0,.3,.7),f(62,0,0,1.2,.7),f(100,0,0,1.8,1.2,0,0)]}
 ]],
 [715,'caldera-edict','GROUND','ground',13,'pierce','beam',1700,.65,'Basalt fragments rise → a molten seal opens → jagged volcanic shards converge',Array.from({length:5},(_,i)=>({role:'levitating-basalt',size:65+i*8,frames:[f(0,1,60,.05,.05,0,0),f(25,1,-40-i*9,.3,.8,-20+i*10,1,(i-2)*24),f(50,.5,-90+i*13,.7,1.2,i*24),f(65,0,0,.9,1.5,80+i*11),f(100,0,45,.05,.05,130,0,(i-2)*36)]}))],
 [716,'briar-bequest','GRASS','grass',20,'restore','bloom',1800,.64,'Ivy gathers the farewell light → a leaf arc reaches the chosen partner → restorative motes settle',Array.from({length:6},(_,i)=>({role:'ivy-handoff',size:50+i*6,frames:[f(0,1,25,.05,.05,0,0),f(22+i*2,.8,-40,.3,.7,i*40),f(48,.35,-70,.6,1,90+i*30),f(64,0,-10,.8,.8,180+i*20),f(100,0,15,.1,.1,250,0)]}))],
 [717,'mourning-dew','GRASS','grass',20,'restore','bloom',1500,.56,'Pale green dew forms → status shadows fracture → clean leaf-light falls',Array.from({length:7},(_,i)=>({role:'cleansing-dew',size:35+i*3,frames:[f(0,0,-95,.05,.05,0,0,(i-3)*23),f(20+i*3,0,-70,.25,.45,0,1,(i-3)*20),f(56,0,0,.6,.9,15,1,(i-3)*13),f(100,0,25,.05,.05,55,0,(i-3)*25)]}))]
 ];
 for(const [id,key,type,atlas,cell,action,style,duration,impact,sequence,layers]of defs)scenes[id]={id,key,type,atlas,cell,action,style,duration,impact,sequence,layers,teamcraftScore:(id*2654435761)>>>0,renewalScore:true};
}
