import React from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = "default",
  className,
  ...props 
}) => {
  const sizes = {
    sm: "h-6 w-6 text-xs",
    default: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
    xl: "h-12 w-12 text-lg"
  };

  const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium",
        sizes[size],
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
};

export default Avatar;