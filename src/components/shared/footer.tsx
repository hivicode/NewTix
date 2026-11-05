import Link from "next/link";
import {
  NewTixLogo,
  BunnyMascot,
  Y2KStarSticker,
} from "@/components/shared/y2k-stickers";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-card text-ink mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b-2 border-dashed border-ink/25">
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-flex items-center">
                <NewTixLogo />
              </Link>
              <Y2KStarSticker className="w-5 h-5" color="#FF9ECF" />
            </div>
            <p className="text-sm text-ink-muted max-w-md leading-relaxed">
              Arsip memorabilia konser, fan meeting, dan temu komunitas bertema nostalgia era Y2K.
              Tiket aman, hati tenang, tinggal siapin outfit terbaikmu!
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-butter text-[#14121F] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider">
              <span>★ JAKARTA • BANDUNG • BANYUWANGI • SEOUL • TOKYO ★</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              Kategori Acara
            </h3>
            <ul className="space-y-2 text-sm font-mono text-xs">
              <li>
                <Link
                  href="/events?category=fan-meeting"
                  className="text-ink-muted hover:text-denim transition-colors"
                >
                  🐰 Fan Meeting
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=festival-awards"
                  className="text-ink-muted hover:text-denim transition-colors"
                >
                  🏆 Festival &amp; Awards
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=fan-made-event"
                  className="text-ink-muted hover:text-denim transition-colors"
                >
                  💙 Fan-made Event
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=workshop-kreatif"
                  className="text-ink-muted hover:text-denim transition-colors"
                >
                  ✂️ Workshop Kreatif
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              Member Club
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/my-tickets"
                  className="text-ink-muted hover:text-denim transition-colors"
                >
                  Album Tiketku
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-ink-muted hover:text-denim transition-colors"
                >
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-ink-muted hover:text-denim transition-colors"
                >
                  Daftar Member Baru
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-ink-muted hover:text-denim transition-colors"
                >
                  Ruang Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <BunnyMascot mood="wink" className="w-8 h-8" />
            <span>
              © 2026 NewTix. Semua kuota tiket dijaga real-time &amp; bebas calo.
            </span>
          </div>
          <span className="rounded-full border-2 border-ink px-3 py-1 bg-bubblegum text-[#14121F] font-bold">
            CETAKAN Y2K // EDISI 2026
          </span>
        </div>

        {/* Disclaimer Proyek Belajar & Arsip */}
        <div className="mt-6 pt-4 border-t border-dashed border-ink/20 text-center">
          <p className="font-mono text-[11px] text-ink-muted leading-relaxed max-w-3xl mx-auto">
            NewTix adalah proyek belajar. Data event asli diambil dari informasi publik dan hanya sebagai arsip. Event bertanda Fan-made bersifat fiktif. Tidak berafiliasi dengan artis atau agensi mana pun.
          </p>
        </div>
      </div>
    </footer>
  );
}
