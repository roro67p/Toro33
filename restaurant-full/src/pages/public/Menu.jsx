import { useState } from 'react'
import useStore from '../../store/useStore'

export default function Menu() {
  const { data } = useStore()
  const { menuCategories } = data
  const [activeTab, setActiveTab] = useState(menuCategories[0]?.id || '')

  const activeCategory = menuCategories.find(c => c.id === activeTab) || menuCategories[0]

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
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0`}
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
            <div className="divider-gold" style={{ maxWidth: '80px' }} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {activeCategory.items.map((item) => (
              <div
                key={item.id}
                className={`card-hover bg-white rounded-2xl p-6 shadow-sm relative ${!item.available ? 'opacity-60' : ''}`}
              >
                {!item.available && (
                  <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                    Indisponible
                  </span>
                )}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1" style={{ color: '#1C1917' }}>
                      {item.name}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-xl font-bold" style={{ color: '#D97706' }}>
                      {item.price.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeCategory.items.length === 0 && (
            <div className="text-center py-16" style={{ color: '#78716C' }}>
              <p className="text-lg">Aucun article dans cette catégorie.</p>
            </div>
          )}
        </div>
      )}

      {/* All sections scrollable view alternative */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
