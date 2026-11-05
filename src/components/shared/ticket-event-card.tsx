"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Y2KStarSticker } from "@/components/shared/y2k-stickers";
import {
  formatEventTime,
  formatRupiah,
  formatStubDate,
  cn,
} from "@/lib/utils";
import type { EventItem } from "@/types/database";

interface TicketEventCardProps {
  event: EventItem;
  index?: number;
}

export function TicketEventCard({ event, index = 0 }: TicketEventCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const stub = formatStubDate(event.starts_at);

  const ticketTypes = event.ticket_types || [];
  const totalQuota = ticketTypes.reduce((acc, t) => acc + t.quota, 0);
  const totalRemaining = ticketTypes.reduce((acc, t) => acc + t.remaining, 0);
  const lowestPrice =
    ticketTypes.length > 0
      ? Math.min(...ticketTypes.map((t) => t.price))
      : 0;

  const isArchive = event.status === "ended";
  const isSoldOut = isArchive || (ticketTypes.length > 0 && totalRemaining === 0);
  const isAlmostSoldOut =
    !isSoldOut &&
    totalQuota > 0 &&
    totalRemaining / totalQuota < 0.18;
  const isFree = !isArchive && ticketTypes.some((t) => t.price === 0);

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 26,
        delay: prefersReducedMotion ? 0 : index * 0.06,
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -4,
              rotate: -0.6,
              transition: { type: "spring", stiffness: 400, damping: 22 },
            }
      }
      className={cn(
        "group relative flex flex-col sm:flex-row rounded-xl border-2 border-ink poster-shadow ticket-notch-horizontal transition-all",
        isArchive ? "bg-cloud-subtle/70 opacity-90" : "bg-card"
      )}
    >
      {/* Rubber Stamp Miring untuk Event Arsip */}
      {isArchive && (
        <div className="absolute top-2 right-3 sm:top-3 sm:right-4 z-30 pointer-events-none rotate-[-10deg] select-none">
          <div className="border-2 border-dashed border-[#E11D48] bg-card/95 px-2.5 py-1 rounded shadow-sm">
            <span className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-[#E11D48] uppercase">
              ★ ARSIP • SOLD OUT ★
            </span>
          </div>
        </div>
      )}

      {/* Sticker Badge (Rotated -6deg) */}
      {!isArchive && (
        <div className="absolute -top-3.5 right-4 z-20 flex items-center gap-1.5">
          {isSoldOut ? (
            <Badge variant="ink" sticker>
              SOLD OUT
            </Badge>
          ) : isAlmostSoldOut ? (
            <Badge variant="bubblegum" sticker>
              HAMPIR HABIS • SISA {totalRemaining}
            </Badge>
          ) : isFree ? (
            <Badge variant="mint" sticker>
              GRATIS!
            </Badge>
          ) : (
            <Badge variant="butter" sticker>
              MASIH ADA
            </Badge>
          )}
        </div>
      )}

      {/* Left Vertical Date Stub */}
      <div className="sm:w-24 shrink-0 bg-cloud-subtle border-b-2 sm:border-b-0 sm:border-r-2 border-dashed border-ink/35 p-3.5 sm:p-4 flex sm:flex-col items-center justify-between text-center rounded-t-xl sm:rounded-tr-none sm:rounded-l-xl">
        <div className="flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-denim">
            {stub.weekday}
          </span>
          <span className="font-display text-3xl sm:text-4xl font-extrabold leading-none tracking-tighter text-ink my-0.5">
            {stub.day}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted">
            {stub.month}
          </span>
        </div>

        <div className="sm:mt-4 sm:pt-3 sm:border-t sm:border-ink/20 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          {event.city}
        </div>
      </div>

      {/* Main Ticket Content */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Category Pill */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 border-2 border-ink bg-background text-ink">
              <span>{event.categories?.emoji || "🎫"}</span>
              <span>{event.categories?.name || "Acara"}</span>
            </span>
          </div>

          {/* Y2K Photobooth Frame for Event Cover */}
          {event.cover_url && (
            <Link
              href={`/events/${event.slug}`}
              className="block photobooth-frame mb-4 group/photo"
            >
              <div className="relative h-38 w-full overflow-hidden border border-[#14121F] bg-ink">
                <Image
                  src={event.cover_url}
                  alt={event.title}
                  fill
                  unoptimized={event.cover_url.startsWith("/") || event.cover_url.endsWith(".svg")}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover/photo:scale-105"
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-muted px-0.5">
                <span>CAM_0{index + 1} // {event.city}</span>
                <span>{formatEventTime(event.starts_at)}</span>
              </div>
              <Y2KStarSticker
                className="w-5 h-5 absolute -bottom-2 right-2 rotate-12"
                color="#FF9ECF"
              />
            </Link>
          )}

          <Link href={`/events/${event.slug}`} className="block group/title">
            <h3 className="font-display text-xl font-extrabold tracking-tight leading-snug text-ink group-hover/title:text-denim transition-colors line-clamp-2">
              {event.title}
            </h3>
          </Link>

          <div className="mt-2.5 space-y-1 text-xs text-ink-muted font-mono">
            <p className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-denim shrink-0" />
              <span className="truncate">
                {event.venue}, {event.city}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-denim shrink-0" />
              <span>Mulai {formatEventTime(event.starts_at)}</span>
            </p>
          </div>
        </div>

        {/* Dashed Tear-Off Footer */}
        <div className="mt-4 pt-3.5 border-t-2 border-dashed border-ink/25 flex items-end justify-between gap-2">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              {isArchive ? "STATUS DOKUMEN" : "TIKET MULAI"}
            </span>
            <span className={cn(
              "font-mono text-base font-extrabold",
              isArchive ? "text-[#E11D48] text-sm sm:text-base" : "text-ink"
            )}>
              {isArchive ? "ARSIP • SOLD OUT" : formatRupiah(lowestPrice)}
            </span>
          </div>

          <Link
            href={`/events/${event.slug}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border-2 border-ink px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider poster-shadow-sm transition-colors min-h-[40px]",
              isArchive
                ? "bg-cloud-subtle text-ink hover:bg-card"
                : "bg-denim text-white hover:bg-denim-hover"
            )}
          >
            <span>{isArchive ? "Lihat Arsip" : isSoldOut ? "Lihat Detail" : "Ambil Tiket"}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
