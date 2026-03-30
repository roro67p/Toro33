import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'

const EMPTY_ITEM = { name: '', description: '', price: '', available: true }

function ItemRow({ catId, item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...item, price: item.price.toString() })

  const save = () => {
    onUpdate(catId, item.id, {
      ...form,
      price: parseFloat(form.price) || 0
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Prix (€) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Description</label>
          <input
            type="text"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={form.available}
                onChange={e => setForm(p => ({ ...p, available: e.target.checked }))}
              />
              <span className="toggle-slider" />
            </label>
            <span className="text-xs font-medium" style={{ color: '#44403C' }}>
              {form.available ? 'Disponible' : 'Indisponible'}
            </span>
          </label>
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:bg-[#F3F4F6]"
              style={{ borderColor: '#E5E7EB', color: '#44403C' }}>
              <X size={14} />
            </button>
            <button onClick={save}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}>
              <Check size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-[#F9FAFB] group"
      style={{ border: '1px solid transparent' }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <label className="toggle-switch flex-shrink-0">
          <input
            type="checkbox"
            checked={item.available}
            onChange={e => onUpdate(catId, item.id, { available: e.target.checked })}
          />
          <span className="toggle-slider" />
        </label>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: item.available ? '#1C1917' : '#9CA3AF' }}>
              {item.name}
            </span>
            {!item.available && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                Indispo
              </span>
            )}
          </div>
          <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{item.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="font-bold text-sm" style={{ color: '#D97706' }}>
          {parseFloat(item.price).toFixed(2)}€
        </span>
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:opacity-80"
          style={{ color: '#6B7280', backgroundColor: '#F3F4F6' }}
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={() => { if (confirm(`Supprimer "${item.name}" ?`)) onDelete(catId, item.id) }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:opacity-80"
          style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function AddItemForm({ catId, onAdd, onCancel }) {
  const [form, setForm] = useState(EMPTY_ITEM)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return
    onAdd(catId, { ...form, price: parseFloat(form.price) || 0 })
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl space-y-3 mt-2"
      style={{ backgroundColor: '#F0FDF4', border: '1px dashed #86EFAC' }}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: '#14532D' }}>Nom *</label>
          <input
            type="text" required
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
            placeholder="Nom du plat"
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: '#14532D' }}>Prix (€) *</label>
          <input
            type="number" step="0.01" min="0" required
            value={form.price}
            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
            placeholder="0.00"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium block mb-1" style={{ color: '#14532D' }}>Description</label>
        <input
          type="text"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
          placeholder="Ingrédients, description..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 rounded-lg border text-xs font-medium transition-all hover:bg-[#F3F4F6]"
          style={{ borderColor: '#E5E7EB', color: '#44403C' }}>
          Annuler
        </button>
        <button type="submit"
          className="px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#10B981' }}>
          Ajouter
        </button>
      </div>
    </form>
  )
}

