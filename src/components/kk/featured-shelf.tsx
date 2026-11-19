"use client";

import * as React from "react";
import Link from "next/link";
import type { EventItem } from "@/types/database";

export function FeaturedShelf({ events }: { events: EventItem[] }) {
  const [active, setActive] = React.useState(0);
  const list = events.slice(0, 6);
  const cur = list[active];

  return (
    <>
      <div className="guides-display">
        <div className="display-inner">
          {list.map((e, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={e.id}
              className={i === active ? "active" : ""}
              src={e.cover_url || ""}
              alt={e.title}
              style={{ objectFit: "cover" }}
            />
          ))}
        </div>
      </div>
      {cur && (
        <p style={{ textAlign: "center", marginTop: 14, fontSize: 14, fontWeight: 600 }}>
          <Link href={`/events/${cur.slug}`} style={{ color: "#2867a6" }}>
            {cur.title} &raquo;
          </Link>
        </p>
      )}
      <div className="guides-shelf">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="shelf-bg" src="/newtix/home/4_Tour%20Guide/Shelves.png" alt="" />
        <div className="thumbs">
          {list.map((e, i) => (
            <button
              key={e.id}
              className={`guide-thumb${i === active ? " active" : ""}`}
              type="button"
              aria-label={e.title}
              onClick={() => setActive(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.cover_url || ""} alt={e.title} style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
