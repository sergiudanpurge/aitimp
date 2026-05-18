const fs = require('fs');

const files = {
  'Admin': './src/app/dashboard/page.tsx',
  'Employee': './src/app/dashboard/employee/page.tsx',
  'User': './src/app/dashboard/user/page.tsx'
};

Object.entries(files).forEach(([name, path]) => {
  const c = fs.readFileSync(path, 'utf8');
  // Gasim toate sectiunile
  const sections = [...c.matchAll(/===== ([A-Z\u0080-\uFFFF ]+) =====/g)];
  console.log(`\n${name} - sectiuni:`);
  sections.forEach(s => {
    const after = c.substring(s.index, s.index + 500);
    const isPlaceholder = after.includes('vine') && after.includes('cur');
    console.log(` ${isPlaceholder ? '❌' : '✅'} ${s[1]}`);
  });
});