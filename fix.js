const fs = require('fs');
let emp = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// 1. SIDEBAR
emp = emp.replace(
  /const sidebarSections = \[[\s\S]*?\];/,
  `const sidebarSections = [
    { section: "Client" },
    { id: "dashboard", icon: "⚡", label: "Dashboard" },
    { id: "editare-profil", icon: "✏️", label: "Editeaza Profilul" },
    { id: "rezervari-client", icon: "🗓", label: "Rezervarile mele" },
    { id: "recenzii-oferite-emp", icon: "⭐", label: "Recenzii oferite" },
    { section: "Prestator" },
    { id: "servicii", icon: "✂️", label: "Serviciile mele" },
    { id: "calendar", icon: "📅", label: "Calendarul meu" },
    { id: "cereri", icon: "📋", label: "Programari" },
    { id: "recenzii-primite-emp", icon: "💬", label: "Recenzii primite" },
    { section: "Cont" },
    { id: "mesaje", icon: "💬", label: "Mesaje" },
    { id: "financiar", icon: "📊", label: "Situatie financiara" },
    { id: "setari", icon: "⚙️", label: "Setari" },
  ];`
);
console.log('✅ 1. Sidebar');

// 2. SECTION RENDER
const oldRender = emp.match(/if \(item\.section\) return \([\s\S]*?\);\s*\n/)?.[0];
if (oldRender) {
  emp = emp.replace(oldRender,
    `if (item.section) return (\r\n                <div key={i} style={{ fontSize: 10, color: "#444", textTransform: "uppercase" as const, letterSpacing: "0.8px", padding: "10px 12px 4px" }}>\r\n                  {item.section}\r\n                </div>\r\n              );\r\n`
  );
}
console.log('✅ 2. Section render');

// 3. getSectionTitle - SAFE: inserare inainte de "return titles"
emp = emp.replace(
  `    return titles[activeSection] || "Dashboard";`,
  `    titles["rezervari-client"] = "Rezervarile mele";
    titles["recenzii-oferite-emp"] = "Recenzii oferite";
    titles["recenzii-primite-emp"] = "Recenzii primite";
    titles["cereri"] = "Programari";
    titles["editare-profil"] = "Editeaza Profilul";
    titles["servicii"] = "Serviciile mele";
    titles["calendar"] = "Calendarul meu";
    return titles[activeSection] || "Dashboard";`
);
console.log('✅ 3. getSectionTitle');

// 4. BOTTOMNAV
emp = emp.replace(
  /const bottomNavItems = \[[\s\S]*?\];/,
  `const bottomNavItems = [
    { id: "dashboard", icon: "⚡", label: "Home" },
    { id: "rezervari-client", icon: "🗓", label: "Rezervari" },
    { id: "cereri", icon: "📋", label: "Programari" },
    { id: "mesaje", icon: "💬", label: "Mesaje" },
    { id: "setari", icon: "⚙️", label: "Cont" },
  ];`
);
console.log('✅ 4. BottomNav');

// 5. HEADER - gasim in contextul TOPBAR, nu sidebar
const topbarIdx = emp.indexOf('TOPBAR');
const topbarSection = emp.substring(topbarIdx, topbarIdx + 2000);
const editBtnInTopbar = topbarSection.indexOf('<button onClick={() => setActiveSection("editare-profil")');
if (editBtnInTopbar > -1) {
  const absoluteStart = topbarIdx + editBtnInTopbar;
  const absoluteEnd = emp.indexOf('</button>', absoluteStart) + 9;
  const newBtn = `{!isMobile && (\r\n              <>\r\n                <a href="/" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>🏠 Home</a>\r\n                <a href="/despre" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Despre noi</a>\r\n                <a href="/contact" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Contact</a>\r\n                <button onClick={() => router.push("/search")} style={{ padding: "7px 14px", background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>🔍 Cauta servicii</button>\r\n              </>\r\n            )}`;
  emp = emp.substring(0, absoluteStart) + newBtn + emp.substring(absoluteEnd);
  console.log('✅ 5. Header');
} else {
  console.log('❌ Header button not found in topbar');
}

