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
          <Button variant="outline" className="gap-2 rounded-xl" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          {role === 'admin' && (
            <Button className="gap-2 rounded-xl" onClick={handleAdd}>
              <Plus className="w-4 h-4" /> Add Transaction
            </Button>
          )}
        </div>
      </div>

      <div className="pb-2">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between px-1">
          
          <div className="relative flex items-center w-full lg:max-w-md h-14 rounded-full bg-[#f3f6fa] dark:bg-[#1e293b] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#334155] focus-within:ring-2 focus-within:ring-[#558776]/50 transition-all">
            <div className="pl-5 pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 stroke-[2.5]" />
            </div>
            <Input
              placeholder="Explore transactions..."
              className="w-full h-full bg-transparent !border-none !shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-400 placeholder:font-semibold px-3 rounded-full"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 w-full lg:w-auto">
            <div className="relative flex items-center h-14 rounded-full bg-[#f3f6fa] dark:bg-[#1e293b] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#334155] focus-within:ring-2 focus-within:ring-[#558776]/50 transition-all">
              <div className="pl-5 pointer-events-none">
                <Filter className="w-5 h-5 text-slate-400 stroke-[2.5]" />
              </div>
              <Select
                className="w-[160px] h-full bg-transparent !border-none text-slate-600 dark:text-slate-300 font-bold focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 !shadow-none px-3 cursor-pointer"
                options={['All Categories', ...categories].map(c => ({ label: c, value: c === 'All Categories' ? 'All' : c }))}
                value={filters.category}
                onChange={(e) => setFilters({ category: e.target.value })}
              />
            </div>
            
            <div className="relative flex items-center h-14 rounded-full bg-[#f3f6fa] dark:bg-[#1e293b] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#334155] focus-within:ring-2 focus-within:ring-[#558776]/50 transition-all">
              <div className="pl-5 pointer-events-none">
                <Filter className="w-5 h-5 text-slate-400 stroke-[2.5]" />
              </div>
              <Select
                className="w-[140px] h-full bg-transparent !border-none text-slate-600 dark:text-slate-300 font-bold focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 !shadow-none px-3 cursor-pointer"
                options={[
                  { label: 'All Types', value: 'All' },
                  { label: 'Income', value: 'income' },
                  { label: 'Expense', value: 'expense' }
                ]}
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value })}
              />
            </div>

            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block mx-1"></div>

            <div className="relative flex items-center h-14 rounded-full bg-[#f3f6fa] dark:bg-[#1e293b] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#334155] focus-within:ring-2 focus-within:ring-[#558776]/50 transition-all">
              <div className="pl-5 pointer-events-none">
                <SortAsc className="w-5 h-5 text-slate-400 stroke-[2.5]" />
              </div>
              <Select
                className="w-[140px] h-full bg-transparent !border-none text-slate-600 dark:text-slate-300 font-bold focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 !shadow-none px-3 cursor-pointer"
                options={[
                  { label: 'Sort: Date', value: 'date' },
                  { label: 'Sort: Amount', value: 'amount' }
                ]}
                value={filters.sortBy}
                onChange={(e) => setFilters({ sortBy: e.target.value })}
              />
            </div>
          </div>

        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card">
        <CardContent className="p-0">
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
