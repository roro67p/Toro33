import { useState } from 'react'
import useStore from '../../store/useStore'
import { Tag, Copy, CheckCircle, Clock, Zap } from 'lucide-react'

export default function Promos() {
  const { data } = useStore()
  const { promoCodes, formules } = data
  const activePromos = (promoCodes || []).filter(p => p.active)
  const [copied, setCopied] = useState(null)

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #7F1D1D, #0F172A)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#FCA5A5' }}>Économisez plus</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Offres & Promos</h1>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Codes promo exclusifs et offres spéciales</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Promo codes */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Tag size={22} style={{ color: '#E11D48' }} /> Codes promo actifs
          </h2>
          {activePromos.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: '#1F2937' }}>
              <p className="text-white">Aucun code promo actif en ce moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {activePromos.map(promo => (
                <div key={promo.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                  <div className="p-5" style={{ borderBottom: '1px solid #374151' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl font-black text-xl tracking-widest" style={{ backgroundColor: '#111827', color: '#E11D48', border: '2px dashed #E11D48' }}>
                          {promo.code}
                        </div>
                        <button onClick={() => copyCode(promo.code)} className="p-2 rounded-lg transition-all hover:opacity-80"
                          style={{ backgroundColor: copied === promo.code ? '#D1FAE5' : '#374151', color: copied === promo.code ? '#065F46' : '#9CA3AF' }}>
                          {copied === promo.code ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <div className="text-2xl font-black" style={{ color: '#E11D48' }}>
                        {promo.type === 'percent' ? `-${promo.value}%` : `-${promo.value}€`}
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>{promo.description}</p>
                  </div>
                  <div className="px-5 py-3 flex items-center gap-4 text-xs" style={{ color: '#6B7280' }}>
                    <span>Min. {promo.minOrder}€</span>
                    {promo.maxUses && <span>{promo.maxUses - promo.uses} utilisations restantes</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment utiliser */}
        <div className="rounded-2xl p-6 mb-10" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
          <h2 className="font-black text-white text-lg mb-4 flex items-center gap-2"><Zap size={18} style={{ color: '#F59E0B' }} /> Comment utiliser un code ?</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { num: '1', text: 'Ajoutez vos articles au panier' },
              { num: '2', text: 'Entrez le code promo à la commande' },
              { num: '3', text: 'La réduction s\'applique automatiquement' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mx-auto mb-2" style={{ backgroundColor: '#E11D48', color: 'white' }}>{step.num}</div>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formules promo */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6">Formules économiques</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(formules || []).filter(f => f.originalPrice && f.available).map(f => {
              const savings = (f.originalPrice - f.price).toFixed(2)
              const pct = Math.round(((f.originalPrice - f.price) / f.originalPrice) * 100)
              return (
                <div key={f.id} className="flex gap-4 p-4 rounded-2xl" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                  {f.image && <img src={f.image} alt={f.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-white">{f.name}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>-{pct}%</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>{f.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-black" style={{ color: '#E11D48' }}>{Number(f.price).toFixed(2)}€</span>
                      <span className="text-xs line-through" style={{ color: '#6B7280' }}>{Number(f.originalPrice).toFixed(2)}€</span>
                      <span className="text-xs font-bold" style={{ color: '#10B981' }}>Économie : {savings}€</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
