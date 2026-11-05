import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, QrCode, UserCheck } from "lucide-react";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import { Badge } from "@/components/ui/badge";
import { formatEventDate, formatEventTime, formatRupiah } from "@/lib/utils";
import type { EventItem } from "@/types/database";

export const metadata: Metadata = {
  title: "Daftar Pembeli & Pemegang Tiket",
};

interface BuyerRow {
  order_id: string;
  buyer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  ticket_codes: string[];
}

export default async function AdminEventOrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let event: EventItem | null =
    FALLBACK_EVENTS.find((e) => e.id === id) || null;
  let buyers: BuyerRow[] = [];

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const [{ data: evData }, { data: ordData }] = await Promise.all([
      supabase.from("events").select("*").eq("id", id).single(),
      supabase
        .from("orders")
        .select(
          `
          id,
          total_amount,
          status,
          created_at,
          profiles (
            full_name
          ),
          tickets (
            code
          )
        `
        )
        .eq("event_id", id)
        .order("created_at", { ascending: false }),
    ]);

    if (evData) {
      event = evData as EventItem;
    }

    if (ordData) {
      buyers = ordData.map((o) => {
        const prof = Array.isArray(o.profiles) ? o.profiles[0] : o.profiles;
        const tList = Array.isArray(o.tickets) ? o.tickets : [];
        return {
          order_id: o.id,
          buyer_name: prof?.full_name || "Member NewTix",
          total_amount: o.total_amount,
          status: o.status,
          created_at: o.created_at,
          ticket_codes: tList.map((t: { code: string }) => t.code),
        };
      });
    }
  }

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:text-denim min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Acara
        </Link>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block mt-1">
          DAFTAR TAMU // PEMBELI TIKET
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          {event.title}
        </h1>
      </div>

      <div className="rounded-xl border-2 border-ink bg-card poster-shadow overflow-x-auto">
        {buyers.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs text-ink-muted">
            <UserCheck className="w-8 h-8 text-denim mx-auto mb-2" />
            Belum ada pesanan untuk acara ini di database.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-ink bg-cloud-subtle font-mono text-xs uppercase tracking-wider">
                <th className="p-4">No. Order</th>
                <th className="p-4">Nama Pembeli</th>
                <th className="p-4">Waktu Transaksi</th>
                <th className="p-4">Kode Tiket</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-ink/20 text-sm">
              {buyers.map((b) => (
                <tr key={b.order_id}>
                  <td className="p-4 font-mono text-xs font-bold">
                    #{b.order_id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="p-4 font-bold">{b.buyer_name}</td>
                  <td className="p-4 font-mono text-xs text-ink-muted">
                    {formatEventDate(b.created_at)} •{" "}
                    {formatEventTime(b.created_at)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {b.ticket_codes.map((code) => (
                        <Link
                          key={code}
                          href={`/my-tickets/${code}`}
                          className="inline-flex items-center gap-1 rounded border border-ink bg-background px-2 py-0.5 font-mono text-xs font-bold hover:bg-butter"
                        >
                          <QrCode className="w-3 h-3 text-denim" />#{code}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs font-extrabold text-denim">
                    {formatRupiah(b.total_amount)}
                  </td>
                  <td className="p-4">
                    <Badge variant="mint">{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
