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

      setActivePage: (page) => set({ activePage: page }),
      setActiveAdminPage: (page) => set({ activeAdminPage: page }),

      loginAdmin: (password) => {
        const currentPassword = get().data.adminPassword || 'admin123'
        if (password === currentPassword) {
          set({ adminAuthenticated: true, isAdminMode: true })
          return true
        }
        return false
      },

      logoutAdmin: () => set({ adminAuthenticated: false, isAdminMode: false, activeAdminPage: 'dashboard' }),

      updateRestaurantInfo: (info) =>
        set((state) => ({
          data: {
            ...state.data,
            restaurant: { ...state.data.restaurant, ...info }
          }
        })),

      updateMenuCategory: (catId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            menuCategories: state.data.menuCategories.map((cat) =>
              cat.id === catId ? { ...cat, ...updates } : cat
            )
          }
        })),

      addMenuItem: (catId, item) =>
        set((state) => ({
          data: {
            ...state.data,
            menuCategories: state.data.menuCategories.map((cat) =>
              cat.id === catId
                ? { ...cat, items: [...cat.items, { ...item, id: `item_${Date.now()}` }] }
                : cat
            )
          }
        })),

      updateMenuItem: (catId, itemId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            menuCategories: state.data.menuCategories.map((cat) =>
              cat.id === catId
                ? {
                    ...cat,
                    items: cat.items.map((item) =>
                      item.id === itemId ? { ...item, ...updates } : item
                    )
                  }
                : cat
            )
          }
        })),

      deleteMenuItem: (catId, itemId) =>
        set((state) => ({
          data: {
            ...state.data,
            menuCategories: state.data.menuCategories.map((cat) =>
              cat.id === catId
                ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
                : cat
            )
          }
        })),

      addMenuCategory: (category) =>
        set((state) => ({
          data: {
            ...state.data,
            menuCategories: [
              ...state.data.menuCategories,
              { ...category, id: `cat_${Date.now()}`, items: [] }
            ]
          }
        })),

      deleteMenuCategory: (catId) =>
        set((state) => ({
          data: {
            ...state.data,
            menuCategories: state.data.menuCategories.filter((cat) => cat.id !== catId)
          }
        })),

      updateDrinkCategory: (catId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            drinkCategories: state.data.drinkCategories.map((cat) =>
              cat.id === catId ? { ...cat, ...updates } : cat
            )
          }
        })),

      addDrinkItem: (catId, item) =>
        set((state) => ({
          data: {
            ...state.data,
            drinkCategories: state.data.drinkCategories.map((cat) =>
              cat.id === catId
                ? { ...cat, items: [...cat.items, { ...item, id: `drink_${Date.now()}` }] }
                : cat
            )
          }
        })),

      updateDrinkItem: (catId, itemId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            drinkCategories: state.data.drinkCategories.map((cat) =>
              cat.id === catId
                ? {
                    ...cat,
                    items: cat.items.map((item) =>
                      item.id === itemId ? { ...item, ...updates } : item
                    )
                  }
                : cat
            )
          }
        })),

      deleteDrinkItem: (catId, itemId) =>
        set((state) => ({
          data: {
            ...state.data,
            drinkCategories: state.data.drinkCategories.map((cat) =>
              cat.id === catId
                ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
                : cat
            )
          }
        })),

      addDrinkCategory: (category) =>
        set((state) => ({
          data: {
            ...state.data,
            drinkCategories: [
              ...state.data.drinkCategories,
              { ...category, id: `dcat_${Date.now()}`, items: [] }
            ]
          }
        })),

      deleteDrinkCategory: (catId) =>
        set((state) => ({
          data: {
            ...state.data,
            drinkCategories: state.data.drinkCategories.filter((cat) => cat.id !== catId)
          }
        })),

      addEvent: (event) =>
        set((state) => ({
          data: {
            ...state.data,
            events: [
              ...state.data.events,
              { ...event, id: `ev_${Date.now()}` }
            ]
          }
        })),

      updateEvent: (eventId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            events: state.data.events.map((ev) =>
              ev.id === eventId ? { ...ev, ...updates } : ev
            )
          }
        })),

      deleteEvent: (eventId) =>
        set((state) => ({
          data: {
            ...state.data,
            events: state.data.events.filter((ev) => ev.id !== eventId)
          }
        })),

      addReservation: (reservation) =>
        set((state) => ({
          data: {
            ...state.data,
            reservations: [
              ...state.data.reservations,
              {
                ...reservation,
                id: `res_${Date.now()}`,
                createdAt: new Date().toISOString().split('T')[0],
                status: 'pending'
              }
            ]
          }
        })),

      updateReservation: (resId, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            reservations: state.data.reservations.map((res) =>
              res.id === resId ? { ...res, ...updates } : res
            )
          }
        })),

      deleteReservation: (resId) =>
        set((state) => ({
          data: {
            ...state.data,
            reservations: state.data.reservations.filter((res) => res.id !== resId)
          }
        })),

      updateHours: (dayIndex, updates) =>
        set((state) => ({
          data: {
            ...state.data,
            restaurant: {
              ...state.data.restaurant,
              hours: state.data.restaurant.hours.map((h, i) =>
                i === dayIndex ? { ...h, ...updates } : h
              )
            }
          }
        })),

      updateAdminPassword: (newPassword) =>
        set((state) => ({
          data: { ...state.data, adminPassword: newPassword }
        })),

      // ── STOCK ──────────────────────────────────────────────────
      addStockItem: (item) => set((state) => ({
        data: { ...state.data, stock: [...state.data.stock, { ...item, id: `stk_${Date.now()}`, lastUpdated: new Date().toISOString().split('T')[0] }] }
      })),
      updateStockItem: (id, updates) => set((state) => ({
        data: { ...state.data, stock: state.data.stock.map(s => s.id === id ? { ...s, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : s) }
      })),
      deleteStockItem: (id) => set((state) => ({
        data: { ...state.data, stock: state.data.stock.filter(s => s.id !== id) }
      })),
      adjustStock: (id, delta) => set((state) => ({
        data: { ...state.data, stock: state.data.stock.map(s => s.id === id ? { ...s, quantity: Math.max(0, s.quantity + delta), lastUpdated: new Date().toISOString().split('T')[0] } : s) }
      })),

      // ── SUPPLIERS ─────────────────────────────────────────────
      addSupplier: (supplier) => set((state) => ({
        data: { ...state.data, suppliers: [...state.data.suppliers, { ...supplier, id: `sup_${Date.now()}` }] }
      })),
      updateSupplier: (id, updates) => set((state) => ({
        data: { ...state.data, suppliers: state.data.suppliers.map(s => s.id === id ? { ...s, ...updates } : s) }
      })),
      deleteSupplier: (id) => set((state) => ({
        data: { ...state.data, suppliers: state.data.suppliers.filter(s => s.id !== id) }
      })),

      // ── PURCHASE ORDERS ───────────────────────────────────────
      addPurchaseOrder: (order) => set((state) => ({
        data: { ...state.data, purchaseOrders: [...state.data.purchaseOrders, { ...order, id: `po_${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], status: 'pending' }] }
      })),
      updatePurchaseOrder: (id, updates) => set((state) => ({
        data: { ...state.data, purchaseOrders: state.data.purchaseOrders.map(o => o.id === id ? { ...o, ...updates } : o) }
      })),
      deletePurchaseOrder: (id) => set((state) => ({
        data: { ...state.data, purchaseOrders: state.data.purchaseOrders.filter(o => o.id !== id) }
      })),
      receivePurchaseOrder: (orderId) => set((state) => {
        const order = state.data.purchaseOrders.find(o => o.id === orderId)
        if (!order) return state
        const updatedStock = state.data.stock.map(s => {
          const line = order.items.find(i => i.stockId === s.id)
          if (line) return { ...s, quantity: s.quantity + line.quantity, lastUpdated: new Date().toISOString().split('T')[0] }
          return s
        })
        return { data: { ...state.data, stock: updatedStock, purchaseOrders: state.data.purchaseOrders.map(o => o.id === orderId ? { ...o, status: 'received' } : o) } }
      }),

      // ── CAISSE ────────────────────────────────────────────────
      addCaisseEntry: (entry) => set((state) => ({
        data: { ...state.data, caisse: [...state.data.caisse, { ...entry, id: `ca_${Date.now()}` }] }
      })),
      updateCaisseEntry: (id, updates) => set((state) => ({
        data: { ...state.data, caisse: state.data.caisse.map(c => c.id === id ? { ...c, ...updates } : c) }
      })),

      resetData: () => set({ data: DEFAULT_DATA }),
    }),
    {
      name: 'restaurant-storage',
      partialize: (state) => ({ data: state.data }),
      merge: (persisted, current) => ({
        ...current,
        data: {
          ...DEFAULT_DATA,
          ...persisted.data,
          restaurant: { ...DEFAULT_DATA.restaurant, ...(persisted.data?.restaurant || {}) },
          suppliers:     persisted.data?.suppliers     ?? DEFAULT_DATA.suppliers,
          stock:         persisted.data?.stock         ?? DEFAULT_DATA.stock,
          purchaseOrders: persisted.data?.purchaseOrders ?? DEFAULT_DATA.purchaseOrders,
          caisse:        persisted.data?.caisse        ?? DEFAULT_DATA.caisse,
        }
      }),
    }
  )
)

export default useStore
