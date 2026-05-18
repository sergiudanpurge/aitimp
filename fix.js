const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// 1. Inseram mock data INAINTE de functie (outside JSX)
const funcMarker = 'export default function EmployeeDashboard()';
const mockData = `const MOCK_CONTACTS_EMP = [
  { id: "c1", name: "Dorin Mihai", lastMsg: "Multumesc, pe marti!", time: "10:33", unread: 2, isOnline: true },
  { id: "c2", name: "Ana Constantin", lastMsg: "Super, va astept!", time: "Ieri", unread: 0, isOnline: false },
  { id: "c3", name: "Maria Ionescu", lastMsg: "Ok, am inteles!", time: "Lun", unread: 0, isOnline: true },
];
const MOCK_MSGS_EMP: Record<string,any[]> = {
  c1: [
    { id:1, fromMe:false, text:"Buna! Vreau sa ma programez pentru tuns si styling marti.", time:"10:20", read:true },
    { id:2, fromMe:true, text:"Buna Dorin! Avem disponibil la 14:30. Va convine?", time:"10:25", read:true },
    { id:3, fromMe:false, text:"Multumesc, pe marti!", time:"10:33", read:false },
  ],
  c2: [
    { id:1, fromMe:false, text:"Buna ziua! Pot veni joi pentru balayage?", time:"09:00", read:true },
    { id:2, fromMe:true, text:"Buna! Da, joi la 11:00 avem loc.", time:"09:15", read:true },
    { id:3, fromMe:false, text:"Super, va astept!", time:"09:20", read:true },
  ],
  c3: [
    { id:1, fromMe:false, text:"Vreau sa anulez programarea de vineri.", time:"Lun", read:true },
    { id:2, fromMe:true, text:"Am anulat, cu drag reveniti!", time:"Lun", read:true },
    { id:3, fromMe:false, text:"Ok, am inteles!", time:"Lun", read:true },
  ],
};\n\n`;

code = code.replace(funcMarker, mockData + funcMarker);
console.log('✅ Mock data adaugat!');

// 2. Adauga state pentru chat dupa profileLoading
const stateMarker = 'const [profileLoading, setProfileLoading]';
const stateIdx = code.indexOf(stateMarker);
const stateLineEnd = code.indexOf('\r\n', stateIdx) + 2;
const newStates = `  const [activeChatContact, setActiveChatContact] = useState<any>(MOCK_CONTACTS_EMP[0]);\r\n  const [chatMsgs, setChatMsgs] = useState<any[]>(MOCK_MSGS_EMP["c1"]);\r\n  const [chatInput, setChatInput] = useState("");\r\n`;
code = code.substring(0, stateLineEnd) + newStates + code.substring(stateLineEnd);
console.log('✅ State chat adaugat!');

// 3. Inlocuim placeholder mesaje pozitional
// Recalculam pozitiile dupa inserari
const mesajeIdx = code.indexOf('activeSection === "mesaje"');
const editareIdx = code.indexOf('===== EDITARE PROFIL', mesajeIdx);
const blockEnd = code.lastIndexOf(')}', editareIdx) + 2;
console.log('Mesaje block:', mesajeIdx, '-', blockEnd);

const newChat = `activeSection === "mesaje" && (
            <div style={{ display: "flex", background: s.surface, border: \`1px solid \${s.border}\`, borderRadius: 14, overflow: "hidden", height: isMobile ? "70vh" : 520 }}>
              {!isMobile && (
                <div style={{ width: 220, borderRight: \`1px solid \${s.border}\`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
                  <div style={{ padding: "12px 16px", borderBottom: \`1px solid \${s.border}\`, fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 600 }}>Clienti</div>
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {MOCK_CONTACTS_EMP.map(contact => (
                      <div key={contact.id} onClick={() => { setActiveChatContact(contact); setChatMsgs(MOCK_MSGS_EMP[contact.id] || []); }}
                        style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: activeChatContact?.id === contact.id ? "rgba(201,169,110,0.08)" : "transparent", borderLeft: activeChatContact?.id === contact.id ? \`3px solid \${s.accent}\` : "3px solid transparent" }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#5a8de0,#3a6dc0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{contact.name.charAt(0)}</div>
                          {contact.isOnline && <div style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, borderRadius: "50%", background: s.green, border: \`2px solid \${s.surface}\` }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.name}</div>
                          <div style={{ fontSize: 11, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.lastMsg}</div>
                        </div>
                        {contact.unread > 0 && <div style={{ width: 16, height: 16, borderRadius: "50%", background: s.accent, color: "#0a0a0a", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{contact.unread}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ padding: "10px 14px", borderBottom: \`1px solid \${s.border}\`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#5a8de0,#3a6dc0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{activeChatContact?.name?.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{activeChatContact?.name}</div>
                    <div style={{ fontSize: 11, color: activeChatContact?.isOnline ? s.green : s.muted }}>{activeChatContact?.isOnline ? "Online" : "Offline"}</div>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {chatMsgs.map((msg: any, i: number) => (
                    <div key={i} style={{ display: "flex", flexDirection: msg.fromMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 6 }}>
                      <div style={{ maxWidth: "75%" }}>
                        <div style={{ padding: "8px 12px", borderRadius: msg.fromMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.fromMe ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, color: msg.fromMe ? "#0a0a0a" : "#f0ede8", fontSize: 13, lineHeight: 1.5 }}>{msg.text}</div>
                        <div style={{ fontSize: 10, color: s.muted, marginTop: 2, textAlign: msg.fromMe ? "right" as const : "left" as const }}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "10px 12px", borderTop: \`1px solid \${s.border}\`, display: "flex", gap: 8, flexShrink: 0 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && chatInput.trim()) { const now = new Date(); setChatMsgs((prev: any[]) => [...prev, { id: Date.now(), fromMe: true, text: chatInput, time: now.getHours()+":"+String(now.getMinutes()).padStart(2,"0"), read: false }]); setChatInput(""); } }}
                    placeholder="Scrie un mesaj..." style={{ flex: 1, background: s.surface2, border: \`1px solid \${s.border}\`, borderRadius: 20, padding: "8px 14px", color: "#f0ede8", fontSize: 13, outline: "none", fontFamily: "var(--font-outfit)" }} />
                  <button onClick={() => { if (!chatInput.trim()) return; const now = new Date(); setChatMsgs((prev: any[]) => [...prev, { id: Date.now(), fromMe: true, text: chatInput, time: now.getHours()+":"+String(now.getMinutes()).padStart(2,"0"), read: false }]); setChatInput(""); }}
                    style={{ width: 38, height: 38, borderRadius: "50%", background: chatInput.trim() ? "linear-gradient(135deg,#c9a96e,#a8843d)" : s.surface2, border: "none", color: chatInput.trim() ? "#0a0a0a" : s.muted, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
                </div>
              </div>
            </div>
          )}`;

code = code.substring(0, mesajeIdx) + newChat + code.substring(blockEnd);
fs.writeFileSync('./src/app/dashboard/employee/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/employee/page.tsx').size);