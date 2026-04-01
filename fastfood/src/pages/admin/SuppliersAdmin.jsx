import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }
const CATS = ['Généraliste', 'Viande', 'Boulangerie', 'Épicerie', 'Boissons', 'Crémerie', 'Emballages', 'Autre']

function SupForm({ initial = {}, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', contact: '', phone: '', email: '', category: 'Généraliste', ...initial })
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
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Contact</label><input style={INPUT} value={f.contact} onChange={e => setF(p => ({ ...p, contact: e.target.value }))} /></div>
        <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Téléphone</label><input style={INPUT} value={f.phone} onChange={e => setF(p => ({ ...p, phone: e.target.value }))} /></div>
        <div className="col-span-2"><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Email</label><input style={INPUT} value={f.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))} /></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(f)} className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}><Check size={13} /> Enregistrer</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
      </div>
    </div>
  )
}

export default function SuppliersAdmin() {
  const { data, addSupplier, updateSupplier, deleteSupplier } = useStore()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const catalogCount = (supId) => (data.supplierCatalog || []).filter(i => i.supplierId === supId).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Fournisseurs</h1>
        <button onClick={() => setAdding(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {adding && <div className="mb-4"><SupForm onSave={(d) => { addSupplier(d); setAdding(false) }} onCancel={() => setAdding(false)} /></div>}

      <div className="space-y-3">
        {data.suppliers.map(sup => (
          <div key={sup.id}>
            {editing === sup.id ? (
              <SupForm initial={sup} onSave={(d) => { updateSupplier(sup.id, d); setEditing(null) }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: '#111827' }}>🏭</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{sup.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>{sup.category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#1F2937', color: '#6B7280', border: '1px solid #374151' }}>{catalogCount(sup.id)} produits</span>
                  </div>
                  <div className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>{sup.contact} · {sup.phone}</div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>{sup.email}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(sup.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                  <button onClick={() => { if (window.confirm('Supprimer ?')) deleteSupplier(sup.id) }} className="p-1.5 rounded-lg" style={{ backgroundColor: '#3F1212', color: '#EF4444' }}><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
