const fs = require('fs');
let code = fs.readFileSync('./src/app/chat/[userId]/page.tsx', 'utf8');

// Gasim si inlocuim render-ul conditional al ContactsList
const oldRender = `{(!isMobile || showContacts) && <ContactsList />}`;
const newRender = `<ContactsList />`;

if (code.includes(oldRender)) {
  code = code.replace(oldRender, newRender);
  console.log('✅ ContactsList mereu vizibil!');
} else {
  // Cautam orice varianta cu ContactsList render
  const idx = code.indexOf('<ContactsList />');
  console.log('ContactsList render la:', idx);
  console.log('Context:', code.substring(idx - 100, idx + 50));
}

fs.writeFileSync('./src/app/chat/[userId]/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/chat/[userId]/page.tsx').size);