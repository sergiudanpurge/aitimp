"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "", cui: "", adresa: "", iban: "",
    telefon: "", email: "", website: "",
    facebook: "", instagram: "", tiktok: "",
    descriere: "", oras: "", judet: "",
  });
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user) {
        setForm(prev => ({
          ...prev,
          name: d.user.name || "",
          cui: d.user.cui || "",
          adresa: d.user.adresa || "",
          telefon: d.user.phone || "",
          email: d.user.email || "",
          oras: d.user.oras || "",
          judet: d.user.judet || "",
        }));
        setAvatar(d.user.avatar || "");
      }
    });
  }, []);

  const uploadAvatar = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "aitimp_avatars");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
    const data = await res.json();
    if (data.secure_url) {
      setAvatar(data.secure_url);
      await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, avatar: data.secure_url }) });
      setMsg("Avatar actualizat!");
      setTimeout(() => setMsg(""), 2000);
    }
    setUploading(false);
  };

  const save = async () => {
    const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, avatar }) });
    if (res.ok) { setMsg("Profil salvat!"); setTimeout(() => setMsg(""), 2000); }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 7 };
  const tabs = ["general", "contact", "social", "galerie"];

  return (
    <DashboardLayout title="Profil Companie" actions={
      <button onClick={save} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
        Salvează
      </button>
    }>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "start" }}>

        {/* Card preview */}
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden", position: "sticky", top: 80 }}>
          <div style={{ height: 80, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
          <div style={{ padding: "0 20px 20px", marginTop: -28 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid #161616", overflow: "hidden", background: "#262626", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              {avatar ? <img src={avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 22, fontWeight: 700, color: "#c9a96e", fontFamily: "var(--font-playfair)" }}>{form.name?.charAt(0) || "C"}</span>}
            </div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{form.name || "Numele companiei"}</div>
            {form.cui && <div style={{ fontSize: 11, color: "#777", marginBottom: 4 }}>CUI: {form.cui}</div>}
            {form.oras && <div style={{ fontSize: 12, color: "#777", marginBottom: 12 }}>📍 {form.oras}{form.judet ? `, ${form.judet}` : ""}</div>}
            {form.descriere && <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5, marginBottom: 16 }}>{form.descriere}</div>}

            <label style={{ display: "inline-block", padding: "8px 16px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#c9a96e" }}>
              {uploading ? "Se încarcă..." : "📷 Schimbă logo"}
              <input type="file" accept="image/*" onChange={uploadAvatar} style={{ display: "none" }} />
            </label>
          </div>

          {/* Completitudine */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid #262626" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#777" }}>Completitudine profil</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c9a96e" }}>
                {Math.round([form.name, form.cui, form.adresa, form.telefon, form.email, form.website, form.descriere, avatar].filter(Boolean).length / 8 * 100)}%
              </span>
            </div>
            <div style={{ height: 4, background: "#262626", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg,#c9a96e,#e8c987)", borderRadius: 2, width: `${Math.round([form.name, form.cui, form.adresa, form.telefon, form.email, form.website, form.descriere, avatar].filter(Boolean).length / 8 * 100)}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #262626" }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "14px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t ? "#c9a96e" : "transparent"}`, color: activeTab === t ? "#c9a96e" : "#777", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)", textTransform: "capitalize", transition: "all 0.15s" }}>
                {t === "general" ? "General" : t === "contact" ? "Contact" : t === "social" ? "Social Media" : "Galerie"}
              </button>
            ))}
          </div>

          <div style={{ padding: 24 }}>
            {activeTab === "general" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Denumire companie</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="SC Exemplu SRL" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>CUI</label>
                    <input value={form.cui} onChange={e => setForm({ ...form, cui: e.target.value })} placeholder="RO12345678" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                  </div>
                  <div>
                    <label style={labelStyle}>IBAN</label>
                    <input value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} placeholder="RO49AAAA1B31007593840000" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Adresă sediu</label>
                  <input value={form.adresa} onChange={e => setForm({ ...form, adresa: e.target.value })} placeholder="Str. Exemplu nr. 1" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Județ</label>
                    <input value={form.judet} onChange={e => setForm({ ...form, judet: e.target.value })} placeholder="Bihor" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                  </div>
                  <div>
                    <label style={labelStyle}>Oraș</label>
                    <input value={form.oras} onChange={e => setForm({ ...form, oras: e.target.value })} placeholder="Oradea" style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Descriere</label>
                  <textarea value={form.descriere} onChange={e => setForm({ ...form, descriere: e.target.value })} placeholder="Descrie pe scurt compania ta..." rows={4} style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Telefon</label>
                  <input value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="+40721000000" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                </div>
                <div>
                  <label style={labelStyle}>Email contact</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contact@companie.ro" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                </div>
                <div>
                  <label style={labelStyle}>Website</label>
                  <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://companie.ro" style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[["facebook", "Facebook", "https://facebook.com/companie"], ["instagram", "Instagram", "https://instagram.com/companie"], ["tiktok", "TikTok", "https://tiktok.com/@companie"]].map(([key, label, ph]) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")} onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "galerie" && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#777" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Galerie companie</div>
                <div style={{ fontSize: 13, marginBottom: 20 }}>Adaugă poze cu spațiul tău de lucru</div>
                <label style={{ display: "inline-block", padding: "10px 20px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#c9a96e" }}>
                  + Adaugă fotografii
                  <input type="file" accept="image/*" multiple style={{ display: "none" }} />
                </label>
              </div>
            )}

            {msg && <div style={{ marginTop: 16, background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 8, padding: "10px 14px", color: "#4caf82", fontSize: 13 }}>{msg}</div>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}