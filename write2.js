const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/user/page.tsx', 'utf8');

// 1. Adauga constante dupa import FinancialDashboard
code = code.replace(
  `import FinancialDashboard from "@/components/dashboard/FinancialDashboard";`,
  `import FinancialDashboard from "@/components/dashboard/FinancialDashboard";

const JUDETE = ["Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brăila","Brașov","București","Buzău","Călărași","Caraș-Severin","Cluj","Constanța","Covasna","Dâmbovița","Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov","Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Sălaj","Satu Mare","Sibiu","Suceava","Teleorman","Timiș","Tulcea","Vâlcea","Vaslui","Vrancea"];
const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { key: "website", label: "Website", placeholder: "https://website.ro" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
];`
);

// 2. Adauga state pentru profil
code = code.replace(
  `  const [loading, setLoading] = useState(false);`,
  `  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", bio: "", judet: "", oras: "", address: "", facebook: "", instagram: "", tiktok: "", linkedin: "", website: "", youtube: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);`
);

// 3. Adauga setProfileForm in useEffect
code = code.replace(
  `      setUser(d.user);
      if (d.user?.role === "employee") { router.push("/dashboard/employee"); return; }`,
  `      setUser(d.user);
      if (d.user?.role === "employee") { router.push("/dashboard/employee"); return; }
      const u = d.user;
      setProfileForm({ name: u.name || "", phone: u.phone || "", bio: u.bio || "", judet: u.judet || "", oras: u.oras || "", address: u.address || "", facebook: u.socialLinks?.facebook || "", instagram: u.socialLinks?.instagram || "", tiktok: u.socialLinks?.tiktok || "", linkedin: u.socialLinks?.linkedin || "", website: u.socialLinks?.website || "", youtube: u.socialLinks?.youtube || "" });`
);

// 4. Adauga in sidebarSections
code = code.replace(
  `    { id: "profil", icon: "🏠", label: "Profilul meu" },`,
  `    { id: "profil", icon: "🏠", label: "Profilul meu" },
    { id: "editare-profil", icon: "✏️", label: "Editează profilul" },`
);

// 5. Adauga in getSectionTitle
code = code.replace(
  `      financiar: "Situație financiară",`,
  `      financiar: "Situație financiară",
      "editare-profil": "Editează profilul",`
);

// 6. Adauga sectiunea inainte de REZERVARI
code = code.replace(
  `          {/* ===== REZERVARI ===== */}`,
  `          {/* ===== EDITARE PROFIL ===== */}
          {activeSection === "editare-profil" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
              {profileMsg && <div style={{ background: "rgba(76,175,130,0.1)", border: "1px solid rgba(76,175,130,0.3)", borderRadius: 10, padding: "12px 16px", color: s.green, fontSize: 13 }}>{profileMsg}</div>}
              <div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 60, background: "linear-gradient(135deg,#1a1408,#2a2010)" }} />
                <div style={{ padding: "0 20px 16px", marginTop: -24, display: "flex", alignItems: "flex-end", gap: 14 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#fff", border: \`3px solid \${s.surface}\`, overflow: "hidden" }}>
                      {user.avatar ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (profileForm.name || user.name)?.charAt(0)}
                    </div>
                    <label style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: \`2px solid \${s.surface}\`, fontSize: 9 }}>
                      ✏️<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const fd = new FormData(); fd.append("file", file); fetch("/api/profile/avatar", { method: "POST", body: fd }).then(r => r.json()).then(d => { if (d.url) setUser({ ...user, avatar: d.url }); }); }} />
                    </label>
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>{profileForm.name || user.name}</div>
                    <div style={{ fontSize: 12, color: s.muted, marginTop: 2 }}>{profileForm.oras && profileForm.judet ? \`📍 \${profileForm.oras}, \${profileForm.judet}\` : "📍 Locație necompletată"}</div>
                  </div>
                </div>
                {profileForm.bio && <div style={{ padding: "0 20px 16px", fontSize: 13, color: s.muted, lineHeight: 1.6 }}>{profileForm.bio}</div>}
              </div>
              <div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Date personale</div>
                {([["name","Nume complet","Numele tău complet"],["phone","Telefon","07xx xxx xxx"]] as [string,string,string][]).map(([k,l,p]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{l}</div>
                    <input value={(profileForm as any)[k]} onChange={e => setProfileForm({ ...profileForm, [k]: e.target.value })} placeholder={p}
                      style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Descriere / Bio</div>
                  <textarea value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Descrie-te pe scurt..." rows={3}
                    style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const, resize: "vertical" as const }}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{profileForm.bio.length}/500</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Județ</div>
                    <select value={profileForm.judet} onChange={e => setProfileForm({ ...profileForm, judet: e.target.value })}
                      style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const, cursor: "pointer" }}>
                      <option value="">Selectează județul</option>
                      {JUDETE.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>Oraș</div>
                    <input value={profileForm.oras} onChange={e => setProfileForm({ ...profileForm, oras: e.target.value })} placeholder="ex: Oradea"
                      style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                </div>
              </div>
              <div style={{ background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, padding: isMobile ? 16 : 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600 }}>Rețele sociale</div>
                {SOCIAL_PLATFORMS.map(p => (
                  <div key={p.key}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{p.label}</div>
                    <input value={(profileForm as any)[p.key]} onChange={e => setProfileForm({ ...profileForm, [p.key]: e.target.value })} placeholder={p.placeholder}
                      style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }}
                      onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  </div>
                ))}
              </div>
              <button onClick={async () => {
                setProfileLoading(true);
                const res = await fetch("/api/profile/update", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone, bio: profileForm.bio, judet: profileForm.judet, oras: profileForm.oras, address: profileForm.address, socialLinks: { facebook: profileForm.facebook, instagram: profileForm.instagram, tiktok: profileForm.tiktok, linkedin: profileForm.linkedin, website: profileForm.website, youtube: profileForm.youtube } }) });
                if (res.ok) { setProfileMsg("Profil actualizat cu succes!"); setTimeout(() => setProfileMsg(""), 3000); }
                setProfileLoading(false);
              }} disabled={profileLoading} style={{ padding: "13px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)", opacity: profileLoading ? 0.7 : 1 }}>
                {profileLoading ? "Se salvează..." : "Salvează profilul"}
              </button>
            </div>
          )}

          {/* ===== REZERVARI ===== */}`
);

fs.writeFileSync('./src/app/dashboard/user/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/user/page.tsx').size);