"use client";

import * as React from "react";
import { useActionState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Minus,
  Plus,
  Ticket as TicketIcon,
  AlertCircle,
  Loader2,
  Radio,
  ShieldCheck,
} from "lucide-react";
import {
  purchaseTicketsAction,
  type PurchaseActionState,
} from "@/actions/tickets";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, cn } from "@/lib/utils";
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
  const prefersReducedMotion = useReducedMotion();
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

  // Subscribe ke Supabase Realtime (postgres_changes pada ticket_types)
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
    <div className="border-2 border-ink bg-card p-5 sm:p-6 poster-shadow relative">
      {/* Header Loket */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-ink/25 pb-4 mb-5">
        <div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-vermilion block">
            LOKET KARCIS RESMI
          </span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Pilih Kategori Tiket
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 border border-ink px-2.5 py-1 bg-background font-mono text-[10px] uppercase tracking-wider">
          <Radio
            className={cn(
              "w-3 h-3",
              realtimeConnected
                ? "text-pine animate-pulse"
                : "text-vermilion"
            )}
          />
          <span>{realtimeConnected ? "KUOTA LIVE" : "SIAP CETAK"}</span>
        </div>
      </div>

      {state.error && (
        <div
          role="alert"
          className="mb-4 border-2 border-destructive bg-destructive/10 p-3 text-xs font-mono text-destructive flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Daftar Ticket Types */}
      <div className="space-y-3 mb-6">
        {ticketTypes.map((ticket) => {
          const isSoldOut = ticket.remaining === 0;
          const ratio = ticket.quota > 0 ? ticket.remaining / ticket.quota : 0;
          const isLowQuota = !isSoldOut && ratio < 0.15;
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
              className={cn(
                "w-full text-left border-2 p-4 transition-all relative cursor-pointer",
                isSoldOut
                  ? "border-ink/30 bg-paper-subtle/60 opacity-60 cursor-not-allowed"
                  : isSelected
                  ? "border-ink bg-paper-subtle poster-shadow-sm"
                  : "border-ink/60 bg-background hover:border-ink"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base font-extrabold text-ink">
                      {ticket.name}
                    </span>
                    {isSoldOut && (
                      <Badge variant="ink" className="text-[10px]">
                        SOLD OUT
                      </Badge>
                    )}
                    {isLowQuota && (
                      <Badge variant="default" sticker className="text-[10px]">
                        HAMPIR HABIS
                      </Badge>
                    )}
                    {!isSoldOut && ticket.price === 0 && (
                      <Badge variant="pine" className="text-[10px]">
                        GRATIS
                      </Badge>
                    )}
                  </div>

                  {/* Animated Remaining Counter */}
                  <div className="mt-1.5 flex items-center gap-2 font-mono text-xs text-ink-muted">
                    <span>Sisa kuota:</span>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={ticket.remaining}
                        initial={
                          prefersReducedMotion
                            ? false
                            : { y: -10, opacity: 0 }
                        }
                        animate={{ y: 0, opacity: 1 }}
                        exit={
                          prefersReducedMotion
                            ? undefined
                            : { y: 10, opacity: 0 }
                        }
                        transition={{ duration: 0.18 }}
                        className={cn(
                          "inline-block font-bold px-1.5 py-0.2 border border-ink/30 bg-card",
                          isLowQuota ? "text-vermilion" : "text-ink"
                        )}
                      >
                        {ticket.remaining} / {ticket.quota}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-base font-extrabold text-ink block">
                    {formatRupiah(ticket.price)}
                  </span>
                  <span className="font-mono text-[10px] text-ink-muted uppercase">
                    / karcis
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stepper Jumlah & Ringkasan Harga Live */}
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="ticketTypeId" value={selectedId} />
        <input type="hidden" name="qty" value={qty} />
        <input type="hidden" name="eventSlug" value={eventSlug} />

        <div className="flex items-center justify-between border-y-2 border-dashed border-ink/25 py-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink block">
              Jumlah Karcis
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              Maks. 5 karcis per pesanan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={!selectedTicket || qty <= 1 || isPending}
              aria-label="Kurangi jumlah tiket"
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div className="w-12 h-11 border-2 border-ink bg-background flex items-center justify-center font-mono text-base font-extrabold">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={qty}
                  initial={
                    prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  exit={
                    prefersReducedMotion
                      ? undefined
                      : { scale: 0.8, opacity: 0 }
                  }
                  transition={{ duration: 0.12 }}
                >
                  {selectedTicket && selectedTicket.remaining > 0 ? qty : 0}
                </motion.span>
              </AnimatePresence>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQty((q) => Math.min(maxAllowed, q + 1))}
              disabled={!selectedTicket || qty >= maxAllowed || isPending}
              aria-label="Tambah jumlah tiket"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Live Total Price Summary */}
        <div className="bg-paper-subtle border-2 border-ink p-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted block">
              TOTAL PEMBAYARAN (SIMULASI)
            </span>
            <span className="font-mono text-xs text-ink-muted">
              {selectedTicket
                ? `${qty}x ${selectedTicket.name}`
                : "Pilih jenis tiket"}
            </span>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={totalAmount}
              initial={prefersReducedMotion ? false : { y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-mono text-xl sm:text-2xl font-extrabold text-vermilion"
            >
              {formatRupiah(totalAmount)}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-base"
          disabled={
            allSoldOut ||
            !selectedTicket ||
            selectedTicket.remaining === 0 ||
            isPending
          }
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Mencetak Karcis...
            </>
          ) : allSoldOut ||
            (selectedTicket && selectedTicket.remaining === 0) ? (
            "Habis Terjual (Sold Out)"
          ) : isLoggedIn ? (
            <>
              <TicketIcon className="w-5 h-5" />
              Beli Tiket Sekarang
            </>
          ) : (
            <>
              <TicketIcon className="w-5 h-5" />
              Beli Tiket (Masuk Dulu)
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-ink-muted text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-pine shrink-0" />
          <span>
            Anti-overselling: kuota dikunci atomik saat tombol ditekan.
          </span>
        </p>
      </form>
    </div>
  );
}

