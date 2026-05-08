"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useResponsive } from "@/hooks/useResponsive";

const mockReviews = [
  { name: "Radu M.", rating: 5, text: "Serviciu excelent, Mirel e foarte profesionist!", service: "Tuns + Styling", date: "28 Apr 2025", avatar: "R" },
  { name: "Elena K.", rating: 4, text: "Foarte mulțumită de rezultat. Revin cu siguranță!", service: "Vopsit complet", date: "25 Apr 2025", avatar: "E" },
  { name: "Andrei P.", rating: 5, text: "Cel mai bun salon din oraș. Recomand!", service: "Tuns + Spălat", date: "20 Apr 2025", avatar: "A" },
  { name: "Maria D.", rating: 3, text: "Ok, dar așteptarea a fost cam lungă.", service: "Coafat ocazie", date: "15 Apr 2025", avatar: "M" },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState("toate");
  const { isMobile } = useResponsive();

  const avg = mockReviews.reduce((a, r) => a + r.rating, 0) / mockReviews.length;
  const stars = [5, 4, 3, 2, 1];

  return (
    <DashboardLayout title="Recenzii">

      {/* Overview */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "auto 1fr", gap: 20 }}>
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: isMobile ? "20px" : "28px 36px", textAlign: "center", minWidth: isMobile ? "auto" : 160 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 40 : 52, fontWeight: 700, color: "#c9a96e", lineHeight: 1 }}>{avg.toFixed(1)}</div>
          <div style={{ color: "#e8b84b", fontSize: 20, margin: "8px 0" }}>{"★".repeat(Math.round(avg))}</div>
          <div style={{ fontSize: 12, color: "#777" }}>{mockReviews.length} recenzii</div>
        </div>

        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
          {stars.map(s => {
            const count = mockReviews.filter(r => r.rating === s).length;
            const pct = (count / mockReviews.length) * 100;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 12, color: "#777", width: 20, textAlign: "right" }}>{s}★</div>
                <div style={{ flex: 1, height: 6, background: "#262626", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg,#c9a96e,#e8c987)", borderRadius: 3, width: `${pct}%`, transition: "width 0.5s" }} />
                </div>
                <div style={{ fontSize: 12, color: "#777", width: 20 }}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["toate", "5", "4", "3", "2", "1"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${filter === f ? "#c9a96e" : "#262626"}`, background: filter === f ? "rgba(201,169,110,0.1)" : "#161616", color: filter === f ? "#c9a96e" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
            {f === "toate" ? "Toate" : `${f} ★`}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mockReviews.filter(r => filter === "toate" || r.rating === parseInt(filter)).map((r, i) => (
          <div key={i} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: isMobile ? "14px 16px" : "20px 24px", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#262626"}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "var(--font-playfair)" }}>
                {r.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", marginBottom: 6, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 4 : 0 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</span>
                    <span style={{ fontSize: 11, color: "#777", marginLeft: 8 }}>· {r.service}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#e8b84b", fontSize: 12 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <span style={{ fontSize: 11, color: "#777" }}>{r.date}</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#a0a0a0", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>"{r.text}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}