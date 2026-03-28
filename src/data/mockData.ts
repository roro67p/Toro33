import { RestaurantTable, MenuItem, Order, Reservation, Client, Employee, Supplier, StockItem, Invoice, RevenueDataPoint } from '../types'

export const mockTables: RestaurantTable[] = [
  { id: 't1', number: 1, seats: 2, status: 'libre', zone: 'Terrasse' },
  { id: 't2', number: 2, seats: 4, status: 'occupée', zone: 'Salle principale' },
  { id: 't3', number: 3, seats: 4, status: 'réservée', zone: 'Salle principale' },
  { id: 't4', number: 4, seats: 6, status: 'libre', zone: 'Salle principale' },
  { id: 't5', number: 5, seats: 2, status: 'occupée', zone: 'Terrasse' },
  { id: 't6', number: 6, seats: 8, status: 'libre', zone: 'Salon privé' },
  { id: 't7', number: 7, seats: 4, status: 'libre', zone: 'Salle principale' },
  { id: 't8', number: 8, seats: 4, status: 'réservée', zone: 'Terrasse' },
  { id: 't9', number: 9, seats: 2, status: 'libre', zone: 'Bar' },
  { id: 't10', number: 10, seats: 6, status: 'occupée', zone: 'Salle principale' },
  { id: 't11', number: 11, seats: 4, status: 'libre', zone: 'Salon privé' },
  { id: 't12', number: 12, seats: 2, status: 'libre', zone: 'Bar' },
]

export const mockMenuItems: MenuItem[] = [
  { id: 'm1', name: 'Foie gras maison', description: 'Foie gras de canard, chutney de figues, brioche toastée', price: 18.50, category: 'Entrées', available: true, allergens: ['Gluten', 'Lait'] },
  { id: 'm2', name: 'Soupe à l\'oignon', description: 'Soupe à l\'oignon gratinée, croûtons, gruyère fondu', price: 9.90, category: 'Entrées', available: true, allergens: ['Gluten', 'Lait'] },
  { id: 'm3', name: 'Salade César', description: 'Romaine, parmesan, croûtons, sauce césar maison', price: 12.50, category: 'Entrées', available: true, allergens: ['Gluten', 'Lait', 'Œufs'] },
  { id: 'm4', name: 'Tartare de saumon', description: 'Saumon Label Rouge, avocat, citron vert, herbes fraîches', price: 16.00, category: 'Entrées', available: true, allergens: ['Poisson'] },
  { id: 'm5', name: 'Côte de bœuf (2 pers.)', description: 'Côte de bœuf maturée 400g, pommes dauphine, sauce béarnaise', price: 52.00, category: 'Plats', available: true, allergens: ['Lait', 'Œufs'] },
  { id: 'm6', name: 'Magret de canard', description: 'Magret de canard rôti, réduction au miel et thym, gratin dauphinois', price: 26.50, category: 'Plats', available: true, allergens: ['Lait'] },
  { id: 'm7', name: 'Filet de bar', description: 'Filet de bar grillé, légumes de saison, beurre blanc', price: 28.00, category: 'Plats', available: true, allergens: ['Poisson', 'Lait'] },
  { id: 'm8', name: 'Risotto aux cèpes', description: 'Risotto crémeux aux cèpes et truffe, parmesan 24 mois', price: 22.00, category: 'Plats', available: false, allergens: ['Lait'] },
  { id: 'm9', name: 'Entrecôte grillée', description: 'Entrecôte 250g, frites maison, salade verte, sauce au choix', price: 24.00, category: 'Plats', available: true, allergens: [] },
  { id: 'm10', name: 'Crème brûlée', description: 'Crème brûlée à la vanille Bourbon de Madagascar', price: 8.50, category: 'Desserts', available: true, allergens: ['Lait', 'Œufs'] },
  { id: 'm11', name: 'Moelleux au chocolat', description: 'Moelleux chocolat Valrhona, glace vanille, crème anglaise', price: 9.50, category: 'Desserts', available: true, allergens: ['Gluten', 'Lait', 'Œufs'] },
  { id: 'm12', name: 'Tarte tatin', description: 'Tarte tatin aux pommes caramélisées, crème fraîche épaisse', price: 8.00, category: 'Desserts', available: true, allergens: ['Gluten', 'Lait', 'Œufs'] },
  { id: 'm13', name: 'Eau minérale', description: 'Évian ou Perrier 50cl', price: 4.50, category: 'Boissons', available: true, allergens: [] },
  { id: 'm14', name: 'Jus de fruits frais', description: 'Orange, pomme ou ananas pressé du jour', price: 6.00, category: 'Boissons', available: true, allergens: [] },
  { id: 'm15', name: 'Café expresso', description: 'Café expresso ou double expresso', price: 3.50, category: 'Boissons', available: true, allergens: [] },
  { id: 'm16', name: 'Bordeaux Saint-Émilion', description: 'Château Troplong Mondot 2019, bouteille 75cl', price: 65.00, category: 'Vins', available: true, allergens: ['Sulfites'] },
  { id: 'm17', name: 'Bourgogne Chablis', description: 'Domaine William Fèvre 2021, bouteille 75cl', price: 48.00, category: 'Vins', available: true, allergens: ['Sulfites'] },
  { id: 'm18', name: 'Mojito', description: 'Rhum blanc, citron vert, menthe fraîche, sucre de canne, eau gazeuse', price: 12.00, category: 'Cocktails', available: true, allergens: [] },
  { id: 'm19', name: 'Kir Royal', description: 'Crème de cassis, Champagne brut', price: 14.00, category: 'Cocktails', available: true, allergens: ['Sulfites'] },
]

