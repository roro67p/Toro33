import { X, Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight } from 'lucide-react'
import useStore from '../store/useStore'

export default function CartSidebar() {
  const { cart, setCartOpen, updateCartQuantity, removeFromCart, getCartTotal, getCartCount, clearCart, setCurrentPage, user, setAuthModal } = useStore()
  const total = getCartTotal()
  const count = getCartCount()
  const freeDeliveryThreshold = 50
  const remaining = Math.max(0, freeDeliveryThreshold - total)

  const handleCheckout = () => {
    if (!user) {
      setAuthModal(true, 'login')
      return
    }
    setCartOpen(false)
    setCurrentPage('drive')
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-primary" />
            <div>
              <h2 className="font-bold text-lg text-gray-900">Mon panier</h2>
              <p className="text-xs text-gray-500">{count} article{count !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Free delivery progress */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            {remaining > 0 ? (
              <>
                <p className="text-xs font-medium text-blue-700 mb-1.5">
                  <Truck size={14} className="inline mr-1" />
                  Plus que <span className="font-bold">{remaining.toFixed(2)} EUR</span> pour le retrait prioritaire gratuit
                </p>
                <div className="w-full bg-blue-200 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (total / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs font-bold text-green-700 flex items-center gap-1">
                <Truck size={14} /> Retrait prioritaire gratuit !
              </p>
            )}
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-6xl mb-4">🛒</p>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Votre panier est vide</h3>
              <p className="text-sm text-gray-500 mb-4">Ajoutez des produits pour commencer vos courses</p>
              <button
                onClick={() => { setCartOpen(false); setCurrentPage('catalog') }}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
              >
                Faire mes courses
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(({ product, quantity }) => {
                const promoPrice = product.promo
                  ? product.price * (1 - product.promo.value / 100)
                  : null
                const unitPrice = promoPrice || product.price
                return (
                  <div key={product.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 flex items-center justify-center text-3xl shrink-0 bg-white rounded-lg">
                      {product.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.priceUnit}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{(unitPrice * quantity).toFixed(2)} EUR</span>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Sous-total</span>
              <span className="font-bold text-gray-900">{total.toFixed(2)} EUR</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Retrait Drive</span>
              <span className="font-bold text-green-600">Gratuit</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-black text-primary">{total.toFixed(2)} EUR</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {user ? 'Choisir mon créneau Drive' : 'Se connecter pour commander'}
              <ArrowRight size={18} />
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
