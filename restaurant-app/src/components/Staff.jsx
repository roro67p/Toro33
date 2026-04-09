import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Pencil, Trash2, Search, User, Phone, Mail, Briefcase } from 'lucide-react'

const ROLES = ['Chef cuisinier', 'Sous-chef', 'Commis de cuisine', 'Serveur/Serveuse', 'Maitre d\'hotel', 'Barman', 'Plongeur', 'Hote/Hotesse']

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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

function StaffForm({ member, onSave, onClose }) {
  const [form, setForm] = useState(member || { name: '', role: 'Serveur/Serveuse', phone: '', email: '', salary: '' })
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, salary: Number(form.salary) }) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
        <input className={inputCls} value={form.name} onChange={f('name')} required placeholder="Prenom Nom" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
        <select className={inputCls} value={form.role} onChange={f('role')}>
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
          <input className={inputCls} value={form.phone} onChange={f('phone')} placeholder="06 00 00 00 00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input className={inputCls} type="email" value={form.email} onChange={f('email')} placeholder="email@restopro.fr" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Salaire mensuel (EUR)</label>
        <input className={inputCls} type="number" step="50" min="0" value={form.salary} onChange={f('salary')} placeholder="1800" />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">Enregistrer</button>
      </div>
    </form>
  )
}

export default function Staff() {
  const { staff, addStaff, updateStaff, deleteStaff } = useStore()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tous')

  const filtered = staff.filter((m) => {
    const matchRole = roleFilter === 'Tous' || m.role === roleFilter
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const handleSave = (form) => {
    if (modal === 'add') addStaff(form)
    else updateStaff(modal.id, form)
    setModal(null)
  }

  const totalSalaries = staff.filter((m) => m.status === 'actif').reduce((a, m) => a + (m.salary || 0), 0)
  const roleCount = staff.reduce((acc, m) => {
    acc[m.role] = (acc[m.role] || 0) + 1
    return acc
  }, {})

  const uniqueRoles = [...new Set(staff.map((m) => m.role))]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personnel</h1>
          <p className="text-gray-500 text-sm">{staff.length} employe(s) - Masse salariale: {totalSalaries.toFixed(0)} EUR/mois</p>
        </div>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600">
          <Plus size={16} /> Ajouter un employe
        </button>
      </div>

      {/* Stats by role */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(roleCount).slice(0, 4).map(([role, count]) => (
          <div key={role} className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-1">{role}</p>
            <p className="text-2xl font-bold text-teal-600">{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {['Tous', ...uniqueRoles].map((r) => (
          <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${roleFilter === r ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{r}</button>
        ))}
      </div>

      {/* Staff cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && <p className="text-gray-400 text-sm col-span-3 py-8 text-center">Aucun employe trouve</p>}
        {filtered.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <div className="flex items-center gap-1 text-xs text-teal-600">
                    <Briefcase size={11} /> {member.role}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setModal(member)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                <button onClick={() => deleteStaff(member.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-gray-500">
              {member.phone && <div className="flex items-center gap-2"><Phone size={12} />{member.phone}</div>}
              {member.email && <div className="flex items-center gap-2"><Mail size={12} />{member.email}</div>}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between text-xs">
              <span className={`px-2 py-0.5 rounded-full font-medium ${member.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {member.status === 'actif' ? 'Actif' : 'Inactif'}
              </span>
              {member.salary && <span className="font-semibold text-gray-900">{member.salary} EUR/mois</span>}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Nouvel employe' : 'Modifier l\'employe'} onClose={() => setModal(null)}>
          <StaffForm member={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
