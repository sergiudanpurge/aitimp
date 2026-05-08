"use client";

const services = [
  { icon: "✂️", name: "Coafură & Beauty", desc: "Frizeri, saloane, makeup artiști, nail art — arată impecabil fără bătaie de cap.", count: "340+ prestatori" },
  { icon: "🔧", name: "Reparații & Casă", desc: "Instalatori, electricieni, zugravi, tâmplari — meșterul vine la tine acasă.", count: "520+ prestatori" },
  { icon: "⚖️", name: "Juridic & Financiar", desc: "Avocați, notari, contabili, consultanți fiscali — sfaturi de la experți.", count: "180+ prestatori" },
  { icon: "🏋️", name: "Sănătate & Fitness", desc: "Personal traineri, nutriționiști, psihologi, kinetoterapeuți — corpul și mintea ta.", count: "290+ prestatori" },
  { icon: "📚", name: "Educație & Tutoriat", desc: "Meditații, cursuri, coaching — profesori verificați pentru orice materie.", count: "210+ prestatori" },
  { icon: "📸", name: "Foto & Video", desc: "Fotografi, videografi, editare — amintiri profesionale pentru orice eveniment.", count: "150+ prestatori" },
  { icon: "🐾", name: "Animale de companie", desc: "Grooming, dresaj, veterinari la domiciliu — grija față de prietenii tăi blănoși.", count: "95+ prestatori" },
  { icon: "➕", name: "Și multe altele", desc: "32 de categorii active și în continuă creștere. Dacă ai nevoie de ceva, probabil îl găsim.", count: "Explorează toate →", extra: true },
];

export default function ServicesSection() {
  return (
    <section id="servicii" style={{ padding: "clamp(48px, 8vw, 100px) clamp(16px, 5vw, 64px)", background: "#0f0e0b" }}>
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "16px" }}>
          <span style={{ width: 20, height: 1, background: "#C9A84C", display: "inline-block" }} />
          Ce găsești pe platformă
          <span style={{ width: 20, height: 1, background: "#C9A84C", display: "inline-block" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, lineHeight: 1.15 }}>
          Servicii pentru <em style={{ fontStyle: "italic", color: "#C9A84C" }}>orice nevoie</em>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {services.map((s, i) => (
          <div key={i} style={{
            background: s.extra ? "rgba(201,168,76,0.05)" : "#181510",
            border: `1px solid ${s.extra ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.15)"}`,
            borderRadius: "16px", padding: "36px 28px", cursor: "pointer",
            transition: "all 0.3s", borderStyle: s.extra ? "dashed" : "solid",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.5)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.borderColor = s.extra ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.15)";
            }}>
            <span style={{ fontSize: "2.2rem", marginBottom: "18px", display: "block" }}>{s.icon}</span>
            <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "10px" }}>{s.name}</h3>
            <p style={{ fontSize: "0.83rem", color: "#7A7060", lineHeight: 1.65, marginBottom: "20px" }}>{s.desc}</p>
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: s.extra ? "#5A5040" : "#C9A84C" }}>{s.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
