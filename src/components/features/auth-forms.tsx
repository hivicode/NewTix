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
import { Github, Loader2 } from "lucide-react";

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
  const [oauthLoading, setOauthLoading] = React.useState<"google" | "github" | null>(null);
  const [oauthErr, setOauthErr] = React.useState<string | null>(
    oauthError
      ? "OAuth authentication failed or was cancelled. Please try again."
      : null
  );

  async function handleOAuthLogin(provider: "google" | "github") {
    setOauthErr(null);
    if (!isSupabaseConfigured()) {
      setOauthErr(
        "Supabase is not configured in .env.local yet. Please add your URL & Anon Key."
      );
      return;
    }
    try {
      setOauthLoading(provider);
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
            redirectTo
          )}`,
        },
      });
      if (error) {
        setOauthErr(`Failed to connect to ${provider === "google" ? "Google" : "GitHub"}: ${error.message}`);
        setOauthLoading(null);
      }
    } catch {
      setOauthErr(`An error occurred while connecting to ${provider === "google" ? "Google" : "GitHub"} OAuth.`);
      setOauthLoading(null);
    }
  }

  const err = state.error || oauthErr;
  const other = mode === "login" ? "register" : "login";
  const otherHref = `/${other}${
    redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""
  }`;

  return (
    <div className="gate-card">
      <div className="kk-logo gate-logo">
        <span className="kk-logo-main">
          New<b>Tix</b>
          <i aria-hidden="true">★</i>
        </span>
        <span className="kk-logo-sub">ONLINE TICKETING</span>
      </div>

      <h1 className="gate-title">
        {mode === "login" ? (
          <>
            Member <span className="accent">Sign In</span>
          </>
        ) : (
          <>
            Create <span className="accent">Account</span>
          </>
        )}
      </h1>
      <p className="gate-text" style={{ marginBottom: 18 }}>
        {mode === "login"
          ? "Sign in to see your tickets and QR passes."
          : "Join NewTix and book your next show."}
      </p>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          type="button"
          className="gate-btn gate-btn-alt"
          onClick={() => handleOAuthLogin("google")}
          disabled={oauthLoading !== null || isPending}
        >
          {oauthLoading === "google" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {mode === "login" ? "Continue with Google" : "Sign up with Google"}
        </button>

        <button
          type="button"
          className="gate-btn gate-btn-alt"
          onClick={() => handleOAuthLogin("github")}
          disabled={oauthLoading !== null || isPending}
        >
          {oauthLoading === "github" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Github size={16} />
          )}
          {mode === "login" ? "Continue with GitHub" : "Sign up with GitHub"}
        </button>
      </div>

      <div className="gate-or">or with email</div>

      <form
        action={formAction}
        noValidate
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {mode === "register" && (
          <div className="gate-field">
            <label className="gate-label" htmlFor="fullName">
              Full Name (printed on ticket)
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Nadia Putri"
              autoComplete="name"
              className="gate-input"
            />
            {state.fieldErrors?.fullName && (
              <p className="gate-fielderr">{state.fieldErrors.fullName[0]}</p>
            )}
          </div>
        )}

        <div className="gate-field">
          <label className="gate-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="gate-input"
          />
          {state.fieldErrors?.email && (
            <p className="gate-fielderr">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="gate-field">
          <label className="gate-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Minimum 6 characters"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="gate-input"
          />
          {state.fieldErrors?.password && (
            <p className="gate-fielderr">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          className="gate-btn"
          style={{ marginTop: 20 }}
          disabled={isPending || oauthLoading !== null}
        >
          {isPending
            ? "Processing..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>

      {err && (
        <p className="gate-error" role="alert">
          {err}
        </p>
      )}
      {state.success && (
        <p className="gate-ok" role="status">
          {state.success}
        </p>
      )}

      <p className="gate-switch">
        {mode === "login" ? "No account yet? " : "Already a member? "}
        <Link href={otherHref}>
          {mode === "login" ? "Register free" : "Sign in"}
        </Link>
      </p>
      <p className="gate-back">
        <Link href="/">&laquo; Back to home</Link>
      </p>
    </div>
  );
}
