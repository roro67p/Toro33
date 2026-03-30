import useStore from '../../store/useStore'
import { CalendarCheck, ChevronRight, Clock, Leaf, Wine, Star } from 'lucide-react'

function formatDateFr(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function getTodayIndex() {
  // JS: 0=Sunday, 1=Monday...
  // Our data: 0=Lundi, 6=Dimanche
  const jsDay = new Date().getDay()
  // Convert: Sunday=6, Monday=0, ...
  return jsDay === 0 ? 6 : jsDay - 1
}

export default function Home() {
  const { data, setActivePage } = useStore()
  const { restaurant, events, menuCategories } = data

  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = events
    .filter(ev => ev.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
  const nextEvent = upcomingEvents[0] || null

  const todayIndex = getTodayIndex()
  const todayHours = restaurant.hours[todayIndex]

  const navigate = (page) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const features = [
    {
      icon: <Leaf size={28} />,
      title: 'Produits Frais',
      desc: 'Nous sélectionnons chaque matin les meilleurs produits locaux et de saison pour composer notre carte.',
    },
    {
      icon: <Wine size={28} />,
      title: 'Cave à Vins',
      desc: 'Plus de 80 références soigneusement sélectionnées parmi les meilleurs vignobles français.',
    },
    {
      icon: <CalendarCheck size={28} />,
      title: 'Réservation Facile',
      desc: 'Réservez votre table en ligne en quelques clics, 24h/24 et 7j/7.',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden" style={{ minHeight: '85vh' }}>
        {/* Decorative overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #D97706 0%, transparent 50%), radial-gradient(circle at 80% 20%, #92400E 0%, transparent 40%)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center"
          style={{ minHeight: '85vh', paddingTop: '4rem', paddingBottom: '4rem' }}>

          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: 'rgba(217,119,6,0.15)', color: '#F59E0B', border: '1px solid rgba(217,119,6,0.3)' }}>
              <Star size={14} fill="currentColor" />
              Cuisine française authentique depuis 1998
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4"
              style={{ fontFamily: 'Georgia, serif', color: 'white', lineHeight: '1.15' }}>
              {restaurant.name}
            </h1>

            <div className="divider-gold w-32 mx-auto my-4" />

            <p className="text-xl md:text-2xl mb-3 font-light italic"
              style={{ color: '#FDE68A', fontFamily: 'Georgia, serif' }}>
              {restaurant.tagline}
            </p>

            <p className="text-base md:text-lg max-w-xl mx-auto mb-10"
              style={{ color: '#D6D3D1' }}>
              {restaurant.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('reservation')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#D97706' }}
              >
                <CalendarCheck size={20} />
                Réserver une table
              </button>
              <button
                onClick={() => navigate('menu')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                Voir le menu
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
            style={{ color: '#78716C' }}>
            <ChevronRight size={24} className="rotate-90" />
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20" style={{ backgroundColor: '#FFFBEB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-2"
                style={{ color: '#D97706' }}>Notre Histoire</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: 'Georgia, serif', color: '#1C1917' }}>
                Un art de vivre à la lyonnaise
              </h2>
              <div className="divider-gold" style={{ maxWidth: '80px' }} />
              <p className="text-base leading-relaxed mt-4 mb-4"
                style={{ color: '#44403C' }}>
                {restaurant.description}
              </p>
              <p className="text-base leading-relaxed"
                style={{ color: '#44403C' }}>
                Depuis plus de 25 ans, notre chef et son équipe vous accueillent dans une atmosphère chaleureuse pour vous faire découvrir ou redécouvrir les saveurs authentiques de la cuisine française.
              </p>
              <button
                onClick={() => navigate('menu')}
                className="mt-6 inline-flex items-center gap-2 font-semibold transition-opacity hover:opacity-75"
                style={{ color: '#D97706' }}
              >
                Découvrir la carte
                <ChevronRight size={18} />
              </button>
            </div>
            {/* Decorative image placeholder */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-square"
                style={{ background: 'linear-gradient(135deg, #1C1917, #44403C)' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8">
                  <span className="text-8xl">🍽️</span>
                  <p className="text-2xl font-bold" style={{ color: '#D97706', fontFamily: 'Georgia, serif' }}>
                    {restaurant.name}
                  </p>
                  <p className="text-sm italic" style={{ color: '#78716C' }}>Lyon, depuis 1998</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 px-5 py-3 rounded-xl shadow-lg"
                style={{ backgroundColor: '#D97706', color: 'white' }}>
                <div className="text-2xl font-bold">25+</div>
                <div className="text-xs">ans d'excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16" style={{ backgroundColor: '#FEF3C7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>Pourquoi nous choisir</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#1C1917' }}>
              L'excellence au quotidien
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="card-hover bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#1C1917' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Event Teaser */}
      {nextEvent && (
        <section className="py-16" style={{ backgroundColor: '#FFFBEB' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>Prochain événement</p>
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#1C1917' }}>
                À ne pas manquer
              </h2>
            </div>
            <div className="card-hover rounded-2xl overflow-hidden shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
              <div className="p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="text-7xl">{nextEvent.emoji}</div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{ backgroundColor: 'rgba(217,119,6,0.2)', color: '#F59E0B' }}>
                    <Clock size={12} />
                    {formatDateFr(nextEvent.date)} · {nextEvent.time}
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'white', fontFamily: 'Georgia, serif' }}>
                    {nextEvent.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#A8A29E' }}>{nextEvent.description}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-xl font-bold" style={{ color: '#D97706' }}>{nextEvent.price}€</span>
                    {nextEvent.seatsLeft <= 5 && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: '#DC2626', color: 'white' }}>
                        Plus que {nextEvent.seatsLeft} places !
                      </span>
                    )}
                    <button
                      onClick={() => navigate('events')}
                      className="inline-flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#D97706' }}
                    >
                      En savoir plus
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hours Summary */}
      <section className="py-16" style={{ backgroundColor: '#1C1917' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>Horaires</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
              Quand nous trouver
            </h2>
          </div>
          <div className="grid gap-2">
            {restaurant.hours.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 rounded-xl transition-all"
                style={{
                  backgroundColor: i === todayIndex ? 'rgba(217,119,6,0.2)' : 'rgba(255,255,255,0.05)',
                  border: i === todayIndex ? '1px solid rgba(217,119,6,0.4)' : '1px solid transparent'
                }}
              >
                <div className="flex items-center gap-3">
                  {i === todayIndex && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D97706' }} />
                  )}
                  <span className="font-medium" style={{ color: i === todayIndex ? '#F59E0B' : '#D6D3D1' }}>
                    {h.day}
                    {i === todayIndex && <span className="ml-2 text-xs font-normal" style={{ color: '#D97706' }}>(aujourd'hui)</span>}
                  </span>
                </div>
                {h.closed ? (
                  <span className="text-sm font-medium" style={{ color: '#78716C' }}>Fermé</span>
                ) : (
                  <div className="text-sm text-right">
                    <div style={{ color: '#D6D3D1' }}>{h.lunch}</div>
                    {h.dinner !== 'Fermé' && <div style={{ color: '#D6D3D1' }}>{h.dinner}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm mb-4" style={{ color: '#78716C' }}>
              Pour toute réservation ou information :
            </p>
            <a href={`tel:${restaurant.phone}`}
              className="text-xl font-semibold transition-opacity hover:opacity-80"
              style={{ color: '#D97706' }}>
              {restaurant.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
