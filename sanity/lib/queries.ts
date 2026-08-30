import { defineQuery } from "next-sanity";
import type { SanityImageSource as Image } from "@sanity/image-url";

export type DayHours = {
  day: string;
  closed?: boolean | null;
  openTime?: string | null;
  closeTime?: string | null;
};

export type SiteSettings = {
  businessName?: string | null;
  heroHeadline?: string | null;
  heroTagline?: string | null;
  heroImage?: Image | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  phone?: string | null;
  email?: string | null;
  instagramHandle?: string | null;
  instagramUrl?: string | null;
  hours?: DayHours[] | null;
};

export type FeaturedService = {
  _id: string;
  name: string;
  displayPrice?: string | null;
  durationRange?: string | null;
};

export type TeamMember = {
  _id: string;
  name: string;
  role?: string | null;
  note?: string | null;
  photo?: Image | null;
};

export type Testimonial = {
  _id: string;
  quote: string;
  author: string;
};

export type GalleryImage = {
  _id: string;
  image: Image;
  alt?: string | null;
};

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    businessName,
    heroHeadline,
    heroTagline,
    heroImage,
    addressLine1,
    addressLine2,
    phone,
    email,
    instagramHandle,
    instagramUrl,
    hours[]{ day, closed, openTime, closeTime }
  }
`);

export const FEATURED_SERVICES_QUERY = defineQuery(`
  *[_type == "service" && featured == true] | order(order asc){
    _id, name, displayPrice, durationRange
  }
`);

export const TEAM_QUERY = defineQuery(`
  *[_type == "barber" && active == true] | order(order asc){
    _id, name, role, note, photo
  }
`);

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(order asc){
    _id, quote, author
  }
`);

export const GALLERY_IMAGES_QUERY = defineQuery(`
  *[_type == "galleryImage"] | order(order asc){
    _id, image, alt
  }
`);
