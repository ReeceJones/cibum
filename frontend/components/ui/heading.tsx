import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const PageHeading = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ children, ...props }, ref) => {
  return (
    <header
      ref={ref}
      {...props}
      className={cn("text-4xl font-bold tracking-tight", props.className)}
    >
      {children}
    </header>
  );
});
PageHeading.displayName = "PageHeading";
