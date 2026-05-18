const fs = require('fs');

['./src/app/dashboard/employee/page.tsx', './src/app/dashboard/page.tsx'].forEach(path => {
  const c = fs.readFileSync(path, 'utf8');
  const defIdx = c.indexOf('useState("');
  const def = c.substring(defIdx + 10, defIdx + 30).split('"')[0];
  const sidebarDash = c.includes('{ id: "dashboard"');
  console.log(path.split('/').pop(), '→ default:', def, '| sidebar "dashboard":', sidebarDash);
});