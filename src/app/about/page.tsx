import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
import { getAuthor, authorLoaders, hasAuthorLoader } from '@/lib/content'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = genPageMetadata({ title: 'About' })

export default async function Page() {
  const author = getAuthor('default')
  if (!author || !hasAuthorLoader(author.slug)) {
    return notFound()
  }

  const { default: AuthorContent } = await authorLoaders[author.slug]()

  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <AuthorLayout content={author}>
          <AuthorContent />
        </AuthorLayout>
      </div>
    </SectionContainer>
  )
}
