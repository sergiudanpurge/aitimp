'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/employees').then(r => r.json()).then(d => setEmployees(d.employees || []))
  }, [])

  const inviteEmployee = async () => {
    setLoading(true)
    setMsg('')
    setError('')

    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()

    if (res.ok) {
      setMsg(`Invitatie trimisa catre ${form.email}!`)
      setForm({ name: '', email: '' })
      setEmployees([...employees, { name: form.name, email: form.email, emailVerified: false }])
    } else {
      setError(data.error)
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#1a1130', fontFamily: 'sans-serif', color: 'white' }}>
      <nav style={{ background: '#1f1535', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '22px', fontWeight: 900 }}>ai<span style={{ color: '#f97316' }}>timp</span>.ro</div>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', color: '#a0a0a0', border: '1.5px solid rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px' }}>← Dashboard</button>
      </nav>

      <div style={{ padding: '40px 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Echipa mea</h1>
        <p style={{ color: '#a0a0a0', marginBottom: '32px' }}>Invita angajati — primesc email de activare</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>+ Invita angajat nou</div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Nume angajat</label>
              <input placeholder="ex: Marcel Ionescu" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Email angajat</label>
              <input type="email" placeholder="ex: marcel@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {msg && <div style={{ padding: '10px', background: 'rgba(34,197,94,0.15)', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', color: '#86efac' }}>{msg}</div>}
            {error && <div style={{ padding: '10px', background: 'rgba(239,68,68,0.15)', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', color: '#fca5a5' }}>{error}</div>}

            <button onClick={inviteEmployee} disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              {loading ? 'Se trimite...' : '📧 Trimite invitatie'}
            </button>
          </div>

          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Angajati ({employees.length})</div>
            {employees.length === 0 ? (
              <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Nu ai angajati inca.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {employees.map((emp: any, i: number) => (
                  <div key={i} onClick={() => emp.id && router.push(`/dashboard/employees/${emp.id}`)}
                    style={{ background: '#2a1f45', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: emp.id ? 'pointer' : 'default' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#9b6dff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px' }}>
                      {emp.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{emp.name}</div>
                      <div style={{ fontSize: '12px', color: '#a0a0a0' }}>{emp.email}</div>
                    </div>
                    <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '50px', background: emp.emailVerified ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)', color: emp.emailVerified ? '#86efac' : '#fde047' }}>
                      {emp.emailVerified ? 'Activ' : 'Invitatie trimisa'}
                    </div>
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