import Image from "next/image";

import { sanityFetch } from "../../sanity/lib/live";
import { urlFor } from "../../sanity/lib/image";
import {
  SITE_SETTINGS_QUERY,
  FEATURED_SERVICES_QUERY,
  TEAM_QUERY,
  TESTIMONIALS_QUERY,
  GALLERY_IMAGES_QUERY,
  type SiteSettings,
  type FeaturedService,
  type TeamMember,
  type Testimonial,
  type GalleryImage,
} from "../../sanity/lib/queries";
import { isOpenNow } from "../lib/hours";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Button, SectionHeading, ServiceRow } from "../components/ui";

const WORK_LABELS = ["Skin fade", "Beard work", "Taper", "The bar"];

export default async function Home() {
  const [{ data: settings }, { data: services }, { data: team }, { data: reviews }, { data: gallery }] =
    (await Promise.all([
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
      sanityFetch({ query: FEATURED_SERVICES_QUERY }),
      sanityFetch({ query: TEAM_QUERY }),
      sanityFetch({ query: TESTIMONIALS_QUERY }),
      sanityFetch({ query: GALLERY_IMAGES_QUERY }),
    ])) as [
      { data: SiteSettings | null },
      { data: FeaturedService[] },
      { data: TeamMember[] },
      { data: Testimonial[] },
      { data: GalleryImage[] },
    ];

  const open = isOpenNow(settings?.hours);
  const heroImageUrl = settings?.heroImage
    ? urlFor(settings.heroImage).width(1600).height(1600).url()
    : null;
  const telHref = `tel:${(settings?.phone ?? "07307 453917").replace(/\s+/g, "")}`;

  return (
    <>
      <SiteHeader phone={settings?.phone ?? undefined} />
      <main>
        {/* Hero */}
        <section className="hh-inverse relative flex min-h-[min(88dvh,760px)] items-end overflow-hidden bg-black">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_22%] grayscale contrast-[1.12]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/62 via-black/28 to-black/92" />
          <div className="relative mx-auto w-full max-w-[1240px] px-5 pb-12 sm:px-10 sm:pb-20">
            <h1 className="hh-display mt-6 text-[clamp(58px,12vw,148px)] leading-[.88] uppercase text-white">
              {settings?.heroHeadline ?? "Sharp, every time"}
            </h1>
            <div className="hh-script mt-3 text-[clamp(30px,5vw,56px)] leading-[1.05] text-white">
              {settings?.heroTagline ?? "Welcome to my hood"}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#menu" size="lg" variant="inverse">
                Book a cut
              </Button>
              <Button href="#team" size="lg" variant="secondary-inverse">
                Meet the team
              </Button>
            </div>
          </div>
        </section>

        {/* Menu teaser */}
        <section id="menu" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
            <SectionHeading
              eyebrow="The menu"
              title="Cuts & prices"
              motto="same for every chair"
              lede="Every cut finishes with a hot towel. Prices vary slightly by barber."
            />
            <div className="mt-10">
              {(services ?? []).map((s) => (
                <ServiceRow key={s._id} name={s.name} duration={s.durationRange} price={s.displayPrice} />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={telHref} variant="primary">
                Book a chair
              </Button>
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="hh-inverse bg-black py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
            <SectionHeading eyebrow="The work" title="Fresh out the chair" motto="straight from the chair" />
            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-0.5">
              {gallery?.[0]?.image ? (
                <div className="relative col-span-2 aspect-square overflow-hidden bg-[var(--hh-ink-600)]">
                  <Image
                    src={urlFor(gallery[0].image).width(900).height(900).url()}
                    alt={gallery[0].alt ?? ""}
                    fill
                    className="object-cover grayscale contrast-[1.1] transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="relative col-span-2 aspect-square bg-[var(--hh-ink-600)]" />
              )}
              {WORK_LABELS.map((label, i) => (
                <div
                  key={label}
                  className="relative aspect-square"
                  style={{
                    background: [
                      "var(--hh-ink-600)",
                      "var(--hh-ink-700)",
                      "var(--hh-ink-500)",
                      "var(--hh-ink-600)",
                    ][i],
                  }}
                >
                  <span className="hh-ui absolute left-3.5 top-3 text-[11px] tracking-[.14em] uppercase text-white/50">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="bg-[var(--hh-marble-050)] py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
            <SectionHeading
              eyebrow="The chairs"
              title="Who's cutting"
              motto="know your barber"
              lede="Book a name, or leave it to whoever's free."
            />
            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              {(team ?? []).map((b) => {
                const photoUrl = b.photo ? urlFor(b.photo).width(400).height(400).url() : null;
                return (
                  <div key={b._id} className="flex flex-col bg-white p-5">
                    <div className="relative aspect-square w-full overflow-hidden bg-[var(--hh-bone-100)]">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={b.name}
                          fill
                          className="object-cover grayscale"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="hh-ui text-[11px] uppercase text-[var(--text-muted)]">
                            Photo placeholder
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="hh-display mt-4 text-2xl uppercase">{b.name}</div>
                    {b.role && (
                      <div className="hh-eyebrow mt-1">{b.role}</div>
                    )}
                    {b.note && (
                      <p className="mt-2 text-sm" style={{ color: "var(--text-body)" }}>
                        {b.note}
                      </p>
                    )}
                    <div className="mt-4">
                      <Button href={telHref} variant="secondary">
                        Book with {b.name}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="bg-[var(--hh-bone-050)] py-16 sm:py-24">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
            <SectionHeading eyebrow="What people say" title="From the chair" />
            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10">
              {(reviews ?? []).map((r) => (
                <div key={r._id} className="border-t-2 border-black pt-4">
                  <p className="hh-display text-[clamp(22px,2.4vw,30px)] leading-[1.02] uppercase">
                    {r.quote}
                  </p>
                  <div
                    className="hh-ui mt-4 text-[11px] uppercase tracking-[.04em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Find us */}
        <section id="find-us" className="bg-white py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-12 px-5 sm:px-10">
            <div>
              <SectionHeading
                eyebrow="Find us"
                title={settings?.addressLine1 ?? "91B Whiteladies Road"}
                motto="the door is black"
                lede={settings?.addressLine2}
              />
              <div className="mt-7">
                <a
                  href="https://maps.google.com/?q=91B+Whiteladies+Road+Bristol+BS8+2NT"
                  target="_blank"
                  rel="noopener"
                  className="hh-ui text-[13px] tracking-[.02em] underline"
                >
                  Get directions
                </a>
              </div>
              <div className="mt-7 aspect-video contrast-[1.05] grayscale">
                <iframe
                  title="Hair Hood on Google Maps"
                  src="https://www.google.com/maps?q=91B+Whiteladies+Road,+Bristol,+BS8+2NT&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="border-t-2 border-black pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="hh-eyebrow">Opening hours</span>
                <span
                  className="hh-ui rounded-full px-3 py-1 text-[11px] uppercase text-white"
                  style={{ background: open ? "var(--hh-success-500)" : "var(--hh-ink-400)" }}
                >
                  {open ? "Open now" : "Closed now"}
                </span>
              </div>
              <div className="mt-5">
                {(settings?.hours ?? []).map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between border-b border-black/[.08] py-2.5 text-sm"
                  >
                    <span>{h.day}</span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {h.closed ? "Closed" : `${h.openTime} – ${h.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[13px]" style={{ color: "var(--text-muted)" }}>
                Last appointment 30 minutes before closing. Walk-ins welcome when a chair is free —
                booking is safer.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        addressLine1={settings?.addressLine1}
        addressLine2={settings?.addressLine2}
        phone={settings?.phone}
        email={settings?.email}
        hours={settings?.hours}
      />
    </>
  );
}
