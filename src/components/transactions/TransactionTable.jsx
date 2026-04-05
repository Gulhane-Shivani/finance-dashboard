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
            className="bg-card rounded-xl border border-border p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  transaction.type === 'income' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                )}>
                  {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-foreground leading-none mb-1 text-sm truncate">{transaction.description}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-muted/60 text-muted-foreground border border-border/50 uppercase tracking-widest">
                {transaction.category}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
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
                    className="w-9 h-9 rounded-lg border-border bg-card hover:bg-muted text-foreground transition-all active:scale-95"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-9 h-9 rounded-lg border-border bg-card hover:bg-rose-600/10 hover:text-rose-600 transition-all active:scale-95"
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
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left whitespace-nowrap">Date</th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Description</th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Amount</th>
              {role === 'admin' && (
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedTransactions.map((transaction) => (
              <tr key={transaction.id} className="group hover:bg-muted/50 transition-colors duration-150">
                <td className="px-4 py-4 text-xs font-semibold text-muted-foreground whitespace-nowrap align-middle">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-4 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      transaction.type === 'income' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                    )}>
                      {transaction.type === 'income' ? <ArrowUpRight className="w-4.5 h-4.5" /> : <ArrowDownLeft className="w-4.5 h-4.5" />}
                    </div>
                    <span className="font-bold text-foreground">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center align-middle">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-[9px] font-black bg-muted/50 text-muted-foreground border border-border/50 uppercase tracking-wider whitespace-nowrap">
                    {transaction.category}
                  </span>
                </td>
                <td className={cn(
                  "px-4 py-4 text-right font-black text-sm align-middle whitespace-nowrap",
                  transaction.type === 'income' ? "text-emerald-600" : "text-rose-600"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                </td>
                {role === 'admin' && (
                  <td className="px-4 py-4 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-lg border-border hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
                        onClick={() => onEdit(transaction)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-lg border-border hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-600 transition-all"
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
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/10">
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
