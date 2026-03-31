import { useState } from 'react'
import useStore from '../../store/useStore'
import { CalendarCheck, CheckCircle, Clock, Users, ChevronDown } from 'lucide-react'

const TIME_OPTIONS = [
  '12h00', '12h30', '13h00', '13h30', '14h00',
  '19h00', '19h30', '20h00', '20h30', '21h00', '21h30'
]

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function Reservation() {
  const { addReservation } = useStore()
  const [step, setStep] = useState(1) // 1=form, 2=confirm, 3=success
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: TIME_OPTIONS[5],
    guests: 2,
    occasion: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})

  const OCCASIONS = [
    { value: '', label: 'Aucune occasion particulière' },
    { value: 'birthday', label: '🎂 Anniversaire' },
    { value: 'anniversary', label: '💑 Anniversaire de mariage' },
    { value: 'business', label: '💼 Repas d\'affaires' },
    { value: 'family', label: '👨‍👩‍👧 Repas de famille' },
    { value: 'date', label: '❤️ Rendez-vous romantique' },
    { value: 'other', label: '✨ Autre' },
  ]

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    if (!form.date) e.date = 'Date requise'
    else if (form.date < getTodayStr()) e.date = 'La date doit être dans le futur'
    if (!form.time) e.time = 'Heure requise'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setStep(2)
  }

  const handleConfirm = () => {
    addReservation({
      name: form.name,
      phone: form.phone,
      email: form.email,
      date: form.date,
      time: form.time,
      guests: form.guests,
      occasion: form.occasion,
      notes: form.notes,
    })
    setStep(3)
  }

  const handleReset = () => {
    setForm({ name: '', phone: '', email: '', date: '', time: TIME_OPTIONS[5], guests: 2, occasion: '', notes: '' })
    setErrors({})
    setStep(1)
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1.5px solid ${errors[field] ? '#FCA5A5' : '#E7E5E4'}`,
    backgroundColor: errors[field] ? '#FFF5F5' : 'white',
    fontSize: '14px',
    color: '#1C1917',
    outline: 'none',
    boxSizing: 'border-box',
  })

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '6px' }

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>
          Réservez votre table
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>
          Réservation
        </h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#A8A29E' }}>
          Réservez en quelques secondes. Confirmation immédiate — notre équipe vous attend.
        </p>
      </div>

      {/* Steps indicator */}
      {step < 3 && (
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: step >= s ? '#D97706' : '#E7E5E4',
                      color: step >= s ? 'white' : '#78716C'
                    }}
                  >
                    {s}
                  </div>
                  <span className="text-sm font-medium" style={{ color: step >= s ? '#D97706' : '#78716C' }}>
                    {s === 1 ? 'Vos informations' : 'Confirmation'}
                  </span>
                </div>
                {s < 2 && <div style={{ width: '40px', height: '2px', backgroundColor: step > 1 ? '#D97706' : '#E7E5E4' }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-16">
        {/* Step 1 — Form */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="grid gap-5">
              {/* Name */}
              <div>
                <label style={labelStyle}>Nom complet *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Jean Dupont"
                  style={inputStyle('name')}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.name}</p>}
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Téléphone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="06 12 34 56 78"
                    style={inputStyle('phone')}
                  />
                  {errors.phone && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.phone}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Email (optionnel)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="jean@email.com"
                    style={inputStyle('email')}
                  />
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    min={getTodayStr()}
                    onChange={e => set('date', e.target.value)}
                    style={inputStyle('date')}
                  />
                  {errors.date && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.date}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Heure *</label>
                  <select
                    value={form.time}
                    onChange={e => set('time', e.target.value)}
                    style={{ ...inputStyle('time'), appearance: 'none' }}
                  >
                    {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.time && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.time}</p>}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label style={labelStyle}>Nombre de personnes *</label>
                <div className="flex flex-wrap gap-2">
                  {GUEST_OPTIONS.map(n => (
                    <button
                      key={n}
                      onClick={() => set('guests', n)}
                      className="w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-150"
                      style={{
                        backgroundColor: form.guests === n ? '#D97706' : '#F5F5F4',
                        color: form.guests === n ? 'white' : '#57534E'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label style={labelStyle}>Occasion spéciale</label>
                <select
                  value={form.occasion}
                  onChange={e => set('occasion', e.target.value)}
                  style={{ ...inputStyle('occasion'), appearance: 'none' }}
                >
                  {OCCASIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Demandes particulières</label>
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  rows={3}
                  placeholder="Allergie, chaise haute, table en terrasse..."
                  style={{ ...inputStyle('notes'), resize: 'vertical' }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-8 w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#D97706', fontSize: '15px' }}
            >
              <CalendarCheck size={18} />
              Continuer vers la confirmation
            </button>
          </div>
        )}

        {/* Step 2 — Confirm */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
              Récapitulatif de votre réservation
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Nom', value: form.name },
                { label: 'Téléphone', value: form.phone },
                form.email && { label: 'Email', value: form.email },
                { label: 'Date', value: form.date.split('-').reverse().join('/') },
                { label: 'Heure', value: form.time },
                { label: 'Personnes', value: `${form.guests} personne${form.guests > 1 ? 's' : ''}` },
                form.occasion && { label: 'Occasion', value: OCCASIONS.find(o => o.value === form.occasion)?.label },
                form.notes && { label: 'Notes', value: form.notes },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <span className="text-sm font-medium" style={{ color: '#78716C' }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#FEF3C7' }}>
              <p className="text-sm" style={{ color: '#92400E' }}>
                En confirmant, vous acceptez nos conditions de réservation. En cas d'annulation, merci de nous prévenir au moins 24h à l'avance.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: '#F5F5F4', color: '#57534E' }}
              >
                Modifier
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#D97706' }}
              >
                <CheckCircle size={16} />
                Confirmer la réservation
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Success */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#F0FDF4' }}>
              <CheckCircle size={40} style={{ color: '#16A34A' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
              Réservation confirmée !
            </h2>
            <p className="text-sm mb-1" style={{ color: '#78716C' }}>
              Merci <strong>{form.name}</strong> — nous vous attendons le
            </p>
            <p className="text-lg font-bold mb-1" style={{ color: '#D97706' }}>
              {form.date.split('-').reverse().join('/')} à {form.time}
            </p>
            <p className="text-sm" style={{ color: '#78716C' }}>
              pour {form.guests} personne{form.guests > 1 ? 's' : ''}.
            </p>
            {form.phone && (
              <p className="text-sm mt-3" style={{ color: '#78716C' }}>
                Notre équipe peut vous joindre au <strong>{form.phone}</strong> si nécessaire.
              </p>
            )}
            <button
              onClick={handleReset}
              className="mt-8 px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              Faire une nouvelle réservation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
