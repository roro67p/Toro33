import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Trash2, Printer, Search, CheckCircle, Clock, Eye } from 'lucide-react'

const STATUS_COLOR = {
  'Émise': 'bg-amber-100 text-amber-700',
  'Payée': 'bg-green-100 text-green-700',
  'Annulée': 'bg-red-100 text-red-700',
}

function InvoicePreview({ invoice, onClose }) {
  const { clients } = useStore()
  const client = clients.find((c) => c.id === invoice.clientId)

  const handlePrint = () => window.print()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b no-print">
          <h3 className="font-semibold">Aperçu — {invoice.number}</h3>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-amber-600">
              <Printer size={15} /> Imprimer / PDF
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
          </div>
        </div>

        <div id="invoice-print" className="flex-1 overflow-auto p-8 text-sm">
          {/* Header */}
          <div className="flex justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RestoPro</h1>
              <p className="text-gray-500 text-xs mt-1">123 Rue de la Gastronomie<br />75001 Paris, France<br />contact@restopro.fr</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-amber-600">FACTURE</h2>
              <p className="text-gray-900 font-mono font-semibold">{invoice.number}</p>
              <p className="text-gray-500 text-xs mt-1">
                Date : {new Date(invoice.date).toLocaleDateString('fr-FR')}<br />
                Échéance : {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Client */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Facturé à</p>
            <p className="font-semibold text-gray-900">{invoice.clientName || '—'}</p>
            {client?.email && <p className="text-gray-500 text-xs">{client.email}</p>}
            {client?.address && <p className="text-gray-500 text-xs">{client.address}</p>}
            {client?.phone && <p className="text-gray-500 text-xs">{client.phone}</p>}
          </div>

          {/* Items */}
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-gray-600 font-medium text-xs uppercase">Description</th>
                <th className="text-center py-2 text-gray-600 font-medium text-xs uppercase">Qté</th>
                <th className="text-right py-2 text-gray-600 font-medium text-xs uppercase">P.U.</th>
                <th className="text-right py-2 text-gray-600 font-medium text-xs uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2.5 text-gray-900">{item.name}</td>
                  <td className="py-2.5 text-center text-gray-600">{item.qty}</td>
                  <td className="py-2.5 text-right text-gray-600">{Number(item.price).toFixed(2)} €</td>
                  <td className="py-2.5 text-right font-medium text-gray-900">{(item.price * item.qty).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sous-total HT</span>
                <span className="text-gray-900">{invoice.subtotal?.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">TVA (10%)</span>
                <span className="text-gray-900">{invoice.tva?.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-base">
                <span>Total TTC</span>
                <span className="text-amber-600">{invoice.total?.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-xs text-gray-400 text-center">
            <p>Merci pour votre visite — RestoPro • SIRET : 123 456 789 00010</p>
            <p>Paiement à réception de la facture</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Invoices() {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useStore()
  const [preview, setPreview] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')

  const filtered = invoices.filter((inv) => {
    const matchStatus = statusFilter === 'Tous' || inv.status === statusFilter
    const matchSearch = (inv.number || '').toLowerCase().includes(search.toLowerCase()) ||
      (inv.clientName || '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalEmises = invoices.filter((i) => i.status === 'Émise').reduce((acc, i) => acc + i.total, 0)
  const totalPayees = invoices.filter((i) => i.status === 'Payée').reduce((acc, i) => acc + i.total, 0)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
        <p className="text-gray-500 text-sm">{invoices.length} facture(s)</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-xl font-bold text-amber-600">{totalEmises.toFixed(2)} €</p>
          <p className="text-xs text-gray-400">{invoices.filter((i) => i.status === 'Émise').length} facture(s)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Encaissé</p>
          <p className="text-xl font-bold text-emerald-600">{totalPayees.toFixed(2)} €</p>
          <p className="text-xs text-gray-400">{invoices.filter((i) => i.status === 'Payée').length} facture(s)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Total émis</p>
          <p className="text-xl font-bold text-gray-900">{invoices.reduce((a, i) => a + i.total, 0).toFixed(2)} €</p>
          <p className="text-xs text-gray-400">{invoices.length} facture(s)</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="N° facture, client..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {['Tous', 'Émise', 'Payée', 'Annulée'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter === s ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">N°</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Client</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Échéance</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Total TTC</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Statut</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Aucune facture — créez-en depuis une commande</td></tr>
            )}
            {sorted.map((inv) => (
              <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium text-gray-900">{inv.number}</td>
                <td className="px-4 py-3 text-gray-700">{inv.clientName || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(inv.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(inv.dueDate).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{inv.total?.toFixed(2)} €</td>
                <td className="px-4 py-3 text-center">
                  <select value={inv.status} onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLOR[inv.status] || STATUS_COLOR['Émise']}`}>
                    {Object.keys(STATUS_COLOR).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setPreview(inv)} title="Aperçu / Imprimer" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={15} /></button>
                    <button onClick={() => setPreview(inv)} title="Imprimer" className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"><Printer size={15} /></button>
                    <button onClick={() => deleteInvoice(inv.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview && <InvoicePreview invoice={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
