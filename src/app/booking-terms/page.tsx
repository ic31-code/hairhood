import { BackLink, LegalSection } from "../../components/ui";

export const metadata = {
  title: "Booking Terms — Hair Hood",
};

export default function BookingTermsPage() {
  return (
    <main>
      <section className="hh-inverse bg-black px-5 pt-7 pb-8">
        <BackLink href="/">← Home</BackLink>
        <h1 className="hh-display mt-4 text-[clamp(40px,12vw,56px)] leading-[.88] uppercase text-white">
          Booking Terms
        </h1>
      </section>

      <section className="bg-[var(--hh-bone-050)] px-5 pt-2 pb-16">
        <div className="flex flex-col">
          <LegalSection title="Confirmation">
            <p>Bookings made through this site are confirmed instantly.</p>
          </LegalSection>

          <LegalSection title="Cancellations">
            <p>Please give us at least 24 hours&apos; notice if you need to cancel or reschedule.</p>
          </LegalSection>

          <LegalSection title="Arriving late">
            <p>
              If you arrive significantly late, your appointment may need to be shortened or rebooked,
              depending on availability.
            </p>
          </LegalSection>

          <LegalSection title="Right to refuse">
            <p>We reserve the right to decline a booking at our discretion.</p>
          </LegalSection>
        </div>
      </section>
    </main>
  );
}
