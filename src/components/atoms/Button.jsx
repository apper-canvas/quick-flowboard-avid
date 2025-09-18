import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({
  className,
  variant = "default",
  size = "default",
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] shadow-sm hover:shadow-md",
    outline: "border border-gray-300 bg-surface text-gray-900 hover:bg-gray-50 hover:scale-[1.02] shadow-sm hover:shadow-md",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    gradient: "bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 hover:scale-[1.02] shadow-sm hover:shadow-lg",
    success: "bg-success text-white hover:bg-success/90 hover:scale-[1.02] shadow-sm hover:shadow-md",
    danger: "bg-error text-white hover:bg-error/90 hover:scale-[1.02] shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;