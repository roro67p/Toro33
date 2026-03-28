import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, Star, Phone, Mail } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { Badge, getClientTierVariant } from '../components/Badge'
import { useStore } from '../store/useStore'
import { Client, ClientTier } from '../types'

const TIERS: ClientTier[] = ['Bronze', 'Argent', 'Or', 'Platine']

function getTier(totalSpent: number): ClientTier {
  if (totalSpent >= 5000) return 'Platine'
  if (totalSpent >= 2000) return 'Or'
  if (totalSpent >= 500) return 'Argent'
  return 'Bronze'
}

const tierIcons: Record<ClientTier, string> = {
  Bronze: '🥉',
  Argent: '🥈',
  Or: '🥇',
  Platine: '💎',
}

export default function Clients() {
  const clients = useStore((s) => s.clients)
  const addClient = useStore((s) => s.addClient)
  const updateClient = useStore((s) => s.updateClient)
  const deleteClient = useStore((s) => s.deleteClient)

  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formFirstName, setFormFirstName] = useState('')
  const [formLastName, setFormLastName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formBirthDate, setFormBirthDate] = useState('')
  const [formNotes, setFormNotes] = useState('')

  const filtered = clients.filter((c) => {
    const matchSearch = search === '' ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    const matchTier = filterTier === 'all' || c.tier === filterTier
    return matchSearch && matchTier
  })

  const sorted = [...filtered].sort((a, b) => b.totalSpent - a.totalSpent)

  function openAdd() {
    setEditClient(null)
    setFormFirstName(''); setFormLastName(''); setFormEmail(''); setFormPhone(''); setFormBirthDate(''); setFormNotes('')
    setModalOpen(true)
  }

  function openEdit(client: Client) {
    setEditClient(client)
    setFormFirstName(client.firstName); setFormLastName(client.lastName)
    setFormEmail(client.email); setFormPhone(client.phone)
    setFormBirthDate(client.birthDate || ''); setFormNotes(client.notes || '')
    setModalOpen(true)
  }

  function handleSave() {
    if (!formFirstName || !formLastName) return
    if (editClient) {
      updateClient(editClient.id, {
        firstName: formFirstName, lastName: formLastName, email: formEmail,
        phone: formPhone, birthDate: formBirthDate, notes: formNotes,
        tier: getTier(editClient.totalSpent),
      })
    } else {
      addClient({
        id: uuidv4(), firstName: formFirstName, lastName: formLastName,
        email: formEmail, phone: formPhone, birthDate: formBirthDate,
        visits: 0, points: 0, totalSpent: 0, tier: 'Bronze',
        createdAt: new Date().toISOString().split('T')[0],
        notes: formNotes,
      })
    }
    setModalOpen(false)
  }

  const tierCounts = TIERS.reduce((acc, t) => {
    acc[t] = clients.filter((c) => c.tier === t).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <Header title="Clients" subtitle="Programme de fidélité" />
      <div className="p-6">
        {/* Tier Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(filterTier === tier ? 'all' : tier)}
              className={`card text-center py-3 cursor-pointer hover:shadow-md transition-all ${filterTier === tier ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <p className="text-2xl">{tierIcons[tier]}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{tierCounts[tier]}</p>
              <p className="text-xs text-gray-500">{tier}</p>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field sm:w-40" value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
            <option value="all">Tous les niveaux</option>
            {TIERS.map((t) => <option key={t} value={t}>{tierIcons[t]} {t}</option>)}
          </select>
          <button className="btn-primary" onClick={openAdd}><Plus size={16} />Nouveau client</button>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-th">Client</th>
                <th className="table-th hidden md:table-cell">Contact</th>
                <th className="table-th">Visites</th>
                <th className="table-th">Points</th>
                <th className="table-th">Total dépensé</th>
                <th className="table-th">Niveau</th>
                <th className="table-th hidden lg:table-cell">Dernière visite</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr><td colSpan={8} className="table-td text-center text-gray-400 py-8">Aucun client trouvé</td></tr>
              )}
              {sorted.map((client) => (
                <tr key={client.id} className="table-row">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-indigo-600">
                          {client.firstName[0]}{client.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.firstName} {client.lastName}</p>
                        <p className="text-xs text-gray-400">{client.email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td hidden md:table-cell">
                    <div className="space-y-0.5">
                      {client.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone size={11} />
                          {client.phone}
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail size={11} />
                          {client.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-td text-center font-semibold">{client.visits}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star size={13} className="fill-current" />
                      {client.points.toLocaleString('fr-FR')}
                    </div>
                  </td>
                  <td className="table-td font-semibold text-indigo-700">{client.totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                  <td className="table-td">
                    <Badge label={`${tierIcons[client.tier]} ${client.tier}`} variant={getClientTierVariant(client.tier)} />
                  </td>
                  <td className="table-td text-gray-400 text-xs hidden lg:table-cell">
                    {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(client)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      {deleteConfirm === client.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => { deleteClient(client.id); setDeleteConfirm(null) }} className="text-xs text-red-600 font-medium hover:underline">Oui</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:underline">Non</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(client.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tier guide */}
        <div className="mt-4 card bg-gray-50 border border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Niveaux de fidélité</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div><span className="font-medium">🥉 Bronze</span><p className="text-gray-500">0 – 499 €</p></div>
            <div><span className="font-medium">🥈 Argent</span><p className="text-gray-500">500 – 1 999 €</p></div>
            <div><span className="font-medium">🥇 Or</span><p className="text-gray-500">2 000 – 4 999 €</p></div>
            <div><span className="font-medium">💎 Platine</span><p className="text-gray-500">5 000 € et +</p></div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editClient ? 'Modifier le client' : 'Nouveau client'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prénom *</label>
              <input className="input-field" placeholder="Jean" value={formFirstName} onChange={(e) => setFormFirstName(e.target.value)} />
            </div>
            <div>
              <label className="label">Nom *</label>
              <input className="input-field" placeholder="Dupont" value={formLastName} onChange={(e) => setFormLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" placeholder="jean.dupont@email.fr" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Téléphone</label>
              <input className="input-field" placeholder="06 12 34 56 78" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
            </div>
            <div>
              <label className="label">Date de naissance</label>
              <input className="input-field" type="date" value={formBirthDate} onChange={(e) => setFormBirthDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input-field resize-none h-20" placeholder="Préférences, allergies..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary flex-1 justify-center" onClick={handleSave} disabled={!formFirstName || !formLastName}>
              {editClient ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
