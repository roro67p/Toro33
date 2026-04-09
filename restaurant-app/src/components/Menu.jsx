import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react'

const CATEGORIES = ['Entrees', 'Plats', 'Desserts', 'Boissons', 'Autre']

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function ItemForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: '', category: 'Plats', price: '', description: '' })
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat *</label>
        <input className={inputCls} value={form.name} onChange={f('name')} required placeholder="Ex: Steak frites" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
          <select className={inputCls} value={form.category} onChange={f('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (EUR) *</label>
          <input className={inputCls} type="number" step="0.01" min="0" value={form.price} onChange={f('price')} required placeholder="0.00" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea className={inputCls} rows={2} value={form.description} onChange={f('description')} placeholder="Ingredients, allergenes..." />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">Enregistrer</button>
      </div>
    </form>
  )
}

export default function MenuPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = useStore()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('Tous')

  const filtered = menuItems.filter((m) => {
    const matchCat = catFilter === 'Tous' || m.category === catFilter
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleSave = (form) => {
    if (modal === 'add') addMenuItem(form)
    else updateMenuItem(modal.id, form)
    setModal(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-500 text-sm">{menuItems.length} article(s) au total</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {['Tous', ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${catFilter === c ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{c}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Plat</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Categorie</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Prix</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Dispo</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Aucun article trouve</td></tr>
            )}
            {filtered.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-gray-400 text-xs">{item.description}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{item.category}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{Number(item.price).toFixed(2)} EUR</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleAvailability(item.id)} className="text-gray-400 hover:text-amber-500 transition-colors">
                    {item.available ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setModal(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></button>
                    <button onClick={() => deleteMenuItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Ajouter un article' : 'Modifier l\'article'} onClose={() => setModal(null)}>
          <ItemForm item={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
