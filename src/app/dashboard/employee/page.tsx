"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import Link from "next/link";
import FinancialDashboard from "@/components/dashboard/FinancialDashboard";

const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook", color: "#1877F2", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { key: "instagram", label: "Instagram", color: "#E4405F", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' },
  { key: "tiktok", label: "TikTok", color: "#010101", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/></svg>' },
  { key: "linkedin", label: "LinkedIn", color: "#0A66C2", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
  { key: "website", label: "Website", color: "#c9a96e", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>' },
  { key: "youtube", label: "YouTube", color: "#FF0000", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' },
];

const JUDETE = ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","București","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea"];

export default function EmployeeDashboard() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", description: "", judet: "", oras: "", adresa: "", facebook: "", instagram: "", tiktok: "", linkedin: "", website: "", youtube: "", whatsapp: "", contactEmail: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", yellow: "#e8b84b", red: "#e05a5a", blue: "#5a8de0",
  };

  const statusConfig: any = {
    pending: { label: "În așteptare", color: s.yellow, bg: "rgba(232,184,75,0.15)" },
    accepted: { label: "Confirmat", color: s.green, bg: "rgba(76,175,130,0.15)" },
    cancelled: { label: "Anulat", color: s.red, bg: "rgba(224,90,90,0.15)" },
    completed: { label: "Finalizat", color: s.accent, bg: "rgba(201,169,110,0.15)" },
  };

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      setUser(d.user);
      const u = d.user;
      setProfileForm({
        name: u.name || "", phone: u.phone || "", description: u.description || "",
        judet: u.judet || "", oras: u.oras || "", adresa: u.adresa || "",
        facebook: u.facebook || "", instagram: u.instagram || "", tiktok: u.tiktok || "",
        linkedin: u.linkedin || "", website: u.website || "", youtube: u.youtube || "",
        whatsapp: u.whatsapp || "", contactEmail: u.contactEmail || "",
      });
    });
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.services || []));
    fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d.bookings || []));
  }, []);

  const pending = bookings.filter(b => b.status === "pending");
  const accepted = bookings.filter(b => b.status === "accepted");
  const completed = bookings.filter(b => b.status === "completed");
  const totalIncasat = completed.reduce((a, b) => a + (b.totalPrice || 0), 0);

  const sidebarSections = [
    { section: "prestator" },
    { id: "dashboard", icon: "⚡", label: "Dashboard" },
    { id: "servicii", icon: "✂️", label: "Serviciile mele" },
    { id: "calendar", icon: "🗓", label: "Calendarul meu" },
    { id: "cereri", icon: "📋", label: "Cereri primite" },
    { id: "financiar", icon: "📊", label: "Situație financiară" },
    { section: "client" },
    { id: "rezervari-client", icon: "📅", label: "Rezervările mele" },
    { id: "mesaje", icon: "💬", label: "Mesaje" },
    { section: "cont" },
    { id: "editare-profil", icon: "✏️", label: "Editează profilul" },
    { id: "setari", icon: "⚙️", label: "Setări" },
  ];

  const bottomNavItems = [
    { id: "dashboard", icon: "⚡", label: "Dashboard" },
    { id: "servicii", icon: "✂️", label: "Servicii" },
    { id: "cereri", icon: "📋", label: "Cereri" },
    { id: "rezervari-client", icon: "📅", label: "Rezervări" },
    { id: "setari", icon: "⚙️", label: "Setări" },
  ];

  const getSectionTitle = () => {
    const titles: any = {
      dashboard: "Dashboard", servicii: "Serviciile mele", calendar: "Calendarul meu",
      cereri: "Cereri primite", financiar: "Situație financiară",
      "rezervari-client": "Rezervările mele", mesaje: "Mesaje",
      "editare-profil": "Editează profilul", setari: "Setări",
    };
    return titles[activeSection] || "Dashboard";
  };

  const saveProfile = async () => {
    setProfileLoading(true);
    const res = await fetch("/api/profile", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });
    if (res.ok) {
      setProfileMsg("Profil actualizat!");
      fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setUser(d.user); });
      setTimeout(() => setProfileMsg(""), 3000);
    }
    setProfileLoading(false);
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) { setPwError("Parolele nu coincid!"); return; }
    if (passwords.new.length < 8) { setPwError("Minim 8 caractere!"); return; }
    setPwLoading(true); setPwError(""); setPwMsg("");
    const res = await fetch("/api/auth/change-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
    });
    const data = await res.json();
    if (res.ok) { setPwMsg("Parola schimbată!"); setPasswords({ current: "", new: "", confirm: "" }); }
    else setPwError(data.error);
    setPwLoading(false);
    setTimeout(() => { setPwMsg(""); setPwError(""); }, 3000);
  };

  const inputStyle = { width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: active ? "rgba(201,169,110,0.2)" : s.surface2, border: `1px solid ${active ? "rgba(201,169,110,0.4)" : s.border}`, display: "flex", alignItems: "center", padding: "0 4px", cursor: "pointer", justifyContent: active ? "flex-end" : "flex-start", transition: "all .2s", flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: active ? s.accent : "#444" }} />
    </div>
  );

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;
  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex" }}>

      {/* SIDEBAR */}
      {!isMobile && (
        <div style={{ width: 220, background: "#111", borderRight: `1px solid ${s.border}`, position: "fixed", top: 0, left: 0, bottom: 0, display: "flex", flexDirection: "column", zIndex: 50 }}>
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${s.border}` }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: s.accent }}>aitimp.ro</div>
            <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>Panou Angajat</div>
          </div>
          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            {sidebarSections.map((item: any, i) => {
              if (item.section) return (
                <div key={i} style={{ fontSize: 10, color: "#444", textTransform: "uppercase" as const, letterSpacing: "0.8px", padding: "10px 12px 4px" }}>
                  {item.section === "prestator" ? "Prestator" : item.section === "client" ? "Client" : "Cont"}
                </div>
              );
              return (
                <button key={item.id} onClick={() => setActiveSection(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: activeSection === item.id ? s.accent : s.muted, background: activeSection === item.id ? "rgba(201,169,110,0.1)" : "transparent", border: activeSection === item.id ? `1px solid rgba(201,169,110,0.2)` : "1px solid transparent", cursor: "pointer", fontFamily: "var(--font-outfit)", textAlign: "left" as const }}>
                  <span>{item.icon}</span>{item.label}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: "16px 12px", borderTop: `1px solid ${s.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden" }}>
                {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.charAt(0)}
              </div>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: 11, color: s.muted }}>Angajat</div></div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={{ marginLeft: isMobile ? 0 : 220, flex: 1, paddingBottom: isMobile ? 70 : 0 }}>

        {/* TOPBAR */}
        <div style={{ height: 58, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>{getSectionTitle()}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setActiveSection("editare-profil")} style={{ padding: "7px 14px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              {isMobile ? "✏️" : "✏️ Editează profilul"}
            </button>
            <a href={`/p/${user.id}`} target="_blank" style={{ padding: "7px 14px", background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`, borderRadius: 8, fontSize: 12, color: s.accent, textDecoration: "none", fontWeight: 600 }}>
              {isMobile ? "👁" : "👁 Profil public"}
            </a>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: s.surface, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              🔔<div style={{ position: "absolute", top: 5, right: 6, width: 7, height: 7, borderRadius: "50%", background: s.accent, border: `1.5px solid ${s.bg}` }} />
            </div>
          </div>
        </div>

        <div style={{ padding: isMobile ? 16 : 28, display: "flex", flexDirection: "column", gap: 20, maxWidth: 1200, margin: "0 auto" }}>

          {/* ===== DASHBOARD ===== */}
          {activeSection === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* CARD PROFIL */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 80, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
                <div style={{ padding: "0 20px 16px", marginTop: -32, display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, overflow: "hidden" }}>
                      {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.charAt(0)}
                    </div>
                    <label style={{ position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${s.surface}`, fontSize: 10 }}>
                      ✏️<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const fd = new FormData(); fd.append("file", file); fetch("/api/profile/avatar", { method: "POST", body: fd }).then(r => r.json()).then(d => { if (d.url) setUser({ ...user, avatar: d.url }); }); }} />
                    </label>
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4, minWidth: 140 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 17 : 20, fontWeight: 700 }}>{user.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                      {(profileForm.oras || profileForm.judet) && <span style={{ fontSize: 12, color: s.muted }}>📍 {profileForm.oras}{profileForm.judet && `, ${profileForm.judet}`}</span>}
                      {profileForm.phone && <span style={{ fontSize: 12, color: s.muted }}>📞 {profileForm.phone}</span>}
                      <span style={{ fontSize: 12, color: s.muted }}>· Angajat</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, paddingBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(90,141,224,0.1)", border: "1px solid rgba(90,141,224,0.2)", fontSize: 11, color: s.blue, fontWeight: 600 }}>👤 Client</div>
                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", fontSize: 11, color: s.accent, fontWeight: 600 }}>🔧 Angajat</div>
                    <button onClick={() => setActiveSection("editare-profil")} style={{ padding: "5px 12px", borderRadius: 8, background: s.surface2, border: `1px solid ${s.border}`, fontSize: 11, color: s.muted, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✏️ Editează</button>
                  </div>
                </div>
                {profileForm.description && <div style={{ padding: "0 20px 12px", fontSize: 13, color: s.muted, lineHeight: 1.7 }}>{profileForm.description}</div>}
                {SOCIAL_PLATFORMS.some(p => (profileForm as any)[p.key]) && (
                  <div style={{ padding: "0 20px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SOCIAL_PLATFORMS.filter(p => (profileForm as any)[p.key]).map(p => (
                      <a key={p.key} href={(profileForm as any)[p.key]} target="_blank" rel="noopener noreferrer"
                        style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", color: (p as any).color, textDecoration: "none" }}
                        title={p.label}>
                        <span dangerouslySetInnerHTML={{ __html: (p as any).icon }} />
                      </a>
                    ))}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${s.border}` }}>
                  {[[bookings.length.toString(),"Rezervări"],[completed.length.toString(),"Finalizate"],["4.97","Rating"],[services.length.toString(),"Servicii"]].map(([val,label],i) => (
                    <div key={i} style={{ padding: isMobile ? "10px 8px" : "12px 16px", borderRight: i < 3 ? `1px solid ${s.border}` : "none", textAlign: "center", cursor: "pointer" }}
                      onClick={() => setActiveSection(i === 0 ? "rezervari-client" : i === 1 ? "cereri" : "servicii")}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 20, fontWeight: 700, color: s.accent }}>{val}</div>
                      <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATISTICI */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
                {[
                  [completed.length.toString(), "Finalizate", s.green, "luna curentă"],
                  [pending.length.toString(), "În așteptare", s.yellow, "necesită aprobare"],
                  [totalIncasat + " lei", "Încasat", s.accent, "luna curentă"],
                  ["0", "Recenzii", s.blue, "rating: 4.97"],
                ].map(([val, label, color, sub]) => (
                  <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 24, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* CA SI CLIENT */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue }}>👤 Ca și Client</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    [bookings.filter((b:any) => b.clientId === user?.id).length.toString(), "Rezervări efectuate", s.accent],
                    [bookings.filter((b:any) => b.clientId === user?.id && b.status === "pending").length.toString(), "În așteptare", s.yellow],
                    [bookings.filter((b:any) => b.clientId === user?.id && b.status === "completed").reduce((a:number, b:any) => a + (b.totalPrice||0), 0) + " lei", "Total cheltuit", s.green],
                  ].map(([val,label,color]) => (
                    <div key={label as string} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color: color as string }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Rezervări recente</div>
                  <button onClick={() => setActiveSection("rezervari-client")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                </div>
                {bookings.filter((b:any) => b.clientId === user?.id).length === 0 ? (
                  <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "16px 0" }}>
                    Nicio rezervare ca Client. <a href="/search" style={{ color: s.accent, textDecoration: "none" }}>Caută servicii →</a>
                  </div>
                ) : bookings.filter((b:any) => b.clientId === user?.id).slice(0, 3).map((b: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < 2 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📅</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name || "Serviciu"}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{b.date} {b.time && `· ${b.time}`}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{b.totalPrice} lei</div>
                  </div>
                ))}
              </div>

              {/* SERVICII + CERERI */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Serviciile mele</div>
                    <button onClick={() => setActiveSection("servicii")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                  </div>
                  {services.length === 0 ? (
                    <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "16px 0" }}>
                      Niciun serviciu. <button onClick={() => setActiveSection("servicii")} style={{ color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)", fontSize: 13 }}>Adaugă →</button>
                    </div>
                  ) : services.slice(0, 4).map((svc: any, idx: number) => {
                    const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b"];
                    return (
                      <div key={svc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: idx < Math.min(services.length, 4) - 1 ? `1px solid ${s.surface2}` : "none" }}>
                        <div style={{ width: 3, height: 32, borderRadius: 2, background: colors[idx % colors.length], flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.name}</div>
                          <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Cereri primite</div>
                    <button onClick={() => setActiveSection("cereri")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                  </div>
                  {pending.length === 0 ? (
                    <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "16px 0" }}>Nicio cerere nouă.</div>
                  ) : pending.slice(0, 4).map((b: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < Math.min(pending.length, 4) - 1 ? `1px solid ${s.surface2}` : "none" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {b.client?.name?.charAt(0) || "C"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.client?.name} — {b.service?.name}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{b.date} · {b.time}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", color: s.green, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>✓</button>
                        <button style={{ padding: "5px 8px", borderRadius: 6, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 11, cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* ===== SERVICII ===== */}
          {activeSection === "servicii" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={{ padding: "9px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adaugă serviciu</button>
              </div>
              {services.length > 0 && (() => {
                const svcStats = services.map((svc:any) => ({
                  ...svc,
                  bookingsCount: bookings.filter((b:any) => b.service?.id === svc.id).length,
                  revenue: bookings.filter((b:any) => b.service?.id === svc.id && b.status === "completed").reduce((a:number, b:any) => a + (b.totalPrice || 0), 0),
                }));
                const topService = [...svcStats].sort((a,b) => b.bookingsCount - a.bookingsCount)[0];
                const totalRevenue = svcStats.reduce((a:number,s:any) => a + s.revenue, 0);
                const totalBookings = svcStats.reduce((a:number,s:any) => a + s.bookingsCount, 0);
                const avgPrice = services.length > 0 ? Math.round(services.reduce((a:number,s:any) => a + (s.price||0), 0) / services.length) : 0;
                return (
                  <>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 10 }}>
                    {[
                      { label: "Cel mai cautat", val: topService?.name || "N/A", sub: (topService?.bookingsCount||0) + " rezervari", color: s.accent },
                      { label: "Total rezervari", val: totalBookings.toString(), sub: "toate serviciile", color: s.blue },
                      { label: "Venit total", val: totalRevenue + " lei", sub: "finalizate", color: s.green },
                      { label: "Pret mediu", val: avgPrice + " lei", sub: "per serviciu", color: s.yellow },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontSize: 10, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>{stat.label}</div>
                        <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 15 : 18, fontWeight: 700, color: stat.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stat.val}</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{stat.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 14 : 18, marginBottom: 10 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Performanta per serviciu</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {services.map((svc:any, idx:number) => {
                        const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                        const svcBk = bookings.filter((b:any) => b.service?.id === svc.id);
                        const svcRev = svcBk.filter((b:any) => b.status === "completed").reduce((a:number,b:any) => a+(b.totalPrice||0), 0);
                        const maxBk = Math.max(...services.map((s:any) => bookings.filter((b:any) => b.service?.id === s.id).length), 1);
                        const pct = Math.round((svcBk.length/maxBk)*100);
                        return (
                          <div key={svc.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 3, height: 36, borderRadius: 2, background: colors[idx%colors.length], flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{svc.name}</span>
                                <span style={{ fontSize: 12, color: s.accent, fontWeight: 700 }}>{svcRev} lei</span>
                              </div>
                              <div style={{ height: 6, background: s.surface2, borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: pct+"%", background: colors[idx%colors.length], borderRadius: 3 }} />
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                <span style={{ fontSize: 10, color: s.muted }}>{svcBk.length} rezervari</span>
                                <span style={{ fontSize: 10, color: s.muted }}>{svc.price} lei · {svc.duration*30} min</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  </>
                );
              })()}
              {services.length === 0 ? (
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Niciun serviciu</div>
                  <div style={{ fontSize: 13, marginBottom: 20 }}>Adaugă primul serviciu pentru a fi vizibil</div>
                  <button style={{ padding: "10px 24px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adaugă serviciu</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {services.map((svc: any, idx: number) => {
                    const accentColors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                    const sqColors = [["#c9a96e","#8b5e3c","#5a3a20"],["#5a8de0","#3a6abf","#1a4a9e"],["#4caf82","#2a8f62","#0a6f42"],["#e8b84b","#c9902a","#a06810"],["#e05a5a","#c03a3a","#a02020"],["#a78de0","#7a5abf","#5a3a9e"]];
                    const accent = accentColors[idx % accentColors.length];
                    const sq = sqColors[idx % sqColors.length];
                    const galleryImg = user.gallery?.[idx % (user.gallery?.length || 1)];
                    return (
                      <div key={svc.id} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, overflow: "hidden", display: "flex", height: 110, transition: "all .22s" }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(201,169,110,0.5)"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,.3)"; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = s.border; el.style.transform = "none"; el.style.boxShadow = "none"; }}>
                        <div style={{ width: 110, flexShrink: 0, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 6, padding: 12, position: "relative", overflow: "hidden" }}>
                          {galleryImg ? <img src={galleryImg} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                            : sq.map((c: string, i: number) => <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: c, opacity: 1 - i * 0.25, flexShrink: 0 }} />)}
                          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
                        </div>
                        <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{svc.name}</div>
                            <div style={{ fontSize: 12, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.description || "Nicio descriere"}</div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <div style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 700, background: "rgba(76,175,130,0.15)", color: s.green }}>● Activ</div>
                              <div style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 700, background: "rgba(201,169,110,0.1)", color: s.accent }}>{svc.duration * 30} min</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: s.accent }}>{svc.price} lei</span>
                              <div style={{ display: "flex", gap: 5 }}>
                                <button style={{ padding: "5px 10px", borderRadius: 7, background: s.surface2, color: "#f0ede8", border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Editează</button>
                                <button style={{ padding: "5px 8px", borderRadius: 7, background: "rgba(224,90,90,0.08)", color: s.red, border: "1px solid rgba(224,90,90,0.2)", fontSize: 11, cursor: "pointer" }}>Șterge</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== CALENDAR ===== */}
          {activeSection === "calendar" && (
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗓</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Calendarul meu</div>
              <div style={{ fontSize: 13 }}>Calendarul cu sloturi reale vine în curând</div>
            </div>
          )}

          {/* ===== CERERI ===== */}
          {activeSection === "cereri" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10 }}>
                {[[pending.length.toString(),"În așteptare",s.yellow],[accepted.length.toString(),"Confirmate",s.green],[completed.length.toString(),"Finalizate",s.accent]].map(([val,label,color]) => (
                  <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 24, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Toate cererile</div>
                {bookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: s.muted }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Nicio cerere</div>
                  </div>
                ) : bookings.map((b: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < bookings.length - 1 ? `1px solid ${s.surface2}` : "none", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {b.client?.name?.charAt(0) || "C"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{b.client?.name || "Client"}</div>
                      <div style={{ fontSize: 12, color: s.muted }}>{b.service?.name} · {b.date} {b.time && `· ${b.time}`}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{b.totalPrice} lei</div>
                    {b.status === "pending" && (
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button style={{ padding: "6px 12px", borderRadius: 7, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", color: s.green, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>✓ Acceptă</button>
                        <button style={{ padding: "6px 10px", borderRadius: 7, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 11, cursor: "pointer" }}>✕</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== FINANCIAR ===== */}
          {activeSection === "financiar" && (
            <FinancialDashboard bookings={bookings} services={services} />
          )}

          {/* ===== REZERVARI CLIENT ===== */}
          {activeSection === "rezervari-client" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rezervările mele ca și Client</div>
                  <a href="/search" style={{ fontSize: 11, color: s.accent, textDecoration: "none", fontWeight: 600 }}>+ Caută servicii →</a>
                </div>
                {bookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: s.muted }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Nicio rezervare</div>
                    <a href="/search" style={{ color: s.accent, fontSize: 13, textDecoration: "none" }}>Caută un serviciu →</a>
                  </div>
                ) : bookings.map((b: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < bookings.length - 1 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📅</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{b.service?.name || "Serviciu"}</div>
                      <div style={{ fontSize: 12, color: s.muted }}>{b.date} {b.time && `· ${b.time}`}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{b.totalPrice} lei</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== MESAJE ===== */}
          {activeSection === "mesaje" && (
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Mesaje</div>
              <div style={{ fontSize: 13 }}>Conversațiile tale apar aici</div>
            </div>
          )}
          {/* ===== EDITARE PROFIL ===== */}
          {activeSection === "editare-profil" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
              {profileMsg && <div style={{ background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 10, padding: "12px 16px", color: s.green, fontSize: 13 }}>{profileMsg}</div>}

              {/* PREVIEW */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 60, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
                <div style={{ padding: "0 20px 16px", marginTop: -24, display: "flex", alignItems: "flex-end", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, overflow: "hidden" }}>
                    {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (profileForm.name || user.name)?.charAt(0)}
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>{profileForm.name || user.name}</div>
                    <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>{profileForm.oras && profileForm.judet ? `📍 ${profileForm.oras}, ${profileForm.judet}` : "📍 Locație necompletată"}</div>
                  </div>
                </div>
                {profileForm.description && <div style={{ padding: "0 20px 16px", fontSize: 13, color: s.muted, lineHeight: 1.6 }}>{profileForm.description}</div>}
              </div>

              {/* DATE PERSONALE */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Date personale</div>
                {([["name","Nume complet","Numele tău complet"],["phone","Telefon","07xx xxx xxx"]] as [string,string,string][]).map(([k,l,p]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{l}</div>
                    <input value={(profileForm as any)[k]} onChange={e => setProfileForm({ ...profileForm, [k]: e.target.value })} placeholder={p} style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Descriere / Bio</div>
                  <textarea value={profileForm.description} onChange={e => setProfileForm({ ...profileForm, description: e.target.value })} placeholder="Descrie-te pe scurt..." rows={3}
                    style={{ ...inputStyle, resize: "vertical" as const }}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{profileForm.description.length}/500</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Județ</div>
                    <select value={profileForm.judet} onChange={e => setProfileForm({ ...profileForm, judet: e.target.value })}
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Selectează județul</option>
                      {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Oraș</div>
                    <input value={profileForm.oras} onChange={e => setProfileForm({ ...profileForm, oras: e.target.value })} placeholder="ex: Oradea" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                </div>
              </div>

              {/* RETELE SOCIALE */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rețele sociale</div>
                {SOCIAL_PLATFORMS.map(p => (
                  <div key={p.key}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{p.label}</div>
                    <input value={(profileForm as any)[p.key]} onChange={e => setProfileForm({ ...profileForm, [p.key]: e.target.value })}
                      placeholder={`https://${p.key}.com/username`} style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                ))}
              </div>

              {/* GALERIE */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Galerie foto</div>
                <div style={{ fontSize: 13, color: s.muted }}>Adaugă până la 10 poze care apar pe profilul tău public.</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
                  {(user.gallery || []).map((img: string, i: number) => (
                    <div key={i} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", position: "relative", background: s.surface2 }}>
                      <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(224,90,90,0.9)", color: "#fff", border: "none", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                  ))}
                  {(user.gallery?.length || 0) < 10 && (
                    <label style={{ aspectRatio: "1", borderRadius: 10, border: `2px dashed ${s.border}`, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 6 }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = s.accent)} onMouseLeave={e => (e.currentTarget.style.borderColor = s.border)}>
                      <div style={{ fontSize: 24, color: s.muted }}>+</div>
                      <div style={{ fontSize: 10, color: s.muted }}>Adaugă foto</div>
                      <input type="file" accept="image/*" multiple style={{ display: "none" }} />
                    </label>
                  )}
                </div>
              </div>

              <button onClick={saveProfile} disabled={profileLoading} style={{ padding: "13px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: profileLoading ? 0.7 : 1 }}>
                {profileLoading ? "Se salvează..." : "Salvează profilul"}
              </button>
            </div>
          )}

          {/* ===== SETARI ===== */}
          {activeSection === "setari" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Schimbă parola</div>
                <div style={{ fontSize: 13, color: s.muted, marginBottom: 18 }}>Minim 8 caractere</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {([["current","Parola curentă","Parola actuală"],["new","Parolă nouă","Minim 8 caractere"],["confirm","Confirmă parola","Repetă parola"]] as [string,string,string][]).map(([k,l,p]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>{l}</div>
                      <input type="password" value={(passwords as any)[k]} onChange={e => setPasswords({ ...passwords, [k]: e.target.value })} placeholder={p} style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                    </div>
                  ))}
                </div>
                {pwError && <div style={{ marginTop: 12, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 8, padding: "10px 14px", color: s.red, fontSize: 13 }}>{pwError}</div>}
                {pwMsg && <div style={{ marginTop: 12, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, padding: "10px 14px", color: s.green, fontSize: 13 }}>{pwMsg}</div>}
                <button onClick={changePassword} disabled={pwLoading} style={{ marginTop: 16, padding: "11px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: pwLoading ? 0.7 : 1 }}>
                  {pwLoading ? "Se schimbă..." : "Schimbă parola"}
                </button>
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Cont</div>
                <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
                  style={{ padding: "10px 20px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Deconectare
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* BOTTOM NAV MOBILE */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#111", borderTop: `1px solid ${s.border}`, display: "flex", zIndex: 100 }}>
          {bottomNavItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "none", border: "none", color: activeSection === item.id ? s.accent : s.muted, fontSize: 9, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              <div style={{ fontSize: 18 }}>{item.icon}</div>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}