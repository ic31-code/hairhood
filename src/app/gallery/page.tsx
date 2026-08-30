import Image from "next/image";

import { sanityFetch } from "../../../sanity/lib/live";
import { urlFor } from "../../../sanity/lib/image";
import { GALLERY_IMAGES_QUERY, SITE_SETTINGS_QUERY, type GalleryImage, type SiteSettings } from "../../../sanity/lib/queries";
import { BackLink } from "../../components/ui";

const MIN_TILES = 9;

export default async function GalleryPage() {
  const [{ data: gallery }, { data: settings }] = (await Promise.all([
    sanityFetch({ query: GALLERY_IMAGES_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ])) as [{ data: GalleryImage[] }, { data: SiteSettings | null }];

  const images = gallery ?? [];
  const placeholderCount = Math.max(0, MIN_TILES - images.length);

  return (
    <main>
      <section className="hh-inverse bg-black px-5 pt-7 pb-8">
        <BackLink href="/">← Home</BackLink>
        <span className="hh-eyebrow mt-4 block" style={{ color: "var(--hh-ink-300)" }}>
          The work
        </span>
        <h1 className="hh-display mt-2 text-[clamp(40px,12vw,56px)] leading-[.88] uppercase text-white">
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
      <section className="bg-black pb-16">
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
    </main>
  );
}
