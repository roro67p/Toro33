import useStore from '../../store/useStore'
import { ShoppingBag, Euro, Package, Star, TrendingUp, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

function Stars({ n }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= n ? '#F59E0B' : '#374151', fontSize: '13px' }}>★</span>)}</span>
}

export default function Dashboard() {
  const { data, setActiveAdminPage, updateCustomerOrder } = useStore()
  const { caisse, customerOrders, stock, reviews } = data
  const today = new Date().toISOString().split('T')[0]

  const newOrders    = (customerOrders || []).filter(o => o.status === 'new')
  const todayRevenue = (caisse || []).find(c => c.date === today)?.revenue || 0
  const weekRevenue  = (caisse || []).slice(-7).reduce((s, c) => s + (c.revenue || 0), 0)
  const alertStock   = (stock || []).filter(s => s.quantity <= s.minThreshold)
  const pendingReviews = (reviews || []).filter(r => !r.approved)
  const avgRating    = (reviews || []).filter(r => r.approved).length > 0
    ? ((reviews.filter(r => r.approved).reduce((s, r) => s + r.rating, 0)) / reviews.filter(r => r.approved).length).toFixed(1)
    : '—'

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().split('T')[0]
    const entry = (caisse || []).find(c => c.date === ds)
    return { date: ds, label: d.toLocaleDateString('fr-FR', { weekday: 'short' }), revenue: entry?.revenue || 0 }
  })
  const maxRev = Math.max(...last7.map(d => d.revenue), 1)

  const stats = [
    { label: 'Nouvelles commandes', value: newOrders.length, sub: 'à traiter', icon: ShoppingBag, color: '#E11D48', bg: '#FFF1F2', urgent: newOrders.length > 0, action: () => setActiveAdminPage('customer-orders') },
    { label: 'CA du jour',          value: `${todayRevenue.toFixed(0)}€`, sub: `${weekRevenue.toFixed(0)}€ cette semaine`, icon: Euro, color: '#10B981', bg: '#ECFDF5', action: () => setActiveAdminPage('caisse') },
    { label: 'Alertes stock',       value: alertStock.length, sub: alertStock.length > 0 ? 'sous le seuil' : 'Stock OK', icon: Package, color: alertStock.length > 0 ? '#F59E0B' : '#10B981', bg: alertStock.length > 0 ? '#FFFBEB' : '#ECFDF5', action: () => setActiveAdminPage('stock') },
    { label: 'Note moyenne',        value: `${avgRating} ★`, sub: `${pendingReviews.length} avis à modérer`, icon: Star, color: '#F59E0B', bg: '#FFFBEB', action: () => setActiveAdminPage('reviews') },
  ]

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Tableau de bord</h2>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <button key={i} onClick={s.action} className="rounded-2xl p-5 text-left transition-all hover:-translate-y-0.5 w-full"
              style={{ backgroundColor: '#1F2937', border: s.urgent ? `2px solid ${s.color}` : '2px solid #374151' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                {s.urgent && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>URGENT</span>}
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
              <div className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{s.label}</div>
              <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{s.sub}</div>
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3 mb-5">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ backgroundColor: '#1F2937' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">CA — 7 derniers jours</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Total : {weekRevenue.toFixed(0)}€</p>
            </div>
            <button onClick={() => setActiveAdminPage('caisse')} className="text-xs font-semibold" style={{ color: '#E11D48' }}>Voir la caisse →</button>
          </div>
          <div className="flex items-end gap-2" style={{ height: '120px' }}>
            {last7.map((d, i) => {
              const h = Math.max(4, Math.round((d.revenue / maxRev) * 100))
              const isToday = d.date === today
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  {d.revenue > 0 && <span className="text-xs font-semibold" style={{ color: isToday ? '#E11D48' : '#6B7280' }}>{d.revenue >= 1000 ? `${(d.revenue/1000).toFixed(1)}k` : d.revenue}€</span>}
                  <div style={{ width: '100%', height: `${h}%`, borderRadius: '6px 6px 0 0', backgroundColor: isToday ? '#E11D48' : '#374151', minHeight: '4px' }} />
                  <span className="text-xs" style={{ color: isToday ? '#E11D48' : '#6B7280', textTransform: 'capitalize' }}>{d.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#1F2937' }}>
          <h3 className="font-semibold text-white mb-4">Résumé</h3>
          {[
            { label: 'Commandes en cours', value: (customerOrders || []).filter(o => o.status === 'preparing').length, color: '#3B82F6', action: () => setActiveAdminPage('customer-orders') },
            { label: 'Avis à modérer', value: pendingReviews.length, color: '#8B5CF6', action: () => setActiveAdminPage('reviews') },
            { label: 'Ruptures de stock', value: alertStock.filter(s => s.quantity === 0).length, color: '#EF4444', action: () => setActiveAdminPage('stock') },
            { label: 'Commandes fourn. en attente', value: (data.purchaseOrders || []).filter(o => o.status === 'pending').length, color: '#F59E0B', action: () => setActiveAdminPage('purchase-orders') },
          ].map((item, i) => (
            <button key={i} onClick={item.action} className="w-full flex items-center justify-between py-2.5 border-b transition-opacity hover:opacity-70"
              style={{ borderColor: '#374151' }}>
              <span className="text-sm" style={{ color: '#9CA3AF' }}>{item.label}</span>
              <span className="font-bold text-sm" style={{ color: item.color }}>{item.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* New orders */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} style={{ color: '#E11D48' }} />
            <h3 className="font-semibold text-white text-sm">Nouvelles commandes</h3>
            {newOrders.length > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFF1F2', color: '#E11D48' }}>{newOrders.length}</span>}
          </div>
          <button onClick={() => setActiveAdminPage('customer-orders')} className="text-xs font-semibold" style={{ color: '#E11D48' }}>Tout voir →</button>
        </div>
        {newOrders.length === 0 ? (
          <div className="text-center py-10" style={{ color: '#6B7280' }}>
            <ShoppingBag size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucune nouvelle commande</p>
          </div>
        ) : (
          <div>
            {newOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #374151' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: '#E11D48' }}>#{order.orderNumber}</span>
                    <span className="text-sm text-white">{order.customerName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }}>
                      {order.type === 'takeaway' ? '🥡 À emporter' : order.type === 'delivery' ? '🛵 Livraison' : '🍽️ Sur place'}
                    </span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                    {order.items?.map(i => i.name).join(', ')} · {order.total?.toFixed(2)}€
                  </div>
                </div>
                <button onClick={() => updateCustomerOrder(order.id, { status: 'preparing' })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                  Préparer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
