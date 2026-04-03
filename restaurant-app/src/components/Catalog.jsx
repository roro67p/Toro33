import { Filter, Grid3X3, List, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import useStore from '../store/useStore'
import ProductCard from './ProductCard'

export default function Catalog() {
  const { categories, selectedCategory, setSelectedCategory, getFilteredProducts, searchQuery, setCurrentPage, setSearchQuery } = useStore()
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 50])
  const [onlyPromo, setOnlyPromo] = useState(false)
  const [onlyBio, setOnlyBio] = useState(false)

  let products = getFilteredProducts()

  // Apply local filters
  if (onlyPromo) products = products.filter(p => p.promo)
  if (onlyBio) products = products.filter(p => p.bio)
  products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

  // Sort
  switch (sortBy) {
    case 'price-asc': products = [...products].sort((a, b) => a.price - b.price); break
    case 'price-desc': products = [...products].sort((a, b) => b.price - a.price); break
    case 'rating': products = [...products].sort((a, b) => b.rating - a.rating); break
    case 'name': products = [...products].sort((a, b) => a.name.localeCompare(b.name)); break
    default: products = [...products].sort((a, b) => b.reviews - a.reviews)
  }

  const currentCategory = categories.find(c => c.id === selectedCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button onClick={() => { setCurrentPage('home'); setSearchQuery('') }} className="hover:text-primary">Accueil</button>
        <ChevronRight size={14} />
        {searchQuery ? (
          <span className="text-gray-900 font-medium">Recherche : "{searchQuery}"</span>
        ) : currentCategory ? (
          <>
            <button onClick={() => setSelectedCategory(null)} className="hover:text-primary">Tous les rayons</button>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{currentCategory.icon} {currentCategory.name}</span>
          </>
        ) : (
          <span className="text-gray-900 font-medium">Tous les produits</span>
        )}
      </nav>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-40">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filtres
            </h3>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rayons</p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedCategory ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Tous les produits
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prix max : {priceRange[1]} EUR</p>
              <input
                type="range"
                min="0"
                max="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-primary"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={onlyPromo} onChange={(e) => setOnlyPromo(e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm font-medium text-gray-700">En promotion uniquement</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={onlyBio} onChange={(e) => setOnlyBio(e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm font-medium text-gray-700">Bio uniquement</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-100 p-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter size={16} /> Filtres
              </button>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{products.length}</span> produit{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="popular">Plus populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
              <option value="name">Alphabétique</option>
            </select>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="lg:hidden bg-white rounded-xl border border-gray-100 p-4 mb-4 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Filtres</h3>
                <button onClick={() => setShowFilters(false)}><X size={18} /></button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary/30'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={onlyPromo} onChange={(e) => setOnlyPromo(e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-xs font-medium">Promos</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={onlyBio} onChange={(e) => setOnlyBio(e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-xs font-medium">Bio</span>
                </label>
              </div>
            </div>
          )}

          {/* Products grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 mb-4">Essayez de modifier vos filtres ou votre recherche.</p>
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery('') }}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                Voir tous les produits
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
