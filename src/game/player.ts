// Player movement — 4 directions only, 16x16 logic grid, 64-112 px/s per ACTIVE_CANON

import { MapData } from '../core/types';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export class PlayerController {
  x: number; // tile coords
  y: number;
  pixelX: number;
  pixelY: number;
  direction: Direction = 'DOWN';
  isMoving: boolean = false;
  moveProgress: number = 0; // 0..1
  targetX: number;
  targetY: number;
  speed: number = 90; // px/s, within 64-112 band
  tileSize: number = 16;

  // For input buffering
  private queuedDirection: Direction | null = null;

  constructor(x: number, y: number, tileSize: number = 16) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.tileSize = tileSize;
    this.pixelX = x * tileSize;
    this.pixelY = y * tileSize;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.pixelX = x * this.tileSize;
    this.pixelY = y * this.tileSize;
    this.isMoving = false;
    this.moveProgress = 0;
  }

  queueDirection(dir: Direction) {
    this.queuedDirection = dir;
  }

  // Check collision
  canMoveTo(map: MapData, tx: number, ty: number): boolean {
    if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) {
      return false; // edge will be handled as warp
    }
    const tile = map.tiles[ty][tx];
    return tile === 0; // 0 walkable
  }

  tryMove(dir: Direction, map: MapData): boolean {
    if (this.isMoving) {
      this.queuedDirection = dir;
      return false;
    }

    this.direction = dir;
    let tx = this.x;
    let ty = this.y;

    switch (dir) {
      case 'UP': ty--; break;
      case 'DOWN': ty++; break;
      case 'LEFT': tx--; break;
      case 'RIGHT': tx++; break;
    }

    // Edge transition
    if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) {
      // Check warps
      const warp = map.warps.find(w => w.x === this.x && w.y === this.y);
      // For edge, allow if warp exists at edge, else block
      // For simplicity, allow edge movement to trigger warp check outside
      return true;
    }

    if (this.canMoveTo(map, tx, ty)) {
      this.targetX = tx;
      this.targetY = ty;
      this.isMoving = true;
      this.moveProgress = 0;
      return true;
    }

    return false;
  }

  update(deltaTime: number, map: MapData): { moved: boolean; warped?: boolean } {
    if (!this.isMoving) {
      if (this.queuedDirection) {
        const dir = this.queuedDirection;
        this.queuedDirection = null;
        this.tryMove(dir, map);
      }
      return { moved: false };
    }

    // Move progress
    const moveSpeed = this.speed; // px/s
    const distance = this.tileSize; // 16px per tile
    const duration = distance / moveSpeed; // seconds per tile

    this.moveProgress += deltaTime / duration;

    if (this.moveProgress >= 1) {
      this.moveProgress = 0;
      this.x = this.targetX;
      this.y = this.targetY;
      this.pixelX = this.x * this.tileSize;
      this.pixelY = this.y * this.tileSize;
      this.isMoving = false;

      // Check queued
      if (this.queuedDirection) {
        const dir = this.queuedDirection;
        this.queuedDirection = null;
        this.tryMove(dir, map);
      }

      return { moved: true };
    } else {
      // Interpolate pixel position
      const startX = this.x * this.tileSize;
      const startY = this.y * this.tileSize;
      const endX = this.targetX * this.tileSize;
      const endY = this.targetY * this.tileSize;

      this.pixelX = startX + (endX - startX) * this.moveProgress;
      this.pixelY = startY + (endY - startY) * this.moveProgress;

      return { moved: false };
    }
  }

  getPosition() {
    return { x: this.x, y: this.y, pixelX: this.pixelX, pixelY: this.pixelY, direction: this.direction };
  }
}
