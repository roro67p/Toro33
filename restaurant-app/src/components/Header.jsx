import { Search, ShoppingCart, User, MapPin, Clock, Menu, X, ChevronDown, LogOut, Award, Heart, Truck } from 'lucide-react'
import { useState } from 'react'
import useStore from '../store/useStore'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { setCurrentPage, setCartOpen, getCartCount, getCartTotal, searchQuery, setSearchQuery, user, setAuthModal, logout, setSelectedCategory, categories } = useStore()
  const cartCount = getCartCount()
  const cartTotal = getCartTotal()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSelectedCategory(null)
      setCurrentPage('catalog')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-primary text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin size={12} /> Magasin de Toulouse - Centre</span>
            <span className="hidden sm:flex items-center gap-1"><Clock size={12} /> Drive ouvert 8h-20h</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Truck size={12} /> Retrait gratuit en 2h</span>
            {user && (
              <span className="flex items-center gap-1"><Award size={12} /> {user.loyaltyPoints} pts fidélité</span>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <button onClick={() => { setCurrentPage('home'); setSearchQuery('') }} className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-black text-lg">F</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-primary leading-none">FreshDrive</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Supermarché en ligne</p>
            </div>
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un produit, une marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* User */}
            <div className="relative">
              <button
                onClick={() => user ? setUserMenuOpen(!userMenuOpen) : setAuthModal(true, 'login')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <User size={20} className="text-gray-600" />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user ? user.name.split(' ')[0] : 'Connexion'}
                </span>
                {user && <ChevronDown size={14} className="text-gray-400" />}
              </button>
              {userMenuOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-slide-up z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                    <Award size={16} /> <span>{user.loyaltyPoints} points fidélité</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                    <Heart size={16} /> <span>Mes favoris</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                    <Clock size={16} /> <span>Historique commandes</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                  >
                    <LogOut size={16} /> <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
            >
              <ShoppingCart size={20} />
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium opacity-80">{cartCount} article{cartCount !== 1 ? 's' : ''}</p>
                <p className="text-sm font-bold">{cartTotal.toFixed(2)} EUR</p>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category bar */}
      <div className="border-t border-gray-100 bg-white overflow-x-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1 py-1">
            <button
              onClick={() => { setCurrentPage('home'); setSearchQuery('') }}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Accueil
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSearchQuery('') }}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage('drive')}
              className="ml-auto px-4 py-2 text-sm font-bold text-white bg-success rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Truck size={16} /> Réserver mon Drive
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            <button
              onClick={() => { setCurrentPage('home'); setMenuOpen(false); setSearchQuery('') }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Accueil
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setMenuOpen(false); setSearchQuery('') }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {cat.icon} {cat.name}
              </button>
            ))}
            <button
              onClick={() => { setCurrentPage('drive'); setMenuOpen(false) }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-white bg-success mt-2"
            >
              <Truck size={16} className="inline mr-2" /> Réserver mon Drive
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
