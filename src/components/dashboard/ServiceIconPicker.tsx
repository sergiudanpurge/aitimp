"use client";
import { useState } from "react";

const ICONS_BY_CATEGORY = [
  { cat: "💆 Beauty & Wellness", icons: ["✂️","💆","💅","💈","🧖","🪮","💄","🧴","🛁","🪒"] },
  { cat: "🔧 Reparatii & Casa", icons: ["🔧","🪛","⚡","🚿","🪟","🏠","🧹","🪣","🔨","🪚"] },
  { cat: "💻 IT & Digital", icons: ["💻","🖥️","📱","🖨️","⌨️","🖱️","📡","🔌","💾","🛜"] },
  { cat: "🏥 Sanatate", icons: ["💊","🩺","🏥","🧬","🩹","💉","🦷","👁️","🧠","🫀"] },
  { cat: "📚 Educatie", icons: ["📚","✏️","🎓","📖","🔬","🧪","📐","🎯","🏫","📝"] },
  { cat: "⚖️ Juridic & Financiar", icons: ["⚖️","📋","💼","🏦","📊","🧮","📜","🤝","💰","🔏"] },
  { cat: "🚗 Auto & Transport", icons: ["🚗","🔩","⛽","🚙","🏍️","🚐","🛻","🚕","🚑","🚛"] },
  { cat: "📸 Foto & Video", icons: ["📸","🎥","🎬","🎞️","📹","🎙️","🎤","🎵","🎶","🎸"] },
  { cat: "🏋️ Sport & Fitness", icons: ["🏋️","🧘","🤸","⚽","🏊","🚴","🥊","🎾","🏃","🧗"] },
  { cat: "🐾 Animale", icons: ["🐾","🐕","🐈","🦮","🐇","🐠","🦜","🐴","🐄","🐑"] },
  { cat: "🍳 Gastronomie", icons: ["🍳","👨‍🍳","🍕","🍰","🥗","🍱","🧁","☕","🍷","🥐"] },
  { cat: "🌿 Gradinarit", icons: ["🌿","🌱","🌳","🪴","🌸","✂️","🪺","🌾","💐","🍃"] },
  { cat: "🎨 Design & Arta", icons: ["🎨","🖌️","✏️","🖊️","📐","🗿","🖼️","🎭","🎪","🪆"] },
  { cat: "👶 Familie & Copii", icons: ["👶","🍼","🧸","🎠","🎡","📚","🎨","🧩","🛝","🎪"] },
  { cat: "🎉 Evenimente", icons: ["🎉","🎊","💒","🎂","🎈","🎁","🪄","🎭","🎵","🌹"] },
];

const ALL_ICONS = ICONS_BY_CATEGORY.flatMap(c => c.icons.map(icon => ({ icon, cat: c.cat })));

const SEARCH_MAP: Record<string, string[]> = {
  "zugrav": ["🪣","🎨","🏠"],
  "zugravit": ["🪣","🎨"],
  "frizerie": ["✂️","💈"],
  "coafor": ["✂️","💆","💈"],
  "doctor": ["🩺","💊","🏥"],
  "medic": ["🩺","💊","🏥"],
  "electrician": ["⚡","🔌"],
  "instalator": ["🚿","🔧"],
  "it": ["💻","🖥️"],
  "calculator": ["💻","🖥️"],
  "foto": ["📸","🎥"],
  "fotograf": ["📸","🎥"],
  "avocat": ["⚖️","📋"],
  "contabil": ["🧮","💰","📊"],
  "profesor": ["📚","✏️","🎓"],
  "meditatii": ["📚","✏️"],
  "masaj": ["💆","🧖"],
  "manichiura": ["💅","💄"],
  "auto": ["🚗","🔩"],
  "vulcanizare": ["🚗","🔩","⛽"],
  "gradinarit": ["🌿","🌱","✂️"],
  "curatenie": ["🧹","🪣","🏠"],
  "babysitter": ["👶","🍼","🧸"],
  "nunti": ["💒","🎉","🌹"],
  "catering": ["🍳","👨‍🍳","🍕"],
};

interface Props {
  value: string;
  onChange: (icon: string) => void;
}

export default function ServiceIconPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const s = {
    surface: "#111", surface2: "#1a1a1a", border: "#1e1e1e",
    accent: "#c9a96e", muted: "#555",
  };

  const getResults = () => {
    if (!search) return null;
    const q = search.toLowerCase();
    // Cautam in search map
    const mapped = Object.entries(SEARCH_MAP)
      .filter(([key]) => key.includes(q) || q.includes(key))
      .flatMap(([, icons]) => icons);
    // Cautam si in toate iconurile
    return [...new Set(mapped)].slice(0, 20);
  };

  const searchResults = getResults();

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger button */}
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: `1px solid ${open ? s.accent : s.border}`, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
        <span style={{ fontSize: 24 }}>{value}</span>
        <span style={{ color: s.muted, fontSize: 12, fontFamily: "var(--font-outfit)" }}>Schimba iconita ▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#161616", border: "1px solid #262626", borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 560, maxHeight: "70vh", display: "flex", flexDirection: "column", gap: 12 }}>
            
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>Alege iconita serviciului</div>
            
            {/* Search */}
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Cauta: zugrav, doctor, frizerie..."
              style={{ padding: "10px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }} />

            <div style={{ overflowY: "auto", flex: 1 }}>
              {searchResults ? (
                <div>
                  <div style={{ fontSize: 11, color: s.muted, marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Rezultate pentru "{search}"</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {searchResults.map((icon, i) => (
                      <button key={i} type="button" onClick={() => { onChange(icon); setOpen(false); setSearch(""); }}
                        style={{ width: 38, height: 38, borderRadius: 8, border: `1px solid ${value === icon ? s.accent : s.border}`, background: value === icon ? "rgba(201,169,110,0.15)" : s.surface2, fontSize: 20, cursor: "pointer" }}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                ICONS_BY_CATEGORY.map(cat => (
                  <div key={cat.cat} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: s.muted, marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{cat.cat}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {cat.icons.map((icon, i) => (
                        <button key={i} type="button" onClick={() => { onChange(icon); setOpen(false); }}
                          style={{ width: 38, height: 38, borderRadius: 8, border: `1px solid ${value === icon ? s.accent : s.border}`, background: value === icon ? "rgba(201,169,110,0.15)" : s.surface2, fontSize: 20, cursor: "pointer" }}>
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}