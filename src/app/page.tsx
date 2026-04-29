export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#1a1130', minHeight: '100vh', color: 'white' }}>

      {/* NAV */}
      <nav style={{ background: '#1f1535', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: '22px', fontWeight: 900 }}>ai<span style={{ color: '#f97316' }}>timp</span>.ro</div>
       <div style={{ display: 'flex', gap: '12px' }}>
  <a href="/login" style={{ textDecoration: 'none' }}><button style={{ background: 'transparent', color: '#a0a0a0', border: '1.5px solid rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px' }}>Login</button></a>
  <a href="/login" style={{ textDecoration: 'none' }}><button style={{ background: '#9b6dff', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Înregistrare</button></a>
</div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a0a3e 0%, #2d0e6b 50%, #1a0a3e 100%)', padding: '80px 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(249,115,22,0.2)', color: '#fb923c', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', marginBottom: '24px', border: '1px solid rgba(249,115,22,0.3)' }}>
            🇷🇴 Platforma nr. 1 din România
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1.5px' }}>
            N-ai timp?<br />Găsește pe<br />cineva care <span style={{ color: '#f97316' }}>are.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', marginBottom: '36px', lineHeight: 1.6 }}>
            Conectăm oamenii cu furnizori verificați de servicii. Rapid, sigur, simplu.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ background: '#f97316', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '50px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Găsește servicii</button>
            <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)', padding: '14px 28px', borderRadius: '50px', fontSize: '16px', cursor: 'pointer' }}>Oferă servicii</button>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 700 }}>Intră în cont</div>
          <input placeholder="Email" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Parolă" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box' }} />
          <button style={{ width: '100%', padding: '14px', background: '#9b6dff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Intră în cont</button>
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Nu ai cont? <a href="/login" style={{ color: '#9b6dff', cursor: 'pointer', textDecoration: 'none' }}>Înregistrează-te</a></div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#1f1535', padding: '40px 2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { num: '2,400+', label: 'Furnizori activi' },
          { num: '18,000+', label: 'Rezervări completate' },
          { num: '4.9/5', label: 'Rating mediu' },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#9b6dff' }}>{s.num}</div>
            <div style={{ fontSize: '14px', color: '#a0a0a0', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* CATEGORII */}
      <section style={{ padding: '60px 2rem' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Categorii de servicii</h2>
        <p style={{ color: '#a0a0a0', marginBottom: '36px' }}>Alege din sute de servicii disponibile în orașul tău</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { icon: '🧹', name: 'Curățenie', count: '340 furnizori' },
            { icon: '🔧', name: 'Reparații', count: '220 furnizori' },
            { icon: '🚗', name: 'Transport', count: '185 furnizori' },
            { icon: '💻', name: 'IT & Tech', count: '140 furnizori' },
            { icon: '💆', name: 'Beauty & Wellness', count: '290 furnizori' },
            { icon: '🌿', name: 'Grădinărit', count: '98 furnizori' },
            { icon: '📦', name: 'Mutări', count: '67 furnizori' },
            { icon: '✏️', name: 'Meditații', count: '155 furnizori' },
          ].map((c) => (
            <div key={c.name} style={{ background: '#1f1535', borderRadius: '14px', padding: '24px 20px', border: '1.5px solid rgba(255,255,255,0.08)', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{c.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{c.name}</div>
              <div style={{ fontSize: '13px', color: '#a0a0a0' }}>{c.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CUM FUNCTIONEAZA */}
      <section style={{ padding: '60px 2rem', background: '#1f1535' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Cum funcționează</h2>
        <p style={{ color: '#a0a0a0', marginBottom: '36px' }}>3 pași simpli până la serviciul perfect</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: '🔍', title: 'Caută', desc: 'Filtrează după oraș, categorie, preț și disponibilitate.' },
            { icon: '📅', title: 'Rezervă', desc: 'Alege ora și serviciul dorit. Sistem de sloturi de 30 minute.' },
            { icon: '✅', title: 'Bucură-te', desc: 'Furnizorul ajunge la tine. Plătești și lași un review.' },
          ].map((s) => (
            <div key={s.title} style={{ background: '#2a1f45', borderRadius: '14px', padding: '32px 24px', border: '1.5px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{s.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{s.title}</div>
              <div style={{ fontSize: '14px', color: '#a0a0a0', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0f0a1e', padding: '32px 2rem', textAlign: 'center', color: '#a0a0a0', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        © 2025 aitimp.ro — Toate drepturile rezervate • Made with ♥ in România
      </footer>

    </main>
  )
}