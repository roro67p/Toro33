import { useState, useEffect } from 'react'
import { Trophy, Star, Gift, Zap, Crown, Shield, Award } from 'lucide-react'

const STORAGE_KEY = 'chezromu_loyalty'

const LEVELS = [
  { name: 'Bronze',  min: 0,   max: 99,  color: '#92400E', bg: '#451A03', icon: '🥉', perks: ['5% sur votre 5e commande', 'Accès aux offres membres'] },
  { name: 'Argent',  min: 100, max: 299, color: '#9CA3AF', bg: '#1F2937', icon: '🥈', perks: ['8% de réduction permanente', 'Dessert offert 1x/mois', 'File prioritaire'] },
  { name: 'Or',      min: 300, max: 699, color: '#F59E0B', bg: '#422006', icon: '🥇', perks: ['12% de réduction permanente', 'Boisson offerte à chaque visite', 'Accès menu secret'] },
  { name: 'Platine', min: 700, max: Infinity, color: '#818CF8', bg: '#312E81', icon: '💎', perks: ['20% de réduction permanente', 'Table réservée à votre nom', 'Invitation soirées VIP', 'Le Romu Burger offert 1x/mois'] },
]

function getLevel(pts) {
  return LEVELS.findLast(l => pts >= l.min) || LEVELS[0]
}

function getNextLevel(pts) {
  return LEVELS.find(l => l.min > pts) || null
}

function getProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
}

