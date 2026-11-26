import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  if (amount === 0) return "GRATIS";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatEventTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function formatStubDate(dateStr: string): {
  day: string;
  month: string;
  weekday: string;
} {
  const date = new Date(dateStr);
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("id-ID", { month: "short" })
      .format(date)
      .toUpperCase(),
    weekday: new Intl.DateTimeFormat("id-ID", { weekday: "short" })
      .format(date)
      .toUpperCase(),
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeImageUrl(rawUrl: string): string {
  const url = rawUrl.trim();
  if (!url) return "";

  // Auto-convert Google Drive share links to direct image URLs
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (fileMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }
  const idMatch = url.match(/drive\.google\.com\/(?:open|uc)\?.*[?&]?id=([^&#]+)/i);
  if (idMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return url;
}

