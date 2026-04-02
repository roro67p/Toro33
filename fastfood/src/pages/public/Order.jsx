import { useState } from 'react'
import useStore from '../../store/useStore'
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle, Tag, X } from 'lucide-react'

let orderCounter = Math.floor(Math.random() * 900) + 100

export default function Order() {
  const { data, cart, addToCart, removeFromCart, updateCartQty, clearCart, addCustomerOrder, usePromoCode } = useStore()
  const { menuCategories, drinkCategories, formules } = data
  const extras = data.extras || []

  const [form, setForm] = useState({ name: '', phone: '', type: 'takeaway', address: '', note: '' })
  const [errors, setErrors] = useState({})
  const [confirmed, setConfirmed] = useState(false)
  const [orderNum, setOrderNum] = useState(null)
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [customizing, setCustomizing] = useState(null)
  const [selectedExtras, setSelectedExtras] = useState({})

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const extrasTotal = Object.values(selectedExtras).flat().reduce((s, e) => s + e.price, 0)
  const discount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? (subtotal + extrasTotal) * appliedPromo.value / 100
      : Math.min(appliedPromo.value, subtotal + extrasTotal)
    : 0
  const total = Math.max(0, subtotal + extrasTotal - discount)

  const applyPromo = () => {
    if (!promoInput.trim()) return
    const promo = usePromoCode(promoInput.trim())
    if (!promo) { setPromoError('Code invalide ou expiré'); return }
    if (subtotal < promo.minOrder) { setPromoError(`Commande minimum : ${promo.minOrder}€`); return }
    setAppliedPromo(promo); setPromoError(''); setPromoInput('')
  }

  const toggleExtra = (cartId, extra) => {
    setSelectedExtras(prev => {
      const list = prev[cartId] || []
      const exists = list.find(e => e.id === extra.id)
      return { ...prev, [cartId]: exists ? list.filter(e => e.id !== extra.id) : [...list, extra] }
    })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Requis'
    if (!form.phone.trim()) e.phone = 'Requis'
    if (form.type === 'delivery' && !form.address.trim()) e.address = 'Adresse requise'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleOrder = () => {
    if (!validate()) return
    const num = ++orderCounter
    setOrderNum(num)
    const itemsWithExtras = cart.map(i => ({
      ...i,
      extras: selectedExtras[i.cartId] || []
    }))
    addCustomerOrder({
      orderNumber: num, customerName: form.name, phone: form.phone,
      type: form.type, address: form.address, note: form.note,
      items: itemsWithExtras, total,
      promoCode: appliedPromo?.code || null,
      promoDiscount: discount || null
    })
    clearCart(); setAppliedPromo(null); setSelectedExtras({}); setConfirmed(true)
  }

  const allItems = [
    ...menuCategories.flatMap(c => c.items.filter(i => i.available !== false)),
    ...drinkCategories.flatMap(c => c.items.filter(i => i.available !== false).map(i => ({ ...i, price: i.priceSm }))),
    ...(formules || []).filter(f => f.available !== false),
  ]

  const INPUT = { backgroundColor: '#1F2937', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px', outline: 'none' }

  if (confirmed) return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center px-6 max-w-sm">
        <div className="text-6xl mb-4">🍔</div>
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: '#10B981' }} />
        <h2 className="text-3xl font-black text-white mb-2">Commande confirmée !</h2>
        <div className="px-6 py-3 rounded-2xl mb-4 inline-block" style={{ backgroundColor: '#FFF1F2' }}>
          <p className="text-3xl font-black" style={{ color: '#E11D48' }}>#{orderNum}</p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Notez ce numéro pour le suivi</p>
        </div>
        <p className="mb-1 text-white font-semibold">Merci {form.name} !</p>
        <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
          {form.type === 'takeaway' ? '🥡 Prête en ~10 min à emporter' : form.type === 'delivery' ? '🛵 En cours de livraison' : '🍽️ Commande transmise en cuisine'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setConfirmed(false); setForm({ name: '', phone: '', type: 'takeaway', address: '', note: '' }) }}
            className="px-5 py-2.5 rounded-xl font-bold text-white" style={{ backgroundColor: '#E11D48' }}>
            Nouvelle commande
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div className="py-10 text-center" style={{ background: 'linear-gradient(135deg, #111827, #0F172A)' }}>
        <h1 className="text-3xl font-black text-white">Commander</h1>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Rapide, facile, délicieux</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items picker */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { title: 'Burgers & Plats', icon: '🍔', items: menuCategories.flatMap(c => c.items.filter(i => i.available !== false)) },
              { title: 'Boissons', icon: '🥤', items: drinkCategories.flatMap(c => c.items.filter(i => i.available !== false).map(i => ({ ...i, price: i.priceSm }))) },
              { title: 'Formules', icon: '🎯', items: (formules || []).filter(f => f.available !== false) },
            ].map(section => (
              <div key={section.title}>
                <h2 className="flex items-center gap-2 font-black text-white text-lg mb-3"><span>{section.icon}</span>{section.title}</h2>
                <div className="space-y-2">
                  {section.items.map(item => {
                    const inCart = cart.find(c => c.cartId === item.id)
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                        <div className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                          <div>
                            <div className="font-semibold text-sm text-white">{item.name}</div>
                            <div className="font-bold text-sm" style={{ color: '#E11D48' }}>{Number(item.price).toFixed(2)}€</div>
                          </div>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => setCustomizing(customizing === inCart.cartId ? null : inCart.cartId)}
                              className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>
                              + Extras {selectedExtras[inCart.cartId]?.length > 0 && `(${selectedExtras[inCart.cartId].length})`}
                            </button>
                            <button onClick={() => updateCartQty(item.id, inCart.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#374151', color: 'white' }}><Minus size={12} /></button>
                            <span className="font-bold text-sm text-white w-4 text-center">{inCart.quantity}</span>
                            <button onClick={() => addToCart({ cartId: item.id, name: item.name, price: item.price, type: 'item' })} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E11D48', color: 'white' }}><Plus size={12} /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart({ cartId: item.id, name: item.name, price: item.price, type: 'item' })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: '#E11D48' }}>
                            <Plus size={12} /> Ajouter
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Cart + checkout */}
          <div>
            <div className="rounded-2xl p-5 sticky top-24" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
              <h2 className="font-black text-white mb-4 flex items-center gap-2">
                <ShoppingCart size={18} style={{ color: '#E11D48' }} /> Mon panier
                {cart.length > 0 && <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E11D48', color: 'white' }}>{cart.reduce((s, i) => s + i.quantity, 0)}</span>}
              </h2>

              {cart.length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: '#6B7280' }}>Votre panier est vide</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {cart.map(item => (
                      <div key={item.cartId}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">{item.name}</div>
                            <div className="text-xs" style={{ color: '#E11D48' }}>{(item.price * item.quantity).toFixed(2)}€</div>
                            {selectedExtras[item.cartId]?.length > 0 && (
                              <div className="text-xs" style={{ color: '#9CA3AF' }}>
                                + {selectedExtras[item.cartId].map(e => e.name).join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 ml-2">
                            <button onClick={() => updateCartQty(item.cartId, item.quantity - 1)} className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#374151', color: 'white' }}><Minus size={10} /></button>
                            <span className="text-xs font-bold text-white w-3 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.cartId, item.quantity + 1)} className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#374151', color: 'white' }}><Plus size={10} /></button>
                            <button onClick={() => removeFromCart(item.cartId)} className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={10} /></button>
                          </div>
                        </div>
                        {/* Extras panel */}
                        {customizing === item.cartId && (
                          <div className="mt-2 p-3 rounded-xl" style={{ backgroundColor: '#111827' }}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-bold text-white">Extras</p>
                              <button onClick={() => setCustomizing(null)}><X size={12} style={{ color: '#6B7280' }} /></button>
                            </div>
                            <div className="space-y-1">
                              {extras.map(extra => {
                                const selected = (selectedExtras[item.cartId] || []).find(e => e.id === extra.id)
                                return (
                                  <button key={extra.id} onClick={() => toggleExtra(item.cartId, extra)}
                                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all"
                                    style={{ backgroundColor: selected ? '#FFF1F2' : '#1F2937', color: selected ? '#E11D48' : '#9CA3AF', border: `1px solid ${selected ? '#E11D48' : '#374151'}` }}>
                                    <span>{extra.name}</span>
                                    <span>+{extra.price.toFixed(2)}€</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Promo code */}
                  <div className="mb-3">
                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: '#D1FAE5' }}>
                        <div className="flex items-center gap-2">
                          <Tag size={13} style={{ color: '#065F46' }} />
                          <span className="text-xs font-bold" style={{ color: '#065F46' }}>{appliedPromo.code} -{appliedPromo.type === 'percent' ? `${appliedPromo.value}%` : `${appliedPromo.value}€`}</span>
                        </div>
                        <button onClick={() => setAppliedPromo(null)}><X size={12} style={{ color: '#065F46' }} /></button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && applyPromo()}
                            placeholder="Code promo" className="flex-1 px-3 py-2 rounded-lg text-xs outline-none text-white"
                            style={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                          <button onClick={applyPromo} className="px-3 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor: '#374151', color: '#E11D48' }}>OK</button>
                        </div>
                        {promoError && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{promoError}</p>}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-1 mb-4 pb-3" style={{ borderBottom: '1px solid #374151' }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#9CA3AF' }}>Sous-total</span>
                      <span className="text-white">{subtotal.toFixed(2)}€</span>
                    </div>
                    {extrasTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#9CA3AF' }}>Extras</span>
                        <span className="text-white">+{extrasTotal.toFixed(2)}€</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#10B981' }}>Réduction</span>
                        <span style={{ color: '#10B981' }}>-{discount.toFixed(2)}€</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between font-black text-lg mb-4">
                    <span className="text-white">Total</span>
                    <span style={{ color: '#E11D48' }}>{total.toFixed(2)}€</span>
                  </div>

                  {/* Form */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Votre prénom *</label>
                      <input style={{ ...INPUT, borderColor: errors.name ? '#EF4444' : '#374151' }} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Marie" />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Téléphone *</label>
                      <input style={{ ...INPUT, borderColor: errors.phone ? '#EF4444' : '#374151' }} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="06 12 34 56 78" />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Type</label>
                      <div className="grid grid-cols-3 gap-1">
                        {[{ v: 'takeaway', label: '🥡 Emporter' }, { v: 'here', label: '🍽️ Sur place' }, { v: 'delivery', label: '🛵 Livraison' }].map(t => (
                          <button key={t.v} onClick={() => setForm(p => ({ ...p, type: t.v }))}
                            className="py-2 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: form.type === t.v ? '#E11D48' : '#374151', color: form.type === t.v ? 'white' : '#9CA3AF' }}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {form.type === 'delivery' && (
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Adresse *</label>
                        <input style={{ ...INPUT, borderColor: errors.address ? '#EF4444' : '#374151' }} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="12 rue..." />
                      </div>
                    )}
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Note cuisine</label>
                      <input style={INPUT} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Sans cornichons, bien cuit..." />
                    </div>
                    <button onClick={handleOrder} className="w-full py-3 rounded-xl font-black text-white" style={{ backgroundColor: '#E11D48' }}>
                      Confirmer · {total.toFixed(2)}€
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
