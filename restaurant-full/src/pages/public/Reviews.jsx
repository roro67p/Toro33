import { useState } from 'react'
import useStore from '../../store/useStore'
import { Star, Send, CheckCircle, MessageSquare } from 'lucide-react'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="text-3xl transition-transform hover:scale-110"
          style={{ color: n <= (hover || value) ? '#F59E0B' : '#E5E7EB' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const date = new Date(review.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
              {review.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#1C1917' }}>{review.name}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>{date}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0">
          {[1,2,3,4,5].map(n => (
            <span key={n} style={{ color: n <= review.rating ? '#F59E0B' : '#E5E7EB', fontSize: '16px' }}>★</span>
          ))}
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#57534E' }}>{review.comment}</p>
      {review.reply && (
        <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: '#F5F3FF', borderLeft: '3px solid #7C3AED' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#7C3AED' }}>🍽️ Réponse de l'établissement</p>
          <p className="text-sm" style={{ color: '#57534E' }}>{review.reply}</p>
        </div>
      )}
    </div>
  )
}

export default function Reviews() {
  const { data, addReview } = useStore()
  const approvedReviews = (data.reviews || []).filter(r => r.approved).sort((a, b) => b.date.localeCompare(a.date))
  const avgRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length)
    : 0
  const ratingCounts = [5,4,3,2,1].map(n => ({ n, count: approvedReviews.filter(r => r.rating === n).length }))

  const [form, setForm] = useState({ name: '', rating: 0, comment: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Votre prénom est requis'
    if (!form.rating) e.rating = 'Choisissez une note'
    if (!form.comment.trim() || form.comment.trim().length < 10) e.comment = 'Minimum 10 caractères'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    addReview({ name: form.name.trim(), rating: form.rating, comment: form.comment.trim() })
    setSent(true)
  }

  return (
    <div style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: '#D97706' }}>Témoignages</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: 'white' }}>Avis de nos clients</h1>
        <div className="divider-gold w-24 mx-auto" />
        <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#A8A29E' }}>
          Chaque repas est une expérience — partagez la vôtre.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Stats + form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rating summary */}
            {approvedReviews.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="text-5xl font-bold mb-1" style={{ color: '#D97706', fontFamily: 'Georgia, serif' }}>
                  {avgRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[1,2,3,4,5].map(n => (
                    <span key={n} style={{ color: n <= Math.round(avgRating) ? '#F59E0B' : '#E5E7EB', fontSize: '20px' }}>★</span>
                  ))}
                </div>
                <p className="text-sm" style={{ color: '#78716C' }}>{approvedReviews.length} avis vérifiés</p>
                {/* Distribution */}
                <div className="mt-4 space-y-1.5">
                  {ratingCounts.map(({ n, count }) => (
                    <div key={n} className="flex items-center gap-2 text-xs">
                      <span style={{ color: '#94A3B8', width: '12px' }}>{n}</span>
                      <span style={{ color: '#F59E0B' }}>★</span>
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: '6px', backgroundColor: '#F3F4F6' }}>
                        <div style={{ width: `${approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0}%`, height: '100%', backgroundColor: '#D97706', borderRadius: '999px' }} />
                      </div>
                      <span style={{ color: '#94A3B8', width: '20px', textAlign: 'right' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leave a review */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {!sent ? (
                <>
                  <h2 className="text-lg font-bold mb-4" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                    Donnez votre avis
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#57534E' }}>Votre prénom *</label>
                      <input
                        type="text" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Marie D."
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${errors.name ? '#FCA5A5' : '#E7E5E4'}`, color: '#1C1917' }}
                      />
                      {errors.name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#57534E' }}>Note *</label>
                      <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                      {form.rating > 0 && (
                        <p className="text-xs mt-1" style={{ color: '#78716C' }}>
                          {['', 'Très déçu', 'Déçu', 'Moyen', 'Bien', 'Excellent !'][form.rating]}
                        </p>
                      )}
                      {errors.rating && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.rating}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: '#57534E' }}>Votre commentaire *</label>
                      <textarea
                        value={form.comment}
                        onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                        rows={4}
                        placeholder="Partagez votre expérience..."
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${errors.comment ? '#FCA5A5' : '#E7E5E4'}`, color: '#1C1917', resize: 'vertical' }}
                      />
                      {errors.comment && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.comment}</p>}
                    </div>
                    <button type="submit"
                      className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                      style={{ backgroundColor: '#D97706' }}>
                      <Send size={15} />
                      Publier mon avis
                    </button>
                    <p className="text-xs text-center" style={{ color: '#94A3B8' }}>Votre avis sera visible après modération.</p>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle size={40} className="mx-auto mb-3" style={{ color: '#16A34A' }} />
                  <h3 className="font-bold mb-1" style={{ color: '#1C1917' }}>Merci {form.name} !</h3>
                  <p className="text-sm" style={{ color: '#78716C' }}>Votre avis sera publié après validation.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', rating: 0, comment: '' }) }}
                    className="mt-4 text-sm underline hover:opacity-70" style={{ color: '#D97706' }}>
                    Laisser un autre avis
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {approvedReviews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-30" style={{ color: '#78716C' }} />
                <p className="font-semibold" style={{ color: '#1C1917' }}>Aucun avis pour l'instant</p>
                <p className="text-sm mt-1" style={{ color: '#78716C' }}>Soyez le premier à partager votre expérience !</p>
              </div>
            ) : (
              approvedReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
