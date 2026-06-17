import useStore from '../../store/useStore'
import { ShoppingCart } from 'lucide-react'

const BADGE_COLORS = {
  populaire: '#E11D48', signature: '#7C3AED', enfants: '#3B82F6',
  famille: '#F59E0B', veggie: '#16A34A', épicé: '#DC2626',
  légendaire: '#92400E', mystère: '#6B21A8',
}

export default function Formules() {
  const { data, addToCart } = useStore()
  const { formules } = data
  const available = formules.filter(f => f.available !== false)

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '56px 20px 40px', background: 'linear-gradient(135deg, #111827, #0F172A)' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#E11D48', marginBottom: '10px', textTransform: 'uppercase' }}>Économisez plus</p>
        <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'white', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Formules & Menus</h1>
        <p style={{ fontSize: '15px', color: '#9CA3AF', margin: 0 }}>Combos malins — jusqu'à 7€ d'économies</p>
      </div>

      {/* Grille formules */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {available.map(f => {
            const savings = f.originalPrice ? (f.originalPrice - f.price).toFixed(2) : null
            const pct = f.originalPrice ? Math.round((1 - f.price / f.originalPrice) * 100) : null
            const color = f.color || BADGE_COLORS[f.badge] || '#E11D48'

            return (
              <div key={f.id} style={{
                backgroundColor: '#1F2937', borderRadius: '20px',
                border: `1px solid #374151`, overflow: 'hidden',
                transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'translateY(0)' }}>

                {/* Image avec overlay */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  {f.image && <img src={f.image} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, #1F2937 0%, transparent 60%)` }} />

                  {/* Badge */}
                  {f.badge && (
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      padding: '3px 10px', borderRadius: '999px',
                      backgroundColor: color, color: 'white',
                      fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{f.badge}</div>
                  )}

                  {/* % économie */}
                  {pct && (
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      width: '44px', height: '44px', borderRadius: '50%',
                      backgroundColor: '#10B981', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 900,
                    }}>-{pct}%</div>
                  )}
                </div>

                {/* Contenu */}
                <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: '0 0 6px' }}>{f.name}</h3>
                  <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 14px', lineHeight: 1.5 }}>{f.description}</p>

                  {/* Ce que ça inclut */}
                  {f.includes && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {f.includes.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '4px 10px', borderRadius: '8px',
                          backgroundColor: '#111827', border: '1px solid #374151',
                        }}>
                          {f.icons?.[i] && <span style={{ fontSize: '14px' }}>{f.icons[i]}</span>}
                          <span style={{ fontSize: '11px', color: '#D1D5DB', fontWeight: 600 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Prix + bouton */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '30px', fontWeight: 900, color, lineHeight: 1 }}>{Number(f.price).toFixed(2)}€</div>
                      {f.originalPrice && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#6B7280' }}>{Number(f.originalPrice).toFixed(2)}€</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', backgroundColor: '#064E3B', color: '#10B981' }}>-{savings}€</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart({ cartId: `${f.id}_${Date.now()}`, name: f.name, price: f.price, type: 'formule' })}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '10px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                        backgroundColor: color, color: 'white', fontSize: '13px', fontWeight: 700,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                      <ShoppingCart size={15} /> Commander
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
