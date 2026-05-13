const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// Gasim pozitia exacta a sectiunii servicii (a 2-a aparitie cu 40px 20px)
const marker = `padding: "40px 20px", textAlign: "center", color: s.muted }}>`;
const first = code.indexOf(marker);
const second = code.indexOf(marker, first + 1);
console.log('Prima aparitie:', first);
console.log('A doua aparitie:', second);

// Gasim inceputul blocului {services.length === 0 ? ( inainte de a doua aparitie
const insertSearch = code.lastIndexOf('{services.length === 0 ? (', second);
console.log('Insert point:', insertSearch);

if (insertSearch > -1) {
  const statsBlock = `{services.length > 0 && (() => {
                const svcStats = services.map((svc:any) => ({
                  ...svc,
                  bookingsCount: bookings.filter((b:any) => b.service?.id === svc.id).length,
                  revenue: bookings.filter((b:any) => b.service?.id === svc.id && b.status === "completed").reduce((a:number, b:any) => a + (b.totalPrice || 0), 0),
                }));
                const topService = [...svcStats].sort((a,b) => b.bookingsCount - a.bookingsCount)[0];
                const totalRevenue = svcStats.reduce((a:number,s:any) => a + s.revenue, 0);
                const totalBookings = svcStats.reduce((a:number,s:any) => a + s.bookingsCount, 0);
                const avgPrice = services.length > 0 ? Math.round(services.reduce((a:number,s:any) => a + (s.price||0), 0) / services.length) : 0;
                return (
                  <>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 10 }}>
                    {[
                      { label: "Cel mai cautat", val: topService?.name || "N/A", sub: (topService?.bookingsCount||0) + " rezervari", color: s.accent },
                      { label: "Total rezervari", val: totalBookings.toString(), sub: "toate serviciile", color: s.blue },
                      { label: "Venit total", val: totalRevenue + " lei", sub: "finalizate", color: s.green },
                      { label: "Pret mediu", val: avgPrice + " lei", sub: "per serviciu", color: s.yellow },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: 10, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>{stat.label}</div>
                        <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 15 : 18, fontWeight: 700, color: stat.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stat.val}</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{stat.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 14 : 18, marginBottom: 10 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Performanta per serviciu</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {services.map((svc:any, idx:number) => {
                        const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                        const svcBk = bookings.filter((b:any) => b.service?.id === svc.id);
                        const svcRev = svcBk.filter((b:any) => b.status === "completed").reduce((a:number,b:any) => a+(b.totalPrice||0), 0);
                        const maxBk = Math.max(...services.map((s:any) => bookings.filter((b:any) => b.service?.id === s.id).length), 1);
                        const pct = Math.round((svcBk.length/maxBk)*100);
                        return (
                          <div key={svc.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 3, height: 36, borderRadius: 2, background: colors[idx%colors.length], flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{svc.name}</span>
                                <span style={{ fontSize: 12, color: s.accent, fontWeight: 700 }}>{svcRev} lei</span>
                              </div>
                              <div style={{ height: 6, background: s.surface2, borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: pct+"%", background: colors[idx%colors.length], borderRadius: 3 }} />
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                <span style={{ fontSize: 10, color: s.muted }}>{svcBk.length} rezervari</span>
                                <span style={{ fontSize: 10, color: s.muted }}>{svc.price} lei · {svc.duration*30} min</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  </>
                );
              })()}
              `;

  code = code.substring(0, insertSearch) + statsBlock + code.substring(insertSearch);
  console.log('✅ Statistici adaugate!');
}

fs.writeFileSync('./src/app/dashboard/employee/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);