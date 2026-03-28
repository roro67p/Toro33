import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
// Badge not needed on this page
import { useStore } from '../store/useStore'
import { MenuItem, MenuCategory } from '../types'

const CATEGORIES: MenuCategory[] = ['Entrées', 'Plats', 'Desserts', 'Boissons', 'Vins', 'Cocktails']

const categoryColors: Record<string, string> = {
  'Entrées': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'Plats': 'bg-indigo-50 border-indigo-200 text-indigo-700',
  'Desserts': 'bg-pink-50 border-pink-200 text-pink-700',
  'Boissons': 'bg-blue-50 border-blue-200 text-blue-700',
  'Vins': 'bg-purple-50 border-purple-200 text-purple-700',
  'Cocktails': 'bg-amber-50 border-amber-200 text-amber-700',
}

export default function Menu() {
  const menuItems = useStore((s) => s.menuItems)
  const addMenuItem = useStore((s) => s.addMenuItem)
  const updateMenuItem = useStore((s) => s.updateMenuItem)
  const deleteMenuItem = useStore((s) => s.deleteMenuItem)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewMode] = useState<'table' | 'cards'>('table')

  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formCategory, setFormCategory] = useState<MenuCategory>('Plats')
  const [formAvailable, setFormAvailable] = useState(true)
  const [formAllergens, setFormAllergens] = useState('')

  const filtered = menuItems.filter((m) => {
    const matchSearch = search === '' || m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === 'all' || m.category === filterCategory
    return matchSearch && matchCat
  })

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter((m) => m.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {} as Record<string, MenuItem[]>)

  function openAdd() {
    setEditItem(null)
    setFormName(''); setFormDescription(''); setFormPrice(''); setFormCategory('Plats'); setFormAvailable(true); setFormAllergens('')
    setModalOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditItem(item)
    setFormName(item.name); setFormDescription(item.description); setFormPrice(String(item.price))
    setFormCategory(item.category); setFormAvailable(item.available); setFormAllergens((item.allergens || []).join(', '))
    setModalOpen(true)
  }

  function handleSave() {
    if (!formName || !formPrice) return
    const data: Omit<MenuItem, 'id'> = {
      name: formName, description: formDescription,
      price: parseFloat(formPrice), category: formCategory,
      available: formAvailable,
      allergens: formAllergens ? formAllergens.split(',').map((a) => a.trim()).filter(Boolean) : [],
    }
    if (editItem) {
      updateMenuItem(editItem.id, data)
    } else {
      addMenuItem({ id: uuidv4(), ...data })
    }
    setModalOpen(false)
  }

  return (
    <div>
      <Header title="Menu" subtitle="Gestion des plats et boissons" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Rechercher un plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field sm:w-44" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">Toutes catégories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn-primary" onClick={openAdd}><Plus size={16} />Nouveau plat</button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-wrap mb-5">
          {CATEGORIES.map((cat) => {
            const count = menuItems.filter((m) => m.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : `${categoryColors[cat]} hover:opacity-80`
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>

        {/* Content by category */}
        {viewMode === 'table' ? (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="card p-0 overflow-hidden">
                <div className={`px-5 py-3 border-b border-gray-100 flex items-center justify-between`}>
                  <h3 className="text-sm font-semibold text-gray-800">{cat}</h3>
                  <span className="text-xs text-gray-400">{items.length} article(s)</span>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="table-th">Nom</th>
                      <th className="table-th hidden md:table-cell">Description</th>
                      <th className="table-th">Prix</th>
                      <th className="table-th hidden sm:table-cell">Allergènes</th>
                      <th className="table-th">Dispo</th>
                      <th className="table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="table-row">
                        <td className="table-td font-medium text-gray-900">{item.name}</td>
                        <td className="table-td text-gray-500 text-xs hidden md:table-cell max-w-xs truncate">{item.description}</td>
                        <td className="table-td font-semibold text-indigo-700">{item.price.toFixed(2)} €</td>
                        <td className="table-td hidden sm:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {(item.allergens || []).map((a) => (
                              <span key={a} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">{a}</span>
                            ))}
                          </div>
                        </td>
                        <td className="table-td">
                          <button
                            onClick={() => updateMenuItem(item.id, { available: !item.available })}
                            className={`flex items-center gap-1 text-xs font-medium ${item.available ? 'text-emerald-600' : 'text-gray-400'}`}
                          >
                            {item.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            {item.available ? 'Dispo' : 'Indispo'}
                          </button>
                        </td>
                        <td className="table-td">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                              <Edit2 size={14} />
                            </button>
                            {deleteConfirm === item.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => { deleteMenuItem(item.id); setDeleteConfirm(null) }} className="text-xs text-red-600 font-medium hover:underline">Oui</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:underline">Non</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            {Object.keys(grouped).length === 0 && (
              <div className="card text-center py-12 text-gray-400">Aucun article trouvé</div>
            )}
          </div>
        ) : null}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Modifier le plat' : 'Nouveau plat'}>
        <div className="space-y-4">
          <div>
            <label className="label">Nom du plat *</label>
            <input className="input-field" placeholder="Ex: Magret de canard" value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field resize-none h-20" placeholder="Ingrédients, préparation..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prix (€) *</label>
              <input className="input-field" type="number" step="0.01" min="0" placeholder="0.00" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
            </div>
            <div>
              <label className="label">Catégorie</label>
              <select className="input-field" value={formCategory} onChange={(e) => setFormCategory(e.target.value as MenuCategory)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Allergènes (séparés par virgule)</label>
            <input className="input-field" placeholder="Gluten, Lait, Œufs..." value={formAllergens} onChange={(e) => setFormAllergens(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormAvailable(!formAvailable)}
              className={`flex items-center gap-2 text-sm font-medium ${formAvailable ? 'text-emerald-600' : 'text-gray-400'}`}
            >
              {formAvailable ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              {formAvailable ? 'Disponible' : 'Non disponible'}
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary flex-1 justify-center" onClick={handleSave} disabled={!formName || !formPrice}>
              {editItem ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
