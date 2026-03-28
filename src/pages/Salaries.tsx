import { useState } from 'react'
import { Plus, Search, Trash2, Edit2, Phone, Mail, Calendar } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { Badge, getEmployeeStatusVariant } from '../components/Badge'
import { useStore } from '../store/useStore'
import { Employee, EmployeeStatus, EmployeeRole } from '../types'

const STATUS_OPTIONS: EmployeeStatus[] = ['actif', 'congé', 'absent']
const ROLES: EmployeeRole[] = ['Manager', 'Maître d\'hôtel', 'Serveur', 'Chef', 'Sous-Chef', 'Barman', 'Caissier', 'Plongeur']

export default function Salaries() {
  const employees = useStore((s) => s.employees)
  const addEmployee = useStore((s) => s.addEmployee)
  const updateEmployee = useStore((s) => s.updateEmployee)
  const deleteEmployee = useStore((s) => s.deleteEmployee)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editEmp, setEditEmp] = useState<Employee | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formFirstName, setFormFirstName] = useState('')
  const [formLastName, setFormLastName] = useState('')
  const [formRole, setFormRole] = useState<EmployeeRole>('Serveur')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formSalary, setFormSalary] = useState('')
  const [formStatus, setFormStatus] = useState<EmployeeStatus>('actif')
  const [formHireDate, setFormHireDate] = useState('')
  const [formSchedule, setFormSchedule] = useState('')

  const filtered = employees.filter((e) => {
    const matchSearch = search === '' ||
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || e.status === filterStatus
    const matchRole = filterRole === 'all' || e.role === filterRole
    return matchSearch && matchStatus && matchRole
  })

  function openAdd() {
    setEditEmp(null)
    setFormFirstName(''); setFormLastName(''); setFormRole('Serveur'); setFormEmail('')
    setFormPhone(''); setFormSalary(''); setFormStatus('actif')
    setFormHireDate(new Date().toISOString().split('T')[0]); setFormSchedule('')
    setModalOpen(true)
  }

  function openEdit(emp: Employee) {
    setEditEmp(emp)
    setFormFirstName(emp.firstName); setFormLastName(emp.lastName); setFormRole(emp.role)
    setFormEmail(emp.email); setFormPhone(emp.phone); setFormSalary(String(emp.salary))
    setFormStatus(emp.status); setFormHireDate(emp.hireDate); setFormSchedule(emp.schedule)
    setModalOpen(true)
  }

  function handleSave() {
    if (!formFirstName || !formLastName) return
    if (editEmp) {
      updateEmployee(editEmp.id, {
        firstName: formFirstName, lastName: formLastName, role: formRole,
        email: formEmail, phone: formPhone, salary: parseFloat(formSalary) || 0,
        status: formStatus, hireDate: formHireDate, schedule: formSchedule,
      })
    } else {
      addEmployee({
        id: uuidv4(), firstName: formFirstName, lastName: formLastName, role: formRole,
        email: formEmail, phone: formPhone, salary: parseFloat(formSalary) || 0,
        status: formStatus, hireDate: formHireDate, schedule: formSchedule,
      })
    }
    setModalOpen(false)
  }

  const totalSalaryBill = employees.filter((e) => e.status === 'actif').reduce((s, e) => s + e.salary, 0)

  return (
    <div>
      <Header title="Salariés" subtitle="Gestion du personnel" />
      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-emerald-600">{employees.filter((e) => e.status === 'actif').length}</p>
            <p className="text-xs text-gray-500 mt-1">Actifs</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-amber-500">{employees.filter((e) => e.status === 'congé').length}</p>
            <p className="text-xs text-gray-500 mt-1">En congé</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-red-500">{employees.filter((e) => e.status === 'absent').length}</p>
            <p className="text-xs text-gray-500 mt-1">Absents</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-xl font-bold text-indigo-600">{totalSalaryBill.toLocaleString('fr-FR')} €</p>
            <p className="text-xs text-gray-500 mt-1">Masse salariale</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Rechercher un salarié..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field sm:w-44" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Tous les postes</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="input-field sm:w-36" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tous statuts</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-primary" onClick={openAdd}><Plus size={16} />Nouveau salarié</button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 card">Aucun salarié trouvé</div>
          )}
          {filtered.map((emp) => (
            <div key={emp.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-indigo-600">{emp.firstName[0]}{emp.lastName[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-gray-500">{emp.role}</p>
                  </div>
                </div>
                <Badge label={emp.status} variant={getEmployeeStatusVariant(emp.status)} />
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                {emp.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-gray-400" />
                    {emp.phone}
                  </div>
                )}
                {emp.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={11} className="text-gray-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                )}
                {emp.schedule && (
                  <div className="flex items-center gap-2">
                    <Calendar size={11} className="text-gray-400" />
                    {emp.schedule}
                  </div>
                )}
                <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                  <span className="font-semibold text-gray-800">{emp.salary.toLocaleString('fr-FR')} € / mois</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(emp)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Edit2 size={13} />
                    </button>
                    {deleteConfirm === emp.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => { deleteEmployee(emp.id); setDeleteConfirm(null) }} className="text-xs text-red-600 font-medium hover:underline">Oui</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:underline">Non</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(emp.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editEmp ? 'Modifier le salarié' : 'Nouveau salarié'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prénom *</label>
              <input className="input-field" placeholder="Marie" value={formFirstName} onChange={(e) => setFormFirstName(e.target.value)} />
            </div>
            <div>
              <label className="label">Nom *</label>
              <input className="input-field" placeholder="Dupont" value={formLastName} onChange={(e) => setFormLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Poste</label>
              <select className="input-field" value={formRole} onChange={(e) => setFormRole(e.target.value as EmployeeRole)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Statut</label>
              <select className="input-field" value={formStatus} onChange={(e) => setFormStatus(e.target.value as EmployeeStatus)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" placeholder="marie.dupont@toro33.fr" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Téléphone</label>
              <input className="input-field" placeholder="06 12 34 56 78" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
            </div>
            <div>
              <label className="label">Salaire brut (€)</label>
              <input className="input-field" type="number" min="0" placeholder="2000" value={formSalary} onChange={(e) => setFormSalary(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date d'embauche</label>
              <input className="input-field" type="date" value={formHireDate} onChange={(e) => setFormHireDate(e.target.value)} />
            </div>
            <div>
              <label className="label">Horaires</label>
              <input className="input-field" placeholder="Mar-Sam 11h-23h" value={formSchedule} onChange={(e) => setFormSchedule(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn-primary flex-1 justify-center" onClick={handleSave} disabled={!formFirstName || !formLastName}>
              {editEmp ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
