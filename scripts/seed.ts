/**
 * Seeds the Sanity dataset from the content hardcoded in
 * `HairHood Mobile Home.dc.html` (barbers, services, pricing, add-ons,
 * testimonials, FAQs, hours) plus the real photos in `uploads/`.
 *
 * Run with: npx sanity exec scripts/seed.ts --with-user-token
 */

import fs from 'node:fs'
import path from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-30' })

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads')

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function uploadImage(filename: string) {
  const filePath = path.join(UPLOADS_DIR, filename)
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), { filename })
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } }
}

function textBlock(text: string, key: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
  }
}

type ServiceSeed = {
  id: string
  name: string
  category: 'cuts' | 'beards' | 'shaves' | 'students'
  durationRange: string
  displayPrice: string
  addOns?: string[]
  featured?: boolean
}

// The six primitives the booking flow prices per-barber
const BASE_SERVICE_DOC_ID: Record<string, string> = {
  haircut: 'service-haircut',
  skinfade: 'service-skin-fade',
  taper: 'service-taper-fade',
  scissor: 'service-scissor-cut',
  beard: 'service-beard-trim',
  hottowel: 'service-hot-towel-face-shave',
}

const BARBERS = [
  { id: 'amir', name: 'Amir', role: 'Owner · Senior Barber', note: 'Skin fades and cutthroat work.' },
  { id: 'hamid', name: 'Hamid', role: 'Junior Barber', note: 'Fades taken clean to the skin.' },
  { id: 'saahil', name: 'Saahil', role: 'Apprentice Barber', note: 'Crops, tapers and steady hands.' },
  { id: 'arthur', name: 'Arthur', role: 'Barber', note: 'Classic cuts and beard shaping.' },
]

const BARBER_PRICING: Record<string, Record<string, [number, number]>> = {
  amir: {
    haircut: [24, 20],
    skinfade: [29, 40],
    taper: [26, 30],
    scissor: [25, 25],
    beard: [15, 15],
    hottowel: [25, 40],
  },
  hamid: { haircut: [20, 25], skinfade: [24, 45], taper: [22, 35], scissor: [21, 30], beard: [13, 20] },
  saahil: { haircut: [15, 30], taper: [18, 40], scissor: [16, 35], beard: [10, 20] },
  arthur: {
    haircut: [22, 25],
    skinfade: [27, 45],
    taper: [24, 35],
    scissor: [23, 30],
    beard: [15, 20],
    hottowel: [25, 40],
  },
}

const ADD_ONS = [
  { id: 'addOn-beardline', name: 'Beard line-up', price: 8, durationMinutes: 10, barbers: ['amir', 'hamid', 'arthur'] },
  { id: 'addOn-hottowelfinish', name: 'Hot towel finish', price: 6, durationMinutes: 10, barbers: ['amir', 'arthur'] },
]

const SERVICES: ServiceSeed[] = [
  {
    id: 'service-haircut',
    name: 'Haircut',
    category: 'cuts',
    durationRange: '20–30 min',
    displayPrice: '£22',
    addOns: ['addOn-beardline', 'addOn-hottowelfinish'],
    featured: true,
  },
  {
    id: 'service-skin-fade',
    name: 'Skin fade',
    category: 'cuts',
    durationRange: '40–50 min',
    displayPrice: '£27',
    addOns: ['addOn-beardline', 'addOn-hottowelfinish'],
    featured: true,
  },
  {
    id: 'service-taper-fade',
    name: 'Taper fade',
    category: 'cuts',
    durationRange: '30–40 min',
    displayPrice: '£24',
    addOns: ['addOn-beardline', 'addOn-hottowelfinish'],
  },
  {
    id: 'service-scissor-cut',
    name: 'Scissor cut',
    category: 'cuts',
    durationRange: '25–35 min',
    displayPrice: '£23',
    addOns: ['addOn-beardline'],
  },
  { id: 'service-crew-cut', name: 'Crew cut', category: 'cuts', durationRange: '15–25 min', displayPrice: '£15' },
  { id: 'service-long-hair', name: 'Long hair', category: 'cuts', durationRange: '45–55 min', displayPrice: '£29' },
  {
    id: 'service-haircut-beard-trim',
    name: 'Haircut & beard trim',
    category: 'beards',
    durationRange: '35–45 min',
    displayPrice: '£30',
  },
  {
    id: 'service-skin-fade-beard-trim',
    name: 'Skin fade & beard trim',
    category: 'beards',
    durationRange: '50–60 min',
    displayPrice: '£35',
  },
  {
    id: 'service-beard-trim',
    name: 'Beard trim',
    category: 'beards',
    durationRange: '15–25 min',
    displayPrice: '£15',
    featured: true,
  },
  {
    id: 'service-haircut-hot-towel-shave',
    name: 'Haircut & hot towel shave',
    category: 'shaves',
    durationRange: '45–55 min',
    displayPrice: '£35',
  },
  {
    id: 'service-hot-towel-face-shave',
    name: 'Hot towel face shave',
    category: 'shaves',
    durationRange: '40 min',
    displayPrice: '£25',
    featured: true,
  },
  {
    id: 'service-hot-towel-head-shave',
    name: 'Hot towel head shave',
    category: 'shaves',
    durationRange: '40 min',
    displayPrice: '£25',
  },
  {
    id: 'service-student-haircut',
    name: 'Student haircut',
    category: 'students',
    durationRange: '20–30 min',
    displayPrice: '£20',
  },
  {
    id: 'service-student-skin-fade',
    name: 'Student skin fade',
    category: 'students',
    durationRange: '40–50 min',
    displayPrice: '£25',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Great, expert, friendly and welcoming service from Amir — we will definitely be back!',
    author: 'Daniel R.',
  },
  { quote: "Best fade I've had in Bristol. Clean lines, no rushing.", author: 'Sam K.' },
  { quote: 'Hamid took real care with a tricky beard line. Spot on.', author: 'Josh M.' },
  { quote: 'Books up fast for a reason. Worth the wait.', author: 'Alex P.' },
  { quote: 'Walked in nervous about a skin fade, walked out delighted.', author: 'Tom H.' },
]

