import { useState, useEffect, useRef, useCallback } from 'react'
import { Trophy, Play, RotateCcw, Copy, CheckCircle } from 'lucide-react'

const ITEMS = [
  { emoji: '🍔', pts: 10, label: 'Burger' },
  { emoji: '🍟', pts: 5,  label: 'Frites' },
  { emoji: '🥤', pts: 5,  label: 'Soda' },
  { emoji: '🍗', pts: 7,  label: 'Nuggets' },
  { emoji: '🧀', pts: 8,  label: 'Cheese' },
  { emoji: '💣', pts: -15, label: 'BOMBE' },
  { emoji: '⭐', pts: 20, label: 'JACKPOT' },
]

const PRIZES = [
  { min: 0,   code: null,        label: 'Pas de chance...',   color: '#6B7280' },
  { min: 50,  code: 'CATCH5',    label: '-5% gagné !',         color: '#10B981' },
  { min: 100, code: 'CATCH10',   label: '-10% gagné !',        color: '#F59E0B' },
  { min: 180, code: 'CATCH15',   label: '-15% gagné !',        color: '#818CF8' },
  { min: 250, code: 'CATCHPRO',  label: '🏆 -20% Pro !',       color: '#E11D48' },
]

function getPrize(score) {
  return [...PRIZES].reverse().find(p => score >= p.min) || PRIZES[0]
}

