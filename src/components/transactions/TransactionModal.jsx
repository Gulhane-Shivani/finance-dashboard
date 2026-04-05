import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, DollarSign, Tag, Info } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { categories } from '../../data/mockData';
import { cn } from '../../utils/cn';

const TransactionModal = ({ isOpen, onClose, transaction }) => {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense'
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        amount: Math.abs(transaction.amount).toString()
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        category: 'Food',
        type: 'expense'
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTransaction = {
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    };

    if (transaction) {
      updateTransaction(transaction.id, finalTransaction);
    } else {
      addTransaction(finalTransaction);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-[480px] shadow-2xl animate-in zoom-in-95 duration-300 bg-card rounded-[22px] overflow-hidden border border-border">
        <div className="flex items-center justify-between p-7 border-b border-border bg-card">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              {transaction ? 'Edit' : 'Add'} Transaction
            </h2>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">Enter details for your financial record</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-6 bg-card">
          <div className="flex bg-muted p-1.5 rounded-2xl border border-border/50">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                formData.type === 'expense' 
                  ? "bg-card shadow-lg text-rose-600 ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                formData.type === 'income' 
                  ? "bg-card shadow-lg text-emerald-600 ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Income
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Description</label>
              <div className="relative group">
                <Info className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  className="pl-11 h-12 rounded-xl border-border bg-background focus:bg-card focus:border-primary transition-all text-sm font-medium"
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Amount</label>
                <div className="relative group">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="number"
                    step="0.01"
                    className="pl-11 h-12 rounded-xl border-border bg-background focus:bg-card focus:border-primary transition-all text-sm font-bold"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="date"
                    className="pl-11 h-12 rounded-xl border-border bg-background focus:bg-card focus:border-primary transition-all text-sm font-medium"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</label>
              <Select
                className="h-12 rounded-xl border-border bg-background"
                icon={Tag}
                options={categories.map(c => ({ label: c, value: c }))}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex gap-4">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1 h-13 rounded-2xl font-bold bg-muted hover:bg-muted/80 text-foreground transition-all active:scale-[0.98]">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-[1.5] h-13 rounded-2xl font-bold bg-gradient-to-r from-[#558776] to-[#3d6356] hover:opacity-95 shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] text-white">
              {transaction ? 'Save Changes' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TransactionModal;
