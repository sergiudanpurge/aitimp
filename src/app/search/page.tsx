"use client";

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

  const FilterPanel = () => (
    <div style={{ padding: isMobile ? "16px" : "24px 20px" }}>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 12 }}>Tip prestator</div>
        {[["toate","Toate"],["company","Firme"],["private","Persoane fizice"]].map(([val, label]) => (
          <div key={val} onClick={() => setFilters({...filters, type: val})} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${filters.type===val?"#c9a96e":"#262626"}`, background: filters.type===val?"#c9a96e":"#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
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
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${filters.rating===val?"#c9a96e":"#262626"}`, background: filters.rating===val?"#c9a96e":"#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
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
            <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${(filters as any)[key]?"#c9a96e":"#262626"}`, background: (filters as any)[key]?"#c9a96e":"#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
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
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede8", fontFamily: "var(--font-outfit)" }}>

      {/* NAVBAR */}
      <div style={{ height: 60, background: "rgba(10,10,10,0.95)", borderBottom: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 32px", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: "#c9a96e", textDecoration: "none" }}>aitimp.ro</Link>
        <div style={{ display: "flex", gap: 8 }}>
          {!isMobile && <Link href="/login" style={{ padding: "8px 18px", background: "transparent", border: "1px solid #262626", borderRadius: 8, fontSize: 13, color: "#777", textDecoration: "none" }}>Intră în cont</Link>}
          <Link href="/register" style={{ padding: "8px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#0a0a0a", textDecoration: "none" }}>
            {isMobile ? "Cont" : "Înregistrare"}
          </Link>
        </div>
      </div>

      {/* SEARCH HERO */}
      <div style={{ background: "linear-gradient(135deg,#0f0d09,#1a1408,#0f0d09)", padding: isMobile ? "20px 16px 16px" : "40px 32px 28px", borderBottom: "1px solid #262626" }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 26, fontWeight: 700, marginBottom: 4 }}>Găsește un profesionist</div>
        <div style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>Peste 1.200 de prestatori în toată România</div>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, marginBottom: 14 }}>

          {/* Input căutare */}
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#777", pointerEvents: "none" }}>🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Ce serviciu cauți?"
              style={{ ...inputStyle, padding: "13px 16px 13px 44px" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
              onBlur={e => (e.currentTarget.style.borderColor = "#262626")}
            />
          </div>

          {/* Dropdown județ */}
          <select
            value={judet}
            onChange={e => setJudet(e.target.value)}
            style={{ ...inputStyle, padding: "13px 16px", width: isMobile ? "100%" : 180, cursor: "pointer" }}
          >
            <option value="">📍 Toate județele</option>
            {judete.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>

          {/* Dropdown oraș — apare doar dacă e selectat un județ */}
          {judet && (
            <select
              value={oras}
              onChange={e => setOras(e.target.value)}
              style={{ ...inputStyle, padding: "13px 16px", width: isMobile ? "100%" : 160, cursor: "pointer" }}
            >
              <option value="">Toate orașele</option>
              {oraseDisponibile.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}

          <button
            onClick={handleSearch}
            style={{ padding: "13px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}
          >
            Caută
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.label}
              onClick={() => { setQuery(cat.label); handleSearch(); }}
              style={{ padding: "5px 12px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 20, fontSize: 11, color: "#c9a96e", cursor: "pointer" }}
            >
              {cat.icon} {cat.label}
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE FILTER BUTTON */}
      {isMobile && (
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #262626", display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowFilters(true)}
            style={{ flex: 1, padding: "10px", background: "#161616", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}
          >
            ⚙️ Filtre
          </button>
          <select style={{ flex: 1, padding: "10px", background: "#161616", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }}>
            <option>Relevanță</option>
            <option>Rating ↓</option>
            <option>Preț ↑</option>
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
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "220px 1fr" : "280px 1fr", minHeight: "calc(100vh - 220px)" }}>

        {/* SIDEBAR FILTRE - desktop only */}
        {!isMobile && (
          <div style={{ background: "#111", borderRight: "1px solid #262626" }}>
            <FilterPanel />
          </div>
        )}

        {/* REZULTATE */}
        <div style={{ padding: isMobile ? "14px 16px" : "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#777" }}>
              {loading ? "Se caută..." : (
                <><span style={{ color: "#f0ede8", fontWeight: 600 }}>{results.length}</span> rezultate{query ? ` pentru "${query}"` : ""}</>
              )}
            </div>
            {!isMobile && (
              <select style={{ padding: "8px 14px", background: "#161616", border: "1px solid #262626", borderRadius: 8, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }}>
                <option>Relevanță</option>
                <option>Rating (desc)</option>
                <option>Preț (asc)</option>
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
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              {results.map((r: any) => (
                <Link key={r.id} href={`/p/${r.slug || r.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}>
                    <div style={{ height: isMobile ? 70 : 100, background: "linear-gradient(135deg,#1a1408,#2a2010)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
{r.avatar ? (
  <img src={r.avatar} style={{ width: 50, height: 50, borderRadius: r.accountType==="company"?"10px":"50%", objectFit: "cover", border: "3px solid rgba(201,169,110,0.4)" }} />
) : (
  <div style={{ width: 50, height: 50, borderRadius: r.accountType==="company"?"10px":"50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#fff", border: "3px solid rgba(201,169,110,0.4)" }}>
    {r.name?.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase()}
  </div>
)}
                      <div style={{ position: "absolute", top: 8, left: 8, padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: r.accountType==="company"?"rgba(90,141,224,0.2)":"rgba(201,169,110,0.2)", color: r.accountType==="company"?"#5a8de0":"#c9a96e", border: `1px solid ${r.accountType==="company"?"rgba(90,141,224,0.3)":"rgba(201,169,110,0.3)"}` }}>
                        {r.accountType==="company"?"🏢 Firmă":"👤 Persoană"}
                      </div>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a96e" }}>★ {r.rating || "—"}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#777", marginBottom: 8 }}>📍 {r.oras || "România"}</div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                        {(r.services || []).slice(0,2).map((s: any, i: number) => (
                          <div key={i} style={{ padding: "3px 8px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 5, fontSize: 10, color: "#c9a96e" }}>{s.name}</div>
                        ))}
                        {(r.services || []).length > 2 && (
                          <div style={{ padding: "3px 8px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 5, fontSize: 10, color: "#777" }}>+{r.services.length-2}</div>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #262626" }}>
                        <div style={{ fontSize: 11, color: "#4caf82", fontWeight: 600 }}>● Disponibil</div>
                        <div style={{ fontSize: 12, color: "#777" }}>de la <span style={{ fontWeight: 700, color: "#c9a96e" }}>{r.services?.[0]?.price ? `${r.services[0].price} lei` : "—"}</span></div>
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
}