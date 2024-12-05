import { create } from "zustand";

const useStore = create((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  language: 'en', 
  setLanguage: (lang) => set({ language: lang }),
  translations: {},
  setTranslations: (translations) => set({ translations }),
}));

export default useStore;
