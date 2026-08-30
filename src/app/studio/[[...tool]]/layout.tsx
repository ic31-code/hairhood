import { NextStudioLayout, metadata, viewport } from 'next-sanity/studio'

export { metadata, viewport }

export const dynamic = 'force-static'

export default function StudioRouteLayout({ children }: LayoutProps<'/studio/[[...tool]]'>) {
  return <NextStudioLayout>{children}</NextStudioLayout>
}
