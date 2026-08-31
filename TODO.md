# HairHood — To-Do

Local checklist derived from the Notion spec ("HairHood — Site Architecture Spec"). Update this as items land; keep the Notion doc as the source of truth for rationale/context.

## Site / UX (decided, not yet implemented)

- [x] Remove black background behind the sticky bottom "Book Now" bar (`src/components/sticky-book-bar.tsx`)
- [x] Fix `env(safe-area-inset-bottom)` being inert — added `viewport-fit: cover` to the viewport export in `layout.tsx` (was missing, so the safe-area padding already coded into the sticky bar was always resolving to 0). The "hidden behind the hero, pops in after the slightest scroll" symptom is very likely the mobile browser's own toolbar overlaying the fixed-bottom bar until it collapses on scroll — standard iOS Safari/Chrome Android behavior, not app code (no scroll/visibility JS exists anywhere for this bar). Worth re-checking on a real device after this deploy; if it's still off, next step is a `VisualViewport`-synced fix rather than pure CSS.
- [x] Removed the sticky bottom "Book Now" bar on `/about` (Meet the Team) — redundant there since it's already pinned at the bottom of every screen
- [x] Per-barber buttons on Meet the Team (`/about`) now read "Book with {name}" instead of "Book Now". Confirmed scope: the generic sticky bottom bar stays "Book Now" everywhere (constant copy) — only the individual barber-card buttons change.
- [ ] New "Cuts & prices" card layout — current `ServiceRow` list (`components/ui.tsx`) on `/services` is being scrapped for a proper card design
- [ ] Redo eyebrow text across sections — current set ("The menu", "Follow along", "What people say", "Find us", "The chairs", "A word from Amir", "Get in touch", "FAQ") needs a rewrite pass; occurrences: `app/page.tsx`, `app/about/page.tsx`, `app/services/page.tsx`, `app/contact/page.tsx`, `app/gallery/page.tsx`
- [ ] Combine Gallery + Reviews into one page (drop standalone `/gallery` page and the homepage reviews carousel)
- [ ] Add Instagram + WhatsApp links wherever contact info is shown (header/footer/visit-us block)
- [ ] Remove the displayed email address entirely
- [ ] Remove the repeated "Book Now" CTA at the bottom of every page (redundant with the persistent sticky bar / desktop button)
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
