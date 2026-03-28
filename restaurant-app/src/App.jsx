import { useState } from 'react'
import './index.css'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import MenuPage from './components/Menu'
import Clients from './components/Clients'
import Orders from './components/Orders'
import Invoices from './components/Invoices'
import Fournisseurs from './components/Fournisseurs'
import Stock from './components/Stock'
import Tables from './components/Tables'
import CommandesFournisseurs from './components/CommandesFournisseurs'

export default function App() {
  const [page, setPage] = useState('dashboard')

  const renderPage = () => {
    switch (page) {
      case 'dashboard':    return <Dashboard setPage={setPage} />
      case 'menu':         return <MenuPage />
      case 'tables':       return <Tables setPage={setPage} />
      case 'clients':      return <Clients />
      case 'orders':       return <Orders setPage={setPage} />
      case 'invoices':     return <Invoices />
      case 'fournisseurs':          return <Fournisseurs setPage={setPage} />
      case 'commandes-fournisseurs': return <CommandesFournisseurs />
      case 'stock':                 return <Stock />
      default:             return <Dashboard setPage={setPage} />
    }
  }

  return (
    <Layout page={page} setPage={setPage}>
      {renderPage()}
    </Layout>
  )
}
