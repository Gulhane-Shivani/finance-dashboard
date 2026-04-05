import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/currency';

const COLORS = ['#558776', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

const SpendingBreakdownChart = () => {
  const { transactions, currency } = useFinanceStore();

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, current) => {
      const existing = acc.find(item => item.name === current.category);
      if (existing) {
        existing.value += Math.abs(current.amount);
      } else {
        acc.push({ name: current.category, value: Math.abs(current.amount) });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const total = expenseData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#1e293b] rounded-xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {expenseData.length > 0 ? (
          <div>
            {/* Donut Chart */}
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, currency), 'Spent']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(8px)',
                      color: '#0f172a',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend with amounts */}
            <div className="mt-2 space-y-2">
              {expenseData.map((item, index) => {
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-bold text-slate-400">{pct}%</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{formatCurrency(item.value, currency)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Spent</span>
              <span className="text-sm font-black text-rose-500">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground text-sm">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-3">
              <PieChartIcon className="w-8 h-8 opacity-50" />
            </div>
            No expense data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingBreakdownChart;
