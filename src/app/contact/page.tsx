"use client";

import { useState } from "react";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const { isMobile } = useResponsive();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", background: s.surface2,
    border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8",
    fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)",
    boxSizing: "border-box" as const,
  };

  const submit = (e: any) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px" : "48px 32px" }}>

        <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: s.accent, marginBottom: 12 }}>— Contact —</div>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 28 : 40, fontWeight: 700, marginBottom: 14 }}>Hai să vorbim</div>
          <div style={{ fontSize: 14, color: s.muted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Ai o întrebare sau o problemă? Scrie-ne și îți răspundem în cel mult 24 de ore.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: 24 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "📧", label: "Email", val: "contact@aitimp.ro" },
              { icon: "📍", label: "Locație", val: "România" },
              { icon: "⏰", label: "Program suport", val: "Lun-Vin · 09:00 - 18:00" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.val}</div>
                </div>
              </div>
            ))}

            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, marginTop: 4 }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Întrebări frecvente</div>
              {[
                { q: "Cum fac o rezervare?", a: "Caută un prestator, selectează serviciul și alege data dorită." },
                { q: "Este gratuit să mă înregistrez?", a: "Da! Înregistrarea este complet gratuită pentru toți utilizatorii." },
                { q: "Pot anula o rezervare?", a: "Da, poți anula oricând din profilul tău. Ambele părți vor fi notificate." },
                { q: "Cum devin prestator?", a: "Înregistrează-te și activează modul Prestator din profil." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "10px 0", borderBottom: i < 3 ? `1px solid ${s.surface2}` : "none" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.accent, marginBottom: 4 }}>{item.q}</div>
                  <div style={{ fontSize: 12, color: s.muted, lineHeight: 1.6 }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 20 : 28 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Mesaj trimis!</div>
                <div style={{ fontSize: 14, color: s.muted, marginBottom: 24 }}>Îți vom răspunde în cel mult 24 de ore.</div>
                <button onClick={() => setSent(false)} style={{ padding: "10px 24px", background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`, borderRadius: 9, fontSize: 13, color: s.accent, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Trimite un mesaj</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Nume</div>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Numele tău" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Email</div>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@exemplu.ro" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Subiect</div>
                  <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Despre ce este vorba?" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Mesaj</div>
                  <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Descrie problema sau întrebarea ta..." rows={5} style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                </div>
                <button type="submit" style={{ padding: "13px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Trimite mesajul →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}