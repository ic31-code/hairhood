import Image from "next/image";

import { sanityFetch } from "../../../sanity/lib/live";
import { urlFor } from "../../../sanity/lib/image";
import {
  GALLERY_IMAGES_QUERY,
  SITE_SETTINGS_QUERY,
  TESTIMONIALS_QUERY,
  type GalleryImage,
  type SiteSettings,
  type Testimonial,
} from "../../../sanity/lib/queries";
import { BackLink } from "../../components/ui";
import { ReviewsCarousel, type Review } from "../../components/reviews-carousel";
import { getGoogleReviews } from "../../lib/google-reviews";

const MIN_TILES = 9;

export default async function GalleryPage() {
  const [{ data: gallery }, { data: settings }, { data: testimonials }, googleReviews] = (await Promise.all([
    sanityFetch({ query: GALLERY_IMAGES_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: TESTIMONIALS_QUERY }),
    getGoogleReviews(),
  ])) as [
    { data: GalleryImage[] },
    { data: SiteSettings | null },
    { data: Testimonial[] },
    Awaited<ReturnType<typeof getGoogleReviews>>,
  ];

  const images = gallery ?? [];
  const placeholderCount = Math.max(0, MIN_TILES - images.length);
  const reviews: Review[] =
    googleReviews.length > 0
      ? googleReviews.map((r) => ({ _id: r.id, quote: r.quote, author: r.author, rating: r.rating }))
      : (testimonials ?? []).map((t) => ({ _id: t._id, quote: t.quote, author: t.author }));

  return (
    <main>
      <section className="hh-inverse bg-black px-5 pt-7 pb-8">
        <BackLink href="/">← Home</BackLink>
        <h1 className="hh-display mt-4 text-[clamp(40px,12vw,56px)] leading-[.88] uppercase text-white">
          Fresh out
          <br />
          the chair
        </h1>
        {settings?.instagramHandle && (
          <a
            href={settings.instagramUrl ?? "https://instagram.com"}
            target="_blank"
            rel="noopener"
            className="hh-back-link mt-3 block"
          >
            {settings.instagramHandle}
          </a>
        )}
      </section>
      <section className="bg-black pb-12">
        <div className="grid grid-cols-3 gap-0.5 px-5">
          {images.map((item) => (
            <div key={item._id} className="relative aspect-square overflow-hidden">
              <Image
                src={urlFor(item.image).width(400).height(400).url()}
                alt={item.alt ?? ""}
                fill
                className="object-cover grayscale"
              />
            </div>
          ))}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div key={`placeholder-${i}`} className="aspect-square bg-[var(--hh-ink-700)]" />
          ))}
        </div>
        {placeholderCount > 0 && (
          <p className="mt-5 px-5 text-xs" style={{ color: "var(--hh-ink-300)" }}>
            Grey tiles are placeholders — send us the shoot and they drop straight in.
          </p>
        )}
      </section>
      <section id="reviews" className="hh-inverse bg-black pb-16">
        <div className="px-5">
          <h2 className="hh-display text-[clamp(30px,9vw,38px)] leading-[.9] uppercase text-white">
            Reviews
          </h2>
        </div>
        <ReviewsCarousel reviews={reviews} />
      </section>
    </main>
  );
}
