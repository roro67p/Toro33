import { useState } from 'react'
import useStore from '../../store/useStore'
import { Search, Clock, ChevronRight, CheckCircle, Package, Truck, UtensilsCrossed } from 'lucide-react'

const STEPS = {
  new:       { label: 'Commande reçue',     icon: CheckCircle, step: 1 },
  preparing: { label: 'En préparation',      icon: UtensilsCrossed, step: 2 },
  ready:     { label: 'Prête !',             icon: Package, step: 3 },
  delivered: { label: 'Livrée / Servie',    icon: Truck, step: 4 },
  cancelled: { label: 'Annulée',            icon: null, step: 0 },
}

export default function TrackOrder() {
  const { data } = useStore()
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = () => {
    const num = search.trim().replace('#', '')
    const order = (data.customerOrders || []).find(o => String(o.orderNumber) === num)
    if (order) { setResult(order); setNotFound(false) }
    else { setResult(null); setNotFound(true) }
  }

  const statusInfo = result ? STEPS[result.status] || STEPS.new : null
  const time = result ? new Date(result.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''
  const date = result ? new Date(result.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : ''

  const etaMessages = {
    new: 'Votre commande a été reçue, elle va être préparée très bientôt.',
    preparing: 'Votre commande est en cours de préparation. Encore quelques minutes !',
    ready: result?.type === 'takeaway' ? 'Votre commande est prête ! Venez la récupérer.' : result?.type === 'delivery' ? 'Votre commande est prête et en route !' : 'Votre commande est prête, elle arrive à votre table !',
    delivered: 'Commande livrée. Bon appétit ! 🍔',
    cancelled: 'Cette commande a été annulée.',
  }

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #111827, #0F172A)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#E11D48' }}>Où en est ma commande ?</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Suivi de commande</h1>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Entrez votre numéro de commande</p>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-16">
        <div className="flex gap-2 mb-8">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: '#E11D48' }}>#</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Numéro de commande"
              className="w-full pl-8 pr-4 py-3.5 rounded-xl text-white outline-none text-lg font-bold"
              style={{ backgroundColor: '#1F2937', border: '2px solid #374151' }} />
          </div>
          <button onClick={handleSearch} className="px-6 py-3.5 rounded-xl font-bold text-white flex items-center gap-2"
            style={{ backgroundColor: '#E11D48' }}>
            <Search size={18} />
          </button>
        </div>

        {notFound && (
          <div className="text-center py-10 rounded-2xl" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
            <p className="font-bold text-white mb-1">Commande introuvable</p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Vérifiez votre numéro de commande</p>
          </div>
        )}

        {result && statusInfo && (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
            {/* Header */}
            <div className="p-5" style={{ background: result.status === 'cancelled' ? '#3F1212' : 'linear-gradient(135deg, #E11D48, #7F1D1D)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80 text-white">Commande</p>
                  <p className="text-3xl font-black text-white">#{result.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80 text-white">{date} à {time}</p>
                  <p className="font-black text-xl text-white">{result.total?.toFixed(2)}€</p>
                </div>
              </div>
            </div>

            {/* Status message */}
            <div className="px-5 py-4" style={{ backgroundColor: '#111827', borderBottom: '1px solid #374151' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: result.status === 'cancelled' ? '#3F1212' : '#FFF1F2' }}>
                  {result.status !== 'cancelled' && <span className="animate-pulse text-lg">🍔</span>}
                  {result.status === 'cancelled' && <span className="text-lg">✗</span>}
                </div>
                <div>
                  <p className="font-bold text-white">{statusInfo.label}</p>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>{etaMessages[result.status]}</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {result.status !== 'cancelled' && (
              <div className="px-5 py-5" style={{ borderBottom: '1px solid #374151' }}>
                <div className="flex items-center gap-1">
                  {['new','preparing','ready','delivered'].map((s, i) => {
                    const currentStep = STEPS[result.status]?.step || 1
                    const thisStep = i + 1
                    const done = thisStep <= currentStep
                    const active = thisStep === currentStep
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all"
                            style={{ backgroundColor: done ? '#E11D48' : '#374151', color: done ? 'white' : '#6B7280', boxShadow: active ? '0 0 15px rgba(225,29,72,0.5)' : 'none' }}>
                            {done && thisStep < currentStep ? '✓' : thisStep}
                          </div>
                          <p className="text-xs mt-1 text-center" style={{ color: active ? '#E11D48' : '#6B7280', fontSize: '10px', maxWidth: '60px' }}>
                            {STEPS[s]?.label}
                          </p>
                        </div>
                        {i < 3 && <div className="flex-1 h-1 mx-1 rounded-full" style={{ backgroundColor: thisStep < currentStep ? '#E11D48' : '#374151' }} />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Order details */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B7280' }}>Détails de la commande</p>
              <div className="space-y-1.5 mb-3">
                {result.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ color: '#D1D5DB' }}>{item.quantity}x {item.name}</span>
                    <span style={{ color: '#9CA3AF' }}>{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
                {result.promoCode && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#10B981' }}>Code promo ({result.promoCode})</span>
                    <span style={{ color: '#10B981' }}>-{result.promoDiscount?.toFixed(2)}€</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between font-black pt-2" style={{ borderTop: '1px solid #374151' }}>
                <span className="text-white">Total</span>
                <span style={{ color: '#E11D48' }}>{result.total?.toFixed(2)}€</span>
              </div>
              <div className="mt-3 text-xs" style={{ color: '#6B7280' }}>
                {result.type === 'takeaway' && '🥡 À emporter'}
                {result.type === 'delivery' && `🛵 Livraison${result.address ? ` — ${result.address}` : ''}`}
                {result.type === 'here' && '🍽️ Sur place'}
                {result.note && ` · Note : ${result.note}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
