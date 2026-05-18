"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setUser(d.user); }).catch(() => {});
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.accountType === "company") return "/dashboard";
    if (user.role === "employee") return "/dashboard/employee";
    return "/dashboard/user";
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/despre", label: "Despre noi" },
    { href: "/contact", label: "Contact" },
    { href: "/search", label: "🔍 Cauta servicii" },
  ];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, height: 58, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
      {/* LOGO */}
      <a href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: 20, color: "#c9a96e", textDecoration: "none", fontWeight: 700, flexShrink: 0 }}>aitimp.ro</a>

      {/* DESKTOP LINKS */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="nav-desktop">
        {links.map(l => (
          <a key={l.href} href={l.href} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 13, color: "#888", fontWeight: 500, textDecoration: "none", fontFamily: "var(--font-outfit)", transition: "color .2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f0ede8")}
            onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
            {l.label}
          </a>
        ))}
        <div style={{ width: 1, height: 20, background: "#222", margin: "0 4px" }} />
        {user ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {user.id && (
              <a href={`/p/${user.id}`} target="_blank" style={{ padding: "7px 14px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 8, fontSize: 12, color: "#c9a96e", textDecoration: "none", fontWeight: 600, fontFamily: "var(--font-outfit)" }}>
                👁 Profil public
              </a>
            )}
            <button onClick={() => router.push(getDashboardPath())} style={{ padding: "7px 14px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Dashboard →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/login" style={{ padding: "7px 14px", background: "transparent", border: "1px solid #333", borderRadius: 8, fontSize: 12, color: "#888", textDecoration: "none", fontWeight: 600, fontFamily: "var(--font-outfit)" }}>Login</a>
            <a href="/register" style={{ padding: "7px 14px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Inregistreaza-te</a>
          </div>
        )}
      </div>

      {/* MOBILE HAMBURGER */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", color: "#f0ede8", fontSize: 22, cursor: "pointer" }} className="nav-mobile">
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 58, left: 0, right: 0, background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8, zIndex: 99 }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ padding: "10px 0", fontSize: 14, color: "#f0ede8", textDecoration: "none", fontFamily: "var(--font-outfit)", borderBottom: "1px solid #1a1a1a" }}>{l.label}</a>
          ))}
          {user ? (
            <>
              {user.id && <a href={`/p/${user.id}`} style={{ padding: "10px 0", fontSize: 14, color: "#c9a96e", textDecoration: "none", fontFamily: "var(--font-outfit)" }}>👁 Profil public</a>}
              <button onClick={() => { router.push(getDashboardPath()); setMenuOpen(false); }} style={{ padding: "10px 0", fontSize: 14, color: "#c9a96e", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-outfit)" }}>Dashboard →</button>
            </>
          ) : (
            <>
              <a href="/login" style={{ padding: "10px 0", fontSize: 14, color: "#f0ede8", textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Login</a>
              <a href="/register" style={{ padding: "10px 0", fontSize: 14, color: "#c9a96e", textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Inregistreaza-te</a>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}