import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Check, X, ShoppingCart, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, Printer, Search } from 'lucide-react'

const STATUS_CONFIG = {
  pending:  { label: 'Brouillon',  bg: '#F3F4F6', color: '#6B7280', icon: Clock },
  ordered:  { label: 'Commandé',   bg: '#DBEAFE', color: '#1D4ED8', icon: Truck },
  received: { label: 'Reçu',       bg: '#D1FAE5', color: '#065F46', icon: CheckCircle }
}

const UNITS = ['kg','g','L','cl','pièces','boîtes','bouteilles','sachets','caisses','douzaines']

function EmptyLine() {
  return { id: Date.now() + Math.random(), stockId: '', name: '', quantity: '', unit: 'kg', unitPrice: '', note: '' }
}

function OrderCard({ order, suppliers, stock, onUpdate, onDelete, onReceive }) {
  const [expanded, setExpanded] = useState(false)
  const supplier = suppliers.find(s => s.id === order.supplierId)
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const Icon = cfg.icon

  const handlePrint = () => {
    const w = window.open('', '_blank')
    w.document.write(`
      <html><head><title>Commande ${order.id}</title>
      <style>body{font-family:Arial,sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background:#f5f5f5;} .total{font-weight:bold;font-size:1.1em;}</style>
      </head><body>
      <h2>Bon de commande</h2>
      <p><strong>Fournisseur :</strong> ${supplier?.name || '—'}</p>
      <p><strong>Date :</strong> ${order.createdAt}</p>
      ${order.deliveryDate ? `<p><strong>Livraison souhaitée :</strong> ${order.deliveryDate}</p>` : ''}
      ${order.notes ? `<p><strong>Notes :</strong> ${order.notes}</p>` : ''}
      <table>
        <tr><th>Produit</th><th>Qté</th><th>Unité</th><th>Prix unit.</th><th>Sous-total</th></tr>
        ${(order.items||[]).map(i => `<tr><td>${i.name}${i.note ? ` <em>(${i.note})</em>` : ''}</td><td>${i.quantity}</td><td>${i.unit}</td><td>${parseFloat(i.unitPrice||0).toFixed(2)}€</td><td>${(i.quantity*parseFloat(i.unitPrice||0)).toFixed(2)}€</td></tr>`).join('')}
        <tr><td colspan="4" class="total" style="text-align:right">TOTAL</td><td class="total">${order.total?.toFixed(2)}€</td></tr>
      </table>
      </body></html>
    `)
    w.document.close()
    w.print()
  }

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
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); handlePrint() }} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#9CA3AF' }} title="Imprimer"><Printer size={14} /></button>
          {order.status === 'pending' && <>
            <button onClick={e => { e.stopPropagation(); onUpdate(order.id, { status: 'ordered' }) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
              <Truck size={12} className="inline mr-1" />Envoyer
            </button>
            <button onClick={e => { e.stopPropagation(); onDelete(order.id) }} className="p-1.5 rounded-lg hover:text-red-500" style={{ color: '#9CA3AF' }}><Trash2 size={14} /></button>
          </>}
          {order.status === 'ordered' && (
            <button onClick={e => { e.stopPropagation(); onReceive(order.id) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
              <CheckCircle size={12} className="inline mr-1" />Réceptionner
            </button>
          )}
          {expanded ? <ChevronUp size={16} style={{ color: '#9CA3AF' }} /> : <ChevronDown size={16} style={{ color: '#9CA3AF' }} />}
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ backgroundColor: '#FAFAFA' }}>
              {['Produit', 'Note', 'Quantité', 'Unité', 'Prix/unité', 'Sous-total'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: ['Quantité','Prix/unité','Sous-total'].includes(h) ? 'right' : 'left', color: '#6B7280', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {(order.items||[]).map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '8px 12px', color: '#1C1917', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '8px 12px', color: '#9CA3AF', fontStyle: 'italic', fontSize: '12px' }}>{item.note || '—'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#6B7280' }}>{item.quantity}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#6B7280' }}>{item.unit}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#6B7280' }}>{parseFloat(item.unitPrice||0).toFixed(2)}€</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#D97706' }}>{(item.quantity * parseFloat(item.unitPrice||0)).toFixed(2)}€</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #E5E7EB' }}>
                <td colSpan={5} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#1C1917' }}>TOTAL</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#D97706', fontSize: '15px' }}>{order.total?.toFixed(2)}€</td>
              </tr>
            </tbody>
          </table>
          {order.notes && <p className="text-xs mt-3 italic px-2" style={{ color: '#9CA3AF' }}>💬 {order.notes}</p>}
          {order.status === 'received' && <p className="text-xs mt-2 text-center font-medium p-2 rounded-lg" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>✅ Stock mis à jour automatiquement à la réception</p>}
        </div>
      )}
    </div>
  )
}

