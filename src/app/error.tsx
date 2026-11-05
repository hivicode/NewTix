"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full border-2 border-ink bg-card p-8 poster-shadow ticket-notch-horizontal text-center space-y-5">
        <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-ink bg-vermilion text-white mx-auto -rotate-6">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-vermilion block">
            KERTAS MACET DI MESIN CETAK // ERROR
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Ada gangguan{" "}
            <span className="font-serif italic font-normal text-vermilion">
              teknis sebentar.
            </span>
          </h1>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed">
          {error.message ||
            "Mesin loket kami mengalami kendala saat memuat halaman ini. Tenang, karcis yang sudah dibeli tetap aman di akunmu."}
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

