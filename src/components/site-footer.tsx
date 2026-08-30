const NAV = [
  { label: "Cuts & Prices", href: "#menu" },
  { label: "The Work", href: "#work" },
  { label: "The Team", href: "#team" },
  { label: "Reviews", href: "#reviews" },
  { label: "Find Us", href: "#find-us" },
];

export function SiteFooter({
  addressLine1,
  addressLine2,
  phone,
  email,
  hours,
}: {
  addressLine1?: string | null;
  addressLine2?: string | null;
  phone?: string | null;
  email?: string | null;
  hours?: { day: string; closed?: boolean | null; openTime?: string | null; closeTime?: string | null }[] | null;
}) {
  return (
    <footer className="hh-inverse bg-black text-white pt-16 pb-8">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="hh-display text-3xl uppercase tracking-[.02em] leading-[.9]">
              Hair Hood
            </div>
            <div className="hh-script mt-2 text-2xl">Welcome to my hood</div>
            <p className="mt-4 max-w-[38ch] text-[13px] text-white/64">
              Barbering, a bar and a wall worth looking at. Whiteladies Road, Clifton.
            </p>
          </div>
          <div className="flex flex-col">
            <span className="hh-eyebrow mb-2 text-[var(--hh-ink-300)]">Shop</span>
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="hh-ui py-2.5 text-[11px] tracking-[.04em] uppercase text-white/64 hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="hh-eyebrow text-[var(--hh-ink-300)]">Find us</span>
            <span className="text-sm leading-relaxed text-white/64">
              {addressLine1}
              <br />
              {addressLine2}
            </span>
            {phone && (
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hh-ui py-1 text-[11px] tracking-[.04em] text-white/64 hover:text-white">
                {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="hh-ui py-1 text-[11px] tracking-[.04em] text-white/64 hover:text-white">
                {email}
              </a>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="hh-eyebrow text-[var(--hh-ink-300)]">Hours</span>
            <span className="hh-ui text-[11px] leading-[2] tracking-[.02em] text-white/64">
              {hours?.map((h) => (
                <span key={h.day} className="block">
                  {h.day.slice(0, 3)}{" "}
                  {h.closed ? "Closed" : `${h.openTime} – ${h.closeTime}`}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-[var(--hh-brass-500)] pt-6 text-[11px] tracking-[.04em] uppercase text-[var(--hh-ink-400)]">
          <span>© Hair Hood LTD</span>
          <span>Bristol, UK</span>
        </div>
      </div>
    </footer>
  );
}
