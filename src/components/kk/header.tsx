import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import type { Profile } from "@/types/database";

interface Props {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}

export function KKHeader({ user, profile }: Props) {
  const isAdmin = profile?.role === "admin";
  return (
    <header className="site-header">
      <Link
        className="brand"
        href="/"
        aria-label="NewTix"
        style={{ textDecoration: "none" }}
      >
        <span className="kk-logo">
          <span className="kk-logo-main">
            New<b>Tix</b>
            <i aria-hidden="true">★</i>
          </span>
          <span className="kk-logo-sub">ONLINE TICKETING</span>
        </span>
      </Link>

      <nav className="nav-links">
        <Link href="/events">Events</Link>
        <Link href="/#schedule">Schedule</Link>
        <Link href="/#featured">Featured</Link>
        <Link href="/#map">Map</Link>
        <Link href="/#reviews">Reviews</Link>
        {isAdmin && <Link href="/admin">Admin</Link>}
        {user && (
          <form action={signOutAction} style={{ display: "contents" }}>
            <button
              type="submit"
              style={{
                background: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                color: "#000",
              }}
            >
              Sign Out
            </button>
          </form>
        )}
        <Link
          className="btn-duty-free"
          href={user ? "/my-tickets" : "/login"}
          style={{ textDecoration: "none" }}
        >
          <svg viewBox="0 0 16 17" fill="none" aria-hidden="true">
            <path
              d="M1.5 5h13v2.2a1.8 1.8 0 0 0 0 3.6V13h-13v-2.2a1.8 1.8 0 0 0 0-3.6V5Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M10 5v8" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
          </svg>
          {user ? "My Tickets" : "Sign In"}
        </Link>
      </nav>
    </header>
  );
}
