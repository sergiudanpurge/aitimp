'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ActivatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) router.push('/login')
  }, [token])

  const handleActivate = async () => {
    if (!password || password.length < 6) {
      setError('Parola trebuie sa aiba minim 6 caractere')
      return
    }
    if (password !== confirm) {
      setError('Parolele nu coincid')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login'), 3000)
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#1a1130', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#1f1535', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'white' }}>ai<span style={{ color: '#f97316' }}>timp</span>.ro</div>
          <div style={{ color: '#a0a0a0', fontSize: '14px', marginTop: '6px' }}>Activeaza-ti contul</div>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Cont activat!</div>
            <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Te redirectionam catre login...</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Parola noua</label>
              <input type="password" placeholder="Minim 6 caractere" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Confirma parola</label>
              <input type="password" placeholder="Repeta parola" value={confirm} onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleActivate()}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#fca5a5', fontSize: '13px', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <button onClick={handleActivate} disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? '#555' : '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Se activeaza...' : 'Activeaza contul'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}