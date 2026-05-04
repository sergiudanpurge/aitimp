"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PublicProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeEmployee, setActiveEmployee] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/public/${slug}`).then(r => r.json()).then(d => {
      if (!d) { setLoading(false); return; }
      setData(d);
      if (d.employees?.length > 0) setActiveEmployee(d.employees[0]);
      else if (d.services?.length > 0) setActiveEmployee({ services: d.services, name: d.name, avatar: d.avatar, rating: d.rating });
      setLoading(false);
    });
  }, [slug]);

  const days = ["Lun","Mar","Mie","Joi","Vin","Sam","Dum"];
  const dayNums = [5,6,7,8,9,10,11];
  const times30 = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
  const times1h = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
  const occupied = ["10:00","10:30","15:00"];
  const pending = ["11:00"];

  if (loading) return <div style={{ minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",color:"#c9a96e",fontFamily:"var(--font-playfair)",fontSize:"1.2rem" }}>Se incarca...</div>;
  if (!data) return <div style={{ minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",color:"#777" }}>Profilul nu exista.</div>;

  const isCompany = data.accountType === "company";
  const times = selectedService?.duration === 1 ? times30 : times1h;

  return (
    <div style={{ minHeight:"100vh",background:"#0a0a0a",color:"#f0ede8",fontFamily:"var(--font-outfit)" }}>

      <div style={{ height:60,background:"rgba(10,10,10,0.95)",borderBottom:"1px solid #262626",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 32px",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)" }}>
        <Link href="/" style={{ fontFamily:"var(--font-playfair)",fontSize:18,color:"#c9a96e",textDecoration:"none" }}>aitimp.ro</Link>
        <div style={{ display:"flex",gap:10 }}>
          <Link href="/login" style={{ padding:"8px 18px",background:"transparent",border:"1px solid #262626",borderRadius:8,fontSize:13,color:"#777",textDecoration:"none" }}>Intra in cont</Link>
          <Link href="/register" style={{ padding:"8px 18px",background:"linear-gradient(135deg,#c9a96e,#a8843d)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,color:"#0a0a0a",textDecoration:"none" }}>Inregistrare</Link>
        </div>
      </div>

      <div style={{ height:160,background:"linear-gradient(135deg,#1a1408,#2a2010,#1a1408)" }} />

      <div style={{ padding:"0 32px 24px",marginTop:-44,display:"flex",alignItems:"flex-end",gap:20 }}>
        {data.avatar ? (
          <img src={data.avatar} style={{ width:88,height:88,borderRadius:isCompany?"16px":"50%",objectFit:"cover",border:"4px solid #0a0a0a",flexShrink:0 }} />
        ) : (
          <div style={{ width:88,height:88,borderRadius:isCompany?"16px":"50%",background:"linear-gradient(135deg,#c9a96e,#8b5e3c)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-playfair)",fontSize:28,fontWeight:700,color:"#fff",border:"4px solid #0a0a0a",flexShrink:0 }}>
            {data.name?.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase()}
          </div>
        )}
        <div style={{ flex:1,paddingBottom:4 }}>
          <div style={{ fontFamily:"var(--font-playfair)",fontSize:22,fontWeight:700,marginBottom:4 }}>{data.name}</div>
          <div style={{ display:"flex",gap:14,flexWrap:"wrap" }}>
            {data.oras && <span style={{ fontSize:12,color:"#777" }}>📍 {data.oras}{data.judet ? `, ${data.judet}` : ""}</span>}
            {data.cui && <span style={{ fontSize:12,color:"#777" }}>CUI: {data.cui}</span>}
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,paddingBottom:8 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(201,169,110,0.1)",border:"1px solid rgba(201,169,110,0.2)",padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:600,color:"#c9a96e" }}>
            ★ {data.rating || "—"} <span style={{ color:"#777",fontWeight:400 }}>({data.reviewCount || 0} recenzii)</span>
          </div>
        </div>
      </div>

      {isCompany && data.description && (
        <div style={{ padding:"0 32px 20px",borderBottom:"1px solid #262626" }}>
          <div style={{ fontSize:13,color:"#a0a0a0",lineHeight:1.7 }}>{data.description}</div>
        </div>
      )}

      {isCompany && data.employees?.length > 0 && (
        <div style={{ padding:"0 32px",borderBottom:"1px solid #262626",display:"flex",gap:0,overflowX:"auto" }}>
          {data.employees.map((emp: any) => (
            <div key={emp.id} onClick={() => { setActiveEmployee(emp); setSelectedService(null); setSelectedDay(null); setSelectedTime(null); }}
              style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderBottom:`2px solid ${activeEmployee?.id===emp.id?"#c9a96e":"transparent"}`,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,color:activeEmployee?.id===emp.id?"#c9a96e":"#777" }}>
              {emp.avatar ? (
                <img src={emp.avatar} style={{ width:26,height:26,borderRadius:"50%",objectFit:"cover" }} />
              ) : (
                <div style={{ width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#c9a96e,#8b5e3c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff" }}>
                  {emp.name?.charAt(0)}
                </div>
              )}
              <div>
                <div style={{ fontSize:13,fontWeight:500 }}>{emp.name}</div>
                <div style={{ fontSize:11,color:"#c9a96e" }}>★ {emp.rating || "—"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeEmployee && (
        <div style={{ padding:"24px 32px",display:"grid",gridTemplateColumns:"1fr 340px",gap:24,alignItems:"start" }}>
          <div>
            {isCompany && (
              <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:20 }}>
                {activeEmployee.avatar ? (
                  <img src={activeEmployee.avatar} style={{ width:56,height:56,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(201,169,110,0.3)" }} />
                ) : (
                  <div style={{ width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#c9a96e,#8b5e3c)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-playfair)",fontSize:20,fontWeight:700,color:"#fff" }}>
                    {activeEmployee.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <div style={{ fontFamily:"var(--font-playfair)",fontSize:18,fontWeight:700 }}>{activeEmployee.name}</div>
                  <div style={{ fontSize:12,color:"#c9a96e",marginTop:2 }}>★ {activeEmployee.rating || "—"} · {activeEmployee.services?.length || 0} servicii</div>
                </div>
              </div>
            )}

            <div style={{ background:"#161616",border:"1px solid #262626",borderRadius:14,overflow:"hidden",marginBottom:20 }}>
              <div style={{ padding:"14px 18px",borderBottom:"1px solid #262626",fontSize:13,fontWeight:600,color:"#777" }}>Selecteaza un serviciu</div>
              <div style={{ maxHeight:340,overflowY:"auto" }}>
                {(activeEmployee.services || []).map((s: any) => (
                  <div key={s.id} onClick={() => { setSelectedService(s); setSelectedDay(null); setSelectedTime(null); }}
                    style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderBottom:"1px solid #1e1e1e",cursor:"pointer",background:selectedService?.id===s.id?"rgba(201,169,110,0.06)":"transparent",borderLeft:selectedService?.id===s.id?"3px solid #c9a96e":"3px solid transparent" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:600,marginBottom:2 }}>{s.name}</div>
                      <div style={{ fontSize:11,color:"#777" }}>{s.duration * 30} min</div>
                    </div>
                    <div style={{ fontSize:15,fontWeight:700,color:"#c9a96e" }}>{s.price} lei</div>
                  </div>
                ))}
                {(!activeEmployee.services || activeEmployee.services.length === 0) && (
                  <div style={{ padding:"30px 18px",textAlign:"center",color:"#777",fontSize:13 }}>Niciun serviciu disponibil</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {selectedService && selectedDay && selectedTime && (
              <div style={{ background:"rgba(201,169,110,0.06)",border:"1px solid rgba(201,169,110,0.2)",borderRadius:12,padding:"14px 16px" }}>
                <div style={{ fontSize:11,fontWeight:700,color:"#c9a96e",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10 }}>Rezervare selectata</div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5 }}><span style={{ color:"#777" }}>Serviciu</span><span style={{ fontWeight:600 }}>{selectedService.name}</span></div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5 }}><span style={{ color:"#777" }}>Data</span><span style={{ fontWeight:600 }}>Mai {selectedDay}</span></div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5 }}><span style={{ color:"#777" }}>Ora</span><span style={{ fontWeight:600 }}>{selectedTime}</span></div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:14 }}><span style={{ color:"#777" }}>Pret</span><span style={{ fontWeight:700,color:"#c9a96e" }}>{selectedService.price} lei</span></div>
                <button style={{ width:"100%",padding:12,background:"linear-gradient(135deg,#c9a96e,#a8843d)",color:"#0a0a0a",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"var(--font-outfit)" }}>Rezerva acum</button>
              </div>
            )}

            {selectedService && (
              <div style={{ background:"#161616",border:"1px solid #262626",borderRadius:14,padding:16 }}>
                <div style={{ fontSize:13,fontWeight:600,color:"#c9a96e",marginBottom:12 }}>Alege ziua — Mai 2025</div>
                <div style={{ display:"flex",gap:6,marginBottom:12 }}>
                  {days.map((d, i) => (
                    <div key={d} onClick={() => { if (i < 5) { setSelectedDay(String(dayNums[i])); setSelectedTime(null); } }}
                      style={{ flex:1,textAlign:"center",padding:"8px 4px",borderRadius:7,cursor:i>=5?"not-allowed":"pointer",border:`1px solid ${selectedDay===String(dayNums[i])?"#c9a96e":"transparent"}`,background:selectedDay===String(dayNums[i])?"rgba(201,169,110,0.12)":"transparent",opacity:i>=5?0.25:1 }}>
                      <div style={{ fontSize:9,color:selectedDay===String(dayNums[i])?"#c9a96e":"#777",marginBottom:3 }}>{d}</div>
                      <div style={{ fontSize:13,fontWeight:600,color:selectedDay===String(dayNums[i])?"#c9a96e":"#f0ede8" }}>{dayNums[i]}</div>
                    </div>
                  ))}
                </div>
                {selectedDay && (
                  <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                    {times.map(t => {
                      const isOcc = occupied.includes(t);
                      const isPend = pending.includes(t);
                      const isSel = selectedTime === t;
                      return (
                        <div key={t} onClick={() => !isOcc && !isPend && setSelectedTime(t)}
                          style={{ padding:"6px 10px",borderRadius:6,fontSize:11,fontWeight:600,cursor:isOcc||isPend?"not-allowed":"pointer",border:"1px solid",textDecoration:isOcc?"line-through":"none",
                            background:isSel?"rgba(201,169,110,0.2)":isOcc?"#161616":isPend?"rgba(232,184,75,0.08)":"rgba(76,175,130,0.08)",
                            borderColor:isSel?"#c9a96e":isOcc?"#1e1e1e":isPend?"rgba(232,184,75,0.3)":"rgba(76,175,130,0.3)",
                            color:isSel?"#c9a96e":isOcc?"#444":isPend?"#e8b84b":"#4caf82"
                          }}>
                          {t}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!selectedService && (
              <div style={{ background:"#161616",border:"1px solid #262626",borderRadius:14,padding:20 }}>
                <div style={{ fontSize:13,color:"#777",marginBottom:14 }}>Selecteaza un serviciu pentru a face o rezervare</div>
                <button style={{ width:"100%",padding:12,background:"linear-gradient(135deg,#c9a96e,#a8843d)",color:"#0a0a0a",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"var(--font-outfit)",marginBottom:8 }}>Fa o rezervare</button>
                <button style={{ width:"100%",padding:11,background:"transparent",color:"#c9a96e",border:"1px solid rgba(201,169,110,0.3)",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--font-outfit)" }}>Trimite mesaj</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ padding:"24px 32px",borderTop:"1px solid #262626" }}>
        <div style={{ fontFamily:"var(--font-playfair)",fontSize:18,fontWeight:700,marginBottom:20 }}>
          Recenzii {isCompany && activeEmployee ? activeEmployee.name : data.name}
        </div>
        <div style={{ textAlign:"center",padding:"40px 0",color:"#777",fontSize:13 }}>Nicio recenzie inca.</div>
      </div>

    </div>
  );
}