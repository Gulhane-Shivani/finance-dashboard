import React from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency } from '../../utils/currency';

const MiniChart = ({ type, isPositive }) => {
  const color = isPositive ? "#558776" : "#f43f5e"; // Sage green or Rose red

  if (type === 'bar') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="20" width="12" height="20" rx="2" fill={color} fillOpacity="0.4" />
        <rect x="16" y="28" width="12" height="12" rx="2" fill={color} />
        <rect x="32" y="10" width="12" height="30" rx="2" fill={color} fillOpacity="0.7" />
        <rect x="48" y="15" width="12" height="25" rx="2" fill={color} />
      </svg>
    );
  }
  if (type === 'line') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 35 L15 25 L30 30 L45 15 L60 5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 40 L15 30 L30 35 L45 20 L60 10" stroke={color} strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'pie') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" stroke={color} strokeWidth="6" strokeDasharray="75 100" strokeLinecap="round" />
        <circle cx="20" cy="20" r="16" stroke={color} strokeOpacity="0.2" strokeWidth="6" strokeDasharray="15 100" strokeLinecap="round" transform="rotate(-90 20 20)" />
      </svg>
    );
  }
  if (type === 'area') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 25 L15 15 L30 25 L45 10 L60 20 V40 H0 Z" fill={color} fillOpacity="0.2" />
        <path d="M0 25 L15 15 L30 25 L45 10 L60 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return null;
};

const SummaryCard = ({ title, amount, trend, chartType, isRaw = false }) => {
  const { currency } = useFinanceStore();
  const isPositive = trend >= 0;

  return (
    <Card className="border border-slate-200 dark:border-border shadow-sm bg-white dark:bg-card rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-4 pb-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span className="text-[12px] font-bold">{title}</span>
            <Info className="w-3.5 h-3.5 cursor-help" />
          </div>
          <div className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold",
            isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
          )}>
            {isPositive ? '+' : ''}{trend}%
          </div>
        </div>

        <div className="flex justify-between items-end gap-2">
          <div>
            <h3 className="text-[22px] font-black text-slate-800 dark:text-white tracking-tight leading-tight mb-0.5">
              {isRaw ? amount : formatCurrency(amount, currency)}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              Relative to last month
            </p>
          </div>
          <div className="w-[50px] h-[34px] flex-shrink-0">
            <MiniChart type={chartType} isPositive={isPositive} />
          </div>
        </div>
      </div>

    </Card>
  );
};

export default SummaryCard;
