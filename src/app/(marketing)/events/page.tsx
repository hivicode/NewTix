import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getFilteredEvents } from "@/lib/queries";
import { formatEventDate, formatEventTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse concerts, fan meetings, creative workshops, and festivals on NewTix.",
};

export default async function EventsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    city?: string;
    tab?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const currentCategory = params.category || "";
  const currentQuery = params.q || "";
  const currentCity = params.city || "";
  const currentTab = params.tab || "all";
  const currentPage = Math.max(1, Number(params.page || "1") || 1);

  const [categories, result] = await Promise.all([
    getCategories(),
    getFilteredEvents({
      category: currentCategory,
      q: currentQuery,
      city: currentCity,
      tab: currentTab,
      page: currentPage,
      pageSize: 6,
    }),
  ]);

  const cities = [
    "Jakarta",
    "Bandung",
    "Banyuwangi",
    "Seoul",
    "Tokyo",
    "Osaka",
    "Fukuoka",
  ];

  function buildFilterHref(overrides: {
    category?: string;
    q?: string;
    city?: string;
    tab?: string;
    page?: number;
  }) {
    const sp = new URLSearchParams();
    const cat =
      overrides.category !== undefined ? overrides.category : currentCategory;
    const q = overrides.q !== undefined ? overrides.q : currentQuery;
    const city = overrides.city !== undefined ? overrides.city : currentCity;
    const tab = overrides.tab !== undefined ? overrides.tab : currentTab;
    const page = overrides.page !== undefined ? overrides.page : 1;

    if (tab && tab !== "all") sp.set("tab", tab);
    if (cat) sp.set("category", cat);
    if (q) sp.set("q", q);
    if (city) sp.set("city", city);
    if (page > 1) sp.set("page", String(page));

    const queryString = sp.toString();
    return queryString ? `/events?${queryString}` : "/events";
  }

  const hasActiveFilters = Boolean(
    currentCategory ||
      currentQuery ||
      currentCity ||
      (currentTab && currentTab !== "all")
  );

  return (
    <div className="kk">
      <main className="mx-auto max-w-[1160px] px-5 py-12 sm:py-16">
        <div className="section-head">
          <h2>
            Browse <span className="accent">Events</span>
          </h2>
          <p>Find concerts, fan meetings, and live shows across every city.</p>
        </div>

        {/* Retro Filter Box */}
        <div className="booking-box mt-8 p-4 sm:p-5">
          <form
            action="/events"
            method="GET"
            className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
          >
            {currentTab && currentTab !== "all" && (
              <input type="hidden" name="tab" value={currentTab} />
            )}
            {currentCategory && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            {currentCity && (
              <input type="hidden" name="city" value={currentCity} />
            )}
            <input
              type="search"
              name="q"
              defaultValue={currentQuery}
              placeholder="Search shows, artists, venues..."
              className="field-inset !h-[34px] !text-[13px] flex-1"
            />
            <button
              type="submit"
              className="gloss-orange px-5 py-1.5 text-[14px] font-bold cursor-pointer shrink-0"
            >
              Find Tickets &raquo;
            </button>
          </form>

          {/* Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#d8eaf6] pt-3.5 text-[12px] font-bold">
            <span className="mr-1 text-[#5a5a5a]">Status:</span>
            {[
              ["all", "All Events"],
              ["upcoming", "Live / Upcoming"],
              ["archive", "Archive (Ended)"],
            ].map(([val, label]) => {
              const active = (currentTab || "all") === val;
              return (
                <Link
                  key={val}
                  href={buildFilterHref({ tab: val, page: 1 })}
                  className={`px-3 py-1 ${
                    active ? "gloss-orange" : "gloss-silver"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  {label}
                </Link>
              );
            })}
            {hasActiveFilters && (
              <Link
                href="/events"
                className="ml-auto text-[12px] font-semibold text-[#e0584f]"
              >
                Clear filters &times;
              </Link>
            )}
          </div>

          {/* Categories */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
            <span className="mr-1 font-bold text-[#5a5a5a]">Genre:</span>
            <Link
              href={buildFilterHref({ category: "", page: 1 })}
              className={`border px-2.5 py-1 font-semibold ${
                !currentCategory
                  ? "border-[#2867a6] bg-[#2867a6] text-white"
                  : "border-[#c1c1c1] bg-white text-[#1b1b1b] hover:bg-[#edf9ff]"
              }`}
              style={{ textDecoration: "none" }}
            >
              All ({result.totalCount})
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
                  className={`border px-2.5 py-1 font-semibold ${
                    active
                      ? "border-[#2867a6] bg-[#2867a6] text-white"
                      : "border-[#c1c1c1] bg-white text-[#1b1b1b] hover:bg-[#edf9ff]"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Cities */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[12px]">
            <span className="mr-1 font-bold text-[#5a5a5a]">City:</span>
            {cities.map((city) => {
              const active = currentCity.toLowerCase() === city.toLowerCase();
              return (
                <Link
                  key={city}
                  href={buildFilterHref({
                    city: active ? "" : city,
                    page: 1,
                  })}
                  className={`border px-2.5 py-0.5 font-semibold ${
                    active
                      ? "border-[#2867a6] bg-[#e7f1fb] text-[#2867a6]"
                      : "border-[#d6d6d6] bg-white text-[#5a5a5a] hover:bg-[#edf9ff]"
                  }`}
                  style={{ textDecoration: "none" }}
                >
                  {city}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {result.events.length === 0 ? (
          <div className="booking-box mt-8 p-10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/newtix/home/5_Map/Pin4.png"
              alt=""
              style={{ width: 34, margin: "0 auto 12px", display: "block" }}
            />
            <h3 className="text-[18px] font-bold text-black">
              No matching events found
            </h3>
            <p className="mt-2 text-[13px] text-[#5a5a5a]">
              Try a different keyword, city, or genre filter.
            </p>
            <div className="mt-5">
              <Link
                href="/events"
                className="gloss-orange inline-block px-5 py-2 text-[14px] font-bold"
                style={{ textDecoration: "none" }}
              >
                Show All Events &raquo;
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.events.map((e) => {
                const ended = e.status === "ended";
                return (
                  <article
                    key={e.id}
                    className={`tour-card${ended ? " is-locked" : ""}`}
                  >
                    <div className="tour-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={e.cover_url || ""} alt={e.title} />
                    </div>
                    <div className="tour-body">
                      <span className="tour-time">
                        {formatEventDate(e.starts_at)}
                      </span>
                      <span className="tour-name">
                        <svg
                          className="pin"
                          viewBox="0 0 8 12"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 0C1.8 0 0 1.8 0 4c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4Z"
                            fill="#272727"
                          />
                          <circle cx="4" cy="4" r="1.4" fill="#f4f4f4" />
                        </svg>
                        {e.title}
                      </span>
                      <p className="tour-desc">
                        <span className="cat">[{e.city}]</span>
                        {e.venue}
                        <br />
                        Doors {formatEventTime(e.starts_at)}
                      </p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="tour-stars"
                        src="/newtix/home/2_Schedule/5Stars.png"
                        alt="5 stars"
                      />
                      <Link className="tour-start" href={`/events/${e.slug}`}>
                        {ended ? "View Archive" : "Get Ticket"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {result.totalPages > 1 && (
              <nav
                aria-label="Events pagination"
                className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#d9d9d9] pt-6 text-[13px]"
              >
                <span className="text-[#5a5a5a]">
                  Page <b>{result.currentPage}</b> of <b>{result.totalPages}</b>{" "}
                  ({result.totalCount} events)
                </span>
                <div className="flex items-center gap-2">
                  {result.currentPage > 1 && (
                    <Link
                      href={buildFilterHref({ page: result.currentPage - 1 })}
                      className="gloss-silver px-3 py-1 text-[12px] font-bold"
                      style={{ textDecoration: "none" }}
                    >
                      &laquo; Prev
                    </Link>
                  )}
                  {Array.from(
                    { length: result.totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
                    <Link
                      key={p}
                      href={buildFilterHref({ page: p })}
                      className={`px-3 py-1 text-[12px] font-bold ${
                        p === result.currentPage
                          ? "gloss-orange"
                          : "gloss-silver"
                      }`}
                      style={{ textDecoration: "none" }}
                    >
                      {p}
                    </Link>
                  ))}
                  {result.currentPage < result.totalPages && (
                    <Link
                      href={buildFilterHref({ page: result.currentPage + 1 })}
                      className="gloss-silver px-3 py-1 text-[12px] font-bold"
                      style={{ textDecoration: "none" }}
                    >
                      Next &raquo;
                    </Link>
                  )}
                </div>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
}
