// Checklist 06: first sold in Cossenne, 800 doubloons, full strength after 30 elapsed turns.
export const PATIENT_RATION={id:'patient-ration',key:'patientRations',name:'Patient Ration',price:800,text:'Capture food grows stronger with elapsed battle turns: 1× initially, 2× after 10 turns, 3× after 20, and 4× after 30. Refused offers consume a ration.'};
export function patientStrength(round=1){const elapsed=Math.max(0,Math.floor(Number(round)||1)-1);return Math.min((elapsed+10)/10,4);}
