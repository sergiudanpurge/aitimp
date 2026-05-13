const fs = require('fs');
let code = fs.readFileSync('./src/app/search/page.tsx', 'utf8');

// 1. Adauga state pentru filtrele noi
code = code.replace(
  `  const [filters, setFilters] = useState({
    type: "toate", rating: "toate", available: false, verified: false,
  });`,
  `  const [filters, setFilters] = useState({
    type: "toate", rating: "toate", available: false, verified: false,
    favorite: false,
  });
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [availability, setAvailability] = useState("orice");
  const [timeStart, setTimeStart] = useState("08:00");
  const [timeEnd, setTimeEnd] = useState("18:00");`
);

// 2. Inlocuieste FilterPanel complet
const oldFilter = `  const FilterPanel = () => (
    <div style={{ padding: isMobile ? "16px" : "24px 20px" }}>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 12 }}>Tip prestator</div>
        {[["toate","Toate"],["company","Firme"],["private","Persoane fizice"]].map(([val, label]) => (
          <div key={val} onClick={() => setFilters({...filters, type: val})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: \`1px solid \${filters.type===val?"#c9a96e":"#262626"}\`, background: filters.type===val?"#c9a96e":"#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
              {filters.type===val?"✓":""}
            </div>
            <span style={{ fontSize: 13 }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "#262626", margin: "4px 0 20px" }} />

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 12 }}>Rating minim</div>
        {[["toate","Orice rating"],["5","5★ și peste"],["4","4★ și peste"],["3","3★ și peste"]].map(([val, label]) => (
          <div key={val} onClick={() => setFilters({...filters, rating: val})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: \`1px solid \${filters.rating===val?"#c9a96e":"#262626"}\`, background: filters.rating===val?"#c9a96e":"#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
              {filters.rating===val?"✓":""}
            </div>
            <span style={{ fontSize: 13, color: val==="toate"?"#f0ede8":"#c9a96e" }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "#262626", margin: "4px 0 20px" }} />

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 12 }}>Preț (RON)</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            placeholder="Min"
            value={pretMin}
            onChange={e => setPretMin(e.target.value)}
            style={{ width: "50%", background: "#161616", border: "1px solid #262626", borderRadius: 8, color: "#f0ede8", fontSize: 13, padding: "8px 10px", outline: "none", fontFamily: "var(--font-outfit)" }}
          />
          <input
            type="number"
            placeholder="Max"
            value={pretMax}
            onChange={e => setPretMax(e.target.value)}
            style={{ width: "50%", background: "#161616", border: "1px solid #262626", borderRadius: 8, color: "#f0ede8", fontSize: 13, padding: "8px 10px", outline: "none", fontFamily: "var(--font-outfit)" }}
          />
        </div>
      </div>

      <div style={{ height: 1, background: "#262626", margin: "4px 0 20px" }} />

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 12 }}>Alte filtre</div>
        {[["verified","Profil verificat"],["available","Disponibil azi"]].map(([key, label]) => (
          <div key={key} onClick={() => setFilters({...filters, [key]: !(filters as any)[key]})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: \`1px solid \${(filters as any)[key]?"#c9a96e":"#262626"}\`, background: (filters as any)[key]?"#c9a96e":"#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
              {(filters as any)[key]?"✓":""}
            </div>
            <span style={{ fontSize: 13 }}>{label}</span>
          </div>
        ))}
      </div>

      {isMobile && (
        <button onClick={() => setShowFilters(false)} style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          Aplică filtrele
        </button>
      )}
    </div>
  );`;

