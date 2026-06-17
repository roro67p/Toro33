import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import { CalendarCheck } from 'lucide-react'

function formatDateFr(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const months = ['jan.', 'fév.', 'mar.', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

function Countdown({ dateStr }) {
  const [diff, setDiff] = useState(null)

  useEffect(() => {
    const compute = () => {
      const target = new Date(dateStr + 'T00:00:00')
      const now = new Date()
      const ms = target - now
      if (ms <= 0) { setDiff(null); return }
      const days = Math.floor(ms / 86400000)
      const hours = Math.floor((ms % 86400000) / 3600000)
      const mins = Math.floor((ms % 3600000) / 60000)
      setDiff({ days, hours, mins })
    }
    compute()
    const id = setInterval(compute, 60000)
    return () => clearInterval(id)
  }, [dateStr])

  if (!diff) return null
  return (
    <div className="flex gap-3 mt-3">
      {[
        { v: diff.days, l: 'jours' },
        { v: diff.hours, l: 'heures' },
        { v: diff.mins, l: 'min' },
      ].map(({ v, l }) => (
        <div key={l} className="text-center">
          <div className="text-2xl font-bold leading-none" style={{ color: '#D97706' }}>{v}</div>
          <div className="text-xs mt-0.5" style={{ color: '#78716C' }}>{l}</div>
        </div>
      ))}
    </div>
  )
}

export default function Events() {
  const { data, setActivePage } = useStore()
  const { events } = data
  const today = new Date().toISOString().split('T')[0]

  const upcoming = events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = events.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C0533, #2D1B4E)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
          Agenda
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
          Soirées & Événements
        </h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#C4B5D4' }}>
          Vivez des moments uniques et festifs dans notre établissement. Réservez vite, les places sont limitées.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
              <span>🎉</span> Prochaines soirées
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {upcoming.map((event) => {
                const spotsLeft = event.maxSeats - (event.reservedSeats || 0)
                const fillPct = Math.min(100, Math.round(((event.reservedSeats || 0) / (event.maxSeats || 1)) * 100))
                const isFull = spotsLeft <= 0
                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Top banner */}
                    <div className="px-6 py-4 text-white" style={{ background: 'linear-gradient(135deg, #1C0533, #4C1D95)' }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-2xl">{event.emoji || '🎶'}</span>
                          <h3 className="text-xl font-bold mt-1" style={{ fontFamily: 'Georgia, serif' }}>{event.title}</h3>
                        </div>
                        {isFull ? (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Complet</span>
                        ) : (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(217,119,6,0.3)', color: '#FCD34D' }}>
                            {spotsLeft} places
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4">
                      <div className="flex gap-4 text-sm mb-3" style={{ color: '#78716C' }}>
                        <span>📅 {formatDateFr(event.date)}</span>
                        {event.time && <span>🕐 {event.time}</span>}
                        {event.price != null && (
                          <span className="font-semibold" style={{ color: '#D97706' }}>
                            {event.price === 0 ? 'Gratuit' : `${event.price.toFixed(2)}€`}
                          </span>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed mb-4" style={{ color: '#57534E' }}>{event.description}</p>

                      {/* Fill bar */}
                      <div className="mb-1 flex justify-between text-xs" style={{ color: '#94A3B8' }}>
                        <span>{event.reservedSeats || 0} / {event.maxSeats} places réservées</span>
                        <span>{fillPct}%</span>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: '6px', backgroundColor: '#F3F4F6' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${fillPct}%`,
                            backgroundColor: fillPct >= 90 ? '#DC2626' : fillPct >= 70 ? '#F59E0B' : '#22C55E'
                          }}
                        />
                      </div>

                      {/* Countdown */}
                      <Countdown dateStr={event.date} />

                      <button
                        onClick={() => setActivePage('reservation')}
                        disabled={isFull}
                        className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{
                          backgroundColor: isFull ? '#E5E7EB' : '#D97706',
                          color: isFull ? '#9CA3AF' : 'white',
                          cursor: isFull ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isFull ? 'Complet' : 'Réserver une table'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {upcoming.length === 0 && (
          <div className="text-center py-16 rounded-2xl mb-12" style={{ backgroundColor: '#F5F3FF' }}>
            <p className="text-4xl mb-3">📅</p>
            <p className="text-lg font-semibold" style={{ color: '#1C1917' }}>Aucun événement à venir</p>
            <p className="text-sm mt-1" style={{ color: '#78716C' }}>Revenez bientôt — de nouvelles soirées arrivent !</p>
          </div>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#78716C', fontFamily: 'Georgia, serif' }}>
              <span>🕰️</span> Événements passés
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {past.map((event) => (
                <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm opacity-70">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{event.emoji || '🎶'}</span>
                    <h3 className="font-semibold text-sm" style={{ color: '#1C1917' }}>{event.title}</h3>
                  </div>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{formatDateFr(event.date)}</p>
                  {event.price != null && (
                    <p className="text-xs mt-1" style={{ color: '#78716C' }}>
                      {event.price === 0 ? 'Gratuit' : `${event.price.toFixed(2)}€`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
