import { useState } from 'react'
import { Plus, Search, Trash2, Eye, FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Header } from '../components/Header'
import { Modal } from '../components/Modal'
import { Badge, getInvoiceStatusVariant } from '../components/Badge'
import { useStore } from '../store/useStore'
import { Invoice, InvoiceStatus, InvoiceItem } from '../types'

export default function Factures() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'Tous'>('Tous')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const [form, setForm] = useState({
    clientName: '', tableNumber: '', notes: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }] as InvoiceItem[]
  })

  const filtered = invoices
    .filter(i => filterStatus === 'Tous' || i.status === filterStatus)
    .filter(i => {
      const q = search.toLowerCase()
      return `${i.clientName} ${i.invoiceNumber}`.toLowerCase().includes(q)
    })

  const totalRevenue = invoices.filter(i => i.status === 'payée').reduce((s, i) => s + i.total, 0)
  const pending = invoices.filter(i => i.status === 'en attente').reduce((s, i) => s + i.total, 0)

  function updateItem(idx: number, field: keyof InvoiceItem, value: string | number) {
    const items = [...form.items]
    items[idx] = { ...items[idx], [field]: value }
    if (field === 'quantity' || field === 'unitPrice') {
      items[idx].total = Number(items[idx].quantity) * Number(items[idx].unitPrice)
    }
    setForm({ ...form, items })
  }

  function addItemRow() {
    setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }] })
  }

  function removeItemRow(idx: number) {
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })
  }

  const formSubtotal = form.items.reduce((s, i) => s + i.total, 0)
  const formTax = formSubtotal * 0.1
  const formTotal = formSubtotal + formTax

  function handleAdd() {
    if (!form.clientName || form.items.length === 0) return
    const count = invoices.length + 1
    addInvoice({
      id: uuidv4(),
      invoiceNumber: `FAC-2026-${String(count).padStart(4, '0')}`,
      clientName: form.clientName,
      tableNumber: form.tableNumber ? Number(form.tableNumber) : undefined,
      items: form.items,
      subtotal: formSubtotal,
      tax: formTax,
      total: formTotal,
      status: 'en attente',
      createdAt: new Date().toISOString(),
      notes: form.notes,
    })
    setAddModalOpen(false)
  }

  function markPaid(invoice: Invoice) {
    updateInvoice(invoice.id, { status: 'payée', paidAt: new Date().toISOString() })
  }

  function markCancelled(invoice: Invoice) {
    updateInvoice(invoice.id, { status: 'annulée' })
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Factures" subtitle="Gestion des factures et paiements" />
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-xl"><CheckCircle size={20} className="text-emerald-600" /></div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{totalRevenue.toFixed(2)} €</p>
                <p className="text-xs text-gray-500">Encaissé</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-xl"><Clock size={20} className="text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pending.toFixed(2)} €</p>
                <p className="text-xs text-gray-500">En attente</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-xl"><FileText size={20} className="text-indigo-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                <p className="text-xs text-gray-500">Total factures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters + Add */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52" placeholder="N° facture, client..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {(['Tous', 'payée', 'en attente', 'annulée'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => { setForm({ clientName: '', tableNumber: '', notes: '', items: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }] }); setAddModalOpen(true) }} className="btn-primary text-sm">
            <Plus size={16} /> Nouvelle facture
          </button>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-th">N° Facture</th>
                <th className="table-th">Client</th>
                <th className="table-th">Table</th>
                <th className="table-th">Sous-total</th>
                <th className="table-th">TVA (10%)</th>
                <th className="table-th">Total TTC</th>
                <th className="table-th">Statut</th>
                <th className="table-th">Date</th>
                <th className="table-th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(invoice => (
                <tr key={invoice.id} className="table-row">
                  <td className="table-td font-mono text-xs text-indigo-600 font-medium">{invoice.invoiceNumber}</td>
                  <td className="table-td font-medium text-gray-900">{invoice.clientName}</td>
                  <td className="table-td text-gray-500">{invoice.tableNumber ? `Table ${invoice.tableNumber}` : '—'}</td>
                  <td className="table-td">{invoice.subtotal.toFixed(2)} €</td>
                  <td className="table-td text-gray-500">{invoice.tax.toFixed(2)} €</td>
                  <td className="table-td font-bold text-gray-900">{invoice.total.toFixed(2)} €</td>
                  <td className="table-td"><Badge label={invoice.status} variant={getInvoiceStatusVariant(invoice.status)} /></td>
                  <td className="table-td text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setViewInvoice(invoice); setModalOpen(true) }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Voir">
                        <Eye size={14} />
                      </button>
                      {invoice.status === 'en attente' && (
                        <>
                          <button onClick={() => markPaid(invoice)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Marquer payée">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => markCancelled(invoice)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Annuler">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                      <button onClick={() => deleteInvoice(invoice.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">Aucune facture trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewInvoice && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Facture ${viewInvoice.invoiceNumber}`} size="lg">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">TORO33</h3>
                <p className="text-sm text-gray-500">Restaurant gastronomique</p>
              </div>
              <div className="text-right">
                <Badge label={viewInvoice.status} variant={getInvoiceStatusVariant(viewInvoice.status)} size="md" />
                <p className="text-xs text-gray-400 mt-1">{new Date(viewInvoice.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Client</p>
                <p className="font-medium text-gray-900">{viewInvoice.clientName}</p>
              </div>
              {viewInvoice.tableNumber && (
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Table</p>
                  <p className="font-medium text-gray-900">Table {viewInvoice.tableNumber}</p>
                </div>
              )}
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-th">Description</th>
                  <th className="table-th text-right">Qté</th>
                  <th className="table-th text-right">Prix unitaire</th>
                  <th className="table-th text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {viewInvoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="table-td">{item.description}</td>
                    <td className="table-td text-right">{item.quantity}</td>
                    <td className="table-td text-right">{item.unitPrice.toFixed(2)} €</td>
                    <td className="table-td text-right font-medium">{item.total.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Sous-total HT</span><span>{viewInvoice.subtotal.toFixed(2)} €</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">TVA (10%)</span><span>{viewInvoice.tax.toFixed(2)} €</span></div>
              <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2"><span>Total TTC</span><span className="text-indigo-600">{viewInvoice.total.toFixed(2)} €</span></div>
            </div>

            {viewInvoice.status === 'en attente' && (
              <div className="flex justify-end gap-3">
                <button onClick={() => { markCancelled(viewInvoice); setModalOpen(false) }} className="btn-secondary text-sm"><XCircle size={15} /> Annuler</button>
                <button onClick={() => { markPaid(viewInvoice); setModalOpen(false) }} className="btn-primary text-sm"><CheckCircle size={15} /> Marquer payée</button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Invoice Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Nouvelle facture" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Client *</label>
              <input className="input-field" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Nom du client ou Table..." />
            </div>
            <div>
              <label className="label">Numéro de table</label>
              <input type="number" className="input-field" value={form.tableNumber} onChange={e => setForm({ ...form, tableNumber: e.target.value })} placeholder="Ex: 5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Articles</label>
              <button onClick={addItemRow} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"><Plus size={12} /> Ajouter</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input className="input-field col-span-5" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Description" />
                  <input type="number" className="input-field col-span-2" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} placeholder="Qté" min={1} />
                  <input type="number" className="input-field col-span-3" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))} placeholder="Prix HT" step="0.01" />
                  <span className="col-span-1 text-sm text-gray-600 font-medium text-right">{item.total.toFixed(0)}€</span>
                  <button onClick={() => removeItemRow(idx)} className="col-span-1 p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-gray-600">Sous-total HT</span><span>{formSubtotal.toFixed(2)} €</span></div>
            <div className="flex justify-between"><span className="text-gray-600">TVA (10%)</span><span>{formTax.toFixed(2)} €</span></div>
            <div className="flex justify-between font-bold text-base border-t pt-1 mt-1"><span>Total TTC</span><span className="text-indigo-600">{formTotal.toFixed(2)} €</span></div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea className="input-field resize-none" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setAddModalOpen(false)} className="btn-secondary text-sm">Annuler</button>
            <button onClick={handleAdd} disabled={!form.clientName} className="btn-primary text-sm disabled:opacity-50">Créer la facture</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
