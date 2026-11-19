import Link from "next/link";

const links = [
  ["Tickets", "/events"],
  ["Schedule", "/events"],
  ["My Tickets", "/my-tickets"],
  ["Sign In", "/login"],
  ["Register", "/register"],
];

export function Footer() {
  return (
    <footer className="rounded-t-[60px] bg-[#f4f4f4] px-5 pt-[46px] pb-[30px] text-center shadow-[0_-2px_12px_rgba(0,0,0,.06)]">
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] font-semibold">
        {links.map(([l, h]) => (
          <Link key={l} href={h} className="link-blue">
            {l}
          </Link>
        ))}
      </nav>
      <p className="mt-4 text-[12px] text-[#8a8a8a]">
        Copyright © {new Date().getFullYear()} NewTix. All rights reserved.
      </p>
    </footer>
  );
}
