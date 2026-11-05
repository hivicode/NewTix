"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export interface AdminActionState {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
}

const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Judul acara minimal 5 karakter.")
    .max(140, "Judul acara maksimal 140 karakter."),
  slug: z.string().trim().optional(),
  category_id: z.string().uuid("Pilih kategori acara yang valid."),
  venue: z.string().trim().min(3, "Nama lokasi/venue wajib diisi."),
  city: z.string().trim().min(2, "Nama kota wajib diisi."),
  starts_at: z.string().min(1, "Waktu mulai wajib diisi."),
  ends_at: z.string().min(1, "Waktu selesai wajib diisi."),
  cover_url: z
    .string()
    .trim()
    .url("URL poster harus berupa tautan http/https yang valid.")
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(20, "Deskripsi acara minimal 20 karakter."),
  status: z.enum(["draft", "published", "ended"]),
});

const ticketTypeFormSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().trim().min(2, "Nama jenis tiket minimal 2 karakter."),
  price: z.coerce
    .number()
    .int()
    .min(0, "Harga tiket tidak boleh negatif."),
  quota: z.coerce
    .number()
    .int()
    .min(1, "Kuota tiket minimal 1."),
});

async function requireAdmin() {
  if (!isServerSupabaseConfigured()) {
    throw new Error(
      "Supabase belum dikonfigurasi di .env.local. Operasi tulis membutuhkan database aktif."
    );
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Akses ditolak: Hanya admin yang diizinkan.");
  }

  return { supabase, user };
}

export async function createEventAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const raw = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    category_id: String(formData.get("category_id") || ""),
    venue: String(formData.get("venue") || ""),
    city: String(formData.get("city") || ""),
    starts_at: String(formData.get("starts_at") || ""),
    ends_at: String(formData.get("ends_at") || ""),
    cover_url: String(formData.get("cover_url") || ""),
    description: String(formData.get("description") || ""),
    status: String(formData.get("status") || "published") as
      | "draft"
      | "published"
      | "ended",
  };

  const parsed = eventFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Periksa kembali kolom formulir acara.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { supabase, user } = await requireAdmin();
    const finalSlug =
      parsed.data.slug && parsed.data.slug.length > 2
        ? slugify(parsed.data.slug)
        : `${slugify(parsed.data.title)}-${Math.floor(
            100 + Math.random() * 900
          )}`;

    const { data: created, error } = await supabase
      .from("events")
      .insert({
        title: parsed.data.title,
        slug: finalSlug,
        category_id: parsed.data.category_id,
        organizer_id: user.id,
        venue: parsed.data.venue,
        city: parsed.data.city,
        starts_at: new Date(parsed.data.starts_at).toISOString(),
        ends_at: new Date(parsed.data.ends_at).toISOString(),
        cover_url: parsed.data.cover_url || null,
        description: parsed.data.description,
        status: parsed.data.status,
      })
      .select("id")
      .single();

    if (error || !created) {
      return {
        error: `Gagal menyimpan acara: ${error?.message || "Unknown error"}`,
      };
    }

    // Buat 1 tiket default bila disertakan di form pembuatan awal
    const initialTicketName = String(
      formData.get("initial_ticket_name") || ""
    ).trim();
    const initialTicketPrice = Number(
      formData.get("initial_ticket_price") || 0
    );
    const initialTicketQuota = Number(
      formData.get("initial_ticket_quota") || 50
    );

    if (initialTicketName && initialTicketQuota > 0) {
      await supabase.from("ticket_types").insert({
        event_id: created.id,
        name: initialTicketName,
        price: Math.max(0, initialTicketPrice),
        quota: initialTicketQuota,
        remaining: initialTicketQuota,
      });
    }

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal membuat acara.",
    };
  }

  redirect("/admin/events");
}

export async function updateEventAction(
  eventId: string,
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const raw = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    category_id: String(formData.get("category_id") || ""),
    venue: String(formData.get("venue") || ""),
    city: String(formData.get("city") || ""),
    starts_at: String(formData.get("starts_at") || ""),
    ends_at: String(formData.get("ends_at") || ""),
    cover_url: String(formData.get("cover_url") || ""),
    description: String(formData.get("description") || ""),
    status: String(formData.get("status") || "published") as
      | "draft"
      | "published"
      | "ended",
  };

  const parsed = eventFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Periksa kembali kolom formulir acara.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { supabase } = await requireAdmin();
    const finalSlug =
      parsed.data.slug && parsed.data.slug.length > 2
        ? slugify(parsed.data.slug)
        : slugify(parsed.data.title);

    const { error } = await supabase
      .from("events")
      .update({
        title: parsed.data.title,
        slug: finalSlug,
        category_id: parsed.data.category_id,
        venue: parsed.data.venue,
        city: parsed.data.city,
        starts_at: new Date(parsed.data.starts_at).toISOString(),
        ends_at: new Date(parsed.data.ends_at).toISOString(),
        cover_url: parsed.data.cover_url || null,
        description: parsed.data.description,
        status: parsed.data.status,
      })
      .eq("id", eventId);

    if (error) {
      return { error: `Gagal memperbarui acara: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${finalSlug}`);
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${eventId}/edit`);

    return { success: "Perubahan acara berhasil disimpan!" };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal memperbarui acara.",
    };
  }
}

export async function toggleEventStatusAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  const currentStatus = String(formData.get("currentStatus") || "draft");
  const nextStatus = currentStatus === "published" ? "draft" : "published";

  if (!isServerSupabaseConfigured()) return;

  const { supabase } = await requireAdmin();
  await supabase
    .from("events")
    .update({ status: nextStatus })
    .eq("id", eventId);

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function deleteEventAction(formData: FormData) {
  const eventId = String(formData.get("eventId") || "");
  if (!isServerSupabaseConfigured()) return;

  const { supabase } = await requireAdmin();
  await supabase.from("events").delete().eq("id", eventId);

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function createTicketTypeAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const raw = {
    event_id: String(formData.get("event_id") || ""),
    name: String(formData.get("name") || ""),
    price: formData.get("price"),
    quota: formData.get("quota"),
  };

  const parsed = ticketTypeFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ||
        "Data jenis tiket belum sesuai.",
    };
  }

  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("ticket_types").insert({
      event_id: parsed.data.event_id,
      name: parsed.data.name,
      price: parsed.data.price,
      quota: parsed.data.quota,
      remaining: parsed.data.quota,
    });

    if (error) {
      return { error: `Gagal menambah jenis tiket: ${error.message}` };
    }

    revalidatePath(`/admin/events/${parsed.data.event_id}/edit`);
    revalidatePath("/events");
    return { success: "Jenis tiket baru berhasil ditambahkan!" };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal menambah tiket.",
    };
  }
}

export async function deleteTicketTypeAction(formData: FormData) {
  const ticketTypeId = String(formData.get("ticketTypeId") || "");
  const eventId = String(formData.get("eventId") || "");
  if (!isServerSupabaseConfigured()) return;

  const { supabase } = await requireAdmin();
  await supabase.from("ticket_types").delete().eq("id", ticketTypeId);

  revalidatePath(`/admin/events/${eventId}/edit`);
  revalidatePath("/events");
}

