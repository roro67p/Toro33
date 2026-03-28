import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, AlertTriangle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { useStore } from '../store/useStore'
import { StockItem, StockUnit } from '../types'

const UNITS: StockUnit[] = ['kg', 'L', 'unités', 'boîtes', 'bouteilles', 'g']
const STOCK_CATEGORIES = ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Vins', 'Spiritueux', 'Épicerie', 'Produits laitiers', 'Boissons']

export default function Stock() {
  const stockItems = useStore((s) => s.stockItems)
  const suppliers = useStore((s) => s.suppliers)
  const addStockItem = useStore((s) => s.addStockItem)
  const updateStockItem = useStore((s) => s.updateStockItem)
  const deleteStockItem = useStore((s) => s.deleteStockItem)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterAlert, setFilterAlert] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<StockItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formName, setFormName] = useState('')
  const [formQuantity, setFormQuantity] = useState('')
  const [formUnit, setFormUnit] = useState<StockUnit>('kg')
  const [formMinLevel, setFormMinLevel] = useState('')
  const [formSupplierId, setFormSupplierId] = useState('')
  const [formUnitPrice, setFormUnitPrice] = useState('')
  const [formCategory, setFormCategory] = useState('Épicerie')

  const filtered = stockItems.filter((s) => {
    const matchSearch = search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.supplierName.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === 'all' || s.category === filterCategory
    const matchAlert = !filterAlert || s.quantity <= s.minLevel
    return matchSearch && matchCat && matchAlert
  })

  const lowStockItems = stockItems.filter((s) => s.quantity <= s.minLevel)

  function openAdd() {
    setEditItem(null)
    setFormName(''); setFormQuantity('0'); setFormUnit('kg'); setFormMinLevel('5')
    setFormSupplierId(suppliers[0]?.id || ''); setFormUnitPrice('0'); setFormCategory('Épicerie')
    setModalOpen(true)
  }

  function openEdit(item: StockItem) {
    setEditItem(item)
    setFormName(item.name); setFormQuantity(String(item.quantity)); setFormUnit(item.unit)
    setFormMinLevel(String(item.minLevel)); setFormSupplierId(item.supplierId)
    setFormUnitPrice(String(item.unitPrice)); setFormCategory(item.category)
    setModalOpen(true)
  }

  function handleSave() {
    if (!formName) return
    const supplier = suppliers.find((s) => s.id === formSupplierId)
    const now = new Date().toISOString().split('T')[0]
    if (editItem) {
      updateStockItem(editItem.id, {
        name: formName, quantity: parseFloat(formQuantity) || 0,
        unit: formUnit, minLevel: parseFloat(formMinLevel) || 0,
        supplierId: formSupplierId, supplierName: supplier?.name || '',
        unitPrice: parseFloat(formUnitPrice) || 0, category: formCategory, lastUpdated: now,
      })
    } else {
      addStockItem({
        id: uuidv4(), name: formName, quantity: parseFloat(formQuantity) || 0,
        unit: formUnit, minLevel: parseFloat(formMinLevel) || 0,
        supplierId: formSupplierId, supplierName: supplier?.name || '',
        unitPrice: parseFloat(formUnitPrice) || 0, category: formCategory, lastUpdated: now,
      })
    }
    setModalOpen(false)
  }

  function getStockLevel(item: StockItem): 'critical' | 'low' | 'ok' {
    if (item.quantity === 0) return 'critical'
    if (item.quantity <= item.minLevel) return 'low'
    return 'ok'
  }

  const totalStockValue = stockItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0)

  return (
    <div>
      <Header title="Stock" subtitle="Gestion des stocks et inventaire" />
      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-indigo-600">{stockItems.length}</p>
            <p className="text-xs text-gray-500 mt-1">Références</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-red-500">{lowStockItems.length}</p>
            <p className="text-xs text-gray-500 mt-1">Alertes stock</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-amber-500">{stockItems.filter((s) => s.quantity === 0).length}</p>
            <p className="text-xs text-gray-500 mt-1">En rupture</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-xl font-bold text-emerald-600">{totalStockValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
            <p className="text-xs text-gray-500 mt-1">Valeur totale</p>
          </div>
        </div>

        {/* Low stock alert banner */}
        {lowStockItems.length > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              <span className="font-semibold">{lowStockItems.length} produit(s)</span> en dessous du seuil minimum :
              {' '}{lowStockItems.slice(0, 3).map((i) => i.name).join(', ')}{lowStockItems.length > 3 ? '...' : ''}
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field sm:w-44" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">Toutes catégories</option>
            {STOCK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={() => setFilterAlert(!filterAlert)}
            className={`px-3 py-2 text-sm rounded-lg border font-medium transition-colors flex items-center gap-2 ${
              filterAlert
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <AlertTriangle size={14} />
            Alertes seulement
          </button>
          <button className="btn-primary" onClick={openAdd}><Plus size={16} />Nouveau produit</button>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-th">Produit</th>
                <th className="table-th">Catégorie</th>
                <th className="table-th">Quantité</th>
                <th className="table-th">Seuil min.</th>
                <th className="table-th">Niveau</th>
                <th className="table-th hidden md:table-cell">Fournisseur</th>
                <th className="table-th hidden lg:table-cell">Prix unitaire</th>
                <th className="table-th hidden lg:table-cell">Mis à jour</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="table-td text-center text-gray-400 py-8">Aucun produit trouvé</td></tr>
              )}
              {filtered.map((item) => {
                const level = getStockLevel(item)
                return (
                  <tr key={item.id} className={`table-row ${level === 'critical' ? 'bg-red-50/50' : level === 'low' ? 'bg-amber-50/50' : ''}`}>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        {level !== 'ok' && <AlertTriangle size={13} className={level === 'critical' ? 'text-red-500' : 'text-amber-500'} />}
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="table-td text-gray-500 text-xs">{item.category}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={item.quantity}
                          min="0"
                          step="0.1"
                          onChange={(e) => updateStockItem(item.id, { quantity: parseFloat(e.target.value) || 0, lastUpdated: new Date().toISOString().split('T')[0] })}
                        />
                        <span className="text-xs text-gray-500">{item.unit}</span>
                      </div>
                    </td>
                    <td className="table-td text-gray-500">{item.minLevel} {item.unit}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-1.5">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              level === 'critical' ? 'bg-red-500'
                              : level === 'low' ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (item.quantity / (item.minLevel * 2)) * 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          level === 'critical' ? 'text-red-600'
                          : level === 'low' ? 'text-amber-600'
                          : 'text-emerald-600'
                        }`}>
                          {level === 'critical' ? 'Rupture' : level === 'low' ? 'Bas' : 'OK'}
                        </span>
                      </div>
                    </td>
                    <td className="table-td text-xs text-gray-500 hidden md:table-cell">{item.supplierName}</td>
                    <td className="table-td font-medium hidden lg:table-cell">{item.unitPrice.toFixed(2)} €/{item.unit}</td>
                    <td className="table-td text-xs text-gray-400 hidden lg:table-cell">
                      {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="table-td">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit2 size={14} />
                        </button>
                        {deleteConfirm === item.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => { deleteStockItem(item.id); setDeleteConfirm(null) }} className="text-xs text-red-600 font-medium hover:underline">Oui</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:underline">Non</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Modifier le produit' : 'Nouveau produit'}>
        <div className="space-y-4">
          <div>
            <label className="label">Nom du produit *</label>
            <input className="input-field" placeholder="Ex: Côte de bœuf" value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Catégorie</label>
              <select className="input-field" value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                {STOCK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Unité</label>
              <select className="input-field" value={formUnit} onChange={(e) => setFormUnit(e.target.value as StockUnit)}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Quantité actuelle</label>
              <input className="input-field" type="number" min="0" step="0.1" value={formQuantity} onChange={(e) => setFormQuantity(e.target.value)} />
            </div>
            <div>
              <label className="label">Seuil minimum</label>
              <input className="input-field" type="number" min="0" step="0.1" value={formMinLevel} onChange={(e) => setFormMinLevel(e.target.value)} />
            </div>
            <div>
              <label className="label">Prix unitaire (€)</label>
              <input className="input-field" type="number" min="0" step="0.01" value={formUnitPrice} onChange={(e) => setFormUnitPrice(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Fournisseur</label>
            <select className="input-field" value={formSupplierId} onChange={(e) => setFormSupplierId(e.target.value)}>
              <option value="">Aucun fournisseur</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary flex-1 justify-center" onClick={handleSave} disabled={!formName}>
              {editItem ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
