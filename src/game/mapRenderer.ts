// Map renderer — provisional production-quality environment set, modular, replaceable
// Task: avoid sterile grid, use irregular paths, worn stone, timber, plaster, fenced plots, vegetation, wells, religious iconography restrained
// Visual standard: darker grounded fantasy, True Light blue/white/silver/navy for faction presence, not painting entire village blue

import { MapData } from '../core/types';

export class MapRenderer {
  private tileSize: number = 16;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileset: Map<string, HTMLCanvasElement> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    this.ctx = ctx;
    this.generateTileset();
  }

  private generateTileset() {
    // Provisional tileset — modular, replaceable, follows documented visual direction
    // We'll generate small canvas tiles procedurally rather than using glossy AI fantasy

    // Ground — worn earth/stone mix
    const ground = document.createElement('canvas');
    ground.width = 16;
    ground.height = 16;
    const gCtx = ground.getContext('2d')!;
    // Base earth tone #3a352d, with variations
    gCtx.fillStyle = '#3a352d';
    gCtx.fillRect(0,0,16,16);
    // Add noise for worn stone
    for (let i=0;i<20;i++) {
      const x = Math.random()*16;
      const y = Math.random()*16;
      gCtx.fillStyle = Math.random()>0.5 ? '#4a453d' : '#2a2520';
      gCtx.fillRect(x,y,1,1);
    }
    this.tileset.set('ground', ground);

    // Path — irregular worn stone
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

    // Grass
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

    // House wall — timber + plaster, grounded
    const houseWall = document.createElement('canvas');
    houseWall.width = 16;
    houseWall.height = 16;
    const hCtx = houseWall.getContext('2d')!;
    hCtx.fillStyle = '#d8c8b0'; // plaster
    hCtx.fillRect(0,0,16,16);
    hCtx.fillStyle = '#4a3728'; // timber frame
    hCtx.fillRect(0,0,16,2);
    hCtx.fillRect(0,14,16,2);
    hCtx.fillRect(0,0,2,16);
    hCtx.fillRect(14,0,2,16);
    // Worn
    hCtx.fillStyle = 'rgba(0,0,0,0.1)';
    hCtx.fillRect(3,3,4,2);
    this.tileset.set('house_wall', houseWall);

    // Roof — old thatch/slate, slightly austere
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

    // Well
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

    // Shrine — True Light blue/white/silver/navy, medieval/crusader-inspired but restrained
    const shrine = document.createElement('canvas');
    shrine.width = 16;
    shrine.height = 16;
    const sCtx = shrine.getContext('2d')!;
    sCtx.fillStyle = '#e8eef8'; // ivory/white
    sCtx.fillRect(0,0,16,16);
    sCtx.fillStyle = '#2a4a8a'; // royal blue
    sCtx.fillRect(6,2,4,8);
    sCtx.fillStyle = '#c0c8d8'; // silver
    sCtx.fillRect(5,10,6,2);
    this.tileset.set('shrine', shrine);

    // Tree
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
  }

  render(map: MapData, playerPixelX: number, playerPixelY: number, cameraX: number, cameraY: number, width: number, height: number) {
    const ctx = this.ctx;
    ctx.clearRect(0,0,width,height);

    // Calculate visible tile range
    const startCol = Math.floor(cameraX / this.tileSize) - 1;
    const endCol = Math.ceil((cameraX + width) / this.tileSize) + 1;
    const startRow = Math.floor(cameraY / this.tileSize) - 1;
    const endRow = Math.ceil((cameraY + height) / this.tileSize) + 1;

    // Render ground first
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        if (row < 0 || col < 0 || row >= map.height || col >= map.width) {
          // Outside map — dark void
          ctx.fillStyle = '#0f1115';
          ctx.fillRect(col*this.tileSize - cameraX, row*this.tileSize - cameraY, this.tileSize, this.tileSize);
          continue;
        }

        const tile = map.tiles[row][col];
        const screenX = col * this.tileSize - cameraX;
        const screenY = row * this.tileSize - cameraY;

        // Choose tile visual based on position and type
        // For walkable, use ground/path mix; for blocked, use house/well etc based on context
        if (tile === 0) {
          // Walkable — determine if path or ground
          // Simple heuristic: if near center paths, use path, else ground/grass
          const isPath = (row % 4 === 0) || (col % 6 === 0) || (Math.abs(col - map.width/2) < 3);
          const tileCanvas = this.tileset.get(isPath ? 'path' : 'ground');
          if (tileCanvas) ctx.drawImage(tileCanvas, screenX, screenY);
          else {
            ctx.fillStyle = '#3a352d';
            ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
          }
        } else {
          // Blocked — check what it is by map id and position
          let tileKey = 'house_wall';
          // Well detection
          if (map.id === 'civeton_village' && ((row === 13 || row === 14) && (col === 18 || col === 19))) {
            tileKey = 'well';
          } else if (map.id === 'civeton_village' && row >=20 && row <=22 && col >=22 && col <=24) {
            tileKey = 'shrine';
          } else if (map.id === 'childhood_hill') {
            tileKey = 'grass';
          } else {
            // Check obstacles list for tree
            const isTree = [ [10,10], [30,8], [6,18] ].some(([x,y]) => x===col && y===row);
            if (isTree) tileKey = 'tree';
          }

          const tileCanvas = this.tileset.get(tileKey);
          if (tileCanvas) ctx.drawImage(tileCanvas, screenX, screenY);
          else {
            ctx.fillStyle = '#4a3728';
            ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
          }
        }
      }
    }

    // Render decorations — fenced plots, troughs, religious iconography restrained
    // For Civeton, add some visual landmarks
    if (map.id === 'civeton_village') {
      // Draw fence lines provisional
      ctx.strokeStyle = '#5a4a3a';
      ctx.lineWidth = 2;
      // Fenced plot near Pate's house
      ctx.strokeRect(2*this.tileSize - cameraX, 9*this.tileSize - cameraY, 8*this.tileSize, 4*this.tileSize);
      // Another near well
      ctx.strokeRect(16*this.tileSize - cameraX, 16*this.tileSize - cameraY, 6*this.tileSize, 4*this.tileSize);
    }

    // Render NPCs
    for (const npc of map.npcs) {
      const screenX = npc.x * this.tileSize - cameraX;
      const screenY = npc.y * this.tileSize - cameraY;

      // Only render if on screen
      if (screenX < -this.tileSize || screenX > width || screenY < -this.tileSize || screenY > height) continue;

      // Simple NPC representation — grounded, not chibi
      // Body: small rectangle with color per importance
      ctx.fillStyle = npc.is_important ? '#6a8aba' : '#8a7a6a'; // True Light blue for important, earth for others
      ctx.fillRect(screenX + 2, screenY + 2, 12, 12);

      // Head
      ctx.fillStyle = '#d8c8a8';
      ctx.fillRect(screenX + 4, screenY, 8, 6);

      // Important marker subtle
      if (npc.is_important) {
        ctx.fillStyle = 'rgba(100, 140, 200, 0.3)';
        ctx.beginPath();
        ctx.arc(screenX + 8, screenY + 8, 10, 0, Math.PI*2);
        ctx.fill();
      }
    }

    // Render player — simple but readable, deliberate
    const playerScreenX = playerPixelX - cameraX;
    const playerScreenY = playerPixelY - cameraY;

    // Player shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(playerScreenX + 8, playerScreenY + 14, 6, 3, 0, 0, Math.PI*2);
    ctx.fill();

    // Player body — Aimon, grounded
    ctx.fillStyle = '#4a6a8a'; // muted blue, not bright
    ctx.fillRect(playerScreenX + 3, playerScreenY + 4, 10, 8);

    // Head
    ctx.fillStyle = '#e8d8b8';
    ctx.fillRect(playerScreenX + 5, playerScreenY, 6, 5);

    // Direction indicator subtle
    ctx.fillStyle = '#2a3a4a';
    switch ((globalThis as any).playerDirection || 'DOWN') {
      case 'UP': ctx.fillRect(playerScreenX+6, playerScreenY-1, 4,2); break;
      case 'DOWN': ctx.fillRect(playerScreenX+6, playerScreenY+10, 4,2); break;
      case 'LEFT': ctx.fillRect(playerScreenX+1, playerScreenY+6, 2,4); break;
      case 'RIGHT': ctx.fillRect(playerScreenX+13, playerScreenY+6, 2,4); break;
    }
  }

  // For battle, render enemy sprite front-facing (provisional)
  renderEnemySprite(ctx: CanvasRenderingContext2D, speciesId: string, x: number, y: number, size: number, isShaking: boolean = false, isLunging: boolean = false) {
    // Provisional enemy sprites — darker grounded fantasy, not Pokemon-style glossy
    // Each species has distinct silhouette

    const shakeX = isShaking ? (Math.random()-0.5)*10 : 0;
    const lungeY = isLunging ? -10 : 0;

    const drawX = x + shakeX;
    const drawY = y + lungeY;

    // Base
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(drawX + size/2, drawY + size - 10, size/3, 8, 0, 0, Math.PI*2);
    ctx.fill();

    // Species-specific provisional art
    if (speciesId.includes('STARTER-01') || speciesId.includes('bramblekin')) {
      // Bramblekin — bramble/moss
      ctx.fillStyle = '#3a4a2a';
      ctx.fillRect(drawX + size*0.2, drawY + size*0.3, size*0.6, size*0.5);
      ctx.fillStyle = '#5a6a3a';
      // Thorns
      for (let i=0;i<5;i++) {
        ctx.fillRect(drawX + size*0.2 + i*size*0.12, drawY + size*0.25, 2, 6);
      }
      ctx.fillStyle = '#2a3a1a';
      ctx.beginPath();
      ctx.arc(drawX + size*0.5, drawY + size*0.4, size*0.15, 0, Math.PI*2);
      ctx.fill();
    } else if (speciesId.includes('STARTER-02') || speciesId.includes('emberling')) {
      // Emberling — hearth ember
      ctx.fillStyle = '#4a2a1a';
      ctx.fillRect(drawX + size*0.25, drawY + size*0.3, size*0.5, size*0.5);
      ctx.fillStyle = '#8a4a2a';
      ctx.beginPath();
      ctx.arc(drawX + size*0.5, drawY + size*0.35, size*0.2, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#ffaa44';
      ctx.beginPath();
      ctx.arc(drawX + size*0.5, drawY + size*0.35, size*0.08, 0, Math.PI*2);
      ctx.fill();
    } else if (speciesId.includes('STARTER-03') || speciesId.includes('tidemaw')) {
      // Tidemaw — water
      ctx.fillStyle = '#2a4a5a';
      ctx.fillRect(drawX + size*0.2, drawY + size*0.3, size*0.6, size*0.5);
      ctx.fillStyle = '#4a6a7a';
      ctx.beginPath();
      ctx.arc(drawX + size*0.5, drawY + size*0.5, size*0.25, 0, Math.PI*2);
      ctx.fill();
    } else if (speciesId.includes('OPPONENT-01') || speciesId.includes('hound')) {
      // Hollow Hound — lean feral
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(drawX + size*0.15, drawY + size*0.4, size*0.7, size*0.3);
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(drawX + size*0.7, drawY + size*0.3, size*0.2, size*0.2); // head
      ctx.fillStyle = '#5a3a3a';
      ctx.fillRect(drawX + size*0.75, drawY + size*0.35, 4, 2); // eye
    } else {
      // Default — Gloam Mite
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(drawX + size*0.2, drawY + size*0.3, size*0.6, size*0.5);
      ctx.fillStyle = '#4a4a5a';
      for (let i=0;i<3;i++) {
        ctx.fillRect(drawX + size*0.15 + i*size*0.25, drawY + size*0.6, 4, 10);
      }
    }

    // Outline for readability
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX, drawY, size, size);
  }
}
