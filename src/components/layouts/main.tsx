import * as React from "react"
import Head from "next/head"
import { Box, Container } from '@chakra-ui/react'
import type { NextRouter } from "next/router"
import NavBar from "../navbar"

export type MainProps = {
  children: React.ReactNode,
  router: NextRouter
}

const Main = ({ children, router }: MainProps) => {
  return (
    <Box as="main" pb={8}>
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
    </Box>
  )
}
export default Main