"use client";

import Link from "next/link";

export function CtaSection() {
  return (
    <section style={{ padding: "clamp(64px, 10vw, 140px) clamp(16px, 5vw, 64px)", textAlign: "center", position: "relative", overflow: "hidden", background: "#090806" }}>
      <div style={{ position: "absolute", width: 700, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,5vw,4.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, position: "relative", zIndex: 2 }}>
        Timpul tău e <em style={{ fontStyle: "italic", color: "#C9A84C" }}>prețios.</em><br />
        Folosește-l bine.
      </h2>
      <p style={{ color: "#7A7060", fontSize: "clamp(0.85rem,2vw,1rem)", maxWidth: 400, margin: "0 auto 40px", lineHeight: 1.7, position: "relative", zIndex: 2, padding: "0 16px" }}>
        Înregistrare gratuită. Fără card. Găsești sau oferi servicii în câteva minute.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 2, padding: "0 16px" }}>
        <Link href="/search" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#C9A84C", color: "#090806", padding: "14px 28px", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", borderRadius: 8 }}>
          🔍 Caut servicii
        </Link>
        <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: "#F2ECD8", border: "1px solid rgba(201,168,76,0.3)", padding: "14px 28px", fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", borderRadius: 8 }}>
          💼 Ofer servicii
        </Link>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { title: "Platformă", links: ["Cum funcționează", "Categorii servicii", "Pentru prestatori", "Prețuri"] },
    { title: "Companie", links: ["Despre noi", "Blog", "Contact", "Cariere"] },
    { title: "Legal", links: ["Termeni și condiții", "Confidențialitate", "Cookie-uri", "GDPR"] },
  ];

  return (
    <footer style={{ background: "#090806", borderTop: "1px solid rgba(201,168,76,0.12)", padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 64px) clamp(24px, 3vw, 40px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "clamp(32px, 5vw, 60px)", gap: 40, flexWrap: "wrap" }}>
        <div>
          <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#C9A84C", textDecoration: "none", display: "block", marginBottom: 14 }}>
            Aitimp<sup style={{ fontSize: "0.5rem", color: "#7A7060", fontFamily: "var(--font-outfit)", verticalAlign: "super" }}>.ro</sup>
          </Link>
          <p style={{ color: "#7A7060", fontSize: "0.85rem", maxWidth: 240, lineHeight: 1.7 }}>
            Platforma română care conectează clienți cu profesioniști verificați din toată țara.
          </p>
        </div>
        <div style={{ display: "flex", gap: "clamp(24px, 5vw, 64px)", flexWrap: "wrap" }}>
          {cols.map(col => (
            <div key={col.title}>
              <h5 style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 20 }}>{col.title}</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(l => (
                  <Link key={l} href="#" style={{ color: "#7A7060", fontSize: "0.85rem", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#F2ECD8"}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#7A7060"}>
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: 28, display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#5A5040", flexWrap: "wrap", gap: 8 }}>
        <span>© 2025 <Link href="/" style={{ color: "#C9A84C", textDecoration: "none" }}>Aitimp.ro</Link>. Toate drepturile rezervate.</span>
        <span>Construit cu ♥ în România</span>
      </div>
    </footer>
  );
}