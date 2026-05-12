"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import Link from "next/link";

const JUDETE = ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","București","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea"];

const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { key: "website", label: "Website", placeholder: "https://website.ro" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#777", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 7, fontWeight: 600 }}>{label}</div>
      {children}
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [form, setForm] = useState({
    name: "", phone: "", bio: "", judet: "", oras: "", address: "",
    facebook: "", instagram: "", tiktok: "", linkedin: "", website: "", youtube: "",
  });

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
    green: "#4caf82", red: "#e05a5a",
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px", background: s.surface2,
    border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8",
    fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)",
    boxSizing: "border-box" as const,
  };

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      const u = d.user;
      setUser(u);
      setForm({
        name: u.name || "", phone: u.phone || "", bio: u.bio || "",
        judet: u.judet || "", oras: u.oras || "", address: u.address || "",
        facebook: u.socialLinks?.facebook || "", instagram: u.socialLinks?.instagram || "",
        tiktok: u.socialLinks?.tiktok || "", linkedin: u.socialLinks?.linkedin || "",
        website: u.socialLinks?.website || "", youtube: u.socialLinks?.youtube || "",
      });
    });
  }, []);

  const save = async () => {
    setLoading(true); setMsg(""); setError("");
    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, phone: form.phone, bio: form.bio,
        judet: form.judet, oras: form.oras, address: form.address,
        socialLinks: {
          facebook: form.facebook, instagram: form.instagram, tiktok: form.tiktok,
          linkedin: form.linkedin, website: form.website, youtube: form.youtube,
        },
      }),
    });
    const data = await res.json();
    if (res.ok) setMsg("Profil actualizat cu succes!");
    else setError(data.error || "Eroare la salvare");
    setLoading(false);
    setTimeout(() => { setMsg(""); setError(""); }, 3000);
  };

  const tabs = [
    { id: "personal", label: "Date personale" },
    { id: "social", label: "Rețele sociale" },
    { id: "avatar", label: "Foto profil" },
  ];

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", paddingBottom: isMobile ? 30 : 60 }}>

      <div style={{ height: 58, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard/user" style={{ fontSize: 20, textDecoration: "none", color: s.muted }}>←</Link>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>Editează profilul</div>
        </div>
        <button onClick={save} disabled={loading} style={{ padding: "8px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Se salvează..." : "Salvează"}
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? 16 : 28 }}>

        {msg && <div style={{ background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 10, padding: "12px 16px", color: s.green, fontSize: 13, marginBottom: 16 }}>{msg}</div>}
        {error && <div style={{ background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 10, padding: "12px 16px", color: s.red, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ height: 60, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
          <div style={{ padding: "0 20px 16px", marginTop: -24, display: "flex", alignItems: "flex-end", gap: 14 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#fff", border: `3px solid ${s.surface}`, overflow: "hidden" }}>
                {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (form.name || user.name)?.charAt(0)}
              </div>
              <label style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${s.surface}`, fontSize: 9 }}>
                ✏️
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  fetch("/api/profile/avatar", { method: "POST", body: formData })
                    .then(r => r.json()).then(d => { if (d.url) setUser({ ...user, avatar: d.url }); });
                }} />
              </label>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>{form.name || user.name}</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>
                {form.oras && form.judet ? `📍 ${form.oras}, ${form.judet}` : "📍 Locație necompletată"}
              </div>
            </div>
          </div>
          {form.bio && <div style={{ padding: "0 20px 16px", fontSize: 13, color: s.muted, lineHeight: 1.6 }}>{form.bio}</div>}
          <div style={{ padding: "10px 20px", borderTop: `1px solid ${s.border}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {SOCIAL_PLATFORMS.filter(p => (form as any)[p.key]).map(p => (
              <div key={p.key} style={{ fontSize: 11, color: s.accent, padding: "3px 10px", borderRadius: 5, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)" }}>{p.label}</div>
            ))}
            {!SOCIAL_PLATFORMS.some(p => (form as any)[p.key]) && <div style={{ fontSize: 12, color: "#444" }}>Nicio rețea socială adăugată</div>}
          </div>
        </div>

        <div style={{ display: "flex", background: s.surface, border: `1px solid ${s.border}`, borderRadius: 10, padding: 4, gap: 4, marginBottom: 20 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "none", background: activeTab === t.id ? "rgba(201,169,110,0.12)" : "transparent", color: activeTab === t.id ? s.accent : s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "personal" && (
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Nume complet">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Numele tău complet" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
            </Field>
            <Field label="Telefon">
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="07xx xxx xxx" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
            </Field>
            <Field label="Descriere / Bio">
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Descrie-te pe scurt — apare pe profilul tău public..." rows={4}
                style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
                onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
              <div style={{ fontSize: 11, color: "#444", marginTop: 5 }}>{form.bio.length}/500 caractere</div>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              <Field label="Județ">
                <select value={form.judet} onChange={e => setForm({ ...form, judet: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Selectează județul</option>
                  {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </Field>
              <Field label="Oraș / Localitate">
                <input value={form.oras} onChange={e => setForm({ ...form, oras: e.target.value })} placeholder="ex: Oradea" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
              </Field>
            </div>
            <Field label="Adresă (opțional)">
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Str. Exemplu, nr. 1" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
            </Field>
            <button onClick={save} disabled={loading} style={{ padding: "12px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Se salvează..." : "Salvează datele personale"}
            </button>
          </div>
        )}

        {activeTab === "social" && (
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: s.muted, marginBottom: 4 }}>Adaugă link-urile tale — apar pe profilul public și ajută clienții să te găsească.</div>
            {SOCIAL_PLATFORMS.map(p => (
              <Field key={p.key} label={p.label}>
                <input value={(form as any)[p.key]} onChange={e => setForm({ ...form, [p.key]: e.target.value })} placeholder={p.placeholder} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
              </Field>
            ))}
            <button onClick={save} disabled={loading} style={{ padding: "12px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Se salvează..." : "Salvează rețelele sociale"}
            </button>
          </div>
        )}

        {activeTab === "avatar" && (
          <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: isMobile ? 16 : 24 }}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 700, color: "#fff", margin: "0 auto 20px", border: `3px solid ${s.border}`, overflow: "hidden" }}>
                {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : user.name?.charAt(0)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Fotografia de profil</div>
              <div style={{ fontSize: 13, color: s.muted, marginBottom: 20 }}>JPG, PNG sau WebP · Max 5MB</div>
              <label style={{ display: "inline-block", padding: "10px 24px", background: "rgba(201,169,110,0.1)", border: `1px solid rgba(201,169,110,0.3)`, borderRadius: 9, fontSize: 13, color: s.accent, cursor: "pointer", fontWeight: 600 }}>
                Încarcă fotografie
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  fetch("/api/profile/avatar", { method: "POST", body: formData })
                    .then(r => r.json()).then(d => { if (d.url) setUser({ ...user, avatar: d.url }); });
                }} />
              </label>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}