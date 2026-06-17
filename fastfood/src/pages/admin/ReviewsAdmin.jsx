import { useState } from 'react'
import useStore from '../../store/useStore'
import { CheckCircle, Trash2, MessageSquare, Send } from 'lucide-react'

export default function ReviewsAdmin() {
  const { data, updateReview, deleteReview } = useStore()
  const reviews = data.reviews || []
  const [filter, setFilter] = useState('all')
  const [replyingId, setReplyingId] = useState(null)
  const [replyText, setReplyText] = useState('')

  const filtered = filter === 'all' ? [...reviews].reverse()
    : filter === 'pending' ? reviews.filter(r => !r.approved).reverse()
    : reviews.filter(r => r.approved).reverse()

  const counts = { all: reviews.length, pending: reviews.filter(r => !r.approved).length, approved: reviews.filter(r => r.approved).length }
  const avgRating = reviews.filter(r => r.approved).length > 0
    ? (reviews.filter(r => r.approved).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.approved).length).toFixed(1)
    : '—'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Avis clients</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Note moyenne : <strong style={{ color: '#F59E0B' }}>{avgRating} ★</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { id: 'all', label: 'Total', color: '#6B7280' },
          { id: 'pending', label: 'À modérer', color: '#8B5CF6' },
          { id: 'approved', label: 'Publiés', color: '#10B981' },
        ].map(s => (
          <button key={s.id} onClick={() => setFilter(s.id)} className="rounded-2xl p-4 text-left transition-all hover:opacity-80"
            style={{ backgroundColor: filter === s.id ? '#1F2937' : '#111827', border: `2px solid ${filter === s.id ? s.color : '#374151'}` }}>
            <div className="text-xs font-medium mb-1" style={{ color: '#9CA3AF' }}>{s.label}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{counts[s.id]}</div>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#1F2937' }}>
          <p className="text-white font-semibold">Aucun avis</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(review => (
            <div key={review.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: `1px solid ${!review.approved ? '#8B5CF6' : '#374151'}` }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#111827', color: '#E11D48' }}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{review.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: review.approved ? '#D1FAE5' : '#EDE9FE', color: review.approved ? '#065F46' : '#7C3AED' }}>
                          {review.approved ? 'Publié' : 'En attente'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span>{[1,2,3,4,5].map(n => <span key={n} style={{ color: n <= review.rating ? '#F59E0B' : '#374151', fontSize: '14px' }}>★</span>)}</span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>{new Date(review.date + 'T00:00:00').toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!review.approved && (
                      <button onClick={() => updateReview(review.id, { approved: true })} className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                        style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                        <CheckCircle size={13} /> Approuver
                      </button>
                    )}
                    {review.approved && (
                      <button onClick={() => updateReview(review.id, { approved: false })} className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                        style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Dépublier</button>
                    )}
                    <button onClick={() => { if (window.confirm('Supprimer ?')) deleteReview(review.id) }} className="p-1.5 rounded-xl" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#D1D5DB' }}>{review.comment}</p>
                {review.reply && replyingId !== review.id && (
                  <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: '#111827', borderLeft: '3px solid #E11D48' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#E11D48' }}>Votre réponse</p>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>{review.reply}</p>
                    <button onClick={() => { setReplyingId(review.id); setReplyText(review.reply) }} className="text-xs mt-1" style={{ color: '#E11D48' }}>Modifier</button>
                  </div>
                )}
                {replyingId === review.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={2} autoFocus
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                      style={{ backgroundColor: '#111827', border: '1.5px solid #E11D48', color: 'white' }} />
                    <div className="flex gap-2">
                      <button onClick={() => { updateReview(review.id, { reply: replyText.trim() }); setReplyingId(null); setReplyText('') }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}>
                        <Send size={12} /> Publier
                      </button>
                      <button onClick={() => { setReplyingId(null); setReplyText('') }} className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Annuler</button>
                    </div>
                  </div>
                ) : !review.reply && (
                  <button onClick={() => { setReplyingId(review.id); setReplyText('') }} className="mt-3 text-xs font-semibold flex items-center gap-1" style={{ color: '#E11D48' }}>
                    <MessageSquare size={12} /> Répondre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