function LineEditor({ line, index, stock, onChange, onRemove }) {
  const [search, setSearch] = useState('')
  const [showSugg, setShowSugg] = useState(false)

  const suggestions = search.length > 1
    ? stock.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : []

  const selectStock = (s) => {
    onChange(index, { stockId: s.id, name: s.name, unit: s.unit, unitPrice: s.costPrice.toString() })
    setSearch(s.name); setShowSugg(false)
  }

  return (
    <div className="grid gap-2 items-start p-3 rounded-xl" style={{ backgroundColor: '#FAFAFA', border: '1px solid #F3F4F6', gridTemplateColumns: '2fr 1.2fr 0.8fr 1fr 1fr 1.2fr auto' }}>
      {/* Produit avec autocomplete */}
      <div className="relative">
        <input
          placeholder="Nom du produit *"
          value={line.name || search}
          onChange={e => { onChange(index, { name: e.target.value, stockId: '' }); setSearch(e.target.value); setShowSugg(true) }}
          onFocus={() => setShowSugg(true)}
          onBlur={() => setTimeout(() => setShowSugg(false), 150)}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
        />
        {showSugg && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', marginTop: '2px' }}>
            {suggestions.map(s => (
              <button key={s.id} onMouseDown={() => selectStock(s)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 flex items-center justify-between"
                style={{ color: '#1C1917' }}>
                <span>{s.name}</span>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>{s.quantity} {s.unit} en stock · {s.costPrice}€/{s.unit}</span>
              </button>
            ))}
            <div className="px-3 py-1.5 text-xs" style={{ color: '#9CA3AF', borderTop: '1px solid #F3F4F6' }}>
              Ou tapez librement un produit non référencé
            </div>
          </div>
        )}
      </div>
      <input placeholder="Note (optionnel)" value={line.note} onChange={e => onChange(index, { note: e.target.value })}
        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
      <input type="number" step="0.1" min="0" placeholder="Qté *" value={line.quantity} onChange={e => onChange(index, { quantity: e.target.value })}
        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
      <select value={line.unit} onChange={e => onChange(index, { unit: e.target.value })}
        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
        {UNITS.map(u => <option key={u}>{u}</option>)}
      </select>
      <input type="number" step="0.01" min="0" placeholder="€/unité" value={line.unitPrice} onChange={e => onChange(index, { unitPrice: e.target.value })}
        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
      <div className="px-3 py-2 rounded-lg text-sm font-semibold text-right" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
        {((parseFloat(line.quantity)||0) * (parseFloat(line.unitPrice)||0)).toFixed(2)}€
      </div>
      <button onClick={() => onRemove(index)} className="p-2 rounded-lg hover:text-red-500 flex-shrink-0" style={{ color: '#9CA3AF' }}><X size={14} /></button>
    </div>
  )
}

