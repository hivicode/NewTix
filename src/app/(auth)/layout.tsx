import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  BunnyMascot,
  NewTixLogo,
  Y2KStarSticker,
} from "@/components/shared/y2k-stickers";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left column: Y2K Concert Ticket & Photobooth Visual */}
      <aside className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-denim text-white border-r-2 border-ink p-10 xl:p-14 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 border-2 border-[#14121F] poster-shadow-sm"
          >
            <NewTixLogo className="text-[#14121F]" />
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full border-2 border-[#14121F] bg-butter text-[#14121F] font-bold">
            ★ NEWTIX CLUB 2026 ★
          </span>
        </div>

        <div className="relative z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 -rotate-2 rounded-full bg-bubblegum text-[#14121F] font-mono text-xs font-bold uppercase tracking-widest px-3.5 py-1 mb-6 border-2 border-[#14121F] sticker-shadow">
            <BunnyMascot mood="wink" className="w-5 h-5 -my-1" />
            <span>TIKET AMAN, HATI TENANG</span>
          </div>
          <h1 className="font-display text-5xl xl:text-6xl font-extrabold tracking-tight leading-[0.96] mb-6">
            Siapin outfitmu,{" "}
            <span className="font-serif italic font-semibold text-butter">
              tiketnya biar kami
            </span>{" "}
            yang jagain!
          </h1>
          <p className="text-white/90 text-base max-w-md leading-relaxed">
            Satu akun buat semua konser favorit, kelas kreatif akhir pekan,
            sampai nonton bareng. Begitu klik beli, tiket ber-QR langsung masuk
            ke album digitalmu.
          </p>
        </div>

        {/* Bottom stub details */}
        <div className="relative z-10 border-t-2 border-dashed border-white/30 pt-6 flex items-center justify-between font-mono text-xs text-white/90">
          <span>BANDUNG • JAKARTA • YOGYAKARTA • SURABAYA • DENPASAR</span>
          <Y2KStarSticker className="w-6 h-6" color="#FFE98A" />
        </div>
      </aside>

      {/* Right column: Form */}
      <main className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 md:p-14">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink hover:text-denim transition-colors min-h-[44px] font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mx-auto my-10">{children}</div>

        <div className="text-center font-mono text-xs text-ink-muted">
          NewTix © 2026 — Tiket konser & acara seru bergaya Y2K.
        </div>
      </main>
    </div>
  );
}
