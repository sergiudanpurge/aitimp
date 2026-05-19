"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import Link from "next/link";
import FinancialDashboard from "@/components/dashboard/FinancialDashboard";
import RezervariMele from "@/components/dashboard/RezervariMele";

const JUDETE = ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","București","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea"];
const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/username", color: "#1877F2", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username", color: "#E4405F", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username", color: "#010101", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/></svg>' },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username", color: "#0A66C2", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
  { key: "website", label: "Website", placeholder: "https://website.ro", color: "#c9a96e", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>' },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel", color: "#FF0000", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
  { key: "whatsapp", label: "WhatsApp", placeholder: "+40712345678", color: "#25D366", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' },
  { key: "contactEmail", label: "Email contact", placeholder: "contact@example.ro", color: "#c9a96e", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
];

const MOCK_CONTACTS_USER = [
  { id: "p1", name: "Mirel Popescu", lastMsg: "Va asteptam marti la 14:30!", time: "10:33", unread: 1, isOnline: true, avatar: null },
  { id: "p2", name: "Ioana Danila", lastMsg: "Multumesc pentru rezervare!", time: "Ieri", unread: 0, isOnline: false, avatar: null },
  { id: "p3", name: "Color Craft Studio", lastMsg: "Cu placere, reveniti oricand!", time: "Lun", unread: 0, isOnline: true, avatar: null },
];
const MOCK_MSGS_USER: any = {
  p1: [
    { id:1, fromMe:false, text:"Buna ziua! Confirmat programarea pentru marti la 14:30.", time:"10:20", read:true },
    { id:2, fromMe:true, text:"Multumesc! O sa fiu punctual.", time:"10:22", read:true },
    { id:3, fromMe:false, text:"Va asteptam marti la 14:30! Daca aveti intrebari nu ezitati.", time:"10:33", read:false },
  ],
  p2: [
    { id:1, fromMe:true, text:"Buna! As dori un balayage, aveti disponibilitate joi?", time:"09:00", read:true },
    { id:2, fromMe:false, text:"Buna! Da, joi avem de la 11:00. Doriti sa rezervati?", time:"09:15", read:true },
    { id:3, fromMe:true, text:"Da, va rog la 11:00!", time:"09:20", read:true },
    { id:4, fromMe:false, text:"Multumesc pentru rezervare!", time:"09:22", read:true },
  ],
  p3: [
    { id:1, fromMe:false, text:"Buna ziua! Cum va putem ajuta?", time:"Lun", read:true },
    { id:2, fromMe:true, text:"Vreau informatii despre servicii.", time:"Lun", read:true },
    { id:3, fromMe:false, text:"Cu placere, reveniti oricand!", time:"Lun", read:true },
  ],
};

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
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", description: "", judet: "", oras: "", adresa: "", facebook: "", instagram: "", tiktok: "", website: "", youtube: "", linkedin: "", whatsapp: "", contactEmail: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [activeChatContact, setActiveChatContact] = useState<any>(MOCK_CONTACTS_USER[0]);
  const [chatMsgs, setChatMsgs] = useState<any[]>(MOCK_MSGS_USER["p1"]);
  const [chatInput, setChatInput] = useState("");
  const [emailVisible, setEmailVisible] = useState(true);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calSelectedDay, setCalSelectedDay] = useState<number | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: "", duration: "1", price: "", icon: "✂️" });
  const [serviceLoading, setServiceLoading] = useState(false);

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
        name: u.name || "",
        phone: u.phone || "",
        description: u.description || "",
        judet: u.judet || "",
        oras: u.oras || "",
        adresa: u.adresa || "",
        facebook: u.facebook || "",
        instagram: u.instagram || "",
        tiktok: u.tiktok || "",
        website: u.website || "",
        youtube: u.youtube || "",
        linkedin: u.linkedin || "",
        whatsapp: u.whatsapp || "",
        contactEmail: u.contactEmail || "",
      });
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

  const saveService = async () => {
    if (!newService.name || !newService.price) return;
    setServiceLoading(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newService.name, duration: parseInt(newService.duration), price: parseFloat(newService.price), icon: newService.icon }),
    });
    if (res.ok) {
      const d = await res.json();
      setServices(prev => [...prev, d.service]);
      setNewService({ name: "", duration: "1", price: "", icon: "✂️" });
      setShowAddService(false);
    }
    setServiceLoading(false);
  };

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
    { section: "Client" },
    { id: "profil", icon: "⚡", label: "Dashboard" },
    { id: "editare-profil", icon: "✏️", label: "Editeaza Profilul" },
    { id: "rezervari", icon: "🗓", label: "Rezervarile mele" },
    { id: "recenzii-date", icon: "⭐", label: "Recenzii oferite" },
    { section: "Prestator" },
    { id: "servicii", icon: "✂️", label: "Serviciile mele" },
    { id: "calendar", icon: "📅", label: "Calendarul meu" },
    { id: "cereri", icon: "📋", label: "Programari" },
    { id: "recenzii-primite", icon: "💬", label: "Recenzii primite" },
    { section: "Cont" },
    { id: "mesaje", icon: "💬", label: "Mesaje" },
    { id: "setari", icon: "⚙️", label: "Setari" },
    { id: "financiar", icon: "📊", label: "Situatie financiara" },
  ];

  const bottomNavItems = [
    { id: "profil", icon: "⚡", label: "Home" },
    { id: "calendar", icon: "📅", label: "Calendar" },
    { id: "cereri", icon: "📋", label: "Programari" },
    { id: "mesaje", icon: "💬", label: "Mesaje" },
    { id: "setari", icon: "⚙️", label: "Cont" },
  ];

