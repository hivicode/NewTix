"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import {
  purchaseTicketsAction,
  type PurchaseActionState,
} from "@/actions/tickets";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/utils";
import type { TicketType } from "@/types/database";

interface TicketPurchaseWidgetProps {
  eventId: string;
  eventSlug: string;
  initialTicketTypes: TicketType[];
  isLoggedIn: boolean;
}

const initialState: PurchaseActionState = {};

export function TicketPurchaseWidget({
  eventId,
  eventSlug,
  initialTicketTypes,
  isLoggedIn,
}: TicketPurchaseWidgetProps) {
  const [ticketTypes, setTicketTypes] =
    React.useState<TicketType[]>(initialTicketTypes);
  const [selectedId, setSelectedId] = React.useState<string>(() => {
    const firstAvailable = initialTicketTypes.find((t) => t.remaining > 0);
    return firstAvailable?.id || initialTicketTypes[0]?.id || "";
  });
  const [qty, setQty] = React.useState<number>(1);
  const [realtimeConnected, setRealtimeConnected] = React.useState(false);

  const [state, formAction, isPending] = useActionState(
    purchaseTicketsAction,
    initialState
  );

  React.useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`realtime-tickets-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ticket_types",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE" && payload.new) {
            const updated = payload.new as TicketType;
            setTicketTypes((prev) =>
              prev.map((item) => (item.id === updated.id ? updated : item))
            );
          } else if (payload.eventType === "INSERT" && payload.new) {
            const inserted = payload.new as TicketType;
            setTicketTypes((prev) => [...prev, inserted]);
          } else if (payload.eventType === "DELETE" && payload.old) {
            const removedId = (payload.old as { id: string }).id;
            setTicketTypes((prev) =>
              prev.filter((item) => item.id !== removedId)
            );
          }
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const selectedTicket = ticketTypes.find((t) => t.id === selectedId);
  const maxAllowed = selectedTicket
    ? Math.min(5, Math.max(0, selectedTicket.remaining))
    : 0;

  React.useEffect(() => {
    if (maxAllowed > 0 && qty > maxAllowed) {
      setQty(maxAllowed);
    } else if (maxAllowed > 0 && qty < 1) {
      setQty(1);
    }
  }, [maxAllowed, qty]);

  const allSoldOut =
    ticketTypes.length > 0 && ticketTypes.every((t) => t.remaining === 0);
  const totalAmount = selectedTicket ? selectedTicket.price * qty : 0;

  return (
    <div className="booking-box p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#d8eaf6] pb-3 mb-4">
        <div className="flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/newtix/home/1_Ticket/BookTicketNow.png"
            alt="book ticket now!"
            style={{ width: 155, height: "auto" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/newtix/home/1_Ticket/Arrow.png"
            alt=""
            style={{ width: 32, height: "auto" }}
          />
        </div>
        <span className="border border-[#54ac32] bg-[#edf9e8] px-2 py-0.5 text-[10px] font-bold text-[#2f7d18]">
          {realtimeConnected ? "LIVE QUOTA" : "READY"}
        </span>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mb-3 border border-[#e0584f] bg-[#fff2f2] p-2.5 text-[12px] font-semibold text-[#c0392b]"
        >
          {state.error}
        </div>
      )}

      {/* Ticket Tiers */}
      <div className="space-y-2 mb-4">
        {ticketTypes.map((ticket) => {
          const isSoldOut = ticket.remaining === 0;
          const isSelected = selectedId === ticket.id;
          return (
            <button
              key={ticket.id}
              type="button"
              disabled={isSoldOut}
              onClick={() => {
                setSelectedId(ticket.id);
                setQty(1);
              }}
              className={`w-full text-left border p-3 transition-colors ${
                isSoldOut
                  ? "border-[#d6d6d6] bg-[#f4f4f4] opacity-60 cursor-not-allowed"
                  : isSelected
                    ? "border-[#2867a6] bg-white shadow-[inset_0_0_0_1px_#2867a6] cursor-pointer"
                    : "border-[#c1c1c1] bg-white/80 hover:bg-white cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-bold text-black">
                  {ticket.name}
                </span>
                <span className="text-[13px] font-bold text-[#2867a6]">
                  {ticket.price === 0 ? "Free" : formatRupiah(ticket.price)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-[#5a5a5a]">
                <span>
                  {isSoldOut
                    ? "Sold Out"
                    : `${ticket.remaining} of ${ticket.quota} left`}
                </span>
                {isSelected && !isSoldOut && (
                  <span className="font-bold text-[#2f7d18]">Selected</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quantity + Submit */}
      <form action={formAction}>
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="eventSlug" value={eventSlug} />
        <input type="hidden" name="ticketTypeId" value={selectedId} />
        <input type="hidden" name="qty" value={qty} />

        {!allSoldOut && selectedTicket && selectedTicket.remaining > 0 && (
          <div className="mb-4 flex items-center justify-between border-y border-[#d8eaf6] py-3 text-[12px]">
            <span className="font-bold text-black">Quantity (max 5)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="gloss-silver h-7 w-7 text-[14px] font-bold cursor-pointer disabled:opacity-40"
              >
                -
              </button>
              <span className="w-6 text-center text-[14px] font-bold">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(maxAllowed, q + 1))}
                disabled={qty >= maxAllowed}
                className="gloss-silver h-7 w-7 text-[14px] font-bold cursor-pointer disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between text-[14px]">
          <span className="font-semibold text-[#5a5a5a]">Total</span>
          <span className="text-[18px] font-bold text-black">
            {totalAmount === 0 && !allSoldOut
              ? "Free"
              : formatRupiah(totalAmount)}
          </span>
        </div>

        <button
          type="submit"
          disabled={allSoldOut || isPending || !selectedTicket || maxAllowed === 0}
          className="gloss-orange w-full py-2.5 text-[16px] font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : allSoldOut ? (
            "Sold Out"
          ) : isLoggedIn ? (
            "Buy Ticket »"
          ) : (
            "Sign In to Buy »"
          )}
        </button>

        <p className="mt-2 text-center text-[11px] text-[#5a5a5a]">
          Instant QR pass generated after checkout.
        </p>

        <div className="mt-3 flex items-center justify-center gap-2 border-t border-[#d8eaf6] pt-2.5">
          {[1, 2, 3, 4].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={n}
              src={`/newtix/home/1_Ticket/PaymentIcon_${n}.png`}
              alt=""
              style={{ height: 28, width: "auto" }}
            />
          ))}
        </div>
      </form>
    </div>
  );
}
