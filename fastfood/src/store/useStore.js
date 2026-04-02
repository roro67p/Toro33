import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_DATA } from '../data/defaultData'

const useStore = create(
  persist(
    (set, get) => ({
      data: DEFAULT_DATA,
      isAdminMode: false,
      adminAuthenticated: false,
      activePage: 'home',
      activeAdminPage: 'dashboard',
      cart: [],

      addToCart: (item) => set((state) => {
        const existing = state.cart.find(c => c.cartId === item.cartId)
        if (existing) return { cart: state.cart.map(c => c.cartId === item.cartId ? { ...c, quantity: c.quantity + 1 } : c) }
        return { cart: [...state.cart, { ...item, quantity: 1 }] }
      }),
      removeFromCart: (cartId) => set((state) => ({ cart: state.cart.filter(c => c.cartId !== cartId) })),
      updateCartQty: (cartId, qty) => set((state) => {
        if (qty <= 0) return { cart: state.cart.filter(c => c.cartId !== cartId) }
        return { cart: state.cart.map(c => c.cartId === cartId ? { ...c, quantity: qty } : c) }
      }),
      clearCart: () => set({ cart: [] }),
      setActivePage: (page) => set({ activePage: page }),
      setActiveAdminPage: (page) => set({ activeAdminPage: page }),

      loginAdmin: (password) => {
        if (password === (get().data.adminPassword || 'admin123')) {
          set({ adminAuthenticated: true, isAdminMode: true })
          return true
        }
        return false
      },
      logoutAdmin: () => set({ adminAuthenticated: false, isAdminMode: false, activeAdminPage: 'dashboard' }),

      updateRestaurantInfo: (info) => set((state) => ({ data: { ...state.data, restaurant: { ...state.data.restaurant, ...info } } })),
      updateHours: (dayIndex, updates) => set((state) => ({
        data: { ...state.data, restaurant: { ...state.data.restaurant, hours: state.data.restaurant.hours.map((h, i) => i === dayIndex ? { ...h, ...updates } : h) } }
      })),
      updateAdminPassword: (pwd) => set((state) => ({ data: { ...state.data, adminPassword: pwd } })),

      // MENU
      addMenuItem: (catId, item) => set((state) => ({
        data: { ...state.data, menuCategories: state.data.menuCategories.map(cat => cat.id === catId ? { ...cat, items: [...cat.items, { ...item, id: `item_${Date.now()}` }] } : cat) }
      })),
      updateMenuItem: (catId, itemId, updates) => set((state) => ({
        data: { ...state.data, menuCategories: state.data.menuCategories.map(cat => cat.id === catId ? { ...cat, items: cat.items.map(i => i.id === itemId ? { ...i, ...updates } : i) } : cat) }
      })),
      deleteMenuItem: (catId, itemId) => set((state) => ({
        data: { ...state.data, menuCategories: state.data.menuCategories.map(cat => cat.id === catId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat) }
      })),
      addMenuCategory: (cat) => set((state) => ({
        data: { ...state.data, menuCategories: [...state.data.menuCategories, { ...cat, id: `cat_${Date.now()}`, items: [] }] }
      })),
      deleteMenuCategory: (catId) => set((state) => ({
        data: { ...state.data, menuCategories: state.data.menuCategories.filter(c => c.id !== catId) }
      })),

      // DRINKS
      addDrinkItem: (catId, item) => set((state) => ({
        data: { ...state.data, drinkCategories: state.data.drinkCategories.map(cat => cat.id === catId ? { ...cat, items: [...cat.items, { ...item, id: `drink_${Date.now()}` }] } : cat) }
      })),
      updateDrinkItem: (catId, itemId, updates) => set((state) => ({
        data: { ...state.data, drinkCategories: state.data.drinkCategories.map(cat => cat.id === catId ? { ...cat, items: cat.items.map(i => i.id === itemId ? { ...i, ...updates } : i) } : cat) }
      })),
      deleteDrinkItem: (catId, itemId) => set((state) => ({
        data: { ...state.data, drinkCategories: state.data.drinkCategories.map(cat => cat.id === catId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat) }
      })),
      addDrinkCategory: (cat) => set((state) => ({
        data: { ...state.data, drinkCategories: [...state.data.drinkCategories, { ...cat, id: `dcat_${Date.now()}`, items: [] }] }
      })),
      deleteDrinkCategory: (catId) => set((state) => ({
        data: { ...state.data, drinkCategories: state.data.drinkCategories.filter(c => c.id !== catId) }
      })),

      // FORMULES
      addFormule: (f) => set((state) => ({ data: { ...state.data, formules: [...state.data.formules, { ...f, id: `f_${Date.now()}` }] } })),
      updateFormule: (id, updates) => set((state) => ({ data: { ...state.data, formules: state.data.formules.map(f => f.id === id ? { ...f, ...updates } : f) } })),
      deleteFormule: (id) => set((state) => ({ data: { ...state.data, formules: state.data.formules.filter(f => f.id !== id) } })),

      // STOCK
      addStockItem: (item) => set((state) => ({ data: { ...state.data, stock: [...state.data.stock, { ...item, id: `stk_${Date.now()}`, lastUpdated: new Date().toISOString().split('T')[0] }] } })),
      updateStockItem: (id, updates) => set((state) => ({ data: { ...state.data, stock: state.data.stock.map(s => s.id === id ? { ...s, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : s) } })),
      deleteStockItem: (id) => set((state) => ({ data: { ...state.data, stock: state.data.stock.filter(s => s.id !== id) } })),
      adjustStock: (id, delta) => set((state) => ({ data: { ...state.data, stock: state.data.stock.map(s => s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta), lastUpdated: new Date().toISOString().split('T')[0] } : s) } })),

      // SUPPLIERS
      addSupplier: (s) => set((state) => ({ data: { ...state.data, suppliers: [...state.data.suppliers, { ...s, id: `sup_${Date.now()}` }] } })),
      updateSupplier: (id, updates) => set((state) => ({ data: { ...state.data, suppliers: state.data.suppliers.map(s => s.id === id ? { ...s, ...updates } : s) } })),
      deleteSupplier: (id) => set((state) => ({ data: { ...state.data, suppliers: state.data.suppliers.filter(s => s.id !== id) } })),

      // SUPPLIER CATALOG
      addCatalogItem: (item) => set((state) => ({ data: { ...state.data, supplierCatalog: [...state.data.supplierCatalog, { ...item, id: `ci_${Date.now()}` }] } })),
      updateCatalogItem: (id, updates) => set((state) => ({ data: { ...state.data, supplierCatalog: state.data.supplierCatalog.map(i => i.id === id ? { ...i, ...updates } : i) } })),
      deleteCatalogItem: (id) => set((state) => ({ data: { ...state.data, supplierCatalog: state.data.supplierCatalog.filter(i => i.id !== id) } })),

      // PURCHASE ORDERS
      addPurchaseOrder: (order) => set((state) => ({
        data: { ...state.data, purchaseOrders: [...state.data.purchaseOrders, { ...order, id: `po_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], status: 'pending' }] }
      })),
      updatePurchaseOrder: (id, updates) => set((state) => ({ data: { ...state.data, purchaseOrders: state.data.purchaseOrders.map(o => o.id === id ? { ...o, ...updates } : o) } })),
      deletePurchaseOrder: (id) => set((state) => ({ data: { ...state.data, purchaseOrders: state.data.purchaseOrders.filter(o => o.id !== id) } })),
      receivePurchaseOrder: (orderId) => set((state) => {
        const order = state.data.purchaseOrders.find(o => o.id === orderId)
        if (!order) return state
        return { data: { ...state.data, purchaseOrders: state.data.purchaseOrders.map(o => o.id === orderId ? { ...o, status: 'received' } : o) } }
      }),

      // CAISSE
      addCaisseEntry: (entry) => set((state) => ({ data: { ...state.data, caisse: [...state.data.caisse, { ...entry, id: `ca_${Date.now()}` }] } })),
      updateCaisseEntry: (id, updates) => set((state) => ({ data: { ...state.data, caisse: state.data.caisse.map(c => c.id === id ? { ...c, ...updates } : c) } })),

      // CUSTOMER ORDERS
      addCustomerOrder: (order) => set((state) => ({
        data: { ...state.data, customerOrders: [...(state.data.customerOrders || []), { ...order, id: `cord_${Date.now()}`, createdAt: new Date().toISOString(), status: 'new' }] }
      })),
      updateCustomerOrder: (id, updates) => set((state) => ({ data: { ...state.data, customerOrders: (state.data.customerOrders || []).map(o => o.id === id ? { ...o, ...updates } : o) } })),
      deleteCustomerOrder: (id) => set((state) => ({ data: { ...state.data, customerOrders: (state.data.customerOrders || []).filter(o => o.id !== id) } })),

      // REVIEWS
      addReview: (review) => set((state) => ({
        data: { ...state.data, reviews: [...(state.data.reviews || []), { ...review, id: `rev_${Date.now()}`, date: new Date().toISOString().split('T')[0], approved: false, reply: null }] }
      })),
      updateReview: (id, updates) => set((state) => ({ data: { ...state.data, reviews: (state.data.reviews || []).map(r => r.id === id ? { ...r, ...updates } : r) } })),
      deleteReview: (id) => set((state) => ({ data: { ...state.data, reviews: (state.data.reviews || []).filter(r => r.id !== id) } })),

      // PROMO CODES
      addPromoCode: (promo) => set((state) => ({ data: { ...state.data, promoCodes: [...(state.data.promoCodes || []), { ...promo, id: `promo_${Date.now()}`, uses: 0 }] } })),
      updatePromoCode: (id, updates) => set((state) => ({ data: { ...state.data, promoCodes: (state.data.promoCodes || []).map(p => p.id === id ? { ...p, ...updates } : p) } })),
      deletePromoCode: (id) => set((state) => ({ data: { ...state.data, promoCodes: (state.data.promoCodes || []).filter(p => p.id !== id) } })),
      usePromoCode: (code) => {
        const promos = get().data.promoCodes || []
        const promo = promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active)
        if (!promo) return null
        if (promo.maxUses && promo.uses >= promo.maxUses) return null
        set((state) => ({ data: { ...state.data, promoCodes: state.data.promoCodes.map(p => p.id === promo.id ? { ...p, uses: p.uses + 1 } : p) } }))
        return promo
      },

      // COMMANDES SPÉCIALES
      toggleOpen: () => set((state) => ({ data: { ...state.data, isOpen: !state.data.isOpen } })),
      toggleRushMode: () => set((state) => ({ data: { ...state.data, rushMode: !state.data.rushMode } })),
      setWaitTime: (t) => set((state) => ({ data: { ...state.data, waitTime: t } })),
      setFlashMessage: (msg) => set((state) => ({ data: { ...state.data, flashMessage: msg || null } })),
      setMenuDuJour: (items) => set((state) => ({ data: { ...state.data, menuDuJour: items } })),
      updateHappyHour: (updates) => set((state) => ({ data: { ...state.data, happyHour: { ...state.data.happyHour, ...updates } } })),

      // TABLES
      addTable: (t) => set((state) => ({ data: { ...state.data, tables: [...(state.data.tables || []), { ...t, id: `tb_${Date.now()}` }] } })),
      updateTable: (id, updates) => set((state) => ({ data: { ...state.data, tables: (state.data.tables || []).map(t => t.id === id ? { ...t, ...updates } : t) } })),
      deleteTable: (id) => set((state) => ({ data: { ...state.data, tables: (state.data.tables || []).filter(t => t.id !== id) } })),
      setTableStatus: (id, status, orderId = null) => set((state) => ({
        data: { ...state.data, tables: (state.data.tables || []).map(t => t.id === id ? { ...t, status, orderId: status === 'libre' ? null : (orderId ?? t.orderId) } : t) }
      })),
      assignOrderToTable: (tableId, orderId) => set((state) => ({
        data: { ...state.data, tables: (state.data.tables || []).map(t => t.id === tableId ? { ...t, status: 'occupée', orderId } : t) }
      })),

      // EXTRAS
      addExtra: (extra) => set((state) => ({ data: { ...state.data, extras: [...(state.data.extras || []), { ...extra, id: `ex_${Date.now()}` }] } })),
      updateExtra: (id, updates) => set((state) => ({ data: { ...state.data, extras: (state.data.extras || []).map(e => e.id === id ? { ...e, ...updates } : e) } })),
      deleteExtra: (id) => set((state) => ({ data: { ...state.data, extras: (state.data.extras || []).filter(e => e.id !== id) } })),

      resetData: () => set({ data: DEFAULT_DATA }),
    }),
    {
      name: 'fastfood-storage',
      partialize: (state) => ({ data: state.data }),
      merge: (persisted, current) => ({
        ...current,
        data: {
          ...DEFAULT_DATA,
          ...persisted.data,
          restaurant:      { ...DEFAULT_DATA.restaurant, ...(persisted.data?.restaurant || {}) },
          supplierCatalog: persisted.data?.supplierCatalog ?? DEFAULT_DATA.supplierCatalog,
          suppliers:       persisted.data?.suppliers       ?? DEFAULT_DATA.suppliers,
          stock:           persisted.data?.stock           ?? DEFAULT_DATA.stock,
          purchaseOrders:  persisted.data?.purchaseOrders  ?? DEFAULT_DATA.purchaseOrders,
          caisse:          persisted.data?.caisse          ?? DEFAULT_DATA.caisse,
          customerOrders:  persisted.data?.customerOrders  ?? [],
          formules:        persisted.data?.formules        ?? DEFAULT_DATA.formules,
          reviews:         persisted.data?.reviews         ?? DEFAULT_DATA.reviews,
          promoCodes:      persisted.data?.promoCodes      ?? DEFAULT_DATA.promoCodes,
          extras:          persisted.data?.extras          ?? DEFAULT_DATA.extras,
          tables:          persisted.data?.tables          ?? DEFAULT_DATA.tables,
          isOpen:          persisted.data?.isOpen          ?? DEFAULT_DATA.isOpen,
          rushMode:        persisted.data?.rushMode        ?? false,
          flashMessage:    persisted.data?.flashMessage    ?? null,
          waitTime:        persisted.data?.waitTime        ?? DEFAULT_DATA.waitTime,
          menuDuJour:      persisted.data?.menuDuJour      ?? [],
          happyHour:       persisted.data?.happyHour       ?? DEFAULT_DATA.happyHour,
        }
      }),
    }
  )
)

export default useStore
