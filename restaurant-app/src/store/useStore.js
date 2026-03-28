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

const initialFournisseurs = [
  { id: 1, name: 'Boucherie Centrale', contact: 'Michel Lebrun', phone: '01 23 45 67 89', email: 'michel@boucheriecentrale.fr', address: '15 rue du Commerce, Paris', produits: 'Steak, Poulet, Veau', delai: '48h', notes: 'Livraison mardi et vendredi' },
  { id: 2, name: 'Légumes du Marché', contact: 'Sophie Bernard', phone: '01 98 76 54 32', email: 'contact@legumesdumarche.fr', address: '8 avenue des Fleurs, Rungis', produits: 'Salade, Frites, Légumes', delai: '24h', notes: 'Commande min. 50€' },
  { id: 3, name: 'Cave & Vins', contact: 'Pierre Dupuis', phone: '01 11 22 33 44', email: 'pierre@cavedesvins.fr', address: '3 rue du Château, Bordeaux', produits: 'Vins, Champagne', delai: '72h', notes: '' },
]

const initialStock = [
  { id: 1, name: 'Steak (kg)', fournisseurId: 1, quantite: 15, unite: 'kg', seuilAlerte: 5, prixUnitaire: 18.0 },
  { id: 2, name: 'Poulet (kg)', fournisseurId: 1, quantite: 10, unite: 'kg', seuilAlerte: 4, prixUnitaire: 8.5 },
  { id: 3, name: 'Salade (pièces)', fournisseurId: 2, quantite: 20, unite: 'pcs', seuilAlerte: 8, prixUnitaire: 1.2 },
  { id: 4, name: 'Pommes de terre (kg)', fournisseurId: 2, quantite: 30, unite: 'kg', seuilAlerte: 10, prixUnitaire: 0.8 },
  { id: 5, name: 'Vin rouge (bouteilles)', fournisseurId: 3, quantite: 24, unite: 'btl', seuilAlerte: 6, prixUnitaire: 6.5 },
  { id: 6, name: 'Saumon (kg)', fournisseurId: 2, quantite: 3, unite: 'kg', seuilAlerte: 4, prixUnitaire: 22.0 },
]

const initialTables = [
  { id: 1, numero: 1, capacite: 2, zone: 'Salle', statut: 'Libre' },
  { id: 2, numero: 2, capacite: 4, zone: 'Salle', statut: 'Libre' },
  { id: 3, numero: 3, capacite: 4, zone: 'Salle', statut: 'Libre' },
  { id: 4, numero: 4, capacite: 6, zone: 'Salle', statut: 'Libre' },
  { id: 5, numero: 5, capacite: 2, zone: 'Terrasse', statut: 'Libre' },
  { id: 6, numero: 6, capacite: 4, zone: 'Terrasse', statut: 'Libre' },
  { id: 7, numero: 7, capacite: 8, zone: 'Salon privé', statut: 'Libre' },
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

      // Fournisseurs
      fournisseurs: initialFournisseurs,
      addFournisseur: (f) => set((s) => ({ fournisseurs: [...s.fournisseurs, { ...f, id: Date.now() }] })),
      updateFournisseur: (id, data) => set((s) => ({ fournisseurs: s.fournisseurs.map((f) => f.id === id ? { ...f, ...data } : f) })),
      deleteFournisseur: (id) => set((s) => ({ fournisseurs: s.fournisseurs.filter((f) => f.id !== id) })),

      // Stock
      stock: initialStock,
      addStockItem: (item) => set((s) => ({ stock: [...s.stock, { ...item, id: Date.now() }] })),
      updateStockItem: (id, data) => set((s) => ({ stock: s.stock.map((i) => i.id === id ? { ...i, ...data } : i) })),
      deleteStockItem: (id) => set((s) => ({ stock: s.stock.filter((i) => i.id !== id) })),
      ajusterStock: (id, delta) => set((s) => ({
        stock: s.stock.map((i) => i.id === id ? { ...i, quantite: Math.max(0, i.quantite + delta) } : i)
      })),

      // Tables
      tables: initialTables,
      addTable: (t) => set((s) => ({ tables: [...s.tables, { ...t, id: Date.now(), statut: 'Libre' }] })),
      updateTable: (id, data) => set((s) => ({ tables: s.tables.map((t) => t.id === id ? { ...t, ...data } : t) })),
      deleteTable: (id) => set((s) => ({ tables: s.tables.filter((t) => t.id !== id) })),
      setTableStatut: (id, statut) => set((s) => ({ tables: s.tables.map((t) => t.id === id ? { ...t, statut } : t) })),

      // Commandes Fournisseurs
      commandesFournisseurs: [],
      addCommandeFournisseur: (cmd) => set((s) => ({
        commandesFournisseurs: [...s.commandesFournisseurs, {
          ...cmd,
          id: Date.now(),
          date: new Date().toISOString(),
          statut: 'En attente',
          number: `ACH-${String(s.commandesFournisseurs.length + 1).padStart(4, '0')}`,
        }],
      })),
      // Marquer comme reçue => met à jour le stock automatiquement
      recevoirCommande: (id) => set((s) => {
        const cmd = s.commandesFournisseurs.find((c) => c.id === id)
        if (!cmd) return s
        const newStock = s.stock.map((item) => {
          const ligne = cmd.lignes.find((l) => l.stockId === item.id)
          if (ligne) return { ...item, quantite: item.quantite + Number(ligne.quantite) }
          return item
        })
        return {
          stock: newStock,
          commandesFournisseurs: s.commandesFournisseurs.map((c) =>
            c.id === id ? { ...c, statut: 'Reçue', dateReception: new Date().toISOString() } : c
          ),
        }
      }),
      updateCommandeStatut: (id, statut) => set((s) => ({
        commandesFournisseurs: s.commandesFournisseurs.map((c) => c.id === id ? { ...c, statut } : c),
      })),
      deleteCommandeFournisseur: (id) => set((s) => ({
        commandesFournisseurs: s.commandesFournisseurs.filter((c) => c.id !== id),
      })),
    }),
    { name: 'restaurant-storage' }
  )
)
