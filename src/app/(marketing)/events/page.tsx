import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TicketEventCard } from "@/components/shared/ticket-event-card";
import { getCategories, getFilteredEvents } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Jelajah Acara & Konser Seru",
  description:
    "Daftar lengkap konser independen, lokakarya kreatif, diskusi teknologi, dan festival kuliner di NewTix.",
};

export default async function EventsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    city?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const currentCategory = params.category || "";
  const currentQuery = params.q || "";
  const currentCity = params.city || "";
  const currentPage = Math.max(1, Number(params.page || "1") || 1);

  const [categories, result] = await Promise.all([
    getCategories(),
    getFilteredEvents({
      category: currentCategory,
      q: currentQuery,
      city: currentCity,
      page: currentPage,
      pageSize: 6,
    }),
  ]);

  const cities = ["Bandung", "Jakarta", "Yogyakarta", "Surabaya", "Denpasar"];

  function buildFilterHref(overrides: {
    category?: string;
    q?: string;
    city?: string;
    page?: number;
  }) {
    const sp = new URLSearchParams();
    const cat =
      overrides.category !== undefined ? overrides.category : currentCategory;
    const q = overrides.q !== undefined ? overrides.q : currentQuery;
    const city = overrides.city !== undefined ? overrides.city : currentCity;
    const page = overrides.page !== undefined ? overrides.page : 1;

    if (cat) sp.set("category", cat);
    if (q) sp.set("q", q);
    if (city) sp.set("city", city);
    if (page > 1) sp.set("page", String(page));

    const queryString = sp.toString();
    return queryString ? `/events?${queryString}` : "/events";
  }

  const hasActiveFilters = Boolean(
    currentCategory || currentQuery || currentCity
  );

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Header */}
      <div className="border-b-2 border-ink pb-8 mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
            KATALOG ACARA // NEWTIX
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">
            Cari tiket{" "}
            <span className="font-serif italic font-semibold text-denim">
              akhir pekanmu.
            </span>
          </h1>
        </div>

        {/* URL Search Form */}
        <form
          action="/events"
          method="GET"
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto"
        >
          {currentCategory && (
            <input type="hidden" name="category" value={currentCategory} />
          )}
          {currentCity && (
            <input type="hidden" name="city" value={currentCity} />
          )}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="search"
              name="q"
              defaultValue={currentQuery}
              placeholder="Cari judul gigs, venue, atau kota..."
              className="pl-10"
            />
          </div>
          <Button type="submit">Cari Tiket</Button>
        </form>
      </div>

      {/* Category & City Filter Pills (URL as State) */}
      <div className="space-y-4 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-ink-muted mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-denim" />
            Kategori:
          </span>

          <Link
            href={buildFilterHref({ category: "", page: 1 })}
            className={cn(
              "px-3.5 py-2 rounded-full border-2 border-ink font-mono text-xs font-bold uppercase tracking-wider transition-colors min-h-[40px] inline-flex items-center",
              !currentCategory
                ? "bg-denim text-white poster-shadow-sm"
                : "bg-card text-ink hover:bg-cloud-subtle"
            )}
          >
            Semua ({result.totalCount})
          </Link>

          {categories.map((cat) => {
            const active = currentCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={buildFilterHref({
                  category: active ? "" : cat.slug,
                  page: 1,
                })}
                className={cn(
                  "px-3.5 py-2 rounded-full border-2 border-ink font-mono text-xs font-bold uppercase tracking-wider transition-colors min-h-[40px] inline-flex items-center gap-1.5",
                  active
                    ? "bg-bubblegum text-[#14121F] poster-shadow-sm"
                    : "bg-card text-ink hover:bg-cloud-subtle"
                )}
              >
                <span aria-hidden="true">{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>

        {/* City Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted mr-2">
            Kota:
          </span>
          {cities.map((city) => {
            const active = currentCity.toLowerCase() === city.toLowerCase();
            return (
              <Link
                key={city}
                href={buildFilterHref({
                  city: active ? "" : city,
                  page: 1,
                })}
                className={cn(
                  "px-3 py-1.5 rounded-full border border-ink font-mono text-xs uppercase tracking-wider transition-colors min-h-[38px] inline-flex items-center",
                  active
                    ? "bg-butter text-[#14121F] font-bold border-2"
                    : "bg-background text-ink-muted hover:text-ink"
                )}
              >
                {city}
              </Link>
            );
          })}

          {hasActiveFilters && (
            <Link
              href="/events"
              className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-destructive hover:underline min-h-[38px]"
            >
              <X className="w-3.5 h-3.5" />
              Bersihkan Filter
            </Link>
          )}
        </div>
      </div>

      {/* Event Grid */}
      {result.events.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-ink bg-card p-12 text-center my-8">
          <p className="font-mono text-xs uppercase tracking-widest text-denim mb-2">
            BELUM KETEMU // 0 HASIL
          </p>
          <h2 className="font-display text-2xl font-extrabold mb-2">
            Belum ada acara yang cocok sama pencarianmu.
          </h2>
          <p className="text-sm text-ink-muted max-w-md mx-auto mb-6">
            Coba ganti kata kunci atau pilih kota dan kategori lainnya ya!
          </p>
          <Button asChild variant="outline">
            <Link href="/events">Tampilkan Semua Acara</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {result.events.map((event, idx) => (
              <TicketEventCard key={event.id} event={event} index={idx} />
            ))}
          </div>

          {/* Pagination via URL searchParams */}
          {result.totalPages > 1 && (
            <nav
              aria-label="Navigasi halaman acara"
              className="mt-12 pt-8 border-t-2 border-dashed border-ink/25 flex items-center justify-between gap-4"
            >
              <div className="font-mono text-xs text-ink-muted">
                Halaman{" "}
                <strong className="text-ink">{result.currentPage}</strong> dari{" "}
                <strong className="text-ink">{result.totalPages}</strong> (Total{" "}
                {result.totalCount} acara)
              </div>

              <div className="flex items-center gap-2">
                {result.currentPage > 1 && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={buildFilterHref({ page: result.currentPage - 1 })}
                    >
                      ← Sebelumnya
                    </Link>
                  </Button>
                )}

                {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={buildFilterHref({ page: p })}
                      className={cn(
                        "w-11 h-11 rounded-md border-2 border-ink font-mono text-xs font-bold inline-flex items-center justify-center transition-colors",
                        p === result.currentPage
                          ? "bg-denim text-white poster-shadow-sm"
                          : "bg-card text-ink hover:bg-cloud-subtle"
                      )}
                    >
                      {p}
                    </Link>
                  )
                )}

                {result.currentPage < result.totalPages && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={buildFilterHref({ page: result.currentPage + 1 })}
                    >
                      Berikutnya →
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
