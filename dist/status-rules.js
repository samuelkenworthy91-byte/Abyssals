// Shared status bindings for combat, previews, AI and capture checks.
export const STATUS_CAPTURE_MULTIPLIERS=Object.freeze({SLEEP:3,FREEZE:3,PARALYSIS:2,BURN:1.25,FROSTBITE:1.25,POISON:1.25,BAD_POISON:1.25});
export function statusCaptureMultiplier(unit){return STATUS_CAPTURE_MULTIPLIERS[unit?.status]||1;}
export function statusAttackFactor(unit,special){return (unit.status==='BURN'&&!special||unit.status==='FROSTBITE'&&special)?.5:1;}
export function randomStatusDuration(random=Math.random){return 1+Math.min(5,Math.max(0,Math.floor(random()*6)));}
