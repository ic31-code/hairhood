import { UserIcon } from '@sanity/icons/User'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const barber = defineType({
  name: 'barber',
  title: 'Barber',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. "Owner · Senior Barber"',
    }),
    defineField({
      name: 'note',
      title: 'Short note',
      type: 'string',
      description: 'One-line specialty shown when picking a barber, e.g. "Skin fades and cutthroat work."',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Longer bio for the About page',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'pricing',
      title: 'Services & pricing',
      description: 'What this barber charges and how long each service takes them',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'servicePrice',
          fields: [
            defineField({
              name: 'service',
              title: 'Service',
              type: 'reference',
              to: [{ type: 'service' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price (£)',
              type: 'number',
              validation: (Rule) => Rule.required().positive(),
            }),
            defineField({
              name: 'durationMinutes',
              title: 'Duration (minutes)',
              type: 'number',
              validation: (Rule) => Rule.required().positive(),
            }),
          ],
          preview: {
            select: { title: 'service.name', price: 'price', duration: 'durationMinutes' },
            prepare({ title, price, duration }) {
              return {
                title: title || 'Untitled service',
                subtitle: [price ? `£${price}` : null, duration ? `${duration} min` : null]
                  .filter(Boolean)
                  .join(' · '),
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'active',
      title: 'Currently taking bookings',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
    }),
  ],
  orderings: [{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
