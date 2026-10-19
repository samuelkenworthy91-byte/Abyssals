export const BINOCULAR_BATTLES=8;
export function normalizeBinoculars(state){for(const key of ['binoculars','binocularBattles'])if(!Number.isSafeInteger(state[key])||state[key]<0)state[key]=0;state.binocularBattles=Math.min(BINOCULAR_BATTLES,state.binocularBattles);return state;}
export function activateBinoculars(state){normalizeBinoculars(state);if(state.binoculars<1||state.binocularBattles>0)return false;state.binoculars--;state.binocularBattles=BINOCULAR_BATTLES;return true;}
