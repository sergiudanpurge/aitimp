"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/employees").then(r => r.json()).then(d => setEmployees(d.employees || []));
  }, []);

  const inviteEmployee = async () => {
    setLoading(true); setMsg(""); setError("");
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`Invitație trimisă către ${form.email}!`);
      setEmployees([...employees, { name: form.name, email: form.email, emailVerified: false }]);
      setForm({ name: "", email: "" });
      setTimeout(() => { setMsg(""); setShowModal(false); }, 2000);
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  const btnPrimary = { padding: "10px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", display: "flex", alignItems: "center", gap: 6 } as const;

  return (
    <DashboardLayout title="Angajați" actions={
      <button style={btnPrimary} onClick={() => setShowModal(true)}>＋ Invită angajat</button>
    }>
      {/* Cards angajati */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {employees.map((emp: any, i) => (
          <div key={i} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden", transition: "all 0.2s", cursor: "pointer" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,169,110,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#262626"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>
            {/* Banner */}
            <div style={{ height: 70, background: "linear-gradient(135deg,#1a1408,#2a2010)", position: "relative" }}>
              <div style={{ position: "absolute", bottom: -24, left: 20, width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", border: "3px solid #161616", fontFamily: "var(--font-playfair)" }}>
                {emp.name?.charAt(0)}
              </div>
              <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 700, background: emp.emailVerified ? "rgba(76,175,130,0.2)" : "rgba(232,184,75,0.2)", color: emp.emailVerified ? "#4caf82" : "#e8b84b" }}>
                {emp.emailVerified ? "● Activ" : "● Invitat"}
              </div>
            </div>

            <div style={{ padding: "32px 20px 20px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{emp.name}</div>
              <div style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>{emp.email}</div>

              {/* Mini stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[["0", "Rezervări"], ["0 lei", "Încasări"], ["—", "Rating"]].map(([val, label]) => (
                  <div key={label} style={{ background: "#1e1e1e", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#c9a96e" }}>{val}</div>
                    <div style={{ fontSize: 10, color: "#777", marginTop: 1 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => emp.id && router.push(`/dashboard/employees/${emp.id}`)}
                  style={{ flex: 1, padding: "8px", borderRadius: 8, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", color: "#c9a96e", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                  Profil →
                </button>
                <button onClick={async (e) => {
  e.stopPropagation();
  const res = await fetch(`/api/employees/${emp.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive: emp.isActive === false ? true : false }),
  });
  if (res.ok) {
    setEmployees(employees.map((e: any) => e.id === emp.id ? { ...e, isActive: emp.isActive === false ? true : false } : e));
  }
}} style={{ padding: "8px 12px", borderRadius: 8, background: emp.isActive === false ? "rgba(76,175,130,0.1)" : "#1e1e1e", border: `1px solid ${emp.isActive === false ? "rgba(76,175,130,0.2)" : "#262626"}`, color: emp.isActive === false ? "#4caf82" : "#777", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
  {emp.isActive === false ? "▶ Activează" : "⏸"}
</button>
              </div>
            </div>
          </div>
        ))}

        {/* Add card */}
        <div onClick={() => setShowModal(true)} style={{ background: "#161616", border: "1px dashed #262626", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, minHeight: 200, cursor: "pointer", opacity: 0.5, transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.85"; (e.currentTarget as HTMLDivElement).style.borderColor = "#c9a96e"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0.5"; (e.currentTarget as HTMLDivElement).style.borderColor = "#262626"; }}>
          <div style={{ fontSize: 32 }}>＋</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#777" }}>Invită angajat nou</div>
        </div>
      </div>

      {/* Modal invita */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 18, padding: 30, width: 440, maxWidth: "95vw" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Invită angajat</div>
            <div style={{ fontSize: 13, color: "#777", marginBottom: 24 }}>Angajatul primește email cu link de activare</div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 7 }}>Nume angajat</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ex: Marcel Ionescu"
                style={{ width: "100%", padding: "11px 14px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 7 }}>Email angajat</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ex: marcel@email.com"
                style={{ width: "100%", padding: "11px 14px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
                onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            </div>

            {msg && <div style={{ background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#4caf82", fontSize: 13 }}>{msg}</div>}
            {error && <div style={{ background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#e05a5a", fontSize: 13 }}>{error}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, borderRadius: 10, background: "#1e1e1e", color: "#777", border: "1px solid #262626", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Anulează</button>
              <button onClick={inviteEmployee} disabled={loading} style={{ flex: 2, padding: 11, borderRadius: 10, background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "var(--font-outfit)" }}>
                {loading ? "Se trimite..." : "📧 Trimite invitație"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}