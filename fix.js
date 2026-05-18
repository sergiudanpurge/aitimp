const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/page.tsx', 'utf8');

// 1. Adauga Servicii in sidebar dupa Angajatii
code = code.replace(
  `{ id: "angajati", icon: "👥", label: "Angajatii" },`,
  `{ id: "angajati", icon: "👥", label: "Angajatii" },
    { id: "servicii", icon: "✂️", label: "Servicii" },`
);

// 2. Adauga in bottomNav mobile
code = code.replace(
  `{ id: "angajati", icon: "👥", label: "Angajati" },`,
  `{ id: "angajati", icon: "👥", label: "Angajati" },
    { id: "servicii", icon: "✂️", label: "Servicii" },`
);

// 3. Adauga in getSectionTitle
code = code.replace(
  `chat: "Chat", calendar: "Calendar"`,
  `servicii: "Servicii", chat: "Chat", calendar: "Calendar"`
);

// 4. Adauga state pentru servicii admin
code = code.replace(
  `  const [reviewFilter, setReviewFilter] = useState("all");`,
  `  const [reviewFilter, setReviewFilter] = useState("all");
  const [svcTab, setSvcTab] = useState("firma");
  const [showAddSvc, setShowAddSvc] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: "", duration: "1", price: "", icon: "✂️", employeeId: "firma" });
  const [svcLoading, setSvcLoading] = useState(false);`
);

