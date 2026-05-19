"use client";
import { useState } from "react";

const ACCENT_COLORS = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
const SQ_COLORS = [["#c9a96e","#8b5e3c","#5a3a20"],["#5a8de0","#3a6abf","#1a4a9e"],["#4caf82","#2a8f62","#0a6f42"],["#e8b84b","#c9902a","#a06810"],["#e05a5a","#c03a3a","#a02020"],["#a78de0","#7a5abf","#5a3a9e"]];

const s = {
  surface: "#111111", surface2: "#1a1a1a", border: "#1e1e1e",
  accent: "#c9a96e", muted: "#555555", green: "#4caf82",
  yellow: "#e8b84b", red: "#e05a5a", blue: "#5a8de0",
};

interface Service {
  id: string; name: string; description?: string; duration: number;
  price: number; icon?: string; isActive?: boolean; gallery?: string[];
  _ownerName?: string; _owner?: string;
}

interface Props {
  service: Service;
  index: number;
  onEdit?: (svc: Service) => void;
  onToggleActive?: (svc: Service) => void;
  onDelete?: (svc: Service) => void;
  showOwner?: boolean;
}

export default function ServiceCard({ service: svc, index: idx, onEdit, onToggleActive, onDelete, showOwner = false }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
  const sq = SQ_COLORS[idx % SQ_COLORS.length];
  const galleryImg = svc.gallery?.[0];
  const isActive = svc.isActive !== false;

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    setLoading("delete");
    try {
      await fetch("/api/services", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: svc.id }) });
      onDelete?.(svc);
    } finally { setLoading(null); setConfirmDelete(false); }
  };

  const handleToggle = async () => {
    setLoading("toggle");
    try {
      await fetch("/api/services", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: svc.id, isActive: !isActive }) });
      onToggleActive?.(svc);
    } finally { setLoading(null); }
  };

  return (
    <div style={{ background: s.surface, border: `1px solid ${isActive ? s.border : "rgba(224,90,90,0.2)"}`, borderRadius: 12, overflow: "hidden", display: "flex", minHeight: 110, transition: "all .22s", opacity: isActive ? 1 : 0.75 }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = isActive ? "rgba(201,169,110,0.5)" : "rgba(224,90,90,0.4)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = isActive ? s.border : "rgba(224,90,90,0.2)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>

      {/* THUMBNAIL */}
      <div style={{ width: 110, flexShrink: 0, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 6, padding: 12, position: "relative", overflow: "hidden" }}>
        {galleryImg
          ? <img src={galleryImg} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          : sq.map((c: string, i: number) => <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: c, opacity: 1 - i * 0.25, flexShrink: 0 }} />)
        }
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
        {svc.icon && <div style={{ position: "absolute", bottom: 6, right: 6, fontSize: 16, background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "2px 4px" }}>{svc.icon}</div>}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{svc.name}</div>
            {showOwner && svc._ownerName && (
              <div style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, background: svc._owner === "company" ? "rgba(201,169,110,0.1)" : "rgba(90,141,224,0.1)", color: svc._owner === "company" ? s.accent : s.blue, flexShrink: 0, fontWeight: 600 }}>
                {svc._owner === "company" ? "🏢" : "👤"} {svc._ownerName}
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 3 }}>
            {svc.description || "Fara descriere"}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <div style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: isActive ? "rgba(76,175,130,0.15)" : "rgba(224,90,90,0.1)", color: isActive ? s.green : s.red }}>
              ● {isActive ? "Activ" : "Inactiv"}
            </div>
            <div style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600, background: "rgba(201,169,110,0.1)", color: s.accent }}>
              ⏱ {svc.duration * 30} min
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: s.accent }}>{svc.price} lei</span>
            <div style={{ display: "flex", gap: 4 }}>
              {onEdit && (
                <button onClick={() => onEdit(svc)} style={{ padding: "4px 10px", borderRadius: 7, background: s.surface2, color: "#f0ede8", border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✏️ Edit</button>
              )}
              {onToggleActive && (
                <button onClick={handleToggle} disabled={loading === "toggle"} style={{ padding: "4px 10px", borderRadius: 7, background: isActive ? "rgba(232,184,75,0.1)" : "rgba(76,175,130,0.1)", color: isActive ? s.yellow : s.green, border: `1px solid ${isActive ? "rgba(232,184,75,0.3)" : "rgba(76,175,130,0.3)"}`, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  {loading === "toggle" ? "..." : isActive ? "⏸ Dezact." : "▶ Activ."}
                </button>
              )}
              {onDelete && (
                <button onClick={handleDelete} disabled={loading === "delete"} style={{ padding: "4px 10px", borderRadius: 7, background: confirmDelete ? "rgba(224,90,90,0.2)" : "rgba(224,90,90,0.08)", color: s.red, border: "1px solid rgba(224,90,90,0.3)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  {loading === "delete" ? "..." : confirmDelete ? "Confirm?" : "🗑 Șterge"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}