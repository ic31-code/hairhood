export type GoogleReview = {
  id: string;
  quote: string;
  author: string;
  rating: number;
};

const FIELD_MASK = "reviews.text,reviews.rating,reviews.authorAttribution,reviews.publishTime";

type PlaceDetailsResponse = {
  reviews?: Array<{
    text?: { text?: string };
    rating?: number;
    authorAttribution?: { displayName?: string };
    publishTime?: string;
  }>;
};

// Google Places API (New) — Place Details. Requires GOOGLE_PLACES_API_KEY and
// GOOGLE_PLACE_ID. Returns at most 5 reviews, chosen by Google as "most relevant";
// callers can't pick which ones. Revalidated hourly per Google's caching terms.
export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return [];

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as PlaceDetailsResponse;

    return (data.reviews ?? [])
      .filter((r) => r.text?.text && r.authorAttribution?.displayName)
      .map((r, i) => ({
        id: r.publishTime ?? String(i),
        quote: r.text!.text!,
        author: r.authorAttribution!.displayName!,
        rating: r.rating ?? 5,
      }));
  } catch {
    return [];
  }
}
