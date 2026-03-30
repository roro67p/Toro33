import { useState } from 'react'
import useStore from '../../store/useStore'
import { CalendarCheck, CheckCircle } from 'lucide-react'

const TIME_OPTIONS = ['12h00', '12h30', '13h00', '13h30', '14h00', '19h00', '19h30', '20h00', '20h30', '21h00', '21h30']

export default function Reservation() {
  const { addReservation, data } = useStore()
  const { restaurant } = data

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: 2,
    notes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    if (!form.date) e.date = 'Date requise'
    if (!form.time) e.time = 'Heure requise'
    if (!form.guests || form.guests < 1) e.guests = 'Nombre de couverts requis'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    addReservation(form)
    setSubmitted(true)
    setErrors({})
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const inputClass = (field) => `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2`
  const inputStyle = (field) => ({
    borderColor: errors[field] ? '#DC2626' : '#E5E7EB',
    backgroundColor: 'white',
    color: '#1C1917',
    focusRingColor: '#D97706'
  })

  const today = new Date().toISOString().split('T')[0]

  if (submitted) {
    return (
      <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
        {/* Header */}
        <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
            Réservation
          </h1>
        </div>

        <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="bg-white rounded-2xl p-10 shadow-lg">
            <CheckCircle size={64} className="mx-auto mb-6" style={{ color: '#D97706' }} />
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
              Réservation envoyée !
            </h2>
            <p className="text-base mb-2" style={{ color: '#44403C' }}>
              Merci <strong>{form.name}</strong>, votre demande de réservation a bien été reçue.
            </p>
            <p className="text-sm mb-6" style={{ color: '#78716C' }}>
              Pour {form.guests} couvert{form.guests > 1 ? 's' : ''} le {form.date} à {form.time}
            </p>
            <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#FEF3C7' }}>
              <p className="text-sm" style={{ color: '#92400E' }}>
                Nous vous contacterons au <strong>{form.phone}</strong> pour confirmer votre réservation.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              Faire une autre réservation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
          En ligne, 24h/24
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
          Réserver une table
        </h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#A8A29E' }}>
          Remplissez le formulaire ci-dessous et nous confirmerons votre réservation rapidement.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: '#D97706' }}>
            <CalendarCheck size={20} style={{ color: 'white' }} />
            <span className="text-sm font-semibold text-white">Demande de réservation</span>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                  Nom complet <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className={inputClass('name')}
                  style={{
                    borderColor: errors.name ? '#DC2626' : '#E5E7EB',
                    backgroundColor: 'white',
                    color: '#1C1917'
                  }}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                  Téléphone <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  className={inputClass('phone')}
                  style={{
                    borderColor: errors.phone ? '#DC2626' : '#E5E7EB',
                    backgroundColor: 'white',
                    color: '#1C1917'
                  }}
                />
                {errors.phone && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.phone}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="jean@email.fr"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                className={inputClass('email')}
                style={{
                  borderColor: '#E5E7EB',
                  backgroundColor: 'white',
                  color: '#1C1917'
                }}
              />
            </div>

            {/* Date, Time, Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                  Date <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={e => handleChange('date', e.target.value)}
                  className={inputClass('date')}
                  style={{
                    borderColor: errors.date ? '#DC2626' : '#E5E7EB',
                    backgroundColor: 'white',
                    color: '#1C1917'
                  }}
                />
                {errors.date && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                  Heure <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={form.time}
                  onChange={e => handleChange('time', e.target.value)}
                  className={inputClass('time')}
                  style={{
                    borderColor: errors.time ? '#DC2626' : '#E5E7EB',
                    backgroundColor: 'white',
                    color: form.time ? '#1C1917' : '#9CA3AF'
                  }}
                >
                  <option value="">Choisir</option>
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.time && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.time}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                  Couverts <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={form.guests}
                  onChange={e => handleChange('guests', parseInt(e.target.value))}
                  className={inputClass('guests')}
                  style={{
                    borderColor: errors.guests ? '#DC2626' : '#E5E7EB',
                    backgroundColor: 'white',
                    color: '#1C1917'
                  }}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.guests && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.guests}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                Notes / Allergies / Occasion spéciale
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Allergie aux noix, anniversaire, chaise haute nécessaire..."
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none resize-none"
                style={{
                  borderColor: '#E5E7EB',
                  backgroundColor: 'white',
                  color: '#1C1917'
                }}
              />
            </div>

            {/* Info box */}
            <div className="rounded-xl p-4" style={{ backgroundColor: '#FEF3C7' }}>
              <p className="text-sm" style={{ color: '#92400E' }}>
                <strong>Confirmation :</strong> Nous vous contacterons sous 2h pour confirmer votre réservation. Pour une réservation urgente, appelez-nous directement au{' '}
                <a href={`tel:${restaurant.phone}`} className="font-semibold" style={{ color: '#D97706' }}>
                  {restaurant.phone}
                </a>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: '#D97706' }}
            >
              <CalendarCheck size={20} />
              Envoyer ma demande de réservation
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
