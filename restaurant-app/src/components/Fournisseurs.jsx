import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Pencil, Trash2, Search, Truck, Phone, Mail, MapPin, Package } from 'lucide-react'

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function FournisseurForm({ fournisseur, onSave, onClose }) {
  const [form, setForm] = useState(fournisseur || { name: '', contact: '', phone: '', email: '', address: '', produits: '', delai: '48h', notes: '' })
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fournisseur *</label>
          <input className={inputCls} value={form.name} onChange={f('name')} required placeholder="Ex: Boucherie Centrale" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
          <input className={inputCls} value={form.contact} onChange={f('contact')} placeholder="Nom du responsable" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input className={inputCls} value={form.phone} onChange={f('phone')} placeholder="01 00 00 00 00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input className={inputCls} type="email" value={form.email} onChange={f('email')} placeholder="email@fournisseur.fr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Délai livraison</label>
          <select className={inputCls} value={form.delai} onChange={f('delai')}>
            {['24h', '48h', '72h', '1 semaine'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input className={inputCls} value={form.address} onChange={f('address')} placeholder="Rue, Ville" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Produits fournis</label>
          <input className={inputCls} value={form.produits} onChange={f('produits')} placeholder="Steak, Frites, Salade..." />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea className={inputCls} rows={2} value={form.notes} onChange={f('notes')} placeholder="Conditions de commande, remarques..." />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">Enregistrer</button>
      </div>
    </form>
  )
}

const DELAI_COLOR = { '24h': 'bg-green-100 text-green-700', '48h': 'bg-blue-100 text-blue-700', '72h': 'bg-amber-100 text-amber-700', '1 semaine': 'bg-red-100 text-red-700' }

export default function Fournisseurs({ setPage }) {
  const { fournisseurs, addFournisseur, updateFournisseur, deleteFournisseur, stock } = useStore()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = fournisseurs.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.produits || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (form) => {
    if (modal === 'add') addFournisseur(form)
    else updateFournisseur(modal.id, form)
    setModal(null)
  }

  const getStockCount = (fournisseurId) => stock.filter((s) => s.fournisseurId === fournisseurId).length
  const getAlertCount = (fournisseurId) => stock.filter((s) => s.fournisseurId === fournisseurId && s.quantite <= s.seuilAlerte).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fournisseurs</h1>
          <p className="text-gray-500 text-sm">{fournisseurs.length} fournisseur(s)</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
          <Plus size={16} /> Nouveau fournisseur
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
        <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && <p className="text-gray-400 text-sm col-span-3 py-8 text-center">Aucun fournisseur trouvé</p>}
        {filtered.map((f) => {
          const alerts = getAlertCount(f.id)
          return (
            <div key={f.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{f.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DELAI_COLOR[f.delai] || 'bg-gray-100 text-gray-600'}`}>
                      Délai {f.delai}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setModal(f)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => deleteFournisseur(f.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                {f.contact && <p className="font-medium text-gray-700">{f.contact}</p>}
                {f.phone && <div className="flex items-center gap-2"><Phone size={11} />{f.phone}</div>}
                {f.email && <div className="flex items-center gap-2"><Mail size={11} />{f.email}</div>}
                {f.address && <div className="flex items-center gap-2"><MapPin size={11} />{f.address}</div>}
              </div>

              {f.produits && (
                <div className="bg-gray-50 rounded-lg p-2 mb-3">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Package size={11} />
                    <span>{f.produits}</span>
                  </div>
                </div>
              )}

              {f.notes && <p className="text-xs text-amber-600 italic mb-3">{f.notes}</p>}

              <div className="pt-3 border-t flex justify-between text-xs">
                <button onClick={() => setPage('stock')} className="text-gray-500 hover:text-green-600">
                  {getStockCount(f.id)} produit(s) en stock
                </button>
                {alerts > 0 && (
                  <span className="text-red-600 font-semibold">{alerts} alerte(s) stock</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Nouveau fournisseur' : 'Modifier le fournisseur'} onClose={() => setModal(null)}>
          <FournisseurForm fournisseur={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
