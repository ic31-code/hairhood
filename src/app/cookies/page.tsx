import { BackLink, LegalSection } from "../../components/ui";

export const metadata = {
  title: "Cookie Policy — Hair Hood",
};

export default function CookiePolicyPage() {
  return (
    <main>
      <section className="hh-inverse bg-black px-5 pt-7 pb-8">
        <BackLink href="/">← Home</BackLink>
        <h1 className="hh-display mt-4 text-[clamp(40px,12vw,56px)] leading-[.88] uppercase text-white">
          Cookie Policy
        </h1>
      </section>

      <section className="bg-[var(--hh-bone-050)] px-5 pt-2 pb-16">
        <div className="flex flex-col">
          <LegalSection title="Essential">
            <p>
              Required for this site and the booking flow to work. These can&apos;t be disabled.
            </p>
          </LegalSection>

          <LegalSection title="Analytics">
            <p>Google Analytics — page views and traffic sources, so we can see how the site is used.</p>
          </LegalSection>

          <LegalSection title="Advertising">
            <p>
              Google Ads conversion tracking — measures whether an ad led to a booking. See our{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>{" "}
              for how this data is shared.
            </p>
          </LegalSection>

          <LegalSection title="Managing your choices">
            <p>
              You can accept all cookies or continue with essential only when you first visit, and change
              your choice at any time from the cookie settings link in the site footer.
            </p>
          </LegalSection>
        </div>
        {/*
          CookieYes handles consent, script-blocking, and the banner itself once the account
          exists — set NEXT_PUBLIC_COOKIEYES_ID in env and this widget renders the live,
          auto-generated cookie list instead of the static categories above.
        */}
      </section>
    </main>
  );
}
