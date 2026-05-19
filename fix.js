const fs = require('fs');
const c = fs.readFileSync('./src/app/api/register/route.ts', 'utf8');
c.split('\n').forEach((l, i) => console.log(i+1, l));