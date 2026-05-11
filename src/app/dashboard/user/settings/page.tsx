"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

export default function UserSettingsPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ rezervareNoua: true, reminder: true, review: false });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", red: "#e05a5a",
  };

  const inputStyle = { width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const };

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      setUser(d.user);
    });
  }, []);

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) { setError("Parolele nu coincid!"); return; }
    if (passwords.new.length < 8) { setError("Parola trebuie să aibă minim 8 caractere!"); return; }
    setLoading(true); setError(""); setMsg("");
    const res = await fetch("/api/auth/change-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
    });
    const data = await res.json();
    if (res.ok) { setMsg("Parola schimbată cu succes!"); setPasswords({ current: "", new: "", confirm: "" }); }
    else setError(data.error);
    setLoading(false);
    setTimeout(() => { setMsg(""); setError(""); }, 3000);
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: active ? "rgba(201,169,110,0.2)" : s.surface2, border: `1px solid ${active ? "rgba(201,169,110,0.4)" : s.border}`, display: "flex", alignItems: "center", padding: "0 4px", cursor: "pointer", justifyContent: active ? "flex-end" : "flex-start", transition: "all .2s", flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: active ? s.accent : "#444", transition: "background .2s" }} />
    </div>
  );

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", paddingBottom: isMobile ? 70 : 0 }}>
      <div style={{ height: 56, background: "rgba(10,10,10,0.9)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", padding: isMobile ? "0 16px" : "0 28px", position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(12px)" }}>
        <Link href="/dashboard/user" style={{ fontSize: 20, textDecoration: "none", color: s.muted, marginRight: 12 }}>←</Link>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>Setări</div>
      </div>
      <div style={{ padding: isMobile ? 16 : 28, maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Schimbă parola</div>
          <div style={{ fontSize: 13, color: s.muted, marginBottom: 18 }}>Minim 8 caractere</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["current","Parola curentă","Parola actuală"],["new","Parolă nouă","Minim 8 caractere"],["confirm","Confirmă parola","Repetă parola"]].map(([k,l,p]) => (
              <div key={k}>
                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>{l}</div>
                <input type="password" value={(passwords as any)[k]} onChange={e => setPasswords({ ...passwords, [k]: e.target.value })} placeholder={p} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
              </div>
            ))}
          </div>
          {error && <div style={{ marginTop: 12, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 8, padding: "10px 14px", color: s.red, fontSize: 13 }}>{error}</div>}
          {msg && <div style={{ marginTop: 12, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, padding: "10px 14px", color: s.green, fontSize: 13 }}>{msg}</div>}
          <button onClick={changePassword} disabled={loading} style={{ marginTop: 16, width: isMobile ? "100%" : "auto", padding: "11px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Se schimbă..." : "Schimbă parola"}
          </button>
        </div>

        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Notificări email</div>
          {[["rezervareNoua","Rezervare nouă","Când cineva face o rezervare la tine"],["reminder","Reminder","Cu o zi și o oră înainte"],["review","Review nou","Când primești o recenzie"]].map(([k,l,d],i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${s.surface2}` : "none", gap: 12 }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{l}</div><div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>{d}</div></div>
              <Toggle active={(notifications as any)[k]} onToggle={() => setNotifications({ ...notifications, [k]: !(notifications as any)[k] })} />
            </div>
          ))}
        </div>

        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Cont</div>
          <div style={{ fontSize: 13, color: s.muted, marginBottom: 16 }}>Gestionează sesiunea</div>
          <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
            style={{ padding: "10px 20px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", width: isMobile ? "100%" : "auto" }}>
            Deconectare
          </button>
        </div>

        <div style={{ background: s.surface, border: "1px solid rgba(224,90,90,0.2)", borderRadius: 14, padding: isMobile ? 18 : 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4, color: s.red }}>Zonă periculoasă</div>
          <div style={{ fontSize: 13, color: s.muted, marginBottom: 16 }}>Acțiuni ireversibile</div>
          <button style={{ padding: "10px 20px", background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 10, color: s.red, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", width: isMobile ? "100%" : "auto" }}>
            Șterge contul
          </button>
        </div>
      </div>
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#111", borderTop: `1px solid ${s.border}`, display: "flex", zIndex: 100 }}>
          {[["🏠","Profil","/dashboard/user"],["📅","Rezervări","/dashboard/user/bookings"],["💬","Mesaje","/dashboard/user/messages"],["✂️","Servicii","/dashboard/user/services"],["⚙️","Setări","/dashboard/user/settings"]].map(([i,l,h]) => (
            <a key={h} href={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: h === "/dashboard/user/settings" ? s.accent : s.muted, fontSize: 9, textDecoration: "none" }}>
              <div style={{ fontSize: 18 }}>{i}</div>{l}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}