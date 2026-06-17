import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }

function DrinkForm({ initial = {}, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', description: '', priceSm: '', priceMd: '', priceLg: '', available: true, image: '', ...initial })
  return (
    <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom *</label><input style={INPUT} value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Description</label><input style={INPUT} value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Prix S (€)</label><input style={INPUT} type="number" step="0.01" value={f.priceSm} onChange={e => setF(p => ({ ...p, priceSm: e.target.value }))} /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Prix M (€)</label><input style={INPUT} type="number" step="0.01" value={f.priceMd || ''} onChange={e => setF(p => ({ ...p, priceMd: e.target.value }))} /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Prix L (€)</label><input style={INPUT} type="number" step="0.01" value={f.priceLg || ''} onChange={e => setF(p => ({ ...p, priceLg: e.target.value }))} /></div>
      </div>
      <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>URL Image</label><input style={INPUT} value={f.image} onChange={e => setF(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={f.available} onChange={e => setF(p => ({ ...p, available: e.target.checked }))} />
          <span className="text-sm" style={{ color: '#D1D5DB' }}>Disponible</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, priceSm: parseFloat(f.priceSm)||0, priceMd: f.priceMd ? parseFloat(f.priceMd) : null, priceLg: f.priceLg ? parseFloat(f.priceLg) : null })} className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}><Check size={13} /> Enregistrer</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
      </div>
    </div>
  )
}

export default function DrinksAdmin() {
  const { data, addDrinkItem, updateDrinkItem, deleteDrinkItem, addDrinkCategory, deleteDrinkCategory } = useStore()
  const [openCats, setOpenCats] = useState({})
  const [editingItem, setEditingItem] = useState(null)
  const [addingTo, setAddingTo] = useState(null)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('🥤')
  const [showNewCat, setShowNewCat] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Boissons</h1>
        <button onClick={() => setShowNewCat(p => !p)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      {showNewCat && (
        <div className="mb-4 p-4 rounded-xl flex gap-3 items-end" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
          <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Icône</label><input style={{ ...INPUT, width: '70px' }} value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} /></div>
          <div className="flex-1"><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom</label><input style={INPUT} value={newCatName} onChange={e => setNewCatName(e.target.value)} /></div>
          <button onClick={() => { if (newCatName.trim()) { addDrinkCategory({ name: newCatName, icon: newCatIcon }); setNewCatName(''); setShowNewCat(false) } }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#E11D48' }}>Créer</button>
          <button onClick={() => setShowNewCat(false)} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Annuler</button>
        </div>
      )}

      <div className="space-y-4">
        {data.drinkCategories.map(cat => (
          <div key={cat.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setOpenCats(p => ({ ...p, [cat.id]: !p[cat.id] }))}
              style={{ borderBottom: openCats[cat.id] ? '1px solid #374151' : 'none' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-semibold text-white">{cat.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>{cat.items.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); if (window.confirm('Supprimer ?')) deleteDrinkCategory(cat.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                {openCats[cat.id] ? <ChevronUp size={18} style={{ color: '#9CA3AF' }} /> : <ChevronDown size={18} style={{ color: '#9CA3AF' }} />}
              </div>
            </div>
            {openCats[cat.id] && (
              <div className="p-4 space-y-3">
                {cat.items.map(item => (
                  <div key={item.id}>
                    {editingItem === item.id ? (
                      <DrinkForm initial={item} onSave={(d) => { updateDrinkItem(cat.id, item.id, d); setEditingItem(null) }} onCancel={() => setEditingItem(null)} />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#111827' }}>
                        {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                        <div className="flex-1">
                          <span className="font-semibold text-sm text-white">{item.name}</span>
                          <div className="flex gap-2 mt-0.5">
                            {item.priceSm && <span className="text-xs" style={{ color: '#9CA3AF' }}>S: {item.priceSm}€</span>}
                            {item.priceMd && <span className="text-xs" style={{ color: '#9CA3AF' }}>M: {item.priceMd}€</span>}
                            {item.priceLg && <span className="text-xs" style={{ color: '#9CA3AF' }}>L: {item.priceLg}€</span>}
                          </div>
                        </div>
                        <button onClick={() => setEditingItem(item.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#1F2937', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                        <button onClick={() => { if (window.confirm('Supprimer ?')) deleteDrinkItem(cat.id, item.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                ))}
                {addingTo === cat.id ? (
                  <DrinkForm onSave={(d) => { addDrinkItem(cat.id, d); setAddingTo(null) }} onCancel={() => setAddingTo(null)} />
                ) : (
                  <button onClick={() => setAddingTo(cat.id)} className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ border: '1.5px dashed #374151', color: '#E11D48' }}>
                    <Plus size={15} /> Ajouter une boisson
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
