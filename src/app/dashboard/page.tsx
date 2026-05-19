"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import FinancialDashboard from "@/components/dashboard/FinancialDashboard";
import RezervariMele from "@/components/dashboard/RezervariMele";
import ServiceCard from "@/components/dashboard/ServiceCard";
import AddServiceModal from "@/components/dashboard/AddServiceModal";

const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook", color: "#1877F2", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  { key: "instagram", label: "Instagram", color: "#E4405F", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' },
  { key: "tiktok", label: "TikTok", color: "#010101", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/></svg>' },
  { key: "website", label: "Website", color: "#c9a96e", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>' },
  { key: "youtube", label: "YouTube", color: "#FF0000", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
];

const JUDETE = ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","București","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea"];

const MOCK_CONTACTS_ADMIN = [
  { id: "c1", name: "Dorin Mihai", lastMsg: "Multumesc pentru confirmare!", time: "10:33", unread: 3, isOnline: true },
  { id: "c2", name: "Ana Constantin", lastMsg: "Ok, pe joi atunci!", time: "Ieri", unread: 0, isOnline: false },
  { id: "c3", name: "Radu Georgescu", lastMsg: "Pot sa revin marti?", time: "Lun", unread: 1, isOnline: true },
  { id: "c4", name: "Maria Ionescu", lastMsg: "Multumesc frumos!", time: "Lun", unread: 0, isOnline: false },
];
const MOCK_MSGS_ADMIN: Record<string,any[]> = {
  c1: [
    { id:1, fromMe:false, text:"Buna ziua! Am primit confirmarea pentru marti la 14:30.", time:"10:20", read:true },
    { id:2, fromMe:true, text:"Buna Dorin! Da, totul e confirmat. Va asteptam!", time:"10:25", read:true },
    { id:3, fromMe:false, text:"Multumesc pentru confirmare!", time:"10:33", read:false },
  ],
  c2: [
    { id:1, fromMe:false, text:"Buna! Pot schimba programarea pentru joi?", time:"09:00", read:true },
    { id:2, fromMe:true, text:"Bineinteles! Joi la ce ora va convine?", time:"09:10", read:true },
    { id:3, fromMe:false, text:"La 11:00 ar fi perfect.", time:"09:15", read:true },
    { id:4, fromMe:true, text:"Perfect, am facut modificarea!", time:"09:20", read:true },
    { id:5, fromMe:false, text:"Ok, pe joi atunci!", time:"09:22", read:true },
  ],
  c3: [
    { id:1, fromMe:false, text:"Buna ziua! Pot sa revin marti?", time:"Lun", read:false },
  ],
  c4: [
    { id:1, fromMe:false, text:"A fost o experienta minunata, multumesc!", time:"Lun", read:true },
    { id:2, fromMe:true, text:"Ne bucuram! Va asteptam cu drag!", time:"Lun", read:true },
    { id:3, fromMe:false, text:"Multumesc frumos!", time:"Lun", read:true },
  ],
};

const MOCK_REVIEWS = [
  {
    "id": "r1",
    "rating": 5,
    "comment": "Mirel e extraordinar! Stie exact ce vrei chiar daca nu stii sa explici. Cel mai bun coafor din oras, revin cu placere de fiecare data.",
    "createdAt": "2026-05-16T08:38:47.588Z",
    "client": {
      "name": "Dorin Mihai",
      "avatar": null
    },
    "provider": {
      "user": {
        "name": "Mirel Popescu",
        "avatar": null
      }
    }
  },
  {
    "id": "r2",
    "rating": 5,
    "comment": "Servicii impecabile, atmosfera placuta si preturi corecte. Ioana a fost super profesionista si m-a consiliat perfect pentru culoarea potrivita. Recomand cu toata increderea!",
    "createdAt": "2026-05-11T08:38:47.589Z",
    "client": {
      "name": "Ana Constantin",
      "avatar": null
    },
    "provider": {
      "user": {
        "name": "Ioana Danila",
        "avatar": null
      }
    }
  },
  {
    "id": "r3",
    "rating": 4,
    "comment": "Foarte multumit de rezultat. Putin timp de asteptare fata de programare, dar merita din plin. Mirel e mereu atent la detalii.",
    "createdAt": "2026-05-04T08:38:47.589Z",
    "client": {
      "name": "Radu Georgescu",
      "avatar": null
    },
    "provider": {
      "user": {
        "name": "Mirel Popescu",
        "avatar": null
      }
    }
  },
  {
    "id": "r4",
    "rating": 5,
    "comment": "Am venit pentru un balayage si am ramas uimita de rezultat. Ioana are o rabdare extraordinara si explica fiecare pas.",
    "createdAt": "2026-04-27T08:38:47.589Z",
    "client": {
      "name": "Maria Ionescu",
      "avatar": null
    },
    "provider": {
      "user": {
        "name": "Ioana Danila",
        "avatar": null
      }
    }
  },
  {
    "id": "r5",
    "rating": 5,
    "comment": "Salon curat, personal amabil, programare rapida. Il recomand tuturor prietenilor!",
    "createdAt": "2026-04-18T08:38:47.589Z",
    "client": {
      "name": "Paul Stanescu",
      "avatar": null
    },
    "provider": {
      "user": {
        "name": "Mirel Popescu",
        "avatar": null
      }
    }
  }
];

const MOCK_REZERVARI_ADMIN = [
  { id:"ra1", date:"2026-05-10", time:"10:00", status:"completed", totalPrice:150, service:{name:"Consultanta juridica", icon:"💼"}, provider:{user:{name:"Avocat Ion Popescu"}} },
  { id:"ra2", date:"2026-05-18", time:"14:00", status:"accepted", totalPrice:200, service:{name:"Service auto", icon:"🔧"}, provider:{user:{name:"Auto Expert SRL"}} },
  { id:"ra3", date:"2026-05-25", time:"09:00", status:"pending", totalPrice:80, service:{name:"Curatenie birouri", icon:"🧹"}, provider:{user:{name:"Clean Pro"}} },
  { id:"ra4", date:"2026-06-02", time:"11:00", status:"pending", totalPrice:300, service:{name:"Audit financiar", icon:"📊"}, provider:{user:{name:"Contabil Expert"}} },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", description: "", judet: "", oras: "", adresa: "", facebook: "", instagram: "", tiktok: "", website: "", youtube: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [finTab, setFinTab] = useState("global");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [emailVisible, setEmailVisible] = useState(true);
  const [svcTab, setSvcTab] = useState("firma");
  const [showAddSvcNew, setShowAddSvcNew] = useState(false);
  const [showAddSvc, setShowAddSvc] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: "", duration: "1", price: "", icon: "✂️", employeeId: "firma" });
  const [svcLoading, setSvcLoading] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calEmployee, setCalEmployee] = useState("all");
  const [activeChatContact, setActiveChatContact] = useState<any>(MOCK_CONTACTS_ADMIN[0]);
  const [chatMsgs, setChatMsgs] = useState<any[]>(MOCK_MSGS_ADMIN["c1"]);
  const [chatInput, setChatInput] = useState("");
  const [calSelectedDay, setCalSelectedDay] = useState<number | null>(null);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", yellow: "#e8b84b", red: "#e05a5a", blue: "#5a8de0",
  };

  const statusConfig: any = {
    pending: { label: "In asteptare", color: s.yellow, bg: "rgba(232,184,75,0.15)" },
    accepted: { label: "Confirmat", color: s.green, bg: "rgba(76,175,130,0.15)" },
    cancelled: { label: "Anulat", color: s.red, bg: "rgba(224,90,90,0.15)" },
    completed: { label: "Finalizat", color: s.accent, bg: "rgba(201,169,110,0.15)" },
  };

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      if (d.user?.role === "employee") { router.push("/dashboard/employee"); return; }
      if (d.user?.accountType === "private") { router.push("/dashboard/user"); return; }
      setUser(d.user);
      const u = d.user;
      setProfileForm({ name: u.name || "", phone: u.phone || "", description: u.description || "", judet: u.judet || "", oras: u.oras || "", adresa: u.adresa || "", facebook: u.facebook || "", instagram: u.instagram || "", tiktok: u.tiktok || "", website: u.website || "", youtube: u.youtube || "" });
    });
    fetch("/api/employees").then(r => r.json()).then(d => setEmployees(d.employees || []));
    fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d.bookings || []));
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.services || []));
  }, []);

  // Mock bookings pentru vizualizare calendar
  const today = new Date();
  const m = today.getMonth();
  const y = today.getFullYear();
  const mockCalBookings = [
    { id:"m1", date: new Date(y,m,today.getDate()-2).toISOString(), time:"09:00", status:"accepted", totalPrice:45, service:{name:"Tuns + Styling"}, client:{name:"Dorin Mihai"}, employeeId: employees[0]?.id || "emp1" },
    { id:"m2", date: new Date(y,m,today.getDate()-2).toISOString(), time:"11:00", status:"accepted", totalPrice:250, service:{name:"Vopsit complet"}, client:{name:"Ana Constantin"}, employeeId: employees[1]?.id || "emp2" },
    { id:"m3", date: new Date(y,m,today.getDate()-1).toISOString(), time:"10:00", status:"completed", totalPrice:180, service:{name:"Balayage"}, client:{name:"Maria Ionescu"}, employeeId: employees[0]?.id || "emp1" },
    { id:"m4", date: new Date(y,m,today.getDate()).toISOString(), time:"09:30", status:"accepted", totalPrice:45, service:{name:"Tuns"}, client:{name:"Radu Georgescu"}, employeeId: employees[0]?.id || "emp1" },
    { id:"m5", date: new Date(y,m,today.getDate()).toISOString(), time:"11:00", status:"pending", totalPrice:120, service:{name:"Coafat ocazie"}, client:{name:"Elena Pop"}, employeeId: employees[1]?.id || "emp2" },
    { id:"m6", date: new Date(y,m,today.getDate()).toISOString(), time:"14:00", status:"accepted", totalPrice:70, service:{name:"Tuns + Spalat"}, client:{name:"Paul Stanescu"}, employeeId: employees[0]?.id || "emp1" },
    { id:"m7", date: new Date(y,m,today.getDate()+1).toISOString(), time:"09:00", status:"pending", totalPrice:200, service:{name:"Keratina"}, client:{name:"Ioana Munteanu"}, employeeId: employees[1]?.id || "emp2" },
    { id:"m8", date: new Date(y,m,today.getDate()+1).toISOString(), time:"11:30", status:"accepted", totalPrice:45, service:{name:"Tuns"}, client:{name:"Mihai Popa"}, employeeId: employees[0]?.id || "emp1" },
    { id:"m9", date: new Date(y,m,today.getDate()+3).toISOString(), time:"10:00", status:"accepted", totalPrice:180, service:{name:"Vopsit"}, client:{name:"Sara Ionescu"}, employeeId: employees[1]?.id || "emp2" },
    { id:"m10", date: new Date(y,m,today.getDate()+3).toISOString(), time:"14:30", status:"pending", totalPrice:45, service:{name:"Tuns + Styling"}, client:{name:"Alex Dumitrescu"}, employeeId: employees[0]?.id || "emp1" },
    { id:"m11", date: new Date(y,m,today.getDate()+5).toISOString(), time:"09:00", status:"accepted", totalPrice:250, service:{name:"Balayage"}, client:{name:"Cristina Nae"}, employeeId: employees[1]?.id || "emp2" },
    { id:"m12", date: new Date(y,m,today.getDate()+7).toISOString(), time:"10:30", status:"pending", totalPrice:70, service:{name:"Tuns + Spalat"}, client:{name:"Luca Vasile"}, employeeId: employees[0]?.id || "emp1" },
  ];
  const allCalBookings = [...bookings, ...mockCalBookings];

  const pending = bookings.filter(b => b.status === "pending");
  const accepted = bookings.filter(b => b.status === "accepted");
  const completed = bookings.filter(b => b.status === "completed");
  const totalIncasat = completed.reduce((a, b) => a + (b.totalPrice || 0), 0);
  const activeEmployees = employees.filter(e => e.isActive !== false);

  const inputStyle = { width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const };

  const sidebarSections = [
    { section: "Client" },
    { id: "dashboard", icon: "⚡", label: "Dashboard" },
    { id: "profil-companie", icon: "✏️", label: "Editeaza Profilul" },
    { id: "rezervarile-mele", icon: "🗓", label: "Rezervarile noastre" },
    { id: "recenzii-oferite", icon: "⭐", label: "Recenzii oferite" },
    { section: "Prestator" },
    { id: "angajati", icon: "👥", label: "Angajatii nostrii" },
    { id: "servicii", icon: "✂️", label: "Serviciile noastre" },
    { id: "calendar", icon: "📅", label: "Calendar" },
    { id: "rezervari", icon: "📋", label: "Programari" },
    { id: "recenzii", icon: "💬", label: "Recenzii primite" },
    { section: "Cont" },
    { id: "mesaje", icon: "💬", label: "Mesaje" },
    { id: "financiar", icon: "📊", label: "Situatie financiara" },
    { id: "setari", icon: "⚙️", label: "Setari" },
  ];

  const bottomNavItems = [
    { id: "dashboard", icon: "⚡", label: "Home" },
    { id: "rezervari", icon: "📋", label: "Programari" },
    { id: "calendar", icon: "📅", label: "Calendar" },
    { id: "mesaje", icon: "💬", label: "Mesaje" },
    { id: "setari", icon: "⚙️", label: "Cont" },
  ];

  const getSectionTitle = () => {
    const titles: any = {
      dashboard: "Dashboard", angajati: "Angajatii", rezervari: "Rezervari",
      servicii: "Servicii", chat: "Chat", calendar: "Calendar", recenzii: "Recenzii", financiar: "Situatie financiara",
      "profil-companie": "Profil companie", setari: "Setari",
    };
    titles["recenzii-oferite"] = "Recenzii oferite";
    titles["rezervarile-mele"] = "Rezervarile noastre";
    return titles[activeSection] || "Dashboard";
  };

  const saveProfile = async () => {
    setProfileLoading(true);
    const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profileForm) });
    if (res.ok) { setProfileMsg("Profil actualizat!"); setTimeout(() => setProfileMsg(""), 3000); }
    setProfileLoading(false);
  };

  const toggleEmployee = async (empId: string, active: boolean) => {
    await fetch(`/api/employees/${empId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !active }) });
    setEmployees(employees.map(e => e.id === empId ? { ...e, isActive: !active } : e));
  };

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;
  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex" }}>

            <AddServiceModal open={showAddSvcNew} onClose={() => setShowAddSvcNew(false)} onSaved={() => fetch("/api/services").then(r=>r.json()).then(d=>setServices(d.services||[]))} showAssign={true} employees={(employees||[]).map((e:any) => ({ id: e.id, name: e.name }))} />

      {/* SIDEBAR */}
      {!isMobile && (
        <div style={{ width: 220, background: "#111", borderRight: `1px solid ${s.border}`, position: "fixed", top: 0, left: 0, bottom: 0, display: "flex", flexDirection: "column", zIndex: 50 }}>
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${s.border}` }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: s.accent }}>aitimp.ro</div>
            <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>Panou Administrator</div>
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
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden" }}>
                {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.charAt(0)}
              </div>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: 11, color: s.muted }}>Administrator</div></div>
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
                <a href="/" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>🏠 Home</a>
                <a href="/despre" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Despre noi</a>
                <a href="/contact" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-outfit)" }}>Contact</a>
                <button onClick={() => router.push("/search")} style={{ padding: "7px 14px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 8, fontSize: 12, color: s.muted, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>🔍 Cauta servicii</button>
              </>}
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

              {/* CARD COMPANIE */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 80, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
                <div style={{ padding: "0 20px 16px", marginTop: -32, display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 14, background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, overflow: "hidden" }}>
                      {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.charAt(0)}
                    </div>
                    <label style={{ position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${s.surface}`, fontSize: 10 }}>
                      ✏️<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const fd = new FormData(); fd.append("file", file); fetch("/api/profile/avatar", { method: "POST", body: fd }).then(r => r.json()).then(d => { if (d.url) setUser({ ...user, avatar: d.url }); }); }} />
                    </label>
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4, minWidth: 140 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 17 : 20, fontWeight: 700 }}>{user.name}</div>
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: isMobile ? 4 : 10, marginTop: 4 }}>
                      {(profileForm.oras || profileForm.judet) && <span style={{ fontSize: 12, color: s.muted }}>📍 {profileForm.oras}{profileForm.judet && `, ${profileForm.judet}`}</span>}
                      {profileForm.phone && <span style={{ fontSize: 12, color: s.muted }}>📞 {profileForm.phone}</span>}
                      {user?.email && <span style={{ fontSize: 12, color: s.muted }}>✉️ {user?.email}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, paddingBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(90,141,224,0.1)", border: "1px solid rgba(90,141,224,0.2)", fontSize: 11, color: s.blue, fontWeight: 600 }}>🏢 Companie</div>
                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", fontSize: 11, color: s.accent, fontWeight: 600 }}>👑 Admin</div>
                    <button onClick={() => setActiveSection("profil-companie")} style={{ padding: "5px 12px", borderRadius: 8, background: s.surface2, border: `1px solid ${s.border}`, fontSize: 11, color: s.muted, cursor: "pointer", fontFamily: "var(--font-outfit)", fontWeight: 600 }}>✏️ Editeaza profilul</button>
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
                  {[[bookings.length.toString(),"Rezervari"],[activeEmployees.length.toString(),"Angajati"],[totalIncasat + " lei","Incasat"],["4.97","Rating"]].map(([val,label],i) => (
                    <div key={i} onClick={() => setActiveSection(i === 0 ? "rezervari" : i === 1 ? "angajati" : "financiar")} style={{ padding: isMobile ? "10px 8px" : "12px 16px", borderRight: i < 3 ? `1px solid ${s.border}` : "none", textAlign: "center", cursor: "pointer" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 20, fontWeight: 700, color: s.accent }}>{val}</div>
                      <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CLIENT CARD */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20, borderTop: "3px solid rgba(90,141,224,0.4)" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.blue, display: "flex", alignItems: "center", gap: 8 }}>👤 Client <div style={{ flex: 1, height: 1, background: "rgba(90,141,224,0.2)" }} /></div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10 }}>
                  {[
                    ["0", "Rezervari efectuate", s.accent],
                    ["0", "In asteptare", s.yellow],
                    ["0 lei", "Total cheltuit", s.green],
                  ].map(([val,label,color]) => (
                    <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Rezervarile noastre — azi</div>
                    <button onClick={() => setActiveSection("rezervarile-mele")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                  </div>
                  {(() => {
                    const todayBk = [...(bookings||[])].filter(b => { if (!b.date) return false; const d = new Date(b.date); return d.toLocaleDateString("ro-RO") === new Date().toLocaleDateString("ro-RO"); });
                    const mockTodayBk = [
                      { id:"t1", time:"10:00", status:"accepted", totalPrice:150, service:{name:"Consultanta"}, provider:{user:{name:"Auto Expert SRL"}} },
                      { id:"t2", time:"14:30", status:"pending", totalPrice:80, service:{name:"Service"}, provider:{user:{name:"Clean Pro"}} },
                    ];
                    const allToday = [...todayBk, ...mockTodayBk];
                    return allToday.length === 0 ? (
                      <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "12px 0" }}>Nicio rezervare azi</div>
                    ) : allToday.map((b:any, i:number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < allToday.length-1 ? `1px solid ${s.surface2}` : "none" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: s.accent, flexShrink: 0, minWidth: 36 }}>{b.time}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name}</div>
                          <div style={{ fontSize: 11, color: s.muted }}>{b.provider?.user?.name}</div>
                        </div>
                        <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: b.status==="accepted"?"rgba(76,175,130,0.15)":"rgba(232,184,75,0.15)", color: b.status==="accepted"?s.green:s.yellow }}>{b.status==="accepted"?"Confirmat":"In asteptare"}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* PRESTATOR CARD */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20, borderTop: "3px solid rgba(201,169,110,0.4)" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14, color: s.accent, display: "flex", alignItems: "center", gap: 8 }}>🔧 Prestator <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.2)" }} /></div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    [employees.length.toString(), "Angajati", s.blue],
                    [bookings.length.toString(), "Programari totale", s.accent],
                    [bookings.filter((b:any) => b.status==="pending").length.toString(), "In asteptare", s.yellow],
                    [bookings.filter((b:any) => b.status==="completed").reduce((a:number,b:any)=>a+(b.totalPrice||0),0)+" lei", "Total incasat", s.green],
                  ].map(([val,label,color]) => (
                    <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 20, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Angajatii nostri</div>
                  <button onClick={() => setActiveSection("angajati")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toti →</button>
                </div>
                {employees.slice(0,3).map((emp:any, i:number) => (
                  <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < Math.min(employees.length,3)-1 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0, overflow: "hidden" }}>
                      {emp.avatar ? <img src={emp.avatar} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : emp.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{emp.services?.length || 0} servicii</div>
                    </div>
                    <div style={{ fontSize: 11, color: s.green, fontWeight: 600 }}>● Activ</div>
                  </div>
                ))}
              </div>

              {/* STATISTICI GLOBALE */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
                {[
                  [bookings.length.toString(), "Total rezervari", s.accent, "toate timpurile"],
                  [accepted.length.toString(), "Confirmate", s.green, "active acum"],
                  [pending.length.toString(), "In asteptare", s.yellow, "necesita aprobare"],
                  [activeEmployees.length.toString(), "Angajati activi", s.blue, "in echipa"],
                ].map(([val,label,color,sub]) => (
                  <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 24, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* GALERIE COMPANIE */}
              {user.gallery && user.gallery.length > 0 && (
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Galerie foto</div>
                    <button onClick={() => setActiveSection("profil-companie")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Gestioneaza →</button>
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

              {/* ECHIPA + REZERVARI RECENTE */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: 14 }}>
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Echipa</div>
                    <button onClick={() => setActiveSection("angajati")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toti →</button>
                  </div>
                  {employees.length === 0 ? (
                    <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>
                      Niciun angajat. <span style={{ color: s.accent, cursor: "pointer" }} onClick={() => setActiveSection("angajati")}>Invita →</span>
                    </div>
                  ) : employees.slice(0, 4).map((emp: any) => (
                    <div key={emp.id} onClick={() => { setSelectedEmployee(emp); setActiveSection("angajati"); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${s.surface2}`, cursor: "pointer" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0, overflow: "hidden" }}>
                        {emp.avatar ? <img src={emp.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : emp.name?.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{(emp.services || []).length} servicii</div>
                      </div>
                      <div style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, background: emp.isActive !== false ? "rgba(76,175,130,0.15)" : "rgba(224,90,90,0.15)", color: emp.isActive !== false ? s.green : s.red, fontWeight: 700 }}>
                        {emp.isActive !== false ? "Activ" : "Inactiv"}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rezervari recente</div>
                    <button onClick={() => setActiveSection("rezervari")} style={{ fontSize: 11, color: s.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Vezi toate →</button>
                  </div>
                  {bookings.length === 0 ? (
                    <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>Nicio rezervare inca.</div>
                  ) : bookings.slice(0, 5).map((b: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 4 ? `1px solid ${s.surface2}` : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📅</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service?.name || "Serviciu"}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{b.date} · {b.client?.name}</div>
                      </div>
                      <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{b.totalPrice} lei</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* ===== SERVICII ===== */}
          {activeSection === "servicii" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              {/* DATE REALE DIN API */}
              {(() => {
                const companyServices = (services || []).filter((s: any) => s._owner === "company" || !s._owner);
                const empServices = (services || []).filter((s: any) => s._owner === "employee");
                const tabServices = svcTab === "firma" ? companyServices : empServices.filter((s: any) => s._employeeId === svcTab);
                
                return (
                  <>
                    {/* HEADER */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600 }}>Gestioneaza serviciile</div>
                      <button onClick={() => setShowAddSvcNew(true)} style={{ padding: "9px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Serviciu nou</button>
                    </div>

                    {/* TABS */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[{id:"firma", name:"🏢 Firma"}, ...employees.map((e: any) => ({id: e.id, name: e.name?.split(" ")[0]}))].map(tab => (
                        <button key={tab.id} onClick={() => setSvcTab(tab.id)}
                          style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${svcTab === tab.id ? s.accent : s.border}`, background: svcTab === tab.id ? "rgba(201,169,110,0.1)" : s.surface, color: svcTab === tab.id ? s.accent : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                          {tab.name}
                        </button>
                      ))}
                    </div>

                    {/* DESCRIERE TAB */}
                    {svcTab === "firma" && (
                      <div style={{ padding: "10px 14px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 10, fontSize: 12, color: s.muted }}>
                        ℹ️ Serviciile firmei apar pe profilul public fara a fi atribuite unui angajat specific. Ideale cand lucrezi independent.
                      </div>
                    )}

                    {/* LISTA SERVICII */}
                    {tabServices.length === 0 ? (
                      <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>✂️</div>
                        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Niciun serviciu</div>
                        <div style={{ fontSize: 13, marginBottom: 20 }}>Adauga primul serviciu pentru {svcTab === "firma" ? "firma" : employees.find((e: any) => e.id === svcTab)?.name}</div>
                        
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {tabServices.map((svc: any, idx: number) => (
                          <ServiceCard key={svc.id} service={svc} index={idx} showOwner={true}
                            onEdit={() => alert("Edit: " + svc.name)}
                            onToggleActive={() => fetch("/api/services", {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:svc.id, isActive:!svc.isActive})}).then(()=>fetch("/api/services").then(r=>r.json()).then(d=>setServices(d.services||[])))}
                            onDelete={() => fetch("/api/services", {method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id:svc.id})}).then(()=>setServices((prev:any)=>prev.filter((s:any)=>s.id!==svc.id)))}
                          />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* ===== ANGAJATII ===== */}
          {activeSection === "angajati" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* STATS ANGAJATI */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
                {[
                  [employees.length.toString(), "Total angajati", s.accent],
                  [activeEmployees.length.toString(), "Activi", s.green],
                  [employees.filter(e => e.isActive === false).length.toString(), "Inactivi", s.red],
                  [employees.reduce((a, e) => a + (e.services?.length || 0), 0).toString(), "Servicii totale", s.blue],
                ].map(([val,label,color]) => (
                  <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 24, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* BUTON INVITA */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={{ padding: "9px 18px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  + Invita angajat
                </button>
              </div>

              {/* LISTA ANGAJATI */}
              {employees.length === 0 ? (
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "40px 20px", textAlign: "center", color: s.muted }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Niciun angajat</div>
                  <div style={{ fontSize: 13, marginBottom: 20 }}>Invita primul angajat prin email</div>
                  <button style={{ padding: "10px 24px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Invita angajat</button>
                </div>
              ) : employees.map((emp: any, idx: number) => {
                const empBookings = bookings.filter(b => b.employeeId === emp.id);
                const empCompleted = empBookings.filter(b => b.status === "completed");
                const empRevenue = empCompleted.reduce((a, b) => a + (b.totalPrice || 0), 0);
                const isExpanded = selectedEmployee?.id === emp.id;
                return (
                  <div key={emp.id} style={{ background: s.surface, border: `1px solid ${isExpanded ? "rgba(201,169,110,0.4)" : s.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color .2s" }}>
                    {/* HEADER ANGAJAT */}
                    <div style={{ padding: isMobile ? "14px 16px" : "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
                      onClick={() => setSelectedEmployee(isExpanded ? null : emp)}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0, overflow: "hidden" }}>
                        {emp.avatar ? <img src={emp.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : emp.name?.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{emp.name}</div>
                        <div style={{ fontSize: 12, color: s.muted }}>{emp.email} {emp.oras && `· 📍 ${emp.oras}`}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{empRevenue} lei</div>
                          <div style={{ fontSize: 10, color: s.muted }}>{empCompleted.length} finalizate</div>
                        </div>
                        <div style={{ fontSize: 10, padding: "3px 9px", borderRadius: 5, background: emp.isActive !== false ? "rgba(76,175,130,0.15)" : "rgba(224,90,90,0.15)", color: emp.isActive !== false ? s.green : s.red, fontWeight: 700 }}>
                          {emp.isActive !== false ? "Activ" : "Inactiv"}
                        </div>
                        <div style={{ fontSize: 16, color: s.muted, transition: "transform .2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>▾</div>
                      </div>
                    </div>

                    {/* DETALII EXPANDATE */}
                    {isExpanded && (
                      <div style={{ borderTop: `1px solid ${s.border}`, padding: isMobile ? "16px" : "20px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                          {[
                            [empBookings.length.toString(), "Total rezervari", s.accent],
                            [empCompleted.length.toString(), "Finalizate", s.green],
                            [empRevenue + " lei", "Venit generat", s.yellow],
                            [(emp.services?.length || 0).toString(), "Servicii", s.blue],
                          ].map(([val,label,color]) => (
                            <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "10px 12px" }}>
                              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color }}>{val}</div>
                              <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                            </div>
                          ))}
                        </div>

                        {/* SERVICII ANGAJAT */}
                        {(emp.services || []).length > 0 && (
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: s.muted, marginBottom: 10, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Servicii</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {(emp.services || []).map((svc: any, i: number) => {
                                const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b"];
                                return (
                                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: s.surface2, borderRadius: 8, borderLeft: `3px solid ${colors[i % colors.length]}` }}>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 13, fontWeight: 600 }}>{svc.name}</div>
                                      <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min</div>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* FUNCTII ADMIN */}
                        <div style={{ fontSize: 12, fontWeight: 600, color: s.muted, marginBottom: 10, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Functii admin</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            onClick={() => toggleEmployee(emp.id, emp.isActive !== false)}
                            style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${emp.isActive !== false ? "rgba(224,90,90,0.3)" : "rgba(76,175,130,0.3)"}`, background: emp.isActive !== false ? "rgba(224,90,90,0.08)" : "rgba(76,175,130,0.08)", color: emp.isActive !== false ? s.red : s.green, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                            {emp.isActive !== false ? "Dezactiveaza cont" : "Activeaza cont"}
                          </button>
                          <button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${s.border}`, background: s.surface2, color: "#f0ede8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                            Editeaza servicii
                          </button>
                          <button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${s.border}`, background: s.surface2, color: "#f0ede8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                            Vezi calendar
                          </button>
                          <button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.08)", color: s.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                            Situatie financiara
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== REZERVARI ===== */}
          {activeSection === "rezervari" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10 }}>
                {[[bookings.length.toString(),"Total",s.accent],[pending.length.toString(),"In asteptare",s.yellow],[completed.length.toString(),"Finalizate",s.green]].map(([val,label,color]) => (
                  <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 24, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Toate rezervarile</div>
                {bookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: s.muted }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8" }}>Nicio rezervare</div>
                  </div>
                ) : bookings.map((b: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < bookings.length - 1 ? `1px solid ${s.surface2}` : "none", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📅</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{b.service?.name || "Serviciu"}</div>
                      <div style={{ fontSize: 12, color: s.muted }}>{b.date} {b.time && `· ${b.time}`} · {b.client?.name}</div>
                    </div>
                    <div style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, flexShrink: 0 }}>{statusConfig[b.status]?.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{b.totalPrice} lei</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== RECENZII OFERITE ===== */}
          {activeSection === "recenzii-oferite" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Recenzii oferite de noi</div>
                {[
                  { rating:5, comment:"Servicii excelente, recomand cu caldura!", target:"Auto Expert SRL", date:"12 mai 2025" },
                  { rating:4, comment:"Profesionalism ridicat, vom colabora din nou.", target:"Clean Pro", date:"8 mai 2025" },
                ].map((rev, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: i < 1 ? `1px solid ${s.surface2}` : "none" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{rev.target}</div>
                        <div style={{ fontSize: 12, color: s.accent }}>{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{rev.date}</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#c0bdb8" }}>{rev.comment}</div>
                    </div>
                    <button style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>🗑 Sterge</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== REZERVARILE MELE ={/* ===== REZERVARILE MELE ===== */}
          {activeSection === "rezervarile-mele" && (
            <RezervariMele bookings={[]} mockBookings={[
  { id:"ra1", date:"2026-05-10", time:"10:00", status:"completed", totalPrice:150, service:{name:"Consultanta juridica", icon:"💼"}, provider:{user:{name:"Avocat Ion"}} },
  { id:"ra2", date:"2026-05-18", time:"14:00", status:"accepted", totalPrice:200, service:{name:"Service auto", icon:"🔧"}, provider:{user:{name:"Auto Expert SRL"}} },
  { id:"ra3", date:"2026-05-25", time:"09:00", status:"pending", totalPrice:80, service:{name:"Curatenie birouri", icon:"🧹"}, provider:{user:{name:"Clean Pro"}} },
]} showProvider={true} />
          )}

          {/* ===== CHAT ===== */}
          {activeSection === "mesaje" && (
            <div style={{ display: "flex", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden", height: isMobile ? "70vh" : 560 }}>
              {!isMobile && (
                <div style={{ width: 240, borderRight: `1px solid ${s.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${s.border}`, fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600 }}>Mesaje clienti</div>
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {MOCK_CONTACTS_ADMIN.map(contact => (
                      <div key={contact.id} onClick={() => { setActiveChatContact(contact); setChatMsgs(MOCK_MSGS_ADMIN[contact.id] || []); }}
                        style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: activeChatContact?.id === contact.id ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: activeChatContact?.id === contact.id ? `3px solid ${s.accent}` : "3px solid transparent" }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#4caf82,#2a8a5a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{contact.name.charAt(0)}</div>
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
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#4caf82,#2a8a5a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{activeChatContact?.name?.charAt(0)}</div>
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
                        <div style={{ fontSize: 10, color: s.muted, marginTop: 2, textAlign: msg.fromMe ? "right" as const : "left" as const }}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 12px", borderTop: `1px solid ${s.border}`, display: "flex", gap: 8, flexShrink: 0 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && chatInput.trim()) { const now = new Date(); setChatMsgs((prev: any[]) => [...prev, { id: Date.now(), fromMe: true, text: chatInput, time: now.getHours()+":"+String(now.getMinutes()).padStart(2,"0"), read: false }]); setChatInput(""); } }}
                    placeholder="Scrie un mesaj..." style={{ flex: 1, background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 20, padding: "8px 14px", color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }} />
                  <button onClick={() => { if (!chatInput.trim()) return; const now = new Date(); setChatMsgs((prev: any[]) => [...prev, { id: Date.now(), fromMe: true, text: chatInput, time: now.getHours()+":"+String(now.getMinutes()).padStart(2,"0"), read: false }]); setChatInput(""); }}
                    style={{ width: 38, height: 38, borderRadius: "50%", background: chatInput.trim() ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, border: "none", color: chatInput.trim() ? "#0a0a0a" : s.muted, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
                </div>
              </div>
            </div>
          )}
         {/* ===== FINANCIAR ===== */}
          {activeSection === "financiar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* TABS */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => setFinTab("global")} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${finTab === "global" ? s.accent : s.border}`, background: finTab === "global" ? "rgba(201,169,110,0.1)" : s.surface, color: finTab === "global" ? s.accent : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Global companie
                </button>
                {employees.map(emp => (
                  <button key={emp.id} onClick={() => setFinTab(emp.id)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${finTab === emp.id ? s.accent : s.border}`, background: finTab === emp.id ? "rgba(201,169,110,0.1)" : s.surface, color: finTab === emp.id ? s.accent : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    {emp.name?.split(" ")[0]}
                  </button>
                ))}
              </div>

              {finTab === "global" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10 }}>
                    {[
                      [totalIncasat + " lei", "Total incasat", s.accent, "toate timpurile"],
                      [completed.length.toString(), "Servicii finalizate", s.green, "toate timpurile"],
                      [employees.length.toString(), "Angajati", s.blue, "in echipa"],
                      [bookings.length.toString(), "Total rezervari", s.yellow, "toate timpurile"],
                    ].map(([val,label,color,sub]) => (
                      <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
                        <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                        <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>{sub}</div>
                      </div>
                    ))}
                  </div>
                  {/* SITUATIE PER ANGAJAT */}
                  <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Situatie per angajat</div>
                    {employees.length === 0 ? (
                      <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>Niciun angajat.</div>
                    ) : employees.map((emp: any, i: number) => {
                      const empBk = bookings.filter(b => b.employeeId === emp.id);
                      const empRev = empBk.filter(b => b.status === "completed").reduce((a, b) => a + (b.totalPrice || 0), 0);
                      const pct = totalIncasat > 0 ? Math.round((empRev / totalIncasat) * 100) : 0;
                      const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                      return (
                        <div key={emp.id} style={{ marginBottom: i < employees.length - 1 ? 16 : 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", overflow: "hidden" }}>
                                {emp.avatar ? <img src={emp.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : emp.name?.charAt(0)}
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</span>
                            </div>
                            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: s.muted }}>{empBk.length} rezervari</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{empRev} lei</span>
                              <span style={{ fontSize: 11, color: s.muted }}>{pct}%</span>
                            </div>
                          </div>
                          <div style={{ height: 6, background: s.surface2, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: pct + "%", background: colors[i % colors.length], borderRadius: 3, transition: "width .4s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <FinancialDashboard bookings={bookings} services={services} />
                </>
              )}

              {employees.map(emp => finTab === emp.id && (
                <div key={emp.id}>
                  <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20, marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", overflow: "hidden" }}>
                        {emp.avatar ? <img src={emp.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : emp.name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>{emp.name}</div>
                        <div style={{ fontSize: 12, color: s.muted }}>Situatie financiara individuala</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10 }}>
                      {(() => {
                        const empBk = bookings.filter(b => b.employeeId === emp.id);
                        const empRev = empBk.filter(b => b.status === "completed").reduce((a, b) => a + (b.totalPrice || 0), 0);
                        return [
                          [empBk.length.toString(), "Total rezervari", s.accent],
                          [empBk.filter(b => b.status === "completed").length.toString(), "Finalizate", s.green],
                          [empRev + " lei", "Venit generat", s.yellow],
                        ].map(([val,label,color]) => (
                          <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                            <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color }}>{val}</div>
                            <div style={{ fontSize: 11, color: s.muted, marginTop: 3 }}>{label}</div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                  <FinancialDashboard bookings={bookings.filter(b => b.employeeId === emp.id)} services={emp.services || []} />
                </div>
              ))}
            </div>
          )}

          {/* ===== PROFIL COMPANIE ===== */}
          {activeSection === "profil-companie" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
              {profileMsg && <div style={{ background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 10, padding: "12px 16px", color: s.green, fontSize: 13 }}>{profileMsg}</div>}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Date companie</div>
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Email</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={user?.email || ""} disabled style={{ flex: 1, padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "not-allowed" }} />
                    <button onClick={() => setEmailVisible(!emailVisible)} style={{ padding: "11px 14px", borderRadius: 10, border: `1px solid ${emailVisible ? "rgba(76,175,130,0.4)" : s.border}`, background: emailVisible ? "rgba(76,175,130,0.1)" : s.surface2, color: emailVisible ? s.green : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", whiteSpace: "nowrap" as const }}>{emailVisible ? "👁 Vizibil" : "🙈 Ascuns"}</button>
                  </div>
                  <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>Controleaza daca emailul apare pe profilul public</div>
                </div>
              <div>
                <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Email (nu poate fi modificat)</div>
                <input value={user?.email || ""} disabled style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.03)", border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const, cursor: "not-allowed" }} />
              </div>
                {([["name","Nume companie","Numele firmei"],["phone","Telefon","07xx xxx xxx"]] as [string,string,string][]).map(([k,l,p]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{l}</div>
                    <input value={(profileForm as any)[k]} onChange={e => setProfileForm({ ...profileForm, [k]: e.target.value })} placeholder={p} style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Descriere</div>
                  <textarea value={profileForm.description} onChange={e => setProfileForm({ ...profileForm, description: e.target.value })} placeholder="Descrie compania..." rows={3}
                    style={{ ...inputStyle, resize: "vertical" as const }}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Judet</div>
                    <select value={profileForm.judet} onChange={e => setProfileForm({ ...profileForm, judet: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Selecteaza judetul</option>
                      {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Oras</div>
                    <input value={profileForm.oras} onChange={e => setProfileForm({ ...profileForm, oras: e.target.value })} placeholder="ex: Oradea" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                </div>
              </div>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Retele sociale</div>
                {SOCIAL_PLATFORMS.map(p => (
                  <div key={p.key}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{p.label}</div>
                    <input value={(profileForm as any)[p.key]} onChange={e => setProfileForm({ ...profileForm, [p.key]: e.target.value })}
                      placeholder={`https://${p.key}.com`} style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                ))}
              </div>
              {/* LOGO SI GALERIE */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Logo & Galerie foto</div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: `1px solid ${s.border}` }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 14, background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "#fff", overflow: "hidden", border: `2px solid ${s.border}` }}>
                      {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : user.name?.charAt(0)}
                    </div>
                    <label style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${s.surface}`, fontSize: 10 }}>
                      ✏️<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const fd = new FormData(); fd.append("file", file); fetch("/api/profile/avatar", { method: "POST", body: fd }).then(r => r.json()).then(d => { if (d.url) setUser({ ...user, avatar: d.url }); }); }} />
                    </label>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Logo companie</div>
                    <div style={{ fontSize: 12, color: s.muted }}>Click pe logo pentru a schimba imaginea</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: s.muted, marginBottom: 10 }}>Galerie foto — pana la 10 poze</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
                    {(user.gallery || []).map((img: string, i: number) => (
                      <div key={i} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", position: "relative", background: s.surface2 }}>
                        <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button onClick={() => { const ng = (user.gallery || []).filter((_: string, gi: number) => gi !== i); setUser({ ...user, gallery: ng }); fetch("/api/profile/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ index: i }) }); }} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(224,90,90,0.9)", color: "#fff", border: "none", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                      </div>
                    ))}
                    {(user.gallery?.length || 0) < 10 && (
                      <label style={{ aspectRatio: "1", borderRadius: 10, border: `2px dashed ${s.border}`, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 6 }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = s.accent)} onMouseLeave={e => (e.currentTarget.style.borderColor = s.border)}>
                        <div style={{ fontSize: 24, color: s.muted }}>+</div>
                        <div style={{ fontSize: 10, color: s.muted }}>Adauga foto</div>
                        <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => { const fd = new FormData(); fd.append("file", file); fetch("/api/profile/gallery", { method: "POST", body: fd }).then(r => r.json()).then(d => { if (d.url) setUser((prev: any) => ({ ...prev, gallery: [...(prev.gallery || []), d.url] })); }); });
                        }} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={saveProfile} disabled={profileLoading} style={{ padding: "13px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: profileLoading ? 0.7 : 1 }}>
                {profileLoading ? "Se salveaza..." : "Salveaza profilul"}
              </button>
            </div>
          )}

          {/* ===== CALENDAR ===== */}
          {activeSection === "calendar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* HEADER CALENDAR */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => setCalMonth(m => m - 1)} style={{ width: 32, height: 32, borderRadius: 8, background: s.surface, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, minWidth: 140, textAlign: "center" }}>
                    {new Date(calYear, calMonth).toLocaleDateString("ro-RO", { month: "long", year: "numeric" })}
                  </div>
                  <button onClick={() => setCalMonth(m => m + 1)} style={{ width: 32, height: 32, borderRadius: 8, background: s.surface, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                  <button onClick={() => { setCalMonth(new Date().getMonth()); setCalYear(new Date().getFullYear()); }} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.2)`, color: s.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Azi</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <select value={calEmployee} onChange={e => setCalEmployee(e.target.value)} style={{ padding: "7px 12px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 8, color: "#f0ede8", fontSize: 12, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
                    <option value="all">Toti angajatii</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                  <button style={{ padding: "7px 14px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>+ Rezervare manuala</button>
                </div>
              </div>

              {/* LEGENDA */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {[["#4caf82","Confirmat"],["#e8b84b","In asteptare"],["#c9a96e","Manual"]].map(([color,label]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: 12, color: s.muted }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* GRID CALENDAR */}
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: `1px solid ${s.border}` }}>
                  {["Lun","Mar","Mie","Joi","Vin","Sam","Dum"].map(d => (
                    <div key={d} style={{ padding: isMobile ? "8px 4px" : "10px", textAlign: "center", fontSize: 11, fontWeight: 600, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                  {(() => {
                    const firstDay = new Date(calYear, calMonth, 1).getDay();
                    const offset = firstDay === 0 ? 6 : firstDay - 1;
                    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                    const cells = [];
                    for (let i = 0; i < offset; i++) cells.push(null);
                    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
                    const today = new Date();
                    return cells.map((day, idx) => {
                      const isToday = day && today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear;
                      const dayBookings = day ? allCalBookings.filter(b => {
                        if (!b.date) return false;
                        const bd = new Date(b.date);
                        return bd.getDate() === day && bd.getMonth() === calMonth && bd.getFullYear() === calYear && (calEmployee === "all" || b.employeeId === calEmployee);
                      }) : [];
                      return (
                        <div key={idx} onClick={() => day && setCalSelectedDay(calSelectedDay === day ? null : day)} style={{ minHeight: isMobile ? 60 : 90, borderRight: (idx + 1) % 7 !== 0 ? `1px solid ${s.border}` : "none", borderBottom: `1px solid ${s.border}`, padding: isMobile ? "4px" : "6px", opacity: day ? 1 : 0.3, background: calSelectedDay === day ? "rgba(201,169,110,0.08)" : isToday ? "rgba(201,169,110,0.05)" : "transparent", cursor: day ? "pointer" : "default", transition: "background .15s" }}>
                          {day && (
                            <>
                              <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? s.accent : "#f0ede8", marginBottom: 4, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isToday ? "rgba(201,169,110,0.2)" : "transparent" }}>{day}</div>
                              {!isMobile && dayBookings.slice(0, 2).map((b: any, i: number) => (
                                <div key={i} style={{ fontSize: 9, padding: "2px 5px", borderRadius: 3, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", background: b.status === "accepted" ? "rgba(76,175,130,0.2)" : b.status === "pending" ? "rgba(232,184,75,0.2)" : "rgba(201,169,110,0.2)", color: b.status === "accepted" ? s.green : b.status === "pending" ? s.yellow : s.accent }}>
                                  {b.time} {b.client?.name?.split(" ")[0]} - {b.service?.name}
                                </div>
                              ))}
                              {dayBookings.length > 2 && !isMobile && <div style={{ fontSize: 9, color: s.muted }}>+{dayBookings.length - 2} mai mult</div>}
                              {isMobile && dayBookings.length > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent, margin: "0 auto" }} />}
                            </>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* DETALII ZI SELECTATA */}
              {calSelectedDay && (() => {
                const dayBk = allCalBookings.filter(b => {
                  if (!b.date) return false;
                  const bd = new Date(b.date);
                  return bd.getDate() === calSelectedDay && bd.getMonth() === calMonth && bd.getFullYear() === calYear && (calEmployee === "all" || b.employeeId === calEmployee);
                });
                return dayBk.length > 0 ? (
                  <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
                      📅 {new Date(calYear, calMonth, calSelectedDay).toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" })} — {dayBk.length} rezervari
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {dayBk.sort((a,b) => a.time?.localeCompare(b.time)).map((b: any, i: number) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: s.surface2, borderRadius: 10, borderLeft: `3px solid ${b.status === "accepted" ? s.green : b.status === "pending" ? s.yellow : s.accent}` }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: s.accent, flexShrink: 0, minWidth: 40 }}>{b.time}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{b.client?.name}</div>
                            <div style={{ fontSize: 11, color: s.muted }}>{b.service?.name} · {b.totalPrice} lei</div>
                          </div>
                          <div style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, fontWeight: 700, background: b.status === "accepted" ? "rgba(76,175,130,0.15)" : b.status === "pending" ? "rgba(232,184,75,0.15)" : "rgba(201,169,110,0.15)", color: b.status === "accepted" ? s.green : b.status === "pending" ? s.yellow : s.accent, flexShrink: 0 }}>
                            {b.status === "accepted" ? "Confirmat" : b.status === "pending" ? "In asteptare" : "Finalizat"}
                          </div>
                          {b.status === "pending" && (
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                              <button style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(76,175,130,0.15)", border: "1px solid rgba(76,175,130,0.3)", color: s.green, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✓</button>
                              <button style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(224,90,90,0.15)", border: "1px solid rgba(224,90,90,0.3)", color: s.red, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✕</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* ===== RECENZII ===== */}
          {activeSection === "recenzii" && (
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexDirection: isMobile ? "column" : "row" }}>
              {/* MAIN CONTENT */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
                {/* RATING OVERVIEW */}
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 48, fontWeight: 700, color: s.accent, lineHeight: 1 }}>4.9</div>
                    <div style={{ fontSize: 18, color: s.accent, marginTop: 4 }}>★★★★★</div>
                    <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>0 recenzii</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    {[5,4,3,2,1].map(star => (
                      <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: s.accent, flexShrink: 0 }}>{star}★</span>
                        <div style={{ flex: 1, height: 6, background: s.surface2, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: star === 5 ? "85%" : star === 4 ? "10%" : "3%", background: s.accent, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, color: s.muted, flexShrink: 0, minWidth: 20 }}>{star === 5 ? 0 : 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FILTRE */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Toate","5 stele","4 stele", ...employees.map(e => e.name?.split(" ")[0] || "")].map((f, i) => (
                    <button key={i} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${i === 0 ? s.accent : s.border}`, background: i === 0 ? "rgba(201,169,110,0.1)" : s.surface, color: i === 0 ? s.accent : s.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>{f}</button>
                  ))}
                </div>

                {/* RECENZII LISTA */}
                <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                  <div style={{ textAlign: "center", padding: "40px 0", color: s.muted }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: "#f0ede8", marginBottom: 8 }}>Nicio recenzie inca</div>
                    <div style={{ fontSize: 13 }}>Recenziile apar dupa finalizarea serviciilor</div>
                  </div>
                </div>
              </div>

              {/* SIDEBAR ANGAJATI - desktop only */}
              {!isMobile && (
                <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 16 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Rating per angajat</div>
                    {employees.length === 0 ? (
                      <div style={{ fontSize: 12, color: s.muted, textAlign: "center", padding: "10px 0" }}>Niciun angajat</div>
                    ) : employees.map((emp: any, i: number) => (
                      <div key={emp.id} style={{ marginBottom: i < employees.length - 1 ? 14 : 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, overflow: "hidden" }}>
                            {emp.avatar ? <img src={emp.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : emp.name?.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.name}</div>
                            <div style={{ fontSize: 10, color: s.muted }}>0 recenzii</div>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: s.accent }}>—</div>
                        </div>
                        <div style={{ height: 4, background: s.surface2, borderRadius: 2 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MOBILE - angajati compact */}
              {isMobile && employees.length > 0 && (
                <div style={{ width: "100%", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Rating per angajat</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {employees.map((emp: any) => (
                      <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: s.surface2, borderRadius: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", overflow: "hidden" }}>
                          {emp.avatar ? <img src={emp.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : emp.name?.charAt(0)}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{emp.name?.split(" ")[0]}</span>
                        <span style={{ fontSize: 12, color: s.accent, fontWeight: 700 }}>—</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== SETARI ===== */}
          {activeSection === "setari" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 18 : 24 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Cont</div>
                <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
                  style={{ padding: "10px 20px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Deconectare
                </button>
              </div>
              <div style={{ background: s.surface, border: "1px solid rgba(224,90,90,0.2)", borderRadius: 14, padding: isMobile ? 18 : 24 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 4, color: s.red }}>Zona periculoasa</div>
                <div style={{ fontSize: 13, color: s.muted, marginBottom: 16 }}>Actiuni ireversibile</div>
                <button style={{ padding: "10px 20px", background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 10, color: s.red, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Sterge contul
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