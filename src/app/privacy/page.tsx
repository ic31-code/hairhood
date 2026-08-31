import { sanityFetch } from "../../../sanity/lib/live";
import { SITE_SETTINGS_QUERY, type SiteSettings } from "../../../sanity/lib/queries";
import { BackLink, LegalSection } from "../../components/ui";

export const metadata = {
  title: "Privacy Policy — Hair Hood",
};

export default async function PrivacyPage() {
  const { data: settings } = (await sanityFetch({ query: SITE_SETTINGS_QUERY })) as {
    data: SiteSettings | null;
  };

  const address = [settings?.addressLine1, settings?.addressLine2].filter(Boolean).join(", ");
  const contactLine = settings?.phone
    ? `by phone on ${settings.phone}`
    : "using the contact details on this site";

  return (
    <main>
      <section className="hh-inverse bg-black px-5 pt-7 pb-8">
        <BackLink href="/">← Home</BackLink>
        <h1 className="hh-display mt-4 text-[clamp(40px,12vw,56px)] leading-[.88] uppercase text-white">
          Privacy Policy
        </h1>
      </section>

      <section className="bg-[var(--hh-bone-050)] px-5 pt-2 pb-16">
        <div className="flex flex-col">
          <LegalSection title="Who we are">
            <p>
              Hair Hood{address ? `, ${address},` : ","} is the data controller for this website and the
              personal data described below.
            </p>
          </LegalSection>

          <LegalSection title="What we collect">
            <p>
              When you make a booking we collect your name, phone number, email address and appointment
              details. If you contact us directly, we keep a record of that too.
            </p>
          </LegalSection>

          <LegalSection title="Why we collect it">
            <p>
              To create and manage your booking via Square, our booking and payments provider, to contact
              you about your appointment, and to respond to enquiries.
            </p>
          </LegalSection>

          <LegalSection title="Legal basis">
            <p>
              Processing your booking is necessary to perform our contract with you. Anything beyond that is
              only done with your consent.
            </p>
          </LegalSection>

          <LegalSection title="Who we share it with">
            <p>
              Square, who process and store booking data on our behalf. We also share booking data with
              Google in aggregated form, for ad performance measurement — see our{" "}
              <a href="/cookies" className="underline">
                Cookie Policy
              </a>{" "}
              for details. We don&apos;t sell your data.
            </p>
          </LegalSection>

          <LegalSection title="Retention">
            <p>
              We keep your data while you&apos;re an active customer, plus 2 years afterwards for
              record-keeping, then delete it.
            </p>
          </LegalSection>

          <LegalSection title="Your rights">
            <p>
              You have the right to access, correct, delete, or object to how we use your data. To exercise
              any of these rights, contact us {contactLine}. You can also complain to the Information
              Commissioner&apos;s Office at{" "}
              <a href="https://ico.org.uk" target="_blank" rel="noopener" className="underline">
                ico.org.uk
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="Changes to this policy">
            <p>We&apos;ll update this policy if our data practices change.</p>
          </LegalSection>
        </div>
      </section>
    </main>
  );
}
