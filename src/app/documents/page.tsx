import DocumentsComponent from '@/components/Documents'
import { genPageMetadata } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
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

export const metadata: Metadata = genPageMetadata({ title: 'Documents' })

export default function Documents() {
  return (
    <SectionContainer>
      <div>
        <div className="flex flex-col gap-2 pb-8 pt-6 md:gap-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Documents</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="container py-12">
          <div className="flex flex-wrap">
            <DocumentsComponent />
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
