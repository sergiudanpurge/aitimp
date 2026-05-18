const fs = require('fs');
const c = fs.readFileSync('./src/app/dashboard/page.tsx', 'utf8');
const idx = c.indexOf('activeSection === "angajati"');
console.log(c.substring(idx, idx + 400));