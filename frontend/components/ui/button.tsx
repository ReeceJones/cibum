import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "outline-destructive":
          "border border-input bg-background hover:bg-destructive hover:text-destructive-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        ghostDestructive:
          "hover:bg-destructive hover:text-destructive-foreground",
        ghostSecondary: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 rounded-md px-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const spinnerColors = {
  default: "hsl(var(--text-primary-foreground))",
  destructive: "hsl(var(--text-destructive-foreground))",
  outline: "hsl(var(--text-primary-foreground))",
  "outline-destructive": "hsl(var(--text-destructive-foreground))",
  secondary: "hsl(var(--text-secondary-foreground))",
  ghost: "hsl(var(--text-accent-foreground))",
  ghostDestructive: "hsl(var(--text-accent-foreground))",
  ghostSecondary: "hsl(var(--text-accent-foreground))",
  link: "hsl(var(--text-primary-foreground))",
  accent: "hsl(var(--text-accent-foreground))",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      disabled,
      loading = false,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const buttonChildren = loading ? (
      <div className="flex items-center justify-center space-x-2">
        <ClipLoader color={spinnerColors[variant ?? "default"]} size={24} />
      </div>
    ) : (
      children
    );
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={disabled || loading}
      >
        {buttonChildren}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
