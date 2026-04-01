import useStore from '../../store/useStore'
import { ShoppingCart } from 'lucide-react'

export default function Drinks() {
  const { data, addToCart } = useStore()
  const { drinkCategories } = data

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #111827, #0F172A)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#E11D48' }}>Nos boissons</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Boissons</h1>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Sodas, milkshakes, jus frais et plus</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-10">
        {drinkCategories.map(cat => (
          <div key={cat.id}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{cat.icon}</span>
              <h2 className="text-xl font-black text-white">{cat.name}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {cat.items.filter(i => i.available !== false).map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                  {item.image && <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{item.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-3">
                        {item.priceSm && <div className="text-center"><div className="text-xs" style={{ color: '#6B7280' }}>S</div><div className="font-bold text-sm" style={{ color: '#E11D48' }}>{item.priceSm}€</div></div>}
                        {item.priceMd && <div className="text-center"><div className="text-xs" style={{ color: '#6B7280' }}>M</div><div className="font-bold text-sm" style={{ color: '#E11D48' }}>{item.priceMd}€</div></div>}
                        {item.priceLg && <div className="text-center"><div className="text-xs" style={{ color: '#6B7280' }}>L</div><div className="font-bold text-sm" style={{ color: '#E11D48' }}>{item.priceLg}€</div></div>}
                      </div>
                      <button onClick={() => addToCart({ cartId: item.id, name: item.name, price: item.priceSm, type: 'drink' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: '#E11D48' }}>
                        <ShoppingCart size={12} /> Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
