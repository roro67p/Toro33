import './index.css'
import useStore from './store/useStore'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import Catalog from './components/Catalog'
import CartSidebar from './components/CartSidebar'
import DriveBooking from './components/DriveBooking'
import AuthModal from './components/AuthModal'
import OrderConfirmation from './components/OrderConfirmation'

export default function App() {
  const currentPage = useStore(s => s.currentPage)
  const cartOpen = useStore(s => s.cartOpen)
  const authModal = useStore(s => s.authModal)

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />
      case 'catalog': return <Catalog />
      case 'drive': return <DriveBooking />
      case 'confirmation': return <OrderConfirmation />
      default: return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      {cartOpen && <CartSidebar />}
      {authModal && <AuthModal />}
    </div>
  )
}
