import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, CheckCircle, Clock, XCircle, FileText, Search, Minus } from 'lucide-react'

const STATUS_CONFIG = {
  'En cours': { color: 'bg-amber-100 text-amber-700', icon: Clock },
  'Servi': { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  'Annulé': { color: 'bg-red-100 text-red-700', icon: XCircle },
}

function NewOrderModal({ onClose }) {
  const { menuItems, clients, addOrder, createInvoice, orders } = useStore()
  const [clientId, setClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [items, setItems] = useState([])
  const [table, setTable] = useState('')
  const [notes, setNotes] = useState('')

  const available = menuItems.filter((m) => m.available)

  const addItem = (menuItem) => {
    const existing = items.find((i) => i.menuItemId === menuItem.id)
    if (existing) {
      setItems(items.map((i) => i.menuItemId === menuItem.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setItems([...items, { menuItemId: menuItem.id, name: menuItem.name, price: Number(menuItem.price), qty: 1 }])
    }
  }

  const removeItem = (menuItemId) => {
    const existing = items.find((i) => i.menuItemId === menuItemId)
    if (existing?.qty === 1) setItems(items.filter((i) => i.menuItemId !== menuItemId))
    else setItems(items.map((i) => i.menuItemId === menuItemId ? { ...i, qty: i.qty - 1 } : i))
  }

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0)
  const selectedClient = clients.find((c) => c.id === Number(clientId))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (items.length === 0) return alert('Ajoutez au moins un article')
    addOrder({
      clientId: clientId ? Number(clientId) : null,
      clientName: selectedClient ? selectedClient.name : clientName || 'Client comptoir',
      items,
      total,
      table,
      notes,
    })
    onClose()
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-gray-900">Nouvelle commande</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client (enregistré)</label>
                <select className={inputCls} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  <option value="">-- Sélectionner --</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ou nom libre</label>
                <input className={inputCls} value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client comptoir..." disabled={!!clientId} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table / Numéro</label>
                <input className={inputCls} value={table} onChange={(e) => setTable(e.target.value)} placeholder="Table 5..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Sans gluten..." />
              </div>
            </div>

            {/* Menu grid */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Articles du menu</p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto border rounded-lg p-2">
                {available.map((m) => {
                  const inOrder = items.find((i) => i.menuItemId === m.id)
                  return (
                    <button type="button" key={m.id} onClick={() => addItem(m)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${inOrder ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <p className="font-medium text-gray-900">{m.name}</p>
                      <p className="text-gray-500">{Number(m.price).toFixed(2)} €</p>
                      {inOrder && <span className="text-amber-600 font-bold">×{inOrder.qty}</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cart */}
            {items.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-gray-600">Article</th>
                      <th className="text-center px-3 py-2 text-gray-600">Qté</th>
                      <th className="text-right px-3 py-2 text-gray-600">Prix</th>
                      <th className="text-right px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.menuItemId} className="border-t">
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" onClick={() => removeItem(item.menuItemId)} className="p-0.5 hover:bg-gray-100 rounded"><Minus size={10} /></button>
                            <span className="w-5 text-center">{item.qty}</span>
                            <button type="button" onClick={() => addItem({ id: item.menuItemId, name: item.name, price: item.price })} className="p-0.5 hover:bg-gray-100 rounded"><Plus size={10} /></button>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right">{(item.price * item.qty).toFixed(2)} €</td>
                        <td className="px-3 py-2 text-right">
                          <button type="button" onClick={() => setItems(items.filter((i) => i.menuItemId !== item.menuItemId))} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-50 font-semibold">
                      <td colSpan={2} className="px-3 py-2">Total HT</td>
                      <td colSpan={2} className="px-3 py-2 text-right">{total.toFixed(2)} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">Créer la commande</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function Orders({ setPage }) {
  const { orders, updateOrderStatus, deleteOrder, createInvoice, invoices } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'Tous' || o.status === statusFilter
    const matchSearch = (o.number || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.clientName || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))

  const hasInvoice = (orderId) => invoices.some((i) => i.orderId === orderId)

  const handleCreateInvoice = (orderId) => {
    createInvoice(orderId)
    setPage('invoices')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500 text-sm">{orders.length} commande(s)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600">
          <Plus size={16} /> Nouvelle commande
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="N° commande, client..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {['Tous', 'En cours', 'Servi', 'Annulé'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter === s ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">N°</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Client</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Articles</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Total</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Statut</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Aucune commande</td></tr>
            )}
            {sorted.map((order) => {
              const { color, icon: Icon } = STATUS_CONFIG[order.status] || STATUS_CONFIG['En cours']
              return (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{order.number}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{order.clientName || '—'}</p>
                    {order.table && <p className="text-xs text-gray-400">{order.table}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-48">
                    {order.items?.map((i) => `${i.name} ×${i.qty}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{order.total?.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-center">
                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${color}`}>
                      {Object.keys(STATUS_CONFIG).map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!hasInvoice(order.id) && (
                        <button onClick={() => handleCreateInvoice(order.id)} title="Créer facture" className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg"><FileText size={15} /></button>
                      )}
                      <button onClick={() => deleteOrder(order.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && <NewOrderModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
