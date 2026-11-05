import type { Metadata } from "next";
import Link from "next/link";
import { QrCode, Calendar, MapPin, ArrowUpRight, Ticket } from "lucide-react";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BunnyMascot } from "@/components/shared/y2k-stickers";
import {
  formatEventDate,
  formatEventTime,
  formatRupiah,
  formatStubDate,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "Album Tiketku",
  description: "Daftar tiket konser dan acara yang sudah kamu amankan di NewTix.",
};

interface MemberTicketRow {
  id: string;
  code: string;
  checked_in_at: string | null;
  ticket_type_name: string;
  ticket_price: number;
  event_title: string;
  event_slug: string;
  event_venue: string;
  event_city: string;
  event_starts_at: string;
  order_created_at: string;
}

export default async function MyTicketsPage() {
  let tickets: MemberTicketRow[] = [];

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: orders } = await supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          events (
            title,
            slug,
            venue,
            city,
            starts_at
          ),
          tickets (
            id,
            code,
            checked_in_at,
            ticket_types (
              name,
              price
            )
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (orders) {
        for (const ord of orders) {
          const ev = Array.isArray(ord.events) ? ord.events[0] : ord.events;
          const tList = Array.isArray(ord.tickets) ? ord.tickets : [];
          for (const t of tList) {
            const tt = Array.isArray(t.ticket_types)
              ? t.ticket_types[0]
              : t.ticket_types;
            if (ev) {
              tickets.push({
                id: t.id,
                code: t.code,
                checked_in_at: t.checked_in_at,
                ticket_type_name: tt?.name || "Regular",
                ticket_price: tt?.price ?? 0,
                event_title: ev.title,
                event_slug: ev.slug,
                event_venue: ev.venue,
                event_city: ev.city,
                event_starts_at: ev.starts_at,
                order_created_at: ord.created_at,
              });
            }
          }
        }
      }
    }
  } else {
    // Preview sample ticket when Supabase is not yet connected
    const sampleEvent = FALLBACK_EVENTS[0];
    tickets = [
      {
        id: "sample-ticket-1",
        code: "NTX26SIM",
        checked_in_at: null,
        ticket_type_name: "Presale Gelombang 1",
        ticket_price: 125000,
        event_title: sampleEvent.title,
        event_slug: sampleEvent.slug,
        event_venue: sampleEvent.venue,
        event_city: sampleEvent.city,
        event_starts_at: sampleEvent.starts_at,
        order_created_at: new Date().toISOString(),
      },
    ];
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="border-b-2 border-ink pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="rounded-full border-2 border-ink bg-butter p-2 poster-shadow-sm hidden sm:block">
            <BunnyMascot mood="wink" className="w-11 h-11" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
              KOLEKSI TIKET MEMBER // NEWTIX
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">
              Album{" "}
              <span className="font-serif italic font-semibold text-denim">
                tiketmu.
              </span>
            </h1>
          </div>
        </div>

        <Button asChild variant="outline">
          <Link href="/events">Cari Acara Lain →</Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-ink bg-card p-12 text-center my-8">
          <Ticket className="w-10 h-10 text-denim mx-auto mb-3 -rotate-12" />
          <h2 className="font-display text-2xl font-extrabold mb-2">
            Album tiketmu masih kosong nih!
          </h2>
          <p className="text-sm text-ink-muted max-w-md mx-auto mb-6">
            Yuk cari konser, lokakarya kreatif, atau diskusi seru minggu ini dan
            kumpulkan tiket pertamamu.
          </p>
          <Button asChild>
            <Link href="/events">Jelajahi Acara Seru</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {tickets.map((t) => {
            const stub = formatStubDate(t.event_starts_at);
            return (
              <div
                key={t.id}
                className="flex flex-col md:flex-row rounded-xl border-2 border-ink bg-card poster-shadow ticket-notch-horizontal"
              >
                {/* Date Stub */}
                <div className="md:w-28 shrink-0 bg-cloud-subtle border-b-2 md:border-b-0 md:border-r-2 border-dashed border-ink/35 p-4 flex md:flex-col items-center justify-between text-center rounded-t-xl md:rounded-tr-none md:rounded-l-xl">
                  <div>
                    <span className="font-mono text-xs font-bold text-denim block">
                      {stub.weekday}
                    </span>
                    <span className="font-display text-4xl font-extrabold text-ink leading-none">
                      {stub.day}
                    </span>
                    <span className="font-mono text-xs font-bold text-ink-muted block">
                      {stub.month}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                    {t.event_city}
                  </span>
                </div>

                {/* Main Ticket Info */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="bubblegum">{t.ticket_type_name}</Badge>
                      {t.checked_in_at ? (
                        <Badge variant="ink">SUDAH CHECK-IN</Badge>
                      ) : (
                        <Badge variant="mint">AKTIF ★ SIAP SCAN</Badge>
                      )}
                      <span className="font-mono text-xs text-ink-muted">
                        {formatRupiah(t.ticket_price)}
                      </span>
                    </div>

                    <Link
                      href={`/my-tickets/${t.code}`}
                      className="block group"
                    >
                      <h2 className="font-display text-2xl font-extrabold tracking-tight group-hover:text-denim transition-colors">
                        {t.event_title}
                      </h2>
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-denim" />
                        {formatEventDate(t.event_starts_at)} •{" "}
                        {formatEventTime(t.event_starts_at)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-denim" />
                        {t.event_venue}, {t.event_city}
                      </span>
                    </div>
                  </div>

                  {/* Right QR Stub Callout */}
                  <div className="sm:border-l-2 sm:border-dashed sm:border-ink/25 sm:pl-6 flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
                        KODE TIKET
                      </span>
                      <span className="font-mono text-xl font-extrabold tracking-wider text-denim">
                        #{t.code}
                      </span>
                    </div>

                    <Button asChild size="sm">
                      <Link href={`/my-tickets/${t.code}`}>
                        <QrCode className="w-4 h-4" />
                        <span>Buka QR</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
