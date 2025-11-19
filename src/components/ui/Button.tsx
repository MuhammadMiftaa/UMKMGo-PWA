// src/components/ui/Button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "gradient";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            // Default variant
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg":
              variant === "default",
            // Outline variant
            "border-primary text-primary hover:bg-primary/5 border-2 bg-transparent":
              variant === "outline",
            // Ghost variant
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            // Gradient variant
            "from-primary via-accent to-secondary bg-linear-to-r text-white shadow-lg hover:scale-[1.02] hover:shadow-xl":
              variant === "gradient",
            // Sizes
            "h-11 px-6 py-2 text-base": size === "default",
            "h-9 px-4 text-sm": size === "sm",
            "h-14 px-8 text-lg": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
