/**
 * This route is responsible for the built-in Sanity Studio that's mounted on the `/studio` route
 */

'use client'

import { NextStudio } from 'next-sanity/studio/client-component'

import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
