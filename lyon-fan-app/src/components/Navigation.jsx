import { Home, Calendar, Users, BarChart2, TrendingUp, MapPin, Trophy, Star } from 'lucide-react'
import useAppStore from '../store/useAppStore.js'

const tabs = [
  { id: 'home',       label: 'Accueil',      Icon: Home },
  { id: 'matches',    label: 'Matchs',       Icon: Calendar },
  { id: 'squad',      label: 'Effectif',     Icon: Users },
  { id: 'standings',  label: 'Classement',   Icon: BarChart2 },
  { id: 'stats',      label: 'Statistiques', Icon: TrendingUp },
  { id: 'stadium',    label: 'Stade',        Icon: MapPin },
  { id: 'history',    label: 'Palmarès',     Icon: Trophy },
  { id: 'fanzone',    label: 'Fan Zone',     Icon: Star },
]

export default function Navigation() {
  const { activePage, setActivePage } = useAppStore()

  return (
    <nav className="bg-[#032974] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(({ id, label, Icon }) => {
            const isActive = activePage === id
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-3 min-w-fit whitespace-nowrap text-xs font-semibold
                  transition-all duration-200 border-b-2 relative
                  ${isActive
                    ? 'text-white border-[#E30613] bg-white/5'
                    : 'text-blue-200 border-transparent hover:text-white hover:bg-white/10 hover:border-white/30'
                  }
                `}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="hidden sm:block">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E30613] rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
