import { sanityFetch } from "../../../sanity/lib/live";
import {
  ALL_SERVICES_QUERY,
  BOOKING_BARBERS_QUERY,
  type ServiceListing,
  type BookingBarber,
} from "../../../sanity/lib/queries";
import { BookingFlow } from "../../components/booking-flow";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; barber?: string }>;
}) {
  const params = await searchParams;
  const [{ data: services }, { data: barbers }] = (await Promise.all([
    sanityFetch({ query: ALL_SERVICES_QUERY }),
    sanityFetch({ query: BOOKING_BARBERS_QUERY }),
  ])) as [{ data: ServiceListing[] }, { data: BookingBarber[] }];

  return (
    <BookingFlow
      services={services ?? []}
      barbers={barbers ?? []}
      initialServiceId={params.service ?? null}
      initialBarberId={params.barber ?? null}
    />
  );
}
