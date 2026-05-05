"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#777",
  };

  useEffect(() => {
    // Verificam daca e logat
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.error) { router.push("/login"); return; }
      setMe(d.user);
    });

    // Luam datele utilizatorului cu care vorbim
    fetch(`/api/providers/${userId}`).then(r => r.json()).then(d => {
      setOtherUser(d.provider);
      setLoading(false);
    });

    // Luam mesajele
    fetch(`/api/messages/${userId}`).then(r => r.json()).then(d => {
      setMessages(d.messages || []);
    });
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    const newMsg = { fromId: me?.id, toId: userId, content: text, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toId: userId, content: text })
    });
  };

  if (loading) return <div style={{ minHeight: "100vh", background: s.bg }} />;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{ height: 58, background: "#111", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 14, padding: "0 20px", position: "sticky", top: 0, zIndex: 40 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: s.muted, cursor: "pointer", fontSize: 18, padding: "4px 8px" }}>←</button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
          {otherUser?.name?.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{otherUser?.name}</div>
          <div style={{ fontSize: 11, color: s.accent }}>● Online</div>
        </div>
      </div>

      {/* MESAJE */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: s.muted, fontSize: 13, marginTop: 40 }}>
            Începe o conversație cu {otherUser?.name}
          </div>
        )}
        {messages.map((m: any, i: number) => {
          const isMe = m.fromId === me?.id;
          return (
            <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isMe ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, color: isMe ? "#0a0a0a" : "#f0ede8", fontSize: 13, lineHeight: 1.5 }}>
                <div>{m.content}</div>
                <div style={{ fontSize: 10, color: isMe ? "rgba(0,0,0,0.5)" : s.muted, marginTop: 4, textAlign: "right" }}>
                  {new Date(m.createdAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${s.border}`, background: "#111", display: "flex", gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Scrie un mesaj..." style={{ flex: 1, padding: "11px 16px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)" }}
          onFocus={e => (e.currentTarget.style.borderColor = s.accent)}
          onBlur={e => (e.currentTarget.style.borderColor = s.border)} />
        <button onClick={send} style={{ padding: "11px 20px", background: "linear-gradient(135deg,#c9a96e,#a8843d)", color: "#0a0a0a", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-outfit)" }}>
          ➤
        </button>
      </div>
    </div>
  );
}