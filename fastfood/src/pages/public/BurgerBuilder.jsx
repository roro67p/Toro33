import { useState } from 'react'
import useStore from '../../store/useStore'
import { ShoppingCart, ChevronRight, ChevronLeft, CheckCircle, RotateCcw } from 'lucide-react'

const STEPS = [
  {
    id: 'pain',
    label: 'Le Pain',
    emoji: '🍞',
    required: true,
    options: [
      { id: 'pain_brioche',  name: 'Brioche',       emoji: '🟡', desc: 'Moelleux, légèrement sucré', price: 0,    img: '🍞' },
      { id: 'pain_sesame',   name: 'Sésame',        emoji: '⚪', desc: 'Classique avec graines',    price: 0,    img: '🥖' },
      { id: 'pain_noir',     name: 'Pain au charbon',emoji: '⚫', desc: 'Tendance, goût neutre',     price: 0.5,  img: '🖤' },
      { id: 'pain_complet',  name: 'Pain complet',   emoji: '🟤', desc: 'Rustique, riche en fibres', price: 0.5,  img: '🌾' },
    ]
  },
  {
    id: 'steak',
    label: 'La Viande',
    emoji: '🥩',
    required: true,
    options: [
      { id: 'steak_simple',  name: 'Simple 100g',   emoji: '🥩', desc: 'Steak haché maison',        price: 0,   },
      { id: 'steak_double',  name: 'Double 200g',   emoji: '🥩🥩', desc: 'Pour les gros appétits',  price: 2.5, },
      { id: 'steak_smash',   name: 'Smash',         emoji: '💪', desc: 'Écrasé, caramélisé max',    price: 1,   },
      { id: 'steak_poulet',  name: 'Poulet croustillant', emoji: '🍗', desc: 'Filet pané doré',     price: 0,   },
      { id: 'steak_veggie',  name: 'Galette veggie', emoji: '🌿', desc: 'Base végétale',             price: 0,   },
    ]
  },
  {
    id: 'fromage',
    label: 'Le Fromage',
    emoji: '🧀',
    required: false,
    multi: true,
    options: [
      { id: 'from_cheddar',  name: 'Cheddar',       emoji: '🧀', desc: 'Classique fondant',         price: 0.8, },
      { id: 'from_emmental', name: 'Emmental',       emoji: '🧀', desc: 'Doux et crémeux',           price: 0.8, },
      { id: 'from_bleu',     name: 'Bleu',           emoji: '🔵', desc: 'Pour les audacieux',        price: 1.0, },
      { id: 'from_raclette', name: 'Raclette',       emoji: '🫕', desc: 'Fondant à souhait',         price: 1.0, },
      { id: 'from_sans',     name: 'Sans fromage',   emoji: '✕',  desc: 'Je passe le fromage',       price: 0,   },
    ]
  },
  {
    id: 'sauce',
    label: 'La Sauce',
    emoji: '🫙',
    required: false,
    multi: true,
    options: [
      { id: 'sauce_maison',  name: 'Sauce maison',  emoji: '⭐', desc: 'La signature BurgerStop',   price: 0,   },
      { id: 'sauce_bbq',     name: 'BBQ',           emoji: '🟤', desc: 'Fumé et sucré',             price: 0,   },
      { id: 'sauce_ketchup', name: 'Ketchup',       emoji: '🔴', desc: 'Le classique',              price: 0,   },
      { id: 'sauce_mayo',    name: 'Mayonnaise',    emoji: '🟡', desc: 'Crémeux',                   price: 0,   },
      { id: 'sauce_piquante',name: 'Sauce piquante',emoji: '🌶️', desc: 'Attention ça pique !',     price: 0,   },
      { id: 'sauce_fromagere',name: 'Sauce fromagère',emoji: '🧀', desc: 'Cheddar fondu liquide',  price: 0.5, },
    ]
  },
  {
    id: 'legumes',
    label: 'Les Légumes',
    emoji: '🥗',
    required: false,
    multi: true,
    options: [
      { id: 'leg_salade',    name: 'Salade',        emoji: '🥬', desc: 'Fraîche et croquante',      price: 0,   },
      { id: 'leg_tomate',    name: 'Tomate',        emoji: '🍅', desc: 'Fraîche',                   price: 0,   },
      { id: 'leg_oignon',    name: 'Oignon',        emoji: '🧅', desc: 'Cru',                       price: 0,   },
      { id: 'leg_cornichon', name: 'Cornichon',     emoji: '🥒', desc: 'Pickles croquants',         price: 0,   },
      { id: 'leg_avocat',    name: 'Avocat',        emoji: '🥑', desc: 'Frais et crémeux',          price: 1.2, },
      { id: 'leg_jalapeno',  name: 'Jalapeños',     emoji: '🌶', desc: 'Pour les braves',           price: 0.5, },
      { id: 'leg_oigcaramel',name: 'Oignons caramélisés',emoji:'🍯',desc: 'Fondants et sucrés',    price: 0.8, },
    ]
  },
  {
    id: 'extras',
    label: 'Les Extras',
    emoji: '✨',
    required: false,
    multi: true,
    options: [
      { id: 'ext_bacon',     name: 'Bacon',         emoji: '🥓', desc: 'Croustillant',              price: 1.5, },
      { id: 'ext_oeuf',      name: 'Oeuf au plat',  emoji: '🍳', desc: 'Fondant',                   price: 1.0, },
      { id: 'ext_ananas',    name: 'Ananas',        emoji: '🍍', desc: 'Sweet & salty',             price: 0.5, },
      { id: 'ext_champignon',name: 'Champignons',   emoji: '🍄', desc: 'Sautés à l\'ail',           price: 0.8, },
    ]
  },
]

