import { useState } from 'react'
import useStore from './store/useStore'
import PublicLayout from './pages/public/PublicLayout'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'

export default function App() {
  const { isAdminMode, adminAuthenticated } = useStore()
  const [showLogin, setShowLogin] = useState(false)

  if (isAdminMode && adminAuthenticated) return <AdminLayout />
  if (showLogin) return <AdminLogin onClose={() => setShowLogin(false)} />
  return <PublicLayout onOpenLogin={() => setShowLogin(true)} />
}
