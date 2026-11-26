import Link from "next/link";
import {
  BarChart3,
  CalendarPlus,
  FolderKanban,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo, GlossLink, StatusBadge } from "@/components/atoms";
import { getCurrentUserAndProfile } from "@/lib/queries";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUserAndProfile();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#f8fbfe] text-[#1b1b1b]">
      {/* Left Sidebar — synced with NewTix Web 2.0 aesthetic */}
      <aside className="lg:col-span-3 xl:col-span-2 border-b lg:border-b-0 lg:border-r border-[#d4d4d4] bg-gradient-to-b from-[#f4f4f4] to-[#edf9ff] p-5 flex flex-col justify-between shadow-[2px_0_8px_rgba(0,0,0,0.06)]">
        <div className="space-y-5">
          <div className="flex items-center justify-center border border-[#dcdcdc] bg-white py-3.5 px-3 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
            <Link href="/admin" className="no-underline">
              <BrandLogo size="sm" />
            </Link>
          </div>

          <div className="border border-[#d8eaf6] bg-white p-3 text-xs shadow-[inset_0_0_8px_#edf9ff]">
            <div className="flex items-center justify-between gap-1.5">
              <span className="inline-flex items-center gap-1 text-[#2867a6] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMIN PANEL
              </span>
              <StatusBadge $tone="info">STAFF</StatusBadge>
            </div>
            <p className="truncate font-bold text-black mt-1.5">
              {profile?.full_name || user?.email || "Operator NewTix"}
            </p>
          </div>

          <nav className="space-y-2 text-[13px] font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 border border-[#c9c9c9] bg-white px-3.5 py-2.5 text-[#1b1b1b] hover:bg-[#e7f1fb] hover:border-[#2867a6] hover:text-[#2867a6] transition-colors no-underline shadow-[inset_0_1px_0_#fff]"
            >
              <BarChart3 className="w-4 h-4 text-[#2867a6]" />
              <span>Ringkasan &amp; Live</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center gap-2.5 border border-[#c9c9c9] bg-white px-3.5 py-2.5 text-[#1b1b1b] hover:bg-[#e7f1fb] hover:border-[#2867a6] hover:text-[#2867a6] transition-colors no-underline shadow-[inset_0_1px_0_#fff]"
            >
              <FolderKanban className="w-4 h-4 text-[#2867a6]" />
              <span>Kelola Acara</span>
            </Link>
            <div className="pt-1">
              <GlossLink href="/admin/events/new" $variant="orange" $size="md" $fullWidth>
                <CalendarPlus className="w-4 h-4" />
                <span>+ Acara Baru</span>
              </GlossLink>
            </div>
          </nav>
        </div>

        <div className="pt-4 mt-6 border-t border-[#d8eaf6]">
          <GlossLink href="/" $variant="silver" $size="sm" $fullWidth>
            <ArrowLeft className="w-3.5 h-3.5" />
            Ke Halaman Publik
          </GlossLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-9 xl:col-span-10 p-5 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
