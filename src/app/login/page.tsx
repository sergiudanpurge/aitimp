"use client";
import Navbar from "@/components/Navbar";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%", background: "#181510",
    border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10,
    padding: "13px 16px", color: "#F2ECD8", fontSize: "0.9rem",
    outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" as const,
  };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email sau parolă greșită");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#090806", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.035) 1px,transparent 1px)", backgroundSize: "60px 60px", WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 100%)" }} />
      <div style={{ position: "absolute", width: 600, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", fontWeight: 700, color: "#C9A84C", textDecoration: "none" }}>
            Aitimp<sup style={{ fontSize: "0.5rem", color: "#7A7060", verticalAlign: "super" }}>.ro</sup>
          </Link>
        </div>

        <div style={{ background: "#0f0e0b", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "clamp(24px, 5vw, 48px) clamp(20px, 5vw, 44px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "radial-gradient(ellipse at top, rgba(201,168,76,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

          {verified && (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 24, color: "#86efac", fontSize: "0.85rem", textAlign: "center", position: "relative", zIndex: 1 }}>
              ✅ Email confirmat! Poți să te loghezi acum.
            </div>
          )}

          <div style={{ textAlign: "center", marginBottom: 32, position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.7rem", fontWeight: 700, marginBottom: 8, color: "#F2ECD8" }}>Bine ai revenit</h2>
            <p style={{ color: "#7A7060", fontSize: "0.88rem" }}>Intră în contul tău Aitimp.ro</p>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#7A7060", marginBottom: 7 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="adresa@email.com" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#7A7060", marginBottom: 7 }}>Parolă</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="••••••••" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
            </div>

            <div style={{ textAlign: "right", marginBottom: 28 }}>
              <Link href="/reset-password" style={{ color: "#7A7060", fontSize: "0.8rem", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "#7A7060")}>
                Ai uitat parola?
              </Link>
            </div>

            {error && (
              <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: "#ff6b6b", fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: "#C9A84C", color: "#090806", border: "none", borderRadius: 10, padding: 15, fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 20 }}>
              {loading ? "Se încarcă..." : "Intră în cont"}
            </button>

            <p style={{ textAlign: "center", color: "#7A7060", fontSize: "0.88rem" }}>
              Nu ai cont?{" "}
              <Link href="/register" style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 600 }}>Înregistrează-te gratuit</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}