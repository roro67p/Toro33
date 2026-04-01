import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import Dashboard from './Dashboard'
import MenuAdmin from './MenuAdmin'
import DrinksAdmin from './DrinksAdmin'
import FormulesAdmin from './FormulesAdmin'
import CustomerOrdersAdmin from './CustomerOrdersAdmin'
import CaisseAdmin from './CaisseAdmin'
import StockAdmin from './StockAdmin'
import SuppliersAdmin from './SuppliersAdmin'
import CatalogAdmin from './CatalogAdmin'
import PurchaseOrdersAdmin from './PurchaseOrdersAdmin'
import ReviewsAdmin from './ReviewsAdmin'
import SettingsAdmin from './SettingsAdmin'
import { LayoutDashboard, UtensilsCrossed, Wine, Tag, ShoppingBag, Euro, Package, Truck, BookOpen, ShoppingCart, Star, Settings, Menu, X, LogOut, ArrowLeft } from 'lucide-react'

const NAV = [
  { id: 'dashboard',       label: 'Dashboard',          icon: LayoutDashboard },
  { id: 'customer-orders', label: 'Commandes clients',  icon: ShoppingBag },
  { id: 'caisse',          label: 'Caisse & CA',         icon: Euro },
  { id: 'menu',            label: 'Menu',                icon: UtensilsCrossed },
  { id: 'drinks',          label: 'Boissons',            icon: Wine },
  { id: 'formules',        label: 'Formules',            icon: Tag },
  { id: 'stock',           label: 'Stock',               icon: Package },
  { id: 'suppliers',       label: 'Fournisseurs',        icon: Truck },
  { id: 'catalog',         label: 'Catalogue achats',   icon: BookOpen },
  { id: 'purchase-orders', label: 'Commandes fourn.',    icon: ShoppingCart },
  { id: 'reviews',         label: 'Avis clients',        icon: Star },
  { id: 'settings',        label: 'Paramètres',          icon: Settings },
]

export default function AdminLayout() {
  const { data, activeAdminPage, setActiveAdminPage, logoutAdmin } = useStore()
  const newOrdersCount = (data.customerOrders || []).filter(o => o.status === 'new').length
  const pendingReviewsCount = (data.reviews || []).filter(r => !r.approved).length
  const { restaurant } = data
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const renderPage = () => {
    switch (activeAdminPage) {
      case 'dashboard':      return <Dashboard />
      case 'menu':           return <MenuAdmin />
      case 'drinks':         return <DrinksAdmin />
      case 'formules':       return <FormulesAdmin />
      case 'customer-orders':return <CustomerOrdersAdmin />
      case 'caisse':         return <CaisseAdmin />
      case 'stock':          return <StockAdmin />
      case 'suppliers':      return <SuppliersAdmin />
      case 'catalog':        return <CatalogAdmin />
      case 'purchase-orders':return <PurchaseOrdersAdmin />
      case 'reviews':        return <ReviewsAdmin />
      case 'settings':       return <SettingsAdmin />
      default:               return <Dashboard />
    }
  }

  const handleNav = (id) => { setActiveAdminPage(id); setMobileOpen(false) }

  const Sidebar = () => (
    <div style={{ width: '240px', minWidth: '240px', height: '100vh', backgroundColor: '#111827', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1F2937', flexShrink: 0 }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1F2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>🍔</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#E11D48' }}>{restaurant.name}</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>Administration</div>
          </div>
        </div>
        {isMobile && <button onClick={() => setMobileOpen(false)} style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>}
      </div>

      <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeAdminPage === id
          return (
            <button key={id} onClick={() => handleNav(id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              marginBottom: '2px', fontSize: '13px', fontWeight: active ? 600 : 400,
              backgroundColor: active ? '#E11D48' : 'transparent',
              color: active ? 'white' : '#9CA3AF', transition: 'all 0.15s', textAlign: 'left'
            }}>
              <Icon size={17} />
              <span style={{ flex: 1 }}>{label}</span>
              {id === 'customer-orders' && newOrdersCount > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: active ? 'rgba(255,255,255,0.3)' : '#E11D48', color: 'white', borderRadius: '999px', padding: '1px 6px' }}>{newOrdersCount}</span>
              )}
              {id === 'reviews' && pendingReviewsCount > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: active ? 'rgba(255,255,255,0.3)' : '#8B5CF6', color: 'white', borderRadius: '999px', padding: '1px 6px' }}>{pendingReviewsCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '10px', borderTop: '1px solid #1F2937' }}>
        <button onClick={() => { logoutAdmin(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', backgroundColor: 'transparent', color: '#9CA3AF', textAlign: 'left', marginBottom: '2px' }}>
          <ArrowLeft size={17} /> Retour au site
        </button>
        <button onClick={logoutAdmin} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', backgroundColor: 'transparent', color: '#EF4444', textAlign: 'left' }}>
          <LogOut size={17} /> Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#0F172A' }}>
      {!isMobile && <Sidebar />}
      {isMobile && mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30, backgroundColor: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 40, height: '100vh' }}><Sidebar /></div>
        </>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', backgroundColor: '#111827', borderBottom: '1px solid #1F2937', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button onClick={() => setMobileOpen(true)} style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}><Menu size={20} /></button>
            )}
            <div>
              <h1 style={{ fontWeight: 600, fontSize: '15px', color: 'white', margin: 0 }}>{NAV.find(n => n.id === activeAdminPage)?.label || 'Dashboard'}</h1>
              <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>{restaurant.name} · Espace Pro</p>
            </div>
          </div>
          <button onClick={logoutAdmin} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: '#1F2937', color: '#E11D48', fontSize: '13px', fontWeight: 500 }}>
            <LogOut size={14} /> Déconnexion
          </button>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#0F172A' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
