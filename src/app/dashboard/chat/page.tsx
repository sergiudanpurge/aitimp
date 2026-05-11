"use client";

import { useState, useEffect, useRef } from "react";
import { useResponsive } from "@/hooks/useResponsive";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";

const mockConversations = [
  { id: 1, name: "Radu M.", last: "Bună ziua, aș vrea să programez...", time: "14:32", unread: 2, avatar: "R" },
  { id: 2, name: "Elena K.", last: "Mulțumesc pentru serviciu!", time: "12:10", unread: 0, avatar: "E" },
  { id: 3, name: "Andrei P.", last: "Ce prețuri aveți pentru vopsit?", time: "Ieri", unread: 1, avatar: "A" },
];

const mockMessages: any = {
  1: [
    { from: "client", text: "Bună ziua, aș vrea să programez o tundere", time: "14:30" },
    { from: "me", text: "Bună ziua! Cu plăcere, ce zi vă convine?", time: "14:31" },
    { from: "client", text: "Joi dacă se poate, dimineața", time: "14:32" },
  ],
  2: [
    { from: "client", text: "Mulțumesc pentru serviciu! A ieșit superb!", time: "12:10" },
    { from: "me", text: "Mulțumim și noi! Ne bucurăm că ești mulțumită 😊", time: "12:11" },
  ],
  3: [
    { from: "client", text: "Bună ziua! Ce prețuri aveți pentru vopsit complet?", time: "Ieri" },
  ],
};

export default function ChatPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [user, setUser] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(1);
  const [showList, setShowList] = useState(true);
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
  };

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) router.push("/login");
      else setUser(d.user);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected, messages]);

  useEffect(() => {
    if (!isMobile) setShowList(true);
  }, [isMobile]);

  const send = () => {
    if (!input.trim() || !selected) return;
    const newMsg = { from: "me", text: input, time: new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev: any) => ({ ...prev, [selected]: [...(prev[selected] || []), newMsg] }));
    setInput("");
  };

  const conv = mockConversations.find(c => c.id === selected);

  if (!user) return <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.accent }}>Se încarcă...</div>;

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#050505", color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex" }}>

      {/* SIDEBAR */}
      {!isMobile && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16, paddingBottom: isMobile ? 130 : 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <Sidebar user={user} companyName={user.accountType === "company" ? user.name : undefined} />
        </div>
      )}

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>

        {/* TOPBAR */}
        <div style={{ height: 58, flexShrink: 0, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 28px", zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ fontSize: 18, textDecoration: "none", color: s.muted }}>🏠</Link>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 600 }}>Chat</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: s.surface, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
            🔔<div style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: s.accent, border: `1.5px solid ${s.bg}` }} />
          </div>
        </div>

        {/* CHAT AREA */}
        <div style={{ flex: 1, overflow: "hidden", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr" }}>

          {/* LISTA CONVERSATII */}
          {(!isMobile || showList) && (
            <div style={{ borderRight: isMobile ? "none" : `1px solid ${s.border}`, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: s.surface }}>
              <div style={{ padding: 16, borderBottom: `1px solid ${s.border}`, flexShrink: 0 }}>
                <input placeholder="Caută conversație..." style={{ width: "100%", padding: "9px 14px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 8, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }} />
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {mockConversations.map(c => (
                  <div key={c.id} onClick={() => { setSelected(c.id); if (isMobile) setShowList(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", background: selected === c.id ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: `3px solid ${selected === c.id ? s.accent : "transparent"}`, transition: "all 0.15s" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "var(--font-playfair)" }}>{c.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: s.muted }}>{c.time}</div>
                      </div>
                      <div style={{ fontSize: 12, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
                    </div>
                    {c.unread > 0 && <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.accent, color: "#0a0a0a", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.unread}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESAJE */}
          {(!isMobile || !showList) && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: s.bg }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                {isMobile && <button onClick={() => setShowList(true)} style={{ background: "none", border: "none", color: s.muted, fontSize: 20, cursor: "pointer" }}>←</button>}
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "var(--font-playfair)" }}>{conv?.avatar}</div>
                <div><div style={{ fontSize: 14, fontWeight: 600 }}>{conv?.name}</div><div style={{ fontSize: 11, color: "#4caf82" }}>● Online</div></div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {(messages[selected!] || []).map((m: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: isMobile ? "80%" : "70%", padding: "10px 14px", borderRadius: m.from === "me" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.from === "me" ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, color: m.from === "me" ? "#0a0a0a" : "#f0ede8", fontSize: 13, lineHeight: 1.5 }}>
                      <div>{m.text}</div>
                      <div style={{ fontSize: 10, color: m.from === "me" ? "rgba(0,0,0,0.5)" : s.muted, marginTop: 4, textAlign: "right" }}>{m.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${s.border}`, display: "flex", gap: 8, flexShrink: 0, position: isMobile ? "fixed" as const : "relative" as const, bottom: isMobile ? 60 : "auto", left: isMobile ? 0 : "auto", right: isMobile ? 0 : "auto", background: s.bg, zIndex: 50 }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Scrie un mesaj..."
                  style={{ flex: 1, padding: "11px 16px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = s.accent)} onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
                <button onClick={send} style={{ padding: "11px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>➤</button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAV MOBILE */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#111", borderTop: `1px solid ${s.border}`, display: "flex", zIndex: 100 }}>
            {[{icon:"⚡",label:"Dashboard",href:"/dashboard"},{icon:"📅",label:"Rezervări",href:"/dashboard/bookings"},{icon:"💬",label:"Chat",href:"/dashboard/chat"},{icon:"⭐",label:"Recenzii",href:"/dashboard/reviews"},{icon:"⚙️",label:"Setări",href:"/dashboard/settings"}].map(item => (
              <Link key={item.href} href={item.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: item.href === "/dashboard/chat" ? s.accent : s.muted, fontSize: 9, textDecoration: "none" }}>
                <div style={{ fontSize: 18 }}>{item.icon}</div>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}