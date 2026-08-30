"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [
  { label: "Cuts & Prices", href: "#menu" },
  { label: "The Work", href: "#work" },
  { label: "The Team", href: "#team" },
  { label: "Reviews", href: "#reviews" },
  { label: "Find Us", href: "#find-us" },
];

export function SiteHeader({ phone }: { phone?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="hh-inverse sticky top-0 z-[60] bg-black/92 backdrop-blur-md border-b border-white/[.14]">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center gap-8 px-5 sm:px-10">
        <Link
          href="/"
          className="hh-display text-3xl leading-none tracking-[.02em] uppercase text-white"
        >
          Hair Hood
        </Link>

        <nav className="ml-auto hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="hh-ui text-[11px] tracking-[.04em] uppercase text-white/64 border-b border-transparent pb-1 hover:text-white hover:border-[var(--hh-brass-500)] transition-colors"
            >
              {n.label}
            </a>
          ))}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="hh-ui inline-flex h-9 items-center justify-center rounded-none bg-white px-4 text-[11px] tracking-[.04em] uppercase text-black hover:bg-[var(--hh-bone-100)] transition-colors"
            >
              Book a chair
            </a>
          )}
        </nav>

        <button
          onClick={() => setOpen(true)}
          aria-label="Menu"
          className="ml-auto flex h-11 w-11 flex-col justify-center gap-1.5 md:hidden"
        >
          <i className="block h-0.5 bg-white" />
          <i className="block h-0.5 bg-white" />
          <i className="block h-0.5 bg-white" />
        </button>
      </div>

      {open && (
        <div className="hh-inverse fixed inset-0 z-[80] flex flex-col bg-black p-6 pt-[calc(24px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))] overflow-y-auto">
          <div className="flex h-12 items-center justify-between">
            <span className="hh-display text-3xl tracking-[.02em] uppercase text-white">
              Hair Hood
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="hh-ui h-11 w-11 text-lg text-white"
            >
              ×
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="hh-display border-b border-white/[.14] py-4 text-4xl leading-[.9] uppercase text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <span className="hh-script text-3xl text-white">Welcome to my hood</span>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="hh-ui flex h-14 w-full items-center justify-center bg-white text-[13px] tracking-[.04em] uppercase text-black"
              >
                Book a chair
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
