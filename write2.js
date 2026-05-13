const fs = require('fs');
let code = fs.readFileSync('./src/app/search/page.tsx', 'utf8');

// Gasim si inlocuim FilterPanel
const start = code.indexOf('const FilterPanel');
const end = code.indexOf('\n  );', start) + 5;

if (start === -1) { console.log('❌ FilterPanel negasit'); process.exit(1); }

const newFilter = `const FilterPanel = () => {
    const chk = (active: boolean) => ({
      width: 18, height: 18, borderRadius: 5,
      border: \`1px solid \${active ? "#c9a96e" : "#262626"}\`,
      background: active ? "#c9a96e" : "#1e1e1e",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, color: "#0a0a0a", flexShrink: 0,
    } as const);
    const inp = { background: "#1e1e1e", border: "1px solid #262626", borderRadius: 8, color: "#f0ede8", fontSize: 12, padding: "7px 10px", outline: "none", fontFamily: "var(--font-outfit)", width: "100%" } as const;
    const sec = { fontSize: 10, fontWeight: 600 as const, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.8px", marginBottom: 12 };
    const div = { height: 1, background: "#1e1e1e", margin: "0 0 20px" };
    return (
    <div style={{ padding: isMobile ? "16px" : "20px 18px" }}>

      {/* 1. TIP PRESTATOR */}
      <div style={{ marginBottom: 20 }}>
        <div style={sec}>Tip prestator</div>
        {([["toate","Toate"],["company","Firme"],["private","Persoane fizice"]] as [string,string][]).map(([val, label]) => (
          <div key={val} onClick={() => setFilters({...filters, type: val})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
            <div style={chk(filters.type === val)}>{filters.type === val ? "✓" : ""}</div>
            <span style={{ fontSize: 13 }}>{label}</span>
          </div>
        ))}
        <div onClick={() => setFilters({...filters, favorite: !(filters as any).favorite})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
          <div style={chk(!!(filters as any).favorite)}>{(filters as any).favorite ? "✓" : ""}</div>
          <span style={{ fontSize: 13 }}>⭐ Favorite</span>
        </div>
      </div>

      <div style={div} />

      {/* 2. DISPONIBILITATE */}
      <div style={{ marginBottom: 20 }}>
        <div style={sec}>Disponibilitate</div>
        {([["orice","Orice zi"],["azi","Disponibil azi"],["perioada","Perioadă"]] as [string,string][]).map(([val, label]) => (
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
              <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} style={inp} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Data sfârșit</div>
              <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} style={inp} />
            </div>
            <div style={{ height: 1, background: "#262626", margin: "4px 0" }} />
            <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>Interval orar</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)} style={{ ...inp, width: "50%" }} />
              <span style={{ color: "#555", fontSize: 12, flexShrink: 0 }}>—</span>
              <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} style={{ ...inp, width: "50%" }} />
            </div>
            <div onClick={() => { setTimeStart("00:00"); setTimeEnd("23:59"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer" }}>
              <div style={chk(timeStart === "00:00" && timeEnd === "23:59")}>{timeStart === "00:00" && timeEnd === "23:59" ? "✓" : ""}</div>
              <span style={{ fontSize: 12, color: "#aaa" }}>Toată ziua</span>
            </div>
          </div>
        )}
      </div>

      <div style={div} />

      {/* 3. PRET */}
      <div style={{ marginBottom: 20 }}>
        <div style={sec}>Preț (RON)</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" placeholder="Min" value={pretMin} onChange={e => setPretMin(e.target.value)} style={{ ...inp, width: "50%" }} />
          <input type="number" placeholder="Max" value={pretMax} onChange={e => setPretMax(e.target.value)} style={{ ...inp, width: "50%" }} />
        </div>
      </div>

      <div style={div} />

      {/* 4. RATING */}
      <div style={{ marginBottom: 20 }}>
        <div style={sec}>Rating minim</div>
        {([["toate","Orice rating"],["5","★★★★★  5+"],["4","★★★★  4+"],["3","★★★  3+"]] as [string,string][]).map(([val, label]) => (
          <div key={val} onClick={() => setFilters({...filters, rating: val})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
            <div style={chk(filters.rating === val)}>{filters.rating === val ? "✓" : ""}</div>
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
  );
  }`;

code = code.substring(0, start) + newFilter + code.substring(end);

// Adauga state vars daca nu exista
if (!code.includes('const [availability')) {
  code = code.replace(
    `  const [filters, setFilters] = useState({`,
    `  const [availability, setAvailability] = useState("orice");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("08:00");
  const [timeEnd, setTimeEnd] = useState("18:00");
  const [filters, setFilters] = useState({`
  );
}

// Fix filters state - adauga favorite daca nu e
if (!code.includes('favorite:')) {
  code = code.replace(
    `type: "toate", rating: "toate", available: false, verified: false,`,
    `type: "toate", rating: "toate", available: false, verified: false, favorite: false,`
  );
}

fs.writeFileSync('./src/app/search/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/search/page.tsx').size);