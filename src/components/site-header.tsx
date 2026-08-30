"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About & team", href: "/about" },
  { label: "Cuts & prices", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Visit us", href: "/#visit" },
  { label: "Contact & FAQ", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="hh-inverse sticky top-0 z-[60] flex h-14 items-center bg-black/94 px-4 backdrop-blur-md border-b border-white/[.14]">
        <Link href="/" className="hh-display text-2xl uppercase tracking-[.02em] text-white">
          Hair Hood
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Menu"
          className="ml-auto flex h-11 w-11 flex-col justify-center gap-1.5"
        >
          <i className="block h-0.5 bg-white" />
          <i className="block h-0.5 bg-white" />
          <i className="block h-0.5 bg-white" />
        </button>
      </header>

      {open && (
        <div className="hh-inverse fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-black p-4 pt-[calc(16px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div className="flex h-11 items-center justify-between">
            <span className="hh-display text-2xl uppercase tracking-[.02em] text-white">Hair Hood</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="hh-ui h-11 w-11 text-lg text-white"
            >
              ×
            </button>
          </div>
          <nav className="mt-6 flex flex-col gap-0.5">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="hh-display border-b border-white/[.14] py-[18px] text-4xl leading-[.9] uppercase text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="hh-ui flex h-14 w-full items-center justify-center bg-white text-[13px] tracking-[.02em] uppercase text-black"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
