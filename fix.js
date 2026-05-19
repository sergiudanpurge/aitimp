const fs = require('fs');
let admin = fs.readFileSync('./src/app/dashboard/page.tsx', 'utf8');

if (!admin.includes('import ServiceCard')) {
  admin = admin.replace(
    `import RezervariMele from "@/components/dashboard/RezervariMele";`,
    `import RezervariMele from "@/components/dashboard/RezervariMele";\nimport ServiceCard from "@/components/dashboard/ServiceCard";`
  );
}

const aMapIdx = admin.indexOf('tabServices.map((svc: any, idx: number) => {');
const aListDiv = admin.lastIndexOf('<div style={{ display: "grid"', aMapIdx);
const aNext = admin.indexOf('{/* ===== ANGAJATII', aMapIdx);
const aListEnd = admin.lastIndexOf('</div>', aNext - 100) + 6;

console.log('aListDiv:', aListDiv, 'aListEnd:', aListEnd);
console.log('GridDiv:', admin.substring(aListDiv, aListDiv + 80));

const newAdminList = `<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {tabServices.map((svc: any, idx: number) => (
                          <ServiceCard key={svc.id} service={svc} index={idx} showOwner={true}
                            onEdit={() => alert("Edit: " + svc.name)}
                            onToggleActive={() => fetch("/api/services", {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:svc.id, isActive:!svc.isActive})}).then(()=>fetch("/api/services").then(r=>r.json()).then(d=>setServices(d.services||[])))}
                            onDelete={() => fetch("/api/services", {method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:svc.id})}).then(()=>setServices((prev:any)=>prev.filter((s:any)=>s.id!==svc.id)))}
                          />
                        ))}
                      </div>`;

admin = admin.substring(0, aListDiv) + newAdminList + admin.substring(aListEnd);
fs.writeFileSync('./src/app/dashboard/page.tsx', admin);
console.log('✅ Admin done! Size:', fs.statSync('./src/app/dashboard/page.tsx').size);