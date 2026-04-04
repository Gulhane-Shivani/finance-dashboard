import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';
import { CURRENCIES } from '../../utils/currency';

const Header = ({ title }) => {
  const { isDarkMode, toggleDarkMode, filters, setFilters, isSidebarOpen, setSidebarOpen, currency, setCurrency } = useFinanceStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <header className={cn(
      "sticky top-6 z-40 px-6 transition-all duration-500 ease-in-out flex justify-end",
      isVisible ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0 pointer-events-none"
    )}>
      <div className="bg-[#558776] text-white h-16 rounded-[50px] flex items-center justify-between px-4 lg:px-6 shadow-[0_20px_50px_-20px_rgba(85,135,118,0.6)] w-full lg:w-[60%] lg:min-w-[700px]">
        
        {/* Left Side: Mobile Menu & Title */}
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

        {/* Center: Search (Visible on md+) */}
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

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 lg:gap-3 flex-1 justify-end">
          {/* Mobile Search Button */}
          <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
            <Search className="w-4.5 h-4.5" />
          </button>

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
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#558776]"></span>
          </button>

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
