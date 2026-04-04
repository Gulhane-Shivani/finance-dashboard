import React from 'react';
import { Wallet, TrendingUp, TrendingDown, HandCoins } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import SummaryCard from '../components/dashboard/SummaryCard';
import OverviewChart from '../components/dashboard/OverviewChart';
import InsightsPanel from '../components/dashboard/InsightsPanel';
import TransactionTable from '../components/transactions/TransactionTable';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const DashboardPage = () => {
  const { transactions } = useFinanceStore();

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Balance"
          amount={totalBalance}
          trend={12.5}
          icon={Wallet}
          color="blue"
        />
        <SummaryCard
          title="Total Income"
          amount={income}
          trend={8.2}
          icon={TrendingUp}
          color="green"
        />
        <SummaryCard
          title="Total Expenses"
          amount={expenses}
          trend={-4.5}
          icon={TrendingDown}
          color="red"
        />
        <SummaryCard
          title="Total Savings"
          amount={totalBalance > 0 ? totalBalance : 0}
          trend={15.3}
          icon={HandCoins}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <OverviewChart />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <button className="text-sm font-medium text-primary hover:underline">View All</button>
            </CardHeader>
            <CardContent>
              <TransactionTable itemsCount={5} />
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
