import * as React from "react";
import { cn } from "@/lib/utils";

export function RetroPanel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-[#c9c9c9] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export function RetroPanelHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-[#d9d9d9] bg-gradient-to-b from-[#fbfbfb] to-[#ededed] px-4.5 py-2.5 text-[12px] font-bold text-[#2867a6]",
        className
      )}
      {...props}
    />
  );
}

export function RetroPanelBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4.5", className)} {...props} />;
}

export function RetroStatCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-[#ebebeb] bg-gradient-to-b from-[#f4f4f4] to-[#edf9ff] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.12),inset_0_0_11px_#ffffff]",
        className
      )}
      {...props}
    />
  );
}

export const RetroTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full min-h-[110px] border border-[#c1c1c1] bg-white px-2.5 py-2 text-[13px] text-black placeholder:text-[#cfcfcf] shadow-[inset_0_0_4px_rgba(0,0,0,0.12)] focus:outline-none focus:border-[#2867a6]",
      className
    )}
    {...props}
  />
));
RetroTextarea.displayName = "RetroTextarea";
