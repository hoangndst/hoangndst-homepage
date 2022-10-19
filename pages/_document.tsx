import Document, { DocumentContext, DocumentInitialProps, Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import theme from 'libs/theme';
const PRODUCTION_DEPLOYEMENT = !process.env.PULL_REQUEST && process.env.NODE_ENV === 'production';

const GOOGLE_ANALYTICS_ID = PRODUCTION_DEPLOYEMENT ? 'UA-106598593-2' : 'UA-106598593-3';
class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/*
            manifest.json provides metadata used when your web app is added to the
            homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
          */}
          {/* PWA primary color */}
          <link rel="shortcut icon" href="/logo.png" />
          {/* iOS Icon */}
          <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
          <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap"
            rel="stylesheet"
          />
          <style
            // the above <link> does not work in mobile device, this inline <style> fixes it without blocking resources
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `@font-face{font-family:'PlusJakartaSans-ExtraBold';font-style:normal;font-weight:800;font-display:swap;src:url('/static/fonts/PlusJakartaSans-ExtraBold-subset.woff2') format('woff2');}`,
            }}
          />
          <style
            // the above <link> does not work in mobile device, this inline <style> fixes it without blocking resources
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `@font-face{font-family:'PlusJakartaSans-Bold';font-style:normal;font-weight:700;font-display:swap;src:url('/static/fonts/PlusJakartaSans-Bold-subset.woff2') format('woff2');}`,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `@font-face{font-family:'IBM Plex Sans';src:url(/static/fonts/IBMPlexSans-Regular.woff2) format('woff2'),url(/static/fonts/IBMPlexSans-Regular.woff) format('woff'),url(/static/fonts/IBMPlexSans-Regular.ttf) format('truetype');font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:'IBM Plex Sans';src:url(/static/fonts/IBMPlexSans-Medium.woff2) format('woff2'),url(/static/fonts/IBMPlexSans-Medium.woff) format('woff'),url(/static/fonts/IBMPlexSans-Medium.ttf) format('truetype');font-weight:500;font-style:normal;font-display:swap}@font-face{font-family:'IBM Plex Sans';src:url(/static/fonts/IBMPlexSans-SemiBold.woff2) format('woff2'),url(/static/fonts/IBMPlexSans-SemiBold.woff) format('woff'),url(/static/fonts/IBMPlexSans-SemiBold.ttf) format('truetype');font-weight:600;font-style:normal;font-display:swap}@font-face{font-family:'IBM Plex Sans';src:url(/static/fonts/IBMPlexSans-Bold.woff2) format('woff2'),url(/static/fonts/IBMPlexSans-Bold.woff) format('woff'),url(/static/fonts/IBMPlexSans-Bold.ttf) format('truetype');font-weight:700;font-style:normal;font-display:swap}`,
            }}
          />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
                window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                window.ga('create','${GOOGLE_ANALYTICS_ID}',{
                  sampleRate: ${PRODUCTION_DEPLOYEMENT ? 80 : 100},
                });
              `,
            }}
          />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument