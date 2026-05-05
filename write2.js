const fs = require('fs');
const code = fs.readFileSync('./employee-profile-code.txt', 'utf8');
fs.writeFileSync('./src/app/p/[slug]/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/p/[slug]/page.tsx').size);