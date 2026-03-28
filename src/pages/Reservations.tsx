import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, CalendarDays, Clock } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'

import { useStore } from '../store/useStore'
import { Reservation, ReservationStatus } from '../types'

const STATUS_OPTIONS: ReservationStatus[] = ['en attente', 'confirmée', 'arrivée', 'annulée']

export default function Reservations() {
  const reservations = useStore((s) => s.reservations)
  const tables = useStore((s) => s.tables)
  const addReservation = useStore((s) => s.addReservation)
  const updateReservation = useStore((s) => s.updateReservation)
  const deleteReservation = useStore((s) => s.deleteReservation)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDate, setFilterDate] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editRes, setEditRes] = useState<Reservation | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formTableId, setFormTableId] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formGuests, setFormGuests] = useState('2')
  const [formStatus, setFormStatus] = useState<ReservationStatus>('en attente')
  const [formNotes, setFormNotes] = useState('')

  const filtered = reservations.filter((r) => {
    const matchSearch = search === '' ||
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.clientPhone.includes(search)
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const matchDate = filterDate === '' || r.date === filterDate
    return matchSearch && matchStatus && matchDate
  })

  // Sort by date+time
  const sorted = [...filtered].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  function openAdd() {
    setEditRes(null)
    setFormName(''); setFormPhone(''); setFormTableId(tables[0]?.id || '')
    setFormDate(new Date().toISOString().split('T')[0]); setFormTime('19:30')
    setFormGuests('2'); setFormStatus('en attente'); setFormNotes('')
    setModalOpen(true)
  }

  function openEdit(res: Reservation) {
    setEditRes(res)
    setFormName(res.clientName); setFormPhone(res.clientPhone); setFormTableId(res.tableId)
    setFormDate(res.date); setFormTime(res.time); setFormGuests(String(res.guests))
    setFormStatus(res.status); setFormNotes(res.notes || '')
    setModalOpen(true)
  }

  function handleSave() {
    if (!formName || !formTableId || !formDate || !formTime) return
    const table = tables.find((t) => t.id === formTableId)
    const now = new Date().toISOString()
    if (editRes) {
      updateReservation(editRes.id, {
        clientName: formName, clientPhone: formPhone, tableId: formTableId,
        tableNumber: table?.number || 0, date: formDate, time: formTime,
        guests: parseInt(formGuests), status: formStatus, notes: formNotes,
      })
    } else {
      addReservation({
        id: uuidv4(), clientName: formName, clientPhone: formPhone, tableId: formTableId,
        tableNumber: table?.number || 0, date: formDate, time: formTime,
        guests: parseInt(formGuests), status: formStatus, notes: formNotes, createdAt: now,
      })
    }
    setModalOpen(false)
  }

  // Group by date
  const byDate = sorted.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = []
    acc[r.date].push(r)
    return acc
  }, {} as Record<string, Reservation[]>)

  function formatDate(d: string) {
    return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div>
      <Header title="Réservations" subtitle="Gestion des réservations" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="input-field sm:w-44"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <select className="input-field sm:w-44" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-primary" onClick={openAdd}><Plus size={16} />Nouvelle réservation</button>
        </div>

        {/* Summary */}
        <div className="flex gap-3 flex-wrap mb-5">
          {STATUS_OPTIONS.map((s) => (
            <div key={s} className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm shadow-sm">
              <span className="text-gray-500">{s}: </span>
              <span className="font-semibold text-gray-900">{reservations.filter((r) => r.status === s).length}</span>
            </div>
          ))}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm">
            <span className="text-indigo-600">Aujourd'hui: </span>
            <span className="font-semibold text-indigo-700">{reservations.filter((r) => r.date === todayStr).length}</span>
          </div>
        </div>

        {/* Reservations by date */}
        {Object.keys(byDate).length === 0 ? (
          <div className="card text-center py-12 text-gray-400">Aucune réservation trouvée</div>
        ) : (
          <div className="space-y-5">
            {Object.entries(byDate).map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays size={15} className="text-indigo-500" />
                  <h3 className={`text-sm font-semibold capitalize ${date === todayStr ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {formatDate(date)}
                    {date === todayStr && <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Aujourd'hui</span>}
                  </h3>
                </div>
                <div className="card p-0 overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="table-th">Client</th>
                        <th className="table-th">Téléphone</th>
                        <th className="table-th">Heure</th>
                        <th className="table-th">Table</th>
                        <th className="table-th">Couverts</th>
                        <th className="table-th">Statut</th>
                        <th className="table-th hidden md:table-cell">Notes</th>
                        <th className="table-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((res) => (
                        <tr key={res.id} className="table-row">
                          <td className="table-td font-medium">{res.clientName}</td>
                          <td className="table-td text-gray-500">{res.clientPhone}</td>
                          <td className="table-td">
                            <div className="flex items-center gap-1 text-gray-700">
                              <Clock size={13} className="text-gray-400" />
                              {res.time}
                            </div>
                          </td>
                          <td className="table-td">Table {res.tableNumber}</td>
                          <td className="table-td">{res.guests} pers.</td>
                          <td className="table-td">
                            <select
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                              value={res.status}
                              onChange={(e) => updateReservation(res.id, { status: e.target.value as ReservationStatus })}
                            >
                              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="table-td text-xs text-gray-400 hidden md:table-cell max-w-xs truncate">{res.notes || '—'}</td>
                          <td className="table-td">
                            <div className="flex gap-1">
                              <button onClick={() => openEdit(res)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                <Edit2 size={14} />
                              </button>
                              {deleteConfirm === res.id ? (
                                <div className="flex items-center gap-1">
                                  <button onClick={() => { deleteReservation(res.id); setDeleteConfirm(null) }} className="text-xs text-red-600 font-medium hover:underline">Oui</button>
                                  <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:underline">Non</button>
                                </div>
                              ) : (
                                <button onClick={() => setDeleteConfirm(res.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editRes ? 'Modifier la réservation' : 'Nouvelle réservation'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nom du client *</label>
              <input className="input-field" placeholder="Jean Dupont" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input className="input-field" placeholder="06 12 34 56 78" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date *</label>
              <input className="input-field" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
            </div>
            <div>
              <label className="label">Heure *</label>
              <input className="input-field" type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Table *</label>
              <select className="input-field" value={formTableId} onChange={(e) => setFormTableId(e.target.value)}>
                {tables.map((t) => <option key={t.id} value={t.id}>Table {t.number} — {t.seats} pl. ({t.zone})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Nombre de couverts</label>
              <input className="input-field" type="number" min="1" max="20" value={formGuests} onChange={(e) => setFormGuests(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Statut</label>
            <select className="input-field" value={formStatus} onChange={(e) => setFormStatus(e.target.value as ReservationStatus)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input-field resize-none h-20" placeholder="Allergies, occasion spéciale..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary flex-1 justify-center" onClick={handleSave} disabled={!formName || !formTableId || !formDate}>
              {editRes ? 'Enregistrer' : 'Réserver'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
