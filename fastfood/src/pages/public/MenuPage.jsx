import { useState } from 'react'
import useStore from '../../store/useStore'
import { ShoppingCart } from 'lucide-react'

const BADGE_COLOR = { populaire: '#E11D48', signature: '#7C3AED', nouveau: '#10B981', épicé: '#F97316', veggie: '#16A34A', 'coup coeur': '#E11D48', mystère: '#6B21A8' }

export default function MenuPage() {
  const { data, addToCart, cart } = useStore()
  const { menuCategories } = data
  const [activecat, setActivecat] = useState(menuCategories[0]?.id)
  const activeCat = menuCategories.find(c => c.id === activecat) || menuCategories[0]

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #111827, #0F172A)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#E11D48' }}>Notre carte</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Menu</h1>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Ingrédients frais, préparés à la commande</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {menuCategories.map(cat => (
            <button key={cat.id} onClick={() => setActivecat(cat.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
              style={{ backgroundColor: activecat === cat.id ? '#E11D48' : '#1F2937', color: activecat === cat.id ? 'white' : '#9CA3AF', border: `1px solid ${activecat === cat.id ? '#E11D48' : '#374151'}` }}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Items */}
        {activeCat && (
          <div className="grid md:grid-cols-2 gap-4">
            {activeCat.items.filter(i => i.available !== false).map(item => {
              const inCart = cart.find(c => c.cartId === item.id)
              return (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl transition-all hover:border-red-800" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                  {item.image && <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-white">{item.name}</h3>
                          {item.badge && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#FFF1F2', color: BADGE_COLOR[item.badge] || '#E11D48' }}>{item.badge}</span>}
                        </div>
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: '#9CA3AF' }}>{item.description}</p>
                        {item.allergens && item.allergens !== '—' && <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Allergènes : {item.allergens}</p>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-lg" style={{ color: '#E11D48' }}>{Number(item.price).toFixed(2)}€</span>
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: '#FFF1F2', color: '#E11D48' }}>x{inCart.quantity}</span>
                          <button onClick={() => addToCart({ cartId: item.id, name: item.name, price: item.price, type: 'menu' })}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: '#E11D48' }}>+ Ajouter</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart({ cartId: item.id, name: item.name, price: item.price, type: 'menu' })}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                          style={{ backgroundColor: '#E11D48' }}>
                          <ShoppingCart size={13} /> Ajouter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
