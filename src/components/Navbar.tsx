"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setUser(d.user); }).catch(() => {});
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.accountType === "company") return "/dashboard";
    if (user.role === "employee") return "/dashboard/employee";
    return "/dashboard/user";
  };

  const navLinks = [
    { href: "/", label: "🏠 Home" },
    { href: "/despre", label: "Despre noi" },
    { href: "/contact", label: "Contact" },
    { href: user ? "/search" : "/login", label: "🔍 Cauta servicii" },
  ];

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, height: 58, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        {/* LOGO */}
        <a href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 20, color: "#c9a96e", textDecoration: "none", fontWeight: 700, flexShrink: 0 }}>aitimp.ro</a>

        {/* DESKTOP */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                style={{ padding: "7px 12px", borderRadius: 8, fontSize: 13, color: "#888", fontWeight: 500, textDecoration: "none", fontFamily: "var(--font-outfit)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                {l.label}
              </a>
            ))}
            <div style={{ width: 1, height: 20, background: "#222", margin: "0 4px" }} />
            {user ? (
              <div style={{ display: "flex", gap: 8 }}>
                <a href={`/p/${user.id}`} target="_blank" style={{ padding: "7px 14px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 8, fontSize: 12, color: "#c9a96e", textDecoration: "none", fontWeight: 600, fontFamily: "var(--font-outfit)" }}>👤 Profil</a>
                <button onClick={() => router.push(getDashboardPath())} style={{ padding: "7px 14px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Contul meu</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <a href="/login" style={{ padding: "7px 14px", border: "1px solid #333", borderRadius: 8, fontSize: 12, color: "#888", textDecoration: "none", fontWeight: 600, fontFamily: "var(--font-outfit)" }}>Login</a>
                <a href="/register" style={{ padding: "7px 14px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Inregistreaza-te</a>
              </div>
            )}
          </div>
        )}

        {/* HAMBURGER */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            style={{ background: "none", border: "none", color: "#f0ede8", fontSize: 26, cursor: "pointer", padding: "8px 4px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </nav>

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 58, left: 0, right: 0, bottom: 0, background: "#0a0a0a", zIndex: 99, display: "flex", flexDirection: "column", padding: "8px 0", overflowY: "auto" }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ padding: "16px 24px", fontSize: 17, color: "#f0ede8", textDecoration: "none", fontFamily: "var(--font-outfit)", borderBottom: "1px solid #1a1a1a", display: "block" }}>
              {l.label}
            </a>
          ))}
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, marginTop: "auto" }}>
            {user ? (
              <>
                <a href={`/p/${user.id}`} onClick={() => setMenuOpen(false)}
                  style={{ padding: "14px", fontSize: 15, color: "#c9a96e", textDecoration: "none", fontFamily: "var(--font-outfit)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: 12, textAlign: "center" as const }}>
                  👁 Profil public
                </a>
                <button onClick={() => { router.push(getDashboardPath()); setMenuOpen(false); }}
                  style={{ padding: "14px", fontSize: 15, color: "#0a0a0a", background: "linear-gradient(135deg,#c9a96e,#a8843d)", border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "var(--font-outfit)", fontWeight: 700 }}>
                  Dashboard →
                </button>
              </>
            ) : (
              <>
                <a href="/login" onClick={() => setMenuOpen(false)}
                  style={{ padding: "14px", fontSize: 15, color: "#f0ede8", textDecoration: "none", fontFamily: "var(--font-outfit)", border: "1px solid #333", borderRadius: 12, textAlign: "center" as const }}>
                  Login
                </a>
                <a href="/register" onClick={() => setMenuOpen(false)}
                  style={{ padding: "14px", fontSize: 15, color: "#0a0a0a", background: "linear-gradient(135deg,#c9a96e,#a8843d)", textDecoration: "none", fontFamily: "var(--font-outfit)", fontWeight: 700, borderRadius: 12, textAlign: "center" as const }}>
                  Inregistreaza-te
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}