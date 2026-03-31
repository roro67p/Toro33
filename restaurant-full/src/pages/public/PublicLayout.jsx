import { useState } from 'react'
import useStore from '../../store/useStore'
import Home from './Home'
import Menu from './Menu'
import Drinks from './Drinks'
import Events from './Events'
import Reservation from './Reservation'
import Contact from './Contact'
import Cart from '../../components/Cart'
import { Menu as MenuIcon, X, UtensilsCrossed, CalendarCheck } from 'lucide-react'

export default function PublicLayout({ onOpenLogin }) {
  const { data, activePage, setActivePage } = useStore()
  const { restaurant } = data
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'menu', label: 'Menu' },
    { id: 'drinks', label: 'Boissons' },
    { id: 'events', label: 'Soirées' },
    { id: 'reservation', label: 'Réservation' },
    { id: 'contact', label: 'Contact' },
  ]

  const navigate = (page) => {
    setActivePage(page)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    switch (activePage) {
      case 'menu': return <Menu />
      case 'drinks': return <Drinks />
      case 'events': return <Events />
      case 'reservation': return <Reservation />
      case 'contact': return <Contact />
      default: return <Home />
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFBEB' }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: '#1C1917' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 group"
            >
              <span className="text-2xl">🍽️</span>
              <div className="text-left">
                <div className="font-bold text-lg leading-tight" style={{ color: '#D97706', fontFamily: 'Georgia, serif' }}>
                  {restaurant.name}
                </div>
                <div className="text-xs" style={{ color: '#78716C' }}>{restaurant.tagline}</div>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePage === link.id
                      ? 'text-white'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: activePage === link.id ? '#D97706' : 'transparent',
                    color: activePage === link.id ? 'white' : '#D6D3D1'
                  }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => navigate('reservation')}
                className="ml-3 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 flex items-center gap-1"
                style={{ backgroundColor: '#D97706' }}
              >
                <CalendarCheck size={15} />
                Réserver
              </button>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: '#D97706' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t" style={{ borderColor: '#292524', backgroundColor: '#1C1917' }}>
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: activePage === link.id ? '#D97706' : 'transparent',
                    color: activePage === link.id ? 'white' : '#D6D3D1'
                  }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => navigate('reservation')}
                className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
                style={{ backgroundColor: '#D97706' }}
              >
                <CalendarCheck size={15} />
                Réserver une table
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Floating Reservation CTA */}
      {activePage !== 'reservation' && (
        <div className="fixed z-30 no-print" style={{ bottom: '24px', right: '120px' }}>
          <button
            onClick={() => navigate('reservation')}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold shadow-2xl transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#D97706' }}
          >
            <CalendarCheck size={18} />
            <span className="hidden sm:inline">Réserver</span>
          </button>
        </div>
      )}

      {/* Cart */}
      <Cart />

      {/* Footer */}
      <footer style={{ backgroundColor: '#1C1917', color: '#D6D3D1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🍽️</span>
                <span className="text-xl font-bold" style={{ color: '#D97706', fontFamily: 'Georgia, serif' }}>
                  {restaurant.name}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>
                {restaurant.description}
              </p>
              <div className="flex gap-3 mt-4">
                <a href={restaurant.socialMedia?.facebook} className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#D97706' }}>Facebook</a>
                <a href={restaurant.socialMedia?.instagram} className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#D97706' }}>Instagram</a>
                <a href={restaurant.socialMedia?.tripadvisor} className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#D97706' }}>TripAdvisor</a>
              </div>
            </div>

            {/* Nav */}
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#D97706' }}>Navigation</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => navigate(link.id)}
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: '#D6D3D1' }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#D97706' }}>Contact</h3>
              <div className="space-y-2 text-sm" style={{ color: '#78716C' }}>
                <div>{restaurant.address}</div>
                <div>
                  <a href={`tel:${restaurant.phone}`} className="hover:opacity-80 transition-opacity" style={{ color: '#D6D3D1' }}>
                    {restaurant.phone}
                  </a>
                </div>
                <div>
                  <a href={`mailto:${restaurant.email}`} className="hover:opacity-80 transition-opacity" style={{ color: '#D6D3D1' }}>
                    {restaurant.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid #292524' }}>
            <p className="text-xs" style={{ color: '#78716C' }}>
              © {new Date().getFullYear()} {restaurant.name}. Tous droits réservés.
            </p>
            <button
              onClick={onOpenLogin}
              className="text-xs transition-opacity hover:opacity-80"
              style={{ color: '#78716C' }}
            >
              Espace Pro
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