export const mockOrders: Order[] = [
  {
    id: 'o1', tableId: 't2', tableNumber: 2,
    items: [
      { menuItemId: 'm1', menuItemName: 'Foie gras maison', quantity: 2, unitPrice: 18.50 },
      { menuItemId: 'm5', menuItemName: 'Côte de bœuf (2 pers.)', quantity: 1, unitPrice: 52.00 },
      { menuItemId: 'm16', menuItemName: 'Bordeaux Saint-Émilion', quantity: 1, unitPrice: 65.00 },
    ],
    status: 'en préparation', createdAt: '2026-03-28T12:15:00', updatedAt: '2026-03-28T12:20:00',
    total: 154.00, waiter: 'Marie Dupont', notes: 'Cuisson à point'
  },
  {
    id: 'o2', tableId: 't5', tableNumber: 5,
    items: [
      { menuItemId: 'm3', menuItemName: 'Salade César', quantity: 1, unitPrice: 12.50 },
      { menuItemId: 'm7', menuItemName: 'Filet de bar', quantity: 1, unitPrice: 28.00 },
      { menuItemId: 'm10', menuItemName: 'Crème brûlée', quantity: 1, unitPrice: 8.50 },
      { menuItemId: 'm15', menuItemName: 'Café expresso', quantity: 2, unitPrice: 3.50 },
    ],
    status: 'servie', createdAt: '2026-03-28T12:00:00', updatedAt: '2026-03-28T12:45:00',
    total: 56.00, waiter: 'Lucas Martin'
  },
  {
    id: 'o3', tableId: 't10', tableNumber: 10,
    items: [
      { menuItemId: 'm4', menuItemName: 'Tartare de saumon', quantity: 3, unitPrice: 16.00 },
      { menuItemId: 'm6', menuItemName: 'Magret de canard', quantity: 2, unitPrice: 26.50 },
      { menuItemId: 'm9', menuItemName: 'Entrecôte grillée', quantity: 1, unitPrice: 24.00 },
      { menuItemId: 'm17', menuItemName: 'Bourgogne Chablis', quantity: 1, unitPrice: 48.00 },
    ],
    status: 'en attente', createdAt: '2026-03-28T12:30:00', updatedAt: '2026-03-28T12:30:00',
    total: 169.00, waiter: 'Sophie Bernard', notes: 'Allergie noix pour 1 client'
  },
  {
    id: 'o4', tableId: 't2', tableNumber: 2,
    items: [
      { menuItemId: 'm2', menuItemName: 'Soupe à l\'oignon', quantity: 2, unitPrice: 9.90 },
      { menuItemId: 'm9', menuItemName: 'Entrecôte grillée', quantity: 2, unitPrice: 24.00 },
      { menuItemId: 'm11', menuItemName: 'Moelleux au chocolat', quantity: 2, unitPrice: 9.50 },
    ],
    status: 'payée', createdAt: '2026-03-28T11:00:00', updatedAt: '2026-03-28T12:30:00',
    total: 86.80, waiter: 'Marie Dupont'
  },
]

