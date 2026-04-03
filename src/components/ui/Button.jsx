import * as React from "react";
import { cn } from "../../utils/cn";

export const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-[0_8px_16px_-4px_hsla(var(--primary),0.3)] hover:shadow-[0_12px_20px_-4px_hsla(var(--primary),0.4)]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-gradient-to-r from-danger to-rose-600 text-primary-foreground hover:opacity-90 shadow-[0_8px_16px_-4px_hsla(var(--destructive),0.3)]",
      outline: "border-2 border-primary/20 bg-background text-primary hover:bg-primary/5 hover:border-primary/40",
      ghost: "hover:bg-accent/10 hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-9 rounded-md px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer transition-all duration-200 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
