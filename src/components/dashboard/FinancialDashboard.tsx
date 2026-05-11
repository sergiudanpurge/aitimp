"use client";

import { useState, useEffect } from "react";
import { useResponsive } from "@/hooks/useResponsive";

interface Booking {
  id: string;
  status: string;
  totalPrice: number;
  date: string;
  time?: string;
  service?: { name: string; icon?: string };
  client?: { name: string };
  provider?: { user?: { name: string } };
  employee?: { name: string };
  createdAt?: string;
}

interface Props {
  bookings: Booking[];
  services: any[];
  userId?: string;
}

export default function FinancialDashboard({ bookings, services, userId }: Props) {
  const { isMobile } = useResponsive();
  const [period, setPeriod] = useState<"zi" | "sapt" | "luna">("sapt");
  const [histFilter, setHistFilter] = useState("toate");
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", yellow: "#e8b84b", red: "#e05a5a", blue: "#5a8de0",
  };

  const completed = bookings.filter(b => b.status === "completed");
  const pending = bookings.filter(b => b.status === "pending");
  const cancelled = bookings.filter(b => b.status === "cancelled");

  const totalIncasat = completed.reduce((a, b) => a + (b.totalPrice || 0), 0);
  const ticketMediu = completed.length > 0 ? Math.round(totalIncasat / completed.length) : 0;
  const rataConversie = bookings.length > 0 ? Math.round((completed.length / bookings.length) * 100) : 0;

  // Top clienti
  const clientMap: Record<string, { name: string; rez: number; suma: number; conf: number; anul: number; history: Booking[] }> = {};
  bookings.forEach(b => {
    const name = b.client?.name || "Client";
    if (!clientMap[name]) clientMap[name] = { name, rez: 0, suma: 0, conf: 0, anul: 0, history: [] };
    clientMap[name].rez++;
    clientMap[name].history.push(b);
    if (b.status === "completed") { clientMap[name].suma += b.totalPrice || 0; clientMap[name].conf++; }
    if (b.status === "cancelled") clientMap[name].anul++;
  });
  const topClienti = Object.values(clientMap).sort((a, b) => b.suma - a.suma).slice(0, 5);
  const maxSuma = topClienti[0]?.suma || 1;

  // Top servicii
  const svcMap: Record<string, number> = {};
  completed.forEach(b => { const n = b.service?.name || "Serviciu"; svcMap[n] = (svcMap[n] || 0) + 1; });
  const topSvc = Object.entries(svcMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSvc = topSvc[0]?.[1] || 1;

  const svcColors = [s.accent, s.green, s.blue, s.yellow, s.red];

  // Grafic venituri mock per period
  const chartData: Record<string, { labels: string[]; values: number[] }> = {
    zi: { labels: ["8:00","10:00","12:00","14:00","16:00","18:00"], values: [0, 90, 45, 120, 90, 0] },
    sapt: { labels: ["Lun","Mar","Mie","Joi","Vin","Sâm","Dum"], values: [180, 240, 90, 320, 210, 0, 200] },
    luna: { labels: ["S1","S2","S3","S4"], values: [480, 620, 390, 750] },
  };
  const chart = chartData[period];
  const maxVal = Math.max(...chart.values) || 1;

  const periodLabel = { zi: "azi", sapt: "ultima săptămână", luna: "luna curentă" };

  const filteredHist = histFilter === "toate" ? bookings : bookings.filter(b => b.status === histFilter);

  const statusLabel: Record<string, string> = { completed: "Finalizat", pending: "Așteptare", cancelled: "Anulat", accepted: "Confirmat" };
  const statusColor: Record<string, string> = { completed: s.green, pending: s.yellow, cancelled: s.red, accepted: s.green };
  const statusBg: Record<string, string> = { completed: "rgba(76,175,130,0.15)", pending: "rgba(232,184,75,0.15)", cancelled: "rgba(224,90,90,0.15)", accepted: "rgba(76,175,130,0.15)" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
        {[
          [totalIncasat + " lei", "Încasat total", s.accent],
          [completed.length.toString(), "Finalizate", s.green],
          [ticketMediu + " lei", "Ticket mediu", s.blue],
          [rataConversie + "%", "Rată conversie", s.yellow],
        ].map(([val, label, color]) => (
          <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: isMobile ? "12px" : "14px 16px" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* INSIGHTS */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
        {[
          { icon: "🏆", label: "Cea mai bună zi", val: "Joi", sub: "3 servicii", color: s.green },
          { icon: "⭐", label: "Serviciu top", val: topSvc[0]?.[0] || "—", sub: `${topSvc[0]?.[1] || 0} rezervări`, color: s.accent },
          { icon: "🔄", label: "Rată retenție", val: "68%", sub: "clienți revin", color: s.blue },
          { icon: "⏰", label: "Ora de vârf", val: "10-12", sub: "42% din rezervări", color: s.yellow },
        ].map(item => (
          <div key={item.label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: "12px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: 10, color: item.color, fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{item.val}</div>
              <div style={{ fontSize: 10, color: s.muted }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* GRAFIC VENITURI */}
      <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 14 : 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Venituri — {periodLabel[period]}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["zi", "sapt", "luna"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${period === p ? s.accent : s.border}`, background: period === p ? "rgba(201,169,110,0.1)" : "transparent", color: period === p ? s.accent : s.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                {p === "zi" ? "Zi" : p === "sapt" ? "Săptămână" : "Lună"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: isMobile ? 4 : 8, height: 120 }}>
          {chart.labels.map((label, i) => (
            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 9, color: s.accent, fontWeight: 600 }}>{chart.values[i] > 0 ? chart.values[i] + " lei" : ""}</div>
              <div style={{ width: "100%", height: Math.max((chart.values[i] / maxVal) * 80, 2), background: chart.values[i] > 0 ? "rgba(201,169,110,0.6)" : s.surface2, borderRadius: "4px 4px 0 0", border: `1px solid ${chart.values[i] > 0 ? s.accent : s.border}`, transition: "height 0.3s" }} />
              <div style={{ fontSize: 9, color: s.muted, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP CLIENTI + TOP SERVICII */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 14 : 18 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Top clienți</div>
          {topClienti.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: s.muted, fontSize: 13 }}>Niciun client încă</div>
          ) : topClienti.map((c, i) => (
            <div key={c.name} onClick={() => setSelectedClient(c)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", borderRadius: 8, cursor: "pointer", marginBottom: 4, transition: "background .15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.05)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.name.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                <div style={{ fontSize: 10, color: s.muted }}>{c.rez} rez · {c.suma} lei</div>
              </div>
              <div style={{ width: 60, height: 4, background: s.border, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: s.accent, borderRadius: 2, width: `${(c.suma / maxSuma) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 14 : 18 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Top servicii</div>
          {topSvc.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: s.muted, fontSize: 13 }}>Niciun serviciu finalizat</div>
          ) : topSvc.map(([name, count], i) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: svcColors[i], flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                  <div style={{ fontSize: 11, color: svcColors[i], fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{count}x</div>
                </div>
                <div style={{ height: 4, background: s.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: svcColors[i], borderRadius: 2, width: `${(count / maxSvc) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ISTORIC */}
      <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 14 : 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Istoric servicii</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {["toate","completed","pending","cancelled"].map(f => (
              <button key={f} onClick={() => setHistFilter(f)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${histFilter === f ? s.accent : s.border}`, background: histFilter === f ? "rgba(201,169,110,0.1)" : "transparent", color: histFilter === f ? s.accent : s.muted, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                {f === "toate" ? "Toate" : f === "completed" ? "Finalizate" : f === "pending" ? "Așteptare" : "Anulate"}
              </button>
            ))}
          </div>
        </div>
        {filteredHist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: s.muted, fontSize: 13 }}>Niciun rezultat</div>
        ) : filteredHist.map((b, i) => (
          <div key={i} onClick={() => { const name = b.client?.name || "Client"; const c = clientMap[name]; if (c) setSelectedClient(c); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 8, cursor: "pointer", borderBottom: i < filteredHist.length - 1 ? `1px solid ${s.surface2}` : "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.04)"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}>
            <div style={{ width: 3, height: 36, borderRadius: 2, background: statusColor[b.status] || s.muted, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name || "Serviciu"}</div>
              <div style={{ fontSize: 11, color: s.muted }}>{b.client?.name || "Client"} · {b.date}</div>
            </div>
            <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, fontWeight: 700, background: statusBg[b.status] || "rgba(201,169,110,0.15)", color: statusColor[b.status] || s.accent, flexShrink: 0 }}>
              {statusLabel[b.status] || b.status}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, flexShrink: 0, minWidth: 55, textAlign: "right" }}>{b.totalPrice} lei</div>
          </div>
        ))}
      </div>

      {/* FISA CLIENT MODAL */}
      {selectedClient && (
        <div onClick={() => setSelectedClient(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#111", border: `1px solid ${s.border}`, borderRadius: 16, padding: 24, width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{selectedClient.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 700 }}>{selectedClient.name}</div>
                <div style={{ fontSize: 12, color: s.muted }}>Client din 2025</div>
              </div>
              <button onClick={() => setSelectedClient(null)} style={{ background: "none", border: "none", color: s.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
              {[[selectedClient.rez.toString(),"Rezervări",s.accent],[selectedClient.conf.toString(),"Confirmate",s.green],[selectedClient.anul.toString(),"Anulate",s.red],[selectedClient.suma + " lei","Total",s.blue]].map(([v,l,c]) => (
                <div key={l} style={{ background: s.surface2, borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
                  <div style={{ fontSize: 9, color: s.muted, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 10 }}>Istoric interacțiuni</div>
            {selectedClient.history.map((b: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < selectedClient.history.length - 1 ? `1px solid ${s.surface2}` : "none" }}>
                <div style={{ width: 3, borderRadius: 2, flexShrink: 0, background: statusColor[b.status] || s.muted }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{b.service?.name || "Serviciu"}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: s.accent }}>{b.totalPrice} lei</div>
                  </div>
                  <div style={{ fontSize: 10, color: s.muted, marginBottom: 3 }}>{b.date} {b.time && `· ${b.time}`}</div>
                  <div style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 700, background: statusBg[b.status] || "rgba(201,169,110,0.15)", color: statusColor[b.status] || s.accent, display: "inline-block" }}>
                    {statusLabel[b.status] || b.status}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${s.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: s.muted, marginBottom: 8 }}>Trimite mesaj</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Scrie un mesaj..." style={{ flex: 1, padding: "10px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 9, color: "#f0ede8", fontSize: 13, outline: "none" }}
                  onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                <button style={{ padding: "10px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>➤</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}