export const mockReservations: Reservation[] = [
  { id: 'r1', clientName: 'Jean-Pierre Moreau', clientPhone: '06 12 34 56 78', tableId: 't3', tableNumber: 3, date: '2026-03-28', time: '19:30', guests: 4, status: 'confirmée', createdAt: '2026-03-25T10:00:00', notes: 'Anniversaire - préparer un dessert surprise' },
  { id: 'r2', clientName: 'Isabelle Fontaine', clientPhone: '07 23 45 67 89', tableId: 't8', tableNumber: 8, date: '2026-03-28', time: '20:00', guests: 3, status: 'confirmée', createdAt: '2026-03-26T14:30:00' },
  { id: 'r3', clientName: 'Thomas Leclerc', clientPhone: '06 34 56 78 90', tableId: 't6', tableNumber: 6, date: '2026-03-29', time: '12:30', guests: 6, status: 'en attente', createdAt: '2026-03-27T09:15:00', notes: 'Repas d\'affaires' },
  { id: 'r4', clientName: 'Camille Rousseau', clientPhone: '07 45 67 89 01', tableId: 't1', tableNumber: 1, date: '2026-03-29', time: '19:00', guests: 2, status: 'confirmée', createdAt: '2026-03-27T16:00:00', notes: 'Vue terrasse demandée' },
  { id: 'r5', clientName: 'Antoine Girard', clientPhone: '06 56 78 90 12', tableId: 't4', tableNumber: 4, date: '2026-03-30', time: '20:30', guests: 5, status: 'annulée', createdAt: '2026-03-20T11:00:00' },
  { id: 'r6', clientName: 'Nathalie Petit', clientPhone: '07 67 89 01 23', tableId: 't11', tableNumber: 11, date: '2026-03-30', time: '13:00', guests: 4, status: 'confirmée', createdAt: '2026-03-28T08:00:00' },
]

export const mockClients: Client[] = [
  { id: 'c1', firstName: 'Jean-Pierre', lastName: 'Moreau', email: 'jp.moreau@email.fr', phone: '06 12 34 56 78', visits: 24, points: 1240, totalSpent: 2480.50, tier: 'Or', createdAt: '2024-01-15', lastVisit: '2026-03-15', birthDate: '1975-06-12' },
  { id: 'c2', firstName: 'Isabelle', lastName: 'Fontaine', email: 'i.fontaine@email.fr', phone: '07 23 45 67 89', visits: 8, points: 320, totalSpent: 645.00, tier: 'Argent', createdAt: '2025-03-20', lastVisit: '2026-03-10' },
  { id: 'c3', firstName: 'Thomas', lastName: 'Leclerc', email: 't.leclerc@corporate.fr', phone: '06 34 56 78 90', visits: 45, points: 3200, totalSpent: 6400.00, tier: 'Platine', createdAt: '2023-06-01', lastVisit: '2026-03-25', notes: 'Client VIP, préfère le salon privé' },
  { id: 'c4', firstName: 'Camille', lastName: 'Rousseau', email: 'c.rousseau@email.fr', phone: '07 45 67 89 01', visits: 3, points: 85, totalSpent: 175.50, tier: 'Bronze', createdAt: '2025-12-10', lastVisit: '2026-02-14' },
  { id: 'c5', firstName: 'Antoine', lastName: 'Girard', email: 'a.girard@email.fr', phone: '06 56 78 90 12', visits: 15, points: 890, totalSpent: 1785.00, tier: 'Argent', createdAt: '2024-08-22', lastVisit: '2026-03-20' },
  { id: 'c6', firstName: 'Nathalie', lastName: 'Petit', email: 'n.petit@email.fr', phone: '07 67 89 01 23', visits: 31, points: 2100, totalSpent: 4200.00, tier: 'Or', createdAt: '2023-11-05', lastVisit: '2026-03-22' },
  { id: 'c7', firstName: 'Pierre', lastName: 'Dubois', email: 'p.dubois@email.fr', phone: '06 78 90 12 34', visits: 2, points: 40, totalSpent: 89.00, tier: 'Bronze', createdAt: '2026-02-01', lastVisit: '2026-03-01' },
  { id: 'c8', firstName: 'Marie-Claire', lastName: 'Laurent', email: 'mc.laurent@email.fr', phone: '07 89 01 23 45', visits: 58, points: 4800, totalSpent: 9600.00, tier: 'Platine', createdAt: '2022-09-15', lastVisit: '2026-03-27', notes: 'Allergie aux crustacés' },
]

