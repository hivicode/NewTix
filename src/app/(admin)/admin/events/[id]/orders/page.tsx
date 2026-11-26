import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, QrCode, UserCheck } from "lucide-react";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import { StatusBadge } from "@/components/atoms";
import { RetroPanel, RetroPanelHeader } from "@/components/molecules/retro-panel";
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
      <div className="border-b border-[#d9d9d9] pb-5">
        <Link
          href="/admin/events"
          className="link-blue inline-flex items-center gap-1.5 text-[13px] font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Acara
        </Link>
        <span className="text-[11px] font-bold tracking-wider text-[#2867a6] block mt-2">
          DAFTAR TAMU // PEMBELI TIKET
        </span>
        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-black">
          {event.title}
        </h1>
      </div>

      <RetroPanel>
        <RetroPanelHeader>
          <span>DAFTAR PESANAN ({buyers.length})</span>
          <span className="text-[11px] font-semibold text-[#5a5a5a]">
            Klik kode tiket untuk membuka QR Pass
          </span>
        </RetroPanelHeader>
        <div className="overflow-x-auto">
          {buyers.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#5a5a5a]">
              <UserCheck className="w-8 h-8 text-[#2867a6] mx-auto mb-2" />
              Belum ada pesanan untuk acara ini di database.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d9d9d9] bg-[#f4f4f4] text-[11px] font-bold text-[#5a5a5a] uppercase">
                  <th className="p-3.5">No. Order</th>
                  <th className="p-3.5">Nama Pembeli</th>
                  <th className="p-3.5">Waktu Transaksi</th>
                  <th className="p-3.5">Kode Tiket</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] text-sm">
                {buyers.map((b) => (
                  <tr key={b.order_id} className="hover:bg-[#e7f1fb] transition-colors">
                    <td className="p-3.5 text-xs font-bold text-black">
                      #{b.order_id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-3.5 font-bold text-black">{b.buyer_name}</td>
                    <td className="p-3.5 text-xs text-[#5a5a5a]">
                      {formatEventDate(b.created_at)} •{" "}
                      {formatEventTime(b.created_at)}
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {b.ticket_codes.map((code) => (
                          <Link
                            key={code}
                            href={`/my-tickets/${code}`}
                            className="inline-flex items-center gap-1 border border-[#7a7fb0] bg-[#edf9ff] px-2 py-0.5 text-xs font-bold text-[#2867a6] hover:bg-[#2867a6] hover:text-white no-underline transition-colors"
                          >
                            <QrCode className="w-3 h-3" />#{code}
                          </Link>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-xs font-bold text-[#2867a6]">
                      {formatRupiah(b.total_amount)}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge $tone="valid">{b.status.toUpperCase()}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </RetroPanel>
    </div>
  );
}
