import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, Pencil, Users, MapPin } from 'lucide-react'

const STATUS_CONFIG = {
  'libre': { color: 'bg-green-100 text-green-700 border-green-300', dot: 'bg-green-500' },
  'occupee': { color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500' },
  'reservee': { color: 'bg-blue-100 text-blue-700 border-blue-300', dot: 'bg-blue-500' },
  'nettoyage': { color: 'bg-amber-100 text-amber-700 border-amber-300', dot: 'bg-amber-500' },
}

const ZONES = ['Terrasse', 'Salle', 'Salon prive', 'Bar']

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

function TableForm({ table, onSave, onClose }) {
  const [form, setForm] = useState(table || { number: '', seats: 2, zone: 'Salle' })
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, number: Number(form.number), seats: Number(form.seats) }) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numero de table *</label>
          <input className={inputCls} type="number" min="1" value={form.number} onChange={f('number')} required placeholder="11" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nb de places *</label>
          <input className={inputCls} type="number" min="1" max="20" value={form.seats} onChange={f('seats')} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
        <select className={inputCls} value={form.zone} onChange={f('zone')}>
          {ZONES.map((z) => <option key={z}>{z}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">Enregistrer</button>
      </div>
    </form>
  )
}

export default function Tables() {
  const { tables, addTable, updateTable, deleteTable, setTableStatus } = useStore()
  const [modal, setModal] = useState(null)
  const [zoneFilter, setZoneFilter] = useState('Tous')

  const filtered = zoneFilter === 'Tous' ? tables : tables.filter((t) => t.zone === zoneFilter)
  const sorted = [...filtered].sort((a, b) => a.number - b.number)

  const handleSave = (form) => {
    if (modal === 'add') addTable(form)
    else updateTable(modal.id, form)
    setModal(null)
  }

  const stats = {
    total: tables.length,
    libre: tables.filter((t) => t.status === 'libre').length,
    occupee: tables.filter((t) => t.status === 'occupee').length,
    reservee: tables.filter((t) => t.status === 'reservee').length,
    totalSeats: tables.reduce((a, t) => a + t.seats, 0),
    occupiedSeats: tables.filter((t) => t.status === 'occupee').reduce((a, t) => a + t.seats, 0),
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan de salle</h1>
          <p className="text-gray-500 text-sm">{stats.total} tables - {stats.totalSeats} couverts</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600">
          <Plus size={16} /> Ajouter une table
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Tables libres</p>
          <p className="text-2xl font-bold text-green-600">{stats.libre}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Tables occupees</p>
          <p className="text-2xl font-bold text-red-600">{stats.occupee}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Reservees</p>
          <p className="text-2xl font-bold text-blue-600">{stats.reservee}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Taux occupation</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total > 0 ? Math.round((stats.occupee / stats.total) * 100) : 0}%</p>
        </div>
      </div>

      {/* Zone filter */}
      <div className="flex gap-2">
        {['Tous', ...ZONES].map((z) => (
          <button key={z} onClick={() => setZoneFilter(z)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${zoneFilter === z ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{z}</button>
        ))}
      </div>

      {/* Table grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sorted.map((table) => {
          const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG['libre']
          return (
            <div key={table.id} className={`rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${cfg.color}`}>
              <div className="flex justify-between items-start mb-2">
                <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                <div className="flex gap-1">
                  <button onClick={() => setModal(table)} className="p-1 hover:bg-white/50 rounded"><Pencil size={12} /></button>
                  <button onClick={() => deleteTable(table.id)} className="p-1 hover:bg-white/50 rounded text-red-500"><Trash2 size={12} /></button>
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{table.number}</p>
              <div className="flex items-center justify-center gap-1 text-xs mb-2">
                <Users size={12} /> {table.seats} places
              </div>
              <div className="flex items-center justify-center gap-1 text-xs mb-3">
                <MapPin size={12} /> {table.zone}
              </div>
              <select
                value={table.status}
                onChange={(e) => setTableStatus(table.id, e.target.value)}
                className="w-full text-xs py-1.5 px-2 rounded-lg bg-white/80 border-0 cursor-pointer font-medium"
              >
                {Object.keys(STATUS_CONFIG).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          )
        })}
        {sorted.length === 0 && <p className="col-span-5 text-center text-gray-400 py-8">Aucune table dans cette zone</p>}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Nouvelle table' : `Modifier table ${modal.number}`} onClose={() => setModal(null)}>
          <TableForm table={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
