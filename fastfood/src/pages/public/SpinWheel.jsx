import { useState, useRef, useEffect } from 'react'
import useStore from '../../store/useStore'
import { Gift, RotateCcw, Copy, CheckCircle, Zap } from 'lucide-react'

const PRIZES = [
  { id: 'p1', label: '-10%',             code: 'WHEEL10',  type: 'percent', value: 10, color: '#E11D48', emoji: '🔥', desc: '10% de réduction sur ta commande' },
  { id: 'p2', label: 'Frites offertes',  code: 'FRITES0',  type: 'fixed',   value: 3.5, color: '#F59E0B', emoji: '🍟', desc: 'Une portion de frites maison offerte' },
  { id: 'p3', label: '-15%',             code: 'WHEEL15',  type: 'percent', value: 15, color: '#8B5CF6', emoji: '💜', desc: '15% de réduction sur ta commande' },
  { id: 'p4', label: 'Boisson offerte',  code: 'DRINK0',   type: 'fixed',   value: 3,  color: '#06B6D4', emoji: '🥤', desc: 'Une boisson au choix offerte' },
  { id: 'p5', label: 'Retentez !',       code: null,       type: 'none',    value: 0,  color: '#374151', emoji: '😅', desc: 'Pas de chance, retentez demain !' },
  { id: 'p6', label: '-5%',              code: 'WHEEL5',   type: 'percent', value: 5,  color: '#10B981', emoji: '💚', desc: '5% de réduction sur ta commande' },
  { id: 'p7', label: 'Nuggets offerts',  code: 'NUGGETS0', type: 'fixed',   value: 4.5,color: '#F97316', emoji: '🍗', desc: '6 nuggets offerts avec ta commande' },
  { id: 'p8', label: '-20%',             code: 'MEGA20',   type: 'percent', value: 20, color: '#EC4899', emoji: '🎉', desc: '20% de réduction — Jackpot !' },
]

const LAST_SPIN_KEY = 'burgerstop_last_spin'
const SEGMENT_ANGLE = 360 / PRIZES.length

function canSpin() {
  const last = localStorage.getItem(LAST_SPIN_KEY)
  if (!last) return true
  const lastDate = new Date(last)
  const now = new Date()
  return lastDate.toDateString() !== now.toDateString()
}

