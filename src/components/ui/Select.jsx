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
          "flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 focus:outline-none focus:border-primary cursor-pointer h-12 shadow-sm",
          isOpen && "border-primary ring-2 ring-primary/10",
          className?.includes('border-none') && "border-none shadow-none"
        )}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
          <span className="truncate text-foreground/80 font-medium">{selectedOption.label}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ml-auto", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1.5 min-w-[8rem] overflow-hidden rounded-md border border-border bg-card p-1 text-foreground shadow-lg animate-in fade-in zoom-in-95">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-3 pr-8 text-sm outline-none hover:bg-muted hover:text-foreground transition-all duration-200",
                  value === option.value && "bg-muted text-foreground"
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
