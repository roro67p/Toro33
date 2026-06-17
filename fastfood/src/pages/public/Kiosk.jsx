import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle, ChevronRight, X, Zap } from 'lucide-react'

let kioskCounter = Math.floor(Math.random() * 900) + 100

const STEPS = ['accueil', 'menu', 'panier', 'confirmation']

export default function Kiosk() {
  const { data, cart, addToCart, removeFromCart, updateCartQty, clearCart, addCustomerOrder, usePromoCode } = useStore()
  const { menuCategories, drinkCategories, formules } = data
  const extras = data.extras || []

  const [step, setStep] = useState('accueil')
  const [activeCategory, setActiveCategory] = useState(null)
  const [orderType, setOrderType] = useState(null)
  const [orderNum, setOrderNum] = useState(null)
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [customizing, setCustomizing] = useState(null)
  const [selectedExtras, setSelectedExtras] = useState({})
  const [countdown, setCountdown] = useState(null)

  const allCategories = [
    ...menuCategories.map(c => ({ ...c, type: 'menu' })),
    ...drinkCategories.map(c => ({ ...c, type: 'drink' })),
    { id: 'formules', name: 'Formules', icon: '🎯', type: 'formule', items: formules },
  ]

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const extrasTotal = Object.values(selectedExtras).flat().reduce((s, e) => s + e.price, 0)
  const discount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? (subtotal + extrasTotal) * appliedPromo.value / 100
      : Math.min(appliedPromo.value, subtotal + extrasTotal)
    : 0
  const total = Math.max(0, subtotal + extrasTotal - discount)

  useEffect(() => {
    if (step === 'confirmation' && countdown === null) {
      setCountdown(30)
    }
  }, [step])

  useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) { resetKiosk(); return }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const resetKiosk = () => {
    clearCart()
    setStep('accueil')
    setOrderType(null)
    setOrderNum(null)
    setAppliedPromo(null)
    setPromoInput('')
    setPromoError('')
    setSelectedExtras({})
    setCustomizing(null)
    setCountdown(null)
  }

  const applyPromo = () => {
    if (!promoInput.trim()) return
    const promo = usePromoCode(promoInput.trim())
    if (!promo) { setPromoError('Code invalide ou expiré'); return }
    if (subtotal < promo.minOrder) { setPromoError(`Minimum ${promo.minOrder}€`); return }
    setAppliedPromo(promo); setPromoError(''); setPromoInput('')
  }

  const toggleExtra = (cartId, extra) => {
    setSelectedExtras(prev => {
      const list = prev[cartId] || []
      const exists = list.find(e => e.id === extra.id)
      return { ...prev, [cartId]: exists ? list.filter(e => e.id !== extra.id) : [...list, extra] }
    })
  }

  const handleAddItem = (item, categoryType) => {
    let price = item.price || item.priceMd || item.priceSm
    const cartItem = {
      cartId: `${item.id}_${Date.now()}`,
      id: item.id, name: item.name, price,
      category: categoryType,
    }
    addToCart(cartItem)
  }

  const handleConfirm = () => {
    const num = ++kioskCounter
    setOrderNum(num)
    const itemsWithExtras = cart.map(i => ({ ...i, extras: selectedExtras[i.cartId] || [] }))
    addCustomerOrder({
      orderNumber: num,
      customerName: 'Kiosque',
      phone: '',
      type: orderType || 'surplace',
      items: itemsWithExtras,
      subtotal, extrasTotal, discount, total,
      promoCode: appliedPromo?.code || null,
      promoDiscount: discount,
      note: 'Commande kiosque',
    })
    clearCart()
    setStep('confirmation')
  }

  // ─── ACCUEIL ───────────────────────────────────────────────────
  if (step === 'accueil') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', userSelect: 'none' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🍔</div>
        <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#E11D48', margin: '0 0 12px', letterSpacing: '-0.02em' }}>BurgerStop</h1>
        <p style={{ fontSize: '22px', color: '#9CA3AF', margin: 0 }}>Commandez facilement en quelques touches</p>
      </div>

      <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px' }}>Choisissez votre mode de commande</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
        {[
          { type: 'surplace', icon: '🪑', label: 'Sur place', sub: 'Mangez ici' },
          { type: 'takeaway', icon: '🥡', label: 'À emporter', sub: 'Prêt à emporter' },
        ].map(opt => (
          <button key={opt.type} onClick={() => { setOrderType(opt.type); setStep('menu') }} style={{
            width: '200px', height: '180px', borderRadius: '24px', border: '2px solid #374151', cursor: 'pointer',
            backgroundColor: '#1F2937', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
            transition: 'all 0.2s', color: 'white',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#E11D48'; e.currentTarget.style.backgroundColor = '#2D1B22' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.backgroundColor = '#1F2937' }}>
            <span style={{ fontSize: '48px' }}>{opt.icon}</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{opt.label}</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>{opt.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: '14px', color: '#4B5563', textAlign: 'center' }}>
        Commande sécurisée · Paiement à la caisse
      </div>
    </div>
  )

  // ─── CONFIRMATION ──────────────────────────────────────────────
  if (step === 'confirmation') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ backgroundColor: '#064E3B', borderRadius: '50%', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
        <CheckCircle size={52} color="#10B981" />
      </div>
      <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>Commande confirmée !</h1>
      <p style={{ fontSize: '18px', color: '#9CA3AF', margin: '0 0 32px' }}>Votre commande a bien été enregistrée</p>

      <div style={{ backgroundColor: '#1F2937', borderRadius: '20px', padding: '32px 48px', border: '1px solid #374151', marginBottom: '32px' }}>
        <div style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '8px' }}>Numéro de commande</div>
        <div style={{ fontSize: '72px', fontWeight: 900, color: '#E11D48', lineHeight: 1 }}>#{orderNum}</div>
        <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '12px' }}>Présentez ce numéro à la caisse</div>
      </div>

      <div style={{ backgroundColor: '#1F2937', borderRadius: '16px', padding: '20px 28px', border: '1px solid #374151', marginBottom: '32px', minWidth: '240px' }}>
        <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>Mode</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>{orderType === 'surplace' ? '🪑 Sur place' : '🥡 À emporter'}</div>
      </div>

      <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px' }}>
        Retour à l'accueil dans <span style={{ color: '#E11D48', fontWeight: 700 }}>{countdown}s</span>
      </p>

      <button onClick={resetKiosk} style={{ padding: '14px 36px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, backgroundColor: '#E11D48', color: 'white' }}>
        Nouvelle commande
      </button>
    </div>
  )

  // ─── MENU + PANIER ─────────────────────────────────────────────
  const currentCat = activeCategory ? allCategories.find(c => c.id === activeCategory) : allCategories[0]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#111827', borderBottom: '1px solid #1F2937', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setStep('accueil')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
            <ArrowLeft size={18} /> Accueil
          </button>
          <span style={{ color: '#374151' }}>|</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#E11D48' }}>🍔 BurgerStop</span>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>· {orderType === 'surplace' ? 'Sur place' : 'À emporter'}</span>
        </div>
        <button onClick={() => setStep('panier')} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          backgroundColor: cartCount > 0 ? '#E11D48' : '#374151', color: 'white', fontWeight: 700, fontSize: '15px', position: 'relative'
        }}>
          <ShoppingCart size={18} />
          {cartCount > 0 ? `Panier · ${total.toFixed(2)}€` : 'Panier vide'}
          {cartCount > 0 && <span style={{ backgroundColor: 'white', color: '#E11D48', borderRadius: '999px', padding: '1px 7px', fontSize: '13px', fontWeight: 800, marginLeft: '4px' }}>{cartCount}</span>}
        </button>
      </div>

      {step === 'menu' && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar catégories */}
          <div style={{ width: '160px', backgroundColor: '#111827', borderRight: '1px solid #1F2937', overflowY: 'auto', flexShrink: 0 }}>
            {allCategories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                width: '100%', padding: '16px 12px', border: 'none', cursor: 'pointer', textAlign: 'center',
                backgroundColor: (activeCategory || allCategories[0].id) === cat.id ? '#1F2937' : 'transparent',
                borderLeft: (activeCategory || allCategories[0].id) === cat.id ? '3px solid #E11D48' : '3px solid transparent',
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>{cat.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: (activeCategory || allCategories[0].id) === cat.id ? 'white' : '#9CA3AF', lineHeight: 1.2 }}>{cat.name}</div>
              </button>
            ))}
          </div>

          {/* Articles */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
              {currentCat?.icon} {currentCat?.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {(currentCat?.items || []).filter(i => i.available !== false).map(item => {
                const price = item.price || item.priceMd || item.priceSm
                return (
                  <button key={item.id} onClick={() => handleAddItem(item, currentCat.type)} style={{
                    backgroundColor: '#1F2937', borderRadius: '16px', border: '1px solid #374151', cursor: 'pointer',
                    textAlign: 'left', overflow: 'hidden', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#E11D48'; e.currentTarget.style.transform = 'scale(1.02)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'scale(1)' }}>
                    {item.image && (
                      <div style={{ height: '130px', overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{item.name}</div>
                      {item.description && <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px', lineHeight: 1.3 }}>{item.description.slice(0, 60)}{item.description.length > 60 ? '...' : ''}</div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#E11D48' }}>{price?.toFixed(2)}€</span>
                        <span style={{ fontSize: '22px', backgroundColor: '#E11D48', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {step === 'panier' && (
        <div style={{ flex: 1, overflowY: 'auto', maxWidth: '700px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => setStep('menu')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
              <ArrowLeft size={16} /> Menu
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: 0 }}>Votre panier</h2>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
              <ShoppingCart size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <div style={{ fontSize: '18px', marginBottom: '16px' }}>Panier vide</div>
              <button onClick={() => setStep('menu')} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 700, backgroundColor: '#E11D48', color: 'white' }}>Voir le menu</button>
            </div>
          ) : (
            <>
              {/* Articles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ backgroundColor: '#1F2937', borderRadius: '14px', border: '1px solid #374151', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'white' }}>{item.name}</div>
                        <div style={{ fontSize: '13px', color: '#E11D48', fontWeight: 600, marginTop: '2px' }}>{item.price.toFixed(2)}€</div>
                        {(selectedExtras[item.cartId] || []).length > 0 && (
                          <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                            + {(selectedExtras[item.cartId] || []).map(e => e.name).join(', ')}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => updateCartQty(item.cartId, item.quantity - 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #374151', cursor: 'pointer', backgroundColor: '#111827', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '16px', minWidth: '20px', textAlign: 'center', color: 'white' }}>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.cartId, item.quantity + 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#E11D48', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={14} />
                        </button>
                        <button onClick={() => removeFromCart(item.cartId)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#374151', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {/* Extras */}
                    {extras.length > 0 && (
                      <div style={{ borderTop: '1px solid #374151', padding: '10px 16px' }}>
                        <button onClick={() => setCustomizing(customizing === item.cartId ? null : item.cartId)} style={{ fontSize: '12px', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>
                          {customizing === item.cartId ? '▲ Masquer extras' : '▼ Ajouter extras'}
                        </button>
                        {customizing === item.cartId && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                            {extras.map(extra => {
                              const selected = (selectedExtras[item.cartId] || []).find(e => e.id === extra.id)
                              return (
                                <button key={extra.id} onClick={() => toggleExtra(item.cartId, extra)} style={{
                                  padding: '4px 10px', borderRadius: '8px', border: `1px solid ${selected ? '#E11D48' : '#374151'}`,
                                  cursor: 'pointer', fontSize: '12px', fontWeight: selected ? 700 : 400,
                                  backgroundColor: selected ? '#4C0519' : 'transparent',
                                  color: selected ? '#E11D48' : '#9CA3AF',
                                }}>
                                  {extra.name} +{extra.price.toFixed(2)}€
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Code promo */}
              <div style={{ backgroundColor: '#1F2937', borderRadius: '14px', border: '1px solid #374151', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#9CA3AF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} color="#F59E0B" /> Code promo
                </div>
                {appliedPromo ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#10B981' }}>✓ {appliedPromo.code}</span>
                      <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}>-{discount.toFixed(2)}€</span>
                    </div>
                    <button onClick={() => setAppliedPromo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={16} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={promoInput} onChange={e => setPromoInput(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && applyPromo()} placeholder="Ex: BIENVENUE"
                      style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: `1px solid ${promoError ? '#EF4444' : '#374151'}`, backgroundColor: '#111827', color: 'white', fontSize: '14px' }} />
                    <button onClick={applyPromo} style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#F59E0B', color: 'black', fontWeight: 700, fontSize: '13px' }}>OK</button>
                  </div>
                )}
                {promoError && <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px' }}>{promoError}</div>}
              </div>

              {/* Totaux */}
              <div style={{ backgroundColor: '#1F2937', borderRadius: '14px', border: '1px solid #374151', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
                  <span>Sous-total</span><span>{subtotal.toFixed(2)}€</span>
                </div>
                {extrasTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
                    <span>Extras</span><span>+{extrasTotal.toFixed(2)}€</span>
                  </div>
                )}
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#10B981', marginBottom: '8px' }}>
                    <span>Réduction</span><span>-{discount.toFixed(2)}€</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #374151', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 800, color: 'white' }}>
                  <span>Total</span><span style={{ color: '#E11D48' }}>{total.toFixed(2)}€</span>
                </div>
              </div>

              <button onClick={handleConfirm} style={{ width: '100%', padding: '18px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 800, backgroundColor: '#E11D48', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <CheckCircle size={22} /> Valider ma commande · {total.toFixed(2)}€
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
