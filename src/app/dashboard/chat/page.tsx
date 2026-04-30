"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

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
  const [selected, setSelected] = useState(1);
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected, messages]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { from: "me", text: input, time: new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev: any) => ({ ...prev, [selected]: [...(prev[selected] || []), newMsg] }));
    setInput("");
  };

  const conv = mockConversations.find(c => c.id === selected);

  return (
    <DashboardLayout title="Chat">
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, background: "#161616", border: "1px solid #262626", borderRadius: 14, overflow: "hidden", height: "calc(100vh - 160px)" }}>

        {/* Lista conversatii */}
        <div style={{ borderRight: "1px solid #262626", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #262626" }}>
            <input placeholder="Caută conversație..." style={{ width: "100%", padding: "9px 14px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 8, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {mockConversations.map(c => (
              <div key={c.id} onClick={() => setSelected(c.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", background: selected === c.id ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: `3px solid ${selected === c.id ? "#c9a96e" : "transparent"}`, transition: "all 0.15s" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "var(--font-playfair)" }}>
                  {c.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#777" }}>{c.time}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#777", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
                </div>
                {c.unread > 0 && (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#c9a96e", color: "#0a0a0a", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {c.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Zona mesaje */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #262626", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "var(--font-playfair)" }}>
              {conv?.avatar}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{conv?.name}</div>
              <div style={{ fontSize: 11, color: "#4caf82" }}>● Online</div>
            </div>
          </div>

          {/* Mesaje */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {(messages[selected] || []).map((m: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: m.from === "me" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.from === "me" ? "linear-gradient(135deg,#c9a96e,#a8843d)" : "#1e1e1e", color: m.from === "me" ? "#0a0a0a" : "#f0ede8", fontSize: 13, lineHeight: 1.5 }}>
                  <div>{m.text}</div>
                  <div style={{ fontSize: 10, color: m.from === "me" ? "rgba(0,0,0,0.5)" : "#777", marginTop: 4, textAlign: "right" }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid #262626", display: "flex", gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Scrie un mesaj..." style={{ flex: 1, padding: "11px 16px", background: "#1e1e1e", border: "1px solid #262626", borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#c9a96e")}
              onBlur={e => (e.currentTarget.style.borderColor = "#262626")} />
            <button onClick={send} style={{ padding: "11px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
              Trimite
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}