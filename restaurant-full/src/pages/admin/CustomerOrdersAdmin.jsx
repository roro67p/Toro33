import { useState } from 'react'
import useStore from '../../store/useStore'
import { Trash2, Clock, ChefHat, CheckCheck, Package } from 'lucide-react'

const STATUSES = [
  { id: 'new',       label: 'Nouveau',        icon: Clock,     bg: '#FEF3C7', color: '#92400E' },
  { id: 'preparing', label: 'En préparation', icon: ChefHat,   bg: '#EFF6FF', color: '#1D4ED8' },
  { id: 'ready',     label: 'Prêt',           icon: Package,   bg: '#F0FDF4', color: '#16A34A' },
  { id: 'done',      label: 'Livré',          icon: CheckCheck,bg: '#F5F5F4', color: '#57534E' },
]

function fmtTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) +
    ' — ' + d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export default function CustomerOrdersAdmin() {
  const { data, updateCustomerOrder, deleteCustomerOrder } = useStore()
  const orders = (data.customerOrders || []).slice().reverse()
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const counts = STATUSES.reduce((acc, s) => {
    acc[s.id] = orders.filter(o => o.status === s.id).length
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Commandes clients</h1>
        <p className="text-sm mt-1" style={{ color: '#78716C' }}>Commandes passées depuis le site public</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {STATUSES.map(s => {
          const Icon = s.icon
          return (
            <div key={s.id} className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all hover:opacity-80"
              style={{ backgroundColor: s.bg, border: filter === s.id ? `2px solid ${s.color}` : '2px solid transparent' }}
              onClick={() => setFilter(filter === s.id ? 'all' : s.id)}>
              <Icon size={20} style={{ color: s.color }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{counts[s.id]}</div>
                <div className="text-xs font-medium" style={{ color: s.color }}>{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ backgroundColor: filter === 'all' ? '#1C1917' : '#F5F5F4', color: filter === 'all' ? 'white' : '#57534E' }}
        >
          Toutes ({orders.length})
        </button>
        {STATUSES.map(s => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: filter === s.id ? s.bg : '#F5F5F4', color: filter === s.id ? s.color : '#57534E' }}
          >
            {s.label} ({counts[s.id]})
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#F5F5F4' }}>
          <p className="text-lg font-semibold" style={{ color: '#1C1917' }}>Aucune commande</p>
          <p className="text-sm mt-1" style={{ color: '#78716C' }}>Les commandes du site public apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const statusInfo = STATUSES.find(s => s.id === order.status) || STATUSES[0]
            const isExpanded = expanded === order.id
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-xl font-bold" style={{ color: '#D97706' }}>#{order.orderNumber}</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: '#1C1917' }}>{order.customerName}</div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>{fmtTime(order.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: order.type === 'takeaway' ? '#F0FDF4' : '#EFF6FF',
                          color: order.type === 'takeaway' ? '#16A34A' : '#1D4ED8' }}>
                        {order.type === 'takeaway' ? '🥡 À emporter' : `🍽️ Table ${order.table}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                    <span className="font-bold text-base" style={{ color: '#D97706' }}>{order.total?.toFixed(2)}€</span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #F5F5F4' }}>
                    {/* Items */}
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>Articles</p>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5" style={{ borderBottom: i < order.items.length - 1 ? '1px solid #F5F5F4' : 'none' }}>
                          <div>
                            <span className="text-sm font-medium" style={{ color: '#1C1917' }}>{item.quantity}× {item.name}</span>
                            {item.priceType === 'glass' && <span className="text-xs ml-2" style={{ color: '#94A3B8' }}>verre</span>}
                            {item.priceType === 'bottle' && <span className="text-xs ml-2" style={{ color: '#94A3B8' }}>bouteille</span>}
                            {item.note && <div className="text-xs italic mt-0.5" style={{ color: '#78716C' }}>→ {item.note}</div>}
                          </div>
                          <span className="text-sm font-semibold" style={{ color: '#D97706' }}>
                            {(item.price * item.quantity).toFixed(2)}€
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Info */}
                    {(order.phone || order.notes) && (
                      <div className="px-4 pb-3 flex gap-4 text-sm" style={{ color: '#78716C' }}>
                        {order.phone && <span>📞 {order.phone}</span>}
                        {order.notes && <span>📝 {order.notes}</span>}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="px-4 pb-4 flex gap-2 flex-wrap">
                      {STATUSES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => updateCustomerOrder(order.id, { status: s.id })}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            backgroundColor: order.status === s.id ? s.bg : '#F5F5F4',
                            color: order.status === s.id ? s.color : '#78716C',
                            border: order.status === s.id ? `1.5px solid ${s.color}` : '1.5px solid transparent'
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button
                        onClick={() => { if (window.confirm('Supprimer cette commande ?')) deleteCustomerOrder(order.id) }}
                        className="ml-auto px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                        style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
                      >
                        <Trash2 size={12} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
