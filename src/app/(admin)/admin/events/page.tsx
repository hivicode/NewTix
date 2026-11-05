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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink pb-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
            MANAJEMEN KATALOG // NEWTIX
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Daftar Seluruh{" "}
            <span className="font-serif italic font-semibold text-denim">
              Acara.
            </span>
          </h1>
        </div>

        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4" />
            Tambah Acara Baru
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border-2 border-ink bg-card poster-shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-ink bg-cloud-subtle font-mono text-xs uppercase tracking-wider text-ink">
              <th className="p-4">Acara & Lokasi</th>
              <th className="p-4">Jadwal</th>
              <th className="p-4">Status</th>
              <th className="p-4">Kuota Terjual</th>
              <th className="p-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-dashed divide-ink/20 text-sm">
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
                  className="hover:bg-cloud-subtle/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-mono text-[11px] text-denim font-bold uppercase">
                      {ev.categories?.emoji} {ev.categories?.name || "Acara"}
                    </div>
                    <div className="font-display text-base font-extrabold text-ink">
                      {ev.title}
                    </div>
                    <div className="font-mono text-xs text-ink-muted">
                      {ev.venue}, {ev.city}
                    </div>
                  </td>

                  <td className="p-4 font-mono text-xs whitespace-nowrap">
                    {formatEventDate(ev.starts_at)}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {ev.status === "published" ? (
                        <Badge variant="mint">PUBLISHED</Badge>
                      ) : ev.status === "draft" ? (
                        <Badge variant="butter">DRAFT</Badge>
                      ) : (
                        <Badge variant="ink">ENDED</Badge>
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
                          className="p-1.5 rounded border border-ink bg-background hover:bg-butter transition-colors cursor-pointer"
                        >
                          {ev.status === "published" ? (
                            <ToggleRight className="w-4 h-4 text-denim" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-ink-muted" />
                          )}
                        </button>
                      </form>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-xs whitespace-nowrap">
                    <span className="font-bold text-ink">{sold}</span> /{" "}
                    {totalQuota} tiket
                    <span className="block text-[11px] text-ink-muted">
                      ({tList.length} jenis tiket)
                    </span>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/events/${ev.slug}`}
                          title="Lihat halaman publik"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </Button>

                      <Button asChild variant="secondary" size="sm">
                        <Link
                          href={`/admin/events/${ev.id}/edit`}
                          title="Edit Acara & Jenis Tiket"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                      </Button>

                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/admin/events/${ev.id}/orders`}
                          title="Daftar Pembeli"
                        >
                          <ReceiptText className="w-3.5 h-3.5" />
                          <span>Pembeli</span>
                        </Link>
                      </Button>

                      <form action={deleteEventAction}>
                        <input type="hidden" name="eventId" value={ev.id} />
                        <Button
                          type="submit"
                          variant="destructive"
                          size="sm"
                          title="Hapus Acara"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
