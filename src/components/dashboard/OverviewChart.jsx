import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/currency';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const OverviewChart = ({ type = 'area' }) => {
  const { currency, transactions } = useFinanceStore();

  // Build monthly totals dynamically from real transactions
  const monthlyMap = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = { year: d.getFullYear(), month: d.getMonth(), income: 0, expense: 0 };
    }
    if (t.type === 'income') monthlyMap[key].income += t.amount;
    else monthlyMap[key].expense += Math.abs(t.amount);
  });

  const chartData = Object.values(monthlyMap)
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map(m => ({
      name: MONTH_NAMES[m.month],
      income: parseFloat(m.income.toFixed(2)),
      expense: parseFloat(m.expense.toFixed(2)),
    }));

  const formatYAxis = (value) =>
    `${currency.symbol}${Math.abs(value * currency.rate).toLocaleString(undefined, { maximumSignificantDigits: 3 })}`;

  const formatTooltip = (value) => formatCurrency(value, currency);

  const tooltipStyle = {
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(8px)',
  };

  return (
    <Card className="border border-slate-200 dark:border-border shadow-sm bg-white dark:bg-card rounded-xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cash Flow Overview</CardTitle>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 p-1 rounded-lg">
            <span className="px-2 py-1 bg-card rounded shadow-sm text-foreground">Monthly</span>
            <span className="px-2 py-1">Quarterly</span>
            <span className="px-2 py-1">Yearly</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-72 pb-6">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No transaction data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#558776" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#558776" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226,232,240,0.4)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={formatYAxis} />
                <Tooltip formatter={formatTooltip} contentStyle={tooltipStyle} cursor={{ stroke: '#558776', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Area type="monotone" dataKey="income" stroke="#558776" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} animationDuration={1500} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} animationDuration={1500} />
              </AreaChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226,232,240,0.4)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={formatYAxis} />
                <Tooltip formatter={formatTooltip} contentStyle={tooltipStyle} />
                <Bar dataKey="income" fill="#558776" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewChart;
