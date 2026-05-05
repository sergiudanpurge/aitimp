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

 useEffect(() => {
    fetch(`/api/providers/${slug}`).then(r => r.json()).then(d => {
      setProvider(d.provider);
      setEmployees(d.employees || []);
      if (d.provider?.accountType === "company") {
        if (d.employees?.length > 0) {
          setActiveEmployee(d.employees[0]);
          setServices(d.employees[0].services || []);
        }
      } else {
        // Persoana fizica - serviciile sunt direct pe provider
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
    setRezervare(null);
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

  const isCompany = provider?.accountType === "company";

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", yellow: "#e8b84b", red: "#e05a5a",
  };
  if (loading) return (
    <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.accent, fontFamily: "var(--font-playfair)", fontSize: "1.2rem" }}>
      Se încarcă...
    </div>
  );

  if (!provider) return (
    <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.muted }}>
      Profilul nu a fost găsit.
    </div>
  );

  return (
    <div style={{ background: s.bg, color: "#f0ede8", minHeight: "100vh", fontFamily: "var(--font-outfit)" }}>

      {/* HEADER BANNER */}
      <div style={{ height: 160, background: isCompany ? "linear-gradient(135deg,#1a1408,#2a2010)" : "linear-gradient(135deg,#0e1520,#152030)" }} />

      {/* HEADER CONTENT */}
      <div style={{ padding: "0 32px 24px", display: "flex", alignItems: "flex-end", gap: 20, marginTop: -36 }}>
        {isCompany ? (
          <div style={{ width: 72, height: 72, borderRadius: 14, background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: "#fff", border: `3px solid ${s.bg}`, flexShrink: 0 }}>
            {provider.name?.charAt(0)}
          </div>
        ) : (
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color: "#fff", border: `4px solid ${s.bg}`, flexShrink: 0 }}>
            {provider.name?.charAt(0)}
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
            {provider.instagram && <div style={{ padding: "5px 10px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 7, fontSize: 11, color: s.muted, cursor: "pointer" }}>📸 Instagram</div>}
            {provider.facebook && <div style={{ padding: "5px 10px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 7, fontSize: 11, color: s.muted, cursor: "pointer" }}>👍 Facebook</div>}
            {provider.website && <div style={{ padding: "5px 10px", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 7, fontSize: 11, color: s.muted, cursor: "pointer" }}>🌐 Website</div>}
          </div>
        </div>
      </div>

      {/* FIRMA INFO */}
      <div style={{ padding: "20px 32px", borderBottom: `1px solid ${s.border}` }}>
        {provider.description && <div style={{ fontSize: 13, color: "#a0a0a0", lineHeight: 1.7, marginBottom: 14 }}>{provider.description}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          {provider.phone && (
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: "10px 14px", flex: 1 }}>
              <div style={{ fontSize: 10, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Telefon</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{provider.phone}</div>
            </div>
          )}
          {provider.email && (
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: "10px 14px", flex: 1 }}>
              <div style={{ fontSize: 10, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Email</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{provider.email}</div>
            </div>
          )}
        </div>
      </div>
      {/* TABURI ANGAJATI - doar pentru companii */}
      {isCompany && employees.length > 0 && (
        <div style={{ padding: "0 32px", borderBottom: `1px solid ${s.border}`, display: "flex", gap: 0, overflowX: "auto" }}>
          {employees.map((emp: any) => (
            <div key={emp.id} onClick={() => selectEmployee(emp)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `2px solid ${activeEmployee?.id === emp.id ? s.accent : "transparent"}`, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, color: activeEmployee?.id === emp.id ? s.accent : s.muted, transition: "all 0.15s" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
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

      {/* SECTIUNEA ANGAJAT ACTIV */}
      <div style={{ padding: "24px 32px" }}>
        {isCompany && activeEmployee && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {activeEmployee.name?.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700 }}>{activeEmployee.name}</div>
                <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>{activeEmployee.email}</div>
                <div style={{ fontSize: 13, color: s.accent, marginTop: 2 }}>★ 4.97 · 84 recenzii</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {[["84", "Recenzii"], ["312", "Clienți"], ["8 ani", "Experiență"], [services.length.toString(), "Servicii"]].map(([val, label]) => (
                <div key={label} style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: "12px 16px", textAlign: "center", flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: s.accent }}>{val}</div>
                  <div style={{ fontSize: 10, color: s.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SERVICII + CALENDAR */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

          {/* LISTA SERVICII */}
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${s.border}`, fontSize: 13, fontWeight: 600, color: s.muted }}>
              Selectează un serviciu
            </div>
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {services.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: s.muted, fontSize: 13 }}>Niciun serviciu disponibil.</div>
              ) : services.map((svc: any, i: number) => (
                <div key={i} onClick={() => selectService(svc)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < services.length - 1 ? `1px solid ${s.surface2}` : "none", cursor: "pointer", background: selectedService?.id === svc.id ? "rgba(201,169,110,0.06)" : "transparent", borderLeft: selectedService?.id === svc.id ? `3px solid ${s.accent}` : "3px solid transparent", transition: "background 0.15s" }}
                  onMouseEnter={e => { if (selectedService?.id !== svc.id) (e.currentTarget as HTMLDivElement).style.background = "#1a1a1a"; }}
                  onMouseLeave={e => { if (selectedService?.id !== svc.id) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                  <div style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{svc.icon || "✂️"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{svc.name}</div>
                    <div style={{ fontSize: 11, color: s.muted }}>{svc.duration * 30} min · {svc.duration} slot{svc.duration > 1 ? "uri" : ""}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: s.accent, flexShrink: 0 }}>{svc.price} lei</div>
                </div>
              ))}
            </div>
          </div>

          {/* PANOUL DREAPTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* REZERVARE STATUS */}
            {rezervare && (
              <div style={{ borderRadius: 12, padding: "14px 16px", background: rezervare.status === "pending" ? "rgba(232,184,75,0.08)" : "rgba(76,175,130,0.08)", border: `1px solid ${rezervare.status === "pending" ? "rgba(232,184,75,0.25)" : "rgba(76,175,130,0.25)"}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10, color: rezervare.status === "pending" ? s.yellow : s.green }}>
                  {rezervare.status === "pending" ? "⏳ Rezervare în așteptare" : "✅ Rezervare confirmată"}
                </div>
                {[["Serviciu", rezervare.serviciu], ["Data", rezervare.data], ["Ora", rezervare.ora], ["Preț", `${rezervare.pret} lei`]].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: s.muted }}>{label}</span>
                    <span style={{ fontWeight: 600, color: label === "Preț" ? s.accent : "#f0ede8" }}>{val}</span>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: s.muted, marginTop: 8 }}>Aștepți confirmarea de la {isCompany ? activeEmployee?.name : provider.name}</div>
              </div>
            )}

            {/* CALENDAR */}
            {selectedService && (
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: s.accent, marginBottom: 12 }}>Alege ziua — Mai 2025</div>
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
                      {slots.map((slot, i) => {
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
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: bg, border: `1px solid ${border}` }} />
                          {label}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedSlot && (
                  <button style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    Rezervă acum
                  </button>
                )}
              </div>
            )}
          </div>
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