const fs = require('fs');
const path = './src/app/dashboard/employees/[id]/page.tsx';

// Citim codul din documentul salvat
const code = fs.readFileSync('./employee-profile-code.txt', 'utf8');
fs.writeFileSync(path, code);
console.log('Done:', fs.statSync(path).size);