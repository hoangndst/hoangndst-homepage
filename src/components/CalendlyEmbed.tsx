'use client'

import Script from 'next/script'

const calendlyUrl = 'https://calendly.com/steven-getspektro/30min'

export default function CalendlyEmbed() {
  return (
    <>
      <div
        className="calendly-inline-widget border-border/70 bg-background min-h-[700px] w-full overflow-hidden border"
        data-url={calendlyUrl}
        style={{ minWidth: 320, height: 700 }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
    </>
  )
}
