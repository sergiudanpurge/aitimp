"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LoginModal from "@/components/auth/LoginModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 64px",
        background: scrolled ? "rgba(9,8,6,0.95)" : "linear-gradient(to bottom, rgba(9,8,6,0.9), transparent)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "none",
        transition: "all 0.4s",
      }}>
        <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#C9A84C", textDecoration: "none" }}>
          Aitimp<sup style={{ fontSize: "0.5rem", color: "#7A7060", fontFamily: "var(--font-outfit)", verticalAlign: "super", letterSpacing: "0.1em" }}>.ro</sup>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {["Servicii", "Cum funcționează", "Recenzii"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              style={{ color: "#7A7060", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#7A7060"}>
              {item}
            </Link>
          ))}
          <button onClick={() => setLoginOpen(true)} style={{
            background: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)",
            padding: "10px 24px", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#C9A84C"; (e.currentTarget as HTMLButtonElement).style.color = "#090806"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C"; }}>
            Intră în cont
          </button>
        </div>
      </nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}