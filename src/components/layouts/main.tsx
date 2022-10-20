import * as React from "react"
import Head from "next/head"
import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import type { NextRouter } from "next/router"
import NavBar from "components/navbar"
import Footer from "components/footer"

export type MainProps = {
  children: React.ReactNode,
  router: NextRouter
}

const Main = ({ children, router }: MainProps) => {
  return (
    <Box as="main" pb={8}
      style={{
        backgroundColor: useColorModeValue('white', '#001e3c'),
        minHeight: '100vh'
      }}
    >
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="@hoangndst's homepage" />
        <meta name="author" content="Nguyen Dinh Hoang" />
        {/* <link rel="apple-touch-icon" href="apple-touch-icon.png" /> */}
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:title" content="hoangndst" />
        <meta name="twitter:card" content="summary-large-icon" />
        <meta name="twitter:site" content="@hoangndst" />
        <meta name="twitter:creator" content="@hoangndst" />
        <meta property="og:site-name" content="hoangndst" />
        <meta name="og:title" content="hoangndst" />
        <meta property="og:type" content="website" />
        <title>@hoangndst - Homepage</title>
      </Head>

      <NavBar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        {children}
      </Container>

      <Footer />

    </Box>
  )
}
export default Main