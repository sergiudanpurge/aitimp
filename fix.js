const fs = require('fs');
let user = fs.readFileSync('./src/app/dashboard/user/page.tsx', 'utf8');

// Gasim div-ul gol din header
const svcIdx = user.indexOf('activeSection === "servicii"');
const emptyDiv = user.indexOf('justifyContent: "flex-end" }}>', svcIdx);
const emptyDivEnd = user.indexOf('</div>', emptyDiv) + 6;

console.log('Empty div pos:', emptyDiv, '-', emptyDivEnd);
console.log('Content:', JSON.stringify(user.substring(emptyDiv, emptyDivEnd)));

// Inlocuim cu div cu buton
const newHeader = `justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600 }}>Serviciile mele</div>
                <button onClick={() => setShowAddService(true)} style={{ padding: "9px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adaugă serviciu</button>
              </div>`;

user = user.substring(0, emptyDiv) + newHeader + user.substring(emptyDivEnd);
fs.writeFileSync('./src/app/dashboard/user/page.tsx', user);
console.log('Done! Has btn:', user.includes('setShowAddService(true)'));
console.log('Size:', fs.statSync('./src/app/dashboard/user/page.tsx').size);