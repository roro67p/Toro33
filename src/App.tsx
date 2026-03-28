import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Commandes from './pages/Commandes'
import Menu from './pages/Menu'
import Tables from './pages/Tables'
import Reservations from './pages/Reservations'
import Clients from './pages/Clients'
import Salaries from './pages/Salaries'
import Fournisseurs from './pages/Fournisseurs'
import Stock from './pages/Stock'
import Factures from './pages/Factures'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="menu" element={<Menu />} />
          <Route path="tables" element={<Tables />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="clients" element={<Clients />} />
          <Route path="salaries" element={<Salaries />} />
          <Route path="fournisseurs" element={<Fournisseurs />} />
          <Route path="stock" element={<Stock />} />
          <Route path="factures" element={<Factures />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
