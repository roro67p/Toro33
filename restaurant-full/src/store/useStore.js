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

      resetData: () => set({ data: DEFAULT_DATA }),
    }),
    {
      name: 'restaurant-storage',
      partialize: (state) => ({
        data: state.data,
      }),
    }
  )
)

export default useStore
