import { useState } from 'react'
import useStore from '../../store/useStore'
import { Lock, X, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin({ onClose }) {
  const { loginAdmin } = useStore()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const success = loginAdmin(password)
    setLoading(false)
    if (!success) {
      setError('Mot de passe incorrect. Réessayez.')
      setPassword('')
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'white' }}>
        {/* Header */}
        <div className="relative px-8 py-8 text-center"
          style={{ background: 'linear-gradient(135deg, #1C1917, #292524)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ color: '#78716C' }}
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(217,119,6,0.2)', border: '2px solid rgba(217,119,6,0.4)' }}>
            <Lock size={28} style={{ color: '#D97706' }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Espace Professionnel
          </h2>
          <p className="text-sm" style={{ color: '#78716C' }}>
            Accès réservé au gérant du restaurant
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  autoFocus
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    borderColor: error ? '#DC2626' : '#E5E7EB',
                    backgroundColor: '#FAFAFA',
                    color: '#1C1917'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: '#9CA3AF' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#DC2626' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#D97706' }}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Accéder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
