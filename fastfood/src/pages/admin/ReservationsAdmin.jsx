import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, CheckCircle, XCircle, Search, X } from 'lucide-react'

const TIME_OPTIONS = ['12h00', '12h30', '13h00', '13h30', '14h00', '19h00', '19h30', '20h00', '20h30', '21h00', '21h30']

function StatusBadge({ status }) {
  if (status === 'confirmed') return <span className="badge-confirmed">Confirmée</span>
  if (status === 'pending') return <span className="badge-pending">En attente</span>
  if (status === 'cancelled') return <span className="badge-cancelled">Annulée</span>
  return null
}

function formatDateFr(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const EMPTY_FORM = {
  name: '', phone: '', email: '', date: '', time: '', guests: 2, notes: '', status: 'pending'
}

export default function ReservationsAdmin() {
  const { data, addReservation, updateReservation, deleteReservation } = useStore()
  const { reservations } = data

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const today = new Date().toISOString().split('T')[0]

  const filtered = reservations
    .filter(r => {
      if (filter === 'today') return r.date === today
      if (filter === 'pending') return r.status === 'pending'
      if (filter === 'confirmed') return r.status === 'confirmed'
      if (filter === 'cancelled') return r.status === 'cancelled'
      return true
    })
    .filter(r => {
      if (!search) return true
      const s = search.toLowerCase()
      return r.name.toLowerCase().includes(s) || r.phone.includes(s) || r.email?.toLowerCase().includes(s)
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.time.localeCompare(b.time)
    })

  const tabs = [
    { id: 'all', label: 'Toutes', count: reservations.length },
    { id: 'today', label: "Aujourd'hui", count: reservations.filter(r => r.date === today).length },
    { id: 'pending', label: 'En attente', count: reservations.filter(r => r.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmées', count: reservations.filter(r => r.status === 'confirmed').length },
    { id: 'cancelled', label: 'Annulées', count: reservations.filter(r => r.status === 'cancelled').length },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Requis'
    if (!form.phone.trim()) errs.phone = 'Requis'
    if (!form.date) errs.date = 'Requis'
    if (!form.time) errs.time = 'Requis'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    addReservation(form)
    setShowModal(false)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
            Réservations
          </h2>
          <p className="text-sm" style={{ color: '#78716C' }}>
            {reservations.length} réservation{reservations.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setErrors({}) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
          style={{ backgroundColor: '#D97706' }}
        >
          <Plus size={16} />
          Nouvelle réservation
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: filter === tab.id ? '#D97706' : '#F3F4F6',
                color: filter === tab.id ? 'white' : '#44403C'
              }}
            >
              {tab.label}
              <span className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: filter === tab.id ? 'rgba(255,255,255,0.25)' : '#E5E7EB',
                  color: filter === tab.id ? 'white' : '#6B7280'
                }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1C1917', backgroundColor: '#FAFAFA' }}
          />
          {search && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearch('')}
              style={{ color: '#9CA3AF' }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#9CA3AF' }}>
            <p className="text-sm">Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto responsive-table">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                  <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Nom</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Date</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Heure</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Couverts</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Notes</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Statut</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#F3F4F6' }}>
                {filtered.map(res => (
                  <tr key={res.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium" style={{ color: '#1C1917' }}>{res.name}</div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>{res.phone}</div>
                      {res.email && <div className="text-xs" style={{ color: '#9CA3AF' }}>{res.email}</div>}
                    </td>
                    <td className="px-4 py-4 font-medium" style={{ color: '#1C1917' }}>
                      {formatDateFr(res.date)}
                      {res.date === today && (
                        <span className="ml-1 text-xs" style={{ color: '#D97706' }}>auj.</span>
                      )}
                    </td>
                    <td className="px-4 py-4" style={{ color: '#44403C' }}>{res.time}</td>
                    <td className="px-4 py-4 font-medium text-center" style={{ color: '#44403C' }}>{res.guests}</td>
                    <td className="px-4 py-4 max-w-[150px]">
                      <p className="text-xs truncate" style={{ color: '#78716C' }}>{res.notes || '—'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => updateReservation(res.id, { status: 'confirmed' })}
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            title="Confirmer"
                            style={{ color: '#10B981', backgroundColor: '#D1FAE5' }}
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => updateReservation(res.id, { status: 'cancelled' })}
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            title="Annuler"
                            style={{ color: '#F59E0B', backgroundColor: '#FEF3C7' }}
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => { if (confirm('Supprimer cette réservation ?')) deleteReservation(res.id) }}
                          className="p-1.5 rounded-lg transition-all hover:opacity-80"
                          title="Supprimer"
                          style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: New Reservation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: '#D97706' }}>
              <h3 className="font-semibold text-white">Nouvelle réservation</h3>
              <button onClick={() => setShowModal(false)} style={{ color: 'rgba(255,255,255,0.8)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#44403C' }}>Nom *</label>
                  <input
                    type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: errors.name ? '#DC2626' : '#E5E7EB', color: '#1C1917' }}
                    placeholder="Nom complet"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#44403C' }}>Téléphone *</label>
                  <input
                    type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: errors.phone ? '#DC2626' : '#E5E7EB', color: '#1C1917' }}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#44403C' }}>Email</label>
                <input
                  type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
                  placeholder="email@exemple.fr"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#44403C' }}>Date *</label>
                  <input
                    type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: errors.date ? '#DC2626' : '#E5E7EB', color: '#1C1917' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#44403C' }}>Heure *</label>
                  <select value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: errors.time ? '#DC2626' : '#E5E7EB', color: '#1C1917' }}>
                    <option value="">—</option>
                    {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#44403C' }}>Couverts</label>
                  <select value={form.guests} onChange={e => setForm(p => ({ ...p, guests: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#44403C' }}>Notes / Allergies</label>
                <textarea
                  value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
                  rows={2} placeholder="Allergies, occasion spéciale..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#44403C' }}>Statut</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-[#F3F4F6]"
                  style={{ borderColor: '#E5E7EB', color: '#44403C' }}>
                  Annuler
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#D97706' }}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
