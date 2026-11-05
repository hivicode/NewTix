import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarqueeStrip } from "@/components/shared/marquee-strip";
import { TicketEventCard } from "@/components/shared/ticket-event-card";
import { getCategories, getFeaturedEvents } from "@/lib/queries";
import { formatEventDate, formatRupiah } from "@/lib/utils";

export default async function LandingPage() {
  const [categories, featuredEvents] = await Promise.all([
    getCategories(),
    getFeaturedEvents(6),
  ]);

  const heroSpotlight = featuredEvents[0];

  return (
    <main>
      {/* HERO SECTION: Asymmetric Poster & Physical Ticket Composition */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Left 7 Cols: Bold Editorial Display Typography */}
          <div className="lg:col-span-7 space-y-6 pt-2">
            <div className="inline-flex items-center gap-2 border-2 border-ink bg-mustard text-[#141210] px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest poster-shadow-sm -rotate-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LOKET MANDIRI PANGGUNG & LOKAKARYA</span>
            </div>

            <h1 className="font-display font-extrabold tracking-tight text-ink leading-[0.94] text-[clamp(2.65rem,6vw,5.4rem)]">
              Tiket aman,{" "}
              <span className="font-serif italic font-normal text-vermilion">
                antrean
              </span>{" "}
              nggak ada.
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-xl leading-relaxed">
              Dari malam shoegaze di gudang tua Bandung, lokakarya cetak
              Risograph di Kemang, sampai bedah sistem database di Pos Bloc.
              Pesan karcis tanpa drama bot dan tanpa biaya siluman.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button asChild size="lg">
                <Link href="/events">
                  <span>Buka Loket Acara</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/my-tickets">
                  <QrCode className="w-4 h-4" />
                  <span>Cek Dompet Karcis</span>
                </Link>
              </Button>
            </div>

            {/* Stamp Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-lg border-t-2 border-dashed border-ink/25">
              <div>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-ink block">
                  0%
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  Toleransi Oversell
                </span>
              </div>
              <div>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-vermilion block">
                  &lt; 3 dtk
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  Cetak QR Instan
                </span>
              </div>
              <div>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-ink block">
                  5 Kota
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  Kurasi Independen
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Tilted Gig Poster Spotlight Card */}
          {heroSpotlight && (
            <div className="lg:col-span-5 relative">
              {/* Sticker Stamp */}
              <div className="absolute -top-4 -left-3 z-20">
                <Badge variant="default" sticker className="text-xs px-4 py-1.5">
                  SOROTAN PEKAN INI
                </Badge>
              </div>

              <div className="border-2 border-ink bg-card p-4 sm:p-5 poster-shadow lg:rotate-1 transition-transform hover:rotate-0">
                <div className="flex items-center justify-between border-b-2 border-ink pb-2.5 mb-3.5 font-mono text-[11px] uppercase tracking-widest">
                  <span className="font-bold text-vermilion">
                     CETAKAN #01 // {heroSpotlight.city}
                  </span>
                  <span>PINTU BUKA 19:00 WIB</span>
                </div>

                {heroSpotlight.cover_url && (
                  <div className="relative h-64 sm:h-72 w-full border-2 border-ink overflow-hidden mb-4 bg-ink">
                    <Image
                      src={heroSpotlight.cover_url}
                      alt={heroSpotlight.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <h2 className="font-display text-2xl font-extrabold tracking-tight leading-snug mb-2">
                  {heroSpotlight.title}
                </h2>

                <div className="space-y-1 font-mono text-xs text-ink-muted mb-4">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-vermilion" />
                    <span>{formatEventDate(heroSpotlight.starts_at)}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-vermilion" />
                    <span>
                      {heroSpotlight.venue}, {heroSpotlight.city}
                    </span>
                  </p>
                </div>

                <div className="pt-3.5 border-t-2 border-dashed border-ink/30 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
                      HARGA PRESALE
                    </span>
                    <span className="font-mono text-lg font-extrabold text-ink">
                      {formatRupiah(
                        heroSpotlight.ticket_types?.[1]?.price ||
                          heroSpotlight.ticket_types?.[0]?.price ||
                          85000
                      )}
                    </span>
                  </div>

                  <Button asChild size="sm">
                    <Link href={`/events/${heroSpotlight.slug}`}>
                      Ambil Karcis →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <MarqueeStrip />

      {/* CATEGORY STAMPS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 border-b-2 border-dashed border-ink/25">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-vermilion block">
              KURASI KATEGORI
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Pilih frekuensi{" "}
              <span className="font-serif italic font-normal text-vermilion">
                panggungmu.
              </span>
            </h2>
          </div>
          <Link
            href="/events"
            className="font-mono text-xs font-bold uppercase tracking-widest text-ink underline decoration-vermilion decoration-2 underline-offset-4 hover:text-vermilion"
          >
            Lihat Semua Kategori →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/events?category=${cat.slug}`}
              className="group border-2 border-ink bg-card p-4 poster-shadow-sm hover:bg-vermilion hover:text-[#FAF7F2] transition-all flex flex-col justify-between min-h-[112px]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs opacity-70">
                  0{i + 1} // {cat.slug.toUpperCase()}
                </span>
                <span className="text-xl" aria-hidden="true">
                  {cat.emoji}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <span className="font-display text-lg font-extrabold tracking-tight leading-tight">
                  {cat.name}
                </span>
                <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-vermilion block">
              JADWAL TERDEKAT // CETAKAN TERBATAS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
              Acara pilihan{" "}
              <span className="font-serif italic font-normal text-vermilion">
                bulan ini.
              </span>
            </h2>
          </div>

          <Button asChild variant="outline">
            <Link href="/events">Jelajahi Semua Acara (8)</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {featuredEvents.map((event, index) => (
            <TicketEventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </section>

      {/* 3-STEP HOW IT WORKS */}
      <section className="border-y-2 border-ink bg-paper-subtle py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-vermilion block">
              CARA KERJA LOKET KARCIS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mt-1">
              Tiga langkah,{" "}
              <span className="font-serif italic font-normal text-vermilion">
                langsung masuk venue.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-ink bg-card p-6 poster-shadow relative">
              <span className="inline-block border-2 border-ink bg-vermilion text-white font-mono text-xs font-bold px-2.5 py-1 mb-4">
                LANGKAH 01
              </span>
              <h3 className="font-display text-2xl font-extrabold mb-2">
                Pilih Panggung & Kuota Live
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Pantau sisa karcis secara real-time. Angka kuota di layar
                bergerak langsung setiap ada pembelian tanpa perlu refresh
                halaman.
              </p>
            </div>

            <div className="border-2 border-ink bg-card p-6 poster-shadow relative">
              <span className="inline-block border-2 border-ink bg-mustard text-[#141210] font-mono text-xs font-bold px-2.5 py-1 mb-4">
                LANGKAH 02
              </span>
              <h3 className="font-display text-2xl font-extrabold mb-2">
                Kunci Baris Transaksi Atomik
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Begitu kamu klik beli, mesin database PostgreSQL mengunci
                jatahmu. Nggak ada cerita sudah bayar tapi kehabisan kursi.
              </p>
            </div>

            <div className="border-2 border-ink bg-card p-6 poster-shadow relative">
              <span className="inline-block border-2 border-ink bg-pine text-white font-mono text-xs font-bold px-2.5 py-1 mb-4">
                LANGKAH 03
              </span>
              <h3 className="font-display text-2xl font-extrabold mb-2">
                Tunjukkan Karcis QR di Pintu
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Karcis digital lengkap dengan perforasi, kode unik 8 karakter,
                dan QR siap dipindai penjaga pintu. Simpan atau cetak sesukamu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
        <div className="border-2 border-ink bg-ink text-paper p-8 sm:p-12 lg:p-16 poster-shadow relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 bg-vermilion text-white font-mono text-xs font-bold uppercase tracking-widest px-3 py-1">
              <Ticket className="w-3.5 h-3.5" />
              JANGAN SAMPAI KEHABISAN PRESALE
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[0.98]">
              Kursi terbatas,{" "}
              <span className="font-serif italic font-normal text-mustard">
                cerita malam itu
              </span>{" "}
              cuma sekali.
            </h2>
            <p className="text-paper/80 text-sm sm:text-base leading-relaxed">
              Buat akun gratis dalam 10 detik menggunakan email atau GitHub
              OAuth, lalu amankan karcismu sebelum stiker SOLD OUT ditempel.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <Link href="/events">Cari Acara Sekarang</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-paper text-ink hover:bg-mustard"
              >
                <Link href="/register">Buat Akun Anggota</Link>
              </Button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none select-none hidden lg:block absolute -right-6 -bottom-10 font-mono text-[140px] font-black text-paper/[0.06] leading-none"
          >
            KARCIS
          </div>
        </div>
      </section>
    </main>
  );
}
