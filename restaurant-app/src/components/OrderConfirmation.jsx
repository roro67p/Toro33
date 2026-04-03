import { CheckCircle2, MapPin, Clock, ArrowRight, ShoppingBag } from 'lucide-react'
import useStore from '../store/useStore'

export default function OrderConfirmation() {
  const { setCurrentPage, resetOrder, user } = useStore()

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-green-600" />
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-2">Commande confirmée !</h2>
      <p className="text-gray-500 mb-8">
        Merci {user?.name || 'cher client'}, votre commande a bien été enregistrée.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 text-left space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <ShoppingBag size={20} className="text-primary" />
          <div>
            <p className="text-xs text-gray-500">N° de commande</p>
            <p className="font-bold text-gray-900">CMD-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-primary" />
          <div>
            <p className="text-xs text-gray-500">Point de retrait</p>
            <p className="font-semibold text-gray-900">Drive Toulouse Centre</p>
            <p className="text-xs text-gray-500">15 Avenue Jean Jaurès, 31000 Toulouse</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-primary" />
          <div>
            <p className="text-xs text-gray-500">Étapes suivantes</p>
            <p className="font-semibold text-gray-900">Préparation en cours</p>
            <p className="text-xs text-gray-500">Vous recevrez un email lorsque votre commande sera prête.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => { resetOrder(); setCurrentPage('home') }}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          Continuer mes courses <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
