import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  QrCode,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarqueeStrip } from "@/components/shared/marquee-strip";
import { TicketEventCard } from "@/components/shared/ticket-event-card";
import {
  BunnyMascot,
  BunnyStickerBadge,
  ThemeAwareBunnyMascot,
  Y2KStarSticker,
} from "@/components/shared/y2k-stickers";
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
      {/* HERO SECTION: Y2K Concert Ticket & Photobooth Aesthetic */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Left 7 Cols: Cheerful, Personal Editorial Typography */}
          <div className="lg:col-span-7 space-y-6 pt-2 relative">
            <div className="flex flex-wrap items-center gap-3">
              <BunnyStickerBadge label="NEWTIX CLUB // EDISI Y2K" />
              <Y2KStarSticker className="w-6 h-6 rotate-12" color="#FFE98A" />
            </div>

            <h1 className="font-display font-extrabold tracking-tight text-ink leading-[0.95] text-[clamp(2.65rem,6vw,5.25rem)]">
              Tiket aman,{" "}
              <span className="font-serif italic font-semibold text-denim">
                hati tenang,
              </span>{" "}
              tinggal datang!
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-xl leading-relaxed">
              Mau nyanyi bareng di gigs akhir pekan, ikutan kelas cetak zine,
              atau nongkrong di pasar kopi? Di{" "}
              <strong className="text-ink">NewTix</strong>, kamu nggak perlu
              rebutan lawan bot. Pilih acaranya, simpan tiket lucumu, dan sampai
              ketemu di depan panggung!
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button asChild size="lg">
                <Link href="/events">
                  <span>Cari Acara Seru</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/my-tickets">
                  <QrCode className="w-4 h-4" />
                  <span>Buka Album Tiketku</span>
                </Link>
              </Button>
            </div>

            {/* Y2K Stamp Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-lg border-t-2 border-dashed border-ink/25">
              <div className="rounded-lg border-2 border-ink bg-card p-3 poster-shadow-sm">
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-denim block">
                  100%
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Kuota Dijaga Live
                </span>
              </div>
              <div className="rounded-lg border-2 border-ink bg-butter text-[#14121F] p-3 poster-shadow-sm -rotate-1">
                <span className="font-mono text-xl sm:text-2xl font-extrabold block">
                  3 dtk
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                  QR Langsung Jadi
                </span>
              </div>
              <div className="rounded-lg border-2 border-ink bg-mint text-[#14121F] p-3 poster-shadow-sm rotate-1">
                <span className="font-mono text-xl sm:text-2xl font-extrabold block">
                  0 Calo
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                  Harga Jujur
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Y2K Photobooth Strip Spotlight Card */}
          {heroSpotlight && (
            <div className="lg:col-span-5 relative">
              {/* Bunny & Star Stickers */}
              <div className="absolute -top-4 -left-3 z-20 flex items-center gap-2">
                <Badge
                  variant="bubblegum"
                  sticker
                  className="text-xs px-4 py-1.5"
                >
                  ★ PILIHAN MINGGU INI ★
                </Badge>
              </div>
              <div className="absolute -bottom-5 -right-3 z-20 hidden sm:block">
                <div className="rounded-full border-2 border-[#14121F] bg-butter p-2 sticker-shadow rotate-6">
                  <ThemeAwareBunnyMascot className="w-12 h-12" />
                </div>
              </div>

              <div className="rounded-2xl border-2 border-ink bg-card p-4 sm:p-5 poster-shadow lg:rotate-1 transition-transform hover:rotate-0">
                <div className="flex items-center justify-between border-b-2 border-dashed border-ink/30 pb-2.5 mb-3.5 font-mono text-[11px] uppercase tracking-widest">
                  <span className="font-bold text-denim">
                    PHOTOBOOTH #01 // {heroSpotlight.city}
                  </span>
                  <span className="rounded-full bg-mint text-[#14121F] px-2 py-0.5 text-[10px] font-bold border border-ink">
                    READY
                  </span>
                </div>

                {heroSpotlight.cover_url && (
                  <div className="photobooth-frame mb-4">
                    <div className="relative h-60 sm:h-68 w-full border border-[#14121F] overflow-hidden bg-ink">
                      <Image
                        src={heroSpotlight.cover_url}
                        alt={heroSpotlight.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-muted px-1">
                      <span>NEWTIX SNAPSHOT ★ 2026</span>
                      <span>PINTU BUKA 19:00</span>
                    </div>
                  </div>
                )}

                <h2 className="font-display text-2xl font-extrabold tracking-tight leading-snug mb-2">
                  {heroSpotlight.title}
                </h2>

                <div className="space-y-1 font-mono text-xs text-ink-muted mb-4">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-denim" />
                    <span>{formatEventDate(heroSpotlight.starts_at)}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-denim" />
                    <span>
                      {heroSpotlight.venue}, {heroSpotlight.city}
                    </span>
                  </p>
                </div>

                <div className="pt-3.5 border-t-2 border-dashed border-ink/30 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
                      HARGA TIKET
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
                      Ambil Tiket →
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
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
              KOLEKSI KATEGORI
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Lagi pengen{" "}
              <span className="font-serif italic font-semibold text-denim">
                suasana apa
              </span>{" "}
              akhir pekan ini?
            </h2>
          </div>
          <Link
            href="/events"
            className="font-mono text-xs font-bold uppercase tracking-widest text-ink underline decoration-bubblegum decoration-2 underline-offset-4 hover:text-denim"
          >
            Lihat Semua Kategori →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/events?category=${cat.slug}`}
              className="group rounded-xl border-2 border-ink bg-card p-4 poster-shadow-sm hover:bg-bubblegum hover:text-[#14121F] transition-all flex flex-col justify-between min-h-[116px]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs opacity-75">
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
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
              JADWAL TERDEKAT ★ JANGAN SAMPAI KELEWATAN
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
              Acara paling{" "}
              <span className="font-serif italic font-semibold text-denim">
                ditunggu-tunggu.
              </span>
            </h2>
          </div>

          <Button asChild variant="outline">
            <Link href="/events">Lihat Semua Acara (8)</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {featuredEvents.map((event, index) => (
            <TicketEventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </section>

      {/* 3-STEP HOW IT WORKS */}
      <section className="border-y-2 border-ink bg-cloud-subtle py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
              GAMPANG BANGET // 3 LANGKAH AJA
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mt-1">
              Cara dapetin tiket di{" "}
              <span className="font-serif italic font-semibold text-denim">
                NewTix.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border-2 border-ink bg-card p-6 poster-shadow relative">
              <span className="inline-block rounded-full border-2 border-ink bg-denim text-white font-mono text-xs font-bold px-3 py-1 mb-4">
                LANGKAH 01 ★
              </span>
              <h3 className="font-display text-2xl font-extrabold mb-2">
                Intip Acara & Kuota Live
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Sisa kuota tiket tampil jujur dan berubah langsung di layarmu
                tanpa perlu bolak-balik refresh halaman.
              </p>
            </div>

            <div className="rounded-xl border-2 border-ink bg-card p-6 poster-shadow relative">
              <span className="inline-block rounded-full border-2 border-ink bg-bubblegum text-[#14121F] font-mono text-xs font-bold px-3 py-1 mb-4">
                LANGKAH 02 ★
              </span>
              <h3 className="font-display text-2xl font-extrabold mb-2">
                Klik Beli, Jatahmu Dikunci
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Begitu kamu checkout, sistem langsung mengunci kursimu. Nggak
                bakal ada drama tiket ganda atau kehabisan di tengah jalan.
              </p>
            </div>

            <div className="rounded-xl border-2 border-ink bg-card p-6 poster-shadow relative">
              <span className="inline-block rounded-full border-2 border-ink bg-mint text-[#14121F] font-mono text-xs font-bold px-3 py-1 mb-4">
                LANGKAH 03 ★
              </span>
              <h3 className="font-display text-2xl font-extrabold mb-2">
                Pamerkan Tiket QR di Pintu
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Tiket digitalmu keluar lengkap dengan QR code, stiker kelinci,
                dan nomor seri unik. Tinggal scan, langsung masuk venue!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-2xl border-2 border-ink bg-denim text-white p-8 sm:p-12 lg:p-16 poster-shadow relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#14121F] bg-butter text-[#14121F] font-mono text-xs font-bold uppercase tracking-widest px-3.5 py-1">
              <span>★ SIAP BUAT MALAM YANG SERU? ★</span>
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[0.98]">
              Jangan tunggu sampai{" "}
              <span className="font-serif italic font-semibold text-butter">
                stiker sold out
              </span>{" "}
              ditempel!
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Bikin akun member NewTix cuma butuh beberapa detik lewat email
              atau GitHub. Yuk, amankan tiket pertamamu hari ini!
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-bubblegum text-[#14121F] hover:bg-butter"
              >
                <Link href="/events">Jelajahi Acara Sekarang</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white text-[#14121F] hover:bg-butter"
              >
                <Link href="/register">Daftar Member Gratis</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center absolute right-12 bottom-8 z-10">
            <div className="rounded-2xl border-2 border-[#14121F] bg-bubblegum p-4 sticker-shadow -rotate-6">
              <ThemeAwareBunnyMascot className="w-24 h-24" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