const FAQS = [
  { question: 'Do you take walk-ins?', answer: 'Welcome when a chair is free. Friday and Saturday, book ahead.' },
  {
    question: 'Do you offer a student price?',
    answer: 'Yes — reduced prices on cuts, fades and tapers. Bring your card.',
  },
  { question: 'How do I pay?', answer: 'Card and cash. Booking deposits are taken through Square.' },
  {
    question: 'Do I need to book?',
    answer: "Booking is safer, especially at weekends, but walk-ins are always welcome when there's a free chair.",
  },
]

const HOURS = [
  { day: 'Monday', closed: false, openTime: '10:00', closeTime: '18:00' },
  { day: 'Tuesday', closed: false, openTime: '09:00', closeTime: '19:00' },
  { day: 'Wednesday', closed: false, openTime: '09:00', closeTime: '19:00' },
  { day: 'Thursday', closed: false, openTime: '09:00', closeTime: '19:00' },
  { day: 'Friday', closed: false, openTime: '09:00', closeTime: '19:00' },
  { day: 'Saturday', closed: false, openTime: '09:00', closeTime: '17:00' },
  { day: 'Sunday', closed: true },
]

async function main() {
  console.log('Uploading images from uploads/…')
  const [heroImage, aboutHeroImage, barImage, portraitImage, galleryImage1] = await Promise.all([
    uploadImage('hero.webp'),
    uploadImage('hero landscape.JPG'),
    uploadImage('bar.JPG'),
    uploadImage('heo portrait.JPG'),
    uploadImage('IMG_5572.PNG'),
  ])

  console.log('Building transaction…')
  const tx = client.transaction()

  for (const a of ADD_ONS) {
    tx.createOrReplace({
      _id: a.id,
      _type: 'addOn',
      name: a.name,
      price: a.price,
      durationMinutes: a.durationMinutes,
      eligibleBarbers: a.barbers.map((id) => ({ _type: 'reference', _ref: `barber-${id}`, _key: id })),
    })
  }

  SERVICES.forEach((s, i) => {
    tx.createOrReplace({
      _id: s.id,
      _type: 'service',
      name: s.name,
      slug: { _type: 'slug', current: slugify(s.name) },
      category: s.category,
      durationRange: s.durationRange,
      displayPrice: s.displayPrice,
      featured: Boolean(s.featured),
      order: i + 1,
      addOns: (s.addOns ?? []).map((ref) => ({ _type: 'reference', _ref: ref, _key: ref })),
    })
  })

  BARBERS.forEach((b, i) => {
    const pricing = BARBER_PRICING[b.id]
    tx.createOrReplace({
      _id: `barber-${b.id}`,
      _type: 'barber',
      name: b.name,
      role: b.role,
      note: b.note,
      active: true,
      order: i + 1,
      pricing: Object.entries(pricing).map(([baseId, [price, durationMinutes]]) => ({
        _type: 'servicePrice',
        _key: baseId,
        service: { _type: 'reference', _ref: BASE_SERVICE_DOC_ID[baseId] },
        price,
        durationMinutes,
      })),
    })
  })

  TESTIMONIALS.forEach((t, i) => {
    tx.createOrReplace({
      _id: `testimonial-${i + 1}`,
      _type: 'testimonial',
      quote: t.quote,
      author: t.author,
      order: i + 1,
    })
  })

  FAQS.forEach((f, i) => {
    tx.createOrReplace({ _id: `faq-${i + 1}`, _type: 'faq', question: f.question, answer: f.answer, order: i + 1 })
  })

  tx.createOrReplace({
    _id: 'galleryImage-1',
    _type: 'galleryImage',
    image: galleryImage1,
    alt: 'Fresh cut at Hair Hood, Bristol',
    order: 1,
  })

  tx.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    businessName: 'Hair Hood',
    heroHeadline: 'Sharp, every time',
    heroTagline: 'Welcome to my hood',
    heroImage,
    aboutHeroImage,
    aboutIntro: [
      "Hi, and welcome to my hood. I'm Amir, and I've been barbering for over a decade.",
      'My top priority is a quality, high-end service — while you stay comfortable and relaxed with a drink in hand.',
      'A haircut is measurement, angle and pressure. Get those right and it grows out well for six weeks.',
      "There's a bar at the back, monochrome prints on the wall, and a set of jewel-studded antlers nobody expects. Take a drink while you wait. Ask about any of it.",
    ].map((text, i) => textBlock(text, `about-${i}`)),
    aboutSignature: '— Amir Baghery',
    aboutImages: [barImage, portraitImage],
    addressLine1: '91B Whiteladies Road',
    addressLine2: 'Clifton, Bristol BS8 2NT',
    phone: '07307 453917',
    email: 'amir@hairhood.co.uk',
    instagramHandle: '@hairhood_',
    instagramUrl: 'https://instagram.com',
    hours: HOURS.map((h, i) => ({ _type: 'dayHours', _key: `day-${i}`, ...h })),
  })

  console.log('Committing…')
  const result = await tx.commit()
  console.log(`Done — wrote ${result.results.length} documents.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
