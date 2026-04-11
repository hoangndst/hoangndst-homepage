import SectionContainer from '@/components/SectionContainer'
import Breadcrumb from '@/components/Breadcrumb'
import NotionTable from '@/components/NotionTable'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = genPageMetadata({
  title: 'Cooking',
})

export default function CookingPage() {
  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div className="space-y-2 pb-4 pt-6 md:space-y-5">
          <Breadcrumb />
        </div>
        <div className="py-1">
          <NotionTable apiPath="/api/cooking" rowLinkPrefix="/cooking" dateFormat="long" />
        </div>
      </div>
    </SectionContainer>
  )
}
