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
import { Label } from "@/components/ui/label";
import { GlossButton, RetroInput } from "@/components/atoms";
import {
  RetroPanel,
  RetroPanelBody,
  RetroPanelHeader,
  RetroTextarea,
} from "@/components/molecules/retro-panel";
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
    <RetroPanel>
      <RetroPanelHeader>
        <span>
          {mode === "create"
            ? "BUAT ACARA BARU"
            : `PERBARUI ACARA // ${event?.slug}`}
        </span>
        <span className="text-[11px] font-semibold text-[#5a5a5a]">
          Detail Panggung &amp; Jadwal
        </span>
      </RetroPanelHeader>

      <RetroPanelBody>
        <form action={formAction} className="space-y-5">
          {state.error && (
            <div
              role="alert"
              className="border border-[#e0584f] bg-[#fff2f2] p-3 text-xs font-semibold text-[#c0392b] flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {state.success && (
            <div
              role="status"
              className="border border-[#54ac32] bg-[#edf9e8] text-[#2f7d18] p-3 text-xs font-semibold flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{state.success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="title">Judul Acara</Label>
              <RetroInput
                id="title"
                name="title"
                $compact
                $invalid={Boolean(state.fieldErrors?.title)}
                defaultValue={event?.title || ""}
                placeholder="Mis. Malam Synthesizers & Kaset Pita Analog"
                required
              />
              {state.fieldErrors?.title && (
                <p className="text-xs font-semibold text-[#e0584f]">
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
                className="flex h-[34px] w-full border border-[#c1c1c1] bg-white px-2.5 text-[13px] text-black shadow-[inset_0_0_4px_rgba(0,0,0,0.12)]"
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
                className="flex h-[34px] w-full border border-[#c1c1c1] bg-white px-2.5 text-[13px] text-black shadow-[inset_0_0_4px_rgba(0,0,0,0.12)]"
              >
                <option value="published">Published (Tayang di Katalog)</option>
                <option value="draft">Draft (Sembunyikan)</option>
                <option value="ended">Ended (Selesai)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="venue">Nama Venue / Tempat</Label>
              <RetroInput
                id="venue"
                name="venue"
                $compact
                defaultValue={event?.venue || ""}
                placeholder="Mis. Gudang Selatan No. 22"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">Kota</Label>
              <RetroInput
                id="city"
                name="city"
                $compact
                defaultValue={event?.city || ""}
                placeholder="Mis. Bandung"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="starts_at">Waktu Mulai</Label>
              <RetroInput
                id="starts_at"
                name="starts_at"
                type="datetime-local"
                $compact
                defaultValue={toLocalDatetimeValue(event?.starts_at)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ends_at">Waktu Selesai</Label>
              <RetroInput
                id="ends_at"
                name="ends_at"
                type="datetime-local"
                $compact
                defaultValue={toLocalDatetimeValue(event?.ends_at)}
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="cover_url">
                URL Gambar Poster (Unsplash / Supabase)
              </Label>
              <RetroInput
                id="cover_url"
                name="cover_url"
                type="url"
                $compact
                defaultValue={
                  event?.cover_url ||
                  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
                }
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description">Deskripsi Lengkap Acara</Label>
              <RetroTextarea
                id="description"
                name="description"
                defaultValue={event?.description || ""}
                placeholder="Ceritakan penampil, jadwal pintu dibuka, dan apa saja yang didapat pemegang tiket..."
                required
              />
            </div>
          </div>

          {/* Initial Ticket Type section when creating new event */}
          {mode === "create" && (
            <div className="border-t border-[#d8eaf6] pt-5 mt-5 space-y-4">
              <h3 className="text-sm font-bold text-[#2867a6]">
                Tiket Gelombang Pertama (Otomatis Dibuat)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="initial_ticket_name">Nama Kategori Tiket</Label>
                  <RetroInput
                    id="initial_ticket_name"
                    name="initial_ticket_name"
                    $compact
                    defaultValue="Presale Gelombang 1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="initial_ticket_price">Harga (Rupiah)</Label>
                  <RetroInput
                    id="initial_ticket_price"
                    name="initial_ticket_price"
                    type="number"
                    $compact
                    min={0}
                    defaultValue={95000}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="initial_ticket_quota">Kuota Tersedia</Label>
                  <RetroInput
                    id="initial_ticket_quota"
                    name="initial_ticket_quota"
                    type="number"
                    $compact
                    min={1}
                    defaultValue={80}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <GlossButton type="submit" $variant="orange" $size="md" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : mode === "create" ? (
                "Terbitkan Acara Sekarang »"
              ) : (
                "Simpan Perubahan Acara »"
              )}
            </GlossButton>
          </div>
        </form>
      </RetroPanelBody>
    </RetroPanel>
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
    <RetroPanel>
      <RetroPanelHeader>
        <span>KELOLA JENIS TIKET ({ticketTypes.length})</span>
        <span className="text-[11px] font-semibold text-[#5a5a5a]">
          Kuota &amp; Harga Tiket
        </span>
      </RetroPanelHeader>

      <RetroPanelBody className="space-y-5">
        {/* Existing ticket types */}
        <div className="space-y-2.5">
          {ticketTypes.map((tt) => (
            <div
              key={tt.id}
              className="border border-[#d8eaf6] bg-[#f8fbfe] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-bold text-black">{tt.name}</p>
                <p className="text-xs text-[#5a5a5a]">
                  Harga:{" "}
                  <strong className="text-black">{formatRupiah(tt.price)}</strong>{" "}
                  • Sisa Kuota:{" "}
                  <strong className="text-[#2867a6]">
                    {tt.remaining} / {tt.quota}
                  </strong>
                </p>
              </div>

              <form action={deleteTicketTypeAction}>
                <input type="hidden" name="ticketTypeId" value={tt.id} />
                <input type="hidden" name="eventId" value={eventId} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 border border-[#e0584f] bg-[#fff2f2] px-3 py-1.5 text-xs font-bold text-[#c0392b] hover:bg-[#e0584f] hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </form>
            </div>
          ))}
        </div>

        {/* Add new ticket type form */}
        <form
          action={formAction}
          className="border-t border-[#d8eaf6] pt-5 space-y-4"
        >
          <input type="hidden" name="event_id" value={eventId} />
          <h3 className="text-xs font-bold text-[#2867a6]">
            + Tambah Gelombang / Jenis Tiket Baru
          </h3>

          {state.error && (
            <p className="text-xs font-semibold text-[#e0584f]">{state.error}</p>
          )}
          {state.success && (
            <p className="text-xs text-[#2f7d18] font-bold">{state.success}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="tt_name">Nama Jenis Tiket</Label>
              <RetroInput
                id="tt_name"
                name="name"
                $compact
                placeholder="Mis. VIP + Bundel Zine"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tt_price">Harga (Rp)</Label>
              <RetroInput
                id="tt_price"
                name="price"
                type="number"
                $compact
                min={0}
                defaultValue={150000}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tt_quota">Kuota</Label>
              <RetroInput
                id="tt_quota"
                name="quota"
                type="number"
                $compact
                min={1}
                defaultValue={40}
                required
              />
            </div>
          </div>

          <GlossButton type="submit" $variant="silver" $size="sm" disabled={isPending}>
            <Plus className="w-4 h-4" />
            Tambah Jenis Tiket
          </GlossButton>
        </form>
      </RetroPanelBody>
    </RetroPanel>
  );
}
