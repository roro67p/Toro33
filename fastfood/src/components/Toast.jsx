import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, X, AlertTriangle, Info, ShoppingCart } from 'lucide-react'

let toastId = 0
let globalAddToast = null

export function useToast() {
  return {
    success: (msg) => globalAddToast?.({ type: 'success', msg }),
    error:   (msg) => globalAddToast?.({ type: 'error',   msg }),
    info:    (msg) => globalAddToast?.({ type: 'info',    msg }),
    cart:    (msg) => globalAddToast?.({ type: 'cart',    msg }),
  }
}

const CONFIG = {
  success: { bg: '#064E3B', border: '#10B981', icon: CheckCircle,    color: '#10B981' },
  error:   { bg: '#4C0519', border: '#E11D48', icon: AlertTriangle,   color: '#E11D48' },
  info:    { bg: '#1E3A5F', border: '#60A5FA', icon: Info,            color: '#60A5FA' },
  cart:    { bg: '#312E81', border: '#818CF8', icon: ShoppingCart,    color: '#818CF8' },
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type, msg }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, type, msg, visible: true }])
    setTimeout(() => setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t)), 2800)
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3300)
  }, [])

  useEffect(() => { globalAddToast = addToast; return () => { globalAddToast = null } }, [addToast])

  return (
    <div style={{ position: 'fixed', top: '72px', right: '16px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
      {toasts.map(({ id, type, msg, visible }) => {
        const cfg = CONFIG[type] || CONFIG.info
        const Icon = cfg.icon
        return (
          <div key={id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', borderRadius: '12px', maxWidth: '320px',
            backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
            animation: visible ? 'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' : 'toastOut 0.3s ease forwards',
            pointerEvents: 'auto',
          }}>
            <Icon size={16} color={cfg.color} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'white', flex: 1 }}>{msg}</span>
          </div>
        )
      })}
      <style>{`
        @keyframes toastIn  { from{opacity:0;transform:translateX(60px) scale(0.9)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes toastOut { from{opacity:1;transform:translateX(0)}               to{opacity:0;transform:translateX(60px)} }
      `}</style>
    </div>
  )
}
