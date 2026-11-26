import type { Metadata } from "next";
import Link from "next/link";
import {
  Edit,
  Eye,
  Plus,
  ReceiptText,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import {
  deleteEventAction,
  toggleEventStatusAction,
} from "@/actions/admin";
import { GlossLink, StatusBadge } from "@/components/atoms";
import { RetroPanel, RetroPanelHeader } from "@/components/molecules/retro-panel";
import { formatEventDate } from "@/lib/utils";
import type { EventItem } from "@/types/database";

export const metadata: Metadata = {
  title: "Kelola Acara (CRUD)",
};

export default async function AdminEventsListPage() {
  let events: EventItem[] = FALLBACK_EVENTS;

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("*, categories(*), ticket_types(*)")
      .order("starts_at", { ascending: true });

    if (data && data.length > 0) {
      events = data as EventItem[];
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#d9d9d9] pb-5">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#2867a6] block">
            MANAJEMEN KATALOG // NEWTIX
          </span>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-black mt-1">
            Daftar Seluruh <span className="text-[#2867a6]">Acara</span>
          </h1>
        </div>

        <GlossLink href="/admin/events/new" $variant="orange" $size="md">
          <Plus className="w-4 h-4" />
          Tambah Acara Baru
        </GlossLink>
      </div>

      <RetroPanel>
        <RetroPanelHeader>
          <span>KATALOG ACARA ({events.length})</span>
          <span className="text-[11px] font-semibold text-[#5a5a5a]">
            Kelola jadwal, status &amp; kuota
          </span>
        </RetroPanelHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#d9d9d9] bg-[#f4f4f4] text-[11px] font-bold text-[#5a5a5a] uppercase">
                <th className="p-3.5">Acara &amp; Lokasi</th>
                <th className="p-3.5">Jadwal</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Kuota Terjual</th>
                <th className="p-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5] text-sm">
              {events.map((ev) => {
                const tList = ev.ticket_types || [];
                const totalQuota = tList.reduce((acc, t) => acc + t.quota, 0);
                const totalRemaining = tList.reduce(
                  (acc, t) => acc + t.remaining,
                  0
                );
                const sold = Math.max(0, totalQuota - totalRemaining);

                return (
                  <tr
                    key={ev.id}
                    className="hover:bg-[#e7f1fb] transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="text-[11px] text-[#2867a6] font-bold">
                        {ev.categories?.emoji} {ev.categories?.name || "Acara"}
                      </div>
                      <div className="text-[15px] font-bold text-black">
                        {ev.title}
                      </div>
                      <div className="text-xs text-[#5a5a5a]">
                        {ev.venue}, {ev.city}
                      </div>
                    </td>

                    <td className="p-3.5 text-xs whitespace-nowrap text-[#1b1b1b]">
                      {formatEventDate(ev.starts_at)}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {ev.status === "published" ? (
                          <StatusBadge $tone="valid">PUBLISHED</StatusBadge>
                        ) : ev.status === "draft" ? (
                          <StatusBadge $tone="info">DRAFT</StatusBadge>
                        ) : (
                          <StatusBadge $tone="muted">ENDED</StatusBadge>
                        )}

                        <form action={toggleEventStatusAction}>
                          <input type="hidden" name="eventId" value={ev.id} />
                          <input
                            type="hidden"
                            name="currentStatus"
                            value={ev.status}
                          />
                          <button
                            type="submit"
                            title={
                              ev.status === "published"
                                ? "Ubah ke Draft"
                                : "Publikasikan"
                            }
                            className="p-1.5 border border-[#c1c1c1] bg-white hover:bg-[#edf9ff] transition-colors cursor-pointer"
                          >
                            {ev.status === "published" ? (
                              <ToggleRight className="w-4 h-4 text-[#2867a6]" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-[#8a8a8a]" />
                            )}
                          </button>
                        </form>
                      </div>
                    </td>

                    <td className="p-3.5 text-xs whitespace-nowrap">
                      <span className="font-bold text-black">{sold}</span> /{" "}
                      {totalQuota} tiket
                      <span className="block text-[11px] text-[#5a5a5a]">
                        ({tList.length} jenis tiket)
                      </span>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <GlossLink
                          href={`/events/${ev.slug}`}
                          $variant="silver"
                          $size="sm"
                          title="Lihat halaman publik"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </GlossLink>

                        <GlossLink
                          href={`/admin/events/${ev.id}/edit`}
                          $variant="silver"
                          $size="sm"
                          title="Edit Acara & Jenis Tiket"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </GlossLink>

                        <GlossLink
                          href={`/admin/events/${ev.id}/orders`}
                          $variant="silver"
                          $size="sm"
                          title="Daftar Pembeli"
                        >
                          <ReceiptText className="w-3.5 h-3.5" />
                          <span>Pembeli</span>
                        </GlossLink>

                        <form action={deleteEventAction}>
                          <input type="hidden" name="eventId" value={ev.id} />
                          <button
                            type="submit"
                            title="Hapus Acara"
                            className="inline-flex items-center justify-center border border-[#e0584f] bg-[#fff2f2] px-2.5 py-1.5 text-xs font-bold text-[#c0392b] hover:bg-[#e0584f] hover:text-white transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </RetroPanel>
    </div>
  );
}