const newFilter = `  const chkStyle = (active: boolean) => ({
    width: 18, height: 18, borderRadius: 5,
    border: \`1px solid \${active ? "#c9a96e" : "#262626"}\`,
    background: active ? "#c9a96e" : "#1e1e1e",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, color: "#0a0a0a", flexShrink: 0, cursor: "pointer",
  } as const);

  const inputSm = {
    background: "#1e1e1e", border: "1px solid #262626", borderRadius: 8,
    color: "#f0ede8", fontSize: 12, padding: "7px 10px", outline: "none",
    fontFamily: "var(--font-outfit)", width: "100%",
  } as const;

  const secTitle = {
    fontSize: 10, fontWeight: 600, color: "#555",
    textTransform: "uppercase" as const, letterSpacing: "0.8px", marginBottom: 12,
  };

  const FilterPanel = () => (
    <div style={{ padding: isMobile ? "16px" : "20px 18px" }}>

      {/* 1. TIP PRESTATOR */}
      <div style={{ marginBottom: 20 }}>
        <div style={secTitle}>Tip prestator</div>
        {[["toate","Toate"],["company","Firme"],["private","Persoane fizice"]].map(([val, label]) => (
          <div key={val} onClick={() => setFilters({...filters, type: val})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
            <div style={chkStyle(filters.type === val)}>{filters.type === val ? "✓" : ""}</div>
            <span style={{ fontSize: 13 }}>{label}</span>
          </div>
        ))}
        <div onClick={() => setFilters({...filters, favorite: !filters.favorite})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
          <div style={chkStyle(filters.favorite)}>{filters.favorite ? "✓" : ""}</div>
          <span style={{ fontSize: 13 }}>⭐ Favorite</span>
        </div>
      </div>

      <div style={{ height: 1, background: "#1e1e1e", margin: "0 0 20px" }} />

      {/* 2. DISPONIBILITATE */}
      <div style={{ marginBottom: 20 }}>
        <div style={secTitle}>Disponibilitate</div>
        {[["orice","Orice zi"],["azi","Disponibil azi"],["perioada","Perioadă"]].map(([val, label]) => (
          <div key={val} onClick={() => setAvailability(val)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: \`1px solid \${availability === val ? "#c9a96e" : "#262626"}\`, background: "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {availability === val && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c9a96e" }} />}
            </div>
            <span style={{ fontSize: 13 }}>{label}</span>
          </div>
        ))}

        {availability === "perioada" && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column" as const, gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Data start</div>
              <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} style={inputSm} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Data sfârșit</div>
              <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} style={inputSm} />
            </div>
            <div style={{ height: 1, background: "#262626", margin: "4px 0" }} />
            <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>Interval orar</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)} style={inputSm} />
              </div>
              <span style={{ color: "#555", fontSize: 12 }}>—</span>
              <div style={{ flex: 1 }}>
                <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} style={inputSm} />
              </div>
            </div>
            <div onClick={() => { setTimeStart("00:00"); setTimeEnd("23:59"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer" }}>
              <div style={chkStyle(timeStart === "00:00" && timeEnd === "23:59")}>{timeStart === "00:00" && timeEnd === "23:59" ? "✓" : ""}</div>
              <span style={{ fontSize: 12, color: "#aaa" }}>Toată ziua</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: "#1e1e1e", margin: "0 0 20px" }} />

      {/* 3. PRET */}
      <div style={{ marginBottom: 20 }}>
        <div style={secTitle}>Preț (RON)</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" placeholder="Min" value={pretMin} onChange={e => setPretMin(e.target.value)} style={{ ...inputSm, width: "50%" }} />
          <input type="number" placeholder="Max" value={pretMax} onChange={e => setPretMax(e.target.value)} style={{ ...inputSm, width: "50%" }} />
        </div>
      </div>

      <div style={{ height: 1, background: "#1e1e1e", margin: "0 0 20px" }} />

      {/* 4. RATING */}
      <div style={{ marginBottom: 20 }}>
        <div style={secTitle}>Rating minim</div>
        {[["toate","Orice rating"],["5","★★★★★ 5+"],["4","★★★★ 4+"],["3","★★★ 3+"]].map(([val, label]) => (
          <div key={val} onClick={() => setFilters({...filters, rating: val})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
            <div style={chkStyle(filters.rating === val)}>{filters.rating === val ? "✓" : ""}</div>
            <span style={{ fontSize: 13, color: val === "toate" ? "#f0ede8" : "#c9a96e" }}>{label}</span>
          </div>
        ))}
      </div>

      {isMobile && (
        <button onClick={() => { search(); setShowFilters(false); }} style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          Aplică filtrele
        </button>
      )}
    </div>
  );`;

code = code.replace(oldFilter, newFilter);

// 3. Inlocuieste cardul cu Varianta B (orizontal)
const oldGrid = `            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 14 }}>`;
const newGrid = `            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>`;
code = code.replace(oldGrid, newGrid);

// Inlocuieste cardul
const cardStart = code.indexOf('<Link key={r.id}');
const cardEnd = code.indexOf('</Link>', cardStart) + 7;
const newCard = `<Link key={r.id} href={\`/p/\${r.slug || r.id}\`} style={{ textDecoration: "none", color: "inherit" }}>
                  {(() => {
                    const accentColors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                    const sqColors = [["#c9a96e","#8b5e3c","#5a3a20"],["#5a8de0","#3a6abf","#1a4a9e"],["#4caf82","#2a8f62","#0a6f42"],["#e8b84b","#c9902a","#a06810"],["#e05a5a","#c03a3a","#a02020"],["#a78de0","#7a5abf","#5a3a9e"]];
                    const idx = results.indexOf(r);
                    const accent = accentColors[idx % accentColors.length];
                    const sq = sqColors[idx % sqColors.length];
                    return (
                      <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden", display: "flex", height: 120, transition: "all .2s" }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(201,169,110,0.4)"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,.3)"; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#262626"; el.style.transform = "none"; el.style.boxShadow = "none"; }}>
                        <div style={{ width: 120, flexShrink: 0, background: "#1a1408", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 6, padding: 12, position: "relative", overflow: "hidden" }}>
                          {r.gallery?.[0]
                            ? <img src={r.gallery[0]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                            : sq.map((c: string, i: number) => <div key={i} style={{ width: 24, height: 24, borderRadius: 6, background: c, opacity: 1 - i * 0.25, flexShrink: 0 }} />)
                          }
                          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
                        </div>
                        <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{r.name}</div>
                              <div style={{ fontSize: 11, color: "#777" }}>📍 {r.oras || "România"} · {r.accountType === "company" ? "🏢 Firmă" : "👤 Persoană"}</div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              {r.rating && <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a96e" }}>★ {r.rating}</div>}
                              <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{r.services?.[0]?.price ? \`\${r.services[0].price} lei\` : "—"}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <div style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, background: "rgba(76,175,130,0.15)", color: "#4caf82" }}>● Disponibil</div>
                            {(r.services || []).slice(0, 2).map((s: any, i: number) => (
                              <div key={i} style={{ padding: "2px 8px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 5, fontSize: 10, color: "#c9a96e" }}>{s.name}</div>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 11, color: "#555" }}>de la <strong style={{ color: "#c9a96e", fontSize: 13 }}>{r.services?.[0]?.price ? \`\${r.services[0].price} lei\` : "—"}</strong></div>
                            <div style={{ padding: "5px 12px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 7, fontSize: 11, color: "#c9a96e", fontWeight: 600 }}>Vezi profil →</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </Link>`;

code = code.substring(0, cardStart) + newCard + code.substring(cardEnd);

fs.writeFileSync('./src/app/search/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/search/page.tsx').size);