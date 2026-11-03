"""Render the individually authored Nectarbane sixteen-frame vine/sap choreography."""
from pathlib import Path
import math,subprocess,os
R=Path(__file__).resolve().parents[1]
frames=[]
for i in range(16):
 t=i/15;grow=min(1,t/.45);relax=max(0,(t-.8)/.2);alpha=1-relax;parts=[]
 # Two opposed hooked vines visibly advance, then a closed lotus opens at contact.
 for side in [-1,1]:
  x=96+side*70*(1-grow);y=150-65*grow
  parts.append(f'<path d="M {96+side*78} 174 Q {96+side*86} {140-30*grow} {x} {y} Q {96+side*35} {58+30*(1-grow)} 96 92" fill="none" stroke="#213f32" stroke-width="9"/>')
  parts.append(f'<path d="M {96+side*78} 174 Q {96+side*86} {140-30*grow} {x} {y} Q {96+side*35} {58+30*(1-grow)} 96 92" fill="none" stroke="#638453" stroke-width="4"/>')
 if i>=5:
  opening=min(1,(i-5)/4)
  for angle in [-65,-32,0,32,65]:
   a=math.radians(angle*opening);x=96+math.sin(a)*35;y=92-math.cos(a)*36
   parts.append(f'<path d="M96 107 Q {x-12} {y+8} {x} {y} Q {x+14} {y+12} 96 107" fill="#a75d91" stroke="#4b294e" stroke-width="2"/>')
  parts.append('<ellipse cx="96" cy="99" rx="8" ry="10" fill="#592a65"/>')
 if i>=8:
  for k in range(5):
   a=k*math.pi*2/5;r=(i-7)*5;x=96+math.cos(a)*r;y=95+math.sin(a)*r
   parts.append(f'<circle cx="{x}" cy="{y}" r="{max(1,4-(i-8)/3)}" fill="#b389b6"/>')
 if i>=10:
  u=(i-10)/5;x=96-65*u;y=110+40*u-24*math.sin(u*math.pi)
  parts.append(f'<path d="M{x} {y-5} Q{x+7} {y+4} {x} {y+7} Q{x-6} {y+3} {x} {y-5}" fill="#d3b487"/>')
 frames.append(f'<g transform="translate({i%4*192},{i//4*192})" opacity="{alpha}">'+''.join(parts)+'</g>')
svg='<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768">'+''.join(frames)+'</svg>'
src=R/'art-library/dossiers/nectarbane.svg';src.write_text(svg)
out=R/'dist/assets/vfx/action/810-nectarbane.png';out.parent.mkdir(parents=True,exist_ok=True);subprocess.run(['node','-e',"require(require.resolve('sharp',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||process.cwd()]}))(process.argv[1]).png().toFile(process.argv[2])",str(src),str(out)],check=True)
