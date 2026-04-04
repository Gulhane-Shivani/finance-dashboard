import React from 'react';
import { Search, Bell, Sun, Moon, LogOut } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const Header = ({ title }) => {
  const { isDarkMode, toggleDarkMode, filters, setFilters } = useFinanceStore();

  return (
    <header className="sticky top-0 z-40 bg-[#558776] backdrop-blur-xl border border-white/10 h-14 flex items-center justify-between px-6 lg:px-10 lg:ml-64 rounded-r-[32px] shadow-[0_15px_35px_-12px_rgba(85,135,118,0.3)] transition-all duration-300 border-r-0">
      <div className="flex items-center gap-6 flex-1">
        <h2 className="text-lg font-bold tracking-tight hidden md:block text-white">{title}</h2>
        
        <div className="relative max-w-sm w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 h-9 bg-white/10 border-none text-sm placeholder:text-white/40 text-white rounded-xl focus:bg-white/20 transition-all"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#558776]"></span>
        </button>

        <div className="h-6 w-px bg-white/20 mx-1"></div>
        
        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/10 text-white/80">
          <LogOut className="w-4 h-4 text-rose-300" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