// 6. EMAIL + TOGGLE
emp = emp.replace(
  `  const [profileLoading, setProfileLoading] = useState(false);`,
  `  const [profileLoading, setProfileLoading] = useState(false);\r\n  const [emailVisible, setEmailVisible] = useState(true);`
);
const dpIdx = emp.indexOf('>Date personale</div>');
if (dpIdx > -1) {
  const emailField = '\r\n              <div>\r\n'
    + '                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Email</div>\r\n'
    + '                <div style={{ display: "flex", gap: 8 }}>\r\n'
    + '                  <input value={user?.email || ""} disabled style={{ flex: 1, padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "not-allowed" }} />\r\n'
    + '                  <button onClick={() => setEmailVisible(!emailVisible)} style={{ padding: "11px 14px", borderRadius: 10, border: `1px solid ${emailVisible ? "rgba(76,175,130,0.4)" : s.border}`, background: emailVisible ? "rgba(76,175,130,0.1)" : s.surface2, color: emailVisible ? s.green : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" as const }}>{emailVisible ? "👁 Vizibil" : "🙈 Ascuns"}</button>\r\n'
    + '                </div>\r\n'
    + '                <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>Controleaza daca emailul apare pe profilul public</div>\r\n'
    + '              </div>';
  emp = emp.substring(0, dpIdx + 21) + emailField + emp.substring(dpIdx + 21);
  console.log('✅ 6. Email + toggle');
}

// 7. LABELS
emp = emp.replace(/Ca și Client/g, 'Client');
emp = emp.replace(/Ca și Angajat/g, 'Angajat');
console.log('✅ 7. Labels');

// 8. SECTIUNI NOI
const serviciiSectionIdx = emp.indexOf('{/* ===== SERVICII =====');
const newSections = '{/* ===== RECENZII OFERITE EMP ===== */}\r\n'
  + '          {activeSection === "recenzii-oferite-emp" && (\r\n'
  + '            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>\r\n'
  + '              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>\r\n'
  + '                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Recenzii oferite de mine</div>\r\n'
  + '                {[{ rating:5, comment:"Serviciu excelent!", target:"Color Craft Studio", date:"10 mai 2025" }].map((rev, i) => (\r\n'
  + '                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>\r\n'
  + '                    <div style={{ flex: 1 }}>\r\n'
  + '                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>\r\n'
  + '                        <div style={{ fontSize: 13, fontWeight: 700 }}>{rev.target}</div>\r\n'
  + '                        <div style={{ fontSize: 12, color: s.accent }}>{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</div>\r\n'
  + '                        <div style={{ fontSize: 11, color: s.muted }}>{rev.date}</div>\r\n'
  + '                      </div>\r\n'
  + '                      <div style={{ fontSize: 13, color: "#c0bdb8" }}>{rev.comment}</div>\r\n'
  + '                    </div>\r\n'
  + '                    <button style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>🗑 Sterge</button>\r\n'
  + '                  </div>\r\n'
  + '                ))}\r\n'
  + '              </div>\r\n'
  + '            </div>\r\n'
  + '          )}\r\n\r\n'
  + '          {/* ===== RECENZII PRIMITE EMP ===== */}\r\n'
  + '          {activeSection === "recenzii-primite-emp" && (\r\n'
  + '            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>\r\n'
  + '              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>\r\n'
  + '                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>\r\n'
  + '                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Recenzii primite</div>\r\n'
  + '                  <div style={{ fontSize: 14, color: s.accent, fontWeight: 700 }}>★ 4.9</div>\r\n'
  + '                </div>\r\n'
  + '                {reviews.length === 0 ? (<div style={{ textAlign: "center", padding: "30px 0", color: s.muted, fontSize: 13 }}>Nicio recenzie inca</div>) : reviews.map((rev: any, i: number) => (\r\n'
  + '                  <div key={i} style={{ padding: "14px 0", borderBottom: i < reviews.length-1 ? `1px solid ${s.surface2}` : "none" }}>\r\n'
  + '                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>\r\n'
  + '                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>\r\n'
  + '                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{rev.client?.name?.charAt(0)||"C"}</div>\r\n'
  + '                        <div><div style={{ fontSize: 13, fontWeight: 700 }}>{rev.client?.name||"Client"}</div><div style={{ fontSize: 10, color: s.muted }}>Client verificat</div></div>\r\n'
  + '                      </div>\r\n'
  + '                      <div style={{ fontSize: 13, color: s.accent }}>{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</div>\r\n'
  + '                    </div>\r\n'
  + '                    {rev.comment && <div style={{ fontSize: 13, color: "#c0bdb8", lineHeight: 1.6 }}>{rev.comment}</div>}\r\n'
  + '                  </div>\r\n'
  + '                ))}\r\n'
  + '              </div>\r\n'
  + '            </div>\r\n'
  + '          )}\r\n\r\n          ';
