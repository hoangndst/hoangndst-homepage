import SectionContainer from '@/components/SectionContainer'
import NotionTable from '@/components/NotionTable'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const metadata: Metadata = genPageMetadata({
  title: 'Cooking',
})

export default function CookingPage() {
  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div className="flex flex-col gap-2 pb-4 pt-6 md:gap-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cooking</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="py-1">
          <NotionTable apiPath="/api/cooking" rowLinkPrefix="/cooking" dateFormat="long" />
        </div>
      </div>
    </SectionContainer>
  )
}
