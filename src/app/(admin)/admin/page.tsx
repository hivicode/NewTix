import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Coins,
  Ticket as TicketIcon,
  TrendingUp,
  Plus,
} from "lucide-react";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import { GlossLink, StatusBadge } from "@/components/atoms";
import {
  RetroPanel,
  RetroPanelBody,
  RetroPanelHeader,
  RetroStatCard,
} from "@/components/molecules/retro-panel";
import {
  AdminLiveOrdersFeed,
  type LiveOrderFeedItem,
} from "@/components/features/admin-live-orders";
import { formatRupiah } from "@/lib/utils";
import type { EventItem } from "@/types/database";

export const metadata: Metadata = {
  title: "Ruang Admin NewTix",
  description:
    "Statistik penjualan tiket, pendapatan, dan pantauan transaksi real-time NewTix.",
};

export default async function AdminDashboardPage() {
  let events: EventItem[] = FALLBACK_EVENTS;
  let recentOrders: LiveOrderFeedItem[] = [];
  let totalOrdersRevenue = 0;
  let totalTicketsSold = 0;

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const [{ data: dbEvents }, { data: dbOrders }, { count: ticketsCount }] =
      await Promise.all([
        supabase
          .from("events")
          .select("*, categories(*), ticket_types(*)")
          .order("starts_at", { ascending: true }),
        supabase
          .from("orders")
          .select(
            "id, total_amount, status, created_at, events(title), profiles(full_name)"
          )
          .eq("status", "paid")
          .order("created_at", { ascending: false })
          .limit(20),
        supabase.from("tickets").select("*", { count: "exact", head: true }),
      ]);

    if (dbEvents && dbEvents.length > 0) {
      events = dbEvents as EventItem[];
    }

    if (dbOrders) {
      recentOrders = dbOrders.map((o) => {
        const ev = Array.isArray(o.events) ? o.events[0] : o.events;
        const prof = Array.isArray(o.profiles) ? o.profiles[0] : o.profiles;
        return {
          id: o.id,
          total_amount: o.total_amount,
          status: o.status,
          created_at: o.created_at,
          event_title: ev?.title || "Acara NewTix",
          buyer_name: prof?.full_name || "Member",
        };
      });
    }

    let computedSold = 0;
    let computedRevenue = 0;
    for (const ev of events) {
      for (const tt of ev.ticket_types || []) {
        const sold = Math.max(0, tt.quota - tt.remaining);
        computedSold += sold;
        computedRevenue += sold * tt.price;
      }
    }

    totalTicketsSold = Math.max(ticketsCount || 0, computedSold);
    const sumOrders = recentOrders.reduce((acc, o) => acc + o.total_amount, 0);
    totalOrdersRevenue = Math.max(sumOrders, computedRevenue);
  } else {
    for (const ev of events) {
      for (const tt of ev.ticket_types || []) {
        const sold = Math.max(0, tt.quota - tt.remaining);
        totalTicketsSold += sold;
        totalOrdersRevenue += sold * tt.price;
      }
    }
  }

  const chartRows = events.slice(0, 6).map((ev) => {
    const tList = ev.ticket_types || [];
    const quota = tList.reduce((acc, t) => acc + t.quota, 0);
    const remaining = tList.reduce((acc, t) => acc + t.remaining, 0);
    const sold = Math.max(0, quota - remaining);
    const pct = quota > 0 ? Math.round((sold / quota) * 100) : 0;
    return {
      id: ev.id,
      title: ev.title,
      city: ev.city,
      sold,
      quota,
      pct,
    };
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#d9d9d9] pb-5">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#2867a6] block">
            PUSAT KENDALI // NEWTIX
          </span>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-black mt-1">
            Ringkasan Tiket &amp;{" "}
            <span className="text-[#2867a6]">Pantauan Live</span>
          </h1>
        </div>

        <GlossLink href="/admin/events/new" $variant="orange" $size="md">
          <Plus className="w-4 h-4" />
          Buat Acara Baru
        </GlossLink>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <RetroStatCard>
          <div className="flex items-center justify-between text-[#5a5a5a] mb-2.5">
            <span className="text-[11px] font-bold tracking-wide">
              TOTAL ACARA
            </span>
            <Calendar className="w-4 h-4 text-[#2867a6]" />
          </div>
          <span className="text-3xl sm:text-4xl font-bold text-black block">
            {events.length}
          </span>
          <span className="text-xs text-[#5a5a5a] mt-1.5 block">
            {events.filter((e) => e.status === "published").length} acara sedang
            tayang
          </span>
        </RetroStatCard>

        <RetroStatCard>
          <div className="flex items-center justify-between text-[#5a5a5a] mb-2.5">
            <span className="text-[11px] font-bold tracking-wide">
              TIKET TERJUAL
            </span>
            <TicketIcon className="w-4 h-4 text-[#2867a6]" />
          </div>
          <span className="text-3xl sm:text-4xl font-bold text-[#2867a6] block">
            {totalTicketsSold.toLocaleString("id-ID")}
          </span>
          <span className="text-xs text-[#5a5a5a] mt-1.5 block">
            Akumulasi seluruh gelombang tiket
          </span>
        </RetroStatCard>

        <RetroStatCard>
          <div className="flex items-center justify-between text-[#5a5a5a] mb-2.5">
            <span className="text-[11px] font-bold tracking-wide">
              TOTAL PENDAPATAN
            </span>
            <Coins className="w-4 h-4 text-[#2867a6]" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-black block">
            {formatRupiah(totalOrdersRevenue)}
          </span>
          <div className="mt-2">
            <StatusBadge $tone="valid">100% TRANSAKSI LUNAS</StatusBadge>
          </div>
        </RetroStatCard>
      </div>

      {/* Chart + Live Orders Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Simple Occupancy Bar Chart */}
        <RetroPanel className="xl:col-span-6">
          <RetroPanelHeader>
            <span className="inline-flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2867a6]" />
              TINGKAT KETERISIAN KUOTA ACARA
            </span>
            <span className="text-[11px] font-semibold text-[#5a5a5a]">
              Top {chartRows.length} Acara
            </span>
          </RetroPanelHeader>
          <RetroPanelBody>
            <div className="space-y-4">
              {chartRows.map((row) => (
                <div key={row.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-black truncate">
                      {row.title}{" "}
                      <span className="text-[#5a5a5a] font-normal">
                        ({row.city})
                      </span>
                    </span>
                    <span className="font-bold text-[#2867a6] shrink-0">
                      {row.sold}/{row.quota} ({row.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3.5 border border-[#c1c1c1] bg-[#f4f4f4] shadow-[inset_0_0_4px_rgba(0,0,0,0.12)] overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, row.pct)}%` }}
                      className={`h-full transition-all ${
                        row.pct >= 85
                          ? "bg-gradient-to-r from-[#ffb84d] to-[#ff8a09]"
                          : "bg-gradient-to-r from-[#5899d6] to-[#2867a6]"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </RetroPanelBody>
        </RetroPanel>

        {/* Right 6 cols: Live Orders Feed (Supabase Realtime INSERT) */}
        <div className="xl:col-span-6">
          <AdminLiveOrdersFeed initialOrders={recentOrders} />
        </div>
      </div>
    </div>
  );
}
