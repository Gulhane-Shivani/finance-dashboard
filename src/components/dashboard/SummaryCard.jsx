import React from 'react';
import { TrendingUp, TrendingDown, Wallet, DollarSign, HandCoins } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/currency';

const SummaryCard = ({ title, amount, trend, icon: Icon, color }) => {
  const { currency } = useFinanceStore();
  const isPositive = trend > 0;
  
  return (
    <Card className="hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 group border-border/40 relative overflow-hidden gradient-card">
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 rounded-full transition-all duration-500 group-hover:opacity-20",
        color === 'blue' && "bg-blue-500",
        color === 'green' && "bg-emerald-500",
        color === 'red' && "bg-rose-500",
        color === 'purple' && "bg-purple-500"
      )}></div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className={cn(
            "p-3.5 rounded-2xl shadow-sm transition-all duration-500 group-hover:scale-110",
            color === 'blue' && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
            color === 'green' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
            color === 'red' && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
            color === 'purple' && "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={cn(
             "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border animate-in slide-in-from-right-2 duration-700",
             isPositive 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
          )}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </div>
        </div>
        
        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
          {formatCurrency(amount, currency)}
        </h3>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
