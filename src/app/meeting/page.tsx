import type { Metadata } from 'next'
import NextLink from 'next/link'
import { genPageMetadata } from 'app/seo'

import CalendlyEmbed from '@/components/CalendlyEmbed'
import SectionContainer from '@/components/SectionContainer'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const metadata: Metadata = genPageMetadata({ title: 'Meeting' })

export default function MeetingPage() {
  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div className="pb-8 pt-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <NextLink href="/">Home</NextLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Meeting</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <header className="border-border/70 border-b pb-8">
          <p className="text-muted-foreground mb-3 font-mono text-xs uppercase tracking-[0.18em]">
            Open calendar
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Book a conversation
          </h1>
          <p className="text-muted-foreground mt-4 text-base leading-7">
            Choose a time to chat.
          </p>
        </header>

        <div className="mt-8">
          <CalendlyEmbed />
        </div>
      </div>
    </SectionContainer>
  )
}
