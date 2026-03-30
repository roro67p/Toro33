import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Check, X, ShoppingCart, Truck, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_CONFIG = {
  pending:  { label: 'Brouillon',  bg: '#F3F4F6', color: '#6B7280', icon: Clock },
  ordered:  { label: 'Commandé',   bg: '#DBEAFE', color: '#1D4ED8', icon: Truck },
  received: { label: 'Reçu',       bg: '#D1FAE5', color: '#065F46', icon: CheckCircle }
}

function OrderCard({ order, suppliers, stock, onUpdate, onDelete, onReceive }) {
  const [expanded, setExpanded] = useState(false)
  const supplier = suppliers.find(s => s.id === order.supplierId)
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const Icon = cfg.icon

  return (
    <div className="rounded-2xl overflow-hidden transition-all hover:shadow-md" style={{ border: '1px solid #E5E7EB', backgroundColor: 'white' }}>
      <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: '#FEF3C7' }}>🚚</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: '#1C1917' }}>{supplier?.name || 'Fournisseur inconnu'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
              <Icon size={11} />{cfg.label}
            </span>
          </div>
          <div className="flex gap-4 mt-0.5 flex-wrap">
            <span className="text-xs" style={{ color: '#9CA3AF' }}>Créé le {order.createdAt}</span>
            {order.deliveryDate && <span className="text-xs" style={{ color: '#9CA3AF' }}>Livraison : {order.deliveryDate}</span>}
            <span className="text-xs font-semibold" style={{ color: '#D97706' }}>Total : {order.total?.toFixed(2)}€</span>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>{order.items?.length || 0} article(s)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order.status === 'pending' && (
            <button onClick={e => { e.stopPropagation(); onUpdate(order.id, { status: 'ordered' }) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
              <Truck size={12} className="inline mr-1" />Envoyer
            </button>
          )}
          {order.status === 'ordered' && (
            <button onClick={e => { e.stopPropagation(); onReceive(order.id) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
              <CheckCircle size={12} className="inline mr-1" />Réceptionner
            </button>
          )}
          {order.status !== 'received' && (
            <button onClick={e => { e.stopPropagation(); onDelete(order.id) }} className="p-1.5 rounded-lg hover:text-red-500" style={{ color: '#9CA3AF' }}>
              <Trash2 size={14} />
            </button>
          )}
          {expanded ? <ChevronUp size={16} style={{ color: '#9CA3AF' }} /> : <ChevronDown size={16} style={{ color: '#9CA3AF' }} />}
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                {['Produit', 'Quantité', 'Prix/unité', 'Sous-total'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Produit' ? 'left' : 'right', color: '#6B7280', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '8px 12px', color: '#1C1917', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#6B7280' }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#6B7280' }}>{item.unitPrice?.toFixed(2)}€</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#D97706' }}>{(item.quantity * item.unitPrice).toFixed(2)}€</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #E5E7EB' }}>
                <td colSpan={3} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#1C1917' }}>TOTAL</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#D97706', fontSize: '15px' }}>{order.total?.toFixed(2)}€</td>
              </tr>
            </tbody>
          </table>
          {order.notes && <p className="text-xs mt-3 italic px-2" style={{ color: '#9CA3AF' }}>💬 {order.notes}</p>}
          {order.status === 'received' && <p className="text-xs mt-2 text-center font-medium" style={{ color: '#065F46' }}>✅ Stock mis à jour automatiquement à la réception</p>}
        </div>
      )}
    </div>
  )
}

export default function OrdersAdmin() {
  const { data, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, receivePurchaseOrder } = useStore()
  const [creating, setCreating] = useState(false)
  const [suppId, setSuppId] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState([{ stockId: '', name: '', quantity: '', unit: 'kg', unitPrice: '' }])
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = [...data.purchaseOrders]
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const addLine = () => setLines(l => [...l, { stockId: '', name: '', quantity: '', unit: 'kg', unitPrice: '' }])
  const removeLine = (i) => setLines(l => l.filter((_, idx) => idx !== i))
  const updateLine = (i, field, value) => setLines(l => l.map((ln, idx) => idx === i ? { ...ln, [field]: value } : ln))

  const selectStockItem = (i, stockId) => {
    const si = data.stock.find(s => s.id === stockId)
    if (si) updateLine(i, 'stockId', stockId)
    if (si) updateLine(i, 'name', si.name)
    if (si) updateLine(i, 'unit', si.unit)
    if (si) updateLine(i, 'unitPrice', si.costPrice.toString())
  }

  const total = lines.reduce((sum, l) => sum + (parseFloat(l.quantity) || 0) * (parseFloat(l.unitPrice) || 0), 0)

  const submit = () => {
    if (!suppId || lines.some(l => !l.name || !l.quantity)) return
    addPurchaseOrder({
      supplierId: suppId, deliveryDate, notes,
      items: lines.map(l => ({ ...l, quantity: parseFloat(l.quantity) || 0, unitPrice: parseFloat(l.unitPrice) || 0 })),
      total
    })
    setSuppId(''); setDeliveryDate(''); setNotes(''); setLines([{ stockId: '', name: '', quantity: '', unit: 'kg', unitPrice: '' }])
    setCreating(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Commandes fournisseurs</h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            {data.purchaseOrders.filter(o => o.status === 'ordered').length} en cours · {data.purchaseOrders.filter(o => o.status === 'pending').length} brouillon(s)
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#D97706', color: 'white' }}>
          <ShoppingCart size={16} />Nouvelle commande
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {[['all', 'Toutes'], ['pending', 'Brouillons'], ['ordered', 'Commandées'], ['received', 'Reçues']].map(([v, l]) => (
          <button key={v} onClick={() => setStatusFilter(v)} className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={statusFilter === v ? { backgroundColor: '#D97706', color: 'white' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>{l}</button>
        ))}
      </div>

      {creating && (
        <div className="mb-6 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#FFFBEB', border: '2px dashed #FCD34D' }}>
          <h3 className="font-bold" style={{ color: '#92400E' }}>Nouvelle commande</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Fournisseur *</label>
              <select value={suppId} onChange={e => setSuppId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                <option value="">— Choisir —</option>
                {data.suppliers.filter(s => s.active).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Date de livraison prévue</label>
              <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
          </div>

          {/* Lines */}
          <div>
            <label className="text-xs font-semibold block mb-2" style={{ color: '#44403C' }}>Articles à commander</label>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div key={i} className="grid gap-2 items-center" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto' }}>
                  <select value={line.stockId} onChange={e => selectStockItem(i, e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                    <option value="">— Produit —</option>
                    {data.stock.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    <option value="__custom">+ Saisie libre</option>
                  </select>
                  {line.stockId === '__custom' && (
                    <input placeholder="Nom" value={line.name} onChange={e => updateLine(i, 'name', e.target.value)}
                      className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
                  )}
                  <input type="number" step="0.1" placeholder="Qté" value={line.quantity} onChange={e => updateLine(i, 'quantity', e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
                  <select value={line.unit} onChange={e => updateLine(i, 'unit', e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                    {['kg','L','pièces','boîtes','bouteilles','sachets'].map(u => <option key={u}>{u}</option>)}
                  </select>
                  <input type="number" step="0.01" placeholder="€/unité" value={line.unitPrice} onChange={e => updateLine(i, 'unitPrice', e.target.value)}
                    className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
                  <button onClick={() => removeLine(i)} className="p-1.5 rounded-lg hover:text-red-500" style={{ color: '#9CA3AF' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addLine} className="mt-2 text-sm flex items-center gap-1" style={{ color: '#D97706' }}>
              <Plus size={14} />Ajouter un article
            </button>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Instructions spéciales..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>

          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #FDE68A' }}>
            <span className="font-bold" style={{ color: '#92400E' }}>Total estimé : {total.toFixed(2)}€</span>
            <div className="flex gap-2">
              <button onClick={() => setCreating(false)} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
              <button onClick={submit} className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
                <ShoppingCart size={14} className="inline mr-1" />Créer la commande
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(o => (
          <OrderCard key={o.id} order={o} suppliers={data.suppliers} stock={data.stock}
            onUpdate={updatePurchaseOrder} onDelete={deletePurchaseOrder} onReceive={receivePurchaseOrder} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#FAFAFA', border: '2px dashed #E5E7EB' }}>
            <ShoppingCart size={28} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Aucune commande</p>
          </div>
        )}
      </div>
    </div>
  )
}
