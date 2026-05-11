"use client";
import FinancialDashboard from "@/components/dashboard/FinancialDashboard";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useResponsive } from "@/hooks/useResponsive";

export default function DashboardPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [employees, setEmployees] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"prestator" | "client">("prestator");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) router.push("/login");
      else {
        setUser(d.user);
        if (d.user?.role === "employee") {
          router.push("/dashboard/employee");
        } else if (d.user?.accountType === "private") {
          router.push("/dashboard/user");
        }
      }
    });
    fetch("/api/employees").then(r => r.json()).then(d => setEmployees(d.employees || []));
    fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d.bookings || []));
  }, []);

  const pending = bookings.filter(b => b.status === "pending").length;
  const accepted = bookings.filter(b => b.status === "accepted").length;

  return (
    <DashboardLayout title="Dashboard">

      {/* MODE TOGGLE */}
      <div style={{ display: "flex", background: "#161616", border: "1px solid #262626", borderRadius: 12, padding: 4, gap: 4 }}>
        <button onClick={() => setMode("prestator")} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: mode === "prestator" ? "rgba(201,169,110,0.15)" : "transparent", color: mode === "prestator" ? "#c9a96e" : "#777", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          🔧 Prestator
        </button>
        <button onClick={() => setMode("client")} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: mode === "client" ? "rgba(90,141,224,0.15)" : "transparent", color: mode === "client" ? "#5a8de0" : "#777", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          👤 Client
        </button>
      </div>

      {/* MODUL PRESTATOR */}
      {mode === "prestator" && (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12 }}>
            {[
              [bookings.length.toString(), "Total rezervări", "toate timpurile", "#c9a96e"],
              [accepted.toString(), "Rezervări active", "confirmate", "#4caf82"],
              [pending.toString(), "În așteptare", "necesită aprobare", "#e8b84b"],
              [employees.length.toString(), "Angajați activi", "în echipă", "#5a8de0"],
            ].map(([val, label, sub, color]) => (
              <div key={label} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: isMobile ? "14px 16px" : "20px 24px" }}>
                <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color, fontFamily: "var(--font-playfair)" }}>{val}</div>
                <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: "#f0ede8", marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Angajati + Rezervari */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: 14 }}>
            <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600 }}>Echipa</div>
                <button onClick={() => router.push("/dashboard/employees")} style={{ fontSize: 11, color: "#c9a96e", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Vezi toți →
                </button>
              </div>
              {employees.length === 0 ? (
                <div style={{ color: "#777", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                  Niciun angajat încă.<br />
                  <span onClick={() => router.push("/dashboard/employees")} style={{ color: "#c9a96e", cursor: "pointer" }}>Invită primul angajat →</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {employees.slice(0, 4).map((emp: any) => (
                    <div key={emp.id} onClick={() => router.push(`/dashboard/employees/${emp.id}`)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#1e1e1e", borderRadius: 10, cursor: "pointer", border: "1px solid #262626" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "#262626")}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {emp.name?.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: "#777", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.email}</div>
                      </div>
                      <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: emp.isActive === false ? "rgba(224,90,90,0.15)" : "rgba(76,175,130,0.15)", color: emp.isActive === false ? "#e05a5a" : "#4caf82", fontWeight: 700, flexShrink: 0 }}>
                        {emp.isActive === false ? "Inactiv" : "Activ"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600 }}>Ultimele rezervări</div>
                <button onClick={() => router.push("/dashboard/bookings")} style={{ fontSize: 11, color: "#c9a96e", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Vezi toate →
                </button>
              </div>
              {bookings.length === 0 ? (
                <div style={{ color: "#777", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Nicio rezervare încă.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {bookings.slice(0, 6).map((b: any) => (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#1e1e1e", borderRadius: 10, border: "1px solid #262626" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: "#262626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📅</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name || "Serviciu"}</div>
                        <div style={{ fontSize: 11, color: "#777" }}>{b.date} • {b.time}</div>
                      </div>
                      <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, flexShrink: 0,
                        background: b.status === "pending" ? "rgba(232,184,75,0.15)" : b.status === "accepted" ? "rgba(76,175,130,0.15)" : "rgba(201,169,110,0.15)",
                        color: b.status === "pending" ? "#e8b84b" : b.status === "accepted" ? "#4caf82" : "#c9a96e"
                      }}>
                        {b.status === "pending" ? "Așteptare" : b.status === "accepted" ? "Confirmat" : "Finalizat"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* MODUL CLIENT */}
      {mode === "client" && (
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600 }}>Rezervările mele — Client</div>
            <a href="/search" style={{ fontSize: 11, color: "#c9a96e", textDecoration: "none", fontWeight: 600 }}>+ Rezervă →</a>
          </div>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", color: "#777", fontSize: 13, padding: "30px 0" }}>
              Nicio rezervare ca Client.<br />
              <a href="/search" style={{ color: "#c9a96e" }}>Caută un serviciu →</a>
            </div>
          ) : bookings.slice(0, 5).map((b: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 4 ? "1px solid #1e1e1e" : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📅</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name || "Serviciu"}</div>
                <div style={{ fontSize: 11, color: "#777" }}>{b.date} · {b.time}</div>
              </div>
              <div style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 700, flexShrink: 0, background: b.status === "pending" ? "rgba(232,184,75,0.15)" : "rgba(76,175,130,0.15)", color: b.status === "pending" ? "#e8b84b" : "#4caf82" }}>
                {b.status === "pending" ? "Așteptare" : "Confirmat"}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#c9a96e", flexShrink: 0 }}>{b.totalPrice} lei</div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
}