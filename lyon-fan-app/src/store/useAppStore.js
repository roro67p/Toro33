import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Navigation
  activePage: 'home',
  setActivePage: (page) => set({ activePage: page }),

  // Player modal
  selectedPlayer: null,
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),

  // Match filters
  matchFilter: 'all',
  setMatchFilter: (filter) => set({ matchFilter: filter }),

  // Squad filters
  squadFilter: 'all',
  setSquadFilter: (filter) => set({ squadFilter: filter }),

  // Dark mode
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // Fan Zone tab
  fanZoneTab: 'poll',
  setFanZoneTab: (tab) => set({ fanZoneTab: tab }),
}))

export default useAppStore
