import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon, LogOut, Menu, X, ArrowUpRight, ArrowDownLeft, CheckCheck } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { cn } from '../../utils/cn';
import { CURRENCIES, formatCurrency } from '../../utils/currency';

const NOTIFICATIONS = [
  { id: 1, type: 'income', title: 'Salary Added', description: '10,000 ₹ Salary has been credited to your account.', time: '2h ago', isNew: true },
  { id: 2, type: 'expense', title: 'Expense Processed', description: '100 ₹ Expense spent on Utility.', time: '5h ago', isNew: true },
  { id: 3, type: 'expense', title: 'Daily Summary', description: 'Your total expense today is 3,000 ₹.', time: 'Today', isNew: false },
];

const Header = ({ title }) => {
  const { isDarkMode, toggleDarkMode, filters, setFilters, isSidebarOpen, setSidebarOpen, currency, setCurrency } = useFinanceStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClose = () => setShowNotifications(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [showNotifications]);

  return (
    <header className={cn(
      "sticky top-6 z-40 px-6 transition-all duration-500 ease-in-out flex justify-end",
      isVisible ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0 pointer-events-none"
    )}>
      <div className="bg-[#558776] dark:bg-card text-white h-16 rounded-[50px] flex items-center justify-between px-4 lg:px-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] border border-transparent dark:border-border w-full lg:w-[60%] lg:min-w-[700px]">
        
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-base lg:text-lg font-bold tracking-tight text-white hidden sm:block truncate">
            {title}
          </h2>
        </div>

        <div className="hidden md:flex items-center flex-[1.2] justify-center mx-2 lg:mx-4">
          <div className="relative w-full group max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
            <input 
              type="text"
              placeholder="Quick search..." 
              className="w-full pl-11 h-10 bg-white/10 !border-none text-white text-sm rounded-full focus:bg-white/15 transition-all placeholder:text-white/40 focus:outline-none focus:ring-0 focus-visible:ring-0"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 flex-1 justify-end">
          <div className="hidden sm:block">
            <select
              value={currency.code}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-10 bg-white/10 text-white text-sm font-semibold tracking-wide rounded-full !border-none outline-none focus:outline-none focus-visible:ring-0 focus:ring-0 px-4 cursor-pointer appearance-none transition-all hover:bg-white/20"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} className="bg-[#558776] text-white font-medium">
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all group overflow-hidden relative"
          >
            <div className={cn("transition-all duration-500", isDarkMode ? "scale-0 rotate-90" : "scale-100 rotate-0")}>
              <Sun className="w-4.5 h-4.5" />
            </div>
            <div className={cn("absolute transition-all duration-500", isDarkMode ? "scale-100 rotate-0" : "scale-0 -rotate-90")}>
              <Moon className="w-4.5 h-4.5" />
            </div>
          </button>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all relative",
                showNotifications ? "bg-white text-[#558776]" : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-400 rounded-full ring-2 ring-[#558776]"></span>
            </button>

            {showNotifications && (
              <div 
                className="absolute top-14 right-[-50px] sm:right-0 w-[360px] bg-white dark:bg-slate-950 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-slate-50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none">Notifications</h3>
                  <button className="text-[9px] font-bold text-slate-400 hover:text-primary dark:hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors">
                    <CheckCheck className="w-3 h-3" /> Mark read
                  </button>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto">
                  {NOTIFICATIONS.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-slate-50 dark:border-slate-800/30 last:border-none hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer relative">
                      <div className="flex gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                          notif.type === 'income' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" : "bg-rose-50 text-rose-600 dark:bg-rose-950/40"
                        )}>
                          {notif.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-0.5 leading-tight">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-1">{notif.description}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{notif.time}</p>
                        </div>
                        {notif.isNew && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-slate-50 dark:bg-slate-900/50 text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest border-t border-slate-50 dark:border-slate-800 transition-colors">
                  View full activity
                </button>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white group transition-all">
            <LogOut className="w-4.5 h-4.5 text-rose-300 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
