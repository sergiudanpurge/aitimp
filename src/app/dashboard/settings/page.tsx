"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <DashboardLayout title="Setări">
      <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Schimba parola */}
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Schimbă parola</div>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 24 }}>Recomandăm o parolă puternică de minim 8 caractere</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

          {error && <div style={{ marginTop: 16, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 8, padding: "10px 14px", color: "#e05a5a", fontSize: 13 }}>{error}</div>}
          {msg && <div style={{ marginTop: 16, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, padding: "10px 14px", color: "#4caf82", fontSize: 13 }}>{msg}</div>}

          <button onClick={changePassword} disabled={loading} style={{ marginTop: 20, padding: "11px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "var(--font-outfit)" }}>
            {loading ? "Se schimbă..." : "Schimbă parola"}
          </button>
        </div>

        {/* Notificari */}
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Notificări</div>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 24 }}>Alege ce notificări vrei să primești pe email</div>

          {[
            { label: "Rezervare nouă", desc: "Când un client face o rezervare" },
            { label: "Rezervare anulată", desc: "Când un client anulează o rezervare" },
            { label: "Reminder rezervare", desc: "Cu o zi înainte de rezervare" },
            { label: "Review nou", desc: "Când primești o recenzie nouă" },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 3 ? "1px solid #1e1e1e" : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</div>
                <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{n.desc}</div>
              </div>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: "rgba(201,169,110,0.2)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", padding: "0 4px", cursor: "pointer", justifyContent: "flex-end" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#c9a96e" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Zona periculoasa */}
        <div style={{ background: "#161616", border: "1px solid rgba(224,90,90,0.2)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4, color: "#e05a5a" }}>Zonă periculoasă</div>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>Acțiuni ireversibile pentru contul tău</div>
          <button style={{ padding: "10px 20px", background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 10, color: "#e05a5a", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
            Șterge contul
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}