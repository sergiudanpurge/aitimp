"use client";
import { useState, useRef } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dlemr26ee";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "aitimp_avatars";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  employeeId?: string;
  employees?: { id: string; name: string }[];
  showAssign?: boolean;
}

const s = {
  surface: "#111111", surface2: "#1a1a1a", border: "#1e1e1e",
  accent: "#c9a96e", muted: "#555555", red: "#e05a5a",
};

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
  const data = await res.json();
  return data.secure_url;
}

export default function AddServiceModal({ open, onClose, onSaved, employeeId, employees = [], showAssign = false }: Props) {
  const [form, setForm] = useState({ name: "", description: "", duration: "1", price: "" });
  const [assignTo, setAssignTo] = useState("company");
  const [images, setImages] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - images.length);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      setImages(prev => [...prev, ...urls].slice(0, 3));
      setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))].slice(0, 3));
    } catch { setError("Eroare la upload imagine"); }
    finally { setUploading(false); }
  };

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const save = async () => {
    if (!form.name || !form.price) { setError("Completează numele și prețul!"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          duration: parseInt(form.duration),
          price: parseFloat(form.price),
          gallery: images,
          ...(employeeId ? { employeeId } : {}),
          ...(showAssign && assignTo !== "company" ? { employeeId: assignTo } : {}),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ name: "", description: "", duration: "1", price: "" });
        setImages([]); setPreviews([]);
        onSaved(); onClose();
      } else setError(data.error || "Eroare la salvare");
    } catch { setError("Eroare retea"); }
    finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#161616", border: "1px solid #262626", borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
        
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#f0ede8" }}>+ Serviciu nou</div>
        
        {showAssign && employees.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Atribuie la</div>
            <select value={assignTo} onChange={e => setAssignTo(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: "1px solid " + s.border, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
              <option value="company">🏢 Companie</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>👤 {emp.name}</option>
              ))}
            </select>
          </div>
        )}
        {error && (
          <div style={{ padding: "10px 14px", background: "rgba(224,90,90,0.1)", border: "1px solid rgba(224,90,90,0.3)", borderRadius: 8, color: s.red, fontSize: 13, marginBottom: 14 }}>{error}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* NUME */}
          <div>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Nume serviciu *</div>
            <input value={form.name}
              onChange={e => setForm({...form, name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)})}
              placeholder="ex: Tuns + Styling"
              style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: "1px solid " + s.border, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }} />
          </div>

          {/* DESCRIERE */}
          <div>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Descriere</div>
            <textarea value={form.description}
              onChange={e => setForm({...form, description: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)})}
              placeholder="Descrie serviciul oferit..."
              rows={3}
              style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: "1px solid " + s.border, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const, resize: "vertical" as const }} />
          </div>

          {/* DURATA + PRET */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Durata</div>
              <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
                style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: "1px solid " + s.border, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
                {[1,2,3,4,6,8].map(d => <option key={d} value={d}>{d*30} min</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Pret (lei) *</div>
              <input type="number" value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                placeholder="ex: 50"
                style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: "1px solid " + s.border, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }} />
            </div>
          </div>

          {/* GALERIE */}
          <div>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 8 }}>Galerie serviciu (max 3 poze)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", position: "relative", background: s.surface2, border: "1px solid " + (previews[i] ? s.accent : s.border), cursor: "pointer" }}
                  onClick={() => !previews[i] && fileRef.current?.click()}>
                  {previews[i] ? (
                    <>
                      <img src={previews[i]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={e => { e.stopPropagation(); removeImage(i); }}
                        style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: 22, height: 22, color: "#fff", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </>
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <div style={{ fontSize: 22, opacity: 0.4 }}>{uploading ? "⏳" : "📷"}</div>
                      <div style={{ fontSize: 10, color: s.muted }}>{uploading ? "Se incarca..." : "Adauga"}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: "none" }} />
            {images.length < 3 && (
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ marginTop: 8, width: "100%", padding: "9px", background: "transparent", border: "1px dashed " + s.border, borderRadius: 10, color: s.muted, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
                {uploading ? "⏳ Se uploadeaza..." : "📷 Alege poze"}
              </button>
            )}
          </div>

          {/* BUTOANE */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", background: s.surface2, border: "1px solid " + s.border, borderRadius: 10, color: s.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>Anuleaza</button>
            <button onClick={save} disabled={loading || uploading}
              style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: "var(--font-outfit)", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Se salveaza..." : "✓ Adauga serviciu"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}