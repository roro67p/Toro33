import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, Search, CreditCard, Banknote, Smartphone, Receipt, Printer } from 'lucide-react'

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Especes', icon: Banknote, color: 'text-green-600' },
  { id: 'card', label: 'Carte bancaire', icon: CreditCard, color: 'text-blue-600' },
  { id: 'mobile', label: 'Paiement mobile', icon: Smartphone, color: 'text-purple-600' },
  { id: 'check', label: 'Cheque', icon: Receipt, color: 'text-amber-600' },
]

function NewPaymentModal({ onClose }) {
  const { orders, invoices, addPayment, updateInvoiceStatus, updateOrderStatus } = useStore()
  const [form, setForm] = useState({
    orderId: '',
    invoiceId: '',
    method: 'cash',
    amount: '',
    tip: '',
    notes: '',
  })

  const unpaidInvoices = invoices.filter((i) => i.status === 'Emise')
  const servedOrders = orders.filter((o) => o.status === 'Servi' || o.status === 'En cours')

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"

  const selectedInvoice = invoices.find((i) => i.id === Number(form.invoiceId))
  const selectedOrder = orders.find((o) => o.id === Number(form.orderId))

  const autoAmount = selectedInvoice?.total || selectedOrder?.total || 0

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = Number(form.amount) || autoAmount
    if (amount <= 0) return alert('Montant invalide')

    addPayment({
      orderId: form.orderId ? Number(form.orderId) : null,
      invoiceId: form.invoiceId ? Number(form.invoiceId) : null,
      orderNumber: selectedOrder?.number || '',
      invoiceNumber: selectedInvoice?.number || '',
      clientName: selectedInvoice?.clientName || selectedOrder?.clientName || 'Client comptoir',
      method: form.method,
      amount,
      tip: Number(form.tip) || 0,
      total: amount + (Number(form.tip) || 0),
      notes: form.notes,
    })

    if (form.invoiceId) updateInvoiceStatus(Number(form.invoiceId), 'Payee')
    if (form.orderId) updateOrderStatus(Number(form.orderId), 'Servi')

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-gray-900">Nouvel encaissement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facture</label>
              <select className={inputCls} value={form.invoiceId} onChange={f('invoiceId')}>
                <option value="">-- Aucune facture --</option>
                {unpaidInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.number} - {inv.clientName} ({inv.total?.toFixed(2)} EUR)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ou commande</label>
              <select className={inputCls} value={form.orderId} onChange={f('orderId')} disabled={!!form.invoiceId}>
                <option value="">-- Aucune commande --</option>
                {servedOrders.map((o) => (
                  <option key={o.id} value={o.id}>{o.number} - {o.clientName} ({o.total?.toFixed(2)} EUR)</option>
                ))}
              </select>
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement *</label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setForm({ ...form, method: pm.id })}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${form.method === pm.id ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <pm.icon size={18} className={form.method === pm.id ? 'text-emerald-600' : pm.color} />
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR) *</label>
                <input className={inputCls} type="number" step="0.01" min="0" value={form.amount} onChange={f('amount')} placeholder={autoAmount ? autoAmount.toFixed(2) : '0.00'} />
                {autoAmount > 0 && !form.amount && <p className="text-xs text-gray-400 mt-1">Auto: {autoAmount.toFixed(2)} EUR</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pourboire</label>
                <input className={inputCls} type="number" step="0.50" min="0" value={form.tip} onChange={f('tip')} placeholder="0.00" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input className={inputCls} value={form.notes} onChange={f('notes')} placeholder="Remarques..." />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">Encaisser</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function TicketPreview({ payment, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b no-print">
          <h3 className="font-semibold">Ticket</h3>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-emerald-600">
              <Printer size={13} /> Imprimer
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>
        </div>
        <div className="p-6 text-center text-sm">
          <h2 className="text-lg font-bold">RestoPro</h2>
          <p className="text-xs text-gray-400 mb-4">123 Rue de la Gastronomie, Paris</p>
          <div className="border-t border-dashed pt-3 mb-3">
            <p className="font-mono font-bold text-lg">{payment.number}</p>
            <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleString('fr-FR')}</p>
          </div>
          <div className="border-t border-dashed pt-3 mb-3 space-y-1 text-left">
            <div className="flex justify-between"><span>Client</span><span className="font-medium">{payment.clientName}</span></div>
            {payment.orderNumber && <div className="flex justify-between"><span>Commande</span><span>{payment.orderNumber}</span></div>}
            {payment.invoiceNumber && <div className="flex justify-between"><span>Facture</span><span>{payment.invoiceNumber}</span></div>}
            <div className="flex justify-between"><span>Mode</span><span className="font-medium">{PAYMENT_METHODS.find((p) => p.id === payment.method)?.label || payment.method}</span></div>
          </div>
          <div className="border-t border-dashed pt-3 space-y-1 text-left">
            <div className="flex justify-between text-base"><span>Montant</span><span className="font-bold">{payment.amount?.toFixed(2)} EUR</span></div>
            {payment.tip > 0 && <div className="flex justify-between"><span>Pourboire</span><span>{payment.tip?.toFixed(2)} EUR</span></div>}
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>TOTAL</span><span className="text-emerald-600">{payment.total?.toFixed(2)} EUR</span></div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Merci de votre visite !</p>
        </div>
      </div>
    </div>
  )
}

