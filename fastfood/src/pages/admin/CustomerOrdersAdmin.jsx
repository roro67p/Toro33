import { useState } from 'react'
import useStore from '../../store/useStore'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_LABELS = { new: 'Nouvelle', preparing: 'En préparation', ready: 'Prête', delivered: 'Livrée / Servie', cancelled: 'Annulée' }
const STATUS_COLORS = { new: { bg: '#FFF1F2', color: '#E11D48' }, preparing: { bg: '#EFF6FF', color: '#1D4ED8' }, ready: { bg: '#F0FDF4', color: '#16A34A' }, delivered: { bg: '#F5F5F4', color: '#78716C' }, cancelled: { bg: '#374151', color: '#9CA3AF' } }
const NEXT = { new: 'preparing', preparing: 'ready', ready: 'delivered' }
const NEXT_LABEL = { new: 'Démarrer préparation', preparing: 'Marquer prête', ready: 'Marquer livrée' }

export default function CustomerOrdersAdmin() {
  const { data, updateCustomerOrder, deleteCustomerOrder } = useStore()
  const orders = (data.customerOrders || []).slice().reverse()
  const [filter, setFilter] = useState('active')
  const [expanded, setExpanded] = useState({})

  const filtered = filter === 'active'
    ? orders.filter(o => !['delivered','cancelled'].includes(o.status))
    : filter === 'all' ? orders
    : orders.filter(o => o.status === filter)

  const counts = {
    active: orders.filter(o => !['delivered','cancelled'].includes(o.status)).length,
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    all: orders.length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Commandes clients</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{counts.active} commande(s) active(s)</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'active', label: 'Actives', count: counts.active },
          { id: 'new', label: 'Nouvelles', count: counts.new },
          { id: 'preparing', label: 'En préparation', count: counts.preparing },
          { id: 'ready', label: 'Prêtes', count: counts.ready },
          { id: 'all', label: 'Toutes', count: counts.all },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            style={{ backgroundColor: filter === f.id ? '#E11D48' : '#1F2937', color: filter === f.id ? 'white' : '#9CA3AF', border: `1px solid ${filter === f.id ? '#E11D48' : '#374151'}` }}>
            {f.label}
            {f.count > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: filter === f.id ? 'rgba(255,255,255,0.2)' : '#374151' }}>{f.count}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#1F2937' }}>
          <p className="text-white font-semibold">Aucune commande</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.new
            const isExpanded = expanded[order.id]
            const time = new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            return (
              <div key={order.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: `1px solid ${order.status === 'new' ? '#E11D48' : '#374151'}` }}>
                <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(p => ({ ...p, [order.id]: !p[order.id] }))}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold" style={{ color: '#E11D48' }}>#{order.orderNumber}</span>
                      <span className="font-semibold text-white">{order.customerName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: sc.bg, color: sc.color }}>{STATUS_LABELS[order.status]}</span>
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        {order.type === 'takeaway' ? '🥡 À emporter' : order.type === 'delivery' ? '🛵 Livraison' : '🍽️ Sur place'}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                      {time} · {order.items?.length} article(s) · <strong style={{ color: '#E11D48' }}>{order.total?.toFixed(2)}€</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {NEXT[order.status] && (
                      <button onClick={e => { e.stopPropagation(); updateCustomerOrder(order.id, { status: NEXT[order.status] }) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                        style={{ backgroundColor: '#E11D48', color: 'white' }}>
                        {NEXT_LABEL[order.status]}
                      </button>
                    )}
                    {!['delivered','cancelled'].includes(order.status) && (
                      <button onClick={e => { e.stopPropagation(); updateCustomerOrder(order.id, { status: 'cancelled' }) }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#EF4444' }}>
                        Annuler
                      </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); if (window.confirm('Supprimer ?')) deleteCustomerOrder(order.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                    {isExpanded ? <ChevronUp size={16} style={{ color: '#6B7280' }} /> : <ChevronDown size={16} style={{ color: '#6B7280' }} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4" style={{ borderTop: '1px solid #374151' }}>
                    <div className="pt-3 space-y-1.5">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span style={{ color: '#D1D5DB' }}>{item.quantity}x {item.name}</span>
                          <span style={{ color: '#9CA3AF' }}>{(item.price * item.quantity).toFixed(2)}€</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold pt-2 mt-2" style={{ borderTop: '1px solid #374151' }}>
                        <span className="text-white">Total</span>
                        <span style={{ color: '#E11D48' }}>{order.total?.toFixed(2)}€</span>
                      </div>
                      {order.note && <p className="text-xs mt-2 p-2 rounded-lg" style={{ backgroundColor: '#111827', color: '#9CA3AF' }}>Note : {order.note}</p>}
                      {order.address && <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Livraison : {order.address}</p>}
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
