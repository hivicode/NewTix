import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BunnyMascot, Y2KStarSticker } from "@/components/shared/y2k-stickers";

export default function NotFoundPage() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full rounded-2xl border-2 border-ink bg-card p-8 sm:p-10 poster-shadow ticket-notch-horizontal text-center space-y-5 relative">
        <Y2KStarSticker
          className="w-7 h-7 absolute -top-3 right-6 rotate-12"
          color="#FF9ECF"
        />

        <div className="inline-flex items-center justify-center rounded-full border-2 border-ink bg-butter p-3 mx-auto -rotate-6 poster-shadow-sm">
          <BunnyMascot mood="dizzy" className="w-16 h-16" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
            ERROR 404 ★ HALAMAN TIDAK DITEMUKAN
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">
            Yah, tiketnya{" "}
            <span className="font-serif italic font-semibold text-denim">
              nyasar!
            </span>
          </h1>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">
          Kelinci NewTix sudah nyari ke belakang panggung, tapi halaman atau
          kode tiket yang kamu tuju nggak ketemu. Yuk balik ke daftar acara
          aktif!
        </p>

        <div className="pt-5 border-t-2 border-dashed border-ink/25 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/events">Lihat Acara Seru</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Ke Beranda NewTix
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
