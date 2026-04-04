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

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-border bg-secondary/10 pb-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search description..."
                className="pl-10 rounded-xl bg-card border-border"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">Category</span>
                <Select
                  className="w-36 h-9 rounded-lg"
                  options={['All', ...categories].map(c => ({ label: c, value: c }))}
                  value={filters.category}
                  onChange={(e) => setFilters({ category: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">Type</span>
                <Select
                  className="w-32 h-9 rounded-lg"
                  options={[
                    { label: 'All Types', value: 'All' },
                    { label: 'Income', value: 'income' },
                    { label: 'Expense', value: 'expense' }
                  ]}
                  value={filters.type}
                  onChange={(e) => setFilters({ type: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">Sort</span>
                <Select
                  className="w-32 h-9 rounded-lg"
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
        </CardHeader>
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
