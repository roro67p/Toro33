import { useState } from 'react'
import useStore from '../../store/useStore'
import { CheckCircle, Trash2, Star, MessageSquare, Send } from 'lucide-react'

export default function ReviewsAdmin() {
  const { data, updateReview, deleteReview } = useStore()
  const reviews = data.reviews || []
  const [filter, setFilter] = useState('all')
  const [replyingId, setReplyingId] = useState(null)
  const [replyText, setReplyText] = useState('')

  const filtered = filter === 'all' ? [...reviews].reverse()
    : filter === 'pending' ? reviews.filter(r => !r.approved).reverse()
    : reviews.filter(r => r.approved).reverse()

  const counts = {
    all: reviews.length,
    pending: reviews.filter(r => !r.approved).length,
    approved: reviews.filter(r => r.approved).length,
  }

  const avgRating = reviews.filter(r => r.approved).length > 0
    ? (reviews.filter(r => r.approved).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.approved).length).toFixed(1)
    : '—'

  const sendReply = (id) => {
    if (!replyText.trim()) return
    updateReview(id, { reply: replyText.trim() })
    setReplyingId(null)
    setReplyText('')
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Avis clients</h1>
          <p className="text-sm mt-1" style={{ color: '#78716C' }}>Note moyenne : <strong style={{ color: '#F59E0B' }}>{avgRating} ★</strong></p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { id: 'all', label: 'Total', icon: MessageSquare, color: '#64748B', bg: '#F5F5F4' },
          { id: 'pending', label: 'À modérer', icon: Star, color: '#7C3AED', bg: '#F5F3FF' },
          { id: 'approved', label: 'Publiés', icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4' },
        ].map(s => {
          const Icon = s.icon
          return (
            <button key={s.id} onClick={() => setFilter(s.id)}
              className="rounded-2xl p-4 text-left transition-all hover:opacity-80"
              style={{ backgroundColor: filter === s.id ? s.bg : 'white', border: `2px solid ${filter === s.id ? s.color : 'transparent'}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} style={{ color: s.color }} />
                <span className="text-xs font-medium" style={{ color: '#78716C' }}>{s.label}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{counts[s.id]}</div>
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#F5F5F4' }}>
          <p className="font-semibold" style={{ color: '#1C1917' }}>Aucun avis</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(review => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: review.approved ? '#D1FAE5' : '#F5F3FF', color: review.approved ? '#065F46' : '#7C3AED' }}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: '#1C1917' }}>{review.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: review.approved ? '#D1FAE5' : '#FEF3C7', color: review.approved ? '#065F46' : '#92400E' }}>
                          {review.approved ? 'Publié' : 'En attente'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div>
                          {[1,2,3,4,5].map(n => (
                            <span key={n} style={{ color: n <= review.rating ? '#F59E0B' : '#E5E7EB', fontSize: '14px' }}>★</span>
                          ))}
                        </div>
                        <span className="text-xs" style={{ color: '#94A3B8' }}>{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!review.approved && (
                      <button onClick={() => updateReview(review.id, { approved: true })}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all hover:opacity-80"
                        style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                        <CheckCircle size={13} /> Approuver
                      </button>
                    )}
                    {review.approved && (
                      <button onClick={() => updateReview(review.id, { approved: false })}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                        style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                        Dépublier
                      </button>
                    )}
                    <button onClick={() => { if (window.confirm('Supprimer cet avis ?')) deleteReview(review.id) }}
                      className="p-1.5 rounded-xl transition-all hover:opacity-80"
                      style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#57534E' }}>{review.comment}</p>

                {/* Existing reply */}
                {review.reply && replyingId !== review.id && (
                  <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: '#F5F3FF', borderLeft: '3px solid #7C3AED' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#7C3AED' }}>Votre réponse</p>
                    <p className="text-sm" style={{ color: '#57534E' }}>{review.reply}</p>
                    <button onClick={() => { setReplyingId(review.id); setReplyText(review.reply) }}
                      className="text-xs mt-1 hover:opacity-70" style={{ color: '#7C3AED' }}>Modifier</button>
                  </div>
                )}

                {/* Reply form */}
                {replyingId === review.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Votre réponse publique..."
                      autoFocus
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{ border: '1.5px solid #D97706', color: '#1C1917', resize: 'none' }}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => sendReply(review.id)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1"
                        style={{ backgroundColor: '#D97706' }}>
                        <Send size={12} /> Publier
                      </button>
                      <button onClick={() => { setReplyingId(null); setReplyText('') }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold"
                        style={{ backgroundColor: '#F5F5F4', color: '#78716C' }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  !review.reply && (
                    <button onClick={() => { setReplyingId(review.id); setReplyText('') }}
                      className="mt-3 text-xs font-semibold hover:opacity-70 flex items-center gap-1"
                      style={{ color: '#7C3AED' }}>
                      <MessageSquare size={12} /> Répondre à cet avis
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
