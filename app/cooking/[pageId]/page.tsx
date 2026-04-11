import SectionContainer from '@/components/SectionContainer'
import NoteContent from '@/components/NoteContent'
import Breadcrumb from '@/components/Breadcrumb'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'
import { UtensilsCrossed } from 'lucide-react'

type PageProps = {
  params: Promise<{ pageId: string }>
}

export const metadata: Metadata = genPageMetadata({
  title: 'Dish',
})

export default async function CookingDetailPage({ params }: PageProps) {
  const { pageId } = await params

  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div className="space-y-2 pb-4 pt-6 md:space-y-5">
          <Breadcrumb
            items={[
              {
                href: '/cooking',
                label: 'Cooking',
                icon: <UtensilsCrossed className="h-4 w-4 shrink-0" aria-hidden="true" />,
              },
              {
                href: `/cooking/${pageId}`,
                label: pageId,
                icon: <UtensilsCrossed className="h-4 w-4 shrink-0" aria-hidden="true" />,
              },
            ]}
          />
        </div>
        <div className="py-1">
          <NoteContent pageId={pageId} apiBasePath="/api/cooking" />
        </div>
      </div>
    </SectionContainer>
  )
}
