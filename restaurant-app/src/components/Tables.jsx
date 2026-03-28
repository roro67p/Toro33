import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'

const STATUT_CONFIG = {
  'Libre':    { color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  'Occupée':  { color: 'bg-red-100 text-red-700 border-red-200',   dot: 'bg-red-500' },
  'Réservée': { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'En nettoyage': { color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
}

const ZONES = ['Salle', 'Terrasse', 'Salon privé', 'Bar']

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
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
  const [form, setForm] = useState(table || { numero: '', capacite: 4, zone: 'Salle' })
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, numero: Number(form.numero), capacite: Number(form.capacite) }) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">N° de table *</label>
          <input className={inputCls} type="number" min="1" value={form.numero} onChange={f('numero')} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacité *</label>
          <input className={inputCls} type="number" min="1" max="20" value={form.capacite} onChange={f('capacite')} required />
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
        <button type="submit" className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600">Enregistrer</button>
      </div>
    </form>
  )
}

export default function Tables({ setPage }) {
  const { tables, addTable, updateTable, deleteTable, setTableStatut } = useStore()
  const [modal, setModal] = useState(null)
  const [zoneFilter, setZoneFilter] = useState('Tous')

  const handleSave = (form) => {
    if (modal === 'add') addTable(form)
    else updateTable(modal.id, form)
    setModal(null)
  }

  const filtered = tables.filter((t) => zoneFilter === 'Tous' || t.zone === zoneFilter)
  const zones = ['Tous', ...ZONES.filter((z) => tables.some((t) => t.zone === z))]

  const libres = tables.filter((t) => t.statut === 'Libre').length
  const occupees = tables.filter((t) => t.statut === 'Occupée').length
  const reservees = tables.filter((t) => t.statut === 'Réservée').length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
          <p className="text-gray-500 text-sm">{tables.length} table(s)</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600">
          <Plus size={16} /> Ajouter table
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <p className="text-2xl font-bold text-green-700">{libres}</p>
          <p className="text-xs text-green-600">Libres</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-2xl font-bold text-red-700">{occupees}</p>
          <p className="text-xs text-red-600">Occupées</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
          <p className="text-2xl font-bold text-amber-700">{reservees}</p>
          <p className="text-xs text-amber-600">Réservées</p>
        </div>
      </div>

      {/* Zone filter */}
      <div className="flex gap-2 flex-wrap">
        {zones.map((z) => (
          <button key={z} onClick={() => setZoneFilter(z)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${zoneFilter === z ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{z}</button>
        ))}
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((table) => {
          const config = STATUT_CONFIG[table.statut] || STATUT_CONFIG['Libre']
          return (
            <div key={table.id} className={`bg-white rounded-xl shadow-sm border-2 p-4 ${config.color}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.dot}`}></div>
                  <span className="font-bold text-lg">Table {table.numero}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setModal(table)} className="p-1 hover:bg-white hover:bg-opacity-50 rounded"><Pencil size={12} /></button>
                  <button onClick={() => deleteTable(table.id)} className="p-1 hover:bg-white hover:bg-opacity-50 rounded text-red-500"><Trash2 size={12} /></button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs mb-3">
                <Users size={12} />
                <span>{table.capacite} personnes</span>
                <span className="ml-1 text-gray-500">· {table.zone}</span>
              </div>

              <select
                value={table.statut}
                onChange={(e) => setTableStatut(table.id, e.target.value)}
                className="w-full text-xs font-medium px-2 py-1.5 rounded-lg border-0 bg-white bg-opacity-70 cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-400"
              >
                {Object.keys(STATUT_CONFIG).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          )
        })}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Ajouter une table' : 'Modifier la table'} onClose={() => setModal(null)}>
          <TableForm table={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
