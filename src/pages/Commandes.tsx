import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'

import { useStore } from '../store/useStore'
import { Order, OrderStatus, OrderItem } from '../types'

const STATUS_OPTIONS: OrderStatus[] = ['en attente', 'en préparation', 'servie', 'payée']

export default function Commandes() {
  const orders = useStore((s) => s.orders)
  const tables = useStore((s) => s.tables)
  const menuItems = useStore((s) => s.menuItems)
  const addOrder = useStore((s) => s.addOrder)
  const updateOrder = useStore((s) => s.updateOrder)
  const deleteOrder = useStore((s) => s.deleteOrder)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formTableId, setFormTableId] = useState('')
  const [formWaiter, setFormWaiter] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [formStatus, setFormStatus] = useState<OrderStatus>('en attente')
  const [formItems, setFormItems] = useState<OrderItem[]>([])
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('')

  const filtered = orders.filter((o) => {
    const matchSearch = search === '' ||
      `table ${o.tableNumber}`.toLowerCase().includes(search.toLowerCase()) ||
      (o.waiter || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  function openAdd() {
    setEditOrder(null)
    setFormTableId(tables[0]?.id || '')
    setFormWaiter('')
    setFormNotes('')
    setFormStatus('en attente')
    setFormItems([])
    setSelectedMenuItemId('')
    setModalOpen(true)
  }

  function openEdit(order: Order) {
    setEditOrder(order)
    setFormTableId(order.tableId)
    setFormWaiter(order.waiter || '')
    setFormNotes(order.notes || '')
    setFormStatus(order.status)
    setFormItems([...order.items])
    setModalOpen(true)
  }

  function addItem() {
    if (!selectedMenuItemId) return
    const menu = menuItems.find((m) => m.id === selectedMenuItemId)
    if (!menu) return
    const existing = formItems.find((i) => i.menuItemId === selectedMenuItemId)
    if (existing) {
      setFormItems(formItems.map((i) => i.menuItemId === selectedMenuItemId ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setFormItems([...formItems, { menuItemId: menu.id, menuItemName: menu.name, quantity: 1, unitPrice: menu.price }])
    }
    setSelectedMenuItemId('')
  }

  function removeItem(menuItemId: string) {
    setFormItems(formItems.filter((i) => i.menuItemId !== menuItemId))
  }

  function changeQty(menuItemId: string, delta: number) {
    setFormItems(formItems.map((i) => {
      if (i.menuItemId !== menuItemId) return i
      const q = i.quantity + delta
      return q <= 0 ? i : { ...i, quantity: q }
    }))
  }

  function computeTotal(items: OrderItem[]) {
    return items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  }

  function handleSave() {
    if (!formTableId || formItems.length === 0) return
    const table = tables.find((t) => t.id === formTableId)
    const now = new Date().toISOString()
    const total = computeTotal(formItems)
    if (editOrder) {
      updateOrder(editOrder.id, {
        tableId: formTableId,
        tableNumber: table?.number || 0,
        items: formItems,
        status: formStatus,
        waiter: formWaiter,
        notes: formNotes,
        updatedAt: now,
        total,
      })
    } else {
      addOrder({
        id: uuidv4(),
        tableId: formTableId,
        tableNumber: table?.number || 0,
        items: formItems,
        status: formStatus,
        waiter: formWaiter,
        notes: formNotes,
        createdAt: now,
        updatedAt: now,
        total,
      })
    }
    setModalOpen(false)
  }

  return (
    <div>
      <Header title="Commandes" subtitle="Gestion des commandes en salle" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Rechercher par table ou serveur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field sm:w-44"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} />
            Nouvelle commande
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <div key={s} className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm shadow-sm">
              <span className="text-gray-500">{s}: </span>
              <span className="font-semibold text-gray-900">{orders.filter((o) => o.status === s).length}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="table-th w-8"></th>
                  <th className="table-th">Table</th>
                  <th className="table-th">Serveur</th>
                  <th className="table-th">Articles</th>
                  <th className="table-th">Total</th>
                  <th className="table-th">Statut</th>
                  <th className="table-th">Heure</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="table-td text-center text-gray-400 py-8">Aucune commande trouvée</td></tr>
                )}
                {filtered.map((order) => (
                  <>
                    <tr key={order.id} className="table-row">
                      <td className="table-td">
                        <button
                          onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedId === order.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </td>
                      <td className="table-td font-semibold">Table {order.tableNumber}</td>
                      <td className="table-td text-gray-500">{order.waiter || '—'}</td>
                      <td className="table-td">{order.items.reduce((s, i) => s + i.quantity, 0)} article(s)</td>
                      <td className="table-td font-bold text-indigo-700">{order.total.toFixed(2)} €</td>
                      <td className="table-td">
                        <select
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={order.status}
                          onChange={(e) => updateOrder(order.id, { status: e.target.value as OrderStatus, updatedAt: new Date().toISOString() })}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="table-td text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="table-td">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(order)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit2 size={14} />
                          </button>
                          {deleteConfirm === order.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => { deleteOrder(order.id); setDeleteConfirm(null) }} className="text-xs text-red-600 font-medium hover:underline">Oui</button>
                              <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:underline">Non</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(order.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-detail`} className="bg-indigo-50/30">
                        <td colSpan={8} className="px-6 py-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Articles commandés</p>
                              <div className="space-y-1">
                                {order.items.map((item) => (
                                  <div key={item.menuItemId} className="flex justify-between text-sm">
                                    <span className="text-gray-700">{item.quantity}x {item.menuItemName}</span>
                                    <span className="font-medium text-gray-900">{(item.quantity * item.unitPrice).toFixed(2)} €</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {order.notes && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</p>
                                <p className="text-sm text-gray-600 italic">{order.notes}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editOrder ? 'Modifier la commande' : 'Nouvelle commande'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Table</label>
              <select className="input-field" value={formTableId} onChange={(e) => setFormTableId(e.target.value)}>
                {tables.map((t) => <option key={t.id} value={t.id}>Table {t.number} ({t.zone})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Statut</label>
              <select className="input-field" value={formStatus} onChange={(e) => setFormStatus(e.target.value as OrderStatus)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Serveur</label>
            <input className="input-field" placeholder="Nom du serveur" value={formWaiter} onChange={(e) => setFormWaiter(e.target.value)} />
          </div>

          {/* Add item */}
          <div>
            <label className="label">Ajouter un article</label>
            <div className="flex gap-2">
              <select
                className="input-field flex-1"
                value={selectedMenuItemId}
                onChange={(e) => setSelectedMenuItemId(e.target.value)}
              >
                <option value="">Choisir un article...</option>
                {menuItems.filter((m) => m.available).map((m) => (
                  <option key={m.id} value={m.id}>{m.name} — {m.price.toFixed(2)} €</option>
                ))}
              </select>
              <button onClick={addItem} className="btn-primary px-3" disabled={!selectedMenuItemId}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Items list */}
          {formItems.length > 0 && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              {formItems.map((item) => (
                <div key={item.menuItemId} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700 flex-1">{item.menuItemName}</span>
                  <div className="flex items-center gap-2 mx-3">
                    <button onClick={() => changeQty(item.menuItemId, -1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200 text-sm font-bold">-</button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => changeQty(item.menuItemId, 1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200 text-sm font-bold">+</button>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right">{(item.quantity * item.unitPrice).toFixed(2)} €</span>
                  <button onClick={() => removeItem(item.menuItemId)} className="ml-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <div className="px-4 py-2.5 bg-gray-50 flex justify-between">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-indigo-700">{computeTotal(formItems).toFixed(2)} €</span>
              </div>
            </div>
          )}

          <div>
            <label className="label">Notes</label>
            <textarea className="input-field resize-none h-20" placeholder="Allergies, préférences..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Annuler</button>
            <button
              className="btn-primary flex-1 justify-center"
              onClick={handleSave}
              disabled={!formTableId || formItems.length === 0}
            >
              {editOrder ? 'Enregistrer' : 'Créer la commande'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
