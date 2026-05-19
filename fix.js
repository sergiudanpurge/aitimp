const fs = require('fs');
let c = fs.readFileSync('./src/app/p/[slug]/page.tsx', 'utf8');

// Inlocuim pozitional
const oldStr = "{!selectedService && (\r\n                <div style={{ padding: 20 }}>\r\n                  <div style={";
const newStr = "{(\r\n                <div style={{ padding: 20 }}>\r\n                  <div style={";

c = c.replace(oldStr, newStr);
console.log('Fix aplicat:', c.includes('{(\r\n                <div style={{ padding: 20 }}>'));

// Evidentiez serviciul selectat in lista
c = c.replace(
  'String(selectedService.id) === String(svc.id)) { setSelectedService(null); } else { setSelectedService(svc);',
  'String(selectedService?.id) === String(svc.id)) { setSelectedService(null); } else { setSelectedService(svc);'
);

fs.writeFileSync('./src/app/p/[slug]/page.tsx', c);
console.log('Done:', fs.statSync('./src/app/p/[slug]/page.tsx').size);