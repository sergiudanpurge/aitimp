"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useResponsive } from "@/hooks/useResponsive";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ rezervareNoua: true, rezervareAnulata: true, reminder: true, review: false });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isMobile } = useResponsive();

  const inputStyle = { width: "100%", padding: "11px 14px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 7 };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) { setError("Parolele nu coincid!"); return; }
    if (passwords.new.length < 8) { setError("Parola trebuie să aibă minim 8 caractere!"); return; }
    setLoading(true); setError(""); setMsg("");
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
    });
    const data = await res.json();
    if (res.ok) { setMsg("Parola schimbată cu succes!"); setPasswords({ current: "", new: "", confirm: "" }); }
    else setError(data.error);
    setLoading(false);
    setTimeout(() => { setMsg(""); setError(""); }, 3000);
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: active ? "rgba(201,169,110,0.2)" : "#1e1e1e", border: `1px solid ${active ? "rgba(201,169,110,0.4)" : "#262626"}`, display: "flex", alignItems: "center", padding: "0 4px", cursor: "pointer", justifyContent: active ? "flex-end" : "flex-start", transition: "all .2s", flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: active ? "#c9a96e" : "#444", transition: "background .2s" }} />
    </div>
  );

  return (
    <DashboardLayout title="Setări">
      <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Schimba parola */}
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: isMobile ? 18 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Schimbă parola</div>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>Recomandăm o parolă puternică de minim 8 caractere</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { key: "current", label: "Parola curentă", ph: "Parola actuală" },
              { key: "new", label: "Parolă nouă", ph: "Minim 8 caractere" },
              { key: "confirm", label: "Confirmă parola nouă", ph: "Repetă parola" },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type="password" value={(passwords as any)[f.key]} onChange={e => setPasswords({ ...passwords, [f.key]: e.target.value })} placeholder={f.ph} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
              </div>
            ))}
          </div>
          {error && <div style={{ marginTop: 14, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 8, padding: "10px 14px", color: "#e05a5a", fontSize: 13 }}>{error}</div>}
          {msg && <div style={{ marginTop: 14, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, padding: "10px 14px", color: "#4caf82", fontSize: 13 }}>{msg}</div>}
          <button onClick={changePassword} disabled={loading} style={{ marginTop: 18, width: isMobile ? "100%" : "auto", padding: "11px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "var(--font-outfit)" }}>
            {loading ? "Se schimbă..." : "Schimbă parola"}
          </button>
        </div>

        {/* Notificari */}
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: isMobile ? 18 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Notificări email</div>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>Alege ce notificări vrei să primești</div>
          {[
            { key: "rezervareNoua", label: "Rezervare nouă", desc: "Când un client face o rezervare" },
            { key: "rezervareAnulata", label: "Rezervare anulată", desc: "Când un client anulează o rezervare" },
            { key: "reminder", label: "Reminder rezervare", desc: "Cu o zi înainte de rezervare" },
            { key: "review", label: "Review nou", desc: "Când primești o recenzie nouă" },
          ].map((n, i) => (
            <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < 3 ? "1px solid #1e1e1e" : "none", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{n.desc}</div>
              </div>
              <Toggle active={(notifications as any)[n.key]} onToggle={() => setNotifications({ ...notifications, [n.key]: !(notifications as any)[n.key] })} />
            </div>
          ))}
        </div>

        {/* Cont */}
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: isMobile ? 18 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Cont</div>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>Gestionează sesiunea și accesul</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
              style={{ padding: "10px 20px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 10, color: "#777", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Deconectare
            </button>
          </div>
        </div>

        {/* Zona periculoasa */}
        <div style={{ background: "#161616", border: "1px solid rgba(224,90,90,0.2)", borderRadius: 14, padding: isMobile ? 18 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4, color: "#e05a5a" }}>Zonă periculoasă</div>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>Acțiuni ireversibile pentru contul tău</div>
          <button style={{ padding: "10px 20px", background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 10, color: "#e05a5a", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", width: isMobile ? "100%" : "auto" }}>
            Șterge contul
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}