import { useState } from 'react'
import useStore from '../../store/useStore'
import { Check, Save } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }
const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']

export default function SettingsAdmin() {
  const { data, updateRestaurantInfo, updateHours, updateAdminPassword, resetData } = useStore()
  const { restaurant } = data
  const [info, setInfo] = useState({ name: restaurant.name, tagline: restaurant.tagline, description: restaurant.description, address: restaurant.address, phone: restaurant.phone, email: restaurant.email })
  const [savedInfo, setSavedInfo] = useState(false)
  const [oldPwd, setOldPwd] = useState(''); const [newPwd, setNewPwd] = useState(''); const [pwdMsg, setPwdMsg] = useState('')

  const saveInfo = () => { updateRestaurantInfo(info); setSavedInfo(true); setTimeout(() => setSavedInfo(false), 2000) }
  const savePwd = () => {
    if (oldPwd !== (data.adminPassword || 'admin123')) { setPwdMsg('Mot de passe actuel incorrect'); return }
    if (newPwd.length < 4) { setPwdMsg('Min. 4 caractères'); return }
    updateAdminPassword(newPwd); setOldPwd(''); setNewPwd(''); setPwdMsg('Mot de passe changé !')
    setTimeout(() => setPwdMsg(''), 3000)
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 className="text-2xl font-bold text-white mb-6">Paramètres</h1>

      {/* Restaurant info */}
      <div className="rounded-2xl p-6 mb-5" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
        <h2 className="font-bold text-white mb-4">Informations restaurant</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom</label><input style={INPUT} value={info.name} onChange={e => setInfo(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Slogan</label><input style={INPUT} value={info.tagline} onChange={e => setInfo(p => ({ ...p, tagline: e.target.value }))} /></div>
          </div>
          <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Description</label><textarea style={{ ...INPUT, resize: 'none' }} rows={3} value={info.description} onChange={e => setInfo(p => ({ ...p, description: e.target.value }))} /></div>
          <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Adresse</label><input style={INPUT} value={info.address} onChange={e => setInfo(p => ({ ...p, address: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Téléphone</label><input style={INPUT} value={info.phone} onChange={e => setInfo(p => ({ ...p, phone: e.target.value }))} /></div>
            <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Email</label><input style={INPUT} value={info.email} onChange={e => setInfo(p => ({ ...p, email: e.target.value }))} /></div>
          </div>
        </div>
        <button onClick={saveInfo} className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: savedInfo ? '#10B981' : '#E11D48' }}>
          {savedInfo ? <><Check size={15} /> Sauvegardé !</> : <><Save size={15} /> Enregistrer</>}
        </button>
      </div>

      {/* Hours */}
      <div className="rounded-2xl p-6 mb-5" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
        <h2 className="font-bold text-white mb-4">Horaires d'ouverture</h2>
        <div className="space-y-2">
          {restaurant.hours.map((h, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-24 text-sm text-white flex-shrink-0">{h.day}</div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!h.closed} onChange={e => updateHours(i, { closed: !e.target.checked })} />
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Ouvert</span>
              </label>
              {!h.closed ? (
                <>
                  <input type="time" value={h.open?.replace('h', ':').padStart(5,'0') || '11:00'} onChange={e => updateHours(i, { open: e.target.value.replace(':', 'h') })}
                    style={{ ...INPUT, width: '110px', padding: '6px 10px' }} />
                  <span style={{ color: '#6B7280' }}>→</span>
                  <input type="time" value={h.close?.replace('h', ':').padStart(5,'0') || '22:00'} onChange={e => updateHours(i, { close: e.target.value.replace(':', 'h') })}
                    style={{ ...INPUT, width: '110px', padding: '6px 10px' }} />
                </>
              ) : <span className="text-sm" style={{ color: '#6B7280' }}>Fermé</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="rounded-2xl p-6 mb-5" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
        <h2 className="font-bold text-white mb-4">Changer le mot de passe admin</h2>
        <div className="space-y-3">
          <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Mot de passe actuel</label><input type="password" style={INPUT} value={oldPwd} onChange={e => setOldPwd(e.target.value)} /></div>
          <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nouveau mot de passe</label><input type="password" style={INPUT} value={newPwd} onChange={e => setNewPwd(e.target.value)} /></div>
          {pwdMsg && <p className="text-sm" style={{ color: pwdMsg.includes('changé') ? '#10B981' : '#EF4444' }}>{pwdMsg}</p>}
        </div>
        <button onClick={savePwd} className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#E11D48' }}>Changer le mot de passe</button>
      </div>

      {/* Reset */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1F2937', border: '1px solid #EF4444' }}>
        <h2 className="font-bold text-white mb-2">Zone dangereuse</h2>
        <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>Réinitialise toutes les données aux valeurs par défaut. Action irréversible.</p>
        <button onClick={() => { if (window.confirm('Réinitialiser TOUTES les données ?')) resetData() }} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}>
          Réinitialiser les données
        </button>
      </div>
    </div>
  )
}
