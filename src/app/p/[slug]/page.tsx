"use client";
import Navbar from "@/components/Navbar";
import { useResponsive } from "@/hooks/useResponsive";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const SOCIAL_ICONS: any = {
  facebook: { color: "#1877F2", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
  instagram: { color: "#E4405F", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' },
  tiktok: { color: "#010101", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/></svg>' },
  linkedin: { color: "#0A66C2", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
  website: { color: "#c9a96e", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>' },
  youtube: { color: "#FF0000", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
  whatsapp: { color: "#25D366", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' },
};

export default function ProviderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { isMobile } = useResponsive();

  const [provider, setProvider] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [activeEmployee, setActiveEmployee] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calSelectedDay, setCalSelectedDay] = useState<number | null>(null);
  const [calSelectedSlot, setCalSelectedSlot] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<"service" | "calendar" | "slot" | "confirm">("service");
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", yellow: "#e8b84b", red: "#e05a5a", blue: "#5a8de0",
  };

  useEffect(() => {
    fetch(`/api/public/${slug}`).then(r => r.json()).then(d => {
      setProvider(d.provider);
      setEmployees(d.employees || []);
      setReviews(d.reviews || []);
      if (d.employees?.length > 0) {
        setActiveEmployee(d.employees[0]);
        setServices(d.employees[0].provider?.services || []);
      } else {
        setServices(d.services || []);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.error) {
        setCurrentUser(d.user);
        fetch("/api/bookings").then(r => r.json()).then(b => setMyBookings(b.bookings || []));
      }
    });
  }, [slug]);

  const isCompany = provider?.accountType === "company";
  const gallery = provider?.provider?.gallery || activeEmployee?.provider?.gallery || [];
  const avgRating = reviews.length > 0 ? (reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  const myBookingWithThis = myBookings.filter(b => {
    const empIds = employees.map(e => e.provider?.id);
    return empIds.includes(b.providerId) || b.providerId === provider?.provider?.id;
  });
  const hasCollaborated = myBookingWithThis.some(b => b.status === "completed");
  const pendingBooking = myBookingWithThis.find(b => b.status === "pending" || b.status === "accepted");

  const toggleFavorite = (svcId: string) => {
    setFavorites(prev => prev.includes(svcId) ? prev.filter(f => f !== svcId) : [...prev, svcId]);
  };

  // === CALENDAR HELPERS ===
  const slotInterval = provider?.provider?.slotInterval || 30; // min
  const workStart = provider?.provider?.workStart || "09:00";
  const workEnd = provider?.provider?.workEnd || "18:00";
  const bufferMinutes = 15; // buffer intre servicii

  const generateSlots = (start: string, end: string, interval: number): string[] => {
    const slots: string[] = [];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let h = sh, m = sm;
    while (h < eh || (h === eh && m < em)) {
      slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
      m += interval;
      if (m >= 60) { h++; m -= 60; }
    }
    return slots;
  };

  const getMockOccupied = (day: number, month: number): string[] => {
    const seed = day * 3 + month * 7;
    const allSlots = generateSlots(workStart, workEnd, slotInterval);
    return allSlots.filter((_, i) => (seed + i * 11) % 4 === 0);
  };

  const getSlotStatus = (slot: string, day: number, serviceDuration: number): "free" | "occupied" | "unavailable" | "buffer" => {
    const occupied = getMockOccupied(day, calMonth);
    const allSlots = generateSlots(workStart, workEnd, slotInterval);
    const startIdx = allSlots.indexOf(slot);
    if (startIdx === -1) return "unavailable";
    const slotsNeeded = Math.ceil(serviceDuration / slotInterval);
    const bufferSlots = Math.ceil(bufferMinutes / slotInterval);
    // Verificam daca serviciul incape
    if (startIdx + slotsNeeded > allSlots.length) return "unavailable";
    for (let i = startIdx; i < startIdx + slotsNeeded; i++) {
      if (occupied.includes(allSlots[i])) return "occupied";
    }
    // Verificam daca e buffer dupa un slot ocupat
    for (let i = Math.max(0, startIdx - bufferSlots); i < startIdx; i++) {
      if (occupied.includes(allSlots[i])) return "buffer";
    }
    return "free";
  };

  const hasFreeSlots = (day: number): boolean => {
    const today = new Date();
    const checkDate = new Date(calYear, calMonth, day);
    if (checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return false;
    if (checkDate.getDay() === 0) return false; // Duminica inchis
    const duration = selectedService?.duration * slotInterval || slotInterval;
    const allSlots = generateSlots(workStart, workEnd, slotInterval);
    return allSlots.some(slot => getSlotStatus(slot, day, duration) === "free");
  };

  const getSlotCount = (day: number): number => {
    const duration = selectedService?.duration * slotInterval || slotInterval;
    const allSlots = generateSlots(workStart, workEnd, slotInterval);
    return allSlots.filter(slot => getSlotStatus(slot, day, duration) === "free").length;
  };

  if (loading) return <div style={{ minHeight: "100vh", background: s.bg }} />;
  if (!provider) return (
    <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.muted }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, color: "#f0ede8", marginBottom: 8 }}>Profilul nu a fost gasit</div>
        <button onClick={() => router.push("/search")} style={{ padding: "10px 24px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 9, color: s.accent, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Cauta prestatori →</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: s.bg, color: "#f0ede8", minHeight: "100vh", fontFamily: "var(--font-outfit)" }}>
      <Navbar />

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <img src={lightboxImg} style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 12, objectFit: "contain" }} />
          <button onClick={() => setLightboxImg(null)} style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* BANNER */}
      <div style={{ height: 160, marginTop: 58, background: "linear-gradient(135deg,#1a1408,#2a2010,#1a1408)", position: "relative", overflow: "hidden", zIndex: 0 }}>
        {gallery[0] && <img src={gallery[0]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "0 16px 40px" : "0 24px 60px" }}>

        {/* HEADER CARD */}
        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 16, marginTop: -40, marginBottom: 20, position: "relative", zIndex: 1 }}>
          <div style={{ padding: isMobile ? "0 16px 20px" : "0 28px 24px", display: "flex", alignItems: "flex-end", gap: 18, flexWrap: "wrap" }}>
            <div style={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, borderRadius: isCompany ? 16 : "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: isMobile ? 24 : 30, fontWeight: 700, color: "#fff", border: `4px solid ${s.surface}`, flexShrink: 0, overflow: "hidden", marginTop: -32, flexShrink: 0 }}>
              {provider.avatar ? <img src={provider.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : provider.name?.charAt(0)}
            </div>
            <div style={{ flex: 1, paddingBottom: 4, minWidth: 160 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 20 : 26, fontWeight: 700 }}>{provider.name}</div>
                {isCompany && <div style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(90,141,224,0.15)", border: "1px solid rgba(90,141,224,0.3)", fontSize: 11, color: s.blue, fontWeight: 700 }}>🏢 Firma</div>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
                {provider.oras && <span style={{ fontSize: 13, color: s.muted }}>📍 {provider.oras}{provider.judet && `, ${provider.judet}`}</span>}
                {avgRating && <span style={{ fontSize: 13, color: s.accent }}>★ {avgRating} ({reviews.length} recenzii)</span>}
                {provider.phone && provider.showPhone && <span style={{ fontSize: 13, color: s.muted }}>📞 {provider.phone}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, paddingBottom: 4, flexWrap: "wrap" }}>
              {currentUser && (
                <button onClick={() => router.push(`/chat/${provider.id}`)} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  💬 Trimite mesaj
                </button>
              )}
              <button onClick={() => router.push("/search")} style={{ padding: "10px 16px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, fontSize: 13, color: s.muted, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                ← Inapoi
              </button>
            </div>
          </div>

          {/* BIO */}
          {provider.description && (
            <div style={{ padding: isMobile ? "0 16px 16px" : "0 28px 20px", fontSize: 14, color: "#c0bdb8", lineHeight: 1.8 }}>
              {provider.description}
            </div>
          )}

          {/* SOCIAL */}
          {Object.keys(SOCIAL_ICONS).some(k => provider[k]) && (
            <div style={{ padding: isMobile ? "0 16px 16px" : "0 28px 20px", display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Object.entries(SOCIAL_ICONS).filter(([k]) => provider[k]).map(([k, v]: any) => (
                <a key={k} href={provider[k]} target="_blank" rel="noopener noreferrer"
                  style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: v.color, textDecoration: "none", transition: "transform .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"}
                  title={k}>
                  <span dangerouslySetInnerHTML={{ __html: v.icon }} />
                </a>
              ))}
            </div>
          )}

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${s.border}` }}>
            {[
              [services.length.toString(), "Servicii"],
              [reviews.length.toString(), "Recenzii"],
              [avgRating || "—", "Rating"],
              [employees.length > 0 ? employees.length.toString() : "1", isCompany ? "Angajati" : "Ani exp."],
            ].map(([val, label], i) => (
              <div key={i} style={{ padding: isMobile ? "10px 8px" : "14px", borderRight: i < 3 ? `1px solid ${s.border}` : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 18 : 22, fontWeight: 700, color: s.accent }}>{val}</div>
                <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* REZERVARE ACTIVA */}
        {pendingBooking && (
          <div style={{ background: "rgba(232,184,75,0.08)", border: "1px solid rgba(232,184,75,0.3)", borderRadius: 14, padding: isMobile ? 14 : 18, marginBottom: 20, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ fontSize: 28 }}>{pendingBooking.status === "accepted" ? "✅" : "⏳"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                {pendingBooking.status === "accepted" ? "Rezervare confirmata!" : "Rezervare in asteptare"}
              </div>
              <div style={{ fontSize: 12, color: s.muted }}>{pendingBooking.service?.name} · {pendingBooking.date} · {pendingBooking.time}</div>
            </div>
            <div style={{ padding: "5px 14px", borderRadius: 8, background: pendingBooking.status === "accepted" ? "rgba(76,175,130,0.15)" : "rgba(232,184,75,0.15)", color: pendingBooking.status === "accepted" ? s.green : s.yellow, fontSize: 12, fontWeight: 700 }}>
              {pendingBooking.status === "accepted" ? "Confirmat" : "In asteptare"}
            </div>
          </div>
        )}

        {/* INTERACTIUNI */}
        {currentUser && (myBookingWithThis.length > 0) && (
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20, marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>🤝 Istoricul tau cu {provider.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 10, marginBottom: hasCollaborated ? 14 : 0 }}>
              {[
                [myBookingWithThis.length.toString(), "Rezervari totale", s.accent],
                [myBookingWithThis.filter(b => b.status === "completed").length.toString(), "Finalizate", s.green],
                [myBookingWithThis.filter(b => b.status === "pending").length.toString(), "In asteptare", s.yellow],
              ].map(([val, label, color]) => (
                <div key={label} style={{ background: s.surface2, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            {hasCollaborated && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(76,175,130,0.08)", border: "1px solid rgba(76,175,130,0.2)", borderRadius: 10 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.green }}>Client verificat</div>
                  <div style={{ fontSize: 11, color: s.muted }}>Ai colaborat deja cu acest prestator</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: 20, alignItems: "flex-start" }}>

          {/* COLOANA STANGA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ANGAJATI (doar pentru firme) */}
            {isCompany && employees.length > 0 && (
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Echipa noastra</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {employees.map((emp: any) => (
                    <div key={emp.id} onClick={() => { setActiveEmployee(emp); setServices(emp.provider?.services || []); setSelectedService(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, border: `1px solid ${activeEmployee?.id === emp.id ? "rgba(201,169,110,0.5)" : s.border}`, background: activeEmployee?.id === emp.id ? "rgba(201,169,110,0.08)" : s.surface2, cursor: "pointer", transition: "all .2s" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", flexShrink: 0 }}>
                        {emp.avatar ? <img src={emp.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : emp.name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{(emp.provider?.services || []).length} servicii</div>
                      </div>
                      {activeEmployee?.id === emp.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.accent }} />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICII */}
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
                Servicii {activeEmployee && isCompany ? `— ${activeEmployee.name}` : ""}
              </div>
              {services.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: s.muted, fontSize: 13 }}>Niciun serviciu disponibil</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {services.map((svc: any, idx: number) => {
                    const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                    const isFav = favorites.includes(svc.id);
                    const hasThisBooking = myBookingWithThis.some(b => b.serviceId === svc.id && (b.status === "pending" || b.status === "accepted"));
                    return (
                      <div key={svc.id} style={{ display: "flex", alignItems: "center", gap: 0, background: s.surface2, borderRadius: 12, overflow: "hidden", border: `1px solid ${selectedService?.id === svc.id ? "rgba(201,169,110,0.4)" : s.border}`, transition: "all .2s", cursor: "pointer" }}
                        onClick={() => setSelectedService(selectedService?.id === svc.id ? null : svc)}>
                        <div style={{ width: 4, height: "100%", background: colors[idx % colors.length], flexShrink: 0, minHeight: 70 }} />
                        <div style={{ flex: 1, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.name}</div>
                              {hasThisBooking && <div style={{ padding: "2px 7px", borderRadius: 4, background: "rgba(232,184,75,0.15)", color: s.yellow, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>⏳ Rezervat</div>}
                            </div>
                            {svc.description && <div style={{ fontSize: 12, color: s.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.description}</div>}
                            <div style={{ fontSize: 11, color: s.muted, marginTop: 4 }}>⏱ {svc.duration * 30} min</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                            <button onClick={e => { e.stopPropagation(); toggleFavorite(svc.id); }}
                              style={{ width: 28, height: 28, borderRadius: 7, background: isFav ? "rgba(201,169,110,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${isFav ? s.accent : s.border}`, color: isFav ? s.accent : s.muted, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {isFav ? "★" : "☆"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {selectedService && (
                <div style={{ marginTop: 14, padding: 16, background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Rezerva: {selectedService.name}</div>
                  <div style={{ fontSize: 12, color: s.muted, marginBottom: 12 }}>{selectedService.duration * 30} min · {selectedService.price} lei</div>
                  {currentUser ? (
                    <button style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                      Solicita rezervare
                    </button>
                  ) : (
                    <button onClick={() => router.push("/login")} style={{ width: "100%", padding: "11px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, fontSize: 14, fontWeight: 600, color: s.accent, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                      Autentifica-te pentru a rezerva
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* GALERIE */}
            {gallery.length > 0 && (
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Galerie foto</div>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`, gap: 8 }}>
                  {gallery.map((img: string, i: number) => (
                    <div key={i} onClick={() => setLightboxImg(img)} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", cursor: "pointer", border: `1px solid ${s.border}` }}>
                      <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .2s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"}
                        onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RECENZII */}
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Recenzii {reviews.length > 0 ? `(${reviews.length})` : ""}</div>
                {avgRating && <div style={{ fontSize: 14, color: s.accent, fontWeight: 700 }}>★ {avgRating}</div>}
              </div>
              {reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: s.muted, fontSize: 13 }}>
                  Nicio recenzie inca. Fii primul care lasa o parere!
                </div>
              ) : reviews.map((rev: any, i: number) => (
                <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < reviews.length - 1 ? `1px solid ${s.surface2}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", flexShrink: 0 }}>
                        {rev.client?.avatar ? <img src={rev.client.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : rev.client?.name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{rev.client?.name || "Client"}</div>
                        <div style={{ fontSize: 10, color: s.muted }}>Client verificat</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, color: s.accent }}>{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</div>
                      <div style={{ fontSize: 10, color: s.muted }}>{new Date(rev.createdAt).toLocaleDateString("ro-RO")}</div>
                    </div>
                  </div>
                  {rev.comment && <div style={{ fontSize: 13, color: "#c8c5c0", lineHeight: 1.7 }}>{rev.comment}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* COLOANA DREAPTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* CALENDAR REZERVARE */}
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
              
              {/* HEADER */}
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${s.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rezerva acum</div>
                {selectedService && (
                  <button onClick={() => { setSelectedService(null); setCalSelectedDay(null); setCalSelectedSlot(null); setBookingStep("service"); }}
                    style={{ fontSize: 11, color: s.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    Schimba serviciul
                  </button>
                )}
              </div>

              {/* STEP 1 - Selecteaza serviciu */}
              {!selectedService && (
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 13, color: s.muted, marginBottom: 14 }}>Alege un serviciu pentru a vedea disponibilitatea:</div>
                  {services.map((svc: any, idx: number) => {
                    const colors = ["#c9a96e","#5a8de0","#4caf82","#e8b84b","#e05a5a","#a78de0"];
                    return (
                      <div key={svc.id} onClick={() => { setSelectedService(svc); setBookingStep("calendar"); setCalSelectedDay(null); setCalSelectedSlot(null); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${s.border}`, background: s.surface2, marginBottom: 8, cursor: "pointer", transition: "all .2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.4)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.06)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = s.border; (e.currentTarget as HTMLDivElement).style.background = s.surface2; }}>
                        <div style={{ width: 4, height: 36, borderRadius: 2, background: colors[idx % colors.length], flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{svc.name}</div>
                          <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min</div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
                      </div>
                    );
                  })}
                  {services.length === 0 && <div style={{ textAlign: "center", color: s.muted, fontSize: 13, padding: "20px 0" }}>Niciun serviciu disponibil</div>}
                </div>
              )}

              {/* STEP 2 - Calendar */}
              {selectedService && !calSelectedDay && (
                <div style={{ padding: "16px 20px" }}>
                  {/* Serviciu selectat */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 10, marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedService.name}</div>
                      <div style={{ fontSize: 11, color: s.muted }}>{selectedService.duration * slotInterval} min · {selectedService.price} lei</div>
                    </div>
                    <div style={{ fontSize: 14, color: s.accent }}>✓</div>
                  </div>

                  {/* Header calendar */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
                      style={{ width: 28, height: 28, borderRadius: 7, background: s.surface2, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {new Date(calYear, calMonth).toLocaleDateString("ro-RO", { month: "long", year: "numeric" })}
                    </div>
                    <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
                      style={{ width: 28, height: 28, borderRadius: 7, background: s.surface2, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                  </div>

                  {/* Zile saptamana */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
                    {["L","M","M","J","V","S","D"].map((d, i) => (
                      <div key={i} style={{ textAlign: "center", fontSize: 10, color: i >= 5 ? s.red : s.muted, fontWeight: 600, padding: "4px 0" }}>{d}</div>
                    ))}
                  </div>

                  {/* Grid zile */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                    {(() => {
                      const firstDay = new Date(calYear, calMonth, 1).getDay();
                      const offset = firstDay === 0 ? 6 : firstDay - 1;
                      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                      const today = new Date();
                      const cells = [];
                      for (let i = 0; i < offset; i++) cells.push(null);
                      for (let d = 1; d <= daysInMonth; d++) cells.push(d);
                      return cells.map((day, idx) => {
                        if (!day) return <div key={idx} />;
                        const isToday = today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear;
                        const free = hasFreeSlots(day);
                        const count = free ? getSlotCount(day) : 0;
                        const isPast = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const isSunday = new Date(calYear, calMonth, day).getDay() === 0;
                        const isDisabled = isPast || isSunday || !free;
                        return (
                          <div key={idx} onClick={() => !isDisabled && setCalSelectedDay(day)}
                            style={{ aspectRatio: "1", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: isToday ? 700 : 400, cursor: isDisabled ? "default" : "pointer", background: isToday ? "rgba(201,169,110,0.15)" : "transparent", border: isToday ? `1px solid ${s.accent}` : "1px solid transparent", color: isDisabled ? "#444" : "#f0ede8", position: "relative", transition: "all .15s" }}
                            onMouseEnter={e => { if (!isDisabled) { (e.currentTarget as HTMLDivElement).style.background = "rgba(201,169,110,0.1)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)"; } }}
                            onMouseLeave={e => { if (!isDisabled && !isToday) { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.borderColor = "transparent"; } }}>
                            <span>{day}</span>
                            {!isDisabled && (
                              <div style={{ width: 4, height: 4, borderRadius: "50%", background: count > 5 ? s.green : count > 2 ? s.yellow : s.red, marginTop: 1 }} />
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Legenda */}
                  <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                    {[[s.green,"Disponibil"],[s.yellow,"Putine locuri"],[s.red,"Aproape ocupat"]].map(([color, label]) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                        <span style={{ fontSize: 10, color: s.muted }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 - Sloturi */}
              {selectedService && calSelectedDay && !calSelectedSlot && (
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <button onClick={() => setCalSelectedDay(null)} style={{ width: 28, height: 28, borderRadius: 7, background: s.surface2, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {new Date(calYear, calMonth, calSelectedDay).toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" })}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: s.muted, marginBottom: 12 }}>Alege ora pentru <strong>{selectedService.name}</strong> ({selectedService.duration * slotInterval} min):</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                    {generateSlots(workStart, workEnd, slotInterval).map(slot => {
                      const status = getSlotStatus(slot, calSelectedDay, selectedService.duration * slotInterval);
                      const isAvail = status === "free";
                      return (
                        <button key={slot} disabled={!isAvail} onClick={() => isAvail && setCalSelectedSlot(slot)}
                          style={{ padding: "8px 4px", borderRadius: 8, border: `1px solid ${isAvail ? "rgba(76,175,130,0.4)" : s.border}`, background: isAvail ? "rgba(76,175,130,0.08)" : s.surface2, color: isAvail ? s.green : "#444", fontSize: 12, fontWeight: 600, cursor: isAvail ? "pointer" : "default", fontFamily: "var(--font-outfit)", transition: "all .15s", position: "relative" }}
                          onMouseEnter={e => { if (isAvail) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(76,175,130,0.2)"; } }}
                          onMouseLeave={e => { if (isAvail) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(76,175,130,0.08)"; } }}>
                          {slot}
                          {status === "buffer" && <span style={{ position: "absolute", top: 2, right: 2, width: 4, height: 4, borderRadius: "50%", background: s.yellow }} />}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    {[[s.green,"rgba(76,175,130,0.08)","Disponibil"],["#444",s.surface2,"Ocupat"]].map(([color, bg, label]) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, background: bg, border: `1px solid ${color}` }} />
                        <span style={{ fontSize: 10, color: s.muted }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4 - Confirmare */}
              {selectedService && calSelectedDay && calSelectedSlot && (
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <button onClick={() => setCalSelectedSlot(null)} style={{ width: 28, height: 28, borderRadius: 7, background: s.surface2, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Confirma rezervarea</div>
                  </div>
                  <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                    {[
                      ["🔧 Serviciu", selectedService.name],
                      ["📅 Data", new Date(calYear, calMonth, calSelectedDay).toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" })],
                      ["🕐 Ora", calSelectedSlot],
                      ["⏱ Durata", `${selectedService.duration * slotInterval} min`],
                      ["💰 Pret", `${selectedService.price} lei`],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
                        <span style={{ fontSize: 12, color: s.muted }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  {activeEmployee && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: s.surface2, borderRadius: 8, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", overflow: "hidden", flexShrink: 0 }}>
                        {activeEmployee.avatar ? <img src={activeEmployee.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : activeEmployee.name?.charAt(0)}
                      </div>
                      <div style={{ fontSize: 12 }}>Specialist: <strong>{activeEmployee.name}</strong></div>
                    </div>
                  )}
                  {currentUser ? (
                    <button style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}
                      onClick={() => alert("🚀 Backend urmează! Rezervarea va fi trimisă prestatorului.")}>
                      ✅ Solicita rezervarea
                    </button>
                  ) : (
                    <button onClick={() => router.push("/login")} style={{ width: "100%", padding: "13px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, fontSize: 14, fontWeight: 600, color: s.accent, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                      Autentifica-te pentru a rezerva →
                    </button>
                  )}
                  <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(76,175,130,0.06)", border: "1px solid rgba(76,175,130,0.2)", borderRadius: 8, fontSize: 11, color: s.muted, textAlign: "center" }}>
                    ⚡ Rezervarea necesita confirmare din partea prestatorului
                  </div>
                </div>
              )}
            </div>

            {/* COMPANIE PARINTE - doar pentru angajati */}
            {!isCompany && provider.company && (
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Parte din echipa</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "8px", background: s.surface2, borderRadius: 10, border: `1px solid ${s.border}`, transition: "border-color .2s" }}
                  onClick={() => router.push(`/p/${provider.company.id}`)}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.4)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = s.border}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", overflow: "hidden", flexShrink: 0 }}>
                    {provider.company.avatar ? <img src={provider.company.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : provider.company.name?.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{provider.company.name}</div>
                    <div style={{ fontSize: 12, color: s.muted }}>📍 {provider.company.oras}{provider.company.judet && `, ${provider.company.judet}`}</div>
                  </div>
                  <div style={{ fontSize: 20, color: s.muted, flexShrink: 0 }}>›</div>
                </div>
              </div>
            )}

            {/* FAVORITE */}
            {favorites.length > 0 && (
              <div style={{ background: s.surface, border: "1px solid rgba(201,169,110,0.2)", borderRadius: 14, padding: 16 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600, marginBottom: 12, color: s.accent }}>★ Servicii favorite</div>
                {services.filter(s => favorites.includes(s.id)).map((svc: any) => (
                  <div key={svc.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${s.surface2}`, fontSize: 13 }}>
                    <span>{svc.name}</span>
                    <span style={{ color: s.accent, fontWeight: 700 }}>{svc.price} lei</span>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT */}
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {currentUser && (
                  <button onClick={() => router.push(`/chat/${provider.id}`)} style={{ width: "100%", padding: "11px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 10, fontSize: 13, fontWeight: 600, color: s.accent, cursor: "pointer", fontFamily: "var(--font-outfit)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    💬 Trimite mesaj
                  </button>
                )}
                {provider.whatsapp && (
                  <a href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    style={{ width: "100%", padding: "11px", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#25D366", cursor: "pointer", fontFamily: "var(--font-outfit)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}>
                    📱 WhatsApp
                  </a>
                )}
                {provider.showEmail && provider.email && (
                  <a href={`mailto:${provider.contactEmail || provider.email}`}
                    style={{ width: "100%", padding: "11px", background: "rgba(90,141,224,0.1)", border: "1px solid rgba(90,141,224,0.2)", borderRadius: 10, fontSize: 13, fontWeight: 600, color: s.blue, cursor: "pointer", fontFamily: "var(--font-outfit)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}>
                    ✉️ Email
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}