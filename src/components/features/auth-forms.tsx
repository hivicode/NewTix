"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  loginWithEmailAction,
  registerWithEmailAction,
  type AuthActionState,
} from "@/actions/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Github, Loader2 } from "lucide-react";

const initialState: AuthActionState = {};

export function AuthForms({
  mode,
  redirectTo = "/",
  oauthError,
}: {
  mode: "login" | "register";
  redirectTo?: string;
  oauthError?: string;
}) {
  const action =
    mode === "login" ? loginWithEmailAction : registerWithEmailAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [isGithubLoading, setIsGithubLoading] = React.useState(false);
  const [githubError, setGithubError] = React.useState<string | null>(
    oauthError ? "Autentikasi GitHub gagal atau dibatalkan. Silakan coba lagi." : null
  );

  async function handleGithubLogin() {
    setGithubError(null);
    if (!isSupabaseConfigured()) {
      setGithubError(
        "Supabase belum dikonfigurasi di .env.local. Aktifkan URL & Anon Key terlebih dahulu."
      );
      return;
    }

    try {
      setIsGithubLoading(true);
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
            redirectTo
          )}`,
        },
      });
      if (error) {
        setGithubError(`Gagal menghubungkan ke GitHub: ${error.message}`);
        setIsGithubLoading(false);
      }
    } catch {
      setGithubError("Terjadi kesalahan saat menghubungi GitHub OAuth.");
      setIsGithubLoading(false);
    }
  }

  return (
    <div className="border-2 border-ink bg-card p-6 sm:p-8 poster-shadow relative">
      {/* Top ticket header */}
      <div className="flex items-center justify-between border-b-2 border-dashed border-ink/25 pb-4 mb-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-vermilion font-bold block">
            {mode === "login" ? "LOKET MASUK // ANGGOTA" : "CETAK KARTU ANGGOTA"}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
            {mode === "login" ? (
              <>
                Selamat datang{" "}
                <span className="font-serif italic font-normal text-vermilion">
                  kembali.
                </span>
              </>
            ) : (
              <>
                Ambil{" "}
                <span className="font-serif italic font-normal text-vermilion">
                  karcis
                </span>{" "}
                pertamamu.
              </>
            )}
          </h2>
        </div>
        <div className="hidden sm:flex flex-col items-end font-mono text-[10px] text-ink-muted">
          <span>SERI: KRC-26</span>
          <span>GATE: A1</span>
        </div>
      </div>

      {/* Alerts */}
      {(state.error || githubError) && (
        <div
          role="alert"
          className="mb-5 border-2 border-destructive bg-destructive/10 p-3.5 text-xs font-mono text-destructive flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{state.error || githubError}</span>
        </div>
      )}

      {state.success && (
        <div
          role="status"
          className="mb-5 border-2 border-pine bg-pine/10 p-3.5 text-xs font-mono text-pine flex items-start gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{state.success}</span>
        </div>
      )}

      {/* 1-Click GitHub OAuth */}
      <Button
        type="button"
        variant="secondary"
        className="w-full mb-5"
        onClick={handleGithubLogin}
        disabled={isGithubLoading || isPending}
      >
        {isGithubLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Github className="w-4 h-4" />
        )}
        <span>
          {mode === "login"
            ? "Masuk Cepat dengan GitHub"
            : "Daftar 1-Klik lewat GitHub"}
        </span>
      </Button>

      <div className="relative flex py-2 items-center mb-5">
        <div className="grow border-t border-dashed border-ink/25" />
        <span className="shrink mx-3 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          ATAU PAKAI EMAIL
        </span>
        <div className="grow border-t border-dashed border-ink/25" />
      </div>

      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {mode === "register" && (
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nama Lengkap (Tercetak di Tiket)</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Mis. Raka Pradipta"
              required
              autoComplete="name"
            />
            {state.fieldErrors?.fullName && (
              <p className="font-mono text-xs text-destructive">
                {state.fieldErrors.fullName[0]}
              </p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Alamat Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="kamu@domain.id"
            required
            autoComplete="email"
          />
          {state.fieldErrors?.email && (
            <p className="font-mono text-xs text-destructive">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Kata Sandi</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 6 karakter"
            required
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
          {state.fieldErrors?.password && (
            <p className="font-mono text-xs text-destructive">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isPending || isGithubLoading}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : mode === "login" ? (
            "Masuk & Buka Loket"
          ) : (
            "Cetak Akun Sekarang"
          )}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t-2 border-dashed border-ink/25 text-center text-sm">
        {mode === "login" ? (
          <p className="text-ink-muted">
            Belum punya akun KARCIS?{" "}
            <Link
              href={`/register${
                redirectTo !== "/"
                  ? `?redirect=${encodeURIComponent(redirectTo)}`
                  : ""
              }`}
              className="font-bold text-ink underline decoration-vermilion decoration-2 underline-offset-4 hover:text-vermilion"
            >
              Daftar gratis di sini
            </Link>
          </p>
        ) : (
          <p className="text-ink-muted">
            Sudah punya akun?{" "}
            <Link
              href={`/login${
                redirectTo !== "/"
                  ? `?redirect=${encodeURIComponent(redirectTo)}`
                  : ""
              }`}
              className="font-bold text-ink underline decoration-vermilion decoration-2 underline-offset-4 hover:text-vermilion"
            >
              Langsung masuk
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

