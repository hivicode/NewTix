"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";

export interface AuthActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
}

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Alamat email wajib diisi.")
    .email("Format alamat email tidak valid."),
  password: z
    .string()
    .min(6, "Kata sandi minimal terdiri dari 6 karakter."),
  redirectTo: z.string().optional(),
});

const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter.")
    .max(80, "Nama lengkap terlalu panjang."),
  email: z
    .string()
    .trim()
    .min(1, "Alamat email wajib diisi.")
    .email("Format alamat email tidak valid."),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter agar akunmu aman."),
  redirectTo: z.string().optional(),
});

export async function loginWithEmailAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    redirectTo: String(formData.get("redirectTo") || "/"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Mohon periksa kembali isian formulir kamu.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isServerSupabaseConfigured()) {
    return {
      error:
        "Koneksi Supabase belum dikonfigurasi di .env.local. Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY terlebih dahulu.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return {
        error: "Email atau kata sandi salah. Coba diingat-ingat lagi.",
      };
    }
    return {
      error: `Gagal masuk: ${error.message}`,
    };
  }

  revalidatePath("/", "layout");
  const safeRedirect =
    parsed.data.redirectTo && parsed.data.redirectTo.startsWith("/")
      ? parsed.data.redirectTo
      : "/";
  redirect(safeRedirect);
}

export async function registerWithEmailAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    fullName: String(formData.get("fullName") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    redirectTo: String(formData.get("redirectTo") || "/"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Ada kolom yang belum sesuai. Cek tanda merah di bawah.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isServerSupabaseConfigured()) {
    return {
      error:
        "Koneksi Supabase belum dikonfigurasi di .env.local. Silakan isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY terlebih dahulu.",
    };
  }

  const supabase = await createClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return {
        error: "Email ini sudah terdaftar. Silakan langsung masuk saja.",
      };
    }
    return {
      error: `Gagal mendaftar: ${error.message}`,
    };
  }

  // Jika session langsung aktif (Auto-confirm aktif di Supabase), arahkan langsung
  if (data.session) {
    revalidatePath("/", "layout");
    const safeRedirect =
      parsed.data.redirectTo && parsed.data.redirectTo.startsWith("/")
        ? parsed.data.redirectTo
        : "/";
    redirect(safeRedirect);
  }

  return {
    success:
      "Pendaftaran berhasil! Cek kotak masuk emailmu untuk tautan verifikasi, atau langsung masuk bila verifikasi email dinonaktifkan.",
  };
}

export async function signOutAction() {
  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}

