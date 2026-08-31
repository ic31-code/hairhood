import { defineQuery } from "next-sanity";
import type { SanityImageSource as Image } from "@sanity/image-url";

export type DayHours = {
  day: string;
  closed?: boolean | null;
  openTime?: string | null;
  closeTime?: string | null;
};

export type PortableBlock = {
  _key: string;
  children?: { text?: string }[];
};

export type SiteSettings = {
  businessName?: string | null;
  heroHeadline?: string | null;
  heroTagline?: string | null;
  heroImage?: Image | null;
  aboutHeroImage?: Image | null;
  aboutIntro?: PortableBlock[] | null;
  aboutSignature?: string | null;
  aboutImages?: Image[] | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  phone?: string | null;
  email?: string | null;
  instagramHandle?: string | null;
  instagramUrl?: string | null;
  whatsappUrl?: string | null;
  hours?: DayHours[] | null;
};

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    businessName,
    heroHeadline,
    heroTagline,
    heroImage,
    aboutHeroImage,
    aboutIntro,
    aboutSignature,
    aboutImages,
    addressLine1,
    addressLine2,
    phone,
    email,
    instagramHandle,
    instagramUrl,
    whatsappUrl,
    hours[]{ day, closed, openTime, closeTime }
  }
`);

export type FeaturedService = {
  _id: string;
  name: string;
  displayPrice?: string | null;
  durationRange?: string | null;
};

export const FEATURED_SERVICES_QUERY = defineQuery(`
  *[_type == "service" && featured == true] | order(order asc){
    _id, name, displayPrice, durationRange
  }
`);

export type ServiceAddOn = {
  _id: string;
  name: string;
  price: number;
  durationMinutes: number;
  eligibleBarberIds: string[];
};

export type ServiceListing = {
  _id: string;
  name: string;
  category: string;
  durationRange?: string | null;
  displayPrice?: string | null;
  addOns?: ServiceAddOn[] | null;
};

export const ALL_SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(order asc){
    _id, name, category, durationRange, displayPrice,
    addOns[]->{ _id, name, price, durationMinutes, "eligibleBarberIds": eligibleBarbers[]->_id }
  }
`);

export type TeamMember = {
  _id: string;
  name: string;
  role?: string | null;
  note?: string | null;
  bio?: string | null;
  photo?: Image | null;
};

export const TEAM_QUERY = defineQuery(`
  *[_type == "barber" && active == true] | order(order asc){
    _id, name, role, note, bio, photo
  }
`);

export type BarberPrice = {
  serviceId: string;
  price: number;
  durationMinutes: number;
};

export type BookingBarber = {
  _id: string;
  name: string;
  role?: string | null;
  note?: string | null;
  pricing?: BarberPrice[] | null;
};

export const BOOKING_BARBERS_QUERY = defineQuery(`
  *[_type == "barber" && active == true] | order(order asc){
    _id, name, role, note,
    pricing[]{ "serviceId": service->_id, price, durationMinutes }
  }
`);

export type Testimonial = {
  _id: string;
  quote: string;
  author: string;
};

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(order asc){
    _id, quote, author
  }
`);

export type GalleryImage = {
  _id: string;
  image: Image;
  alt?: string | null;
};

export const GALLERY_IMAGES_QUERY = defineQuery(`
  *[_type == "galleryImage"] | order(order asc){
    _id, image, alt
  }
`);

export type Faq = {
  _id: string;
  question: string;
  answer: string;
};

export const FAQS_QUERY = defineQuery(`
  *[_type == "faq"] | order(order asc){
    _id, question, answer
  }
`);
