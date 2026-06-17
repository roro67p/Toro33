import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'

const BADGES = [null, 'populaire', 'signature', 'nouveau', 'épicé', 'veggie', 'coup coeur']
const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }

function ItemForm({ initial = {}, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', description: '', price: '', allergens: '', badge: null, available: true, image: '', ...initial })
  return (
    <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom *</label><input style={INPUT} value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Prix (€) *</label><input style={INPUT} type="number" step="0.01" value={f.price} onChange={e => setF(p => ({ ...p, price: e.target.value }))} /></div>
      </div>
      <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Description</label><input style={INPUT} value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Allergènes</label><input style={INPUT} value={f.allergens} onChange={e => setF(p => ({ ...p, allergens: e.target.value }))} /></div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Badge</label>
          <select style={INPUT} value={f.badge || ''} onChange={e => setF(p => ({ ...p, badge: e.target.value || null }))}>
            {BADGES.map(b => <option key={b} value={b || ''}>{b || '— Aucun —'}</option>)}
          </select>
        </div>
      </div>
      <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>URL Image</label><input style={INPUT} value={f.image} onChange={e => setF(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={f.available} onChange={e => setF(p => ({ ...p, available: e.target.checked }))} />
          <span className="text-sm" style={{ color: '#D1D5DB' }}>Disponible</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, price: parseFloat(f.price) || 0 })} className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}><Check size={13} /> Enregistrer</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
      </div>
    </div>
  )
}

export default function MenuAdmin() {
  const { data, addMenuItem, updateMenuItem, deleteMenuItem, addMenuCategory, deleteMenuCategory } = useStore()
  const [openCats, setOpenCats] = useState({})
  const [editingItem, setEditingItem] = useState(null)
  const [addingTo, setAddingTo] = useState(null)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('🍔')
  const [showNewCat, setShowNewCat] = useState(false)

  const toggle = (id) => setOpenCats(p => ({ ...p, [id]: !p[id] }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Menu</h1>
        <button onClick={() => setShowNewCat(p => !p)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:opacity-90" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      {showNewCat && (
        <div className="mb-4 p-4 rounded-xl flex gap-3 items-end" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
          <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Icône</label><input style={{ ...INPUT, width: '70px' }} value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} /></div>
          <div className="flex-1"><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom</label><input style={INPUT} value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Ex: Wraps" /></div>
          <button onClick={() => { if (newCatName.trim()) { addMenuCategory({ name: newCatName.trim(), icon: newCatIcon }); setNewCatName(''); setShowNewCat(false) } }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#E11D48' }}>Créer</button>
          <button onClick={() => setShowNewCat(false)} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Annuler</button>
        </div>
      )}

      <div className="space-y-4">
        {data.menuCategories.map(cat => (
          <div key={cat.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => toggle(cat.id)} style={{ borderBottom: openCats[cat.id] ? '1px solid #374151' : 'none' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-semibold text-white">{cat.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>{cat.items.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); if (window.confirm(`Supprimer la catégorie "${cat.name}" ?`)) deleteMenuCategory(cat.id) }} className="p-1.5 rounded-lg hover:opacity-80" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}>
                  <Trash2 size={14} />
                </button>
                {openCats[cat.id] ? <ChevronUp size={18} style={{ color: '#9CA3AF' }} /> : <ChevronDown size={18} style={{ color: '#9CA3AF' }} />}
              </div>
            </div>

            {openCats[cat.id] && (
              <div className="p-4 space-y-3">
                {cat.items.map(item => (
                  <div key={item.id}>
                    {editingItem === item.id ? (
                      <ItemForm initial={item} onSave={(data) => { updateMenuItem(cat.id, item.id, data); setEditingItem(null) }} onCancel={() => setEditingItem(null)} />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#111827' }}>
                        {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">{item.name}</span>
                            {item.badge && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#FFF1F2', color: '#E11D48' }}>{item.badge}</span>}
                            {!item.available && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Indisponible</span>}
                          </div>
                          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#9CA3AF' }}>{item.description}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-bold" style={{ color: '#E11D48' }}>{Number(item.price).toFixed(2)}€</span>
                          <button onClick={() => setEditingItem(item.id)} className="p-1.5 rounded-lg hover:opacity-80" style={{ backgroundColor: '#1F2937', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                          <button onClick={() => { if (window.confirm('Supprimer ?')) deleteMenuItem(cat.id, item.id) }} className="p-1.5 rounded-lg hover:opacity-80" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {addingTo === cat.id ? (
                  <ItemForm onSave={(data) => { addMenuItem(cat.id, data); setAddingTo(null) }} onCancel={() => setAddingTo(null)} />
                ) : (
                  <button onClick={() => setAddingTo(cat.id)} className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-80"
                    style={{ border: '1.5px dashed #374151', color: '#E11D48' }}>
                    <Plus size={15} /> Ajouter un article
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
