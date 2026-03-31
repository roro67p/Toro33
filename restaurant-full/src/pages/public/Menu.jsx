import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Check, Search, X } from 'lucide-react'

const BADGES = {
  'populaire':    { label: '🔥 Populaire',    bg: '#FEE2E2', color: '#DC2626' },
  'nouveau':      { label: '✨ Nouveau',       bg: '#EFF6FF', color: '#1D4ED8' },
  'signature':    { label: '👨‍🍳 Signature',   bg: '#F5F3FF', color: '#7C3AED' },
  'végétarien':   { label: '🌿 Végétarien',   bg: '#D1FAE5', color: '#065F46' },
  'coup de cœur': { label: '❤️ Coup de cœur', bg: '#FCE7F3', color: '#BE185D' },
}

const FILTERS = [
  { id: 'all',        label: 'Tout' },
  { id: 'populaire',  label: '🔥 Populaire' },
  { id: 'végétarien', label: '🌿 Végétarien' },
  { id: 'signature',  label: '👨‍🍳 Signature' },
  { id: 'nouveau',    label: '✨ Nouveau' },
]

export default function Menu() {
  const { data, cart, addToCart } = useStore()
  const { menuCategories } = data
  const [activeTab, setActiveTab] = useState(menuCategories[0]?.id || '')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [added, setAdded] = useState({})

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

  const isSearchMode = search.trim().length > 0 || filter !== 'all'
  const activeCategory = menuCategories.find(c => c.id === activeTab) || menuCategories[0]

  const filteredItems = isSearchMode
    ? menuCategories.flatMap(cat =>
        cat.items
          .filter(item => {
            const matchSearch = !search.trim() || item.name.toLowerCase().includes(search.toLowerCase()) || (item.description || '').toLowerCase().includes(search.toLowerCase())
            const matchFilter = filter === 'all' || item.badge === filter
            return matchSearch && matchFilter && item.available !== false
          })
          .map(item => ({ ...item, _catName: cat.name, _catIcon: cat.icon }))
      )
    : (activeCategory?.items || [])

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>À la carte</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>Notre Menu</h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#A8A29E' }}>
          Une cuisine française authentique, élaborée à partir des meilleurs produits de saison.
        </p>
        {/* Search */}
        <div className="mt-6 max-w-md mx-auto px-4 relative">
          <Search size={16} className="absolute left-8 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.5)' }} />
          <input
            type="text"
            placeholder="Rechercher un plat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-full text-sm outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-8 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="sticky top-16 z-10 shadow-sm" style={{ backgroundColor: '#FEF3C7' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3" style={{ scrollbarWidth: 'none' }}>
            {/* Badge filters */}
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                style={{
                  backgroundColor: filter === f.id ? '#D97706' : 'white',
                  color: filter === f.id ? 'white' : '#78716C',
                  boxShadow: filter === f.id ? '0 4px 14px rgba(217,119,6,0.3)' : 'none'
                }}>
                {f.label}
              </button>
            ))}
            <div style={{ width: '1px', backgroundColor: '#E7E5E4', margin: '4px 4px', flexShrink: 0 }} />
            {/* Category tabs */}
            {!isSearchMode && menuCategories.map(cat => (
              <button key={cat.id} onClick={() => setActiveTab(cat.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                style={{
                  backgroundColor: activeTab === cat.id && filter === 'all' && !search ? '#1C1917' : 'transparent',
                  color: activeTab === cat.id && filter === 'all' && !search ? 'white' : '#78716C',
                }}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isSearchMode ? (
          <>
            <p className="text-sm mb-5 font-medium" style={{ color: '#78716C' }}>
              {filteredItems.length} résultat{filteredItems.length !== 1 ? 's' : ''}
              {search ? ` pour « ${search} »` : ''}
              {filter !== 'all' ? ` — filtre: ${FILTERS.find(f => f.id === filter)?.label}` : ''}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredItems.map(item => (
                <MenuCard key={item.id} item={item} catIcon={item._catIcon}
                  onAdd={handleAdd} justAdded={added[item.id]} qty={cartQty(item.id)} />
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold" style={{ color: '#1C1917' }}>Aucun plat trouvé</p>
                <button onClick={() => { setSearch(''); setFilter('all') }} className="mt-3 text-sm underline" style={{ color: '#D97706' }}>Tout afficher</button>
              </div>
            )}
          </>
        ) : (
          activeCategory && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                  <span className="text-3xl">{activeCategory.icon}</span>
                  {activeCategory.name}
                </h2>
                <div style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, #D97706, #F59E0B)', borderRadius: '2px', marginTop: '8px' }} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {activeCategory.items.map(item => (
                  <MenuCard key={item.id} item={item} catIcon={activeCategory.icon}
                    onAdd={handleAdd} justAdded={added[item.id]} qty={cartQty(item.id)} />
                ))}
              </div>
              {activeCategory.items.length === 0 && (
                <div className="text-center py-16" style={{ color: '#78716C' }}>Aucun article dans cette catégorie.</div>
              )}
            </>
          )
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center py-6 rounded-2xl" style={{ backgroundColor: '#FEF3C7' }}>
          <p className="text-sm" style={{ color: '#78716C' }}>
            Les prix s'entendent TTC, service compris. Carte susceptible de changer.
          </p>
          <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>
            🌿 Végétarien · ⚠️ Allergènes disponibles sur demande
          </p>
        </div>
      </div>
    </div>
  )
}

function MenuCard({ item, catIcon, onAdd, justAdded, qty }) {
  const [showAllergens, setShowAllergens] = useState(false)
  const badgeInfo = item.badge ? BADGES[item.badge] : null

  return (
    <div
      className="bg-white rounded-2xl shadow-sm relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden"
      style={{ opacity: item.available === false ? 0.6 : 1 }}
    >
      {item.image && (
        <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
          <img src={item.image} alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.parentElement.style.display = 'none' }} />
          {badgeInfo && (
            <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: badgeInfo.bg, color: badgeInfo.color }}>
              {badgeInfo.label}
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        {item.available === false && (
          <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Indisponible</span>
        )}
        {!item.image && badgeInfo && (
          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2"
            style={{ backgroundColor: badgeInfo.bg, color: badgeInfo.color }}>
            {badgeInfo.label}
          </span>
        )}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1" style={{ color: '#1C1917' }}>{item.name}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>{item.description}</p>
            {item.allergens && (
              <button onClick={() => setShowAllergens(!showAllergens)}
                className="text-xs mt-1.5 hover:opacity-70 transition-opacity"
                style={{ color: '#94A3B8' }}>
                {showAllergens ? '▲ Masquer allergènes' : '⚠️ Allergènes'}
              </button>
            )}
            {showAllergens && item.allergens && (
              <p className="text-xs mt-1 px-2 py-1 rounded-lg"
                style={{ backgroundColor: '#FFF7ED', color: '#92400E', border: '1px solid #FDE68A' }}>
                Contient : {item.allergens}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
            <span className="text-xl font-bold" style={{ color: '#D97706' }}>{item.price.toFixed(2)}€</span>
            {item.available !== false && (
              <button onClick={() => onAdd(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: justAdded ? '#D1FAE5' : '#FEF3C7',
                  color: justAdded ? '#065F46' : '#92400E',
                  minWidth: '80px', justifyContent: 'center',
                }}>
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
}
