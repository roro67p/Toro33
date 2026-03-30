import { useState } from 'react'
import useStore from '../../store/useStore'
import Dashboard from './Dashboard'
import ReservationsAdmin from './ReservationsAdmin'
import MenuAdmin from './MenuAdmin'
import DrinksAdmin from './DrinksAdmin'
import EventsAdmin from './EventsAdmin'
import SettingsAdmin from './SettingsAdmin'
import {
  LayoutDashboard, Calendar, UtensilsCrossed, Wine,
  PartyPopper, Settings, ArrowLeft, Menu, X, LogOut
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'drinks', label: 'Boissons', icon: Wine },
  { id: 'events', label: 'Soirées', icon: PartyPopper },
  { id: 'settings', label: 'Paramètres', icon: Settings },
]

export default function AdminLayout() {
  const { data, activeAdminPage, setActiveAdminPage, logoutAdmin } = useStore()
  const { restaurant } = data
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (activeAdminPage) {
      case 'dashboard': return <Dashboard />
      case 'reservations': return <ReservationsAdmin />
      case 'menu': return <MenuAdmin />
      case 'drinks': return <DrinksAdmin />
      case 'events': return <EventsAdmin />
      case 'settings': return <SettingsAdmin />
      default: return <Dashboard />
    }
  }

  const handleNav = (id) => {
    setActiveAdminPage(id)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 flex-col shadow-xl transition-transform duration-300 md:flex ${
          sidebarOpen ? 'flex translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: 'white' }}
      >
        {/* Logo */}
        <div className="px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid #F3F4F6' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <div>
              <div className="font-bold text-sm leading-tight" style={{ color: '#D97706', fontFamily: 'Georgia, serif' }}>
                {restaurant.name}
              </div>
              <div className="text-xs" style={{ color: '#9CA3AF' }}>Administration</div>
            </div>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)} style={{ color: '#9CA3AF' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`admin-sidebar-item w-full mb-1 ${activeAdminPage === id ? 'active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 space-y-1" style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem' }}>
          <button
            onClick={logoutAdmin}
            className="admin-sidebar-item w-full"
          >
            <ArrowLeft size={18} />
            Retour au site
          </button>
          <button
            onClick={logoutAdmin}
            className="admin-sidebar-item w-full"
            style={{ color: '#DC2626' }}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 shadow-sm"
          style={{ backgroundColor: 'white', borderBottom: '1px solid #F3F4F6' }}>
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg"
              style={{ color: '#9CA3AF' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-semibold text-base" style={{ color: '#1C1917' }}>
                {NAV_ITEMS.find(n => n.id === activeAdminPage)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>
                {restaurant.name} · Espace Pro
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-medium" style={{ color: '#78716C' }}>
              {restaurant.name}
            </span>
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
