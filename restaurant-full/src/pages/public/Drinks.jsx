import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Check, X } from 'lucide-react'

export default function Drinks() {
  const { data, cart, addToCart } = useStore()
  const { drinkCategories } = data
  const [activeTab, setActiveTab] = useState(drinkCategories[0]?.id || '')
  const [search, setSearch] = useState('')
  const [added, setAdded] = useState({})
  const [pickModal, setPickModal] = useState(null) // { item } when choosing glass/bottle

  const activeCategory = drinkCategories.find(c => c.id === activeTab) || drinkCategories[0]

  const filteredItems = search.trim()
    ? drinkCategories.flatMap(cat =>
        cat.items
          .filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || (item.description || '').toLowerCase().includes(search.toLowerCase()))
          .map(item => ({ ...item, _catName: cat.name, _catIcon: cat.icon }))
      )
    : activeCategory?.items || []

  const isSearchMode = search.trim().length > 0

  const flashAdded = (key) => {
    setAdded(a => ({ ...a, [key]: true }))
    setTimeout(() => setAdded(a => ({ ...a, [key]: false })), 1200)
  }

  const handleAdd = (item) => {
    const hasGlass = item.priceGlass != null
    const hasBottle = item.priceBottle != null
    const hasSingle = item.price != null

    if (hasGlass && hasBottle) {
      setPickModal(item)
    } else if (hasGlass) {
      const cartId = `drink_${item.id}_glass`
      addToCart({ cartId, itemId: item.id, name: item.name, price: item.priceGlass, priceType: 'glass', category: 'drink', note: '' })
      flashAdded(cartId)
    } else if (hasBottle) {
      const cartId = `drink_${item.id}_bottle`
      addToCart({ cartId, itemId: item.id, name: item.name, price: item.priceBottle, priceType: 'bottle', category: 'drink', note: '' })
      flashAdded(cartId)
    } else if (hasSingle) {
      const cartId = `drink_${item.id}`
      addToCart({ cartId, itemId: item.id, name: item.name, price: item.price, priceType: 'single', category: 'drink', note: '' })
      flashAdded(cartId)
    }
  }

  const pickOption = (item, type) => {
    const price = type === 'glass' ? item.priceGlass : item.priceBottle
    const cartId = `drink_${item.id}_${type}`
    addToCart({ cartId, itemId: item.id, name: item.name, price, priceType: type, category: 'drink', note: '' })
    flashAdded(cartId)
    setPickModal(null)
  }

  const cartQty = (itemId) => {
    const entries = cart.filter(c => c.itemId === itemId && c.category === 'drink')
    return entries.reduce((s, e) => s + e.quantity, 0)
  }

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
          Carte des boissons
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
          Nos Boissons
        </h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#94A3B8' }}>
          Une sélection de vins, cocktails et boissons soigneusement choisis pour accompagner votre repas.
        </p>
        <div className="mt-6 max-w-md mx-auto px-4">
          <input
            type="text"
            placeholder="Rechercher une boisson..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full text-sm outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      {!isSearchMode && (
        <div className="sticky top-16 z-10 shadow-sm" style={{ backgroundColor: '#EFF6FF' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: 'none' }}>
              {drinkCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  style={{
                    backgroundColor: activeTab === cat.id ? '#1E3A5F' : 'white',
                    color: activeTab === cat.id ? 'white' : '#64748B',
                    boxShadow: activeTab === cat.id ? '0 4px 14px rgba(30,58,95,0.3)' : 'none'
                  }}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isSearchMode ? (
          <>
            <h2 className="text-lg font-semibold mb-6" style={{ color: '#1C1917' }}>
              {filteredItems.length} résultat(s) pour « {search} »
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredItems.map(item => (
                <DrinkCard key={item.id} item={item} catName={item._catName} catIcon={item._catIcon}
                  onAdd={handleAdd} added={added} qty={cartQty(item.id)} />
              ))}
            </div>
          </>
        ) : (
          activeCategory && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                  <span className="text-3xl">{activeCategory.icon}</span>
                  {activeCategory.name}
                </h2>
                <div style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, #D97706, #F59E0B)', borderRadius: '2px', marginTop: '8px' }} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {activeCategory.items.map(item => (
                  <DrinkCard key={item.id} item={item} catName={activeCategory.name} catIcon={activeCategory.icon}
                    onAdd={handleAdd} added={added} qty={cartQty(item.id)} />
                ))}
              </div>
              {activeCategory.items.length === 0 && (
                <div className="text-center py-16" style={{ color: '#78716C' }}>
                  <p className="text-lg">Aucune boisson dans cette catégorie.</p>
                </div>
              )}
            </>
          )
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#1E40AF' }}>Informations tarifs</p>
          <p className="text-sm" style={{ color: '#64748B' }}>
            Prix au verre et à la bouteille disponibles selon les références. Les prix s'entendent TTC, service compris.
          </p>
        </div>
      </div>

      {/* Glass/Bottle picker modal */}
      {pickModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: '#1C1917' }}>{pickModal.name}</h3>
              <button onClick={() => setPickModal(null)}><X size={20} style={{ color: '#78716C' }} /></button>
            </div>
            <p className="text-sm mb-4" style={{ color: '#78716C' }}>Choisissez votre format :</p>
            <div className="flex gap-3">
              {pickModal.priceGlass != null && (
                <button
                  onClick={() => pickOption(pickModal, 'glass')}
                  className="flex-1 py-4 rounded-2xl font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                >
                  <div className="text-2xl mb-1">🥂</div>
                  <div className="text-base">Au verre</div>
                  <div className="text-lg font-bold mt-1" style={{ color: '#D97706' }}>{pickModal.priceGlass.toFixed(2)}€</div>
                </button>
              )}
              {pickModal.priceBottle != null && (
                <button
                  onClick={() => pickOption(pickModal, 'bottle')}
                  className="flex-1 py-4 rounded-2xl font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}
                >
                  <div className="text-2xl mb-1">🍾</div>
                  <div className="text-base">À la bouteille</div>
                  <div className="text-lg font-bold mt-1" style={{ color: '#1E3A5F' }}>{pickModal.priceBottle.toFixed(2)}€</div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DrinkCard({ item, catName, catIcon, onAdd, added, qty }) {
  const hasGlass = item.priceGlass != null
  const hasBottle = item.priceBottle != null
  const hasSingle = item.price != null

  const glassKey = `drink_${item.id}_glass`
  const bottleKey = `drink_${item.id}_bottle`
  const singleKey = `drink_${item.id}`
  const justAdded = added[glassKey] || added[bottleKey] || added[singleKey]

  return (
    <div className="bg-white rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
      style={{ opacity: item.available === false ? 0.6 : 1 }}>
      {/* Image */}
      {item.image && (
        <div style={{ height: '150px', overflow: 'hidden' }}>
          <img src={item.image} alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{catIcon}</span>
              <span className="text-xs" style={{ color: '#94A3B8' }}>{catName}</span>
            </div>
            <h3 className="font-semibold text-base mb-1" style={{ color: '#1C1917' }}>{item.name}</h3>
            {item.description && (
              <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>{item.description}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            {hasGlass && (
              <div>
                <div className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>Verre</div>
                <div className="text-lg font-bold" style={{ color: '#D97706' }}>{item.priceGlass.toFixed(2)}€</div>
              </div>
            )}
            {hasBottle && (
              <div className={hasGlass ? 'mt-1' : ''}>
                <div className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>Bouteille</div>
                <div className="text-lg font-bold" style={{ color: '#1E3A5F' }}>{item.priceBottle.toFixed(2)}€</div>
              </div>
            )}
            {hasSingle && !hasGlass && !hasBottle && (
              <div className="text-xl font-bold" style={{ color: '#D97706' }}>{item.price.toFixed(2)}€</div>
            )}
          </div>
        </div>

        {item.available !== false && (
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => onAdd(item)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: justAdded ? '#D1FAE5' : '#FEF3C7',
                color: justAdded ? '#065F46' : '#92400E',
              }}
            >
              {justAdded ? <Check size={14} /> : <Plus size={14} />}
              {justAdded ? 'Ajouté !' : hasGlass && hasBottle ? 'Choisir format' : 'Ajouter'}
            </button>
            {qty > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D97706', color: 'white' }}>
                {qty} dans panier
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
