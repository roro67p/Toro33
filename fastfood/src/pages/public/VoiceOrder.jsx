import { useState, useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import { Mic, MicOff, ShoppingCart, CheckCircle, X, Volume2, RefreshCw } from 'lucide-react'

const FR_NUMBERS = {
  'un': 1, 'une': 1, 'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5,
  'six': 6, 'sept': 7, 'huit': 8, 'neuf': 9, 'dix': 10,
}

function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

function parseOrder(transcript, allItems) {
  const text = normalize(transcript)
  const words = text.split(' ')
  const found = []

  for (const item of allItems) {
    const itemWords = normalize(item.name).split(' ').filter(w => w.length > 3)
    const matched = itemWords.filter(w => text.includes(w))
    if (matched.length === 0) continue

    // cherche quantité juste avant le nom de l'article
    const itemPos = text.indexOf(matched[0])
    const before = text.slice(0, itemPos).trim().split(' ')
    const lastWord = before[before.length - 1]
    const qty = FR_NUMBERS[lastWord] || parseInt(lastWord) || 1

    // évite doublons
    if (!found.find(f => f.item.id === item.id)) {
      found.push({ item, qty, matched })
    }
  }
  return found
}

export default function VoiceOrder() {
  const { data, addToCart, setActivePage } = useStore()
  const { menuCategories, drinkCategories, formules } = data

  const allItems = [
    ...menuCategories.flatMap(c => c.items.map(i => ({ ...i, category: c.name, price: i.price }))),
    ...drinkCategories.flatMap(c => c.items.map(i => ({ ...i, category: c.name, price: i.priceMd || i.priceSm }))),
    ...(formules || []).map(f => ({ ...f, category: 'Formule' })),
  ].filter(i => i.available !== false)

  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [results, setResults] = useState([])
  const [added, setAdded] = useState([])
  const [error, setError] = useState('')
  const [supported, setSupported] = useState(true)
  const [pulse, setPulse] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }

    const rec = new SR()
    rec.lang = 'fr-FR'
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 3

    rec.onresult = (e) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else interim += t
      }
      if (interim) setInterimText(interim)
      if (final) {
        setTranscript(final)
        setInterimText('')
        const found = parseOrder(final, allItems)
        setResults(found)
      }
    }

    rec.onstart = () => { setListening(true); setPulse(true); setError('') }
    rec.onend = () => { setListening(false); setPulse(false); setInterimText('') }
    rec.onerror = (e) => {
      setListening(false); setPulse(false)
      if (e.error === 'not-allowed') setError('Microphone refusé. Autorisez-le dans les paramètres du navigateur.')
      else if (e.error === 'no-speech') setError('Aucune voix détectée. Réessayez.')
      else setError('Erreur microphone : ' + e.error)
    }

    recognitionRef.current = rec
    return () => { try { rec.stop() } catch (e) {} }
  }, [])

  const startListening = () => {
    if (!recognitionRef.current || listening) return
    setTranscript('')
    setInterimText('')
    setResults([])
    setAdded([])
    setError('')
    try { recognitionRef.current.start() } catch (e) {}
  }

  const stopListening = () => {
    try { recognitionRef.current?.stop() } catch (e) {}
  }

  const handleAddAll = () => {
    results.forEach(({ item, qty }) => {
      for (let i = 0; i < qty; i++) {
        addToCart({
          cartId: `${item.id}_voice_${Date.now()}_${i}`,
          id: item.id, name: item.name,
          price: item.price, type: 'voice',
        })
      }
    })
    setAdded(results.map(r => r.item.id))
    setTimeout(() => setActivePage('order'), 1500)
  }

  const handleAddOne = (item, qty) => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        cartId: `${item.id}_voice_${Date.now()}_${i}`,
        id: item.id, name: item.name,
        price: item.price, type: 'voice',
      })
    }
    setAdded(prev => [...prev, item.id])
  }

  const reset = () => {
    setTranscript(''); setInterimText(''); setResults([]); setAdded([]); setError('')
  }

  // exemples de phrases
  const EXAMPLES = [
    "Je veux un Double Smash avec des frites",
    "Deux Chicken Crispy et un Coca",
    "Un menu Classic avec un milkshake vanille",
    "Trois nuggets et une eau gazeuse",
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '48px 20px 32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', backgroundColor: '#1E3A5F', marginBottom: '16px' }}>
          <Volume2 size={13} color="#60A5FA" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#60A5FA' }}>Web Speech API · Français</span>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 900, color: 'white', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          🎤 Commande Vocale
        </h1>
        <p style={{ fontSize: '16px', color: '#9CA3AF', margin: 0 }}>
          Parlez, le site comprend et ajoute au panier automatiquement
        </p>
      </div>

      {!supported ? (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ backgroundColor: '#4C0519', border: '1px solid #E11D48', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <MicOff size={40} color="#E11D48" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Navigateur non compatible</h3>
            <p style={{ color: '#FCA5A5', fontSize: '14px' }}>La commande vocale nécessite Chrome ou Edge. Safari iOS est aussi supporté.</p>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>

          {/* Bouton micro */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              {/* Anneaux de pulsation */}
              {pulse && (
                <>
                  <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '2px solid #E11D48', opacity: 0.6, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                  <div style={{ position: 'absolute', inset: '-40px', borderRadius: '50%', border: '2px solid #E11D48', opacity: 0.3, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite 0.3s' }} />
                </>
              )}
              <button
                onClick={listening ? stopListening : startListening}
                style={{
                  width: '110px', height: '110px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                  backgroundColor: listening ? '#E11D48' : '#1F2937',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: listening ? '0 0 50px rgba(225,29,72,0.6)' : '0 0 20px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s', position: 'relative', zIndex: 1,
                  border: `3px solid ${listening ? '#E11D48' : '#374151'}`,
                }}>
                {listening
                  ? <MicOff size={44} color="white" />
                  : <Mic size={44} color="#E11D48" />}
              </button>
            </div>
          </div>

          {/* Statut */}
          <div style={{ textAlign: 'center', marginBottom: '24px', minHeight: '28px' }}>
            {listening ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} style={{
                      width: '4px', backgroundColor: '#E11D48', borderRadius: '2px',
                      animation: `wave 0.8s ease-in-out infinite`,
                      animationDelay: `${i * 0.12}s`,
                      height: `${8 + Math.sin(i) * 8}px`,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#E11D48' }}>Je vous écoute...</span>
              </div>
            ) : transcript ? (
              <span style={{ fontSize: '14px', color: '#10B981', fontWeight: 600 }}>✓ Analyse terminée</span>
            ) : (
              <span style={{ fontSize: '14px', color: '#6B7280' }}>Appuyez sur le micro puis parlez</span>
            )}
          </div>

          {/* Texte reconnu */}
          {(transcript || interimText) && (
            <div style={{ backgroundColor: '#1F2937', borderRadius: '14px', border: '1px solid #374151', padding: '16px 20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>🎤 Ce que j'ai entendu</span>
                <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><RefreshCw size={13} /></button>
              </div>
              <p style={{ fontSize: '16px', color: 'white', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                "{transcript || interimText}"
              </p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div style={{ backgroundColor: '#4C0519', border: '1px solid #E11D48', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <X size={16} color="#E11D48" /> {error}
            </div>
          )}

          {/* Résultats */}
          {results.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600, marginBottom: '12px' }}>
                🛒 {results.length} article(s) détecté(s) :
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {results.map(({ item, qty }) => {
                  const isAdded = added.includes(item.id)
                  return (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      backgroundColor: isAdded ? '#064E3B' : '#1F2937',
                      border: `1px solid ${isAdded ? '#10B981' : '#374151'}`,
                      borderRadius: '12px', padding: '12px 16px',
                      transition: 'all 0.3s',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>
                          {qty > 1 && <span style={{ color: '#E11D48', marginRight: '6px' }}>{qty}x</span>}
                          {item.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.category} · {item.price?.toFixed(2)}€{qty > 1 ? ` × ${qty} = ${(item.price * qty).toFixed(2)}€` : ''}</div>
                      </div>
                      {isAdded ? (
                        <CheckCircle size={22} color="#10B981" />
                      ) : (
                        <button onClick={() => handleAddOne(item, qty)} style={{
                          padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                          backgroundColor: '#E11D48', color: 'white', fontSize: '12px', fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}>
                          + Ajouter
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {results.some(r => !added.includes(r.item.id)) && (
                <button onClick={handleAddAll} style={{
                  width: '100%', padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                  fontSize: '15px', fontWeight: 800, color: 'white',
                  background: 'linear-gradient(135deg, #E11D48, #9F1239)',
                  boxShadow: '0 0 20px rgba(225,29,72,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <ShoppingCart size={18} /> Tout ajouter au panier
                </button>
              )}
            </div>
          )}

          {/* Aucun résultat */}
          {transcript && results.length === 0 && (
            <div style={{ backgroundColor: '#1F2937', borderRadius: '14px', border: '1px solid #374151', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🤔</div>
              <div style={{ fontSize: '15px', color: 'white', fontWeight: 600, marginBottom: '4px' }}>Aucun article reconnu</div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>Essayez de nommer un article du menu plus clairement</div>
            </div>
          )}

          {/* Exemples */}
          {!transcript && !listening && (
            <div style={{ backgroundColor: '#111827', borderRadius: '14px', border: '1px solid #1F2937', padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                💡 Exemples de phrases
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {EXAMPLES.map((ex, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                    <Mic size={13} color="#E11D48" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#D1D5DB', fontStyle: 'italic' }}>"{ex}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
      `}</style>
    </div>
  )
}
