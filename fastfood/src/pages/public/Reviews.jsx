import { useState } from 'react'
import useStore from '../../store/useStore'
import { Send, CheckCircle, MessageSquare } from 'lucide-react'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          className="text-3xl transition-transform hover:scale-110" style={{ color: n <= (hover || value) ? '#F59E0B' : '#374151' }}>★</button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const { data, addReview } = useStore()
  const approved = (data.reviews || []).filter(r => r.approved).sort((a, b) => b.date.localeCompare(a.date))
  const avg = approved.length > 0 ? (approved.reduce((s, r) => s + r.rating, 0) / approved.length) : 0
  const [form, setForm] = useState({ name: '', rating: 0, comment: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Prénom requis'
    if (!form.rating) e.rating = 'Note requise'
    if (form.comment.trim().length < 10) e.comment = 'Min. 10 caractères'
    setErrors(e); return Object.keys(e).length === 0
  }
  const handleSubmit = (e) => { e.preventDefault(); if (!validate()) return; addReview({ name: form.name.trim(), rating: form.rating, comment: form.comment.trim() }); setSent(true) }

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #111827, #0F172A)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#E11D48' }}>Témoignages</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Avis clients</h1>
        {approved.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-4xl font-black" style={{ color: '#F59E0B' }}>{avg.toFixed(1)}</span>
            <div>{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= Math.round(avg) ? '#F59E0B' : '#374151', fontSize: '20px' }}>★</span>)}</div>
            <span className="text-sm" style={{ color: '#6B7280' }}>{approved.length} avis</span>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
              {!sent ? (
                <>
                  <h2 className="font-black text-white text-lg mb-4">Donnez votre avis</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#9CA3AF' }}>Votre prénom *</label>
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none text-white"
                        style={{ backgroundColor: '#111827', border: `1.5px solid ${errors.name ? '#EF4444' : '#374151'}` }} placeholder="Marie D." />
                      {errors.name && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#9CA3AF' }}>Note *</label>
                      <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                      {form.rating > 0 && <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{['','Très déçu','Déçu','Moyen','Bien','Excellent !'][form.rating]}</p>}
                      {errors.rating && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.rating}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#9CA3AF' }}>Commentaire *</label>
                      <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} rows={4}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none text-white"
                        style={{ backgroundColor: '#111827', border: `1.5px solid ${errors.comment ? '#EF4444' : '#374151'}`, resize: 'vertical' }} placeholder="Partagez votre expérience..." />
                      {errors.comment && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.comment}</p>}
                    </div>
                    <button type="submit" className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2" style={{ backgroundColor: '#E11D48' }}>
                      <Send size={15} /> Publier
                    </button>
                    <p className="text-xs text-center" style={{ color: '#6B7280' }}>Visible après modération.</p>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle size={40} className="mx-auto mb-3" style={{ color: '#10B981' }} />
                  <h3 className="font-bold text-white mb-1">Merci {form.name} !</h3>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>Votre avis sera publié après validation.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', rating: 0, comment: '' }) }} className="mt-4 text-sm underline" style={{ color: '#E11D48' }}>Laisser un autre avis</button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {approved.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#1F2937' }}>
                <MessageSquare size={40} className="mx-auto mb-3 opacity-30" style={{ color: '#9CA3AF' }} />
                <p className="font-semibold text-white">Aucun avis pour l'instant</p>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Soyez le premier à partager !</p>
              </div>
            ) : approved.map(review => (
              <div key={review.id} className="rounded-2xl p-5" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#E11D48', color: 'white' }}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{review.name}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{new Date(review.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div>{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= review.rating ? '#F59E0B' : '#374151', fontSize: '16px' }}>★</span>)}</div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{review.comment}</p>
                {review.reply && (
                  <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: '#111827', borderLeft: '3px solid #E11D48' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#E11D48' }}>🍔 Réponse de {data.restaurant.name}</p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>{review.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
