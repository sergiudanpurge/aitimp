"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "⚡", href: "/dashboard" },
  { id: "angajati", label: "Angajați", icon: "👥", href: "/dashboard/employees" },
  { id: "servicii", label: "Servicii", icon: "✂️", href: "/dashboard/services" },
  { id: "rezervari", label: "Rezervări", icon: "📅", href: "/dashboard/bookings" },
  { id: "calendar", label: "Calendar", icon: "🗓", href: "/dashboard/calendar" },
  { id: "profil", label: "Profil Companie", icon: "🏢", href: "/dashboard/profile" },
  { id: "recenzii", label: "Recenzii", icon: "⭐", href: "/dashboard/reviews" },
  { id: "chat", label: "Chat", icon: "💬", href: "/dashboard/chat" },
  { id: "setari", label: "Setări", icon: "⚙️", href: "/dashboard/settings" },
];

interface Props {
  user: any;
  companyName?: string;
}

export default function Sidebar({ user, companyName }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div style={{ width: 220, background: "#111", borderRight: "1px solid #262626", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
      
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #262626" }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: "#c9a96e" }}>aitimp.ro</div>
        {companyName && <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{companyName}</div>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.id} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              fontSize: 13, fontWeight: 500, textDecoration: "none",
              transition: "all 0.15s",
              background: isActive ? "rgba(201,169,110,0.1)" : "transparent",
              color: isActive ? "#c9a96e" : "#777",
              border: isActive ? "1px solid rgba(201,169,110,0.2)" : "1px solid transparent",
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid #262626" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {user?.name?.charAt(0) || "A"}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f0ede8" }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "#777" }}>{user?.accountType === "company" ? "Administrator" : "Utilizator"}</div>
          </div>
        </div>
        <button onClick={logout} style={{ width: "100%", padding: "9px 12px", background: "transparent", border: "1px solid #262626", borderRadius: 8, color: "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          Ieși din cont
        </button>
      </div>
    </div>
  );
}