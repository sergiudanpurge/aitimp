"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

export default function DashboardLayout({ children, title, actions }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#f0ede8", fontFamily: "var(--font-outfit)" }}>
      <Sidebar user={user} companyName={user.accountType === "company" ? user.name : undefined} />

      <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div style={{ height: 58, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 600 }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {actions}
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#161616", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer", position: "relative" }}>
              🔔
              <div style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#c9a96e", border: "1.5px solid #0a0a0a" }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
          {children}
        </div>
      </div>
    </div>
  );
}