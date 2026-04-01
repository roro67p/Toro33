import { useState } from 'react'
import useStore from '../../store/useStore'
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle, Truck, Package, UtensilsCrossed } from 'lucide-react'

let orderCounter = Math.floor(Math.random() * 900) + 100

export default function Order() {
  const { data, cart, addToCart, removeFromCart, updateCartQty, clearCart, addCustomerOrder } = useStore()
  const { menuCategories, drinkCategories, formules } = data
  const [step, setStep] = useState('cart')
  const [form, setForm] = useState({ name: '', phone: '', type: 'takeaway', address: '', note: '' })
  const [errors, setErrors] = useState({})
  const [confirmed, setConfirmed] = useState(false)
  const [orderNum, setOrderNum] = useState(null)

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const allItems = [
    ...menuCategories.flatMap(c => c.items.map(i => ({ ...i, catType: 'menu' }))),
    ...drinkCategories.flatMap(c => c.items.map(i => ({ ...i, catType: 'drink', price: i.priceSm }))),
    ...(formules || []).map(f => ({ ...f, catType: 'formule' })),
  ].filter(i => i.available !== false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Requis'
    if (!form.phone.trim()) e.phone = 'Requis'
    if (form.type === 'delivery' && !form.address.trim()) e.address = 'Adresse requise pour la livraison'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleOrder = () => {
    if (!validate()) return
    const num = ++orderCounter
    setOrderNum(num)
    addCustomerOrder({ orderNumber: num, customerName: form.name, phone: form.phone, type: form.type, address: form.address, note: form.note, items: cart, total })
    clearCart()
    setConfirmed(true)
  }

  if (confirmed) return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center px-6">
        <CheckCircle size={64} className="mx-auto mb-4" style={{ color: '#10B981' }} />
        <h2 className="text-3xl font-black text-white mb-2">Commande confirmée !</h2>
        <p className="text-xl font-bold mb-1" style={{ color: '#E11D48' }}>#{orderNum}</p>
        <p className="mb-1" style={{ color: '#9CA3AF' }}>Bonjour {form.name}, votre commande est prise en compte.</p>
        <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
          {form.type === 'takeaway' ? 'Votre commande à emporter sera prête dans ~10 min.' : form.type === 'delivery' ? 'Livraison en cours de préparation.' : 'Votre commande sur place a été transmise.'}
        </p>
        <button onClick={() => { setStep('cart'); setConfirmed(false) }} className="px-8 py-3 rounded-xl font-bold text-white" style={{ backgroundColor: '#E11D48' }}>
          Retour à la commande
        </button>
      </div>
    </div>
  )

  const INPUT = { backgroundColor: '#1F2937', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '10px 14px', width: '100%', fontSize: '14px', outline: 'none' }

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
              { title: 'Boissons', icon: '🥤', items: drinkCategories.flatMap(c => c.items.filter(i => i.available !== false)).map(i => ({ ...i, price: i.priceSm })) },
              { title: 'Formules', icon: '🎯', items: (formules || []).filter(f => f.available !== false) },
            ].map(section => (
              <div key={section.title}>
                <h2 className="flex items-center gap-2 font-black text-white text-lg mb-3">
                  <span>{section.icon}</span>{section.title}
                </h2>
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

          {/* Cart & checkout */}
          <div className="space-y-4">
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
                      <div key={item.cartId} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{item.name}</div>
                          <div className="text-xs" style={{ color: '#E11D48' }}>{(item.price * item.quantity).toFixed(2)}€</div>
                        </div>
                        <div className="flex items-center gap-1.5 ml-2">
                          <button onClick={() => updateCartQty(item.cartId, item.quantity - 1)} className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#374151', color: 'white' }}><Minus size={10} /></button>
                          <span className="text-xs font-bold text-white w-3 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.cartId, item.quantity + 1)} className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#374151', color: 'white' }}><Plus size={10} /></button>
                          <button onClick={() => removeFromCart(item.cartId)} className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={10} /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-black text-lg py-3" style={{ borderTop: '1px solid #374151' }}>
                    <span className="text-white">Total</span>
                    <span style={{ color: '#E11D48' }}>{total.toFixed(2)}€</span>
                  </div>

                  {/* Order form */}
                  <div className="space-y-3 mt-3">
                    <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Votre prénom *</label>
                      <input style={{ ...INPUT, borderColor: errors.name ? '#EF4444' : '#374151' }} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Marie" />
                      {errors.name && <p className="text-xs mt-0.5" style={{ color: '#EF4444' }}>{errors.name}</p>}
                    </div>
                    <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Téléphone *</label>
                      <input style={{ ...INPUT, borderColor: errors.phone ? '#EF4444' : '#374151' }} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="06 12 34 56 78" />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Type de commande</label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { v: 'takeaway', label: 'Emporter', icon: '🥡' },
                          { v: 'here', label: 'Sur place', icon: '🍽️' },
                          { v: 'delivery', label: 'Livraison', icon: '🛵' },
                        ].map(t => (
                          <button key={t.v} onClick={() => setForm(p => ({ ...p, type: t.v }))}
                            className="py-2 rounded-lg text-xs font-semibold transition-all"
                            style={{ backgroundColor: form.type === t.v ? '#E11D48' : '#374151', color: form.type === t.v ? 'white' : '#9CA3AF' }}>
                            {t.icon} {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {form.type === 'delivery' && (
                      <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Adresse *</label>
                        <input style={{ ...INPUT, borderColor: errors.address ? '#EF4444' : '#374151' }} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="12 rue..." />
                        {errors.address && <p className="text-xs mt-0.5" style={{ color: '#EF4444' }}>{errors.address}</p>}
                      </div>
                    )}
                    <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Note</label>
                      <input style={INPUT} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Sans cornichons..." />
                    </div>
                    <button onClick={handleOrder} className="w-full py-3 rounded-xl font-black text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#E11D48' }}>
                      Confirmer ma commande · {total.toFixed(2)}€
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
