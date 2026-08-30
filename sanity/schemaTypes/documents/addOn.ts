import { AddCircleIcon } from '@sanity/icons/AddCircle'
import { defineField, defineType } from 'sanity'

export const addOn = defineType({
  name: 'addOn',
  title: 'Add-on',
  type: 'document',
  icon: AddCircleIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
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
    defineField({
      name: 'eligibleBarbers',
      title: 'Offered by',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'barber' }] }],
      description: 'Which barbers offer this add-on',
    }),
  ],
  preview: {
    select: { title: 'name', price: 'price' },
    prepare({ title, price }) {
      return { title, subtitle: price ? `+£${price}` : undefined }
    },
  },
})
