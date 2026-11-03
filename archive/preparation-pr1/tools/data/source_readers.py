"""Read source OOXML without executing macros, modifying files or trusting formula caches."""
from pathlib import PurePosixPath
from zipfile import ZipFile
import xml.etree.ElementTree as ET

X={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
W={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def column_index(ref):
    n=0
    for c in ref:
        if not c.isalpha(): break
        n=n*26+ord(c.upper())-64
    return n-1

def workbook_rows(path):
    """Return sheet -> rows with original row number, typed cells and formula expressions."""
    with ZipFile(path) as z:
        strings=[]
        if 'xl/sharedStrings.xml' in z.namelist():
            for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',X):
                strings.append(''.join(t.text or '' for t in si.findall('.//m:t',X)))
        rels={e.attrib['Id']:e.attrib['Target'] for e in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
        sheets={}
        for s in ET.fromstring(z.read('xl/workbook.xml')).findall('m:sheets/m:sheet',X):
            rid=s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
            target=rels[rid];target=target.lstrip('/') if target.startswith('/') else str(PurePosixPath('xl')/target)
            rows=[]
            for row in ET.fromstring(z.read(target)).findall('m:sheetData/m:row',X):
                values=[];formulas={}
                for c in row.findall('m:c',X):
                    i=column_index(c.attrib['r'])
                    while len(values)<=i:values.append(None)
                    t=c.attrib.get('t');v=c.find('m:v',X);value=v.text if v is not None else None
                    if t=='inlineStr':value=''.join(n.text or '' for n in c.findall('.//m:t',X))
                    elif t=='s' and value is not None:value=strings[int(value)]
                    elif t=='b' and value is not None:value=value=='1'
                    elif value is not None and t not in ['str','e']:
                        value=float(value);value=int(value) if value.is_integer() else value
                    values[i]=value
                    f=c.find('m:f',X)
                    if f is not None:formulas[c.attrib['r']]=f.text
                rows.append({'row':int(row.attrib['r']),'cells':values,'formulas':formulas})
            sheets[s.attrib['name']]=rows
        return sheets

def document_blocks(path):
    """Preserve paragraph/table order and stable OOXML body positions for citations."""
    def text(node):
        return '\n'.join(''.join(t.text or '' for t in p.findall('.//w:t',W)) for p in node.findall('.//w:p',W))
    with ZipFile(path) as z:body=ET.fromstring(z.read('word/document.xml')).find('w:body',W)
    blocks=[]
    for i,node in enumerate(body):
        kind=node.tag.rsplit('}',1)[-1]
        if kind=='p':blocks.append({'body_index':i,'kind':'paragraph','text':''.join(t.text or '' for t in node.findall('.//w:t',W))})
        elif kind=='tbl':blocks.append({'body_index':i,'kind':'table','rows':[[text(c) for c in row.findall('w:tc',W)] for row in node.findall('w:tr',W)]})
    return blocks
