"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

export default function Page() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", yellow: "#e8b84b", red: "#e05a5a",
  };

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      setUser(d.user);
    });
  }, []);

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", paddingBottom: isMobile ? 70 : 0 }}>
      <div style={{ height: 56, background: "rgba(10,10,10,0.9)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard/user" style={{ fontSize: 20, textDecoration: "none", color: s.muted }}>←</Link>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>Recenzii date</div>
        </div>
      </div>
      <div style={{ padding: isMobile ? 16 : 28, maxWidth: 1200, margin: "0 auto" }}>
        
        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recenziile mele</div>
          <div style={{ textAlign: "center", padding: "40px 0", color: s.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Nicio recenzie dată încă</div>
            <div style={{ fontSize: 13, marginBottom: 20 }}>Recenziile apar după finalizarea unui serviciu</div>
            <a href="/search" style={{ padding: "10px 24px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 9, fontSize: 13, color: s.accent, textDecoration: "none", fontWeight: 600 }}>Caută servicii →</a>
          </div>
        </div>
      </div>
      
  {isMobile && (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#111", borderTop: "1px solid #262626", display: "flex", zIndex: 100 }}>
      {[["🏠","Profil","/dashboard/user"],["📅","Rezervări","/dashboard/user/bookings"],["💬","Mesaje","/dashboard/user/messages"],["✂️","Servicii","/dashboard/user/services"],["⚙️","Setări","/dashboard/user/settings"]].map(([i,l,h]) => (
        <a key={h} href={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: h === "/dashboard/user/reviews" ? "#c9a96e" : "#777", fontSize: 9, textDecoration: "none" }}>
          <div style={{ fontSize: 18 }}>{i}</div>{l}
        </a>
      ))}
    </div>
  )}
    </div>
  );
}