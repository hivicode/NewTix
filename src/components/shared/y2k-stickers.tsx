"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Wordmark "NewTix" dengan huruf "T" berbentuk tiket berlubang dan "x" dihiasi bintang Y2K kecil.
 * Warna tiket dan bintang menyesuaikan mode siang/malam.
 */
export function NewTixLogo({
  className,
  size = "default",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const textSize =
    size === "lg"
      ? "text-3xl sm:text-4xl"
      : size === "sm"
      ? "text-xl"
      : "text-2xl";

  return (
    <span
      className={cn(
        "inline-flex items-center font-display font-extrabold tracking-tight select-none text-ink",
        textSize,
        className
      )}
    >
      <span>New</span>
      {/* Custom SVG Ticket-shaped 'T' */}
      <span
        className="inline-flex items-center justify-center mx-[1px] -rotate-6 transition-transform group-hover:rotate-3"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 28 30"
          className={cn(
            size === "lg"
              ? "w-7 h-8"
              : size === "sm"
              ? "w-5 h-5"
              : "w-6 h-6"
          )}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ticket body */}
          <path
            d="M3 4C3 2.89543 3.89543 2 5 2H23C24.1046 2 25 2.89543 25 4V9C23.3431 9 22 10.3431 22 12C22 13.6569 23.3431 15 25 15V25C25 26.1046 24.1046 27 23 27H5C3.89543 27 3 26.1046 3 25V15C4.65685 15 6 13.6569 6 12C6 10.3431 4.65685 9 3 9V4Z"
            className="fill-bubblegum dark:fill-denim transition-colors duration-300"
            stroke="#14121F"
            strokeWidth="2.2"
          />
          {/* Letter T inside ticket */}
          <path
            d="M8.5 8.5H19.5M14 8.5V21.5"
            className="stroke-[#14121F] dark:stroke-[#F7F5FF] transition-colors duration-300"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="sr-only">T</span>
      <span>i</span>
      {/* Letter 'x' accented with a Y2K 4-point sparkle star */}
      <span className="relative inline-flex items-center">
        <span>x</span>
        <svg
          viewBox="0 0 18 18"
          className="w-3.5 h-3.5 -ml-0.5 -mt-3 text-denim"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M9 1L11.2 6.8L17 9L11.2 11.2L9 17L6.8 11.2L1 9L6.8 6.8L9 1Z"
            className="fill-butter dark:fill-bubblegum transition-colors duration-300"
            stroke="#14121F"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

/**
 * Maskot Kelinci Kecil Y2K (Original Custom SVG)
 * Mendukung mood: "happy" (bangun & tersenyum), "sleepy" (memakai topi tidur & mengantuk di malam hari),
 * "wink", dan "dizzy".
 */
export function BunnyMascot({
  className,
  mood = "happy",
}: {
  className?: string;
  mood?: "happy" | "wink" | "dizzy" | "sleepy";
}) {
  return (
    <svg
      viewBox="0 0 88 92"
      className={cn("w-16 h-16", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={
        mood === "sleepy"
          ? "Maskot kelinci NewTix memakai topi tidur"
          : "Maskot kelinci NewTix tersenyum"
      }
    >
      {/* Left Ear */}
      <path
        d="M27 42C23 24 24 10 30 8C36 6 38 21 37 39"
        fill="#FFFFFF"
        stroke="#14121F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.5 35C27.5 23 28 15 30.5 14C33 13 34 22 33.5 34"
        fill="#FF9ECF"
      />

      {/* Right Ear */}
      <path
        d="M47 39C47 21 51 7 57 9C63 11 61 25 55 42"
        fill="#FFFFFF"
        stroke="#14121F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50.5 34C51 22 53 14 55.5 15C58 16 56.5 24 53.5 35"
        fill="#FF9ECF"
      />

      {/* Nightcap (Topi Tidur Y2K) ketika mood === "sleepy", atau Star Hairclip saat siang */}
      {mood === "sleepy" ? (
        <g>
          {/* Cone hat */}
          <path
            d="M28 38C34 20 55 15 72 28C63 32 58 37 56 42C46 37 36 37 28 38Z"
            fill="#3F6FD9"
            stroke="#14121F"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Polka dot on nightcap */}
          <circle cx="48" cy="28" r="2.2" fill="#FFE98A" />
          <circle cx="57" cy="27" r="1.8" fill="#FF9ECF" />
          {/* Fluffy Brim */}
          <path
            d="M26 39C35 35 49 36 58 42"
            stroke="#FFE98A"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Pom-pom */}
          <circle
            cx="74"
            cy="29"
            r="5.5"
            fill="#FFE98A"
            stroke="#14121F"
            strokeWidth="2.4"
          />
          {/* Floating 'Zzz' */}
          <text
            x="67"
            y="16"
            fill="#FF9ECF"
            stroke="#14121F"
            strokeWidth="0.6"
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            zZ
          </text>
        </g>
      ) : (
        <path
          d="M57 22L59 26L63 27.5L59 29L57 33L55 29L51 27.5L55 26L57 22Z"
          fill="#FFE98A"
          stroke="#14121F"
          strokeWidth="1.8"
        />
      )}

      {/* Head */}
      <ellipse
        cx="42"
        cy="56"
        rx="24"
        ry="20"
        fill="#FFFFFF"
        stroke="#14121F"
        strokeWidth="3"
      />

      {/* Blush Cheeks */}
      <ellipse cx="26" cy="59" rx="4.5" ry="2.5" fill="#FF9ECF" />
      <ellipse cx="58" cy="59" rx="4.5" ry="2.5" fill="#FF9ECF" />

      {/* Eyes */}
      {mood === "dizzy" ? (
        <>
          <path
            d="M29 50L35 56M35 50L29 56"
            stroke="#14121F"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M49 50L55 56M55 50L49 56"
            stroke="#14121F"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </>
      ) : mood === "sleepy" ? (
        <>
          {/* Closed sleepy curved eyes */}
          <path
            d="M28 52C30 55 34 55 36 52"
            stroke="#14121F"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M48 52C50 55 54 55 56 52"
            stroke="#14121F"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </>
      ) : mood === "wink" ? (
        <>
          <path
            d="M28 53L35 51L28 49"
            stroke="#14121F"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="52" cy="52" r="3" fill="#14121F" />
          <circle cx="53" cy="51" r="1" fill="#FFFFFF" />
        </>
      ) : (
        <>
          <circle cx="32" cy="52" r="3" fill="#14121F" />
          <circle cx="33" cy="51" r="1" fill="#FFFFFF" />
          <circle cx="52" cy="52" r="3" fill="#14121F" />
          <circle cx="53" cy="51" r="1" fill="#FFFFFF" />
        </>
      )}

      {/* Nose & Mouth */}
      <ellipse cx="42" cy="56" rx="2.2" ry="1.6" fill="#FF9ECF" />
      {mood === "sleepy" ? (
        /* Cute sleepy 'o' yawning mouth */
        <circle
          cx="42"
          cy="61"
          r="2.4"
          fill="#FF9ECF"
          stroke="#14121F"
          strokeWidth="2"
        />
      ) : (
        <path
          d="M38 59.5C39.5 61.5 42 60.5 42 58.5C42 60.5 44.5 61.5 46 59.5"
          stroke="#14121F"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * Maskot Kelinci yang otomatis berganti ekspresi sesuai mode siang/malam:
 * - Siang (light): Bangun & tersenyum ("happy")
 * - Malam (dark): Memakai topi tidur & mengantuk ("sleepy")
 */
export function ThemeAwareBunnyMascot({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <BunnyMascot
      mood={isDark ? "sleepy" : "happy"}
      className={cn("transition-transform duration-300", className)}
    />
  );
}

/**
 * Stiker Bintang Sparkle Y2K (Original Custom SVG)
 */
export function Y2KStarSticker({
  className,
  color = "#FFE98A",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={cn("w-7 h-7", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 2L22.2 13.8L34 18L22.2 22.2L18 34L13.8 22.2L2 18L13.8 13.8L18 2Z"
        fill={color}
        stroke="#14121F"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="18" r="2.2" fill="#14121F" />
    </svg>
  );
}

/**
 * Stiker Badge Kelinci Bulat Miring Y2K (Menyesuaikan mode siang/malam)
 */
export function BunnyStickerBadge({
  label = "NEWTIX CLUB",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bubblegum dark:bg-butter text-[#14121F] px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-wider sticker-shadow -rotate-3 select-none transition-colors duration-300",
        className
      )}
    >
      <ThemeAwareBunnyMascot className="w-6 h-6 -my-1" />
      <span>{label}</span>
    </div>
  );
}
