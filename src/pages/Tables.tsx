import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'

import { useStore } from '../store/useStore'
import { RestaurantTable, TableStatus } from '../types'

const STATUS_OPTIONS: TableStatus[] = ['libre', 'occupée', 'réservée']
const ZONES = ['Salle principale', 'Terrasse', 'Salon privé', 'Bar']

export default function Tables() {
  const tables = useStore((s) => s.tables)
  const addTable = useStore((s) => s.addTable)
  const updateTable = useStore((s) => s.updateTable)
  const deleteTable = useStore((s) => s.deleteTable)

  const [filterZone, setFilterZone] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTable, setEditTable] = useState<RestaurantTable | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor')

  const [formNumber, setFormNumber] = useState('')
  const [formSeats, setFormSeats] = useState('4')
  const [formZone, setFormZone] = useState('Salle principale')
  const [formStatus, setFormStatus] = useState<TableStatus>('libre')

  const filtered = tables.filter((t) => {
    const matchZone = filterZone === 'all' || t.zone === filterZone
    const matchStatus = filterStatus === 'all' || t.status === filterStatus
    return matchZone && matchStatus
  })

  const zones = [...new Set(tables.map((t) => t.zone))]

  function openAdd() {
    setEditTable(null)
    setFormNumber(String(Math.max(...tables.map((t) => t.number), 0) + 1))
    setFormSeats('4'); setFormZone('Salle principale'); setFormStatus('libre')
    setModalOpen(true)
  }

  function openEdit(table: RestaurantTable) {
    setEditTable(table)
    setFormNumber(String(table.number)); setFormSeats(String(table.seats))
    setFormZone(table.zone); setFormStatus(table.status)
    setModalOpen(true)
  }

  function handleSave() {
    if (!formNumber) return
    if (editTable) {
      updateTable(editTable.id, { number: parseInt(formNumber), seats: parseInt(formSeats), zone: formZone, status: formStatus })
    } else {
      addTable({ id: uuidv4(), number: parseInt(formNumber), seats: parseInt(formSeats), zone: formZone, status: formStatus })
    }
    setModalOpen(false)
  }

  const tablesByZone = zones.reduce((acc, zone) => {
    acc[zone] = filtered.filter((t) => t.zone === zone)
    return acc
  }, {} as Record<string, RestaurantTable[]>)

  const statusCounts = {
    libre: tables.filter((t) => t.status === 'libre').length,
    occupée: tables.filter((t) => t.status === 'occupée').length,
    réservée: tables.filter((t) => t.status === 'réservée').length,
  }

  return (
    <div>
      <Header title="Tables" subtitle="Plan de salle et gestion des tables" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="card text-center py-4">
            <p className="text-3xl font-bold text-emerald-600">{statusCounts.libre}</p>
            <p className="text-sm text-gray-500 mt-1">Libres</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-3xl font-bold text-red-500">{statusCounts.occupée}</p>
            <p className="text-sm text-gray-500 mt-1">Occupées</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-3xl font-bold text-amber-500">{statusCounts.réservée}</p>
            <p className="text-sm text-gray-500 mt-1">Réservées</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <select className="input-field sm:w-44" value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
            <option value="all">Toutes les zones</option>
            {zones.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <select className="input-field sm:w-44" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2 ml-auto">
            <button className={`px-3 py-2 text-sm rounded-lg border transition-colors ${viewMode === 'floor' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`} onClick={() => setViewMode('floor')}>Plan</button>
            <button className={`px-3 py-2 text-sm rounded-lg border transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`} onClick={() => setViewMode('list')}>Liste</button>
            <button className="btn-primary" onClick={openAdd}><Plus size={16} />Ajouter</button>
          </div>
        </div>

        {viewMode === 'floor' ? (
          /* Floor Plan View */
          <div className="space-y-6">
            {Object.entries(tablesByZone).map(([zone, zoneTables]) => (
              zoneTables.length > 0 && (
                <div key={zone} className="card">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                    {zone}
                    <span className="text-gray-400 font-normal">({zoneTables.length} table(s))</span>
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {zoneTables.map((table) => (
                      <div
                        key={table.id}
                        className={`rounded-2xl border-2 p-3 text-center cursor-pointer transition-all hover:shadow-md group relative ${
                          table.status === 'libre'
                            ? 'bg-emerald-50 border-emerald-300 hover:border-emerald-400'
                            : table.status === 'occupée'
                            ? 'bg-red-50 border-red-300 hover:border-red-400'
                            : 'bg-amber-50 border-amber-300 hover:border-amber-400'
                        }`}
                      >
                        <div className={`text-2xl font-bold ${
                          table.status === 'libre' ? 'text-emerald-700'
                          : table.status === 'occupée' ? 'text-red-700'
                          : 'text-amber-700'
                        }`}>{table.number}</div>
                        <div className={`text-xs mt-1 font-medium ${
                          table.status === 'libre' ? 'text-emerald-600'
                          : table.status === 'occupée' ? 'text-red-600'
                          : 'text-amber-600'
                        }`}>{table.seats} pl.</div>
                        {/* Quick status change */}
                        <select
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          value={table.status}
                          onChange={(e) => updateTable(table.id, { status: e.target.value as TableStatus })}
                          title="Changer le statut"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {/* Edit/delete on hover */}
                        <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5 bg-white rounded-lg shadow-sm p-0.5 z-10">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(table) }}
                            className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors"
                          >
                            <Edit2 size={10} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(table.id) }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          /* List View */
          <div className="card p-0 overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="table-th">N°</th>
                  <th className="table-th">Zone</th>
                  <th className="table-th">Places</th>
                  <th className="table-th">Statut</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((table) => (
                  <tr key={table.id} className="table-row">
                    <td className="table-td font-bold text-lg text-gray-900">{table.number}</td>
                    <td className="table-td text-gray-600">{table.zone}</td>
                    <td className="table-td">{table.seats} places</td>
                    <td className="table-td">
                      <select
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                        value={table.status}
                        onChange={(e) => updateTable(table.id, { status: e.target.value as TableStatus })}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="table-td">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(table)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit2 size={14} />
                        </button>
                        {deleteConfirm === table.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => { deleteTable(table.id); setDeleteConfirm(null) }} className="text-xs text-red-600 font-medium hover:underline">Oui</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:underline">Non</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(table.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete confirm toast */}
        {deleteConfirm && viewMode === 'floor' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-4 z-40">
            <p className="text-sm text-gray-700">Supprimer cette table ?</p>
            <button onClick={() => { deleteTable(deleteConfirm); setDeleteConfirm(null) }} className="btn-danger text-xs py-1.5 px-3">Supprimer</button>
            <button onClick={() => setDeleteConfirm(null)} className="btn-secondary text-xs py-1.5 px-3">Annuler</button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTable ? 'Modifier la table' : 'Nouvelle table'} size="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Numéro *</label>
              <input className="input-field" type="number" min="1" value={formNumber} onChange={(e) => setFormNumber(e.target.value)} />
            </div>
            <div>
              <label className="label">Places *</label>
              <input className="input-field" type="number" min="1" max="20" value={formSeats} onChange={(e) => setFormSeats(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Zone</label>
            <select className="input-field" value={formZone} onChange={(e) => setFormZone(e.target.value)}>
              {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Statut</label>
            <select className="input-field" value={formStatus} onChange={(e) => setFormStatus(e.target.value as TableStatus)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary flex-1 justify-center" onClick={handleSave}>{editTable ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
