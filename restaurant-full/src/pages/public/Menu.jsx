import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Check } from 'lucide-react'

export default function Menu() {
  const { data, cart, addToCart } = useStore()
  const { menuCategories } = data
  const [activeTab, setActiveTab] = useState(menuCategories[0]?.id || '')
  const [added, setAdded] = useState({})

  const activeCategory = menuCategories.find(c => c.id === activeTab) || menuCategories[0]

  const handleAdd = (item) => {
    const cartId = `menu_${item.id}`
    addToCart({ cartId, itemId: item.id, name: item.name, price: item.price, priceType: 'single', category: 'menu', note: '' })
    setAdded(a => ({ ...a, [item.id]: true }))
    setTimeout(() => setAdded(a => ({ ...a, [item.id]: false })), 1200)
  }

  const cartQty = (itemId) => {
    const entry = cart.find(c => c.cartId === `menu_${itemId}`)
    return entry ? entry.quantity : 0
  }

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
          À la carte
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
          Notre Menu
        </h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#A8A29E' }}>
          Une cuisine française authentique, élaborée à partir des meilleurs produits de saison.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-16 z-10 shadow-sm" style={{ backgroundColor: '#FEF3C7' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: 'none' }}>
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  backgroundColor: activeTab === cat.id ? '#D97706' : 'white',
                  color: activeTab === cat.id ? 'white' : '#78716C',
                  boxShadow: activeTab === cat.id ? '0 4px 14px rgba(217,119,6,0.3)' : 'none'
                }}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items */}
      {activeCategory && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
              <span className="text-3xl">{activeCategory.icon}</span>
              {activeCategory.name}
            </h2>
            <div style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, #D97706, #F59E0B)', borderRadius: '2px', marginTop: '8px' }} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {activeCategory.items.map((item) => {
              const qty = cartQty(item.id)
              const justAdded = added[item.id]
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden"
                  style={{ opacity: item.available === false ? 0.6 : 1 }}
                >
                  {/* Image */}
                  {item.image && (
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.parentElement.style.display = 'none' }} />
                    </div>
                  )}
                  <div className="p-5">
                    {item.available === false && (
                      <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                        Indisponible
                      </span>
                    )}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1" style={{ color: '#1C1917' }}>{item.name}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>{item.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
                        <span className="text-xl font-bold" style={{ color: '#D97706' }}>{item.price.toFixed(2)}€</span>
                        {item.available !== false && (
                          <button
                            onClick={() => handleAdd(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                              backgroundColor: justAdded ? '#D1FAE5' : '#FEF3C7',
                              color: justAdded ? '#065F46' : '#92400E',
                              minWidth: '80px',
                              justifyContent: 'center',
                            }}
                          >
                            {justAdded ? <Check size={14} /> : <Plus size={14} />}
                            {justAdded ? 'Ajouté' : 'Ajouter'}
                          </button>
                        )}
                        {qty > 0 && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D97706', color: 'white' }}>
                            {qty} dans panier
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {activeCategory.items.length === 0 && (
            <div className="text-center py-16" style={{ color: '#78716C' }}>
              <p className="text-lg">Aucun article dans cette catégorie.</p>
            </div>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center py-8 rounded-2xl" style={{ backgroundColor: '#FEF3C7' }}>
          <p className="text-sm" style={{ color: '#78716C' }}>
            Les prix s'entendent TTC, service compris. Carte susceptible de changer selon les arrivages.
          </p>
          <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>
            Informez-nous de vos allergies alimentaires — notre équipe s'adapte à vos besoins.
          </p>
        </div>
      </div>
    </div>
  )
}
