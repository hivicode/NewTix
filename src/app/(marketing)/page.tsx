import { getCategories, getFeaturedEvents } from "@/lib/queries";
import { HeroTicket } from "@/components/kk/hero-ticket";
import { ScheduleCarousel } from "@/components/kk/schedule-carousel";
import { FeaturedShelf } from "@/components/kk/featured-shelf";
import { MapSection } from "@/components/kk/map-section";

const A = "/newtix/home";

const reviews = [
  ["Zero queue, walked straight in 10/10", 1, "Lee Sumin", "2 hours ago"],
  ["Amazing show, bestest tickets", 2, "King Kya", "8 hours ago"],
  ["Checkout was a breeze\nVery well planned", 3, "TiiiKiii", "10 hours ago"],
  ["QR scanned on the first try,\nwould recommend", 4, "Jiyuuu", "2 secs ago"],
  ["Live quota is actually honest", 5, "anonymous", "1 day ago"],
  ["No double-ticket drama at all", 6, "Rara", "2 hours ago"],
] as const;

export default async function LandingPage() {
  const [categories, events] = await Promise.all([
    getCategories(),
    getFeaturedEvents(6),
  ]);
  const cities = [
    "Jakarta",
    "Bandung",
    "Banyuwangi",
    "Seoul",
    "Tokyo",
    "Osaka",
    "Fukuoka",
  ];

  return (
    <div className="kk">
      <main>
        <HeroTicket
          categories={categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
          cities={cities}
          eventTitles={events.map((e) => e.title)}
        />

        {/* SCHEDULE */}
        <section className="section-schedule" id="schedule">
          <div className="section-head">
            <h2>
              NewTix Show <span className="accent">Schedule</span>
            </h2>
            <p>
              Live quota, honest prices, and a unique experience for every
              show.
            </p>
          </div>
          <ScheduleCarousel events={events} />
        </section>

        {/* PROMO */}
        <section className="section-promo">
          <div className="promo-banner">
            <p className="promo-text">
              <span className="promo-long">Lost your tickets on the way? </span>
              Keep every QR pass safe at{" "}
              <a href="/my-tickets">newtix.id/my-tickets</a>
            </p>
            <div className="promo-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="promo-bag" src={`${A}/3_Promo/BagIcon.png`} alt="" />
              <a className="promo-shop" href="/my-tickets">
                Open now &raquo;
              </a>
            </div>
          </div>
        </section>

        {/* FEATURED */}
        <section className="section-guides" id="featured">
          <div className="section-head">
            <h2>
              Featured <span className="accent">Shows</span>
            </h2>
            <p>Meet the best live shows in town.</p>
          </div>
          <FeaturedShelf events={events} />
        </section>

        {/* MAP */}
        <section className="section-map" id="map">
          <div className="section-head">
            <h2>
              <span className="accent">Map</span> of NewTix
            </h2>
            <p>Take a peek at where the shows are happening</p>
          </div>
          <MapSection events={events} />
        </section>

        {/* PARTNERS */}
        <section className="section-partners">
          <div className="section-head">
            <h2>
              Our <span className="accent">Partners</span>
            </h2>
          </div>
          <div className="marquee">
            <div className="marquee-track">
              {[0, 1].map((set) => (
                <div className="marquee-set" key={set} aria-hidden={set === 1}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={n} src={`${A}/6_Partners/Partners_${n}.png`} alt={set ? "" : "Partner"} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="section-reviews" id="reviews">
          <div className="reviews-inner">
            <div className="reviews-summary">
              <div className="rs-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="review-icon" src={`${A}/7_Reviews/ReviewIcon.png`} alt="" />
                <span className="rs-title">Honest Reviews</span>
              </div>
              <div className="rs-rating">
                <span className="rs-label">Average Rating</span>
                <div className="rs-row">
                  <span className="rs-score">5.0</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="rs-stars" src={`${A}/7_Reviews/5Stars.png`} alt="5 out of 5 stars" />
                  <span className="rs-count">(hundreds of millions)</span>
                </div>
              </div>
            </div>
            <div className="reviews-grid">
              {reviews.map(([text, pfp, name, time]) => (
                <article className="review-card" key={name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="rc-stars" src={`${A}/7_Reviews/5Stars.png`} alt="5 stars" />
                  <p className="rc-text">
                    {text.split("\n").map((l, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {l}
                      </span>
                    ))}
                  </p>
                  <div className="rc-user">
                    <span className="rc-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${A}/7_Reviews/pfp${pfp}.png`} alt="" />
                    </span>
                    <span className="rc-meta">
                      <span className="rc-name">{name}</span>
                      <span className="rc-time">{time}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PHOTOS */}
        <section className="section-photos">
          <div className="photos-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="photos-title" src={`${A}/8_Photos/Title.png`} alt="Where Paradise Feels Real" style={{ width: 360 }}/>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <figure className={`polaroid p${n}`} key={n}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/8_Photos/Photos_${n}.jpg`} alt="" />
              </figure>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
