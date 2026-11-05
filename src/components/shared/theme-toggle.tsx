"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type ParticleShape = "star" | "crescent" | "heart" | "bunny";

interface CanvasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  drag: number;
  size: number;
  rotation: number;
  vRot: number;
  alpha: number;
  decay: number;
  color: string;
  shape: ParticleShape;
}

/**
 * Menggambar partikel kustom (bintang, bulan sabit, hati, kelinci mini) di HTML5 Canvas.
 */
function drawCustomParticle(
  ctx: CanvasRenderingContext2D,
  p: CanvasParticle
) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.alpha);
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;
  ctx.strokeStyle = "#14121F";
  ctx.lineWidth = 1.2;

  const s = p.size;

  if (p.shape === "star") {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.32, -s * 0.32);
    ctx.lineTo(s, 0);
    ctx.lineTo(s * 0.32, s * 0.32);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.32, s * 0.32);
    ctx.lineTo(-s, 0);
    ctx.lineTo(-s * 0.32, -s * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (p.shape === "crescent") {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.85, 0.25 * Math.PI, 1.75 * Math.PI, false);
    ctx.arc(
      s * 0.35,
      -s * 0.1,
      s * 0.68,
      1.65 * Math.PI,
      0.35 * Math.PI,
      true
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (p.shape === "heart") {
    ctx.beginPath();
    const topCurveHeight = s * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -s, 0, -s, topCurveHeight);
    ctx.bezierCurveTo(-s, (s + topCurveHeight) / 2, 0, s * 0.9, 0, s * 1.15);
    ctx.bezierCurveTo(
      0,
      s * 0.9,
      s,
      (s + topCurveHeight) / 2,
      s,
      topCurveHeight
    );
    ctx.bezierCurveTo(s, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Mini bunny silhouette (head + 2 ears)
    ctx.beginPath();
    ctx.ellipse(-s * 0.32, -s * 0.72, s * 0.22, s * 0.55, -0.1, 0, Math.PI * 2);
    ctx.ellipse(s * 0.32, -s * 0.72, s * 0.22, s * 0.55, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, s * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Memunculkan efek konfeti di seluruh layar dari titik (originX, originY) tombol toggle.
 */
function spawnThemeConfetti(
  originX: number,
  originY: number,
  targetMode: "light" | "dark"
) {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "10000";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const count = 48;
  const particles: CanvasParticle[] = [];

  for (let i = 0; i < count; i++) {
    if (targetMode === "dark") {
      // Mode MALAM: taburan bintang kecil & bulan sabit mini (butter & bubblegum) yang jatuh pelan
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 4.2;
      particles.push({
        x: originX + (Math.random() - 0.5) * 18,
        y: originY + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed * 0.85,
        vy: Math.sin(angle) * speed * 0.55 - 1.2,
        gravity: 0.055 + Math.random() * 0.035,
        drag: 0.985,
        size: 5 + Math.random() * 4.5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.06,
        alpha: 1,
        decay: 0.011 + Math.random() * 0.008,
        color: i % 3 === 0 ? "#FF9ECF" : "#FFE98A",
        shape: i % 3 === 0 ? "crescent" : "star",
      });
    } else {
      // Mode SIANG: ledakan bintang, hati, dan kelinci mini (denim, bubblegum, butter, mint)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
      const speed = 3.2 + Math.random() * 6.8;
      const colors = ["#3F6FD9", "#FF9ECF", "#FFE98A", "#9FE8C8"];
      const shapes: ParticleShape[] = ["star", "heart", "bunny", "star"];
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        gravity: 0.16 + Math.random() * 0.05,
        drag: 0.98,
        size: 5.5 + Math.random() * 4.5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.12,
        alpha: 1,
        decay: 0.013 + Math.random() * 0.009,
        color: colors[i % colors.length],
        shape: shapes[i % shapes.length],
      });
    }
  }

  let rafId = 0;
  const render = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = 0;

    for (const p of particles) {
      if (p.alpha <= 0) continue;
      alive++;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.alpha -= p.decay;
      drawCustomParticle(ctx, p);
    }

    if (alive > 0) {
      rafId = window.requestAnimationFrame(render);
    } else {
      window.cancelAnimationFrame(rafId);
      canvas.remove();
    }
  };

  rafId = window.requestAnimationFrame(render);
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<{
    id: number;
    text: string;
    mode: "light" | "dark";
  } | null>(null);

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const lastConfettiRef = React.useRef<number>(0);
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

    // Ambil koordinat tengah tombol (atau titik klik mouse)
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

    // Jika user mengaktifkan prefers-reduced-motion: ganti langsung tanpa lingkaran & tanpa konfeti
    if (prefersReducedMotion) {
      setTheme(nextMode);
      showThemeToast(nextMode);
      return;
    }

    // Throttle konfeti (minimal jeda 650ms jika diklik berkali-kali cepat)
    const now = Date.now();
    if (now - lastConfettiRef.current > 650) {
      lastConfettiRef.current = now;
      spawnThemeConfetti(clickX, clickY, nextMode);
    }

    const doc = document as ViewTransitionDoc;
    if (typeof doc.startViewTransition === "function") {
      const maxRadius = Math.hypot(
        Math.max(clickX, window.innerWidth - clickX),
        Math.max(clickY, window.innerHeight - clickY)
      );

      const transition = doc.startViewTransition(() => {
        // Sinkronkan class pada documentElement langsung agar snapshot baru langsung akurat
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
              duration: 700,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {
          // Abaikan bila view transition dibatalkan oleh klik super cepat berikutnya
        });
    } else {
      // Fallback: CSS transition 300ms pada body sudah aktif di globals.css
      setTheme(nextMode);
    }

    showThemeToast(nextMode);
  }

  return (
    <>
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

        {/* Knob Bulat yang Bergeser dengan Spring + Efek Hover Membesar */}
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
              /* Mode Siang: Matahari dengan Sinar Berputar Pelan (Turun & Terbenam saat berganti) */
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
              /* Mode Malam: Bulan Sabit dengan Kawah Kecil (Naik & Terbit saat berganti) */
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
                {/* Kawah Kecil di Bulan */}
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

      {/* Toast Singkat Setelah Beralih Mode */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage.id}
            role="status"
            aria-live="polite"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -20, scale: 0.92 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -14, scale: 0.95 }
            }
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="pointer-events-none fixed top-6 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2.5 rounded-full border-2 border-ink bg-card px-5 py-2.5 font-mono text-xs font-bold text-ink poster-shadow whitespace-nowrap"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full border border-[#14121F]"
              style={{
                backgroundColor:
                  toastMessage.mode === "light" ? "#FFE98A" : "#FF9ECF",
              }}
            />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
