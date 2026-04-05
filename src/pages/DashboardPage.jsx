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
  const { transactions, filters, setFilters } = useFinanceStore();
  const [showFilter, setShowFilter] = React.useState(false);

  const filtered = transactions.filter(t => {
    if (filters.type && filters.type !== 'All') {
      if (t.type !== filters.type) return false;
    }
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    return true;
  });

  const totalBalance = filtered.reduce((sum, t) => sum + t.amount, 0);
  const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = Math.abs(filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Type'];
    const rows = filtered.map(t => [t.date, t.description, t.amount, t.category, t.type]);
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header + Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Welcome back</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Glad to have you back!, Let's get started.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            className={`h-9 gap-2 text-xs rounded-xl border-slate-200 dark:border-slate-800 shadow-sm transition-all ${showFilter ? 'bg-[#558776] text-white border-[#558776]' : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300'}`}
            onClick={() => setShowFilter(v => !v)}
          >
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

      {/* Collapsible Filter Panel */}
      {showFilter && (
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
            <select
              className="h-8 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#558776]/40 cursor-pointer"
              value={filters.type || 'All'}
              onChange={e => setFilters({ type: e.target.value })}
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From Date</label>
            <input
              type="date"
              className="h-8 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 focus:outline-none focus:ring-2 focus:ring-[#558776]/40 cursor-pointer"
              value={filters.dateFrom || ''}
              onChange={e => setFilters({ dateFrom: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To Date</label>
            <input
              type="date"
              className="h-8 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 focus:outline-none focus:ring-2 focus:ring-[#558776]/40 cursor-pointer"
              value={filters.dateTo || ''}
              onChange={e => setFilters({ dateTo: e.target.value })}
            />
          </div>

          <button
            className="mt-4 self-end h-8 px-3 text-xs font-bold rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-rose-200 dark:border-rose-500/30"
            onClick={() => { setFilters({ type: 'All', dateFrom: '', dateTo: '' }); setShowFilter(false); }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard title="Total Balance" amount={totalBalance} trend={5} chartType="bar" />
        <SummaryCard title="Total Income" amount={income} trend={8} chartType="line" />
        <SummaryCard title="Total Expenses" amount={expenses} trend={-3} chartType="area" />
        <SummaryCard title="Conversion Rate" amount="12.67%" trend={12} chartType="pie" isRaw={true} />
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
