const fs = require('fs');

// ===== EMPLOYEE - LED borders =====
let emp = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// Client card - bordura albastra
emp = emp.replace(
  `<div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue }}>👤 Client</div>`,
  `<div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue }}>👤 Client</div>`
);

// Gasim containerul cardului Client si adaugam borderTop
emp = emp.replace(
  `<div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue, display: "flex", alignItems: "center", gap: 8 }}>👤 Client <div style={{ flex: 1, height: 1, background: "rgba(90,141,224,0.2)" }} /></div>`,
  `<div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue, display: "flex", alignItems: "center", gap: 8 }}>👤 Client <div style={{ flex: 1, height: 1, background: "rgba(90,141,224,0.2)" }} /></div>`
);

// Adaugam borderTop la cardul Client employee
emp = emp.replace(
  `<div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>\r\n                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue`,
  `<div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 20, borderTop: "3px solid rgba(90,141,224,0.6)" }}>\r\n                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue`
);

fs.writeFileSync('./src/app/dashboard/employee/page.tsx', emp);
console.log('✅ Employee LED borders:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);

// ===== USER - LED borders + email visibility =====
let user = fs.readFileSync('./src/app/dashboard/user/page.tsx', 'utf8');

// Client card border
user = user.replace(
  `<div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>\r\n                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue`,
  `<div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 20, borderTop: "3px solid rgba(90,141,224,0.6)" }}>\r\n                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue`
);

// Prestator card border - user already has borderTop from admin fix
// Check and add if missing
if (!user.includes('"3px solid rgba(201,169,110,0.4)"')) {
  user = user.replace(
    `<div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>\r\n                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.accent }}>🔧 Prestator`,
    `<div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 20, borderTop: "3px solid rgba(201,169,110,0.4)" }}>\r\n                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.accent }}>🔧 Prestator`
  );
}

// Email visibility state
user = user.replace(
  `  const [calMonth, setCalMonth] = useState(new Date().getMonth());`,
  `  const [emailVisible, setEmailVisible] = useState(true);\r\n  const [calMonth, setCalMonth] = useState(new Date().getMonth());`
);

// Email field cu toggle in Editare Profil
const dpIdxUser = user.indexOf('>Date personale</div>');
if (dpIdxUser > -1 && !user.includes('emailVisible')) {
  const emailFieldUser = '\r\n              <div>\r\n'
    + '                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Email</div>\r\n'
    + '                <div style={{ display: "flex", gap: 8 }}>\r\n'
    + '                  <input value={user?.email || ""} disabled style={{ flex: 1, padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "not-allowed" }} />\r\n'
    + '                  <button onClick={() => setEmailVisible(!emailVisible)} style={{ padding: "11px 14px", borderRadius: 10, border: `1px solid ${emailVisible ? "rgba(76,175,130,0.4)" : s.border}`, background: emailVisible ? "rgba(76,175,130,0.1)" : s.surface2, color: emailVisible ? s.green : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" as const }}>{emailVisible ? "👁 Vizibil" : "🙈 Ascuns"}</button>\r\n'
    + '                </div>\r\n'
    + '                <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>Controleaza daca emailul apare pe profilul public</div>\r\n'
    + '              </div>';
  user = user.substring(0, dpIdxUser + 21) + emailFieldUser + user.substring(dpIdxUser + 21);
}

fs.writeFileSync('./src/app/dashboard/user/page.tsx', user);
console.log('✅ User LED + email visibility:', fs.statSync('./src/app/dashboard/user/page.tsx').size);

// ===== ADMIN - Email visibility + rezervari in Client card =====
let admin = fs.readFileSync('./src/app/dashboard/page.tsx', 'utf8');

// Email visibility state
admin = admin.replace(
  `  const [reviewFilter, setReviewFilter] = useState("all");`,
  `  const [reviewFilter, setReviewFilter] = useState("all");\r\n  const [emailVisible, setEmailVisible] = useState(true);`
);

// Email field cu toggle in Date companie
const dpIdxAdmin = admin.indexOf('>Date companie</div>');
if (dpIdxAdmin > -1) {
  const emailFieldAdmin = '\r\n                <div>\r\n'
    + '                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Email</div>\r\n'
    + '                  <div style={{ display: "flex", gap: 8 }}>\r\n'
    + '                    <input value={user?.email || ""} disabled style={{ flex: 1, padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "not-allowed" }} />\r\n'
    + '                    <button onClick={() => setEmailVisible(!emailVisible)} style={{ padding: "11px 14px", borderRadius: 10, border: `1px solid ${emailVisible ? "rgba(76,175,130,0.4)" : s.border}`, background: emailVisible ? "rgba(76,175,130,0.1)" : s.surface2, color: emailVisible ? s.green : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" as const }}>{emailVisible ? "👁 Vizibil" : "🙈 Ascuns"}</button>\r\n'
    + '                  </div>\r\n'
    + '                  <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>Controleaza daca emailul apare pe profilul public</div>\r\n'
    + '                </div>';
  admin = admin.substring(0, dpIdxAdmin + 20) + emailFieldAdmin + admin.substring(dpIdxAdmin + 20);
  console.log('✅ Admin email visibility added');
}

// Adaugam rezervari de azi in cardul Client
const today = new Date();
const todayStr = today.toLocaleDateString('ro-RO');

admin = admin.replace(
  `<div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRESTATOR CARD */}`,
  `<div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Rezervarile noastre — azi</div>
                    <button onClick={() => setActiveSection("rezervarile-mele")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                  </div>
                  {(() => {
                    const todayBk = [...(bookings||[])].filter(b => { if (!b.date) return false; const d = new Date(b.date); return d.toLocaleDateString("ro-RO") === new Date().toLocaleDateString("ro-RO"); });
                    const mockTodayBk = [
                      { id:"t1", time:"10:00", status:"accepted", totalPrice:150, service:{name:"Consultanta"}, provider:{user:{name:"Auto Expert SRL"}} },
                      { id:"t2", time:"14:30", status:"pending", totalPrice:80, service:{name:"Service"}, provider:{user:{name:"Clean Pro"}} },
                    ];
                    const allToday = [...todayBk, ...mockTodayBk];
                    return allToday.length === 0 ? (
                      <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "12px 0" }}>Nicio rezervare azi</div>
                    ) : allToday.map((b:any, i:number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < allToday.length-1 ? \`1px solid \${s.surface2}\` : "none" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: s.accent, flexShrink: 0, minWidth: 36 }}>{b.time}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name}</div>
                          <div style={{ fontSize: 11, color: s.muted }}>{b.provider?.user?.name}</div>
                        </div>
                        <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: b.status==="accepted"?"rgba(76,175,130,0.15)":"rgba(232,184,75,0.15)", color: b.status==="accepted"?s.green:s.yellow }}>{b.status==="accepted"?"Confirmat":"In asteptare"}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* PRESTATOR CARD */}`
);

fs.writeFileSync('./src/app/dashboard/page.tsx', admin);
console.log('✅ Admin email + rezervari azi:', fs.statSync('./src/app/dashboard/page.tsx').size);