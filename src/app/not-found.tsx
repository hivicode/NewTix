import Link from "next/link";
import { TicketSlash, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full border-2 border-ink bg-card p-8 sm:p-10 poster-shadow ticket-notch-horizontal text-center space-y-5">
        <div className="inline-flex items-center justify-center w-14 h-14 border-2 border-ink bg-mustard text-[#141210] mx-auto -rotate-6 poster-shadow-sm">
          <TicketSlash className="w-7 h-7" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-vermilion block">
            KODE 404 // KARCIS SOBEK ATAU KADALUWARSA
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">
            Panggung tidak{" "}
            <span className="font-serif italic font-normal text-vermilion">
              ditemukan.
            </span>
          </h1>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">
          Halaman atau kode karcis yang kamu cari mungkin sudah pindah venue,
          salah ketik, atau acaranya sudah selesai digelar.
        </p>

        <div className="pt-5 border-t-2 border-dashed border-ink/25 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/events">Jelajahi Acara Aktif</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Ke Loket Utama
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

