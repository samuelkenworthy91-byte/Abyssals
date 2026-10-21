// Keep each menu's own position across purchases, selections and return trips.
const identity=el=>el.id?'#'+el.id:el.tagName+':'+[...el.attributes].filter(a=>a.name.startsWith('data-')).map(a=>a.name+'='+a.value).join('|');
export function createModalViewMemory(limit=128){
 const views=new Map();
 const remember=(root,active)=>{
  if(!root)return;const title=root.getAttribute('aria-label');if(!title)return;
  const nodes=[root,...root.querySelectorAll('*')],scrolls=nodes.flatMap((el,index)=>el===root||el.scrollTop||el.scrollLeft?[{index,key:identity(el),top:el.scrollTop,left:el.scrollLeft}]:[]);
  views.delete(title);views.set(title,{scrolls,focus:root.contains(active)?identity(active):null});
  if(views.size>limit)views.delete(views.keys().next().value);
 };
 const restore=root=>{
  const view=root&&views.get(root.getAttribute('aria-label'));if(!view)return;
  const nodes=[root,...root.querySelectorAll('*')];
  const focus=view.focus&&nodes.find(el=>identity(el)===view.focus&&!el.disabled);
  if(focus?.matches('button,input,select,textarea,[tabindex]'))focus.focus({preventScroll:true});
  for(const saved of view.scrolls){const el=nodes[saved.index]?.getAttribute&&identity(nodes[saved.index])===saved.key?nodes[saved.index]:nodes.find(el=>identity(el)===saved.key);if(el){el.scrollTop=saved.top;el.scrollLeft=saved.left;}}
 };
 return {remember,restore};
}
