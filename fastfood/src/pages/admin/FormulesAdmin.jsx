import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }
const BADGES = [null, 'populaire', 'signature', 'nouveau', 'enfants', 'famille', 'veggie']

function FormuleForm({ initial = {}, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', description: '', price: '', originalPrice: '', badge: null, available: true, image: '', ...initial })
  return (
    <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom *</label><input style={INPUT} value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} /></div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Badge</label>
          <select style={INPUT} value={f.badge || ''} onChange={e => setF(p => ({ ...p, badge: e.target.value || null }))}>
            {BADGES.map(b => <option key={b} value={b || ''}>{b || '— Aucun —'}</option>)}
          </select>
        </div>
      </div>
      <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Description</label><textarea style={{ ...INPUT, resize: 'none' }} rows={2} value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Prix promo (€) *</label><input style={INPUT} type="number" step="0.01" value={f.price} onChange={e => setF(p => ({ ...p, price: e.target.value }))} /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Prix barré (€)</label><input style={INPUT} type="number" step="0.01" value={f.originalPrice || ''} onChange={e => setF(p => ({ ...p, originalPrice: e.target.value }))} /></div>
      </div>
      <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>URL Image</label><input style={INPUT} value={f.image || ''} onChange={e => setF(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={f.available} onChange={e => setF(p => ({ ...p, available: e.target.checked }))} />
          <span className="text-sm" style={{ color: '#D1D5DB' }}>Disponible</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, price: parseFloat(f.price)||0, originalPrice: f.originalPrice ? parseFloat(f.originalPrice) : null })} className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}><Check size={13} /> Enregistrer</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
      </div>
    </div>
  )
}

export default function FormulesAdmin() {
  const { data, addFormule, updateFormule, deleteFormule } = useStore()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Formules & Menus</h1>
        <button onClick={() => setAdding(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Nouvelle formule
        </button>
      </div>

      {adding && <div className="mb-4"><FormuleForm onSave={(d) => { addFormule(d); setAdding(false) }} onCancel={() => setAdding(false)} /></div>}

      <div className="space-y-3">
        {data.formules.map(f => (
          <div key={f.id}>
            {editing === f.id ? (
              <FormuleForm initial={f} onSave={(d) => { updateFormule(f.id, d); setEditing(null) }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                {f.image && <img src={f.image} alt={f.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{f.name}</span>
                    {f.badge && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#FFF1F2', color: '#E11D48' }}>{f.badge}</span>}
                    {!f.available && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Indisponible</span>}
                  </div>
                  <p className="text-sm mt-0.5 line-clamp-1" style={{ color: '#9CA3AF' }}>{f.description}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="font-bold" style={{ color: '#E11D48' }}>{Number(f.price).toFixed(2)}€</div>
                    {f.originalPrice && <div className="text-xs line-through" style={{ color: '#6B7280' }}>{Number(f.originalPrice).toFixed(2)}€</div>}
                  </div>
                  <button onClick={() => setEditing(f.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                  <button onClick={() => { if (window.confirm('Supprimer ?')) deleteFormule(f.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
