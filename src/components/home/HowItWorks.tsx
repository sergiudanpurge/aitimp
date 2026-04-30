"use client";

const steps = [
  { n: "1", title: "Caută & alege", desc: "Filtrezi după categorie, locație și rating. Vezi disponibilitatea în timp real." },
  { n: "2", title: "Fă o rezervare", desc: "Alegi data și ora direct din calendarul prestatorului. Confirmare instantanee." },
  { n: "3", title: "Bucură-te & recenzează", desc: "Primești reminder înainte. Afterward lași o recenzie și ajuți comunitatea." },
];

const mockProviders = [
  { icon: "✂️", name: "Salon Élite by Maria", cat: "Coafură · București", rating: "★ 4.97" },
  { icon: "🔧", name: "Ioan Instalații Pro", cat: "Instalații · Cluj", rating: "★ 4.91" },
  { icon: "⚖️", name: "Av. Andrei Popescu", cat: "Juridic · Iași", rating: "★ 4.88" },
  { icon: "🏋️", name: "FitLife by Andrei", cat: "Fitness · Timișoara", rating: "★ 4.95" },
  { icon: "📸", name: "Studio Lumina", cat: "Foto & Video · Cluj", rating: "★ 4.93" },
];

export default function HowItWorks() {
  return (
    <section id="cum-functioneaza" style={{ padding: "120px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start", background: "#090806" }}>
      
      {/* Stânga - pași */}
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16 }}>
          <span style={{ width: 20, height: 1, background: "#C9A84C", display: "inline-block" }} />
          Simplu ca bună ziua
          <span style={{ width: 20, height: 1, background: "#C9A84C", display: "inline-block" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
          Trei pași și <em style={{ fontStyle: "italic", color: "#C9A84C" }}>gata</em>
        </h2>
        <p style={{ color: "#7A7060", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: 48 }}>
          Nu mai pierde timp căutând pe Google, sunând pe rând sau așteptând să fii apelat înapoi. Totul se întâmplă în câteva minute.
        </p>
        <div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "28px 0", borderBottom: "1px solid rgba(201,168,76,0.12)", borderTop: i === 0 ? "1px solid rgba(201,168,76,0.12)" : "none" }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: "2.2rem", fontWeight: 900, color: "#C9A84C", lineHeight: 1, minWidth: 36 }}>{s.n}</div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>{s.title}</h4>
                <p style={{ color: "#7A7060", fontSize: "0.85rem", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dreapta - card aliniat cu pașii */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: "218px" }}>
        <div style={{ background: "#0f0e0b", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 20, padding: "32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
          {mockProviders.map((p, i) => (
            <div key={i} style={{ background: "#090806", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 12, padding: "20px 24px", marginBottom: i < 2 ? 12 : 0, display: "flex", alignItems: "center", gap: 16, transition: "border-color 0.3s", position: "relative", zIndex: 1 }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.4)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.15)"}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#2a2015,#3a3020)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{p.icon}</div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#7A7060" }}>{p.cat}</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#C9A84C", fontWeight: 600 }}>{p.rating}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}