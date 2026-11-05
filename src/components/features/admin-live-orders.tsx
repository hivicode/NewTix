"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Radio, ReceiptText } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  formatEventDate,
  formatEventTime,
  formatRupiah,
  cn,
} from "@/lib/utils";

export interface LiveOrderFeedItem {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  event_title?: string;
  buyer_name?: string;
}

export function AdminLiveOrdersFeed({
  initialOrders,
}: {
  initialOrders: LiveOrderFeedItem[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const [orders, setOrders] = React.useState<LiveOrderFeedItem[]>(initialOrders);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const channel = supabase
      .channel("admin-orders-live-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          const newOrder = payload.new as {
            id: string;
            user_id: string;
            event_id: string;
            total_amount: number;
            status: string;
            created_at: string;
          };

          const [{ data: ev }, { data: prof }] = await Promise.all([
            supabase
              .from("events")
              .select("title")
              .eq("id", newOrder.event_id)
              .single(),
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", newOrder.user_id)
              .single(),
          ]);

          const enriched: LiveOrderFeedItem = {
            id: newOrder.id,
            total_amount: newOrder.total_amount,
            status: newOrder.status,
            created_at: newOrder.created_at,
            event_title: ev?.title || "Acara NewTix",
            buyer_name: prof?.full_name || "Member Baru",
          };

          setOrders((prev) => [enriched, ...prev.slice(0, 14)]);
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="rounded-xl border-2 border-ink bg-card p-5 sm:p-6 poster-shadow">
      <div className="flex items-center justify-between border-b-2 border-dashed border-ink/25 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <ReceiptText className="w-5 h-5 text-denim" />
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">
              Pembelian Terbaru (Live)
            </h2>
            <p className="font-mono text-[11px] text-ink-muted">
              Menerima sinyal INSERT langsung dari tabel orders
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-2.5 py-1 bg-butter text-[#14121F] font-mono text-[10px] font-bold uppercase tracking-wider">
          <Radio
            className={cn(
              "w-3 h-3",
              connected ? "text-denim animate-pulse" : "text-[#14121F]"
            )}
          />
          {connected ? "REALTIME AKTIF" : "STANDBY"}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="py-10 text-center font-mono text-xs text-ink-muted">
          Belum ada transaksi masuk. Begitu ada pembeli, baris baru akan muncul
          otomatis di sini tanpa reload.
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {orders.map((ord) => (
              <motion.div
                key={ord.id}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: -14, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="rounded-lg border-2 border-ink bg-background p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
                    <span className="font-bold text-ink">
                      #{ord.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span>•</span>
                    <span>{ord.buyer_name || "Member"}</span>
                    <span>•</span>
                    <span>
                      {formatEventDate(ord.created_at)}{" "}
                      {formatEventTime(ord.created_at)}
                    </span>
                  </div>
                  <p className="font-display text-sm font-extrabold text-ink mt-0.5">
                    {ord.event_title || "Pembelian Tiket"}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="rounded-full bg-mint text-[#14121F] font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-ink">
                    {ord.status}
                  </span>
                  <span className="font-mono text-sm font-extrabold text-denim">
                    {formatRupiah(ord.total_amount)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