const getSectionTitle = () => {
    const titles: any = {
      profil: "Dashboard", rezervari: "Rezervările mele", mesaje: "Mesaje",
      "recenzii-date": "Recenzii date", servicii: "Serviciile mele",
      calendar: "Calendarul meu", cereri: "Cereri primite",
      "recenzii-primite": "Recenzii primite", setari: "Setări", financiar: "Situație financiară",
      "editare-profil": "Editează profilul",
    };
    return titles[activeSection] || "Dashboard";
  };

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  // Modal inline
    <div onClick={() => setShowAddService(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 16, padding: 24, width: "100%", maxWidth: 480 }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>+ Adauga serviciu</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Icon</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["✂️","💆","💅","🎨","🔧","💻","📸","🏋️","🚗","🧹","⭐","💈"].map(ic => (
                <button key={ic} onClick={() => setNewService({...newService, icon: ic})} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${newService.icon === ic ? s.accent : s.border}`, background: newService.icon === ic ? "rgba(201,169,110,0.15)" : s.surface2, fontSize: 18, cursor: "pointer" }}>{ic}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Nume serviciu *</div>
            <input value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} placeholder="ex: Tuns + Styling" style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
              onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Durata</div>
              <select value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
                {[1,2,3,4,6,8].map(d => <option key={d} value={d}>{d * 30} min</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Pret (lei) *</div>
              <input type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} placeholder="ex: 50" style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button onClick={() => setShowAddService(false)} style={{ flex: 1, padding: "11px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Anuleaza</button>
            <button onClick={saveService} disabled={serviceLoading || !newService.name || !newService.price} style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: (!newService.name || !newService.price) ? 0.5 : 1 }}>
              {serviceLoading ? "Se adauga..." : "Adauga serviciu"}
            </button>
          </div>
        </div>
      </div>
    </div>


  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex" }}>

      {/* MODAL ADAUGA SERVICIU */}
      {showAddService && (
        <div onClick={() => setShowAddService(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 16, padding: 24, width: "100%", maxWidth: 480 }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>+ Adauga serviciu</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Icon</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["✂️","💆","💅","🎨","🔧","💻","📸","🏋️","🚗","🧹","⭐","💈"].map(ic => (
                    <button key={ic} onClick={() => setNewService({...newService, icon: ic})} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${newService.icon === ic ? s.accent : s.border}`, background: newService.icon === ic ? "rgba(201,169,110,0.15)" : s.surface2, fontSize: 18, cursor: "pointer" }}>{ic}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Nume serviciu *</div>
                <input value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} placeholder="ex: Tuns + Styling" style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                  onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Durata</div>
                  <select value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
                    {[1,2,3,4,6,8].map(d => <option key={d} value={d}>{d * 30} min</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Pret (lei) *</div>
                  <input type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} placeholder="ex: 50" style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button onClick={() => setShowAddService(false)} style={{ flex: 1, padding: "11px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Anuleaza</button>
                <button onClick={saveService} disabled={serviceLoading || !newService.name || !newService.price} style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: (!newService.name || !newService.price) ? 0.5 : 1 }}>
                  {serviceLoading ? "Se adauga..." : "Adauga serviciu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                  {item.section}
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
            
              {!isMobile && <>
                <a href="/" style={{ padding: "7px 12px", background: "transparent", border: "none", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, cursor: "pointer", textDecoration: "none", fontFamily: "var(--font-outfit)" }}>🏠 Home</a>
                <a href="/despre" style={{ padding: "7px 12px", background: "transparent", border: "none", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, cursor: "pointer", textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Despre noi</a>
                <a href="/contact" style={{ padding: "7px 12px", background: "transparent", border: "none", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, cursor: "pointer", textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Contact</a>
              </>}
              <button onClick={() => router.push("/search")} style={{ padding: "7px 14px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
  {isMobile ? "🔍" : "🔍 Cauta servicii"}
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
        {/* ===== PROFIL / DASHBOARD ===== */}
          {activeSection === "profil" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* CARD PRINCIPAL */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 80, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
                <div style={{ padding: "0 20px 16px", marginTop: -32, display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, overflow: "hidden" }}>
                      {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.charAt(0)}
                    </div>
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4, minWidth: 140 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 17 : 20, fontWeight: 700 }}>{user.name}</div>
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: isMobile ? 4 : 10, marginTop: 4 }}>
                      {(profileForm.oras || profileForm.judet) && <span style={{ fontSize: 12, color: s.muted }}>📍 {profileForm.oras}{profileForm.judet && `, ${profileForm.judet}`}</span>}
                      {profileForm.phone && <span style={{ fontSize: 12, color: s.muted }}>📞 {profileForm.phone}</span>}
                      {user.email && <span style={{ fontSize: 12, color: s.muted }}>✉️ {user.email}</span>}
                      
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, paddingBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(90,141,224,0.1)", border: "1px solid rgba(90,141,224,0.2)", fontSize: 11, color: s.blue, fontWeight: 600 }}>👤 Client</div>
                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", fontSize: 11, color: s.accent, fontWeight: 600 }}>🔧 Prestator</div>
                    <button onClick={() => setActiveSection("editare-profil")} style={{ padding: "5px 12px", borderRadius: 8, background: s.surface2, border: `1px solid ${s.border}`, fontSize: 11, color: s.muted, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✏️ Editează</button>
                  </div>
                </div>

                {profileForm.description && (
                  <div style={{ padding: "0 20px 12px", fontSize: 13, color: s.muted, lineHeight: 1.7 }}>{profileForm.description}</div>
                )}

                {SOCIAL_PLATFORMS.some(p => (profileForm as any)[p.key]) && (
                  <div style={{ padding: "0 20px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SOCIAL_PLATFORMS.filter(p => (profileForm as any)[p.key]).map(p => (
                      <a key={p.key} href={(profileForm as any)[p.key]} target="_blank" rel="noopener noreferrer"
                        style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", color: (p as any).color || "#c9a96e", textDecoration: "none" }}
                        title={p.label}>
                        <span dangerouslySetInnerHTML={{ __html: (p as any).icon || p.label }} />
                      </a>
                    ))}
                  </div>
                )}

                

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${s.border}` }}>
                  {[[bookings.length.toString(),"Rezervări"],[services.length.toString(),"Servicii"],["4.94","Rating"],["0","Recenzii"]].map(([val,label],i) => (
                    <div key={i} onClick={() => setActiveSection(i === 0 ? "rezervari" : i === 1 ? "servicii" : "recenzii-primite")} style={{ padding: isMobile ? "10px 8px" : "12px 16px", borderRight: i < 3 ? `1px solid ${s.border}` : "none", textAlign: "center", cursor: "pointer" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 20, fontWeight: 700, color: s.accent }}>{val}</div>
                      <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTIUNEA CLIENT */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20, borderTop: "3px solid rgba(90,141,224,0.6)" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue }}>👤 Client</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                  {[[bookings.length.toString(),"Rezervări efectuate",s.accent],[inAsteptareClient.toString(),"În așteptare",s.yellow],[totalCheltuit + " lei","Total cheltuit",s.green]].map(([val,label,color]) => (
                    <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Rezervări recente</div>
                  <button onClick={() => setActiveSection("rezervari")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                </div>
                {bookings.length === 0 ? (
                  <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "16px 0" }}>
                    Nicio rezervare. <button onClick={() => router.push("/search")} style={{ color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)", fontSize: 13 }}>Caută servicii →</button>
                  </div>
                ) : bookings.slice(0, 3).map((b: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < 2 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📅</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{b.date}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{b.totalPrice} lei</div>
                  </div>
                ))}
              </div>

              {/* GALERIE */}
              {user.gallery && user.gallery.length > 0 && (
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Galerie foto</div>
                    <button onClick={() => setActiveSection("editare-profil")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Gestioneaza →</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "80px" : "100px"}, 1fr))`, gap: 8 }}>
                    {user.gallery.map((img: string, i: number) => (
                      <div key={i} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: `1px solid ${s.border}`, cursor: "pointer" }}>
                        <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .2s" }}
                          onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"}
                          onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTIUNEA PRESTATOR */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20, borderTop: "3px solid rgba(201,169,110,0.4)" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.accent }}>🔧 Prestator</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    [rezervariFinalizate.toString(),"Finalizate",s.green,"luna curentă"],
                    [inAsteptareClient.toString(),"În așteptare",s.yellow,"necesită aprobare"],
                    [sumaIncasata + " lei","Încasat",s.accent,"luna curentă"],
                    ["0","Recenzii",s.blue,"rating: —"],
                  ].map(([val,label,color,sub]) => (
                    <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>{label}</div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>{sub}</div>
                    </div>
                  ))}
                </div>

                {/* Servicii */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Serviciile mele</div>
                  <button onClick={() => setActiveSection("servicii")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                </div>
                {services.length === 0 ? (
                  <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "12px 0", marginBottom: 16 }}>
                    Niciun serviciu. <button onClick={() => setActiveSection("servicii")} style={{ color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)", fontSize: 13 }}>Adaugă →</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {services.slice(0, 3).map((svc: any, idx: number) => {
                      const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b"];
                      return (
                        <div key={svc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", background: s.surface2, borderRadius: 10, borderLeft: `3px solid ${colors[idx % colors.length]}` }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.name}</div>
                            <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min</div>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                
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
                {profileForm.description && <div style={{ padding: "0 20px 16px", fontSize: 13, color: s.muted, lineHeight: 1.6 }}>{profileForm.description}</div>}
                {SOCIAL_PLATFORMS.some(p => (profileForm as any)[p.key]) && (
                  <div style={{ padding: "0 20px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SOCIAL_PLATFORMS.filter(p => (profileForm as any)[p.key]).map(p => (
                      <a key={p.key} href={(profileForm as any)[p.key]} target="_blank" rel="noopener noreferrer"
                        style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "center", color: (p as any).color || "#c9a96e", textDecoration: "none" }}
                        title={p.label}>
                        <span dangerouslySetInnerHTML={{ __html: (p as any).icon || p.label }} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Date personale</div>
              <div>
                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Email (nu poate fi modificat)</div>
                <input value={user?.email || ""} disabled style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const, cursor: "not-allowed" }} />
              </div>
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
                  <textarea value={profileForm.description} onChange={e => setProfileForm({ ...profileForm, description: e.target.value })} placeholder="Descrie-te pe scurt..." rows={3}
                    style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const, resize: "vertical" as const }}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{profileForm.description.length}/500</div>
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
                    <div key={i} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", position: "relative", background: s.surface2, border: i === 0 ? `2px solid ${s.accent}` : `1px solid ${s.border}` }}>
                      <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {i === 0 && <div style={{ position: "absolute", top: 4, left: 4, padding: "2px 7px", borderRadius: 5, background: "rgba(201,169,110,0.9)", color: "#0a0a0a", fontSize: 9, fontWeight: 700 }}>BANNER</div>}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", gap: 2, padding: 4, background: "linear-gradient(to top,rgba(0,0,0,0.8),transparent)" }}>
                        {i !== 0 && <button onClick={e => { e.stopPropagation(); const g=[...(user.gallery||[])]; g.splice(i,1); g.unshift(img); setUser({...user,gallery:g}); fetch("/api/profile/gallery/reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gallery:g})}); }} style={{ flex:1,padding:"3px",borderRadius:4,background:"rgba(201,169,110,0.8)",color:"#0a0a0a",border:"none",fontSize:9,fontWeight:700,cursor:"pointer" }}>📌</button>}
                        <button onClick={e => { e.stopPropagation(); const g=(user.gallery||[]).filter((_:string,gi:number)=>gi!==i); setUser({...user,gallery:g}); fetch("/api/profile/gallery",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({index:i})}); }} style={{ flex:1,padding:"3px",borderRadius:4,background:"rgba(224,90,90,0.8)",color:"#fff",border:"none",fontSize:9,fontWeight:700,cursor:"pointer" }}>✕</button>
                      </div>
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
                const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone, description: profileForm.description, judet: profileForm.judet, oras: profileForm.oras, adresa: profileForm.adresa, facebook: profileForm.facebook, instagram: profileForm.instagram, tiktok: profileForm.tiktok, website: profileForm.website, youtube: profileForm.youtube, linkedin: profileForm.linkedin, whatsapp: profileForm.whatsapp, contactEmail: profileForm.contactEmail }) });
                if (res.ok) { setProfileMsg("Profil actualizat cu succes!"); setTimeout(() => setProfileMsg(""), 3000); }
                setProfileLoading(false);
              }} disabled={profileLoading} style={{ padding: "13px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: profileLoading ? 0.7 : 1 }}>
                {profileLoading ? "Se salvează..." : "Salvează profilul"}
              </button>
            </div>
          )}

          {/* ===== REZERVARI ===== */}
          {activeSection === "rezervari" && (
            <RezervariMele bookings={bookings} mockBookings={[
  { id:"ru1", date:"2026-05-10", time:"10:00", status:"completed", totalPrice:45, service:{name:"Tuns + Styling", icon:"✂️"}, provider:{user:{name:"Mirel Popescu"}} },
  { id:"ru2", date:"2026-05-15", time:"14:00", status:"completed", totalPrice:180, service:{name:"Vopsit complet", icon:"🎨"}, provider:{user:{name:"Ioana Danila"}} },
  { id:"ru3", date:"2026-05-18", time:"11:00", status:"accepted", totalPrice:120, service:{name:"Coafat ocazie", icon:"💆"}, provider:{user:{name:"Ioana Danila"}} },
  { id:"ru4", date:"2026-05-20", time:"09:30", status:"pending", totalPrice:250, service:{name:"Balayage", icon:"💅"}, provider:{user:{name:"Ioana Danila"}} },
  { id:"ru5", date:"2026-05-23", time:"10:00", status:"accepted", totalPrice:45, service:{name:"Tuns", icon:"✂️"}, provider:{user:{name:"Mirel Popescu"}} },
]} showProvider={true} />
          )}

          {/* ===== MESAJE ===== */}
          {activeSection === "mesaje" && (
            <div style={{ display: "flex", gap: 0, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden", height: isMobile ? "70vh" : 560 }}>
              {/* CONTACTE */}
              {!isMobile && (
                <div style={{ width: 240, borderRight: `1px solid ${s.border}`, display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${s.border}`, fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600 }}>Mesaje</div>
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {MOCK_CONTACTS_USER.map(contact => (
                      <div key={contact.id} onClick={() => { setActiveChatContact(contact); setChatMsgs(MOCK_MSGS_USER[contact.id] || []); }}
                        style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: activeChatContact?.id === contact.id ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: activeChatContact?.id === contact.id ? `3px solid ${s.accent}` : "3px solid transparent" }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{contact.name.charAt(0)}</div>
                          {contact.isOnline && <div style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, borderRadius: "50%", background: s.green, border: `2px solid ${s.surface}` }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.name}</div>
                          <div style={{ fontSize: 11, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.lastMsg}</div>
                        </div>
                        {contact.unread > 0 && <div style={{ width: 16, height: 16, borderRadius: "50%", background: s.accent, color: "#0a0a0a", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{contact.unread}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* CONVERSATIE */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{activeChatContact?.name?.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{activeChatContact?.name}</div>
                    <div style={{ fontSize: 11, color: activeChatContact?.isOnline ? s.green : s.muted }}>{activeChatContact?.isOnline ? "Online" : "Offline"}</div>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {chatMsgs.map((msg: any, i: number) => (
                    <div key={i} style={{ display: "flex", flexDirection: msg.fromMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 6 }}>
                      <div style={{ maxWidth: "75%" }}>
                        <div style={{ padding: "8px 12px", borderRadius: msg.fromMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.fromMe ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, color: msg.fromMe ? "#0a0a0a" : "#f0ede8", fontSize: 13, lineHeight: 1.5 }}>{msg.text}</div>
                        <div style={{ fontSize: 10, color: s.muted, marginTop: 2, textAlign: msg.fromMe ? "right" : "left" }}>{msg.time} {msg.fromMe && <span style={{ color: msg.read ? s.accent : s.muted }}>✓✓</span>}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 12px", borderTop: `1px solid ${s.border}`, display: "flex", gap: 8, flexShrink: 0 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && chatInput.trim()) { const now = new Date(); setChatMsgs(prev => [...prev, { id: Date.now(), fromMe: true, text: chatInput, time: now.getHours()+":"+String(now.getMinutes()).padStart(2,"0"), read: false }]); setChatInput(""); } }}
                    placeholder="Scrie un mesaj..." style={{ flex: 1, background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 20, padding: "8px 14px", color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }} />
                  <button onClick={() => { if (!chatInput.trim()) return; const now = new Date(); setChatMsgs(prev => [...prev, { id: Date.now(), fromMe: true, text: chatInput, time: now.getHours()+":"+String(now.getMinutes()).padStart(2,"0"), read: false }]); setChatInput(""); }}
                    style={{ width: 38, height: 38, borderRadius: "50%", background: chatInput.trim() ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, border: "none", color: chatInput.trim() ? "#0a0a0a" : s.muted, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
                </div>
              </div>
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
                <button onClick={() => setShowAddService(true)} style={{ padding: "9px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Adaugă serviciu</button>
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
  const accentColors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
  const sqColors = [["#c9a96e","#8b5e3c","#5a3a20"],["#5a8de0","#3a6abf","#1a4a9e"],["#4caf82","#2a8f62","#0a6f42"],["#e8b84b","#c9902a","#a06810"],["#e05a5a","#c03a3a","#a02020"],["#a78de0","#7a5abf","#5a3a9e"]];
  const accent = accentColors[idx % accentColors.length];
  const sq = sqColors[idx % sqColors.length];
  const galleryImg = user.gallery?.[idx % (user.gallery?.length || 1)];
  return (
    <div key={svc.id} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, overflow: "hidden", display: "flex", height: 110, transition: "all .22s" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(201,169,110,0.5)"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,.3)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = s.border; el.style.transform = "none"; el.style.boxShadow = "none"; }}>

      {/* THUMB */}
      <div style={{ width: 110, flexShrink: 0, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 6, padding: 12, position: "relative", overflow: "hidden" }}>
        {galleryImg
          ? <img src={galleryImg} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          : sq.map((c, i) => <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: c, opacity: 1 - i * 0.25, flexShrink: 0 }} />)
        }
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
      </div>

      {/* BODY */}
      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{svc.name}</div>
          <div style={{ fontSize: 12, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.description || "Nicio descriere"}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 700, background: "rgba(76,175,130,0.15)", color: s.green }}>● Activ</div>
            <div style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 700, background: "rgba(201,169,110,0.1)", color: s.accent }}>0 rez.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: s.accent }}>{svc.price} lei</span>
            <div style={{ display: "flex", gap: 5 }}>
              <button style={{ padding: "5px 10px", borderRadius: 7, background: s.surface2, color: "#f0ede8", border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Editează</button>
              <button style={{ padding: "5px 8px", borderRadius: 7, background: "rgba(224,90,90,0.08)", color: s.red, border: "1px solid rgba(224,90,90,0.2)", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Șterge</button>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(() => {
                const mockBk = [
                  { id:"u1", date: new Date(2026,4,15).toISOString(), time:"10:00", status:"completed", totalPrice:45, service:{name:"Tuns + Styling"}, provider:{user:{name:"Mirel Popescu"}} },
                  { id:"u2", date: new Date(2026,4,17).toISOString(), time:"14:00", status:"completed", totalPrice:180, service:{name:"Vopsit complet"}, provider:{user:{name:"Ioana Danila"}} },
                  { id:"u3", date: new Date(2026,4,18).toISOString(), time:"11:00", status:"accepted", totalPrice:120, service:{name:"Coafat ocazie"}, provider:{user:{name:"Ioana Danila"}} },
                  { id:"u4", date: new Date(2026,4,20).toISOString(), time:"09:30", status:"pending", totalPrice:250, service:{name:"Balayage"}, provider:{user:{name:"Ioana Danila"}} },
                  { id:"u5", date: new Date(2026,4,23).toISOString(), time:"10:00", status:"accepted", totalPrice:45, service:{name:"Tuns"}, provider:{user:{name:"Mirel Popescu"}} },
                ];
                const allBk = [...(bookings||[]), ...mockBk];
                return (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <button onClick={() => setCalMonth(m => m === 0 ? 11 : m - 1)} style={{ width: 32, height: 32, borderRadius: 8, background: s.surface, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, minWidth: 140, textAlign: "center" }}>
                        {new Date(calYear, calMonth).toLocaleDateString("ro-RO", { month: "long", year: "numeric" })}
                      </div>
                      <button onClick={() => setCalMonth(m => m === 11 ? 0 : m + 1)} style={{ width: 32, height: 32, borderRadius: 8, background: s.surface, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                      <button onClick={() => { setCalMonth(new Date().getMonth()); setCalYear(new Date().getFullYear()); }} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`, color: s.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Azi</button>
                    </div>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {[["#4caf82","Confirmat"],["#e8b84b","In asteptare"],["#c9a96e","Finalizat"]].map(([color,label]) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                          <span style={{ fontSize: 12, color: s.muted }}>{label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: `1px solid ${s.border}` }}>
                        {["Lun","Mar","Mie","Joi","Vin","Sam","Dum"].map(dz => (
                          <div key={dz} style={{ padding: isMobile ? "8px 4px" : "10px", textAlign: "center", fontSize: 11, fontWeight: 600, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{dz}</div>
                        ))}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                        {(() => {
                          const firstDay = new Date(calYear, calMonth, 1).getDay();
                          const offset = firstDay === 0 ? 6 : firstDay - 1;
                          const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                          const cells: (number|null)[] = [];
                          for (let i = 0; i < offset; i++) cells.push(null);
                          for (let dz = 1; dz <= daysInMonth; dz++) cells.push(dz);
                          const todayD = new Date();
                          return cells.map((day, idx2) => {
                            const isToday = day && todayD.getDate() === day && todayD.getMonth() === calMonth && todayD.getFullYear() === calYear;
                            const dayBk = day ? allBk.filter(b => { if (!b.date) return false; const bd = new Date(b.date); return bd.getDate() === day && bd.getMonth() === calMonth && bd.getFullYear() === calYear; }) : [];
                            return (
                              <div key={idx2} onClick={() => day && setCalSelectedDay(calSelectedDay === day ? null : day)}
                                style={{ minHeight: isMobile ? 60 : 90, borderRight: (idx2 + 1) % 7 !== 0 ? `1px solid ${s.border}` : "none", borderBottom: `1px solid ${s.border}`, padding: isMobile ? "4px" : "6px", opacity: day ? 1 : 0.3, background: calSelectedDay === day ? "rgba(201,169,110,0.08)" : isToday ? "rgba(201,169,110,0.05)" : "transparent", cursor: day ? "pointer" : "default" }}>
                                {day && (<>
                                  <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? s.accent : "#f0ede8", marginBottom: 4, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isToday ? "rgba(201,169,110,0.2)" : "transparent" }}>{day}</div>
                                  {!isMobile && dayBk.slice(0,2).map((b: any, bi: number) => (
                                    <div key={bi} style={{ fontSize: 9, padding: "2px 5px", borderRadius: 3, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", background: b.status === "accepted" ? "rgba(76,175,130,0.2)" : b.status === "pending" ? "rgba(232,184,75,0.2)" : "rgba(201,169,110,0.2)", color: b.status === "accepted" ? s.green : b.status === "pending" ? s.yellow : s.accent }}>
                                      {b.time} — {b.service?.name}
                                    </div>
                                  ))}
                                  {dayBk.length > 2 && !isMobile && <div style={{ fontSize: 9, color: s.muted }}>+{dayBk.length - 2}</div>}
                                  {isMobile && dayBk.length > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent, margin: "0 auto" }} />}
                                </>)}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                    {calSelectedDay && (() => {
                      const dayBk = allBk.filter(b => { if (!b.date) return false; const bd = new Date(b.date); return bd.getDate() === calSelectedDay && bd.getMonth() === calMonth && bd.getFullYear() === calYear; });
                      return dayBk.length > 0 ? (
                        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
                            📅 {new Date(calYear, calMonth, calSelectedDay).toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" })}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {dayBk.map((b: any, bi: number) => (
                              <div key={bi} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: s.surface2, borderRadius: 10, borderLeft: `3px solid ${b.status === "accepted" ? s.green : b.status === "pending" ? s.yellow : s.accent}` }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, flexShrink: 0, minWidth: 40 }}>{b.time}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600 }}>{b.service?.name}</div>
                                  <div style={{ fontSize: 11, color: s.muted }}>{b.provider?.user?.name} · {b.totalPrice} lei</div>
                                </div>
                                <div style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, fontWeight: 700, background: b.status === "accepted" ? "rgba(76,175,130,0.15)" : b.status === "pending" ? "rgba(232,184,75,0.15)" : "rgba(201,169,110,0.15)", color: b.status === "accepted" ? s.green : b.status === "pending" ? s.yellow : s.accent }}>
                                  {b.status === "accepted" ? "Confirmat" : b.status === "pending" ? "In asteptare" : "Finalizat"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </>
                );
              })()}
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
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 64, background: "#111", borderTop: `1px solid ${s.border}`, display: "flex", zIndex: 100 }}>
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