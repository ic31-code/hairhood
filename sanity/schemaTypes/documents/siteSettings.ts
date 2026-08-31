import { CogIcon } from '@sanity/icons/Cog'
import { defineField, defineType } from 'sanity'

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'businessName',
      title: 'Business name',
      type: 'string',
      initialValue: 'Hair Hood',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero headline',
      type: 'string',
      description: 'e.g. "Sharp, every time"',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero tagline',
      type: 'string',
      description: 'The script-font line under the headline, e.g. "Welcome to my hood"',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutHeroImage',
      title: 'About page header image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutIntro',
      title: 'About intro',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The "word from the owner" paragraphs on the About page',
    }),
    defineField({
      name: 'aboutSignature',
      title: 'About signature',
      type: 'string',
      description: 'e.g. "— Amir Baghery"',
    }),
    defineField({
      name: 'aboutImages',
      title: 'About page images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'addressLine1',
      title: 'Address line 1',
      type: 'string',
    }),
    defineField({
      name: 'addressLine2',
      title: 'Address line 2',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram handle',
      type: 'string',
      description: 'e.g. "@hairhood_"',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'whatsappUrl',
      title: 'WhatsApp URL',
      type: 'url',
      description: 'Full click-to-chat link, e.g. "https://wa.me/447123456789"',
    }),
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'dayHours',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              options: { list: WEEKDAYS },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'closed',
              title: 'Closed',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'openTime',
              title: 'Open',
              type: 'string',
              description: 'e.g. "09:00"',
            }),
            defineField({
              name: 'closeTime',
              title: 'Close',
              type: 'string',
              description: 'e.g. "19:00"',
            }),
          ],
          preview: {
            select: { day: 'day', open: 'openTime', close: 'closeTime', closed: 'closed' },
            prepare({ day, open, close, closed }) {
              return { title: day, subtitle: closed ? 'Closed' : `${open ?? '?'} – ${close ?? '?'}` }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' }
    },
  },
})
