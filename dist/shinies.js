export const SHINY_DENOMINATOR=4096,EGG_SHINY_DENOMINATOR=2048;
export function rollShiny(random=Math.random,{bred=false}={}){const roll=random();return Number.isFinite(roll)&&roll>=0&&roll<1/(bred?EGG_SHINY_DENOMINATOR:SHINY_DENOMINATOR);}
export function assignShiny(unit,{random=Math.random}={}){if(typeof unit.shiny!=='boolean')unit.shiny=rollShiny(random);return unit;}
export function shinySummaryHTML(unit){return unit?.shiny===true?'<p class="shiny-badge"><b>✦ Shiny Abyssal</b> · Opposite-colour palette</p>':'';}
// HSL hue +180 degrees is exactly (max RGB + min RGB) minus each channel.
// Chromatic pixels preserve HSL saturation and lightness. Near-neutral black
// and white shades swap; mid-tone greys and every alpha byte stay unchanged.
export function oppositeColours(pixels){for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]===0)continue;const max=Math.max(pixels[i],pixels[i+1],pixels[i+2]),min=Math.min(pixels[i],pixels[i+1],pixels[i+2]);const swapNeutral=max-min<=12&&(max<=32||min>=223),sum=swapNeutral?255:max+min;pixels[i]=sum-pixels[i];pixels[i+1]=sum-pixels[i+1];pixels[i+2]=sum-pixels[i+2];}return pixels;}
const transformed=new WeakMap();
export function shinyCanvas(image){if(transformed.has(image))return transformed.get(image);if(!image.complete||!image.naturalWidth)return null;const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);oppositeColours(pixels.data);ctx.putImageData(pixels,0,0);canvas.complete=true;canvas.naturalWidth=canvas.width;canvas.naturalHeight=canvas.height;transformed.set(image,canvas);return canvas;}