export default function SpinWheel() {
  const { addPromoCode, data } = useStore()
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [prize, setPrize] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [alreadySpun, setAlreadySpun] = useState(!canSpin())
  const wheelRef = useRef(null)
  const currentRotation = useRef(0)

  const spin = () => {
    if (spinning || alreadySpun) return

    // Choisir le lot (pondéré : Retentez plus rare que les autres)
    const weights = [15, 10, 8, 10, 5, 20, 10, 2]
    const total = weights.reduce((s, w) => s + w, 0)
    let rand = Math.random() * total
    let prizeIndex = 0
    for (let i = 0; i < weights.length; i++) {
      rand -= weights[i]
      if (rand <= 0) { prizeIndex = i; break }
    }

    // Calculer la rotation pour atterrir sur le bon segment
    const targetAngle = 360 - (prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2)
    const extraSpins = (5 + Math.floor(Math.random() * 5)) * 360
    const newRotation = currentRotation.current + extraSpins + targetAngle - (currentRotation.current % 360)

    setSpinning(true)
    currentRotation.current = newRotation
    setRotation(newRotation)

    setTimeout(() => {
      const won = PRIZES[prizeIndex]
      setPrize(won)
      setSpinning(false)
      setShowModal(true)
      localStorage.setItem(LAST_SPIN_KEY, new Date().toISOString())
      setAlreadySpun(true)

      // Ajouter le code promo au store s'il n'existe pas
      if (won.code) {
        const exists = (data.promoCodes || []).find(p => p.code === won.code)
        if (!exists) {
          addPromoCode({
            code: won.code,
            type: won.type,
            value: won.value,
            minOrder: 0,
            active: true,
            maxUses: 1000,
            description: won.desc,
          })
        }
      }
    }, 4500)
  }

  const copyCode = () => {
    if (!prize?.code) return
    navigator.clipboard.writeText(prize.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Dessiner la roue
  const size = 340
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4

  const segments = PRIZES.map((p, i) => {
    const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180)
    const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180)
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const midAngle = (startAngle + endAngle) / 2
    const textR = r * 0.68
    const tx = cx + textR * Math.cos(midAngle)
    const ty = cy + textR * Math.sin(midAngle)
    const textAngle = (midAngle * 180 / Math.PI)
    return { p, x1, y1, x2, y2, tx, ty, textAngle, midAngle }
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '48px 20px 32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', backgroundColor: '#FFF1F2', marginBottom: '16px' }}>
          <Gift size={14} color="#E11D48" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#E11D48' }}>1 tour gratuit par jour</span>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 900, color: 'white', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          🎰 Roue de la Fortune
        </h1>
        <p style={{ fontSize: '16px', color: '#9CA3AF', margin: 0 }}>Tentez votre chance et gagnez un cadeau !</p>
      </div>

      {/* Roue */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

        {/* Indicateur (triangle) */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
          {/* Triangle pointeur */}
          <div style={{
            position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, zIndex: 10,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '28px solid #E11D48',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }} />

          {/* SVG Roue */}
          <svg
            ref={wheelRef}
            width={size}
            height={size}
            style={{
              borderRadius: '50%',
              boxShadow: '0 0 60px rgba(225,29,72,0.3)',
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {segments.map(({ p, x1, y1, x2, y2, tx, ty, textAngle }, i) => (
              <g key={i}>
                <path
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                  fill={p.color}
                  stroke="#0F172A"
                  strokeWidth="2"
                />
                <text
                  x={tx} y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                  style={{ fontSize: '11px', fontWeight: 800, fill: 'white', userSelect: 'none' }}
                >
                  {p.emoji}
                </text>
                <text
                  x={tx} y={ty + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${tx}, ${ty + 14})`}
                  style={{ fontSize: '9px', fontWeight: 700, fill: 'white', userSelect: 'none' }}
                >
                  {p.label}
                </text>
              </g>
            ))}
            {/* Centre */}
            <circle cx={cx} cy={cy} r="28" fill="#0F172A" stroke="#E11D48" strokeWidth="3" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '18px', userSelect: 'none' }}>🍔</text>
          </svg>
        </div>

        {/* Bouton */}
        {alreadySpun && !spinning ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '14px 28px', borderRadius: '14px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#6B7280', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
              ⏰ Revenez demain pour rejouer !
            </div>
            <div style={{ fontSize: '12px', color: '#4B5563' }}>Un tour gratuit par jour par personne</div>
          </div>
        ) : (
          <button
            onClick={spin}
            disabled={spinning}
            style={{
              padding: '16px 48px', borderRadius: '16px', border: 'none', cursor: spinning ? 'not-allowed' : 'pointer',
              fontSize: '18px', fontWeight: 800, color: 'white',
              background: spinning ? '#374151' : 'linear-gradient(135deg, #E11D48, #9F1239)',
              boxShadow: spinning ? 'none' : '0 0 30px rgba(225,29,72,0.5)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
            {spinning ? (
              <><span style={{ display: 'inline-block', animation: 'spin 0.5s linear infinite' }}>🎰</span> En cours...</>
            ) : (
              <><Zap size={20} /> TOURNER LA ROUE</>
            )}
          </button>
        )}

        {/* Lots disponibles */}
        <div style={{ maxWidth: '500px', width: '100%', padding: '0 20px' }}>
          <div style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', marginBottom: '12px', fontWeight: 600 }}>LOTS POSSIBLES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {PRIZES.filter(p => p.code).map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                <span style={{ fontSize: '18px' }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{p.label}</div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal gain */}
      {showModal && prize && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#1F2937', borderRadius: '24px', padding: '40px', maxWidth: '400px', width: '100%', border: `2px solid ${prize.color}`, textAlign: 'center', boxShadow: `0 0 60px ${prize.color}44` }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{prize.emoji}</div>

            {prize.code ? (
              <>
                <div style={{ fontSize: '13px', fontWeight: 700, color: prize.color, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Félicitations ! Vous avez gagné</div>
                <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>{prize.label}</h2>
                <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px' }}>{prize.desc}</p>

                <div style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: `1px solid ${prize.color}` }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px' }}>VOTRE CODE PROMO</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: prize.color, letterSpacing: '0.15em' }}>{prize.code}</div>
                </div>

                <button onClick={copyCode} style={{
                  width: '100%', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontSize: '15px', fontWeight: 700,
                  backgroundColor: copied ? '#10B981' : prize.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  marginBottom: '12px', transition: 'all 0.2s',
                }}>
                  {copied ? <><CheckCircle size={18} /> Copié !</> : <><Copy size={18} /> Copier le code</>}
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '22px', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>Pas de chance !</div>
                <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px' }}>Revenez demain pour retenter votre chance !</p>
              </>
            )}

            <button onClick={() => setShowModal(false)} style={{ width: '100%', padding: '11px', borderRadius: '12px', border: '1px solid #374151', cursor: 'pointer', fontSize: '14px', backgroundColor: 'transparent', color: '#9CA3AF' }}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
