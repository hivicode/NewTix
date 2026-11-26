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
import { StatusBadge } from "@/components/atoms";
import {
  RetroPanel,
  RetroPanelBody,
  RetroPanelHeader,
} from "@/components/molecules/retro-panel";

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
    <RetroPanel>
      <RetroPanelHeader>
        <span className="inline-flex items-center gap-2">
          <ReceiptText className="w-4 h-4 text-[#2867a6]" />
          PEMBELIAN TERBARU (LIVE)
        </span>
        <StatusBadge $tone={connected ? "valid" : "info"}>
          <Radio
            className={cn(
              "w-3 h-3",
              connected ? "animate-pulse" : ""
            )}
          />
          {connected ? "REALTIME AKTIF" : "STANDBY"}
        </StatusBadge>
      </RetroPanelHeader>

      <RetroPanelBody>
        {orders.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#5a5a5a]">
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
                  className="border border-[#d8eaf6] bg-[#f8fbfe] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#e7f1fb] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5a5a5a]">
                      <span className="font-bold text-black">
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
                    <p className="text-sm font-bold text-black mt-0.5">
                      {ord.event_title || "Pembelian Tiket"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <StatusBadge $tone="valid">
                      {ord.status.toUpperCase()}
                    </StatusBadge>
                    <span className="text-sm font-bold text-[#2867a6]">
                      {formatRupiah(ord.total_amount)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </RetroPanelBody>
    </RetroPanel>
  );
}
