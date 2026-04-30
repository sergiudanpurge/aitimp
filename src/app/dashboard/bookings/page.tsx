"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const statusConfig: any = {
  pending: { label: "În așteptare", color: "#e8b84b", bg: "rgba(232,184,75,0.15)" },
  accepted: { label: "Confirmat", color: "#4caf82", bg: "rgba(76,175,130,0.15)" },
  cancelled: { label: "Anulat", color: "#e05a5a", bg: "rgba(224,90,90,0.15)" },
  completed: { label: "Finalizat", color: "#c9a96e", bg: "rgba(201,169,110,0.15)" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("toate");

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d.bookings || []));
  }, []);

  const filters = ["toate", "pending", "accepted", "cancelled", "completed"];
  const filtered = filter === "toate" ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    toate: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    accepted: bookings.filter(b => b.status === "accepted").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  return (
    <DashboardLayout title="Rezervări">

      {/* Stats */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Total", val: stats.toate, color: "#c9a96e" },
          { label: "În așteptare", val: stats.pending, color: "#e8b84b" },
          { label: "Confirmate", val: stats.accepted, color: "#4caf82" },
          { label: "Finalizate", val: stats.completed, color: "#5a8de0" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: "#161616", border: "1px solid #262626", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "var(--font-playfair)" }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${filter === f ? "#c9a96e" : "#262626"}`,
            background: filter === f ? "rgba(201,169,110,0.1)" : "#161616",
            color: filter === f ? "#c9a96e" : "#777", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font-outfit)", textTransform: "capitalize",
          }}>
            {f === "toate" ? "Toate" : statusConfig[f]?.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.2fr", padding: "12px 20px", borderBottom: "1px solid #262626", fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <div>Client</div>
          <div>Serviciu</div>
          <div>Data</div>
          <div>Ora</div>
          <div>Preț</div>
          <div>Status</div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#777", fontSize: 13 }}>
            Nicio rezervare {filter !== "toate" ? `cu statusul "${statusConfig[filter]?.label}"` : ""}.
          </div>
        ) : (
          filtered.map((b: any, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.2fr", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #1e1e1e" : "none", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#1a1a1a"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {b.client?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{b.client?.name || "Client"}</div>
                  <div style={{ fontSize: 11, color: "#777" }}>{b.client?.email}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#f0ede8" }}>{b.service?.name || "—"}</div>
              <div style={{ fontSize: 13, color: "#777" }}>{b.date || "—"}</div>
              <div style={{ fontSize: 13, color: "#777" }}>{b.time || "—"}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e8c987" }}>{b.totalPrice ? `${b.totalPrice} lei` : "—"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg || "rgba(201,169,110,0.15)", color: statusConfig[b.status]?.color || "#c9a96e" }}>
                  {statusConfig[b.status]?.label || b.status}
                </span>
                {b.status === "pending" && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(76,175,130,0.15)", border: "1px solid rgba(76,175,130,0.3)", color: "#4caf82", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✓</button>
                    <button style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(224,90,90,0.15)", border: "1px solid rgba(224,90,90,0.3)", color: "#e05a5a", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✕</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}