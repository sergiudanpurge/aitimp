"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

export default function Navbar() {
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.error) setUser(d.user);
    });
  }, []);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "employee") return "/dashboard/employee";
    if (user.accountType === "private") return "/dashboard/user";
    return "/dashboard";
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <>
      <nav style={{ height: 60, background: "rgba(10,10,10,0.95)", borderBottom: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 40px", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        
        {/* LOGO */}
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 20, color: "#c9a96e", textDecoration: "none", flexShrink: 0 }}>
          aitimp.ro
        </Link>

        {/* DESKTOP LINKS */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/search" style={{ padding: "7px 16px", color: "#777", fontSize: 13, textDecoration: "none", borderRadius: 8, transition: "color .15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#777")}>
              🔍 Caută servicii
            </Link>
            <Link href="/contact" style={{ padding: "7px 16px", color: "#777", fontSize: 13, textDecoration: "none", borderRadius: 8 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
              onMouseLeave={e => (e.currentTarget.style.color = "#777")}>
              Contact
            </Link>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link href={getDashboardLink()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 8, textDecoration: "none" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                    {user.name?.charAt(0)}
                  </div>
                  <span style={{ fontSize: 13, color: "#c9a96e", fontWeight: 600 }}>{user.name?.split(" ")[0]}</span>
                </Link>
                <button onClick={logout} style={{ padding: "7px 14px", background: "transparent", border: "1px solid #262626", borderRadius: 8, color: "#777", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Ieși
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Link href="/login" style={{ padding: "8px 18px", background: "transparent", border: "1px solid #262626", borderRadius: 8, fontSize: 13, color: "#777", textDecoration: "none" }}>
                  Intră în cont
                </Link>
                <Link href="/register" style={{ padding: "8px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#0a0a0a", textDecoration: "none" }}>
                  Înregistrare
                </Link>
              </div>
            )}
          </div>
        )}

        {/* MOBILE RIGHT */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/search" style={{ width: 36, height: 36, background: "#161616", border: "1px solid #262626", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16 }}>🔍</Link>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ width: 36, height: 36, background: "#161616", border: "1px solid #262626", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: "#f0ede8" }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        )}
      </nav>

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 99, backdropFilter: "blur(8px)" }} onClick={() => setMenuOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#111", borderBottom: "1px solid #262626", padding: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { href: "/", label: "🏠 Acasă" },
                { href: "/search", label: "🔍 Caută servicii" },
                { href: "/contact", label: "📞 Contact" },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ padding: "12px 16px", borderRadius: 10, color: "#f0ede8", fontSize: 14, textDecoration: "none", display: "block" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#1e1e1e")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  {item.label}
                </Link>
              ))}
              <div style={{ height: 1, background: "#262626", margin: "8px 0" }} />
              {user ? (
                <>
                  <Link href={getDashboardLink()} onClick={() => setMenuOpen(false)} style={{ padding: "12px 16px", borderRadius: 10, color: "#c9a96e", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 10, background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{user.name?.charAt(0)}</div>
                    {user.name} — Dashboard
                  </Link>
                  <button onClick={logout} style={{ padding: "12px 16px", borderRadius: 10, color: "#777", fontSize: 14, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-outfit)", width: "100%" }}>
                    🚪 Ieși din cont
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} style={{ padding: "12px 16px", borderRadius: 10, color: "#f0ede8", fontSize: 14, textDecoration: "none", display: "block", background: "#161616", border: "1px solid #262626", textAlign: "center" }}>
                    Intră în cont
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} style={{ padding: "12px 16px", borderRadius: 10, color: "#0a0a0a", fontSize: 14, textDecoration: "none", display: "block", background: "linear-gradient(135deg,#c9a96e,#a8843d)", textAlign: "center", fontWeight: 700 }}>
                    Înregistrare gratuită
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}