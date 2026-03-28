import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialMenuItems = [
  { id: 1, name: 'Salade César', category: 'Entrées', price: 9.5, description: 'Salade romaine, parmesan, croûtons', available: true },
  { id: 2, name: 'Soupe à l\'oignon', category: 'Entrées', price: 8.0, description: 'Soupe gratinée traditionnelle', available: true },
  { id: 3, name: 'Entrecôte grillée', category: 'Plats', price: 24.5, description: '300g, frites maison, sauce au choix', available: true },
  { id: 4, name: 'Saumon rôti', category: 'Plats', price: 22.0, description: 'Légumes de saison, beurre citron', available: true },
  { id: 5, name: 'Poulet fermier', category: 'Plats', price: 18.5, description: 'Rôti, pommes de terre, jus', available: true },
  { id: 6, name: 'Crème brûlée', category: 'Desserts', price: 7.5, description: 'Recette maison à la vanille', available: true },
  { id: 7, name: 'Tarte Tatin', category: 'Desserts', price: 8.0, description: 'Pommes caramélisées, crème fraîche', available: true },
  { id: 8, name: 'Vin rouge (pichet 50cl)', category: 'Boissons', price: 12.0, description: 'Sélection du chef', available: true },
  { id: 9, name: 'Eau minérale', category: 'Boissons', price: 3.5, description: 'Plate ou gazeuse', available: true },
]

const initialClients = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.fr', phone: '06 12 34 56 78', address: '12 rue de la Paix, Paris', notes: 'Client fidèle' },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@email.fr', phone: '06 98 76 54 32', address: '5 avenue Victor Hugo, Lyon', notes: 'Végétarienne' },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // Menu
      menuItems: initialMenuItems,
      addMenuItem: (item) => set((s) => ({ menuItems: [...s.menuItems, { ...item, id: Date.now(), available: true }] })),
      updateMenuItem: (id, data) => set((s) => ({ menuItems: s.menuItems.map((i) => i.id === id ? { ...i, ...data } : i) })),
      deleteMenuItem: (id) => set((s) => ({ menuItems: s.menuItems.filter((i) => i.id !== id) })),
      toggleAvailability: (id) => set((s) => ({ menuItems: s.menuItems.map((i) => i.id === id ? { ...i, available: !i.available } : i) })),

      // Clients
      clients: initialClients,
      addClient: (client) => set((s) => ({ clients: [...s.clients, { ...client, id: Date.now() }] })),
      updateClient: (id, data) => set((s) => ({ clients: s.clients.map((c) => c.id === id ? { ...c, ...data } : c) })),
      deleteClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),

      // Orders
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

      // Invoices
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
          status: 'Émise',
          notes: '',
        }
        return { invoices: [...s.invoices, invoice] }
      }),
      updateInvoiceStatus: (id, status) => set((s) => ({ invoices: s.invoices.map((i) => i.id === id ? { ...i, status } : i) })),
      deleteInvoice: (id) => set((s) => ({ invoices: s.invoices.filter((i) => i.id !== id) })),
    }),
    { name: 'restaurant-storage' }
  )
)
