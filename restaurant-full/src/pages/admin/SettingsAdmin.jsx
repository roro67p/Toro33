import { useState } from 'react'
import useStore from '../../store/useStore'
import { Save, AlertTriangle, Lock, Info, Clock } from 'lucide-react'

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${active ? '' : 'hover:opacity-70'}`}
      style={active ? { backgroundColor: '#D97706', color: 'white' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
      {children}
    </button>
  )
}

function InfoSettings() {
  const { data, updateRestaurantInfo } = useStore()
  const [form, setForm] = useState({ ...data.restaurant })
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateRestaurantInfo(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const f = (field) => ({ value: form[field] || '', onChange: e => setForm(p => ({ ...p, [field]: e.target.value })) })

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Nom du restaurant', field: 'name' },
          { label: 'Accroche (tagline)', field: 'tagline' },
          { label: 'Adresse', field: 'address' },
          { label: 'Téléphone', field: 'phone' },
          { label: 'Email', field: 'email' },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#44403C' }}>{label}</label>
            <input {...f(field)} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-200"
              style={{ borderColor: '#E5E7EB', color: '#1C1917', backgroundColor: 'white' }} />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className="text-xs font-medium block mb-1.5" style={{ color: '#44403C' }}>Description du restaurant</label>
          <textarea {...f('description')} rows={4} className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-amber-200"
            style={{ borderColor: '#E5E7EB', color: '#1C1917', backgroundColor: 'white' }} />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: saved ? '#22c55e' : '#D97706', color: 'white' }}>
          <Save size={15} />{saved ? 'Enregistré !' : 'Enregistrer les informations'}
        </button>
      </div>
    </div>
  )
}

function HoursSettings() {
  const { data, updateHours } = useStore()
  const [saved, setSaved] = useState(false)
  const [local, setLocal] = useState(data.restaurant.hours.map(h => ({ ...h })))

  const update = (i, field, value) => setLocal(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: value } : h))

  const save = () => {
    local.forEach((h, i) => updateHours(i, h))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-3">
      {local.map((day, i) => (
        <div key={day.day} className="flex items-center gap-4 p-4 rounded-xl transition-all"
          style={{ backgroundColor: day.closed ? '#FAFAFA' : 'white', border: `1px solid ${day.closed ? '#E5E7EB' : '#FDE68A'}` }}>
          <div className="w-28 flex-shrink-0">
            <span className="text-sm font-semibold" style={{ color: day.closed ? '#9CA3AF' : '#1C1917' }}>{day.day}</span>
          </div>
          <label className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            <input type="checkbox" checked={!day.closed} onChange={e => update(i, 'closed', !e.target.checked)}
              className="w-4 h-4 accent-amber-600" />
            <span className="text-xs" style={{ color: '#78716C' }}>{day.closed ? 'Fermé' : 'Ouvert'}</span>
          </label>
          {!day.closed && (
            <>
              <div className="flex items-center gap-2 flex-1">
                <Clock size={13} className="text-amber-500 flex-shrink-0" />
                <input value={day.lunch} onChange={e => update(i, 'lunch', e.target.value)} placeholder="Midi (ex: 12h00-14h30)"
                  className="flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917', minWidth: 0 }} />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs flex-shrink-0" style={{ color: '#9CA3AF' }}>Soir</span>
                <input value={day.dinner} onChange={e => update(i, 'dinner', e.target.value)} placeholder="Soir (ex: 19h00-22h30)"
                  className="flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917', minWidth: 0 }} />
              </div>
            </>
          )}
          {day.closed && <div className="flex-1 text-sm italic" style={{ color: '#D1D5DB' }}>Fermé ce jour</div>}
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: saved ? '#22c55e' : '#D97706', color: 'white' }}>
          <Save size={15} />{saved ? 'Enregistré !' : 'Enregistrer les horaires'}
        </button>
      </div>
    </div>
  )
}

function SecuritySettings() {
  const { resetData } = useStore()
  const [current, setCurrent] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState(null)
  const [resetting, setResetting] = useState(false)

  const changePassword = () => {
    if (current !== 'admin123') { setMsg({ type: 'error', text: 'Mot de passe actuel incorrect' }); return }
    if (newPwd.length < 4) { setMsg({ type: 'error', text: 'Le nouveau mot de passe doit faire au moins 4 caractères' }); return }
    if (newPwd !== confirm) { setMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas' }); return }
    setMsg({ type: 'success', text: 'Mot de passe modifié (fonctionnalité demo — relancez l\'app pour activer)' })
    setCurrent(''); setNewPwd(''); setConfirm('')
  }

  const handleReset = () => {
    if (!resetting) { setResetting(true); return }
    resetData()
    setResetting(false)
    setMsg({ type: 'success', text: 'Données réinitialisées avec succès !' })
  }

  return (
    <div className="space-y-6 max-w-md">
      {/* Change password */}
      <div className="p-5 rounded-2xl space-y-3" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-2 mb-3">
          <Lock size={16} style={{ color: '#D97706' }} />
          <h3 className="font-semibold text-sm" style={{ color: '#1C1917' }}>Changer le mot de passe</h3>
        </div>
        {[
          { label: 'Mot de passe actuel', val: current, set: setCurrent },
          { label: 'Nouveau mot de passe', val: newPwd, set: setNewPwd },
          { label: 'Confirmer le nouveau', val: confirm, set: setConfirm }
        ].map(({ label, val, set }) => (
          <div key={label}>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>{label}</label>
            <input type="password" value={val} onChange={e => set(e.target.value)} className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
        ))}
        {msg && (
          <div className="p-2.5 rounded-lg text-xs font-medium" style={{ backgroundColor: msg.type === 'error' ? '#FEE2E2' : '#D1FAE5', color: msg.type === 'error' ? '#DC2626' : '#065F46' }}>
            {msg.text}
          </div>
        )}
        <button onClick={changePassword} className="w-full py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: '#D97706', color: 'white' }}>
          Modifier le mot de passe
        </button>
      </div>

      {/* Reset data */}
      <div className="p-5 rounded-2xl space-y-3" style={{ backgroundColor: 'white', border: '1px solid #FCA5A5' }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: '#DC2626' }} />
          <h3 className="font-semibold text-sm" style={{ color: '#DC2626' }}>Zone de danger</h3>
        </div>
        <p className="text-xs" style={{ color: '#78716C' }}>Cette action réinitialisera <strong>toutes les données</strong> de l'application (menu, boissons, événements, réservations) aux valeurs par défaut. Cette action est irréversible.</p>
        {resetting && (
          <p className="text-xs font-semibold p-2 rounded-lg text-center" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            ⚠️ Cliquez à nouveau pour confirmer la réinitialisation
          </p>
        )}
        <button onClick={handleReset} className="w-full py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: resetting ? '#DC2626' : '#FEE2E2', color: resetting ? 'white' : '#DC2626' }}>
          {resetting ? '⚠️ Confirmer la réinitialisation' : 'Réinitialiser toutes les données'}
        </button>
        {resetting && <button onClick={() => setResetting(false)} className="w-full py-2 rounded-xl text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>}
      </div>
    </div>
  )
}

export default function SettingsAdmin() {
  const [tab, setTab] = useState('info')
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Paramètres</h2>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Gérez les informations et la configuration de votre restaurant</p>
      </div>
      <div className="flex gap-2 mb-6">
        <TabBtn active={tab === 'info'} onClick={() => setTab('info')}><Info size={14} className="inline mr-1.5" />Informations</TabBtn>
        <TabBtn active={tab === 'hours'} onClick={() => setTab('hours')}><Clock size={14} className="inline mr-1.5" />Horaires</TabBtn>
        <TabBtn active={tab === 'security'} onClick={() => setTab('security')}><Lock size={14} className="inline mr-1.5" />Sécurité</TabBtn>
      </div>
      {tab === 'info' && <InfoSettings />}
      {tab === 'hours' && <HoursSettings />}
      {tab === 'security' && <SecuritySettings />}
    </div>
  )
}
