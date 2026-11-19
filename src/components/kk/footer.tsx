import Link from "next/link";

export function KKFooter() {
  return (
    <footer className="site-footer">
      <nav className="footer-links">
        <Link href="/#ticket">Ticket</Link>
        <Link href="/#schedule">Schedule</Link>
        <Link href="/#featured">Featured</Link>
        <Link href="/#map">Map</Link>
        <Link href="/#reviews">Reviews</Link>
        <Link href="/events">All Events</Link>
      </nav>
      <p className="footer-copy">
        Copyright &copy; {new Date().getFullYear()} NewTix. All rights reserved.
      </p>
    </footer>
  );
}
