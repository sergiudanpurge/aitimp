'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [accountType, setAccountType] = useState('private')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (isRegister) {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, accountType })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }

    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#1a1130', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#1f1535', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'white' }}>ai<span style={{ color: '#f97316' }}>timp</span>.ro</div>
          <div style={{ color: '#a0a0a0', fontSize: '14px', marginTop: '6px' }}>
            {isRegister ? 'Creează un cont nou' : 'Intră în contul tău'}
          </div>
        </div>

        <div style={{ display: 'flex', background: '#2a1f45', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
          <button onClick={() => setIsRegister(false)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, background: !isRegister ? '#3a2f55' : 'transparent', color: !isRegister ? '#9b6dff' : '#a0a0a0' }}>
            Autentificare
          </button>
          <button onClick={() => setIsRegister(true)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, background: isRegister ? '#3a2f55' : 'transparent', color: isRegister ? '#9b6dff' : '#a0a0a0' }}>
            Înregistrare
          </button>
        </div>

        {isRegister && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button onClick={() => setAccountType('private')} style={{ flex: 1, padding: '10px', border: `1.5px solid ${accountType === 'private' ? '#9b6dff' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', background: accountType === 'private' ? 'rgba(155,109,255,0.1)' : 'transparent', color: accountType === 'private' ? '#9b6dff' : '#a0a0a0', cursor: 'pointer', fontSize: '13px' }}>
                👤 Persoană fizică
              </button>
              <button onClick={() => setAccountType('company')} style={{ flex: 1, padding: '10px', border: `1.5px solid ${accountType === 'company' ? '#9b6dff' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', background: accountType === 'company' ? 'rgba(155,109,255,0.1)' : 'transparent', color: accountType === 'company' ? '#9b6dff' : '#a0a0a0', cursor: 'pointer', fontSize: '13px' }}>
                🏢 Companie
              </button>
            </div>
            <input placeholder="Nume complet / Firmă" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />
          </>
        )}

        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />

        <input type="password" placeholder="Parolă" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' }} />

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#fca5a5', fontSize: '13px', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: '14px', background: loading ? '#555' : '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Se procesează...' : isRegister ? 'Creează cont' : 'Intră în cont'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#a0a0a0', fontSize: '13px', textDecoration: 'none' }}>← Înapoi la homepage</a>
        </div>
      </div>
    </main>
  )
}