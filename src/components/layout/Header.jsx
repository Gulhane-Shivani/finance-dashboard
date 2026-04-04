import React from 'react';
import { Search, Bell, Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

const Header = ({ title }) => {
  const { isDarkMode, toggleDarkMode, filters, setFilters, isSidebarOpen, setSidebarOpen } = useFinanceStore();

  return (
    <header className="sticky top-6 z-40 px-6 transition-all duration-300 flex justify-center">
      <div className="bg-[#558776] text-white h-16 rounded-2xl flex items-center justify-between px-4 lg:px-6 shadow-[0_20px_50px_-20px_rgba(85,135,118,0.6)] w-full max-w-5xl">
        
        {/* Left Side: Mobile Menu & Title */}
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h2 className="text-base lg:text-lg font-bold tracking-tight text-white hidden sm:block truncate">
            {title}
          </h2>
        </div>

        {/* Center: Search (Visible on md+) */}
        <div className="hidden md:flex items-center flex-[1.5] justify-center mx-4">
          <div className="relative w-full group max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
            <input 
              type="text"
              placeholder="Quick search..." 
              className="w-full pl-11 h-10 bg-white/10 border-none text-white text-sm rounded-xl focus:bg-white/15 transition-all placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 lg:gap-3 flex-1 justify-end">
          {/* Mobile Search Button */}
          <button className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
            <Search className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all group overflow-hidden relative"
          >
            <div className={cn("transition-all duration-500", isDarkMode ? "scale-0 rotate-90" : "scale-100 rotate-0")}>
              <Sun className="w-4.5 h-4.5" />
            </div>
            <div className={cn("absolute transition-all duration-500", isDarkMode ? "scale-100 rotate-0" : "scale-0 -rotate-90")}>
              <Moon className="w-4.5 h-4.5" />
            </div>
          </button>
          
          <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#558776]"></span>
          </button>

          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>
          
          <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 text-white group transition-all">
            <LogOut className="w-4.5 h-4.5 text-rose-300 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>



  );
};

export default Header;
