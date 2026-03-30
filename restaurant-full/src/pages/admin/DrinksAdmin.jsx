import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'

const EMPTY_ITEM = { name: '', description: '', price_glass: '', price_bottle: '', available: true }

function DrinkRow({ catId, item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    ...item,
    price_glass: item.price_glass != null ? item.price_glass.toString() : '',
    price_bottle: item.price_bottle != null ? item.price_bottle.toString() : ''
  })

  const save = () => {
    onUpdate(catId, item.id, {
      ...form,
      price_glass: form.price_glass !== '' ? parseFloat(form.price_glass) : null,
      price_bottle: form.price_bottle !== '' ? parseFloat(form.price_bottle) : null
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Nom *</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Prix au verre (€)</label>
            <input type="number" step="0.01" min="0" value={form.price_glass} onChange={e => setForm(p => ({ ...p, price_glass: e.target.value }))}
              placeholder="laisser vide si N/A"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Description</label>
            <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Prix bouteille (€)</label>
            <input type="number" step="0.01" min="0" value={form.price_bottle} onChange={e => setForm(p => ({ ...p, price_bottle: e.target.value }))}
              placeholder="laisser vide si N/A"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.available} onChange={e => setForm(p => ({ ...p, available: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
            <span className="text-sm" style={{ color: '#44403C' }}>Disponible</span>
          </label>
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
            <button onClick={save} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
              <Check size={14} className="inline mr-1" />Enregistrer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl group transition-all hover:shadow-sm" style={{ backgroundColor: 'white', border: '1px solid #F3F4F6' }}>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.available ? 'bg-green-400' : 'bg-red-300'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm" style={{ color: '#1C1917' }}>{item.name}</span>
          {!item.available && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>Indisponible</span>}
        </div>
        {item.description && <p className="text-xs mt-0.5 truncate" style={{ color: '#9CA3AF' }}>{item.description}</p>}
      </div>
      <div className="flex items-center gap-3 text-sm font-semibold flex-shrink-0" style={{ color: '#D97706' }}>
        {item.price_glass != null && <span>{item.price_glass.toFixed(2)}€ <span className="text-xs font-normal text-gray-400">verre</span></span>}
        {item.price_bottle != null && <span>{item.price_bottle.toFixed(2)}€ <span className="text-xs font-normal text-gray-400">btl</span></span>}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#9CA3AF' }} title="Modifier">
          <Edit2 size={14} />
        </button>
        <button onClick={() => onDelete(catId, item.id)} className="p-1.5 rounded-lg transition-colors hover:text-red-500" style={{ color: '#9CA3AF' }} title="Supprimer">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function CategorySection({ category, onUpdateItem, onDeleteItem, onAddItem, onDeleteCategory, onUpdateCategory }) {
  const [collapsed, setCollapsed] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ ...EMPTY_ITEM })
  const [editingName, setEditingName] = useState(false)
  const [catName, setCatName] = useState(category.name)

  const saveNew = () => {
    if (!newItem.name.trim()) return
    onAddItem(category.id, {
      id: 'di' + Date.now(),
      ...newItem,
      price_glass: newItem.price_glass !== '' ? parseFloat(newItem.price_glass) : null,
      price_bottle: newItem.price_bottle !== '' ? parseFloat(newItem.price_bottle) : null
    })
    setNewItem({ ...EMPTY_ITEM })
    setAdding(false)
  }

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden mb-4" style={{ border: '1px solid #E5E7EB' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: '#FFFBEB' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.icon}</span>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input value={catName} onChange={e => setCatName(e.target.value)} className="px-2 py-1 rounded border text-sm font-semibold outline-none" style={{ borderColor: '#D97706', color: '#1C1917' }} autoFocus />
              <button onClick={() => { onUpdateCategory(category.id, { name: catName }); setEditingName(false) }} className="text-green-600"><Check size={14} /></button>
              <button onClick={() => { setCatName(category.name); setEditingName(false) }} className="text-gray-400"><X size={14} /></button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="font-semibold text-base hover:opacity-70 transition-opacity text-left" style={{ color: '#1C1917' }}>
              {category.name} <Edit2 size={12} className="inline ml-1 text-gray-400" />
            </button>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FDE68A', color: '#92400E' }}>{category.items.length} article{category.items.length > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onDeleteCategory(category.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 transition-colors" title="Supprimer la catégorie"><Trash2 size={15} /></button>
          <button onClick={() => setCollapsed(c => !c)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#9CA3AF' }}>
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-2" style={{ backgroundColor: '#FAFAFA' }}>
          {category.items.map(item => (
            <DrinkRow key={item.id} catId={category.id} item={item} onUpdate={onUpdateItem} onDelete={onDeleteItem} />
          ))}
          {adding ? (
            <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#FEF3C7', border: '1px dashed #FCD34D' }}>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Nom *" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                  className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} autoFocus />
                <input placeholder="Prix verre €" type="number" step="0.01" value={newItem.price_glass} onChange={e => setNewItem(p => ({ ...p, price_glass: e.target.value }))}
                  className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Description" value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                  className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
                <input placeholder="Prix bouteille €" type="number" step="0.01" value={newItem.price_bottle} onChange={e => setNewItem(p => ({ ...p, price_bottle: e.target.value }))}
                  className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => { setAdding(false); setNewItem({ ...EMPTY_ITEM }) }} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
                <button onClick={saveNew} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
                  <Check size={14} className="inline mr-1" />Ajouter
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all border-2 border-dashed hover:border-amber-400 hover:text-amber-600"
              style={{ borderColor: '#E5E7EB', color: '#9CA3AF' }}>
              <Plus size={16} />Ajouter une boisson
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function DrinksAdmin() {
  const { data, addDrinkItem, updateDrinkItem, deleteDrinkItem, updateDrinkCategory, deleteDrinkCategory, addDrinkCategory } = useStore()
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('🥤')
  const [addingCat, setAddingCat] = useState(false)

  const createCategory = () => {
    if (!newCatName.trim()) return
    addDrinkCategory({ id: 'dc' + Date.now(), name: newCatName, icon: newCatIcon, items: [] })
    setNewCatName(''); setNewCatIcon('🥤'); setAddingCat(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Carte des boissons</h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Gérez vos boissons et tarifs verre/bouteille</p>
        </div>
        <button onClick={() => setAddingCat(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: '#D97706', color: 'white' }}>
          <Plus size={16} />Nouvelle catégorie
        </button>
      </div>

      {addingCat && (
        <div className="mb-4 p-4 rounded-2xl flex items-center gap-3" style={{ backgroundColor: '#FEF3C7', border: '1px dashed #FCD34D' }}>
          <input value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} className="w-14 px-2 py-2 rounded-lg border text-center text-lg outline-none" style={{ borderColor: '#E5E7EB' }} placeholder="🥤" />
          <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nom de la catégorie" autoFocus
            className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          <button onClick={() => { setAddingCat(false); setNewCatName(''); }} className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
          <button onClick={createCategory} className="px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>Créer</button>
        </div>
      )}

      {data.drinkCategories.map(cat => (
        <CategorySection key={cat.id} category={cat}
          onUpdateItem={updateDrinkItem} onDeleteItem={deleteDrinkItem}
          onAddItem={addDrinkItem} onDeleteCategory={deleteDrinkCategory}
          onUpdateCategory={updateDrinkCategory} />
      ))}
    </div>
  )
}
