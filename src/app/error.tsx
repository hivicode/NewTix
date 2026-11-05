"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BunnyMascot } from "@/components/shared/y2k-stickers";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full rounded-2xl border-2 border-ink bg-card p-8 poster-shadow ticket-notch-horizontal text-center space-y-5">
        <div className="inline-flex items-center justify-center rounded-full border-2 border-ink bg-bubblegum p-3 mx-auto -rotate-6 poster-shadow-sm">
          <BunnyMascot mood="dizzy" className="w-14 h-14" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-denim block">
            OOPS // MESIN TIKET LAGI ISTIRAHAT SEBENTAR
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Ada gangguan{" "}
            <span className="font-serif italic font-semibold text-denim">
              kecil nih.
            </span>
          </h1>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">
          {error.message ||
            "Halaman ini lagi agak tersendat. Tenang aja, semua tiket yang sudah kamu beli di NewTix tetap tersimpan aman kok!"}
        </p>

        <div className="pt-4 border-t-2 border-dashed border-ink/25 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => reset()}>
            <RotateCcw className="w-4 h-4" />
            Coba Muat Ulang
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
