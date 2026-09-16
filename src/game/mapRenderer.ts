// Map renderer — provisional environmental art acceptable, real Abyssal sprites from asset manifest
// Visual direction: grounded medieval settlement, timber, plaster, worn stone, muted earth, irregular roads, fences, modest domestic, restrained True Light iconography blue/white/silver/navy

import { MapData } from '../core/types';
import { assetManifest } from '../data/canonical/assetManifest';
import { isProd } from '../core/env';

export class MapRenderer {
  private tileSize: number = 16;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileset: Map<string, HTMLCanvasElement> = new Map();
  private spriteCache: Map<string, HTMLImageElement> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    this.ctx = ctx;
    this.generateTileset();
  }

  private generateTileset() {
    const ground = document.createElement('canvas');
    ground.width = 16;
    ground.height = 16;
    const gCtx = ground.getContext('2d')!;
    gCtx.fillStyle = '#3a352d';
    gCtx.fillRect(0,0,16,16);
    for (let i=0;i<20;i++) {
      const x = Math.random()*16;
      const y = Math.random()*16;
      gCtx.fillStyle = Math.random()>0.5 ? '#4a453d' : '#2a2520';
      gCtx.fillRect(x,y,1,1);
    }
    this.tileset.set('ground', ground);

    const path = document.createElement('canvas');
    path.width = 16;
    path.height = 16;
    const pCtx = path.getContext('2d')!;
    pCtx.fillStyle = '#5a564f';
    pCtx.fillRect(0,0,16,16);
    pCtx.fillStyle = '#6a6660';
    pCtx.fillRect(2,2,12,2);
    pCtx.fillRect(3,6,10,1);
    pCtx.fillRect(2,10,12,2);
    this.tileset.set('path', path);

    const grass = document.createElement('canvas');
    grass.width = 16;
    grass.height = 16;
    const grCtx = grass.getContext('2d')!;
    grCtx.fillStyle = '#2d3a2d';
    grCtx.fillRect(0,0,16,16);
    grCtx.fillStyle = '#3d4a2d';
    for (let i=0;i<10;i++) {
      const x = Math.random()*16;
      const y = Math.random()*16;
      grCtx.fillRect(x,y,1,2);
    }
    this.tileset.set('grass', grass);

    const houseWall = document.createElement('canvas');
    houseWall.width = 16;
    houseWall.height = 16;
    const hCtx = houseWall.getContext('2d')!;
    hCtx.fillStyle = '#d8c8b0';
    hCtx.fillRect(0,0,16,16);
    hCtx.fillStyle = '#4a3728';
    hCtx.fillRect(0,0,16,2);
    hCtx.fillRect(0,14,16,2);
    hCtx.fillRect(0,0,2,16);
    hCtx.fillRect(14,0,2,16);
    hCtx.fillStyle = 'rgba(0,0,0,0.1)';
    hCtx.fillRect(3,3,4,2);
    this.tileset.set('house_wall', houseWall);

    const roof = document.createElement('canvas');
    roof.width = 16;
    roof.height = 16;
    const rCtx = roof.getContext('2d')!;
    rCtx.fillStyle = '#3d352a';
    rCtx.fillRect(0,0,16,16);
    rCtx.fillStyle = '#4d453a';
    for (let y=0;y<16;y+=4) {
      rCtx.fillRect(0,y,16,1);
    }
    this.tileset.set('roof', roof);

    const well = document.createElement('canvas');
    well.width = 16;
    well.height = 16;
    const wCtx = well.getContext('2d')!;
    wCtx.fillStyle = '#5a5a5a';
    wCtx.fillRect(0,0,16,16);
    wCtx.fillStyle = '#2a2a2a';
    wCtx.beginPath();
    wCtx.arc(8,8,5,0,Math.PI*2);
    wCtx.fill();
    this.tileset.set('well', well);

    const shrine = document.createElement('canvas');
    shrine.width = 16;
    shrine.height = 16;
    const sCtx = shrine.getContext('2d')!;
    sCtx.fillStyle = '#e8eef8';
    sCtx.fillRect(0,0,16,16);
    sCtx.fillStyle = '#2a4a8a';
    sCtx.fillRect(6,2,4,8);
    sCtx.fillStyle = '#c0c8d8';
    sCtx.fillRect(5,10,6,2);
    this.tileset.set('shrine', shrine);

    const tree = document.createElement('canvas');
    tree.width = 16;
    tree.height = 16;
    const tCtx = tree.getContext('2d')!;
    tCtx.fillStyle = '#1a2a1a';
    tCtx.fillRect(0,0,16,16);
    tCtx.fillStyle = '#2a4a2a';
    tCtx.beginPath();
    tCtx.arc(8,6,6,0,Math.PI*2);
    tCtx.fill();
    tCtx.fillStyle = '#3a2a1a';
    tCtx.fillRect(7,10,2,6);
    this.tileset.set('tree', tree);

    // Missing asset debug tile — neutral, only dev builds
    const missing = document.createElement('canvas');
    missing.width = 16;
    missing.height = 16;
    const mCtx = missing.getContext('2d')!;
    mCtx.fillStyle = '#ff00ff';
    mCtx.fillRect(0,0,16,16);
    mCtx.fillStyle = '#000000';
    mCtx.font = '8px monospace';
    mCtx.fillText('MISS', 1, 10);
    this.tileset.set('missing_debug', missing);
  }

  render(map: MapData, playerPixelX: number, playerPixelY: number, cameraX: number, cameraY: number, width: number, height: number) {
    const ctx = this.ctx;
    ctx.clearRect(0,0,width,height);

    const startCol = Math.floor(cameraX / this.tileSize) - 1;
    const endCol = Math.ceil((cameraX + width) / this.tileSize) + 1;
    const startRow = Math.floor(cameraY / this.tileSize) - 1;
    const endRow = Math.ceil((cameraY + height) / this.tileSize) + 1;

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        if (row < 0 || col < 0 || row >= map.height || col >= map.width) {
          ctx.fillStyle = '#0f1115';
          ctx.fillRect(col*this.tileSize - cameraX, row*this.tileSize - cameraY, this.tileSize, this.tileSize);
          continue;
        }

        const tile = map.tiles[row][col];
        const screenX = col * this.tileSize - cameraX;
        const screenY = row * this.tileSize - cameraY;

        if (tile === 0) {
          const isPath = (row % 4 === 0) || (col % 6 === 0) || (Math.abs(col - map.width/2) < 3);
          const tileCanvas = this.tileset.get(isPath ? 'path' : 'ground');
          if (tileCanvas) ctx.drawImage(tileCanvas, screenX, screenY);
        } else {
          let tileKey = 'house_wall';
          if (map.id === 'civeton_village' && ((row === 13 || row === 14) && (col === 18 || col === 19))) {
            tileKey = 'well';
          } else if (map.id === 'civeton_village' && row >=20 && row <=22 && col >=22 && col <=24) {
            tileKey = 'shrine';
          } else if (map.id === 'childhood_hill') {
            tileKey = 'grass';
          } else {
            const isTree = [ [10,10], [30,8], [6,18] ].some(([x,y]) => x===col && y===row);
            if (isTree) tileKey = 'tree';
          }

          const tileCanvas = this.tileset.get(tileKey);
          if (tileCanvas) ctx.drawImage(tileCanvas, screenX, screenY);
        }
      }
    }

    if (map.id === 'civeton_village') {
      ctx.strokeStyle = '#5a4a3a';
      ctx.lineWidth = 2;
      ctx.strokeRect(2*this.tileSize - cameraX, 9*this.tileSize - cameraY, 8*this.tileSize, 4*this.tileSize);
      ctx.strokeRect(16*this.tileSize - cameraX, 16*this.tileSize - cameraY, 6*this.tileSize, 4*this.tileSize);
    }

    for (const npc of map.npcs) {
      const screenX = npc.x * this.tileSize - cameraX;
      const screenY = npc.y * this.tileSize - cameraY;

      if (screenX < -this.tileSize || screenX > width || screenY < -this.tileSize || screenY > height) continue;

      ctx.fillStyle = npc.is_important ? '#6a8aba' : '#8a7a6a';
      ctx.fillRect(screenX + 2, screenY + 2, 12, 12);
      ctx.fillStyle = '#d8c8a8';
      ctx.fillRect(screenX + 4, screenY, 8, 6);

      if (npc.is_important) {
        ctx.fillStyle = 'rgba(100, 140, 200, 0.3)';
        ctx.beginPath();
        ctx.arc(screenX + 8, screenY + 8, 10, 0, Math.PI*2);
        ctx.fill();
      }
    }

    const playerScreenX = playerPixelX - cameraX;
    const playerScreenY = playerPixelY - cameraY;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(playerScreenX + 8, playerScreenY + 14, 6, 3, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#4a6a8a';
    ctx.fillRect(playerScreenX + 3, playerScreenY + 4, 10, 8);
    ctx.fillStyle = '#e8d8b8';
    ctx.fillRect(playerScreenX + 5, playerScreenY, 6, 5);

    ctx.fillStyle = '#2a3a4a';
    switch ((globalThis as any).playerDirection || 'DOWN') {
      case 'UP': ctx.fillRect(playerScreenX+6, playerScreenY-1, 4,2); break;
      case 'DOWN': ctx.fillRect(playerScreenX+6, playerScreenY+10, 4,2); break;
      case 'LEFT': ctx.fillRect(playerScreenX+1, playerScreenY+6, 2,4); break;
      case 'RIGHT': ctx.fillRect(playerScreenX+13, playerScreenY+6, 2,4); break;
    }
  }

  // For battle — real Abyssal front sprite from asset manifest, or debug tile in dev
  renderEnemySprite(ctx: CanvasRenderingContext2D, speciesId: string, x: number, y: number, size: number, isShaking: boolean = false, isLunging: boolean = false) {
    const shakeX = isShaking ? (Math.random()-0.5)*10 : 0;
    const lungeY = isLunging ? -10 : 0;
    const drawX = x + shakeX;
    const drawY = y + lungeY;

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(drawX + size/2, drawY + size - 10, size/3, 8, 0, 0, Math.PI*2);
    ctx.fill();

    // Try to get real front sprite from asset manifest
    try {
      const spritePath = assetManifest.getSpeciesSprite(speciesId);
      // Check cache
      let img = this.spriteCache.get(spritePath);
      if (!img) {
        img = new Image();
        img.src = spritePath;
        this.spriteCache.set(spritePath, img);
      }

      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, drawX, drawY, size, size);
      } else {
        // Loading or missing — show debug tile in dev, or placeholder
        if (!isProd()) {
          ctx.fillStyle = '#1a1d24';
          ctx.fillRect(drawX, drawY, size, size);
          ctx.fillStyle = '#6a8aba';
          ctx.font = `${size/10}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(speciesId, drawX + size/2, drawY + size/2);
          ctx.fillText('Loading...', drawX + size/2, drawY + size/2 + 20);
        } else {
          throw new Error(`Sprite not loaded for ${speciesId}`);
        }
      }
    } catch (e: any) {
      // Missing canonical asset — development error requiring correction, not silent fake
      // Neutral missing-asset debugging tile acceptable only in dev builds
      if (!isProd()) {
        ctx.fillStyle = '#2a1a1a';
        ctx.fillRect(drawX, drawY, size, size);
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(drawX, drawY, size, size);
        ctx.fillStyle = '#ff8a6a';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('MISSING', drawX + size/2, drawY + size/2 - 10);
        ctx.fillText(speciesId, drawX + size/2, drawY + size/2 + 10);
        console.warn(`[MapRenderer] Missing sprite for ${speciesId}: ${e.message}`);
      } else {
        // In production, fail clearly
        ctx.fillStyle = '#1a1d24';
        ctx.fillRect(drawX, drawY, size, size);
        ctx.fillStyle = '#ff4a4a';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Missing Asset', drawX + size/2, drawY + size/2);
        throw new Error(`Missing canonical front sprite for ${speciesId} — ${e.message}`);
      }
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX, drawY, size, size);
  }
}
