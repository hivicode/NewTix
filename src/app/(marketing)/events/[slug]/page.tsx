import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  ShieldCheck,
} from "lucide-react";
import {
  getCurrentUserAndProfile,
  getEventBySlug,
} from "@/lib/queries";
import {
  formatEventDate,
  formatEventTime,
  formatStubDate,
} from "@/lib/utils";
import { TicketPurchaseWidget } from "@/components/features/ticket-purchase-widget";
import { Y2KStarSticker } from "@/components/shared/y2k-stickers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Acara Tidak Ditemukan",
    };
  }

  return {
    title: `${event.title} — ${event.city}`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: `${event.title} | NewTix`,
      description: event.description.slice(0, 160),
      type: "website",
      locale: "id_ID",
      images: event.cover_url ? [{ url: event.cover_url }] : [],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [event, { user }] = await Promise.all([
    getEventBySlug(slug),
    getCurrentUserAndProfile(),
  ]);

  if (!event) {
    notFound();
  }

  const stub = formatStubDate(event.starts_at);
  const ticketTypes = event.ticket_types || [];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Top breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:text-denim transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Acara
        </Link>

        <span className="font-mono text-xs text-ink-muted hidden sm:inline">
          NEWTIX SNAPSHOT // {event.slug.toUpperCase().slice(0, 18)}
        </span>
      </div>

      {/* Main Asymmetric Y2K Photobooth Poster + Live Ticket Booth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left 7 columns: Poster & Story */}
        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-2xl border-2 border-ink bg-card poster-shadow overflow-hidden">
            {/* Top Poster Strip */}
            <div className="bg-denim text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase tracking-widest border-b-2 border-ink">
              <span className="inline-flex items-center gap-2 font-bold">
                <span>{event.categories?.emoji || "🎫"}</span>
                <span>{event.categories?.name || "Acara Pilihan"}</span>
              </span>
              <span className="rounded-full bg-butter text-[#14121F] border border-[#14121F] px-2.5 py-0.5 font-bold">
                {event.city} ★ {stub.day} {stub.month}
              </span>
            </div>

            {/* Y2K Photobooth Cover Frame */}
            {event.cover_url && (
              <div className="p-4 sm:p-6 bg-cloud-subtle border-b-2 border-dashed border-ink/30">
                <div className="photobooth-frame">
                  <div className="relative h-64 sm:h-92 w-full border border-[#14121F] overflow-hidden bg-ink">
                    <Image
                      src={event.cover_url}
                      alt={event.title}
                      fill
                      priority
                      unoptimized={event.cover_url.startsWith("/") || event.cover_url.endsWith(".svg")}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-xs text-ink-muted px-1">
                    <span>PHOTOBOOTH STRIP // {event.city.toUpperCase()}</span>
                    <span>★ NEWTIX OFFICIAL ★</span>
                  </div>
                  <Y2KStarSticker
                    className="w-7 h-7 absolute -top-3 -right-3 rotate-12"
                    color="#FF9ECF"
                  />
                </div>
              </div>
            )}

            {/* Event Header & Metadata */}
            <div className="p-6 sm:p-8">
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.02] text-ink mb-6">
                {event.title}
              </h1>

              {/* Ticket Stub Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y-2 border-dashed border-ink/25 py-5 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-denim shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
                      TANGGAL
                    </span>
                    <span className="font-mono text-xs font-bold text-ink">
                      {formatEventDate(event.starts_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-denim shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
                      WAKTU ACARA
                    </span>
                    <span className="font-mono text-xs font-bold text-ink">
                      {formatEventTime(event.starts_at)} —{" "}
                      {formatEventTime(event.ends_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-denim shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
                      LOKASI VENUE
                    </span>
                    <span className="font-mono text-xs font-bold text-ink">
                      {event.venue}, {event.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-denim">
                  CERITA ACARA & INFO PENTING
                </h2>
                <p className="text-base text-ink leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>

                {/* Badge Penjelas Fan-made jika event fiktif */}
                {event.title.includes("Fan-made") && (
                  <div className="mt-4 p-3.5 rounded-xl border-2 border-dashed border-denim bg-cloud-subtle font-mono text-xs text-ink space-y-1">
                    <p className="font-bold text-denim uppercase tracking-wider flex items-center gap-1.5">
                      <span>💙</span>
                      <span>Pemberitahuan Event Fan-Made</span>
                    </p>
                    <p className="text-ink-muted">
                      Acara bertanda <strong>Fan-made</strong> bersifat fiktif dan diinisiasi oleh komunitas. Tidak berafiliasi dengan artis atau agensi mana pun.
                    </p>
                  </div>
                )}
              </div>

              {/* Timeline Singkat Arsip (2023 -> 2024) Khusus Event Asli */}
              {event.status === "ended" && (
                <div className="mt-8 pt-6 border-t-2 border-dashed border-ink/25 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-denim">
                      TIMELINE ARSIP RESMI // 2023 ➔ 2024
                    </h2>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                      DATA PUBLIK TERVERIFIKASI
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-ink/30">
                    {[
                      {
                        year: "2023",
                        date: "1-2 Juli 2023",
                        title: "Bunnies Camp",
                        venue: "SK Olympic Handball Gymnasium, Seoul",
                        note: "Fan meeting pertama NewJeans. Tiket sold out.",
                        slug: "bunnies-camp",
                      },
                      {
                        year: "2024",
                        date: "26-27 Juni 2024",
                        title: "Bunnies Camp 2024 Tokyo Dome",
                        venue: "Tokyo Dome, Tokyo",
                        note: "Fan meeting kedua dan penampilan solo pertama di Jepang. Bintang tamu: YOASOBI dan Rina Sawayama.",
                        slug: "bunnies-camp-2024-tokyo-dome",
                      },
                      {
                        year: "2024",
                        date: "8 September 2024",
                        title: "The Fact Music Awards 2024",
                        venue: "Kyocera Dome, Osaka",
                        note: "Penampilan sebagai bagian dari acara penghargaan.",
                        slug: "the-fact-music-awards-2024",
                      },
                      {
                        year: "2024",
                        date: "14 Desember 2024",
                        title: "Music Bank Global Festival 2024",
                        venue: "Fukuoka Dome, Fukuoka",
                        note: "Penampilan sebagai bagian dari festival, bukan konser tunggal.",
                        slug: "music-bank-global-festival-2024",
                      },
                    ].map((item, idx) => {
                      const isCurrent = item.slug === event.slug;
                      return (
                        <div key={idx} className="relative group">
                          {/* Dot pin */}
                          <div
                            className={`absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink ${
                              isCurrent ? "bg-[#E11D48]" : "bg-butter"
                            }`}
                          />
                          <div
                            className={`rounded-xl border-2 border-ink p-3.5 transition-all ${
                              isCurrent
                                ? "bg-card poster-shadow-sm border-denim"
                                : "bg-cloud-subtle/50 hover:bg-card"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-1 font-mono text-[11px]">
                              <span className="font-bold text-denim">
                                {item.date}
                              </span>
                              <span className="text-ink-muted">
                                {item.venue}
                              </span>
                            </div>
                            <Link
                              href={`/events/${item.slug}`}
                              className="font-display font-bold text-sm text-ink hover:text-denim inline-flex items-center gap-1.5"
                            >
                              <span>{item.title}</span>
                              {isCurrent && (
                                <span className="font-mono text-[10px] uppercase font-bold text-[#E11D48] bg-cloud px-2 py-0.5 rounded border border-ink">
                                  Halaman Ini
                                </span>
                              )}
                            </Link>
                            <p className="mt-1 font-mono text-xs text-ink-muted">
                              {item.note}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Venue Rules Footer */}
              <div className="mt-8 pt-6 border-t-2 border-dashed border-ink/25 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-ink-muted">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-denim shrink-0 mt-0.5" />
                  <span>
                    Tiket berisi kode QR 8-karakter unik yang dipindai satu kali
                    di pintu masuk venue.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Share2 className="w-4 h-4 text-denim shrink-0 mt-0.5" />
                  <span>
                    Datang 30 menit lebih awal biar santai tukar gelang dan
                    foto-foto dulu!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 columns: Sticky Real-Time Purchase Booth */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <TicketPurchaseWidget
            eventId={event.id}
            eventSlug={event.slug}
            initialTicketTypes={ticketTypes}
            isLoggedIn={Boolean(user)}
          />
        </div>
      </div>
    </main>
  );
}