export const mockEmployees: Employee[] = [
  { id: 'e1', firstName: 'Marie', lastName: 'Dupont', role: 'Maître d\'hôtel', email: 'm.dupont@toro33.fr', phone: '06 11 22 33 44', salary: 2800, status: 'actif', hireDate: '2022-01-15', schedule: 'Mar-Sam 11h-23h' },
  { id: 'e2', firstName: 'Lucas', lastName: 'Martin', role: 'Serveur', email: 'l.martin@toro33.fr', phone: '07 22 33 44 55', salary: 1900, status: 'actif', hireDate: '2023-03-01', schedule: 'Mer-Dim 11h-23h' },
  { id: 'e3', firstName: 'Sophie', lastName: 'Bernard', role: 'Serveur', email: 's.bernard@toro33.fr', phone: '06 33 44 55 66', salary: 1900, status: 'actif', hireDate: '2023-09-15', schedule: 'Lun-Ven 11h-23h' },
  { id: 'e4', firstName: 'Alain', lastName: 'Chevalier', role: 'Chef', email: 'a.chevalier@toro33.fr', phone: '07 44 55 66 77', salary: 4200, status: 'actif', hireDate: '2021-06-01', schedule: 'Mar-Sam 9h-23h' },
  { id: 'e5', firstName: 'Kevin', lastName: 'Nguyen', role: 'Sous-Chef', email: 'k.nguyen@toro33.fr', phone: '06 55 66 77 88', salary: 2800, status: 'actif', hireDate: '2022-08-20', schedule: 'Mar-Sam 10h-23h' },
  { id: 'e6', firstName: 'Clara', lastName: 'Simon', role: 'Barman', email: 'c.simon@toro33.fr', phone: '07 66 77 88 99', salary: 2100, status: 'congé', hireDate: '2024-02-10', schedule: 'Jeu-Lun 17h-02h' },
  { id: 'e7', firstName: 'Maxime', lastName: 'Robert', role: 'Plongeur', email: 'm.robert@toro33.fr', phone: '06 77 88 99 00', salary: 1650, status: 'actif', hireDate: '2025-01-08', schedule: 'Mar-Sam 11h-23h' },
  { id: 'e8', firstName: 'Julie', lastName: 'Moreau', role: 'Manager', email: 'j.moreau@toro33.fr', phone: '07 88 99 00 11', salary: 3500, status: 'actif', hireDate: '2020-05-01', schedule: 'Lun-Ven 9h-19h' },
  { id: 'e9', firstName: 'David', lastName: 'Leroy', role: 'Caissier', email: 'd.leroy@toro33.fr', phone: '06 99 00 11 22', salary: 1850, status: 'absent', hireDate: '2024-07-15', schedule: 'Mar-Sam 11h-23h' },
]

export const mockSuppliers: Supplier[] = [
  { id: 's1', name: 'Boucherie Cazaux', contact: 'Henri Cazaux', email: 'contact@boucherie-cazaux.fr', phone: '05 56 12 34 56', category: 'Viandes', address: '15 rue des Chartrons, Bordeaux', lastOrder: '2026-03-25', status: 'actif' },
  { id: 's2', name: 'Poissonnerie Atlantic', contact: 'André Leconte', email: 'commandes@atlantic-fish.fr', phone: '05 56 23 45 67', category: 'Poissons', address: '8 quai des Marques, Bordeaux', lastOrder: '2026-03-27', status: 'actif' },
  { id: 's3', name: 'Primeurs Bio Gironde', contact: 'Marie Vidal', email: 'm.vidal@primeurs-bio.fr', phone: '05 56 34 56 78', category: 'Légumes', address: '42 route des Châteaux, Pauillac', lastOrder: '2026-03-28', status: 'actif' },
  { id: 's4', name: 'Vergers du Médoc', contact: 'Paul Renard', email: 'paul@vergers-medoc.fr', phone: '05 56 45 67 89', category: 'Fruits', address: '23 chemin des Vignes, Margaux', lastOrder: '2026-03-26', status: 'actif' },
  { id: 's5', name: 'Cave Bordeaux Prestige', contact: 'Jacques Sorin', email: 'j.sorin@cave-prestige.fr', phone: '05 56 56 78 90', category: 'Vins & Spiritueux', address: '5 cours du Chapeau Rouge, Bordeaux', lastOrder: '2026-03-20', status: 'actif' },
  { id: 's6', name: 'Épicerie Fine Duplantier', contact: 'Renée Duplantier', email: 'r.duplantier@epicerie-fine.fr', phone: '05 56 67 89 01', category: 'Épicerie', address: '88 rue Saint-James, Bordeaux', lastOrder: '2026-03-22', status: 'actif' },
  { id: 's7', name: 'Laiterie Périgord', contact: 'François Ségur', email: 'f.segur@laiterie-perigord.fr', phone: '05 53 78 90 12', category: 'Produits laitiers', address: '12 route de Périgueux, Bergerac', lastOrder: '2026-03-24', status: 'inactif' },
]

