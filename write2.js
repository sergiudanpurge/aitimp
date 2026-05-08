const fs = require('fs');
const code = fs.readFileSync('./employee-profile-code.txt', 'utf8');
fs.writeFileSync('./src/app/dashboard/employee/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);