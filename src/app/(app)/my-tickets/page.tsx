import type { Metadata } from "next";
import Link from "next/link";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import {
  formatEventDate,
  formatEventTime,
  formatRupiah,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Tickets",
  description: "Your NewTix concert and event tickets with instant QR passes.",
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
    const sampleEvent = FALLBACK_EVENTS[0];
    tickets = [
      {
        id: "sample-ticket-1",
        code: "NTX26SIM",
        checked_in_at: null,
        ticket_type_name: "Early Bird",
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
    <div className="kk">
      <main className="mx-auto max-w-[1000px] px-5 py-12 sm:py-16">
        <div className="section-head">
          <h2>
            My <span className="accent">Tickets</span>
          </h2>
          <p>Keep every QR pass ready for presentation at the gate.</p>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/events"
            className="gloss-silver px-4 py-2 text-[13px] font-semibold"
            style={{ textDecoration: "none" }}
          >
            Browse More Events &raquo;
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="booking-box mt-6 p-10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/newtix/home/5_Map/Pin1.png"
              alt=""
              style={{ width: 34, margin: "0 auto 12px", display: "block" }}
            />
            <h3 className="text-[18px] font-bold text-black">
              No tickets yet!
            </h3>
            <p className="mt-2 text-[13px] text-[#5a5a5a]">
              Find a concert, fan meeting, or festival and book your first pass.
            </p>
            <div className="mt-5">
              <Link
                href="/events"
                className="gloss-orange inline-block px-5 py-2 text-[14px] font-bold"
                style={{ textDecoration: "none" }}
              >
                Explore Events &raquo;
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-5 border border-[#c9c9c9] bg-white shadow-[0_2px_6px_rgba(0,0,0,.12)]">
            <div className="flex items-center justify-between border-b border-[#d9d9d9] bg-[#f4f4f4] px-4 py-2.5 text-[12px] font-bold text-[#2867a6]">
              <span>PASS LIST ({tickets.length})</span>
              <span>CLICK TO OPEN QR PASS</span>
            </div>
            <div className="divide-y divide-[#e5e5e5]">
              {tickets.map((t, i) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-[#e7f1fb] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/newtix/home/5_Map/Pin${(i % 6) + 1}.png`}
                      alt=""
                      style={{ width: 22, flexShrink: 0, marginTop: 2 }}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className="border border-[#7a7fb0] bg-[#edf9ff] px-2 py-0.5 text-[#2867a6]">
                          {t.ticket_type_name}
                        </span>
                        <span
                          className={`border px-2 py-0.5 ${
                            t.checked_in_at
                              ? "border-[#9a9a9a] bg-[#f4f4f4] text-[#6b6b6b]"
                              : "border-[#54ac32] bg-[#edf9e8] text-[#2f7d18]"
                          }`}
                        >
                          {t.checked_in_at ? "SCANNED" : "VALID · READY"}
                        </span>
                        <span className="text-[#5a5a5a]">
                          {formatRupiah(t.ticket_price)}
                        </span>
                      </div>
                      <Link
                        href={`/my-tickets/${t.code}`}
                        className="mt-1.5 block truncate text-[16px] font-bold text-black hover:text-[#2867a6]"
                        style={{ textDecoration: "none" }}
                      >
                        {t.event_title}
                      </Link>
                      <p className="mt-1 text-[12px] text-[#5a5a5a]">
                        {formatEventDate(t.event_starts_at)} ·{" "}
                        {formatEventTime(t.event_starts_at)} · {t.event_venue},{" "}
                        {t.event_city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[#e5e5e5] pt-3 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end shrink-0">
                    <div className="sm:text-right">
                      <span className="block text-[10px] font-bold text-[#8a8a8a]">
                        BOOKING REF
                      </span>
                      <span className="text-[15px] font-bold tracking-wider text-[#2867a6]">
                        #{t.code}
                      </span>
                    </div>
                    <Link
                      href={`/my-tickets/${t.code}`}
                      className="gloss-orange px-4 py-1.5 text-[13px] font-bold"
                      style={{ textDecoration: "none" }}
                    >
                      Open QR &raquo;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
