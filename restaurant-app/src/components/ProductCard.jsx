import { Plus, Minus, Star, Leaf, ShoppingCart } from 'lucide-react'
import useStore from '../store/useStore'

export default function ProductCard({ product }) {
  const { addToCart, cart, updateCartQuantity } = useStore()
  const cartItem = cart.find(item => item.product.id === product.id)
  const quantity = cartItem ? cartItem.quantity : 0

  const promoPrice = product.promo
    ? product.price * (1 - product.promo.value / 100)
    : null

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="relative p-4 pb-2">
        {product.promo && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg z-10">
            -{product.promo.value}%
          </span>
        )}
        {product.bio && (
          <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5 z-10">
            <Leaf size={10} /> BIO
          </span>
        )}
        <div className="text-6xl text-center py-4 group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4 flex-1 flex flex-col">
        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-1">{product.origin}</p>
        <h4 className="font-bold text-sm text-gray-900 mb-1 leading-tight">{product.name}</h4>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2 flex-1">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            {promoPrice ? (
              <>
                <span className="text-lg font-black text-red-600">{promoPrice.toFixed(2)} EUR</span>
                <span className="text-xs text-gray-400 line-through ml-1">{product.price.toFixed(2)} EUR</span>
              </>
            ) : (
              <span className="text-lg font-black text-gray-900">{product.price.toFixed(2)} EUR</span>
            )}
            <p className="text-[10px] text-gray-400">/ {product.priceUnit}</p>
          </div>

          {/* Add to cart */}
          {quantity > 0 ? (
            <div className="flex items-center gap-1 bg-primary rounded-xl overflow-hidden">
              <button
                onClick={() => updateCartQuantity(product.id, quantity - 1)}
                className="p-2 text-white hover:bg-primary-dark transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-white font-bold text-sm px-1 min-w-[20px] text-center">{quantity}</span>
              <button
                onClick={() => updateCartQuantity(product.id, quantity + 1)}
                className="p-2 text-white hover:bg-primary-dark transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors group/btn"
            >
              <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
