"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

export default function UserServicesPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

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
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.services || []));
  }, []);

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", paddingBottom: isMobile ? 70 : 0 }}>
      <div style={{ height: 56, background: "rgba(10,10,10,0.9)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard/user" style={{ fontSize: 20, textDecoration: "none", color: s.muted }}>←</Link>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>Serviciile mele</div>
        </div>
        <button style={{ padding: "7px 14px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adaugă</button>
      </div>
      <div style={{ padding: isMobile ? 16 : 28, maxWidth: 1200, margin: "0 auto" }}>
        {services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: s.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✂️</div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Niciun serviciu adăugat</div>
            <div style={{ fontSize: 13, marginBottom: 20 }}>Adaugă primul tău serviciu pentru a fi vizibil în căutări</div>
            <button style={{ padding: "10px 24px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adaugă serviciu</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {services.map((svc: any, i: number) => (
              <div key={i} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 80, background: "linear-gradient(135deg,#1a1408,#2a2010)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                  {svc.icon || "✂️"}
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{svc.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    <div style={{ background: s.surface2, borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                      <div style={{ fontSize: 10, color: s.muted }}>Tarif</div>
                    </div>
                    <div style={{ background: s.surface2, borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: s.accent }}>{svc.duration * 30} min</div>
                      <div style={{ fontSize: 10, color: s.muted }}>Durată</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ flex: 1, padding: 8, borderRadius: 8, background: s.surface2, color: "#f0ede8", border: `1px solid ${s.border}`, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✏️ Editează</button>
                    <button style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(224,90,90,0.1)", color: "#e05a5a", border: "1px solid rgba(224,90,90,0.2)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#111", borderTop: `1px solid ${s.border}`, display: "flex", zIndex: 100 }}>
          {[["🏠","Profil","/dashboard/user"],["📅","Rezervări","/dashboard/user/bookings"],["💬","Mesaje","/dashboard/user/messages"],["✂️","Servicii","/dashboard/user/services"],["⚙️","Setări","/dashboard/user/settings"]].map(([i,l,h]) => (
            <a key={h} href={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: h === "/dashboard/user/services" ? s.accent : s.muted, fontSize: 9, textDecoration: "none" }}>
              <div style={{ fontSize: 18 }}>{i}</div>{l}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}