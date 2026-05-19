const fs = require('fs');
let api = fs.readFileSync('./src/app/api/services/route.ts', 'utf8');

api = api.replace(
  /const \{ name: rawName.*?\} = await request\.json\(\)[\r\n]+/,
  `const { name: rawName, duration, price, employeeId, icon, description, gallery } = await request.json()\r\n    const name = (rawName || "").trim().charAt(0).toUpperCase() + (rawName || "").trim().slice(1).toLowerCase()\r\n`
);

fs.writeFileSync('./src/app/api/services/route.ts', api);
const content = fs.readFileSync('./src/app/api/services/route.ts', 'utf8');
console.log('Are "const name =":', content.includes('const name ='));
console.log('Size:', content.length);