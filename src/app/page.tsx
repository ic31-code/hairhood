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
import { SiteFooter } from "../components/site-footer";
import { Button, SectionHeading } from "../components/ui";
import { ReviewsCarousel } from "../components/reviews-carousel";

const GALLERY_TILES = 6;

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

  const heroImageUrl = settings?.heroImage
    ? urlFor(settings.heroImage).width(1000).height(1250).url()
    : null;
  const galleryTiles = gallery ?? [];

  return (
    <>
      <main>
        {/* Hero */}
        <section className="hh-inverse relative flex h-[clamp(430px,60dvh,500px)] flex-col justify-end overflow-hidden bg-black">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_22%] grayscale contrast-[1.14]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/95" />
          <div className="relative px-5 pb-6 sm:pb-8">
            <h1 className="hh-display text-[clamp(46px,13vw,64px)] leading-[.88] uppercase text-white">
              {settings?.heroHeadline ?? "Sharp, every time"}
            </h1>
            <div className="hh-script mt-2.5 text-[clamp(24px,7vw,32px)] leading-[1.05] text-white">
              {settings?.heroTagline ?? "Welcome to my hood"}
            </div>
            <div className="mt-[18px]">
              <Button href="/book" size="lg" variant="inverse" full>
                Book Now
              </Button>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="bg-[var(--hh-bone-050)] py-10">
          <div className="px-5">
            <SectionHeading eyebrow="The chairs" title="Meet the team" action={{ label: "See all", href: "/about" }} />
          </div>
          <div className="hh-scroll mt-5 flex gap-3 overflow-x-auto">
            <div className="shrink-0 basis-5" />
            {(team ?? []).map((b) => {
              const photoUrl = b.photo ? urlFor(b.photo).width(256).height(312).url() : null;
              return (
                <div key={b._id} className="flex shrink-0 basis-32 flex-col gap-2">
                  <div className="relative h-[156px] w-32 overflow-hidden bg-[var(--hh-bone-100)]">
                    {photoUrl ? (
                      <Image src={photoUrl} alt={b.name} fill className="object-cover grayscale" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-2 text-center">
                        <span className="hh-ui text-[10px] uppercase text-[var(--text-muted)]">
                          {b.name} photo
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="hh-ui text-sm uppercase tracking-[.02em]">{b.name}</div>
                    {b.role && (
                      <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        {b.role}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="shrink-0 basis-2" />
          </div>
        </section>

        {/* Prices */}
        <section id="prices" className="bg-white py-10">
          <div className="px-5">
            <SectionHeading eyebrow="The menu" title="Cuts & prices" />
          </div>
          <div className="hh-scroll mt-5 flex gap-3 overflow-x-auto">
            <div className="shrink-0 basis-5" />
            {(services ?? []).map((s) => (
              <div key={s._id} className="shrink-0 basis-[152px] border-t-2 border-[var(--hh-black)] pt-3.5">
                <div className="hh-ui text-[11px] uppercase tracking-[.04em]" style={{ color: "var(--text-muted)" }}>
                  From
                </div>
                <div className="hh-ui mt-0.5 text-[32px] tracking-[.01em]">{s.displayPrice}</div>
                <div className="mt-2 text-sm leading-tight">{s.name}</div>
                <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  {s.durationRange}
                </div>
              </div>
            ))}
            <div className="shrink-0 basis-2" />
          </div>
          <div className="mt-5 px-5">
            <Button href="/services" variant="secondary" full>
              See full price list
            </Button>
          </div>
        </section>

        {/* Work / Instagram */}
        <section id="insta" className="bg-[var(--hh-bone-050)] py-10">
          <div className="px-5">
            <SectionHeading eyebrow="Follow along" title="The work" action={{ label: "See all", href: "/gallery" }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-0.5 px-5">
            {Array.from({ length: GALLERY_TILES }).map((_, i) => {
              const item = galleryTiles[i];
              return (
                <div key={item?._id ?? i} className="relative aspect-square overflow-hidden bg-[var(--hh-bone-100)]">
                  {item && (
                    <Image
                      src={urlFor(item.image).width(300).height(300).url()}
                      alt={item.alt ?? ""}
                      fill
                      className="object-cover grayscale"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="hh-inverse bg-black py-10">
          <div className="px-5">
            <span className="hh-eyebrow" style={{ color: "var(--hh-ink-300)" }}>
              What people say
            </span>
            <h2 className="hh-display mt-2 text-[clamp(30px,9vw,38px)] leading-[.9] uppercase text-white">
              From the chair
            </h2>
          </div>
          <ReviewsCarousel reviews={reviews ?? []} />
        </section>

        {/* Visit */}
        <section id="visit" className="bg-[var(--surface-marble)] py-10">
          <div className="px-5">
            <span className="hh-eyebrow">Find us</span>
            <h2 className="hh-display mt-2 text-[clamp(30px,9vw,38px)] leading-[.9] uppercase text-[var(--hh-black)]">
              Visit us
            </h2>
            <div className="mt-5 border-t-2 border-[var(--hh-black)] pt-4">
              <div className="text-[15px] leading-normal text-[var(--hh-black)]">
                {settings?.addressLine1}
                <br />
                {settings?.addressLine2}
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                {(settings?.hours ?? []).map((h) => (
                  <div key={h.day} className="hh-ui flex justify-between gap-3 text-xs tracking-[.02em]" style={{ color: "var(--text-body)" }}>
                    <span className="uppercase">{h.day}</span>
                    <span>{h.closed ? "Closed" : `${h.openTime} – ${h.closeTime}`}</span>
                  </div>
                ))}
              </div>
              <div className="relative mt-5 aspect-video contrast-[1.05] grayscale">
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
              <div className="mt-3.5">
                <a
                  href="https://maps.google.com/?q=91B+Whiteladies+Road+Bristol+BS8+2NT"
                  target="_blank"
                  rel="noopener"
                  className="hh-ui flex items-center text-xs tracking-[.04em] uppercase text-[var(--hh-black)] underline"
                >
                  Get directions
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