export default function CashRegister() {
  const { payments, deletePayment } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('Tous')

  const today = new Date().toISOString().split('T')[0]

  const filtered = payments.filter((p) => {
    const matchMethod = methodFilter === 'Tous' || p.method === methodFilter
    const matchSearch = (p.number || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.clientName || '').toLowerCase().includes(search.toLowerCase())
    return matchMethod && matchSearch
  })

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))

  const todayPayments = payments.filter((p) => p.date?.startsWith(today))
  const todayTotal = todayPayments.reduce((a, p) => a + (p.total || 0), 0)
  const todayTips = todayPayments.reduce((a, p) => a + (p.tip || 0), 0)
  const totalAll = payments.reduce((a, p) => a + (p.total || 0), 0)

  const methodStats = PAYMENT_METHODS.map((pm) => ({
    ...pm,
    count: todayPayments.filter((p) => p.method === pm.id).length,
    total: todayPayments.filter((p) => p.method === pm.id).reduce((a, p) => a + (p.total || 0), 0),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Caisse / Encaissements</h1>
          <p className="text-gray-500 text-sm">{payments.length} paiement(s) enregistre(s)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600">
          <Plus size={16} /> Encaisser
        </button>
      </div>

      {/* Today stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">CA du jour</p>
          <p className="text-xl font-bold text-emerald-600">{todayTotal.toFixed(2)} EUR</p>
          <p className="text-xs text-gray-400">{todayPayments.length} encaissement(s)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Pourboires du jour</p>
          <p className="text-xl font-bold text-purple-600">{todayTips.toFixed(2)} EUR</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">CA total</p>
          <p className="text-xl font-bold text-gray-900">{totalAll.toFixed(2)} EUR</p>
          <p className="text-xs text-gray-400">{payments.length} paiement(s)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Ticket moyen</p>
          <p className="text-xl font-bold text-amber-600">{todayPayments.length > 0 ? (todayTotal / todayPayments.length).toFixed(2) : '0.00'} EUR</p>
        </div>
      </div>

      {/* Method breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {methodStats.map((pm) => (
          <div key={pm.id} className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3">
            <pm.icon size={20} className={pm.color} />
            <div>
              <p className="text-xs text-gray-500">{pm.label}</p>
              <p className="font-bold text-sm">{pm.total.toFixed(2)} EUR</p>
              <p className="text-xs text-gray-400">{pm.count}x</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {['Tous', ...PAYMENT_METHODS.map((p) => p.id)].map((m) => (
          <button key={m} onClick={() => setMethodFilter(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${methodFilter === m ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
            {m === 'Tous' ? 'Tous' : PAYMENT_METHODS.find((p) => p.id === m)?.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">N</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Client</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Mode</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Montant</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Pourboire</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Total</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">Aucun encaissement</td></tr>
            )}
            {sorted.map((p) => {
              const pm = PAYMENT_METHODS.find((m) => m.id === p.method)
              return (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{p.number}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{p.clientName}</p>
                    {p.orderNumber && <p className="text-xs text-gray-400">{p.orderNumber}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(p.date).toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {pm && <pm.icon size={14} className={pm.color} />}
                      <span className="text-xs">{pm?.label || p.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">{p.amount?.toFixed(2)} EUR</td>
                  <td className="px-4 py-3 text-right text-purple-600">{p.tip > 0 ? `${p.tip.toFixed(2)} EUR` : '--'}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">{p.total?.toFixed(2)} EUR</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setTicket(p)} title="Ticket" className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"><Receipt size={15} /></button>
                      <button onClick={() => deletePayment(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && <NewPaymentModal onClose={() => setShowModal(false)} />}
      {ticket && <TicketPreview payment={ticket} onClose={() => setTicket(null)} />}
    </div>
  )
}
