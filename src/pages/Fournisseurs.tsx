import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, Phone, Mail, MapPin } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { Badge, getSupplierStatusVariant } from '../components/Badge'
import { useStore } from '../store/useStore'
import { Supplier, SupplierStatus, SupplierCategory } from '../types'

const STATUS_OPTIONS: SupplierStatus[] = ['actif', 'inactif']
const CATEGORIES: SupplierCategory[] = ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Boissons', 'Épicerie', 'Produits laitiers', 'Vins & Spiritueux']

export default function Fournisseurs() {
  const suppliers = useStore((s) => s.suppliers)
  const addSupplier = useStore((s) => s.addSupplier)
  const updateSupplier = useStore((s) => s.updateSupplier)
  const deleteSupplier = useStore((s) => s.deleteSupplier)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formName, setFormName] = useState('')
  const [formContact, setFormContact] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formCategory, setFormCategory] = useState<SupplierCategory>('Viandes')
  const [formAddress, setFormAddress] = useState('')
  const [formLastOrder, setFormLastOrder] = useState('')
  const [formStatus, setFormStatus] = useState<SupplierStatus>('actif')
  const [formNotes, setFormNotes] = useState('')

  const filtered = suppliers.filter((s) => {
    const matchSearch = search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || s.status === filterStatus
    const matchCat = filterCategory === 'all' || s.category === filterCategory
    return matchSearch && matchStatus && matchCat
  })

  function openAdd() {
    setEditSupplier(null)
    setFormName(''); setFormContact(''); setFormEmail(''); setFormPhone('')
    setFormCategory('Viandes'); setFormAddress('')
    setFormLastOrder(new Date().toISOString().split('T')[0])
    setFormStatus('actif'); setFormNotes('')
    setModalOpen(true)
  }

  function openEdit(sup: Supplier) {
    setEditSupplier(sup)
    setFormName(sup.name); setFormContact(sup.contact); setFormEmail(sup.email)
    setFormPhone(sup.phone); setFormCategory(sup.category); setFormAddress(sup.address)
    setFormLastOrder(sup.lastOrder); setFormStatus(sup.status); setFormNotes(sup.notes || '')
    setModalOpen(true)
  }

  function handleSave() {
    if (!formName) return
    if (editSupplier) {
      updateSupplier(editSupplier.id, {
        name: formName, contact: formContact, email: formEmail, phone: formPhone,
        category: formCategory, address: formAddress, lastOrder: formLastOrder,
        status: formStatus, notes: formNotes,
      })
    } else {
      addSupplier({
        id: uuidv4(), name: formName, contact: formContact, email: formEmail,
        phone: formPhone, category: formCategory, address: formAddress,
        lastOrder: formLastOrder, status: formStatus, notes: formNotes,
      })
    }
    setModalOpen(false)
  }

  return (
    <div>
      <Header title="Fournisseurs" subtitle="Gestion des fournisseurs" />
      <div className="p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Rechercher un fournisseur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field sm:w-48" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">Toutes catégories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input-field sm:w-36" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tous statuts</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-primary" onClick={openAdd}><Plus size={16} />Nouveau fournisseur</button>
        </div>

        {/* Summary */}
        <div className="flex gap-3 mb-5">
          <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm shadow-sm">
            <span className="text-gray-500">Actifs: </span>
            <span className="font-semibold text-emerald-600">{suppliers.filter((s) => s.status === 'actif').length}</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm shadow-sm">
            <span className="text-gray-500">Inactifs: </span>
            <span className="font-semibold text-red-500">{suppliers.filter((s) => s.status === 'inactif').length}</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm shadow-sm">
            <span className="text-gray-500">Total: </span>
            <span className="font-semibold text-gray-900">{suppliers.length}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 card">Aucun fournisseur trouvé</div>
          )}
          {filtered.map((sup) => (
            <div key={sup.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{sup.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium mt-0.5">{sup.category}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <Badge label={sup.status} variant={getSupplierStatusVariant(sup.status)} />
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Contact:</span>
                  {sup.contact}
                </div>
                {sup.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-gray-400" />
                    {sup.phone}
                  </div>
                )}
                {sup.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={11} className="text-gray-400" />
                    <span className="truncate">{sup.email}</span>
                  </div>
                )}
                {sup.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={11} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{sup.address}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-400">
                    Dernière commande: <span className="text-gray-600 font-medium">
                      {sup.lastOrder ? new Date(sup.lastOrder).toLocaleDateString('fr-FR') : '—'}
                    </span>
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(sup)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Edit2 size={13} />
                    </button>
                    {deleteConfirm === sup.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => { deleteSupplier(sup.id); setDeleteConfirm(null) }} className="text-xs text-red-600 font-medium hover:underline">Oui</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:underline">Non</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(sup.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nom de l'entreprise *</label>
              <input className="input-field" placeholder="Boucherie Martin" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div>
              <label className="label">Catégorie</label>
              <select className="input-field" value={formCategory} onChange={(e) => setFormCategory(e.target.value as SupplierCategory)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nom du contact</label>
              <input className="input-field" placeholder="Jean Martin" value={formContact} onChange={(e) => setFormContact(e.target.value)} />
            </div>
            <div>
              <label className="label">Statut</label>
              <select className="input-field" value={formStatus} onChange={(e) => setFormStatus(e.target.value as SupplierStatus)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" placeholder="contact@fournisseur.fr" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input className="input-field" placeholder="05 56 12 34 56" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Adresse</label>
            <input className="input-field" placeholder="15 rue des Chartrons, Bordeaux" value={formAddress} onChange={(e) => setFormAddress(e.target.value)} />
          </div>
          <div>
            <label className="label">Dernière commande</label>
            <input className="input-field" type="date" value={formLastOrder} onChange={(e) => setFormLastOrder(e.target.value)} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input-field resize-none h-16" placeholder="Conditions de livraison, remarques..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary flex-1 justify-center" onClick={handleSave} disabled={!formName}>
              {editSupplier ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
