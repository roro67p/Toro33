import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  RestaurantTable, MenuItem, Order, Reservation, Client,
  Employee, Supplier, StockItem, Invoice
} from '../types'
import {
  mockTables, mockMenuItems, mockOrders, mockReservations,
  mockClients, mockEmployees, mockSuppliers, mockStockItems, mockInvoices
} from '../data/mockData'

interface AppState {
  // Data
  tables: RestaurantTable[]
  menuItems: MenuItem[]
  orders: Order[]
  reservations: Reservation[]
  clients: Client[]
  employees: Employee[]
  suppliers: Supplier[]
  stockItems: StockItem[]
  invoices: Invoice[]

  // Tables
  addTable: (table: RestaurantTable) => void
  updateTable: (id: string, updates: Partial<RestaurantTable>) => void
  deleteTable: (id: string) => void

  // Menu
  addMenuItem: (item: MenuItem) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void

  // Orders
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  deleteOrder: (id: string) => void

  // Reservations
  addReservation: (reservation: Reservation) => void
  updateReservation: (id: string, updates: Partial<Reservation>) => void
  deleteReservation: (id: string) => void

  // Clients
  addClient: (client: Client) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void

  // Employees
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void

  // Suppliers
  addSupplier: (supplier: Supplier) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void

  // Stock
  addStockItem: (item: StockItem) => void
  updateStockItem: (id: string, updates: Partial<StockItem>) => void
  deleteStockItem: (id: string) => void

  // Invoices
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial data from mock
      tables: mockTables,
      menuItems: mockMenuItems,
      orders: mockOrders,
      reservations: mockReservations,
      clients: mockClients,
      employees: mockEmployees,
      suppliers: mockSuppliers,
      stockItems: mockStockItems,
      invoices: mockInvoices,

      // Tables
      addTable: (table) => set((s) => ({ tables: [...s.tables, table] })),
      updateTable: (id, updates) => set((s) => ({
        tables: s.tables.map((t) => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTable: (id) => set((s) => ({ tables: s.tables.filter((t) => t.id !== id) })),

      // Menu
      addMenuItem: (item) => set((s) => ({ menuItems: [...s.menuItems, item] })),
      updateMenuItem: (id, updates) => set((s) => ({
        menuItems: s.menuItems.map((m) => m.id === id ? { ...m, ...updates } : m)
      })),
      deleteMenuItem: (id) => set((s) => ({ menuItems: s.menuItems.filter((m) => m.id !== id) })),

      // Orders
      addOrder: (order) => set((s) => ({ orders: [...s.orders, order] })),
      updateOrder: (id, updates) => set((s) => ({
        orders: s.orders.map((o) => o.id === id ? { ...o, ...updates } : o)
      })),
      deleteOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      // Reservations
      addReservation: (res) => set((s) => ({ reservations: [...s.reservations, res] })),
      updateReservation: (id, updates) => set((s) => ({
        reservations: s.reservations.map((r) => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteReservation: (id) => set((s) => ({ reservations: s.reservations.filter((r) => r.id !== id) })),

      // Clients
      addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),
      updateClient: (id, updates) => set((s) => ({
        clients: s.clients.map((c) => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),

      // Employees
      addEmployee: (emp) => set((s) => ({ employees: [...s.employees, emp] })),
      updateEmployee: (id, updates) => set((s) => ({
        employees: s.employees.map((e) => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteEmployee: (id) => set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),

      // Suppliers
      addSupplier: (sup) => set((s) => ({ suppliers: [...s.suppliers, sup] })),
      updateSupplier: (id, updates) => set((s) => ({
        suppliers: s.suppliers.map((su) => su.id === id ? { ...su, ...updates } : su)
      })),
      deleteSupplier: (id) => set((s) => ({ suppliers: s.suppliers.filter((su) => su.id !== id) })),

      // Stock
      addStockItem: (item) => set((s) => ({ stockItems: [...s.stockItems, item] })),
      updateStockItem: (id, updates) => set((s) => ({
        stockItems: s.stockItems.map((st) => st.id === id ? { ...st, ...updates } : st)
      })),
      deleteStockItem: (id) => set((s) => ({ stockItems: s.stockItems.filter((st) => st.id !== id) })),

      // Invoices
      addInvoice: (invoice) => set((s) => ({ invoices: [...s.invoices, invoice] })),
      updateInvoice: (id, updates) => set((s) => ({
        invoices: s.invoices.map((f) => f.id === id ? { ...f, ...updates } : f)
      })),
      deleteInvoice: (id) => set((s) => ({ invoices: s.invoices.filter((f) => f.id !== id) })),
    }),
    {
      name: 'toro33-restaurant-storage',
    }
  )
)
