import React, { useState, useEffect } from 'react';
import useFinanceStore from './store/useFinanceStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import { cn } from './utils/cn';

function App() {
  const { isDarkMode } = useFinanceStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'insights':
        // Reuse DashboardPage for now since it includes InsightsPanel
        return <DashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'transactions': return 'Transaction History';
      case 'insights': return 'Financial Insights';
      default: return 'Finance Dashboard';
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background font-sans transition-colors duration-300 antialiased",
      isDarkMode ? "dark" : ""
    )}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex flex-col lg:pl-64 min-h-screen">
        <Header title={getPageTitle()} />
        
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full pb-12">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