// 5. Adauga sectiunea Servicii inainte de ANGAJATII
const angajatiMarker = `{/* ===== ANGAJATII ===== */}`;
const newServiceSection = `{/* ===== SERVICII ===== */}
          {activeSection === "servicii" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              {/* MOCK SERVICES DATA */}
              {(() => {
                const mockCompanyServices = [
                  { id:"cs1", name:"Consultanta business", duration:2, price:150, icon:"💼", isActive:true, employeeId:null },
                  { id:"cs2", name:"Audit financiar", duration:4, price:300, icon:"📊", isActive:true, employeeId:null },
                ];
                const mockEmpServices: any[] = employees.flatMap((emp: any) => 
                  (emp.services || []).map((s: any) => ({ ...s, employeeId: emp.id, employeeName: emp.name, employeeAvatar: emp.avatar }))
                );
                const allServices = [...mockCompanyServices, ...mockEmpServices];
                const tabServices = svcTab === "firma" ? mockCompanyServices : mockEmpServices.filter((s: any) => s.employeeId === svcTab);
                
                return (
                  <>
                    {/* HEADER */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600 }}>Gestioneaza serviciile</div>
                      <button onClick={() => setShowAddSvc(true)} style={{ padding: "9px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Serviciu nou</button>
                    </div>

                    {/* TABS */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[{id:"firma", name:"🏢 Firma"}, ...employees.map((e: any) => ({id: e.id, name: e.name?.split(" ")[0]}))].map(tab => (
                        <button key={tab.id} onClick={() => setSvcTab(tab.id)}
                          style={{ padding: "8px 16px", borderRadius: 10, border: \`1px solid \${svcTab === tab.id ? s.accent : s.border}\`, background: svcTab === tab.id ? "rgba(201,169,110,0.1)" : s.surface, color: svcTab === tab.id ? s.accent : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                          {tab.name}
                        </button>
                      ))}
                    </div>

                    {/* DESCRIERE TAB */}
                    {svcTab === "firma" && (
                      <div style={{ padding: "10px 14px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 10, fontSize: 12, color: s.muted }}>
                        ℹ️ Serviciile firmei apar pe profilul public fara a fi atribuite unui angajat specific. Ideale cand lucrezi independent.
                      </div>
                    )}

                    {/* LISTA SERVICII */}
                    {tabServices.length === 0 ? (
                      <div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>✂️</div>
                        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Niciun serviciu</div>
                        <div style={{ fontSize: 13, marginBottom: 20 }}>Adauga primul serviciu pentru {svcTab === "firma" ? "firma" : employees.find((e: any) => e.id === svcTab)?.name}</div>
                        <button onClick={() => { setNewSvc(prev => ({...prev, employeeId: svcTab})); setShowAddSvc(true); }} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adauga serviciu</button>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 12 }}>
                        {tabServices.map((svc: any, idx: number) => {
                          const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                          return (
                            <div key={svc.id} style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, overflow: "hidden" }}>
                              <div style={{ height: 4, background: colors[idx % colors.length] }} />
                              <div style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ fontSize: 24 }}>{svc.icon || "✂️"}</div>
                                    <div>
                                      <div style={{ fontSize: 14, fontWeight: 700 }}>{svc.name}</div>
                                      {svc.employeeName && <div style={{ fontSize: 11, color: s.muted }}>👤 {svc.employeeName}</div>}
                                    </div>
                                  </div>
                                  <div style={{ padding: "3px 9px", borderRadius: 6, background: svc.isActive ? "rgba(76,175,130,0.15)" : "rgba(224,90,90,0.15)", color: svc.isActive ? s.green : s.red, fontSize: 10, fontWeight: 700 }}>
                                    {svc.isActive ? "Activ" : "Inactiv"}
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                                  <div style={{ fontSize: 20, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                                  <div style={{ fontSize: 12, color: s.muted, display: "flex", alignItems: "center" }}>⏱ {svc.duration * 30} min</div>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                  <button style={{ flex: 1, padding: "7px", borderRadius: 8, background: s.surface2, border: \`1px solid \${s.border}\`, color: "#f0ede8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✏️ Editeaza</button>
                                  <button style={{ flex: 1, padding: "7px", borderRadius: 8, background: svc.isActive ? "rgba(224,90,90,0.1)" : "rgba(76,175,130,0.1)", border: \`1px solid \${svc.isActive ? "rgba(224,90,90,0.3)" : "rgba(76,175,130,0.3)"}\`, color: svc.isActive ? s.red : s.green, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                                    {svc.isActive ? "Dezactiveaza" : "Activeaza"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* MODAL ADAUGA SERVICIU */}
                    {showAddSvc && (
                      <div onClick={() => setShowAddSvc(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                        <div onClick={e => e.stopPropagation()} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 16, padding: 24, width: "100%", maxWidth: 480 }}>
                          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>+ Serviciu nou</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div>
                              <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Atribuie la</div>
                              <select value={newSvc.employeeId} onChange={e => setNewSvc({...newSvc, employeeId: e.target.value})}
                                style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
                                <option value="firma">🏢 Firma (independent)</option>
                                {employees.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Icon</div>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {["✂️","💆","💅","🎨","🔧","💻","📸","🏋️","💼","📊","⭐","💈"].map(ic => (
                                  <button key={ic} onClick={() => setNewSvc({...newSvc, icon: ic})} style={{ width: 36, height: 36, borderRadius: 8, border: \`1px solid \${newSvc.icon === ic ? s.accent : s.border}\`, background: newSvc.icon === ic ? "rgba(201,169,110,0.15)" : s.surface2, fontSize: 18, cursor: "pointer" }}>{ic}</button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Nume serviciu *</div>
                              <input value={newSvc.name} onChange={e => setNewSvc({...newSvc, name: e.target.value})} placeholder="ex: Tuns + Styling"
                                style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                              <div>
                                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Durata</div>
                                <select value={newSvc.duration} onChange={e => setNewSvc({...newSvc, duration: e.target.value})}
                                  style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
                                  {[1,2,3,4,6,8].map(d => <option key={d} value={d}>{d*30} min</option>)}
                                </select>
                              </div>
                              <div>
                                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Pret (lei) *</div>
                                <input type="number" value={newSvc.price} onChange={e => setNewSvc({...newSvc, price: e.target.value})} placeholder="ex: 50"
                                  style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }} />
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                              <button onClick={() => setShowAddSvc(false)} style={{ flex: 1, padding: "11px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Anuleaza</button>
                              <button disabled={!newSvc.name || !newSvc.price}
                                style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: (!newSvc.name || !newSvc.price) ? 0.5 : 1 }}>
                                Adauga serviciu
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          `;

code = code.replace(angajatiMarker, newServiceSection + angajatiMarker);
fs.writeFileSync('./src/app/dashboard/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/page.tsx').size);