const BASE_PRICE = 7.90

// Visuel empilé du burger
function BurgerStack({ selections }) {
  const layers = []

  // Pain haut
  layers.push({ emoji: '🍞', label: 'Pain du dessus', color: '#92400E' })

  // Extras
  if (selections.extras?.length > 0)
    selections.extras.forEach(e => { if (e.id !== 'aucun') layers.push({ emoji: e.emoji, label: e.name, color: '#374151' }) })

  // Légumes
  if (selections.legumes?.length > 0)
    selections.legumes.forEach(l => layers.push({ emoji: l.emoji, label: l.name, color: '#064E3B' }))

  // Sauce
  if (selections.sauce?.length > 0)
    selections.sauce.forEach(s => layers.push({ emoji: s.emoji, label: s.name, color: '#1E3A5F' }))

  // Fromage
  if (selections.fromage?.length > 0)
    selections.fromage.filter(f => f.id !== 'from_sans').forEach(f => layers.push({ emoji: f.emoji, label: f.name, color: '#78350F' }))

  // Steak
  if (selections.steak)
    layers.push({ emoji: selections.steak.emoji, label: selections.steak.name, color: '#4C0519' })

  // Pain bas
  layers.push({ emoji: '🍞', label: 'Pain du bas', color: '#92400E' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '20px 0' }}>
      {layers.map((layer, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 20px', borderRadius: '8px',
          backgroundColor: layer.color + 'aa',
          border: `1px solid ${layer.color}`,
          width: `${Math.min(95, 55 + (layers.length - Math.abs(i - layers.length / 2)) * 5)}%`,
          transition: 'all 0.3s',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '18px' }}>{layer.emoji}</span>
          <span style={{ fontSize: '12px', color: 'white', fontWeight: 600 }}>{layer.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function BurgerBuilder() {
  const { addToCart, setActivePage } = useStore()
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({})
  const [added, setAdded] = useState(false)

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1

  const getSelected = (stepId) => selections[stepId] || (STEPS.find(s => s.id === stepId)?.multi ? [] : null)

  const toggleOption = (option) => {
    const stepId = currentStep.id
    if (currentStep.multi) {
      const current = selections[stepId] || []
      const exists = current.find(o => o.id === option.id)
      if (option.id === 'from_sans') {
        setSelections(prev => ({ ...prev, [stepId]: exists ? [] : [option] }))
        return
      }
      setSelections(prev => ({
        ...prev,
        [stepId]: exists ? current.filter(o => o.id !== option.id) : [...current.filter(o => o.id !== 'from_sans'), option]
      }))
    } else {
      setSelections(prev => ({ ...prev, [stepId]: prev[stepId]?.id === option.id ? null : option }))
    }
  }

  const isSelected = (option) => {
    const sel = getSelected(currentStep.id)
    if (currentStep.multi) return Array.isArray(sel) && sel.some(o => o.id === option.id)
    return sel?.id === option.id
  }

  const canNext = !currentStep.required || (
    currentStep.multi ? (selections[currentStep.id] || []).length > 0 : !!selections[currentStep.id]
  )

  // Calcul du prix total
  const total = STEPS.reduce((sum, s) => {
    const sel = selections[s.id]
    if (!sel) return sum
    if (Array.isArray(sel)) return sum + sel.reduce((ss, o) => ss + o.price, 0)
    return sum + sel.price
  }, BASE_PRICE)

  const handleAddToCart = () => {
    const pain = selections.pain?.name || 'Brioche'
    const steak = selections.steak?.name || 'Simple'
    const name = `Burger ${steak} / ${pain}`
    const desc = Object.entries(selections)
      .map(([k, v]) => Array.isArray(v) ? v.map(o => o.name).join(', ') : v?.name)
      .filter(Boolean).join(' · ')

    addToCart({
      cartId: `builder_${Date.now()}`,
      id: `burger_custom_${Date.now()}`,
      name,
      price: total,
      description: desc,
      type: 'custom',
    })
    setAdded(true)
    setTimeout(() => { setActivePage('order') }, 1200)
  }

  const reset = () => { setSelections({}); setStep(0); setAdded(false) }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '40px 20px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          🍔 Crée ton Burger
        </h1>
        <p style={{ fontSize: '15px', color: '#9CA3AF', margin: 0 }}>Choisis chaque ingrédient, prix en temps réel</p>
      </div>

      {/* Barre de progression */}
      <div style={{ maxWidth: '700px', margin: '0 auto 24px', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => i < step && setStep(i)} style={{
              flex: 1, height: '6px', borderRadius: '3px', border: 'none', cursor: i < step ? 'pointer' : 'default',
              backgroundColor: i <= step ? '#E11D48' : '#1F2937',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#6B7280' }}>
          <span>{currentStep.emoji} Étape {step + 1}/{STEPS.length} — {currentStep.label}</span>
          <span style={{ fontWeight: 700, color: '#E11D48', fontSize: '14px' }}>{total.toFixed(2)}€</span>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

        {/* Panneau de sélection */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ backgroundColor: '#1F2937', borderRadius: '16px', border: '1px solid #374151', padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px' }}>{currentStep.emoji}</span>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: 0 }}>{currentStep.label}</h2>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                  {currentStep.required ? 'Obligatoire' : 'Optionnel'} · {currentStep.multi ? 'Choix multiple' : 'Un seul choix'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentStep.options.map(option => {
                const sel = isSelected(option)
                return (
                  <button key={option.id} onClick={() => toggleOption(option)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                    borderRadius: '12px', border: `2px solid ${sel ? '#E11D48' : '#374151'}`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    backgroundColor: sel ? '#4C0519' : '#111827',
                  }}>
                    <span style={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>{option.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: sel ? '#FCA5A5' : 'white' }}>{option.name}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>{option.desc}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {option.price > 0 && (
                        <span style={{ fontSize: '13px', fontWeight: 700, color: sel ? '#E11D48' : '#9CA3AF' }}>+{option.price.toFixed(2)}€</span>
                      )}
                      {option.price === 0 && (
                        <span style={{ fontSize: '11px', color: '#10B981' }}>Inclus</span>
                      )}
                    </div>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: currentStep.multi ? '4px' : '50%',
                      border: `2px solid ${sel ? '#E11D48' : '#4B5563'}`,
                      backgroundColor: sel ? '#E11D48' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {sel && <span style={{ fontSize: '11px', color: 'white', fontWeight: 900 }}>✓</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #374151', cursor: 'pointer', fontSize: '14px', backgroundColor: 'transparent', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ChevronLeft size={16} /> Retour
              </button>
            )}
            {!isLast ? (
              <button onClick={() => canNext && setStep(s => s + 1)} style={{
                flex: 2, padding: '12px', borderRadius: '12px', border: 'none', cursor: canNext ? 'pointer' : 'not-allowed',
                fontSize: '14px', fontWeight: 700, color: 'white',
                backgroundColor: canNext ? '#E11D48' : '#374151',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                transition: 'all 0.2s',
              }}>
                Suivant <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleAddToCart} style={{
                flex: 2, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontSize: '15px', fontWeight: 800, color: 'white',
                backgroundColor: added ? '#10B981' : '#E11D48',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
              }}>
                {added ? <><CheckCircle size={18} /> Ajouté !</> : <><ShoppingCart size={18} /> Ajouter · {total.toFixed(2)}€</>}
              </button>
            )}
          </div>

          {step === STEPS.length - 1 && (
            <button onClick={reset} style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '10px', border: '1px solid #374151', cursor: 'pointer', fontSize: '13px', backgroundColor: 'transparent', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <RotateCcw size={13} /> Recommencer
            </button>
          )}
        </div>

        {/* Visuel burger empilé */}
        <div style={{ width: '240px', minWidth: '200px' }}>
          <div style={{ backgroundColor: '#1F2937', borderRadius: '16px', border: '1px solid #374151', padding: '16px', position: 'sticky', top: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ton burger</div>
            </div>
            <BurgerStack selections={selections} />
            <div style={{ borderTop: '1px solid #374151', paddingTop: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Prix total</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#E11D48' }}>{total.toFixed(2)}€</div>
              <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '2px' }}>Base {BASE_PRICE.toFixed(2)}€ + ingrédients</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
