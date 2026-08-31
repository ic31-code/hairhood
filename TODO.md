# HairHood — To-Do

Local checklist derived from the Notion spec ("HairHood — Site Architecture Spec"). Update this as items land; keep the Notion doc as the source of truth for rationale/context.

## Site / UX (decided, not yet implemented)

- [x] Remove black background behind the sticky bottom "Book Now" bar (`src/components/sticky-book-bar.tsx`)
- [x] Fix `env(safe-area-inset-bottom)` being inert — added `viewport-fit: cover` to the viewport export in `layout.tsx` (was missing, so the safe-area padding already coded into the sticky bar was always resolving to 0). The "hidden behind the hero, pops in after the slightest scroll" symptom is very likely the mobile browser's own toolbar overlaying the fixed-bottom bar until it collapses on scroll — standard iOS Safari/Chrome Android behavior, not app code (no scroll/visibility JS exists anywhere for this bar). Worth re-checking on a real device after this deploy; if it's still off, next step is a `VisualViewport`-synced fix rather than pure CSS.
- [x] Removed the sticky bottom "Book Now" bar on `/about` (Meet the Team) — redundant there since it's already pinned at the bottom of every screen
- [x] Per-barber buttons on Meet the Team (`/about`) now read "Book with {name}" instead of "Book Now". Confirmed scope: the generic sticky bottom bar stays "Book Now" everywhere (constant copy) — only the individual barber-card buttons change.
- [x] Fixed homepage "Cuts & prices" teaser (`app/page.tsx`) — it was the horizontal-scroll cards that were cluttered (massive 32px price, name smallest element, heavy `border-t-2`, and a duplicate "From" label stacked on top of `displayPrice` values like `"from £27"`). Replaced with the same plain `ServiceRow` list already used on `/services` (that page was already fine, not touched structurally). Root cause of the double "from": the Sanity field's own help text tells editors to type `"from £X"`, so the hardcoded label on top was always going to double up for any service priced that way — worth a quick pass in Sanity Studio to check no other `displayPrice` values still include a redundant "from".
- [x] Removed eyebrow labels site-wide per your call ("remove them entirely") — dropped the `eyebrow` prop from `SectionHeading` (`components/ui.tsx`) and every standalone `<span className="hh-eyebrow">` in `app/page.tsx`, `app/about/page.tsx`, `app/services/page.tsx`, `app/contact/page.tsx`, `app/gallery/page.tsx`. Titles now stand alone. Two exceptions, both deliberate: FAQ section on `/contact` got a proper `<h2>FAQ</h2>` instead of just vanishing (was the only heading there); the `.hh-eyebrow` CSS class and its usages in `components/booking-flow.tsx` (Pick a day/time, Name, Mobile, Email field labels) were left untouched — those are functional form labels, not decorative section eyebrows.
- [x] Removed the brass/gold top border on the sticky bottom bar (`border-t border-[var(--hh-brass-500)]` in `sticky-book-bar.tsx`)
- [x] Homepage section titles: "From the chair" → "Reviews", "The work" → "Gallery" (`app/page.tsx`)
- [x] Removed "know your barber" script line from Meet the Team on `/about`
- [x] Sticky bottom "Book Now" button flipped to a black box with white lettering (was white box, black lettering) (`sticky-book-bar.tsx`)
- [x] Combined Gallery + Reviews into one page — `/gallery` now has the photo grid plus a Reviews section (same testimonials/Google-reviews data + `ReviewsCarousel` component previously on the homepage) below it. Removed the standalone Reviews section from the homepage (`app/page.tsx`) entirely; homepage keeps its own Gallery photo-teaser section unchanged, still linking "See all" to `/gallery`. Nav's "Reviews" link now points to `/gallery#reviews` instead of `/#reviews`.
- [x] Rebuilt the footer (`site-footer.tsx`) per the footer + legal pages master prompt — 3-column layout (brand/social, booking links, site nav mirroring the header exactly via a shared `lib/nav.ts`), bottom bar with Privacy/Cookie/Booking Terms links + copyright, no repeated Book Now CTA. Mounted globally in `layout.tsx` (was homepage-only before).
- [x] Added Instagram + WhatsApp links to the footer (new `whatsappUrl` field on `siteSettings` — populate in Studio to show the link; `instagramUrl` already existed)
- [x] Removed the displayed email address entirely (was on `/contact`; also never shown in the new footer)
- [x] Added `/privacy`, `/cookies`, `/booking-terms` pages. Privacy Policy pulls the real address/phone from Sanity settings; rights-request contact is phone-only (no email, per above). Booking Terms: cancellations are notice-only for now (24h, no charge), late-arrival clause has no fixed minute threshold (decided against one). Cookie Policy + `layout.tsx` have a CookieYes scaffold (`NEXT_PUBLIC_COOKIEYES_ID` env var) — inert until a real CookieYes account/site ID exists; GA4 + Google Ads tags aren't in the codebase yet so there's nothing to gate yet.
- [ ] Remove the repeated "Book Now" CTA at the bottom of every page (redundant with the persistent sticky bar / desktop button) — left `/about`'s bottom button alone since it's the page's only non-per-barber CTA (its own sticky bar is already suppressed for this exact reason); revisit as a deliberate call, not a leftover
- [ ] Desktop: cap section max-heights (fix oversized/overlong sections)
- [ ] Desktop: add a "Book Now" button fixed top-right at all times (desktop counterpart to the mobile sticky bottom bar)

## Booking backend (build order)

- [ ] Availability proxy endpoint — `SearchAvailability` (location + service variation + team member + date range)
- [ ] Customer lookup/create endpoint — `POST /v2/customers/search`, fallback `POST /v2/customers`
- [ ] Create-booking endpoint — `POST /v2/bookings` with idempotency key
- [ ] Blocklist check wired into the customer-details step (phone + email, before CreateBooking)
- [ ] Race-condition handling: re-run availability + prompt next slots if CreateBooking rejects a taken slot
- [ ] "Any barber" option: merged-availability query (single variation vs. multi-variation-by-tier cases), "from £X" pricing display
- [ ] Pre-filled booking links: `/book?barber=`, `/book?service=`, `/book?barber=&service=` (skip completed steps; invalid-combo fallback)
- [ ] Add-ons flow: base service → optional add-ons page → multi-segment `SearchAvailability`/`CreateBooking`

## Sanity / catalog sync

- [ ] Confirm webhook receiver vs. current cron sync (`src/app/api/cron/sync-square/route.ts`) — spec calls for `catalog.version.updated` + Team Member webhooks; current implementation is a cron poll, decide if that's staying
- [ ] Finalise Sanity schema fields for `service` / `staffMember` (two-layer squareSync + editorial split)
- [ ] Per-barber add-on eligibility — confirm with Amir/Ish which barbers can perform which add-ons

## Open decisions (need input, not code)

- [ ] Booking window length (how far out to allow booking)
- [ ] Confirmation email/SMS — build our own vs. rely on Square's built-in notification
- [ ] Blocklist storage location — Sanity vs. separate simple list

## Pre-launch checks

- [ ] Confirm Amir's Square account booking policy is set to auto-accept (`ACCEPT_ALL`), not "requires confirmation"
- [ ] Custom domain cutover: `hairhood.co.uk` DNS (currently GoDaddy) → Vercel A/CNAME at go-live

**Target:** end of September 2026 for the new site.
