import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Pencil, Trash2, Search, User, Phone, Mail, MapPin } from 'lucide-react'

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function ClientForm({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || { name: '', email: '', phone: '', address: '', notes: '' })
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
        <input className={inputCls} value={form.name} onChange={f('name')} required placeholder="Prénom Nom" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input className={inputCls} type="email" value={form.email} onChange={f('email')} placeholder="email@exemple.fr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input className={inputCls} value={form.phone} onChange={f('phone')} placeholder="06 00 00 00 00" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <input className={inputCls} value={form.address} onChange={f('address')} placeholder="Rue, Ville" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea className={inputCls} rows={2} value={form.notes} onChange={f('notes')} placeholder="Préférences, allergies..." />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">Enregistrer</button>
      </div>
    </form>
  )
}

export default function Clients() {
  const { clients, orders, invoices, addClient, updateClient, deleteClient } = useStore()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (form) => {
    if (modal === 'add') addClient(form)
    else updateClient(modal.id, form)
    setModal(null)
  }

  const getClientStats = (clientId) => {
    const clientOrders = orders.filter((o) => o.clientId === clientId)
    const clientInvoices = invoices.filter((i) => i.clientId === clientId)
    const totalSpent = clientInvoices.reduce((acc, i) => acc + i.total, 0)
    return { orders: clientOrders.length, spent: totalSpent }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm">{clients.length} client(s) enregistré(s)</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">
          <Plus size={16} /> Nouveau client
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
        <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && <p className="text-gray-400 text-sm col-span-3 py-8 text-center">Aucun client trouvé</p>}
        {filtered.map((client) => {
          const stats = getClientStats(client.id)
          return (
            <div key={client.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{client.name}</p>
                    {client.notes && <p className="text-xs text-amber-600">{client.notes}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setModal(client)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => deleteClient(client.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                {client.email && <div className="flex items-center gap-2"><Mail size={12} />{client.email}</div>}
                {client.phone && <div className="flex items-center gap-2"><Phone size={12} />{client.phone}</div>}
                {client.address && <div className="flex items-center gap-2"><MapPin size={12} />{client.address}</div>}
              </div>
              <div className="mt-3 pt-3 border-t flex justify-between text-xs">
                <span className="text-gray-500">{stats.orders} commande(s)</span>
                <span className="font-semibold text-emerald-600">{stats.spent.toFixed(2)} € dépensés</span>
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Nouveau client' : 'Modifier le client'} onClose={() => setModal(null)}>
          <ClientForm client={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
