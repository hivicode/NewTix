import { Skeleton } from "@/components/ui/skeleton";
import { BunnyMascot } from "@/components/shared/y2k-stickers";

export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-4 border-b-2 border-ink pb-6">
        <div className="rounded-full border-2 border-ink bg-bubblegum p-2 poster-shadow-sm animate-bounce">
          <BunnyMascot mood="happy" className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-denim">
            TUNGGU SEBENTAR YA ★ LAGI MENYIAPKAN TIKETMU...
          </p>
          <Skeleton className="h-9 w-64 sm:w-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row rounded-xl border-2 border-ink bg-card p-5 gap-5 poster-shadow"
          >
            <Skeleton className="h-24 sm:h-auto sm:w-24 shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-3 border-t border-dashed border-ink/25 flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
