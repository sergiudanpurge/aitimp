const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// Gasim locul dupa statistici si inainte de grid-ul servicii+cereri
const marker = `{/* SERVICII + CERERI */}`;

const clientSection = `{/* CA SI CLIENT */}
              <div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue }}>👤 Ca și Client</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    [bookings.filter((b:any) => b.clientId === user?.id).length.toString(), "Rezervări efectuate", s.accent],
                    [bookings.filter((b:any) => b.clientId === user?.id && b.status === "pending").length.toString(), "În așteptare", s.yellow],
                    [bookings.filter((b:any) => b.clientId === user?.id && b.status === "completed").reduce((a:number, b:any) => a + (b.totalPrice||0), 0) + " lei", "Total cheltuit", s.green],
                  ].map(([val,label,color]) => (
                    <div key={label as string} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color: color as string }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Rezervări recente</div>
                  <button onClick={() => setActiveSection("rezervari-client")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                </div>
                {bookings.filter((b:any) => b.clientId === user?.id).length === 0 ? (
                  <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "16px 0" }}>
                    Nicio rezervare ca Client. <a href="/search" style={{ color: s.accent, textDecoration: "none" }}>Caută servicii →</a>
                  </div>
                ) : bookings.filter((b:any) => b.clientId === user?.id).slice(0, 3).map((b: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < 2 ? \`1px solid \${s.surface2}\` : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📅</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name || "Serviciu"}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{b.date} {b.time && \`· \${b.time}\`}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{b.totalPrice} lei</div>
                  </div>
                ))}
              </div>

              `;

if (code.includes(marker)) {
  code = code.replace(marker, clientSection + marker);
  console.log('✅ Sectiunea Ca si Client adaugata!');
} else {
  // Fallback - cautam dupa statistici grid
  const fallback = `{/* SERVICII + CERERI */}`;
  const idx = code.indexOf('display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}');
  if (idx > -1) {
    const afterStats = code.indexOf('</div>\n\n', idx) + 8;
    code = code.substring(0, afterStats) + '\n' + clientSection + code.substring(afterStats);
    console.log('✅ Adaugat cu fallback!');
  } else {
    // Cautam direct dupa sectiunea de statistici
    const statsEnd = code.indexOf('"luna curentă: 0 lei"', 0);
    console.log('❌ Marker negasit. Stats la:', idx);
  }
}

fs.writeFileSync('./src/app/dashboard/employee/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);