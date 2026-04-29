'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const TABS = ['prezentare', 'profil', 'angajati', 'calendar', 'rezervari', 'servicii', 'notificari', 'setari']

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('prezentare')
  const [employees, setEmployees] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.error) router.push('/login')
      else setUser(d.user)
    })
    fetch('/api/employees').then(r => r.json()).then(d => setEmployees(d.employees || []))
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.bookings || []))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (!user) return (
    <main style={{ minHeight: '100vh', background: '#1a1130', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <div>Se incarca...</div>
    </main>
  )

  const isCompany = user.accountType === 'company'

  return (
    <main style={{ minHeight: '100vh', background: '#1a1130', fontFamily: 'sans-serif', color: 'white', display: 'grid', gridTemplateColumns: '220px 1fr' }}>
      
      {/* SIDEBAR */}
      <div style={{ background: '#1f1535', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: '#2a1f45', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#9b6dff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
            {user.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: '#a0a0a0' }}>{isCompany ? '🏢 Companie' : '👤 Privat'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {[
            { id: 'prezentare', label: 'Prezentare' },
            { id: 'profil', label: 'Profil' },
            ...(isCompany ? [{ id: 'angajati', label: 'Echipa' }] : []),
            { id: 'calendar', label: 'Calendar' },
            { id: 'rezervari', label: 'Rezervari' },
            { id: 'servicii', label: 'Servicii' },
            { id: 'notificari', label: 'Notificari' },
            { id: 'setari', label: 'Setari' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, textAlign: 'left', width: '100%', background: activeTab === tab.id ? 'rgba(155,109,255,0.15)' : 'transparent', color: activeTab === tab.id ? '#9b6dff' : '#a0a0a0', transition: 'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        <button onClick={logout} style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#a0a0a0', cursor: 'pointer', fontSize: '14px', marginTop: '16px' }}>
          Iesi din cont
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '32px', background: '#1a1130', overflowY: 'auto' }}>

        {/* PREZENTARE */}
        {activeTab === 'prezentare' && (
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Buna, {user.name}! 👋</div>
            <div style={{ color: '#a0a0a0', marginBottom: '28px', fontSize: '15px' }}>Iata un sumar al activitatii tale</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Rezervari active', val: bookings.filter(b => b.status === 'accepted').length },
                { label: 'In asteptare', val: bookings.filter(b => b.status === 'pending').length },
                { label: 'Angajati', val: employees.length },
              ].map(m => (
                <div key={m.label} style={{ background: '#1f1535', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#9b6dff' }}>{m.val}</div>
                  <div style={{ fontSize: '13px', color: '#a0a0a0', marginTop: '4px' }}>{m.label}</div>
                </div>
              ))}
            </div>

            {isCompany && employees.length > 0 && (
              <div style={{ background: '#1f1535', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Echipa ta</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {employees.map((emp: any) => (
                    <div key={emp.id} onClick={() => router.push(`/dashboard/employees/${emp.id}`)}
                      style={{ background: '#2a1f45', borderRadius: '10px', padding: '14px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#9b6dff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, margin: '0 auto 8px', fontSize: '16px' }}>
                        {emp.name?.charAt(0)}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{emp.name}</div>
                      <div style={{ fontSize: '12px', color: emp.isActive === false ? '#fca5a5' : '#86efac', marginTop: '4px' }}>
                        {emp.isActive === false ? 'Dezactivat' : 'Activ'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: '#1f1535', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Rezervari recente</div>
              {bookings.length === 0 ? (
                <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Nu ai rezervari inca.</div>
              ) : (
                bookings.slice(0, 5).map((b: any) => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#2a1f45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                      {b.provider?.user?.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{b.service?.name}</div>
                      <div style={{ fontSize: '12px', color: '#a0a0a0' }}>{b.date} • {b.time}</div>
                    </div>
                    <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '50px', background: b.status === 'pending' ? 'rgba(234,179,8,0.15)' : b.status === 'accepted' ? 'rgba(34,197,94,0.15)' : 'rgba(155,109,255,0.15)', color: b.status === 'pending' ? '#fde047' : b.status === 'accepted' ? '#86efac' : '#c4b5fd' }}>
                      {b.status === 'pending' ? 'In asteptare' : b.status === 'accepted' ? 'Acceptata' : 'Completata'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PROFIL */}
        {activeTab === 'profil' && (
          <ProfileTab user={user} isCompany={isCompany} />
        )}

        {/* ANGAJATI */}
        {activeTab === 'angajati' && isCompany && (
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>Echipa mea</div>
            <button onClick={() => router.push('/dashboard/employees')}
              style={{ padding: '12px 24px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginBottom: '20px' }}>
              Gestioneaza echipa →
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {employees.map((emp: any) => (
                <div key={emp.id} onClick={() => router.push(`/dashboard/employees/${emp.id}`)}
                  style={{ background: '#1f1535', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#9b6dff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, margin: '0 auto 12px', fontSize: '20px' }}>
                    {emp.name?.charAt(0)}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{emp.name}</div>
                  <div style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>{emp.email}</div>
                  <div style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '50px', display: 'inline-block', background: emp.isActive === false ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: emp.isActive === false ? '#fca5a5' : '#86efac' }}>
                    {emp.isActive === false ? 'Dezactivat' : 'Activ'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALENDAR */}
        {activeTab === 'calendar' && (
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>Calendar</div>
            <button onClick={() => router.push('/dashboard/calendar')}
              style={{ padding: '12px 24px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Deschide calendarul complet →
            </button>
          </div>
        )}

        {/* REZERVARI */}
        {activeTab === 'rezervari' && (
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>Rezervari</div>
            <button onClick={() => router.push('/dashboard/bookings')}
              style={{ padding: '12px 24px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Gestioneaza rezervarile →
            </button>
          </div>
        )}

        {/* SERVICII */}
        {activeTab === 'servicii' && (
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>Servicii</div>
            <button onClick={() => router.push('/dashboard/services')}
              style={{ padding: '12px 24px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Gestioneaza serviciile →
            </button>
          </div>
        )}

        {/* NOTIFICARI */}
        {activeTab === 'notificari' && (
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>Notificari</div>
            <div style={{ background: '#1f1535', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#a0a0a0', fontSize: '14px' }}>Nu ai notificari noi.</div>
            </div>
          </div>
        )}

        {/* SETARI */}
        {activeTab === 'setari' && (
          <SettingsTab user={user} />
        )}

      </div>
    </main>
  )
}

function ProfileTab({ user, isCompany }: any) {
  const [form, setForm] = useState({ name: user.name || '', phone: user.phone || '', city: user.city || '', cui: user.cui || '', description: '' })
  const [msg, setMsg] = useState('')

  const save = async () => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) { setMsg('Profil salvat!'); setTimeout(() => setMsg(''), 3000) }
  }

  return (
    <div>
      <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>Profilul meu</div>
      <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>{isCompany ? 'Denumire companie' : 'Nume'}</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {isCompany && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>CUI</label>
            <input placeholder="ex: RO12345678" value={form.cui} onChange={e => setForm({ ...form, cui: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Telefon</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Oras</label>
            <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>Descriere</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
        </div>
        {msg && <div style={{ padding: '10px', background: 'rgba(34,197,94,0.15)', borderRadius: '8px', color: '#86efac', fontSize: '13px', marginBottom: '14px' }}>{msg}</div>}
        <button onClick={save} style={{ padding: '12px 28px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
          Salveaza profilul
        </button>
      </div>
    </div>
  )
}

function SettingsTab({ user }: any) {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) { setError('Parolele nu coincid'); return }
    if (passwords.new.length < 6) { setError('Parola trebuie sa aiba minim 6 caractere'); return }
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
    })
    const data = await res.json()
    if (res.ok) { setMsg('Parola schimbata!'); setPasswords({ current: '', new: '', confirm: '' }); setError('') }
    else setError(data.error)
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div>
      <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>Setari cont</div>
      <div style={{ background: '#1f1535', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Schimba parola</div>
        {['current', 'new', 'confirm'].map((field, i) => (
          <div key={field} style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', color: '#a0a0a0', display: 'block', marginBottom: '6px' }}>
              {field === 'current' ? 'Parola curenta' : field === 'new' ? 'Parola noua' : 'Confirma parola noua'}
            </label>
            <input type="password" value={(passwords as any)[field]} onChange={e => setPasswords({ ...passwords, [field]: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: '#2a1f45', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}
        {error && <div style={{ padding: '10px', background: 'rgba(239,68,68,0.15)', borderRadius: '8px', color: '#fca5a5', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}
        {msg && <div style={{ padding: '10px', background: 'rgba(34,197,94,0.15)', borderRadius: '8px', color: '#86efac', fontSize: '13px', marginBottom: '14px' }}>{msg}</div>}
        <button onClick={changePassword} style={{ padding: '12px 28px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
          Schimba parola
        </button>
      </div>
    </div>
  )
}