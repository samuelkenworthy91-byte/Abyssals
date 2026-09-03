#!/usr/bin/env python3
"""Make local visual-QA sheets; generated previews stay outside version control."""
import argparse,json
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[2]

def main():
    p=argparse.ArgumentParser();p.add_argument('--kind',choices=['abyssals','portraits'],default='abyssals');p.add_argument('--output',type=Path,default=ROOT/'.reports/art_review');a=p.parse_args()
    manifest=ROOT/'data/manifests'/('abyssal_art.json' if a.kind=='abyssals' else 'portraits.json')
    rows=[r for r in json.loads(manifest.read_text())['records'] if r.get('runtime_filename')]
    a.output.mkdir(parents=True,exist_ok=True)
    for start in range(0,len(rows),12):
        sheet=Image.new('RGB',(1600,1260));draw=ImageDraw.Draw(sheet)
        for j,row in enumerate(rows[start:start+12]):
            x=j%4*400;y=j//4*420
            for gy in range(0,400,20):
                for gx in range(0,400,20):draw.rectangle((x+gx,y+gy+20,x+gx+19,y+gy+39),fill=('#333b48' if ((gx+gy)//20)%2 else '#555f70'))
            with Image.open(ROOT/row['runtime_filename']) as source:
                im=source.convert('RGBA');im=im.crop(im.getbbox());im.thumbnail((390,388));sheet.paste(im,(x+(400-im.width)//2,y+24+(388-im.height)//2),im)
            draw.rectangle((x,y,x+400,y+20),fill='#eef1f5');draw.text((x+5,y),Path(row['runtime_filename']).stem,fill='black')
        sheet.save(a.output/f'{a.kind}_{start//12:02}.jpg',quality=94)
    print(f'{len(rows)} runtime assets rendered; thumbnails fit each cell for inspection, not scale comparison')

if __name__=='__main__':main()
