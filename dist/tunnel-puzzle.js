// Push stones onto the two drain covers. The walkable board is authored, not a click sequence.
export const BOARD={x:31,y:14,rows:['#########','#.......#','#..#....#','...$$....','#.......#','#..#....#','#########'],goals:[[33,15],[37,19]],stones:[[34,17],[35,17]]};
export const VALVES=[]; // Legacy exports retained for old saves/tests; valves no longer drive progression.
export const PUZZLE_CLUE='Two loose stones must weigh down the marked drain covers. Stand beside a stone and walk into it to push; you cannot pull. Plan where you will stand for the next push. Use Reset stones here if you trap one.';
export function puzzleState(state){const p=state.tunnelPuzzle??={};if(p.version!==2){const solved=!!p.solved;Object.assign(p,{version:2,stones:BOARD.stones.map(p=>[...p]),solved,moves:0});}return p;}
export function onBoard(x,y){return x>=BOARD.x&&x<BOARD.x+9&&y>=BOARD.y&&y<BOARD.y+7;}
export function boardWall(x,y){return onBoard(x,y)&&BOARD.rows[y-BOARD.y][x-BOARD.x]==='#';}
export function stoneAt(state,x,y){return puzzleState(state).stones.findIndex(p=>p[0]===x&&p[1]===y);}
export function pushStone(state,x,y,dx,dy){const p=puzzleState(state),i=stoneAt(state,x,y),nx=x+dx,ny=y+dy;if(p.solved||i<0||Math.abs(dx)+Math.abs(dy)!==1||!onBoard(nx,ny)||boardWall(nx,ny)||stoneAt(state,nx,ny)>=0)return false;p.stones[i]=[nx,ny];p.moves++;p.solved=BOARD.goals.every(g=>p.stones.some(s=>s[0]===g[0]&&s[1]===g[1]));return true;}
export function resetStones(state){const p=puzzleState(state);if(p.solved)return false;p.stones=BOARD.stones.map(s=>[...s]);p.moves=0;return true;}
export function turnValve(){return {solved:false,text:'The old valves have been disconnected. Clear the stone chamber instead.'};}
