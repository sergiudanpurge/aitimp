'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.error) router.push('/login')
        else setUser(data.user)
      })
  }, [])

  if (!user) return (
    <main style={{ minHeight: '100vh', background: '#1a1130', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <div>Se încarcă...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#1a1130', fontFamily: 'sans-serif', color: 'white' }}>
      <nav style={{ background: '#1f1535', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '22px', fontWeight: 900 }}>ai<span style={{ color: '#f97316' }}>timp</span>.ro</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#a0a0a0', fontSize: '14px' }}>Bună, {user.name}! 👋</span>
          <button onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/')
          }} style={{ background: 'transparent', color: '#a0a0a0', border: '1.5px solid rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px' }}>
            Ieși din cont
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px 2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: '#a0a0a0', marginBottom: '32px' }}>Bine ai venit pe Aitimp.ro, {user.name}!</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Rezervări active', val: '0' },
            { label: 'Mesaje noi', val: '0' },
            { label: 'Recenzii', val: '0' },
          ].map(m => (
            <div key={m.label} style={{ background: '#1f1535', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#9b6dff' }}>{m.val}</div>
              <div style={{ fontSize: '13px', color: '#a0a0a0', marginTop: '4px' }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📋 Rezervările mele</div>
            <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Nu ai rezervări încă.</div>
            <button onClick={() => router.push('/')} style={{ marginTop: '16px', background: '#f97316', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              Găsește servicii
            </button>
          </div>
          <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>💬 Mesaje</div>
            <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Nu ai mesaje încă.</div>
          </div>
        </div>
      </div>
    </main>
  )
}