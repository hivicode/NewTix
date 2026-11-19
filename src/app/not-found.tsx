import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="kk">
      <div className="gate">
        <div className="gate-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/newtix/home/5_Map/Pin4.png" alt="" style={{ width: 38, marginBottom: 12 }} />
          <h1 className="gate-title">
            Error <span className="accent">404</span>
          </h1>
          <p className="gate-text">
            We looked backstage, but this page or ticket code could not be
            found.
          </p>
          <Link href="/events" className="gate-btn" style={{ textDecoration: "none" }}>
            Browse Events
          </Link>
          <p className="gate-back">
            <Link href="/">&laquo; Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
