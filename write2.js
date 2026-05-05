const fs = require('fs');
const path = './src/app/search/page.tsx';

const code = `"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { icon: "✂️", label: "Coafură" },
  { icon: "🔧", label: "Instalații" },
  { icon: "📸", label: "Fotografie" },
  { icon: "🧹", label: "Curățenie" },
  { icon: "🎨", label: "Design" },
  { icon: "🏋️", label: "Fitness" },
  { icon: "🚗", label: "Auto" },
  { icon: "💻", label: "IT" },
  { icon: "📚", label: "Meditații" },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("loc") || "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: "toate",
    rating: "toate",
    available: false,
    verified: false,
  });

  useEffect(() => {
    search();
  }, []);

  const search = async () => {
    setLoading(true);
    const res = await fetch(\`/api/search?q=\${encodeURIComponent(query)}&loc=\${encodeURIComponent(location)}\`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  const handleSearch = () => {
    router.push(\`/search?q=\${encodeURIComponent(query)}&loc=\${encodeURIComponent(location)}\`);
    search();
  };

  const removeFilter = (f: string) => setActiveFilters(activeFilters.filter(x => x !== f));

  const inputStyle = {
    background: "#161616", border: "1px solid #262626", borderRadius: 12,
    color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)",
    boxSizing: "border-box" as const, width: "100%",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede8", fontFamily: "var(--font-outfit)" }}>

      {/* NAVBAR */}
      <div style={{ height: 60, background: "rgba(10,10,10,0.95)", borderBottom: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: "#c9a96e", textDecoration: "none" }}>aitimp.ro</Link>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/login" style={{ padding: "8px 18px", background: "transparent", border: "1px solid #262626", borderRadius: 8, fontSize: 13, color: "#777", textDecoration: "none" }}>Intră în cont</Link>
          <Link href="/register" style={{ padding: "8px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#0a0a0a", textDecoration: "none" }}>Înregistrare</Link>
        </div>
      </div>

      {/* SEARCH HERO */}
      <div style={{ background: "linear-gradient(135deg,#0f0d09,#1a1408,#0f0d09)", padding: "40px 32px 28px", borderBottom: "1px solid #262626" }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Găsește un profesionist</div>
        <div style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>Peste 1.200 de prestatori verificați în toată România</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#777", pointerEvents: "none" }}>🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Ce serviciu cauți? ex: coafor, instalator..."
              style={{ ...inputStyle, padding: "13px 16px 13px 44px" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
              onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
          </div>
          <div style={{ width: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>📍</span>
            <input value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Oraș sau județ"
              style={{ ...inputStyle, padding: "13px 16px 13px 38px" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
              onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
          </div>
          <button onClick={handleSearch} style={{ padding: "13px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}>
            Caută
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <div key={cat.label} onClick={() => { setQuery(cat.label); handleSearch(); }}
              style={{ padding: "6px 14px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 20, fontSize: 12, color: "#c9a96e", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.15)"; (e.currentTarget as HTMLDivElement).style.borderColor = "#c9a96e"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.15)"; }}>
              {cat.icon} {cat.label}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 220px)" }}>

        {/* SIDEBAR FILTRE */}
        <div style={{ background: "#111", borderRight: "1px solid #262626", padding: "24px 20px" }}>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 12 }}>Tip prestator</div>
            {[["toate","Toate"],["company","Firme"],["private","Persoane fizice"]].map(([val, label]) => (
              <div key={val} onClick={() => setFilters({...filters, type: val})}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
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
              <div key={val} onClick={() => setFilters({...filters, rating: val})}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: \`1px solid \${filters.rating===val?"#c9a96e":"#262626"}\`, background: filters.rating===val?"#c9a96e":"#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
                  {filters.rating===val?"✓":""}
                </div>
                <span style={{ fontSize: 13, color: val==="toate"?"#f0ede8":"#c9a96e" }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "#262626", margin: "4px 0 20px" }} />

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 12 }}>Alte filtre</div>
            {[["verified","Profil verificat"],["available","Disponibil azi"]].map(([key, label]) => (
              <div key={key} onClick={() => setFilters({...filters, [key]: !(filters as any)[key]})}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: \`1px solid \${(filters as any)[key]?"#c9a96e":"#262626"}\`, background: (filters as any)[key]?"#c9a96e":"#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
                  {(filters as any)[key]?"✓":""}
                </div>
                <span style={{ fontSize: 13 }}>{label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* REZULTATE */}
        <div style={{ padding: "20px 24px" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: "#777" }}>
              {loading ? "Se caută..." : <><span style={{ color: "#f0ede8", fontWeight: 600 }}>{results.length}</span> rezultate{query ? \` pentru "\${query}"\` : ""}</>}
            </div>
            <select style={{ padding: "8px 14px", background: "#161616", border: "1px solid #262626", borderRadius: 8, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
              <option>Relevanță</option>
              <option>Rating (desc)</option>
              <option>Preț (asc)</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#777" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 14 }}>Se caută...</div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#777" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>😕</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Niciun rezultat găsit</div>
              <div style={{ fontSize: 13 }}>Încearcă alte cuvinte cheie sau altă locație</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {results.map((r: any) => (
                <Link key={r.id} href={\`/p/\${r.id}\`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden", transition: "all 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#262626"; (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>

                    {/* BANNER */}
                    <div style={{ height: 100, background: "linear-gradient(135deg,#1a1408,#2a2010)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {r.avatar ? (
                        <img src={r.avatar} style={{ width: 60, height: 60, borderRadius: r.accountType==="company"?"12px":"50%", objectFit: "cover", border: "3px solid rgba(201,169,110,0.4)" }} />
                      ) : (
                        <div style={{ width: 60, height: 60, borderRadius: r.accountType==="company"?"12px":"50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "#fff", border: "3px solid rgba(201,169,110,0.4)" }}>
                          {r.name?.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                      )}
                      <div style={{ position: "absolute", top: 8, left: 8, padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: r.accountType==="company"?"rgba(90,141,224,0.2)":"rgba(201,169,110,0.2)", color: r.accountType==="company"?"#5a8de0":"#c9a96e", border: \`1px solid \${r.accountType==="company"?"rgba(90,141,224,0.3)":"rgba(201,169,110,0.3)"}\` }}>
                        {r.accountType==="company"?"🏢 Firmă":"👤 Persoană fizică"}
                      </div>
                    </div>

                    {/* BODY */}
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a96e" }}>★ {r.rating || "—"}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#777", marginBottom: 10 }}>📍 {r.oras || r.city || "România"}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {(r.services || []).slice(0,3).map((s: any) => (
                          <div key={s.id} style={{ padding: "3px 9px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 6, fontSize: 11, color: "#c9a96e" }}>{s.name}</div>
                        ))}
                        {(r.services || []).length > 3 && <div style={{ padding: "3px 9px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 6, fontSize: 11, color: "#777" }}>+{r.services.length-3}</div>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #262626" }}>
                        <div style={{ fontSize: 11, color: "#4caf82", fontWeight: 600 }}>● Disponibil</div>
                        <div style={{ fontSize: 13, color: "#777" }}>de la <span style={{ fontWeight: 700, color: "#c9a96e" }}>{r.minPrice ? \`\${r.minPrice} lei\` : "—"}</span></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

fs.writeFileSync(path, code);
console.log('Done:', fs.statSync(path).size);