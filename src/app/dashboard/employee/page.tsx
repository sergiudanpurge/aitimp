"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import Link from "next/link";

export default function EmployeeDashboard() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [mode, setMode] = useState<"prestator" | "client">("prestator");
  const [activeNav, setActiveNav] = useState("dashboard");

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
    fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d.bookings || []));
  }, []);

  const pending = bookings.filter(b => b.status === "pending").length;
  const accepted = bookings.filter(b => b.status === "accepted").length;

  const navItems = [
    { id: "dashboard", icon: "⚡", label: "Dashboard" },
    { id: "services", icon: "✂️", label: "Servicii" },
    { id: "calendar", icon: "🗓", label: "Calendar" },
    { id: "bookings", icon: "📋", label: "Cereri" },
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "settings", icon: "⚙️", label: "Setări" },
  ];

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.accent, fontFamily: "var(--font-playfair)", fontSize: "1.2rem" }}>Se încarcă...</div>;
  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex" }}>

      {/* SIDEBAR — doar desktop */}
      {!isMobile && (
        <div style={{ width: 220, background: "#111", borderRight: `1px solid ${s.border}`, position: "fixed", top: 0, left: 0, bottom: 0, display: "flex", flexDirection: "column", zIndex: 50 }}>
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${s.border}` }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: s.accent }}>aitimp.ro</div>
            <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>Panou Angajat</div>
          </div>
          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: activeNav === item.id ? s.accent : s.muted, background: activeNav === item.id ? "rgba(201,169,110,0.1)" : "transparent", border: activeNav === item.id ? `1px solid rgba(201,169,110,0.2)` : "1px solid transparent", cursor: "pointer", fontFamily: "var(--font-outfit)", textAlign: "left" }}>
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "16px 12px", borderTop: `1px solid ${s.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                {user.name?.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: 11, color: s.muted }}>Angajat</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={{ marginLeft: isMobile ? 0 : 220, flex: 1, display: "flex", flexDirection: "column", paddingBottom: isMobile ? 70 : 0 }}>

        {/* TOPBAR */}
        <div style={{ height: 58, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ fontSize: 18, textDecoration: "none", color: s.muted }}>🏠</Link>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>
              {navItems.find(n => n.id === activeNav)?.label || "Dashboard"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href={`/p/${user.id}`} target="_blank" style={{ padding: "7px 14px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 8, fontSize: 12, color: s.accent, textDecoration: "none", fontWeight: 600 }}>
              {isMobile ? "👁" : "👁 Profil public"}
            </Link>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.surface, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              🔔
              <div style={{ position: "absolute", top: 5, right: 6, width: 7, height: 7, borderRadius: "50%", background: s.accent, border: `1.5px solid ${s.bg}` }} />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: isMobile ? 16 : 28, display: "flex", flexDirection: "column", gap: 16, maxWidth: 1400, width: "100%" }}>
            {/* PROFIL ANGAJAT */}
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ height: 70, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
            <div style={{ padding: "0 20px 20px", marginTop: -28, display: "flex", alignItems: "flex-end", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, flexShrink: 0 }}>
                {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : user.name?.charAt(0)}
              </div>
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>
                  {user.oras && `📍 ${user.oras}${user.judet ? `, ${user.judet}` : ""}`} · Angajat
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, paddingBottom: 8 }}>
                <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", fontSize: 11, color: s.accent, fontWeight: 600 }}>★ 4.97</div>
              </div>
            </div>
            {user.description && (
              <div style={{ padding: "0 20px 14px", fontSize: 12, color: "#a0a0a0", lineHeight: 1.6 }}>{user.description}</div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${s.border}` }}>
              {[
                [bookings.length.toString(), "Rezervări"],
                [accepted.toString(), "Confirmate"],
                ["4.97", "Rating"],
                [services.length.toString(), "Servicii"],
              ].map(([val, label], i) => (
                <div key={i} style={{ padding: "12px", borderRight: i < 3 ? `1px solid ${s.border}` : "none", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: s.accent }}>{val}</div>
                  <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MODE TOGGLE */}
          <div style={{ display: "flex", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: 4, gap: 4 }}>
            <button onClick={() => setMode("prestator")} style={{ flex: 1, padding: 10, borderRadius: 9, border: "none", background: mode === "prestator" ? "rgba(201,169,110,0.15)" : "transparent", color: mode === "prestator" ? s.accent : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              🔧 Ca Prestator
            </button>
            <button onClick={() => setMode("client")} style={{ flex: 1, padding: 10, borderRadius: 9, border: "none", background: mode === "client" ? "rgba(90,141,224,0.15)" : "transparent", color: mode === "client" ? "#5a8de0" : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              👤 Ca Client
            </button>
          </div>
          {/* MODUL PRESTATOR */}
          {mode === "prestator" && (
            <>
              {/* STATS */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
                {[
                  [bookings.length.toString(), "Total rezervări", s.accent],
                  [accepted.toString(), "Confirmate", s.green],
                  [pending.toString(), "În așteptare", s.yellow],
                  [services.length.toString(), "Servicii", "#5a8de0"],
                ].map(([val, label, color]) => (
                  <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: isMobile ? "12px 14px" : "16px 20px" }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 22 : 26, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* SERVICII + CALENDAR */}
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
                      <div style={{ fontSize: 20, width: 30, textAlign: "center" }}>{svc.icon || "✂️"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{svc.name}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                      <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(76,175,130,0.15)", color: s.green, fontWeight: 700 }}>● Activ</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Calendarul meu</div>
                    <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>Gestionează →</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {[{n:"Lun",d:5,a:false},{n:"Mar",d:6,a:true},{n:"Mie",d:7,a:true},{n:"Joi",d:8,a:true},{n:"Vin",d:9,a:true}].map(day => (
                      <div key={day.d} style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 7, border: `1px solid ${day.d === 7 ? s.accent : day.a ? "rgba(201,169,110,0.2)" : "transparent"}`, background: day.d === 7 ? "rgba(201,169,110,0.12)" : "transparent", opacity: day.a ? 1 : 0.3 }}>
                        <div style={{ fontSize: 9, color: day.d === 7 ? s.accent : s.muted, marginBottom: 2 }}>{day.n}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: day.d === 7 ? s.accent : "#f0ede8" }}>{day.d}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {["08:00","08:30","09:00","10:00","10:30","11:00","14:00","15:00"].map((slot, i) => {
                      const isBusy = ["09:00","14:00"].includes(slot);
                      return (
                        <div key={slot} style={{ padding: "5px 9px", borderRadius: 5, fontSize: 10, fontWeight: 600, border: `1px solid ${isBusy ? s.surface2 : "rgba(76,175,130,0.3)"}`, background: isBusy ? s.surface2 : "rgba(76,175,130,0.08)", color: isBusy ? "#444" : s.green, textDecoration: isBusy ? "line-through" : "none" }}>
                          {slot}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CERERI */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Cereri primite</div>
                  <span style={{ fontSize: 11, color: s.accent }}>Vezi toate →</span>
                </div>
                {bookings.filter(b => b.status === "pending").length === 0 ? (
                  <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>Nicio cerere nouă.</div>
                ) : bookings.filter(b => b.status === "pending").slice(0, 3).map((b: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${s.surface2}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {b.client?.name?.charAt(0) || "C"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{b.client?.name} — {b.service?.name}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{b.date} · {b.time}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "6px 12px", borderRadius: 7, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", color: s.green, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)", fontWeight: 600 }}>✓</button>
                      <button style={{ padding: "6px 12px", borderRadius: 7, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)", fontWeight: 600 }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* MODUL CLIENT */}
          {mode === "client" && (
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rezervările mele (ca Client)</div>
                <span style={{ fontSize: 11, color: s.accent }}>Vezi toate →</span>
              </div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>
                  Nicio rezervare încă.<br />
                  <Link href="/search" style={{ color: s.accent }}>Caută un serviciu →</Link>
                </div>
              ) : bookings.slice(0, 5).map((b: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 4 ? `1px solid ${s.surface2}` : "none" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    📅
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{b.service?.name}</div>
                    <div style={{ fontSize: 11, color: s.muted }}>{b.date} · {b.time}</div>
                  </div>
                  <div style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: b.status === "pending" ? "rgba(232,184,75,0.15)" : "rgba(76,175,130,0.15)", color: b.status === "pending" ? s.yellow : s.green }}>
                    {b.status === "pending" ? "Așteptare" : "Confirmat"}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{b.totalPrice} lei</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAV MOBILE */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#111", borderTop: `1px solid ${s.border}`, display: "flex", zIndex: 100 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "none", border: "none", color: activeNav === item.id ? s.accent : s.muted, fontSize: 9, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              <div style={{ fontSize: 18 }}>{item.icon}</div>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}