"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("loc") || "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "toate",
    rating: "toate",
    available: false,
    verified: false,
  });

  useEffect(() => {
    if (query || location) search();
  }, []);

  const search = async () => {
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent(query)}&loc=${encodeURIComponent(location)}`);
    search();
  };
  const categories = ["✂️ Coafură", "🔧 Instalații", "📸 Fotografie", "🧹 Curățenie", "🎨 Design", "🏋️ Fitness", "🚗 Auto", "💻 IT", "📚 Meditații"];

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
        <div style={{ display: "flex", gap: 10, maxWidth: 900, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#777" }}>🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Ce serviciu cauți? ex: coafor, instalator..." style={{ width: "100%", padding: "13px 16px 13px 44px", background: "#161616", border: "1px solid #262626", borderRadius: 12, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
          </div>
          <div style={{ position: "relative", width: 200 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>📍</span>
            <input value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Oraș sau județ" style={{ width: "100%", padding: "13px 16px 13px 38px", background: "#161616", border: "1px solid #262626", borderRadius: 12, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
          </div>
          <button onClick={handleSearch} style={{ padding: "13px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" }}>Caută</button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <div key={cat} onClick={() => { setQuery(cat.split(" ").slice(1).join(" ")); handleSearch(); }} style={{ padding: "6px 14px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 20, fontSize: 12, color: "#c9a96e", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.15)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.08)"}>
              {cat}
            </div>
          ))}
        </div>
      </div>
      {/* LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 220px)" }}>

        {/* FILTRE */}
        <div style={{ background: "#161616", borderRight: "1px solid #262626", padding: "24px 20px" }}>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Tip prestator</div>
            {["toate", "company", "private"].map(t => (
              <div key={t} onClick={() => setFilters({ ...filters, type: t })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${filters.type === t ? "#c9a96e" : "#262626"}`, background: filters.type === t ? "#c9a96e" : "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
                  {filters.type === t ? "✓" : ""}
                </div>
                <span style={{ fontSize: 13 }}>{t === "toate" ? "Toate" : t === "company" ? "Firme" : "Persoane fizice"}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "#262626", margin: "4px 0 20px" }} />

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Rating minim</div>
            {["toate", "5", "4", "3"].map(r => (
              <div key={r} onClick={() => setFilters({ ...filters, rating: r })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${filters.rating === r ? "#c9a96e" : "#262626"}`, background: filters.rating === r ? "#c9a96e" : "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
                  {filters.rating === r ? "✓" : ""}
                </div>
                <span style={{ fontSize: 13, color: r === "toate" ? "#f0ede8" : "#c9a96e" }}>{r === "toate" ? "Orice rating" : `${r}★ și peste`}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "#262626", margin: "4px 0 20px" }} />

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Alte filtre</div>
            <div onClick={() => setFilters({ ...filters, verified: !filters.verified })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${filters.verified ? "#c9a96e" : "#262626"}`, background: filters.verified ? "#c9a96e" : "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
                {filters.verified ? "✓" : ""}
              </div>
              <span style={{ fontSize: 13 }}>Profil verificat</span>
            </div>
            <div onClick={() => setFilters({ ...filters, available: !filters.available })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${filters.available ? "#c9a96e" : "#262626"}`, background: filters.available ? "#c9a96e" : "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a", flexShrink: 0 }}>
                {filters.available ? "✓" : ""}
              </div>
              <span style={{ fontSize: 13 }}>Disponibil azi</span>
            </div>
          </div>
        </div>
        {/* REZULTATE */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: "#777" }}>
              {loading ? "Se caută..." : <><span style={{ color: "#f0ede8", fontWeight: 600 }}>{results.length}</span> rezultate{query ? ` pentru "${query}"` : ""}</>}
            </div>
            <select style={{ padding: "8px 14px", background: "#161616", border: "1px solid #262626", borderRadius: 8, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
              <option>Relevanță</option>
              <option>Rating (desc)</option>
              <option>Preț (asc)</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#777" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 14 }}>Se caută...</div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#777" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#f0ede8" }}>Niciun rezultat</div>
              <div style={{ fontSize: 13 }}>Încearcă alte cuvinte cheie sau altă locație</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {results.map((r: any) => (
                <Link key={r.id} href={`/p/${r.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden", transition: "all 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#262626"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>
                    <div style={{ height: 100, background: "linear-gradient(135deg,#1a1408,#2a2010)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {r.avatar ? (
                        <img src={r.avatar} style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(201,169,110,0.3)" }} />
                      ) : (
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "#fff", border: "3px solid rgba(201,169,110,0.3)" }}>
                          {r.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div style={{ position: "absolute", top: 8, left: 8, padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: r.accountType === "company" ? "rgba(90,141,224,0.2)" : "rgba(201,169,110,0.2)", color: r.accountType === "company" ? "#5a8de0" : "#c9a96e", border: `1px solid ${r.accountType === "company" ? "rgba(90,141,224,0.3)" : "rgba(201,169,110,0.3)"}` }}>
                        {r.accountType === "company" ? "🏢 Firmă" : "👤 Persoană fizică"}
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{r.name}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a96e" }}>★ {r.rating || "—"}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#777", marginBottom: 10 }}>📍 {r.oras || r.city || "România"}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                        {(r.services || []).slice(0, 3).map((s: any) => (
                          <div key={s.id} style={{ padding: "3px 9px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 6, fontSize: 11, color: "#c9a96e" }}>{s.name}</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #262626" }}>
                        <div style={{ fontSize: 11, color: "#4caf82", fontWeight: 600 }}>● Disponibil</div>
                        <div style={{ fontSize: 13, color: "#777" }}>de la <span style={{ fontWeight: 700, color: "#c9a96e" }}>{r.minPrice || "—"} lei</span></div>
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