import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border-[1.5px] border-ink px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-vermilion text-[#FAF7F2]",
        mustard: "bg-mustard text-[#141210]",
        pine: "bg-pine text-[#FAF7F2]",
        outline: "bg-card text-ink",
        ink: "bg-ink text-paper",
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