function saveProfile(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

export default function Loyalty() {
  const [profile, setProfile] = useState(getProfile())
  const [form, setForm] = useState({ name: '', email: '' })
  const [showRegister, setShowRegister] = useState(!getProfile())
  const [addingPoints, setAddingPoints] = useState(false)

  const handleRegister = () => {
    if (!form.name.trim()) return
    const p = { name: form.name.trim(), email: form.email.trim(), points: 50, joinDate: new Date().toISOString(), history: [{ date: new Date().toISOString(), pts: 50, label: '🎁 Bonus bienvenue' }] }
    saveProfile(p)
    setProfile(p)
    setShowRegister(false)
  }

  const simulateOrder = () => {
    if (!profile) return
    const pts = Math.floor(Math.random() * 20) + 10
    const updated = { ...profile, points: profile.points + pts, history: [{ date: new Date().toISOString(), pts, label: '🍔 Commande simulée' }, ...profile.history].slice(0, 10) }
    saveProfile(updated)
    setProfile(updated)
    setAddingPoints(true)
    setTimeout(() => setAddingPoints(false), 1500)
  }

  const reset = () => { localStorage.removeItem(STORAGE_KEY); setProfile(null); setShowRegister(true) }

  const level = profile ? getLevel(profile.points) : LEVELS[0]
  const nextLevel = profile ? getNextLevel(profile.points) : LEVELS[1]
  const progress = nextLevel ? ((profile?.points - level.min) / (nextLevel.min - level.min)) * 100 : 100

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '48px 20px 32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', backgroundColor: '#422006', marginBottom: '16px' }}>
          <Trophy size={13} color="#F59E0B" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#F59E0B' }}>Programme Fidélité</span>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>🏆 Club Chez Romu</h1>
        <p style={{ fontSize: '15px', color: '#9CA3AF', margin: 0 }}>Commandez, gagnez des points, débloquez des récompenses</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

        {showRegister ? (
          /* Inscription */
          <div style={{ backgroundColor: '#1F2937', borderRadius: '20px', border: '1px solid #374151', padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Rejoignez le Club</h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '28px' }}>Inscription gratuite · 50 points offerts dès l'inscription</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Votre prénom *"
                style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '15px' }} />
              <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email (optionnel)"
                type="email"
                style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '15px' }} />
              <button onClick={handleRegister} disabled={!form.name.trim()}
                style={{ padding: '13px', borderRadius: '12px', border: 'none', cursor: form.name.trim() ? 'pointer' : 'not-allowed', fontSize: '15px', fontWeight: 800, backgroundColor: form.name.trim() ? '#F59E0B' : '#374151', color: form.name.trim() ? 'black' : '#6B7280' }}>
                🏆 Rejoindre le Club — 50 pts offerts
              </button>
            </div>
          </div>
        ) : profile && (
          <>
            {/* Carte fidélité */}
            <div style={{
              borderRadius: '20px', padding: '28px', marginBottom: '20px', position: 'relative', overflow: 'hidden',
              background: `linear-gradient(135deg, ${level.bg}, #0F172A)`,
              border: `2px solid ${level.color}`,
              boxShadow: `0 0 40px ${level.color}33`,
            }}>
              {/* Décorations */}
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: level.color + '22' }} />
              <div style={{ position: 'absolute', bottom: '-20px', left: '20%', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: level.color + '11' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative' }}>
                <div>
                  <div style={{ fontSize: '12px', color: level.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Chez Romu — Club Membres</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: 'white' }}>{profile.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '36px' }}>{level.icon}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: level.color }}>{level.name}</div>
                </div>
              </div>

              {/* Points */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Mes points</span>
                  <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
                    {nextLevel ? `${nextLevel.min - profile.points} pts → ${nextLevel.name}` : '🎉 Niveau maximum !'}
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#0F172A', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, progress)}%`, backgroundColor: level.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '44px', fontWeight: 900, color: level.color, lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {profile.points}
                    {addingPoints && <span style={{ fontSize: '18px', color: '#10B981', animation: 'fadeUp 1.5s forwards' }}>+pts ✓</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>points accumulés</div>
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Membre depuis {new Date(profile.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Avantages niveau actuel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#1F2937', borderRadius: '16px', border: `1px solid ${level.color}44`, padding: '18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: level.color, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Gift size={14} /> Mes avantages {level.name}
                </div>
                {level.perks.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: level.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: '#D1D5DB' }}>{p}</span>
                  </div>
                ))}
              </div>

              {nextLevel && (
                <div style={{ backgroundColor: '#1F2937', borderRadius: '16px', border: '1px solid #374151', padding: '18px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} /> Prochain niveau — {nextLevel.icon} {nextLevel.name}
                  </div>
                  {getLevel(nextLevel.min).perks.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', opacity: 0.5 }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6B7280', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>{p}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>
                    Encore {nextLevel.min - profile.points} pts
                  </div>
                </div>
              )}
            </div>

            {/* Tous les niveaux */}
            <div style={{ backgroundColor: '#1F2937', borderRadius: '16px', border: '1px solid #374151', padding: '18px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '14px' }}>TOUS LES NIVEAUX</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {LEVELS.map(l => {
                  const active = l.name === level.name
                  return (
                    <div key={l.name} style={{
                      flex: 1, minWidth: '120px', padding: '12px', borderRadius: '12px', textAlign: 'center',
                      backgroundColor: active ? l.bg : '#111827',
                      border: `1px solid ${active ? l.color : '#374151'}`,
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{l.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: active ? l.color : '#6B7280' }}>{l.name}</div>
                      <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '2px' }}>{l.min === 0 ? '0' : l.min}+ pts</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Historique */}
            {profile.history?.length > 0 && (
              <div style={{ backgroundColor: '#1F2937', borderRadius: '16px', border: '1px solid #374151', padding: '18px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '12px' }}>HISTORIQUE</div>
                {profile.history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < profile.history.length - 1 ? '1px solid #374151' : 'none' }}>
                    <span style={{ fontSize: '13px', color: '#D1D5DB' }}>{h.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>{new Date(h.date).toLocaleDateString('fr-FR')}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>+{h.pts} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={simulateOrder} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, backgroundColor: '#F59E0B', color: 'black' }}>
                🍔 Simuler une commande (+pts)
              </button>
              <button onClick={reset} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #374151', cursor: 'pointer', fontSize: '13px', backgroundColor: 'transparent', color: '#6B7280' }}>
                Réinitialiser
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes fadeUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-20px)}}`}</style>
    </div>
  )
}
