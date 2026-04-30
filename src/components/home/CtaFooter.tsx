"use client";

import Link from "next/link";

export function CtaSection() {
  return (
    <section style={{ padding: "140px 64px", textAlign: "center", position: "relative", overflow: "hidden", background: "#090806" }}>
      <div style={{ position: "absolute", width: 700, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.8rem,5vw,4.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, position: "relative", zIndex: 2 }}>
        Timpul tău e <em style={{ fontStyle: "italic", color: "#C9A84C" }}>prețios.</em><br />
        Folosește-l bine.
      </h2>
      <p style={{ color: "#7A7060", fontSize: "1rem", maxWidth: 400, margin: "0 auto 48px", lineHeight: 1.7, position: "relative", zIndex: 2 }}>
        Înregistrare gratuită. Fără card. Găsești sau oferi servicii în câteva minute.
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
        <Link href="#servicii" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#C9A84C", color: "#090806", padding: "16px 36px", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", borderRadius: 8, transition: "all 0.3s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(201,168,76,0.3)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
          🔍 Caut servicii
        </Link>
        <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: "#F2ECD8", border: "1px solid rgba(201,168,76,0.3)", padding: "16px 36px", fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", borderRadius: 8, transition: "all 0.3s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,168,76,0.6)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,168,76,0.3)"; }}>
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
    <footer style={{ background: "#090806", borderTop: "1px solid rgba(201,168,76,0.12)", padding: "80px 64px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 60, gap: 40, flexWrap: "wrap" }}>
        
        <div>
          <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#C9A84C", textDecoration: "none", display: "block", marginBottom: 14 }}>
            Aitimp<sup style={{ fontSize: "0.5rem", color: "#7A7060", fontFamily: "var(--font-outfit)", verticalAlign: "super" }}>.ro</sup>
          </Link>
          <p style={{ color: "#7A7060", fontSize: "0.85rem", maxWidth: 240, lineHeight: 1.7 }}>
            Platforma română care conectează clienți cu profesioniști verificați din toată țara.
          </p>
        </div>

        <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
          {cols.map(col => (
            <div key={col.title}>
              <h5 style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 20 }}>{col.title}</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(l => (
                  <Link key={l} href="#" style={{ color: "#7A7060", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.25s" }}
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