emp = emp.substring(0, serviciiSectionIdx) + newSections + emp.substring(serviciiSectionIdx);
console.log('✅ 8. New sections');

// 9. PRESTATOR CARD + GALERIE
const scIdx = emp.indexOf('{/* SERVICII + CERERI */}');
const prestatorCard = '              {user.gallery && user.gallery.length > 0 && (\r\n'
  + '                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 14 : 18 }}>\r\n'
  + '                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>\r\n'
  + '                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600 }}>Galerie foto</div>\r\n'
  + '                    <button onClick={() => setActiveSection("editare-profil")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Gestioneaza →</button>\r\n'
  + '                  </div>\r\n'
  + '                  <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "72px" : "90px"}, 1fr))`, gap: 6 }}>\r\n'
  + '                    {user.gallery.slice(0,6).map((img: string, i: number) => (\r\n'
  + '                      <div key={i} style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden" }}><img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>\r\n'
  + '                    ))}\r\n'
  + '                  </div>\r\n'
  + '                </div>\r\n'
  + '              )}\r\n\r\n'
  + '              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20, borderTop: "3px solid rgba(201,169,110,0.4)" }}>\r\n'
  + '                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.accent }}>🔧 Prestator</div>\r\n'
  + '                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>\r\n'
  + '                  {[[bookings.length.toString(),"Programari",s.accent],[bookings.filter((b:any)=>b.status==="pending").length.toString(),"In asteptare",s.yellow],[bookings.filter((b:any)=>b.status==="completed").reduce((a:number,b:any)=>a+(b.totalPrice||0),0)+" lei","Incasat",s.green]].map(([val,label,color])=>(\r\n'
  + '                    <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}><div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile?18:22, fontWeight: 700, color }}>{val}</div><div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div></div>\r\n'
  + '                  ))}\r\n'
  + '                </div>\r\n'
  + '                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>\r\n'
  + '                  <div style={{ fontSize: 13, fontWeight: 600 }}>Serviciile mele</div>\r\n'
  + '                  <button onClick={() => setActiveSection("servicii")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>\r\n'
  + '                </div>\r\n'
  + '                {services.slice(0,3).map((svc:any,idx:number)=>{const colors=["#c9a96e","#5a8de0","#4caf82"]; return(<div key={svc.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:idx<2?`1px solid ${s.surface2}`:"none"}}><div style={{width:3,height:32,borderRadius:2,background:colors[idx%3],flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{svc.name}</div><div style={{fontSize:11,color:s.muted}}>{svc.duration*30} min</div></div><div style={{fontSize:14,fontWeight:700,color:s.accent}}>{svc.price} lei</div></div>);})}\r\n'
  + '              </div>\r\n\r\n              ';
emp = emp.substring(0, scIdx) + prestatorCard + emp.substring(scIdx);
console.log('✅ 9. Prestator card');

fs.writeFileSync('./src/app/dashboard/employee/page.tsx', emp);
console.log('\n✅ GATA! Size:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);