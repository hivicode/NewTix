"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut,
  ShieldCheck,
  Menu,
  X,
  User as UserIcon,
  QrCode,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NewTixLogo } from "@/components/shared/y2k-stickers";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";
import type { Profile } from "@/types/database";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}

export function Navbar({ user, profile }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "Teman NewTix";
  const initials = displayName.slice(0, 2).toUpperCase();
  const isAdmin = profile?.role === "admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-ink bg-background/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-18">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group inline-flex items-center">
            <NewTixLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/events"
              className={cn(
                "px-3.5 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-colors min-h-[40px] inline-flex items-center border-2",
                pathname.startsWith("/events")
                  ? "bg-denim text-white border-ink poster-shadow-sm"
                  : "border-transparent text-ink hover:bg-cloud-subtle"
              )}
            >
              Jelajah Acara
            </Link>
            {user && (
              <Link
                href="/my-tickets"
                className={cn(
                  "px-3.5 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-colors min-h-[40px] inline-flex items-center gap-1.5 border-2",
                  pathname.startsWith("/my-tickets")
                    ? "bg-bubblegum text-[#14121F] border-ink poster-shadow-sm"
                    : "border-transparent text-ink hover:bg-cloud-subtle"
                )}
              >
                <QrCode className="w-3.5 h-3.5 text-denim" />
                Tiketku
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "px-3.5 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-colors min-h-[40px] inline-flex items-center gap-1.5 border-2",
                  pathname.startsWith("/admin")
                    ? "bg-butter text-[#14121F] border-ink poster-shadow-sm"
                    : "border-transparent text-denim hover:bg-cloud-subtle"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Ruang Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-ink bg-card px-3 py-1.5 min-h-[44px] poster-shadow-sm hover:bg-cloud-subtle transition-colors cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={displayName}
                    width={26}
                    height={26}
                    className="w-6.5 h-6.5 rounded-full object-cover border border-ink"
                  />
                ) : (
                  <span className="inline-flex items-center justify-center w-6.5 h-6.5 rounded-full bg-bubblegum text-[#14121F] font-mono text-xs font-bold border border-ink">
                    {initials}
                  </span>
                )}
                <span className="hidden sm:inline font-mono text-xs font-bold truncate max-w-[130px]">
                  {displayName}
                </span>
                {isAdmin && (
                  <span className="hidden lg:inline rounded-full bg-butter text-[#14121F] border border-ink font-mono text-[10px] px-2 py-0.5 uppercase font-bold">
                    ADMIN
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-lg border-2 border-ink bg-card p-2 poster-shadow z-50">
                  <div className="px-3 py-2 border-b border-dashed border-ink/25 mb-1">
                    <p className="font-bold text-sm truncate">{displayName}</p>
                    <p className="font-mono text-[11px] text-ink-muted truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/my-tickets"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-cloud-subtle transition-colors min-h-[44px]"
                  >
                    <QrCode className="w-4 h-4 text-denim" />
                    Album Tiketku
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-denim font-bold hover:bg-cloud-subtle transition-colors min-h-[44px]"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Dashboard Admin
                    </Link>
                  )}
                  <form
                    action={signOutAction}
                    className="mt-1 pt-1 border-t border-dashed border-ink/25"
                  >
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-destructive hover:bg-destructive/10 transition-colors min-h-[44px] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar Akun
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Gabung</Link>
              </Button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Buka menu navigasi"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t-2 border-ink bg-card px-4 py-5 space-y-3">
          <Link
            href="/events"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between rounded-md border-2 border-ink px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider bg-background"
          >
            <span>Jelajah Acara</span>
            <span>→</span>
          </Link>
          {user ? (
            <>
              <Link
                href="/my-tickets"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-md border-2 border-ink px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider bg-background"
              >
                <span>Album Tiketku</span>
                <QrCode className="w-4 h-4 text-denim" />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-md border-2 border-ink px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider bg-denim text-white"
                >
                  <span>Ruang Admin</span>
                  <ShieldCheck className="w-4 h-4" />
                </Link>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <Button
                asChild
                variant="outline"
                onClick={() => setMenuOpen(false)}
              >
                <Link href="/login">
                  <UserIcon className="w-4 h-4" />
                  Masuk
                </Link>
              </Button>
              <Button asChild onClick={() => setMenuOpen(false)}>
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-ink/20 font-mono text-xs text-ink-muted">
            <span className="font-bold uppercase tracking-wider text-ink">Mode Tampilan</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
