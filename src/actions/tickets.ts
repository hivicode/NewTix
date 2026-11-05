"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";

export interface PurchaseActionState {
  error?: string;
}

const purchaseSchema = z.object({
  ticketTypeId: z.string().uuid("ID jenis tiket tidak valid."),
  qty: z.coerce
    .number()
    .int()
    .min(1, "Minimal beli 1 tiket.")
    .max(5, "Maksimal 5 tiket per transaksi."),
  eventSlug: z.string().min(1),
});

export async function purchaseTicketsAction(
  _prevState: PurchaseActionState,
  formData: FormData
): Promise<PurchaseActionState> {
  const raw = {
    ticketTypeId: String(formData.get("ticketTypeId") || ""),
    qty: formData.get("qty"),
    eventSlug: String(formData.get("eventSlug") || ""),
  };

  const parsed = purchaseSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ||
        "Data pembelian tidak valid. Silakan periksa kembali.",
    };
  }

  if (!isServerSupabaseConfigured()) {
    // Mode pratinjau tanpa koneksi database: arahkan ke contoh tiket simulasi
    redirect(
      `/my-tickets/NTX26SIM?purchased=1&qty=${parsed.data.qty}&slug=${encodeURIComponent(
        parsed.data.eventSlug
      )}`
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/events/${parsed.data.eventSlug}`)}`
    );
  }

  const { data, error } = await supabase.rpc("purchase_tickets", {
    p_ticket_type_id: parsed.data.ticketTypeId,
    p_qty: parsed.data.qty,
  });

  if (error) {
    const msg = error.message || "";
    if (msg.includes("SOLD_OUT")) {
      return {
        error: "Yah, tiket kategori ini baru saja habis terjual!",
      };
    }
    if (msg.includes("INSUFFICIENT_QUOTA")) {
      return {
        error:
          "Sisa kuota tidak mencukupi jumlah yang kamu minta. Kurangi jumlah tiket.",
      };
    }
    if (msg.includes("UNAUTHORIZED")) {
      redirect(
        `/login?redirect=${encodeURIComponent(
          `/events/${parsed.data.eventSlug}`
        )}`
      );
    }
    return {
      error: `Gagal memproses pesanan: ${msg}`,
    };
  }

  const result = data as {
    order_id: string;
    first_ticket_code: string;
    codes: string[];
    total_amount: number;
  };

  revalidatePath(`/events/${parsed.data.eventSlug}`);
  revalidatePath("/my-tickets");
  revalidatePath("/admin");

  redirect(
    `/my-tickets/${result.first_ticket_code}?purchased=1&qty=${parsed.data.qty}`
  );
}

