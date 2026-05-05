"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProviderPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [provider, setProvider] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [activeEmployee, setActiveEmployee] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [rezervare, setRezervare] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const days = [
    { name: "Lun", num: 5, avail: false },
    { name: "Mar", num: 6, avail: true },
    { name: "Mie", num: 7, avail: true },
    { name: "Joi", num: 8, avail: true },
    { name: "Vin", num: 9, avail: true },
    { name: "Sâm", num: 10, avail: false },
    { name: "Dum", num: 11, avail: false },
  ];

  const mockSlots = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00"];

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", yellow: "#e8b84b", red: "#e05a5a",
  };

  useEffect(() => {
    fetch(`/api/providers/${slug}`).then(r => r.json()).then(d => {
      setProvider(d.provider);
      setEmployees(d.employees || []);
      if (d.provider?.accountType === "company") {
  if (d.employees?.length > 0) {
    setActiveEmployee(d.employees[0]);
    setServices(d.employees[0].services || []);
  } else {
    // Firma fara angajati - serviciile sunt ale firmei
    setServices(d.services || []);
  }
} else {
  setServices(d.services || []);
}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const selectEmployee = (emp: any) => {
    setActiveEmployee(emp);
    setServices(emp.services || []);
    setSelectedService(null);
    setSelectedDay(null);
    setSelectedSlot(null);
    setRezervare(null);
  };

  const selectService = (svc: any) => {
    setSelectedService(svc);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const selectDay = (day: any) => {
    if (!day.avail) return;
    setSelectedDay(day.num);
    setSelectedSlot(null);
    setSlots(mockSlots);
  };

  const selectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setRezervare({
      serviciu: selectedService?.name,
      data: `${days.find(d => d.num === selectedDay)?.name} ${selectedDay} Mai`,
      ora: slot,
      pret: selectedService?.price,
      status: "pending",
    });
  };

  const doRezervare = async () => {
    try {
      const res = await fetch(`/api/providers/${slug}`).then(r => r.json());
      const realProviderId = isCompany
        ? activeEmployee?.provider?.id || res.employees?.find((e: any) => e.id === activeEmployee?.id)?.provider?.id
        : res.services?.[0]?.providerId;
      if (!realProviderId) { alert("Eroare: provider negăsit!"); return; }
      const bookRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: realProviderId,
          serviceId: selectedService?.id,
          date: `${selectedDay} Mai 2025`,
          time: selectedSlot,
        })
      });
      const data = await bookRes.json();
      if (bookRes.ok) {
        setRezervare((prev: any) => ({ ...prev, status: "pending", id: data.booking.id }));
      } else {
        alert(data.error || "Eroare la rezervare");
      }
    } catch { alert("Eroare de conexiune"); }
  };

  const isCompany = provider?.accountType === "company";

  if (loading) return <div style={{ minHeight: "100vh", background: s.bg }} />;
  if (!provider) return <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.muted }}>Profilul nu a fost găsit.</div>;
  return (
    <div style={{ background: s.bg, color: "#f0ede8", minHeight: "100vh", fontFamily: "var(--font-outfit)" }}>

      {/* HEADER BANNER */}
      <div style={{ height: 160, background: isCompany ? "linear-gradient(135deg,#1a1408,#2a2010)" : "linear-gradient(135deg,#0e1520,#152030)" }} />

      {/* HEADER CONTENT */}
      <div style={{ padding: "0 32px 24px", display: "flex", alignItems: "flex-end", gap: 20, marginTop: -36 }}>
        {isCompany ? (
          <div style={{ width: 72, height: 72, borderRadius: 14, background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: "#fff", border: `3px solid ${s.bg}`, flexShrink: 0 }}>
            {provider.avatar ? <img src={provider.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} /> : provider.name?.charAt(0)}
          </div>
        ) : (
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color: "#fff", border: `4px solid ${s.bg}`, flexShrink: 0 }}>
            {provider.avatar ? <img src={provider.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : provider.name?.charAt(0)}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{provider.name}</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {provider.oras && <span style={{ fontSize: 12, color: s.muted }}>📍 {provider.oras}{provider.judet ? `, ${provider.judet}` : ""}</span>}
            {provider.cui && <span style={{ fontSize: 12, color: s.muted }}>CUI: {provider.cui}</span>}
            {provider.adresa && <span style={{ fontSize: 12, color: s.muted }}>{provider.adresa}</span>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, color: s.accent }}>
            ★ 4.92 <span style={{ color: s.muted, fontWeight: 400 }}>(127 recenzii)</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {provider.instagram && <a href={provider.instagram} target="_blank" title="Instagram" style={{ width: 32, height: 32, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="#c9a96e"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>}
            {provider.facebook && <a href={provider.facebook} target="_blank" title="Facebook" style={{ width: 32, height: 32, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="#c9a96e"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>}
            {provider.tiktok && <a href={provider.tiktok} target="_blank" title="TikTok" style={{ width: 32, height: 32, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="#c9a96e"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>}
            {provider.website && <a href={provider.website} target="_blank" title="Website" style={{ width: 32, height: 32, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="#c9a96e"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 16.057v-3.05c-1.354.083-2.737.455-3.556 1.099-.122-.336-.188-.693-.188-1.063 0-1.447 1.037-2.657 2.444-2.939V7.943c0-.552.448-1 1-1s1 .448 1 1v2.161c1.407.282 2.444 1.492 2.444 2.939 0 .37-.066.727-.188 1.063-.819-.644-2.202-1.016-3.556-1.099v3.05c0 .552-.448 1-1 1s-1-.448-1-1z"/></svg></a>}
          </div>
        </div>
      </div>

      {/* DESCRIERE + DETALII */}
      <div style={{ padding: "0 32px 20px", borderBottom: `1px solid ${s.border}` }}>
        {provider.description && <div style={{ fontSize: 13, color: "#a0a0a0", lineHeight: 1.7, marginBottom: 14 }}>{provider.description}</div>}
        {(provider.showPhone && provider.phone) || (provider.showEmail && provider.email) ? (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {provider.showPhone && provider.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: "8px 14px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a96e"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{provider.phone}</span>
              </div>
            )}
            {provider.showEmail && provider.email && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: "8px 14px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a96e"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{provider.email}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
      {/* TABURI ANGAJATI */}
      {isCompany && employees.length > 0 && (
        <div style={{ padding: "0 32px", borderBottom: `1px solid ${s.border}`, display: "flex", overflowX: "auto" }}>
          {employees.map((emp: any) => (
            <div key={emp.id} onClick={() => selectEmployee(emp)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `2px solid ${activeEmployee?.id === emp.id ? s.accent : "transparent"}`, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, color: activeEmployee?.id === emp.id ? s.accent : s.muted, transition: "all 0.15s" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                {emp.name?.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{emp.name}</div>
                <div style={{ fontSize: 11, color: s.accent }}>★ 4.9</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTIUNEA PRINCIPALA */}
      <div style={{ padding: "24px 32px" }}>

        {/* HEADER ANGAJAT ACTIV */}
        {isCompany && activeEmployee && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {activeEmployee.name?.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700 }}>{activeEmployee.name}</div>
                <div style={{ fontSize: 13, color: s.accent, marginTop: 2 }}>★ 4.97 · {services.length} servicii</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {[["0", "Rezervări"], ["0", "Clienți"], ["★ 4.9", "Rating"], [services.length.toString(), "Servicii"]].map(([val, label]) => (
                <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: "12px 16px", textAlign: "center", flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: s.accent }}>{val}</div>
                  <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* REZERVARE ACTIVA */}
        {rezervare && (
          <div style={{ borderRadius: 12, padding: "14px 16px", marginBottom: 20, background: rezervare.status === "pending" ? "rgba(232,184,75,0.08)" : rezervare.status === "accepted" ? "rgba(76,175,130,0.08)" : "rgba(224,90,90,0.08)", border: `1px solid ${rezervare.status === "pending" ? "rgba(232,184,75,0.25)" : rezervare.status === "accepted" ? "rgba(76,175,130,0.25)" : "rgba(224,90,90,0.25)"}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10, color: rezervare.status === "pending" ? s.yellow : rezervare.status === "accepted" ? s.green : s.red }}>
              {rezervare.status === "pending" ? "⏳ Rezervare în așteptare" : rezervare.status === "accepted" ? "✅ Rezervare confirmată" : "❌ Rezervare anulată"}
            </div>
            {[["Serviciu", rezervare.serviciu], ["Data", rezervare.data], ["Ora", rezervare.ora], ["Preț", `${rezervare.pret} lei`]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: s.muted }}>{label}</span>
                <span style={{ fontWeight: 600, color: label === "Preț" ? s.accent : "#f0ede8" }}>{val}</span>
              </div>
            ))}
            <div style={{ fontSize: 11, color: s.muted, marginTop: 8 }}>
              Aștepți confirmarea de la {isCompany ? activeEmployee?.name : provider.name}
            </div>
          </div>
        )}

{/* LISTA SERVICII */}
        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${s.border}`, fontSize: 13, fontWeight: 600, color: s.muted }}>
            Selectează un serviciu
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto" }}>
            {services.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: s.muted, fontSize: 13 }}>Niciun serviciu disponibil.</div>
            ) : services.map((svc: any, i: number) => (
              <div key={i} onClick={() => selectService(svc)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < services.length - 1 ? `1px solid ${s.surface2}` : "none", cursor: "pointer", background: selectedService?.id === svc.id ? "rgba(201,169,110,0.06)" : "transparent", borderLeft: `3px solid ${selectedService?.id === svc.id ? s.accent : "transparent"}`, transition: "background 0.15s" }}>
                <div style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{svc.icon || "✂️"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{svc.name}</div>
                  <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min · {svc.duration} slot{svc.duration > 1 ? "uri" : ""}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: s.accent }}>{svc.price} lei</div>
              </div>
            ))}
          </div>
        </div>

        {/* BUTON MESAJ */}
        <button onClick={() => {
          const chatWith = isCompany && activeEmployee ? activeEmployee.id : provider.id;
          window.location.href = `/chat/${chatWith}`;
        }} style={{ width: "100%", padding: 12, background: "transparent", color: s.accent, border: `1px solid rgba(201,169,110,0.3)`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a96e"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          Trimite mesaj {isCompany && activeEmployee ? `lui ${activeEmployee.name}` : provider.name}
        </button>

        {/* CALENDAR DROPDOWN */}
        {selectedService && (
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: s.accent, marginBottom: 12 }}>
              Alege ziua — Mai 2025 · {selectedService.name}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {days.map(day => (
                <div key={day.num} onClick={() => selectDay(day)} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 7, cursor: day.avail ? "pointer" : "not-allowed", border: `1px solid ${selectedDay === day.num ? s.accent : day.avail ? "rgba(201,169,110,0.2)" : "transparent"}`, background: selectedDay === day.num ? "rgba(201,169,110,0.12)" : "transparent", opacity: day.avail ? 1 : 0.25 }}>
                  <div style={{ fontSize: 9, color: selectedDay === day.num ? s.accent : s.muted, marginBottom: 3 }}>{day.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selectedDay === day.num ? s.accent : "#f0ede8" }}>{day.num}</div>
                </div>
              ))}
            </div>
            {selectedDay && (
              <>
                <div style={{ fontSize: 11, color: s.muted, marginBottom: 8 }}>Sloturi disponibile:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                  {slots.map((slot) => {
                    const isBusy = ["10:00","10:30","14:30"].includes(slot);
                    const isPend = slot === "11:00";
                    const isSel = selectedSlot === slot;
                    return (
                      <div key={slot} onClick={() => !isBusy && !isPend && selectSlot(slot)} style={{ padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: isBusy || isPend ? "not-allowed" : "pointer", border: `1px solid ${isSel ? s.accent : isBusy ? s.surface2 : isPend ? "rgba(232,184,75,0.3)" : "rgba(76,175,130,0.3)"}`, background: isSel ? "rgba(201,169,110,0.15)" : isBusy ? s.surface : isPend ? "rgba(232,184,75,0.08)" : "rgba(76,175,130,0.08)", color: isSel ? s.accent : isBusy ? "#444" : isPend ? s.yellow : s.green, textDecoration: isBusy ? "line-through" : "none" }}>
                        {slot}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  {[["rgba(76,175,130,0.2)", "rgba(76,175,130,0.4)", "Liber"], ["rgba(232,184,75,0.2)", "rgba(232,184,75,0.4)", "Așteptare"], ["#1e1e1e", "#333", "Ocupat"]].map(([bg, border, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: s.muted }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: bg as string, border: `1px solid ${border}` }} />
                      {label}
                    </div>
                  ))}
                </div>
                {selectedSlot && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button onClick={() => {
  const chatWith = isCompany && activeEmployee ? activeEmployee.id : provider.id;
  window.location.href = `/chat/${chatWith}`;
}} style={{ width: "100%", padding: 10, background: "transparent", color: s.accent, border: `1px solid rgba(201,169,110,0.3)`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a96e"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
  Trimite mesaj
</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {/* GALERIE */}
      <div style={{ padding: "0 32px 24px" }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Galerie</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 100, borderRadius: 10, background: `linear-gradient(135deg, #1a1408, #${i % 2 === 0 ? "2a2010" : "1a2008"})`, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.muted, fontSize: 22 }}>
              📷
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div style={{ padding: "24px 32px", borderTop: `1px solid ${s.border}` }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Recenzii {isCompany && activeEmployee ? activeEmployee.name : provider.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "Radu M.", stars: 5, text: "Serviciu excelent, foarte profesionist!", service: "Tuns + Styling", av: "R" },
            { name: "Elena K.", stars: 5, text: "Rezultat exact cum am vrut. Revin cu siguranță!", service: "Vopsit complet", av: "E" },
          ].map((r, i) => (
            <div key={i} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: 14, display: "flex", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#3a2a1a,#5a4a2a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: s.accent, flexShrink: 0 }}>
                {r.av}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.name}</div>
                <div style={{ color: s.accent, fontSize: 11, marginBottom: 4 }}>{"★".repeat(r.stars)}</div>
                <div style={{ fontSize: 12, color: "#a0a0a0", lineHeight: 1.6 }}>{r.text}</div>
                <div style={{ display: "inline-block", marginTop: 6, fontSize: 10, color: s.muted, background: s.surface2, padding: "3px 8px", borderRadius: 5 }}>{r.service}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}