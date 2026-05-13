"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";
import { judete, orasePerJudet } from "@/lib/romania";

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
  const { isMobile, isTablet } = useResponsive();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [judet, setJudet] = useState(searchParams.get("judet") || "");
  const [oras, setOras] = useState(searchParams.get("oras") || "");
  const [pretMin, setPretMin] = useState(searchParams.get("pretMin") || "");
  const [pretMax, setPretMax] = useState(searchParams.get("pretMax") || "");
  const [oraseDisponibile, setOraseDisponibile] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [availability, setAvailability] = useState("orice");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("08:00");
  const [timeEnd, setTimeEnd] = useState("18:00");
  const [filters, setFilters] = useState({
    type: "toate", rating: "toate", available: false, verified: false,
  });

  const search = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query)                      params.set("q", query);
    if (judet)                      params.set("judet", judet);
    if (oras)                       params.set("oras", oras);
    if (pretMin)                    params.set("pretMin", pretMin);
    if (pretMax)                    params.set("pretMax", pretMax);
    if (filters.rating !== "toate") params.set("rating", filters.rating);
    if (filters.type !== "toate")   params.set("tip", filters.type);
    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  }, [query, judet, oras, pretMin, pretMax, filters]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query)   params.set("q", query);
    if (judet)   params.set("judet", judet);
    if (oras)    params.set("oras", oras);
    if (pretMin) params.set("pretMin", pretMin);
    if (pretMax) params.set("pretMax", pretMax);
    router.push(`/search?${params.toString()}`);
    search();
  };

  useEffect(() => { search(); }, []);

  useEffect(() => {
    if (judet) {
      setOraseDisponibile(orasePerJudet[judet] || []);
      setOras("");
    } else {
      setOraseDisponibile([]);
      setOras("");
    }
  }, [judet]);

  const inputStyle = {
    background: "#161616", border: "1px solid #262626", borderRadius: 12,
    color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)",
    boxSizing: "border-box" as const, width: "100%",
  };

  const FilterPanel = () => {
    const chk = (active: boolean) => ({
      width: 18, height: 18, borderRadius: 5,
      border: `1px solid ${active ? "#c9a96e" : "#262626"}`,
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
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1px solid ${availability === val ? "#c9a96e" : "#262626"}`, background: "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
  }
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede8", fontFamily: "var(--font-outfit)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Navbar />

        {/* SEARCH HERO */}
        <div style={{ background: "linear-gradient(135deg,#0f0d09,#1a1408,#0f0d09)", padding: isMobile ? "20px 16px 16px" : "40px 32px 28px", borderBottom: "1px solid #262626" }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 26, fontWeight: 700, marginBottom: 4 }}>Găsește un profesionist</div>
          <div style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>Peste 1.200 de prestatori în toată România</div>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#777", pointerEvents: "none" }}>🔍</span>
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Ce serviciu cauți?"
                style={{ ...inputStyle, padding: "13px 16px 13px 44px" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            </div>
            <select value={judet} onChange={e => setJudet(e.target.value)} style={{ ...inputStyle, padding: "13px 16px", width: isMobile ? "100%" : 180, cursor: "pointer" }}>
              <option value="">📍 Toate județele</option>
              {judete.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            {judet && (
              <select value={oras} onChange={e => setOras(e.target.value)} style={{ ...inputStyle, padding: "13px 16px", width: isMobile ? "100%" : 160, cursor: "pointer" }}>
                <option value="">Toate orașele</option>
                {oraseDisponibile.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
            <button onClick={handleSearch} style={{ padding: "13px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}>
              Caută
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <div key={cat.label} onClick={() => { setQuery(cat.label); handleSearch(); }}
                style={{ padding: "5px 12px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 20, fontSize: 11, color: "#c9a96e", cursor: "pointer" }}>
                {cat.icon} {cat.label}
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE FILTER BUTTON */}
        {isMobile && (
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #262626", display: "flex", gap: 8 }}>
            <button onClick={() => setShowFilters(true)} style={{ flex: 1, padding: "10px", background: "#161616", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              ⚙️ Filtre
            </button>
            <select style={{ flex: 1, padding: "10px", background: "#161616", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }}>
              <option>Relevanță</option><option>Rating ↓</option><option>Preț ↑</option>
            </select>
          </div>
        )}

        {/* MOBILE FILTER MODAL */}
        {isMobile && showFilters && (
          <div onClick={() => setShowFilters(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
            <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "#111", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #262626", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>Filtre</div>
                <div onClick={() => setShowFilters(false)} style={{ fontSize: 20, color: "#777", cursor: "pointer" }}>✕</div>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* MAIN LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "220px 1fr" : "280px 1fr", minHeight: "calc(100vh - 160px)" }}>
          {!isMobile && (
            <div style={{ background: "#111", borderRight: "1px solid #262626" }}>
              <FilterPanel />
            </div>
          )}
          <div style={{ padding: isMobile ? "14px 16px" : "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#777" }}>
                {loading ? "Se caută..." : <><span style={{ color: "#f0ede8", fontWeight: 600 }}>{results.length}</span> rezultate{query ? ` pentru "${query}"` : ""}</>}
              </div>
              {!isMobile && (
                <select style={{ padding: "8px 14px", background: "#161616", border: "1px solid #262626", borderRadius: 8, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }}>
                  <option>Relevanță</option><option>Rating (desc)</option><option>Preț (asc)</option>
                </select>
              )}
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
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {results.map((r: any) => (
                                  <Link key={r.id} href={`/p/${r.slug || r.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
                              <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{r.services?.[0]?.price ? `${r.services[0].price} lei` : "—"}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <div style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, background: "rgba(76,175,130,0.15)", color: "#4caf82" }}>● Disponibil</div>
                            {(r.services || []).slice(0, 2).map((s: any, i: number) => (
                              <div key={i} style={{ padding: "2px 8px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 5, fontSize: 10, color: "#c9a96e" }}>{s.name}</div>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 11, color: "#555" }}>de la <strong style={{ color: "#c9a96e", fontSize: 13 }}>{r.services?.[0]?.price ? `${r.services[0].price} lei` : "—"}</strong></div>
                            <div style={{ padding: "5px 12px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 7, fontSize: 11, color: "#c9a96e", fontWeight: 600 }}>Vezi profil →</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}