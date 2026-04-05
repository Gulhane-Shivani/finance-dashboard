import React from 'react';
import { format } from 'date-fns';
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/currency';

const TransactionTable = ({ onEdit, itemsCount }) => {
  const { transactions, filters, role, deleteTransaction, currency } = useFinanceStore();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = itemsCount || 10;

  // Apply filters
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'All' || t.category === filters.category;
    const matchesType = filters.type === 'All' || t.type === filters.type;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Apply sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (filters.sortBy === 'date') {
      return filters.sortOrder === 'desc'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    } else {
      return filters.sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // If itemsCount is provided (Dashboard), we don't paginate, just slice.
  // Otherwise, we paginate.
  const displayedTransactions = itemsCount
    ? sortedTransactions.slice(0, itemsCount)
    : sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    if (!itemsCount) setCurrentPage(1);
  }, [filters, itemsCount]);

  if (sortedTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-dashed border-border border-2 m-4">
        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No transactions found</h3>
        <p className="text-sm text-muted-foreground max-w-xs text-center mx-auto">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {displayedTransactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  transaction.type === 'income' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30" : "bg-rose-50 text-rose-600 dark:bg-rose-950/30"
                )}>
                  {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 leading-none mb-1">{transaction.description}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                {transaction.category}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className={cn(
                "text-base font-black",
                transaction.type === 'income' ? "text-emerald-600" : "text-rose-600"
              )}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
              </div>
              
              {role === 'admin' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-9 h-9 rounded-lg border-slate-200 dark:border-slate-800"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-9 h-9 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block w-full">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
              <th className="w-[110px] px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Description</th>
              <th className="w-[120px] px-2 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Category</th>
              <th className="w-[120px] px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              {role === 'admin' && (
                <th className="w-[100px] px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayedTransactions.map((transaction) => (
              <tr key={transaction.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-900 transition-colors duration-150">
                <td className="px-4 py-5 text-sm text-slate-500 whitespace-nowrap">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      transaction.type === 'income' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                    )}>
                      {transaction.type === 'income' ? <ArrowUpRight className="w-4.5 h-4.5" /> : <ArrowDownLeft className="w-4.5 h-4.5" />}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-2 py-5 text-center">
                  <span className="inline-block px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                    {transaction.category}
                  </span>
                </td>
                <td className={cn(
                  "px-4 py-5 text-right font-black text-sm",
                  transaction.type === 'income' ? "text-emerald-600" : "text-rose-600"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                </td>
                {role === 'admin' && (
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
                        onClick={() => onEdit(transaction)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:hover:bg-rose-900/10 dark:hover:border-rose-900"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar - only show on full list view (not Dashboard) */}
      {!itemsCount && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg h-9 px-3 gap-1 font-bold disabled:opacity-30 transition-all active:scale-[0.98]"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isCurrent = currentPage === page;

                // Show only first, last, and pages around current
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-9 h-9 rounded-lg text-sm font-bold transition-all",
                        isCurrent
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      )}
                    >
                      {page}
                    </button>
                  );
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-1 text-slate-300">...</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg h-9 px-3 gap-1 font-bold disabled:opacity-30 transition-all active:scale-[0.98]"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
