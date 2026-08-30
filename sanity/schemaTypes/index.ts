import { type SchemaTypeDefinition } from 'sanity'

import { addOn } from './documents/addOn'
import { barber } from './documents/barber'
import { faq } from './documents/faq'
import { galleryImage } from './documents/galleryImage'
import { service } from './documents/service'
import { siteSettings } from './documents/siteSettings'
import { testimonial } from './documents/testimonial'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, barber, service, addOn, testimonial, faq, galleryImage],
}
