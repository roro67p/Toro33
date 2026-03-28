import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, Grid3X3,
  CalendarDays, Users, UserCog, Truck, Package, FileText, ChefHat
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/commandes', label: 'Commandes', icon: ShoppingCart },
  { path: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { path: '/tables', label: 'Tables', icon: Grid3X3 },
  { path: '/reservations', label: 'Réservations', icon: CalendarDays },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/salaries', label: 'Salariés', icon: UserCog },
  { path: '/fournisseurs', label: 'Fournisseurs', icon: Truck },
  { path: '/stock', label: 'Stock', icon: Package },
  { path: '/factures', label: 'Factures', icon: FileText },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <ChefHat size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">Toro33</h1>
          <p className="text-xs text-gray-400">Gestion Restaurant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
            }
          >
            <Icon size={17} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            JM
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">Julie Moreau</p>
            <p className="text-xs text-gray-400 truncate">Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
