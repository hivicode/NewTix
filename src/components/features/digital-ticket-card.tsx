"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Printer,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BunnyMascot,
  NewTixLogo,
  Y2KStarSticker,
} from "@/components/shared/y2k-stickers";
import {
  formatEventDate,
  formatEventTime,
  formatRupiah,
  formatStubDate,
} from "@/lib/utils";

export interface DigitalTicketData {
  code: string;
  checked_in_at: string | null;
  holder_name: string;
  holder_email: string;
  ticket_type_name: string;
  ticket_price: number;
  event_title: string;
  event_slug: string;
  event_venue: string;
  event_city: string;
  event_starts_at: string;
  event_ends_at: string;
  order_id: string;
  order_created_at: string;
  sibling_codes: string[];
}

export function DigitalTicketCard({
  ticket,
  justPurchased = false,
}: {
  ticket: DigitalTicketData;
  justPurchased?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const stub = formatStubDate(ticket.event_starts_at);

  const confettiPieces = React.useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: (i % 2 === 0 ? 1 : -1) * (25 + ((i * 19) % 140)),
        y: -40 - ((i * 23) % 110),
        rotate: (i * 47) % 360,
        color:
          i % 4 === 0
            ? "#3F6FD9"
            : i % 4 === 1
            ? "#FF9ECF"
            : i % 4 === 2
            ? "#FFE98A"
            : "#9FE8C8",
      })),
    []
  );

  const qrPayload = JSON.stringify({
    newtix_code: ticket.code,
    event: ticket.event_slug,
    holder: ticket.holder_name,
  });

  // Deterministic barcode bars based on ticket.code
  const barcodeBars = React.useMemo(() => {
    const seed = ticket.code
      .split("")
      .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
    return Array.from({ length: 38 }, (_, i) => {
      const w = ((seed + i * 7) % 3) + 1;
      return w;
    });
  }, [ticket.code]);

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Confetti Burst when justPurchased */}
      {justPurchased && !prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-6 flex justify-center z-30 overflow-visible"
        >
          {confettiPieces.map((piece) => (
            <motion.span
              key={piece.id}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: piece.x,
                y: piece.y,
                rotate: piece.rotate,
                scale: 0.6,
              }}
              transition={{ duration: 1.25, ease: "easeOut" }}
              style={{ backgroundColor: piece.color }}
              className="absolute w-3.5 h-3.5 rounded-full border border-[#14121F]"
            />
          ))}
        </div>
      )}

      {/* Success Banner with Bunny Mascot */}
      {justPurchased && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border-2 border-ink bg-mint text-[#14121F] p-4 sm:p-5 poster-shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="rounded-full border-2 border-[#14121F] bg-white p-1.5 shrink-0">
              <BunnyMascot mood="wink" className="w-11 h-11" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-denim">
                YAY! TIKET BERHASIL DICETAK ★
              </p>
              <p className="text-sm font-bold">
                Tiketmu sudah aman di kantong! Simpan halaman ini atau langsung
                tunjukkan QR di pintu masuk venue.
              </p>
            </div>
          </div>
          <Y2KStarSticker
            className="w-7 h-7 shrink-0 hidden sm:block"
            color="#FFE98A"
          />
        </motion.div>
      )}

      {/* Ticket Dispense Animation (Slide out of machine + subtle wobble) */}
      <motion.div
        initial={
          justPurchased && !prefersReducedMotion
            ? { y: -70, opacity: 0, rotate: -2 }
            : prefersReducedMotion
            ? false
            : { y: 16, opacity: 0 }
        }
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
        }}
        className="rounded-2xl border-2 border-ink bg-card poster-shadow overflow-hidden print:shadow-none"
      >
        {/* Top Denim Header Band */}
        <div className="bg-denim text-white px-6 py-4 flex items-center justify-between border-b-2 border-ink">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white px-2.5 py-1 border-2 border-[#14121F]">
              <NewTixLogo size="sm" className="text-[#14121F]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-butter block font-bold">
                OFFICIAL Y2K CONCERT PASS
              </span>
              <span className="font-mono text-[11px] text-white/90">
                SATU KALI PINDAI DI PINTU
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] uppercase tracking-widest text-butter block font-bold">
              SERI TIKET
            </span>
            <span className="text-lg font-extrabold tracking-wider text-white">
              #{ticket.code}
            </span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 sm:p-8 relative">
          {/* Decorative Bunny Stamp on Ticket Corner */}
          <div className="hidden sm:flex items-center gap-1.5 absolute top-6 right-6 rounded-full border-2 border-ink bg-butter text-[#14121F] px-3 py-1 font-mono text-[10px] font-bold rotate-3 sticker-shadow">
            <BunnyMascot mood="happy" className="w-5 h-5 -my-1" />
            <span>VERIFIED PASS</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="bubblegum">{ticket.ticket_type_name}</Badge>
            {ticket.checked_in_at ? (
              <Badge variant="ink" sticker>
                SUDAH DIPINDAI MASUK
              </Badge>
            ) : (
              <Badge variant="mint" sticker>
                AKTIF ★ SIAP MASUK
              </Badge>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-ink mb-6">
            {ticket.event_title}
          </h1>

          {/* Stub Date + Venue Box */}
          <div className="grid grid-cols-1 sm:grid-cols-12 rounded-xl border-2 border-ink bg-cloud-subtle mb-6 overflow-hidden">
            <div className="sm:col-span-3 border-b-2 sm:border-b-0 sm:border-r-2 border-dashed border-ink/35 p-4 flex sm:flex-col items-center justify-center text-center bg-butter/40">
              <span className="font-mono text-xs font-bold uppercase text-denim">
                {stub.weekday}
              </span>
              <span className="font-display text-4xl font-extrabold text-ink mx-2 sm:mx-0">
                {stub.day}
              </span>
              <span className="font-mono text-xs font-bold uppercase text-ink-muted">
                {stub.month}
              </span>
            </div>

            <div className="sm:col-span-9 p-4 space-y-2 font-mono text-xs">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-denim shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase">
                    TANGGAL ACARA
                  </span>
                  <span className="font-bold text-ink">
                    {formatEventDate(ticket.event_starts_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-denim shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase">
                    WAKTU PINTU
                  </span>
                  <span className="font-bold text-ink">
                    {formatEventTime(ticket.event_starts_at)} —{" "}
                    {formatEventTime(ticket.event_ends_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-denim shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase">
                    LOKASI VENUE
                  </span>
                  <span className="font-bold text-ink">
                    {ticket.event_venue}, {ticket.event_city}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Holder & Price Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-ink-muted block">
                PEMEGANG TIKET
              </span>
              <span className="font-bold text-ink flex items-center gap-1.5 mt-0.5 truncate">
                <User className="w-3.5 h-3.5 text-denim shrink-0" />
                <span className="truncate">{ticket.holder_name}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-ink-muted block">
                HARGA TERCETAK
              </span>
              <span className="font-bold text-ink block mt-0.5">
                {formatRupiah(ticket.ticket_price)}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase tracking-widest text-ink-muted block">
                NO. ORDER
              </span>
              <span className="font-bold text-ink block mt-0.5">
                #{ticket.order_id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Tear Line */}
        <div className="relative flex items-center justify-between border-t-2 border-dashed border-ink/40 bg-cloud-subtle px-6 py-8 ticket-notch-horizontal">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
            {/* QR Code Box */}
            <div className="rounded-xl border-2 border-[#14121F] bg-white p-3.5 poster-shadow-sm shrink-0">
              <QRCodeSVG
                value={qrPayload}
                size={136}
                bgColor="#FFFFFF"
                fgColor="#14121F"
                level="M"
              />
            </div>

            {/* Code & Faux Barcode */}
            <div className="flex-1 text-center sm:text-left space-y-3 w-full">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
                  KODE VERIFIKASI PINTU (8-DIGIT)
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-[0.18em] text-denim">
                  {ticket.code}
                </span>
              </div>

              {/* Decorative Barcode Graphic */}
              <div
                aria-hidden="true"
                className="flex items-center justify-center sm:justify-start gap-[2px] h-10 py-1 overflow-hidden"
              >
                {barcodeBars.map((w, idx) => (
                  <span
                    key={idx}
                    style={{ width: `${w * 2}px` }}
                    className="h-full bg-ink inline-block"
                  />
                ))}
              </div>

              <p className="font-mono text-[11px] text-ink-muted">
                Tunjukkan kode QR ini kepada petugas di pintu masuk{" "}
                <strong>{ticket.event_venue}</strong>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sibling tickets if user bought > 1 ticket in the same order */}
      {ticket.sibling_codes.length > 1 && (
        <div className="mt-6 rounded-xl border-2 border-ink bg-card p-4 font-mono text-xs">
          <span className="font-bold uppercase tracking-wider text-ink block mb-2">
            Tiket Lain dalam Pesanan Ini ({ticket.sibling_codes.length} Tiket):
          </span>
          <div className="flex flex-wrap gap-2">
            {ticket.sibling_codes.map((c) => (
              <Link
                key={c}
                href={`/my-tickets/${c}`}
                className={`px-3 py-1.5 rounded-md border-2 border-ink font-bold ${
                  c === ticket.code
                    ? "bg-denim text-white"
                    : "bg-background text-ink hover:bg-cloud-subtle"
                }`}
              >
                #{c}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button asChild variant="outline">
          <Link href="/my-tickets">
            <ArrowLeft className="w-4 h-4" />
            Semua Tiketku
          </Link>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" />
            Simpan sebagai Gambar / PDF
          </Button>
          <Button asChild>
            <Link href={`/events/${ticket.event_slug}`}>Halaman Acara</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
