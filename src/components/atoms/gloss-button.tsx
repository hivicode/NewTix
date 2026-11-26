import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type GlossVariant = "orange" | "silver" | "green";
export type GlossSize = "sm" | "md" | "lg";

interface GlossProps {
  $variant?: GlossVariant;
  $size?: GlossSize;
  $fullWidth?: boolean;
  $pill?: boolean;
}

const variantClasses: Record<GlossVariant, string> = {
  orange: "gloss-orange font-bold",
  silver: "gloss-silver font-semibold",
  green: "gloss-green font-semibold",
};

const sizeClasses: Record<GlossSize, string> = {
  sm: "px-3 py-1.5 text-[12px]",
  md: "px-4.5 py-2 text-[13px]",
  lg: "px-5.5 py-2.5 text-[15px]",
};

function getGlossClasses({
  $variant = "orange",
  $size = "md",
  $fullWidth,
  $pill,
  className,
}: GlossProps & { className?: string }) {
  return cn(
    "inline-flex items-center justify-center gap-2 leading-tight no-underline cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed",
    variantClasses[$variant],
    sizeClasses[$size],
    $fullWidth && "w-full",
    $pill && "!rounded-full",
    className
  );
}

export function GlossButton({
  $variant,
  $size,
  $fullWidth,
  $pill,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & GlossProps) {
  return (
    <button
      className={getGlossClasses({ $variant, $size, $fullWidth, $pill, className })}
      {...props}
    />
  );
}

export function GlossLink({
  $variant,
  $size,
  $fullWidth,
  $pill,
  className,
  style,
  ...props
}: React.ComponentProps<typeof Link> & GlossProps) {
  return (
    <Link
      className={getGlossClasses({ $variant, $size, $fullWidth, $pill, className })}
      style={{ textDecoration: "none", ...style }}
      {...props}
    />
  );
}
