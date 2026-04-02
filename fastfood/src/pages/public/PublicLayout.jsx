import { useState } from 'react'
import useStore from '../../store/useStore'
import Home from './Home'
import MenuPage from './MenuPage'
import Drinks from './Drinks'
import Formules from './Formules'
import Order from './Order'
import Contact from './Contact'
import Reviews from './Reviews'
import Promos from './Promos'
import TrackOrder from './TrackOrder'
import Cart from '../../components/Cart'
import { Menu as MenuIcon, X, ShoppingCart, Search } from 'lucide-react'

export default function PublicLayout({ onOpenLogin }) {
  const { data, activePage, setActivePage, cart } = useStore()
  const { restaurant } = data
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const navLinks = [
    { id: 'home',    label: 'Accueil' },
    { id: 'menu',    label: 'Menu' },
    { id: 'drinks',  label: 'Boissons' },
    { id: 'formules',label: 'Formules' },
    { id: 'promos',  label: '🔥 Promos' },
    { id: 'reviews', label: 'Avis' },
    { id: 'contact', label: 'Horaires' },
  ]

  const navigate = (page) => { setActivePage(page); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const renderPage = () => {
    switch (activePage) {
      case 'menu':    return <MenuPage />
      case 'drinks':  return <Drinks />
      case 'formules':return <Formules />
      case 'order':   return <Order />
      case 'contact': return <Contact />
      case 'reviews': return <Reviews />
      case 'promos':  return <Promos />
      case 'track':   return <TrackOrder />
      default:        return <Home />
    }
  }

  const activePromos = (data.promoCodes || []).filter(p => p.active).length

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F172A' }}>
      <header className="sticky top-0 z-40" style={{ backgroundColor: '#111827', borderBottom: '1px solid #1F2937' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate('home')} className="flex items-center gap-2.5">
              <span className="text-2xl">🍔</span>
              <div className="text-left">
                <div className="font-black text-lg leading-tight" style={{ color: '#E11D48' }}>{restaurant.name}</div>
                <div className="text-xs" style={{ color: '#6B7280' }}>{restaurant.tagline}</div>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => navigate(link.id)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold transition-all relative"
                  style={{ backgroundColor: activePage === link.id ? '#E11D48' : 'transparent', color: activePage === link.id ? 'white' : '#9CA3AF' }}>
                  {link.label}
                  {link.id === 'promos' && activePromos > 0 && activePage !== 'promos' && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: '#F59E0B', color: 'white', fontSize: '10px' }}>{activePromos}</span>
                  )}
                </button>
              ))}
              <button onClick={() => navigate('track')} className="ml-1 p-2 rounded-lg transition-all" style={{ color: '#9CA3AF' }} title="Suivre ma commande">
                <Search size={16} />
              </button>
              <button onClick={() => navigate('order')} className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white relative"
                style={{ backgroundColor: '#E11D48' }}>
                <ShoppingCart size={15} /> Commander
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#111827', border: '1.5px solid #E11D48' }}>{cartCount}</span>}
              </button>
            </nav>

            <button className="md:hidden p-2 rounded-lg" style={{ color: '#E11D48' }} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden px-4 py-3 space-y-1" style={{ borderTop: '1px solid #1F2937', backgroundColor: '#111827' }}>
            {navLinks.map(link => (
              <button key={link.id} onClick={() => navigate(link.id)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: activePage === link.id ? '#E11D48' : 'transparent', color: activePage === link.id ? 'white' : '#9CA3AF' }}>
                {link.label}
              </button>
            ))}
            <button onClick={() => navigate('track')} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              style={{ color: '#9CA3AF' }}>
              <Search size={15} /> Suivre ma commande
            </button>
            <button onClick={() => navigate('order')} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-white mt-2"
              style={{ backgroundColor: '#E11D48' }}>
              <ShoppingCart size={16} /> Commander
              {cartCount > 0 && <span className="ml-auto font-bold">({cartCount})</span>}
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">{renderPage()}</main>

      {activePage !== 'order' && cartCount > 0 && (
        <div className="fixed z-30" style={{ bottom: '24px', right: '24px' }}>
          <button onClick={() => navigate('order')}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold shadow-2xl transition-all hover:scale-105"
            style={{ backgroundColor: '#E11D48', boxShadow: '0 0 30px rgba(225,29,72,0.5)' }}>
            <ShoppingCart size={18} />
            {cartCount} article(s) · {cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}€
          </button>
        </div>
      )}

      <Cart />

      <footer style={{ backgroundColor: '#111827', borderTop: '1px solid #1F2937' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🍔</span>
                <span className="font-black text-xl" style={{ color: '#E11D48' }}>{restaurant.name}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{restaurant.description}</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Navigation</h3>
              <ul className="space-y-1.5">
                {navLinks.map(link => (
                  <li key={link.id}><button onClick={() => navigate(link.id)} className="text-sm hover:opacity-80" style={{ color: '#9CA3AF' }}>{link.label}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Commande</h3>
              <ul className="space-y-1.5">
                <li><button onClick={() => navigate('order')} className="text-sm hover:opacity-80" style={{ color: '#9CA3AF' }}>Commander en ligne</button></li>
                <li><button onClick={() => navigate('track')} className="text-sm hover:opacity-80" style={{ color: '#9CA3AF' }}>Suivre ma commande</button></li>
                <li><button onClick={() => navigate('promos')} className="text-sm hover:opacity-80" style={{ color: '#9CA3AF' }}>Codes promo</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Contact</h3>
              <div className="space-y-1.5 text-sm" style={{ color: '#6B7280' }}>
                <div>{restaurant.address}</div>
                <div><a href={`tel:${restaurant.phone}`} className="hover:opacity-80" style={{ color: '#9CA3AF' }}>{restaurant.phone}</a></div>
                <div><a href={`mailto:${restaurant.email}`} className="hover:opacity-80" style={{ color: '#9CA3AF' }}>{restaurant.email}</a></div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: '1px solid #1F2937' }}>
            <p className="text-xs" style={{ color: '#6B7280' }}>© {new Date().getFullYear()} {restaurant.name}. Tous droits réservés.</p>
            <button onClick={onOpenLogin} className="text-xs hover:opacity-80" style={{ color: '#6B7280' }}>Espace Pro</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
