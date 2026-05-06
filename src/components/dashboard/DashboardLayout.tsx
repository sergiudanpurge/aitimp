"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

export default function DashboardLayout({ children, title, actions }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) router.push("/login");
      else setUser(d.user);
    });
  }, []);

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e", fontFamily: "var(--font-playfair)", fontSize: "1.2rem" }}>
      Se încarcă...
    </div>
  );

  const bottomNavItems = [
    { icon: "⚡", label: "Dashboard", href: "/dashboard" },
    { icon: "📅", label: "Rezervări", href: "/dashboard/bookings" },
    { icon: "💬", label: "Chat", href: "/dashboard/chat" },
    { icon: "⭐", label: "Recenzii", href: "/dashboard/reviews" },
    { icon: "⚙️", label: "Setări", href: "/dashboard/settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#f0ede8", fontFamily: "var(--font-outfit)" }}>

{/* Sidebar — ascuns pe mobile via CSS */}
      <div className="dashboard-sidebar" style={{
        width: 220, background: "#111", borderRight: "1px solid #262626",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        display: "flex", flexDirection: "column"
      }}>
        <Sidebar user={user} companyName={user.accountType === "company" ? user.name : undefined} />
      </div>

      <div className="dashboard-main" style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Topbar */}
        <div style={{ height: 58, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ fontSize: 18, textDecoration: "none", color: "#777" }} title="Acasă">🏠</Link>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 600 }}>{title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {actions}
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#161616", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer", position: "relative" }}>
              🔔
              <div style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#c9a96e", border: "1.5px solid #0a0a0a" }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 1400, width: "100%" }}>
          {children}
        </div>
      </div>

      {/* Bottom Navigation Mobile */}
      <div className="bottom-nav-mobile">
        {bottomNavItems.map(item => (
          <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
            <div className={"bottom-nav-item" + (pathname === item.href ? " active" : "")}>
              <div className="bottom-nav-icon">{item.icon}</div>
              {item.label}
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}