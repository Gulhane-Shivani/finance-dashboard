import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../utils/cn";

const Select = React.forwardRef(({ className, options, value, onChange, icon: Icon, placeholder = "Select...", ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || { label: placeholder, value: "" };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none focus:border-primary cursor-pointer h-12 shadow-sm",
          isOpen && "border-primary ring-2 ring-primary/10",
          className?.includes('border-none') && "border-none shadow-none"
        )}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ml-auto", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1.5 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-lg animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-3 pr-8 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition-colors",
                  value === option.value && "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                )}
                onClick={() => {
                  onChange({ target: { value: option.value } });
                  setIsOpen(false);
                }}
              >
                <span className="truncate font-medium">{option.label}</span>
                {value === option.value && (
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
Select.displayName = "Select";

export { Select };
