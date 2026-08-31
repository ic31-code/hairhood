"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function StickyBookBar() {
  const pathname = usePathname();
  if (pathname === "/book" || pathname === "/about") return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-[var(--hh-brass-500)] px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))]">
        <Link
          href="/book"
          className="hh-ui flex h-[46px] w-full items-center justify-center bg-white text-[13px] tracking-[.02em] uppercase text-black"
        >
          Book Now
        </Link>
      </div>
      <div style={{ height: "calc(78px + env(safe-area-inset-bottom))" }} />
    </>
  );
}
