"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 40px 100px", position: "relative", overflow: "hidden" }}>

      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.035) 1px,transparent 1px)", backgroundSize: "60px 60px", WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 100%)" }} />

      {/* Glow */}
      <div style={{ position: "absolute", width: 900, height: 500, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Eyebrow */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 40, animation: "fadeUp 0.7s 0.5s both" }}>
        <span style={{ width: 30, height: 1, background: "#C9A84C", display: "inline-block" }} />
        Platforma română de servicii profesionale
        <span style={{ width: 30, height: 1, background: "#C9A84C", display: "inline-block" }} />
      </div>

      {/* Motto */}
      <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.6rem,6vw,5.4rem)", fontWeight: 900, lineHeight: 1.08, maxWidth: 820, margin: "0 auto 24px", position: "relative", zIndex: 2 }}>
        <span style={{ display: "block", animation: "lineUp 1s 0.65s cubic-bezier(0.16,1,0.3,1) both", opacity: 0 }}>
          Dacă nu ai <em style={{ fontStyle: "italic", color: "#C9A84C" }}>tu timp,</em>
        </span>
        <span style={{ display: "block", animation: "lineUp 1s 0.82s cubic-bezier(0.16,1,0.3,1) both", opacity: 0 }}>
          au alții <em style={{ fontStyle: "italic", color: "#C9A84C" }}>pentru tine.</em>
        </span>
      </h1>

      {/* Sub */}
      <p style={{ fontSize: "1.05rem", color: "#7A7060", fontWeight: 300, maxWidth: 480, margin: "0 auto 56px", lineHeight: 1.7, animation: "fadeUp 0.7s 1.3s both", opacity: 0 }}>
        Găsești rapid un profesionist disponibil. Faci o rezervare. Gata — te ocupi de ce contează cu adevărat.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.7s 1.5s both", opacity: 0 }}>
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

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#5A5040", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", animation: "fadeUp 0.7s 2s both", opacity: 0 }}>
        <div style={{ width: 1, height: 50, background: "linear-gradient(to bottom, #C9A84C, transparent)", animation: "scrollPulse 2s 2.5s infinite" }} />
        Descoperă
      </div>
    </section>
  );
}