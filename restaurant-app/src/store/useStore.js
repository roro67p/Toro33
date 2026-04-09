import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialMenuItems = [
  { id: 1, name: 'Salade Cesar', category: 'Entrees', price: 9.5, description: 'Salade romaine, parmesan, croutons', available: true },
  { id: 2, name: 'Soupe a l\'oignon', category: 'Entrees', price: 8.0, description: 'Soupe gratinee traditionnelle', available: true },
  { id: 3, name: 'Entrecote grillee', category: 'Plats', price: 24.5, description: '300g, frites maison, sauce au choix', available: true },
  { id: 4, name: 'Saumon roti', category: 'Plats', price: 22.0, description: 'Legumes de saison, beurre citron', available: true },
  { id: 5, name: 'Poulet fermier', category: 'Plats', price: 18.5, description: 'Roti, pommes de terre, jus', available: true },
  { id: 6, name: 'Creme brulee', category: 'Desserts', price: 7.5, description: 'Recette maison a la vanille', available: true },
  { id: 7, name: 'Tarte Tatin', category: 'Desserts', price: 8.0, description: 'Pommes caramelisees, creme fraiche', available: true },
  { id: 8, name: 'Vin rouge (pichet 50cl)', category: 'Boissons', price: 12.0, description: 'Selection du chef', available: true },
  { id: 9, name: 'Eau minerale', category: 'Boissons', price: 3.5, description: 'Plate ou gazeuse', available: true },
]

const initialClients = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.fr', phone: '06 12 34 56 78', address: '12 rue de la Paix, Paris', notes: 'Client fidele' },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@email.fr', phone: '06 98 76 54 32', address: '5 avenue Victor Hugo, Lyon', notes: 'Vegetarienne' },
]

const initialTables = [
  { id: 1, number: 1, seats: 2, zone: 'Terrasse', status: 'libre' },
  { id: 2, number: 2, seats: 4, zone: 'Terrasse', status: 'libre' },
  { id: 3, number: 3, seats: 2, zone: 'Salle', status: 'libre' },
  { id: 4, number: 4, seats: 6, zone: 'Salle', status: 'libre' },
  { id: 5, number: 5, seats: 4, zone: 'Salle', status: 'libre' },
  { id: 6, number: 6, seats: 8, zone: 'Salon prive', status: 'libre' },
  { id: 7, number: 7, seats: 2, zone: 'Salle', status: 'libre' },
  { id: 8, number: 8, seats: 4, zone: 'Terrasse', status: 'libre' },
  { id: 9, number: 9, seats: 6, zone: 'Salle', status: 'libre' },
  { id: 10, number: 10, seats: 10, zone: 'Salon prive', status: 'libre' },
]

const initialStaff = [
  { id: 1, name: 'Pierre Leroy', role: 'Chef cuisinier', phone: '06 11 22 33 44', email: 'pierre@restopro.fr', status: 'actif', salary: 3200 },
  { id: 2, name: 'Sophie Bernard', role: 'Serveur/Serveuse', phone: '06 55 66 77 88', email: 'sophie@restopro.fr', status: 'actif', salary: 1800 },
  { id: 3, name: 'Lucas Petit', role: 'Serveur/Serveuse', phone: '06 22 33 44 55', email: 'lucas@restopro.fr', status: 'actif', salary: 1800 },
  { id: 4, name: 'Emma Moreau', role: 'Commis de cuisine', phone: '06 33 44 55 66', email: 'emma@restopro.fr', status: 'actif', salary: 1600 },
  { id: 5, name: 'Thomas Dubois', role: 'Barman', phone: '06 44 55 66 77', email: 'thomas@restopro.fr', status: 'actif', salary: 1900 },
]

