import {
  createClient,
  isServerSupabaseConfigured,
} from "@/lib/supabase/server";
import { FALLBACK_CATEGORIES, FALLBACK_EVENTS } from "@/lib/fallback-data";
import type { Category, EventItem, Profile } from "@/types/database";

export async function getCurrentUserAndProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  if (!isServerSupabaseConfigured()) {
    return { user: null, profile: null };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, profile: null };

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      user: { id: user.id, email: user.email },
      profile: (profile as Profile) || null,
    };
  } catch {
    return { user: null, profile: null };
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isServerSupabaseConfigured()) {
    return FALLBACK_CATEGORIES;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getFeaturedEvents(limit = 6): Promise<EventItem[]> {
  const getFallbackFeatured = () => {
    const published = FALLBACK_EVENTS.filter((e) => e.status === "published");
    const ended = FALLBACK_EVENTS.filter((e) => e.status === "ended");
    return [...published, ...ended].slice(0, limit);
  };

  if (!isServerSupabaseConfigured()) {
    return getFallbackFeatured();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*, categories(*), ticket_types(*)")
      .in("status", ["published", "ended"])
      .order("starts_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return getFallbackFeatured();
    }
    return data as EventItem[];
  } catch {
    return getFallbackFeatured();
  }
}

export async function getFilteredEvents(params: {
  category?: string;
  q?: string;
  city?: string;
  tab?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  events: EventItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  const page = Math.max(1, params.page || 1);
  const pageSize = params.pageSize || 6;
  const categorySlug = params.category?.trim() || "";
  const searchQuery = params.q?.trim().toLowerCase() || "";
  const cityFilter = params.city?.trim().toLowerCase() || "";
  const tabFilter = params.tab?.trim().toLowerCase() || "all";

  const filterFallback = () => {
    const filtered = FALLBACK_EVENTS.filter((ev) => {
      if (tabFilter === "archive" && ev.status !== "ended") return false;
      if (tabFilter === "upcoming" && ev.status !== "published") return false;
      if (
        tabFilter !== "archive" &&
        tabFilter !== "upcoming" &&
        ev.status !== "published" &&
        ev.status !== "ended"
      ) {
        return false;
      }
      if (categorySlug && ev.categories?.slug !== categorySlug) return false;
      if (cityFilter && ev.city.toLowerCase() !== cityFilter) return false;
      if (
        searchQuery &&
        !ev.title.toLowerCase().includes(searchQuery) &&
        !ev.venue.toLowerCase().includes(searchQuery) &&
        !ev.city.toLowerCase().includes(searchQuery)
      ) {
        return false;
      }
      return true;
    });

    // Sort order: jika arsip, urutkan tanggal terbaru ke terlama; jika upcoming, urutkan terdekat
    filtered.sort((a, b) => {
      if (tabFilter === "archive") {
        return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
      }
      if (tabFilter === "upcoming") {
        return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
      }
      // "all": published dulu baru ended
      if (a.status !== b.status) {
        return a.status === "published" ? -1 : 1;
      }
      return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
    });

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const start = (page - 1) * pageSize;
    return {
      events: filtered.slice(start, start + pageSize),
      totalCount,
      totalPages,
      currentPage: page,
    };
  };

  if (!isServerSupabaseConfigured()) {
    return filterFallback();
  }

  try {
    const supabase = await createClient();

    let categoryIdFilter: string | null = null;
    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (cat) {
        categoryIdFilter = cat.id;
      } else {
        return { events: [], totalCount: 0, totalPages: 1, currentPage: page };
      }
    }

    let query = supabase
      .from("events")
      .select("*, categories(*), ticket_types(*)", { count: "exact" });

    if (tabFilter === "archive") {
      query = query.eq("status", "ended").order("starts_at", { ascending: false });
    } else if (tabFilter === "upcoming") {
      query = query.eq("status", "published").order("starts_at", { ascending: true });
    } else {
      query = query.in("status", ["published", "ended"]).order("starts_at", { ascending: false });
    }

    if (categoryIdFilter) {
      query = query.eq("category_id", categoryIdFilter);
    }

    if (cityFilter) {
      query = query.ilike("city", cityFilter);
    }

    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,venue.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`
      );
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, count, error } = await query.range(from, to);

    if (error || !data) {
      return filterFallback();
    }

    const totalCount = count ?? data.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      events: data as EventItem[],
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch {
    return filterFallback();
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  if (!isServerSupabaseConfigured()) {
    return FALLBACK_EVENTS.find((ev) => ev.slug === slug) || null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*, categories(*), ticket_types(*)")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return FALLBACK_EVENTS.find((ev) => ev.slug === slug) || null;
    }
    return data as EventItem;
  } catch {
    return FALLBACK_EVENTS.find((ev) => ev.slug === slug) || null;
  }
}

