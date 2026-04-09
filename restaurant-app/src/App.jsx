import { useState } from 'react'
import './index.css'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import MenuPage from './components/Menu'
import Clients from './components/Clients'
import Orders from './components/Orders'
import Invoices from './components/Invoices'
import Tables from './components/Tables'
import Reservations from './components/Reservations'
import Staff from './components/Staff'
import Stock from './components/Stock'
import CashRegister from './components/CashRegister'

export default function App() {
  const [page, setPage] = useState('dashboard')

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard setPage={setPage} />
      case 'menu': return <MenuPage />
      case 'clients': return <Clients />
      case 'orders': return <Orders setPage={setPage} />
      case 'invoices': return <Invoices />
      case 'tables': return <Tables />
      case 'reservations': return <Reservations />
      case 'staff': return <Staff />
      case 'stock': return <Stock />
      case 'cashregister': return <CashRegister />
      default: return <Dashboard setPage={setPage} />
    }
  }

  return (
    <Layout page={page} setPage={setPage}>
      {renderPage()}
    </Layout>
  )
}
