// Civeton map data — provisional but follows task visual direction
// Task: small but believable medieval settlement, lived in, grounded, slightly austere, old, religious without fantastical, part of True Light crusade
// Irregular paths, believable house spacing, worn stone, timber, plaster, small fenced plots, vegetation, wells, troughs, storage, signs of work, restrained religious iconography

import { MapData } from '../../core/types';

export const CHILDHOOD_HILL_MAP: MapData = {
  id: 'childhood_hill',
  name: 'Childhood Hill',
  width: 20,
  height: 15,
  tiles: [],
  npcs: [
    {
      id: 'npc_pate_child',
      name: 'Pate',
      x: 8,
      y: 7,
      portrait_id: 'pate_child',
      dialogue_id: 'childhood_pate',
      is_important: true
    },
    {
      id: 'npc_trade_child',
      name: 'Trade',
      x: 10,
      y: 7,
      portrait_id: 'trade_child',
      dialogue_id: 'childhood_trade',
      is_important: true
    }
  ],
  triggers: [
    {
      id: 'trigger_childhood_end',
      x: 5,
      y: 5,
      width: 10,
      height: 5,
      event_id: 'CH01-E01',
      one_shot: true
    }
  ],
  warps: []
};

// Generate simple tilemap with collision
function generateCivetonTiles(): number[][] {
  const width = 40;
  const height = 30;
  const tiles: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));

  // Borders blocked
  for (let x = 0; x < width; x++) {
    tiles[0][x] = 1;
    tiles[height-1][x] = 1;
  }
  for (let y = 0; y < height; y++) {
    tiles[y][0] = 1;
    tiles[y][width-1] = 1;
  }

  // Houses — irregular placement, not grid
  const houses = [
    { x: 3, y: 3, w: 6, h: 5 }, // Pate's house
    { x: 12, y: 4, w: 5, h: 4 }, // Trade's house
    { x: 25, y: 3, w: 6, h: 5 }, // Kurg's post / mustering
    { x: 5, y: 12, w: 5, h: 4 }, // Villager
    { x: 15, y: 14, w: 6, h: 5 }, // Well area house
    { x: 28, y: 12, w: 5, h: 4 },
    { x: 8, y: 22, w: 6, h: 5 },
    { x: 20, y: 22, w: 7, h: 5 }, // Shrine adjacent
    { x: 32, y: 20, w: 5, h: 4 },
  ];

  houses.forEach(h => {
    for (let dy = 0; dy < h.h; dy++) {
      for (let dx = 0; dx < h.w; dx++) {
        const tx = h.x + dx;
        const ty = h.y + dy;
        if (tx >=0 && tx < width && ty >=0 && ty < height) {
          // House interior blocked except door at bottom center
          if (dy === h.h -1 && dx === Math.floor(h.w/2)) {
            // door
            tiles[ty][tx] = 0;
          } else {
            tiles[ty][tx] = 1;
          }
        }
      }
    }
  });

  // Add some fences, wells, etc. as blocked
  // Well at center
  tiles[13][18] = 1;
  tiles[13][19] = 1;
  tiles[14][18] = 1;
  tiles[14][19] = 1;

  // Shrine at north-east-ish
  for (let dx = 0; dx < 3; dx++) {
    for (let dy = 0; dy < 3; dy++) {
      tiles[20+dy][22+dx] = 1;
    }
  }

  // Some trees / rocks as blocked for irregularity
  const obstacles = [
    [10,10], [11,10], [30,8], [31,8], [6,18], [33,15], [12,24], [13,24], [26,24]
  ];
  obstacles.forEach(([x,y]) => {
    if (y < height && x < width) tiles[y][x] = 1;
  });

  return tiles;
}

export const CIVETON_VILLAGE_MAP: MapData = {
  id: 'civeton_village',
  name: 'Civeton Village',
  width: 40,
  height: 30,
  tiles: generateCivetonTiles(),
  npcs: [
    {
      id: 'npc_kurg',
      name: 'General Kurg Halbrecht',
      x: 26,
      y: 8,
      portrait_id: 'kurg',
      dialogue_id: 'kurg_first',
      is_important: true,
      facing: 'DOWN'
    },
    {
      id: 'npc_villager_well',
      name: 'Villager',
      x: 18,
      y: 16,
      dialogue_id: 'villager_well'
    },
    {
      id: 'npc_shrine_keeper',
      name: 'Shrine Keeper',
      x: 22,
      y: 23,
      dialogue_id: 'shrine_keeper'
    },
    {
      id: 'npc_child',
      name: 'Child',
      x: 10,
      y: 20,
      dialogue_id: 'child_npc'
    }
  ],
  triggers: [
    {
      id: 'trigger_pate_house',
      x: 3,
      y: 3,
      width: 6,
      height: 5,
      event_id: 'CH01-E03',
      one_shot: true
    },
    {
      id: 'trigger_trade_house',
      x: 12,
      y: 4,
      width: 5,
      height: 4,
      event_id: 'CH01-E04',
      one_shot: false
    },
    {
      id: 'trigger_kurg',
      x: 25,
      y: 3,
      width: 6,
      height: 6,
      event_id: 'CH01-E04',
      one_shot: false
    },
    {
      id: 'trigger_shrine',
      x: 20,
      y: 20,
      width: 7,
      height: 5,
      event_id: 'CH01-E02',
      one_shot: false
    }
  ],
  warps: [
    {
      id: 'warp_to_march',
      x: 38,
      y: 14,
      target_map: 'civeton_march',
      target_x: 2,
      target_y: 7
    }
  ]
};

export const CIVETON_MARCH_MAP: MapData = {
  id: 'civeton_march',
  name: 'Civeton March',
  width: 25,
  height: 15,
  tiles: Array(15).fill(0).map(() => Array(25).fill(0)),
  npcs: [],
  triggers: [],
  warps: [
    {
      id: 'warp_back_civeton',
      x: 1,
      y: 7,
      target_map: 'civeton_village',
      target_x: 36,
      target_y: 14
    }
  ]
};

export const MAPS: Record<string, MapData> = {
  'childhood_hill': CHILDHOOD_HILL_MAP,
  'civeton_village': CIVETON_VILLAGE_MAP,
  'civeton_march': CIVETON_MARCH_MAP
};

export function getMap(id: string): MapData | undefined {
  return MAPS[id];
}
