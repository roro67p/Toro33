import useAppStore from './store/useAppStore.js'
import Header from './components/Header.jsx'
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Matches from './pages/Matches.jsx'
import Squad from './pages/Squad.jsx'
import Standings from './pages/Standings.jsx'
import Stats from './pages/Stats.jsx'
import Stadium from './pages/Stadium.jsx'
import History from './pages/History.jsx'
import FanZone from './pages/FanZone.jsx'

const pages = {
  home:      Home,
  matches:   Matches,
  squad:     Squad,
  standings: Standings,
  stats:     Stats,
  stadium:   Stadium,
  history:   History,
  fanzone:   FanZone,
}

export default function App() {
  const { activePage } = useAppStore()
  const PageComponent = pages[activePage] || Home

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <PageComponent />
      </main>

      <Footer />
    </div>
  )
}
