import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/currency';

const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

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

  return (
    <Card className="h-[432px]">
      <CardHeader className="pb-2">
        <CardTitle>Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-full pb-10">
        {expenseData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value, currency)}
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  color: '#0f172a'
                }}
                itemStyle={{ color: '#0f172a' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={72}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-sm">
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
