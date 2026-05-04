"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const durataOptions = [
  { label: "30 min", slots: 1 },
  { label: "60 min", slots: 2 },
  { label: "90 min", slots: 3 },
  { label: "120 min", slots: 4 },
  { label: "180 min", slots: 6 },
  { label: "240 min", slots: 8 },
];

export default function ServicesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editService, setEditService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", duration: 1, icon: "✂️", description: "" });
  const [editForm, setEditForm] = useState({ name: "", price: "", duration: 1, icon: "✂️", description: "" });

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(async (d) => {
      const me = d.user;
      if (me?.accountType === "company") {
        setIsAdmin(true);
        const empRes = await fetch("/api/employees");
        const empData = await empRes.json();
        const emps = empData.employees || [];
        setEmployees(emps);
        if (emps.length > 0) setSelectedEmp(emps[0]);
      } else {
        setIsAdmin(false);
        setEmployees([me]);
        setSelectedEmp(me);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedEmp?.id) {
      fetch(`/api/employees/${selectedEmp.id}`).then(r => r.json()).then(d => setServices(d.services || []));
    }
  }, [selectedEmp]);

  const addService = async () => {
    setLoading(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, employeeId: selectedEmp?.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setServices([...services, data.service]);
      setMsg("Serviciu adaugat!");
      setForm({ name: "", price: "", duration: 1, icon: "✂️", description: "" });
      setTimeout(() => { setMsg(""); setShowModal(false); }, 1500);
    }
    setLoading(false);
  };

  const saveEdit = async () => {
    if (!editService) return;
    setLoading(true);
    const res = await fetch(`/api/services/${editService.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (res.ok) {
      setServices(services.map((s: any) => s.id === editService.id ? { ...s, ...editForm } : s));
      setMsg("Serviciu actualizat!");
      setShowEditModal(false);
      setEditService(null);
      setTimeout(() => setMsg(""), 2000);
    }
    setLoading(false);
  };

  const openEdit = (s: any) => {
    setEditService(s);
    setEditForm({ name: s.name, price: s.price, duration: s.duration, icon: s.icon || "✂️", description: s.description || "" });
    setShowEditModal(true);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Esti sigur ca vrei sa stergi acest serviciu?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setServices(services.filter((s: any) => s.id !== id));
      setMsg("Serviciu sters!");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const btnPrimary = { padding: "10px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", display: "flex", alignItems: "center", gap: 6 } as const;

  const inputStyle = { width: "100%", padding: "11px 14px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const };

  return (
    <DashboardLayout title="Servicii" actions={
      <button style={btnPrimary} onClick={() => setShowModal(true)}>+ Serviciu nou</button>
    }>

      {msg && <div style={{ background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, padding: "10px 16px", color: "#4caf82", fontSize: 13 }}>{msg}</div>}

      {isAdmin && employees.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {employees.map(emp => (
            <div key={emp.id} onClick={() => setSelectedEmp(emp)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
              background: selectedEmp?.id === emp.id ? "rgba(201,169,110,0.06)" : "#161616",
              border: `2px solid ${selectedEmp?.id === emp.id ? "#c9a96e" : "#262626"}`,
              borderRadius: 14, cursor: "pointer", transition: "all 0.2s", maxWidth: 260,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "var(--font-playfair)" }}>
                {emp.name?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0ede8" }}>{emp.name}</div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{services.length} servicii</div>
              </div>
              {selectedEmp?.id === emp.id && <div style={{ color: "#c9a96e", fontSize: 16 }}>✓</div>}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {services.map((s: any) => (
          <div key={s.id} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#262626"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>
            <div style={{ height: 110, background: "linear-gradient(135deg,#1a1408,#2a2010)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
              {s.icon || "✂️"}
              <div style={{ position: "absolute", top: 8, left: 8, fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: "rgba(76,175,130,0.85)", color: "#fff" }}>● Activ</div>
              <div style={{ position: "absolute", top: 8, right: 8, fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(0,0,0,0.6)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}>0 foto</div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(201,169,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{s.icon || "✂️"}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#777", marginTop: 1 }}>{selectedEmp?.name}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                <div style={{ background: "#1e1e1e", borderRadius: 8, padding: "9px 11px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e8c987" }}>{s.price} lei</div>
                  <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>Tarif</div>
                </div>
                <div style={{ background: "#1e1e1e", borderRadius: 8, padding: "9px 11px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e8c987" }}>{s.duration * 30} min</div>
                  <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>Durata</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <button onClick={() => openEdit(s)} style={{ flex: 1, padding: 8, borderRadius: 8, background: "#1e1e1e", color: "#f0ede8", border: "1px solid #262626", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>✏️ Editează</button>
                <button onClick={() => deleteService(s.id)} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(224,90,90,0.1)", color: "#e05a5a", border: "1px solid rgba(224,90,90,0.2)", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>🗑</button>
              </div>
            </div>
          </div>
        ))}

        <div onClick={() => setShowModal(true)} style={{ background: "#161616", border: "1px dashed #262626", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, minHeight: 280, cursor: "pointer", opacity: 0.5, transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.85"; (e.currentTarget as HTMLDivElement).style.borderColor = "#c9a96e"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.5"; (e.currentTarget as HTMLDivElement).style.borderColor = "#262626"; }}>
          <div style={{ fontSize: 32 }}>+</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#777" }}>Adaugă serviciu nou</div>
        </div>
      </div>

      {/* MODAL ADAUGA */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 18, padding: 30, width: 480, maxWidth: "95vw" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Serviciu nou</div>
            <div style={{ fontSize: 13, color: "#777", marginBottom: 24 }}>Pentru {selectedEmp?.name}</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Nume serviciu</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ex: Tuns + Styling" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Tarif (lei)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="ex: 45" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Icon emoji</label>
                <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="ex: ✂️" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Durată</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {durataOptions.map(d => (
                  <button key={d.slots} onClick={() => setForm({ ...form, duration: d.slots })}
                    style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${form.duration === d.slots ? "#c9a96e" : "#262626"}`, background: form.duration === d.slots ? "rgba(201,169,110,0.12)" : "#1e1e1e", color: form.duration === d.slots ? "#e8c987" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    {d.label}
                  </button>
                ))}
                <button onClick={() => setForm({ ...form, duration: 999 })}
                  style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${form.duration === 999 ? "rgba(90,141,224,0.5)" : "#262626"}`, background: form.duration === 999 ? "rgba(90,141,224,0.1)" : "#1e1e1e", color: form.duration === 999 ? "#5a8de0" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Toata ziua
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Descriere</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descrie pe scurt serviciul..." rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, borderRadius: 10, background: "#1e1e1e", color: "#777", border: "1px solid #262626", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Anulează</button>
              <button onClick={addService} disabled={loading} style={{ flex: 2, padding: 11, borderRadius: 10, background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "var(--font-outfit)" }}>
                {loading ? "Se salvează..." : "Salvează serviciul"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITARE */}
      {showEditModal && editService && (
        <div onClick={() => setShowEditModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 18, padding: 30, width: 480, maxWidth: "95vw" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Editează serviciu</div>
            <div style={{ fontSize: 13, color: "#777", marginBottom: 24 }}>Modifică detaliile serviciului</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Nume serviciu</label>
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Tarif (lei)</label>
                <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Icon emoji</label>
                <input value={editForm.icon} onChange={e => setEditForm({ ...editForm, icon: e.target.value })} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Durată</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {durataOptions.map(d => (
                  <button key={d.slots} onClick={() => setEditForm({ ...editForm, duration: d.slots })}
                    style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${editForm.duration === d.slots ? "#c9a96e" : "#262626"}`, background: editForm.duration === d.slots ? "rgba(201,169,110,0.12)" : "#1e1e1e", color: editForm.duration === d.slots ? "#e8c987" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                    {d.label}
                  </button>
                ))}
                <button onClick={() => setEditForm({ ...editForm, duration: 999 })}
                  style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${editForm.duration === 999 ? "rgba(90,141,224,0.5)" : "#262626"}`, background: editForm.duration === 999 ? "rgba(90,141,224,0.1)" : "#1e1e1e", color: editForm.duration === 999 ? "#5a8de0" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Toata ziua
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 7 }}>Descriere</label>
              <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: 11, borderRadius: 10, background: "#1e1e1e", color: "#777", border: "1px solid #262626", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Anulează</button>
              <button onClick={saveEdit} disabled={loading} style={{ flex: 2, padding: 11, borderRadius: 10, background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "var(--font-outfit)" }}>
                {loading ? "Se salvează..." : "Salvează modificările"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}