"use client";
import { useResponsive } from "@/hooks/useResponsive";

const reviews = [
  { text: "Am găsit un instalator în 10 minute și a venit a doua zi dimineața.", name: "Radu M.", role: "Client · București", icon: "👨", type: "Client" },
  { text: "Ca prestator, mi-am dublat numărul de clienți în prima lună.", name: "Elena K.", role: "Nutriționist · Cluj", icon: "👩", type: "Prestator" },
  { text: "Recenziile sunt reale și verificate. Am ales un fotograf pentru nuntă bazat pe ele.", name: "Andreea & Vlad", role: "Clienți · Timișoara", icon: "👰", type: "Client" },
];

export default function ReviewsSection() {
  const { isMobile } = useResponsive();
  return (
    <section id="recenzii" style={{ padding: "clamp(48px, 8vw, 120px) clamp(16px, 5vw, 64px)", background: "#0f0e0b", borderTop: "1px solid rgba(201,168,76,0.12)" }}>
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16 }}>
          <span style={{ width: 20, height: 1, background: "#C9A84C", display: "inline-block" }} />
          Ce spun utilizatorii
          <span style={{ width: 20, height: 1, background: "#C9A84C", display: "inline-block" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, lineHeight: 1.15 }}>
          Oameni reali, <em style={{ fontStyle: "italic", color: "#C9A84C" }}>experiențe reale</em>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ background: "#181510", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 20, padding: "40px 36px", position: "relative", transition: "border-color 0.3s, transform 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.4)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,0.15)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
            <div style={{ position: "absolute", top: 20, right: 28, fontFamily: "var(--font-playfair)", fontSize: "5rem", fontWeight: 900, color: "rgba(201,168,76,0.07)", lineHeight: 1 }}>"</div>
            <div style={{ color: "#C9A84C", fontSize: "0.9rem", letterSpacing: "0.1em", marginBottom: 20 }}>★★★★★</div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 32, color: "#F2ECD8" }}>{r.text}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#2a2015,#3a3020)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#7A7060" }}>{r.role}</div>
              </div>
              <span style={{ marginLeft: "auto", background: "rgba(201,168,76,0.08)", color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 6 }}>{r.type}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
