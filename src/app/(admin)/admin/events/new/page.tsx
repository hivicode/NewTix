import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { AdminEventForm } from "@/components/features/admin-event-form";

export const metadata: Metadata = {
  title: "Cetak Acara Baru",
};

export default async function AdminNewEventPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:text-vermilion min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Acara
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
          Cetak Acara{" "}
          <span className="font-serif italic font-normal text-vermilion">
            Baru.
          </span>
        </h1>
      </div>

      <AdminEventForm mode="create" categories={categories} />
    </div>
  );
}

