const fs = require('fs');
const p = 'C:/aitimp/src/app/dashboard/employees/[id]/page.tsx';
let content = fs.readFileSync(p, 'utf8');
content = content.replace(
  'body: JSON.stringify({ isActive: !employee.isActive })',
  'body: JSON.stringify({ isActive: employee.isActive === false ? true : false })'
);
fs.writeFileSync(p, content);
console.log('Done:', fs.statSync(p).size);