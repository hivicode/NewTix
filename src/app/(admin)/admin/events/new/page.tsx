import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { AdminEventForm } from "@/components/features/admin-event-form";

export const metadata: Metadata = {
  title: "Buat Acara Baru",
};

export default async function AdminNewEventPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="link-blue inline-flex items-center gap-1.5 text-[13px] font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Acara
        </Link>
        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-black mt-2">
          Buat Acara <span className="text-[#2867a6]">Baru</span>
        </h1>
      </div>

      <AdminEventForm mode="create" categories={categories} />
    </div>
  );
}
