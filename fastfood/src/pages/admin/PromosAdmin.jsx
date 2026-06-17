import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, Tag, ToggleLeft, ToggleRight } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }

function PromoForm({ initial = {}, onSave, onCancel }) {
  const [f, setF] = useState({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', description: '', active: true, ...initial })
  return (
    <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Code *</label>
          <input style={INPUT} value={f.code} onChange={e => setF(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="BURGER10" />
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Type</label>
          <select style={INPUT} value={f.type} onChange={e => setF(p => ({ ...p, type: e.target.value }))}>
            <option value="percent">Pourcentage (%)</option>
            <option value="fixed">Montant fixe (€)</option>
          </select>
        </div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Valeur *</label>
          <input type="number" style={INPUT} value={f.value} onChange={e => setF(p => ({ ...p, value: e.target.value }))} placeholder={f.type === 'percent' ? '10 = 10%' : '5 = 5€'} />
        </div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Commande min. (€)</label>
          <input type="number" style={INPUT} value={f.minOrder} onChange={e => setF(p => ({ ...p, minOrder: e.target.value }))} />
        </div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nb max d'utilisations</label>
          <input type="number" style={INPUT} value={f.maxUses} onChange={e => setF(p => ({ ...p, maxUses: e.target.value }))} placeholder="Illimité si vide" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input type="checkbox" checked={f.active} onChange={e => setF(p => ({ ...p, active: e.target.checked }))} />
            <span className="text-sm" style={{ color: '#D1D5DB' }}>Actif</span>
          </label>
        </div>
      </div>
      <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Description</label>
        <input style={INPUT} value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} placeholder="10% de réduction pour..." />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, value: parseFloat(f.value)||0, minOrder: parseFloat(f.minOrder)||0, maxUses: f.maxUses ? parseInt(f.maxUses) : null })}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}><Check size={13} /> Enregistrer</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
      </div>
    </div>
  )
}

export default function PromosAdmin() {
  const { data, addPromoCode, updatePromoCode, deletePromoCode } = useStore()
  const promos = data.promoCodes || []
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const totalUses = promos.reduce((s, p) => s + (p.uses || 0), 0)
  const activeCount = promos.filter(p => p.active).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Codes Promo</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{activeCount} actifs · {totalUses} utilisations au total</p>
        </div>
        <button onClick={() => setAdding(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Nouveau code
        </button>
      </div>

      {adding && <div className="mb-4"><PromoForm onSave={(d) => { addPromoCode(d); setAdding(false) }} onCancel={() => setAdding(false)} /></div>}

      <div className="space-y-3">
        {promos.map(promo => (
          <div key={promo.id}>
            {editing === promo.id ? (
              <PromoForm initial={promo} onSave={(d) => { updatePromoCode(promo.id, d); setEditing(null) }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: '#1F2937', border: `1px solid ${promo.active ? '#374151' : '#1F2937'}`, opacity: promo.active ? 1 : 0.6 }}>
                <div className="px-4 py-2 rounded-xl font-black tracking-widest flex-shrink-0" style={{ backgroundColor: '#111827', color: '#E11D48', border: '2px dashed #374151', fontSize: '16px' }}>
                  {promo.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{promo.type === 'percent' ? `-${promo.value}%` : `-${promo.value}€`}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: promo.active ? '#D1FAE5' : '#374151', color: promo.active ? '#065F46' : '#9CA3AF' }}>
                      {promo.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{promo.description}</p>
                  <div className="flex gap-3 mt-1 text-xs" style={{ color: '#6B7280' }}>
                    <span>Min: {promo.minOrder}€</span>
                    <span>{promo.uses} utilisations</span>
                    {promo.maxUses && <span>Max: {promo.maxUses}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => updatePromoCode(promo.id, { active: !promo.active })} className="p-1.5 rounded-lg"
                    style={{ backgroundColor: promo.active ? '#374151' : '#D1FAE5', color: promo.active ? '#9CA3AF' : '#065F46' }}>
                    {promo.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => setEditing(promo.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                  <button onClick={() => { if (window.confirm('Supprimer ?')) deletePromoCode(promo.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {promos.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#1F2937' }}>
            <Tag size={40} className="mx-auto mb-3 opacity-30" style={{ color: '#9CA3AF' }} />
            <p className="text-white font-semibold">Aucun code promo</p>
          </div>
        )}
      </div>
    </div>
  )
}
