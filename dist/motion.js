// One browser preference controls both CSS and scripted timing, across save slots.
const KEY='abyssals-motion';
const MODES=['auto','full','reduced'];
let mode='auto';
try{const saved=globalThis.localStorage?.getItem(KEY);if(MODES.includes(saved))mode=saved;}catch{}
const media=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
export function motionPreference(){return mode;}
export function deviceReducesMotion(){return !!media?.matches;}
export function isReducedMotion(){return mode==='reduced'||mode==='auto'&&deviceReducesMotion();}
export function syncMotion(){if(globalThis.document?.documentElement)document.documentElement.dataset.motion=isReducedMotion()?'reduced':'full';}
export function setMotionPreference(value){if(!MODES.includes(value))return false;mode=value;try{globalThis.localStorage?.setItem(KEY,mode);}catch{}syncMotion();return true;}
export function motionDescription(){return mode==='full'?'Full animations enabled.':mode==='reduced'?'Reduced animations enabled.':deviceReducesMotion()?'Your device requests reduced motion. Choose Full to enable the complete animations.':'Following device settings: full animations enabled.';}
media?.addEventListener?.('change',syncMotion);
syncMotion();
