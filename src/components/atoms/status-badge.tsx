import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "valid" | "muted" | "info" | "warning";

const toneClasses: Record<BadgeTone, string> = {
  valid: "border-[#54ac32] bg-[#edf9e8] text-[#2f7d18]",
  muted: "border-[#9a9a9a] bg-[#f4f4f4] text-[#6b6b6b]",
  info: "border-[#7a7fb0] bg-[#edf9ff] text-[#2867a6]",
  warning: "border-[#e0584f] bg-[#fff2f2] text-[#c0392b]",
};

export function StatusBadge({
  $tone = "valid",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { $tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-bold leading-tight tracking-wide whitespace-nowrap",
        toneClasses[$tone],
        className
      )}
      {...props}
    />
  );
}
