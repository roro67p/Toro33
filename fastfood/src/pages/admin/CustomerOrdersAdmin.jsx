import { useState, useRef } from 'react'
import useStore from '../../store/useStore'
import { Trash2, ChevronDown, ChevronUp, Printer } from 'lucide-react'

const STATUS_LABELS = { new: 'Nouvelle', preparing: 'En préparation', ready: 'Prête', delivered: 'Livrée', cancelled: 'Annulée' }
const STATUS_COLORS = { new: { bg: '#FFF1F2', color: '#E11D48' }, preparing: { bg: '#EFF6FF', color: '#1D4ED8' }, ready: { bg: '#F0FDF4', color: '#16A34A' }, delivered: { bg: '#1F2937', color: '#9CA3AF' }, cancelled: { bg: '#374151', color: '#9CA3AF' } }
const NEXT = { new: 'preparing', preparing: 'ready', ready: 'delivered' }
const NEXT_LABEL = { new: '▶ Démarrer', preparing: '✓ Prête', ready: '🚀 Livrée' }

function printTicket(order) {
  const win = window.open('', '_blank', 'width=300,height=500')
  win.document.write(`
    <html><head><title>Ticket #${order.orderNumber}</title>
    <style>body{font-family:monospace;font-size:13px;padding:10px;width:260px}
    h2{text-align:center;border-bottom:1px dashed #000;padding-bottom:8px}
    .row{display:flex;justify-content:space-between;margin:4px 0}
    .total{border-top:1px dashed #000;margin-top:8px;padding-top:8px;font-weight:bold;font-size:15px}
    .footer{text-align:center;margin-top:12px;font-size:11px}
    </style></head><body>
    <h2>🍔 BurgerStop<br/><small>Commande #${order.orderNumber}</small></h2>
    <div class="row"><span>${order.type === 'takeaway' ? '🥡 À emporter' : order.type === 'delivery' ? '🛵 Livraison' : '🍽️ Sur place'}</span><span>${new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span></div>
    <div class="row"><span>${order.customerName}</span><span>${order.phone || ''}</span></div>
    <br/>
    ${order.items?.map(i => `<div class="row"><span>${i.quantity}x ${i.name}${i.extras?.length ? '<br/><small>+ ' + i.extras.map(e => e.name).join(', ') + '</small>' : ''}</span><span>${(i.price * i.quantity).toFixed(2)}€</span></div>`).join('')}
    ${order.promoCode ? `<div class="row"><span>Promo (${order.promoCode})</span><span>-${order.promoDiscount?.toFixed(2)}€</span></div>` : ''}
    <div class="total row"><span>TOTAL</span><span>${order.total?.toFixed(2)}€</span></div>
    ${order.note ? `<br/><div>Note: ${order.note}</div>` : ''}
    ${order.address ? `<div>Adresse: ${order.address}</div>` : ''}
    <div class="footer">Merci de votre commande !<br/>BurgerStop Lyon</div>
    </body></html>
  `)
  win.document.close()
  win.print()
}

export default function CustomerOrdersAdmin() {
  const { data, updateCustomerOrder, deleteCustomerOrder } = useStore()
  const orders = (data.customerOrders || []).slice().reverse()
  const [filter, setFilter] = useState('active')
  const [expanded, setExpanded] = useState({})

  const filtered = filter === 'active'
    ? orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
    : filter === 'all' ? orders
    : orders.filter(o => o.status === filter)

  const counts = {
    active: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
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
                      <span className="font-black" style={{ color: '#E11D48' }}>#{order.orderNumber}</span>
                      <span className="font-semibold text-white">{order.customerName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: sc.bg, color: sc.color }}>{STATUS_LABELS[order.status]}</span>
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        {order.type === 'takeaway' ? '🥡 Emporter' : order.type === 'delivery' ? '🛵 Livraison' : '🍽️ Sur place'}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                      {time} · {order.items?.length} article(s) · <strong style={{ color: '#E11D48' }}>{order.total?.toFixed(2)}€</strong>
                      {order.promoCode && <span style={{ color: '#10B981' }}> · Promo {order.promoCode}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {NEXT[order.status] && (
                      <button onClick={() => updateCustomerOrder(order.id, { status: NEXT[order.status] })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: '#E11D48' }}>
                        {NEXT_LABEL[order.status]}
                      </button>
                    )}
                    <button onClick={() => printTicket(order)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Printer size={14} /></button>
                    {!['delivered', 'cancelled'].includes(order.status) && (
                      <button onClick={() => updateCustomerOrder(order.id, { status: 'cancelled' })} className="p-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#EF4444' }}>✗</button>
                    )}
                    <button onClick={() => { if (window.confirm('Supprimer ?')) deleteCustomerOrder(order.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                    {isExpanded ? <ChevronUp size={16} style={{ color: '#6B7280' }} /> : <ChevronDown size={16} style={{ color: '#6B7280' }} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4" style={{ borderTop: '1px solid #374151' }}>
                    <div className="pt-3 space-y-1.5">
                      {order.items?.map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: '#D1D5DB' }}>{item.quantity}x {item.name}</span>
                            <span style={{ color: '#9CA3AF' }}>{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                          {item.extras?.length > 0 && (
                            <div className="text-xs ml-4" style={{ color: '#6B7280' }}>
                              + {item.extras.map(e => `${e.name} (+${e.price.toFixed(2)}€)`).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                      {order.promoCode && (
                        <div className="flex justify-between text-sm">
                          <span style={{ color: '#10B981' }}>Code promo ({order.promoCode})</span>
                          <span style={{ color: '#10B981' }}>-{order.promoDiscount?.toFixed(2)}€</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2" style={{ borderTop: '1px solid #374151' }}>
                        <span className="text-white">Total</span>
                        <span style={{ color: '#E11D48' }}>{order.total?.toFixed(2)}€</span>
                      </div>
                      {order.note && <p className="text-xs mt-2 p-2 rounded-lg" style={{ backgroundColor: '#111827', color: '#9CA3AF' }}>Note cuisine : {order.note}</p>}
                      {order.address && <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>📍 {order.address}</p>}
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
