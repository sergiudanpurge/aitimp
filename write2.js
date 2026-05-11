const fs = require('fs');

// Adauga sectiunea financiara in dashboard/user/page.tsx
let user = fs.readFileSync('./src/app/dashboard/user/page.tsx', 'utf8');

// 1. Adauga import
if (!user.includes('FinancialDashboard')) {
  user = user.replace(
    `import Link from "next/link";`,
    `import Link from "next/link";\nimport FinancialDashboard from "@/components/dashboard/FinancialDashboard";`
  );
}

// 2. Adauga in sidebarSections dupa setari
user = user.replace(
  `{ id: "setari", icon: "⚙️", label: "Setări" },`,
  `{ id: "setari", icon: "⚙️", label: "Setări" },\n    { id: "financiar", icon: "📊", label: "Situație financiară" },`
);

// 3. Adauga in bottomNavItems
user = user.replace(
  `{ id: "setari", icon: "⚙️", label: "Setări" },\n  ];`,
  `{ id: "setari", icon: "⚙️", label: "Setări" },\n    { id: "financiar", icon: "📊", label: "Financiar" },\n  ];`
);

// 4. Adauga sectiunea financiara inainte de sectiunea setari
user = user.replace(
  `{/* ===== SETARI ===== */}`,
  `{/* ===== FINANCIAR ===== */}
          {activeSection === "financiar" && (
            <FinancialDashboard bookings={bookings} services={services} />
          )}

          {/* ===== SETARI ===== */}`
);

fs.writeFileSync('./src/app/dashboard/user/page.tsx', user);
console.log('✅ Dashboard User updated:', fs.statSync('./src/app/dashboard/user/page.tsx').size);

// Adauga in dashboard/page.tsx (Companie)
let company = fs.readFileSync('./src/app/dashboard/page.tsx', 'utf8');

if (!company.includes('FinancialDashboard')) {
  company = company.replace(
    `"use client";`,
    `"use client";\nimport FinancialDashboard from "@/components/dashboard/FinancialDashboard";`
  );
}

fs.writeFileSync('./src/app/dashboard/page.tsx', company);
console.log('✅ Dashboard Company updated');

// Adauga in dashboard/employee/page.tsx
let emp = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

if (!emp.includes('FinancialDashboard')) {
  emp = emp.replace(
    `"use client";`,
    `"use client";\nimport FinancialDashboard from "@/components/dashboard/FinancialDashboard";`
  );
}

// Adauga sectiunea financiara in employee
emp = emp.replace(
  `{/* PLACEHOLDER PAGES */}`,
  `{activeNav === "financiar" && (
            <FinancialDashboard bookings={bookings} services={services} />
          )}

          {/* PLACEHOLDER PAGES */}`
);

// Adauga financiar in sidebar employee
emp = emp.replace(
  `{ id: "calendar", icon: "🗓", label: "Calendarul meu" },`,
  `{ id: "calendar", icon: "🗓", label: "Calendarul meu" },\n              { id: "financiar", icon: "📊", label: "Situație financiară" },`
);

fs.writeFileSync('./src/app/dashboard/employee/page.tsx', emp);
console.log('✅ Dashboard Employee updated');

console.log('\n🎉 Done! FinancialDashboard adaugat in toate dashboardurile!');