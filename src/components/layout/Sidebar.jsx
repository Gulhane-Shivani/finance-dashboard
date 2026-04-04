import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, Settings, ShieldCheck, User } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { cn } from '../../utils/cn';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 w-full group relative overflow-hidden",
      active 
        ? "bg-[#558776] text-white shadow-[0_8px_16px_-4px_rgba(85,135,118,0.4)] scale-105" 
        : "text-muted-foreground hover:bg-[#558776]/10 hover:text-[#558776]"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-300", active ? "text-white scale-110" : "group-hover:text-[#558776] group-hover:scale-110")} />
    <span className="font-semibold">{label}</span>
    {active && (
      <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse"></span>
    )}
  </button>
);

const Sidebar = ({ activeTab, onTabChange }) => {
  const { role, setRole } = useFinanceStore();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 hidden lg:flex flex-col z-50 sidebar-gradient">
      <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
        <div className="w-11 h-11 bg-[#558776] rounded-2xl flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(85,135,118,0.5)] group-hover:scale-110 transition-all duration-500">
          <PieChart className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tighter text-[#558776]">Zorvyn Fin</h1>
      </div>

      <nav className="flex-1 space-y-3">
        <NavItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => onTabChange('dashboard')} 
        />
        <NavItem 
          icon={ReceiptText} 
          label="Transactions" 
          active={activeTab === 'transactions'} 
          onClick={() => onTabChange('transactions')} 
        />
        
      </nav>

      <div className="mt-auto pt-6 border-t border-border/50">
        <div className="bg-gradient-to-br from-secondary/80 to-background/50 rounded-3xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-[#558776]/10 rounded-2xl flex items-center justify-center border border-[#558776]/20 shadow-inner">
              <User className="w-7 h-7 text-[#558776]" />
            </div>
            <div>
              <p className="text-sm font-bold truncate leading-tight">Alex Rivera</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{role}</p>
            </div>
          </div>
          
          <div className="flex bg-background/50 p-1.5 rounded-2xl border border-border/50">
            <button
              onClick={() => setRole('viewer')}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 uppercase tracking-tight",
                role === 'viewer' ? "bg-[#558776] shadow-lg text-white" : "text-muted-foreground hover:text-[#558776]"
              )}
            >
              <User className="w-3.5 h-3.5" /> Viewer
            </button>
            <button
              onClick={() => setRole('admin')}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 uppercase tracking-tight",
                role === 'admin' ? "bg-[#558776] shadow-lg text-white" : "text-muted-foreground hover:text-[#558776]"
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
