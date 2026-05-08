"use client";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function Page() {
  return (
    <DashboardLayout title="Setări">
      <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Setări</div>
        <div style={{ fontSize: 14, color: "#777", marginBottom: 28 }}>Această pagină este în curs de dezvoltare.</div>
        <Link href="/dashboard" style={{ padding: "10px 24px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 9, fontSize: 13, color: "#c9a96e", textDecoration: "none", fontWeight: 600 }}>
          ← Înapoi la dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
}
