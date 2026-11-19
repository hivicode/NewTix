"use client";

import * as React from "react";
import Link from "next/link";
import type { EventItem } from "@/types/database";
import { formatEventDate } from "@/lib/utils";

const pinPos = [
  [76.7, 65.3],
  [64.6, 56.9],
  [28.3, 29.2],
  [70.7, 22],
  [34.8, 73.3],
  [27.7, 58.7],
];
const weather = [
  ["Weather_SunCloudy", "Nice"],
  ["Weather_Sunny", "Sunny"],
  ["Weather_Sunny", "Sunniest"],
  ["Weather_Rain", "Rainy"],
  ["Weather_Cloudy", "Dark & Glowy"],
  ["Weather_Night", "Blue"],
];

export function MapSection({ events }: { events: EventItem[] }) {
  const list = events.slice(0, 6);
  const [hl, setHl] = React.useState<number | null>(null);

  return (
    <div className="map-wrap">
      <div className="map-panel">
        <div className="panel-head">Location</div>
        <ul className="loc-list">
          {list.map((e, i) => (
            <li
              key={e.id}
              className={`loc-row${hl === i ? " highlight" : ""}`}
              onMouseEnter={() => setHl(i)}
              onMouseLeave={() => setHl(null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="loc-pin"
                src={`/newtix/home/5_Map/Pin${i + 1}.png`}
                alt=""
              />
              <div className="loc-info">
                <span className="loc-name">{e.title}</span>
                <span className="loc-meta">
                  {formatEventDate(e.starts_at)} at {e.venue}, {e.city}
                </span>
                <span className="loc-weather">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/newtix/home/5_Map/${weather[i][0]}.png`} alt="" />
                  Weather: {weather[i][1]}
                </span>
              </div>
              <Link className="tour-now" href={`/events/${e.slug}`}>
                {e.status === "ended" ? "Archive" : "Get Ticket"}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="map-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="island" src="/newtix/home/5_Map/Map.png" alt="Map of NewTix" />
        {list.map((e, i) => (
          <span
            key={e.id}
            className={`map-pin${hl === i ? " floating" : ""}`}
            style={{ left: `${pinPos[i][0]}%`, top: `${pinPos[i][1]}%` }}
            onMouseEnter={() => setHl(i)}
            onMouseLeave={() => setHl(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/newtix/home/5_Map/Pin${i + 1}.png`} alt="" />
          </span>
        ))}
      </div>
    </div>
  );
}
