const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// Inlocuim fontSize: 10 cu 11 si fontSize: 11 cu 12 pentru text normal (nu badges/labels)
let count10 = 0, count11 = 0;

// fontSize 10 -> 11 (text normal, nu shorthand)
code = code.replace(/fontSize: 10, color: s\.muted/g, (m) => { count10++; return 'fontSize: 11, color: s.muted'; });
code = code.replace(/fontSize: 10, color: "#/g, (m) => { count10++; return 'fontSize: 11, color: "#'; });
code = code.replace(/fontSize: 10, fontWeight: 600/g, (m) => { count10++; return 'fontSize: 11, fontWeight: 600'; });
code = code.replace(/fontSize: 10, fontWeight: 700/g, (m) => { count10++; return 'fontSize: 12, fontWeight: 700'; });

// fontSize 11 text -> 12
code = code.replace(/fontSize: 11, color: s\.muted/g, (m) => { count11++; return 'fontSize: 12, color: s.muted'; });
code = code.replace(/fontSize: 11, fontWeight: 600/g, (m) => { count11++; return 'fontSize: 12, fontWeight: 600'; });

// fontSize 13 unde lipseste
code = code.replace(/fontSize: 13, fontWeight: 700, color: s\.accent/g, 'fontSize: 14, fontWeight: 700, color: s.accent');

console.log('Schimbari fontSize 10:', count10);
console.log('Schimbari fontSize 11:', count11);

fs.writeFileSync('./src/app/dashboard/employee/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);