"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Printer,
  Sparkles,
  Ticket as TicketIcon,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          i % 3 === 0
            ? "#FF4F1F"
            : i % 3 === 1
            ? "#F2B705"
            : "#1F6F54",
      })),
    []
  );

  const qrPayload = JSON.stringify({
    karcis_code: ticket.code,
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
              className="absolute w-3 h-3 border border-ink"
            />
          ))}
        </div>
      )}

      {/* Success Banner */}
      {justPurchased && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 border-2 border-ink bg-pine text-[#FAF7F2] p-4 poster-shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-mustard" />
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-mustard">
                MESIN CETAK SELESAI // PEMBAYARAN LUNAS
              </p>
              <p className="text-sm font-bold">
                Karcismu resmi tercetak! Simpan halaman ini atau tunjukkan QR di
                pintu masuk.
              </p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-mustard shrink-0 hidden sm:block" />
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
        className="border-2 border-ink bg-card poster-shadow overflow-hidden print:shadow-none"
      >
        {/* Top Ink Header Band */}
        <div className="bg-ink text-paper px-6 py-4 flex items-center justify-between border-b-2 border-ink">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-vermilion text-white border border-paper">
              <TicketIcon className="w-4 h-4 -rotate-12" />
            </span>
            <div>
              <span className="font-display text-lg font-extrabold tracking-tight block leading-none">
                KARCIS NUSANTARA
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-paper/70">
                CETAKAN ASLI // SATU KALI PINDAI
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] uppercase tracking-widest text-mustard block">
              SERI KARCIS
            </span>
            <span className="text-lg font-extrabold tracking-wider text-paper">
              #{ticket.code}
            </span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <Badge variant="mustard">{ticket.ticket_type_name}</Badge>
            {ticket.checked_in_at ? (
              <Badge variant="ink" sticker>
                SUDAH DIPINDAI MASUK
              </Badge>
            ) : (
              <Badge variant="pine" sticker>
                BERLAKU // SIAP MASUK
              </Badge>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-ink mb-6">
            {ticket.event_title}
          </h1>

          {/* Stub Date + Venue Box */}
          <div className="grid grid-cols-1 sm:grid-cols-12 border-2 border-ink bg-paper-subtle mb-6">
            <div className="sm:col-span-3 border-b-2 sm:border-b-0 sm:border-r-2 border-dashed border-ink/35 p-4 flex sm:flex-col items-center justify-center text-center">
              <span className="font-mono text-xs font-bold uppercase text-vermilion">
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
                <Calendar className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase">
                    JADWAL PERTUNJUKAN
                  </span>
                  <span className="font-bold text-ink">
                    {formatEventDate(ticket.event_starts_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                <div>
                  <span className="text-ink-muted block text-[10px] uppercase">
                    WAKTU BUKA PINTU
                  </span>
                  <span className="font-bold text-ink">
                    {formatEventTime(ticket.event_starts_at)} —{" "}
                    {formatEventTime(ticket.event_ends_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
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
                PEMEGANG KARCIS
              </span>
              <span className="font-bold text-ink flex items-center gap-1.5 mt-0.5 truncate">
                <User className="w-3.5 h-3.5 text-vermilion shrink-0" />
                <span className="truncate">{ticket.holder_name}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-ink-muted block">
                NILAI TERCETAK
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
        <div className="relative flex items-center justify-between border-t-2 border-dashed border-ink/40 bg-paper-subtle px-6 py-8 ticket-notch-horizontal">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
            {/* QR Code Box */}
            <div className="border-2 border-ink bg-white p-3.5 poster-shadow-sm shrink-0">
              <QRCodeSVG
                value={qrPayload}
                size={136}
                bgColor="#FFFFFF"
                fgColor="#141210"
                level="M"
              />
            </div>

            {/* Code & Faux Barcode */}
            <div className="flex-1 text-center sm:text-left space-y-3 w-full">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
                  KODE VERIFIKASI PINTU (8-DIGIT)
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-[0.18em] text-ink">
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
        <div className="mt-6 border-2 border-ink bg-card p-4 font-mono text-xs">
          <span className="font-bold uppercase tracking-wider text-ink block mb-2">
            Karcis Lain dalam Pesanan Ini ({ticket.sibling_codes.length} Karcis):
          </span>
          <div className="flex flex-wrap gap-2">
            {ticket.sibling_codes.map((c) => (
              <Link
                key={c}
                href={`/my-tickets/${c}`}
                className={`px-3 py-1.5 border-2 border-ink font-bold ${
                  c === ticket.code
                    ? "bg-vermilion text-white"
                    : "bg-background text-ink hover:bg-paper-subtle"
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
            Semua Karcis Saya
          </Link>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </Button>
          <Button asChild>
            <Link href={`/events/${ticket.event_slug}`}>Halaman Acara</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

