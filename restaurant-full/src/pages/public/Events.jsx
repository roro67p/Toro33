import useStore from '../../store/useStore'
import { Clock, Users, Tag } from 'lucide-react'

function formatDateFr(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Events() {
  const { data } = useStore()
  const { events } = data

  const today = new Date().toISOString().split('T')[0]
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
          Agenda
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
          Soirées & Événements
        </h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#A8A29E' }}>
          Vivez des moments d'exception à notre table. Soirées thématiques, dîners de vignerons, brunchs...
        </p>
      </div>

      {/* Events Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sorted.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#78716C' }}>
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl font-medium">Aucun événement programmé</p>
            <p className="text-sm mt-2">Revenez bientôt pour découvrir nos prochaines soirées !</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sorted.map((event) => {
              const isPast = event.date < today
              const isLowSeats = !isPast && event.seatsLeft > 0 && event.seatsLeft <= 5
              const isFull = !isPast && event.seatsLeft === 0

              return (
                <div
                  key={event.id}
                  className={`card-hover rounded-2xl overflow-hidden shadow-md ${isPast ? 'opacity-60' : ''}`}
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left color band */}
                    <div className="md:w-32 flex items-center justify-center py-6 md:py-0"
                      style={{ background: isPast ? '#E5E7EB' : 'linear-gradient(135deg, #1C1917, #44403C)' }}>
                      <span className="text-6xl">{event.emoji}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {isPast && (
                              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                                style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                                Passé
                              </span>
                            )}
                            {isLowSeats && (
                              <span className="text-xs font-semibold px-3 py-1 rounded-full animate-pulse"
                                style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                                Plus que {event.seatsLeft} place{event.seatsLeft > 1 ? 's' : ''} !
                              </span>
                            )}
                            {isFull && (
                              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                                style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                                Complet
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                            {event.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: '#D97706' }}>{event.price}€</div>
                          <div className="text-xs" style={{ color: '#78716C' }}>par personne</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-1.5 text-sm" style={{ color: '#78716C' }}>
                          <Clock size={15} style={{ color: '#D97706' }} />
                          {formatDateFr(event.date)} · {event.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm" style={{ color: '#78716C' }}>
                          <Users size={15} style={{ color: '#D97706' }} />
                          {event.seatsLeft} / {event.seats} places disponibles
                        </div>
                        <div className="flex items-center gap-1.5 text-sm" style={{ color: '#78716C' }}>
                          <Tag size={15} style={{ color: '#D97706' }} />
                          {event.price}€ / personne
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed mb-4" style={{ color: '#44403C' }}>
                        {event.description}
                      </p>

                      {!isPast && !isFull && (
                        <div className="flex items-center gap-3">
                          <button
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: '#D97706' }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            Réserver
                          </button>
                          <p className="text-xs" style={{ color: '#78716C' }}>
                            Contactez-nous au {data.restaurant.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
