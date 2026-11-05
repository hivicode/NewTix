import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-denim text-white",
        bubblegum: "bg-bubblegum text-[#14121F]",
        butter: "bg-butter text-[#14121F]",
        mint: "bg-mint text-[#14121F]",
        outline: "bg-card text-ink",
        ink: "bg-ink text-cloud",
      },
      sticker: {
        true: "-rotate-6 sticker-shadow px-3 py-1 rounded-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      sticker: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, sticker, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, sticker }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
