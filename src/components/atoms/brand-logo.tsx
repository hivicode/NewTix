import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const mainSizeClass: Record<LogoSize, string> = {
  sm: "text-[24px]",
  md: "text-[30px]",
  lg: "text-[34px]",
};

const starSizeClass: Record<LogoSize, string> = {
  sm: "text-[12px]",
  md: "text-[14px]",
  lg: "text-[15px]",
};

export function BrandLogo({
  size = "lg",
  showSubtitle = true,
  className,
}: {
  size?: LogoSize;
  showSubtitle?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span
        className={cn(
          "font-extrabold tracking-[-1px] text-[#5b4fc4] [text-shadow:1px_1px_0_#fff,2px_2px_0_#cfd6f5]",
          mainSizeClass[size]
        )}
        style={{ fontStyle: "italic" }}
      >
        New<b className="font-extrabold text-[#2a7ac0]">Tix</b>
        <i
          aria-hidden="true"
          className={cn("ml-0.5 align-top text-[#f5b301]", starSizeClass[size])}
          style={{ fontStyle: "normal" }}
        >
          ★
        </i>
      </span>
      {showSubtitle && (
        <span className="mt-1.5 text-[9px] font-bold tracking-[2.4px] text-[#5f6b76]">
          ONLINE TICKETING
        </span>
      )}
    </span>
  );
}
