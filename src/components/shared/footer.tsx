import Link from "next/link";
import { Ticket } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-card text-ink mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b-2 border-dashed border-ink/25">
          <div className="md:col-span-6 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 bg-vermilion text-[#FAF7F2] border-2 border-ink poster-shadow-sm">
                <Ticket className="w-5 h-5 -rotate-12" />
              </span>
              <span>KARCIS.</span>
            </Link>
            <p className="text-sm text-ink-muted max-w-md leading-relaxed">
              Loket mandiri untuk panggung musik independen, diskusi teknologi,
              lokakarya cetak manual, dan perayaan kuliner lokal. Tiket aman,
              antrean nggak ada.
            </p>
            <p className="font-mono text-xs text-vermilion uppercase tracking-widest">
              DICETAK LANGSUNG DARI JAKARTA • BANDUNG • YOGYAKARTA • SURABAYA • DENPASAR
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              Peta Loket
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/events"
                  className="text-ink-muted hover:text-vermilion transition-colors"
                >
                  Semua Acara
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=musik"
                  className="text-ink-muted hover:text-vermilion transition-colors"
                >
                  Gigs & Musik
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=teknologi"
                  className="text-ink-muted hover:text-vermilion transition-colors"
                >
                  Temu Teknologi
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=lokakarya"
                  className="text-ink-muted hover:text-vermilion transition-colors"
                >
                  Lokakarya Kreatif
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              Akses Anggota
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/my-tickets"
                  className="text-ink-muted hover:text-vermilion transition-colors"
                >
                  Dompet Karcis Saya
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-ink-muted hover:text-vermilion transition-colors"
                >
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-ink-muted hover:text-vermilion transition-colors"
                >
                  Daftar Baru
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-ink-muted hover:text-vermilion transition-colors"
                >
                  Ruang Kendali Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ink-muted">
          <span>
            © 2026 KARCIS NUSANTARA. SELURUH TRANSAKSI DILINDUNGI KUNCI BARIS ATOMIK.
          </span>
          <span className="border border-ink px-2.5 py-1 bg-background text-ink">
            NO. SERI CETAK: KRC-VIII-2026
          </span>
        </div>
      </div>
    </footer>
  );
}

