import { useState, useEffect } from 'react'
import { Gift, X, Copy, CheckCircle, Cake } from 'lucide-react'

const STORAGE_KEY = 'burgerstop_birthday'
const PROMO_CODE = 'BIRTHDAY20'

function getTodayMMDD() {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getStoredBirthday() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
}

export default function BirthdayOffer() {
  const [show, setShow] = useState(false)           // modal anniversaire
  const [showForm, setShowForm] = useState(false)   // formulaire inscription
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [saved, setSaved] = useState(!!getStoredBirthday())
  const [copied, setCopied] = useState(false)
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    const stored = getStoredBirthday()
    if (!stored) return
    const today = getTodayMMDD()
    const bdayMMDD = stored.dob.slice(5) // "YYYY-MM-DD" → "MM-DD"
    const lastShown = localStorage.getItem('burgerstop_bday_shown')
    const todayStr = new Date().toDateString()
    if (bdayMMDD === today && lastShown !== todayStr) {
      setTimeout(() => {
        setShow(true)
        localStorage.setItem('burgerstop_bday_shown', todayStr)
        // Confettis
        setConfetti(Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          color: ['#E11D48','#F59E0B','#10B981','#818CF8','#F97316'][Math.floor(Math.random() * 5)],
          delay: Math.random() * 1.5,
          size: 6 + Math.random() * 8,
        })))
      }, 800)
    }
  }, [])

  const handleSave = () => {
    if (!name.trim() || !dob) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: name.trim(), dob }))
    setSaved(true)
    setShowForm(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stored = getStoredBirthday()

  return (
    <>
      {/* Bouton flottant discret */}
      {!show && (
        <button
          onClick={() => setShowForm(true)}
          title="Offre anniversaire"
          style={{
            position: 'fixed', bottom: '88px', right: '24px', zIndex: 40,
            width: '46px', height: '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            backgroundColor: '#1F2937', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E11D48'; e.currentTarget.style.transform = 'scale(1.1)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1F2937'; e.currentTarget.style.transform = 'scale(1)' }}>
          <span style={{ fontSize: '20px' }}>🎂</span>
        </button>
      )}

      {/* Formulaire inscription */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#1F2937', borderRadius: '20px', padding: '28px', maxWidth: '380px', width: '100%', border: '1px solid #374151' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>🎂</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'white' }}>Offre Anniversaire</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>-20% le jour de votre anniversaire</div>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>

            {saved && stored ? (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Enregistré, {stored.name} !</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>Vous recevrez -20% le {new Date(stored.dob + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</div>
                <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setSaved(false) }} style={{ fontSize: '12px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>Modifier ma date</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Votre prénom</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Romu"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Date de naissance</label>
                  <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <button onClick={handleSave} disabled={!name.trim() || !dob}
                  style={{ padding: '12px', borderRadius: '10px', border: 'none', cursor: name && dob ? 'pointer' : 'not-allowed', fontSize: '14px', fontWeight: 700, backgroundColor: name && dob ? '#E11D48' : '#374151', color: 'white', marginTop: '4px' }}>
                  🎂 Activer mon offre anniversaire
                </button>
                <p style={{ fontSize: '11px', color: '#4B5563', textAlign: 'center', margin: 0 }}>Votre code -20% s'activera automatiquement le jour J</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal anniversaire du jour */}
      {show && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden' }}>
          {/* Confettis */}
          {confetti.map(c => (
            <div key={c.id} style={{
              position: 'absolute', left: `${c.x}%`, top: '-20px',
              width: `${c.size}px`, height: `${c.size}px`,
              backgroundColor: c.color, borderRadius: '2px',
              animation: `fall 3s ${c.delay}s ease-in infinite`,
              zIndex: 71,
            }} />
          ))}

          <div style={{
            backgroundColor: '#1F2937', borderRadius: '24px', padding: '40px', maxWidth: '420px', width: '100%',
            border: '2px solid #E11D48', textAlign: 'center', position: 'relative', zIndex: 72,
            boxShadow: '0 0 80px rgba(225,29,72,0.4)',
            animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <button onClick={() => setShow(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>

            <div style={{ fontSize: '64px', marginBottom: '12px', animation: 'bounce 1s infinite' }}>🎂</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#E11D48', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Joyeux Anniversaire !</div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>
              Bonne fête {stored?.name || ''} 🎉
            </h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 28px' }}>BurgerStop vous offre <strong style={{ color: 'white' }}>-20% sur toute votre commande</strong> aujourd'hui !</p>

            <div style={{ backgroundColor: '#111827', borderRadius: '14px', padding: '18px', marginBottom: '20px', border: '2px solid #E11D48' }}>
              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px' }}>VOTRE CODE DU JOUR</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#E11D48', letterSpacing: '0.15em' }}>{PROMO_CODE}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>Valable aujourd'hui uniquement</div>
            </div>

            <button onClick={copyCode} style={{
              width: '100%', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              fontSize: '15px', fontWeight: 700, color: 'white',
              backgroundColor: copied ? '#10B981' : '#E11D48',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s', marginBottom: '10px',
            }}>
              {copied ? <><CheckCircle size={18} /> Copié !</> : <><Copy size={18} /> Copier le code</>}
            </button>

            <button onClick={() => setShow(false)} style={{ width: '100%', padding: '11px', borderRadius: '12px', border: '1px solid #374151', cursor: 'pointer', fontSize: '13px', backgroundColor: 'transparent', color: '#9CA3AF' }}>
              Utiliser plus tard
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </>
  )
}
