import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, AlertTriangle, Minus } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }
const CATS = ['Viande', 'Boulangerie', 'Épicerie', 'Légumes', 'Sauces', 'Crémerie', 'Boissons', 'Emballages', 'Autre']

function StockForm({ initial = {}, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', category: 'Viande', quantity: '', unit: '', minThreshold: '', costPerUnit: '', ...initial })
  return (
    <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: '#111827', border: '1px solid #374151' }}>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Nom *</label><input style={INPUT} value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} /></div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Catégorie</label>
          <select style={INPUT} value={f.category} onChange={e => setF(p => ({ ...p, category: e.target.value }))}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Quantité</label><input type="number" style={INPUT} value={f.quantity} onChange={e => setF(p => ({ ...p, quantity: e.target.value }))} /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Unité</label><input style={INPUT} value={f.unit} onChange={e => setF(p => ({ ...p, unit: e.target.value }))} placeholder="pcs, kg, L..." /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Seuil mini</label><input type="number" style={INPUT} value={f.minThreshold} onChange={e => setF(p => ({ ...p, minThreshold: e.target.value }))} /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Coût/unité €</label><input type="number" step="0.01" style={INPUT} value={f.costPerUnit} onChange={e => setF(p => ({ ...p, costPerUnit: e.target.value }))} /></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ ...f, quantity: parseFloat(f.quantity)||0, minThreshold: parseFloat(f.minThreshold)||0, costPerUnit: parseFloat(f.costPerUnit)||0 })} className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}><Check size={13} /> Enregistrer</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
      </div>
    </div>
  )
}

export default function StockAdmin() {
  const { data, addStockItem, updateStockItem, deleteStockItem, adjustStock } = useStore()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState('all')

  const items = data.stock || []
  const alerts = items.filter(s => s.quantity <= s.minThreshold)
  const filtered = filter === 'alert' ? alerts : filter !== 'all' ? items.filter(s => s.category === filter) : items
  const cats = [...new Set(items.map(s => s.category))]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock</h1>
          {alerts.length > 0 && <p className="text-sm mt-1 flex items-center gap-1" style={{ color: '#F59E0B' }}><AlertTriangle size={14} /> {alerts.length} article(s) sous le seuil</p>}
        </div>
        <button onClick={() => setAdding(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter('all')} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: filter === 'all' ? '#E11D48' : '#1F2937', color: filter === 'all' ? 'white' : '#9CA3AF', border: '1px solid #374151' }}>Tout ({items.length})</button>
        {alerts.length > 0 && <button onClick={() => setFilter('alert')} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: filter === 'alert' ? '#F59E0B' : '#1F2937', color: filter === 'alert' ? 'white' : '#F59E0B', border: '1px solid #374151' }}>Alertes ({alerts.length})</button>}
        {cats.map(c => <button key={c} onClick={() => setFilter(c)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: filter === c ? '#374151' : '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }}>{c}</button>)}
      </div>

      {adding && <div className="mb-4"><StockForm onSave={(d) => { addStockItem(d); setAdding(false) }} onCancel={() => setAdding(false)} /></div>}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
        {filtered.map((item, idx) => (
          <div key={item.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #374151' : 'none' }}>
            {editing === item.id ? (
              <div className="p-3"><StockForm initial={item} onSave={(d) => { updateStockItem(item.id, d); setEditing(null) }} onCancel={() => setEditing(null)} /></div>
            ) : (
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0`} style={{ backgroundColor: item.quantity === 0 ? '#EF4444' : item.quantity <= item.minThreshold ? '#F59E0B' : '#10B981' }} />
                  <div>
                    <span className="font-semibold text-sm text-white">{item.name}</span>
                    <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>{item.category}</span>
                    <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Seuil min: {item.minThreshold} {item.unit} · {item.costPerUnit}€/unité</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustStock(item.id, -1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Minus size={12} /></button>
                    <span className="font-bold w-16 text-center" style={{ color: item.quantity <= item.minThreshold ? '#F59E0B' : 'white' }}>{item.quantity} {item.unit}</span>
                    <button onClick={() => adjustStock(item.id, 1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Plus size={12} /></button>
                  </div>
                  <button onClick={() => setEditing(item.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                  <button onClick={() => { if (window.confirm('Supprimer ?')) deleteStockItem(item.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-10" style={{ color: '#6B7280' }}><p className="text-sm">Aucun article</p></div>}
      </div>
    </div>
  )
}
