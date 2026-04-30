"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare");
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#090806", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", overflow: "hidden" }}>
      
      {/* Grid bg */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.035) 1px,transparent 1px)", backgroundSize: "60px 60px", WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 100%)" }} />
      
      {/* Glow */}
      <div style={{ position: "absolute", width: 600, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 2 }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", fontWeight: 700, color: "#C9A84C", textDecoration: "none" }}>
            Aitimp<sup style={{ fontSize: "0.5rem", color: "#7A7060", verticalAlign: "super" }}>.ro</sup>
          </Link>
        </div>

        <div style={{ background: "#0f0e0b", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "48px 44px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "radial-gradient(ellipse at top, rgba(201,168,76,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

          {!sent ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 36, position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔑</div>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.7rem", fontWeight: 700, marginBottom: 10 }}>
                  Resetează parola
                </h1>
                <p style={{ color: "#7A7060", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  Introdu adresa de email și îți trimitem un link de resetare.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
                {error && (
                  <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#ff6b6b", fontSize: "0.85rem" }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A7060", marginBottom: 8 }}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="adresa@email.com"
                    style={{ width: "100%", background: "#181510", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "14px 16px", color: "#F2ECD8", fontSize: "0.95rem", outline: "none", transition: "border-color 0.3s" }}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.6)"}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)"}
                  />
                </div>

                <button type="submit" disabled={loading} style={{
                  width: "100%", background: "#C9A84C", color: "#090806",
                  border: "none", borderRadius: 10, padding: "15px",
                  fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1, transition: "all 0.3s", marginBottom: 20,
                }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "none"}>
                  {loading ? "Se trimite..." : "Trimite link de resetare"}
                </button>

                <p style={{ textAlign: "center", color: "#7A7060", fontSize: "0.85rem" }}>
                  <Link href="/" style={{ color: "#C9A84C", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"}>
                    ← Înapoi acasă
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3rem", marginBottom: 20 }}>📬</div>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, marginBottom: 12 }}>
                Email trimis!
              </h2>
              <p style={{ color: "#7A7060", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 32 }}>
                Am trimis un link de resetare la <strong style={{ color: "#F2ECD8" }}>{email}</strong>. Verifică și folderul spam.
              </p>
              <Link href="/" style={{ display: "inline-block", background: "#C9A84C", color: "#090806", padding: "14px 32px", borderRadius: 10, fontSize: "0.88rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Înapoi acasă
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}