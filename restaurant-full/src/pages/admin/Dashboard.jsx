import useStore from '../../store/useStore'
import { Calendar, Users, Clock, Star, Plus, CheckCircle, XCircle } from 'lucide-react'

function formatDateFr(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }) {
  if (status === 'confirmed') return <span className="badge-confirmed">Confirmée</span>
  if (status === 'pending') return <span className="badge-pending">En attente</span>
  if (status === 'cancelled') return <span className="badge-cancelled">Annulée</span>
  return null
}

export default function Dashboard() {
  const { data, setActiveAdminPage, updateReservation } = useStore()
  const { reservations, events } = data

  const today = new Date().toISOString().split('T')[0]

  const todayRes = reservations.filter(r => r.date === today && r.status !== 'cancelled')
  const pendingRes = reservations.filter(r => r.status === 'pending')
  const tonightGuests = todayRes.reduce((sum, r) => sum + (parseInt(r.guests) || 0), 0)

  const upcomingEvents = events
    .filter(ev => ev.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const nextEvent = upcomingEvents[0] || null

  const stats = [
    {
      label: 'Réservations aujourd\'hui',
      value: todayRes.length,
      icon: Calendar,
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      label: 'En attente de confirmation',
      value: pendingRes.length,
      icon: Clock,
      color: '#F59E0B',
      bg: '#FFFBEB',
    },
    {
      label: 'Couverts ce soir',
      value: tonightGuests,
      icon: Users,
      color: '#10B981',
      bg: '#D1FAE5',
    },
    {
      label: 'Prochain événement',
      value: nextEvent ? formatDateFr(nextEvent.date) : '—',
      icon: Star,
      color: '#8B5CF6',
      bg: '#EDE9FE',
      small: true
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
          Bonjour 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: '#78716C' }}>
          Voici un résumé de votre activité aujourd'hui, le {formatDateFr(today)}.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.bg }}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
              </div>
              <div className={`font-bold mb-1 ${stat.small ? 'text-base' : 'text-2xl'}`}
                style={{ color: '#1C1917' }}>
                {stat.value}
              </div>
              <p className="text-xs" style={{ color: '#78716C' }}>{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Today's Reservations */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #F3F4F6' }}>
          <div>
            <h3 className="font-semibold" style={{ color: '#1C1917' }}>
              Réservations du jour
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
              {todayRes.length} réservation{todayRes.length !== 1 ? 's' : ''} · {tonightGuests} couvert{tonightGuests !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveAdminPage('reservations')}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: '#D97706' }}
            >
              Voir tout
            </button>
            <button
              onClick={() => setActiveAdminPage('reservations')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              <Plus size={14} />
              Nouvelle
            </button>
          </div>
        </div>

        {todayRes.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#9CA3AF' }}>
            <Calendar size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Aucune réservation aujourd'hui</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Nom</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Heure</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Couverts</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Notes</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Statut</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#F3F4F6' }}>
                {todayRes
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(res => (
                    <tr key={res.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium" style={{ color: '#1C1917' }}>{res.name}</div>
                        <div className="text-xs" style={{ color: '#9CA3AF' }}>{res.phone}</div>
                      </td>
                      <td className="px-4 py-4 font-medium" style={{ color: '#1C1917' }}>{res.time}</td>
                      <td className="px-4 py-4" style={{ color: '#44403C' }}>{res.guests}</td>
                      <td className="px-4 py-4 max-w-[200px] truncate text-xs" style={{ color: '#78716C' }}>
                        {res.notes || '—'}
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
                              style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}
                            >
                              <XCircle size={15} />
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
      </div>

      {/* Pending reservations quick view */}
      {pendingRes.length > 0 && (
        <div className="rounded-2xl p-5"
          style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} style={{ color: '#D97706' }} />
            <h3 className="font-semibold text-sm" style={{ color: '#92400E' }}>
              {pendingRes.length} réservation{pendingRes.length > 1 ? 's' : ''} en attente de confirmation
            </h3>
          </div>
          <p className="text-xs mb-3" style={{ color: '#A16207' }}>
            Ces clients attendent votre confirmation. Pensez à les contacter rapidement.
          </p>
          <button
            onClick={() => setActiveAdminPage('reservations')}
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#D97706' }}
          >
            Gérer les réservations →
          </button>
        </div>
      )}
    </div>
  )
}
