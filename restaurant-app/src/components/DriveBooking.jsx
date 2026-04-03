import { MapPin, Clock, Calendar, ChevronRight, CheckCircle2, ShoppingBag, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import useStore from '../store/useStore'

export default function DriveBooking() {
  const { driveSlots, selectedSlot, setSelectedSlot, cart, getCartTotal, getCartCount, user, setAuthModal, confirmOrder, setCurrentPage } = useStore()
  const [selectedDay, setSelectedDay] = useState(0)
  const total = getCartTotal()
  const count = getCartCount()

  const handleConfirm = () => {
    if (!user) {
      setAuthModal(true, 'login')
      return
    }
    if (cart.length === 0 || !selectedSlot) return
    confirmOrder()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <button onClick={() => setCurrentPage('home')} className="hover:text-primary">Accueil</button>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Réserver mon créneau Drive</span>
        </nav>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Réserver mon créneau Drive</h2>
        <p className="text-gray-500">Choisissez votre créneau de retrait et récupérez vos courses sans attendre.</p>
      </div>

      {cart.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-amber-800">Votre panier est vide</p>
            <p className="text-xs text-amber-700 mt-1">Ajoutez des produits à votre panier avant de réserver un créneau.</p>
            <button onClick={() => setCurrentPage('catalog')} className="mt-2 text-xs font-bold text-primary hover:underline">
              Faire mes courses
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Slot selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Store info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Drive Toulouse Centre</h3>
                <p className="text-xs text-gray-500">15 Avenue Jean Jaurès, 31000 Toulouse</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock size={12} /> Ouvert 8h - 20h</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> 7 jours / 7</span>
              <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle2 size={12} /> Retrait gratuit</span>
            </div>
          </div>

          {/* Day tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> Choisir un créneau
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {driveSlots.map((day, i) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(i)}
                  className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all shrink-0 min-w-[100px] ${
                    selectedDay === i
                      ? 'border-primary bg-blue-50 text-primary'
                      : 'border-gray-100 hover:border-gray-200 text-gray-600'
                  }`}
                >
                  <span className="text-xs font-semibold capitalize">{day.dayName}</span>
                  <span className="text-sm font-bold mt-0.5">{day.dayDate}</span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {day.slots.filter(s => s.available).length} dispo
                  </span>
                </button>
              ))}
            </div>

            {/* Time slots */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {driveSlots[selectedDay]?.slots.map(slot => (
                <button
                  key={slot.id}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                    !slot.available
                      ? 'bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed'
                      : selectedSlot?.id === slot.id
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : 'bg-white text-gray-700 border-gray-100 hover:border-primary/30 hover:bg-blue-50'
                  }`}
                >
                  <Clock size={14} className="inline mr-1" />
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-40">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" /> Résumé de commande
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{count} article{count !== 1 ? 's' : ''}</span>
                <span className="font-semibold">{total.toFixed(2)} EUR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Retrait Drive</span>
                <span className="font-semibold text-green-600">Gratuit</span>
              </div>
              {selectedSlot && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Créneau</span>
                  <span className="font-semibold text-primary">{selectedSlot.label}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-primary">{total.toFixed(2)} EUR</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={cart.length === 0 || !selectedSlot}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                cart.length > 0 && selectedSlot
                  ? 'bg-success text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 size={18} />
              {!user ? 'Se connecter pour valider' : 'Valider ma commande'}
            </button>

            {(!selectedSlot || cart.length === 0) && (
              <p className="text-xs text-gray-400 text-center mt-2">
                {cart.length === 0 ? 'Ajoutez des articles au panier' : 'Sélectionnez un créneau'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
