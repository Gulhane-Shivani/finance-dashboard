import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';
import { CURRENCIES } from '../utils/currency';

const useFinanceStore = create(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'admin', // 'admin' or 'viewer'
      currency: CURRENCIES[0],
      isDarkMode: false,
      isSidebarOpen: false,
      filters: {
        search: '',
        category: 'All',
        type: 'All',
        sortBy: 'date', // 'date' or 'amount'
        sortOrder: 'desc',
      },

      setRole: (role) => set({ role }),
      setCurrency: (code) => set({ currency: CURRENCIES.find(c => c.code === code) || CURRENCIES[0] }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      
      setFilters: (newFilters) => 
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),

      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [{ ...transaction, id: Date.now().toString() }, ...state.transactions] 
        })),

      updateTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === id ? { ...t, ...updatedTransaction } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'finance-storage', // name of the item in localStorage
    }
  )
);

export default useFinanceStore;
