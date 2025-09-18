import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default",
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    high: "bg-error/10 text-error border-error/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-success/10 text-success border-success/20"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;