export default function BurgerCatch() {
  const [phase, setPhase] = useState('intro')   // intro | playing | result
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [items, setItems] = useState([])
  const [particles, setParticles] = useState([])
  const [copied, setCopied] = useState(false)
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('burgercatch_hs') || '0'))
  const intervalRef = useRef(null)
  const timerRef = useRef(null)
  const itemId = useRef(0)
  const particleId = useRef(0)

  const spawnItem = useCallback(() => {
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)]
    const isBomb = item.label === 'BOMBE'
    const isJackpot = item.label === 'JACKPOT'
    const id = ++itemId.current
    const x = 5 + Math.random() * 85
    const speed = isBomb ? 2.5 + Math.random() * 1.5 : 3 + Math.random() * 2
    setItems(prev => [...prev, { id, ...item, x, speed, y: -8 }])
  }, [])

  const catchItem = useCallback((id, pts, x, y) => {
    setScore(s => s + pts)
    setItems(prev => prev.filter(i => i.id !== id))
    const pid = ++particleId.current
    setParticles(prev => [...prev, { id: pid, x, y, pts, color: pts > 0 ? '#10B981' : '#E11D48' }])
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== pid)), 900)
  }, [])

  // Game loop
  useEffect(() => {
    if (phase !== 'playing') return
    intervalRef.current = setInterval(() => {
      setItems(prev => {
        const next = prev.map(i => ({ ...i, y: i.y + i.speed }))
        const fallen = next.filter(i => i.y > 105)
        fallen.forEach(i => { if (i.pts > 0) setScore(s => Math.max(0, s - 3)) })
        return next.filter(i => i.y <= 105)
      })
      if (Math.random() < 0.35) spawnItem()
    }, 80)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          clearInterval(timerRef.current)
          setPhase('result')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { clearInterval(intervalRef.current); clearInterval(timerRef.current) }
  }, [phase, spawnItem])

  const startGame = () => {
    setScore(0); setTimeLeft(30); setItems([]); setParticles([]); setPhase('playing')
  }

  const prize = getPrize(score)

  useEffect(() => {
    if (phase === 'result' && score > highScore) {
      setHighScore(score)
      localStorage.setItem('burgercatch_hs', String(score))
    }
  }, [phase])

  const copy = () => {
    if (!prize.code) return
    navigator.clipboard.writeText(prize.code).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const timerColor = timeLeft > 10 ? '#10B981' : timeLeft > 5 ? '#F59E0B' : '#E11D48'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', paddingBottom: '40px', userSelect: 'none' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '36px 20px 20px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', margin: '0 0 6px' }}>🎮 Burger Catch</h1>
        <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Attrape les burgers · Évite les bombes · Gagne un code promo</p>
        {highScore > 0 && <p style={{ fontSize: '13px', color: '#F59E0B', margin: '6px 0 0', fontWeight: 700 }}>🏆 Record : {highScore} pts</p>}
      </div>

      {phase === 'intro' && (
        <div style={{ maxWidth: '440px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#1F2937', borderRadius: '20px', border: '1px solid #374151', padding: '32px', marginBottom: '20px' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🍔</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Comment jouer</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', textAlign: 'left' }}>
              {[
                { e: '🍔🍟🥤', t: 'Attrape les aliments pour marquer des points' },
                { e: '⭐',     t: 'L\'étoile rapporte 20 pts — jackpot !' },
                { e: '💣',     t: 'Évite les bombes — elles font perdre 15 pts' },
                { e: '⏰',     t: '30 secondes chrono — fais le meilleur score' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', backgroundColor: '#111827' }}>
                  <span style={{ fontSize: '22px', minWidth: '36px', textAlign: 'center' }}>{r.e}</span>
                  <span style={{ fontSize: '13px', color: '#D1D5DB' }}>{r.t}</span>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>RÉCOMPENSES</div>
              {PRIZES.filter(p => p.code).map(p => (
                <div key={p.code} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0' }}>
                  <span style={{ color: p.color, fontWeight: 700 }}>{p.label}</span>
                  <span style={{ color: '#6B7280' }}>{p.min}+ pts</span>
                </div>
              ))}
            </div>
            <button onClick={startGame} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 800, backgroundColor: '#E11D48', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Play size={18} /> Jouer !
            </button>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
          {/* HUD */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '10px 16px', backgroundColor: '#1F2937', borderRadius: '12px', border: '1px solid #374151' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#E11D48' }}>{score}</div>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>POINTS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: timerColor }}>{timeLeft}s</div>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>TEMPS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: getPrize(score).color }}>{getPrize(score).label}</div>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>EN JEU</div>
            </div>
          </div>

          {/* Zone de jeu */}
          <div style={{ position: 'relative', width: '100%', height: '480px', backgroundColor: '#111827', borderRadius: '16px', border: '2px solid #374151', overflow: 'hidden' }}>
            {/* Items */}
            {items.map(item => (
              <button key={item.id}
                onClick={() => catchItem(item.id, item.pts, item.x, item.y)}
                style={{
                  position: 'absolute', left: `${item.x}%`, top: `${item.y}%`,
                  fontSize: item.label === 'JACKPOT' ? '40px' : '32px',
                  transform: 'translate(-50%, -50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  filter: item.label === 'BOMBE' ? 'drop-shadow(0 0 8px #EF4444)' : item.label === 'JACKPOT' ? 'drop-shadow(0 0 12px #F59E0B)' : 'none',
                  animation: 'wobble 0.5s ease infinite alternate',
                  zIndex: 2,
                }}>
                {item.emoji}
              </button>
            ))}

            {/* Particules de score */}
            {particles.map(p => (
              <div key={p.id} style={{
                position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
                fontSize: '16px', fontWeight: 900, color: p.color,
                animation: 'floatUp 0.9s forwards',
                pointerEvents: 'none', zIndex: 3,
              }}>
                {p.pts > 0 ? `+${p.pts}` : p.pts}
              </div>
            ))}

            {/* Sol */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', backgroundColor: '#374151' }} />
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div style={{ maxWidth: '420px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#1F2937', borderRadius: '20px', border: `2px solid ${prize.color}`, padding: '36px', boxShadow: `0 0 40px ${prize.color}33` }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>{score >= 250 ? '🏆' : score >= 100 ? '🎉' : '😅'}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: prize.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{prize.label}</div>
            <div style={{ fontSize: '52px', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '4px' }}>{score}</div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>points · {score > highScore ? '🏆 Nouveau record !' : `Record: ${highScore}`}</div>

            {prize.code ? (
              <>
                <div style={{ backgroundColor: '#111827', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: `1px solid ${prize.color}` }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '6px' }}>TON CODE PROMO</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: prize.color, letterSpacing: '0.12em' }}>{prize.code}</div>
                </div>
                <button onClick={copy} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, backgroundColor: copied ? '#10B981' : prize.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
                  {copied ? <><CheckCircle size={16} /> Copié !</> : <><Copy size={16} /> Copier le code</>}
                </button>
              </>
            ) : (
              <div style={{ backgroundColor: '#111827', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Score minimum 50 pts pour gagner un code</div>
                <div style={{ fontSize: '12px', color: '#F59E0B', marginTop: '6px', fontWeight: 600 }}>Il te manquait {50 - score} pts !</div>
              </div>
            )}

            <button onClick={startGame} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, backgroundColor: '#E11D48', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RotateCcw size={16} /> Rejouer
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wobble { from{transform:translate(-50%,-50%) rotate(-5deg)} to{transform:translate(-50%,-50%) rotate(5deg)} }
        @keyframes floatUp { 0%{opacity:1;transform:translate(-50%,0)} 100%{opacity:0;transform:translate(-50%,-40px)} }
      `}</style>
    </div>
  )
}
