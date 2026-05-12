"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import Link from "next/link";
import FinancialDashboard from "@/components/dashboard/FinancialDashboard";

const JUDETE = ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","București","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea"];
const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { key: "website", label: "Website", placeholder: "https://website.ro" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
];

export default function UserProfilePage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("profil");
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [bookingFilter, setBookingFilter] = useState("toate");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ rezervareNoua: true, reminder: true, review: false, publicVisible: true });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", bio: "", judet: "", oras: "", address: "", facebook: "", instagram: "", tiktok: "", linkedin: "", website: "", youtube: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

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
      if (d.user?.role === "employee") { router.push("/dashboard/employee"); return; }
    });
    fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d.bookings || []));
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.services || []));
  }, []);

  const totalCheltuit = bookings.filter(b => b.status === "completed").reduce((a, b) => a + (b.totalPrice || 0), 0);
  const inAsteptareClient = bookings.filter(b => b.status === "pending").length;
  const sumaIncasata = 0;
  const rezervariFinalizate = bookings.filter(b => b.status === "completed").length;

  const inputStyle = { width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) { setError("Parolele nu coincid!"); return; }
    if (passwords.new.length < 8) { setError("Parola trebuie să aibă minim 8 caractere!"); return; }
    setLoading(true); setError(""); setMsg("");
    const res = await fetch("/api/auth/change-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
    });
    const data = await res.json();
    if (res.ok) { setMsg("Parola schimbată!"); setPasswords({ current: "", new: "", confirm: "" }); }
    else setError(data.error);
    setLoading(false);
    setTimeout(() => { setMsg(""); setError(""); }, 3000);
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: active ? "rgba(201,169,110,0.2)" : s.surface2, border: `1px solid ${active ? "rgba(201,169,110,0.4)" : s.border}`, display: "flex", alignItems: "center", padding: "0 4px", cursor: "pointer", justifyContent: active ? "flex-end" : "flex-start", transition: "all .2s", flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: active ? s.accent : "#444" }} />
    </div>
  );

  const sidebarSections = [
    { section: "client-header" },
    { id: "profil", icon: "🏠", label: "Profilul meu" },
    { id: "editare-profil", icon: "✏️", label: "Editează profilul" },
    { id: "rezervari", icon: "📅", label: "Rezervările mele" },
    { id: "mesaje", icon: "💬", label: "Mesaje" },
    { id: "recenzii-date", icon: "⭐", label: "Recenzii date" },
    { section: "prestator-header" },
    { id: "servicii", icon: "✂️", label: "Serviciile mele" },
    { id: "calendar", icon: "🗓", label: "Calendarul meu" },
    { id: "cereri", icon: "📋", label: "Cereri primite" },
    { id: "recenzii-primite", icon: "⭐", label: "Recenzii primite" },
    { section: "cont-header" },
    { id: "setari", icon: "⚙️", label: "Setări" },
    { id: "financiar", icon: "📊", label: "Situație financiară" },
  ];

  const bottomNavItems = [
    { id: "profil", icon: "🏠", label: "Profil" },
    { id: "rezervari", icon: "📅", label: "Rezervări" },
    { id: "servicii", icon: "✂️", label: "Servicii" },
    { id: "cereri", icon: "📋", label: "Cereri" },
    { id: "setari", icon: "⚙️", label: "Setări" },
  ];

  const getSectionTitle = () => {
    const titles: any = {
      profil: "Profilul meu", rezervari: "Rezervările mele", mesaje: "Mesaje",
      "recenzii-date": "Recenzii date", servicii: "Serviciile mele",
      calendar: "Calendarul meu", cereri: "Cereri primite",
      "recenzii-primite": "Recenzii primite", setari: "Setări", financiar: "Situație financiară",
    };
    return titles[activeSection] || "Dashboard";
  };

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex" }}>

      {/* SIDEBAR */}
      {!isMobile && (
        <div style={{ width: 220, background: "#111", borderRight: `1px solid ${s.border}`, position: "fixed", top: 0, left: 0, bottom: 0, display: "flex", flexDirection: "column", zIndex: 50 }}>
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${s.border}` }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: s.accent }}>aitimp.ro</div>
          </div>
          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            {sidebarSections.map((item: any, i) => {
              if (item.section) return (
                <div key={i} style={{ fontSize: 10, color: "#444", textTransform: "uppercase" as const, letterSpacing: "0.8px", padding: "10px 12px 4px" }}>
                  {item.section === "client-header" ? "Client" : item.section === "prestator-header" ? "Prestator" : "Cont"}
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
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{user.name?.charAt(0)}</div>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: 11, color: s.muted }}>Client & Prestator</div></div>
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
        {/* ===== PROFIL ===== */}
          {activeSection === "profil" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 70, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
                <div style={{ padding: "0 20px 20px", marginTop: -28, display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, flexShrink: 0 }}>
                    {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : user.name?.charAt(0)}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4, minWidth: 120 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>{user.oras && `📍 ${user.oras}`} · Membru din 2025</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, paddingBottom: 8 }}>
                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(90,141,224,0.1)", border: "1px solid rgba(90,141,224,0.2)", fontSize: 11, color: s.blue, fontWeight: 600 }}>👤 Client</div>
                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", fontSize: 11, color: s.accent, fontWeight: 600 }}>🔧 Prestator</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${s.border}` }}>
                  {[[bookings.length.toString(),"Rezervări"],[services.length.toString(),"Servicii"],["4.94","Rating"],["0","Recenzii"]].map(([val,label],i) => (
                    <div key={i} onClick={() => setActiveSection(i === 0 ? "rezervari" : i === 1 ? "servicii" : "recenzii-primite")} style={{ padding: isMobile ? "10px 8px" : "14px 16px", borderRight: i < 3 ? `1px solid ${s.border}` : "none", textAlign: "center", cursor: "pointer" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 20, fontWeight: 700, color: s.accent }}>{val}</div>
                      <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue }}>👤 Statistici Client</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10 }}>
                  {[[bookings.length.toString(),"Rezervări efectuate",s.accent],[inAsteptareClient.toString(),"În așteptare",s.yellow],[`${totalCheltuit} lei`,"Total cheltuit",s.green]].map(([val,label,color]) => (
                    <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.accent }}>🔧 Statistici Prestator</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
                  {[
                    [rezervariFinalizate.toString(),"Finalizate luna curentă",s.green,"vs luna trecută: 0"],
                    [inAsteptareClient.toString(),"În așteptare",s.yellow,"necesită aprobare"],
                    [`${sumaIncasata} lei`,"Încasat luna curentă",s.accent,"vs luna trecută: 0 lei"],
                    ["0","Recenzii primite",s.blue,"rating mediu: —"],
                  ].map(([val,label,color,sub]) => (
                    <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rezervări recente</div>
                  <button onClick={() => setActiveSection("rezervari")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                </div>
                {bookings.length === 0 ? (
                  <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>
                    Nicio rezervare încă. <button onClick={() => router.push("/search")} style={{ color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)", fontSize: 13 }}>Caută servicii →</button>
                  </div>
                ) : bookings.slice(0, 3).map((b: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{b.service?.icon || "📅"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{b.date}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{b.totalPrice} lei</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== EDITARE PROFIL ===== */}
          {activeSection === "editare-profil" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
              {profileMsg && <div style={{ background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 10, padding: "12px 16px", color: s.green, fontSize: 13 }}>{profileMsg}</div>}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 60, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
                <div style={{ padding: "0 20px 16px", marginTop: -24, display: "flex", alignItems: "flex-end", gap: 14 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, overflow: "hidden" }}>
                      {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (profileForm.name || user.name)?.charAt(0)}
                    </div>
                    <label style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${s.surface}`, fontSize: 9 }}>
                      ✏️<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const fd = new FormData(); fd.append("file", file); fetch("/api/profile/avatar", { method: "POST", body: fd }).then(r => r.json()).then(d => { if (d.url) setUser({ ...user, avatar: d.url }); }); }} />
                    </label>
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>{profileForm.name || user.name}</div>
                    <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>{profileForm.oras && profileForm.judet ? `📍 ${profileForm.oras}, ${profileForm.judet}` : "📍 Locație necompletată"}</div>
                  </div>
                </div>
                {profileForm.bio && <div style={{ padding: "0 20px 16px", fontSize: 13, color: s.muted, lineHeight: 1.6 }}>{profileForm.bio}</div>}
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Date personale</div>
                {([["name","Nume complet","Numele tău complet"],["phone","Telefon","07xx xxx xxx"]] as [string,string,string][]).map(([k,l,p]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{l}</div>
                    <input value={(profileForm as any)[k]} onChange={e => setProfileForm({ ...profileForm, [k]: e.target.value })} placeholder={p}
                      style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Descriere / Bio</div>
                  <textarea value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Descrie-te pe scurt..." rows={3}
                    style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const, resize: "vertical" as const }}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{profileForm.bio.length}/500</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Județ</div>
                    <select value={profileForm.judet} onChange={e => setProfileForm({ ...profileForm, judet: e.target.value })}
                      style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const, cursor: "pointer" }}>
                      <option value="">Selectează județul</option>
                      {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Oraș</div>
                    <input value={profileForm.oras} onChange={e => setProfileForm({ ...profileForm, oras: e.target.value })} placeholder="ex: Oradea"
                      style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                </div>
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rețele sociale</div>
                {SOCIAL_PLATFORMS.map(p => (
                  <div key={p.key}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{p.label}</div>
                    <input value={(profileForm as any)[p.key]} onChange={e => setProfileForm({ ...profileForm, [p.key]: e.target.value })} placeholder={p.placeholder}
                      style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                ))}
              </div>
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
                      <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          const fd = new FormData();
                          fd.append("file", file);
                          fetch("/api/profile/gallery", { method: "POST", body: fd })
                            .then(r => r.json()).then(d => { if (d.url) setUser({ ...user, gallery: [...(user.gallery || []), d.url] }); });
                        });
                      }} />
                    </label>
                  )}
                </div>
              </div>

              <button onClick={async () => {
                setProfileLoading(true);
                const res = await fetch("/api/profile/update", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone, bio: profileForm.bio, judet: profileForm.judet, oras: profileForm.oras, address: profileForm.address, socialLinks: { facebook: profileForm.facebook, instagram: profileForm.instagram, tiktok: profileForm.tiktok, linkedin: profileForm.linkedin, website: profileForm.website, youtube: profileForm.youtube } }) });
                if (res.ok) { setProfileMsg("Profil actualizat cu succes!"); setTimeout(() => setProfileMsg(""), 3000); }
                setProfileLoading(false);
              }} disabled={profileLoading} style={{ padding: "13px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: profileLoading ? 0.7 : 1 }}>
                {profileLoading ? "Se salvează..." : "Salvează profilul"}
              </button>
            </div>
          )}

          {/* ===== REZERVARI ===== */}
          {activeSection === "rezervari" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10 }}>
                {[[bookings.length.toString(),"Total rezervări",s.accent],[inAsteptareClient.toString(),"În așteptare",s.yellow],[`${totalCheltuit} lei`,"Total cheltuit",s.green]].map(([val,label,color]) => (
                  <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 24, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["toate","pending","accepted","completed","cancelled"].map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${bookingFilter === f ? s.accent : s.border}`, background: bookingFilter === f ? "rgba(201,169,110,0.1)" : s.surface, color: bookingFilter === f ? s.accent : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    {f === "toate" ? "Toate" : f === "pending" ? "Așteptare" : f === "accepted" ? "Confirmate" : f === "completed" ? "Finalizate" : "Anulate"}
                  </button>
                ))}
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                {(bookingFilter === "toate" ? bookings : bookings.filter(b => b.status === bookingFilter)).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: s.muted }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Nicio rezervare</div>
                    <button onClick={() => router.push("/search")} style={{ marginTop: 8, padding: "9px 20px", background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`, borderRadius: 8, fontSize: 13, color: s.accent, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Caută servicii →</button>
                  </div>
                ) : (bookingFilter === "toate" ? bookings : bookings.filter(b => b.status === bookingFilter)).map((b: any, i: number, arr: any[]) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${s.surface2}` : "none", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{b.service?.icon || "📅"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{b.service?.name || "Serviciu"}</div>
                      <div style={{ fontSize: 12, color: s.muted }}>{b.date} {b.time && `· ${b.time}`}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label || b.status}</div>
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
              <div style={{ fontSize: 13, marginBottom: 20 }}>Conversațiile tale cu prestatorii apar aici</div>
              <button onClick={() => router.push("/search")} style={{ padding: "10px 24px", background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`, borderRadius: 9, fontSize: 13, color: s.accent, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Caută un prestator →</button>
            </div>
          )}

          {/* ===== RECENZII DATE ===== */}
          {activeSection === "recenzii-date" && (
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Recenzii date</div>
              <div style={{ fontSize: 13 }}>Recenziile apar după finalizarea unui serviciu</div>
            </div>
          )}

          {/* ===== SERVICII ===== */}
          {activeSection === "servicii" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={{ padding: "9px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adaugă serviciu</button>
              </div>
              {services.length === 0 ? (
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Niciun serviciu</div>
                  <div style={{ fontSize: 13, marginBottom: 20 }}>Adaugă primul serviciu pentru a fi vizibil în căutări</div>
                  <button style={{ padding: "10px 24px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adaugă serviciu</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {services.map((svc: any, idx: number) => {
                    const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                    const accent = colors[idx % colors.length];
                    return (
                      <div key={svc.id} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, overflow: "hidden", display: "flex", transition: "border-color .2s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.4)"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = s.border}>
                        <div style={{ width: 4, background: accent, flexShrink: 0 }} />
                        <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.name}</div>
                              {svc.description && <div style={{ fontSize: 12, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.description}</div>}
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                              <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                            <div style={{ padding: "3px 10px", borderRadius: 5, fontSize: 10, fontWeight: 700, background: "rgba(76,175,130,0.15)", color: s.green }}>● Activ</div>
                            <div style={{ padding: "3px 10px", borderRadius: 5, fontSize: 10, fontWeight: 700, background: "rgba(201,169,110,0.1)", color: s.accent }}>0 rezervări</div>
                          </div>
                          <div style={{ display: "flex", gap: 7 }}>
                            <button style={{ padding: "7px 14px", borderRadius: 7, background: s.surface2, color: "#f0ede8", border: `1px solid ${s.border}`, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Editează</button>
                            <button style={{ padding: "7px 10px", borderRadius: 7, background: "rgba(224,90,90,0.08)", color: s.red, border: "1px solid rgba(224,90,90,0.2)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Șterge</button>
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
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Cereri primite</div>
                <div style={{ fontSize: 11, color: s.muted }}>0 cereri noi</div>
              </div>
              <div style={{ textAlign: "center", padding: "40px 0", color: s.muted }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Nicio cerere nouă</div>
                <div style={{ fontSize: 13 }}>Cererile de rezervare de la clienți apar aici</div>
              </div>
            </div>
          )}

          {/* ===== RECENZII PRIMITE ===== */}
          {activeSection === "recenzii-primite" && (
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Recenzii primite</div>
              <div style={{ fontSize: 13 }}>Recenziile de la clienți apar după finalizarea serviciilor</div>
            </div>
          )}

          {/* ===== FINANCIAR ===== */}
          {activeSection === "financiar" && (
            <FinancialDashboard bookings={bookings} services={services} />
          )}

          {/* ===== SETARI ===== */}
          {activeSection === "setari" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Schimbă parola</div>
                <div style={{ fontSize: 13, color: s.muted, marginBottom: 18 }}>Minim 8 caractere</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[["current","Parola curentă","Parola actuală"],["new","Parolă nouă","Minim 8 caractere"],["confirm","Confirmă parola","Repetă parola"]].map(([k,l,p]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>{l}</div>
                      <input type="password" value={(passwords as any)[k]} onChange={e => setPasswords({ ...passwords, [k]: e.target.value })} placeholder={p} style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                    </div>
                  ))}
                </div>
                {error && <div style={{ marginTop: 12, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 8, padding: "10px 14px", color: s.red, fontSize: 13 }}>{error}</div>}
                {msg && <div style={{ marginTop: 12, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, padding: "10px 14px", color: s.green, fontSize: 13 }}>{msg}</div>}
                <button onClick={changePassword} disabled={loading} style={{ marginTop: 16, width: isMobile ? "100%" : "auto", padding: "11px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Se schimbă..." : "Schimbă parola"}
                </button>
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Notificări email</div>
                {[
                  ["rezervareNoua","Rezervare nouă","Când cineva face o rezervare la tine"],
                  ["reminder","Reminder","Cu o zi și o oră înainte"],
                  ["review","Review nou","Când primești o recenzie"],
                  ["publicVisible","Profil public vizibil","Apari în rezultatele de căutare"],
                ].map(([k,l,d],i) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 3 ? `1px solid ${s.surface2}` : "none", gap: 12 }}>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{l}</div><div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>{d}</div></div>
                    <Toggle active={(notifications as any)[k]} onToggle={() => setNotifications({ ...notifications, [k]: !(notifications as any)[k] })} />
                  </div>
                ))}
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Cont</div>
                <div style={{ fontSize: 13, color: s.muted, marginBottom: 16 }}>Gestionează sesiunea</div>
                <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
                  style={{ padding: "10px 20px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", width: isMobile ? "100%" : "auto" }}>
                  Deconectare
                </button>
              </div>
              <div style={{ background: s.surface, border: "1px solid rgba(224,90,90,0.2)", borderRadius: 14, padding: isMobile ? 18 : 24 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4, color: s.red }}>Zonă periculoasă</div>
                <div style={{ fontSize: 13, color: s.muted, marginBottom: 16 }}>Acțiuni ireversibile</div>
                <button style={{ padding: "10px 20px", background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 10, color: s.red, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", width: isMobile ? "100%" : "auto" }}>
                  Șterge contul
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