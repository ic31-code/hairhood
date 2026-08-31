import Image from "next/image";

import { sanityFetch } from "../../../sanity/lib/live";
import { urlFor } from "../../../sanity/lib/image";
import {
  SITE_SETTINGS_QUERY,
  TEAM_QUERY,
  type SiteSettings,
  type TeamMember,
} from "../../../sanity/lib/queries";
import { blocksToParagraphs } from "../../lib/portable-text";
import { BackLink, Button } from "../../components/ui";

export default async function AboutPage() {
  const [{ data: settings }, { data: team }] = (await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: TEAM_QUERY }),
  ])) as [{ data: SiteSettings | null }, { data: TeamMember[] }];

  const heroUrl = settings?.aboutHeroImage
    ? urlFor(settings.aboutHeroImage).width(1000).height(900).url()
    : null;
  const paragraphs = blocksToParagraphs(settings?.aboutIntro);
  const aboutImages = settings?.aboutImages ?? [];

  return (
    <main>
      <section className="hh-inverse relative flex h-[clamp(320px,44dvh,380px)] flex-col justify-end overflow-hidden bg-black">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt=""
            fill
            className="object-cover object-[50%_28%] grayscale contrast-[1.1]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/92" />
        <div className="relative px-5 pb-6">
          <BackLink href="/">← Home</BackLink>
          <h1 className="hh-display mt-3 text-[clamp(40px,12vw,56px)] leading-[.88] uppercase text-white">
            About us
          </h1>
        </div>
      </section>

      <section className="bg-[var(--hh-bone-050)] px-5 pt-7 pb-12">
        <span className="hh-eyebrow">A word from Amir</span>
        {paragraphs.map((p, i) => (
          <p key={i} className="mt-4 text-[15px] leading-relaxed" style={{ color: "var(--text-body)" }}>
            {p}
          </p>
        ))}
        {settings?.aboutSignature && (
          <div className="hh-script mt-5 text-[clamp(26px,7vw,32px)] text-[var(--hh-black)]">
            {settings.aboutSignature}
          </div>
        )}
        {aboutImages.length > 0 && (
          <div className="mt-7 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-0.5">
            {aboutImages.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${i === 0 ? "aspect-[4/5]" : "aspect-[1/2]"}`}
              >
                <Image
                  src={urlFor(img).width(700).height(900).url()}
                  alt="Hair Hood"
                  fill
                  className="object-cover grayscale contrast-[1.12]"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="team-section" className="bg-[var(--surface-marble)] px-5 pt-9 pb-11">
        <span className="hh-eyebrow">The chairs</span>
        <h2 className="hh-display mt-2 text-[clamp(32px,10vw,42px)] leading-[.9] uppercase text-[var(--hh-black)]">
          Meet the team
        </h2>
        <div className="hh-script mt-2 text-[clamp(22px,6vw,28px)] text-[var(--hh-black)]">
          know your barber
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {(team ?? []).map((b) => {
            const photoUrl = b.photo ? urlFor(b.photo).width(176).height(208).url() : null;
            return (
              <div key={b._id} className="flex gap-3.5 border-t-2 border-[var(--hh-black)] pt-3.5">
                <div className="relative h-[104px] w-[88px] shrink-0 overflow-hidden bg-[var(--hh-bone-100)]">
                  {photoUrl ? (
                    <Image src={photoUrl} alt={b.name} fill className="object-cover grayscale" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-1 text-center">
                      <span className="hh-ui text-[9px] uppercase text-[var(--text-muted)]">
                        {b.name} photo
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="hh-ui text-base uppercase tracking-[.02em]">{b.name}</div>
                    {b.role && (
                      <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        {b.role}
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5">
                    <Button href={`/book?barber=${b._id}`} size="sm">
                      Book with {b.name}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-7">
          <Button href="/book" size="lg" full>
            Book Now
          </Button>
        </div>
      </section>
    </main>
  );
}
