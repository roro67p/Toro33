import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, ShoppingCart } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }
const CATS = ['Viande', 'Boulangerie', 'Épicerie', 'Légumes', 'Sauces', 'Crémerie', 'Boissons', 'Emballages', 'Autre']

function CatalogItemForm({ initial = {}, suppliers, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', supplierId: suppliers[0]?.id || '', unit: '', price: '', category: 'Viande', ...initial })
  return (
    <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom produit *</label><input style={INPUT} value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} /></div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Fournisseur</label>
          <select style={INPUT} value={f.supplierId} onChange={e => setF(p => ({ ...p, supplierId: e.target.value }))}>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Catégorie</label>
          <select style={INPUT} value={f.category} onChange={e => setF(p => ({ ...p, category: e.target.value }))}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Unité</label><input style={INPUT} value={f.unit} onChange={e => setF(p => ({ ...p, unit: e.target.value }))} placeholder="carton, kg, sac..." /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Prix unitaire (€)</label><input type="number" step="0.01" style={INPUT} value={f.price} onChange={e => setF(p => ({ ...p, price: e.target.value }))} /></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, price: parseFloat(f.price)||0 })} className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}><Check size={13} /> Enregistrer</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
      </div>
    </div>
  )
}

export default function CatalogAdmin() {
  const { data, addCatalogItem, updateCatalogItem, deleteCatalogItem } = useStore()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [filterSup, setFilterSup] = useState('all')
  const [filterCat, setFilterCat] = useState('all')

  const catalog = data.supplierCatalog || []
  const suppliers = data.suppliers || []

  const filtered = catalog.filter(item => {
    if (filterSup !== 'all' && item.supplierId !== filterSup) return false
    if (filterCat !== 'all' && item.category !== filterCat) return false
    return true
  })

  const supName = (id) => suppliers.find(s => s.id === id)?.name || id
  const cats = [...new Set(catalog.map(i => i.category))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Catalogue fournisseurs</h1>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{catalog.length} produits référencés</p>
        </div>
        <button onClick={() => setAdding(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Ajouter produit
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilterSup('all')} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: filterSup === 'all' ? '#E11D48' : '#1F2937', color: filterSup === 'all' ? 'white' : '#9CA3AF', border: '1px solid #374151' }}>Tous fournisseurs</button>
        {suppliers.map(s => (
          <button key={s.id} onClick={() => setFilterSup(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: filterSup === s.id ? '#374151' : '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }}>{s.name}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilterCat('all')} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: filterCat === 'all' ? '#374151' : '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }}>Toutes catégories</button>
        {cats.map(c => <button key={c} onClick={() => setFilterCat(c)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: filterCat === c ? '#374151' : '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }}>{c}</button>)}
      </div>

      {adding && <div className="mb-4"><CatalogItemForm suppliers={suppliers} onSave={(d) => { addCatalogItem(d); setAdding(false) }} onCancel={() => setAdding(false)} /></div>}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
        {filtered.map((item, idx) => (
          <div key={item.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #374151' : 'none' }}>
            {editing === item.id ? (
              <div className="p-3"><CatalogItemForm initial={item} suppliers={suppliers} onSave={(d) => { updateCatalogItem(item.id, d); setEditing(null) }} onCancel={() => setEditing(null)} /></div>
            ) : (
              <div className="flex items-center justify-between px-5 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{item.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>{item.category}</span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{supName(item.supplierId)} · {item.unit}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold" style={{ color: '#E11D48' }}>{item.price.toFixed(2)}€ / {item.unit}</span>
                  <button onClick={() => setEditing(item.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                  <button onClick={() => { if (window.confirm('Supprimer ?')) deleteCatalogItem(item.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-10" style={{ color: '#6B7280' }}><p className="text-sm">Aucun produit</p></div>}
      </div>
    </div>
  )
}
