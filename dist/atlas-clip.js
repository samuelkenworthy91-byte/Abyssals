// Atlas framing metadata only: preserve source files and every assigned alpha
// pixel while excluding another silhouette where their bounding boxes overlap.
export function clipAtlasPixels(data,width,height,rows){
 let index=0;
 for(let y=0;y<height;y++){
  const row=rows[index]?.[0]===y?rows[index++]:[y];let segment=1;
  for(let x=0;x<width;x++){
   while(segment<row.length&&x>=row[segment+1])segment+=2;
   if(segment>=row.length||x<row[segment])data[(y*width+x)*4+3]=0;
  }
 }
 return data;
}
const cache=new WeakMap();
export function clippedAtlasPanel(image,meta,createCanvas=()=>document.createElement('canvas')){
 let panels=cache.get(image);if(!panels){panels=new Map();cache.set(image,panels);}if(panels.has(meta))return panels.get(meta);
 const c=createCanvas(),r=meta.rect;c.width=r[2];c.height=r[3];const ctx=c.getContext('2d');ctx.drawImage(image,...r,0,0,c.width,c.height);
 const p=ctx.getImageData(0,0,c.width,c.height);clipAtlasPixels(p.data,c.width,c.height,meta.clipRows);ctx.putImageData(p,0,0);panels.set(meta,c);return c;
}
