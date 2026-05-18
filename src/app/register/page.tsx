"use client";
import Navbar from "@/components/Navbar";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Country, State, City } from "country-state-city";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<"personal" | "company">("personal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nume: "", prenume: "", email: "", password: "", confirmPassword: "",
    telefon: "", prefix: "+40", tara: "RO", judet: "", oras: "",
    acceptTermeni: false,
  });

  const [companyForm, setCompanyForm] = useState({
    denumire: "", email: "", password: "", confirmPassword: "",
    telefon: "", prefix: "+40", tara: "RO", judet: "", oras: "",
    cui: "", adresa: "", acceptTermeni: false,
  });

  const countries = Country.getAllCountries().filter(c =>
    ["RO","DE","FR","IT","ES","GB","AT","BE","BG","HR","CY","CZ","DK","EE","FI","GR","HU","IE","LV","LT","LU","MT","NL","PL","PT","SK","SI","SE"].includes(c.isoCode)
  );

  const getStates = (countryCode: string) => State.getStatesOfCountry(countryCode);
  const getCities = (countryCode: string, stateCode: string) => City.getCitiesOfState(countryCode, stateCode);

  const prefixes = [
    { code: "RO", prefix: "+40" }, { code: "DE", prefix: "+49" },
    { code: "FR", prefix: "+33" }, { code: "IT", prefix: "+39" },
    { code: "ES", prefix: "+34" }, { code: "GB", prefix: "+44" },
    { code: "AT", prefix: "+43" }, { code: "BE", prefix: "+32" },
    { code: "NL", prefix: "+31" }, { code: "PL", prefix: "+48" },
  ];

  const inputStyle = {
    width: "100%", background: "#181510",
    border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10,
    padding: "13px 16px", color: "#F2ECD8", fontSize: "0.9rem",
    outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" as const,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = {
    display: "block", fontSize: "0.72rem", letterSpacing: "0.1em",
    textTransform: "uppercase" as const, color: "#7A7060", marginBottom: 7,
  };
  const handlePersonalSubmit = async () => {
    if (form.password !== form.confirmPassword) { setError("Parolele nu coincid!"); return; }
    if (!form.acceptTermeni) { setError("Trebuie să accepți termenii și condițiile!"); return; }
    if (form.password.length < 8) { setError("Parola trebuie să aibă minim 8 caractere!"); return; }

    setLoading(true); setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nume + " " + form.prenume,
          email: form.email,
          password: form.password,
          accountType: "private",
          telefon: form.prefix + form.telefon,
          tara: form.tara,
          judet: form.judet,
          oras: form.oras,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async () => {
    if (companyForm.password !== companyForm.confirmPassword) { setError("Parolele nu coincid!"); return; }
    if (!companyForm.acceptTermeni) { setError("Trebuie să accepți termenii și condițiile!"); return; }
    if (companyForm.password.length < 8) { setError("Parola trebuie să aibă minim 8 caractere!"); return; }

    setLoading(true); setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyForm.denumire,
          email: companyForm.email,
          password: companyForm.password,
          accountType: "company",
          telefon: companyForm.prefix + companyForm.telefon,
          tara: companyForm.tara,
          judet: companyForm.judet,
          oras: companyForm.oras,
          cui: companyForm.cui,
          adresa: companyForm.adresa,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#090806", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(201,168,76,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.035) 1px,transparent 1px)", backgroundSize: "60px 60px", WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%,black 30%,transparent 100%)" }} />

      <div style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 2 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", fontWeight: 700, color: "#C9A84C", textDecoration: "none" }}>
            Aitimp<sup style={{ fontSize: "0.5rem", color: "#7A7060", verticalAlign: "super" }}>.ro</sup>
          </Link>
        </div>

        {/* Step 3 - Success */}
        {step === 3 && (
          <div style={{ background: "#0f0e0b", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "48px 44px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 20 }}>📬</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", fontWeight: 700, marginBottom: 12, color: "#F2ECD8" }}>Cont creat!</h2>
            <p style={{ color: "#7A7060", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 32 }}>
              Ți-am trimis un email de confirmare. Verifică inbox-ul și apasă linkul pentru a activa contul.
            </p>
            <Link href="/" style={{ display: "inline-block", background: "#C9A84C", color: "#090806", padding: "14px 32px", borderRadius: 10, fontSize: "0.88rem", fontWeight: 700, textDecoration: "none" }}>
              Înapoi acasă
            </Link>
          </div>
        )}
        {/* Step 1 - Alege tip cont */}
        {step === 1 && (
          <div style={{ background: "#0f0e0b", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "48px 44px" }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", fontWeight: 700, marginBottom: 8, color: "#F2ECD8", textAlign: "center" }}>
              Creează un cont
            </h2>
            <p style={{ color: "#7A7060", textAlign: "center", marginBottom: 36, fontSize: "0.9rem" }}>Alege tipul de cont potrivit pentru tine</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              <div onClick={() => setAccountType("personal")} style={{ background: accountType === "personal" ? "rgba(201,168,76,0.1)" : "#181510", border: `1.5px solid ${accountType === "personal" ? "#C9A84C" : "rgba(201,168,76,0.15)"}`, borderRadius: 14, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>👤</div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8, color: "#F2ECD8" }}>Persoană fizică</div>
                <div style={{ fontSize: "0.8rem", color: "#7A7060", lineHeight: 1.5 }}>Caută sau oferă servicii ca persoană fizică</div>
              </div>
              <div onClick={() => setAccountType("company")} style={{ background: accountType === "company" ? "rgba(201,168,76,0.1)" : "#181510", border: `1.5px solid ${accountType === "company" ? "#C9A84C" : "rgba(201,168,76,0.15)"}`, borderRadius: 14, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🏢</div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8, color: "#F2ECD8" }}>Companie</div>
                <div style={{ fontSize: "0.8rem", color: "#7A7060", lineHeight: 1.5 }}>Administrează o echipă și oferă servicii profesionale</div>
              </div>
            </div>

            <button onClick={() => setStep(2)} style={{ width: "100%", background: "#C9A84C", color: "#090806", border: "none", borderRadius: 10, padding: 15, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Continuă →
            </button>

            <p style={{ textAlign: "center", color: "#7A7060", fontSize: "0.85rem", marginTop: 24 }}>
              Ai deja cont?{" "}
              <Link href="/" style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 600 }}>Intră în cont</Link>
            </p>
          </div>
        )}
        {/* Step 2 - Formular */}
        {step === 2 && accountType === "personal" && (
          <div style={{ background: "#0f0e0b", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "48px 44px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#7A7060", cursor: "pointer", fontSize: "1.2rem" }}>←</button>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#F2ECD8" }}>Persoană fizică</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Nume</label>
                <input value={form.nume} onChange={e => setForm({ ...form, nume: e.target.value })} placeholder="Popescu" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>Prenume</label>
                <input value={form.prenume} onChange={e => setForm({ ...form, prenume: e.target.value })} placeholder="Ion" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ion@email.com" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Telefon</label>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={form.prefix} onChange={e => setForm({ ...form, prefix: e.target.value })} style={{ ...selectStyle, width: 100, flexShrink: 0 }}>
                  {prefixes.map(p => <option key={p.code} value={p.prefix}>{p.prefix}</option>)}
                </select>
                <input value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="0721 000 000" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Țară</label>
              <select value={form.tara} onChange={e => setForm({ ...form, tara: e.target.value, judet: "", oras: "" })} style={selectStyle}>
                {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>
            </div>

            {form.tara === "RO" && (
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Județ</label>
                <select value={form.judet} onChange={e => setForm({ ...form, judet: e.target.value, oras: "" })} style={selectStyle}>
                  <option value="">Selectează județul...</option>
                  {getStates("RO").map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Oraș</label>
              <select value={form.oras} onChange={e => setForm({ ...form, oras: e.target.value })} style={selectStyle}>
                <option value="">Selectează orașul...</option>
                {form.tara === "RO" && form.judet
                  ? getCities("RO", form.judet).map(c => <option key={c.name} value={c.name}>{c.name}</option>)
                  : getCities(form.tara, "").map(c => <option key={c.name} value={c.name}>{c.name}</option>)
                }
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Parolă</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minim 8 caractere" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>Confirmă parola</label>
                <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repetă parola" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
              <input type="checkbox" checked={form.acceptTermeni} onChange={e => setForm({ ...form, acceptTermeni: e.target.checked })}
                style={{ marginTop: 3, accentColor: "#C9A84C", width: 16, height: 16, flexShrink: 0, cursor: "pointer" }} />
              <label style={{ fontSize: "0.83rem", color: "#7A7060", lineHeight: 1.6 }}>
                Accept <Link href="/termeni" style={{ color: "#C9A84C", textDecoration: "none" }}>Termenii și condițiile</Link> și <Link href="/confidentialitate" style={{ color: "#C9A84C", textDecoration: "none" }}>Politica de confidențialitate</Link>
              </label>
            </div>

            {error && <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: "#ff6b6b", fontSize: "0.85rem" }}>{error}</div>}

            <button onClick={handlePersonalSubmit} disabled={loading} style={{ width: "100%", background: "#C9A84C", color: "#090806", border: "none", borderRadius: 10, padding: 15, fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {loading ? "Se creează contul..." : "Creează cont gratuit"}
            </button>
          </div>
        )}
        {/* Step 2 - Formular Companie */}
        {step === 2 && accountType === "company" && (
          <div style={{ background: "#0f0e0b", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "48px 44px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#7A7060", cursor: "pointer", fontSize: "1.2rem" }}>←</button>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 700, color: "#F2ECD8" }}>Companie</h2>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Denumire companie</label>
              <input value={companyForm.denumire} onChange={e => setCompanyForm({ ...companyForm, denumire: e.target.value })} placeholder="SC Exemplu SRL" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>CUI</label>
              <input value={companyForm.cui} onChange={e => setCompanyForm({ ...companyForm, cui: e.target.value })} placeholder="RO12345678" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={companyForm.email} onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })} placeholder="contact@companie.ro" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Telefon</label>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={companyForm.prefix} onChange={e => setCompanyForm({ ...companyForm, prefix: e.target.value })} style={{ ...selectStyle, width: 100, flexShrink: 0 }}>
                  {prefixes.map(p => <option key={p.code} value={p.prefix}>{p.prefix}</option>)}
                </select>
                <input value={companyForm.telefon} onChange={e => setCompanyForm({ ...companyForm, telefon: e.target.value })} placeholder="0721 000 000" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Țară</label>
              <select value={companyForm.tara} onChange={e => setCompanyForm({ ...companyForm, tara: e.target.value, judet: "", oras: "" })} style={selectStyle}>
                {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>
            </div>

            {companyForm.tara === "RO" && (
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Județ</label>
                <select value={companyForm.judet} onChange={e => setCompanyForm({ ...companyForm, judet: e.target.value, oras: "" })} style={selectStyle}>
                  <option value="">Selectează județul...</option>
                  {getStates("RO").map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Oraș</label>
              <select value={companyForm.oras} onChange={e => setCompanyForm({ ...companyForm, oras: e.target.value })} style={selectStyle}>
                <option value="">Selectează orașul...</option>
                {companyForm.tara === "RO" && companyForm.judet
                  ? getCities("RO", companyForm.judet).map(c => <option key={c.name} value={c.name}>{c.name}</option>)
                  : getCities(companyForm.tara, "").map(c => <option key={c.name} value={c.name}>{c.name}</option>)
                }
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Adresă sediu</label>
              <input value={companyForm.adresa} onChange={e => setCompanyForm({ ...companyForm, adresa: e.target.value })} placeholder="Str. Exemplu nr. 1" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Parolă</label>
                <input type="password" value={companyForm.password} onChange={e => setCompanyForm({ ...companyForm, password: e.target.value })} placeholder="Minim 8 caractere" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
              </div>
              <div>
                <label style={labelStyle}>Confirmă parola</label>
                <input type="password" value={companyForm.confirmPassword} onChange={e => setCompanyForm({ ...companyForm, confirmPassword: e.target.value })} placeholder="Repetă parola" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
              <input type="checkbox" checked={companyForm.acceptTermeni} onChange={e => setCompanyForm({ ...companyForm, acceptTermeni: e.target.checked })}
                style={{ marginTop: 3, accentColor: "#C9A84C", width: 16, height: 16, flexShrink: 0, cursor: "pointer" }} />
              <label style={{ fontSize: "0.83rem", color: "#7A7060", lineHeight: 1.6 }}>
                Accept <Link href="/termeni" style={{ color: "#C9A84C", textDecoration: "none" }}>Termenii și condițiile</Link> și <Link href="/confidentialitate" style={{ color: "#C9A84C", textDecoration: "none" }}>Politica de confidențialitate</Link>
              </label>
            </div>

            {error && <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: "#ff6b6b", fontSize: "0.85rem" }}>{error}</div>}

            <button onClick={handleCompanySubmit} disabled={loading} style={{ width: "100%", background: "#C9A84C", color: "#090806", border: "none", borderRadius: 10, padding: 15, fontSize: "0.9rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {loading ? "Se creează contul..." : "Înregistrează compania"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}