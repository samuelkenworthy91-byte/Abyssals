// Individually edited two-wing sprites replace affected atlas panels everywhere.
export const CORRECTED_BIRD_IDS=['428','431','433','434','443','446','448','449','455','458','464','470','472','473','475','476'];
export const CORRECTED_BIRD_ART=Object.fromEntries(CORRECTED_BIRD_IDS.map(id=>[id,{folder:'bird-corrections',file:id+'.webp',rect:null}]));
