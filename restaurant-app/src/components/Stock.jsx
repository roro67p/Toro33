import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Pencil, Trash2, Search, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react'

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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

function StockForm({ item, fournisseurs, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: '', fournisseurId: fournisseurs[0]?.id || '', quantite: 0, unite: 'kg', seuilAlerte: 5, prixUnitaire: 0 })
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, fournisseurId: Number(form.fournisseurId), quantite: Number(form.quantite), seuilAlerte: Number(form.seuilAlerte), prixUnitaire: Number(form.prixUnitaire) }) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
        <input className={inputCls} value={form.name} onChange={f('name')} required placeholder="Ex: Steak (kg)" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
        <select className={inputCls} value={form.fournisseurId} onChange={f('fournisseurId')}>
          <option value="">-- Aucun --</option>
          {fournisseurs.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
          <input className={inputCls} type="number" min="0" step="0.1" value={form.quantite} onChange={f('quantite')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
          <select className={inputCls} value={form.unite} onChange={f('unite')}>
            {['kg', 'g', 'L', 'cl', 'pcs', 'btl', 'bte', 'sac'].map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alerte min.</label>
          <input className={inputCls} type="number" min="0" value={form.seuilAlerte} onChange={f('seuilAlerte')} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (€)</label>
        <input className={inputCls} type="number" min="0" step="0.01" value={form.prixUnitaire} onChange={f('prixUnitaire')} />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Enregistrer</button>
      </div>
    </form>
  )
}

export default function Stock() {
  const { stock, fournisseurs, addStockItem, updateStockItem, deleteStockItem, ajusterStock } = useStore()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Tous')

  const alerts = stock.filter((s) => s.quantite <= s.seuilAlerte)

  const filtered = stock.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Tous' || (filter === 'Alertes' && s.quantite <= s.seuilAlerte)
    return matchSearch && matchFilter
  })

  const handleSave = (form) => {
    if (modal === 'add') addStockItem(form)
    else updateStockItem(modal.id, form)
    setModal(null)
  }

  const getFournisseurName = (id) => fournisseurs.find((f) => f.id === id)?.name || '—'

  const valeurTotale = stock.reduce((acc, s) => acc + s.quantite * s.prixUnitaire, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock</h1>
          <p className="text-gray-500 text-sm">{stock.length} produit(s) — valeur : {valeurTotale.toFixed(2)} €</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
          <Plus size={16} /> Ajouter produit
        </button>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="font-semibold text-red-700 text-sm">{alerts.length} produit(s) en stock bas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alerts.map((s) => (
              <span key={s.id} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {s.name} : {s.quantite} {s.unite} (min. {s.seuilAlerte})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <Package size={20} className="mx-auto text-orange-500 mb-1" />
          <p className="text-xl font-bold text-gray-900">{stock.length}</p>
          <p className="text-xs text-gray-500">Produits</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <AlertTriangle size={20} className="mx-auto text-red-500 mb-1" />
          <p className="text-xl font-bold text-gray-900">{alerts.length}</p>
          <p className="text-xs text-gray-500">Alertes</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <TrendingUp size={20} className="mx-auto text-green-500 mb-1" />
          <p className="text-xl font-bold text-gray-900">{valeurTotale.toFixed(0)} €</p>
          <p className="text-xs text-gray-500">Valeur stock</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Rechercher un produit..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {['Tous', 'Alertes'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Produit</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Fournisseur</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Quantité</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Alerte</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Valeur</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">Aucun produit</td></tr>}
            {filtered.map((item) => {
              const isAlert = item.quantite <= item.seuilAlerte
              return (
                <tr key={item.id} className={`border-b last:border-0 ${isAlert ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isAlert && <AlertTriangle size={14} className="text-red-500 shrink-0" />}
                      <span className={`font-medium ${isAlert ? 'text-red-700' : 'text-gray-900'}`}>{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{getFournisseurName(item.fournisseurId)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => ajusterStock(item.id, -1)} className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 flex items-center justify-center text-xs font-bold">−</button>
                      <span className={`font-semibold w-12 text-center ${isAlert ? 'text-red-600' : 'text-gray-900'}`}>{item.quantite} {item.unite}</span>
                      <button onClick={() => ajusterStock(item.id, 1)} className="w-6 h-6 rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 flex items-center justify-center text-xs font-bold">+</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">{item.seuilAlerte} {item.unite}</td>
                  <td className="px-4 py-3 text-right text-gray-700 font-medium">{(item.quantite * item.prixUnitaire).toFixed(2)} €</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setModal(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => deleteStockItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Ajouter un produit' : 'Modifier le produit'} onClose={() => setModal(null)}>
          <StockForm item={modal !== 'add' ? modal : null} fournisseurs={fournisseurs} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
