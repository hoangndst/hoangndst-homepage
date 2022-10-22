import { Badge, Box, Flex, chakra, Container } from "@chakra-ui/react";
import EditPageButton from "./edit-page-button";
import * as React from 'react'

interface PageContainerProps {
  frontmatter: {
    slug?: string
    title: string
    description?: string
    editUrl?: string
    version?: string
  }
  children: React.ReactNode
  pagination?: React.ReactElement
}

const PageContainer = (props: PageContainerProps) => {
  const { frontmatter, pagination, children } = props
  return (
    <Box
      flex='auto'
      pt='10'
    >
      <Box maxW='48rem'>
        <chakra.h1 tabIndex={-1} outline={0} apply='mdx.h1'>
          {frontmatter.title}
        </chakra.h1>
        {frontmatter.version && (
          <Badge letterSpacing='wider'>
            v{frontmatter.version}
          </Badge>
        )}
        {children}
        <Box mt='40px'>
          <Box>
            <Box>{frontmatter.editUrl && <EditPageButton href={frontmatter.editUrl} />}</Box>
            {pagination || null}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default PageContainer