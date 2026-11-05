import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import {
  DigitalTicketCard,
  type DigitalTicketData,
} from "@/components/features/digital-ticket-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Karcis #${code.toUpperCase()}`,
    description: `Karcis digital resmi KARCIS dengan kode verifikasi #${code.toUpperCase()}.`,
  };
}

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ purchased?: string; slug?: string }>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const normalizedCode = code.toUpperCase();
  const justPurchased = sp.purchased === "1";

  let ticketData: DigitalTicketData | null = null;

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: ticketRow } = await supabase
      .from("tickets")
      .select(
        `
        id,
        code,
        checked_in_at,
        order_id,
        ticket_types (
          name,
          price
        ),
        orders (
          id,
          user_id,
          created_at,
          profiles (
            full_name
          ),
          events (
            title,
            slug,
            venue,
            city,
            starts_at,
            ends_at
          ),
          tickets (
            code
          )
        )
      `
      )
      .eq("code", normalizedCode)
      .single();

    if (ticketRow && ticketRow.orders) {
      const ord = Array.isArray(ticketRow.orders)
        ? ticketRow.orders[0]
        : ticketRow.orders;
      const tt = Array.isArray(ticketRow.ticket_types)
        ? ticketRow.ticket_types[0]
        : ticketRow.ticket_types;
      const ev = Array.isArray(ord?.events) ? ord.events[0] : ord?.events;
      const prof = Array.isArray(ord?.profiles)
        ? ord.profiles[0]
        : ord?.profiles;
      const siblingTickets = Array.isArray(ord?.tickets) ? ord.tickets : [];

      if (ev) {
        ticketData = {
          code: ticketRow.code,
          checked_in_at: ticketRow.checked_in_at,
          holder_name:
            prof?.full_name || user?.email?.split("@")[0] || "Anggota KARCIS",
          holder_email: user?.email || "",
          ticket_type_name: tt?.name || "Regular",
          ticket_price: tt?.price ?? 0,
          event_title: ev.title,
          event_slug: ev.slug,
          event_venue: ev.venue,
          event_city: ev.city,
          event_starts_at: ev.starts_at,
          event_ends_at: ev.ends_at,
          order_id: ord.id,
          order_created_at: ord.created_at,
          sibling_codes: siblingTickets.map((s: { code: string }) => s.code),
        };
      }
    }
  } else if (normalizedCode === "KRC26SIM") {
    const fallbackEvent =
      FALLBACK_EVENTS.find((e) => e.slug === sp.slug) || FALLBACK_EVENTS[0];
    ticketData = {
      code: "KRC26SIM",
      checked_in_at: null,
      holder_name: "Raka Pradipta (Pratinjau)",
      holder_email: "raka@karcis.id",
      ticket_type_name:
        fallbackEvent.ticket_types?.[1]?.name ||
        fallbackEvent.ticket_types?.[0]?.name ||
        "Presale Gelombang 1",
      ticket_price:
        fallbackEvent.ticket_types?.[1]?.price ??
        fallbackEvent.ticket_types?.[0]?.price ??
        125000,
      event_title: fallbackEvent.title,
      event_slug: fallbackEvent.slug,
      event_venue: fallbackEvent.venue,
      event_city: fallbackEvent.city,
      event_starts_at: fallbackEvent.starts_at,
      event_ends_at: fallbackEvent.ends_at,
      order_id: "88888888-4444-4444-8888-123456789abc",
      order_created_at: new Date().toISOString(),
      sibling_codes: ["KRC26SIM"],
    };
  }

  if (!ticketData) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <DigitalTicketCard ticket={ticketData} justPurchased={justPurchased} />
    </main>
  );
}

