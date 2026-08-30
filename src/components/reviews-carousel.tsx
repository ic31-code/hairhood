"use client";

import { useEffect, useRef } from "react";
import type { Testimonial } from "../../sanity/lib/queries";

export function ReviewsCarousel({ reviews }: { reviews: Testimonial[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const el = scrollerRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const card = el.firstElementChild as HTMLElement | null;
      const step = card ? card.getBoundingClientRect().width + 12 : 260;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 4200);

    const stop = () => clearInterval(interval);
    el.addEventListener("pointerdown", stop, { once: true, passive: true });
    el.addEventListener("wheel", stop, { once: true, passive: true });

    return () => {
      clearInterval(interval);
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("wheel", stop);
    };
  }, []);

  return (
    <div ref={scrollerRef} className="hh-scroll mt-5 flex gap-3 overflow-x-auto scroll-smooth">
      <div className="shrink-0 basis-5" />
      {reviews.map((r) => (
        <div
          key={r._id}
          className="shrink-0 basis-[78%] border-t border-[var(--hh-brass-500)] pt-4"
          style={{ scrollSnapAlign: "start" }}
        >
          <p className="text-base leading-snug text-white">{r.quote}</p>
          <div className="hh-ui mt-3.5 text-[11px] tracking-[.04em] uppercase text-[var(--hh-ink-300)]">
            {r.author}
          </div>
        </div>
      ))}
      <div className="shrink-0 basis-2" />
    </div>
  );
}
