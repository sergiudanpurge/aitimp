'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

const DAYS = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica']

export default function EmployeeProfile() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [employee, setEmployee] = useState<any>(null)
  const [schedule, setSchedule] = useState<any>({
    Luni: { active: true, start: '09:00', end: '18:00' },
    Marti: { active: true, start: '09:00', end: '18:00' },
    Miercuri: { active: true, start: '09:00', end: '18:00' },
    Joi: { active: true, start: '09:00', end: '18:00' },
    Vineri: { active: true, start: '09:00', end: '18:00' },
    Sambata: { active: false, start: '09:00', end: '18:00' },
    Duminica: { active: false, start: '09:00', end: '18:00' },
  })
  const [services, setServices] = useState<any[]>([])
  const [newService, setNewService] = useState({ name: '', duration: '', price: '' })
  const [activeTab, setActiveTab] = useState('program')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/employees/${id}`).then(r => r.json()).then(d => {
      setEmployee(d.employee)
      if (d.services) setServices(d.services)
    })
  }, [id])

  const saveSchedule = async () => {
    setMsg('Program salvat!')
    setTimeout(() => setMsg(''), 3000)
  }

  const addService = async () => {
    if (!newService.name || !newService.duration || !newService.price) return
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newService, employeeId: id })
    })
    const data = await res.json()
    if (res.ok) {
      setServices([...services, data.service])
      setNewService({ name: '', duration: '', price: '' })
      setMsg('Serviciu adaugat!')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const durLabels: any = { '1': '30 min', '2': '1 ora', '3': '1.5 ore', '4': '2 ore', '6': '3 ore', '8': '4 ore' }

  if (!employee) return (
    <main style={{ minHeight: '100vh', background: '#1a1130', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <div>Se incarca...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#1a1130', fontFamily: 'sans-serif', color: 'white' }}>
      <nav style={{ background: '#1f1535', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '22px', fontWeight: 900 }}>ai<span style={{ color: '#f97316' }}>timp</span>.ro</div>
        <button onClick={() => router.push('/dashboard/employees')} style={{ background: 'transparent', color: '#a0a0a0', border: '1.5px solid rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px' }}>← Echipa</button>
      </nav>

      <div style={{ padding: '40px 2rem', maxWidth: '900px', margin: '0 auto' }}>

        {/* HEADER ANGAJAT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#9b6dff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700 }}>
            {employee.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>{employee.name}</div>
            <div style={{ fontSize: '14px', color: '#a0a0a0' }}>{employee.email}</div>
          </div>
          <div style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '50px', background: employee.emailVerified ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)', color: employee.emailVerified ? '#86efac' : '#fde047', fontSize: '13px' }}>
            {employee.emailVerified ? '✓ Activ' : '⏳ Invitatie trimisa'}
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['program', 'servicii', 'calendar', 'rezervari'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 20px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, background: activeTab === tab ? '#9b6dff' : '#1f1535', color: activeTab === tab ? 'white' : '#a0a0a0' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {msg && <div style={{ padding: '10px 16px', background: 'rgba(34,197,94,0.15)', borderRadius: '8px', color: '#86efac', fontSize: '13px', marginBottom: '16px' }}>{msg}</div>}

        {/* TAB: PROGRAM */}
        {activeTab === 'program' && (
          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Program de lucru</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {DAYS.map(day => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', background: '#2a1f45', borderRadius: '10px' }}>
                  <input type="checkbox" checked={schedule[day].active}
                    onChange={e => setSchedule({ ...schedule, [day]: { ...schedule[day], active: e.target.checked } })}
                    style={{ width: '18px', height: '18px', accentColor: '#9b6dff', cursor: 'pointer' }} />
                  <div style={{ width: '80px', fontSize: '14px', color: schedule[day].active ? 'white' : '#a0a0a0' }}>{day}</div>
                  {schedule[day].active ? (
                    <>
                      <input type="time" value={schedule[day].start}
                        onChange={e => setSchedule({ ...schedule, [day]: { ...schedule[day], start: e.target.value } })}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: '#1f1535', color: 'white', fontSize: '14px' }} />
                      <span style={{ color: '#a0a0a0' }}>—</span>
                      <input type="time" value={schedule[day].end}
                        onChange={e => setSchedule({ ...schedule, [day]: { ...schedule[day], end: e.target.value } })}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: '#1f1535', color: 'white', fontSize: '14px' }} />
                      <span style={{ fontSize: '12px', color: '#a0a0a0', marginLeft: 'auto' }}>
                        {Math.round((parseInt(schedule[day].end) - parseInt(schedule[day].start)) * 2)} sloturi
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#a0a0a0' }}>Zi libera</span>
                  )}
                </div>
              ))}
            </div>
            <button onClick={saveSchedule} style={{ marginTop: '20px', padding: '12px 28px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Salveaza programul
            </button>
          </div>
        )}

        {/* TAB: SERVICII */}
        {activeTab === 'servicii' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>+ Adauga serviciu</div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Nume serviciu</label>
                <input placeholder="ex: Tuns, Masaj..." value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Durata</label>
                <select value={newService.duration} onChange={e => setNewService({ ...newService, duration: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none' }}>
                  <option value="">Selecteaza...</option>
                  <option value="1">30 minute</option>
                  <option value="2">1 ora</option>
                  <option value="3">1.5 ore</option>
                  <option value="4">2 ore</option>
                  <option value="6">3 ore</option>
                  <option value="8">4 ore</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Pret (RON)</label>
                <input type="number" placeholder="ex: 50" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button onClick={addService} style={{ width: '100%', padding: '12px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                Salveaza serviciul
              </button>
            </div>

            <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Servicii ({services.length})</div>
              {services.length === 0 ? (
                <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Niciun serviciu inca.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {services.map((s: any, i: number) => (
                    <div key={i} style={{ background: '#2a1f45', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '3px' }}>{durLabels[s.duration] || s.duration + ' sloturi'}</div>
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#9b6dff' }}>{s.price} RON</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CALENDAR */}
        {activeTab === 'calendar' && (
          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Calendar rezervari</div>
            <div style={{ color: '#a0a0a0', fontSize: '14px' }}>In curand — calendar cu sloturi de 30 min 🚀</div>
          </div>
        )}

        {/* TAB: REZERVARI */}
        {activeTab === 'rezervari' && (
          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Rezervari</div>
            <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Nicio rezervare inca.</div>
          </div>
        )}

      </div>
    </main>
  )
}