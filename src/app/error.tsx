"use client";

import * as React from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="kk">
      <div className="gate">
        <div className="gate-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/newtix/home/5_Map/Pin4.png" alt="" style={{ width: 38, marginBottom: 12 }} />
          <h1 className="gate-title">
            Something <span className="accent">went wrong</span>
          </h1>
          <p className="gate-text">
            {error.message ||
              "The ticket machine is taking a short break. Don't worry, your tickets are safe."}
          </p>
          <button type="button" className="gate-btn" onClick={() => reset()}>
            Try again
          </button>
          <p className="gate-back">
            <Link href="/">&laquo; Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
