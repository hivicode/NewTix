"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface Props {
  categories: { id: string; slug: string; name: string }[];
  cities: string[];
  eventTitles?: string[];
}

export function HeroTicket({ categories, cities, eventTitles = [] }: Props) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [city, setCity] = React.useState("");
  const [cat, setCat] = React.useState("");
  const [tab, setTab] = React.useState("all");
  const [accepted, setAccepted] = React.useState(true);
  const [bad, setBad] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accepted) {
      setBad("accept");
      return;
    }
    setBad(null);
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (city) sp.set("city", city);
    if (cat) sp.set("category", cat);
    if (tab !== "all") sp.set("tab", tab);
    const s = sp.toString();
    router.push(s ? `/events?${s}` : "/events");
  }

  return (
    <section className="hero" id="ticket">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-bg"
        src="/hero-island.jpg"
        alt=""
      />
      <div className="hero-inner">
        <form className="ticket-card" onSubmit={onSubmit} noValidate>
          <div className="ticket-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ticket-title"
              src="/newtix/home/1_Ticket/BookTicketNow.png"
              alt="book ticket now!"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="ticket-arrow"
              src="/newtix/home/1_Ticket/Arrow.png"
              alt=""
            />
          </div>

          <div className="field field-name">
            <label htmlFor="t-name">Event</label>
            <input
              id="t-name"
              type="text"
              list="event-suggestions"
              placeholder="Search event"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <datalist id="event-suggestions">
              {eventTitles.map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
          </div>

          <div className="field field-from">
            <label htmlFor="t-from">City</label>
            <div className="select-wrap">
              <select
                id="t-from"
                className={city === "" ? "placeholder" : ""}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Anywhere</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="caret" aria-hidden="true" />
            </div>
          </div>

          <div className="field field-from">
            <label htmlFor="t-cat">Genre</label>
            <div className="select-wrap">
              <select
                id="t-cat"
                className={cat === "" ? "placeholder" : ""}
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >
                <option value="">All Genres</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="caret" aria-hidden="true" />
            </div>
          </div>

          <div className="field field-type">
            <label>Choose Ticket Type</label>
            <div className="radio-grid">
              {[
                ["all", "All"],
                ["upcoming", "Live"],
                ["archive", "Archive"],
              ].map(([v, l]) => (
                <label className="radio" key={v}>
                  <input
                    type="radio"
                    name="ticket-type"
                    value={v}
                    checked={tab === v}
                    onChange={() => setTab(v)}
                  />
                  <span>{l}</span>
                </label>
              ))}
            </div>
          </div>

          <label
            className="accept"
            style={bad === "accept" ? { outline: "1px solid #e0584f" } : undefined}
          >
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>I accepted that I love live shows.</span>
          </label>

          <button type="submit" className="btn-buy">
            <span className="buy-full">
              Find Tickets <span className="chev">&raquo;</span>
            </span>
            <span className="buy-short">Find Now</span>
          </button>

          <p className="ticket-note">QR Pass Included in the ticket.</p>

          <div className="pay-icons">
            {[1, 2, 3, 4].map((n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={n}
                src={`/newtix/home/1_Ticket/PaymentIcon_${n}.png`}
                alt=""
              />
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
