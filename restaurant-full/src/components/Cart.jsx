import { useState } from 'react'
import useStore from '../store/useStore'
import { ShoppingBag, X, Plus, Minus, Trash2, ChevronRight, CheckCircle } from 'lucide-react'

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, updateCartNote, clearCart, addCustomerOrder } = useStore()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('cart') // 'cart' | 'checkout' | 'success'
  const [form, setForm] = useState({ name: '', phone: '', table: '', type: 'table', notes: '' })
  const [orderNum, setOrderNum] = useState(null)
  const [errors, setErrors] = useState({})

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    if (form.type === 'table' && !form.table.trim()) e.table = 'Numéro de table requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleOrder = () => {
    if (!validate()) return
    const num = Math.floor(1000 + Math.random() * 9000)
    addCustomerOrder({
      orderNumber: num,
      customerName: form.name,
      phone: form.phone,
      table: form.type === 'table' ? form.table : 'À emporter',
      type: form.type,
      notes: form.notes,
      items: cart.map(c => ({ ...c })),
      total,
    })
    setOrderNum(num)
    clearCart()
    setStep('success')
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      if (step === 'success') {
        setStep('cart')
        setForm({ name: '', phone: '', table: '', type: 'table', notes: '' })
        setOrderNum(null)
      }
    }, 300)
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${errors[field] ? '#FCA5A5' : '#E7E5E4'}`,
    backgroundColor: errors[field] ? '#FFF5F5' : 'white',
    fontSize: '14px',
    color: '#1C1917',
    outline: 'none',
    boxSizing: 'border-box',
  })

  if (count === 0 && !open) return null

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => { setOpen(true); setStep('cart') }}
        className="fixed z-40 flex items-center gap-2 px-4 py-3 rounded-full text-white font-semibold shadow-2xl transition-all duration-200 hover:scale-105"
        style={{ bottom: '80px', right: '24px', backgroundColor: '#1C1917' }}
      >
        <ShoppingBag size={20} />
        <span>{count}</span>
        <span className="font-bold" style={{ color: '#D97706' }}>{total.toFixed(2)}€</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FAFAF9',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          boxShadow: '-4px 0 30px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #E7E5E4', backgroundColor: 'white' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: '#D97706' }} />
            <span className="font-bold text-lg" style={{ color: '#1C1917' }}>
              {step === 'cart' ? 'Mon panier' : step === 'checkout' ? 'Finaliser' : 'Commande confirmée'}
            </span>
            {step === 'cart' && count > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                {count} article{count > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg hover:opacity-70" style={{ color: '#78716C' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* ─── CART STEP ─── */}
          {step === 'cart' && (
            <div className="p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="font-semibold" style={{ color: '#1C1917' }}>Votre panier est vide</p>
                  <p className="text-sm mt-1" style={{ color: '#78716C' }}>Ajoutez des plats depuis le menu ou les boissons.</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.cartId} className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm" style={{ color: '#1C1917' }}>{item.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            {item.priceType === 'glass' ? 'Au verre' : item.priceType === 'bottle' ? 'À la bouteille' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm" style={{ color: '#D97706' }}>
                            {(item.price * item.quantity).toFixed(2)}€
                          </p>
                          <p className="text-xs" style={{ color: '#94A3B8' }}>
                            {item.price.toFixed(2)}€ / u
                          </p>
                        </div>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQty(item.cartId, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#F5F5F4', color: '#57534E' }}
                          >
                            {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                          </button>
                          <span className="w-6 text-center font-semibold text-sm" style={{ color: '#1C1917' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.cartId, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.cartId)} className="p-1 rounded-lg hover:opacity-70" style={{ color: '#EF4444' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Note */}
                      <input
                        type="text"
                        placeholder="Note (sans sauce, bien cuit...)"
                        value={item.note || ''}
                        onChange={e => updateCartNote(item.cartId, e.target.value)}
                        className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg outline-none"
                        style={{ border: '1px solid #E7E5E4', backgroundColor: '#FAFAF9', color: '#57534E' }}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ─── CHECKOUT STEP ─── */}
          {step === 'checkout' && (
            <div className="p-4 space-y-4">
              {/* Order type */}
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: '#57534E' }}>Type de commande</p>
                <div className="flex gap-2">
                  {[{ id: 'table', label: '🍽️ Sur place' }, { id: 'takeaway', label: '🥡 À emporter' }].map(t => (
                    <button
                      key={t.id}
                      onClick={() => set('type', t.id)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: form.type === t.id ? '#D97706' : '#F5F5F4',
                        color: form.type === t.id ? 'white' : '#57534E'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '5px' }}>Nom *</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jean Dupont" style={inputStyle('name')} />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '5px' }}>Téléphone *</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="06 12 34 56 78" style={inputStyle('phone')} />
                {errors.phone && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.phone}</p>}
              </div>

              {/* Table number */}
              {form.type === 'table' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '5px' }}>Numéro de table *</label>
                  <input type="text" value={form.table} onChange={e => set('table', e.target.value)} placeholder="Ex: 5" style={inputStyle('table')} />
                  {errors.table && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.table}</p>}
                </div>
              )}

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#57534E', marginBottom: '5px' }}>Notes générales</label>
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  rows={2}
                  placeholder="Allergie, précision..."
                  style={{ ...inputStyle('notes'), resize: 'none' }}
                />
              </div>

              {/* Summary */}
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#FEF3C7' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#92400E' }}>Récapitulatif</p>
                {cart.map(item => (
                  <div key={item.cartId} className="flex justify-between text-sm mb-1" style={{ color: '#78716C' }}>
                    <span>{item.quantity}× {item.name}</span>
                    <span>{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2" style={{ borderTop: '1px solid #F59E0B', color: '#1C1917' }}>
                  <span>Total</span>
                  <span style={{ color: '#D97706' }}>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── SUCCESS STEP ─── */}
          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: '#F0FDF4' }}>
                <CheckCircle size={40} style={{ color: '#16A34A' }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
                Commande envoyée !
              </h2>
              <div className="inline-block px-5 py-2 rounded-full mb-3" style={{ backgroundColor: '#FEF3C7' }}>
                <span className="text-2xl font-bold" style={{ color: '#D97706' }}>#{orderNum}</span>
              </div>
              <p className="text-sm mb-1" style={{ color: '#78716C' }}>Merci <strong>{form.name}</strong> !</p>
              <p className="text-sm" style={{ color: '#78716C' }}>
                {form.type === 'table' ? `Table ${form.table}` : 'À emporter'} — notre équipe prépare votre commande.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step === 'cart' && cart.length > 0 && (
          <div className="p-4" style={{ borderTop: '1px solid #E7E5E4', backgroundColor: 'white' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold" style={{ color: '#57534E' }}>Total</span>
              <span className="text-xl font-bold" style={{ color: '#D97706' }}>{total.toFixed(2)}€</span>
            </div>
            <button
              onClick={() => setStep('checkout')}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              Commander
              <ChevronRight size={18} />
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-70"
              style={{ color: '#EF4444' }}
            >
              Vider le panier
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <div className="p-4" style={{ borderTop: '1px solid #E7E5E4', backgroundColor: 'white' }}>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('cart')}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: '#F5F5F4', color: '#57534E' }}
              >
                Retour
              </button>
              <button
                onClick={handleOrder}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#D97706' }}
              >
                Confirmer {total.toFixed(2)}€
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-4" style={{ borderTop: '1px solid #E7E5E4', backgroundColor: 'white' }}>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: '#D97706' }}
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </>
  )
}
