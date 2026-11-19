"use client";

import * as React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import type { EventItem } from "@/types/database";
import { formatEventDate, formatEventTime } from "@/lib/utils";

export function ScheduleCarousel({ events }: { events: EventItem[] }) {
  const swiperRef = React.useRef<SwiperType | null>(null);

  return (
    <div className="schedule-carousel">
      <button
        className="sched-arrow sched-prev"
        type="button"
        aria-label="Previous"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <svg viewBox="0 0 16 28" fill="none" aria-hidden="true">
          <path
            d="M14 2 2 14l12 12"
            stroke="#2867a6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="sched-viewport">
        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          slidesPerView={4}
          spaceBetween={30}
          loop={events.length > 4}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 14 },
            600: { slidesPerView: 2, spaceBetween: 20 },
            1080: { slidesPerView: 3, spaceBetween: 24 },
            1200: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {events.map((e) => {
            const ended = e.status === "ended";
            return (
              <SwiperSlide key={e.id}>
                <article className={`tour-card${ended ? " is-locked" : ""}`}>
                  <div className="tour-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.cover_url || ""} alt={e.title} />
                  </div>
                  <div className="tour-body">
                    <span className="tour-time">{formatEventDate(e.starts_at)}</span>
                    <span className="tour-name">
                      <svg className="pin" viewBox="0 0 8 12" aria-hidden="true">
                        <path
                          d="M4 0C1.8 0 0 1.8 0 4c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4Z"
                          fill="#272727"
                        />
                        <circle cx="4" cy="4" r="1.4" fill="#f4f4f4" />
                      </svg>
                      {e.title}
                    </span>
                    <p className="tour-desc">
                      <span className="cat">[{e.city}]</span>
                      {e.venue}
                      <br />
                      Doors {formatEventTime(e.starts_at)}
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="tour-stars"
                      src="/newtix/home/2_Schedule/5Stars.png"
                      alt="5 stars"
                    />
                    <Link className="tour-start" href={`/events/${e.slug}`}>
                      {ended ? "View Archive" : "Get Ticket"}
                    </Link>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <button
        className="sched-arrow sched-next"
        type="button"
        aria-label="Next"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <svg viewBox="0 0 16 28" fill="none" aria-hidden="true" style={{ transform: "scaleX(-1)" }}>
          <path
            d="M14 2 2 14l12 12"
            stroke="#2867a6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
