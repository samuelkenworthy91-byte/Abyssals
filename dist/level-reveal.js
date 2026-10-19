// Presentation only. Growth is already committed; this never mutates a unit or RNG.
export function revealLevel(root,rows,{reduced=false,tick=()=>{}}={}){
 let done=false,timer;const nodes=[...root.querySelectorAll('[data-growth-row]')];
 const paint=(i,value,finished=false)=>{const row=rows[i],node=nodes[i];if(!node)return;node.classList.add('revealed');node.classList.toggle('gained',row.gain>0);node.querySelector('[data-growth-value]').textContent=value;if(finished)node.querySelector('[data-growth-gain]').textContent=row.gain?'+'+row.gain:'—';};
 const finish=()=>{clearTimeout(timer);done=true;rows.forEach((row,i)=>{paint(i,row.after,true);nodes[i]?.classList.remove('ticking');});root.querySelector('#reward-next').textContent='Continue';};
 function reveal(i){if(!root.isConnected){clearTimeout(timer);return;}if(i>=rows.length){finish();return;}const row=rows[i];nodes.forEach(n=>n.classList.remove('ticking'));nodes[i]?.classList.add('ticking');paint(i,row.before);let value=row.before;const step=row.key==='hp'?10:1;function count(){if(!root.isConnected)return;if(value<row.after){value=Math.min(row.after,value+step);paint(i,value);tick();timer=setTimeout(count,110);}else{paint(i,value,true);timer=setTimeout(()=>reveal(i+1),300);}}timer=setTimeout(count,180);}
 if(reduced)finish();else{root.querySelector('#reward-next').textContent='Finish reveal';timer=setTimeout(()=>reveal(0),250);}
 return {finish,get done(){return done;}};
}
