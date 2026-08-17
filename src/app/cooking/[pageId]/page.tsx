import SectionContainer from '@/components/SectionContainer'
import NoteContent from '@/components/NoteContent'
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
                <BreadcrumbLink asChild>
                  <Link href="/cooking">Cooking</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageId}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="py-1">
          <NoteContent pageId={pageId} apiBasePath="/api/cooking" />
        </div>
      </div>
    </SectionContainer>
  )
}
