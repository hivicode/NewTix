"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type ViewTransitionDoc = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

// 8 partikel micro-sparkle GPU-accelerated di sekeliling tombol (super ringan, 0 canvas)
const SPARKLE_BURST = [
  { dx: -28, dy: -18, color: "#FFE98A", size: 5 },
  { dx: -4, dy: -26, color: "#FF9ECF", size: 4 },
  { dx: 24, dy: -20, color: "#3F6FD9", size: 5 },
  { dx: 36, dy: -2, color: "#9FE8C8", size: 4 },
  { dx: 28, dy: 18, color: "#FFE98A", size: 5 },
  { dx: 2, dy: 24, color: "#FF9ECF", size: 4 },
  { dx: -24, dy: 18, color: "#9FE8C8", size: 5 },
  { dx: -34, dy: -2, color: "#3F6FD9", size: 4 },
];

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [burstKey, setBurstKey] = React.useState<number | null>(null);
  const [toastMessage, setToastMessage] = React.useState<{
    id: number;
    text: string;
    mode: "light" | "dark";
  } | null>(null);

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  React.useEffect(() => {
    setMounted(true);
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  function showThemeToast(nextMode: "light" | "dark") {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage({
      id: Date.now(),
      mode: nextMode,
      text:
        nextMode === "light"
          ? "Selamat pagi, Bunnies! Siap berburu tiket seru? ☀️"
          : "Selamat malam, waktunya lampu panggung menyala! 🌙",
    });
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    const nextMode: "light" | "dark" = isDark ? "light" : "dark";

    // Ambil koordinat tombol untuk circular reveal
    const rect = buttonRef.current?.getBoundingClientRect();
    const clickX =
      e.clientX && e.clientX > 0
        ? e.clientX
        : rect
        ? rect.left + rect.width / 2
        : window.innerWidth - 60;
    const clickY =
      e.clientY && e.clientY > 0
        ? e.clientY
        : rect
        ? rect.top + rect.height / 2
        : 36;

    // Jika user mengaktifkan prefers-reduced-motion: ganti langsung tanpa animasi
    if (prefersReducedMotion) {
      setTheme(nextMode);
      showThemeToast(nextMode);
      return;
    }

    // Trigger micro-burst sparkle ringan di sekeliling tombol (GPU-only)
    setBurstKey(Date.now());

    const doc = document as ViewTransitionDoc;
    if (typeof doc.startViewTransition === "function") {
      const maxRadius = Math.hypot(
        Math.max(clickX, window.innerWidth - clickX),
        Math.max(clickY, window.innerHeight - clickY)
      );

      const transition = doc.startViewTransition(() => {
        document.documentElement.classList.toggle("dark", nextMode === "dark");
        document.documentElement.style.colorScheme = nextMode;
        setTheme(nextMode);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${clickX}px ${clickY}px)`,
                `circle(${maxRadius}px at ${clickX}px ${clickY}px)`,
              ],
            },
            {
              duration: 650,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {});
    } else {
      setTheme(nextMode);
    }

    showThemeToast(nextMode);
  }

  return (
    <>
      <div className="relative inline-flex items-center">
        {/* Micro-sparkle burst saat diklik (GPU-accelerated, zero-lag) */}
        <AnimatePresence>
          {burstKey && !prefersReducedMotion && (
            <motion.div
              key={burstKey}
              className="pointer-events-none absolute inset-0 z-20"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {SPARKLE_BURST.map((sp, idx) => (
                <motion.span
                  key={idx}
                  initial={{ x: 0, y: 0, scale: 0.3, opacity: 1 }}
                  animate={{ x: sp.dx, y: sp.dy, scale: 1, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{
                    backgroundColor: isDark
                      ? idx % 2 === 0
                        ? "#FFE98A"
                        : "#FF9ECF"
                      : sp.color,
                    width: sp.size,
                    height: sp.size,
                  }}
                  className="absolute left-1/2 top-1/2 -ml-1 -mt-1 rounded-full border border-[#14121F]"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={buttonRef}
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label="Ganti mode terang/gelap"
          title={
            isDark
              ? "Ganti ke Mode Siang (Cloud Sky)"
              : "Ganti ke Mode Malam (Navy Stage)"
          }
          onClick={handleToggle}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
          className="group relative inline-flex h-11 w-[78px] shrink-0 cursor-pointer items-center rounded-full border-2 border-ink p-1 poster-shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-denim focus-visible:ring-offset-2 overflow-hidden select-none"
          style={{
            backgroundColor: isDark ? "#0E1020" : "#8EC5FC",
          }}
        >
          {/* Latar Langit Mini (Awan Siang vs Bintang & Bintang Jatuh Malam) */}
          <svg
            viewBox="0 0 78 44"
            className="pointer-events-none absolute inset-0 h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Siang: Gradasi Langit Biru Muda + 2 Awan Melayang */}
            <g
              className="transition-opacity duration-500"
              style={{ opacity: isDark ? 0 : 1 }}
            >
              <rect width="78" height="44" fill="#9AD0FF" />
              {/* Awan 1 (Kanan Atas) */}
              <g className="animate-cloud-slow">
                <path
                  d="M46 16C46 13.8 47.8 12 50 12C51.6 12 53 12.9 53.6 14.3C54.1 14.1 54.6 14 55.2 14C57.3 14 59 15.7 59 17.8C59 19.9 57.3 21.5 55.2 21.5H46.5C44.6 21.5 43 19.9 43 18C43 16.4 44.3 15.1 46 15.1V16Z"
                  fill="#FFFFFF"
                  stroke="#14121F"
                  strokeWidth="1.3"
                />
              </g>
              {/* Awan 2 (Kanan Bawah) */}
              <g
                className="animate-cloud-slow"
                style={{ animationDelay: "1.2s" }}
              >
                <path
                  d="M55 30C55 28.3 56.3 27 58 27C59.2 27 60.2 27.7 60.7 28.7C61.1 28.6 61.5 28.5 62 28.5C63.6 28.5 65 29.8 65 31.4C65 33 63.6 34.2 62 34.2H55.4C54 34.2 52.8 33 52.8 31.5C52.8 30.3 53.8 29.3 55 29.3V30Z"
                  fill="#F7F5FF"
                  stroke="#14121F"
                  strokeWidth="1.2"
                />
              </g>
            </g>

            {/* Malam: Latar Navy + Bintang Berkelap-kelip + 1 Bintang Jatuh */}
            <g
              className="transition-opacity duration-500"
              style={{ opacity: isDark ? 1 : 0 }}
            >
              <rect width="78" height="44" fill="#0E1020" />
              {/* Bintang Twinkle 1 */}
              <path
                d="M16 10L17.2 12.8L20 14L17.2 15.2L16 18L14.8 15.2L12 14L14.8 12.8L16 10Z"
                fill="#FFE98A"
                className="animate-twinkle-1"
              />
              {/* Bintang Twinkle 2 */}
              <path
                d="M29 24L29.9 26.1L32 27L29.9 27.9L29 30L28.1 27.9L26 27L28.1 26.1L29 24Z"
                fill="#FF9ECF"
                className="animate-twinkle-2"
              />
              {/* Titik Bintang Kecil */}
              <circle
                cx="14"
                cy="30"
                r="1.3"
                fill="#F7F5FF"
                className="animate-twinkle-2"
              />
              <circle
                cx="26"
                cy="12"
                r="1.1"
                fill="#9FE8C8"
                className="animate-twinkle-1"
              />
              {/* 1 Bintang Jatuh (Shooting Star) */}
              <g className="animate-shooting-star">
                <line
                  x1="34"
                  y1="9"
                  x2="24"
                  y2="14"
                  stroke="#FFE98A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="14" r="1.6" fill="#FFFFFF" />
              </g>
            </g>
          </svg>

          {/* Knob Bulat yang Bergeser dengan Spring */}
          <motion.div
            layout
            animate={{
              x: isDark ? 34 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 24,
            }}
            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#14121F] bg-white shadow-xs transition-transform duration-200 group-hover:scale-110 overflow-hidden"
            style={{
              backgroundColor: isDark ? "#1E223D" : "#FFF8DB",
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {!isDark ? (
                /* Mode Siang: Matahari dengan Sinar Berputar Pelan */
                <motion.svg
                  key="sun-knob"
                  viewBox="0 0 28 28"
                  className="h-6 w-6"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { y: 16, rotate: -90, opacity: 0 }
                  }
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { y: 18, rotate: 90, opacity: 0 }
                  }
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <g className="animate-sun-rays">
                    <line
                      x1="14"
                      y1="2"
                      x2="14"
                      y2="5"
                      stroke="#14121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="14"
                      y1="23"
                      x2="14"
                      y2="26"
                      stroke="#14121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="2"
                      y1="14"
                      x2="5"
                      y2="14"
                      stroke="#14121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="23"
                      y1="14"
                      x2="26"
                      y2="14"
                      stroke="#14121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="5.5"
                      y1="5.5"
                      x2="7.7"
                      y2="7.7"
                      stroke="#14121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="20.3"
                      y1="20.3"
                      x2="22.5"
                      y2="22.5"
                      stroke="#14121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="22.5"
                      y1="5.5"
                      x2="20.3"
                      y2="7.7"
                      stroke="#14121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="7.7"
                      y1="20.3"
                      x2="5.5"
                      y2="22.5"
                      stroke="#14121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>
                  <circle
                    cx="14"
                    cy="14"
                    r="6.2"
                    fill="#FFE98A"
                    stroke="#14121F"
                    strokeWidth="2"
                  />
                </motion.svg>
              ) : (
                /* Mode Malam: Bulan Sabit dengan Kawah Kecil */
                <motion.svg
                  key="moon-knob"
                  viewBox="0 0 28 28"
                  className="h-6 w-6"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { y: 16, rotate: -90, opacity: 0 }
                  }
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { y: 18, rotate: 90, opacity: 0 }
                  }
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M20.5 16.8C19.3 17.3 18 17.5 16.6 17.5C11.6 17.5 7.5 13.4 7.5 8.4C7.5 6.9 7.9 5.5 8.5 4.3C5.6 5.6 3.5 8.6 3.5 12.1C3.5 16.9 7.4 20.8 12.2 20.8C15.9 20.8 19.1 18.5 20.5 16.8Z"
                    fill="#FFE98A"
                    stroke="#14121F"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9.5"
                    cy="14.5"
                    r="1.3"
                    fill="#F2C94C"
                    stroke="#14121F"
                    strokeWidth="1"
                  />
                  <circle cx="13" cy="18" r="0.9" fill="#F2C94C" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </div>

      {/* Toast Singkat Responsif (Tengah Bawah di Mobile, Tengah Atas di Desktop) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage.id}
            role="status"
            aria-live="polite"
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="pointer-events-none fixed bottom-6 md:bottom-auto md:top-6 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2.5 rounded-2xl sm:rounded-full border-2 border-ink bg-card px-4 py-2 sm:px-5 sm:py-2.5 font-mono text-[11px] sm:text-xs font-bold text-ink poster-shadow text-center max-w-[calc(100vw-2rem)] w-max shadow-md"
          >
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-[#14121F]"
              style={{
                backgroundColor:
                  toastMessage.mode === "light" ? "#FFE98A" : "#FF9ECF",
              }}
            />
            <span className="leading-snug">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
