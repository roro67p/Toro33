import { useState } from 'react'
import useStore from '../../store/useStore'
import { Lock, ArrowLeft } from 'lucide-react'

export default function AdminLogin({ onClose }) {
  const { loginAdmin } = useStore()
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (loginAdmin(pwd)) { setError('') }
    else { setError('Mot de passe incorrect') }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', margin: '16px' }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍔</div>
          <h1 className="text-2xl font-bold text-white">BurgerStop Pro</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Espace administration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#D1D5DB' }}>Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
              <input
                type="password" value={pwd} onChange={e => setPwd(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white outline-none"
                style={{ backgroundColor: '#1F2937', border: `1.5px solid ${error ? '#EF4444' : '#374151'}` }}
                autoFocus
              />
            </div>
            {error && <p className="text-sm mt-1" style={{ color: '#EF4444' }}>{error}</p>}
          </div>
          <button type="submit" className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#E11D48' }}>
            Accéder à l'espace pro
          </button>
        </form>
        <button onClick={onClose} className="w-full mt-4 flex items-center justify-center gap-2 text-sm hover:opacity-70 transition-opacity"
          style={{ color: '#9CA3AF' }}>
          <ArrowLeft size={14} /> Retour au site
        </button>
      </div>
    </div>
  )
}
