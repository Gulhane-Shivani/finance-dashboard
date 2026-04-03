import React from 'react';
import { Search, Bell, Sun, Moon, LogOut } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const Header = ({ title }) => {
  const { isDarkMode, toggleDarkMode, filters, setFilters } = useFinanceStore();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6 lg:px-10 lg:ml-64">
      <div className="flex items-center gap-6 flex-1">
        <h2 className="text-xl font-bold tracking-tight hidden md:block">{title}</h2>
        
        <div className="relative max-w-sm w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 h-10 bg-secondary/50 border-none rounded-xl"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 text-muted-foreground hover:text-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-background"></span>
        </button>

        <div className="h-8 w-px bg-border mx-2"></div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <LogOut className="w-5 h-5 text-destructive" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
