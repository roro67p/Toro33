import useStore from '../../store/useStore'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Contact() {
  const { data } = useStore()
  const { restaurant } = data
  const now = new Date()
  const todayIdx = (now.getDay() + 6) % 7
  const todayHours = restaurant.hours[todayIdx]
  const isOpen = !todayHours?.closed

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #111827, #0F172A)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#E11D48' }}>Retrouvez-nous</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Contact & Horaires</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Contact info */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
            <h2 className="font-black text-white mb-5">Nous contacter</h2>
            {[
              { icon: MapPin, label: 'Adresse', value: restaurant.address, color: '#E11D48' },
              { icon: Phone, label: 'Téléphone', value: restaurant.phone, color: '#10B981' },
              { icon: Mail, label: 'Email', value: restaurant.email, color: '#3B82F6' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#111827' }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6B7280' }}>{item.label}</p>
                    <p className="text-sm text-white">{item.value}</p>
                  </div>
                </div>
              )
            })}
            <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: isOpen ? '#D1FAE5' : '#FEE2E2' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isOpen ? '#10B981' : '#EF4444' }} />
              <span className="text-sm font-semibold" style={{ color: isOpen ? '#065F46' : '#DC2626' }}>
                {isOpen ? `Ouvert aujourd'hui : ${todayHours.open} – ${todayHours.close}` : "Fermé aujourd'hui"}
              </span>
            </div>
          </div>

          {/* Hours */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
            <h2 className="font-black text-white mb-5 flex items-center gap-2"><Clock size={18} style={{ color: '#E11D48' }} /> Horaires</h2>
            <div className="space-y-2">
              {restaurant.hours.map((h, i) => {
                const isToday = i === todayIdx
                return (
                  <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #374151' }}>
                    <span className="text-sm font-semibold" style={{ color: isToday ? '#E11D48' : 'white' }}>{h.day}{isToday && ' (auj.)'}</span>
                    <span className="text-sm" style={{ color: h.closed ? '#6B7280' : '#9CA3AF' }}>
                      {h.closed ? 'Fermé' : `${h.open} – ${h.close}`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="text-center">
          <p className="font-semibold text-white mb-4">Suivez-nous</p>
          <div className="flex justify-center gap-4">
            {[
              { label: 'Instagram', href: restaurant.socialMedia?.instagram },
              { label: 'Facebook', href: restaurant.socialMedia?.facebook },
              { label: 'TikTok', href: restaurant.socialMedia?.tiktok },
            ].map((s, i) => (
              <a key={i} href={s.href} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: '#1F2937', color: '#E11D48', border: '1px solid #374151' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
