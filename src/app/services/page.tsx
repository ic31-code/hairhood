import Link from "next/link";

import { sanityFetch } from "../../../sanity/lib/live";
import { ALL_SERVICES_QUERY, type ServiceListing } from "../../../sanity/lib/queries";
import { BackLink, ServiceRow } from "../../components/ui";

const CATEGORY_LABELS: Record<string, string> = {
  cuts: "Cuts",
  beards: "Beards",
  shaves: "Hot towel shaves",
  students: "Students",
};

const CATEGORY_ORDER = ["cuts", "beards", "shaves", "students"];

export default async function ServicesPage() {
  const { data: services } = (await sanityFetch({ query: ALL_SERVICES_QUERY })) as {
    data: ServiceListing[];
  };

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    items: (services ?? []).filter((s) => s.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <main>
      <section className="hh-inverse bg-black px-5 pt-7 pb-8">
        <BackLink href="/">← Home</BackLink>
        <span className="hh-eyebrow mt-4 block">The menu</span>
        <h1 className="hh-display mt-2 text-[clamp(40px,12vw,56px)] leading-[.88] uppercase text-white">
          Cuts &amp; prices
        </h1>
      </section>
      <section className="bg-[var(--hh-bone-050)] px-5 pt-2 pb-24">
        {grouped.map((g) => (
          <div key={g.category} className="mt-8 border-t-2 border-[var(--hh-black)] pt-3">
            <h2 className="hh-display text-[clamp(24px,7vw,30px)] leading-[.9] uppercase text-[var(--hh-black)]">
              {g.label}
            </h2>
            <div className="mt-2">
              {g.items.map((s) => (
                <Link key={s._id} href={`/book?service=${s._id}`} className="block">
                  <ServiceRow name={s.name} duration={s.durationRange} price={s.displayPrice} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
