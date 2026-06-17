import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }
const CATS = ['Fromages', 'Viandes', 'Sauces', 'Extras', 'Légumes']

function ExtraForm({ initial = {}, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', price: '', category: 'Extras', ...initial })
  return (
    <div className="p-4 rounded-xl space-y-3 flex gap-3 items-end" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
      <div className="flex-1"><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom *</label><input style={INPUT} value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Sauce BBQ" /></div>
      <div style={{ width: '100px' }}><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Prix (€)</label><input type="number" step="0.01" style={INPUT} value={f.price} onChange={e => setF(p => ({ ...p, price: e.target.value }))} /></div>
      <div style={{ width: '140px' }}>
        <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Catégorie</label>
        <select style={INPUT} value={f.category} onChange={e => setF(p => ({ ...p, category: e.target.value }))}>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <button onClick={() => onSave({ ...f, price: parseFloat(f.price)||0 })} className="px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: '#E11D48' }}><Check size={13} /></button>
      <button onClick={onCancel} className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
    </div>
  )
}

export default function ExtrasAdmin() {
  const { data, addExtra, updateExtra, deleteExtra } = useStore()
  const extras = data.extras || []
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const cats = [...new Set(extras.map(e => e.category))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Extras & Suppléments</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Options de personnalisation disponibles à la commande</p>
        </div>
        <button onClick={() => setAdding(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {adding && <div className="mb-4"><ExtraForm onSave={(d) => { addExtra(d); setAdding(false) }} onCancel={() => setAdding(false)} /></div>}

      {cats.map(cat => (
        <div key={cat} className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#9CA3AF' }}>{cat}</h2>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
            {extras.filter(e => e.category === cat).map((extra, idx, arr) => (
              <div key={extra.id} style={{ borderBottom: idx < arr.length - 1 ? '1px solid #374151' : 'none' }}>
                {editing === extra.id ? (
                  <div className="p-3"><ExtraForm initial={extra} onSave={(d) => { updateExtra(extra.id, d); setEditing(null) }} onCancel={() => setEditing(null)} /></div>
                ) : (
                  <div className="flex items-center justify-between px-5 py-3">
                    <span className="font-semibold text-sm text-white">{extra.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold" style={{ color: '#E11D48' }}>+{extra.price.toFixed(2)}€</span>
                      <button onClick={() => setEditing(extra.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                      <button onClick={() => { if (window.confirm('Supprimer ?')) deleteExtra(extra.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
