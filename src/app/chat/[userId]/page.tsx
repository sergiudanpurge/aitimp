"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useResponsive } from "@/hooks/useResponsive";

const MOCK_MESSAGES = [
  { id: 1, fromMe: false, text: "Buna ziua! As dori sa ma programez pentru un tuns si styling.", time: "10:23", read: true },
  { id: 2, fromMe: true, text: "Buna! Cu placere, avem disponibilitate marti si joi. Ce zi va convine?", time: "10:25", read: true },
  { id: 3, fromMe: false, text: "Marti ar fi perfect! Aveti ceva disponibil dupa ora 14:00?", time: "10:26", read: true },
  { id: 4, fromMe: true, text: "Da, avem disponibil la 14:30 sau 15:00. Care preferati?", time: "10:28", read: true },
  { id: 5, fromMe: false, text: "14:30 este ideal. Ce pret are serviciul?", time: "10:29", read: true },
  { id: 6, fromMe: true, text: "Tuns + Styling costa 45 lei si dureaza aproximativ 30 de minute.", time: "10:31", read: true },
  { id: 7, fromMe: false, text: "Perfect, va rog sa ma programati pentru marti la 14:30!", time: "10:32", read: true },
  { id: 8, fromMe: true, text: "Programarea a fost inregistrata! Va asteptam marti la 14:30. Va vom trimite un reminder cu o zi inainte. ✅", time: "10:33", read: false },
];

const MOCK_CONTACTS = [
  { id: "1", name: "Color Craft Studio", lastMsg: "Programarea a fost inregistrata!", time: "10:33", unread: 0, isOnline: true },
  { id: "2", name: "Mirel Popescu", lastMsg: "Va astept marti!", time: "Ieri", unread: 2, isOnline: false },
  { id: "3", name: "Ioana Danila", lastMsg: "Multumesc pentru rezervare", time: "Lun", unread: 0, isOnline: true },
];

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [activeContact, setActiveContact] = useState(MOCK_CONTACTS[0]);
  const [showContacts, setShowContacts] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const s = {
    bg: "#0a0a0a", surface: "#161616", surface2: "#1e1e1e",
    border: "#262626", accent: "#c9a96e", muted: "#666",
    green: "#4caf82",
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setMessages(prev => [...prev, { id: Date.now(), fromMe: true, text, time, read: false }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, fromMe: false, text: "Multumesc pentru mesaj! Va vom raspunde in cel mai scurt timp. 😊", time: new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }), read: false }]);
    }, 1500);
  };

  const ContactsList = () => (
    <div style={{ width: isMobile ? "100%" : 280, borderRight: `1px solid ${s.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "16px", borderBottom: `1px solid ${s.border}` }}>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Mesaje</div>
        <input placeholder="Cauta conversatie..." style={{ width: "100%", padding: "8px 12px", background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)", boxSizing: "border-box" as const }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {MOCK_CONTACTS.map(contact => (
          <div key={contact.id} onClick={() => { setActiveContact(contact); if (isMobile) setShowContacts(false); }}
            style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: activeContact.id === contact.id ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: activeContact.id === contact.id ? `3px solid ${s.accent}` : "3px solid transparent" }}
            onMouseEnter={e => { if (activeContact.id !== contact.id) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}
            onMouseLeave={e => { if (activeContact.id !== contact.id) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff" }}>
                {contact.name.charAt(0)}
              </div>
              {contact.isOnline && <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: s.green, border: "2px solid #161616" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.name}</div>
                <div style={{ fontSize: 10, color: s.muted, flexShrink: 0 }}>{contact.time}</div>
              </div>
              <div style={{ fontSize: 12, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.lastMsg}</div>
            </div>
            {contact.unread > 0 && (
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: s.accent, color: "#0a0a0a", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{contact.unread}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: "#f0ede8", fontFamily: "var(--font-outfit)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* CONTAINER PRINCIPAL */}
      <div style={{ flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: isMobile ? 0 : "24px 24px", display: "flex", height: "calc(100vh - 58px)", boxSizing: "border-box" as const }}>
        <div style={{ flex: 1, display: "flex", background: s.surface, border: isMobile ? "none" : `1px solid ${s.border}`, borderRadius: isMobile ? 0 : 16, overflow: "hidden" }}>

          {/* LISTA CONTACTE */}
          <ContactsList />

          {/* CONVERSATIE */}
          {(!isMobile || !showContacts) && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

              {/* HEADER CONVERSATIE */}
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 12, background: s.surface, flexShrink: 0 }}>
                {isMobile && (
                  <button onClick={() => setShowContacts(true)} style={{ width: 34, height: 34, borderRadius: 9, background: s.surface2, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
                )}
                {!isMobile && (
                  <button onClick={() => router.back()} style={{ width: 34, height: 34, borderRadius: 9, background: s.surface2, border: `1px solid ${s.border}`, color: "#f0ede8", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
                )}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#c9a96e,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    {activeContact.name.charAt(0)}
                  </div>
                  {activeContact.isOnline && <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: s.green, border: "2px solid #161616" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{activeContact.name}</div>
                  <div style={{ fontSize: 11, color: activeContact.isOnline ? s.green : s.muted }}>{activeContact.isOnline ? "Online acum" : "Offline"}</div>
                </div>
                <button style={{ width: 34, height: 34, borderRadius: 9, background: s.surface2, border: `1px solid ${s.border}`, color: s.muted, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⋯</button>
              </div>

              {/* MESAJE */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ textAlign: "center", margin: "4px 0 12px" }}>
                  <span style={{ fontSize: 11, color: s.muted, background: s.surface2, padding: "4px 12px", borderRadius: 20 }}>Azi</span>
                </div>
                {messages.map((msg, i) => {
                  const showAvatar = !msg.fromMe && (i === 0 || messages[i-1]?.fromMe);
                  return (
                    <div key={msg.id} style={{ display: "flex", flexDirection: msg.fromMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 8 }}>
                      {!msg.fromMe && (
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: showAvatar ? "linear-gradient(135deg,#c9a96e,#8b5e3c)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                          {showAvatar ? activeContact.name.charAt(0) : ""}
                        </div>
                      )}
                      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: msg.fromMe ? "flex-end" : "flex-start" }}>
                        <div style={{ padding: "9px 13px", borderRadius: msg.fromMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.fromMe ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, color: msg.fromMe ? "#0a0a0a" : "#f0ede8", fontSize: 13, lineHeight: 1.6, wordBreak: "break-word" as const }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize: 10, color: s.muted, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
                          {msg.time}
                          {msg.fromMe && <span style={{ color: msg.read ? s.accent : s.muted }}>✓✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* INPUT */}
              <div style={{ padding: "10px 14px", borderTop: `1px solid ${s.border}`, display: "flex", alignItems: "center", gap: 8, background: s.surface, flexShrink: 0 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Scrie un mesaj..."
                  style={{ flex: 1, background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 22, padding: "9px 16px", color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = s.accent)}
                  onBlur={e => (e.currentTarget.style.borderColor = s.border)}
                />
                <button onClick={sendMessage} disabled={!input.trim()}
                  style={{ width: 40, height: 40, borderRadius: "50%", background: input.trim() ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, border: `1px solid ${input.trim() ? "transparent" : s.border}`, color: input.trim() ? "#0a0a0a" : s.muted, fontSize: 17, cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
                  ➤
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}