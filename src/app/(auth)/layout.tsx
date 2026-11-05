import Link from "next/link";
import { Ticket, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left column: Gig Poster Visual */}
      <aside className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-ink text-paper border-r-2 border-ink p-10 xl:p-14 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-paper"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 bg-vermilion text-white border-2 border-paper">
              <Ticket className="w-5 h-5 -rotate-12" />
            </span>
            KARCIS.
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest px-2.5 py-1 border border-paper/30 text-paper/80">
            CETAKAN RESMI // NO. 2026-ID
          </span>
        </div>

        <div className="relative z-10 my-auto py-12">
          <div className="inline-block -rotate-2 bg-mustard text-[#141210] font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6 border-2 border-[#141210]">
            PINTU MASuk TANPA CALO
          </div>
          <h1 className="font-display text-5xl xl:text-6xl font-extrabold tracking-tight leading-[0.96] mb-6">
            Sobek karcismu,{" "}
            <span className="font-serif italic font-normal text-vermilion">
              masuk paling depan.
            </span>
          </h1>
          <p className="text-paper/75 text-base max-w-md leading-relaxed">
            Satu akun untuk semua panggung independen, lokakarya cetak manual,
            hingga temu kode larut malam. Kode QR langsung tercetak di kantong
            digitalmu.
          </p>
        </div>

        {/* Bottom stub details */}
        <div className="relative z-10 border-t border-dashed border-paper/30 pt-6 flex items-center justify-between font-mono text-xs text-paper/70">
          <span>BANDUNG • JAKARTA • YOGYAKARTA • SURABAYA • DENPASAR</span>
          <span>100% BEBAS ANTRE</span>
        </div>

        {/* Decorative oversized ticket number watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -bottom-12 -right-8 font-mono text-[160px] font-black leading-none text-paper/[0.04]"
        >
          #084
        </div>
      </aside>

      {/* Right column: Form */}
      <main className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 md:p-14">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink hover:text-vermilion transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mx-auto my-10">{children}</div>

        <div className="text-center font-mono text-xs text-ink-muted">
          KARCIS © 2026 — Dicetak di atas kertas digital berkualitas tinggi.
        </div>
      </main>
    </div>
  );
}

