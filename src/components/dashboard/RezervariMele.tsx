"use client";
import { useState } from "react";

const STATUS_MAP: Record<string, {label:string;color:string;bg:string;border:string}> = {
  pending: { label: "In asteptare", color: "#e8b84b", bg: "rgba(232,184,75,0.15)", border: "rgba(232,184,75,0.3)" },
  accepted: { label: "Confirmat", color: "#4caf82", bg: "rgba(76,175,130,0.15)", border: "rgba(76,175,130,0.3)" },
  completed: { label: "Finalizat", color: "#c9a96e", bg: "rgba(201,169,110,0.15)", border: "rgba(201,169,110,0.3)" },
  cancelled: { label: "Anulat", color: "#e05a5a", bg: "rgba(224,90,90,0.15)", border: "rgba(224,90,90,0.3)" },
};

interface Booking {
  id: string; date: string; time?: string; status: string; totalPrice: number;
  service?: { name: string; icon?: string };
  provider?: { user?: { name: string } };
  client?: { name: string };
}

interface Props {
  bookings?: Booking[];
  mockBookings?: Booking[];
  showProvider?: boolean;
}

export default function RezervariMele({ bookings = [], mockBookings = [], showProvider = true }: Props) {
  const [filter, setFilter] = useState("toate");
  const [search, setSearch] = useState("");

  const s = { surface: "#111111", surface2: "#1a1a1a", border: "#1e1e1e", accent: "#c9a96e", muted: "#555555", green: "#4caf82", yellow: "#e8b84b", red: "#e05a5a", blue: "#5a8de0" };

  const all: Booking[] = [
    ...bookings.map(b => ({...b, date: (b.date || "").substring(0, 10)})),
    ...mockBookings
  ];

  const totalCheltuit = all.filter(b => b.status === "completed").reduce((a, b) => a + (b.totalPrice || 0), 0);

  const filtered = all
    .filter(b => filter === "toate" || b.status === filter)
    .filter(b => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (b.service?.name || "").toLowerCase().includes(q) || (b.provider?.user?.name || "").toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {([
          [all.length.toString(), "Total", s.accent],
          [all.filter(b=>b.status==="accepted").length.toString(), "Confirmate", s.green],
          [all.filter(b=>b.status==="pending").length.toString(), "Asteptare", s.yellow],
          [totalCheltuit + " lei", "Cheltuit", s.blue],
        ] as [string,string,string][]).map(([val, label, color]) => (
          <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cauta serviciu sau prestator..."
          style={{ flex: 1, minWidth: 200, padding: "9px 14px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {([["toate","Toate"],["accepted","Confirmate"],["pending","Asteptare"],["completed","Finalizate"],["cancelled","Anulate"]] as [string,string][]).map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${filter===val ? s.accent : s.border}`, background: filter===val ? "rgba(201,169,110,0.1)" : s.surface, color: filter===val ? s.accent : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: s.muted }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Nicio rezervare</div>
            <div style={{ fontSize: 13 }}>Incearca alt filtru</div>
          </div>
        ) : filtered.map((b, i) => {
          const st = STATUS_MAP[b.status] || STATUS_MAP.pending;
          const dateObj = new Date(b.date);
          const isUpcoming = dateObj >= new Date() && b.status !== "cancelled" && b.status !== "completed";
          return (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < filtered.length-1 ? `1px solid ${s.surface2}` : "none", flexWrap: "wrap" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {b.service?.icon || "📅"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name || "Serviciu"}</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {showProvider && b.provider?.user?.name && <span style={{ fontSize: 12, color: s.muted }}>👤 {b.provider.user.name}</span>}
                  <span style={{ fontSize: 12, color: s.muted }}>📅 {dateObj.toLocaleDateString("ro-RO", {day:"numeric",month:"short",year:"numeric"})}</span>
                  {b.time && <span style={{ fontSize: 12, color: s.muted }}>⏰ {b.time}</span>}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <div style={{ fontSize: 10, padding: "3px 10px", borderRadius: 6, fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</div>
                {b.totalPrice > 0 && <div style={{ fontSize: 14, fontWeight: 700, color: s.accent }}>{b.totalPrice} lei</div>}
                {isUpcoming && (b.status === "pending" || b.status === "accepted") && (
                  <button style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", width: "100%" }}>Anuleaza</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}