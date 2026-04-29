'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', duration: '', price: '', employeeId: '' })
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(d => setServices(d.services || []))
    fetch('/api/employees').then(r => r.json()).then(d => setEmployees(d.employees || []))
  }, [])

  const addService = async () => {
    setLoading(true)
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      setMsg('Serviciu adaugat!')
      setServices([...services, data.service])
      setForm({ name: '', duration: '', price: '', employeeId: '' })
    } else {
      setMsg(data.error)
    }
    setLoading(false)
  }

  const durLabels: any = { '1': '30 min', '2': '1 ora', '3': '1.5 ore', '4': '2 ore', '6': '3 ore', '8': '4 ore' }

  return (
    <main style={{ minHeight: '100vh', background: '#1a1130', fontFamily: 'sans-serif', color: 'white' }}>
      <nav style={{ background: '#1f1535', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '22px', fontWeight: 900 }}>ai<span style={{ color: '#f97316' }}>timp</span>.ro</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', color: '#a0a0a0', border: '1.5px solid rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px' }}>← Dashboard</button>
        </div>
      </nav>

      <div style={{ padding: '40px 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Serviciile mele</h1>
        <p style={{ color: '#a0a0a0', marginBottom: '32px' }}>Adauga servicii cu durata si pret</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* ADAUGA SERVICIU */}
          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>+ Adauga serviciu nou</div>

            {employees.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Angajat (optional)</label>
                <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none' }}>
                  <option value="">Selecteaza angajat...</option>
                  {employees.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Nume serviciu</label>
              <input placeholder="ex: Tuns, Curatenie, Masaj..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Durata</label>
              <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none' }}>
                <option value="">Selecteaza durata...</option>
                <option value="1">30 minute — 1 slot</option>
                <option value="2">1 ora — 2 sloturi</option>
                <option value="3">1.5 ore — 3 sloturi</option>
                <option value="4">2 ore — 4 sloturi</option>
                <option value="6">3 ore — 6 sloturi</option>
                <option value="8">4 ore — 8 sloturi</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Pret (RON)</label>
              <input type="number" placeholder="ex: 80" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {msg && <div style={{ padding: '10px', background: 'rgba(155,109,255,0.15)', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', color: '#c4b5fd' }}>{msg}</div>}

            <button onClick={addService} disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              {loading ? 'Se salveaza...' : 'Salveaza serviciul'}
            </button>
          </div>

          {/* LISTA SERVICII */}
          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Servicii active ({services.length})</div>
            {services.length === 0 ? (
              <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Nu ai servicii inca. Adauga primul serviciu!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {services.map((s: any) => (
                  <div key={s.id} style={{ background: '#2a1f45', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '3px' }}>{durLabels[s.duration] || s.duration + ' sloturi'}</div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#9b6dff' }}>{s.price} RON</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}