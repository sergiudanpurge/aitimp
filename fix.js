const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/user/page.tsx', 'utf8');

// Stergem restul vechiului AddServiceModal
code = code.replace(
  `  // Modal inline mai jos in JSX
  const _unused = () => (`,
  `  // Modal inline`
);

// Stergem si ) : null; care a ramas
code = code.replace(`  ) : null;`, ``);

fs.writeFileSync('./src/app/dashboard/user/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/user/page.tsx').size);