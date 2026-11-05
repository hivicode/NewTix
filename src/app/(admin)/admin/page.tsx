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
import { Button } from "@/components/ui/button";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink pb-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
            PUSAT KENDALI // NEWTIX
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Ringkasan Tiket &{" "}
            <span className="font-serif italic font-semibold text-denim">
              Pantauan Live.
            </span>
          </h1>
        </div>

        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4" />
            Buat Acara Baru
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-xl border-2 border-ink bg-card p-5 poster-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              TOTAL ACARA
            </span>
            <Calendar className="w-4 h-4 text-denim" />
          </div>
          <span className="font-mono text-4xl font-extrabold text-ink block">
            {events.length}
          </span>
          <span className="font-mono text-xs text-ink-muted mt-1 block">
            {events.filter((e) => e.status === "published").length} acara sedang
            tayang
          </span>
        </div>

        <div className="rounded-xl border-2 border-ink bg-card p-5 poster-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              TIKET TERJUAL
            </span>
            <TicketIcon className="w-4 h-4 text-denim" />
          </div>
          <span className="font-mono text-4xl font-extrabold text-denim block">
            {totalTicketsSold.toLocaleString("id-ID")}
          </span>
          <span className="font-mono text-xs text-ink-muted mt-1 block">
            Akumulasi seluruh gelombang tiket
          </span>
        </div>

        <div className="rounded-xl border-2 border-ink bg-card p-5 poster-shadow">
          <div className="flex items-center justify-between text-ink-muted mb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              TOTAL PENDAPATAN
            </span>
            <Coins className="w-4 h-4 text-denim" />
          </div>
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-ink block">
            {formatRupiah(totalOrdersRevenue)}
          </span>
          <span className="inline-block rounded-full bg-mint text-[#14121F] border border-ink px-2 py-0.5 font-mono text-[10px] mt-1 font-bold">
            100% Transaksi Lunas
          </span>
        </div>
      </div>

      {/* Chart + Live Orders Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
        {/* Left 6 cols: Simple Occupancy Bar Chart */}
        <div className="xl:col-span-6 rounded-xl border-2 border-ink bg-card p-5 sm:p-6 poster-shadow">
          <div className="flex items-center justify-between border-b-2 border-dashed border-ink/25 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-denim" />
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-tight">
                  Tingkat Keterisian Kuota Acara
                </h2>
                <p className="font-mono text-[11px] text-ink-muted">
                  Perbandingan tiket terjual terhadap kapasitas kuota
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {chartRows.map((row) => (
              <div key={row.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-ink truncate">
                    {row.title}{" "}
                    <span className="font-mono text-ink-muted font-normal">
                      ({row.city})
                    </span>
                  </span>
                  <span className="font-mono font-bold text-ink shrink-0">
                    {row.sold}/{row.quota} ({row.pct}%)
                  </span>
                </div>
                <div className="w-full h-4 rounded-full border-2 border-ink bg-cloud-subtle overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, row.pct)}%` }}
                    className={`h-full transition-all ${
                      row.pct >= 85 ? "bg-bubblegum" : "bg-denim"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Live Orders Feed (Supabase Realtime INSERT) */}
        <div className="xl:col-span-6">
          <AdminLiveOrdersFeed initialOrders={recentOrders} />
        </div>
      </div>
    </div>
  );
}
