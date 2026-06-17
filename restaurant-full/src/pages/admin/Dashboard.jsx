import { useState } from 'react'
import useStore from '../../store/useStore'
import {
  Calendar, Users, TrendingUp, ShoppingBag, AlertTriangle,
  Clock, CheckCircle, XCircle, Star, MessageSquare, Euro, Package
} from 'lucide-react'

function fmtDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function Stars({ n }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#F59E0B' : '#E5E7EB', fontSize: '14px' }}>★</span>
      ))}
    </span>
  )
}

export default function Dashboard() {
  const { data, setActiveAdminPage, updateReservation, updateCustomerOrder, updateReview } = useStore()
  const { reservations, caisse, customerOrders, stock, reviews } = data
  const today = new Date().toISOString().split('T')[0]

  const todayRes      = reservations.filter(r => r.date === today && r.status !== 'cancelled')
  const pendingRes    = reservations.filter(r => r.status === 'pending')
  const tonightGuests = todayRes.reduce((s, r) => s + (parseInt(r.guests) || 0), 0)

  const newOrders     = (customerOrders || []).filter(o => o.status === 'new')
  const todayRevenue  = (caisse || []).find(c => c.date === today)?.revenue || 0
  const weekRevenue   = (caisse || []).slice(-7).reduce((s, c) => s + (c.revenue || 0), 0)
  const alertStock    = (stock || []).filter(s => s.quantity <= s.minThreshold)
  const pendingReviews = (reviews || []).filter(r => !r.approved)
  const avgRating     = reviews && reviews.filter(r => r.approved).length > 0
    ? (reviews.filter(r => r.approved).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.approved).length).toFixed(1)
    : '—'

  // Last 7 days chart data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const entry = (caisse || []).find(c => c.date === dateStr)
    return { date: dateStr, label: d.toLocaleDateString('fr-FR', { weekday: 'short' }), revenue: entry?.revenue || 0 }
  })
  const maxRev = Math.max(...last7.map(d => d.revenue), 1)

  const statCards = [
    { label: 'Commandes clients', value: newOrders.length, sub: 'nouvelles', icon: ShoppingBag, color: '#DC2626', bg: '#FEE2E2', action: () => setActiveAdminPage('customer-orders'), urgent: newOrders.length > 0 },
    { label: "Réservations aujourd'hui", value: todayRes.length, sub: `${tonightGuests} couverts`, icon: Calendar, color: '#D97706', bg: '#FEF3C7', action: () => setActiveAdminPage('reservations') },
    { label: 'CA du jour', value: `${todayRevenue.toFixed(0)}€`, sub: `${weekRevenue.toFixed(0)}€ cette semaine`, icon: Euro, color: '#10B981', bg: '#D1FAE5', action: () => setActiveAdminPage('caisse') },
    { label: 'Alertes stock', value: alertStock.length, sub: alertStock.length > 0 ? 'sous le seuil min.' : 'Tout est OK', icon: Package, color: alertStock.length > 0 ? '#F59E0B' : '#10B981', bg: alertStock.length > 0 ? '#FEF3C7' : '#D1FAE5', action: () => setActiveAdminPage('stock') },
  ]

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
          Tableau de bord
        </h2>
        <p className="text-sm mt-1" style={{ color: '#78716C' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <button key={i} onClick={s.action}
              className="bg-white rounded-2xl p-5 shadow-sm text-left transition-all hover:-translate-y-0.5 hover:shadow-md w-full"
              style={{ border: s.urgent ? `2px solid ${s.color}` : '2px solid transparent' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                {s.urgent && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
                    URGENT
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: '#1C1917' }}>{s.value}</div>
              <div className="text-xs font-medium" style={{ color: '#78716C' }}>{s.label}</div>
              <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{s.sub}</div>
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3 mb-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: '#1C1917' }}>Chiffre d'affaires — 7 derniers jours</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Total : {weekRevenue.toFixed(0)}€</p>
            </div>
            <button onClick={() => setActiveAdminPage('caisse')} className="text-xs font-semibold hover:opacity-70" style={{ color: '#D97706' }}>
              Voir la caisse →
            </button>
          </div>
          <div className="flex items-end gap-2" style={{ height: '120px' }}>
            {last7.map((d, i) => {
              const h = maxRev > 0 ? Math.max(4, Math.round((d.revenue / maxRev) * 100)) : 4
              const isToday = d.date === today
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  {d.revenue > 0 && (
                    <span className="text-xs font-semibold" style={{ color: isToday ? '#D97706' : '#94A3B8' }}>
                      {d.revenue >= 1000 ? `${(d.revenue/1000).toFixed(1)}k` : `${d.revenue}`}€
                    </span>
                  )}
                  <div style={{ width: '100%', height: `${h}%`, borderRadius: '6px 6px 0 0', backgroundColor: isToday ? '#D97706' : '#FDE68A', minHeight: '4px', transition: 'height 0.3s' }} />
                  <span className="text-xs font-medium" style={{ color: isToday ? '#D97706' : '#94A3B8', textTransform: 'capitalize' }}>{d.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: '#1C1917' }}>Résumé rapide</h3>
          {[
            { label: 'Réservations en attente', value: pendingRes.length, color: '#F59E0B', action: () => setActiveAdminPage('reservations') },
            { label: 'Avis à modérer', value: pendingReviews.length, color: '#8B5CF6', action: () => setActiveAdminPage('reviews') },
            { label: 'Note moyenne', value: `${avgRating} ★`, color: '#F59E0B', action: () => setActiveAdminPage('reviews') },
            { label: 'Articles en rupture', value: alertStock.length, color: alertStock.length > 0 ? '#DC2626' : '#10B981', action: () => setActiveAdminPage('stock') },
          ].map((item, i) => (
            <button key={i} onClick={item.action} className="w-full flex items-center justify-between py-2 transition-opacity hover:opacity-70">
              <span className="text-sm" style={{ color: '#78716C' }}>{item.label}</span>
              <span className="font-bold text-sm" style={{ color: item.color }}>{item.value}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 mb-5">
        {/* New customer orders */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} style={{ color: '#DC2626' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#1C1917' }}>Nouvelles commandes</h3>
              {newOrders.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>{newOrders.length}</span>
              )}
            </div>
            <button onClick={() => setActiveAdminPage('customer-orders')} className="text-xs font-semibold hover:opacity-70" style={{ color: '#D97706' }}>Tout voir →</button>
          </div>
          {newOrders.length === 0 ? (
            <div className="text-center py-10" style={{ color: '#94A3B8' }}>
              <ShoppingBag size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune nouvelle commande</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
              {newOrders.slice(0, 4).map(order => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: '#D97706' }}>#{order.orderNumber}</span>
                      <span className="text-sm" style={{ color: '#1C1917' }}>{order.customerName}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                      {order.type === 'takeaway' ? '🥡 À emporter' : `🍽️ Table ${order.table}`} · {order.total?.toFixed(2)}€
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => updateCustomerOrder(order.id, { status: 'preparing' })}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                      style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                      Préparer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today reservations */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: '#D97706' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#1C1917' }}>Réservations du jour</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>{tonightGuests} couverts</span>
            </div>
            <button onClick={() => setActiveAdminPage('reservations')} className="text-xs font-semibold hover:opacity-70" style={{ color: '#D97706' }}>Tout voir →</button>
          </div>
          {todayRes.length === 0 ? (
            <div className="text-center py-10" style={{ color: '#94A3B8' }}>
              <Calendar size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune réservation aujourd'hui</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
              {todayRes.sort((a,b) => a.time.localeCompare(b.time)).slice(0, 4).map(res => (
                <div key={res.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: '#1C1917' }}>{res.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: res.status === 'confirmed' ? '#D1FAE5' : '#FEF3C7', color: res.status === 'confirmed' ? '#065F46' : '#92400E' }}>
                        {res.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                      {res.time} · {res.guests} pers.{res.notes ? ` · ${res.notes}` : ''}
                    </div>
                  </div>
                  {res.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => updateReservation(res.id, { status: 'confirmed' })}
                        className="p-1.5 rounded-lg" style={{ backgroundColor: '#D1FAE5', color: '#16A34A' }}>
                        <CheckCircle size={14} />
                      </button>
                      <button onClick={() => updateReservation(res.id, { status: 'cancelled' })}
                        className="p-1.5 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                        <XCircle size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Stock alerts */}
        {alertStock.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
                <h3 className="font-semibold text-sm" style={{ color: '#1C1917' }}>Alertes stock</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>{alertStock.length}</span>
              </div>
              <button onClick={() => setActiveAdminPage('stock')} className="text-xs font-semibold hover:opacity-70" style={{ color: '#D97706' }}>Gérer →</button>
            </div>
            <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
              {alertStock.slice(0, 4).map(item => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{item.name}</span>
                  <span className="text-sm font-bold" style={{ color: item.quantity === 0 ? '#DC2626' : '#F59E0B' }}>
                    {item.quantity} {item.unit}
                    <span className="text-xs font-normal ml-1" style={{ color: '#94A3B8' }}>(min: {item.minThreshold})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest reviews */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
            <div className="flex items-center gap-2">
              <Star size={18} style={{ color: '#F59E0B' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#1C1917' }}>Derniers avis</h3>
              <span className="text-xs font-semibold" style={{ color: '#F59E0B' }}>{avgRating} ★ moyenne</span>
            </div>
            <button onClick={() => setActiveAdminPage('reviews')} className="text-xs font-semibold hover:opacity-70" style={{ color: '#D97706' }}>Tout voir →</button>
          </div>
          {(reviews || []).filter(r => r.approved).length === 0 ? (
            <div className="text-center py-10" style={{ color: '#94A3B8' }}>
              <Star size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun avis approuvé</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
              {(reviews || []).filter(r => r.approved).slice(-3).reverse().map(rev => (
                <div key={rev.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm" style={{ color: '#1C1917' }}>{rev.name}</span>
                    <Stars n={rev.rating} />
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#78716C' }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
          {pendingReviews.length > 0 && (
            <div className="px-5 py-3" style={{ backgroundColor: '#F5F3FF', borderTop: '1px solid #EDE9FE' }}>
              <button onClick={() => setActiveAdminPage('reviews')} className="text-xs font-semibold hover:opacity-70" style={{ color: '#7C3AED' }}>
                {pendingReviews.length} avis en attente de modération →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
