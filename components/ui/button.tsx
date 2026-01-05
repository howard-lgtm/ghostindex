import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "action" | "warning" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 font-mono uppercase tracking-wider text-xs";

    const variants = {
      primary:
        "bg-mag text-white hover:opacity-90 focus-visible:ring-mag border border-mag",
      action:
        "bg-info text-black hover:opacity-90 focus-visible:ring-info border border-info",
      warning:
        "bg-warn text-white hover:opacity-90 focus-visible:ring-warn border border-warn",
      outline:
        "border border-border text-text hover:bg-panel2",
      ghost: "hover:bg-panel2 text-text",
    };

    const sizes = {
      sm: "h-7 px-3",
      md: "h-8 px-4",
      lg: "h-10 px-6",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
