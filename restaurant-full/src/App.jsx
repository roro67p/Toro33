import { useState } from 'react'
import useStore from './store/useStore'
import PublicLayout from './pages/public/PublicLayout'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'

export default function App() {
  const { adminAuthenticated } = useStore()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleOpenLogin = () => setShowLoginModal(true)
  const handleCloseLogin = () => setShowLoginModal(false)

  return (
    <>
      {adminAuthenticated ? (
        <AdminLayout />
      ) : (
        <PublicLayout onOpenLogin={handleOpenLogin} />
      )}
      {showLoginModal && !adminAuthenticated && (
        <AdminLogin onClose={handleCloseLogin} />
      )}
    </>
  )
}
