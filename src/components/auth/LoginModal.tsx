"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare la autentificare");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)", zIndex: 998, animation: "fadeIn 0.2s both",
      }} />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 999, width: "100%", maxWidth: 460,
        background: "#0f0e0b",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: 20,
        padding: "48px 44px",
        animation: "modalUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        {/* Glow */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "radial-gradient(ellipse at top, rgba(201,168,76,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20,
          background: "none", border: "none", color: "#7A7060",
          fontSize: "1.4rem", cursor: "pointer", lineHeight: 1,
          transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#F2ECD8"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#7A7060"}>
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36, position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#C9A84C", marginBottom: 8 }}>
            Aitimp<sup style={{ fontSize: "0.5rem", color: "#7A7060", verticalAlign: "super" }}>.ro</sup>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, marginBottom: 8 }}>
            Bine ai revenit
          </h2>
          <p style={{ color: "#7A7060", fontSize: "0.88rem" }}>Intră în contul tău</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
          {error && (
            <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#ff6b6b", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A7060", marginBottom: 8 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="adresa@email.com"
              style={{ width: "100%", background: "#181510", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "14px 16px", color: "#F2ECD8", fontSize: "0.95rem", outline: "none", transition: "border-color 0.3s" }}
              onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.6)"}
              onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)"}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A7060", marginBottom: 8 }}>Parolă</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: "100%", background: "#181510", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "14px 16px", color: "#F2ECD8", fontSize: "0.95rem", outline: "none", transition: "border-color 0.3s" }}
              onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.6)"}
              onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)"}
            />
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginBottom: 28 }}>
            <Link href="/reset-password" onClick={onClose} style={{ color: "#7A7060", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#7A7060"}>
              Ai uitat parola?
            </Link>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", background: "#C9A84C", color: "#090806",
            border: "none", borderRadius: 10, padding: "15px",
            fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, transition: "all 0.3s",
          }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "none"}>
            {loading ? "Se încarcă..." : "Intră în cont"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0", position: "relative", zIndex: 1 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(201,168,76,0.15)" }} />
          <span style={{ color: "#5A5040", fontSize: "0.78rem" }}>sau</span>
          <div style={{ flex: 1, height: 1, background: "rgba(201,168,76,0.15)" }} />
        </div>

        {/* Register */}
        <p style={{ textAlign: "center", color: "#7A7060", fontSize: "0.88rem", position: "relative", zIndex: 1 }}>
          Nu ai cont?{" "}
          <Link href="/register" onClick={onClose} style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 600 }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"}>
            Înregistrează-te gratuit
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes modalUp { from{opacity:0;transform:translate(-50%,-48%)} to{opacity:1;transform:translate(-50%,-50%)} }
      `}</style>
    </>
  );
}