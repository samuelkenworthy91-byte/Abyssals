"""Contact sheets of exact renderer output for reviewing every catalogue entry."""
import json,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
report=json.load(open('build/shiny-audit.json'));rows=[r for r in report['records'] if r['surface']=='combat'];out=Path('build/qa/shinies');out.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
def panel(r,suffix,size=(140,140)):
 im=Image.frombytes('RGBA',(r['width'],r['height']),Path(f"build/shiny-renders/{r['id']}{suffix}.rgba").read_bytes());bounds=im.getbbox()
 if bounds:im=im.crop(bounds)
 im.thumbnail(size,Image.Resampling.NEAREST);return im
for page in range(math.ceil(len(rows)/20)):
 sheet=Image.new('RGB',(1500,760),'#172632');d=ImageDraw.Draw(sheet)
 for n,r in enumerate(rows[page*20:(page+1)*20]):
  x=(n%5)*300;y=(n//5)*190;d.rounded_rectangle((x+3,y+3,x+296,y+186),6,fill='#29404b',outline='#6b7776')
  for col,suffix in enumerate(['-normal','']):
   im=panel(r,suffix);sheet.paste(im,(x+col*148+4+(140-im.width)//2,y+16+(140-im.height)//2),im)
  d.text((x+10,y+158),r['id']+' '+r['name'],font=font,fill='#f1e4c4');d.text((x+12,y+174),'normal',font=font,fill='#aabec7');d.text((x+162,y+174),'shiny',font=font,fill='#aabec7')
 sheet.save(out/f'catalogue-{page+1:02}.webp',lossless=True,method=4)
# A larger, readable first-ten preview for the user.
sheet=Image.new('RGB',(1500,720),'#172632');d=ImageDraw.Draw(sheet);big=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
for n,r in enumerate(rows[:10]):
 x=(n%5)*300;y=(n//5)*360;im=panel(r,'',(270,290));sheet.paste(im,(x+(300-im.width)//2,y+12+(290-im.height)//2),im);d.text((x+20,y+320),r['id']+' '+r['name'],font=big,fill='#f1e4c4')
sheet.save(out/'first-ten-clean-shinies.webp',lossless=True,method=4)
