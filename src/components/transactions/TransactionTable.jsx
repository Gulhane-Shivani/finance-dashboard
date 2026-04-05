import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft, MoreVertical, Search, Filter, SortAsc } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/currency';

const TransactionTable = ({ onEdit, itemsCount }) => {
  const { transactions, filters, role, deleteTransaction, currency } = useFinanceStore();

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

  const displayedTransactions = itemsCount ? sortedTransactions.slice(0, itemsCount) : sortedTransactions;

  if (sortedTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-dashed border-border border-2">
        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No transactions found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
            <th className="px-5 py-3 text-sm font-bold text-slate-500">Date</th>
            <th className="px-5 py-3 text-sm font-bold text-slate-500">Description</th>
            <th className="px-5 py-3 text-sm font-bold text-slate-500 text-center">Category</th>
            <th className="px-5 py-3 text-sm font-bold text-slate-500 text-right">Amount</th>
            {role === 'admin' && (
              <th className="px-5 py-3 text-sm font-bold text-slate-500 text-center">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {displayedTransactions.map((transaction) => (
            <tr key={transaction.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-150">
              <td className="px-5 py-3 text-sm text-slate-500 whitespace-nowrap">
                {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    transaction.type === 'income' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                  )}>
                    {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <span className="font-medium text-foreground">{transaction.description}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-center">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                  {transaction.category}
                </span>
              </td>
              <td className={cn(
                "px-5 py-3 text-right font-bold text-sm",
                transaction.type === 'income' ? "text-emerald-600" : "text-rose-600"
              )}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
              </td>
              {role === 'admin' && (
                <td className="px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                      onClick={() => onEdit(transaction)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
