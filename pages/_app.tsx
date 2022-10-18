import type { AppProps } from "next/app";
import Chakra from "../src/components/chakra";
import Layout from '../src/components/layouts/main'
import { AnimatePresence } from "framer-motion";
interface CustomPageProps {
  cookies: any
}

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

export default function Website({ Component, pageProps, router }: AppProps<CustomPageProps>) {
  return (
    <Chakra cookies={pageProps.cookies}>
      <Layout router={router}>
        <AnimatePresence
          exitBeforeEnter
          initial={true}
          onExitComplete={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0 })
            }
          }}
        >        
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
    </Chakra>
  )
}