const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

const startMarker = '\r\n\r\n              {/* CA SI CLIENT */}\r\n              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>\r\n                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue }}>👤 Ca și Client</div>';

const endMarker = '\r\n\r\n              {/* SERVICII + CERERI */}';

const startIdx = code.indexOf(startMarker, 26000); // A doua aparitie
const endIdx = code.indexOf(endMarker, startIdx);

console.log('Start:', startIdx);
console.log('End:', endIdx);

if (startIdx > -1 && endIdx > -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
  console.log('✅ Bloc sters!');
  fs.writeFileSync('./src/app/dashboard/employee/page.tsx', code);
  console.log('Done:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);
} else {
  console.log('❌ Negasit');
}