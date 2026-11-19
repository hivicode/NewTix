import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCurrentUserAndProfile,
  getEventBySlug,
} from "@/lib/queries";
import { formatEventDate, formatEventTime } from "@/lib/utils";
import { TicketPurchaseWidget } from "@/components/features/ticket-purchase-widget";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `${event.title} — ${event.city}`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: `${event.title} | NewTix`,
      description: event.description.slice(0, 160),
      type: "website",
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

  const ticketTypes = event.ticket_types || [];
  const isEnded = event.status === "ended";

  return (
    <div className="kk">
      <main className="mx-auto max-w-[1120px] px-5 py-10 sm:py-14">
        {/* Top breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-[13px]">
          <Link href="/events" className="link-blue font-semibold">
            &laquo; Back to Events
          </Link>
          <span className="text-[11px] font-semibold text-[#8a8a8a] hidden sm:inline">
            NEWTIX // {event.city.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] items-start">
          {/* Left: Event Details Frame */}
          <div className="border border-[#c9c9c9] bg-white shadow-[0_2px_8px_rgba(0,0,0,.12)]">
            {/* Top strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d9d9d9] bg-[#f4f4f4] px-5 py-2.5 text-[12px] font-bold">
              <span className="text-[#2867a6]">
                {event.categories?.name || "Featured Show"}
              </span>
              <span
                className={`border px-2 py-0.5 text-[10px] ${
                  isEnded
                    ? "border-[#9a9a9a] bg-white text-[#6b6b6b]"
                    : "border-[#54ac32] bg-[#edf9e8] text-[#2f7d18]"
                }`}
              >
                {isEnded ? "ARCHIVE · ENDED" : "LIVE TICKETING"}
              </span>
            </div>

            {/* Cover */}
            {event.cover_url && (
              <div className="bg-[#eaf4fb] p-4 sm:p-5 border-b border-[#d9d9d9]">
                <div className="overflow-hidden border border-[#c9c9c9] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.cover_url}
                    alt={event.title}
                    className="w-full aspect-[16/9] object-cover block"
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-5 sm:p-7">
              <h1 className="text-[26px] sm:text-[32px] font-bold leading-tight text-black">
                {event.title}
              </h1>

              {/* Metadata grid */}
              <div className="mt-5 grid grid-cols-1 gap-3 border-y border-[#e5e5e5] py-4 text-[13px] sm:grid-cols-3">
                <div>
                  <span className="block text-[10px] font-bold text-[#2867a6]">
                    DATE
                  </span>
                  <span className="font-semibold text-black">
                    {formatEventDate(event.starts_at)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-[#2867a6]">
                    TIME
                  </span>
                  <span className="font-semibold text-black">
                    {formatEventTime(event.starts_at)} –{" "}
                    {formatEventTime(event.ends_at)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-[#2867a6]">
                    VENUE
                  </span>
                  <span className="font-semibold text-black">
                    {event.venue}, {event.city}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5">
                <h2 className="text-[13px] font-bold text-[#2867a6] mb-2">
                  ABOUT THIS EVENT
                </h2>
                <p className="text-[14px] leading-relaxed text-[#333] whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Retro Ticket Booth */}
          <div className="lg:sticky lg:top-[74px]">
            <TicketPurchaseWidget
              eventId={event.id}
              eventSlug={event.slug}
              initialTicketTypes={ticketTypes}
              isLoggedIn={Boolean(user)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
