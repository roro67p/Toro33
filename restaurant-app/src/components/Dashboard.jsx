import { useStore } from '../store/useStore'
import { ShoppingCart, Users, FileText, TrendingUp, UtensilsCrossed, CheckCircle, Clock, AlertCircle, Grid3x3, CalendarDays, Package, Wallet, AlertTriangle, UserCog } from 'lucide-react'

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
  const { orders, clients, invoices, menuItems, tables, reservations, staff, stock, payments } = useStore()

  const totalRevenue = payments.reduce((acc, p) => acc + (p.total || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'En cours').length
  const unpaidInvoices = invoices.filter((i) => i.status === 'Emise').length
  const todayReservations = reservations.filter((r) => r.date === new Date().toISOString().split('T')[0] && r.status === 'Confirmee').length
  const occupiedTables = tables.filter((t) => t.status === 'occupee').length
  const lowStock = stock.filter((i) => i.quantity <= i.minStock).length
  const activeStaff = staff.filter((s) => s.status === 'actif').length

  const today = new Date().toISOString().split('T')[0]
  const todayPayments = payments.filter((p) => p.date?.startsWith(today))
  const todayRevenue = todayPayments.reduce((a, p) => a + (p.total || 0), 0)

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  const recentPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  const statusIcon = { 'En cours': <Clock size={14} className="text-amber-500" />, 'Servi': <CheckCircle size={14} className="text-green-500" />, 'Annule': <AlertCircle size={14} className="text-red-500" /> }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm">Bienvenue -- vue d'ensemble de votre restaurant</p>
      </div>

      {/* Low stock alert */}
      {lowStock > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-red-100" onClick={() => setPage('stock')}>
          <AlertTriangle size={20} className="text-red-500" />
          <div>
            <p className="font-semibold text-red-800 text-sm">{lowStock} article(s) en rupture de stock</p>
            <p className="text-xs text-red-600">Cliquez pour voir les details</p>
          </div>
        </div>
      )}

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="CA du jour" value={`${todayRevenue.toFixed(2)} EUR`} color="bg-emerald-500" sub={`${todayPayments.length} encaissement(s)`} />
        <StatCard icon={ShoppingCart} label="Commandes actives" value={pendingOrders} color="bg-amber-500" sub={`${orders.length} total`} />
        <StatCard icon={CalendarDays} label="Reservations ce soir" value={todayReservations} color="bg-purple-500" sub={`${reservations.length} total`} />
        <StatCard icon={Grid3x3} label="Tables occupees" value={`${occupiedTables}/${tables.length}`} color="bg-blue-500" sub={`${Math.round((occupiedTables / (tables.length || 1)) * 100)}% occupation`} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="CA total" value={`${totalRevenue.toFixed(2)} EUR`} color="bg-emerald-600" />
        <StatCard icon={Users} label="Clients" value={clients.length} color="bg-blue-600" />
        <StatCard icon={FileText} label="Factures impayees" value={unpaidInvoices} color="bg-red-500" />
        <StatCard icon={UserCog} label="Personnel actif" value={activeStaff} color="bg-teal-500" sub={`${staff.reduce((a, s) => a + (s.salary || 0), 0)} EUR/mois`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Commandes recentes</h2>
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
                  <span className="font-semibold">{o.total?.toFixed(2)} EUR</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Derniers encaissements</h2>
            <button onClick={() => setPage('cashregister')} className="text-emerald-600 text-sm hover:underline">Voir tout</button>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Aucun encaissement</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{p.number}</span>
                    <span className="text-gray-500 ml-2">{p.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-600">{p.total?.toFixed(2)} EUR</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{p.method}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu + Stock overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Apercu du menu</h2>
            <button onClick={() => setPage('menu')} className="text-amber-600 text-sm hover:underline">Gerer</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Entrees', 'Plats', 'Desserts', 'Boissons'].map((cat) => {
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

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Alertes stock</h2>
            <button onClick={() => setPage('stock')} className="text-orange-600 text-sm hover:underline">Gerer</button>
          </div>
          {lowStock === 0 ? (
            <div className="text-center py-6">
              <Package size={32} className="mx-auto text-green-400 mb-2" />
              <p className="text-green-600 font-medium">Tous les stocks sont OK</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stock.filter((i) => i.quantity <= i.minStock).slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <span className="text-red-600 font-semibold">{item.quantity} {item.unit} (min: {item.minStock})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
