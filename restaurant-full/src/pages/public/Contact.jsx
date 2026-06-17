import { useState } from 'react'
import useStore from '../../store/useStore'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'

function getTodayIndex() {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

export default function Contact() {
  const { data } = useStore()
  const { restaurant } = data
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const todayIdx = getTodayIndex()

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSend = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSent(true)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E7E5E4',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#1C1917',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
          Nous trouver
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
          Contact
        </h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#A8A29E' }}>
          Une question, une réservation de groupe ou un événement privé ? Contactez-nous directement.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Left — info */}
          <div className="md:col-span-2 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                  <MapPin size={20} style={{ color: '#D97706' }} />
                </div>
                <h3 className="font-semibold" style={{ color: '#1C1917' }}>Adresse</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>{restaurant.address}</p>
              {restaurant.city && <p className="text-sm mt-1" style={{ color: '#78716C' }}>{restaurant.city}</p>}
            </div>

            {/* Phone + Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                  <Phone size={20} style={{ color: '#D97706' }} />
                </div>
                <h3 className="font-semibold" style={{ color: '#1C1917' }}>Téléphone & Email</h3>
              </div>
              <a href={`tel:${restaurant.phone}`} className="block text-sm font-medium hover:opacity-80 transition-opacity mb-1"
                style={{ color: '#D97706' }}>
                {restaurant.phone}
              </a>
              <a href={`mailto:${restaurant.email}`} className="block text-sm hover:opacity-80 transition-opacity"
                style={{ color: '#78716C' }}>
                {restaurant.email}
              </a>
            </div>

            {/* Hours */}
            {restaurant.hours && restaurant.hours.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                    <Clock size={20} style={{ color: '#D97706' }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#1C1917' }}>Horaires</h3>
                </div>
                <div className="space-y-1.5">
                  {restaurant.hours.map((h, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-1 px-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: i === todayIdx ? '#FEF3C7' : 'transparent',
                        fontWeight: i === todayIdx ? '600' : '400',
                      }}
                    >
                      <span style={{ color: i === todayIdx ? '#92400E' : '#57534E' }}>{h.day}</span>
                      <span style={{ color: i === todayIdx ? '#D97706' : '#78716C' }}>
                        {h.closed ? 'Fermé' : `${h.open} – ${h.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social */}
            {restaurant.socialMedia && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold mb-3" style={{ color: '#1C1917' }}>Réseaux sociaux</h3>
                <div className="flex flex-wrap gap-3">
                  {restaurant.socialMedia.facebook && (
                    <a href={restaurant.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                      style={{ backgroundColor: '#EBF5FF', color: '#1877F2' }}>
                      Facebook
                    </a>
                  )}
                  {restaurant.socialMedia.instagram && (
                    <a href={restaurant.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                      style={{ backgroundColor: '#FDF2F8', color: '#E1306C' }}>
                      Instagram
                    </a>
                  )}
                  {restaurant.socialMedia.tripadvisor && (
                    <a href={restaurant.socialMedia.tripadvisor} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                      style={{ backgroundColor: '#F0FDF4', color: '#00AA6C' }}>
                      TripAdvisor
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right — contact form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-8">
              {!sent ? (
                <>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                    Envoyez-nous un message
                  </h2>
                  <p className="text-sm mb-6" style={{ color: '#78716C' }}>
                    Nous répondons dans les 24h ouvrées.
                  </p>
                  <form onSubmit={handleSend} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '6px' }}>
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => set('name', e.target.value)}
                          placeholder="Jean Dupont"
                          required
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '6px' }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => set('email', e.target.value)}
                          placeholder="jean@email.com"
                          required
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '6px' }}>
                        Sujet
                      </label>
                      <select
                        value={form.subject}
                        onChange={e => set('subject', e.target.value)}
                        style={{ ...inputStyle, appearance: 'none' }}
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="reservation">Réservation groupe (+10 personnes)</option>
                        <option value="event">Événement privé</option>
                        <option value="info">Informations générales</option>
                        <option value="feedback">Avis / Retour d'expérience</option>
                        <option value="press">Presse / Partenariat</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '6px' }}>
                        Votre message *
                      </label>
                      <textarea
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                        rows={6}
                        placeholder="Décrivez votre demande en détail..."
                        required
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                      style={{ backgroundColor: '#D97706', fontSize: '15px' }}
                    >
                      <Send size={16} />
                      Envoyer le message
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: '#F0FDF4' }}>
                    <CheckCircle size={40} style={{ color: '#16A34A' }} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                    Message envoyé !
                  </h2>
                  <p className="text-sm" style={{ color: '#78716C' }}>
                    Merci <strong>{form.name}</strong> — nous avons bien reçu votre message et vous répondrons dans les meilleurs délais.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="mt-8 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
