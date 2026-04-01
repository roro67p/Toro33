import useStore from '../../store/useStore'
import { ShoppingCart, Tag } from 'lucide-react'

const BADGE_COLORS = { populaire: '#E11D48', signature: '#7C3AED', enfants: '#3B82F6', famille: '#F97316', veggie: '#16A34A' }

export default function Formules() {
  const { data, addToCart } = useStore()
  const { formules } = data

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #111827, #0F172A)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#E11D48' }}>Économisez plus</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Formules & Menus</h1>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Des combinaisons malines pour se régaler à prix réduit</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {formules.filter(f => f.available !== false).map(f => {
            const savings = f.originalPrice ? (f.originalPrice - f.price).toFixed(2) : null
            return (
              <div key={f.id} className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                {f.image && (
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-black text-white text-lg">{f.name}</h3>
                    {f.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#FFF1F2', color: BADGE_COLORS[f.badge] || '#E11D48' }}>
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>{f.description}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-black" style={{ color: '#E11D48' }}>{Number(f.price).toFixed(2)}€</div>
                      {f.originalPrice && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm line-through" style={{ color: '#6B7280' }}>{Number(f.originalPrice).toFixed(2)}€</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>-{savings}€</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => addToCart({ cartId: f.id, name: f.name, price: f.price, type: 'formule' })}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#E11D48' }}>
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
