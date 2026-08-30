import { TagIcon } from '@sanity/icons/Tag'
import { defineField, defineType } from 'sanity'

export const SERVICE_CATEGORIES = [
  { title: 'Cuts', value: 'cuts' },
  { title: 'Beards', value: 'beards' },
  { title: 'Hot towel shaves', value: 'shaves' },
  { title: 'Students', value: 'students' },
]

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: SERVICE_CATEGORIES, layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'durationRange',
      title: 'Duration (display)',
      type: 'string',
      description: 'Shown on the price list before a barber is picked, e.g. "20–30 min"',
    }),
    defineField({
      name: 'displayPrice',
      title: 'Display price',
      type: 'string',
      description: 'Shown on the price list before a barber is picked, e.g. "£22" or "from £27"',
    }),
    defineField({
      name: 'addOns',
      title: 'Available add-ons',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'addOn' }] }],
    }),
    defineField({
      name: 'featured',
      title: 'Show in homepage teaser',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
    }),
  ],
  orderings: [{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'displayPrice' },
  },
})
