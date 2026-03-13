import DocumentsComponent from '@/components/Documents'
import { genPageMetadata } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata = genPageMetadata({ title: 'Documents' })

export default function Documents() {
  return (
    <SectionContainer>
      <div>
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <Breadcrumb />
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
