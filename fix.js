const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// Gasim linia cu profileLoading
const idx = code.indexOf('const [profileLoading, setProfileLoading]');
const lineEnd = code.indexOf('\r\n', idx) + 2;
console.log('Inserare dupa:', code.substring(idx, lineEnd));

const newStates = `  const [calMonth, setCalMonth] = useState(new Date().getMonth());\r\n  const [calYear, setCalYear] = useState(new Date().getFullYear());\r\n  const [calSelectedDay, setCalSelectedDay] = useState<number | null>(null);\r\n`;

code = code.substring(0, lineEnd) + newStates + code.substring(lineEnd);
fs.writeFileSync('./src/app/dashboard/employee/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);