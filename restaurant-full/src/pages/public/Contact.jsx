import { useState } from 'react'
import useStore from '../../store/useStore'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'

function getTodayIndex() {
  const jsDay = new Date().getDay()
  return jsDay === 0 ? 6 : jsDay - 1
}

export default function Contact() {
  const { data } = useStore()
  const { restaurant } = data

  const todayIndex = getTodayIndex()

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
          Nous trouver
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
          Contact
        </h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#A8A29E' }}>
          Nous sommes à votre disposition pour toute question, réservation ou événement privé.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-64 relative"
              style={{ background: 'linear-gradient(135deg, #1C1917, #3D3531)' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#D97706' }}>
                  <MapPin size={24} style={{ color: 'white' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: 'white' }}>{restaurant.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                  style={{ backgroundColor: 'rgba(217,119,6,0.2)', color: '#F59E0B', border: '1px solid rgba(217,119,6,0.3)' }}
                >
                  Voir sur Google Maps
                </a>
              </div>
              {/* Decorative grid lines */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(#D97706 1px, transparent 1px), linear-gradient(90deg, #D97706 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: '#FEF3C7' }}>
                  <MapPin size={18} style={{ color: '#D97706' }} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#78716C' }}>Adresse</p>
                <p className="text-sm font-medium" style={{ color: '#1C1917' }}>{restaurant.address}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: '#FEF3C7' }}>
                  <Phone size={18} style={{ color: '#D97706' }} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#78716C' }}>Téléphone</p>
                <a href={`tel:${restaurant.phone}`} className="text-sm font-medium transition-opacity hover:opacity-75"
                  style={{ color: '#1C1917' }}>{restaurant.phone}</a>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: '#FEF3C7' }}>
                  <Mail size={18} style={{ color: '#D97706' }} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#78716C' }}>Email</p>
                <a href={`mailto:${restaurant.email}`} className="text-sm font-medium transition-opacity hover:opacity-75 break-all"
                  style={{ color: '#1C1917' }}>{restaurant.email}</a>
              </div>
            </div>

            {/* Hours Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-2"
                style={{ backgroundColor: '#1C1917' }}>
                <Clock size={18} style={{ color: '#D97706' }} />
                <h3 className="font-semibold text-white">Horaires d'ouverture</h3>
              </div>
              <div className="divide-y" style={{ borderColor: '#F5F5F4' }}>
                {restaurant.hours.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-3"
                    style={{
                      backgroundColor: i === todayIndex ? '#FFFBEB' : 'white'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {i === todayIndex && (
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D97706' }} />
                      )}
                      <span className={`text-sm font-medium ${i === todayIndex ? '' : ''}`}
                        style={{ color: i === todayIndex ? '#D97706' : '#1C1917' }}>
                        {h.day}
                        {i === todayIndex && <span className="ml-1 text-xs font-normal" style={{ color: '#D97706' }}>(aujourd'hui)</span>}
                      </span>
                    </div>
                    {h.closed ? (
                      <span className="text-xs font-medium" style={{ color: '#78716C' }}>Fermé</span>
                    ) : (
                      <div className="text-right text-xs" style={{ color: '#44403C' }}>
                        <div>{h.lunch}</div>
                        {h.dinner !== 'Fermé' && <div>{h.dinner}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-2" style={{ backgroundColor: '#D97706' }}>
              <Mail size={18} style={{ color: 'white' }} />
              <h3 className="font-semibold text-white">Envoyez-nous un message</h3>
            </div>
            <div className="p-8">
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#D97706' }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#1C1917' }}>Message envoyé !</h3>
                  <p className="text-sm mb-6" style={{ color: '#78716C' }}>
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#D97706' }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                        style={{ borderColor: '#E5E7EB', color: '#1C1917', backgroundColor: '#FAFAFA' }}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                        style={{ borderColor: '#E5E7EB', color: '#1C1917', backgroundColor: '#FAFAFA' }}
                        placeholder="votre@email.fr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                      Sujet
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                      style={{ borderColor: '#E5E7EB', color: '#1C1917', backgroundColor: '#FAFAFA' }}
                      placeholder="Réservation, événement privé..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none"
                      style={{ borderColor: '#E5E7EB', color: '#1C1917', backgroundColor: '#FAFAFA' }}
                      placeholder="Votre message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#D97706' }}
                  >
                    <Send size={18} />
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
