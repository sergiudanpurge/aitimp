const fs = require('fs');
const emp = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// Extragem stats block de la Employee
const empSvcIdx = emp.indexOf('activeSection === "servicii"');
const empStatsStart = emp.indexOf('{services.length > 0 && (() => {', empSvcIdx);
const empStatsEnd = emp.indexOf('})()}', empStatsStart) + 5;
const statsBlock = emp.substring(empStatsStart, empStatsEnd);
console.log('Stats block size:', statsBlock.length);

// Adaugam la User inainte de {services.length === 0
let user = fs.readFileSync('./src/app/dashboard/user/page.tsx', 'utf8');
const userSvcIdx = user.indexOf('activeSection === "servicii"');
const insertPoint = user.indexOf('{services.length === 0 ?', userSvcIdx);
console.log('Insert point:', insertPoint);

user = user.substring(0, insertPoint) + statsBlock + '\n              ' + user.substring(insertPoint);
fs.writeFileSync('./src/app/dashboard/user/page.tsx', user);
console.log('✅ Done! Size:', fs.statSync('./src/app/dashboard/user/page.tsx').size);