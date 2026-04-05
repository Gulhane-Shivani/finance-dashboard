import React, { useState } from 'react';
import { Plus, Download, Filter, Search, SortAsc } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionModal from '../components/transactions/TransactionModal';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { categories } from '../data/mockData';
import { Select } from '../components/ui/Select';

const TransactionsPage = () => {
  const { role, filters, setFilters, transactions } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.amount,
      t.category,
      t.type
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Manage and track your flow of funds.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="h-10 gap-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md hover:bg-slate-800 dark:hover:bg-slate-200 transition-all font-bold px-5"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" /> Export
          </Button>
          {role === 'admin' && (
            <Button className="gap-2 rounded-lg" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> Add Transaction
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

          {/* Search Field */}
          <div className="relative flex items-center w-full lg:max-w-md h-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 transition-all focus-within:border-primary/80">
            <div className="pl-4 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 font-bold" />
            </div>
            <Input
              placeholder="Search transactions..."
              className="w-full h-full bg-transparent !border-none !shadow-none focus:outline-none focus:ring-0 font-medium text-slate-600 dark:text-slate-300 placeholder:text-slate-400 px-3"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Category Select */}
            <Select
              className="w-[140px]"
              icon={Filter}
              options={['All Categories', ...categories].map(c => ({ label: c, value: c === 'All Categories' ? 'All' : c }))}
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
            />

            {/* Type Select */}
            <Select
              className="w-[130px]"
              icon={Filter}
              options={[
                { label: 'All Types', value: 'All' },
                { label: 'Income', value: 'income' },
                { label: 'Expense', value: 'expense' }
              ]}
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value })}
            />

            <div className="hidden sm:block w-[1px] h-8 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            {/* Sort Select */}
            <Select
              className="w-[130px]"
              icon={SortAsc}
              options={[
                { label: 'Date', value: 'date' },
                { label: 'Amount', value: 'amount' }
              ]}
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#0f172a] rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] px-6 py-4">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Transaction History</CardTitle>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Displaying All
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white dark:bg-[#0f172a]">
          <TransactionTable onEdit={handleEdit} />
        </CardContent>
      </Card>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default TransactionsPage;
