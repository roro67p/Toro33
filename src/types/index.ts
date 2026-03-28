// ─── Table ───────────────────────────────────────────────────────────────────
export type TableStatus = 'libre' | 'occupée' | 'réservée'

export interface RestaurantTable {
  id: string
  number: number
  seats: number
  status: TableStatus
  zone: string
  currentOrderId?: string
}

// ─── Menu ────────────────────────────────────────────────────────────────────
export type MenuCategory = 'Entrées' | 'Plats' | 'Desserts' | 'Boissons' | 'Vins' | 'Cocktails'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  available: boolean
  image?: string
  allergens?: string[]
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus = 'en attente' | 'en préparation' | 'servie' | 'payée'

export interface OrderItem {
  menuItemId: string
  menuItemName: string
  quantity: number
  unitPrice: number
  notes?: string
}

export interface Order {
  id: string
  tableId: string
  tableNumber: number
  items: OrderItem[]
  status: OrderStatus
  createdAt: string
  updatedAt: string
  total: number
  waiter?: string
  notes?: string
}

// ─── Reservation ─────────────────────────────────────────────────────────────
export type ReservationStatus = 'confirmée' | 'en attente' | 'annulée' | 'arrivée'

export interface Reservation {
  id: string
  clientName: string
  clientPhone: string
  tableId: string
  tableNumber: number
  date: string
  time: string
  guests: number
  status: ReservationStatus
  notes?: string
  createdAt: string
}

// ─── Client ──────────────────────────────────────────────────────────────────
export type ClientTier = 'Bronze' | 'Argent' | 'Or' | 'Platine'

export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate?: string
  visits: number
  points: number
  totalSpent: number
  tier: ClientTier
  createdAt: string
  lastVisit?: string
  notes?: string
}

// ─── Employee ─────────────────────────────────────────────────────────────────
export type EmployeeStatus = 'actif' | 'congé' | 'absent'
export type EmployeeRole = 'Serveur' | 'Chef' | 'Sous-Chef' | 'Barman' | 'Maître d\'hôtel' | 'Plongeur' | 'Manager' | 'Caissier'

export interface Employee {
  id: string
  firstName: string
  lastName: string
  role: EmployeeRole
  email: string
  phone: string
  salary: number
  status: EmployeeStatus
  hireDate: string
  schedule: string
  avatar?: string
}

// ─── Supplier ─────────────────────────────────────────────────────────────────
export type SupplierStatus = 'actif' | 'inactif'
export type SupplierCategory = 'Viandes' | 'Poissons' | 'Légumes' | 'Fruits' | 'Boissons' | 'Épicerie' | 'Produits laitiers' | 'Vins & Spiritueux'

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  category: SupplierCategory
  address: string
  lastOrder: string
  status: SupplierStatus
  notes?: string
}

// ─── Stock ────────────────────────────────────────────────────────────────────
export type StockUnit = 'kg' | 'L' | 'unités' | 'boîtes' | 'bouteilles' | 'g'

export interface StockItem {
  id: string
  name: string
  quantity: number
  unit: StockUnit
  minLevel: number
  supplierId: string
  supplierName: string
  unitPrice: number
  lastUpdated: string
  category: string
}

// ─── Invoice ─────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'payée' | 'en attente' | 'annulée'

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  orderId?: string
  clientName: string
  tableNumber?: number
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: InvoiceStatus
  createdAt: string
  paidAt?: string
  notes?: string
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface DashboardStats {
  todayRevenue: number
  todayOrders: number
  activeClients: number
  occupiedTables: number
  totalTables: number
  pendingOrders: number
  lowStockAlerts: number
  monthRevenue: number
}
