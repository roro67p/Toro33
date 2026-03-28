import { useStore } from '../store/useStore'
import { ShoppingCart, Users, FileText, TrendingUp, UtensilsCrossed, CheckCircle, Clock, AlertCircle } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard({ setPage }) {
  const { orders, clients, invoices, menuItems } = useStore()

  const totalRevenue = invoices.reduce((acc, i) => acc + i.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'En cours').length
  const paidInvoices = invoices.filter((i) => i.status === 'Payée').length
  const unpaidInvoices = invoices.filter((i) => i.status === 'Émise').length

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  const recentInvoices = [...invoices].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  const statusIcon = { 'En cours': <Clock size={14} className="text-amber-500" />, 'Servi': <CheckCircle size={14} className="text-green-500" />, 'Annulé': <AlertCircle size={14} className="text-red-500" /> }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm">Bienvenue — vue d'ensemble de votre restaurant</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Chiffre d'affaires" value={`${totalRevenue.toFixed(2)} €`} color="bg-emerald-500" sub="TTC toutes factures" />
        <StatCard icon={ShoppingCart} label="Commandes actives" value={pendingOrders} color="bg-amber-500" sub={`${orders.length} total`} />
        <StatCard icon={Users} label="Clients" value={clients.length} color="bg-blue-500" />
        <StatCard icon={FileText} label="Factures impayées" value={unpaidInvoices} color="bg-red-500" sub={`${paidInvoices} payée(s)`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
            <button onClick={() => setPage('orders')} className="text-amber-600 text-sm hover:underline">Voir tout</button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Aucune commande</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {statusIcon[o.status]}
                    <span className="font-medium">{o.number}</span>
                    <span className="text-gray-500">{o.clientName || 'Client comptoir'}</span>
                  </div>
                  <span className="font-semibold">{o.total?.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Factures récentes</h2>
            <button onClick={() => setPage('invoices')} className="text-amber-600 text-sm hover:underline">Voir tout</button>
          </div>
          {recentInvoices.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Aucune facture</p>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{inv.number}</span>
                    <span className="text-gray-500 ml-2">{inv.clientName || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{inv.total?.toFixed(2)} €</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inv.status === 'Payée' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Aperçu du menu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Entrées', 'Plats', 'Desserts', 'Boissons'].map((cat) => {
            const count = menuItems.filter((m) => m.category === cat).length
            const avail = menuItems.filter((m) => m.category === cat && m.available).length
            return (
              <div key={cat} className="text-center p-4 bg-gray-50 rounded-xl">
                <UtensilsCrossed size={20} className="mx-auto text-amber-500 mb-2" />
                <p className="font-bold text-lg text-gray-900">{count}</p>
                <p className="text-xs text-gray-500">{cat}</p>
                <p className="text-xs text-green-600">{avail} dispo</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
