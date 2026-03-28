import { useState } from 'react'
import {
  LayoutDashboard, UtensilsCrossed, Users, ShoppingCart, FileText,
  Menu, X, ChefHat, Truck, Package, Table2, ClipboardList
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'tables', label: 'Tables', icon: Table2 },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  { id: 'invoices', label: 'Factures', icon: FileText },
  { id: 'fournisseurs', label: 'Fournisseurs', icon: Truck },
  { id: 'commandes-fournisseurs', label: 'Achats', icon: ClipboardList },
  { id: 'stock', label: 'Stock', icon: Package },
]

export default function Layout({ page, setPage, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-700">
          <ChefHat className="text-amber-400 shrink-0" size={28} />
          {sidebarOpen && <span className="font-bold text-lg text-amber-400">RestoPro</span>}
        </div>
        <nav className="flex-1 p-2 space-y-1 mt-2 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${page === id ? 'bg-amber-500 text-gray-900' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && label}
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
