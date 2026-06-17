import useStore from '../store/useStore'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function Cart() {
  const { cart, updateCartQty, removeFromCart, setActivePage } = useStore()
  const [open, setOpen] = useState(false)
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = cart.reduce((s, i) => s + i.quantity, 0)

  if (cart.length === 0) return null

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed z-30 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-white shadow-lg transition-all hover:scale-105"
        style={{ bottom: '24px', left: '24px', backgroundColor: '#1F2937', border: '2px solid #374151', display: open ? 'none' : 'flex' }}>
        <ShoppingCart size={18} style={{ color: '#E11D48' }} />
        <span style={{ color: '#E11D48' }}>{count}</span>
        <span className="text-sm text-white">{total.toFixed(2)}€</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div onClick={() => setOpen(false)} className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} />
          <div className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151', maxHeight: '80vh' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
              <h2 className="font-black text-white flex items-center gap-2"><ShoppingCart size={18} style={{ color: '#E11D48' }} /> Mon panier</h2>
              <button onClick={() => setOpen(false)} style={{ color: '#6B7280' }}><X size={20} /></button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '50vh' }}>
              {cart.map(item => (
                <div key={item.cartId} className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #374151' }}>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{item.name}</div>
                    <div className="text-sm font-bold" style={{ color: '#E11D48' }}>{(item.price * item.quantity).toFixed(2)}€</div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3">
                    <button onClick={() => updateCartQty(item.cartId, item.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#374151', color: 'white' }}><Minus size={12} /></button>
                    <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.cartId, item.quantity + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#374151', color: 'white' }}><Plus size={12} /></button>
                    <button onClick={() => removeFromCart(item.cartId)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4">
              <div className="flex justify-between font-black text-lg mb-4">
                <span className="text-white">Total</span>
                <span style={{ color: '#E11D48' }}>{total.toFixed(2)}€</span>
              </div>
              <button onClick={() => { setActivePage('order'); setOpen(false) }} className="w-full py-3 rounded-xl font-black text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#E11D48' }}>
                Commander maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
