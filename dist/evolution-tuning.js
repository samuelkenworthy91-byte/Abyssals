// Requested play-test stagger. The authored registry remains available as provenance.
export function tunedEvolution(path,species){
 if(path.approvedExpansion)return path;
 if(path.condition.method!=='LEVEL'||path.condition.minimum_level!==26)return path;
 const early={'010':14,'012':18,'014':20,'016':22,'023':16,'033':22,'042':22,'055':24};
 const bst=species.bst;let level=early[species.id]??(bst<=290?16:bst<=320?18:bst<=350?22:bst<=380?24:bst<=410?28:32);
 if(early[species.id]===undefined&&species.types.includes('BUG'))level=Math.max(12,level-2);
 return {...path,authoredMinimumLevel:path.condition.minimum_level,condition:{...path.condition,minimum_level:level}};
}