const initialStock = [
  { id: 1, name: 'Boeuf entrecote (kg)', category: 'Viandes', quantity: 15, unit: 'kg', minStock: 5, costPerUnit: 25.0 },
  { id: 2, name: 'Saumon frais (kg)', category: 'Poissons', quantity: 8, unit: 'kg', minStock: 3, costPerUnit: 18.0 },
  { id: 3, name: 'Poulet fermier (kg)', category: 'Viandes', quantity: 12, unit: 'kg', minStock: 4, costPerUnit: 12.0 },
  { id: 4, name: 'Salade romaine', category: 'Legumes', quantity: 20, unit: 'pieces', minStock: 8, costPerUnit: 1.5 },
  { id: 5, name: 'Pommes de terre (kg)', category: 'Legumes', quantity: 30, unit: 'kg', minStock: 10, costPerUnit: 2.0 },
  { id: 6, name: 'Oignons (kg)', category: 'Legumes', quantity: 10, unit: 'kg', minStock: 3, costPerUnit: 1.8 },
  { id: 7, name: 'Creme fraiche (L)', category: 'Produits laitiers', quantity: 5, unit: 'L', minStock: 2, costPerUnit: 4.5 },
  { id: 8, name: 'Beurre (kg)', category: 'Produits laitiers', quantity: 4, unit: 'kg', minStock: 2, costPerUnit: 8.0 },
  { id: 9, name: 'Parmesan (kg)', category: 'Produits laitiers', quantity: 3, unit: 'kg', minStock: 1, costPerUnit: 22.0 },
  { id: 10, name: 'Vin rouge (bouteille)', category: 'Boissons', quantity: 25, unit: 'bouteilles', minStock: 10, costPerUnit: 6.0 },
  { id: 11, name: 'Eau minerale (pack)', category: 'Boissons', quantity: 15, unit: 'packs', minStock: 5, costPerUnit: 3.0 },
  { id: 12, name: 'Pommes (kg)', category: 'Fruits', quantity: 8, unit: 'kg', minStock: 3, costPerUnit: 3.5 },
  { id: 13, name: 'Oeufs (douzaine)', category: 'Produits laitiers', quantity: 6, unit: 'douzaines', minStock: 2, costPerUnit: 4.0 },
  { id: 14, name: 'Sucre (kg)', category: 'Epicerie', quantity: 5, unit: 'kg', minStock: 2, costPerUnit: 1.2 },
  { id: 15, name: 'Farine (kg)', category: 'Epicerie', quantity: 8, unit: 'kg', minStock: 3, costPerUnit: 1.0 },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // ==================== MENU ====================
      menuItems: initialMenuItems,
      addMenuItem: (item) => set((s) => ({ menuItems: [...s.menuItems, { ...item, id: Date.now(), available: true }] })),
      updateMenuItem: (id, data) => set((s) => ({ menuItems: s.menuItems.map((i) => i.id === id ? { ...i, ...data } : i) })),
      deleteMenuItem: (id) => set((s) => ({ menuItems: s.menuItems.filter((i) => i.id !== id) })),
      toggleAvailability: (id) => set((s) => ({ menuItems: s.menuItems.map((i) => i.id === id ? { ...i, available: !i.available } : i) })),

      // ==================== CLIENTS ====================
      clients: initialClients,
      addClient: (client) => set((s) => ({ clients: [...s.clients, { ...client, id: Date.now() }] })),
      updateClient: (id, data) => set((s) => ({ clients: s.clients.map((c) => c.id === id ? { ...c, ...data } : c) })),
      deleteClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),

      // ==================== ORDERS ====================
      orders: [],
      addOrder: (order) => set((s) => ({
        orders: [...s.orders, {
          ...order,
          id: Date.now(),
          date: new Date().toISOString(),
          status: 'En cours',
          number: `CMD-${String(s.orders.length + 1).padStart(4, '0')}`,
        }],
      })),
      updateOrderStatus: (id, status) => set((s) => ({ orders: s.orders.map((o) => o.id === id ? { ...o, status } : o) })),
      deleteOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      // ==================== INVOICES ====================
      invoices: [],
      createInvoice: (orderId) => set((s) => {
        const order = s.orders.find((o) => o.id === orderId)
        if (!order) return s
        const invoice = {
          id: Date.now(),
          number: `FAC-${String(s.invoices.length + 1).padStart(4, '0')}`,
          orderId,
          date: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
          items: order.items,
          clientId: order.clientId,
          clientName: order.clientName,
          subtotal: order.total,
          tva: order.total * 0.1,
          total: order.total * 1.1,
          status: 'Emise',
          notes: '',
        }
        return { invoices: [...s.invoices, invoice] }
      }),
      updateInvoiceStatus: (id, status) => set((s) => ({ invoices: s.invoices.map((i) => i.id === id ? { ...i, status } : i) })),
      deleteInvoice: (id) => set((s) => ({ invoices: s.invoices.filter((i) => i.id !== id) })),

      // ==================== TABLES ====================
      tables: initialTables,
      addTable: (table) => set((s) => ({ tables: [...s.tables, { ...table, id: Date.now(), status: 'libre' }] })),
      updateTable: (id, data) => set((s) => ({ tables: s.tables.map((t) => t.id === id ? { ...t, ...data } : t) })),
      deleteTable: (id) => set((s) => ({ tables: s.tables.filter((t) => t.id !== id) })),
      setTableStatus: (id, status) => set((s) => ({ tables: s.tables.map((t) => t.id === id ? { ...t, status } : t) })),

      // ==================== RESERVATIONS ====================
      reservations: [],
      addReservation: (resa) => set((s) => ({
        reservations: [...s.reservations, {
          ...resa,
          id: Date.now(),
          number: `RES-${String(s.reservations.length + 1).padStart(4, '0')}`,
          status: 'Confirmee',
          createdAt: new Date().toISOString(),
        }],
      })),
      updateReservation: (id, data) => set((s) => ({ reservations: s.reservations.map((r) => r.id === id ? { ...r, ...data } : r) })),
      deleteReservation: (id) => set((s) => ({ reservations: s.reservations.filter((r) => r.id !== id) })),
      updateReservationStatus: (id, status) => set((s) => ({ reservations: s.reservations.map((r) => r.id === id ? { ...r, status } : r) })),

      // ==================== STAFF ====================
      staff: initialStaff,
      addStaff: (member) => set((s) => ({ staff: [...s.staff, { ...member, id: Date.now(), status: 'actif' }] })),
      updateStaff: (id, data) => set((s) => ({ staff: s.staff.map((m) => m.id === id ? { ...m, ...data } : m) })),
      deleteStaff: (id) => set((s) => ({ staff: s.staff.filter((m) => m.id !== id) })),

      // ==================== STOCK / INVENTORY ====================
      stock: initialStock,
      addStockItem: (item) => set((s) => ({ stock: [...s.stock, { ...item, id: Date.now() }] })),
      updateStockItem: (id, data) => set((s) => ({ stock: s.stock.map((i) => i.id === id ? { ...i, ...data } : i) })),
      deleteStockItem: (id) => set((s) => ({ stock: s.stock.filter((i) => i.id !== id) })),
      adjustStock: (id, delta) => set((s) => ({
        stock: s.stock.map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i),
      })),

      // ==================== CASH REGISTER / ENCAISSEMENTS ====================
      payments: [],
      addPayment: (payment) => set((s) => ({
        payments: [...s.payments, {
          ...payment,
          id: Date.now(),
          number: `PAY-${String(s.payments.length + 1).padStart(4, '0')}`,
          date: new Date().toISOString(),
        }],
      })),
      deletePayment: (id) => set((s) => ({ payments: s.payments.filter((p) => p.id !== id) })),
    }),
    { name: 'restaurant-storage' }
  )
)
