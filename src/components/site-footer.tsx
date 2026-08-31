import Link from "next/link";
import { sanityFetch } from "../../sanity/lib/live";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "../../sanity/lib/queries";
import { todayHours } from "../lib/hours";
import { NAV } from "../lib/nav";

const BOOKING_LINKS = [
  { label: "Book by service", href: "/book?service" },
  { label: "Book by barber", href: "/book?barber" },
  { label: "Book any barber", href: "/book" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Booking Terms", href: "/booking-terms" },
];

const linkClassName = "hh-ui text-xs tracking-[.02em] uppercase text-white/64 hover:text-white";
const headingClassName = "hh-ui text-[11px] tracking-[.04em] uppercase text-white/40";

export async function SiteFooter() {
  const { data: settings } = (await sanityFetch({ query: SITE_SETTINGS_QUERY })) as {
    data: SiteSettings | null;
  };

  const today = todayHours(settings?.hours);

  return (
    <footer className="hh-inverse bg-black px-5 pt-10 pb-7">
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
        <div>
          <Link href="/" className="hh-display text-2xl uppercase tracking-[.02em] text-white">
            Hair Hood
          </Link>

          <div className="mt-4 flex flex-col gap-1.5">
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener" className={linkClassName}>
                Instagram
              </a>
            )}
            {settings?.whatsappUrl && (
              <a href={settings.whatsappUrl} target="_blank" rel="noopener" className={linkClassName}>
                WhatsApp
              </a>
            )}
            {settings?.phone && (
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className={linkClassName}>
                {settings.phone}
              </a>
            )}
          </div>

          {(settings?.addressLine1 || settings?.addressLine2) && (
            <div className="mt-4 text-xs leading-relaxed text-white/64">
              {settings?.addressLine1}
              {settings?.addressLine1 && settings?.addressLine2 && <br />}
              {settings?.addressLine2}
            </div>
          )}

          {today && (
            <div className="hh-ui mt-1.5 text-xs tracking-[.02em] text-white/40">
              {today.day}: {today.label}
            </div>
          )}
        </div>

        <div>
          <div className={headingClassName}>Booking</div>
          <div className="mt-3 flex flex-col gap-2">
            {BOOKING_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClassName}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className={headingClassName}>Site</div>
          <div className="mt-3 flex flex-col gap-2">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={linkClassName}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-9 flex flex-col gap-3 border-t border-white/[.14] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-[11px] tracking-[.02em] uppercase text-white/40 hover:text-white/64">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-[11px] text-white/40">© {new Date().getFullYear()} Hair Hood</p>
      </div>
    </footer>
  );
}
