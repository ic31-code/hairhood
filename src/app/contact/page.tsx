import { sanityFetch } from "../../../sanity/lib/live";
import { SITE_SETTINGS_QUERY, FAQS_QUERY, type SiteSettings, type Faq } from "../../../sanity/lib/queries";
import { BackLink } from "../../components/ui";

export default async function ContactPage() {
  const [{ data: settings }, { data: faqs }] = (await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: FAQS_QUERY }),
  ])) as [{ data: SiteSettings | null }, { data: Faq[] }];

  return (
    <main>
      <section className="hh-inverse bg-black px-5 pt-7 pb-8">
        <BackLink href="/">← Home</BackLink>
        <h1 className="hh-display mt-4 text-[clamp(40px,12vw,56px)] leading-[.88] uppercase text-white">
          Contact &amp; FAQ
        </h1>
      </section>

      <section className="bg-[var(--hh-bone-050)] px-5 pt-7 pb-2">
        <div className="flex flex-col gap-2.5 border-t-2 border-[var(--hh-black)] pt-4">
          {settings?.phone && (
            <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hh-ui text-sm tracking-[.02em] text-[var(--hh-black)]">
              {settings.phone}
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="hh-ui text-sm tracking-[.02em] text-[var(--hh-black)]">
              {settings.email}
            </a>
          )}
          <span className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>
            {settings?.addressLine1}, {settings?.addressLine2}
          </span>
        </div>
      </section>

      <section className="bg-[var(--hh-bone-050)] px-5 pt-8 pb-16">
        <h2 className="hh-display text-[clamp(24px,7vw,30px)] leading-[.9] uppercase text-[var(--hh-black)]">
          FAQ
        </h2>
        <div className="mt-3 flex flex-col">
          {(faqs ?? []).map((f) => (
            <div key={f._id} className="border-t border-[var(--border-hairline,rgba(0,0,0,.12))] py-4">
              <div className="hh-ui text-[13px] uppercase tracking-[.02em] text-[var(--hh-black)]">
                {f.question}
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
