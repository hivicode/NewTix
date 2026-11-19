"use client";

import * as React from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Ban,
  Backpack,
  Clock,
  FileText,
  IdCard,
  Printer,
  Ticket,
} from "lucide-react";
import { formatEventDate, formatEventTime } from "@/lib/utils";

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

const abbr = (s: string) =>
  (s.replace(/[^A-Za-z]/g, "").slice(0, 3) || "NTX").toUpperCase();

const reminders = [
  [Clock, "DOORS", "Doors open at the time printed on this pass."],
  [Ticket, "PASS", "Please print out this pass or show it on your phone."],
  [IdCard, "ID", "Bring the ID that matches the name on the ticket."],
  [Backpack, "BAG", "Keep your bag small. Security check at the gate."],
  [Ban, "REFUND", "Every ticket is final. Sorry, no cancellations."],
  [FileText, "NOTES", "We've been waiting for you. See you there!"],
] as const;

export function DigitalTicketCard({
  ticket,
  justPurchased = false,
}: {
  ticket: DigitalTicketData;
  justPurchased?: boolean;
}) {
  const qrPayload = JSON.stringify({
    newtix_code: ticket.code,
    event: ticket.event_slug,
    holder: ticket.holder_name,
  });
  const date = new Date(ticket.event_starts_at);
  const ymd = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-[820px] px-4 py-10 text-[#1b1b1b]">
      {justPurchased && (
        <div className="mb-5 border border-[#54ac32] bg-[#edf9e8] px-4 py-3 text-[13px] font-semibold text-[#2f7d18] print:hidden">
          Your ticket is ready! Save this page or show the QR code at the gate.
        </div>
      )}

      {/* PASS */}
      <div className="bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,.18)] print:shadow-none sm:p-8">
        {/* top */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="leading-none">
              <span
                className="block text-[30px] font-extrabold tracking-tight text-[#5b4fc4]"
                style={{ fontStyle: "italic" }}
              >
                New<span className="text-[#2a7ac0]">Tix</span>
                <span className="align-top text-[14px] not-italic text-[#f5b301]"> ★</span>
              </span>
              <span className="mt-1 block text-[9px] font-bold tracking-[2.4px] text-[#5f6b76]">
                ONLINE TICKETING
              </span>
            </div>
            <h1 className="mt-6 text-[26px] font-bold text-[#2a4fa0]">E-Ticket pass</h1>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[#5f6b76]">www.newtix.id</p>
            <div className="mt-1 inline-block bg-white p-1">
              <QRCodeSVG value={qrPayload} size={92} bgColor="#FFFFFF" fgColor="#000000" level="M" />
            </div>
          </div>
        </div>

        {/* main box */}
        <div className="mt-4 border border-[#7a7fb0]">
          <div className="px-4 py-3 text-[18px] font-bold">
            <span className="mr-3 text-[#2a4fa0]">Name</span>
            {ticket.holder_name}
          </div>
          <div className="flex items-center justify-between gap-3 bg-[#e6e6e6] px-5 py-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#2a4fa0]">VENUE</p>
              <p className="text-[40px] font-light leading-none">{abbr(ticket.event_venue)}</p>
              <p className="mt-1 truncate text-[12px] text-[#6b6b6b]">{ticket.event_venue}</p>
            </div>
            <Ticket className="h-9 w-9 shrink-0 text-[#9a9a9a]" strokeWidth={1.4} />
            <div className="min-w-0 text-right">
              <p className="text-[11px] font-bold text-[#2a4fa0]">CITY</p>
              <p className="text-[40px] font-bold leading-none">{abbr(ticket.event_city)}</p>
              <p className="mt-1 truncate text-[12px] text-[#6b6b6b]">{ticket.event_city}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4 py-3 text-[13px] sm:grid-cols-4">
            <div>
              <p className="text-[11px] font-bold text-[#2a4fa0]">Date</p>
              <p className="font-semibold">{ymd}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#2a4fa0]">Doors</p>
              <p className="font-semibold">{formatEventTime(ticket.event_starts_at)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#2a4fa0]">Ticket Type</p>
              <p className="font-semibold">{ticket.ticket_type_name}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#2a4fa0]">Booking Ref</p>
              <p className="font-semibold tracking-wider">{ticket.code}</p>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 px-4 pb-3 pt-1">
            <p className="text-[10px] font-bold tracking-wide">
              {ticket.event_title.toUpperCase()} · {formatEventDate(ticket.event_starts_at).toUpperCase()}
            </p>
            <span
              className={`shrink-0 border px-2 py-0.5 text-[10px] font-bold ${
                ticket.checked_in_at
                  ? "border-[#9a9a9a] text-[#6b6b6b]"
                  : "border-[#54ac32] text-[#2f7d18]"
              }`}
            >
              {ticket.checked_in_at ? "SCANNED" : "VALID"}
            </span>
          </div>
        </div>

        {/* reminders */}
        <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_230px]">
          <div>
            <h2 className="text-[15px] font-bold tracking-wide text-[#2a4fa0]">IMPORTANT REMINDERS</h2>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
              {reminders.map(([Icon, label, text]) => (
                <div key={label}>
                  <Icon className="h-6 w-6" strokeWidth={1.3} />
                  <p className="mt-1 text-[11px] font-bold text-[#2a4fa0]">{label}</p>
                  <p className="text-[10px] font-bold leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between bg-gradient-to-b from-[#1a7bc0] to-[#f5c400] p-4 text-center text-white">
            <p className="text-[9px]">www.newtix.id/my-tickets</p>
            <p className="my-3 text-[18px] font-extrabold leading-tight">KEEP ALL YOUR PASSES IN ONE PLACE</p>
            <p className="bg-white/90 px-2 py-1 text-[10px] font-bold italic text-[#2a4fa0]">
              Your QR tickets, always with you
            </p>
          </div>
        </div>

        {/* partners */}
        <div className="mt-6 border border-[#c9c9c9]">
          <p className="bg-[#ececec] px-3 py-1 text-[10px] font-bold tracking-wide">OUR PARTNERS</p>
          <div className="grid grid-cols-3 items-center gap-3 p-3 sm:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={n} src={`/newtix/home/6_Partners/Partners_${n}.png`} alt="" className="h-8 w-full object-contain" />
            ))}
          </div>
        </div>

        {/* footer bar */}
        <div className="-mx-6 -mb-6 mt-8 flex items-center justify-between bg-[#2674bd] px-6 py-4 text-white sm:-mx-8 sm:-mb-8 sm:px-8">
          <div>
            <p className="text-[13px] font-bold tracking-wide">THANK YOU FOR JOINING US</p>
            <p className="text-[10px]">Please retain for presentation at the gate.</p>
          </div>
          <span className="text-[20px] font-extrabold" style={{ fontStyle: "italic" }}>
            NewTix<span className="text-[#ffe37a]"> ★</span>
          </span>
        </div>
      </div>

      {ticket.sibling_codes.length > 1 && (
        <div className="mt-5 bg-white p-4 text-[12px] shadow-[0_1px_4px_rgba(0,0,0,.15)] print:hidden">
          <p className="mb-2 font-bold">
            Other tickets in this order ({ticket.sibling_codes.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {ticket.sibling_codes.map((c) => (
              <Link
                key={c}
                href={`/my-tickets/${c}`}
                className={`px-3 py-1.5 font-bold no-underline ${
                  c === ticket.code ? "gloss-orange" : "gloss-silver"
                }`}
              >
                #{c}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/my-tickets" className="gloss-silver inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold no-underline">
          <ArrowLeft className="h-4 w-4" /> All My Tickets
        </Link>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => window.print()} className="gloss-silver inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-[13px] font-semibold">
            <Printer className="h-4 w-4" /> Print / Save PDF
          </button>
          <Link href={`/events/${ticket.event_slug}`} className="gloss-orange px-4 py-2 text-[13px] font-bold no-underline">
            Event Page
          </Link>
        </div>
      </div>
    </div>
  );
}
