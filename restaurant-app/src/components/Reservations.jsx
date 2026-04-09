import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, Search, CalendarDays, Clock, Users, Phone } from 'lucide-react'

const STATUS_COLOR = {
  'Confirmee': 'bg-green-100 text-green-700',
  'En attente': 'bg-amber-100 text-amber-700',
  'Annulee': 'bg-red-100 text-red-700',
  'Terminee': 'bg-gray-100 text-gray-700',
}

function NewReservationModal({ onClose }) {
  const { clients, tables, addReservation } = useStore()
  const [form, setForm] = useState({
    clientId: '',
    clientName: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: 2,
    tableId: '',
    notes: '',
  })

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"

  const selectedClient = clients.find((c) => c.id === Number(form.clientId))
  const availableTables = tables.filter((t) => t.seats >= Number(form.guests) && (t.status === 'libre' || t.status === 'reservee'))

  const handleSubmit = (e) => {
    e.preventDefault()
    addReservation({
      clientId: form.clientId ? Number(form.clientId) : null,
      clientName: selectedClient ? selectedClient.name : form.clientName || 'Sans nom',
      phone: selectedClient ? selectedClient.phone : form.phone,
      date: form.date,
      time: form.time,
      guests: Number(form.guests),
      tableId: form.tableId ? Number(form.tableId) : null,
      tableName: form.tableId ? `Table ${tables.find((t) => t.id === Number(form.tableId))?.number}` : '',
      notes: form.notes,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-gray-900">Nouvelle reservation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client enregistre</label>
                <select className={inputCls} value={form.clientId} onChange={f('clientId')}>
                  <option value="">-- Selectionner --</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ou nom libre</label>
                <input className={inputCls} value={form.clientName} onChange={f('clientName')} placeholder="Nom..." disabled={!!form.clientId} />
              </div>
            </div>
            {!form.clientId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                <input className={inputCls} value={form.phone} onChange={f('phone')} placeholder="06 00 00 00 00" />
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input className={inputCls} type="date" value={form.date} onChange={f('date')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
                <input className={inputCls} type="time" value={form.time} onChange={f('time')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couverts *</label>
                <input className={inputCls} type="number" min="1" max="20" value={form.guests} onChange={f('guests')} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Table (optionnel)</label>
              <select className={inputCls} value={form.tableId} onChange={f('tableId')}>
                <option value="">-- Attribution auto --</option>
                {availableTables.map((t) => (
                  <option key={t.id} value={t.id}>Table {t.number} ({t.seats} pl.) - {t.zone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className={inputCls} rows={2} value={form.notes} onChange={f('notes')} placeholder="Anniversaire, chaise bebe..." />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600">Reserver</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function Reservations() {
  const { reservations, updateReservationStatus, deleteReservation } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')

  const filtered = reservations.filter((r) => {
    const matchStatus = statusFilter === 'Tous' || r.status === statusFilter
    const matchSearch = (r.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.number || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time}`)
    const db = new Date(`${b.date}T${b.time}`)
    return db - da
  })

  const todayCount = reservations.filter((r) => r.date === new Date().toISOString().split('T')[0] && r.status === 'Confirmee').length
  const todayGuests = reservations.filter((r) => r.date === new Date().toISOString().split('T')[0] && r.status === 'Confirmee').reduce((a, r) => a + r.guests, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-500 text-sm">{reservations.length} reservation(s) au total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600">
          <Plus size={16} /> Nouvelle reservation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Aujourd'hui</p>
          <p className="text-2xl font-bold text-purple-600">{todayCount}</p>
          <p className="text-xs text-gray-400">reservation(s)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Couverts ce soir</p>
          <p className="text-2xl font-bold text-amber-600">{todayGuests}</p>
          <p className="text-xs text-gray-400">personnes attendues</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Confirmees</p>
          <p className="text-2xl font-bold text-green-600">{reservations.filter((r) => r.status === 'Confirmee').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-bold text-amber-600">{reservations.filter((r) => r.status === 'En attente').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {['Tous', 'Confirmee', 'En attente', 'Annulee', 'Terminee'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter === s ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">N</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Client</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Date / Heure</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Couverts</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Table</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Statut</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Aucune reservation</td></tr>
            )}
            {sorted.map((resa) => (
              <tr key={resa.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium text-gray-900">{resa.number}</td>
                <td className="px-4 py-3">
                  <p className="text-gray-900 font-medium">{resa.clientName}</p>
                  {resa.phone && <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} />{resa.phone}</p>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarDays size={14} /> {resa.date ? new Date(resa.date + 'T00:00').toLocaleDateString('fr-FR') : '--'}
                    <Clock size={14} /> {resa.time}
                  </div>
                  {resa.notes && <p className="text-xs text-gray-400 mt-0.5">{resa.notes}</p>}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users size={14} /> {resa.guests}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{resa.tableName || '--'}</td>
                <td className="px-4 py-3 text-center">
                  <select value={resa.status} onChange={(e) => updateReservationStatus(resa.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLOR[resa.status] || STATUS_COLOR['En attente']}`}>
                    {Object.keys(STATUS_COLOR).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteReservation(resa.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <NewReservationModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
