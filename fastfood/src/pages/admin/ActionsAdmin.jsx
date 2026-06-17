import { useState } from 'react'
import useStore from '../../store/useStore'
import { Power, Zap, MessageSquare, Clock, Star, Coffee, AlertTriangle, CheckCircle, Flame, Gift } from 'lucide-react'

export default function ActionsAdmin() {
  const {
    data,
    toggleOpen, toggleRushMode, setWaitTime,
    setFlashMessage, updateHappyHour,
    setMenuDuJour,
  } = useStore()

  const { isOpen, rushMode, flashMessage, waitTime, happyHour, menuCategories } = data
  const allItems = menuCategories?.flatMap(c => c.items) || []

  const [msgInput, setMsgInput] = useState(flashMessage || '')
  const [waitInput, setWaitInput] = useState(waitTime || 15)
  const [hhInput, setHhInput] = useState({ ...happyHour })
  const [menuDuJourIds, setMenuDuJourIds] = useState((data.menuDuJour || []).map(i => i.id))
  const [saved, setSaved] = useState({})

  const notify = (key) => {
    setSaved(p => ({ ...p, [key]: true }))
    setTimeout(() => setSaved(p => ({ ...p, [key]: false })), 2000)
  }

  const card = (style = {}) => ({
    backgroundColor: '#1F2937', borderRadius: '14px',
    border: '1px solid #374151', padding: '20px', ...style,
  })

  const Toggle = ({ on, onToggle, labelOn, labelOff, colorOn = '#10B981', colorOff = '#6B7280' }) => (
    <button onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
      backgroundColor: on ? colorOn + '22' : '#111827',
      border: `2px solid ${on ? colorOn : '#374151'}`,
      transition: 'all 0.2s',
    }}>
      <div style={{
        width: '42px', height: '24px', borderRadius: '12px',
        backgroundColor: on ? colorOn : '#374151',
        position: 'relative', transition: 'all 0.2s', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: '3px', left: on ? '21px' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          backgroundColor: 'white', transition: 'all 0.2s',
        }} />
      </div>
      <span style={{ fontWeight: 700, fontSize: '14px', color: on ? colorOn : '#9CA3AF' }}>
        {on ? labelOn : labelOff}
      </span>
    </button>
  )

  return (
    <div style={{ padding: '24px', color: 'white', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Commandes spéciales</h2>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Actions rapides visibles instantanément sur le site public</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>

        {/* Ouverture / Fermeture */}
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: isOpen ? '#064E3B' : '#4C0519', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Power size={18} color={isOpen ? '#10B981' : '#E11D48'} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Restaurant {isOpen ? 'Ouvert' : 'Fermé'}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Affiché en temps réel sur la page d'accueil</div>
            </div>
          </div>
          <Toggle
            on={isOpen}
            onToggle={toggleOpen}
            labelOn="OUVERT — Les clients peuvent commander"
            labelOff="FERMÉ — Commandes désactivées"
            colorOn="#10B981"
            colorOff="#E11D48"
          />
          {!isOpen && (
            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#4C0519', border: '1px solid #E11D48', fontSize: '13px', color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={14} /> Le site affiche "Fermé" aux clients
            </div>
          )}
        </div>

        {/* Mode Rush */}
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: rushMode ? '#451A03' : '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} color={rushMode ? '#F97316' : '#6B7280'} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Mode Rush</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Active une bannière d'alerte sur le site</div>
            </div>
          </div>
          <Toggle
            on={rushMode}
            onToggle={toggleRushMode}
            labelOn="RUSH ACTIF — Forte affluence"
            labelOff="Normal — Service standard"
            colorOn="#F97316"
          />
          {rushMode && (
            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#451A03', border: '1px solid #F97316', fontSize: '13px', color: '#FED7AA', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={14} color="#F97316" /> Bannière rush visible sur le site
            </div>
          )}
        </div>

        {/* Temps d'attente */}
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="#60A5FA" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Temps d'attente estimé</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Affiché sur la page Commander</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[5, 10, 15, 20, 30, 45].map(t => (
              <button key={t} onClick={() => { setWaitInput(t); setWaitTime(t); notify('wait') }} style={{
                padding: '7px 12px', borderRadius: '8px', border: `2px solid ${waitTime === t ? '#60A5FA' : '#374151'}`,
                cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                backgroundColor: waitTime === t ? '#1E3A5F' : 'transparent',
                color: waitTime === t ? '#60A5FA' : '#9CA3AF',
              }}>{t}min</button>
            ))}
          </div>
          {saved.wait && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={12} /> Mis à jour
            </div>
          )}
        </div>

        {/* Message Flash */}
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#312E81', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="#818CF8" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Message flash</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Bandeau en haut du site (laisser vide pour désactiver)</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              placeholder="Ex: Soirée foot ce soir, venez nombreux ! ⚽"
              style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '13px' }}
            />
            <button onClick={() => { setFlashMessage(msgInput); notify('msg') }} style={{ padding: '9px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#818CF8', color: 'white', fontWeight: 700, fontSize: '13px' }}>
              {saved.msg ? '✓' : 'OK'}
            </button>
          </div>
          {flashMessage && (
            <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#312E81', border: '1px solid #818CF8', fontSize: '12px', color: '#C7D2FE' }}>
              Actif : "{flashMessage}"
              <button onClick={() => { setMsgInput(''); setFlashMessage(null) }} style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '11px' }}>✕ Supprimer</button>
            </div>
          )}
        </div>

        {/* Happy Hour */}
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: happyHour.active ? '#422006' : '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coffee size={18} color={happyHour.active ? '#F59E0B' : '#6B7280'} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Happy Hour</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Réduction automatique sur une plage horaire</div>
            </div>
          </div>
          <Toggle
            on={happyHour.active}
            onToggle={() => { const u = { active: !happyHour.active }; setHhInput(p => ({ ...p, ...u })); updateHappyHour(u) }}
            labelOn={`ACTIF — ${happyHour.discount}% de ${happyHour.startHour}h à ${happyHour.endHour}h`}
            labelOff="Désactivé"
            colorOn="#F59E0B"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Réduction %</label>
              <input type="number" value={hhInput.discount} onChange={e => setHhInput(p => ({ ...p, discount: +e.target.value }))} onBlur={() => { updateHappyHour({ discount: hhInput.discount }); notify('hh') }}
                style={{ width: '100%', padding: '7px 8px', borderRadius: '7px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Début (h)</label>
              <input type="number" min="0" max="23" value={hhInput.startHour} onChange={e => setHhInput(p => ({ ...p, startHour: +e.target.value }))} onBlur={() => { updateHappyHour({ startHour: hhInput.startHour }); notify('hh') }}
                style={{ width: '100%', padding: '7px 8px', borderRadius: '7px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '4px' }}>Fin (h)</label>
              <input type="number" min="0" max="23" value={hhInput.endHour} onChange={e => setHhInput(p => ({ ...p, endHour: +e.target.value }))} onBlur={() => { updateHappyHour({ endHour: hhInput.endHour }); notify('hh') }}
                style={{ width: '100%', padding: '7px 8px', borderRadius: '7px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>
          {saved.hh && <div style={{ marginTop: '8px', fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Sauvegardé</div>}
        </div>

        {/* Menu du jour */}
        <div style={card()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#064E3B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={18} color="#10B981" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Menu du jour</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Articles mis en avant sur la page d'accueil</div>
            </div>
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            {allItems.slice(0, 12).map(item => {
              const sel = menuDuJourIds.includes(item.id)
              return (
                <button key={item.id} onClick={() => {
                  const next = sel ? menuDuJourIds.filter(id => id !== item.id) : [...menuDuJourIds, item.id]
                  setMenuDuJourIds(next)
                  setMenuDuJour(allItems.filter(i => next.includes(i.id)))
                  notify('mdj')
                }} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px',
                  border: `1px solid ${sel ? '#10B981' : '#374151'}`, cursor: 'pointer',
                  backgroundColor: sel ? '#064E3B' : 'transparent', textAlign: 'left',
                }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: `2px solid ${sel ? '#10B981' : '#4B5563'}`, backgroundColor: sel ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {sel && <span style={{ fontSize: '10px', color: 'white', fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ flex: 1, fontSize: '13px', color: sel ? '#D1FAE5' : '#9CA3AF' }}>{item.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: sel ? '#10B981' : '#6B7280' }}>{item.price?.toFixed(2)}€</span>
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>{menuDuJourIds.length} article(s) sélectionné(s)</span>
            {saved.mdj && <span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Sauvegardé</span>}
          </div>
        </div>

      </div>

      {/* Résumé statut */}
      <div style={{ marginTop: '20px', padding: '16px 20px', borderRadius: '14px', backgroundColor: '#111827', border: '1px solid #1F2937', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>STATUT ACTUEL</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: isOpen ? '#10B981' : '#E11D48' }}>
          {isOpen ? '🟢 Ouvert' : '🔴 Fermé'}
        </span>
        {rushMode && <span style={{ fontSize: '13px', fontWeight: 700, color: '#F97316' }}>🔥 Mode Rush</span>}
        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>⏱ {waitTime} min d'attente</span>
        {flashMessage && <span style={{ fontSize: '13px', color: '#818CF8' }}>💬 Message flash actif</span>}
        {happyHour.active && <span style={{ fontSize: '13px', color: '#F59E0B' }}>☕ Happy Hour -{happyHour.discount}%</span>}
        {menuDuJourIds.length > 0 && <span style={{ fontSize: '13px', color: '#10B981' }}>⭐ {menuDuJourIds.length} plat(s) du jour</span>}
      </div>
    </div>
  )
}
