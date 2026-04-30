"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const DAYS = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];

const defaultSchedule = DAYS.reduce((acc, day, i) => ({
  ...acc,
  [day]: { active: i < 5, start: "09:00", end: "18:00", open: false }
}), {} as any);

export default function EmployeeProfile() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [employee, setEmployee] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("program");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<any>(defaultSchedule);
  const [newService, setNewService] = useState({ name: "", price: "", duration: 1, icon: "✂️" });
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    fetch(`/api/employees/${id}`).then(r => r.json()).then(d => {
      setEmployee(d.employee);
      if (d.services) setServices(d.services);
    });
  }, [id]);

  const toggleActive = async () => {
    const res = await fetch(`/api/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !employee.isActive }),
    });
    if (res.ok) {
      setEmployee({ ...employee, isActive: !employee.isActive });
      setMsg(employee.isActive ? "Angajat dezactivat!" : "Angajat activat!");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const saveSchedule = () => {
    setMsg("Program salvat!");
    setTimeout(() => setMsg(""), 2000);
  };

  const addService = async () => {
    setLoading(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newService, employeeId: id }),
    });
    const data = await res.json();
    if (res.ok) {
      setServices([...services, data.service]);
      setMsg("Serviciu adăugat!");
      setNewService({ name: "", price: "", duration: 1, icon: "✂️" });
      setShowServiceModal(false);
      setTimeout(() => setMsg(""), 2000);
    }
    setLoading(false);
  };

  const getSlots = (start: string, end: string) => {
    const slots = [];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let h = sh, m = sm;
    while (h < eh || (h === eh && m < em)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += 30; if (m >= 60) { h++; m = 0; }
    }
    return slots;
  };

  const inputStyle = { width: "100%", padding: "11px 14px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 7 };

  if (!employee) return (
    <DashboardLayout title="Se încarcă...">
      <div style={{ color: "#777", fontSize: 14 }}>Se încarcă profilul angajatului...</div>
    </DashboardLayout>
  );

  const tabs = ["program", "servicii", "calendar", "rezervari", "statistici"];

  return (
    <DashboardLayout title={employee.name} actions={
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {msg && <div style={{ padding: "8px 14px", background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, color: "#4caf82", fontSize: 13 }}>{msg}</div>}
        <button onClick={toggleActive} style={{ padding: "10px 20px", background: employee.isActive === false ? "rgba(76,175,130,0.1)" : "rgba(224,90,90,0.1)", border: `1px solid ${employee.isActive === false ? "rgba(76,175,130,0.3)" : "rgba(224,90,90,0.3)"}`, borderRadius: 10, color: employee.isActive === false ? "#4caf82" : "#e05a5a", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          {employee.isActive === false ? "▶ Activează" : "⏸ Dezactivează"}
        </button>
      </div>
    }>

      {/* Header angajat */}
      <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ height: 80, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
        <div style={{ padding: "0 24px 24px", marginTop: -28, display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", border: "3px solid #161616", fontFamily: "var(--font-playfair)", flexShrink: 0 }}>
            {employee.name?.charAt(0)}
          </div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700 }}>{employee.name}</div>
            <div style={{ fontSize: 13, color: "#777", marginTop: 2 }}>{employee.email}</div>
          </div>
          <div style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: employee.isActive === false ? "rgba(224,90,90,0.15)" : employee.emailVerified ? "rgba(76,175,130,0.15)" : "rgba(232,184,75,0.15)", color: employee.isActive === false ? "#e05a5a" : employee.emailVerified ? "#4caf82" : "#e8b84b" }}>
            {employee.isActive === false ? "● Dezactivat" : employee.emailVerified ? "● Activ" : "● Invitat"}
          </div>
        </div>

        {/* Mini stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid #262626" }}>
          {[["0", "Rezervări"], ["0 lei", "Încasări"], ["—", "Rating"], [services.length.toString(), "Servicii"]].map(([val, label], i) => (
            <div key={i} style={{ padding: "16px 20px", borderRight: i < 3 ? "1px solid #262626" : "none", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: "#c9a96e" }}>{val}</div>
              <div style={{ fontSize: 11, color: "#777", marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#161616", border: "1px solid #262626", borderRadius: 12, padding: 4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", background: activeTab === t ? "rgba(201,169,110,0.15)" : "transparent", color: activeTab === t ? "#c9a96e" : "#777", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", transition: "all 0.15s" }}>
            {t === "program" ? "Program" : t === "servicii" ? "Servicii" : t === "calendar" ? "Calendar" : t === "rezervari" ? "Rezervări" : "Statistici"}
          </button>
        ))}
      </div>

      {/* TAB: PROGRAM */}
      {activeTab === "program" && (
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 24 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Program de lucru</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DAYS.map(day => (
              <div key={day} style={{ background: "#1e1e1e", borderRadius: 10, border: "1px solid #262626", overflow: "hidden" }}>
                {/* Header zi */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 16px", cursor: "pointer" }}
                  onClick={() => setSchedule({ ...schedule, [day]: { ...schedule[day], open: !schedule[day].open } })}>
                  <input type="checkbox" checked={schedule[day].active}
                    onChange={e => { e.stopPropagation(); setSchedule({ ...schedule, [day]: { ...schedule[day], active: e.target.checked } }); }}
                    style={{ width: 16, height: 16, accentColor: "#c9a96e", cursor: "pointer", flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: schedule[day].active ? "#f0ede8" : "#777" }}>{day}</div>
                  {schedule[day].active ? (
                    <div style={{ fontSize: 12, color: "#c9a96e", fontWeight: 600 }}>
                      {schedule[day].start} — {schedule[day].end}
                      <span style={{ color: "#777", marginLeft: 8 }}>
                        ({getSlots(schedule[day].start, schedule[day].end).length} sloturi)
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: "#777" }}>Zi liberă</div>
                  )}
                  <span style={{ color: "#777", fontSize: 11, transition: "transform 0.2s", display: "inline-block", transform: schedule[day].open ? "rotate(180deg)" : "none" }}>▼</span>
                </div>

                {/* Dropdown */}
                {schedule[day].open && schedule[day].active && (
                  <div style={{ padding: "0 16px 16px", borderTop: "1px solid #262626" }}>
                    <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ora start</label>
                        <input type="time" value={schedule[day].start}
                          onChange={e => setSchedule({ ...schedule, [day]: { ...schedule[day], start: e.target.value } })}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #262626", background: "#161616", color: "#f0ede8", fontSize: 13, outline: "none" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ora sfârșit</label>
                        <input type="time" value={schedule[day].end}
                          onChange={e => setSchedule({ ...schedule, [day]: { ...schedule[day], end: e.target.value } })}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #262626", background: "#161616", color: "#f0ede8", fontSize: 13, outline: "none" }} />
                      </div>
                    </div>

                    {/* Sloturi vizuale */}
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 11, color: "#777", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Sloturi disponibile ({getSlots(schedule[day].start, schedule[day].end).length})
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {getSlots(schedule[day].start, schedule[day].end).map(slot => (
                          <div key={slot} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", fontSize: 11, color: "#c9a96e", fontWeight: 600 }}>
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={saveSchedule} style={{ marginTop: 20, padding: "11px 28px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
            Salvează programul
          </button>
        </div>
      )}

      {/* TAB: SERVICII */}
      {activeTab === "servicii" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <button onClick={() => setShowServiceModal(true)} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              ＋ Adaugă serviciu
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {services.map((s: any, i) => (
              <div key={i} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 20, transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#262626"}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon || "✂️"}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  <div style={{ background: "#1e1e1e", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e8c987" }}>{s.price} lei</div>
                    <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>Tarif</div>
                  </div>
                  <div style={{ background: "#1e1e1e", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e8c987" }}>{s.duration * 30} min</div>
                    <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>{s.duration} slot{s.duration > 1 ? "uri" : ""}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <button style={{ flex: 1, padding: 8, borderRadius: 8, background: "#1e1e1e", color: "#f0ede8", border: "1px solid #262626", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✏️ Editează</button>
                  <button style={{ padding: "8px 10px", borderRadius: 8, background: "transparent", color: "#777", border: "1px solid #262626", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>🗑</button>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div style={{ color: "#777", fontSize: 13, gridColumn: "1/-1", textAlign: "center", padding: "40px 0" }}>
                Niciun serviciu adăugat încă.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: CALENDAR */}
      {activeTab === "calendar" && (
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 24, textAlign: "center", color: "#777" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗓</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Calendar în construcție</div>
          <div style={{ fontSize: 13 }}>Sloturi de 30 min per zi — în curând!</div>
        </div>
      )}

      {/* TAB: REZERVARI */}
      {activeTab === "rezervari" && (
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 24, textAlign: "center", color: "#777" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Nicio rezervare încă</div>
        </div>
      )}

      {/* TAB: STATISTICI */}
      {activeTab === "statistici" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[["0", "Rezervări totale", "#c9a96e"], ["0 lei", "Încasări totale", "#4caf82"], ["—", "Rating mediu", "#e8b84b"]].map(([val, label, color]) => (
            <div key={label} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 13, color: "#777", marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal serviciu nou */}
      {showServiceModal && (
        <div onClick={() => setShowServiceModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 18, padding: 30, width: 440, maxWidth: "95vw" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Serviciu nou</div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Nume serviciu</label>
              <input value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} placeholder="ex: Tuns + Styling" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Tarif (lei)</label>
                <input type="number" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} placeholder="45" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
              </div>
              <div>
                <label style={labelStyle}>Icon</label>
                <input value={newService.icon} onChange={e => setNewService({ ...newService, icon: e.target.value })} placeholder="✂️" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Durată</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[1,2,3,4,6,8].map(d => (
                  <button key={d} onClick={() => setNewService({ ...newService, duration: d })}
                    style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${newService.duration === d ? "#c9a96e" : "#262626"}`, background: newService.duration === d ? "rgba(201,169,110,0.12)" : "#1e1e1e", color: newService.duration === d ? "#e8c987" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    {d * 30} min
                  </button>
                ))}
                <button onClick={() => setNewService({ ...newService, duration: 999 })}
                  style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${newService.duration === 999 ? "rgba(90,141,224,0.5)" : "#262626"}`, background: newService.duration === 999 ? "rgba(90,141,224,0.1)" : "#1e1e1e", color: newService.duration === 999 ? "#5a8de0" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  🌙 Toată ziua
                </button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowServiceModal(false)} style={{ flex: 1, padding: 11, borderRadius: 10, background: "#1e1e1e", color: "#777", border: "1px solid #262626", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Anulează</button>
              <button onClick={addService} disabled={loading} style={{ flex: 2, padding: 11, borderRadius: 10, background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                {loading ? "Se salvează..." : "Salvează"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}