"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  createEventAction,
  updateEventAction,
  createTicketTypeAction,
  deleteTicketTypeAction,
  type AdminActionState,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { Category, EventItem, TicketType } from "@/types/database";

const initialState: AdminActionState = {};

function toLocalDatetimeValue(isoString?: string) {
  if (!isoString) return "2026-12-20T19:00";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "2026-12-20T19:00";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function AdminEventForm({
  mode,
  categories,
  event,
}: {
  mode: "create" | "edit";
  categories: Category[];
  event?: EventItem;
}) {
  const boundAction =
    mode === "edit" && event
      ? updateEventAction.bind(null, event.id)
      : createEventAction;

  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="border-2 border-ink bg-card p-6 sm:p-8 poster-shadow space-y-5"
    >
      <div className="border-b-2 border-dashed border-ink/25 pb-4">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-vermilion block">
          {mode === "create"
            ? "CETAK ACARA BARU"
            : `PERBARUI ACARA // ${event?.slug}`}
        </span>
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          Detail Panggung & Jadwal
        </h2>
      </div>

      {state.error && (
        <div
          role="alert"
          className="border-2 border-destructive bg-destructive/10 p-3.5 font-mono text-xs text-destructive flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div
          role="status"
          className="border-2 border-pine bg-pine/10 p-3.5 font-mono text-xs text-pine flex items-start gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{state.success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="title">Judul Acara</Label>
          <Input
            id="title"
            name="title"
            defaultValue={event?.title || ""}
            placeholder="Mis. Malam Synthesizers & Kaset Pita Analog"
            required
          />
          {state.fieldErrors?.title && (
            <p className="font-mono text-xs text-destructive">
              {state.fieldErrors.title[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category_id">Kategori</Label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={event?.category_id || categories[0]?.id}
            className="flex min-h-[44px] w-full border-2 border-ink bg-card px-3.5 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status Publikasi</Label>
          <select
            id="status"
            name="status"
            defaultValue={event?.status || "published"}
            className="flex min-h-[44px] w-full border-2 border-ink bg-card px-3.5 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <option value="published">Published (Tayang di Loket)</option>
            <option value="draft">Draft (Sembunyikan)</option>
            <option value="ended">Ended (Selesai)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="venue">Nama Venue / Tempat</Label>
          <Input
            id="venue"
            name="venue"
            defaultValue={event?.venue || ""}
            placeholder="Mis. Gudang Selatan No. 22"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">Kota</Label>
          <Input
            id="city"
            name="city"
            defaultValue={event?.city || ""}
            placeholder="Mis. Bandung"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="starts_at">Waktu Mulai</Label>
          <Input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            defaultValue={toLocalDatetimeValue(event?.starts_at)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ends_at">Waktu Selesai</Label>
          <Input
            id="ends_at"
            name="ends_at"
            type="datetime-local"
            defaultValue={toLocalDatetimeValue(event?.ends_at)}
            required
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="cover_url">URL Gambar Poster (Unsplash / Supabase)</Label>
          <Input
            id="cover_url"
            name="cover_url"
            type="url"
            defaultValue={
              event?.cover_url ||
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
            }
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="description">Deskripsi Lengkap Acara</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={event?.description || ""}
            placeholder="Ceritakan penampil, jadwal pintu dibuka, dan apa saja yang didapat pemegang karcis..."
            required
          />
        </div>
      </div>

      {/* Initial Ticket Type section when creating new event */}
      {mode === "create" && (
        <div className="border-t-2 border-dashed border-ink/25 pt-5 mt-5 space-y-4">
          <h3 className="font-display text-lg font-extrabold">
            Tiket Gelombang Pertama (Otomatis Dibuat)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="initial_ticket_name">Nama Kategori Tiket</Label>
              <Input
                id="initial_ticket_name"
                name="initial_ticket_name"
                defaultValue="Presale Gelombang 1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="initial_ticket_price">Harga (Rupiah)</Label>
              <Input
                id="initial_ticket_price"
                name="initial_ticket_price"
                type="number"
                min={0}
                defaultValue={95000}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="initial_ticket_quota">Kuota Tersedia</Label>
              <Input
                id="initial_ticket_quota"
                name="initial_ticket_quota"
                type="number"
                min={1}
                defaultValue={80}
              />
            </div>
          </div>
        </div>
      )}

      <div className="pt-3 flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : mode === "create" ? (
            "Terbitkan Acara Sekarang"
          ) : (
            "Simpan Perubahan Acara"
          )}
        </Button>
      </div>
    </form>
  );
}

export function AdminTicketTypesManager({
  eventId,
  ticketTypes,
}: {
  eventId: string;
  ticketTypes: TicketType[];
}) {
  const [state, formAction, isPending] = useActionState(
    createTicketTypeAction,
    initialState
  );

  return (
    <div className="border-2 border-ink bg-card p-6 sm:p-8 poster-shadow space-y-6">
      <div className="border-b-2 border-dashed border-ink/25 pb-4">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-vermilion block">
          KUOTA & HARGA KARCIS
        </span>
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          Kelola Jenis Tiket ({ticketTypes.length})
        </h2>
      </div>

      {/* Existing ticket types */}
      <div className="space-y-3">
        {ticketTypes.map((tt) => (
          <div
            key={tt.id}
            className="border-2 border-ink bg-background p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p className="font-display text-base font-extrabold text-ink">
                {tt.name}
              </p>
              <p className="font-mono text-xs text-ink-muted">
                Harga: <strong className="text-ink">{formatRupiah(tt.price)}</strong>{" "}
                • Sisa Kuota:{" "}
                <strong className="text-vermilion">
                  {tt.remaining} / {tt.quota}
                </strong>
              </p>
            </div>

            <form action={deleteTicketTypeAction}>
              <input type="hidden" name="ticketTypeId" value={tt.id} />
              <input type="hidden" name="eventId" value={eventId} />
              <Button type="submit" variant="destructive" size="sm">
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </Button>
            </form>
          </div>
        ))}
      </div>

      {/* Add new ticket type form */}
      <form
        action={formAction}
        className="border-t-2 border-dashed border-ink/25 pt-5 space-y-4"
      >
        <input type="hidden" name="event_id" value={eventId} />
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
          + Tambah Gelombang / Jenis Tiket Baru
        </h3>

        {state.error && (
          <p className="font-mono text-xs text-destructive">{state.error}</p>
        )}
        {state.success && (
          <p className="font-mono text-xs text-pine">{state.success}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="tt_name">Nama Jenis Tiket</Label>
            <Input
              id="tt_name"
              name="name"
              placeholder="Mis. VIP + Bundel Zine"
              required
            />
          </div>
          <div>
            <Label htmlFor="tt_price">Harga (Rp)</Label>
            <Input
              id="tt_price"
              name="price"
              type="number"
              min={0}
              defaultValue={150000}
              required
            />
          </div>
          <div>
            <Label htmlFor="tt_quota">Kuota</Label>
            <Input
              id="tt_quota"
              name="quota"
              type="number"
              min={1}
              defaultValue={40}
              required
            />
          </div>
        </div>

        <Button type="submit" variant="secondary" size="sm" disabled={isPending}>
          <Plus className="w-4 h-4" />
          Tambah Jenis Tiket
        </Button>
      </form>
    </div>
  );
}