export const mockStockItems: StockItem[] = [
  { id: 'st1', name: 'Côte de bœuf', quantity: 12, unit: 'kg', minLevel: 5, supplierId: 's1', supplierName: 'Boucherie Cazaux', unitPrice: 28.50, lastUpdated: '2026-03-25', category: 'Viandes' },
  { id: 'st2', name: 'Magret de canard', quantity: 8, unit: 'kg', minLevel: 4, supplierId: 's1', supplierName: 'Boucherie Cazaux', unitPrice: 18.00, lastUpdated: '2026-03-25', category: 'Viandes' },
  { id: 'st3', name: 'Filet de bar', quantity: 6, unit: 'kg', minLevel: 5, supplierId: 's2', supplierName: 'Poissonnerie Atlantic', unitPrice: 32.00, lastUpdated: '2026-03-27', category: 'Poissons' },
  { id: 'st4', name: 'Saumon Label Rouge', quantity: 4, unit: 'kg', minLevel: 5, supplierId: 's2', supplierName: 'Poissonnerie Atlantic', unitPrice: 24.00, lastUpdated: '2026-03-27', category: 'Poissons' },
  { id: 'st5', name: 'Tomates cerises', quantity: 3, unit: 'kg', minLevel: 4, supplierId: 's3', supplierName: 'Primeurs Bio Gironde', unitPrice: 4.50, lastUpdated: '2026-03-28', category: 'Légumes' },
  { id: 'st6', name: 'Salade romaine', quantity: 15, unit: 'unités', minLevel: 8, supplierId: 's3', supplierName: 'Primeurs Bio Gironde', unitPrice: 1.80, lastUpdated: '2026-03-28', category: 'Légumes' },
  { id: 'st7', name: 'Pommes Golden', quantity: 20, unit: 'kg', minLevel: 10, supplierId: 's4', supplierName: 'Vergers du Médoc', unitPrice: 2.20, lastUpdated: '2026-03-26', category: 'Fruits' },
  { id: 'st8', name: 'Bordeaux Saint-Émilion', quantity: 24, unit: 'bouteilles', minLevel: 12, supplierId: 's5', supplierName: 'Cave Bordeaux Prestige', unitPrice: 32.00, lastUpdated: '2026-03-20', category: 'Vins' },
  { id: 'st9', name: 'Rhum blanc Martinique', quantity: 5, unit: 'bouteilles', minLevel: 3, supplierId: 's5', supplierName: 'Cave Bordeaux Prestige', unitPrice: 28.00, lastUpdated: '2026-03-20', category: 'Spiritueux' },
  { id: 'st10', name: 'Huile d\'olive AOP', quantity: 8, unit: 'L', minLevel: 5, supplierId: 's6', supplierName: 'Épicerie Fine Duplantier', unitPrice: 12.00, lastUpdated: '2026-03-22', category: 'Épicerie' },
  { id: 'st11', name: 'Farine T55', quantity: 25, unit: 'kg', minLevel: 10, supplierId: 's6', supplierName: 'Épicerie Fine Duplantier', unitPrice: 1.50, lastUpdated: '2026-03-22', category: 'Épicerie' },
  { id: 'st12', name: 'Beurre AOP Charentes', quantity: 6, unit: 'kg', minLevel: 4, supplierId: 's7', supplierName: 'Laiterie Périgord', unitPrice: 9.50, lastUpdated: '2026-03-24', category: 'Produits laitiers' },
  { id: 'st13', name: 'Parmesan 24 mois', quantity: 2, unit: 'kg', minLevel: 3, supplierId: 's7', supplierName: 'Laiterie Périgord', unitPrice: 28.00, lastUpdated: '2026-03-24', category: 'Produits laitiers' },
  { id: 'st14', name: 'Champagne brut', quantity: 18, unit: 'bouteilles', minLevel: 6, supplierId: 's5', supplierName: 'Cave Bordeaux Prestige', unitPrice: 35.00, lastUpdated: '2026-03-20', category: 'Vins' },
]

