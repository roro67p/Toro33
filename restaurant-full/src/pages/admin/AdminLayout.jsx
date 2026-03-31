import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import Dashboard from './Dashboard'
import ReservationsAdmin from './ReservationsAdmin'
import MenuAdmin from './MenuAdmin'
import DrinksAdmin from './DrinksAdmin'
import EventsAdmin from './EventsAdmin'
import SettingsAdmin from './SettingsAdmin'
import SuppliersAdmin from './SuppliersAdmin'
import StockAdmin from './StockAdmin'
import OrdersAdmin from './OrdersAdmin'
import CaisseAdmin from './CaisseAdmin'
import CustomerOrdersAdmin from './CustomerOrdersAdmin'
import {
  LayoutDashboard, Calendar, UtensilsCrossed, Wine,
  PartyPopper, Settings, ArrowLeft, Menu, X, LogOut,
  Truck, Package, ShoppingCart, Euro, ShoppingBag
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard',       label: 'Dashboard',          icon: LayoutDashboard },
  { id: 'customer-orders', label: 'Commandes clients',  icon: ShoppingBag },
  { id: 'reservations',    label: 'Réservations',       icon: Calendar },
  { id: 'caisse',          label: 'Caisse & CA',         icon: Euro },
  { id: 'menu',            label: 'Menu',                icon: UtensilsCrossed },
  { id: 'drinks',          label: 'Boissons',            icon: Wine },
  { id: 'events',          label: 'Soirées',             icon: PartyPopper },
  { id: 'stock',           label: 'Stock',               icon: Package },
  { id: 'suppliers',       label: 'Fournisseurs',        icon: Truck },
  { id: 'orders',          label: 'Commandes fourn.',    icon: ShoppingCart },
  { id: 'settings',        label: 'Paramètres',          icon: Settings },
]

export default function AdminLayout() {
  const { data, activeAdminPage, setActiveAdminPage, logoutAdmin } = useStore()
  const newOrdersCount = (data.customerOrders || []).filter(o => o.status === 'new').length
  const { restaurant } = data
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const renderPage = () => {
    switch (activeAdminPage) {
      case 'dashboard':     return <Dashboard />
      case 'reservations':  return <ReservationsAdmin />
      case 'menu':          return <MenuAdmin />
      case 'drinks':        return <DrinksAdmin />
      case 'events':        return <EventsAdmin />
      case 'settings':      return <SettingsAdmin />
      case 'suppliers':     return <SuppliersAdmin />
      case 'stock':         return <StockAdmin />
      case 'orders':           return <OrdersAdmin />
      case 'caisse':           return <CaisseAdmin />
      case 'customer-orders':  return <CustomerOrdersAdmin />
      default:              return <Dashboard />
    }
  }

  const handleNav = (id) => {
    setActiveAdminPage(id)
    setMobileOpen(false)
  }

  const Sidebar = () => (
    <div style={{
      width: '256px', minWidth: '256px', height: '100vh',
      backgroundColor: 'white', display: 'flex', flexDirection: 'column',
      borderRight: '1px solid #F3F4F6', flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🍽️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#D97706', fontFamily: 'Georgia, serif' }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Administration</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => handleNav(id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            marginBottom: '4px', fontSize: '14px', fontWeight: activeAdminPage === id ? 600 : 400,
            backgroundColor: activeAdminPage === id ? '#FEF3C7' : 'transparent',
            color: activeAdminPage === id ? '#D97706' : '#6B7280',
            transition: 'all 0.15s', textAlign: 'left'
          }}>
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {id === 'customer-orders' && newOrdersCount > 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 700, backgroundColor: '#EF4444',
                color: 'white', borderRadius: '999px', padding: '1px 6px', minWidth: '18px', textAlign: 'center'
              }}>{newOrdersCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid #F3F4F6' }}>
        <button onClick={logoutAdmin} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
          marginBottom: '4px', fontSize: '14px', backgroundColor: 'transparent',
          color: '#6B7280', transition: 'all 0.15s', textAlign: 'left'
        }}>
          <ArrowLeft size={18} /> Retour au site
        </button>
        <button onClick={logoutAdmin} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
          fontSize: '14px', backgroundColor: 'transparent',
          color: '#DC2626', transition: 'all 0.15s', textAlign: 'left'
        }}>
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#F9FAFB' }}>

      {/* Sidebar desktop - toujours visible */}
      {!isMobile && <Sidebar />}

      {/* Sidebar mobile - overlay */}
      {isMobile && mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 30, backgroundColor: 'rgba(0,0,0,0.5)'
          }} />
          <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 40, height: '100vh' }}>
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Top bar */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #F3F4F6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button onClick={() => setMobileOpen(true)} style={{
                padding: '6px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF'
              }}>
                <Menu size={20} />
              </button>
            )}
            <div>
              <h1 style={{ fontWeight: 600, fontSize: '16px', color: '#1C1917', margin: 0 }}>
                {NAV_ITEMS.find(n => n.id === activeAdminPage)?.label || 'Dashboard'}
              </h1>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                {restaurant.name} · Espace Pro
              </p>
            </div>
          </div>
          <button onClick={logoutAdmin} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '14px', fontWeight: 500
          }}>
            <LogOut size={14} /> Déconnexion
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
