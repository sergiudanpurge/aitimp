"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Parolele nu coincid."); return; }
    if (password.length < 8) { setError("Parola trebuie să aibă minim 8 caractere."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare");
      setDone(true);
      setTimeout(() => router.push("/"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "#181510",
    border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10,
    padding: "14px 16px", color: "#F2ECD8", fontSize: "0.95rem",
    outline: "none", transition: "border-color 0.3s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#090806", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", overflow: "hidden" }}>
      
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.035) 1px,transparent 1px)", backgroundSize: "60px 60px", WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 100%)" }} />
      <div style={{ position: "absolute", width: 600, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 2 }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", fontWeight: 700, color: "#C9A84C", textDecoration: "none" }}>
            Aitimp<sup style={{ fontSize: "0.5rem", color: "#7A7060", verticalAlign: "super" }}>.ro</sup>
          </Link>
        </div>

        <div style={{ background: "#0f0e0b", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "48px 44px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "radial-gradient(ellipse at top, rgba(201,168,76,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

          {!done ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 36, position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔐</div>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.7rem", fontWeight: 700, marginBottom: 10 }}>
                  Parolă nouă
                </h1>
                <p style={{ color: "#7A7060", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  Alege o parolă nouă sigură pentru contul tău.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
                {error && (
                  <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#ff6b6b", fontSize: "0.85rem" }}>
                    {error}
                  </div>
                )}

                {!token && (
                  <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#ff6b6b", fontSize: "0.85rem" }}>
                    Link invalid sau expirat. <Link href="/reset-password" style={{ color: "#C9A84C" }}>Solicită unul nou.</Link>
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A7060", marginBottom: 8 }}>Parolă nouă</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Minim 8 caractere" style={inputStyle}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.6)"}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)"} />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A7060", marginBottom: 8 }}>Confirmă parola</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repetă parola" style={inputStyle}
                    onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.6)"}
                    onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.2)"} />
                </div>

                {/* Password strength hint */}
                <div style={{ display: "flex", gap: 6, marginBottom: 28, marginTop: -20 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: password.length >= i * 3 ? (password.length >= 10 ? "#C9A84C" : "rgba(201,168,76,0.5)") : "rgba(201,168,76,0.1)", transition: "background 0.3s" }} />
                  ))}
                </div>

                <button type="submit" disabled={loading || !token} style={{
                  width: "100%", background: "#C9A84C", color: "#090806",
                  border: "none", borderRadius: 10, padding: "15px",
                  fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.06em",
                  textTransform: "uppercase", cursor: (loading || !token) ? "not-allowed" : "pointer",
                  opacity: (loading || !token) ? 0.6 : 1, transition: "all 0.3s",
                }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "none"}>
                  {loading ? "Se salvează..." : "Salvează parola nouă"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3rem", marginBottom: 20 }}>✅</div>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, marginBottom: 12 }}>
                Parolă schimbată!
              </h2>
              <p style={{ color: "#7A7060", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 8 }}>
                Parola ta a fost actualizată cu succes.
              </p>
              <p style={{ color: "#5A5040", fontSize: "0.8rem", marginBottom: 32 }}>
                Vei fi redirecționat automat în 3 secunde...
              </p>
              <Link href="/" style={{ display: "inline-block", background: "#C9A84C", color: "#090806", padding: "14px 32px", borderRadius: 10, fontSize: "0.88rem", fontWeight: 700, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Mergi acasă
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}