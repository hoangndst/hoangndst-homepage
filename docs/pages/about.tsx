import * as React from 'react';
import Head from 'docs/src/modules/components/Head';
import AppHeader from 'docs/src/layouts/AppHeader';
import AppFooter from 'docs/src/layouts/AppFooter';
import BrandingCssVarsProvider from 'docs/src/BrandingCssVarsProvider';
import AppHeaderBanner from 'docs/src/components/banner/AppHeaderBanner';
import { AboutContent } from 'docs/pages/index'

export default function Home() {
  return (
    <BrandingCssVarsProvider>
      <Head
        title="About me - @hoangndst" description={''}
      />
      <AppHeaderBanner />
      <AppHeader />
      <main id="main-content">
        <AboutContent />
      </main>
      <AppFooter />
    </BrandingCssVarsProvider>
  );
}
