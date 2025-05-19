import DocumentsComponent from '@/components/Documents'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Documents' })

export default function Documents() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Documents
          </h1>
        </div>
        <div className="container py-12">
          <div className="flex flex-wrap">
            <DocumentsComponent />
          </div>
        </div>
      </div>
    </>
  )
}
