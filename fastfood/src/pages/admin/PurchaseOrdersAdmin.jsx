import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Check, X, Package, ShoppingCart } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }

export default function PurchaseOrdersAdmin() {
  const { data, addPurchaseOrder, deletePurchaseOrder, receivePurchaseOrder } = useStore()
  const [creating, setCreating] = useState(false)
  const [selSup, setSelSup] = useState('')
  const [orderItems, setOrderItems] = useState([])
  const [note, setNote] = useState('')

  const orders = [...(data.purchaseOrders || [])].reverse()
  const suppliers = data.suppliers || []
  const catalog = data.supplierCatalog || []
  const supCatalog = catalog.filter(i => i.supplierId === selSup)

  const addItem = (catItem) => {
    const existing = orderItems.find(i => i.catalogId === catItem.id)
    if (existing) setOrderItems(p => p.map(i => i.catalogId === catItem.id ? { ...i, quantity: i.quantity + 1 } : i))
    else setOrderItems(p => [...p, { catalogId: catItem.id, name: catItem.name, unit: catItem.unit, price: catItem.price, quantity: 1 }])
  }
  const removeItem = (catalogId) => setOrderItems(p => p.filter(i => i.catalogId !== catalogId))
  const updateQty = (catalogId, qty) => {
    if (qty <= 0) return removeItem(catalogId)
    setOrderItems(p => p.map(i => i.catalogId === catalogId ? { ...i, quantity: qty } : i))
  }
  const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const supName = suppliers.find(s => s.id === selSup)?.name || ''

  const handleCreate = () => {
    if (!selSup || orderItems.length === 0) return
    addPurchaseOrder({ supplierId: selSup, supplierName: supName, items: orderItems, total, note })
    setCreating(false); setSelSup(''); setOrderItems([]); setNote('')
  }

  const statusLabel = { pending: 'En attente', received: 'Reçue' }
  const statusColor = { pending: '#F59E0B', received: '#10B981' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Commandes fournisseurs</h1>
        <button onClick={() => setCreating(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Nouvelle commande
        </button>
      </div>

      {creating && (
        <div className="mb-6 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
          <h2 className="font-bold text-white">Nouvelle commande fournisseur</h2>

          <div>
            <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Fournisseur</label>
            <select style={INPUT} value={selSup} onChange={e => { setSelSup(e.target.value); setOrderItems([]) }}>
              <option value="">— Choisir un fournisseur —</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {selSup && (
            <>
              <div>
                <p className="text-xs mb-2 font-semibold" style={{ color: '#9CA3AF' }}>Catalogue {supName}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {supCatalog.map(item => (
                    <button key={item.id} onClick={() => addItem(item)} className="flex items-center justify-between p-3 rounded-xl text-left transition-all hover:opacity-80"
                      style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
                      <div>
                        <div className="text-sm font-semibold text-white">{item.name}</div>
                        <div className="text-xs" style={{ color: '#6B7280' }}>{item.unit} · {item.price.toFixed(2)}€</div>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: '#E11D48' }}>
                        <Plus size={14} />
                        <span className="text-xs font-bold">{orderItems.find(i => i.catalogId === item.id)?.quantity || 0}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {orderItems.length > 0 && (
                <div>
                  <p className="text-xs mb-2 font-semibold" style={{ color: '#9CA3AF' }}>Articles sélectionnés</p>
                  <div className="space-y-2">
                    {orderItems.map(item => (
                      <div key={item.catalogId} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#111827' }}>
                        <span className="text-sm text-white">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <input type="number" min="1" value={item.quantity}
                            onChange={e => updateQty(item.catalogId, parseInt(e.target.value))}
                            style={{ ...INPUT, width: '70px', textAlign: 'center' }} />
                          <span className="text-xs" style={{ color: '#9CA3AF' }}>{item.unit}</span>
                          <span className="font-semibold text-sm" style={{ color: '#E11D48' }}>{(item.price * item.quantity).toFixed(2)}€</span>
                          <button onClick={() => removeItem(item.catalogId)} className="p-1 rounded" style={{ color: '#EF4444' }}><X size={14} /></button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2" style={{ borderTop: '1px solid #374151' }}>
                      <span className="text-white">Total</span>
                      <span style={{ color: '#E11D48' }}>{total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              )}

              <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Note</label><input style={INPUT} value={note} onChange={e => setNote(e.target.value)} placeholder="Urgence, commentaire..." /></div>
            </>
          )}

          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={!selSup || orderItems.length === 0}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: '#E11D48' }}>
              <ShoppingCart size={16} /> Passer la commande
            </button>
            <button onClick={() => { setCreating(false); setSelSup(''); setOrderItems([]) }} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#1F2937' }}>
            <Package size={40} className="mx-auto mb-3 opacity-30" style={{ color: '#9CA3AF' }} />
            <p className="text-white font-semibold">Aucune commande</p>
          </div>
        ) : orders.map(order => (
          <div key={order.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{order.supplierName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#111827', color: statusColor[order.status] }}>{statusLabel[order.status]}</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                  {new Date(order.createdAt + 'T00:00:00').toLocaleDateString('fr-FR')} · {order.items.length} article(s)
                  {order.note && ` · ${order.note}`}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold" style={{ color: '#E11D48' }}>{order.total.toFixed(2)}€</span>
                {order.status === 'pending' && (
                  <button onClick={() => receivePurchaseOrder(order.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                    <Check size={12} className="inline mr-1" />Réceptionné
                  </button>
                )}
                <button onClick={() => { if (window.confirm('Supprimer ?')) deletePurchaseOrder(order.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="px-5 pb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs py-1" style={{ borderTop: i === 0 ? '1px solid #374151' : 'none', color: '#9CA3AF' }}>
                  <span>{item.quantity}x {item.name} ({item.unit})</span>
                  <span>{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
