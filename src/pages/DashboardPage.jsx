import React from 'react';
import { Download, Filter, LayoutGrid } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import SummaryCard from '../components/dashboard/SummaryCard';
import OverviewChart from '../components/dashboard/OverviewChart';
import InsightsPanel from '../components/dashboard/InsightsPanel';
import SpendingBreakdownChart from '../components/dashboard/SpendingBreakdownChart';
import { Button } from '../components/ui/Button';
import TransactionTable from '../components/transactions/TransactionTable';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const DashboardPage = () => {
  const { transactions } = useFinanceStore();

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
    const rows = transactions.map(t => [t.date, t.description, t.amount, t.category, t.type]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "dashboard-transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header + Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Welcome back</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Glad to have you back!, Let's get started.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" className="h-9 gap-2 text-xs rounded-xl bg-white dark:bg-[#1e293b] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
          <Button
            className="h-9 gap-2 text-xs rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md hover:bg-slate-800 dark:hover:bg-slate-200"
            onClick={handleExportCSV}
          >
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Active Sales"
          amount={totalBalance}
          trend={5}
          chartType="bar"
        />
        <SummaryCard
          title="Product Sold"
          amount={income}
          trend={8}
          chartType="line"
        />
        <SummaryCard
          title="Profit"
          amount={expenses}
          trend={12}
          chartType="pie"
        />
        <SummaryCard
          title="Conversion Rate"
          amount="12.67%"
          trend={-3}
          chartType="area"
          isRaw={true}
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

        <div className="xl:col-span-1 space-y-8">
          <InsightsPanel />
          <SpendingBreakdownChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
