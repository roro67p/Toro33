import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, CheckCircle, Clock, Send, Search, PackageCheck } from 'lucide-react'

const STATUT_COLOR = {
  'En attente': 'bg-gray-100 text-gray-600',
  'Envoyée':    'bg-blue-100 text-blue-700',
  'Reçue':      'bg-green-100 text-green-700',
  'Annulée':    'bg-red-100 text-red-700',
}

function NouvelleCommandeModal({ onClose }) {
  const { fournisseurs, stock, addCommandeFournisseur } = useStore()
  const [fournisseurId, setFournisseurId] = useState(fournisseurs[0]?.id || '')
  const [lignes, setLignes] = useState([])
  const [notes, setNotes] = useState('')

  const fournisseurStock = stock.filter((s) => s.fournisseurId === Number(fournisseurId))

  const addLigne = (stockItem) => {
    const exists = lignes.find((l) => l.stockId === stockItem.id)
    if (exists) return
    setLignes([...lignes, { stockId: stockItem.id, name: stockItem.name, unite: stockItem.unite, prixUnitaire: stockItem.prixUnitaire, quantite: 1 }])
  }

  const updateQty = (stockId, qty) => setLignes(lignes.map((l) => l.stockId === stockId ? { ...l, quantite: Number(qty) } : l))
  const removeLigne = (stockId) => setLignes(lignes.filter((l) => l.stockId !== stockId))

  const total = lignes.reduce((acc, l) => acc + l.quantite * l.prixUnitaire, 0)
  const fournisseur = fournisseurs.find((f) => f.id === Number(fournisseurId))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (lignes.length === 0) return alert('Ajoutez au moins un produit')
    addCommandeFournisseur({ fournisseurId: Number(fournisseurId), fournisseurName: fournisseur?.name, lignes, total, notes })
    onClose()
  }

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen flex flex-col" style={{maxHeight:'90vh'}}>
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-semibold text-gray-900">Nouvelle commande fournisseur</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Fournisseur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur *</label>
              <select className={inputCls} value={fournisseurId} onChange={(e) => { setFournisseurId(e.target.value); setLignes([]) }}>
                {fournisseurs.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              {fournisseur?.delai && <p className="text-xs text-gray-400 mt-1">Délai livraison : {fournisseur.delai}</p>}
            </div>

            {/* Produits du fournisseur */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Produits disponibles chez ce fournisseur</p>
              {fournisseurStock.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center bg-gray-50 rounded-lg">Aucun produit en stock lié à ce fournisseur</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {fournisseurStock.map((s) => {
                    const inOrder = lignes.find((l) => l.stockId === s.id)
                    return (
                      <button type="button" key={s.id} onClick={() => addLigne(s)}
                        className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${inOrder ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <p className="font-medium text-gray-900">{s.name}</p>
                        <p className="text-gray-400">{s.prixUnitaire} € / {s.unite} — stock actuel : {s.quantite}</p>
                        {inOrder && <span className="text-green-600 font-bold">Ajouté</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Lignes de commande */}
            {lignes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Détail de la commande</p>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-gray-600">Produit</th>
                        <th className="text-center px-3 py-2 text-gray-600">Quantité</th>
                        <th className="text-right px-3 py-2 text-gray-600">P.U.</th>
                        <th className="text-right px-3 py-2 text-gray-600">Total</th>
                        <th className="px-2 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignes.map((l) => (
                        <tr key={l.stockId} className="border-t">
                          <td className="px-3 py-2 font-medium text-gray-900">{l.name}</td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="number" min="1" step="0.1" value={l.quantite}
                              onChange={(e) => updateQty(l.stockId, e.target.value)}
                              className="w-16 text-center border border-gray-300 rounded px-1 py-0.5 text-xs"
                            />
                            <span className="ml-1 text-gray-400">{l.unite}</span>
                          </td>
                          <td className="px-3 py-2 text-right text-gray-500">{l.prixUnitaire} €</td>
                          <td className="px-3 py-2 text-right font-semibold">{(l.quantite * l.prixUnitaire).toFixed(2)} €</td>
                          <td className="px-2 py-2">
                            <button type="button" onClick={() => removeLigne(l.stockId)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t bg-gray-50 font-semibold">
                        <td colSpan={3} className="px-3 py-2 text-right">Total HT</td>
                        <td colSpan={2} className="px-3 py-2 text-right text-green-700">{total.toFixed(2)} €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Instructions de livraison..." />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Annuler</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">Passer la commande</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CommandesFournisseurs() {
  const { commandesFournisseurs, recevoirCommande, updateCommandeStatut, deleteCommandeFournisseur } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [statutFilter, setStatutFilter] = useState('Tous')

  const filtered = commandesFournisseurs.filter((c) => {
    const matchSearch = (c.fournisseurName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.number || '').toLowerCase().includes(search.toLowerCase())
    const matchStatut = statutFilter === 'Tous' || c.statut === statutFilter
    return matchSearch && matchStatut
  }).sort((a, b) => new Date(b.date) - new Date(a.date))

  const enAttente = commandesFournisseurs.filter((c) => c.statut === 'En attente' || c.statut === 'Envoyée').length
  const totalDepense = commandesFournisseurs.filter((c) => c.statut === 'Reçue').reduce((acc, c) => acc + c.total, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes Fournisseurs</h1>
          <p className="text-gray-500 text-sm">{commandesFournisseurs.length} commande(s)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
          <Plus size={16} /> Commander
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <Clock size={18} className="mx-auto text-amber-500 mb-1" />
          <p className="text-xl font-bold text-gray-900">{enAttente}</p>
          <p className="text-xs text-gray-500">En cours</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <CheckCircle size={18} className="mx-auto text-green-500 mb-1" />
          <p className="text-xl font-bold text-gray-900">{commandesFournisseurs.filter((c) => c.statut === 'Reçue').length}</p>
          <p className="text-xs text-gray-500">Reçues</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <PackageCheck size={18} className="mx-auto text-blue-500 mb-1" />
          <p className="text-xl font-bold text-gray-900">{totalDepense.toFixed(0)} €</p>
          <p className="text-xs text-gray-500">Total achats</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="N° commande, fournisseur..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {['Tous', 'En attente', 'Envoyée', 'Reçue', 'Annulée'].map((s) => (
          <button key={s} onClick={() => setStatutFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statutFilter === s ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">N°</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Fournisseur</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Produits</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Total</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Statut</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-400">Aucune commande fournisseur</td></tr>}
            {filtered.map((cmd) => (
              <tr key={cmd.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium text-gray-900">{cmd.number}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{cmd.fournisseurName}</td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-xs">
                  {cmd.lignes?.map((l) => `${l.name} ×${l.quantite}${l.unite}`).join(', ')}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(cmd.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{cmd.total?.toFixed(2)} €</td>
                <td className="px-4 py-3 text-center">
                  <select value={cmd.statut} onChange={(e) => updateCommandeStatut(cmd.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUT_COLOR[cmd.statut] || 'bg-gray-100 text-gray-600'}`}>
                    {Object.keys(STATUT_COLOR).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {cmd.statut !== 'Reçue' && cmd.statut !== 'Annulée' && (
                      <button onClick={() => recevoirCommande(cmd.id)} title="Marquer reçue + MAJ stock"
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg flex items-center gap-1 text-xs font-medium">
                        <PackageCheck size={14} /> Reçue
                      </button>
                    )}
                    <button onClick={() => deleteCommandeFournisseur(cmd.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <NouvelleCommandeModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
