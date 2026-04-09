import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Pencil, Trash2, Search, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react'

const CATEGORIES = ['Viandes', 'Poissons', 'Legumes', 'Fruits', 'Produits laitiers', 'Boissons', 'Epicerie', 'Autre']

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

function StockForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: '', category: 'Legumes', quantity: 0, unit: 'kg', minStock: 1, costPerUnit: 0 })
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, quantity: Number(form.quantity), minStock: Number(form.minStock), costPerUnit: Number(form.costPerUnit) }) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'article *</label>
        <input className={inputCls} value={form.name} onChange={f('name')} required placeholder="Ex: Boeuf entrecote" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
          <select className={inputCls} value={form.category} onChange={f('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unite</label>
          <input className={inputCls} value={form.unit} onChange={f('unit')} placeholder="kg, L, pieces..." />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantite</label>
          <input className={inputCls} type="number" step="0.1" min="0" value={form.quantity} onChange={f('quantity')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock min.</label>
          <input className={inputCls} type="number" step="0.1" min="0" value={form.minStock} onChange={f('minStock')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cout/unite</label>
          <input className={inputCls} type="number" step="0.01" min="0" value={form.costPerUnit} onChange={f('costPerUnit')} />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Enregistrer</button>
      </div>
    </form>
  )
}

export default function Stock() {
  const { stock, addStockItem, updateStockItem, deleteStockItem, adjustStock } = useStore()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('Tous')
  const [showLowOnly, setShowLowOnly] = useState(false)

  const lowStockItems = stock.filter((i) => i.quantity <= i.minStock)

  const filtered = stock.filter((i) => {
    const matchCat = catFilter === 'Tous' || i.category === catFilter
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase())
    const matchLow = !showLowOnly || i.quantity <= i.minStock
    return matchCat && matchSearch && matchLow
  })

  const handleSave = (form) => {
    if (modal === 'add') addStockItem(form)
    else updateStockItem(modal.id, form)
    setModal(null)
  }

  const totalValue = stock.reduce((a, i) => a + i.quantity * i.costPerUnit, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventaire / Stocks</h1>
          <p className="text-gray-500 text-sm">{stock.length} articles en stock</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
          <Plus size={16} /> Ajouter un article
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Valeur totale stock</p>
          <p className="text-xl font-bold text-gray-900">{totalValue.toFixed(2)} EUR</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Articles en stock</p>
          <p className="text-xl font-bold text-orange-600">{stock.length}</p>
        </div>
        <div className={`rounded-xl shadow-sm p-4 ${lowStockItems.length > 0 ? 'bg-red-50' : 'bg-white'}`}>
          <p className="text-xs text-gray-500 mb-1">Alertes rupture</p>
          <p className={`text-xl font-bold ${lowStockItems.length > 0 ? 'text-red-600' : 'text-green-600'}`}>{lowStockItems.length}</p>
          {lowStockItems.length > 0 && <p className="text-xs text-red-500">Stock bas !</p>}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Categories</p>
          <p className="text-xl font-bold text-blue-600">{new Set(stock.map((i) => i.category)).size}</p>
        </div>
      </div>

      {/* Alert banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">Attention : {lowStockItems.length} article(s) en rupture de stock</p>
            <p className="text-xs text-red-600 mt-1">
              {lowStockItems.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(' / ')}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowLowOnly(!showLowOnly)} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${showLowOnly ? 'bg-red-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
          <AlertTriangle size={12} /> Stock bas
        </button>
        {['Tous', ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${catFilter === c ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{c}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Article</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Categorie</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Quantite</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Min.</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Cout unit.</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Valeur</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Aucun article</td></tr>
            )}
            {filtered.map((item) => {
              const isLow = item.quantity <= item.minStock
              return (
                <tr key={item.id} className={`border-b last:border-0 hover:bg-gray-50 ${isLow ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isLow && <AlertTriangle size={14} className="text-red-500" />}
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">{item.category}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => adjustStock(item.id, -1)} className="p-1 hover:bg-gray-200 rounded text-red-500"><TrendingDown size={14} /></button>
                      <span className={`font-bold min-w-8 text-center ${isLow ? 'text-red-600' : 'text-gray-900'}`}>{item.quantity}</span>
                      <button onClick={() => adjustStock(item.id, 1)} className="p-1 hover:bg-gray-200 rounded text-green-500"><TrendingUp size={14} /></button>
                      <span className="text-xs text-gray-400">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">{item.minStock} {item.unit}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{item.costPerUnit.toFixed(2)} EUR</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{(item.quantity * item.costPerUnit).toFixed(2)} EUR</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setModal(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></button>
                      <button onClick={() => deleteStockItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Nouvel article' : 'Modifier l\'article'} onClose={() => setModal(null)}>
          <StockForm item={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
