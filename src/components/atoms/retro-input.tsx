import * as React from "react";
import { cn } from "@/lib/utils";

export const RetroInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    $invalid?: boolean;
    $compact?: boolean;
  }
>(({ className, $invalid, $compact, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full border bg-white text-black placeholder:text-[#cfcfcf] focus:outline-none focus:border-[#2867a6]",
      $compact
        ? "h-[34px] px-2.5 text-[13px] rounded-none"
        : "h-[44px] px-3.5 text-[15px] rounded-[8px]",
      $invalid
        ? "border-[#e0584f] shadow-[inset_0_0_4px_rgba(224,88,79,0.4)]"
        : "border-[#c1c1c1] shadow-[inset_0_0_4px_rgba(0,0,0,0.12)]",
      className
    )}
    {...props}
  />
));
RetroInput.displayName = "RetroInput";
