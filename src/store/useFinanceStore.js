import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';

const useFinanceStore = create(
  persist(
    (set) => ({
      transactions: mockTransactions,
      role: 'admin', // 'admin' or 'viewer'
      isDarkMode: false,
      filters: {
        search: '',
        category: 'All',
        type: 'All',
        sortBy: 'date', // 'date' or 'amount'
        sortOrder: 'desc',
      },

      setRole: (role) => set({ role }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
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
