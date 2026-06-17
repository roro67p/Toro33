import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, AlertTriangle, Minus, Package } from 'lucide-react'

const UNITS = ["kg", "L", "pièces", "boîtes", "bouteilles", "sachets", "litres", "grammes"]
const EMPTY = { name: '', supplierId: '', category: '', unit: 'kg', quantity: 0, minThreshold: 1, costPrice: 0 }

function StockRow({ item, suppliers, onUpdate, onDelete, onAdjust }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...item, quantity: item.quantity.toString(), minThreshold: item.minThreshold.toString(), costPrice: item.costPrice.toString() })
  const [adjustVal, setAdjustVal] = useState('')
  const [adjustMode, setAdjustMode] = useState(false)

  const isLow = item.quantity <= item.minThreshold
  const isOut = item.quantity === 0
  const supplier = suppliers.find(s => s.id === item.supplierId)

  const save = () => {
    onUpdate(item.id, { ...form, quantity: parseFloat(form.quantity) || 0, minThreshold: parseFloat(form.minThreshold) || 0, costPrice: parseFloat(form.costPrice) || 0 })
    setEditing(false)
  }

  const applyAdjust = (sign) => {
    const val = parseFloat(adjustVal)
    if (!isNaN(val) && val > 0) { onAdjust(item.id, sign * val); setAdjustVal(''); setAdjustMode(false) }
  }

  if (editing) {
    return (
      <tr style={{ backgroundColor: '#FFFBEB' }}>
        <td colSpan={8} style={{ padding: '12px 16px' }}>
          <div className="grid grid-cols-3 gap-3">
            {[['Nom *', 'name', 'text'], ['Catégorie', 'category', 'text'], ['Prix unitaire (€)', 'costPrice', 'number']].map(([label, field, type]) => (
              <div key={field}>
                <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>{label}</label>
                <input type={type} step="0.01" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Fournisseur</label>
              <select value={form.supplierId} onChange={e => setForm(p => ({ ...p, supplierId: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                <option value="">— Aucun —</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Unité</label>
              <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Seuil alerte</label>
              <input type="number" step="0.1" value={form.minThreshold} onChange={e => setForm(p => ({ ...p, minThreshold: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
            <button onClick={save} className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
              <Check size={14} className="inline mr-1" />Enregistrer
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="group transition-colors hover:bg-amber-50/30" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <td style={{ padding: '12px 16px' }}>
        <div className="flex items-center gap-2">
          {isOut ? <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> : isLow ? <AlertTriangle size={14} className="text-amber-500" /> : <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />}
          <span className="font-medium text-sm" style={{ color: '#1C1917' }}>{item.name}</span>
        </div>
        {item.category && <span className="text-xs" style={{ color: '#9CA3AF' }}>{item.category}</span>}
      </td>
      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>{supplier?.name || '—'}</span>
      </td>
      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
        {adjustMode ? (
          <div className="flex items-center gap-1">
            <input type="number" value={adjustVal} onChange={e => setAdjustVal(e.target.value)} min="0" step="0.1"
              className="w-16 px-2 py-1 rounded-lg border text-xs text-center outline-none" style={{ borderColor: '#D97706' }} autoFocus
              onKeyDown={e => { if (e.key === 'Enter') applyAdjust(1); if (e.key === 'Escape') setAdjustMode(false) }} />
            <button onClick={() => applyAdjust(1)} className="p-1 rounded" style={{ color: '#16a34a' }} title="+"><Plus size={12} /></button>
            <button onClick={() => applyAdjust(-1)} className="p-1 rounded" style={{ color: '#dc2626' }} title="-"><Minus size={12} /></button>
            <button onClick={() => setAdjustMode(false)} className="p-1 rounded text-gray-400 text-xs">✕</button>
          </div>
        ) : (
          <button onClick={() => setAdjustMode(true)} className="font-bold text-sm px-2 py-0.5 rounded-lg transition-all hover:bg-amber-100"
            style={{ color: isOut ? '#DC2626' : isLow ? '#D97706' : '#16a34a' }}>
            {item.quantity} {item.unit}
          </button>
        )}
      </td>
      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px', color: '#9CA3AF' }}>{item.minThreshold} {item.unit}</td>
      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
        <span className="text-xs px-2 py-1 rounded-full font-medium"
          style={isOut ? { backgroundColor: '#FEE2E2', color: '#DC2626' } : isLow ? { backgroundColor: '#FEF3C7', color: '#D97706' } : { backgroundColor: '#D1FAE5', color: '#065F46' }}>
          {isOut ? '🔴 Épuisé' : isLow ? '🟡 Stock bas' : '🟢 OK'}
        </span>
      </td>
      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>{item.costPrice.toFixed(2)}€/{item.unit}</td>
      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', color: '#9CA3AF' }}>{item.lastUpdated}</td>
      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-center">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-amber-50" style={{ color: '#9CA3AF' }}><Edit2 size={13} /></button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:text-red-500" style={{ color: '#9CA3AF' }}><Trash2 size={13} /></button>
        </div>
      </td>
    </tr>
  )
}

export default function StockAdmin() {
  const { data, addStockItem, updateStockItem, deleteStockItem, adjustStock } = useStore()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const categories = [...new Set(data.stock.map(s => s.category).filter(Boolean))]
  const lowCount = data.stock.filter(s => s.quantity <= s.minThreshold).length

  const filtered = data.stock.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || s.category === catFilter || (catFilter === 'low' && s.quantity <= s.minThreshold)
    return matchSearch && matchCat
  })

  const create = () => {
    if (!form.name.trim()) return
    addStockItem({ ...form, quantity: parseFloat(form.quantity) || 0, minThreshold: parseFloat(form.minThreshold) || 0, costPrice: parseFloat(form.costPrice) || 0 })
    setForm({ ...EMPTY }); setAdding(false)
  }

  const totalValue = data.stock.reduce((sum, s) => sum + s.quantity * s.costPrice, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Gestion du stock</h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{data.stock.length} produit(s) · Valeur totale : <strong style={{ color: '#D97706' }}>{totalValue.toFixed(2)}€</strong></p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#D97706', color: 'white' }}>
          <Plus size={16} />Nouveau produit
        </button>
      </div>

      {/* Alertes */}
      {lowCount > 0 && (
        <div className="mb-4 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D' }}>
          <AlertTriangle size={18} style={{ color: '#D97706' }} />
          <span className="text-sm font-medium" style={{ color: '#92400E' }}>
            {lowCount} produit(s) en stock bas ou épuisé(s) — pensez à passer une commande !
          </span>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Produits OK', value: data.stock.filter(s => s.quantity > s.minThreshold).length, color: '#065F46', bg: '#D1FAE5' },
          { label: 'Stock bas', value: data.stock.filter(s => s.quantity > 0 && s.quantity <= s.minThreshold).length, color: '#92400E', bg: '#FEF3C7' },
          { label: 'Épuisés', value: data.stock.filter(s => s.quantity === 0).length, color: '#991B1B', bg: '#FEE2E2' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="p-4 rounded-xl text-center" style={{ backgroundColor: bg }}>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..."
          className="px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917', minWidth: '200px' }} />
        <div className="flex gap-2 flex-wrap">
          {[['all', 'Tous'], ['low', '⚠️ Stock bas'], ...categories.map(c => [c, c])].map(([v, l]) => (
            <button key={v} onClick={() => setCatFilter(v)} className="px-3 py-1.5 rounded-lg text-sm transition-all"
              style={catFilter === v ? { backgroundColor: '#D97706', color: 'white' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <div className="mb-4 p-4 rounded-2xl space-y-3" style={{ backgroundColor: '#FFFBEB', border: '2px dashed #FCD34D' }}>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Nom du produit *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoFocus
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <input placeholder="Catégorie" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <select value={form.supplierId} onChange={e => setForm(p => ({ ...p, supplierId: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
              <option value="">Fournisseur (optionnel)</option>
              {data.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="number" step="0.1" placeholder="Quantité" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
            <input type="number" step="0.1" placeholder="Seuil alerte" value={form.minThreshold} onChange={e => setForm(p => ({ ...p, minThreshold: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <input type="number" step="0.01" placeholder="Prix/unité (€)" value={form.costPrice} onChange={e => setForm(p => ({ ...p, costPrice: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setAdding(false); setForm({ ...EMPTY }) }} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
            <button onClick={create} className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>Ajouter</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                {['Produit', 'Fournisseur', 'Quantité', 'Seuil', 'Statut', 'Prix/unité', 'Màj', ''].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Produit' ? 'left' : 'center', fontSize: '12px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <StockRow key={item.id} item={item} suppliers={data.suppliers} onUpdate={updateStockItem} onDelete={deleteStockItem} onAdjust={adjustStock} />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                  <Package size={24} className="mx-auto mb-2 opacity-30" />Aucun produit trouvé
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