function CategorySection({ cat, onUpdateCategory, onUpdateItem, onDeleteItem, onAddItem, onDeleteCategory }) {
  const [collapsed, setCollapsed] = useState(false)
  const [addingItem, setAddingItem] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameForm, setNameForm] = useState({ name: cat.name, icon: cat.icon })

  const saveName = () => {
    onUpdateCategory(cat.id, nameForm)
    setEditingName(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Category Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: collapsed ? 'none' : '1px solid #F3F4F6', backgroundColor: '#FAFAFA' }}>
        {editingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text" value={nameForm.icon}
              onChange={e => setNameForm(p => ({ ...p, icon: e.target.value }))}
              className="w-12 px-2 py-1.5 rounded-lg border text-sm text-center outline-none"
              style={{ borderColor: '#E5E7EB' }}
            />
            <input
              type="text" value={nameForm.name}
              onChange={e => setNameForm(p => ({ ...p, name: e.target.value }))}
              className="flex-1 px-3 py-1.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
              autoFocus
            />
            <button onClick={saveName}
              className="p-1.5 rounded-lg text-white" style={{ backgroundColor: '#D97706' }}>
              <Check size={14} />
            </button>
            <button onClick={() => setEditingName(false)}
              className="p-1.5 rounded-lg" style={{ color: '#9CA3AF' }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">{cat.icon}</span>
            <div>
              <h3 className="font-semibold" style={{ color: '#1C1917' }}>{cat.name}</h3>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{cat.items.length} article{cat.items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
        {!editingName && (
          <div className="flex items-center gap-1">
            <button onClick={() => setEditingName(true)}
              className="p-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ color: '#9CA3AF', backgroundColor: '#F3F4F6' }}>
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => { if (confirm(`Supprimer la catégorie "${cat.name}" et tous ses articles ?`)) onDeleteCategory(cat.id) }}
              className="p-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}>
              <Trash2 size={14} />
            </button>
            <button onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ color: '#9CA3AF', backgroundColor: '#F3F4F6' }}>
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Items */}
      {!collapsed && (
        <div className="p-4">
          {cat.items.length === 0 && !addingItem && (
            <p className="text-center text-sm py-4" style={{ color: '#9CA3AF' }}>
              Aucun article. Ajoutez-en un ci-dessous.
            </p>
          )}
          <div className="space-y-1 mb-3">
            {cat.items.map(item => (
              <ItemRow
                key={item.id}
                catId={cat.id}
                item={item}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
          {addingItem ? (
            <AddItemForm
              catId={cat.id}
              onAdd={onAddItem}
              onCancel={() => setAddingItem(false)}
            />
          ) : (
            <button
              onClick={() => setAddingItem(true)}
              className="w-full py-2.5 rounded-xl border-dashed border text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-70"
              style={{ borderColor: '#D97706', color: '#D97706' }}
            >
              <Plus size={15} />
              Ajouter un plat
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function MenuAdmin() {
  const { data, updateMenuCategory, addMenuItem, updateMenuItem, deleteMenuItem, addMenuCategory, deleteMenuCategory } = useStore()
  const { menuCategories } = data
  const [showAddCat, setShowAddCat] = useState(false)
  const [newCat, setNewCat] = useState({ name: '', icon: '🍽️' })

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!newCat.name.trim()) return
    addMenuCategory(newCat)
    setNewCat({ name: '', icon: '🍽️' })
    setShowAddCat(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>
            Gestion du Menu
          </h2>
          <p className="text-sm" style={{ color: '#78716C' }}>
            {menuCategories.length} catégories · {menuCategories.reduce((acc, c) => acc + c.items.length, 0)} articles
          </p>
        </div>
        <button
          onClick={() => setShowAddCat(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
          style={{ backgroundColor: '#D97706' }}
        >
          <Plus size={16} />
          Nouvelle catégorie
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCat && (
        <form onSubmit={handleAddCategory} className="p-5 rounded-2xl space-y-3"
          style={{ backgroundColor: '#F0FDF4', border: '1px dashed #86EFAC' }}>
          <h3 className="font-semibold text-sm" style={{ color: '#14532D' }}>Nouvelle catégorie</h3>
          <div className="flex gap-3">
            <input
              type="text" value={newCat.icon} onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))}
              className="w-14 px-2 py-2.5 rounded-xl border text-sm text-center outline-none"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="📋"
            />
            <input
              type="text" required value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
              className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#E5E7EB', color: '#1C1917' }}
              placeholder="Nom de la catégorie"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowAddCat(false)}
              className="px-4 py-2 rounded-xl border text-sm font-medium"
              style={{ borderColor: '#E5E7EB', color: '#44403C' }}>
              Annuler
            </button>
            <button type="submit"
              className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ backgroundColor: '#10B981' }}>
              Créer
            </button>
          </div>
        </form>
      )}

      {/* Categories */}
      {menuCategories.map(cat => (
        <CategorySection
          key={cat.id}
          cat={cat}
          onUpdateCategory={updateMenuCategory}
          onUpdateItem={updateMenuItem}
          onDeleteItem={deleteMenuItem}
          onAddItem={addMenuItem}
          onDeleteCategory={deleteMenuCategory}
        />
      ))}

      {menuCategories.length === 0 && (
        <div className="text-center py-12" style={{ color: '#9CA3AF' }}>
          <p>Aucune catégorie. Créez-en une pour commencer.</p>
        </div>
      )}
    </div>
  )
}
