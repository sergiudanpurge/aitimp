const fs = require('fs');
let api = fs.readFileSync('./src/app/api/public/[slug]/route.ts', 'utf8');

api = api.replace(
  `services: { where: { isActive: true }, select: { id: true, name: true, duration: true, price: true, icon: true } }`,
  `services: { where: { isActive: true }, select: { id: true, name: true, duration: true, price: true, icon: true, description: true, gallery: true } }`
);

// Verificam si pentru employees
api = api.replace(
  /services: { where: { isActive: true }, select: { id: true, name: true, duration: true, price: true, icon: true } }/g,
  `services: { where: { isActive: true }, select: { id: true, name: true, duration: true, price: true, icon: true, description: true, gallery: true } }`
);

fs.writeFileSync('./src/app/api/public/[slug]/route.ts', api);
console.log('✅ Public API updated! Size:', fs.statSync('./src/app/api/public/[slug]/route.ts').size);