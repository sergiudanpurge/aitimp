"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function UserProfilePage() {
  const router = useRouter();
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
if (d.user?.role === "employee") {
  router.push("/dashboard/employee");
  return;
}
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

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;
  return (
    <div style={{ marginLeft: 220, minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)" }}>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#111", borderRight: `1px solid ${s.border}`, position: "fixed", top: 0, left: 0, bottom: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${s.border}` }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: s.accent }}>aitimp.ro</div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
          <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.8px", padding: "8px 12px 4px" }}>Ca și Client</div>
          {[["🏠", "Profilul meu", "/dashboard/user"], ["📅", "Rezervările mele", "/dashboard/user/bookings"], ["💬", "Mesaje", "/dashboard/user/messages"], ["⭐", "Recenzii date", "/dashboard/user/reviews"]].map(([icon, label, href]) => (
            <a key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: href === "/dashboard/user" ? s.accent : s.muted, background: href === "/dashboard/user" ? "rgba(201,169,110,0.1)" : "transparent", border: href === "/dashboard/user" ? `1px solid rgba(201,169,110,0.2)` : "1px solid transparent", textDecoration: "none" }}>
              <span>{icon}</span>{label}
            </a>
          ))}
          <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 12px 4px" }}>Ca și Prestator</div>
          {[["✂️", "Serviciile mele", "/dashboard/user/services"], ["🗓", "Calendarul meu", "/dashboard/user/calendar"], ["📋", "Cereri primite", "/dashboard/user/requests"], ["⭐", "Recenzii primite", "/dashboard/user/reviews-received"]].map(([icon, label, href]) => (
            <a key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: s.muted, background: "transparent", border: "1px solid transparent", textDecoration: "none" }}>
              <span>{icon}</span>{label}
            </a>
          ))}
          <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.8px", padding: "12px 12px 4px" }}>Cont</div>
          <a href="/dashboard/user/settings" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: s.muted, textDecoration: "none" }}>
            <span>⚙️</span>Setări
          </a>
        </nav>
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${s.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {user.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: s.muted }}>Client & Prestator</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* TOPBAR */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700 }}>Profilul meu</div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href={`/p/${user.id}`} target="_blank" style={{ padding: "9px 18px", background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`, borderRadius: 9, fontSize: 13, color: s.accent, textDecoration: "none", fontWeight: 600 }}>
              👁 Vezi profilul public
            </a>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: s.surface, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              🔔
              <div style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: s.accent, border: `1.5px solid ${s.bg}` }} />
            </div>
          </div>
        </div>

        {/* MODE TOGGLE */}
        <div style={{ display: "flex", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: 4, gap: 4 }}>
          <button onClick={() => setMode("client")} style={{ flex: 1, padding: 10, borderRadius: 9, border: "none", background: mode === "client" ? "rgba(90,141,224,0.15)" : "transparent", color: mode === "client" ? "#5a8de0" : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
            👤 Modul Client
          </button>
          <button onClick={() => setMode("prestator")} style={{ flex: 1, padding: 10, borderRadius: 9, border: "none", background: mode === "prestator" ? "rgba(201,169,110,0.15)" : "transparent", color: mode === "prestator" ? s.accent : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
            🔧 Modul Prestator
          </button>
        </div>
        {/* PROFIL HEADER */}
        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ height: 70, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
          <div style={{ padding: "0 20px 20px", marginTop: -28, display: "flex", alignItems: "flex-end", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, flexShrink: 0 }}>
              {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : user.name?.charAt(0)}
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>
                {user.oras && `📍 ${user.oras}${user.judet ? `, ${user.judet}` : ""}`} · Membru din 2025
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, paddingBottom: 8 }}>
              <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(90,141,224,0.1)", border: "1px solid rgba(90,141,224,0.2)", fontSize: 11, color: "#5a8de0", fontWeight: 600 }}>👤 Client</div>
              <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", fontSize: 11, color: s.accent, fontWeight: 600 }}>🔧 Prestator</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${s.border}` }}>
            {[
              [bookings.length.toString(), "Rezervări făcute"],
              [services.length.toString(), "Servicii oferite"],
              ["4.94", "Rating primit"],
              ["0", "Recenzii primite"]
            ].map(([val, label], i) => (
              <div key={i} style={{ padding: "14px 16px", borderRight: i < 3 ? `1px solid ${s.border}` : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: s.accent }}>{val}</div>
                <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MODUL CLIENT */}
        {mode === "client" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rezervările mele (ca și Client)</div>
                <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>Vezi toate →</span>
              </div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>Nicio rezervare încă.</div>
              ) : bookings.slice(0, 5).map((b: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < Math.min(bookings.length, 5) - 1 ? `1px solid ${s.surface2}` : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {b.service?.icon || "📅"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{b.service?.name} — {b.provider?.user?.name}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>{b.date} · {b.time}</div>
                  </div>
                  <div style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg || "rgba(201,169,110,0.15)", color: statusConfig[b.status]?.color || s.accent }}>
                    {statusConfig[b.status]?.label || b.status}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, minWidth: 60, textAlign: "right" }}>{b.totalPrice} lei</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* MODUL PRESTATOR */}
        {mode === "prestator" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* SERVICII + CALENDAR */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Serviciile mele</div>
                  <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>+ Adaugă</span>
                </div>
                {services.length === 0 ? (
                  <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>Niciun serviciu adăugat.</div>
                ) : services.map((svc: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < services.length - 1 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ fontSize: 20, width: 32, textAlign: "center", flexShrink: 0 }}>{svc.icon || "✂️"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{svc.name}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min · {svc.duration} slot{svc.duration > 1 ? "uri" : ""}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                    <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(76,175,130,0.15)", color: "#4caf82", fontWeight: 700 }}>● Activ</div>
                  </div>
                ))}
              </div>

              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Calendarul meu</div>
                  <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>Gestionează →</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {[{n:"Lun",d:5,a:false},{n:"Mar",d:6,a:true},{n:"Mie",d:7,a:true},{n:"Joi",d:8,a:true},{n:"Vin",d:9,a:true}].map(day => (
                    <div key={day.d} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 7, border: `1px solid ${day.d === 7 ? s.accent : day.a ? "rgba(201,169,110,0.2)" : "transparent"}`, background: day.d === 7 ? "rgba(201,169,110,0.12)" : "transparent", opacity: day.a ? 1 : 0.3 }}>
                      <div style={{ fontSize: 9, color: day.d === 7 ? s.accent : s.muted, marginBottom: 3 }}>{day.n}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: day.d === 7 ? s.accent : "#f0ede8" }}>{day.d}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: s.muted, marginBottom: 8 }}>Miercuri 7 Mai — sloturi:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {["08:00","08:30","09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00"].map((slot, i) => {
                    const isBusy = ["09:00","09:30","14:30"].includes(slot);
                    return (
                      <div key={slot} style={{ padding: "5px 9px", borderRadius: 5, fontSize: 10, fontWeight: 600, border: `1px solid ${isBusy ? "#262626" : "rgba(76,175,130,0.3)"}`, background: isBusy ? "#1e1e1e" : "rgba(76,175,130,0.08)", color: isBusy ? "#444" : "#4caf82", textDecoration: isBusy ? "line-through" : "none" }}>
                        {slot}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CERERI + RECENZII */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Cereri primite</div>
                  <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>Vezi toate →</span>
                </div>
                {[{name:"Andrei M.", svc:"Reparații urgente", date:"Joi 8 Mai · 09:00"},{name:"Maria D.", svc:"Instalații sanitare", date:"Vin 9 Mai · 14:00"}].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i === 0 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{r.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{r.name} — {r.svc}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{r.date}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(232,184,75,0.15)", color: s.yellow, fontWeight: 700 }}>Nouă</div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button style={{ flex: 1, padding: "9px", borderRadius: 8, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", color: "#4caf82", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✓ Acceptă</button>
                  <button style={{ flex: 1, padding: "9px", borderRadius: 8, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✕ Refuză</button>
                </div>
              </div>

              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Recenzii primite</div>
                  <span style={{ fontSize: 11, color: s.accent, cursor: "pointer" }}>Vezi toate →</span>
                </div>
                {[{av:"A",name:"Andrei M.",stars:5,text:"A venit în 30 minute și a rezolvat tot. Recomand!"},{av:"M",name:"Maria D.",stars:5,text:"Instalație perfectă, curat și ordonat după treabă."},{av:"V",name:"Vlad T.",stars:4,text:"Bun profesionist, mic întârziere dar treabă bună."}].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#3a2a1a,#5a4a2a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{r.av}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</div>
                      <div style={{ color: s.accent, fontSize: 10 }}>{"★".repeat(r.stars)}</div>
                      <div style={{ fontSize: 11, color: "#a0a0a0", marginTop: 2, lineHeight: 1.5 }}>{r.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* SETARI */}
        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Setări cont</div>
          {[
            { label: "Notificări email rezervări", sub: "Primești email la fiecare rezervare nouă" },
            { label: "Reminder înainte de rezervare", sub: "Cu o zi și o oră înainte" },
            { label: "Profilul meu public vizibil", sub: "Apari în rezultatele de căutare ca Prestator" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${s.surface2}` : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>{item.sub}</div>
              </div>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: "rgba(201,169,110,0.2)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", padding: "0 4px", cursor: "pointer", justifyContent: "flex-end" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: s.accent }} />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Schimbă parola</div>
              <div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>Ultima schimbare: acum 30 zile</div>
            </div>
            <button style={{ padding: "7px 16px", borderRadius: 8, background: s.surface2, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Schimbă →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}