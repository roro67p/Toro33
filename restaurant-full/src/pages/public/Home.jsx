import useStore from '../../store/useStore'
import { CalendarCheck, ChevronRight, Clock, Leaf, Wine, Star, MapPin, Phone, Award, Users } from 'lucide-react'

function formatDateFr(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function getTodayIndex() {
  const jsDay = new Date().getDay()
  return jsDay === 0 ? 6 : jsDay - 1
}

function CountdownBadge({ date }) {
  const diff = Math.ceil((new Date(date + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return null
  if (diff === 0) return <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>Aujourd'hui !</span>
  if (diff <= 7) return <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>Dans {diff} jour{diff > 1 ? 's' : ''}</span>
  return null
}

export default function Home() {
  const { data, setActivePage } = useStore()
  const { restaurant, events, menuCategories } = data
  const navigate = (page) => { setActivePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const today = new Date().toISOString().split('T')[0]
  const upcomingEvents = (events || []).filter(ev => ev.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const nextEvent = upcomingEvents[0] || null
  const todayHours = restaurant.hours?.[getTodayIndex()]

  // Quelques plats mis en avant (premiers de chaque catégorie)
  const highlights = (menuCategories || []).flatMap(c => c.items?.filter(i => i.available).slice(0, 1) || []).slice(0, 4)

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #1C1917 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '100px', padding: '6px 16px', marginBottom: '24px' }}>
                <span style={{ color: '#D97706', fontSize: '13px', fontWeight: 600 }}>🍽️ Cuisine française authentique</span>
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(40px, 5vw, 68px)', color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
                {restaurant.name}
              </h1>
              <p style={{ fontSize: '18px', color: '#A8A29E', lineHeight: 1.7, marginBottom: '36px', maxWidth: '480px' }}>
                {restaurant.description}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('reservation')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#D97706', color: 'white', padding: '14px 28px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 700, transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <CalendarCheck size={18} /> Réserver une table
                </button>
                <button onClick={() => navigate('menu')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#D6D3D1', padding: '14px 28px', borderRadius: '14px', border: '1px solid #44403C', cursor: 'pointer', fontSize: '15px', fontWeight: 600 }}>
                  Voir le menu <ChevronRight size={16} />
                </button>
              </div>

              {/* Quick info */}
              <div style={{ display: 'flex', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#78716C', fontSize: '13px' }}>
                  <Clock size={14} style={{ color: '#D97706' }} />
                  {todayHours?.closed ? 'Fermé aujourd\'hui' : `Ouvert : ${todayHours?.lunch !== 'Fermé' ? todayHours?.lunch : ''} ${todayHours?.dinner !== 'Fermé' ? '· ' + todayHours?.dinner : ''}`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#78716C', fontSize: '13px' }}>
                  <MapPin size={14} style={{ color: '#D97706' }} />{restaurant.address}
                </div>
              </div>
            </div>

            {/* Right side - cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { emoji: '🥩', label: 'Viandes & Terroir', desc: 'Sélection locale' },
                { emoji: '🐟', label: 'Poissons frais', desc: 'Arrivage quotidien' },
                { emoji: '🍷', label: 'Cave à vins', desc: '80+ références' },
                { emoji: '🍮', label: 'Desserts maison', desc: 'Fait par nos soins' },
              ].map((item, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(10px)', transition: 'all 0.2s', cursor: 'default' }}
                  onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(217,119,6,0.1)'; e.currentTarget.style.borderColor = 'rgba(217,119,6,0.3)' }}
                  onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{item.emoji}</div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ color: '#78716C', fontSize: '12px' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#D97706', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          {[
            { value: '15 ans', label: "d'expérience" },
            { value: '80+', label: 'références de vins' },
            { value: '4.8★', label: 'sur TripAdvisor' },
            { value: '100%', label: 'produits frais' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Georgia, serif' }}>{s.value}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOS SPÉCIALITÉS ───────────────────────────────────────── */}
      {highlights.length > 0 && (
        <section style={{ padding: '80px 24px', backgroundColor: '#FFFBEB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span style={{ color: '#D97706', fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>À la carte</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1C1917', marginTop: '8px', marginBottom: '12px' }}>Nos spécialités du moment</h2>
              <p style={{ color: '#78716C', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>Une sélection de nos meilleures assiettes, élaborées avec passion par notre cuisine.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {highlights.map((item, i) => (
                <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)' }}
                  onClick={() => navigate('menu')}>
                  <div style={{ height: '140px', background: `linear-gradient(135deg, ${['#FEF3C7','#FDE68A','#FCD34D','#FBBF24'][i % 4]} 0%, ${['#FDE68A','#FCD34D','#FBBF24','#F59E0B'][i % 4]} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>
                    {['🥗','🍽️','🍮','📋'][i % 4]}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1C1917', marginBottom: '6px' }}>{item.name}</h3>
                    <p style={{ fontSize: '13px', color: '#78716C', lineHeight: 1.5, marginBottom: '12px' }}>{item.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#D97706' }}>{item.price.toFixed(2)}€</span>
                      <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 600 }}>Voir le menu →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button onClick={() => navigate('menu')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#1C1917', color: 'white', padding: '14px 32px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600 }}>
                Voir la carte complète <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── PROCHAIN ÉVÉNEMENT ────────────────────────────────────── */}
      {nextEvent && (
        <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ color: '#D97706', fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Agenda</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: 'white', marginTop: '8px', marginBottom: '32px' }}>Prochain événement</h2>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>{nextEvent.emoji}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <CountdownBadge date={nextEvent.date} />
                <span style={{ fontSize: '12px', color: '#D97706', backgroundColor: 'rgba(217,119,6,0.15)', padding: '4px 12px', borderRadius: '100px', fontWeight: 600 }}>{nextEvent.price}€/pers.</span>
                <span style={{ fontSize: '12px', color: '#9CA3AF', backgroundColor: 'rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: '100px' }}>
                  {nextEvent.seatsLeft} places restantes
                </span>
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: 'white', marginBottom: '8px' }}>{nextEvent.title}</h3>
              <p style={{ color: '#A8A29E', marginBottom: '8px', fontSize: '14px' }}>{formatDateFr(nextEvent.date)} à {nextEvent.time}</p>
              <p style={{ color: '#78716C', maxWidth: '560px', margin: '0 auto 28px', lineHeight: 1.7, fontSize: '14px' }}>{nextEvent.description}</p>
              <button onClick={() => navigate('reservation')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#D97706', color: 'white', padding: '14px 28px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 700 }}>
                <CalendarCheck size={18} /> Réserver ma place
              </button>
              <button onClick={() => navigate('events')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#A8A29E', padding: '14px 20px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '14px', marginLeft: '8px' }}>
                Voir tous les événements <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── ATOUTS ────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ color: '#D97706', fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Pourquoi nous choisir</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1C1917', marginTop: '8px' }}>Notre engagement qualité</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {[
              { icon: <Leaf size={28} />, title: 'Produits locaux', desc: 'Nous travaillons avec des producteurs de la région pour garantir des produits frais, de saison et tracés.' },
              { icon: <Award size={28} />, title: 'Savoir-faire', desc: 'Notre chef et son équipe mettent tout leur talent dans chaque assiette, avec des recettes traditionnelles revisitées.' },
              { icon: <Wine size={28} />, title: 'Accord mets & vins', desc: 'Notre sommelier vous guide dans le choix du vin parfait pour sublimer votre repas parmi nos 80+ références.' },
              { icon: <Users size={28} />, title: 'Groupes & privatisation', desc: 'Organisez vos événements privés dans un cadre chaleureux. Devis sur mesure pour les groupes dès 10 personnes.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', padding: '28px', borderRadius: '20px', backgroundColor: '#FAFAFA', border: '1px solid #F3F4F6', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#FFFBEB'; e.currentTarget.style.borderColor = '#FDE68A' }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = '#FAFAFA'; e.currentTarget.style.borderColor = '#F3F4F6' }}>
                <div style={{ width: '52px', height: '52px', backgroundColor: '#FEF3C7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#1C1917', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#78716C', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HORAIRES & CONTACT RAPIDE ─────────────────────────────── */}
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFBEB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Horaires */}
          <div>
            <span style={{ color: '#D97706', fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Planning</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#1C1917', marginTop: '8px', marginBottom: '24px' }}>Horaires d'ouverture</h2>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              {(restaurant.hours || []).map((h, i) => {
                const isToday = i === getTodayIndex()
                return (
                  <div key={h.day} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: i < 6 ? '1px solid #F3F4F6' : 'none', backgroundColor: isToday ? '#FFFBEB' : 'white' }}>
                    <span style={{ width: '100px', fontWeight: isToday ? 700 : 500, fontSize: '14px', color: isToday ? '#D97706' : '#1C1917' }}>
                      {isToday && '→ '}{h.day}
                    </span>
                    {h.closed ? (
                      <span style={{ fontSize: '13px', color: '#9CA3AF', fontStyle: 'italic' }}>Fermé</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#78716C' }}>
                        {h.lunch !== 'Fermé' && <span>🌞 {h.lunch}</span>}
                        {h.dinner !== 'Fermé' && <span>🌙 {h.dinner}</span>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact + Réservation */}
          <div>
            <span style={{ color: '#D97706', fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Nous trouver</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#1C1917', marginTop: '8px', marginBottom: '24px' }}>Venez nous rendre visite</h2>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
              {[
                { icon: <MapPin size={18} />, text: restaurant.address },
                { icon: <Phone size={18} />, text: restaurant.phone },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i === 0 ? '1px solid #F3F4F6' : 'none' }}>
                  <div style={{ width: '36px', height: '36px', backgroundColor: '#FEF3C7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '14px', color: '#44403C' }}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('reservation')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#D97706', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}>
              <CalendarCheck size={20} /> Réserver ma table
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
