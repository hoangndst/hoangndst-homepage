import * as React from 'react'
import Head from "next/head"
import { Box } from '@chakra-ui/react'

const Main = ({ }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="@hoangndst's homepage" />
        <meta name="author" content="Nguyen Dinh Hoang" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:title" content="hoangndst" />
        <meta name="twitter:card" content="summary-large-icon" />
        <meta name="twitter:site" content="@hoangndst" />
      </Head>
    </Box>
  )
}
export default Main