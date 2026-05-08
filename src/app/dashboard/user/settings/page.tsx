"use client";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

export default function Page() {
  const { isMobile } = useResponsive();
  const s = { bg: "#0a0a0a", surface: "#161616", border: "#262626", accent: "#c9a96e", muted: "#777" };

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)" }}>
      
      {/* TOPBAR */}
      <div style={{ height: 56, background: "rgba(10,10,10,0.9)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard/user" style={{ fontSize: 18, textDecoration: "none", color: s.muted }}>←</Link>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 600 }}>⚙️ Setări</div>
        </div>
        <Link href="/" style={{ fontSize: 16, textDecoration: "none", color: s.muted }}>🏠</Link>
      </div>

      {/* CONTENT */}
      <div style={{ padding: isMobile ? 16 : 32, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Setări</div>
          <div style={{ fontSize: 14, color: s.muted, marginBottom: 28 }}>Această pagină este în curs de dezvoltare.</div>
          <Link href="/dashboard/user" style={{ padding: "10px 24px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 9, fontSize: 13, color: s.accent, textDecoration: "none", fontWeight: 600 }}>
            ← Înapoi la profil
          </Link>
        </div>
      </div>
    </div>
  );
}
