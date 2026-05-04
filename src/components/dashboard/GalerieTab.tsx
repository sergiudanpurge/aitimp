"use client";

import { useState, useEffect } from "react";

export default function GalerieTab({ providerId }: { providerId?: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [pid, setPid] = useState<string | undefined>(providerId);

  useEffect(() => {
    if (providerId) {
      setPid(providerId);
      fetch(`/api/gallery/${providerId}`).then(r => r.json()).then(d => {
        setImages(d.gallery || []);
      });
    }
  }, [providerId]);

  const uploadImage = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (!files.length) return;
    if (images.length + files.length > 6) {
      setMsg("Maxim 6 poze permise!");
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    if (!pid) {
      setMsg("Eroare: provider negasit!");
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    setUploading(true);
    const newImages = [...images];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "aitimp_avatars");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) newImages.push(data.secure_url);
    }
    const saveRes = await fetch(`/api/gallery/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gallery: newImages }),
    });
    const saveData = await saveRes.json();
    if (saveRes.ok) {
      setImages(newImages);
      setMsg("Poze adaugate!");
    } else {
      setMsg("Eroare la salvare: " + saveData.error);
    }
    setTimeout(() => setMsg(""), 3000);
    setUploading(false);
  };

  const deleteImage = async (url: string) => {
    if (!confirm("Stergi poza?")) return;
    if (!pid) return;
    const newImages = images.filter(img => img !== url);
    await fetch(`/api/gallery/${pid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gallery: newImages }),
    });
    setImages(newImages);
    setMsg("Poza stearsa!");
    setTimeout(() => setMsg(""), 2000);
  };

  if (!pid) return (
    <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 24, textAlign: "center", color: "#777" }}>
      <div style={{ fontSize: 13 }}>Se incarca galeria...</div>
    </div>
  );

  return (
    <div style={{ background: "#161616", border: "1px solid #262626", borderRadius: 14, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600 }}>Galerie foto</div>
          <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>{images.length}/6 poze adaugate</div>
        </div>
        {images.length < 6 && (
          <label style={{ padding: "10px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
            {uploading ? "Se incarca..." : "+ Adauga poze"}
            <input type="file" accept="image/*" multiple onChange={uploadImage} style={{ display: "none" }} disabled={uploading} />
          </label>
        )}
      </div>

      {msg && <div style={{ background: msg.includes("Eroare") ? "rgba(224,90,90,0.1)" : "rgba(76,175,130,0.1)", border: `1px solid ${msg.includes("Eroare") ? "rgba(224,90,90,0.3)" : "rgba(76,175,130,0.3)"}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: msg.includes("Eroare") ? "#e05a5a" : "#4caf82", fontSize: 13 }}>{msg}</div>}

      {images.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#777" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Nicio poza adaugata</div>
          <div style={{ fontSize: 13 }}>Adauga pana la 6 poze cu munca ta</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "1", background: "#1e1e1e" }}>
              <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => deleteImage(img)} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#e05a5a", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>×</button>
            </div>
          ))}
          {images.length < 6 && (
            <label style={{ borderRadius: 10, border: "1px dashed #262626", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", aspectRatio: "1", opacity: 0.5, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLLabelElement).style.opacity = "0.85"}
              onMouseLeave={e => (e.currentTarget as HTMLLabelElement).style.opacity = "0.5"}>
              <div style={{ fontSize: 24, color: "#777" }}>+</div>
              <div style={{ fontSize: 11, color: "#777" }}>Adauga</div>
              <input type="file" accept="image/*" multiple onChange={uploadImage} style={{ display: "none" }} disabled={uploading} />
            </label>
          )}
        </div>
      )}
    </div>
  );
}