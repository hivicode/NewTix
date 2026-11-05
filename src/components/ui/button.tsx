import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-denim focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-5 py-2.5 cursor-pointer select-none active:translate-x-[1px] active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "bg-denim text-white border-2 border-ink poster-shadow-sm hover:bg-denim-hover",
        secondary:
          "bg-bubblegum text-[#14121F] border-2 border-ink poster-shadow-sm hover:bg-butter",
        outline:
          "bg-card text-ink border-2 border-ink hover:bg-cloud-subtle",
        ghost:
          "bg-transparent text-ink hover:bg-cloud-subtle border border-transparent",
        destructive:
          "bg-destructive text-white border-2 border-ink poster-shadow-sm hover:opacity-90",
        mint:
          "bg-mint text-[#14121F] border-2 border-ink poster-shadow-sm hover:opacity-95",
      },
      size: {
        default: "min-h-[44px] px-5 py-2.5 text-sm",
        sm: "min-h-[40px] px-3.5 py-1.5 text-xs",
        lg: "min-h-[52px] px-7 py-3.5 text-base",
        icon: "min-h-[44px] min-w-[44px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
