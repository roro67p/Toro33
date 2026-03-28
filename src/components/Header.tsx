import { Bell, Search } from 'lucide-react'
import { useStore } from '../store/useStore'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const stockItems = useStore((s) => s.stockItems)
  const lowStockCount = stockItems.filter((i) => i.quantity <= i.minLevel).length

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-52 transition-all"
          />
        </div>
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          {lowStockCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {lowStockCount}
            </span>
          )}
        </button>
        {/* Date */}
        <div className="hidden lg:block text-right">
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </header>
  )
}
