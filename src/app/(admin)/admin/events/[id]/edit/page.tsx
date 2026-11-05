import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import { getCategories } from "@/lib/queries";
import {
  AdminEventForm,
  AdminTicketTypesManager,
} from "@/components/features/admin-event-form";
import type { EventItem } from "@/types/database";

export const metadata: Metadata = {
  title: "Edit Acara & Kelola Jenis Tiket",
};

export default async function AdminEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await getCategories();

  let event: EventItem | null = null;

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("*, categories(*), ticket_types(*)")
      .eq("id", id)
      .single();

    if (data) {
      event = data as EventItem;
    }
  }

  if (!event) {
    event = FALLBACK_EVENTS.find((e) => e.id === id) || null;
  }

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:text-vermilion min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Acara
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
          Edit:{" "}
          <span className="font-serif italic font-normal text-vermilion">
            {event.title}
          </span>
        </h1>
      </div>

      <AdminEventForm mode="edit" categories={categories} event={event} />

      <AdminTicketTypesManager
        eventId={event.id}
        ticketTypes={event.ticket_types || []}
      />
    </div>
  );
}

