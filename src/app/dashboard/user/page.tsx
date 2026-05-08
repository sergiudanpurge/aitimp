"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import Link from "next/link";

export default function UserProfilePage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"client" | "prestator">("client");
  const [bookings, setBookings] = useState<any[]>([]);
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
      if (d.user?.role === "employee") { router.push("/dashboard/employee"); return; }
    });
    fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d.bookings || []));
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.services || []));
  }, []);

  const statusConfig: any = {
    pending: { label: "În așteptare", color: "#e8b84b", bg: "rgba(232,184,75,0.15)" },
    accepted: { label: "Confirmat", color: "#4caf82", bg: "rgba(76,175,130,0.15)" },
    cancelled: { label: "Anulat", color: "#e05a5a", bg: "rgba(224,90,90,0.15)" },
    completed: { label: "Finalizat", color: "#c9a96e", bg: "rgba(201,169,110,0.15)" },
  };

  const navItems = [
    { icon: "🏠", label: "Profil", href: "/dashboard/user" },
    { icon: "📅", label: "Rezervări", href: "/dashboard/user/bookings" },
    { icon: "💬", label: "Mesaje", href: "/dashboard/user/messages" },
    { icon: "✂️", label: "Servicii", href: "/dashboard/user/services" },
    { icon: "⚙️", label: "Setări", href: "/dashboard/user/settings" },
  ];

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex" }}>

      {/* SIDEBAR — doar desktop */}
      {!isMobile && (
        <div style={{ width: 220, background: "#111", borderRight: `1px solid ${s.border}`, position: "fixed", top: 0, left: 0, bottom: 0, display: "flex", flexDirection: "column", zIndex: 50 }}>
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${s.border}` }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: s.accent }}>aitimp.ro</div>
          </div>
          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.8px", padding: "8px 12px 4px" }}>Client</div>
            {[["🏠","Profilul meu","/dashboard/user"],["📅","Rezervările mele","/dashboard/user/bookings"],["💬","Mesaje","/dashboard/user/messages"],["⭐","Recenzii date","/dashboard/user/reviews"]].map(([i,l,h]) => (
              <a key={h} href={h} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: h === "/dashboard/user" ? s.accent : s.muted, background: h === "/dashboard/user" ? "rgba(201,169,110,0.1)" : "transparent", border: h === "/dashboard/user" ? `1px solid rgba(201,169,110,0.2)` : "1px solid transparent", textDecoration: "none" }}>
                <span>{i}</span>{l}
              </a>
            ))}
            <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 12px 4px" }}>Prestator</div>
            {[["✂️","Serviciile mele","/dashboard/user/services"],["🗓","Calendarul meu","/dashboard/user/calendar"],["📋","Cereri primite","/dashboard/user/requests"],["⭐","Recenzii primite","/dashboard/user/reviews-received"]].map(([i,l,h]) => (
              <a key={h} href={h} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: s.muted, textDecoration: "none" }}>
                <span>{i}</span>{l}
              </a>
            ))}
            <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 12px 4px" }}>Cont</div>
            <a href="/dashboard/user/settings" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: s.muted, textDecoration: "none" }}>
              <span>⚙️</span>Setări
            </a>
          </nav>
          <div style={{ padding: "16px 12px", borderTop: `1px solid ${s.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{user.name?.charAt(0)}</div>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: 11, color: s.muted }}>Client & Prestator</div></div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={{ marginLeft: isMobile ? 0 : 220, flex: 1, paddingBottom: isMobile ? 70 : 0 }}>

        {/* TOPBAR */}
        <div style={{ height: 58, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ fontSize: 18, textDecoration: "none", color: s.muted }}>🏠</Link>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>Profilul meu</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href={`/p/${user.id}`} target="_blank" style={{ padding: "7px 14px", background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`, borderRadius: 8, fontSize: 12, color: s.accent, textDecoration: "none", fontWeight: 600 }}>
              {isMobile ? "👁" : "👁 Profil public"}
            </a>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.surface, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              🔔<div style={{ position: "absolute", top: 5, right: 6, width: 7, height: 7, borderRadius: "50%", background: s.accent, border: `1.5px solid ${s.bg}` }} />
            </div>
          </div>
        </div>

        <div style={{ padding: isMobile ? 16 : 28, display: "flex", flexDirection: "column", gap: 20, maxWidth: 1200, width: "100%", margin: "0 auto" }}>

          {/* MODE TOGGLE */}
          <div style={{ display: "flex", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: 4, gap: 4 }}>
            <button onClick={() => setMode("client")} style={{ flex: 1, padding: 10, borderRadius: 9, border: "none", background: mode === "client" ? "rgba(90,141,224,0.15)" : "transparent", color: mode === "client" ? "#5a8de0" : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              👤 Client
            </button>
            <button onClick={() => setMode("prestator")} style={{ flex: 1, padding: 10, borderRadius: 9, border: "none", background: mode === "prestator" ? "rgba(201,169,110,0.15)" : "transparent", color: mode === "prestator" ? s.accent : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              🔧 Prestator
            </button>
          </div>

          {/* PROFIL HEADER */}
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ height: 70, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
            <div style={{ padding: "0 20px 20px", marginTop: -28, display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, flexShrink: 0 }}>
                {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : user.name?.charAt(0)}
              </div>
              <div style={{ flex: 1, paddingBottom: 4, minWidth: 120 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>{user.oras && `📍 ${user.oras}`} · Membru din 2025</div>
              </div>
              {!isMobile && (
                <div style={{ display: "flex", gap: 8, paddingBottom: 8 }}>
                  <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(90,141,224,0.1)", border: "1px solid rgba(90,141,224,0.2)", fontSize: 11, color: "#5a8de0", fontWeight: 600 }}>👤 Client</div>
                  <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", fontSize: 11, color: s.accent, fontWeight: 600 }}>🔧 Prestator</div>
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${s.border}` }}>
              {[[bookings.length.toString(),"Rezervări"],[services.length.toString(),"Servicii"],["4.94","Rating"],["0","Recenzii"]].map(([val,label],i) => (
                <div key={i} style={{ padding: isMobile ? "10px 8px" : "14px 16px", borderRight: i < 3 ? `1px solid ${s.border}` : "none", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 20, fontWeight: 700, color: s.accent }}>{val}</div>
                  <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MODUL CLIENT */}
          {mode === "client" && (
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rezervările mele</div>
                <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>Vezi toate →</span>
              </div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>Nicio rezervare încă.</div>
              ) : bookings.slice(0, 5).map((b: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < Math.min(bookings.length, 5) - 1 ? `1px solid ${s.surface2}` : "none" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {b.service?.icon || "📅"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name}</div>
                    <div style={{ fontSize: 11, color: s.muted }}>{b.date} · {b.time}</div>
                  </div>
                  <div style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>
                    {statusConfig[b.status]?.label || b.status}
                  </div>
                  {!isMobile && <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, minWidth: 55, textAlign: "right" }}>{b.totalPrice} lei</div>}
                </div>
              ))}
            </div>
          )}

          {/* MODUL PRESTATOR */}
          {mode === "prestator" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Serviciile mele</div>
                    <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>+ Adaugă</span>
                  </div>
                  {services.length === 0 ? (
                    <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>Niciun serviciu.</div>
                  ) : services.map((svc: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < services.length - 1 ? `1px solid ${s.surface2}` : "none" }}>
                      <div style={{ fontSize: 18, width: 28, textAlign: "center", flexShrink: 0 }}>{svc.icon || "✂️"}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.name}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{svc.price} lei</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Calendarul meu</div>
                    <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>Gestionează →</span>
                  </div>
                  <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
                    {[{n:"L",d:5,a:false},{n:"Ma",d:6,a:true},{n:"Mi",d:7,a:true},{n:"J",d:8,a:true},{n:"V",d:9,a:true}].map(day => (
                      <div key={day.d} style={{ flex: 1, textAlign: "center", padding: "6px 3px", borderRadius: 6, border: `1px solid ${day.d === 7 ? s.accent : day.a ? "rgba(201,169,110,0.2)" : "transparent"}`, background: day.d === 7 ? "rgba(201,169,110,0.12)" : "transparent", opacity: day.a ? 1 : 0.3 }}>
                        <div style={{ fontSize: 9, color: day.d === 7 ? s.accent : s.muted }}>{day.n}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: day.d === 7 ? s.accent : "#f0ede8" }}>{day.d}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {["08:00","08:30","09:00","09:30","10:00","11:00","14:00","15:00"].map(slot => {
                      const busy = ["09:00","09:30"].includes(slot);
                      return <div key={slot} style={{ padding: "5px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, border: `1px solid ${busy ? "#262626" : "rgba(76,175,130,0.3)"}`, background: busy ? "#1e1e1e" : "rgba(76,175,130,0.08)", color: busy ? "#444" : s.green, textDecoration: busy ? "line-through" : "none" }}>{slot}</div>;
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Cereri primite</div>
                    <span style={{ fontSize: 11, color: s.accent }}>Vezi toate →</span>
                  </div>
                  {[{name:"Andrei M.",svc:"Reparații urgente",date:"Joi 8 Mai · 09:00"},{name:"Maria D.",svc:"Instalații",date:"Vin 9 Mai · 14:00"}].map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i === 0 ? `1px solid ${s.surface2}` : "none" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{r.name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name} — {r.svc}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{r.date}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", color: s.green, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✓</button>
                        <button style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Recenzii primite</div>
                    <span style={{ fontSize: 11, color: s.accent }}>Vezi toate →</span>
                  </div>
                  {[{av:"A",name:"Andrei M.",stars:5,text:"A venit în 30 min. Recomand!"},{av:"M",name:"Maria D.",stars:5,text:"Instalație perfectă!"}].map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 1 ? `1px solid ${s.surface2}` : "none" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#3a2a1a,#5a4a2a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{r.av}</div>
                      <div><div style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</div><div style={{ color: s.accent, fontSize: 10 }}>{"★".repeat(r.stars)}</div><div style={{ fontSize: 11, color: "#a0a0a0", lineHeight: 1.5 }}>{r.text}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETARI */}
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Setări cont</div>
            {[
              { label: "Notificări email rezervări", sub: "Primești email la fiecare rezervare nouă" },
              { label: "Reminder înainte de rezervare", sub: "Cu o zi și o oră înainte" },
              { label: "Profilul meu public vizibil", sub: "Apari în rezultatele de căutare" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${s.surface2}` : "none", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: "rgba(201,169,110,0.2)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", padding: "0 4px", cursor: "pointer", justifyContent: "flex-end", flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: s.accent }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* BOTTOM NAV MOBILE */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#111", borderTop: `1px solid ${s.border}`, display: "flex", zIndex: 100 }}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: item.href === "/dashboard/user" ? s.accent : s.muted, fontSize: 9, textDecoration: "none" }}>
              <div style={{ fontSize: 18 }}>{item.icon}</div>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}