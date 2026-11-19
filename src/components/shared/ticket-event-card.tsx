"use client";

import Link from "next/link";
import Image from "next/image";
import { formatEventTime, formatRupiah, cn } from "@/lib/utils";
import type { EventItem } from "@/types/database";

interface TicketEventCardProps {
  event: EventItem;
  index?: number;
}

export function TicketEventCard({ event, index = 0 }: TicketEventCardProps) {
  const tt = event.ticket_types || [];
  const remaining = tt.reduce((a, t) => a + t.remaining, 0);
  const lowest = tt.length ? Math.min(...tt.map((t) => t.price)) : 0;
  const isArchive = event.status === "ended";
  const isSoldOut = isArchive || (tt.length > 0 && remaining === 0);

  return (
    <article className={cn("frame-card overflow-hidden", isArchive && "opacity-75")}>
      <div className="relative aspect-[4/3] w-full bg-[#edf9ff]">
        {event.cover_url && (
          <Image
            src={event.cover_url}
            alt={event.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="bg-[#eaf4fb] px-4 pt-3 pb-3 text-[13px]">
        <p className="font-semibold text-denim">{formatEventTime(event.starts_at)}</p>
        <h3 className="mt-0.5 flex items-center gap-1.5 text-[15px] font-bold text-black">
          <img
            src={`/newtix/home/5_Map/Pin${(index % 6) + 1}.png`}
            alt=""
            className="h-4 w-auto shrink-0"
          />
          <span className="truncate">{event.title}</span>
        </h3>
        <p className="truncate text-ink-muted">
          [{event.city}] {event.venue}
        </p>
        <img
          src="/newtix/home/2_Schedule/5Stars.png"
          alt="5 stars"
          className="mt-1.5 h-3.5 w-auto object-contain"
        />
        <div className="mt-2 flex items-center justify-between border-t border-[#cfe2f1] pt-2">
          <span className="font-bold">
            {isArchive ? "Ended" : isSoldOut ? "Sold out" : formatRupiah(lowest)}
          </span>
          <Link href={`/events/${event.slug}`} className="link-blue font-semibold">
            {isArchive ? "View Archive" : "Get Ticket"} »
          </Link>
        </div>
      </div>
    </article>
  );
}
