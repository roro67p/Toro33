import { useState } from 'react'
import useStore from '../../store/useStore'

export default function Drinks() {
  const { data } = useStore()
  const { drinkCategories } = data
  const [activeTab, setActiveTab] = useState(drinkCategories[0]?.id || '')
  const [search, setSearch] = useState('')

  const activeCategory = drinkCategories.find(c => c.id === activeTab) || drinkCategories[0]

  const filteredItems = search.trim()
    ? drinkCategories.flatMap(cat =>
        cat.items
          .filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || (item.description || '').toLowerCase().includes(search.toLowerCase()))
          .map(item => ({ ...item, _catName: cat.name, _catIcon: cat.icon }))
      )
    : activeCategory?.items || []

  const isSearchMode = search.trim().length > 0

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
        {/* Search bar */}
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
                <DrinkCard key={item.id} item={item} catName={item._catName} catIcon={item._catIcon} />
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-16" style={{ color: '#78716C' }}>
                <p className="text-lg">Aucune boisson trouvée pour cette recherche.</p>
              </div>
            )}
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
                  <DrinkCard key={item.id} item={item} catName={activeCategory.name} catIcon={activeCategory.icon} />
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

      {/* Pricing note */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#1E40AF' }}>Informations tarifs</p>
          <p className="text-sm" style={{ color: '#64748B' }}>
            Prix au verre et à la bouteille disponibles selon les références. Les prix s'entendent TTC, service compris.
            Notre carte évolue selon les arrivages et les saisons.
          </p>
        </div>
      </div>
    </div>
  )
}

function DrinkCard({ item, catName, catIcon }) {
  const hasGlass = item.priceGlass != null
  const hasBottle = item.priceBottle != null
  const hasSingle = item.price != null

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md relative ${!item.available ? 'opacity-60' : ''}`}
    >
      {!item.available && (
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
          <h3 className="font-semibold text-base mb-1" style={{ color: '#1C1917' }}>
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>
              {item.description}
            </p>
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
              {hasGlass && <div className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>Bouteille</div>}
              {!hasGlass && <div className="text-xs mb-0.5" style={{ color: '#94A3B8' }}>Bouteille</div>}
              <div className="text-lg font-bold" style={{ color: '#1E3A5F' }}>{item.priceBottle.toFixed(2)}€</div>
            </div>
          )}
          {hasSingle && !hasGlass && !hasBottle && (
            <div className="text-xl font-bold" style={{ color: '#D97706' }}>{item.price.toFixed(2)}€</div>
          )}
        </div>
      </div>
    </div>
  )
}