export const mockInvoices: Invoice[] = [
  {
    id: 'f1', invoiceNumber: 'FAC-2026-0342', orderId: 'o4', clientName: 'Table 2', tableNumber: 2,
    items: [
      { description: 'Soupe à l\'oignon x2', quantity: 2, unitPrice: 9.90, total: 19.80 },
      { description: 'Entrecôte grillée x2', quantity: 2, unitPrice: 24.00, total: 48.00 },
      { description: 'Moelleux au chocolat x2', quantity: 2, unitPrice: 9.50, total: 19.00 },
    ],
    subtotal: 86.80, tax: 8.68, total: 95.48,
    status: 'payée', createdAt: '2026-03-28T12:30:00', paidAt: '2026-03-28T12:32:00'
  },
  {
    id: 'f2', invoiceNumber: 'FAC-2026-0341', clientName: 'Marie-Claire Laurent', tableNumber: 9,
    items: [
      { description: 'Foie gras maison x1', quantity: 1, unitPrice: 18.50, total: 18.50 },
      { description: 'Côte de bœuf x1', quantity: 1, unitPrice: 52.00, total: 52.00 },
      { description: 'Bordeaux Saint-Émilion x1', quantity: 1, unitPrice: 65.00, total: 65.00 },
      { description: 'Crème brûlée x1', quantity: 1, unitPrice: 8.50, total: 8.50 },
    ],
    subtotal: 144.00, tax: 14.40, total: 158.40,
    status: 'payée', createdAt: '2026-03-27T20:00:00', paidAt: '2026-03-27T21:45:00'
  },
  {
    id: 'f3', invoiceNumber: 'FAC-2026-0340', clientName: 'Thomas Leclerc', tableNumber: 6,
    items: [
      { description: 'Menu affaires x4', quantity: 4, unitPrice: 45.00, total: 180.00 },
      { description: 'Bourgogne Chablis x2', quantity: 2, unitPrice: 48.00, total: 96.00 },
    ],
    subtotal: 276.00, tax: 27.60, total: 303.60,
    status: 'en attente', createdAt: '2026-03-27T12:30:00'
  },
  {
    id: 'f4', invoiceNumber: 'FAC-2026-0339', clientName: 'Table 7', tableNumber: 7,
    items: [
      { description: 'Salade César x2', quantity: 2, unitPrice: 12.50, total: 25.00 },
      { description: 'Magret de canard x2', quantity: 2, unitPrice: 26.50, total: 53.00 },
      { description: 'Tarte tatin x2', quantity: 2, unitPrice: 8.00, total: 16.00 },
      { description: 'Eau minérale x2', quantity: 2, unitPrice: 4.50, total: 9.00 },
    ],
    subtotal: 103.00, tax: 10.30, total: 113.30,
    status: 'annulée', createdAt: '2026-03-26T19:30:00'
  },
]

export const mockRevenueData: RevenueDataPoint[] = [
  { date: '18 Mar', revenue: 1840, orders: 22 },
  { date: '19 Mar', revenue: 2120, orders: 26 },
  { date: '20 Mar', revenue: 1680, orders: 19 },
  { date: '21 Mar', revenue: 2350, orders: 28 },
  { date: '22 Mar', revenue: 2890, orders: 34 },
  { date: '23 Mar', revenue: 3240, orders: 38 },
  { date: '24 Mar', revenue: 1920, orders: 23 },
  { date: '25 Mar', revenue: 2180, orders: 27 },
  { date: '26 Mar', revenue: 2560, orders: 31 },
  { date: '27 Mar', revenue: 2740, orders: 33 },
  { date: '28 Mar', revenue: 1240, orders: 15 },
]