export default function OrdersAdmin() {
  const { data, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, receivePurchaseOrder } = useStore()
  const [creating, setCreating] = useState(false)
  const [suppId, setSuppId] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState([EmptyLine()])
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = [...data.purchaseOrders]
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const updateLine = (i, patch) => setLines(l => l.map((ln, idx) => idx === i ? { ...ln, ...patch } : ln))
  const removeLine = (i) => setLines(l => l.filter((_, idx) => idx !== i))
  const addLine = () => setLines(l => [...l, EmptyLine()])

  const addLowStockLines = () => {
    const low = (data.stock || []).filter(s => s.quantity <= s.minThreshold)
    if (!low.length) return
    const newLines = low.map(s => ({ id: Date.now() + Math.random(), stockId: s.id, name: s.name, quantity: (s.minThreshold * 3).toString(), unit: s.unit, unitPrice: s.costPrice.toString(), note: `Stock bas : ${s.quantity} ${s.unit} restant` }))
    setLines(l => [...l.filter(ln => ln.name), ...newLines])
  }

  const total = lines.reduce((sum, l) => sum + (parseFloat(l.quantity)||0) * (parseFloat(l.unitPrice)||0), 0)

  const submit = () => {
    const validLines = lines.filter(l => l.name.trim() && l.quantity)
    if (!suppId || !validLines.length) return
    addPurchaseOrder({
      supplierId: suppId, deliveryDate, notes,
      items: validLines.map(({ id, ...l }) => ({ ...l, quantity: parseFloat(l.quantity)||0, unitPrice: parseFloat(l.unitPrice)||0 })),
      total
    })
    setSuppId(''); setDeliveryDate(''); setNotes(''); setLines([EmptyLine()]); setCreating(false)
  }

  const lowStockCount = (data.stock || []).filter(s => s.quantity <= s.minThreshold).length

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Commandes fournisseurs</h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            {(data.purchaseOrders||[]).filter(o => o.status === 'ordered').length} en cours · {(data.purchaseOrders||[]).filter(o => o.status === 'pending').length} brouillon(s)
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#D97706', color: 'white' }}>
          <ShoppingCart size={16} />Nouvelle commande
        </button>
      </div>

      {lowStockCount > 0 && !creating && (
        <div className="mb-4 p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D' }}>
          <span className="text-sm font-medium" style={{ color: '#92400E' }}>⚠️ {lowStockCount} produit(s) en stock bas</span>
          <button onClick={() => { setCreating(true); setTimeout(addLowStockLines, 100) }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
            Commander les produits manquants
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-5">
        {[['all', 'Toutes'], ['pending', 'Brouillons'], ['ordered', 'Commandées'], ['received', 'Reçues']].map(([v, l]) => (
          <button key={v} onClick={() => setStatusFilter(v)} className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={statusFilter === v ? { backgroundColor: '#D97706', color: 'white' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>{l}</button>
        ))}
      </div>

      {creating && (
        <div className="mb-6 p-5 rounded-2xl space-y-5" style={{ backgroundColor: '#FFFBEB', border: '2px solid #FCD34D' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base" style={{ color: '#92400E' }}>📋 Nouvelle commande</h3>
            <button onClick={() => setCreating(false)} style={{ color: '#9CA3AF' }}><X size={18} /></button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Fournisseur *</label>
              <select value={suppId} onChange={e => setSuppId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                <option value="">— Choisir —</option>
                {(data.suppliers||[]).filter(s => s.active).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                <option value="__free">🆓 Fournisseur libre (saisir dans notes)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Livraison souhaitée</label>
              <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Notes / instructions</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Instructions spéciales..."
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold" style={{ color: '#44403C' }}>Articles à commander</label>
              <div className="flex gap-2">
                {lowStockCount > 0 && (
                  <button onClick={addLowStockLines} className="text-xs px-3 py-1 rounded-lg flex items-center gap-1"
                    style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                    ⚠️ Ajouter produits en alerte
                  </button>
                )}
              </div>
            </div>
            {/* Header */}
            <div className="grid gap-2 px-3 pb-1 text-xs font-semibold" style={{ color: '#9CA3AF', gridTemplateColumns: '2fr 1.2fr 0.8fr 1fr 1fr 1.2fr auto' }}>
              <span>Produit</span><span>Note</span><span>Quantité</span><span>Unité</span><span>Prix/unité</span><span className="text-right">Sous-total</span><span></span>
            </div>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <LineEditor key={line.id} line={line} index={i} stock={data.stock||[]} onChange={updateLine} onRemove={removeLine} />
              ))}
            </div>
            <button onClick={addLine} className="mt-2 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-amber-100"
              style={{ color: '#D97706' }}>
              <Plus size={14} />Ajouter une ligne
            </button>
          </div>

          <div className="flex items-center justify-between pt-3" style={{ borderTop: '2px solid #FDE68A' }}>
            <div>
              <span className="text-lg font-bold" style={{ color: '#92400E' }}>Total estimé : {total.toFixed(2)}€</span>
              <span className="text-xs ml-3" style={{ color: '#9CA3AF' }}>{lines.filter(l => l.name).length} article(s)</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCreating(false)} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
              <button onClick={submit} className="px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90"
                style={{ backgroundColor: '#D97706', color: 'white' }}>
                <ShoppingCart size={15} />Créer la commande
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(o => (
          <OrderCard key={o.id} order={o} suppliers={data.suppliers||[]} stock={data.stock||[]}
            onUpdate={updatePurchaseOrder} onDelete={deletePurchaseOrder} onReceive={receivePurchaseOrder} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#FAFAFA', border: '2px dashed #E5E7EB' }}>
            <ShoppingCart size={28} className="mx-auto mb-3 opacity-20" style={{ display: 'block', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Aucune commande</p>
          </div>
        )}
      </div>
    </div>
  )
}
