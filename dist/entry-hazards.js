export function placeEntryHazard(field, side, kind) {
  if (!field || !side) return false;
  const hazards = (field.hazards ??= {});
  const sideHazards = (hazards[side] ??= []);
  if (sideHazards.includes(kind)) return false;
  sideHazards.push(kind);
  return true;
}

export function enterHazards(unit, field, {grounded, removeLayer, damageFor}) {
  const hazards = field.hazards?.[unit.side];
  if (!hazards?.length || unit.hp <= 0 || unit.dead) return [];
  if (removeLayer) return [{removed:hazards.shift()}];
  const rubble = hazards.indexOf('quarry-rubble');
  if (!grounded || rubble < 0) return [];
  hazards.splice(rubble, 1);
  // Keep entry chip nonlethal while every switch path can still use the same entry hook.
  const floor = Math.max(1, unit.combatFloor ?? 0);
  const damage = Math.max(0, Math.min(unit.hp - floor, damageFor(Math.max(1, Math.floor(unit.maxHp / 8)))));
  unit.hp -= damage;
  return [{kind:'quarry-rubble', damage}];
}
