import useStore from '../../store/useStore'
import { Zap, Star, Clock, MapPin, ChevronRight, Flame, AlertTriangle, MessageSquare, Coffee } from 'lucide-react'

export default function Home() {
  const { data, setActivePage, addToCart } = useStore()
  const { restaurant, menuCategories, formules, reviews, isOpen, rushMode, flashMessage, waitTime, happyHour, menuDuJour } = data
  const bestsellers = menuCategories.flatMap(c => c.items).filter(i => i.badge === 'populaire' || i.badge === 'signature').slice(0, 3)
  const approvedReviews = (reviews || []).filter(r => r.approved)
  const avgRating = approvedReviews.length > 0 ? (approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length).toFixed(1) : '5.0'
  const topFormule = formules?.find(f => f.badge === 'populaire') || formules?.[0]
  const featuredItems = menuDuJour?.length > 0 ? menuDuJour : bestsellers

  // Happy Hour auto-detect
  const now = new Date()
  const currentHour = now.getHours()
  const isHappyHour = happyHour?.active && currentHour >= happyHour.startHour && currentHour < happyHour.endHour

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>

      {/* Message flash */}
      {flashMessage && (
        <div style={{ backgroundColor: '#312E81', borderBottom: '1px solid #4338CA', padding: '10px 16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <MessageSquare size={14} color="#818CF8" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#C7D2FE' }}>{flashMessage}</span>
        </div>
      )}

      {/* Happy Hour banner */}
      {isHappyHour && (
        <div style={{ background: 'linear-gradient(90deg, #422006, #451A03)', borderBottom: '1px solid #92400E', padding: '10px 16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Coffee size={14} color="#F59E0B" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#FDE68A' }}>
            ☕ {happyHour.label} — jusqu'à {happyHour.endHour}h00 !
          </span>
        </div>
      )}

      {/* Mode Rush banner */}
      {rushMode && (
        <div style={{ background: 'linear-gradient(90deg, #431407, #451A03)', borderBottom: '1px solid #9A3412', padding: '10px 16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Flame size={14} color="#F97316" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#FED7AA' }}>
            🔥 Forte affluence en ce moment — Temps d'attente estimé : {waitTime} min
          </span>
        </div>
      )}

      {/* Fermé banner */}
      {isOpen === false && (
        <div style={{ backgroundColor: '#4C0519', borderBottom: '1px solid #E11D48', padding: '12px 16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <AlertTriangle size={15} color="#E11D48" />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#FCA5A5' }}>
            Nous sommes actuellement fermés. Revenez bientôt !
          </span>
        </div>
      )}

      {/* Hero avec grande photo */}
      <section className="relative overflow-hidden" style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        {/* Photo plein écran */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=900&auto=format&fit=crop&q=85"
            alt="Burger"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.75) 50%, rgba(15,23,42,0.3) 100%)' }} />
        </div>

        {/* Contenu hero */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex items-center" style={{ zIndex: 1, flex: 1, paddingTop: '80px', paddingBottom: '80px' }}>
          <div style={{ maxWidth: '580px' }}>
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#FFF1F2', color: '#E11D48' }}>
                <Flame size={12} /> Fast-Food Lyon
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#F59E0B' }}>
                ★ {avgRating} ({approvedReviews.length} avis)
              </span>
              {isOpen !== false ? (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: '#064E3B', color: '#10B981' }}>🟢 Ouvert</span>
              ) : (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: '#4C0519', color: '#E11D48' }}>🔴 Fermé</span>
              )}
              {!rushMode && isOpen !== false && (
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>⏱ ~{waitTime} min</span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 900, color: 'white', lineHeight: 1.05, margin: '0 0 12px', letterSpacing: '-0.03em' }}>
              {restaurant.name}
            </h1>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#E11D48', margin: '0 0 14px' }}>{restaurant.tagline}</p>
            <p style={{ fontSize: '16px', color: '#9CA3AF', margin: '0 0 36px', lineHeight: 1.6 }}>{restaurant.description}</p>

            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setActivePage('order')}
                style={{
                  padding: '16px 32px', borderRadius: '14px', fontWeight: 800, color: 'white', fontSize: '16px',
                  backgroundColor: isOpen !== false ? '#E11D48' : '#374151',
                  boxShadow: isOpen !== false ? '0 0 30px rgba(225,29,72,0.5)' : 'none',
                  border: 'none', cursor: isOpen !== false ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}
                disabled={isOpen === false}>
                {isOpen !== false ? '🍔 Commander maintenant' : 'Restaurant fermé'}
              </button>
              <button onClick={() => setActivePage('menu')}
                style={{ padding: '16px 28px', borderRadius: '14px', fontWeight: 700, fontSize: '15px', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}>
                Voir le menu
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1, animation: 'bounce2 2s infinite' }}>
          <div style={{ width: '24px', height: '40px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6px' }}>
            <div style={{ width: '4px', height: '8px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '2px', animation: 'scrollDown 1.5s infinite' }} />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bounce2 { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
        @keyframes scrollDown { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(10px)} }
      `}</style>

      {/* Features */}
      <section className="py-10" style={{ backgroundColor: '#111827' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-3 gap-4">
          {[
            { icon: Zap, title: 'Commande rapide', desc: `Prête en ~${waitTime} min`, color: '#F59E0B' },
            { icon: Star, title: 'Qualité garantie', desc: 'Ingrédients frais chaque jour', color: '#E11D48' },
            { icon: Clock, title: 'Ouvert 7j/7', desc: 'Dès 11h tous les jours', color: '#10B981' },
          ].map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="text-center p-5 rounded-2xl" style={{ backgroundColor: '#1F2937' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#0F172A' }}>
                  <Icon size={22} style={{ color: f.color }} />
                </div>
                <div className="font-bold text-sm text-white mb-1">{f.title}</div>
                <div className="text-xs" style={{ color: '#9CA3AF' }}>{f.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Menu du jour / Bestsellers */}
      {featuredItems.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#E11D48' }}>
                  {menuDuJour?.length > 0 ? 'Sélection du chef' : 'Nos incontournables'}
                </p>
                <h2 className="text-3xl font-black text-white">
                  {menuDuJour?.length > 0 ? '⭐ Menu du jour' : 'Bestsellers'}
                </h2>
              </div>
              <button onClick={() => setActivePage('menu')} className="flex items-center gap-1 text-sm font-semibold hover:opacity-70" style={{ color: '#E11D48' }}>
                Tout voir <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {featuredItems.slice(0, 3).map(item => (
                <div key={item.id} className="rounded-2xl overflow-hidden group transition-all hover:-translate-y-1" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                  {item.image && (
                    <div className="overflow-hidden" style={{ height: '180px' }}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{item.name}</h3>
                      {item.badge && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#FFF1F2', color: '#E11D48' }}>{item.badge}</span>}
                      {menuDuJour?.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#064E3B', color: '#10B981' }}>⭐ Jour</span>}
                    </div>
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: '#9CA3AF' }}>{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-lg" style={{ color: isHappyHour ? '#F59E0B' : '#E11D48' }}>
                          {isHappyHour ? (Number(item.price) * (1 - happyHour.discount / 100)).toFixed(2) : Number(item.price).toFixed(2)}€
                        </span>
                        {isHappyHour && <span className="text-xs line-through ml-1" style={{ color: '#6B7280' }}>{Number(item.price).toFixed(2)}€</span>}
                      </div>
                      <button onClick={() => addToCart({ cartId: item.id + '_' + Date.now(), name: item.name, price: isHappyHour ? Number(item.price) * (1 - happyHour.discount / 100) : item.price, type: 'menu' })}
                        disabled={isOpen === false}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: isOpen !== false ? '#E11D48' : '#374151', cursor: isOpen !== false ? 'pointer' : 'not-allowed' }}>
                        + Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top formule */}
      {topFormule && (
        <section className="py-10 px-4" style={{ backgroundColor: '#111827' }}>
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #E11D48, #7F1D1D)' }}>
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8">
                <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80 text-white">Formule du moment</p>
                <h3 className="text-3xl font-black text-white mb-2">{topFormule.name}</h3>
                <p className="text-sm mb-4 opacity-80 text-white">{topFormule.description}</p>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-black text-white">{Number(topFormule.price).toFixed(2)}€</span>
                  {topFormule.originalPrice && <span className="text-lg line-through opacity-60 text-white">{Number(topFormule.originalPrice).toFixed(2)}€</span>}
                </div>
                <button onClick={() => setActivePage('formules')} className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: 'white', color: '#E11D48' }}>
                  Voir toutes les formules
                </button>
              </div>
              {topFormule.image && (
                <div className="hidden md:block" style={{ height: '250px' }}>
                  <img src={topFormule.image} alt={topFormule.name} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {approvedReviews.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#E11D48' }}>Ce qu'ils en pensent</p>
              <h2 className="text-3xl font-black text-white">Avis clients</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-3xl font-black" style={{ color: '#F59E0B' }}>{avgRating}</span>
                <div>{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(avgRating) ? '#F59E0B' : '#374151', fontSize: '18px' }}>★</span>)}</div>
                <span className="text-sm" style={{ color: '#6B7280' }}>({approvedReviews.length} avis)</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {approvedReviews.slice(-3).reverse().map(rev => (
                <div key={rev.id} className="p-5 rounded-2xl" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#E11D48', color: 'white' }}>{rev.name.charAt(0)}</div>
                    <div>
                      <div className="font-semibold text-sm text-white">{rev.name}</div>
                      <div>{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= rev.rating ? '#F59E0B' : '#374151', fontSize: '12px' }}>★</span>)}</div>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-3" style={{ color: '#9CA3AF' }}>{rev.comment}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button onClick={() => setActivePage('reviews')} className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: '#1F2937', color: '#E11D48', border: '1px solid #374151' }}>
                Voir tous les avis
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      <section className="py-10 px-4" style={{ backgroundColor: '#111827' }}>
        <div className="max-w-4xl mx-auto text-center">
          <MapPin size={28} className="mx-auto mb-3" style={{ color: '#E11D48' }} />
          <h2 className="text-2xl font-black text-white mb-2">Nous trouver</h2>
          <p className="mb-1" style={{ color: '#9CA3AF' }}>{restaurant.address}</p>
          <p className="mb-1" style={{ color: '#9CA3AF' }}>{restaurant.phone}</p>
          <button onClick={() => setActivePage('contact')} className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: '#1F2937', color: 'white', border: '1px solid #374151' }}>
            Voir horaires & contact
          </button>
        </div>
      </section>
    </div>
  )
}
