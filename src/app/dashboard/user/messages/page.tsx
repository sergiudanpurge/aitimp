"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

export default function UserMessagesPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [showList, setShowList] = useState(true);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777", green: "#4caf82",
  };

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      setUser(d.user);
    });
    fetch("/api/conversations").then(r => r.json()).then(d => setConversations(d.conversations || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isMobile) setShowList(true);
  }, [isMobile]);

  const send = () => {
    if (!input.trim() || !selected) return;
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: selected.id, text: input }),
    });
    setMessages(prev => [...prev, { from: "me", text: input, time: new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex", flexDirection: "column" }}>

      {/* TOPBAR */}
      <div style={{ height: 56, flexShrink: 0, background: "rgba(10,10,10,0.9)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", zIndex: 40, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isMobile && !showList && <button onClick={() => setShowList(true)} style={{ background: "none", border: "none", color: s.muted, fontSize: 20, cursor: "pointer" }}>←</button>}
          {(showList || !isMobile) && <Link href="/dashboard/user" style={{ fontSize: 20, textDecoration: "none", color: s.muted }}>←</Link>}
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>
            {!isMobile || showList ? "Mesaje" : selected?.name || "Conversație"}
          </div>
        </div>
        <div style={{ fontSize: 11, color: s.muted }}>{conversations.length} conversații</div>
      </div>

      {/* CHAT AREA */}
      <div style={{ flex: 1, overflow: "hidden", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "300px 1fr" }}>

        {/* LISTA */}
        {(!isMobile || showList) && (
          <div style={{ borderRight: isMobile ? "none" : `1px solid ${s.border}`, display: "flex", flexDirection: "column", overflow: "hidden", background: s.surface }}>
            <div style={{ padding: 12, borderBottom: `1px solid ${s.border}`, flexShrink: 0 }}>
              <input placeholder="Caută conversație..." style={{ width: "100%", padding: "8px 12px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 8, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }} />
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {conversations.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: s.muted }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
                  <div style={{ fontSize: 13 }}>Nicio conversație încă</div>
                  <Link href="/search" style={{ display: "block", marginTop: 12, fontSize: 12, color: s.accent }}>Caută un prestator →</Link>
                </div>
              ) : conversations.map((c: any, i: number) => (
                <div key={i} onClick={() => { setSelected(c); if (isMobile) setShowList(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer", background: selected?.id === c.id ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: `3px solid ${selected?.id === c.id ? s.accent : "transparent"}` }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "var(--font-playfair)" }}>
                    {c.name?.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMessage || "Niciun mesaj"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESAJE */}
        {(!isMobile || !showList) && (
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: s.bg }}>
            {!selected ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: s.muted }}>
                <div style={{ fontSize: 40 }}>💬</div>
                <div style={{ fontSize: 14 }}>Selectează o conversație</div>
              </div>
            ) : (
              <>
                <div style={{ padding: "12px 20px", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>{selected.name?.charAt(0)}</div>
                  <div><div style={{ fontSize: 14, fontWeight: 600 }}>{selected.name}</div><div style={{ fontSize: 11, color: s.green }}>● Online</div></div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  {messages.map((m: any, i: number) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
                      <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: m.from === "me" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.from === "me" ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, color: m.from === "me" ? "#0a0a0a" : "#f0ede8", fontSize: 13 }}>
                        {m.text}
                        <div style={{ fontSize: 10, color: m.from === "me" ? "rgba(0,0,0,0.5)" : s.muted, marginTop: 4, textAlign: "right" }}>{m.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 16px", borderTop: `1px solid ${s.border}`, display: "flex", gap: 8, flexShrink: 0, paddingBottom: isMobile ? "76px" : "12px" }}>
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Scrie un mesaj..."
                    style={{ flex: 1, padding: "11px 16px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)" }}
                    onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                  <button onClick={send} style={{ padding: "11px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>➤</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV MOBILE */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#111", borderTop: `1px solid ${s.border}`, display: "flex", zIndex: 100 }}>
          {[["🏠","Profil","/dashboard/user"],["📅","Rezervări","/dashboard/user/bookings"],["💬","Mesaje","/dashboard/user/messages"],["✂️","Servicii","/dashboard/user/services"],["⚙️","Setări","/dashboard/user/settings"]].map(([i,l,h]) => (
            <Link key={h} href={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: h === "/dashboard/user/messages" ? s.accent : s.muted, fontSize: 9, textDecoration: "none" }}>
              <div style={{ fontSize: 18 }}>{i}</div>{l}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}