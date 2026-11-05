import Link from "next/link";
import {
  BarChart3,
  CalendarPlus,
  FolderKanban,
  ArrowLeft,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getCurrentUserAndProfile } from "@/lib/queries";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentUserAndProfile();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left Sidebar */}
      <aside className="lg:col-span-3 xl:col-span-2 border-b-2 lg:border-b-0 lg:border-r-2 border-ink bg-card p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 font-display text-xl font-extrabold tracking-tight"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 bg-vermilion text-white border-2 border-ink">
                <Ticket className="w-4 h-4 -rotate-12" />
              </span>
              <span>KARCIS // ADMIN</span>
            </Link>
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>

          <div className="border-2 border-ink bg-paper-subtle p-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-vermilion font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MEJA OPERATOR</span>
            </div>
            <p className="truncate font-bold text-ink mt-1">
              {profile?.full_name || user?.email || "Operator KARCIS"}
            </p>
          </div>

          <nav className="space-y-1.5 font-mono text-xs font-bold uppercase tracking-wider">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3.5 py-3 border-2 border-ink bg-background hover:bg-vermilion hover:text-white transition-colors min-h-[44px]"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ringkasan & Live</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center gap-2.5 px-3.5 py-3 border-2 border-ink bg-background hover:bg-vermilion hover:text-white transition-colors min-h-[44px]"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Kelola Acara</span>
            </Link>
            <Link
              href="/admin/events/new"
              className="flex items-center gap-2.5 px-3.5 py-3 border-2 border-ink bg-mustard text-[#141210] hover:bg-vermilion hover:text-white transition-colors min-h-[44px]"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>+ Cetak Acara Baru</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 mt-6 border-t-2 border-dashed border-ink/25 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:text-vermilion min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Ke Loket Publik
          </Link>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-9 xl:col-span-10 p-5 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}

