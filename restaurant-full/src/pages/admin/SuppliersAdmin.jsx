import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, Phone, Mail, MapPin, Package } from 'lucide-react'

const CATEGORIES = ["Viandes & Charcuterie", "Poissons & Fruits de mer", "Fruits & Légumes", "Produits laitiers", "Vins & Alcools", "Épicerie & Condiments", "Boulangerie & Pâtisserie", "Autre"]

const EMPTY = { name: '', contact: '', phone: '', email: '', category: CATEGORIES[0], address: '', notes: '', active: true }

function SupplierCard({ supplier, onUpdate, onDelete, stockItems }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...supplier })
  const relatedStock = stockItems.filter(s => s.supplierId === supplier.id)

  const save = () => { onUpdate(supplier.id, form); setEditing(false) }

  if (editing) {
    return (
      <div className="p-5 rounded-2xl space-y-3" style={{ backgroundColor: '#FFFBEB', border: '2px solid #FCD34D' }}>
        <div className="grid grid-cols-2 gap-3">
          {[['Nom du fournisseur *', 'name'], ['Contact', 'contact'], ['Téléphone', 'phone'], ['Email', 'email'], ['Adresse', 'address']].map(([label, field]) => (
            <div key={field} className={field === 'address' ? 'col-span-2' : ''}>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>{label}</label>
              <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Catégorie</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={2} className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
            <span className="text-sm" style={{ color: '#44403C' }}>Fournisseur actif</span>
          </label>
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
            <button onClick={save} className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
              <Check size={14} className="inline mr-1" />Enregistrer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl group transition-all hover:shadow-md" style={{ backgroundColor: 'white', border: `1px solid ${supplier.active ? '#E5E7EB' : '#F3F4F6'}`, opacity: supplier.active ? 1 : 0.6 }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: '#FEF3C7' }}>🏪</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>{supplier.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>{supplier.category}</span>
              {!supplier.active && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>Inactif</span>}
            </div>
            <p className="text-sm font-medium mt-0.5" style={{ color: '#78716C' }}>{supplier.contact}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {supplier.phone && <span className="text-xs flex items-center gap-1" style={{ color: '#9CA3AF' }}><Phone size={11} />{supplier.phone}</span>}
              {supplier.email && <span className="text-xs flex items-center gap-1" style={{ color: '#9CA3AF' }}><Mail size={11} />{supplier.email}</span>}
              {supplier.address && <span className="text-xs flex items-center gap-1" style={{ color: '#9CA3AF' }}><MapPin size={11} />{supplier.address}</span>}
            </div>
            {supplier.notes && <p className="text-xs mt-2 italic" style={{ color: '#9CA3AF' }}>💬 {supplier.notes}</p>}
            {relatedStock.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {relatedStock.map(s => (
                  <span key={s.id} className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: '#ECFDF5', color: '#065F46' }}>
                    <Package size={10} />{s.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => setEditing(true)} className="p-2 rounded-lg hover:bg-amber-50" style={{ color: '#9CA3AF' }}><Edit2 size={15} /></button>
          <button onClick={() => onDelete(supplier.id)} className="p-2 rounded-lg hover:text-red-500" style={{ color: '#9CA3AF' }}><Trash2 size={15} /></button>
        </div>
      </div>
    </div>
  )
}

export default function SuppliersAdmin() {
  const { data, addSupplier, updateSupplier, deleteSupplier } = useStore()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [filter, setFilter] = useState('all')

  const filtered = data.suppliers.filter(s => filter === 'all' ? true : filter === 'active' ? s.active : !s.active)

  const create = () => {
    if (!form.name.trim()) return
    addSupplier(form)
    setForm({ ...EMPTY }); setAdding(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Fournisseurs</h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{data.suppliers.filter(s => s.active).length} fournisseur(s) actif(s)</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: '#D97706', color: 'white' }}>
          <Plus size={16} />Nouveau fournisseur
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {[['all', 'Tous'], ['active', 'Actifs'], ['inactive', 'Inactifs']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={filter === v ? { backgroundColor: '#D97706', color: 'white' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>{l}</button>
        ))}
      </div>

      {adding && (
        <div className="mb-5 p-5 rounded-2xl space-y-3" style={{ backgroundColor: '#FFFBEB', border: '2px dashed #FCD34D' }}>
          <h3 className="font-semibold" style={{ color: '#92400E' }}>Nouveau fournisseur</h3>
          <div className="grid grid-cols-2 gap-3">
            {[['Nom *', 'name'], ['Contact', 'contact'], ['Téléphone', 'phone'], ['Email', 'email']].map(([label, field]) => (
              <div key={field}>
                <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>{label}</label>
                <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} autoFocus={field === 'name'}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Catégorie</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Adresse</label>
              <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Notes / conditions de livraison</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={2} className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setAdding(false); setForm({ ...EMPTY }) }} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
            <button onClick={create} className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
              <Plus size={14} className="inline mr-1" />Ajouter
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(s => <SupplierCard key={s.id} supplier={s} onUpdate={updateSupplier} onDelete={deleteSupplier} stockItems={data.stock} />)}
      </div>
    </div>
  )
}
