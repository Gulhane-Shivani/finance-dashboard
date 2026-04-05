import React from 'react';
import { Lightbulb, Target, TrendingUp, HandCoins, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/currency';

const InsightCard = ({ icon: Icon, title, value, type, description }) => (
  <div className="flex gap-4 p-4 rounded-lg bg-secondary/30 border border-border border-dashed transition-all hover:border-primary/20 hover:bg-secondary/50">
    <div className={cn(
      "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
      type === 'success' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
    )}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-sm font-semibold mb-0.5">{title}</h4>
      <p className="text-lg font-bold mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

const InsightsPanel = () => {
  const { transactions, currency } = useFinanceStore();

  // Calculate insights
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  // Highest spending category
  const categoryExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});
  
  const highestCategory = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#1e293b] rounded-lg overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning" />
          <CardTitle>Financial Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InsightCard 
          icon={Target} 
          title="Savings Performance" 
          value={`${savingsRate.toFixed(1)}%`}
          type={savingsRate > 20 ? 'success' : 'error'}
          description={savingsRate > 20 ? "You're saving more than 20% of your income. Great job!" : "Try to reduce your miscellaneous expenses to increase your savings."}
        />
        
        <InsightCard 
          icon={highestCategory[0] === 'Housing' || highestCategory[0] === 'Utilities' ? TrendingUp : ArrowDownRight} 
          title="Highest Spending" 
          value={highestCategory[0]}
          type="error"
          description={`You've spent ${formatCurrency(highestCategory[1], currency)} in ${highestCategory[0]} this period.`}
        />

        <InsightCard 
          icon={HandCoins} 
          title="Total Net Worth" 
          value={formatCurrency(savings, currency)}
          type={savings > 0 ? 'success' : 'error'}
          description="Total balance across all your income streams and expenses."
        />
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
