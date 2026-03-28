import { TrendingUp, ShoppingCart, Users, Grid3X3, AlertTriangle, Clock, Euro, Activity } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { Header } from '../components/Header'
import { StatCard } from '../components/StatCard'
import { Badge, getOrderStatusVariant } from '../components/Badge'
import { useStore } from '../store/useStore'
import { mockRevenueData } from '../data/mockData'

export default function Dashboard() {
  const tables = useStore((s) => s.tables)
  const orders = useStore((s) => s.orders)
  const clients = useStore((s) => s.clients)
  const stockItems = useStore((s) => s.stockItems)

  const occupiedTables = tables.filter((t) => t.status === 'occupée').length
  const todayOrders = orders.filter((o) => o.createdAt.startsWith('2026-03-28'))
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'en attente' || o.status === 'en préparation').length
  const lowStockCount = stockItems.filter((i) => i.quantity <= i.minLevel).length
  const monthRevenue = mockRevenueData.reduce((sum, d) => sum + d.revenue, 0)

  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  const categoryData = [
    { name: 'Entrées', value: 38 },
    { name: 'Plats', value: 52 },
    { name: 'Desserts', value: 28 },
    { name: 'Boissons', value: 45 },
    { name: 'Vins', value: 22 },
  ]

  return (
    <div>
      <Header title="Tableau de bord" subtitle="Vue d'ensemble de votre restaurant" />
      <div className="p-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Chiffre d'affaires du jour"
            value={`${todayRevenue.toFixed(2)} €`}
            subtitle="Aujourd'hui"
            icon={<Euro size={20} className="text-indigo-600" />}
            iconBg="bg-indigo-100"
            trend={{ value: 12, label: 'vs hier', positive: true }}
          />
          <StatCard
            title="Commandes du jour"
            value={todayOrders.length}
            subtitle={`${pendingOrders} en cours`}
            icon={<ShoppingCart size={20} className="text-emerald-600" />}
            iconBg="bg-emerald-100"
            trend={{ value: 8, label: 'vs hier', positive: true }}
          />
          <StatCard
            title="Tables occupées"
            value={`${occupiedTables} / ${tables.length}`}
            subtitle="En ce moment"
            icon={<Grid3X3 size={20} className="text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <StatCard
            title="Clients fidèles"
            value={clients.length}
            subtitle="Programme fidélité"
            icon={<Users size={20} className="text-purple-600" />}
            iconBg="bg-purple-100"
            trend={{ value: 5, label: 'ce mois', positive: true }}
          />
        </div>

        {/* Second row KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="CA du mois"
            value={`${monthRevenue.toLocaleString('fr-FR')} €`}
            subtitle="Mars 2026"
            icon={<TrendingUp size={20} className="text-indigo-600" />}
            iconBg="bg-indigo-100"
            trend={{ value: 15, label: 'vs mars dernier', positive: true }}
          />
          <StatCard
            title="Commandes en attente"
            value={pendingOrders}
            subtitle="À traiter"
            icon={<Clock size={20} className="text-amber-600" />}
            iconBg="bg-amber-100"
          />
          <StatCard
            title="Alertes stock"
            value={lowStockCount}
            subtitle="Produits sous seuil"
            icon={<AlertTriangle size={20} className="text-red-500" />}
            iconBg="bg-red-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue chart */}
          <div className="card xl:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Évolution du chiffre d'affaires</h3>
                <p className="text-sm text-gray-500">10 derniers jours</p>
              </div>
              <Activity size={18} className="text-indigo-500" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockRevenueData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `${v}€`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} €`, 'Chiffre d\'affaires']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Line
                  type="monotone" dataKey="revenue" stroke="#6366f1"
                  strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders by category */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Ventes par catégorie</h3>
                <p className="text-sm text-gray-500">Ce mois</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent orders + Table status */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent orders */}
          <div className="card">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Commandes récentes</h3>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="table-th">Table</th>
                    <th className="table-th">Serveur</th>
                    <th className="table-th">Total</th>
                    <th className="table-th">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="table-row">
                      <td className="table-td font-medium">Table {order.tableNumber}</td>
                      <td className="table-td text-gray-500">{order.waiter || '—'}</td>
                      <td className="table-td font-semibold">{order.total.toFixed(2)} €</td>
                      <td className="table-td">
                        <Badge label={order.status} variant={getOrderStatusVariant(order.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table overview */}
          <div className="card">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Statut des tables</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`rounded-xl p-3 text-center border-2 transition-colors ${
                    table.status === 'libre'
                      ? 'bg-emerald-50 border-emerald-200'
                      : table.status === 'occupée'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <p className={`text-lg font-bold ${
                    table.status === 'libre' ? 'text-emerald-700'
                    : table.status === 'occupée' ? 'text-red-700'
                    : 'text-amber-700'
                  }`}>{table.number}</p>
                  <p className={`text-xs mt-0.5 ${
                    table.status === 'libre' ? 'text-emerald-600'
                    : table.status === 'occupée' ? 'text-red-600'
                    : 'text-amber-600'
                  }`}>{table.seats} pl.</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-3 h-3 rounded bg-emerald-400" />
                <span>Libre ({tables.filter((t) => t.status === 'libre').length})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-3 h-3 rounded bg-red-400" />
                <span>Occupée ({tables.filter((t) => t.status === 'occupée').length})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-3 h-3 rounded bg-amber-400" />
                <span>Réservée ({tables.filter((t) => t.status === 'réservée').length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
