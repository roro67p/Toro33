import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import useStore from '../store/useStore'

export default function AuthModal() {
  const { authMode, setAuthModal, login } = useStore()
  const [mode, setMode] = useState(authMode)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    if (mode === 'register' && !form.name) {
      setError('Veuillez indiquer votre nom.')
      return
    }
    login(form.email, mode === 'register' ? form.name : form.email.split('@')[0])
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAuthModal(false)} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="hero-gradient px-6 py-8 text-center text-white">
          <button
            onClick={() => setAuthModal(false)}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-black">F</span>
          </div>
          <h2 className="text-2xl font-black">
            {mode === 'login' ? 'Content de vous revoir !' : 'Créer un compte'}
          </h2>
          <p className="text-sm text-white/70 mt-1">
            {mode === 'login' ? 'Connectez-vous pour accéder à vos courses' : 'Inscrivez-vous et profitez de nos offres'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nom complet</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.fr"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-primary font-semibold hover:underline">
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors text-sm"
          >
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>

          <p className="text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>Pas encore de compte ? <button type="button" onClick={() => setMode('register')} className="font-semibold text-primary hover:underline">S'inscrire</button></>
            ) : (
              <>Déjà un compte ? <button type="button" onClick={() => setMode('login')} className="font-semibold text-primary hover:underline">Se connecter</button></>
            )}
          </p>

          {mode === 'register' && (
            <p className="text-[10px] text-gray-400 text-center">
              En vous inscrivant, vous acceptez nos CGU et notre politique de confidentialité.
              Profitez de 500 points de fidélité offerts à l'inscription !
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
